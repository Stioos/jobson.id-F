"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Domain {
  domain: string;
  spf: "pass" | "fail" | "none";
  dkim: "pass" | "fail" | "none";
  dmarc: "pass" | "fail" | "none" | "quarantine";
  bounceRate: number;
  complaintRate: number;
  inboxPlacement: number;
  reputation: "high" | "medium" | "low";
  volume: number;
}

const DOMAINS: Domain[] = [
  { domain: "jobsonn.com", spf: "pass", dkim: "pass", dmarc: "pass", bounceRate: 1.2, complaintRate: 0.08, inboxPlacement: 98.4, reputation: "high", volume: 184_000 },
  { domain: "mail.jobsonn.com", spf: "pass", dkim: "pass", dmarc: "pass", bounceRate: 1.8, complaintRate: 0.12, inboxPlacement: 96.2, reputation: "high", volume: 92_400 },
  { domain: "alerts.jobsonn.com", spf: "pass", dkim: "pass", dmarc: "quarantine", bounceRate: 3.4, complaintRate: 0.21, inboxPlacement: 92.1, reputation: "medium", volume: 48_200 },
  { domain: "promo.jobsonn.com", spf: "pass", dkim: "fail", dmarc: "none", bounceRate: 8.4, complaintRate: 0.62, inboxPlacement: 71.8, reputation: "low", volume: 22_400 },
  { domain: "partner.jobsonn.com", spf: "pass", dkim: "pass", dmarc: "pass", bounceRate: 2.1, complaintRate: 0.14, inboxPlacement: 95.4, reputation: "high", volume: 18_900 },
];

const ISSUES = [
  { id: "iss_1", domain: "promo.jobsonn.com", severity: "urgent", issue: "DKIM signature failing — emails landing in spam at Gmail (44%) and Outlook (62%).", at: "2024-09-21T06:00:00Z" },
  { id: "iss_2", domain: "alerts.jobsonn.com", severity: "warning", issue: "DMARC policy set to quarantine — 8% of legitimate mail being quarantined at Yahoo.", at: "2024-09-20T14:00:00Z" },
  { id: "iss_3", domain: "promo.jobsonn.com", severity: "warning", issue: "Complaint rate 0.62% exceeds 0.5% threshold — sender reputation declining.", at: "2024-09-19T09:00:00Z" },
];

const WARMUP = [
  { ip: "103.21.x.x", domain: "mail.jobsonn.com", day: 4, dailyVolume: 4200, target: 12000, reputation: "warming" },
  { ip: "103.21.x.y", domain: "alerts.jobsonn.com", day: 12, dailyVolume: 18000, target: 18000, reputation: "warm" },
];

export function SuperAdminEmailDeliverability() {
  const avgInbox = (DOMAINS.reduce((s, d) => s + d.inboxPlacement, 0) / DOMAINS.length).toFixed(1);
  const totalBounces = DOMAINS.reduce((s, d) => s + (d.bounceRate * d.volume) / 100, 0);
  const repBadge = (r: Domain["reputation"]) => {
    const cls = r === "high" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : r === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{r}</Badge>;
  };
  const authBadge = (v: Domain["spf"]) => {
    const cls = v === "pass" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : v === "fail" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-slate-500/15 text-slate-600 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{v}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Deliverability"
        description="SPF, DKIM, DMARC health, bounce/complaint rates, inbox placement, sender reputation, and IP warmup tracking — per sending domain."
        icon={<Icon name="MailCheck" className="h-6 w-6" />}
        actions={[{ label: "Run DNS Check", variant: "outline", onClick: () => toast.success("DNS check queued for all domains") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Inbox Placement" value={`${avgInbox}%`} icon={<Icon name="MailCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Bounces (24h)" value={Math.round(totalBounces).toLocaleString("en-IN")} icon={<Icon name="MailX" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Complaint Rate" value="0.14%" icon={<Icon name="AlertTriangle" className="h-5 w-5" />} />
        <StatCard label="Domains Tracked" value={DOMAINS.length} icon={<Icon name="Globe" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Deliverability Issues" description="Active issues requiring attention" contentClassName="p-0">
        {ISSUES.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No active issues" />
        ) : (
          <div className="divide-y">
            {ISSUES.map(i => (
              <div key={i.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Icon name={i.severity === "urgent" ? "AlertTriangle" : "AlertCircle"} className={`mt-0.5 h-5 w-5 ${i.severity === "urgent" ? "text-rose-500" : "text-amber-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{i.domain}</span>
                      <Badge variant="outline" className={i.severity === "urgent" ? "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]" : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]"}>{i.severity}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{i.issue}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Remediation started for ${i.domain}`)}>Fix</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Per-Domain Breakdown" description="Authentication, rates, and reputation" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>SPF</TableHead>
              <TableHead>DKIM</TableHead>
              <TableHead>DMARC</TableHead>
              <TableHead>Bounce</TableHead>
              <TableHead>Complaint</TableHead>
              <TableHead>Inbox</TableHead>
              <TableHead>Reputation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DOMAINS.map(d => (
              <TableRow key={d.domain}>
                <TableCell className="font-medium">{d.domain}</TableCell>
                <TableCell>{authBadge(d.spf)}</TableCell>
                <TableCell>{authBadge(d.dkim)}</TableCell>
                <TableCell>{authBadge(d.dmarc)}</TableCell>
                <TableCell className={`text-xs ${d.bounceRate > 5 ? "text-rose-600 font-medium" : ""}`}>{d.bounceRate}%</TableCell>
                <TableCell className={`text-xs ${d.complaintRate > 0.5 ? "text-rose-600 font-medium" : ""}`}>{d.complaintRate}%</TableCell>
                <TableCell className={`text-xs font-medium ${d.inboxPlacement >= 95 ? "text-emerald-600" : d.inboxPlacement >= 85 ? "text-amber-600" : "text-rose-600"}`}>{d.inboxPlacement}%</TableCell>
                <TableCell>{repBadge(d.reputation)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="IP Warmup Status" description="Dedicated IPs being warmed up">
        <div className="space-y-3">
          {WARMUP.map(w => {
            const pct = Math.round((w.dailyVolume / w.target) * 100);
            return (
              <div key={w.ip} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Server" className="h-4 w-4 text-brand" />
                    <span className="font-mono text-xs">{w.ip}</span>
                    <Badge variant="outline" className="text-[10px]">{w.domain}</Badge>
                  </div>
                  <Badge variant="outline" className={w.reputation === "warm" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>{w.reputation}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Day {w.day}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-medium">{w.dailyVolume.toLocaleString("en-IN")} / {w.target.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
