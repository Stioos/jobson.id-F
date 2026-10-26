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
  { q: "How do I apply for a job?", a: "Visit Find Jobs, open a job listing, and click 'Easy Apply'. Your default resume is sent automatically. You can tailor your resume per application in the Resume section." },
  { q: "How do AI recommendations work?", a: "Our simulated AI matches your skills, experience, and preferences against published jobs. Scores are illustrative — always review the full description before applying." },
  { q: "How do I get my skills verified?", a: "Go to Skills → 'Get verified'. We'll send you an assessment link. Once completed with a passing score, a verified badge appears on your profile." },
  { q: "When do I get paid for referrals?", a: "Referral rewards are credited to your wallet within 7 days of your referred friend accepting a job offer through JOBSONN. Minimum reward: ₹5,000 per placement." },
  { q: "Can I hide my profile from my current employer?", a: "Yes. Go to Settings → Privacy and switch profile visibility to 'Private' or 'Employers only'. You can also block specific companies." },
  { q: "How do I withdraw an application?", a: "Go to Applications, expand the application you want to withdraw, and click 'Withdraw'. The employer will be notified automatically." },
  { q: "How do I reset my password?", a: "Visit Settings → Security Center → Password. Enter your current password and a new one. If you've forgotten it, use the 'Forgot password' link on the sign-in page." },
  { q: "What does the Candidate Pro plan include?", a: "Unlimited applications, priority listing in talent search, AI-powered recommendations, resume review credits, and access to premium courses." },
];

const ARTICLES = [
  { title: "Writing a standout resume", category: "Career", readTime: "5 min read", icon: "FileText" },
  { title: "Acing technical interviews", category: "Interviews", readTime: "8 min read", icon: "Users" },
  { title: "Salary negotiation playbook", category: "Offers", readTime: "6 min read", icon: "Banknote" },
  { title: "Building a portfolio that converts", category: "Career", readTime: "4 min read", icon: "FolderGit2" },
  { title: "Using AI recommendations effectively", category: "Product", readTime: "3 min read", icon: "Sparkles" },
  { title: "Switching careers: a step-by-step guide", category: "Career", readTime: "10 min read", icon: "Route" },
];

const VIDEOS = [
  { title: "Getting started with JOBSONN", duration: "2:34", category: "Onboarding" },
  { title: "Setting up your profile", duration: "4:12", category: "Profile" },
  { title: "Finding the right jobs", duration: "3:55", category: "Jobs" },
  { title: "Preparing for interviews", duration: "6:18", category: "Interviews" },
  { title: "Managing your applications", duration: "3:02", category: "Applications" },
  { title: "Earning with referrals", duration: "2:48", category: "Wallet" },
];

const THREADS = [
  { title: "Best companies for remote work in 2024?", author: "anita_dev", replies: 23, lastActivity: "1h ago" },
  { title: "How much should a 3-year React dev earn in Bengaluru?", author: "karan_sde", replies: 41, lastActivity: "3h ago" },
  { title: "Has anyone used the new AI recommendations?", author: "priya_n", replies: 12, lastActivity: "5h ago" },
  { title: "Salary negotiation tips for first-time switchers", author: "rohan_pm", replies: 18, lastActivity: "1d ago" },
];

const INITIAL_TICKETS = [
  { id: "st_p1", subject: "How do I tailor my resume per application?", category: "Account", priority: "medium", status: "resolved", createdAt: "7 days ago", updatedAt: "5 days ago" },
  { id: "st_p2", subject: "Referral reward not credited", category: "Billing", priority: "high", status: "open", createdAt: "2 days ago", updatedAt: "1 day ago" },
];

export function CandidateSupportHub() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Search articles, raise a ticket, chat with us, or send feedback."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <ContactOptionsSection
        options={[
          { icon: "Mail", title: "Email support", value: "support@jobsonn.com", hint: "Replies within 24 hours", action: () => toast.info("Opening email client") },
          { icon: "MessagesSquare", title: "Live chat", value: "Mon–Fri, 9 AM – 6 PM IST", hint: "Avg wait: 2 min", action: () => toast.info("Live chat", { description: "Connecting you to an agent…" }) },
          { icon: "Phone", title: "Phone", value: "+91 80 4567 8900", hint: "Toll-free, India", action: () => toast.info("Phone support", { description: "Demo only." }) },
        ]}
      />

      <FaqSection faqs={FAQS} />

      <TicketsSection
        tickets={INITIAL_TICKETS}
        onCreate={() => toast.success("Ticket created", { description: "We'll get back to you within 24 hours." })}
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
          Need to revisit your account settings?{" "}
          <button
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={() => navigate("candidate", "settings-hub")}
          >
            Open settings center →
          </button>
        </p>
      </div>
    </div>
  );
}
