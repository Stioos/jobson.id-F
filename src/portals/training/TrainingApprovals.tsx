"use client";

import * as React from "react";
import { trainingApprovals, type TrainingApproval } from "@/lib/lms-data";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { TenantDisclaimer } from "./_shared";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus, CheckCircle2, XCircle, Clock, AlertTriangle,
  Wallet, TrendingUp,
} from "lucide-react";

const TYPE_LABEL: Record<TrainingApproval["type"], string> = {
  course_request: "Course request",
  budget_request: "Budget request",
  contract_renewal: "Contract renewal",
  custom_program: "Custom program",
};

export function TrainingApprovals() {
  const [rows, setRows] = React.useState<TrainingApproval[]>(trainingApprovals);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [decision, setDecision] = React.useState<{ row: TrainingApproval; action: "approve" | "reject" } | null>(null);
  const [comment, setComment] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);

  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");

  const filteredPending = pending.filter((r) => {
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchPri = priorityFilter === "all" || r.priority === priorityFilter;
    return matchType && matchPri;
  });

  const totalPendingValue = pending.reduce((s, r) => s + (r.amount ?? 0), 0);
  const approvedThisMonth = decided.filter((r) =>
    r.status === "approved" && r.decidedAt && new Date(r.decidedAt).getMonth() === new Date().getMonth(),
  ).length;
  // Simulated avg decision time (hours)
  const avgDecisionHrs = decided.length > 0 ? Math.round(decided.reduce((s, r) => s + 24, 0) / decided.length) : 0;

  function decide(action: "approve" | "reject") {
    if (!decision) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === decision.row.id
          ? {
              ...r,
              status: action === "approve" ? "approved" : "rejected",
              approver: "You (Admin)",
              decidedAt: new Date().toISOString(),
              comments: comment.trim() || (action === "approve" ? "Approved" : "Rejected"),
            }
          : r,
      ),
    );
    toast.success(`${action === "approve" ? "Approved" : "Rejected"} — ${decision.row.title}`);
    setDecision(null);
    setComment("");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Approvals"
        description="Review and act on training requests, budget approvals, contract renewals, and custom programs."
        actions={[{ label: "New request", icon: "Plus", onClick: () => setNewOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} tone="brand" />
        <StatCard label="Value pending" value={formatCurrency(totalPendingValue)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Approved this month" value={approvedThisMonth} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg decision time" value={`${avgDecisionHrs}h`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="decided">Decided ({decided.length})</TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-4 space-y-4">
          <Card className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="course_request">Course request</SelectItem>
                  <SelectItem value="budget_request">Budget request</SelectItem>
                  <SelectItem value="contract_renewal">Contract renewal</SelectItem>
                  <SelectItem value="custom_program">Custom program</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">{filteredPending.length} pending</span>
            </div>
          </Card>

          {filteredPending.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="No pending approvals"
              description="You're all caught up. New requests will appear here."
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredPending.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[r.type]}</Badge>
                        <StatusBadge status={r.priority} />
                      </div>
                      <p className="mt-2 text-sm font-semibold">{r.title}</p>
                    </div>
                    {r.amount && (
                      <span className="shrink-0 rounded-md bg-brand/10 px-2 py-1 text-sm font-semibold text-brand">
                        {formatCurrency(r.amount, r.currency ?? "INR")}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{r.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">Requester</p>
                      <p className="font-medium">{r.requester}</p>
                      <p className="text-[10px] text-muted-foreground">{r.requesterRole}</p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{r.clientName ?? "—"}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Requested {timeAgo(r.requestedAt)}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setDecision({ row: r, action: "reject" }); setComment(""); }}>
                        <XCircle className="mr-1 h-3.5 w-3.5 text-rose-500" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => { setDecision({ row: r, action: "approve" }); setComment(""); }}>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DECIDED */}
        <TabsContent value="decided" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision history</CardTitle>
              <CardDescription>All approvals & rejections to date</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Decided</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decided.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                          No decisions yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      decided.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="max-w-[220px]">
                            <p className="truncate text-sm font-medium">{r.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{r.comments ?? "—"}</p>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{TYPE_LABEL[r.type]}</Badge></TableCell>
                          <TableCell className="text-sm">{r.requester}</TableCell>
                          <TableCell className="text-sm">{r.clientName ?? "—"}</TableCell>
                          <TableCell className="text-sm">{r.amount ? formatCurrency(r.amount, r.currency ?? "INR") : "—"}</TableCell>
                          <TableCell className="text-xs">{r.decidedAt ? formatDate(r.decidedAt) : "—"}</TableCell>
                          <TableCell className="text-sm">{r.approver ?? "—"}</TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Decision dialog */}
      <Dialog open={!!decision} onOpenChange={(o) => { if (!o) setDecision(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decision?.action === "approve" ? "Approve" : "Reject"} request
            </DialogTitle>
            <DialogDescription>
              {decision?.row.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{decision?.row.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{decision?.row.description}</p>
              {decision?.row.amount && (
                <p className="mt-2 text-xs">
                  <span className="text-muted-foreground">Amount:</span>{" "}
                  <span className="font-semibold text-brand">{formatCurrency(decision.row.amount, decision.row.currency ?? "INR")}</span>
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment">Comment (optional for approve, required for reject)</Label>
              <Textarea
                id="comment"
                placeholder={decision?.action === "approve" ? "Add a note for the requester…" : "Explain why this is being rejected…"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            {decision?.action === "reject" && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>The requester will be notified by email. A comment is recommended.</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button
              variant={decision?.action === "approve" ? "default" : "destructive"}
              onClick={() => decision && decide(decision.action)}
              disabled={decision?.action === "reject" && !comment.trim()}
            >
              {decision?.action === "approve" ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Approve</>
              ) : (
                <><XCircle className="mr-2 h-4 w-4" /> Reject</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New request dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New approval request</DialogTitle>
            <DialogDescription>Submit a new request for approval workflow.</DialogDescription>
          </DialogHeader>
          <NewRequestForm
            onCancel={() => setNewOpen(false)}
            onSubmit={(vals) => {
              const newRow: TrainingApproval = {
                id: `tap_new_${Date.now()}`,
                type: vals.type,
                title: vals.title,
                requester: "You",
                requesterRole: "Admin",
                clientId: vals.clientId || undefined,
                clientName: undefined,
                amount: vals.amount || undefined,
                currency: "INR",
                description: vals.description,
                requestedAt: new Date().toISOString(),
                status: "pending",
                priority: vals.priority,
              };
              setRows((r) => [newRow, ...r]);
              setNewOpen(false);
              toast.success("Request submitted for approval");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewRequestForm({ onCancel, onSubmit }: {
  onCancel: () => void;
  onSubmit: (vals: {
    type: TrainingApproval["type"];
    title: string;
    description: string;
    amount: number;
    clientId: string;
    priority: TrainingApproval["priority"];
  }) => void;
}) {
  const [type, setType] = React.useState<TrainingApproval["type"]>("course_request");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [clientId, setClientId] = React.useState("");
  const [priority, setPriority] = React.useState<TrainingApproval["priority"]>("medium");

  function submit() {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    onSubmit({
      type, title: title.trim(), description: description.trim(),
      amount: Number(amount) || 0, clientId, priority,
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as TrainingApproval["type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="course_request">Course request</SelectItem>
              <SelectItem value="budget_request">Budget request</SelectItem>
              <SelectItem value="contract_renewal">Contract renewal</SelectItem>
              <SelectItem value="custom_program">Custom program</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TrainingApproval["priority"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short, descriptive title" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what's being requested and why…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amt">Amount (INR, optional)</Label>
          <Input id="amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cid">Client ID (optional)</Label>
          <Input id="cid" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="cc_001" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}><Plus className="mr-2 h-4 w-4" /> Submit request</Button>
      </DialogFooter>
    </div>
  );
}
