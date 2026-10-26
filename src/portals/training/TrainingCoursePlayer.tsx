"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses, trainers, sampleDiscussion } from "@/lib/lms-data";
import type { TrainingCourse, Trainer, CourseLesson } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { durationLabel } from "./_shared";
import { toast } from "sonner";
import {
  ArrowLeft, Play, CheckCircle2, Circle, FileText, HelpCircle, ClipboardList,
  Video, Users2, BookOpen, Download, Link as LinkIcon, Send, Star,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen,
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

function ProgressRing({ value, size = 80 }: { value: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * value) / 100;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          className="stroke-brand" strokeWidth={6} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-semibold">{value}%</span>
    </div>
  );
}

export function TrainingCoursePlayer({ courseId }: { courseId: string }) {
  const { navigate } = useNav();
  const course = React.useMemo(() => trainingCourses.find((c) => c.id === courseId), [courseId]);
  const trainer = React.useMemo<Trainer | undefined>(
    () => (course ? trainers.find((t) => t.id === course.instructorId) : undefined),
    [course],
  );

  const rows = React.useMemo(() => (course ? lessonRows(course) : []), [course]);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [discussions, setDiscussions] = React.useState(sampleDiscussion);
  const [newComment, setNewComment] = React.useState("");
  const [tab, setTab] = React.useState("overview");

  // Reset active index when course changes
  React.useEffect(() => {
    setActiveIdx(0);
    setCompleted(new Set());
  }, [courseId]);

  if (!course || rows.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("training", "courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to courses
        </Button>
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="Course not found"
          description="This course does not exist or has no lessons yet."
          action={<Button onClick={() => navigate("training", "courses")}>Browse courses</Button>}
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
    toast.success(isCompleted ? "Marked as incomplete" : "Lesson completed");
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
        author: "You",
        initials: "YO",
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("training", "courses")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Courses
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-sm font-medium">{course.name}</span>
        </div>
        <Button
          variant="outline" size="sm"
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

      <div className="grid gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_280px]">
        {/* Sidebar — modules/lessons tree */}
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
                          {m.lessons.map((l, li) => {
                            const flatIdx = rows.findIndex((r) => r.lesson.id === l.id);
                            const isActive = flatIdx === activeIdx;
                            const isDone = completed.has(l.id);
                            return (
                              <li key={l.id}>
                                <button
                                  onClick={() => setActiveIdx(flatIdx)}
                                  className={
                                    "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition " +
                                    (isActive
                                      ? "bg-brand/10 text-brand"
                                      : "hover:bg-muted")
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
              {/* Lesson body — type specific */}
              <LessonBody
                lesson={current.lesson}
                course={course}
                onLaunchQuiz={() => {
                  if (course.id) navigate("training", `assessments/ta_001/take`);
                }}
                onBackToSessions={() => navigate("training", "live-training")}
              />

              {/* Footer nav */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 p-3">
                <Button
                  variant="ghost" size="sm"
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
                  <p className="text-muted-foreground">
                    {current.lesson.description ??
                      `In this ${current.lesson.type} lesson, you will explore ${current.lesson.title.toLowerCase()}. This lesson is part of the "${course.modules[current.moduleIdx].title}" module and takes approximately ${durationLabel(current.lesson.durationMinutes)} to complete.`}
                  </p>
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
                </div>
              </TabsContent>

              <TabsContent value="resources" className="m-0 p-4">
                {course.materials.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="h-5 w-5" />}
                    title="No resources for this course"
                    description="Materials will appear here once the trainer uploads them."
                  />
                ) : (
                  <ul className="space-y-2">
                    {course.materials.map((m) => (
                      <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                            {m.type === "link" ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{m.title}</p>
                            <p className="text-xs uppercase text-muted-foreground">{m.type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast.success(`Downloading ${m.title}…`)}>
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="discussion" className="m-0 p-4">
                <div className="space-y-3">
                  <div className="space-y-3">
                    {discussions.map((d) => (
                      <div key={d.id} className="flex gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                          style={{ background: d.color }}
                        >
                          {d.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{d.author}</p>
                            <span className="text-xs text-muted-foreground">{d.time}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{d.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border p-3">
                    <Textarea
                      placeholder="Ask a question or share a thought…"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] border-0 p-0 shadow-none focus-visible:ring-0"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                        <Send className="mr-1 h-3.5 w-3.5" /> Post comment
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="m-0 p-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Personal notes for this lesson. Saved locally in your browser session.
                  </p>
                  <Textarea
                    placeholder="Jot down key takeaways, timestamps, questions to revisit…"
                    value={notes[current.lesson.id] ?? ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [current.lesson.id]: e.target.value }))
                    }
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("Note saved")}
                    >
                      Save note
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right panel — progress + trainer */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <ProgressRing value={progressPct} />
              <p className="mt-2 text-sm font-medium">Your progress</p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} lessons completed
              </p>
              <Button
                className="mt-3 w-full" size="sm"
                onClick={() => navigate("training", "assessments/ta_001/take")}
              >
                Take final assessment
              </Button>
            </div>
          </Card>

          {trainer && (
            <Card className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Instructor
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: trainer.avatarColor }}
                >
                  {trainer.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{trainer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{trainer.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {trainer.rating}
                </span>
                <span className="text-muted-foreground">{trainer.sessionsConducted} sessions</span>
              </div>
              <p className="mt-3 line-clamp-3 text-xs text-muted-foreground">{trainer.bio}</p>
              <Button
                variant="outline" size="sm" className="mt-3 w-full"
                onClick={() => toast.success(`Opening trainer profile — ${trainer.name}`)}
              >
                View profile
              </Button>
            </Card>
          )}

          <Card className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Course details
            </p>
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">Code</dt><dd className="font-mono">{course.code}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd>{course.category}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Difficulty</dt><dd className="capitalize">{course.difficulty}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Version</dt><dd>{course.version}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Language</dt><dd>{course.language}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Certificate</dt><dd>{course.hasCertificate ? <StatusBadge status="active" /> : "—"}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LessonBody({
  lesson, course, onLaunchQuiz, onBackToSessions,
}: {
  lesson: CourseLesson;
  course: TrainingCourse;
  onLaunchQuiz: () => void;
  onBackToSessions: () => void;
}) {
  if (lesson.type === "video") {
    return (
      <div className="relative aspect-video bg-slate-900">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${course.thumbnailColor}, rgba(0,0,0,0.6))` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <button
            className="group flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:scale-105 hover:bg-white/30"
            onClick={() => toast.info(`Playing "${lesson.title}"`)}
            aria-label="Play video"
          >
            <Play className="ml-1 h-7 w-7 fill-white text-white" />
          </button>
          <p className="mt-3 text-sm font-medium drop-shadow">{lesson.title}</p>
          <p className="text-xs text-white/80">{durationLabel(lesson.durationMinutes)}</p>
        </div>
        {/* Fake controls bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/50 px-3 py-2 text-white">
          <Play className="h-3 w-3" />
          <div className="h-1 flex-1 rounded-full bg-white/20">
            <div className="h-1 w-1/3 rounded-full bg-brand" />
          </div>
          <span className="text-[10px]">0:00 / {durationLabel(lesson.durationMinutes)}</span>
        </div>
      </div>
    );
  }

  if (lesson.type === "reading") {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none p-6">
        <h3 className="text-base font-semibold">{lesson.title}</h3>
        <p>
          {lesson.description ??
            `This reading covers ${lesson.title.toLowerCase()} in depth. Take your time to absorb the concepts — the estimated reading time is ${durationLabel(lesson.durationMinutes)}.`}
        </p>
        <h4 className="mt-4 text-sm font-semibold">Key concepts</h4>
        <ul>
          <li>Foundational principles and terminology</li>
          <li>Common patterns and anti-patterns</li>
          <li>Real-world examples and case studies</li>
          <li>When to apply this in your work</li>
        </ul>
        <h4 className="mt-4 text-sm font-semibold">Recommended next steps</h4>
        <p>Complete the reading, take notes in the Notes tab, then mark this lesson complete to proceed.</p>
      </div>
    );
  }

  if (lesson.type === "quiz") {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-brand" />
            <div>
              <p className="text-sm font-semibold">Assessment lesson</p>
              <p className="text-xs text-muted-foreground">
                This lesson is an assessment. Launch the exam player to begin.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold">10 questions</p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="text-xs text-muted-foreground">Time limit</p>
            <p className="text-lg font-semibold">{durationLabel(lesson.durationMinutes)}</p>
          </div>
        </div>
        <Button onClick={onLaunchQuiz}>
          <HelpCircle className="mr-2 h-4 w-4" /> Launch quiz
        </Button>
      </div>
    );
  }

  if (lesson.type === "assignment" || lesson.type === "project") {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assignment brief</p>
          <p className="mt-1 text-sm">
            {lesson.description ??
              `Complete the "${lesson.title}" assignment. You will apply what you have learned in this module to a hands-on exercise. Estimated effort: ${durationLabel(lesson.durationMinutes)}.`}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• Read the brief carefully</li>
            <li>• Submit your work as a PDF or zip archive</li>
            <li>• Your trainer will review and provide feedback within 3 business days</li>
          </ul>
        </div>
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Drag & drop your submission here</p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, ZIP up to 25MB</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Upload dialog opened")}>
            Browse files
          </Button>
        </div>
      </div>
    );
  }

  if (lesson.type === "live") {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-4">
          <div className="flex items-center gap-3">
            <Users2 className="h-8 w-8 text-brand" />
            <div>
              <p className="text-sm font-semibold">Live session lesson</p>
              <p className="text-xs text-muted-foreground">
                Join the scheduled live session at the appointed time. Recording will be available after.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Opening meeting link…")}>
            <Video className="mr-2 h-4 w-4" /> Join live session
          </Button>
          <Button variant="outline" onClick={onBackToSessions}>
            View session details
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {lesson.description ?? `Live session for "${lesson.title}". Duration: ${durationLabel(lesson.durationMinutes)}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 text-sm text-muted-foreground">
      This lesson type ({lesson.type}) is not yet interactive in the demo. Mark complete to proceed.
    </div>
  );
}
