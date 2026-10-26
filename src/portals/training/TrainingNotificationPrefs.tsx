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
  { key: "enrollments", label: "New enrollments", description: "When a learner enrolls in a course or cohort.", icon: "Users2" },
  { key: "live_sessions", label: "Live session reminders", description: "Before trainer-led live sessions.", icon: "Video" },
  { key: "completion", label: "Course completion", description: "When learners complete courses or certifications.", icon: "Award" },
  { key: "renewals", label: "Contract renewals", description: "60/30/7-day reminders for client contracts.", icon: "RotateCcw" },
  { key: "billing", label: "Billing & invoices", description: "Invoice generation, payments, and GST filings.", icon: "Receipt" },
  { key: "compliance", label: "Compliance alerts", description: "Mandatory compliance course deadlines.", icon: "ShieldCheck" },
  { key: "marketing", label: "Product updates", description: "New LMS features and best-practice guides.", icon: "Megaphone" },
];

const SMS_ITEMS = [
  { key: "live_session_start", label: "Live session start", description: "15 min before each live session.", icon: "Video" },
  { key: "compliance_deadline", label: "Compliance deadlines", description: "24h before mandatory compliance expires.", icon: "ShieldCheck" },
  { key: "otp", label: "OTP & verification", description: "Login and admin-action OTPs.", icon: "KeyRound" },
];

const INAPP_ITEMS = [
  { key: "real_time", label: "Real-time notifications", description: "Push instantly to the in-app bell.", icon: "Bell" },
  { key: "daily_digest", label: "Daily digest", description: "One summary per day at 9 AM IST.", icon: "Mail" },
  { key: "weekly_summary", label: "Weekly summary", description: "A weekly activity round-up every Monday.", icon: "FileBarChart" },
];

const PUSH_ITEMS = [
  { key: "enrollment", label: "New enrollment", description: "Push when a learner enrolls.", icon: "Users2" },
  { key: "live_starting", label: "Live session starting", description: "Push 10 min before live sessions.", icon: "Video" },
  { key: "certificate_issued", label: "Certificate issued", description: "Push when a learner earns a certificate.", icon: "Award" },
];

const CATEGORIES = [
  { key: "enrollments", label: "Enrollments" },
  { key: "live_sessions", label: "Live sessions" },
  { key: "completion", label: "Completion" },
  { key: "renewals", label: "Renewals" },
  { key: "compliance", label: "Compliance" },
];
const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
  { key: "inapp", label: "In-app" },
];

export function TrainingNotificationPrefs() {
  const { navigate } = useNav();
  const [email, setEmail] = React.useState<Record<string, boolean>>({
    enrollments: true, live_sessions: true, completion: true, renewals: true, billing: true, compliance: true, marketing: false,
  });
  const [sms, setSms] = React.useState<Record<string, boolean>>({
    live_session_start: true, compliance_deadline: true, otp: true,
  });
  const [inApp, setInApp] = React.useState<Record<string, boolean>>({
    real_time: true, daily_digest: false, weekly_summary: true,
  });
  const [push, setPush] = React.useState<Record<string, boolean>>({
    enrollment: true, live_starting: true, certificate_issued: false,
  });
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>({
    enrollments: { email: true, sms: false, push: true, inapp: true },
    live_sessions: { email: true, sms: true, push: true, inapp: true },
    completion: { email: true, sms: false, push: false, inapp: true },
    renewals: { email: true, sms: false, push: false, inapp: true },
    compliance: { email: true, sms: true, push: true, inapp: true },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification preferences"
        description="Tune alerts for enrollments, live sessions, compliance, and renewals."
        icon={<Icon name="Bell" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("training", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NotificationGroupCard
          title="Email notifications"
          description="Sent to divya@skillforge.academy"
          items={EMAIL_ITEMS}
          state={email}
          onChange={(k, v) => setEmail((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="SMS notifications"
          description="Sent to +91 99887 76655"
          items={SMS_ITEMS}
          state={sms}
          onChange={(k, v) => setSms((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="In-app notifications"
          description="Shown in the bell icon across your training dashboard"
          items={INAPP_ITEMS}
          state={inApp}
          onChange={(k, v) => setInApp((p) => ({ ...p, [k]: v }))}
        />
        <NotificationGroupCard
          title="Push notifications"
          description="On devices where you've installed the JOBSONN training app"
          items={PUSH_ITEMS}
          state={push}
          onChange={(k, v) => setPush((p) => ({ ...p, [k]: v }))}
        />
      </div>

      <ScheduleSection />

      <SectionCard title="Channel matrix" description="Override individual category × channel preferences for your academy.">
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
