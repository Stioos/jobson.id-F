"use client";

import * as React from "react";
import { Briefcase, Users, ArrowRight, ArrowLeftRight } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";
import { requisitions as initialReqs, recruiterRecords, type Requisition } from "@/lib/portal-data";

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function AgencyRequisitions() {
  const [reqs, setReqs] = React.useState<Requisition[]>(initialReqs);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [reassign, setReassign] = React.useState<Requisition | null>(null);

  const clients = Array.from(new Set(reqs.map((r) => r.clientName)));
  const filtered = reqs.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (clientFilter !== "all" && r.clientName !== clientFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const open = reqs.filter((r) => r.status === "open").length;
  const filled = reqs.filter((r) => r.status === "filled").length;
  const closed = reqs.filter((r) => r.status === "closed").length;
  const totalOpenings = reqs.reduce((a, r) => a + (r.status === "open" ? r.openings : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requisitions"
        description="All client requisitions across the agency. Reassign requisitions between recruiters as needed."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Open reqs" value={open} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open openings" value={totalOpenings} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Filled YTD" value={filled} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Closed" value={closed} icon={<Briefcase className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="All requisitions"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
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
          <EmptyState icon={<Briefcase className="h-5 w-5" />} title="No requisitions match" description="Adjust your filters." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Requisition</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Assigned recruiter</TableHead>
                  <TableHead className="text-center">Openings</TableHead>
                  <TableHead className="text-center">Subs</TableHead>
                  <TableHead className="text-center">Placed</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.department}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.clientName} size="xs" />
                        <span className="text-sm">{r.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{r.recruiterName}</TableCell>
                    <TableCell className="text-center text-sm">{r.openings}</TableCell>
                    <TableCell className="text-center text-sm">{r.submittedCount}</TableCell>
                    <TableCell className="text-center text-sm">{r.placementCount}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[r.priority]}`}>{r.priority}</span>
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><ArrowLeftRight className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setReassign(r)}>Reassign recruiter</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success("Status update dialog opened")}>Change status</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success(`Closing req ${r.id}`)}>Mark as closed</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Status overview" description="Distribution of requisition statuses">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Open", value: open, tone: "text-emerald-600" },
            { label: "Filled", value: filled, tone: "text-emerald-600" },
            { label: "Closed", value: closed, tone: "text-slate-500" },
            { label: "On hold", value: reqs.filter((r) => r.status === "on_hold").length, tone: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border p-3 text-center">
              <p className={`text-2xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <ReassignDialog
        req={reassign}
        onOpenChange={(v) => !v && setReassign(null)}
        onReassign={(recruiterId, recruiterName) => {
          if (reassign) {
            setReqs((prev) => prev.map((r) => r.id === reassign.id ? { ...r, recruiterId, recruiterName } : r));
            toast.success("Requisition reassigned", { description: `${reassign.title} → ${recruiterName}` });
          }
          setReassign(null);
        }}
      />
    </div>
  );
}

function ReassignDialog({
  req, onOpenChange, onReassign,
}: {
  req: Requisition | null;
  onOpenChange: (v: boolean) => void;
  onReassign: (recruiterId: string, recruiterName: string) => void;
}) {
  const [recruiterId, setRecruiterId] = React.useState("");
  React.useEffect(() => { setRecruiterId(""); }, [req]);

  return (
    <Dialog open={!!req} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign requisition</DialogTitle>
          <DialogDescription>
            {req && (<>Reassign <strong>{req.title}</strong> ({req.clientName}) from {req.recruiterName} to another recruiter.</>)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>New recruiter</Label>
            <Select value={recruiterId} onValueChange={setRecruiterId}>
              <SelectTrigger><SelectValue placeholder="Select recruiter" /></SelectTrigger>
              <SelectContent>
                {recruiterRecords.map((r) => (
                  <SelectItem key={r.id} value={r.id} disabled={r.id === req?.recruiterId}>
                    {r.name} ({r.role}) — {r.activeReqs} active reqs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!recruiterId}
            onClick={() => {
              const r = recruiterRecords.find((x) => x.id === recruiterId);
              if (r) onReassign(r.id, r.name);
            }}
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
