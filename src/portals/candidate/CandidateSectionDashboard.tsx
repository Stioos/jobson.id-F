"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { portalConfigs } from "@/components/layout/portal-config";
import type { NavItem } from "@/lib/types";

interface SectionMeta {
  title: string;
  desc: string;
  icon: string;
  kpis: Array<{
    label: string;
    value: string;
    icon: string;
    tone?: "brand" | "success" | "warning" | "danger" | "default";
  }>;
  childDescriptions?: Record<string, { desc: string; badge: string; stat: string }>;
  telemetry?: Array<{ name: string; status: string; info: string }>;
  auditTrail?: Array<{ action: string; user: string; time: string }>;
}

const CANDIDATE_SECTION_METADATA: Record<string, SectionMeta> = {
  "profile-grp": {
    title: "Profile & Identity Hub",
    desc: "Manage your professional identity, ATS-optimized resumes, portfolios, cover letters, and verified documents.",
    icon: "User",
    kpis: [
      { label: "Profile Completeness", value: "95%", icon: "UserCheck", tone: "success" },
      { label: "ATS Resume Score", value: "92 / 100", icon: "Sparkles", tone: "brand" },
      { label: "Recruiter Profile Views", value: "148 Views", icon: "Eye", tone: "default" },
      { label: "Verified Credentials", value: "6 Documents", icon: "ShieldCheck", tone: "success" },
    ],
    childDescriptions: {
      "profile": { desc: "Comprehensive profile with career summary, education, and work history", badge: "Core Profile", stat: "95% complete" },
      "profile-preview": { desc: "Preview your public profile as prospective employers and recruiters see it", badge: "Public View", stat: "Live preview" },
      "profile-analytics": { desc: "Track recruiter profile visits, search appearances, and contact clicks", badge: "Analytics", stat: "148 visits" },
      "profile-optimizer": { desc: "AI-driven profile improvements, keyword recommendations, and headline tweaks", badge: "AI Powered", stat: "3 suggestions" },
      "cover-letter": { desc: "Generate and customize targeted cover letters for specific job applications", badge: "Builder", stat: "4 saved" },
      "resume": { desc: "View, download, and manage your uploaded PDF and Word CV documents", badge: "CV Storage", stat: "Primary active" },
      "resume-builder": { desc: "Interactive drag-and-drop resume builder with professional ATS templates", badge: "Interactive", stat: "ATS standard" },
      "portfolio": { desc: "Showcase your GitHub projects, live websites, case studies, and code samples", badge: "Showcase", stat: "6 projects" },
      "documents": { desc: "Upload and verify academic degrees, identity proof, and work experience letters", badge: "Credentials", stat: "6 verified" },
    },
    telemetry: [
      { name: "ATS Search Visibility Index", status: "Operational", info: "High ranking" },
      { name: "Resume Parser Verification", status: "Operational", info: "100% parsed" },
      { name: "Public Portfolio CDN", status: "Operational", info: "Fast edge delivery" },
    ],
    auditTrail: [
      { action: "Resume 'Dhanush_FullStack_2026.pdf' updated & indexed", user: "You", time: "1h ago" },
      { action: "Profile viewed by Senior Technical Recruiter at Microsoft", user: "Recruiter Search", time: "3h ago" },
      { action: "AI Profile Optimizer suggested 4 keyword additions", user: "AI Engine", time: "1d ago" },
    ],
  },

  "career-grp": {
    title: "Career Tools & Growth",
    desc: "Accelerate your career trajectory with salary benchmarks, interview preparation, skill tracking, and networking.",
    icon: "TrendingUp",
    kpis: [
      { label: "Verified Skill Badges", value: "18 Verified", icon: "Brain", tone: "brand" },
      { label: "Active Job Alerts", value: "5 Live", icon: "Bell", tone: "default" },
      { label: "Career Goals", value: "3 In Progress", icon: "Target", tone: "warning" },
      { label: "Mock Interview Score", value: "88%", icon: "BookOpen", tone: "success" },
    ],
    childDescriptions: {
      "alerts": { desc: "Custom notifications for new matching jobs based on title, skills, and CTC", badge: "Notifications", stat: "5 active alerts" },
      "skills": { desc: "Track technical competencies, assess proficiency, and earn verified skill badges", badge: "Skills Matrix", stat: "18 verified" },
      "goals": { desc: "Set and monitor quarterly skill milestones and career advancement objectives", badge: "Objectives", stat: "3 active" },
      "messages": { desc: "Direct chat channel with recruiters, hiring managers, and career mentors", badge: "Direct Chat", stat: "2 unread" },
      "salary-calculator": { desc: "Market compensation calculator comparing your CTC against industry peers", badge: "Calculator", stat: "Top 15% range" },
      "interview-prep": { desc: "Role-specific practice questions, AI behavioral mock interviews, and tips", badge: "AI Coaching", stat: "12 practice sets" },
      "career-explorer": { desc: "Discover potential career transitions, adjacent roles, and prerequisite skills", badge: "Discovery", stat: "8 pathways" },
      "reference-requests": { desc: "Manage professional referee requests and track referee feedback submissions", badge: "References", stat: "2 submitted" },
      "group-chat": { desc: "Join industry cohorts, peer study groups, and community discussions", badge: "Community", stat: "4 groups" },
    },
    telemetry: [
      { name: "Salary Benchmark Index", status: "Operational", info: "Updated for Q4" },
      { name: "AI Mock Interview Bot", status: "Operational", info: "Available 24/7" },
      { name: "Real-time Messaging Gateway", status: "Operational", info: "Connected" },
    ],
    auditTrail: [
      { action: "Completed System Design Mock Interview (Score: 88%)", user: "You", time: "2h ago" },
      { action: "Received verified badge for 'React 19 & Next.js Architecture'", user: "Assessment Bot", time: "1d ago" },
      { action: "New job match alert for 'Lead Frontend Engineer' (₹32L)", user: "Alerts Engine", time: "2d ago" },
    ],
  },

  "jobs": {
    title: "Jobs & Applications Workspace",
    desc: "Discover tailored opportunities, track application pipelines, manage interviews, and negotiate offers.",
    icon: "Briefcase",
    kpis: [
      { label: "Active Applications", value: "8 In Review", icon: "Inbox", tone: "brand" },
      { label: "Scheduled Interviews", value: "3 Upcoming", icon: "Calendar", tone: "warning" },
      { label: "Job Offers Extended", value: "2 Offers", icon: "Gift", tone: "success" },
      { label: "Bookmarked Jobs", value: "12 Saved", icon: "Bookmark", tone: "default" },
    ],
    childDescriptions: {
      "find-jobs": { desc: "Search and filter open roles across top employers with salary and remote filters", badge: "Job Board", stat: "1,200+ jobs" },
      "recommended": { desc: "Personalized job suggestions matched by AI against your profile and experience", badge: "AI Match", stat: "24 new matches" },
      "saved-jobs": { desc: "Bookmarked opportunities to review and apply to at your convenience", badge: "Saved", stat: "12 saved" },
      "applications": { desc: "Real-time tracking of submitted applications and employer review statuses", badge: "Applications", stat: "8 in progress" },
      "application-pipeline": { desc: "Visual Kanban view of your job journey from applied to screening and offer", badge: "Pipeline", stat: "Kanban board" },
      "interviews": { desc: "Upcoming interview calendar with video links, interviewer profiles, and kits", badge: "Schedules", stat: "3 scheduled" },
      "interview-reschedule": { desc: "Submit and coordinate interview reschedule requests with hiring teams", badge: "Requests", stat: "0 pending" },
      "video-call": { desc: "Integrated video call room for mock interviews, screening rounds, and meetings", badge: "Video Room", stat: "HD enabled" },
      "offers": { desc: "Review extended employment contracts, CTC breakdowns, equity, and benefits", badge: "Job Offers", stat: "2 received" },
      "offer-negotiation": { desc: "Interactive compensation counter-offer drafting and benefit requests", badge: "Negotiation", stat: "Active thread" },
      "onboarding-checklist": { desc: "Day-1 checklist, background verification, and IT provisioning tasks", badge: "Onboarding", stat: "14 items" },
      "compare-jobs": { desc: "Side-by-side comparison of job requirements, compensation, and work culture", badge: "Comparison", stat: "Compare tool" },
      "compare-offers": { desc: "Evaluate multiple compensation packages, CTC vs take-home, and perks", badge: "Offers Evaluator", stat: "Side-by-side" },
      "company-research": { desc: "In-depth insights into employer culture, benefits, tech stacks, and reviews", badge: "Insights", stat: "Company intel" },
    },
    telemetry: [
      { name: "Live Employer Job Feeds", status: "Operational", info: "Syncing real-time" },
      { name: "Interview Video Bridge", status: "Operational", info: "WebRTC connected" },
      { name: "Application Status Webhooks", status: "Operational", info: "0 delays" },
    ],
    auditTrail: [
      { action: "Interview confirmed with Google for Senior UI Engineer", user: "Recruiter", time: "40m ago" },
      { action: "Received formal offer letter from Razorpay (₹28L CTC)", user: "Employer", time: "1d ago" },
      { action: "Application moved to Technical Round 2 at Swiggy", user: "Hiring Team", time: "2d ago" },
    ],
  },

  "learning": {
    title: "Learning Academy & Certifications",
    desc: "Master in-demand tech and leadership skills, attend live webinars, and earn industry credentials.",
    icon: "GraduationCap",
    kpis: [
      { label: "Active Courses", value: "4 In Progress", icon: "BookOpen", tone: "brand" },
      { label: "Completed Courses", value: "8 Completed", icon: "Award", tone: "success" },
      { label: "Earned Certificates", value: "6 Badges", icon: "ShieldCheck", tone: "success" },
      { label: "Learning Streak", value: "14 Days", icon: "Flame", tone: "warning" },
    ],
    childDescriptions: {
      "catalog": { desc: "Explore accredited courses in software engineering, AI/ML, product, and sales", badge: "Curriculum", stat: "340+ courses" },
      "my-learning": { desc: "Resume active courses, track video lesson progress, and access assignments", badge: "Classroom", stat: "4 active" },
      "certificates": { desc: "View, download, and share verified digital completion certificates on LinkedIn", badge: "Credentials", stat: "6 verified" },
      "career-paths": { desc: "Structured multi-month curriculums designed to take you from novice to job-ready", badge: "Paths", stat: "Full-Stack Track" },
      "achievements": { desc: "Gamified milestones, coding challenge trophies, and learning streak awards", badge: "Trophies", stat: "12 unlocked" },
      "partner-courses": { desc: "Specialized training programs accredited by partner universities and companies", badge: "Partners", stat: "Accredited" },
      "events-calendar": { desc: "Live virtual masterclasses, coding bootcamps, and AMA sessions with leaders", badge: "Webinars", stat: "2 this week" },
    },
    telemetry: [
      { name: "Video Streaming Player", status: "Operational", info: "1080p 60fps" },
      { name: "Interactive Coding Sandbox", status: "Operational", info: "Node & Python live" },
      { name: "Credential Verification Ledger", status: "Operational", info: "Cryptographic proof" },
    ],
    auditTrail: [
      { action: "Passed module assessment: 'Distributed Systems & Microservices'", user: "You", time: "3h ago" },
      { action: "RSVP confirmed for Masterclass: 'GenAI Applications with Gemini'", user: "Webinar Bot", time: "1d ago" },
    ],
  },

  "billing": {
    title: "Billing, Wallet & Rewards",
    desc: "Manage your platform wallet, payment methods, subscription plans, rewards, and referral earnings.",
    icon: "Wallet",
    kpis: [
      { label: "Wallet Balance", value: "₹4,500", icon: "Wallet", tone: "success" },
      { label: "Referral Rewards", value: "₹2,200", icon: "Gift", tone: "brand" },
      { label: "Current Plan", value: "Candidate Pro", icon: "Crown", tone: "default" },
      { label: "Available Credits", value: "150 Credits", icon: "Coins", tone: "warning" },
    ],
    childDescriptions: {
      "my-wallet": { desc: "View cash balances, credit points, rewards, and real-time transaction ledger", badge: "Wallet", stat: "₹4,500 available" },
      "withdraw": { desc: "Transfer earned referral rewards and prize funds directly to your bank account", badge: "Payouts", stat: "Instant payout" },
      "my-transactions": { desc: "Complete history of course enrollments, test fees, refunds, and earnings", badge: "Statements", stat: "24 records" },
      "invoices": { desc: "Download official GST tax invoices and receipts for course purchases and subscriptions", badge: "Tax Invoices", stat: "All receipts" },
      "my-subscription": { desc: "Manage your Candidate Pro membership, auto-renewal, and plan benefits", badge: "Plan", stat: "Pro active" },
      "payments": { desc: "Make one-time payments for mock interview credits and premium certifications", badge: "Checkout", stat: "Razorpay / UPI" },
      "payment-methods": { desc: "Saved credit/debit cards, UPI VPA handles, and auto-debit mandates", badge: "Security", stat: "2 cards saved" },
      "promo-codes": { desc: "Apply discount vouchers and promo codes for course discounts and benefits", badge: "Discounts", stat: "1 code valid" },
      "transaction-disputes": { desc: "File billing inquiries, chargeback questions, and dispute refund decisions", badge: "Support", stat: "0 open" },
      "referrals": { desc: "Invite fellow jobseekers to earn bonus wallet cash and premium profile badges", badge: "Earn Cash", stat: "7 invited" },
    },
    telemetry: [
      { name: "Payment Gateway Engine", status: "Operational", info: "Razorpay / UPI instant" },
      { name: "Bank Payout Processing", status: "Operational", info: "IMPS direct settlement" },
    ],
    auditTrail: [
      { action: "Referral reward +₹500 credited for inviting Priya S.", user: "Referrals Engine", time: "6h ago" },
      { action: "Candidate Pro subscription renewed successfully", user: "Billing", time: "5d ago" },
    ],
  },

  "talent-solutions": {
    title: "Talent Solutions & Career Programs",
    desc: "Explore sponsored Train-to-Hire programs, corporate apprenticeships, and guaranteed placement tracks.",
    icon: "GraduationCap",
    kpis: [
      { label: "Active Programs", value: "2 Enrolled", icon: "Briefcase", tone: "brand" },
      { label: "Corporate Sponsors", value: "14 Companies", icon: "Building2", tone: "default" },
      { label: "Placement Guarantee", value: "100% Covered", icon: "ShieldCheck", tone: "success" },
      { label: "Monthly Stipend", value: "₹15,000", icon: "Coins", tone: "success" },
    ],
    childDescriptions: {
      "ts-hub": { desc: "Explore sponsored Hire-to-Train and Train-to-Hire opportunities with top employers", badge: "Solutions Hub", stat: "Explore tracks" },
      "ts-my-programs": { desc: "Track your ongoing corporate bootcamps, mentor reviews, and milestone readiness", badge: "My Programs", stat: "2 enrolled" },
      "ts-transactions": { desc: "Review program stipends, corporate sponsorship sponsorships, and escrow deposits", badge: "Stipends", stat: "All cleared" },
    },
    telemetry: [
      { name: "Corporate Sponsor Matchmaker", status: "Operational", info: "14 active hiring drives" },
      { name: "Placement Guarantee SLA", status: "Operational", info: "Verified compliant" },
    ],
    auditTrail: [
      { action: "Milestone 2 signed off by Corporate Mentor (Infosys T2H)", user: "Program Lead", time: "1d ago" },
      { action: "Monthly training stipend ₹15,000 deposited to wallet", user: "Finance Hub", time: "4d ago" },
    ],
  },

  "support-grp": {
    title: "Support & Feedback Center",
    desc: "Get help from career advisors, review recruiter experiences, and submit support tickets.",
    icon: "HelpCircle",
    kpis: [
      { label: "Open Tickets", value: "0 Open", icon: "Ticket", tone: "success" },
      { label: "Avg Resolution Time", value: "12 Mins", icon: "Clock", tone: "brand" },
      { label: "Recruiter Reviews", value: "4 Submitted", icon: "Star", tone: "default" },
      { label: "Help Articles", value: "80+ Guides", icon: "BookOpen", tone: "default" },
    ],
    childDescriptions: {
      "support-hub": { desc: "Browse self-service FAQs, live chat with support advisors, and file tickets", badge: "Help Center", stat: "24/7 support" },
      "recruiter-reviews": { desc: "Rate and review your interview experience with recruiters and hiring managers", badge: "Reviews", stat: "Transparent" },
      "support": { desc: "Legacy support ticket history, archived requests, and resolution transcripts", badge: "Archive", stat: "Resolved" },
    },
    telemetry: [
      { name: "Live Support Agent Queue", status: "Operational", info: "0 min wait time" },
      { name: "Help Center Knowledge Search", status: "Operational", info: "Instant indexing" },
    ],
    auditTrail: [
      { action: "Support ticket #T-8821 resolved (Profile verification)", user: "Support Team", time: "2d ago" },
      { action: "Recruiter review submitted for Google hiring process", user: "You", time: "3d ago" },
    ],
  },

  "settings-grp": {
    title: "Settings & Account Preferences",
    desc: "Configure account security, 2-factor authentication, email and push notification preferences, and privacy.",
    icon: "Settings",
    kpis: [
      { label: "Security Level", value: "High (2FA On)", icon: "ShieldCheck", tone: "success" },
      { label: "Profile Visibility", value: "Public to Recruiters", icon: "Eye", tone: "brand" },
      { label: "Email Alerts", value: "Daily Digest", icon: "Mail", tone: "default" },
      { label: "Connected Accounts", value: "GitHub, LinkedIn", icon: "Link", tone: "default" },
    ],
    childDescriptions: {
      "settings-hub": { desc: "Master account preferences, language, display themes, and contact info", badge: "Account", stat: "Configured" },
      "security-center": { desc: "Manage password changes, two-factor authentication (2FA), and active logins", badge: "Security", stat: "2FA active" },
      "notification-center": { desc: "Centralized stream of candidate announcements, system alerts, and updates", badge: "Inbox", stat: "All notifications" },
      "notification-preferences": { desc: "Granular controls for job alert frequencies, marketing emails, and SMS", badge: "Preferences", stat: "Customized" },
      "settings": { desc: "Legacy privacy controls, data sharing permissions, and account deletion", badge: "Privacy", stat: "DPDP ready" },
    },
    telemetry: [
      { name: "Two-Factor Auth Gateway", status: "Operational", info: "TOTP active" },
      { name: "Data Privacy & DPDP Compliance", status: "Operational", info: "100% compliant" },
    ],
    auditTrail: [
      { action: "Security baseline re-verified with Google Authenticator", user: "You", time: "3d ago" },
      { action: "Email digest frequency set to Daily 9:00 AM", user: "You", time: "1w ago" },
    ],
  },
};

