"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/lib/format";

const KPIS = [
  { label: "GMV (30d)", value: "₹4.8 Cr", delta: "+18.2%", icon: "TrendingUp", tone: "brand" as const },
  { label: "MAU", value: "284K", delta: "+6.4%", icon: "Users", tone: "success" as const },
  { label: "Active Jobs", value: "18,492", delta: "+12 today", icon: "Briefcase", tone: "default" as const },
  { label: "Courses Enrolled", value: "9,418", delta: "+22.1%", icon: "GraduationCap", tone: "brand" as const },
];

const MONTHLY = [
  { m: "Apr", gmv: 320, mau: 220 },
  { m: "May", gmv: 350, mau: 235 },
  { m: "Jun", gmv: 410, mau: 252 },
  { m: "Jul", gmv: 440, mau: 264 },
  { m: "Aug", gmv: 480, mau: 278 },
  { m: "Sep", gmv: 520, mau: 284 },
];

const BY_PORTAL = [
  { portal: "Candidate", users: 942_000, jobs: 0, revenue: 0, color: "bg-emerald-500" },
  { portal: "Employer", users: 12_400, jobs: 18_492, revenue: 1_80_00_000, color: "bg-teal-500" },
  { portal: "Recruiter", users: 4_180, jobs: 4_280, revenue: 64_00_000, color: "bg-amber-500" },
  { portal: "Training", users: 318_500, jobs: 0, revenue: 28_00_000, color: "bg-cyan-500" },
  { portal: "Partner", users: 4_890, jobs: 0, revenue: 42_00_000, color: "bg-violet-500" },
];

export function SuperAdminAnalytics() {
  const maxGmv = Math.max(...MONTHLY.map(m => m.gmv));
  const totalRevenue = BY_PORTAL.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Holistic view of GMV, MAU, jobs, and course enrollments across all portals."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Export Dashboard", variant: "outline", onClick: () => toast.success("Dashboard export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        {KPIS.map(k => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={{ value: k.delta, positive: true }} icon={<Icon name={k.icon} className="h-5 w-5" />} tone={k.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="GMV Trend (6 months)" description="Gross merchandise value in ₹L">
          <div className="flex h-48 items-end gap-3">
            {MONTHLY.map(m => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t bg-brand/70" style={{ height: `${(m.gmv / maxGmv) * 100}%` }} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">₹{m.gmv}L</div>
                  <div className="text-[10px] text-muted-foreground">{m.m}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="MAU Trend (6 months)" description="Monthly active users in thousands">
          <div className="flex h-48 items-end gap-3">
            {MONTHLY.map(m => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t bg-emerald-500/70" style={{ height: `${(m.mau / 284) * 100}%` }} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{m.mau}K</div>
                  <div className="text-[10px] text-muted-foreground">{m.m}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Portal Breakdown" description="Users, jobs, and revenue per portal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Portal</th>
                <th className="py-2 pr-4">Users</th>
                <th className="py-2 pr-4">Jobs Posted</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Share</th>
              </tr>
            </thead>
            <tbody>
              {BY_PORTAL.map(p => (
                <tr key={p.portal} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                      <span className="font-medium">{p.portal}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{formatNumber(p.users)}</td>
                  <td className="py-3 pr-4">{p.jobs.toLocaleString("en-IN")}</td>
                  <td className="py-3 pr-4 font-medium">{p.revenue ? formatCurrency(p.revenue) : "—"}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-24" value={(p.revenue / totalRevenue) * 100} />
                      <span className="text-xs">{((p.revenue / totalRevenue) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
