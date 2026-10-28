"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { toast } from "sonner";

const HUBS = [
  { title: "Account & Profile", desc: "Name, email, avatar, time zone", icon: "User", route: "sa-settings-hub" },
  { title: "Security Center", desc: "Password, MFA, sessions, login history", icon: "ShieldCheck", route: "sa-security-center" },
  { title: "Notifications", desc: "Per-event channel toggles", icon: "Bell", route: "sa-notification-preferences" },
  { title: "Multi-Tenant Config", desc: "Tenants, isolation, custom domains", icon: "Building2", route: "sa-tenants" },
  { title: "Portal Settings", desc: "Enable/disable portals, default landing", icon: "Settings", route: "sa-portal-settings" },
  { title: "Feature Flags", desc: "Toggle features per portal", icon: "Flag", route: "sa-feature-flags" },
  { title: "Maintenance Mode", desc: "Schedule and activate maintenance", icon: "Wrench", route: "sa-maintenance" },
  { title: "Roles & Hierarchy", desc: "Admin roles and capabilities", icon: "ShieldCheck", route: "sa-roles-hierarchy" },
  { title: "Access Control", desc: "Role × permission matrix", icon: "Key", route: "sa-access-control" },
  { title: "API Keys", desc: "Issue, rotate, revoke API keys", icon: "Key", route: "sa-api-keys" },
  { title: "Webhooks", desc: "Outbound webhook endpoints", icon: "Webhook", route: "sa-webhooks" },
  { title: "AI Configuration", desc: "LLM provider, models, cost caps", icon: "Sparkles", route: "sa-ai-config" },
  { title: "System Config", desc: "Platform-wide tunable settings", icon: "Cog", route: "sa-system-config" },
  { title: "Backups & DR", desc: "Backup schedule, restore points", icon: "Database", route: "sa-backups" },
  { title: "Plans & Pricing", desc: "Plan tiers, features, pricing", icon: "Tag", route: "sa-plans-pricing" },
  { title: "Templates", desc: "Email/SMS/WhatsApp templates", icon: "LayoutTemplate", route: "sa-templates" },
];

export function SuperAdminSettingsHub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings Center"
        description="Quick navigation to all Super Admin settings sections."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Settings Sections" value={HUBS.length} icon={<Icon name="Settings" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Audit Logged" value="100%" icon={<Icon name="ScrollText" className="h-5 w-5" />} tone="success" />
        <StatCard label="Recent Changes" value="42 (7d)" icon={<Icon name="History" className="h-5 w-5" />} />
        <StatCard label="Pending Reviews" value="3" icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="All Settings" description="Click any card to navigate">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HUBS.map(h => (
            <button
              key={h.title}
              onClick={() => toast.success(`Opening ${h.title}…`)}
              className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Icon name={h.icon} className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{h.title}</span>
                  <Icon name="ChevronRight" className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand" />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{h.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quick Stats" description="Settings health summary">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Security Posture</span>
            </div>
            <p className="mt-1 text-2xl font-semibold">A+</p>
            <p className="text-xs text-muted-foreground">MFA enforced, all keys rotated</p>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Icon name="Activity" className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium">Backup Health</span>
            </div>
            <p className="mt-1 text-2xl font-semibold">98.4%</p>
            <p className="text-xs text-muted-foreground">7-day success rate</p>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Config Compliance</span>
            </div>
            <p className="mt-1 text-2xl font-semibold">100%</p>
            <p className="text-xs text-muted-foreground">All tunables within policy</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
