"use client";

import * as React from "react";
import { partnerTransactions } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { ReceiptText, Search, Download, ArrowDownLeft, ArrowUpRight, Percent } from "lucide-react";

const TYPES = ["all", "credit", "debit", "tax", "fee", "refund", "payout"] as const;
const TYPE_LABEL: Record<string, string> = {
  credit: "Credit", debit: "Debit", tax: "Tax", fee: "Fee", refund: "Refund", payout: "Payout",
};

export function PartnerTransactions() {
  const partner = CURRENT_PARTNER;
  const allTxns = partnerTransactions.filter((t) => t.partnerId === partner.id);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = allTxns.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (search && !`${t.description} ${t.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateRange !== "all") {
      const d = new Date(t.timestamp).getTime();
      const now = Date.now();
      const days = parseInt(dateRange, 10);
      if (now - d > days * 86400000) return false;
    }
    return true;
  });

  // KPIs
  const totalCredits = allTxns.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = allTxns.filter((t) => t.type === "debit" || t.type === "payout" || t.type === "fee").reduce((s, t) => s + t.amount, 0);
  const netTaxCollected = allTxns.filter((t) => t.type === "tax").reduce((s, t) => s + t.amount, 0);

  // Monthly trend
  const monthlyMap: Record<string, { month: string; credits: number; debits: number }> = {};
  allTxns.forEach((t) => {
    const d = new Date(t.timestamp);
    const key = d.toLocaleDateString("en-IN", { month: "short" });
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, credits: 0, debits: 0 };
    if (t.type === "credit") monthlyMap[key].credits += t.amount;
    else if (t.type === "debit" || t.type === "payout" || t.type === "fee") monthlyMap[key].debits += t.amount;
  });
  const monthlyTrend = Object.values(monthlyMap);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={`${partner.name} — full transaction ledger with credits, debits, taxes, fees, refunds, and payouts.`}
        icon={<Icon name="ReceiptText" className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: () => toast.success("Export started", { description: "CSV export will be ready in a few seconds." }) }]}
      />
      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Credits" value={formatCurrency(totalCredits)} icon={<ArrowDownLeft className="h-5 w-5" />} tone="success" hint={`${allTxns.filter((t) => t.type === "credit").length} transactions`} />
        <StatCard label="Total Debits" value={formatCurrency(totalDebits)} icon={<ArrowUpRight className="h-5 w-5" />} tone="danger" hint="Debits + payouts + fees" />
        <StatCard label="Net Tax Collected" value={formatCurrency(netTaxCollected)} icon={<Percent className="h-5 w-5" />} tone="warning" hint="GST collected on behalf" />
      </div>

      {/* Monthly trend chart */}
      <ChartCard title="Monthly Transaction Trend" description="Credits vs debits by month">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="credits" name="Credits" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="debits" name="Debits" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Transaction table */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search description, reference..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All Types" : TYPE_LABEL[t]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">No transactions match your filters.</TableCell></TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs whitespace-nowrap">{formatDate(t.timestamp)}</TableCell>
                  <TableCell><StatusBadge status={t.type} /></TableCell>
                  <TableCell className="text-sm">{t.description}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{t.reference}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatCurrency(t.amount)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{t.taxAmount ? formatCurrency(t.taxAmount) : "—"}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{t.netAmount ? formatCurrency(t.netAmount) : formatCurrency(t.amount)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(t.balance)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
