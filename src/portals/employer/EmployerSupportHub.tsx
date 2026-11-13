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
  { q: "How do I post my first job?", a: "Click 'Create Job' in the Hiring menu. Fill out basic info, requirements, and screening questions. Save as draft or publish immediately. Published jobs appear in candidate search within minutes." },
  { q: "How does AI candidate matching work?", a: "Our simulated AI scores candidates against your job requirements using skills, experience, and recent activity. Scores are illustrative — always interview before deciding." },
  { q: "What's included in the Enterprise plan?", a: "Unlimited job posts, 50 seats, ATS integrations, SSO, dedicated CSM, audit logs, and 99.9% SLA. See Subscription for current usage." },
  { q: "How do I invite my team?", a: "Go to Recruitment Team → Invite member. Enter email and pick a role (Admin, Hiring Manager, Recruiter, Interviewer, Viewer). They'll get an email invite." },
  { q: "Can I export my applicant data?", a: "Yes — Settings → Danger zone → Export data, or use our API. Data is delivered as CSV/JSON within 48 hours." },
  { q: "How do refunds work?", a: "Annual plans are refundable pro-rata within 14 days of payment. Monthly plans are non-refundable. Contact billing@jobson.id for assistance." },
  { q: "How do I set up SSO?", a: "Enterprise customers can configure SAML 2.0 SSO under Settings → Security → SSO. We support Okta, Azure AD, Google Workspace, and custom IdPs." },
  { q: "Can I hide my company name on job posts?", a: "Yes — when creating a job, set 'Confidential employer' to yes. The job appears as 'Confidential Company' in candidate search." },
];

const ARTICLES = [
  { title: "Writing inclusive job descriptions", category: "Hiring", readTime: "6 min read", icon: "FileText" },
  { title: "Structured interview best practices", category: "Interviews", readTime: "8 min read", icon: "Users" },
  { title: "Setting up your hiring pipeline", category: "Pipeline", readTime: "5 min read", icon: "KanbanSquare" },
  { title: "Using talent pools effectively", category: "Talent", readTime: "4 min read", icon: "Database" },
  { title: "Integrating your ATS with jobson.id", category: "Integrations", readTime: "7 min read", icon: "Plug" },
  { title: "Understanding hiring analytics", category: "Analytics", readTime: "9 min read", icon: "BarChart3" },
];

const VIDEOS = [
  { title: "Posting your first job", duration: "3:21", category: "Onboarding" },
  { title: "Reviewing applicants efficiently", duration: "5:48", category: "Applicants" },
  { title: "Setting up your pipeline", duration: "4:15", category: "Pipeline" },
  { title: "Scheduling interviews", duration: "3:33", category: "Interviews" },
  { title: "Creating offers", duration: "4:02", category: "Offers" },
  { title: "Reading your analytics dashboard", duration: "6:51", category: "Analytics" },
];

const THREADS = [
  { title: "What's your average time-to-hire in 2024?", author: "talentlead_techcorp", replies: 31, lastActivity: "30m ago" },
  { title: "How do you handle ghosting after offer?", author: "anika_v", replies: 47, lastActivity: "2h ago" },
  { title: "Best ATS to pair with jobson.id?", author: "recruiter_sneha", replies: 28, lastActivity: "6h ago" },
  { title: "Structured interview templates — share yours!", author: "hiring_mgr_007", replies: 19, lastActivity: "1d ago" },
];

const INITIAL_TICKETS = [
  { id: "st_e1", subject: "Greenhouse sync failing intermittently", category: "Bug", priority: "high", status: "in_progress", createdAt: "3 days ago", updatedAt: "1 day ago" },
  { id: "st_e2", subject: "Need to upgrade Enterprise seats", category: "Billing", priority: "medium", status: "open", createdAt: "1 day ago", updatedAt: "1 day ago" },
  { id: "st_e3", subject: "SSO setup with Okta — walkthrough?", category: "Account", priority: "low", status: "resolved", createdAt: "10 days ago", updatedAt: "8 days ago" },
];

export function EmployerSupportHub() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Enterprise support with dedicated channels and a 24/7 priority queue."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <ContactOptionsSection
        options={[
          { icon: "Mail", title: "Email support", value: "enterprise@jobson.id", hint: "Priority replies < 4 hours", action: () => toast.info("Opening email client") },
          { icon: "MessagesSquare", title: "Live chat", value: "24/7 for Enterprise", hint: "Avg wait: < 1 min", action: () => toast.info("Live chat", { description: "Connecting you to a priority agent…" }) },
          { icon: "Phone", title: "Dedicated CSM", value: "+91 80 4567 8901", hint: "Riya · Mon–Fri 9–6 IST", action: () => toast.info("Calling your CSM", { description: "Riya · Enterprise CS" }) },
        ]}
      />

      <FaqSection faqs={FAQS} />

      <TicketsSection
        tickets={INITIAL_TICKETS}
        onCreate={() => toast.success("Ticket created", { description: "Priority: Enterprise SLA < 4h response." })}
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
          Revisit account & team settings?{" "}
          <button
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={() => navigate("employer", "settings-hub")}
          >
            Open settings center →
          </button>
        </p>
      </div>
    </div>
  );
}
