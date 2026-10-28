"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

type Channel = "LinkedIn" | "Naukri" | "Referral" | "Indeed" | "Email" | "Direct";

interface Campaign {
  id: string;
  name: string;
  recruiter: string;
  channel: Channel;
  budget: number;
  spent: number;
  candidatesSourced: number;
  conversions: number;
  startedAt: string;
  status: "Active" | "Paused" | "Completed";
}

const CAMPAIGNS: Campaign[] = [
  { id: "sc_001", name: "Q3 Senior React Drive", recruiter: "Sneha Reddy", channel: "LinkedIn", budget: 2_80_000, spent: 1_92_000, candidatesSourced: 142, conversions: 18, startedAt: "2024-09-01", status: "Active" },
  { id: "sc_002", name: "DevOps Talent Pull", recruiter: "Rohan Mehta", channel: "Naukri", budget: 1_50_000, spent: 1_50_000, candidatesSourced: 88, conversions: 12, startedAt: "2024-08-15", status: "Completed" },
  { id: "sc_003", name: "Employee Referral Boost", recruiter: "Vikram Singh", channel: "Referral", budget: 80_000, spent: 48_000, candidatesSourced: 56, conversions: 14, startedAt: "2024-09-10", status: "Active" },
  { id: "sc_004", name: "ML Engineer Outreach", recruiter: "Sneha Reddy", channel: "Email", budget: 1_20_000, spent: 64_000, candidatesSourced: 64, conversions: 6, startedAt: "2024-09-05", status: "Active" },
  { id: "sc_005", name: "Sales Exec Bulk Hire", recruiter: "Imran Khan", channel: "Indeed", budget: 60_000, spent: 28_000, candidatesSourced: 110, conversions: 8, startedAt: "2024-09-12", status: "Paused" },
  { id: "sc_006", name: "Direct Sourcing — Cloud", recruiter: "Latha Raman", channel: "Direct", budget: 40_000, spent: 12_000, candidatesSourced: 22, conversions: 2, startedAt: "2024-09-18", status: "Active" },
];

const STATUS_TONE: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Paused: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Completed: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

export function SuperAdminSourcingCampaigns() {
  const totalBudget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const totalSourced = CAMPAIGNS.reduce((s, c) => s + c.candidatesSourced, 0);
  const totalConv = CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);
  const avgCpc = totalSpent / totalSourced;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sourcing Campaigns"
        description="All sourcing campaigns across recruiters — channel effectiveness, ROI, cost-per-candidate, and conversion metrics."
        icon={<Icon name="Megaphone" className="h-6 w-6" />}
        actions={[{ label: "ROI Report", variant: "outline", onClick: () => toast.success("Campaign ROI report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Budget" value={formatCurrency(totalBudget)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Spent" value={formatCurrency(totalSpent)} icon={<Icon name="Coins" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Candidates Sourced" value={totalSourced.toString()} delta={{ value: "+14%", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Cost/Candidate" value={formatCurrency(avgCpc)} icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Channel Effectiveness" description="ROI by sourcing channel">
        <div className="space-y-2.5">
          {(["LinkedIn", "Naukri", "Referral", "Indeed", "Email", "Direct"] as Channel[]).map(ch => {
            const items = CAMPAIGNS.filter(c => c.channel === ch);
            if (items.length === 0) return null;
            const sourced = items.reduce((s, c) => s + c.candidatesSourced, 0);
            const conv = items.reduce((s, c) => s + c.conversions, 0);
            const spent = items.reduce((s, c) => s + c.spent, 0);
            const cpc = spent / sourced;
            const convRate = (conv / sourced) * 100;
            return (
              <div key={ch}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><Badge variant="outline">{ch}</Badge><span className="text-xs text-muted-foreground">{items.length} campaigns</span></div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{sourced} sourced</span>
                    <span className="text-emerald-700">{conv} conv ({convRate.toFixed(1)}%)</span>
                    <span className="font-medium">{formatCurrency(cpc)}/cand</span>
                  </div>
                </div>
                <Progress className="mt-1 h-2" value={Math.min(100, convRate * 5)} />
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="All Sourcing Campaigns" description="Every campaign across recruiters" contentClassName="p-0">
        {CAMPAIGNS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Megaphone" className="h-5 w-5" />} title="No campaigns yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead className="text-right">Sourced</TableHead>
                <TableHead className="text-right">Conv</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAMPAIGNS.map(c => {
                const utilization = (c.spent / c.budget) * 100;
                const convRate = (c.conversions / c.candidatesSourced) * 100;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm">{c.recruiter}</TableCell>
                    <TableCell><Badge variant="outline">{c.channel}</Badge></TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(c.budget)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium">{formatCurrency(c.spent)}</span>
                        <Progress className="h-1 w-20" value={utilization} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{c.candidatesSourced}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-emerald-700">{c.conversions} <span className="text-[10px] text-muted-foreground">({convRate.toFixed(0)}%)</span></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.startedAt)}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[c.status]}`}>{c.status}</span></TableCell>
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
