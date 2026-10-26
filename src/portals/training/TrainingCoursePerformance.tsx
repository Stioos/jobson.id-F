"use client";

import * as React from "react";
import { trainingCourses, learnerEnrollments } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatNumber, formatCurrency } from "@/lib/format";
import { TenantDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import {
  Users, Target, Award, Star, TrendingDown, Clock, GitCompare,
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

function monthlyTrend(course: TrainingCourse) {
  const rand = rng(hashStr(course.id));
  const monthlyAvg = Math.max(8, Math.round(course.enrollments / 6));
  return MONTHS.map((m) => {
    const variance = 0.7 + rand() * 0.6;
    const enrolled = Math.round(monthlyAvg * variance);
    const completed = Math.round(enrolled * (course.completionRate / 100) * (0.8 + rand() * 0.4));
    return { month: m, enrolled, completed };
  });
}

function scoreDistribution(course: TrainingCourse) {
  const avg = course.avgScore || 75;
  const low = Math.max(2, Math.round((100 - avg) / 14));
  const med = Math.max(4, Math.round((100 - avg) / 7));
  const good = Math.max(8, Math.round(avg / 4));
  const excellent = Math.max(4, Math.round(avg / 3));
  return [
    { bucket: "0-40", count: low, color: "#ef4444" },
    { bucket: "41-60", count: med, color: "#f59e0b" },
    { bucket: "61-80", count: good, color: "#14b8a6" },
    { bucket: "81-100", count: excellent, color: "#10b981" },
  ];
}

function moduleDropoff(course: TrainingCourse) {
  const rand = rng(hashStr(course.id) + 7);
  const modules = course.modules.length > 0
    ? course.modules
    : [{ id: "m1", title: "Introduction", order: 1, lessons: [] }, { id: "m2", title: "Core Concepts", order: 2, lessons: [] }, { id: "m3", title: "Practice & Assessment", order: 3, lessons: [] }];
  const base = 100;
  return modules.map((m, i) => {
    // Decreasing completion % per module
    const decay = Math.pow(0.86, i);
    const jitter = (rand() - 0.5) * 6;
    const pct = Math.max(course.completionRate - 5, Math.round(base * decay + jitter));
    return {
      name: m.title.length > 28 ? m.title.slice(0, 26) + "…" : m.title,
      completed: Math.min(100, pct),
    };
  });
}

function ratingBreakdown(course: TrainingCourse) {
  const rating = course.rating || 4.5;
  const rc = course.ratingCount || 100;
  let p5: number, p4: number, p3: number, p2: number;
  if (rating >= 4.8) { p5 = 0.72; p4 = 0.20; p3 = 0.05; p2 = 0.02; }
  else if (rating >= 4.5) { p5 = 0.58; p4 = 0.30; p3 = 0.08; p2 = 0.03; }
  else { p5 = 0.42; p4 = 0.34; p3 = 0.16; p2 = 0.06; }
  const r5 = Math.round(rc * p5);
  const r4 = Math.round(rc * p4);
  const r3 = Math.round(rc * p3);
  const r2 = Math.round(rc * p2);
  const r1 = Math.max(0, rc - r5 - r4 - r3 - r2);
  return [
    { stars: "5★", count: r5, color: "#10b981" },
    { stars: "4★", count: r4, color: "#14b8a6" },
    { stars: "3★", count: r3, color: "#f59e0b" },
    { stars: "2★", count: r2, color: "#f97316" },
    { stars: "1★", count: r1, color: "#ef4444" },
  ];
}

interface TopLearner { name: string; score: number; progress: number; status: string; client?: string; }

function topLearnersForCourse(course: TrainingCourse): TopLearner[] {
  const real: TopLearner[] = learnerEnrollments
    .filter((e) => e.courseId === course.id && e.score !== undefined)
    .map((e) => ({ name: e.learnerName, score: e.score as number, progress: e.progress, status: e.status, client: e.clientName }));
  const synthNames = ["Aisha Verma", "Rohan Das", "Nisha Pillai", "Karan Malhotra", "Sneha Subramanian", "Imran Sheikh"];
  const rand = rng(hashStr(course.id) + 13);
  const synth: TopLearner[] = synthNames.map((n, i) => ({
    name: n,
    score: Math.min(100, Math.round((course.avgScore + 10) - i * 3 + (rand() - 0.5) * 4)),
    progress: 100,
    status: "certified",
    client: ["TechCorp India", "FinEdge Solutions", "MediCore Health"][i % 3],
  }));
  return [...synth, ...real].sort((a, b) => b.score - a.score).slice(0, 8);
}

function durationLabel(mins: number): string {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function TrainingCoursePerformance() {
  const publishedCourses = React.useMemo(() => trainingCourses.filter((c) => c.status === "published"), []);
  const [courseId, setCourseId] = React.useState<string>(publishedCourses[0]?.id ?? "");
  const [compareMode, setCompareMode] = React.useState(false);
  const [compareIds, setCompareIds] = React.useState<string[]>([publishedCourses[0]?.id, publishedCourses[1]?.id].filter(Boolean) as string[]);

  const course = publishedCourses.find((c) => c.id === courseId) ?? publishedCourses[0];

  function exportReport() {
    if (!course) return;
    toast.success("Course performance report exported", {
      description: `${course.code} · ${course.name}`,
    });
  }

  function toggleCompareId(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        toast.warning("Compare up to 3 courses", { description: "Remove one to add another." });
        return prev;
      }
      return [...prev, id];
    });
  }

  if (!course) {
    return (
      <div className="space-y-5">
        <PageHeader title="Course Performance" description="Deep-dive analytics for individual courses." icon={<Icon name="BarChart3" className="h-6 w-6" />} />
        <EmptyState icon={<Icon name="BookOpen" className="h-6 w-6" />} title="No published courses" description="Publish a course to view performance analytics." />
      </div>
    );
  }

  const trend = monthlyTrend(course);
  const scores = scoreDistribution(course);
  const modules = moduleDropoff(course);
  const ratings = ratingBreakdown(course);
  const topLearners = topLearnersForCourse(course);
  const dropoffRate = Math.max(0, 100 - course.completionRate);
  const timeToComplete = Math.round(course.durationMinutes * 1.4);

  const compareCourses = compareIds
    .map((id) => publishedCourses.find((c) => c.id === id))
    .filter((c): c is TrainingCourse => Boolean(c));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Performance"
        description="Per-course deep-dive: enrollment trends, score distribution, drop-off, ratings, and top learners."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[
          { label: "Export", icon: "Download", variant: "outline", onClick: exportReport },
          { label: compareMode ? "Exit compare" : "Compare courses", icon: "GitCompare", variant: compareMode ? "default" : "outline", onClick: () => setCompareMode((v) => !v) },
        ]}
      />
      <TenantDisclaimer />

      {/* Selector */}
      {!compareMode && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Course:</span>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="h-9 w-[320px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {publishedCourses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.code} · {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-2">{course.category}</Badge>
          <Badge variant="outline" className="capitalize">{course.difficulty}</Badge>
        </div>
      )}

      {compareMode && (
        <SectionCard
          title="Select 2–3 courses to compare"
          description={`Currently selected: ${compareIds.length} of 3`}
        >
          <div className="flex flex-wrap gap-2">
            {publishedCourses.map((c) => {
              const selected = compareIds.includes(c.id);
              return (
                <Button
                  key={c.id}
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  onClick={() => toggleCompareId(c.id)}
                  className="h-8"
                >
                  {selected && <GitCompare className="mr-1 h-3.5 w-3.5" />}
                  {c.code}
                </Button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Compare view */}
      {compareMode && compareCourses.length > 0 ? (
        <CompareTable courses={compareCourses} />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Enrollments" value={formatNumber(course.enrollments)} icon={<Users className="h-5 w-5" />} tone="brand" hint="All-time enrolled" />
            <StatCard label="Completion Rate" value={`${course.completionRate}%`} icon={<Target className="h-5 w-5" />} tone="success" hint="Completed / enrolled" />
            <StatCard label="Avg Score" value={`${course.avgScore}%`} icon={<Award className="h-5 w-5" />} tone="warning" hint="Across all attempts" />
            <StatCard label="Avg Rating" value={course.rating.toFixed(1)} icon={<Star className="h-5 w-5" />} tone="brand" hint={`${formatNumber(course.ratingCount)} ratings`} />
            <StatCard label="Drop-off Rate" value={`${dropoffRate}%`} icon={<TrendingDown className="h-5 w-5" />} tone="danger" hint="1 − completion rate" />
            <StatCard label="Time to Complete" value={durationLabel(timeToComplete)} icon={<Clock className="h-5 w-5" />} hint="Median elapsed time" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Metric formulas:</span> Completion rate = certified+completed ÷ enrolled · Drop-off rate = (1 − completion) × 100 · Time-to-complete is a median estimate based on course duration × 1.4 (learner pacing factor).
          </p>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Enrollment & Completion Trend" description="Monthly enrollment vs completion over 6 months (illustrative)">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="enrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cmpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="enrolled" name="Enrolled" stroke="#10b981" strokeWidth={2} fill="url(#enrGrad)" />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#14b8a6" strokeWidth={2} fill="url(#cmpGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Score Distribution" description="Learner count by score bucket">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scores}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="bucket" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="count" name="Learners" radius={[4, 4, 0, 0]}>
                    {scores.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Module-level Drop-off" description="% of enrolled learners who completed each module">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modules} layout="vertical" margin={{ left: 20, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={120} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="completed" name="Completed %" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Rating Breakdown" description={`${formatNumber(course.ratingCount)} ratings · avg ${course.rating.toFixed(1)}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ratings} dataKey="count" nameKey="stars" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {ratings.map((r, i) => <Cell key={i} fill={r.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Top learners */}
          <SectionCard title="Top Learners" description="Highest-scoring learners in this course">
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Learner</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topLearners.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No scored attempts yet.</TableCell></TableRow>
                  ) : topLearners.map((l, i) => (
                    <TableRow key={`${l.name}-${i}`}>
                      <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell className="text-muted-foreground">{l.client ?? "—"}</TableCell>
                      <TableCell className="text-right font-semibold">{l.score}%</TableCell>
                      <TableCell className="text-right">{l.progress}%</TableCell>
                      <TableCell className="text-right"><StatusBadge status={l.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}

function CompareTable({ courses }: { courses: TrainingCourse[] }) {
  return (
    <SectionCard title="Side-by-side Course Comparison" description="Up to 3 courses compared across key metrics">
      <div className="max-h-[480px] overflow-auto scroll-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card">Metric</TableHead>
              {courses.map((c) => (
                <TableHead key={c.id} className="min-w-[160px]">{c.code}<div className="text-xs font-normal text-muted-foreground line-clamp-1">{c.name}</div></TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <CompareRow label="Category" values={courses.map((c) => c.category)} />
            <CompareRow label="Difficulty" values={courses.map((c) => c.difficulty)} capitalize />
            <CompareRow label="Duration" values={courses.map((c) => durationLabel(c.durationMinutes))} />
            <CompareRow label="Enrollments" values={courses.map((c) => formatNumber(c.enrollments))} />
            <CompareRow label="Completion Rate" values={courses.map((c) => `${c.completionRate}%`)} highlight="max" numeric={courses.map((c) => c.completionRate)} />
            <CompareRow label="Avg Score" values={courses.map((c) => `${c.avgScore}%`)} highlight="max" numeric={courses.map((c) => c.avgScore)} />
            <CompareRow label="Avg Rating" values={courses.map((c) => c.rating.toFixed(1))} highlight="max" numeric={courses.map((c) => c.rating)} />
            <CompareRow label="Rating Count" values={courses.map((c) => formatNumber(c.ratingCount))} />
            <CompareRow label="Drop-off Rate" values={courses.map((c) => `${100 - c.completionRate}%`)} highlight="min" numeric={courses.map((c) => 100 - c.completionRate)} />
            <CompareRow label="Price" values={courses.map((c) => formatCurrency(c.price))} />
            <CompareRow label="Modules" values={courses.map((c) => formatNumber(c.modules.length))} />
            <CompareRow label="Certificate" values={courses.map((c) => (c.hasCertificate ? "Yes" : "No"))} />
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Highlighted cells indicate best-in-row (green = higher is better, amber = lower is better).</p>
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
        <TableCell
          key={i}
          className={capitalize ? "capitalize" : ""}
        >
          <span className={bestIdx === i ? "inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 font-medium" : ""}>
            {v}
          </span>
        </TableCell>
      ))}
    </TableRow>
  );
}
