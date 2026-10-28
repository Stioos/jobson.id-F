"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/format";

interface FlaggedTxn {
  id: string; user: string; portal: string; amount: number; rule: string; score: number; status: string; at: string;
}

const FLAGGED: FlaggedTxn[] = [
  { id: "TXN-9920", user: "Aarav Sharma", portal: "employer", amount: 1_84_000, rule: "Velocity", score: 92, status: "review", at: "2024-09-22T08:14:00Z" },
  { id: "TXN-9918", user: "Virtusa Tech", portal: "training", amount: 4_20_000, rule: "Amount Threshold", score: 88, status: "review", at: "2024-09-22T07:02:00Z" },
  { id: "TXN-9915", user: "Imran Q", portal: "candidate", amount: 999, rule: "Duplicate", score: 74, status: "review", at: "2024-09-22T05:48:00Z" },
  { id: "TXN-9909", user: "Neha Kapadia", portal: "recruiter", amount: 36_000, rule: "Geo Mismatch", score: 81, status: "blocked", at: "2024-09-21T22:30:00Z" },
  { id: "TXN-9905", user: "Sahil Verma", portal: "partner", amount: 12_400, rule: "Card Testing", score: 96, status: "blocked", at: "2024-09-21T19:11:00Z" },
  { id: "TXN-9901", user: "BlueWave HR", portal: "employer", amount: 8_800, rule: "Velocity", score: 69, status: "cleared", at: "2024-09-21T16:00:00Z" },
  { id: "TXN-9898", user: "Ritu Bansal", portal: "candidate", amount: 499, rule: "Duplicate", score: 62, status: "cleared", at: "2024-09-21T14:22:00Z" },
];

const RULES = [
  { name: "Velocity Rule", desc: ">5 txns per user in 60s", triggers: 142, status: "active", threshold: "5/60s" },
  { name: "Amount Threshold", desc: "Single txn > ₹2L", triggers: 38, status: "active", threshold: "₹2,00,000" },
  { name: "Geo Mismatch", desc: "IP country != billing country", triggers: 21, status: "active", threshold: "Country" },
  { name: "Duplicate Detection", desc: "Same amount within 5 min", triggers: 86, status: "active", threshold: "5 min" },
  { name: "Card Testing", desc: "Multiple failed attempts", triggers: 14, status: "active", threshold: "3 fails" },
  { name: "VPN/Proxy Block", desc: "Known anonymizing IPs", triggers: 9, status: "paused", threshold: "IP list" },
];

const CASES = [
  { id: "FC-2401", txns: 3, user: "Sahil Verma", status: "investigating", assignee: "Anita R.", opened: "2024-09-21" },
  { id: "FC-2400", txns: 1, user: "Virtusa Tech", status: "escalated", assignee: "Rohit S.", opened: "2024-09-22" },
  { id: "FC-2399", txns: 2, user: "Aarav Sharma", status: "resolved", assignee: "Anita R.", opened: "2024-09-20" },
];

export function SuperAdminFraudDetection() {
  const reviewQueue = FLAGGED.filter(f => f.status === "review");
  const blocked = FLAGGED.filter(f => f.status === "blocked");
  const falsePositives = FLAGGED.filter(f => f.status === "cleared").length;

  const scoreColor = (s: number) =>
    s >= 90 ? "text-rose-600 dark:text-rose-400"
    : s >= 75 ? "text-amber-600 dark:text-amber-400"
    : "text-emerald-600 dark:text-emerald-400";

  const statusBadge = (s: string) => {
    const cls = s === "review" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "blocked" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fraud Detection"
        description="Real-time transaction screening with risk scoring, rule engine, and case management."
        icon={<Icon name="AlertTriangle" className="h-6 w-6" />}
        actions={[
          { label: "Run Scan", variant: "outline", onClick: () => toast.success("Fraud scan started across 1.2M txns") },
          { label: "New Rule", onClick: () => toast.info("Opening rule builder") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="In Review" value={reviewQueue.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Blocked (24h)" value={blocked.length} icon={<Icon name="Shield" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Detection Rate" value="98.4%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="False Positive Rate" value="3.1%" icon={<Icon name="CircleAlert" className="h-5 w-5" />} hint={`${falsePositives} cleared this week`} />
      </div>

      <SectionCard title="Manual Review Queue" description="High-risk transactions awaiting analyst action" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TXN ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Flagged</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FLAGGED.map(f => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.id}</TableCell>
                <TableCell className="font-medium">{f.user}</TableCell>
                <TableCell><Badge variant="outline">{f.portal}</Badge></TableCell>
                <TableCell className="font-medium">{formatCurrency(f.amount)}</TableCell>
                <TableCell className="text-xs">{f.rule}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${scoreColor(f.score)}`}>{f.score}</span>
                    <Progress className="h-1.5 w-12" value={f.score} />
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{timeAgo(f.at)}</TableCell>
                <TableCell>{statusBadge(f.status)}</TableCell>
                <TableCell>
                  {f.status === "review" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Cleared ${f.id}`)}>Clear</Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.error(`Blocked ${f.id} & refunded`)}>Block</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${f.id} case file`)}>Case</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Fraud Rules" description="Active detection rules and triggers (24h)">
          <ul className="space-y-2">
            {RULES.map(r => (
              <li key={r.name} className="rounded-md border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{r.name}</p>
                      <Badge variant="outline" className={r.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>{r.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{r.triggers}</p>
                    <p className="text-[10px] text-muted-foreground">{r.threshold}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Open Fraud Cases" description="Investigation case management">
          {CASES.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No open cases" description="All fraud cases are resolved." />
          ) : (
            <ul className="space-y-2">
              {CASES.map(c => {
                const cls = c.status === "investigating" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                  : c.status === "escalated" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
                  : "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
                return (
                  <li key={c.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{c.id}</span>
                        <Badge variant="outline" className={cls}>{c.status}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.user} · {c.txns} txns · opened {c.opened}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{c.assignee}</p>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => toast.info(`Opening case ${c.id}`)}>Open</Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
