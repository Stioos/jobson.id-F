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

type Mode = "In-person" | "Video" | "Phone";
type ScheduledBy = "Employer" | "Recruiter";
type CandidateVisibility = "Visible" | "Hidden" | "Pending";
type SyncStatus = "Synced" | "Pending" | "Failed";
type InterviewStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
type Portal = "Recruiter" | "Employer" | "Candidate";

interface SyncStep {
  portal: Portal;
  label: string;
  status: "Done" | "Current" | "Upcoming";
  at?: string;
}

interface Interview {
  id: string;
  candidate: string;
  employer: string;
  recruiter?: string;
  role: string;
  scheduledAt: string;
  mode: Mode;
  scheduledBy: ScheduledBy;
  visibility: CandidateVisibility;
  sync: SyncStatus;
  status: InterviewStatus;
  chain: SyncStep[];
  conflict?: string;
}

const PORTAL_TONES: Record<Portal, string> = {
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const MODE_TONES: Record<Mode, string> = {
  "In-person": "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Video: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Phone: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

const SYNC_TONES: Record<SyncStatus, string> = {
  Synced: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const STATUS_TONES: Record<InterviewStatus, string> = {
  Scheduled: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Cancelled: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Rescheduled: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const VISIBILITY_TONES: Record<CandidateVisibility, string> = {
  Visible: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Hidden: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const INTERVIEWS: Interview[] = [
  { id: "IV-5001", candidate: "Aarav Sharma", employer: "TechCorp India", recruiter: "TalentBridge RPO", role: "Senior Frontend Engineer", scheduledAt: "2024-09-22T10:00:00Z", mode: "Video", scheduledBy: "Recruiter", visibility: "Visible", sync: "Synced", status: "Scheduled", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-19T09:00:00Z" },
    { portal: "Employer", label: "Employer confirmed", status: "Done", at: "2024-09-19T11:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-19T11:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-19T11:10:00Z" },
  ]},
  { id: "IV-5002", candidate: "Diya Patel", employer: "CloudOps Solutions", role: "DevOps Engineer", scheduledAt: "2024-09-21T14:00:00Z", mode: "Video", scheduledBy: "Employer", visibility: "Visible", sync: "Synced", status: "Completed", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-18T10:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-18T10:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-18T10:10:00Z" },
    { portal: "Employer", label: "Interview completed", status: "Done", at: "2024-09-21T14:30:00Z" },
  ]},
  { id: "IV-5003", candidate: "Rohan Mehta", employer: "BrightApps Tech", recruiter: "Apex Staffing", role: "Backend Engineer", scheduledAt: "2024-09-23T11:00:00Z", mode: "In-person", scheduledBy: "Recruiter", visibility: "Pending", sync: "Pending", status: "Scheduled", conflict: "Double-booking: candidate has another interview at 11:00", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-20T15:00:00Z" },
    { portal: "Employer", label: "Employer confirm", status: "Current" },
    { portal: "Candidate", label: "Candidate notify", status: "Upcoming" },
    { portal: "Candidate", label: "Calendar update", status: "Upcoming" },
  ]},
  { id: "IV-5004", candidate: "Ananya Iyer", employer: "Nimbus Labs", role: "Product Designer", scheduledAt: "2024-09-20T16:00:00Z", mode: "Video", scheduledBy: "Employer", visibility: "Hidden", sync: "Failed", status: "Cancelled", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-17T12:00:00Z" },
    { portal: "Candidate", label: "Candidate notify — failed", status: "Done", at: "2024-09-17T12:05:00Z" },
    { portal: "Employer", label: "Cancelled", status: "Done", at: "2024-09-19T10:00:00Z" },
  ]},
  { id: "IV-5005", candidate: "Karthik Rao", employer: "TechCorp India", recruiter: "TalentBridge RPO", role: "Data Scientist", scheduledAt: "2024-09-24T09:00:00Z", mode: "Video", scheduledBy: "Recruiter", visibility: "Visible", sync: "Synced", status: "Scheduled", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-20T08:00:00Z" },
    { portal: "Employer", label: "Employer confirmed", status: "Done", at: "2024-09-20T09:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-20T09:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-20T09:10:00Z" },
  ]},
  { id: "IV-5006", candidate: "Sneha Reddy", employer: "CloudOps Solutions", role: "QA Lead", scheduledAt: "2024-09-19T11:00:00Z", mode: "Phone", scheduledBy: "Employer", visibility: "Visible", sync: "Synced", status: "Rescheduled", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-16T10:00:00Z" },
    { portal: "Candidate", label: "Reschedule requested", status: "Done", at: "2024-09-18T14:00:00Z" },
    { portal: "Employer", label: "Reschedule confirmed", status: "Done", at: "2024-09-18T16:00:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-18T16:05:00Z" },
  ]},
  { id: "IV-5007", candidate: "Vivek Nair", employer: "BrightApps Tech", role: "SRE", scheduledAt: "2024-09-22T15:00:00Z", mode: "In-person", scheduledBy: "Employer", visibility: "Visible", sync: "Synced", status: "Scheduled", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-18T09:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-18T09:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-18T09:10:00Z" },
  ]},
  { id: "IV-5008", candidate: "Priya Menon", employer: "Nimbus Labs", recruiter: "Apex Staffing", role: "Full Stack Engineer", scheduledAt: "2024-09-23T13:00:00Z", mode: "Video", scheduledBy: "Recruiter", visibility: "Pending", sync: "Pending", status: "Scheduled", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-20T11:00:00Z" },
    { portal: "Employer", label: "Employer confirm", status: "Current" },
    { portal: "Candidate", label: "Candidate notify", status: "Upcoming" },
  ]},
  { id: "IV-5009", candidate: "Arjun Singh", employer: "TechCorp India", role: "Mobile Engineer", scheduledAt: "2024-09-18T10:00:00Z", mode: "Video", scheduledBy: "Employer", visibility: "Visible", sync: "Synced", status: "Completed", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-15T14:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-15T14:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-15T14:10:00Z" },
    { portal: "Employer", label: "Interview completed", status: "Done", at: "2024-09-18T11:00:00Z" },
  ]},
  { id: "IV-5010", candidate: "Meera Joshi", employer: "CloudOps Solutions", recruiter: "TalentBridge RPO", role: "Platform Engineer", scheduledAt: "2024-09-25T10:00:00Z", mode: "Video", scheduledBy: "Recruiter", visibility: "Hidden", sync: "Failed", status: "Scheduled", conflict: "Sync failed: candidate email bounced", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-21T08:00:00Z" },
    { portal: "Employer", label: "Employer confirmed", status: "Done", at: "2024-09-21T09:00:00Z" },
    { portal: "Candidate", label: "Candidate notify — failed", status: "Current", at: "2024-09-21T09:05:00Z" },
    { portal: "Candidate", label: "Calendar update", status: "Upcoming" },
  ]},
  { id: "IV-5011", candidate: "Sahil Verma", employer: "BrightApps Tech", role: "Security Engineer", scheduledAt: "2024-09-17T11:00:00Z", mode: "In-person", scheduledBy: "Employer", visibility: "Visible", sync: "Synced", status: "Completed", chain: [
    { portal: "Employer", label: "Employer scheduled", status: "Done", at: "2024-09-13T10:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-13T10:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-13T10:10:00Z" },
    { portal: "Employer", label: "Interview completed", status: "Done", at: "2024-09-17T12:00:00Z" },
  ]},
  { id: "IV-5012", candidate: "Isha Banerjee", employer: "Nimbus Labs", recruiter: "Apex Staffing", role: "ML Engineer", scheduledAt: "2024-09-24T15:00:00Z", mode: "Video", scheduledBy: "Recruiter", visibility: "Visible", sync: "Synced", status: "Scheduled", chain: [
    { portal: "Recruiter", label: "Recruiter scheduled", status: "Done", at: "2024-09-20T16:00:00Z" },
    { portal: "Employer", label: "Employer confirmed", status: "Done", at: "2024-09-20T17:00:00Z" },
    { portal: "Candidate", label: "Candidate notified", status: "Done", at: "2024-09-20T17:05:00Z" },
    { portal: "Candidate", label: "Calendar updated", status: "Done", at: "2024-09-20T17:10:00Z" },
  ]},
];

