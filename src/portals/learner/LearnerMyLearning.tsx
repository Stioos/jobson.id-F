"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  learnerCourseEnrollments, trainingCourses, learnerCertificates,
} from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate, timeAgo } from "@/lib/format";
import {
  LearnerDisclaimer, ThumbnailIcon, DifficultyBadge, StarRating,
  durationLabel, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  Play, BookOpen, Award, Clock, RefreshCw, Star, GraduationCap,
  ChevronRight, RotateCcw, Filter,
} from "lucide-react";

export function LearnerMyLearning() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState("in_progress");
  const [sort, setSort] = React.useState("recent");

  const myEnrollments = learnerCourseEnrollments.filter((e) => e.learnerId === LEARNER_ID);

  const myCerts = learnerCertificates.filter((c) => c.learnerId === LEARNER_ID);

  const filtered = React.useMemo(() => {
    let list = myEnrollments;
    if (tab === "in_progress") list = list.filter((e) => e.status === "in_progress");
    if (tab === "completed") list = list.filter((e) => e.status === "completed");
    switch (sort) {
      case "recent":
        list = [...list].sort(
          (a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime(),
        );
        break;
      case "progress_high":
        list = [...list].sort((a, b) => b.progress - a.progress);
        break;
      case "progress_low":
        list = [...list].sort((a, b) => a.progress - b.progress);
        break;
      case "name":
        list = [...list].sort((a, b) => a.courseName.localeCompare(b.courseName));
        break;
    }
    return list;
  }, [myEnrollments, tab, sort]);

  function courseById(id: string) {
    return trainingCourses.find((c) => c.id === id);
  }
  function certFor(courseId: string) {
    return myCerts.find((c) => c.courseId === courseId);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning"
        description="Pick up a course, retake one, or review what you've completed."
        icon={<GraduationCap className="h-5 w-5" />}
        actions={[
          { label: "Browse Catalog", icon: "BookOpen", variant: "outline", onClick: () => navigate("candidate", "catalog") },
        ]}
      />

      <LearnerDisclaimer />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SectionCard title="In Progress" className="p-4">
          <p className="text-2xl font-bold text-brand">
            {myEnrollments.filter((e) => e.status === "in_progress").length}
          </p>
        </SectionCard>
        <SectionCard title="Completed" className="p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {myEnrollments.filter((e) => e.status === "completed").length}
          </p>
        </SectionCard>
        <SectionCard title="Hours invested" className="p-4">
          <p className="text-2xl font-bold">
            {Math.round(
              myEnrollments.reduce((s, e) => s + e.timeSpentMinutes, 0) / 60,
            )}h
          </p>
        </SectionCard>
        <SectionCard title="Avg. score" className="p-4">
          <p className="text-2xl font-bold">
            {(() => {
              const completed = myEnrollments.filter((e) => e.score !== undefined);
              if (completed.length === 0) return "—";
              return Math.round(
                completed.reduce((s, e) => s + (e.score ?? 0), 0) / completed.length,
              );
            })()}%
          </p>
        </SectionCard>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="in_progress">
              In Progress ({myEnrollments.filter((e) => e.status === "in_progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({myEnrollments.filter((e) => e.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({myEnrollments.length})</TabsTrigger>
          </TabsList>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="mr-1 h-3.5 w-3.5" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently accessed</SelectItem>
              <SelectItem value="progress_high">Progress: High to Low</SelectItem>
              <SelectItem value="progress_low">Progress: Low to High</SelectItem>
              <SelectItem value="name">Course name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title={tab === "in_progress" ? "No courses in progress" : tab === "completed" ? "No completed courses yet" : "No enrollments yet"}
              description="Browse the catalog to find your next course."
              action={<Button onClick={() => navigate("candidate", "catalog")}>Browse courses</Button>}
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((enr) => {
                const course = courseById(enr.courseId);
                if (!course) return null;
                const cert = certFor(enr.courseId);
                const isCompleted = enr.status === "completed";
                return (
                  <div
                    key={enr.id}
                    className="flex flex-col gap-3 rounded-xl border p-4 transition hover:shadow-sm sm:flex-row"
                  >
                    <ThumbnailIcon color={course.thumbnailColor} icon={course.thumbnailIcon} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <DifficultyBadge level={course.difficulty} />
                            <StatusBadge status={enr.status} />
                            {cert && (
                              <Badge variant="secondary" className="text-[10px]">
                                <Award className="mr-1 h-3 w-3" /> Certified
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() => navigate("candidate", `my-learning/${enr.courseId}`)}
                            className="line-clamp-2 text-left text-sm font-semibold hover:text-brand"
                          >
                            {course.name}
                          </button>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {course.instructorName}
                          </p>
                        </div>
                        <StarRating value={course.rating} />
                      </div>

                      {/* Progress + meta */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {isCompleted ? "Completed" : "Progress"} · {enr.progress}%
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(enr.timeSpentMinutes / 60)}h spent
                          </span>
                        </div>
                        <Progress value={enr.progress} className="mt-1 h-1.5" />
                      </div>

                      {/* Meta row */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {isCompleted && enr.score !== undefined && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            Score: {enr.score}%
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last accessed {timeAgo(enr.lastAccessed)}
                        </span>
                        {isCompleted && enr.completedDate && (
                          <span>Completed on {formatDate(enr.completedDate)}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => navigate("candidate", `my-learning/${enr.courseId}`)}
                        >
                          {isCompleted ? (
                            <>
                              <BookOpen className="mr-1 h-3.5 w-3.5" /> Review
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" /> Resume
                            </>
                          )}
                        </Button>
                        {isCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.info("Restarting course — your progress will be reset.")}
                          >
                            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Retake
                          </Button>
                        )}
                        {cert && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("candidate", "certificates")}
                          >
                            <Award className="mr-1 h-3.5 w-3.5" /> View certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
