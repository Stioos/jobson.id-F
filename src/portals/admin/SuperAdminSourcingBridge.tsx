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
import { formatDate, timeAgo } from "@/lib/format";

type RequestType = "T2H" | "H2T" | "Recruiter Search" | "Partner Sourcing";
type TargetPortal = "Training" | "Recruiter" | "Partner";
type ReqStatus = "Open" | "Sourcing" | "Submitted" | "Fulfilled" | "Closed";

interface SubmittedCandidate {
  name: string;
  portal: TargetPortal;
  status: "Submitted" | "Interview" | "Offered" | "Placed" | "Rejected";
}

interface SourcingRequest {
  id: string;
  requester: string;
  type: RequestType;
  targetPortal: TargetPortal;
  targetProvider: string;
  role: string;
  headcount: number;
  budget: number;
  status: ReqStatus;
  createdAt: string;
  fulfilledAt?: string;
  submitted: SubmittedCandidate[];
}

const TYPE_TONES: Record<RequestType, string> = {
  "T2H": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "H2T": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Recruiter Search": "bg-violet-500/15 text-violet-700 border-violet-500/30",
  "Partner Sourcing": "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const TARGET_TONES: Record<TargetPortal, string> = {
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const STATUS_TONES: Record<ReqStatus, string> = {
  Open: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Sourcing: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Submitted: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Fulfilled: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Closed: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

const CANDIDATE_STATUS_TONES: Record<SubmittedCandidate["status"], string> = {
  Submitted: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Interview: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Offered: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Placed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const REQUESTS: SourcingRequest[] = [
  { id: "SB-2001", requester: "TechCorp India", type: "T2H", targetPortal: "Training", targetProvider: "CodeCraft Bootcamp", role: "Junior Frontend Dev", headcount: 3, budget: 900000, status: "Fulfilled", createdAt: "2024-09-01T09:00:00Z", fulfilledAt: "2024-09-18T15:00:00Z", submitted: [
    { name: "Ananya Iyer", portal: "Training", status: "Placed" },
    { name: "Ishita Bose", portal: "Training", status: "Interview" },
    { name: "Kabir Malhotra", portal: "Training", status: "Placed" },
  ]},
  { id: "SB-2002", requester: "Nimbus Labs", type: "Recruiter Search", targetPortal: "Recruiter", targetProvider: "TalentBridge RPO", role: "Product Designer", headcount: 1, budget: 1800000, status: "Fulfilled", createdAt: "2024-08-20T10:00:00Z", fulfilledAt: "2024-09-15T16:00:00Z", submitted: [
    { name: "Diya Patel", portal: "Recruiter", status: "Placed" },
    { name: "Rahul Bose", portal: "Recruiter", status: "Rejected" },
  ]},
  { id: "SB-2003", requester: "CloudOps Solutions", type: "Partner Sourcing", targetPortal: "Partner", targetProvider: "Campus Connect", role: "DevOps Engineer", headcount: 2, budget: 1400000, status: "Submitted", createdAt: "2024-09-05T11:00:00Z", submitted: [
    { name: "Rohan Mehta", portal: "Partner", status: "Interview" },
    { name: "Sahil Khan", portal: "Partner", status: "Submitted" },
  ]},
  { id: "SB-2004", requester: "BrightApps Tech", type: "H2T", targetPortal: "Training", targetProvider: "SkillForge Academy", role: "Mobile Engineer", headcount: 2, budget: 1000000, status: "Sourcing", createdAt: "2024-09-12T09:00:00Z", submitted: [] },
  { id: "SB-2005", requester: "TechCorp India", type: "Recruiter Search", targetPortal: "Recruiter", targetProvider: "Apex Staffing", role: "Solution Architect", headcount: 1, budget: 3000000, status: "Fulfilled", createdAt: "2024-08-01T10:00:00Z", fulfilledAt: "2024-09-08T15:00:00Z", submitted: [
    { name: "Rajat Gupta", portal: "Recruiter", status: "Placed" },
  ]},
  { id: "SB-2006", requester: "Nimbus Labs", type: "Partner Sourcing", targetPortal: "Partner", targetProvider: "EduBridge Foundation", role: "Data Analyst", headcount: 3, budget: 1500000, status: "Open", createdAt: "2024-09-19T10:00:00Z", submitted: [] },
  { id: "SB-2007", requester: "CloudOps Solutions", type: "T2H", targetPortal: "Training", targetProvider: "CodeCraft Bootcamp", role: "Backend Engineer", headcount: 4, budget: 1200000, status: "Sourcing", createdAt: "2024-09-15T09:00:00Z", submitted: [] },
  { id: "SB-2008", requester: "BrightApps Tech", type: "Recruiter Search", targetPortal: "Recruiter", targetProvider: "TalentBridge RPO", role: "SRE", headcount: 1, budget: 2400000, status: "Submitted", createdAt: "2024-09-08T09:00:00Z", submitted: [
    { name: "Arjun Nair", portal: "Recruiter", status: "Interview" },
  ]},
  { id: "SB-2009", requester: "TechCorp India", type: "Partner Sourcing", targetPortal: "Partner", targetProvider: "Campus Connect", role: "Security Analyst", headcount: 2, budget: 1600000, status: "Submitted", createdAt: "2024-09-10T10:00:00Z", submitted: [
    { name: "Nikhil Joshi", portal: "Partner", status: "Submitted" },
  ]},
  { id: "SB-2010", requester: "Nimbus Labs", type: "H2T", targetPortal: "Training", targetProvider: "SkillForge Academy", role: "QA Engineer", headcount: 2, budget: 800000, status: "Closed", createdAt: "2024-08-10T09:00:00Z", fulfilledAt: "2024-08-28T15:00:00Z", submitted: [
    { name: "Manish Agarwal", portal: "Training", status: "Placed" },
  ]},
];

export function SuperAdminSourcingBridge() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [target, setTarget] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = REQUESTS.filter(r => {
    const q = search.toLowerCase();
    const m = !q || r.id.toLowerCase().includes(q) || r.requester.toLowerCase().includes(q) || r.role.toLowerCase().includes(q);
    const t = type === "all" || r.type === type;
    const tg = target === "all" || r.targetPortal === target;
    const s = status === "all" || r.status === status;
    return m && t && tg && s;
  });

  const active = REQUESTS.filter(r => r.status !== "Closed" && r.status !== "Fulfilled").length;
  const fulfilled = REQUESTS.filter(r => r.status === "Fulfilled" || r.status === "Closed").length;
  const rate = Math.round((fulfilled / REQUESTS.length) * 100);
  const totalCandidates = REQUESTS.reduce((s, r) => s + r.submitted.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sourcing Bridge"
        description="Cross-portal sourcing request bridge — employer → training/recruiter/partner routing, candidate submissions, fulfillment tracking and end-to-end flow visualization."
        icon={<Icon name="ArrowRightLeft" className="h-6 w-6" />}
        actions={[
          { label: "Flow Map", variant: "outline", onClick: () => toast.success("Opening flow visualization…") },
          { label: "New Request", variant: "default", onClick: () => toast.success("Opening sourcing request form…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Requests" value={active} icon={<Icon name="Activity" className="h-5 w-5" />} tone="warning" />
        <StatCard label="By Source" value={3} hint="Training · Recruiter · Partner" icon={<Icon name="Layers" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Fulfillment Rate" value={`${rate}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Fulfill" value="14.5d" icon={<Icon name="Clock" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Cross-Portal Flow" description="Employer → Training/Recruiter/Partner → Candidates → Employer">
        <div className="flex flex-wrap items-stretch gap-3">
          <div className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="flex items-center gap-2"><Icon name="Building2" className="h-5 w-5 text-rose-600" /><span className="text-sm font-semibold">Employer Portal</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Raises sourcing request</p>
            <p className="mt-2 text-2xl font-bold">{REQUESTS.length}</p>
            <p className="text-[10px] text-muted-foreground">requests</p>
          </div>
          <div className="flex items-center"><Icon name="ArrowRight" className="h-5 w-5 text-muted-foreground" /></div>
          <div className="flex-1 rounded-lg border p-4">
            <div className="grid grid-cols-3 gap-2">
              {(["Training", "Recruiter", "Partner"] as TargetPortal[]).map(p => {
                const items = REQUESTS.filter(r => r.targetPortal === p);
                return (
                  <div key={p} className={`rounded-md border p-2 ${TARGET_TONES[p]}`}>
                    <p className="text-xs font-semibold">{p}</p>
                    <p className="mt-1 text-lg font-bold">{items.length}</p>
                    <p className="text-[10px] opacity-70">requests</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">Sourcing providers</p>
          </div>
          <div className="flex items-center"><Icon name="ArrowRight" className="h-5 w-5 text-muted-foreground" /></div>
          <div className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2"><Icon name="Users" className="h-5 w-5 text-emerald-600" /><span className="text-sm font-semibold">Candidates</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Submitted to employer</p>
            <p className="mt-2 text-2xl font-bold">{totalCandidates}</p>
            <p className="text-[10px] text-muted-foreground">candidates</p>
          </div>
          <div className="flex items-center"><Icon name="ArrowRight" className="h-5 w-5 text-muted-foreground" /></div>
          <div className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="flex items-center gap-2"><Icon name="Building2" className="h-5 w-5 text-rose-600" /><span className="text-sm font-semibold">Employer Portal</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Reviews, interviews, hires</p>
            <p className="mt-2 text-2xl font-bold">{REQUESTS.reduce((s, r) => s + r.submitted.filter(c => c.status === "Placed").length, 0)}</p>
            <p className="text-[10px] text-muted-foreground">placed</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Sourcing Requests" description={`${filtered.length} of ${REQUESTS.length} requests`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, requester, role…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(TYPE_TONES) as RequestType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Target" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(STATUS_TONES) as ReqStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="ArrowRightLeft" className="h-6 w-6" />} title="No requests match filters" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Request ID</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target Provider</TableHead>
                  <TableHead>Role / Skill</TableHead>
                  <TableHead>HC</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Fulfilled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <React.Fragment key={r.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === r.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="text-xs font-medium">{r.requester}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${TYPE_TONES[r.type]}`}>{r.type}</Badge></TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span>{r.targetProvider}</span>
                          <Badge variant="outline" className={`mt-0.5 w-fit text-[10px] ${TARGET_TONES[r.targetPortal]}`}>{r.targetPortal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{r.role}</TableCell>
                      <TableCell className="text-xs">{r.headcount}</TableCell>
                      <TableCell className="text-xs">₹{(r.budget / 100000).toFixed(1)}L</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${STATUS_TONES[r.status]}`}>{r.status}</Badge></TableCell>
                      <TableCell className="text-xs">{formatDate(r.createdAt, { day: "numeric", month: "short" })}</TableCell>
                      <TableCell className="text-xs">{r.fulfilledAt ? formatDate(r.fulfilledAt, { day: "numeric", month: "short" }) : "—"}</TableCell>
                    </TableRow>
                    {expanded === r.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={11} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Icon name="Users" className="h-4 w-4 text-brand" />
                              <p className="text-sm font-semibold">Submitted Candidates · {r.submitted.length} of {r.headcount} required</p>
                            </div>
                            {r.submitted.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No candidates submitted yet — request is in {r.status.toLowerCase()} phase.</p>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {r.submitted.map((c, i) => (
                                  <div key={i} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">{c.name}</span>
                                      <Badge variant="outline" className={`text-[10px] ${TARGET_TONES[c.portal]}`}>{c.portal}</Badge>
                                    </div>
                                    <div className="mt-2"><Badge variant="outline" className={`text-[10px] ${CANDIDATE_STATUS_TONES[c.status]}`}>{c.status}</Badge></div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 pt-1">
                              <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Pushing ${r.id} to employer pipeline`)}>Push to Employer</Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Opening ${r.id} detail`)}>View Detail</Button>
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
          <CardHeader><CardTitle className="text-base">Fulfillment by Provider</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["Training", "Recruiter", "Partner"] as TargetPortal[]).map(p => {
                const items = REQUESTS.filter(r => r.targetPortal === p);
                const done = items.filter(r => r.status === "Fulfilled" || r.status === "Closed").length;
                const pct = items.length ? Math.round((done / items.length) * 100) : 0;
                return (
                  <div key={p} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${TARGET_TONES[p]}`}>{p}</Badge>
                      <span className="text-xs font-semibold">{pct}%</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold">{done}/{items.length}</p>
                    <p className="text-[10px] text-muted-foreground">fulfilled</p>
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
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Routing pending requests…")}>
              <Icon name="Send" className="mr-2 h-4 w-4" /> Route Pending Requests
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Syncing candidates…")}>
              <Icon name="RefreshCw" className="mr-2 h-4 w-4" /> Sync Submitted Candidates
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast.success("Generating report…")}>
              <Icon name="FileText" className="mr-2 h-4 w-4" /> Provider Performance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
