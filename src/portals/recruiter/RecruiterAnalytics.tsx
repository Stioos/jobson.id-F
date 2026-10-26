"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Funnel, FunnelChart, LabelList, PieChart, Pie, Cell,
} from "recharts";
import { BarChart3, TrendingUp, Clock, IndianRupee, Download } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { recruiterLeaderboard, placementFunnel, commissionTrend, recruiterRecords } from "@/lib/portal-data";

const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#a855f7"];

export function RecruiterAnalytics() {
  const [range, setRange] = React.useState("30d");

  const totalSubs = recruiterRecords.reduce((a, r) => a + r.submissions, 0);
  const totalPlacements = recruiterRecords.reduce((a, r) => a + r.placements, 0);
  const totalRevenue = recruiterRecords.reduce((a, r) => a + r.revenue, 0);
  const avgConversion = ((totalPlacements / totalSubs) * 100).toFixed(1);
  const avgTimeToSubmit = 4.2; // days (mock)
  const interviewConversion = ((placementFunnel[3].value / placementFunnel[1].value) * 100).toFixed(1);
  const placementConversion = ((placementFunnel[5].value / placementFunnel[1].value) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productivity analytics"
        description="Recruiter productivity, conversion rates, and revenue trends."
        actions={[
          { label: "Export report", variant: "outline", onClick: () => toast.success("Export started", { description: "recruiter-analytics.csv" }) },
        ]}
      />

      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Range:</span>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last quarter</SelectItem>
            <SelectItem value="ytd">YTD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
        <StatCard label="Submissions" value={totalSubs} icon={<BarChart3 className="h-5 w-5" />} tone="brand" hint="Σ submissions per recruiter" delta={{ value: "+12%", positive: true }} />
        <StatCard label="Interview conv." value={`${interviewConversion}%`} icon={<TrendingUp className="h-5 w-5" />} tone="default" hint="= interviewed ÷ submitted × 100" />
        <StatCard label="Placement conv." value={`${placementConversion}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint="= placed ÷ submitted × 100" />
        <StatCard label="Avg time-to-submit" value={`${avgTimeToSubmit}d`} icon={<Clock className="h-5 w-5" />} tone="warning" hint="= Σ days req-open→first-submit ÷ N" delta={{ value: "-0.8d", positive: true }} />
        <StatCard label="Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" hint="Σ commission earned" delta={{ value: "+18%", positive: true }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recruiter productivity" description="Submissions vs placements per recruiter">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruiterLeaderboard} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.015 165)" interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="submissions" name="Submissions" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placements" name="Placements" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Conversion funnel" description="Sourced → Placed (last 90 days)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Funnel dataKey="value" data={placementFunnel} isAnimationActive>
                  <LabelList position="right" fill="oklch(0.5 0.015 165)" stroke="none" dataKey="stage" fontSize={11} />
                  <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={12} fontWeight={700} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Revenue trend" description="Monthly commission earned (₹). Formula: Σ commissionAmount per month.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={commissionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
              <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), "Revenue"]}
              />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Recruiter leaderboard" description="By revenue (YTD)" className="lg:col-span-2">
          <ol className="space-y-2">
            {recruiterLeaderboard.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-500/20 text-amber-700" : i === 1 ? "bg-slate-400/20 text-slate-600" : i === 2 ? "bg-orange-500/20 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <AvatarLogo text={r.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.submissions} submissions · {r.placements} placements · {r.conversion}% conv.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(r.revenue)}</p>
                  <Badge variant="outline" className="text-[10px]">{r.placements} placed</Badge>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Submissions mix" description="By status">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: "Submitted", value: 145 },
                  { name: "Shortlisted", value: 68 },
                  { name: "Interviewed", value: 34 },
                  { name: "Offered", value: 12 },
                  { name: "Placed", value: 8 },
                ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={36} outerRadius={64} paddingAngle={2}>
                  {[...COLORS, "#94a3b8"].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {[
              { name: "Submitted", value: 145, color: "#10b981" },
              { name: "Shortlisted", value: 68, color: "#0ea5e9" },
              { name: "Interviewed", value: 34, color: "#f59e0b" },
              { name: "Offered", value: 12, color: "#f43f5e" },
              { name: "Placed", value: 8, color: "#a855f7" },
            ].map((s) => (
              <li key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
