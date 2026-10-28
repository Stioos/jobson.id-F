"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Gateway {
  name: string; successRate: number; avgResponseMs: number; uptime: number; downtime: string; txns24h: number; failed24h: number; settlementCycle: string; status: "healthy" | "degraded" | "down";
}

const GATEWAYS: Gateway[] = [
  { name: "Razorpay", successRate: 98.4, avgResponseMs: 412, uptime: 99.97, downtime: "2m 30s", txns24h: 1842, failed24h: 29, settlementCycle: "T+1", status: "healthy" },
  { name: "Stripe", successRate: 99.1, avgResponseMs: 386, uptime: 99.99, downtime: "0m 45s", txns24h: 642, failed24h: 6, settlementCycle: "T+2", status: "healthy" },
  { name: "PayU", successRate: 96.8, avgResponseMs: 524, uptime: 99.42, downtime: "8m 12s", txns24h: 384, failed24h: 12, settlementCycle: "T+1", status: "degraded" },
  { name: "Cashfree", successRate: 97.9, avgResponseMs: 468, uptime: 99.86, downtime: "2m 02s", txns24h: 248, failed24h: 5, settlementCycle: "T+1", status: "healthy" },
  { name: "PhonePe", successRate: 99.4, avgResponseMs: 340, uptime: 99.98, downtime: "1m 18s", txns24h: 924, failed24h: 6, settlementCycle: "T+1", status: "healthy" },
];

const FAILOVER = [
  { primary: "Razorpay", secondary: "Stripe", triggeredToday: 2, status: "armed" },
  { primary: "Stripe", secondary: "Razorpay", triggeredToday: 0, status: "armed" },
  { primary: "PayU", secondary: "Cashfree", triggeredToday: 5, status: "armed" },
];

const FAILED_ANALYSIS = [
  { reason: "Insufficient funds", count: 18, gateway: "Razorpay", trend: "stable" },
  { reason: "Card expired", count: 14, gateway: "Stripe", trend: "down" },
  { reason: "Network timeout", count: 12, gateway: "PayU", trend: "up" },
  { reason: "3DS authentication failed", count: 8, gateway: "Razorpay", trend: "down" },
];

export function SuperAdminPaymentGatewayHealth() {
  const healthy = GATEWAYS.filter(g => g.status === "healthy").length;
  const totalTxns = GATEWAYS.reduce((s, g) => s + g.txns24h, 0);
  const totalFailed = GATEWAYS.reduce((s, g) => s + g.failed24h, 0);
  const overallSuccess = ((totalTxns - totalFailed) / totalTxns) * 100;

  const statusBadge = (s: string) => {
    const cls = s === "healthy" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "degraded" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Gateway Health"
        description="Real-time success rates, latency, downtime, failover status, and settlement cycle across all gateways."
        icon={<Icon name="CreditCard" className="h-6 w-6" />}
        actions={[
          { label: "Run Health Check", variant: "outline", onClick: () => toast.success("Health check ping sent to all gateways") },
          { label: "Failover Settings", onClick: () => toast.info("Opening failover configuration") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Overall Success Rate" value={`${overallSuccess.toFixed(2)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Healthy Gateways" value={`${healthy}/${GATEWAYS.length}`} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Txns (24h)" value={totalTxns.toLocaleString("en-IN")} icon={<Icon name="CreditCard" className="h-5 w-5" />} />
        <StatCard label="Failed (24h)" value={totalFailed} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Gateway Comparison" description="Health metrics across all payment providers" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gateway</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Avg Response</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>Downtime (24h)</TableHead>
              <TableHead>Txns</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Settlement</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GATEWAYS.map(g => (
              <TableRow key={g.name}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={g.successRate >= 99 ? "text-emerald-600 dark:text-emerald-400" : g.successRate >= 97 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}>{g.successRate}%</span>
                    <Progress className="h-1.5 w-12" value={g.successRate} />
                  </div>
                </TableCell>
                <TableCell className="text-xs">{g.avgResponseMs}ms</TableCell>
                <TableCell className="text-xs">{g.uptime}%</TableCell>
                <TableCell className="text-xs">{g.downtime}</TableCell>
                <TableCell className="text-xs">{g.txns24h.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{g.failed24h}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{g.settlementCycle}</Badge></TableCell>
                <TableCell>{statusBadge(g.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Failover Status" description="Automatic gateway failover configuration">
          <ul className="space-y-2">
            {FAILOVER.map(f => (
              <li key={f.primary} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{f.primary}</span>
                    <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{f.secondary}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.triggeredToday} failovers today</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">{f.status}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Failed Transaction Analysis" description="Top failure reasons (24h)">
          {FAILED_ANALYSIS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No failed transactions" />
          ) : (
            <ul className="space-y-2">
              {FAILED_ANALYSIS.map(f => (
                <li key={f.reason} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{f.reason}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.gateway} · trend: {f.trend}</p>
                  </div>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{f.count}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Settlement Cycle Tracker" description="Next settlement window per gateway">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GATEWAYS.map(g => (
            <div key={g.name} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{g.name}</p>
                <Badge variant="outline" className="text-[10px]">{g.settlementCycle}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Next: Tomorrow 09:00 IST</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">₹{(g.txns24h * 1840).toLocaleString("en-IN")} expected</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
