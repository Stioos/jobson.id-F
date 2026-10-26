"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Check, X, Users2, TrendingUp, Clock, Layers } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, HEADCOUNT_PLANS, HEADCOUNT_FORECAST, entityById,
  type HeadcountPlan, ChartCard, ChartTooltip, TenantDisclaimer,
} from "./_shared";
import { formatNumber, formatDate } from "@/lib/format";

export function EnterpriseHeadcount() {
  const [rows, setRows] = React.useState<HeadcountPlan[]>(HEADCOUNT_PLANS);
  const [entityFilter, setEntityFilter] = React.useState("all");
  const [actionTarget, setActionTarget] = React.useState<{ plan: HeadcountPlan; decision: "approve" | "reject" } | null>(null);
  const [comment, setComment] = React.useState("");

  const filtered = rows.filter((r) => entityFilter === "all" || r.entityId === entityFilter);

  const totalCurrent = filtered.reduce((s, r) => s + r.current, 0);
  const totalPlanned = filtered.reduce((s, r) => s + r.planned, 0);
  const totalApproved = filtered.reduce((s, r) => s + r.approved, 0);
  const totalInPipeline = filtered.reduce((s, r) => s + r.inPipeline, 0);
  const totalGap = filtered.reduce((s, r) => s + Math.max(0, r.target - r.current - r.approved - r.inPipeline), 0);

  function applyDecision() {
    if (!actionTarget) return;
    const { plan, decision } = actionTarget;
    setRows((prev) => prev.map((p) => {
      if (p.id !== plan.id) return p;
      if (decision === "approve") {
        return { ...p, status: "approved", approved: p.approved + Math.max(0, p.planned - p.approved) };
      }
      return { ...p, status: "rejected" };
    }));
    toast.success(`${decision === "approve" ? "Approved" : "Rejected"} — ${plan.department} · ${entityById(plan.entityId)?.name}`, {
      description: comment ? `Comment: ${comment}` : undefined,
    });
    setActionTarget(null);
    setComment("");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Headcount Planning"
        description="Approve hiring requests, view current vs planned headcount, and forecast capacity across entities."
        icon={<Icon name="Users2" className="h-6 w-6" />}
      />

      <TenantDisclaimer />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Filter by entity:</span>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="h-9 w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {ENTERPRISE_ENTITIES.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard label="Current" value={formatNumber(totalCurrent)} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Planned additions" value={formatNumber(totalPlanned)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Approved" value={formatNumber(totalApproved)} icon={<Check className="h-5 w-5" />} tone="success" />
        <StatCard label="In pipeline" value={formatNumber(totalInPipeline)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Gap to target" value={formatNumber(totalGap)} icon={<Layers className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Headcount forecast" description="Actual vs planned (8-month rolling)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HEADCOUNT_FORECAST}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" domain={["dataMin - 200", "dataMax + 200"]} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="planned" name="Planned" stroke="#14b8a6" strokeWidth={2} strokeDasharray="4 4" fill="url(#plannedGrad)" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2} fill="url(#actualGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Approval queue" description="Pending & in-review requests">
          <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {filtered.filter((r) => r.status === "pending" || r.status === "review").map((r) => {
              const ent = entityById(r.entityId);
              return (
                <li key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.department}</p>
                      <p className="text-xs text-muted-foreground">{ent?.name} · +{r.planned} reqs</p>
                    </div>
                    <StatusBadge status={r.status === "pending" ? "pending" : "in_progress"} />
                  </div>
                </li>
              );
            })}
            {filtered.filter((r) => r.status === "pending" || r.status === "review").length === 0 && (
              <li className="text-xs text-muted-foreground text-center py-6">No pending approvals.</li>
            )}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title={`Headcount plan (${filtered.length})`} description="Department-wise current vs planned additions. Approve or reject pending requests.">
        {filtered.length === 0 ? (
          <EmptyState icon={<Users2 className="h-5 w-5" />} title="No plans" description="No headcount plans for this filter." />
        ) : (
          <div className="max-h-[34rem] overflow-y-auto scroll-thin rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Planned</TableHead>
                  <TableHead className="text-right">Approved</TableHead>
                  <TableHead className="text-right">In pipeline</TableHead>
                  <TableHead className="text-right">Gap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const ent = entityById(r.entityId);
                  const gap = Math.max(0, r.target - r.current - r.approved - r.inPipeline);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ent && <AvatarLogo text={ent.logo} size="xs" />}
                          <span className="text-sm">{ent?.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{r.department}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatNumber(r.current)}</TableCell>
                      <TableCell className="text-right text-sm">+{r.planned}</TableCell>
                      <TableCell className="text-right text-sm">{r.approved}</TableCell>
                      <TableCell className="text-right text-sm">{r.inPipeline}</TableCell>
                      <TableCell className="text-right text-sm">
                        <span className={gap > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}>
                          {gap > 0 ? `+${gap}` : "0"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status === "approved" ? "active" : r.status === "rejected" ? "rejected" : r.status === "review" ? "in_progress" : "pending"} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <p>{r.requestedBy}</p>
                        <p>{formatDate(r.requestedAt)}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        {(r.status === "pending" || r.status === "review") && (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                              onClick={() => setActionTarget({ plan: r, decision: "approve" })}
                            >
                              <Check className="h-4 w-4" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-rose-600 dark:text-rose-400 hover:text-rose-700"
                              onClick={() => setActionTarget({ plan: r, decision: "reject" })}
                            >
                              <X className="h-4 w-4" /> Reject
                            </Button>
                          </div>
                        )}
                        {r.status === "approved" && <span className="text-xs text-emerald-600 dark:text-emerald-400">Approved</span>}
                        {r.status === "rejected" && <span className="text-xs text-rose-600 dark:text-rose-400">Rejected</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <AlertDialog open={!!actionTarget} onOpenChange={(o) => !o && setActionTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.decision === "approve" ? "Approve headcount request?" : "Reject headcount request?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionTarget && (
                <>
                  {entityById(actionTarget.plan.entityId)?.name} · {actionTarget.plan.department} — +{actionTarget.plan.planned} additions.
                  {actionTarget.decision === "reject" && " This will close the request; the requester can resubmit later."}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="comment" className="text-xs font-medium">Comment (optional)</Label>
            <Textarea
              id="comment"
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
