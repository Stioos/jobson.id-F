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
  { key: "job_alerts", label: "Job alerts", description: "Daily matches based on saved searches.", icon: "Briefcase" },
  { key: "app_updates", label: "Application updates", description: "Status changes on your applications.", icon: "Inbox" },
  { key: "messages", label: "Messages", description: "New messages from recruiters and employers.", icon: "Mail" },
  { key: "interview_reminders", label: "Interview reminders", description: "24h and 1h before scheduled interviews.", icon: "Calendar" },
  { key: "marketing", label: "Marketing & tips", description: "Career tips, articles, and promotional content.", icon: "Megaphone" },
  { key: "security", label: "Security alerts", description: "Sign-ins, password changes, MFA events.", icon: "ShieldCheck" },
  { key: "billing", label: "Billing & payments", description: "Receipts, invoices, and subscription updates.", icon: "Wallet" },
];

const SMS_ITEMS = [
  { key: "interview_reminders", label: "Interview reminders", description: "Critical interview reminders.", icon: "Calendar" },
  { key: "otp", label: "OTP & verification", description: "Login and transaction OTPs.", icon: "KeyRound" },
  { key: "urgent_alerts", label: "Urgent alerts", description: "Offer deadlines and expiry warnings.", icon: "AlertTriangle" },
  { key: "application_status", label: "Application status", description: "Final-stage decisions (offer/reject).", icon: "Inbox" },
];

const INAPP_ITEMS = [
  { key: "real_time", label: "Real-time notifications", description: "Push instantly to the in-app bell.", icon: "Bell" },
  { key: "daily_digest", label: "Daily digest", description: "One summary per day at 9 AM IST.", icon: "Mail" },
  { key: "weekly_summary", label: "Weekly summary", description: "A weekly activity round-up every Monday.", icon: "FileBarChart" },
];

const PUSH_ITEMS = [
  { key: "new_messages", label: "New messages", description: "Push when recruiters message you.", icon: "Mail" },
  { key: "interview_soon", label: "Interview starting soon", description: "Push 15 min before an interview.", icon: "Calendar" },
  { key: "offer_received", label: "Offer received", description: "Push when an employer sends an offer.", icon: "Gift" },
];

const CATEGORIES = [
  { key: "job_alerts", label: "Job alerts" },
  { key: "app_updates", label: "Application updates" },
  { key: "messages", label: "Messages" },
  { key: "interview_reminders", label: "Interview reminders" },
  { key: "marketing", label: "Marketing" },
  { key: "security", label: "Security" },
];
const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "inapp", label: "In-app" },
];

export function CandidateNotificationPrefs() {
  const { navigate } = useNav();
  const [email, setEmail] = React.useState<Record<string, boolean>>({
    job_alerts: true, app_updates: true, messages: true, interview_reminders: true, marketing: false, security: true, billing: true,
  });
  const [sms, setSms] = React.useState<Record<string, boolean>>({
    interview_reminders: true, otp: true, urgent_alerts: true, application_status: false,
  });
  const [inApp, setInApp] = React.useState<Record<string, boolean>>({
    real_time: true, daily_digest: false, weekly_summary: true,
  });
  const [push, setPush] = React.useState<Record<string, boolean>>({
    new_messages: true, interview_soon: true, offer_received: true,
  });
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>({
    job_alerts: { email: true, sms: false, push: true, inapp: true },
    app_updates: { email: true, sms: false, push: false, inapp: true },
    messages: { email: true, sms: false, push: true, inapp: true },
    interview_reminders: { email: true, sms: true, push: true, inapp: true },
    marketing: { email: false, sms: false, push: false, inapp: false },
    security: { email: true, sms: true, push: true, inapp: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        description="Choose how and when jobson.id contacts you about candidate activity."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("candidate", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationGroupCard
          title="Email notifications"
          description="Sent to priya.nair@gmail.com"
          items={EMAIL_ITEMS}
          state={email}
          onChange={(k, v) => setEmail((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="SMS notifications"
          description="Sent to +91 99887 76655 · standard rates apply"
          items={SMS_ITEMS}
          state={sms}
          onChange={(k, v) => setSms((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="In-app notifications"
          description="Shown in the bell icon and notification center"
          items={INAPP_ITEMS}
          state={inApp}
          onChange={(k, v) => setInApp((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="Push notifications"
          description="On devices where you've installed the jobson.id app"
          items={PUSH_ITEMS}
          state={push}
          onChange={(k, v) => setPush((p) => ({ ...p, [k]: v }))}
        />
      </div>

      <ScheduleSection />

      <SectionCard title="Channel matrix" description="Override individual category × channel preferences.">
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
