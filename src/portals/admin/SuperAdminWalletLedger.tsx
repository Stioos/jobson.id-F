"use client";

import * as React from "react";
import { useState } from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface LedgerEntry {
  id: string; walletId: string; holder: string; portal: string; debit: number; credit: number; type: string; ref: string; balance: number; at: string; anomaly?: boolean;
}

const LEDGER: LedgerEntry[] = [
  { id: "LE-9001", walletId: "WLT-9012", holder: "TechCorp India", portal: "employer", debit: 0, credit: 1_84_000, type: "topup", ref: "TXN-9920", balance: 4_80_000, at: "2024-09-22T10:00:00Z" },
  { id: "LE-9000", walletId: "WLT-9012", holder: "TechCorp India", portal: "employer", debit: 4_999, credit: 0, type: "subscription", ref: "INV-2024-0921", balance: 2_96_000, at: "2024-09-22T09:30:00Z" },
  { id: "LE-8999", walletId: "WLT-9008", holder: "Sahil Verma", portal: "partner", debit: 12_400, credit: 0, type: "payout", ref: "PO-2024-0908", balance: 0, at: "2024-09-21T19:30:00Z", anomaly: true },
  { id: "LE-8998", walletId: "WLT-9005", holder: "Virtusa Tech", portal: "training", debit: 0, credit: 4_20_000, type: "topup", ref: "TXN-9918", balance: 8_40_000, at: "2024-09-21T15:00:00Z" },
  { id: "LE-8997", walletId: "WLT-9002", holder: "HireRight India", portal: "recruiter", debit: 18_000, credit: 0, type: "commission", ref: "CMP-2024-0901", balance: 18_000, at: "2024-09-21T11:00:00Z" },
  { id: "LE-8996", walletId: "WLT-8998", holder: "NorthStar Affiliates", portal: "partner", debit: 0, credit: 22_400, type: "commission_credit", ref: "CMP-2024-0899", balance: 22_400, at: "2024-09-20T16:00:00Z" },
  { id: "LE-8995", walletId: "WLT-8995", holder: "Apex Skill Academy", portal: "training", debit: 2_400, credit: 0, type: "refund", ref: "RF-2015", balance: 1_17_600, at: "2024-09-20T10:00:00Z" },
];

const PORTAL_SUMMARY = [
  { portal: "employer", wallets: 412, balance: 38_40_000, txns24h: 84 },
  { portal: "recruiter", wallets: 286, balance: 12_60_000, txns24h: 42 },
  { portal: "training", wallets: 184, balance: 18_20_000, txns24h: 28 },
  { portal: "partner", wallets: 96, balance: 6_40_000, txns24h: 12 },
  { portal: "candidate", wallets: 1284, balance: 4_80_000, txns24h: 142 },
];

export function SuperAdminWalletLedger() {
  const [search, setSearch] = useState("");
  const filtered = LEDGER.filter(l =>
    l.walletId.toLowerCase().includes(search.toLowerCase()) ||
    l.holder.toLowerCase().includes(search.toLowerCase()) ||
    l.ref.toLowerCase().includes(search.toLowerCase())
  );
  const anomalies = LEDGER.filter(l => l.anomaly);
  const totalBalance = PORTAL_SUMMARY.reduce((s, p) => s + p.balance, 0);
  const totalTxns = PORTAL_SUMMARY.reduce((s, p) => s + p.txns24h, 0);

  const typeBadge = (t: string) => {
    const cls = t === "topup" || t === "commission_credit" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : t === "refund" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : t === "payout" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";
    return <Badge variant="outline" className={cls}>{t}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet Ledger"
        description="Unified double-entry wallet ledger across all portals with balance verification and anomaly detection."
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[
          { label: "Export Ledger", variant: "outline", onClick: () => toast.success("Ledger export queued (CSV)") },
          { label: "Verify Balances", onClick: () => toast.success("Balance verification passed — 2,262 wallets reconciled") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Wallet Balance" value={formatCurrency(totalBalance)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Wallets" value="2,262" icon={<Icon name="Users2" className="h-5 w-5" />} />
        <StatCard label="Txns (24h)" value={totalTxns} icon={<Icon name="Activity" className="h-5 w-5" />} />
        <StatCard label="Anomalies" value={anomalies.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Wallet Balance by Portal" description="Aggregated wallet balance per portal">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PORTAL_SUMMARY.map(p => (
            <div key={p.portal} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">{p.portal}</Badge>
                <Icon name="Wallet" className="h-4 w-4 text-brand" />
              </div>
              <p className="mt-2 text-lg font-semibold">{formatCurrency(p.balance)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{p.wallets} wallets · {p.txns24h} txns</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Unified Ledger"
        description="Double-entry format — search by wallet ID, holder, or reference"
        action={
          <Input
            placeholder="Search wallet, holder, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-64 text-xs"
          />
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entry ID</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Holder</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching entries" description="Try a different search term." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(l => (
                <TableRow key={l.id} className={l.anomaly ? "bg-rose-50/40 dark:bg-rose-900/10" : ""}>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="font-mono text-xs">{l.walletId}</TableCell>
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-1.5">
                      {l.holder}
                      {l.anomaly && <Icon name="AlertTriangle" className="h-3 w-3 text-rose-500" />}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{l.portal}</Badge></TableCell>
                  <TableCell className="text-rose-600 dark:text-rose-400 text-xs">{l.debit ? `-${formatCurrency(l.debit)}` : "—"}</TableCell>
                  <TableCell className="text-emerald-600 dark:text-emerald-400 text-xs">{l.credit ? `+${formatCurrency(l.credit)}` : "—"}</TableCell>
                  <TableCell>{typeBadge(l.type)}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{l.ref}</TableCell>
                  <TableCell className="font-medium text-xs">{formatCurrency(l.balance)}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{formatDateTime(l.at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SectionCard>

      {anomalies.length > 0 && (
        <SectionCard title="Anomaly Detection" description="Suspicious ledger entries flagged for review">
          <ul className="space-y-2">
            {anomalies.map(a => (
              <li key={a.id} className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-50/40 dark:bg-rose-900/10 p-3 text-sm">
                <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 text-rose-500" />
                <div>
                  <p className="font-medium">{a.holder} — payout drained full balance</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Entry {a.id} · wallet {a.walletId} · {formatDateTime(a.at)}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => toast.info(`Investigating ${a.id}`)}>Investigate</Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
