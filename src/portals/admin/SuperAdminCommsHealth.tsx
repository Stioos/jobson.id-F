"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Pair =
  | "Candidate ↔ Employer"
  | "Candidate ↔ Recruiter"
  | "Recruiter ↔ Employer"
  | "Employer ↔ Training"
  | "Employer ↔ Partner"
  | "Training ↔ Partner";

type Channel = "Email" | "SMS" | "WhatsApp" | "Push";

interface PairHealth {
  pair: Pair;
  volume: number;
  avgResponseHrs: number;
  responseRate: number;
  health: number; // 0-100
  trend: "up" | "down" | "flat";
}

const PAIRS: PairHealth[] = [
  { pair: "Candidate ↔ Employer", volume: 12_840, avgResponseHrs: 4.2, responseRate: 88, health: 86, trend: "up" },
  { pair: "Candidate ↔ Recruiter", volume: 8_220, avgResponseHrs: 2.1, responseRate: 92, health: 90, trend: "up" },
  { pair: "Recruiter ↔ Employer", volume: 6_410, avgResponseHrs: 6.8, responseRate: 78, health: 72, trend: "down" },
  { pair: "Employer ↔ Training", volume: 2_140, avgResponseHrs: 14.4, responseRate: 64, health: 58, trend: "down" },
  { pair: "Employer ↔ Partner", volume: 3_820, avgResponseHrs: 11.2, responseRate: 70, health: 64, trend: "flat" },
  { pair: "Training ↔ Partner", volume: 1_480, avgResponseHrs: 8.6, responseRate: 82, health: 78, trend: "up" },
];

const CHANNELS: { channel: Channel; icon: string; sent: number; delivery: number; bounce: number; open: number; extra: string }[] = [
  { channel: "Email", icon: "Mail", sent: 412_800, delivery: 96.4, bounce: 2.1, open: 42.1, extra: "Complaint 0.3%" },
  { channel: "SMS", icon: "Smartphone", sent: 98_400, delivery: 94.8, bounce: 3.2, open: 98.0, extra: "DND 1.4%" },
  { channel: "WhatsApp", icon: "MessageCircle", sent: 14_820, delivery: 98.4, bounce: 0.8, open: 82.4, extra: "Read 76%" },
  { channel: "Push", icon: "Bell", sent: 284_400, delivery: 88.2, bounce: 7.4, open: 18.4, extra: "Dismiss 6%" },
];

const TREND_7D = [
  { day: "Mon", msgs: 18_400 },
  { day: "Tue", msgs: 21_200 },
  { day: "Wed", msgs: 24_800 },
  { day: "Thu", msgs: 19_600 },
  { day: "Fri", msgs: 27_400 },
  { day: "Sat", msgs: 8_200 },
  { day: "Sun", msgs: 5_400 },
];

const ALERTS: { severity: "warning" | "danger"; text: string }[] = [
  { severity: "danger", text: "Candidate ↔ Employer response time increased 40% week-over-week (3.0h → 4.2h)" },
  { severity: "danger", text: "SMS bounce rate 3.2% above 2% threshold — DLT template issue suspected" },
  { severity: "warning", text: "Employer ↔ Training response rate dropped to 64% (was 72% last week)" },
  { severity: "warning", text: "Push notification delivery dropped to 88.2% — Android 14 background limits suspected" },
  { severity: "warning", text: "WhatsApp complaint rate at 0.4% — approaching 0.5% Meta review threshold" },
];

function healthTone(h: number): string {
  if (h >= 80) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
  if (h >= 65) return "bg-amber-500/10 text-amber-700 border-amber-500/30";
  return "bg-rose-500/10 text-rose-700 border-rose-500/30";
}

function trendIcon(t: "up" | "down" | "flat"): React.ReactNode {
  if (t === "up") return <Icon name="TrendingUp" className="h-3 w-3 text-emerald-600" />;
  if (t === "down") return <Icon name="TrendingDown" className="h-3 w-3 text-rose-600" />;
  return <Icon name="Activity" className="h-3 w-3 text-muted-foreground" />;
}

