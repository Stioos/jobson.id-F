"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { daysUntil, formatDate } from "@/lib/format";

interface Renewal {
  id: string;
  partner: string;
  agreement: string;
  expiryDate: string;
  daysLeft: number;
  annualRevenue: number;
  renewalProb: number;
  status: "on-track" | "at-risk" | "negotiating" | "lost" | "renewed";
}

const RENEWALS: Renewal[] = [
  { id: "r_1", partner: "Partner North Pvt Ltd", agreement: "Master MoU (3-year)", expiryDate: "2025-08-12", daysLeft: 324, annualRevenue: 4_820_000, renewalProb: 92, status: "on-track" },
  { id: "r_2", partner: "South Talent Solutions", agreement: "Talent Pipeline MoU (2-year)", expiryDate: "2024-10-30", daysLeft: 38, annualRevenue: 6_120_000, renewalProb: 78, status: "negotiating" },
  { id: "r_3", partner: "West Skill Hub", agreement: "Skill Development MoU (1-year)", expiryDate: "2024-10-04", daysLeft: 12, annualRevenue: 1_420_000, renewalProb: 42, status: "at-risk" },
  { id: "r_4", partner: "East Career Network", agreement: "Campus Connect MoU (2-year)", expiryDate: "2025-02-18", daysLeft: 149, annualRevenue: 3_820_000, renewalProb: 84, status: "on-track" },
  { id: "r_5", partner: "Central Skills Pvt Ltd", agreement: "Franchise MoU (1-year)", expiryDate: "2024-09-30", daysLeft: 8, annualRevenue: 2_240_000, renewalProb: 24, status: "at-risk" },
  { id: "r_6", partner: "North East Talent Co.", agreement: "Placement Tie-up (1-year)", expiryDate: "2024-12-04", daysLeft: 73, annualRevenue: 1_840_000, renewalProb: 88, status: "on-track" },
  { id: "r_7", partner: "Partner North Pvt Ltd", agreement: "Skill Center Addendum", expiryDate: "2024-09-28", daysLeft: 6, annualRevenue: 940_000, renewalProb: 12, status: "lost" },
  { id: "r_8", partner: "VIT Vellore (Partner Wing)", agreement: "Campus Wing MoU (2-year)", expiryDate: "2025-04-22", daysLeft: 212, annualRevenue: 6_120_000, renewalProb: 96, status: "renewed" },
];

const FORECAST_BUCKETS = [
  { bucket: "0-30 days", count: 3, revenue: 4_600_000 },
  { bucket: "31-90 days", count: 2, revenue: 7_960_000 },
  { bucket: "91-180 days", count: 2, revenue: 9_940_000 },
  { bucket: "181-365 days", count: 1, revenue: 4_820_000 },
];

export function SuperAdminRenewalForecastPlatform() {
  const totalRevenue = RENEWALS.reduce((s, r) => s + r.annualRevenue, 0);
  const expiring90 = RENEWALS.filter(r => r.daysLeft <= 90);
  const atRiskRevenue = RENEWALS.filter(r => r.renewalProb < 50).reduce((s, r) => s + r.annualRevenue, 0);
  const weightedForecast = RENEWALS.reduce((s, r) => s + (r.annualRevenue * r.renewalProb / 100), 0);

  const statusBadge = (s: Renewal["status"]) => {
    const cls = s === "on-track" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "renewed" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : s === "negotiating" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "at-risk" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const probTone = (p: number) => p >= 75 ? "text-emerald-600" : p >= 50 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renewal Forecast (Platform)"
        description="Platform-wide renewal forecast — all MoUs/agreements expiring, partner, expiry date, days remaining, revenue impact, renewal probability, and status. Forecast chart and at-risk revenue calculation."
        icon={<Icon name="CalendarClock" className="h-6 w-6" />}
        actions={[{ label: "Export Forecast", variant: "outline", onClick: () => toast.success("Renewal forecast exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Renewals (12mo)" value={RENEWALS.length} icon={<Icon name="CalendarClock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Annual Revenue at Stake" value={`₹${(totalRevenue / 100000).toFixed(2)} L`} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expiring ≤90d" value={expiring90.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="At-Risk Revenue" value={`₹${(atRiskRevenue / 100000).toFixed(2)} L`} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Forecast (Next 12 months)" description="Renewals bucketed by expiry window">
        <div className="grid gap-3 md:grid-cols-4">
          {FORECAST_BUCKETS.map(b => {
            const maxRev = Math.max(...FORECAST_BUCKETS.map(x => x.revenue));
            const pct = Math.round((b.revenue / maxRev) * 100);
            return (
              <div key={b.bucket} className="rounded-lg border bg-card p-3">
                <p className="text-xs font-medium text-muted-foreground">{b.bucket}</p>
                <p className="mt-1 text-2xl font-semibold">{b.count}</p>
                <p className="text-[10px] text-muted-foreground">renewals</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs font-medium text-emerald-600">₹{(b.revenue / 100000).toFixed(1)} L</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700">
          <Icon name="TrendingUp" className="mr-1 inline h-4 w-4" /> Weighted forecast (probability-adjusted): <strong>₹{(weightedForecast / 100000).toFixed(2)} L</strong> expected to renew.
        </div>
      </SectionCard>

      <SectionCard title="At-Risk Renewals" description="Renewals with probability < 50%" contentClassName="p-0">
        {RENEWALS.filter(r => r.renewalProb < 50).length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No at-risk renewals" />
        ) : (
          <div className="divide-y">
            {RENEWALS.filter(r => r.renewalProb < 50).map(r => (
              <div key={r.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" className="mt-0.5 h-5 w-5 text-rose-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.partner}</span>
                      {statusBadge(r.status)}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.agreement} • expires {formatDate(r.expiryDate)} ({r.daysLeft}d)</p>
                    <p className="mt-0.5 text-xs"><span className="text-rose-600 font-medium">At risk:</span> ₹{(r.annualRevenue / 100000).toFixed(1)} L annual revenue</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Outreach initiated to ${r.partner}`)}>Initiate Outreach</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Renewal Pipeline" description="All renewals in next 12 months" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Agreement</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Annual Revenue</TableHead>
              <TableHead>Renewal Prob.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RENEWALS.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.partner}</TableCell>
                <TableCell className="text-xs">{r.agreement}</TableCell>
                <TableCell className="text-xs">{formatDate(r.expiryDate)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${r.daysLeft <= 30 ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : r.daysLeft <= 90 ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"}`}>
                    {r.daysLeft}d
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">₹{(r.annualRevenue / 100000).toFixed(1)} L</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${r.renewalProb >= 75 ? "bg-emerald-500" : r.renewalProb >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${r.renewalProb}%` }} />
                    </div>
                    <span className={`text-xs font-medium ${probTone(r.renewalProb)}`}>{r.renewalProb}%</span>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Negotiation opened: ${r.partner}`)}>Open</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
