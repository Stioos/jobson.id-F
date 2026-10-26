"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  careerPaths, trainingCourses, learnerCourseEnrollments, individualLearners,
} from "@/lib/lms-data";
import type { CareerPath } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  LearnerDisclaimer, ThumbnailIcon, LEARNER_ID,
} from "./_shared";
import { formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  Route, Clock, Users, TrendingUp, ArrowRight, CheckCircle2, Sparkles,
  Briefcase, Award, Target,
} from "lucide-react";

export function LearnerCareerPaths() {
  const { navigate } = useNav();
  const [selected, setSelected] = React.useState<CareerPath | null>(null);

  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;
  const myEnrollments = learnerCourseEnrollments.filter((e) => e.learnerId === LEARNER_ID);
  const mySkills = learner.skills.map((s) => s.name);

  // progress per path (based on enrolled courses within path)
  function pathProgress(p: CareerPath): number {
    if (p.courses.length === 0) return 0;
    const done = p.courses.filter((cid) =>
      myEnrollments.some((e) => e.courseId === cid && e.status === "completed"),
    ).length;
    return Math.round((done / p.courses.length) * 100);
  }

  // recommended path for learner — matches their existing skills best
  const recommended = React.useMemo(() => {
    return careerPaths.map((p) => {
      const pathCourseSkills = trainingCourses
        .filter((c) => p.courses.includes(c.id))
        .flatMap((c) => c.skills);
      const overlap = pathCourseSkills.filter((s) => mySkills.includes(s)).length;
      return { path: p, overlap };
    }).sort((a, b) => b.overlap - a.overlap)[0]?.path;
  }, [mySkills]);

  function explore(p: CareerPath) {
    setSelected(p);
  }
  function enrollInAll(p: CareerPath) {
    toast.success(`Enrolled in "${p.name}" career path`, {
      description: `${p.courses.length} courses added to My Learning`,
    });
    setTimeout(() => navigate("candidate", "my-learning"), 900);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Paths"
        description="Structured learning journeys that take you from where you are to where you want to be."
        icon={<Route className="h-5 w-5" />}
      />

      <LearnerDisclaimer />

      {/* Recommended path highlight */}
      {recommended && (
        <SectionCard
          title="Recommended path for you"
          description="Based on your current skills and career goal"
        >
          <div
            className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
            style={{ background: `${recommended.color}10` }}
          >
            <ThumbnailIcon color={recommended.color} icon={recommended.icon} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge className="bg-brand/15 text-brand">
                  <Sparkles className="mr-1 h-3 w-3" /> Best match
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {recommended.courses.length} courses · {recommended.duration}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{recommended.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{recommended.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" /> Avg salary {recommended.averageSalary}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {formatNumber(recommended.enrolledCount)} enrolled
                </span>
              </div>
            </div>
            <Button onClick={() => explore(recommended)}>
              Explore path <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </SectionCard>
      )}

      {/* All paths grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {careerPaths.map((p) => {
          const progress = pathProgress(p);
          return (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
            >
              <div
                className="relative flex h-24 items-center justify-center"
                style={{ background: p.color }}
              >
                <ThumbnailIcon color="rgba(255,255,255,0.2)" icon={p.icon} size="lg" />
                {progress > 0 && (
                  <Badge className="absolute right-2 top-2 bg-white/90 text-emerald-700 hover:bg-white/90">
                    {progress}% complete
                  </Badge>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Route className="h-3 w-3" /> {p.courses.length} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {formatNumber(p.enrolledCount)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {p.averageSalary}
                  </span>
                  <span className="text-muted-foreground">avg salary</span>
                </div>
                {progress > 0 && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}
                <div className="mt-auto pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => explore(p)}
                  >
                    Explore path <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <ThumbnailIcon color={selected.color} icon={selected.icon} size="md" />
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {/* Outcome */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Outcome</p>
                    <p className="mt-1 text-sm font-medium">{selected.outcome}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Avg salary</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {selected.averageSalary}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="mt-1 text-sm font-medium">{selected.duration}</p>
                  </div>
                </div>

                {/* Course sequence */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Course sequence ({selected.courses.length})</h4>
                  <ul className="space-y-2">
                    {selected.courses.map((cid, i) => {
                      const course = trainingCourses.find((c) => c.id === cid);
                      if (!course) return null;
                      const enr = myEnrollments.find((e) => e.courseId === cid);
                      const isDone = enr?.status === "completed";
                      return (
                        <li
                          key={cid}
                          className="flex items-center gap-3 rounded-lg border p-2.5"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isDone
                                ? "bg-emerald-500 text-white"
                                : enr
                                ? "bg-brand text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{course.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.code} · {course.difficulty} · {course.category}
                            </p>
                          </div>
                          {isDone ? (
                            <Badge variant="secondary" className="text-[10px]">
                              <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" /> Done
                            </Badge>
                          ) : enr ? (
                            <Badge variant="secondary" className="text-[10px]">
                              {enr.progress}% in progress
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7"
                              onClick={() => {
                                setSelected(null);
                                navigate("candidate", `catalog/${cid}`);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Skills gained */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Skills you&apos;ll gain</h4>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(
                      new Set(
                        trainingCourses
                          .filter((c) => selected.courses.includes(c.id))
                          .flatMap((c) => c.skills),
                      ),
                    ).map((s) => (
                      <Badge
                        key={s}
                        variant={mySkills.includes(s) ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {mySkills.includes(s) && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Salary insight */}
                <div className="rounded-lg border bg-brand/5 p-3 text-xs">
                  <p className="flex items-center gap-1.5 font-medium text-brand">
                    <Briefcase className="h-3.5 w-3.5" /> Salary insight
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Professionals completing this path typically earn {selected.averageSalary} in India.
                    Your current profile matches {mySkills.filter((s) =>
                      trainingCourses
                        .filter((c) => selected.courses.includes(c.id))
                        .flatMap((c) => c.skills)
                        .includes(s),
                    ).length} of the target skills.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button onClick={() => enrollInAll(selected)}>
                  <Target className="mr-1 h-4 w-4" /> Enroll in all {selected.courses.length} courses
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
