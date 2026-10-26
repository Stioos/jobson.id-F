"use client";

import * as React from "react";
import { integrations } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { Plus, Plug, KeyRound, Webhook, FileText, RefreshCw, Power } from "lucide-react";
import type { IntegrationConfig } from "@/lib/types";

const CATEGORIES: { id: IntegrationConfig["category"]; label: string }[] = [
  { id: "ats", label: "ATS" },
  { id: "hris", label: "HRIS" },
  { id: "calendar", label: "Calendar" },
  { id: "video", label: "Video" },
  { id: "background_check", label: "Background checks" },
  { id: "payroll", label: "Payroll" },
  { id: "sso", label: "SSO" },
  { id: "communication", label: "Communication" },
];

export function EmployerIntegrations() {
  const [list, setList] = React.useState<IntegrationConfig[]>(integrations);
  const [disconnectTarget, setDisconnectTarget] = React.useState<IntegrationConfig | null>(null);
  const [apiKey] = React.useState("jbs_live_••••••••••••3a9f");

  const connect = (id: string) => {
    setList((prev) => prev.map((i) => i.id === id ? { ...i, status: "connected", lastSync: new Date().toISOString() } : i));
    toast.success("Integration connected");
  };

  const disconnect = () => {
    if (!disconnectTarget) return;
    setList((prev) => prev.map((i) => i.id === disconnectTarget.id ? { ...i, status: "available", lastSync: undefined } : i));
    setDisconnectTarget(null);
    toast.warning("Integration disconnected");
  };

  const sync = (name: string) => toast.success(`${name} synced`, { description: "Last sync just now." });

  const connectedCount = list.filter((i) => i.status === "connected").length;
  const availableCount = list.filter((i) => i.status === "available").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="API & Integrations"
        description="Connect JOBSONN with your existing hiring stack"
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Connected" value={connectedCount} icon={<Plug className="h-5 w-5" />} tone="success" />
        <StatCard label="Available" value={availableCount} icon={<Plus className="h-5 w-5" />} />
        <StatCard label="API calls (30d)" value="42.1K" icon={<KeyRound className="h-5 w-5" />} tone="brand" />
        <StatCard label="Webhooks" value="3 active" icon={<Webhook className="h-5 w-5" />} />
      </div>

      <SectionCard title="Available integrations" description="Connect your tools in one click">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((i) => (
            <Card key={i.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted text-sm font-semibold">
                      {i.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{i.category.replace("_", " ")}</p>
                    </div>
                  </div>
                  <StatusBadge status={i.status} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                {i.lastSync && <p className="text-xs text-muted-foreground">Last sync: {timeAgo(i.lastSync)}</p>}
                <div className="flex gap-2">
                  {i.status === "connected" && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => sync(i.name)}>
                        <RefreshCw className="mr-1 h-3 w-3" /> Sync
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setDisconnectTarget(i)}>
                        <Power className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  {i.status === "available" && (
                    <Button size="sm" className="flex-1" onClick={() => connect(i.id)}>Connect</Button>
                  )}
                  {i.status === "coming_soon" && (
                    <Button size="sm" variant="outline" className="flex-1" disabled>Notify me</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="API credentials" description="Use these to authenticate API requests" action={<Button size="sm" variant="outline" onClick={() => toast.success("New API key generated")}><KeyRound className="mr-2 h-3 w-3" /> Generate key</Button>}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>API key</Label>
              <div className="flex gap-2">
                <Input readOnly value={apiKey} />
                <Button size="icon" variant="outline" onClick={() => { navigator.clipboard?.writeText(apiKey); toast.success("Copied"); }}>
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Treat this key like a password. Do not commit to version control.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Webhook URL</Label>
              <Input readOnly value="https://api.jobsonn.com/v1/webhooks/e_001" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.info("Opening API docs…")}>View docs</Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Opening webhook config…")}>Configure webhooks</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Usage stats" description="Last 30 days">
          <div className="space-y-3">
            {CATEGORIES.filter((c) => list.some((i) => i.category === c.id && i.status === "connected")).map((c) => {
              const calls = Math.floor(Math.random() * 8000) + 500;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-medium">{calls.toLocaleString("en-IN")} calls</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (calls / 8000) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t flex justify-between text-sm">
              <span className="text-muted-foreground">Total calls</span>
              <span className="font-semibold">42,180</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate limit</span>
              <span className="font-medium">100 req/min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uptime (30d)</span>
              <span className="font-medium text-emerald-600">99.98%</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <AlertDialog open={!!disconnectTarget} onOpenChange={(o) => !o && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {disconnectTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will stop all data sync between JOBSONN and {disconnectTarget?.name}. You can reconnect at any time.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={disconnect} className="bg-rose-600 hover:bg-rose-700">Disconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
