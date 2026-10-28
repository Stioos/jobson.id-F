"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface ErasureReq {
  id: string; user: string; email: string; portal: string; requestedAt: string; status: "pending" | "in_progress" | "completed" | "on_hold"; retentionOverride?: string;
}

interface ChecklistItem {
  id: string; user: string; db: boolean; backups: boolean; logs: boolean; analytics: boolean; searchIndex: boolean; cdn: boolean; verified: boolean;
}

const REQUESTS: ErasureReq[] = [
  { id: "RTBF-0142", user: "Deepa Sharma", email: "deepa.sharma@gmail.com", portal: "candidate", requestedAt: "2024-09-20T14:30:00Z", status: "in_progress" },
  { id: "RTBF-0141", user: "Sumeet Patil", email: "sumeet@apexrecruit.in", portal: "recruiter", requestedAt: "2024-09-22T09:00:00Z", status: "pending", retentionOverride: "Active contract — defer 6 months" },
  { id: "RTBF-0140", user: "Ananya Iyer", email: "ananya.iyer@gmail.com", portal: "candidate", requestedAt: "2024-09-18T10:00:00Z", status: "completed" },
  { id: "RTBF-0139", user: "Ravi Kumar", email: "ravi@bluewave.in", portal: "employer", requestedAt: "2024-09-15T11:00:00Z", status: "on_hold", retentionOverride: "Pending legal dispute hold" },
  { id: "RTBF-0138", user: "Sara Khan", email: "sara.khan@gmail.com", portal: "candidate", requestedAt: "2024-09-10T16:00:00Z", status: "completed" },
];

const CHECKLIST: ChecklistItem[] = [
  { id: "RTBF-0142", user: "Deepa Sharma", db: true, backups: false, logs: true, analytics: false, searchIndex: true, cdn: false, verified: false },
  { id: "RTBF-0140", user: "Ananya Iyer", db: true, backups: true, logs: true, analytics: true, searchIndex: true, cdn: true, verified: true },
];

const RETENTION = [
  { dataType: "User Profile", defaultMonths: 36, exceptions: 4, overrideable: true },
  { dataType: "Job Applications", defaultMonths: 60, exceptions: 2, overrideable: true },
  { dataType: "Payment Records", defaultMonths: 84, exceptions: 0, overrideable: false },
  { dataType: "Audit Logs", defaultMonths: 36, exceptions: 0, overrideable: false },
  { dataType: "Messages", defaultMonths: 24, exceptions: 1, overrideable: true },
];

export function SuperAdminRtbf() {
  const pending = REQUESTS.filter(r => r.status === "pending");
  const inProgress = REQUESTS.filter(r => r.status === "in_progress");
  const completed = REQUESTS.filter(r => r.status === "completed");
  const onHold = REQUESTS.filter(r => r.status === "on_hold");

  const statusBadge = (s: string) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "in_progress" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "pending" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Right to Erasure"
        description="Right to be Forgotten (RTBF) fulfillment with deletion checklist, verification, and retention policy exceptions."
        icon={<Icon name="Trash2" className="h-6 w-6" />}
        actions={[
          { label: "Erasure Policy", variant: "outline", onClick: () => toast.info("Opening RTBF policy document") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="In Progress" value={inProgress.length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed (30d)" value={completed.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="On Legal Hold" value={onHold.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Erasure Requests" description="All RTBF requests with retention override tracking" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RTBF ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Retention Override</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REQUESTS.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{r.user}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{r.portal}</Badge></TableCell>
                <TableCell className="text-xs">{timeAgo(r.requestedAt)}</TableCell>
                <TableCell className="text-xs">
                  {r.retentionOverride
                    ? <span className="text-amber-600 dark:text-amber-400">{r.retentionOverride}</span>
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  {r.status === "pending" || r.status === "in_progress" ? (
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Erasure pipeline triggered for ${r.id}`)}>Process</Button>
                  ) : r.status === "completed" ? (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.id} deletion certificate`)}>Certificate</Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.id} hold reason`)}>Hold</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Deletion Checklist" description="Per-user data inventory & deletion status">
        {CHECKLIST.length === 0 ? (
          <EmptyState icon={<Icon name="CheckSquare" className="h-5 w-5" />} title="No active checklists" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RTBF ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>DB</TableHead>
                <TableHead>Backups</TableHead>
                <TableHead>Logs</TableHead>
                <TableHead>Analytics</TableHead>
                <TableHead>Search Index</TableHead>
                <TableHead>CDN Cache</TableHead>
                <TableHead>Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CHECKLIST.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium text-sm">{c.user}</TableCell>
                  {[c.db, c.backups, c.logs, c.analytics, c.searchIndex, c.cdn].map((v, i) => (
                    <TableCell key={i}>
                      {v
                        ? <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />
                        : <Icon name="X" className="h-4 w-4 text-rose-500" />}
                    </TableCell>
                  ))}
                  <TableCell>
                    {c.verified
                      ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">verified</Badge>
                      : <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">pending</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Retention Policy Exceptions" description="Data-type retention windows with override tracking">
        <ul className="space-y-2">
          {RETENTION.map(r => (
            <li key={r.dataType} className="rounded-md border bg-card p-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.dataType}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Default retention: {r.defaultMonths} months</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{r.exceptions} exceptions</Badge>
                  {r.overrideable
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">overrideable</Badge>
                    : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">locked</Badge>}
                </div>
              </div>
              <Progress className="mt-2 h-1" value={(r.exceptions / 5) * 100} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
