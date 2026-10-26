"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";

type Status = "pending_approval" | "approved" | "rejected" | "draft";
type Priority = "low" | "medium" | "high" | "urgent";

interface Requisition {
  id: string;
  title: string;
  department: string;
  headcount: number;
  budget: number;
  priority: Priority;
  requestedBy: string;
  status: Status;
  justification: string;
  createdAt: string;
}

const INITIAL: Requisition[] = [
  { id: "REQ-2024-001", title: "Senior Frontend Engineer (React)", department: "Engineering", headcount: 2, budget: 6500000, priority: "high", requestedBy: "Priya Nair", status: "approved", justification: "Q1 product roadmap requires 2 senior FE engineers for the new design system migration.", createdAt: "2024-09-12T10:00:00Z" },
  { id: "REQ-2024-002", title: "Data Scientist — ML Platform", department: "Data", headcount: 1, budget: 4200000, priority: "urgent", requestedBy: "Rohit Sharma", status: "pending_approval", justification: "Critical hire for recommendation engine v2 launch in Q2.", createdAt: "2024-10-02T09:30:00Z" },
  { id: "REQ-2024-003", title: "Product Manager — Growth", department: "Product", headcount: 1, budget: 3800000, priority: "high", requestedBy: "Sara Khan", status: "pending_approval", justification: "Growth team needs dedicated PM to lead onboarding experiments.", createdAt: "2024-10-05T14:20:00Z" },
  { id: "REQ-2024-004", title: "Backend Engineer (Go)", department: "Engineering", headcount: 3, budget: 7800000, priority: "medium", requestedBy: "Arjun Mehta", status: "approved", justification: "Payments service scaling needs 3 additional backend engineers.", createdAt: "2024-09-20T11:00:00Z" },
  { id: "REQ-2024-005", title: "UX Designer — Mobile", department: "Design", headcount: 1, budget: 2800000, priority: "medium", requestedBy: "Meera Iyer", status: "rejected", justification: "Mobile redesign needs dedicated designer — current shared resource is bottlenecked.", createdAt: "2024-09-28T16:00:00Z" },
  { id: "REQ-2024-006", title: "DevOps Engineer (SRE)", department: "Infrastructure", headcount: 2, budget: 5800000, priority: "urgent", requestedBy: "Karthik V", status: "pending_approval", justification: "On-call rotation overloaded. 2 SREs needed for 24x7 coverage.", createdAt: "2024-10-08T08:15:00Z" },
  { id: "REQ-2024-007", title: "QA Engineer (Automation)", department: "Engineering", headcount: 2, budget: 4400000, priority: "low", requestedBy: "Anu Reddy", status: "approved", justification: "Test coverage below 60% on critical paths. Need 2 automation QAs.", createdAt: "2024-09-15T13:00:00Z" },
  { id: "REQ-2024-008", title: "Engineering Manager — Payments", department: "Engineering", headcount: 1, budget: 6500000, priority: "high", requestedBy: "Vikram Singh", status: "draft", justification: "Payments team has 9 engineers without a dedicated manager. Needed for Q2 launch.", createdAt: "2024-10-10T10:30:00Z" },
];

const DEPARTMENTS = ["Engineering", "Product", "Data", "Design", "Infrastructure", "Sales", "Marketing", "Finance", "HR"];

