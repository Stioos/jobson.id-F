"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

interface GradeChange {
  id: string; student: string; course: string; instructor: string; before: string; after: string; reason: string; timestamp: string; reviewStatus: "pending" | "approved" | "rejected";
}

interface Appeal {
  id: string; student: string; course: string; originalGrade: string; requestedGrade: string; reason: string; submittedAt: string;
}

const CHANGES: GradeChange[] = [
  { id: "GC-2024-001", student: "Priya Nair", course: "React Bootcamp", instructor: "Dr. Anita Krishnan", before: "B+", after: "A-", reason: "Re-evaluated final project", timestamp: "2024-09-21T10:14:00Z", reviewStatus: "pending" },
  { id: "GC-2024-002", student: "Rohan Mehta", course: "AWS Practitioner", instructor: "Lakshmi Menon", before: "C", after: "B", reason: "Additional assignment submitted", timestamp: "2024-09-20T15:42:00Z", reviewStatus: "approved" },
  { id: "GC-2024-003", student: "Sneha Reddy", course: "Data Science", instructor: "Rajesh Khanna", before: "A", after: "A+", reason: "Bonus marks for capstone", timestamp: "2024-09-19T11:08:00Z", reviewStatus: "approved" },
  { id: "GC-2024-004", student: "Aarav Sharma", course: "Kubernetes", instructor: "Vijay Anand", before: "F", after: "D", reason: "Late submission penalty waived", timestamp: "2024-09-18T09:30:00Z", reviewStatus: "pending" },
  { id: "GC-2024-005", student: "Anika Verma", course: "Sales Mastery", instructor: "Suresh Pillai", before: "B", after: "A", reason: "Instructor discretion", timestamp: "2024-09-17T16:22:00Z", reviewStatus: "pending" },
  { id: "GC-2024-006", student: "Karthik Iyer", course: "Excel Finance", instructor: "Kavita Nair", before: "B-", after: "B", reason: "Calculation error corrected", timestamp: "2024-09-16T14:12:00Z", reviewStatus: "approved" },
];

const APPEALS: Appeal[] = [
  { id: "GA-2024-101", student: "Vikram Singh", course: "Digital Marketing", originalGrade: "F", requestedGrade: "C", reason: "Medical leave during final exam", submittedAt: "2024-09-21T08:42:00Z" },
  { id: "GA-2024-102", student: "Nisha Patel", course: "React Bootcamp", originalGrade: "C+", requestedGrade: "B", reason: "Project misgraded — submitted evidence", submittedAt: "2024-09-20T19:18:00Z" },
  { id: "GA-2024-103", student: "Arjun Rao", course: "Kubernetes", originalGrade: "D", requestedGrade: "B-", reason: "Re-attempt of practical exam", submittedAt: "2024-09-19T12:30:00Z" },
];

const ANOMALIES = [
  { provider: "SalesPro Trainers", course: "Digital Marketing Mastery", inflation: "+18%", flag: "high" },
  { provider: "CloudMaster Academy", course: "Kubernetes for Beginners", inflation: "+9%", flag: "medium" },
  { provider: "CodeCraft Bootcamp", course: "React Bootcamp", inflation: "+3%", flag: "low" },
];

export function SuperAdminGradebookAudit() {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = CHANGES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.student.toLowerCase().includes(q) || c.course.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
    const matchFilter = filter === "all" || c.reviewStatus === filter;
    return matchSearch && matchFilter;
  });

  const pending = CHANGES.filter(c => c.reviewStatus === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gradebook Audit"
        description="Audit trail for every grade modification across the platform — review appeals, detect distribution anomalies, and surface potential instructor bias."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Export Audit", variant: "outline", onClick: () => toast.success("Audit export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Grade Changes (90d)" value={CHANGES.length} icon={<Icon name="BarChart3" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Review" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Open Appeals" value={APPEALS.length} icon={<Icon name="FilePen" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Bias Alerts" value={ANOMALIES.filter(a => a.flag !== "low").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Grade Change History" description={`${filtered.length} of ${CHANGES.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student, course, instructor…" className="h-9 max-w-sm" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Before → After</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium text-sm">{c.student}</TableCell>
                  <TableCell className="text-xs">{c.course}</TableCell>
                  <TableCell className="text-xs">{c.instructor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{c.before}</Badge>
                      <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 text-xs">{c.after}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{c.reason}</TableCell>
                  <TableCell className="text-xs">{timeAgo(c.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.reviewStatus === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : c.reviewStatus === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>{c.reviewStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    {c.reviewStatus === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Change ${c.id} approved`)}>Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Change ${c.id} rejected`)}>Reject</Button>
                      </div>
                    ) : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Viewing ${c.id}`)}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Grade Appeal Queue" description={`${APPEALS.length} pending appeals`}>
          {APPEALS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No open appeals" />
          ) : (
            <div className="space-y-2">
              {APPEALS.map(a => (
                <div key={a.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{a.student}</p>
                      <p className="text-xs text-muted-foreground">{a.course} · submitted {timeAgo(a.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{a.originalGrade}</Badge>
                      <Icon name="ArrowRight" className="h-3 w-3" />
                      <Badge variant="secondary" className="text-xs">{a.requestedGrade}</Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{a.reason}</p>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Appeal ${a.id} approved`)}>Approve Appeal</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Request more info: ${a.id}`)}>Request Info</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Instructor Bias Detection" description="Grade-inflation anomalies per provider/course">
          <div className="space-y-2">
            {ANOMALIES.map(a => (
              <div key={a.provider + a.course} className={`flex items-center gap-3 rounded-lg border p-3 ${a.flag === "high" ? "border-rose-500/30 bg-rose-500/5" : a.flag === "medium" ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
                <Icon name={a.flag === "high" ? "AlertTriangle" : a.flag === "medium" ? "AlertCircle" : "Activity"} className={a.flag === "high" ? "h-5 w-5 text-rose-500" : a.flag === "medium" ? "h-5 w-5 text-amber-500" : "h-5 w-5 text-muted-foreground"} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.provider}</p>
                  <p className="text-xs text-muted-foreground">{a.course}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${a.flag === "high" ? "text-rose-600" : a.flag === "medium" ? "text-amber-600" : "text-emerald-600"}`}>{a.inflation}</p>
                  <p className="text-xs text-muted-foreground">grade inflation</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Reviewing ${a.course} grading history…`)}>Review</Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
