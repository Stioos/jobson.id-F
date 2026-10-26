"use client";

import * as React from "react";
import { trainingCourses, cohorts } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatNumber, timeAgo } from "@/lib/format";
import { TenantDisclaimer, ChartCard, ChartTooltip, SimulatedAiBadge } from "./_shared";
import { toast } from "sonner";
import {
  TrendingDown, AlertTriangle, Clock, Target, Download, Lightbulb, Users2,
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

interface FunnelStage { stage: string; learners: number; pct: number; dropFromPrev: number; }

function buildFunnel(course: TrainingCourse, cohortId: string): FunnelStage[] {
  const rand = rng(hashStr(course.id + cohortId));
  const enrolled = Math.max(8, cohortId === "all" ? Math.round(course.enrollments * 0.18) : (cohorts.find((c) => c.id === cohortId)?.learnerCount ?? 30));
  const completionRate = course.completionRate / 100;
  const started = Math.round(enrolled * (0.94 + rand() * 0.05));
  const q25 = Math.round(enrolled * (0.86 - rand() * 0.05));
  const q50 = Math.round(enrolled * (0.74 - rand() * 0.05));
  const q75 = Math.round(enrolled * (0.62 - rand() * 0.05));
  const completed = Math.round(enrolled * completionRate);
  const stages = [
    { stage: "Enrolled", learners: enrolled },
    { stage: "Started", learners: started },
    { stage: "25% Complete", learners: q25 },
    { stage: "50% Complete", learners: q50 },
    { stage: "75% Complete", learners: q75 },
    { stage: "Completed", learners: completed },
  ];
  return stages.map((s, i) => ({
    ...s,
    pct: enrolled > 0 ? Math.round((s.learners / enrolled) * 100) : 0,
    dropFromPrev: i === 0 ? 0 : Math.round(((stages[i - 1].learners - s.learners) / stages[i - 1].learners) * 100),
  }));
}

function moduleDropoff(course: TrainingCourse, cohortId: string) {
  const rand = rng(hashStr(course.id + cohortId) + 7);
  const modules = course.modules.length > 0
    ? course.modules
    : [{ id: "m1", title: "Introduction", order: 1, lessons: [] }, { id: "m2", title: "Core Concepts", order: 2, lessons: [] }, { id: "m3", title: "Practice & Assessment", order: 3, lessons: [] }];
  return modules.map((m, i) => {
    const decay = Math.pow(0.85, i);
    const jitter = (rand() - 0.5) * 5;
    const pct = Math.max(course.completionRate - 8, Math.round(100 * decay + jitter));
    return {
      name: m.title.length > 26 ? m.title.slice(0, 24) + "…" : m.title,
      completed: Math.min(100, pct),
      dropped: Math.max(0, 100 - Math.min(100, pct)),
    };
  });
}

function dropoffReasons(course: TrainingCourse, cohortId: string) {
  const rand = rng(hashStr(course.id + cohortId) + 13);
  const total = 100;
  const tooLong = Math.round(18 + rand() * 10);
  const difficult = Math.round(16 + rand() * 10);
  const boring = Math.round(12 + rand() * 8);
  const noTime = Math.round(22 + rand() * 10);
  const technical = Math.round(8 + rand() * 6);
  const other = Math.max(2, total - tooLong - difficult - boring - noTime - technical);
  return [
    { reason: "No time / workload", value: noTime, color: "#10b981" },
    { reason: "Too long", value: tooLong, color: "#14b8a6" },
    { reason: "Too difficult", value: difficult, color: "#f59e0b" },
    { reason: "Not engaging", value: boring, color: "#f97316" },
    { reason: "Technical issues", value: technical, color: "#ef4444" },
    { reason: "Other", value: other, color: "#94a3b8" },
  ];
}

function dropoffTrendByCohort(course: TrainingCourse) {
  const rand = rng(hashStr(course.id) + 19);
  return cohorts
    .filter((c) => c.courseId === course.id)
    .concat(cohorts.slice(0, 4))
    .slice(0, 5)
    .map((c, i) => {
      const completion = Math.max(40, Math.min(96, course.completionRate + (rand() - 0.5) * 20 - i * 2));
      return {
        cohort: c.name.split(" — ")[0].slice(0, 14),
        completion: Math.round(completion),
        dropoff: Math.round(100 - completion),
      };
    });
}

function dropoffBySegment(course: TrainingCourse, cohortId: string) {
  const rand = rng(hashStr(course.id + cohortId) + 29);
  const departments = ["Engineering", "Sales", "HR", "Operations", "Finance"];
  const baseDrop = 100 - course.completionRate;
  return departments.map((d) => ({
    name: d,
    dropoff: Math.max(5, Math.min(60, Math.round(baseDrop + (rand() - 0.5) * 18))),
  }));
}

interface AtRiskLearner {
  name: string; client: string; progress: number; lastActive: string; days: number; reason: string;
}

function atRiskLearners(course: TrainingCourse, cohortId: string): AtRiskLearner[] {
  const rand = rng(hashStr(course.id + cohortId) + 37);
  const names = [
    "Aditya Kapoor", "Bhavna Rao", "Chetan Gupta", "Deepika Menon", "Esha Agarwal",
    "Farhan Syed", "Gauri Patil", "Harish Bose", "Ishaan Verma", "Jaya Krishnan",
  ];
  const clients = ["TechCorp India", "FinEdge Solutions", "MediCore Health", "EduVerse Learning", "GreenLeaf Energy"];
  const reasons = ["Stuck on module 2", "No activity post-enrollment", "Failed assessment, not retaken", "Skipped 2 live sessions", "Hasn't opened course in 9 days"];
  return names.slice(0, 8 + Math.floor(rand() * 3)).map((n, i) => {
    const days = 7 + Math.floor(rand() * 18);
    return {
      name: n,
      client: clients[i % clients.length],
      progress: Math.round(10 + rand() * 60),
      lastActive: new Date(Date.now() - days * 86400000).toISOString(),
      days,
      reason: reasons[i % reasons.length],
    };
  }).sort((a, b) => b.days - a.days);
}

interface Recommendation {
  title: string; description: string; impact: "high" | "medium" | "low"; effort: "low" | "medium" | "high";
}

function recommendations(course: TrainingCourse, funnel: FunnelStage[]): Recommendation[] {
  const biggestStage = funnel.slice(1).reduce((max, s) => (s.dropFromPrev > max.dropFromPrev ? s : max), funnel[1]);
  const recs: Recommendation[] = [];
  if (biggestStage) {
    recs.push({
      title: `Intervene at "${biggestStage.stage}"`,
      description: `Biggest drop-off is here (${biggestStage.dropFromPrev}% of learners leave). Add a checkpoint reminder or micro-reward just before this stage.`,
      impact: "high",
      effort: "low",
    });
  }
  if (course.durationMinutes > 1500) {
    recs.push({
      title: "Break into shorter micro-modules",
      description: `Course is ${Math.round(course.durationMinutes / 60)}h long. Learners with "no time" drop off most. Consider 15-min micro-lessons with progress bookmarks.`,
      impact: "high",
      effort: "medium",
    });
  }
  recs.push({
    title: "Auto-nudge inactive learners at day 5",
    description: "At-risk learners go silent for 7+ days before flagging. Trigger a manager + learner nudge at day 5 of inactivity.",
    impact: "medium",
    effort: "low",
  });
  recs.push({
    title: "Add a \u201ctry again\u201d path for failed assessments",
    description: "Learners who fail an assessment and don't retake show 3\u00d7 drop-off. Offer a focused remediation path before retake.",
    impact: "medium",
    effort: "medium",
  });
  return recs;
}

const FUNNEL_COLORS = ["#10b981", "#14b8a6", "#0d9488", "#f59e0b", "#f97316", "#ef4444"];

export function TrainingDropoffAnalytics() {
  const publishedCourses = React.useMemo(() => trainingCourses.filter((c) => c.status === "published"), []);
  const [courseId, setCourseId] = React.useState<string>(publishedCourses[0]?.id ?? "");
  const [cohortId, setCohortId] = React.useState<string>("all");

  const course = publishedCourses.find((c) => c.id === courseId) ?? publishedCourses[0];

  const courseCohorts = React.useMemo(
    () => cohorts.filter((c) => c.courseId === courseId),
    [courseId]
  );

  function exportReport() {
    if (!course) return;
    toast.success("Drop-off analytics exported", {
      description: `${course.code} · Cohort: ${cohortId === "all" ? "All" : cohortId}`,
    });
  }

  if (!course) {
    return (
      <div className="space-y-5">
        <PageHeader title="Drop-off Analytics" description="Funnel, drop-off reasons, at-risk learners, and AI recommendations." icon={<Icon name="BarChart3" className="h-6 w-6" />} />
        <EmptyState icon={<Icon name="Filter" className="h-6 w-6" />} title="No published courses" description="Publish a course to view drop-off analytics." />
      </div>
    );
  }

  const funnel = buildFunnel(course, cohortId);
  const modules = moduleDropoff(course, cohortId);
  const reasons = dropoffReasons(course, cohortId);
  const trend = dropoffTrendByCohort(course);
  const segments = dropoffBySegment(course, cohortId);
  const atRisk = atRiskLearners(course, cohortId);
  const recs = recommendations(course, funnel);

  const overallCompletion = funnel[funnel.length - 1]?.pct ?? 0;
  const biggestStage = funnel.slice(1).reduce((max, s) => (s.dropFromPrev > max.dropFromPrev ? s : max), funnel[1]);
  const avgDropPct = Math.round(funnel.reduce((s, x) => s + x.dropFromPrev, 0) / Math.max(1, funnel.length - 1));
  const timeToDrop = Math.round(course.durationMinutes * 0.35); // estimate: learners drop ~35% into the course

  return (
    <div className="space-y-5">
      <PageHeader
        title="Drop-off Analytics"
        description="Funnel analysis, drop-off reasons, at-risk learners, and simulated-AI recommendations to improve completion."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: exportReport }]}
      />
      <TenantDisclaimer />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Course:</span>
        <Select value={courseId} onValueChange={(v) => { setCourseId(v); setCohortId("all"); }}>
          <SelectTrigger className="h-9 w-[320px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {publishedCourses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.code} · {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm font-medium ml-2">Cohort:</span>
        <Select value={cohortId} onValueChange={setCohortId}>
          <SelectTrigger className="h-9 w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All enrollments</SelectItem>
            {courseCohorts.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name.split(" — ")[0]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall Completion" value={`${overallCompletion}%`} icon={<Target className="h-5 w-5" />} tone="success" hint="Completed ÷ enrolled" />
        <StatCard label="Avg Drop-off / Stage" value={`${avgDropPct}%`} icon={<TrendingDown className="h-5 w-5" />} tone="warning" hint="Mean stage-to-stage loss" />
        <StatCard label="Biggest Drop Stage" value={biggestStage?.stage ?? "—"} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint={`${biggestStage?.dropFromPrev ?? 0}% lost here`} />
        <StatCard label="Avg Time to Drop" value={`${Math.floor(timeToDrop / 60)}h ${timeToDrop % 60}m`} icon={<Clock className="h-5 w-5" />} hint="Est. elapsed at drop point" />
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">Metric formulas:</span> Overall completion = completed ÷ enrolled × 100 · Avg drop-off / stage = mean of stage-to-stage loss % · Biggest drop stage = stage with max dropFromPrev · Time-to-drop is an estimate (course duration × 0.35) — actual value requires per-learner event tracking.
      </p>

      {/* Funnel + Reasons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Conversion Funnel" description="Enrolled → Started → 25% → 50% → 75% → Completed">
          <div className="space-y-3">
            {funnel.map((s, i) => {
              const width = i === 0 ? 100 : Math.round((s.learners / funnel[0].learners) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.stage}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(s.learners)} learners · <span className="font-medium text-foreground">{s.pct}%</span>
                      {i > 0 && <span className="ml-2 text-rose-600 dark:text-rose-400">−{s.dropFromPrev}%</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-7 w-full overflow-hidden rounded-md bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-md px-2 text-xs font-medium text-white transition-all"
                      style={{ width: `${width}%`, background: FUNNEL_COLORS[i % FUNNEL_COLORS.length] }}
                    >
                      {width >= 12 ? `${width}%` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Each bar's width is relative to the Enrolled stage. Red percentages are stage-to-stage drop-off.</p>
        </SectionCard>

        <ChartCard title="Drop-off Reasons" description="Self-reported + inferred reasons (illustrative)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={reasons} dataKey="value" nameKey="reason" cx="50%" cy="50%" innerRadius={45} outerRadius={90} paddingAngle={2}>
                {reasons.map((r, i) => <Cell key={i} fill={r.color} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Module drop-off + trend + segment */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Drop-off by Module" description="% of learners who completed each module">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modules} margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" angle={-12} height={56} textAnchor="end" />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" name="Completed %" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dropped" name="Dropped %" stackId="a" fill="#fecaca" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Drop-off Trend by Cohort" description="Completion % and drop-off % across cohorts (illustrative)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="cohort" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="completion" name="Completion %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} />
              <Line type="monotone" dataKey="dropoff" name="Drop-off %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Drop-off by Learner Segment" description="Drop-off % by department (illustrative)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segments}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis domain={[0, 60]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
            <Bar dataKey="dropoff" name="Drop-off %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* At-risk learners + recommendations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="At-Risk Learners" description="In-progress but inactive 7+ days — intervene now">
          <div className="max-h-96 overflow-y-auto scroll-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Inactive</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRisk.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No at-risk learners.</TableCell></TableRow>
                ) : atRisk.map((l, i) => (
                  <TableRow key={`${l.name}-${i}`}>
                    <TableCell>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.client}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={l.progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{l.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-rose-600 dark:text-rose-400">{l.days}d</Badge>
                      <div className="text-[10px] text-muted-foreground">{timeAgo(l.lastActive)}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard
          title="Simulated AI Recommendations"
          description="Actionable suggestions to reduce drop-off"
          action={<SimulatedAiBadge />}
        >
          <div className="space-y-3">
            {recs.map((r, i) => (
              <div key={i} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{r.title}</p>
                      <Badge variant="outline" className={
                        r.impact === "high" ? "text-emerald-600 dark:text-emerald-400" :
                        r.impact === "medium" ? "text-amber-600 dark:text-amber-400" :
                        "text-muted-foreground"
                      }>{r.impact} impact</Badge>
                      <Badge variant="outline" className={
                        r.effort === "low" ? "text-emerald-600 dark:text-emerald-400" :
                        r.effort === "medium" ? "text-amber-600 dark:text-amber-400" :
                        "text-rose-600 dark:text-rose-400"
                      }>{r.effort} effort</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              <Users2 className="mr-1 inline h-3.5 w-3.5" />
              Recommendations are heuristic, not learned from a model — treat as a starting point for review with the trainer and account manager.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
