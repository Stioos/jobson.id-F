"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

const KPIS = [
  { label: "MRR", value: "₹42.8 L", delta: "+8.4% MoM", icon: "TrendingUp", tone: "brand" as const },
  { label: "ARR", value: "₹5.14 Cr", delta: "+8.4% YoY", icon: "BarChart3", tone: "success" as const },
  { label: "Churn Rate", value: "2.4%", delta: "-0.3pt MoM", icon: "TrendingDown", tone: "default" as const },
  { label: "ARPU", value: "₹1,840", delta: "+₹120", icon: "Banknote", tone: "brand" as const },
];

const BY_PORTAL = [
  { portal: "Employer", mrr: 24_80_000, share: 58, color: "bg-teal-500" },
  { portal: "Recruiter", mrr: 8_40_000, share: 19.6, color: "bg-amber-500" },
  { portal: "Training", mrr: 5_20_000, share: 12.1, color: "bg-cyan-500" },
  { portal: "Partner", mrr: 3_60_000, share: 8.4, color: "bg-violet-500" },
  { portal: "Candidate", mrr: 80_000, share: 1.9, color: "bg-emerald-500" },
];

const BY_PLAN = [
  { plan: "Enterprise", count: 12, mrr: 24_00_000, color: "bg-emerald-500" },
  { plan: "Business", count: 84, mrr: 11_60_000, color: "bg-teal-500" },
  { plan: "Professional", count: 318, mrr: 5_40_000, color: "bg-amber-500" },
  { plan: "Starter", count: 1240, mrr: 1_60_000, color: "bg-cyan-500" },
  { plan: "Free", count: 18400, mrr: 0, color: "bg-muted" },
];

const PARTNER_SPLITS = [
  { model: "Franchise", gross: 84_50_000, partnerShare: 67_60_000, platformShare: 16_90_000 },
  { model: "College MOU", gross: 62_30_000, partnerShare: 49_84_000, platformShare: 12_46_000 },
  { model: "Affiliate", gross: 18_40_000, partnerShare: 5_52_000, platformShare: 12_88_000 },
  { model: "Corporate Referral", gross: 12_80_000, partnerShare: 2_56_000, platformShare: 10_24_000 },
];

export function SuperAdminRevenueAnalytics() {
  const totalMrr = BY_PORTAL.reduce((s, p) => s + p.mrr, 0);
  const totalGross = PARTNER_SPLITS.reduce((s, p) => s + p.gross, 0);
  const totalPlatformShare = PARTNER_SPLITS.reduce((s, p) => s + p.platformShare, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        description="MRR/ARR, churn, revenue by portal & plan, and partner-split economics."
        icon={<Icon name="DollarSign" className="h-6 w-6" />}
        actions={[{ label: "Export CFO Pack", variant: "outline", onClick: () => toast.success("CFO pack exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        {KPIS.map(k => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={{ value: k.delta, positive: k.delta.includes("+") || k.label === "Churn Rate" && k.delta.includes("-") }} icon={<Icon name={k.icon} className="h-5 w-5" />} tone={k.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="MRR by Portal" description="Monthly recurring revenue share">
          <div className="space-y-3">
            {BY_PORTAL.map(p => (
              <div key={p.portal}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                    <span className="font-medium">{p.portal}</span>
                  </div>
                  <span className="text-muted-foreground">{formatCurrency(p.mrr)} <span className="text-xs">({p.share}%)</span></span>
                </div>
                <Progress className="mt-1 h-1.5" value={p.share} />
              </div>
            ))}
            <div className="border-t pt-2 text-sm font-medium">Total MRR: {formatCurrency(totalMrr)}</div>
          </div>
        </SectionCard>

        <SectionCard title="Revenue by Plan" description="Subscriber count and MRR contribution">
          <div className="space-y-2">
            {BY_PLAN.map(p => (
              <div key={p.plan} className="flex items-center gap-3 rounded-md border bg-card p-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.plan}</span>
                    <span className="text-xs text-muted-foreground">{p.count} subs</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(p.mrr)}/mo</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Partner Revenue Splits" description="Gross revenue and split by partnership model">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Gross Revenue</th>
                <th className="py-2 pr-4">Partner Share</th>
                <th className="py-2 pr-4">Platform Share</th>
                <th className="py-2 pr-4">Platform %</th>
              </tr>
            </thead>
            <tbody>
              {PARTNER_SPLITS.map(s => (
                <tr key={s.model} className="border-b last:border-0">
                  <td className="py-3 pr-4"><Badge variant="outline">{s.model}</Badge></td>
                  <td className="py-3 pr-4 font-medium">{formatCurrency(s.gross)}</td>
                  <td className="py-3 pr-4 text-emerald-700 dark:text-emerald-400">{formatCurrency(s.partnerShare)}</td>
                  <td className="py-3 pr-4 text-brand">{formatCurrency(s.platformShare)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-20" value={(s.platformShare / s.gross) * 100} />
                      <span className="text-xs">{((s.platformShare / s.gross) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-medium">
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 pr-4">{formatCurrency(totalGross)}</td>
                <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-400">{formatCurrency(totalGross - totalPlatformShare)}</td>
                <td className="py-2 pr-4 text-brand">{formatCurrency(totalPlatformShare)}</td>
                <td className="py-2 pr-4">{((totalPlatformShare / totalGross) * 100).toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
