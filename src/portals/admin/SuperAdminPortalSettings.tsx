"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PORTALS = [
  { id: "candidate", name: "Candidate Portal", enabled: true, landing: "home", users: 942_000, color: "bg-emerald-500" },
  { id: "employer", name: "Employer Portal", enabled: true, landing: "overview", users: 12_400, color: "bg-teal-500" },
  { id: "recruiter", name: "Recruiter Portal", enabled: true, landing: "overview", users: 4_180, color: "bg-amber-500" },
  { id: "training", name: "Training Portal", enabled: true, landing: "overview", users: 318_500, color: "bg-cyan-500" },
  { id: "partner", name: "Partner Portal", enabled: true, landing: "overview", users: 4_890, color: "bg-violet-500" },
  { id: "public", name: "Public Career Portal", enabled: true, landing: "home", users: 0, color: "bg-rose-500" },
];

const META = [
  { key: "platform_name", value: "JOBSONN", scope: "global" },
  { key: "support_email", value: "support@jobsonn.com", scope: "global" },
  { key: "default_currency", value: "INR", scope: "billing" },
  { key: "default_locale", value: "en-IN", scope: "i18n" },
  { key: "max_upload_mb", value: "25", scope: "limits" },
  { key: "session_timeout_min", value: "60", scope: "security" },
];

export function SuperAdminPortalSettings() {
  const [portals, setPortals] = React.useState(PORTALS);
  const [meta, setMeta] = React.useState(META);

  const togglePortal = (id: string) => {
    setPortals(portals.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    const p = portals.find(x => x.id === id);
    toast.success(`${p?.name} ${p?.enabled ? "disabled" : "enabled"}`);
  };

  const setLanding = (id: string, landing: string) => {
    setPortals(portals.map(p => p.id === id ? { ...p, landing } : p));
    toast.info("Default landing updated");
  };

  const saveMeta = () => toast.success("Portal metadata saved");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portal Settings"
        description="Enable or disable entire portals, configure landing routes, and manage platform metadata."
        icon={<Icon name="Settings" className="h-6 w-6" />}
        actions={[{ label: "Save All", onClick: saveMeta }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Portals" value={portals.filter(p => p.enabled).length} icon={<Icon name="LayoutDashboard" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Disabled" value={portals.filter(p => !p.enabled).length} icon={<Icon name="Lock" className="h-5 w-5" />} />
        <StatCard label="Total Users" value={portals.reduce((s, p) => s + p.users, 0)} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Config Entries" value={meta.length} icon={<Icon name="Cog" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Portal Toggles" description="Enable/disable access per portal">
        <div className="grid gap-3 md:grid-cols-2">
          {portals.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-card p-4">
              <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Switch checked={p.enabled} onCheckedChange={() => togglePortal(p.id)} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Default landing</Label>
                  <Select value={p.landing} onValueChange={(v) => setLanding(p.id, v)}>
                    <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">home</SelectItem>
                      <SelectItem value="overview">overview</SelectItem>
                      <SelectItem value="dashboard">dashboard</SelectItem>
                      <SelectItem value="jobs">jobs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="ml-auto text-[10px]">{p.users.toLocaleString("en-IN")} users</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Platform Metadata" description="Global tunable key-value settings">
        <div className="grid gap-3 md:grid-cols-2">
          {meta.map((m, i) => (
            <div key={m.key} className="flex items-center gap-3 rounded-md border bg-card p-3">
              <Badge variant="outline" className="text-[10px]">{m.scope}</Badge>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{m.key}</Label>
                <Input
                  value={m.value}
                  onChange={(e) => setMeta(meta.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  className="mt-1 h-8"
                />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-3" onClick={saveMeta}>Save Metadata</Button>
      </SectionCard>
    </div>
  );
}
