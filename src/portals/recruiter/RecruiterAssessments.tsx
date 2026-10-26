"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Plus, ClipboardCheck, Clock, CheckCircle2, XCircle, Code, Brain, MessageSquare,
  Users as UsersIcon, Timer,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatDate, daysUntil, timeAgo } from "@/lib/format";
import { assessmentRecords, clientAccounts } from "@/lib/partner-data";
import type { AssessmentRecord } from "@/lib/partner-data";

const TYPE_META: Record<string, { icon: React.ReactNode; tone: string }> = {
  technical: { icon: <Code className="h-3 w-3" />, tone: "border-violet-400" },
  aptitude: { icon: <Brain className="h-3 w-3" />, tone: "border-amber-400" },
  communication: { icon: <MessageSquare className="h-3 w-3" />, tone: "border-teal-400" },
  coding: { icon: <Code className="h-3 w-3" />, tone: "border-blue-400" },
  personality: { icon: <UsersIcon className="h-3 w-3" />, tone: "border-rose-400" },
};

const BREAKDOWN_SAMPLE: Record<string, { section: string; score: number; max: number; timeSpent: string }[]> = {
  asm_001: [
    { section: "React fundamentals", score: 22, max: 25, timeSpent: "8m" },
    { section: "TypeScript types", score: 20, max: 25, timeSpent: "10m" },
    { section: "System design", score: 24, max: 25, timeSpent: "12m" },
    { section: "Code review", score: 22, max: 25, timeSpent: "8m" },
  ],
  asm_002: [
    { section: "K8s deployment", score: 24, max: 30, timeSpent: "15m" },
    { section: "Systems design", score: 23, max: 30, timeSpent: "20m" },
    { section: "Networking", score: 19, max: 20, timeSpent: "10m" },
    { section: "Troubleshooting", score: 16, max: 20, timeSpent: "12m" },
  ],
  asm_005: [
    { section: "Threat modeling", score: 14, max: 25, timeSpent: "18m" },
    { section: "SIEM tools", score: 16, max: 25, timeSpent: "15m" },
    { section: "Incident response", score: 18, max: 25, timeSpent: "12m" },
    { section: "Compliance", score: 24, max: 25, timeSpent: "8m" },
  ],
};

