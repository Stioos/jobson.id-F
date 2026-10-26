"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { jobOrders } from "@/lib/partner-data";
import type { JobOrder } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  ClipboardList, Plus, Briefcase, Users, TrendingUp, ArrowRight, Clock, MapPin, Award,
} from "lucide-react";

const STATUSES: JobOrder["status"][] = ["open", "on_hold", "fulfilled", "cancelled", "partial"];
const PRIORITIES: JobOrder["priority"][] = ["low", "medium", "high", "urgent"];

export function PartnerJobOrders() {
  const partner = CURRENT_PARTNER;
  const [list, setList] = React.useState<JobOrder[]>(jobOrders);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<JobOrder | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = list.filter((j) => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (priorityFilter !== "all" && j.priority !== priorityFilter) return false;
    return true;
  });

  const totalPositions = list.reduce((s, j) => s + j.positions, 0);
  const filledPositions = list.reduce((s, j) => s + j.filled, 0);
  const totalPlacements = list.reduce((s, j) => s + j.placements, 0);
  const openCount = list.filter((j) => j.status === "open" || j.status === "partial").length;
  const fillRate = totalPositions > 0 ? Math.round((filledPositions / totalPositions) * 100) : 0;

  function open(j: JobOrder) {
    setSelected(j);
    setSheetOpen(true);
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newJ: JobOrder = {
      id: `jo_${Date.now()}`,
      orderNumber: `JO-2024-${String(500 + list.length + 1).padStart(4, "0")}`,
      clientId: `pc_${Date.now()}`,
      clientName: fd.get("clientName") as string,
      title: fd.get("title") as string,
      role: fd.get("role") as string,
      positions: Number(fd.get("positions")) || 1,
      filled: 0,
      experienceMin: Number(fd.get("experienceMin")) || 0,
      experienceMax: Number(fd.get("experienceMax")) || 0,
      salaryMin: Number(fd.get("salaryMin")) || 0,
      salaryMax: Number(fd.get("salaryMax")) || 0,
      currency: "INR",
      location: fd.get("location") as string,
      remote: fd.get("remote") === "on",
      skillsRequired: (fd.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean),
      certificationsRequired: [],
      type: fd.get("type") as JobOrder["type"],
      priority: fd.get("priority") as JobOrder["priority"],
      status: "open",
      feeType: fd.get("feeType") as JobOrder["feeType"],
      feeValue: Number(fd.get("feeValue")) || 0,
      createdAt: new Date().toISOString(),
      deadline: fd.get("deadline") as string,
      assignedRecruiter: partner.contactName,
      submissions: 0,
      interviews: 0,
      offers: 0,
      placements: 0,
    };
    setList((prev) => [newJ, ...prev]);
    setAddOpen(false);
    toast.success("Job order created", { description: `${newJ.orderNumber} · ${newJ.title}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Orders"
        description={`${partner.name} — manage recruitment mandates (RECRUITMENT model).`}
        icon={<Icon name="ClipboardList" className="h-6 w-6" />}
        actions={[
          { label: "Create Job Order", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Orders" value={openCount} icon={<ClipboardList className="h-5 w-5" />} tone="brand" />
        <StatCard label="Positions" value={`${filledPositions}/${totalPositions}`} icon={<Users className="h-5 w-5" />} hint={`${fillRate}% fill rate`} />
        <StatCard label="Placements" value={totalPlacements} icon={<Award className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Submissions" value={list.reduce((s, j) => s + j.submissions, 0)} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Positions</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Placements</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={12} className="py-10 text-center text-sm text-muted-foreground">No job orders match the filters.</TableCell></TableRow>
                ) : filtered.map((j) => {
                  const dleft = daysUntil(j.deadline);
                  return (
                    <TableRow key={j.id} className="cursor-pointer hover:bg-brand/5" onClick={() => open(j)}>
                      <TableCell className="font-mono text-xs">{j.orderNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={j.clientName} size="sm" />
                          <p className="text-sm font-medium">{j.clientName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{j.title}</TableCell>
                      <TableCell className="text-sm">{j.filled}/{j.positions}</TableCell>
                      <TableCell className="text-sm">{j.experienceMin}–{j.experienceMax}y</TableCell>
                      <TableCell className="text-sm">{formatCurrency(j.salaryMin)}–{formatCurrency(j.salaryMax)}</TableCell>
                      <TableCell><StatusBadge status={j.priority} /></TableCell>
                      <TableCell><StatusBadge status={j.status} /></TableCell>
                      <TableCell className="text-sm">{j.submissions}</TableCell>
                      <TableCell className="text-sm font-medium text-brand">{j.placements}</TableCell>
                      <TableCell>
                        <span className={`text-xs ${dleft < 0 ? "text-rose-600 dark:text-rose-400" : dleft <= 7 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                          {dleft < 0 ? `${Math.abs(dleft)}d overdue` : `${dleft}d left`}
                        </span>
                      </TableCell>
                      <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selected.orderNumber}</span>
                  <StatusBadge status={selected.status} />
                </SheetTitle>
                <SheetDescription>{selected.title} · {selected.clientName}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{selected.role}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium capitalize">{selected.type.replace(/-/g, " ")}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Positions</p>
                    <p className="text-sm font-semibold">{selected.filled}/{selected.positions} filled</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <StatusBadge status={selected.priority} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-sm font-medium">{selected.experienceMin}–{selected.experienceMax} years</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm font-medium">{formatCurrency(selected.salaryMin)}–{formatCurrency(selected.salaryMax)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {selected.location}{selected.remote && " · Remote"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="text-sm font-medium capitalize">{selected.feeType} · {selected.feeType === "percentage" ? `${selected.feeValue}%` : formatCurrency(selected.feeValue)}</p>
                  </div>
                </div>

                <SectionCard title="Recruitment Pipeline" description="Stage-by-stage funnel">
                  <div className="space-y-3">
                    <PipelineRow label="Submissions" value={selected.submissions} total={selected.submissions} />
                    <PipelineRow label="Interviews" value={selected.interviews} total={selected.submissions} />
                    <PipelineRow label="Offers" value={selected.offers} total={selected.submissions} />
                    <PipelineRow label="Placements" value={selected.placements} total={selected.submissions} />
                  </div>
                </SectionCard>

                <SectionCard title="Skills Required">
                  <div className="flex flex-wrap gap-2">
                    {selected.skillsRequired.map((s) => (
                      <span key={s} className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">{s}</span>
                    ))}
                    {selected.certificationsRequired.map((c) => (
                      <span key={c} className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">{c}</span>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Assignment">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between"><span className="text-muted-foreground">Recruiter</span><span className="font-medium">{selected.assignedRecruiter}</span></p>
                    <p className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium">{formatDate(selected.createdAt)}</span></p>
                    <p className="flex items-center justify-between"><span className="text-muted-foreground">Deadline</span><span className={`font-medium ${daysUntil(selected.deadline) < 0 ? "text-rose-600 dark:text-rose-400" : daysUntil(selected.deadline) <= 7 ? "text-amber-600 dark:text-amber-400" : ""}`}>{formatDate(selected.deadline)} ({daysUntil(selected.deadline) < 0 ? `${Math.abs(daysUntil(selected.deadline))}d overdue` : `${daysUntil(selected.deadline)}d left`})</span></p>
                  </div>
                </SectionCard>

                <SheetFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Submissions view opened")}>View Submissions</Button>
                  <Button className="flex-1" onClick={() => toast.success("Edit form opened")}>Edit Order</Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Job Order</DialogTitle>
            <DialogDescription>Post a new recruitment mandate from a client.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" name="clientName" required placeholder="TechCorp India" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" required placeholder="Senior Full-Stack Engineer" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" required placeholder="Full-Stack Developer" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="positions">Positions</Label>
                <Input id="positions" name="positions" type="number" min={1} defaultValue={1} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experienceMin">Min Exp</Label>
                <Input id="experienceMin" name="experienceMin" type="number" min={0} defaultValue={3} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experienceMax">Max Exp</Label>
                <Input id="experienceMax" name="experienceMax" type="number" min={0} defaultValue={7} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="salaryMin">Min Salary (₹)</Label>
                <Input id="salaryMin" name="salaryMin" type="number" defaultValue={1000000} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salaryMax">Max Salary (₹)</Label>
                <Input id="salaryMax" name="salaryMax" type="number" defaultValue={2000000} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required placeholder="Bengaluru" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" name="skills" placeholder="React, Node.js, TypeScript" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="permanent">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="contract-to-hire">Contract to Hire</SelectItem>
                    <SelectItem value="rpo">RPO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="feeType">Fee Type</Label>
                <Select name="feeType" defaultValue="percentage">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="retainer">Retainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="feeValue">Fee Value</Label>
                <Input id="feeValue" name="feeValue" type="number" defaultValue={8.33} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remote" name="remote" className="rounded" />
              <Label htmlFor="remote" className="text-sm font-normal">Remote-eligible</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PipelineRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} ({pct}%)</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
