"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Cookie {
  id: string; name: string; provider: string; category: "Necessary" | "Analytics" | "Marketing" | "Functional"; expiry: string; thirdParty: boolean; consentRequired: boolean; consentRate: number; status: "active" | "blocked" | "review";
}

const COOKIES: Cookie[] = [
  { id: "CK-001", name: "__session", provider: "jobson.id", category: "Necessary", expiry: "Session", thirdParty: false, consentRequired: false, consentRate: 100, status: "active" },
  { id: "CK-002", name: "__csrf", provider: "jobson.id", category: "Necessary", expiry: "1 hour", thirdParty: false, consentRequired: false, consentRate: 100, status: "active" },
  { id: "CK-003", name: "_ga", provider: "Google Analytics", category: "Analytics", expiry: "2 years", thirdParty: true, consentRequired: true, consentRate: 78, status: "active" },
  { id: "CK-004", name: "_gid", provider: "Google Analytics", category: "Analytics", expiry: "24 hours", thirdParty: true, consentRequired: true, consentRate: 78, status: "active" },
  { id: "CK-005", name: "_fbp", provider: "Meta Pixel", category: "Marketing", expiry: "90 days", thirdParty: true, consentRequired: true, consentRate: 52, status: "active" },
  { id: "CK-006", name: "IDE", provider: "Doubleclick", category: "Marketing", expiry: "1 year", thirdParty: true, consentRequired: true, consentRate: 52, status: "blocked" },
  { id: "CK-007", name: "lang", provider: "LinkedIn", category: "Functional", expiry: "Session", thirdParty: true, consentRequired: true, consentRate: 64, status: "active" },
  { id: "CK-008", name: "_gcl_au", provider: "Google Ads", category: "Marketing", expiry: "90 days", thirdParty: true, consentRequired: true, consentRate: 52, status: "review" },
];

const PAGE_AUDIT = [
  { page: "/", total: 4, necessary: 2, analytics: 1, marketing: 1, compliant: true },
  { page: "/jobs", total: 5, necessary: 2, analytics: 1, marketing: 2, compliant: true },
  { page: "/employer/dashboard", total: 6, necessary: 3, analytics: 1, marketing: 2, compliant: true },
  { page: "/candidate/profile", total: 5, necessary: 2, analytics: 1, marketing: 2, compliant: false },
  { page: "/partner/apply", total: 3, necessary: 2, analytics: 1, marketing: 0, compliant: true },
];

export function SuperAdminCookieCompliance() {
  const active = COOKIES.filter(c => c.status === "active");
  const thirdParty = COOKIES.filter(c => c.thirdParty);
  const blocked = COOKIES.filter(c => c.status === "blocked");
  const review = COOKIES.filter(c => c.status === "review");
  const compliantPages = PAGE_AUDIT.filter(p => p.compliant).length;

  const catBadge = (c: string) => {
    const cls = c === "Necessary" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : c === "Analytics" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : c === "Marketing" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-violet-500/15 text-violet-700 border-violet-500/30";
    return <Badge variant="outline" className={cls}>{c}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "blocked" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cookie Compliance"
        description="All cookies used, category, consent requirement, expiry, third-party status, and GDPR per-page audit."
        icon={<Icon name="Cookie" className="h-6 w-6" />}
        actions={[
          { label: "Scan Pages", variant: "outline", onClick: () => toast.success("Cookie scan started across all 184 pages") },
          { label: "Update Banner", onClick: () => toast.info("Opening consent banner editor") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Cookies" value={active.length} icon={<Icon name="Cookie" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Third-Party" value={thirdParty.length} icon={<Icon name="ExternalLink" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Blocked" value={blocked.length} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Pages Compliant" value={`${compliantPages}/${PAGE_AUDIT.length}`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Cookie Inventory" description="All cookies with category & consent status" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Third-Party</TableHead>
              <TableHead>Consent Required</TableHead>
              <TableHead>Consent Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COOKIES.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell className="font-mono text-xs">{c.name}</TableCell>
                <TableCell className="text-xs">{c.provider}</TableCell>
                <TableCell>{catBadge(c.category)}</TableCell>
                <TableCell className="text-xs">{c.expiry}</TableCell>
                <TableCell>
                  {c.thirdParty
                    ? <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">yes</Badge>
                    : <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">no</Badge>}
                </TableCell>
                <TableCell>
                  {c.consentRequired
                    ? <Badge variant="outline" className="text-[10px]">required</Badge>
                    : <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">exempt</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress className="h-1.5 w-10" value={c.consentRate} />
                    <span className="text-xs">{c.consentRate}%</span>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${c.name} usage`)}>Inspect</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Per-Page Cookie Audit" description="GDPR cookie compliance per page">
          <ul className="space-y-2">
            {PAGE_AUDIT.map(p => (
              <li key={p.page} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{p.page}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{p.total} cookies</Badge>
                    {p.compliant
                      ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">compliant</Badge>
                      : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">violation</Badge>}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400">{p.necessary} necessary</span>
                  <span className="text-cyan-600 dark:text-cyan-400">· {p.analytics} analytics</span>
                  <span className="text-amber-600 dark:text-amber-400">· {p.marketing} marketing</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="GDPR Compliance Check" description="Regulatory readiness status">
          {review.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="All cookies reviewed" />
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 rounded-md border bg-card p-3">
                <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Consent banner present</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Shown on first visit, granular controls</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-md border bg-card p-3">
                <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Non-necessary blocked pre-consent</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Marketing/analytics cookies blocked until accepted</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-md border bg-card p-3">
                <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">{review.length} cookies pending review</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Need classification or consent verification</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-md border bg-card p-3">
                <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Cookie policy published</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">v2.4, last updated 2024-08-01</p>
                </div>
              </li>
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
