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

type SourcePortal = "Candidate Direct" | "Recruiter Submitted" | "Partner Referred" | "Training Placed";
type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
type SyncStatus = "Synced" | "Pending Sync" | "Conflict";

interface TraceStep {
  portal: string;
  action: string;
  at: string;
  done: boolean;
}

interface App {
  id: string;
  candidate: string;
  role: string;
  employer: string;
  sourcePortal: SourcePortal;
  sourceParty: string;
  stage: Stage;
  updatedAt: string;
  status: "Active" | "Closed";
  sync: SyncStatus;
  trace: TraceStep[];
}

const APPS: App[] = [
  { id: "APP-901", candidate: "Aarav Sharma", role: "Senior Frontend Engineer", employer: "TechCorp India", sourcePortal: "Candidate Direct", sourceParty: "Self", stage: "Interview", updatedAt: "2024-09-21T08:00:00Z", status: "Active", sync: "Synced", trace: [
    { portal: "Candidate Portal", action: "Applied directly", at: "2024-09-10T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Application reviewed", at: "2024-09-12T14:30:00Z", done: true },
    { portal: "Employer Portal", action: "Interview scheduled", at: "2024-09-18T09:15:00Z", done: true },
    { portal: "Recruiter Portal", action: "Awaiting feedback sync", at: "2024-09-21T08:00:00Z", done: false },
  ]},
  { id: "APP-902", candidate: "Diya Patel", role: "Product Designer", employer: "Nimbus Labs", sourcePortal: "Recruiter Submitted", sourceParty: "TalentBridge RPO", stage: "Offer", updatedAt: "2024-09-20T16:00:00Z", status: "Active", sync: "Synced", trace: [
    { portal: "Recruiter Portal", action: "Sourced & submitted", at: "2024-08-25T11:00:00Z", done: true },
    { portal: "Candidate Portal", action: "Profile confirmed", at: "2024-08-26T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "3 interviews completed", at: "2024-09-15T13:00:00Z", done: true },
    { portal: "Employer Portal", action: "Offer rolled out", at: "2024-09-20T16:00:00Z", done: true },
  ]},
  { id: "APP-903", candidate: "Rohan Mehta", role: "DevOps Engineer", employer: "CloudOps Solutions", sourcePortal: "Partner Referred", sourceParty: "Campus Connect", stage: "Screening", updatedAt: "2024-09-19T12:00:00Z", status: "Active", sync: "Pending Sync", trace: [
    { portal: "Partner Portal", action: "Referred from campus", at: "2024-09-08T09:00:00Z", done: true },
    { portal: "Employer Portal", action: "Resume screening", at: "2024-09-15T11:00:00Z", done: true },
    { portal: "Recruiter Portal", action: "Sync pending", at: "2024-09-19T12:00:00Z", done: false },
  ]},
  { id: "APP-904", candidate: "Ananya Iyer", role: "Full Stack Developer", employer: "BrightApps Tech", sourcePortal: "Training Placed", sourceParty: "CodeCraft Bootcamp", stage: "Hired", updatedAt: "2024-09-18T15:00:00Z", status: "Closed", sync: "Synced", trace: [
    { portal: "Training Portal", action: "Cohort completed & certified", at: "2024-08-10T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Direct placement drive", at: "2024-09-01T09:00:00Z", done: true },
    { portal: "Candidate Portal", action: "Offer accepted", at: "2024-09-15T14:00:00Z", done: true },
    { portal: "Employer Portal", action: "Onboarding started", at: "2024-09-18T15:00:00Z", done: true },
  ]},
  { id: "APP-905", candidate: "Karan Verma", role: "Backend Engineer", employer: "TechCorp India", sourcePortal: "Candidate Direct", sourceParty: "Self", stage: "Rejected", updatedAt: "2024-09-17T11:00:00Z", status: "Closed", sync: "Synced", trace: [
    { portal: "Candidate Portal", action: "Applied directly", at: "2024-09-01T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Screened & rejected", at: "2024-09-17T11:00:00Z", done: true },
  ]},
  { id: "APP-906", candidate: "Sneha Reddy", role: "QA Lead", employer: "Nimbus Labs", sourcePortal: "Recruiter Submitted", sourceParty: "Apex Staffing", stage: "Interview", updatedAt: "2024-09-16T10:00:00Z", status: "Active", sync: "Conflict", trace: [
    { portal: "Recruiter Portal", action: "Submitted", at: "2024-09-05T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Interview scheduled", at: "2024-09-12T11:00:00Z", done: true },
    { portal: "Candidate Portal", action: "Candidate updated resume — conflict", at: "2024-09-16T10:00:00Z", done: false },
  ]},
  { id: "APP-907", candidate: "Vikram Singh", role: "Data Analyst", employer: "CloudOps Solutions", sourcePortal: "Partner Referred", sourceParty: "EduBridge Foundation", stage: "Applied", updatedAt: "2024-09-15T09:00:00Z", status: "Active", sync: "Pending Sync", trace: [
    { portal: "Partner Portal", action: "Referred", at: "2024-09-15T09:00:00Z", done: true },
    { portal: "Employer Portal", action: "Awaiting acknowledgement", at: "", done: false },
  ]},
  { id: "APP-908", candidate: "Priya Nair", role: "UI Engineer", employer: "BrightApps Tech", sourcePortal: "Training Placed", sourceParty: "SkillForge Academy", stage: "Screening", updatedAt: "2024-09-14T13:00:00Z", status: "Active", sync: "Synced", trace: [
    { portal: "Training Portal", action: "Placement drive", at: "2024-09-01T09:00:00Z", done: true },
    { portal: "Employer Portal", action: "Screening in progress", at: "2024-09-14T13:00:00Z", done: true },
  ]},
  { id: "APP-909", candidate: "Arjun Nair", role: "SRE", employer: "TechCorp India", sourcePortal: "Recruiter Submitted", sourceParty: "TalentBridge RPO", stage: "Offer", updatedAt: "2024-09-13T16:00:00Z", status: "Active", sync: "Synced", trace: [
    { portal: "Recruiter Portal", action: "Submitted", at: "2024-08-20T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Offer rolled out", at: "2024-09-13T16:00:00Z", done: true },
  ]},
  { id: "APP-910", candidate: "Meera Joshi", role: "PMO Lead", employer: "Nimbus Labs", sourcePortal: "Candidate Direct", sourceParty: "Self", stage: "Applied", updatedAt: "2024-09-12T10:00:00Z", status: "Active", sync: "Pending Sync", trace: [
    { portal: "Candidate Portal", action: "Applied directly", at: "2024-09-12T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Sync pending", at: "", done: false },
  ]},
  { id: "APP-911", candidate: "Sahil Khan", role: "Mobile Engineer", employer: "CloudOps Solutions", sourcePortal: "Partner Referred", sourceParty: "Campus Connect", stage: "Interview", updatedAt: "2024-09-11T11:00:00Z", status: "Active", sync: "Synced", trace: [
    { portal: "Partner Portal", action: "Referred", at: "2024-08-25T09:00:00Z", done: true },
    { portal: "Employer Portal", action: "2 interviews done", at: "2024-09-11T11:00:00Z", done: true },
  ]},
  { id: "APP-912", candidate: "Ishita Bose", role: "ML Engineer", employer: "BrightApps Tech", sourcePortal: "Training Placed", sourceParty: "CodeCraft Bootcamp", stage: "Screening", updatedAt: "2024-09-10T14:00:00Z", status: "Active", sync: "Conflict", trace: [
    { portal: "Training Portal", action: "Cohort completed", at: "2024-08-15T10:00:00Z", done: true },
    { portal: "Candidate Portal", action: "Candidate declined initial interview — conflict", at: "2024-09-10T14:00:00Z", done: false },
  ]},
  { id: "APP-913", candidate: "Rajat Gupta", role: "Solution Architect", employer: "TechCorp India", sourcePortal: "Recruiter Submitted", sourceParty: "Apex Staffing", stage: "Hired", updatedAt: "2024-09-08T15:00:00Z", status: "Closed", sync: "Synced", trace: [
    { portal: "Recruiter Portal", action: "Submitted", at: "2024-08-01T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "5 interviews completed", at: "2024-08-28T13:00:00Z", done: true },
    { portal: "Employer Portal", action: "Offer accepted", at: "2024-09-08T15:00:00Z", done: true },
  ]},
  { id: "APP-914", candidate: "Tanvi Rao", role: "HR Business Partner", employer: "Nimbus Labs", sourcePortal: "Candidate Direct", sourceParty: "Self", stage: "Rejected", updatedAt: "2024-09-05T11:00:00Z", status: "Closed", sync: "Synced", trace: [
    { portal: "Candidate Portal", action: "Applied directly", at: "2024-08-22T10:00:00Z", done: true },
    { portal: "Employer Portal", action: "Rejected after screening", at: "2024-09-05T11:00:00Z", done: true },
  ]},
  { id: "APP-915", candidate: "Nikhil Joshi", role: "Security Analyst", employer: "CloudOps Solutions", sourcePortal: "Partner Referred", sourceParty: "EduBridge Foundation", stage: "Applied", updatedAt: "2024-09-03T09:00:00Z", status: "Active", sync: "Pending Sync", trace: [
    { portal: "Partner Portal", action: "Referred", at: "2024-09-03T09:00:00Z", done: true },
    { portal: "Employer Portal", action: "Awaiting acknowledgement", at: "", done: false },
  ]},
];

const SOURCE_TONES: Record<SourcePortal, string> = {
  "Candidate Direct": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Recruiter Submitted": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Partner Referred": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Training Placed": "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const STAGE_TONES: Record<Stage, string> = {
  Applied: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Screening: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Interview: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Offer: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Hired: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const SYNC_TONES: Record<SyncStatus, string> = {
  Synced: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Pending Sync": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Conflict: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminUnifiedApplications() {
  const [search, setSearch] = React.useState("");
  const [src, setSrc] = React.useState("all");
  const [stage, setStage] = React.useState("all");
  const [employer, setEmployer] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const employers = Array.from(new Set(APPS.map(a => a.employer)));

  const filtered = APPS.filter(a => {
    const q = search.toLowerCase();
    const m = !q || a.id.toLowerCase().includes(q) || a.candidate.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    const s = src === "all" || a.sourcePortal === src;
    const st = stage === "all" || a.stage === stage;
    const e = employer === "all" || a.employer === employer;
    return m && s && st && e;
  });

  const active = APPS.filter(a => a.status === "Active").length;
  const hired = APPS.filter(a => a.stage === "Hired").length;
  const rejected = APPS.filter(a => a.stage === "Rejected").length;
  const crossPortal = APPS.filter(a => a.sourcePortal !== "Candidate Direct").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Applications"
        description="Single view of every application across candidate, employer, recruiter, training and partner portals — with cross-portal trace, sync status and source attribution."
        icon={<Icon name="Inbox" className="h-6 w-6" />}
        actions={[
          { label: "Re-sync All", variant: "outline", onClick: () => toast.success("Re-syncing 15 applications across portals…") },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting unified applications CSV…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 sm:gap-4">
        <StatCard label="Total Applications" value={APPS.length} icon={<Icon name="Inbox" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={active} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Hired" value={hired} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Cross-Portal Sources" value={crossPortal} icon={<Icon name="ArrowRightLeft" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Unified Application Tracker" description={`${filtered.length} of ${APPS.length} applications`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, candidate, role…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={src} onValueChange={setSrc}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Candidate Direct">Candidate Direct</SelectItem>
                <SelectItem value="Recruiter Submitted">Recruiter Submitted</SelectItem>
                <SelectItem value="Partner Referred">Partner Referred</SelectItem>
                <SelectItem value="Training Placed">Training Placed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Screening">Screening</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={employer} onValueChange={setEmployer}>
              <SelectTrigger className="h-8 w-48 text-xs"><SelectValue placeholder="Employer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employers</SelectItem>
                {employers.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Inbox" className="h-6 w-6" />} title="No applications match your filters" description="Adjust filters or clear search." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>App ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Source Portal</TableHead>
                  <TableHead>Source Party</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <React.Fragment key={a.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    >
                      <TableCell className="p-2">
                        <Icon name={expanded === a.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="text-xs font-medium">{a.candidate}</TableCell>
                      <TableCell className="text-xs">{a.role}</TableCell>
                      <TableCell className="text-xs">{a.employer}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${SOURCE_TONES[a.sourcePortal]}`}>{a.sourcePortal}</Badge></TableCell>
                      <TableCell className="text-xs">{a.sourceParty}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${STAGE_TONES[a.stage]}`}>{a.stage}</Badge></TableCell>
                      <TableCell className="text-xs">{timeAgo(a.updatedAt)}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${a.status === "Active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-slate-500/15 text-slate-700 border-slate-500/30"}`}>{a.status}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${SYNC_TONES[a.sync]}`}>{a.sync}</Badge></TableCell>
                    </TableRow>
                    {expanded === a.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={11} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Icon name="Route" className="h-4 w-4 text-brand" />
                              <p className="text-sm font-semibold">Cross-Portal Trace · {a.candidate}</p>
                            </div>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {a.trace.map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${t.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={t.done ? "CheckCircle2" : "Clock"} className={`h-4 w-4 ${t.done ? "text-emerald-600" : "text-amber-600"}`} />
                                      <span className="text-xs font-semibold">{t.portal}</span>
                                    </div>
                                    <p className="mt-1 text-xs">{t.action}</p>
                                    <p className="mt-1 text-[10px] text-muted-foreground">{t.at ? timeAgo(t.at) : "—"}</p>
                                  </div>
                                  {i < a.trace.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Re-syncing ${a.id}…`)}>Re-sync</Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${a.id} detail`)}>View Detail</Button>
                              {a.sync === "Conflict" && <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Resolving conflict in ${a.id}`)}>Resolve Conflict</Button>}
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Sync Health by Source</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(SOURCE_TONES) as SourcePortal[]).map(s => {
                const items = APPS.filter(a => a.sourcePortal === s);
                const synced = items.filter(a => a.sync === "Synced").length;
                const pct = items.length ? Math.round((synced / items.length) * 100) : 0;
                return (
                  <div key={s} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${SOURCE_TONES[s]}`}>{s}</Badge>
                      <span className="text-xs font-semibold">{synced}/{items.length} · {pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Resolving conflicts…")}>
              <Icon name="AlertCircle" className="mr-2 h-4 w-4" /> Resolve {APPS.filter(a => a.sync === "Conflict").length} Conflicts
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Re-syncing pending…")}>
              <Icon name="RefreshCw" className="mr-2 h-4 w-4" /> Re-sync {APPS.filter(a => a.sync === "Pending Sync").length} Pending
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Deduplicating candidates…")}>
              <Icon name="Users" className="mr-2 h-4 w-4" /> Dedupe Candidates
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Generating audit report…")}>
              <Icon name="FileText" className="mr-2 h-4 w-4" /> Audit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