export function SuperAdminCommsHealth() {
  const totalVolume = PAIRS.reduce((s, p) => s + p.volume, 0);
  const avgResponse = (PAIRS.reduce((s, p) => s + p.avgResponseHrs * p.volume, 0) / totalVolume).toFixed(1);
  const avgDelivery = (CHANNELS.reduce((s, c) => s + c.delivery * c.sent, 0) / CHANNELS.reduce((s, c) => s + c.sent, 0)).toFixed(1);
  const avgBounce = (CHANNELS.reduce((s, c) => s + c.bounce * c.sent, 0) / CHANNELS.reduce((s, c) => s + c.sent, 0)).toFixed(1);
  const avgOpen = (CHANNELS.reduce((s, c) => s + c.open * c.sent, 0) / CHANNELS.reduce((s, c) => s + c.sent, 0)).toFixed(1);
  const maxMsgs = Math.max(...TREND_7D.map(d => d.msgs));
  const dangerAlerts = ALERTS.filter(a => a.severity === "danger").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comms Health"
        description="Real-time communication health across all 5 portals — per-pair delivery, response times, channel-specific metrics, trends, and alerts for any degrading communication paths."
        icon={<Icon name="Activity" className="h-6 w-6" />}
        actions={[
          { label: "Export health report", variant: "outline", onClick: () => toast.success("Comms health report exported") },
          { label: "Acknowledge alerts", variant: "default", onClick: () => toast.success(`${ALERTS.length} alerts acknowledged`) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Overall Delivery Rate" value={`${avgDelivery}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" delta={{ value: "0.4% vs last wk", positive: true }} />
        <StatCard label="Avg Response Time" value={`${avgResponse}h`} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" delta={{ value: "8% slower", positive: false }} />
        <StatCard label="Open Rate" value={`${avgOpen}%`} icon={<Icon name="MailOpen" className="h-5 w-5" />} />
        <StatCard label="Bounce Rate" value={`${avgBounce}%`} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" delta={{ value: "0.2% vs last wk", positive: false }} />
      </div>

      <SectionCard title="Active Alerts" description={`${dangerAlerts} critical · ${ALERTS.length - dangerAlerts} warnings`}>
        {ALERTS.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No alerts" />
        ) : (
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${a.severity === "danger" ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                <Icon name={a.severity === "danger" ? "Siren" : "AlertTriangle"} className={`mt-0.5 h-4 w-4 ${a.severity === "danger" ? "text-rose-600" : "text-amber-600"}`} />
                <div className="flex-1">
                  <p className={`text-xs ${a.severity === "danger" ? "text-rose-700" : "text-amber-700"}`}>{a.text}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${a.severity === "danger" ? "bg-rose-500/10 text-rose-700 border-rose-500/30" : "bg-amber-500/10 text-amber-700 border-amber-500/30"}`}>
                  {a.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Portal-Pair Health" description="Health score per portal communication pair — volume, response time, response rate">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map(p => (
            <div key={p.pair} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{p.pair}</span>
                <Badge variant="outline" className={`text-[10px] ${healthTone(p.health)}`}>{p.health}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Volume</p>
                  <p className="text-sm font-semibold">{p.volume.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Avg Resp</p>
                  <p className="text-sm font-semibold">{p.avgResponseHrs}h</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Resp Rate</p>
                  <p className="text-sm font-semibold">{p.responseRate}%</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${p.health >= 80 ? "bg-emerald-500" : p.health >= 65 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${p.health}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                {trendIcon(p.trend)}{p.trend} vs last week
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Channel Health" description="Delivery / bounce / open by channel" className="lg:col-span-2">
          <div className="space-y-3">
            {CHANNELS.map(c => (
              <div key={c.channel} className="flex items-center gap-3">
                <div className="flex w-32 items-center gap-2">
                  <Icon name={c.icon} className="h-4 w-4 text-brand" />
                  <span className="text-xs font-medium">{c.channel}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{c.sent.toLocaleString("en-IN")} sent</span>
                    <span>{c.extra}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-emerald-500" style={{ width: `${c.delivery}%` }} title={`delivery ${c.delivery}%`} />
                    <div className="h-full bg-amber-500" style={{ width: `${c.open}%` }} title={`open ${c.open}%`} />
                    <div className="h-full bg-rose-500" style={{ width: `${c.bounce * 5}%` }} title={`bounce ${c.bounce}%`} />
                  </div>
                </div>
                <div className="w-24 text-right text-[10px] text-muted-foreground">
                  <div>delivery <span className="font-semibold text-emerald-600">{c.delivery}%</span></div>
                  <div>bounce <span className="font-semibold text-rose-600">{c.bounce}%</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 border-t pt-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-emerald-500" />Delivery</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-amber-500" />Open</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-rose-500" />Bounce</span>
          </div>
        </SectionCard>

        <SectionCard title="Messages per Day (7d)" description="Total volume trend">
          <div className="space-y-2">
            {TREND_7D.map(d => (
              <div key={d.day} className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-medium text-muted-foreground">{d.day}</span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center justify-end bg-brand px-2 text-[10px] font-medium text-white" style={{ width: `${(d.msgs / maxMsgs) * 100}%` }}>
                      {(d.msgs / 1000).toFixed(1)}k
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-md bg-emerald-500/10 p-2 text-[10px] text-emerald-700">
            <Icon name="Lightbulb" className="mr-1 inline h-3 w-3" /> Peak: Friday 27.4k — weekend drops 70%.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
