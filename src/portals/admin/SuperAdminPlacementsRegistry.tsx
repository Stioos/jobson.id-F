"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

type FeeType = "Commission" | "Salary" | "Subscription" | "Placement Fee";
type PlacementStatus = "Active" | "In Guarantee" | "Completed" | "Replaced" | "Refunded";

interface PlacementRow {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  portal: string;
  placedAt: string;
  feeType: FeeType;
  fee: number;
  guaranteeDays: number;
  status: PlacementStatus;
}

const PLACEMENTS: PlacementRow[] = [
  { id: "pl_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Senior React Developer", portal: "Employer", placedAt: "2024-09-19", feeType: "Commission", fee: 2_80_000, guaranteeDays: 90, status: "In Guarantee" },
  { id: "pl_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", portal: "Recruiter", placedAt: "2024-09-12", feeType: "Placement Fee", fee: 3_60_000, guaranteeDays: 90, status: "Active" },
  { id: "pl_003", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", portal: "Partner", placedAt: "2024-09-05", feeType: "Salary", fee: 1_20_000, guaranteeDays: 60, status: "Completed" },
  { id: "pl_004", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", portal: "Employer", placedAt: "2024-08-28", feeType: "Commission", fee: 4_20_000, guaranteeDays: 90, status: "Active" },
  { id: "pl_005", candidate: "Ravi Subramanian", employer: "DataInsight Labs", role: "Data Engineer", portal: "Recruiter", placedAt: "2024-08-15", feeType: "Subscription", fee: 1_50_000, guaranteeDays: 60, status: "Replaced" },
  { id: "pl_006", candidate: "Sara Khan", employer: "Retail Boost", role: "Store Manager", portal: "Employer", placedAt: "2024-08-01", feeType: "Placement Fee", fee: 95_000, guaranteeDays: 30, status: "Refunded" },
  { id: "pl_007", candidate: "Mohit Agarwal", employer: "NaukriX", role: "Python Backend", portal: "Recruiter", placedAt: "2024-07-22", feeType: "Commission", fee: 2_60_000, guaranteeDays: 90, status: "Completed" },
];

const STATUS_TONE: Record<PlacementStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "In Guarantee": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Completed: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  Replaced: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Refunded: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const FEE_TONE: Record<FeeType, string> = {
  Commission: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Salary: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Subscription: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  "Placement Fee": "bg-violet-500/10 text-violet-700 border-violet-500/20",
};

export function SuperAdminPlacementsRegistry() {
  const totalRevenue = PLACEMENTS.reduce((s, p) => s + (p.status !== "Refunded" ? p.fee : 0), 0);
  const refunded = PLACEMENTS.filter(p => p.status === "Refunded").reduce((s, p) => s + p.fee, 0);
  const netRevenue = totalRevenue - refunded;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placements Registry"
        description="All placements across the platform — every revenue event, fee type, guarantee status, and trend."
        icon={<Icon name="BadgeCheck" className="h-6 w-6" />}
        actions={[{ label: "Revenue Report", variant: "outline", onClick: () => toast.success("Placement revenue report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Placements (90d)" value="1,247" delta={{ value: "+14.6%", positive: true }} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Gross Revenue" value={formatCurrency(totalRevenue)} icon={<Icon name="Coins" className="h-5 w-5" />} tone="success" />
        <StatCard label="Net Revenue" value={formatCurrency(netRevenue)} delta={{ value: "+8.2%", positive: true }} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Refunds Issued" value={formatCurrency(refunded)} icon={<Icon name="RotateCcw" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Placement Rate Trend (6mo)" description="Monthly placement volume">
        <div className="flex h-36 items-end gap-3">
          {[180, 195, 210, 224, 236, 248].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t bg-brand/70" style={{ height: `${(v / 248) * 100}%` }} /></div>
              <div className="text-[10px] text-muted-foreground">{["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}</div>
              <div className="text-xs font-medium">{v}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Fee Type Distribution" description="Revenue by fee model">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(["Commission", "Placement Fee", "Subscription", "Salary"] as FeeType[]).map(ft => {
            const items = PLACEMENTS.filter(p => p.feeType === ft);
            const rev = items.reduce((s, p) => s + p.fee, 0);
            return (
              <div key={ft} className="rounded-lg border bg-card p-3">
                <Badge variant="outline" className={FEE_TONE[ft]}>{ft}</Badge>
                <p className="mt-2 text-lg font-semibold text-emerald-700">{formatCurrency(rev)}</p>
                <p className="text-xs text-muted-foreground">{items.length} placements</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="All Placements" description="Every placement — a revenue event" contentClassName="p-0">
        {PLACEMENTS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="BadgeCheck" className="h-5 w-5" />} title="No placements yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead>Guarantee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PLACEMENTS.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.candidate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.employer}</TableCell>
                  <TableCell className="text-sm">{p.role}</TableCell>
                  <TableCell><Badge variant="outline">{p.portal}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(p.placedAt)}</TableCell>
                  <TableCell><Badge variant="outline" className={FEE_TONE[p.feeType]}>{p.feeType}</Badge></TableCell>
                  <TableCell className="text-right font-medium text-emerald-700">{formatCurrency(p.fee)}</TableCell>
                  <TableCell className="text-xs">{p.guaranteeDays}d</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[p.status]}`}>{p.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
