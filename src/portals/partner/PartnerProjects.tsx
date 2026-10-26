"use client";

import * as React from "react";
import { studentProjects as seedProjects } from "@/lib/partner-data";
import type { StudentProject } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { FolderGit2, Plus, Search, Star, Award, Calendar } from "lucide-react";

export function PartnerProjects() {
  const partner = CURRENT_PARTNER;
  const [projects] = React.useState<StudentProject[]>(seedProjects);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<StudentProject | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const filtered = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search && !`${p.title} ${p.studentName} ${p.company ?? ""} ${p.mentor ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const completed = projects.filter((p) => p.status === "completed" || p.status === "graded").length;
  const graded = projects.filter((p) => p.grade);

  function openProject(p: StudentProject) { setSelected(p); setSheetOpen(true); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Projects"
        description={`${partner.name} — track student projects, milestones, grades, and mentorship.`}
        icon={<Icon name="FolderGit2" className="h-6 w-6" />}
        actions={[{ label: "Create Project", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={projects.length} icon={<FolderGit2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Progress" value={inProgress} icon={<FolderGit2 className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<Award className="h-5 w-5" />} tone="success" />
        <StatCard label="Graded" value={graded.length} icon={<Star className="h-5 w-5" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="proposed">Proposed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No projects match your filters.</TableCell></TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openProject(p)}>
                  <TableCell className="font-medium text-sm max-w-[220px] truncate">{p.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={p.studentName} size="xs" />
                      <span className="text-xs">{p.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{p.category}</Badge></TableCell>
                  <TableCell className="text-xs">{p.company ?? "—"}</TableCell>
                  <TableCell className="text-xs">{p.mentor ?? "—"}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.startDate)}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell>{p.grade ? <span className="text-sm font-semibold text-brand">{p.grade}</span> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-brand" /> {selected.title}
                </SheetTitle>
                <SheetDescription>{selected.category} · {selected.studentName}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Status</p>
                    <div className="mt-1"><StatusBadge status={selected.status} /></div>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Grade</p>
                    <p className="mt-1 text-lg font-semibold text-brand">{selected.grade ?? "Pending"}</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Description</p>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Project Details</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Student:</span><span className="font-medium">{selected.studentName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Company:</span><span className="font-medium">{selected.company ?? "Independent"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span className="font-medium">{selected.category}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Mentor:</span><span className="font-medium">{selected.mentor ?? "Unassigned"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Start:</span><span className="font-medium">{formatDate(selected.startDate)}</span></div>
                    {selected.endDate && <div className="flex justify-between"><span className="text-muted-foreground">End:</span><span className="font-medium">{formatDate(selected.endDate)}</span></div>}
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Milestones</p>
                  <div className="space-y-2">
                    {["Proposal approved", "Mid-review completed", "Final submission", "Viva voce"].map((m, i) => {
                      const done = i < (selected.status === "completed" || selected.status === "graded" ? 4 : selected.status === "submitted" ? 3 : selected.status === "in_progress" ? 2 : 1);
                      return (
                        <div key={m} className="flex items-center gap-2">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className={`text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Opening project repository")}>View Repo</Button>
                {selected.status !== "graded" && selected.status !== "completed" && (
                  <Button size="sm" onClick={() => toast.success("Project graded", { description: `Grade assigned to ${selected.studentName}.` })}><Award className="mr-1.5 h-3.5 w-3.5" /> Assign Grade</Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>Create a new student project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Project created", { description: "Student project added." }); setAddOpen(false); }} className="space-y-3">
            <div className="space-y-1.5"><Label>Title *</Label><Input required placeholder="e.g. E-commerce Platform" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Student Name *</Label><Input required /></div>
              <div className="space-y-1.5"><Label>Category</Label><Input placeholder="Full-Stack" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Company</Label><Input /></div>
              <div className="space-y-1.5"><Label>Mentor</Label><Input /></div>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Input placeholder="Project description..." /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
