"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Region {
  name: string; code: string; dataTypes: string[]; recordCount: number; storageLocation: string; compliant: boolean;
}

const REGIONS: Region[] = [
  { name: "India", code: "IN", dataTypes: ["user_pii", "payments", "kyc", "messages"], recordCount: 1_84_000, storageLocation: "Mumbai (ap-south-1)", compliant: true },
  { name: "European Union", code: "EU", dataTypes: ["user_pii", "consents"], recordCount: 4_800, storageLocation: "Frankfurt (eu-central-1)", compliant: true },
  { name: "United States", code: "US", dataTypes: ["analytics", "marketing_logs"], recordCount: 12_400, storageLocation: "Virginia (us-east-1)", compliant: true },
  { name: "Singapore", code: "SG", dataTypes: ["user_pii"], recordCount: 820, storageLocation: "Singapore (ap-southeast-1)", compliant: false },
];

interface TransferLog {
  id: string; dataType: string; fromRegion: string; toRegion: string; purpose: string; legalBasis: string; at: string; status: "allowed" | "blocked" | "review";
}

const TRANSFERS: TransferLog[] = [
  { id: "CB-9001", dataType: "user_pii", fromRegion: "IN", toRegion: "US", purpose: "Support ticket export", legalBasis: "Standard Contractual Clauses", at: "2024-09-22T08:00:00Z", status: "allowed" },
  { id: "CB-9000", dataType: "kyc_docs", fromRegion: "IN", toRegion: "SG", purpose: "Partner onboarding", legalBasis: "—", at: "2024-09-21T14:00:00Z", status: "blocked" },
  { id: "CB-8999", dataType: "analytics", fromRegion: "EU", toRegion: "US", purpose: "Marketing analytics", legalBasis: "Adequacy Decision", at: "2024-09-21T09:00:00Z", status: "allowed" },
  { id: "CB-8998", dataType: "payments", fromRegion: "IN", toRegion: "EU", purpose: "Refund processing", legalBasis: "Standard Contractual Clauses", at: "2024-09-20T16:00:00Z", status: "review" },
  { id: "CB-8997", dataType: "marketing_logs", fromRegion: "US", toRegion: "IN", purpose: "Compliance audit", legalBasis: "Consent", at: "2024-09-20T10:00:00Z", status: "allowed" },
];

const VIOLATIONS = [
  { id: "VIO-12", severity: "high", description: "Singapore region stores user_pii without explicit consent", detectedAt: "2024-09-22T03:00:00Z", status: "open" },
  { id: "VIO-11", severity: "medium", description: "Cross-border transfer to US lacks SCC documentation", detectedAt: "2024-09-21T18:00:00Z", status: "remediation" },
  { id: "VIO-10", severity: "low", description: "EU analytics data older than 24 months not purged", detectedAt: "2024-09-20T12:00:00Z", status: "closed" },
];

export function SuperAdminDataResidency() {
  const totalRecords = REGIONS.reduce((s, r) => s + r.recordCount, 0);
  const compliant = REGIONS.filter(r => r.compliant).length;
  const violations = VIOLATIONS.filter(v => v.status !== "closed");

  const statusBadge = (s: string) => {
    const cls = s === "allowed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "blocked" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const sevBadge = (s: string) => {
    const cls = s === "high" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Residency"
        description="Data location by region, residency rules per data type, cross-border transfer log, and violation alerts."
        icon={<Icon name="Globe" className="h-6 w-6" />}
        actions={[
          { label: "Residency Rules", variant: "outline", onClick: () => toast.info("Opening residency rules editor") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Regions" value={REGIONS.length} icon={<Icon name="Globe" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Records" value={totalRecords.toLocaleString("en-IN")} icon={<Icon name="Database" className="h-5 w-5" />} />
        <StatCard label="Compliant Regions" value={`${compliant}/${REGIONS.length}`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone={compliant === REGIONS.length ? "success" : "warning"} />
        <StatCard label="Open Violations" value={violations.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Data by Region" description="Where data is stored and what types" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Data Types</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Storage Location</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REGIONS.map(r => (
              <TableRow key={r.code}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell><Badge variant="outline">{r.code}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.dataTypes.map(d => <Badge key={d} variant="outline" className="text-[10px]">{d}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{r.recordCount.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.storageLocation}</TableCell>
                <TableCell>
                  {r.compliant
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">compliant</Badge>
                    : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">violation</Badge>}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${r.name} data flow map`)}>Flow Map</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Cross-Border Transfer Log" description="All data movements between regions" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Legal Basis</TableHead>
                <TableHead>At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSFERS.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="text-xs">{t.dataType}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{t.fromRegion} → {t.toRegion}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{t.purpose}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.legalBasis}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(t.at)}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Residency Violation Alerts" description="Active violations requiring remediation">
          {VIOLATIONS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No violations" />
          ) : (
            <ul className="space-y-2">
              {VIOLATIONS.map(v => (
                <li key={v.id} className="rounded-md border bg-card p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertTriangle" className={`mt-0.5 h-4 w-4 ${v.severity === "high" ? "text-rose-500" : v.severity === "medium" ? "text-amber-500" : "text-slate-500"}`} />
                      <div>
                        <p className="font-medium">{v.description}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{v.id} · detected {formatDate(v.detectedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {sevBadge(v.severity)}
                      <Badge variant="outline" className={v.status === "open" ? "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]" : v.status === "remediation" ? "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]"}>{v.status}</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Residency Rules" description="Per-data-type storage policy">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="Database" className="h-4 w-4 text-brand" />user_pii</span>
            <span className="text-xs text-muted-foreground">Must remain in user's home region</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="CreditCard" className="h-4 w-4 text-brand" />payments</span>
            <span className="text-xs text-muted-foreground">RBI-mandated: India only</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="FileText" className="h-4 w-4 text-brand" />kyc_docs</span>
            <span className="text-xs text-muted-foreground">India only — no cross-border</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <span className="flex items-center gap-2"><Icon name="Activity" className="h-4 w-4 text-brand" />analytics</span>
            <span className="text-xs text-muted-foreground">Anonymized — free flow</span>
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
