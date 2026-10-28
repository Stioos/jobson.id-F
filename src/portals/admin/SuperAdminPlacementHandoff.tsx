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
import { timeAgo, formatDateTime } from "@/lib/format";

type FromPortal = "Recruiter" | "Training" | "Partner";
type HandoffStep = "Notify Employer" | "Create Hire Record" | "Notify Candidate" | "Create Offer" | "Start Onboarding";
type HandoffStatus = "Pending" | "In Progress" | "Completed" | "Failed";

interface StepState {
  step: HandoffStep;
  status: "Done" | "Current" | "Upcoming" | "Failed";
  at?: string;
}

interface Handoff {
  id: string;
  candidate: string;
  employer: string;
  fromPortal: FromPortal;
  currentStep: HandoffStep;
  status: HandoffStatus;
  timestamp: string;
  steps: StepState[];
}

interface HistoryLog {
  id: string;
  candidate: string;
  action: string;
  by: string;
  at: string;
  outcome: "success" | "warning" | "error";
}

const FROM_TONES: Record<FromPortal, string> = {
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const STEP_TONES: Record<HandoffStep, string> = {
  "Notify Employer": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  "Create Hire Record": "bg-violet-500/15 text-violet-700 border-violet-500/30",
  "Notify Candidate": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Create Offer": "bg-orange-500/15 text-orange-700 border-orange-500/30",
  "Start Onboarding": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const STATUS_TONES: Record<HandoffStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "In Progress": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const HANDOFFS: Handoff[] = [
  { id: "PH-501", candidate: "Rajat Gupta", employer: "TechCorp India", fromPortal: "Recruiter", currentStep: "Start Onboarding", status: "Completed", timestamp: "2024-09-08T15:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-05T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-05T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-06T09:00:00Z" },
    { step: "Create Offer", status: "Done", at: "2024-09-07T14:00:00Z" },
    { step: "Start Onboarding", status: "Done", at: "2024-09-08T15:00:00Z" },
  ]},
  { id: "PH-502", candidate: "Diya Patel", employer: "Nimbus Labs", fromPortal: "Recruiter", currentStep: "Create Offer", status: "In Progress", timestamp: "2024-09-20T16:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-20T16:30:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-20T17:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-21T09:00:00Z" },
    { step: "Create Offer", status: "Current" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-503", candidate: "Ananya Iyer", employer: "BrightApps Tech", fromPortal: "Training", currentStep: "Start Onboarding", status: "Completed", timestamp: "2024-09-18T15:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-15T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-15T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-16T09:00:00Z" },
    { step: "Create Offer", status: "Done", at: "2024-09-17T14:00:00Z" },
    { step: "Start Onboarding", status: "Done", at: "2024-09-18T15:00:00Z" },
  ]},
  { id: "PH-504", candidate: "Kabir Malhotra", employer: "CloudOps Solutions", fromPortal: "Training", currentStep: "Create Offer", status: "Failed", timestamp: "2024-09-17T11:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-14T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-14T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-15T09:00:00Z" },
    { step: "Create Offer", status: "Failed", at: "2024-09-17T11:00:00Z" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-505", candidate: "Sahil Khan", employer: "TechCorp India", fromPortal: "Partner", currentStep: "Create Hire Record", status: "In Progress", timestamp: "2024-09-19T13:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-19T13:30:00Z" },
    { step: "Create Hire Record", status: "Current" },
    { step: "Notify Candidate", status: "Upcoming" },
    { step: "Create Offer", status: "Upcoming" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-506", candidate: "Lavanya Pillai", employer: "Nimbus Labs", fromPortal: "Recruiter", currentStep: "Start Onboarding", status: "Completed", timestamp: "2024-09-12T15:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-09T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-09T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-10T09:00:00Z" },
    { step: "Create Offer", status: "Done", at: "2024-09-11T14:00:00Z" },
    { step: "Start Onboarding", status: "Done", at: "2024-09-12T15:00:00Z" },
  ]},
  { id: "PH-507", candidate: "Nikhil Joshi", employer: "CloudOps Solutions", fromPortal: "Partner", currentStep: "Notify Candidate", status: "In Progress", timestamp: "2024-09-18T09:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-18T09:30:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-18T10:00:00Z" },
    { step: "Notify Candidate", status: "Current" },
    { step: "Create Offer", status: "Upcoming" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-508", candidate: "Pooja Desai", employer: "TechCorp India", fromPortal: "Recruiter", currentStep: "Notify Employer", status: "Pending", timestamp: "2024-09-21T08:00:00Z", steps: [
    { step: "Notify Employer", status: "Current" },
    { step: "Create Hire Record", status: "Upcoming" },
    { step: "Notify Candidate", status: "Upcoming" },
    { step: "Create Offer", status: "Upcoming" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-509", candidate: "Manish Agarwal", employer: "Nimbus Labs", fromPortal: "Training", currentStep: "Start Onboarding", status: "Completed", timestamp: "2024-09-04T15:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-01T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-01T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-02T09:00:00Z" },
    { step: "Create Offer", status: "Done", at: "2024-09-03T14:00:00Z" },
    { step: "Start Onboarding", status: "Done", at: "2024-09-04T15:00:00Z" },
  ]},
  { id: "PH-510", candidate: "Ishita Bose", employer: "BrightApps Tech", fromPortal: "Training", currentStep: "Notify Candidate", status: "Failed", timestamp: "2024-09-16T10:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-13T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-13T11:00:00Z" },
    { step: "Notify Candidate", status: "Failed", at: "2024-09-16T10:00:00Z" },
    { step: "Create Offer", status: "Upcoming" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-511", candidate: "Karan Verma", employer: "TechCorp India", fromPortal: "Partner", currentStep: "Notify Employer", status: "Pending", timestamp: "2024-09-21T07:00:00Z", steps: [
    { step: "Notify Employer", status: "Current" },
    { step: "Create Hire Record", status: "Upcoming" },
    { step: "Notify Candidate", status: "Upcoming" },
    { step: "Create Offer", status: "Upcoming" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
  { id: "PH-512", candidate: "Arjun Nair", employer: "CloudOps Solutions", fromPortal: "Recruiter", currentStep: "Create Offer", status: "In Progress", timestamp: "2024-09-15T11:00:00Z", steps: [
    { step: "Notify Employer", status: "Done", at: "2024-09-12T10:00:00Z" },
    { step: "Create Hire Record", status: "Done", at: "2024-09-12T11:00:00Z" },
    { step: "Notify Candidate", status: "Done", at: "2024-09-13T09:00:00Z" },
    { step: "Create Offer", status: "Current" },
    { step: "Start Onboarding", status: "Upcoming" },
  ]},
];

const HISTORY: HistoryLog[] = [
  { id: "L1", candidate: "Diya Patel", action: "Offer created and pushed to candidate portal", by: "Employer Portal · Nimbus Labs", at: "2024-09-21T10:30:00Z", outcome: "success" },
  { id: "L2", candidate: "Kabir Malhotra", action: "Offer creation failed — budget cap exceeded", by: "Employer Portal · CloudOps", at: "2024-09-17T11:00:00Z", outcome: "error" },
  { id: "L3", candidate: "Sahil Khan", action: "Hire record creation in progress", by: "Employer Portal · TechCorp", at: "2024-09-19T13:30:00Z", outcome: "warning" },
  { id: "L4", candidate: "Rajat Gupta", action: "Onboarding checklist created", by: "Admin Portal", at: "2024-09-08T15:00:00Z", outcome: "success" },
  { id: "L5", candidate: "Ishita Bose", action: "Candidate notification bounced — email invalid", by: "Candidate Portal", at: "2024-09-16T10:00:00Z", outcome: "error" },
  { id: "L6", candidate: "Ananya Iyer", action: "Placement registry updated", by: "Admin Portal", at: "2024-09-18T15:00:00Z", outcome: "success" },
];

export function SuperAdminPlacementHandoff() {
  const [search, setSearch] = React.useState("");
  const [from, setFrom] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = HANDOFFS.filter(h => {
    const q = search.toLowerCase();
    const m = !q || h.id.toLowerCase().includes(q) || h.candidate.toLowerCase().includes(q) || h.employer.toLowerCase().includes(q);
    const f = from === "all" || h.fromPortal === from;
    const s = status === "all" || h.status === status;
    return m && f && s;
  });

  const pending = HANDOFFS.filter(h => h.status === "Pending" || h.status === "In Progress").length;
  const completed = HANDOFFS.filter(h => h.status === "Completed").length;
  const failed = HANDOFFS.filter(h => h.status === "Failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Handoff"
        description="Cross-portal placement handoff tracker — recruiter/training/partner marks placed → employer creates hire → candidate offer & onboarding → admin placement registry. With retry and full audit log."
        icon={<Icon name="Send" className="h-6 w-6" />}
        actions={[
          { label: "Retry Failed", variant: "outline", onClick: () => toast.success(`Retrying ${failed} failed handoffs…`) },
          { label: "New Handoff", variant: "default", onClick: () => toast.success("Opening handoff form…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Handoffs" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Failed" value={failed} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg Handoff Time" value="3.2d" icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Handoff Queue" description={`${filtered.length} of ${HANDOFFS.length} placements`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, candidate, employer…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="From Portal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Send" className="h-6 w-6" />} title="No handoffs match filters" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Placement ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>From Portal</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(h => (
                  <React.Fragment key={h.id}>
                    <TableRow
                      className={`cursor-pointer hover:bg-muted/50 ${h.status === "Failed" ? "bg-rose-500/5" : ""}`}
                      onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === h.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{h.id}</TableCell>
                      <TableCell className="text-xs font-medium">{h.candidate}</TableCell>
                      <TableCell className="text-xs">{h.employer}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${FROM_TONES[h.fromPortal]}`}>{h.fromPortal}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${STEP_TONES[h.currentStep]}`}>{h.currentStep}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${STATUS_TONES[h.status]}`}>{h.status}</Badge></TableCell>
                      <TableCell className="text-xs">{timeAgo(h.timestamp)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {h.status === "Failed" ? (
                          <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Retrying ${h.id}…`)}>Retry</Button>
                        ) : h.status === "Completed" ? (
                          <Button size="sm" variant="ghost" className="h-7 text-xs">{expanded === h.id ? "Hide" : "View"}</Button>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Advancing ${h.id}`)}>Advance</Button>
                        )}
                      </TableCell>
                    </TableRow>
                    {expanded === h.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={9} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Icon name="Workflow" className="h-4 w-4 text-brand" />
                              <p className="text-sm font-semibold">Handoff Workflow · {h.id} · {h.candidate}</p>
                            </div>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {h.steps.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${s.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : s.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : s.status === "Failed" ? "border-rose-500/30 bg-rose-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={s.status === "Done" ? "CheckCircle2" : s.status === "Current" ? "Clock" : s.status === "Failed" ? "AlertTriangle" : "CircleDot"} className={`h-4 w-4 ${s.status === "Done" ? "text-emerald-600" : s.status === "Current" ? "text-amber-600" : s.status === "Failed" ? "text-rose-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${STEP_TONES[s.step]}`}>{s.step}</Badge>
                                    </div>
                                    <p className="mt-1 text-[10px] text-muted-foreground">{s.status}{s.at ? ` · ${timeAgo(s.at)}` : ""}</p>
                                  </div>
                                  {i < h.steps.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                            {h.status === "Failed" && (
                              <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="AlertCircle" className="h-4 w-4 text-rose-600" />
                                  <p className="text-xs font-semibold">Error — step failed, manual retry required</p>
                                </div>
                                <div className="mt-2 flex gap-2">
                                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Retrying ${h.id} from failed step`)}>Retry Step</Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Skipping failed step in ${h.id}`)}>Skip & Continue</Button>
                                </div>
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

      <SectionCard title="Handoff History Log" description="Latest cross-portal handoff events">
        <div className="space-y-2">
          {HISTORY.map(l => (
            <div key={l.id} className={`flex items-start gap-3 rounded-lg border p-3 ${l.outcome === "error" ? "border-rose-500/30 bg-rose-500/5" : l.outcome === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
              <Icon name={l.outcome === "error" ? "AlertCircle" : l.outcome === "warning" ? "AlertTriangle" : "CheckCircle2"} className={`mt-0.5 h-4 w-4 ${l.outcome === "error" ? "text-rose-600" : l.outcome === "warning" ? "text-amber-600" : "text-emerald-600"}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium">{l.candidate}</p>
                  <span className="text-[10px] text-muted-foreground">{formatDateTime(l.at)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.action}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">by {l.by}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Handoff Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-5">
              {(["Notify Employer", "Create Hire Record", "Notify Candidate", "Create Offer", "Start Onboarding"] as HandoffStep[]).map(step => {
                const reached = HANDOFFS.filter(h => h.steps.find(s => s.step === step && (s.status === "Done" || s.status === "Current" || s.status === "Failed"))).length;
                const done = HANDOFFS.filter(h => h.steps.find(s => s.step === step && s.status === "Done")).length;
                const pct = reached ? Math.round((done / reached) * 100) : 0;
                return (
                  <div key={step} className="rounded-lg border p-3 text-center">
                    <Badge variant="outline" className={`text-[10px] ${STEP_TONES[step]}`}>{step}</Badge>
                    <p className="mt-2 text-2xl font-bold">{done}/{reached}</p>
                    <p className="text-[10px] text-muted-foreground">{pct}% done</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success(`Retrying ${failed} failed handoffs…`)}>
              <Icon name="RotateCcw" className="mr-2 h-4 w-4" /> Retry {failed} Failed
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Syncing registry…")}>
              <Icon name="RefreshCw" className="mr-2 h-4 w-4" /> Sync Placement Registry
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Exporting audit log…")}>
              <Icon name="Download" className="mr-2 h-4 w-4" /> Export Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
