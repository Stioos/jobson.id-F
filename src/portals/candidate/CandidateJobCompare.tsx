"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";

// ----- Mock data: 5 saved jobs -----
interface CompareJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  salaryMin: number;
  salaryMax: number;
  currency: "INR" | "USD";
  experience: string;
  skills: string[];
  postedAt: string;
  matchScore: number;
}

const SAVED_JOBS: CompareJob[] = [
  {
    id: "cj_1",
    title: "Senior Frontend Engineer",
    company: "TechCorp India",
    logo: "TC",
    location: "Bengaluru, IN",
    workMode: "Hybrid",
    salaryMin: 2200000,
    salaryMax: 3200000,
    currency: "INR",
    experience: "5–8 yrs",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind"],
    postedAt: "2024-10-20T10:00:00Z",
    matchScore: 92,
  },
  {
    id: "cj_2",
    title: "Staff Software Engineer — Frontend",
    company: "FinEdge",
    logo: "FE",
    location: "Mumbai, IN",
    workMode: "Remote",
    salaryMin: 3000000,
    salaryMax: 4200000,
    currency: "INR",
    experience: "7–10 yrs",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    postedAt: "2024-10-18T09:30:00Z",
    matchScore: 88,
  },
  {
    id: "cj_3",
    title: "Lead UI Engineer",
    company: "Brightwave Labs",
    logo: "BW",
    location: "Pune, IN",
    workMode: "Hybrid",
    salaryMin: 2500000,
    salaryMax: 3600000,
    currency: "INR",
    experience: "6–9 yrs",
    skills: ["React", "Vue", "TypeScript", "Figma", "Tailwind"],
    postedAt: "2024-10-22T11:00:00Z",
    matchScore: 81,
  },
  {
    id: "cj_4",
    title: "Frontend Architect",
    company: "CloudKart",
    logo: "CK",
    location: "Remote (India)",
    workMode: "Remote",
    salaryMin: 3500000,
    salaryMax: 5000000,
    currency: "INR",
    experience: "8–12 yrs",
    skills: ["React", "Micro-frontends", "TypeScript", "Webpack", "AWS"],
    postedAt: "2024-10-15T08:00:00Z",
    matchScore: 76,
  },
  {
    id: "cj_5",
    title: "Senior Product Engineer",
    company: "Nimbus Health",
    logo: "NH",
    location: "Bengaluru, IN",
    workMode: "On-site",
    salaryMin: 2400000,
    salaryMax: 3400000,
    currency: "INR",
    experience: "5–7 yrs",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"],
    postedAt: "2024-10-21T14:00:00Z",
    matchScore: 85,
  },
];

// ----- Helpers -----
function salaryMid(job: CompareJob): number {
  return (job.salaryMin + job.salaryMax) / 2;
}

function compareRows(
  jobs: CompareJob[]
): {
  label: string;
  icon: string;
  render: (j: CompareJob) => React.ReactNode;
  isBetter: (a: CompareJob, b: CompareJob) => boolean;
  numeric?: (j: CompareJob) => number | undefined;
}[] {
  return [
    {
      label: "Title",
      icon: "Briefcase",
      render: (j) => <span className="font-medium">{j.title}</span>,
      isBetter: () => false,
    },
    {
      label: "Company",
      icon: "Building2",
      render: (j) => j.company,
      isBetter: () => false,
    },
    {
      label: "Location",
      icon: "MapPin",
      render: (j) => j.location,
      isBetter: () => false,
    },
    {
      label: "Salary Range",
      icon: "Banknote",
      render: (j) => (
        <span className="font-medium text-foreground">
          {formatCurrency(j.salaryMin, j.currency)} – {formatCurrency(j.salaryMax, j.currency)}
        </span>
      ),
      isBetter: (a, b) => salaryMid(a) > salaryMid(b),
      numeric: (j) => salaryMid(j),
    },
    {
      label: "Work Mode",
      icon: "Monitor",
      render: (j) => j.workMode,
      isBetter: (a, b) => {
        const rank: Record<CompareJob["workMode"], number> = { Remote: 3, Hybrid: 2, "On-site": 1 };
        return rank[a.workMode] > rank[b.workMode];
      },
    },
    {
      label: "Experience",
      icon: "TrendingUp",
      render: (j) => j.experience,
      isBetter: () => false,
    },
    {
      label: "Skills",
      icon: "Brain",
      render: (j) => (
        <div className="flex flex-wrap gap-1">
          {j.skills.map((s) => (
            <Badge key={s} variant="secondary" className="bg-brand/10 text-brand border-brand/20">
              {s}
            </Badge>
          ))}
        </div>
      ),
      isBetter: (a, b) => a.skills.length > b.skills.length,
    },
    {
      label: "Posted Date",
      icon: "Clock",
      render: (j) => (
        <span>
          {formatDate(j.postedAt)} <span className="text-xs text-muted-foreground">({timeAgo(j.postedAt)})</span>
        </span>
      ),
      isBetter: (a, b) => new Date(a.postedAt).getTime() > new Date(b.postedAt).getTime(),
    },
    {
      label: "Match Score",
      icon: "Sparkles",
      render: (j) => (
        <span className="font-semibold text-brand">{j.matchScore}/100</span>
      ),
      isBetter: (a, b) => a.matchScore > b.matchScore,
      numeric: (j) => j.matchScore,
    },
  ];
}

