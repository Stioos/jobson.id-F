"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Receipt,
  Search,
  TrendingDown,
  Wallet,
  Filter,
  FileSpreadsheet,
  RotateCcw,
  FileText,
  Calendar,
  PieChart as PieIcon,
} from "lucide-react";

// ----- Types -----
type TxnType =
  | "subscription"
  | "job_post"
  | "featured_listing"
  | "resume_access"
  | "add_on"
  | "refund";

type TxnStatus = "success" | "pending" | "failed" | "refunded";

interface EmpTxn {
  id: string;
  date: string;
  type: TxnType;
  description: string;
  amount: number;
  status: TxnStatus;
  method: "upi" | "card" | "netbanking" | "wallet";
  invoiceNumber: string;
  reference: string;
}

// ----- Mock data -----
const SEED_TXNS: EmpTxn[] = [
  { id: "etx_1", date: "2024-10-22T11:30:00Z", type: "job_post", description: "10 Job Post Credits pack", amount: 4999, status: "success", method: "wallet", invoiceNumber: "INV-E-2024-501", reference: "CRD-JP-2291" },
  { id: "etx_2", date: "2024-10-18T09:00:00Z", type: "featured_listing", description: "5 Featured Listing Credits pack", amount: 9999, status: "success", method: "wallet", invoiceNumber: "INV-E-2024-498", reference: "CRD-FL-2190" },
  { id: "etx_3", date: "2024-10-12T14:20:00Z", type: "resume_access", description: "50 Resume Database Views", amount: 2999, status: "success", method: "card", invoiceNumber: "INV-E-2024-495", reference: "CRD-RV-2087" },
  { id: "etx_4", date: "2024-10-05T10:00:00Z", type: "add_on", description: "Branding boost — homepage carousel slot", amount: 15000, status: "success", method: "netbanking", invoiceNumber: "INV-E-2024-491", reference: "ADD-BB-2001" },
  { id: "etx_5", date: "2024-09-28T11:15:00Z", type: "job_post", description: "10 Job Post Credits pack", amount: 4999, status: "success", method: "wallet", invoiceNumber: "INV-E-2024-488", reference: "CRD-JP-2080" },
  { id: "etx_6", date: "2024-09-15T08:00:00Z", type: "subscription", description: "Professional plan — monthly subscription", amount: 14999, status: "success", method: "netbanking", invoiceNumber: "INV-E-2024-481", reference: "SUB-PR-1192" },
  { id: "etx_7", date: "2024-09-08T16:00:00Z", type: "refund", description: "Refund — unused credits reversed", amount: 4999, status: "refunded", method: "wallet", invoiceNumber: "INV-E-2024-478", reference: "RFD-2024-101" },
  { id: "etx_8", date: "2024-08-28T09:30:00Z", type: "featured_listing", description: "5 Featured Listing Credits pack", amount: 9999, status: "success", method: "wallet", invoiceNumber: "INV-E-2024-470", reference: "CRD-FL-1990" },
  { id: "etx_9", date: "2024-08-15T08:00:00Z", type: "subscription", description: "Professional plan — monthly subscription", amount: 14999, status: "success", method: "netbanking", invoiceNumber: "INV-E-2024-465", reference: "SUB-PR-1180" },
  { id: "etx_10", date: "2024-08-02T13:45:00Z", type: "resume_access", description: "100 Resume Database Views (bulk pack)", amount: 5499, status: "success", method: "card", invoiceNumber: "INV-E-2024-460", reference: "CRD-RV-1910" },
  { id: "etx_11", date: "2024-07-19T17:10:00Z", type: "add_on", description: "Email blast campaign — 50K candidates", amount: 24000, status: "success", method: "netbanking", invoiceNumber: "INV-E-2024-450", reference: "ADD-EB-1880" },
  { id: "etx_12", date: "2024-07-15T08:00:00Z", type: "subscription", description: "Professional plan — monthly subscription", amount: 14999, status: "failed", method: "netbanking", invoiceNumber: "INV-E-2024-445", reference: "SUB-PR-1175" },
  { id: "etx_13", date: "2024-06-30T10:00:00Z", type: "job_post", description: "20 Job Post Credits (bulk pack)", amount: 8999, status: "success", method: "wallet", invoiceNumber: "INV-E-2024-440", reference: "CRD-JP-1860" },
  { id: "etx_14", date: "2024-06-15T08:00:00Z", type: "subscription", description: "Professional plan — monthly subscription", amount: 14999, status: "success", method: "netbanking", invoiceNumber: "INV-E-2024-430", reference: "SUB-PR-1162" },
];

const TYPE_LABELS: Record<TxnType, string> = {
  subscription: "Subscription",
  job_post: "Job Post",
  featured_listing: "Featured Listing",
  resume_access: "Resume Access",
  add_on: "Add-on",
  refund: "Refund",
};

