"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries, Toolbar } from "./_shared";

type ApiKey = {
  id: string;
  org: string;
  key: string;
  scopes: string[];
  rateLimit: number;
  status: "active" | "revoked";
  lastUsed: string;
};

const INITIAL_KEYS: ApiKey[] = [
  { id: "k1", org: "TechCorp India", key: "js_live_8a4b...c92f", scopes: ["jobs:read", "jobs:write", "applications:read"], rateLimit: 1000, status: "active", lastUsed: "2024-10-20T08:00:00Z" },
  { id: "k2", org: "FinEdge Solutions", key: "js_live_3f7e...a1d2", scopes: ["jobs:read", "applications:read"], rateLimit: 500, status: "active", lastUsed: "2024-10-19T16:00:00Z" },
  { id: "k3", org: "Greenhouse (Partner)", key: "js_partner_99c1...44ab", scopes: ["jobs:read", "jobs:write"], rateLimit: 5000, status: "active", lastUsed: "2024-10-20T07:30:00Z" },
  { id: "k4", org: "EduVerse Learning", key: "js_live_2b8d...ff09", scopes: ["jobs:read"], rateLimit: 100, status: "revoked", lastUsed: "2024-09-15T10:00:00Z" },
];

const WEBHOOKS = [
  { id: "w1", url: "https://api.techcorp.com/jobson.id/webhook", events: ["application.created", "application.stage_changed"], status: "active" },
  { id: "w2", url: "https://hooks.finedge.io/jobs", events: ["job.published", "job.closed"], status: "active" },
];

