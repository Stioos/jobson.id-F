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

type CandidatePortalStatus = "Synced" | "Pending" | "Failed";
type VerifiedStatus = "Auto-verified" | "Manual" | "Rejected";
type Portal = "Training" | "Candidate" | "Employer" | "Admin";

interface SyncStep {
  portal: Portal;
  label: string;
  status: "Done" | "Current" | "Upcoming";
  at?: string;
}

interface Credential {
  id: string;
  candidate: string;
  trainingProvider: string;
  skill: string;
  level: string;
  issueDate: string;
  candidatePortalStatus: CandidatePortalStatus;
  verifiedStatus: VerifiedStatus;
  lastSyncAttempt: string;
  chain: SyncStep[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Admin: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

const SYNC_TONES: Record<CandidatePortalStatus, string> = {
  Synced: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const VERIFIED_TONES: Record<VerifiedStatus, string> = {
  "Auto-verified": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Manual: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const CREDENTIALS: Credential[] = [
  { id: "CR-1001", candidate: "Aarav Sharma", trainingProvider: "CodeCraft Bootcamp", skill: "React Fundamentals", level: "Advanced", issueDate: "2024-09-15T10:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-09-15T10:05:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-15T10:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-15T10:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-09-15T10:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-15T10:06:00Z" },
  ]},
  { id: "CR-1002", candidate: "Diya Patel", trainingProvider: "SkillForge Academy", skill: "AWS Cloud Practitioner", level: "Foundation", issueDate: "2024-09-18T11:00:00Z", candidatePortalStatus: "Pending", verifiedStatus: "Manual", lastSyncAttempt: "2024-09-18T11:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-18T11:00:00Z" },
    { portal: "Candidate", label: "Skill add pending", status: "Current" },
    { portal: "Candidate", label: "Verification pending", status: "Upcoming" },
    { portal: "Employer", label: "Badge visibility", status: "Upcoming" },
  ]},
  { id: "CR-1003", candidate: "Rohan Mehta", trainingProvider: "CodeCraft Bootcamp", skill: "Node.js Backend", level: "Intermediate", issueDate: "2024-09-10T09:00:00Z", candidatePortalStatus: "Failed", verifiedStatus: "Rejected", lastSyncAttempt: "2024-09-19T15:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-10T09:00:00Z" },
    { portal: "Candidate", label: "Sync failed — profile conflict", status: "Current", at: "2024-09-19T15:00:00Z" },
    { portal: "Candidate", label: "Verification pending", status: "Upcoming" },
  ]},
  { id: "CR-1004", candidate: "Ananya Iyer", trainingProvider: "SkillForge Academy", skill: "UI/UX Design", level: "Advanced", issueDate: "2024-09-12T13:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-09-12T13:10:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-12T13:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-12T13:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-09-12T13:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-12T13:10:00Z" },
  ]},
  { id: "CR-1005", candidate: "Karthik Rao", trainingProvider: "EduBridge Foundation", skill: "Python for Data Science", level: "Foundation", issueDate: "2024-09-05T10:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Manual", lastSyncAttempt: "2024-09-06T09:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-05T10:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-05T10:05:00Z" },
    { portal: "Admin", label: "Manual verification", status: "Done", at: "2024-09-06T09:00:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-06T09:05:00Z" },
  ]},
  { id: "CR-1006", candidate: "Sneha Reddy", trainingProvider: "CodeCraft Bootcamp", skill: "Selenium WebDriver", level: "Intermediate", issueDate: "2024-08-28T12:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-08-28T12:05:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-08-28T12:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-08-28T12:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-08-28T12:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-08-28T12:06:00Z" },
  ]},
  { id: "CR-1007", candidate: "Vivek Nair", trainingProvider: "SkillForge Academy", skill: "Docker & Kubernetes", level: "Advanced", issueDate: "2024-09-01T11:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-09-01T11:06:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-01T11:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-01T11:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-09-01T11:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-01T11:06:00Z" },
  ]},
  { id: "CR-1008", candidate: "Priya Menon", trainingProvider: "EduBridge Foundation", skill: "Full Stack Development", level: "Advanced", issueDate: "2024-09-14T15:00:00Z", candidatePortalStatus: "Pending", verifiedStatus: "Manual", lastSyncAttempt: "2024-09-14T15:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-14T15:00:00Z" },
    { portal: "Candidate", label: "Awaiting candidate profile confirmation", status: "Current" },
    { portal: "Candidate", label: "Verification pending", status: "Upcoming" },
  ]},
  { id: "CR-1009", candidate: "Arjun Singh", trainingProvider: "CodeCraft Bootcamp", skill: "React Native", level: "Intermediate", issueDate: "2024-09-08T10:00:00Z", candidatePortalStatus: "Failed", verifiedStatus: "Manual", lastSyncAttempt: "2024-09-20T08:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-08T10:00:00Z" },
    { portal: "Candidate", label: "Sync failed — candidate account email mismatch", status: "Current", at: "2024-09-20T08:00:00Z" },
    { portal: "Admin", label: "Manual review queued", status: "Upcoming" },
  ]},
  { id: "CR-1010", candidate: "Meera Joshi", trainingProvider: "SkillForge Academy", skill: "Linux Administration", level: "Foundation", issueDate: "2024-09-16T14:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-09-16T14:05:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-16T14:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-16T14:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-09-16T14:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-16T14:06:00Z" },
  ]},
  { id: "CR-1011", candidate: "Sahil Verma", trainingProvider: "EduBridge Foundation", skill: "Network Security", level: "Advanced", issueDate: "2024-09-03T09:00:00Z", candidatePortalStatus: "Synced", verifiedStatus: "Auto-verified", lastSyncAttempt: "2024-09-03T09:06:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-03T09:00:00Z" },
    { portal: "Candidate", label: "Skill added to profile", status: "Done", at: "2024-09-03T09:02:00Z" },
    { portal: "Candidate", label: "Skill marked Verified", status: "Done", at: "2024-09-03T09:05:00Z" },
    { portal: "Employer", label: "Verified badge visible", status: "Done", at: "2024-09-03T09:06:00Z" },
  ]},
  { id: "CR-1012", candidate: "Isha Banerjee", trainingProvider: "SkillForge Academy", skill: "Machine Learning", level: "Advanced", issueDate: "2024-09-19T12:00:00Z", candidatePortalStatus: "Pending", verifiedStatus: "Manual", lastSyncAttempt: "2024-09-19T12:00:00Z", chain: [
    { portal: "Training", label: "Training issues cert", status: "Done", at: "2024-09-19T12:00:00Z" },
    { portal: "Candidate", label: "Skill add pending", status: "Current" },
    { portal: "Candidate", label: "Verification pending", status: "Upcoming" },
  ]},
];

