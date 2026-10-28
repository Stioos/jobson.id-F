"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Prefs {
  event: string;
  channels: { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean };
}

const EVENTS = [
  { event: "New application received", icon: "FileText" },
  { event: "Interview scheduled", icon: "Calendar" },
  { event: "Offer accepted/declined", icon: "BadgeCheck" },
  { event: "Payout approved", icon: "Coins" },
  { event: "Payout failed", icon: "AlertCircle" },
  { event: "Invoice overdue", icon: "ReceiptText" },
  { event: "Refund requested", icon: "RotateCcw" },
  { event: "Security alert (critical)", icon: "ShieldCheck" },
  { event: "Security alert (warning)", icon: "AlertTriangle" },
  { event: "New partner application", icon: "Handshake" },
  { event: "Maintenance scheduled", icon: "Wrench" },
  { event: "Incident declared", icon: "AlertCircle" },
  { event: "API key rotated", icon: "Key" },
  { event: "Feature flag changed", icon: "Flag" },
  { event: "Backup failed", icon: "Database" },
  { event: "Audit log export", icon: "ScrollText" },
];

const INITIAL: Prefs[] = EVENTS.map(e => ({
  event: e.event,
  channels: { inApp: true, email: true, sms: ["Payout failed", "Security alert (critical)", "Incident declared"].includes(e.event), whatsapp: ["Incident declared", "Security alert (critical)"].includes(e.event) },
}));

const DIGEST = [
  { name: "Daily KPI digest", time: "09:00 IST", channels: ["email"], on: true },
  { name: "Weekly executive summary", time: "Mon 09:00 IST", channels: ["email"], on: true },
  { name: "Monthly board pack", time: "1st 10:00 IST", channels: ["email"], on: false },
];

export function SuperAdminNotificationPrefs() {
  const [prefs, setPrefs] = React.useState(INITIAL);
  const [digests, setDigests] = React.useState(DIGEST);

  const toggle = (idx: number, channel: "inApp" | "email" | "sms" | "whatsapp") => {
    setPrefs(prefs.map((p, i) => i === idx ? { ...p, channels: { ...p.channels, [channel]: !p.channels[channel] } } : p));
    toast.success("Preference updated");
  };

  const toggleDigest = (i: number) => {
    setDigests(digests.map((d, j) => j === i ? { ...d, on: !d.on } : d));
    toast.success("Digest toggle updated");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Preferences"
        description="Per-event channel toggles — control what you receive via in-app, email, SMS, and WhatsApp."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[{ label: "Save All", onClick: () => toast.success("All preferences saved") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Tracked Events" value={EVENTS.length} icon={<Icon name="Bell" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Channels" value={4} icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Digests" value={digests.filter(d => d.on).length} icon={<Icon name="Mail" className="h-5 w-5" />} tone="success" />
        <StatCard label="Quiet Hours" value="22:00–07:00" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Event Channel Matrix" description="Toggle delivery channel per event">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="py-2 pr-4 text-left">Event</th>
                <th className="py-2 pr-4 text-center">In-App</th>
                <th className="py-2 pr-4 text-center">Email</th>
                <th className="py-2 pr-4 text-center">SMS</th>
                <th className="py-2 pr-4 text-center">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p, i) => (
                <tr key={p.event} className="border-b last:border-0">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Icon name={EVENTS[i].icon} className="h-3.5 w-3.5 text-brand" />
                      <span className="text-sm">{p.event}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-center"><Switch checked={p.channels.inApp} onCheckedChange={() => toggle(i, "inApp")} /></td>
                  <td className="py-2.5 pr-4 text-center"><Switch checked={p.channels.email} onCheckedChange={() => toggle(i, "email")} /></td>
                  <td className="py-2.5 pr-4 text-center"><Switch checked={p.channels.sms} onCheckedChange={() => toggle(i, "sms")} /></td>
                  <td className="py-2.5 pr-4 text-center"><Switch checked={p.channels.whatsapp} onCheckedChange={() => toggle(i, "whatsapp")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Digest Subscriptions" description="Scheduled summary emails">
        <div className="space-y-2">
          {digests.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between rounded-md border bg-card p-3">
              <div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium">{d.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{d.time}</span>
                  <span>•</span>
                  <div className="flex gap-1">
                    {d.channels.map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                  </div>
                </div>
              </div>
              <Switch checked={d.on} onCheckedChange={() => toggleDigest(i)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quiet Hours" description="Pause non-critical notifications during off-hours">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border bg-card p-4">
            <Label className="text-xs">Start (IST)</Label>
            <Select defaultValue="22">
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, h) => <SelectItem key={h} value={String(h).padStart(2, "0")}>{String(h).padStart(2, "0")}:00</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border bg-card p-4">
            <Label className="text-xs">End (IST)</Label>
            <Select defaultValue="07">
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, h) => <SelectItem key={h} value={String(h).padStart(2, "0")}>{String(h).padStart(2, "0")}:00</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-3" onClick={() => toast.success("Quiet hours saved")}>Save Quiet Hours</Button>
      </SectionCard>
    </div>
  );
}
