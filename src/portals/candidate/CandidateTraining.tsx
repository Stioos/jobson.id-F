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
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNav } from "@/lib/store";
import { trainingCourses, certifications } from "@/lib/mock-data";
import type { TrainingCourse } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface EnrolledCourse {
  course: TrainingCourse;
  progress: number;
  enrolledAt: string;
  nextLesson: string;
}

const SEED_ENROLLED: EnrolledCourse[] = [
  {
    course: trainingCourses[0], // Advanced React 19 Patterns
    progress: 62,
    enrolledAt: "2024-09-20T10:00:00Z",
    nextLesson: "Suspense boundaries & streaming",
  },
  {
    course: trainingCourses[1], // System Design for Interviews
    progress: 35,
    enrolledAt: "2024-10-05T10:00:00Z",
    nextLesson: "Design a URL shortener",
  },
  {
    course: trainingCourses[4], // SQL & Data Analytics for PMs
    progress: 88,
    enrolledAt: "2024-08-12T10:00:00Z",
    nextLesson: "Window functions",
  },
];

export function CandidateTraining() {
  const { navigate } = useNav();
  const [enrolled, setEnrolled] = React.useState<EnrolledCourse[]>(SEED_ENROLLED);
  const enrolledIds = new Set(enrolled.map((e) => e.course.id));

  function enroll(course: TrainingCourse) {
    if (enrolledIds.has(course.id)) return;
    setEnrolled((prev) => [
      ...prev,
      {
        course,
        progress: 0,
        enrolledAt: new Date().toISOString(),
        nextLesson: course.title,
      },
    ]);
    toast.success("Enrolled!", { description: course.title });
  }

  function continueCourse(e: EnrolledCourse) {
    toast.success("Resuming course", {
      description: `Next: ${e.nextLesson}`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & Certifications"
        description="Learn new skills, earn certifications, and grow your career."
      />

      <Tabs defaultValue="my-learning">
        <TabsList>
          <TabsTrigger value="my-learning" className="gap-1">
            <Icon name="BookOpen" className="h-4 w-4" /> My Learning
          </TabsTrigger>
          <TabsTrigger value="browse" className="gap-1">
            <Icon name="Search" className="h-4 w-4" /> Browse Courses
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-1">
            <Icon name="Award" className="h-4 w-4" /> Certifications
          </TabsTrigger>
        </TabsList>

        {/* My learning */}
        <TabsContent value="my-learning">
          {enrolled.length === 0 ? (
            <EmptyState
              icon={<Icon name="BookOpen" className="h-5 w-5" />}
              title="Not enrolled in any courses"
              description="Browse courses and enroll to start learning."
              action={
                <Button onClick={() => navigate("candidate", "training")}>
                  Browse courses
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {enrolled.map((e) => (
                <Card key={e.course.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{e.course.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.course.provider} · {e.course.durationHours}h
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {e.course.level}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{e.progress}%</span>
                      </div>
                      <Progress value={e.progress} className="mt-1 h-2" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Next: {e.nextLesson}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" onClick={() => continueCourse(e)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Browse */}
        <TabsContent value="browse">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {trainingCourses.map((c) => {
              const isEnrolled = enrolledIds.has(c.id);
              return (
                <Card key={c.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {c.category}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {c.level}
                      </Badge>
                    </div>
                    <p className="mt-2 font-medium leading-tight">{c.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.provider}</p>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="Clock" className="h-3 w-3" /> {c.durationHours}h
                      </span>
                      <span className="inline-flex items-center gap-1">
                        ★ {c.rating}
                      </span>
                      <span>{formatCurrency(c.price, c.currency)}</span>
                    </div>
                    <div className="mt-3 flex-1" />
                    <Button
                      size="sm"
                      variant={isEnrolled ? "outline" : "default"}
                      disabled={isEnrolled}
                      onClick={() => enroll(c)}
                    >
                      {isEnrolled ? (
                        <>
                          <Icon name="BadgeCheck" className="h-4 w-4" /> Enrolled
                        </>
                      ) : c.price === 0 ? (
                        "Enroll free"
                      ) : (
                        "Enroll"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications">
          <SectionCard
            title="Industry certifications"
            description="Recognized credentials to boost your profile."
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {certifications.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon name="Award" className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-tight">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.issuer}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {c.category}
                          </Badge>
                          <Badge variant="outline" className="capitalize text-xs">
                            {c.skillLevel}
                          </Badge>
                          {c.validityMonths && (
                            <Badge variant="outline" className="text-xs">
                              Valid {c.validityMonths}mo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.info("Prep resources", {
                            description: `Recommended path for ${c.name}.`,
                          })
                        }
                      >
                        Prepare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
