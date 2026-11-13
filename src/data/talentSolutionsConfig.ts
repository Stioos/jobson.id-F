// ============================================================
// TALENT SOLUTIONS CONFIG — 9 solutions × 8 sub-pages each
// Complete configuration matching jobson.id and talent_solutions.zip
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

export function normalizeTalentKey(key: string): string {
  if (!key) return "";
  const k = key.toLowerCase();
  if (k === "train-to-hire" || k === "talent-train-to-hire") return "talent-train-to-hire";
  if (k === "hire-to-train" || k === "talent-hire-to-train") return "talent-hire-to-train";
  if (k === "corporate-training" || k === "talent-corporate-training") return "talent-corporate-training";
  if (k === "talent-recruitment" || k === "talent-sourcing-recruitment" || k === "sourcing-recruitment" || k === "talent-sourcing") return "talent-sourcing-recruitment";
  if (k === "talent-deployment" || k === "talent-flexible-deployment" || k === "flexible-deployment") return "talent-flexible-deployment";
  if (k === "workforce-solutions" || k === "talent-end-to-end-workforce" || k === "end-to-end-workforce") return "talent-end-to-end-workforce";
  if (k === "talent-assessment" || k === "assessment") return "talent-assessment";
  if (k === "staffing-solutions" || k === "talent-staffing" || k === "staffing") return "talent-staffing";
  if (k === "placements" || k === "talent-placements") return "placements";
  return key;
}

