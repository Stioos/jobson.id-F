"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const COHORTS = [
  { name: "Jan 2024", size: 1840, t2hCompleted: 62, placementRate: 48, satisfactionNps: 42, retention90: 71 },
  { name: "Feb 2024", size: 2120, t2hCompleted: 64, placementRate: 51, satisfactionNps: 45, retention90: 73 },
  { name: "Mar 2024", size: 2480, t2hCompleted: 67, placementRate: 53, satisfactionNps: 47, retention90: 75 },
  { name: "Apr 2024", size: 2840, t2hCompleted: 65, placementRate: 50, satisfactionNps: 44, retention90: 72 },
  { name: "May 2024", size: 3120, t2hCompleted: 69, placementRate: 55, satisfactionNps: 49, retention90: 78 },
  { name: "Jun 2024", size: 3480, t2hCompleted: 71, placementRate: 57, satisfactionNps: 51, retention90: 80 },
  { name: "Jul 2024", size: 3820, t2hCompleted: 73, placementRate: 59, satisfactionNps: 53, retention90: 82 },
  { name: "Aug 2024", size: 4180, t2hCompleted: 75, placementRate: 61, satisfactionNps: 55, retention90: 84 },
];

const BEHAVIORAL = [
  { cohort: "T2H Completers", users: 9420, placementRate: 68, nps: 58 },
  { cohort: "T2H Partial", users: 4180, placementRate: 41, nps: 38 },
  { cohort: "T2H Dropouts", users: 2840, placementRate: 18, nps: 22 },
  { cohort: "Self-paced only", users: 5840, placementRate: 32, nps: 35 },
  { cohort: "Mentor-led", users: 3120, placementRate: 64, nps: 52 },
];

export function SuperAdminCohorts() {
  const maxPlacement = Math.max(...COHORTS.map(c => c.placementRate));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cohort Analysis"
        description="Behavioral cohorts and outcomes — T2H completion → placement rate correlation and cohort comparisons."
        icon={<Icon name="Users2" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Cohort report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Cohorts" value={COHORTS.length} icon={<Icon name="Users2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Cohort Size" value={Math.round(COHORTS.reduce((s, c) => s + c.size, 0) / COHORTS.length).toLocaleString("en-IN")} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Avg Placement" value="54.3%" delta={{ value: "+3.1pt", positive: true }} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg NPS" value="48" delta={{ value: "+5", positive: true }} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Placement Rate by Cohort" description="Monthly cohorts (Jan–Aug 2024)">
        <div className="flex h-44 items-end gap-2">
          {COHORTS.map(c => (
            <div key={c.name} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div className={`w-full rounded-t ${c.placementRate >= 55 ? "bg-emerald-500" : c.placementRate >= 45 ? "bg-amber-500" : "bg-rose-500"}`} style={{ height: `${(c.placementRate / maxPlacement) * 100}%` }} />
              </div>
              <span className="text-[10px] font-medium">{c.placementRate}%</span>
              <span className="text-[10px] text-muted-foreground">{c.name}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Cohort Comparison" description="Side-by-side metrics" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cohort</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>T2H Completed</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>NPS</TableHead>
              <TableHead>90d Retention</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COHORTS.map(c => (
              <TableRow key={c.name}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.size.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={c.t2hCompleted >= 70 ? "default" : "secondary"} className={c.t2hCompleted >= 70 ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                    {c.t2hCompleted}%
                  </Badge>
                </TableCell>
                <TableCell>{c.placementRate}%</TableCell>
                <TableCell>{c.satisfactionNps}</TableCell>
                <TableCell>{c.retention90}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Behavioral Cohorts" description="User-segment outcomes based on Training-to-Hire journey">
        <div className="grid gap-3 md:grid-cols-2">
          {BEHAVIORAL.map(b => (
            <div key={b.cohort} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{b.cohort}</span>
                <Badge variant="outline">{b.users.toLocaleString("en-IN")} users</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Placement Rate</p>
                  <p className={`text-lg font-semibold ${b.placementRate >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{b.placementRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">NPS</p>
                  <p className="text-lg font-semibold">{b.nps}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
