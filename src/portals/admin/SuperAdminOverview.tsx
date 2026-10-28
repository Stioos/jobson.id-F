"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatNumber, formatCurrency, timeAgo } from "@/lib/format";

const KPIS = [
  { label: "Total Users", value: "1.28M", delta: "+3.4% MoM", icon: "Users", tone: "brand" as const },
  { label: "Active Jobs", value: "18,492", delta: "+12 today", icon: "Briefcase", tone: "success" as const },
  { label: "Platform Revenue (30d)", value: "₹2.4 Cr", delta: "+12.3%", icon: "Banknote", tone: "brand" as const },
  { label: "Placements (30d)", value: "1,247", delta: "+5.6%", icon: "BadgeCheck", tone: "success" as const },
];

const PORTALS = [
  { name: "Candidate", health: "healthy", users: 942_000, uptime: 99.98, color: "bg-emerald-500" },
  { name: "Employer", health: "healthy", users: 12_400, uptime: 99.95, color: "bg-teal-500" },
  { name: "Recruiter", health: "degraded", users: 4_180, uptime: 99.42, color: "bg-amber-500" },
  { name: "Training", health: "healthy", users: 318_500, uptime: 99.91, color: "bg-cyan-500" },
  { name: "Partner", health: "healthy", users: 4_890, uptime: 99.99, color: "bg-violet-500" },
];

const ACTIVITY = [
  { actor: "Priya Nair", action: "submitted application", target: "Senior Frontend Engineer @ TechCorp", time: "2024-09-21T09:42:00Z", portal: "Candidate" },
  { actor: "Rohan Mehta", action: "posted job", target: "Backend Architect", time: "2024-09-21T09:30:00Z", portal: "Employer" },
  { actor: "Sneha Reddy", action: "approved payout", target: "Settlement #SET-9921", time: "2024-09-21T09:12:00Z", portal: "Recruiter" },
  { actor: "System", action: "triggered cron", target: "Daily GST reconciliation", time: "2024-09-21T09:00:00Z", portal: "System" },
  { actor: "TalentBridge", action: "applied as partner", target: "Franchise — South Zone", time: "2024-09-21T08:48:00Z", portal: "Partner" },
  { actor: "Anika Verma", action: "completed assessment", target: "React Proficiency Test", time: "2024-09-21T08:30:00Z", portal: "Training" },
  { actor: "Platform Admin", action: "rotated API key", target: "internal-ro-service", time: "2024-09-21T08:12:00Z", portal: "System" },
];

const ALERTS = [
  { severity: "critical", msg: "Recruiter portal response latency 1.4s (p95)", time: "12m ago" },
  { severity: "warning", msg: "3 payouts pending SLA breach (next 2h)", time: "28m ago" },
  { severity: "info", msg: "Weekly backup completed — 4.2 GB", time: "1h ago" },
];

const QUICK_ACTIONS = [
  { label: "Add Tenant", icon: "Building2", route: "sa-tenants" },
  { label: "Toggle Feature", icon: "Flag", route: "sa-feature-flags" },
  { label: "Schedule Maintenance", icon: "Wrench", route: "sa-maintenance" },
  { label: "Audit Logs", icon: "ScrollText", route: "sa-audit" },
  { label: "API Keys", icon: "Key", route: "sa-api-keys" },
  { label: "Incidents", icon: "AlertCircle", route: "sa-incidents" },
];

export function SuperAdminOverview() {
  const onQuickAction = (label: string) => toast.success(`Opening ${label}…`);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Real-time platform governance across all 5 portals. Monitor KPIs, portal health, and live activity."
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[{ label: "Export Report", variant: "outline", onClick: () => toast.success("Report queued for export") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        {KPIS.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={{ value: k.delta, positive: true }} icon={<Icon name={k.icon} className="h-5 w-5" />} tone={k.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Portal Health" description="Live status of all 5 portals" className="lg:col-span-2">
          <div className="space-y-3">
            {PORTALS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.name} Portal</span>
                    <Badge variant={p.health === "healthy" ? "default" : "secondary"} className={p.health === "healthy" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>
                      {p.health}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatNumber(p.users)} users</span>
                    <span>uptime {p.uptime}%</span>
                  </div>
                  <Progress className="mt-2 h-1.5" value={p.uptime} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System Alerts" description="Critical platform events">
          <ul className="space-y-3">
            {ALERTS.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon
                  name={a.severity === "critical" ? "AlertTriangle" : a.severity === "warning" ? "AlertCircle" : "Activity"}
                  className={`mt-0.5 h-4 w-4 ${a.severity === "critical" ? "text-rose-500" : a.severity === "warning" ? "text-amber-500" : "text-emerald-500"}`}
                />
                <div className="flex-1">
                  <p className="text-foreground">{a.msg}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Opening incident console")}>
            View Incident Console
          </Button>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Live Activity Feed" description="Cross-portal events" className="lg:col-span-2">
          <div className="max-h-96 overflow-y-auto pr-1">
            <ul className="space-y-2.5">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3 rounded-md border bg-card p-2.5 text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon name="Activity" className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{a.actor}</span> <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">{a.portal}</Badge>
                      <span>{timeAgo(a.time)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" description="Frequent admin tasks">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                onClick={() => onQuickAction(q.label)}
                className="flex flex-col items-start gap-2 rounded-lg border bg-card p-3 text-left transition hover:border-brand/40 hover:bg-brand/5"
              >
                <Icon name={q.icon} className="h-4 w-4 text-brand" />
                <span className="text-xs font-medium">{q.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      <Card>
        <CardContent className="p-4 text-xs text-muted-foreground">
          <p>Super Admin scope: All portals • Platform KPIs auto-refresh every 60s • Last sync {new Date().toLocaleTimeString("en-IN")}.</p>
        </CardContent>
      </Card>
    </div>
  );
}
