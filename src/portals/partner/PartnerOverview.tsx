"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  partners, leads, partnerApplications, walletTransactions,
  settlements, batches, trainingCentres,
} from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip, CHART_COLORS } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency, formatNumber, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Wallet, Users, CalendarCheck2, Banknote, Star, AlertTriangle,
  ArrowUpRight, Plus, Sparkles, Handshake, FileText, Calculator, Megaphone, Building2,
} from "lucide-react";

export function PartnerOverview() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;

  const partnerLeads = leads.filter((l) => l.partnerId === partner.id);
  const partnerApps = partnerApplications;
  const pendingApps = partnerApps.filter((a) => a.status === "submitted" || a.status === "under_review");
  const partnerBatches = batches.filter((b) =>
    trainingCentres.some((c) => c.id === b.centreId && c.partnerId === partner.id)
  );
  const activeBatches = partnerBatches.filter((b) => b.status === "active" || b.status === "upcoming");
  const pendingSettlements = settlements.filter((s) => s.partnerId === partner.id && s.status !== "paid");
  const recentWalletTx = walletTransactions
    .filter((w) => w.partnerId === partner.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  const recentLeads = [...partnerLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // 6-month revenue trend (synthetic, based on partner.revenueYTD)
  const monthlyAvg = partner.revenueYTD / 6;
  const revenueTrend = [
    { month: "May", revenue: Math.round(monthlyAvg * 0.7), settlement: Math.round(monthlyAvg * 0.5) },
    { month: "Jun", revenue: Math.round(monthlyAvg * 0.85), settlement: Math.round(monthlyAvg * 0.6) },
    { month: "Jul", revenue: Math.round(monthlyAvg * 0.9), settlement: Math.round(monthlyAvg * 0.65) },
    { month: "Aug", revenue: Math.round(monthlyAvg * 1.0), settlement: Math.round(monthlyAvg * 0.75) },
    { month: "Sep", revenue: Math.round(monthlyAvg * 1.1), settlement: Math.round(monthlyAvg * 0.8) },
    { month: "Oct", revenue: Math.round(monthlyAvg * 1.2), settlement: Math.round(monthlyAvg * 0.9) },
  ];

  const leadSourceData = (() => {
    const map: Record<string, number> = {};
    partnerLeads.forEach((l) => {
      const k = l.leadSource.replace(/_/g, " ");
      map[k] = (map[k] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const settlementHistory = revenueTrend.map((m) => ({
    month: m.month,
    payout: m.settlement,
  }));

  const quickActions = [
    { label: "Add Lead", icon: Users, route: "leads" as const, toast: () => toast.success("Opening lead capture form") },
    { label: "New Batch", icon: CalendarCheck2, route: "batches" as const },
    { label: "Calculator", icon: Calculator, route: "calculator" as const },
    { label: "Withdraw", icon: Wallet, route: "wallet" as const },
    { label: "Campaign", icon: Megaphone, route: "marketing" as const },
    { label: "Support", icon: FileText, route: "support" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome, Rajesh 👋"
        description={`${partner.name} — franchise operations dashboard. Territory: ${partner.territory ?? partner.city}.`}
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[
          { label: "Analytics", icon: "BarChart3", variant: "outline", onClick: () => navigate("partner", "analytics") },
          { label: "Add Lead", icon: "Plus", onClick: () => navigate("partner", "leads") },
        ]}
      />

      <PartnerDisclaimer />

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue YTD" value={formatCurrency(partner.revenueYTD)} icon={<Banknote className="h-5 w-5" />} tone="brand" delta={{ value: "18% YoY", positive: true }} />
        <StatCard label="Wallet Balance" value={formatCurrency(partner.walletBalance)} icon={<Wallet className="h-5 w-5" />} tone="success" hint="Available now" />
        <StatCard label="Students Enrolled" value={formatNumber(partner.studentsEnrolled)} icon={<Users className="h-5 w-5" />} delta={{ value: "12% YoY", positive: true }} />
        <StatCard label="Active Batches" value={activeBatches.length} icon={<CalendarCheck2 className="h-5 w-5" />} hint={`${partnerBatches.length} total`} />
        <StatCard label="Pending Settlements" value={formatCurrency(partner.pendingSettlement)} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" hint={`${pendingSettlements.length} cycles`} />
        <StatCard label="Partner Rating" value={partner.rating.toFixed(1)} icon={<Star className="h-5 w-5" />} tone="warning" hint="Based on 124 reviews" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue & Settlement Trend" description="Last 6 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="setGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="settlement" name="Settlement" stroke="#14b8a6" strokeWidth={2} fill="url(#setGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Source Breakdown" description={`${partnerLeads.length} leads this period`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leadSourceData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                {leadSourceData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Settlement History" description="Monthly payouts (last 6 months)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={settlementHistory}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
            <Bar dataKey="payout" name="Settlement" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Active batches + Recent leads */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Active Batches"
          description="In-progress training cohorts"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("partner", "batches")}>View all</Button>}
        >
          {activeBatches.length === 0 ? (
            <EmptyState icon={<CalendarCheck2 className="h-5 w-5" />} title="No active batches" />
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto scroll-thin">
              {activeBatches.map((b) => (
                <li key={b.id} className="rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.programName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{b.code}</span> · {b.centreName} · {b.trainer}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={b.status} />
                      <p className="mt-1 text-xs text-muted-foreground">{b.enrolled}/{b.capacity} · {b.modality}</p>
                    </div>
                  </div>
                  <Progress value={b.progress} className="mt-2 h-1.5" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Recent Leads"
          description="Latest partner leads"
          action={<Button size="sm" variant="ghost" onClick={() => navigate("partner", "leads")}>View all</Button>}
        >
          {recentLeads.length === 0 ? (
            <EmptyState icon={<Users className="h-5 w-5" />} title="No leads yet" />
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto scroll-thin">
              {recentLeads.map((l) => (
                <li key={l.id} className="flex items-start gap-3 rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                  <AvatarLogo text={l.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {l.programInterest} · {l.city} · {timeAgo(l.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={l.status} />
                    <p className="mt-1 text-xs font-medium text-brand">{formatCurrency(l.estimatedValue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Pending applications alert + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-amber-500/30">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Pending Partner Applications
              </CardTitle>
              <CardDescription className="mt-1">
                {pendingApps.length} application{pendingApps.length === 1 ? "" : "s"} awaiting review
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate("partner", "applications")}>Review</Button>
          </CardHeader>
          <CardContent>
            {pendingApps.length === 0 ? (
              <EmptyState icon={<Handshake className="h-5 w-5" />} title="No pending applications" />
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
                {pendingApps.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <AvatarLogo text={a.organizationName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.organizationName}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.applicantName} · {a.city} · step {a.currentStep}/{a.totalSteps}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={a.priority} />
                      <StatusBadge status={a.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <SectionCard title="Quick Actions" description="Jump to common workflows">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => navigate("partner", qa.route)}
                className="flex flex-col gap-2 rounded-lg border p-3 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <qa.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium leading-tight">{qa.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent wallet transactions */}
      <SectionCard
        title="Recent Wallet Activity"
        description="Latest credits, debits, and fees"
        action={<Button size="sm" variant="ghost" onClick={() => navigate("partner", "wallet")}>View wallet</Button>}
      >
        {recentWalletTx.length === 0 ? (
          <EmptyState icon={<Wallet className="h-5 w-5" />} title="No transactions" />
        ) : (
          <ul className="space-y-2">
            {recentWalletTx.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.amount > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                    {t.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(t.timestamp)} · {t.type}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${t.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {t.amount > 0 ? "+" : "−"}{formatCurrency(Math.abs(t.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground">Bal: {formatCurrency(t.balance)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
