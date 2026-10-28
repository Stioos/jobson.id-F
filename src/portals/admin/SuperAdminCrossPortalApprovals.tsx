"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

type ApproverType = "Job Posting" | "Offer" | "Refund" | "Payout" | "MoU" | "Enrollment" | "Requisition";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Training" | "Partner" | "Admin" | "Finance";
type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Escalated";

interface ChainStep {
  portal: Portal;
  role: string;
  status: "Done" | "Current" | "Upcoming";
  decision?: string;
  at?: string;
}

interface Approval {
  id: string;
  type: ApproverType;
  initiatorPortal: Portal;
  initiatorName: string;
  targetPortal: Portal;
  targetApprover: string;
  amount?: number;
  status: ApprovalStatus;
  slaRemaining: string;
  submittedAt: string;
  chain: ChainStep[];
}

const TYPE_TONES: Record<ApproverType, string> = {
  "Job Posting": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Offer: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Refund: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Payout: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  MoU: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Enrollment: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Requisition: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const STATUS_TONES: Record<ApprovalStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Escalated: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Admin: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Finance: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const APPROVALS: Approval[] = [
  { id: "CA-3001", type: "Job Posting", initiatorPortal: "Employer", initiatorName: "TechCorp India", targetPortal: "Admin", targetApprover: "Moderation Lead", status: "Pending", slaRemaining: "2h 15m", submittedAt: "2024-09-21T07:00:00Z", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", decision: "Submitted", at: "2024-09-21T07:00:00Z" },
    { portal: "Admin", role: "Moderation Lead", status: "Current" },
    { portal: "Admin", role: "Auto-publish", status: "Upcoming" },
  ]},
  { id: "CA-3002", type: "Offer", initiatorPortal: "Recruiter", initiatorName: "TalentBridge RPO", targetPortal: "Finance", targetApprover: "Finance Controller", amount: 1850000, status: "Pending", slaRemaining: "5h 30m", submittedAt: "2024-09-21T05:30:00Z", chain: [
    { portal: "Recruiter", role: "Recruiter", status: "Done", decision: "Drafted", at: "2024-09-21T05:30:00Z" },
    { portal: "Employer", role: "Hiring Manager", status: "Done", decision: "Approved", at: "2024-09-21T08:00:00Z" },
    { portal: "Finance", role: "Finance Controller", status: "Current" },
    { portal: "Recruiter", role: "Send to candidate", status: "Upcoming" },
  ]},
  { id: "CA-3003", type: "Refund", initiatorPortal: "Employer", initiatorName: "CloudOps Solutions", targetPortal: "Finance", targetApprover: "Finance Manager", amount: 45000, status: "Escalated", slaRemaining: "Overdue 4h", submittedAt: "2024-09-19T11:00:00Z", chain: [
    { portal: "Employer", role: "HR Admin", status: "Done", decision: "Requested", at: "2024-09-19T11:00:00Z" },
    { portal: "Admin", role: "Support Lead", status: "Done", decision: "Validated", at: "2024-09-20T10:00:00Z" },
    { portal: "Finance", role: "Finance Manager", status: "Current" },
    { portal: "Finance", role: "Process refund", status: "Upcoming" },
  ]},
  { id: "CA-3004", type: "Payout", initiatorPortal: "Recruiter", initiatorName: "Apex Staffing", targetPortal: "Finance", targetApprover: "Finance Lead", amount: 125000, status: "Approved", slaRemaining: "—", submittedAt: "2024-09-21T06:00:00Z", chain: [
    { portal: "Recruiter", role: "Recruiter", status: "Done", decision: "Raised", at: "2024-09-21T06:00:00Z" },
    { portal: "Finance", role: "Finance Lead", status: "Done", decision: "Approved", at: "2024-09-21T09:00:00Z" },
    { portal: "Finance", role: "Settle", status: "Done", decision: "Settled", at: "2024-09-21T10:00:00Z" },
  ]},
  { id: "CA-3005", type: "MoU", initiatorPortal: "Partner", initiatorName: "EduBridge Foundation", targetPortal: "Admin", targetApprover: "Partnership Head", status: "Pending", slaRemaining: "1d 4h", submittedAt: "2024-09-20T16:00:00Z", chain: [
    { portal: "Partner", role: "Partner Admin", status: "Done", decision: "Submitted MoU", at: "2024-09-20T16:00:00Z" },
    { portal: "Admin", role: "Partnership Head", status: "Current" },
    { portal: "Admin", role: "Legal review", status: "Upcoming" },
    { portal: "Admin", role: "Sign & activate", status: "Upcoming" },
  ]},
  { id: "CA-3006", type: "Enrollment", initiatorPortal: "Training", initiatorName: "CodeCraft Bootcamp", targetPortal: "Admin", targetApprover: "Curriculum Lead", status: "Pending", slaRemaining: "8h", submittedAt: "2024-09-21T04:00:00Z", chain: [
    { portal: "Training", role: "Training Provider", status: "Done", decision: "Submitted cohort", at: "2024-09-21T04:00:00Z" },
    { portal: "Admin", role: "Curriculum Lead", status: "Current" },
    { portal: "Admin", role: "Auto-publish", status: "Upcoming" },
  ]},
  { id: "CA-3007", type: "Requisition", initiatorPortal: "Employer", initiatorName: "Nimbus Labs", targetPortal: "Admin", targetApprover: "Talent Ops", status: "Pending", slaRemaining: "12h", submittedAt: "2024-09-20T22:00:00Z", chain: [
    { portal: "Employer", role: "Talent Acquisition", status: "Done", decision: "Created", at: "2024-09-20T22:00:00Z" },
    { portal: "Admin", role: "Talent Ops", status: "Current" },
    { portal: "Recruiter", role: "Dispatch to RPO", status: "Upcoming" },
  ]},
  { id: "CA-3008", type: "Offer", initiatorPortal: "Recruiter", initiatorName: "Apex Staffing", targetPortal: "Finance", targetApprover: "Finance Controller", amount: 2100000, status: "Rejected", slaRemaining: "—", submittedAt: "2024-09-18T08:00:00Z", chain: [
    { portal: "Recruiter", role: "Recruiter", status: "Done", decision: "Drafted", at: "2024-09-18T08:00:00Z" },
    { portal: "Employer", role: "Hiring Manager", status: "Done", decision: "Approved", at: "2024-09-18T12:00:00Z" },
    { portal: "Finance", role: "Finance Controller", status: "Done", decision: "Rejected — budget cap", at: "2024-09-19T10:00:00Z" },
  ]},
  { id: "CA-3009", type: "Job Posting", initiatorPortal: "Employer", initiatorName: "BrightApps Tech", targetPortal: "Admin", targetApprover: "Moderation Lead", status: "Approved", slaRemaining: "—", submittedAt: "2024-09-20T10:00:00Z", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", decision: "Submitted", at: "2024-09-20T10:00:00Z" },
    { portal: "Admin", role: "Moderation Lead", status: "Done", decision: "Approved", at: "2024-09-20T14:00:00Z" },
    { portal: "Admin", role: "Auto-publish", status: "Done", decision: "Published", at: "2024-09-20T14:05:00Z" },
  ]},
  { id: "CA-3010", type: "Payout", initiatorPortal: "Recruiter", initiatorName: "TalentBridge RPO", targetPortal: "Finance", targetApprover: "Finance Lead", amount: 88000, status: "Pending", slaRemaining: "3h 45m", submittedAt: "2024-09-21T08:15:00Z", chain: [
    { portal: "Recruiter", role: "Recruiter", status: "Done", decision: "Raised", at: "2024-09-21T08:15:00Z" },
    { portal: "Finance", role: "Finance Lead", status: "Current" },
    { portal: "Finance", role: "Settle", status: "Upcoming" },
  ]},
  { id: "CA-3011", type: "MoU", initiatorPortal: "Partner", initiatorName: "Campus Connect", targetPortal: "Admin", targetApprover: "Partnership Head", status: "Escalated", slaRemaining: "Overdue 1d", submittedAt: "2024-09-17T11:00:00Z", chain: [
    { portal: "Partner", role: "Partner Admin", status: "Done", decision: "Submitted", at: "2024-09-17T11:00:00Z" },
    { portal: "Admin", role: "Partnership Head", status: "Current" },
    { portal: "Admin", role: "Legal review", status: "Upcoming" },
  ]},
  { id: "CA-3012", type: "Enrollment", initiatorPortal: "Training", initiatorName: "SkillForge Academy", targetPortal: "Admin", targetApprover: "Curriculum Lead", status: "Approved", slaRemaining: "—", submittedAt: "2024-09-19T09:00:00Z", chain: [
    { portal: "Training", role: "Training Provider", status: "Done", decision: "Submitted", at: "2024-09-19T09:00:00Z" },
    { portal: "Admin", role: "Curriculum Lead", status: "Done", decision: "Approved", at: "2024-09-19T14:00:00Z" },
    { portal: "Admin", role: "Auto-publish", status: "Done", decision: "Published", at: "2024-09-19T14:10:00Z" },
  ]},
];

