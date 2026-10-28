"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const SLA_TIERS = [
  { priority: "Urgent", responseTarget: "15 min", resolutionTarget: "1 hr", responseActual: "12 min", resolutionActual: "48 min", breachRate: 4, color: "bg-rose-500" },
  { priority: "High", responseTarget: "1 hr", resolutionTarget: "4 hr", responseActual: "42 min", resolutionActual: "3.2 hr", breachRate: 8, color: "bg-orange-500" },
  { priority: "Medium", responseTarget: "4 hr", resolutionTarget: "12 hr", responseActual: "2.1 hr", resolutionActual: "8.4 hr", breachRate: 12, color: "bg-amber-500" },
  { priority: "Low", responseTarget: "12 hr", resolutionTarget: "24 hr", responseActual: "6.8 hr", resolutionActual: "18.2 hr", breachRate: 18, color: "bg-slate-500" },
];

const BREACHES = [
  { id: "TKT-2024-8815", subject: "WhatsApp integration broken", priority: "urgent", agent: "Unassigned", breachType: "response", by: "23 min", at: "2024-09-20T07:42:00Z" },
  { id: "TKT-2024-8814", subject: "Cannot login — account locked", priority: "high", agent: "Support L1", breachType: "resolution", by: "1 hr 20 min", at: "2024-09-19T14:30:00Z" },
  { id: "TKT-2024-8808", subject: "GST invoice format wrong", priority: "medium", agent: "Billing Team", breachType: "resolution", by: "3 hr 12 min", at: "2024-09-18T11:00:00Z" },
];

const AGENTS = [
  { agent: "Support L1", open: 14, resolved30d: 184, avgResponse: "8 min", avgResolution: "4.2 hr", csat: 4.4 },
  { agent: "Support L2", open: 8, resolved30d: 142, avgResponse: "18 min", avgResolution: "6.8 hr", csat: 4.6 },
  { agent: "Billing Team", open: 5, resolved30d: 96, avgResponse: "32 min", avgResolution: "9.4 hr", csat: 4.3 },
  { agent: "Onboarding Team", open: 6, resolved30d: 64, avgResponse: "1.2 hr", avgResolution: "14.8 hr", csat: 4.5 },
];

export function SuperAdminSla() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SLA Monitoring"
        description="Per-priority SLA tracking, breach alerts, and agent performance metrics."
        icon={<Icon name="Clock" className="h-6 w-6" />}
        actions={[{ label: "Configure SLAs", variant: "outline", onClick: () => toast.info("Opening SLA config") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Response" value="18 min" delta={{ value: "-4 min MoM", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Resolution" value="6.2 hr" delta={{ value: "-1.4 hr MoM", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Breach Rate" value="11.2%" delta={{ value: "+1.4pt", positive: false }} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Active Breaches" value={BREACHES.length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="SLA Performance by Priority" description="Response & resolution vs targets">
        <div className="grid gap-3 md:grid-cols-2">
          {SLA_TIERS.map(t => {
            const met = t.breachRate < 15;
            return (
              <div key={t.priority} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
                    <span className="font-medium">{t.priority}</span>
                  </div>
                  <Badge variant="outline" className={met ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                    {met ? "Within SLA" : `${t.breachRate}% breach`}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Response (target {t.responseTarget})</p>
                    <p className="font-medium">{t.responseActual}</p>
                    <Progress className="mt-1 h-1" value={Math.min(100, (parseInt(t.responseActual) / parseInt(t.responseTarget)) * 100)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Resolution (target {t.resolutionTarget})</p>
                    <p className="font-medium">{t.resolutionActual}</p>
                    <Progress className="mt-1 h-1" value={Math.min(100, (parseFloat(t.resolutionActual) / parseFloat(t.resolutionTarget)) * 100)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="SLA Breaches (Active)" description="Tickets past SLA — escalate now" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Breach Type</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BREACHES.map(b => (
              <TableRow key={b.id} className="bg-rose-50/40 dark:bg-rose-900/10">
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell className="text-xs">{b.subject}</TableCell>
                <TableCell className="text-xs">{b.agent}</TableCell>
                <TableCell><Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30">{b.breachType}</Badge></TableCell>
                <TableCell className="text-xs font-medium text-rose-700 dark:text-rose-400">{b.by}</TableCell>
                <TableCell>
                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Escalated ${b.id}`)}>Escalate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Agent Performance" description="30-day rolling metrics" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Open</TableHead>
              <TableHead>Resolved (30d)</TableHead>
              <TableHead>Avg Response</TableHead>
              <TableHead>Avg Resolution</TableHead>
              <TableHead>CSAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AGENTS.map(a => (
              <TableRow key={a.agent}>
                <TableCell className="font-medium">{a.agent}</TableCell>
                <TableCell>{a.open}</TableCell>
                <TableCell>{a.resolved30d}</TableCell>
                <TableCell className="text-xs">{a.avgResponse}</TableCell>
                <TableCell className="text-xs">{a.avgResolution}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" className="h-3 w-3 text-amber-500" />
                    <span className="text-xs">{a.csat}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
