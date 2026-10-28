"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

type Earner = "Recruiter" | "Training" | "Partner";
type CommissionStatus = "Earned" | "Pending" | "Released" | "Clawed Back";
type GuaranteeStatus = "In Guarantee" | "Cleared" | "Failed" | "N/A";

interface CommissionRow {
  id: string;
  placementId: string;
  candidate: string;
  employer: string;
  earner: Earner;
  earnerName: string;
  pct: number;
  amount: number;
  status: CommissionStatus;
  releaseDate: string;
  guarantee: GuaranteeStatus;
  earnedAt: string;
  agingDays: number;
  splits: { party: string; pct: number; amount: number }[];
}

const COMMISSIONS: CommissionRow[] = [
  { id: "CMP-3001", placementId: "XPL-1001", candidate: "Priya Nair", employer: "TechCorp India", earner: "Recruiter", earnerName: "HireRight India", pct: 50, amount: 1_40_000, status: "Earned", releaseDate: "2024-12-19", guarantee: "In Guarantee", earnedAt: "2024-09-19", agingDays: 12, splits: [{ party: "Platform", pct: 20, amount: 56_000 }, { party: "Recruiter", pct: 50, amount: 1_40_000 }, { party: "Training", pct: 15, amount: 42_000 }, { party: "Partner", pct: 15, amount: 42_000 }] },
  { id: "CMP-3002", placementId: "XPL-1002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", earner: "Training", earnerName: "Virtusa Tech", pct: 45, amount: 1_62_000, status: "Released", releaseDate: "2024-10-12", guarantee: "Cleared", earnedAt: "2024-09-12", agingDays: 0, splits: [{ party: "Platform", pct: 25, amount: 90_000 }, { party: "Training", pct: 45, amount: 1_62_000 }, { party: "Recruiter", pct: 30, amount: 1_08_000 }] },
  { id: "CMP-3003", placementId: "XPL-1003", candidate: "Vikram Shah", employer: "EduFirst", earner: "Partner", earnerName: "NorthStar Affiliates", pct: 70, amount: 84_000, status: "Released", releaseDate: "2024-11-05", guarantee: "Cleared", earnedAt: "2024-09-05", agingDays: 0, splits: [{ party: "Platform", pct: 30, amount: 36_000 }, { party: "Partner", pct: 70, amount: 84_000 }] },
  { id: "CMP-3004", placementId: "XPL-1004", candidate: "Deepa Menon", employer: "TechCorp India", earner: "Recruiter", earnerName: "HireRight India", pct: 0, amount: 0, status: "Pending", releaseDate: "—", guarantee: "In Guarantee", earnedAt: "2024-08-28", agingDays: 34, splits: [{ party: "Platform", pct: 100, amount: 4_20_000 }] },
  { id: "CMP-3005", placementId: "XPL-1005", candidate: "Ravi Subramanian", employer: "DataInsight Labs", earner: "Recruiter", earnerName: "HireRight India", pct: 50, amount: 1_20_000, status: "Clawed Back", releaseDate: "—", guarantee: "Failed", earnedAt: "2024-08-15", agingDays: 47, splits: [{ party: "Platform", pct: 25, amount: 60_000 }, { party: "Recruiter", pct: 50, amount: 1_20_000 }, { party: "Partner", pct: 25, amount: 60_000 }] },
  { id: "CMP-3006", placementId: "XPL-1007", candidate: "Mohit Agarwal", employer: "NaukriX", earner: "Recruiter", earnerName: "HireRight India", pct: 75, amount: 1_95_000, status: "Released", releaseDate: "2024-10-22", guarantee: "Cleared", earnedAt: "2024-07-22", agingDays: 0, splits: [{ party: "Platform", pct: 25, amount: 65_000 }, { party: "Recruiter", pct: 75, amount: 1_95_000 }] },
  { id: "CMP-3007", placementId: "XPL-1008", candidate: "Ananya Iyer", employer: "FinEdge", earner: "Training", earnerName: "Apex Skill Academy", pct: 70, amount: 1_26_000, status: "Earned", releaseDate: "2024-12-22", guarantee: "In Guarantee", earnedAt: "2024-09-22", agingDays: 9, splits: [{ party: "Platform", pct: 30, amount: 54_000 }, { party: "Training", pct: 70, amount: 1_26_000 }] },
  { id: "CMP-3008", placementId: "XPL-1009", candidate: "Karan Mehta", employer: "CloudPeak Systems", earner: "Recruiter", earnerName: "HireRight India", pct: 40, amount: 1_28_000, status: "Earned", releaseDate: "2024-12-25", guarantee: "In Guarantee", earnedAt: "2024-09-25", agingDays: 6, splits: [{ party: "Platform", pct: 20, amount: 64_000 }, { party: "Recruiter", pct: 40, amount: 1_28_000 }, { party: "Training", pct: 20, amount: 64_000 }, { party: "Partner", pct: 20, amount: 64_000 }] },
  { id: "CMP-3009", placementId: "XPL-1009", candidate: "Karan Mehta", employer: "CloudPeak Systems", earner: "Partner", earnerName: "NorthStar Affiliates", pct: 20, amount: 64_000, status: "Earned", releaseDate: "2024-12-25", guarantee: "In Guarantee", earnedAt: "2024-09-25", agingDays: 6, splits: [{ party: "Platform", pct: 20, amount: 64_000 }, { party: "Recruiter", pct: 40, amount: 1_28_000 }, { party: "Training", pct: 20, amount: 64_000 }, { party: "Partner", pct: 20, amount: 64_000 }] },
  { id: "CMP-3010", placementId: "XPL-1011", candidate: "Rohit Gupta", employer: "TechCorp India", earner: "Recruiter", earnerName: "HireRight India", pct: 50, amount: 1_05_000, status: "Pending", releaseDate: "2024-12-28", guarantee: "In Guarantee", earnedAt: "2024-09-28", agingDays: 3, splits: [{ party: "Platform", pct: 25, amount: 52_500 }, { party: "Recruiter", pct: 50, amount: 1_05_000 }, { party: "Training", pct: 25, amount: 52_500 }] },
  { id: "CMP-3011", placementId: "XPL-1012", candidate: "Sneha Patel", employer: "FinEdge", earner: "Training", earnerName: "Virtusa Tech", pct: 50, amount: 80_000, status: "Earned", releaseDate: "2024-12-30", guarantee: "In Guarantee", earnedAt: "2024-09-30", agingDays: 1, splits: [{ party: "Platform", pct: 20, amount: 32_000 }, { party: "Training", pct: 50, amount: 80_000 }, { party: "Recruiter", pct: 30, amount: 48_000 }] },
  { id: "CMP-3012", placementId: "XPL-1013", candidate: "Aditya Verma", employer: "Retail Boost", earner: "Partner", earnerName: "NorthStar Affiliates", pct: 70, amount: 2_66_000, status: "Earned", releaseDate: "2025-01-01", guarantee: "In Guarantee", earnedAt: "2024-10-01", agingDays: 0, splits: [{ party: "Platform", pct: 30, amount: 1_14_000 }, { party: "Partner", pct: 70, amount: 2_66_000 }] },
];

