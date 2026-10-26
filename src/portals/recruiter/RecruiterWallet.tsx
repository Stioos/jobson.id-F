"use client";

import * as React from "react";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Banknote, Clock, Plus, Download,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/format";
import { recruitmentWallet } from "@/lib/partner-data";
import type { Currency } from "@/lib/types";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";

type TxnType = "credit" | "debit";

interface WalletTxn {
  id: string;
  type: TxnType;
  amount: number;
  balanceAfter: number;
  description: string;
  date: string;
  category: string;
}

const TRANSACTIONS: WalletTxn[] = [
  { id: "wt_001", type: "credit", amount: 250000, balanceAfter: 842000, description: "Kavya Reddy placement — DataMinds AI", date: "2024-10-28T10:30:00Z", category: "Placement fee" },
  { id: "wt_002", type: "credit", amount: 90000, balanceAfter: 592000, description: "UI/UX Designer placement — TechCorp", date: "2024-10-22T14:15:00Z", category: "Placement fee" },
  { id: "wt_003", type: "debit", amount: 500000, balanceAfter: 502000, description: "Withdrawal to HDFC ****4321", date: "2024-10-20T09:00:00Z", category: "Withdrawal" },
  { id: "wt_004", type: "credit", amount: 340000, balanceAfter: 1002000, description: "2 DevOps contract placements — FinEdge", date: "2024-10-18T11:00:00Z", category: "Contract fee" },
  { id: "wt_005", type: "debit", amount: 35000, balanceAfter: 662000, description: "Referral bonus payout — Arjun Iyer", date: "2024-10-15T16:45:00Z", category: "Referral payout" },
  { id: "wt_006", type: "credit", amount: 200000, balanceAfter: 697000, description: "Priya Nair placement — TechCorp (pending)", date: "2024-10-12T08:20:00Z", category: "Placement fee" },
  { id: "wt_007", type: "credit", amount: 180000, balanceAfter: 497000, description: "Arjun Iyer placement — FinEdge (pending)", date: "2024-10-10T13:00:00Z", category: "Placement fee" },
  { id: "wt_008", type: "debit", amount: 250000, balanceAfter: 317000, description: "Withdrawal to HDFC ****4321", date: "2024-10-05T10:00:00Z", category: "Withdrawal" },
  { id: "wt_009", type: "credit", amount: 220000, balanceAfter: 567000, description: "Neha Patel placement — TechCorp", date: "2024-09-28T15:30:00Z", category: "Placement fee" },
  { id: "wt_010", type: "debit", amount: 18000, balanceAfter: 347000, description: "Premium LinkedIn Recruiter seat", date: "2024-09-25T09:30:00Z", category: "Tooling" },
];

const REVENUE_TREND = [
  { month: "May", revenue: 380000 },
  { month: "Jun", revenue: 520000 },
  { month: "Jul", revenue: 460000 },
  { month: "Aug", revenue: 610000 },
  { month: "Sep", revenue: 720000 },
  { month: "Oct", revenue: 680000 },
];

const EARNINGS_BY_CLIENT = [
  { name: "TechCorp India", value: 1450000, color: "oklch(0.65 0.18 162)" },
  { name: "FinEdge Solutions", value: 980000, color: "oklch(0.7 0.18 70)" },
  { name: "DataMinds AI", value: 820000, color: "oklch(0.65 0.13 250)" },
  { name: "SecureBank", value: 460000, color: "oklch(0.6 0.13 200)" },
  { name: "StartupX", value: 290000, color: "oklch(0.65 0.18 350)" },
  { name: "Others", value: 600000, color: "oklch(0.7 0.05 0)" },
];

const BANK_ACCOUNTS = [
  { id: "ba_1", label: "HDFC Bank ****4321", ifsc: "HDFC0001234" },
  { id: "ba_2", label: "ICICI Bank ****8765", ifsc: "ICIC0005678" },
  { id: "ba_3", label: "Axis Bank ****2211", ifsc: "UTIB0009012" },
];

