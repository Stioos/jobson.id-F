"use client";

import * as React from "react";
import { trainingCourses, trainers, learnerEnrollments, corporateClients } from "@/lib/lms-data";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import { Download, TrendingUp, Users, Clock, DollarSign, Target, Award } from "lucide-react";

export function TrainingAnalytics() {
  const [clientFilter, setClientFilter] = React.useState("all");
  const [range, setRange] = React.useState("30d");

  // Scope learner enrollments by client
  const scopedEnrollments = clientFilter === "all"
    ? learnerEnrollments
    : learnerEnrollments.filter((e) => e.clientId === clientFilter);

  const totalLearners = scopedEnrollments.length;
  const completed = scopedEnrollments.filter((e) => e.status === "completed" || e.status === "certified").length;
  const completionRate = totalLearners > 0 ? Math.round((completed / totalLearners) * 100) : 0;
  const avgScore = scopedEnrollments.length > 0 ? Math.round(scopedEnrollments.reduce((s, e) => s + (e.score ?? 0), 0) / scopedEnrollments.length) : 0;

  // ROI calculation (synthetic)
  const totalCost = 4800000; // annual training cost
  const totalBenefit = 8200000; // productivity gain, retention saved, etc.
  const roi = Math.round(((totalBenefit - totalCost) / totalCost) * 100);
  const costPerLearner = totalLearners > 0 ? Math.round(totalCost / totalLearners) : 0;
  const engagementRate = 78; // synthetic

  // Course performance (top 6)
  const coursePerf = trainingCourses.slice(0, 6).map((c) => ({
    name: c.name.split(" ").slice(0, 3).join(" "),
    enrollment: c.enrollments,
    completion: c.completionRate,
    rating: c.rating,
  }));

  // Trainer performance
  const trainerPerf = trainers.map((t) => ({
    name: t.name.split(" ").slice(0, 2).join(" "),
    sessions: t.sessionsConducted,
    learners: t.learnersTrained,
    rating: t.rating,
  }));

  // Engagement trend (synthetic)
  const engagementTrend = [
    { week: "W1", active: 320, hours: 180 },
    { week: "W2", active: 380, hours: 220 },
    { week: "W3", active: 420, hours: 260 },
    { week: "W4", active: 480, hours: 290 },
    { week: "W5", active: 540, hours: 320 },
    { week: "W6", active: 610, hours: 380 },
  ];

  // Dropoff funnel
  const funnel = [
    { stage: "Enrolled", learners: 1000 },
    { stage: "Started", learners: 880 },
    { stage: "50% Done", learners: 620 },
    { stage: "Assessment", learners: 480 },
    { stage: "Completed", learners: 380 },
    { stage: "Certified", learners: 320 },
  ];

  // Completion by client
  const completionByClient = corporateClients.map((c) => {
    const ce = learnerEnrollments.filter((e) => e.clientId === c.id);
    const cc = ce.filter((e) => e.status === "completed" || e.status === "certified").length;
    return {
      name: c.name.split(" ")[0],
      rate: ce.length > 0 ? Math.round((cc / ce.length) * 100) : 0,
    };
  });

  function exportReport() {
    toast.success("Analytics report exported", { description: `Range: ${range} · Client: ${clientFilter === "all" ? "All" : corporateClients.find((c) => c.id === clientFilter)?.name}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics & ROI"
        description="Measure training impact, ROI, and engagement across clients."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Export report", icon: "Download", variant: "outline", onClick: exportReport }]}
      />
      <TenantDisclaimer />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Range:</span>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last quarter</SelectItem>
            <SelectItem value="1y">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm font-medium ml-2">Client:</span>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Learners" value={formatNumber(totalLearners)} icon={<Users className="h-5 w-5" />} tone="brand" hint="Enrolled in range" />
        <StatCard label="Completion Rate" value={`${completionRate}%`} icon={<Target className="h-5 w-5" />} tone="success" hint={`${completed} completed`} />
        <StatCard label="Avg Score" value={`${avgScore}%`} icon={<Award className="h-5 w-5" />} tone="warning" hint="Across all attempts" />
        <StatCard label="Training ROI" value={`${roi}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint={formatCurrency(totalBenefit - totalCost) + " net benefit"} />
        <StatCard label="Cost / Learner" value={formatCurrency(costPerLearner)} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Engagement Rate" value={`${engagementRate}%`} icon={<Clock className="h-5 w-5" />} tone="brand" hint="Active in last 7 days" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Course Performance" description="Enrollment vs completion by course">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coursePerf}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" angle={-15} height={50} textAnchor="end" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="enrollment" name="Enrolled" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completion" name="Completion %" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trainer Performance" description="Sessions and learners trained">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainerPerf}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" angle={-15} height={50} textAnchor="end" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sessions" name="Sessions" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="learners" name="Learners" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Engagement Trend" description="Active learners & hours learned per week">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementTrend}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="active" name="Active learners" stroke="#10b981" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Dropoff Funnel" description="Learners progressing through pipeline">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} className="text-xs" width={80} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="learners" name="Learners" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Completion by Client" description="Completion rate %" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionByClient}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="rate" name="Completion %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Training ROI Breakdown" description="Cost-benefit analysis">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Total Training Cost</span>
              <span className="font-medium">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Productivity Gain</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(5200000)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Retention Saved</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(1800000)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Hiring Cost Avoided</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(1200000)}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-medium">Net Benefit</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalBenefit - totalCost)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium text-lg">ROI</span>
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{roi}%</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Formula: (Net Benefit ÷ Cost) × 100</p>
        </SectionCard>
      </div>
    </div>
  );
}
