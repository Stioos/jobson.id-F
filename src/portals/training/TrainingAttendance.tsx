"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  CalendarCheck, QrCode, Check, X, Clock, AlertTriangle, Users2, CheckCircle2,
} from "lucide-react";

type Mark = "present" | "absent" | "late" | "none";

interface Student {
  id: string;
  name: string;
  avatar?: string;
}

const COHORTS = [
  { id: "c1", name: "Full-Stack Dev — Batch A" },
  { id: "c2", name: "Data Science — Batch B" },
  { id: "c3", name: "Cloud Engineering — Batch C" },
];

const SESSIONS = [
  { id: "s1", label: "Mon 04", date: "2024-08-04" },
  { id: "s2", label: "Wed 06", date: "2024-08-06" },
  { id: "s3", label: "Fri 08", date: "2024-08-08" },
  { id: "s4", label: "Mon 11", date: "2024-08-11" },
  { id: "s5", label: "Wed 13", date: "2024-08-13" },
];

const STUDENTS: Student[] = [
  { id: "u1", name: "Aarav Sharma" },
  { id: "u2", name: "Diya Patel" },
  { id: "u3", name: "Vivaan Reddy" },
  { id: "u4", name: "Ananya Iyer" },
  { id: "u5", name: "Reyansh Gupta" },
  { id: "u6", name: "Ishaan Mehta" },
  { id: "u7", name: "Saanvi Nair" },
  { id: "u8", name: "Arjun Kumar" },
  { id: "u9", name: "Myra Singh" },
  { id: "u10", name: "Kabir Joshi" },
];

// Deterministic seed-based initial marks so the dashboard starts populated
function seedMarks(): Record<string, Mark> {
  const out: Record<string, Mark> = {};
  const patterns: Mark[] = ["present", "present", "late", "present", "absent"];
  STUDENTS.forEach((s, i) => {
    SESSIONS.forEach((sess, j) => {
      const key = `${s.id}_${sess.id}`;
      // Mix it up deterministically per student/session
      const v = (i * 3 + j * 5 + (i % 2)) % 8;
      if (v === 0) out[key] = "absent";
      else if (v === 3) out[key] = "late";
      else if (v === 7 && j > 1) out[key] = "none";
      else out[key] = "present";
    });
    // Force one low-attendance student
    void patterns;
  });
  // Make Reyansh (u5) low attendance
  SESSIONS.forEach((sess, idx) => {
    out[`u5_${sess.id}`] = idx === 0 || idx === 4 ? "present" : "absent";
  });
  return out;
}

const MARK_STYLE: Record<Mark, string> = {
  present: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25",
  absent: "bg-rose-500/15 text-rose-700 border-rose-500/30 hover:bg-rose-500/25",
  late: "bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/25",
  none: "bg-muted text-muted-foreground border-border hover:bg-muted/70",
};

function cycle(m: Mark): Mark {
  const order: Mark[] = ["none", "present", "late", "absent"];
  return order[(order.indexOf(m) + 1) % order.length];
}

