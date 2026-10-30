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

const TRAINING_SECTION_METADATA: Record<string, SectionMeta> = {
  "training-ops": {
    title: "Training Operations & Curriculum",
    desc: "Manage course catalogs, curriculum design, cohorts, live sessions, trainer allocations, assessments, and gradebooks.",
    icon: "GraduationCap",
    kpis: [
      { label: "Active Courses", value: "128 Courses", icon: "BookOpen", tone: "brand" },
      { label: "Enrolled Students", value: "3,420 Enrolled", icon: "Users", tone: "success" },
      { label: "Avg Completion Rate", value: "88.4%", icon: "Flag", tone: "success" },
      { label: "Active Cohorts", value: "24 Batches", icon: "Users2", tone: "default" },
    ],
    childDescriptions: {
      "courses": { desc: "Master course catalog, module lessons, syllabus definitions, and prerequisites", badge: "Catalog", stat: "128 courses" },
      "curriculum-designer": { desc: "Interactive drag-and-drop curriculum builder for multi-week learning tracks", badge: "Authoring", stat: "Visual Studio" },
      "cohorts": { desc: "Scheduled student batches, enrollment rosters, and batch progress timelines", badge: "Batches", stat: "24 cohorts" },
      "live-training": { desc: "Virtual classrooms, webinar links, breakout rooms, and session recordings", badge: "Live Studio", stat: "Daily sessions" },
      "trainers": { desc: "Faculty directory, subject matter expertise, credentials, and instructor reviews", badge: "Faculty", stat: "42 instructors" },
      "trainer-allocation": { desc: "Instructor scheduling, cohort assignment matrix, and teaching hour workload", badge: "Allocation", stat: "Optimized" },
      "completion-tracker": { desc: "Live milestone tracking, learner dropout risk alerts, and pace analysis", badge: "Milestones", stat: "88.4% rate" },
      "assessments": { desc: "Mid-term tests, coding challenges, quizzes, and proctored examinations", badge: "Exams", stat: "Proctored" },
      "question-bank": { desc: "Categorized pool of MCQs, coding prompts, and rubric questions", badge: "Repository", stat: "2,400 questions" },
      "certifications": { desc: "Accredited credential issuance, badge templates, and certificate generation", badge: "Credentials", stat: "1,850 issued" },
      "attendance": { desc: "Automated session attendance logs, check-in timestamps, and leave requests", badge: "Attendance", stat: "94.2% avg" },
      "gradebook": { desc: "Consolidated student marks, cumulative GPAs, and class ranking analytics", badge: "Grades", stat: "All cohorts" },
    },
    telemetry: [
      { name: "Live Video LMS Gateway", status: "Operational", info: "Sub-50ms latency" },
      { name: "Proctored Exam Monitor", status: "Operational", info: "Anti-cheat active" },
      { name: "Attendance Ingestion Bus", status: "Operational", info: "Automated sync" },
    ],
    auditTrail: [
      { action: "Full Stack Web Development Cohort #12 marked complete", user: "Faculty System", time: "1h ago" },
      { action: "New certification template 'Cloud DevOps Specialist' published", user: "Academic Dean", time: "4h ago" },
      { action: "Mid-term evaluation grades submitted for Data Science Batch B", user: "Lead Trainer", time: "1d ago" },
    ],
  },

  "talent-solutions": {
    title: "Talent Solutions & Enterprise Programs",
    desc: "Train-to-Hire programs, Hire-to-Train enterprise models, corporate upskilling, talent search, and placement pipeline.",
    icon: "Target",
    kpis: [
      { label: "T2H Candidates", value: "420 Trainees", icon: "GraduationCap", tone: "brand" },
      { label: "Verified Placements", value: "184 Placed", icon: "Handshake", tone: "success" },
      { label: "Corporate Clients", value: "38 Enterprises", icon: "Building2", tone: "default" },
      { label: "Placement Rate", value: "92.6%", icon: "TrendingUp", tone: "success" },
    ],
    childDescriptions: {
      "ts-hub": { desc: "Talent Solutions command center, active corporate contracts, and cohort deployment overview", badge: "Solutions Hub", stat: "Command center" },
      "ts-train-to-hire": { desc: "Intensive bootcamp pipeline training candidates pre-vetted for guaranteed job placement", badge: "T2H Program", stat: "420 enrolled" },
      "ts-hire-to-train": { desc: "Customized onboarding academies for companies hiring talent before training begins", badge: "H2T Enterprise", stat: "12 clients" },
      "ts-corporate-training": { desc: "Executive workshops, upskilling modules, and team certification packages", badge: "B2B Training", stat: "26 workshops" },
      "talent-search": { desc: "AI-assisted semantic search across certified student profiles and assessment scores", badge: "AI Search", stat: "Real-time" },
      "placements": { desc: "Track verified enterprise offers, joining dates, and client verification signatures", badge: "Placements", stat: "184 placed" },
    },
    telemetry: [
      { name: "Talent Solution Pipeline Engine", status: "Operational", info: "Live sync" },
      { name: "Enterprise Verification Service", status: "Operational", info: "99.9% uptime" },
      { name: "Candidate Scoring Algorithm", status: "Operational", info: "Calibrated" },
    ],
    auditTrail: [
      { action: "T2H Cohort 'Fintech Engineers' matched with 4 corporate partners", user: "Placement Cell", time: "2h ago" },
      { action: "Offer acceptance received for 18 trainees from Cognizant", user: "Enterprise Ops", time: "6h ago" },
      { action: "Custom curriculum approved for Infosys Cloud Upskilling Program", user: "Program Director", time: "1d ago" },
    ],
  },

  "business": {
    title: "Business Development & Client Management",
    desc: "Manage training provider profile, enterprise corporate clients, training programs, sponsorships, and client invoices.",
    icon: "Handshake",
    kpis: [
      { label: "Corporate Clients", value: "52 Accounts", icon: "Building2", tone: "brand" },
      { label: "Active Programs", value: "18 Programs", icon: "Target", tone: "default" },
      { label: "Sponsored Capital", value: "₹1.42 Cr", icon: "Coins", tone: "success" },
      { label: "Invoice Collection Rate", value: "96.4%", icon: "Receipt", tone: "success" },
    ],
    childDescriptions: {
      "training-profile": { desc: "Public training academy profile, accreditations, campus facilities, and media", badge: "Provider Profile", stat: "Verified" },
      "clients": { desc: "Enterprise corporate client directory, points of contact, and training requirements", badge: "Clients", stat: "52 accounts" },
      "programs": { desc: "Custom multi-month training program proposals, deliverables, and SLAs", badge: "Programs", stat: "18 active" },
      "campaigns": { desc: "Student enrollment marketing campaigns, lead funnels, and registration forms", badge: "Growth", stat: "6 campaigns" },
      "corporate-sponsorship": { desc: "CSR education grants, corporate sponsorships, and sponsored student quotas", badge: "Sponsorships", stat: "₹1.42 Cr total" },
      "budgets": { desc: "Corporate training budgets, cost per trainee benchmarks, and expense allocations", badge: "Budgets", stat: "Allocated" },
      "invoices": { desc: "B2B training invoices, tax calculations, payment status, and automated receipting", badge: "Billing", stat: "All reconciled" },
      "academy": { desc: "White-labeled corporate academies and dedicated client training portals", badge: "Academies", stat: "8 active portals" },
    },
    telemetry: [
      { name: "Client CRM Synchronization", status: "Operational", info: "In sync" },
      { name: "B2B Invoice Billing Pipeline", status: "Operational", info: "99.8% uptime" },
      { name: "Corporate Academy Federation", status: "Operational", info: "8 portals live" },
    ],
    auditTrail: [
      { action: "Enterprise contract renewed with Tata Motors for 2026 academy", user: "BD Director", time: "3h ago" },
      { action: "CSR Sponsorship funds ₹24.0 L cleared for STEM scholar cohort", user: "Finance Lead", time: "1d ago" },
    ],
  },

  "transactions-grp": {
    title: "Transactions, Fees & Settlements",
    desc: "Central billing center, payment gateway connectors, settlement engine, student fee collection, and refund management.",
    icon: "Wallet",
    kpis: [
      { label: "Gross Fee Collection", value: "₹2.84 Cr", icon: "ReceiptText", tone: "brand" },
      { label: "Settled This Month", value: "₹68.5 L", icon: "Coins", tone: "success" },
      { label: "Pending Settlements", value: "₹12.2 L", icon: "Wallet", tone: "warning" },
      { label: "Refund / Dispute Rate", value: "0.14%", icon: "RotateCcw", tone: "success" },
    ],
    childDescriptions: {
      "transaction-hub": { desc: "Consolidated financial ledger, real-time volume metrics, and settlement statuses", badge: "Overview", stat: "Live ledger" },
      "transactions": { desc: "Complete searchable audit log of every tuition payment, refund, and payout", badge: "Audit Trail", stat: "14,200 records" },
      "billing-center": { desc: "Configurable student fee schedules, installment plans, and early bird discounts", badge: "Billing", stat: "Tiered plans" },
      "payment-gateway": { desc: "Razorpay, Stripe, UPI, and net banking gateway status, webhook health, and keys", badge: "Gateways", stat: "All connected" },
      "settlement-engine": { desc: "Automated revenue split calculation between institution, trainers, and platform", badge: "Engine", stat: "T+1 automated" },
      "fee-collection": { desc: "Student fee dues tracker, auto-debit triggers, and delinquent account alerts", badge: "Collections", stat: "98% on-time" },
      "invoice-rules": { desc: "GST tax rules, auto-numbering conventions, invoice headers, and notes", badge: "Rules", stat: "Compliant" },
      "refunds": { desc: "Student withdrawal and fee refund workflow with approval stages and audit checks", badge: "Refunds", stat: "3 pending" },
      "transaction-comms": { desc: "Automated payment confirmation receipts, installment reminders, and notifications", badge: "Comms", stat: "SMS + Email" },
    },
    telemetry: [
      { name: "Razorpay / UPI Payment Gateway", status: "Operational", info: "Latency 110ms" },
      { name: "Automated Settlement Engine", status: "Operational", info: "T+1 Daily" },
      { name: "GST Tax Ledger Validator", status: "Operational", info: "Compliant" },
    ],
    auditTrail: [
      { action: "Daily batch settlement ₹14.8 L executed to institutional account", user: "Settlement Engine", time: "2h ago" },
      { action: "Student fee installment reminders sent to 124 candidates", user: "Billing Automations", time: "5h ago" },
      { action: "Refund request #RF-842 approved for course withdrawal", user: "Accounts Officer", time: "1d ago" },
    ],
  },

  "talent": {
    title: "Talent, Students & Skill Verification",
    desc: "Student 360° profiles, enterprise sourcing requests, skill taxonomy frameworks, AI gap analysis, and scholarships.",
    icon: "Users",
    kpis: [
      { label: "Total Students", value: "6,850 Learners", icon: "Users", tone: "brand" },
      { label: "Skills Framework", value: "340 Skills", icon: "Brain", tone: "default" },
      { label: "Verified Credentials", value: "4,120 Issued", icon: "BadgeCheck", tone: "success" },
      { label: "Scholarships Awarded", value: "₹24.5 L", icon: "Award", tone: "success" },
    ],
    childDescriptions: {
      "student-profile-360": { desc: "Unified learner view with course history, assignment submissions, code repos, and scores", badge: "Student 360°", stat: "6,850 profiles" },
      "sourcing-requests": { desc: "Employer talent sourcing requests tailored to specific course cohorts and skill sets", badge: "Requests", stat: "28 requests" },
      "skills": { desc: "Standardized industry skill taxonomy mapped to course curricula and market demand", badge: "Framework", stat: "340 skills" },
      "skill-gaps": { desc: "AI-powered cohort gap analysis comparing student progress against market hiring bars", badge: "AI Diagnostics", stat: "Real-time" },
      "compliance": { desc: "Academic integrity monitoring, attendance rules compliance, and course code of conduct", badge: "Compliance", stat: "Audited" },
      "enrollments": { desc: "Active course enrollment registry, student waitlists, and cohort transfers", badge: "Enrollments", stat: "3,420 active" },
      "enrollment-approval": { desc: "Admission workflow, prerequisite screening, document verification, and seat allocation", badge: "Approvals", stat: "42 pending" },
      "verify-credentials": { desc: "Blockchain-backed certificate cryptographic verification and tamper-proof badges", badge: "Security", stat: "Cryptographic" },
      "scholarships": { desc: "Merit-based scholarships, financial aid allocations, and donor grant tracking", badge: "Grants", stat: "140 recipients" },
    },
    telemetry: [
      { name: "Student 360° Indexer", status: "Operational", info: "Real-time profile sync" },
      { name: "Skill Graph & Taxonomy Bus", status: "Operational", info: "v3.2 active" },
      { name: "Credential Cryptographic Registry", status: "Operational", info: "Tamper-proof" },
    ],
    auditTrail: [
      { action: "Student 360° profile sync updated for 180 graduated learners", user: "System Indexer", time: "2h ago" },
      { action: "15 Merit scholarships disbursed for AI & ML advanced batch", user: "Scholarship Committee", time: "6h ago" },
    ],
  },

  "admin": {
    title: "Platform Administration & Governance",
    desc: "Administrative overview, user access controls, RBAC hierarchy, multi-tenant organizations, and system audit logs.",
    icon: "Shield",
    kpis: [
      { label: "Admin Users", value: "18 Admins", icon: "Shield", tone: "brand" },
      { label: "Active Organizations", value: "42 Orgs", icon: "Building2", tone: "default" },
      { label: "RBAC Role Matrix", value: "8 Active Roles", icon: "ShieldCheck", tone: "success" },
      { label: "Security Compliance", value: "100% Enforced", icon: "CheckCircle2", tone: "success" },
    ],
    childDescriptions: {
      "adm-overview": { desc: "Platform operations overview, user concurrency, critical alerts, and system uptime", badge: "Overview", stat: "Operational" },
      "adm-user-mgmt": { desc: "User provisioning, account status, credential resets, and 2FA enforcement", badge: "Users", stat: "Full control" },
      "adm-roles-hierarchy": { desc: "Granular permission matrix, role inheritance trees, and scoped operational grants", badge: "RBAC", stat: "8 roles" },
      "adm-organizations": { desc: "Multi-tenant academic and training provider organization management and domains", badge: "Tenants", stat: "42 orgs" },
      "adm-partner-mgmt": { desc: "Accredited training partner agreements, renewals, and partner tiering", badge: "Partners", stat: "Active" },
      "adm-audit-logs": { desc: "Tamper-evident system audit log of all administrative actions, logins, and permission changes", badge: "Audit", stat: "Immutable" },
    },
    telemetry: [
      { name: "Administrative Auth & IAM", status: "Operational", info: "2FA Enforced" },
      { name: "Multi-tenant Policy Validator", status: "Operational", info: "Strict isolation" },
      { name: "System Audit Logger", status: "Operational", info: "Zero dropped logs" },
    ],
    auditTrail: [
      { action: "Role 'Senior Curriculum Reviewer' added with content publishing rights", user: "Super Admin", time: "1h ago" },
      { action: "Quarterly security audit report generated", user: "Compliance Engine", time: "5h ago" },
    ],
  },

  "finance-grp": {
    title: "Platform Revenue & Partner Payouts",
    desc: "Platform revenue stream monitoring, training partner payout distribution, application vetting, and system config.",
    icon: "Banknote",
    kpis: [
      { label: "Platform Revenue", value: "₹1.86 Cr", icon: "Banknote", tone: "brand" },
      { label: "Partner Payouts", value: "₹94.2 L", icon: "Coins", tone: "success" },
      { label: "Partner Portals", value: "24 Portals", icon: "Building2", tone: "default" },
      { label: "Transaction Health", value: "100% Green", icon: "Gauge", tone: "success" },
    ],
    childDescriptions: {
      "adm-platform-revenue": { desc: "Platform gross commission breakdown, course marketplace share, and revenue forecasting", badge: "Revenue", stat: "Real-time" },
      "adm-partner-payouts": { desc: "Disbursement batch processor for educator payouts, commissions, and bank remittances", badge: "Disbursements", stat: "Automated" },
      "adm-transaction-monitoring": { desc: "Fraud anomaly detection, high-value transaction flags, and AML checks", badge: "Monitoring", stat: "Live telemetry" },
      "adm-partner-applications": { desc: "Review queue for new training institutions, trainer credentials, and onboarding", badge: "Applications", stat: "6 pending" },
      "adm-partner-performance": { desc: "Partner ranking leaderboard, student NPS scores, and course completion benchmarks", badge: "Scorecard", stat: "Evaluated" },
      "adm-system-config": { desc: "Centralized configuration parameters, system flags, currency units, and environment specs", badge: "Config", stat: "Managed" },
    },
    telemetry: [
      { name: "Platform Revenue Stream Aggregator", status: "Operational", info: "Sub-second sync" },
      { name: "Bank Payout Remittance Gateway", status: "Operational", info: "Direct NEFT / RTGS" },
      { name: "Partner Fraud Anomaly Detector", status: "Operational", info: "Zero flags" },
    ],
    auditTrail: [
      { action: "Monthly partner commission batch executed for 24 training institutions", user: "Payout Processor", time: "3h ago" },
      { action: "New training partner application approved: 'Apex AI Academy'", user: "Partner Lead", time: "1d ago" },
    ],
  },

  "tools-grp": {
    title: "Academic Tools & Campus Community",
    desc: "Certificate verifier, approval workflows, external content providers, data export tools, student messaging, and forums.",
    icon: "Wrench",
    kpis: [
      { label: "Content Providers", value: "16 Providers", icon: "Handshake", tone: "brand" },
      { label: "Export Jobs", value: "100% Success", icon: "FileText", tone: "success" },
      { label: "Active Forum Posts", value: "840 Threads", icon: "MessageSquare", tone: "default" },
      { label: "Student Messages", value: "2,450 / Wk", icon: "MessageSquare", tone: "success" },
    ],
    childDescriptions: {
      "verify-cert": { desc: "Public instant certificate QR and serial number credential lookup tool", badge: "Verifier", stat: "Instant lookup" },
      "approvals": { desc: "Multi-step approval queue for course syllabi, fee adjustments, and student transfers", badge: "Approvals", stat: "Action items" },
      "providers": { desc: "Third-party content vendors, Coursera, Udemy, and SCORM provider integrations", badge: "Vendors", stat: "16 connected" },
      "data-export": { desc: "Compliance data dump builder, CSV/Excel/JSON bulk reporting, and student transcripts", badge: "Export", stat: "Instant download" },
      "student-messaging": { desc: "Direct 1:1 and broadcast communication channel between instructors and students", badge: "Messaging", stat: "Active" },
      "parent-portal": { desc: "Guardian access center for viewing student grades, attendance records, and dues", badge: "Guardians", stat: "Portal ready" },
      "discussion-forums": { desc: "Collaborative peer learning boards, doubt-clearing threads, and coding help", badge: "Community", stat: "840 threads" },
    },
    telemetry: [
      { name: "Public Certificate Verification CDN", status: "Operational", info: "Global edge" },
      { name: "Student Messaging Gateway", status: "Operational", info: "WebSocket ready" },
      { name: "Discussion Forum Indexer", status: "Operational", info: "Sub-second search" },
    ],
    auditTrail: [
      { action: "Credential verification batch completed for 48 campus applicants", user: "Verification Engine", time: "2h ago" },
      { action: "Bulk grade export dispatched to regulatory academic portal", user: "Admin", time: "5h ago" },
    ],
  },

  "support-grp": {
    title: "Support & Announcements Hub",
    desc: "Campus helpdesk, platform announcements, operational audit trails, and legacy support ticketing.",
    icon: "HelpCircle",
    kpis: [
      { label: "Support Tickets", value: "8 Open", icon: "LifeBuoy", tone: "brand" },
      { label: "Avg Resolution Time", value: "2.4 Hours", icon: "Clock", tone: "success" },
      { label: "Campus Broadcasts", value: "4 Active", icon: "Megaphone", tone: "default" },
      { label: "Satisfaction Rate", value: "98.2%", icon: "Star", tone: "success" },
    ],
    childDescriptions: {
      "support-hub": { desc: "Unified support command center with triage ticketing, live chat, and FAQs", badge: "Help Center", stat: "8 open" },
      "announcements": { desc: "Campus-wide broadcasts, emergency alerts, exam schedule updates, and holidays", badge: "Broadcasts", stat: "4 active" },
      "audit-logs": { desc: "Historical audit log of student grades, attendance revisions, and admin operations", badge: "Audit", stat: "Audited" },
      "support": { desc: "Direct ticketing queue with instructor and student escalation paths", badge: "Tickets", stat: "98% satisfaction" },
    },
    telemetry: [
      { name: "Support Ticket Router", status: "Operational", info: "SLA: < 30m" },
      { name: "Announcement Push Service", status: "Operational", info: "Multi-channel active" },
    ],
    auditTrail: [
      { action: "Campus announcement published: 'Diwali Holiday Schedule & Lab Access'", user: "Campus Admin", time: "1h ago" },
      { action: "Ticket #SUP-192 resolved: Student gradebook sync issue fixed", user: "Support Lead", time: "3h ago" },
    ],
  },

  "settings-grp": {
    title: "Training & Platform Settings",
    desc: "Institution settings hub, security center, notification triggers, and third-party API integrations.",
    icon: "Settings",
    kpis: [
      { label: "Platform Security", value: "ISO / SOC2", icon: "ShieldCheck", tone: "brand" },
      { label: "2FA Enforcement", value: "100% Enforced", icon: "Lock", tone: "success" },
      { label: "Active Integrations", value: "12 Connectors", icon: "Plug", tone: "default" },
      { label: "Notification Health", value: "99.9% Delivered", icon: "Bell", tone: "success" },
    ],
    childDescriptions: {
      "settings-hub": { desc: "Institution profile settings, campus calendar defaults, grading curves, and branding", badge: "Academy Settings", stat: "Configured" },
      "security-center": { desc: "Multi-factor authentication rules, password expiration, IP whitelisting, and SSL", badge: "Security", stat: "Enforced" },
      "notification-preferences": { desc: "Course reminder dispatch rules, SMS notification triggers, and email digest timing", badge: "Dispatch", stat: "Customized" },
      "integrations": { desc: "Zoom, Google Meet, Slack, Canvas LMS, and GitHub classroom API webhooks", badge: "Connectors", stat: "12 active" },
      "settings": { desc: "Legacy system preferences, localized timezone settings, and fallback rules", badge: "Legacy", stat: "Synced" },
    },
    telemetry: [
      { name: "Configuration Store", status: "Operational", info: "In sync" },
      { name: "Security Audit Policy Engine", status: "Operational", info: "Enforced" },
      { name: "LMS Connector Webhook Gateway", status: "Operational", info: "All green" },
    ],
    auditTrail: [
      { action: "Zoom classroom API token rotated and verified", user: "DevOps", time: "4h ago" },
      { action: "Institution grading curve updated for Engineering 2026", user: "Dean's Office", time: "1d ago" },
    ],
  },
};

