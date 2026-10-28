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
import { formatDate } from "@/lib/format";

interface Allocation {
  id: string; trainer: string; provider: string; cohort: string; startDate: string; endDate: string; hoursPerWeek: number; capacity: number; status: "allocated" | "over_allocated" | "under_utilized" | "conflict";
}

const ALLOCATIONS: Allocation[] = [
  { id: "AL-2024-001", trainer: "Dr. Anita Krishnan", provider: "CodeCraft Bootcamp", cohort: "React Bootcamp Batch 12", startDate: "2024-08-01", endDate: "2024-11-30", hoursPerWeek: 28, capacity: 30, status: "allocated" },
  { id: "AL-2024-002", trainer: "Dr. Anita Krishnan", provider: "CodeCraft Bootcamp", cohort: "React Bootcamp Batch 13", startDate: "2024-09-15", endDate: "2025-01-15", hoursPerWeek: 22, capacity: 30, status: "over_allocated" },
  { id: "AL-2024-003", trainer: "Rajesh Khanna", provider: "DataInsight Labs", cohort: "Data Science Cohort 7", startDate: "2024-07-15", endDate: "2024-10-15", hoursPerWeek: 26, capacity: 30, status: "allocated" },
  { id: "AL-2024-004", trainer: "Lakshmi Menon", provider: "CloudMaster Academy", cohort: "AWS Practitioner Sep", startDate: "2024-09-10", endDate: "2024-11-10", hoursPerWeek: 18, capacity: 30, status: "allocated" },
  { id: "AL-2024-005", trainer: "Lakshmi Menon", provider: "CloudMaster Academy", cohort: "AWS Practitioner Oct", startDate: "2024-10-15", endDate: "2024-12-15", hoursPerWeek: 18, capacity: 30, status: "conflict" },
  { id: "AL-2024-006", trainer: "Vijay Anand", provider: "CloudMaster Academy", cohort: "Kubernetes Beginners Oct", startDate: "2024-10-15", endDate: "2024-12-15", hoursPerWeek: 8, capacity: 30, status: "under_utilized" },
  { id: "AL-2024-007", trainer: "Suresh Pillai", provider: "SalesPro Trainers", cohort: "Sales Mastery Aug", startDate: "2024-08-05", endDate: "2024-09-05", hoursPerWeek: 12, capacity: 30, status: "under_utilized" },
  { id: "AL-2024-008", trainer: "Suresh Pillai", provider: "SalesPro Trainers", cohort: "Sales Mastery Oct", startDate: "2024-10-01", endDate: "2024-11-01", hoursPerWeek: 24, capacity: 30, status: "allocated" },
];

const UNALLOCATED = [
  { id: "CH-2024-A9", cohort: "React Bootcamp Batch 14", provider: "CodeCraft Bootcamp", start: "2024-10-15", capacity: 50, reason: "No React trainer available" },
  { id: "CH-2024-A10", cohort: "Data Science Cohort 8", provider: "DataInsight Labs", start: "2024-11-01", capacity: 40, reason: "Pending trainer interview" },
  { id: "CH-2024-A11", cohort: "Excel Finance Nov", provider: "Apex Skill Academy", start: "2024-11-10", capacity: 35, reason: "Kavita Nair on leave" },
];

const HEATMAP = [
  { trainer: "Dr. Anita Krishnan", mon: 6, tue: 6, wed: 6, thu: 6, fri: 6, sat: 0, sun: 0 },
  { trainer: "Rajesh Khanna", mon: 5, tue: 5, wed: 5, thu: 5, fri: 6, sat: 0, sun: 0 },
  { trainer: "Lakshmi Menon", mon: 4, tue: 4, wed: 4, thu: 4, fri: 2, sat: 0, sun: 0 },
  { trainer: "Vijay Anand", mon: 2, tue: 2, wed: 2, thu: 2, fri: 0, sat: 0, sun: 0 },
  { trainer: "Suresh Pillai", mon: 5, tue: 5, wed: 4, thu: 5, fri: 5, sat: 0, sun: 0 },
];

