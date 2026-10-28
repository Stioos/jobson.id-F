"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDateTime, timeAgo } from "@/lib/format";

interface Wallet {
  id: string; holder: string; portal: string; balance: number; status: "active" | "frozen" | "pending_freeze"; frozenAt?: string; reason?: string; requestedBy?: string;
}

const WALLETS: Wallet[] = [
  { id: "WLT-9012", holder: "TechCorp India", portal: "employer", balance: 4_80_000, status: "frozen", frozenAt: "2024-09-21T10:00:00Z", reason: "Suspected fraud (TXN-9920)", requestedBy: "Fraud Engine" },
  { id: "WLT-9008", holder: "Sahil Verma", portal: "partner", balance: 12_400, status: "frozen", frozenAt: "2024-09-21T19:30:00Z", reason: "Card testing pattern", requestedBy: "Anita R." },
  { id: "WLT-9005", holder: "Virtusa Tech", portal: "training", balance: 8_40_000, status: "pending_freeze", reason: "Chargeback spike", requestedBy: "Rohit S." },
  { id: "WLT-9002", holder: "HireRight India", portal: "recruiter", balance: 36_000, status: "active" },
  { id: "WLT-8998", holder: "NorthStar Affiliates", portal: "partner", balance: 22_400, status: "active" },
  { id: "WLT-8995", holder: "Apex Skill Academy", portal: "training", balance: 1_20_000, status: "active" },
];

const HISTORY = [
  { id: "FRZ-0451", wallet: "WLT-9012", action: "freeze", by: "Fraud Engine", at: "2024-09-21T10:00:00Z", note: "Auto-flagged by velocity rule" },
  { id: "FRZ-0450", wallet: "WLT-9008", action: "freeze", by: "Anita R.", at: "2024-09-21T19:30:00Z", note: "Manual freeze — card testing" },
  { id: "FRZ-0449", wallet: "WLT-8980", action: "unfreeze", by: "Compliance Team", at: "2024-09-20T14:00:00Z", note: "Cleared after KYC re-verification" },
  { id: "FRZ-0448", wallet: "WLT-8962", action: "unfreeze", by: "Rohit S.", at: "2024-09-19T09:15:00Z", note: "Dispute resolved" },
];

export function SuperAdminWalletFreeze() {
  const frozen = WALLETS.filter(w => w.status === "frozen");
  const pending = WALLETS.filter(w => w.status === "pending_freeze");
  const totalFrozen = frozen.reduce((s, w) => s + w.balance, 0);

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "frozen" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet Freeze Console"
        description="Emergency freeze/unfreeze across all platform wallets with approval workflow and full audit trail."
        icon={<Icon name="Snowflake" className="h-6 w-6" />}
        actions={[
          { label: "Emergency Freeze", variant: "destructive", onClick: () => toast.error("Emergency freeze mode activated — all payouts halted") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Frozen Wallets" value={frozen.length} icon={<Icon name="Snowflake" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Frozen Value" value={formatCurrency(totalFrozen)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Pending Approval" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Active Wallets" value={WALLETS.filter(w => w.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Frozen & Pending Wallets" description="Wallets requiring review or unfreeze approval" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet ID</TableHead>
              <TableHead>Holder</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Since</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WALLETS.filter(w => w.status !== "active").map(w => (
              <TableRow key={w.id}>
                <TableCell className="font-mono text-xs">{w.id}</TableCell>
                <TableCell className="font-medium">{w.holder}</TableCell>
                <TableCell><Badge variant="outline">{w.portal}</Badge></TableCell>
                <TableCell className="font-medium">{formatCurrency(w.balance)}</TableCell>
                <TableCell className="text-xs">{w.reason ?? "—"}</TableCell>
                <TableCell className="text-xs">{w.requestedBy ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{w.frozenAt ? timeAgo(w.frozenAt) : "—"}</TableCell>
                <TableCell>{statusBadge(w.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Unfrozen ${w.id}`)}>Unfreeze</Button>
                    {w.status === "pending_freeze" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info(`Rejecting freeze request for ${w.id}`)}>Reject</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Freeze History" description="Last 30 days of freeze/unfreeze actions">
          <ul className="space-y-2">
            {HISTORY.map(h => (
              <li key={h.id} className="flex items-start justify-between rounded-md border bg-card p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Icon name={h.action === "freeze" ? "Snowflake" : "RefreshCw"} className={`mt-0.5 h-4 w-4 ${h.action === "freeze" ? "text-rose-500" : "text-emerald-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{h.id}</span>
                      <Badge variant="outline" className="text-[10px]">{h.action}</Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">{h.wallet}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{h.note}</p>
                    <p className="text-[10px] text-muted-foreground">by {h.by} · {formatDateTime(h.at)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Freeze Rules" description="Automated freeze triggers">
          {pending.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No pending requests" description="All freeze requests are reviewed." />
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="rounded-md border bg-card p-3">
                <p className="font-medium">Velocity Breach</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Auto-freeze on &gt;5 failed attempts in 60s</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="font-medium">Chargeback Spike</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Auto-freeze when chargeback rate &gt;2%</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="font-medium">Sanctions Match</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Freeze on OFAC / RBI sanctions list match</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="font-medium">KYC Lapse</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Auto-freeze when KYC expires &gt; 30 days</p>
              </li>
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
