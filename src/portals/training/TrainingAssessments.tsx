"use client";

import * as React from "react";
import { trainingAssessments, assessmentAttempts, trainingCourses } from "@/lib/lms-data";
import type { TrainingAssessment } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import { Plus, ClipboardCheck, CheckCircle2, Clock, Award } from "lucide-react";

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"];

export function TrainingAssessments() {
  const [rows, setRows] = React.useState<TrainingAssessment[]>(trainingAssessments);
  const [diffFilter, setDiffFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<TrainingAssessment | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCourse, setNewCourse] = React.useState(trainingCourses[0]?.id ?? "");
  const [newDifficulty, setNewDifficulty] = React.useState<TrainingAssessment["difficulty"]>("intermediate");
  const [newMarks, setNewMarks] = React.useState(100);
  const [newPass, setNewPass] = React.useState(70);
  const [newTime, setNewTime] = React.useState(60);

  const filtered = rows.filter((a) => diffFilter === "all" || a.difficulty === diffFilter);

  const totalAttempts = rows.reduce((s, a) => s + a.attempts, 0);
  const avgScore = rows.length > 0 ? Math.round(rows.reduce((s, a) => s + a.avgScore, 0) / rows.length) : 0;
  const publishedCount = rows.filter((a) => a.status === "published").length;

  function create() {
    if (!newTitle.trim()) { toast.error("Title is required"); return; }
    const course = trainingCourses.find((c) => c.id === newCourse);
    const newAssessment: TrainingAssessment = {
      id: `ta_new_${Date.now()}`,
      title: newTitle,
      courseId: newCourse,
      category: course?.category ?? "General",
      questionCount: 0,
      totalMarks: newMarks,
      passingScore: newPass,
      timeLimitMinutes: newTime,
      difficulty: newDifficulty,
      attempts: 0,
      avgScore: 0,
      status: "draft",
      randomize: false,
    };
    setRows((r) => [newAssessment, ...r]);
    setAddOpen(false);
    setNewTitle("");
    toast.success(`Assessment created — ${newTitle}`, { description: "Status: Draft. Add questions to publish." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assessments"
        description="Create and track course assessments and exams."
        icon={<Icon name="ClipboardCheck" className="h-6 w-6" />}
        actions={[{ label: "Create assessment", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={rows.length} icon={<ClipboardCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Published" value={publishedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Attempts" value={formatNumber(totalAttempts)} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Avg Score" value={`${avgScore}%`} icon={<Award className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="flex items-center gap-2">
        <Select value={diffFilter} onValueChange={setDiffFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<ClipboardCheck className="h-5 w-5" />} title="No assessments" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">Pass %</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Attempts</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(a)}>
                    <TableCell className="font-medium text-sm">{a.title}</TableCell>
                    <TableCell className="text-sm">{a.category}</TableCell>
                    <TableCell className="text-right text-sm">{a.questionCount}</TableCell>
                    <TableCell className="text-right text-sm">{a.totalMarks}</TableCell>
                    <TableCell className="text-right text-sm">{a.passingScore}%</TableCell>
                    <TableCell className="text-right text-sm">{a.timeLimitMinutes}m</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-xs">{a.difficulty}</Badge></TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatNumber(a.attempts)}</TableCell>
                    <TableCell className="text-right text-sm">{a.avgScore}%</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <AssessmentDetail assessment={detail} />}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assessment</DialogTitle>
            <DialogDescription>Configure assessment parameters. Questions added next.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="a-title">Title *</Label>
              <Input id="a-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Course</Label>
              <Select value={newCourse} onValueChange={setNewCourse}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Difficulty</Label>
                <Select value={newDifficulty} onValueChange={(v) => setNewDifficulty(v as TrainingAssessment["difficulty"])}>
                  <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="a-marks">Total marks</Label>
                <Input id="a-marks" type="number" value={newMarks} onChange={(e) => setNewMarks(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="a-pass">Passing score (%)</Label>
                <Input id="a-pass" type="number" value={newPass} onChange={(e) => setNewPass(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="a-time">Time limit (min)</Label>
                <Input id="a-time" type="number" value={newTime} onChange={(e) => setNewTime(Number(e.target.value))} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssessmentDetail({ assessment }: { assessment: TrainingAssessment }) {
  const attempts = assessmentAttempts.filter((a) => a.assessmentId === assessment.id);
  const course = trainingCourses.find((c) => c.id === assessment.courseId);

  // synthetic score distribution
  const distribution = [
    { range: "0-50", count: Math.round(assessment.attempts * 0.08) },
    { range: "51-60", count: Math.round(assessment.attempts * 0.12) },
    { range: "61-70", count: Math.round(assessment.attempts * 0.18) },
    { range: "71-80", count: Math.round(assessment.attempts * 0.25) },
    { range: "81-90", count: Math.round(assessment.attempts * 0.22) },
    { range: "91-100", count: Math.round(assessment.attempts * 0.15) },
  ];

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-lg">{assessment.title}</SheetTitle>
        <SheetDescription>{assessment.category} · {course?.name ?? "Standalone"}</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold">{assessment.questionCount}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Pass Score</p>
            <p className="text-lg font-semibold">{assessment.passingScore}%</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-lg font-semibold">{assessment.timeLimitMinutes}m</p>
          </div>
        </div>

        <SectionCard title="Score Distribution" description={`${formatNumber(assessment.attempts)} total attempts`}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                <Bar dataKey="count" name="Learners" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={`Recent Attempts (${attempts.length})`}>
          {attempts.length === 0 ? <p className="text-sm text-muted-foreground">No recent attempts.</p> : (
            <ul className="space-y-1.5 max-h-40 overflow-y-auto scroll-thin">
              {attempts.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <span>{a.learnerName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.percentage}%</span>
                    <StatusBadge status={a.passed ? "completed" : "failed"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <Button className="w-full" onClick={() => toast.info("Opening assessment editor")}>Edit questions</Button>
      </div>
    </>
  );
}
