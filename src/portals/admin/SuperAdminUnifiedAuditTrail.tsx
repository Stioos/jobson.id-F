"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

type RecordType = "Placement" | "Application" | "Transaction" | "Offer" | "Enrollment";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Training" | "Partner" | "Cross-Portal" | "Finance";
type AuditAction = "Created" | "Updated" | "Viewed" | "Deleted" | "Approved" | "Rejected";

interface AuditEntry {
  timestamp: string;
  portal: Portal;
  user: string;
  action: AuditAction;
  fieldChanges?: { field: string; from: string; to: string }[];
  ip: string;
}

interface AuditRecord {
  id: string;
  type: RecordType;
  summary: string;
  entries: AuditEntry[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Cross-Portal": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Finance: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const ACTION_TONES: Record<AuditAction, string> = {
  Created: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Updated: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Viewed: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Deleted: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const RECORDS: AuditRecord[] = [
  { id: "PL-9001", type: "Placement", summary: "Aarav Sharma → TechCorp India · Senior Frontend Engineer · ₹24L", entries: [
    { timestamp: "2024-09-10T08:00:00Z", portal: "Candidate", user: "Aarav Sharma", action: "Created", ip: "103.21.45.10" },
    { timestamp: "2024-09-11T10:00:00Z", portal: "Recruiter", user: "TalentBridge Recruiter", action: "Updated", fieldChanges: [{ field: "status", from: "Applied", to: "Submitted" }], ip: "203.0.113.5" },
    { timestamp: "2024-09-12T14:00:00Z", portal: "Employer", user: "TechCorp HM", action: "Viewed", ip: "49.205.45.12" },
    { timestamp: "2024-09-13T11:00:00Z", portal: "Employer", user: "TechCorp HM", action: "Updated", fieldChanges: [{ field: "stage", from: "Screening", to: "Interview" }], ip: "49.205.45.12" },
    { timestamp: "2024-09-17T15:00:00Z", portal: "Training", user: "CodeCraft Bootcamp", action: "Approved", fieldChanges: [{ field: "certification", from: "pending", to: "verified" }], ip: "152.59.84.2" },
    { timestamp: "2024-09-18T10:00:00Z", portal: "Employer", user: "TechCorp HM", action: "Created", ip: "49.205.45.12" },
    { timestamp: "2024-09-19T08:00:00Z", portal: "Candidate", user: "Aarav Sharma", action: "Approved", fieldChanges: [{ field: "offer_status", from: "pending", to: "accepted" }], ip: "103.21.45.10" },
    { timestamp: "2024-09-19T09:00:00Z", portal: "Cross-Portal", user: "System", action: "Created", ip: "internal" },
    { timestamp: "2024-09-19T09:30:00Z", portal: "Finance", user: "Finance Bot", action: "Created", fieldChanges: [{ field: "commission", from: "—", to: "₹1.2L" }], ip: "internal" },
  ]},
  { id: "AP-7001", type: "Application", summary: "Diya Patel applied to CloudOps Solutions · DevOps Engineer", entries: [
    { timestamp: "2024-09-15T09:00:00Z", portal: "Candidate", user: "Diya Patel", action: "Created", ip: "103.21.45.20" },
    { timestamp: "2024-09-15T09:05:00Z", portal: "Candidate", user: "System", action: "Updated", fieldChanges: [{ field: "ai_score", from: "—", to: "82" }], ip: "internal" },
    { timestamp: "2024-09-15T11:00:00Z", portal: "Employer", user: "CloudOps HM", action: "Viewed", ip: "49.205.45.20" },
    { timestamp: "2024-09-16T10:00:00Z", portal: "Employer", user: "CloudOps HM", action: "Updated", fieldChanges: [{ field: "stage", from: "Applied", to: "Screening" }], ip: "49.205.45.20" },
    { timestamp: "2024-09-18T14:00:00Z", portal: "Employer", user: "CloudOps HM", action: "Updated", fieldChanges: [{ field: "stage", from: "Screening", to: "Interview" }], ip: "49.205.45.20" },
    { timestamp: "2024-09-21T14:30:00Z", portal: "Employer", user: "CloudOps HM", action: "Updated", fieldChanges: [{ field: "interview_status", from: "scheduled", to: "completed" }], ip: "49.205.45.20" },
  ]},
  { id: "TX-2001", type: "Transaction", summary: "Job Posting Fee · TechCorp India · ₹15,000", entries: [
    { timestamp: "2024-09-01T09:00:00Z", portal: "Employer", user: "TechCorp HR", action: "Created", fieldChanges: [{ field: "amount", from: "—", to: "₹15,000" }], ip: "49.205.45.12" },
    { timestamp: "2024-09-01T09:01:00Z", portal: "Finance", user: "Payment Gateway", action: "Updated", fieldChanges: [{ field: "status", from: "initiated", to: "captured" }], ip: "internal" },
    { timestamp: "2024-09-01T09:05:00Z", portal: "Finance", user: "Finance Bot", action: "Approved", fieldChanges: [{ field: "invoice", from: "—", to: "INV-2024-001" }], ip: "internal" },
    { timestamp: "2024-09-01T09:06:00Z", portal: "Cross-Portal", user: "System", action: "Created", ip: "internal" },
    { timestamp: "2024-09-05T10:00:00Z", portal: "Finance", user: "Finance Admin", action: "Viewed", ip: "internal" },
  ]},
  { id: "OF-3001", type: "Offer", summary: "Offer extended to Vivek Nair · BrightApps Tech · SRE · ₹26L", entries: [
    { timestamp: "2024-09-15T10:00:00Z", portal: "Employer", user: "BrightApps HM", action: "Created", fieldChanges: [{ field: "ctc", from: "—", to: "₹26L" }], ip: "49.205.45.30" },
    { timestamp: "2024-09-15T10:05:00Z", portal: "Employer", user: "BrightApps HM", action: "Updated", fieldChanges: [{ field: "status", from: "draft", to: "sent" }], ip: "49.205.45.30" },
    { timestamp: "2024-09-15T10:10:00Z", portal: "Candidate", user: "Vivek Nair", action: "Viewed", ip: "103.21.45.30" },
    { timestamp: "2024-09-17T10:00:00Z", portal: "Candidate", user: "Vivek Nair", action: "Approved", fieldChanges: [{ field: "status", from: "sent", to: "accepted" }], ip: "103.21.45.30" },
    { timestamp: "2024-09-17T10:05:00Z", portal: "Employer", user: "BrightApps HM", action: "Viewed", ip: "49.205.45.30" },
    { timestamp: "2024-09-17T11:00:00Z", portal: "Cross-Portal", user: "System", action: "Created", ip: "internal" },
  ]},
  { id: "EN-4001", type: "Enrollment", summary: "Meera Joshi enrolled in SkillForge Academy · Platform Engineer bootcamp", entries: [
    { timestamp: "2024-08-01T09:00:00Z", portal: "Candidate", user: "Meera Joshi", action: "Created", ip: "103.21.45.40" },
    { timestamp: "2024-08-01T10:00:00Z", portal: "Training", user: "SkillForge Admin", action: "Viewed", ip: "152.59.84.5" },
    { timestamp: "2024-08-02T11:00:00Z", portal: "Training", user: "SkillForge Admin", action: "Approved", fieldChanges: [{ field: "status", from: "pending", to: "enrolled" }], ip: "152.59.84.5" },
    { timestamp: "2024-08-15T12:00:00Z", portal: "Training", user: "SkillForge Trainer", action: "Updated", fieldChanges: [{ field: "module", from: "1", to: "2" }], ip: "152.59.84.5" },
    { timestamp: "2024-09-10T15:00:00Z", portal: "Training", user: "SkillForge Trainer", action: "Updated", fieldChanges: [{ field: "module", from: "3", to: "4" }], ip: "152.59.84.5" },
    { timestamp: "2024-09-20T16:00:00Z", portal: "Employer", user: "CloudOps HM", action: "Viewed", ip: "49.205.45.20" },
  ]},
];

export function SuperAdminUnifiedAuditTrail() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<string>(RECORDS[0].id);

  const filtered = RECORDS.filter(r => {
    const q = search.toLowerCase();
    const m = !q || r.id.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q);
    const t = typeFilter === "all" || r.type === typeFilter;
    return m && t;
  });

