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

type Portal = "Recruiter" | "Training" | "Partner";
type SettlementStatus = "Pending" | "Approved" | "Processing" | "Settled" | "Disputed";
type Cycle = "Weekly" | "Monthly";

interface CommissionRef {
  id: string;
  candidate: string;
  employer: string;
  amount: number;
}

interface SettlementRow {
  id: string;
  payee: string;
  portal: Portal;
  amount: number;
  period: string;
  commissionCount: number;
  status: SettlementStatus;
  cycle: Cycle;
  bank: { account: string; ifsc: string; bank: string };
  tax: number;
  netPayable: number;
  commissions: CommissionRef[];
}

const SETTLEMENTS: SettlementRow[] = [
  {
    id: "STL-4001", payee: "HireRight India", portal: "Recruiter", amount: 5_63_000, period: "Sep 2024 W4",
    commissionCount: 4, status: "Pending", cycle: "Weekly",
    bank: { account: "••••8821", ifsc: "HDFC0001234", bank: "HDFC Bank" },
    tax: 56_300, netPayable: 5_06_700,
    commissions: [
      { id: "CMP-3001", candidate: "Priya Nair", employer: "TechCorp India", amount: 1_40_000 },
      { id: "CMP-3006", candidate: "Mohit Agarwal", employer: "NaukriX", amount: 1_95_000 },
      { id: "CMP-3008", candidate: "Karan Mehta", employer: "CloudPeak Systems", amount: 1_28_000 },
      { id: "CMP-3010", candidate: "Rohit Gupta", employer: "TechCorp India", amount: 1_00_000 },
    ],
  },
  {
    id: "STL-4002", payee: "Virtusa Tech", portal: "Training", amount: 3_68_000, period: "Sep 2024 W4",
    commissionCount: 3, status: "Approved", cycle: "Weekly",
    bank: { account: "••••4521", ifsc: "ICIC0009876", bank: "ICICI Bank" },
    tax: 36_800, netPayable: 3_31_200,
    commissions: [
      { id: "CMP-3002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", amount: 1_62_000 },
      { id: "CMP-3007", candidate: "Ananya Iyer", employer: "FinEdge", amount: 1_26_000 },
      { id: "CMP-3011", candidate: "Sneha Patel", employer: "FinEdge", amount: 80_000 },
    ],
  },
  {
    id: "STL-4003", payee: "NorthStar Affiliates", portal: "Partner", amount: 4_14_000, period: "Sep 2024 W4",
    commissionCount: 3, status: "Processing", cycle: "Weekly",
    bank: { account: "••••9912", ifsc: "SBIN0001122", bank: "State Bank of India" },
    tax: 41_400, netPayable: 3_72_600,
    commissions: [
      { id: "CMP-3003", candidate: "Vikram Shah", employer: "EduFirst", amount: 84_000 },
      { id: "CMP-3009", candidate: "Karan Mehta", employer: "CloudPeak Systems", amount: 64_000 },
      { id: "CMP-3012", candidate: "Aditya Verma", employer: "Retail Boost", amount: 2_66_000 },
    ],
  },
  {
    id: "STL-4004", payee: "Apex Skill Academy", portal: "Training", amount: 1_26_000, period: "Sep 2024 W3",
    commissionCount: 1, status: "Settled", cycle: "Weekly",
    bank: { account: "••••3344", ifsc: "AXIS0008899", bank: "Axis Bank" },
    tax: 12_600, netPayable: 1_13_400,
    commissions: [
      { id: "CMP-3007b", candidate: "Anjali Rao", employer: "FinEdge", amount: 1_26_000 },
    ],
  },
  {
    id: "STL-4005", payee: "HireRight India", portal: "Recruiter", amount: 1_95_000, period: "Sep 2024 W3",
    commissionCount: 1, status: "Settled", cycle: "Weekly",
    bank: { account: "••••8821", ifsc: "HDFC0001234", bank: "HDFC Bank" },
    tax: 19_500, netPayable: 1_75_500,
    commissions: [
      { id: "CMP-3006b", candidate: "Mohit Agarwal", employer: "NaukriX", amount: 1_95_000 },
    ],
  },
  {
    id: "STL-4006", payee: "NorthStar Affiliates", portal: "Partner", amount: 84_000, period: "Sep 2024 W3",
    commissionCount: 1, status: "Settled", cycle: "Weekly",
    bank: { account: "••••9912", ifsc: "SBIN0001122", bank: "State Bank of India" },
    tax: 8_400, netPayable: 75_600,
    commissions: [
      { id: "CMP-3003b", candidate: "Vikram Shah", employer: "EduFirst", amount: 84_000 },
    ],
  },
  {
    id: "STL-4007", payee: "Virtusa Tech", portal: "Training", amount: 1_62_000, period: "Sep 2024 W2",
    commissionCount: 1, status: "Settled", cycle: "Weekly",
    bank: { account: "••••4521", ifsc: "ICIC0009876", bank: "ICICI Bank" },
    tax: 16_200, netPayable: 1_45_800,
    commissions: [
      { id: "CMP-3002b", candidate: "Arjun Kumar", employer: "CloudPeak Systems", amount: 1_62_000 },
    ],
  },
  {
    id: "STL-4008", payee: "HireRight India", portal: "Recruiter", amount: 2_80_000, period: "Sep 2024 W4",
    commissionCount: 2, status: "Disputed", cycle: "Weekly",
    bank: { account: "••••8821", ifsc: "HDFC0001234", bank: "HDFC Bank" },
    tax: 28_000, netPayable: 2_52_000,
    commissions: [
      { id: "CMP-3001b", candidate: "Priya Nair", employer: "TechCorp India", amount: 1_40_000 },
      { id: "CMP-3001c", candidate: "Ravi Subramanian", employer: "DataInsight Labs", amount: 1_40_000 },
    ],
  },
  {
    id: "STL-4009", payee: "Apex Skill Academy", portal: "Training", amount: 1_20_000, period: "Sep 2024",
    commissionCount: 1, status: "Pending", cycle: "Monthly",
    bank: { account: "••••3344", ifsc: "AXIS0008899", bank: "Axis Bank" },
    tax: 12_000, netPayable: 1_08_000,
    commissions: [
      { id: "CMP-3007c", candidate: "Karan Mehta", employer: "CloudPeak Systems", amount: 1_20_000 },
    ],
  },
  {
    id: "STL-4010", payee: "NorthStar Affiliates", portal: "Partner", amount: 2_66_000, period: "Oct 2024 W1",
    commissionCount: 1, status: "Pending", cycle: "Weekly",
    bank: { account: "••••9912", ifsc: "SBIN0001122", bank: "State Bank of India" },
    tax: 26_600, netPayable: 2_39_400,
    commissions: [
      { id: "CMP-3012b", candidate: "Aditya Verma", employer: "Retail Boost", amount: 2_66_000 },
    ],
  },
];

