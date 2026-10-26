"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common";
import { cn } from "@/lib/utils";
import { partners } from "@/lib/partner-data";

export const CHART_COLORS = ["#10b981", "#14b8a6", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#84cc16"];

export const CURRENT_PARTNER = partners.find((p) => p.id === "ptn_001")!;

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="h-72 pt-2">{children}</CardContent>
    </Card>
  );
}

export function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string; payload?: Record<string, unknown> }[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      {label !== undefined && <p className="mb-1 text-xs font-medium">{label}</p>}
      <ul className="space-y-1">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PartnerDisclaimer() {
  return (
    <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
      <span className="font-semibold text-brand">Demo partner:</span> You are operating as{" "}
      <span className="font-semibold">{CURRENT_PARTNER.name}</span> ({CURRENT_PARTNER.id}) —{" "}
      {CURRENT_PARTNER.model.toLowerCase()} model {CURRENT_PARTNER.tier} partner. All data is illustrative; all
      financial figures are per signed partner agreement.
    </div>
  );
}

export function SettlementDisclaimer() {
  return (
    <p className="text-[11px] text-muted-foreground">
      All settlement amounts, partner shares, and deductions are computed per the signed partner agreement. Disputes
      must be raised within 7 days of settlement approval.
    </p>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

/** Compute a revenue split using the same formula the revenueSplits data uses.
 *  Order: gross → discount → netCollected → gatewayFee (% of netCollected) → tax (% of netCollected) →
 *  netAfterFees → apply partner/jobsonn pct → shares.
 *  Rule resolution: find matching active rule by leadSource + partnerModel with highest priority.
 */
export function computeSplit(opts: {
  gross: number;
  discount: number;
  gatewayFeePct: number;
  taxPct: number;
  partnerPct: number;
  jobsonnPct: number;
  ruleName: string;
}) {
  const netCollected = Math.max(0, opts.gross - opts.discount);
  const gatewayFee = Math.round((netCollected * opts.gatewayFeePct) / 100);
  const tax = Math.round((netCollected * opts.taxPct) / 100);
  const netAfterFees = netCollected - gatewayFee - tax;
  const partnerShare = Math.round((netAfterFees * opts.partnerPct) / 100);
  const jobsonnShare = netAfterFees - partnerShare;
  return {
    gross: opts.gross,
    discount: opts.discount,
    netCollected,
    gatewayFee,
    tax,
    netAfterFees,
    partnerPct: opts.partnerPct,
    jobsonnPct: opts.jobsonnPct,
    partnerShare,
    jobsonnShare,
    ruleName: opts.ruleName,
  };
}
