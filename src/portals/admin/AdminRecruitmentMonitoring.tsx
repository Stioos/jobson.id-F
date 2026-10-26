"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { allApplications, jobs, employers } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/format";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries } from "./_shared";

export function AdminRecruitmentMonitoring() {
  const appVolume = makeSeries("apps", 14, 320, 90);
  const funnel = [
    { stage: "Applied", value: 4820 },
    { stage: "Viewed", value: 3120 },
    { stage: "Shortlisted", value: 980 },
    { stage: "Assessment", value: 540 },
    { stage: "Interview", value: 312 },
    { stage: "Offer", value: 187 },
    { stage: "Hired", value: 142 },
  ];
  const topEmployers = [...employers]
    .map((e) => ({ name: e.name, value: jobs.filter((j) => j.employerName === e.name).reduce((s, j) => s + j.applicationCount, 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const categories = [
    { name: "Engineering", value: 1820 },
    { name: "Sales", value: 920 },
    { name: "Design", value: 410 },
    { name: "Product", value: 580 },
    { name: "Operations", value: 720 },
  ];
  const anomalies = [
    { label: "Application spike (FinEdge)", detail: "+340% applications on 1 job in 24h", severity: "warning" as const },
    { label: "Drop-off anomaly", detail: "MediCore: 88% drop between shortlist → interview", severity: "warning" as const },
    { label: "Duplicate candidate", detail: "Same PAN across 3 accounts detected", severity: "critical" as const },
    { label: "Avg. time-to-hire rising", detail: "+2.1 days vs last 30d", severity: "info" as const },
  ];
  const liveFeed = allApplications.slice(0, 8);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recruitment Monitoring"
        description="Platform-wide hiring metrics, funnel, anomalies, and live activity."
        icon={<Icon name="Eye" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Applications (30d)" value={formatNumber(4820)} delta="+8.1%" icon="FileText" />
        <Stat label="Avg. time-to-hire" value="24.6 days" delta="+2.1d" deltaPositive={false} icon="Clock" />
        <Stat label="Offer rate" value="3.9%" delta="+0.4pp" icon="Send" />
        <Stat label="Active recruiters" value="186" delta="+12" icon="Users2" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Application volume (14d)" description="Daily applications across platform" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={appVolume} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="value" name="Applications" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Hiring funnel" description="Conversion through stages (30d).">
          <ul className="space-y-2">
            {funnel.map((s, i) => {
              const pct = i === 0 ? 100 : Math.round((s.value / funnel[0].value) * 100);
              return (
                <li key={s.stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.stage}</span>
                    <span className="text-muted-foreground">{formatNumber(s.value)} · {pct}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Top employers by applications" description="Top 6 employers (30d)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEmployers} layout="vertical" margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Applications" fill={CHART_COLORS[0]} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top job categories" description="By application volume">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {categories.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <SectionCard title="Anomaly detection" description="Automated signals (mock).">
          <ul className="space-y-2">
            {anomalies.map((a) => (
              <li key={a.label} className="rounded-md border p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{a.label}</span>
                  <Badge variant="outline" className={
                    a.severity === "critical" ? "text-rose-600 border-rose-500/20" :
                    a.severity === "warning" ? "text-amber-600 border-amber-500/20" : ""
                  }>{a.severity}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Live activity feed" description="Real-time application events (mock).">
        <ul className="max-h-80 divide-y overflow-y-auto scroll-thin">
          {liveFeed.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2.5">
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate"><span className="font-medium">{a.candidateName}</span> applied to <span className="font-medium">{a.jobTitle}</span></p>
                <p className="text-xs text-muted-foreground">{a.employerName} · {timeAgo(a.appliedAt)}</p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value, delta, deltaPositive = true, icon }: { label: string; value: string; delta?: string; deltaPositive?: boolean; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {delta && <p className={`mt-1 text-xs font-medium ${deltaPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{deltaPositive ? "▲" : "▼"} {delta}</p>}
    </div>
  );
}
