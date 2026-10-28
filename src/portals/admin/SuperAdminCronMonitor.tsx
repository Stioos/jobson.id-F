"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  duration: string;
  status: "success" | "failed" | "running" | "skipped";
  lastError?: string;
}

const JOBS: CronJob[] = [
  { id: "cron_1", name: "Hourly Email Digest", schedule: "0 * * * *", lastRun: "2024-09-21T10:00:00Z", nextRun: "2024-09-21T11:00:00Z", duration: "2m 14s", status: "success" },
  { id: "cron_2", name: "Daily Revenue Rollup", schedule: "0 2 * * *", lastRun: "2024-09-21T02:00:00Z", nextRun: "2024-09-22T02:00:00Z", duration: "8m 42s", status: "success" },
  { id: "cron_3", name: "Subscription Renewal", schedule: "0 0 * * *", lastRun: "2024-09-21T00:00:00Z", nextRun: "2024-09-22T00:00:00Z", duration: "14m 22s", status: "failed", lastError: "DB connection timeout at row 4821" },
  { id: "cron_4", name: "MoU Expiry Notifier", schedule: "0 9 * * 1", lastRun: "2024-09-16T09:00:00Z", nextRun: "2024-09-23T09:00:00Z", duration: "1m 02s", status: "success" },
  { id: "cron_5", name: "Resume Index Rebuild", schedule: "0 3 * * 0", lastRun: "2024-09-15T03:00:00Z", nextRun: "2024-09-22T03:00:00Z", duration: "42m 18s", status: "success" },
  { id: "cron_6", name: "Backup DB Snapshot", schedule: "0 4 * * *", lastRun: "2024-09-21T04:00:00Z", nextRun: "2024-09-22T04:00:00Z", duration: "22m 04s", status: "running" },
  { id: "cron_7", name: "Payout Settlement Batch", schedule: "30 1 * * *", lastRun: "2024-09-21T01:30:00Z", nextRun: "2024-09-22T01:30:00Z", duration: "6m 18s", status: "success" },
  { id: "cron_8", name: "Compliance Audit Export", schedule: "0 6 1 * *", lastRun: "2024-09-01T06:00:00Z", nextRun: "2024-10-01T06:00:00Z", duration: "18m 44s", status: "success" },
  { id: "cron_9", name: "AI Resume Scoring", schedule: "*/15 * * * *", lastRun: "2024-09-21T10:45:00Z", nextRun: "2024-09-21T11:00:00Z", duration: "1m 48s", status: "failed", lastError: "AI service 503 - rate limit exceeded" },
  { id: "cron_10", name: "Stale Session Cleanup", schedule: "0 5 * * *", lastRun: "2024-09-21T05:00:00Z", nextRun: "2024-09-22T05:00:00Z", duration: "0m 22s", status: "skipped" },
];

const EXEC_HISTORY = [
  { time: "10:45", success: 8, failed: 1, running: 0 },
  { time: "10:00", success: 9, failed: 0, running: 0 },
  { time: "09:00", success: 10, failed: 0, running: 0 },
  { time: "08:00", success: 9, failed: 1, running: 0 },
  { time: "07:00", success: 10, failed: 0, running: 0 },
  { time: "06:00", success: 8, failed: 2, running: 0 },
  { time: "05:00", success: 10, failed: 0, running: 0 },
  { time: "04:00", success: 9, failed: 0, running: 1 },
];

export function SuperAdminCronMonitor() {
  const successCount = JOBS.filter(j => j.status === "success").length;
  const failedCount = JOBS.filter(j => j.status === "failed").length;
  const runningCount = JOBS.filter(j => j.status === "running").length;
  const failed = JOBS.filter(j => j.status === "failed");

  const statusBadge = (s: CronJob["status"]) => {
    const cls = s === "success" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "failed" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "running" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-slate-500/15 text-slate-500 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cron Monitor"
        description="All scheduled cron jobs across services — schedule, last/next run, duration, status, error log, failed jobs queue, and execution history."
        icon={<Icon name="Clock" className="h-6 w-6" />}
        actions={[{ label: "Run All Now", variant: "outline", onClick: () => toast.success("Triggered manual run for all cron jobs") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Jobs" value={JOBS.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success (last run)" value={successCount} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Failed" value={failedCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Running" value={runningCount} icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Failed Jobs Queue" description="Jobs requiring immediate attention" contentClassName="p-0">
        {failed.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No failed jobs" />
        ) : (
          <div className="divide-y">
            {failed.map(j => (
              <div key={j.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" className="mt-0.5 h-5 w-5 text-rose-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{j.name}</span>
                      <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">failed</Badge>
                    </div>
                    <p className="mt-1 text-xs text-rose-600">{j.lastError}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Last run: {timeAgo(j.lastRun)} • Schedule: {j.schedule}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Retrying: ${j.name}`)}>Retry</Button>
                  <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.success(`Disabled: ${j.name}`)}>Disable</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Execution History (last 8h)" description="Hourly success/fail count">
        <div className="flex items-end gap-2 overflow-x-auto pb-2">
          {EXEC_HISTORY.map(h => {
            const total = h.success + h.failed + h.running;
            const maxBar = 12;
            return (
              <div key={h.time} className="flex min-w-[60px] flex-col items-center">
                <div className="flex h-32 w-full flex-col justify-end gap-0.5">
                  {h.running > 0 && <div className="w-full rounded-t bg-cyan-500" style={{ height: `${(h.running / maxBar) * 100}%` }} />}
                  {h.failed > 0 && <div className="w-full bg-rose-500" style={{ height: `${(h.failed / maxBar) * 100}%` }} />}
                  {h.success > 0 && <div className="w-full bg-emerald-500" style={{ height: `${(h.success / maxBar) * 100}%` }} />}
                </div>
                <span className="mt-1 text-[10px] text-muted-foreground">{h.time}</span>
                <span className="text-[10px] font-medium">{total}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" /> Success</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-500" /> Failed</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-cyan-500" /> Running</span>
        </div>
      </SectionCard>

      <SectionCard title="All Cron Jobs" description="Scheduled job registry" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {JOBS.map(j => (
              <TableRow key={j.id}>
                <TableCell className="font-medium">{j.name}</TableCell>
                <TableCell className="text-xs font-mono">{j.schedule}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{timeAgo(j.lastRun)}</TableCell>
                <TableCell className="text-xs">{formatDateTime(j.nextRun)}</TableCell>
                <TableCell className="text-xs">{j.duration}</TableCell>
                <TableCell>{statusBadge(j.status)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Triggered: ${j.name}`)}>Run Now</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
