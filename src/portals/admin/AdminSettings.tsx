"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function AdminSettings() {
  const [general, setGeneral] = React.useState({
    platformName: "JOBSONN",
    timezone: "Asia/Kolkata",
    currency: "INR",
    supportEmail: "support@jobsonn.com",
  });
  const [email, setEmail] = React.useState({
    smtpHost: "smtp.jobsonn.com",
    smtpPort: 587,
    fromAddress: "notifications@jobsonn.com",
    fromName: "JOBSONN",
  });
  const [features, setFeatures] = React.useState<Record<string, boolean>>({
    candidate_signup: true,
    employer_signup: true,
    ai_matching: true,
    ai_jd_gen: true,
    referrals: true,
    training: true,
    projects_marketplace: true,
    multi_currency: false,
  });
  const [maintenance, setMaintenance] = React.useState({ mode: false, banner: "" });
  const [limits, setLimits] = React.useState({ apiRate: 1000, uploadMb: 25, messageSize: 5000 });
  const [backup, setBackup] = React.useState({ auto: true, frequency: "daily", lastBackup: "2024-10-20T03:00:00Z" });

  return (
    <div className="space-y-5">
      <PageHeader
        title="System Settings"
        description="Platform configuration: general, email, features, maintenance, limits, backups."
        icon={<Icon name="Cog" className="h-6 w-6" />}
      />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <SectionCard title="General" description="Platform-wide basics." action={<Button size="sm" onClick={() => toast.success("General settings saved")}>Save</Button>}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="g-name">Platform name</Label><Input id="g-name" value={general.platformName} onChange={(e) => setGeneral((p) => ({ ...p, platformName: e.target.value }))} /></div>
              <div className="space-y-1.5">
                <Label>Default timezone</Label>
                <Select value={general.timezone} onValueChange={(v) => setGeneral((p) => ({ ...p, timezone: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Default currency</Label>
                <Select value={general.currency} onValueChange={(v) => setGeneral((p) => ({ ...p, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="g-email">Support email</Label><Input id="g-email" type="email" value={general.supportEmail} onChange={(e) => setGeneral((p) => ({ ...p, supportEmail: e.target.value }))} /></div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Logo</Label>
              <div className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand font-bold">JS</div>
                <div className="flex-1">
                  <p className="text-sm">jobsonn-logo.svg</p>
                  <p className="text-xs text-muted-foreground">SVG · 4.2 KB</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.info("Upload logo (demo)")}>Upload new</Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <SectionCard title="Email (SMTP)" description="Outgoing email configuration (placeholder — connect via env in production)." action={<Button size="sm" onClick={() => toast.success("Email settings saved")}>Save</Button>}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="e-host">SMTP host</Label><Input id="e-host" value={email.smtpHost} onChange={(e) => setEmail((p) => ({ ...p, smtpHost: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label htmlFor="e-port">SMTP port</Label><Input id="e-port" type="number" value={email.smtpPort} onChange={(e) => setEmail((p) => ({ ...p, smtpPort: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-1.5"><Label htmlFor="e-from">From address</Label><Input id="e-from" type="email" value={email.fromAddress} onChange={(e) => setEmail((p) => ({ ...p, fromAddress: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label htmlFor="e-name">From name</Label><Input id="e-name" value={email.fromName} onChange={(e) => setEmail((p) => ({ ...p, fromName: e.target.value }))} /></div>
            </div>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Test email sent (demo)")}>Send test email</Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <SectionCard title="Feature flags" description="Toggle platform features on/off.">
            <ul className="grid gap-2 md:grid-cols-2">
              {Object.entries(features).map(([k, v]) => (
                <li key={k} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-sm capitalize">{k.replace(/_/g, " ")}</span>
                  <Switch checked={v} onCheckedChange={(nv) => {
                    setFeatures((p) => ({ ...p, [k]: nv }));
                    toast.success(`${k.replace(/_/g, " ")} ${nv ? "enabled" : "disabled"}`);
                  }} />
                </li>
              ))}
            </ul>
            <Button size="sm" className="mt-3" onClick={() => toast.success("Feature flags saved")}>Save</Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <SectionCard title="Maintenance mode" description="Take the platform offline for maintenance.">
            <label className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Enable maintenance mode</p>
                <p className="text-xs text-muted-foreground">Users will see a maintenance page. Admins retain access.</p>
              </div>
              <Switch checked={maintenance.mode} onCheckedChange={(v) => {
                setMaintenance((p) => ({ ...p, mode: v }));
                toast.warning(v ? "Maintenance mode ON" : "Maintenance mode OFF");
              }} />
            </label>
            <div className="mt-3 space-y-1.5">
              <Label htmlFor="m-banner">Announcement banner (optional)</Label>
              <Textarea id="m-banner" value={maintenance.banner} onChange={(e) => setMaintenance((p) => ({ ...p, banner: e.target.value }))} placeholder="We're performing scheduled maintenance. Back at 3:00 AM IST." rows={2} />
            </div>
            {maintenance.mode && (
              <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
                <Icon name="AlertTriangle" className="mr-1 inline h-3.5 w-3.5" />Maintenance mode is currently ACTIVE.
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <SectionCard title="Limits" description="Rate limits and upload caps." action={<Button size="sm" onClick={() => toast.success("Limits saved")}>Save</Button>}>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5"><Label htmlFor="l-api">API rate (req/min)</Label><Input id="l-api" type="number" value={limits.apiRate} onChange={(e) => setLimits((p) => ({ ...p, apiRate: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-1.5"><Label htmlFor="l-up">Upload max (MB)</Label><Input id="l-up" type="number" value={limits.uploadMb} onChange={(e) => setLimits((p) => ({ ...p, uploadMb: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-1.5"><Label htmlFor="l-msg">Message size (chars)</Label><Input id="l-msg" type="number" value={limits.messageSize} onChange={(e) => setLimits((p) => ({ ...p, messageSize: parseInt(e.target.value) || 0 }))} /></div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <SectionCard title="Backup & restore" description="Database backup configuration.">
            <label className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Automatic backups</p>
                <p className="text-xs text-muted-foreground">Encrypted backups stored in region-ap-south-1</p>
              </div>
              <Switch checked={backup.auto} onCheckedChange={(v) => setBackup((p) => ({ ...p, auto: v }))} />
            </label>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <Select value={backup.frequency} onValueChange={(v) => setBackup((p) => ({ ...p, frequency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Last backup</Label>
                <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Success</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(backup.lastBackup).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Backup started (demo)")}>Backup now</Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Restore dialog (demo)")}>Restore from backup</Button>
              <Button size="sm" variant="ghost" onClick={() => toast.info("Backup history (demo)")}>View history</Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