export function TrainingSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  const trainingConfig = portalConfigs.training;
  const allItems = trainingConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = TRAINING_SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and access to all capabilities and operations in this domain.",
    icon: currentItem?.icon || "GraduationCap",
    kpis: [
      { label: "Active Modules", value: `${currentItem?.children?.length || 0} Modules`, icon: "Grid3x3", tone: "brand" },
      { label: "Operational Status", value: "Operational", icon: "CheckCircle2", tone: "success" },
      { label: "Subsystem Health", value: "99.98%", icon: "ShieldCheck", tone: "success" },
      { label: "Domain Sync", value: "Live", icon: "Activity", tone: "default" },
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
            label: "Refresh Dashboard",
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

      {/* Grid of All Available Capabilities (from contextual sub-sidebar) */}
      <SectionCard
        title="Available Capabilities & Modules"
        description="Select any capability below or from the contextual sidebar to open"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {children.map((child) => {
            const extra = meta.childDescriptions?.[child.key];
            return (
              <button
                key={child.key}
                onClick={() => navigate("training", child.key)}
                className="group relative flex flex-col justify-between text-left p-4 rounded-xl border border-border/60 bg-card hover:bg-sidebar-accent/50 hover:border-brand/40 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                      <Icon name={child.icon} className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {child.badge && (
                        <Badge variant="secondary" className="text-[10px] font-semibold bg-brand/15 text-brand">
                          {child.badge}
                        </Badge>
                      )}
                      {extra?.badge && (
                        <Badge variant="outline" className="text-[10px] font-normal border-border/80 text-muted-foreground">
                          {extra.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-brand transition-colors">
                    {child.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {extra?.desc || "Manage and view real-time data and settings for this operational view."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">{extra?.stat || "Active"}</span>
                  <span className="flex items-center gap-1 text-brand font-medium group-hover:translate-x-0.5 transition-transform">
                    Open <Icon name="ChevronRight" className="h-3 w-3" />
                  </span>
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
              { name: "Training Operations Service", status: "Operational", info: "99.98% uptime" },
              { name: "Academic Ledger Bus", status: "Operational", info: "In sync" },
              { name: "Notification & Webhook Dispatcher", status: "Operational", info: "Automated" },
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

        <SectionCard title="Recent Activity & Audit Trail" description="Recent academic, student, and training actions">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} updated with latest cohort benchmarks`, user: "Academic Ops", time: "1h ago" },
              { action: "Student progress reports generated for corporate review", user: "LMS Automated", time: "1d ago" },
              { action: "Weekly course attendance and quiz analytics generated", user: "Automated System", time: "3d ago" },
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

