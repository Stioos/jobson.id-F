"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

const CONSENTS = [
  { id: "con_001", user: "Priya Nair", email: "priya.nair@gmail.com", scopes: ["marketing", "analytics"], grantedAt: "2024-08-12T10:00:00Z", status: "active" },
  { id: "con_002", user: "Rohan Mehta", email: "rohan@techcorp.com", scopes: ["marketing", "analytics", "third_party"], grantedAt: "2024-07-04T08:00:00Z", status: "active" },
  { id: "con_003", user: "Sneha Reddy", email: "sneha@talentbridge.in", scopes: ["analytics"], grantedAt: "2024-06-22T12:00:00Z", status: "withdrawn" },
  { id: "con_004", user: "Meera Joshi", email: "meera@southzone.in", scopes: ["marketing"], grantedAt: "2024-09-01T15:00:00Z", status: "active" },
  { id: "con_005", user: "Anika Verma", email: "anika@techcorp.com", scopes: ["marketing", "analytics", "third_party", "profiling"], grantedAt: "2024-08-30T11:00:00Z", status: "active" },
];

const DSARS = [
  { id: "dsar_001", user: "Vikram Singh", email: "vikram@naukrix.com", type: "Export", status: "pending", requestedAt: "2024-09-21T07:42:00Z", sla: "72h" },
  { id: "dsar_002", user: "Deepa Sharma", email: "deepa.sharma@gmail.com", type: "Erase", status: "in_progress", requestedAt: "2024-09-20T14:30:00Z", sla: "30d" },
  { id: "dsar_003", user: "Karthik Menon", email: "karthik.m@gmail.com", type: "Export", status: "completed", requestedAt: "2024-09-18T09:00:00Z", sla: "72h" },
  { id: "dsar_004", user: "Aishwarya R", email: "aishwarya@apexrecruit.in", type: "Rectify", status: "completed", requestedAt: "2024-09-15T11:00:00Z", sla: "30d" },
  { id: "dsar_005", user: "Sumeet Patil", email: "sumeet@apexrecruit.in", type: "Object", status: "rejected", requestedAt: "2024-09-10T16:00:00Z", sla: "30d" },
];

export function SuperAdminPrivacy() {
  const statusBadge = (s: string) => {
    const cls = s === "active" || s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" || s === "in_progress" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "withdrawn" ? "bg-muted text-muted-foreground"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const openDsars = DSARS.filter(d => d.status === "pending" || d.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Privacy"
        description="DPDP/GDPR consent registry and DSAR (Data Subject Access Request) fulfillment queue."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Privacy Policy", variant: "outline", onClick: () => toast.info("Opening policy editor") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Consent Records" value={CONSENTS.length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Consents" value={CONSENTS.filter(c => c.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Withdrawn" value={CONSENTS.filter(c => c.status === "withdrawn").length} icon={<Icon name="X" className="h-5 w-5" />} />
        <StatCard label="Open DSARs" value={openDsars} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Consent Registry" description="Per-user consent scopes" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>Granted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONSENTS.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.user}</TableCell>
                <TableCell className="text-xs">{c.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.scopes.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{timeAgo(c.grantedAt)}</TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${c.user} consent ledger`)}>Ledger</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="DSAR Queue" description="Data Subject Access Requests" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DSAR ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DSARS.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.id}</TableCell>
                <TableCell className="font-medium">{d.user}</TableCell>
                <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
                <TableCell className="text-xs">{formatDateTime(d.requestedAt)}</TableCell>
                <TableCell className="text-xs">{d.sla}</TableCell>
                <TableCell>{statusBadge(d.status)}</TableCell>
                <TableCell>
                  {(d.status === "pending" || d.status === "in_progress") && (
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Processing ${d.id}`)}>Process</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
