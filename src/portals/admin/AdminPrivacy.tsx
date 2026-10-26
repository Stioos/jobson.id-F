"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

type RetentionPolicy = {
  id: string;
  dataType: "applications" | "messages" | "documents" | "audit_logs" | "candidate_profiles" | "billing";
  label: string;
  periodDays: number;
  autoDelete: boolean;
};

const INITIAL_POLICIES: RetentionPolicy[] = [
  { id: "rp1", dataType: "applications", label: "Job applications", periodDays: 1095, autoDelete: false },
  { id: "rp2", dataType: "messages", label: "Messages", periodDays: 365, autoDelete: true },
  { id: "rp3", dataType: "documents", label: "Uploaded documents", periodDays: 730, autoDelete: false },
  { id: "rp4", dataType: "audit_logs", label: "Audit logs", periodDays: 2555, autoDelete: false },
  { id: "rp5", dataType: "candidate_profiles", label: "Candidate profiles", periodDays: 1825, autoDelete: false },
  { id: "rp6", dataType: "billing", label: "Billing & invoices", periodDays: 2555, autoDelete: false },
];

const DSAR_REQUESTS = [
  { id: "dsar1", type: "export", user: "Vikram Singh", email: "vikram.singh@gmail.com", status: "pending", requestedAt: "2024-10-18T10:00:00Z" },
  { id: "dsar2", type: "deletion", user: "Karthik Menon", email: "karthik.m@gmail.com", status: "in_progress", requestedAt: "2024-10-15T10:00:00Z" },
  { id: "dsar3", type: "export", user: "Meera Krishnan", email: "meera.k@gmail.com", status: "completed", requestedAt: "2024-10-10T10:00:00Z" },
];

const CONSENT_STATS = [
  { type: "Marketing", granted: 1240, denied: 820 },
  { type: "Data sharing", granted: 1860, denied: 200 },
  { type: "Analytics", granted: 1620, denied: 440 },
  { type: "Profile indexing", granted: 1740, denied: 320 },
  { type: "Communications", granted: 1980, denied: 80 },
];

const POLICY_VERSIONS = [
  { version: "v2.4", date: "2024-10-01T00:00:00Z", changes: "Added DPDP Act 2023 compliance section" },
  { version: "v2.3", date: "2024-06-15T00:00:00Z", changes: "Updated cookie policy" },
  { version: "v2.2", date: "2024-01-20T00:00:00Z", changes: "Added GDPR data transfer clauses" },
];

