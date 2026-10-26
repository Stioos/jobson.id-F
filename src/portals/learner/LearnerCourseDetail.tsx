"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses, trainers, learnerCourseEnrollments, wishlistItems } from "@/lib/lms-data";
import type { Trainer } from "@/lib/types";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import {
  LearnerDisclaimer, ThumbnailIcon, DifficultyBadge, StarRating,
  durationLabel, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  ArrowLeft, BookOpen, Clock, Users, Award, Heart, ShoppingCart, Play,
  CheckCircle2, Video, HelpCircle, ClipboardList, Users2, FileText,
  Link as LinkIcon, Download, Star, Share2, ShieldCheck, Sparkles,
} from "lucide-react";

const MOCK_REVIEWS = [
  { id: "r1", name: "Meera Iyer", initials: "MI", color: "oklch(0.55 0.13 200)", rating: 5, date: "2 weeks ago", comment: "Best course I've taken on SkillForge. The hands-on labs are incredible." },
  { id: "r2", name: "Vikram Singh", initials: "VS", color: "oklch(0.6 0.16 70)", rating: 5, date: "1 month ago", comment: "Loved the depth. The instructor explains complex topics with clarity." },
  { id: "r3", name: "Sneha Kapoor", initials: "SK", color: "oklch(0.6 0.13 300)", rating: 4, date: "1 month ago", comment: "Great content overall, wish there were more advanced exercises at the end." },
  { id: "r4", name: "Arjun Mehta", initials: "AM", color: "oklch(0.55 0.13 165)", rating: 5, date: "2 months ago", comment: "The capstone project alone is worth the price. Highly recommend." },
];

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