const PRIORITY_CLS: Record<Priority, string> = {
  low: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const WORKFLOW = [
  { label: "Requester", icon: "User", desc: "Submits requisition" },
  { label: "Manager", icon: "Briefcase", desc: "Reviews business case" },
  { label: "HR", icon: "Users", desc: "Validates headcount & leveling" },
  { label: "Finance", icon: "Banknote", desc: "Approves budget" },
];

export function EmployerRequisitions() {
  const [list, setList] = React.useState<Requisition[]>(INITIAL);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewTarget, setViewTarget] = React.useState<Requisition | null>(null);
  const [form, setForm] = React.useState({ title: "", department: "Engineering", headcount: "1", budget: "", priority: "medium" as Priority, justification: "" });

  const pendingCount = list.filter((r) => r.status === "pending_approval").length;
  const approvedCount = list.filter((r) => r.status === "approved").length;
  const rejectedCount = list.filter((r) => r.status === "rejected").length;
  const totalOpen = list.filter((r) => r.status === "approved").reduce((a, r) => a + r.headcount, 0);

  const approve = (id: string) => {
    setList((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
    toast.success("Requisition approved", { description: `${id} is now open for hiring.` });
  };
  const reject = (id: string) => {
    setList((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
    toast.warning("Requisition rejected", { description: `${id} has been rejected.` });
  };

  const create = () => {
    if (!form.title || !form.budget || !form.justification) { toast.error("Fill all required fields"); return; }
    const id = `REQ-2024-${String(list.length + 1).padStart(3, "0")}`;
    const newReq: Requisition = {
      id, title: form.title, department: form.department, headcount: Number(form.headcount),
      budget: Number(form.budget), priority: form.priority, requestedBy: "You", status: "pending_approval",
      justification: form.justification, createdAt: new Date().toISOString(),
    };
    setList([newReq, ...list]);
    setCreateOpen(false);
    setForm({ title: "", department: "Engineering", headcount: "1", budget: "", priority: "medium", justification: "" });
    toast.success("Requisition submitted", { description: `${id} sent for approval.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Requisitions"
        description="Submit, track and approve hiring requests across teams with a 4-stage approval workflow."
        icon={<Icon name="ClipboardList" className="h-6 w-6" />}
        actions={[{ label: "New requisition", onClick: () => setCreateOpen(true) }]}
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approval" value={pendingCount} hint="Awaiting review" icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Approved" value={approvedCount} hint="Open for hiring" icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
        <StatCard label="Rejected" value={rejectedCount} hint="This quarter" icon={<Icon name="X" className="h-4 w-4" />} tone="danger" />
        <StatCard label="Total open headcount" value={totalOpen} hint="Across approved reqs" icon={<Icon name="Users" className="h-4 w-4" />} tone="brand" />
      </div>

      {/* Approval workflow visualization */}
      <SectionCard title="Approval workflow" description="Every requisition flows through these 4 stages">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {WORKFLOW.map((stage, i) => (
            <React.Fragment key={stage.label}>
              <div className="flex items-center gap-2 rounded-lg border p-2.5 flex-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon name={stage.icon} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground">{stage.desc}</p>
                </div>
              </div>
              {i < WORKFLOW.length - 1 && <Icon name="ArrowRight" className="hidden sm:block h-4 w-4 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>
      </SectionCard>

      {/* Requisition table */}
      <SectionCard title="All requisitions" description={`${list.length} total`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Headcount</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/40">
                  <TableCell className="text-xs font-mono text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="text-sm font-medium">{r.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.department}</TableCell>
                  <TableCell className="text-center text-sm">{r.headcount}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatCurrency(r.budget)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize ${PRIORITY_CLS[r.priority]}`}>{r.priority}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.requestedBy}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setViewTarget(r)}><Icon name="Eye" className="h-3.5 w-3.5" /></Button>
                      {r.status === "pending_approval" && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10" onClick={() => approve(r.id)}>
                            <Icon name="CheckCircle" className="mr-1 h-3 w-3" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10" onClick={() => reject(r.id)}>
                            <Icon name="X" className="mr-1 h-3 w-3" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New requisition</DialogTitle>
            <DialogDescription>Submit a hiring request for approval.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
            <div className="space-y-1.5">
              <Label>Job title *</Label>
              <Input placeholder="e.g. Senior Frontend Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department *</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Headcount *</Label>
                <Input type="number" min={1} value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Total budget (INR) *</Label>
                <Input type="number" placeholder="6500000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(["low", "medium", "high", "urgent"] as Priority[]).map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Justification *</Label>
                <Textarea rows={3} placeholder="Why is this hire needed?" value={form.justification} onChange={(e) => setForm({ ...form, justification: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={create}>Submit for approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget?.title}</DialogTitle>
            <DialogDescription>{viewTarget?.id} · Requested by {viewTarget?.requestedBy}</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-2"><p className="text-[10px] uppercase text-muted-foreground">Department</p><p className="font-medium">{viewTarget.department}</p></div>
                <div className="rounded-lg border p-2"><p className="text-[10px] uppercase text-muted-foreground">Headcount</p><p className="font-medium">{viewTarget.headcount} position(s)</p></div>
                <div className="rounded-lg border p-2"><p className="text-[10px] uppercase text-muted-foreground">Budget</p><p className="font-medium text-brand">{formatCurrency(viewTarget.budget)}</p></div>
                <div className="rounded-lg border p-2"><p className="text-[10px] uppercase text-muted-foreground">Priority</p><Badge variant="outline" className={`capitalize ${PRIORITY_CLS[viewTarget.priority]}`}>{viewTarget.priority}</Badge></div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Justification</p>
                <p className="text-xs text-muted-foreground rounded-lg bg-muted/40 p-2.5">{viewTarget.justification}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Status:</span><StatusBadge status={viewTarget.status} />
                <span className="text-muted-foreground ml-auto">Created {formatDate(viewTarget.createdAt)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTarget(null)}>Close</Button>
            {viewTarget?.status === "pending_approval" && (
              <>
                <Button variant="outline" className="text-rose-600 border-rose-500/30" onClick={() => { reject(viewTarget.id); setViewTarget(null); }}>Reject</Button>
                <Button onClick={() => { approve(viewTarget.id); setViewTarget(null); }}><Icon name="CheckCircle" className="mr-2 h-4 w-4" /> Approve</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
