"use client";

import * as React from "react";
import { trainingCourses, corporateClients } from "@/lib/lms-data";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import {
  Activity, Clock, BookOpen, Users, Flame, Heart, Download, Trophy,
} from "lucide-react";

// ---------- deterministic helpers ----------
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) + 1;
}
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dailyActive(range: string, clientFilter: string) {
  const rand = rng(hashStr(range + clientFilter));
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 30;
  // For 90d, downsample to weekly buckets for readability
  const out: { day: string; active: number; sessions: number }[] = [];
  const baseActive = clientFilter === "all" ? 540 : 180;
  if (days <= 30) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      // Weekday vs weekend
      const wd = d.getDay();
      const weekend = wd === 0 || wd === 6 ? 0.55 : 1;
      const noise = 0.7 + rand() * 0.5;
      const active = Math.round(baseActive * weekend * noise);
      out.push({ day: label, active, sessions: Math.round(active * (1.6 + rand() * 0.8)) });
    }
  } else {
    // weekly buckets
    const weeks = Math.ceil(days / 7);
    for (let i = weeks - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 7 * 86400000);
      const label = `W${weeks - i}`;
      const noise = 0.75 + rand() * 0.5;
      const active = Math.round(baseActive * 5 * noise);
      out.push({ day: label, active, sessions: Math.round(active * 1.8) });
    }
  }
  return out;
}

function engagementByHour(clientFilter: string) {
  const rand = rng(hashStr("hourly-" + clientFilter) + 11);
  return Array.from({ length: 24 }, (_, h) => {
    // Peak: 9-12 and 19-22 (IST work + evening learning)
    let weight = 0.3;
    if (h >= 9 && h <= 12) weight = 0.9;
    else if (h >= 14 && h <= 17) weight = 0.7;
    else if (h >= 19 && h <= 22) weight = 1.0;
    else if (h >= 7 && h <= 8) weight = 0.5;
    else if (h >= 13 && h <= 13) weight = 0.6;
    const noise = 0.85 + rand() * 0.3;
    const count = Math.round(420 * weight * noise);
    return { hour: `${h.toString().padStart(2, "0")}`, count };
  });
}

function engagementByDevice(clientFilter: string) {
  const rand = rng(hashStr("device-" + clientFilter) + 23);
  const desktop = Math.round(55 + rand() * 15);
  const mobile = Math.round(25 + rand() * 12);
  const tablet = Math.max(2, 100 - desktop - mobile);
  return [
    { name: "Desktop", value: desktop, color: "#10b981" },
    { name: "Mobile", value: mobile, color: "#14b8a6" },
    { name: "Tablet", value: tablet, color: "#f59e0b" },
  ];
}

function streaksDistribution(clientFilter: string) {
  const rand = rng(hashStr("streaks-" + clientFilter) + 31);
  return [
    { bucket: "1 day", count: Math.round(420 + rand() * 100) },
    { bucket: "3 days", count: Math.round(280 + rand() * 80) },
    { bucket: "7 days", count: Math.round(180 + rand() * 60) },
    { bucket: "14 days", count: Math.round(90 + rand() * 40) },
    { bucket: "30+ days", count: Math.round(35 + rand() * 25) },
  ];
}

function topContent() {
  return [...trainingCourses]
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 6)
    .map((c) => ({
      name: c.name.length > 32 ? c.name.slice(0, 30) + "…" : c.name,
      views: c.enrollments + Math.round(c.ratingCount * 0.6),
    }));
}

function heatmap(clientFilter: string): number[][] {
  // 7 days × 24 hours, values 0-1
  const rand = rng(hashStr("heat-" + clientFilter) + 41);
  const grid: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    const weekend = d >= 5 ? 0.6 : 1;
    for (let h = 0; h < 24; h++) {
      let weight = 0.15;
      if (h >= 9 && h <= 12) weight = 0.85;
      else if (h >= 14 && h <= 17) weight = 0.65;
      else if (h >= 19 && h <= 22) weight = 0.95;
      else if (h >= 7 && h <= 8) weight = 0.45;
      const noise = 0.7 + rand() * 0.5;
      row.push(Math.min(1, weight * weekend * noise));
    }
    grid.push(row);
  }
  return grid;
}

