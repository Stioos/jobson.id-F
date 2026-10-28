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

type TrainingStage = "Enrolled" | "In Training" | "Assessment" | "Certified" | "Ready for Placement";
type EmployerStage = "Profile Shared" | "Interview Scheduled" | "Offer Extended" | "Hired" | "Not Started";
type OverallStatus = "On Track" | "At Risk" | "Placed" | "Withdrawn";
type Portal = "Training" | "Employer" | "Candidate";

interface PipelineStep {
  portal: Portal;
  label: string;
  status: "Done" | "Current" | "Upcoming";
}

interface T2HCandidate {
  id: string;
  candidate: string;
  trainingProvider: string;
  targetEmployer: string;
  targetRole: string;
  trainingStage: TrainingStage;
  employerStage: EmployerStage;
  candidateCanSeeEmployerStage: boolean;
  status: OverallStatus;
  lastUpdated: string;
  chain: PipelineStep[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const TRAINING_TONES: Record<TrainingStage, string> = {
  Enrolled: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  "In Training": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Assessment: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Certified: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Ready for Placement": "bg-teal-500/15 text-teal-700 border-teal-500/30",
};

const EMPLOYER_TONES: Record<EmployerStage, string> = {
  "Not Started": "bg-slate-500/15 text-slate-700 border-slate-500/30",
  "Profile Shared": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  "Interview Scheduled": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Offer Extended": "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Hired: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const STATUS_TONES: Record<OverallStatus, string> = {
  "On Track": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "At Risk": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Placed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Withdrawn: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const CANDIDATES: T2HCandidate[] = [
  { id: "T2H-7001", candidate: "Aarav Sharma", trainingProvider: "CodeCraft Bootcamp", targetEmployer: "TechCorp India", targetRole: "Junior Developer", trainingStage: "Certified", employerStage: "Interview Scheduled", candidateCanSeeEmployerStage: true, status: "On Track", lastUpdated: "2024-09-20T11:00:00Z", chain: [
    { portal: "Training", label: "Module 5/5 complete", status: "Done" },
    { portal: "Employer", label: "Profile reviewed, interview pending", status: "Current" },
    { portal: "Candidate", label: "Sees training progress + knows employer is reviewing", status: "Current" },
  ]},
  { id: "T2H-7002", candidate: "Diya Patel", trainingProvider: "SkillForge Academy", targetEmployer: "CloudOps Solutions", targetRole: "Cloud Engineer Trainee", trainingStage: "In Training", employerStage: "Not Started", candidateCanSeeEmployerStage: false, status: "On Track", lastUpdated: "2024-09-19T08:00:00Z", chain: [
    { portal: "Training", label: "Module 3/5 complete", status: "Current" },
    { portal: "Employer", label: "Profile not yet shared", status: "Upcoming" },
    { portal: "Candidate", label: "Sees training progress only", status: "Current" },
  ]},
  { id: "T2H-7003", candidate: "Rohan Mehta", trainingProvider: "CodeCraft Bootcamp", targetEmployer: "BrightApps Tech", targetRole: "Backend Trainee", trainingStage: "Ready for Placement", employerStage: "Profile Shared", candidateCanSeeEmployerStage: true, status: "On Track", lastUpdated: "2024-09-21T10:00:00Z", chain: [
    { portal: "Training", label: "Certified & ready for placement", status: "Done" },
    { portal: "Employer", label: "Profile shared, awaiting review", status: "Current" },
    { portal: "Candidate", label: "Sees training + employer reviewing", status: "Current" },
  ]},
  { id: "T2H-7004", candidate: "Ananya Iyer", trainingProvider: "SkillForge Academy", targetEmployer: "Nimbus Labs", targetRole: "UI Engineer Trainee", trainingStage: "Certified", employerStage: "Offer Extended", candidateCanSeeEmployerStage: true, status: "On Track", lastUpdated: "2024-09-18T15:00:00Z", chain: [
    { portal: "Training", label: "Module 5/5 complete", status: "Done" },
    { portal: "Employer", label: "Interview done, offer extended", status: "Current" },
    { portal: "Candidate", label: "Sees training + offer status", status: "Current" },
  ]},
  { id: "T2H-7005", candidate: "Karthik Rao", trainingProvider: "EduBridge Foundation", targetEmployer: "TechCorp India", targetRole: "Data Analyst Trainee", trainingStage: "Assessment", employerStage: "Not Started", candidateCanSeeEmployerStage: false, status: "At Risk", lastUpdated: "2024-09-17T09:00:00Z", chain: [
    { portal: "Training", label: "Module 4/5 complete, assessment pending", status: "Current" },
    { portal: "Employer", label: "Profile not yet shared", status: "Upcoming" },
    { portal: "Candidate", label: "Sees training only", status: "Current" },
  ]},
  { id: "T2H-7006", candidate: "Sneha Reddy", trainingProvider: "CodeCraft Bootcamp", targetEmployer: "CloudOps Solutions", targetRole: "QA Trainee", trainingStage: "Certified", employerStage: "Hired", candidateCanSeeEmployerStage: true, status: "Placed", lastUpdated: "2024-09-15T14:00:00Z", chain: [
    { portal: "Training", label: "Certified", status: "Done" },
    { portal: "Employer", label: "Interview + offer + hired", status: "Done" },
    { portal: "Candidate", label: "Placement visible", status: "Done" },
  ]},
  { id: "T2H-7007", candidate: "Vivek Nair", trainingProvider: "SkillForge Academy", targetEmployer: "BrightApps Tech", targetRole: "DevOps Trainee", trainingStage: "In Training", employerStage: "Not Started", candidateCanSeeEmployerStage: false, status: "Withdrawn", lastUpdated: "2024-09-12T11:00:00Z", chain: [
    { portal: "Training", label: "Module 2/5 — withdrawn", status: "Done" },
    { portal: "Employer", label: "N/A", status: "Upcoming" },
    { portal: "Candidate", label: "Withdrawn from program", status: "Done" },
  ]},
  { id: "T2H-7008", candidate: "Priya Menon", trainingProvider: "EduBridge Foundation", targetEmployer: "Nimbus Labs", targetRole: "Full Stack Trainee", trainingStage: "Ready for Placement", employerStage: "Interview Scheduled", candidateCanSeeEmployerStage: true, status: "On Track", lastUpdated: "2024-09-21T13:00:00Z", chain: [
    { portal: "Training", label: "Certified & ready", status: "Done" },
    { portal: "Employer", label: "Interview scheduled", status: "Current" },
    { portal: "Candidate", label: "Sees training + interview date", status: "Current" },
  ]},
  { id: "T2H-7009", candidate: "Arjun Singh", trainingProvider: "CodeCraft Bootcamp", targetEmployer: "TechCorp India", targetRole: "Mobile Trainee", trainingStage: "Certified", employerStage: "Hired", candidateCanSeeEmployerStage: true, status: "Placed", lastUpdated: "2024-09-14T10:00:00Z", chain: [
    { portal: "Training", label: "Certified", status: "Done" },
    { portal: "Employer", label: "Offer + hired", status: "Done" },
    { portal: "Candidate", label: "Placement visible", status: "Done" },
  ]},
  { id: "T2H-7010", candidate: "Meera Joshi", trainingProvider: "SkillForge Academy", targetEmployer: "CloudOps Solutions", targetRole: "Platform Trainee", trainingStage: "Assessment", employerStage: "Profile Shared", candidateCanSeeEmployerStage: true, status: "At Risk", lastUpdated: "2024-09-20T16:00:00Z", chain: [
    { portal: "Training", label: "Module 4/5, assessment pending", status: "Current" },
    { portal: "Employer", label: "Profile shared early", status: "Current" },
    { portal: "Candidate", label: "Sees training + employer reviewing", status: "Current" },
  ]},
];

export function SuperAdminT2hPipelineVisibility() {
  const [search, setSearch] = React.useState("");
  const [trainingFilter, setTrainingFilter] = React.useState("all");
  const [employerFilter, setEmployerFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [visibilityToggles, setVisibilityToggles] = React.useState<Record<string, boolean>>(
    Object.fromEntries(CANDIDATES.map(c => [c.id, c.candidateCanSeeEmployerStage]))
  );

  const filtered = CANDIDATES.filter(c => {
    const q = search.toLowerCase();
    const m = !q || c.id.toLowerCase().includes(q) || c.candidate.toLowerCase().includes(q) || c.targetEmployer.toLowerCase().includes(q);
    const t = trainingFilter === "all" || c.trainingStage === trainingFilter;
    const e = employerFilter === "all" || c.employerStage === employerFilter;
    return m && t && e;
  });

  const active = CANDIDATES.filter(c => c.status !== "Placed" && c.status !== "Withdrawn").length;
  const certified = CANDIDATES.filter(c => c.trainingStage === "Certified" || c.trainingStage === "Ready for Placement").length;
  const placed = CANDIDATES.filter(c => c.status === "Placed").length;
  const completionRate = `${((certified / CANDIDATES.length) * 100).toFixed(0)}%`;
  const placementRate = `${((placed / CANDIDATES.length) * 100).toFixed(0)}%`;

  const byStage = (["Enrolled", "In Training", "Assessment", "Certified", "Ready for Placement"] as TrainingStage[]).map(s => ({
    stage: s,
    count: CANDIDATES.filter(c => c.trainingStage === s).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="T2H Pipeline Visibility"
        description="Train-to-Hire pipeline visibility across Training, Employer, and Candidate portals — track training progress, employer-stage exposure, and per-stage candidate visibility."
        icon={<Icon name="Eye" className="h-6 w-6" />}
        actions={[
          { label: "Visibility Matrix", variant: "outline", onClick: () => toast.success("Opening visibility matrix…") },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting T2H pipeline…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active T2H Candidates" value={active} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="By Training Stage" value={byStage.filter(s => s.count > 0).length} hint={`${byStage[2].count} in assessment`} icon={<Icon name="Layers" className="h-5 w-5" />} tone="default" />
        <StatCard label="Completion Rate" value={completionRate} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Placement Rate" value={placementRate} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="T2H Pipeline Tracker" description={`${filtered.length} of ${CANDIDATES.length} T2H candidates across 3 portals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate, employer…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={trainingFilter} onValueChange={setTrainingFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Training Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Training Stages</SelectItem>
                <SelectItem value="Enrolled">Enrolled</SelectItem>
                <SelectItem value="In Training">In Training</SelectItem>
                <SelectItem value="Assessment">Assessment</SelectItem>
                <SelectItem value="Certified">Certified</SelectItem>
                <SelectItem value="Ready for Placement">Ready for Placement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={employerFilter} onValueChange={setEmployerFilter}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Employer Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employer Stages</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="Profile Shared">Profile Shared</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Eye" className="h-6 w-6" />} title="No T2H candidates match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Candidate</TableHead>
                  <TableHead>Training Provider</TableHead>
                  <TableHead>Target Employer / Role</TableHead>
                  <TableHead>Training Stage</TableHead>
                  <TableHead>Employer Stage</TableHead>
                  <TableHead>Candidate Visibility</TableHead>
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
                      <TableCell className="text-xs">
                        <div className="font-medium">{c.candidate}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{c.id}</div>
                      </TableCell>
                      <TableCell className="text-xs">{c.trainingProvider}</TableCell>
                      <TableCell className="text-xs">
                        <div>{c.targetEmployer}</div>
                        <div className="text-[10px] text-muted-foreground">{c.targetRole}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${TRAINING_TONES[c.trainingStage]}`}>{c.trainingStage}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${EMPLOYER_TONES[c.employerStage]}`}>{c.employerStage}</Badge></TableCell>
                      <TableCell className="p-2">
                        <Button
                          size="sm"
                          variant={visibilityToggles[c.id] ? "default" : "outline"}
                          className="h-7 text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisibilityToggles(prev => ({ ...prev, [c.id]: !prev[c.id] }));
                            toast.success(`${c.candidate} visibility ${visibilityToggles[c.id] ? "disabled" : "enabled"}`);
                          }}
                        >
                          <Icon name={visibilityToggles[c.id] ? "Eye" : "EyeOff"} className="mr-1 h-3 w-3" />
                          {visibilityToggles[c.id] ? "Can see" : "Hidden"}
                        </Button>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONES[c.status]}`}>{c.status}</Badge></TableCell>
                    </TableRow>
                    {expanded === c.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={8} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">3-Portal Pipeline · {c.id} · Updated {timeAgo(c.lastUpdated)}</p>
                              </div>
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

      <SectionCard title="By Training Stage" description="Distribution across the T2H pipeline">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {byStage.map(s => (
            <div key={s.stage} className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-semibold text-brand">{s.count}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{s.stage}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
