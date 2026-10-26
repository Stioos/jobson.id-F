"use client";

import * as React from "react";
import {
  LayoutTemplate, Plus, GripVertical, Trash2, ChevronDown, ChevronRight, Clock, BookOpen, FileText, Award, Link2, Eye, History, ArrowUp, ArrowDown, Video,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, Card, CardContent, CardHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "reading" | "assessment";
  outcome: string;
}
interface Module {
  id: string;
  title: string;
  duration: number;
  lessons: Lesson[];
  outcomes: string[];
  prerequisite?: string | null;
}
interface VersionEntry { version: string; date: string; by: string; note: string; }
interface Course {
  id: string;
  name: string;
  modules: Module[];
}

const COURSES: Course[] = [
  {
    id: "cr1", name: "Full-Stack Web Development",
    modules: [
      {
        id: "m1", title: "Foundations of JavaScript", duration: 180, prerequisite: null,
        outcomes: ["Write ES6+ syntax fluently", "Understand async/await and Promises", "Manipulate DOM with vanilla JS"],
        lessons: [
          { id: "l1", title: "Variables, Types & Operators", duration: 35, type: "video", outcome: "Write ES6+ syntax fluently" },
          { id: "l2", title: "Functions & Scope", duration: 40, type: "video", outcome: "Write ES6+ syntax fluently" },
          { id: "l3", title: "Async Patterns Quiz", duration: 25, type: "assessment", outcome: "Understand async/await and Promises" },
        ],
      },
      {
        id: "m2", title: "React Fundamentals", duration: 240, prerequisite: "m1",
        outcomes: ["Build component-based UIs", "Manage state with hooks", "Handle user events"],
        lessons: [
          { id: "l4", title: "Components & Props", duration: 45, type: "video", outcome: "Build component-based UIs" },
          { id: "l5", title: "useState & useEffect", duration: 50, type: "video", outcome: "Manage state with hooks" },
          { id: "l6", title: "Event Handling Lab", duration: 35, type: "reading", outcome: "Handle user events" },
        ],
      },
      {
        id: "m3", title: "Backend with Node.js", duration: 210, prerequisite: "m2",
        outcomes: ["Build REST APIs", "Connect to PostgreSQL", "Implement JWT auth"],
        lessons: [
          { id: "l7", title: "Express Basics", duration: 40, type: "video", outcome: "Build REST APIs" },
          { id: "l8", title: "Database Integration", duration: 55, type: "video", outcome: "Connect to PostgreSQL" },
          { id: "l9", title: "Auth Implementation", duration: 45, type: "assessment", outcome: "Implement JWT auth" },
        ],
      },
      {
        id: "m4", title: "Deployment & DevOps", duration: 150, prerequisite: "m3",
        outcomes: ["Dockerize applications", "Deploy to AWS", "Set up CI/CD pipelines"],
        lessons: [
          { id: "l10", title: "Docker Fundamentals", duration: 45, type: "video", outcome: "Dockerize applications" },
          { id: "l11", title: "AWS Deployment", duration: 50, type: "video", outcome: "Deploy to AWS" },
          { id: "l12", title: "CI/CD Pipeline Project", duration: 55, type: "assessment", outcome: "Set up CI/CD pipelines" },
        ],
      },
    ],
  },
  { id: "cr2", name: "Data Science with Python", modules: [] },
  { id: "cr3", name: "DevOps Engineering Bootcamp", modules: [] },
];

const VERSIONS: VersionEntry[] = [
  { version: "v2.4.0", date: "2024-10-25", by: "Sara (Instructional Designer)", note: "Added Deployment & DevOps module; reordered lessons in React Fundamentals" },
  { version: "v2.3.1", date: "2024-09-18", by: "Amit (Trainer)", note: "Updated auth implementation lab with JWT refresh tokens" },
  { version: "v2.3.0", date: "2024-08-30", by: "Sara (Instructional Designer)", note: "Split Backend module into 3 lessons; added prerequisite linking" },
  { version: "v2.2.0", date: "2024-07-15", by: "Sara (Instructional Designer)", note: "Initial React Fundamentals module added" },
];

const LESSON_ICONS = { video: Video, reading: FileText, assessment: Award } as const;

