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

const PARTNER_SECTION_METADATA: Record<string, SectionMeta> = {
  "overview-grp": {
    title: "Analytics, Scorecards & Reporting",
    desc: "Comprehensive partner franchise KPIs, revenue velocity, placement conversion metrics, announcements, and audit trail.",
    icon: "Gauge",
    kpis: [
      { label: "Annual Revenue", value: "₹42.8 L", icon: "TrendingUp", tone: "brand" },
      { label: "Partner Scorecard", value: "98.4 / 100", icon: "Trophy", tone: "success" },
      { label: "Placed Students", value: "248 Placed", icon: "BadgeCheck", tone: "success" },
      { label: "Partner Campuses", value: "18 Colleges", icon: "Building2", tone: "default" },
    ],
    childDescriptions: {
      "analytics": { desc: "Unified analytics dashboard tracking student intake, revenue streams, and completion ratios", badge: "Analytics Hub", stat: "Live BI" },
      "partner-scorecard": { desc: "Evaluation scorecard grading partner against regional benchmarks and placement standards", badge: "Scorecard", stat: "Top Tier (A+)" },
      "reports": { desc: "Downloadable PDF and Excel reports for campus tie-ups, training batches, and revenue splits", badge: "Reporting", stat: "Custom exports" },
      "revenue": { desc: "Monthly revenue charts, commission trajectories, and projected franchise earnings", badge: "Revenue", stat: "₹42.8 L total" },
      "announcements": { desc: "Important notices, policy revisions, academic drive schedules, and platform releases", badge: "Broadcasts", stat: "3 active" },
      "audit-logs": { desc: "Chronological log of MoU signatures, fee updates, batch certifications, and disputes", badge: "Audit Trail", stat: "Compliant" },
    },
    telemetry: [
      { name: "Revenue Analytics Pipe", status: "Operational", info: "Sub-second sync" },
      { name: "Partner Scorecard Evaluator", status: "Operational", info: "Weekly benchmark" },
      { name: "Announcement Broadcaster", status: "Operational", info: "Active" },
    ],
    auditTrail: [
      { action: "Q3 Partner Performance Scorecard generated with Grade A+", user: "Partner Ops", time: "2h ago" },
      { action: "Monthly revenue report exported for college accreditation board", user: "Partner Lead", time: "5h ago" },
      { action: "New announcement published regarding upcoming campus placement drives", user: "Operations", time: "1d ago" },
    ],
  },

  "deals-grp": {
    title: "Deals, CRM & Student Pipeline",
    desc: "Enterprise training deals, prospective student leads, corporate client accounts, and admission applications.",
    icon: "Briefcase",
    kpis: [
      { label: "Deals Pipeline", value: "₹64.5 L", icon: "Briefcase", tone: "brand" },
      { label: "Active Student Leads", value: "480 Leads", icon: "Users", tone: "default" },
      { label: "Enterprise Clients", value: "24 Accounts", icon: "Handshake", tone: "success" },
      { label: "Pending Applications", value: "36 Reviews", icon: "FileText", tone: "warning" },
    ],
    childDescriptions: {
      "deals": { desc: "Active deal pipeline tracking proposal stages, contract valuations, and closing probabilities", badge: "Pipeline", stat: "12 active deals" },
      "leads": { desc: "Lead CRM for student prospects, corporate upskilling inquiries, and campus tie-up leads", badge: "CRM", stat: "480 leads" },
      "my-clients": { desc: "Directory of enterprise corporate accounts hiring from your partner network", badge: "Accounts", stat: "24 clients" },
      "students": { desc: "Roster of enrolled students across partner colleges, attendance status, and course tracks", badge: "Students", stat: "1,240 active" },
      "marketing": { desc: "Collateral distributor, lead capture landing page generators, and campaign trackers", badge: "Marketing Hub", stat: "8 assets" },
      "applications": { desc: "Student and college intake applications awaiting screening and approval", badge: "Applications", stat: "6 pending" },
    },
    telemetry: [
      { name: "Deals CRM Synchronization", status: "Operational", info: "Real-time" },
      { name: "Lead Ingestion Webhook", status: "Operational", info: "99.9% uptime" },
      { name: "Application Screening Engine", status: "Operational", info: "Automated" },
    ],
    auditTrail: [
      { action: "Deal stage updated to 'Contract Signed' for Tech Mahindra Training", user: "BD Lead", time: "3h ago" },
      { action: "36 New candidate applications screened from Hyderabad zone", user: "Admissions", time: "6h ago" },
    ],
  },

  "partnership-grp": {
    title: "Partnership, MoUs & College Networks",
    desc: "Franchise partner profile, affiliated college directory, MoU contracts, onboarding wizards, and renewal forecasts.",
    icon: "Handshake",
    kpis: [
      { label: "Affiliated Colleges", value: "18 Campuses", icon: "Building2", tone: "brand" },
      { label: "Signed MoUs", value: "22 Contracts", icon: "FileText", tone: "success" },
      { label: "Onboarding Progress", value: "100% Complete", icon: "Rocket", tone: "success" },
      { label: "Upcoming Renewals", value: "3 MoUs", icon: "CalendarClock", tone: "warning" },
    ],
    childDescriptions: {
      "profile": { desc: "Partner organization overview, statutory licenses, and primary point of contact", badge: "Profile", stat: "Verified" },
      "partner-profile-enhanced": { desc: "Rich media partner storefront showcasing training facilities, team, and success stories", badge: "Storefront", stat: "Publicly visible" },
      "college-profiles": { desc: "Campus infrastructure, department head contacts, and student demographics", badge: "Directory", stat: "18 colleges" },
      "college-applications": { desc: "New academic institutions applying for campus incubation and partner programs", badge: "Intake", stat: "4 incoming" },
      "colleges": { desc: "Master list of managed collegiate campuses with active student cohorts", badge: "Network", stat: "18 campuses" },
      "college-workspace": { desc: "Collaborative portal for college placement officers and training coordinators", badge: "Workspace", stat: "Active" },
      "models": { desc: "Franchise business models: Revenue Share, Capitation, Build-Operate-Transfer (BOT)", badge: "Commercials", stat: "3 models" },
      "mou-agreements": { desc: "Repository of legally binding institutional Memorandums of Understanding", badge: "Contracts", stat: "22 signed" },
      "partner-onboarding": { desc: "Step-by-step onboarding walkthrough for new campus centers and regional hubs", badge: "Wizard", stat: "Automated" },
      "renewals": { desc: "Expiring MoU tracking, renegotiation timelines, and extension clauses", badge: "Lifecycle", stat: "3 pending" },
      "renewal-forecast": { desc: "AI-projected multi-year partnership revenue retention and college renewal probability", badge: "Forecasting", stat: "94% retention" },
    },
    telemetry: [
      { name: "Digital Signature & E-Sign Bus", status: "Operational", info: "Legally compliant" },
      { name: "College Data Sync Service", status: "Operational", info: "In sync" },
      { name: "Renewal Risk Predictor", status: "Operational", info: "Low churn" },
    ],
    auditTrail: [
      { action: "MoU renewed for 3 years with Sri Venkateswara College of Engineering", user: "Director", time: "1h ago" },
      { action: "College onboarding wizard completed for St. Joseph's Institute", user: "Onboarding Lead", time: "1d ago" },
    ],
  },

  "academics-grp": {
    title: "Academics, Training Delivery & Batches",
    desc: "Academic programs, campus training centres, scheduled batches, faculty allocations, and placement drives.",
    icon: "GraduationCap",
    kpis: [
      { label: "Active Programs", value: "16 Curricula", icon: "BookOpen", tone: "brand" },
      { label: "Training Centres", value: "6 Centres", icon: "Building2", tone: "default" },
      { label: "Running Batches", value: "32 Batches", icon: "CalendarCheck2", tone: "success" },
      { label: "Placement Drives", value: "8 Scheduled", icon: "Calendar", tone: "success" },
    ],
    childDescriptions: {
      "programs": { desc: "Industry-aligned academic curricula, credit hours, and certification requirements", badge: "Programs", stat: "16 programs" },
      "centres": { desc: "Physical partner training hubs, computer lab specs, and smart classroom setups", badge: "Facilities", stat: "6 centres" },
      "batches": { desc: "Current and upcoming classroom batches, schedules, and student enrollment rosters", badge: "Batches", stat: "32 active" },
      "faculty": { desc: "Assigned trainers, visiting guest faculty, credentials, and performance scores", badge: "Faculty", stat: "28 trainers" },
      "training-delivery": { desc: "Syllabus tracking, live classroom status, lesson plan milestones, and attendance", badge: "Delivery", stat: "On schedule" },
      "events-drives": { desc: "Mega campus placement drives, hackathons, and corporate interview days", badge: "Events", stat: "8 upcoming" },
    },
    telemetry: [
      { name: "Curriculum Milestone Engine", status: "Operational", info: "94% on track" },
      { name: "Classroom Attendance Tracker", status: "Operational", info: "Live telemetry" },
      { name: "Faculty Evaluation Service", status: "Operational", info: "Active" },
    ],
    auditTrail: [
      { action: "Java Full Stack Batch #14 completed Module 3 evaluation", user: "Faculty Lead", time: "2h ago" },
      { action: "Mega campus placement drive scheduled with 12 enterprise employers", user: "Placement Head", time: "4h ago" },
    ],
  },

  "careers-grp": {
    title: "Careers, Placements & Outcomes",
    desc: "Internship assignments, live client projects, recruitment job orders, verified placements, and certificates.",
    icon: "TrendingUp",
    kpis: [
      { label: "Active Internships", value: "340 Interns", icon: "Briefcase", tone: "brand" },
      { label: "Industry Projects", value: "18 Projects", icon: "FolderGit2", tone: "default" },
      { label: "Verified Placements", value: "248 Placed", icon: "BadgeCheck", tone: "success" },
      { label: "Certificates Issued", value: "1,120 Issued", icon: "Award", tone: "success" },
    ],
    childDescriptions: {
      "internships": { desc: "Corporate internship allocations, stipend disbursement, and supervisor evaluations", badge: "Internships", stat: "340 interns" },
      "projects": { desc: "Industry capstone projects, client problem statements, and GitHub code repositories", badge: "Projects", stat: "18 live" },
      "job-orders": { desc: "Hiring mandates allocated by employer partners exclusively to your partner network", badge: "Mandates", stat: "5 open" },
      "placements": { desc: "Confirmed job placement records, offer letters, starting CTCs, and joining dates", badge: "Placements", stat: "248 placed" },
      "compliance": { desc: "AICTE / UGC and university accreditation compliance tracking and documentation", badge: "Compliance", stat: "Audited" },
      "certificates": { desc: "Issue and verify tamper-proof digitally signed completion certificates", badge: "Credentials", stat: "1,120 issued" },
    },
    telemetry: [
      { name: "Placement Verification System", status: "Operational", info: "100% verified" },
      { name: "Certificate Blockchain Registry", status: "Operational", info: "Tamper-proof" },
      { name: "Internship Attendance Monitor", status: "Operational", info: "Automated" },
    ],
    auditTrail: [
      { action: "Placement verification finalized for 14 students joining Wipro", user: "Verification Team", time: "1h ago" },
      { action: "84 Digital completion certificates issued for Spring Batch", user: "System", time: "5h ago" },
    ],
  },

  "finance-grp": {
    title: "Finance, Settlements & Wallet",
    desc: "Commission wallet, automated settlements, revenue split simulator, fee collection ledger, and tax filings.",
    icon: "Wallet",
    kpis: [
      { label: "Wallet Balance", value: "₹8.40 L", icon: "Wallet", tone: "brand" },
      { label: "Settled This Month", value: "₹16.5 L", icon: "Coins", tone: "success" },
      { label: "Commissions Earned", value: "₹32.4 L", icon: "Percent", tone: "success" },
      { label: "TDS Deductions", value: "₹1.62 L", icon: "Landmark", tone: "default" },
    ],
    childDescriptions: {
      "wallet": { desc: "Central payout wallet, real-time balance, instant bank withdrawal, and transfer history", badge: "Wallet", stat: "₹8.40 L available" },
      "settlements": { desc: "T+1 automated settlement ledger with batch disbursement breakdowns", badge: "Settlements", stat: "Automated" },
      "split-simulator": { desc: "Interactive modeling tool to calculate partner margins across different fee splits", badge: "Simulator", stat: "Interactive" },
      "settlement-disputes": { desc: "Dispute resolution workspace for commission recalculations and adjustments", badge: "Disputes", stat: "0 active" },
      "transactions": { desc: "Granular transaction ledger of all student fee payments, credits, and debits", badge: "Ledger", stat: "4,800 records" },
      "accounts": { desc: "Institutional bank accounts, settlement preferences, and GSTIN registration", badge: "Banking", stat: "Verified" },
      "tax-rates": { desc: "Applicable GST brackets, TDS rates under Sec 194J/194C, and exemptions", badge: "Taxation", stat: "Standard TDS" },
      "commissions": { desc: "Tiered franchise commission schedules based on enrollment volume and placement success", badge: "Commissions", stat: "Tier 1 (22%)" },
      "tax-documents": { desc: "Downloadable Form 16A TDS certificates, GST tax invoices, and financial summaries", badge: "Compliance", stat: "Q2 available" },
      "fees": { desc: "Fee collection tracking, outstanding student tuition, and auto-debit receipts", badge: "Collections", stat: "96% collected" },
    },
    telemetry: [
      { name: "Automated Settlement Gateway", status: "Operational", info: "T+1 cycle" },
      { name: "Bank Account Escrow Sync", status: "Operational", info: "Direct RTGS" },
      { name: "Tax Deduction Ledger", status: "Operational", info: "Sec 194J compliant" },
    ],
    auditTrail: [
      { action: "Withdrawal of ₹5.0 L processed to registered HDFC corporate account", user: "Finance Officer", time: "3h ago" },
      { action: "Quarterly TDS statement Form 16A generated for download", user: "Tax Engine", time: "1d ago" },
    ],
  },

  "tools-grp": {
    title: "Tools, Service Catalog & Client Messaging",
    desc: "Online software suites, application forms, partner guidelines, service catalog, and direct messaging.",
    icon: "Wrench",
    kpis: [
      { label: "Active Tools", value: "8 Suites", icon: "LayoutTemplate", tone: "brand" },
      { label: "Service Packages", value: "14 Catalog", icon: "Layers", tone: "default" },
      { label: "Marketing Kits", value: "24 Kits", icon: "FolderOpen", tone: "success" },
      { label: "Client Messages", value: "18 Threads", icon: "MessageSquare", tone: "success" },
    ],
    childDescriptions: {
      "online-tools": { desc: "Cloud training suites, coding sandboxes, aptitude testing engines, and LMS tools", badge: "Software", stat: "8 tools" },
      "forms-assistance": { desc: "Standard student intake forms, parent consent templates, and scholarship applications", badge: "Templates", stat: "12 forms" },
      "guidelines": { desc: "Standard operating procedures (SOP), branding standards, and lab requirements", badge: "SOPs", stat: "Comprehensive" },
      "service-catalog": { desc: "Menu of corporate recruitment, training, and assessment packages available for resale", badge: "Catalog", stat: "14 packages" },
      "engagements": { desc: "Kanban board tracking institutional engagements, faculty visits, and client audits", badge: "Engagements", stat: "Kanban board" },
      "marketing-materials": { desc: "Print-ready brochures, digital banners, presentation slide decks, and social collateral", badge: "Collateral", stat: "24 kits" },
      "client-messaging": { desc: "Direct messaging thread with corporate hiring managers and university coordinators", badge: "Messaging", stat: "5 unread" },
    },
    telemetry: [
      { name: "Online Software Cloud Runner", status: "Operational", info: "99.9% uptime" },
      { name: "Forms & Document Repository", status: "Operational", info: "Encrypted" },
      { name: "Client Messaging WebSocket", status: "Operational", info: "Latency 42ms" },
    ],
    auditTrail: [
      { action: "Updated marketing brochure pack deployed for 2026 Admissions", user: "Marketing Team", time: "2h ago" },
      { action: "Online code compilation sandbox upgraded to support Python 3.12", user: "Tech Support", time: "1d ago" },
    ],
  },

  "talent-solutions": {
    title: "Talent Solutions & Enterprise Programs",
    desc: "Enterprise recruitment solutions, Train-to-Hire programs, and commercial talent solution transactions.",
    icon: "GraduationCap",
    kpis: [
      { label: "T2H Candidates", value: "180 Trainees", icon: "GraduationCap", tone: "brand" },
      { label: "Enterprise Mandates", value: "12 Programs", icon: "Target", tone: "default" },
      { label: "Solutions Revenue", value: "₹28.0 L", icon: "Receipt", tone: "success" },
      { label: "Placement Success", value: "95.2%", icon: "Sparkles", tone: "success" },
    ],
    childDescriptions: {
      "ts-hub": { desc: "Talent solutions control center managing train-to-hire candidate batches and client specs", badge: "Solutions Hub", stat: "180 trainees" },
      "ts-transactions": { desc: "Transaction history for enterprise placement fees, bounty payouts, and corporate stipends", badge: "Ledger", stat: "Reconciled" },
    },
    telemetry: [
      { name: "Talent Solutions Match Engine", status: "Operational", info: "Active" },
      { name: "Corporate Mandate Tracking", status: "Operational", info: "Live sync" },
    ],
    auditTrail: [
      { action: "Corporate training mandate received from Capgemini for 40 candidates", user: "Enterprise Lead", time: "4h ago" },
      { action: "T2H transaction fee ₹4.5 L settled to partner account", user: "Finance System", time: "1d ago" },
    ],
  },

  "support-grp": {
    title: "Partner Support & Billing Help",
    desc: "Dedicated partner helpdesk, revenue split inquiries, corporate invoice generation, and ticketing.",
    icon: "HelpCircle",
    kpis: [
      { label: "Open Tickets", value: "2 Tickets", icon: "LifeBuoy", tone: "brand" },
      { label: "Resolution Time", value: "45 Mins", icon: "Clock", tone: "success" },
      { label: "SLA Compliance", value: "99.2%", icon: "ShieldCheck", tone: "success" },
      { label: "Satisfaction Rate", value: "4.9 / 5", icon: "Star", tone: "default" },
    ],
    childDescriptions: {
      "support-hub": { desc: "Priority partner support desk with dedicated relationship manager and live chat", badge: "Help Center", stat: "2 open" },
      "revenue-splits": { desc: "Documentation on payout split formulas, bonus incentives, and dispute protocols", badge: "Formulas", stat: "Transparent" },
      "invoices": { desc: "Automated GST invoicing, receipt downloads, and billing dispute submissions", badge: "Invoices", stat: "All paid" },
      "support": { desc: "Direct ticketing system for urgent operational, technical, or academic support", badge: "Support", stat: "Priority" },
    },
    telemetry: [
      { name: "Partner Priority Dispatch Queue", status: "Operational", info: "Avg wait: 2m" },
      { name: "Billing Invoice Reconciler", status: "Operational", info: "Automated" },
    ],
    auditTrail: [
      { action: "Support ticket #PT-104 resolved: Batch invoice duplicate removed", user: "Support Manager", time: "1h ago" },
      { action: "Monthly partner tax invoice generated with digital DSC signature", user: "Invoicing System", time: "2d ago" },
    ],
  },

  "settings-grp": {
    title: "Settings & Revenue Calculator",
    desc: "Partner center settings, security credentials, notification preferences, and interactive ROI calculator.",
    icon: "Settings",
    kpis: [
      { label: "Security Status", value: "2FA Active", icon: "ShieldCheck", tone: "brand" },
      { label: "Bank Account", value: "Verified", icon: "Building2", tone: "success" },
      { label: "Notification Status", value: "Configured", icon: "Bell", tone: "success" },
      { label: "Profile Status", value: "100% Complete", icon: "SlidersHorizontal", tone: "default" },
    ],
    childDescriptions: {
      "settings-hub": { desc: "Master partner organization settings, regional branch offices, and business profile", badge: "Partner Settings", stat: "Configured" },
      "security-center": { desc: "Two-factor authentication, authorized IP restrictions, and team access credentials", badge: "Security", stat: "Enforced" },
      "notification-preferences": { desc: "SMS and email dispatch alerts for student admissions, payments, and placement offers", badge: "Notifications", stat: "Instant" },
      "settings": { desc: "General partner preferences, default curriculum tracks, and regional holiday calendars", badge: "General", stat: "Synced" },
      "configure-settings": { desc: "Advanced operational parameters, webhook integrations, and API credentials", badge: "Config", stat: "Operational" },
      "calculator": { desc: "Interactive student volume vs. revenue split projection and profit margin calculator", badge: "ROI Calculator", stat: "Dynamic" },
    },
    telemetry: [
      { name: "Partner Security Vault", status: "Operational", info: "Enforced" },
      { name: "Dynamic Calculator Engine", status: "Operational", info: "Real-time" },
    ],
    auditTrail: [
      { action: "2FA security credentials re-authenticated for partner administration", user: "Security", time: "1h ago" },
      { action: "Notification dispatch preference updated for WhatsApp placement alerts", user: "Admin", time: "1d ago" },
    ],
  },
};

