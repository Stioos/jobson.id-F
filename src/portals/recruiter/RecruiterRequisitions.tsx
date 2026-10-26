"use client";

import * as React from "react";
import { Plus, Briefcase, MapPin, Users, Calendar } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
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
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { requisitions, type Requisition } from "@/lib/portal-data";

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function RecruiterRequisitions() {
  const [search, setSearch] = React.useState("");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Requisition | null>(null);

  const clients = Array.from(new Set(requisitions.map((r) => r.clientName)));

  const filtered = requisitions.filter((r) => {
    if (clientFilter !== "all" && r.clientName !== clientFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const open = requisitions.filter((r) => r.status === "open").length;
  const filled = requisitions.filter((r) => r.status === "filled").length;
  const closed = requisitions.filter((r) => r.status === "closed").length;
  const totalOpenings = requisitions.reduce((a, r) => a + (r.status === "open" ? r.openings : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client requisitions"
        description="Active job openings from your clients. Track submissions, interviews, and placements per requisition."
        actions={[{ label: "Add requisition", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Open reqs" value={open} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open openings" value={totalOpenings} icon={<Users className="h-5 w-5" />} tone="default" hint="Total positions to fill" />
        <StatCard label="Filled (YTD)" value={filled} icon={<Calendar className="h-5 w-5" />} tone="success" />
        <StatCard label="Closed" value={closed} icon={<Briefcase className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Requisitions"
        description="Click a requisition to view pipeline and fee terms."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-8 w-44"><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="on_hold">On hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No requisitions match"
            description="Adjust filters or add a new requisition to get started."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Requisition</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-center">Openings</TableHead>
                  <TableHead className="text-center">Submitted</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Interviews</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Placed</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setDetail(r)}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.clientName} size="xs" />
                        <span className="text-sm">{r.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {r.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{r.openings}</TableCell>
                    <TableCell className="text-center">{r.submittedCount}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center">{r.interviewCount}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center">{r.placementCount}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[r.priority]}`}>
                        {r.priority}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <AddRequisitionDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && <RequisitionDetail req={detail} onClose={() => setDetail(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RequisitionDetail({ req, onClose }: { req: Requisition; onClose: () => void }) {
  const daysToTarget = daysUntil(req.targetHireDate);
  const fillRate = req.submittedCount > 0 ? Math.round((req.placementCount / req.submittedCount) * 100) : 0;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={req.clientName} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{req.title}</div>
            <div className="text-xs text-muted-foreground">{req.clientName} · {req.department}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Requisition details</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={req.status} />
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[req.priority]}`}>
            {req.priority} priority
          </span>
          <Badge variant="outline" className="capitalize">{req.workArrangement}</Badge>
          {daysToTarget > 0 ? (
            <Badge variant="outline" className={daysToTarget < 14 ? "text-amber-600 border-amber-500/30" : ""}>
              {daysToTarget} days to target
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Target passed</Badge>
          )}
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Fee terms</h4>
          <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Basis</dt>
            <dd className="text-right font-medium capitalize">{req.feeBasis}</dd>
            <dt className="text-muted-foreground">Rate / value</dt>
            <dd className="text-right font-semibold">
              {req.feeBasis === "percentage" ? `${req.feeValue}%` : formatCurrency(req.feeValue)}
            </dd>
            <dt className="text-muted-foreground">Salary band</dt>
            <dd className="text-right">{formatCurrency(req.salaryMin)} – {formatCurrency(req.salaryMax)}</dd>
            <dt className="text-muted-foreground">Openings</dt>
            <dd className="text-right">{req.openings}</dd>
          </dl>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pipeline</span>
            <span className="font-medium">{fillRate}% conversion</span>
          </div>
          <Progress value={fillRate} className="mt-1 h-1.5" />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border bg-card p-2">
              <p className="text-base font-semibold">{req.submittedCount}</p>
              <p className="text-muted-foreground">Submitted</p>
            </div>
            <div className="rounded-lg border bg-card p-2">
              <p className="text-base font-semibold">{req.interviewCount}</p>
              <p className="text-muted-foreground">Interviews</p>
            </div>
            <div className="rounded-lg border bg-card p-2">
              <p className="text-base font-semibold">{req.placementCount}</p>
              <p className="text-muted-foreground">Placed</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Recruiter</p>
            <p className="mt-0.5 text-sm font-medium">{req.recruiterName}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground">Target hire date</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(req.targetHireDate)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => {
            onClose();
            toast.success("Source candidates", { description: `Opening sourcing for ${req.title}` });
          }}>
            Source candidates
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Link copied", { description: req.id })}>
            Copy req ID
          </Button>
        </div>
      </div>
    </>
  );
}

function AddRequisitionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [client, setClient] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [openings, setOpenings] = React.useState("1");
  const [priority, setPriority] = React.useState("medium");
  const [salaryMin, setSalaryMin] = React.useState("");
  const [salaryMax, setSalaryMax] = React.useState("");
  const [feeBasis, setFeeBasis] = React.useState<"percentage" | "fixed">("percentage");
  const [feeValue, setFeeValue] = React.useState("8.33");
  const [notes, setNotes] = React.useState("");

  const reset = () => {
    setClient(""); setTitle(""); setDepartment(""); setOpenings("1"); setPriority("medium");
    setSalaryMin(""); setSalaryMax(""); setFeeBasis("percentage"); setFeeValue("8.33"); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New requisition</DialogTitle>
          <DialogDescription>Open a new role on behalf of a client. Fee terms are configurable per requisition.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {Array.from(new Set(requisitions.map((r) => r.clientName))).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="r-title">Job title</Label>
              <Input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
            </div>
            <div>
              <Label htmlFor="r-dept">Department</Label>
              <Input id="r-dept" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="r-open">Openings</Label>
              <Input id="r-open" type="number" min={1} value={openings} onChange={(e) => setOpenings(e.target.value)} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fee basis</Label>
              <Select value={feeBasis} onValueChange={(v: "percentage" | "fixed") => setFeeBasis(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="r-smin">Salary min (₹)</Label>
              <Input id="r-smin" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="1500000" />
            </div>
            <div>
              <Label htmlFor="r-smax">Salary max (₹)</Label>
              <Input id="r-smax" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="2400000" />
            </div>
            <div>
              <Label htmlFor="r-fee">{feeBasis === "percentage" ? "Fee %" : "Fee (₹)"}</Label>
              <Input id="r-fee" type="number" value={feeValue} onChange={(e) => setFeeValue(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="r-notes">Notes</Label>
            <Textarea id="r-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Must-have skills, target hire date, etc." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!client || !title) {
                toast.error("Client and job title are required");
                return;
              }
              onOpenChange(false);
              toast.success("Requisition created", { description: `${title} at ${client} — ${openings} opening(s)` });
              reset();
            }}
          >
            Create requisition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
