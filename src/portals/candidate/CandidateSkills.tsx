"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
  StatusBadge,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { candidateProfiles, assessments, assessmentResults } from "@/lib/mock-data";
import type { CandidateSkill, Assessment, AssessmentResult } from "@/lib/types";
import { formatDate } from "@/lib/format";

const CANDIDATE_ID = "c_001";
const SKILL_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

// Target roles for skill-gap analysis
const TARGET_ROLES: Record<string, { name: string; skills: string[] }> = {
  staff_fe: {
    name: "Staff Frontend Engineer",
    skills: ["React", "TypeScript", "System Design", "Performance", "Accessibility", "Leadership", "Mentoring"],
  },
  em: {
    name: "Engineering Manager",
    skills: ["Leadership", "Mentoring", "Roadmapping", "Hiring", "Performance", "Communication", "Strategy"],
  },
  fullstack: {
    name: "Full-Stack Engineer",
    skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "System Design", "DevOps"],
  },
};

export function CandidateSkills() {
  const profile = candidateProfiles[0];
  const [skills, setSkills] = React.useState<CandidateSkill[]>(profile.skills);
  const [targetRole, setTargetRole] = React.useState("staff_fe");
  const [startAssessment, setStartAssessment] = React.useState<Assessment | null>(null);

  const myResults = assessmentResults.filter((r) => r.candidateId === CANDIDATE_ID);

  function verify(skill: string) {
    setSkills((prev) =>
      prev.map((s) => (s.skill === skill ? { ...s, verified: true } : s))
    );
    toast.success("Verification started", {
      description: `${skill} — we'll email you an assessment link within 24h.`,
    });
  }

  function startAssessmentNow(a: Assessment) {
    setStartAssessment(a);
  }

  function confirmStart() {
    if (!startAssessment) return;
    toast.success(`Starting "${startAssessment.name}"`, {
      description: `${startAssessment.questionsCount} questions · ${startAssessment.durationMinutes} min`,
    });
    setStartAssessment(null);
  }

  // Compute skill gap
  const target = TARGET_ROLES[targetRole];
  const targetSkillNames = target.skills;
  const mySkillNames = new Set(skills.map((s) => s.skill));
  const matched = targetSkillNames.filter((s) => mySkillNames.has(s));
  const missing = targetSkillNames.filter((s) => !mySkillNames.has(s));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills & Assessments"
        description="Showcase your skills, get verified, and demonstrate proficiency with assessments."
      />

      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills" className="gap-1">
            <Icon name="Award" className="h-4 w-4" /> My Skills
          </TabsTrigger>
          <TabsTrigger value="assessments" className="gap-1">
            <Icon name="ClipboardCheck" className="h-4 w-4" /> Assessments
          </TabsTrigger>
        </TabsList>

        {/* Skills tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard
              title="My skills"
              description="Self-assess your level. Verified skills carry a badge."
              className="lg:col-span-2"
            >
              <div className="space-y-2">
                {skills.map((s) => (
                  <div
                    key={s.skill}
                    className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{s.skill}</span>
                      <Badge variant="outline" className="capitalize">
                        {s.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.yearsOfExperience}y
                      </span>
                      {s.verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <Icon name="BadgeCheck" className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => verify(s.skill)}
                        >
                          Get verified
                        </Button>
                      )}
                    </div>
                    <div className="w-full sm:w-32">
                      <Progress
                        value={
                          (SKILL_LEVELS.indexOf(s.level) + 1) * 25
                        }
                        className="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Skill gap analysis */}
            <SectionCard
              title="Skill gap analysis"
              description="Simulated AI analysis"
            >
              <Badge className="mb-2 gap-1 bg-brand/10 text-brand">
                <Icon name="Sparkles" className="h-3 w-3" /> Simulated AI
              </Badge>
              <div className="space-y-2">
                <Label>Target role</Label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TARGET_ROLES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    You have ({matched.length}/{targetSkillNames.length})
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {matched.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Missing ({missing.length})
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {missing.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        No gaps — you&apos;re ready!
                      </span>
                    ) : (
                      missing.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        >
                          {s}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.info("Learning path generated", {
                    description: `Recommended 4 courses to close gaps for ${target.name}.`,
                  })}
                >
                  Generate learning path
                </Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Assessments tab */}
        <TabsContent value="assessments" className="space-y-6">
          <SectionCard
            title="My results"
            description="Assessments you've completed."
          >
            {myResults.length === 0 ? (
              <EmptyState
                icon={<Icon name="ClipboardCheck" className="h-5 w-5" />}
                title="No assessments taken yet"
                description="Take an assessment below to verify your skills."
              />
            ) : (
              <div className="space-y-3">
                {myResults.map((r) => (
                  <AssessmentResultCard key={r.id} result={r} />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Available assessments"
            description="Take assessments to verify skills and stand out to recruiters."
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {assessments.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          (a.difficulty === "hard"
                            ? "border-rose-500/30 text-rose-600 dark:text-rose-400"
                            : a.difficulty === "medium"
                            ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
                            : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400") + " capitalize"
                        }
                      >
                        {a.difficulty}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {a.skillsAssessed.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {a.questionsCount} Qs · {a.durationMinutes} min · {a.type}
                      </span>
                      <Button size="sm" onClick={() => startAssessmentNow(a)}>
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={!!startAssessment} onOpenChange={(o) => !o && setStartAssessment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start assessment</DialogTitle>
            <DialogDescription>
              {startAssessment?.name} · {startAssessment?.questionsCount} questions ·{" "}
              {startAssessment?.durationMinutes} min
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="font-medium">Before you begin</p>
            <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
              <li>Ensure a stable internet connection.</li>
              <li>Browser tabs cannot be switched (auto-submit on violation).</li>
              <li>Results are shared with employers who shortlist you.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartAssessment(null)}>
              Cancel
            </Button>
            <Button onClick={confirmStart}>Start now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssessmentResultCard({ result }: { result: AssessmentResult }) {
  const pct = Math.round((result.score / result.maxScore) * 100);
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-medium">{result.assessmentName}</p>
            <p className="text-xs text-muted-foreground">
              {result.completedAt ? `Completed ${formatDate(result.completedAt)}` : "In progress"}
            </p>
          </div>
          <StatusBadge status={result.status} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={pct} className="h-2 flex-1" />
          <span className="text-sm font-medium">
            {result.score}/{result.maxScore} ({pct}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
