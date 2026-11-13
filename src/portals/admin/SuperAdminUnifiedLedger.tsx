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
import { formatCurrency, formatDateTime } from "@/lib/format";

type TxnType = "Job Posting Fee" | "Course Fee" | "Placement Commission" | "Referral Bonus" | "Settlement" | "Refund" | "Subscription";
type Portal = "Employer" | "Recruiter" | "Training" | "Partner" | "Platform" | "Candidate";
type TxnStatus = "Reconciled" | "Unreconciled" | "Pending" | "Disputed";

interface TxnRow {
  id: string;
  at: string;
  type: TxnType;
  fromPortal: Portal;
  toPortal: Portal;
  fromParty: string;
  toParty: string;
  amount: number;
  platformFee: number;
  status: TxnStatus;
  ref: string;
  debit: { account: string; amount: number };
  credit: { account: string; amount: number };
}

const TXNS: TxnRow[] = [
  { id: "TXN-20001", at: "2024-10-01T09:00:00Z", type: "Job Posting Fee", fromPortal: "Employer", toPortal: "Platform", fromParty: "TechCorp India", toParty: "jobson.id Wallet", amount: 4_999, platformFee: 0, status: "Reconciled", ref: "JOB-7781", debit: { account: "Employer Wallet", amount: 4_999 }, credit: { account: "Platform Revenue", amount: 4_999 } },
  { id: "TXN-20002", at: "2024-09-30T16:30:00Z", type: "Placement Commission", fromPortal: "Employer", toPortal: "Recruiter", fromParty: "CloudPeak Systems", toParty: "HireRight India", amount: 3_60_000, platformFee: 90_000, status: "Reconciled", ref: "XPL-1002", debit: { account: "Employer AP", amount: 3_60_000 }, credit: { account: "Recruiter Commission Payable", amount: 2_70_000 } },
  { id: "TXN-20003", at: "2024-09-30T11:15:00Z", type: "Course Fee", fromPortal: "Candidate", toPortal: "Training", fromParty: "Ananya Iyer", toParty: "Apex Skill Academy", amount: 24_000, platformFee: 2_400, status: "Reconciled", ref: "ENR-4451", debit: { account: "Razorpay Gateway", amount: 24_000 }, credit: { account: "Training Provider Wallet", amount: 21_600 } },
  { id: "TXN-20004", at: "2024-09-29T14:20:00Z", type: "Referral Bonus", fromPortal: "Platform", toPortal: "Partner", fromParty: "jobson.id Wallet", toParty: "NorthStar Affiliates", amount: 22_400, platformFee: 0, status: "Reconciled", ref: "CMP-0899", debit: { account: "Platform Marketing Budget", amount: 22_400 }, credit: { account: "Partner Wallet", amount: 22_400 } },
  { id: "TXN-20005", at: "2024-09-28T19:45:00Z", type: "Settlement", fromPortal: "Platform", toPortal: "Recruiter", fromParty: "jobson.id Payout Account", toParty: "HireRight India", amount: 1_08_000, platformFee: 0, status: "Reconciled", ref: "STL-2024-09-22", debit: { account: "Recruiter Commission Payable", amount: 1_08_000 }, credit: { account: "HDFC Bank A/c", amount: 1_08_000 } },
  { id: "TXN-20006", at: "2024-09-27T10:00:00Z", type: "Subscription", fromPortal: "Employer", toPortal: "Platform", fromParty: "EduFirst", toParty: "jobson.id Wallet", amount: 12_999, platformFee: 0, status: "Reconciled", ref: "SUB-9921", debit: { account: "Employer Wallet", amount: 12_999 }, credit: { account: "Platform Subscription Revenue", amount: 12_999 } },
  { id: "TXN-20007", at: "2024-09-26T13:30:00Z", type: "Refund", fromPortal: "Training", toPortal: "Candidate", fromParty: "Virtusa Tech", toParty: "Sneha Patel", amount: 8_400, platformFee: -840, status: "Unreconciled", ref: "RF-2015", debit: { account: "Training Refund Reserve", amount: 8_400 }, credit: { account: "Razorpay Gateway", amount: 8_400 } },
  { id: "TXN-20008", at: "2024-09-25T15:45:00Z", type: "Placement Commission", fromPortal: "Employer", toPortal: "Training", fromParty: "FinEdge", toParty: "Virtusa Tech", amount: 1_26_000, platformFee: 31_500, status: "Reconciled", ref: "XPL-1008", debit: { account: "Employer AP", amount: 1_26_000 }, credit: { account: "Training Commission Payable", amount: 94_500 } },
  { id: "TXN-20009", at: "2024-09-24T11:00:00Z", type: "Job Posting Fee", fromPortal: "Employer", toPortal: "Platform", fromParty: "Retail Boost", toParty: "jobson.id Wallet", amount: 4_999, platformFee: 0, status: "Reconciled", ref: "JOB-7782", debit: { account: "Employer Wallet", amount: 4_999 }, credit: { account: "Platform Revenue", amount: 4_999 } },
  { id: "TXN-20010", at: "2024-09-23T17:00:00Z", type: "Course Fee", fromPortal: "Candidate", toPortal: "Training", fromParty: "Karan Mehta", toParty: "Apex Skill Academy", amount: 18_000, platformFee: 1_800, status: "Reconciled", ref: "ENR-4452", debit: { account: "Razorpay Gateway", amount: 18_000 }, credit: { account: "Training Provider Wallet", amount: 16_200 } },
  { id: "TXN-20011", at: "2024-09-22T08:30:00Z", type: "Settlement", fromPortal: "Platform", toPortal: "Partner", fromParty: "jobson.id Payout Account", toParty: "NorthStar Affiliates", amount: 84_000, platformFee: 0, status: "Pending", ref: "STL-2024-09-29", debit: { account: "Partner Commission Payable", amount: 84_000 }, credit: { account: "ICICI Bank A/c", amount: 84_000 } },
  { id: "TXN-20012", at: "2024-09-21T14:00:00Z", type: "Placement Commission", fromPortal: "Employer", toPortal: "Recruiter", fromParty: "TechCorp India", toParty: "HireRight India", amount: 2_80_000, platformFee: 70_000, status: "Disputed", ref: "XPL-1001", debit: { account: "Employer AP", amount: 2_80_000 }, credit: { account: "Recruiter Commission Payable", amount: 2_10_000 } },
  { id: "TXN-20013", at: "2024-09-20T10:15:00Z", type: "Subscription", fromPortal: "Employer", toPortal: "Platform", fromParty: "DataInsight Labs", toParty: "jobson.id Wallet", amount: 24_999, platformFee: 0, status: "Reconciled", ref: "SUB-9922", debit: { account: "Employer Wallet", amount: 24_999 }, credit: { account: "Platform Subscription Revenue", amount: 24_999 } },
  { id: "TXN-20014", at: "2024-09-19T16:45:00Z", type: "Referral Bonus", fromPortal: "Platform", toPortal: "Partner", fromParty: "jobson.id Wallet", toParty: "NorthStar Affiliates", amount: 64_000, platformFee: 0, status: "Reconciled", ref: "CMP-0901", debit: { account: "Platform Marketing Budget", amount: 64_000 }, credit: { account: "Partner Wallet", amount: 64_000 } },
  { id: "TXN-20015", at: "2024-09-18T09:30:00Z", type: "Placement Commission", fromPortal: "Employer", toPortal: "Training", fromParty: "EduFirst", toParty: "Apex Skill Academy", amount: 1_26_000, platformFee: 31_500, status: "Unreconciled", ref: "XPL-1003", debit: { account: "Employer AP", amount: 1_26_000 }, credit: { account: "Training Commission Payable", amount: 94_500 } },
  { id: "TXN-20016", at: "2024-09-17T13:00:00Z", type: "Course Fee", fromPortal: "Candidate", toPortal: "Training", fromParty: "Sara Khan", toParty: "Virtusa Tech", amount: 12_000, platformFee: 1_200, status: "Reconciled", ref: "ENR-4453", debit: { account: "Razorpay Gateway", amount: 12_000 }, credit: { account: "Training Provider Wallet", amount: 10_800 } },
  { id: "TXN-20017", at: "2024-09-16T18:20:00Z", type: "Refund", fromPortal: "Platform", toPortal: "Employer", fromParty: "jobson.id Wallet", toParty: "Retail Boost", amount: 95_000, platformFee: -9_500, status: "Reconciled", ref: "RF-2016", debit: { account: "Platform Refund Reserve", amount: 95_000 }, credit: { account: "Employer Wallet", amount: 95_000 } },
  { id: "TXN-20018", at: "2024-09-15T10:50:00Z", type: "Job Posting Fee", fromPortal: "Employer", toPortal: "Platform", fromParty: "NaukriX", toParty: "jobson.id Wallet", amount: 4_999, platformFee: 0, status: "Reconciled", ref: "JOB-7783", debit: { account: "Employer Wallet", amount: 4_999 }, credit: { account: "Platform Revenue", amount: 4_999 } },
  { id: "TXN-20019", at: "2024-09-14T15:10:00Z", type: "Settlement", fromPortal: "Platform", toPortal: "Training", fromParty: "jobson.id Payout Account", toParty: "Virtusa Tech", amount: 1_62_000, platformFee: 0, status: "Reconciled", ref: "STL-2024-09-15", debit: { account: "Training Commission Payable", amount: 1_62_000 }, credit: { account: "HDFC Bank A/c", amount: 1_62_000 } },
  { id: "TXN-20020", at: "2024-09-13T11:40:00Z", type: "Placement Commission", fromPortal: "Employer", toPortal: "Partner", fromParty: "Retail Boost", toParty: "NorthStar Affiliates", amount: 2_66_000, platformFee: 79_800, status: "Pending", ref: "XPL-1013", debit: { account: "Employer AP", amount: 2_66_000 }, credit: { account: "Partner Commission Payable", amount: 1_86_200 } },
];

