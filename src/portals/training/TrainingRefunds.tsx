"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  RotateCcw, Clock, CheckCircle2, XCircle, AlertTriangle, Calculator, History,
} from "lucide-react";

interface RefundRequest {
  id: string;
  student: string;
  course: string;
  totalFee: number;
  refundAmount: number;
  reason: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected" | "processed";
  modulesTotal: number;
  modulesCompleted: number;
  decision?: string;
}

const SEED: RefundRequest[] = [
  {
    id: "r1", student: "Aarav Sharma", course: "Full-Stack Developer Bootcamp", totalFee: 85000, refundAmount: 42000,
    reason: "Relocating to another city; cannot continue online classes", requestedDate: "2024-08-12", status: "pending",
    modulesTotal: 12, modulesCompleted: 4,
  },
  {
    id: "r2", student: "Diya Patel", course: "Data Science Pro", totalFee: 95000, refundAmount: 55000,
    reason: "Medical emergency; advised bed rest for 6 weeks", requestedDate: "2024-08-08", status: "pending",
    modulesTotal: 10, modulesCompleted: 3,
  },
  {
    id: "r3", student: "Vivaan Reddy", course: "Cloud Engineering", totalFee: 75000, refundAmount: 15000,
    reason: "Found a different specialization more aligned to career goals", requestedDate: "2024-07-30", status: "approved",
    modulesTotal: 8, modulesCompleted: 6, decision: "Approved — partial refund per proration policy",
  },
  {
    id: "r4", student: "Ananya Iyer", course: "UI/UX Design", totalFee: 65000, refundAmount: 65000,
    reason: "Course content did not match expectations; raised within 7-day window", requestedDate: "2024-07-25", status: "processed",
    modulesTotal: 6, modulesCompleted: 0, decision: "Full refund per 7-day money-back guarantee",
  },
  {
    id: "r5", student: "Reyansh Gupta", course: "DevOps Specialist", totalFee: 80000, refundAmount: 20000,
    reason: "Job change; new employer sponsors different training", requestedDate: "2024-07-18", status: "rejected",
    modulesTotal: 8, modulesCompleted: 7, decision: "Rejected — beyond 75% course completion, no refund eligible",
  },
  {
    id: "r6", student: "Myra Singh", course: "Full-Stack Developer Bootcamp", totalFee: 85000, refundAmount: 30000,
    reason: "Family financial hardship", requestedDate: "2024-08-15", status: "pending",
    modulesTotal: 12, modulesCompleted: 7,
  },
];

