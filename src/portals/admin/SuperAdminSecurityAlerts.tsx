"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Alert {
  id: string; type: string; severity: "low" | "medium" | "high" | "critical"; user: string; ip: string; detail: string; at: string; status: "open" | "investigating" | "resolved";
}

const ALERTS: Alert[] = [
  { id: "alt_001", type: "failed_login_burst", severity: "high", user: "rohan@techcorp.com", ip: "198.51.100.7", detail: "12 failed login attempts in 5 min", at: "2024-09-21T09:42:00Z", status: "open" },
  { id: "alt_002", type: "mfa_bypass_attempt", severity: "critical", user: "aarav@jobson.id", ip: "198.51.100.22", detail: "MFA bypass via support channel attempt", at: "2024-09-21T08:30:00Z", status: "investigating" },
  { id: "alt_003", type: "suspicious_ip", severity: "medium", user: "sneha@talentbridge.in", ip: "203.0.113.180", detail: "Login from new geolocation (Russia)", at: "2024-09-21T07:15:00Z", status: "open" },
  { id: "alt_004", type: "credential_stuffing", severity: "critical", user: "multiple", ip: "198.51.100.40", detail: "Credential stuffing botnet detected", at: "2024-09-21T06:00:00Z", status: "investigating" },
  { id: "alt_005", type: "api_rate_abuse", severity: "high", user: "key_public_v2", ip: "198.51.100.55", detail: "API rate limit exceeded 40x in 1h", at: "2024-09-21T05:42:00Z", status: "open" },
  { id: "alt_006", type: "impossible_travel", severity: "medium", user: "meera@southzone.in", ip: "203.0.113.220", detail: "Login India + Brazil within 5 min", at: "2024-09-21T04:18:00Z", status: "resolved" },
  { id: "alt_007", type: "session_hijack_suspect", severity: "critical", user: "anika@techcorp.com", ip: "198.51.100.88", detail: "Session token reuse across IPs", at: "2024-09-20T22:08:00Z", status: "resolved" },
  { id: "alt_008", type: "failed_login_burst", severity: "low", user: "priya.nair@gmail.com", ip: "198.51.100.99", detail: "3 failed attempts (likely typo)", at: "2024-09-20T19:42:00Z", status: "resolved" },
];

export function SuperAdminSecurityAlerts() {
  const [severity, setSeverity] = React.useState("all");
  const filtered = ALERTS.filter(a => severity === "all" || a.severity === severity);

  const sevBadge = (s: string) => {
    const cls = s === "critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "high" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : s === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "resolved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "investigating" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const action = (id: string, action: string) => toast.success(`Alert ${id} ${action}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Alerts"
        description="Real-time alerts: failed logins, MFA bypass, suspicious IPs, credential stuffing, session hijacks."
        icon={<Icon name="AlertTriangle" className="h-6 w-6" />}
        actions={[{ label: "Threat Intel Feed", variant: "outline", onClick: () => toast.info("Opening threat intel") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open Alerts" value={ALERTS.filter(a => a.status === "open").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Investigating" value={ALERTS.filter(a => a.status === "investigating").length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Critical (24h)" value={ALERTS.filter(a => a.severity === "critical").length} icon={<Icon name="Shield" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Auto-Blocked IPs" value="42" icon={<Icon name="Lock" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Alert Feed" description={`${filtered.length} alerts`}>
        <div className="mb-3 flex items-center justify-end">
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className={`rounded-lg border bg-card p-3 ${a.status === "open" && a.severity === "critical" ? "border-rose-500/40" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon
                    name={a.severity === "critical" || a.severity === "high" ? "AlertTriangle" : "AlertCircle"}
                    className={`mt-0.5 h-4 w-4 ${a.severity === "critical" ? "text-rose-500" : a.severity === "high" ? "text-orange-500" : a.severity === "medium" ? "text-amber-500" : "text-slate-500"}`}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{a.type.replace(/_/g, " ")}</span>
                      {sevBadge(a.severity)}
                      {statusBadge(a.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      User: <span className="font-mono">{a.user}</span> • IP: <span className="font-mono">{a.ip}</span> • {timeAgo(a.at)}
                    </div>
                  </div>
                </div>
                {a.status !== "resolved" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => action(a.id, "investigating")}>Investigate</Button>
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => action(a.id, "blocked")}>Block IP</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => action(a.id, "resolved")}>Resolve</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
