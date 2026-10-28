"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/format";

interface Dispute {
  id: string; recruiter: string; portal: string; disputedAmount: number; reason: string; evidence: number; status: "open" | "investigating" | "resolved_favor_recruiter" | "resolved_favor_platform"; openedAt: string; assignee?: string;
}

const DISPUTES: Dispute[] = [
  { id: "DSP-2401", recruiter: "HireRight India", portal: "recruiter", disputedAmount: 18_000, reason: "Commission not credited for placement #PRJ-9921", evidence: 3, status: "open", openedAt: "2024-09-22T10:00:00Z" },
  { id: "DSP-2400", recruiter: "Apex Recruit", portal: "recruiter", disputedAmount: 36_000, reason: "Slab miscalculation on bulk hire batch", evidence: 5, status: "investigating", openedAt: "2024-09-21T15:30:00Z", assignee: "Rohit S." },
  { id: "DSP-2399", recruiter: "TalentBridge", portal: "partner", disputedAmount: 22_400, reason: "Revenue share percentage mismatch", evidence: 2, status: "investigating", openedAt: "2024-09-21T09:00:00Z", assignee: "Anita R." },
  { id: "DSP-2398", recruiter: "NorthStar", portal: "partner", disputedAmount: 4_800, reason: "Refund deducted from commission", evidence: 4, status: "resolved_favor_recruiter", openedAt: "2024-09-18T14:00:00Z" },
  { id: "DSP-2397", recruiter: "SoftSkill Studio", portal: "training", disputedAmount: 2_400, reason: "Cert fee disputed by candidate", evidence: 1, status: "resolved_favor_platform", openedAt: "2024-09-17T11:00:00Z" },
  { id: "DSP-2396", recruiter: "BlueWave HR", portal: "recruiter", disputedAmount: 12_400, reason: "Duplicate commission deduction", evidence: 2, status: "resolved_favor_recruiter", openedAt: "2024-09-16T09:30:00Z" },
];

const BY_REASON = [
  { reason: "Slab miscalculation", count: 12, amount: 1_84_000 },
  { reason: "Revenue share mismatch", count: 8, amount: 1_20_400 },
  { reason: "Refund deduction", count: 6, amount: 48_400 },
  { reason: "Duplicate deduction", count: 4, amount: 24_800 },
  { reason: "Placement not credited", count: 3, amount: 36_000 },
];

const BY_RECRUITER = [
  { name: "HireRight India", disputes: 5, resolved: 4, open: 1 },
  { name: "Apex Recruit", disputes: 4, resolved: 3, open: 1 },
  { name: "TalentBridge", disputes: 3, resolved: 2, open: 1 },
  { name: "NorthStar", disputes: 3, resolved: 3, open: 0 },
];

export function SuperAdminCommissionDisputes() {
  const open = DISPUTES.filter(d => d.status === "open" || d.status === "investigating");
  const disputed = DISPUTES.reduce((s, d) => s + d.disputedAmount, 0);
  const resolved = DISPUTES.filter(d => d.status.startsWith("resolved")).length;
  const resolutionRate = (resolved / DISPUTES.length) * 100;

  const statusBadge = (s: string) => {
    const cls = s === "open" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "investigating" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "resolved_favor_recruiter" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";
    const label = s === "resolved_favor_recruiter" ? "resolved: recruiter"
      : s === "resolved_favor_platform" ? "resolved: platform" : s;
    return <Badge variant="outline" className={cls}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Disputes"
        description="Cross-portal commission dispute queue with evidence, resolution workflow, and analytics."
        icon={<Icon name="AlertCircle" className="h-6 w-6" />}
        actions={[
          { label: "Dispute Policy", variant: "outline", onClick: () => toast.info("Opening commission dispute policy") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open Disputes" value={open.length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Disputed Amount" value={formatCurrency(disputed)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Resolution Rate" value={`${resolutionRate.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Resolution Time" value="3.2d" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Dispute Queue" description="All open & recently resolved disputes" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Recruiter / Partner</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DISPUTES.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.id}</TableCell>
                <TableCell className="font-medium">{d.recruiter}</TableCell>
                <TableCell><Badge variant="outline">{d.portal}</Badge></TableCell>
                <TableCell className="font-medium">{formatCurrency(d.disputedAmount)}</TableCell>
                <TableCell className="text-xs max-w-xs truncate">{d.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{d.evidence} files</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{timeAgo(d.openedAt)}</TableCell>
                <TableCell>{statusBadge(d.status)}</TableCell>
                <TableCell>
                  {d.status === "open" || d.status === "investigating" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Dispute ${d.id} resolved in favor of recruiter`)}>Favor Recruiter</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info(`Dispute ${d.id} resolved in favor of platform`)}>Favor Platform</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${d.id} resolution notes`)}>Notes</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Disputes by Reason" description="Top dispute categories (30d)">
          <ul className="space-y-2">
            {BY_REASON.map(r => (
              <li key={r.reason} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div>
                  <p className="font-medium">{r.reason}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.count} disputes</p>
                </div>
                <span className="font-medium">{formatCurrency(r.amount)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Disputes by Recruiter" description="Top disputing recruiters">
          {BY_RECRUITER.length === 0 ? (
            <EmptyState icon={<Icon name="Users2" className="h-5 w-5" />} title="No data" />
          ) : (
            <ul className="space-y-2">
              {BY_RECRUITER.map(r => (
                <li key={r.name} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.resolved} resolved · {r.open} open</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{r.disputes} total</Badge>
                    {r.open > 0 && <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">{r.open} open</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
