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

interface AuditFinding {
  id: string; control: string; severity: "low" | "medium" | "high" | "critical"; status: "open" | "remediation" | "closed"; owner: string; due: string; description: string;
}

interface AuditLog {
  id: string; user: string; action: string; resource: string; at: string; ip: string;
}

const FINDINGS: AuditFinding[] = [
  { id: "AF-2401", control: "Segregation of Duties", severity: "high", status: "remediation", owner: "Rohit S.", due: "2024-10-05", description: "Same admin can initiate & approve payouts > ₹1L." },
  { id: "AF-2400", control: "Access Review", severity: "medium", status: "open", owner: "Anita R.", due: "2024-10-12", description: "12 dormant admin accounts not deactivated > 90 days." },
  { id: "AF-2399", control: "Change Management", severity: "low", status: "closed", owner: "Compliance", due: "2024-09-15", description: "Production deploys without CAB approval (resolved)." },
  { id: "AF-2398", control: "Data Integrity", severity: "critical", status: "remediation", owner: "Rohit S.", due: "2024-09-30", description: "Wallet ledger drift detected on 3 wallets — unbalanced." },
  { id: "AF-2397", control: "Backup Encryption", severity: "medium", status: "closed", owner: "Infra Team", due: "2024-09-10", description: "Backup at-rest encryption key rotation overdue." },
];

const LOGS: AuditLog[] = [
  { id: "AL-9012", user: "anita.r@jobsonn.in", action: "approve_payout", resource: "PO-2024-0908", at: "2024-09-22T10:42:00Z", ip: "10.4.2.18" },
  { id: "AL-9011", user: "rohit.s@jobsonn.in", action: "reverse_txn", resource: "TXN-9905", at: "2024-09-22T09:15:00Z", ip: "10.4.2.22" },
  { id: "AL-9010", user: "fraud.engine@jobsonn.in", action: "block_wallet", resource: "WLT-9008", at: "2024-09-21T19:30:00Z", ip: "10.4.0.5" },
  { id: "AL-9009", user: "anita.r@jobsonn.in", action: "modify_plan", resource: "PLAN-PRO-ANNUAL", at: "2024-09-21T16:00:00Z", ip: "10.4.2.18" },
  { id: "AL-9008", user: "compliance@jobsonn.in", action: "file_gstr", resource: "GSTR-1-Aug-2024", at: "2024-09-21T11:00:00Z", ip: "10.4.2.30" },
];

const SOD = [
  { workflow: "Payout Approval", initiator: "Ops Team", approver: "Finance L2", segregation: true },
  { workflow: "Refund Processing", initiator: "Support L1", approver: "Finance L1", segregation: true },
  { workflow: "Plan Pricing Change", initiator: "Product", approver: "CFO", segregation: true },
  { workflow: "Wallet Freeze", initiator: "Fraud Engine", approver: "Compliance", segregation: false },
  { workflow: "Txn Reversal > ₹1L", initiator: "Support L2", approver: "Finance L1", segregation: false },
];

export function SuperAdminFinancialAudit() {
  const open = FINDINGS.filter(f => f.status === "open").length;
  const remediation = FINDINGS.filter(f => f.status === "remediation").length;
  const closed = FINDINGS.filter(f => f.status === "closed").length;
  const critical = FINDINGS.filter(f => f.severity === "critical" && f.status !== "closed").length;
  const compliancePct = Math.round((closed / FINDINGS.length) * 100);

  const sevBadge = (s: string) => {
    const cls = s === "critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "high" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : s === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "closed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "remediation" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Audit Center"
        description="SOX-style controls, segregation-of-duties checks, audit findings, remediation tracking, and report generator."
        icon={<Icon name="ScrollText" className="h-6 w-6" />}
        actions={[
          { label: "Generate Report", variant: "outline", onClick: () => toast.success("Audit report PDF queued — Q3 FY25") },
          { label: "Schedule Audit", onClick: () => toast.info("Scheduling external audit window") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Compliance Status" value={`${compliancePct}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone={compliancePct >= 80 ? "success" : "warning"} />
        <StatCard label="Open Findings" value={open} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
        <StatCard label="In Remediation" value={remediation} icon={<Icon name="Wrench" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Critical Open" value={critical} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Audit Findings" description="Open findings tracked with owner & due date" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Control</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FINDINGS.map(f => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.id}</TableCell>
                <TableCell className="font-medium text-xs">{f.control}</TableCell>
                <TableCell>{sevBadge(f.severity)}</TableCell>
                <TableCell className="text-xs max-w-xs">{f.description}</TableCell>
                <TableCell className="text-xs">{f.owner}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{f.due}</TableCell>
                <TableCell>{statusBadge(f.status)}</TableCell>
                <TableCell>
                  {f.status !== "closed" ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Marked ${f.id} as remediated`)}>Mark Remediated</Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${f.id} closure notes`)}>Notes</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Segregation of Duties" description="SOX-style SOD check across financial workflows">
          <ul className="space-y-2">
            {SOD.map(s => (
              <li key={s.workflow} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{s.workflow}</p>
                  {s.segregation
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">segregated</Badge>
                    : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">violation</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Initiator: {s.initiator} · Approver: {s.approver}</p>
                <Progress className="mt-2 h-1" value={s.segregation ? 100 : 30} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Financial Action Audit Trail" description="All sensitive financial actions (24h)">
          {LOGS.length === 0 ? (
            <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No actions logged" />
          ) : (
            <ul className="space-y-2">
              {LOGS.map(l => (
                <li key={l.id} className="flex items-start justify-between rounded-md border bg-card p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Icon name="ScrollText" className="mt-0.5 h-4 w-4 text-brand" />
                    <div>
                      <p className="font-medium text-xs">{l.action}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{l.user} · {l.resource} · {l.ip}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(l.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Compliance Status Summary" description="Overall audit posture">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border bg-card p-3">
            <p className="text-xs text-muted-foreground">SOX 404</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Compliant</p>
            <p className="mt-1 text-[10px] text-muted-foreground">12 controls tested</p>
          </div>
          <div className="rounded-md border bg-card p-3">
            <p className="text-xs text-muted-foreground">PCI-DSS</p>
            <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">Attestation due</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Q4 SAQ-A pending</p>
          </div>
          <div className="rounded-md border bg-card p-3">
            <p className="text-xs text-muted-foreground">RBI Storage</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Compliant</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Payment data localization</p>
          </div>
          <div className="rounded-md border bg-card p-3">
            <p className="text-xs text-muted-foreground">Internal Audit</p>
            <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">{open + remediation} open</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Next review: 30 Oct 2024</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
