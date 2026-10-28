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

interface Probation {
  id: string; employee: string; employer: string; start: string; end: string; daysRemaining: number; reviewStatus: "on_track" | "delayed" | "review_due" | "failed"; confirmationRate: number;
}

const PROBATIONS: Probation[] = [
  { id: "PB-2024-001", employee: "Priya Nair", employer: "TechCorp India", start: "2024-06-01", end: "2024-12-01", daysRemaining: 72, reviewStatus: "on_track", confirmationRate: 92 },
  { id: "PB-2024-002", employee: "Rohan Mehta", employer: "Wipro Ltd", start: "2024-07-15", end: "2025-01-15", daysRemaining: 116, reviewStatus: "review_due", confirmationRate: 78 },
  { id: "PB-2024-003", employee: "Sneha Reddy", employer: "TCS", start: "2024-04-01", end: "2024-10-01", daysRemaining: 10, reviewStatus: "delayed", confirmationRate: 65 },
  { id: "PB-2024-004", employee: "Aarav Sharma", employer: "Infosys BPM", start: "2024-08-01", end: "2025-02-01", daysRemaining: 134, reviewStatus: "on_track", confirmationRate: 88 },
  { id: "PB-2024-005", employee: "Anika Verma", employer: "HCL Technologies", start: "2024-05-15", end: "2024-11-15", daysRemaining: 56, reviewStatus: "review_due", confirmationRate: 71 },
  { id: "PB-2024-006", employee: "Karthik Iyer", employer: "Tech Mahindra", start: "2024-03-01", end: "2024-09-01", daysRemaining: -20, reviewStatus: "failed", confirmationRate: 0 },
  { id: "PB-2024-007", employee: "Meera Joshi", employer: "Accenture", start: "2024-08-22", end: "2025-02-22", daysRemaining: 154, reviewStatus: "on_track", confirmationRate: 84 },
  { id: "PB-2024-008", employee: "Vikram Singh", employer: "Cognizant", start: "2024-06-15", end: "2024-12-15", daysRemaining: 86, reviewStatus: "delayed", confirmationRate: 58 },
];

const FAILURES = [
  { employer: "Tech Mahindra", count: 4, pct: 8, reason: "Performance below expectations" },
  { employer: "Cognizant", count: 2, pct: 5, reason: "Attendance issues" },
  { employer: "Wipro Ltd", count: 1, pct: 3, reason: "Cultural misfit" },
];

const COMPLIANCE = [
  { employer: "TechCorp India", onTime: 96, compliance: "compliant" },
  { employer: "TCS", onTime: 88, compliance: "compliant" },
  { employer: "Infosys BPM", onTime: 72, compliance: "warning" },
  { employer: "Wipro Ltd", onTime: 64, compliance: "warning" },
  { employer: "Cognizant", onTime: 52, compliance: "non_compliant" },
];

export function SuperAdminProbationOversight() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = PROBATIONS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.employee.toLowerCase().includes(q) || p.employer.toLowerCase().includes(q);
    const matchStatus = status === "all" || p.reviewStatus === status;
    return matchSearch && matchStatus;
  });

  const onTrack = PROBATIONS.filter(p => p.reviewStatus === "on_track").length;
  const reviewDue = PROBATIONS.filter(p => p.reviewStatus === "review_due").length;
  const failed = PROBATIONS.filter(p => p.reviewStatus === "failed").length;
  const avgConfirmation = Math.round(PROBATIONS.reduce((a, p) => a + p.confirmationRate, 0) / PROBATIONS.length);

  const statusBadge = (s: Probation["reviewStatus"]) => {
    const cls = s === "on_track" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "review_due" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "delayed" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-violet-500/15 text-violet-700 border-violet-500/30";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Probation Tracking"
        description="Platform-wide probation oversight — track employees across employers, monitor days remaining, review status, and confirmation rates with labor-law compliance checks."
        icon={<Icon name="Clock" className="h-6 w-6" />}
        actions={[{ label: "Compliance Report", variant: "outline", onClick: () => toast.success("Compliance report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Probations" value={PROBATIONS.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="On Track" value={onTrack} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Review Due" value={reviewDue} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Confirmation" value={`${avgConfirmation}%`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
      </div>

      <SectionCard title="All Probations" description={`${filtered.length} of ${PROBATIONS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or employer…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on_track">On Track</SelectItem>
              <SelectItem value="review_due">Review Due</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Confirmation</TableHead>
                <TableHead>Review Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className={p.reviewStatus === "failed" ? "bg-rose-500/5" : p.reviewStatus === "delayed" ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-medium text-sm">{p.employee}</TableCell>
                  <TableCell className="text-xs">{p.employer}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.start)}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.end)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${p.daysRemaining < 0 ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : p.daysRemaining < 30 ? "border-amber-500/30 bg-amber-500/15 text-amber-700" : ""}`}>{p.daysRemaining < 0 ? "overdue" : `${p.daysRemaining}d`}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-12" value={p.confirmationRate} />
                      <span className="text-xs">{p.confirmationRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(p.reviewStatus)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${p.id}…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Probation Failure Analysis" description="Top failure reasons by employer">
          {FAILURES.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No failures recorded" />
          ) : (
            <div className="space-y-2">
              {FAILURES.map(f => (
                <div key={f.employer} className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{f.employer}</p>
                    <Badge variant="outline" className="border-rose-500/30 bg-rose-500/15 text-rose-700 text-xs">{f.count} failed · {f.pct}%</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Primary reason: {f.reason}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Labor-Law Compliance" description="On-time confirmation vs statutory deadline">
          <div className="space-y-2">
            {COMPLIANCE.map(c => (
              <div key={c.employer} className={`flex items-center gap-3 rounded-lg border p-3 ${c.compliance === "non_compliant" ? "border-rose-500/30 bg-rose-500/5" : c.compliance === "warning" ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
                <Icon name={c.compliance === "compliant" ? "CheckCircle2" : c.compliance === "warning" ? "AlertTriangle" : "AlertCircle"} className={`h-5 w-5 ${c.compliance === "compliant" ? "text-emerald-500" : c.compliance === "warning" ? "text-amber-500" : "text-rose-500"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.employer}</p>
                  <p className="text-xs text-muted-foreground">{c.onTime}% on-time confirmation</p>
                </div>
                <Progress className="h-1.5 w-16" value={c.onTime} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
