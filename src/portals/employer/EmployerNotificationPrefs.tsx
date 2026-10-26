"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import {
  ChannelMatrix,
  NotificationGroupCard,
  ScheduleSection,
} from "@/portals/_settings-support-shared";

const EMAIL_ITEMS = [
  { key: "new_applicants", label: "New applicants", description: "When a candidate applies to your jobs.", icon: "Inbox" },
  { key: "interview_reminders", label: "Interview reminders", description: "Reminders before scheduled interviews.", icon: "Calendar" },
  { key: "team_activity", label: "Team activity", description: "Recruiter actions on jobs and candidates.", icon: "Users" },
  { key: "billing", label: "Billing & invoices", description: "Receipts, renewals, and payment failures.", icon: "Wallet" },
  { key: "marketing", label: "Product updates", description: "New features and best-practice guides.", icon: "Megaphone" },
  { key: "security", label: "Security alerts", description: "Sign-ins, role changes, API key events.", icon: "ShieldCheck" },
  { key: "weekly_digest", label: "Weekly hiring digest", description: "A Monday round-up of last week's pipeline.", icon: "FileBarChart" },
];

const SMS_ITEMS = [
  { key: "interview_reminders", label: "Interview reminders", description: "30 min before each interview.", icon: "Calendar" },
  { key: "urgent_alerts", label: "Urgent alerts", description: "Offer deadline expirations and escalations.", icon: "AlertTriangle" },
  { key: "otp", label: "OTP & verification", description: "Login and admin-action OTPs.", icon: "KeyRound" },
];

const INAPP_ITEMS = [
  { key: "real_time", label: "Real-time notifications", description: "Push instantly to the in-app bell.", icon: "Bell" },
  { key: "daily_digest", label: "Daily digest", description: "One summary per day at 9 AM IST.", icon: "Mail" },
  { key: "weekly_summary", label: "Weekly summary", description: "A weekly activity round-up every Monday.", icon: "FileBarChart" },
];

const PUSH_ITEMS = [
  { key: "new_applicants", label: "New applicant", description: "Push when a candidate applies.", icon: "Inbox" },
  { key: "interview_starting", label: "Interview starting", description: "Push 10 min before an interview.", icon: "Calendar" },
  { key: "offer_accepted", label: "Offer accepted", description: "Push when a candidate accepts your offer.", icon: "Gift" },
];

const CATEGORIES = [
  { key: "new_applicants", label: "New applicants" },
  { key: "interview_reminders", label: "Interview reminders" },
  { key: "team_activity", label: "Team activity" },
  { key: "billing", label: "Billing" },
  { key: "security", label: "Security" },
];
const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "inapp", label: "In-app" },
];

export function EmployerNotificationPrefs() {
  const { navigate } = useNav();
  const [email, setEmail] = React.useState<Record<string, boolean>>({
    new_applicants: true, interview_reminders: true, team_activity: true, billing: true, marketing: false, security: true, weekly_digest: true,
  });
  const [sms, setSms] = React.useState<Record<string, boolean>>({
    interview_reminders: true, urgent_alerts: true, otp: true,
  });
  const [inApp, setInApp] = React.useState<Record<string, boolean>>({
    real_time: true, daily_digest: false, weekly_summary: true,
  });
  const [push, setPush] = React.useState<Record<string, boolean>>({
    new_applicants: true, interview_starting: true, offer_accepted: true,
  });
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>({
    new_applicants: { email: true, sms: false, push: true, inapp: true },
    interview_reminders: { email: true, sms: true, push: true, inapp: true },
    team_activity: { email: true, sms: false, push: false, inapp: true },
    billing: { email: true, sms: false, push: false, inapp: true },
    security: { email: true, sms: true, push: true, inapp: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        description="Tune alerts for your hiring pipeline, team activity, and billing."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("employer", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationGroupCard
          title="Email notifications"
          description="Sent to rohan.mehta@techcorp.com and team distribution list"
          items={EMAIL_ITEMS}
          state={email}
          onChange={(k, v) => setEmail((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="SMS notifications"
          description="Sent to +91 98200 12345"
          items={SMS_ITEMS}
          state={sms}
          onChange={(k, v) => setSms((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="In-app notifications"
          description="Shown in the bell icon across your employer dashboard"
          items={INAPP_ITEMS}
          state={inApp}
          onChange={(k, v) => setInApp((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="Push notifications"
          description="On devices where you've installed the JOBSONN employer app"
          items={PUSH_ITEMS}
          state={push}
          onChange={(k, v) => setPush((p) => ({ ...p, [k]: v }))}
        />
      </div>

      <ScheduleSection />

      <SectionCard title="Channel matrix" description="Override individual category × channel preferences for your team.">
        <ChannelMatrix
          categories={CATEGORIES}
          channels={CHANNELS}
          state={matrix}
          onChange={(cat, ch, v) => setMatrix((p) => ({ ...p, [cat]: { ...p[cat], [ch]: v } }))}
        />
      </SectionCard>
    </div>
  );
}
