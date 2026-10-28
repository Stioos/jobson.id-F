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

type ClaimType = "Replacement" | "Refund" | "Credit Note";
type ClaimReason = "Candidate left" | "Performance issue" | "No-show";
type GuarantorPortal = "Recruiter" | "Training" | "Partner";
type ClaimStatus = "Submitted" | "Employer Review" | "Approved" | "Rejected" | "Resolved";

interface WorkflowStep {
  portal: GuarantorPortal | "Employer" | "Super Admin" | "Finance";
  label: string;
  status: "Done" | "Current" | "Upcoming";
  at?: string;
}

interface GuaranteeClaim {
  id: string;
  placementId: string;
  candidate: string;
  employer: string;
  guarantor: string;
  guarantorPortal: GuarantorPortal;
  claimType: ClaimType;
  reason: ClaimReason;
  claimDate: string;
  guaranteeEndDate: string;
  daysWithinGuarantee: number;
  status: ClaimStatus;
  resolution?: string;
  amount: number;
  chain: WorkflowStep[];
}

const PORTAL_TONES: Record<string, string> = {
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  "Super Admin": "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Finance: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const TYPE_TONES: Record<ClaimType, string> = {
  Replacement: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Refund: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  "Credit Note": "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const STATUS_TONES: Record<ClaimStatus, string> = {
  Submitted: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  "Employer Review": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const CLAIMS: GuaranteeClaim[] = [
  { id: "GC-6001", placementId: "PL-9001", candidate: "Aarav Sharma", employer: "TechCorp India", guarantor: "TalentBridge RPO", guarantorPortal: "Recruiter", claimType: "Replacement", reason: "Candidate left", claimDate: "2024-09-15T10:00:00Z", guaranteeEndDate: "2024-12-15T10:00:00Z", daysWithinGuarantee: 91, status: "Approved", amount: 0, resolution: "Replacement candidate sourced", chain: [
    { portal: "Recruiter", label: "Recruiter submits claim", status: "Done", at: "2024-09-15T10:00:00Z" },
    { portal: "Employer", label: "Employer reviews", status: "Done", at: "2024-09-16T14:00:00Z" },
    { portal: "Super Admin", label: "Finance approves", status: "Done", at: "2024-09-18T11:00:00Z" },
    { portal: "Recruiter", label: "Replacement search initiated", status: "Current", at: "2024-09-19T09:00:00Z" },
  ]},
  { id: "GC-6002", placementId: "PL-9003", candidate: "Rohan Mehta", employer: "BrightApps Tech", guarantor: "CodeCraft Bootcamp", guarantorPortal: "Training", claimType: "Refund", reason: "Performance issue", claimDate: "2024-09-10T08:00:00Z", guaranteeEndDate: "2024-10-10T08:00:00Z", daysWithinGuarantee: 30, status: "Employer Review", amount: 50000, chain: [
    { portal: "Training", label: "Training submits claim", status: "Done", at: "2024-09-10T08:00:00Z" },
    { portal: "Employer", label: "Employer review", status: "Current" },
    { portal: "Super Admin", label: "Finance approves refund", status: "Upcoming" },
    { portal: "Finance", label: "Refund processed", status: "Upcoming" },
  ]},
  { id: "GC-6003", placementId: "PL-9007", candidate: "Vivek Nair", employer: "BrightApps Tech", guarantor: "Apex Staffing", guarantorPortal: "Recruiter", claimType: "Credit Note", reason: "Candidate left", claimDate: "2024-09-05T12:00:00Z", guaranteeEndDate: "2024-11-05T12:00:00Z", daysWithinGuarantee: 61, status: "Resolved", amount: 75000, resolution: "Credit note issued against next invoice", chain: [
    { portal: "Recruiter", label: "Recruiter submits claim", status: "Done", at: "2024-09-05T12:00:00Z" },
    { portal: "Employer", label: "Employer reviews", status: "Done", at: "2024-09-06T10:00:00Z" },
    { portal: "Super Admin", label: "Finance approves", status: "Done", at: "2024-09-08T11:00:00Z" },
    { portal: "Finance", label: "Credit note issued", status: "Done", at: "2024-09-09T15:00:00Z" },
  ]},
  { id: "GC-6004", placementId: "PL-9010", candidate: "Meera Joshi", employer: "CloudOps Solutions", guarantor: "EduBridge Foundation", guarantorPortal: "Partner", claimType: "Replacement", reason: "No-show", claimDate: "2024-09-18T09:00:00Z", guaranteeEndDate: "2024-10-18T09:00:00Z", daysWithinGuarantee: 30, status: "Submitted", amount: 0, chain: [
    { portal: "Partner", label: "Partner submits claim", status: "Done", at: "2024-09-18T09:00:00Z" },
    { portal: "Employer", label: "Employer review", status: "Current" },
    { portal: "Super Admin", label: "Finance approves", status: "Upcoming" },
    { portal: "Partner", label: "Replacement candidate search", status: "Upcoming" },
  ]},
  { id: "GC-6005", placementId: "PL-9012", candidate: "Isha Banerjee", employer: "Nimbus Labs", guarantor: "SkillForge Academy", guarantorPortal: "Training", claimType: "Refund", reason: "Performance issue", claimDate: "2024-09-01T10:00:00Z", guaranteeEndDate: "2024-12-01T10:00:00Z", daysWithinGuarantee: 91, status: "Rejected", amount: 60000, resolution: "Rejected — issue arose outside guarantee period (probation ended)", chain: [
    { portal: "Training", label: "Training submits claim", status: "Done", at: "2024-09-01T10:00:00Z" },
    { portal: "Employer", label: "Employer reviews", status: "Done", at: "2024-09-03T14:00:00Z" },
    { portal: "Super Admin", label: "Finance rejects", status: "Done", at: "2024-09-05T11:00:00Z" },
  ]},
  { id: "GC-6006", placementId: "PL-9015", candidate: "Sahil Verma", employer: "BrightApps Tech", guarantor: "Apex Staffing", guarantorPortal: "Recruiter", claimType: "Credit Note", reason: "Candidate left", claimDate: "2024-09-12T11:00:00Z", guaranteeEndDate: "2024-11-12T11:00:00Z", daysWithinGuarantee: 61, status: "Approved", amount: 90000, chain: [
    { portal: "Recruiter", label: "Recruiter submits claim", status: "Done", at: "2024-09-12T11:00:00Z" },
    { portal: "Employer", label: "Employer reviews", status: "Done", at: "2024-09-13T10:00:00Z" },
    { portal: "Super Admin", label: "Finance approves", status: "Done", at: "2024-09-15T11:00:00Z" },
    { portal: "Finance", label: "Credit note pending", status: "Current" },
  ]},
  { id: "GC-6007", placementId: "PL-9018", candidate: "Diya Patel", employer: "CloudOps Solutions", guarantor: "CodeCraft Bootcamp", guarantorPortal: "Training", claimType: "Replacement", reason: "Performance issue", claimDate: "2024-09-19T08:00:00Z", guaranteeEndDate: "2024-10-19T08:00:00Z", daysWithinGuarantee: 30, status: "Employer Review", amount: 0, chain: [
    { portal: "Training", label: "Training submits claim", status: "Done", at: "2024-09-19T08:00:00Z" },
    { portal: "Employer", label: "Employer review", status: "Current" },
    { portal: "Super Admin", label: "Finance approves", status: "Upcoming" },
    { portal: "Training", label: "Replacement search", status: "Upcoming" },
  ]},
  { id: "GC-6008", placementId: "PL-9020", candidate: "Karthik Rao", employer: "TechCorp India", guarantor: "EduBridge Foundation", guarantorPortal: "Partner", claimType: "Refund", reason: "No-show", claimDate: "2024-09-08T09:00:00Z", guaranteeEndDate: "2024-12-08T09:00:00Z", daysWithinGuarantee: 91, status: "Resolved", amount: 40000, resolution: "Refund processed via NEFT", chain: [
    { portal: "Partner", label: "Partner submits claim", status: "Done", at: "2024-09-08T09:00:00Z" },
    { portal: "Employer", label: "Employer reviews", status: "Done", at: "2024-09-09T10:00:00Z" },
    { portal: "Super Admin", label: "Finance approves refund", status: "Done", at: "2024-09-11T11:00:00Z" },
    { portal: "Finance", label: "Refund processed", status: "Done", at: "2024-09-12T15:00:00Z" },
  ]},
];

const SLA_TARGETS = [
  { stage: "Submitted → Employer Review", target: "2 days", actual: "1.4 days", status: "ok" },
  { stage: "Employer Review → Finance Approval", target: "5 days", actual: "4.1 days", status: "ok" },
  { stage: "Approval → Resolution", target: "7 days", actual: "9.2 days", status: "breach" },
];

export function SuperAdminGuaranteeClaims() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = CLAIMS.filter(c => {
    const q = search.toLowerCase();
    const m = !q || c.id.toLowerCase().includes(q) || c.candidate.toLowerCase().includes(q) || c.employer.toLowerCase().includes(q) || c.placementId.toLowerCase().includes(q);
    const t = type === "all" || c.claimType === type;
    const s = status === "all" || c.status === status;
    return m && t && s;
  });

  const active = CLAIMS.filter(c => c.status !== "Resolved" && c.status !== "Rejected").length;
  const approved = CLAIMS.filter(c => c.status === "Approved" || c.status === "Resolved").length;
  const rejected = CLAIMS.filter(c => c.status === "Rejected").length;
  const totalRefund = CLAIMS.filter(c => c.status === "Resolved" || c.status === "Approved").reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guarantee Claims"
        description="Cross-portal guarantee claim workflow — replacement, refund, and credit note claims flowing through Recruiter/Training/Partner → Employer review → Finance approval, with SLA tracking."
        icon={<Icon name="ShieldAlert" className="h-6 w-6" />}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("Exporting claims CSV…") },
          { label: "New Claim", variant: "default", onClick: () => toast.success("Opening new claim form…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <StatCard label="Active Claims" value={active} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Approved" value={approved} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Total Refund/Credit" value={`₹${(totalRefund / 1000).toFixed(0)}K`} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="default" />
        <StatCard label="Avg Resolution" value="9.2 days" icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Guarantee Claims Queue" description={`${filtered.length} of ${CLAIMS.length} claims across all guarantor portals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search claim, candidate, employer, placement…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Replacement">Replacement</SelectItem>
                <SelectItem value="Refund">Refund</SelectItem>
                <SelectItem value="Credit Note">Credit Note</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Employer Review">Employer Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="ShieldAlert" className="h-6 w-6" />} title="No claims match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Guarantor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Within Guarantee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <React.Fragment key={c.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === c.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">{c.placementId}</TableCell>
                      <TableCell className="text-xs font-medium">{c.candidate}</TableCell>
                      <TableCell className="text-xs">{c.employer}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span>{c.guarantor}</span>
                          <Badge variant="outline" className={`w-fit text-[10px] ${PORTAL_TONES[c.guarantorPortal]}`}>{c.guarantorPortal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONES[c.claimType]}`}>{c.claimType}</Badge></TableCell>
                      <TableCell className="text-xs">{c.reason}</TableCell>
                      <TableCell className={`text-[10px] font-medium ${c.daysWithinGuarantee >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {c.daysWithinGuarantee >= 0 ? `${c.daysWithinGuarantee}d left` : `${Math.abs(c.daysWithinGuarantee)}d past`}
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONES[c.status]}`}>{c.status}</Badge></TableCell>
                    </TableRow>
                    {expanded === c.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={10} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Claim Workflow · {c.id} · Filed {timeAgo(c.claimDate)}</p>
                              </div>
                              {c.amount > 0 && <Badge variant="outline" className="text-xs">Amount: ₹{(c.amount / 1000).toFixed(0)}K</Badge>}
                            </div>
                            {c.resolution && (
                              <p className="rounded-md border border-muted bg-muted/40 p-2 text-xs">
                                <Icon name="CheckCircle2" className="mr-1 inline h-3 w-3 text-emerald-600" />
                                {c.resolution}
                              </p>
                            )}
                            <div className="flex flex-wrap items-stretch gap-2">
                              {c.chain.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${s.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : s.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={s.status === "Done" ? "CheckCircle2" : s.status === "Current" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${s.status === "Done" ? "text-emerald-600" : s.status === "Current" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[s.portal]}`}>{s.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{s.label}</p>
                                    {s.at && <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(s.at)}</p>}
                                  </div>
                                  {i < c.chain.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                            {(c.status === "Employer Review" || c.status === "Submitted") && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${c.id} approved by Finance`)}>Approve</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`${c.id} rejected`)}>Reject</Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="SLA Tracking" description="Target vs actual resolution times per stage">
        <div className="space-y-2">
          {SLA_TARGETS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <Icon name={s.status === "ok" ? "CheckCircle2" : "AlertCircle"} className={`h-4 w-4 ${s.status === "ok" ? "text-emerald-600" : "text-rose-600"}`} />
              <div className="flex-1">
                <p className="text-xs font-medium">{s.stage}</p>
                <p className="text-[10px] text-muted-foreground">Target {s.target} · Actual {s.actual}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] ${s.status === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-rose-500/30 bg-rose-500/10 text-rose-700"}`}>
                {s.status === "ok" ? "On track" : "SLA breach"}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
