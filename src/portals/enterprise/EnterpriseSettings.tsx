"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { toast } from "sonner";
import { ENTERPRISE_ENTITIES, TENANT_NAME, TenantDisclaimer } from "./_shared";

interface RetentionRule {
  id: string;
  type: string;
  days: number;
  autoDelete: boolean;
}
const RETENTION_RULES: RetentionRule[] = [
  { id: "rr_1", type: "Applications", days: 730, autoDelete: true },
  { id: "rr_2", type: "Candidate profiles (sourced)", days: 365, autoDelete: false },
  { id: "rr_3", type: "Interview scorecards", days: 1095, autoDelete: true },
  { id: "rr_4", type: "Messages", days: 365, autoDelete: true },
  { id: "rr_5", type: "Audit logs", days: 2555, autoDelete: true },
];

const DEFAULT_STAGES = [
  { id: "s_1", name: "Applied", type: "default" },
  { id: "s_2", name: "Screening", type: "screening" },
  { id: "s_3", name: "Assessment", type: "assessment" },
  { id: "s_4", name: "Interview", type: "interview" },
  { id: "s_5", name: "Offer", type: "offer" },
  { id: "s_6", name: "Hired", type: "hire" },
];

const NOTIF_TEMPLATES = [
  { id: "nt_1", name: "Requisition approved", channel: "Email + In-app", active: true },
  { id: "nt_2", name: "Requisition rejected", channel: "Email + In-app", active: true },
  { id: "nt_3", name: "Budget overrun alert", channel: "Email", active: true },
  { id: "nt_4", name: "New entity onboarded", channel: "In-app", active: true },
  { id: "nt_5", name: "Weekly hiring digest", channel: "Email", active: false },
  { id: "nt_6", name: "SSO config changed", channel: "Email", active: true },
];

const REGIONS = [
  { code: "ap-south-1", label: "India (Mumbai) — ap-south-1", country: "IN" },
  { code: "ap-southeast-1", label: "Singapore — ap-southeast-1", country: "SG" },
  { code: "eu-central-1", label: "EU (Frankfurt) — eu-central-1", country: "DE" },
  { code: "us-east-1", label: "US (Virginia) — us-east-1", country: "US" },
];

const SUPPORT_CONTACTS = [
  { role: "Account Manager", name: "Aarav Sharma", email: "enterprise@jobsonn.com", phone: "+91 80 1234 5678" },
  { role: "Technical Lead", name: "Anika Verma", email: "anika@jobsonn.com", phone: "+91 80 1234 5679" },
  { role: "Billing & Invoices", name: "Finance Desk", email: "billing@jobsonn.com", phone: "+91 80 1234 5680" },
];

