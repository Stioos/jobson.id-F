"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface TalentPool {
  id: string;
  name: string;
  owner: string;
  ownerType: "Employer" | "Recruiter";
  size: number;
  growth30d: number;
  lastActivity: string;
  shared: boolean;
  placements: number;
  stale: boolean;
}

const POOLS: TalentPool[] = [
  { id: "tp_001", name: "Senior Frontend Engineers", owner: "TechCorp India", ownerType: "Employer", size: 482, growth30d: 12, lastActivity: "2024-09-21T08:00:00Z", shared: false, placements: 18, stale: false },
  { id: "tp_002", name: "DevOps Specialists Pool", owner: "Sneha Reddy", ownerType: "Recruiter", size: 318, growth30d: 8, lastActivity: "2024-09-20T14:00:00Z", shared: true, placements: 24, stale: false },
  { id: "tp_003", name: "ML Engineers — Bengaluru", owner: "DataInsight Labs", ownerType: "Employer", size: 214, growth30d: -4, lastActivity: "2024-08-15T10:00:00Z", shared: false, placements: 6, stale: true },
  { id: "tp_004", name: "Sales Leaders", owner: "Imran Khan", ownerType: "Recruiter", size: 142, growth30d: 18, lastActivity: "2024-09-19T11:00:00Z", shared: true, placements: 12, stale: false },
  { id: "tp_005", name: "HR Managers — South India", owner: "Latha Raman", ownerType: "Recruiter", size: 88, growth30d: -2, lastActivity: "2024-07-20T09:00:00Z", shared: false, placements: 2, stale: true },
  { id: "tp_006", name: "Product Designers", owner: "TechCorp India", ownerType: "Employer", size: 124, growth30d: 6, lastActivity: "2024-09-18T16:00:00Z", shared: false, placements: 8, stale: false },
];

export function SuperAdminTalentPoolOversight() {
  const total = POOLS.length;
  const totalCandidates = POOLS.reduce((s, p) => s + p.size, 0);
  const shared = POOLS.filter(p => p.shared).length;
  const stale = POOLS.filter(p => p.stale).length;
  const totalPlacements = POOLS.reduce((s, p) => s + p.placements, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pools"
        description="All talent pools across employers and recruiters — pool health, sharing audit, stale detection, and marketplace potential."
        icon={<Icon name="Database" className="h-6 w-6" />}
        actions={[{ label: "Marketplace Report", variant: "outline", onClick: () => toast.success("Talent pool marketplace report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Pools" value={total.toString()} icon={<Icon name="Database" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates in Pools" value={totalCandidates.toLocaleString("en-IN")} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Shared Pools" value={shared.toString()} icon={<Icon name="Share2" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Stale Pools" value={stale.toString()} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Stale Pool Detection" description="Pools with no activity in 30+ days" className="border-amber-500/30">
        {POOLS.filter(p => p.stale).length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No stale pools detected" />
        ) : (
          <ul className="space-y-2">
            {POOLS.filter(p => p.stale).map(p => (
              <li key={p.id} className="flex flex-col gap-1 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertCircle" className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">— {p.size} candidates · {p.placements} placements</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last activity: {timeAgo(p.lastActivity)} · Owner: {p.owner}</p>
                </div>
                <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30">Archival candidate</Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Sharing Audit" description="Cross-organization talent pool sharing activity">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Shared Pools</p><p className="mt-1 text-lg font-semibold text-amber-700">{shared}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Private Pools</p><p className="mt-1 text-lg font-semibold">{total - shared}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Marketplace Eligible</p><p className="mt-1 text-lg font-semibold text-emerald-700">{Math.floor(shared * 0.6)}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Sharing Compliance</p><p className="mt-1 text-lg font-semibold text-emerald-700">98.4%</p></div>
        </div>
      </SectionCard>

      <SectionCard title="All Talent Pools" description="Every pool across employers and recruiters" contentClassName="p-0">
        {POOLS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Database" className="h-5 w-5" />} title="No talent pools yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead className="text-right">Placements</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POOLS.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm">{p.owner}</TableCell>
                  <TableCell><Badge variant="outline">{p.ownerType}</Badge></TableCell>
                  <TableCell className="text-right text-sm font-medium">{p.size}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${p.growth30d > 0 ? "text-emerald-700" : p.growth30d < 0 ? "text-rose-700" : "text-muted-foreground"}`}>
                      {p.growth30d > 0 ? "▲" : p.growth30d < 0 ? "▼" : "—"} {Math.abs(p.growth30d)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-emerald-700">{p.placements}</TableCell>
                  <TableCell>{p.shared ? <Icon name="Share2" className="h-4 w-4 text-amber-500" /> : <Icon name="Lock" className="h-4 w-4 text-slate-400" />}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(p.lastActivity)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.stale ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"}>{p.stale ? "Stale" : "Active"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
