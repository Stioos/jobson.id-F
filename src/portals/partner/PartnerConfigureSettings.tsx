"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SlidersHorizontal, Globe, Bell, Plug, KeyRound, ShieldCheck, Database, Save, RotateCcw, Plus, Trash2, Copy, Download, AlertTriangle } from "lucide-react";

export function PartnerConfigureSettings() {
  const partner = CURRENT_PARTNER;

  const [general, setGeneral] = React.useState({ timezone: "Asia/Kolkata", currency: "INR", language: "en-IN", dateFormat: "DD MMM YYYY", fiscalYearStart: "April" });
  const [notifications, setNotifications] = React.useState({
    settlementEmail: true, settlementSms: false, settlementInApp: true,
    applicationEmail: true, applicationSms: false, applicationInApp: true,
    complianceEmail: true, complianceSms: true, complianceInApp: true,
    marketingEmail: false, marketingSms: false, marketingInApp: true,
    systemEmail: true, systemSms: false, systemInApp: true,
  });
  const [integrations, setIntegrations] = React.useState([
    { id: "int_001", name: "GST Portal", status: "connected", lastSync: "2 hours ago", category: "Compliance" },
    { id: "int_002", name: "HDFC Bank", status: "connected", lastSync: "5 hours ago", category: "Banking" },
    { id: "int_003", name: "Razorpay", status: "connected", lastSync: "1 hour ago", category: "Payments" },
    { id: "int_004", name: "Tally ERP", status: "disconnected", lastSync: "Never", category: "Accounting" },
    { id: "int_005", name: "Slack", status: "connected", lastSync: "10 minutes ago", category: "Communication" },
    { id: "int_006", name: "Zoho Books", status: "available", lastSync: "—", category: "Accounting" },
  ]);
  const [apiKeys, setApiKeys] = React.useState([
    { id: "apk_001", name: "Production API Key", key: "sk_live_••••••••••••4f9a", created: "2024-06-15", lastUsed: "2 hours ago" },
    { id: "apk_002", name: "Webhook Signing Key", key: "whsec_••••••••••••a2c1", created: "2024-06-15", lastUsed: "1 hour ago" },
  ]);
  const [webhooks, setWebhooks] = React.useState([
    { id: "whk_001", url: "https://api.partner.in/webhooks/jobsonn", events: ["settlement.paid", "application.approved"], active: true },
  ]);
  const [security, setSecurity] = React.useState({ mfa: true, ipAllowlist: false, sessionTimeout: "8", passwordRotation: "90" });
  const [data, setData] = React.useState({ retention: "7 years", autoExport: false });

  function save(section: string) {
    toast.success(`${section} settings saved`, { description: "Changes have been applied." });
  }
  function toggleIntegration(id: string) {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" : "connected", lastSync: i.status === "connected" ? "Just now" : "Never" } : i)));
    toast.success("Integration updated");
  }
  function copyKey(k: string) {
    navigator.clipboard?.writeText(k);
    toast.success("API key copied to clipboard");
  }
  function deleteKey(id: string) {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API key revoked");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configure Settings"
        description={`${partner.name} — advanced configuration for general preferences, notifications, integrations, API, security, and data.`}
        icon={<Icon name="SlidersHorizontal" className="h-6 w-6" />}
      />
      <PartnerDisclaimer />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general" className="text-xs"><SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> General</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs"><Bell className="mr-1.5 h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs"><Plug className="mr-1.5 h-3.5 w-3.5" /> Integrations</TabsTrigger>
          <TabsTrigger value="api" className="text-xs"><KeyRound className="mr-1.5 h-3.5 w-3.5" /> API</TabsTrigger>
          <TabsTrigger value="security" className="text-xs"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="data" className="text-xs"><Database className="mr-1.5 h-3.5 w-3.5" /> Data</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="p-6 max-w-2xl">
            <CardHeader className="p-0">
              <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-brand" /> General Preferences</CardTitle>
              <CardDescription>Localization, currency, and fiscal year settings.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select value={general.timezone} onValueChange={(v) => setGeneral({ ...general, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={general.currency} onValueChange={(v) => setGeneral({ ...general, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                      <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">£ GBP (Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <Select value={general.language} onValueChange={(v) => setGeneral({ ...general, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-IN">English (India)</SelectItem>
                      <SelectItem value="hi-IN">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="ta-IN">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date Format</Label>
                  <Select value={general.dateFormat} onValueChange={(v) => setGeneral({ ...general, dateFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Fiscal Year Start</Label>
                  <Select value={general.fiscalYearStart} onValueChange={(v) => setGeneral({ ...general, fiscalYearStart: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="April">April (India standard)</SelectItem>
                      <SelectItem value="January">January (Calendar year)</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setGeneral({ timezone: "Asia/Kolkata", currency: "INR", language: "en-IN", dateFormat: "DD MMM YYYY", fiscalYearStart: "April" })}><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Reset</Button>
                <Button onClick={() => save("General")}><Save className="mr-1.5 h-3.5 w-3.5" />Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="p-6 max-w-3xl">
            <CardHeader className="p-0">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-brand" /> Notification Preferences</CardTitle>
              <CardDescription>Choose how you receive notifications by category.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="overflow-hidden rounded-lg border">
                <div className="grid grid-cols-4 gap-2 bg-muted/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <div>Category</div>
                  <div className="text-center">Email</div>
                  <div className="text-center">SMS</div>
                  <div className="text-center">In-App</div>
                </div>
                {[
                  { key: "settlement", label: "Settlements & Payouts" },
                  { key: "application", label: "Applications & Approvals" },
                  { key: "compliance", label: "Compliance & Deadlines" },
                  { key: "marketing", label: "Marketing & Campaigns" },
                  { key: "system", label: "System & Security" },
                ].map((cat) => (
                  <div key={cat.key} className="grid grid-cols-4 gap-2 px-4 py-3 border-t items-center">
                    <div className="text-sm">{cat.label}</div>
                    <div className="flex justify-center"><Switch checked={notifications[`${cat.key}Email` as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [`${cat.key}Email`]: v })} /></div>
                    <div className="flex justify-center"><Switch checked={notifications[`${cat.key}Sms` as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [`${cat.key}Sms`]: v })} /></div>
                    <div className="flex justify-center"><Switch checked={notifications[`${cat.key}InApp` as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [`${cat.key}InApp`]: v })} /></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => save("Notification")}><Save className="mr-1.5 h-3.5 w-3.5" />Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base flex items-center gap-2"><Plug className="h-4 w-4 text-brand" /> Connected Apps</CardTitle>
              <CardDescription>Manage your third-party integrations.</CardDescription>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((i) => (
                <Card key={i.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Plug className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{i.name}</p>
                        <p className="text-[10px] text-muted-foreground">{i.category}</p>
                      </div>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">Last sync: {i.lastSync}</p>
                  <Button size="sm" variant={i.status === "connected" ? "outline" : "default"} className="mt-3 w-full" disabled={i.status === "available"} onClick={() => toggleIntegration(i.id)}>
                    {i.status === "connected" ? "Disconnect" : i.status === "available" ? "Coming Soon" : "Connect"}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-4">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4 flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-4 w-4 text-brand" /> API Keys</CardTitle>
                <CardDescription>Manage API keys for programmatic access.</CardDescription>
              </div>
              <Button size="sm" onClick={() => toast.success("New API key generated", { description: "Copy and store securely — shown only once." })}><Plus className="mr-1.5 h-3.5 w-3.5" />Generate Key</Button>
            </CardHeader>
            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{k.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{k.key}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Created {k.created} · Last used {k.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => copyKey(k.key)}><Copy className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-rose-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
                          <AlertDialogDescription>This will immediately invalidate the key "{k.name}". Any application using it will lose access. This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteKey(k.id)} className="bg-rose-600 hover:bg-rose-700">Revoke</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader className="p-0 mb-4 flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2"><Plug className="h-4 w-4 text-brand" /> Webhooks</CardTitle>
                <CardDescription>Configure webhook endpoints to receive real-time events.</CardDescription>
              </div>
              <Button size="sm" onClick={() => toast.success("Webhook endpoint added", { description: "Verification pending." })}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Endpoint</Button>
            </CardHeader>
            <div className="space-y-2">
              {webhooks.map((w) => (
                <div key={w.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono">{w.url}</p>
                    <Switch checked={w.active} onCheckedChange={(v) => setWebhooks((prev) => prev.map((x) => (x.id === w.id ? { ...x, active: v } : x)))} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {w.events.map((e) => <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="p-6 max-w-2xl">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" /> Security Settings</CardTitle>
              <CardDescription>Multi-factor authentication, IP restrictions, and session policies.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Multi-Factor Authentication (MFA)</p>
                  <p className="text-xs text-muted-foreground">Require TOTP or SMS verification at login.</p>
                </div>
                <Switch checked={security.mfa} onCheckedChange={(v) => setSecurity({ ...security, mfa: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">IP Allowlist</p>
                  <p className="text-xs text-muted-foreground">Only allow access from approved IP addresses.</p>
                </div>
                <Switch checked={security.ipAllowlist} onCheckedChange={(v) => setSecurity({ ...security, ipAllowlist: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Session Timeout (hours)</Label>
                  <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({ ...security, sessionTimeout: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Password Rotation (days)</Label>
                  <Select value={security.passwordRotation} onValueChange={(v) => setSecurity({ ...security, passwordRotation: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => save("Security")}><Save className="mr-1.5 h-3.5 w-3.5" />Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data">
          <Card className="p-6 max-w-2xl">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-brand" /> Data Management</CardTitle>
              <CardDescription>Retention policy, data export, and account deletion.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-1.5">
                <Label>Data Retention Period</Label>
                <Select value={data.retention} onValueChange={(v) => setData({ ...data, retention: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 years">3 years</SelectItem>
                    <SelectItem value="5 years">5 years</SelectItem>
                    <SelectItem value="7 years">7 years (compliance)</SelectItem>
                    <SelectItem value="10 years">10 years</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Per DPDP Act and GST law, financial records must be retained for at least 7 years.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Auto-export (Monthly)</p>
                  <p className="text-xs text-muted-foreground">Automatically export all data monthly to your email.</p>
                </div>
                <Switch checked={data.autoExport} onCheckedChange={(v) => setData({ ...data, autoExport: v })} />
              </div>
              <div className="rounded-lg border p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2"><Download className="h-4 w-4" /> Export All Data</p>
                    <p className="text-xs text-muted-foreground">Download a complete archive of your partner data (JSON + CSV).</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Export started", { description: "Archive will be emailed within 24 hours." })}>Export</Button>
                </div>
              </div>
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2 text-rose-700"><AlertTriangle className="h-4 w-4" /> Delete Account & Data</p>
                    <p className="text-xs text-rose-700/80">Permanently delete your partner account and all associated data. This cannot be undone.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
                        <AlertDialogDescription>You will lose all data including settlements, transactions, students, and certificates. Financial records will be retained for 7 years per legal requirements. Type DELETE to confirm.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.error("Account deletion requires written confirmation", { description: "Please contact support@jobsonn.com." })} className="bg-rose-600 hover:bg-rose-700">Confirm Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => save("Data")}><Save className="mr-1.5 h-3.5 w-3.5" />Save Data Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
