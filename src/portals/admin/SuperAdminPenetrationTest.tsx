"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Finding {
  id: string; title: string; severity: "Critical" | "High" | "Medium" | "Low"; exploitability: "Easy" | "Moderate" | "Difficult"; cvss: number; status: "open" | "remediation" | "fixed"; assignee: string; target: string;
}

interface PenTest {
  id: string; name: string; tester: string; startDate: string; endDate: string; scope: string; findings: number; status: "scheduled" | "in_progress" | "completed" | "report_due";
}

const FINDINGS: Finding[] = [
  { id: "PEN-F-021", title: "IDOR on /api/users/{id} — auth bypass", severity: "Critical", exploitability: "Easy", cvss: 9.4, status: "remediation", assignee: "Rohit S.", target: "auth-service" },
  { id: "PEN-F-020", title: "Stored XSS in job description field", severity: "High", exploitability: "Moderate", cvss: 8.1, status: "remediation", assignee: "Anita R.", target: "employer-portal" },
  { id: "PEN-F-019", title: "CSRF on payout approval endpoint", severity: "High", exploitability: "Easy", cvss: 7.8, status: "fixed", assignee: "Rohit S.", target: "payment-service" },
  { id: "PEN-F-018", title: "Rate limit missing on /auth/login", severity: "Medium", exploitability: "Easy", cvss: 6.4, status: "fixed", assignee: "Anita R.", target: "auth-service" },
  { id: "PEN-F-017", title: "Verbose error discloses stack trace", severity: "Low", exploitability: "Difficult", cvss: 3.8, status: "open", assignee: "Unassigned", target: "api-gateway" },
  { id: "PEN-F-016", title: "Insecure deserialization in file upload", severity: "High", exploitability: "Moderate", cvss: 7.6, status: "open", assignee: "Unassigned", target: "candidate-portal" },
];

const PEN_TESTS: PenTest[] = [
  { id: "PEN-2024-Q3", name: "Q3 2024 External Pentest", tester: "SecureWorks", startDate: "2024-09-15", endDate: "2024-09-22", scope: "All public endpoints + auth", findings: 6, status: "report_due" },
  { id: "PEN-2024-Q2", name: "Q2 2024 Internal Pentest", tester: "Deloitte", startDate: "2024-06-10", endDate: "2024-06-20", scope: "Internal network + admin portal", findings: 4, status: "completed" },
  { id: "PEN-2024-Q1", name: "Q1 2024 API Pentest", tester: "BugBounty.io", startDate: "2024-03-01", endDate: "2024-03-15", scope: "REST API + GraphQL", findings: 8, status: "completed" },
  { id: "PEN-2024-Q4", name: "Q4 2024 Red Team", tester: "Mandiant", startDate: "2024-12-01", endDate: "2024-12-15", scope: "Full-scope red team", findings: 0, status: "scheduled" },
];

const STANDARDS = [
  { name: "OWASP Top 10 (2021)", testsRun: 10, passing: 9, status: "compliant" },
  { name: "OWASP API Top 10", testsRun: 10, passing: 8, status: "remediation" },
  { name: "PCI-DSS 6.5", testsRun: 8, passing: 8, status: "compliant" },
  { name: "ISO 27001 A.14", testsRun: 12, passing: 11, status: "remediation" },
  { name: "SANS Top 25", testsRun: 25, passing: 23, status: "remediation" },
];

export function SuperAdminPenetrationTest() {
  const open = FINDINGS.filter(f => f.status === "open");
  const fixed = FINDINGS.filter(f => f.status === "fixed");
  const critical = FINDINGS.filter(f => f.severity === "Critical" && f.status !== "fixed");

  const sevBadge = (s: string) => {
    const cls = s === "Critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "High" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : s === "Medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "fixed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "remediation" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const testStatusBadge = (s: string) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "in_progress" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "report_due" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penetration Testing"
        description="Scheduled pen tests, findings, exploitability, remediation status, and security standards compliance."
        icon={<Icon name="Crosshair" className="h-6 w-6" />}
        actions={[
          { label: "Schedule Test", variant: "outline", onClick: () => toast.info("Opening test scheduling form") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open Findings" value={open.length} icon={<Icon name="Crosshair" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Critical Open" value={critical.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Fixed (90d)" value={fixed.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Tests This Year" value={PEN_TESTS.length} icon={<Icon name="CalendarCheck2" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Pen Test Findings" description="Latest findings with exploitability & remediation" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Finding</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>CVSS</TableHead>
              <TableHead>Exploitability</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FINDINGS.map(f => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.id}</TableCell>
                <TableCell className="text-xs max-w-xs">{f.title}</TableCell>
                <TableCell>{sevBadge(f.severity)}</TableCell>
                <TableCell>
                  <span className={`text-sm font-bold ${f.cvss >= 9 ? "text-rose-600 dark:text-rose-400" : f.cvss >= 7 ? "text-orange-600 dark:text-orange-400" : f.cvss >= 4 ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>{f.cvss}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={f.exploitability === "Easy" ? "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]" : f.exploitability === "Moderate" ? "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]" : "bg-slate-500/15 text-slate-700 border-slate-500/30 text-[10px]"}>{f.exploitability}</Badge>
                </TableCell>
                <TableCell className="text-xs">{f.target}</TableCell>
                <TableCell className="text-xs">{f.assignee}</TableCell>
                <TableCell>{statusBadge(f.status)}</TableCell>
                <TableCell>
                  {f.status !== "fixed" ? (
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Remediation started for ${f.id}`)}>Remediate</Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Viewing ${f.id} patch verification`)}>Verify</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Test History & Schedule" description="Past and upcoming pen tests">
          <ul className="space-y-2">
            {PEN_TESTS.map(p => (
              <li key={p.id} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.tester} · {formatDate(p.startDate)} → {formatDate(p.endDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.findings > 0 && <Badge variant="outline" className="text-[10px]">{p.findings} findings</Badge>}
                    {testStatusBadge(p.status)}
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">Scope: {p.scope}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Security Standards Compliance" description="Tests mapped to industry standards">
          {STANDARDS.length === 0 ? (
            <EmptyState icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No standards tracked" />
          ) : (
            <ul className="space-y-2">
              {STANDARDS.map(s => {
                const pct = (s.passing / s.testsRun) * 100;
                return (
                  <li key={s.name} className="rounded-md border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{s.name}</span>
                      <Badge variant="outline" className={s.status === "compliant" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]"}>{s.status}</Badge>
                    </div>
                    <Progress className="mt-2 h-1.5" value={pct} />
                    <p className="mt-1 text-[10px] text-muted-foreground">{s.passing} / {s.testsRun} tests passing</p>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Tester Reports" description="Submitted pen test reports">
        <ul className="space-y-2 text-sm">
          {PEN_TESTS.filter(p => p.status === "completed" || p.status === "report_due").map(p => (
            <li key={p.id} className="flex items-center justify-between rounded-md border bg-card p-3">
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="h-4 w-4 text-brand" />
                <div>
                  <p className="font-medium">{p.name} — Report</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">By {p.tester}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success(`Downloading ${p.id} report`)}>Download</Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
