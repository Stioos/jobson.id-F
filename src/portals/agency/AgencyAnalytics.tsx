"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from "recharts";
import { BarChart3, TrendingUp, Download, IndianRupee, Percent, Briefcase } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import {
  recruiterLeaderboard, submissionsTrend, commissionTrend, commissionByClient,
  recruiterRecords, clientAgreements, placements,
} from "@/lib/portal-data";

export function AgencyAnalytics() {
  const [range, setRange] = React.useState("ytd");

  const totalRevenue = recruiterRecords.reduce((a, r) => a + r.revenue, 0);
  const totalSubs = recruiterRecords.reduce((a, r) => a + r.submissions, 0);
  const totalPlacements = recruiterRecords.reduce((a, r) => a + r.placements, 0);
  const placementVelocity = (totalPlacements / 9).toFixed(1); // per month
  const avgCommission = clientAgreements.length > 0
    ? (clientAgreements.reduce((a, c) => a + c.commissionRate, 0) / clientAgreements.length).toFixed(2)
    : "0";
  const topClientProfit = [...commissionByClient].sort((a, b) => b.amount - a.amount)[0];

  // Forecast: simple linear extrapolation
  const forecast = commissionTrend.map((c, i) => ({
    month: c.month,
    actual: c.amount,
    forecast: Math.round(c.amount * (1 + 0.05 * (i + 1))),
  }));

  const leaderboardData = recruiterLeaderboard.map((r) => ({
    name: r.name.split(" ")[0],
    fullName: r.name,
    revenue: r.revenue,
    placements: r.placements,
  }));

  // Placement velocity line data (with interviews as second series)
  const velocityData = submissionsTrend.map((s) => ({
    month: s.month,
    submissions: s.submissions,
    interviews: s.interviews,
    placements: s.placements,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency analytics"
        description="Recruiter leaderboard, client profitability, placement velocity, and revenue forecast."
        actions={[
          { label: "Export report", variant: "outline", onClick: () => toast.success("Export started", { description: "agency-analytics.pdf" }) },
        ]}
      />

      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Range:</span>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last quarter</SelectItem>
            <SelectItem value="ytd">YTD</SelectItem>
            <SelectItem value="all">All-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
        <StatCard label="Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" delta={{ value: "+18%", positive: true }} />
        <StatCard label="Placements" value={totalPlacements} icon={<Briefcase className="h-5 w-5" />} tone="success" delta={{ value: "+12%", positive: true }} />
        <StatCard label="Avg commission" value={`${avgCommission}%`} icon={<Percent className="h-5 w-5" />} tone="warning" hint="Per agreement" />
        <StatCard label="Submissions" value={totalSubs} icon={<BarChart3 className="h-5 w-5" />} tone="default" delta={{ value: "+9%", positive: true }} />
        <StatCard label="Placement velocity" value={`${placementVelocity}/mo`} icon={<TrendingUp className="h-5 w-5" />} tone="brand" hint="Avg placements/month" />
      </div>

      {topClientProfit && (
        <SectionCard title="Top client profitability" description="Highest revenue client this period">
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 p-4">
            <AvatarLogo text={topClientProfit.client} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold">{topClientProfit.client}</p>
              <p className="text-xs text-muted-foreground">
                {clientAgreements.find((c) => c.employerName === topClientProfit.client)?.industry ?? "—"} ·
                {" "}{placements.filter((p) => p.clientName === topClientProfit.client).length} placements
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(topClientProfit.amount)}</p>
              <p className="text-xs text-muted-foreground">YTD revenue</p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Recruiter leaderboard BarChart */}
      <SectionCard title="Recruiter leaderboard" description="Revenue & placements per recruiter (YTD)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaderboardData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                formatter={(v: number, name: string) => name === "Revenue" ? [formatCurrency(v), "Revenue"] : [v, "Placements"]}
                labelFormatter={(_, p) => {
                  const entry = p && p[0] && (p[0].payload as { fullName?: string });
                  return entry?.fullName ?? "";
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="placements" name="Placements" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Client profitability" description="YTD revenue by client">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionByClient} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <YAxis dataKey="client" type="category" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.015 165)" width={110} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Placement velocity" description="Monthly submissions, interviews, placements">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="submissions" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="interviews" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="placements" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Revenue forecast" description="Simulated next-period projection (linear extrapolation)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
              <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.015 165)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="forecast" name="Forecast" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/20">Simulated forecast</Badge>
          <span className="text-xs text-muted-foreground">Linear extrapolation based on historical trend. Replace with a real forecasting model in production.</span>
        </div>
      </SectionCard>

      <SectionCard title="Recruiter breakdown" description="Leaderboard detail with conversion rates">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="w-8 py-2 text-left font-medium">#</th>
                <th className="text-left font-medium">Recruiter</th>
                <th className="text-center font-medium">Subs</th>
                <th className="text-center font-medium">Placed</th>
                <th className="text-center font-medium">Conv.</th>
                <th className="text-right font-medium">Revenue</th>
                <th className="hidden md:table-cell text-center font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {recruiterLeaderboard.map((r, i) => {
                const max = recruiterLeaderboard[0].revenue;
                return (
                  <tr key={r.name} className="border-b last:border-0">
                    <td className={`py-2 font-bold ${i === 0 ? "text-amber-600" : ""}`}>{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="xs" />
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="text-center">{r.submissions}</td>
                    <td className="text-center">{r.placements}</td>
                    <td className="text-center">{r.conversion}%</td>
                    <td className="text-right font-semibold">{formatCurrency(r.revenue)}</td>
                    <td className="hidden md:table-cell">
                      <div className="mx-auto h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${(r.revenue / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