  const current = RECORDS.find(r => r.id === selected) ?? RECORDS[0];
  const totalEntries = RECORDS.reduce((sum, r) => sum + r.entries.length, 0);
  const portalsTouched = new Set(RECORDS.flatMap(r => r.entries.map(e => e.portal))).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Audit Trail"
        description="Immutable cross-portal audit trail — search by record ID/type to view every action taken on a record across all portals in chronological order, with field-level changes and IP audit."
        icon={<Icon name="History" className="h-6 w-6" />}
        actions={[
          { label: "Export Current", variant: "outline", onClick: () => toast.success(`Exporting immutable trail for ${current.id}…`) },
          { label: "Verify Integrity", variant: "default", onClick: () => toast.success("Trail integrity verified — no tampering detected") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Records Indexed" value={RECORDS.length} icon={<Icon name="Database" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Audit Entries" value={totalEntries} icon={<Icon name="ListOrdered" className="h-5 w-5" />} tone="default" />
        <StatCard label="Portals Touched" value={portalsTouched} icon={<Icon name="Network" className="h-5 w-5" />} tone="success" />
        <StatCard label="Trail Integrity" value="Verified" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Search Records" description="Find a record by ID or type to view its full cross-portal timeline">
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search record ID or summary…" className="h-9 max-w-sm" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-48 text-xs"><SelectValue placeholder="Record Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Placement">Placement</SelectItem>
              <SelectItem value="Application">Application</SelectItem>
              <SelectItem value="Transaction">Transaction</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Enrollment">Enrollment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-6 w-6" />} title="No records match search" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Entries</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className={selected === r.id ? "bg-brand/5" : ""}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] border-brand/30 bg-brand/10 text-brand">{r.type}</Badge></TableCell>
                    <TableCell className="text-xs">{r.summary}</TableCell>
                    <TableCell className="text-xs">{r.entries.length}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{timeAgo(r.entries[r.entries.length - 1].timestamp)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant={selected === r.id ? "default" : "outline"} className="h-7 text-xs" onClick={() => setSelected(r.id)}>
                        {selected === r.id ? "Viewing" : "View Trail"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title={`Immutable Timeline · ${current.id}`} description={current.summary}>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-brand/30 bg-brand/10 text-brand">{current.type}</Badge>
          <span className="text-[10px] text-muted-foreground">{current.entries.length} entries · chronological order · immutable</span>
        </div>
        <div className="relative max-h-[40rem] overflow-y-auto pl-6">
          <div className="absolute bottom-2 left-2 top-2 w-px bg-border" />
          <div className="space-y-3">
            {current.entries.map((e, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[18px] top-3 h-3 w-3 rounded-full border-2 ${ACTION_TONES[e.action].split(" ")[0]} ${ACTION_TONES[e.action].includes("emerald") ? "bg-emerald-500 border-emerald-500" : ACTION_TONES[e.action].includes("rose") ? "bg-rose-500 border-rose-500" : ACTION_TONES[e.action].includes("amber") ? "bg-amber-500 border-amber-500" : "bg-slate-500 border-slate-500"}`} />
                <div className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                    <Badge variant="outline" className={`text-[10px] ${ACTION_TONES[e.action]}`}>{e.action}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[e.portal]}`}>{e.portal}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(e.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-medium">{e.user}</span>
                    <span className="text-[10px] text-muted-foreground">IP: {e.ip}</span>
                  </div>
                  {e.fieldChanges && e.fieldChanges.length > 0 && (
                    <div className="mt-2 space-y-1 rounded-md bg-muted/50 p-2">
                      {e.fieldChanges.map((fc, j) => (
                        <div key={j} className="flex items-center gap-2 text-[10px]">
                          <Icon name="PenSquare" className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-muted-foreground">{fc.field}:</span>
                          <span className="rounded bg-rose-500/10 px-1 text-rose-700 line-through">{fc.from}</span>
                          <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                          <span className="rounded bg-emerald-500/10 px-1 text-emerald-700">{fc.to}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