export function AdminApi() {
  const [keys, setKeys] = React.useState<ApiKey[]>(INITIAL_KEYS);
  const [search, setSearch] = React.useState("");
  const [genOpen, setGenOpen] = React.useState(false);
  const [revokeTarget, setRevokeTarget] = React.useState<ApiKey | null>(null);
  const [defaultLimit, setDefaultLimit] = React.useState(1000);

  const filtered = keys.filter((k) => !search || k.org.toLowerCase().includes(search.toLowerCase()));

  const usageTrend = makeSeries("u", 14, 84000, 22000).map((p) => ({ ...p }));
  const latencyTrend = makeSeries("l", 14, 220, 60).map((p) => ({ ...p, value: p.value }));

  const revoke = () => {
    if (!revokeTarget) return;
    setKeys((p) => p.map((k) => (k.id === revokeTarget.id ? { ...k, status: "revoked" } : k)));
    toast.error("API key revoked", { description: `${revokeTarget.org} key revoked.` });
    setRevokeTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="API Management"
        description="Manage API keys, rate limits, webhooks, and documentation."
        icon={<Icon name="KeyRound" className="h-6 w-6" />}
        actions={[{ label: "Generate key", onClick: () => setGenOpen(true) }, { label: "Docs", variant: "outline", onClick: () => toast.info("Opening API docs (demo)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Active keys" value={keys.filter((k) => k.status === "active").length} icon="KeyRound" />
        <MiniStat label="Requests (30d)" value="1.2M" icon="Send" />
        <MiniStat label="Error rate" value="0.4%" icon="AlertTriangle" tone="warning" />
        <MiniStat label="Avg. latency" value="218ms" icon="Gauge" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="API requests (14d)" description="Daily request volume">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrend} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Requests" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gU)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Latency (14d)" description="p95 response time (ms)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyTrend} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Latency (ms)" stroke={CHART_COLORS[1]} strokeWidth={2} fill="url(#gL)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionCard title={`API keys (${filtered.length})`}>
        <Toolbar search={search} onSearch={setSearch} searchPlaceholder="Search organization..." />
        <div className="mt-3 max-h-[26rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Rate limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="text-sm font-medium">{k.org}</TableCell>
                  <TableCell><code className="font-mono text-xs">{k.key}</code></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => <Badge key={s} variant="secondary" className="text-[10px] font-mono">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{k.rateLimit}/min</TableCell>
                  <TableCell><StatusBadge status={k.status === "active" ? "active" : "cancelled"} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(k.lastUsed)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Key copied (demo)")}>Copy key</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edit scopes (demo)")}>Edit scopes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRevokeTarget(k)} className="text-rose-600">Revoke…</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No API keys.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Rate limiting" description="Default and per-key limits.">
          <div className="space-y-3">
            <div className="space-y-1.5"><Label htmlFor="rl-default">Default rate limit (req/min)</Label><Input id="rl-default" type="number" value={defaultLimit} onChange={(e) => setDefaultLimit(parseInt(e.target.value) || 0)} /></div>
            <div className="rounded-md border p-3 text-xs text-muted-foreground">
              <p>Burst: 2× sustained rate</p>
              <p>429 response with <code>Retry-After</code> header</p>
              <p>Quota reset: rolling 60s window</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Rate limit config saved")}>Save</Button>
          </div>
        </SectionCard>

        <SectionCard title="Webhook endpoints" description="Customer-configured webhooks.">
          <ul className="space-y-2 text-sm">
            {WEBHOOKS.map((w) => (
              <li key={w.id} className="rounded-md border p-2.5">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-xs truncate max-w-[16rem]">{w.url}</code>
                  <StatusBadge status={w.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {w.events.map((e) => <Badge key={e} variant="secondary" className="text-[10px] font-mono">{e}</Badge>)}
                </div>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.info("Add webhook (demo)")}>Add webhook</Button>
        </SectionCard>
      </div>

      <SectionCard title="API versioning & docs" description="Version policy and documentation.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Current version</p>
            <p className="mt-1 text-xl font-semibold">v1.4.0</p>
            <Badge className="mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Stable</Badge>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Deprecation policy</p>
            <p className="mt-1 text-sm">12 months notice before removal</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Documentation</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Button size="sm" variant="outline" onClick={() => toast.info("Open REST docs")}>REST</Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Open webhooks docs")}>Webhooks</Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Open SDK docs")}>SDKs</Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <GenKeyDialog open={genOpen} onOpenChange={setGenOpen} onGenerate={(org, scopes, limit) => {
        const newKey: ApiKey = {
          id: `k_${Date.now()}`, org, key: `js_live_${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
          scopes, rateLimit: limit, status: "active", lastUsed: new Date().toISOString(),
        };
        setKeys((p) => [newKey, ...p]);
        toast.success("API key generated", { description: `Key for ${org} created with ${scopes.length} scopes.` });
        setGenOpen(false);
      }} />

      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key for {revokeTarget?.org}?</AlertDialogTitle>
            <AlertDialogDescription>This immediately invalidates the key. All API calls using it will return 401. Action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={revoke} className="bg-rose-600 hover:bg-rose-700">Revoke key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

function GenKeyDialog({ open, onOpenChange, onGenerate }: { open: boolean; onOpenChange: (o: boolean) => void; onGenerate: (org: string, scopes: string[], limit: number) => void }) {
  const [org, setOrg] = React.useState("");
  const [scopes, setScopes] = React.useState<string[]>(["jobs:read"]);
  const [limit, setLimit] = React.useState(1000);
  const ALL_SCOPES = ["jobs:read", "jobs:write", "applications:read", "applications:write", "candidates:read", "billing:read", "webhooks:write"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate API key</DialogTitle>
          <DialogDescription>Create a new API key with selected scopes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="gk-org">Organization</Label><Input id="gk-org" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="TechCorp India" /></div>
          <div className="space-y-1.5">
            <Label>Scopes</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_SCOPES.map((s) => (
                <label key={s} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                  <input type="checkbox" checked={scopes.includes(s)} onChange={(e) => setScopes((p) => e.target.checked ? [...p, s] : p.filter((x) => x !== s))} />
                  <span className="font-mono">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="gk-lim">Rate limit (req/min)</Label><Input id="gk-lim" type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 0)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!org.trim()) { toast.error("Organization is required"); return; }
            if (scopes.length === 0) { toast.error("Select at least one scope"); return; }
            onGenerate(org.trim(), scopes, limit);
            setOrg(""); setScopes(["jobs:read"]); setLimit(1000);
          }}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