export function EnterpriseSettings() {
  const [retention, setRetention] = React.useState<RetentionRule[]>(RETENTION_RULES);
  const [stages, setStages] = React.useState(DEFAULT_STAGES);
  const [branding, setBranding] = React.useState({ primaryColor: "#10b981", logo: "TC", name: TENANT_NAME });
  const [notifTemplates, setNotifTemplates] = React.useState(NOTIF_TEMPLATES);
  const [region, setRegion] = React.useState("ap-south-1");

  function updateRetention(id: string, field: keyof RetentionRule, value: number | boolean) {
    setRetention((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }
  function saveRetention() {
    toast.success("Retention policies saved", { description: `${retention.length} rules updated.` });
  }

  function moveStage(idx: number, dir: -1 | 1) {
    setStages((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }
  function addStage() {
    setStages((prev) => [...prev, { id: `s_new_${Date.now()}`, name: "New Stage", type: "default" }]);
    toast.success("Stage added");
  }
  function removeStage(id: string) {
    setStages((prev) => prev.filter((s) => s.id !== id));
    toast.success("Stage removed");
  }
  function saveStages() {
    toast.success("Workflow saved", { description: `${stages.length} stages in pipeline.` });
  }

  function toggleNotif(id: string) {
    setNotifTemplates((prev) => prev.map((t) => t.id === id ? { ...t, active: !t.active } : t));
  }
  function saveBranding() {
    toast.success("Branding saved", { description: `Primary: ${branding.primaryColor} · Logo: ${branding.logo}` });
  }
  function saveRegion() {
    const r = REGIONS.find((x) => x.code === region);
    toast.success("Data residency updated", { description: `Region: ${r?.label}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Enterprise Settings"
        description={`${TENANT_NAME} tenant-level configuration: retention, workflows, branding, notifications, residency, support.`}
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <TenantDisclaimer />

      <Tabs defaultValue="retention">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="residency">Data residency</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Retention */}
        <TabsContent value="retention" className="mt-4 space-y-4">
          <SectionCard
            title="Retention policies"
            description="Per data-type retention period with optional auto-delete."
            action={<Button size="sm" onClick={saveRetention}><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>}
          >
            <ul className="space-y-2">
              {retention.map((r) => (
                <li key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{r.type}</p>
                      <p className="text-xs text-muted-foreground">≈ {Math.round(r.days / 30)} months</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={r.days}
                        onChange={(e) => updateRetention(r.id, "days", parseInt(e.target.value) || 0)}
                        className="h-8 w-24 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">days</span>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Label className="text-xs text-muted-foreground cursor-pointer" htmlFor={`ad-${r.id}`}>Auto-delete</Label>
                      <Switch
                        id={`ad-${r.id}`}
                        checked={r.autoDelete}
                        onCheckedChange={(v) => updateRetention(r.id, "autoDelete", v)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        {/* Workflows */}
        <TabsContent value="workflows" className="mt-4 space-y-4">
          <SectionCard
            title="Custom hiring workflow"
            description="Default pipeline stages for new requisitions across the tenant."
            action={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={addStage}><Plus className="mr-1 h-3.5 w-3.5" /> Add stage</Button>
                <Button size="sm" onClick={saveStages}><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>
              </div>
            }
          >
            <ul className="space-y-2">
              {stages.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-lg border p-2.5">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                  <Input
                    value={s.name}
                    onChange={(e) => setStages((prev) => prev.map((x) => x.id === s.id ? { ...x, name: e.target.value } : x))}
                    className="h-8 flex-1"
                  />
                  <Select value={s.type} onValueChange={(v) => setStages((prev) => prev.map((x) => x.id === s.id ? { ...x, type: v } : x))}>
                    <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="hire">Hire</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-col">
                    <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => moveStage(i, -1)} disabled={i === 0}>↑</Button>
                    <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => moveStage(i, 1)} disabled={i === stages.length - 1}>↓</Button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-rose-600 dark:text-rose-400 h-8" onClick={() => removeStage(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="mt-4 space-y-4">
          <SectionCard
            title="Branding"
            description="Customize logo and brand color for the tenant."
            action={<Button size="sm" onClick={saveBranding}><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <Field label="Tenant name">
                  <Input value={branding.name} onChange={(e) => setBranding((b) => ({ ...b, name: e.target.value }))} />
                </Field>
                <Field label="Logo initials">
                  <Input value={branding.logo} maxLength={2} onChange={(e) => setBranding((b) => ({ ...b, logo: e.target.value.toUpperCase() }))} />
                </Field>
                <Field label="Primary brand color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))}
                      className="h-9 w-12 rounded border cursor-pointer"
                    />
                    <Input value={branding.primaryColor} onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))} className="font-mono" />
                  </div>
                </Field>
                <div>
                  <Label className="text-xs font-medium">Logo upload</Label>
                  <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed p-4">
                    <AvatarLogo text={branding.logo} size="lg" />
                    <div className="flex-1">
                      <p className="text-sm">Drop SVG/PNG here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Recommended 256×256 · max 200KB</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Logo upload (demo)")}>Browse</Button>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs uppercase text-muted-foreground">Live preview</p>
                <div className="mt-3 flex items-center gap-3">
                  <AvatarLogo text={branding.logo} size="xl" />
                  <div>
                    <p className="text-lg font-semibold" style={{ color: branding.primaryColor }}>{branding.name}</p>
                    <p className="text-xs text-muted-foreground">Enterprise tenant preview</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium text-white" style={{ background: branding.primaryColor }}>Primary button</button>
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium border" style={{ color: branding.primaryColor, borderColor: branding.primaryColor }}>Outline</button>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <SectionCard title="Notification templates" description="Toggle event templates delivered across the tenant.">
            <ul className="space-y-2">
              {notifTemplates.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.channel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.active ? "active" : "cancelled"} />
                    <Switch checked={t.active} onCheckedChange={() => toggleNotif(t.id)} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        {/* Data residency */}
        <TabsContent value="residency" className="mt-4 space-y-4">
          <SectionCard
            title="Data residency"
            description="Select the primary region where tenant data is stored. Cross-region replication may apply per compliance."
            action={<Button size="sm" onClick={saveRegion}><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {REGIONS.map((r) => (
                <label
                  key={r.code}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${region === r.code ? "border-brand bg-brand/5" : ""}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={region === r.code}
                    onChange={() => setRegion(r.code)}
                  />
                  <AvatarLogo text={r.country} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.label}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Note: PII is stored in-region; aggregated analytics may replicate to the platform's reporting cluster. DPDP/GDPR compliance is enforced server-side.
            </p>
          </SectionCard>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="mt-4 space-y-4">
          <SectionCard title="Support contacts" description="Enterprise-tier dedicated support team.">
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SUPPORT_CONTACTS.map((c) => (
                <li key={c.role} className="rounded-lg border p-4">
                  <p className="text-xs uppercase text-muted-foreground">{c.role}</p>
                  <p className="mt-1 text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Tenant entities" description="Quick reference for entity admins.">
            <ul className="grid gap-2 sm:grid-cols-2">
              {ENTERPRISE_ENTITIES.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <AvatarLogo text={e.logo} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.admin} · {e.adminEmail}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
