"use client";

import * as React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, Cell,
} from "recharts";
import { Briefcase, Send, CalendarCheck, Handshake, Coins, Star, ArrowRight } from "lucide-react";
import { useNav, useAuth } from "@/lib/store";
import { PageHeader, StatCard, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/format";
import {
  requisitions, submissions, placements, recruiterTasks,
  submissionsTrend, placementFunnel, topClients,
} from "@/lib/portal-data";

const CHART_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#a855f7"];

export function RecruiterOverview() {
  const { navigate } = useNav();
  const { user } = useAuth();

  const activeReqs = requisitions.filter((r) => r.status === "open").length;
  const submittedCount = submissions.length;
  const interviewsScheduled = submissions.filter((s) => s.status === "interviewed").length;
  const placementsMonth = placements.length;
  const commissionEarned = placements.reduce((acc, p) => acc + p.commissionAmount, 0);
  const satisfaction = 4.6;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Sneha"}`}
        description="Your sourcing & placement dashboard for TalentBridge Consulting."
        actions={[
          { label: "Source candidates", onClick: () => navigate("recruiter", "candidates") },
          { label: "Add requisition", variant: "outline", onClick: () => navigate("recruiter", "requisitions") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Active requisitions" value={activeReqs} icon={<Briefcase className="h-5 w-5" />} tone="brand" hint="Across 4 clients" />
        <StatCard label="Submissions" value={submittedCount} icon={<Send className="h-5 w-5" />} tone="default" delta={{ value: "+18% MoM", positive: true }} />
        <StatCard label="Interviews" value={interviewsScheduled} icon={<CalendarCheck className="h-5 w-5" />} tone="default" hint="Scheduled this week" />
        <StatCard label="Placements (mo)" value={placementsMonth} icon={<Handshake className="h-5 w-5" />} tone="success" delta={{ value: "+1 vs last mo", positive: true }} />
        <StatCard label="Commission earned" value={formatCurrency(commissionEarned)} icon={<Coins className="h-5 w-5" />} tone="brand" hint="YTD (gross)" />
        <StatCard label="Client satisfaction" value={`${satisfaction} ★`} icon={<Star className="h-5 w-5" />} tone="warning" hint="Avg across clients" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Submissions trend"
          description="Last 10 months — submissions vs interviews vs placements"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionsTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} fill="url(#gSub)" />
                <Area type="monotone" dataKey="interviews" stroke="#0ea5e9" strokeWidth={2} fill="url(#gInt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Placement funnel" description="Sourced → Placed conversion">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementFunnel} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {placementFunnel.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Top clients"
          description="By placements & revenue (YTD)"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("recruiter", "clients")}>View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}
        >
          <ul className="divide-y">
            {topClients.map((c) => (
              <li key={c.client} className="flex items-center gap-3 py-3">
                <AvatarLogo text={c.client} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.client}</p>
                  <p className="text-xs text-muted-foreground">{c.placements} placements · {formatCurrency(c.revenue)}</p>
                </div>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (c.placements / 8) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Today's tasks"
          description="Follow-ups & scheduled actions"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("recruiter", "submissions")}>Open pipeline</Button>}
          className="lg:col-span-2"
        >
          <ul className="divide-y">
            {recruiterTasks.map((t) => (
              <li key={t.id} className="flex items-start gap-3 py-3">
                <div className="mt-0.5">
                  <span className={`inline-flex h-2 w-2 rounded-full ${t.priority === "urgent" ? "bg-rose-500" : t.priority === "high" ? "bg-amber-500" : "bg-slate-400"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Due {t.dueIn} · {t.client}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success("Task marked complete", { description: t.label })}>
                  Done
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Quick actions"
        description="Jump to common recruiter workflows"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Source candidates", icon: "Search", route: "candidates" },
            { label: "New submission", icon: "Send", route: "submissions" },
            { label: "Track placements", icon: "Handshake", route: "placements" },
            { label: "Reconcile commissions", icon: "Coins", route: "commissions" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => navigate("recruiter", a.route)}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon name={a.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{a.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Open workflow</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Recent activity"
        description="Latest submissions & placement updates"
      >
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <ul className="divide-y">
            {[...submissions]
              .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
              .slice(0, 8)
              .map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <AvatarLogo text={s.candidateName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {s.candidateName} → {s.clientName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.jobTitle} · submitted {timeAgo(s.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}
