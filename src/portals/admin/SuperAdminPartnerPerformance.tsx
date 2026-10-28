"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Scorecard {
  id: string; partner: string; type: string; placements: number; revenue: number; satisfaction: number; compliance: number; trend: string; rating: "A+" | "A" | "B" | "C";
}

const SCORECARDS: Scorecard[] = [
  { id: "p_001", partner: "SouthZone Franchise", type: "Franchise", placements: 184, revenue: 84_50_000, satisfaction: 4.6, compliance: 96, trend: "+12%", rating: "A+" },
  { id: "p_002", partner: "EduFirst Colleges", type: "College", placements: 142, revenue: 62_30_000, satisfaction: 4.4, compliance: 92, trend: "+8%", rating: "A" },
  { id: "p_003", partner: "NorthStar Affiliates", type: "Affiliate", placements: 38, revenue: 18_40_000, satisfaction: 4.1, compliance: 88, trend: "+4%", rating: "B" },
  { id: "p_004", partner: "EastBridge MOU", type: "MOU", placements: 64, revenue: 28_90_000, satisfaction: 4.3, compliance: 81, trend: "-2%", rating: "B" },
  { id: "p_005", partner: "MumbaiSkills Hub", type: "Franchise", placements: 98, revenue: 51_20_000, satisfaction: 4.5, compliance: 94, trend: "+9%", rating: "A" },
  { id: "p_006", partner: "DelhiTech Partner", type: "College", placements: 168, revenue: 73_40_000, satisfaction: 4.7, compliance: 97, trend: "+14%", rating: "A+" },
  { id: "p_007", partner: "BangaloreLaunchpad", type: "Affiliate", placements: 28, revenue: 14_60_000, satisfaction: 3.9, compliance: 74, trend: "-6%", rating: "C" },
  { id: "p_008", partner: "ChennaiSkills Coop", type: "MOU", placements: 52, revenue: 22_40_000, satisfaction: 4.2, compliance: 90, trend: "+3%", rating: "B" },
];

export function SuperAdminPartnerPerformance() {
  const ratingColor = (r: string) => r === "A+" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
    : r === "A" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
    : r === "B" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
    : "bg-rose-500/15 text-rose-700 border-rose-500/30";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Performance"
        description="Per-partner scorecards — placements, revenue, satisfaction, compliance, and overall rating."
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
        actions={[{ label: "Export Scorecards", variant: "outline", onClick: () => toast.success("Scorecards exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Placements" value={Math.round(SCORECARDS.reduce((s, p) => s + p.placements, 0) / SCORECARDS.length).toString()} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Revenue" value={formatCurrency(SCORECARDS.reduce((s, p) => s + p.revenue, 0))} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Satisfaction" value={(SCORECARDS.reduce((s, p) => s + p.satisfaction, 0) / SCORECARDS.length).toFixed(2)} icon={<Icon name="Star" className="h-5 w-5" />} />
        <StatCard label="A+ Rated" value={SCORECARDS.filter(p => p.rating === "A+").length} icon={<Icon name="Trophy" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SCORECARDS.map(p => (
          <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Icon name="Building2" className="h-4 w-4 text-brand" />
                  <span className="font-medium">{p.partner}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={ratingColor(p.rating)}>{p.rating}</Badge>
                <Badge variant="outline" className={p.trend.startsWith("+") ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                  {p.trend}
                </Badge>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Placements</p>
                <p className="font-medium">{p.placements}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-medium">{formatCurrency(p.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
                <div className="flex items-center gap-1">
                  <Icon name="Star" className="h-3 w-3 text-amber-500" />
                  <span className="font-medium">{p.satisfaction}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Compliance</p>
                <p className="font-medium">{p.compliance}%</p>
              </div>
            </div>
            <div className="mt-3">
              <Progress className="h-1.5" value={p.compliance} />
            </div>
            <Button variant="ghost" size="sm" className="mt-3 h-7 w-full text-xs" onClick={() => toast.info(`Detailed report for ${p.partner}`)}>
              View Detailed Report
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
