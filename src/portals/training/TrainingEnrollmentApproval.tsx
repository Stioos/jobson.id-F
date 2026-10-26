"use client";

import * as React from "react";
import {
  ClipboardCheck, CheckCircle2, XCircle, Clock, Sparkles, ChevronRight,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type FeeStatus = "Paid" | "Partial" | "Pending";
type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Auto-approved";
type Step = "Student" | "Counsellor" | "Academic Head" | "Finance";

interface Enrollment {
  id: string;
  student: string;
  course: string;
  cohort: string;
  feeStatus: FeeStatus;
  requestedDate: string;
  approver: string;
  status: ApprovalStatus;
  currentStep: Step;
  eligibilityMet: boolean;
  comments?: string;
}

interface Cohort { name: string; course: string; seatsTotal: number; seatsTaken: number }

const STEP_ORDER: Step[] = ["Student", "Counsellor", "Academic Head", "Finance"];

const MOCK: Enrollment[] = [
  { id: "e1", student: "Riya Banerjee", course: "Full Stack Web Development", cohort: "FSWD-2024-OCT-A", feeStatus: "Paid", requestedDate: "2024-10-10", approver: "Counsellor: Anjali", status: "Pending", currentStep: "Counsellor", eligibilityMet: true },
  { id: "e2", student: "Karthik Raj", course: "Data Science Bootcamp", cohort: "DSB-2024-NOV", feeStatus: "Partial", requestedDate: "2024-10-09", approver: "Counsellor: Anjali", status: "Pending", currentStep: "Academic Head", eligibilityMet: true },
  { id: "e3", student: "Meena Krishnan", course: "UX Design Foundation", cohort: "UXD-2024-OCT", feeStatus: "Paid", requestedDate: "2024-10-08", approver: "Auto-approval", status: "Auto-approved", currentStep: "Finance", eligibilityMet: true, comments: "Fee paid + eligibility met → auto-approved" },
  { id: "e4", student: "Arnav Deshpande", course: "Cloud DevOps Engineer", cohort: "CDE-2024-NOV-A", feeStatus: "Pending", requestedDate: "2024-10-07", approver: "Counsellor: Vivek", status: "Pending", currentStep: "Counsellor", eligibilityMet: false },
  { id: "e5", student: "Sara Pinto", course: "Full Stack Web Development", cohort: "FSWD-2024-OCT-A", feeStatus: "Paid", requestedDate: "2024-10-06", approver: "Counsellor: Anjali", status: "Pending", currentStep: "Finance", eligibilityMet: true },
  { id: "e6", student: "Daniel Thomas", course: "Data Science Bootcamp", cohort: "DSB-2024-NOV", feeStatus: "Paid", requestedDate: "2024-10-05", approver: "Finance: Leena", status: "Approved", currentStep: "Finance", eligibilityMet: true },
  { id: "e7", student: "Ishaan Mehra", course: "Mobile App Development", cohort: "MAD-2024-DEC", feeStatus: "Partial", requestedDate: "2024-10-04", approver: "Academic Head: Reena", status: "Rejected", currentStep: "Academic Head", eligibilityMet: false, comments: "Background mismatch with course prerequisites" },
  { id: "e8", student: "Tanvi Shah", course: "Cybersecurity Essentials", cohort: "CSE-2024-NOV", feeStatus: "Paid", requestedDate: "2024-10-03", approver: "Auto-approval", status: "Auto-approved", currentStep: "Finance", eligibilityMet: true, comments: "Fee paid + eligibility met → auto-approved" },
];

const COHORTS: Cohort[] = [
  { name: "FSWD-2024-OCT-A", course: "Full Stack Web Development", seatsTotal: 30, seatsTaken: 24 },
  { name: "DSB-2024-NOV", course: "Data Science Bootcamp", seatsTotal: 25, seatsTaken: 25 },
  { name: "UXD-2024-OCT", course: "UX Design Foundation", seatsTotal: 20, seatsTaken: 12 },
  { name: "CDE-2024-NOV-A", course: "Cloud DevOps Engineer", seatsTotal: 24, seatsTaken: 18 },
  { name: "MAD-2024-DEC", course: "Mobile App Development", seatsTotal: 22, seatsTaken: 9 },
  { name: "CSE-2024-NOV", course: "Cybersecurity Essentials", seatsTotal: 20, seatsTaken: 14 },
];

const FEE_TONE: Record<FeeStatus, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Partial: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Pending: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const STATUS_TONE: Record<ApprovalStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  "Auto-approved": "bg-brand/10 text-brand border-brand/20",
  Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

export function TrainingEnrollmentApproval() {
  const [items, setItems] = React.useState<Enrollment[]>(MOCK);
  const [decision, setDecision] = React.useState<{ row: Enrollment; action: "approve" | "reject" } | null>(null);
  const [comment, setComment] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const pending = items.filter((r) => r.status === "Pending");
  const approved = items.filter((r) => r.status === "Approved" || r.status === "Auto-approved");
  const rejected = items.filter((r) => r.status === "Rejected");

  function decide(action: "approve" | "reject") {
    if (!decision) return;
    setItems((prev) => prev.map((r) => {
      if (r.id !== decision.row.id) return r;
      const idx = STEP_ORDER.indexOf(r.currentStep);
      const next = action === "approve" && idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : r.currentStep;
      const finalStatus: ApprovalStatus = action === "approve" ? (next === "Finance" ? "Approved" : "Pending") : "Rejected";
      return { ...r, currentStep: next, status: finalStatus, comments: comment.trim() || (action === "approve" ? "Approved" : "Rejected") };
    }));
    toast.success(`${action === "approve" ? "Approved" : "Rejected"} — ${decision.row.student}`, { description: decision.row.course });
    setDecision(null); setComment("");
  }

  function batchApprove() {
    if (selected.length === 0) { toast.error("Select rows to batch approve"); return; }
    setItems((prev) => prev.map((r) => selected.includes(r.id) ? { ...r, status: "Approved", currentStep: "Finance", comments: "Batch approved" } : r));
    toast.success("Batch approval complete", { description: `${selected.length} enrollments approved` });
    setSelected([]);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Approval Workflow"
        description="Multi-step approval queue with auto-approval rules, batch processing and seat-availability tracking per cohort."
        icon={<ClipboardCheck className="h-6 w-6" />}
        actions={[
          { label: "Batch approve", variant: "outline", onClick: batchApprove },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approved.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={rejected.length} icon={<XCircle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Auto-approved" value={items.filter((r) => r.status === "Auto-approved").length} icon={<Sparkles className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Approval pipeline" description="Standard 4-step workflow: Student → Counsellor → Academic Head → Finance." className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-1">
            {STEP_ORDER.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex min-w-[110px] flex-1 flex-col items-center rounded-lg border bg-card p-3 text-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</div>
                  <p className="mt-1.5 text-xs font-medium">{step}</p>
                  <p className="text-[10px] text-muted-foreground">{items.filter((r) => r.currentStep === step && r.status === "Pending").length} pending</p>
                </div>
                {i < STEP_ORDER.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-brand">Auto-approval rule:</span> If <span className="font-medium">fee paid</span> + <span className="font-medium">eligibility met</span> → auto-approve at the Counsellor step (Finance still records the receipt).
          </div>
        </SectionCard>

        <SectionCard title="Seat availability" description="Cohorts at or near capacity are flagged.">
          <ul className="max-h-56 space-y-2 overflow-y-auto scroll-thin">
            {COHORTS.map((c) => {
              const pct = Math.round((c.seatsTaken / c.seatsTotal) * 100);
              const full = pct >= 100;
              return (
                <li key={c.name} className="rounded-lg border bg-card p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    <Badge variant="outline" className={full ? "text-rose-600 border-rose-500/30" : pct >= 80 ? "text-amber-600 border-amber-500/30" : "text-emerald-600 border-emerald-500/30"}>
                      {c.seatsTaken}/{c.seatsTotal}
                    </Badge>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${full ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground truncate">{c.course}</p>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History ({approved.length + rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <SectionCard title="Pending approvals" description="Select rows for batch approval, or open individual decisions.">
            {pending.length === 0 ? (
              <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No pending enrollments" description="All requests have been processed." />
            ) : (
              <div className="max-h-96 overflow-y-auto scroll-thin">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead className="w-8" />
                      <TableHead>Student</TableHead>
                      <TableHead>Course / cohort</TableHead>
                      <TableHead className="hidden md:table-cell">Fee</TableHead>
                      <TableHead className="hidden lg:table-cell">Requested</TableHead>
                      <TableHead>Step</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleSelect(r.id)} aria-label={`Select ${r.student}`} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={r.student} size="sm" />
                            <div>
                              <p className="text-sm font-medium">{r.student}</p>
                              <p className="text-[10px] text-muted-foreground">{r.approver}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{r.course}</p>
                          <p className="text-[11px] text-muted-foreground">{r.cohort}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${FEE_TONE[r.feeStatus]}`}>{r.feeStatus}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(r.requestedDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-brand border-brand/30">{r.currentStep}</Badge>
                          {!r.eligibilityMet && <Badge variant="outline" className="ml-1 text-rose-600 border-rose-500/30">Flag</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" onClick={() => { setDecision({ row: r, action: "approve" }); setComment(""); }}>Approve</Button>
                            <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => { setDecision({ row: r, action: "reject" }); setComment(""); }}>Reject</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="history">
          <SectionCard title="Approval history" description="All approved, auto-approved, and rejected enrollments.">
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...approved, ...rejected].map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={r.student} size="sm" />
                          <p className="text-sm font-medium">{r.student}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{r.course}</p>
                        <p className="text-[11px] text-muted-foreground">{r.cohort}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(r.requestedDate)}</TableCell>
                      <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[r.status]}`}>{r.status}</span></TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{r.comments ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={!!decision} onOpenChange={(o) => !o && setDecision(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{decision?.action === "approve" ? "Approve enrollment" : "Reject enrollment"}</DialogTitle>
            <DialogDescription>{decision?.row.student} · {decision?.row.course}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional note for the candidate or approver log…" />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant={decision?.action === "approve" ? "default" : "destructive"} onClick={() => decision && decide(decision.action)}>
              {decision?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