export function SuperAdminSkillCredentialSync() {
  const [search, setSearch] = React.useState("");
  const [syncFilter, setSyncFilter] = React.useState("all");
  const [verifiedFilter, setVerifiedFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = CREDENTIALS.filter(c => {
    const q = search.toLowerCase();
    const m = !q || c.id.toLowerCase().includes(q) || c.candidate.toLowerCase().includes(q) || c.skill.toLowerCase().includes(q);
    const s = syncFilter === "all" || c.candidatePortalStatus === syncFilter;
    const v = verifiedFilter === "all" || c.verifiedStatus === verifiedFilter;
    return m && s && v;
  });

  const synced = CREDENTIALS.filter(c => c.candidatePortalStatus === "Synced").length;
  const pending = CREDENTIALS.filter(c => c.candidatePortalStatus === "Pending").length;
  const failed = CREDENTIALS.filter(c => c.candidatePortalStatus === "Failed").length;
  const verified = CREDENTIALS.filter(c => c.verifiedStatus !== "Rejected").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Credential Sync"
        description="Skill credential synchronization between Training and Candidate portals — track issued certifications, sync status, verification, and downstream employer visibility of verified badges."
        icon={<Icon name="Award" className="h-6 w-6" />}
        actions={[
          { label: "Retry Failed", variant: "outline", onClick: () => toast.success(`Retrying ${failed} failed syncs…`) },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting credential sync report…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Credentials Issued" value={CREDENTIALS.length} icon={<Icon name="Award" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Synced to Candidate" value={synced} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Sync" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={failed} hint={`${verified} verified`} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Credential Sync Queue" description={`${filtered.length} of ${CREDENTIALS.length} credentials across training providers`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search credential ID, candidate, skill…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={syncFilter} onValueChange={setSyncFilter}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Sync Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sync</SelectItem>
                <SelectItem value="Synced">Synced</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Verified" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verified</SelectItem>
                <SelectItem value="Auto-verified">Auto-verified</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Award" className="h-6 w-6" />} title="No credentials match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Credential ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Training Provider</TableHead>
                  <TableHead>Skill / Level</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Candidate Portal</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Last Sync</TableHead>
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
                      <TableCell className="text-xs font-medium">{c.candidate}</TableCell>
                      <TableCell className="text-xs">{c.trainingProvider}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium">{c.skill}</div>
                        <div className="text-[10px] text-muted-foreground">{c.level}</div>
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{new Date(c.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${SYNC_TONES[c.candidatePortalStatus]}`}>{c.candidatePortalStatus}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${VERIFIED_TONES[c.verifiedStatus]}`}>{c.verifiedStatus}</Badge></TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{timeAgo(c.lastSyncAttempt)}</TableCell>
                    </TableRow>
                    {expanded === c.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={9} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Sync Flow · {c.id}</p>
                              </div>
                              {c.candidatePortalStatus === "Failed" && (
                                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${c.id} sync retry queued`)}>
                                  <Icon name="RotateCcw" className="mr-1 h-3 w-3" /> Retry Sync
                                </Button>
                              )}
                              {c.verifiedStatus === "Manual" && c.candidatePortalStatus === "Synced" && (
                                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${c.id} manually verified`)}>
                                  <Icon name="BadgeCheck" className="mr-1 h-3 w-3" /> Verify Now
                                </Button>
                              )}
                            </div>
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
        <SectionCard title="Failed Sync Queue" description={`${failed} credentials failed to sync — retry available`}>
          <div className="space-y-2">
            {CREDENTIALS.filter(c => c.candidatePortalStatus === "Failed").map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="AlertCircle" className="h-4 w-4 text-rose-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium">{c.id} · {c.candidate} — {c.skill}</p>
                  <p className="text-[10px] text-muted-foreground">Last attempt {timeAgo(c.lastSyncAttempt)} · {c.trainingProvider}</p>
                </div>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${c.id} retry queued`)}>Retry</Button>
              </div>
            ))}
            {failed === 0 && <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No failed syncs" />}
          </div>
        </SectionCard>

        <SectionCard title="Manual Verification Queue" description="Credentials awaiting manual admin verification">
          <div className="space-y-2">
            {CREDENTIALS.filter(c => c.verifiedStatus === "Manual" && c.candidatePortalStatus === "Synced").map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <Icon name="UserCheck" className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium">{c.id} · {c.candidate} — {c.skill}</p>
                  <p className="text-[10px] text-muted-foreground">{c.trainingProvider} · issued {timeAgo(c.issueDate)}</p>
                </div>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${c.id} verified`)}>Verify</Button>
              </div>
            ))}
            {CREDENTIALS.filter(c => c.verifiedStatus === "Manual" && c.candidatePortalStatus === "Synced").length === 0 && (
              <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No manual verification pending" />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
