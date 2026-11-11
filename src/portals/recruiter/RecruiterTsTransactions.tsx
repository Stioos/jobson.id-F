"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Receipt,
  Search,
  Wallet,
  TrendingUp,
  Coins,
  Gift,
  Clock,
} from "lucide-react";
import { talentTransactions } from "@/lib/talent-solutions-data";
import type { TalentTransaction } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

// ============================================================
// Recruiter-facing talent solution transactions.
// Recruiters earn: placement_fee (paid by client), commission (from JOBSONN), bonus.
// ============================================================
interface RecruiterTsTxn extends TalentTransaction {
  candidateName: string;
  jobOrderTitle: string;
}

const RECRUITER_TS_TXNS: RecruiterTsTxn[] = [
  // From real data — commission for Karthik Nair is platform-side, but we'll show recruiter-relevant ones
  ...talentTransactions
    .filter((t) => t.type === "placement_fee" || t.type === "commission" || t.type === "bonus")
    .map((t, idx) => {
      const candidateNames = ["Aarav Sharma", "Divya Lakshmi", "Karthik Reddy", "Meera Iyer", "Rahul Nair", "Sanjay Gupta"];
      const jobTitles = ["Senior Full-Stack Engineer", "DevOps Engineer", "ML Engineer", "Cloud Engineer", "Backend Engineer", "Security Analyst"];
      return {
        ...t,
        candidateName: candidateNames[idx % candidateNames.length],
        jobOrderTitle: jobTitles[idx % jobTitles.length],
      } as RecruiterTsTxn;
    }),
];

const TYPE_LABELS: Record<TalentTransaction["type"], string> = {
  program_payment: "Program Payment",
  trainer_fee: "Trainer Fee",
  placement_fee: "Placement Fee",
  certification_fee: "Certification Fee",
  refund: "Refund",
  commission: "Commission",
  settlement: "Settlement",
  bonus: "Bonus",
  penalty: "Penalty",
};

export function RecruiterTsTransactions() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return RECRUITER_TS_TXNS.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(q) &&
          !t.transactionNumber.toLowerCase().includes(q) &&
          !(t.programName ?? "").toLowerCase().includes(q) &&
          !t.candidateName.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [search, typeFilter, statusFilter]);

  // KPIs
  const totalEarned = RECRUITER_TS_TXNS
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const pending = RECRUITER_TS_TXNS
    .filter((t) => t.status === "pending" || t.status === "processing")
    .reduce((s, t) => s + t.amount, 0);
  const thisMonth = RECRUITER_TS_TXNS
    .filter((t) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.status === "completed";
    })
    .reduce((s, t) => s + t.amount, 0);

  // Earnings trend (last 6 months)
  const trendData = React.useMemo(() => {
    const now = new Date();
    const buckets: { month: string; earnings: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleDateString("en-IN", { month: "short" });
      const monthTxns = RECRUITER_TS_TXNS.filter((t) => {
        const td = new Date(t.createdAt);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth() && t.status === "completed";
      });
      buckets.push({
        month: monthLabel,
        earnings: monthTxns.reduce((s, t) => s + t.amount, 0),
      });
    }
    return buckets;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions Earnings"
        description="Placement fees, commissions, and bonuses earned from placing T2H-trained candidates with your clients."
        breadcrumbs={[
          { label: "Recruiter", onClick: () => navigate("recruiter", "overview") },
          { label: "Finance", onClick: () => navigate("recruiter", "finance-grp") },
          { label: "Transactions" },
        ]}
        icon={<Receipt className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={<Coins className="h-5 w-5" />} tone="brand" hint="All-time from T2H placements" />
        <StatCard label="Pending" value={formatCurrency(pending)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
      </div>

      {/* Earnings trend chart */}
      <SectionCard title="Earnings trend" description="Monthly earnings from T2H placements (last 6 months)">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.14 165)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.6 0.14 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v)).replace("₹", "")} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="earnings" name="Earnings" stroke="oklch(0.6 0.14 165)" strokeWidth={2} fill="url(#earnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by transaction, program, or candidate…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="placement_fee">Placement Fee</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Receipt className="h-5 w-5" />} title="No transactions found" description="Try adjusting filters to find transactions." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Program</TableHead>
                <TableHead className="hidden lg:table-cell">Candidate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{t.transactionNumber}</p>
                    <p className="text-xs text-muted-foreground">{t.jobOrderTitle}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{TYPE_LABELS[t.type]}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.programName ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <AvatarLogo text={t.candidateName} size="xs" />
                      <span className="text-xs">{t.candidateName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">+{formatCurrency(t.amount)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={t.status !== "completed"}
                      onClick={() => {
                        toast.success("Payout requested", {
                          description: `${formatCurrency(t.amount)} for ${t.transactionNumber}. Settlement will be processed in 3–5 business days.`,
                        });
                      }}
                    >
                      <Wallet className="mr-1 h-3 w-3" />
                      Request payout
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Earnings breakdown by type */}
      <SectionCard title="Earnings breakdown" description="How your T2H earnings stack up by source">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["placement_fee", "commission", "bonus"] as const).map((type) => {
            const sum = RECRUITER_TS_TXNS
              .filter((t) => t.type === type && t.status === "completed")
              .reduce((s, t) => s + t.amount, 0);
            const count = RECRUITER_TS_TXNS.filter((t) => t.type === type).length;
            const icon = type === "placement_fee" ? <Coins className="h-5 w-5" /> : type === "commission" ? <TrendingUp className="h-5 w-5" /> : <Gift className="h-5 w-5" />;
            return (
              <Card key={type} className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">{icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground">{TYPE_LABELS[type]}</p>
                    <p className="text-lg font-semibold">{formatCurrency(sum)}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{count} transactions</p>
              </Card>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
