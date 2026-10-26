"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { individualLearners } from "@/lib/lms-data";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LearnerDisclaimer, LEARNER_ID,
} from "./_shared";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  Settings as SettingsIcon, User, CreditCard, Bell, Lock, Database,
  Save, Crown, Download, Trash2, Mail, MessageSquare, Phone, ShieldCheck,
} from "lucide-react";

const PAYMENT_HISTORY = [
  { id: "ph1", date: "2024-11-01", amount: 999, description: "Premium plan — monthly", status: "paid" },
  { id: "ph2", date: "2024-10-01", amount: 999, description: "Premium plan — monthly", status: "paid" },
  { id: "ph3", date: "2024-09-01", amount: 999, description: "Premium plan — monthly", status: "paid" },
  { id: "ph4", date: "2024-08-15", amount: 18999, description: "Kubernetes for Developers (CKA Bootcamp)", status: "paid" },
  { id: "ph5", date: "2024-08-01", amount: 999, description: "Premium plan — monthly", status: "paid" },
];

export function LearnerSettings() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;
  const [tab, setTab] = React.useState("account");

  // Notification toggles
  const [notif, setNotif] = React.useState({
    courseUpdates: true,
    liveReminders: true,
    newJobs: true,
    community: false,
    weekly: true,
    promotions: false,
  });

  // Privacy
  const [privacy, setPrivacy] = React.useState({
    profilePublic: true,
    openToWork: learner.openToWork,
    recruiterContact: true,
    showInLeaderboard: true,
  });

  function saveNotif() {
    toast.success("Notification preferences saved");
  }
  function savePrivacy() {
    toast.success("Privacy settings saved");
  }
  function saveAccount() {
    toast.success("Account details saved");
  }
  function changePassword() {
    toast.success("Password update link sent to your email");
  }
  function downloadData() {
    toast.success("Your data export is being prepared", {
      description: "We'll email you a download link within 24 hours",
    });
  }
  function deleteAccount() {
    toast.info("Account deletion request submitted", {
      description: "Your account will be deleted in 30 days",
    });
  }
  function upgradePlan() {
    toast.success("Upgrading to Pro plan…", {
      description: "₹1,999/month — unlock all advanced courses + 1:1 mentoring",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, subscription, notifications, privacy, and data."
        icon={<SettingsIcon className="h-5 w-5" />}
      />

      <LearnerDisclaimer />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="account">
            <User className="mr-1 h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-1 h-4 w-4" /> Subscription
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="mr-1 h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-1 h-4 w-4" /> Data
          </TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="mt-4 space-y-4">
          <SectionCard title="Account details" description="Your email and phone">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="acc-name">Full name</Label>
                <Input id="acc-name" defaultValue={learner.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-email">Email</Label>
                <Input id="acc-email" type="email" defaultValue={learner.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-phone">Phone</Label>
                <Input id="acc-phone" defaultValue={learner.phone ?? "+91 98765 43210"} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-headline">Headline</Label>
                <Input id="acc-headline" defaultValue={learner.headline} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveAccount}>
                <Save className="mr-1 h-4 w-4" /> Save changes
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Password" description="Update your password">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pwd-current">Current password</Label>
                <Input id="pwd-current" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-new">New password</Label>
                <Input id="pwd-new" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-confirm">Confirm new</Label>
                <Input id="pwd-confirm" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={changePassword}>
                Change password
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Account info" description="Your account summary">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="mt-1 font-medium">{formatDate(learner.joinedAt)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Learner ID</p>
                <p className="mt-1 font-mono text-xs">{learner.id}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Last active</p>
                <p className="mt-1 font-medium">Today</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className="mt-1 font-medium capitalize">{learner.plan}</p>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription" className="mt-4 space-y-4">
          <SectionCard title="Current plan" description="Your SkillForge subscription">
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-base font-semibold capitalize">
                      {learner.plan} plan
                      <Badge className="bg-brand/15 text-brand">Active</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹999/month · renews on {formatDate(new Date(Date.now() + 30 * 86400000).toISOString())}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info("Manage billing portal opening…")}>
                  Manage
                </Button>
              </div>
              <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Unlimited course access
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Verifiable certificates
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Live session recordings
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Priority community support
                </li>
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={upgradePlan}>
                <Crown className="mr-1 h-3.5 w-3.5" /> Upgrade to Pro
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Downgrade options opening…")}>
                Downgrade
              </Button>
              <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => toast.info("Cancellation flow opening…")}>
                Cancel subscription
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            title="Payment history"
            description="All your SkillForge payments"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Date</th>
                    <th className="pb-2 pr-3 font-medium">Description</th>
                    <th className="pb-2 pr-3 text-right font-medium">Amount</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-3 text-muted-foreground">{formatDate(p.date)}</td>
                      <td className="py-2.5 pr-3">{p.description}</td>
                      <td className="py-2.5 pr-3 text-right font-medium">{formatCurrency(p.amount)}</td>
                      <td className="py-2.5 text-right">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <SectionCard
            title="Notification preferences"
            description="Choose what we email and push to you"
          >
            <ul className="divide-y">
              {[
                { key: "courseUpdates" as const, label: "Course updates", desc: "New lessons, content changes, instructor announcements" },
                { key: "liveReminders" as const, label: "Live session reminders", desc: "30 min before scheduled live sessions" },
                { key: "newJobs" as const, label: "New job matches", desc: "When a job matches your skills & certifications" },
                { key: "community" as const, label: "Community replies", desc: "When someone replies to your threads" },
                { key: "weekly" as const, label: "Weekly progress digest", desc: "Your learning summary every Monday" },
                { key: "promotions" as const, label: "Promotions & offers", desc: "Course discounts and seasonal offers" },
              ].map((item) => (
                <li key={item.key} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notif[item.key]}
                    onCheckedChange={(v) => setNotif((n) => ({ ...n, [item.key]: v }))}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveNotif}>
                <Save className="mr-1 h-4 w-4" /> Save preferences
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="mt-4">
          <SectionCard
            title="Privacy settings"
            description="Control your visibility and how recruiters can reach you"
          >
            <ul className="divide-y">
              <li className="flex items-start justify-between gap-3 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-medium">Public profile</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone with your profile link can view your skills & certificates
                  </p>
                </div>
                <Switch
                  checked={privacy.profilePublic}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, profilePublic: v }))}
                />
              </li>
              <li className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">Open to work</p>
                  <p className="text-xs text-muted-foreground">
                    Show recruiters you&apos;re actively seeking opportunities
                  </p>
                </div>
                <Switch
                  checked={privacy.openToWork}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, openToWork: v }))}
                />
              </li>
              <li className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">Recruiter contact consent</p>
                  <p className="text-xs text-muted-foreground">
                    Allow recruiters from partner companies to email you about roles
                  </p>
                </div>
                <Switch
                  checked={privacy.recruiterContact}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, recruiterContact: v }))}
                />
              </li>
              <li className="flex items-start justify-between gap-3 py-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium">Show in leaderboard</p>
                  <p className="text-xs text-muted-foreground">
                    Display your name and rank on the public leaderboard
                  </p>
                </div>
                <Switch
                  checked={privacy.showInLeaderboard}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, showInLeaderboard: v }))}
                />
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <Button onClick={savePrivacy}>
                <Save className="mr-1 h-4 w-4" /> Save privacy settings
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data" className="mt-4 space-y-4">
          <SectionCard
            title="Download your data"
            description="Get a copy of everything we know about you"
          >
            <p className="text-sm text-muted-foreground">
              We&apos;ll email you a ZIP file containing your profile, enrollments, certificates, achievements, and community posts. Ready within 24 hours.
            </p>
            <Button className="mt-3" onClick={downloadData}>
              <Download className="mr-1 h-4 w-4" /> Request data export
            </Button>
          </SectionCard>

          <SectionCard
            title="Delete account"
            description="Permanently delete your account and all associated data"
          >
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-sm">
              <p className="font-medium text-rose-700 dark:text-rose-300">This action cannot be undone</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Deleting your account will remove all your courses, certificates, achievements, and community posts. This cannot be reversed.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-3">
                  <Trash2 className="mr-1 h-4 w-4" /> Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your SkillForge account, all {learner.certificatesEarned} certificates, {learner.learningHours}h of learning history, and {learner.points.toLocaleString("en-IN")} points. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