const TYPE_COLORS: Record<TxnType, string> = {
  subscription: "#10b981",
  job_post: "#14b8a6",
  featured_listing: "#f59e0b",
  resume_access: "#8b5cf6",
  add_on: "#06b6d4",
  refund: "#f43f5e",
};

// ----- Component -----
export function EmployerTransactions() {
  const [txns] = React.useState<EmpTxn[]>(SEED_TXNS);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return txns.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${t.description} ${t.reference} ${t.invoiceNumber}`.toLowerCase().includes(q)) return false;
      }
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (fromDate && new Date(t.date) < new Date(fromDate)) return false;
      if (toDate && new Date(t.date) > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });
  }, [txns, search, typeFilter, statusFilter, fromDate, toDate]);

  const totalSpendYTD = txns.filter((t) => t.type !== "refund" && t.status === "success").reduce((s, t) => s + t.amount, 0);
  const thisMonthSpend = txns
    .filter((t) => t.type !== "refund" && t.status === "success" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);
  const refundsTotal = txns.filter((t) => t.type === "refund").reduce((s, t) => s + t.amount, 0);

  // By category (for pie chart)
  const byCategory = React.useMemo(() => {
    const map = new Map<TxnType, number>();
    txns.forEach((t) => {
      if (t.type === "refund" || t.status !== "success") return;
      map.set(t.type, (map.get(t.type) ?? 0) + t.amount);
    });
    return Array.from(map.entries()).map(([type, value]) => ({
      name: TYPE_LABELS[type],
      value,
      color: TYPE_COLORS[type],
    }));
  }, [txns]);

  // Monthly trend (last 6 months)
  const monthly = React.useMemo(() => {
    const now = new Date();
    const months: { month: string; spend: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-IN", { month: "short" });
      const spend = txns
        .filter((t) => t.type !== "refund" && t.status === "success" && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear())
        .reduce((s, t) => s + t.amount, 0);
      months.push({ month: label, spend });
    }
    return months;
  }, [txns]);

  function downloadInvoice(inv: string) {
    toast.success(`Downloading ${inv}.pdf`, { description: "GST invoice ready for accounting." });
  }
  function exportCsv() {
    toast.success("CSV exported", { description: `${filtered.length} transactions exported to employer-transactions.csv` });
  }
  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    toast.info("Filters cleared");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employer Transactions"
        description="Complete billing history — subscriptions, job posts, featured listings, resume access, add-ons, and refunds."
        icon={<Receipt className="h-6 w-6" />}
        actions={[
          { label: "Export CSV", icon: "FileSpreadsheet", variant: "outline", onClick: exportCsv },
        ]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Spend YTD"
          value={formatCurrency(totalSpendYTD)}
          icon={<TrendingDown className="h-5 w-5" />}
          tone="brand"
          hint="Year to date"
        />
        <StatCard
          label="This Month"
          value={formatCurrency(thisMonthSpend)}
          icon={<Calendar className="h-5 w-5" />}
          tone="success"
          hint="Current month spend"
        />
        <StatCard
          label="Refunds"
          value={formatCurrency(refundsTotal)}
          icon={<RotateCcw className="h-5 w-5" />}
          tone="warning"
          hint={`${txns.filter((t) => t.type === "refund").length} refund transactions`}
        />
        <StatCard
          label="Transactions"
          value={txns.length}
          icon={<Receipt className="h-5 w-5" />}
          tone="default"
          hint={`${txns.filter((t) => t.status === "failed").length} failed`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Monthly Spend Trend" description="Last 6 months" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="spend" name="Spend" stroke="#10b981" strokeWidth={2} fill="url(#gSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Spend by Category"
          description="YTD distribution"
          action={<PieIcon className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {byCategory.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {byCategory.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium">{formatCurrency(c.value)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Filters + transaction table */}
      <SectionCard
        title="Transaction History"
        description="Search, filter by type, status, and date range. Download GST invoices per transaction."
        action={
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        }
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, invoice, reference..."
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="job_post">Job Post</SelectItem>
              <SelectItem value="featured_listing">Featured Listing</SelectItem>
              <SelectItem value="resume_access">Resume Access</SelectItem>
              <SelectItem value="add_on">Add-on</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
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
          <div className="max-h-[32rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => {
                  const isRefund = t.type === "refund";
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDate(t.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-border"
                          style={{ color: TYPE_COLORS[t.type] }}
                        >
                          {TYPE_LABELS[t.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[16rem] font-medium">
                        <span className="line-clamp-1">{t.description}</span>
                        <span className="block text-[10px] font-normal text-muted-foreground">{t.reference}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{t.invoiceNumber}</TableCell>
                      <TableCell className="text-xs capitalize">{t.method}</TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap text-right font-semibold ${
                          isRefund
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isRefund ? "+" : "−"}
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(t.invoiceNumber)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {txns.length} transactions · Total: {formatCurrency(filtered.reduce((s, t) => s + (t.type === "refund" ? -t.amount : t.amount), 0))}
          </span>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
