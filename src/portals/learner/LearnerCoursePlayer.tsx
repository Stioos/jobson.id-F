"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  trainingCourses, trainers, learnerCourseEnrollments, sampleDiscussion,
} from "@/lib/lms-data";
import type { TrainingCourse, Trainer, CourseLesson } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LEARNER_ID, durationLabel } from "./_shared";
import { toast } from "sonner";
import {
  ArrowLeft, Play, CheckCircle2, Circle, FileText, HelpCircle, ClipboardList,
  Video, Users2, BookOpen, Download, Link as LinkIcon, Send, ChevronLeft,
  ChevronRight, PanelLeftClose, PanelLeftOpen, Award,
} from "lucide-react";

interface LessonRow {
  moduleIdx: number;
  lessonIdx: number;
  lesson: CourseLesson;
}

function lessonRows(course: TrainingCourse): LessonRow[] {
  return course.modules.flatMap((m, mi) =>
    m.lessons.map((l, li) => ({ moduleIdx: mi, lessonIdx: li, lesson: l })),
  );
}

function lessonIcon(type: string) {
  switch (type) {
    case "video": return <Video className="h-3.5 w-3.5" />;
    case "quiz": return <HelpCircle className="h-3.5 w-3.5" />;
    case "assignment": return <ClipboardList className="h-3.5 w-3.5" />;
    case "live": return <Users2 className="h-3.5 w-3.5" />;
    case "project": return <BookOpen className="h-3.5 w-3.5" />;
    case "reading": return <FileText className="h-3.5 w-3.5" />;
    default: return <FileText className="h-3.5 w-3.5" />;
  }
}

function LessonBody({
  lesson,
  course,
}: {
  lesson: CourseLesson;
  course: TrainingCourse;
  onLaunchQuiz?: () => void;
  onBackToSessions?: () => void;
}) {
  // Type-specific lesson shell — content is illustrative.
  return (
    <div className="space-y-3 p-4">
      {lesson.type === "video" && (
        <div
          className="relative flex aspect-video items-center justify-center rounded-lg"
          style={{ background: course.thumbnailColor }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Play className="h-6 w-6 text-white" />
          </div>
          <span className="absolute bottom-2 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
            {durationLabel(lesson.durationMinutes)}
          </span>
        </div>
      )}
      {lesson.type === "quiz" && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <Badge variant="secondary" className="mb-2">
            <HelpCircle className="mr-1 h-3 w-3" /> Quiz
          </Badge>
          <p className="text-sm font-medium">
            This quiz checks your understanding of the module.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {lesson.durationMinutes} minutes · passing score 70%
          </p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => toast.info("Launching quiz in a real environment.")}
          >
            <HelpCircle className="mr-1 h-3.5 w-3.5" /> Start quiz
          </Button>
        </div>
      )}
      {lesson.type === "assignment" && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <Badge variant="secondary" className="mb-2">
            <ClipboardList className="mr-1 h-3 w-3" /> Assignment
          </Badge>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Submit your work as a PDF or GitHub link. Estimated time: {durationLabel(lesson.durationMinutes)}.
          </p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => toast.info("Assignment upload dialog would open.")}
          >
            <FileText className="mr-1 h-3.5 w-3.5" /> Upload submission
          </Button>
        </div>
      )}
      {lesson.type === "live" && (
        <div className="rounded-lg border bg-rose-500/5 p-4">
          <Badge className="mb-2 bg-rose-500/10 text-rose-700 dark:text-rose-300">
            <Users2 className="mr-1 h-3 w-3" /> Live session
          </Badge>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Join the live session at the scheduled time. Duration: {durationLabel(lesson.durationMinutes)}.
          </p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => toast.success("Calendar invite sent · check My Sessions")}
          >
            <Video className="mr-1 h-3.5 w-3.5" /> Add to calendar
          </Button>
        </div>
      )}
      {lesson.type === "project" && (
        <div className="rounded-lg border bg-emerald-500/5 p-4">
          <Badge className="mb-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <BookOpen className="mr-1 h-3 w-3" /> Hands-on project
          </Badge>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Build a real project end-to-end. Estimated time: {durationLabel(lesson.durationMinutes)}.
          </p>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => toast.info("Project starter repo would be cloned.")}
          >
            <Download className="mr-1 h-3.5 w-3.5" /> Get starter code
          </Button>
        </div>
      )}
      {lesson.type === "reading" && (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <FileText className="mb-2 h-5 w-5 text-brand" />
          Reading material for this lesson is available in the Resources tab.
        </div>
      )}
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          About this lesson
        </h4>
        <p className="text-sm text-muted-foreground">
          {lesson.description ??
            `In this ${lesson.type} lesson, you will explore ${lesson.title.toLowerCase()}. This lesson is part of the "${course.modules.find((m) => m.lessons.some((l) => l.id === lesson.id))?.title}" module and takes approximately ${durationLabel(lesson.durationMinutes)} to complete.`}
        </p>
      </div>
    </div>
  );
}

