"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, ShieldCheck, Clock, TrendingUp, Building2, Download } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, TENANT_NAME, formatCompactCurrency,
  TenantDisclaimer, ChartCard, ChartTooltip,
} from "./_shared";
import { subscriptions, invoices, payments } from "@/lib/mock-data";
import type { Invoice, Payment } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const SLA_EVENTS = [
  { id: "sl1", month: "May", uptime: 99.97, incidents: 1, avgResponseMs: 184 },
  { id: "sl2", month: "Jun", uptime: 99.99, incidents: 0, avgResponseMs: 172 },
  { id: "sl3", month: "Jul", uptime: 99.95, incidents: 2, avgResponseMs: 198 },
  { id: "sl4", month: "Aug", uptime: 100, incidents: 0, avgResponseMs: 168 },
  { id: "sl5", month: "Sep", uptime: 99.98, incidents: 1, avgResponseMs: 175 },
  { id: "sl6", month: "Oct", uptime: 99.99, incidents: 0, avgResponseMs: 164 },
];

const CREDIT_NOTES = [
  { id: "cn_1", number: "CN-2024-201", reason: "Duplicate invoice adjustment", amount: 5000, currency: "INR" as const, date: "2024-09-12T09:00:00Z" },
  { id: "cn_2", number: "CN-2024-198", reason: "Service credit — Oct 3rd incident", amount: 25000, currency: "INR" as const, date: "2024-10-05T09:00:00Z" },
];

// Consolidated billing by entity (mock)
const CONSOLIDATION = ENTERPRISE_ENTITIES.map((e, i) => {
  const base = i === 0 ? 4500000 : i === 1 ? 850000 : i === 2 ? 520000 : i === 3 ? 380000 : 240000;
  return {
    id: e.id,
    name: e.name,
    seats: i === 0 ? 200 : i === 1 ? 32 : i === 2 ? 18 : i === 3 ? 22 : 14,
    amount: base,
    pct: 0,
  };
});
const TOTAL_CONSOLIDATED = CONSOLIDATION.reduce((s, c) => s + c.amount, 0);
CONSOLIDATION.forEach((c) => (c.pct = Math.round((c.amount / TOTAL_CONSOLIDATED) * 100)));

