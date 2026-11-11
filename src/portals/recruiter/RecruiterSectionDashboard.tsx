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

const RECRUITER_SECTION_METADATA: Record<string, SectionMeta> = {
  "overview-grp": {
    title: "Analytics & Sourcing Intelligence",
    desc: "High-level recruiter performance metrics, communications velocity, custom reports, and talent forecasts.",
    icon: "Gauge",
    kpis: [
      { label: "Placements This Quarter", value: "28 Placements", icon: "Award", tone: "brand" },
      { label: "Submission-to-Interview", value: "64.2%", icon: "TrendingUp", tone: "success" },
      { label: "Candidate Touchpoints", value: "840 Activities", icon: "History", tone: "default" },
      { label: "Recruiter Quality Score", value: "96 / 100", icon: "Sparkles", tone: "success" },
    ],
    childDescriptions: {
      "analytics": { desc: "Recruiter performance KPIs, submission ratios, interview success rates, and fee trends", badge: "Performance", stat: "28 placements" },
      "activity": { desc: "Unified chronological log of candidate emails, phone calls, and interview updates", badge: "Timeline", stat: "840 actions" },
      "report-builder": { desc: "Custom reporting engine with PDF and Excel export for client hiring metrics", badge: "Reports", stat: "Custom BI" },
      "talent-forecast": { desc: "Predictive forecasting for upcoming industry hiring demand and in-demand skills", badge: "AI Forecast", stat: "Q4 trends" },
      "recruiting-ai": { desc: "AI assistant for resume screening, interview summaries, and market rate insights", badge: "AI Engine", stat: "Real-time" },
      "audit-logs": { desc: "Audit trail of candidate profile updates, rate negotiations, and disclosures", badge: "Audit", stat: "Compliant" },
    },
    telemetry: [
      { name: "Analytics Ingestion Pipeline", status: "Operational", info: "Sub-second sync" },
      { name: "Recruiting AI Copilot", status: "Operational", info: "Active & ready" },
      { name: "Activity Stream Aggregator", status: "Operational", info: "Live stream" },
    ],
    auditTrail: [
      { action: "Quarterly Placement & Revenue Report exported to PDF", user: "You", time: "1h ago" },
      { action: "AI talent forecast identified 40% surge in Golang requirements", user: "AI Engine", time: "3h ago" },
    ],
  },

  "clients-grp": {
    title: "Clients & Business Development",
    desc: "Manage corporate client accounts, hiring requisitions, client development pipelines, and business marketing.",
    icon: "Building2",
    kpis: [
      { label: "Active Corporate Clients", value: "42 Accounts", icon: "Building2", tone: "brand" },
      { label: "Open Requisitions", value: "64 Mandates", icon: "Briefcase", tone: "warning" },
      { label: "BD Pipeline Value", value: "₹84.0 L", icon: "Target", tone: "success" },
      { label: "Client Retention", value: "92%", icon: "Handshake", tone: "default" },
    ],
    childDescriptions: {
      "client-accounts": { desc: "Master directory of corporate hiring accounts, terms, and primary hiring contacts", badge: "Accounts", stat: "42 clients" },
      "clients": { desc: "Company culture, preferred technologies, signed MSAs, and fee agreements", badge: "Directory", stat: "All verified" },
      "client-dev": { desc: "Outreach pipeline to acquire new hiring mandates and signed enterprise contracts", badge: "Pipeline", stat: "12 deals" },
      "marketing": { desc: "Agency capability presentations, candidate case studies, and recruitment one-pagers", badge: "Collateral", stat: "8 assets" },
      "requisitions": { desc: "Client-approved job orders with designated CTC brackets and target join dates", badge: "Mandates", stat: "64 open" },
      "ag-clients": { desc: "Enterprise accounts managed under dedicated exclusive staffing contracts", badge: "Exclusive", stat: "16 enterprise" },
    },
    telemetry: [
      { name: "Client CRM Synchronization", status: "Operational", info: "42 accounts linked" },
      { name: "Enterprise Requisition Bridge", status: "Operational", info: "Real-time intake" },
    ],
    auditTrail: [
      { action: "New client 'Razorpay' signed exclusive staffing agreement for FinTech unit", user: "Agency Lead", time: "2h ago" },
      { action: "Requisition #REQ-4421 approved by Hiring Manager at Infosys", user: "Client Lead", time: "1d ago" },
    ],
  },

  "jobs-grp": {
    title: "Jobs & Recruitment Pipeline",
    desc: "Track active job orders, candidate submission flows, pipeline boards, and interview schedules.",
    icon: "Briefcase",
    kpis: [
      { label: "Active Job Orders", value: "34 Orders", icon: "ClipboardList", tone: "brand" },
      { label: "Candidates in Flow", value: "186 Candidates", icon: "Users", tone: "default" },
      { label: "Interviews This Week", value: "38 Sessions", icon: "Calendar", tone: "warning" },
      { label: "Pending Submissions", value: "14 Profiles", icon: "Send", tone: "success" },
    ],
    childDescriptions: {
      "job-orders": { desc: "Priority client hiring mandates with required skillsets, CTC, and deadlines", badge: "Orders", stat: "34 active" },
      "openings": { desc: "Headcount targets, urgent requirements, and department-level vacancy tracker", badge: "Headcount", stat: "82 positions" },
      "pipeline": { desc: "Drag-and-drop Kanban pipeline tracking candidates across screening and rounds", badge: "Kanban", stat: "186 candidates" },
      "submissions": { desc: "Candidate profiles presented to client hiring managers with rate cards", badge: "Submissions", stat: "14 in review" },
      "submission-tracker": { desc: "Monitor client review turnaround times, candidate accepts, and rejections", badge: "Tracking", stat: "Real-time" },
      "interview-pipeline": { desc: "Multi-round interview coordination, stage transitions, and feedback logs", badge: "Interviews", stat: "38 this week" },
      "scheduling": { desc: "Automated calendar invitations, room links, and candidate availability matrix", badge: "Calendar", stat: "Synced" },
    },
    telemetry: [
      { name: "Candidate Submission Gateway", status: "Operational", info: "0 queue delay" },
      { name: "Interview Video Bridge", status: "Operational", info: "WebRTC connected" },
    ],
    auditTrail: [
      { action: "Candidate Vikram Patel submitted to Google for Staff Engineer opening", user: "You", time: "25m ago" },
      { action: "Client accepted 3 candidate submissions for Flipkart Tech Lead role", user: "Client Portal", time: "3h ago" },
    ],
  },

  "sourcing-grp": {
    title: "Talent & Sourcing Hub",
    desc: "Candidate databases, AI match scoring, boolean search, talent pools, resume parsing, and partner network.",
    icon: "Search",
    kpis: [
      { label: "Searchable Candidates", value: "42,000 Profiles", icon: "Users", tone: "brand" },
      { label: "AI Match Precision", value: "95.4%", icon: "Sparkles", tone: "success" },
      { label: "Hotlist Bench", value: "32 Immediate", icon: "Flame", tone: "warning" },
      { label: "Deduplication Rate", value: "99.8%", icon: "Copy", tone: "success" },
    ],
    childDescriptions: {
      "h2t": { desc: "Candidates hired directly and upskilled through custom Hire-to-Train programs", badge: "H2T Talent", stat: "38 candidates" },
      "t2h": { desc: "Verified graduate trainees from specialized Train-to-Hire bootcamps ready for client placement", badge: "T2H Talent", stat: "64 graduates" },
      "candidates": { desc: "Master searchable talent repository with experience, location, and CTC filters", badge: "Talent Bank", stat: "42k candidates" },
      "ai-match-scoring": { desc: "Algorithmic relevance scoring matching candidates to open job orders", badge: "AI Matching", stat: "95.4% precision" },
      "talent-pool": { desc: "Curated talent benches segmented by tech stack, seniority, and availability", badge: "Pools", stat: "18 pools" },
      "hotlists": { desc: "Immediate available candidates serving notice periods ready for placement", badge: "Immediate", stat: "32 candidates" },
      "dedup-center": { desc: "Merge duplicate candidate records across resume sources and agencies", badge: "Dedup Engine", stat: "99.8% accurate" },
      "boolean-search": { desc: "Advanced search engine supporting complex AND/OR/NOT search queries", badge: "Boolean", stat: "Instant query" },
      "resume-parser": { desc: "Automated extraction of skills, education, and tenure from PDF/Word resumes", badge: "NLP Parser", stat: "100% parsed" },
      "network-sourcing": { desc: "AI-powered discovery of passive candidates across GitHub, LinkedIn, and social", badge: "Passive Sourcing", stat: "AI Discovery" },
      "referrals": { desc: "Candidate referral network tracking referral fees and peer recommendations", badge: "Referrals", stat: "18 active" },
      "sourcing-campaigns": { desc: "Outbound talent reach-out campaigns with email and WhatsApp drip steps", badge: "Campaigns", stat: "6 live" },
      "partner-candidates": { desc: "Pre-trained student candidates graduating from accredited partner academies", badge: "Academies", stat: "140 graduates" },
      "t2h-candidates": { desc: "Verified graduate trainees from specialized bootcamps ready for client placement", badge: "T2H Talent", stat: "64 graduates" },
      "partner-network": { desc: "Cooperative recruitment network for sharing candidate benches and splits", badge: "Network", stat: "24 agencies" },
    },
    telemetry: [
      { name: "Resume Parser Worker Cluster", status: "Operational", info: "Idle (queue: 0)" },
      { name: "Vector Talent Search Index", status: "Operational", info: "42k profiles indexed" },
    ],
    auditTrail: [
      { action: "Imported batch of 18 React 19 senior candidates from Network Sourcing", user: "You", time: "1h ago" },
      { action: "Merged 3 duplicate profiles via Dedup Center", user: "Auto Dedup", time: "4h ago" },
    ],
  },

  "hiring-grp": {
    title: "Hiring & Operations",
    desc: "Candidate offers, digital e-signatures, technical assessments, placement verification, and guarantee tracking.",
    icon: "ClipboardCheck",
    kpis: [
      { label: "Active Offers", value: "12 Extended", icon: "Gift", tone: "brand" },
      { label: "Placements This Year", value: "74 Placed", icon: "Handshake", tone: "success" },
      { label: "Guarantee Tracked", value: "18 Hires", icon: "ShieldCheck", tone: "default" },
      { label: "Offer Acceptance", value: "88.6%", icon: "BadgeCheck", tone: "success" },
    ],
    childDescriptions: {
      "offers": { desc: "Extended candidate compensation packages, CTC breakdowns, and status", badge: "Job Offers", stat: "12 active" },
      "offer-esign": { desc: "Legally binding digital signatures via Aadhaar or DocuSign integration", badge: "E-Sign", stat: "92% signed" },
      "assessments": { desc: "Online coding tests, cognitive screening, and technical scorecards", badge: "Skill Tests", stat: "24 completed" },
      "feedback": { desc: "Consolidated client interviewer ratings, notes, and hire/no-hire votes", badge: "Feedback", stat: "All logged" },
      "placements": { desc: "Confirmed candidate start dates, billing initiation, and joining notices", badge: "Placements", stat: "74 YTD" },
      "placement-verification": { desc: "Official employer joining confirmation and employee ID verification", badge: "Verification", stat: "100% verified" },
      "guarantees": { desc: "90-day replacement warranty timers and candidate retention records", badge: "Guarantees", stat: "18 covered" },
      "onboarding": { desc: "Pre-joining engagement tracking, document verification, and Day-1 check-ins", badge: "Onboarding", stat: "8 in progress" },
    },
    telemetry: [
      { name: "Digital Signature Gateway", status: "Operational", info: "DocuSign / Aadhaar" },
      { name: "Placement Billing Webhook", status: "Operational", info: "Connected" },
    ],
    auditTrail: [
      { action: "Candidate Rajesh Sharma accepted offer at Swiggy (₹32L CTC)", user: "Candidate", time: "2h ago" },
      { action: "Placement verification confirmed by HR at Amazon India", user: "Verification", time: "1d ago" },
    ],
  },

  "finance-grp": {
    title: "Finance & Commission Settlements",
    desc: "Agency wallet, multi-currency revenue, partner disbursements, commission splits, and GST invoices.",
    icon: "Wallet",
    kpis: [
      { label: "Recruiter Balance", value: "₹6,84,000", icon: "Wallet", tone: "success" },
      { label: "Net Commissions", value: "₹18.4 L YTD", icon: "Receipt", tone: "brand" },
      { label: "Pending Payouts", value: "₹1,20,000", icon: "ArrowDownToLine", tone: "warning" },
      { label: "Billing Invoices", value: "24 Settled", icon: "FileText", tone: "default" },
    ],
    childDescriptions: {
      "wallet": { desc: "Real-time earnings ledger, recruitment fee balances, and withdrawals", badge: "Wallet", stat: "₹6.84L balance" },
      "multi-currency-wallet": { desc: "Manage international client earnings in USD, EUR, and GBP", badge: "Multi-Currency", stat: "$14.2k USD" },
      "payouts": { desc: "Direct bank disbursements via IMPS/NEFT with automated receipt generation", badge: "Payouts", stat: "Instant payout" },
      "settlements": { desc: "Split settlements between recruitment teams, sourcing partners, and trainers", badge: "Settlements", stat: "All cleared" },
      "commissions": { desc: "Individual recruiter commission tracking and tier bonus calculations", badge: "Commissions", stat: "Tier 1 bonus" },
      "invoices": { desc: "Generate and dispatch GST-compliant client recruitment fee invoices", badge: "Invoicing", stat: "24 invoices" },
      "gst-invoice-generator": { desc: "Automated tax invoice builder with SAC codes and HSN breakdowns", badge: "GST Builder", stat: "GSTR-1 ready" },
      "billing-milestones": { desc: "Placement milestone triggers (joining day, 30 days, 90 days)", badge: "Milestones", stat: "6 tracking" },
      "earnings-forecast": { desc: "Projected monthly commission earnings based on active offers", badge: "Forecast", stat: "₹4.8L est." },
      "client-payment-aging": { desc: "Track overdue client receivables with 30/60/90-day aging buckets", badge: "Aging", stat: "0 overdue" },
      "timesheets": { desc: "Contract staffing hour approvals, overtime tracking, and hourly billing", badge: "Timesheets", stat: "18 active" },
      "candidate-compliance": { desc: "Verify statutory tax compliance, PAN, and banking documents", badge: "Compliance", stat: "100% verified" },
    },
    telemetry: [
      { name: "Bank Payout Gateway (IMPS/NEFT)", status: "Operational", info: "Instant clearing" },
      { name: "GST E-Invoice Generator", status: "Operational", info: "NIC connected" },
    ],
    auditTrail: [
      { action: "Placement commission ₹1,40,000 credited to wallet for Senior DevOps hire", user: "Billing", time: "4h ago" },
      { action: "Payout request of ₹2,50,000 processed to HDFC bank account", user: "Finance Lead", time: "1d ago" },
    ],
  },

  "comms-grp": {
    title: "Comms & Outreach Hub",
    desc: "Unified candidate inbox, WhatsApp messaging, automated drip sequences, VoIP call logs, and support.",
    icon: "Mail",
    kpis: [
      { label: "Messages Delivered", value: "3,400 / mo", icon: "Mail", tone: "brand" },
      { label: "WhatsApp Read Rate", value: "98.2%", icon: "MessageCircle", tone: "success" },
      { label: "Avg Response Time", value: "< 12 Mins", icon: "Clock", tone: "success" },
      { label: "Sequences Active", value: "6 Campaigns", icon: "Workflow", tone: "default" },
    ],
    childDescriptions: {
      "inbox": { desc: "Unified messaging channel for SMS, email, and portal chats with candidates", badge: "Inbox", stat: "2 unread" },
      "whatsapp": { desc: "Official WhatsApp Business Cloud API messages and interview updates", badge: "WhatsApp Cloud", stat: "98% read rate" },
      "sequences": { desc: "Automated multi-touch candidate sourcing and follow-up drip sequences", badge: "Drip Campaigns", stat: "6 active" },
      "email-templates": { desc: "Pre-built recruiter email templates for outreach, screening, and offers", badge: "Templates", stat: "24 templates" },
      "rejection-automation": { desc: "Polite, empathetic automated candidate rejection emails", badge: "Automation", stat: "Empathy filter" },
      "sms-inbox": { desc: "Transactional SMS alerts and OTP verification communications", badge: "SMS", stat: "DLT approved" },
      "auto-reminders": { desc: "Scheduled interview alerts and candidate confirmation nudges", badge: "Reminders", stat: "Automated" },
      "follow-up-automation": { desc: "Automated client follow-ups for feedback on submitted candidates", badge: "Follow-ups", stat: "12 active" },
      "voip-logging": { desc: "Integrated click-to-call phone dialing, call recording, and call notes", badge: "VoIP Phone", stat: "Call logger" },
      "messages": { desc: "Internal team communications and recruiter collaboration threads", badge: "Team Chat", stat: "Synced" },
      "support": { desc: "Direct ticket channel to Jobsonn agency operations support team", badge: "Support", stat: "24/7 priority" },
    },
    telemetry: [
      { name: "WhatsApp Business API Cloud", status: "Operational", info: "High throughput" },
      { name: "Twilio VoIP Calling Trunk", status: "Operational", info: "Low latency" },
    ],
    auditTrail: [
      { action: "WhatsApp reminder dispatched to 8 candidates scheduled for tomorrow", user: "Auto Bot", time: "1h ago" },
      { action: "Sourcing sequence 'FullStack Senior 2026' achieved 38% response rate", user: "Outreach Bot", time: "1d ago" },
    ],
  },

  "agency-grp": {
    title: "Agency & Team Administration",
    desc: "Agency public profile, recruiter assignments, commission reconciliation, and agency branding.",
    icon: "Settings",
    kpis: [
      { label: "Agency Recruiters", value: "12 Team", icon: "Users", tone: "brand" },
      { label: "Public Agency Rating", value: "4.8 / 5", icon: "Star", tone: "success" },
      { label: "Monthly Mandates", value: "24 Open", icon: "Briefcase", tone: "default" },
      { label: "Revenue Share Model", value: "80 / 20 Split", icon: "Percent", tone: "default" },
    ],
    childDescriptions: {
      "recruiters": { desc: "Agency recruiter accounts, permission tiers, and workload capacity", badge: "Team", stat: "12 members" },
      "recruiter-profile-public": { desc: "Verified public consultant profile showcasing verified placements", badge: "Public Profile", stat: "Verified" },
      "agency-branding": { desc: "Custom logo, agency bio, client testimonials, and industry badges", badge: "Branding", stat: "Custom theme" },
      "ag-overview": { desc: "Master dashboard aggregating all recruiter KPIs and agency revenue", badge: "Agency HQ", stat: "Full overview" },
      "ag-profile": { desc: "Company registration, GSTIN, legal address, and authorized signatories", badge: "Legal Profile", stat: "Verified" },
      "ag-recruiters": { desc: "Consultant performance rankings, conversion ratios, and targets", badge: "Leaderboard", stat: "Rankings" },
      "ag-commissions": { desc: "Internal agency commission distributions and consultant payouts", badge: "Splits", stat: "Automated" },
      "ag-settings": { desc: "Agency-wide defaults, currency preferences, and notification rules", badge: "Settings", stat: "Configured" },
    },
    telemetry: [
      { name: "Agency Roster Synchronization", status: "Operational", info: "12 seats active" },
      { name: "Public Agency Showcase CDN", status: "Operational", info: "Cache verified" },
    ],
    auditTrail: [
      { action: "Added new Associate Consultant to FinTech sourcing desk", user: "Agency Partner", time: "2h ago" },
      { action: "Monthly consultant commission reconciliation signed off", user: "Finance Lead", time: "3d ago" },
    ],
  },

  "support-grp": {
    title: "Help & Support Center",
    desc: "Recruiter knowledge base, dedicated agency account support, and historical tickets.",
    icon: "HelpCircle",
    kpis: [
      { label: "Dedicated Agency Mgr", value: "Rajesh Kumar", icon: "UserCheck", tone: "brand" },
      { label: "Ticket SLA", value: "< 20 Mins", icon: "Clock", tone: "success" },
      { label: "Open Inquiries", value: "0 Pending", icon: "CheckCircle2", tone: "success" },
      { label: "Help Guides", value: "120+ Articles", icon: "BookOpen", tone: "default" },
    ],
    childDescriptions: {
      "support-hub": { desc: "Agency guides, client contract templates, and live support chat", badge: "Help Center", stat: "24/7 priority" },
      "inbox": { desc: "Access active communication inbox for candidate and client questions", badge: "Inbox", stat: "Direct access" },
      "support": { desc: "Historical support tickets, compliance inquiries, and resolutions", badge: "Archive", stat: "All closed" },
    },
    telemetry: [
      { name: "Priority Support Trunk", status: "Operational", info: "Instant routing" },
      { name: "Knowledge Search Vector DB", status: "Operational", info: "120+ guides" },
    ],
    auditTrail: [
      { action: "Compliance ticket resolved (International client tax forms)", user: "Support Team", time: "2d ago" },
    ],
  },

  "settings-grp": {
    title: "Recruiter Settings & Preferences",
    desc: "Manage consultant security, notification triggers, calendar integrations, and portal settings.",
    icon: "Settings",
    kpis: [
      { label: "Account Security", value: "High (2FA Enforced)", icon: "ShieldCheck", tone: "success" },
      { label: "Calendar Connected", value: "Google & Outlook", icon: "CalendarCheck", tone: "success" },
      { label: "Dispatch Rules", value: "Real-time", icon: "Bell", tone: "default" },
      { label: "Consultant Tier", value: "Senior Partner", icon: "Award", tone: "brand" },
    ],
    childDescriptions: {
      "settings-hub": { desc: "Consultant profile settings, default timezones, and signature lines", badge: "Settings", stat: "Configured" },
      "security-center": { desc: "Password management, two-factor authentication, and active sessions", badge: "Security", stat: "2FA active" },
      "notification-preferences": { desc: "Configure alerts for client interview feedback and new submissions", badge: "Alerts", stat: "Customized" },
      "recruiters": { desc: "Manage consultant roster and delegated hiring roles across desks", badge: "Team", stat: "12 seats" },
      "settings": { desc: "Legacy account parameters, display options, and archive options", badge: "Legacy", stat: "Default" },
    },
    telemetry: [
      { name: "2FA Authentication Token", status: "Operational", info: "Hardware MFA" },
      { name: "Calendar Availability Engine", status: "Operational", info: "Live sync" },
    ],
    auditTrail: [
      { action: "Updated email signature with verified Jobsonn Agency Partner badge", user: "You", time: "4h ago" },
      { action: "Connected Google Calendar for automated candidate interview booking", user: "You", time: "2d ago" },
    ],
  },
};

