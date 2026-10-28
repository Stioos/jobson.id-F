"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface Payout {
  id: string; partner: string; type: string; amount: number; period: string; status: string; method: string;
}

const PAYOUTS: Payout[] = [
  { id: "PO-8821", partner: "SouthZone Franchise", type: "franchise_share", amount: 1_84_000, period: "Sep 1–15, 2024", status: "pending", method: "NEFT" },
  { id: "PO-8820", partner: "TalentBridge Consulting", type: "commission", amount: 92_500, period: "Sep 1–15, 2024", status: "pending", method: "IMPS" },
  { id: "PO-8819", partner: "EduFirst Colleges", type: "revenue_share", amount: 1_24_600, period: "Aug 16–31, 2024", status: "pending", method: "NEFT" },
  { id: "PO-8818", partner: "Apex Skill Academy", type: "certification_fee", amount: 38_400, period: "Aug 16–31, 2024", status: "pending", method: "RTGS" },
  { id: "PO-8817", partner: "Sneha Reddy", type: "commission", amount: 18_500, period: "Sep 1–15, 2024", status: "approved", method: "UPI" },
  { id: "PO-8816", partner: "NorthStar Affiliates", type: "affiliate", amount: 22_400, period: "Aug 16–31, 2024", status: "approved", method: "NEFT" },
  { id: "PO-8815", partner: "MumbaiSkills Hub", type: "franchise_share", amount: 1_02_000, period: "Aug 16–31, 2024", status: "paid", method: "RTGS" },
  { id: "PO-8814", partner: "HireRight India", type: "commission", amount: 64_800, period: "Aug 16–31, 2024", status: "rejected", method: "IMPS" },
];

export function SuperAdminPayouts() {
  const pending = PAYOUTS.filter(p => p.status === "pending");
  const pendingTotal = pending.reduce((s, p) => s + p.amount, 0);

  const statusBadge = (s: string) => {
    const cls = s === "paid" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "approved" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const approve = (id: string, partner: string) => toast.success(`Payout ${id} to ${partner} approved`);
  const reject = (id: string) => toast.error(`Payout ${id} rejected`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts & Settlements"
        description="Approval queue for partner commissions, franchise shares, and revenue settlements."
        icon={<Icon name="Coins" className="h-6 w-6" />}
        actions={[{ label: "Batch Approve", onClick: () => toast.success("Batch approval initiated") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Approval" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending Total" value={formatCurrency(pendingTotal)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Approved Today" value={PAYOUTS.filter(p => p.status === "approved").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={PAYOUTS.filter(p => p.status === "rejected").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Approval Queue" description="Payouts awaiting review" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYOUTS.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">{p.partner}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{p.type.replace(/_/g, " ")}</Badge></TableCell>
                <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                <TableCell className="text-xs">{p.period}</TableCell>
                <TableCell className="text-xs">{p.method}</TableCell>
                <TableCell>{statusBadge(p.status)}</TableCell>
                <TableCell>
                  {p.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => approve(p.id, p.partner)}>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => reject(p.id)}>Reject</Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{formatDate(p.period.split(" ")[0])}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
