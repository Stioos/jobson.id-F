"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
} from "recharts";
import {
  platformUsers, employers, agencies, jobs, allApplications, flaggedJobs,
  subscriptions, invoices, supportTickets, auditLogs,
} from "@/lib/mock-data";
import { useNav } from "@/lib/store";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries, SeverityBadge } from "./_shared";

export function AdminOverview() {
  const { navigate } = useNav();
  const totalUsers = platformUsers.length + 1240; // mock scale
  const totalOrgs = employers.length + agencies.length;
  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const applications30d = allApplications.length + 3120;
  const hires = allApplications.filter((a) => a.status === "hired").length + 187;
  const revenue30d = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const verifQueue = platformUsers.filter((u) => !u.verified).length + 3;
  const flaggedCount = flaggedJobs.length;

  const userGrowth = makeSeries("users", 12, 1400, 90).map((p, i) => ({ ...p, value: p.value + i * 35 }));
  const appTrend = makeSeries("apps", 14, 280, 60);
  const revenueByPlan = [
    { name: "Enterprise", value: 4500000 },
    { name: "Business", value: 799980 },
    { name: "Professional", value: 14999 },
    { name: "Starter", value: 4999 },
    { name: "Free", value: 0 },
  ];
  const activitySpark = makeSeries("act", 24, 80, 30);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const openTickets = supportTickets.filter((t) => t.status !== "resolved" && t.status !== "closed");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Platform Overview"
        description="Real-time view of platform health, growth, and items needing admin attention."
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[
          { label: "Reports", variant: "outline", onClick: () => navigate("training", "adm-reports") },
          { label: "Audit logs", variant: "outline", onClick: () => navigate("training", "adm-audit") },
        ]}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total users" value={formatNumber(totalUsers)} delta={{ value: "+3.4% MoM", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Organizations" value={formatNumber(totalOrgs)} delta={{ value: "+2 this week", positive: true }} icon={<Icon name="Building2" className="h-5 w-5" />} />
        <StatCard label="Active jobs" value={formatNumber(activeJobs)} delta={{ value: "+12 today", positive: true }} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="success" />
        <StatCard label="Applications (30d)" value={formatNumber(applications30d)} delta={{ value: "+8.1%", positive: true }} icon={<Icon name="FileText" className="h-5 w-5" />} />
        <StatCard label="Hires" value={formatNumber(hires)} delta={{ value: "+5.6%", positive: true }} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Revenue (30d)" value={formatCurrency(revenue30d)} delta={{ value: "+12.3%", positive: true }} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Verification queue" value={verifQueue} hint="Awaiting review" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Flagged content" value={flaggedCount} hint="Needs moderation" icon={<Icon name="Flag" className="h-5 w-5" />} tone="danger" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="User growth" description="Total registered users (12 weeks)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Users" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by plan" description="MRR contribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={revenueByPlan} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {revenueByPlan.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {revenueByPlan.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate text-muted-foreground">{p.name}</span>
                <span className="ml-auto font-medium">{formatCurrency(p.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Applications trend" description="Daily applications (14d)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={appTrend} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="value" name="Applications" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity (24h)" description="Hourly platform events">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activitySpark} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Events" fill={CHART_COLORS[4]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Needs attention" description="Items requiring admin review">
          <ul className="space-y-2.5 text-sm">
            <AttentionRow icon="ShieldCheck" tone="warning" label="Verification queue" value={`${verifQueue} pending`} onClick={() => navigate("training", "adm-verification")} />
            <AttentionRow icon="Flag" tone="danger" label="Flagged jobs" value={`${flaggedCount} open`} onClick={() => navigate("training", "adm-job-moderation")} />
            <AttentionRow icon="Receipt" tone="danger" label="Overdue invoices" value={`${overdueInvoices.length} unpaid`} onClick={() => navigate("training", "adm-invoices")} />
            <AttentionRow icon="LifeBuoy" tone="warning" label="Open support tickets" value={`${openTickets.length} open`} onClick={() => navigate("training", "adm-support")} />
            <AttentionRow icon="CreditCard" tone="danger" label="Failed payments" value="2 today" onClick={() => navigate("training", "adm-payments")} />
          </ul>
        </SectionCard>
      </div>

      {/* Recent activity */}
      <SectionCard title="Recent activity" description="Audit log feed (latest events)" action={<Button variant="ghost" size="sm" onClick={() => navigate("training", "adm-audit")}>View all</Button>}>
        <ul className="max-h-96 divide-y overflow-y-auto scroll-thin">
          {[...auditLogs].reverse().map((log) => (
            <li key={log.id} className="flex items-start gap-3 py-3">
              <AvatarLogo text={log.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{log.actor}</span>{" "}
                  <span className="text-muted-foreground">{log.details}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {log.action} · {log.resource} · {log.ip} · {timeAgo(log.timestamp)}
                </p>
              </div>
              <SeverityBadge severity={log.severity} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function AttentionRow({ icon, tone, label, value, onClick }: { icon: string; tone: "warning" | "danger"; label: string; value: string; onClick: () => void }) {
  const toneCls = tone === "warning" ? "bg-amber-500/10 text-amber-600 dark:text-amber-300" : "bg-rose-500/10 text-rose-600 dark:text-rose-300";
  return (
    <li>
      <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-muted/60">
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${toneCls}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <span className="flex-1 text-sm">{label}</span>
        <Badge variant="outline" className="font-semibold">{value}</Badge>
      </button>
    </li>
  );
}
