"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";

const DAU = [
  { d: "Mon", dau: 42_400, wau: 184_000, mau: 284_000 },
  { d: "Tue", dau: 44_200, wau: 186_400, mau: 285_200 },
  { d: "Wed", dau: 48_900, wau: 188_900, mau: 286_400 },
  { d: "Thu", dau: 51_200, wau: 191_200, mau: 287_500 },
  { d: "Fri", dau: 54_800, wau: 194_800, mau: 288_800 },
  { d: "Sat", dau: 38_600, wau: 198_600, mau: 289_400 },
  { d: "Sun", dau: 35_400, wau: 201_400, mau: 290_200 },
];

const RETENTION = [
  { week: "W0", value: 100 },
  { week: "W1", value: 72 },
  { week: "W2", value: 58 },
  { week: "W3", value: 49 },
  { week: "W4", value: 42 },
  { week: "W5", value: 38 },
  { week: "W6", value: 35 },
  { week: "W7", value: 32 },
  { week: "W8", value: 30 },
];

const PORTAL_SWITCH = [
  { user: "Priya Nair", from: "candidate", to: "training", count: 4, lastSwitch: "2024-09-18" },
  { user: "Rohan Mehta", from: "employer", to: "recruiter", count: 2, lastSwitch: "2024-09-15" },
  { user: "Sneha Reddy", from: "recruiter", to: "partner", count: 6, lastSwitch: "2024-09-20" },
  { user: "Anika Verma", from: "employer", to: "training", count: 3, lastSwitch: "2024-09-17" },
  { user: "Meera Joshi", from: "partner", to: "candidate", count: 1, lastSwitch: "2024-09-10" },
];

export function SuperAdminGrowth() {
  const maxDau = Math.max(...DAU.map(d => d.dau));
  const maxRet = 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Growth"
        description="DAU/WAU/MAU trends, retention curves, and cross-portal switching frequency."
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Growth report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="DAU (avg)" value={formatNumber(Math.round(DAU.reduce((s, d) => s + d.dau, 0) / DAU.length))} delta={{ value: "+5.2% WoW", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="WAU" value={formatNumber(DAU[DAU.length - 1].wau)} delta={{ value: "+3.1%", positive: true }} icon={<Icon name="Calendar" className="h-5 w-5" />} />
        <StatCard label="MAU" value={formatNumber(DAU[DAU.length - 1].mau)} delta={{ value: "+2.1%", positive: true }} icon={<Icon name="CalendarCheck2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Stickiness (DAU/MAU)" value="18.4%" delta={{ value: "+0.6pt", positive: true }} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="DAU / WAU / MAU (Weekly)" description="7-day rolling">
          <div className="flex h-44 items-end gap-2">
            {DAU.map(d => (
              <div key={d.d} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 flex-col justify-end gap-0.5">
                  <div className="w-full rounded-t bg-brand/70" style={{ height: `${(d.dau / maxDau) * 60}%` }} title={`DAU: ${d.dau}`} />
                  <div className="w-full bg-teal-500/50" style={{ height: `${(d.wau / 220_000) * 25}%` }} title={`WAU: ${d.wau}`} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.d}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-brand/70" /> DAU</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-teal-500/50" /> WAU</span>
          </div>
        </SectionCard>

        <SectionCard title="Cohort Retention Curve" description="% of users retained by week">
          <div className="flex h-44 items-end gap-1.5">
            {RETENTION.map(r => (
              <div key={r.week} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className={`w-full rounded-t ${r.value >= 60 ? "bg-emerald-500" : r.value >= 35 ? "bg-amber-500" : "bg-rose-500"}`} style={{ height: `${(r.value / maxRet) * 100}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{r.week}</span>
                <span className="text-[10px] font-medium">{r.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Portal Switch Frequency" description="Users who switch between portals frequently" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Switches (30d)</TableHead>
              <TableHead>Last Switch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PORTAL_SWITCH.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{p.user}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline">{p.from}</Badge>
                    <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline">{p.to}</Badge>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">{p.count}</Badge></TableCell>
                <TableCell className="text-xs">{p.lastSwitch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
