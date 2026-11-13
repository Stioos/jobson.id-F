"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface ExportRow {
  id: string; exporter: string; role: string; dataType: string; volume: string; destination: string; purpose: string; status: "approved" | "pending" | "blocked" | "completed"; at: string; dlpFlag: boolean;
}

const EXPORTS: ExportRow[] = [
  { id: "EXP-9001", exporter: "anita.r@jobson.id", role: "Super Admin", dataType: "user_pii", volume: "18,420 records", destination: "Email (SES)", purpose: "Compliance audit", status: "completed", at: "2024-09-22T08:00:00Z", dlpFlag: false },
  { id: "EXP-9000", exporter: "rohit.s@jobson.id", role: "Finance L2", dataType: "payment_records", volume: "8,400 records", destination: "S3 bucket", purpose: "Reconciliation", status: "completed", at: "2024-09-22T06:00:00Z", dlpFlag: false },
  { id: "EXP-8999", exporter: "support.l1@jobson.id", role: "Support L1", dataType: "user_pii", volume: "124 records", destination: "Email (SES)", purpose: "Support ticket follow-up", status: "pending", at: "2024-09-22T05:00:00Z", dlpFlag: true },
  { id: "EXP-8998", exporter: "marketing@jobson.id", role: "Marketing", dataType: "user_pii", volume: "9,420 records", destination: "Mailchimp", purpose: "Email campaign", status: "blocked", at: "2024-09-21T18:00:00Z", dlpFlag: true },
  { id: "EXP-8997", exporter: "anita.r@jobson.id", role: "Super Admin", dataType: "audit_logs", volume: "1.2M records", destination: "S3 (Glacier)", purpose: "Annual archive", status: "approved", at: "2024-09-21T11:00:00Z", dlpFlag: false },
  { id: "EXP-8996", exporter: "ops.team@jobson.id", role: "Operations", dataType: "kyc_docs", volume: "820 files", destination: "External FTP", purpose: "Partner verification", status: "pending", at: "2024-09-21T09:00:00Z", dlpFlag: true },
];

const BY_TYPE = [
  { type: "user_pii", count: 142, volume: "28,420 records", pct: 42 },
  { type: "payment_records", count: 86, volume: "84,200 records", pct: 24 },
  { type: "kyc_docs", count: 38, volume: "1,640 files", pct: 12 },
  { type: "audit_logs", count: 24, volume: "4.8M records", pct: 10 },
  { type: "analytics", count: 18, volume: "2.1M events", pct: 8 },
  { type: "messages", count: 12, volume: "9,820 records", pct: 4 },
];

const DLP_RULES = [
  { name: "PII outside business hours", action: "Flag", triggers: 8, status: "active" },
  { name: "Export > 10K records", action: "Require approval", triggers: 14, status: "active" },
  { name: "Export to personal email", action: "Block", triggers: 5, status: "active" },
  { name: "KYC docs to non-Indian FTP", action: "Block", triggers: 2, status: "active" },
];

export function SuperAdminDataExportAudit() {
  const pending = EXPORTS.filter(e => e.status === "pending");
  const blocked = EXPORTS.filter(e => e.status === "blocked");
  const dlp = EXPORTS.filter(e => e.dlpFlag);

  const statusBadge = (s: string) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "approved" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Export Audit"
        description="All data exports with approval workflow, DLP alerts, and analytics by type, volume, and destination."
        icon={<Icon name="Download" className="h-6 w-6" />}
        actions={[
          { label: "Export Policy", variant: "outline", onClick: () => toast.info("Opening data export policy") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Approval" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="DLP Flagged" value={dlp.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Blocked (30d)" value={blocked.length} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Exports (24h)" value={EXPORTS.length} icon={<Icon name="Download" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Export Queue" description="All exports with DLP flag & approval status" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Exporter</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>DLP</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXPORTS.map(e => (
              <TableRow key={e.id} className={e.dlpFlag ? "bg-rose-50/40 dark:bg-rose-900/10" : ""}>
                <TableCell className="font-mono text-xs">{e.id}</TableCell>
                <TableCell>
                  <p className="font-medium text-xs">{e.exporter}</p>
                  <p className="text-[10px] text-muted-foreground">{e.role}</p>
                </TableCell>
                <TableCell className="text-xs">{e.dataType}</TableCell>
                <TableCell className="text-xs">{e.volume}</TableCell>
                <TableCell className="text-xs">{e.destination}</TableCell>
                <TableCell className="text-xs max-w-xs truncate">{e.purpose}</TableCell>
                <TableCell>
                  {e.dlpFlag
                    ? <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500" />
                    : <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />}
                </TableCell>
                <TableCell className="text-[10px] text-muted-foreground">{timeAgo(e.at)}</TableCell>
                <TableCell>{statusBadge(e.status)}</TableCell>
                <TableCell>
                  {e.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Export ${e.id} approved`)}>Approve</Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.error(`Export ${e.id} blocked`)}>Block</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${e.id} audit trail`)}>Trail</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Exports by Data Type" description="Volume distribution (30d)">
          <ul className="space-y-2">
            {BY_TYPE.map(t => (
              <li key={t.type} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.type}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.count} exports · {t.volume}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.pct}%</span>
                </div>
                <Progress className="mt-2 h-1" value={t.pct} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="DLP Rules" description="Data Loss Prevention rules engine">
          {DLP_RULES.length === 0 ? (
            <EmptyState icon={<Icon name="Shield" className="h-5 w-5" />} title="No DLP rules" />
          ) : (
            <ul className="space-y-2">
              {DLP_RULES.map(r => (
                <li key={r.name} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Action: {r.action} · {r.triggers} triggers (30d)</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">{r.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Top Exporters" description="Most active exporters (30d)">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="User" className="h-4 w-4 text-brand" />anita.r@jobson.id <span className="text-xs text-muted-foreground">(Super Admin)</span></span>
            <span className="font-medium">42 exports</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="User" className="h-4 w-4 text-brand" />rohit.s@jobson.id <span className="text-xs text-muted-foreground">(Finance L2)</span></span>
            <span className="font-medium">28 exports</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="User" className="h-4 w-4 text-brand" />ops.team@jobson.id <span className="text-xs text-muted-foreground">(Operations)</span></span>
            <span className="font-medium">18 exports</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="User" className="h-4 w-4 text-brand" />marketing@jobson.id <span className="text-xs text-muted-foreground">(Marketing)</span></span>
            <span className="font-medium">12 exports</span>
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