export function AdminPrivacy() {
  const [policies, setPolicies] = React.useState<RetentionPolicy[]>(INITIAL_POLICIES);
  const [dsarRequests, setDsarRequests] = React.useState(DSAR_REQUESTS);
  const [dsarTarget, setDsarTarget] = React.useState<typeof DSAR_REQUESTS[number] | null>(null);

  const updatePolicy = (id: string, patch: Partial<RetentionPolicy>) => {
    setPolicies((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Retention & Privacy"
        description="Retention policies, consent dashboard, DPDP/GDPR tools, and policy versioning."
        icon={<Icon name="Lock" className="h-6 w-6" />}
        actions={[{ label: "Save all", onClick: () => toast.success("Privacy settings saved") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Open DSAR" value={dsarRequests.filter((d) => d.status !== "completed").length} icon="FileText" tone="warning" />
        <MiniStat label="Consent rate" value="86%" icon="BadgeCheck" tone="success" />
        <MiniStat label="Data types" value={policies.length} icon="Database" />
        <MiniStat label="Policy version" value="v2.4" icon="ScrollText" />
      </div>

      <Tabs defaultValue="retention">
        <TabsList>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="dsar">DSAR</TabsTrigger>
          <TabsTrigger value="dpa">DPA</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="retention" className="mt-4">
          <SectionCard title="Retention policies" description="Per data type retention period and auto-delete.">
            <ul className="space-y-2">
              {policies.map((p) => (
                <li key={p.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Database" className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground capitalize">{p.dataType.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Input type="number" value={p.periodDays} onChange={(e) => updatePolicy(p.id, { periodDays: parseInt(e.target.value) || 0 })} className="h-8 w-24" />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                      <label className="flex items-center gap-2 text-xs">
                        <Switch checked={p.autoDelete} onCheckedChange={(v) => updatePolicy(p.id, { autoDelete: v })} />
                        Auto-delete
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-muted-foreground">
              Subject to legal/accounting review. Some data types have statutory minimum retention (e.g., GST records: 6 years).
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="consent" className="mt-4">
          <SectionCard title="Consent dashboard" description="Per-purpose consent stats across the user base.">
            <ul className="space-y-2">
              {CONSENT_STATS.map((c) => {
                const total = c.granted + c.denied;
                const pct = Math.round((c.granted / total) * 100);
                return (
                  <li key={c.type} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{c.type}</span>
                      <span className="text-xs text-muted-foreground">{c.granted}/{total} ({pct}%)</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-rose-500/20">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="dsar" className="mt-4">
          <SectionCard title="Data subject access requests" description="DPDP/GDPR-compliant export and deletion requests.">
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dsarRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="text-sm font-medium">{r.user}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{r.type}</Badge></TableCell>
                      <TableCell><StatusBadge status={r.status === "in_progress" ? "in_progress" : r.status === "completed" ? "completed" : "pending"} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(r.requestedAt)}</TableCell>
                      <TableCell className="text-right">
                        {r.status !== "completed" && <Button size="sm" variant="outline" onClick={() => setDsarTarget(r)}>Process</Button>}
                        {r.status === "completed" && <Button size="sm" variant="ghost" onClick={() => toast.info("Already completed")}>View</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">SLA: 30 days per DPDP Act. Currently within SLA for all open requests.</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="dpa" className="mt-4">
          <SectionCard title="Data processing agreements" description="DPAs with sub-processors and partners.">
            <ul className="space-y-2 text-sm">
              {[
                { name: "AWS (Hosting)", region: "ap-south-1", signed: "2023-01-15", status: "active" },
                { name: "OpenAI (AI processing)", region: "Global", signed: "2023-03-01", status: "active" },
                { name: "Razorpay (Payments)", region: "India", signed: "2023-02-01", status: "active" },
                { name: "SpringVerify (Background checks)", region: "India", signed: "2023-08-01", status: "pending" },
              ].map((d) => (
                <li key={d.name} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.region} · signed {formatDate(d.signed)}</p>
                  </div>
                  <Badge variant="outline" className={d.status === "active" ? "text-emerald-600" : "text-amber-600"}>{d.status}</Badge>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.info("Upload DPA (demo)")}>Upload new DPA</Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <SectionCard title="Privacy policy versioning" description="Track and publish policy changes.">
            <ul className="space-y-2">
              {POLICY_VERSIONS.map((v) => (
                <li key={v.version} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{v.version}</Badge>
                      <span className="text-sm">{formatDate(v.date)}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info("View policy (demo)")}>View</Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{v.changes}</p>
                </li>
              ))}
            </ul>
            <Button size="sm" className="mt-2" onClick={() => toast.info("New policy draft (demo)")}>Draft new version</Button>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={!!dsarTarget} onOpenChange={(o) => !o && setDsarTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dsarTarget?.type === "export" ? "Export user data" : "Delete user data"}</DialogTitle>
            <DialogDescription>{dsarTarget && `${dsarTarget.user} (${dsarTarget.email})`}</DialogDescription>
          </DialogHeader>
          {dsarTarget?.type === "export" ? (
            <p className="py-2 text-sm text-muted-foreground">Generates a ZIP archive with profile, applications, messages, and consent records. Delivered via secure link.</p>
          ) : (
            <div className="py-2 space-y-2">
              <p className="text-sm text-muted-foreground">Permanently deletes the user's personal data. Some records (audit, billing) are retained per statutory requirements.</p>
              <Textarea placeholder="Deletion reason / notes..." rows={3} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDsarTarget(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!dsarTarget) return;
              setDsarRequests((p) => p.map((r) => (r.id === dsarTarget.id ? { ...r, status: "completed" } : r)));
              toast.success(`${dsarTarget.type === "export" ? "Export" : "Deletion"} completed`);
              setDsarTarget(null);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
