"use client";

import * as React from "react";
import { integrations as baseIntegrations } from "@/lib/mock-data";
import type { IntegrationConfig } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { timeAgo } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plug, Video, MessageSquare, Calendar, Cloud, Users, Shield, Database, KeyRound, CheckCircle2, X } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  video: Video, communication: MessageSquare, calendar: Calendar,
  hris: Users, ats: Database, sso: Shield, payroll: Database, background_check: Shield,
};

const CATEGORY_LABELS: Record<string, string> = {
  video: "Live Training", communication: "Communication", calendar: "Calendar",
  hris: "HRIS", ats: "ATS", sso: "SSO", payroll: "Payroll", background_check: "Background Checks",
};

// LMS-specific additions
const LMS_INTEGRATIONS: IntegrationConfig[] = [
  { id: "int_l1", name: "Moodle LMS", category: "ats", status: "available", description: "Sync courses, enrollments, and grades with Moodle" },
  { id: "int_l2", name: "Canvas LMS", category: "ats", status: "available", description: "Connect to Instructure Canvas for course sync" },
  { id: "int_l3", name: "Cornerstone HR", category: "hris", status: "available", description: "Sync employee data and training assignments" },
  { id: "int_l4", name: "Webex Meetings", category: "video", status: "available", description: "Schedule and join Webex training sessions" },
  { id: "int_l5", name: "Razorpay Subscriptions", category: "payroll", status: "available", description: "Recurring B2B billing for training contracts" },
];

export function TrainingIntegrations() {
  const [rows, setRows] = React.useState<IntegrationConfig[]>([...baseIntegrations, ...LMS_INTEGRATIONS]);
  const [disconnect, setDisconnect] = React.useState<IntegrationConfig | null>(null);

  const connected = rows.filter((r) => r.status === "connected");
  const available = rows.filter((r) => r.status === "available");
  const comingSoon = rows.filter((r) => r.status === "coming_soon");

  function connect(int: IntegrationConfig) {
    setRows((r) => r.map((x) => x.id === int.id ? { ...x, status: "connected", lastSync: new Date().toISOString() } : x));
    toast.success(`Connected — ${int.name}`);
  }

  function confirmDisconnect() {
    if (!disconnect) return;
    setRows((r) => r.map((x) => x.id === disconnect.id ? { ...x, status: "available", lastSync: undefined } : x));
    toast.success(`Disconnected — ${disconnect.name}`);
    setDisconnect(null);
  }

  function sync(int: IntegrationConfig) {
    setRows((r) => r.map((x) => x.id === int.id ? { ...x, lastSync: new Date().toISOString() } : x));
    toast.success(`Synced — ${int.name}`);
  }

  const grouped = React.useMemo(() => {
    const map: Record<string, IntegrationConfig[]> = {};
    rows.forEach((r) => {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    });
    return map;
  }, [rows]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Integrations"
        description="Connect external tools — video, LMS, HRIS, billing, and more."
        icon={<Icon name="Plug" className="h-6 w-6" />}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Connected" value={connected.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Available" value={available.length} icon={<Plug className="h-5 w-5" />} tone="brand" />
        <StatCard label="Coming Soon" value={comingSoon.length} icon={<Plug className="h-5 w-5" />} />
        <StatCard label="Categories" value={Object.keys(grouped).length} icon={<Database className="h-5 w-5" />} />
      </div>

      {/* Integrations by category */}
      {Object.entries(grouped).map(([cat, items]) => {
        const CatIcon = CATEGORY_ICONS[cat] ?? Plug;
        return (
          <SectionCard
            key={cat}
            title={CATEGORY_LABELS[cat] ?? cat}
            description={`${items.filter((i) => i.status === "connected").length}/${items.length} connected`}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((int) => {
                const CatIcon2 = CATEGORY_ICONS[int.category] ?? Plug;
                return (
                  <div key={int.id} className="rounded-lg border p-4 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <CatIcon2 className="h-5 w-5" />
                      </div>
                      <StatusBadge status={int.status} />
                    </div>
                    <h3 className="mt-3 font-semibold text-sm">{int.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{int.description}</p>
                    {int.lastSync && (
                      <p className="mt-2 text-[10px] text-muted-foreground">Last sync: {timeAgo(int.lastSync)}</p>
                    )}
                    <div className="mt-3 flex gap-2">
                      {int.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => sync(int)}>Sync</Button>
                          <Button variant="outline" size="sm" onClick={() => setDisconnect(int)}><X className="h-3 w-3" /></Button>
                        </>
                      ) : int.status === "available" ? (
                        <Button size="sm" className="flex-1" onClick={() => connect(int)}>Connect</Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1" disabled>Notify me</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        );
      })}

      {/* API credentials */}
      <SectionCard title="API Credentials" description="Use these to integrate with your own systems">
        <div className="space-y-3">
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <div className="mt-1 flex gap-2">
              <Input id="api-key" type="password" value="sk_live_skillforge_xxxxxxxxxxxxxxxxxxxx" readOnly />
              <Button variant="outline" onClick={() => toast.success("API key copied to clipboard")}>Copy</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="webhook">Webhook URL</Label>
            <div className="mt-1 flex gap-2">
              <Input id="webhook" value="https://api.skillforge.academy/v1/webhooks/jobsonn" readOnly />
              <Button variant="outline" onClick={() => toast.success("Webhook URL copied")}>Copy</Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <KeyRound className="h-3 w-3" />
            <span>Rate limit: 1000 req/hour. Documentation: <a className="text-brand hover:underline" href="#">docs.skillforge.academy</a></span>
          </div>
        </div>
      </SectionCard>

      <AlertDialog open={!!disconnect} onOpenChange={(o) => !o && setDisconnect(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {disconnect?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop all data sync with {disconnect?.name}. Existing data is preserved, but future events won't trigger workflows.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect} className="bg-rose-600 hover:bg-rose-700">Disconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
