"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Cert {
  id: string;
  domain: string;
  issuer: string;
  issuedOn: string;
  expiresOn: string;
  daysLeft: number;
  autoRenew: boolean;
  chainValid: boolean;
  mixedContent: boolean;
}

const CERTS: Cert[] = [
  { id: "c_1", domain: "jobsonn.com", issuer: "Let's Encrypt R3", issuedOn: "2024-08-21", expiresOn: "2024-11-19", daysLeft: 59, autoRenew: true, chainValid: true, mixedContent: false },
  { id: "c_2", domain: "www.jobsonn.com", issuer: "Let's Encrypt R3", issuedOn: "2024-08-21", expiresOn: "2024-11-19", daysLeft: 59, autoRenew: true, chainValid: true, mixedContent: false },
  { id: "c_3", domain: "mail.jobsonn.com", issuer: "Let's Encrypt R3", issuedOn: "2024-08-10", expiresOn: "2024-11-08", daysLeft: 48, autoRenew: true, chainValid: true, mixedContent: false },
  { id: "c_4", domain: "promo.jobsonn.com", issuer: "Let's Encrypt R3", issuedOn: "2024-06-14", expiresOn: "2024-09-29", daysLeft: 8, autoRenew: false, chainValid: true, mixedContent: true },
  { id: "c_5", domain: "alerts.jobsonn.com", issuer: "DigiCert", issuedOn: "2024-04-22", expiresOn: "2024-09-26", daysLeft: 5, autoRenew: false, chainValid: true, mixedContent: false },
  { id: "c_6", domain: "partner.jobsonn.com", issuer: "Let's Encrypt R3", issuedOn: "2024-09-12", expiresOn: "2024-12-11", daysLeft: 81, autoRenew: true, chainValid: true, mixedContent: false },
  { id: "c_7", domain: "api.jobsonn.com", issuer: "Cloudflare Origin", issuedOn: "2024-07-04", expiresOn: "2034-07-01", daysLeft: 3650, autoRenew: true, chainValid: true, mixedContent: false },
  { id: "c_8", domain: "legacy.jobsonn.io", issuer: "Comodo", issuedOn: "2023-09-12", expiresOn: "2024-09-22", daysLeft: 1, autoRenew: false, chainValid: false, mixedContent: true },
];

export function SuperAdminSslCertificates() {
  const expiringSoon = CERTS.filter(c => c.daysLeft <= 30).length;
  const expired = CERTS.filter(c => c.daysLeft <= 0).length;
  const autoRenewCount = CERTS.filter(c => c.autoRenew).length;

  const daysBadge = (d: number) => {
    const cls = d > 30 ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : d > 7 ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{d} days</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SSL Certificates"
        description="All SSL/TLS certificates — issuer, issue/expiry dates, days remaining, auto-renewal status, certificate chain validation, and mixed content checks."
        icon={<Icon name="Lock" className="h-6 w-6" />}
        actions={[{ label: "Renew All Eligible", variant: "outline", onClick: () => toast.success("Renewal triggered for all auto-renew eligible certs") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Certificates" value={CERTS.length} icon={<Icon name="Lock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Auto-Renew" value={autoRenewCount} icon={<Icon name="RefreshCw" className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring ≤30d" value={expiringSoon} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expired" value={expired} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Expiring Soon" description="Certificates requiring immediate action" contentClassName="p-0">
        {expiringSoon === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No certificates expiring soon" />
        ) : (
          <div className="divide-y">
            {CERTS.filter(c => c.daysLeft <= 30).map(c => (
              <div key={c.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Icon name={c.daysLeft <= 7 ? "AlertCircle" : "AlertTriangle"} className={`mt-0.5 h-5 w-5 ${c.daysLeft <= 7 ? "text-rose-500" : "text-amber-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-mono">{c.domain}</span>
                      {daysBadge(c.daysLeft)}
                      {!c.autoRenew && <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/30 text-[10px]">auto-renew off</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Issued by {c.issuer} • Expires {c.expiresOn}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Renewal triggered: ${c.domain}`)}>Renew Now</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="All Certificates" description="Full certificate inventory" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Auto-Renew</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead>Mixed Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CERTS.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs font-medium">{c.domain}</TableCell>
                <TableCell className="text-xs">{c.issuer}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.issuedOn}</TableCell>
                <TableCell className="text-xs">{c.expiresOn}</TableCell>
                <TableCell>{daysBadge(c.daysLeft)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toast.success(`Auto-renew ${c.autoRenew ? "disabled" : "enabled"}: ${c.domain}`)}>
                    <span className={c.autoRenew ? "text-emerald-600" : "text-muted-foreground"}>{c.autoRenew ? "ON" : "OFF"}</span>
                  </Button>
                </TableCell>
                <TableCell>
                  <Icon name={c.chainValid ? "CheckCircle2" : "AlertCircle"} className={`h-4 w-4 ${c.chainValid ? "text-emerald-500" : "text-rose-500"}`} />
                </TableCell>
                <TableCell>
                  <Icon name={!c.mixedContent ? "CheckCircle2" : "AlertTriangle"} className={`h-4 w-4 ${!c.mixedContent ? "text-emerald-500" : "text-amber-500"}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
