"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Onboarding {
  id: string; newHire: string; employer: string; role: string; startDate: string; tasksCompleted: number; tasksTotal: number; day1Ready: boolean; status: "in_progress" | "completed" | "delayed" | "not_started";
}

const ONBOARDINGS: Onboarding[] = [
  { id: "OB-2024-001", newHire: "Priya Nair", employer: "TechCorp India", role: "Senior Frontend Engineer", startDate: "2024-09-15", tasksCompleted: 18, tasksTotal: 20, day1Ready: true, status: "in_progress" },
  { id: "OB-2024-002", newHire: "Rohan Mehta", employer: "Wipro Ltd", role: "Backend Architect", startDate: "2024-09-10", tasksCompleted: 22, tasksTotal: 22, day1Ready: true, status: "completed" },
  { id: "OB-2024-003", newHire: "Sneha Reddy", employer: "TCS", role: "Data Analyst", startDate: "2024-09-20", tasksCompleted: 8, tasksTotal: 22, day1Ready: false, status: "delayed" },
  { id: "OB-2024-004", newHire: "Aarav Sharma", employer: "Infosys BPM", role: "DevOps Engineer", startDate: "2024-09-22", tasksCompleted: 4, tasksTotal: 20, day1Ready: false, status: "in_progress" },
  { id: "OB-2024-005", newHire: "Anika Verma", employer: "HCL Technologies", role: "Project Manager", startDate: "2024-10-01", tasksCompleted: 0, tasksTotal: 24, day1Ready: false, status: "not_started" },
  { id: "OB-2024-006", newHire: "Karthik Iyer", employer: "Tech Mahindra", role: "QA Lead", startDate: "2024-09-05", tasksCompleted: 22, tasksTotal: 22, day1Ready: true, status: "completed" },
  { id: "OB-2024-007", newHire: "Meera Joshi", employer: "Accenture", role: "Solutions Consultant", startDate: "2024-09-18", tasksCompleted: 12, tasksTotal: 20, day1Ready: false, status: "delayed" },
];

const BOTTLENECKS = [
  { task: "IT asset provisioning", avgDays: 4.2, target: 1, severity: "high" },
  { task: "Policy acknowledgment", avgDays: 1.8, target: 1, severity: "low" },
  { task: "Manager intro call", avgDays: 3.4, target: 2, severity: "medium" },
  { task: "Access to internal tools", avgDays: 5.1, target: 1, severity: "high" },
];

const TIME_TO_PROD = [
  { employer: "TechCorp India", weeks: 4.2 },
  { employer: "TCS", weeks: 6.8 },
  { employer: "Infosys BPM", weeks: 5.4 },
  { employer: "Wipro Ltd", weeks: 7.2 },
  { employer: "Accenture", weeks: 3.8 },
];

export function SuperAdminOnboardingOversight() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = ONBOARDINGS.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.newHire.toLowerCase().includes(q) || o.employer.toLowerCase().includes(q) || o.role.toLowerCase().includes(q);
    const matchStatus = status === "all" || o.status === status;
    return matchSearch && matchStatus;
  });

  const completed = ONBOARDINGS.filter(o => o.status === "completed").length;
  const delayed = ONBOARDINGS.filter(o => o.status === "delayed").length;
  const day1Ready = ONBOARDINGS.filter(o => o.day1Ready).length;
  const completionPct = Math.round(ONBOARDINGS.reduce((a, o) => a + (o.tasksCompleted / o.tasksTotal) * 100, 0) / ONBOARDINGS.length);

  const statusBadge = (s: Onboarding["status"]) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : s === "delayed" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : s === "in_progress" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Tracker"
        description="Platform-wide onboarding oversight — new-hire completion %, task progress, day-1 readiness, bottleneck detection, and time-to-productivity by employer."
        icon={<Icon name="UserPlus" className="h-6 w-6" />}
        actions={[{ label: "Templates", variant: "outline", onClick: () => toast.success("Opening onboarding templates…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Onboardings" value={ONBOARDINGS.length} icon={<Icon name="UserPlus" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Completion" value={`${completionPct}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Delayed" value={delayed} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Day-1 Ready" value={day1Ready} icon={<Icon name="Rocket" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Time-to-Productivity" description="Weeks to reach full productivity" className="lg:col-span-2">
          <div className="space-y-2">
            {TIME_TO_PROD.sort((a, b) => a.weeks - b.weeks).map(t => (
              <div key={t.employer} className="flex items-center gap-3">
                <span className="w-40 text-xs">{t.employer}</span>
                <Progress className="h-2 flex-1" value={(t.weeks / 8) * 100} />
                <span className="w-12 text-right text-xs font-medium">{t.weeks}w</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Day-1 Readiness" description="Laptop, accounts, access">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <span className="text-xs">Day-1 Ready</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/15 text-emerald-700 text-xs">{day1Ready}/{ONBOARDINGS.length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <span className="text-xs">Not Ready</span>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-700 text-xs">{ONBOARDINGS.length - day1Ready}/{ONBOARDINGS.length}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Avg completion {completionPct}% across {ONBOARDINGS.length} onboardings.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Onboarding Pipeline" description={`${filtered.length} of ${ONBOARDINGS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search new hire, employer, role…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>New Hire</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Day-1 Ready</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id} className={o.status === "delayed" ? "bg-rose-500/5" : ""}>
                  <TableCell className="font-medium text-sm">{o.newHire}</TableCell>
                  <TableCell className="text-xs">{o.employer}</TableCell>
                  <TableCell className="text-xs">{o.role}</TableCell>
                  <TableCell className="text-xs">{formatDate(o.startDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={(o.tasksCompleted / o.tasksTotal) * 100} />
                      <span className="text-xs">{o.tasksCompleted}/{o.tasksTotal}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {o.day1Ready ? <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertCircle" className="h-4 w-4 text-amber-500" />}
                  </TableCell>
                  <TableCell>{statusBadge(o.status)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${o.id}…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Onboarding Bottleneck Detection" description="Tasks exceeding target completion time">
        {BOTTLENECKS.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No bottlenecks" />
        ) : (
          <div className="space-y-2">
            {BOTTLENECKS.map(b => (
              <div key={b.task} className={`flex items-center gap-3 rounded-lg border p-3 ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/5" : b.severity === "medium" ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
                <Icon name={b.severity === "high" ? "AlertTriangle" : b.severity === "medium" ? "AlertCircle" : "Activity"} className={`h-5 w-5 ${b.severity === "high" ? "text-rose-500" : b.severity === "medium" ? "text-amber-500" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.task}</p>
                  <p className="text-xs text-muted-foreground">avg {b.avgDays}d vs target {b.target}d</p>
                </div>
                <Badge variant="outline" className={`text-xs capitalize ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : b.severity === "medium" ? "border-amber-500/30 bg-amber-500/15 text-amber-700" : ""}`}>{b.severity}</Badge>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
