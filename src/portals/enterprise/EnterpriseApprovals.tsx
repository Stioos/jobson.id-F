"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, X, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  REQUISITION_APPROVALS, APPROVAL_HISTORY,
  entityById, formatCompactCurrency, TenantDisclaimer, type RequisitionApproval,
} from "./_shared";
import { formatDate, formatDateTime } from "@/lib/format";

export function EnterpriseApprovals() {
  const [rows, setRows] = React.useState<RequisitionApproval[]>(REQUISITION_APPROVALS);
  const [history, setHistory] = React.useState(APPROVAL_HISTORY);
  const [actionTarget, setActionTarget] = React.useState<{ req: RequisitionApproval; decision: "approve" | "reject" } | null>(null);
  const [comment, setComment] = React.useState("");
  const [search, setSearch] = React.useState("");

  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");
  const filteredPending = pending.filter((r) => !search || `${r.title} ${r.entityName} ${r.department} ${r.hiringManager}`.toLowerCase().includes(search.toLowerCase()));

  function applyDecision() {
    if (!actionTarget) return;
    const { req, decision } = actionTarget;
    const decisionPast: "approved" | "rejected" = decision === "approve" ? "approved" : "rejected";
    setRows((prev) => prev.map((r) => {
      if (r.id !== req.id) return r;
      const stages = r.stages.map((s) => {
        if (s.status !== "pending") return s;
        return {
          ...s,
          status: decisionPast,
          at: new Date().toISOString(),
          note: comment || undefined,
        } as typeof s;
      });
      return { ...r, stages, status: decisionPast };
    }));
    setHistory((h) => [
      {
        id: `ah_new_${Date.now()}`,
        reqTitle: req.title,
        entity: req.entityName,
        approver: "Rohan Mehta",
        decision: decisionPast,
        at: new Date().toISOString(),
        note: comment || undefined,
      },
      ...h,
    ]);
    toast.success(`${decision === "approve" ? "Approved" : "Rejected"} — ${req.title}`, {
      description: comment ? `Comment: ${comment}` : undefined,
    });
    setActionTarget(null);
    setComment("");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Requisition Approvals"
        description="Multi-stage approval workflow for hiring requisitions across the tenant."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
      />

      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved (this session)" value={decided.filter((r) => r.status === "approved").length} icon={<Check className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected (this session)" value={decided.filter((r) => r.status === "rejected").length} icon={<X className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg cycle time" value="3.2d" icon={<Clock className="h-5 w-5" />} delta={{ value: "0.5d faster", positive: true }} />
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Pending queue ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4 mt-4">
          <div className="relative max-w-md">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requisitions..."
              className="h-9"
            />
          </div>

          {filteredPending.length === 0 ? (
            <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="Queue is clear" description="No requisitions are awaiting your approval right now." />
          ) : (
            <div className="space-y-3">
              {filteredPending.map((r) => (
                <RequisitionCard key={r.id} req={r} onApprove={() => setActionTarget({ req: r, decision: "approve" })} onReject={() => setActionTarget({ req: r, decision: "reject" })} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard title="Past approvals" description="Historical decisions across the tenant.">
            <div className="max-h-[30rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Requisition</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm font-medium">{h.reqTitle}</TableCell>
                      <TableCell className="text-sm">{h.entity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={h.approver} size="xs" />
                          <span className="text-sm">{h.approver}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={h.decision === "approved" ? "active" : "rejected"} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(h.at)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[16rem] truncate">{h.note ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!actionTarget} onOpenChange={(o) => !o && setActionTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.decision === "approve" ? "Approve requisition?" : "Reject requisition?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionTarget && (
                <>
                  <strong>{actionTarget.req.title}</strong> — {actionTarget.req.entityName} · {actionTarget.req.department}
                  <br />
                  Budget: {formatCompactCurrency(actionTarget.req.budget, actionTarget.req.currency)} · Stage: {actionTarget.req.currentStage}
                  <br />
                  {actionTarget.decision === "approve"
                    ? "This advances the requisition to the next stage in the approval chain."
                    : "This returns the requisition to the requester with your comment."}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="approval-comment" className="text-xs font-medium">Comment (optional for approve, required for reject)</Label>
            <Textarea
              id="approval-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add context for the decision..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={applyDecision}
              className={actionTarget?.decision === "reject" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}
            >
              {actionTarget?.decision === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RequisitionCard({ req, onApprove, onReject }: { req: RequisitionApproval; onApprove: () => void; onReject: () => void }) {
  const ent = entityById(req.entityId);
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          {ent && <AvatarLogo text={ent.logo} size="md" />}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{req.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {req.entityName} · {req.department} · HM: {req.hiringManager}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-brand/20 bg-brand/10 text-brand">
                {formatCompactCurrency(req.budget, req.currency)}
              </Badge>
              <Badge variant="outline">L{req.level} approval</Badge>
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />
                Target: {formatDate(req.targetHireDate)}
              </Badge>
              <span className="text-xs text-muted-foreground">Requested by {req.requestedBy} · {formatDate(req.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="text-rose-600 dark:text-rose-400 hover:text-rose-700" onClick={onReject}>
            <X className="h-4 w-4" /> Reject
          </Button>
          <Button size="sm" onClick={onApprove}>
            <Check className="h-4 w-4" /> Approve
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-4">
        <ApprovalStepper stages={req.stages} />
      </div>
    </div>
  );
}

function ApprovalStepper({ stages }: { stages: RequisitionApproval["stages"] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {stages.map((s, i) => {
        const tone =
          s.status === "approved" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
            : s.status === "rejected" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
              : s.status === "pending" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                : "bg-muted text-muted-foreground border-border";
        return (
          <div key={i} className="flex items-center gap-1">
            <div className={`rounded-md border px-2.5 py-1 text-xs ${tone}`}>
              <div className="flex items-center gap-1.5">
                {s.status === "approved" && <Check className="h-3 w-3" />}
                {s.status === "rejected" && <X className="h-3 w-3" />}
                {s.status === "pending" && <Clock className="h-3 w-3" />}
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-[10px] opacity-80">{s.approver}{s.note ? ` · ${s.note}` : ""}</p>
                </div>
              </div>
            </div>
            {i < stages.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        );
      })}
    </div>
  );
}
