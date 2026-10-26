"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { payments } from "@/lib/mock-data";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries, Toolbar } from "./_shared";

export function AdminPayments() {
  const [rows] = React.useState<Payment[]>(payments);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [methodFilter, setMethodFilter] = React.useState("all");
  const [refundTarget, setRefundTarget] = React.useState<Payment | null>(null);
  const [refundReason, setRefundReason] = React.useState("");

  const filtered = rows.filter((p) => {
    if (search && !`${p.transactionId} ${p.organizationName} ${p.invoiceNumber}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    return true;
  });

  const totalRevenue = rows.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const failed = rows.filter((p) => p.status === "failed").length;
  const refunded = rows.filter((p) => p.status === "refunded").length;

  const revenueTrend = makeSeries("rev", 14, 200000, 80000).map((p) => ({ ...p, value: p.value }));

  const refund = () => {
    if (!refundTarget) return;
    toast.success("Refund initiated", { description: `${formatCurrency(refundTarget.amount, refundTarget.currency)} → ${refundTarget.organizationName}. 5-7 business days.` });
    setRefundTarget(null); setRefundReason("");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payments & Transactions"
        description="Track payments, manage refunds, and monitor revenue."
        icon={<Icon name="CreditCard" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Exported CSV (demo)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Total revenue" value={formatCurrency(totalRevenue)} icon="Banknote" tone="success" />
        <MiniStat label="Transactions" value={rows.length} icon="Receipt" />
        <MiniStat label="Failed" value={failed} icon="XCircle" tone="danger" />
        <MiniStat label="Refunded" value={refunded} icon="Repeat" tone="warning" />
      </div>

      {failed > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-sm">
          <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500" />
          <span>{failed} failed payment(s) need attention. Review and notify customers.</span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => toast.info("Showing failed payments")}>Review</Button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue (14d)" description="Daily successful payment volume" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Revenue" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="By payment method" description="Distribution (30d).">
          <ul className="space-y-2 text-sm">
            {[
              { method: "upi", count: 142, value: 842000 },
              { method: "card", count: 86, value: 1240000 },
              { method: "bank_transfer", count: 24, value: 5310000 },
              { method: "netbanking", count: 12, value: 220000 },
              { method: "wallet", count: 8, value: 48000 },
            ].map((m) => (
              <li key={m.method} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="capitalize">{m.method.replace(/_/g, " ")}</span>
                <span className="text-muted-foreground">{m.count} · {formatCurrency(m.value)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title={`Transactions (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search txn id, org, invoice..."
          filters={
            <>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All methods</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="netbanking">Netbanking</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                  <TableCell className="text-xs">{p.invoiceNumber}</TableCell>
                  <TableCell className="text-sm">{p.organizationName}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(p.amount, p.currency)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{p.method.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(p.timestamp)}</TableCell>
                  <TableCell className="text-right">
                    {p.status === "success" && (
                      <Button size="sm" variant="ghost" className="text-amber-600" onClick={() => setRefundTarget(p)}>Refund</Button>
                    )}
                    {p.status !== "success" && <Button size="sm" variant="ghost" onClick={() => toast.info("View transaction (demo)")}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No transactions found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <Dialog open={!!refundTarget} onOpenChange={(o) => !o && setRefundTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate refund</DialogTitle>
            <DialogDescription>{refundTarget && `Refund ${formatCurrency(refundTarget.amount, refundTarget.currency)} to ${refundTarget.organizationName}.`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ref-reason">Reason</Label>
              <Textarea id="ref-reason" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Customer request / duplicate charge / service issue..." rows={3} />
            </div>
            <p className="text-xs text-muted-foreground">Refunds typically take 5-7 business days to appear on the customer's statement.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundTarget(null)}>Cancel</Button>
            <Button onClick={refund} className="bg-amber-600 hover:bg-amber-700">Initiate refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" | "danger" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "danger" ? "text-rose-600 bg-rose-500/10 dark:text-rose-300" : tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