export function LearnerCourseDetail({ courseId }: { courseId: string }) {
  const { navigate } = useNav();
  const course = trainingCourses.find((c) => c.id === courseId);
  const trainer: Trainer | undefined = course ? trainers.find((t) => t.id === course.instructorId) : undefined;

  const myEnrollment = learnerCourseEnrollments.find(
    (e) => e.learnerId === LEARNER_ID && e.courseId === courseId,
  );
  const isWishlisted = wishlistItems.some(
    (w) => w.learnerId === LEARNER_ID && w.courseId === courseId,
  );

  const [wishlisted, setWishlisted] = React.useState(isWishlisted);
  const [tab, setTab] = React.useState("overview");

  if (!course) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "catalog")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to catalog
        </Button>
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="Course not found"
          description="This course doesn't exist or has been removed."
          action={<Button onClick={() => navigate("candidate", "catalog")}>Browse catalog</Button>}
        />
      </div>
    );
  }

  function enroll() {
    if (myEnrollment) {
      navigate("candidate", `my-learning/${course!.id}`);
      return;
    }
    toast.success(`Enrolled in "${course!.name}"`, {
      description: `Added to My Learning · ${formatCurrency(course!.price, course!.currency)}`,
    });
    setTimeout(() => navigate("candidate", `my-learning/${course!.id}`), 800);
  }
  function toggleWishlist() {
    setWishlisted((v) => !v);
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  }
  function share() {
    toast.success("Course link copied to clipboard");
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "catalog")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Catalog
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="truncate font-medium">{course.name}</span>
      </div>

      <PageHeader
        title={course.name}
        description={course.description}
        actions={myEnrollment ? [
          { label: "Continue learning", icon: "Play", onClick: () => navigate("candidate", `my-learning/${course.id}`) },
        ] : []}
      />

      {/* Hero card */}
      <Card className="overflow-hidden">
        <div
          className="relative flex h-32 items-center justify-center sm:h-40"
          style={{ background: course.thumbnailColor }}
        >
          <span className="text-4xl font-bold text-white opacity-90 sm:text-5xl">
            {course.code}
          </span>
          {course.hasCertificate && (
            <Badge className="absolute right-3 top-3 bg-white/90 text-emerald-700 hover:bg-white/90">
              <Award className="mr-1 h-3 w-3" /> Certificate included
            </Badge>
          )}
        </div>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="secondary">{course.category}</Badge>
            <DifficultyBadge level={course.difficulty} />
            <StarRating value={course.rating} count={course.ratingCount} size="md" />
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" /> {formatNumber(course.enrollments)} enrolled
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" /> {durationLabel(course.durationMinutes)}
            </span>
            {course.hasCertificate && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> Verifiable certificate
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-6">
          <Card>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start overflow-x-auto rounded-b-none border-b bg-transparent p-0">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand">
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="m-0 p-4 sm:p-5">
                <div className="space-y-5">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">What you&apos;ll learn</h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {course.objectives.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prerequisites</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {course.prerequisites.length > 0 ? (
                          course.prerequisites.map((p, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                              <span>{p}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">No prerequisites — beginner friendly.</li>
                        )}
                      </ul>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills you&apos;ll gain</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {course.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Curriculum */}
              <TabsContent value="curriculum" className="m-0 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.modules.length} modules · {totalLessons} lessons</span>
                  <span>{durationLabel(course.durationMinutes)} total</span>
                </div>
                <Accordion type="multiple" defaultValue={course.modules.map((_, i) => `m-${i}`)}>
                  {course.modules.map((m, mi) => {
                    const moduleDuration = m.lessons.reduce((s, l) => s + l.durationMinutes, 0);
                    return (
                      <AccordionItem key={m.id} value={`m-${mi}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex flex-1 items-center justify-between pr-2 text-left">
                            <div>
                              <p className="text-sm font-medium">{m.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {m.lessons.length} lessons · {durationLabel(moduleDuration)}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1">
                            {m.lessons.map((l) => (
                              <li
                                key={l.id}
                                className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{lessonIcon(l.type)}</span>
                                  <span className="font-medium">{l.title}</span>
                                </span>
                                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="text-[10px] capitalize">{l.type}</Badge>
                                  {durationLabel(l.durationMinutes)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="m-0 p-4 sm:p-5">
                {course.materials.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="h-5 w-5" />}
                    title="No downloadable resources"
                    description="Resources are added by the instructor closer to the course start."
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

              {/* Reviews */}
              <TabsContent value="reviews" className="m-0 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{course.rating.toFixed(1)}</p>
                    <div className="flex justify-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(course.rating) ? "fill-amber-500 text-amber-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{course.ratingCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 78 : s === 4 ? 16 : s === 3 ? 4 : s === 2 ? 1 : 1;
                      return (
                        <div key={s} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-muted-foreground">{s}</span>
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ul className="space-y-3">
                  {MOCK_REVIEWS.map((r) => (
                    <li key={r.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={r.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{r.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{r.date}</span>
                              <span>·</span>
                              <span className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < r.rating ? "fill-amber-500 text-amber-500" : "text-muted"}`}
                                  />
                                ))}
                              </span>
                            </div>
                          </div>
                        </div>
                        {r.rating === 5 && (
                          <Badge variant="secondary" className="text-[10px]">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" /> Verified
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Instructor card */}
          {trainer && (
            <SectionCard title="Your instructor" description="Learn from an industry expert">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <AvatarLogo text={trainer.name} size="lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{trainer.name}</p>
                  <p className="text-xs text-muted-foreground">{trainer.expertise.join(" · ")}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {trainer.rating.toFixed(1)} rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {formatNumber(trainer.learnersTrained)} learners
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" /> {trainer.sessionsConducted} sessions
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{trainer.bio}</p>
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between text-lg">
                <span>{formatCurrency(course.price, course.currency)}</span>
                {course.hasCertificate && (
                  <span className="text-xs font-normal text-muted-foreground">
                    one-time
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Lifetime access · 30-day money-back guarantee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myEnrollment ? (
                <>
                  <div className="rounded-lg border bg-brand/5 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-brand">You're enrolled</span>
                      <StatusBadge status={myEnrollment.status} />
                    </div>
                    <Progress value={myEnrollment.progress} className="h-1.5" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {myEnrollment.progress}% complete
                    </p>
                  </div>
                  <Button className="w-full" onClick={enroll}>
                    <Play className="mr-1 h-4 w-4" /> Continue learning
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" onClick={enroll}>
                    <ShoppingCart className="mr-1 h-4 w-4" /> Enroll now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleWishlist}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                    {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
                  </Button>
                </>
              )}
              <Button variant="ghost" className="w-full" onClick={share}>
                <Share2 className="mr-1 h-4 w-4" /> Share course
              </Button>

              <div className="rounded-lg border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  This course includes
                </p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 text-muted-foreground" />
                    {durationLabel(course.durationMinutes)} on-demand video
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    {course.materials.length} downloadable resources
                  </li>
                  <li className="flex items-center gap-2">
                    <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                    {totalLessons} lessons across {course.modules.length} modules
                  </li>
                  {course.hasCertificate && (
                    <li className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-muted-foreground" />
                      Verifiable certificate of completion
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    Lifetime access on mobile & web
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    30-day money-back guarantee
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