const PORTAL_TONE: Record<Portal, string> = {
  Recruiter: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Training: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const STATUS_TONE: Record<SettlementStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Approved: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Processing: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Settled: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Disputed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminSettlementHub() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPortal, setFilterPortal] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SETTLEMENTS.filter(s => {
      if (filterStatus !== "All" && s.status !== filterStatus) return false;
      if (filterPortal !== "All" && s.portal !== filterPortal) return false;
      const q = search.toLowerCase();
      if (q && !(s.id.toLowerCase().includes(q) || s.payee.toLowerCase().includes(q) || s.period.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filterStatus, filterPortal, search]);

  const pendingCount = SETTLEMENTS.filter(s => s.status === "Pending").length;
  const totalPayable = SETTLEMENTS.filter(s => s.status === "Pending" || s.status === "Approved" || s.status === "Processing").reduce((s, x) => s + x.netPayable, 0);
  const settledMonth = SETTLEMENTS.filter(s => s.status === "Settled").reduce((s, x) => s + x.netPayable, 0);
  const disputedCount = SETTLEMENTS.filter(s => s.status === "Disputed").length;

  const handleAction = (s: SettlementRow, action: "Approve" | "Reject" | "Dispute") => {
    toast.success(`${action}d settlement ${s.id} for ${s.payee}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Settlement Hub"
        description="Unified settlement queue across Recruiter, Training, and Partner portals — auto-batched commissions with tax deduction and bank payout."
        icon={<Icon name="Coins" className="h-6 w-6" />}
        actions={[
          { label: "Export Queue", variant: "outline", onClick: () => toast.success("Settlement queue export queued (CSV)") },
          { label: "Run Auto-Settle", onClick: () => toast.success("Auto-settlement executed — 2 batches processed") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Settlements" value={pendingCount} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Payable" value={formatCurrency(totalPayable)} icon={<Icon name="DollarSign" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Settled This Month" value={formatCurrency(settledMonth)} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Disputed" value={disputedCount} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Settlement Cycle Configuration" description="Auto-settlement rules per portal — adjust cycle and thresholds">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["Recruiter", "Training", "Partner"] as Portal[]).map(p => {
            const cfg = SETTLEMENTS.find(s => s.portal === p);
            return (
              <div key={p} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] ${PORTAL_TONE[p]}`}>{p}</Badge>
                  <Icon name="Coins" className="h-4 w-4 text-brand" />
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Cycle</span><span className="font-medium">{cfg?.cycle ?? "Weekly"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Min Batch</span><span className="font-medium">{formatCurrency(10_000)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Tax (TDS)</span><span className="font-medium text-amber-700 dark:text-amber-400">10%</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Auto-Release</span><Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-700 border-emerald-500/30">On</Badge></div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Settlement Queue"
        description="Click any row to view included commission records, fee breakdown, and bank details"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id, payee, period..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-56 text-xs" />
            <select value={filterPortal} onChange={(e) => setFilterPortal(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Recruiter</option><option>Training</option><option>Partner</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Pending</option><option>Approved</option><option>Processing</option><option>Settled</option><option>Disputed</option>
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Settlement ID</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Cmp Records</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching settlements" description="Try changing the filters or search query." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(s => (
                <React.Fragment key={s.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(prev => prev === s.id ? null : s.id)}>
                    <TableCell className="font-mono text-xs text-brand">{s.id}</TableCell>
                    <TableCell className="font-medium text-xs">{s.payee}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${PORTAL_TONE[s.portal]}`}>{s.portal}</Badge></TableCell>
                    <TableCell className="font-semibold text-xs">{formatCurrency(s.amount)}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{s.period}</TableCell>
                    <TableCell className="text-xs">{s.commissionCount}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[s.status]}`}>{s.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        {s.status === "Pending" && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] text-emerald-700" onClick={() => handleAction(s, "Approve")}>Approve</Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] text-rose-600" onClick={() => handleAction(s, "Reject")}>Reject</Button>
                          </>
                        )}
                        {s.status === "Approved" && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] text-amber-700" onClick={() => handleAction(s, "Dispute")}>Dispute</Button>
                        )}
                        {s.status === "Disputed" && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => toast.info(`Reviewing dispute ${s.id}`)}>Review</Button>
                        )}
                        {(s.status === "Processing" || s.status === "Settled") && (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expanded === s.id && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={8} className="p-4">
                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="lg:col-span-2">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Included Commission Records ({s.commissions.length})</p>
                            <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5">
                              {s.commissions.map(c => (
                                <div key={c.id} className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs">
                                  <span className="font-mono text-[10px] text-brand">{c.id}</span>
                                  <span className="flex-1 truncate"><span className="font-medium">{c.candidate}</span> <span className="text-muted-foreground">@ {c.employer}</span></span>
                                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{formatCurrency(c.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="rounded-md border bg-background p-3">
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fee Breakdown</p>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">Gross Commission</span><span className="font-medium">{formatCurrency(s.amount)}</span></div>
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">TDS (10%)</span><span className="font-medium text-rose-600 dark:text-rose-400">−{formatCurrency(s.tax)}</span></div>
                                <div className="flex items-center justify-between border-t pt-1.5"><span className="font-semibold">Net Payable</span><span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(s.netPayable)}</span></div>
                              </div>
                            </div>
                            <div className="rounded-md border bg-background p-3">
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bank Details</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">{s.bank.bank}</span></div>
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">A/c</span><span className="font-mono">{s.bank.account}</span></div>
                                <div className="flex items-center justify-between"><span className="text-muted-foreground">IFSC</span><span className="font-mono">{s.bank.ifsc}</span></div>
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
