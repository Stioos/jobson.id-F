"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip, CHART_COLORS } from "./_shared";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  TrendingUp, Percent, Users, Banknote, Download, Target, Gauge, Award,
} from "lucide-react";

export function PartnerAnalytics() {
  const partner = CURRENT_PARTNER;
  const [range, setRange] = React.useState("6m");
  const [program, setProgram] = React.useState("all");

  // KPIs (synthetic, derived from partner)
  const conversionRate = 38.5;
  const avgTicketSize = 38400;
  const enrollmentGrowth = 12.4;
  const revenuePerStudent = Math.round(partner.revenueYTD / Math.max(partner.studentsEnrolled, 1));
  const leadToEnrollment = 24.8;
  const costPerLead = 1240;

  // Enrollment trend (LineChart)
  const enrollmentTrend = [
    { month: "May", enrollments: 84, qualified: 110, leads: 142 },
    { month: "Jun", enrollments: 96, qualified: 130, leads: 168 },
    { month: "Jul", enrollments: 112, qualified: 148, leads: 192 },
    { month: "Aug", enrollments: 128, qualified: 165, leads: 218 },
    { month: "Sep", enrollments: 144, qualified: 188, leads: 240 },
    { month: "Oct", enrollments: 162, qualified: 210, leads: 268 },
  ];

  // Revenue by program (BarChart)
  const revenueByProgram = [
    { program: "Full-Stack", revenue: 1240000, enrollments: 28 },
    { program: "Data Science", revenue: 840000, enrollments: 22 },
    { program: "Cloud DevOps", revenue: 720000, enrollments: 15 },
    { program: "Digital Mktg", revenue: 380000, enrollments: 18 },
    { program: "Cybersecurity", revenue: 420000, enrollments: 10 },
    { program: "UI/UX", revenue: 240000, enrollments: 8 },
  ];

  // Lead funnel
  const leadFunnel = [
    { stage: "Leads", count: 268, fill: "#10b981" },
    { stage: "Contacted", count: 218, fill: "#14b8a6" },
    { stage: "Qualified", count: 165, fill: "#0ea5e9" },
    { stage: "Enrolled", count: 102, fill: "#f59e0b" },
    { stage: "Graduated", count: 78, fill: "#8b5cf6" },
  ];

  // Centre performance comparison
  const centrePerf = [
    { centre: "CTA Main", revenue: 1820000, rating: 4.7, utilization: 90 },
    { centre: "CTA Velachery", revenue: 640000, rating: 4.5, utilization: 80 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Hub"
        description={`Performance analytics for ${partner.name} — leads, revenue, enrollments & centre performance.`}
        icon={<Gauge className="h-6 w-6" />}
        actions={[
          { label: "Export Report", icon: "Download", variant: "outline", onClick: () => toast.success("Report exported", { description: "partner-analytics-oct-2024.csv" }) },
        ]}
      />

      <PartnerDisclaimer />

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Date Range</Label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Program</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="prog_001">Full-Stack Engineering</SelectItem>
                <SelectItem value="prog_002">Data Science & Analytics</SelectItem>
                <SelectItem value="prog_003">Digital Marketing</SelectItem>
                <SelectItem value="prog_004">Cybersecurity</SelectItem>
                <SelectItem value="prog_005">Cloud & DevOps</SelectItem>
                <SelectItem value="prog_006">UI/UX Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Filters applied")}>
            <Target className="h-4 w-4 mr-2" /> Apply
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={<Percent className="h-5 w-5" />} tone="brand" delta={{ value: "3.2% MoM", positive: true }} />
        <StatCard label="Avg Ticket Size" value={formatCurrency(avgTicketSize)} icon={<Banknote className="h-5 w-5" />} tone="success" delta={{ value: "5.1% MoM", positive: true }} />
        <StatCard label="Enrollment Growth" value={`+${enrollmentGrowth}%`} icon={<TrendingUp className="h-5 w-5" />} delta={{ value: "vs last period", positive: true }} />
        <StatCard label="Revenue / Student" value={formatCurrency(revenuePerStudent)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Lead→Enrollment" value={`${leadToEnrollment}%`} icon={<Target className="h-5 w-5" />} tone="warning" />
        <StatCard label="Cost / Lead" value={formatCurrency(costPerLead)} icon={<Award className="h-5 w-5" />} delta={{ value: "8% MoM", positive: false }} />
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="centres">Centres</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <ChartCard title="Enrollment Trend" description="Leads → Qualified → Enrolled (6 months)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="qualified" name="Qualified" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="enrollments" name="Enrolled" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <ChartCard title="Revenue by Program" description="Total revenue collected per program">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByProgram}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="program" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Lead Funnel" description="Conversion across pipeline stages">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadFunnel} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} className="text-xs" width={80} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                    {leadFunnel.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <SectionCard title="Stage Conversion" description="Drop-off rates between stages">
              <ul className="space-y-3">
                {leadFunnel.map((s, i) => {
                  const prev = i === 0 ? s.count : leadFunnel[i - 1].count;
                  const rate = prev > 0 ? Math.round((s.count / prev) * 100) : 0;
                  return (
                    <li key={s.stage} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{s.stage}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{formatNumber(s.count)}</span>
                          <span className={`text-xs font-medium ${rate >= 70 ? "text-emerald-600 dark:text-emerald-400" : rate >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {i === 0 ? "—" : `${rate}%`}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="centres" className="space-y-4">
          <ChartCard title="Centre Performance" description="Revenue & utilization comparison">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centrePerf}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="centre" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <SectionCard title="Centre Comparison Table" description="Detailed KPIs per centre">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-4">Centre</th>
                    <th className="py-2 pr-4">Revenue</th>
                    <th className="py-2 pr-4">Rating</th>
                    <th className="py-2 pr-4">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {centrePerf.map((c) => (
                    <tr key={c.centre} className="border-t">
                      <td className="py-3 pr-4 font-medium">{c.centre}</td>
                      <td className="py-3 pr-4">{formatCurrency(c.revenue)}</td>
                      <td className="py-3 pr-4">{c.rating} ★</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-brand" style={{ width: `${c.utilization}%` }} />
                          </div>
                          <span className="text-xs">{c.utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
