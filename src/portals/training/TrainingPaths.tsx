"use client";

import * as React from "react";
import { learningPaths, trainingCourses } from "@/lib/lms-data";
import type { LearningPath } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { formatNumber, formatDate } from "@/lib/format";
import { ThumbnailIcon, TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { Plus, Route, Clock, Users, CheckCircle2, BookOpen, X } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  onboarding: "Onboarding", compliance: "Compliance", career: "Career",
  skill: "Skill", certification: "Certification", program: "Program",
};

export function TrainingPaths() {
  const [paths, setPaths] = React.useState<LearningPath[]>(learningPaths);
  const [detail, setDetail] = React.useState<LearningPath | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Technology");
  const [newType, setNewType] = React.useState<LearningPath["type"]>("career");
  const [selectedCourses, setSelectedCourses] = React.useState<string[]>([]);

  const totalEnrolled = paths.reduce((s, p) => s + p.enrolledCount, 0);
  const avgCompletion = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.completionRate, 0) / paths.length) : 0;
  const mandatoryCount = paths.filter((p) => p.isMandatory).length;

  function addCourseToPath(courseId: string) {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses((s) => s.filter((c) => c !== courseId));
    } else {
      setSelectedCourses((s) => [...s, courseId]);
    }
  }

  function createPath() {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (selectedCourses.length === 0) {
      toast.error("Select at least one course");
      return;
    }
    const courses = selectedCourses.map((cid, i) => {
      const c = trainingCourses.find((tc) => tc.id === cid);
      return { courseId: cid, courseName: c?.name ?? "", isMandatory: i === 0, order: i + 1 };
    });
    const totalDur = selectedCourses.reduce((s, cid) => {
      const c = trainingCourses.find((tc) => tc.id === cid);
      return s + (c?.durationMinutes ?? 0);
    }, 0);
    const newPath: LearningPath = {
      id: `lp_new_${Date.now()}`,
      name: newName,
      description: newDesc,
      category: newCategory,
      courses,
      totalDurationMinutes: totalDur,
      enrolledCount: 0,
      completionRate: 0,
      isMandatory: false,
      skills: [],
      type: newType,
      thumbnailColor: "oklch(0.55 0.13 165)",
      thumbnailIcon: "Route",
    };
    setPaths((p) => [newPath, ...p]);
    setAddOpen(false);
    setNewName(""); setNewDesc(""); setSelectedCourses([]);
    toast.success(`Learning path created — ${newName}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Learning Paths"
        description="Bundle courses into sequenced career, onboarding, or compliance tracks."
        icon={<Icon name="Route" className="h-6 w-6" />}
        actions={[{ label: "Create path", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Paths" value={paths.length} icon={<Route className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Enrolled" value={formatNumber(totalEnrolled)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Mandatory" value={mandatoryCount} icon={<BookOpen className="h-5 w-5" />} tone="warning" />
      </div>

      {paths.length === 0 ? (
        <EmptyState icon={<Route className="h-5 w-5" />} title="No learning paths" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => setDetail(p)}
              className="text-left rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <ThumbnailIcon color={p.thumbnailColor} icon={p.thumbnailIcon} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[p.type]}</Badge>
                    {p.isMandatory && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">Mandatory</Badge>}
                  </div>
                  <h3 className="font-semibold leading-tight">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                <div className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-muted-foreground" />{p.courses.length} courses</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" />{durationLabel(p.totalDurationMinutes)}</div>
                <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" />{formatNumber(p.enrolledCount)}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Progress value={p.completionRate} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">{p.completionRate}%</span>
              </div>
              {p.deadline && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">Deadline: {formatDate(p.deadline)}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {p.skills.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  <ThumbnailIcon color={detail.thumbnailColor} icon={detail.thumbnailIcon} size="lg" />
                  <div>
                    <SheetTitle className="text-lg leading-tight">{detail.name}</SheetTitle>
                    <SheetDescription>{detail.category} · {TYPE_LABELS[detail.type]}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">{detail.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Courses</p>
                    <p className="text-sm font-semibold">{detail.courses.length}</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
                    <p className="text-sm font-semibold">{durationLabel(detail.totalDurationMinutes)}</p>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Completion</p>
                    <p className="text-sm font-semibold">{detail.completionRate}%</p>
                  </div>
                </div>
                <SectionCard title="Course Sequence">
                  <ol className="space-y-2">
                    {detail.courses.map((c) => (
                      <li key={c.courseId} className="flex items-center gap-3 rounded-lg border p-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{c.order}</span>
                        <span className="flex-1 text-sm truncate">{c.courseName}</span>
                        {c.isMandatory && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">Required</Badge>}
                      </li>
                    ))}
                  </ol>
                </SectionCard>
                <SectionCard title="Skills Gained">
                  <div className="flex flex-wrap gap-1.5">
                    {detail.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                  </div>
                </SectionCard>
                <Button className="w-full" onClick={() => toast.info(`Assigning path: ${detail.name}`)}>Assign to learners</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Learning Path</DialogTitle>
            <DialogDescription>Bundle courses into a sequenced learning track.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lp-name">Path name *</Label>
              <Input id="lp-name" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lp-desc">Description</Label>
              <Textarea id="lp-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="mt-1 min-h-[60px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Technology", "Leadership", "Compliance", "Sales", "Data & AI"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as LearningPath["type"])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Select courses (in order)</Label>
              <div className="mt-2 max-h-60 overflow-y-auto scroll-thin space-y-1.5 rounded-lg border p-2">
                {trainingCourses.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(c.id)}
                      onChange={() => addCourseToPath(c.id)}
                      className="h-4 w-4 rounded border-border accent-brand"
                    />
                    <span className="text-sm flex-1 truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{durationLabel(c.durationMinutes)}</span>
                  </label>
                ))}
              </div>
              {selectedCourses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedCourses.map((cid, i) => {
                    const c = trainingCourses.find((tc) => tc.id === cid);
                    return (
                      <Badge key={cid} variant="secondary" className="gap-1">
                        {i + 1}. {c?.name.slice(0, 25) ?? cid}
                        <button onClick={() => addCourseToPath(cid)}><X className="h-3 w-3" /></button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={createPath}>Create path</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
