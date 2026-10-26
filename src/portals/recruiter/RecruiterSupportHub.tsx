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
  { q: "How do commissions work?", a: "You earn 8.33% of the candidate's annual CTC for permanent placements (1 month's salary). For contract roles, you earn a margin on the hourly rate. Commission is credited to your wallet within 7 days of the candidate joining." },
  { q: "How do I submit a candidate to a job?", a: "Open a job requisition → click 'Submit candidate' → pick from your talent pool or upload a new profile. The client receives the submission instantly and can shortlist, interview, or reject." },
  { q: "What happens if my placement leaves early?", a: "Most clients offer a 90-day free replacement clause. If the candidate leaves within 90 days, you must find a replacement at no extra fee. Commission clawback applies after 30 days." },
  { q: "How do I track my commissions?", a: "Visit Commissions in the Finance menu. You'll see pending, credited, and clawed-back amounts per placement, with invoice references." },
  { q: "Can I split commissions with another recruiter?", a: "Yes — when submitting a candidate, you can add a co-recruiter and define a split % (e.g., 60/40). Both wallets are credited automatically on placement." },
  { q: "How do refunds and clawbacks work?", a: "If a placement leaves within the guarantee period and you cannot replace, a pro-rata clawback is applied to your next commission cycle. Details in your MoU." },
  { q: "How do I bulk-import candidates?", a: "Use the Candidates → Import option to upload CSVs. We auto-deduplicate by email/phone. API is available for ATS-synced imports." },
  { q: "Can I white-label my submissions?", a: "Yes — Agency Pro plan lets you add your agency logo, custom email templates, and a branded candidate portal. Visit Settings → Integrations → Branding." },
];

const ARTICLES = [
  { title: "Writing submissions that convert", category: "Submissions", readTime: "6 min read", icon: "Send" },
  { title: "Split desk best practices", category: "Team", readTime: "5 min read", icon: "Users" },
  { title: "Commission tracking & invoicing", category: "Finance", readTime: "7 min read", icon: "Percent" },
  { title: "Building a strong talent pool", category: "Talent", readTime: "8 min read", icon: "Database" },
  { title: "Coordinating interviews efficiently", category: "Interviews", readTime: "4 min read", icon: "Calendar" },
  { title: "Compliance & background checks", category: "Compliance", readTime: "9 min read", icon: "ShieldCheck" },
];

const VIDEOS = [
  { title: "Your first placement on JOBSONN", duration: "5:21", category: "Onboarding" },
  { title: "Submitting candidates that get shortlisted", duration: "4:48", category: "Submissions" },
  { title: "Using split desks", duration: "3:15", category: "Team" },
  { title: "Tracking your commissions", duration: "4:33", category: "Finance" },
  { title: "Building hotlists", duration: "3:02", category: "Talent" },
  { title: "Managing client accounts", duration: "5:51", category: "Clients" },
];

const THREADS = [
  { title: "What's your average fee % in 2024?", author: "search_firm_owner", replies: 38, lastActivity: "1h ago" },
  { title: "Best tools for sourcing passive candidates?", author: "sneha_reddy", replies: 24, lastActivity: "3h ago" },
  { title: "How do you handle commission splits fairly?", author: "split_desk_pro", replies: 31, lastActivity: "8h ago" },
  { title: "Contract vs permanent — which pays more?", author: "contractor_king", replies: 19, lastActivity: "1d ago" },
];

const INITIAL_TICKETS = [
  { id: "st_r1", subject: "Bullhorn sync stuck for 2 days", category: "Bug", priority: "high", status: "in_progress", createdAt: "2 days ago", updatedAt: "1 day ago" },
  { id: "st_r2", subject: "Commission not credited for placement #P-2231", category: "Billing", priority: "urgent", status: "open", createdAt: "1 day ago", updatedAt: "1 day ago" },
];

export function RecruiterSupportHub() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Recruiter-focused support with priority channels and a community of agencies."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <ContactOptionsSection
        options={[
          { icon: "Mail", title: "Email support", value: "recruiters@jobsonn.com", hint: "Replies within 6 hours", action: () => toast.info("Opening email client") },
          { icon: "MessagesSquare", title: "Live chat", value: "Mon–Sat, 9 AM – 8 PM IST", hint: "Avg wait: 3 min", action: () => toast.info("Live chat", { description: "Connecting you to a recruiter specialist…" }) },
          { icon: "Phone", title: "Phone", value: "+91 80 4567 8902", hint: "Toll-free, India", action: () => toast.info("Phone support", { description: "Demo only." }) },
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
          Need to revisit account or agency settings?{" "}
          <button
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={() => navigate("recruiter", "settings-hub")}
          >
            Open settings center →
          </button>
        </p>
      </div>
    </div>
  );
}
