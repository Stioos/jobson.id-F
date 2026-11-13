"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/store";
import { formatDateTime, formatDate } from "@/lib/format";

const accountSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone required"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});
type AccountForm = z.infer<typeof accountSchema>;

export function CandidateSettings() {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = React.useState(false);
  const [consents, setConsents] = React.useState({
    marketing: true,
    data_sharing: false,
    analytics: true,
    profile_indexing: true,
  });
  const [notifications, setNotifications] = React.useState({
    application_updates: true,
    interview_reminders: true,
    job_alerts: true,
    marketing_emails: false,
    weekly_digest: true,
  });
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name ?? "Priya Nair",
      email: user?.email ?? "priya.nair@gmail.com",
      phone: "+91 99887 76655",
    },
  });

  function onAccountSubmit(values: AccountForm) {
    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Account updated", {
      description: values.newPassword ? "Profile and password updated." : "Profile updated.",
    });
  }

  function toggleConsent(key: keyof typeof consents) {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Privacy preference updated");
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function downloadData() {
    toast.success("Data export requested", {
      description: "We'll email you a download link within 48 hours.",
    });
  }

  function deleteAccount() {
    setDeleteOpen(false);
    toast.success("Account deletion scheduled", {
      description: "Your account will be permanently deleted in 30 days.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy & Settings"
        description="Manage your account, privacy, notifications, and security."
      />

      <Tabs defaultValue="account">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="account" className="gap-1">
            <Icon name="User" className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-1">
            <Icon name="Shield" className="h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1">
            <Icon name="Bell" className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <Icon name="Lock" className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-1">
            <Icon name="Database" className="h-4 w-4" /> Data
          </TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account">
          <SectionCard title="Account details" description="Update your name, contact, and password.">
            <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...accountForm.register("name")} />
                  {accountForm.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {accountForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...accountForm.register("email")} />
                  {accountForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {accountForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...accountForm.register("phone")} />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Change password
                </p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cp">Current</Label>
                    <Input id="cp" type="password" {...accountForm.register("currentPassword")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="np">New</Label>
                    <Input id="np" type="password" {...accountForm.register("newPassword")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cnp">Confirm</Label>
                    <Input id="cnp" type="password" {...accountForm.register("confirmPassword")} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <SectionCard title="Privacy & consent" description="Control how your data is used.">
            <div className="space-y-3">
              <ConsentRow
                icon="Megaphone"
                title="Marketing emails"
                description="Receive promotional emails about new features and offers."
                checked={consents.marketing}
                onToggle={() => toggleConsent("marketing")}
              />
              <ConsentRow
                icon="Users"
                title="Data sharing with partners"
                description="Share anonymized data with trusted hiring partners for better matches."
                checked={consents.data_sharing}
                onToggle={() => toggleConsent("data_sharing")}
              />
              <ConsentRow
                icon="BarChart3"
                title="Analytics"
                description="Help us improve jobson.id by sharing usage analytics."
                checked={consents.analytics}
                onToggle={() => toggleConsent("analytics")}
              />
              <ConsentRow
                icon="Search"
                title="Profile indexing"
                description="Allow your profile to appear in search engines (Google, etc.)."
                checked={consents.profile_indexing}
                onToggle={() => toggleConsent("profile_indexing")}
              />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <SectionCard title="Notification preferences" description="Choose what you want to be notified about.">
            <div className="space-y-3">
              <NotifRow
                icon="Inbox"
                title="Application updates"
                description="Status changes on your applications."
                checked={notifications.application_updates}
                onToggle={() => toggleNotification("application_updates")}
              />
              <NotifRow
                icon="Calendar"
                title="Interview reminders"
                description="Reminders 24h and 1h before scheduled interviews."
                checked={notifications.interview_reminders}
                onToggle={() => toggleNotification("interview_reminders")}
              />
              <NotifRow
                icon="Bell"
                title="Job alerts"
                description="Notifications for jobs matching your saved searches."
                checked={notifications.job_alerts}
                onToggle={() => toggleNotification("job_alerts")}
              />
              <NotifRow
                icon="Mail"
                title="Marketing emails"
                description="Tips, articles, and promotional content."
                checked={notifications.marketing_emails}
                onToggle={() => toggleNotification("marketing_emails")}
              />
              <NotifRow
                icon="FileBarChart"
                title="Weekly digest"
                description="A weekly summary of your activity and recommendations."
                checked={notifications.weekly_digest}
                onToggle={() => toggleNotification("weekly_digest")}
              />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <SectionCard title="Two-factor authentication" description="Add an extra layer of security.">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name="KeyRound" className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Authenticator app</p>
                  <p className="text-xs text-muted-foreground">
                    Use Google Authenticator, 1Password, or similar.
                  </p>
                </div>
              </div>
              <Switch
                checked={mfaEnabled}
                onCheckedChange={(v) => {
                  setMfaEnabled(v);
                  toast.success(v ? "MFA enabled" : "MFA disabled");
                }}
              />
            </div>
          </SectionCard>

          <SectionCard title="Active sessions" description="Devices currently signed in.">
            <div className="space-y-2">
              <SessionRow
                device="Chrome · macOS"
                location="Bengaluru, India"
                lastActive="Active now"
                current
              />
              <SessionRow
                device="Safari · iPhone"
                location="Bengaluru, India"
                lastActive="2 hours ago"
              />
              <SessionRow
                device="Firefox · Linux"
                location="Mumbai, India"
                lastActive="3 days ago"
              />
            </div>
          </SectionCard>

          <SectionCard title="Login history" description="Recent sign-in events.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>IP address</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "2024-10-21T08:30:00Z", ip: "203.0.113.42", device: "Chrome · macOS", loc: "Bengaluru" },
                    { date: "2024-10-20T19:12:00Z", ip: "203.0.113.42", device: "Safari · iPhone", loc: "Bengaluru" },
                    { date: "2024-10-19T14:20:00Z", ip: "203.0.113.51", device: "Firefox · Linux", loc: "Mumbai" },
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{formatDateTime(row.date)}</TableCell>
                      <TableCell className="font-mono text-xs">{row.ip}</TableCell>
                      <TableCell className="text-xs">{row.device}</TableCell>
                      <TableCell className="text-xs">{row.loc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data" className="space-y-4">
          <SectionCard
            title="Download your data"
            description="Export a copy of all data jobson.id holds about you."
          >
            <div className="flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Data export</p>
                <p className="text-xs text-muted-foreground">
                  Includes profile, applications, messages, and activity logs. Delivered as
                  a ZIP archive within 48 hours.
                </p>
              </div>
              <Button onClick={downloadData}>
                <Icon name="FileStack" className="h-4 w-4" /> Request export
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            title="Delete account"
            description="Permanently delete your account and all associated data."
          >
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div className="flex-1">
                  <p className="font-medium text-rose-700 dark:text-rose-400">
                    This action is irreversible
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Deleting your account removes your profile, applications, messages,
                    and documents. This cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 border-rose-500/30 text-rose-600 hover:text-rose-700 dark:text-rose-400"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete my account
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, profile, applications, messages,
              and documents. This action cannot be undone. A 30-day grace period applies
              before permanent deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteAccount}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ConsentRow({
  icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name={icon} className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

function NotifRow({
  icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name={icon} className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

function SessionRow({
  device,
  location,
  lastActive,
  current,
}: {
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name="Lock" className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {device}
            {current && (
              <Badge className="ml-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                Current
              </Badge>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {location} · {lastActive}
          </p>
        </div>
      </div>
      {!current && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => toast.success("Session revoked")}
        >
          Sign out
        </Button>
      )}
    </div>
  );
}
