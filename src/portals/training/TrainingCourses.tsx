"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses, draftCourses, trainers } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { ThumbnailIcon, TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { Plus, Search, BookOpen, Star, Clock, Users, Award, Layers } from "lucide-react";

const CATEGORIES = ["Technology", "Leadership", "Compliance", "Sales", "Data & AI"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"];

export function TrainingCourses() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [difficulty, setDifficulty] = React.useState("all");
  const [detail, setDetail] = React.useState<TrainingCourse | null>(null);

  const allCourses = [...trainingCourses, ...draftCourses];
  const tabFiltered = tab === "published" ? trainingCourses.filter((c) => c.status === "published")
    : tab === "draft" ? draftCourses
    : allCourses;

  const filtered = tabFiltered.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || c.category === category;
    const matchDiff = difficulty === "all" || c.difficulty === difficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const totalEnroll = trainingCourses.reduce((s, c) => s + c.enrollments, 0);
  const avgRating = trainingCourses.length > 0 ? (trainingCourses.reduce((s, c) => s + c.rating, 0) / trainingCourses.length).toFixed(2) : "0";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Catalog"
        description="Manage your published and draft training courses."
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[
          { label: "Course Builder", icon: "Plus", onClick: () => navigate("training", "course-builder") },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published" value={trainingCourses.length} icon={<BookOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Drafts" value={draftCourses.length} icon={<Layers className="h-5 w-5" />} />
        <StatCard label="Total Enrollments" value={formatNumber(totalEnroll)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="warning" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({allCourses.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({trainingCourses.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<BookOpen className="h-5 w-5" />} title="No courses found" description="Adjust filters or build a new course." action={<Button onClick={() => navigate("training", "course-builder")}><Plus className="mr-1 h-4 w-4" />Create course</Button>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setDetail(c)}
                  className="text-left rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <ThumbnailIcon color={c.thumbnailColor} icon={c.thumbnailIcon} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[10px] text-muted-foreground">{c.code}</span>
                        <StatusBadge status={c.status === "published" ? "published" : "draft"} />
                      </div>
                      <h3 className="font-semibold leading-tight line-clamp-2">{c.name}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">{c.difficulty}</Badge>
                    {c.hasCertificate && <Badge variant="outline" className="text-[10px] text-brand border-brand/30">Certificate</Badge>}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" />{durationLabel(c.durationMinutes)}</div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" />{formatNumber(c.enrollments)}</div>
                    <div className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{c.rating > 0 ? c.rating.toFixed(1) : "—"}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t pt-2">
                    <span className="text-xs text-muted-foreground truncate">{c.instructorName}</span>
                    <span className="text-sm font-semibold text-brand">{c.price > 0 ? formatCurrency(c.price) : "Free"}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Course detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <CourseDetail course={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CourseDetail({ course }: { course: TrainingCourse }) {
  const trainer = trainers.find((t) => t.id === course.instructorId);
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <ThumbnailIcon color={course.thumbnailColor} icon={course.thumbnailIcon} size="lg" />
          <div>
            <SheetTitle className="text-lg leading-tight">{course.name}</SheetTitle>
            <SheetDescription>{course.code} · {course.category} · <span className="capitalize">{course.difficulty}</span></SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Enrollments</p>
            <p className="text-sm font-semibold">{formatNumber(course.enrollments)}</p>
          </div>
          <div className="rounded-lg border p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Completion</p>
            <p className="text-sm font-semibold">{course.completionRate}%</p>
          </div>
          <div className="rounded-lg border p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Avg Score</p>
            <p className="text-sm font-semibold">{course.avgScore}</p>
          </div>
        </div>

        <SectionCard title="Overview">
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </SectionCard>

        <SectionCard title="Learning Objectives">
          <ul className="space-y-1.5">
            {course.objectives.length === 0 ? <p className="text-sm text-muted-foreground">No objectives defined.</p> :
              course.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Award className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
          </ul>
        </SectionCard>

        <SectionCard title={`Curriculum (${course.modules.length} modules · ${totalLessons} lessons)`}>
          <div className="space-y-3 max-h-72 overflow-y-auto scroll-thin">
            {course.modules.length === 0 ? <p className="text-sm text-muted-foreground">No modules yet.</p> :
              course.modules.map((m) => (
                <div key={m.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{m.order}. {m.title}</p>
                    <span className="text-xs text-muted-foreground">{m.lessons.length} lessons</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="h-1 w-1 rounded-full bg-brand" />
                          {l.title}
                        </span>
                        <span className="text-muted-foreground shrink-0 ml-2">{durationLabel(l.durationMinutes)} · {l.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </SectionCard>

        <SectionCard title="Prerequisites">
          {course.prerequisites.length === 0 ? <p className="text-sm text-muted-foreground">No prerequisites.</p> :
            <ul className="space-y-1">
              {course.prerequisites.map((p, i) => <li key={i} className="text-sm">• {p}</li>)}
            </ul>}
        </SectionCard>

        <SectionCard title="Materials">
          {course.materials.length === 0 ? <p className="text-sm text-muted-foreground">No materials.</p> :
            <ul className="space-y-1">
              {course.materials.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <span>{m.title}</span>
                  <Badge variant="outline" className="capitalize">{m.type}</Badge>
                </li>
              ))}
            </ul>}
        </SectionCard>

        {trainer && (
          <SectionCard title="Instructor">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full" style={{ background: trainer.avatarColor }} />
              <div>
                <p className="text-sm font-medium">{trainer.name}</p>
                <p className="text-xs text-muted-foreground">{trainer.expertise.slice(0, 3).join(" · ")}</p>
              </div>
            </div>
          </SectionCard>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {formatDate(course.updatedAt)}</span>
          <span>v{course.version}</span>
        </div>
      </div>
    </>
  );
}
