"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { ShieldCheck, Plus, Building2, GraduationCap, Gavel, MapPin, Flag } from "lucide-react";

type BgvType = "Employment" | "Education" | "Criminal" | "Address";
type BgvStatus = "Initiated" | "In Progress" | "Completed" | "Flagged";

interface BgvCheck {
  id: string;
  candidateName: string;
  type: BgvType;
  vendor: string;
  status: BgvStatus;
  initiatedAt: string;
  completedAt?: string;
  notes?: string;
}

const DAY = 86400000;
const now = Date.now();

const INITIAL: BgvCheck[] = [
  { id: "bgv1", candidateName: "Priya Nair", type: "Employment", vendor: "AuthBridge", status: "Completed", initiatedAt: new Date(now - 20 * DAY).toISOString(), completedAt: new Date(now - 12 * DAY).toISOString(), notes: "All 3 employers verified." },
  { id: "bgv2", candidateName: "Priya Nair", type: "Education", vendor: "IDfy", status: "Completed", initiatedAt: new Date(now - 20 * DAY).toISOString(), completedAt: new Date(now - 14 * DAY).toISOString(), notes: "IIT Madras degree confirmed." },
  { id: "bgv3", candidateName: "Priya Nair", type: "Address", vendor: "AuthBridge", status: "In Progress", initiatedAt: new Date(now - 8 * DAY).toISOString(), notes: "Physical visit scheduled." },
  { id: "bgv4", candidateName: "Arjun Mehta", type: "Employment", vendor: "Quinfy", status: "Flagged", initiatedAt: new Date(now - 25 * DAY).toISOString(), notes: "Discrepancy in dates at previous employer." },
  { id: "bgv5", candidateName: "Arjun Mehta", type: "Criminal", vendor: "IDfy", status: "Completed", initiatedAt: new Date(now - 25 * DAY).toISOString(), completedAt: new Date(now - 18 * DAY).toISOString(), notes: "Clear record." },
  { id: "bgv6", candidateName: "Sneha Reddy", type: "Employment", vendor: "AuthBridge", status: "In Progress", initiatedAt: new Date(now - 5 * DAY).toISOString(), notes: "Awaiting response from current employer." },
  { id: "bgv7", candidateName: "Sneha Reddy", type: "Education", vendor: "IDfy", status: "Initiated", initiatedAt: new Date(now - 2 * DAY).toISOString() },
  { id: "bgv8", candidateName: "Karthik Rao", type: "Address", vendor: "Quinfy", status: "Completed", initiatedAt: new Date(now - 30 * DAY).toISOString(), completedAt: new Date(now - 22 * DAY).toISOString(), notes: "Address verified." },
];

const TYPE_ICON: Record<BgvType, React.ReactNode> = {
  Employment: <Building2 className="h-3.5 w-3.5" />,
  Education: <GraduationCap className="h-3.5 w-3.5" />,
  Criminal: <Gavel className="h-3.5 w-3.5" />,
  Address: <MapPin className="h-3.5 w-3.5" />,
};

const STATUS_CLS: Record<BgvStatus, string> = {
  "Initiated": "bg-slate-500/10 text-slate-600 border-slate-500/20",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Flagged": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function EmployerBGV() {
  const [list, setList] = React.useState<BgvCheck[]>(INITIAL);
  const [statusFilter, setStatusFilter] = React.useState<"all" | BgvStatus>("all");
  const [typeFilter, setTypeFilter] = React.useState<"all" | BgvType>("all");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ candidateName: "", type: "Employment" as BgvType, vendor: "AuthBridge", notes: "" });

  const filtered = list.filter((c) => (statusFilter === "all" || c.status === statusFilter) && (typeFilter === "all" || c.type === typeFilter));

  const counts = {
    initiated: list.filter((c) => c.status === "Initiated").length,
    inProgress: list.filter((c) => c.status === "In Progress").length,
    completed: list.filter((c) => c.status === "Completed").length,
    flagged: list.filter((c) => c.status === "Flagged").length,
  };

  const create = () => {
    if (!form.candidateName) { toast.error("Candidate name is required"); return; }
    const check: BgvCheck = {
      id: `bgv_${Date.now()}`,
      candidateName: form.candidateName,
      type: form.type,
      vendor: form.vendor,
      status: "Initiated",
      initiatedAt: new Date().toISOString(),
      notes: form.notes || undefined,
    };
    setList([check, ...list]);
    setOpen(false);
    setForm({ candidateName: "", type: "Employment", vendor: "AuthBridge", notes: "" });
    toast.success("BGV initiated", { description: `${form.type} check for ${form.candidateName} via ${form.vendor}` });
  };

  const advance = (id: string) => {
    setList((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const next: BgvStatus = c.status === "Initiated" ? "In Progress" : c.status === "In Progress" ? "Completed" : c.status;
      const completed = next === "Completed" ? new Date().toISOString() : c.completedAt;
      return { ...c, status: next, completedAt: completed };
    }));
    toast.success("BGV status updated");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Background Verification"
        description="Track employment, education, criminal and address verification checks across vendors."
        actions={[{ label: "Initiate BGV", icon: "Plus", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Initiated" value={counts.initiated} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Progress" value={counts.inProgress} icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={counts.completed} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Flagged" value={counts.flagged} icon={<Flag className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Verification checks" description={`${filtered.length} of ${list.length} checks`}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Initiated">Initiated</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Employment">Employment</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Criminal">Criminal</SelectItem>
              <SelectItem value="Address">Address</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No checks found" description="Try adjusting your filters or initiate a new BGV." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={c.candidateName} size="xs" />
                        <span className="text-sm font-medium">{c.candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1 text-xs">{TYPE_ICON[c.type]}{c.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.vendor}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[c.status]}`}>{c.status}</span></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.initiatedAt)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.completedAt ? formatDate(c.completedAt) : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate" title={c.notes}>{c.notes ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {(c.status === "Initiated" || c.status === "In Progress") && (
                        <Button size="sm" variant="outline" onClick={() => advance(c.id)}>
                          {c.status === "Initiated" ? "Start" : "Complete"}
                        </Button>
                      )}
                      {c.status === "Flagged" && (
                        <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.info("Reviewing flag")}>Review</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate background verification</DialogTitle>
            <DialogDescription>Start a new verification check with a partner vendor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Candidate name *</Label>
              <Input placeholder="e.g. Priya Nair" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Check type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as BgvType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                    <SelectItem value="Address">Address</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Vendor</Label>
                <Select value={form.vendor} onValueChange={(v) => setForm({ ...form, vendor: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AuthBridge">AuthBridge</SelectItem>
                    <SelectItem value="IDfy">IDfy</SelectItem>
                    <SelectItem value="Quinfy">Quinfy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Optional context for the vendor" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create}><ShieldCheck className="mr-2 h-4 w-4" /> Initiate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