function leaderboardData(clientFilter: string) {
  const rand = rng(hashStr("lb-" + clientFilter) + 51);
  // Combine real learner names with synthetic
  const names = [
    "Priya Nair", "Arjun Iyer", "Kavya Reddy", "Vikram Singh", "Sahil Khan",
    "Karthik Menon", "Divya Sharma", "Aisha Verma", "Rohan Das", "Nisha Pillai",
  ];
  const clients = ["TechCorp India", "FinEdge Solutions", "MediCore Health", "EduVerse Learning"];
  return names.map((name, i) => {
    const points = Math.round(4800 - i * 280 + (rand() - 0.5) * 150);
    const streak = Math.round(30 - i * 2.5 + (rand() - 0.5) * 4);
    return {
      rank: i + 1,
      name,
      client: clients[i % clients.length],
      points,
      streak: Math.max(1, streak),
      lessons: Math.round(48 - i * 3 + (rand() - 0.5) * 4),
    };
  });
}

function heatColor(v: number): string {
  // emerald ramp
  if (v < 0.1) return "rgba(16,185,129,0.06)";
  if (v < 0.25) return "rgba(16,185,129,0.18)";
  if (v < 0.45) return "rgba(16,185,129,0.35)";
  if (v < 0.65) return "rgba(16,185,129,0.55)";
  if (v < 0.85) return "rgba(16,185,129,0.78)";
  return "rgba(16,185,129,0.95)";
}