const EARNER_TONE: Record<Earner, string> = {
  Recruiter: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Training: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const STATUS_TONE: Record<CommissionStatus, string> = {
  Earned: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Released: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  "Clawed Back": "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const GUARANTEE_TONE: Record<GuaranteeStatus, string> = {
  "In Guarantee": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Cleared: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  "N/A": "bg-slate-500/15 text-slate-600 border-slate-500/30",
};

export function SuperAdminCommissionTracker() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterEarner, setFilterEarner] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return COMMISSIONS.filter(c => {
      if (filterEarner !== "All" && c.earner !== filterEarner) return false;
      if (filterStatus !== "All" && c.status !== filterStatus) return false;
      const q = search.toLowerCase();
      if (q && !(c.id.toLowerCase().includes(q) || c.placementId.toLowerCase().includes(q) || c.candidate.toLowerCase().includes(q) || c.employer.toLowerCase().includes(q) || c.earnerName.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filterEarner, filterStatus, search]);

  const totalDue = COMMISSIONS.filter(c => c.status === "Earned" || c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const totalPaid = COMMISSIONS.filter(c => c.status === "Released").reduce((s, c) => s + c.amount, 0);
  const totalPending = COMMISSIONS.filter(c => c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const byEarner = (e: Earner) => COMMISSIONS.filter(c => c.earner === e).reduce((s, c) => s + c.amount, 0);
  const clawbacks = COMMISSIONS.filter(c => c.status === "Clawed Back");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Tracker"
        description="Cross-portal commission tracking — multi-party splits across Recruiter, Training, and Partner portals with guarantee holds and clawback enforcement."
        icon={<Icon name="Percent" className="h-6 w-6" />}
        actions={[
          { label: "Export Commissions", variant: "outline", onClick: () => toast.success("Commission export queued (CSV)") },
          { label: "Process Releases", onClick: () => toast.success("Processed 3 eligible commission releases") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Due" value={formatCurrency(totalDue)} icon={<Icon name="DollarSign" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Release" value={formatCurrency(totalPending)} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Clawbacks" value={clawbacks.length} icon={<Icon name="RotateCcw" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="By Portal" description="Total commission earned per portal">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["Recruiter", "Training", "Partner"] as Earner[]).map(e => {
            const count = COMMISSIONS.filter(c => c.earner === e).length;
            return (
              <div key={e} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] ${EARNER_TONE[e]}`}>{e}</Badge>
                  <Icon name="Percent" className="h-4 w-4 text-brand" />
                </div>
                <p className="mt-2 text-lg font-semibold">{formatCurrency(byEarner(e))}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{count} commission records</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Commission Records"
        description="Click any row to view the full multi-party split"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id, candidate, earner..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-56 text-xs" />
            <select value={filterEarner} onChange={(e) => setFilterEarner(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Recruiter</option><option>Training</option><option>Partner</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Earned</option><option>Pending</option><option>Released</option><option>Clawed Back</option>
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cmp ID</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Earner</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Release</TableHead>
              <TableHead>Guarantee</TableHead>
              <TableHead>Aging</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching commissions" description="Try changing the filters or search query." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(c => (
                <React.Fragment key={c.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(prev => prev === c.id ? null : c.id)}>
                    <TableCell className="font-mono text-xs text-brand">{c.id}</TableCell>
                    <TableCell className="font-mono text-[10px] text-muted-foreground">{c.placementId}</TableCell>
                    <TableCell className="font-medium text-xs">{c.candidate}</TableCell>
                    <TableCell className="text-xs">{c.employer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className={`w-fit text-[10px] ${EARNER_TONE[c.earner]}`}>{c.earner}</Badge>
                        <span className="text-[10px] text-muted-foreground">{c.earnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{c.pct}%</TableCell>
                    <TableCell className="font-semibold text-xs">{formatCurrency(c.amount)}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[c.status]}`}>{c.status}</Badge></TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{c.releaseDate === "—" ? "—" : formatDate(c.releaseDate)}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${GUARANTEE_TONE[c.guarantee]}`}>{c.guarantee}</Badge></TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-medium ${c.agingDays > 30 ? "text-rose-600 dark:text-rose-400" : c.agingDays > 14 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{c.agingDays}d</span>
                    </TableCell>
                  </TableRow>
                  {expanded === c.id && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={11} className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Multi-Party Split</p>
                            <div className="space-y-1.5">
                              {c.splits.map(s => (
                                <div key={s.party} className={`flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs ${s.party === c.earner ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-900/10" : ""}`}>
                                  <span className="flex-1 font-medium">{s.party}{s.party === c.earner && <span className="ml-1 text-[10px] text-emerald-700 dark:text-emerald-400">(this record)</span>}</span>
                                  <Badge variant="outline" className="text-[10px]">{s.pct}%</Badge>
                                  <span className="w-24 text-right font-semibold text-emerald-700 dark:text-emerald-400">{formatCurrency(s.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-md border bg-background p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aging & Clawback Tracker</p>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Earned At</span><span className="font-medium">{formatDate(c.earnedAt)}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Aging Days</span><span className={`font-bold ${c.agingDays > 30 ? "text-rose-600 dark:text-rose-400" : c.agingDays > 14 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{c.agingDays} days</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Scheduled Release</span><span className="font-medium">{c.releaseDate === "—" ? "—" : formatDate(c.releaseDate)}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Guarantee Status</span><Badge variant="outline" className={`text-[10px] ${GUARANTEE_TONE[c.guarantee]}`}>{c.guarantee}</Badge></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Clawback Eligible</span>
                                <span className={`text-[10px] font-medium ${c.status === "Clawed Back" || c.guarantee === "Failed" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                                  {c.status === "Clawed Back" ? "Already clawed back" : c.guarantee === "Failed" ? "Yes — auto-queue" : "No — within guarantee"}
                                </span>
                              </div>
                              {c.status === "Earned" && (
                                <Button size="sm" variant="outline" className="mt-2 h-7 w-full text-xs" onClick={(e) => { e.stopPropagation(); toast.success(`Released commission ${c.id} to ${c.earnerName}`); }}>
                                  <Icon name="Coins" className="mr-1 h-3.5 w-3.5" /> Release Now
                                </Button>
                              )}
                              {c.status === "Earned" && c.guarantee !== "Failed" && (
                                <Button size="sm" variant="ghost" className="h-7 w-full text-xs text-rose-600 hover:text-rose-700" onClick={(e) => { e.stopPropagation(); toast.info(`Clawback queued for ${c.id}`); }}>
                                  <Icon name="RotateCcw" className="mr-1 h-3.5 w-3.5" /> Initiate Clawback
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </SectionCard>

      {clawbacks.length > 0 && (
        <SectionCard title="Clawback Queue" description="Commissions clawed back due to guarantee failure or early exit">
          <ul className="space-y-2">
            {clawbacks.map(c => (
              <li key={c.id} className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-50/40 dark:bg-rose-900/10 p-3 text-sm">
                <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 text-rose-500" />
                <div>
                  <p className="font-medium">{c.earnerName} — {formatCurrency(c.amount)} clawed back</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.id} · placement {c.placementId} · {c.candidate} @ {c.employer} · guarantee failed on {formatDate(c.earnedAt)}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => toast.info(`Reviewing clawback ${c.id}`)}>Review</Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
