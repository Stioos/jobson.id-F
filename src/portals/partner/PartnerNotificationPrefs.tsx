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
  { key: "admissions", label: "New admissions", description: "When a student enrolls in a batch or course.", icon: "GraduationCap" },
  { key: "settlements", label: "Settlement updates", description: "When settlements are credited to your wallet.", icon: "Coins" },
  { key: "renewals", label: "MoU renewals", description: "60/30/7-day reminders for partnership agreements.", icon: "RotateCcw" },
  { key: "billing", label: "Invoices & fees", description: "Invoice generation, fee collections, GST.", icon: "Receipt" },
  { key: "announcements", label: "jobson.id announcements", description: "Product updates and partner news.", icon: "BellRing" },
  { key: "security", label: "Security alerts", description: "Sign-ins, role changes, API keys.", icon: "ShieldCheck" },
  { key: "weekly_digest", label: "Weekly partner digest", description: "A Monday summary of admissions and revenue.", icon: "FileBarChart" },
];

const SMS_ITEMS = [
  { key: "admission_confirmed", label: "Admission confirmed", description: "When a student's admission is confirmed.", icon: "GraduationCap" },
  { key: "settlement_credited", label: "Settlement credited", description: "When a settlement hits your bank.", icon: "Coins" },
  { key: "urgent_alerts", label: "Urgent alerts", description: "MoU expiry, fee deadlines, compliance.", icon: "AlertTriangle" },
  { key: "otp", label: "OTP & verification", description: "Login and admin-action OTPs.", icon: "KeyRound" },
];

const INAPP_ITEMS = [
  { key: "real_time", label: "Real-time notifications", description: "Push instantly to the in-app bell.", icon: "Bell" },
  { key: "daily_digest", label: "Daily digest", description: "One summary per day at 9 AM IST.", icon: "Mail" },
  { key: "weekly_summary", label: "Weekly summary", description: "A weekly activity round-up every Monday.", icon: "FileBarChart" },
];

const PUSH_ITEMS = [
  { key: "new_admission", label: "New admission", description: "Push when a student is admitted.", icon: "GraduationCap" },
  { key: "settlement_received", label: "Settlement received", description: "Push when a settlement is credited.", icon: "Coins" },
  { key: "mou_expiring", label: "MoU expiring soon", description: "Push 30 days before MoU expiry.", icon: "RotateCcw" },
];

const CATEGORIES = [
  { key: "admissions", label: "Admissions" },
  { key: "settlements", label: "Settlements" },
  { key: "renewals", label: "Renewals" },
  { key: "billing", label: "Billing" },
  { key: "security", label: "Security" },
];
const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "inapp", label: "In-app" },
];

export function PartnerNotificationPrefs() {
  const { navigate } = useNav();
  const [email, setEmail] = React.useState<Record<string, boolean>>({
    admissions: true, settlements: true, renewals: true, billing: true, announcements: true, security: true, weekly_digest: true,
  });
  const [sms, setSms] = React.useState<Record<string, boolean>>({
    admission_confirmed: true, settlement_credited: true, urgent_alerts: true, otp: true,
  });
  const [inApp, setInApp] = React.useState<Record<string, boolean>>({
    real_time: true, daily_digest: false, weekly_summary: true,
  });
  const [push, setPush] = React.useState<Record<string, boolean>>({
    new_admission: true, settlement_received: true, mou_expiring: true,
  });
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>({
    admissions: { email: true, sms: false, push: true, inapp: true },
    settlements: { email: true, sms: true, push: true, inapp: true },
    renewals: { email: true, sms: false, push: true, inapp: true },
    billing: { email: true, sms: false, push: false, inapp: true },
    security: { email: true, sms: true, push: true, inapp: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        description="Tune alerts for admissions, settlements, MoU renewals, and billing."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("partner", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationGroupCard
          title="Email notifications"
          description="Sent to rajesh@chennaittechacademy.in"
          items={EMAIL_ITEMS}
          state={email}
          onChange={(k, v) => setEmail((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="SMS notifications"
          description="Sent to +91 98400 12345"
          items={SMS_ITEMS}
          state={sms}
          onChange={(k, v) => setSms((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="In-app notifications"
          description="Shown in the bell icon across your partner dashboard"
          items={INAPP_ITEMS}
          state={inApp}
          onChange={(k, v) => setInApp((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="Push notifications"
          description="On devices where you've installed the jobson.id partner app"
          items={PUSH_ITEMS}
          state={push}
          onChange={(k, v) => setPush((p) => ({ ...p, [k]: v }))}
        />
      </div>

      <ScheduleSection />

      <SectionCard title="Channel matrix" description="Override individual category × channel preferences for your centre.">
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
