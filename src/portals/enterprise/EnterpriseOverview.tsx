"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import { jobs, employerJobsExtra, allApplications, auditLogs } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatNumber, formatDateTime, timeAgo } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Building2, Briefcase, Users, Banknote, Clock, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";
import {
  ENTERPRISE_ENTITIES, TENANT_NAME,
  CHART_COLORS as COLORS,
  ChartCard, ChartTooltip, TenantDisclaimer, entityById, formatCompactCurrency,
  REQUISITION_APPROVALS,
} from "./_shared";

export function EnterpriseOverview() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [entityFilter, setEntityFilter] = React.useState("all");

  const entities = ENTERPRISE_ENTITIES;
  const filtered = entityFilter === "all" ? entities : entities.filter((e) => e.id === entityFilter);

  const totalEntities = entities.length;
  const totalOpenReqs = filtered.reduce((s, e) => s + e.openReqs, 0);
  const totalHeadcount = filtered.reduce((s, e) => s + e.headcount, 0);
  const allJobs = [...jobs, ...employerJobsExtra];
  const tenantJobIds = new Set(filtered.flatMap((e) => allJobs.filter((j) => j.employerId === e.id || (e.id === "e_001" && j.employerId === "e_001")).map((j) => j.id)));
  const tenantApps = allApplications.filter((a) => tenantJobIds.has(a.jobId));
  const budgetAllocated = filtered.reduce((s, e) => s + (e.id === "e_001" ? 21800000 : e.id === "e_apac" ? 2700000 : e.id === "e_eu" ? 1200000 : e.id === "e_004" ? 1500000 : 800000), 0);
  const budgetSpent = filtered.reduce((s, e) => s + (e.id === "e_001" ? 15780000 : e.id === "e_apac" ? 2220000 : e.id === "e_eu" ? 680000 : e.id === "e_004" ? 1450000 : 320000), 0);
  const budgetUtilPct = budgetAllocated > 0 ? Math.round((budgetSpent / budgetAllocated) * 100) : 0;
  const avgTimeToHire = 34;
  const offerAcceptance = 87;

  const hiringByEntity = filtered.map((e) => ({
    name: e.name.replace("TechCorp ", "").replace("GreenLeaf ", "GL ").replace("EduVerse ", "EV "),
    open: e.openReqs,
    headcount: Math.round(e.headcount / 50),
  }));

  const budgetByEntity = filtered.map((e) => {
    const alloc = e.id === "e_001" ? 21800000 : e.id === "e_apac" ? 2700000 : e.id === "e_eu" ? 1200000 : e.id === "e_004" ? 1500000 : 800000;
    const spent = e.id === "e_001" ? 15780000 : e.id === "e_apac" ? 2220000 : e.id === "e_eu" ? 680000 : e.id === "e_004" ? 1450000 : 320000;
    return {
      name: e.name.replace("TechCorp ", "").replace("GreenLeaf ", "GL ").replace("EduVerse ", "EV "),
      Allocated: Math.round(alloc / 100000),
      Spent: Math.round(spent / 100000),
    };
  });

  const departmentBreakdown = [
    { name: "Engineering", value: 178 },
    { name: "Product", value: 32 },
    { name: "Go-to-Market", value: 59 },
    { name: "Operations", value: 66 },
    { name: "Content", value: 19 },
    { name: "People", value: 12 },
  ];

  const needsApproval = REQUISITION_APPROVALS.filter((r) => r.status === "pending");

  const recentActivity = [
    ...auditLogs,
    { id: "al_x1", actor: "Anika Verma", action: "req.submitted", resource: "Requisition", resourceId: "req_002", timestamp: "2024-10-18T11:00:00Z", ip: "203.0.113.42", details: "Submitted req 'Senior Backend Engineer (x3) — APAC'", severity: "info" as const },
    { id: "al_x2", actor: "Wei Lin", action: "team.created", resource: "Team", resourceId: "t_006", timestamp: "2024-10-17T08:00:00Z", ip: "203.0.113.51", details: "Created team 'APAC Platform'", severity: "info" as const },
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? "Rohan Mehta"}`}
        description={`${TENANT_NAME} enterprise tenant — cross-entity hiring governance.`}
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[
          { label: "Approvals queue", icon: "ShieldCheck", variant: "outline", onClick: () => navigate("employer", "ent-approvals") },
          { label: "Add entity", icon: "Building2", onClick: () => navigate("employer", "ent-entities") },
        ]}
      />

      <TenantDisclaimer />

      {/* Entity switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Scope:</span>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="h-9 w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities ({entities.length})</SelectItem>
            {entities.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name} · {e.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {entityFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setEntityFilter("all")}>Clear</Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Entities" value={totalEntities} icon={<Building2 className="h-5 w-5" />} tone="brand" hint={entityFilter === "all" ? "All in tenant" : "Scoped"} />
        <StatCard label="Open requisitions" value={totalOpenReqs} icon={<Briefcase className="h-5 w-5" />} delta={{ value: "6 new this week", positive: true }} />
        <StatCard label="Total headcount" value={formatNumber(totalHeadcount)} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Budget used" value={`${budgetUtilPct}%`} icon={<Banknote className="h-5 w-5" />} tone={budgetUtilPct > 80 ? "warning" : "default"} hint={`${formatCompactCurrency(budgetSpent)} of ${formatCompactCurrency(budgetAllocated)}`} />
        <StatCard label="Avg time-to-hire" value={`${avgTimeToHire}d`} icon={<Clock className="h-5 w-5" />} delta={{ value: "3d faster", positive: true }} />
        <StatCard label="Offer acceptance" value={`${offerAcceptance}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Hiring by entity" description="Open requisitions vs headcount (×50)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hiringByEntity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="open" name="Open reqs" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="headcount" name="Headcount ÷50" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department breakdown" description="Headcount distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={departmentBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {departmentBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Budget utilization by entity" description="Allocated vs spent (₹ L)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetByEntity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="Allocated" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Spent" stackId="b" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Needs approval" description={`${needsApproval.length} pending requisitions`} action={<Button size="sm" variant="ghost" onClick={() => navigate("employer", "ent-approvals")}>Open queue</Button>}>
          {needsApproval.length === 0 ? (
            <EmptyState icon={<AlertCircle className="h-5 w-5" />} title="Queue clear" description="No requisitions awaiting your approval." />
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {needsApproval.map((r) => {
                const ent = entityById(r.entityId);
                return (
                  <li key={r.id} className="rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{r.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {ent && <AvatarLogo text={ent.logo} size="xs" className="mr-1.5 inline-flex" />}
                          {r.entityName} · {r.department} · {formatCompactCurrency(r.budget, r.currency)}
                        </p>
                      </div>
                      <StatusBadge status="pending_approval" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Recent activity */}
      <SectionCard title="Recent activity" description="Cross-entity audit feed" action={<Button size="sm" variant="ghost" onClick={() => navigate("employer", "ent-audit")}>View all</Button>}>
        <ul className="divide-y">
          {recentActivity.map((a) => (
            <li key={a.id} className="flex items-start gap-3 py-2.5">
              <AvatarLogo text={a.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{a.actor}</span>{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.action}</code>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">{a.details}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground" title={formatDateTime(a.timestamp)}>{timeAgo(a.timestamp)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Quick links */}
      <SectionCard title="Quick actions" description="Jump to common enterprise workflows">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Manage entities", icon: Building2, route: "entities" as const },
            { label: "Headcount plan", icon: Users, route: "headcount" as const },
            { label: "Budgets", icon: Banknote, route: "budgets" as const },
            { label: "Department analytics", icon: TrendingUp, route: "analytics" as const },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={() => navigate("employer", `ent-${qa.route}`)}
              className="flex items-center justify-between rounded-lg border p-4 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <qa.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{qa.label}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
