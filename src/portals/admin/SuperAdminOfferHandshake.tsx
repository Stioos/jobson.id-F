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

type CandidateAction = "Pending" | "Accepted" | "Declined" | "Negotiating";
type EmployerStatus = "Sent" | "Viewed" | "Signed" | "Withdrawn";
type HandshakeStatus = "Synced" | "Pending" | "Conflict";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Cross-Portal";

interface HandshakeStep {
  portal: Portal;
  label: string;
  status: "Done" | "Current" | "Upcoming";
  at?: string;
}

interface OfferHandshake {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  ctc: number;
  sentAt: string;
  expiryAt: string;
  candidateAction: CandidateAction;
  employerStatus: EmployerStatus;
  handshake: HandshakeStatus;
  lastSync: string;
  chain: HandshakeStep[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Cross-Portal": "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const CANDIDATE_TONES: Record<CandidateAction, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Declined: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Negotiating: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const EMPLOYER_TONES: Record<EmployerStatus, string> = {
  Sent: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Viewed: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Signed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Withdrawn: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const HANDSHAKE_TONES: Record<HandshakeStatus, string> = {
  Synced: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Conflict: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const OFFERS: OfferHandshake[] = [
  { id: "OH-4001", candidate: "Aarav Sharma", employer: "TechCorp India", role: "Senior Frontend Engineer", ctc: 2400000, sentAt: "2024-09-18T10:00:00Z", expiryAt: "2024-09-25T10:00:00Z", candidateAction: "Accepted", employerStatus: "Signed", handshake: "Synced", lastSync: "2024-09-19T09:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-18T10:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-18T15:30:00Z" },
    { portal: "Candidate", label: "Candidate accepted", status: "Done", at: "2024-09-19T08:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Done", at: "2024-09-19T08:05:00Z" },
    { portal: "Cross-Portal", label: "Placement created", status: "Done", at: "2024-09-19T09:00:00Z" },
  ]},
  { id: "OH-4002", candidate: "Diya Patel", employer: "CloudOps Solutions", role: "DevOps Engineer", ctc: 1850000, sentAt: "2024-09-20T11:00:00Z", expiryAt: "2024-09-27T11:00:00Z", candidateAction: "Pending", employerStatus: "Viewed", handshake: "Pending", lastSync: "2024-09-20T11:30:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-20T11:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-20T11:30:00Z" },
    { portal: "Candidate", label: "Candidate action", status: "Current" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
    { portal: "Cross-Portal", label: "Placement created", status: "Upcoming" },
  ]},
  { id: "OH-4003", candidate: "Rohan Mehta", employer: "BrightApps Tech", role: "Backend Engineer", ctc: 1600000, sentAt: "2024-09-17T09:00:00Z", expiryAt: "2024-09-24T09:00:00Z", candidateAction: "Negotiating", employerStatus: "Viewed", handshake: "Conflict", lastSync: "2024-09-21T07:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-17T09:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-17T14:00:00Z" },
    { portal: "Candidate", label: "Candidate negotiating", status: "Current", at: "2024-09-21T07:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
    { portal: "Cross-Portal", label: "Placement created", status: "Upcoming" },
  ]},
  { id: "OH-4004", candidate: "Ananya Iyer", employer: "Nimbus Labs", role: "Product Designer", ctc: 2200000, sentAt: "2024-09-15T12:00:00Z", expiryAt: "2024-09-22T12:00:00Z", candidateAction: "Declined", employerStatus: "Withdrawn", handshake: "Synced", lastSync: "2024-09-21T05:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-15T12:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-16T10:00:00Z" },
    { portal: "Candidate", label: "Candidate declined", status: "Done", at: "2024-09-20T16:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Done", at: "2024-09-20T16:05:00Z" },
  ]},
  { id: "OH-4005", candidate: "Karthik Rao", employer: "TechCorp India", role: "Data Scientist", ctc: 2800000, sentAt: "2024-09-19T14:00:00Z", expiryAt: "2024-09-26T14:00:00Z", candidateAction: "Pending", employerStatus: "Sent", handshake: "Pending", lastSync: "2024-09-19T14:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-19T14:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Current" },
    { portal: "Candidate", label: "Candidate action", status: "Upcoming" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
    { portal: "Cross-Portal", label: "Placement created", status: "Upcoming" },
  ]},
  { id: "OH-4006", candidate: "Sneha Reddy", employer: "CloudOps Solutions", role: "QA Lead", ctc: 1950000, sentAt: "2024-09-14T10:00:00Z", expiryAt: "2024-09-21T10:00:00Z", candidateAction: "Pending", employerStatus: "Sent", handshake: "Conflict", lastSync: "2024-09-21T03:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-14T10:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-14T18:00:00Z" },
    { portal: "Candidate", label: "Offer expired (no action)", status: "Current", at: "2024-09-21T10:00:00Z" },
    { portal: "Employer", label: "Employer withdraw", status: "Upcoming" },
  ]},
  { id: "OH-4007", candidate: "Vivek Nair", employer: "BrightApps Tech", role: "SRE", ctc: 2600000, sentAt: "2024-09-16T09:00:00Z", expiryAt: "2024-09-23T09:00:00Z", candidateAction: "Accepted", employerStatus: "Signed", handshake: "Synced", lastSync: "2024-09-17T11:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-16T09:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-16T13:00:00Z" },
    { portal: "Candidate", label: "Candidate accepted", status: "Done", at: "2024-09-17T10:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Done", at: "2024-09-17T10:05:00Z" },
    { portal: "Cross-Portal", label: "Placement created", status: "Done", at: "2024-09-17T11:00:00Z" },
  ]},
  { id: "OH-4008", candidate: "Priya Menon", employer: "Nimbus Labs", role: "Full Stack Engineer", ctc: 2100000, sentAt: "2024-09-21T08:00:00Z", expiryAt: "2024-09-28T08:00:00Z", candidateAction: "Pending", employerStatus: "Sent", handshake: "Pending", lastSync: "2024-09-21T08:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-21T08:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Current" },
    { portal: "Candidate", label: "Candidate action", status: "Upcoming" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
  ]},
  { id: "OH-4009", candidate: "Arjun Singh", employer: "TechCorp India", role: "Mobile Engineer", ctc: 2300000, sentAt: "2024-09-18T11:00:00Z", expiryAt: "2024-09-25T11:00:00Z", candidateAction: "Accepted", employerStatus: "Signed", handshake: "Synced", lastSync: "2024-09-19T13:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-18T11:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-18T16:00:00Z" },
    { portal: "Candidate", label: "Candidate accepted", status: "Done", at: "2024-09-19T12:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Done", at: "2024-09-19T12:05:00Z" },
    { portal: "Cross-Portal", label: "Placement created", status: "Done", at: "2024-09-19T13:00:00Z" },
  ]},
  { id: "OH-4010", candidate: "Meera Joshi", employer: "CloudOps Solutions", role: "Platform Engineer", ctc: 1750000, sentAt: "2024-09-19T15:00:00Z", expiryAt: "2024-09-26T15:00:00Z", candidateAction: "Negotiating", employerStatus: "Viewed", handshake: "Pending", lastSync: "2024-09-20T19:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-19T15:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-19T20:00:00Z" },
    { portal: "Candidate", label: "Candidate negotiating", status: "Current", at: "2024-09-20T19:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
  ]},
  { id: "OH-4011", candidate: "Sahil Verma", employer: "BrightApps Tech", role: "Security Engineer", ctc: 2500000, sentAt: "2024-09-13T10:00:00Z", expiryAt: "2024-09-20T10:00:00Z", candidateAction: "Declined", employerStatus: "Withdrawn", handshake: "Synced", lastSync: "2024-09-20T10:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-13T10:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-13T15:00:00Z" },
    { portal: "Candidate", label: "Candidate declined", status: "Done", at: "2024-09-19T11:00:00Z" },
    { portal: "Employer", label: "Employer notified", status: "Done", at: "2024-09-19T11:05:00Z" },
  ]},
  { id: "OH-4012", candidate: "Isha Banerjee", employer: "Nimbus Labs", role: "ML Engineer", ctc: 2900000, sentAt: "2024-09-21T09:00:00Z", expiryAt: "2024-09-28T09:00:00Z", candidateAction: "Pending", employerStatus: "Viewed", handshake: "Pending", lastSync: "2024-09-21T10:00:00Z", chain: [
    { portal: "Employer", label: "Employer sent offer", status: "Done", at: "2024-09-21T09:00:00Z" },
    { portal: "Candidate", label: "Candidate viewed", status: "Done", at: "2024-09-21T10:00:00Z" },
    { portal: "Candidate", label: "Candidate action", status: "Current" },
    { portal: "Employer", label: "Employer notified", status: "Upcoming" },
  ]},
];

