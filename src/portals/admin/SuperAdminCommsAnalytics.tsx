"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface ChannelStat {
  channel: "Email" | "SMS" | "WhatsApp" | "Push" | "In-app";
  icon: string;
  volume: number;
  deliveryRate: number;
  openRate: number;
  responseRate: number;
  costPerMsg: number;
  totalCost: number;
}

const CHANNELS: ChannelStat[] = [
  { channel: "Email", icon: "Mail", volume: 412_800, deliveryRate: 96.4, openRate: 42.1, responseRate: 8.2, costPerMsg: 0.02, totalCost: 8256 },
  { channel: "SMS", icon: "Smartphone", volume: 98_400, deliveryRate: 94.8, openRate: 98.0, responseRate: 22.1, costPerMsg: 0.18, totalCost: 17712 },
  { channel: "WhatsApp", icon: "MessageCircle", volume: 14_820, deliveryRate: 98.4, openRate: 82.4, responseRate: 48.1, costPerMsg: 0.42, totalCost: 6224 },
  { channel: "Push", icon: "Bell", volume: 284_400, deliveryRate: 88.2, openRate: 18.4, responseRate: 4.2, costPerMsg: 0.001, totalCost: 284 },
  { channel: "In-app", icon: "MessagesSquare", volume: 142_400, deliveryRate: 100, openRate: 64.2, responseRate: 12.4, costPerMsg: 0, totalCost: 0 },
];

const BEST_TIME = [
  { day: "Mon", bestHour: "10:00", engagement: 78 },
  { day: "Tue", bestHour: "11:00", engagement: 84 },
  { day: "Wed", bestHour: "10:00", engagement: 82 },
  { day: "Thu", bestHour: "14:00", engagement: 76 },
  { day: "Fri", bestHour: "09:00", engagement: 88 },
  { day: "Sat", bestHour: "12:00", engagement: 52 },
  { day: "Sun", bestHour: "18:00", engagement: 38 },
];

const RESPONSE_TIME = [
  { channel: "WhatsApp", median: "4m 12s", p90: "42m", p99: "6h 18m" },
  { channel: "SMS", median: "8m 04s", p90: "1h 12m", p99: "12h 04m" },
  { channel: "In-app", median: "22m 18s", p90: "4h 32m", p99: "2d 4h" },
  { channel: "Email", median: "1h 48m", p90: "8h 22m", p99: "3d 12h" },
  { channel: "Push", median: "32m 04s", p90: "6h 12m", p99: "2d 8h" },
];

export function SuperAdminCommsAnalytics() {
  const totalMsg = CHANNELS.reduce((s, c) => s + c.volume, 0);
  const totalCost = CHANNELS.reduce((s, c) => s + c.totalCost, 0);
  const avgDelivery = (CHANNELS.reduce((s, c) => s + c.deliveryRate, 0) / CHANNELS.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comms Analytics"
        description="Cross-channel communication analytics — volume, delivery, open, response rates, cost per message, channel effectiveness, time-to-response, and best-time-to-send analysis."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Export Report", variant: "outline", onClick: () => toast.success("Comms analytics report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Messages (30d)" value={totalMsg.toLocaleString("en-IN")} icon={<Icon name="MessagesSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Delivery Rate" value={`${avgDelivery}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Open Rate" value="61.0%" icon={<Icon name="MailOpen" className="h-5 w-5" />} />
        <StatCard label="Total Cost (30d)" value={`₹${totalCost.toLocaleString("en-IN")}`} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Channel Effectiveness" description="Per-channel performance comparison" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Open</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Cost / msg</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CHANNELS.map(c => (
              <TableRow key={c.channel}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    <Icon name={c.icon} className="h-4 w-4 text-brand" />
                    {c.channel}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{c.volume.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-emerald-500" style={{ width: `${c.deliveryRate}%` }} />
                    </div>
                    <span className="text-xs">{c.deliveryRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{c.openRate}%</TableCell>
                <TableCell className="text-xs">{c.responseRate}%</TableCell>
                <TableCell className="text-xs">{c.costPerMsg === 0 ? "Free" : `₹${c.costPerMsg.toFixed(3)}`}</TableCell>
                <TableCell className="text-xs font-medium">{c.totalCost === 0 ? "—" : `₹${c.totalCost.toLocaleString("en-IN")}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Best Time to Send" description="Engagement by day of week (avg across channels)">
          <div className="space-y-2">
            {BEST_TIME.map(d => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="w-10 text-xs font-medium">{d.day}</span>
                <div className="flex-1">
                  <div className="h-6 overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center justify-end bg-brand px-2 text-[10px] font-medium text-white" style={{ width: `${d.engagement}%` }}>
                      {d.engagement}%
                    </div>
                  </div>
                </div>
                <span className="w-16 text-xs text-muted-foreground">peak {d.bestHour}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-md bg-emerald-500/10 p-2 text-xs text-emerald-700">
            <Icon name="Lightbulb" className="mr-1 inline h-3 w-3" /> Best send window: <strong>Fri 09:00</strong> (88% engagement).
          </p>
        </SectionCard>

        <SectionCard title="Time-to-Response Analytics" description="Median, p90, p99 response times">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Median</TableHead>
                <TableHead>p90</TableHead>
                <TableHead>p99</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESPONSE_TIME.map(r => (
                <TableRow key={r.channel}>
                  <TableCell className="font-medium">{r.channel}</TableCell>
                  <TableCell className="text-xs"><Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{r.median}</Badge></TableCell>
                  <TableCell className="text-xs">{r.p90}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.p99}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
