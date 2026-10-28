"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  service: string;
  message: string;
  traceId?: string;
}

const SERVICES = ["api-gateway", "auth-service", "candidate-api", "employer-api", "recruiter-api", "training-api", "partner-api", "payment-service", "ai-service", "notification-service", "search-service", "scheduler"];

const LOGS: LogEntry[] = [
  { id: "log_1", timestamp: "2024-09-21T10:42:18Z", level: "ERROR", service: "payment-service", message: "Razorpay webhook signature verification failed for event payment.captured", traceId: "tx_8821" },
  { id: "log_2", timestamp: "2024-09-21T10:42:04Z", level: "WARN", service: "ai-service", message: "Rate limit at 92% (4.6K/5K RPM) — throttling resume scoring requests", traceId: "tx_8818" },
  { id: "log_3", timestamp: "2024-09-21T10:41:22Z", level: "FATAL", service: "search-service", message: "Elasticsearch cluster red — 2 unassigned shards, index `resumes_v4` unavailable", traceId: "tx_8812" },
  { id: "log_4", timestamp: "2024-09-21T10:40:18Z", level: "INFO", service: "auth-service", message: "OAuth login success for user usr_4821 via google", traceId: "tx_8804" },
  { id: "log_5", timestamp: "2024-09-21T10:39:48Z", level: "ERROR", service: "notification-service", message: "SMTP connection timeout after 30s — fallback to SES triggered", traceId: "tx_8798" },
  { id: "log_6", timestamp: "2024-09-21T10:38:22Z", level: "WARN", service: "candidate-api", message: "Slow query detected (4.2s): SELECT * FROM applications WHERE ...", traceId: "tx_8792" },
  { id: "log_7", timestamp: "2024-09-21T10:37:04Z", level: "INFO", service: "scheduler", message: "Cron job 'hourly-email-digest' completed in 2m 14s, 1842 emails sent", traceId: "tx_8781" },
  { id: "log_8", timestamp: "2024-09-21T10:35:18Z", level: "ERROR", service: "partner-api", message: "Partner webhook delivery failed (503) — retry 2/5 queued", traceId: "tx_8768" },
  { id: "log_9", timestamp: "2024-09-21T10:34:42Z", level: "FATAL", service: "payment-service", message: "Database connection pool exhausted (max 100) — payout batch aborted", traceId: "tx_8762" },
  { id: "log_10", timestamp: "2024-09-21T10:33:18Z", level: "INFO", service: "employer-api", message: "Job published: job_8821 'Senior Engineer' by employer emp_421", traceId: "tx_8754" },
  { id: "log_11", timestamp: "2024-09-21T10:32:04Z", level: "WARN", service: "auth-service", message: "5 consecutive failed login attempts for usr_4822 — account locked 15m", traceId: "tx_8748" },
  { id: "log_12", timestamp: "2024-09-21T10:30:18Z", level: "INFO", service: "training-api", message: "Certificate generated for learner lrn_221 (course crs_42)", traceId: "tx_8738" },
];

const ERROR_SPIKES = [
  { service: "payment-service", last1h: 14, last24h: 42, trend: "up" },
  { service: "search-service", last1h: 8, last24h: 22, trend: "up" },
  { service: "notification-service", last1h: 4, last24h: 18, trend: "down" },
];

const RETENTION = [
  { tier: "Hot (Elasticsearch)", period: "7 days", storage: "84 GB", status: "ok" },
  { tier: "Warm (S3)", period: "90 days", storage: "412 GB", status: "ok" },
  { tier: "Cold (Glacier)", period: "1 year", storage: "1.8 TB", status: "ok" },
];

export function SuperAdminLogAggregation() {
  const [level, setLevel] = React.useState("all");
  const [service, setService] = React.useState("all");
  const [q, setQ] = React.useState("");

  const filtered = LOGS.filter(l =>
    (level === "all" || l.level === level) &&
    (service === "all" || l.service === service) &&
    (q === "" || (l.message + l.service + (l.traceId ?? "")).toLowerCase().includes(q.toLowerCase()))
  );

  const errorCount = LOGS.filter(l => l.level === "ERROR" || l.level === "FATAL").length;
  const warnCount = LOGS.filter(l => l.level === "WARN").length;

  const levelBadge = (lv: LogEntry["level"]) => {
    const cls = lv === "INFO" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : lv === "WARN" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : lv === "ERROR" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{lv}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log Aggregation"
        description="Centralized logs across all services — filter by level (INFO/WARN/ERROR/FATAL), service, time range, and full-text search. Error spike detection, retention status, and log export."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Export Logs", variant: "outline", onClick: () => toast.success("Log archive exported (JSONL)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Logs (1h)" value="42.8K" icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Errors+Fatal" value={errorCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Warnings" value={warnCount} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Services Tracked" value={SERVICES.length} icon={<Icon name="Network" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Filters" description="Filter logs by level, service, or keyword">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "INFO", "WARN", "ERROR", "FATAL"].map(l => <SelectItem key={l} value={l}>{l === "all" ? "All Levels" : l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Service</label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="message, traceId, service..." className="mt-1" />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Error Spike Detection" description="Services with rising error rates" className="lg:col-span-1">
          <div className="space-y-2">
            {ERROR_SPIKES.map(s => (
              <div key={s.service} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium">{s.service}</span>
                  <Icon name={s.trend === "up" ? "TrendingUp" : "TrendingDown"} className={`h-4 w-4 ${s.trend === "up" ? "text-rose-500" : "text-emerald-500"}`} />
                </div>
                <div className="mt-2 flex gap-3 text-xs">
                  <div><p className="text-muted-foreground">1h</p><p className={`font-medium ${s.last1h > 10 ? "text-rose-600" : ""}`}>{s.last1h} errors</p></div>
                  <div><p className="text-muted-foreground">24h</p><p className="font-medium">{s.last24h} errors</p></div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Log Stream" description={`${filtered.length} entries`} className="lg:col-span-2" contentClassName="p-0">
          <div className="max-h-[480px] overflow-y-auto font-mono text-xs">
            {filtered.length === 0 ? (
              <EmptyState className="m-4" icon={<Icon name="Search" className="h-5 w-5" />} title="No logs match filters" />
            ) : (
              <div className="divide-y">
                {filtered.map(l => (
                  <div key={l.id} className="flex items-start gap-2 p-2 hover:bg-accent">
                    <span className="shrink-0 text-muted-foreground">{new Date(l.timestamp).toLocaleTimeString("en-IN")}</span>
                    <span className="shrink-0">{levelBadge(l.level)}</span>
                    <span className="shrink-0 text-brand">[{l.service}]</span>
                    <span className="flex-1 break-words text-foreground">{l.message}</span>
                    {l.traceId && <span className="shrink-0 text-muted-foreground">tx:{l.traceId}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Log Retention" description="Storage tiers and retention policy">
        <div className="grid gap-3 md:grid-cols-3">
          {RETENTION.map(r => (
            <div key={r.tier} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{r.tier}</span>
                <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">{r.status}</Badge>
              </div>
              <p className="mt-1 text-sm font-semibold">{r.period}</p>
              <p className="text-[10px] text-muted-foreground">{r.storage} used</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-3" onClick={() => toast.success("Retention policy updated")}>Configure Retention</Button>
      </SectionCard>
    </div>
  );
}
