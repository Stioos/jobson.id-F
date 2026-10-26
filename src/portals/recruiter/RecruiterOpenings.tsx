"use client";

import * as React from "react";
import {
  Plus, Briefcase, MapPin, Users, Target, Clock, Building2, Wifi, Ban, Eye,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { openings, clientAccounts } from "@/lib/partner-data";
import type { Opening } from "@/lib/partner-data";

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const PIPELINE_SAMPLES: Record<string, { name: string; stage: string; match: number; submitted: string }[]> = {
  op_001: [
    { name: "Priya Nair", stage: "Offer", match: 92, submitted: "12d ago" },
    { name: "Meera Krishnan", stage: "HR Screen", match: 84, submitted: "3d ago" },
    { name: "Ravi Menon", stage: "Submitted", match: 78, submitted: "5d ago" },
    { name: "Sara Khan", stage: "Sourced", match: 71, submitted: "1d ago" },
  ],
  op_002: [
    { name: "Arjun Iyer", stage: "Interview", match: 88, submitted: "9d ago" },
    { name: "Ananya Das", stage: "Offer", match: 81, submitted: "14d ago" },
    { name: "Rohit Sen", stage: "Sourced", match: 74, submitted: "2d ago" },
  ],
  op_003: [
    { name: "Kavya Reddy", stage: "Placed", match: 95, submitted: "20d ago" },
    { name: "Sahil Khan", stage: "Coding Test", match: 86, submitted: "4d ago" },
    { name: "Neha Joshi", stage: "Submitted", match: 79, submitted: "6d ago" },
  ],
  op_004: [
    { name: "Vikram Singh", stage: "Rejected", match: 65, submitted: "7d ago" },
    { name: "Aman Verma", stage: "Sourced", match: 73, submitted: "2d ago" },
  ],
  op_005: [{ name: "Ritu Sharma", stage: "Placed", match: 90, submitted: "30d ago" }],
  op_006: [
    { name: "Karthik Rao", stage: "Submitted", match: 82, submitted: "4d ago" },
    { name: "Divya Prasad", stage: "Sourced", match: 75, submitted: "1d ago" },
    { name: "Imran Khan", stage: "Sourced", match: 68, submitted: "2d ago" },
  ],
};

const TIMELINE_TEMPLATE = [
  { label: "Opening created", offset: 30, done: true },
  { label: "Sourcing started", offset: 27, done: true },
  { label: "First submissions", offset: 22, done: true },
  { label: "Interview round 1", offset: 14, done: true },
  { label: "Offer release", offset: 5, done: false },
  { label: "Target close", offset: 0, done: false },
];

export function RecruiterOpenings() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Opening | null>(null);

  const clients = Array.from(new Set(openings.map((o) => o.clientName)));

  const filtered = openings.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (priorityFilter !== "all" && o.priority !== priorityFilter) return false;
    if (clientFilter !== "all" && o.clientName !== clientFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!o.title.toLowerCase().includes(q) && !o.clientName.toLowerCase().includes(q) && !o.department.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalOpenings = openings.length;
  const totalApproved = openings.reduce((a, o) => a + o.headcountApproved, 0);
  const totalFilled = openings.reduce((a, o) => a + o.headcountFilled, 0);
  const totalPipeline = openings.reduce((a, o) => a + o.headcountPipeline, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Openings & headcount"
        description="Active requisitions with approved headcount, pipeline progress, and fee-per-placement tracking."
        actions={[{ label: "Create opening", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total openings" value={totalOpenings} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Approved headcount" value={totalApproved} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Filled" value={totalFilled} icon={<Target className="h-5 w-5" />} tone="success" hint={`${Math.round((totalFilled / Math.max(totalApproved, 1)) * 100)}% fulfilled`} />
        <StatCard label="In pipeline" value={totalPipeline} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Across all stages" />
      </div>

      <SectionCard
        title="Openings"
        description="Click an opening to see its candidate pipeline, timeline, and fee details."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search title, client, dept…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
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
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No openings match"
            description="Adjust filters or create a new opening."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden lg:table-cell">Experience</TableHead>
                  <TableHead className="hidden lg:table-cell">Salary range</TableHead>
                  <TableHead className="text-center">Headcount</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Priority</TableHead>
                  <TableHead className="hidden xl:table-cell text-center">Target</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const filledPct = o.headcountApproved > 0 ? (o.headcountFilled / o.headcountApproved) * 100 : 0;
                  return (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => setDetail(o)}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-medium">{o.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {o.location}
                            {o.remote && <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">Remote</Badge>}
                          </p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{o.clientName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={o.clientName} size="xs" />
                          <span className="text-sm truncate">{o.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {o.experienceMin}–{o.experienceMax} yrs
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {formatCurrency(o.salaryMin, "INR" as Currency)} – {formatCurrency(o.salaryMax, "INR" as Currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-1 min-w-[80px]">
                          <span className="text-xs font-medium">{o.headcountFilled}/{o.headcountApproved}</span>
                          <Progress value={filledPct} className="h-1.5 w-16" />
                          <span className="text-[10px] text-muted-foreground">{o.headcountPipeline} in pipeline</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[o.priority]}`}>
                          {o.priority}
                        </span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-center text-xs">
                        <span className={daysUntil(o.targetDate) < 7 ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"}>
                          {daysUntil(o.targetDate)}d left
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right text-xs font-medium">
                        {formatCurrency(o.feePerPlacement, "INR" as Currency)}
                      </TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <CreateOpeningDialog open={addOpen} onOpenChange={setAddOpen} clients={clients} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <OpeningDetail opening={detail} onClose={() => setDetail(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateOpeningDialog({
  open, onOpenChange, clients,
}: { open: boolean; onOpenChange: (v: boolean) => void; clients: string[] }) {
  const [title, setTitle] = React.useState("");
  const [client, setClient] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [headcount, setHeadcount] = React.useState("1");
  const [expMin, setExpMin] = React.useState("3");
  const [expMax, setExpMax] = React.useState("6");
  const [salaryMin, setSalaryMin] = React.useState("1200000");
  const [salaryMax, setSalaryMax] = React.useState("2000000");
  const [location, setLocation] = React.useState("Bengaluru");
  const [remote, setRemote] = React.useState(false);
  const [priority, setPriority] = React.useState("medium");
  const [targetDate, setTargetDate] = React.useState("");
  const [hiringManager, setHiringManager] = React.useState("");
  const [fee, setFee] = React.useState("100000");

  const submit = () => {
    if (!title || !client) {
      toast.error("Title and client are required");
      return;
    }
    toast.success(`Opening "${title}" created for ${client}`);
    onOpenChange(false);
    setTitle(""); setClient(""); setDepartment(""); setHeadcount("1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create opening</DialogTitle>
          <DialogDescription>Define a new headcount-approved opening against a job order.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" />
          </div>
          <div className="space-y-2">
            <Label>Headcount approved</Label>
            <Input type="number" min={1} value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
          </div>
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label>Experience (yrs)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" value={expMin} onChange={(e) => setExpMin(e.target.value)} />
              <span className="text-muted-foreground">–</span>
              <Input type="number" value={expMax} onChange={(e) => setExpMax(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Salary range (₹)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              <span className="text-muted-foreground">–</span>
              <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Target close date</Label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Hiring manager</Label>
            <Input value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="e.g. Rohan Mehta" />
          </div>
          <div className="space-y-2">
            <Label>Fee per placement (₹)</Label>
            <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
            <div>
              <Label className="cursor-pointer">Remote-eligible</Label>
              <p className="text-xs text-muted-foreground">Allow candidates to work remotely</p>
            </div>
            <Switch checked={remote} onCheckedChange={setRemote} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create opening</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OpeningDetail({ opening, onClose }: { opening: Opening; onClose: () => void }) {
  const pipeline = PIPELINE_SAMPLES[opening.id] ?? [];
  const client = clientAccounts.find((c) => c.name === opening.clientName);
  const filledPct = opening.headcountApproved > 0 ? (opening.headcountFilled / opening.headcountApproved) * 100 : 0;
  const days = daysUntil(opening.targetDate);

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={opening.clientName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{opening.title}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {opening.clientName}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {opening.location}</span>
              {opening.remote && <Badge variant="outline" className="h-4 px-1 text-[10px]"><Wifi className="h-3 w-3" /> Remote</Badge>}
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={opening.status} />
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[opening.priority]}`}>{opening.priority}</span>
        </div>
      </SheetHeader>

      <div className="space-y-5 mt-5">
        {/* Headcount + Fee */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Headcount filled</p>
            <p className="text-xl font-semibold">{opening.headcountFilled}/{opening.headcountApproved}</p>
            <Progress value={filledPct} className="h-1.5 mt-2" />
            <p className="text-[10px] text-muted-foreground mt-1">{opening.headcountPipeline} in pipeline</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Fee per placement</p>
            <p className="text-xl font-semibold">{formatCurrency(opening.feePerPlacement, "INR" as Currency)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Potential: {formatCurrency(opening.feePerPlacement * opening.headcountApproved, "INR" as Currency)}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="font-medium">{opening.experienceMin}–{opening.experienceMax} yrs</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Salary range</p>
            <p className="font-medium text-xs">{formatCurrency(opening.salaryMin, "INR" as Currency)} – {formatCurrency(opening.salaryMax, "INR" as Currency)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="font-medium">{opening.department}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Hiring manager</p>
            <p className="font-medium">{opening.hiringManager}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Target date</p>
            <p className="font-medium">{formatDate(opening.targetDate)}</p>
            <p className={`text-[10px] ${days < 7 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>{days}d remaining</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Client tier</p>
            <p className="font-medium capitalize">{client?.tier ?? "—"}</p>
          </div>
        </div>

        {/* Pipeline */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Pipeline candidates ({pipeline.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto scroll-thin">
            {pipeline.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 text-center border rounded-lg">No candidates in pipeline yet.</p>
            ) : pipeline.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-2 hover:bg-muted/50 transition-colors">
                <AvatarLogo text={c.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.stage} • submitted {c.submitted}</p>
                </div>
                <Badge variant="outline" className="text-xs">{c.match}% match</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Timeline</h4>
          <ol className="relative border-l border-border ml-2 space-y-3">
            {TIMELINE_TEMPLATE.map((t, i) => (
              <li key={i} className="ml-4">
                <span className={`absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background ${t.done ? "bg-brand" : "bg-muted-foreground/30"}`} />
                <p className={`text-sm ${t.done ? "font-medium" : "text-muted-foreground"}`}>{t.label}</p>
                <p className="text-[10px] text-muted-foreground">{t.offset === 0 ? "Upcoming" : `${t.offset}d ago`}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button size="sm" onClick={() => toast.success(`Source candidates for "${opening.title}"`)}><Plus className="h-3.5 w-3.5" /> Source candidates</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Client update sent")}><Building2 className="h-3.5 w-3.5" /> Send client update</Button>
          {opening.status === "open" && (
            <Button size="sm" variant="outline" onClick={() => toast.success("Opening put on hold")}><Ban className="h-3.5 w-3.5" /> Put on hold</Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}><Eye className="h-3.5 w-3.5" /> Close</Button>
        </div>
      </div>
    </>
  );
}
