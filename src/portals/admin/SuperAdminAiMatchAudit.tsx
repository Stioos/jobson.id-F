"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const SCORE_BUCKETS = [
  { range: "0-20", count: 2840, pct: 6.2 },
  { range: "21-40", count: 6420, pct: 14.0 },
  { range: "41-60", count: 12840, pct: 28.1 },
  { range: "61-80", count: 16240, pct: 35.5 },
  { range: "81-100", count: 7280, pct: 15.9 },
];

const BIAS_CHECKS = [
  { type: "Gender Bias", detail: "Female candidates score avg 4.2 points lower than male candidates with similar profiles", severity: "Critical", delta: -4.2 },
  { type: "Age Bias", detail: "Candidates 45+ score 6.8 points lower than 25-35 cohort (controls applied)", severity: "High", delta: -6.8 },
  { type: "Location Bias", detail: "Tier-2/3 city candidates score 2.4 points lower than metro candidates", severity: "Medium", delta: -2.4 },
  { type: "Education Bias", detail: "Non-tier-1 college graduates score 3.1 points lower (control: same experience)", severity: "Medium", delta: -3.1 },
];

const ACCURACY = [
  { bucket: "High Score (81-100)", hires: 482, total: 7280, accuracy: 6.6 },
  { bucket: "Medium-High (61-80)", hires: 612, total: 16240, accuracy: 3.8 },
  { bucket: "Medium (41-60)", hires: 124, total: 12840, accuracy: 1.0 },
  { bucket: "Low (0-40)", hires: 29, total: 9260, accuracy: 0.3 },
];

const MODELS = [
  { version: "v2.4.1", deployedAt: "2024-09-01", usage: 68, accuracy: 82.4, status: "Production" },
  { version: "v2.4.0", deployedAt: "2024-08-15", usage: 24, accuracy: 81.2, status: "Shadow" },
  { version: "v2.3.5", deployedAt: "2024-07-20", usage: 8, accuracy: 79.8, status: "Deprecated" },
];

const SEVERITY_TONE: Record<string, string> = {
  Critical: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  High: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

export function SuperAdminAiMatchAudit() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Match Audit"
        description="Audit of the AI matching algorithm — score distribution, bias detection, accuracy metrics, and model version tracking."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[{ label: "Fairness Report", variant: "outline", onClick: () => toast.success("Fairness report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Matches (30d)" value="45.6K" delta={{ value: "+18%", positive: true }} icon={<Icon name="Sparkles" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Model Accuracy" value="82.4%" delta={{ value: "+1.2%", positive: true }} icon={<Icon name="Target" className="h-5 w-5" />} tone="success" />
        <StatCard label="Bias Flags" value={BIAS_CHECKS.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="High-Score Hires" value="482" icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Match Score Distribution" description="Distribution of AI scores across all matches">
        <div className="space-y-2.5">
          {SCORE_BUCKETS.map(b => (
            <div key={b.range}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{b.range}</span>
                <span className="text-muted-foreground">{b.count.toLocaleString("en-IN")} <span className="text-xs">({b.pct}%)</span></span>
              </div>
              <div className="mt-1 h-3 rounded-md bg-muted/40 overflow-hidden">
                <div className={`h-full ${b.pct > 30 ? "bg-emerald-600/70" : b.pct > 15 ? "bg-amber-500/70" : "bg-rose-500/70"}`} style={{ width: `${b.pct * 2.5}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Bias Detection" description="Demographic patterns in match scores" className="border-rose-500/30">
        {BIAS_CHECKS.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No bias detected" />
        ) : (
          <ul className="space-y-2">
            {BIAS_CHECKS.map(b => (
              <li key={b.type} className="flex flex-col gap-1 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" className="h-4 w-4 text-rose-600" />
                    <span className="font-medium">{b.type}</span>
                    <Badge variant="outline" className={SEVERITY_TONE[b.severity]}>{b.severity}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.detail}</p>
                </div>
                <div className="text-rose-700 font-mono text-sm font-semibold">{b.delta}pts</div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Match Accuracy — Hire Rate by Score Bucket" description="Did high-score candidates actually get hired?">
          <div className="space-y-2.5">
            {ACCURACY.map(a => (
              <div key={a.bucket}>
                <div className="flex items-center justify-between text-sm">
                  <span>{a.bucket}</span>
                  <span className="text-muted-foreground">{a.hires} hires <span className="text-xs">/ {a.total.toLocaleString("en-IN")} matches</span></span>
                </div>
                <Progress className="mt-1 h-2" value={a.accuracy * 10} />
                <p className="mt-0.5 text-[10px] text-muted-foreground">Hire rate: {a.accuracy}%</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Model Versions" description="Deployed AI matching model versions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Deployed</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODELS.map(m => (
                <TableRow key={m.version}>
                  <TableCell className="font-mono text-sm">{m.version}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{m.deployedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-16" value={m.usage} />
                      <span className="text-xs">{m.usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-emerald-700">{m.accuracy}%</TableCell>
                  <TableCell><Badge variant="outline" className={m.status === "Production" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : m.status === "Shadow" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-slate-500/15 text-slate-500 border-slate-500/30"}>{m.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}

