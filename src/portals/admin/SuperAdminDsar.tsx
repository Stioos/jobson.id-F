"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

interface Dsar {
  id: string; requester: string; email: string; type: "Access" | "Export" | "Rectify" | "Object" | "Erase"; status: "pending" | "in_progress" | "completed" | "rejected"; requestedAt: string; slaHours: number; elapsedHours: number; assignee?: string;
}

const DSARS: Dsar[] = [
  { id: "DSAR-0142", requester: "Vikram Singh", email: "vikram@naukrix.com", type: "Export", status: "pending", requestedAt: "2024-09-22T07:42:00Z", slaHours: 72, elapsedHours: 4 },
  { id: "DSAR-0141", requester: "Deepa Sharma", email: "deepa.sharma@gmail.com", type: "Erase", status: "in_progress", requestedAt: "2024-09-20T14:30:00Z", slaHours: 720, elapsedHours: 48, assignee: "Compliance Team" },
  { id: "DSAR-0140", requester: "Karthik Menon", email: "karthik.m@gmail.com", type: "Export", status: "completed", requestedAt: "2024-09-18T09:00:00Z", slaHours: 72, elapsedHours: 60, assignee: "Anita R." },
  { id: "DSAR-0139", requester: "Aishwarya R", email: "aishwarya@apexrecruit.in", type: "Rectify", status: "completed", requestedAt: "2024-09-15T11:00:00Z", slaHours: 720, elapsedHours: 96, assignee: "Rohit S." },
  { id: "DSAR-0138", requester: "Sumeet Patil", email: "sumeet@apexrecruit.in", type: "Object", status: "rejected", requestedAt: "2024-09-10T16:00:00Z", slaHours: 720, elapsedHours: 240, assignee: "Legal" },
  { id: "DSAR-0137", requester: "Neha Kapadia", email: "neha@bluewave.in", type: "Access", status: "pending", requestedAt: "2024-09-22T10:00:00Z", slaHours: 72, elapsedHours: 2 },
];

const TEMPLATES = [
  { id: "TPL-01", name: "Data Export Acknowledgement", language: "English", lastUsed: "2024-09-22" },
  { id: "TPL-02", name: "Erasure Confirmation", language: "English", lastUsed: "2024-09-20" },
  { id: "TPL-03", name: "Rectification Complete", language: "English", lastUsed: "2024-09-15" },
  { id: "TPL-04", name: "Objection Rejection", language: "English", lastUsed: "2024-09-10" },
];

export function SuperAdminDsar() {
  const open = DSARS.filter(d => d.status === "pending" || d.status === "in_progress");
  const completed = DSARS.filter(d => d.status === "completed");
  const breached = DSARS.filter(d => d.elapsedHours > d.slaHours && d.status !== "completed" && d.status !== "rejected");

  const statusBadge = (s: string) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "in_progress" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "pending" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DSAR Queue"
        description="Data Subject Access Request fulfillment workflow with SLA countdown, data collection, and response templates."
        icon={<Icon name="FileSearch" className="h-6 w-6" />}
        actions={[
          { label: "Create DSAR", variant: "outline", onClick: () => toast.info("Opening DSAR intake form") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open DSARs" value={open.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed (30d)" value={completed.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="SLA Breached" value={breached.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg Fulfillment" value="42h" icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="DSAR Queue" description="All DSARs with SLA countdown" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DSAR ID</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>SLA Countdown</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DSARS.map(d => {
              const remaining = d.slaHours - d.elapsedHours;
              const pct = (d.elapsedHours / d.slaHours) * 100;
              const isBreached = remaining < 0;
              return (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{d.requester}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
                  <TableCell className="text-xs">{timeAgo(d.requestedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-16" value={Math.min(pct, 100)} />
                      <span className={`text-xs font-medium ${isBreached ? "text-rose-600 dark:text-rose-400" : remaining < 24 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                        {isBreached ? `+${Math.abs(remaining)}h over` : `${remaining}h left`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{d.assignee ?? "Unassigned"}</TableCell>
                  <TableCell>{statusBadge(d.status)}</TableCell>
                  <TableCell>
                    {d.status === "pending" || d.status === "in_progress" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Collecting data for ${d.id}`)}>Collect</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info(`Opening fulfillment workflow for ${d.id}`)}>Workflow</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${d.id} fulfillment log`)}>Log</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Data Collection Sources" description="Per-request data inventory">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-md border bg-card p-3">
              <span className="flex items-center gap-2"><Icon name="Database" className="h-4 w-4 text-brand" />Primary DB (Postgres)</span>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">automated</Badge>
            </li>
            <li className="flex items-center justify-between rounded-md border bg-card p-3">
              <span className="flex items-center gap-2"><Icon name="History" className="h-4 w-4 text-brand" />Audit Logs</span>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">automated</Badge>
            </li>
            <li className="flex items-center justify-between rounded-md border bg-card p-3">
              <span className="flex items-center gap-2"><Icon name="Cloud" className="h-4 w-4 text-brand" />S3 Backups</span>
              <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">manual</Badge>
            </li>
            <li className="flex items-center justify-between rounded-md border bg-card p-3">
              <span className="flex items-center gap-2"><Icon name="Activity" className="h-4 w-4 text-brand" />Analytics (Mixpanel)</span>
              <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">manual</Badge>
            </li>
            <li className="flex items-center justify-between rounded-md border bg-card p-3">
              <span className="flex items-center gap-2"><Icon name="Mail" className="h-4 w-4 text-brand" />Email Logs (SES)</span>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">automated</Badge>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Response Templates" description="Pre-approved DSAR response templates">
          {TEMPLATES.length === 0 ? (
            <EmptyState icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} title="No templates" />
          ) : (
            <ul className="space-y-2">
              {TEMPLATES.map(t => (
                <li key={t.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.id} · {t.language} · last used {t.lastUsed}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Opening template ${t.id}`)}>Edit</Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
