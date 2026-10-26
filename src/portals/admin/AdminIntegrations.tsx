"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { integrations } from "@/lib/mock-data";
import type { IntegrationConfig } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries } from "./_shared";

export function AdminIntegrations() {
  const [rows, setRows] = React.useState<IntegrationConfig[]>(integrations);
  const [configTarget, setConfigTarget] = React.useState<IntegrationConfig | null>(null);
  const healthTrend = makeSeries("h", 14, 99, 1).map((p) => ({ ...p }));

  const toggleIntegration = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === "connected" ? "available" : "connected", lastSync: new Date().toISOString() } : r)));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Integrations"
        description="Configure third-party integrations, monitor health, and manage partners."
        icon={<Icon name="Plug" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Connected" value={rows.filter((r) => r.status === "connected").length} icon="Plug" tone="success" />
        <MiniStat label="Available" value={rows.filter((r) => r.status === "available").length} icon="BadgeCheck" />
        <MiniStat label="Coming soon" value={rows.filter((r) => r.status === "coming_soon").length} icon="Clock" tone="warning" />
        <MiniStat label="Avg. health" value="99.2%" icon="Gauge" tone="success" />
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">All integrations</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="partners">API partners</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-semibold">{r.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <Badge variant="outline" className="capitalize mt-0.5">{r.category.replace(/_/g, " ")}</Badge>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{r.description}</p>
                {r.lastSync && <p className="mt-2 text-[11px] text-muted-foreground">Last sync: {timeAgo(r.lastSync)}</p>}
                <div className="mt-3 flex gap-1">
                  {r.status === "connected" ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setConfigTarget(r)}>Configure</Button>
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => { toggleIntegration(r.id); toast.warning(`${r.name} disconnected`); }}>Disconnect</Button>
                    </>
                  ) : r.status === "available" ? (
                    <Button size="sm" onClick={() => { toggleIntegration(r.id); toast.success(`${r.name} connected`); }}>Connect</Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>Coming soon</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-4 space-y-4">
          <ChartCard title="Integration health (14d)" description="Uptime % across all integrations">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[95, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" name="Uptime %" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gH)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <SectionCard title="Per-integration status" description="Last sync, latency, errors.">
            <ul className="space-y-2 text-sm">
              {rows.filter((r) => r.status === "connected").map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-medium">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{r.lastSync ? `Synced ${timeAgo(r.lastSync)}` : "—"}</span>
                    <Badge variant="outline">142ms</Badge>
                    <Badge variant="outline" className="text-emerald-600">0 errors</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="partners" className="mt-4">
          <SectionCard title="API partners" description="Organizations with API access and their scopes.">
            <ul className="space-y-2 text-sm">
              {[
                { name: "Greenhouse", scopes: "jobs:read, jobs:write", keys: 2, status: "active" },
                { name: "Workday", scopes: "candidates:write", keys: 1, status: "active" },
                { name: "Slack", scopes: "notifications:write", keys: 1, status: "active" },
                { name: "SpringVerify", scopes: "background_check:write", keys: 1, status: "pending" },
              ].map((p) => (
                <li key={p.name} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.scopes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{p.keys} key{p.keys > 1 ? "s" : ""}</Badge>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <ConfigDialog open={!!configTarget} onOpenChange={(o) => !o && setConfigTarget(null)} integration={configTarget} onSave={() => {
        toast.success("Integration config saved");
        setConfigTarget(null);
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ConfigDialog({ open, onOpenChange, integration, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; integration: IntegrationConfig | null; onSave: () => void }) {
  const [apiKey, setApiKey] = React.useState("");
  const [webhook, setWebhook] = React.useState("");
  React.useEffect(() => {
    setApiKey(""); setWebhook("");
  }, [integration]);
  if (!integration) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {integration.name}</DialogTitle>
          <DialogDescription>{integration.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="i-key">API key</Label><Input id="i-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="font-mono text-xs" /></div>
          <div className="space-y-1.5"><Label htmlFor="i-wh">Webhook URL</Label><Input id="i-wh" value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="https://..." className="font-mono text-xs" /></div>
          <label className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"><span>Auto-sync every 5 minutes</span><Switch defaultChecked /></label>
          <label className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"><span>Send error alerts to Slack</span><Switch defaultChecked /></label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