export function EnterpriseBilling() {
  const sub = subscriptions.find((s) => s.organizationId === "e_001")!;
  const tenantInvoices: Invoice[] = invoices.filter((inv) =>
    ENTERPRISE_ENTITIES.some((e) => e.id === inv.organizationId)
  );
  const tenantPayments: Payment[] = payments.filter((p) =>
    ENTERPRISE_ENTITIES.some((e) => e.name === p.organizationName)
  );

  const totalInvoiced = tenantInvoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = tenantInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = tenantInvoices.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const slaUptime = SLA_EVENTS.reduce((s, e) => s + e.uptime, 0) / SLA_EVENTS.length;
  const slaTarget = 99.9;
  const slaBreach = slaUptime < slaTarget;
  const avgResponse = Math.round(SLA_EVENTS.reduce((s, e) => s + e.avgResponseMs, 0) / SLA_EVENTS.length);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contracts & Billing"
        description={`${TENANT_NAME} — enterprise tier, consolidated billing across entities, SLA tracking.`}
        icon={<Icon name="CreditCard" className="h-6 w-6" />}
        actions={[{ label: "Download statement", icon: "Download", variant: "outline", onClick: () => toast.success("Consolidated statement (PDF) generated") }]}
      />

      <TenantDisclaimer />

      {/* Contract terms */}
      <SectionCard title="Contract terms" description="Master enterprise agreement — annual contract">
        <div className="grid gap-4 lg:grid-cols-4">
          <ContractTerm label="Plan" value={sub.planName} icon={<CreditCard className="h-4 w-4" />} />
          <ContractTerm label="Billing cycle" value={sub.billingCycle === "annual" ? "Annual" : "Monthly"} icon={<Clock className="h-4 w-4" />} />
          <ContractTerm label="Seats" value={`${sub.seats} seats`} icon={<Building2 className="h-4 w-4" />} />
          <ContractTerm label="Renewal" value={formatDate(sub.renewalDate)} icon={<TrendingUp className="h-4 w-4" />} />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs uppercase text-muted-foreground">Annual contract value</p>
            <p className="mt-1 text-xl font-semibold">{formatCompactCurrency(sub.amount, sub.currency)}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs uppercase text-muted-foreground">SLA tier</p>
            <p className="mt-1 text-xl font-semibold">Enterprise 99.9%</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs uppercase text-muted-foreground">Account manager</p>
            <p className="mt-1 text-sm font-semibold">Aarav Sharma</p>
            <p className="text-xs text-muted-foreground">enterprise@jobson.id</p>
          </div>
        </div>
      </SectionCard>

      {/* SLA tracking */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Avg uptime (6mo)" value={`${slaUptime.toFixed(2)}%`} icon={<ShieldCheck className="h-5 w-5" />} tone={slaBreach ? "danger" : "success"} hint={`Target: ${slaTarget}%`} />
        <StatCard label="Avg response" value={`${avgResponse}ms`} icon={<Clock className="h-5 w-5" />} delta={{ value: "12ms faster", positive: true }} />
        <StatCard label="Incidents (6mo)" value={SLA_EVENTS.reduce((s, e) => s + e.incidents, 0)} icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />

        <ChartCard title="SLA uptime trend" description="Monthly uptime vs 99.9% target" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SLA_EVENTS}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis domain={[99.5, 100]} tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="uptime" name="Uptime %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Consolidated billing */}
      <SectionCard title="Multi-entity billing consolidation" description={`Total consolidated: ${formatCompactCurrency(TOTAL_CONSOLIDATED)} / yr across ${ENTERPRISE_ENTITIES.length} entities`}>
        <ul className="space-y-2">
          {CONSOLIDATION.map((c) => {
            const ent = ENTERPRISE_ENTITIES.find((e) => e.id === c.id)!;
            return (
              <li key={c.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AvatarLogo text={ent.logo} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.seats} seats · {ent.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCompactCurrency(c.amount)}</p>
                    <p className="text-xs text-muted-foreground">{c.pct}% of total</p>
                  </div>
                </div>
                <Progress value={c.pct} className="mt-2 h-1.5" />
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total invoiced" value={formatCompactCurrency(totalInvoiced)} icon={<CreditCard className="h-5 w-5" />} tone="brand" />
        <StatCard label="Paid" value={formatCompactCurrency(totalPaid)} icon={<CreditCard className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding" value={formatCompactCurrency(totalOutstanding)} icon={<CreditCard className="h-5 w-5" />} tone={totalOutstanding > 0 ? "warning" : "default"} />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices ({tenantInvoices.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({tenantPayments.length})</TabsTrigger>
          <TabsTrigger value="credits">Credit notes ({CREDIT_NOTES.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-3">
          <SectionCard title="Invoices" description="All invoices across tenant entities.">
            <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                      <TableCell className="text-sm">{inv.organizationName}</TableCell>
                      <TableCell className="text-right text-sm">{formatCompactCurrency(inv.amount, inv.currency)}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{formatCompactCurrency(inv.tax, inv.currency)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCompactCurrency(inv.total, inv.currency)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(inv.issueDate)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success(`Invoice ${inv.number} downloaded`)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="payments" className="mt-3">
          <SectionCard title="Payment history" description="Successful and failed payments.">
            <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                      <TableCell className="font-mono text-xs">{p.invoiceNumber}</TableCell>
                      <TableCell className="text-sm">{p.organizationName}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCompactCurrency(p.amount, p.currency)}</TableCell>
                      <TableCell className="text-sm capitalize">{p.method.replace("_", " ")}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(p.timestamp)}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="credits" className="mt-3">
          <SectionCard title="Credit notes" description="Refunds and service credits.">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CREDIT_NOTES.map((cn) => (
                    <TableRow key={cn.id}>
                      <TableCell className="font-mono text-xs">{cn.number}</TableCell>
                      <TableCell className="text-sm">{cn.reason}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCompactCurrency(cn.amount, cn.currency)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(cn.date)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success(`Credit note ${cn.number} downloaded`)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <SectionCard title="Entity billing leads" description="Billing contacts per entity for invoice routing.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {ENTERPRISE_ENTITIES.map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <AvatarLogo text={e.logo} size="sm" />
                <div>
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.admin}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{e.city}</Badge>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function ContractTerm({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
