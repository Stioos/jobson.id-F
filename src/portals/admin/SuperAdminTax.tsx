"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

const GST_RETURNS = [
  { period: "Aug 2024", type: "GSTR-1", status: "filed", due: "2024-09-10", filed: "2024-09-08", collected: 18_40_000, itc: 4_20_000, payable: 14_20_000 },
  { period: "Aug 2024", type: "GSTR-3B", status: "filed", due: "2024-09-20", filed: "2024-09-18", collected: 18_40_000, itc: 4_20_000, payable: 14_20_000 },
  { period: "Jul 2024", type: "GSTR-1", status: "filed", due: "2024-08-10", filed: "2024-08-09", collected: 16_80_000, itc: 3_80_000, payable: 13_00_000 },
  { period: "Sep 2024", type: "GSTR-1", status: "pending", due: "2024-10-10", filed: null, collected: 19_80_000, itc: 4_40_000, payable: 15_40_000 },
];

const TDS = [
  { id: "TDS-Q1-2024", quarter: "Q1 FY25", amount: 4_80_000, certificate: "Available", status: "issued" },
  { id: "TDS-Q4-2024", quarter: "Q4 FY24", amount: 4_20_000, certificate: "Available", status: "issued" },
  { id: "TDS-Q3-2024", quarter: "Q3 FY24", amount: 3_80_000, certificate: "Available", status: "issued" },
];

const STATE_BREAKDOWN = [
  { state: "Maharashtra", gstin: "27ABCDE1234F1Z5", txns: 412, collected: 4_80_000, color: "bg-emerald-500" },
  { state: "Karnataka", gstin: "29FGHIJ5678K2Z9", txns: 318, collected: 3_60_000, color: "bg-teal-500" },
  { state: "Tamil Nadu", gstin: "33KLMNO9012L3Z8", txns: 224, collected: 2_40_000, color: "bg-amber-500" },
  { state: "Delhi", gstin: "07PQRST3456M4Z7", txns: 184, collected: 1_90_000, color: "bg-cyan-500" },
  { state: "Telangana", gstin: "36UVWXY7890N5Z6", txns: 96, collected: 1_10_000, color: "bg-violet-500" },
];

export function SuperAdminTax() {
  const totalCollected = STATE_BREAKDOWN.reduce((s, x) => s + x.collected, 0);
  const pendingReturns = GST_RETURNS.filter(g => g.status === "pending").length;

  const statusBadge = (s: string) => {
    const cls = s === "filed" || s === "issued" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax & GST Compliance"
        description="GST returns, TDS certificates, state-wise tax breakdown, and statutory filings."
        icon={<Icon name="ReceiptText" className="h-6 w-6" />}
        actions={[{ label: "File GSTR-1", onClick: () => toast.success("GSTR-1 filing initiated") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="GST Collected (FY25)" value={formatCurrency(88_40_000)} icon={<Icon name="ReceiptText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="ITC Available" value={formatCurrency(18_80_000)} icon={<Icon name="RotateCcw" className="h-5 w-5" />} />
        <StatCard label="Net Payable" value={formatCurrency(69_60_000)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending Returns" value={pendingReturns} icon={<Icon name="Clock" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="GST Returns" description="GSTR-1, GSTR-3B filings" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Filed Date</TableHead>
              <TableHead>Collected</TableHead>
              <TableHead>ITC</TableHead>
              <TableHead>Payable</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GST_RETURNS.map((g, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{g.period}</TableCell>
                <TableCell><Badge variant="outline">{g.type}</Badge></TableCell>
                <TableCell className="text-xs">{g.due}</TableCell>
                <TableCell className="text-xs">{g.filed ?? "—"}</TableCell>
                <TableCell>{formatCurrency(g.collected)}</TableCell>
                <TableCell className="text-emerald-700 dark:text-emerald-400">{formatCurrency(g.itc)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(g.payable)}</TableCell>
                <TableCell>{statusBadge(g.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="TDS Certificates" description="Quarterly TDS issued to partners/recruiters">
          <ul className="space-y-2">
            {TDS.map(t => (
              <li key={t.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div>
                  <p className="font-medium">{t.quarter}</p>
                  <p className="text-xs text-muted-foreground">{t.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(t.amount)}</p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => toast.success(`Downloading ${t.id}.pdf`)}>
                    <Icon name="Download" className="h-3 w-3" /> Cert
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="State-wise GST Breakdown" description="Collected by state GSTIN">
          <div className="space-y-3">
            {STATE_BREAKDOWN.map(s => (
              <div key={s.state}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="font-medium">{s.state}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.gstin}</span>
                  </div>
                  <span className="text-muted-foreground">{formatCurrency(s.collected)}</span>
                </div>
                <Progress className="mt-1 h-1.5" value={(s.collected / totalCollected) * 100} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