export function RecruiterSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  // Find the section in recruiter portal config
  const recruiterConfig = portalConfigs.recruiter;
  const allItems = recruiterConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = RECRUITER_SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and quick access to all modules and configurations in this domain.",
    icon: currentItem?.icon || "LayoutDashboard",
    kpis: [
      { label: "Total Modules", value: `${currentItem?.children?.length || 0} Modules`, icon: "Grid3x3", tone: "brand" },
      { label: "Operational Status", value: "Operational", icon: "CheckCircle2", tone: "success" },
      { label: "Recruiter Sync", value: "100%", icon: "Users", tone: "default" },
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
            const desc = childMeta?.desc || `Access and manage ${child.label} within your recruiter portal.`;
            const badge = childMeta?.badge || "Module";
            const stat = childMeta?.stat || "Active";

            return (
              <button
                key={child.key}
                onClick={() => navigate("recruiter", child.key)}
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
              { name: "Recruiter Gateway Service", status: "Operational", info: "99.98% uptime" },
              { name: "Candidate Pipeline Bus", status: "Operational", info: "In sync" },
              { name: "Commissions Settlement Engine", status: "Operational", info: "Automated" },
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

        <SectionCard title="Recent Activity & Audit Trail" description="Recent sourcing, placements, and commission actions">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} updated with latest pipeline metrics`, user: "Recruiter", time: "1h ago" },
              { action: "Client feedback received on active submissions", user: "Client System", time: "1d ago" },
              { action: "Weekly recruitment analytics generated", user: "Automated System", time: "3d ago" },
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

