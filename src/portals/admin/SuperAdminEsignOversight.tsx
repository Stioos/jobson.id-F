"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Vendor {
  id: string; name: string; volume: number; signingRate: number; avgTurnaroundHrs: number; failed: number; costPerSign: number; status: "active" | "degraded" | "down";
}

const VENDORS: Vendor[] = [
  { id: "es_docusign", name: "DocuSign", volume: 18_420, signingRate: 96.4, avgTurnaroundHrs: 2.1, failed: 412, costPerSign: 42, status: "active" },
  { id: "es_emudhra", name: "eMudhra", volume: 12_180, signingRate: 92.8, avgTurnaroundHrs: 4.8, failed: 580, costPerSign: 28, status: "active" },
  { id: "es_adobe", name: "Adobe Sign", volume: 8_240, signingRate: 94.1, avgTurnaroundHrs: 3.2, failed: 286, costPerSign: 52, status: "degraded" },
  { id: "es_india_sign", name: "IndiaSign", volume: 3_940, signingRate: 88.6, avgTurnaroundHrs: 8.4, failed: 312, costPerSign: 18, status: "active" },
  { id: "es_pune_dsc", name: "PuneDSC", volume: 1_220, signingRate: 71.2, avgTurnaroundHrs: 22.6, failed: 248, costPerSign: 12, status: "down" },
];

const DOC_TYPES = [
  { type: "Offer Letter", count: 9_840, pct: 31 },
  { type: "Employment Agreement", count: 7_620, pct: 24 },
  { type: "Vendor Contract", count: 5_180, pct: 16 },
  { type: "NDA", count: 4_220, pct: 13 },
  { type: "Onboarding Form", count: 2_910, pct: 9 },
  { type: "Other", count: 2_130, pct: 7 },
];

const RECENT_FAILED = [
  { id: "ESG-9241", vendor: "Adobe Sign", doc: "Offer Letter — Priya Nair", reason: "Signer email bounced", time: "2024-09-21T09:12:00Z" },
  { id: "ESG-9240", vendor: "PuneDSC", doc: "Vendor Contract — Apex Staffing", reason: "DSC token expired", time: "2024-09-21T07:48:00Z" },
  { id: "ESG-9239", vendor: "eMudhra", doc: "NDA — Rohan Mehta", reason: "OTP delivery failed", time: "2024-09-21T06:30:00Z" },
];

export function SuperAdminEsignOversight() {
  const totalVolume = VENDORS.reduce((a, v) => a + v.volume, 0);
  const totalFailed = VENDORS.reduce((a, v) => a + v.failed, 0);
  const totalSpend = VENDORS.reduce((a, v) => a + (v.volume - v.failed) * v.costPerSign, 0);

  const statusBadge = (s: Vendor["status"]) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "degraded" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-Sign Vendors"
        description="Oversight of all e-signature vendors (DocuSign, eMudhra, Adobe Sign, regional DSC providers) — volume, signing rate, turnaround, failures, and cost per signature."
        icon={<Icon name="FileSignature" className="h-6 w-6" />}
        actions={[{ label: "Add Vendor", variant: "default", onClick: () => toast.success("Opening vendor onboarding…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Volume (90d)" value={totalVolume.toLocaleString()} icon={<Icon name="FileSignature" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Signing Rate" value="92.4%" delta={{ value: "+1.1pp", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Failed Signatures" value={totalFailed.toLocaleString()} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Spend (90d)" value={formatCurrency(totalSpend)} icon={<Icon name="Banknote" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Vendor Comparison" description={`${VENDORS.length} active vendors`}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Signing Rate</TableHead>
                <TableHead>Avg Turnaround</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Cost / Sign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDORS.map(v => (
                <TableRow key={v.id} className={v.status === "down" ? "bg-rose-500/5" : v.status === "degraded" ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-xs">{v.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={v.signingRate} />
                      <span className="text-xs">{v.signingRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{v.avgTurnaroundHrs}h</TableCell>
                  <TableCell>
                    {v.failed > 300 ? <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-700 text-xs">{v.failed}</Badge> : <span className="text-xs">{v.failed}</span>}
                  </TableCell>
                  <TableCell className="text-xs">{formatCurrency(v.costPerSign)}</TableCell>
                  <TableCell>{statusBadge(v.status)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${v.name} dashboard…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Document Types Signed" description="Distribution across all vendors">
          <div className="space-y-2">
            {DOC_TYPES.map(d => (
              <div key={d.type} className="flex items-center gap-3">
                <span className="w-44 text-xs">{d.type}</span>
                <Progress className="h-2 flex-1" value={d.pct} />
                <span className="w-16 text-right text-xs">{d.count.toLocaleString()}</span>
                <span className="w-10 text-right text-xs text-muted-foreground">{d.pct}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Failed Signatures" description="Requires investigation or retry">
          {RECENT_FAILED.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No recent failures" />
          ) : (
            <div className="space-y-2">
              {RECENT_FAILED.map(f => (
                <div key={f.id} className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{f.doc}</p>
                    <p className="text-xs text-muted-foreground">{f.vendor} · {f.reason}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Retrying ${f.id}…`)}>Retry</Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
