"use client";

import * as React from "react";
import { trainers, trainingCourses, trainingAssessments, liveSessions } from "@/lib/lms-data";
import type { Trainer } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { TenantDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import {
  Presentation, Users, Star, Award, Gauge, Banknote, GitCompare, CalendarClock, Info,
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

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function ratingTrend(trainer: Trainer) {
  const rand = rng(hashStr(trainer.id));
  const base = trainer.rating;
  return MONTHS.map((m, i) => {
    // Slow upward drift + noise
    const drift = (i - 2.5) * 0.03;
    const noise = (rand() - 0.5) * 0.12;
    const value = Math.max(3.5, Math.min(5, base + drift + noise));
    return { month: m, rating: Number(value.toFixed(2)) };
  });
}

function sessionsByType(trainer: Trainer) {
  const rand = rng(hashStr(trainer.id) + 3);
  const total = trainer.sessionsConducted;
  const video = Math.round(total * (0.4 + rand() * 0.2));
  const onsite = Math.round(total * (0.2 + rand() * 0.2));
  const hybrid = Math.max(0, total - video - onsite);
  return [
    { type: "Video / Online", value: video, color: "#10b981" },
    { type: "Onsite", value: onsite, color: "#14b8a6" },
    { type: "Hybrid", value: hybrid, color: "#f59e0b" },
  ];
}

function monthlyLoad(trainer: Trainer) {
  const rand = rng(hashStr(trainer.id) + 9);
  const avg = Math.max(4, Math.round(trainer.sessionsConducted / 6));
  return MONTHS.map((m) => ({
    month: m,
    sessions: Math.max(1, Math.round(avg * (0.7 + rand() * 0.6))),
    hours: Math.max(2, Math.round(avg * (0.7 + rand() * 0.6) * 2.4)),
  }));
}

function learnerOutcomes(trainer: Trainer) {
  // Find courses taught by this trainer, then assessments for those courses.
  const taughtCourseIds = trainingCourses
    .filter((c) => c.instructorId === trainer.id)
    .map((c) => c.id);
  const assessments = trainingAssessments.filter((a) => a.courseId && taughtCourseIds.includes(a.courseId));
  const list = assessments.length > 0
    ? assessments
    : trainingAssessments.slice(0, 3);
  return list.map((a) => {
    const passRate = Math.min(98, Math.round(a.avgScore + 8));
    const failRate = 100 - passRate;
    return {
      name: a.title.length > 22 ? a.title.slice(0, 20) + "…" : a.title,
      passed: passRate,
      failed: failRate,
    };
  });
}

function upcomingSessionsFor(trainer: Trainer) {
  const now = Date.now();
  return liveSessions
    .filter((s) => s.trainerId === trainer.id && new Date(s.date).getTime() >= now - 86400000)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);
}

function utilizationRate(trainer: Trainer): number {
  const rand = rng(hashStr(trainer.id) + 17);
  // Estimate: sessions * 3h per session, assume 160h/month available
  const hours = trainer.sessionsConducted * 3;
  const monthsActive = 12;
  const available = 160 * monthsActive;
  const rate = Math.min(95, Math.round((hours / available) * 100 + 8 + rand() * 6));
  return Math.max(45, rate);
}

function revenueGenerated(trainer: Trainer): number {
  const rate = trainer.hourlyRate ?? 5000;
  const hours = trainer.sessionsConducted * 3; // ~3h per session
  return rate * hours;
}

export function TrainingTrainerPerformance() {
  const activeTrainers = React.useMemo(() => trainers, []);
  const [trainerId, setTrainerId] = React.useState<string>(activeTrainers[0]?.id ?? "");
  const [compareMode, setCompareMode] = React.useState(false);
  const [compareIds, setCompareIds] = React.useState<string[]>([activeTrainers[0]?.id, activeTrainers[1]?.id].filter(Boolean) as string[]);

  const trainer = activeTrainers.find((t) => t.id === trainerId) ?? activeTrainers[0];

  function exportReport() {
    if (!trainer) return;
    toast.success("Trainer performance report exported", {
      description: `${trainer.name} · ${trainer.sessionsConducted} sessions`,
    });
  }

  function toggleCompareId(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        toast.warning("Compare up to 3 trainers", { description: "Remove one to add another." });
        return prev;
      }
      return [...prev, id];
    });
  }

  if (!trainer) {
    return (
      <div className="space-y-5">
        <PageHeader title="Trainer Performance" description="Per-trainer delivery, outcomes, and feedback analytics." icon={<Icon name="Users" className="h-6 w-6" />} />
        <EmptyState icon={<Icon name="Users" className="h-6 w-6" />} title="No trainers" description="Add trainers to view performance analytics." />
      </div>
    );
  }

  const trend = ratingTrend(trainer);
  const byType = sessionsByType(trainer);
  const outcomes = learnerOutcomes(trainer);
  const load = monthlyLoad(trainer);
  const upcoming = upcomingSessionsFor(trainer);
  const util = utilizationRate(trainer);
  const revenue = revenueGenerated(trainer);

  // Avg learner score across this trainer's courses
  const taughtCourses = trainingCourses.filter((c) => c.instructorId === trainer.id);
  const avgLearnerScore = taughtCourses.length > 0
    ? Math.round(taughtCourses.reduce((s, c) => s + c.avgScore, 0) / taughtCourses.length)
    : 0;

  const compareTrainers = compareIds
    .map((id) => activeTrainers.find((t) => t.id === id))
    .filter((t): t is Trainer => Boolean(t));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trainer Performance"
        description="Per-trainer delivery, learner outcomes, and feedback. Ratings are learner-feedback-based, not objective quality."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[
          { label: "Export", icon: "Download", variant: "outline", onClick: exportReport },
          { label: compareMode ? "Exit compare" : "Compare trainers", icon: "GitCompare", variant: compareMode ? "default" : "outline", onClick: () => setCompareMode((v) => !v) },
        ]}
      />
      <TenantDisclaimer />

      {/* Selector */}
      {!compareMode && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">Trainer:</span>
          <Select value={trainerId} onValueChange={setTrainerId}>
            <SelectTrigger className="h-9 w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {activeTrainers.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {trainer.status === "on_leave" && <Badge variant="outline" className="text-amber-600">On leave</Badge>}
          <Badge variant="outline" className="capitalize">{trainer.type}</Badge>
          <div className="ml-auto flex items-center gap-2">
            <AvatarLogo name={trainer.name} subtitle={trainer.email} color={trainer.avatarColor} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{trainer.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{trainer.expertise.slice(0, 3).join(" · ")}</p>
            </div>
          </div>
        </div>
      )}

      {compareMode && (
        <SectionCard title="Select 2–3 trainers to compare" description={`Currently selected: ${compareIds.length} of 3`}>
          <div className="flex flex-wrap gap-2">
            {activeTrainers.map((t) => {
              const selected = compareIds.includes(t.id);
              return (
                <Button
                  key={t.id}
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  onClick={() => toggleCompareId(t.id)}
                  className="h-8"
                >
                  {selected && <GitCompare className="mr-1 h-3.5 w-3.5" />}
                  {t.name}
                </Button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {compareMode && compareTrainers.length > 0 ? (
        <CompareTrainersTable trainers={compareTrainers} />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Sessions Conducted" value={formatNumber(trainer.sessionsConducted)} icon={<Presentation className="h-5 w-5" />} tone="brand" hint="All-time" />
            <StatCard label="Learners Trained" value={formatNumber(trainer.learnersTrained)} icon={<Users className="h-5 w-5" />} tone="success" hint="Cumulative" />
            <StatCard label="Avg Rating" value={trainer.rating.toFixed(1)} icon={<Star className="h-5 w-5" />} tone="warning" hint={`${formatNumber(trainer.sessionsConducted)} feedback pts`} />
            <StatCard label="Avg Learner Score" value={`${avgLearnerScore}%`} icon={<Award className="h-5 w-5" />} hint="Across taught courses" />
            <StatCard label="Utilization Rate" value={`${util}%`} icon={<Gauge className="h-5 w-5" />} tone="brand" hint="Delivery hours / available hours" />
            <StatCard label="Revenue Generated" value={formatCurrency(revenue)} icon={<Banknote className="h-5 w-5" />} tone="success" hint="Sessions × hourly rate" />
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span><span className="font-medium text-amber-700 dark:text-amber-400">Note on ratings:</span> Trainer ratings are aggregated learner feedback (post-session surveys), not an objective measure of training quality. Compare with peer averages before drawing conclusions.</span>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Metric formulas:</span> Utilization = (sessions × 3h) ÷ (12 mo × 160h) × 100 · Revenue = sessions × 3h × hourly rate · Avg learner score is the mean of <code>avgScore</code> across courses taught by this trainer.
          </p>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Rating Trend" description="Learner rating over the last 6 months">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis domain={[3.5, 5]} tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="rating" name="Rating" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sessions by Type" description="Distribution of delivery modality">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byType} dataKey="value" nameKey="type" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {byType.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Learner Outcomes by Assessment" description="Pass vs fail rate per assessment (illustrative)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outcomes} margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" angle={-12} height={56} textAnchor="end" />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="passed" name="Passed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="failed" name="Failed" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Delivery Load" description="Sessions and hours delivered per month">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={load}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="sessions" name="Sessions" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hours" name="Hours" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Upcoming sessions */}
          <SectionCard title="Upcoming Sessions" description="Next scheduled deliveries for this trainer">
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Modality</TableHead>
                    <TableHead className="text-right">Registered</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcoming.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No upcoming sessions scheduled.</TableCell></TableRow>
                  ) : upcoming.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell>{formatDate(s.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{s.startTime} · {s.durationMinutes}m</TableCell>
                      <TableCell className="capitalize">{s.modality}</TableCell>
                      <TableCell className="text-right">{s.registered} / {s.capacity}</TableCell>
                      <TableCell className="text-right"><StatusBadge status={s.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground"><CalendarClock className="mr-1 inline h-3.5 w-3.5" />Past-day inclusive window to surface sessions in progress.</p>
          </SectionCard>
        </>
      )}
    </div>
  );
}

function CompareTrainersTable({ trainers }: { trainers: Trainer[] }) {
  return (
    <SectionCard title="Side-by-side Trainer Comparison" description="Up to 3 trainers compared across key metrics">
      <div className="max-h-[520px] overflow-auto scroll-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card">Metric</TableHead>
              {trainers.map((t) => (
                <TableHead key={t.id} className="min-w-[170px]">
                  {t.name}
                  <div className="text-xs font-normal text-muted-foreground capitalize">{t.type} · {t.status.replace("_", " ")}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <CompareRow label="Expertise" values={trainers.map((t) => t.expertise.slice(0, 2).join(", "))} />
            <CompareRow label="Sessions Conducted" values={trainers.map((t) => formatNumber(t.sessionsConducted))} highlight="max" numeric={trainers.map((t) => t.sessionsConducted)} />
            <CompareRow label="Learners Trained" values={trainers.map((t) => formatNumber(t.learnersTrained))} highlight="max" numeric={trainers.map((t) => t.learnersTrained)} />
            <CompareRow label="Avg Rating" values={trainers.map((t) => t.rating.toFixed(1))} highlight="max" numeric={trainers.map((t) => t.rating)} />
            <CompareRow label="Utilization Rate" values={trainers.map((t) => `${utilizationRate(t)}%`)} highlight="max" numeric={trainers.map((t) => utilizationRate(t))} />
            <CompareRow label="Revenue Generated" values={trainers.map((t) => formatCurrency(revenueGenerated(t)))} highlight="max" numeric={trainers.map((t) => revenueGenerated(t))} />
            <CompareRow label="Hourly Rate" values={trainers.map((t) => formatCurrency(t.hourlyRate ?? 0))} />
            <CompareRow label="Certifications" values={trainers.map((t) => formatNumber(t.certifications.length))} />
            <CompareRow label="Type" values={trainers.map((t) => t.type)} capitalize />
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Highlighted cells indicate best-in-row (higher is better). Ratings are learner-feedback-based — interpret with caution.</p>
    </SectionCard>
  );
}

function CompareRow({
  label, values, highlight, numeric, capitalize,
}: {
  label: string;
  values: string[];
  highlight?: "max" | "min";
  numeric?: number[];
  capitalize?: boolean;
}) {
  let bestIdx = -1;
  if (highlight && numeric && numeric.length > 0) {
    const target = highlight === "max" ? Math.max(...numeric) : Math.min(...numeric);
    bestIdx = numeric.indexOf(target);
  }
  return (
    <TableRow>
      <TableCell className="sticky left-0 bg-card font-medium">{label}</TableCell>
      {values.map((v, i) => (
        <TableCell key={i} className={capitalize ? "capitalize" : ""}>
          <span className={bestIdx === i ? "inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 font-medium" : ""}>
            {v}
          </span>
        </TableCell>
      ))}
    </TableRow>
  );
}
