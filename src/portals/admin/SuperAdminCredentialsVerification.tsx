"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo, formatDate } from "@/lib/format";

interface Verification {
  id: string; credentialId: string; type: "certificate" | "degree" | "experience_letter"; requester: string; channel: "public_portal" | "api" | "employer"; status: "verified" | "fake" | "pending" | "revoked"; checkedAt: string;
}

const REQUESTS: Verification[] = [
  { id: "VR-9241", credentialId: "CERT-2024-008214", type: "certificate", requester: "Tata Consultancy Services", channel: "employer", status: "verified", checkedAt: "2024-09-21T09:42:00Z" },
  { id: "VR-9242", credentialId: "DEG-2023-1192", type: "degree", requester: "anonymous@public", channel: "public_portal", status: "verified", checkedAt: "2024-09-21T09:30:00Z" },
  { id: "VR-9243", credentialId: "CERT-2024-008219", type: "certificate", requester: "Infosys BPM", channel: "employer", status: "fake", checkedAt: "2024-09-21T09:12:00Z" },
  { id: "VR-9244", credentialId: "EXP-2024-5582", type: "experience_letter", requester: "API: zomato-hr", channel: "api", status: "verified", checkedAt: "2024-09-21T08:58:00Z" },
  { id: "VR-9245", credentialId: "CERT-2024-008223", type: "certificate", requester: "Wipro Ltd", channel: "employer", status: "fake", checkedAt: "2024-09-21T08:34:00Z" },
  { id: "VR-9246", credentialId: "DEG-2022-7741", type: "degree", requester: "anonymous@public", channel: "public_portal", status: "pending", checkedAt: "2024-09-21T08:02:00Z" },
  { id: "VR-9247", credentialId: "CERT-2024-008216", type: "certificate", requester: "API: deloitte-bg", channel: "api", status: "verified", checkedAt: "2024-09-21T07:48:00Z" },
  { id: "VR-9248", credentialId: "EXP-2023-9921", type: "experience_letter", requester: "Accenture", channel: "employer", status: "revoked", checkedAt: "2024-09-21T07:20:00Z" },
];

const API_STATS = [
  { provider: "Deloitte BG", calls: 1240, success: 98.4 },
  { provider: "TCS HR-API", calls: 894, success: 96.1 },
  { provider: "Zomato HR", calls: 412, success: 99.2 },
  { provider: "Infosys BPM", calls: 318, success: 91.3 },
];

export function SuperAdminCredentialsVerification() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const filtered = REQUESTS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.credentialId.toLowerCase().includes(q) || r.requester.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "flagged" ? r.status === "fake" || r.status === "revoked" : r.status === filter);
    return matchSearch && matchFilter;
  });

  const flagged = REQUESTS.filter(r => r.status === "fake" || r.status === "revoked");

  const statusBadge = (s: Verification["status"]) => {
    const cls = s === "verified" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "fake" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-violet-500/15 text-violet-700 border-violet-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const typeBadge = (t: Verification["type"]) => {
    const cls = t === "certificate" ? "bg-emerald-500/10 text-emerald-700"
      : t === "degree" ? "bg-teal-500/10 text-teal-700"
      : "bg-cyan-500/10 text-cyan-700";
    return <Badge variant="secondary" className={cls}>{t.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credentials Verification"
        description="Public verification portal oversight — monitor verification requests, fake-credential detection, and API consumption by employers and background-check providers."
        icon={<Icon name="BadgeCheck" className="h-6 w-6" />}
        actions={[{ label: "API Docs", variant: "outline", onClick: () => toast.success("Opening verification API docs…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Verifications (30d)" value="8,412" delta={{ value: "+12% MoM", positive: true }} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success Rate" value="94.2%" delta={{ value: "+1.1pp", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Fake Detected" value="47" delta={{ value: "+8 this week", positive: false }} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Response" value="1.8s" delta={{ value: "-0.3s", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Credential Types" description="Distribution of verification requests" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Certificates", v: 5210, pct: 62, icon: "Award", tone: "bg-emerald-500/10 text-emerald-600" },
              { label: "Degrees", v: 2124, pct: 25, icon: "GraduationCap", tone: "bg-teal-500/10 text-teal-600" },
              { label: "Experience Letters", v: 1078, pct: 13, icon: "FileText", tone: "bg-cyan-500/10 text-cyan-600" },
            ].map(c => (
              <Card key={c.label} className="p-4">
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${c.tone}`}><Icon name={c.icon} className="h-4 w-4" /></div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-xl font-semibold">{c.v.toLocaleString()}</p>
                <Progress className="mt-2 h-1.5" value={c.pct} />
                <p className="mt-1 text-xs text-muted-foreground">{c.pct}% of requests</p>
              </Card>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Verification Channels" description="Where requests originate">
          <div className="space-y-3">
            {[
              { label: "Public Portal", v: 3120, c: "bg-emerald-500" },
              { label: "Employer Direct", v: 3941, c: "bg-teal-500" },
              { label: "API Partners", v: 1351, c: "bg-cyan-500" },
            ].map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-xs"><span>{c.label}</span><span className="font-medium">{c.v.toLocaleString()}</span></div>
                <Progress className="mt-1 h-1.5" value={(c.v / 8412) * 100} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Verification Request Log" description={`${filtered.length} of ${REQUESTS.length} requests`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search credential or requester…" className="h-9 max-w-sm" />
          <div className="flex gap-1">
            {["all", "verified", "pending", "flagged"].map(f => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="h-8 text-xs capitalize" onClick={() => setFilter(f)}>{f}</Button>
            ))}
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Credential</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className={r.status === "fake" ? "bg-rose-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-mono text-xs">{r.credentialId}</TableCell>
                  <TableCell>{typeBadge(r.type)}</TableCell>
                  <TableCell className="text-xs">{r.requester}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{r.channel.replace("_", " ")}</Badge></TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell className="text-xs">{timeAgo(r.checkedAt)}</TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening case ${r.id}…`)}>Inspect</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Flagged Credentials Queue" description={`${flagged.length} require investigation`}>
          {flagged.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No flagged credentials" description="Queue is clear." />
          ) : (
            <div className="space-y-2">
              {flagged.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                  <Icon name="AlertTriangle" className="h-5 w-5 text-rose-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.credentialId} · {r.requester}</p>
                    <p className="text-xs text-muted-foreground">Flagged on {formatDate(r.checkedAt)} · status: {r.status}</p>
                  </div>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.success(`Revoking ${r.credentialId}…`)}>Revoke</Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard title="Verification API Stats" description="Top API consumers">
          <div className="space-y-3">
            {API_STATS.map(s => (
              <div key={s.provider} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{s.provider}</p>
                  <p className="text-xs text-muted-foreground">{s.calls.toLocaleString()} calls · {s.success}% success</p>
                </div>
                <Progress className="h-2 w-20" value={s.success} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
