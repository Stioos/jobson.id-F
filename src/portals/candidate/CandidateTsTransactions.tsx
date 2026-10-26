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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  Receipt,
  Search,
  Download,
  Wallet,
  TrendingDown,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Award,
  Gift,
  RotateCcw,
} from "lucide-react";
import { talentTransactions, SOLUTION_TYPE_CONFIG } from "@/lib/talent-solutions-data";
import type { TalentTransaction } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

// ============================================================
// Candidate-facing transactions derived from talentTransactions.
// For candidates, relevant transactions are: certification_fee, refund, bonus.
// ============================================================
interface CandidateTxn {
  id: string;
  date: string;
  type: "program_fee" | "certification_fee" | "refund" | "bonus";
  description: string;
  amount: number;
  direction: "credit" | "debit";
  status: TalentTransaction["status"];
  invoiceNumber?: string;
  method: string;
  solutionType: TalentTransaction["solutionType"];
  programName?: string;
}

const CANDIDATE_TXNS: CandidateTxn[] = [
  // From real talentTransactions data (certification_fee, refund, bonus)
  ...talentTransactions
    .filter((t) => t.type === "certification_fee" || t.type === "refund" || t.type === "bonus")
    .map((t) => {
      // Candidate pays certification fees (debit), receives refunds (credit), receives bonuses (credit)
      const isCredit = t.type === "refund" || t.type === "bonus";
      const typeMap = {
        certification_fee: "certification_fee",
        refund: "refund",
        bonus: "bonus",
      } as const;
      return {
        id: t.id,
        date: t.createdAt,
        type: typeMap[t.type as "certification_fee" | "refund" | "bonus"],
        description: t.description,
        amount: t.amount,
        direction: (isCredit ? "credit" : "debit") as "credit" | "debit",
        status: t.status,
        invoiceNumber: t.invoiceNumber,
        method: t.paymentMethod,
        solutionType: t.solutionType,
        programName: t.programName,
      } as CandidateTxn;
    }),
  // Synthesized program fees (candidate paid enrollment fees for their enrolled T2H programs)
  {
    id: "ctx_c_001",
    date: new Date(Date.now() - 30 * 86400000).toISOString(),
    type: "program_fee",
    description: "T2H enrollment fee — TechCorp Full-Stack Batch 3",
    amount: 15000,
    direction: "debit",
    status: "completed",
    invoiceNumber: "INV-CT-2024-1001",
    method: "upi",
    solutionType: "TRAIN_TO_HIRE",
    programName: "TechCorp — Full-Stack Train-to-Hire Batch 3",
  },
  {
    id: "ctx_c_002",
    date: new Date(Date.now() - 75 * 86400000).toISOString(),
    type: "program_fee",
    description: "H2T materials fee — TechCorp Backend Go Upskilling",
    amount: 8000,
    direction: "debit",
    status: "completed",
    invoiceNumber: "INV-CT-2024-0945",
    method: "card",
    solutionType: "HIRE_TO_TRAIN",
    programName: "TechCorp — Backend Go Upskilling",
  },
  {
    id: "ctx_c_003",
    date: new Date(Date.now() - 90 * 86400000).toISOString(),
    type: "program_fee",
    description: "Corporate Training registration — Leadership Development",
    amount: 12000,
    direction: "debit",
    status: "completed",
    invoiceNumber: "INV-CT-2024-0912",
    method: "card",
    solutionType: "CORPORATE_TRAINING",
    programName: "TechCorp — Leadership Development Program",
  },
  {
    id: "ctx_c_004",
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    type: "certification_fee",
    description: "JOBSONN Full-Stack Certificate exam fee",
    amount: 2500,
    direction: "debit",
    status: "pending",
    invoiceNumber: "INV-CT-2024-1102",
    method: "wallet",
    solutionType: "TRAIN_TO_HIRE",
    programName: "TechCorp — Full-Stack Train-to-Hire Batch 3",
  },
  {
    id: "ctx_c_005",
    date: new Date(Date.now() - 180 * 86400000).toISOString(),
    type: "bonus",
    description: "Performance bonus — placed at DataMinds AI",
    amount: 25000,
    direction: "credit",
    status: "completed",
    method: "wallet",
    solutionType: "TRAIN_TO_HIRE",
    programName: "DataMinds — ML Engineer Train-to-Hire",
  },
];

const TYPE_LABELS: Record<CandidateTxn["type"], string> = {
  program_fee: "Program Fee",
  certification_fee: "Certification Fee",
  refund: "Refund",
  bonus: "Bonus",
};

