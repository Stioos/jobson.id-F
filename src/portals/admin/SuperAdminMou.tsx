"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";

interface Mou {
  id: string; partner: string; template: string; signedOn: string; expiresOn: string; status: "active" | "expiring" | "expired" | "draft";
}

const TEMPLATES = [
  { id: "tpl_mou_001", name: "Standard Franchise MoU", version: "v3.2", lastUpdated: "2024-08-15" },
  { id: "tpl_mou_002", name: "College Partnership MoU", version: "v2.1", lastUpdated: "2024-07-20" },
  { id: "tpl_mou_003", name: "Affiliate Agreement", version: "v1.4", lastUpdated: "2024-09-01" },
  { id: "tpl_mou_004", name: "Corporate Referral MoU", version: "v1.0", lastUpdated: "2024-06-30" },
];

const MOUS: Mou[] = [
  { id: "mou_001", partner: "SouthZone Franchise", template: "Standard Franchise MoU", signedOn: "2023-09-01", expiresOn: "2025-08-31", status: "active" },
  { id: "mou_002", partner: "EduFirst Colleges", template: "College Partnership MoU", signedOn: "2023-12-15", expiresOn: "2025-12-31", status: "active" },
  { id: "mou_003", partner: "NorthStar Affiliates", template: "Affiliate Agreement", signedOn: "2023-06-30", expiresOn: "2025-06-30", status: "active" },
  { id: "mou_004", partner: "BangaloreLaunchpad", template: "Affiliate Agreement", signedOn: "2023-10-15", expiresOn: "2024-10-15", status: "expiring" },
  { id: "mou_005", partner: "Legacy Partner X", template: "Standard Franchise MoU", signedOn: "2022-09-01", expiresOn: "2024-08-31", status: "expired" },
  { id: "mou_006", partner: "MumbaiSkills Hub", template: "Standard Franchise MoU", signedOn: "2024-04-01", expiresOn: "2026-03-31", status: "active" },
];

export function SuperAdminMou() {
  const [body, setBody] = React.useState(`This Memorandum of Understanding ("MoU") is entered into between JOBSONN Pvt. Ltd. ("Platform") and {{partner_name}} ("Partner") effective {{effective_date}}.

1. SCOPE OF PARTNERSHIP
{{scope}}

2. REVENUE SPLIT
{{revenue_split}}

3. TERM & TERMINATION
{{term}}

4. CONFIDENTIALITY
{{confidentiality}}`);

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "expiring" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "expired" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const expiringCount = MOUS.filter(m => m.status === "expiring" || m.status === "expired").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="MoU Management"
        description="MoU template library, e-sign workflow, expiry tracking, and renewals."
        icon={<Icon name="FileSignature" className="h-6 w-6" />}
        actions={[{ label: "Bulk Renewal", variant: "outline", onClick: () => toast.success("Bulk renewal initiated") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active MoUs" value={MOUS.filter(m => m.status === "active").length} icon={<Icon name="FileSignature" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Expiring (<60d)" value={MOUS.filter(m => m.status === "expiring").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expired" value={MOUS.filter(m => m.status === "expired").length} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Templates" value={TEMPLATES.length} icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="MoU Templates" description="Reusable templates" className="lg:col-span-1">
          <ul className="space-y-2">
            {TEMPLATES.map(t => (
              <li key={t.id} className="rounded-md border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.version} • updated {formatDate(t.lastUpdated)}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success(`Editing ${t.name}`)}>Edit</Button>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-3 w-full" onClick={() => toast.info("Template builder opened")}>
            <Icon name="Plus" className="mr-1 h-4 w-4" /> New Template
          </Button>
        </SectionCard>

        <SectionCard title="Active MoUs" description={`${MOUS.length} agreements`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOUS.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.partner}</TableCell>
                  <TableCell className="text-xs">{m.template}</TableCell>
                  <TableCell className="text-xs">{formatDate(m.signedOn)}</TableCell>
                  <TableCell className="text-xs">{formatDate(m.expiresOn)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={daysUntil(m.expiresOn) < 60 ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : ""}>
                      {daysUntil(m.expiresOn) > 0 ? `${daysUntil(m.expiresOn)}d` : "expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>{statusBadge(m.status)}</TableCell>
                  <TableCell>
                    {m.status === "expiring" || m.status === "expired" ? (
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Renewal sent to ${m.partner}`)}>Renew</Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${m.id}`)}>View</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Template Editor" description="Edit MoU template body with merge fields">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="font-mono text-xs" />
        <div className="mt-2 flex gap-2">
          <Button onClick={() => toast.success("Template saved")}>Save Template</Button>
          <Button variant="outline" onClick={() => toast.success("E-sign workflow initiated")}>Send for E-sign</Button>
        </div>
      </SectionCard>
    </div>
  );
}
