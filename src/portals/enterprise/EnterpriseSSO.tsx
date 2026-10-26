"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { KeyRound, Plus, Copy, RefreshCw, ShieldCheck, Globe, Webhook } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_API_KEYS, TenantDisclaimer, type ApiKey,
} from "./_shared";
import { integrations } from "@/lib/mock-data";
import { formatDateTime, timeAgo } from "@/lib/format";

const ssoSchema = z.object({
  protocol: z.enum(["saml", "oidc"]),
  providerUrl: z.string().url("Must be a valid URL"),
  entityId: z.string().min(2, "Required"),
  certificate: z.string().min(20, "Certificate too short"),
  emailMapping: z.string().min(1, "Required"),
  nameMapping: z.string().min(1, "Required"),
  roleMapping: z.string().optional(),
});

type SsoFormValues = z.infer<typeof ssoSchema>;

const ALL_SCOPES = [
  { id: "jobs:read", label: "Jobs — read" },
  { id: "jobs:write", label: "Jobs — write" },
  { id: "applications:read", label: "Applications — read" },
  { id: "applications:write", label: "Applications — write" },
  { id: "candidates:read", label: "Candidates — read" },
  { id: "reports:read", label: "Reports — read" },
  { id: "notifications:write", label: "Notifications — write" },
  { id: "audit:read", label: "Audit — read" },
];

const WEBHOOK_EVENTS = [
  "job.published",
  "job.closed",
  "application.submitted",
  "application.stage_changed",
  "interview.scheduled",
  "offer.sent",
  "offer.accepted",
  "requisition.approved",
];

