"use client";

import * as React from "react";
import { ScrollText, Shield, Bell, Key, Save, Building2, Users, AlertCircle, Plus, Copy, Trash2, Webhook } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { auditLogs } from "@/lib/mock-data";
import { recruiterRecords, clientAgreements } from "@/lib/portal-data";

interface ApiKey {
  id: string;
  label: string;
  key: string;
  scopes: string[];
  createdAt: string;
  lastUsed?: string;
  status: "active" | "revoked";
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "active" | "paused";
  createdAt: string;
}

const INITIAL_API_KEYS: ApiKey[] = [
  { id: "ak_1", label: "Production sync", key: "tb_live_8f3d2c9a4b1e7f6d", scopes: ["placements:read", "invoices:write"], createdAt: "2024-08-12T09:00:00Z", lastUsed: "2024-10-20T07:30:00Z", status: "active" },
  { id: "ak_2", label: "Reporting export", key: "tb_live_2c9a4b1e8f3d7f6d", scopes: ["analytics:read"], createdAt: "2024-09-03T09:00:00Z", lastUsed: "2024-10-19T22:00:00Z", status: "active" },
];

const INITIAL_WEBHOOKS: Webhook[] = [
  { id: "wh_1", url: "https://ops.talentbridge.in/hooks/placements", events: ["placement.created", "placement.failed"], status: "active", createdAt: "2024-08-15T09:00:00Z" },
  { id: "wh_2", url: "https://billing.talentbridge.in/hooks/invoices", events: ["invoice.paid", "invoice.overdue"], status: "active", createdAt: "2024-09-01T09:00:00Z" },
];

