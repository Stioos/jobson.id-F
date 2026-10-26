"use client";

import * as React from "react";
import {
  Plus, Clock, FileSpreadsheet, CheckCircle2, IndianRupee, Hourglass, Download,
  Check,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { timesheets as initialTimesheets } from "@/lib/partner-data";
import type { Timesheet } from "@/lib/partner-types";

const WEEK_OPTIONS = (() => {
  const now = Date.now();
  const out: { value: string; label: string; start: number; end: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const end = now - i * 7 * 86400000;
    const start = end - 6 * 86400000;
    out.push({
      value: `w_${i}`,
      label: i === 0 ? "This week" : `${i} week${i > 1 ? "s" : ""} ago`,
      start, end,
    });
  }
  return out;
})();

function inWeek(iso: string, start: number, end: number) {
  const t = new Date(iso).getTime();
  return t >= start && t <= end;
}

export function RecruiterTimesheets() {
  const [timesheets, setTimesheets] = React.useState<Timesheet[]>(initialTimesheets);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [weekFilter, setWeekFilter] = React.useState("all");
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = timesheets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.candidateName.toLowerCase().includes(q) && !t.clientName.toLowerCase().includes(q)) return false;
    }
    if (weekFilter !== "all") {
      const w = WEEK_OPTIONS.find((o) => o.value === weekFilter);
      if (w && !inWeek(t.weekStart, w.start, w.end)) return false;
    }
    return true;
  });

  const totalHours = timesheets.reduce((a, t) => a + t.hours, 0);
  const billableAmount = timesheets.reduce((a, t) => a + t.amount, 0);
  const pendingCount = timesheets.filter((t) => t.status === "submitted" || t.status === "draft").length;

  const toggleSel = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const approveOne = (id: string) => {
    setTimesheets((prev) => prev.map((t) => t.id === id ? { ...t, status: "approved", approvedBy: "Karthik Subramanian" } : t));
    toast.success("Timesheet approved", { description: id });
  };

  const bulkApprove = () => {
    if (selected.size === 0) {
      toast.error("Select at least one timesheet");
      return;
    }
    let count = 0;
    setTimesheets((prev) => prev.map((t) => {
      if (selected.has(t.id) && (t.status === "submitted" || t.status === "draft")) {
        count++;
        return { ...t, status: "approved", approvedBy: "Karthik Subramanian" };
      }
      return t;
    }));
    toast.success(`${count} timesheet(s) approved`);
    setSelected(new Set());
  };

  const exportCsv = () => {
    toast.success("Export started", { description: `${filtered.length} timesheet(s) → CSV` });
  };

  const submittedSelIds = Array.from(selected).filter((id) => {
    const t = timesheets.find((x) => x.id === id);
    return t && (t.status === "submitted" || t.status === "draft");
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timesheets"
        description="Track weekly hours for contract placements. Submit, approve, and invoice timesheets per candidate."
        actions={[{ label: "Submit timesheet", onClick: () => setSubmitOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total hours" value={totalHours} icon={<Clock className="h-5 w-5" />} tone="brand" />
        <StatCard label="Billable amount" value={formatCurrency(billableAmount)} icon={<IndianRupee className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending approval" value={pendingCount} icon={<Hourglass className="h-5 w-5" />} tone="warning" hint="Submitted or draft" />
        <StatCard label="Approved" value={timesheets.filter((t) => t.status === "approved" || t.status === "invoiced").length} icon={<CheckCircle2 className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard
        title="Timesheets"
        description="Approve submitted timesheets individually or in bulk. Invoiced entries are locked."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="invoiced">Invoiced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={weekFilter} onValueChange={setWeekFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Week" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All weeks</SelectItem>
                {WEEK_OPTIONS.map((w) => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        }
      >
        {selected.size > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-brand/5 p-2">
            <span className="text-xs font-medium text-brand">{selected.size} selected</span>
            <span className="text-xs text-muted-foreground">({submittedSelIds.length} approvable)</span>
            <Button size="sm" variant="default" className="h-7" onClick={bulkApprove}>
              <Check className="h-3.5 w-3.5 mr-1" /> Bulk approve
            </Button>
            <Button size="sm" variant="ghost" className="h-7" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet className="h-5 w-5" />}
            title="No timesheets match"
            description="Adjust filters or submit a new timesheet."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Candidate / Client</TableHead>
                  <TableHead className="hidden md:table-cell">Week</TableHead>
                  <TableHead className="text-center">Hours</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Billable</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Approved by</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => {
                  const approvable = t.status === "submitted" || t.status === "draft";
                  const isSel = selected.has(t.id);
                  return (
                    <TableRow key={t.id} className={isSel ? "bg-brand/5" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={isSel}
                          onCheckedChange={() => toggleSel(t.id)}
                          aria-label={`Select ${t.candidateName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={t.candidateName} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{t.candidateName}</p>
                            <p className="text-xs text-muted-foreground">{t.clientName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs">
                        {formatDate(t.weekStart, { day: "numeric", month: "short" })} – {formatDate(t.weekEnd, { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">{t.hours}h</TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-sm">
                        <span className={t.billableHours < t.hours ? "text-amber-600" : ""}>{t.billableHours}h</span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(t.amount)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{t.approvedBy ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-right">
                        {approvable ? (
                          <Button size="sm" variant="outline" className="h-7" onClick={() => approveOne(t.id)}>
                            Approve
                          </Button>
                        ) : t.status === "invoiced" ? (
                          <Badge variant="outline" className="text-[10px]">Locked</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
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

      <SubmitTimesheetDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSubmit={(ts) => {
          setTimesheets((prev) => [ts, ...prev]);
          toast.success("Timesheet submitted", { description: `${ts.candidateName} · ${ts.hours}h · ${formatCurrency(ts.amount)}` });
        }}
      />
    </div>
  );
}

const CANDIDATES = ["Arjun Iyer", "Kavya Reddy", "Vikram Singh", "Neha Gupta", "Rahul Mehta"];
const CLIENTS = ["TechCorp India", "DataMinds AI", "FinEdge Solutions", "SecureBank"];

function SubmitTimesheetDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (ts: Timesheet) => void;
}) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [weekStart, setWeekStart] = React.useState("");
  const [hours, setHours] = React.useState("40");
  const [billableHours, setBillableHours] = React.useState("40");
  const [rate, setRate] = React.useState("1500");

  const reset = () => {
    setCandidate(""); setClient(""); setWeekStart("");
    setHours("40"); setBillableHours("40"); setRate("1500");
  };

  const weekEnd = weekStart ? new Date(new Date(weekStart).getTime() + 6 * 86400000).toISOString() : "";
  const amount = (Number(billableHours) || 0) * (Number(rate) || 0);

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit timesheet</DialogTitle>
          <DialogDescription>Log weekly hours for a contract placement. Submitting sends it to the client for approval.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Candidate *</Label>
              <Select value={candidate} onValueChange={setCandidate}>
                <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {CANDIDATES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Client *</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {CLIENTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ts-ws">Week start (Monday) *</Label>
            <Input id="ts-ws" type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
            {weekEnd && <p className="text-xs text-muted-foreground">Week ending: {formatDate(weekEnd)}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ts-h">Total hours</Label>
              <Input id="ts-h" type="number" min={0} max={168} value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ts-bh">Billable hours</Label>
              <Input id="ts-bh" type="number" min={0} max={168} value={billableHours} onChange={(e) => setBillableHours(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ts-r">Rate (₹/hr)</Label>
              <Input id="ts-r" type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Billable amount</span>
              <span className="text-base font-semibold text-brand">{formatCurrency(amount)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!candidate || !client || !weekStart) {
                toast.error("Candidate, client, and week start are required");
                return;
              }
              onSubmit({
                id: `ts_${Date.now()}`,
                candidateName: candidate,
                clientName: client,
                weekStart: new Date(weekStart).toISOString(),
                weekEnd: weekEnd,
                hours: Number(hours),
                billableHours: Number(billableHours),
                status: "submitted",
                amount,
              });
              onOpenChange(false);
              reset();
            }}
          >
            Submit timesheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