export function SuperAdminTrainerAllocationOversight() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = ALLOCATIONS.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.trainer.toLowerCase().includes(q) || a.cohort.toLowerCase().includes(q) || a.provider.toLowerCase().includes(q);
    const matchStatus = status === "all" || a.status === status;
    return matchSearch && matchStatus;
  });

  const overAllocated = ALLOCATIONS.filter(a => a.status === "over_allocated").length;
  const conflicts = ALLOCATIONS.filter(a => a.status === "conflict").length;
  const underUtilized = ALLOCATIONS.filter(a => a.status === "under_utilized").length;

  const statusBadge = (s: Allocation["status"]) => {
    const cls = s === "allocated" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "over_allocated" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "conflict" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  const heatTone = (h: number) => h === 0 ? "bg-muted" : h <= 2 ? "bg-emerald-500/30" : h <= 4 ? "bg-emerald-500/60" : h <= 5 ? "bg-amber-500/70" : "bg-rose-500/80";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Allocation"
        description="Oversight of all trainer-cohort allocations across the platform — utilization heatmap, conflict detection, fairness analysis, and unallocated batch surfacing."
        icon={<Icon name="UserCog" className="h-6 w-6" />}
        actions={[{ label: "Auto-Allocate", variant: "default", onClick: () => toast.success("Auto-allocation engine running…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Allocations" value={ALLOCATIONS.length} icon={<Icon name="UserCog" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Over-allocated" value={overAllocated} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Conflicts" value={conflicts} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Unallocated Cohorts" value={UNALLOCATED.length} icon={<Icon name="CalendarOff" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Utilization Heatmap" description="Hours per day across trainers (last week)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Trainer</th>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <th key={d} className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{d}</th>
                ))}
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {HEATMAP.map(t => {
                const total = t.mon + t.tue + t.wed + t.thu + t.fri + t.sat + t.sun;
                return (
                  <tr key={t.trainer} className="border-b last:border-0">
                    <td className="px-3 py-2 text-xs font-medium">{t.trainer}</td>
                    {[t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun].map((h, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs font-medium ${heatTone(h)} ${h === 0 ? "text-muted-foreground" : "text-white"}`}>{h}</span>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right text-xs font-semibold">{total}h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="All Allocations" description={`${filtered.length} of ${ALLOCATIONS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search trainer, cohort, provider…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="over_allocated">Over-allocated</SelectItem>
              <SelectItem value="conflict">Conflict</SelectItem>
              <SelectItem value="under_utilized">Under-utilized</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Hours/Wk</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className={a.status === "over_allocated" ? "bg-rose-500/5" : a.status === "conflict" ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-medium text-sm">{a.trainer}</TableCell>
                  <TableCell className="text-xs">{a.provider}</TableCell>
                  <TableCell className="text-xs">{a.cohort}</TableCell>
                  <TableCell className="text-xs">{formatDate(a.startDate)}</TableCell>
                  <TableCell className="text-xs">{formatDate(a.endDate)}</TableCell>
                  <TableCell className="text-xs">{a.hoursPerWeek}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={(a.hoursPerWeek / a.capacity) * 100} />
                      <span className="text-xs">{Math.round((a.hoursPerWeek / a.capacity) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Reassigning ${a.id}…`)}>Reassign</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Unallocated Batches" description="Cohorts without an assigned trainer">
        {UNALLOCATED.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No unallocated cohorts" />
        ) : (
          <div className="space-y-2">
            {UNALLOCATED.map(u => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.cohort}</p>
                  <p className="text-xs text-muted-foreground">{u.provider} · starts {formatDate(u.start)} · {u.capacity} seats · {u.reason}</p>
                </div>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Suggesting trainers for ${u.cohort}…`)}>Find Trainer</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
