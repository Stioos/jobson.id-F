"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import {
  Receipt,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeftRight,
  Filter,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react";

// ----- Types -----
type TxnType =
  | "subscription_payment"
  | "premium_service"
  | "refund"
  | "wallet_credit"
  | "wallet_debit";

type TxnStatus = "success" | "pending" | "failed" | "refunded";

interface Txn {
  id: string;
  date: string;
  type: TxnType;
  description: string;
  amount: number;
  direction: "credit" | "debit";
  status: TxnStatus;
  method: "upi" | "card" | "netbanking" | "wallet";
  reference: string;
}

// ----- Mock data (inline) -----
const SEED_TXNS: Txn[] = [
  { id: "ctx_1", date: "2024-10-22T09:20:00Z", type: "premium_service", description: "Resume Boost — 30 day promotion", amount: 499, direction: "debit", status: "success", method: "wallet", reference: "PSV-RB-2291" },
  { id: "ctx_2", date: "2024-10-22T09:14:00Z", type: "wallet_credit", description: "Wallet top-up via UPI", amount: 2000, direction: "credit", status: "success", method: "upi", reference: "TXN88241122" },
  { id: "ctx_3", date: "2024-10-15T11:00:00Z", type: "wallet_credit", description: "Referral bonus — friend signed up", amount: 500, direction: "credit", status: "success", method: "wallet", reference: "REF-2024-551" },
  { id: "ctx_4", date: "2024-10-10T14:32:00Z", type: "premium_service", description: "Featured Profile — 14 day boost", amount: 999, direction: "debit", status: "success", method: "wallet", reference: "PSV-FP-2190" },
  { id: "ctx_5", date: "2024-10-02T08:00:00Z", type: "subscription_payment", description: "Premium plan — monthly subscription", amount: 299, direction: "debit", status: "success", method: "upi", reference: "SUB-PM-1192" },
  { id: "ctx_6", date: "2024-09-28T10:05:00Z", type: "premium_service", description: "Priority Applications — 5 jobs pack", amount: 1499, direction: "debit", status: "success", method: "card", reference: "PSV-PA-2087" },
  { id: "ctx_7", date: "2024-09-20T16:00:00Z", type: "refund", description: "Refund — duplicate charge reversed", amount: 1499, direction: "credit", status: "refunded", method: "wallet", reference: "RFD-2024-098" },
  { id: "ctx_8", date: "2024-09-12T08:00:00Z", type: "subscription_payment", description: "Premium plan — monthly subscription", amount: 299, direction: "debit", status: "success", method: "upi", reference: "SUB-PM-1180" },
  { id: "ctx_9", date: "2024-09-05T19:45:00Z", type: "wallet_credit", description: "Wallet top-up via card", amount: 1000, direction: "credit", status: "success", method: "card", reference: "TXN88210055" },
  { id: "ctx_10", date: "2024-08-29T10:00:00Z", type: "premium_service", description: "Mock Interview Pack — 5 sessions", amount: 1499, direction: "debit", status: "success", method: "card", reference: "PSV-MI-2014" },
  { id: "ctx_11", date: "2024-08-12T08:00:00Z", type: "subscription_payment", description: "Premium plan — monthly subscription", amount: 299, direction: "debit", status: "success", method: "upi", reference: "SUB-PM-1162" },
  { id: "ctx_12", date: "2024-08-02T15:21:00Z", type: "wallet_debit", description: "Wallet debit — Career Coaching 1-on-1", amount: 999, direction: "debit", status: "success", method: "wallet", reference: "PSV-CC-2001" },
  { id: "ctx_13", date: "2024-07-15T08:00:00Z", type: "subscription_payment", description: "Premium plan — monthly subscription", amount: 299, direction: "debit", status: "failed", method: "upi", reference: "SUB-PM-1145" },
  { id: "ctx_14", date: "2024-07-01T12:00:00Z", type: "wallet_credit", description: "Welcome bonus — new user credit", amount: 250, direction: "credit", status: "success", method: "wallet", reference: "WLC-2024-001" },
];

const TYPE_LABELS: Record<TxnType, string> = {
  subscription_payment: "Subscription",
  premium_service: "Premium Service",
  refund: "Refund",
  wallet_credit: "Wallet Credit",
  wallet_debit: "Wallet Debit",
};

