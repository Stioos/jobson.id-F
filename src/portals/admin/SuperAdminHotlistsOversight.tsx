"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Hotlist {
  id: string;
  name: string;
  owner: string;
  ownerType: "Recruiter" | "Employer";
  size: number;
  lastUpdated: string;
  placements: number;
  shared: boolean;
  stale: boolean;
}

const HOTLISTS: Hotlist[] = [
  { id: "hl_001", name: "Immediate Joiners — Bengaluru", owner: "Sneha Reddy", ownerType: "Recruiter", size: 48, lastUpdated: "2024-09-21T08:00:00Z", placements: 12, shared: true, stale: false },
  { id: "hl_002", name: "Senior Architects Available", owner: "Rohan Mehta", ownerType: "Employer", size: 24, lastUpdated: "2024-09-20T14:00:00Z", placements: 6, shared: false, stale: false },
  { id: "hl_003", name: "Notice Period Ending (30d)", owner: "Vikram Singh", ownerType: "Recruiter", size: 62, lastUpdated: "2024-09-19T11:00:00Z", placements: 18, shared: true, stale: false },
  { id: "hl_004", name: "Top DevOps Talent Q4", owner: "Sneha Reddy", ownerType: "Recruiter", size: 36, lastUpdated: "2024-08-15T10:00:00Z", placements: 4, shared: false, stale: true },
  { id: "hl_005", name: "Active Sales Leaders", owner: "Imran Khan", ownerType: "Recruiter", size: 28, lastUpdated: "2024-09-18T16:00:00Z", placements: 8, shared: true, stale: false },
  { id: "hl_006", name: "Remote-Ready Engineers", owner: "Latha Raman", ownerType: "Employer", size: 42, lastUpdated: "2024-07-20T09:00:00Z", placements: 2, shared: false, stale: true },
  { id: "hl_007", name: "Premium Product Managers", owner: "TechCorp India", ownerType: "Employer", size: 18, lastUpdated: "2024-09-17T12:00:00Z", placements: 4, shared: false, stale: false },
];

export function SuperAdminHotlistsOversight() {
  const total = HOTLISTS.length;
  const totalCandidates = HOTLISTS.reduce((s, h) => s + h.size, 0);
  const shared = HOTLISTS.filter(h => h.shared).length;
  const stale = HOTLISTS.filter(h => h.stale).length;
  const totalPlacements = HOTLISTS.reduce((s, h) => s + h.placements, 0);
  const placementRate = (totalPlacements / totalCandidates) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotlists Oversight"
        description="All hotlists across recruiters and employers — priority candidate pools, placement rates, stale detection, and sharing audit."
        icon={<Icon name="Flame" className="h-6 w-6" />}
        actions={[{ label: "Export Report", variant: "outline", onClick: () => toast.success("Hotlists report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Hotlists" value={total.toString()} icon={<Icon name="Flame" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates on Hotlists" value={totalCandidates.toString()} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Placement Rate" value={`${placementRate.toFixed(1)}%`} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Stale Hotlists" value={stale.toString()} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Stale Hotlist Detection" description="Hotlists with no updates in 30+ days" className="border-amber-500/30">
        {HOTLISTS.filter(h => h.stale).length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No stale hotlists" />
        ) : (
          <ul className="space-y-2">
            {HOTLISTS.filter(h => h.stale).map(h => (
              <li key={h.id} className="flex flex-col gap-1 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertCircle" className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">{h.name}</span>
                    <span className="text-xs text-muted-foreground">— {h.size} candidates</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last updated: {timeAgo(h.lastUpdated)} · Owner: {h.owner}</p>
                </div>
                <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30">Refresh needed</Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Sharing Audit" description="Cross-organization hotlist sharing activity">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Shared Hotlists</p><p className="mt-1 text-lg font-semibold text-amber-700">{shared}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Private</p><p className="mt-1 text-lg font-semibold">{total - shared}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Sharing Compliance</p><p className="mt-1 text-lg font-semibold text-emerald-700">99.2%</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Policy Violations</p><p className="mt-1 text-lg font-semibold text-rose-700">2</p></div>
        </div>
      </SectionCard>

      <SectionCard title="All Hotlists" description="Priority candidate hotlists across platform" contentClassName="p-0">
        {HOTLISTS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Flame" className="h-5 w-5" />} title="No hotlists yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotlist</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Placements</TableHead>
                <TableHead>Placement Rate</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HOTLISTS.map(h => {
                const rate = (h.placements / h.size) * 100;
                return (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Icon name="Flame" className="h-3.5 w-3.5 text-orange-500" />
                        {h.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{h.owner}</TableCell>
                    <TableCell><Badge variant="outline">{h.ownerType}</Badge></TableCell>
                    <TableCell className="text-right text-sm font-medium">{h.size}</TableCell>
                    <TableCell className="text-right text-sm text-emerald-700">{h.placements}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress className="h-1.5 w-16" value={Math.min(100, rate * 3)} />
                        <span className="text-xs font-medium text-emerald-700">{rate.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{h.shared ? <Icon name="Share2" className="h-4 w-4 text-amber-500" /> : <Icon name="Lock" className="h-4 w-4 text-slate-400" />}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(h.lastUpdated)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={h.stale ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"}>{h.stale ? "Stale" : "Active"}</Badge>
                    </TableCell>
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
