"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  learnerEnrollments,
  complianceTracks,
  skillGaps,
  trainingCourses,
  trainingPrograms,
  trainingBudgets,
  trainingCompany,
  corporateClients,
} from "@/lib/lms-data";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, GraduationCap, ShieldCheck, Clock, GitBranch, Wallet,
  Star, ArrowUpRight, Mail, Phone, Globe, Sparkles, Handshake,
  CheckCircle2, AlertTriangle, BookOpen, TrendingUp,
} from "lucide-react";

const CLIENT_ID = "cc_001";
const client = corporateClients.find((c) => c.id === CLIENT_ID)!;
const enrollments = learnerEnrollments.filter((e) => e.clientId === CLIENT_ID);
const programs = trainingPrograms.filter((p) => p.clientId === CLIENT_ID);
const compliance = complianceTracks.filter((c) => c.clientId === CLIENT_ID);
const gaps = skillGaps; // skillGaps is org-wide but cc_001 is the demo focus
const budgets = trainingBudgets.filter((b) => b.clientId === CLIENT_ID);

const PIE_COLORS = ["#10b981", "#14b8a6", "#f59e0b", "#8b5cf6", "#0ea5e9", "#22c55e", "#f43f5e"];

const activityTrend = [
  { week: "W1", hours: 420, learners: 180 },
  { week: "W2", hours: 540, learners: 220 },
  { week: "W3", hours: 610, learners: 260 },
  { week: "W4", hours: 720, learners: 290 },
  { week: "W5", hours: 680, learners: 270 },
  { week: "W6", hours: 820, learners: 320 },
  { week: "W7", hours: 940, learners: 360 },
  { week: "W8", hours: 1020, learners: 410 },
];

const completionByDept = [
  { dept: "Engineering", completed: 96, inProgress: 88 },
  { dept: "Product", completed: 42, inProgress: 30 },
  { dept: "Sales", completed: 35, inProgress: 20 },
  { dept: "Operations", completed: 28, inProgress: 18 },
  { dept: "HR", completed: 22, inProgress: 8 },
];

const topSkillsInProgress = [
  { skill: "React 19", learners: 184, hours: 920 },
  { skill: "Kubernetes / CKA", learners: 120, hours: 1240 },
  { skill: "DPDP Compliance", learners: 580, hours: 410 },
  { skill: "New Manager", learners: 64, hours: 540 },
  { skill: "Machine Learning", learners: 48, hours: 680 },
];