export function SuperAdminOfferHandshake() {
  const [search, setSearch] = React.useState("");
  const [candidateAction, setCandidateAction] = React.useState("all");
  const [handshake, setHandshake] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = OFFERS.filter(o => {
    const q = search.toLowerCase();
    const m = !q || o.id.toLowerCase().includes(q) || o.candidate.toLowerCase().includes(q) || o.employer.toLowerCase().includes(q);
    const c = candidateAction === "all" || o.candidateAction === candidateAction;
    const h = handshake === "all" || o.handshake === handshake;
    return m && c && h;
  });

  const pending = OFFERS.filter(o => o.candidateAction === "Pending").length;
  const accepted = OFFERS.filter(o => o.candidateAction === "Accepted").length;
  const declined = OFFERS.filter(o => o.candidateAction === "Declined").length;
  const expired = OFFERS.filter(o => new Date(o.expiryAt).getTime() < Date.now() && o.candidateAction === "Pending").length;
  const conflicts = OFFERS.filter(o => o.handshake === "Conflict").length;
  const avgAccept = "2.4 days";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer Handshake"
        description="Cross-portal offer acceptance handshake tracker — sync employer-sent offers with candidate actions and placement creation across Employer, Candidate, and Cross-Portal systems."
        icon={<Icon name="Handshake" className="h-6 w-6" />}
        actions={[
          { label: "Resolve Conflicts", variant: "outline", onClick: () => toast.success(`Resolving ${conflicts} sync conflicts…`) },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting offer handshakes…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        <StatCard label="Total Offers" value={OFFERS.length} icon={<Icon name="Gift" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Accept" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Accepted" value={accepted} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Declined" value={declined} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Expired" value={expired} icon={<Icon name="CalendarOff" className="h-5 w-5" />} tone="default" />
        <StatCard label="Avg Time-to-Accept" value={avgAccept} icon={<Icon name="Activity" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Offer Handshake Tracker" description={`${filtered.length} of ${OFFERS.length} offers across portals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search offer ID, candidate, employer…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={candidateAction} onValueChange={setCandidateAction}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Candidate Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
                <SelectItem value="Negotiating">Negotiating</SelectItem>
              </SelectContent>
            </Select>
            <Select value={handshake} onValueChange={setHandshake}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Handshake" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Handshakes</SelectItem>
                <SelectItem value="Synced">Synced</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Conflict">Conflict</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Handshake" className="h-6 w-6" />} title="No offer handshakes match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Offer ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>CTC</TableHead>
                  <TableHead>Sent / Expiry</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Handshake</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <React.Fragment key={o.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === o.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell className="text-xs font-medium">{o.candidate}</TableCell>
                      <TableCell className="text-xs">{o.employer}</TableCell>
                      <TableCell className="text-xs">{o.role}</TableCell>
                      <TableCell className="text-xs font-medium">₹{(o.ctc / 100000).toFixed(1)}L</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">
                        <div>{new Date(o.sentAt).toLocaleDateString()}</div>
                        <div>exp {new Date(o.expiryAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${CANDIDATE_TONES[o.candidateAction]}`}>{o.candidateAction}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${EMPLOYER_TONES[o.employerStatus]}`}>{o.employerStatus}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${HANDSHAKE_TONES[o.handshake]}`}>{o.handshake}</Badge></TableCell>
                    </TableRow>
                    {expanded === o.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={10} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Handshake Timeline · {o.id} · Last sync {timeAgo(o.lastSync)}</p>
                              </div>
                              {o.handshake === "Conflict" && (
                                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${o.id} conflict resolved — re-syncing`)}>
                                  <Icon name="RefreshCw" className="mr-1 h-3 w-3" /> Resolve Conflict
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {o.chain.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${c.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : c.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={c.status === "Done" ? "CheckCircle2" : c.status === "Current" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${c.status === "Done" ? "text-emerald-600" : c.status === "Current" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.portal]}`}>{c.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{c.label}</p>
                                    {c.at && <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(c.at)}</p>}
                                  </div>
                                  {i < o.chain.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
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
        <SectionCard title="Sync Conflict Resolver" description={`${conflicts} offers have cross-portal sync conflicts`}>
          <div className="space-y-2">
            {OFFERS.filter(o => o.handshake === "Conflict").map(o => (
              <div key={o.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="ShieldAlert" className="h-4 w-4 text-rose-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium">{o.id} · {o.candidate}</p>
                  <p className="text-[10px] text-muted-foreground">Candidate state: {o.candidateAction}, Employer state: {o.employerStatus}. Last sync {timeAgo(o.lastSync)}.</p>
                </div>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${o.id} re-synced`)}>
                  Re-sync
                </Button>
              </div>
            ))}
            {conflicts === 0 && <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No sync conflicts" description="All offer handshakes are in sync." />}
          </div>
        </SectionCard>

        <SectionCard title="Handshake Stats by Portal" description="Offer sync coverage across portals">
          <div className="space-y-3">
            {[
              { portal: "Employer → Candidate", count: OFFERS.length, synced: OFFERS.filter(o => o.handshake === "Synced").length },
              { portal: "Candidate → Employer", count: OFFERS.filter(o => o.candidateAction !== "Pending").length, synced: OFFERS.filter(o => o.candidateAction !== "Pending" && o.handshake === "Synced").length },
              { portal: "Cross-Portal Placement", count: OFFERS.filter(o => o.candidateAction === "Accepted").length, synced: OFFERS.filter(o => o.candidateAction === "Accepted" && o.handshake === "Synced").length },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.portal}</span>
                  <span className="text-muted-foreground">{s.synced}/{s.count} synced</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brand" style={{ width: `${s.count === 0 ? 0 : (s.synced / s.count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