export function LearnerCoursePlayer({ courseId }: { courseId: string }) {
  const { navigate } = useNav();
  const course = React.useMemo(() => trainingCourses.find((c) => c.id === courseId), [courseId]);
  const trainer = React.useMemo<Trainer | undefined>(
    () => (course ? trainers.find((t) => t.id === course.instructorId) : undefined),
    [course],
  );
  const enrollment = learnerCourseEnrollments.find(
    (e) => e.learnerId === LEARNER_ID && e.courseId === courseId,
  );

  const rows = React.useMemo(() => (course ? lessonRows(course) : []), [course]);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [completed, setCompleted] = React.useState<Set<string>>(() => {
    // Seed completed lessons from enrollment progress (deterministic).
    if (!course || !enrollment) return new Set<string>();
    const total = rows.length;
    const target = Math.round((enrollment.progress / 100) * total);
    return new Set(rows.slice(0, target).map((r) => r.lesson.id));
  });
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [discussions, setDiscussions] = React.useState(sampleDiscussion);
  const [newComment, setNewComment] = React.useState("");
  const [tab, setTab] = React.useState("overview");

  React.useEffect(() => {
    setActiveIdx(0);
  }, [courseId]);

  if (!course || rows.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "my-learning")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to My Learning
        </Button>
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="Course not found"
          description="This course does not exist or has no lessons yet."
          action={<Button onClick={() => navigate("candidate", "my-learning")}>Back to My Learning</Button>}
        />
      </div>
    );
  }

  const current = rows[activeIdx];
  const completedCount = completed.size;
  const totalCount = rows.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = completed.has(current.lesson.id);
  const nextIdx = Math.min(activeIdx + 1, rows.length - 1);
  const prevIdx = Math.max(activeIdx - 1, 0);

  function toggleComplete() {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(current.lesson.id)) next.delete(current.lesson.id);
      else next.add(current.lesson.id);
      return next;
    });
    toast.success(isCompleted ? "Marked as incomplete" : "Lesson completed +50 pts");
  }

  function goNext() {
    if (!isCompleted) {
      setCompleted((prev) => new Set(prev).add(current.lesson.id));
    }
    setActiveIdx(nextIdx);
    setTab("overview");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addComment() {
    if (!newComment.trim()) return;
    setDiscussions((d) => [
      ...d,
      {
        id: `dp_new_${Date.now()}`,
        author: "Aditya Rao",
        initials: "AR",
        color: "oklch(0.55 0.13 165)",
        message: newComment.trim(),
        time: "just now",
      },
    ]);
    setNewComment("");
    toast.success("Comment posted to discussion");
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "my-learning")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> My Learning
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-sm font-medium">{course.name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? <PanelLeftClose className="mr-1 h-4 w-4" /> : <PanelLeftOpen className="mr-1 h-4 w-4" />}
          {sidebarOpen ? "Hide outline" : "Show outline"}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Course progress · {completedCount}/{totalCount} lessons</span>
          <span className="font-medium text-brand">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        {sidebarOpen && (
          <Card className="h-fit p-0 lg:sticky lg:top-4">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-sm">Course content</CardTitle>
              <CardDescription className="text-xs">
                {totalCount} lessons · {durationLabel(course.durationMinutes)}
              </CardDescription>
            </CardHeader>
            <ScrollArea className="max-h-[70vh]">
              <Accordion type="multiple" defaultValue={course.modules.map((_, i) => `m-${i}`)} className="px-2">
                {course.modules.map((m, mi) => {
                  const doneInModule = m.lessons.filter((l) => completed.has(l.id)).length;
                  return (
                    <AccordionItem key={m.id} value={`m-${mi}`} className="border-b-0">
                      <AccordionTrigger className="px-2 py-2 text-sm hover:no-underline">
                        <div className="flex flex-1 items-center justify-between gap-2 pr-2 text-left">
                          <span className="font-medium">{m.title}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {doneInModule}/{m.lessons.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1">
                        <ul className="space-y-0.5">
                          {m.lessons.map((l) => {
                            const flatIdx = rows.findIndex((r) => r.lesson.id === l.id);
                            const isActive = flatIdx === activeIdx;
                            const isDone = completed.has(l.id);
                            return (
                              <li key={l.id}>
                                <button
                                  onClick={() => setActiveIdx(flatIdx)}
                                  className={
                                    "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition " +
                                    (isActive ? "bg-brand/10 text-brand" : "hover:bg-muted")
                                  }
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                  ) : (
                                    <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  )}
                                  <span className="flex-1">
                                    <span className="line-clamp-2 font-medium">{l.title}</span>
                                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                      {lessonIcon(l.type)}
                                      <span className="capitalize">{l.type}</span>
                                      <span>· {durationLabel(l.durationMinutes)}</span>
                                    </span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </Card>
        )}

        {/* Main content */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 p-4">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Module {current.moduleIdx + 1}</span>
                  <span>·</span>
                  <span>Lesson {current.lessonIdx + 1}</span>
                </div>
                <CardTitle className="text-lg">{current.lesson.title}</CardTitle>
              </div>
              <Badge variant="secondary" className="capitalize">
                <span className="mr-1 inline-flex">{lessonIcon(current.lesson.type)}</span>
                {current.lesson.type}
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <LessonBody lesson={current.lesson} course={course} />

              {/* Footer nav */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveIdx(prevIdx)}
                  disabled={activeIdx === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isCompleted ? "outline" : "default"}
                    size="sm"
                    onClick={toggleComplete}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="mr-1 h-4 w-4 text-emerald-500" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle className="mr-1 h-4 w-4" /> Mark complete
                      </>
                    )}
                  </Button>
                  <Button size="sm" onClick={goNext} disabled={activeIdx === rows.length - 1}>
                    Mark complete & next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs below content */}
          <Card>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start rounded-b-none border-b bg-transparent p-0">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Discussion ({discussions.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="m-0 p-4">
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">What you&apos;ll learn</h4>
                    <ul className="space-y-1.5">
                      {course.objectives.slice(0, 4).map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Prerequisites</p>
                      <p className="mt-1 text-sm">{course.prerequisites.join(", ") || "None"}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Skills covered</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {course.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {trainer && (
                    <div className="flex items-center gap-2 rounded-lg border p-3 text-xs text-muted-foreground">
                      <span>Instructor:</span>
                      <span className="font-medium text-foreground">{trainer.name}</span>
                      <span>·</span>
                      <span>{trainer.bio}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="m-0 p-4">
                {course.materials.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="h-5 w-5" />}
                    title="No resources for this course"
                    description="Materials will appear here once the instructor uploads them."
                  />
                ) : (
                  <ul className="space-y-2">
                    {course.materials.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            {m.type === "link" ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{m.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{m.type}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Downloading "${m.title}"…`)}
                        >
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="discussion" className="m-0 p-4">
                <div className="space-y-3">
                  <ul className="space-y-3">
                    {discussions.map((d) => (
                      <li key={d.id} className="flex items-start gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                          style={{ background: d.color }}
                        >
                          {d.initials}
                        </span>
                        <div className="min-w-0 flex-1 rounded-lg border p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{d.author}</span>
                            <span className="text-muted-foreground">{d.time}</span>
                          </div>
                          <p className="mt-1 text-sm">{d.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add to the discussion…"
                      className="min-h-[60px]"
                    />
                    <Button size="sm" onClick={addComment}>
                      <Send className="mr-1 h-3.5 w-3.5" /> Post
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="m-0 p-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Your private notes for this lesson — saved on this device.
                  </p>
                  <Textarea
                    value={notes[current.lesson.id] ?? ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [current.lesson.id]: e.target.value }))
                    }
                    placeholder="Type your notes here…"
                    className="min-h-[200px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Notes saved")}
                  >
                    Save notes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {progressPct === 100 && (
            <Card className="border-brand/40 bg-brand/5">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center sm:flex-row sm:text-left">
                <Award className="h-8 w-8 text-brand" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Course completed! 🎉</p>
                  <p className="text-xs text-muted-foreground">
                    You finished all lessons. Your certificate is ready in My Certificates.
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("candidate", "certificates")}>
                  View certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
