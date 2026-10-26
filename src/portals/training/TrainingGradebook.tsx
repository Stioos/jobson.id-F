"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { GraduationCap, Trophy, Star, TrendingUp, BookOpen, Save } from "lucide-react";

const COHORTS = [
  { id: "c1", name: "Full-Stack Dev — Batch A" },
  { id: "c2", name: "Data Science — Batch B" },
  { id: "c3", name: "Cloud Engineering — Batch C" },
];

interface Assessment {
  id: string;
  name: string;
  weight: number; // percent
}

const ASSESSMENTS: Assessment[] = [
  { id: "a1", name: "Assessment 1", weight: 20 },
  { id: "a2", name: "Assessment 2", weight: 20 },
  { id: "a3", name: "Project", weight: 40 },
  { id: "a4", name: "Attendance", weight: 20 },
];

interface Student {
  id: string;
  name: string;
  scores: Record<string, number>; // 0-100 per assessment
}

const SEED: Student[] = [
  { id: "u1", name: "Aarav Sharma", scores: { a1: 88, a2: 92, a3: 95, a4: 100 } },
  { id: "u2", name: "Diya Patel", scores: { a1: 76, a2: 81, a3: 84, a4: 95 } },
  { id: "u3", name: "Vivaan Reddy", scores: { a1: 92, a2: 89, a3: 91, a4: 100 } },
  { id: "u4", name: "Ananya Iyer", scores: { a1: 65, a2: 70, a3: 68, a4: 80 } },
  { id: "u5", name: "Reyansh Gupta", scores: { a1: 54, a2: 60, a3: 58, a4: 60 } },
  { id: "u6", name: "Ishaan Mehta", scores: { a1: 79, a2: 85, a3: 88, a4: 90 } },
  { id: "u7", name: "Saanvi Nair", scores: { a1: 95, a2: 96, a3: 94, a4: 100 } },
  { id: "u8", name: "Arjun Kumar", scores: { a1: 70, a2: 73, a3: 75, a4: 85 } },
];

type Scale = "letter" | "percent";

