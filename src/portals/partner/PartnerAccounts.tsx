"use client";

import * as React from "react";
import { partnerTransactions, taxRates, settlements } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Wallet, AlertCircle, ArrowDownLeft, ArrowUpRight, Landmark, FileText, Download, Percent, IndianRupee } from "lucide-react";

export function PartnerAccounts() {
  const partner = CURRENT_PARTNER;
  const txns = partnerTransactions.filter((t) => t.partnerId === partner.id);
  const partnerSettlements = settlements.filter((s) => s.partnerId === partner.id);

  const walletBalance = partner.walletBalance;
  const pendingReceivables = partner.pendingSettlement;
  const pendingPayables = txns.filter((t) => t.type === "fee" || t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const taxLiabilities = txns.filter((t) => t.type === "tax").reduce((s, t) => s + t.amount, 0);
  const gstCollected = txns.filter((t) => t.type === "tax" && t.description.includes("GST")).reduce((s, t) => s + t.amount, 0);
  const tdsDeducted = Math.round(partner.revenueYTD * 0.02);

  // 6-month balance trend
  const monthlyAvg = partner.revenueYTD / 6;
  const balanceTrend = [
    { month: "May", balance: Math.round(monthlyAvg * 1.5), receivable: Math.round(monthlyAvg * 0.4) },
    { month: "Jun", balance: Math.round(monthlyAvg * 1.6), receivable: Math.round(monthlyAvg * 0.5) },
    { month: "Jul", balance: Math.round(monthlyAvg * 1.7), receivable: Math.round(monthlyAvg * 0.55) },
    { month: "Aug", balance: Math.round(monthlyAvg * 1.8), receivable: Math.round(monthlyAvg * 0.6) },
    { month: "Sep", balance: Math.round(monthlyAvg * 1.9), receivable: Math.round(monthlyAvg * 0.65) },
    { month: "Oct", balance: partner.walletBalance, receivable: partner.pendingSettlement },
  ];

  const gstFilingStatus = [
    { period: "Oct 2024", due: "20 Nov 2024", status: "filed", amount: gstCollected },
    { period: "Sep 2024", due: "20 Oct 2024", status: "filed", amount: Math.round(gstCollected * 0.9) },
    { period: "Nov 2024", due: "20 Dec 2024", status: "pending", amount: Math.round(gstCollected * 1.1) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balances & Tax"
        description={`${partner.name} — account balances, GST filing status, TDS summary, and balance trends.`}
        icon={<Icon name="Landmark" className="h-6 w-6" />}
        actions={[
          { label: "Account Statement", icon: "FileText", variant: "outline", onClick: () => toast.success("Statement downloading", { description: "Account statement PDF will be ready in a few seconds." }) },
        ]}
      />
      <PartnerDisclaimer />

      {/* Balance cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 to-transparent p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Wallet Balance</p>
            <Wallet className="h-5 w-5 text-brand" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-brand">{formatCurrency(walletBalance)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Available for withdrawal</p>
        </Card>
        <StatCard label="Pending Receivables" value={formatCurrency(pendingReceivables)} icon={<ArrowDownLeft className="h-5 w-5" />} tone="success" hint={`${partnerSettlements.filter((s) => s.status !== "paid").length} settlements`} />
        <StatCard label="Pending Payables" value={formatCurrency(pendingPayables)} icon={<ArrowUpRight className="h-5 w-5" />} tone="warning" hint="Fees + debits" />
        <StatCard label="Tax Liabilities" value={formatCurrency(taxLiabilities)} icon={<Percent className="h-5 w-5" />} tone="danger" hint="GST + TDS" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Balance trend chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Balance Trend" description="Wallet balance vs pending receivables — last 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrend}>
                <defs>
                  <linearGradient id="grad-bal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad-rec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="balance" name="Wallet balance" stroke="#10b981" fill="url(#grad-bal)" strokeWidth={2} />
                <Area type="monotone" dataKey="receivable" name="Receivables" stroke="#f59e0b" fill="url(#grad-rec)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* TDS Summary */}
        <Card className="p-4">
          <CardHeader className="p-0">
            <CardTitle className="text-base flex items-center gap-2"><Percent className="h-4 w-4 text-brand" /> TDS Summary</CardTitle>
            <CardDescription>Year-to-date TDS deducted</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-3 space-y-3">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total TDS Deducted</p>
              <p className="mt-1 text-xl font-semibold">{formatCurrency(tdsDeducted)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Section 194J</span>
                <span className="font-medium">{formatCurrency(Math.round(tdsDeducted * 0.5))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Section 194C</span>
                <span className="font-medium">{formatCurrency(Math.round(tdsDeducted * 0.3))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Other</span>
                <span className="font-medium">{formatCurrency(Math.round(tdsDeducted * 0.2))}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Form 26AS downloaded", { description: "TDS certificate ready for download." })}>
              <Download className="mr-2 h-3.5 w-3.5" /> Download Form 26AS
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* GST Filing status */}
      <SectionCard
        title="GST Filing Status"
        description="GSTR-1 and GSTR-3B filing status — last 3 months"
        action={<Button size="sm" variant="outline" onClick={() => toast.success("GSTR-3B draft prepared", { description: "Opening GST portal pre-fill." })}><FileText className="mr-2 h-3.5 w-3.5" /> File GSTR-3B</Button>}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>GST Collected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gstFilingStatus.map((g, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{g.period}</TableCell>
                <TableCell className="text-xs">{g.due}</TableCell>
                <TableCell className="font-semibold text-brand">{formatCurrency(g.amount)}</TableCell>
                <TableCell><StatusBadge status={g.status} /></TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" disabled={g.status === "filed"} onClick={() => toast.info("Filing initiated", { description: `${g.period} GSTR-3B opened.` })}>
                    {g.status === "filed" ? "Filed" : "File Now"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Recent transactions summary */}
      <SectionCard title="Recent Transactions" description="Last 5 transactions affecting your accounts">
        <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
          {txns.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.type === "credit" || t.type === "refund" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                  {t.type === "credit" || t.type === "refund" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.timestamp)} · {t.reference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${t.type === "credit" || t.type === "refund" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type === "credit" || t.type === "refund" ? "+" : "−"}{formatCurrency(t.amount)}
                </p>
                <p className="text-[10px] text-muted-foreground">Bal: {formatCurrency(t.balance)}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
