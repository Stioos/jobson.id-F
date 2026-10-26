"use client";

import * as React from "react";
import { User, Building2, Bell, Key, Shield, Save, KeyRound, Plus, Trash2, Smartphone, Monitor } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { agencies } from "@/lib/mock-data";

export function RecruiterSettings() {
  const { user } = useAuth();
  const agency = agencies[0];
  const [name, setName] = React.useState(user?.name ?? "Sneha Reddy");
  const [email, setEmail] = React.useState(user?.email ?? "sneha@talentbridge.in");
  const [phone, setPhone] = React.useState("+91 98765 43210");
  const [bio, setBio] = React.useState("Senior recruiter specializing in engineering & product hires for high-growth tech companies.");

  const [notif, setNotif] = React.useState({ submissionUpdates: true, interviewReminders: true, weeklyDigest: false, productUpdates: false });
  const [keys, setKeys] = React.useState([
    { id: "k1", name: "Personal Slack bot", prefix: "jb_live_8a3f", createdAt: "2024-08-12", lastUsed: "2 hours ago" },
    { id: "k2", name: "Sourcing automation", prefix: "jb_live_2c71", createdAt: "2024-09-04", lastUsed: "yesterday" },
  ]);
  const [revokeKey, setRevokeKey] = React.useState<typeof keys[number] | null>(null);

  const [sessions, setSessions] = React.useState([
    { id: "s1", device: "Chrome on macOS", location: "Bengaluru, IN", ip: "203.0.113.42", lastActive: "Current session", current: true, icon: "monitor" as const },
    { id: "s2", device: "JOBSONN iOS app", location: "Bengaluru, IN", ip: "203.0.113.88", lastActive: "2 hours ago", current: false, icon: "phone" as const },
    { id: "s3", device: "Edge on Windows", location: "Hyderabad, IN", ip: "198.51.100.10", lastActive: "yesterday", current: false, icon: "monitor" as const },
  ]);
  const [revokeSession, setRevokeSession] = React.useState<typeof sessions[number] | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your recruiter profile, agency link, notifications, SSO, and API keys."
        actions={[{ label: "Save all", onClick: () => toast.success("Settings saved") }]}
      />

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile"><User className="mr-1.5 h-3.5 w-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="agency"><Building2 className="mr-1.5 h-3.5 w-3.5" /> Agency</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="sso"><Shield className="mr-1.5 h-3.5 w-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="api"><Key className="mr-1.5 h-3.5 w-3.5" /> API keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <SectionCard title="Recruiter profile" description="Visible to clients and candidates.">
            <div className="flex items-center gap-4">
              <AvatarLogo text={name} size="xl" />
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{agency.name}</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Avatar upload dialog opened")}>
                  Change avatar
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="p-phone">Phone</Label>
                <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value="Senior Recruiter" disabled />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="p-bio">Bio</Label>
              <Textarea id="p-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => toast.success("Profile saved")}><Save className="mr-1 h-4 w-4" /> Save profile</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="agency" className="space-y-4">
          <SectionCard title="Agency link" description="Your parent agency. Contact an agency admin to change roles.">
            <div className="flex items-start gap-4 rounded-xl border bg-muted/30 p-4">
              <AvatarLogo text={agency.name} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{agency.name}</p>
                <p className="text-xs text-muted-foreground">{agency.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {agency.specialties.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                  {agency.verified && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>}
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Recruiters</dt><dd className="font-semibold">{agency.recruiterCount}</dd></div>
                  <div><dt className="text-muted-foreground">Clients</dt><dd className="font-semibold">{agency.clientCount}</dd></div>
                  <div><dt className="text-muted-foreground">Placements</dt><dd className="font-semibold">{agency.placementCount}</dd></div>
                </dl>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              To switch agencies or update your role, contact your agency admin.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <SectionCard title="Notification preferences" description="Choose what we email and push to your device.">
            <ul className="divide-y">
              {[
                { key: "submissionUpdates" as const, label: "Submission status updates", desc: "Client viewed, shortlisted, rejected, etc." },
                { key: "interviewReminders" as const, label: "Interview reminders", desc: "1 hour before scheduled interviews" },
                { key: "weeklyDigest" as const, label: "Weekly performance digest", desc: "Your submissions, placements, and commission summary" },
                { key: "productUpdates" as const, label: "Product updates", desc: "New features and announcements" },
              ].map((row) => (
                <li key={row.key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>
                  <Switch
                    checked={notif[row.key]}
                    onCheckedChange={(v) => setNotif((prev) => ({ ...prev, [row.key]: v }))}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => toast.success("Notification preferences saved")}><Save className="mr-1 h-4 w-4" /> Save</Button>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="sso" className="space-y-4">
          <SectionCard title="Single sign-on (SSO)" description="SSO is managed by your agency admin. Personal MFA is available below.">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-medium">SSO via Okta</p>
              <p className="mt-1 text-xs text-muted-foreground">Configured by TalentBridge Consulting. Sign in via your agency's identity provider.</p>
              <Badge variant="outline" className="mt-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
            </div>
            <div className="mt-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication (MFA)</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch defaultChecked={false} onCheckedChange={(v) => toast.success(v ? "MFA enabled" : "MFA disabled")} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Active sessions"
            description="Devices currently signed in to your recruiter account. Revoke any you don't recognize."
          >
            <ul className="divide-y">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {s.icon === "phone" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {s.device}
                      {s.current && <Badge variant="outline" className="ml-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">This device</Badge>}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.ip} · {s.lastActive}</p>
                  </div>
                  {!s.current && (
                    <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-500/10" onClick={() => setRevokeSession(s)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Signed out everywhere else", { description: "Only this session remains active." })}>
              Sign out all other sessions
            </Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <SectionCard
            title="API keys"
            description="Use API keys to integrate JOBSONN with your ATS, sourcing tools, or automation."
            action={<Button size="sm" onClick={() => toast.success("API key generated", { description: "Copy the key — it won't be shown again." })}><Plus className="mr-1 h-3.5 w-3.5" /> Generate key</Button>}
          >
            <ul className="space-y-2">
              {keys.map((k) => (
                <li key={k.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{k.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{k.prefix}••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="hidden sm:block text-right">
                      <p>Created {k.createdAt}</p>
                      <p>Last used {k.lastUsed}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setRevokeKey(k)} className="text-rose-600 hover:bg-rose-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!revokeKey} onOpenChange={(v) => !v && setRevokeKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeKey && <>This permanently revokes <strong>{revokeKey.name}</strong> ({revokeKey.prefix}••••). Any system using this key will lose access immediately.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (revokeKey) {
                  setKeys((prev) => prev.filter((k) => k.id !== revokeKey.id));
                  toast.success("API key revoked", { description: revokeKey.name });
                }
                setRevokeKey(null);
              }}
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!revokeSession} onOpenChange={(v) => !v && setRevokeSession(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke session?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeSession && <>This signs out <strong>{revokeSession.device}</strong> ({revokeSession.location}). The user on that device will need to sign in again.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (revokeSession) {
                  setSessions((prev) => prev.filter((s) => s.id !== revokeSession.id));
                  toast.success("Session revoked", { description: revokeSession.device });
                }
                setRevokeSession(null);
              }}
            >
              Revoke session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
