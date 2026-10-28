"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Queue {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp" | "webhook" | "job";
  depth: number;
  processingRate: number;
  oldestMsg: string;
  consumers: number;
  health: "healthy" | "warning" | "critical";
}

const QUEUES: Queue[] = [
  { id: "q_1", name: "email-queue", type: "email", depth: 1842, processingRate: 420, oldestMsg: "8m 12s", consumers: 4, health: "healthy" },
  { id: "q_2", name: "sms-queue", type: "sms", depth: 240, processingRate: 180, oldestMsg: "2m 04s", consumers: 2, health: "healthy" },
  { id: "q_3", name: "whatsapp-queue", type: "whatsapp", depth: 92, processingRate: 60, oldestMsg: "1m 18s", consumers: 1, health: "healthy" },
  { id: "q_4", name: "webhook-queue", type: "webhook", depth: 8402, processingRate: 220, oldestMsg: "42m 18s", consumers: 3, health: "warning" },
  { id: "q_5", name: "job-queue", type: "job", depth: 184, processingRate: 48, oldestMsg: "6m 22s", consumers: 6, health: "healthy" },
  { id: "q_6", name: "ai-scoring-queue", type: "job", depth: 18420, processingRate: 80, oldestMsg: "3h 12m", consumers: 2, health: "critical" },
  { id: "q_7", name: "notification-queue", type: "job", depth: 612, processingRate: 320, oldestMsg: "12m 04s", consumers: 4, health: "healthy" },
];

const DLQ = [
  { id: "dlq_1", queue: "email-queue", msg: "SMTP timeout after 4 retries — recipient: bounced@x.com", age: "2h 14m", attempts: 4 },
  { id: "dlq_2", queue: "webhook-queue", msg: "Consumer 5xx: https://partner.com/hook returned 503", age: "1h 42m", attempts: 5 },
  { id: "dlq_3", queue: "sms-queue", msg: "DLT template mismatch — sender blocked", age: "44m 18s", attempts: 3 },
  { id: "dlq_4", queue: "ai-scoring-queue", msg: "AI service 429: rate limit exceeded", age: "18m 02s", attempts: 5 },
];

export function SuperAdminQueueMonitor() {
  const totalDepth = QUEUES.reduce((s, q) => s + q.depth, 0);
  const totalRate = QUEUES.reduce((s, q) => s + q.processingRate, 0);
  const critical = QUEUES.filter(q => q.health === "critical").length;
  const warning = QUEUES.filter(q => q.health === "warning").length;

  const healthBadge = (h: Queue["health"]) => {
    const cls = h === "healthy" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : h === "warning" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{h}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Queue Monitor"
        description="All message and job queues — depth, processing rate, oldest message, consumer count, queue health, backlog alerts, and dead letter queue (DLQ) inspection."
        icon={<Icon name="ListOrdered" className="h-6 w-6" />}
        actions={[{ label: "Scale Consumers", variant: "outline", onClick: () => toast.success("Auto-scaler triggered") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Backlog" value={totalDepth.toLocaleString("en-IN")} icon={<Icon name="ListOrdered" className="h-5 w-5" />} tone={critical > 0 ? "danger" : "brand"} />
        <StatCard label="Throughput (msg/s)" value={totalRate.toLocaleString("en-IN")} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Critical Queues" value={critical} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="DLQ Messages" value={DLQ.length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Backlog Alerts" description="Queues above threshold" contentClassName="p-0">
        {(critical === 0 && warning === 0) ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No backlog alerts" />
        ) : (
          <div className="divide-y">
            {QUEUES.filter(q => q.health !== "healthy").map(q => (
              <div key={q.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Icon name={q.health === "critical" ? "AlertTriangle" : "AlertCircle"} className={`h-5 w-5 ${q.health === "critical" ? "text-rose-500" : "text-amber-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-mono">{q.name}</span>
                      {healthBadge(q.health)}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{q.depth.toLocaleString("en-IN")} messages • oldest {q.oldestMsg} • {q.consumers} consumers @ {q.processingRate}/s</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Scaled +2 consumers for ${q.name}`)}>Scale +2</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Draining old messages from ${q.name}`)}>Drain</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="All Queues" description="Live queue metrics" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Queue</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Depth</TableHead>
              <TableHead>Rate (msg/s)</TableHead>
              <TableHead>Oldest Msg</TableHead>
              <TableHead>Consumers</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUEUES.map(q => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs font-medium">{q.name}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px] capitalize">{q.type}</Badge></TableCell>
                <TableCell className={`text-xs font-medium ${q.depth > 5000 ? "text-rose-600" : q.depth > 1000 ? "text-amber-600" : ""}`}>{q.depth.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{q.processingRate}</TableCell>
                <TableCell className="text-xs">{q.oldestMsg}</TableCell>
                <TableCell className="text-xs">{q.consumers}</TableCell>
                <TableCell>{healthBadge(q.health)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Paused: ${q.name}`)}>Pause</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Dead Letter Queue (DLQ)" description="Messages that exceeded retry attempts" contentClassName="p-0">
        {DLQ.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="DLQ empty" />
        ) : (
          <div className="divide-y">
            {DLQ.map(d => (
              <div key={d.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" className="mt-0.5 h-5 w-5 text-rose-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium">{d.queue}</span>
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/30 text-[10px]">{d.attempts} attempts</Badge>
                      <Badge variant="outline" className="text-[10px]">{d.age}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{d.msg}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Replayed to ${d.queue}`)}>Replay</Button>
                  <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.success(`Discarded: ${d.id}`)}>Discard</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