const TYPE_ICONS: Record<CandidateTxn["type"], React.ReactNode> = {
  program_fee: <CreditCard className="h-4 w-4" />,
  certification_fee: <Award className="h-4 w-4" />,
  refund: <RotateCcw className="h-4 w-4" />,
  bonus: <Gift className="h-4 w-4" />,
};

export function CandidateTsTransactions() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return CANDIDATE_TXNS.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(q) &&
          !(t.invoiceNumber ?? "").toLowerCase().includes(q) &&
          !(t.programName ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, typeFilter, statusFilter]);

  // KPIs
  const totalSpent = CANDIDATE_TXNS
    .filter((t) => t.direction === "debit" && (t.status === "completed" || t.status === "pending"))
    .reduce((s, t) => s + t.amount, 0);
  const totalRefunds = CANDIDATE_TXNS
    .filter((t) => t.type === "refund" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const totalBonus = CANDIDATE_TXNS
    .filter((t) => t.type === "bonus" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const walletBalance = 4500; // mock wallet balance

  // Monthly spending chart (last 6 months)
  const monthlyData = React.useMemo(() => {
    const now = new Date();
    const buckets: { month: string; spend: number; refund: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleDateString("en-IN", { month: "short" });
      const monthTxns = CANDIDATE_TXNS.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      });
      buckets.push({
        month: monthLabel,
        spend: monthTxns.filter((t) => t.direction === "debit").reduce((s, t) => s + t.amount, 0),
        refund: monthTxns.filter((t) => t.direction === "credit").reduce((s, t) => s + t.amount, 0),
      });
    }
    return buckets;
  }, []);

  const handleDownload = (t: CandidateTxn) => {
    toast.success("Invoice download started", {
      description: `${t.invoiceNumber ?? "INV-" + t.id.toUpperCase()} · ${formatCurrency(t.amount)} · ${formatDate(t.date)}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions Transactions"
        description="All financial transactions related to your Talent Solution programs — enrollment fees, certifications, refunds, and bonuses."
        breadcrumbs={[
          { label: "Candidate", onClick: () => navigate("candidate", "overview") },
          { label: "Talent Solutions", onClick: () => navigate("candidate", "ts-hub") },
          { label: "Transactions" },
        ]}
        icon={<Receipt className="h-6 w-6" />}
      />

      {/* KPI summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<TrendingDown className="h-5 w-5" />} tone="warning" hint="All-time program fees" />
        <StatCard label="Refunds Received" value={formatCurrency(totalRefunds)} icon={<RotateCcw className="h-5 w-5" />} tone="success" />
        <StatCard label="Bonuses Earned" value={formatCurrency(totalBonus)} icon={<Gift className="h-5 w-5" />} tone="brand" />
        <StatCard label="Wallet Balance" value={formatCurrency(walletBalance)} icon={<Wallet className="h-5 w-5" />} tone="brand" hint="Available for new enrollments" />
      </div>

      {/* Monthly spending chart */}
      <SectionCard
        title="Monthly spending & credits"
        description="Last 6 months of Talent Solutions transactions"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v)).replace("₹", "")} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="spend" name="Spent" fill="oklch(0.6 0.14 165)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="refund" name="Credited" fill="oklch(0.6 0.13 300)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by description, invoice, or program…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="program_fee">Program Fee</SelectItem>
              <SelectItem value="certification_fee">Certification Fee</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
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
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="No transactions found"
          description="Try adjusting filters to find your Talent Solutions transactions."
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Solution</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-md ${t.direction === "credit" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                        {TYPE_ICONS[t.type]}
                      </div>
                      <span className="text-xs font-medium">{TYPE_LABELS[t.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{t.description}</p>
                    {t.invoiceNumber && (
                      <p className="text-xs text-muted-foreground">{t.invoiceNumber}</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">{SOLUTION_TYPE_CONFIG[t.solutionType].shortLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 font-semibold ${t.direction === "credit" ? "text-emerald-600" : "text-foreground"}`}>
                      {t.direction === "credit" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {formatCurrency(t.amount)}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(t)}
                      disabled={!t.invoiceNumber}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="sr-only">Download invoice</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tip */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Earn while you learn</p>
            <p className="text-muted-foreground">
              Top-performing candidates in Train-to-Hire programs receive performance bonuses on placement.
              The average bonus for placed candidates is <span className="font-semibold text-foreground">₹25,000</span>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
