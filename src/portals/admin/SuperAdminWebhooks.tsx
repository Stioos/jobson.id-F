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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Endpoint {
  id: string; url: string; events: string[]; status: "active" | "paused"; lastDelivery: string; lastStatus: "success" | "failed"; successRate: number;
}

const ENDPOINTS: Endpoint[] = [
  { id: "wh_001", url: "https://api.techcorp.com/webhooks/jobson.id", events: ["application.created", "application.status_changed"], status: "active", lastDelivery: "2024-09-21T09:42:00Z", lastStatus: "success", successRate: 99.8 },
  { id: "wh_002", url: "https://hooks.talentbridge.in/jobs", events: ["job.published", "job.closed"], status: "active", lastDelivery: "2024-09-21T08:30:00Z", lastStatus: "success", successRate: 100 },
  { id: "wh_003", url: "https://api.naukrix.com/wh/payment", events: ["payment.success", "payment.failed", "refund.processed"], status: "active", lastDelivery: "2024-09-21T09:55:00Z", lastStatus: "success", successRate: 98.4 },
  { id: "wh_004", url: "https://legacy.partner.in/callback", events: ["placement.created"], status: "paused", lastDelivery: "2024-09-18T14:20:00Z", lastStatus: "failed", successRate: 42.0 },
];

const DELIVERY_LOG = [
  { id: "dlv_001", endpoint: "techcorp", event: "application.created", status: "success", attempts: 1, at: "2024-09-21T09:42:00Z" },
  { id: "dlv_002", endpoint: "talentbridge", event: "job.published", status: "success", attempts: 1, at: "2024-09-21T08:30:00Z" },
  { id: "dlv_003", endpoint: "naukrix", event: "payment.success", status: "success", attempts: 2, at: "2024-09-21T07:20:00Z" },
  { id: "dlv_004", endpoint: "legacy.partner", event: "placement.created", status: "failed", attempts: 3, at: "2024-09-20T17:18:00Z" },
  { id: "dlv_005", endpoint: "techcorp", event: "application.status_changed", status: "success", attempts: 1, at: "2024-09-20T16:42:00Z" },
];

const EVENT_TYPES = ["application.created", "application.status_changed", "job.published", "job.closed", "payment.success", "payment.failed", "refund.processed", "placement.created", "user.signup"];

export function SuperAdminWebhooks() {
  const [url, setUrl] = React.useState("");
  const [selEvents, setSelEvents] = React.useState<string[]>([]);
  const [retryPolicy, setRetryPolicy] = React.useState("3");

  const toggleEvent = (e: string) => {
    setSelEvents(selEvents.includes(e) ? selEvents.filter(x => x !== e) : [...selEvents, e]);
  };

  const create = () => {
    if (!url || selEvents.length === 0) { toast.error("URL and at least 1 event required"); return; }
    toast.success("Webhook endpoint created");
    setUrl(""); setSelEvents([]);
  };

  const statusBadge = (s: string) => {
    const cls = s === "success" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhooks"
        description="Outbound webhook endpoints, event subscriptions, retry policies, and delivery logs."
        icon={<Icon name="Webhook" className="h-6 w-6" />}
        actions={[{ label: "Test Ping", variant: "outline", onClick: () => toast.success("Test ping sent to all active endpoints") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Endpoints" value={ENDPOINTS.length} icon={<Icon name="Webhook" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={ENDPOINTS.filter(e => e.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Deliveries (24h)" value="18,420" icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Failed" value="42" icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Register Webhook" description="Add outbound endpoint" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Endpoint URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/wh" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Events ({selEvents.length} selected)</Label>
              <div className="mt-2 max-h-32 space-y-1 overflow-y-auto pr-1">
                {EVENT_TYPES.map(e => (
                  <label key={e} className="flex items-center gap-2 text-xs cursor-pointer">
                    <Switch checked={selEvents.includes(e)} onCheckedChange={() => toggleEvent(e)} />
                    <span className="font-mono">{e}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Retry policy (max attempts)</Label>
              <Select value={retryPolicy} onValueChange={setRetryPolicy}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (no retry)</SelectItem>
                  <SelectItem value="3">3 attempts (default)</SelectItem>
                  <SelectItem value="5">5 attempts (aggressive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={create}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create Webhook</Button>
          </div>
        </SectionCard>

        <SectionCard title="Endpoints" description={`${ENDPOINTS.length} webhooks`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Last Delivery</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ENDPOINTS.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.url}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {e.events.slice(0, 2).map(ev => <Badge key={ev} variant="outline" className="text-[10px]">{ev}</Badge>)}
                      {e.events.length > 2 && <Badge variant="secondary" className="text-[10px]">+{e.events.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{timeAgo(e.lastDelivery)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={e.successRate >= 95 ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                      {e.successRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>{statusBadge(e.lastStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Delivery Log" description="Recent webhook deliveries" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delivery ID</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DELIVERY_LOG.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.id}</TableCell>
                <TableCell className="text-xs">{d.endpoint}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{d.event}</Badge></TableCell>
                <TableCell>{d.attempts}</TableCell>
                <TableCell className="text-xs">{timeAgo(d.at)}</TableCell>
                <TableCell>{statusBadge(d.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
