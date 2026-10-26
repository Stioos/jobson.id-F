"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Cog, Globe, Mail, ToggleLeft, Wrench, Shield, Database, Save, Download, Upload, RefreshCw, Trash2, AlertTriangle,
} from "lucide-react";

export function AdminSystemSettings() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [backupOpen, setBackupOpen] = React.useState(false);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved`, { description: "Changes are now live across the platform." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure platform-wide settings — general, email, features, maintenance, limits, security, and backups."
        icon={<Cog className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "System Settings" }]}
        actions={[
          { label: "Save All", variant: "default", onClick: () => toast.success("All settings saved", { description: "All configuration changes applied successfully." }) },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 h-auto">
          <TabsTrigger value="general" className="text-xs"><Globe className="mr-1 h-3 w-3" /> General</TabsTrigger>
          <TabsTrigger value="email" className="text-xs"><Mail className="mr-1 h-3 w-3" /> Email</TabsTrigger>
          <TabsTrigger value="features" className="text-xs"><ToggleLeft className="mr-1 h-3 w-3" /> Features</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs"><Wrench className="mr-1 h-3 w-3" /> Maintenance</TabsTrigger>
          <TabsTrigger value="limits" className="text-xs"><Cog className="mr-1 h-3 w-3" /> Limits</TabsTrigger>
          <TabsTrigger value="security" className="text-xs"><Shield className="mr-1 h-3 w-3" /> Security</TabsTrigger>
          <TabsTrigger value="backup" className="text-xs"><Database className="mr-1 h-3 w-3" /> Backup</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <SectionCard title="General Platform Settings" description="Basic platform configuration">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Platform Name"><Input defaultValue="JOBSONN Talent Solutions" /></Field>
              <Field label="Support Email"><Input type="email" defaultValue="support@jobsonn.com" /></Field>
              <Field label="Timezone">
                <Select defaultValue="ist">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">America/New_York (EST)</SelectItem>
                    <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency">
                <Select defaultValue="inr">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                    <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                    <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                    <SelectItem value="gbp">£ British Pound (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date Format">
                <Select defaultValue="dmy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Fiscal Year Start">
                <Select defaultValue="apr">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apr">April 1 (Indian FY)</SelectItem>
                    <SelectItem value="jan">January 1 (Calendar Year)</SelectItem>
                    <SelectItem value="oct">October 1 (US FY)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave("General")}><Save className="mr-1 h-4 w-4" /> Save General</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <div className="space-y-4">
            <SectionCard title="SMTP Configuration" description="Outbound email server settings">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="SMTP Host"><Input defaultValue="smtp.jobsonn.com" /></Field>
                <Field label="SMTP Port"><Input defaultValue="587" /></Field>
                <Field label="Username"><Input defaultValue="noreply@jobsonn.com" /></Field>
                <Field label="Password"><Input type="password" defaultValue="****************" /></Field>
                <Field label="Encryption">
                  <Select defaultValue="tls">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="From Name"><Input defaultValue="JOBSONN Team" /></Field>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success("Test email sent", { description: "Test email sent to support@jobsonn.com. Check inbox in 1-2 minutes." })}>
                  <RefreshCw className="mr-1 h-4 w-4" /> Send Test
                </Button>
                <Button onClick={() => handleSave("Email")}><Save className="mr-1 h-4 w-4" /> Save</Button>
              </div>
            </SectionCard>

            <SectionCard title="Email Templates" description="System email templates">
              <div className="space-y-2">
                {[
                  { name: "Welcome Email", subject: "Welcome to JOBSONN, {{name}}!", lastEdited: "2 days ago" },
                  { name: "Invoice Generated", subject: "Invoice {{invoice_number}} — {{amount}}", lastEdited: "1 week ago" },
                  { name: "Payment Confirmation", subject: "Payment received — {{amount}}", lastEdited: "3 days ago" },
                  { name: "Program Enrollment", subject: "You're enrolled in {{program_name}}", lastEdited: "5 days ago" },
                  { name: "Certificate Issued", subject: "Your certificate is ready", lastEdited: "1 month ago" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">Subject: {t.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Edited {t.lastEdited}</span>
                      <Button variant="outline" size="sm" onClick={() => toast.info(`Editing ${t.name}`)}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          <SectionCard title="Feature Flags" description="Toggle platform features on/off globally">
            <div className="space-y-3">
              {[
                { name: "AI-powered Talent Search", desc: "Simulated AI candidate matching", enabled: true },
                { name: "Real-time Placements Tracking", desc: "Live placement drive dashboard", enabled: true },
                { name: "Partner Portal", desc: "Franchise partner self-service portal", enabled: true },
                { name: "Corporate Academies", desc: "White-labeled client academies", enabled: true },
                { name: "Video Interview Platform", desc: "Built-in video interviewing", enabled: false },
                { name: "Public Career Resources", desc: "Blog & career resources on public site", enabled: true },
                { name: "Referral Program", desc: "Candidate referral tracking & rewards", enabled: true },
                { name: "Gamification (Leaderboards)", desc: "Learner leaderboards & badges", enabled: false },
              ].map((f) => (
                <FeatureToggle key={f.name} name={f.name} desc={f.desc} enabled={f.enabled} onChange={(v) => toast.info(`${f.name} ${v ? "enabled" : "disabled"}`)} />
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave("Features")}><Save className="mr-1 h-4 w-4" /> Save Feature Flags</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <div className="space-y-4">
            <Alert className={maintenanceMode ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/30 bg-emerald-500/5"}>
              <AlertTriangle className={`h-4 w-4 ${maintenanceMode ? "text-rose-600" : "text-emerald-600"}`} />
              <AlertTitle className={maintenanceMode ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}>
                {maintenanceMode ? "Maintenance Mode ACTIVE" : "Platform Operating Normally"}
              </AlertTitle>
              <AlertDescription>
                {maintenanceMode
                  ? "All non-admin users are seeing the maintenance banner. Sign-in is restricted to admins only."
                  : "All users can sign in and use the platform normally."}
              </AlertDescription>
            </Alert>

            <SectionCard title="Maintenance Mode" description="Temporarily restrict platform access">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Enable Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Restricts access to admin-only. All other users see maintenance banner.</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <div className="mt-4 space-y-2">
                <Field label="Maintenance Banner Message">
                  <Textarea defaultValue="We're performing scheduled maintenance. Platform will be back by 2:00 AM IST. Thank you for your patience." />
                </Field>
                <Field label="Expected End Time">
                  <Input defaultValue="2024-10-20T02:00" type="datetime-local" />
                </Field>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => handleSave("Maintenance")}><Save className="mr-1 h-4 w-4" /> Save Maintenance Config</Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Limits */}
        <TabsContent value="limits">
          <SectionCard title="Platform Limits" description="Rate limits, upload limits, and quotas">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="API Rate Limit (requests/min)"><Input type="number" defaultValue="1000" /></Field>
              <Field label="File Upload Max Size (MB)"><Input type="number" defaultValue="50" /></Field>
              <Field label="Resume Upload Max (MB)"><Input type="number" defaultValue="5" /></Field>
              <Field label="Video Upload Max (MB)"><Input type="number" defaultValue="500" /></Field>
              <Field label="Bulk Import Batch Size"><Input type="number" defaultValue="1000" /></Field>
              <Field label="Max Sessions per User"><Input type="number" defaultValue="5" /></Field>
              <Field label="Search Results per Page"><Input type="number" defaultValue="20" /></Field>
              <Field label="Email Daily Send Limit"><Input type="number" defaultValue="500" /></Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave("Limits")}><Save className="mr-1 h-4 w-4" /> Save Limits</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <SectionCard title="Global Security Policy" description="Platform-wide security configuration">
            <div className="space-y-3">
              <FeatureToggle name="Require MFA for all admins" desc="Force multi-factor auth for all admin users" enabled onChange={(v) => toast.info(`MFA enforcement ${v ? "enabled" : "disabled"}`)} />
              <FeatureToggle name="Require MFA for all employers" desc="Force MFA for employer portal users" enabled={false} onChange={(v) => toast.info(`Employer MFA ${v ? "enabled" : "disabled"}`)} />
              <FeatureToggle name="IP Allowlist Enforcement" desc="Only allow sign-ins from whitelisted IPs" enabled={false} onChange={(v) => toast.info(`IP allowlist ${v ? "enabled" : "disabled"}`)} />
              <FeatureToggle name="SSO Required (SAML 2.0)" desc="Require SSO for admin portal access" enabled={false} onChange={(v) => toast.info(`SSO ${v ? "required" : "optional"}`)} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Session Timeout (minutes)"><Input type="number" defaultValue="60" /></Field>
              <Field label="Password Rotation (days)"><Input type="number" defaultValue="90" /></Field>
              <Field label="Max Login Attempts"><Input type="number" defaultValue="5" /></Field>
              <Field label="Lockout Duration (minutes)"><Input type="number" defaultValue="30" /></Field>
            </div>

            <div className="mt-4">
              <Field label="IP Allowlist (one IP/CIDR per line)">
                <Textarea
                  rows={4}
                  defaultValue={"10.0.0.0/8\n203.0.113.0/24\n192.168.1.0/24"}
                  className="font-mono text-xs"
                />
              </Field>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave("Security")}><Save className="mr-1 h-4 w-4" /> Save Security Policy</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <div className="space-y-4">
            <SectionCard title="Backup Configuration" description="Automated database backups">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Backup Frequency">
                  <Select defaultValue="daily">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily (2:00 AM IST)</SelectItem>
                      <SelectItem value="weekly">Weekly (Sunday 2:00 AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Retention Period (days)"><Input type="number" defaultValue="30" /></Field>
                <Field label="Backup Destination">
                  <Select defaultValue="s3">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s3">AWS S3 (jobsonn-backups)</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="local">Local Disk</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Encryption"><Switch defaultChecked /></Field>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setBackupOpen(true)}><RefreshCw className="mr-1 h-4 w-4" /> Restore from Backup</Button>
                <Button variant="outline" onClick={() => toast.success("Backup started", { description: "Manual backup queued. Estimated completion in 8 minutes." })}><Download className="mr-1 h-4 w-4" /> Backup Now</Button>
                <Button onClick={() => handleSave("Backup")}><Save className="mr-1 h-4 w-4" /> Save Config</Button>
              </div>
            </SectionCard>

            <SectionCard title="Backup History" description="Recent automated & manual backups">
              <div className="space-y-2">
                {[
                  { id: "bkp_001", date: "Today, 2:00 AM", size: "2.4 GB", type: "Automated", status: "success" },
                  { id: "bkp_002", date: "Yesterday, 2:00 AM", size: "2.4 GB", type: "Automated", status: "success" },
                  { id: "bkp_003", date: "Oct 18, 2:00 AM", size: "2.3 GB", type: "Automated", status: "success" },
                  { id: "bkp_004", date: "Oct 17, 11:30 AM", size: "2.3 GB", type: "Manual", status: "success" },
                  { id: "bkp_005", date: "Oct 17, 2:00 AM", size: "2.3 GB", type: "Automated", status: "failed" },
                ].map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Database className={`h-5 w-5 ${b.status === "success" ? "text-emerald-500" : "text-rose-500"}`} />
                      <div>
                        <p className="text-sm font-medium">{b.date}</p>
                        <p className="text-xs text-muted-foreground">{b.id} • {b.size} • {b.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={b.status === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]" : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]"}>
                        {b.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => toast.info(`Downloading ${b.id}`)}><Download className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <AlertDialog open={backupOpen} onOpenChange={setBackupOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restore from Backup?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will overwrite all current data with the selected backup. The platform will be offline for ~15 minutes during restore. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => { toast.success("Restore started", { description: "Platform will be back online in ~15 minutes." }); setBackupOpen(false); }}>
                  <Upload className="mr-1 h-4 w-4" /> Restore Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeatureToggle({ name, desc, enabled, onChange }: { name: string; desc: string; enabled: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch
        checked={on}
        onCheckedChange={(v) => { setOn(v); onChange?.(v); }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