export function RecruiterWallet() {
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState(0);
  const [bankAccount, setBankAccount] = React.useState("ba_1");
  const [filterType, setFilterType] = React.useState("all");

  const currency: Currency = "INR";

  const filteredTxns = TRANSACTIONS.filter((t) => filterType === "all" || t.type === filterType);
  const totalCredit = TRANSACTIONS.filter((t) => t.type === "credit").reduce((a, t) => a + t.amount, 0);
  const totalDebit = TRANSACTIONS.filter((t) => t.type === "debit").reduce((a, t) => a + t.amount, 0);

  function handleWithdraw() {
    if (withdrawAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (withdrawAmount > recruitmentWallet.balance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    setWithdrawOpen(false);
    setConfirmOpen(true);
  }

  function confirmWithdraw() {
    setConfirmOpen(false);
    const bank = BANK_ACCOUNTS.find((b) => b.id === bankAccount)?.label || "bank account";
    toast.success("Withdrawal requested", {
      description: `${formatCurrency(withdrawAmount, currency)} → ${bank} • NEFT in 1–2 business days`,
    });
    setWithdrawAmount(0);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet & revenue"
        description="Your placement fees, withdrawals and earnings breakdown — all in one wallet."
        actions={[
          { label: "Withdraw", onClick: () => setWithdrawOpen(true) },
          { label: "Statement", variant: "outline", onClick: () => toast.success("Statement downloaded", { description: "Last 90 days • PDF" }) },
        ]}
      />

      {/* Balance hero + KPIs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-gradient-to-br from-brand/10 to-brand/5 p-5 sm:p-6 h-full">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Available balance</div>
                <div className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                  {formatCurrency(recruitmentWallet.balance, currency)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Updated {formatDate(new Date().toISOString())}</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-primary-foreground">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button size="sm" onClick={() => setWithdrawOpen(true)} className="flex-1">
                <ArrowUpRight className="h-4 w-4 mr-1.5" />Withdraw
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Add money dialog (demo)", { description: "Top-up wallet via UPI/NEFT" })}>
                <Plus className="h-4 w-4 mr-1.5" />Add
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              Withdrawals processed via NEFT in 1–2 business days. Minimum withdrawal: {formatCurrency(10000, currency)}.
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard label="Total earned" value={formatCurrency(recruitmentWallet.totalEarned, currency)} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint="All-time" />
          <StatCard label="Total withdrawn" value={formatCurrency(recruitmentWallet.totalWithdrawn, currency)} icon={<TrendingDown className="h-5 w-5" />} tone="default" hint="All-time" />
          <StatCard label="Pending payout" value={formatCurrency(recruitmentWallet.pendingPayout, currency)} icon={<Clock className="h-5 w-5" />} tone="warning" hint="Awaiting settlement" />
          <StatCard label="This month earned" value={formatCurrency(recruitmentWallet.thisMonthEarned, currency)} icon={<Banknote className="h-5 w-5" />} tone="brand" hint="Oct 2024" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <SectionCard title="Revenue trend" description="Monthly earnings from placement fees." className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_TREND} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="walletRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.18 162)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.65 0.18 162)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.65 0.18 162)" strokeWidth={2} fill="url(#walletRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Earnings by client" description="Top revenue sources." className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={EARNINGS_BY_CLIENT}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={45}
                paddingAngle={2}
              >
                {EARNINGS_BY_CLIENT.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Transactions */}
      <SectionCard
        title="Transaction history"
        description="Every credit (placement fee) and debit (withdrawal, payout)."
        action={
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="credit">Credits</SelectItem>
              <SelectItem value="debit">Debits</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {filteredTxns.length === 0 ? (
          <EmptyState icon={<Wallet className="h-5 w-5" />} title="No transactions" description="No transactions match your filter." />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 sticky top-0">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Date</th>
                  <th className="px-3 py-2 font-medium text-right">Amount</th>
                  <th className="px-3 py-2 font-medium text-right hidden sm:table-cell">Balance</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.type === "credit" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                        {t.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-sm">{t.description}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{t.category} • {formatDate(t.date)}</div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell"><Badge variant="outline" className="text-xs">{t.category}</Badge></td>
                    <td className="px-3 py-3 hidden md:table-cell text-muted-foreground text-xs">{formatDateTime(t.date)}</td>
                    <td className={`px-3 py-3 text-right font-semibold ${t.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {t.type === "credit" ? "+" : "−"}{formatCurrency(t.amount, currency)}
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground hidden sm:table-cell">{formatCurrency(t.balanceAfter, currency)}</td>
                    <td className="px-3 py-3">
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt downloaded", { description: `Txn ${t.id}` })}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between">
              <span>{filteredTxns.length} transactions</span>
              <span>
                Total credits: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCredit, currency)}</span>
                {" • "}
                Total debits: <span className="font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(totalDebit, currency)}</span>
              </span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw funds</DialogTitle>
            <DialogDescription>Transfer from your wallet to your linked bank account via NEFT (1–2 business days).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="rounded-lg border bg-muted/30 p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Available balance</div>
                <div className="text-xl font-bold mt-0.5">{formatCurrency(recruitmentWallet.balance, currency)}</div>
              </div>
              <Wallet className="h-6 w-6 text-brand" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wd-amount">Amount (₹)</Label>
              <Input
                id="wd-amount"
                type="number"
                min={0}
                value={withdrawAmount || ""}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                placeholder="0"
              />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[100000, 250000, 500000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setWithdrawAmount(amt)}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs hover:border-brand hover:bg-muted/30 transition"
                  >
                    {formatCurrency(amt, currency)}
                  </button>
                ))}
                <button
                  onClick={() => setWithdrawAmount(recruitmentWallet.balance)}
                  className="rounded-full border bg-background px-2.5 py-1 text-xs hover:border-brand hover:bg-muted/30 transition"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wd-bank">Bank account</Label>
              <Select value={bankAccount} onValueChange={setBankAccount}>
                <SelectTrigger id="wd-bank"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BANK_ACCOUNTS.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.label} ({b.ifsc})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Withdrawal amount</span><span className="font-medium">{formatCurrency(withdrawAmount, currency)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">NEFT processing fee</span><span className="font-medium">{formatCurrency(0, currency)}</span></div>
              <div className="flex items-center justify-between border-t pt-1.5"><span className="font-semibold">You'll receive</span><span className="font-bold">{formatCurrency(withdrawAmount, currency)}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdraw}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw confirm */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm withdrawal</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to withdraw <span className="font-semibold text-foreground">{formatCurrency(withdrawAmount, currency)}</span> to{" "}
              <span className="font-semibold text-foreground">{BANK_ACCOUNTS.find((b) => b.id === bankAccount)?.label}</span>.
              This action cannot be reversed once processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdraw}>Confirm withdrawal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
