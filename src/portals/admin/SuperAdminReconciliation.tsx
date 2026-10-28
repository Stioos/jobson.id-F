"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface ReconRow {
  id: string; source: "bank" | "razorpay" | "stripe" | "payu"; platformTxn: string; extRef: string; amount: number; status: "matched" | "unmatched" | "variance"; delta?: number; date: string;
}

const RECON: ReconRow[] = [
  { id: "RC-9001", source: "razorpay", platformTxn: "TXN-9920", extRef: "rp_001MNO", amount: 1_84_000, status: "matched", date: "2024-09-22" },
  { id: "RC-9000", source: "bank", platformTxn: "TXN-9918", extRef: "NEFT-HDFC-9912", amount: 4_20_000, status: "variance", delta: 420, date: "2024-09-22" },
  { id: "RC-8999", source: "stripe", platformTxn: "TXN-9915", extRef: "ch_1Mo9x", amount: 999, status: "matched", date: "2024-09-22" },
  { id: "RC-8998", source: "payu", platformTxn: "TXN-9909", extRef: "payu_8821", amount: 36_000, status: "unmatched", date: "2024-09-21" },
  { id: "RC-8997", source: "bank", platformTxn: "TXN-9905", extRef: "IMPS-ICICI-7765", amount: 12_400, status: "matched", date: "2024-09-21" },
  { id: "RC-8996", source: "razorpay", platformTxn: "TXN-9901", extRef: "rp_001MN0", amount: 8_800, status: "variance", delta: -120, date: "2024-09-21" },
  { id: "RC-8995", source: "stripe", platformTxn: "TXN-9898", extRef: "ch_1Mo9w", amount: 499, status: "unmatched", date: "2024-09-20" },
];

const SOURCES = [
  { name: "HDFC Bank (NEFT/IMPS)", matched: 412, unmatched: 8, variance: 4, totalAmount: 38_40_000 },
  { name: "Razorpay", matched: 1248, unmatched: 12, variance: 6, totalAmount: 84_20_000 },
  { name: "Stripe", matched: 384, unmatched: 5, variance: 2, totalAmount: 12_40_000 },
  { name: "PayU", matched: 286, unmatched: 9, variance: 3, totalAmount: 18_60_000 },
];

const AUTO_RULES = [
  { name: "Exact Amount Match", desc: "Auto-match if amount + reference match", active: true },
  { name: "Tolerance ±₹500", desc: "Auto-match if amount within ₹500", active: true },
  { name: "Same-Day Match", desc: "Match only same business day", active: true },
  { name: "Reference Contains", desc: "Platform TXN ID found in bank narration", active: false },
];

export function SuperAdminReconciliation() {
  const matched = RECON.filter(r => r.status === "matched").length;
  const unmatched = RECON.filter(r => r.status === "unmatched").length;
  const variance = RECON.filter(r => r.status === "variance").length;
  const matchRate = (matched / RECON.length) * 100;

  const statusBadge = (s: string) => {
    const cls = s === "matched" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "variance" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reconciliation"
        description="Bank & payment gateway reconciliation with auto-match rules and variance resolution."
        icon={<Icon name="Scale" className="h-6 w-6" />}
        actions={[
          { label: "Import Statement", variant: "outline", onClick: () => toast.info("Upload bank statement (CSV/MT940)") },
          { label: "Run Auto-Recon", onClick: () => toast.success("Auto-reconciliation started — 1,847 records queued") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Match Rate" value={`${matchRate.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Matched" value={matched} icon={<Icon name="Scale" className="h-5 w-5" />} tone="success" />
        <StatCard label="Unmatched" value={unmatched} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Variance" value={variance} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Recon Exceptions Queue" description="Unmatched & variance entries requiring manual review" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RC ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Platform TXN</TableHead>
              <TableHead>Ext Ref</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECON.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell><Badge variant="outline">{r.source}</Badge></TableCell>
                <TableCell className="font-mono text-xs">{r.platformTxn}</TableCell>
                <TableCell className="font-mono text-xs">{r.extRef}</TableCell>
                <TableCell className="font-medium">{formatCurrency(r.amount)}</TableCell>
                <TableCell className={r.delta ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}>
                  {r.delta ? `${r.delta > 0 ? "+" : ""}${formatCurrency(r.delta)}` : "—"}
                </TableCell>
                <TableCell className="text-xs">{formatDate(r.date)}</TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  {r.status !== "matched" ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Marked ${r.id} as matched`)}>Force Match</Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.id} ledger`)}>View</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Recon Status by Source" description="Per-source match health">
          <ul className="space-y-3">
            {SOURCES.map(s => {
              const total = s.matched + s.unmatched + s.variance;
              const pct = (s.matched / total) * 100;
              return (
                <li key={s.name} className="rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(s.totalAmount)}</span>
                  </div>
                  <Progress className="mt-2 h-1.5" value={pct} />
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{s.matched} matched · {s.unmatched} unmatched · {s.variance} variance</span>
                    <span>{pct.toFixed(1)}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Auto-Reconciliation Rules" description="Rules engine configuration">
          {AUTO_RULES.length === 0 ? (
            <EmptyState icon={<Icon name="Scale" className="h-5 w-5" />} title="No rules configured" />
          ) : (
            <ul className="space-y-2">
              {AUTO_RULES.map(r => (
                <li key={r.name} className="flex items-start justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <Badge variant="outline" className={r.active ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>
                    {r.active ? "active" : "paused"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