export function SuperAdminInterviewSync() {
  const [search, setSearch] = React.useState("");
  const [syncFilter, setSyncFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = INTERVIEWS.filter(i => {
    const q = search.toLowerCase();
    const m = !q || i.id.toLowerCase().includes(q) || i.candidate.toLowerCase().includes(q) || i.employer.toLowerCase().includes(q);
    const s = syncFilter === "all" || i.sync === syncFilter;
    const st = statusFilter === "all" || i.status === statusFilter;
    return m && s && st;
  });

  const synced = INTERVIEWS.filter(i => i.sync === "Synced").length;
  const pendingSync = INTERVIEWS.filter(i => i.sync === "Pending").length;
  const conflicts = INTERVIEWS.filter(i => i.conflict).length;
  const noShows = 1;
  const noShowRate = `${((noShows / INTERVIEWS.length) * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Sync"
        description="Cross-portal interview schedule synchronization — sync recruiter-scheduled, employer-confirmed, and candidate-notified interviews across all portals with conflict detection."
        icon={<Icon name="CalendarSync" className="h-6 w-6" />}
        actions={[
          { label: "Resolve Conflicts", variant: "outline", onClick: () => toast.success(`Resolving ${conflicts} scheduling conflicts…`) },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting interview sync report…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <StatCard label="Total Interviews" value={INTERVIEWS.length} icon={<Icon name="Video" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Synced" value={synced} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Sync" value={pendingSync} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Conflicts" value={conflicts} icon={<Icon name="ShieldAlert" className="h-5 w-5" />} tone="danger" />
        <StatCard label="No-show Rate" value={noShowRate} icon={<Icon name="UserX" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Interview Sync Queue" description={`${filtered.length} of ${INTERVIEWS.length} interviews across portals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, candidate, employer…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={syncFilter} onValueChange={setSyncFilter}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Sync" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sync</SelectItem>
                <SelectItem value="Synced">Synced</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="CalendarSync" className="h-6 w-6" />} title="No interviews match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Interview ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Employer / Recruiter</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Sync</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(i => (
                  <React.Fragment key={i.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === i.id ? null : i.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === i.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{i.id}</TableCell>
                      <TableCell className="text-xs font-medium">{i.candidate}</TableCell>
                      <TableCell className="text-[10px]">
                        <div className="text-xs">{i.employer}</div>
                        {i.recruiter && <div className="text-muted-foreground">via {i.recruiter}</div>}
                      </TableCell>
                      <TableCell className="text-xs">{i.role}</TableCell>
                      <TableCell className="text-[10px]">{new Date(i.scheduledAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${MODE_TONES[i.mode]}`}>{i.mode}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[i.scheduledBy as Portal]}`}>{i.scheduledBy}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${VISIBILITY_TONES[i.visibility]}`}>{i.visibility}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${SYNC_TONES[i.sync]}`}>{i.sync}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONES[i.status]}`}>{i.status}</Badge></TableCell>
                    </TableRow>
                    {expanded === i.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={11} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Sync Chain · {i.id}</p>
                              </div>
                              {i.conflict && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[10px] border-rose-500/30 bg-rose-500/10 text-rose-700">Conflict</Badge>
                                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${i.id} conflict resolved`)}>Resolve</Button>
                                </div>
                              )}
                            </div>
                            {i.conflict && (
                              <p className="rounded-md border border-rose-500/30 bg-rose-500/5 p-2 text-xs text-rose-700">
                                <Icon name="ShieldAlert" className="mr-1 inline h-3 w-3" />
                                {i.conflict}
                              </p>
                            )}
                            <div className="flex flex-wrap items-stretch gap-2">
                              {i.chain.map((c, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${c.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : c.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={c.status === "Done" ? "CheckCircle2" : c.status === "Current" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${c.status === "Done" ? "text-emerald-600" : c.status === "Current" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.portal]}`}>{c.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{c.label}</p>
                                    {c.at && <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(c.at)}</p>}
                                  </div>
                                  {idx < i.chain.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
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
        <SectionCard title="Scheduling Conflicts" description="Double-booking & sync failures detected">
          <div className="space-y-2">
            {INTERVIEWS.filter(i => i.conflict).map(i => (
              <div key={i.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="CalendarClock" className="h-4 w-4 text-rose-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium">{i.id} · {i.candidate} → {i.employer}</p>
                  <p className="text-[10px] text-muted-foreground">{i.conflict}</p>
                </div>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${i.id} reschedule proposed`)}>Propose Reschedule</Button>
              </div>
            ))}
            {conflicts === 0 && <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No conflicts detected" />}
          </div>
        </SectionCard>

        <SectionCard title="Sync Coverage by Scheduler" description="Sync rate by scheduler portal">
          <div className="space-y-3">
            {(["Recruiter", "Employer"] as ScheduledBy[]).map(by => {
              const total = INTERVIEWS.filter(i => i.scheduledBy === by).length;
              const syncedCount = INTERVIEWS.filter(i => i.scheduledBy === by && i.sync === "Synced").length;
              return (
                <div key={by} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{by}-scheduled</span>
                    <span className="text-muted-foreground">{syncedCount}/{total} synced</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-brand" style={{ width: `${total === 0 ? 0 : (syncedCount / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Candidate visibility granted</span>
                <span className="text-muted-foreground">{INTERVIEWS.filter(i => i.visibility === "Visible").length}/{INTERVIEWS.length}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-emerald-500" style={{ width: `${(INTERVIEWS.filter(i => i.visibility === "Visible").length / INTERVIEWS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
