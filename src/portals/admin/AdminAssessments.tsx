"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { assessments } from "@/lib/mock-data";
import type { Assessment } from "@/lib/types";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

type Row = Assessment & { enabled: boolean; assignedCount: number; completionRate: number };

export function AdminAssessments() {
  const [rows, setRows] = React.useState<Row[]>(() => assessments.map((a) => ({
    ...a, enabled: true, assignedCount: Math.floor(Math.random() * 200) + 30, completionRate: 60 + Math.floor(Math.random() * 35),
  })));
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Row | null>(null);

  const filtered = rows.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    return true;
  });

  const toggleEnabled = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assessments"
        description="Manage assessment library, analytics, and availability."
        icon={<Icon name="ClipboardCheck" className="h-6 w-6" />}
        actions={[{ label: "Create assessment", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Assessments" value={rows.length} icon="ClipboardCheck" />
        <MiniStat label="Active" value={rows.filter((r) => r.enabled).length} icon="BadgeCheck" />
        <MiniStat label="Assigned (30d)" value={rows.reduce((s, r) => s + r.assignedCount, 0)} icon="Send" />
        <MiniStat label="Avg. completion" value={`${Math.round(rows.reduce((s, r) => s + r.completionRate, 0) / rows.length)}%`} icon="Percent" />
      </div>

      <SectionCard title={`Assessment library (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search assessments..."
          filters={
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="role_specific">Role-specific</SelectItem>
                <SelectItem value="psychometric">Psychometric</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[16rem]">{r.description}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.type.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{r.difficulty}</Badge></TableCell>
                  <TableCell className="text-sm">{r.questionsCount}</TableCell>
                  <TableCell className="text-sm">{r.durationMinutes}m</TableCell>
                  <TableCell className="text-sm">{r.assignedCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-brand" style={{ width: `${r.completionRate}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Switch checked={r.enabled} onCheckedChange={() => toggleEnabled(r.id)} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditTarget(r)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No assessments found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Results analytics" description="Aggregate completion and score distribution.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">Avg. score</p>
            <p className="mt-1 text-2xl font-semibold">72%</p>
            <p className="mt-1 text-xs text-emerald-600">+3pp vs last 30d</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">Median completion time</p>
            <p className="mt-1 text-2xl font-semibold">18m 24s</p>
            <p className="mt-1 text-xs text-muted-foreground">Across {rows.length} assessments</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">Drop-off rate</p>
            <p className="mt-1 text-2xl font-semibold">11%</p>
            <p className="mt-1 text-xs text-rose-600">+2pp vs last 30d</p>
          </div>
        </div>
      </SectionCard>

      <AssessmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create assessment"
        onSubmit={(data) => {
          const newRow: Row = { ...data, id: `as_${Date.now()}`, enabled: true, assignedCount: 0, completionRate: 0 };
          setRows((prev) => [newRow, ...prev]);
          toast.success("Assessment created", { description: `${data.name} added to library.` });
          setCreateOpen(false);
        }}
      />
      <AssessmentDialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        title="Edit assessment"
        initial={editTarget ?? undefined}
        onSubmit={(data) => {
          if (!editTarget) return;
          setRows((prev) => prev.map((r) => (r.id === editTarget.id ? { ...r, ...data } : r)));
          toast.success("Assessment updated");
          setEditTarget(null);
        }}
      />
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function AssessmentDialog({
  open, onOpenChange, title, onSubmit, initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  onSubmit: (data: Assessment) => void;
  initial?: Assessment;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [type, setType] = React.useState<Assessment["type"]>(initial?.type ?? "technical");
  const [difficulty, setDifficulty] = React.useState<Assessment["difficulty"]>(initial?.difficulty ?? "medium");
  const [duration, setDuration] = React.useState(initial?.durationMinutes ?? 30);
  const [questions, setQuestions] = React.useState(initial?.questionsCount ?? 10);
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [skills, setSkills] = React.useState((initial?.skillsAssessed ?? []).join(", "));

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setType(initial?.type ?? "technical");
      setDifficulty(initial?.difficulty ?? "medium");
      setDuration(initial?.durationMinutes ?? 30);
      setQuestions(initial?.questionsCount ?? 10);
      setDescription(initial?.description ?? "");
      setSkills((initial?.skillsAssessed ?? []).join(", "));
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure the assessment metadata. Questions are managed separately.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
          <div className="space-y-1.5"><Label htmlFor="as-name">Name</Label><Input id="as-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Assessment["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="aptitude">Aptitude</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="role_specific">Role-specific</SelectItem>
                  <SelectItem value="psychometric">Psychometric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Assessment["difficulty"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="as-dur">Duration (min)</Label><Input id="as-dur" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="as-q">Questions</Label><Input id="as-q" type="number" value={questions} onChange={(e) => setQuestions(parseInt(e.target.value) || 0)} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="as-skills">Skills assessed (comma-separated)</Label><Input id="as-skills" value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="as-desc">Description</Label><Textarea id="as-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Name is required"); return; }
            onSubmit({
              id: initial?.id ?? "",
              name: name.trim(),
              type,
              difficulty,
              durationMinutes: duration,
              questionsCount: questions,
              description: description.trim(),
              skillsAssessed: skills.split(",").map((s) => s.trim()).filter(Boolean),
            });
          }}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
