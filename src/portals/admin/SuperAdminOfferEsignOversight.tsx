"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";

interface EsignVendor {
  id: string;
  name: string;
  volume: number;
  signedRate: number;
  avgTimeHrs: number;
  failed: number;
}

const VENDORS: EsignVendor[] = [
  { id: "es_001", name: "DocuSign", volume: 12480, signedRate: 96.4, avgTimeHrs: 4.8, failed: 89 },
  { id: "es_002", name: "eMudhra", volume: 8240, signedRate: 94.8, avgTimeHrs: 6.2, failed: 102 },
  { id: "es_003", name: "Adobe Sign", volume: 5180, signedRate: 95.1, avgTimeHrs: 5.4, failed: 61 },
  { id: "es_004", name: "PandaDoc", volume: 2840, signedRate: 92.6, avgTimeHrs: 8.1, failed: 48 },
  { id: "es_005", name: "SignDesk", volume: 1620, signedRate: 91.2, avgTimeHrs: 9.8, failed: 36 },
];

interface EsignDoc {
  id: string;
  document: string;
  candidate: string;
  employer: string;
  vendor: string;
  sentAt: string;
  signedAt?: string;
  status: "Signed" | "Pending" | "Failed" | "Expired";
}

const DOCS: EsignDoc[] = [
  { id: "ed_001", document: "Offer Letter — Sr React Dev", candidate: "Priya Nair", employer: "TechCorp India", vendor: "DocuSign", sentAt: "2024-09-19T10:00:00Z", signedAt: "2024-09-19T14:30:00Z", status: "Signed" },
  { id: "ed_002", document: "Offer Letter — Lead DevOps", candidate: "Arjun Kumar", employer: "CloudPeak Systems", vendor: "eMudhra", sentAt: "2024-09-18T09:00:00Z", status: "Pending" },
  { id: "ed_003", document: "NDA — ML Engineer", candidate: "Meera Joshi", employer: "DataInsight Labs", vendor: "Adobe Sign", sentAt: "2024-09-15T11:00:00Z", status: "Failed" },
  { id: "ed_004", document: "Offer Letter — HR Manager", candidate: "Vikram Shah", employer: "EduFirst", vendor: "DocuSign", sentAt: "2024-09-10T08:00:00Z", signedAt: "2024-09-10T16:00:00Z", status: "Signed" },
  { id: "ed_005", document: "Employment Agreement", candidate: "Deepa Menon", employer: "TechCorp India", vendor: "PandaDoc", sentAt: "2024-09-05T13:00:00Z", status: "Expired" },
];

const STATUS_TONE: Record<string, string> = {
  Signed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Expired: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

export function SuperAdminOfferEsignOversight() {
  const totalVol = VENDORS.reduce((s, v) => s + v.volume, 0);
  const avgSigned = VENDORS.reduce((s, v) => s + v.signedRate * v.volume, 0) / totalVol;
  const totalFailed = VENDORS.reduce((s, v) => s + v.failed, 0);
  const avgTime = VENDORS.reduce((s, v) => s + v.avgTimeHrs * v.volume, 0) / totalVol;

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-Sign Oversight"
        description="Electronic signature vendor oversight — volume, signing rates, time-to-sign, and audit trail for all signed documents."
        icon={<Icon name="FileSignature" className="h-6 w-6" />}
        actions={[{ label: "Audit Trail", variant: "outline", onClick: () => toast.success("E-sign audit trail exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Docs (30d)" value={totalVol.toLocaleString("en-IN")} delta={{ value: "+11.8%", positive: true }} icon={<Icon name="FileSignature" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Signing Rate" value={`${avgSigned.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Sign" value={`${avgTime.toFixed(1)} hrs`} delta={{ value: "-0.6h", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Failed" value={totalFailed} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Vendor Scorecard" description="E-signature vendor performance">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead>Signing Rate</TableHead>
              <TableHead>Avg Time</TableHead>
              <TableHead className="text-right">Failed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VENDORS.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="text-right">{v.volume.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress className="h-1.5 w-24" value={v.signedRate} />
                    <span className={`text-xs font-medium ${v.signedRate >= 95 ? "text-emerald-700" : v.signedRate >= 92 ? "text-amber-700" : "text-rose-700"}`}>{v.signedRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{v.avgTimeHrs} hrs</TableCell>
                <TableCell className="text-right text-rose-700">{v.failed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="E-Signed Documents" description="All signed documents across platform" contentClassName="p-0">
        {DOCS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="FileSignature" className="h-5 w-5" />} title="No documents yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCS.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.document}</TableCell>
                  <TableCell className="text-sm">{d.candidate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.employer}</TableCell>
                  <TableCell><Badge variant="outline">{d.vendor}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(d.sentAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.signedAt ? formatDateTime(d.signedAt) : "—"}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[d.status]}`}>{d.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Audit Trail Highlights" description="Recent activity logs from all vendors">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 rounded-md border bg-card p-2.5"><Icon name="CheckCircle2" className="h-4 w-4 text-emerald-600" /><span><b>Priya Nair</b> signed offer letter via <b>DocuSign</b> (4h 30m)</span></li>
          <li className="flex items-center gap-2 rounded-md border bg-card p-2.5"><Icon name="X" className="h-4 w-4 text-rose-600" /><span><b>Meera Joshi</b> NDA signing failed via <b>Adobe Sign</b> (auth error)</span></li>
          <li className="flex items-center gap-2 rounded-md border bg-card p-2.5"><Icon name="Clock" className="h-4 w-4 text-amber-600" /><span><b>Arjun Kumar</b> offer letter pending via <b>eMudhra</b> (2 days elapsed)</span></li>
        </ul>
      </SectionCard>
    </div>
  );
}