export const TALENT_SOLUTIONS_CONFIG: TalentSolutionDef[] = [
  // 1. Train to Hire
  {
    solutionKey: "talent-train-to-hire",
    label: "Train to Hire",
    icon: "GraduationCap",
    color: "#0EA5E9",
    badge: "Training + Placement",
    desc: "We recruit fresh talent, upskill them through industry-aligned training, and deploy them to your team — production-ready in 8–12 weeks.",
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
    desc: "Hire promising candidates directly, then we train them on the job to meet your exact role requirements — 45% saved vs senior hiring.",
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
    desc: "Custom corporate training programs designed to upskill your existing workforce at scale — 28,000+ employees upskilled across 140+ enterprise programs.",
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

  // 4. Sourcing & Recruitment (Talent Recruitment)
  {
    solutionKey: "talent-sourcing-recruitment",
    label: "Sourcing & Recruitment",
    icon: "Search",
    color: "#0EA5E9",
    badge: "Talent Sourcing",
    desc: "AI-powered talent sourcing from 2M+ candidates. 48-hour shortlists delivered directly to your ATS with contingent pay-after-join pricing.",
    subPages: [
      { subPageKey: "ai-sourcing-engine", label: "AI Sourcing Engine", icon: "Sparkles", desc: "Search 2M+ pre-screened candidate database with instant Boolean and semantic filters." },
      { subPageKey: "candidate-pipeline", label: "Candidate Pipeline & Shortlists", icon: "Users", desc: "Calibrated shortlists delivered in under 48 hours for immediate interview loops." },
      { subPageKey: "skill-matching", label: "Skill Matching & Verification", icon: "ClipboardCheck", desc: "Graph-based skill verification and code repository analysis for every match." },
      { subPageKey: "interviews-screening", label: "Technical Screening & Loops", icon: "FileText", desc: "Structured interviews with rubric scorecards conducted by senior engineers." },
      { subPageKey: "diversity-hiring", label: "Diversity & Volume Sourcing", icon: "Globe", desc: "Inclusive sourcing pipelines ensuring representative talent across all seniority bands." },
      { subPageKey: "pricing-guarantee", label: "Pricing & 90-Day Guarantee", icon: "Wallet", desc: "Contingent success fee with 90-day replacement warranty on every hire." },
      { subPageKey: "case-studies", label: "Case Studies & Metrics", icon: "Award", desc: "How fast-growing startups and enterprises fill critical roles in 31 days median." },
      { subPageKey: "faq-resources", label: "FAQ & Sourcing Playbook", icon: "BookOpen", desc: "Everything you need to know about our sourcing algorithms and SLA coverage." },
    ],
  },

  // 5. Flexible Deployment (Talent Deployment)
  {
    solutionKey: "talent-flexible-deployment",
    label: "Flexible Deployment",
    icon: "Layers",
    color: "#10B981",
    badge: "On-Demand Talent",
    desc: "Deploy talent flexibly — contract, project-based, or on-demand pods. 1,800+ pre-vetted engineers on the bench ready in 5 days.",
    subPages: [
      { subPageKey: "contract-staffing", label: "Contract Staffing", icon: "Briefcase", desc: "Skilled contract professionals for 3-24 month engagements across technical stacks." },
      { subPageKey: "project-based", label: "Project-Based Talent", icon: "FileText", desc: "Dedicated delivery pods with full ownership, lead engineers, and clear milestones." },
      { subPageKey: "on-demand", label: "On-Demand Talent Pool", icon: "Clock", desc: "Pre-vetted talent pool ready to deploy within 48 to 72 hours of request." },
      { subPageKey: "talent-bench", label: "Talent Bench Management", icon: "Users", desc: "Maintain a bench of pre-vetted talent for fluctuating workforce demands." },
      { subPageKey: "compliance-payroll", label: "Compliance & Payroll", icon: "ShieldCheck", desc: "Full statutory compliance, payroll, and benefits managed under our Employer of Record." },
      { subPageKey: "pricing", label: "Pricing & Rates", icon: "Wallet", desc: "Transparent hourly, monthly, and pod rates with no hidden agency markups." },
      { subPageKey: "case-studies", label: "Case Studies", icon: "Award", desc: "How scale-ups flexed engineering capacity without increasing permanent headcount." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Common questions about contract types, IP rights, and compliance." },
    ],
  },

  // 6. End-to-End Workforce (Workforce Solutions)
  {
    solutionKey: "talent-end-to-end-workforce",
    label: "End-to-End Workforce",
    icon: "Globe",
    color: "#8B5CF6",
    badge: "Full Lifecycle",
    desc: "Complete workforce management from hiring to retention — one operating partner consolidating 6 vendors into 1, reducing total talent costs by 24%.",
    subPages: [
      { subPageKey: "workforce-planning", label: "Workforce Planning & Strategy", icon: "BarChart3", desc: "Data-driven workforce forecasting aligned with your corporate product roadmap." },
      { subPageKey: "sourcing-recruitment", label: "Sourcing & Recruitment", icon: "Search", desc: "End-to-end talent acquisition engine managed under unified service-level agreements." },
      { subPageKey: "onboarding-training", label: "Onboarding & Training", icon: "GraduationCap", desc: "Continuous onboarding workflows and internal academy programs for employees." },
      { subPageKey: "retention-programs", label: "Retention & Engagement", icon: "HeartHandshake", desc: "Evidence-backed retention strategies and career pathing to reduce turnover." },
      { subPageKey: "performance-management", label: "Performance Management", icon: "TrendingUp", desc: "Objective goal setting, review cycles, and growth frameworks that yield results." },
      { subPageKey: "analytics-reporting", label: "Analytics & Reporting", icon: "BarChart3", desc: "Unified executive dashboards tracking headcount, attrition, and cost-per-hire." },
      { subPageKey: "pricing", label: "Pricing & Enterprise Plans", icon: "Wallet", desc: "Enterprise SLA agreements with dedicated account executives and governance." },
      { subPageKey: "faq-resources", label: "FAQ & Resources", icon: "BookOpen", desc: "Everything about enterprise workforce management partnerships." },
    ],
  },

  // 7. Talent Assessment
  {
    solutionKey: "talent-assessment",
    label: "Talent Assessment",
    icon: "ClipboardCheck",
    color: "#EF4444",
    badge: "AI Assessment",
    desc: "AI-powered assessments across 400+ technical skills, aptitude, and job readiness. 99.2% proctoring accuracy with instant verifiable scorecards.",
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

  // 8. Staffing Solutions
  {
    solutionKey: "talent-staffing",
    label: "Staffing Solutions",
    icon: "Users",
    color: "#10B981",
    badge: "Flexible Staffing",
    desc: "Comprehensive staffing solutions across contract, contract-to-hire, permanent, and project-based staffing — 48h shortlists and 96% assignment completion.",
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

  // 9. Placements
  {
    solutionKey: "placements",
    label: "Placements",
    icon: "TrendingUp",
    color: "#D4A017",
    badge: "Career Placement",
    desc: "Dedicated placement engine connecting pre-vetted, trained talent with 500+ top employers. 9,300+ careers placed with median 21 days time to offer.",
    subPages: [
      { subPageKey: "candidate-matching", label: "AI Skill & Role Matching", icon: "Sparkles", desc: "Match verified candidate skill graphs into live, funded roles across top tech hubs." },
      { subPageKey: "interview-prep", label: "Interview Prep & Coaching", icon: "BookOpen", desc: "Free 1-on-1 technical and behavioral coaching to prepare candidates for every loop." },
      { subPageKey: "profile-verification", label: "Verified Profile & Portfolio", icon: "ClipboardCheck", desc: "Showcase verified skill assessments, code repositories, and reference checks." },
      { subPageKey: "employer-network", label: "Employer Partner Network", icon: "Building2", desc: "Connect with 500+ hiring partners actively seeking job-ready engineering talent." },
      { subPageKey: "compensation-negotiation", label: "Salary & Offer Negotiation", icon: "Wallet", desc: "Fair market compensation benchmarks and offer closure facilitation for both parties." },
      { subPageKey: "onboarding-support", label: "Onboarding & 90-Day Ramp", icon: "HeartHandshake", desc: "Follow-through check-ins and mediation to ensure lasting, friction-free placements." },
      { subPageKey: "success-stories", label: "Success Stories & Case Studies", icon: "Award", desc: "Inspiring alumni stories from campus graduates to high-growth engineering teams." },
      { subPageKey: "faq-resources", label: "FAQ & Placement Handbook", icon: "FileText", desc: "Everything you need to know about our 100% free candidate placement process." },
    ],
  },
];

// Helper: get solution by key (supports aliases)
export function getTalentSolution(solutionKey: string): TalentSolutionDef | undefined {
  const norm = normalizeTalentKey(solutionKey);
  return (
    TALENT_SOLUTIONS_CONFIG.find(s => s.solutionKey === norm) ||
    TALENT_SOLUTIONS_CONFIG.find(s => s.solutionKey === solutionKey)
  );
}

// Helper: get sub-page definition
export function getTalentSubPage(solutionKey: string, subPageKey: string): TalentSubPageDef | undefined {
  const solution = getTalentSolution(solutionKey);
  return solution?.subPages.find(sp => sp.subPageKey === subPageKey);
}

// All 10 solutions for the sidebar
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
