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
  { key: "submission_updates", label: "Submission updates", description: "When clients act on your submitted candidates.", icon: "Send" },
  { key: "interview_reminders", label: "Interview reminders", description: "Before interviews you've coordinated.", icon: "Calendar" },
  { key: "placement_alerts", label: "Placement alerts", description: "Celebrate every successful placement.", icon: "Handshake" },
  { key: "commission", label: "Commission & invoicing", description: "Commission credits, invoice updates.", icon: "Percent" },
  { key: "marketing", label: "Product updates", description: "New features and recruiter best-practices.", icon: "Megaphone" },
  { key: "security", label: "Security alerts", description: "Sign-ins, API keys, role changes.", icon: "ShieldCheck" },
  { key: "weekly_digest", label: "Weekly recruiting digest", description: "Pipeline and revenue summary every Monday.", icon: "FileBarChart" },
];

const SMS_ITEMS = [
  { key: "interview_reminders", label: "Interview reminders", description: "30 min before each interview.", icon: "Calendar" },
  { key: "urgent_alerts", label: "Urgent alerts", description: "Offer deadline expirations, candidate withdrawals.", icon: "AlertTriangle" },
  { key: "otp", label: "OTP & verification", description: "Login and admin-action OTPs.", icon: "KeyRound" },
];

const INAPP_ITEMS = [
  { key: "real_time", label: "Real-time notifications", description: "Push instantly to the in-app bell.", icon: "Bell" },
  { key: "daily_digest", label: "Daily digest", description: "One summary per day at 9 AM IST.", icon: "Mail" },
  { key: "weekly_summary", label: "Weekly summary", description: "A weekly activity round-up every Monday.", icon: "FileBarChart" },
];

const PUSH_ITEMS = [
  { key: "client_action", label: "Client action on submission", description: "Push when a client shortlists or rejects.", icon: "Send" },
  { key: "placement_confirmed", label: "Placement confirmed", description: "Push when a placement is confirmed.", icon: "Handshake" },
  { key: "commission_credited", label: "Commission credited", description: "Push when commission hits your wallet.", icon: "Coins" },
];

const CATEGORIES = [
  { key: "submission_updates", label: "Submission updates" },
  { key: "interview_reminders", label: "Interview reminders" },
  { key: "placement_alerts", label: "Placement alerts" },
  { key: "commission", label: "Commission" },
  { key: "security", label: "Security" },
];
const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "inapp", label: "In-app" },
];

export function RecruiterNotificationPrefs() {
  const { navigate } = useNav();
  const [email, setEmail] = React.useState<Record<string, boolean>>({
    submission_updates: true, interview_reminders: true, placement_alerts: true, commission: true, marketing: false, security: true, weekly_digest: true,
  });
  const [sms, setSms] = React.useState<Record<string, boolean>>({
    interview_reminders: true, urgent_alerts: true, otp: true,
  });
  const [inApp, setInApp] = React.useState<Record<string, boolean>>({
    real_time: true, daily_digest: false, weekly_summary: true,
  });
  const [push, setPush] = React.useState<Record<string, boolean>>({
    client_action: true, placement_confirmed: true, commission_credited: false,
  });
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>({
    submission_updates: { email: true, sms: false, push: true, inapp: true },
    interview_reminders: { email: true, sms: true, push: true, inapp: true },
    placement_alerts: { email: true, sms: false, push: true, inapp: true },
    commission: { email: true, sms: false, push: false, inapp: true },
    security: { email: true, sms: true, push: true, inapp: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        description="Tune alerts for submissions, placements, commissions, and team activity."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("recruiter", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationGroupCard
          title="Email notifications"
          description="Sent to sneha@talentbridge.in"
          items={EMAIL_ITEMS}
          state={email}
          onChange={(k, v) => setEmail((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="SMS notifications"
          description="Sent to +91 99660 11223"
          items={SMS_ITEMS}
          state={sms}
          onChange={(k, v) => setSms((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="In-app notifications"
          description="Shown in the bell icon across your recruiter dashboard"
          items={INAPP_ITEMS}
          state={inApp}
          onChange={(k, v) => setInApp((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="Push notifications"
          description="On devices where you've installed the JOBSONN recruiter app"
          items={PUSH_ITEMS}
          state={push}
          onChange={(k, v) => setPush((p) => ({ ...p, [k]: v }))}
        />
      </div>

      <ScheduleSection />

      <SectionCard title="Channel matrix" description="Override individual category × channel preferences for your desk.">
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
