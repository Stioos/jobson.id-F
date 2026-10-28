"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

interface GstReturn {
  period: string; type: "GSTR-1" | "GSTR-3B" | "GSTR-9"; due: string; status: "filed" | "pending" | "overdue"; collected: number; itc: number; payable: number;
}

const RETURNS: GstReturn[] = [
  { period: "Sep 2024", type: "GSTR-1", due: "2024-10-11", status: "pending", collected: 19_80_000, itc: 4_40_000, payable: 15_40_000 },
  { period: "Sep 2024", type: "GSTR-3B", due: "2024-10-20", status: "pending", collected: 19_80_000, itc: 4_40_000, payable: 15_40_000 },
  { period: "Aug 2024", type: "GSTR-1", due: "2024-09-11", status: "filed", collected: 18_40_000, itc: 4_20_000, payable: 14_20_000 },
  { period: "Aug 2024", type: "GSTR-3B", due: "2024-09-20", status: "filed", collected: 18_40_000, itc: 4_20_000, payable: 14_20_000 },
  { period: "Jul 2024", type: "GSTR-1", due: "2024-08-11", status: "filed", collected: 16_80_000, itc: 3_80_000, payable: 13_00_000 },
  { period: "FY24", type: "GSTR-9", due: "2024-12-31", status: "pending", collected: 1_84_00_000, itc: 38_00_000, payable: 1_46_00_000 },
];

const EINVOICES = [
  { id: "IRN-9921", invoice: "INV-2024-0921", customer: "TechCorp India", amount: 1_84_000, irn: "DA9F...8B21", ackNo: "20240922001", status: "generated" },
  { id: "IRN-9920", invoice: "INV-2024-0920", customer: "Virtusa Tech", amount: 4_20_000, irn: "DA9F...8B20", ackNo: "20240922000", status: "generated" },
  { id: "IRN-9919", invoice: "INV-2024-0919", customer: "EduSoft India", amount: 4_999, irn: null, ackNo: null, status: "failed" },
  { id: "IRN-9918", invoice: "INV-2024-0918", customer: "HireRight India", amount: 36_000, irn: "DA9F...8B18", ackNo: "20240921002", status: "generated" },
];

const GSTIN_VALIDATE = [
  { gstin: "27ABCDE1234F1Z5", name: "TechCorp India Pvt Ltd", state: "Maharashtra", status: "active", lastChecked: "2024-09-22" },
  { gstin: "29FGHIJ5678K2Z9", name: "Virtusa Technologies", state: "Karnataka", status: "active", lastChecked: "2024-09-22" },
  { gstin: "33KLMNO9012L3Z8", name: "Apex Skill Academy", state: "Tamil Nadu", status: "suspended", lastChecked: "2024-09-21" },
  { gstin: "07PQRST3456M4Z7", name: "BlueWave HR Consulting", state: "Delhi", status: "active", lastChecked: "2024-09-20" },
];

export function SuperAdminGstCompliance() {
  const pending = RETURNS.filter(r => r.status === "pending");
  const filed = RETURNS.filter(r => r.status === "filed");
  const overdue = RETURNS.filter(r => r.status === "overdue");
  const complianceScore = Math.round(((filed.length) / RETURNS.length) * 100);

  const statusBadge = (s: string) => {
    const cls = s === "filed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="GST Compliance Engine"
        description="GSTR filings, e-invoice IRN generation, GSTIN validation, place-of-supply accuracy, and reverse charge tracking."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[
          { label: "File GSTR-1", onClick: () => toast.success("GSTR-1 filing initiated via GST portal API") },
          { label: "Sync GST Portal", variant: "outline", onClick: () => toast.success("Syncing with GSTN portal...") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Compliance Score" value={`${complianceScore}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Filings" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={overdue.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="e-Invoices (24h)" value={EINVOICES.filter(e => e.status === "generated").length} icon={<Icon name="FileText" className="h-5 w-5" />} />
      </div>

      <SectionCard title="GST Returns" description="GSTR-1, GSTR-3B, GSTR-9 annual return status" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Collected</TableHead>
              <TableHead>ITC</TableHead>
              <TableHead>Payable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RETURNS.map((r, i) => {
              const days = daysUntil(r.due);
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.period}</TableCell>
                  <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                  <TableCell className="text-xs">{formatDate(r.due)}</TableCell>
                  <TableCell className={days < 7 ? "text-amber-600 dark:text-amber-400 text-xs font-medium" : "text-xs text-muted-foreground"}>
                    {days > 0 ? `${days}d` : "overdue"}
                  </TableCell>
                  <TableCell>{formatCurrency(r.collected)}</TableCell>
                  <TableCell className="text-emerald-700 dark:text-emerald-400">{formatCurrency(r.itc)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(r.payable)}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>
                    {r.status === "pending" ? (
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Filing ${r.type} for ${r.period}`)}>File</Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.type} ${r.period} acknowledgement`)}>Ack</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="e-Invoice IRN Generation" description="Real-time IRN status from NIC portal" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>IRN</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EINVOICES.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.invoice}</TableCell>
                  <TableCell className="font-medium text-xs">{e.customer}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(e.amount)}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{e.irn ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={e.status === "generated" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]"}>{e.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="GSTIN Validation" description="Live GSTIN status from GSTN">
          <ul className="space-y-2">
            {GSTIN_VALIDATE.map(g => (
              <li key={g.gstin} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{g.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{g.gstin} · {g.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={g.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]"}>{g.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => toast.success(`Re-validated ${g.gstin}`)}>Re-validate</Button>
                  </div>
                </div>
                <Progress className="mt-2 h-1" value={g.status === "active" ? 100 : 40} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Compliance Scorecard" description="DPDP/GST statutory readiness">
        {pending.length === 0 && overdue.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="All filings up to date" description="No pending or overdue returns." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Reverse Charge (RCM)</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(2_40_000)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Tracked on 18 invoices</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Place-of-Supply Mismatches</p>
              <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">3</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Manual review needed</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Next Filing Deadline</p>
              <p className="mt-1 text-lg font-semibold">11 Oct 2024</p>
              <p className="mt-1 text-[10px] text-muted-foreground">GSTR-1 Sep 2024</p>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