const TYPE_COLORS: Record<TxnType, string> = {
  subscription_payment: "#10b981",
  premium_service: "#f59e0b",
  refund: "#8b5cf6",
  wallet_credit: "#14b8a6",
  wallet_debit: "#f43f5e",
};

// ----- Component -----
export function CandidateTransactions() {
  const [txns] = React.useState<Txn[]>(SEED_TXNS);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return txns.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${t.description} ${t.reference}`.toLowerCase().includes(q)) return false;
      }
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (fromDate && new Date(t.date) < new Date(fromDate)) return false;
      if (toDate && new Date(t.date) > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });
  }, [txns, search, typeFilter, fromDate, toDate]);

  const totalCredits = filtered.filter((t) => t.direction === "credit" && t.status !== "failed").reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter((t) => t.direction === "debit" && t.status !== "failed").reduce((s, t) => s + t.amount, 0);
  const net = totalCredits - totalDebits;

  // Monthly spending chart (last 6 months)
  const monthly = React.useMemo(() => {
    const now = new Date();
    const months: { month: string; spend: number; credit: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const spend = txns
        .filter((t) => t.direction === "debit" && t.status !== "failed" && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear())
        .reduce((s, t) => s + t.amount, 0);
      const credit = txns
        .filter((t) => t.direction === "credit" && t.status !== "failed" && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear())
        .reduce((s, t) => s + t.amount, 0);
      months.push({ month: label, spend, credit });
    }
    return months;
  }, [txns]);

  function downloadStatement() {
    toast.success("Statement downloaded", { description: "statement-oct-2024.pdf · 14 transactions" });
  }
  function exportCsv() {
    toast.success("CSV exported", { description: `${filtered.length} transactions exported to transactions.csv` });
  }
  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
    toast.info("Filters cleared");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Transactions"
        description="Complete payment history — subscriptions, premium services, wallet credits, debits, and refunds."
        icon={<Receipt className="h-6 w-6" />}
        actions={[
          { label: "Statement", icon: "Download", variant: "outline", onClick: downloadStatement },
          { label: "Export CSV", icon: "FileSpreadsheet", variant: "outline", onClick: exportCsv },
        ]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Credits"
          value={formatCurrency(totalCredits)}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="success"
          hint={`${filtered.filter((t) => t.direction === "credit").length} transactions`}
        />
        <StatCard
          label="Total Debits"
          value={formatCurrency(totalDebits)}
          icon={<TrendingDown className="h-5 w-5" />}
          tone="danger"
          hint={`${filtered.filter((t) => t.direction === "debit").length} transactions`}
        />
        <StatCard
          label="Net Flow"
          value={formatCurrency(net)}
          icon={<ArrowLeftRight className="h-5 w-5" />}
          tone={net >= 0 ? "success" : "danger"}
          hint={net >= 0 ? "Net positive" : "Net negative"}
        />
        <StatCard
          label="Showing"
          value={filtered.length}
          icon={<Receipt className="h-5 w-5" />}
          tone="brand"
          hint={`of ${txns.length} total`}
        />
      </div>

      {/* Monthly spending chart */}
      <SectionCard
        title="Monthly Spending Trend"
        description="Credits vs debits over the last 6 months."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="credit" name="Credits" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" name="Debits" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Filters + table */}
      <SectionCard
        title="Transaction History"
        description="Search, filter by type and date range."
        action={
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        }
      >
        {/* Filter row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or reference..."
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="subscription_payment">Subscription</SelectItem>
              <SelectItem value="premium_service">Premium Service</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="wallet_credit">Wallet Credit</SelectItem>
              <SelectItem value="wallet_debit">Wallet Debit</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-36"
              aria-label="From date"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-36"
              aria-label="To date"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Wallet className="h-5 w-5" />}
            title="No transactions match"
            description="Try adjusting your search or filters."
            action={<Button size="sm" variant="outline" onClick={resetFilters}>Reset filters</Button>}
          />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      <div>{formatDate(t.date)}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDateTime(t.date).split(",")[1]}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-border capitalize"
                        style={{ color: TYPE_COLORS[t.type] }}
                      >
                        {TYPE_LABELS[t.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[18rem] font-medium">
                      <span className="line-clamp-1">{t.description}</span>
                    </TableCell>
                    <TableCell className="text-xs capitalize">{t.method}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.reference}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell
                      className={`whitespace-nowrap text-right font-semibold ${
                        t.direction === "credit"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {t.direction === "credit" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {txns.length} transactions
          </span>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