export function EnterpriseSSO() {
  const [keys, setKeys] = React.useState<ApiKey[]>(ENTERPRISE_API_KEYS);
  const [revokeId, setRevokeId] = React.useState<string | null>(null);
  const [genOpen, setGenOpen] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyScopes, setNewKeyScopes] = React.useState<string[]>(["jobs:read"]);
  const [newKeyIp, setNewKeyIp] = React.useState("");
  const [newlyCreated, setNewlyCreated] = React.useState<{ prefix: string; full: string } | null>(null);
  const [webhookUrl, setWebhookUrl] = React.useState("https://hooks.techcorp.com/jobsonn/events");
  const [webhookEvents, setWebhookEvents] = React.useState<string[]>(["job.published", "application.submitted", "offer.accepted"]);
  const [ipAllowlist, setIpAllowlist] = React.useState<string[]>(["203.0.113.0/24", "198.51.100.7/32"]);
  const [newIp, setNewIp] = React.useState("");

  const form = useForm<SsoFormValues>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      protocol: "saml",
      providerUrl: "https://techcorp.okta.com/app/techcorp_jobsonn_1/k2s8f9a8sdf/sso/saml",
      entityId: "techcorp-jobsonn",
      certificate: "-----BEGIN CERTIFICATE-----\nMIIDqjCCApKgAwIBAgIGAX9abcdefg...\n-----END CERTIFICATE-----",
      emailMapping: "email",
      nameMapping: "displayName",
      roleMapping: "groups",
    },
  });
  const protocolWatch = useWatch({ control: form.control, name: "protocol" });

  const ssoIntegration = integrations.find((i) => i.category === "sso");
  const connectedIntegrations = integrations.filter((i) => i.status === "connected");

  function saveSso(values: SsoFormValues) {
    toast.success("SSO configuration saved", {
      description: `${values.protocol.toUpperCase()} · ${values.providerUrl}`,
    });
  }
  function testSso() {
    toast.success("SSO test connection — Success", { description: "IdP responded with 200 OK; attribute mapping valid." });
  }

  function generateKey() {
    const prefix = `sk_live_${Math.random().toString(36).slice(2, 6)}`;
    const full = `${prefix}${Math.random().toString(36).slice(2, 36)}`;
    const newKey: ApiKey = {
      id: `k_new_${Date.now()}`,
      name: newKeyName || "Untitled key",
      prefix,
      scopes: newKeyScopes,
      createdBy: "Rohan Mehta",
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: "active",
      ipRestriction: newKeyIp || null,
    };
    setKeys((k) => [...k, newKey]);
    setNewlyCreated({ prefix, full });
    setGenOpen(false);
    setNewKeyName("");
    setNewKeyScopes(["jobs:read"]);
    setNewKeyIp("");
    toast.success(`API key “${newKey.name}” generated`);
  }

  function revokeKey() {
    if (!revokeId) return;
    const k = keys.find((x) => x.id === revokeId);
    setKeys((prev) => prev.map((x) => x.id === revokeId ? { ...x, status: "revoked" } : x));
    setRevokeId(null);
    toast.success(`API key “${k?.name}” revoked`, { description: "All requests using this key will be rejected server-side." });
  }

  function toggleWebhookEvent(e: string) {
    setWebhookEvents((cur) => cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]);
  }
  function saveWebhook() {
    toast.success("Webhook configuration saved", { description: `${webhookEvents.length} events subscribed` });
  }
  function addIp() {
    if (!newIp) return;
    setIpAllowlist((l) => [...l, newIp]);
    setNewIp("");
    toast.success("IP allowlist updated");
  }
  function removeIp(ip: string) {
    setIpAllowlist((l) => l.filter((x) => x !== ip));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="SSO & API Keys"
        description="Single sign-on configuration, API key management, webhooks, IP allowlist, and integration health."
        icon={<Icon name="KeyRound" className="h-6 w-6" />}
        actions={[{ label: "Generate key", icon: "Plus", onClick: () => setGenOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="SSO status" value={ssoIntegration?.status === "connected" ? "Connected" : "Off"} icon={<ShieldCheck className="h-5 w-5" />} tone={ssoIntegration?.status === "connected" ? "success" : "default"} />
        <StatCard label="Active API keys" value={keys.filter((k) => k.status === "active").length} icon={<KeyRound className="h-5 w-5" />} />
        <StatCard label="Connected integrations" value={connectedIntegrations.length} icon={<Globe className="h-5 w-5" />} tone="brand" />
        <StatCard label="IP allowlist entries" value={ipAllowlist.length} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      {/* SSO Config */}
      <SectionCard title="SSO configuration" description="SAML 2.0 / OpenID Connect — IdP metadata, certificate, and attribute mapping.">
        <form onSubmit={form.handleSubmit(saveSso)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Protocol">
              <Select value={protocolWatch} onValueChange={(v) => form.setValue("protocol", v as SsoFormValues["protocol"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="saml">SAML 2.0</SelectItem>
                  <SelectItem value="oidc">OpenID Connect</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Entity ID" error={form.formState.errors.entityId?.message}>
              <Input {...form.register("entityId")} placeholder="techcorp-jobsonn" />
            </Field>
          </div>
          <Field label="Provider URL / Metadata URL" error={form.formState.errors.providerUrl?.message}>
            <Input {...form.register("providerUrl")} placeholder="https://techcorp.okta.com/..." />
          </Field>
          <Field label="IdP Certificate (PEM)" error={form.formState.errors.certificate?.message}>
            <Textarea {...form.register("certificate")} rows={4} className="font-mono text-xs" placeholder="-----BEGIN CERTIFICATE-----..." />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Email attribute" error={form.formState.errors.emailMapping?.message}>
              <Input {...form.register("emailMapping")} placeholder="email" />
            </Field>
            <Field label="Name attribute" error={form.formState.errors.nameMapping?.message}>
              <Input {...form.register("nameMapping")} placeholder="displayName" />
            </Field>
            <Field label="Role attribute (optional)">
              <Input {...form.register("roleMapping")} placeholder="groups" />
            </Field>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={testSso}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Test connection
            </Button>
            <Button type="submit">Save SSO config</Button>
          </div>
        </form>
      </SectionCard>

      {/* API keys */}
      <SectionCard title={`API keys (${keys.length})`} description="Manage API credentials with scoped permissions and IP restrictions.">
        <div className="max-h-[26rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>IP restriction</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{k.name}</p>
                    <p className="text-xs text-muted-foreground">by {k.createdBy}</p>
                  </TableCell>
                  <TableCell>
                    <code className="font-mono text-xs">{k.prefix}••••••••</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[16rem]">
                      {k.scopes.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{k.ipRestriction ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground" title={formatDateTime(k.lastUsed)}>{timeAgo(k.lastUsed)}</TableCell>
                  <TableCell><StatusBadge status={k.status === "active" ? "active" : "cancelled"} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() => {
                          navigator.clipboard?.writeText(`${k.prefix}••••`).catch(() => undefined);
                          toast.success("Key copied (prefix only — full value shown once at creation)");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {k.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-rose-600 dark:text-rose-400"
                          onClick={() => setRevokeId(k.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {keys.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No API keys yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Webhooks + IP allowlist */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Webhooks"
          description="Subscribe to platform events."
          action={<Button size="sm" onClick={saveWebhook}>Save</Button>}
        >
          <Field label="Webhook URL">
            <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://..." />
          </Field>
          <div className="mt-3">
            <Label className="text-xs font-medium">Subscribed events</Label>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {WEBHOOK_EVENTS.map((e) => {
                const checked = webhookEvents.includes(e);
                return (
                  <label key={e} className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={checked} onCheckedChange={() => toggleWebhookEvent(e)} />
                    <code className="text-xs">{e}</code>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/30 p-2">
            <Webhook className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Signing secret: <code>whsec_••••</code></span>
            <Button size="sm" variant="ghost" className="ml-auto h-6 text-xs" onClick={() => toast.success("Signing secret rotated")}>Rotate</Button>
          </div>
        </SectionCard>

        <SectionCard title="IP allowlist" description="Restrict API/SSO access to known IP ranges.">
          <ul className="space-y-1.5">
            {ipAllowlist.map((ip) => (
              <li key={ip} className="flex items-center justify-between rounded-md border p-2">
                <code className="font-mono text-xs">{ip}</code>
                <Button size="sm" variant="ghost" className="h-7 text-rose-600 dark:text-rose-400" onClick={() => removeIp(ip)}>Remove</Button>
              </li>
            ))}
            {ipAllowlist.length === 0 && (
              <li className="text-xs text-muted-foreground text-center py-2">No allowlist entries — all IPs permitted.</li>
            )}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="203.0.113.0/24"
              className="h-8 font-mono text-xs"
            />
            <Button size="sm" variant="outline" onClick={addIp}>Add</Button>
          </div>
        </SectionCard>
      </div>

      {/* Integration status */}
      <SectionCard title="Integration status" description="Health of connected enterprise integrations.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {integrations.map((i) => (
            <li key={i.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <AvatarLogo text={i.name} size="sm" />
                <div>
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.category}{i.lastSync ? ` · synced ${timeAgo(i.lastSync)}` : ""}</p>
                </div>
              </div>
              <StatusBadge status={i.status} />
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Generate key dialog */}
      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate API key</DialogTitle>
            <DialogDescription>Choose a name, scopes, and optional IP restriction. The full key is shown only once.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Key name">
              <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Reporting ETL" />
            </Field>
            <Field label="Scopes">
              <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto scroll-thin">
                {ALL_SCOPES.map((s) => {
                  const checked = newKeyScopes.includes(s.id);
                  return (
                    <label key={s.id} className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setNewKeyScopes((cur) => checked ? cur.filter((x) => x !== s.id) : [...cur, s.id])}
                      />
                      <span className="text-xs">{s.label}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
            <Field label="IP restriction (optional)">
              <Input value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="203.0.113.0/24" className="font-mono text-xs" />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={generateKey}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show new key dialog */}
      <Dialog open={!!newlyCreated} onOpenChange={(o) => !o && setNewlyCreated(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
            <DialogDescription>Copy this key now. It will not be shown again.</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 p-3">
            <code className="break-all font-mono text-xs">{newlyCreated?.full}</code>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (newlyCreated) {
                  navigator.clipboard?.writeText(newlyCreated.full).catch(() => undefined);
                  toast.success("API key copied");
                }
              }}
            >
              <Copy className="mr-1 h-3.5 w-3.5" /> Copy
            </Button>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke alert */}
      <AlertDialog open={!!revokeId} onOpenChange={(o) => !o && setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently revokes the key. All services using it will receive 401 responses immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={revokeKey}>Revoke key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
