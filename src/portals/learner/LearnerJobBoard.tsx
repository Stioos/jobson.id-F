"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  sourcingRequests, partnerClients, individualLearners, learnerCertificates,
} from "@/lib/lms-data";
import type { SourcingRequest } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { MatchScore } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  LearnerDisclaimer, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  Briefcase, MapPin, IndianRupee, CheckCircle2, XCircle, ExternalLink,
  Building2, Award, Sparkles, ArrowRight,
} from "lucide-react";

export function LearnerJobBoard() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;
  const myCerts = learnerCertificates.filter((c) => c.learnerId === LEARNER_ID);
  const myCertCourseIds = new Set(myCerts.map((c) => c.courseId));

  const [openToWork, setOpenToWork] = React.useState(learner.openToWork);

  // Compute match score per job: skills + certs overlap
  const jobsWithMatch = React.useMemo(() => {
    const mySkillNames = new Set(learner.skills.map((s) => s.name));
    return sourcingRequests
      .filter((j) => j.status === "open" || j.status === "in_progress")
      .map((job) => {
        const skillMatches = job.skillsRequired.filter((s) => mySkillNames.has(s));
        const skillMissing = job.skillsRequired.filter((s) => !mySkillNames.has(s));
        // Cert match — match by course name keywords in certificationsRequired
        const certMatches = job.certificationsRequired.filter((req) =>
          Array.from(myCertCourseIds).some((cid) => {
            const cert = myCerts.find((c) => c.courseId === cid);
            return cert && req.toLowerCase().includes(cert.courseName.toLowerCase().split("(")[0].trim().toLowerCase().slice(0, 10));
          }),
        );
        const certMissing = job.certificationsRequired.filter(
          (req) => !certMatches.includes(req),
        );
        const totalRequired = job.skillsRequired.length + job.certificationsRequired.length;
        const totalMatched = skillMatches.length + certMatches.length;
        const matchScore = totalRequired === 0 ? 70 : Math.round((totalMatched / totalRequired) * 100);
        const meetsExperience = learner.experience >= job.experienceMin;
        return {
          job,
          skillMatches,
          skillMissing,
          certMatches,
          certMissing,
          matchScore,
          meetsExperience,
          fullyCertified: job.certificationsRequired.length > 0 && certMissing.length === 0,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [learner.skills, myCertCourseIds, myCerts, learner.experience]);

  function apply(job: SourcingRequest) {
    toast.success(`Applied to "${job.title}" at ${job.employerName}`, {
      description: "SkillForge will refer you directly — recruiter will reach out within 48h",
    });
  }
  function viewEmployer(name: string) {
    toast.info(`Opening ${name}'s employer profile`);
  }
  function toggleOTW(v: boolean) {
    setOpenToWork(v);
    toast.success(v ? "Open to Work enabled — recruiters can find you" : "Open to Work disabled");
  }

  const employerFor = (name: string) => partnerClients.find((p) => p.name === name);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Board"
        description="Roles from SkillForge partner companies, matched to your skills & certifications."
        icon={<Briefcase className="h-5 w-5" />}
      />

      <LearnerDisclaimer />

      {/* Open to work banner */}
      <div className="flex flex-col items-start gap-3 rounded-xl border border-brand/30 bg-brand/5 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Open to work</p>
            <p className="text-xs text-muted-foreground">
              Allow recruiters from {partnerClients.length} partner companies to find you
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{openToWork ? "On" : "Off"}</span>
          <Switch checked={openToWork} onCheckedChange={toggleOTW} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SectionCard title="Open roles" className="p-4">
          <p className="text-2xl font-bold">{jobsWithMatch.length}</p>
        </SectionCard>
        <SectionCard title="You're certified for" className="p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {jobsWithMatch.filter((j) => j.fullyCertified).length}
          </p>
        </SectionCard>
        <SectionCard title="Avg match score" className="p-4">
          <p className="text-2xl font-bold text-brand">
            {jobsWithMatch.length > 0
              ? Math.round(
                  jobsWithMatch.reduce((s, j) => s + j.matchScore, 0) / jobsWithMatch.length,
                )
              : 0}%
          </p>
        </SectionCard>
        <SectionCard title="Partner employers" className="p-4">
          <p className="text-2xl font-bold">{partnerClients.length}</p>
        </SectionCard>
      </div>

      {/* Jobs list */}
      {jobsWithMatch.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No open roles right now"
          description="New roles from partner employers appear here as they're posted."
          action={<Button variant="outline" onClick={() => navigate("candidate", "catalog")}>Keep learning</Button>}
        />
      ) : (
        <div className="space-y-4">
          {jobsWithMatch.map(({ job, skillMatches, skillMissing, certMatches, certMissing, matchScore, meetsExperience, fullyCertified }) => {
            const employer = employerFor(job.employerName);
            return (
              <div
                key={job.id}
                className={
                  "rounded-xl border bg-card p-4 transition hover:shadow-md " +
                  (fullyCertified ? "border-emerald-500/30 bg-emerald-500/5" : "")
                }
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {/* Employer logo */}
                  <AvatarLogo text={job.employerName} size="lg" />

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold">{job.title}</h3>
                          {fullyCertified && (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              <Award className="mr-1 h-3 w-3" /> You're certified for this
                            </Badge>
                          )}
                          <StatusBadge status={job.status} />
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {job.priority} priority
                          </Badge>
                        </div>
                        <button
                          onClick={() => viewEmployer(job.employerName)}
                          className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"
                        >
                          <Building2 className="h-3 w-3" /> {job.employerName}
                          <ExternalLink className="h-3 w-3" />
                          <span>·</span>
                          <span>{employer?.industry ?? "Company"}</span>
                        </button>
                      </div>
                      <MatchScore score={matchScore} />
                    </div>

                    {/* Meta */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.location}
                        {job.remote && <Badge variant="secondary" className="ml-1 text-[10px]">Remote</Badge>}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> {job.salaryRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {job.experienceMin}+ yrs required
                      </span>
                      <span>
                        {meetsExperience ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Experience matches
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <XCircle className="h-3 w-3" /> Need {job.experienceMin - learner.experience} more yrs
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Skills match */}
                    <div className="mt-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Required skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.skillsRequired.map((s) => {
                          const has = skillMatches.includes(s);
                          return (
                            <Badge
                              key={s}
                              variant={has ? "default" : "outline"}
                              className={
                                has
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]"
                                  : "text-[10px] text-rose-600 dark:text-rose-400"
                              }
                            >
                              {has ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {s}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Certs match */}
                    {job.certificationsRequired.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Required certifications
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {job.certificationsRequired.map((c) => {
                            const has = certMatches.includes(c);
                            return (
                              <Badge
                                key={c}
                                variant={has ? "default" : "outline"}
                                className={
                                  has
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]"
                                    : "text-[10px] text-rose-600 dark:text-rose-400"
                                }
                              >
                                {has ? (
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3" />
                                )}
                                {c}
                              </Badge>
                            );
                          })}
                        </div>
                        {certMissing.length > 0 && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            <Sparkles className="mr-1 inline h-3 w-3 text-amber-500" />
                            Earn these certs to qualify — browse the catalog.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => apply(job)}
                        disabled={!openToWork}
                      >
                        Apply via SkillForge <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewEmployer(job.employerName)}
                      >
                        View employer
                      </Button>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Deadline: {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    {!openToWork && (
                      <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                        Enable &quot;Open to work&quot; above to apply.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