export function PartnerSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  const partnerConfig = portalConfigs.partner;
  const allItems = partnerConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = PARTNER_SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and access to all capabilities and operations in this domain.",
    icon: currentItem?.icon || "Handshake",
    kpis: [
      { label: "Active Modules", value: `${currentItem?.children?.length || 0} Modules`, icon: "Grid3x3", tone: "brand" },
      { label: "Operational Status", value: "Operational", icon: "CheckCircle2", tone: "success" },
      { label: "Franchise Health", value: "99.98%", icon: "ShieldCheck", tone: "success" },
      { label: "Data Sync", value: "Live", icon: "Activity", tone: "default" },
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
                onClick={() => navigate("partner", child.key)}
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
              { name: "Franchise Management Gateway", status: "Operational", info: "99.98% uptime" },
              { name: "Academic Delivery Bus", status: "Operational", info: "In sync" },
              { name: "Financial Settlement Reconciler", status: "Operational", info: "Automated" },
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

        <SectionCard title="Recent Activity & Audit Trail" description="Recent franchise, student placement, and settlement actions">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} updated with latest partner benchmarks`, user: "Operations", time: "1h ago" },
              { action: "College engagement progress submitted for accreditation", user: "Partner Lead", time: "1d ago" },
              { action: "Weekly student placement drives finalized with corporate partners", user: "Automated System", time: "3d ago" },
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

