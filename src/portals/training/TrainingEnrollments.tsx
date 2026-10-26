"use client";

import * as React from "react";
import { learnerEnrollments, trainingCourses, corporateClients } from "@/lib/lms-data";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatDate, formatNumber } from "@/lib/format";
import { TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { Plus, Search, UserCheck, Download, Clock, CheckCircle2 } from "lucide-react";

export function TrainingEnrollments() {
  const [rows, setRows] = React.useState(learnerEnrollments);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignCourse, setAssignCourse] = React.useState(trainingCourses[0]?.id ?? "");
  const [selectedLearners, setSelectedLearners] = React.useState<string[]>([]);

  const learners = Array.from(new Set(learnerEnrollments.map((e) => e.learnerName))).map((name, i) => ({ id: `l_${i}`, name }));

  const filtered = rows.filter((e) => {
    const matchSearch = e.learnerName.toLowerCase().includes(search.toLowerCase()) || e.courseName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchClient = clientFilter === "all" || e.clientId === clientFilter;
    const matchCourse = courseFilter === "all" || e.courseId === courseFilter;
    return matchSearch && matchStatus && matchClient && matchCourse;
  });

  const totalEnrolled = rows.length;
  const inProgress = rows.filter((e) => e.status === "in_progress").length;
  const completed = rows.filter((e) => e.status === "completed" || e.status === "certified").length;
  const overdue = rows.filter((e) => e.status === "overdue").length;

  function toggleLearner(id: string) {
    setSelectedLearners((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function bulkAssign() {
    if (selectedLearners.length === 0) {
      toast.error("Select at least one learner");
      return;
    }
    const course = trainingCourses.find((c) => c.id === assignCourse);
    const newEnrollments = selectedLearners.map((id, i) => {
      const learner = learners.find((l) => l.id === id);
      return {
        id: `le_new_${Date.now()}_${i}`,
        learnerId: id,
        learnerName: learner?.name ?? "Unknown",
        courseId: assignCourse,
        courseName: course?.name ?? "",
        progress: 0,
        status: "in_progress" as const,
        enrolledDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        timeSpentMinutes: 0,
        assignedBy: "Divya Sharma",
        clientId: corporateClients[0]?.id,
        clientName: corporateClients[0]?.name,
      };
    });
    setRows((r) => [...newEnrollments, ...r]);
    setAssignOpen(false);
    setSelectedLearners([]);
    toast.success(`Assigned ${selectedLearners.length} learner(s) to ${course?.name ?? "course"}`);
  }

  function exportCsv() {
    toast.success("CSV exported", { description: `${filtered.length} enrollment(s)` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Learner Enrollments"
        description="Track individual learner progress across courses and clients."
        icon={<Icon name="UserCheck" className="h-6 w-6" />}
        actions={[
          { label: "Export CSV", icon: "Download", variant: "outline", onClick: exportCsv },
          { label: "Bulk assign", icon: "Plus", onClick: () => setAssignOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Enrollments" value={totalEnrolled} icon={<UserCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Progress" value={inProgress} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Overdue" value={overdue} icon={<Clock className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search learner or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="certified">Certified</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Course" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<UserCheck className="h-5 w-5" />} title="No enrollments found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="min-w-[120px]">Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Time Spent</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Assigned By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={e.learnerName} size="xs" />
                        <span className="text-sm font-medium">{e.learnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">{e.courseName}</TableCell>
                    <TableCell className="text-sm">{e.clientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={e.progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{e.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(e.enrolledDate)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.dueDate ? formatDate(e.dueDate) : "—"}</TableCell>
                    <TableCell className="text-right text-sm">{durationLabel(e.timeSpentMinutes)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{e.score ? `${e.score}%` : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.assignedBy ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Assign Course</DialogTitle>
            <DialogDescription>Select a course and target learners.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Course</Label>
              <Select value={assignCourse} onValueChange={setAssignCourse}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select learners ({selectedLearners.length} selected)</Label>
              <div className="mt-2 max-h-60 overflow-y-auto scroll-thin space-y-1.5 rounded-lg border p-2">
                {learners.map((l) => (
                  <label key={l.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/40 cursor-pointer">
                    <Checkbox checked={selectedLearners.includes(l.id)} onCheckedChange={() => toggleLearner(l.id)} />
                    <AvatarLogo text={l.name} size="xs" />
                    <span className="text-sm">{l.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedLearners(learners.map((l) => l.id))}>Select all</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedLearners([])}>Clear</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={bulkAssign}>Assign to {selectedLearners.length} learner(s)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
