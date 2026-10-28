"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

interface Consent {
  id: string; user: string; email: string; portal: string; scopes: string[]; version: string; grantedAt: string; withdrawnAt?: string; status: "active" | "withdrawn" | "expired"; proof: string;
}

const CONSENTS: Consent[] = [
  { id: "C-9001", user: "Priya Nair", email: "priya.nair@gmail.com", portal: "candidate", scopes: ["terms", "privacy", "marketing", "cookies"], version: "v2.4", grantedAt: "2024-09-22T08:00:00Z", status: "active", proof: "Hash: 9af3...b21c" },
  { id: "C-9000", user: "Rohan Mehta", email: "rohan@techcorp.com", portal: "employer", scopes: ["terms", "privacy", "cookies"], version: "v2.4", grantedAt: "2024-09-21T11:00:00Z", status: "active", proof: "Hash: 9af3...b21d" },
  { id: "C-8999", user: "Sneha Reddy", email: "sneha@talentbridge.in", portal: "recruiter", scopes: ["terms", "privacy"], version: "v2.3", grantedAt: "2024-08-15T09:00:00Z", withdrawnAt: "2024-09-20T15:00:00Z", status: "withdrawn", proof: "Hash: 9af3...b21e" },
  { id: "C-8998", user: "Meera Joshi", email: "meera@southzone.in", portal: "partner", scopes: ["terms", "privacy", "marketing"], version: "v2.4", grantedAt: "2024-09-01T15:00:00Z", status: "active", proof: "Hash: 9af3...b21f" },
  { id: "C-8997", user: "Anika Verma", email: "anika@techcorp.com", portal: "employer", scopes: ["terms", "privacy", "marketing", "cookies", "profiling"], version: "v2.4", grantedAt: "2024-08-30T11:00:00Z", status: "active", proof: "Hash: 9af3...b220" },
  { id: "C-8996", user: "Vikram Singh", email: "vikram@naukrix.com", portal: "candidate", scopes: ["terms", "privacy"], version: "v2.2", grantedAt: "2024-06-22T12:00:00Z", status: "expired", proof: "Hash: 9af3...b221" },
];

const POLICIES = [
  { name: "Terms of Service", version: "v2.4", effective: "2024-08-01", users: 18420, accepted: 17986, rate: 97.6 },
  { name: "Privacy Policy", version: "v2.4", effective: "2024-08-01", users: 18420, accepted: 18104, rate: 98.3 },
  { name: "Cookie Policy", version: "v2.4", effective: "2024-08-01", users: 18420, accepted: 16840, rate: 91.4 },
  { name: "Marketing Consent", version: "v2.4", effective: "2024-08-01", users: 18420, accepted: 9420, rate: 51.1 },
];

export function SuperAdminConsentManagement() {
  const active = CONSENTS.filter(c => c.status === "active").length;
  const withdrawn = CONSENTS.filter(c => c.status === "withdrawn").length;
  const expired = CONSENTS.filter(c => c.status === "expired").length;
  const withdrawalRate = ((withdrawn + expired) / CONSENTS.length * 100).toFixed(1);

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "withdrawn" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consent Management"
        description="Per-user consent registry (terms, privacy, marketing, cookies) with version tracking and DPDP Act 2023 compliance."
        icon={<Icon name="HeartHandshake" className="h-6 w-6" />}
        actions={[
          { label: "Publish New Version", variant: "outline", onClick: () => toast.info("Opening policy version editor") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Consents" value={CONSENTS.length} icon={<Icon name="HeartHandshake" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={active} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Withdrawn (30d)" value={withdrawn} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Withdrawal Rate" value={`${withdrawalRate}%`} icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Consent Registry" description="Per-user consent with proof & version" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Granted</TableHead>
              <TableHead>Withdrawn</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONSENTS.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{c.user}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{c.portal}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.scopes.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{c.version}</TableCell>
                <TableCell className="text-xs">{timeAgo(c.grantedAt)}</TableCell>
                <TableCell className="text-xs">{c.withdrawnAt ? timeAgo(c.withdrawnAt) : "—"}</TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground">{c.proof}</TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${c.id} consent ledger`)}>Ledger</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Policy Versions" description="Current versions and acceptance rates">
        <ul className="space-y-3">
          {POLICIES.map(p => (
            <li key={p.name} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="FileText" className="h-4 w-4 text-brand" />
                  <span className="font-medium">{p.name}</span>
                  <Badge variant="outline" className="text-[10px]">{p.version}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">effective {p.effective}</span>
              </div>
              <Progress className="mt-2 h-1.5" value={p.rate} />
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{p.accepted.toLocaleString("en-IN")} / {p.users.toLocaleString("en-IN")} accepted</span>
                <span>{p.rate}%</span>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="DPDP Act 2023 Compliance" description="Digital Personal Data Protection Act readiness">
        {expired === 0 && withdrawn === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="Fully compliant" description="No compliance gaps." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Consent Re-affirmation</p>
              <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">12 months</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Required periodicity</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Withdrawal Mechanism</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Available</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Self-service via profile</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Consent Ledger</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Tamper-evident hashes</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs text-muted-foreground">Minor Consent</p>
              <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-400">Verified</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Parental gate active</p>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
