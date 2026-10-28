"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Cohort {
  id: string; name: string; course: string; provider: string; start: string; end: string; enrolled: number; capacity: number; completionRate: number; status: "running" | "completed" | "upcoming" | "cancelled";
}

const COHORTS: Cohort[] = [
  { id: "CH-2024-A1", name: "React Bootcamp Batch 12", course: "Full Stack React + Node Bootcamp", provider: "CodeCraft Bootcamp", start: "2024-08-01", end: "2024-11-30", enrolled: 42, capacity: 50, completionRate: 88, status: "running" },
  { id: "CH-2024-A2", name: "Data Science Cohort 7", course: "Data Science with Python", provider: "DataInsight Labs", start: "2024-07-15", end: "2024-10-15", enrolled: 38, capacity: 40, completionRate: 92, status: "running" },
  { id: "CH-2024-A3", name: "AWS Practitioner Sep", course: "AWS Cloud Practitioner", provider: "CloudMaster Academy", start: "2024-09-10", end: "2024-11-10", enrolled: 24, capacity: 30, completionRate: 0, status: "running" },
  { id: "CH-2024-A4", name: "Sales Mastery Aug", course: "Sales Mastery Pro", provider: "SalesPro Trainers", start: "2024-08-05", end: "2024-09-05", enrolled: 18, capacity: 25, completionRate: 76, status: "completed" },
  { id: "CH-2024-A5", name: "Soft Skills Cohort 3", course: "Soft Skills for Leaders", provider: "SoftSkill Studio", start: "2024-10-01", end: "2024-12-15", enrolled: 12, capacity: 20, completionRate: 0, status: "upcoming" },
  { id: "CH-2024-A6", name: "Kubernetes Beginners Oct", course: "Kubernetes for Beginners", provider: "CloudMaster Academy", start: "2024-10-15", end: "2024-12-15", enrolled: 22, capacity: 25, completionRate: 0, status: "upcoming" },
  { id: "CH-2024-A7", name: "Excel Finance Sep", course: "Excel for Finance Pros", provider: "Apex Skill Academy", start: "2024-06-15", end: "2024-08-30", enrolled: 35, capacity: 35, completionRate: 94, status: "completed" },
  { id: "CH-2024-A8", name: "Digital Mktg Batch 5", course: "Digital Marketing Mastery", provider: "SalesPro Trainers", start: "2024-09-01", end: "2024-11-30", enrolled: 8, capacity: 30, completionRate: 0, status: "cancelled" },
];

export function SuperAdminCohortsDirectory() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = COHORTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.course.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
    const matchStatus = status === "all" || c.status === status;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s: Cohort["status"]) => {
    const cls = s === "running" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "completed" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : s === "upcoming" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const avgCompletion = Math.round(COHORTS.filter(c => c.completionRate > 0).reduce((a, c) => a + c.completionRate, 0) / COHORTS.filter(c => c.completionRate > 0).length);
  const totalLearners = COHORTS.reduce((a, c) => a + c.enrolled, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Cohorts"
        description="Every training cohort across the platform — track enrolment, capacity, completion rates, and compare performance across providers."
        icon={<Icon name="Users2" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Cohort export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Cohorts" value={COHORTS.length} icon={<Icon name="Users2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active (Running)" value={COHORTS.filter(c => c.status === "running").length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Learners" value={totalLearners} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Cohort Performance Comparison" description="Completion rate across active & completed cohorts">
        <div className="space-y-2">
          {COHORTS.filter(c => c.completionRate > 0).sort((a, b) => b.completionRate - a.completionRate).map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-48 shrink-0">
                <p className="truncate text-xs font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.provider}</p>
              </div>
              <Progress className="h-2 flex-1" value={c.completionRate} />
              <span className="w-10 text-right text-xs font-medium">{c.completionRate}%</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Cohort Directory" description={`${filtered.length} of ${COHORTS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cohort, course, provider…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                  </TableCell>
                  <TableCell className="text-xs">{c.course}</TableCell>
                  <TableCell className="text-xs">{c.provider}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.start)}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.end)}</TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{c.enrolled}</span>
                    <span className="text-xs text-muted-foreground">/{c.capacity}</span>
                  </TableCell>
                  <TableCell>
                    {c.completionRate > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress className="h-1.5 w-16" value={c.completionRate} />
                        <span className="text-xs">{c.completionRate}%</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${c.id}…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
