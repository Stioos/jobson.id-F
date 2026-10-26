"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { Users, Building2, Briefcase, Handshake, IndianRupee, Percent, ArrowRight } from "lucide-react";
import { useNav } from "@/lib/store";
import { PageHeader, StatCard, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, timeAgo } from "@/lib/format";
import {
  recruiterRecords, clientAgreements, requisitions, placements,
  submissionsTrend, commissionByClient, recruiterLeaderboard,
} from "@/lib/portal-data";
import { agencies } from "@/lib/mock-data";

const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#a855f7"];

export function AgencyOverview() {
  const { navigate } = useNav();
  const agency = agencies[0];

  const totalRevenue = placements.reduce((a, p) => a + p.commissionAmount, 0);
  const avgRate =
    clientAgreements.length > 0
      ? (clientAgreements.reduce((a, c) => a + c.commissionRate, 0) / clientAgreements.length).toFixed(2)
      : "0";
  const activeClients = clientAgreements.filter((c) => c.status === "active").length;
  const openReqs = requisitions.filter((r) => r.status === "open").length;

  const revenueByClientPie = commissionByClient
    .filter((c) => c.amount > 0)
    .map((c, i) => ({
      name: c.client,
      value: c.amount,
      color: COLORS[i % COLORS.length],
    }));

  // Leaderboard chart data: revenue per recruiter (with placements bar alongside)
  const leaderboardData = recruiterLeaderboard.map((r) => ({
    name: r.name.split(" ")[0],
    fullName: r.name,
    revenue: r.revenue,
    placements: r.placements,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency overview"
        description={`${agency.name} — ${agency.description}`}
        actions={[
          { label: "Invite recruiter", onClick: () => navigate("recruiter", "ag-recruiters") },
          { label: "Add client", variant: "outline", onClick: () => navigate("recruiter", "ag-clients") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Recruiters" value={recruiterRecords.length} icon={<Users className="h-5 w-5" />} tone="brand" hint={`${recruiterRecords.filter((r) => r.status === "active").length} active`} />
        <StatCard label="Active clients" value={activeClients} icon={<Building2 className="h-5 w-5" />} tone="default" />
        <StatCard label="Open reqs" value={openReqs} icon={<Briefcase className="h-5 w-5" />} tone="default" />
        <StatCard label="Placements (YTD)" value={placements.length} icon={<Handshake className="h-5 w-5" />} tone="success" delta={{ value: "+12%", positive: true }} />
        <StatCard label="Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg commission" value={`${avgRate}%`} icon={<Percent className="h-5 w-5" />} tone="warning" hint="Per agreement" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Placements trend" description="Monthly submissions, interviews and placements" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionsTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 155)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.015 165)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="submissions" stroke="#0ea5e9" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="interviews" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="placements" stroke="#10b981" strokeWidth={2.5} fill="url(#gPl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Revenue by client" description="YTD commission per client">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByClientPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {revenueByClientPie.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.008 155)", fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {revenueByClientPie.map((c) => (
              <li key={c.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium">{formatCurrency(c.value)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Recruiter leaderboard"
          description="Revenue & placements per recruiter (YTD)"
          className="lg:col-span-2"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("recruiter", "ag-analytics")}>View analytics <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}
        >
          <div className="h-72">
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
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Recruiter</TableHead>
                  <TableHead className="text-center">Subs</TableHead>
                  <TableHead className="text-center">Placed</TableHead>
                  <TableHead className="text-center">Conv.</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruiterLeaderboard.map((r, i) => (
                  <TableRow key={r.name}>
                    <TableCell className={`font-bold ${i === 0 ? "text-amber-600" : ""}`}>{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="xs" />
                        <span className="text-sm font-medium">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">{r.submissions}</TableCell>
                    <TableCell className="text-center text-sm">{r.placements}</TableCell>
                    <TableCell className="text-center text-sm">{r.conversion}%</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(r.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Team performance snapshot" description="Quick view of recruiter activity">
          <ul className="space-y-2">
            {recruiterRecords.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                <AvatarLogo text={r.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.activeReqs} reqs · {r.submissions} subs · {r.placements} placed</p>
                </div>
                <StatusBadge status={r.status === "active" ? "active" : r.status === "on_leave" ? "paused" : "closed"} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent placements"
        description="Latest successful placements across the agency"
        action={<Button variant="ghost" size="sm" onClick={() => navigate("recruiter", "ag-placements")}>All placements <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}
      >
        <div className="max-h-80 overflow-y-auto scroll-thin">
          <ul className="divide-y">
            {placements.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <AvatarLogo text={p.candidateName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.candidateName} → {p.clientName}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.jobTitle} · {p.recruiterName} · {timeAgo(p.placedAt)}</p>
                </div>
                <Badge variant="outline" className="font-semibold">{formatCurrency(p.commissionAmount)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}
