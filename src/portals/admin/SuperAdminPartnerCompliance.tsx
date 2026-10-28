"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface CompliancePartner {
  id: string;
  name: string;
  region: string;
  metrics: {
    mou: boolean;
    taxFiling: boolean;
    kyc: boolean;
    branding: boolean;
    audit: boolean;
    certification: boolean;
  };
  score: number;
  status: "compliant" | "at-risk" | "non-compliant";
  lastAudit: string;
}

const PARTNERS: CompliancePartner[] = [
  { id: "p_1", name: "Partner North Pvt Ltd", region: "North", metrics: { mou: true, taxFiling: true, kyc: true, branding: true, audit: true, certification: true }, score: 100, status: "compliant", lastAudit: "2024-09-12" },
  { id: "p_2", name: "South Talent Solutions", region: "South", metrics: { mou: true, taxFiling: true, kyc: true, branding: true, audit: false, certification: true }, score: 84, status: "at-risk", lastAudit: "2024-08-22" },
  { id: "p_3", name: "West Skill Hub", region: "West", metrics: { mou: true, taxFiling: false, kyc: true, branding: true, audit: false, certification: false }, score: 56, status: "non-compliant", lastAudit: "2024-07-14" },
  { id: "p_4", name: "East Career Network", region: "East", metrics: { mou: true, taxFiling: true, kyc: true, branding: false, audit: true, certification: true }, score: 88, status: "compliant", lastAudit: "2024-09-04" },
  { id: "p_5", name: "Central Skills Pvt Ltd", region: "Central", metrics: { mou: true, taxFiling: true, kyc: false, branding: false, audit: false, certification: false }, score: 42, status: "non-compliant", lastAudit: "2024-06-18" },
  { id: "p_6", name: "North East Talent Co.", region: "East", metrics: { mou: true, taxFiling: true, kyc: true, branding: true, audit: true, certification: false }, score: 92, status: "compliant", lastAudit: "2024-09-18" },
];

const RECOMMENDATIONS = [
  { partner: "West Skill Hub", priority: "urgent", action: "File pending GSTR-3B for Q1 FY24-25 (overdue by 42 days)" },
  { partner: "West Skill Hub", priority: "high", action: "Complete annual audit (due: 30 Sep 2024)" },
  { partner: "Central Skills Pvt Ltd", priority: "urgent", action: "Submit KYC documents (PAN + GST + bank proof)" },
  { partner: "Central Skills Pvt Ltd", priority: "high", action: "Renew NSDC certification (expired 4 months ago)" },
  { partner: "South Talent Solutions", priority: "medium", action: "Schedule annual audit before Q4 cutoff" },
  { partner: "Central Skills Pvt Ltd", priority: "medium", action: "Update branding guidelines to match platform standards" },
];

export function SuperAdminPartnerCompliance() {
  const compliant = PARTNERS.filter(p => p.status === "compliant").length;
  const atRisk = PARTNERS.filter(p => p.status === "at-risk").length;
  const nonCompliant = PARTNERS.filter(p => p.status === "non-compliant").length;
  const avgScore = Math.round(PARTNERS.reduce((s, p) => s + p.score, 0) / PARTNERS.length);

  const statusBadge = (s: CompliancePartner["status"]) => {
    const cls = s === "compliant" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "at-risk" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const metricIcon = (ok: boolean) => (
    <Icon name={ok ? "CheckCircle2" : "AlertCircle"} className={`h-4 w-4 ${ok ? "text-emerald-500" : "text-rose-500"}`} />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Compliance"
        description="Partner compliance scorecard — MoU, tax filing, KYC, branding, audit, and certification metrics per partner. Compliance score, non-compliant partner list, and action recommendations."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Schedule Audit", variant: "outline", onClick: () => toast.success("Audit cycle scheduled for all partners") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Compliance Score" value={`${avgScore}%`} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone={avgScore >= 80 ? "success" : "warning"} />
        <StatCard label="Compliant" value={compliant} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="At Risk" value={atRisk} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Non-Compliant" value={nonCompliant} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Compliance Scorecard" description="Per-partner compliance metrics" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>MoU</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead>Branding</TableHead>
              <TableHead>Audit</TableHead>
              <TableHead>Cert.</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PARTNERS.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-xs">{p.region}</TableCell>
                <TableCell>{metricIcon(p.metrics.mou)}</TableCell>
                <TableCell>{metricIcon(p.metrics.taxFiling)}</TableCell>
                <TableCell>{metricIcon(p.metrics.kyc)}</TableCell>
                <TableCell>{metricIcon(p.metrics.branding)}</TableCell>
                <TableCell>{metricIcon(p.metrics.audit)}</TableCell>
                <TableCell>{metricIcon(p.metrics.certification)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${p.score >= 85 ? "bg-emerald-500" : p.score >= 65 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${p.score}%` }} />
                    </div>
                    <span className="text-xs font-medium">{p.score}%</span>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(p.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Non-Compliant Partners" description="Partners requiring action" contentClassName="p-0">
        {nonCompliant === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="All partners compliant" />
        ) : (
          <div className="divide-y">
            {PARTNERS.filter(p => p.status !== "compliant").map(p => {
              const failed = Object.entries(p.metrics).filter(([, v]) => !v).map(([k]) => k);
              return (
                <div key={p.id} className="flex items-start justify-between gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <Icon name={p.status === "non-compliant" ? "AlertTriangle" : "AlertCircle"} className={`mt-0.5 h-5 w-5 ${p.status === "non-compliant" ? "text-rose-500" : "text-amber-500"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{p.name}</span>
                        {statusBadge(p.status)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Failed: {failed.join(", ")} • Last audit: {p.lastAudit}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Compliance notice sent to ${p.name}`)}>Send Notice</Button>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Action Recommendations" description="Recommended actions per partner">
        <div className="space-y-2">
          {RECOMMENDATIONS.map((r, i) => {
            const cls = r.priority === "urgent" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
              : r.priority === "high" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
              : "bg-slate-500/15 text-slate-600 border-slate-500/30";
            return (
              <div key={i} className="flex items-center justify-between gap-3 rounded-md border bg-card p-3">
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" className="mt-0.5 h-4 w-4 text-amber-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.partner}</span>
                      <Badge variant="outline" className={`${cls} text-[10px]`}>{r.priority}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.action}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast.success(`Reminder sent to ${r.partner}`)}>Notify</Button>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