export function EmployerLdDashboard() {
  const { navigate } = useNav();

  const employeesEnrolled = client.employeesEnrolled;
  const coursesCompletedThisMonth = enrollments.filter(
    (e) => (e.status === "completed" || e.status === "certified") && e.completedDate
  ).length + 86; // mock rollup across org
  const compliantEmployees = compliance.reduce((s, c) => s + c.compliant, 0);
  const totalEmployees = compliance.reduce((s, c) => s + c.totalEmployees, 0);
  const complianceRate = totalEmployees > 0 ? Math.round((compliantEmployees / totalEmployees) * 100) : 0;
  const avgLearningHours = 14; // mock org average
  const skillGapsCount = gaps.length;

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalUsed = budgets.reduce((s, b) => s + b.used, 0);
  const budgetUtilPct = totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning & Development Dashboard"
        description={`${client.name} · Corporate L&D powered by ${trainingCompany.name}`}
        actions={[
          { label: "Request training", icon: "Plus", onClick: () => navigate("employer", "assign-learning") },
          { label: "Browse courses", icon: "BookOpen", variant: "outline", onClick: () => navigate("employer", "assign-learning") },
        ]}
      />

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Employees enrolled"
          value={formatNumber(employeesEnrolled)}
          icon={<Users className="h-5 w-5" />}
          tone="brand"
          hint={`${enrollments.length} active enrollments`}
        />
        <StatCard
          label="Courses completed (mo)"
          value={coursesCompletedThisMonth}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="success"
          delta={{ value: "18% vs last mo", positive: true }}
        />
        <StatCard
          label="Compliance rate"
          value={`${complianceRate}%`}
          icon={<ShieldCheck className="h-5 w-5" />}
          tone={complianceRate >= 90 ? "success" : "warning"}
          hint={`${compliantEmployees}/${totalEmployees} employees`}
        />
        <StatCard
          label="Avg learning hours"
          value={`${avgLearningHours}h`}
          icon={<Clock className="h-5 w-5" />}
          delta={{ value: "2.4h vs last qtr", positive: true }}
        />
        <StatCard
          label="Skill gaps identified"
          value={skillGapsCount}
          icon={<GitBranch className="h-5 w-5" />}
          tone="warning"
          hint="AI-assisted analysis"
        />
        <StatCard
          label="Training budget used"
          value={`${budgetUtilPct}%`}
          icon={<Wallet className="h-5 w-5" />}
          tone={budgetUtilPct >= 90 ? "danger" : "default"}
          hint={`${formatCurrency(totalUsed)} of ${formatCurrency(totalAllocated)}`}
        />
      </div>

      {/* Top row charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Learning activity trend"
          description="Hours learned & active learners — last 8 weeks"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrend}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="learnersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#10b981" strokeWidth={2} fill="url(#hoursGrad)" />
                <Area type="monotone" dataKey="learners" name="Learners" stroke="#14b8a6" strokeWidth={2} fill="url(#learnersGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Compliance status" description="Across all regulations">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Compliant", value: compliance.reduce((s, c) => s + c.compliant, 0) },
                    { name: "At-risk", value: compliance.reduce((s, c) => s + c.atRisk, 0) },
                    { name: "Overdue", value: compliance.reduce((s, c) => s + c.overdue, 0) },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => navigate("employer", "compliance-training")}
          >
            View compliance <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </SectionCard>
      </div>

      {/* Mid row charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Course completion by department"
          description="Completed vs in-progress this quarter"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionByDept} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="dept" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend verticalAlign="top" height={24} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" name="In progress" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top skills in progress" description="Most-enrolled active skills">
          <div className="space-y-3 max-h-64 overflow-y-auto scroll-thin pr-1">
            {topSkillsInProgress.map((s) => {
              const maxHours = Math.max(...topSkillsInProgress.map((x) => x.hours));
              const pct = Math.round((s.hours / maxHours) * 100);
              return (
                <div key={s.skill}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{s.skill}</span>
                    <span className="text-xs text-muted-foreground">{s.learners} learners</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.hours}h total</p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Training partner + active programs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-brand/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Training partner</CardTitle>
              <Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">Active</Badge>
            </div>
            <CardDescription>Your corporate training provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <AvatarLogo text={trainingCompany.name} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{trainingCompany.name}</p>
                  {trainingCompany.verified && (
                    <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{trainingCompany.tagline}</p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{trainingCompany.rating}</span>
                  <span className="text-xs text-muted-foreground">({formatNumber(trainingCompany.reviewCount)} reviews)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border bg-muted/30 p-2">
                <p className="text-xs text-muted-foreground">Clients</p>
                <p className="text-sm font-semibold">{trainingCompany.corporateClients}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-2">
                <p className="text-xs text-muted-foreground">Learners</p>
                <p className="text-sm font-semibold">{formatNumber(trainingCompany.learnersTrained)}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-2">
                <p className="text-xs text-muted-foreground">Courses</p>
                <p className="text-sm font-semibold">{trainingCompany.coursesCount}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{trainingCompany.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{trainingCompany.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span>{trainingCompany.website}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.success("Request sent", { description: `Your SkillForge account manager ${client.assignedAccountManager} will reach out shortly.` })}
            >
              <Handshake className="mr-1.5 h-3.5 w-3.5" /> Contact account manager
            </Button>
          </CardContent>
        </Card>

        <SectionCard
          title="Active programs"
          description={`${programs.length} active training programs`}
          className="lg:col-span-2"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("employer", "training-roi")}>View ROI <ArrowUpRight className="ml-1 h-3 w-3" /></Button>}
        >
          {programs.length === 0 ? (
            <EmptyState icon={<Sparkles className="h-5 w-5" />} title="No active programs" description="Request new training from SkillForge Academy." />
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto scroll-thin">
              {programs.map((p) => {
                const completionPct = p.enrolled > 0 ? Math.round((p.completed / p.targetLearners) * 100) : 0;
                return (
                  <div key={p.id} className="rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="capitalize">{p.type}</span>
                          <span>·</span>
                          <span>{p.enrolled}/{p.targetLearners} enrolled</span>
                          <span>·</span>
                          <span>{p.completed} completed</span>
                          {p.budget && <><span>·</span><span>{formatCurrency(p.budget, p.currency)}</span></>}
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={completionPct} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium tabular-nums">{completionPct}%</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Started {formatDate(p.startDate)}</span>
                      <span>Ends {formatDate(p.endDate)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Quick actions */}
      <SectionCard title="Quick actions" description="Jump into common L&D workflows">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Assign learning", icon: GraduationCap, route: "assign-learning", tone: "bg-brand/10 text-brand" },
            { label: "Browse courses", icon: BookOpen, route: "assign-learning", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
            { label: "View compliance", icon: ShieldCheck, route: "compliance-training", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
            { label: "Analyze skill gaps", icon: GitBranch, route: "skill-gaps", tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={() => navigate("employer", qa.route)}
              className="flex items-center justify-between rounded-lg border p-4 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${qa.tone}`}>
                  <qa.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{qa.label}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Alert banner for overdue compliance */}
      {compliance.some((c) => c.status === "at_risk" || c.status === "overdue") && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Compliance attention needed</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {compliance.filter((c) => c.status === "at_risk" || c.status === "overdue").length} compliance track(s) require follow-up.
                {compliance.reduce((s, c) => s + c.overdue, 0)} employees are overdue on mandatory training.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("employer", "compliance-training")}>
              Review
            </Button>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <TrendingUp className="h-3 w-3" />
        Powered by {trainingCompany.name} · {trainingCompany.accreditation.slice(0, 2).join(" · ")}
      </p>
    </div>
  );
}
