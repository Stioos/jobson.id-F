"use client";

import * as React from "react";
import {
  Plus, Briefcase, MapPin, Users, Target, Clock, FileText,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { jobOrders } from "@/lib/partner-data";
import type { JobOrder } from "@/lib/partner-types";

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

type JobStatus = JobOrder["status"];
type JobPriority = JobOrder["priority"];

const SUBMISSION_SAMPLE = [
  { id: "s1", name: "Priya Nair", match: 92, stage: "Offer", submitted: "12 days ago" },
  { id: "s2", name: "Arjun Iyer", match: 88, stage: "Interview", submitted: "9 days ago" },
  { id: "s3", name: "Kavya Reddy", match: 84, stage: "Placed", submitted: "20 days ago" },
  { id: "s4", name: "Vikram Singh", match: 79, stage: "Submitted", submitted: "5 days ago" },
  { id: "s5", name: "Neha Gupta", match: 76, stage: "Screening", submitted: "3 days ago" },
];

export function RecruiterJobOrders() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<JobOrder | null>(null);

  const filtered = jobOrders.filter((j) => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (priorityFilter !== "all" && j.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!j.title.toLowerCase().includes(q) && !j.clientName.toLowerCase().includes(q) && !j.orderNumber.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalOpenPositions = jobOrders.reduce((a, j) => a + (j.status === "open" || j.status === "partial" ? (j.positions - j.filled) : 0), 0);
  const totalPositions = jobOrders.reduce((a, j) => a + j.positions, 0);
  const totalFilled = jobOrders.reduce((a, j) => a + j.filled, 0);
  const fulfillmentRate = totalPositions > 0 ? Math.round((totalFilled / totalPositions) * 100) : 0;
  const avgDays = jobOrders.length > 0
    ? Math.round(jobOrders.reduce((a, j) => a + Math.abs(daysUntil(j.createdAt)), 0) / jobOrders.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job orders"
        description="Hiring mandates from your clients. Track fulfillment, fees, and pipeline per mandate."
        actions={[{ label: "Create job order", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Open positions" value={totalOpenPositions} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Fulfillment rate" value={`${fulfillmentRate}%`} icon={<Target className="h-5 w-5" />} tone="success" hint={`${totalFilled}/${totalPositions} filled`} />
        <StatCard label="Avg time-to-fill" value={`${avgDays}d`} icon={<Clock className="h-5 w-5" />} tone="default" hint="Across all mandates" />
        <StatCard label="Active mandates" value={jobOrders.filter((j) => j.status === "open" || j.status === "partial").length} icon={<Users className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Mandates"
        description="Click a job order to view its pipeline funnel, submissions, and placement tracking."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search title, client, JO #…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="on_hold">On hold</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No mandates match"
            description="Adjust filters or create a new job order to get started."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Order # / Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Exp.</TableHead>
                  <TableHead className="hidden lg:table-cell">Salary range</TableHead>
                  <TableHead className="text-center">Positions</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Fee</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((j) => (
                  <TableRow key={j.id} className="cursor-pointer" onClick={() => setDetail(j)}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-xs font-mono text-muted-foreground">{j.orderNumber}</p>
                        <p className="truncate text-sm font-medium">{j.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{j.type.replace(/-/g, " ")}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={j.clientName} size="xs" />
                        <span className="text-sm truncate">{j.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {j.experienceMin}–{j.experienceMax} yrs
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      {formatCurrency(j.salaryMin, j.currency as Currency)} – {formatCurrency(j.salaryMax, j.currency as Currency)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">{j.filled}/{j.positions}</span>
                        <Progress value={(j.filled / j.positions) * 100} className="h-1.5 w-14" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[j.priority]}`}>
                        {j.priority}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center text-xs">
                      {j.feeType === "percentage" ? `${j.feeValue}%` : formatCurrency(j.feeValue, j.currency as Currency)}
                      <p className="text-[10px] text-muted-foreground capitalize">{j.feeType}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center text-xs">
                      <DeadlinePill iso={j.deadline} />
                    </TableCell>
                    <TableCell><StatusBadge status={j.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <AddJobOrderDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <JobOrderDetail job={detail} onClose={() => setDetail(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DeadlinePill({ iso }: { iso: string }) {
  const d = daysUntil(iso);
  if (d < 0) return <span className="text-rose-600">Passed</span>;
  if (d <= 7) return <span className="text-rose-600 font-medium">{d}d left</span>;
  if (d <= 14) return <span className="text-amber-600 font-medium">{d}d left</span>;
  return <span className="text-muted-foreground">{d}d left</span>;
}

function JobOrderDetail({ job, onClose }: { job: JobOrder; onClose: () => void }) {
  const deadlineDays = daysUntil(job.deadline);
  const fillRate = job.submissions > 0 ? Math.round((job.placements / job.submissions) * 100) : 0;
  const fulfillmentPct = job.positions > 0 ? Math.round((job.filled / job.positions) * 100) : 0;
  const feeAmount = job.feeType === "percentage"
    ? (job.salaryMin * job.feeValue) / 100
    : job.feeValue;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={job.clientName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{job.title}</div>
            <div className="text-xs text-muted-foreground">
              <span className="font-mono">{job.orderNumber}</span> · {job.clientName} · {job.role}
            </div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Job order detail</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={job.status} />
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[job.priority]}`}>
            {job.priority} priority
          </span>
          <Badge variant="outline" className="capitalize">{job.type.replace(/-/g, " ")}</Badge>
          {job.remote && <Badge variant="outline">Remote</Badge>}
          <Badge variant="outline" className="text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />{job.location}
          </Badge>
        </div>

        {/* Fulfillment */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Fulfillment</h4>
            <span className="text-xs font-medium text-muted-foreground">{job.filled}/{job.positions} placed · {fulfillmentPct}%</span>
          </div>
          <Progress value={fulfillmentPct} className="mt-2 h-2" />
        </div>

        {/* Mandate terms */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Mandate terms</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Salary band</dt>
            <dd className="text-right font-medium">{formatCurrency(job.salaryMin, job.currency as Currency)} – {formatCurrency(job.salaryMax, job.currency as Currency)}</dd>
            <dt className="text-muted-foreground">Experience</dt>
            <dd className="text-right">{job.experienceMin}–{job.experienceMax} years</dd>
            <dt className="text-muted-foreground">Fee type</dt>
            <dd className="text-right capitalize">{job.feeType}</dd>
            <dt className="text-muted-foreground">Fee value</dt>
            <dd className="text-right font-semibold">
              {job.feeType === "percentage" ? `${job.feeValue}%` : formatCurrency(job.feeValue, job.currency as Currency)}
            </dd>
            <dt className="text-muted-foreground">Est. fee per placement</dt>
            <dd className="text-right text-brand font-semibold">{formatCurrency(feeAmount, job.currency as Currency)}</dd>
            <dt className="text-muted-foreground">Deadline</dt>
            <dd className="text-right">{formatDate(job.deadline)}</dd>
            <dt className="text-muted-foreground">Time remaining</dt>
            <dd className={deadlineDays < 0 ? "text-right text-rose-600 font-medium" : deadlineDays <= 14 ? "text-right text-amber-600 font-medium" : "text-right text-muted-foreground"}>
              {deadlineDays < 0 ? "Overdue" : `${deadlineDays} days`}
            </dd>
          </dl>
        </div>

        {/* Pipeline funnel */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Pipeline funnel</span>
            <span className="text-muted-foreground">{fillRate}% submission→placement</span>
          </div>
          <div className="mt-2 space-y-2">
            <FunnelRow label="Submissions" value={job.submissions} max={job.submissions} tone="bg-slate-400" />
            <FunnelRow label="Interviews" value={job.interviews} max={job.submissions} tone="bg-amber-400" />
            <FunnelRow label="Offers" value={job.offers} max={job.submissions} tone="bg-teal-400" />
            <FunnelRow label="Placements" value={job.placements} max={job.submissions} tone="bg-emerald-500" />
          </div>
        </div>

        {/* Skills & certs */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs font-semibold text-muted-foreground">Skills required</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {job.skillsRequired.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs font-semibold text-muted-foreground">Certifications</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {job.certificationsRequired.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Recent submissions */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Recent submissions ({SUBMISSION_SAMPLE.length})</h4>
          <div className="max-h-48 overflow-y-auto scroll-thin space-y-2">
            {SUBMISSION_SAMPLE.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border p-2">
                <MatchScore score={s.match} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.submitted}</p>
                </div>
                <StatusBadge status={s.stage.toLowerCase().replace(/\s+/g, "_")} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Assigned recruiter</p>
            <p className="mt-0.5 text-sm font-medium">{job.assignedRecruiter}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Created</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(job.createdAt)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => {
            onClose();
            toast.success("Source candidates", { description: `Opening talent search for ${job.title}` });
          }}>
            <Users className="h-4 w-4 mr-1" /> Source candidates
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Job order copied", { description: job.orderNumber })}>
            <FileText className="h-4 w-4 mr-1" /> Copy JO #
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Client update sent", { description: `Weekly status emailed to ${job.clientName}` })}>
            Send client update
          </Button>
        </div>
      </div>
    </>
  );
}

function FunnelRow({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-xs text-muted-foreground">{label}</span>
      <div className="relative h-6 flex-1 rounded-md bg-muted overflow-hidden">
        <div className={`h-full ${tone} transition-all`} style={{ width: `${pct}%` }} />
        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold">{value}</span>
      </div>
    </div>
  );
}

interface AddJobOrderForm {
  client: string;
  title: string;
  role: string;
  positions: string;
  experienceMin: string;
  experienceMax: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  remote: boolean;
  skills: string;
  certifications: string;
  type: JobOrder["type"];
  priority: JobPriority;
  feeType: JobOrder["feeType"];
  feeValue: string;
  deadline: string;
}

function AddJobOrderDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const clients = Array.from(new Set(jobOrders.map((j) => j.clientName)));
  const [form, setForm] = React.useState<AddJobOrderForm>({
    client: "", title: "", role: "", positions: "1",
    experienceMin: "3", experienceMax: "8",
    salaryMin: "1200000", salaryMax: "2200000",
    location: "Bengaluru", remote: false,
    skills: "React, Node.js, TypeScript",
    certifications: "JOBSONN Full-Stack Certificate",
    type: "permanent", priority: "medium",
    feeType: "percentage", feeValue: "8.33",
    deadline: "",
  });

  const reset = () => {
    setForm({
      client: "", title: "", role: "", positions: "1",
      experienceMin: "3", experienceMax: "8",
      salaryMin: "1200000", salaryMax: "2200000",
      location: "Bengaluru", remote: false,
      skills: "React, Node.js, TypeScript",
      certifications: "JOBSONN Full-Stack Certificate",
      type: "permanent", priority: "medium",
      feeType: "percentage", feeValue: "8.33",
      deadline: "",
    });
  };

  const set = <K extends keyof AddJobOrderForm>(k: K, v: AddJobOrderForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create job order</DialogTitle>
          <DialogDescription>Open a hiring mandate on behalf of a client. All terms below are configurable.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client *</Label>
              <Select value={form.client} onValueChange={(v) => set("client", v)}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-role">Role</Label>
              <Input id="jo-role" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Full-Stack Developer" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jo-title">Job title *</Label>
            <Input id="jo-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jo-pos">Positions</Label>
              <Input id="jo-pos" type="number" min={1} value={form.positions} onChange={(e) => set("positions", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-emin">Exp. min (yrs)</Label>
              <Input id="jo-emin" type="number" min={0} value={form.experienceMin} onChange={(e) => set("experienceMin", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-emax">Exp. max (yrs)</Label>
              <Input id="jo-emax" type="number" min={0} value={form.experienceMax} onChange={(e) => set("experienceMax", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v as JobOrder["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="contract-to-hire">Contract-to-hire</SelectItem>
                  <SelectItem value="rpo">RPO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jo-smin">Salary min (₹)</Label>
              <Input id="jo-smin" type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-smax">Salary max (₹)</Label>
              <Input id="jo-smax" type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-loc">Location</Label>
              <Input id="jo-loc" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v as JobPriority)}>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Fee type</Label>
              <Select value={form.feeType} onValueChange={(v) => set("feeType", v as JobOrder["feeType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="retainer">Retainer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-fee">
                {form.feeType === "percentage" ? "Fee %" : "Fee (₹)"}
              </Label>
              <Input id="jo-fee" type="number" value={form.feeValue} onChange={(e) => set("feeValue", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jo-deadline">Deadline</Label>
              <Input id="jo-deadline" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jo-skills">Skills (comma-separated)</Label>
            <Textarea id="jo-skills" rows={2} value={form.skills} onChange={(e) => set("skills", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jo-certs">Certifications required (comma-separated)</Label>
            <Input id="jo-certs" value={form.certifications} onChange={(e) => set("certifications", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.remote} onCheckedChange={(v) => set("remote", v === true)} />
            <span>Remote eligible</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.client || !form.title) {
                toast.error("Client and job title are required");
                return;
              }
              onOpenChange(false);
              toast.success("Job order created", {
                description: `${form.title} at ${form.client} — ${form.positions} position(s)`,
              });
              reset();
            }}
          >
            Create job order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
