"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  MatchScore,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNav } from "@/lib/store";
import { jobService, applicationService } from "@/lib/mock-api";
import type { Job } from "@/lib/types";

const CANDIDATE_ID = "c_001";

interface Rec {
  job: Job;
  score: number;
  matched: string[];
  missing: string[];
}

export function CandidateRecommended() {
  const { navigate } = useNav();
  const [recs, setRecs] = React.useState<Rec[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [applied, setApplied] = React.useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    jobService
      .recommended(CANDIDATE_ID)
      .then((items) => {
        if (active) {
          setRecs(items as Rec[]);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function apply(rec: Rec) {
    setApplyingId(rec.job.id);
    try {
      await applicationService.apply(rec.job.id, CANDIDATE_ID, []);
      setApplied((prev) => new Set(prev).add(rec.job.id));
      toast.success("Application submitted", {
        description: `Applied to ${rec.job.title} at ${rec.job.employerName}.`,
      });
    } catch {
      toast.error("Apply failed");
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* AI banner */}
      <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  AI-Powered Recommendations
                </h1>
                <Badge className="gap-1 bg-brand/15 text-brand">
                  <Icon name="Sparkles" className="h-3 w-3" /> Simulated AI
                </Badge>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Personalized job matches based on your skills, experience, and
                activity. Scores are illustrative and not objective quality
                measures — always review the full description.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("candidate", "find-jobs")}>
              Browse all jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border p-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ))}
        </div>
      ) : recs.length === 0 ? (
        <EmptyState
          icon={<Icon name="Sparkles" className="h-5 w-5" />}
          title="No recommendations yet"
          description="Complete your profile and skills to get AI matches."
          action={
            <Button onClick={() => navigate("candidate", "profile")}>
              Update profile
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {recs.map((rec) => {
            const isApplied = applied.has(rec.job.id);
            const isOpen = openId === rec.job.id;
            return (
              <Card key={rec.job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={rec.job.employerLogo} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <button
                            className="text-left"
                            onClick={() => navigate("public", `jobs/${rec.job.id}`)}
                          >
                            <p className="font-medium hover:underline">{rec.job.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {rec.job.employerName} · {rec.job.location} ·{" "}
                              {rec.job.workArrangement}
                            </p>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <MatchScore score={rec.score} />
                          <span className="text-xs text-muted-foreground">match</span>
                        </div>
                      </div>

                      {/* Matched/missing skills */}
                      <div className="mt-3 space-y-2">
                        {rec.matched.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-xs text-emerald-700 dark:text-emerald-400">
                              Matched:
                            </span>
                            {rec.matched.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              >
                                <Icon name="BadgeCheck" className="h-3 w-3" /> {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {rec.missing.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-xs text-amber-700 dark:text-amber-400">
                              Missing:
                            </span>
                            {rec.missing.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Why this match expandable */}
                      <Collapsible open={isOpen} onOpenChange={(o) => setOpenId(o ? rec.job.id : null)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="mt-2 h-7 gap-1 px-2 text-xs">
                            <Icon name="Sparkles" className="h-3 w-3" />
                            {isOpen ? "Hide" : "Why this match?"}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="rounded-lg border border-brand/20 bg-brand/5 p-3 text-xs">
                            <p className="font-medium text-brand">Match reasoning</p>
                            <ul className="mt-1 space-y-1 text-muted-foreground">
                              {rec.matched.map((s) => (
                                <li key={s} className="flex items-start gap-1.5">
                                  <Icon name="BadgeCheck" className="mt-0.5 h-3 w-3 text-emerald-500" />
                                  <span>{s} matches your verified skills</span>
                                </li>
                              ))}
                              {rec.job.workArrangement === "remote" && (
                                <li className="flex items-start gap-1.5">
                                  <Icon name="BadgeCheck" className="mt-0.5 h-3 w-3 text-emerald-500" />
                                  <span>Remote role aligns with your preferences</span>
                                </li>
                              )}
                              <li className="flex items-start gap-1.5">
                                <Icon name="TrendingUp" className="mt-0.5 h-3 w-3 text-brand" />
                                <span>
                                  Salary range aligns with your expected compensation
                                </span>
                              </li>
                            </ul>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("public", `jobs/${rec.job.id}`)}
                        >
                          View job
                        </Button>
                        <Button
                          size="sm"
                          disabled={isApplied || applyingId === rec.job.id}
                          onClick={() => apply(rec)}
                        >
                          {isApplied ? (
                            <>
                              <Icon name="BadgeCheck" className="h-4 w-4" /> Applied
                            </>
                          ) : applyingId === rec.job.id ? (
                            "Applying…"
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Recommendations refresh as your profile and the job market evolve.
        Simulated AI · demo data.
      </p>
    </div>
  );
}