export function AgencySettings() {
  const [billingRules, setBillingRules] = React.useState({
    autoInvoiceOnJoining: true,
    gstApplicable: true,
    gstRate: "18",
    gstin: "29TBCON1234F1Z5",
    currency: "INR",
    defaultCommissionRate: "8.33",
    defaultPaymentTerms: "net_30",
    defaultGuaranteeDays: "90",
    creditNoteOnFail: true,
  });
  const [notif, setNotif] = React.useState({
    placementAlerts: true,
    disputeAlerts: true,
    weeklyDigest: true,
    clientFeedbackAlerts: false,
  });
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>(INITIAL_API_KEYS);
  const [webhooks, setWebhooks] = React.useState<Webhook[]>(INITIAL_WEBHOOKS);
  const [newKeyOpen, setNewKeyOpen] = React.useState(false);
  const [newWebhookOpen, setNewWebhookOpen] = React.useState(false);
  const [revokeKey, setRevokeKey] = React.useState<ApiKey | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
    } else {
      toast.success(`${label} copied`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency settings"
        description="Profile, team roles, billing rules, notifications, API, and audit log."
        actions={[{ label: "Save all", onClick: () => toast.success("Settings saved") }]}
      />

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile"><Building2 className="mr-1.5 h-3.5 w-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="roles"><Users className="mr-1.5 h-3.5 w-3.5" /> Team roles</TabsTrigger>
          <TabsTrigger value="billing"><Save className="mr-1.5 h-3.5 w-3.5" /> Billing rules</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="api"><Key className="mr-1.5 h-3.5 w-3.5" /> API</TabsTrigger>
          <TabsTrigger value="audit"><ScrollText className="mr-1.5 h-3.5 w-3.5" /> Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <SectionCard title="Agency profile">
            <div className="flex items-center gap-4">
              <AvatarLogo text="TalentBridge Consulting" size="xl" />
              <div>
                <p className="text-base font-semibold">TalentBridge Consulting</p>
                <p className="text-xs text-muted-foreground">Specialist IT & product recruitment agency</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Logo upload opened")}>Change logo</Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="s-name">Legal name</Label>
                <Input id="s-name" defaultValue="TalentBridge Consulting Pvt Ltd" />
              </div>
              <div>
                <Label htmlFor="s-website">Website</Label>
                <Input id="s-website" defaultValue="https://talentbridge.in" />
              </div>
              <div>
                <Label htmlFor="s-ops">Operations email</Label>
                <Input id="s-ops" defaultValue="ops@talentbridge.in" />
              </div>
              <div>
                <Label htmlFor="s-phone">Phone</Label>
                <Input id="s-phone" defaultValue="+91 80 4567 8901" />
              </div>
              <div>
                <Label htmlFor="s-gst">GSTIN</Label>
                <Input id="s-gst" defaultValue="29TBCON1234F1Z5" />
              </div>
              <div>
                <Label htmlFor="s-pan">PAN</Label>
                <Input id="s-pan" defaultValue="AABCT1234F" />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => toast.success("Profile saved")}><Save className="mr-1 h-4 w-4" /> Save</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <SectionCard title="Team roles & permissions" description="Configure role-based access for your recruiters.">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead className="text-center">Lead</TableHead>
                  <TableHead className="text-center">Senior</TableHead>
                  <TableHead className="text-center">Recruiter</TableHead>
                  <TableHead className="text-center">Sourcing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { p: "View own submissions", lead: true, sr: true, rec: true, sou: true },
                  { p: "Submit candidates", lead: true, sr: true, rec: true, sou: true },
                  { p: "View all agency submissions", lead: true, sr: true, rec: false, sou: false },
                  { p: "Withdraw submissions", lead: true, sr: true, rec: true, sou: false },
                  { p: "Edit client agreements", lead: true, sr: false, rec: false, sou: false },
                  { p: "Approve commission splits", lead: true, sr: false, rec: false, sou: false },
                  { p: "Invite recruiters", lead: true, sr: false, rec: false, sou: false },
                  { p: "Generate invoices", lead: true, sr: true, rec: false, sou: false },
                  { p: "View audit log", lead: true, sr: false, rec: false, sou: false },
                ].map((row) => (
                  <TableRow key={row.p}>
                    <TableCell className="text-sm">{row.p}</TableCell>
                    <TableCell className="text-center"><Shield className={`mx-auto h-4 w-4 ${row.lead ? "text-emerald-600" : "text-muted-foreground/30"}`} /></TableCell>
                    <TableCell className="text-center"><Shield className={`mx-auto h-4 w-4 ${row.sr ? "text-emerald-600" : "text-muted-foreground/30"}`} /></TableCell>
                    <TableCell className="text-center"><Shield className={`mx-auto h-4 w-4 ${row.rec ? "text-emerald-600" : "text-muted-foreground/30"}`} /></TableCell>
                    <TableCell className="text-center"><Shield className={`mx-auto h-4 w-4 ${row.sou ? "text-emerald-600" : "text-muted-foreground/30"}`} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-3 text-xs text-muted-foreground">
              Changes to role permissions are audited and apply to new sessions only.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <SectionCard title="Billing rules" description="Automate invoicing and reconciliation. Commission defaults apply to new agreements only — per-client rates override these.">
            <div className="rounded-lg border bg-muted/20 p-3 text-[11px] text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> Commission defaults are a starting point. Actual rates per client agreement are configurable and subject to legal &amp; accounting review — never universal across all clients.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="b-default-rate">Default commission rate (%)</Label>
                <Input id="b-default-rate" type="number" step="0.01" value={billingRules.defaultCommissionRate} onChange={(e) => setBillingRules((p) => ({ ...p, defaultCommissionRate: e.target.value }))} />
                <p className="mt-1 text-[11px] text-muted-foreground">Starting rate for new client agreements.</p>
              </div>
              <div>
                <Label htmlFor="b-guarantee">Default guarantee (days)</Label>
                <Input id="b-guarantee" type="number" value={billingRules.defaultGuaranteeDays} onChange={(e) => setBillingRules((p) => ({ ...p, defaultGuaranteeDays: e.target.value }))} />
              </div>
              <div>
                <Label>Default payment terms</Label>
                <Select value={billingRules.defaultPaymentTerms} onValueChange={(v) => setBillingRules((p) => ({ ...p, defaultPaymentTerms: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net_15">Net 15</SelectItem>
                    <SelectItem value="net_30">Net 30</SelectItem>
                    <SelectItem value="net_45">Net 45</SelectItem>
                    <SelectItem value="net_60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={billingRules.currency} onValueChange={(v) => setBillingRules((p) => ({ ...p, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ul className="mt-4 divide-y">
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Auto-invoice on candidate joining</p>
                  <p className="text-xs text-muted-foreground">Generate agency invoice automatically when a placement's joining date passes.</p>
                </div>
                <Switch checked={billingRules.autoInvoiceOnJoining} onCheckedChange={(v) => setBillingRules((p) => ({ ...p, autoInvoiceOnJoining: v }))} />
              </li>
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Apply GST</p>
                  <p className="text-xs text-muted-foreground">Auto-add GST to all agency invoices.</p>
                </div>
                <Switch checked={billingRules.gstApplicable} onCheckedChange={(v) => setBillingRules((p) => ({ ...p, gstApplicable: v }))} />
              </li>
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Auto credit note on failed placement</p>
                  <p className="text-xs text-muted-foreground">Issue credit note automatically when a placement fails within guarantee.</p>
                </div>
                <Switch checked={billingRules.creditNoteOnFail} onCheckedChange={(v) => setBillingRules((p) => ({ ...p, creditNoteOnFail: v }))} />
              </li>
            </ul>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="b-gst-rate">GST rate (%)</Label>
                <Input id="b-gst-rate" type="number" step="0.01" value={billingRules.gstRate} onChange={(e) => setBillingRules((p) => ({ ...p, gstRate: e.target.value }))} disabled={!billingRules.gstApplicable} />
              </div>
              <div>
                <Label htmlFor="b-gstin">Agency GSTIN</Label>
                <Input id="b-gstin" value={billingRules.gstin} onChange={(e) => setBillingRules((p) => ({ ...p, gstin: e.target.value }))} disabled={!billingRules.gstApplicable} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => toast.success("Billing rules saved")}><Save className="mr-1 h-4 w-4" /> Save</Button>
            </div>
          </SectionCard>

          <SectionCard title="Per-client rate overrides" description="Current rates set on each active agreement">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Payment</TableHead>
                    <TableHead className="text-center">Guarantee</TableHead>
                    <TableHead className="text-center">SLA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientAgreements.map((c) => (
                    <TableRow key={c.employerId}>
                      <TableCell className="text-sm font-medium">{c.employerName}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{c.commissionRate}%</Badge></TableCell>
                      <TableCell className="hidden md:table-cell text-center uppercase text-xs">{c.paymentTerms.replace("_", " ")}</TableCell>
                      <TableCell className="text-center text-xs">{c.guaranteePeriodDays}d</TableCell>
                      <TableCell className="text-center text-xs capitalize">{c.sla}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Edit per-client rates on the Clients page.</p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <SectionCard title="Notification preferences" description="Agency-wide alerts (override recruiter preferences).">
            <ul className="divide-y">
              {[
                { key: "placementAlerts" as const, label: "Placement alerts", desc: "When any recruiter confirms a placement" },
                { key: "disputeAlerts" as const, label: "Dispute alerts", desc: "When a commission dispute is raised" },
                { key: "weeklyDigest" as const, label: "Weekly agency digest", desc: "Performance summary across recruiters" },
                { key: "clientFeedbackAlerts" as const, label: "Client feedback alerts", desc: "When clients leave negative feedback" },
              ].map((row) => (
                <li key={row.key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>
                  <Switch checked={notif[row.key]} onCheckedChange={(v) => setNotif((p) => ({ ...p, [row.key]: v }))} />
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => toast.success("Notification preferences saved")}><Save className="mr-1 h-4 w-4" /> Save</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <SectionCard
            title="API keys"
            description="Agency-level API access. Use scoped keys for automation — never share full-access keys."
            action={<Button size="sm" onClick={() => setNewKeyOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Generate key</Button>}
          >
            {apiKeys.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No API keys. Generate one to get started.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto scroll-thin">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Label</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead className="hidden md:table-cell">Scopes</TableHead>
                      <TableHead className="hidden lg:table-cell">Last used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((k) => (
                      <TableRow key={k.id}>
                        <TableCell className="text-sm font-medium">{k.label}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{k.key.slice(0, 8)}…{k.key.slice(-4)}</code>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(k.key, "API key")} aria-label="Copy key">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {k.scopes.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{k.lastUsed ? timeAgo(k.lastUsed) : "never"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={k.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"}>{k.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-600" onClick={() => setRevokeKey(k)} aria-label="Revoke key">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Webhooks"
            description="Receive real-time agency events at your endpoints."
            action={<Button size="sm" variant="outline" onClick={() => setNewWebhookOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add webhook</Button>}
          >
            {webhooks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No webhooks configured.</p>
            ) : (
              <ul className="divide-y">
                {webhooks.map((w) => (
                  <li key={w.id} className="flex flex-wrap items-center gap-3 py-3">
                    <Webhook className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium font-mono">{w.url}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {w.events.map((e) => <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>)}
                      </div>
                    </div>
                    <Badge variant="outline" className={w.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"}>{w.status}</Badge>
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.success("Test event sent", { description: w.url })}>Test</Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-600" onClick={() => {
                      setWebhooks((prev) => prev.filter((x) => x.id !== w.id));
                      toast.success("Webhook removed");
                    }} aria-label="Remove webhook"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Integration cards" description="Connected third-party services">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Greenhouse (ATS) sync</p>
                    <p className="text-xs text-muted-foreground">Push submissions and placement data to Greenhouse.</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Connected</Badge>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Razorpay (receivables)</p>
                    <p className="text-xs text-muted-foreground">Auto-reconcile UPI/bank transfers to invoices.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Integration connect dialog opened")}>Connect</Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <SectionCard
            title="Audit log"
            description="Agency-level audit entries (last 30 days)."
            action={<Button size="sm" variant="outline" onClick={() => toast.success("Audit log exported", { description: "audit.csv" })}>Export</Button>}
          >
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Resource</TableHead>
                    <TableHead className="hidden lg:table-cell">IP</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead className="text-center">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.actor}</TableCell>
                      <TableCell className="text-xs font-mono">{log.action}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{log.resource} · {log.resourceId}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground">{log.ip}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(log.timestamp)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          log.severity === "critical" ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                          : log.severity === "warning" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                          : "text-[10px]"
                        }>{log.severity}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" /> Retention policy: 2 years. Configure under Admin → System Settings.
            </p>
          </SectionCard>

          <SectionCard title="Recruiter activity snapshot" description="Recent recruiter actions">
            <ul className="space-y-2">
              {recruiterRecords.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-lg border p-2.5 text-sm">
                  <AvatarLogo text={r.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Last active {timeAgo(r.lastActive)}</p>
                  </div>
                  <Badge variant="outline">{r.activeReqs} active</Badge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

      </Tabs>

      <NewApiKeyDialog
        open={newKeyOpen}
        onOpenChange={setNewKeyOpen}
        onCreate={(label, scopes) => {
          const k: ApiKey = {
            id: `ak_${Date.now()}`,
            label,
            key: `tb_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`,
            scopes,
            createdAt: new Date().toISOString(),
            status: "active",
          };
          setApiKeys((prev) => [k, ...prev]);
          setNewKeyOpen(false);
          toast.success("API key generated", { description: label });
        }}
      />

      <NewWebhookDialog
        open={newWebhookOpen}
        onOpenChange={setNewWebhookOpen}
        onCreate={(url, events) => {
          const w: Webhook = { id: `wh_${Date.now()}`, url, events, status: "active", createdAt: new Date().toISOString() };
          setWebhooks((prev) => [...prev, w]);
          setNewWebhookOpen(false);
          toast.success("Webhook added", { description: url });
        }}
      />

      <AlertDialog open={!!revokeKey} onOpenChange={(v) => !v && setRevokeKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeKey && <>This will permanently revoke <strong>{revokeKey.label}</strong>. Any automation using this key will stop working immediately.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (revokeKey) {
                  setApiKeys((prev) => prev.filter((k) => k.id !== revokeKey.id));
                  toast.success("API key revoked", { description: revokeKey.label });
                }
                setRevokeKey(null);
              }}
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function NewApiKeyDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (label: string, scopes: string[]) => void;
}) {
  const [label, setLabel] = React.useState("");
  const allScopes = ["placements:read", "placements:write", "invoices:read", "invoices:write", "analytics:read", "clients:read"];
  const [scopes, setScopes] = React.useState<string[]>(["placements:read"]);

  React.useEffect(() => {
    if (open) {
      setLabel("");
      setScopes(["placements:read"]);
    }
  }, [open]);

  const toggle = (s: string) => setScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate API key</DialogTitle>
          <DialogDescription>Choose a label and select the scopes this key can access.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="nk-label">Label</Label>
            <Input id="nk-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Production sync" />
          </div>
          <div>
            <Label>Scopes</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {allScopes.map((s) => (
                <label key={s} className="flex items-center gap-2 rounded-md border p-2 text-xs cursor-pointer hover:bg-muted/40">
                  <input type="checkbox" checked={scopes.includes(s)} onChange={() => toggle(s)} className="accent-emerald-600" />
                  <span className="font-mono">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!label || scopes.length === 0} onClick={() => onCreate(label, scopes)}>
            <Key className="mr-1 h-4 w-4" /> Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewWebhookDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (url: string, events: string[]) => void;
}) {
  const [url, setUrl] = React.useState("");
  const allEvents = ["placement.created", "placement.failed", "invoice.paid", "invoice.overdue", "commission.disputed", "client.feedback"];
  const [events, setEvents] = React.useState<string[]>(["placement.created"]);

  React.useEffect(() => {
    if (open) {
      setUrl("");
      setEvents(["placement.created"]);
    }
  }, [open]);

  const toggle = (e: string) => setEvents((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add webhook</DialogTitle>
          <DialogDescription>We'll POST event payloads to this URL.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="nw-url">Endpoint URL</Label>
            <Input id="nw-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourapp.example/hooks/jobson.id" />
          </div>
          <div>
            <Label>Events</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {allEvents.map((e) => (
                <label key={e} className="flex items-center gap-2 rounded-md border p-2 text-xs cursor-pointer hover:bg-muted/40">
                  <input type="checkbox" checked={events.includes(e)} onChange={() => toggle(e)} className="accent-emerald-600" />
                  <span className="font-mono">{e}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!url || !url.startsWith("http") || events.length === 0} onClick={() => onCreate(url, events)}>
            <Plus className="mr-1 h-4 w-4" /> Add webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