const WORKFLOW_TEMPLATES = [
  { type: "Job Posting", steps: [{ portal: "Admin", role: "Moderation Lead" }, { portal: "Admin", role: "Auto-publish" }] },
  { type: "Offer", steps: [{ portal: "Recruiter", role: "Recruiter" }, { portal: "Employer", role: "Hiring Manager" }, { portal: "Finance", role: "Finance Controller" }, { portal: "Recruiter", role: "Send" }] },
  { type: "Refund", steps: [{ portal: "Employer", role: "HR Admin" }, { portal: "Admin", role: "Support Lead" }, { portal: "Finance", role: "Finance Manager" }, { portal: "Finance", role: "Process" }] },
  { type: "Payout", steps: [{ portal: "Recruiter", role: "Recruiter" }, { portal: "Finance", role: "Finance Lead" }, { portal: "Finance", role: "Settle" }] },
];

const ESCALATIONS = [
  { rule: "SLA breach > 4h", action: "Escalate to next-level approver", enabled: true },
  { rule: "Amount > ₹10L", action: "Add Finance Controller step", enabled: true },
  { rule: "Repeated rejection", action: "Notify Partnership Head", enabled: true },
  { rule: "After-hours submission", action: "Auto-pause SLA, resume next business hour", enabled: false },
];

