"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { learnerEnrollments, certificates, trainingCompany } from "@/lib/lms-data";
import type { LearnerEnrollment } from "@/lib/types";
import {
  Search, Download, Users, CheckCircle2, Award, AlertTriangle,
  Clock, Star, ExternalLink, Calendar, GraduationCap, FileText, User,
} from "lucide-react";

const CLIENT_ID = "cc_001";
const enrollments = learnerEnrollments.filter((e) => e.clientId === CLIENT_ID);

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "certified", label: "Certified" },
  { value: "overdue", label: "Overdue" },
];

export function EmployerEmployeeLearning() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<LearnerEnrollment | null>(null);

  const courses = Array.from(new Set(enrollments.map((e) => e.courseName)));

  const filtered = React.useMemo(() => {
    return enrollments.filter((e) => {
      const matchSearch = e.learnerName.toLowerCase().includes(search.toLowerCase()) ||
        e.courseName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      const matchCourse = courseFilter === "all" || e.courseName === courseFilter;
      return matchSearch && matchStatus && matchCourse;
    });
  }, [search, statusFilter, courseFilter]);

  const totalEnrolled = enrollments.length;
  const completionRate = totalEnrolled > 0
    ? Math.round((enrollments.filter((e) => e.status === "completed" || e.status === "certified").length / totalEnrolled) * 100)
    : 0;
  const scored = enrollments.filter((e) => typeof e.score === "number");
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, e) => s + (e.score ?? 0), 0) / scored.length)
    : 0;
  const overdueCount = enrollments.filter((e) => e.status === "overdue").length;

  function exportCsv() {
    const rows = [
      ["Employee", "Course", "Status", "Progress", "Score", "Enrolled", "Due", "Completed", "Time (min)", "Assigned by"],
      ...filtered.map((e) => [
        e.learnerName,
        e.courseName,
        e.status,
        `${e.progress}%`,
        e.score?.toString() ?? "",
        formatDate(e.enrolledDate),
        e.dueDate ? formatDate(e.dueDate) : "",
        e.completedDate ? formatDate(e.completedDate) : "",
        e.timeSpentMinutes.toString(),
        e.assignedBy ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    toast.success("CSV exported", { description: `${csv.length} bytes · ${filtered.length} rows (demo)` });
  }

  const learnerCerts = selected
    ? certificates.filter((c) => c.learnerId === selected.learnerId)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Learning Tracker"
        description={`Track learning progress & certifications across ${enrollments.length} TechCorp enrollments`}
        actions={[
          { label: "Export CSV", icon: "Download", variant: "outline", onClick: exportCsv },
        ]}
      />

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total enrolled" value={totalEnrolled} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completion rate" value={`${completionRate}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg score" value={avgScore ? `${avgScore}%` : "—"} icon={<Award className="h-5 w-5" />} tone="brand" hint={`${scored.length} scored`} />
        <StatCard label="Overdue" value={overdueCount} icon={<AlertTriangle className="h-5 w-5" />} tone={overdueCount > 0 ? "danger" : "default"} />
      </div>

      {/* Filters */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employee or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} records</Badge>
        </div>
      </Card>

      {/* Enrollments table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No matching enrollments" description="Adjust filters or search terms." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="w-[140px]">Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Assigned by</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => {
                  const due = e.dueDate ? daysUntil(e.dueDate) : null;
                  const isOverdue = e.status === "overdue" || (e.status === "in_progress" && due !== null && due < 0);
                  return (
                    <TableRow
                      key={e.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setSelected(e)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={e.learnerName} size="xs" />
                          <span className="text-sm font-medium">{e.learnerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">{e.courseName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={e.progress} className="h-1.5 w-20" />
                          <span className="text-xs tabular-nums">{e.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={e.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(e.enrolledDate)}</TableCell>
                      <TableCell className="text-sm">
                        {e.dueDate ? (
                          <span className={isOverdue ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>
                            {formatDate(e.dueDate)}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.completedDate ? formatDate(e.completedDate) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-right tabular-nums">
                        {e.timeSpentMinutes > 0 ? `${Math.round(e.timeSpentMinutes / 60)}h` : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {typeof e.score === "number" ? (
                          <span className={`font-medium ${e.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : e.score >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {e.score}%
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.assignedBy ?? "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto scroll-thin">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selected.learnerName}</SheetTitle>
                <SheetDescription className="text-left">
                  {selected.courseName} · Enrolled {formatDate(selected.enrolledDate)}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-5">
                {/* Status row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={selected.status} />
                  {typeof selected.score === "number" && (
                    <Badge variant="outline" className="bg-brand/5 text-brand border-brand/20">
                      <Star className="mr-1 h-3 w-3" /> Score: {selected.score}%
                    </Badge>
                  )}
                  {selected.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="mr-1 h-3 w-3" /> Due {formatDate(selected.dueDate)}
                    </Badge>
                  )}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course progress</span>
                    <span className="font-medium tabular-nums">{selected.progress}%</span>
                  </div>
                  <Progress value={selected.progress} className="mt-1.5 h-2" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Time spent</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selected.timeSpentMinutes > 0 ? `${Math.round(selected.timeSpentMinutes / 60)}h ${selected.timeSpentMinutes % 60}m` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="mt-1 text-sm font-semibold">{selected.score ? `${selected.score}%` : "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Assigned by</p>
                    <p className="mt-1 text-sm font-medium">{selected.assignedBy ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="mt-1 text-sm font-medium">
                      {selected.completedDate ? formatDate(selected.completedDate) : "—"}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" /> Activity timeline
                  </h4>
                  <div className="space-y-3">
                    <TimelineItem
                      icon={<GraduationCap className="h-3.5 w-3.5" />}
                      title="Enrolled"
                      date={selected.enrolledDate}
                      description={`Assigned by ${selected.assignedBy ?? "self"}`}
                      tone="brand"
                    />
                    {selected.progress > 0 && (
                      <TimelineItem
                        icon={<Clock className="h-3.5 w-3.5" />}
                        title="Started learning"
                        date={selected.enrolledDate}
                        description={`${selected.timeSpentMinutes} minutes spent`}
                        tone="default"
                      />
                    )}
                    {selected.progress >= 50 && (
                      <TimelineItem
                        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        title="Reached 50% milestone"
                        date={selected.enrolledDate}
                        description="Halfway through the course"
                        tone="default"
                      />
                    )}
                    {(selected.status === "completed" || selected.status === "certified") && selected.completedDate && (
                      <TimelineItem
                        icon={<Award className="h-3.5 w-3.5" />}
                        title={selected.status === "certified" ? "Certified" : "Completed"}
                        date={selected.completedDate}
                        description={`Final score: ${selected.score ?? "—"}%`}
                        tone="success"
                      />
                    )}
                    {selected.status === "overdue" && selected.dueDate && (
                      <TimelineItem
                        icon={<AlertTriangle className="h-3.5 w-3.5" />}
                        title="Overdue"
                        date={selected.dueDate}
                        description="Past due date — escalation needed"
                        tone="danger"
                      />
                    )}
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-muted-foreground" /> Certificates
                  </h4>
                  {learnerCerts.length === 0 ? (
                    <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
                      No certificates yet for this learner.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {learnerCerts.map((cert) => (
                        <div key={cert.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-brand shrink-0" />
                              <p className="text-sm font-medium truncate">{cert.courseName}</p>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {cert.certificateId} · Issued {formatDate(cert.issueDate)} by {cert.issuer}
                              {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => toast.success("Opening certificate", { description: cert.verifyUrl })}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trainer card */}
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Training partner
                  </p>
                  <div className="flex items-center gap-2">
                    <AvatarLogo text={trainingCompany.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{trainingCompany.name}</p>
                      <p className="text-xs text-muted-foreground">Rated {trainingCompany.rating} · {trainingCompany.corporateClients}+ corporate clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TimelineItem({
  icon, title, date, description, tone,
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
  description: string;
  tone: "brand" | "success" | "danger" | "default";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    default: "bg-muted text-muted-foreground",
  };
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${tones[tone]}`}>
          {icon}
        </div>
        <div className="flex-1 w-px bg-border mt-1" />
      </div>
      <div className="flex-1 pb-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{formatDate(date)} · {description}</p>
      </div>
    </div>
  );
}