function MarkCell({ mark, onClick }: { mark: Mark; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold transition ${MARK_STYLE[mark]}`}
      title={mark === "none" ? "Not marked" : mark.charAt(0).toUpperCase() + mark.slice(1)}
    >
      {mark === "present" && <Check className="h-3.5 w-3.5" />}
      {mark === "absent" && <X className="h-3.5 w-3.5" />}
      {mark === "late" && <Clock className="h-3.5 w-3.5" />}
      {mark === "none" && <span className="h-1 w-1 rounded-full bg-current" />}
    </button>
  );
}

export function TrainingAttendance() {
  const [cohort, setCohort] = React.useState(COHORTS[0].id);
  const [date, setDate] = React.useState(SESSIONS[2].date);
  const [marks, setMarks] = React.useState<Record<string, Mark>>(seedMarks);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  function setMark(studentId: string, sessionId: string, m: Mark) {
    setMarks((prev) => ({ ...prev, [`${studentId}_${sessionId}`]: m }));
  }

  function summary(studentId: string) {
    let present = 0, absent = 0, late = 0, total = 0;
    SESSIONS.forEach((s) => {
      const m = marks[`${studentId}_${s.id}`] ?? "none";
      if (m !== "none") {
        total++;
        if (m === "present") present++;
        else if (m === "absent") absent++;
        else if (m === "late") late++;
      }
    });
    const pct = total === 0 ? 0 : Math.round(((present + late * 0.5) / total) * 100);
    return { present, absent, late, total, pct };
  }

  const lowAttendance = STUDENTS.filter((s) => {
    const sum = summary(s.id);
    return sum.total > 0 && sum.pct < 75;
  });

  const totals = STUDENTS.reduce(
    (acc, s) => {
      const sum = summary(s.id);
      acc.present += sum.present;
      acc.absent += sum.absent;
      acc.late += sum.late;
      return acc;
    },
    { present: 0, absent: 0, late: 0 }
  );

  const avgPct = Math.round(
    STUDENTS.reduce((a, s) => a + summary(s.id).pct, 0) / STUDENTS.length
  );

  function markAllForSession(sessionId: string, m: Mark) {
    setMarks((prev) => {
      const next = { ...prev };
      STUDENTS.forEach((s) => { next[`${s.id}_${sessionId}`] = m; });
      return next;
    });
    toast.success(`Marked all students ${m} for ${SESSIONS.find((x) => x.id === sessionId)?.label}`);
  }

  function qrCheckIn() {
    toast.success("QR check-in started", { description: "Students can scan to mark themselves present" });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance Tracking"
        description="Mark per-session attendance, monitor trends, and trigger alerts for low-attendance learners."
        icon={<Icon name="CalendarCheck" className="h-6 w-6" />}
        actions={[
          { label: "QR Check-in", icon: "QrCode", variant: "outline", onClick: qrCheckIn },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Attendance" value={`${avgPct}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Present" value={totals.present} icon={<Check className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Absent" value={totals.absent} icon={<X className="h-5 w-5" />} tone="danger" />
        <StatCard label="Low Attendance" value={lowAttendance.length} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={cohort} onValueChange={setCohort}>
          <SelectTrigger className="h-9 w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {COHORTS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Label htmlFor="att-date" className="text-xs text-muted-foreground">Date</Label>
          <Input id="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 w-[160px]" />
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
          <TabsList className="h-9">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">Summary</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Legend:</span>
          <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700"><Check className="h-3 w-3" />Present</Badge>
          <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700"><Clock className="h-3 w-3" />Late</Badge>
          <Badge variant="outline" className="gap-1 border-rose-500/30 bg-rose-500/10 text-rose-700"><X className="h-3 w-3" />Absent</Badge>
        </div>
      </div>

      {lowAttendance.length > 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">{lowAttendance.length} student(s) below 75% attendance</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lowAttendance.map((s) => (
                  <Badge key={s.id} variant="outline" className="border-amber-500/40 bg-background text-amber-700">
                    {s.name} — {summary(s.id).pct}%
                  </Badge>
                ))}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent to low-attendance students")}>
              Send reminder
            </Button>
          </div>
        </div>
      )}

      {view === "grid" ? (
        <SectionCard
          title="Attendance Grid"
          description="Click any cell to cycle through Present → Late → Absent → Unmarked."
          action={
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={() => markAllForSession(SESSIONS[0].id, "present")}>Mark all present (Mon 04)</Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card min-w-[200px]">Student</TableHead>
                  {SESSIONS.map((s) => (
                    <TableHead key={s.id} className="text-center min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">{s.label.split(" ")[0]}</span>
                        <span className="text-[10px] text-muted-foreground">{s.label.split(" ")[1]}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[140px]">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS.map((s) => {
                  const sum = summary(s.id);
                  const low = sum.pct < 75 && sum.total > 0;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="sticky left-0 bg-card">
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={s.name} size="xs" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{s.name}</span>
                            {low && <span className="text-[10px] text-amber-600 font-medium">Low attendance</span>}
                          </div>
                        </div>
                      </TableCell>
                      {SESSIONS.map((sess) => {
                        const key = `${s.id}_${sess.id}`;
                        const m = marks[key] ?? "none";
                        return (
                          <TableCell key={sess.id} className="text-center p-2">
                            <MarkCell mark={m} onClick={() => setMark(s.id, sess.id, cycle(m))} />
                          </TableCell>
                        );
                      })}
                      <TableCell className="p-2">
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={sum.pct} className="h-1.5 w-12" />
                          <span className={`text-xs font-semibold ${low ? "text-amber-600" : "text-foreground"}`}>{sum.pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Per-Student Summary">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                  <TableHead className="text-right">Late</TableHead>
                  <TableHead className="text-right">Absent</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="min-w-[140px]">Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS.map((s) => {
                  const sum = summary(s.id);
                  const low = sum.pct < 75 && sum.total > 0;
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={s.name} size="xs" />
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-emerald-700 font-medium">{sum.present}</TableCell>
                      <TableCell className="text-right text-sm text-amber-700 font-medium">{sum.late}</TableCell>
                      <TableCell className="text-right text-sm text-rose-700 font-medium">{sum.absent}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{sum.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={sum.pct} className="h-1.5 w-20" />
                          <span className="text-xs font-semibold">{sum.pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {low ? (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700">At risk</Badge>
                        ) : sum.pct >= 90 ? (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700">Excellent</Badge>
                        ) : (
                          <Badge variant="outline">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="justify-start" onClick={() => toast.success("Attendance exported to CSV")}>
              <Users2 className="h-4 w-4 mr-2" /> Export attendance CSV
            </Button>
            <Button variant="outline" className="justify-start" onClick={qrCheckIn}>
              <QrCode className="h-4 w-4 mr-2" /> Generate QR code
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => toast.success("Make-up session scheduled")}>
              <CalendarCheck className="h-4 w-4 mr-2" /> Schedule make-up
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => toast.info("Parent report email queued")}>
              <Icon name="Mail" className="h-4 w-4 mr-2" /> Email parent report
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Session Notes">
          <EmptyState
            icon={<CalendarCheck className="h-5 w-5" />}
            title="No notes for this date"
            description={`Add trainer notes for ${date}. Notes help track session quality and learner engagement.`}
            action={<Button size="sm" onClick={() => toast.success("Note added")}>Add note</Button>}
          />
        </SectionCard>
      </div>
    </div>
  );
}
