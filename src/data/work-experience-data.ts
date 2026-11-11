export const INDUSTRIES: string[] = [
  "Information Technology & Software",
  "Artificial Intelligence & Data Science",
  "Cloud & Cybersecurity",
  "Financial Services & FinTech",
  "Healthcare & Pharmaceuticals",
  "E-Commerce & Retail",
  "EdTech & Training",
  "Manufacturing & Industrial Automation",
  "Logistics & Supply Chain",
  "Consulting & Professional Services",
  "Telecommunications",
  "Automotive & EV",
  "Energy, Renewables & Utilities",
  "Media, Marketing & Advertising",
  "Real Estate & PropTech",
  "Staffing & Recruitment",
];

export const COMPANY_TYPES: string[] = [
  "Private Limited",
  "Public Limited / Listed MNC",
  "Startup (Seed / Series A-C)",
  "Unicorn / Late-Stage Startup",
  "Government / PSU",
  "Consultancy / Agency",
  "Non-Profit / NGO",
  "Proprietorship / Partnership",
  "Self-Employed / Freelance",
];

export const COMPANY_SIZES: string[] = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1,000 employees",
  "1,001–5,000 employees",
  "5,001–10,000 employees",
  "10,000+ employees",
];

export const DEPARTMENTS: string[] = [
  "Engineering & Technology",
  "Product Management",
  "Data Science & AI",
  "Design & UX",
  "Sales & Business Development",
  "Marketing & Growth",
  "Human Resources & Talent Acquisition",
  "Operations & Supply Chain",
  "Finance & Accounting",
  "Customer Success & Support",
  "Legal, Risk & Compliance",
  "Executive Leadership",
];

export const FUNCTIONAL_AREAS: string[] = [
  "Full-Stack Development",
  "Frontend Engineering",
  "Backend & Distributed Systems",
  "Cloud Architecture & DevOps",
  "AI / ML & Agentic Systems",
  "Quality Assurance & Testing",
  "Product Strategy & Roadmapping",
  "Enterprise B2B Sales",
  "Digital & AI Marketing",
  "Technical Recruitment / RPO",
  "Corporate L&D & Skilling",
  "Financial Planning & Analysis",
];

export const JOB_LEVELS: string[] = [
  "Intern / Trainee",
  "Entry Level / Junior",
  "Associate",
  "Mid-Level / Specialist",
  "Senior",
  "Lead / Staff",
  "Principal / Architect",
  "Manager",
  "Senior Manager",
  "Director",
  "Vice President (VP)",
  "C-Level / Founder",
];

export const EMPLOYMENT_TYPES: string[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance / Consulting",
  "Internship",
  "Apprenticeship",
];

export const WORK_MODES: string[] = [
  "Remote",
  "Hybrid",
  "On-site",
];

export const JOB_CATEGORIES: string[] = [
  "Permanent / Salaried",
  "Contractual / Project-Based",
  "Retainer / Advisory",
  "Commission / Channel Partner",
  "Internship / Fellowship",
];

export interface CurrencyOption {
  code: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", label: "INR (₹)" },
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "SGD", label: "SGD (S$)" },
  { code: "AED", label: "AED (د.إ)" },
];

export const SALARY_FREQUENCIES: string[] = [
  "Per Annum",
  "Per Month",
  "Per Hour",
  "Per Project",
];

export const NOTICE_PERIODS: string[] = [
  "Immediate / Currently Serving",
  "15 Days",
  "30 Days (1 Month)",
  "45 Days",
  "60 Days (2 Months)",
  "90 Days (3 Months)",
  "Not Applicable",
];

export const REASONS_FOR_LEAVING: string[] = [
  "Career Growth & New Challenges",
  "Better Compensation & Role Scope",
  "Relocation",
  "Higher Education / Upskilling",
  "Contract Completed",
  "Company Restructuring / Layoff",
  "Health / Personal Reasons",
  "Entrepreneurship",
];

export const BENEFITS: string[] = [
  "Health & Medical Insurance",
  "ESOPs / Equity",
  "Performance Bonus",
  "Flexible Working Hours",
  "Remote / Work From Home Allowance",
  "Learning & Certification Budget",
  "Provident Fund (EPF) & Gratuity",
  "Paid Parental Leave",
  "Relocation Assistance",
  "Wellness & Gym Membership",
];

export const SKILLS_TECH: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Terraform",
  "GraphQL",
  "REST APIs",
  "Tailwind CSS",
  "LangChain",
  "System Design",
  "CI/CD",
  "Git",
  "Agile / Scrum",
  "Figma",
  "Salesforce",
  "Power BI",
];

export const KNOWN_COMPANIES: string[] = [
  "JOBSONN Technologies",
  "Tata Consultancy Services (TCS)",
  "Infosys",
  "Wipro",
  "HCLTech",
  "Accenture",
  "Flipkart",
  "Razorpay",
  "Swiggy",
  "Zomato",
  "Zerodha",
  "Freshworks",
  "Zoho Corporation",
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Adobe",
  "Oracle",
  "IBM",
];

export const DOCUMENT_TYPES: string[] = [
  "Offer Letter",
  "Experience Letter",
  "Relieving Letter",
  "Payslip / Salary Slip",
  "Appraisal Letter",
  "Form 16",
  "Employment Contract",
];

export const VERIFICATION_STATUSES: string[] = [
  "Verified",
  "Pending",
  "Under Review",
  "Self-Declared",
];

export const VERIFICATION_COLOR: Record<string, string> = {
  Verified: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "Under Review": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "Self-Declared": "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};
