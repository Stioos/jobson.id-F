"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { employers, jobs, employerJobsExtra, allApplications, interviews } from "@/lib/mock-data";
import { PageHeader, StatCard, SectionCard, StatusBadge, MatchScore, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Card as UCard } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatDate, timeAgo } from "@/lib/format";
import { Briefcase, Users, Calendar, Gift, Clock, TrendingUp, Plus, KanbanSquare, ArrowUpRight, Sparkles, AlertCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const employer = employers[0];
const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === employer.id);
const EMPLOYER_APPS = allApplications.filter((a) => EMPLOYER_JOBS.some((j) => j.id === a.jobId));

const stageData = [
  { stage: "Applied", count: EMPLOYER_APPS.length },
  { stage: "Screening", count: EMPLOYER_APPS.filter((a) => ["viewed", "shortlisted"].includes(a.status)).length },
  { stage: "Assessment", count: EMPLOYER_APPS.filter((a) => a.status === "assessment").length },
  { stage: "Interview", count: EMPLOYER_APPS.filter((a) => a.status === "interview").length },
  { stage: "Offer", count: EMPLOYER_APPS.filter((a) => a.status === "offer").length },
  { stage: "Hired", count: EMPLOYER_APPS.filter((a) => a.status === "hired").length },
];

const applicationsTrend = [
  { day: "Mon", apps: 12 },
  { day: "Tue", apps: 18 },
  { day: "Wed", apps: 9 },
  { day: "Thu", apps: 24 },
  { day: "Fri", apps: 16 },
  { day: "Sat", apps: 6 },
  { day: "Sun", apps: 4 },
];

const funnelColors = ["#10b981", "#14b8a6", "#f59e0b", "#8b5cf6", "#0ea5e9", "#22c55e"];

export function EmployerOverview() {
  const { navigate } = useNav();

  const activeJobs = EMPLOYER_JOBS.filter((j) => j.status === "published").length;
  const totalApps = EMPLOYER_APPS.length;
  const interviewsThisWeek = interviews.filter((i) => {
    const d = new Date(i.scheduledAt).getTime();
    const now = Date.now();
    return d >= now && d <= now + 7 * 86400000;
  }).length;
  const openOffers = 1;

  const jobsNeedingAttention = EMPLOYER_JOBS.filter((j) => j.status === "pending_approval" || j.status === "draft" || (j.applicationCount > 50 && j.status === "published"));
  const recentApplicants = [...EMPLOYER_APPS].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()).slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, Rohan`}
        description={`${employer.name} hiring dashboard — ${formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long" })}`}
        actions={[
          { label: "Post a job", icon: "Plus", onClick: () => navigate("employer", "create-job") },
          { label: "View pipeline", icon: "KanbanSquare", variant: "outline", onClick: () => navigate("employer", "pipeline") },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active jobs" value={activeJobs} icon={<Briefcase className="h-5 w-5" />} tone="brand" hint={`${EMPLOYER_JOBS.length} total`} />
        <StatCard label="Total applicants" value={formatNumber(totalApps)} icon={<Users className="h-5 w-5" />} delta={{ value: "12% vs last week", positive: true }} />
        <StatCard label="Interviews this week" value={interviewsThisWeek} icon={<Calendar className="h-5 w-5" />} tone="warning" />
        <StatCard label="Open offers" value={openOffers} icon={<Gift className="h-5 w-5" />} tone="success" />
        <StatCard label="Time-to-hire" value="34 days" icon={<Clock className="h-5 w-5" />} delta={{ value: "3d faster", positive: true }} />
        <StatCard label="Offer acceptance" value="87%" icon={<TrendingUp className="h-5 w-5" />} tone="success" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Applications over time" description="Last 7 days" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationsTrend}>
                <defs>
                  <linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="apps" stroke="#10b981" strokeWidth={2} fill="url(#appsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Hiring funnel" description="Stage-by-stage conversion">
          <div className="space-y-3 max-h-64 overflow-y-auto scroll-thin pr-1">
            {stageData.map((s, i) => {
              const max = Math.max(...stageData.map((x) => x.count), 1);
              const pct = Math.round((s.count / max) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.stage}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: funnelColors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Jobs needing attention + recent applicants */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Jobs needing attention"
          description="Pending approvals, drafts, high-volume roles"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("employer", "jobs")}>View all</Button>}
        >
          {jobsNeedingAttention.length === 0 ? (
            <EmptyState icon={<AlertCircle className="h-5 w-5" />} title="All caught up" description="No jobs need attention right now." />
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {jobsNeedingAttention.map((j) => (
                <div key={j.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{j.department} · {j.location} · {j.applicationCount} applicants</p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent applicants"
          description="Newest applications across your jobs"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("employer", "applicants")}>View all</Button>}
        >
          <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {recentApplicants.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                <AvatarLogo text={a.candidateName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.candidateName}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.jobTitle} · {timeAgo(a.appliedAt)}</p>
                </div>
                <MatchScore score={a.matchScore} />
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Quick actions */}
      <SectionCard title="Quick actions" description="Jump into common workflows">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Post a job", icon: Plus, route: "create-job" },
            { label: "View pipeline", icon: KanbanSquare, route: "pipeline" },
            { label: "Search talent", icon: Sparkles, route: "talent-search" },
            { label: "Review applicants", icon: Users, route: "applicants" },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={() => navigate("employer", qa.route)}
              className="flex items-center justify-between rounded-lg border p-4 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <qa.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{qa.label}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
