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

interface CohortAttendance {
  id: string; cohort: string; provider: string; course: string; avgAttendance: number; lowAttendees: number; fraudFlags: number; trend: "up" | "down" | "flat";
}

const COHORTS: CohortAttendance[] = [
  { id: "CH-2024-A1", cohort: "React Bootcamp Batch 12", provider: "CodeCraft Bootcamp", course: "Full Stack React", avgAttendance: 92, lowAttendees: 3, fraudFlags: 0, trend: "up" },
  { id: "CH-2024-A2", cohort: "Data Science Cohort 7", provider: "DataInsight Labs", course: "Data Science with Python", avgAttendance: 88, lowAttendees: 4, fraudFlags: 0, trend: "flat" },
  { id: "CH-2024-A3", cohort: "AWS Practitioner Sep", provider: "CloudMaster Academy", course: "AWS Cloud Practitioner", avgAttendance: 71, lowAttendees: 8, fraudFlags: 2, trend: "down" },
  { id: "CH-2024-A4", cohort: "Sales Mastery Aug", provider: "SalesPro Trainers", course: "Sales Mastery Pro", avgAttendance: 64, lowAttendees: 6, fraudFlags: 3, trend: "down" },
  { id: "CH-2024-A7", cohort: "Excel Finance Sep", provider: "Apex Skill Academy", course: "Excel for Finance Pros", avgAttendance: 95, lowAttendees: 1, fraudFlags: 0, trend: "up" },
];

const LOW_ALERTS = [
  { student: "Ravi Kumar", cohort: "AWS Practitioner Sep", attendance: 42, sessionsMissed: 8 },
  { student: "Pooja Shah", cohort: "Sales Mastery Aug", attendance: 38, sessionsMissed: 10 },
  { student: "Imran Khan", cohort: "AWS Practitioner Sep", attendance: 51, sessionsMissed: 6 },
  { student: "Divya Menon", cohort: "Sales Mastery Aug", attendance: 47, sessionsMissed: 7 },
];

const FRAUD = [
  { cohort: "AWS Practitioner Sep", provider: "CloudMaster Academy", pattern: "Biometric bypass ×2", session: "2024-09-18", severity: "high" },
  { cohort: "Sales Mastery Aug", provider: "SalesPro Trainers", pattern: "Proxy attendance suspected", session: "2024-09-15", severity: "critical" },
  { cohort: "Sales Mastery Aug", provider: "SalesPro Trainers", pattern: "GPS spoofing on check-in", session: "2024-09-12", severity: "high" },
];

export function SuperAdminAttendanceOversight() {
  const [search, setSearch] = React.useState("");
  const [provider, setProvider] = React.useState("all");

  const filtered = COHORTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.cohort.toLowerCase().includes(q) || c.course.toLowerCase().includes(q);
    const matchProvider = provider === "all" || c.provider === provider;
    return matchSearch && matchProvider;
  });

  const providers = Array.from(new Set(COHORTS.map(c => c.provider)));
  const avgAttendance = Math.round(COHORTS.reduce((a, c) => a + c.avgAttendance, 0) / COHORTS.length);
  const totalLow = COHORTS.reduce((a, c) => a + c.lowAttendees, 0);
  const totalFraud = COHORTS.reduce((a, c) => a + c.fraudFlags, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Oversight"
        description="Attendance metrics across every cohort — low-attendance alerts, fraud detection (biometric bypass, proxy check-ins), and provider-level trends."
        icon={<Icon name="CalendarCheck" className="h-6 w-6" />}
        actions={[{ label: "Export Report", variant: "outline", onClick: () => toast.success("Attendance report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={<Icon name="CalendarCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Low Attendees" value={totalLow} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Fraud Alerts" value={totalFraud} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Tracked Cohorts" value={COHORTS.length} icon={<Icon name="Users2" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Cohort Attendance Overview" description={`${filtered.length} of ${COHORTS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cohort or course…" className="h-9 max-w-sm" />
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Avg Attendance</TableHead>
                <TableHead>Low Attendees</TableHead>
                <TableHead>Fraud Flags</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className={c.fraudFlags > 0 ? "bg-rose-500/5" : c.avgAttendance < 75 ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-medium text-sm">{c.cohort}</TableCell>
                  <TableCell className="text-xs">{c.provider}</TableCell>
                  <TableCell className="text-xs">{c.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-16" value={c.avgAttendance} />
                      <span className={`text-xs font-medium ${c.avgAttendance >= 85 ? "text-emerald-600" : c.avgAttendance >= 70 ? "text-amber-600" : "text-rose-600"}`}>{c.avgAttendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.lowAttendees > 0 ? <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-700 text-xs">{c.lowAttendees}</Badge> : <span className="text-xs text-muted-foreground">none</span>}
                  </TableCell>
                  <TableCell>
                    {c.fraudFlags > 0 ? <Badge variant="outline" className="border-rose-500/30 bg-rose-500/15 text-rose-700 text-xs">{c.fraudFlags}</Badge> : <span className="text-xs text-muted-foreground">none</span>}
                  </TableCell>
                  <TableCell>
                    <Icon name={c.trend === "up" ? "TrendingUp" : c.trend === "down" ? "TrendingDown" : "Activity"} className={`h-4 w-4 ${c.trend === "up" ? "text-emerald-500" : c.trend === "down" ? "text-rose-500" : "text-muted-foreground"}`} />
                  </TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${c.id}…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Low-Attendance Alerts" description={`${LOW_ALERTS.length} learners below 60% threshold`}>
          <div className="space-y-2">
            {LOW_ALERTS.map(a => (
              <div key={a.student} className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.student}</p>
                  <p className="text-xs text-muted-foreground">{a.cohort} · {a.sessionsMissed} sessions missed</p>
                </div>
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-700 text-xs">{a.attendance}%</Badge>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Warning issued to ${a.student}`)}>Warn</Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Attendance Fraud Detection" description="Biometric bypass, proxy check-ins, GPS spoofing">
          {FRAUD.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No fraud signals" />
          ) : (
            <div className="space-y-2">
              {FRAUD.map((f, i) => (
                <div key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${f.severity === "critical" ? "border-rose-500/40 bg-rose-500/10" : "border-rose-500/30 bg-rose-500/5"}`}>
                  <Icon name="Fingerprint" className={`h-5 w-5 ${f.severity === "critical" ? "text-rose-600" : "text-rose-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{f.pattern}</p>
                    <p className="text-xs text-muted-foreground">{f.cohort} · {f.provider} · {f.session}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs capitalize ${f.severity === "critical" ? "border-rose-500/40 bg-rose-500/15 text-rose-700" : "border-amber-500/30 bg-amber-500/15 text-amber-700"}`}>{f.severity}</Badge>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.success(`Investigation opened`)}>Investigate</Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
