// ============================================================
// TALENT SOLUTIONS CONFIG — 7 solutions × 8 sub-pages each
// Compact metadata used by the generic landing + sub-page components
// to generate 16 sections of content per sub-page.
// ============================================================

export interface TalentSubPageDef {
  subPageKey: string;
  label: string;
  icon: string;
  desc: string;
}

export interface TalentSolutionDef {
  solutionKey: string;
  label: string;
  icon: string;
  color: string;
  badge: string;
  desc: string;
  subPages: TalentSubPageDef[];
}

export const TALENT_SOLUTIONS_CONFIG: TalentSolutionDef[] = [
  // 1. Train to Hire
  {
    solutionKey: "talent-train-to-hire",
    label: "Train to Hire",
    icon: "GraduationCap",
    color: "#0EA5E9",
    badge: "Training + Placement",
    desc: "We recruit fresh talent, upskill them through industry-aligned training, and deploy them to your team — production-ready in 12-16 weeks.",
    subPages: [
      { subPageKey: "program-design", label: "Program Design & Curriculum", icon: "FileText", desc: "Custom training programs designed around your tech stack, domain, and hiring goals." },
      { subPageKey: "cohort-sourcing", label: "Cohort Sourcing & Screening", icon: "Search", desc: "AI-powered sourcing of high-aptitude candidates from 2M+ verified profiles." },
      { subPageKey: "training-delivery", label: "Training Delivery & Mentoring", icon: "GraduationCap", desc: "Live project-based training with 1:1 mentorship from senior engineers." },
      { subPageKey: "assessment-certification", label: "Assessment & Certification", icon: "ClipboardCheck", desc: "Multi-stage assessments and industry-recognized certification before deployment." },
      { subPageKey: "deployment-planning", label: "Deployment Planning & Onboarding", icon: "Calendar", desc: "Structured onboarding plan to ensure smooth transition to your team." },
      { subPageKey: "pricing-roi", label: "Pricing & ROI Calculator", icon: "Wallet", desc: "Transparent per-trainee pricing with measurable ROI from day one." },
      { subPageKey: "case-studies", label: "Case Studies & Success Stories", icon: "Award", desc: "Real results from companies that scaled teams with Train to Hire." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Everything you need to know about the Train to Hire program." },
    ],
  },
  // 2. Hire to Train
  {
    solutionKey: "talent-hire-to-train",
    label: "Hire to Train",
    icon: "UserCheck",
    color: "#8B5CF6",
    badge: "Hire + Upskill",
    desc: "Hire promising candidates directly, then we train them to meet your specific technical requirements — faster onboarding, better fit.",
    subPages: [
      { subPageKey: "sourcing-screening", label: "Sourcing & Screening", icon: "Search", desc: "AI-powered sourcing of candidates with high learning aptitude and cultural fit." },
      { subPageKey: "custom-training", label: "Custom Training Design", icon: "FileText", desc: "Training programs tailored to your exact tech stack, processes, and standards." },
      { subPageKey: "onboarding", label: "Onboarding & Integration", icon: "UserCheck", desc: "Structured onboarding to integrate new hires into your team from day one." },
      { subPageKey: "mentorship", label: "Mentorship & Support", icon: "Users", desc: "Dedicated mentorship during the training period to ensure success." },
      { subPageKey: "performance-tracking", label: "Performance Tracking", icon: "BarChart3", desc: "Real-time performance dashboards to track progress and identify gaps." },
      { subPageKey: "pricing-roi", label: "Pricing & ROI", icon: "Wallet", desc: "Cost-effective pricing models that reduce your overall cost-per-hire." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How companies reduced ramp-up time with Hire to Train." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Common questions about the Hire to Train model." },
    ],
  },
  // 3. Corporate Training
  {
    solutionKey: "talent-corporate-training",
    label: "Corporate Training",
    icon: "Award",
    color: "#F97316",
    badge: "Enterprise Training",
    desc: "Custom corporate training programs designed to upskill your existing workforce at scale — from emerging tech to leadership development.",
    subPages: [
      { subPageKey: "training-programs", label: "Training Programs Catalog", icon: "BookOpen", desc: "50+ training programs across AI, cloud, data, leadership, and more." },
      { subPageKey: "custom-curriculum", label: "Custom Curriculum Design", icon: "FileText", desc: "Bespoke curriculum built around your team's skill gaps and business goals." },
      { subPageKey: "delivery-modes", label: "Delivery Modes", icon: "Globe", desc: "Online, hybrid, or in-person — choose the delivery mode that works for your team." },
      { subPageKey: "assessment-certification", label: "Assessment & Certification", icon: "ClipboardCheck", desc: "Pre and post-training assessments with industry-recognized certifications." },
      { subPageKey: "lms-integration", label: "LMS Integration & Platform", icon: "LayoutDashboard", desc: "Seamless integration with your LMS and access to our learning platform." },
      { subPageKey: "pricing", label: "Pricing & Packages", icon: "Wallet", desc: "Flexible per-seat, per-program, or enterprise unlimited pricing." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How enterprises upskilled 500+ employees with our corporate training." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Everything about corporate training delivery and logistics." },
    ],
  },
  // 4. Talent Assessment
  {
    solutionKey: "talent-assessment",
    label: "Talent Assessment",
    icon: "ClipboardCheck",
    color: "#EF4444",
    badge: "AI Assessment",
    desc: "AI-powered assessments to evaluate technical skills, aptitude, and cultural fit — scientifically validated, bias-aware, and transparent.",
    subPages: [
      { subPageKey: "ai-technical-screens", label: "AI Technical Screens", icon: "Sparkles", desc: "AI-driven technical interviews that evaluate real coding and problem-solving." },
      { subPageKey: "proctored-assessments", label: "Proctored Assessments", icon: "ClipboardCheck", desc: "Secure, proctored coding tests with anti-cheating and plagiarism detection." },
      { subPageKey: "culture-fit", label: "Culture-Fit Evaluation", icon: "Users", desc: "Behavioral and culture-fit assessments using validated psychometric models." },
      { subPageKey: "skill-mapping", label: "Skill Mapping & Gap Analysis", icon: "BarChart3", desc: "Detailed skill mapping against role requirements with actionable gap analysis." },
      { subPageKey: "reporting-analytics", label: "Reporting & Analytics", icon: "TrendingUp", desc: "Real-time dashboards and analytics on assessment results and hiring funnel." },
      { subPageKey: "pricing", label: "Pricing & Plans", icon: "Wallet", desc: "Pay-per-assessment or subscription plans for high-volume hiring." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How companies reduced bad hires by 60% with AI assessments." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Common questions about assessment methodology and security." },
    ],
  },
  // 5. Talent Deployment
  {
    solutionKey: "talent-flexible-deployment",
    label: "Talent Deployment",
    icon: "Layers",
    color: "#10B981",
    badge: "On-Demand Talent",
    desc: "Deploy talent flexibly — contract, project-based, or on-demand staffing. Scale up and down in days, not months.",
    subPages: [
      { subPageKey: "contract-staffing", label: "Contract Staffing", icon: "Briefcase", desc: "Skilled contract professionals for short-term and long-term engagements." },
      { subPageKey: "project-based", label: "Project-Based Talent", icon: "FileText", desc: "Dedicated teams for specific projects with clear deliverables and timelines." },
      { subPageKey: "on-demand", label: "On-Demand Talent Pool", icon: "Clock", desc: "Pre-vetted talent pool ready to deploy within 48 hours of request." },
      { subPageKey: "talent-bench", label: "Talent Bench Management", icon: "Users", desc: "Maintain a bench of pre-vetted talent for your fluctuating workforce needs." },
      { subPageKey: "compliance-payroll", label: "Compliance & Payroll", icon: "ShieldCheck", desc: "Full compliance, payroll, and benefits management for contract workforce." },
      { subPageKey: "pricing", label: "Pricing & Rates", icon: "Wallet", desc: "Transparent hourly, monthly, and project-based rates with no hidden fees." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How companies scaled 200x with flexible talent deployment." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Common questions about contract types and compliance." },
    ],
  },
  // 6. Workforce Solutions
  {
    solutionKey: "talent-end-to-end-workforce",
    label: "Workforce Solutions",
    icon: "Globe",
    color: "#8B5CF6",
    badge: "Full Lifecycle",
    desc: "Complete workforce management from hiring to retention — one partner, every talent function. Strategic, operational, and tactical.",
    subPages: [
      { subPageKey: "workforce-planning", label: "Workforce Planning & Strategy", icon: "BarChart3", desc: "Data-driven workforce planning aligned with your business roadmap." },
      { subPageKey: "sourcing-recruitment", label: "Sourcing & Recruitment", icon: "Search", desc: "End-to-end recruitment — from sourcing to onboarding, managed by one team." },
      { subPageKey: "onboarding-training", label: "Onboarding & Training", icon: "GraduationCap", desc: "Structured onboarding and continuous training programs for new hires." },
      { subPageKey: "retention-programs", label: "Retention & Engagement", icon: "HeartHandshake", desc: "Retention strategies, engagement programs, and career pathing to reduce attrition." },
      { subPageKey: "performance-management", label: "Performance Management", icon: "TrendingUp", desc: "Goal-setting, performance reviews, and feedback systems that drive results." },
      { subPageKey: "analytics-reporting", label: "Analytics & Reporting", icon: "BarChart3", desc: "Workforce analytics dashboards — headcount, attrition, diversity, cost-per-hire." },
      { subPageKey: "pricing", label: "Pricing & Enterprise Plans", icon: "Wallet", desc: "Enterprise pricing with dedicated account management and SLAs." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Everything about end-to-end workforce management partnerships." },
    ],
  },
  // 7. Staffing Solutions
  {
    solutionKey: "talent-staffing",
    label: "Staffing Solutions",
    icon: "Users",
    color: "#10B981",
    badge: "Flexible Staffing",
    desc: "Flexible staffing models — contract, permanent, or project-based — to scale your team on demand. 2M+ verified candidates.",
    subPages: [
      { subPageKey: "contract-staffing", label: "Contract Staffing", icon: "Briefcase", desc: "Contract professionals for 3-24 month engagements across all roles." },
      { subPageKey: "permanent-hiring", label: "Permanent Hiring", icon: "UserCheck", desc: "Full-time permanent placements with 90-day replacement guarantee." },
      { subPageKey: "temp-to-perm", label: "Temp-to-Perm Conversion", icon: "RefreshCw", desc: "Try before you buy — convert contract workers to permanent after trial period." },
      { subPageKey: "bulk-hiring", label: "Bulk & Volume Hiring", icon: "Users", desc: "Scale from 50 to 1500+ hires in weeks with our volume hiring engine." },
      { subPageKey: "industry-verticals", label: "Industry Verticals", icon: "Factory", desc: "Specialized staffing for healthcare, finance, retail, manufacturing, IT and more." },
      { subPageKey: "pricing", label: "Pricing & Margins", icon: "Wallet", desc: "Competitive margins with transparent pricing — no hidden costs." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How companies filled 1500+ roles in 7 days with our staffing engine." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Common questions about staffing models and compliance." },
    ],
  },
];

// Helper: get solution by key
export function getTalentSolution(solutionKey: string): TalentSolutionDef | undefined {
  return TALENT_SOLUTIONS_CONFIG.find(s => s.solutionKey === solutionKey);
}

// Helper: get sub-page definition
export function getTalentSubPage(solutionKey: string, subPageKey: string): TalentSubPageDef | undefined {
  const solution = getTalentSolution(solutionKey);
  return solution?.subPages.find(sp => sp.subPageKey === subPageKey);
}

// All 10 solutions for the sidebar (including Talent Sourcing + Placements + Professional Services)
export const ALL_TALENT_SOLUTIONS_SIDEBAR = [
  { key: "talent-train-to-hire", label: "Train to Hire", icon: "GraduationCap", route: "talent/talent-train-to-hire" },
  { key: "talent-hire-to-train", label: "Hire to Train", icon: "UserCheck", route: "talent/talent-hire-to-train" },
  { key: "talent-corporate-training", label: "Corporate Training", icon: "Award", route: "talent/talent-corporate-training" },
  { key: "talent-sourcing-recruitment", label: "Talent Sourcing", icon: "Search", route: "talent/talent-sourcing-recruitment" },
  { key: "talent-flexible-deployment", label: "Talent Deployment", icon: "Layers", route: "talent/talent-flexible-deployment" },
  { key: "talent-end-to-end-workforce", label: "Workforce Solutions", icon: "Globe", route: "talent/talent-end-to-end-workforce" },
  { key: "talent-assessment", label: "Talent Assessment", icon: "ClipboardCheck", route: "talent/talent-assessment" },
  { key: "talent-staffing", label: "Staffing Solutions", icon: "Users", route: "talent/talent-staffing" },
  { key: "placements", label: "Placements", icon: "TrendingUp", route: "placements" },
  { key: "professional-services", label: "Professional Services", icon: "Sparkles", route: "professional-services" },
];
