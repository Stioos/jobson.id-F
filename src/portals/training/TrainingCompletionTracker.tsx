"use client";

import * as React from "react";
import {
  Flag, TrendingDown, AlertTriangle, MessageCircle, CalendarClock, UserCheck,
  Award, Briefcase, Users,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface StageMetrics { count: number; dropoff: number; reasons: string[] }
interface AtRiskStudent {
  id: string; name: string; attendance: number; score: number; reason: string;
}
interface Cohort {
  id: string;
  name: string;
  course: string;
  startDate: string;
  enrolled: number;
  funnel: { Enrolled: StageMetrics; Attended: StageMetrics; Submitted: StageMetrics; Passed: StageMetrics; Certified: StageMetrics; Placed: StageMetrics };
  atRisk: AtRiskStudent[];
  completionRate: number;
  trend: { month: string; rate: number }[];
}

const MOCK_COHORTS: Cohort[] = [
  {
    id: "c1",
    name: "FSWD-2024-OCT-A",
    course: "Full Stack Web Development",
    startDate: "2024-10-21",
    enrolled: 30,
    funnel: {
      Enrolled: { count: 30, dropoff: 0, reasons: [] },
      Attended: { count: 26, dropoff: 4, reasons: ["Drop-out (personal): 2", "Relocation: 1", "Medical leave: 1"] },
      Submitted: { count: 24, dropoff: 2, reasons: ["Low engagement: 2"] },
      Passed: { count: 21, dropoff: 3, reasons: ["Assessment failure: 2", "Plagiarism: 1"] },
      Certified: { count: 20, dropoff: 1, reasons: ["Pending fee clearance: 1"] },
      Placed: { count: 16, dropoff: 4, reasons: ["Seeking higher studies: 2", "Not interested in placement: 1", "Awaiting offer: 1"] },
    },
    atRisk: [
      { id: "s1", name: "Ravi Kumar", attendance: 68, score: 38, reason: "Attendance < 75% & score < 40%" },
      { id: "s2", name: "Meena Iyer", attendance: 72, score: 45, reason: "Attendance < 75%" },
    ],
    completionRate: 67,
    trend: [
      { month: "W1", rate: 100 }, { month: "W3", rate: 92 }, { month: "W5", rate: 87 }, { month: "W7", rate: 80 }, { month: "W10", rate: 73 }, { month: "W12", rate: 67 },
    ],
  },
  {
    id: "c2",
    name: "DSB-2024-NOV",
    course: "Data Science Bootcamp",
    startDate: "2024-11-04",
    enrolled: 25,
    funnel: {
      Enrolled: { count: 25, dropoff: 0, reasons: [] },
      Attended: { count: 22, dropoff: 3, reasons: ["Drop-out: 2", "Schedule conflict: 1"] },
      Submitted: { count: 20, dropoff: 2, reasons: ["Low engagement: 2"] },
      Passed: { count: 17, dropoff: 3, reasons: ["Assessment failure: 3"] },
      Certified: { count: 16, dropoff: 1, reasons: ["Pending project review: 1"] },
      Placed: { count: 13, dropoff: 3, reasons: ["Seeking higher studies: 1", "Awaiting offer: 2"] },
    },
    atRisk: [
      { id: "s3", name: "Sanjay Gupta", attendance: 70, score: 35, reason: "Attendance < 75% & score < 40%" },
      { id: "s4", name: "Divya Rao", attendance: 65, score: 50, reason: "Attendance < 75%" },
      { id: "s5", name: "Akash Verma", attendance: 88, score: 38, reason: "Score < 40%" },
    ],
    completionRate: 52,
    trend: [
      { month: "W1", rate: 100 }, { month: "W4", rate: 88 }, { month: "W8", rate: 70 }, { month: "W12", rate: 60 }, { month: "W16", rate: 52 },
    ],
  },
  {
    id: "c3",
    name: "UXD-2024-OCT",
    course: "UX Design Foundation",
    startDate: "2024-10-28",
    enrolled: 20,
    funnel: {
      Enrolled: { count: 20, dropoff: 0, reasons: [] },
      Attended: { count: 19, dropoff: 1, reasons: ["Relocation: 1"] },
      Submitted: { count: 18, dropoff: 1, reasons: ["Low engagement: 1"] },
      Passed: { count: 17, dropoff: 1, reasons: ["Portfolio review fail: 1"] },
      Certified: { count: 17, dropoff: 0, reasons: [] },
      Placed: { count: 14, dropoff: 3, reasons: ["Freelancing: 2", "Awaiting offer: 1"] },
    },
    atRisk: [],
    completionRate: 70,
    trend: [
      { month: "W1", rate: 100 }, { month: "W3", rate: 95 }, { month: "W5", rate: 88 }, { month: "W8", rate: 70 },
    ],
  },
  {
    id: "c4",
    name: "CDE-2024-NOV-A",
    course: "Cloud DevOps Engineer",
    startDate: "2024-11-11",
    enrolled: 24,
    funnel: {
      Enrolled: { count: 24, dropoff: 0, reasons: [] },
      Attended: { count: 22, dropoff: 2, reasons: ["Drop-out: 1", "Medical: 1"] },
      Submitted: { count: 21, dropoff: 1, reasons: ["Low engagement: 1"] },
      Passed: { count: 19, dropoff: 2, reasons: ["Assessment failure: 2"] },
      Certified: { count: 18, dropoff: 1, reasons: ["Pending fee: 1"] },
      Placed: { count: 15, dropoff: 3, reasons: ["Awaiting offer: 2", "Not interested: 1"] },
    },
    atRisk: [
      { id: "s6", name: "Imran Khan", attendance: 60, score: 32, reason: "Attendance < 75% & score < 40%" },
    ],
    completionRate: 63,
    trend: [
      { month: "W1", rate: 100 }, { month: "W3", rate: 92 }, { month: "W6", rate: 80 }, { month: "W10", rate: 63 },
    ],
  },
];

const STAGE_ICON: Record<string, React.ReactNode> = {
  Enrolled: <Users className="h-4 w-4" />,
  Attended: <CalendarClock className="h-4 w-4" />,
  Submitted: <MessageCircle className="h-4 w-4" />,
  Passed: <UserCheck className="h-4 w-4" />,
  Certified: <Award className="h-4 w-4" />,
  Placed: <Briefcase className="h-4 w-4" />,
};

export function TrainingCompletionTracker() {
  const [cohortId, setCohortId] = React.useState(MOCK_COHORTS[0].id);
  const cohort = MOCK_COHORTS.find((c) => c.id === cohortId) ?? MOCK_COHORTS[0];

  const stages = Object.entries(cohort.funnel) as [keyof typeof cohort.funnel, StageMetrics][];
  const placed = cohort.funnel.Placed.count;
  const overallRate = Math.round((placed / cohort.enrolled) * 100);
  const maxTrend = 100;
  const avgAttendance = cohort.atRisk.length === 0 ? 90 : Math.round(cohort.atRisk.reduce((a, s) => a + s.attendance, 0) / cohort.atRisk.length);

  function intervention(student: string, action: string) {
    toast.success("Intervention assigned", { description: `${action} for ${student}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completion Tracker"
        description="Cohort-by-cohort funnel from enrollment to placement. Spot drop-offs early and intervene before students are lost."
        icon={<Flag className="h-6 w-6" />}
        actions={[
          { label: "Export cohort report", variant: "outline", onClick: () => toast.success("Export started", { description: `${cohort.name}_report.pdf` }) },
        ]}
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cohort</label>
          <Select value={cohortId} onValueChange={setCohortId}>
            <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MOCK_COHORTS.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} — {c.course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Enrolled" value={cohort.enrolled} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={placed} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Placement rate" value={`${overallRate}%`} icon={<Flag className="h-5 w-5" />} tone="default" />
        <StatCard label="At-risk students" value={cohort.atRisk.length} icon={<AlertTriangle className="h-5 w-5" />} tone={cohort.atRisk.length > 0 ? "danger" : "default"} />
      </div>

      <SectionCard title="Completion funnel" description={`${cohort.name} · ${cohort.course} · started ${cohort.startDate}`}>
        <div className="flex flex-wrap items-stretch gap-2 overflow-x-auto">
          {stages.map(([name, m], i) => {
            const prev = i > 0 ? stages[i - 1][1].count : m.count;
            const conv = prev > 0 ? Math.round((m.count / prev) * 100) : 0;
            return (
              <div key={name} className="flex min-w-[160px] flex-1 flex-col rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">{STAGE_ICON[name]}</span>
                  {name}
                </div>
                <p className="mt-2 text-2xl font-semibold">{m.count}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  {i > 0 && (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">▲ {conv}%</span>
                  )}
                  {i === 0 && <span className="text-muted-foreground">Top of funnel</span>}
                </div>
                {m.dropoff > 0 && (
                  <div className="mt-2 rounded border border-rose-500/20 bg-rose-500/5 p-1.5 text-[10px]">
                    <p className="font-medium text-rose-600">−{m.dropoff} drop-off</p>
                    <ul className="mt-0.5 space-y-0.5">
                      {m.reasons.map((r) => <li key={r} className="text-muted-foreground">{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="At-risk students" description="Attendance < 75% OR assessment score < 40%." className="lg:col-span-2">
          {cohort.atRisk.length === 0 ? (
            <EmptyState icon={<UserCheck className="h-5 w-5" />} title="No at-risk students" description="This cohort is healthy." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="hidden md:table-cell">Flag</TableHead>
                  <TableHead className="text-right">Intervention</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohort.atRisk.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={s.name} size="sm" />
                        <p className="text-sm font-medium">{s.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-semibold ${s.attendance < 75 ? "text-rose-600" : "text-emerald-600"}`}>{s.attendance}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-semibold ${s.score < 40 ? "text-rose-600" : "text-emerald-600"}`}>{s.score}%</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-rose-600 border-rose-500/30">{s.reason}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => intervention(s.name, "Counselling session")}>Counselling</Button>
                        <Button size="sm" variant="outline" onClick={() => intervention(s.name, "Extra session")}>Extra</Button>
                        <Button size="sm" variant="ghost" onClick={() => intervention(s.name, "Mentor assigned")}>Mentor</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Completion rate trend" description={`${cohort.name} — weekly placement-readiness.`}>
          <div className="flex h-40 items-end gap-2 px-1">
            {cohort.trend.map((t) => (
              <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center" style={{ height: "110px" }}>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-brand/60 to-brand"
                    style={{ height: `${(t.rate / maxTrend) * 100}%` }}
                    title={`${t.rate}%`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{t.month}</span>
                <span className="text-[10px] font-medium">{t.rate}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 text-[11px] text-amber-700 dark:text-amber-300">
            <TrendingDown className="mr-1 inline h-3 w-3" />
            Completion has declined {cohort.trend[0].rate - cohort.trend[cohort.trend.length - 1].rate}pts since W1.
            Consider proactive intervention.
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Drop-off reasons summary" description="Aggregated reasons across the funnel — used for intervention planning.">
        <ul className="grid gap-2 text-xs sm:grid-cols-2">
          {stages.flatMap(([name, m]) => m.reasons.map((r) => (
            <li key={`${name}-${r}`} className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
              <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
              <div>
                <p className="font-medium">{r}</p>
                <p className="text-muted-foreground">Stage: {name}</p>
              </div>
            </li>
          )))}
          {stages.every(([_, m]) => m.reasons.length === 0) && (
            <li className="text-muted-foreground">No drop-off recorded in this cohort.</li>
          )}
        </ul>
      </SectionCard>
    </div>
  );
}
