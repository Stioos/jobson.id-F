"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
  MatchScore,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNav } from "@/lib/store";
import { jobs, candidateProfiles } from "@/lib/mock-data";
import { applicationService } from "@/lib/mock-api";
import type { Job } from "@/lib/types";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";

const CANDIDATE_ID = "c_001";

export function CandidateFindJobs() {
  const { navigate } = useNav();
  const candidate = candidateProfiles[0];
  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [workArrangement, setWorkArrangement] = React.useState("any");
  const [employmentType, setEmploymentType] = React.useState("any");
  const [salaryMin, setSalaryMin] = React.useState("any");
  const [sort, setSort] = React.useState("relevance");
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = React.useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [applying, setApplying] = React.useState(false);

  // Compute simple match score for each job vs candidate skills
  function matchScoreFor(job: Job): number {
    const matched = job.skills.filter((s) =>
      candidate.skills.some((cs) => cs.skill === s)
    );
    return Math.min(99, Math.round(60 + (matched.length / Math.max(1, job.skills.length)) * 35));
  }

  const filtered = React.useMemo(() => {
    let result = jobs.filter((j) => j.status === "published");
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.employerName.toLowerCase().includes(q)
      );
    }
    if (location.trim()) {
      result = result.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (workArrangement !== "any") {
      result = result.filter((j) => j.workArrangement === workArrangement);
    }
    if (employmentType !== "any") {
      result = result.filter((j) => j.employmentType === employmentType);
    }
    if (salaryMin !== "any") {
      const min = parseInt(salaryMin, 10);
      result = result.filter((j) => j.salaryMax >= min);
    }
    if (sort === "recent") {
      result = [...result].sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
    } else if (sort === "salary_high") {
      result = [...result].sort((a, b) => b.salaryMax - a.salaryMax);
    } else {
      result = [...result].sort((a, b) => matchScoreFor(b) - matchScoreFor(a));
    }
    return result;
  }, [query, location, workArrangement, employmentType, salaryMin, sort]);

  function toggleSave(jobId: string) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast("Removed from saved");
      } else {
        next.add(jobId);
        toast.success("Saved", { description: "Find it later in Saved Jobs." });
      }
      return next;
    });
  }

  async function apply(job: Job) {
    setApplying(true);
    try {
      await applicationService.apply(job.id, CANDIDATE_ID, []);
      setAppliedJobs((prev) => new Set(prev).add(job.id));
      toast.success("Application submitted", {
        description: `Applied to ${job.title} at ${job.employerName}.`,
      });
      setSelectedJob(null);
    } catch {
      toast.error("Application failed", { description: "Please try again." });
    } finally {
      setApplying(false);
    }
  }

  function resetFilters() {
    setQuery("");
    setLocation("");
    setWorkArrangement("any");
    setEmploymentType("any");
    setSalaryMin("any");
    setSort("relevance");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Jobs"
        description="Search live job postings and apply in one click with your default resume."
        actions={[
          {
            label: "Saved jobs",
            variant: "outline",
            onClick: () => navigate("candidate", "saved-jobs"),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filters sidebar */}
        <aside className="space-y-4 lg:col-span-1">
          <SectionCard title="Filters" description="Narrow your search.">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="q">Keywords</Label>
                <Input
                  id="q"
                  placeholder="React, PM, Go…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc">Location</Label>
                <Input
                  id="loc"
                  placeholder="Bengaluru, Mumbai…"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Work arrangement</Label>
                <Select value={workArrangement} onValueChange={setWorkArrangement}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Employment type</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Min salary</Label>
                <Select value={salaryMin} onValueChange={setSalaryMin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="500000">₹5L+</SelectItem>
                    <SelectItem value="1000000">₹10L+</SelectItem>
                    <SelectItem value="2000000">₹20L+</SelectItem>
                    <SelectItem value="3000000">₹30L+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sort by</Label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recent">Most recent</SelectItem>
                    <SelectItem value="salary_high">Highest salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          </SectionCard>
        </aside>

        {/* Job list */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span> jobs found
            </p>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="Search" className="h-5 w-5" />}
              title="No jobs match your filters"
              description="Try widening your search or clearing filters."
              action={<Button onClick={resetFilters}>Clear filters</Button>}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((job) => {
                const score = matchScoreFor(job);
                const isSaved = savedJobs.has(job.id);
                const isApplied = appliedJobs.has(job.id);
                return (
                  <Card key={job.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AvatarLogo text={job.employerLogo} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <button
                              className="text-left"
                              onClick={() => setSelectedJob(job)}
                            >
                              <p className="font-medium hover:underline">{job.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {job.employerName} · {job.location} · {job.workArrangement}
                              </p>
                            </button>
                            <div className="flex items-center gap-2">
                              <MatchScore score={score} />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleSave(job.id)}
                                aria-label="Save job"
                              >
                                <Icon
                                  name="Bookmark"
                                  className={`h-4 w-4 ${isSaved ? "fill-brand text-brand" : ""}`}
                                />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {job.skills.slice(0, 5).map((s) => {
                              const has = candidate.skills.some((cs) => cs.skill === s);
                              return (
                                <Badge
                                  key={s}
                                  variant="secondary"
                                  className={
                                    has
                                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                  }
                                >
                                  {s}
                                </Badge>
                              );
                            })}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              {job.showSalary && (
                                <span>
                                  {formatCurrency(job.salaryMin, job.currency)} –{" "}
                                  {formatCurrency(job.salaryMax, job.currency)}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <Icon name="Briefcase" className="h-3 w-3" />
                                {job.employmentType}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Icon name="Clock" className="h-3 w-3" />
                                {timeAgo(job.postedAt)}
                              </span>
                              {job.featured && (
                                <Badge className="bg-brand/10 text-brand">Featured</Badge>
                              )}
                              {job.urgent && (
                                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("public", `jobs/${job.id}`)}
                              >
                                Details
                              </Button>
                              <Button
                                size="sm"
                                disabled={isApplied || applying}
                                onClick={() => apply(job)}
                              >
                                {isApplied ? (
                                  <>
                                    <Icon name="BadgeCheck" className="h-4 w-4" /> Applied
                                  </>
                                ) : (
                                  "Easy Apply"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Job detail + apply dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(o) => !o && setSelectedJob(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <AvatarLogo text={selectedJob.employerLogo} size="lg" />
                  <div>
                    <DialogTitle>{selectedJob.title}</DialogTitle>
                    <DialogDescription>
                      {selectedJob.employerName} · {selectedJob.location} ·{" "}
                      {selectedJob.workArrangement}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  {selectedJob.showSalary && (
                    <Badge variant="secondary">
                      {formatCurrency(selectedJob.salaryMin, selectedJob.currency)} –{" "}
                      {formatCurrency(selectedJob.salaryMax, selectedJob.currency)}
                    </Badge>
                  )}
                  <Badge variant="secondary">{selectedJob.employmentType}</Badge>
                  <Badge variant="secondary">{selectedJob.experienceMin}+ yrs</Badge>
                  <Badge variant="secondary">Posted {timeAgo(selectedJob.postedAt)}</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    About the role
                  </h4>
                  <p className="mt-1 text-sm">{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Responsibilities
                  </h4>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Requirements
                  </h4>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {selectedJob.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Required skills
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedJob.skills.map((s) => {
                      const has = candidate.skills.some((cs) => cs.skill === s);
                      return (
                        <Badge
                          key={s}
                          variant="secondary"
                          className={
                            has
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }
                        >
                          {s}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => navigate("public", `jobs/${selectedJob.id}`)}
                >
                  Full view
                </Button>
                <Button
                  disabled={appliedJobs.has(selectedJob.id) || applying}
                  onClick={() => apply(selectedJob)}
                >
                  {appliedJobs.has(selectedJob.id) ? "Already applied" : "Easy Apply"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
