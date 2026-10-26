"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend,
} from "recharts";
import { CHART_COLORS } from "./_shared";
import {
  talentTransactions, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  Wallet, TrendingUp, Clock, AlertTriangle, CheckCircle2, Download, ArrowRight, Receipt,
} from "lucide-react";

// 6-month trend synthesized
const TREND_DATA = [
  { month: "May", volume: 2840000, count: 8 },
  { month: "Jun", volume: 3120000, count: 9 },
  { month: "Jul", volume: 2980000, count: 7 },
  { month: "Aug", volume: 3650000, count: 11 },
  { month: "Sep", volume: 4120000, count: 12 },
  { month: "Oct", volume: 4480000, count: 14 },
];

const TYPE_BREAKDOWN = (() => {
  const map = new Map<string, { count: number; volume: number }>();
  for (const t of talentTransactions) {
    const cur = map.get(t.type) ?? { count: 0, volume: 0 };
    cur.count += 1;
    cur.volume += t.amount;
    map.set(t.type, cur);
  }
  return Array.from(map.entries()).map(([type, v]) => ({
    type: type.replace(/_/g, " "),
    ...v,
  }));
})();

const SOLUTION_BREAKDOWN = (() => {
  const map = new Map<TalentSolutionType, { count: number; volume: number }>();
  for (const t of talentTransactions) {
    const cur = map.get(t.solutionType) ?? { count: 0, volume: 0 };
    cur.count += 1;
    cur.volume += t.amount;
    map.set(t.solutionType, cur);
  }
  return Array.from(map.entries()).map(([st, v]) => ({
    solution: SOLUTION_TYPE_CONFIG[st].label,
    ...v,
  }));
})();

const TYPE_COLORS = TYPE_BREAKDOWN.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

export function TransactionHub() {
  const { navigate } = useNav();

  const totalVolume = talentTransactions.filter((t) => t.status === "completed" && t.type !== "refund").reduce((s, t) => s + t.amount, 0);
  const thisMonth = talentTransactions.filter((t) => {
    const d = new Date(t.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, t) => s + t.amount, 0);
  const pending = talentTransactions.filter((t) => t.status === "pending" || t.status === "processing").length;
  const disputed = talentTransactions.filter((t) => t.status === "disputed").length;
  const completed = talentTransactions.filter((t) => t.status === "completed").length;
  const successRate = Math.round((completed / talentTransactions.length) * 100);

  const statusDistribution = (() => {
    const map = new Map<string, number>();
    for (const t of talentTransactions) {
      map.set(t.status, (map.get(t.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  })();

  const recent = [...talentTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Hub"
        description="Central dashboard for all platform financial transactions — across talent solutions, billing, settlements, and refunds."
        icon={<Wallet className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "Hub" }]}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("Transactions exported", { description: "Full transaction ledger saved as CSV." }) },
          { label: "All Transactions", variant: "default", onClick: () => navigate("training", "transactions") },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Volume" value={formatCurrency(totalVolume)} delta={{ value: "12% QoQ", positive: true }} icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} hint={`${formatNumber(talentTransactions.length)} transactions`} icon={<Wallet className="h-5 w-5" />} tone="default" />
        <StatCard label="Pending" value={pending} hint={`${disputed} disputed`} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Success Rate" value={`${successRate}%`} delta={{ value: "1.2pp MoM", positive: true }} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Trend */}
        <SectionCard title="Transaction Volume Trend" description="Last 6 months" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="volume" name="Volume" stroke={CHART_COLORS[0]} fill="url(#gVol)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* By Type Pie */}
        <SectionCard title="By Transaction Type" description="Distribution by count">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TYPE_BREAKDOWN} dataKey="count" nameKey="type" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {TYPE_BREAKDOWN.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* By Solution Type Bar */}
        <SectionCard title="By Solution Type" description="Volume per talent solution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SOLUTION_BREAKDOWN} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="solution" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="volume" name="Volume" radius={[6, 6, 0, 0]}>
                  {SOLUTION_BREAKDOWN.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Status Distribution */}
      <SectionCard title="Status Distribution" description="Across all transactions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statusDistribution.map((s) => (
            <div key={s.name} className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground capitalize">{s.name}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recent transactions */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h3 className="text-base font-semibold">Recent Transactions</h3>
              <p className="text-xs text-muted-foreground">Last 10 transactions across all solutions</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("training", "transactions")}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Solution</TableHead>
                <TableHead>Payer → Payee</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate("training", `transactions/${t.id}`)}>
                  <TableCell><code className="text-xs">{t.transactionNumber}</code></TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{t.type.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{SOLUTION_TYPE_CONFIG[t.solutionType].shortLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="text-muted-foreground">{t.payer}</span>
                    <span className="mx-1">→</span>
                    <span className="font-medium">{t.payee}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(t.amount, t.currency)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
