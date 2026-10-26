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
import { Badge } from "@/components/ui/badge";
import { useNav } from "@/lib/store";
import { jobs, candidateProfiles } from "@/lib/mock-data";
import { applicationService } from "@/lib/mock-api";
import type { Job } from "@/lib/types";
import { formatCurrency, timeAgo } from "@/lib/format";

const CANDIDATE_ID = "c_001";

export function CandidateSavedJobs() {
  const { navigate } = useNav();
  const candidate = candidateProfiles[0];
  // Seed with 3 saved jobs
  const [savedJobs, setSavedJobs] = React.useState<Job[]>(() =>
    jobs.filter((j) => ["j_001", "j_003", "j_007"].includes(j.id))
  );
  const [appliedJobs, setAppliedJobs] = React.useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = React.useState<string | null>(null);

  function matchScoreFor(job: Job): number {
    const matched = job.skills.filter((s) =>
      candidate.skills.some((cs) => cs.skill === s)
    );
    return Math.min(99, Math.round(60 + (matched.length / Math.max(1, job.skills.length)) * 35));
  }

  function unsave(jobId: string) {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    toast.success("Removed from saved");
  }

  async function apply(job: Job) {
    setApplyingId(job.id);
    try {
      await applicationService.apply(job.id, CANDIDATE_ID, []);
      setAppliedJobs((prev) => new Set(prev).add(job.id));
      toast.success("Application submitted", {
        description: `Applied to ${job.title} at ${job.employerName}.`,
      });
    } catch {
      toast.error("Application failed");
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Jobs"
        description="Jobs you've bookmarked for later. Apply when you're ready."
        actions={[
          {
            label: "Find more jobs",
            variant: "outline",
            onClick: () => navigate("candidate", "find-jobs"),
          },
        ]}
      />

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Icon name="Bookmark" className="h-5 w-5" />}
          title="No saved jobs yet"
          description="Tap the bookmark icon on any job to save it for later."
          action={
            <Button onClick={() => navigate("candidate", "find-jobs")}>
              Browse jobs
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => {
            const score = matchScoreFor(job);
            const isApplied = appliedJobs.has(job.id);
            return (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={job.employerLogo} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <button
                          className="text-left"
                          onClick={() => navigate("public", `jobs/${job.id}`)}
                        >
                          <p className="font-medium hover:underline">{job.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.employerName} · {job.location} · {job.workArrangement}
                          </p>
                        </button>
                        <MatchScore score={score} />
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
                            <Icon name="Clock" className="h-3 w-3" /> {timeAgo(job.postedAt)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => unsave(job.id)}>
                            Unsave
                          </Button>
                          <Button
                            size="sm"
                            disabled={isApplied || applyingId === job.id}
                            onClick={() => apply(job)}
                          >
                            {isApplied ? (
                              <>
                                <Icon name="BadgeCheck" className="h-4 w-4" /> Applied
                              </>
                            ) : applyingId === job.id ? (
                              "Applying…"
                            ) : (
                              "Apply"
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
  );
}
