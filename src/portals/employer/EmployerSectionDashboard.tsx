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

const EMPLOYER_SECTION_METADATA: Record<string, SectionMeta> = {
  "hiring": {
    title: "Hiring & Recruitment Workspace",
    desc: "Oversee active job postings, talent requisitions, applicants, interview stages, and hiring manager debriefs.",
    icon: "Briefcase",
    kpis: [
      { label: "Active Jobs", value: "18 Openings", icon: "Briefcase", tone: "brand" },
      { label: "Total Applicants", value: "342 Candidates", icon: "Users", tone: "default" },
      { label: "Interviews This Week", value: "24 Scheduled", icon: "Calendar", tone: "warning" },
      { label: "Time-to-Hire", value: "19 Days Avg", icon: "Clock", tone: "success" },
    ],
    childDescriptions: {
      "jobs": { desc: "Active, draft, and archived job listings across all company departments", badge: "Jobs Directory", stat: "18 open" },
      "create-job": { desc: "Draft and publish new job openings with AI-assisted JD generation and salary suggestions", badge: "Job Creator", stat: "New opening" },
      "requisitions": { desc: "Manage departmental headcount requisitions, hiring justifications, and budget sign-offs", badge: "Requisitions", stat: "4 approved" },
      "applicants": { desc: "Screen inbound candidates, review resumes, and score applicant matches with AI filters", badge: "Screening", stat: "342 candidates" },
      "pipeline": { desc: "Visual recruitment Kanban pipeline tracking candidates through screening, tech rounds, and offers", badge: "Pipeline", stat: "Live board" },
      "interviews": { desc: "Coordinate team interview schedules, room links, and calendar invites across teams", badge: "Schedules", stat: "24 this week" },
      "interview-kits": { desc: "Role-specific interview scorecards, structured evaluation rubrics, and technical questions", badge: "Evaluation", stat: "12 kits" },
      "debriefs": { desc: "Consolidate interviewer feedback, compare candidate ratings, and finalize hiring consensus", badge: "Consensus", stat: "3 pending" },
      "hiring-manager-portal": { desc: "Dedicated portal view for hiring managers to review and thumbs-up candidates on the go", badge: "Hiring Leads", stat: "Mobile ready" },
    },
    telemetry: [
      { name: "Applicant Ingestion Gateway", status: "Operational", info: "Real-time parsing" },
      { name: "Calendar Integration (Google/Outlook)", status: "Operational", info: "Bidirectional sync" },
      { name: "AI Match Score Engine", status: "Operational", info: "94% precision" },
    ],
    auditTrail: [
      { action: "Candidate Sarah Chen moved to Offer Extended for Senior Backend Lead", user: "Hiring Manager", time: "30m ago" },
      { action: "New job 'Product Designer (Design Systems)' published to LinkedIn & Indeed", user: "Recruiter", time: "2h ago" },
      { action: "Interview debrief completed for DevOps Architect opening", user: "Interview Panel", time: "4h ago" },
    ],
  },

  "talent": {
    title: "Workforce & Team Management",
    desc: "Candidate search, talent pools, background verifications, employee onboarding, probation, and retention.",
    icon: "Users",
    kpis: [
      { label: "Talent Pool Size", value: "1,420 Profiles", icon: "Database", tone: "brand" },
      { label: "Offers Extended", value: "6 Active", icon: "Gift", tone: "warning" },
      { label: "Active Employees", value: "184 Team", icon: "Users2", tone: "default" },
      { label: "BGV Cleared", value: "98.4%", icon: "ShieldCheck", tone: "success" },
    ],
    childDescriptions: {
      "talent-search": { desc: "Global search across pre-vetted candidates with filters for skills, location, and CTC", badge: "Talent Discovery", stat: "38k searchable" },
      "talent-pool": { desc: "Engage silver-medalist candidates, alumni networks, and future talent pipelines", badge: "Nurturing", stat: "1.4k profiles" },
      "shortlists": { desc: "Curated lists of candidates shared with department heads for fast-track hiring", badge: "Curated", stat: "8 lists" },
      "compare-candidates": { desc: "Side-by-side evaluation of candidate skill ratings, assessments, and salary expectations", badge: "Comparison", stat: "Matrix view" },
      "offers": { desc: "Generate and extend digital offer letters with compensation breakdown and sign-off", badge: "Offers", stat: "6 extended" },
      "hires": { desc: "Directory of confirmed hires, joined employees, and departmental work assignments", badge: "Workforce", stat: "184 members" },
      "background-verification": { desc: "Track candidate identity checks, criminal records, and reference verifications", badge: "BGV Screening", stat: "98.4% clear" },
      "onboarding": { desc: "Monitor Day-1 orientation tasks, IT hardware provisioning, and compliance forms", badge: "Onboarding", stat: "8 in progress" },
      "probation": { desc: "Track 30/60/90-day post-hire performance milestones and confirmation reviews", badge: "Probation", stat: "14 tracked" },
      "performance-review": { desc: "Coordinate quarterly employee reviews, 360-degree feedback, and goal appraisals", badge: "Appraisals", stat: "Q4 active" },
      "leave-management": { desc: "Team leave balances, vacation requests, and statutory holiday calendars", badge: "Attendance", stat: "Compliant" },
      "exit-management": { desc: "Manage employee resignations, offboarding checklists, and exit interviews", badge: "Offboarding", stat: "2 active" },
      "referral-program": { desc: "Internal employee referral bonuses, submission tracking, and reward payouts", badge: "Referrals", stat: "₹45k paid YTD" },
      "campaigns": { desc: "Automated email and SMS outreach campaigns to prospective talent benches", badge: "Outreach", stat: "3 active" },
      "team": { desc: "Manage recruiter assignments, team workload distribution, and hiring capacity", badge: "Capacity", stat: "6 recruiters" },
    },
    telemetry: [
      { name: "Background Verification API (IDfy/AuthBridge)", status: "Operational", info: "Avg SLA: 48h" },
      { name: "Digital Contract E-Sign Gateway", status: "Operational", info: "Aadhaar / DocuSign" },
    ],
    auditTrail: [
      { action: "Offer letter generated for Priya Sharma (Full Stack Engineer)", user: "HR Ops", time: "1h ago" },
      { action: "Background check cleared for Marcus Williams", user: "BGV Partner", time: "3h ago" },
      { action: "Employee onboarding checklist completed for 3 new joiners", user: "People Team", time: "1d ago" },
    ],
  },

  "learning": {
    title: "Learning & Development (L&D)",
    desc: "Upskill employees, assign mandatory compliance training, identify skill gaps, and track training ROI.",
    icon: "GraduationCap",
    kpis: [
      { label: "Enrolled Employees", value: "128 Enrolled", icon: "UserCheck", tone: "brand" },
      { label: "Course Completion", value: "91.2%", icon: "Award", tone: "success" },
      { label: "Compliance Certified", value: "100%", icon: "ShieldCheck", tone: "success" },
      { label: "Training ROI", value: "3.8x Yield", icon: "TrendingUp", tone: "default" },
    ],
    childDescriptions: {
      "ld-dashboard": { desc: "High-level overview of employee learning progress, course hours, and skill improvements", badge: "Overview", stat: "128 staff" },
      "assign-learning": { desc: "Assign specialized courses, certification tracks, and workshops to teams or individuals", badge: "Assignment", stat: "Custom tracks" },
      "employee-learning": { desc: "Track individual learner progression, quiz scores, and course completion dates", badge: "Progress", stat: "91.2% rate" },
      "compliance-training": { desc: "Mandatory workplace safety, POSH compliance, and data privacy certifications", badge: "Mandatory", stat: "100% compliant" },
      "skill-gaps": { desc: "AI-driven analysis identifying critical technical and leadership skill deficiencies", badge: "AI Analysis", stat: "3 gaps flagged" },
      "training-roi": { desc: "Measure business impact, retention improvements, and productivity gains from L&D", badge: "ROI Metrics", stat: "3.8x ROI" },
    },
    telemetry: [
      { name: "LMS Content Delivery Stream", status: "Operational", info: "High-speed CDN" },
      { name: "Compliance Recertification Engine", status: "Operational", info: "Auto-alerts active" },
    ],
    auditTrail: [
      { action: "Assigned 'Advanced Kubernetes for Production' to Cloud Engineering team", user: "Tech Director", time: "2h ago" },
      { action: "Annual POSH Compliance certification completed with 100% attendance", user: "HR Compliance", time: "1d ago" },
    ],
  },

  "enterprise": {
    title: "Enterprise Governance & Multi-Entity",
    desc: "Multi-entity organizational structure, brand subsidiaries, headcount planning, budgets, and compliance audits.",
    icon: "Building2",
    kpis: [
      { label: "Corporate Entities", value: "4 Brands", icon: "Building2", tone: "brand" },
      { label: "Approved Headcount", value: "240 Positions", icon: "Users2", tone: "default" },
      { label: "Hiring Budget", value: "₹1.4 Cr", icon: "Banknote", tone: "success" },
      { label: "Pending Approvals", value: "3 Requests", icon: "ShieldCheck", tone: "warning" },
    ],
    childDescriptions: {
      "ent-overview": { desc: "Corporate overview of multi-entity operations, divisions, and group structure", badge: "Headquarters", stat: "Group view" },
      "ent-entities": { desc: "Manage company legal entities, brand subsidiaries, and regional branches", badge: "Subsidiaries", stat: "4 entities" },
      "ent-headcount": { desc: "Departmental hiring forecasts, approved quotas, and replacement planning", badge: "Forecasting", stat: "240 quota" },
      "ent-budgets": { desc: "Allocate and track department recruitment budgets, spend caps, and agency costs", badge: "Budgets", stat: "₹1.4 Cr total" },
      "ent-approvals": { desc: "Multi-tier approval workflows for job openings, salary exceptions, and offers", badge: "Authorizations", stat: "3 pending" },
      "ent-audit": { desc: "Immutable corporate audit trails for regulatory and statutory compliance checks", badge: "Audit Trail", stat: "Statutory ready" },
    },
    telemetry: [
      { name: "Enterprise Hierarchy Sync", status: "Operational", info: "Real-time" },
      { name: "Multi-Entity Budget Tracker", status: "Operational", info: "Synced with ERP" },
    ],
    auditTrail: [
      { action: "Headcount increase of 5 engineers approved for Bangalore Fintech Unit", user: "VP Engineering", time: "1d ago" },
      { action: "Entity 'FinTech Labs Singapore' tax registration updated", user: "Corporate Finance", time: "3d ago" },
    ],
  },

  "finance": {
    title: "Finance, Billing & Spend",
    desc: "Corporate wallet, invoices, GST tax receipts, partner settlements, recruitment tokens, and cost-per-hire analytics.",
    icon: "Wallet",
    kpis: [
      { label: "Employer Wallet", value: "₹1,84,000", icon: "Wallet", tone: "success" },
      { label: "Monthly Sourcing Spend", value: "₹4,20,000", icon: "Receipt", tone: "brand" },
      { label: "Cost Per Hire", value: "₹24,500 Avg", icon: "TrendingDown", tone: "default" },
      { label: "Available Credits", value: "840 Tokens", icon: "Coins", tone: "warning" },
    ],
    childDescriptions: {
      "emp-wallet": { desc: "Prepaid corporate balance for job postings, premium sourcing, and test credits", badge: "Balance", stat: "₹1.84L active" },
      "emp-transactions": { desc: "Itemized ledger of all recruitment expenses, subscription charges, and deposits", badge: "Ledger", stat: "142 transactions" },
      "emp-settlements": { desc: "Placement fee settlements with recruitment agencies and training partners", badge: "Settlements", stat: "4 pending" },
      "invoices": { desc: "Download GST-compliant tax invoices, monthly statements, and payment receipts", badge: "Invoices", stat: "All downloaded" },
      "tax-documents": { desc: "TDS certificates, form 16A, GST summaries, and fiscal compliance files", badge: "Tax Files", stat: "Quarterly filed" },
      "purchase-orders": { desc: "Corporate PO creation, approval status, and vendor billing reconciliation", badge: "PO Engine", stat: "6 active POs" },
      "cost-per-hire": { desc: "Detailed financial metrics tracking cost per recruit across departments and roles", badge: "Cost Metrics", stat: "₹24.5k avg" },
      "credits": { desc: "Manage assessment tokens, candidate contact credits, and bulk discounts", badge: "Credits", stat: "840 available" },
      "subscription": { desc: "Employer plan tier, auto-renewal preferences, and enterprise add-ons", badge: "Enterprise Plan", stat: "Annual plan" },
      "analytics": { desc: "Financial spend analytics, agency fee comparisons, and quarterly spend trends", badge: "Spend BI", stat: "Updated weekly" },
    },
    telemetry: [
      { name: "Payment Gateway Integration", status: "Operational", info: "Razorpay Corporate" },
      { name: "Automated GST Reconciliation", status: "Operational", info: "GSTR-2B Synced" },
    ],
    auditTrail: [
      { action: "Wallet auto-replenish executed (+₹1,00,000)", user: "Finance Lead", time: "2d ago" },
      { action: "Placement settlement approved for Cloud Sourcing Agency (₹85,000)", user: "Talent Ops", time: "3d ago" },
    ],
  },

  "partners": {
    title: "Partner Network & Ecosystem",
    desc: "Collaborate with staffing agencies, university campuses, and verified third-party recruitment services.",
    icon: "Handshake",
    kpis: [
      { label: "Partner Agencies", value: "18 Agencies", icon: "Handshake", tone: "brand" },
      { label: "Submitted Profiles", value: "142 Candidates", icon: "Users", tone: "default" },
      { label: "Contracted Services", value: "4 Services", icon: "Briefcase", tone: "default" },
      { label: "Submission Quality", value: "94% Match", icon: "Award", tone: "success" },
    ],
    childDescriptions: {
      "partner-talent": { desc: "Review and screen candidate profiles submitted directly by authorized staffing partners", badge: "Sourcing Channel", stat: "142 profiles" },
      "partner-services": { desc: "Outsourced recruitment services, RPO contracts, and specialized headhunting", badge: "RPO Services", stat: "4 contracts" },
    },
    telemetry: [
      { name: "Agency Submission Bridge", status: "Operational", info: "18 agencies active" },
      { name: "Vendor SLA Monitor", status: "Operational", info: "94% SLA compliance" },
    ],
    auditTrail: [
      { action: "Received batch submission of 8 Senior DevOps profiles from TechHire Agency", user: "TechHire", time: "4h ago" },
      { action: "Renewed MoU with Top Tier Staffing for Q4 tech mandates", user: "VP Talent", time: "2d ago" },
    ],
  },

  "talent-solutions": {
    title: "Talent Solutions & Programs",
    desc: "Train-to-Hire programs, custom bootcamps, and guaranteed talent pipelines tailored to corporate mandates.",
    icon: "GraduationCap",
    kpis: [
      { label: "Active Programs", value: "3 Cohorts", icon: "Briefcase", tone: "brand" },
      { label: "Cohort Trainees", value: "48 Engineers", icon: "Users", tone: "default" },
      { label: "Ready to Deploy", value: "16 Candidates", icon: "Award", tone: "success" },
      { label: "Program Budget", value: "₹24.0 L", icon: "Banknote", tone: "success" },
    ],
    childDescriptions: {
      "ts-hub": { desc: "Explore customized corporate training and talent pipeline programs", badge: "Solutions Hub", stat: "3 mandates" },
      "ts-programs": { desc: "Monitor ongoing corporate bootcamps, curriculum milestones, and student scores", badge: "Bootcamps", stat: "48 trainees" },
      "ts-transactions": { desc: "Corporate training sponsorship payments, escrow releases, and subsidies", badge: "Funding", stat: "₹24L escrow" },
      "partner-talent": { desc: "View graduate cohorts ready for immediate hire from corporate programs", badge: "Graduates", stat: "16 ready" },
    },
    telemetry: [
      { name: "Talent Solutions Milestone Tracker", status: "Operational", info: "Milestone 3 active" },
      { name: "Trainee Assessment Pipeline", status: "Operational", info: "92% pass rate" },
    ],
    auditTrail: [
      { action: "Signed off Graduation Milestone for 16 React & Node.js Apprentices", user: "Lead Mentor", time: "1d ago" },
      { action: "Escrow release approved for Cohort #2 training center", user: "Finance Admin", time: "3d ago" },
    ],
  },

  "support-grp": {
    title: "Support & Communication",
    desc: "Dedicated enterprise account management, direct candidate messaging, WhatsApp integration, and support tickets.",
    icon: "HelpCircle",
    kpis: [
      { label: "Dedicated Account Mgr", value: "Priya Sharma", icon: "UserCheck", tone: "brand" },
      { label: "Open Tickets", value: "0 Open", icon: "Ticket", tone: "success" },
      { label: "Avg Resolution Time", value: "< 15 Mins", icon: "Clock", tone: "success" },
      { label: "Messages This Month", value: "1,420 Sent", icon: "Mail", tone: "default" },
    ],
    childDescriptions: {
      "support-hub": { desc: "Browse enterprise FAQs, initiate live support chat, and track ticket status", badge: "Enterprise Help", stat: "Dedicated line" },
      "messages": { desc: "Direct messaging threads with candidates, agency recruiters, and hiring managers", badge: "Direct Chat", stat: "142 conversations" },
      "whatsapp-sms": { desc: "Automate candidate interview reminders and status updates via WhatsApp & SMS", badge: "WhatsApp Cloud", stat: "98% read rate" },
      "support": { desc: "Archived support requests, historical tickets, and communication logs", badge: "Historical", stat: "All closed" },
    },
    telemetry: [
      { name: "Enterprise Priority Queue", status: "Operational", info: "Dedicated SLA < 15m" },
      { name: "WhatsApp Business API Cloud", status: "Operational", info: "Live throughput" },
    ],
    auditTrail: [
      { action: "Automated WhatsApp interview reminder dispatched to 12 candidates", user: "Comms Bot", time: "1h ago" },
      { action: "Enterprise support ticket #E-9401 closed with 5-star rating", user: "Support Lead", time: "2d ago" },
    ],
  },

  "settings-grp": {
    title: "Settings & Company Branding",
    desc: "Company profile, employer branding score, benefits showcase, calendar sync, and team role permissions.",
    icon: "Settings",
    kpis: [
      { label: "Branding Score", value: "88 / 100", icon: "TrendingUp", tone: "brand" },
      { label: "Calendar Sync", value: "Google & Outlook", icon: "CalendarCheck", tone: "success" },
      { label: "Team Members", value: "14 Users", icon: "Users", tone: "default" },
      { label: "Active Integrations", value: "6 Connected", icon: "Plug", tone: "success" },
    ],
    childDescriptions: {
      "settings-hub": { desc: "Manage company details, corporate address, industry tags, and notifications", badge: "Company Setup", stat: "Configured" },
      "security-center": { desc: "Enforce SSO, two-factor authentication (2FA), and team session security", badge: "Security", stat: "SSO Active" },
      "notification-preferences": { desc: "Configure real-time alerts for applicant submissions, interview changes, and reports", badge: "Alerts", stat: "Customized" },
      "calendar-sync": { desc: "Connect Google Calendar, Microsoft Outlook, or Zoom for seamless scheduling", badge: "Calendars", stat: "Synced" },
      "status-notifications": { desc: "Automated email and portal notifications sent to applicants during stages", badge: "Candidate Comms", stat: "Configured" },
      "company-preview": { desc: "Preview your public employer branding page and job seeker showcase", badge: "Public Showcase", stat: "Live" },
      "branding-score": { desc: "Actionable recommendations to improve your employer brand rating and candidate appeal", badge: "AI Scorecard", stat: "88/100" },
      "benefits-manager": { desc: "Showcase health insurance, perks, flexible hours, and remote work options", badge: "Perks & Benefits", stat: "16 benefits" },
      "team": { desc: "Add team members, assign hiring manager roles, and set access permissions", badge: "Access Control", stat: "14 seats" },
      "integrations": { desc: "Connect your ATS, HRIS (Workday, BambooHR), Slack, and job distribution channels", badge: "Connectors", stat: "6 active" },
      "settings": { desc: "Legacy company preferences, display configurations, and archive settings", badge: "Legacy", stat: "Default" },
    },
    telemetry: [
      { name: "SSO / SAML 2.0 Identity Provider (Okta)", status: "Operational", info: "Enforced" },
      { name: "ATS Webhook Sync (Greenhouse/Lever)", status: "Operational", info: "0 queue lag" },
    ],
    auditTrail: [
      { action: "Added 2 new Hiring Managers to Engineering workspace", user: "HR Admin", time: "3h ago" },
      { action: "Updated company benefits: Added 'Mental Health Allowance'", user: "People Lead", time: "1d ago" },
    ],
  },
};

