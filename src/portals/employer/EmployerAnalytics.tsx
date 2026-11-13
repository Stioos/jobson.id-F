"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Download, Info } from "lucide-react";

const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
];

const appsTrend = [
  { day: "W1", apps: 32, qualified: 18 },
  { day: "W2", apps: 48, qualified: 26 },
  { day: "W3", apps: 41, qualified: 22 },
  { day: "W4", apps: 62, qualified: 34 },
  { day: "W5", apps: 55, qualified: 31 },
  { day: "W6", apps: 71, qualified: 42 },
];

const funnelData = [
  { stage: "Applied", value: 389 },
  { stage: "Screened", value: 184 },
  { stage: "Assessment", value: 92 },
  { stage: "Interview", value: 48 },
  { stage: "Offer", value: 18 },
  { stage: "Hired", value: 14 },
];

const sourceData = [
  { name: "jobson.id Search", value: 142, color: "#10b981" },
  { name: "Referrals", value: 68, color: "#14b8a6" },
  { name: "LinkedIn", value: 54, color: "#0ea5e9" },
  { name: "Career page", value: 41, color: "#f59e0b" },
  { name: "Other", value: 22, color: "#94a3b8" },
];

const tthTrend = [
  { month: "Apr", days: 42 },
  { month: "May", days: 38 },
  { month: "Jun", days: 40 },
  { month: "Jul", days: 36 },
  { month: "Aug", days: 33 },
  { month: "Sep", days: 34 },
  { month: "Oct", days: 31 },
];

const kpis = [
  { label: "Job views", value: "12.4K", delta: "+18%", positive: true, formula: "Sum of all job listing page views", icon: "Eye" },
  { label: "Application conversion", value: "8.2%", delta: "+1.4pp", positive: true, formula: "Applications ÷ Job views", icon: "TrendingUp" },
  { label: "Qualified applicants", value: "184", delta: "+12%", positive: true, formula: "Apps that passed screening ÷ Total apps", icon: "CheckCircle2" },
  { label: "Time-to-shortlist", value: "4.2 days", delta: "-0.8d", positive: true, formula: "Avg days from application to shortlist", icon: "Clock" },
  { label: "Time-to-hire", value: "34 days", delta: "-3d", positive: true, formula: "Avg days from job posting to accepted offer", icon: "Calendar" },
  { label: "Interview-to-offer", value: "37.5%", delta: "+4pp", positive: true, formula: "Offers ÷ Interviews conducted", icon: "Gift" },
  { label: "Offer acceptance", value: "87%", delta: "+2pp", positive: true, formula: "Accepted offers ÷ Total offers sent", icon: "CheckCircle2" },
  { label: "Avg cost-per-hire", value: "₹1.2L", delta: "-₹8K", positive: true, formula: "Total hiring spend ÷ Number of hires", icon: "Wallet" },
];

export function EmployerAnalytics() {
  const [range, setRange] = React.useState("30d");

  const exportReport = () => {
    toast.success("Report exported", { description: `Analytics report for ${RANGE_OPTIONS.find((r) => r.value === range)?.label} downloaded.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Measure hiring performance with real-time metrics"
        actions={[
          { label: "Export report", icon: "Download", variant: "outline", onClick: exportReport },
        ]}
      />

      <div className="flex items-center justify-between">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline">{range.toUpperCase()}</Badge>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button><Info className="h-3 w-3 text-muted-foreground" /></button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-xs">{k.formula}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-2 text-2xl font-semibold">{k.value}</p>
              <p className={`mt-1 text-xs font-medium ${k.positive ? "text-emerald-600" : "text-rose-600"}`}>{k.positive ? "▲" : "▼"} {k.delta}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{k.formula}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Applications trend" description="Total vs qualified applications" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appsTrend}>
                <defs>
                  <linearGradient id="apps2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="qual2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend />
                <Area type="monotone" dataKey="apps" stroke="#10b981" strokeWidth={2} fill="url(#apps2)" name="Total apps" />
                <Area type="monotone" dataKey="qualified" stroke="#14b8a6" strokeWidth={2} fill="url(#qual2)" name="Qualified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Source breakdown" description="Where applicants come from">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                  {sourceData.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Funnel conversion" description="Drop-off at each stage">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} className="text-xs" width={80} />
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Time-to-hire trend" description="Avg days from posting to accepted offer">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tthTrend}>
                <defs>
                  <linearGradient id="tth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="days" stroke="#f59e0b" strokeWidth={2} fill="url(#tth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
