export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  bg: string;
  accent: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "technical",
    name: "Technical & Engineering",
    description: "Programming languages, frameworks, AI & architecture",
    bg: "bg-cyan-500/15",
    accent: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "functional",
    name: "Functional & Operational",
    description: "Sales, marketing, finance, operations & hiring workflows",
    bg: "bg-blue-500/15",
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "tools-technologies",
    name: "Tools & Cloud Platforms",
    description: "Cloud infrastructure, DevOps, CRM, BI & productivity tools",
    bg: "bg-emerald-500/15",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "professional",
    name: "Leadership & Management",
    description: "Project management, strategy, stakeholder alignment",
    bg: "bg-amber-500/15",
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "industry-domain",
    name: "Industry & Domain Expertise",
    description: "FinTech, SaaS, healthcare, manufacturing & procurement",
    bg: "bg-purple-500/15",
    accent: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "personal-other",
    name: "Soft Skills & Languages",
    description: "Communication, negotiation, mentoring & research",
    bg: "bg-rose-500/15",
    accent: "text-rose-600 dark:text-rose-400",
  },
];

export const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  technical: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Node.js",
    "Go",
    "Java",
    "C#",
    "SQL / PostgreSQL",
    "MongoDB",
    "GraphQL",
    "REST APIs",
    "System Design",
    "Machine Learning",
    "Generative AI / LLMs",
    "RAG & AI Agents",
    "Tailwind CSS",
  ],
  functional: [
    "Product Management",
    "B2B Sales",
    "Enterprise Procurement",
    "Talent Acquisition",
    "Technical Recruiting",
    "Performance Marketing",
    "SEO / AEO",
    "Financial Modeling",
    "Supply Chain Operations",
    "Customer Success",
    "Revenue Operations",
    "Business Intelligence",
  ],
  "tools-technologies": [
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform (GCP)",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Git & GitHub",
    "CI/CD (GitHub Actions)",
    "Salesforce",
    "HubSpot",
    "Jira & Linear",
    "Figma",
    "Power BI",
    "Tableau",
    "Snowflake",
    "Kafka",
  ],
  professional: [
    "Project Management",
    "Agile & Scrum",
    "Program Governance",
    "Executive Communication",
    "Cross-Functional Leadership",
    "Strategic Planning",
    "Vendor Negotiation",
    "Team Building & Mentoring",
    "OKR & KPI Management",
  ],
  "industry-domain": [
    "HR Tech & Talent Marketplaces",
    "Enterprise SaaS",
    "FinTech & Payments",
    "HealthTech",
    "E-Commerce & Retail",
    "EdTech",
    "Industrial Manufacturing",
    "Logistics & Supply Chain",
    "DPDP & Data Compliance",
  ],
  "personal-other": [
    "Public Speaking",
    "Technical Writing",
    "Client Relationship Management",
    "Conflict Resolution",
    "Critical Thinking",
    "Analytical Problem Solving",
    "Cross-Cultural Collaboration",
  ],
};

export const PROFICIENCY_LEVELS: string[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

export const PROFICIENCY_COLOR: Record<string, string> = {
  Beginner: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  Intermediate: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Advanced: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  Expert: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export const EXPERIENCE_TYPES: string[] = [
  "Professional",
  "Academic",
  "Freelance / Consulting",
  "Open Source",
  "Personal / Self-Taught",
];

export const CERTIFICATION_CATEGORIES: string[] = [
  "Cloud Computing",
  "Artificial Intelligence & Data",
  "Software Engineering",
  "Cybersecurity",
  "Agile & Scrum",
  "Project Management",
  "Sales & Marketing",
  "Finance & Accounting",
  "Human Resources",
  "Quality & Compliance",
];

export const CERT_ISSUING_ORGS: string[] = [
  "Amazon Web Services (AWS)",
  "Microsoft",
  "Google Cloud",
  "Scrum.org",
  "Project Management Institute (PMI)",
  "Salesforce",
  "HubSpot Academy",
  "Meta",
  "DeepLearning.AI",
  "Databricks",
  "Snowflake",
  "Cloud Native Computing Foundation (CNCF)",
  "ISC2",
  "SHRM",
  "CFA Institute",
  "jobson.id Academy",
];

export const CERT_STATUSES: string[] = [
  "Active",
  "In Progress",
  "Expired",
  "Revoked",
];

export const LICENSE_CATEGORIES: string[] = [
  "Driving License",
  "Medical / Clinical Practice",
  "Legal / Bar Council",
  "Engineering / Charter",
  "Financial Advisory (SEBI / IRDAI)",
  "Real Estate Agent (RERA)",
  "Chartered Accountancy (ICAI)",
  "Aviation / Maritime",
  "Teaching / Academic",
  "Other Statutory License",
];

export const LICENSE_AUTHORITIES: string[] = [
  "Regional Transport Office (RTO)",
  "National Medical Commission (NMC)",
  "Bar Council of India (BCI)",
  "Institute of Chartered Accountants of India (ICAI)",
  "Securities and Exchange Board of India (SEBI)",
  "IRDAI",
  "State RERA Authority",
  "Directorate General of Civil Aviation (DGCA)",
  "Institution of Engineers (India)",
];

export const LICENSE_STATUSES: string[] = [
  "Active",
  "Pending Renewal",
  "Expired",
  "Suspended",
];

export const COUNTRIES: string[] = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Germany",
  "Australia",
];

export const YEARS_OPTIONS: string[] = Array.from({ length: 26 }, (_, i) => String(i));
export const MONTHS_OPTIONS: string[] = Array.from({ length: 12 }, (_, i) => String(i));