// ----- Component -----
export function CandidateJobCompare() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([
    SAVED_JOBS[0].id,
    SAVED_JOBS[1].id,
    SAVED_JOBS[2].id,
  ]);

  const selectedJobs = selectedIds
    .map((id) => SAVED_JOBS.find((j) => j.id === id))
    .filter((j): j is CompareJob => !!j);

  function addSlot(jobId: string) {
    if (selectedIds.includes(jobId)) {
      toast.info("This job is already in the comparison.");
      return;
    }
    if (selectedIds.length >= 3) {
      toast.error("Compare up to 3 jobs at a time.");
      return;
    }
    setSelectedIds((p) => [...p, jobId]);
  }

  function removeSlot(jobId: string) {
    setSelectedIds((p) => p.filter((id) => id !== jobId));
  }

  function bestJobIdsForRow(row: { isBetter: (a: CompareJob, b: CompareJob) => boolean }): Set<string> {
    if (selectedJobs.length < 2) return new Set();
    const best = selectedJobs.reduce((acc, j) => (row.isBetter(j, acc) ? j : acc));
    // Only mark if strictly better than at least one other
    const isStrictlyBest = selectedJobs.some((j) => j.id !== best.id && row.isBetter(best, j));
    return isStrictlyBest ? new Set([best.id]) : new Set();
  }

  const rows = compareRows(selectedJobs);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compare Jobs"
        description="Side-by-side comparison of saved jobs. We highlight the best value per row in emerald."
        icon={<Icon name="Columns3" className="h-6 w-6" />}
      />

      {/* Job picker */}
      <SectionCard
        title="Select jobs to compare"
        description="Pick up to 3 jobs from your saved list. Add or remove slots below."
      >
        <div className="flex flex-wrap gap-2">
          {SAVED_JOBS.map((j) => {
            const isSelected = selectedIds.includes(j.id);
            return (
              <Button
                key={j.id}
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => (isSelected ? removeSlot(j.id) : addSlot(j.id))}
              >
                <Icon name={isSelected ? "Check" : "Plus"} className="mr-1.5 h-4 w-4" />
                {j.title} · {j.company}
              </Button>
            );
          })}
        </div>
      </SectionCard>

      {/* Comparison table */}
      {selectedJobs.length === 0 ? (
        <EmptyState
          icon={<Icon name="Columns3" className="h-5 w-5" />}
          title="No jobs selected"
          description="Pick at least two jobs from your saved list above to start comparing."
        />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header row */}
            <div
              className="grid gap-px bg-border"
              style={{ gridTemplateColumns: `200px repeat(${selectedJobs.length}, minmax(0, 1fr))` }}
            >
              <div className="bg-muted/30 p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Attribute
              </div>
              {selectedJobs.map((j) => (
                <div key={j.id} className="bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AvatarLogo text={j.logo} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{j.company}</p>
                        <p className="truncate text-xs text-muted-foreground">{j.location}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSlot(j.id)}
                      aria-label="Remove from comparison"
                    >
                      <Icon name="X" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Body rows */}
            {rows.map((row, ri) => {
              const bestIds = bestJobIdsForRow(row);
              return (
                <div
                  key={row.label}
                  className="grid gap-px border-t bg-border"
                  style={{ gridTemplateColumns: `200px repeat(${selectedJobs.length}, minmax(0, 1fr))` }}
                >
                  <div className="flex items-center gap-2 bg-muted/30 p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Icon name={row.icon} className="h-3.5 w-3.5" />
                    {row.label}
                  </div>
                  {selectedJobs.map((j) => {
                    const isBest = bestIds.has(j.id);
                    return (
                      <div
                        key={j.id}
                        className={`p-4 text-sm ${
                          isBest
                            ? "bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/20"
                            : "bg-card"
                        } ${ri === rows.length - 1 ? "rounded-b-xl" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">{row.render(j)}</div>
                          {isBest && (
                            <Badge className="shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                              <Icon name="TrendingUp" className="mr-1 h-3 w-3" /> Best
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Add another slot via Select */}
      {selectedJobs.length < 3 && (
        <SectionCard title="Add another job" description={`You can compare ${3 - selectedJobs.length} more job(s).`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select onValueChange={(v) => addSlot(v)}>
              <SelectTrigger className="w-full sm:max-w-md">
                <SelectValue placeholder="Choose a saved job to add" />
              </SelectTrigger>
              <SelectContent>
                {SAVED_JOBS.filter((j) => !selectedIds.includes(j.id)).map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title} · {j.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Tip: Higher match score and salary mid-range are highlighted per row.
            </p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