export function TrainingEngagementAnalytics() {
  const [range, setRange] = React.useState("30d");
  const [clientFilter, setClientFilter] = React.useState("all");

  const daily = React.useMemo(() => dailyActive(range, clientFilter), [range, clientFilter]);
  const hourly = React.useMemo(() => engagementByHour(clientFilter), [clientFilter]);
  const devices = React.useMemo(() => engagementByDevice(clientFilter), [clientFilter]);
  const streaks = React.useMemo(() => streaksDistribution(clientFilter), [clientFilter]);
  const top = React.useMemo(() => topContent(), []);
  const heat = React.useMemo(() => heatmap(clientFilter), [clientFilter]);
  const leaderboard = React.useMemo(() => leaderboardData(clientFilter), [clientFilter]);

  // KPIs (synthesized)
  const rand = React.useMemo(() => rng(hashStr(range + clientFilter) + 7), [range, clientFilter]);
  const activeLearners = daily.reduce((s, d) => s + d.active, 0);
  const uniqueActive = Math.round(activeLearners / (range === "7d" ? 1.6 : range === "30d" ? 4.5 : 12));
  const mauBase = clientFilter === "all" ? 4200 : 900;
  const dauAvg = Math.round(daily.reduce((s, d) => s + d.active, 0) / Math.max(1, daily.length));
  const dauMau = Math.round((dauAvg / mauBase) * 100);
  const avgSession = Math.round(16 + rand() * 12);
  const avgLessons = Number((3.5 + rand() * 2.5).toFixed(1));
  const streakLeaders = streaks.filter((s) => s.bucket === "14 days" || s.bucket === "30+ days").reduce((s, x) => s + x.count, 0);
  const contentEngagement = Math.round(62 + rand() * 22);

  function exportReport() {
    toast.success("Engagement analytics exported", {
      description: `Range: ${range} · Client: ${clientFilter === "all" ? "All clients" : corporateClients.find((c) => c.id === clientFilter)?.name}`,
    });
  }

  const hourlyMax = Math.max(...hourly.map((h) => h.count));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Engagement Analytics"
        description="How learners interact with content — daily activity, peak hours, devices, streaks, and a 7×24 heatmap."
        icon={<Icon name="Heart" className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: exportReport }]}
      />
      <TenantDisclaimer />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Range:</span>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last quarter</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm font-medium ml-2">Client:</span>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="DAU / MAU Ratio" value={`${dauMau}%`} icon={<Activity className="h-5 w-5" />} tone="brand" hint="Stickiness indicator" />
        <StatCard label="Avg Session Time" value={`${avgSession}m`} icon={<Clock className="h-5 w-5" />} tone="success" hint="Per active session" />
        <StatCard label="Avg Lessons / Week" value={avgLessons.toString()} icon={<BookOpen className="h-5 w-5" />} tone="warning" hint="Per active learner" />
        <StatCard label="Active Learners" value={formatNumber(uniqueActive)} icon={<Users className="h-5 w-5" />} hint={`In last ${range}`} />
        <StatCard label="Streak Leaders" value={formatNumber(streakLeaders)} icon={<Flame className="h-5 w-5" />} tone="brand" hint="14+ day streaks" />
        <StatCard label="Content Engagement" value={`${contentEngagement}%`} icon={<Heart className="h-5 w-5" />} tone="success" hint="Active / enrolled" />
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">Metric formulas:</span> DAU/MAU = avg daily active ÷ monthly active × 100 (stickiness; 20%+ is healthy) · Active learners are unique users with ≥1 session in the range · Streak = consecutive days with learning activity · Content engagement = active learners ÷ enrolled learners (estimate).
      </p>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Active Learners Trend" description={`Daily active learners over selected range (${range})`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" minTickGap={20} />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="active" name="Active learners" stroke="#10b981" strokeWidth={2} fill="url(#actGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Engagement by Hour" description="When learners are most active (IST, 24h)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} className="text-xs" interval={2} />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="count" name="Active sessions" radius={[3, 3, 0, 0]}>
                {hourly.map((h, i) => (
                  <Cell key={i} fill={h.count === hourlyMax ? "#10b981" : h.count >= hourlyMax * 0.7 ? "#14b8a6" : "#5eead4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Engagement by Device" description="Session count by device type">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2}>
                {devices.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Learning Streaks Distribution" description="Learners by current streak bucket">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={streaks}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="bucket" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="count" name="Learners" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Content" description="Most-viewed courses (enrollments + view estimates)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={130} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="views" name="Views" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Heatmap */}
      <SectionCard title="Engagement Heatmap" description="Day × hour grid — darker = more active sessions">
        <div className="overflow-x-auto scroll-thin">
          <div className="min-w-[680px]">
            {/* Hour header */}
            <div className="flex items-center">
              <div className="w-10 shrink-0" />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">{h.toString().padStart(2, "0")}</div>
              ))}
            </div>
            {/* Rows */}
            {heat.map((row, d) => (
              <div key={d} className="flex items-center">
                <div className="w-10 shrink-0 text-xs text-muted-foreground">{DAYS[d]}</div>
                {row.map((v, h) => (
                  <div key={h} className="flex-1 p-0.5">
                    <div
                      className="h-6 rounded-sm transition-transform hover:scale-110"
                      style={{ background: heatColor(v) }}
                      title={`${DAYS[d]} ${h.toString().padStart(2, "0")}:00 — ${Math.round(v * 100)}% intensity`}
                    />
                  </div>
                ))}
              </div>
            ))}
            {/* Legend */}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Low</span>
              {[0.08, 0.25, 0.45, 0.65, 0.85, 1].map((v) => (
                <div key={v} className="h-3 w-6 rounded-sm" style={{ background: heatColor(v) }} />
              ))}
              <span>High</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Leaderboard */}
      <SectionCard title="Engagement Leaderboard" description="Top 10 most-engaged learners by points (illustrative)">
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Rank</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Streak</TableHead>
                <TableHead className="text-right">Lessons</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No engagement data.</TableCell></TableRow>
              ) : leaderboard.map((l) => (
                <TableRow key={l.name}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {l.rank <= 3 ? (
                        <Trophy className={`h-4 w-4 ${l.rank === 1 ? "text-amber-500" : l.rank === 2 ? "text-slate-400" : "text-orange-600"}`} />
                      ) : null}
                      <span className="font-semibold">{l.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="text-muted-foreground">{l.client}</TableCell>
                  <TableCell className="text-right font-semibold">{formatNumber(l.points)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="gap-1"><Flame className="h-3 w-3 text-amber-500" />{l.streak}d</Badge>
                  </TableCell>
                  <TableCell className="text-right">{l.lessons}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Points are synthesized from sessions, completions, streaks, and live-session attendance (illustrative).</p>
      </SectionCard>
    </div>
  );
}
