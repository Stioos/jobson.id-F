"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface FxTxn {
  id: string; from: string; to: string; amount: number; rate: number; fee: number; customer: string; portal: string; fxGain: number; at: string;
}

const FX_TXNS: FxTxn[] = [
  { id: "FX-9001", from: "USD", to: "INR", amount: 1200, rate: 83.42, fee: 240, customer: "TechCorp US", portal: "employer", fxGain: 412, at: "2024-09-22T10:00:00Z" },
  { id: "FX-9000", from: "EUR", to: "INR", amount: 850, rate: 91.18, fee: 170, customer: "Virtusa EU", portal: "training", fxGain: 287, at: "2024-09-22T08:30:00Z" },
  { id: "FX-8999", from: "GBP", to: "INR", amount: 600, rate: 105.84, fee: 120, customer: "BlueWave UK", portal: "recruiter", fxGain: 198, at: "2024-09-21T16:00:00Z" },
  { id: "FX-8998", from: "USD", to: "INR", amount: 2200, rate: 83.40, fee: 440, customer: "NorthStar LLC", portal: "partner", fxGain: 758, at: "2024-09-21T11:00:00Z" },
  { id: "FX-8997", from: "INR", to: "USD", amount: 84000, rate: 0.0120, fee: 168, customer: "Apex Recruit", portal: "recruiter", fxGain: -120, at: "2024-09-20T14:00:00Z" },
];

const EXPOSURE = [
  { currency: "USD", inflow: 1_84_000, outflow: 84_000, net: 1_00_000, pctOfBook: 62 },
  { currency: "EUR", inflow: 64_000, outflow: 12_000, net: 52_000, pctOfBook: 18 },
  { currency: "GBP", inflow: 42_000, outflow: 18_000, net: 24_000, pctOfBook: 12 },
  { currency: "AED", inflow: 18_000, outflow: 4_000, net: 14_000, pctOfBook: 8 },
];

const PROVIDERS = [
  { name: "Razorpay FX", spread: "0.45%", speed: "Same-day", rate: 83.42, recommended: true },
  { name: "Stripe FX", spread: "0.55%", speed: "T+1", rate: 83.36, recommended: false },
  { name: "Payoneer", spread: "0.50%", speed: "T+2", rate: 83.40, recommended: false },
  { name: "Airwallex", spread: "0.40%", speed: "Same-day", rate: 83.48, recommended: false },
];

export function SuperAdminMultiCurrencyOversight() {
  const totalFxGain = FX_TXNS.reduce((s, t) => s + t.fxGain, 0);
  const totalFees = FX_TXNS.reduce((s, t) => s + t.fee, 0);
  const totalVolume = FX_TXNS.reduce((s, t) => s + (t.from === "INR" ? t.amount : t.amount * t.rate), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Currency Oversight"
        description="FX transactions, conversion fees, FX gain/loss, currency exposure, and provider comparison."
        icon={<Icon name="DollarSign" className="h-6 w-6" />}
        actions={[
          { label: "Update FX Rates", variant: "outline", onClick: () => toast.success("FX rates refreshed from RBI reference feed") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="FX Volume (24h)" value={`₹${(totalVolume / 100000).toFixed(1)}L`} icon={<Icon name="DollarSign" className="h-5 w-5" />} tone="brand" />
        <StatCard label="FX Gain" value={`₹${totalFxGain.toLocaleString("en-IN")}`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone={totalFxGain >= 0 ? "success" : "danger"} />
        <StatCard label="Conversion Fees" value={`₹${totalFees.toLocaleString("en-IN")}`} icon={<Icon name="Percent" className="h-5 w-5" />} />
        <StatCard label="Active Currencies" value={EXPOSURE.length} icon={<Icon name="Globe" className="h-5 w-5" />} />
      </div>

      <SectionCard title="FX Transactions" description="All multi-currency transactions across portals" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FX ID</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>FX Gain/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FX_TXNS.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{t.from} → {t.to}</Badge>
                </TableCell>
                <TableCell className="font-medium">{t.from === "INR" ? `₹${t.amount.toLocaleString("en-IN")}` : `${t.amount} ${t.from}`}</TableCell>
                <TableCell className="text-xs">{t.rate}</TableCell>
                <TableCell className="text-xs">₹{t.fee.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-medium text-xs">{t.customer}</TableCell>
                <TableCell><Badge variant="outline">{t.portal}</Badge></TableCell>
                <TableCell className={t.fxGain >= 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-rose-600 dark:text-rose-400 font-medium"}>
                  {t.fxGain >= 0 ? "+" : ""}₹{t.fxGain.toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Currency Exposure" description="Net open position by currency">
          <ul className="space-y-3">
            {EXPOSURE.map(c => (
              <li key={c.currency} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{c.currency}</span>
                    <span className="font-medium">{c.currency}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Net: ₹{c.net.toLocaleString("en-IN")}</span>
                </div>
                <Progress className="mt-2 h-1.5" value={c.pctOfBook} />
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>In: ₹{c.inflow.toLocaleString("en-IN")} · Out: ₹{c.outflow.toLocaleString("en-IN")}</span>
                  <span>{c.pctOfBook}% of book</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="FX Provider Comparison" description="Best rate finder across providers">
          <ul className="space-y-2">
            {PROVIDERS.map(p => (
              <li key={p.name} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.name}</p>
                    {p.recommended && <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">recommended</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Spread: {p.spread} · {p.speed}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">₹{p.rate}</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => toast.info(`Switching to ${p.name}`)}>Switch</Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Hedging Recommendations" description="AI-suggested hedging based on exposure">
        <ul className="space-y-2 text-sm">
          <li className="rounded-md border bg-amber-50/50 dark:bg-amber-900/10 p-3">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <p className="font-medium">USD forward contract suggested</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Net USD exposure ₹1,00,000 — consider 30-day forward at ₹83.50 to lock gain.</p>
              </div>
            </div>
          </li>
          <li className="rounded-md border bg-card p-3">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <p className="font-medium">EUR natural hedge available</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Match €12,000 outflow against €64,000 inflow — no forward needed.</p>
              </div>
            </div>
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