function letterGrade(pct: number): string {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function gradeTone(pct: number): string {
  if (pct >= 90) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  if (pct >= 80) return "border-teal-500/40 bg-teal-500/10 text-teal-700";
  if (pct >= 70) return "border-amber-500/40 bg-amber-500/10 text-amber-700";
  if (pct >= 60) return "border-orange-500/40 bg-orange-500/10 text-orange-700";
  return "border-rose-500/40 bg-rose-500/10 text-rose-700";
}

function finalGrade(scores: Record<string, number>): number {
  let total = 0;
  ASSESSMENTS.forEach((a) => { total += (scores[a.id] ?? 0) * (a.weight / 100); });
  return Math.round(total);
}

export function TrainingGradebook() {
  const [cohort, setCohort] = React.useState(COHORTS[0].id);
  const [scale, setScale] = React.useState<Scale>("letter");
  const [students, setStudents] = React.useState<Student[]>(SEED);
  const [editing, setEditing] = React.useState<string | null>(null);

  function setScore(studentId: string, assessmentId: string, raw: string) {
    const v = Math.max(0, Math.min(100, Number(raw) || 0));
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, scores: { ...s.scores, [assessmentId]: v } } : s
      )
    );
  }

  const averages = ASSESSMENTS.map((a) => {
    const sum = students.reduce((acc, s) => acc + (s.scores[a.id] ?? 0), 0);
    return { ...a, avg: students.length ? Math.round(sum / students.length) : 0 };
  });

  const finalAvgs = students.map((s) => finalGrade(s.scores));
  const classAverage = students.length ? Math.round(finalAvgs.reduce((a, b) => a + b, 0) / students.length) : 0;
  const topScore = Math.max(...finalAvgs, 0);
  const topStudent = students.find((s) => finalGrade(s.scores) === topScore);
  const passCount = finalAvgs.filter((p) => p >= 60).length;
  const distinctionCount = finalAvgs.filter((p) => p >= 90).length;

  function save() {
    toast.success("Gradebook saved", { description: `${students.length} student records updated` });
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gradebook"
        description="Record assessment scores, compute weighted final grades, and monitor class performance."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[
          { label: "Save", icon: "Save", variant: "outline", onClick: save },
          { label: "Export report", icon: "Download", onClick: () => toast.success("Gradebook exported") },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Class Average" value={`${classAverage}%`} icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
        <StatCard label="Top Performer" value={topStudent ? topStudent.name.split(" ")[0] : "—"} hint={topStudent ? `${topScore}%` : ""} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Distinction (A)" value={distinctionCount} icon={<Star className="h-5 w-5" />} tone="success" />
        <StatCard label="At Risk (<D)" value={students.length - passCount} icon={<BookOpen className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={cohort} onValueChange={setCohort}>
          <SelectTrigger className="h-9 w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {COHORTS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Tabs value={scale} onValueChange={(v) => setScale(v as Scale)}>
          <TabsList className="h-9">
            <TabsTrigger value="letter">Letter (A/B/C/D/F)</TabsTrigger>
            <TabsTrigger value="percent">Percentage</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="ml-auto text-xs text-muted-foreground">
          Weights: {ASSESSMENTS.map((a) => `${a.name} ${a.weight}%`).join(" · ")}
        </span>
      </div>

      <SectionCard title="Class Gradebook" description="Click a cell to edit. Final grade is computed from weighted assessment scores.">
        {students.length === 0 ? (
          <EmptyState icon={<GraduationCap className="h-5 w-5" />} title="No students enrolled" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Student</TableHead>
                  {ASSESSMENTS.map((a) => (
                    <TableHead key={a.id} className="text-center min-w-[110px]">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground">{a.weight}%</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[110px]">Final Grade</TableHead>
                  <TableHead className="text-center">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students
                  .map((s) => ({ s, final: finalGrade(s.scores) }))
                  .sort((a, b) => b.final - a.final)
                  .map(({ s, final }, idx) => {
                    const isTop = idx === 0;
                    return (
                      <TableRow key={s.id} className={isTop ? "bg-emerald-500/5" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={s.name} size="xs" />
                            <span className="text-sm font-medium">{s.name}</span>
                            {isTop && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                          </div>
                        </TableCell>
                        {ASSESSMENTS.map((a) => {
                          const key = `${s.id}_${a.id}`;
                          const isEditing = editing === key;
                          const val = s.scores[a.id] ?? 0;
                          return (
                            <TableCell key={a.id} className="text-center p-1.5">
                              {isEditing ? (
                                <Input
                                  autoFocus
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={val}
                                  onChange={(e) => setScore(s.id, a.id, e.target.value)}
                                  onBlur={() => setEditing(null)}
                                  onKeyDown={(e) => { if (e.key === "Enter") setEditing(null); }}
                                  className="h-8 w-16 mx-auto text-center"
                                />
                              ) : (
                                <button
                                  onClick={() => setEditing(key)}
                                  className={`inline-flex h-8 min-w-[44px] items-center justify-center rounded-md border px-2 text-sm font-semibold ${gradeTone(val)}`}
                                >
                                  {scale === "letter" ? letterGrade(val) : `${val}%`}
                                </button>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center p-1.5">
                          <span className={`inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-bold ${gradeTone(final)}`}>
                            {scale === "letter" ? letterGrade(final) : `${final}%`}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm text-muted-foreground">#{idx + 1}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              {/* Footer row: class averages */}
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 border-t-2">
                  <TableHead className="font-semibold">Class Average</TableHead>
                  {averages.map((a) => (
                    <TableHead key={a.id} className="text-center font-semibold">
                      {scale === "letter" ? letterGrade(a.avg) : `${a.avg}%`}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-brand">
                    {scale === "letter" ? letterGrade(classAverage) : `${classAverage}%`}
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Grade Distribution">
          <div className="space-y-2.5">
            {[
              { label: "A (90+)", count: finalAvgs.filter((p) => p >= 90).length, color: "bg-emerald-500" },
              { label: "B (80–89)", count: finalAvgs.filter((p) => p >= 80 && p < 90).length, color: "bg-teal-500" },
              { label: "C (70–79)", count: finalAvgs.filter((p) => p >= 70 && p < 80).length, color: "bg-amber-500" },
              { label: "D (60–69)", count: finalAvgs.filter((p) => p >= 60 && p < 70).length, color: "bg-orange-500" },
              { label: "F (<60)", count: finalAvgs.filter((p) => p < 60).length, color: "bg-rose-500" },
            ].map((g) => {
              const pct = students.length ? (g.count / students.length) * 100 : 0;
              return (
                <div key={g.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground">{g.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${g.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold">{g.count}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Top Performers" className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-3">
            {students
              .map((s) => ({ s, final: finalGrade(s.scores) }))
              .sort((a, b) => b.final - a.final)
              .slice(0, 3)
              .map(({ s, final }, i) => (
                <div key={s.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-500/20 text-amber-700" : i === 1 ? "bg-slate-400/20 text-slate-600" : "bg-orange-700/20 text-orange-700"}`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium truncate">{s.name}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-brand">{final}%</p>
                  <Badge variant="outline" className={`mt-1 ${gradeTone(final)}`}>{letterGrade(final)}</Badge>
                </div>
              ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Pass rate: <span className="font-semibold text-foreground">{Math.round((passCount / students.length) * 100)}%</span></span>
            <Button size="sm" variant="outline" onClick={() => toast.success("Performance report sent to trainer")}>
              <Save className="h-3.5 w-3.5 mr-1" /> Notify trainer
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
