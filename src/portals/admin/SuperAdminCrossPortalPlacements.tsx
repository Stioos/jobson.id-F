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

type SourcePortal = "Recruiter" | "Training" | "Partner" | "Direct";
type FeeType = "Commission" | "Placement Fee" | "Salary%";
type PlacementStatus = "Active" | "Completed" | "Replaced" | "Refunded";

interface PlacementRow {
  id: string;
  candidate: string;
  employer: string;
  source: SourcePortal;
  role: string;
  feeType: FeeType;
  fee: number;
  guaranteeDays: number;
  status: PlacementStatus;
  placedAt: string;
  chain: string[];
  splits: { party: string; pct: number; amount: number }[];
}

const PLACEMENTS: PlacementRow[] = [
  {
    id: "XPL-1001", candidate: "Priya Nair", employer: "TechCorp India", source: "Recruiter",
    role: "Senior React Developer", feeType: "Commission", fee: 2_80_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-09-19",
    chain: ["Partner sourced", "Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 20, amount: 56_000 },
      { party: "Recruiter", pct: 50, amount: 1_40_000 },
      { party: "Training", pct: 15, amount: 42_000 },
      { party: "Partner", pct: 15, amount: 42_000 },
    ],
  },
  {
    id: "XPL-1002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", source: "Training",
    role: "Lead DevOps", feeType: "Placement Fee", fee: 3_60_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-09-12",
    chain: ["Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 25, amount: 90_000 },
      { party: "Training", pct: 45, amount: 1_62_000 },
      { party: "Recruiter", pct: 30, amount: 1_08_000 },
    ],
  },
  {
    id: "XPL-1003", candidate: "Vikram Shah", employer: "EduFirst", source: "Partner",
    role: "HR Manager", feeType: "Salary%", fee: 1_20_000, guaranteeDays: 60,
    status: "Completed", placedAt: "2024-09-05",
    chain: ["Partner sourced", "Employer hired"],
    splits: [
      { party: "Platform", pct: 30, amount: 36_000 },
      { party: "Partner", pct: 70, amount: 84_000 },
    ],
  },
  {
    id: "XPL-1004", candidate: "Deepa Menon", employer: "TechCorp India", source: "Direct",
    role: "Cloud Architect", feeType: "Commission", fee: 4_20_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-08-28",
    chain: ["Employer hired (direct apply)"],
    splits: [
      { party: "Platform", pct: 100, amount: 4_20_000 },
    ],
  },
  {
    id: "XPL-1005", candidate: "Ravi Subramanian", employer: "DataInsight Labs", source: "Recruiter",
    role: "Data Engineer", feeType: "Commission", fee: 2_40_000, guaranteeDays: 60,
    status: "Replaced", placedAt: "2024-08-15",
    chain: ["Partner sourced", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 25, amount: 60_000 },
      { party: "Recruiter", pct: 50, amount: 1_20_000 },
      { party: "Partner", pct: 25, amount: 60_000 },
    ],
  },
  {
    id: "XPL-1006", candidate: "Sara Khan", employer: "Retail Boost", source: "Direct",
    role: "Store Manager", feeType: "Placement Fee", fee: 95_000, guaranteeDays: 30,
    status: "Refunded", placedAt: "2024-08-01",
    chain: ["Employer hired (direct apply)"],
    splits: [
      { party: "Platform", pct: 100, amount: 95_000 },
    ],
  },
  {
    id: "XPL-1007", candidate: "Mohit Agarwal", employer: "NaukriX", source: "Recruiter",
    role: "Python Backend", feeType: "Commission", fee: 2_60_000, guaranteeDays: 90,
    status: "Completed", placedAt: "2024-07-22",
    chain: ["Recruiter sourced", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 25, amount: 65_000 },
      { party: "Recruiter", pct: 75, amount: 1_95_000 },
    ],
  },
  {
    id: "XPL-1008", candidate: "Ananya Iyer", employer: "FinEdge", source: "Training",
    role: "Junior Analyst", feeType: "Salary%", fee: 1_80_000, guaranteeDays: 60,
    status: "Active", placedAt: "2024-09-22",
    chain: ["Training certified", "Employer hired"],
    splits: [
      { party: "Platform", pct: 30, amount: 54_000 },
      { party: "Training", pct: 70, amount: 1_26_000 },
    ],
  },
  {
    id: "XPL-1009", candidate: "Karan Mehta", employer: "CloudPeak Systems", source: "Partner",
    role: "Sales Lead", feeType: "Commission", fee: 3_20_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-09-25",
    chain: ["Partner sourced", "Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 20, amount: 64_000 },
      { party: "Recruiter", pct: 40, amount: 1_28_000 },
      { party: "Training", pct: 20, amount: 64_000 },
      { party: "Partner", pct: 20, amount: 64_000 },
    ],
  },
  {
    id: "XPL-1010", candidate: "Nisha Reddy", employer: "EduFirst", source: "Direct",
    role: "Curriculum Designer", feeType: "Placement Fee", fee: 1_50_000, guaranteeDays: 60,
    status: "Completed", placedAt: "2024-07-10",
    chain: ["Employer hired (direct apply)"],
    splits: [{ party: "Platform", pct: 100, amount: 1_50_000 }],
  },
  {
    id: "XPL-1011", candidate: "Rohit Gupta", employer: "TechCorp India", source: "Recruiter",
    role: "QA Engineer", feeType: "Commission", fee: 2_10_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-09-28",
    chain: ["Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 25, amount: 52_500 },
      { party: "Recruiter", pct: 50, amount: 1_05_000 },
      { party: "Training", pct: 25, amount: 52_500 },
    ],
  },
  {
    id: "XPL-1012", candidate: "Sneha Patel", employer: "FinEdge", source: "Training",
    role: "Risk Analyst", feeType: "Salary%", fee: 1_60_000, guaranteeDays: 60,
    status: "Active", placedAt: "2024-09-30",
    chain: ["Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 20, amount: 32_000 },
      { party: "Training", pct: 50, amount: 80_000 },
      { party: "Recruiter", pct: 30, amount: 48_000 },
    ],
  },
  {
    id: "XPL-1013", candidate: "Aditya Verma", employer: "Retail Boost", source: "Partner",
    role: "Regional Manager", feeType: "Commission", fee: 3_80_000, guaranteeDays: 90,
    status: "Active", placedAt: "2024-10-01",
    chain: ["Partner sourced", "Employer hired"],
    splits: [
      { party: "Platform", pct: 30, amount: 1_14_000 },
      { party: "Partner", pct: 70, amount: 2_66_000 },
    ],
  },
  {
    id: "XPL-1014", candidate: "Pooja Singh", employer: "DataInsight Labs", source: "Recruiter",
    role: "ML Engineer", feeType: "Commission", fee: 4_50_000, guaranteeDays: 90,
    status: "Replaced", placedAt: "2024-06-15",
    chain: ["Partner sourced", "Training certified", "Recruiter placed", "Employer hired"],
    splits: [
      { party: "Platform", pct: 20, amount: 90_000 },
      { party: "Recruiter", pct: 40, amount: 1_80_000 },
      { party: "Training", pct: 20, amount: 90_000 },
      { party: "Partner", pct: 20, amount: 90_000 },
    ],
  },
  {
    id: "XPL-1015", candidate: "Faisal Ahmed", employer: "NaukriX", source: "Direct",
    role: "Product Manager", feeType: "Placement Fee", fee: 3_50_000, guaranteeDays: 90,
    status: "Completed", placedAt: "2024-06-01",
    chain: ["Employer hired (direct apply)"],
    splits: [{ party: "Platform", pct: 100, amount: 3_50_000 }],
  },
];