export function CandidateSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  // Find the section in candidate portal config
  const candidateConfig = portalConfigs.candidate;
  const allItems = candidateConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = CANDIDATE_SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and quick access to all candidate tools and modules in this section.",
    icon: currentItem?.icon || "LayoutDashboard",
    kpis: [
      { label: "Total Modules", value: `${currentItem?.children?.length || 0} Tools`, icon: "Grid3x3", tone: "brand" },
      { label: "Status", value: "Active & Ready", icon: "CheckCircle2", tone: "success" },
      { label: "Profile Sync", value: "100% Synced", icon: "UserCheck", tone: "default" },
      { label: "Account Health", value: "Excellent", icon: "ShieldCheck", tone: "success" },
    ],
  };

  const children: NavItem[] = currentItem?.children || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.title}
        description={meta.desc}
        icon={<Icon name={meta.icon} className="h-6 w-6 text-brand" />}
        actions={[
          {
            label: "Refresh Hub",
            variant: "outline",
            onClick: () => window.location.reload(),
          },
        ]}
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        {meta.kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            label={kpi.label}
            value={kpi.value}
            icon={<Icon name={kpi.icon} className="h-5 w-5" />}
            tone={kpi.tone || "default"}
          />
        ))}
      </div>

      {/* Grid of All Available Modules (from sub-sidebar) */}
      <SectionCard
        title="Available Modules & Tools"
        description="Select any capability below or from the sidebar sub-menu to manage"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => {
            const childMeta = meta.childDescriptions?.[child.key];
            const desc = childMeta?.desc || `Access and manage ${child.label} within your candidate portal.`;
            const badge = childMeta?.badge || "Tool";
            const stat = childMeta?.stat || "Active";

            return (
              <button
                key={child.key}
                onClick={() => navigate("candidate", child.key)}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 text-left transition-all hover:border-brand/40 hover:bg-brand/5 hover:shadow-xs cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                      <Icon name={child.icon} className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {badge}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors flex items-center justify-between">
                    <span>{child.label}</span>
                    <Icon
                      name="ArrowRight"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand"
                    />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                    {stat}
                  </span>
                  <span className="text-muted-foreground">Click to open &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Overview Telemetry & Activity Snapshot */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Domain Telemetry Snapshot" description="Real-time subsystem health & synchronization">
          <div className="space-y-3">
            {(meta.telemetry || [
              { name: "Candidate Sync Gateway", status: "Operational", info: "Live sync" },
              { name: "Career Services Bus", status: "Operational", info: "In sync" },
              { name: "Notification Engine", status: "Operational", info: "Active" },
            ]).map((srv) => (
              <div key={srv.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${srv.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-medium text-foreground">{srv.name}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="font-semibold text-foreground">{srv.info}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity & Timeline" description="Latest career milestones & notifications in this section">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} updated with latest achievements`, user: "You", time: "1h ago" },
              { action: "Profile visibility verified for partner employers", user: "Career Engine", time: "1d ago" },
              { action: "Weekly career digest generated", user: "Automated System", time: "3d ago" },
            ]).map((audit, i) => (
              <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div>
                  <p className="font-medium text-foreground">{audit.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">By {audit.user}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{audit.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