const TYPE_TONE: Record<TxnType, string> = {
  "Job Posting Fee": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "Course Fee": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Placement Commission": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Referral Bonus": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Settlement: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Refund: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Subscription: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const STATUS_TONE: Record<TxnStatus, string> = {
  Reconciled: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Unreconciled: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Disputed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminUnifiedLedger() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterPortal, setFilterPortal] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return TXNS.filter(t => {
      if (filterType !== "All" && t.type !== filterType) return false;
      if (filterPortal !== "All" && t.fromPortal !== filterPortal && t.toPortal !== filterPortal) return false;
      if (filterStatus !== "All" && t.status !== filterStatus) return false;
      const q = search.toLowerCase();
      if (q && !(t.id.toLowerCase().includes(q) || t.fromParty.toLowerCase().includes(q) || t.toParty.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filterType, filterPortal, filterStatus, search]);

  const totalVolume = TXNS.reduce((s, t) => s + t.amount, 0);
  const reconciled = TXNS.filter(t => t.status === "Reconciled").length;
  const unreconciled = TXNS.filter(t => t.status !== "Reconciled").length;

  const portalBreakdown = ["Employer", "Recruiter", "Training", "Partner", "Platform"].map(p => ({
    portal: p,
    volume: TXNS.filter(t => t.fromPortal === p || t.toPortal === p).reduce((s, t) => s + t.amount, 0),
    count: TXNS.filter(t => t.fromPortal === p || t.toPortal === p).length,
  }));

  const typeBreakdown = (["Job Posting Fee", "Course Fee", "Placement Commission", "Referral Bonus", "Settlement", "Refund", "Subscription"] as TxnType[]).map(t => ({
    type: t,
    volume: TXNS.filter(x => x.type === t).reduce((s, x) => s + x.amount, 0),
    count: TXNS.filter(x => x.type === t).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Transaction Ledger"
        description="One double-entry ledger across all 5 portals — every fee, commission, settlement, and refund recorded with full audit trail."
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[
          { label: "Export Ledger", variant: "outline", onClick: () => toast.success("Unified ledger export queued (CSV)") },
          { label: "Reconcile Now", onClick: () => toast.success(`Reconciled ${unreconciled} pending entries`) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Volume (30d)" value={formatCurrency(totalVolume)} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Transactions" value={TXNS.length} icon={<Icon name="Receipt" className="h-5 w-5" />} />
        <StatCard label="Reconciled" value={reconciled} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Unreconciled" value={unreconciled} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="By Portal" description="Volume across portals (30d)">
          <div className="space-y-2">
            {portalBreakdown.map(p => (
              <div key={p.portal} className="flex items-center gap-2">
                <Badge variant="outline" className="w-24 justify-center text-[10px]">{p.portal}</Badge>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-brand" style={{ width: `${(p.volume / totalVolume) * 100}%` }} />
                </div>
                <span className="w-28 text-right text-xs font-semibold">{formatCurrency(p.volume)}</span>
                <span className="w-10 text-right text-[10px] text-muted-foreground">{p.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="By Type" description="Volume across transaction types (30d)">
          <div className="space-y-2">
            {typeBreakdown.map(t => (
              <div key={t.type} className="flex items-center gap-2">
                <Badge variant="outline" className={`w-32 justify-center text-[10px] ${TYPE_TONE[t.type]}`}>{t.type}</Badge>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-emerald-500" style={{ width: `${(t.volume / totalVolume) * 100}%` }} />
                </div>
                <span className="w-28 text-right text-xs font-semibold">{formatCurrency(t.volume)}</span>
                <span className="w-6 text-right text-[10px] text-muted-foreground">{t.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Transaction Ledger"
        description="Click any row to view the double-entry debit/credit legs"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search id, party, ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-52 text-xs" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option>
              {(["Job Posting Fee", "Course Fee", "Placement Commission", "Referral Bonus", "Settlement", "Refund", "Subscription"] as TxnType[]).map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterPortal} onChange={(e) => setFilterPortal(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option>
              {["Employer", "Recruiter", "Training", "Partner", "Platform", "Candidate"].map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-md border bg-background px-2 text-xs">
              <option>All</option><option>Reconciled</option><option>Unreconciled</option><option>Pending</option><option>Disputed</option>
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Txn ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Parties</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyState icon={<Icon name="Search" className="h-5 w-5" />} title="No matching transactions" description="Try changing the filters or search query." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(t => (
                <React.Fragment key={t.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(prev => prev === t.id ? null : t.id)}>
                    <TableCell className="font-mono text-xs text-brand">{t.id}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{formatDateTime(t.at)}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONE[t.type]}`}>{t.type}</Badge></TableCell>
                    <TableCell className="text-[10px]">
                      <Badge variant="outline" className="text-[10px]">{t.fromPortal}</Badge>
                      <span className="mx-1 text-muted-foreground">→</span>
                      <Badge variant="outline" className="text-[10px]">{t.toPortal}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px]">
                      <div className="truncate" style={{ maxWidth: 180 }}>{t.fromParty} → {t.toParty}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-xs">{formatCurrency(t.amount)}</TableCell>
                    <TableCell className="text-xs text-amber-700 dark:text-amber-400">{t.platformFee ? formatCurrency(t.platformFee) : "—"}</TableCell>
                    <TableCell className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{formatCurrency(t.amount - t.platformFee)}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[t.status]}`}>{t.status}</Badge></TableCell>
                  </TableRow>
                  {expanded === t.id && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={9} className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-md border bg-background p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Double-Entry Legs</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between rounded-md border border-rose-500/30 bg-rose-50/40 dark:bg-rose-900/10 px-2.5 py-1.5 text-xs">
                                <span><span className="font-semibold text-rose-700 dark:text-rose-400">DR</span> {t.debit.account}</span>
                                <span className="font-semibold">{formatCurrency(t.debit.amount)}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-900/10 px-2.5 py-1.5 text-xs">
                                <span><span className="font-semibold text-emerald-700 dark:text-emerald-400">CR</span> {t.credit.account}</span>
                                <span className="font-semibold">{formatCurrency(t.credit.amount)}</span>
                              </div>
                              <div className="mt-1.5 text-[10px] text-muted-foreground">Ref: <span className="font-mono">{t.ref}</span></div>
                            </div>
                          </div>
                          <div className="rounded-md border bg-background p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reconciliation</p>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[t.status]}`}>{t.status}</Badge></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Gross Amount</span><span className="font-medium">{formatCurrency(t.amount)}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Platform Fee</span><span className="font-medium text-amber-700 dark:text-amber-400">{t.platformFee ? formatCurrency(t.platformFee) : "—"}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Net Payable</span><span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(t.amount - t.platformFee)}</span></div>
                              <div className="flex items-center justify-between"><span className="text-muted-foreground">Booked At</span><span className="font-mono text-[10px]">{formatDateTime(t.at)}</span></div>
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