function durationLabel(mins: number) {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60); const m = mins % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function TrainingCurriculumDesigner() {
  const [courseId, setCourseId] = React.useState(COURSES[0].id);
  const [course, setCourse] = React.useState<Course>(COURSES[0]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({ m1: true });
  const [previewMode, setPreviewMode] = React.useState(false);
  const [addModuleOpen, setAddModuleOpen] = React.useState(false);
  const [addLessonFor, setAddLessonFor] = React.useState<string | null>(null);
  const [newModule, setNewModule] = React.useState({ title: "", duration: 60 });
  const [newLesson, setNewLesson] = React.useState({ title: "", duration: 30, type: "video" as Lesson["type"], outcome: "" });

  React.useEffect(() => {
    const c = COURSES.find((x) => x.id === courseId);
    if (c) setCourse(JSON.parse(JSON.stringify(c)));
  }, [courseId]);

  const totalDuration = course.modules.reduce((s, m) => s + m.duration, 0);
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalOutcomes = course.modules.reduce((s, m) => s + m.outcomes.length, 0);

  function moveModule(idx: number, dir: -1 | 1) {
    setCourse((c) => {
      const arr = [...c.modules];
      const ni = idx + dir;
      if (ni < 0 || ni >= arr.length) return c;
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
      return { ...c, modules: arr };
    });
    toast.info("Module reordered (visual only)");
  }

  function toggleModule(id: string) { setExpanded((p) => ({ ...p, [id]: !p[id] })); }

  function addModule() {
    if (!newModule.title.trim()) { toast.error("Module title required"); return; }
    const m: Module = { id: `m_${Date.now()}`, title: newModule.title, duration: newModule.duration, lessons: [], outcomes: [], prerequisite: course.modules.length > 0 ? course.modules[course.modules.length - 1].id : null };
    setCourse((c) => ({ ...c, modules: [...c.modules, m] }));
    setNewModule({ title: "", duration: 60 });
    setAddModuleOpen(false);
    toast.success("Module added", { description: m.title });
  }

  function addLesson() {
    if (!addLessonFor || !newLesson.title.trim()) { toast.error("Lesson title required"); return; }
    const l: Lesson = { id: `l_${Date.now()}`, title: newLesson.title, duration: newLesson.duration, type: newLesson.type, outcome: newLesson.outcome || "—" };
    setCourse((c) => ({
      ...c,
      modules: c.modules.map((m) => m.id === addLessonFor ? { ...m, lessons: [...m.lessons, l], duration: m.duration + l.duration } : m),
    }));
    setNewLesson({ title: "", duration: 30, type: "video", outcome: "" });
    setAddLessonFor(null);
    toast.success("Lesson added");
  }

  function removeModule(id: string) {
    setCourse((c) => ({ ...c, modules: c.modules.map((m) => m.prerequisite === id ? { ...m, prerequisite: null } : m).filter((m) => m.id !== id) }));
    toast.info("Module removed");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Designer"
        description="Visual builder for course curriculum: modules → lessons → assessments. Reorder visually, link prerequisites, align learning outcomes, and track versions."
        icon={<Icon name="LayoutTemplate" className="h-6 w-6" />}
        actions={[
          { label: "Version history", icon: "History", variant: "outline", onClick: () => document.getElementById("versions")?.scrollIntoView({ behavior: "smooth" }) },
          { label: previewMode ? "Exit preview" : "Preview as student", icon: "Eye", variant: previewMode ? "default" : "outline", onClick: () => { setPreviewMode((p) => !p); toast.info(previewMode ? "Back to editor view" : "Student preview mode"); } },
          { label: "Publish", onClick: () => toast.success("Curriculum published", { description: `v2.5.0 of ${course.name}` }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Modules" value={course.modules.length} icon={<LayoutTemplate className="h-5 w-5" />} tone="brand" />
        <StatCard label="Lessons" value={totalLessons} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Learning outcomes" value={totalOutcomes} icon={<Award className="h-5 w-5" />} tone="success" />
        <StatCard label="Total duration" value={durationLabel(totalDuration)} icon={<Clock className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Select course to design"
        description="Switch course to edit its curriculum"
        action={
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {COURSES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      >
        {previewMode ? (
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-4">
            <p className="text-sm font-semibold text-brand mb-3">Student preview — {course.name}</p>
            <div className="space-y-3">
              {course.modules.map((m, i) => (
                <div key={m.id} className="rounded-lg border bg-card p-3">
                  <p className="font-medium text-sm">Module {i + 1}: {m.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{durationLabel(m.duration)} · {m.lessons.length} lessons</p>
                  <ul className="space-y-1 ml-4">
                    {m.lessons.map((l) => {
                      const I = LESSON_ICONS[l.type];
                      return <li key={l.id} className="text-xs flex items-center gap-2"><I className="h-3.5 w-3.5 text-muted-foreground" />{l.title} <span className="text-muted-foreground">· {durationLabel(l.duration)}</span></li>;
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Drag handles to reorder modules (visual only). Click a module to expand lessons.</div>
        )}
      </SectionCard>

      {!previewMode && (
        <SectionCard
          title="Curriculum tree"
          description="Modules → Lessons → Assessments with prerequisite linking"
          action={<Button size="sm" onClick={() => setAddModuleOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add module</Button>}
        >
          {course.modules.length === 0 ? (
            <EmptyState icon={<LayoutTemplate className="h-5 w-5" />} title="No modules yet" description="Add your first module to start building the curriculum." action={<Button size="sm" onClick={() => setAddModuleOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add module</Button>} />
          ) : (
            <div className="space-y-3">
              {course.modules.map((m, idx) => {
                const isOpen = !!expanded[m.id];
                const prereq = m.prerequisite ? course.modules.find((x) => x.id === m.prerequisite) : null;
                return (
                  <Card key={m.id}>
                    <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-grab" />
                        <button className="flex items-center gap-2 flex-1 min-w-0 text-left" onClick={() => toggleModule(m.id)}>
                          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">Module {idx + 1}: {m.title}</p>
                            <p className="text-xs text-muted-foreground">{durationLabel(m.duration)} · {m.lessons.length} lessons · {m.outcomes.length} outcomes</p>
                          </div>
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => moveModule(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => moveModule(idx, 1)} disabled={idx === course.modules.length - 1}><ArrowDown className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => removeModule(m.id)}><Trash2 className="h-3.5 w-3.5 text-rose-600" /></Button>
                      </div>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="pt-0">
                        {prereq && (
                          <div className="mb-3 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                            <Link2 className="h-3.5 w-3.5" />
                            Prerequisite: <span className="font-medium">{prereq.title}</span>
                          </div>
                        )}
                        <div className="grid gap-3 lg:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Lessons</p>
                            <div className="space-y-1.5">
                              {m.lessons.length === 0 ? <p className="text-xs text-muted-foreground">No lessons yet.</p> : m.lessons.map((l) => {
                                const I = LESSON_ICONS[l.type];
                                return (
                                  <div key={l.id} className="flex items-center gap-2 rounded-md border p-2 text-xs">
                                    <I className="h-3.5 w-3.5 text-brand shrink-0" />
                                    <span className="flex-1 truncate">{l.title}</span>
                                    <Badge variant="outline" className="text-[10px]">{l.type}</Badge>
                                    <span className="text-muted-foreground">{durationLabel(l.duration)}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => setAddLessonFor(m.id)}><Plus className="mr-1 h-3 w-3" /> Add lesson</Button>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Learning outcomes & alignment</p>
                            <div className="space-y-1.5">
                              {m.outcomes.length === 0 ? <p className="text-xs text-muted-foreground">No outcomes defined.</p> : m.outcomes.map((o, i) => {
                                const aligned = m.lessons.filter((l) => l.outcome === o).length;
                                return (
                                  <div key={i} className="rounded-md border p-2 text-xs">
                                    <p className="font-medium">{o}</p>
                                    <Badge variant="outline" className={`mt-1 text-[10px] ${aligned > 0 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"}`}>
                                      {aligned > 0 ? `${aligned} lesson${aligned > 1 ? "s" : ""} aligned` : "No lessons aligned"}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard id="versions" title="Version history" description="Track every published curriculum version">
        <div className="space-y-2">
          {VERSIONS.map((v) => (
            <div key={v.version} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand"><History className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{v.version}</p>
                  <Badge variant="outline" className="text-[10px]">{v.date}</Badge>
                  <span className="text-xs text-muted-foreground">· {v.by}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{v.note}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Restoring version", { description: `${v.version}` })}>Restore</Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={addModuleOpen} onOpenChange={setAddModuleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add new module</DialogTitle><DialogDescription>Create a new module at the end of the curriculum</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label htmlFor="m-title">Module title *</Label><Input id="m-title" value={newModule.title} onChange={(e) => setNewModule((p) => ({ ...p, title: e.target.value }))} className="mt-1" placeholder="e.g. Advanced State Management" /></div>
            <div><Label htmlFor="m-dur">Duration (minutes)</Label><Input id="m-dur" type="number" value={newModule.duration} onChange={(e) => setNewModule((p) => ({ ...p, duration: Number(e.target.value) }))} className="mt-1" /></div>
            <div>
              <Label>Prerequisite (optional)</Label>
              <Select value={course.modules.length > 0 ? course.modules[course.modules.length - 1].id : "none"} onValueChange={() => {}}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No prerequisite</SelectItem>
                  {course.modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={addModule}>Add module</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addLessonFor} onOpenChange={(o) => !o && setAddLessonFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add lesson</DialogTitle><DialogDescription>Add a new lesson to this module</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label htmlFor="l-title">Lesson title *</Label><Input id="l-title" value={newLesson.title} onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="l-dur">Duration (min)</Label><Input id="l-dur" type="number" value={newLesson.duration} onChange={(e) => setNewLesson((p) => ({ ...p, duration: Number(e.target.value) }))} className="mt-1" /></div>
              <div><Label>Type</Label>
                <Select value={newLesson.type} onValueChange={(v) => setNewLesson((p) => ({ ...p, type: v as Lesson["type"] }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="video">Video</SelectItem><SelectItem value="reading">Reading</SelectItem><SelectItem value="assessment">Assessment</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label htmlFor="l-out">Aligned outcome (optional)</Label><Input id="l-out" value={newLesson.outcome} onChange={(e) => setNewLesson((p) => ({ ...p, outcome: e.target.value }))} className="mt-1" placeholder="e.g. Build component-based UIs" /></div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={addLesson}>Add lesson</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
