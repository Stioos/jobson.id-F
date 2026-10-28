"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

type GStatus = "Active" | "Expiring" | "Expired" | "Triggered";

interface Guarantee {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  portal: string;
  placedAt: string;
  guaranteeEnd: string;
  feeAmount: number;
  status: GStatus;
  replacementCandidate?: string;
}

const GUARANTEES: Guarantee[] = [
  { id: "gr_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Sr React Dev", portal: "Employer", placedAt: "2024-09-19", guaranteeEnd: "2024-12-18", feeAmount: 2_80_000, status: "Active" },
  { id: "gr_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", portal: "Recruiter", placedAt: "2024-09-12", guaranteeEnd: "2024-12-11", feeAmount: 3_60_000, status: "Active" },
  { id: "gr_003", candidate: "Ravi Subramanian", employer: "DataInsight Labs", role: "Data Engineer", portal: "Recruiter", placedAt: "2024-08-15", guaranteeEnd: "2024-10-14", feeAmount: 2_20_000, status: "Triggered", replacementCandidate: "Anita Singh" },
  { id: "gr_004", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", portal: "Employer", placedAt: "2024-08-28", guaranteeEnd: "2024-11-26", feeAmount: 4_20_000, status: "Expiring" },
  { id: "gr_005", candidate: "Sara Khan", employer: "Retail Boost", role: "Store Manager", portal: "Employer", placedAt: "2024-07-01", guaranteeEnd: "2024-07-31", feeAmount: 95_000, status: "Expired" },
  { id: "gr_006", candidate: "Mohit Agarwal", employer: "NaukriX", role: "Python Backend", portal: "Recruiter", placedAt: "2024-07-22", guaranteeEnd: "2024-10-20", feeAmount: 2_60_000, status: "Expiring" },
  { id: "gr_007", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", portal: "Partner", placedAt: "2024-09-05", guaranteeEnd: "2024-11-04", feeAmount: 1_20_000, status: "Active" },
];

const STATUS_TONE: Record<GStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Expiring: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Expired: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  Triggered: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminGuaranteeTracking() {
  const active = GUARANTEES.filter(g => g.status === "Active").length;
  const expiring = GUARANTEES.filter(g => g.status === "Expiring").length;
  const triggered = GUARANTEES.filter(g => g.status === "Triggered").length;
  const atRisk = GUARANTEES.filter(g => g.status === "Triggered" || g.status === "Expiring").reduce((s, g) => s + g.feeAmount, 0);
  const totalCovered = GUARANTEES.filter(g => g.status !== "Expired").reduce((s, g) => s + g.feeAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guarantee Tracking"
        description="Platform-wide replacement guarantee tracking — every placement under guarantee, with revenue impact of replacements."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Risk Report", variant: "outline", onClick: () => toast.success("Guarantee risk report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Guarantees" value={active} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring (30d)" value={expiring} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Triggered" value={triggered} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="At-Risk Revenue" value={formatCurrency(atRisk)} icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Revenue Impact Summary" description="Total placement fees currently under guarantee coverage">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Covered Revenue</p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">{formatCurrency(totalCovered)}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">At-Risk Revenue</p>
            <p className="mt-1 text-lg font-semibold text-rose-700">{formatCurrency(atRisk)}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Replacement Rate</p>
            <p className="mt-1 text-lg font-semibold text-amber-700">{((triggered / GUARANTEES.length) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Triggered Guarantees — Replacement Queue" description="Placements where replacement candidate is being sourced" className="border-rose-500/30">
        {GUARANTEES.filter(g => g.status === "Triggered").length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No triggered guarantees" />
        ) : (
          <ul className="space-y-2">
            {GUARANTEES.filter(g => g.status === "Triggered").map(g => (
              <li key={g.id} className="flex flex-col gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertCircle" className="h-4 w-4 text-rose-600" />
                    <span className="font-medium">{g.candidate}</span>
                    <span className="text-xs text-muted-foreground">→ {g.employer} · {g.role}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Original fee: {formatCurrency(g.feeAmount)} · Replacement candidate: <b>{g.replacementCandidate}</b></p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 h-8" onClick={() => toast.success("Replacement tracking opened")}>Track</Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="All Guarantees" description="Every placement with active or expired guarantee" contentClassName="p-0">
        {GUARANTEES.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No guarantees tracked yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer / Role</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Guarantee End</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GUARANTEES.map(g => {
                const days = daysUntil(g.guaranteeEnd);
                return (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.candidate}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{g.employer}</div>
                      <div className="text-[10px] text-muted-foreground">{g.role}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{g.portal}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(g.placedAt)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(g.guaranteeEnd)}</TableCell>
                    <TableCell>
                      {g.status === "Expired" ? <span className="text-xs text-slate-500">—</span> : (
                        <div className="flex items-center gap-2">
                          <Progress className="h-1.5 w-16" value={Math.max(0, Math.min(100, (days / 90) * 100))} />
                          <span className={`text-xs font-medium ${days <= 7 ? "text-rose-700" : days <= 30 ? "text-amber-700" : "text-emerald-700"}`}>{days}d</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-700">{formatCurrency(g.feeAmount)}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[g.status]}`}>{g.status}</span></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
