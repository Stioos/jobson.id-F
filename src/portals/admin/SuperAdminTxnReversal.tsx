"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";

interface Reversal {
  id: string; txn: string; user: string; portal: string; amount: number; reason: string; status: "pending" | "approved" | "rejected" | "completed"; requestedBy: string; at: string; ledgerOk: boolean;
}

const REVERSALS: Reversal[] = [
  { id: "RV-3021", txn: "TXN-9905", user: "Sahil Verma", portal: "partner", amount: 12_400, reason: "Fraud — auto-reverse", status: "pending", requestedBy: "Fraud Engine", at: "2024-09-22T06:00:00Z", ledgerOk: true },
  { id: "RV-3020", txn: "TXN-9899", user: "Apex Skill Academy", portal: "training", amount: 12_400, reason: "Course cancelled", status: "pending", requestedBy: "Customer", at: "2024-09-21T14:30:00Z", ledgerOk: true },
  { id: "RV-3019", txn: "TXN-9881", user: "HireRight India", portal: "recruiter", amount: 18_000, reason: "Service not delivered", status: "approved", requestedBy: "Support L2", at: "2024-09-21T09:00:00Z", ledgerOk: true },
  { id: "RV-3018", txn: "TXN-9876", user: "NorthStar Affiliates", portal: "partner", amount: 22_400, reason: "Contract termination", status: "completed", requestedBy: "Legal", at: "2024-09-20T11:00:00Z", ledgerOk: true },
  { id: "RV-3017", txn: "TXN-9869", user: "EduSoft India", portal: "employer", amount: 4_999, reason: "Downgrade", status: "completed", requestedBy: "Customer", at: "2024-09-19T16:00:00Z", ledgerOk: true },
  { id: "RV-3016", txn: "TXN-9861", user: "SoftSkill Studio", portal: "training", amount: 2_400, reason: "Cert not issued", status: "rejected", requestedBy: "Customer", at: "2024-09-18T18:00:00Z", ledgerOk: false },
];

const LIMITS = [
  { tier: "Standard", dailyLimit: 50_000, monthlyLimit: 5_00_000, approval: "L2", used: 1_24_000 },
  { tier: "Premium", dailyLimit: 2_00_000, monthlyLimit: 20_00_000, approval: "L1", used: 4_80_000 },
  { tier: "Enterprise", dailyLimit: 10_00_000, monthlyLimit: 1_00_00_000, approval: "Auto", used: 14_20_000 },
];

export function SuperAdminTxnReversal() {
  const pending = REVERSALS.filter(r => r.status === "pending");
  const completed = REVERSALS.filter(r => r.status === "completed");
  const reversedAmount = completed.reduce((s, r) => s + r.amount, 0);

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
        title="Transaction Reversal"
        description="Reversal console with double-entry ledger verification, approval workflow, and configurable limits."
        icon={<Icon name="Undo2" className="h-6 w-6" />}
        actions={[
          { label: "Reversal Policy", variant: "outline", onClick: () => toast.info("Opening reversal policy document") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Approval" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending Amount" value={formatCurrency(pending.reduce((s, r) => s + r.amount, 0))} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Reversed (30d)" value={formatCurrency(reversedAmount)} icon={<Icon name="Undo2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Ledger Mismatches" value={REVERSALS.filter(r => !r.ledgerOk).length} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Reversal Requests" description="Pending & recent reversals with ledger verification" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RV ID</TableHead>
              <TableHead>Original TXN</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Ledger</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REVERSALS.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-mono text-xs">{r.txn}</TableCell>
                <TableCell className="font-medium">{r.user}</TableCell>
                <TableCell className="font-medium">{formatCurrency(r.amount)}</TableCell>
                <TableCell className="text-xs">{r.reason}</TableCell>
                <TableCell className="text-xs">{r.requestedBy} · {timeAgo(r.at)}</TableCell>
                <TableCell>
                  {r.ledgerOk
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">Balanced</Badge>
                    : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">Mismatch</Badge>}
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  {r.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Reversal ${r.id} approved & posted`)}>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.error(`Reversal ${r.id} rejected`)}>Reject</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.id} ledger entries`)}>Ledger</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Reversal Limits by Tier" description="Daily / monthly caps with current utilization">
          <ul className="space-y-3">
            {LIMITS.map(l => {
              const pct = (l.used / l.monthlyLimit) * 100;
              return (
                <li key={l.tier} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{l.tier}</span>
                      <Badge variant="outline" className="text-[10px]">{l.approval} approval</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatCurrency(l.used)} / {formatCurrency(l.monthlyLimit)}</span>
                  </div>
                  <Progress className="mt-2 h-1.5" value={pct} />
                  <p className="mt-1 text-[10px] text-muted-foreground">Daily cap: {formatCurrency(l.dailyLimit)}</p>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Reversal History" description="Last 10 completed reversals">
          {completed.length === 0 ? (
            <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No completed reversals" />
          ) : (
            <ul className="space-y-2">
              {completed.map(r => (
                <li key={r.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{r.id}</span>
                      <span className="font-medium">{r.user}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.reason} · {formatDate(r.at)}</p>
                  </div>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-{formatCurrency(r.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
