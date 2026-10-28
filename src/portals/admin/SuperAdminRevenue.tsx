"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

const LEDGER = [
  { id: "rev_001", date: "Sep 2024", portal: "Employer", type: "Subscription", plan: "Enterprise", recognized: 24_80_000, deferred: 4_20_000 },
  { id: "rev_002", date: "Sep 2024", portal: "Recruiter", type: "Commission", plan: "Business", recognized: 8_40_000, deferred: 1_10_000 },
  { id: "rev_003", date: "Sep 2024", portal: "Training", type: "Course Sales", plan: "Professional", recognized: 5_20_000, deferred: 80_000 },
  { id: "rev_004", date: "Sep 2024", portal: "Partner", type: "Franchise Fee", plan: "Business", recognized: 3_60_000, deferred: 60_000 },
  { id: "rev_005", date: "Sep 2024", portal: "Candidate", type: "Credits", plan: "Starter", recognized: 80_000, deferred: 12_000 },
];

const MRR_TREND = [
  { m: "Apr", mrr: 32_80_000 },
  { m: "May", mrr: 35_40_000 },
  { m: "Jun", mrr: 37_80_000 },
  { m: "Jul", mrr: 39_60_000 },
  { m: "Aug", mrr: 41_20_000 },
  { m: "Sep", mrr: 42_80_000 },
];

export function SuperAdminRevenue() {
  const totalRecognized = LEDGER.reduce((s, l) => s + l.recognized, 0);
  const totalDeferred = LEDGER.reduce((s, l) => s + l.deferred, 0);
  const maxMrr = Math.max(...MRR_TREND.map(m => m.mrr));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Revenue"
        description="Revenue ledger — recognized vs deferred, MRR trend, and portal breakdown."
        icon={<Icon name="DollarSign" className="h-6 w-6" />}
        actions={[{ label: "Export P&L", variant: "outline", onClick: () => toast.success("P&L statement exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Recognized (Sep)" value={formatCurrency(totalRecognized)} delta={{ value: "+8.4% MoM", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Deferred (Sep)" value={formatCurrency(totalDeferred)} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="MRR (Sep)" value={formatCurrency(42_80_000)} delta={{ value: "+3.9% MoM", positive: true }} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="brand" />
        <StatCard label="ARR" value={formatCurrency(513_60_000)} icon={<Icon name="BarChart3" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="MRR Trend (6 months)" description="Monthly recurring revenue">
        <div className="flex h-44 items-end gap-3">
          {MRR_TREND.map(m => (
            <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-t bg-brand/70" style={{ height: `${(m.mrr / maxMrr) * 100}%` }} />
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">₹{(m.mrr / 100_000).toFixed(1)}L</div>
                <div className="text-[10px] text-muted-foreground">{m.m}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Revenue Ledger" description="Recognized vs deferred by portal" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Portal</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Recognized</TableHead>
              <TableHead>Deferred</TableHead>
              <TableHead>% Deferred</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEDGER.map(l => (
              <TableRow key={l.id}>
                <TableCell><Badge variant="outline">{l.portal}</Badge></TableCell>
                <TableCell className="text-xs">{l.type}</TableCell>
                <TableCell><Badge variant="secondary">{l.plan}</Badge></TableCell>
                <TableCell className="font-medium text-emerald-700 dark:text-emerald-400">{formatCurrency(l.recognized)}</TableCell>
                <TableCell className="text-amber-700 dark:text-amber-400">{formatCurrency(l.deferred)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress className="h-1.5 w-20" value={(l.deferred / (l.recognized + l.deferred)) * 100} />
                    <span className="text-xs">{((l.deferred / (l.recognized + l.deferred)) * 100).toFixed(1)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot>
            <tr className="border-t font-medium">
              <td className="py-2 pr-4" colSpan={3}>Total</td>
              <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-400">{formatCurrency(totalRecognized)}</td>
              <td className="py-2 pr-4 text-amber-700 dark:text-amber-400">{formatCurrency(totalDeferred)}</td>
              <td className="py-2 pr-4">{((totalDeferred / (totalRecognized + totalDeferred)) * 100).toFixed(1)}%</td>
            </tr>
          </tfoot>
        </Table>
      </SectionCard>
    </div>
  );
}