export function RecruiterAssessments() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<AssessmentRecord | null>(null);

  const filtered = assessmentRecords.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.candidateName.toLowerCase().includes(q) && !a.clientName.toLowerCase().includes(q) && !a.assessmentName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const completed = assessmentRecords.filter((a) => a.status === "completed");
  const passRate = completed.length > 0 ? Math.round((completed.filter((a) => a.passed).length / completed.length) * 100) : 0;
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((acc, a) => acc + a.percentage, 0) / completed.length) : 0;
  const pending = assessmentRecords.filter((a) => a.status === "pending" || a.status === "in_progress").length;

  // Chart data
  const distribution = [
    { range: "0-40", count: completed.filter((a) => a.percentage < 40).length },
    { range: "40-60", count: completed.filter((a) => a.percentage >= 40 && a.percentage < 60).length },
    { range: "60-75", count: completed.filter((a) => a.percentage >= 60 && a.percentage < 75).length },
    { range: "75-90", count: completed.filter((a) => a.percentage >= 75 && a.percentage < 90).length },
    { range: "90+", count: completed.filter((a) => a.percentage >= 90).length },
  ];
  const passPie = [
    { name: "Passed", value: completed.filter((a) => a.passed).length, color: "#10b981" },
    { name: "Failed", value: completed.filter((a) => !a.passed).length, color: "#f43f5e" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Send, monitor, and review candidate assessments. Track scores, pass rates, and time-on-task per round."
        actions={[{ label: "Send assessment", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total sent" value={assessmentRecords.length} icon={<ClipboardCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg score" value={`${avgScore}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" hint="Across completed" />
        <StatCard label="Pass rate" value={`${passRate}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="default" hint={`${completed.filter((a) => a.passed).length}/${completed.length} passed`} />
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Awaiting attempt" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Score distribution" description="Completed assessments by score band" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                />
                <Bar dataKey="count" name="Candidates" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Pass rate" description="Passed vs failed">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {passPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Assessment records"
        description="Click any assessment for the full score breakdown and time-on-task per section."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="personality">Personality</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<ClipboardCheck className="h-5 w-5" />} title="No assessments match" description="Adjust filters or send a new assessment." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Client / Role</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Result</TableHead>
                  <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer" onClick={() => setDetail(a)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={a.candidateName} size="xs" />
                        <div>
                          <p className="text-sm font-medium">{a.candidateName}</p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{a.clientName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm">{a.clientName}</p>
                      <p className="text-xs text-muted-foreground">{a.jobTitle}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{a.assessmentName}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs gap-1">{TYPE_META[a.type].icon} {a.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {a.status === "completed" ? (
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <span className={`text-sm font-medium ${a.percentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : a.percentage >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {a.percentage}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">{a.score}/{a.maxScore}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {a.status === "completed" ? (
                        a.passed ? (
                          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Pass</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-rose-500/30 text-rose-600 dark:text-rose-400"><XCircle className="h-3 w-3" /> Fail</Badge>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      <span className={daysUntil(a.deadline) < 0 ? "text-rose-600 dark:text-rose-400" : daysUntil(a.deadline) < 2 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>
                        {formatDate(a.deadline)}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SendAssessmentDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <AssessmentDetail assessment={detail} onClose={() => setDetail(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SendAssessmentDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [assessmentName, setAssessmentName] = React.useState("");
  const [type, setType] = React.useState<AssessmentRecord["type"]>("technical");
  const [deadline, setDeadline] = React.useState("");

  const submit = () => {
    if (!candidate || !client || !assessmentName) {
      toast.error("Candidate, client, and assessment name are required");
      return;
    }
    toast.success(`Assessment sent to ${candidate} — ${assessmentName}`);
    onOpenChange(false);
    setCandidate(""); setClient(""); setAssessmentName(""); setDeadline("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send assessment</DialogTitle>
          <DialogDescription>The candidate will receive an email with a unique assessment link.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Sahil Khan" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assessment name</Label>
            <Input value={assessmentName} onChange={(e) => setAssessmentName(e.target.value)} placeholder="e.g. ML Fundamentals + Coding" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as AssessmentRecord["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="aptitude">Aptitude</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="personality">Personality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Send assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssessmentDetail({
  assessment, onClose,
}: { assessment: AssessmentRecord; onClose: () => void }) {
  const breakdown = BREAKDOWN_SAMPLE[assessment.id] ?? [];
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={assessment.candidateName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{assessment.assessmentName}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{assessment.candidateName}</span>
              <span>•</span>
              <span>{assessment.clientName}</span>
              <span>•</span>
              <span>{assessment.jobTitle}</span>
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={assessment.status} />
          <Badge variant="outline" className="text-xs gap-1">{TYPE_META[assessment.type].icon} {assessment.type}</Badge>
          {assessment.status === "completed" && (
            assessment.passed ? (
              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Pass</Badge>
            ) : (
              <Badge variant="outline" className="text-xs border-rose-500/30 text-rose-600 dark:text-rose-400"><XCircle className="h-3 w-3" /> Fail</Badge>
            )
          )}
        </div>
      </SheetHeader>

      <div className="space-y-5 mt-5">
        {assessment.status === "completed" ? (
          <>
            {/* Score */}
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase">Overall score</p>
              <p className={`text-4xl font-bold ${assessment.percentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : assessment.percentage >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                {assessment.percentage}%
              </p>
              <p className="text-xs text-muted-foreground">{assessment.score}/{assessment.maxScore} marks</p>
              {assessment.completedAt && (
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <Timer className="h-3 w-3" /> Completed {timeAgo(assessment.completedAt)}
                </p>
              )}
            </div>

            {/* Section breakdown */}
            {breakdown.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Section breakdown</h4>
                <div className="space-y-2">
                  {breakdown.map((b, i) => {
                    const pct = (b.score / b.max) * 100;
                    return (
                      <div key={i} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{b.section}</p>
                          <p className="text-xs text-muted-foreground">{b.score}/{b.max} • {b.timeSpent}</p>
                        </div>
                        <Progress value={pct} className="h-1.5 mt-2" />
                      </div>
                    );
                  })}
                </div>
                {assessment.completedAt && (
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    Total time: {breakdown.reduce((a, b) => a + parseInt(b.timeSpent), 0)}m
                  </p>
                )}
              </div>
            )}
          </>
        ) : assessment.status === "in_progress" ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-amber-600 dark:text-amber-400" />
            <p className="font-medium mt-2 text-amber-700 dark:text-amber-400">In progress</p>
            <p className="text-xs text-muted-foreground mt-1">Started {assessment.startedAt ? timeAgo(assessment.startedAt) : "recently"}</p>
            <p className="text-xs text-muted-foreground">Deadline: {formatDate(assessment.deadline)}</p>
          </div>
        ) : (
          <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
            Assessment not started. Deadline: {formatDate(assessment.deadline)} ({daysUntil(assessment.deadline)}d left).
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {assessment.status === "pending" && (
            <Button size="sm" onClick={() => toast.success("Reminder sent")}>Send reminder</Button>
          )}
          {assessment.status === "in_progress" && (
            <Button size="sm" variant="outline" onClick={() => toast.success("Time extension granted")}>Grant extension</Button>
          )}
          {assessment.status === "completed" && (
            <Button size="sm" variant="outline" onClick={() => toast.success("Detailed report downloaded")}>Download report</Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