const SOURCE_TONE: Record<SourcePortal, string> = {
  Recruiter: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Training: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Direct: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
};

const STATUS_TONE: Record<PlacementStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Completed: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  Replaced: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Refunded: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminCrossPortalPlacements() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PLACEMENTS.filter(p => {
      if (filterSource !== "All" && p.source !== filterSource) return false;
      if (filterStatus !== "All" && p.status !== filterStatus) return false;
      const q = search.toLowerCase();
      if (q && !(p.id.toLowerCase().includes(q) || p.candidate.toLowerCase().includes(q) || p.employer.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filterSource, filterStatus, search]);

  const totalRevenue = PLACEMENTS.reduce((s, p) => s + p.fee, 0);
  const activeGuarantees = PLACEMENTS.filter(p => p.status === "Active").length;
  const bySource = (s: SourcePortal) => PLACEMENTS.filter(p => p.source === s).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Placements"
        description="Unified placements registry connecting all 5 portals — Recruiter, Training, Partner, and Direct apply flows merged into one chain."
        icon={<Icon name="Link" className="h-6 w-6" />}
        actions={[
          { label: "Export Registry", variant: "outline", onClick: () => toast.success("Cross-portal placements export queued (CSV)") },
          { label: "Sync Portals", onClick: () => toast.success("Synced 5 portals — 0 conflicts") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Placements" value={PLACEMENTS.length} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Recruiter-sourced" value={bySource("Recruiter")} icon={<Icon name="Users2" className="h-5 w-5" />} hint={`Training ${bySource("Training")} · Partner ${bySource("Partner")} · Direct ${bySource("Direct")}`} />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<Icon name="DollarSign" className="h-5 w-5" />} tone="success" />
        <StatCard label="Active Guarantees" value={activeGuarantees} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Master Placement Registry"
        description="Click any row to view the full cross-portal sourcing chain and revenue split"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id, candidate, employer..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-56 text-xs" />
            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option>
              <option>Recruiter</option><option>Training</option><option>Partner</option><option>Direct</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Active</option><option>Completed</option><option>Replaced</option><option>Refunded</option>
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placement ID</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Source Portal</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Fee Type</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Guarantee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching placements" description="Try changing the filters or search query." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(p => (
                <React.Fragment key={p.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setExpanded(prev => prev === p.id ? null : p.id)}
                  >
                    <TableCell className="font-mono text-xs text-brand">{p.id}</TableCell>
                    <TableCell className="font-medium text-xs">{p.candidate}</TableCell>
                    <TableCell className="text-xs">{p.employer}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${SOURCE_TONE[p.source]}`}>{p.source}</Badge></TableCell>
                    <TableCell className="text-xs">{p.role}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{p.feeType}</Badge></TableCell>
                    <TableCell className="font-semibold text-xs">{formatCurrency(p.fee)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.guaranteeDays}d</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[p.status]}`}>{p.status}</Badge></TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{formatDate(p.placedAt)}</TableCell>
                  </TableRow>
                  {expanded === p.id && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={10} className="p-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cross-Portal Sourcing Chain</p>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {p.chain.map((step, i) => (
                                <React.Fragment key={i}>
                                  <div className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium">
                                    <span className="text-brand">{i + 1}.</span> {step}
                                  </div>
                                  {i < p.chain.length - 1 && <Icon name="ChevronRight" className="h-3.5 w-3.5 text-muted-foreground" />}
                                </React.Fragment>
                              ))}
                            </div>
                            <p className="mt-3 text-[11px] text-muted-foreground">{p.chain.length} portal(s) involved · {p.chain.length > 2 ? "Multi-party placement" : "Single-party placement"}</p>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Revenue Split</p>
                            <div className="space-y-1.5">
                              {p.splits.map(s => (
                                <div key={s.party} className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs">
                                  <span className="flex-1 font-medium">{s.party}</span>
                                  <Badge variant="outline" className="text-[10px]">{s.pct}%</Badge>
                                  <span className="w-24 text-right font-semibold text-emerald-700 dark:text-emerald-400">{formatCurrency(s.amount)}</span>
                                </div>
                              ))}
                              <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-900/10 px-2.5 py-1.5 text-xs">
                                <span className="flex-1 font-semibold">Total Fee</span>
                                <span className="w-24 text-right font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(p.fee)}</span>
                              </div>
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
    </div>
  );
}
