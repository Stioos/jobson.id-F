"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { walletTransactions, settlements } from "@/lib/partner-data";
import type { WalletTransaction } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Banknote, Coins, TrendingUp, AlertTriangle } from "lucide-react";

const TX_TYPES: WalletTransaction["type"][] = ["credit", "debit", "settlement", "fee", "refund", "bonus"];

export function PartnerWallet() {
  const partner = CURRENT_PARTNER;
  const [txList] = React.useState<WalletTransaction[]>(walletTransactions.filter((t) => t.partnerId === partner.id));
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);

  const filtered = txList.filter((t) => typeFilter === "all" || t.type === typeFilter);

  const creditThisMonth = txList
    .filter((t) => (t.type === "credit" || t.type === "settlement" || t.type === "bonus") && new Date(t.timestamp).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);
  const settledYTD = settlements.filter((s) => s.partnerId === partner.id && s.status === "paid").reduce((s, x) => s + x.netPayable, 0);

  // Wallet trend (synthetic from transactions, chronological)
  const walletTrend = [
    { month: "May", balance: 84000 },
    { month: "Jun", balance: 112000 },
    { month: "Jul", balance: 96000 },
    { month: "Aug", balance: 142000 },
    { month: "Sep", balance: 168000 },
    { month: "Oct", balance: partner.walletBalance },
  ];

  function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    if (amount > partner.walletBalance) {
      toast.error("Insufficient balance", { description: `Available: ${formatCurrency(partner.walletBalance)}` });
      return;
    }
    setWithdrawOpen(false);
    toast.success("Withdrawal initiated", { description: `${formatCurrency(amount)} → ${fd.get("account")}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet & Revenue"
        description={`${partner.name} — real-time wallet balance, transactions, and revenue overview.`}
        icon={<Icon name="Wallet" className="h-6 w-6" />}
        actions={[
          { label: "Withdraw", icon: "Banknote", onClick: () => setWithdrawOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      {/* Wallet balance hero card */}
      <Card className="overflow-hidden border-brand/30">
        <CardContent className="p-6 bg-gradient-to-br from-brand/10 to-transparent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Available Wallet Balance</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-brand">{formatCurrency(partner.walletBalance)}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Pending settlement: <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(partner.pendingSettlement)}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setWithdrawOpen(true)}>
                <Banknote className="h-4 w-4 mr-2" /> Withdraw Funds
              </Button>
              <Button variant="outline" onClick={() => toast.success("Statement downloaded", { description: "wallet-statement-oct-2024.csv" })}>
                Download Statement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue YTD" value={formatCurrency(partner.revenueYTD)} icon={<TrendingUp className="h-5 w-5" />} tone="brand" delta={{ value: "18% YoY", positive: true }} />
        <StatCard label="Settlements YTD" value={formatCurrency(settledYTD)} icon={<Coins className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Settlement" value={formatCurrency(partner.pendingSettlement)} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="This Month Credit" value={formatCurrency(creditThisMonth)} icon={<ArrowUpRight className="h-5 w-5" />} />
      </div>

      {/* Chart */}
      <ChartCard title="Wallet Balance Trend" description="Last 6 months">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={walletTrend}>
            <defs>
              <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="balance" name="Balance" stroke="#10b981" strokeWidth={2} fill="url(#walletGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Transactions */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TX_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No transactions.</TableCell></TableRow>
                ) : filtered.map((t) => {
                  const isCredit = t.amount > 0;
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCredit ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                            {isCredit ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          </div>
                          <StatusBadge status={t.type} />
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {isCredit ? "+" : "−"}{formatCurrency(Math.abs(t.amount))}
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(t.balance)}</TableCell>
                      <TableCell className="text-sm">{t.description}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{t.reference ?? "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <p>{formatDate(t.timestamp)}</p>
                        <p className="text-[10px]">{timeAgo(t.timestamp)}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Transfer wallet balance to your registered bank account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw} className="space-y-3">
            <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Available balance</p>
              <p className="text-2xl font-bold text-brand">{formatCurrency(partner.walletBalance)}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" name="amount" type="number" min={1} max={partner.walletBalance} required defaultValue={partner.walletBalance} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="account">Destination Account</Label>
              <Select name="account" defaultValue="hdfc">
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hdfc">HDFC Bank — ****1234</SelectItem>
                  <SelectItem value="icici">ICICI Bank — ****5678</SelectItem>
                  <SelectItem value="sbi">SBI — ****9012</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
              <Button type="submit">Withdraw</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
