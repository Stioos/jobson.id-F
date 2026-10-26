import type { NavSection, Portal } from "@/lib/types";

export interface PortalConfig {
  id: Portal;
  label: string;
  short: string;
  description: string;
  accent: string;
  sections: NavSection[];
}

// ============================================================
// NAVIGATION DESIGN PRINCIPLES
// - Max 4 MAIN items per portal (top-level, always visible)
// - Max 6 SUB-items per main item (expandable/collapsible)
// - Max 24 leaf routes per portal
// - Each main item groups related workflows
// - Inspired by leading recruitment-platform partner portals
//   (Naukri Resdex, LinkedIn Recruiter, Workday, Greenhouse, Lever)
// ============================================================

export const portalConfigs: Record<Portal, PortalConfig> = {
  // ============================================================
  // PUBLIC CAREER PORTAL
  // ============================================================
  public: {
    id: "public",
    label: "Career Portal",
    short: "Public",
    description: "Find your next opportunity",
    accent: "bg-brand",
    sections: [
      {
        title: "Explore",
        items: [
          { key: "home", label: "Home", icon: "Home" },
          { key: "jobs", label: "Jobs", icon: "Briefcase" },
          { key: "companies", label: "Companies", icon: "Building2" },
          { key: "salary-insights", label: "Salary Insights", icon: "Banknote" },
          { key: "training", label: "Training & Courses", icon: "GraduationCap" },
          { key: "career-resources", label: "Career Resources", icon: "BookOpen" },
        ],
      },
      {
        title: "Company",
        items: [
          { key: "about", label: "About JOBSONN", icon: "Globe" },
          { key: "contact", label: "Contact", icon: "Mail" },
        ],
      },
    ],
  },

  // ============================================================
  // CANDIDATE PORTAL (merged with Learner Portal)
  // 4 main × 6 sub = 24 routes
  // ============================================================
  candidate: {
    id: "candidate",
    label: "Candidate Portal",
    short: "Candidate",
    description: "Jobs, learning & career growth",
    accent: "bg-brand",
    sections: [
      {
        title: "Main",
        items: [
          //Dashboard—LEAF(nosub-itemsdirectlink),
          { key: "overview", label: "Dashboard", icon: "LayoutDashboard" },
          //Tasks—MAIN(sharedtaskmanagementwithsub-sidebarforallportals),
          {
            key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
              { key: "tasks", label: "All Tasks", icon: "ListChecks" },
              { key: "tasks/calls", label: "Calls", icon: "Phone" },
              { key: "tasks/emails", label: "Emails", icon: "Mail" },
              { key: "tasks/meetings", label: "Meetings", icon: "Video" },
              { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
            ],
          },
          //Profile—NEWMAIN(profile-relatedpagesmovedherefromDashboard),
          {
            key: "profile-grp", label: "Profile", icon: "User", children: [
              { key: "profile", label: "My Profile", icon: "User" },
              { key: "profile-preview", label: "Profile Preview", icon: "Eye" },
              { key: "profile-analytics", label: "Profile Analytics", icon: "BarChart3" },
              { key: "profile-optimizer", label: "Profile Optimizer", icon: "Sparkles" },
              { key: "cover-letter", label: "Cover Letter Builder", icon: "FilePen" },
              { key: "resume", label: "Resume & CV", icon: "FileText" },
              { key: "resume-builder", label: "Resume Builder", icon: "FilePlus2" },
              { key: "portfolio", label: "Portfolio", icon: "FolderGit2" },
              { key: "documents", label: "Documents", icon: "FileStack" },
            ],
          },
          //CareerTools—NEWMAIN(pendingitems:alerts+accountitems),
          {
            key: "career-grp", label: "Career Tools", icon: "TrendingUp", children: [
              { key: "alerts", label: "Job Alerts", icon: "Bell" },
              { key: "skills", label: "My Skills", icon: "Brain" },
              { key: "goals", label: "Learning Goals", icon: "Target" },
              { key: "messages", label: "Messages", icon: "Mail" },
              { key: "salary-calculator", label: "Salary Calculator", icon: "Calculator" },
              { key: "interview-prep", label: "Interview Prep", icon: "BookOpen" },
              { key: "career-explorer", label: "Career Explorer", icon: "Route" },
              { key: "reference-requests", label: "References", icon: "UserCheck" },
              { key: "group-chat", label: "Group Chat", icon: "Users" },
            ],
          },
          {
            key: "jobs", label: "Jobs", icon: "Briefcase", children: [
              { key: "find-jobs", label: "Browse Jobs", icon: "Search" },
              { key: "recommended", label: "Recommended", icon: "Sparkles", badge: "AI" },
              { key: "saved-jobs", label: "Saved Jobs", icon: "Bookmark" },
              { key: "applications", label: "Applications", icon: "Inbox" },
              { key: "application-pipeline", label: "Pipeline", icon: "KanbanSquare" },
              { key: "interviews", label: "Interviews", icon: "Calendar" },
              { key: "interview-reschedule", label: "Reschedule Requests", icon: "CalendarClock" },
              { key: "video-call", label: "Video Calls", icon: "Video" },
              { key: "offers", label: "Job Offers", icon: "Gift" },
              { key: "offer-negotiation", label: "Offer Negotiation", icon: "MessagesSquare" },
              { key: "onboarding-checklist", label: "Onboarding Checklist", icon: "ListChecks" },
              { key: "compare-jobs", label: "Compare Jobs", icon: "Columns3" },
              { key: "compare-offers", label: "Compare Offers", icon: "Scale" },
              { key: "company-research", label: "Company Research", icon: "Search" },
            ],
          },
          {
            key: "learning", label: "Learning Academy", icon: "GraduationCap", children: [
              { key: "catalog", label: "Browse Courses", icon: "BookOpen" },
              { key: "my-learning", label: "My Learning", icon: "GraduationCap" },
              { key: "certificates", label: "My Certificates", icon: "Award" },
              { key: "career-paths", label: "Career Paths", icon: "Route" },
              { key: "achievements", label: "Achievements", icon: "Trophy" },
              { key: "partner-courses", label: "Partner Courses", icon: "Handshake" },
              { key: "events-calendar", label: "Events & Webinars", icon: "CalendarDays" },
            ],
          },
          {
            key: "billing", label: "Billing", icon: "Wallet", children: [
              { key: "my-wallet", label: "My Wallet", icon: "Wallet" },
              { key: "withdraw", label: "Withdraw Funds", icon: "ArrowDownToLine" },
              { key: "my-transactions", label: "Transactions", icon: "Receipt" },
              { key: "invoices", label: "Invoices", icon: "FileText" },
              { key: "my-subscription", label: "Subscription", icon: "Crown" },
              { key: "payments", label: "Payments", icon: "CreditCard" },
              { key: "payment-methods", label: "Payment Methods", icon: "CreditCard" },
              { key: "promo-codes", label: "Promo Codes", icon: "Ticket" },
              { key: "transaction-disputes", label: "Disputes", icon: "AlertTriangle" },
              { key: "referrals", label: "Referrals", icon: "Repeat" },
            ],
          },
          {
            key: "talent-solutions", label: "Talent Solutions", icon: "GraduationCap", children: [
              { key: "ts-hub", label: "Solutions Hub", icon: "Sparkles" },
              { key: "ts-my-programs", label: "My Programs", icon: "Briefcase" },
              { key: "ts-transactions", label: "Transactions", icon: "Receipt" },
            ],
          },
          {
            key: "support-grp", label: "Support", icon: "HelpCircle", children: [
              { key: "support-hub", label: "Help Center", icon: "LifeBuoy" },
              { key: "recruiter-reviews", label: "Recruiter Reviews", icon: "Star" },
              { key: "support", label: "Support (Legacy)", icon: "HelpCircle" },
            ],
          },
          {
            key: "settings-grp", label: "Settings", icon: "Settings", children: [
              { key: "settings-hub", label: "Settings Center", icon: "Settings" },
              { key: "security-center", label: "Security Center", icon: "ShieldCheck" },
              { key: "notification-center", label: "Notification Center", icon: "BellRing" },
              { key: "notification-preferences", label: "Notifications", icon: "Bell" },
              { key: "settings", label: "Privacy (Legacy)", icon: "Shield" },
            ],
          }
        ],
      },
    ],
  },

  // ============================================================
  // EMPLOYER PORTAL (merged with Enterprise Portal)
  // 5 main × up to 6 sub = 24+ routes
  // ============================================================
  employer: {
    id: "employer",
    label: "Employer Portal",
    short: "Employer",
    description: "Hire, train & manage talent",
    accent: "bg-brand",
    sections: [
      {
        title: "Main",
        items: [
          //Dashboard—LEAF(nosub-itemsdirectlink),
          { key: "overview", label: "Dashboard", icon: "LayoutDashboard" },
          //Tasks—MAIN(sharedtaskmanagementwithsub-sidebarforallportals),
          {
            key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
              { key: "tasks", label: "All Tasks", icon: "ListChecks" },
              { key: "tasks/calls", label: "Calls", icon: "Phone" },
              { key: "tasks/emails", label: "Emails", icon: "Mail" },
              { key: "tasks/meetings", label: "Meetings", icon: "Video" },
              { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
            ],
          },
          {
            key: "hiring", label: "Hiring", icon: "Briefcase", children: [
              { key: "jobs", label: "Jobs", icon: "Briefcase" },
              { key: "create-job", label: "Create Job", icon: "PenSquare" },
              { key: "requisitions", label: "Requisitions", icon: "ClipboardList" },
              { key: "applicants", label: "Applicants", icon: "Users", badge: "18" },
              { key: "pipeline", label: "Pipeline", icon: "KanbanSquare" },
              { key: "interviews", label: "Interviews", icon: "Calendar" },
              { key: "interview-kits", label: "Interview Kits", icon: "FileBox" },
              { key: "debriefs", label: "Debriefs", icon: "Users2" },
              { key: "hiring-manager-portal", label: "Hiring Manager Portal", icon: "Briefcase" },
            ],
          },
          {
            key: "talent", label: "Talent & Team", icon: "Users", children: [
              { key: "talent-search", label: "Talent Search", icon: "Search" },
              { key: "talent-pool", label: "Talent Pool", icon: "Database" },
              { key: "shortlists", label: "Shortlists", icon: "ListChecks" },
              { key: "compare-candidates", label: "Compare Candidates", icon: "Columns3" },
              { key: "offers", label: "Offers", icon: "Gift" },
              { key: "hires", label: "Employees & Hires", icon: "Users2" },
              { key: "background-verification", label: "Background Verification", icon: "ShieldCheck" },
              { key: "onboarding", label: "Onboarding Tracker", icon: "UserPlus" },
              { key: "probation", label: "Probation Tracking", icon: "Clock" },
              { key: "performance-review", label: "Performance Review", icon: "Star" },
              { key: "leave-management", label: "Leave Management", icon: "CalendarOff" },
              { key: "exit-management", label: "Exit Management", icon: "DoorOpen" },
              { key: "referral-program", label: "Referral Program", icon: "UserPlus" },
              { key: "campaigns", label: "Bulk Campaigns", icon: "Send" },
              { key: "team", label: "Recruitment Team", icon: "Users" },
            ],
          },
          {
            key: "learning", label: "Learning & Dev", icon: "GraduationCap", children: [
              { key: "ld-dashboard", label: "L&D Dashboard", icon: "LayoutDashboard" },
              { key: "assign-learning", label: "Assign Learning", icon: "GraduationCap" },
              { key: "employee-learning", label: "Employee Learning", icon: "UserCheck" },
              { key: "compliance-training", label: "Compliance", icon: "ShieldCheck" },
              { key: "skill-gaps", label: "Skill Gaps", icon: "GitBranch", badge: "AI" },
              { key: "training-roi", label: "Training ROI", icon: "TrendingUp" },
            ],
          },
          {
            key: "enterprise", label: "Enterprise", icon: "Building2", children: [
              { key: "ent-overview", label: "Enterprise Overview", icon: "LayoutDashboard" },
              { key: "ent-entities", label: "Entities & Brands", icon: "Building2" },
              { key: "ent-headcount", label: "Headcount Planning", icon: "Users2" },
              { key: "ent-budgets", label: "Budgets", icon: "Banknote" },
              { key: "ent-approvals", label: "Approvals", icon: "ShieldCheck" },
              { key: "ent-audit", label: "Audit & Compliance", icon: "ScrollText" },
            ],
          },
          {
            key: "finance", label: "Finance", icon: "Wallet", children: [
              { key: "emp-wallet", label: "Employer Wallet", icon: "Wallet" },
              { key: "emp-transactions", label: "Transactions", icon: "Receipt" },
              { key: "emp-settlements", label: "Partner Settlements", icon: "Coins" },
              { key: "invoices", label: "Invoices", icon: "FileText" },
              { key: "tax-documents", label: "Tax Documents", icon: "ReceiptText" },
              { key: "purchase-orders", label: "Purchase Orders", icon: "FileText" },
              { key: "cost-per-hire", label: "Cost per Hire", icon: "TrendingDown" },
              { key: "credits", label: "Credits & Tokens", icon: "Coins" },
              { key: "subscription", label: "Subscription & Billing", icon: "Crown" },
              { key: "analytics", label: "Analytics", icon: "BarChart3" },
            ],
          },
          {
            key: "partners", label: "Partners", icon: "Handshake", children: [
              { key: "partner-talent", label: "Partner Talent", icon: "Users" },
              { key: "partner-services", label: "Partner Services", icon: "Briefcase" },
            ],
          },
          {
            key: "talent-solutions", label: "Talent Solutions", icon: "GraduationCap", children: [
              { key: "ts-hub", label: "Solutions Hub", icon: "Sparkles" },
              { key: "ts-programs", label: "Programs", icon: "Briefcase" },
              { key: "ts-transactions", label: "Transactions", icon: "Receipt" },
              { key: "partner-talent", label: "Partner Talent", icon: "Users" },
            ],
          },
          {
            key: "support-grp", label: "Support", icon: "HelpCircle", children: [
              { key: "support-hub", label: "Help Center", icon: "LifeBuoy" },
              { key: "messages", label: "Messages", icon: "Mail" },
              { key: "whatsapp-sms", label: "WhatsApp / SMS", icon: "MessageCircle" },
              { key: "support", label: "Legacy Support", icon: "HelpCircle" },
            ],
          },
          {
            key: "settings-grp", label: "Settings", icon: "Settings", children: [
              { key: "settings-hub", label: "Settings Center", icon: "Settings" },
              { key: "security-center", label: "Security Center", icon: "ShieldCheck" },
              { key: "notification-preferences", label: "Notifications", icon: "Bell" },
              { key: "calendar-sync", label: "Calendar Sync", icon: "CalendarCheck" },
              { key: "status-notifications", label: "Status Notifications", icon: "BellRing" },
              { key: "company-preview", label: "Company Preview", icon: "Eye" },
              { key: "branding-score", label: "Branding Score", icon: "TrendingUp" },
              { key: "benefits-manager", label: "Benefits Manager", icon: "Gift" },
              { key: "team", label: "Team & Roles", icon: "Users" },
              { key: "integrations", label: "Integrations", icon: "Plug" },
              { key: "settings", label: "Legacy Settings", icon: "Cog" },
            ],
          }
        ],
      },
    ],
  },

  // ============================================================
  // RECRUITER PORTAL (merged with Agency Portal)
  // 8 main groups covering the full reference recruitment model
  // ============================================================
  recruiter: {
    id: "recruiter",
    label: "Recruiter Portal",
    short: "Recruiter",
    description: "Source, submit & place talent",
    accent: "bg-brand",
    sections: [
      {
        title: "Main",
        items: [
          //Dashboard—LEAF(nosub-itemsdirectlink),
          { key: "overview", label: "Dashboard", icon: "LayoutDashboard" },
          //Tasks—MAIN(sharedtaskmanagementwithsub-sidebarforallportals),
          {
            key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
              { key: "tasks", label: "All Tasks", icon: "ListChecks" },
              { key: "tasks/calls", label: "Calls", icon: "Phone" },
              { key: "tasks/emails", label: "Emails", icon: "Mail" },
              { key: "tasks/meetings", label: "Meetings", icon: "Video" },
              { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
            ],
          },
          {
            key: "overview-grp", label: "Analytics & Intel", icon: "Gauge", children: [
              { key: "analytics", label: "Analytics Hub", icon: "Gauge" },
              { key: "activity", label: "Activity & Comms", icon: "History" },
              { key: "report-builder", label: "Report Builder", icon: "BarChart3" },
              { key: "talent-forecast", label: "Talent Forecast", icon: "TrendingUp" },
              { key: "recruiting-ai", label: "Recruiting AI", icon: "Sparkles", badge: "AI" },
              { key: "audit-logs", label: "Audit Logs", icon: "ScrollText" },
            ],
          },
          {
            key: "clients-grp", label: "Clients & Business", icon: "Building2", children: [
              { key: "client-accounts", label: "Client Accounts", icon: "Building2" },
              { key: "clients", label: "Client Companies", icon: "Handshake" },
              { key: "client-dev", label: "Client Development", icon: "Target" },
              { key: "marketing", label: "Marketing Centre", icon: "Megaphone" },
              { key: "requisitions", label: "Requisitions", icon: "Briefcase" },
              { key: "ag-clients", label: "Agency Clients", icon: "Handshake" },
            ],
          },
          {
            key: "jobs-grp", label: "Jobs & Pipeline", icon: "Briefcase", children: [
              { key: "job-orders", label: "Job Orders", icon: "ClipboardList", badge: "5" },
              { key: "openings", label: "Openings & Headcount", icon: "Users" },
              { key: "pipeline", label: "Pipeline Board", icon: "KanbanSquare" },
              { key: "submissions", label: "Submissions", icon: "Send" },
              { key: "submission-tracker", label: "Submission Tracker", icon: "Send" },
              { key: "interview-pipeline", label: "Interview Pipeline", icon: "Calendar" },
              { key: "scheduling", label: "Scheduling", icon: "CalendarCheck2" },
            ],
          },
          {
            key: "sourcing-grp", label: "Talent & Sourcing", icon: "Search", children: [
              { key: "candidates", label: "Candidate Pool", icon: "Users" },
              { key: "ai-match-scoring", label: "AI Match Scoring", icon: "Sparkles", badge: "AI" },
              { key: "talent-pool", label: "Talent Pools", icon: "Database" },
              { key: "hotlists", label: "Hotlists", icon: "Flame" },
              { key: "dedup-center", label: "Dedup Center", icon: "Copy" },
              { key: "boolean-search", label: "Boolean Search", icon: "SearchCode" },
              { key: "resume-parser", label: "Resume Parser", icon: "FileSearch" },
              { key: "network-sourcing", label: "Network Sourcing", icon: "Network", badge: "AI" },
              { key: "referrals", label: "Referrals", icon: "UserCheck" },
              { key: "sourcing-campaigns", label: "Campaigns", icon: "Megaphone" },
              { key: "partner-candidates", label: "Partner Candidates", icon: "GraduationCap" },
              { key: "partner-network", label: "Partner Network", icon: "Handshake" },
            ],
          },
          {
            key: "hiring-grp", label: "Hiring & Ops", icon: "ClipboardCheck", children: [
              { key: "offers", label: "Offers", icon: "FileText" },
              { key: "offer-esign", label: "Offer E-Sign", icon: "FileSignature" },
              { key: "assessments", label: "Assessments", icon: "ClipboardCheck" },
              { key: "feedback", label: "Interview Feedback", icon: "Star" },
              { key: "placements", label: "Placements", icon: "Handshake" },
              { key: "placement-verification", label: "Placement Verification", icon: "BadgeCheck" },
              { key: "guarantees", label: "Guarantee Tracker", icon: "ShieldCheck" },
              { key: "onboarding", label: "Onboarding", icon: "UserCheck" },
              { key: "tasks", label: "Tasks & Follow-ups", icon: "ListChecks", badge: "2" },
            ],
          },
          {
            key: "finance-grp", label: "Finance", icon: "Wallet", children: [
              { key: "wallet", label: "Wallet & Revenue", icon: "Wallet" },
              { key: "multi-currency-wallet", label: "Multi-Currency Wallet", icon: "Wallet" },
              { key: "payouts", label: "Payouts", icon: "ArrowDownToLine" },
              { key: "settlements", label: "Settlements", icon: "Coins" },
              { key: "commissions", label: "Commissions", icon: "Percent" },
              { key: "invoices", label: "Invoices & Billing", icon: "Receipt" },
              { key: "gst-invoice-generator", label: "GST Invoice Generator", icon: "FileText" },
              { key: "billing-milestones", label: "Billing Milestones", icon: "Milestone" },
              { key: "earnings-forecast", label: "Earnings Forecast", icon: "TrendingUp" },
              { key: "client-payment-aging", label: "Payment Aging", icon: "Clock" },
              { key: "timesheets", label: "Timesheets", icon: "Calendar" },
              { key: "candidate-compliance", label: "Compliance", icon: "ShieldCheck" },
            ],
          },
          {
            key: "comms-grp", label: "Comms & Support", icon: "Mail", children: [
              { key: "inbox", label: "Candidate Inbox", icon: "Inbox", badge: "2" },
              { key: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
              { key: "sequences", label: "Drip Campaigns", icon: "Workflow" },
              { key: "email-templates", label: "Email Templates", icon: "Mail" },
              { key: "rejection-automation", label: "Rejection Automation", icon: "MailX" },
              { key: "sms-inbox", label: "SMS Inbox", icon: "Smartphone" },
              { key: "auto-reminders", label: "Auto Reminders", icon: "AlarmClock" },
              { key: "follow-up-automation", label: "Follow-up Automation", icon: "Workflow" },
              { key: "voip-logging", label: "VoIP Call Logs", icon: "PhoneCall" },
              { key: "messages", label: "Messages", icon: "MessagesSquare" },
              { key: "support", label: "Support", icon: "HelpCircle" },
            ],
          },
          {
            key: "agency-grp", label: "Agency & Team", icon: "Settings", children: [
              { key: "recruiters", label: "Recruiter Team", icon: "Users" },
              { key: "recruiter-profile-public", label: "Public Profile", icon: "UserCircle" },
              { key: "agency-branding", label: "Agency Branding", icon: "Palette" },
              { key: "ag-overview", label: "Agency Overview", icon: "LayoutDashboard" },
              { key: "ag-profile", label: "Agency Profile", icon: "Building2" },
              { key: "ag-recruiters", label: "Agency Recruiters", icon: "Users" },
              { key: "ag-commissions", label: "Commission Recon", icon: "Coins" },
              { key: "ag-settings", label: "Agency Settings", icon: "Settings" },
            ],
          },
          {
            key: "talent-solutions", label: "Talent Solutions", icon: "GraduationCap", children: [
              { key: "ts-hub", label: "T2H Candidates", icon: "Users" },
              { key: "ts-transactions", label: "Transactions", icon: "Receipt" },
            ],
          },
          {
            key: "support-grp", label: "Support", icon: "HelpCircle", children: [
              { key: "support-hub", label: "Help Center", icon: "LifeBuoy" },
              { key: "inbox", label: "Candidate Inbox", icon: "Inbox" },
              { key: "support", label: "Legacy Support", icon: "HelpCircle" },
            ],
          },
          {
            key: "settings-grp", label: "Settings", icon: "Settings", children: [
              { key: "settings-hub", label: "Settings Center", icon: "Settings" },
              { key: "security-center", label: "Security Center", icon: "ShieldCheck" },
              { key: "notification-preferences", label: "Notifications", icon: "Bell" },
              { key: "recruiters", label: "Recruiter Team", icon: "Users" },
              { key: "settings", label: "Legacy Settings", icon: "Cog" },
            ],
          }
        ],
      },
    ],
  },

  // ============================================================
  // TRAINING PORTAL (merged with Admin Portal)
  // 4 main × 6 sub = 24 routes (consolidated from 75!)
  // ============================================================
  training: {
    id: "training",
    label: "Training & Admin Portal",
    short: "Training",
    description: "Corporate training + platform admin",
    accent: "bg-brand",
    sections: [
      {
        title: "Main",
        items: [
          //Dashboard—LEAF(nosub-itemsdirectlink),
          { key: "overview", label: "Dashboard", icon: "LayoutDashboard" },
          //Tasks—MAIN(sharedtaskmanagementwithsub-sidebarforallportals),
          {
            key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
              { key: "tasks", label: "All Tasks", icon: "ListChecks" },
              { key: "tasks/calls", label: "Calls", icon: "Phone" },
              { key: "tasks/emails", label: "Emails", icon: "Mail" },
              { key: "tasks/meetings", label: "Meetings", icon: "Video" },
              { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
            ],
          },
          //1.Training(overviewremoved—it'snowtheDashboardleafabove),
          {
            key: "training-ops", label: "Training", icon: "GraduationCap", children: [
              { key: "courses", label: "Course Catalog", icon: "BookOpen" },
              { key: "curriculum-designer", label: "Curriculum Designer", icon: "LayoutTemplate" },
              { key: "cohorts", label: "Cohorts", icon: "Users2" },
              { key: "live-training", label: "Live Sessions", icon: "Video" },
              { key: "trainers", label: "Trainers", icon: "GraduationCap" },
              { key: "trainer-allocation", label: "Trainer Allocation", icon: "UserCog" },
              { key: "completion-tracker", label: "Completion Tracker", icon: "Flag" },
              { key: "assessments", label: "Assessments", icon: "ClipboardCheck" },
              { key: "question-bank", label: "Question Bank", icon: "HelpCircle" },
              { key: "certifications", label: "Certifications", icon: "Award" },
              { key: "attendance", label: "Attendance", icon: "CalendarCheck" },
              { key: "gradebook", label: "Gradebook", icon: "GraduationCap" },
            ],
          },
          //2.TalentSolutions(NEWMAIN),
          {
            key: "talent-solutions", label: "Talent Solutions", icon: "Target", children: [
              { key: "ts-hub", label: "Solutions Hub", icon: "LayoutDashboard" },
              { key: "ts-train-to-hire", label: "Train to Hire", icon: "GraduationCap", badge: "T2H" },
              { key: "ts-hire-to-train", label: "Hire to Train", icon: "UserCheck", badge: "H2T" },
              { key: "ts-corporate-training", label: "Corporate Training", icon: "Building2" },
              { key: "talent-search", label: "Talent Search", icon: "Search", badge: "AI" },
              { key: "placements", label: "Placements", icon: "Handshake" },
            ],
          },
          //3.Business(existing),
          {
            key: "business", label: "Business", icon: "Handshake", children: [
              { key: "training-profile", label: "Provider Profile", icon: "Building2" },
              { key: "clients", label: "Corporate Clients", icon: "Building2" },
              { key: "programs", label: "Training Programs", icon: "Target" },
              { key: "campaigns", label: "Campaigns", icon: "Megaphone" },
              { key: "corporate-sponsorship", label: "Sponsorships", icon: "Handshake" },
              { key: "budgets", label: "Client Budgets", icon: "Wallet" },
              { key: "invoices", label: "Invoices", icon: "Receipt" },
              { key: "academy", label: "Corporate Academies", icon: "Building2" },
            ],
          },
          //4.Transactions(NEWMAIN),
          {
            key: "transactions-grp", label: "Transactions", icon: "Wallet", children: [
              { key: "transaction-hub", label: "Transaction Hub", icon: "LayoutDashboard" },
              { key: "transactions", label: "All Transactions", icon: "ReceiptText" },
              { key: "billing-center", label: "Billing Center", icon: "Receipt" },
              { key: "payment-gateway", label: "Payment Gateway", icon: "CreditCard" },
              { key: "settlement-engine", label: "Settlements", icon: "Coins" },
              { key: "fee-collection", label: "Fee Collection", icon: "Wallet" },
              { key: "invoice-rules", label: "Invoice Rules", icon: "Settings2" },
              { key: "refunds", label: "Refunds", icon: "RotateCcw" },
              { key: "transaction-comms", label: "Communications", icon: "Mail" },
            ],
          },
          //5.Talent&Skills(existing),
          {
            key: "talent", label: "Talent & Skills", icon: "Users", children: [
              { key: "student-profile-360", label: "Student 360° View", icon: "Users" },
              { key: "sourcing-requests", label: "Sourcing Requests", icon: "Briefcase", badge: "5" },
              { key: "skills", label: "Skill Frameworks", icon: "Brain" },
              { key: "skill-gaps", label: "Skill Gaps", icon: "GitBranch", badge: "AI" },
              { key: "compliance", label: "Compliance", icon: "ShieldCheck" },
              { key: "enrollments", label: "Enrollments", icon: "Users2" },
              { key: "enrollment-approval", label: "Enrollment Approvals", icon: "ClipboardCheck" },
              { key: "verify-credentials", label: "Verify Credentials", icon: "BadgeCheck" },
              { key: "scholarships", label: "Scholarships", icon: "Award" },
            ],
          },
          //6.PlatformAdmin(NEWMAIN—expandedwithsuperadmin),
          {
            key: "admin", label: "Platform Admin", icon: "Shield", children: [
              { key: "adm-overview", label: "Admin Overview", icon: "LayoutDashboard" },
              { key: "adm-user-mgmt", label: "User Management", icon: "Users" },
              { key: "adm-roles-hierarchy", label: "Roles & Hierarchy", icon: "ShieldCheck" },
              { key: "adm-organizations", label: "Organizations", icon: "Building2" },
              { key: "adm-partner-mgmt", label: "Partner Mgmt", icon: "Handshake" },
              { key: "adm-audit-logs", label: "Audit Logs", icon: "ScrollText" },
            ],
          },
          //7.Finance&Revenue,
          {
            key: "finance-grp", label: "Finance & Revenue", icon: "Banknote", children: [
              { key: "adm-platform-revenue", label: "Platform Revenue", icon: "Banknote" },
              { key: "adm-partner-payouts", label: "Partner Payouts", icon: "Coins" },
              { key: "adm-transaction-monitoring", label: "Monitoring", icon: "Gauge" },
              { key: "adm-partner-applications", label: "Partner Applications", icon: "FileText", badge: "6" },
              { key: "adm-partner-performance", label: "Partner Performance", icon: "TrendingUp" },
              { key: "adm-system-config", label: "System Settings", icon: "Cog" },
            ],
          },
          //8.Tools&Support,
          {
            key: "tools-grp", label: "Tools", icon: "Wrench", children: [
              { key: "verify-cert", label: "Verify Certificate", icon: "ShieldCheck" },
              { key: "approvals", label: "Approvals", icon: "BadgeCheck" },
              { key: "providers", label: "Content Providers", icon: "Handshake" },
              { key: "data-export", label: "Data Export", icon: "FileText" },
              { key: "student-messaging", label: "Student Messaging", icon: "MessageSquare" },
              { key: "parent-portal", label: "Parent Portal", icon: "Users" },
              { key: "discussion-forums", label: "Discussion Forums", icon: "MessageSquare" },
            ],
          },
          //9.Settings(SETTINGS-SUPPORT),
          //10.Support(SETTINGS-SUPPORT),
          {
            key: "support-grp", label: "Support", icon: "HelpCircle", children: [
              { key: "support-hub", label: "Help Center", icon: "LifeBuoy" },
              { key: "announcements", label: "Announcements", icon: "Megaphone" },
              { key: "audit-logs", label: "Audit Logs", icon: "ScrollText" },
              { key: "support", label: "Legacy Support", icon: "HelpCircle" },
            ],
          },
          {
            key: "settings-grp", label: "Settings", icon: "Settings", children: [
              { key: "settings-hub", label: "Settings Center", icon: "Settings" },
              { key: "security-center", label: "Security Center", icon: "ShieldCheck" },
              { key: "notification-preferences", label: "Notifications", icon: "Bell" },
              { key: "integrations", label: "Integrations", icon: "Plug" },
              { key: "settings", label: "Legacy Settings", icon: "Cog" },
            ],
          }
        ],
      },
    ],
  },

  // ============================================================
  // Legacy portal configs kept for type completeness (unused after merge)
  // ============================================================
  agency: {
    id: "agency",
    label: "Agency Portal",
    short: "Agency",
    description: "Manage your agency",
    accent: "bg-brand",
    sections: [{ title: "Main", items: [
      { key: "overview", label: "Overview", icon: "LayoutDashboard" },
      {
        key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
          { key: "tasks", label: "All Tasks", icon: "ListChecks" },
          { key: "tasks/calls", label: "Calls", icon: "Phone" },
          { key: "tasks/emails", label: "Emails", icon: "Mail" },
          { key: "tasks/meetings", label: "Meetings", icon: "Video" },
          { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
        ],
      },
    ] }],
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise Portal",
    short: "Enterprise",
    description: "Govern hiring at scale",
    accent: "bg-brand",
    sections: [{ title: "Main", items: [
      { key: "overview", label: "Overview", icon: "LayoutDashboard" },
      {
        key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
          { key: "tasks", label: "All Tasks", icon: "ListChecks" },
          { key: "tasks/calls", label: "Calls", icon: "Phone" },
          { key: "tasks/emails", label: "Emails", icon: "Mail" },
          { key: "tasks/meetings", label: "Meetings", icon: "Video" },
          { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
        ],
      },
    ] }],
  },
  admin: {
    id: "admin",
    label: "Admin Portal",
    short: "Admin",
    description: "Platform governance",
    accent: "bg-brand",
    sections: [{ title: "Main", items: [
      { key: "overview", label: "Overview", icon: "LayoutDashboard" },
      {
        key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
          { key: "tasks", label: "All Tasks", icon: "ListChecks" },
          { key: "tasks/calls", label: "Calls", icon: "Phone" },
          { key: "tasks/emails", label: "Emails", icon: "Mail" },
          { key: "tasks/meetings", label: "Meetings", icon: "Video" },
          { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
        ],
      },
    ] }],
  },
  learner: {
    id: "learner",
    label: "Learner Portal",
    short: "Learner",
    description: "Learn, get certified, grow",
    accent: "bg-brand",
    sections: [{ title: "Main", items: [
      { key: "overview", label: "Overview", icon: "LayoutDashboard" },
      {
        key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
          { key: "tasks", label: "All Tasks", icon: "ListChecks" },
          { key: "tasks/calls", label: "Calls", icon: "Phone" },
          { key: "tasks/emails", label: "Emails", icon: "Mail" },
          { key: "tasks/meetings", label: "Meetings", icon: "Video" },
          { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
        ],
      },
    ] }],
  },
  // ============================================================
  // PARTNER PORTAL (Franchise model — 8 mains × 6 subs = 42 routes)
  // Generic partner view + College partner view from reference screenshots
  // ============================================================
  partner: {
    id: "partner",
    label: "Partner Portal",
    short: "Partner",
    description: "Franchise & partnership operations",
    accent: "bg-brand",
    sections: [
      {
        title: "Main",
        items: [
          //Dashboard—LEAF(nosub-itemsdirectlink),
          { key: "overview", label: "Dashboard", icon: "LayoutDashboard" },
          //Tasks—MAIN(sharedtaskmanagementwithsub-sidebarforallportals),
          {
            key: "tasks-grp", label: "Tasks", icon: "CheckSquare", badge: "6", children: [
              { key: "tasks", label: "All Tasks", icon: "ListChecks" },
              { key: "tasks/calls", label: "Calls", icon: "Phone" },
              { key: "tasks/emails", label: "Emails", icon: "Mail" },
              { key: "tasks/meetings", label: "Meetings", icon: "Video" },
              { key: "tasks/follow-ups", label: "Follow-ups", icon: "ArrowUpRight" },
            ],
          },
          {
            key: "overview-grp", label: "Analytics & Reports", icon: "Gauge", children: [
              { key: "analytics", label: "Analytics Hub", icon: "Gauge" },
              { key: "partner-scorecard", label: "Performance Scorecard", icon: "Trophy" },
              { key: "reports", label: "Reports", icon: "BarChart3" },
              { key: "revenue", label: "Revenue", icon: "TrendingUp" },
              { key: "announcements", label: "Announcements", icon: "BellRing", badge: "3" },
              { key: "audit-logs", label: "Audit Logs", icon: "ScrollText" },
            ],
          },
          {
            key: "deals-grp", label: "Deals & CRM", icon: "Briefcase", children: [
              { key: "deals", label: "Deals Pipeline", icon: "Briefcase" },
              { key: "leads", label: "Leads & CRM", icon: "Users" },
              { key: "my-clients", label: "My Clients", icon: "Handshake" },
              { key: "students", label: "Students", icon: "GraduationCap" },
              { key: "marketing", label: "Marketing Centre", icon: "Megaphone" },
              { key: "applications", label: "Applications", icon: "FileText", badge: "6" },
            ],
          },
          {
            key: "partnership-grp", label: "Partnership", icon: "Handshake", children: [
              { key: "profile", label: "Partner Profile", icon: "Building2" },
              { key: "partner-profile-enhanced", label: "Partner Profile", icon: "Building2" },
              { key: "college-profiles", label: "College Profiles", icon: "GraduationCap" },
              { key: "college-applications", label: "College Applications", icon: "FileText" },
              { key: "colleges", label: "My Colleges", icon: "Building2" },
              { key: "college-workspace", label: "College Workspace", icon: "Building2" },
              { key: "models", label: "Partnership Models", icon: "GitBranch" },
              { key: "mou-agreements", label: "MoU & Agreements", icon: "FileText" },
              { key: "partner-onboarding", label: "Onboarding Wizard", icon: "Rocket" },
              { key: "renewals", label: "Renewals", icon: "RotateCcw", badge: "3" },
              { key: "renewal-forecast", label: "Renewal Forecast", icon: "CalendarClock" },
            ],
          },
          {
            key: "academics-grp", label: "Academics", icon: "GraduationCap", children: [
              { key: "programs", label: "Programs", icon: "BookOpen" },
              { key: "centres", label: "Training Centres", icon: "Building2" },
              { key: "batches", label: "Batches", icon: "CalendarCheck2" },
              { key: "faculty", label: "Faculty", icon: "Users" },
              { key: "training-delivery", label: "Training & Delivery", icon: "Presentation" },
              { key: "events-drives", label: "Events & Drives", icon: "Calendar" },
            ],
          },
          {
            key: "careers-grp", label: "Careers & Outcomes", icon: "TrendingUp", children: [
              { key: "internships", label: "Internships", icon: "Briefcase" },
              { key: "projects", label: "Projects", icon: "FolderGit2" },
              { key: "job-orders", label: "Job Orders", icon: "ClipboardList", badge: "5" },
              { key: "placements", label: "Placements", icon: "BadgeCheck" },
              { key: "compliance", label: "Compliance", icon: "ShieldCheck" },
              { key: "certificates", label: "Certificates", icon: "Award" },
            ],
          },
          {
            key: "finance-grp", label: "Finance", icon: "Wallet", children: [
              { key: "wallet", label: "Wallet & Payouts", icon: "Wallet" },
              { key: "settlements", label: "Settlements", icon: "Coins" },
              { key: "split-simulator", label: "Split Simulator", icon: "Calculator" },
              { key: "settlement-disputes", label: "Settlement Disputes", icon: "AlertTriangle" },
              { key: "transactions", label: "Transactions", icon: "ReceiptText" },
              { key: "accounts", label: "Balances & Tax", icon: "Landmark" },
              { key: "tax-rates", label: "Tax Rates", icon: "Percent" },
              { key: "commissions", label: "Commissions", icon: "Percent" },
              { key: "tax-documents", label: "Tax Documents", icon: "ReceiptText" },
              { key: "fees", label: "Fees & Collections", icon: "ReceiptText" },
            ],
          },
          {
            key: "tools-grp", label: "Tools", icon: "Wrench", children: [
              { key: "online-tools", label: "Online Software", icon: "LayoutTemplate" },
              { key: "forms-assistance", label: "Forms & Assistance", icon: "FileText" },
              { key: "guidelines", label: "Guidelines", icon: "BookOpen" },
              { key: "service-catalog", label: "Service Catalog", icon: "Layers" },
              { key: "engagements", label: "Engagements", icon: "KanbanSquare" },
              { key: "marketing-materials", label: "Marketing Materials", icon: "FolderOpen" },
              { key: "client-messaging", label: "Client Messaging", icon: "MessageSquare", badge: "5" },
            ],
          },
          {
            key: "talent-solutions", label: "Talent Solutions", icon: "GraduationCap", children: [
              { key: "ts-hub", label: "Solutions Hub", icon: "Sparkles" },
              { key: "ts-transactions", label: "Transactions", icon: "Receipt" },
            ],
          },
          {
            key: "support-grp", label: "Support", icon: "HelpCircle", children: [
              { key: "support-hub", label: "Help Center", icon: "LifeBuoy" },
              { key: "revenue-splits", label: "Revenue Splits", icon: "Percent" },
              { key: "invoices", label: "Invoices", icon: "FileText" },
              { key: "support", label: "Legacy Support", icon: "HelpCircle" },
            ],
          },
          {
            key: "settings-grp", label: "Settings", icon: "Settings", children: [
              { key: "settings-hub", label: "Settings Center", icon: "Settings" },
              { key: "security-center", label: "Security Center", icon: "ShieldCheck" },
              { key: "notification-preferences", label: "Notifications", icon: "Bell" },
              { key: "settings", label: "Legacy Settings", icon: "Cog" },
              { key: "configure-settings", label: "Configure", icon: "SlidersHorizontal" },
              { key: "calculator", label: "Revenue Calculator", icon: "Calculator" },
            ],
          }
        ],
      },
    ],
  },
};
