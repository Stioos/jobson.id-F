"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const GOVERNANCE_ITEMS = [
  {
    title: "Multi-Tenant Config",
    desc: "Manage tenants, tenant isolation, custom domains & storage quotas",
    icon: "Building2",
    route: "sa-tenants",
    badge: "Enterprise",
    stat: "6 Active Tenants",
    statusText: "All isolated & operational",
  },
  {
    title: "Portal Settings",
    desc: "Enable or disable portals, configure default landing routes & global configs",
    icon: "Settings",
    route: "sa-portal-settings",
    badge: "Core",
    stat: "6 Portals Live",
    statusText: "Global defaults applied",
  },
  {
    title: "Feature Flags",
    desc: "Toggle platform feature flags, roll out beta capabilities & canary trials",
    icon: "Flag",
    route: "sa-feature-flags",
    badge: "Beta Engine",
    stat: "7 Flags Configured",
    statusText: "6 active rollouts",
  },
  {
    title: "Maintenance Mode",
    desc: "Schedule downtime windows, set maintenance banners & manage read-only access",
    icon: "Wrench",
    route: "sa-maintenance",
    badge: "Operations",
    stat: "0 Active Outages",
    statusText: "System in normal mode",
  },
  {
    title: "Platform Health",
    desc: "Real-time microservices latency, database uptime, Redis queue & AI cluster status",
    icon: "Activity",
    route: "sa-health",
    badge: "Live Telemetry",
    stat: "99.98% Uptime",
    statusText: "All services operational",
  },
];

export function SuperAdminGovernanceDashboard() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Governance"
        description="Centralized command and operational controls for multi-tenancy, portal toggles, feature flags, maintenance schedules, and system health."
        icon={<Icon name="Shield" className="h-6 w-6 text-brand" />}
        actions={[
          {
            label: "Platform Telemetry",
            variant: "outline",
            onClick: () => navigate("admin", "sa-health"),
          },
        ]}
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard
          label="Governance Modules"
          value="5 Active"
          icon={<Icon name="ShieldCheck" className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Tenants Configured"
          value="6 Tenants"
          icon={<Icon name="Building2" className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Platform Uptime"
          value="99.98%"
          icon={<Icon name="Activity" className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Maintenance Mode"
          value="Off"
          icon={<Icon name="Wrench" className="h-5 w-5" />}
        />
      </div>

      {/* Governance Capabilities Grid */}
      <SectionCard
        title="Governance Services"
        description="Select any operational module below or from the sidebar navigation to configure"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOVERNANCE_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate("admin", item.route)}
              className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 text-left transition-all hover:border-brand/40 hover:bg-brand/5 hover:shadow-xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {item.badge}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <Icon
                    name="ArrowRight"
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand"
                  />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">{item.stat}</span>
                <span className="text-muted-foreground">{item.statusText}</span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Overview Quick Actions / Health Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="System Telemetry Snapshot" description="Real-time cluster & service statuses">
          <div className="space-y-3">
            {[
              { name: "API Gateway", status: "Operational", uptime: "99.98%", ping: "142ms" },
              { name: "Primary Database (PostgreSQL)", status: "Operational", uptime: "99.99%", ping: "8ms" },
              { name: "Job Queue (Redis)", status: "Degraded", uptime: "99.94%", ping: "3ms" },
              { name: "Multi-Tenant Isolation Engine", status: "Operational", uptime: "100%", ping: "12ms" },
            ].map((srv) => (
              <div key={srv.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${srv.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-medium text-foreground">{srv.name}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>{srv.ping}</span>
                  <span className="font-semibold text-foreground">{srv.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Governance Audit Trail" description="Recent administrative policy changes">
          <div className="space-y-3">
            {[
              { action: "Tenant 'TechCorp India' storage quota updated", user: "Super Admin", time: "25m ago" },
              { action: "Feature flag 'wallet_multi_currency' roll-out bumped to 40%", user: "DevOps", time: "2h ago" },
              { action: "Quarterly DB vacuum maintenance scheduled for Oct 1", user: "DBA", time: "4h ago" },
              { action: "Portal 'Employer Portal' landing page set to overview", user: "Super Admin", time: "1d ago" },
            ].map((audit, i) => (
              <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div>
                  <p className="font-medium text-foreground">{audit.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">By {audit.user}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{audit.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

