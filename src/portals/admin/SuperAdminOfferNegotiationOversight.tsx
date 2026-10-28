"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface Negotiation {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  originalCtc: number;
  counterCtc: number;
  settledCtc?: number;
  rounds: number;
  status: "Active" | "Settled" | "Rejected" | "Withdrawn";
  startedAt: string;
}

const NEGOTIATIONS: Negotiation[] = [
  { id: "ng_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Sr React Dev", originalCtc: 28_00_000, counterCtc: 32_00_000, settledCtc: 30_00_000, rounds: 2, status: "Settled", startedAt: "2024-09-15" },
  { id: "ng_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", originalCtc: 36_00_000, counterCtc: 42_00_000, rounds: 1, status: "Active", startedAt: "2024-09-18" },
  { id: "ng_003", candidate: "Meera Joshi", employer: "DataInsight Labs", role: "ML Engineer", originalCtc: 22_00_000, counterCtc: 26_00_000, settledCtc: 24_00_000, rounds: 3, status: "Settled", startedAt: "2024-09-12" },
  { id: "ng_004", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", originalCtc: 14_00_000, counterCtc: 16_00_000, settledCtc: 14_50_000, rounds: 1, status: "Settled", startedAt: "2024-09-08" },
  { id: "ng_005", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", originalCtc: 42_00_000, counterCtc: 50_00_000, rounds: 2, status: "Rejected", startedAt: "2024-09-05" },
  { id: "ng_006", candidate: "Rahul Gupta", employer: "DesignPro", role: "Product Designer", originalCtc: 19_50_000, counterCtc: 22_00_000, rounds: 0, status: "Withdrawn", startedAt: "2024-09-03" },
];

const STATUS_TONE: Record<string, string> = {
  Active: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Settled: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Withdrawn: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

const EMPLOYER_STATS = [
  { employer: "TechCorp India", total: 24, settled: 20, rate: 83.3 },
  { employer: "CloudPeak Systems", total: 18, settled: 13, rate: 72.2 },
  { employer: "DataInsight Labs", total: 12, settled: 10, rate: 83.3 },
  { employer: "NaukriX", total: 9, settled: 5, rate: 55.5 },
  { employer: "EduFirst", total: 7, settled: 6, rate: 85.7 },
];

export function SuperAdminOfferNegotiationOversight() {
  const active = NEGOTIATIONS.filter(n => n.status === "Active").length;
  const settled = NEGOTIATIONS.filter(n => n.status === "Settled").length;
  const counterRate = (NEGOTIATIONS.filter(n => n.rounds > 0).length / NEGOTIATIONS.length) * 100;
  const avgRounds = NEGOTIATIONS.reduce((s, n) => s + n.rounds, 0) / NEGOTIATIONS.length;
  const totalUplift = NEGOTIATIONS.filter(n => n.settledCtc).reduce((s, n) => s + (n.settledCtc! - n.originalCtc), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer Negotiations"
        description="All active and historic offer negotiations across the platform — counter-offer rates, settlement trends, and success rates."
        icon={<Icon name="MessagesSquare" className="h-6 w-6" />}
        actions={[{ label: "Negotiation Report", variant: "outline", onClick: () => toast.success("Negotiation report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Negotiations" value={active} icon={<Icon name="MessagesSquare" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Counter-Offer Rate" value={`${counterRate.toFixed(1)}%`} icon={<Icon name="Repeat" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Rounds" value={avgRounds.toFixed(1)} icon={<Icon name="RefreshCw" className="h-5 w-5" />} />
        <StatCard label="Total Uplift" value={formatCurrency(totalUplift)} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Negotiation Success Rate by Employer" description="Settlement rate — how often negotiations conclude successfully">
        <div className="space-y-2.5">
          {EMPLOYER_STATS.map(e => (
            <div key={e.employer}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{e.employer}</span>
                <span className="text-muted-foreground">{e.settled}/{e.total} settled · <span className={`font-medium ${e.rate >= 75 ? "text-emerald-700" : e.rate >= 60 ? "text-amber-700" : "text-rose-700"}`}>{e.rate}%</span></span>
              </div>
              <Progress className="mt-1 h-2" value={e.rate} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="All Negotiations" description="Active and historic negotiations across platform" contentClassName="p-0">
        {NEGOTIATIONS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="MessagesSquare" className="h-5 w-5" />} title="No negotiations yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer / Role</TableHead>
                <TableHead className="text-right">Original CTC</TableHead>
                <TableHead className="text-right">Counter</TableHead>
                <TableHead className="text-right">Settled</TableHead>
                <TableHead className="text-center">Rounds</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NEGOTIATIONS.map(n => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.candidate}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{n.employer}</div>
                    <div className="text-[10px] text-muted-foreground">{n.role}</div>
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(n.originalCtc)}</TableCell>
                  <TableCell className="text-right text-sm text-amber-700">{formatCurrency(n.counterCtc)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-emerald-700">{n.settledCtc ? formatCurrency(n.settledCtc) : "—"}</TableCell>
                  <TableCell className="text-center"><Badge variant="secondary" className="text-[10px]">{n.rounds}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(n.startedAt)}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[n.status]}`}>{n.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
