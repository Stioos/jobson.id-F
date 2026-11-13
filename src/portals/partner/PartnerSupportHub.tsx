"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import {
  CommunityForumSection,
  ContactOptionsSection,
  FaqSection,
  FeedbackSection,
  KnowledgeBaseSection,
  SystemStatusSection,
  TicketsSection,
  VideoTutorialsSection,
} from "@/portals/_settings-support-shared";

const FAQS = [
  { q: "How does the revenue share work?", a: "jobson.id and partners share revenue on a per-program basis. Typical splits: 60% partner / 40% jobson.id for tech programs. Splits are visible on the Revenue Splits page and credited to your wallet weekly." },
  { q: "When do I receive settlements?", a: "Settlements are processed weekly (every Friday) for the previous week's confirmed admissions. Funds hit your linked bank account within 1-2 business days." },
  { q: "How do I admit a new student?", a: "Visit Students → Admit student. Enter name, contact, batch, and program. The student receives an enrollment SMS/email. Admission fees can be collected via Razorpay." },
  { q: "What are the MoU renewal steps?", a: "jobson.id sends renewal reminders at 60, 30, and 7 days before MoU expiry. Visit MoU & Agreements → Renew. Updated terms are signed digitally via DocuSign." },
  { q: "How do I issue certificates?", a: "After a student completes a program (70%+ attendance and assessment), visit Certificates → Issue. Certificates are auto-generated from jobson.id-approved templates and verifiable publicly." },
  { q: "What is the role of the calculator?", a: "The Revenue Calculator (Tools menu) lets you model expected revenue based on admissions × program fee × split %. Useful for forecasting and budgeting." },
  { q: "How do I update my bank details?", a: "Settings → Configure → Banking. Changes require MFA verification and a 7-day cooling period before they take effect, to prevent fraud." },
  { q: "Can I create sub-partners under me?", a: "Premium partners can onboard sub-partners (e.g., franchise centres). Revenue splits cascade automatically. Visit Profile → Sub-partner network." },
];

const ARTICLES = [
  { title: "Onboarding your first batch", category: "Operations", readTime: "5 min read", icon: "CalendarCheck2" },
  { title: "Maximising your revenue share", category: "Finance", readTime: "7 min read", icon: "Percent" },
  { title: "Issuing NSDC-compliant certificates", category: "Compliance", readTime: "6 min read", icon: "Award" },
  { title: "Setting up admission workflows", category: "Admissions", readTime: "8 min read", icon: "GraduationCap" },
  { title: "Handling student placements", category: "Placements", readTime: "9 min read", icon: "Handshake" },
  { title: "Centre inspection checklist", category: "Compliance", readTime: "4 min read", icon: "ShieldCheck" },
];

const VIDEOS = [
  { title: "Welcome to the Partner Portal", duration: "3:21", category: "Onboarding" },
  { title: "Admitting your first student", duration: "4:48", category: "Admissions" },
  { title: "Understanding your settlements", duration: "5:15", category: "Finance" },
  { title: "Issuing certificates", duration: "3:33", category: "Certificates" },
  { title: "Renewing your MoU", duration: "4:02", category: "Partnership" },
  { title: "Using the revenue calculator", duration: "5:51", category: "Finance" },
];

const THREADS = [
  { title: "Best ways to fill batches faster?", author: "rajesh_cta", replies: 28, lastActivity: "1h ago" },
  { title: "How do you handle student dropouts?", author: "lakshmi_bsc", replies: 41, lastActivity: "3h ago" },
  { title: "GST filing tips for training centres", author: "ravi_finance", replies: 19, lastActivity: "8h ago" },
  { title: "Franchise vs owned centre — pros and cons?", author: "dr_suresh_k", replies: 31, lastActivity: "1d ago" },
];

const INITIAL_TICKETS = [
  { id: "st_pt1", subject: "Settlement ₹1,84,000 not received this week", category: "Billing", priority: "urgent", status: "open", createdAt: "2 hours ago", updatedAt: "2 hours ago" },
  { id: "st_pt2", subject: "Cannot issue certificates for batch B-2401", category: "Bug", priority: "high", status: "in_progress", createdAt: "1 day ago", updatedAt: "6 hours ago" },
  { id: "st_pt3", subject: "How to renew MoU 30 days early?", category: "Account", priority: "low", status: "resolved", createdAt: "12 days ago", updatedAt: "10 days ago" },
];

export function PartnerSupportHub() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Partner-focused support with regional specialists and a community of training centres."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <ContactOptionsSection
        options={[
          { icon: "Mail", title: "Email support", value: "partners@jobson.id", hint: "Replies within 6 hours", action: () => toast.info("Opening email client") },
          { icon: "MessagesSquare", title: "Live chat", value: "Mon–Sat, 9 AM – 8 PM IST", hint: "Avg wait: 3 min", action: () => toast.info("Live chat", { description: "Connecting you to a partner specialist…" }) },
          { icon: "Phone", title: "Regional manager", value: "+91 80 4567 8904", hint: "Tamil Nadu · Priya", action: () => toast.info("Calling regional manager", { description: "Priya · TN partner success" }) },
        ]}
      />

      <FaqSection faqs={FAQS} />

      <TicketsSection
        tickets={INITIAL_TICKETS}
        onCreate={() => toast.success("Ticket created", { description: "We'll get back within 6 hours." })}
      />

      <KnowledgeBaseSection articles={ARTICLES} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VideoTutorialsSection videos={VIDEOS} />
        <SystemStatusSection />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FeedbackSection />
        <CommunityForumSection threads={THREADS} />
      </div>

      <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Revisit partnership or centre settings?{" "}
          <button
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={() => navigate("partner", "settings-hub")}
          >
            Open settings center →
          </button>
        </p>
      </div>
    </div>
  );
}
