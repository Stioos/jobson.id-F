"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import {
  trainingCompany, corporateClients, trainingCourses, learningPaths,
  cohorts, liveSessions, trainers, learnerEnrollments, trainingInvoices,
} from "@/lib/lms-data";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency, formatNumber, formatDate, daysUntil, timeAgo } from "@/lib/format";
import { ChartCard, ChartTooltip, CHART_COLORS as COLORS, TenantDisclaimer, durationLabel } from "./_shared";
import {
  Handshake, Users, BookOpen, GraduationCap, Banknote, Star,
  Video, AlertTriangle, ArrowUpRight, Calendar, Plus, Sparkles,
} from "lucide-react";

export function TrainingOverview() {
  const { navigate, user } = useNav();
  const company = trainingCompany;

  const activeClients = corporateClients.filter((c) => c.status === "active" || c.status === "trial");
  const learnersTrained = corporateClients.reduce((s, c) => s + c.employeesEnrolled, 0);
  const activeCohorts = cohorts.filter((c) => c.status === "active" || c.status === "upcoming");
  const publishedCourses = trainingCourses.filter((c) => c.status === "published");
  const revenueYTD = trainingInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const avgRating = trainingCourses.reduce((s, c) => s + c.rating, 0) / trainingCourses.length;

  // 6-month enrollment trend (synthetic)
  const enrollmentTrend = [
    { month: "May", enrollments: 420, completions: 280 },
    { month: "Jun", enrollments: 510, completions: 340 },
    { month: "Jul", enrollments: 640, completions: 410 },
    { month: "Aug", enrollments: 720, completions: 480 },
    { month: "Sep", enrollments: 880, completions: 560 },
    { month: "Oct", enrollments: 1020, completions: 640 },
  ];

  const learnersByClient = corporateClients.map((c) => ({
    name: c.name.split(" ")[0],
    learners: c.employeesEnrolled,
  }));

  const categoryDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    publishedCourses.forEach((c) => {
      map[c.category] = (map[c.category] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [publishedCourses]);

  const complianceCompletion = [
    { name: "DPDP Act", value: 90 },
    { name: "ISO 27001", value: 95 },
    { name: "RBI Localization", value: 96 },
    { name: "Healthcare Privacy", value: 66 },
  ];

  const upcomingSessions = liveSessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const renewalsDue = corporateClients
    .filter((c) => c.status !== "expired")
    .map((c) => ({ ...c, daysToRenewal: daysUntil(c.renewalDate) }))
    .filter((c) => c.daysToRenewal <= 90)
    .sort((a, b) => a.daysToRenewal - b.daysToRenewal);

  const quickActions = [
    { label: "Add client", icon: Handshake, route: "clients" as const },
    { label: "Create course", icon: BookOpen, route: "course-builder" as const },
    { label: "Schedule session", icon: Video, route: "live-training" as const },
    { label: "Issue certificate", icon: GraduationCap, route: "certifications" as const },
    { label: "Run AI analysis", icon: Sparkles, route: "skill-gaps" as const },
    { label: "Generate invoice", icon: Banknote, route: "invoices" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "Divya"} 👋`}
        description={`${company.name} — corporate training operations dashboard.`}
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[
          { label: "Course Builder", icon: "BookOpen", variant: "outline", onClick: () => navigate("training", "course-builder") },
          { label: "Add Client", icon: "Plus", onClick: () => navigate("training", "clients") },
        ]}
      />

      <TenantDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active Clients" value={activeClients.length} icon={<Handshake className="h-5 w-5" />} tone="brand" hint={`of ${corporateClients.length} total`} />
        <StatCard label="Learners Trained" value={formatNumber(learnersTrained)} icon={<Users className="h-5 w-5" />} delta={{ value: "12% YoY", positive: true }} />
        <StatCard label="Active Cohorts" value={activeCohorts.length} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Courses Published" value={publishedCourses.length} icon={<BookOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Revenue (YTD)" value={formatCurrency(revenueYTD)} icon={<Banknote className="h-5 w-5" />} tone="success" delta={{ value: "18% YoY", positive: true }} />
        <StatCard label="Avg Rating" value={avgRating.toFixed(2)} icon={<Star className="h-5 w-5" />} tone="warning" hint={`${company.reviewCount} reviews`} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Enrollment Trend" description="Last 6 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="enrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cmpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke="#10b981" strokeWidth={2} fill="url(#enrGrad)" />
              <Area type="monotone" dataKey="completions" name="Completions" stroke="#14b8a6" strokeWidth={2} fill="url(#cmpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course Categories" description="Distribution by domain">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Learners by Client" description="Active enrolled employees" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={learnersByClient} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={80} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="learners" name="Learners" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Compliance Completion" description="Active tracks by client">
          <ul className="space-y-3">
            {complianceCompletion.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className={c.value >= 90 ? "text-emerald-600 dark:text-emerald-400" : c.value >= 75 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}>
                    {c.value}%
                  </span>
                </div>
                <Progress value={c.value} className="mt-1.5 h-1.5" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Active cohorts + Upcoming sessions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Active Cohorts"
          description="In-progress training batches"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("training", "cohorts")}>View all</Button>}
        >
          {activeCohorts.length === 0 ? (
            <EmptyState icon={<GraduationCap className="h-5 w-5" />} title="No active cohorts" />
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {activeCohorts.map((c) => (
                <li key={c.id} className="rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.clientName} · {c.learnerCount} learners · {c.schedule}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={c.status} />
                      <p className="mt-1 text-xs text-muted-foreground">{c.progress}% done</p>
                    </div>
                  </div>
                  <Progress value={c.progress} className="mt-2 h-1.5" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Upcoming Live Sessions"
          description="Next on the calendar"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("training", "live-training")}>View all</Button>}
        >
          {upcomingSessions.length === 0 ? (
            <EmptyState icon={<Video className="h-5 w-5" />} title="No upcoming sessions" />
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {upcomingSessions.map((s) => (
                <li key={s.id} className="flex items-start gap-3 rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <span className="text-[10px] font-medium uppercase">{formatDate(s.date, { month: "short" })}</span>
                    <span className="text-sm font-bold leading-none">{new Date(s.date).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.startTime} · {durationLabel(s.durationMinutes)} · {s.trainerName}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Renewal alerts + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-amber-500/30">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Renewals Due (90 days)
              </CardTitle>
              <CardDescription className="mt-1">Plan outreach & renewal proposals</CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate("training", "contracts")}>View contracts</Button>
          </CardHeader>
          <CardContent>
            {renewalsDue.length === 0 ? (
              <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="No renewals due" />
            ) : (
              <ul className="space-y-2">
                {renewalsDue.slice(0, 5).map((c) => {
                  const overdue = c.daysToRenewal < 0;
                  const urgent = c.daysToRenewal >= 0 && c.daysToRenewal <= 30;
                  return (
                    <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <AvatarLogo text={c.logo} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(c.contractValue)} · {c.assignedAccountManager}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={overdue ? "text-xs font-semibold text-rose-600 dark:text-rose-400" : urgent ? "text-xs font-semibold text-amber-600 dark:text-amber-400" : "text-xs text-muted-foreground"}>
                          {overdue ? `${Math.abs(c.daysToRenewal)}d overdue` : `${c.daysToRenewal}d left`}
                        </span>
                        <p className="text-[10px] text-muted-foreground">Renews {formatDate(c.renewalDate)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <SectionCard title="Quick Actions" description="Jump to common workflows">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => navigate("training", qa.route)}
                className="flex flex-col gap-2 rounded-lg border p-3 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <qa.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium leading-tight">{qa.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
