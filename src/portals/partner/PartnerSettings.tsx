"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Settings, Users, Bell, Lock, Key, Plus, Save, Copy, Smartphone, Globe } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Counsellor" | "Trainer" | "Finance";
  lastActive: string;
  status: "active" | "invited" | "suspended";
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "tm_001", name: "Rajesh Kumar", email: "rajesh@chennaittechacademy.in", role: "Admin", lastActive: new Date(Date.now() - 1 * 3600000).toISOString(), status: "active" },
  { id: "tm_002", name: "Lakshmi Nair", email: "lakshmi@chennaittechacademy.in", role: "Manager", lastActive: new Date(Date.now() - 5 * 3600000).toISOString(), status: "active" },
  { id: "tm_003", name: "Priya S", email: "priya@chennaittechacademy.in", role: "Counsellor", lastActive: new Date(Date.now() - 2 * 86400000).toISOString(), status: "active" },
  { id: "tm_004", name: "Anand R", email: "anand@chennaittechacademy.in", role: "Trainer", lastActive: new Date(Date.now() - 12 * 3600000).toISOString(), status: "active" },
  { id: "tm_005", name: "Meena V", email: "meena@chennaittechacademy.in", role: "Finance", lastActive: new Date(Date.now() - 30 * 86400000).toISOString(), status: "invited" },
];

export function PartnerSettings() {
  const partner = CURRENT_PARTNER;
  const [team, setTeam] = React.useState<TeamMember[]>(INITIAL_TEAM);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [notifPrefs, setNotifPrefs] = React.useState({
    leadAlerts: true,
    settlementUpdates: true,
    complianceReminders: true,
    marketingDigest: false,
    weeklyReport: true,
    productUpdates: true,
  });
  const [mfaEnabled, setMfaEnabled] = React.useState(false);

  function updateRole(id: string, role: TeamMember["role"]) {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated", { description: `${team.find((m) => m.id === id)?.name} → ${role}` });
  }

  function removeMember(id: string) {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    toast.success("Team member removed");
  }

  function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newM: TeamMember = {
      id: `tm_${Date.now()}`,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      role: fd.get("role") as TeamMember["role"],
      lastActive: new Date().toISOString(),
      status: "invited",
    };
    setTeam((prev) => [...prev, newM]);
    setInviteOpen(false);
    toast.success("Invitation sent", { description: `${newM.email} · ${newM.role}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={`${partner.name} — manage account, notifications, team, security, and API.`}
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <PartnerDisclaimer />

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account"><Settings className="h-4 w-4 mr-1.5" /> Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="team"><Users className="h-4 w-4 mr-1.5" /> Team</TabsTrigger>
          <TabsTrigger value="security"><Lock className="h-4 w-4 mr-1.5" /> Security</TabsTrigger>
          <TabsTrigger value="api"><Key className="h-4 w-4 mr-1.5" /> API</TabsTrigger>
        </TabsList>

        {/* Account tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization Details</CardTitle>
              <CardDescription>Update your partner organization profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Account settings saved"); }}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-name">Display Name</Label>
                    <Input id="acc-name" defaultValue={partner.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-legal">Legal Name</Label>
                    <Input id="acc-legal" defaultValue={partner.legalName} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-email">Contact Email</Label>
                    <Input id="acc-email" type="email" defaultValue={partner.contactEmail} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-phone">Contact Phone</Label>
                    <Input id="acc-phone" defaultValue={partner.contactPhone} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-city">City</Label>
                    <Input id="acc-city" defaultValue={partner.city} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-state">State</Label>
                    <Input id="acc-state" defaultValue={partner.state} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-territory">Territory</Label>
                    <Input id="acc-territory" defaultValue={partner.territory ?? ""} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what we email and push to your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {([
                { key: "leadAlerts" as const, label: "Lead alerts", desc: "Get notified when a new lead is captured" },
                { key: "settlementUpdates" as const, label: "Settlement updates", desc: "Notifications for settlement cycles & payouts" },
                { key: "complianceReminders" as const, label: "Compliance reminders", desc: "Alerts for upcoming & overdue compliance items" },
                { key: "marketingDigest" as const, label: "Marketing digest", desc: "Weekly summary of campaign performance" },
                { key: "weeklyReport" as const, label: "Weekly report", desc: "Every Monday: last week's KPIs and trends" },
                { key: "productUpdates" as const, label: "Product updates", desc: "New features & changes to the partner portal" },
              ]).map((n) => (
                <div key={n.key} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notifPrefs[n.key]}
                    onCheckedChange={(c) => {
                      setNotifPrefs((prev) => ({ ...prev, [n.key]: c }));
                      toast.success(`${n.label} ${c ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Team Members</CardTitle>
                <CardDescription>{team.length} member(s) · {team.filter((m) => m.status === "active").length} active</CardDescription>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> Invite</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={m.name} size="sm" />
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={m.role} onValueChange={(r) => updateRole(m.id, r as TeamMember["role"])}>
                          <SelectTrigger className="w-32 h-8" size="sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Counsellor">Counsellor</SelectItem>
                            <SelectItem value="Trainer">Trainer</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(m.lastActive)}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">Remove</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove {m.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                They will lose access to the partner portal immediately. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeMember(m.id)}>Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Protect your partner account with MFA and session management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Multi-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Require a 6-digit code at sign-in.</p>
                  </div>
                </div>
                <Switch checked={mfaEnabled} onCheckedChange={(c) => { setMfaEnabled(c); toast.success(`MFA ${c ? "enabled" : "disabled"}`); }} />
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium mb-2">Active Sessions</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span><Globe className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Chrome · macOS · Chennai</span>
                    <span className="text-xs text-muted-foreground">Current · {timeAgo(new Date(Date.now() - 30 * 60000).toISOString())}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span><Globe className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Safari · iOS · Chennai</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(new Date(Date.now() - 8 * 3600000).toISOString())}</span>
                  </li>
                </ul>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Signed out of all other sessions")}>Sign out all others</Button>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium mb-2">Password</p>
                <Button size="sm" variant="outline" onClick={() => toast.success("Password reset link sent to your email")}>Change password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Credentials</CardTitle>
              <CardDescription>Use these to integrate with jobson.id partner APIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Partner ID</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="text-sm font-mono">{partner.id}</code>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(partner.id); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">API Key</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="text-sm font-mono">ptn_live_••••••••••••••3a8f</code>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("API key revealed", { description: "Copy it now — it won't be shown again" })}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Webhook URL</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="text-sm font-mono truncate">https://api.jobson.id/v1/partner/{partner.id}/webhook</code>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(`https://api.jobson.id/v1/partner/${partner.id}/webhook`); toast.success("Webhook URL copied"); }}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.success("New API key generated", { description: "Old key invalidated" })}>Rotate Key</Button>
                <Button variant="outline" onClick={() => toast.success("API docs opened")}>View Docs</Button>
              </div>
              <p className="text-xs text-muted-foreground">Rate limit: 1000 req/hour. Contact support for higher limits.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite dialog */}
      {inviteOpen && (
        <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Invite Team Member</AlertDialogTitle>
              <AlertDialogDescription>Send an invitation to join your partner portal.</AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleInvite} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-name">Name</Label>
                <Input id="inv-name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-email">Email</Label>
                <Input id="inv-email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-role">Role</Label>
                <Select name="role" defaultValue="Counsellor">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Counsellor">Counsellor</SelectItem>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Send Invite</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
