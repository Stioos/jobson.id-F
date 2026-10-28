"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Vendor {
  id: string;
  name: string;
  volume: number;
  successRate: number;
  tatDays: number;
  flagged: number;
  marketShare: number;
}

const VENDORS: Vendor[] = [
  { id: "v_001", name: "AuthBridge", volume: 8420, successRate: 97.2, tatDays: 4.2, flagged: 86, marketShare: 38 },
  { id: "v_002", name: "IDfy", volume: 6210, successRate: 95.8, tatDays: 3.8, flagged: 62, marketShare: 28 },
  { id: "v_003", name: "SpringVerify", volume: 4180, successRate: 94.1, tatDays: 5.1, flagged: 78, marketShare: 19 },
  { id: "v_004", name: "BackgroundCheck360", volume: 2180, successRate: 92.4, tatDays: 6.3, flagged: 41, marketShare: 10 },
  { id: "v_005", name: "VerifyNow", volume: 1120, successRate: 89.6, tatDays: 7.8, flagged: 28, marketShare: 5 },
];

interface BgvCheck {
  id: string;
  candidate: string;
  employer: string;
  vendor: string;
  initiatedAt: string;
  completedAt?: string;
  status: "Completed" | "In Progress" | "Flagged" | "Failed";
  checks: string[];
}

const CHECKS: BgvCheck[] = [
  { id: "bgv_001", candidate: "Priya Nair", employer: "TechCorp India", vendor: "AuthBridge", initiatedAt: "2024-09-19", completedAt: "2024-09-23", status: "Completed", checks: ["Identity", "Address", "Education", "Employment", "Criminal"] },
  { id: "bgv_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", vendor: "IDfy", initiatedAt: "2024-09-18", status: "In Progress", checks: ["Identity", "Address", "Employment"] },
  { id: "bgv_003", candidate: "Meera Joshi", employer: "DataInsight Labs", vendor: "SpringVerify", initiatedAt: "2024-09-15", completedAt: "2024-09-20", status: "Flagged", checks: ["Identity", "Education", "Criminal"] },
  { id: "bgv_004", candidate: "Vikram Shah", employer: "EduFirst", vendor: "AuthBridge", initiatedAt: "2024-09-10", completedAt: "2024-09-14", status: "Completed", checks: ["Identity", "Address", "Education", "Employment"] },
  { id: "bgv_005", candidate: "Deepa Menon", employer: "TechCorp India", vendor: "BackgroundCheck360", initiatedAt: "2024-09-08", status: "Failed", checks: ["Identity"] },
];

const STATUS_TONE: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "In Progress": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Flagged: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Failed: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

export function SuperAdminBgvOversight() {
  const totalVol = VENDORS.reduce((s, v) => s + v.volume, 0);
  const avgSuccess = VENDORS.reduce((s, v) => s + v.successRate * v.volume, 0) / totalVol;
  const totalFlagged = VENDORS.reduce((s, v) => s + v.flagged, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="BGV Oversight"
        description="Background verification vendor oversight — volume, success rates, TAT, and flagged results across the platform."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Vendor Report", variant: "outline", onClick: () => toast.success("BGV vendor report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Checks (30d)" value={totalVol.toLocaleString("en-IN")} delta={{ value: "+5.4%", positive: true }} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Success Rate" value={`${avgSuccess.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg TAT" value="4.8 days" delta={{ value: "-0.4d", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Flagged" value={totalFlagged} icon={<Icon name="Flag" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Vendor Performance Scorecard" description="All BGV vendors — ranked by success rate">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>TAT (days)</TableHead>
              <TableHead className="text-right">Flagged</TableHead>
              <TableHead>Market Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VENDORS.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="text-right">{v.volume.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress className="h-1.5 w-20" value={v.successRate} />
                    <span className={`text-xs font-medium ${v.successRate >= 95 ? "text-emerald-700" : v.successRate >= 90 ? "text-amber-700" : "text-rose-700"}`}>{v.successRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{v.tatDays}d</TableCell>
                <TableCell className="text-right text-rose-700">{v.flagged}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress className="h-1.5 w-20" value={v.marketShare} />
                    <span className="text-xs text-muted-foreground">{v.marketShare}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Recent BGV Checks" description="All checks across platform" contentClassName="p-0">
        {CHECKS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No BGV checks yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Initiated</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Checks</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CHECKS.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.candidate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.employer}</TableCell>
                  <TableCell><Badge variant="outline">{c.vendor}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(c.initiatedAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.completedAt ? formatDate(c.completedAt) : "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.checks.map(ch => <Badge key={ch} variant="secondary" className="text-[10px]">{ch}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[c.status]}`}>{c.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
