"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";

interface Log {
  id: string; ts: string; actor: string; action: string; portal: string; target: string; ip: string; outcome: "success" | "failure";
}

const LOGS: Log[] = [
  { id: "log_001", ts: "2024-09-21T09:55:42Z", actor: "aarav@jobson.id", action: "login", portal: "admin", target: "—", ip: "203.0.113.42", outcome: "success" },
  { id: "log_002", ts: "2024-09-21T09:42:18Z", actor: "rohan@techcorp.com", action: "invoice.download", portal: "employer", target: "INV-2024-0912", ip: "203.0.113.50", outcome: "success" },
  { id: "log_003", ts: "2024-09-21T09:30:04Z", actor: "unknown@x.com", action: "login.mfa_failed", portal: "candidate", target: "—", ip: "198.51.100.7", outcome: "failure" },
  { id: "log_004", ts: "2024-09-21T09:12:32Z", actor: "sneha@talentbridge.in", action: "payout.approve", portal: "recruiter", target: "PO-8817", ip: "203.0.113.88", outcome: "success" },
  { id: "log_005", ts: "2024-09-21T09:00:00Z", actor: "system", action: "cron.daily_gst", portal: "system", target: "—", ip: "127.0.0.1", outcome: "success" },
  { id: "log_006", ts: "2024-09-21T08:48:20Z", actor: "platform_admin", action: "api_key.rotate", portal: "admin", target: "key_internal_ro", ip: "203.0.113.42", outcome: "success" },
  { id: "log_007", ts: "2024-09-21T08:30:14Z", actor: "meera@southzone.in", action: "partner.apply", portal: "partner", target: "app_8821", ip: "203.0.113.110", outcome: "success" },
  { id: "log_008", ts: "2024-09-21T08:12:02Z", actor: "aarav@jobson.id", action: "impersonation.start", portal: "admin", target: "u_002 (Rohan Mehta)", ip: "203.0.113.42", outcome: "success" },
  { id: "log_009", ts: "2024-09-21T07:55:48Z", actor: "unknown@y.com", action: "login.brute_force", portal: "employer", target: "—", ip: "198.51.100.22", outcome: "failure" },
  { id: "log_010", ts: "2024-09-21T07:42:30Z", actor: "anika@techcorp.com", action: "candidate.view", portal: "employer", target: "c_001", ip: "203.0.113.60", outcome: "success" },
];

export function SuperAdminAudit() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("all");
  const [outcome, setOutcome] = React.useState("all");

  const filtered = LOGS.filter(l => {
    const s = search.toLowerCase();
    const m1 = !s || l.actor.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.target.toLowerCase().includes(s);
    const m2 = portal === "all" || l.portal === portal;
    const m3 = outcome === "all" || l.outcome === outcome;
    return m1 && m2 && m3;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Immutable, real-time trail of every privileged action across the platform."
        icon={<Icon name="ScrollText" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Audit log exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Events (24h)" value="14,820" icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Failures (24h)" value={LOGS.filter(l => l.outcome === "failure").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Privileged Actions" value="42" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} />
        <StatCard label="Retention" value="7 yrs" icon={<Icon name="Database" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Live Audit Feed" description={`${filtered.length} events matching filters`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actor, action, target…" className="h-9 max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Portal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Portals</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Outcome" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[32rem] space-y-2 overflow-y-auto rounded-md border bg-card p-3 pr-2">
          {filtered.map(l => (
            <div key={l.id} className="flex items-start gap-3 rounded-md border bg-background p-2.5 text-sm">
              <Icon
                name={l.outcome === "success" ? "CheckCircle2" : "AlertCircle"}
                className={`mt-0.5 h-4 w-4 ${l.outcome === "success" ? "text-emerald-500" : "text-rose-500"}`}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{l.actor}</span>
                  <Badge variant="outline" className="text-[10px]">{l.portal}</Badge>
                  <span className="text-muted-foreground">{l.action}</span>
                  {l.target !== "—" && <span className="text-xs">→ {l.target}</span>}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(l.ts)} • IP {l.ip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
