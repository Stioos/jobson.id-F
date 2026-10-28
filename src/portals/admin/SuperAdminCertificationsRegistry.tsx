"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import { formatDate } from "@/lib/format";

interface Cert {
  id: string; recipient: string; course: string; provider: string; issued: string; validUntil: string; status: "valid" | "expired" | "expiring" | "revoked"; fraud: boolean;
}

const CERTS: Cert[] = [
  { id: "CERT-2024-008214", recipient: "Priya Nair", course: "Full Stack React Bootcamp", provider: "CodeCraft Bootcamp", issued: "2024-03-12", validUntil: "2027-03-12", status: "valid", fraud: false },
  { id: "CERT-2024-008215", recipient: "Rohan Mehta", course: "AWS Solutions Architect", provider: "CloudMaster Academy", issued: "2023-08-22", validUntil: "2024-08-22", status: "expired", fraud: false },
  { id: "CERT-2024-008216", recipient: "Sneha Reddy", course: "Data Science with Python", provider: "DataInsight Labs", issued: "2024-06-04", validUntil: "2025-12-04", status: "expiring", fraud: false },
  { id: "CERT-2024-008217", recipient: "Aarav Sharma", course: "Kubernetes for Beginners", provider: "CloudMaster Academy", issued: "2024-09-10", validUntil: "2027-09-10", status: "valid", fraud: false },
  { id: "CERT-2024-008218", recipient: "Anika Verma", course: "Sales Mastery Pro", provider: "SalesPro Trainers", issued: "2024-01-15", validUntil: "2025-01-15", status: "expiring", fraud: false },
  { id: "CERT-2024-008219", recipient: "Karthik Iyer", course: "Excel for Finance Pros", provider: "Apex Skill Academy", issued: "2022-11-30", validUntil: "2023-11-30", status: "revoked", fraud: true },
  { id: "CERT-2024-008220", recipient: "Meera Joshi", course: "Digital Marketing Mastery", provider: "SalesPro Trainers", issued: "2024-07-22", validUntil: "2027-07-22", status: "valid", fraud: false },
  { id: "CERT-2024-008221", recipient: "Vikram Singh", course: "Soft Skills for Leaders", provider: "SoftSkill Studio", issued: "2024-02-18", validUntil: "2025-02-18", status: "expiring", fraud: false },
  { id: "CERT-2024-008222", recipient: "Nisha Patel", course: "React Proficiency Test", provider: "CodeCraft Bootcamp", issued: "2024-08-30", validUntil: "2027-08-30", status: "valid", fraud: false },
  { id: "CERT-2024-008223", recipient: "Arjun Rao", course: "Backend Architect", provider: "Apex Skill Academy", issued: "2024-05-09", validUntil: "2027-05-09", status: "valid", fraud: true },
];

const VERIFICATION_STATS = [
  { label: "Verification Requests (30d)", value: "8,412", icon: "BadgeCheck", tone: "brand" as const },
  { label: "Success Rate", value: "94.2%", icon: "CheckCircle2", tone: "success" as const },
  { label: "Fake Credentials Detected", value: "47", icon: "AlertTriangle", tone: "warning" as const },
  { label: "Avg Response Time", value: "1.8s", icon: "Clock", tone: "default" as const },
];

export function SuperAdminCertificationsRegistry() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = CERTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.recipient.toLowerCase().includes(q) || c.course.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
    const matchStatus = status === "all" || c.status === status;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s: Cert["status"]) => {
    const cls = s === "valid" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "expired" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "expiring" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-violet-500/15 text-violet-700 border-violet-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const fraudItems = CERTS.filter(c => c.fraud);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications Registry"
        description="Central registry of every certification issued across all training providers. Detect duplicates, monitor validity, and surface fraud signals."
        icon={<Icon name="Award" className="h-6 w-6" />}
        actions={[
          { label: "Verification Portal", variant: "outline", onClick: () => navigate("admin", "sa-credentials-verification") },
          { label: "Export Registry", variant: "default", onClick: () => toast.success("Registry export queued") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Certificates" value={CERTS.length} icon={<Icon name="Award" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Valid" value={CERTS.filter(c => c.status === "valid").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring (90d)" value={CERTS.filter(c => c.status === "expiring").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Flagged (Fraud)" value={fraudItems.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {VERIFICATION_STATS.map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone === "brand" ? "bg-brand/10 text-brand" : s.tone === "success" ? "bg-emerald-500/10 text-emerald-600" : s.tone === "warning" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-semibold">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
        <Card className="p-4">
          <CardTitle className="text-xs uppercase text-muted-foreground">Validity Distribution</CardTitle>
          <div className="mt-3 space-y-2">
            {[
              { label: "Valid", v: 60, c: "bg-emerald-500" },
              { label: "Expiring", v: 25, c: "bg-amber-500" },
              { label: "Expired", v: 10, c: "bg-rose-500" },
              { label: "Revoked", v: 5, c: "bg-violet-500" },
            ].map(s => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-xs"><span>{s.label}</span><span className="font-medium">{s.v}%</span></div>
                <Progress className="h-1.5" value={s.v} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SectionCard title="Issued Certifications" description={`${filtered.length} of ${CERTS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cert ID, recipient, course…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="expiring">Expiring</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cert ID</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className={c.fraud ? "bg-rose-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{c.id}{c.fraud && <Icon name="AlertTriangle" className="ml-1 inline h-3 w-3 text-rose-500" />}</TableCell>
                  <TableCell className="font-medium">{c.recipient}</TableCell>
                  <TableCell className="text-xs">{c.course}</TableCell>
                  <TableCell className="text-xs">{c.provider}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.issued)}</TableCell>
                  <TableCell className="text-xs">{formatDate(c.validUntil)}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Verifying ${c.id}…`)}>Verify</Button>
                      {c.fraud && <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.success(`Revoking ${c.id}…`)}>Revoke</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Fraud Detection Queue" description="Duplicate cert IDs and suspicious issuance patterns">
        {fraudItems.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No fraud signals detected" description="All certificates have passed duplicate-ID and signature checks." />
        ) : (
          <div className="space-y-2">
            {fraudItems.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.id} · {c.recipient}</p>
                  <p className="text-xs text-muted-foreground">Duplicate signature hash detected on issuer "{c.provider}" · issued {formatDate(c.issued)}</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Investigation opened for ${c.id}`)}>Investigate</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
