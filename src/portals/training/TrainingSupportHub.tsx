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
  { q: "How do I create a new course?", a: "Visit Course Builder in the Training menu. Add modules, lessons, assessments, and resources. Save as draft or publish immediately. Published courses are available to your corporate clients and learners." },
  { q: "How do I schedule a live session?", a: "Open Live Sessions → Schedule. Pick a cohort, trainer, date/time, and platform (Zoom/Teams). Learners get calendar invites automatically. Sessions are recorded for asynchronous viewing." },
  { q: "How do certifications work?", a: "After a learner passes the final assessment (default 70%), a certificate is auto-issued from your templates. Certificates are verifiable via the public certificate verifier." },
  { q: "How does corporate client billing work?", a: "Clients are billed monthly based on enrolled learners and active courses. Invoices are auto-generated with GST. Visit Invoices to view, download, or mark as paid." },
  { q: "Can I bulk-upload learners?", a: "Yes — Enrollments → Import. Upload a CSV with name, email, and course ID. We auto-create accounts and send enrollment emails." },
  { q: "How do I add a new trainer?", a: "Trainers → Add trainer. Enter email and assign courses. Trainers get a separate login and can only see their assigned cohorts and sessions." },
  { q: "How do contract renewals work?", a: "JOBSONN sends renewal reminders at 60, 30, and 7 days before contract end. Visit Corporate Clients to view upcoming renewals and trigger renewal workflows." },
  { q: "How does the LMS integration work?", a: "Once connected (Settings → Integrations → Moodle), we sync courses, enrollments, and grades bi-directionally. New courses in Moodle appear in JOBSONN within 1 hour." },
];

const ARTICLES = [
  { title: "Designing effective cohort-based learning", category: "Pedagogy", readTime: "8 min read", icon: "Users2" },
  { title: "Setting up your first corporate client", category: "Business", readTime: "6 min read", icon: "Briefcase" },
  { title: "Creating assessments that matter", category: "Assessments", readTime: "7 min read", icon: "ClipboardCheck" },
  { title: "Trainer onboarding checklist", category: "Trainers", readTime: "4 min read", icon: "GraduationCap" },
  { title: "Understanding learner engagement", category: "Analytics", readTime: "9 min read", icon: "BarChart3" },
  { title: "Compliance training essentials", category: "Compliance", readTime: "5 min read", icon: "ShieldCheck" },
];

const VIDEOS = [
  { title: "Setting up SkillForge Academy", duration: "4:21", category: "Onboarding" },
  { title: "Building your first course", duration: "6:48", category: "Courses" },
  { title: "Scheduling live sessions", duration: "3:15", category: "Live" },
  { title: "Managing corporate clients", duration: "5:33", category: "Business" },
  { title: "Reading engagement analytics", duration: "7:02", category: "Analytics" },
  { title: "Issuing certificates", duration: "3:51", category: "Certifications" },
];

const THREADS = [
  { title: "Best LMS to pair with JOBSONN for large cohorts?", author: "ops_lead_skillforge", replies: 22, lastActivity: "1h ago" },
  { title: "Engagement drops at week 4 — what works for you?", author: "divya_sf", replies: 41, lastActivity: "4h ago" },
  { title: "Compliance: how do you handle expirations?", author: "karthik_nair", replies: 18, lastActivity: "1d ago" },
  { title: "Contract renewal playbook — share yours!", author: "anita_desai", replies: 29, lastActivity: "2d ago" },
];

const INITIAL_TICKETS = [
  { id: "st_t1", subject: "Moodle sync stuck on grades", category: "Bug", priority: "high", status: "in_progress", createdAt: "1 day ago", updatedAt: "4 hours ago" },
  { id: "st_t2", subject: "GST calculation wrong on TechCorp invoice", category: "Billing", priority: "urgent", status: "open", createdAt: "3 hours ago", updatedAt: "3 hours ago" },
  { id: "st_t3", subject: "How to issue bulk certificates for cohort 24?", category: "Account", priority: "low", status: "resolved", createdAt: "8 days ago", updatedAt: "7 days ago" },
];

export function TrainingSupportHub() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="Training-focused support with LMS experts and a community of academies."
        icon={<Icon name="LifeBuoy" className="h-6 w-6" />}
      />

      <ContactOptionsSection
        options={[
          { icon: "Mail", title: "Email support", value: "training@jobsonn.com", hint: "Replies within 6 hours", action: () => toast.info("Opening email client") },
          { icon: "MessagesSquare", title: "Live chat", value: "Mon–Sat, 9 AM – 7 PM IST", hint: "Avg wait: 3 min", action: () => toast.info("Live chat", { description: "Connecting you to a training specialist…" }) },
          { icon: "Phone", title: "Phone", value: "+91 80 4567 8903", hint: "Toll-free, India", action: () => toast.info("Phone support", { description: "Demo only." }) },
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
          Revisit academy or LMS settings?{" "}
          <button
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={() => navigate("training", "settings-hub")}
          >
            Open settings center →
          </button>
        </p>
      </div>
    </div>
  );
}