export function TrainingRefunds() {
  const [rows, setRows] = React.useState<RefundRequest[]>(SEED);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tab, setTab] = React.useState<"requests" | "calculator" | "history">("requests");
  const [decision, setDecision] = React.useState<RefundRequest | null>(null);
  const [decisionNote, setDecisionNote] = React.useState("");
  const [decisionType, setDecisionType] = React.useState<"approve" | "reject">("approve");

  // Calculator state
  const [calcTotal, setCalcTotal] = React.useState("85000");
  const [calcModules, setCalcModules] = React.useState("12");
  const [calcDone, setCalcDone] = React.useState("4");

  const filtered = rows.filter((r) => statusFilter === "all" || r.status === statusFilter);

  const pending = rows.filter((r) => r.status === "pending").length;
  const approved = rows.filter((r) => r.status === "approved" || r.status === "processed").length;
  const totalRefundAmount = rows
    .filter((r) => r.status === "approved" || r.status === "processed")
    .reduce((a, r) => a + r.refundAmount, 0);
  const rejected = rows.filter((r) => r.status === "rejected").length;

  function openDecision(r: RefundRequest, type: "approve" | "reject") {
    setDecision(r);
    setDecisionType(type);
    setDecisionNote(r.decision ?? "");
  }

  function submitDecision() {
    if (!decision) return;
    const newStatus = decisionType === "approve" ? "approved" : "rejected";
    const note = decisionNote.trim() || (decisionType === "approve" ? "Approved per refund policy" : "Rejected per refund policy");
    setRows((prev) => prev.map((r) =>
      r.id === decision.id ? { ...r, status: newStatus, decision: note } : r
    ));
    toast.success(`Refund ${newStatus}`, { description: `${decision.student} — ${formatCurrency(decision.refundAmount)}` });
    setDecision(null);
    setDecisionNote("");
  }

  function markProcessed(r: RefundRequest) {
    setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "processed" } : x));
    toast.success("Refund processed", { description: `Payment sent to ${r.student}` });
  }

  // Proration calc
  const totalModules = Math.max(0, Number(calcModules) || 0);
  const doneModules = Math.max(0, Math.min(totalModules, Number(calcDone) || 0));
  const totalFeeAmt = Math.max(0, Number(calcTotal) || 0);
  const completionPct = totalModules > 0 ? (doneModules / totalModules) * 100 : 0;
  // Policy: 0-25% done = 75% refund; 25-50% = 50%; 50-75% = 25%; >75% = 0%
  let refundPct = 0;
  if (completionPct <= 25) refundPct = 75;
  else if (completionPct <= 50) refundPct = 50;
  else if (completionPct <= 75) refundPct = 25;
  else refundPct = 0;
  const refundAmt = Math.round(totalFeeAmt * (refundPct / 100));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Refund Processing"
        description="Review student refund requests, calculate prorated amounts, and approve or reject claims."
        icon={<Icon name="RotateCcw" className="h-6 w-6" />}
        actions={[
          { label: "Export", icon: "Download", variant: "outline", onClick: () => toast.success("Refund log exported") },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Review" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<XCircle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Total Refunded" value={formatCurrency(totalRefundAmount)} icon={<RotateCcw className="h-5 w-5" />} tone="brand" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "requests" | "calculator" | "history")}>
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="calculator">Proration Calculator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "requests" && (
        <>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SectionCard title="Refund Requests">
            {filtered.length === 0 ? (
              <EmptyState icon={<RotateCcw className="h-5 w-5" />} title="No refund requests" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Refund Amount</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => {
                      const pct = Math.round((r.modulesCompleted / r.modulesTotal) * 100);
                      return (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <AvatarLogo text={r.student} size="xs" />
                              <span className="text-sm font-medium">{r.student}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">{r.course}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate" title={r.reason}>{r.reason}</TableCell>
                          <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.refundAmount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-[110px]">
                              <Progress value={pct} className="h-1.5" />
                              <span className="text-xs text-muted-foreground">{r.modulesCompleted}/{r.modulesTotal}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDate(r.requestedDate)}</TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-right">
                            {r.status === "pending" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => openDecision(r, "reject")}>
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                                </Button>
                                <Button size="sm" onClick={() => openDecision(r, "approve")}>
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                              </div>
                            ) : r.status === "approved" ? (
                              <Button size="sm" onClick={() => markProcessed(r)}>Mark processed</Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">{r.decision ?? "—"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </>
      )}

      {tab === "calculator" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Proration Calculator" description="Estimate refund based on course completion.">
            <div className="space-y-4">
              <div>
                <Label htmlFor="calc-total">Total course fee (₹)</Label>
                <Input id="calc-total" type="number" value={calcTotal} onChange={(e) => setCalcTotal(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="calc-modules">Total modules</Label>
                  <Input id="calc-modules" type="number" value={calcModules} onChange={(e) => setCalcModules(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="calc-done">Modules completed</Label>
                  <Input id="calc-done" type="number" value={calcDone} onChange={(e) => setCalcDone(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{completionPct.toFixed(0)}%</span>
                </div>
                <Progress value={completionPct} className="mt-2 h-1.5" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Refund Estimate" description="Per standard proration policy.">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Total Fee</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalFeeAmt)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Refund Eligible</p>
                  <p className="text-lg font-semibold text-emerald-700">{refundPct}%</p>
                </div>
              </div>
              <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated refund</p>
                <p className="mt-1 text-3xl font-bold text-brand">{formatCurrency(refundAmt)}</p>
              </div>
              <div className="rounded-lg border p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Refund policy:</p>
                <p>• ≤25% complete → 75% refund</p>
                <p>• 26–50% complete → 50% refund</p>
                <p>• 51–75% complete → 25% refund</p>
                <p>• &gt;75% complete → no refund</p>
              </div>
              <Button className="w-full" onClick={() => toast.success("Estimate saved to draft", { description: formatCurrency(refundAmt) })}>
                <Calculator className="h-4 w-4 mr-2" /> Use this estimate
              </Button>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "history" && (
        <SectionCard title="Processed Refunds" description="Historical record of approved and processed refunds.">
          {rows.filter((r) => r.status === "processed" || r.status === "approved" || r.status === "rejected").length === 0 ? (
            <EmptyState icon={<History className="h-5 w-5" />} title="No refund history yet" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.filter((r) => r.status !== "pending").map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm font-medium">{r.student}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.course}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.refundAmount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[300px]">{r.decision ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      )}

      <Dialog open={!!decision} onOpenChange={(o) => !o && setDecision(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{decisionType === "approve" ? "Approve Refund" : "Reject Refund"}</DialogTitle>
            <DialogDescription>
              {decision && `${decision.student} — ${formatCurrency(decision.refundAmount)}`}
            </DialogDescription>
          </DialogHeader>
          {decision && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                <p className="text-muted-foreground">Original reason:</p>
                <p className="mt-1 text-foreground">{decision.reason}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-muted-foreground">Total Fee</p>
                  <p className="font-semibold">{formatCurrency(decision.totalFee)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Refund</p>
                  <p className="font-semibold text-amber-700">{formatCurrency(decision.refundAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completion</p>
                  <p className="font-semibold">{Math.round((decision.modulesCompleted / decision.modulesTotal) * 100)}%</p>
                </div>
              </div>
              <div>
                <Label htmlFor="decision-note">Decision note</Label>
                <Input id="decision-note" value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} placeholder="Add a note for audit trail..." className="mt-1" />
              </div>
              {decisionType === "approve" && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Approving this refund will mark it for finance processing. Funds will be disbursed within 5–7 business days.</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button
              variant={decisionType === "approve" ? "default" : "destructive"}
              onClick={submitDecision}
            >
              {decisionType === "approve" ? "Approve refund" : "Reject refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