export function SuperAdminCrossPortalApprovals() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [escalations, setEscalations] = React.useState(ESCALATIONS);
  const [selectedTemplate, setSelectedTemplate] = React.useState("Offer");

  const filtered = APPROVALS.filter(a => {
    const q = search.toLowerCase();
    const m = !q || a.id.toLowerCase().includes(q) || a.initiatorName.toLowerCase().includes(q) || a.targetApprover.toLowerCase().includes(q);
    const t = type === "all" || a.type === type;
    const s = status === "all" || a.status === status;
    return m && t && s;
  });

  const pending = APPROVALS.filter(a => a.status === "Pending").length;
  const overdue = APPROVALS.filter(a => a.status === "Escalated").length;
  const approved = APPROVALS.filter(a => a.status === "Approved").length;
  const typeCount = (Object.keys(TYPE_TONES) as ApproverType[]).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Approvals"
        description="Multi-step approval routing across portals — partner → training → finance → admin chains, SLA tracking, escalation rules and workflow configuration."
        icon={<Icon name="CheckCircle2" className="h-6 w-6" />}
        actions={[
          { label: "Configure", variant: "outline", onClick: () => toast.success("Opening workflow designer…") },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting approvals CSV…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Approvals" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="By Type" value={typeCount} icon={<Icon name="Layers" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Approval Time" value="6.4h" icon={<Icon name="Activity" className="h-5 w-5" />} tone="default" />
        <StatCard label="Overdue / Escalated" value={overdue} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Approval Queue" description={`${filtered.length} of ${APPROVALS.length} cross-portal approvals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, initiator, approver…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(TYPE_TONES) as ApproverType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No approvals match filters" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Initiator</TableHead>
                  <TableHead>Target Approver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA Remaining</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <React.Fragment key={a.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === a.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${TYPE_TONES[a.type]}`}>{a.type}</Badge></TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{a.initiatorName}</span>
                          <Badge variant="outline" className={`mt-0.5 w-fit text-[10px] ${PORTAL_TONES[a.initiatorPortal]}`}>{a.initiatorPortal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium">{a.targetApprover}</span>
                          <Badge variant="outline" className={`mt-0.5 w-fit text-[10px] ${PORTAL_TONES[a.targetPortal]}`}>{a.targetPortal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{a.amount ? `₹${(a.amount / 100000).toFixed(1)}L` : "—"}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${STATUS_TONES[a.status]}`}>{a.status}</Badge></TableCell>
                      <TableCell className={`text-xs ${a.slaRemaining.startsWith("Overdue") ? "text-rose-600 font-semibold" : ""}`}>{a.slaRemaining}</TableCell>
                      <TableCell>
                        {a.status === "Pending" || a.status === "Escalated" ? (
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${a.id} approved`)}>Approve</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`${a.id} rejected`)}>Reject</Button>
                          </div>
                        ) : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>{expanded === a.id ? "Hide" : "View"}</Button>}
                      </TableCell>
                    </TableRow>
                    {expanded === a.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={9} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Icon name="Workflow" className="h-4 w-4 text-brand" />
                              <p className="text-sm font-semibold">Approval Chain · {a.id} · Submitted {timeAgo(a.submittedAt)}</p>
                            </div>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {a.chain.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${c.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : c.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={c.status === "Done" ? "CheckCircle2" : c.status === "Current" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${c.status === "Done" ? "text-emerald-600" : c.status === "Current" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.portal]}`}>{c.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{c.role}</p>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground">{c.decision ?? c.status}{c.at ? ` · ${timeAgo(c.at)}` : ""}</p>
                                  </div>
                                  {i < a.chain.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Configure Approval Workflow" description="Select a type and review/edit the multi-step chain">
          <div className="space-y-3">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {WORKFLOW_TEMPLATES.map(t => <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="space-y-2">
              {WORKFLOW_TEMPLATES.find(t => t.type === selectedTemplate)?.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</span>
                  <Badge variant="outline" className={`text-xs ${PORTAL_TONES[s.portal as Portal]}`}>{s.portal}</Badge>
                  <span className="text-xs">{s.role}</span>
                  <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={() => toast.success(`Editing step ${i + 1}`)}>Edit</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast.success("Step added — pick portal + role")}>
                <Icon name="Plus" className="mr-1 h-3 w-3" /> Add Step
              </Button>
            </div>
            <Button size="sm" variant="default" className="w-full" onClick={() => toast.success(`${selectedTemplate} workflow saved`)}>Save Workflow</Button>
          </div>
        </SectionCard>

        <SectionCard title="Escalation Rules" description="Auto-escalation triggers">
          <div className="space-y-2">
            {escalations.map((e, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <Icon name={e.enabled ? "Zap" : "CircleDot"} className={`h-4 w-4 ${e.enabled ? "text-amber-500" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium">{e.rule}</p>
                  <p className="text-[10px] text-muted-foreground">{e.action}</p>
                </div>
                <Button
                  size="sm"
                  variant={e.enabled ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => {
                    setEscalations(es => es.map((x, idx) => idx === i ? { ...x, enabled: !x.enabled } : x));
                    toast.success(`${e.rule} ${e.enabled ? "disabled" : "enabled"}`);
                  }}
                >
                  {e.enabled ? "On" : "Off"}
                </Button>
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">{approved} of {APPROVALS.length} approvals completed in last cycle.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