export function EmployerSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  // Find the section in employer portal config
  const employerConfig = portalConfigs.employer;
  const allItems = employerConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = EMPLOYER_SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and quick access to all modules and configurations in this domain.",
    icon: currentItem?.icon || "LayoutDashboard",
    kpis: [
      { label: "Total Modules", value: `${currentItem?.children?.length || 0} Modules`, icon: "Grid3x3", tone: "brand" },
      { label: "Operational Status", value: "Operational", icon: "CheckCircle2", tone: "success" },
      { label: "Team Sync", value: "100%", icon: "Users", tone: "default" },
      { label: "Platform Health", value: "99.98%", icon: "ShieldCheck", tone: "success" },
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
        title="Available Modules & Controls"
        description="Select any capability below or from the sidebar sub-menu to manage"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => {
            const childMeta = meta.childDescriptions?.[child.key];
            const desc = childMeta?.desc || `Access and manage ${child.label} within your employer portal.`;
            const badge = childMeta?.badge || "Module";
            const stat = childMeta?.stat || "Active";

            return (
              <button
                key={child.key}
                onClick={() => navigate("employer", child.key)}
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
              { name: "Enterprise Gateway Service", status: "Operational", info: "99.98% uptime" },
              { name: "Team Authorization Matrix", status: "Operational", info: "In sync" },
              { name: "Applicant Event Dispatcher", status: "Operational", info: "Real-time" },
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

        <SectionCard title="Recent Activity & Audit Trail" description="Recent administrative and hiring events in this domain">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} updated with latest department parameters`, user: "HR Ops", time: "1h ago" },
              { action: "Team permissions synchronized across entities", user: "Admin", time: "1d ago" },
              { action: "Weekly recruitment summary generated", user: "Automated System", time: "3d ago" },
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

