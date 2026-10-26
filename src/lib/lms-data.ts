import type {
  TrainingCompany,
  CorporateClient,
  TrainingCourse,
  LearningPath,
  Cohort,
  LiveSession,
  Trainer,
  TrainingAssessment,
  Question,
  AssessmentAttempt,
  Certificate,
  CertificateTemplate,
  SkillFramework,
  SkillGap,
  LearnerEnrollment,
  TrainingProgram,
  ComplianceTrack,
  Survey,
  GamificationConfig,
  LearnerAchievement,
  TrainingBudget,
  TrainingInvoice,
  ContentLibraryItem,
  WorkflowAutomation,
} from "./types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString();

// ============================================================
// TRAINING COMPANY
// ============================================================
export const trainingCompany: TrainingCompany = {
  id: "tc_001",
  name: "SkillForge Academy",
  slug: "skillforge-academy",
  logo: "SF",
  tagline: "Corporate Training That Drives Measurable Business Outcomes",
  about:
    "SkillForge Academy is a premier corporate training company serving 120+ enterprises across India and APAC. We deliver instructor-led, blended, and self-paced learning programs in technology, leadership, compliance, and professional skills. Our trainers are industry practitioners with 10+ years of experience.",
  specialties: [
    "Technology & Engineering",
    "Leadership & Management",
    "Compliance & Regulatory",
    "Sales & Customer Success",
    "Data & AI",
    "Cloud & DevOps",
  ],
  verified: true,
  rating: 4.7,
  reviewCount: 2140,
  corporateClients: 124,
  learnersTrained: 48200,
  coursesCount: 186,
  trainersCount: 64,
  founded: 2014,
  headquarters: "Bengaluru, India",
  website: "https://skillforge.academy",
  contactEmail: "corporate@skillforge.academy",
  contactPhone: "+91 80 4567 8900",
  gstin: "29SKILLF0RGE1234A1Z5",
  accreditation: ["NSDC Approved", "ISO 29993 Certified", "ATD Elite Provider"],
};

// ============================================================
// CORPORATE CLIENTS (the companies the training company serves)
// ============================================================
export const corporateClients: CorporateClient[] = [
  {
    id: "cc_001",
    name: "TechCorp India",
    logo: "TC",
    industry: "Information Technology",
    size: "1001-5000",
    location: "Bengaluru",
    contactName: "Rohan Mehta",
    contactEmail: "rohan.mehta@techcorp.com",
    contactPhone: "+91 98765 43210",
    contractStart: "2024-01-01",
    contractEnd: "2024-12-31",
    contractValue: 4800000,
    currency: "INR",
    employeesEnrolled: 1200,
    coursesAssigned: 24,
    status: "active",
    healthScore: 92,
    renewalDate: "2025-01-15",
    assignedAccountManager: "Divya Sharma",
  },
  {
    id: "cc_002",
    name: "FinEdge Solutions",
    logo: "FE",
    industry: "Financial Services / Fintech",
    size: "501-1000",
    location: "Mumbai",
    contactName: "Vikram Joshi",
    contactEmail: "vikram@finedge.io",
    contactPhone: "+91 98200 11111",
    contractStart: "2024-03-01",
    contractEnd: "2025-02-28",
    contractValue: 2200000,
    currency: "INR",
    employeesEnrolled: 480,
    coursesAssigned: 16,
    status: "active",
    healthScore: 87,
    renewalDate: "2025-03-01",
    assignedAccountManager: "Divya Sharma",
  },
  {
    id: "cc_003",
    name: "MediCore Health",
    logo: "MC",
    industry: "Healthcare / HealthTech",
    size: "501-1000",
    location: "Chennai",
    contactName: "Dr. Lakshmi Iyer",
    contactEmail: "lakshmi@medicore.health",
    contactPhone: "+91 98400 22222",
    contractStart: "2024-04-01",
    contractEnd: "2025-03-31",
    contractValue: 1800000,
    currency: "INR",
    employeesEnrolled: 620,
    coursesAssigned: 12,
    status: "active",
    healthScore: 78,
    renewalDate: "2025-04-01",
    assignedAccountManager: "Karthik Nair",
  },
  {
    id: "cc_004",
    name: "GreenLeaf Energy",
    logo: "GL",
    industry: "Renewable Energy",
    size: "201-500",
    location: "Pune",
    contactName: "Arjun Patel",
    contactEmail: "arjun@greenleaf.energy",
    contactPhone: "+91 99000 33333",
    contractStart: "2024-06-01",
    contractEnd: "2025-05-31",
    contractValue: 900000,
    currency: "INR",
    employeesEnrolled: 210,
    coursesAssigned: 8,
    status: "trial",
    healthScore: 71,
    renewalDate: "2025-06-01",
    assignedAccountManager: "Karthik Nair",
  },
  {
    id: "cc_005",
    name: "EduVerse Learning",
    logo: "EV",
    industry: "EdTech",
    size: "201-500",
    location: "Gurugram",
    contactName: "Neha Kapoor",
    contactEmail: "neha@eduverse.in",
    contactPhone: "+91 99100 44444",
    contractStart: "2024-02-01",
    contractEnd: "2025-01-31",
    contractValue: 1500000,
    currency: "INR",
    employeesEnrolled: 260,
    coursesAssigned: 14,
    status: "active",
    healthScore: 84,
    renewalDate: "2025-02-01",
    assignedAccountManager: "Divya Sharma",
  },
  {
    id: "cc_006",
    name: "LogiMove Logistics",
    logo: "LM",
    industry: "Logistics & Supply Chain",
    size: "1001-5000",
    location: "Delhi NCR",
    contactName: "Suresh Kumar",
    contactEmail: "suresh@logimove.in",
    contactPhone: "+91 99200 55555",
    contractStart: "2023-07-01",
    contractEnd: "2024-06-30",
    contractValue: 1200000,
    currency: "INR",
    employeesEnrolled: 800,
    coursesAssigned: 10,
    status: "expired",
    healthScore: 45,
    renewalDate: "2024-07-01",
    assignedAccountManager: "Karthik Nair",
  },
];

// ============================================================
// TRAINERS
// ============================================================
export const trainers: Trainer[] = [
  { id: "tr_001", name: "Dr. Ananya Iyer", email: "ananya@skillforge.academy", avatarColor: "oklch(0.6 0.13 300)", expertise: ["React", "TypeScript", "System Design", "Web Performance"], rating: 4.9, sessionsConducted: 184, learnersTrained: 3200, type: "internal", status: "active", bio: "Ex-Google Staff Engineer. 15 years building large-scale web platforms.", certifications: ["AWS Solutions Architect Professional", "Google Cloud Professional"], hourlyRate: 8000, currency: "INR" },
  { id: "tr_002", name: "Rajesh Kumar", email: "rajesh@skillforge.academy", avatarColor: "oklch(0.52 0.11 162)", expertise: ["Kubernetes", "DevOps", "AWS", "Terraform", "SRE"], rating: 4.8, sessionsConducted: 142, learnersTrained: 2400, type: "internal", status: "active", bio: "CNCF Ambassador. Built DevOps practices at 3 unicorns.", certifications: ["CKA", "CKAD", "AWS DevOps Pro"], hourlyRate: 7500, currency: "INR" },
  { id: "tr_003", name: "Meera Krishnan", email: "meera@skillforge.academy", avatarColor: "oklch(0.55 0.13 200)", expertise: ["Leadership", "Communication", "Executive Coaching", "Conflict Resolution"], rating: 4.7, sessionsConducted: 210, learnersTrained: 4100, type: "internal", status: "active", bio: "ICF PCC certified coach. Former CHRO at a Fortune 500.", certifications: ["ICF PCC", "DISC Certified"], hourlyRate: 9000, currency: "INR" },
  { id: "tr_004", name: "Vikram Rao", email: "vikram@skillforge.academy", avatarColor: "oklch(0.58 0.2 25)", expertise: ["Data Science", "Python", "Machine Learning", "MLOps"], rating: 4.6, sessionsConducted: 98, learnersTrained: 1800, type: "internal", status: "active", bio: "PhD in ML from IISc. 12 years in data science leadership.", certifications: ["Google ML Engineer", "AWS ML Specialty"], hourlyRate: 8500, currency: "INR" },
  { id: "tr_005", name: "Sushma Reddy", email: "sushma@skillforge.academy", avatarColor: "oklch(0.62 0.16 155)", expertise: ["Compliance", "Information Security", "DPDP Act", "ISO 27001"], rating: 4.8, sessionsConducted: 76, learnersTrained: 5200, type: "external", status: "active", bio: "CISO turned trainer. 20 years in cybersecurity and compliance.", certifications: ["CISM", "CISA", "ISO 27001 LA"], hourlyRate: 7000, currency: "INR" },
  { id: "tr_006", name: "Arjun Nair", email: "arjun@skillforge.academy", avatarColor: "oklch(0.6 0.16 70)", expertise: ["Sales", "Negotiation", "Account Management", "B2B Sales"], rating: 4.5, sessionsConducted: 120, learnersTrained: 2800, type: "internal", status: "on_leave", bio: "Ex-Sales VP at Salesforce. Built 5 sales teams from scratch.", certifications: ["Miller Heiman Certified"], hourlyRate: 6500, currency: "INR" },
];

// ============================================================
// COURSES
// ============================================================
export const trainingCourses: TrainingCourse[] = [
  {
    id: "tc_c001", code: "SF-REACT-301", name: "Advanced React 19 & Next.js for Production",
    description: "Master React 19 concurrent features, server components, suspense, and Next.js 16 app router. Build production-grade apps with performance budgets, accessibility, and testing.",
    category: "Technology", subcategory: "Frontend", difficulty: "advanced", durationMinutes: 1800, language: "English",
    instructorId: "tr_001", instructorName: "Dr. Ananya Iyer",
    skills: ["React", "TypeScript", "Next.js", "Performance", "Accessibility"],
    objectives: ["Build concurrent React apps with suspense & transitions", "Implement server components effectively", "Optimize Core Web Vitals", "Design scalable component architectures"],
    prerequisites: ["2+ years React", "Solid JavaScript & TypeScript"],
    modules: [
      { id: "m1", title: "React 19 Fundamentals", lessons: [
        { id: "l1", title: "Concurrent Rendering Deep Dive", type: "video", durationMinutes: 35 },
        { id: "l2", title: "Suspense & Error Boundaries", type: "video", durationMinutes: 28 },
        { id: "l3", title: "Transitions & useDeferredValue", type: "video", durationMinutes: 32 },
        { id: "l4", title: "Quiz: Concurrent React", type: "quiz", durationMinutes: 15 },
      ], order: 1 },
      { id: "m2", title: "Server Components & Next.js 16", lessons: [
        { id: "l5", title: "Server Components Explained", type: "video", durationMinutes: 40 },
        { id: "l6", title: "App Router Data Fetching", type: "video", durationMinutes: 35 },
        { id: "l7", title: "Streaming & Partial Prerendering", type: "video", durationMinutes: 30 },
        { id: "l8", title: "Hands-on: Build a Dashboard", type: "project", durationMinutes: 90 },
      ], order: 2 },
      { id: "m3", title: "Performance & Testing", lessons: [
        { id: "l9", title: "Performance Budgets", type: "video", durationMinutes: 25 },
        { id: "l10", title: "Testing Strategies", type: "video", durationMinutes: 30 },
        { id: "l11", title: "Final Assessment", type: "quiz", durationMinutes: 45 },
      ], order: 3 },
    ],
    materials: [
      { id: "mat1", type: "pdf", title: "Course Handbook", url: "#" },
      { id: "mat2", type: "link", title: "Starter Code Repository", url: "#" },
    ],
    visibility: "public", status: "published", tags: ["react", "nextjs", "frontend", "performance"],
    version: "3.2", enrollments: 1840, completionRate: 78, avgScore: 84, rating: 4.8, ratingCount: 412,
    hasCertificate: true, price: 14999, currency: "INR", thumbnailColor: "oklch(0.55 0.13 165)", thumbnailIcon: "Code",
    createdAt: daysAgo(120), updatedAt: daysAgo(7),
  },
  {
    id: "tc_c002", code: "SF-K8S-201", name: "Kubernetes for Developers (CKA Bootcamp)",
    description: "Hands-on Kubernetes course covering pods, deployments, services, networking, storage, security, and observability. Includes full CKA exam preparation.",
    category: "Technology", subcategory: "DevOps", difficulty: "intermediate", durationMinutes: 2400, language: "English",
    instructorId: "tr_002", instructorName: "Rajesh Kumar",
    skills: ["Kubernetes", "Docker", "DevOps", "AWS", "Networking"],
    objectives: ["Deploy & operate K8s clusters", "Pass the CKA exam", "Implement GitOps workflows", "Troubleshoot production incidents"],
    prerequisites: ["Linux fundamentals", "Docker basics"],
    modules: [
      { id: "m1", title: "K8s Architecture & Core Resources", lessons: [
        { id: "l1", title: "Architecture Overview", type: "video", durationMinutes: 30 },
        { id: "l2", title: "Pods, Deployments, ReplicaSets", type: "video", durationMinutes: 45 },
        { id: "l3", title: "Lab: Deploy Your First App", type: "assignment", durationMinutes: 60 },
      ], order: 1 },
      { id: "m2", title: "Networking & Storage", lessons: [
        { id: "l4", title: "Services & Ingress", type: "video", durationMinutes: 40 },
        { id: "l5", title: "Persistent Volumes", type: "video", durationMinutes: 35 },
        { id: "l6", title: "Network Policies & Security", type: "video", durationMinutes: 38 },
      ], order: 2 },
      { id: "m3", title: "CKA Exam Prep", lessons: [
        { id: "l7", title: "Exam Strategy", type: "video", durationMinutes: 20 },
        { id: "l8", title: "Practice Exam (7 tasks)", type: "quiz", durationMinutes: 120 },
      ], order: 3 },
    ],
    materials: [{ id: "mat1", type: "pdf", title: "CKA Cheat Sheet", url: "#" }],
    visibility: "public", status: "published", tags: ["kubernetes", "devops", "cka", "cloud-native"],
    version: "5.1", enrollments: 2640, completionRate: 82, avgScore: 79, rating: 4.7, ratingCount: 580,
    hasCertificate: true, price: 18999, currency: "INR", thumbnailColor: "oklch(0.6 0.14 200)", thumbnailIcon: "Cloud",
    createdAt: daysAgo(180), updatedAt: daysAgo(3),
  },
  {
    id: "tc_c003", code: "SF-LDR-101", name: "First-Time Manager Bootcamp",
    description: "Transition from individual contributor to confident leader. Covers delegation, feedback, 1:1s, conflict resolution, and team performance management.",
    category: "Leadership", subcategory: "Management", difficulty: "intermediate", durationMinutes: 1200, language: "English",
    instructorId: "tr_003", instructorName: "Meera Krishnan",
    skills: ["Leadership", "Communication", "Delegation", "Feedback", "Performance Management"],
    objectives: ["Transition from IC to manager mindset", "Conduct effective 1:1s & feedback", "Delegate with accountability", "Manage team conflict constructively"],
    prerequisites: ["Promoted to / about to become people manager"],
    modules: [
      { id: "m1", title: "The Manager Mindset", lessons: [
        { id: "l1", title: "IC to Manager: The Shift", type: "video", durationMinutes: 25 },
        { id: "l2", title: "Understanding Your Team", type: "video", durationMinutes: 30 },
        { id: "l3", title: "Reflection Exercise", type: "assignment", durationMinutes: 40 },
      ], order: 1 },
      { id: "m2", title: "Core Management Practices", lessons: [
        { id: "l4", title: "The Art of 1:1s", type: "video", durationMinutes: 35 },
        { id: "l5", title: "Giving Feedback (SBI Model)", type: "video", durationMinutes: 28 },
        { id: "l6", title: "Delegation Framework", type: "video", durationMinutes: 30 },
        { id: "l7", title: "Roleplay: Difficult Conversation", type: "live", durationMinutes: 60 },
      ], order: 2 },
    ],
    materials: [{ id: "mat1", type: "pdf", title: "Manager's Toolkit (templates)", url: "#" }],
    visibility: "public", status: "published", tags: ["leadership", "management", "soft-skills"],
    version: "2.0", enrollments: 3120, completionRate: 85, avgScore: 88, rating: 4.9, ratingCount: 720,
    hasCertificate: true, price: 12999, currency: "INR", thumbnailColor: "oklch(0.58 0.2 25)", thumbnailIcon: "Users",
    createdAt: daysAgo(90), updatedAt: daysAgo(5),
  },
  {
    id: "tc_c004", code: "SF-ML-401", name: "Production Machine Learning with MLOps",
    description: "Build, deploy, and monitor ML systems in production. Covers model lifecycle, feature stores, monitoring, drift detection, and MLOps best practices.",
    category: "Technology", subcategory: "Data & AI", difficulty: "expert", durationMinutes: 2100, language: "English",
    instructorId: "tr_004", instructorName: "Vikram Rao",
    skills: ["Python", "Machine Learning", "MLOps", "Model Deployment", "Monitoring"],
    objectives: ["Design ML system architectures", "Implement feature stores & pipelines", "Deploy models with CI/CD", "Monitor for drift & performance decay"],
    prerequisites: ["Python proficiency", "ML fundamentals", "Basic Docker"],
    modules: [
      { id: "m1", title: "ML System Design", lessons: [
        { id: "l1", title: "ML System Lifecycle", type: "video", durationMinutes: 40 },
        { id: "l2", title: "Feature Stores", type: "video", durationMinutes: 35 },
      ], order: 1 },
      { id: "m2", title: "Deployment & Monitoring", lessons: [
        { id: "l3", title: "Model Serving Patterns", type: "video", durationMinutes: 45 },
        { id: "l4", title: "Drift Detection", type: "video", durationMinutes: 30 },
        { id: "l5", title: "Capstone: End-to-End ML Pipeline", type: "project", durationMinutes: 180 },
      ], order: 2 },
    ],
    materials: [],
    visibility: "restricted", status: "published", tags: ["ml", "mlops", "ai", "python"],
    version: "1.3", enrollments: 890, completionRate: 71, avgScore: 76, rating: 4.6, ratingCount: 180,
    hasCertificate: true, price: 24999, currency: "INR", thumbnailColor: "oklch(0.6 0.13 300)", thumbnailIcon: "Brain",
    createdAt: daysAgo(60), updatedAt: daysAgo(2),
  },
  {
    id: "tc_c005", code: "SF-DPDP-100", name: "DPDP Act & Data Privacy Compliance",
    description: "Comprehensive training on India's Digital Personal Data Protection (DPDP) Act 2023. Mandatory for all data handlers, DPOs, and compliance officers.",
    category: "Compliance", subcategory: "Data Privacy", difficulty: "intermediate", durationMinutes: 480, language: "English",
    instructorId: "tr_005", instructorName: "Sushma Reddy",
    skills: ["DPDP Act", "Data Privacy", "Compliance", "Information Security"],
    objectives: ["Understand DPDP Act requirements", "Implement consent management", "Conduct DPIAs", "Prepare for regulatory audits"],
    prerequisites: [],
    modules: [
      { id: "m1", title: "DPDP Act Fundamentals", lessons: [
        { id: "l1", title: "Key Definitions & Scope", type: "video", durationMinutes: 25 },
        { id: "l2", title: "Data Principal Rights", type: "video", durationMinutes: 30 },
        { id: "l3", title: "Consent Management", type: "video", durationMinutes: 28 },
      ], order: 1 },
      { id: "m2", title: "Implementation", lessons: [
        { id: "l4", title: "Data Inventory & Mapping", type: "video", durationMinutes: 35 },
        { id: "l5", title: "DPIA Workshop", type: "assignment", durationMinutes: 60 },
        { id: "l6", title: "Final Compliance Quiz", type: "quiz", durationMinutes: 30 },
      ], order: 2 },
    ],
    materials: [{ id: "mat1", type: "pdf", title: "DPDP Compliance Checklist", url: "#" }],
    visibility: "public", status: "published", tags: ["compliance", "dpdp", "privacy", "mandatory"],
    version: "2.1", enrollments: 5400, completionRate: 92, avgScore: 86, rating: 4.7, ratingCount: 980,
    hasCertificate: true, price: 4999, currency: "INR", isMandatory: true, isCompliance: true,
    thumbnailColor: "oklch(0.55 0.13 200)", thumbnailIcon: "ShieldCheck",
    createdAt: daysAgo(200), updatedAt: daysAgo(1),
  },
  {
    id: "tc_c006", code: "SF-SALES-201", name: "Consultative B2B Sales Masterclass",
    description: "Modern B2B sales techniques — from prospecting to closing. SPIN selling, MEDDIC qualification, value-based selling, and negotiation.",
    category: "Sales", subcategory: "B2B Sales", difficulty: "intermediate", durationMinutes: 900, language: "English",
    instructorId: "tr_006", instructorName: "Arjun Nair",
    skills: ["B2B Sales", "Negotiation", "Prospecting", "Account Management"],
    objectives: ["Master SPIN & MEDDIC frameworks", "Build a prospecting engine", "Run discovery that converts", "Negotiate value-based deals"],
    prerequisites: ["6+ months in sales"],
    modules: [
      { id: "m1", title: "Prospecting & Qualification", lessons: [
        { id: "l1", title: "Ideal Customer Profile", type: "video", durationMinutes: 25 },
        { id: "l2", title: "Outbound That Works", type: "video", durationMinutes: 30 },
        { id: "l3", title: "MEDDIC Qualification", type: "video", durationMinutes: 35 },
      ], order: 1 },
      { id: "m2", title: "Discovery & Closing", lessons: [
        { id: "l4", title: "SPIN Selling", type: "video", durationMinutes: 40 },
        { id: "l5", title: "Value-Based Negotiation", type: "video", durationMinutes: 35 },
        { id: "l6", title: "Roleplay: Closing a Deal", type: "live", durationMinutes: 60 },
      ], order: 2 },
    ],
    materials: [],
    visibility: "public", status: "published", tags: ["sales", "b2b", "negotiation"],
    version: "1.5", enrollments: 1680, completionRate: 80, avgScore: 82, rating: 4.5, ratingCount: 340,
    hasCertificate: false, price: 9999, currency: "INR", thumbnailColor: "oklch(0.6 0.16 70)", thumbnailIcon: "TrendingUp",
    createdAt: daysAgo(75), updatedAt: daysAgo(10),
  },
  {
    id: "tc_c007", code: "SF-SEC-100", name: "Information Security Awareness (ISO 27001)",
    description: "Mandatory security awareness training covering phishing, password hygiene, social engineering, data handling, and incident reporting. ISO 27001 aligned.",
    category: "Compliance", subcategory: "Information Security", difficulty: "beginner", durationMinutes: 180, language: "English",
    instructorId: "tr_005", instructorName: "Sushma Reddy",
    skills: ["Information Security", "Phishing", "Security Awareness"],
    objectives: ["Identify phishing & social engineering", "Practice secure password hygiene", "Handle data per ISO 27001", "Report security incidents"],
    prerequisites: [],
    modules: [
      { id: "m1", title: "Security Fundamentals", lessons: [
        { id: "l1", title: "Threat Landscape", type: "video", durationMinutes: 15 },
        { id: "l2", title: "Phishing & Social Engineering", type: "video", durationMinutes: 20 },
        { id: "l3", title: "Password Security", type: "video", durationMinutes: 15 },
        { id: "l4", title: "Final Assessment", type: "quiz", durationMinutes: 20 },
      ], order: 1 },
    ],
    materials: [],
    visibility: "public", status: "published", tags: ["security", "compliance", "iso27001", "mandatory"],
    version: "4.0", enrollments: 8200, completionRate: 95, avgScore: 89, rating: 4.4, ratingCount: 1450,
    hasCertificate: true, price: 1999, currency: "INR", isMandatory: true, isCompliance: true,
    thumbnailColor: "oklch(0.58 0.2 25)", thumbnailIcon: "Lock",
    createdAt: daysAgo(300), updatedAt: daysAgo(15),
  },
  {
    id: "tc_c008", code: "SF-EXEC-501", name: "Executive Leadership Program",
    description: "Advanced leadership program for senior leaders and CXOs. Strategic thinking, organizational design, change management, and board communication.",
    category: "Leadership", subcategory: "Executive", difficulty: "expert", durationMinutes: 1800, language: "English",
    instructorId: "tr_003", instructorName: "Meera Krishnan",
    skills: ["Executive Leadership", "Strategy", "Change Management", "Organizational Design"],
    objectives: ["Develop strategic thinking frameworks", "Lead organizational change", "Communicate at board level", "Build high-performing leadership teams"],
    prerequisites: ["10+ years experience", "Senior leadership role"],
    modules: [
      { id: "m1", title: "Strategic Leadership", lessons: [
        { id: "l1", title: "Strategy Formulation", type: "video", durationMinutes: 45 },
        { id: "l2", title: "Organizational Design", type: "video", durationMinutes: 40 },
        { id: "l3", title: "Change Management Models", type: "video", durationMinutes: 35 },
      ], order: 1 },
      { id: "m2", title: "Executive Effectiveness", lessons: [
        { id: "l4", title: "Board Communication", type: "video", durationMinutes: 30 },
        { id: "l5", title: "Executive Presence", type: "live", durationMinutes: 90 },
        { id: "l6", title: "Capstone Project", type: "project", durationMinutes: 120 },
      ], order: 2 },
    ],
    materials: [],
    visibility: "restricted", status: "published", tags: ["leadership", "executive", "cxo"],
    version: "1.1", enrollments: 420, completionRate: 88, avgScore: 91, rating: 4.9, ratingCount: 95,
    hasCertificate: true, price: 89999, currency: "INR", thumbnailColor: "oklch(0.52 0.11 162)", thumbnailIcon: "Crown",
    createdAt: daysAgo(45), updatedAt: daysAgo(3),
  },
];

// Draft course
export const draftCourses: TrainingCourse[] = [
  {
    id: "tc_c009", code: "SF-GO-301", name: "Production Go Microservices",
    description: "Draft — building out modules.", category: "Technology", subcategory: "Backend", difficulty: "advanced",
    durationMinutes: 1500, language: "English", instructorId: "tr_002", instructorName: "Rajesh Kumar",
    skills: ["Go", "Microservices", "gRPC"], objectives: [], prerequisites: [], modules: [], materials: [],
    visibility: "private", status: "draft", tags: ["go", "backend"], version: "0.1", enrollments: 0,
    completionRate: 0, avgScore: 0, rating: 0, ratingCount: 0, hasCertificate: false, price: 0, currency: "INR",
    thumbnailColor: "oklch(0.6 0.14 200)", thumbnailIcon: "Code", createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
];

// ============================================================
// LEARNING PATHS
// ============================================================
export const learningPaths: LearningPath[] = [
  { id: "lp_001", name: "Full-Stack Developer Track", description: "Complete journey from frontend to backend to deployment.", category: "Technology", courses: [{ courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", isMandatory: true, order: 1 }, { courseId: "tc_c002", courseName: "Kubernetes for Developers", isMandatory: false, order: 2 }], totalDurationMinutes: 4200, enrolledCount: 680, completionRate: 64, isMandatory: false, skills: ["React", "Next.js", "Kubernetes", "DevOps"], type: "career", thumbnailColor: "oklch(0.55 0.13 165)", thumbnailIcon: "Route" },
  { id: "lp_002", name: "New Manager Onboarding", description: "30-day onboarding path for first-time managers.", category: "Leadership", courses: [{ courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", isMandatory: true, order: 1 }, { courseId: "tc_c005", courseName: "DPDP Act Compliance", isMandatory: true, order: 2 }, { courseId: "tc_c007", courseName: "Information Security Awareness", isMandatory: true, order: 3 }], totalDurationMinutes: 1860, enrolledCount: 340, completionRate: 81, isMandatory: true, skills: ["Leadership", "Compliance", "Security"], type: "onboarding", thumbnailColor: "oklch(0.58 0.2 25)", thumbnailIcon: "Route", deadline: daysAhead(30) },
  { id: "lp_003", name: "Mandatory Compliance Suite 2024", description: "All mandatory compliance training for employees.", category: "Compliance", courses: [{ courseId: "tc_c005", courseName: "DPDP Act & Data Privacy", isMandatory: true, order: 1 }, { courseId: "tc_c007", courseName: "Information Security Awareness", isMandatory: true, order: 2 }], totalDurationMinutes: 660, enrolledCount: 5400, completionRate: 93, isMandatory: true, skills: ["Compliance", "Security", "Privacy"], type: "compliance", thumbnailColor: "oklch(0.55 0.13 200)", thumbnailIcon: "ShieldCheck", deadline: daysAhead(45) },
  { id: "lp_004", name: "Data Science Career Path", description: "From Python to production ML systems.", category: "Technology", courses: [{ courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", isMandatory: true, order: 1 }], totalDurationMinutes: 2100, enrolledCount: 420, completionRate: 68, isMandatory: false, skills: ["Python", "ML", "MLOps"], type: "career", thumbnailColor: "oklch(0.6 0.13 300)", thumbnailIcon: "Brain" },
  { id: "lp_005", name: "Sales Excellence Program", description: "End-to-end B2B sales mastery.", category: "Sales", courses: [{ courseId: "tc_c006", courseName: "Consultative B2B Sales Masterclass", isMandatory: true, order: 1 }], totalDurationMinutes: 900, enrolledCount: 280, completionRate: 76, isMandatory: false, skills: ["Sales", "Negotiation"], type: "skill", thumbnailColor: "oklch(0.6 0.16 70)", thumbnailIcon: "TrendingUp" },
];

// ============================================================
// COHORTS
// ============================================================
export const cohorts: Cohort[] = [
  { id: "co_001", name: "TechCorp — React Bootcamp Batch 3", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", trainerId: "tr_001", trainerName: "Dr. Ananya Iyer", clientId: "cc_001", clientName: "TechCorp India", learnerCount: 32, startDate: daysAgo(7), endDate: daysAhead(21), progress: 35, status: "active", attendanceRate: 94, schedule: "Tue/Thu 7-9 PM IST", modality: "online" },
  { id: "co_002", name: "FinEdge — CKA Prep Batch 1", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", trainerId: "tr_002", trainerName: "Rajesh Kumar", clientId: "cc_002", clientName: "FinEdge Solutions", learnerCount: 18, startDate: daysAgo(14), endDate: daysAhead(42), progress: 52, status: "active", attendanceRate: 89, schedule: "Mon/Wed/Fri 6-8 PM IST", modality: "hybrid", location: "Mumbai + Online" },
  { id: "co_003", name: "MediCore — New Manager Cohort Q4", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", trainerId: "tr_003", trainerName: "Meera Krishnan", clientId: "cc_003", clientName: "MediCore Health", learnerCount: 24, startDate: daysAhead(3), endDate: daysAhead(31), progress: 0, status: "upcoming", attendanceRate: 0, schedule: "Sat 10 AM - 1 PM IST", modality: "offline", location: "Chennai HQ" },
  { id: "co_004", name: "EduVerse — DPDP Compliance Batch 2", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy Compliance", trainerId: "tr_005", trainerName: "Sushma Reddy", clientId: "cc_005", clientName: "EduVerse Learning", learnerCount: 85, startDate: daysAgo(21), endDate: daysAgo(7), progress: 100, status: "completed", attendanceRate: 96, schedule: "Self-paced + 2 live Q&A", modality: "online" },
  { id: "co_005", name: "GreenLeaf — Security Awareness (All Hands)", courseId: "tc_c007", courseName: "Information Security Awareness (ISO 27001)", trainerId: "tr_005", trainerName: "Sushma Reddy", clientId: "cc_004", clientName: "GreenLeaf Energy", learnerCount: 210, startDate: daysAgo(5), endDate: daysAhead(9), progress: 68, status: "active", attendanceRate: 91, schedule: "Self-paced", modality: "online" },
];

// ============================================================
// LIVE SESSIONS
// ============================================================
export const liveSessions: LiveSession[] = [
  { id: "ls_001", title: "React 19 Concurrent Features — Live Demo", courseId: "tc_c001", cohortId: "co_001", trainerId: "tr_001", trainerName: "Dr. Ananya Iyer", date: daysAhead(1), startTime: "19:00", durationMinutes: 120, platform: "zoom", meetingLink: "https://zoom.us/j/123", capacity: 50, registered: 32, status: "scheduled", modality: "online" },
  { id: "ls_002", title: "CKA Practice Session — Troubleshooting", courseId: "tc_c002", cohortId: "co_002", trainerId: "tr_002", trainerName: "Rajesh Kumar", date: daysAhead(2), startTime: "18:00", durationMinutes: 90, platform: "teams", meetingLink: "https://teams.microsoft.com/l/456", capacity: 25, registered: 18, status: "scheduled", modality: "online" },
  { id: "ls_003", title: "New Manager Q&A — Delegation Deep Dive", courseId: "tc_c003", cohortId: "co_003", trainerId: "tr_003", trainerName: "Meera Krishnan", date: daysAhead(7), startTime: "10:00", durationMinutes: 60, platform: "offline", capacity: 30, registered: 24, status: "scheduled", modality: "offline", location: "MediCore Chennai — Training Room 2" },
  { id: "ls_004", title: "DPDP Act — Live Q&A with Sushma", courseId: "tc_c005", trainerId: "tr_005", trainerName: "Sushma Reddy", date: daysAgo(2), startTime: "16:00", durationMinutes: 60, platform: "meet", meetingLink: "https://meet.google.com/abc", capacity: 200, registered: 156, attended: 142, status: "completed", recordingUrl: "https://recordings.skillforge.academy/ls_004", modality: "online" },
  { id: "ls_005", title: "MLOps Office Hours", courseId: "tc_c004", trainerId: "tr_004", trainerName: "Vikram Rao", date: daysAhead(4), startTime: "20:00", durationMinutes: 45, platform: "zoom", meetingLink: "https://zoom.us/j/789", capacity: 40, registered: 28, status: "scheduled", modality: "online" },
];

// ============================================================
// ASSESSMENTS & QUESTIONS
// ============================================================
export const trainingAssessments: TrainingAssessment[] = [
  { id: "ta_001", title: "React 19 Final Assessment", courseId: "tc_c001", category: "Technology", questionCount: 35, totalMarks: 100, passingScore: 70, timeLimitMinutes: 60, difficulty: "advanced", attempts: 1840, avgScore: 84, status: "published", randomize: true },
  { id: "ta_002", title: "CKA Practice Exam", courseId: "tc_c002", category: "Technology", questionCount: 25, totalMarks: 100, passingScore: 75, timeLimitMinutes: 120, difficulty: "intermediate", attempts: 2640, avgScore: 79, status: "published", randomize: true },
  { id: "ta_003", title: "Manager Bootcamp Capstone", courseId: "tc_c003", category: "Leadership", questionCount: 15, totalMarks: 50, passingScore: 70, timeLimitMinutes: 45, difficulty: "intermediate", attempts: 3120, avgScore: 88, status: "published", randomize: false },
  { id: "ta_004", title: "DPDP Compliance Quiz", courseId: "tc_c005", category: "Compliance", questionCount: 20, totalMarks: 50, passingScore: 80, timeLimitMinutes: 30, difficulty: "intermediate", attempts: 5400, avgScore: 86, status: "published", randomize: true },
  { id: "ta_005", title: "Security Awareness Test", courseId: "tc_c007", category: "Compliance", questionCount: 15, totalMarks: 30, passingScore: 80, timeLimitMinutes: 20, difficulty: "beginner", attempts: 8200, avgScore: 89, status: "published", randomize: true },
  { id: "ta_006", title: "MLOps Capstone Evaluation", courseId: "tc_c004", category: "Technology", questionCount: 12, totalMarks: 100, passingScore: 70, timeLimitMinutes: 90, difficulty: "expert", attempts: 890, avgScore: 76, status: "published", randomize: false },
];

export const questionBank: Question[] = [
  { id: "q_001", type: "mcq", question: "Which React 19 feature enables non-blocking UI updates?", options: ["useEffect", "useTransition", "useMemo", "useCallback"], correctAnswer: "useTransition", marks: 2, category: "React", difficulty: "advanced", explanation: "useTransition marks state updates as non-blocking transitions." },
  { id: "q_002", type: "mcq", question: "What is the primary purpose of Kubernetes Services?", options: ["Store data", "Route traffic to pods", "Build images", "Manage secrets"], correctAnswer: "Route traffic to pods", marks: 2, category: "Kubernetes", difficulty: "intermediate" },
  { id: "q_003", type: "truefalse", question: "The DPDP Act 2023 applies only to government entities.", options: ["True", "False"], correctAnswer: "False", marks: 1, category: "Compliance", difficulty: "beginner", explanation: "DPDP applies to all data fiduciaries processing personal data." },
  { id: "q_004", type: "short", question: "What does MEDDIC stand for in B2B sales?", correctAnswer: "Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion", marks: 5, category: "Sales", difficulty: "intermediate" },
  { id: "q_005", type: "mcq", question: "Which is NOT a valid Kubernetes workload resource?", options: ["Deployment", "StatefulSet", "PodSet", "DaemonSet"], correctAnswer: "PodSet", marks: 2, category: "Kubernetes", difficulty: "intermediate" },
  { id: "q_006", type: "mcq", question: "What is model drift in ML?", options: ["Code bugs", "Model performance degrades over time due to data changes", "Training crashes", "GPU overheating"], correctAnswer: "Model performance degrades over time due to data changes", marks: 3, category: "ML", difficulty: "expert" },
];

export const assessmentAttempts: AssessmentAttempt[] = [
  { id: "aa_001", learnerId: "e_001", learnerName: "Priya Nair", assessmentId: "ta_001", assessmentTitle: "React 19 Final Assessment", score: 88, totalMarks: 100, percentage: 88, passed: true, startedAt: daysAgo(3), completedAt: daysAgo(3), timeTakenMinutes: 52 },
  { id: "aa_002", learnerId: "e_002", learnerName: "Arjun Iyer", assessmentId: "ta_002", assessmentTitle: "CKA Practice Exam", score: 82, totalMarks: 100, percentage: 82, passed: true, startedAt: daysAgo(5), completedAt: daysAgo(5), timeTakenMinutes: 108 },
  { id: "aa_003", learnerId: "e_003", learnerName: "Kavya Reddy", assessmentId: "ta_003", assessmentTitle: "Manager Bootcamp Capstone", score: 46, totalMarks: 50, percentage: 92, passed: true, startedAt: daysAgo(8), completedAt: daysAgo(8), timeTakenMinutes: 38 },
  { id: "aa_004", learnerId: "e_004", learnerName: "Vikram Singh", assessmentId: "ta_004", assessmentTitle: "DPDP Compliance Quiz", score: 44, totalMarks: 50, percentage: 88, passed: true, startedAt: daysAgo(2), completedAt: daysAgo(2), timeTakenMinutes: 22 },
  { id: "aa_005", learnerId: "e_005", learnerName: "Sahil Khan", assessmentId: "ta_001", assessmentTitle: "React 19 Final Assessment", score: 58, totalMarks: 100, percentage: 58, passed: false, startedAt: daysAgo(1), completedAt: daysAgo(1), timeTakenMinutes: 60 },
];

// ============================================================
// CERTIFICATES & TEMPLATES
// ============================================================
export const certificates: Certificate[] = [
  { id: "cert_001", certificateId: "SF-CERT-2024-10001", learnerId: "e_001", learnerName: "Priya Nair", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", issuer: "SkillForge Academy", issueDate: daysAgo(3), status: "active", template: "Standard", verifyUrl: "https://verify.skillforge.academy/SF-CERT-2024-10001" },
  { id: "cert_002", certificateId: "SF-CERT-2024-10002", learnerId: "e_002", learnerName: "Arjun Iyer", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", issuer: "SkillForge Academy", issueDate: daysAgo(5), expiryDate: daysAhead(730), status: "active", template: "CKA Special", verifyUrl: "https://verify.skillforge.academy/SF-CERT-2024-10002" },
  { id: "cert_003", certificateId: "SF-CERT-2024-10003", learnerId: "e_003", learnerName: "Kavya Reddy", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", issuer: "SkillForge Academy", issueDate: daysAgo(8), status: "active", template: "Leadership", verifyUrl: "https://verify.skillforge.academy/SF-CERT-2024-10003" },
  { id: "cert_004", certificateId: "SF-CERT-2024-10004", learnerId: "e_004", learnerName: "Vikram Singh", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy Compliance", issuer: "SkillForge Academy", issueDate: daysAgo(2), expiryDate: daysAhead(365), status: "active", template: "Compliance", verifyUrl: "https://verify.skillforge.academy/SF-CERT-2024-10004" },
  { id: "cert_005", certificateId: "SF-CERT-2023-9876", learnerId: "e_001", learnerName: "Priya Nair", courseId: "tc_c007", courseName: "Information Security Awareness (ISO 27001)", issuer: "SkillForge Academy", issueDate: daysAgo(320), expiryDate: daysAhead(45), status: "expiring", template: "Compliance", verifyUrl: "https://verify.skillforge.academy/SF-CERT-2023-9876" },
];

export const certificateTemplates: CertificateTemplate[] = [
  { id: "ct_001", name: "Standard", design: "Classic white with brand accent border", fields: ["Learner Name", "Course", "Issue Date", "Verify ID"], status: "active" },
  { id: "ct_002", name: "CKA Special", design: "Cloud-native themed with CNCF branding", fields: ["Learner Name", "Course", "Issue Date", "Expiry Date", "Verify ID"], status: "active" },
  { id: "ct_003", name: "Leadership", design: "Premium gold accent with embossed seal", fields: ["Learner Name", "Course", "Issue Date", "Score", "Verify ID"], status: "active" },
  { id: "ct_004", name: "Compliance", design: "Security-themed with watermark", fields: ["Learner Name", "Course", "Issue Date", "Expiry Date", "Regulation", "Verify ID"], status: "active" },
  { id: "ct_005", name: "Executive", design: "Minimalist executive style", fields: ["Learner Name", "Program", "Issue Date", "Verify ID"], status: "draft" },
];

// ============================================================
// SKILLS & SKILL GAPS
// ============================================================
export const skillFrameworks: SkillFramework[] = [
  { id: "sf_001", name: "React", category: "Frontend", description: "Building modern web UIs with React", levels: [{ level: 1, label: "Beginner", description: "Understands components & props" }, { level: 2, label: "Intermediate", description: "Hooks, context, state management" }, { level: 3, label: "Advanced", description: "Performance, patterns, testing" }, { level: 4, label: "Expert", description: "Architecture, concurrent features, SSR" }, { level: 5, label: "Master", description: "Library design, contributions, teaching" }], employeesWithSkill: 1240, demand: "critical", trend: 12 },
  { id: "sf_002", name: "Kubernetes", category: "DevOps", description: "Container orchestration & cloud-native", levels: [{ level: 1, label: "Beginner", description: "Basic kubectl" }, { level: 2, label: "Intermediate", description: "Deploys & manages workloads" }, { level: 3, label: "Advanced", description: "Networking, security, operators" }, { level: 4, label: "Expert", description: "CKA level, multi-cluster" }, { level: 5, label: "Master", description: "Platform engineering, CNCF contributor" }], employeesWithSkill: 680, demand: "high", trend: 18 },
  { id: "sf_003", name: "Leadership", category: "Soft Skills", description: "People management & leadership", levels: [{ level: 1, label: "Individual", description: "Self-management" }, { level: 2, label: "Emerging", description: "Leads small projects" }, { level: 3, label: "Manager", description: "Manages a team" }, { level: 4, label: "Leader", description: "Leads multi-team org" }, { level: 5, label: "Executive", description: "C-suite leadership" }], employeesWithSkill: 320, demand: "high", trend: 8 },
  { id: "sf_004", name: "Machine Learning", category: "Data & AI", description: "ML modeling & production systems", levels: [{ level: 1, label: "Beginner", description: "Basic ML concepts" }, { level: 2, label: "Intermediate", description: "Builds & trains models" }, { level: 3, label: "Advanced", description: "Production ML, MLOps" }, { level: 4, label: "Expert", description: "Architects ML systems" }, { level: 5, label: "Master", description: "Research, novel architectures" }], employeesWithSkill: 420, demand: "critical", trend: 25 },
  { id: "sf_005", name: "Data Privacy (DPDP)", category: "Compliance", description: "DPDP Act compliance & data protection", levels: [{ level: 1, label: "Aware", description: "Completed awareness training" }, { level: 2, label: "Practitioner", description: "Implements consent & handling" }, { level: 3, label: "Advanced", description: "Conducts DPIAs" }, { level: 4, label: "Expert", description: "Designs compliance programs" }, { level: 5, label: "DPO", description: "Data Protection Officer level" }], employeesWithSkill: 5400, demand: "high", trend: 15 },
];

export const skillGaps: SkillGap[] = [
  { skillId: "sf_004", skillName: "Machine Learning", category: "Data & AI", currentLevel: 2, requiredLevel: 4, gap: 2, employeesAffected: 180, recommendedCourses: ["tc_c004"] },
  { skillId: "sf_002", skillName: "Kubernetes", category: "DevOps", currentLevel: 2, requiredLevel: 3, gap: 1, employeesAffected: 240, recommendedCourses: ["tc_c002"] },
  { skillId: "sf_001", skillName: "React", category: "Frontend", currentLevel: 3, requiredLevel: 4, gap: 1, employeesAffected: 120, recommendedCourses: ["tc_c001"] },
  { skillId: "sf_005", skillName: "Data Privacy (DPDP)", category: "Compliance", currentLevel: 1, requiredLevel: 2, gap: 1, employeesAffected: 800, recommendedCourses: ["tc_c005"] },
];

// ============================================================
// LEARNER ENROLLMENTS
// ============================================================
export const learnerEnrollments: LearnerEnrollment[] = [
  { id: "le_001", learnerId: "e_001", learnerName: "Priya Nair", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", progress: 85, status: "in_progress", enrolledDate: daysAgo(14), dueDate: daysAhead(7), timeSpentMinutes: 920, score: 88, assignedBy: "Rohan Mehta", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "le_002", learnerId: "e_002", learnerName: "Arjun Iyer", courseId: "tc_c002", courseName: "Kubernetes for Developers", progress: 100, status: "certified", enrolledDate: daysAgo(30), completedDate: daysAgo(5), timeSpentMinutes: 2100, score: 82, assignedBy: "Self", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "le_003", learnerId: "e_003", learnerName: "Kavya Reddy", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", progress: 100, status: "certified", enrolledDate: daysAgo(21), completedDate: daysAgo(8), timeSpentMinutes: 1080, score: 92, assignedBy: "HR", clientId: "cc_002", clientName: "FinEdge Solutions" },
  { id: "le_004", learnerId: "e_004", learnerName: "Vikram Singh", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy", progress: 100, status: "certified", enrolledDate: daysAgo(10), completedDate: daysAgo(2), timeSpentMinutes: 420, score: 88, assignedBy: "Compliance", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "le_005", learnerId: "e_005", learnerName: "Sahil Khan", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", progress: 35, status: "in_progress", enrolledDate: daysAgo(10), dueDate: daysAhead(11), timeSpentMinutes: 380, assignedBy: "Self", clientId: "cc_005", clientName: "EduVerse Learning" },
  { id: "le_006", learnerId: "e_006", learnerName: "Meera Krishnan", courseId: "tc_c007", courseName: "Information Security Awareness", progress: 0, status: "overdue", enrolledDate: daysAgo(40), dueDate: daysAgo(5), timeSpentMinutes: 0, assignedBy: "Compliance", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "le_007", learnerId: "e_007", learnerName: "Karthik Menon", courseId: "tc_c004", courseName: "Production ML with MLOps", progress: 60, status: "in_progress", enrolledDate: daysAgo(20), dueDate: daysAhead(20), timeSpentMinutes: 1260, assignedBy: "Manager", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "le_008", learnerId: "e_008", learnerName: "Divya Sharma", courseId: "tc_c006", courseName: "Consultative B2B Sales", progress: 100, status: "completed", enrolledDate: daysAgo(45), completedDate: daysAgo(20), timeSpentMinutes: 900, score: 85, assignedBy: "Sales Head", clientId: "cc_002", clientName: "FinEdge Solutions" },
];

// ============================================================
// TRAINING PROGRAMS / CAMPAIGNS
// ============================================================
export const trainingPrograms: TrainingProgram[] = [
  { id: "tp_001", name: "TechCorp — Frontend Upskilling 2024", description: "Upskill 200 frontend engineers to React 19.", clientId: "cc_001", clientName: "TechCorp India", type: "upskilling", targetLearners: 200, enrolled: 184, completed: 96, startDate: daysAgo(60), endDate: daysAhead(30), status: "active", budget: 1500000, currency: "INR" },
  { id: "tp_002", name: "FinEdge — DevOps Transformation", description: "Train DevOps team on K8s & SRE practices.", clientId: "cc_002", clientName: "FinEdge Solutions", type: "upskilling", targetLearners: 40, enrolled: 38, completed: 22, startDate: daysAgo(45), endDate: daysAhead(45), status: "active", budget: 800000, currency: "INR" },
  { id: "tp_003", name: "MediCore — Compliance Refresh Q4", description: "Mandatory DPDP & security refresh for all employees.", clientId: "cc_003", clientName: "MediCore Health", type: "compliance", targetLearners: 620, enrolled: 580, completed: 410, startDate: daysAgo(30), endDate: daysAhead(15), status: "active", budget: 300000, currency: "INR" },
  { id: "tp_004", name: "GreenLeaf — New Manager Onboarding", description: "Onboard 15 new managers.", clientId: "cc_004", clientName: "GreenLeaf Energy", type: "onboarding", targetLearners: 15, enrolled: 0, completed: 0, startDate: daysAhead(3), endDate: daysAhead(33), status: "scheduled", budget: 200000, currency: "INR" },
  { id: "tp_005", name: "EduVerse — Leadership Academy", description: "Executive leadership program for senior leaders.", clientId: "cc_005", clientName: "EduVerse Learning", type: "leadership", targetLearners: 12, enrolled: 12, completed: 8, startDate: daysAgo(90), endDate: daysAgo(10), status: "completed", budget: 1200000, currency: "INR" },
];

// ============================================================
// COMPLIANCE TRACKING
// ============================================================
export const complianceTracks: ComplianceTrack[] = [
  { id: "ct_001", name: "DPDP Act Compliance", regulation: "DPDP Act 2023", clientId: "cc_001", clientName: "TechCorp India", mandatoryCourseId: "tc_c005", mandatoryCourseName: "DPDP Act & Data Privacy Compliance", totalEmployees: 1200, compliant: 1080, atRisk: 80, overdue: 40, dueDate: daysAhead(30), status: "on_track" },
  { id: "ct_002", name: "ISO 27001 Security Awareness", regulation: "ISO 27001 A.7.2.2", clientId: "cc_001", clientName: "TechCorp India", mandatoryCourseId: "tc_c007", mandatoryCourseName: "Information Security Awareness", totalEmployees: 1200, compliant: 1140, atRisk: 40, overdue: 20, dueDate: daysAhead(15), status: "at_risk" },
  { id: "ct_003", name: "RBI Data Localization", regulation: "RBI Storage of Payment Data", clientId: "cc_002", clientName: "FinEdge Solutions", mandatoryCourseId: "tc_c005", mandatoryCourseName: "DPDP Act & Data Privacy Compliance", totalEmployees: 480, compliant: 460, atRisk: 15, overdue: 5, dueDate: daysAhead(10), status: "on_track" },
  { id: "ct_004", name: "Healthcare Data Privacy", regulation: "DPDP + Healthcare-specific", clientId: "cc_003", clientName: "MediCore Health", mandatoryCourseId: "tc_c005", mandatoryCourseName: "DPDP Act & Data Privacy Compliance", totalEmployees: 620, compliant: 410, atRisk: 140, overdue: 70, dueDate: daysAhead(7), status: "overdue" },
];

// ============================================================
// SURVEYS
// ============================================================
export const surveys: Survey[] = [
  { id: "sv_001", title: "React Bootcamp — Course Feedback", description: "Feedback for the Advanced React 19 course.", type: "course_feedback", questions: 8, responses: 28, responseRate: 88, status: "active", createdAt: daysAgo(5) },
  { id: "sv_002", title: "Q4 Training Needs Analysis", description: "Identify skill gaps & training priorities for next quarter.", type: "training_needs", questions: 12, responses: 840, responseRate: 70, status: "active", createdAt: daysAgo(14) },
  { id: "sv_003", title: "Trainer Effectiveness — Dr. Ananya Iyer", description: "Learner feedback on trainer delivery.", type: "trainer_feedback", questions: 6, responses: 156, responseRate: 82, status: "closed", createdAt: daysAgo(30) },
  { id: "sv_004", title: "Overall L&D Satisfaction NPS", description: "Net promoter score for the training program.", type: "nps", questions: 2, responses: 1240, responseRate: 65, status: "active", createdAt: daysAgo(7) },
];

// ============================================================
// GAMIFICATION & ACHIEVEMENTS
// ============================================================
export const gamificationConfig: GamificationConfig = {
  pointsPerCourse: 500,
  pointsPerAssessment: 200,
  pointsPerLiveSession: 150,
  badgeThresholds: [
    { name: "Quick Starter", points: 100, icon: "Rocket" },
    { name: "Consistent Learner", points: 1000, icon: "Flame" },
    { name: "Course Champion", points: 3000, icon: "Trophy" },
    { name: "Knowledge Master", points: 8000, icon: "Brain" },
    { name: "SkillForge Legend", points: 15000, icon: "Crown" },
  ],
  leaderboardEnabled: true,
};

export const learnerAchievements: LearnerAchievement[] = [
  { id: "ach_001", learnerId: "e_001", learnerName: "Priya Nair", type: "badge", title: "Consistent Learner", description: "Earned 1000+ points", icon: "Flame", earnedAt: daysAgo(5), points: 1000 },
  { id: "ach_002", learnerId: "e_002", learnerName: "Arjun Iyer", type: "certificate", title: "CKA Certified", description: "Completed K8s bootcamp + CKA exam", icon: "Award", earnedAt: daysAgo(5), points: 700 },
  { id: "ach_003", learnerId: "e_003", learnerName: "Kavya Reddy", type: "milestone", title: "10 Courses Completed", description: "Completed 10 courses", icon: "Trophy", earnedAt: daysAgo(8), points: 5000 },
  { id: "ach_004", learnerId: "e_001", learnerName: "Priya Nair", type: "streak", title: "14-Day Streak", description: "Learned 14 days in a row", icon: "Flame", earnedAt: daysAgo(1), points: 300 },
  { id: "ach_005", learnerId: "e_004", learnerName: "Vikram Singh", type: "badge", title: "Compliance Champion", description: "Completed all mandatory compliance", icon: "ShieldCheck", earnedAt: daysAgo(2), points: 800 },
];

// ============================================================
// BUDGETS & INVOICES (B2B)
// ============================================================
export const trainingBudgets: TrainingBudget[] = [
  { id: "tb_001", clientId: "cc_001", clientName: "TechCorp India", department: "Engineering", allocated: 2000000, used: 1480000, remaining: 520000, utilization: 74, costPerLearner: 1233, fy: "FY24-25", currency: "INR" },
  { id: "tb_002", clientId: "cc_001", clientName: "TechCorp India", department: "Leadership", allocated: 800000, used: 620000, remaining: 180000, utilization: 78, costPerLearner: 4133, fy: "FY24-25", currency: "INR" },
  { id: "tb_003", clientId: "cc_001", clientName: "TechCorp India", department: "Compliance", allocated: 500000, used: 480000, remaining: 20000, utilization: 96, costPerLearner: 400, fy: "FY24-25", currency: "INR" },
  { id: "tb_004", clientId: "cc_002", clientName: "FinEdge Solutions", department: "All", allocated: 2200000, used: 1540000, remaining: 660000, utilization: 70, costPerLearner: 3208, fy: "FY24-25", currency: "INR" },
  { id: "tb_005", clientId: "cc_003", clientName: "MediCore Health", department: "All", allocated: 1800000, used: 1620000, remaining: 180000, utilization: 90, costPerLearner: 2613, fy: "FY24-25", currency: "INR" },
];

export const trainingInvoices: TrainingInvoice[] = [
  { id: "ti_001", number: "SF-INV-2024-2001", clientId: "cc_001", clientName: "TechCorp India", amount: 400000, tax: 72000, total: 472000, currency: "INR", status: "paid", issueDate: daysAgo(60), dueDate: daysAgo(45), paidDate: daysAgo(46), items: [{ description: "Frontend Upskilling Program — Q1", quantity: 1, unitPrice: 400000, amount: 400000 }], gstin: "29TCORP1234F1Z5" },
  { id: "ti_002", number: "SF-INV-2024-2002", clientId: "cc_002", clientName: "FinEdge Solutions", amount: 550000, tax: 99000, total: 649000, currency: "INR", status: "paid", issueDate: daysAgo(45), dueDate: daysAgo(30), paidDate: daysAgo(31), items: [{ description: "DevOps Transformation — Phase 1", quantity: 1, unitPrice: 550000, amount: 550000 }], gstin: "27FINEDGE5678K1Z2" },
  { id: "ti_003", number: "SF-INV-2024-2003", clientId: "cc_001", clientName: "TechCorp India", amount: 300000, tax: 54000, total: 354000, currency: "INR", status: "pending", issueDate: daysAgo(5), dueDate: daysAhead(10), items: [{ description: "Compliance Refresh — Q4", quantity: 1, unitPrice: 300000, amount: 300000 }], gstin: "29TCORP1234F1Z5" },
  { id: "ti_004", number: "SF-INV-2024-2004", clientId: "cc_003", clientName: "MediCore Health", amount: 450000, tax: 81000, total: 531000, currency: "INR", status: "pending", issueDate: daysAgo(3), dueDate: daysAhead(12), items: [{ description: "Compliance Refresh + Manager Onboarding", quantity: 1, unitPrice: 450000, amount: 450000 }], gstin: "33MEDICORE9012P1Z7" },
  { id: "ti_005", number: "SF-INV-2024-2005", clientId: "cc_006", clientName: "LogiMove Logistics", amount: 300000, tax: 54000, total: 354000, currency: "INR", status: "overdue", issueDate: daysAgo(35), dueDate: daysAgo(20), items: [{ description: "Annual Training Contract — Final Installment", quantity: 1, unitPrice: 300000, amount: 300000 }], gstin: "07LOGIMOVE3456V1Z9" },
  { id: "ti_006", number: "SF-INV-2024-2006", clientId: "cc_005", clientName: "EduVerse Learning", amount: 1200000, tax: 216000, total: 1416000, currency: "INR", status: "paid", issueDate: daysAgo(90), dueDate: daysAgo(75), paidDate: daysAgo(76), items: [{ description: "Leadership Academy — Full Program", quantity: 1, unitPrice: 1200000, amount: 1200000 }], gstin: "06EDUVERSE6789E1Z3" },
];

// ============================================================
// CONTENT LIBRARY
// ============================================================
export const contentLibrary: ContentLibraryItem[] = [
  { id: "cl_001", title: "React 19 Cheat Sheet", type: "pdf", category: "Technology", size: "1.2 MB", uploadedBy: "Dr. Ananya Iyer", uploadedAt: daysAgo(30), tags: ["react", "frontend"], usageCount: 420 },
  { id: "cl_002", title: "K8s Architecture Diagram", type: "image", category: "Technology", size: "850 KB", uploadedBy: "Rajesh Kumar", uploadedAt: daysAgo(45), tags: ["kubernetes", "devops"], usageCount: 680 },
  { id: "cl_003", title: "DPDP Compliance Checklist", type: "pdf", category: "Compliance", size: "640 KB", uploadedBy: "Sushma Reddy", uploadedAt: daysAgo(20), tags: ["dpdp", "compliance", "privacy"], usageCount: 2100 },
  { id: "cl_004", title: "1:1 Meeting Template", type: "template", category: "Leadership", size: "48 KB", uploadedBy: "Meera Krishnan", uploadedAt: daysAgo(60), tags: ["management", "1on1"], usageCount: 340 },
  { id: "cl_005", title: "MEDDIC Sales Framework", type: "presentation", category: "Sales", size: "2.4 MB", uploadedBy: "Arjun Nair", uploadedAt: daysAgo(15), tags: ["sales", "meddic", "b2b"], usageCount: 180 },
  { id: "cl_006", title: "ML System Design Primer", type: "document", category: "Data & AI", size: "3.1 MB", uploadedBy: "Vikram Rao", uploadedAt: daysAgo(10), tags: ["ml", "system-design"], usageCount: 95 },
];

// ============================================================
// WORKFLOW AUTOMATIONS
// ============================================================
export const workflowAutomations: WorkflowAutomation[] = [
  { id: "wf_001", name: "Auto-enroll new hires to onboarding", description: "When a new employee joins a client, auto-assign the onboarding learning path.", trigger: "New employee added", actions: ["Enroll in 'New Manager Onboarding' path", "Send welcome email", "Notify manager"], status: "active", runs: 142, lastRun: daysAgo(2) },
  { id: "wf_002", name: "Compliance deadline reminder", description: "Send escalating reminders before compliance deadlines.", trigger: "14 days before due date", actions: ["Email learner", "Notify manager", "Escalate at 7/3/1 days"], status: "active", runs: 890, lastRun: daysAgo(1) },
  { id: "wf_003", name: "Certificate issuance on course completion", description: "Auto-issue certificate when learner completes a certified course.", trigger: "Course completion 100%", actions: ["Generate certificate", "Email learner", "Update skill profile"], status: "active", runs: 620, lastRun: daysAgo(0) },
  { id: "wf_004", name: "Low engagement intervention", description: "Flag learners inactive for 14 days.", trigger: "No activity for 14 days", actions: ["Email learner", "Notify manager", "Suggest shorter courses"], status: "paused", runs: 210, lastRun: daysAgo(14) },
  { id: "wf_005", name: "Post-training survey dispatch", description: "Send feedback survey 2 days after course completion.", trigger: "2 days post-completion", actions: ["Send survey", "Reminder at day 5"], status: "active", runs: 540, lastRun: daysAgo(1) },
];

// ============================================================
// ADDITIONAL LMS ENTITIES (campaigns, providers, approvals, academies, audit, reports)
// ============================================================

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "upskilling" | "compliance" | "onboarding" | "leadership" | "certification";
  clientId?: string;
  clientName?: string;
  targetLearners: number;
  enrolled: number;
  completed: number;
  startDate: string;
  endDate: string;
  goal: number;
  progress: number;
  status: "active" | "scheduled" | "completed" | "draft";
  color: string;
  coursesIncluded: string[];
  channel: "email" | "in_app" | "sms" | "manager";
}

export const campaigns: Campaign[] = [
  { id: "cmp_001", name: "Q4 Compliance Drive 2024", description: "Ensure 100% DPDP & security compliance across all clients before year-end.", type: "compliance", targetLearners: 5400, enrolled: 4980, completed: 4120, startDate: daysAgo(30), endDate: daysAhead(15), goal: 100, progress: 76, status: "active", color: "oklch(0.55 0.13 200)", coursesIncluded: ["tc_c005", "tc_c007"], channel: "email" },
  { id: "cmp_002", name: "TechCorp Frontend Upskilling", description: "Upskill 200 React engineers to React 19.", type: "upskilling", clientId: "cc_001", clientName: "TechCorp India", targetLearners: 200, enrolled: 184, completed: 96, startDate: daysAgo(60), endDate: daysAhead(30), goal: 90, progress: 52, status: "active", color: "oklch(0.55 0.13 165)", coursesIncluded: ["tc_c001"], channel: "in_app" },
  { id: "cmp_003", name: "Leadership Month — September", description: "Leadership training push for all new managers across clients.", type: "leadership", targetLearners: 120, enrolled: 108, completed: 84, startDate: daysAgo(45), endDate: daysAgo(15), goal: 80, progress: 78, status: "completed", color: "oklch(0.58 0.2 25)", coursesIncluded: ["tc_c003"], channel: "manager" },
  { id: "cmp_004", name: "FinEdge DevOps Transformation", description: "Train DevOps team on K8s & SRE practices.", type: "upskilling", clientId: "cc_002", clientName: "FinEdge Solutions", targetLearners: 40, enrolled: 38, completed: 22, startDate: daysAgo(45), endDate: daysAhead(45), goal: 95, progress: 58, status: "active", color: "oklch(0.6 0.14 200)", coursesIncluded: ["tc_c002"], channel: "in_app" },
  { id: "cmp_005", name: "New Hire Onboarding — GreenLeaf", description: "Onboard 15 new GreenLeaf employees.", type: "onboarding", clientId: "cc_004", clientName: "GreenLeaf Energy", targetLearners: 15, enrolled: 0, completed: 0, startDate: daysAhead(3), endDate: daysAhead(33), goal: 100, progress: 0, status: "scheduled", color: "oklch(0.62 0.16 155)", coursesIncluded: ["tc_c003", "tc_c005", "tc_c007"], channel: "email" },
  { id: "cmp_006", name: "AI/ML Skills Sprint", description: "Build ML capabilities across engineering teams.", type: "certification", targetLearners: 80, enrolled: 64, completed: 18, startDate: daysAgo(20), endDate: daysAhead(40), goal: 75, progress: 28, status: "active", color: "oklch(0.6 0.13 300)", coursesIncluded: ["tc_c004"], channel: "in_app" },
];

export interface Provider {
  id: string;
  name: string;
  type: string;
  logoColor: string;
  courses: number;
  trainers: number;
  contractStart: string;
  contractEnd: string;
  pricing: number;
  rating: number;
  learnersTrained: number;
  status: "active" | "pending" | "expired";
  category: string;
  description: string;
  specialties: string[];
}

export const providers: Provider[] = [
  { id: "pv_001", name: "CloudMaster Pro", type: "Cloud Training Partner", logoColor: "oklch(0.6 0.14 200)", courses: 24, trainers: 8, contractStart: "2024-01-01", contractEnd: "2024-12-31", pricing: 450000, rating: 4.7, learnersTrained: 3200, status: "active", category: "Cloud & DevOps", description: "Authorized AWS/Kubernetes training partner. Certified instructors.", specialties: ["AWS", "Kubernetes", "Azure", "GCP"] },
  { id: "pv_002", name: "DataMinds Academy", type: "Data & AI Partner", logoColor: "oklch(0.6 0.13 300)", courses: 18, trainers: 6, contractStart: "2024-03-01", contractEnd: "2025-02-28", pricing: 380000, rating: 4.6, learnersTrained: 2100, status: "active", category: "Data & AI", description: "Specialist ML/AI training with industry practitioners.", specialties: ["Machine Learning", "Python", "MLOps", "Data Engineering"] },
  { id: "pv_003", name: "LeaderEdge Consulting", type: "Leadership Partner", logoColor: "oklch(0.58 0.2 25)", courses: 12, trainers: 5, contractStart: "2024-02-01", contractEnd: "2025-01-31", pricing: 520000, rating: 4.8, learnersTrained: 1800, status: "active", category: "Leadership", description: "Executive coaching & leadership development programs.", specialties: ["Executive Leadership", "Coaching", "Change Management"] },
  { id: "pv_004", name: "SecureShield Training", type: "Security & Compliance Partner", logoColor: "oklch(0.55 0.13 200)", courses: 8, trainers: 4, contractStart: "2024-04-01", contractEnd: "2025-03-31", pricing: 280000, rating: 4.5, learnersTrained: 4600, status: "active", category: "Compliance & Security", description: "Cybersecurity, DPDP, ISO 27001 compliance training.", specialties: ["DPDP Act", "ISO 27001", "Cybersecurity", "CISM"] },
  { id: "pv_005", name: "SalesAce Institute", type: "Sales Training Partner", logoColor: "oklch(0.6 0.16 70)", courses: 10, trainers: 4, contractStart: "2024-05-01", contractEnd: "2025-04-30", pricing: 320000, rating: 4.4, learnersTrained: 1400, status: "active", category: "Sales", description: "B2B sales methodology and negotiation training.", specialties: ["B2B Sales", "MEDDIC", "Negotiation", "Account Management"] },
  { id: "pv_006", name: "TechFront Learning", type: "Technology Partner", logoColor: "oklch(0.55 0.13 165)", courses: 22, trainers: 7, contractStart: "2023-09-01", contractEnd: "2024-08-31", pricing: 410000, rating: 4.3, learnersTrained: 2800, status: "expired", category: "Technology", description: "Frontend, backend, and full-stack training.", specialties: ["React", "Node.js", "Java", "Python"] },
];

export interface TrainingApproval {
  id: string;
  type: "course_request" | "budget_request" | "contract_renewal" | "custom_program";
  title: string;
  requester: string;
  requesterRole: string;
  clientId?: string;
  clientName?: string;
  amount?: number;
  currency?: string;
  description: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  approver?: string;
  decidedAt?: string;
  priority: "low" | "medium" | "high" | "urgent";
  comments?: string;
}

export const trainingApprovals: TrainingApproval[] = [
  { id: "tap_001", type: "budget_request", title: "Additional ₹4L for TechCorp Frontend program", requester: "Divya Sharma", requesterRole: "Account Manager", clientId: "cc_001", clientName: "TechCorp India", amount: 400000, currency: "INR", description: "Need additional budget to extend React 19 bootcamp to 2 more batches due to high demand.", requestedAt: daysAgo(2), status: "pending", priority: "high" },
  { id: "tap_002", type: "contract_renewal", title: "GreenLeaf Energy — Convert trial to annual", requester: "Karthik Nair", requesterRole: "Account Manager", clientId: "cc_004", clientName: "GreenLeaf Energy", amount: 900000, currency: "INR", description: "Trial ending. Client wants to convert to annual contract with expanded scope.", requestedAt: daysAgo(5), status: "pending", priority: "urgent" },
  { id: "tap_003", type: "custom_program", title: "MediCore — Custom Healthcare Analytics program", requester: "Karthik Nair", requesterRole: "Account Manager", clientId: "cc_003", clientName: "MediCore Health", amount: 650000, currency: "INR", description: "Build custom 8-week healthcare data analytics program. Requires specialist trainer.", requestedAt: daysAgo(7), status: "pending", priority: "medium" },
  { id: "tap_004", type: "course_request", title: "FinEdge — Request for advanced MLOps course", requester: "Divya Sharma", requesterRole: "Account Manager", clientId: "cc_002", clientName: "FinEdge Solutions", description: "Client requesting an advanced MLOps course for their data science team.", requestedAt: daysAgo(10), status: "approved", approver: "Suresh (VP Sales)", decidedAt: daysAgo(8), priority: "medium", comments: "Approved — assign to Dr. Vikram Rao" },
  { id: "tap_005", type: "budget_request", title: "EduVerse — Discount on Leadership Academy", requester: "Divya Sharma", requesterRole: "Account Manager", clientId: "cc_005", clientName: "EduVerse Learning", amount: 200000, currency: "INR", description: "Request 15% discount on next leadership academy cohort.", requestedAt: daysAgo(12), status: "rejected", approver: "Suresh (VP Sales)", decidedAt: daysAgo(9), priority: "low", comments: "Cannot discount below margin threshold" },
];

export interface CorporateAcademy {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  subdomain: string;
  logo: string;
  themeColor: string;
  customDomain?: string;
  coursesAssigned: number;
  learnersCount: number;
  customBranding: boolean;
  ssoEnabled: boolean;
  status: "active" | "setup" | "paused";
  launchedAt: string;
  adminName: string;
  adminEmail: string;
}

export const corporateAcademies: CorporateAcademy[] = [
  { id: "ca_001", name: "TechCorp Learning Academy", clientId: "cc_001", clientName: "TechCorp India", subdomain: "techcorp", logo: "TC", themeColor: "oklch(0.55 0.13 165)", customDomain: "learning.techcorp.in", coursesAssigned: 24, learnersCount: 1200, customBranding: true, ssoEnabled: true, status: "active", launchedAt: daysAgo(180), adminName: "Rohan Mehta", adminEmail: "rohan.mehta@techcorp.com" },
  { id: "ca_002", name: "FinEdge Growth Academy", clientId: "cc_002", clientName: "FinEdge Solutions", subdomain: "finedge", logo: "FE", themeColor: "oklch(0.6 0.14 200)", coursesAssigned: 16, learnersCount: 480, customBranding: true, ssoEnabled: true, status: "active", launchedAt: daysAgo(120), adminName: "Vikram Joshi", adminEmail: "vikram@finedge.io" },
  { id: "ca_003", name: "MediCore Care Academy", clientId: "cc_003", clientName: "MediCore Health", subdomain: "medicore", logo: "MC", themeColor: "oklch(0.55 0.13 200)", coursesAssigned: 12, learnersCount: 620, customBranding: false, ssoEnabled: false, status: "active", launchedAt: daysAgo(90), adminName: "Dr. Lakshmi Iyer", adminEmail: "lakshmi@medicore.health" },
  { id: "ca_004", name: "GreenLeaf Learn", clientId: "cc_004", clientName: "GreenLeaf Energy", subdomain: "greenleaf", logo: "GL", themeColor: "oklch(0.62 0.16 155)", coursesAssigned: 8, learnersCount: 210, customBranding: false, ssoEnabled: false, status: "setup", launchedAt: daysAgo(10), adminName: "Arjun Patel", adminEmail: "arjun@greenleaf.energy" },
  { id: "ca_005", name: "EduVerse Educator Hub", clientId: "cc_005", clientName: "EduVerse Learning", subdomain: "eduverse", logo: "EV", themeColor: "oklch(0.6 0.16 70)", coursesAssigned: 14, learnersCount: 260, customBranding: true, ssoEnabled: true, status: "active", launchedAt: daysAgo(60), adminName: "Neha Kapoor", adminEmail: "neha@eduverse.in" },
];

export interface TrainingAuditLog {
  id: string;
  actor: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  status: "success" | "failed" | "warning";
  details: string;
  clientId?: string;
  clientName?: string;
}

export const trainingAuditLogs: TrainingAuditLog[] = [
  { id: "tal_001", actor: "Divya Sharma", action: "course.published", module: "Courses", timestamp: daysAgo(1), ip: "203.0.113.42", status: "success", details: "Published course 'Advanced React 19 & Next.js' v3.2" },
  { id: "tal_002", actor: "Dr. Ananya Iyer", action: "live_session.started", module: "Live Training", timestamp: daysAgo(1), ip: "203.0.113.51", status: "success", details: "Started live session 'React 19 Concurrent Features'", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "tal_003", actor: "System", action: "certificate.issued", module: "Certifications", timestamp: daysAgo(2), ip: "0.0.0.0", status: "success", details: "Auto-issued certificate SF-CERT-2024-10001 to Priya Nair" },
  { id: "tal_004", actor: "Rohan Mehta", action: "enrollment.bulk_assigned", module: "Enrollments", timestamp: daysAgo(3), ip: "203.0.113.88", status: "success", details: "Bulk-assigned DPDP compliance to 1200 employees", clientId: "cc_001", clientName: "TechCorp India" },
  { id: "tal_005", actor: "Karthik Nair", action: "contract.modified", module: "Contracts", timestamp: daysAgo(4), ip: "203.0.113.99", status: "warning", details: "Modified GreenLeaf contract — extended trial by 30 days", clientId: "cc_004", clientName: "GreenLeaf Energy" },
  { id: "tal_006", actor: "System", action: "compliance.overdue", module: "Compliance", timestamp: daysAgo(5), ip: "0.0.0.0", status: "failed", details: "70 employees overdue on Healthcare Data Privacy compliance", clientId: "cc_003", clientName: "MediCore Health" },
  { id: "tal_007", actor: "Sushma Reddy", action: "assessment.published", module: "Assessments", timestamp: daysAgo(6), ip: "203.0.113.71", status: "success", details: "Published assessment 'DPDP Compliance Quiz'" },
  { id: "tal_008", actor: "Divya Sharma", action: "invoice.generated", module: "Finance", timestamp: daysAgo(7), ip: "203.0.113.42", status: "success", details: "Generated invoice SF-INV-2024-2003 for TechCorp India ₹3L", clientId: "cc_001", clientName: "TechCorp India" },
];

export interface TrainingReport {
  id: string;
  name: string;
  category: string;
  description: string;
  lastRun: string;
  schedule?: string;
  format: "PDF" | "Excel" | "CSV";
  status: "ready" | "scheduled" | "generating";
  recipients?: string;
}

export const trainingReports: TrainingReport[] = [
  { id: "tr_001", name: "Monthly Client Training Summary", category: "Client", description: "Enrollment, completion, and compliance summary per client.", lastRun: daysAgo(2), schedule: "Monthly (1st)", format: "PDF", status: "ready", recipients: "Account Managers" },
  { id: "tr_002", name: "Compliance Status Report", category: "Compliance", description: "All compliance tracks with overdue/at-risk breakdown.", lastRun: daysAgo(1), schedule: "Weekly (Mon)", format: "Excel", status: "ready", recipients: "Compliance Team" },
  { id: "tr_003", name: "Trainer Performance Quarterly", category: "Trainer", description: "Sessions, ratings, learner outcomes per trainer.", lastRun: daysAgo(15), schedule: "Quarterly", format: "PDF", status: "ready" },
  { id: "tr_004", name: "Revenue & Utilization", category: "Finance", description: "Revenue, budget utilization, AR aging by client.", lastRun: daysAgo(3), schedule: "Monthly", format: "Excel", status: "ready", recipients: "Finance Team" },
  { id: "tr_005", name: "Course Engagement Deep-dive", category: "Analytics", description: "Drop-off, engagement, completion per course.", lastRun: daysAgo(0), schedule: "On-demand", format: "PDF", status: "generating" },
  { id: "tr_006", name: "Certificate Issuance Log", category: "Certification", description: "All certificates issued in the period.", lastRun: daysAgo(1), schedule: "Daily", format: "CSV", status: "ready" },
  { id: "tr_007", name: "Skill Gap Assessment", category: "Skills", description: "Current skill gaps and recommended training.", lastRun: daysAgo(7), format: "PDF", status: "ready" },
  { id: "tr_008", name: "Live Session Attendance", category: "Delivery", description: "Attendance rates per session/cohort.", lastRun: daysAgo(2), schedule: "Weekly", format: "Excel", status: "scheduled" },
];

// Discussion posts for course player
export interface DiscussionPost {
  id: string;
  author: string;
  initials: string;
  color: string;
  message: string;
  time: string;
}

export const sampleDiscussion: DiscussionPost[] = [
  { id: "dp_001", author: "Sneha Kapoor", initials: "SK", color: "oklch(0.6 0.13 300)", message: "The concurrent rendering section really clicked for me — could you share the eval notebook?", time: "2 days ago" },
  { id: "dp_002", author: "Vikram Singh", initials: "VS", color: "oklch(0.6 0.16 70)", message: "For anyone stuck on the hands-on lab, check the troubleshooting guide under Resources.", time: "1 day ago" },
  { id: "dp_003", author: "Meera Iyer", initials: "MI", color: "oklch(0.55 0.13 200)", message: "Best React course I've taken. The server components module is gold.", time: "5 hours ago" },
];

// ============================================================
// INDIVIDUAL LEARNER (B2C) + TALENT SOURCING DATA
// The training company serves both corporates (B2B) AND individual
// learners (B2C) who buy courses directly. It also acts as a talent
// sourcing partner — recruiters/employers can hire from its pool of
// certified learners.
// ============================================================

export interface IndividualLearner {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  headline: string;
  location: string;
  phone?: string;
  bio: string;
  joinedAt: string;
  lastActive: string;
  status: "active" | "inactive" | "premium";
  plan: "free" | "premium" | "pro";
  points: number;
  level: number;
  streak: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  learningHours: number;
  skills: { name: string; level: number; verified: boolean }[];
  openToWork: boolean;
  jobTitle: string;
  experience: number;
  links?: { github?: string; linkedin?: string; portfolio?: string };
}

export const individualLearners: IndividualLearner[] = [
  { id: "il_001", name: "Aditya Rao", email: "aditya.rao@gmail.com", avatarColor: "oklch(0.55 0.13 165)", initials: "AR", headline: "Frontend Developer | React • TypeScript", location: "Bengaluru, India", bio: "Self-taught developer upskilling through SkillForge. Built 4 production React apps.", joinedAt: daysAgo(120), lastActive: daysAgo(0), status: "premium", plan: "premium", points: 8400, level: 7, streak: 14, coursesEnrolled: 6, coursesCompleted: 4, certificatesEarned: 4, learningHours: 184, skills: [{ name: "React", level: 4, verified: true }, { name: "TypeScript", level: 4, verified: true }, { name: "Next.js", level: 3, verified: true }, { name: "Tailwind CSS", level: 4, verified: false }], openToWork: true, jobTitle: "Frontend Developer", experience: 3, links: { github: "github.com/adityarao", linkedin: "linkedin.com/in/adityarao" } },
  { id: "il_002", name: "Pooja Bhat", email: "pooja.bhat@gmail.com", avatarColor: "oklch(0.6 0.13 300)", initials: "PB", headline: "DevOps Engineer | AWS • Kubernetes • CKA Certified", location: "Hyderabad, India", bio: "DevOps engineer who cleared CKA via SkillForge bootcamp. Passionate about cloud-native.", joinedAt: daysAgo(90), lastActive: daysAgo(1), status: "premium", plan: "pro", points: 6200, level: 6, streak: 7, coursesEnrolled: 4, coursesCompleted: 3, certificatesEarned: 3, learningHours: 142, skills: [{ name: "Kubernetes", level: 4, verified: true }, { name: "AWS", level: 4, verified: true }, { name: "Terraform", level: 3, verified: true }, { name: "Docker", level: 4, verified: false }], openToWork: true, jobTitle: "DevOps Engineer", experience: 4, links: { linkedin: "linkedin.com/in/poojabhat" } },
  { id: "il_003", name: "Karthik Menon", email: "karthik.menon@gmail.com", avatarColor: "oklch(0.6 0.16 70)", initials: "KM", headline: "ML Engineer | Python • MLOps • Production ML", location: "Chennai, India", bio: "Transitioned from data analyst to ML engineer through SkillForge MLOps course.", joinedAt: daysAgo(150), lastActive: daysAgo(2), status: "active", plan: "premium", points: 9800, level: 8, streak: 21, coursesEnrolled: 5, coursesCompleted: 4, certificatesEarned: 4, learningHours: 220, skills: [{ name: "Python", level: 5, verified: true }, { name: "Machine Learning", level: 4, verified: true }, { name: "MLOps", level: 4, verified: true }, { name: "Data Engineering", level: 3, verified: false }], openToWork: true, jobTitle: "ML Engineer", experience: 5, links: { github: "github.com/karthikm", linkedin: "linkedin.com/in/karthikm" } },
  { id: "il_004", name: "Divya Sharma", email: "divya.sharma@gmail.com", avatarColor: "oklch(0.55 0.13 200)", initials: "DS", headline: "Engineering Manager | Leadership • DPDP Certified", location: "Pune, India", bio: "First-time manager who completed the Manager Bootcamp + compliance training.", joinedAt: daysAgo(60), lastActive: daysAgo(3), status: "active", plan: "free", points: 3400, level: 4, streak: 3, coursesEnrolled: 3, coursesCompleted: 2, certificatesEarned: 2, learningHours: 78, skills: [{ name: "Leadership", level: 3, verified: true }, { name: "DPDP Act", level: 2, verified: true }, { name: "Project Management", level: 3, verified: false }], openToWork: false, jobTitle: "Engineering Manager", experience: 8 },
  { id: "il_005", name: "Rahul Gupta", email: "rahul.gupta@gmail.com", avatarColor: "oklch(0.58 0.2 25)", initials: "RG", headline: "Full-Stack Developer | MERN • React • Node.js", location: "Delhi NCR, India", bio: "Full-stack developer upskilling to modern React 19 + Next.js.", joinedAt: daysAgo(45), lastActive: daysAgo(1), status: "active", plan: "premium", points: 4200, level: 5, streak: 9, coursesEnrolled: 3, coursesCompleted: 1, certificatesEarned: 1, learningHours: 92, skills: [{ name: "React", level: 3, verified: true }, { name: "Node.js", level: 4, verified: false }, { name: "MongoDB", level: 3, verified: false }], openToWork: true, jobTitle: "Full-Stack Developer", experience: 2, links: { github: "github.com/rahulg" } },
  { id: "il_006", name: "Ananya Das", email: "ananya.das@gmail.com", avatarColor: "oklch(0.62 0.16 155)", initials: "AD", headline: "Product Manager | Fintech • Payments • Certified", location: "Mumbai, India", bio: "PM who upskilled in fintech compliance + leadership at SkillForge.", joinedAt: daysAgo(75), lastActive: daysAgo(0), status: "premium", plan: "pro", points: 5600, level: 6, streak: 12, coursesEnrolled: 4, coursesCompleted: 3, certificatesEarned: 3, learningHours: 124, skills: [{ name: "Product Strategy", level: 4, verified: true }, { name: "DPDP Act", level: 2, verified: true }, { name: "Leadership", level: 3, verified: true }], openToWork: true, jobTitle: "Product Manager", experience: 6, links: { linkedin: "linkedin.com/in/ananyadas" } },
  { id: "il_007", name: "Sanjay Pillai", email: "sanjay.pillai@gmail.com", avatarColor: "oklch(0.6 0.14 200)", initials: "SP", headline: "Security Analyst | CISM • ISO 27001 • DPDP", location: "Kochi, India", bio: "Security professional with all compliance certifications from SkillForge.", joinedAt: daysAgo(100), lastActive: daysAgo(2), status: "premium", plan: "pro", points: 7200, level: 7, streak: 18, coursesEnrolled: 3, coursesCompleted: 3, certificatesEarned: 3, learningHours: 156, skills: [{ name: "Information Security", level: 4, verified: true }, { name: "DPDP Act", level: 3, verified: true }, { name: "ISO 27001", level: 3, verified: true }], openToWork: true, jobTitle: "Security Analyst", experience: 4, links: { linkedin: "linkedin.com/in/sanjayp" } },
  { id: "il_008", name: "Ritu Agarwal", email: "ritu.agarwal@gmail.com", avatarColor: "oklch(0.52 0.11 162)", initials: "RA", headline: "Sales Lead | B2B • MEDDIC • Negotiation", location: "Jaipur, India", bio: "Sales leader who completed the B2B sales masterclass.", joinedAt: daysAgo(50), lastActive: daysAgo(4), status: "active", plan: "free", points: 2800, level: 3, streak: 5, coursesEnrolled: 2, coursesCompleted: 1, certificatesEarned: 1, learningHours: 64, skills: [{ name: "B2B Sales", level: 3, verified: true }, { name: "Negotiation", level: 3, verified: false }], openToWork: false, jobTitle: "Sales Lead", experience: 7 },
  { id: "il_009", name: "Manish Tiwari", email: "manish.tiwari@gmail.com", avatarColor: "oklch(0.6 0.13 300)", initials: "MT", headline: "Backend Developer | Go • Distributed Systems", location: "Indore, India", bio: "Backend dev learning Go microservices via SkillForge.", joinedAt: daysAgo(30), lastActive: daysAgo(1), status: "active", plan: "premium", points: 1800, level: 2, streak: 6, coursesEnrolled: 2, coursesCompleted: 0, certificatesEarned: 0, learningHours: 38, skills: [{ name: "Go", level: 2, verified: false }, { name: "PostgreSQL", level: 3, verified: false }], openToWork: true, jobTitle: "Backend Developer", experience: 3 },
  { id: "il_010", name: "Fatima Sheikh", email: "fatima.sheikh@gmail.com", avatarColor: "oklch(0.58 0.2 25)", initials: "FS", headline: "Data Scientist | Python • ML • MLOps", location: "Hyderabad, India", bio: "Data scientist transitioning to ML engineering.", joinedAt: daysAgo(85), lastActive: daysAgo(0), status: "premium", plan: "premium", points: 6800, level: 6, streak: 11, coursesEnrolled: 4, coursesCompleted: 3, certificatesEarned: 3, learningHours: 168, skills: [{ name: "Python", level: 4, verified: true }, { name: "Machine Learning", level: 4, verified: true }, { name: "MLOps", level: 3, verified: true }], openToWork: true, jobTitle: "Data Scientist", experience: 4, links: { github: "github.com/fatimas", linkedin: "linkedin.com/in/fatimas" } },
  { id: "il_011", name: "Nikhil Joshi", email: "nikhil.joshi@gmail.com", avatarColor: "oklch(0.55 0.13 165)", initials: "NJ", headline: "Junior Developer | Learning React", location: "Nagpur, India", bio: "Fresh graduate upskilling for first dev job.", joinedAt: daysAgo(20), lastActive: daysAgo(0), status: "active", plan: "free", points: 900, level: 1, streak: 8, coursesEnrolled: 1, coursesCompleted: 0, certificatesEarned: 0, learningHours: 22, skills: [{ name: "JavaScript", level: 2, verified: false }, { name: "React", level: 1, verified: false }], openToWork: true, jobTitle: "Junior Developer", experience: 0 },
  { id: "il_012", name: "Shreya Nair", email: "shreya.nair@gmail.com", avatarColor: "oklch(0.6 0.16 70)", initials: "SN", headline: "Team Lead | Leadership • Management Certified", location: "Bengaluru, India", bio: "Team lead who completed executive leadership program.", joinedAt: daysAgo(110), lastActive: daysAgo(3), status: "premium", plan: "pro", points: 11200, level: 9, streak: 25, coursesEnrolled: 5, coursesCompleted: 5, certificatesEarned: 5, learningHours: 248, skills: [{ name: "Leadership", level: 5, verified: true }, { name: "Executive Leadership", level: 4, verified: true }, { name: "Change Management", level: 4, verified: true }], openToWork: false, jobTitle: "Senior Team Lead", experience: 10, links: { linkedin: "linkedin.com/in/shreyan" } },
];

// Learner enrollments (B2C — for individual learners)
export interface LearnerCourseEnrollment {
  id: string;
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseName: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "overdue";
  enrolledDate: string;
  completedDate?: string;
  lastAccessed: string;
  timeSpentMinutes: number;
  score?: number;
  rating?: number;
}

export const learnerCourseEnrollments: LearnerCourseEnrollment[] = [
  { id: "lce_001", learnerId: "il_001", learnerName: "Aditya Rao", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", progress: 78, status: "in_progress", enrolledDate: daysAgo(20), lastAccessed: daysAgo(0), timeSpentMinutes: 840, rating: 5 },
  { id: "lce_002", learnerId: "il_001", learnerName: "Aditya Rao", courseId: "tc_c002", courseName: "Kubernetes for Developers", progress: 100, status: "completed", enrolledDate: daysAgo(60), completedDate: daysAgo(30), lastAccessed: daysAgo(30), timeSpentMinutes: 2100, score: 84, rating: 5 },
  { id: "lce_003", learnerId: "il_001", learnerName: "Aditya Rao", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy", progress: 100, status: "completed", enrolledDate: daysAgo(45), completedDate: daysAgo(40), lastAccessed: daysAgo(40), timeSpentMinutes: 420, score: 88, rating: 4 },
  { id: "lce_004", learnerId: "il_002", learnerName: "Pooja Bhat", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", progress: 100, status: "completed", enrolledDate: daysAgo(75), completedDate: daysAgo(15), lastAccessed: daysAgo(15), timeSpentMinutes: 2400, score: 86, rating: 5 },
  { id: "lce_005", learnerId: "il_003", learnerName: "Karthik Menon", courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", progress: 92, status: "in_progress", enrolledDate: daysAgo(35), lastAccessed: daysAgo(2), timeSpentMinutes: 1820, rating: 5 },
  { id: "lce_006", learnerId: "il_006", learnerName: "Ananya Das", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", progress: 100, status: "completed", enrolledDate: daysAgo(40), completedDate: daysAgo(20), lastAccessed: daysAgo(20), timeSpentMinutes: 1080, score: 92, rating: 5 },
  { id: "lce_007", learnerId: "il_007", learnerName: "Sanjay Pillai", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy Compliance", progress: 100, status: "completed", enrolledDate: daysAgo(50), completedDate: daysAgo(35), lastAccessed: daysAgo(35), timeSpentMinutes: 480, score: 90, rating: 5 },
  { id: "lce_008", learnerId: "il_007", learnerName: "Sanjay Pillai", courseId: "tc_c007", courseName: "Information Security Awareness (ISO 27001)", progress: 100, status: "completed", enrolledDate: daysAgo(45), completedDate: daysAgo(38), lastAccessed: daysAgo(38), timeSpentMinutes: 180, score: 94, rating: 4 },
  { id: "lce_009", learnerId: "il_010", learnerName: "Fatima Sheikh", courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", progress: 65, status: "in_progress", enrolledDate: daysAgo(25), lastAccessed: daysAgo(0), timeSpentMinutes: 1240, rating: 5 },
  { id: "lce_010", learnerId: "il_005", learnerName: "Rahul Gupta", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", progress: 45, status: "in_progress", enrolledDate: daysAgo(15), lastAccessed: daysAgo(1), timeSpentMinutes: 560, rating: 4 },
];

// Learner certificates (B2C)
export interface LearnerCertificate {
  id: string;
  certificateId: string;
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  status: "active" | "expiring" | "expired";
  score: number;
  verifyUrl: string;
  shareable: boolean;
}

export const learnerCertificates: LearnerCertificate[] = [
  { id: "lc_001", certificateId: "SF-LC-2024-30001", learnerId: "il_001", learnerName: "Aditya Rao", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", issueDate: daysAgo(30), expiryDate: daysAhead(700), status: "active", score: 84, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30001", shareable: true },
  { id: "lc_002", certificateId: "SF-LC-2024-30002", learnerId: "il_001", learnerName: "Aditya Rao", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy Compliance", issueDate: daysAgo(40), expiryDate: daysAhead(325), status: "active", score: 88, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30002", shareable: true },
  { id: "lc_003", certificateId: "SF-LC-2024-30003", learnerId: "il_002", learnerName: "Pooja Bhat", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", issueDate: daysAgo(15), expiryDate: daysAhead(715), status: "active", score: 86, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30003", shareable: true },
  { id: "lc_004", certificateId: "SF-LC-2024-30004", learnerId: "il_003", learnerName: "Karthik Menon", courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", issueDate: daysAgo(5), status: "active", score: 91, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30004", shareable: true },
  { id: "lc_005", certificateId: "SF-LC-2024-30005", learnerId: "il_006", learnerName: "Ananya Das", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", issueDate: daysAgo(20), status: "active", score: 92, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30005", shareable: true },
  { id: "lc_006", certificateId: "SF-LC-2024-30006", learnerId: "il_007", learnerName: "Sanjay Pillai", courseId: "tc_c005", courseName: "DPDP Act & Data Privacy Compliance", issueDate: daysAgo(35), expiryDate: daysAhead(330), status: "active", score: 90, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30006", shareable: true },
  { id: "lc_007", certificateId: "SF-LC-2024-30007", learnerId: "il_007", learnerName: "Sanjay Pillai", courseId: "tc_c007", courseName: "Information Security Awareness (ISO 27001)", issueDate: daysAgo(38), expiryDate: daysAhead(40), status: "expiring", score: 94, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30007", shareable: true },
  { id: "lc_008", certificateId: "SF-LC-2024-30008", learnerId: "il_010", learnerName: "Fatima Sheikh", courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", issueDate: daysAgo(3), status: "active", score: 89, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30008", shareable: true },
  { id: "lc_009", certificateId: "SF-LC-2024-30009", learnerId: "il_012", learnerName: "Shreya Nair", courseId: "tc_c008", courseName: "Executive Leadership Program", issueDate: daysAgo(15), status: "active", score: 93, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30009", shareable: true },
  { id: "lc_010", certificateId: "SF-LC-2024-30010", learnerId: "il_005", learnerName: "Rahul Gupta", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", issueDate: daysAgo(10), status: "active", score: 82, verifyUrl: "https://verify.skillforge.academy/SF-LC-2024-30010", shareable: true },
];

// ============================================================
// TALENT SOURCING (recruiter side — training company as placement partner)
// ============================================================
export interface SourcingRequest {
  id: string;
  title: string;
  employerName: string;
  employerContact: string;
  employerEmail: string;
  role: string;
  skillsRequired: string[];
  certificationsRequired: string[];
  experienceMin: number;
  location: string;
  remote: boolean;
  salaryRange: string;
  positions: number;
  status: "open" | "in_progress" | "fulfilled" | "closed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  deadline: string;
  candidatesShortlisted: number;
  candidatesSubmitted: number;
  placementsMade: number;
  commissionPerPlacement?: number;
  notes?: string;
}

export const sourcingRequests: SourcingRequest[] = [
  { id: "sr_001", title: "Senior React Engineer", employerName: "TechCorp India", employerContact: "Rohan Mehta", employerEmail: "rohan@techcorp.com", role: "Senior Frontend Engineer", skillsRequired: ["React", "TypeScript", "Next.js"], certificationsRequired: ["Advanced React 19 & Next.js"], experienceMin: 5, location: "Bengaluru", remote: false, salaryRange: "₹18-28L", positions: 2, status: "in_progress", priority: "high", createdAt: daysAgo(7), deadline: daysAhead(23), candidatesShortlisted: 4, candidatesSubmitted: 4, placementsMade: 0, commissionPerPlacement: 50000 },
  { id: "sr_002", title: "DevOps Engineer (CKA required)", employerName: "FinEdge Solutions", employerContact: "Vikram Joshi", employerEmail: "vikram@finedge.io", role: "DevOps Engineer", skillsRequired: ["Kubernetes", "AWS", "Terraform"], certificationsRequired: ["Kubernetes for Developers (CKA Bootcamp)"], experienceMin: 4, location: "Mumbai", remote: true, salaryRange: "₹16-26L", positions: 1, status: "open", priority: "urgent", createdAt: daysAgo(3), deadline: daysAhead(27), candidatesShortlisted: 2, candidatesSubmitted: 2, placementsMade: 0, commissionPerPlacement: 60000 },
  { id: "sr_003", title: "ML Engineer", employerName: "DataMinds AI", employerContact: "Priya Menon", employerEmail: "priya@dataminds.ai", role: "Machine Learning Engineer", skillsRequired: ["Python", "Machine Learning", "MLOps"], certificationsRequired: ["Production Machine Learning with MLOps"], experienceMin: 4, location: "Bengaluru", remote: true, salaryRange: "₹20-35L", positions: 3, status: "open", priority: "high", createdAt: daysAgo(5), deadline: daysAhead(35), candidatesShortlisted: 6, candidatesSubmitted: 4, placementsMade: 1, commissionPerPlacement: 80000 },
  { id: "sr_004", title: "Security Analyst (DPDP + ISO 27001)", employerName: "SecureBank", employerContact: "Anil Kumar", employerEmail: "anil@securebank.in", role: "Security Analyst", skillsRequired: ["Information Security", "DPDP Act", "ISO 27001"], certificationsRequired: ["DPDP Act & Data Privacy Compliance", "Information Security Awareness (ISO 27001)"], experienceMin: 3, location: "Chennai", remote: false, salaryRange: "₹12-20L", positions: 2, status: "in_progress", priority: "medium", createdAt: daysAgo(10), deadline: daysAhead(20), candidatesShortlisted: 3, candidatesSubmitted: 3, placementsMade: 0, commissionPerPlacement: 45000 },
  { id: "sr_005", title: "Product Manager (Fintech)", employerName: "PayBridge", employerContact: "Neha Shah", employerEmail: "neha@paybridge.in", role: "Senior Product Manager", skillsRequired: ["Product Strategy", "Payments"], certificationsRequired: ["First-Time Manager Bootcamp"], experienceMin: 6, location: "Mumbai", remote: true, salaryRange: "₹25-38L", positions: 1, status: "fulfilled", priority: "high", createdAt: daysAgo(30), deadline: daysAgo(5), candidatesShortlisted: 5, candidatesSubmitted: 3, placementsMade: 1, commissionPerPlacement: 70000 },
  { id: "sr_006", title: "Junior Frontend Developer", employerName: "StartupX", employerContact: "Ravi Teja", employerEmail: "ravi@startupx.in", role: "Junior Frontend Developer", skillsRequired: ["React", "JavaScript"], certificationsRequired: [], experienceMin: 0, location: "Hyderabad", remote: false, salaryRange: "₹6-10L", positions: 3, status: "open", priority: "low", createdAt: daysAgo(2), deadline: daysAhead(40), candidatesShortlisted: 1, candidatesSubmitted: 1, placementsMade: 0, commissionPerPlacement: 25000 },
];

export interface TalentPlacement {
  id: string;
  learnerId: string;
  learnerName: string;
  sourcingRequestId: string;
  jobTitle: string;
  employerName: string;
  placedDate: string;
  joiningDate: string;
  salary: number;
  currency: string;
  commissionAmount: number;
  status: "offered" | "joined" | "declined" | "left_within_guarantee";
  guaranteePeriodDays: number;
}

export const talentPlacements: TalentPlacement[] = [
  { id: "tpl_001", learnerId: "il_006", learnerName: "Ananya Das", sourcingRequestId: "sr_005", jobTitle: "Senior Product Manager", employerName: "PayBridge", placedDate: daysAgo(8), joiningDate: daysAgo(2), salary: 3400000, currency: "INR", commissionAmount: 70000, status: "joined", guaranteePeriodDays: 90 },
  { id: "tpl_002", learnerId: "il_003", learnerName: "Karthik Menon", sourcingRequestId: "sr_003", jobTitle: "ML Engineer", employerName: "DataMinds AI", placedDate: daysAgo(12), joiningDate: daysAhead(5), salary: 2800000, currency: "INR", commissionAmount: 80000, status: "offered", guaranteePeriodDays: 90 },
  { id: "tpl_003", learnerId: "il_001", learnerName: "Aditya Rao", sourcingRequestId: "sr_001", jobTitle: "Senior React Engineer", employerName: "TechCorp India", placedDate: daysAgo(0), joiningDate: daysAhead(30), salary: 2400000, currency: "INR", commissionAmount: 50000, status: "offered", guaranteePeriodDays: 60 },
];

export interface TalentPoolEntry {
  id: string;
  learnerId: string;
  learnerName: string;
  poolId: string;
  poolName: string;
  addedDate: string;
  matchScore: number;
  status: "available" | "shortlisted" | "placed" | "withdrawn";
}

export const talentPools: { id: string; name: string; description: string; learnerCount: number; skills: string[]; createdAt: string }[] = [
  { id: "tpl_001", name: "Certified React Developers", description: "Learners who completed Advanced React 19 & Next.js", learnerCount: 4, skills: ["React", "TypeScript", "Next.js"], createdAt: daysAgo(30) },
  { id: "tpl_002", name: "CKA Certified DevOps", description: "Learners who cleared K8s bootcamp + CKA exam", learnerCount: 3, skills: ["Kubernetes", "AWS", "Terraform"], createdAt: daysAgo(45) },
  { id: "tpl_003", name: "ML/MLOps Engineers", description: "Learners certified in Production ML", learnerCount: 3, skills: ["Python", "Machine Learning", "MLOps"], createdAt: daysAgo(20) },
  { id: "tpl_004", name: "Compliance & Security Pros", description: "DPDP + ISO 27001 certified professionals", learnerCount: 2, skills: ["DPDP Act", "ISO 27001", "Information Security"], createdAt: daysAgo(60) },
  { id: "tpl_005", name: "Open to Work — All Certified", description: "All certified learners actively seeking roles", learnerCount: 9, skills: [], createdAt: daysAgo(15) },
];

export const talentPoolEntries: TalentPoolEntry[] = [
  { id: "tpe_001", learnerId: "il_001", learnerName: "Aditya Rao", poolId: "tpl_001", poolName: "Certified React Developers", addedDate: daysAgo(20), matchScore: 95, status: "shortlisted" },
  { id: "tpe_002", learnerId: "il_005", learnerName: "Rahul Gupta", poolId: "tpl_001", poolName: "Certified React Developers", addedDate: daysAgo(10), matchScore: 78, status: "available" },
  { id: "tpe_003", learnerId: "il_001", learnerName: "Aditya Rao", poolId: "tpl_002", poolName: "CKA Certified DevOps", addedDate: daysAgo(30), matchScore: 88, status: "available" },
  { id: "tpe_004", learnerId: "il_002", learnerName: "Pooja Bhat", poolId: "tpl_002", poolName: "CKA Certified DevOps", addedDate: daysAgo(15), matchScore: 92, status: "shortlisted" },
  { id: "tpe_005", learnerId: "il_003", learnerName: "Karthik Menon", poolId: "tpl_003", poolName: "ML/MLOps Engineers", addedDate: daysAgo(5), matchScore: 96, status: "placed" },
  { id: "tpe_006", learnerId: "il_010", learnerName: "Fatima Sheikh", poolId: "tpl_003", poolName: "ML/MLOps Engineers", addedDate: daysAgo(3), matchScore: 84, status: "available" },
  { id: "tpe_007", learnerId: "il_007", learnerName: "Sanjay Pillai", poolId: "tpl_004", poolName: "Compliance & Security Pros", addedDate: daysAgo(35), matchScore: 94, status: "available" },
  { id: "tpe_008", learnerId: "il_006", learnerName: "Ananya Das", poolId: "tpl_005", poolName: "Open to Work — All Certified", addedDate: daysAgo(15), matchScore: 90, status: "placed" },
];

// Partner clients (employers who hire from SkillForge's talent pool)
export interface PartnerClient {
  id: string;
  name: string;
  logo: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  agreementStart: string;
  agreementEnd: string;
  commissionRate: number;
  totalPositionsRequested: number;
  totalPlacements: number;
  totalCommissionEarned: number;
  status: "active" | "trial" | "expired";
  hiringActive: boolean;
}

export const partnerClients: PartnerClient[] = [
  { id: "pc_001", name: "TechCorp India", logo: "TC", industry: "Information Technology", contactName: "Rohan Mehta", contactEmail: "rohan@techcorp.com", contactPhone: "+91 98765 43210", agreementStart: daysAgo(120), agreementEnd: daysAhead(245), commissionRate: 8.33, totalPositionsRequested: 8, totalPlacements: 2, totalCommissionEarned: 100000, status: "active", hiringActive: true },
  { id: "pc_002", name: "FinEdge Solutions", logo: "FE", industry: "Fintech", contactName: "Vikram Joshi", contactEmail: "vikram@finedge.io", contactPhone: "+91 98200 11111", agreementStart: daysAgo(90), agreementEnd: daysAhead(275), commissionRate: 8.33, totalPositionsRequested: 5, totalPlacements: 1, totalCommissionEarned: 60000, status: "active", hiringActive: true },
  { id: "pc_003", name: "DataMinds AI", logo: "DM", industry: "AI/ML", contactName: "Priya Menon", contactEmail: "priya@dataminds.ai", contactPhone: "+91 99300 22222", agreementStart: daysAgo(60), agreementEnd: daysAhead(305), commissionRate: 10, totalPositionsRequested: 6, totalPlacements: 1, totalCommissionEarned: 80000, status: "active", hiringActive: true },
  { id: "pc_004", name: "SecureBank", logo: "SB", industry: "Banking", contactName: "Anil Kumar", contactEmail: "anil@securebank.in", contactPhone: "+91 99400 33333", agreementStart: daysAgo(45), agreementEnd: daysAhead(320), commissionRate: 8.33, totalPositionsRequested: 4, totalPlacements: 0, totalCommissionEarned: 0, status: "active", hiringActive: true },
  { id: "pc_005", name: "PayBridge", logo: "PB", industry: "Fintech", contactName: "Neha Shah", contactEmail: "neha@paybridge.in", contactPhone: "+91 99500 44444", agreementStart: daysAgo(75), agreementEnd: daysAhead(290), commissionRate: 8.33, totalPositionsRequested: 3, totalPlacements: 1, totalCommissionEarned: 70000, status: "active", hiringActive: false },
  { id: "pc_006", name: "StartupX", logo: "SX", industry: "Startup", contactName: "Ravi Teja", contactEmail: "ravi@startupx.in", contactPhone: "+91 99600 55555", agreementStart: daysAgo(15), agreementEnd: daysAhead(350), commissionRate: 8.33, totalPositionsRequested: 3, totalPlacements: 0, totalCommissionEarned: 0, status: "trial", hiringActive: true },
];

// Learning paths for learner portal (career-focused)
export interface CareerPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courses: string[];
  duration: string;
  outcome: string;
  averageSalary: string;
  enrolledCount: number;
}

export const careerPaths: CareerPath[] = [
  { id: "cp_001", name: "Frontend Developer", description: "Master modern frontend development with React 19 & Next.js", icon: "Code", color: "oklch(0.55 0.13 165)", courses: ["tc_c001"], duration: "30 hours", outcome: "Production-ready React developer", averageSalary: "₹12-28L", enrolledCount: 1840 },
  { id: "cp_002", name: "DevOps Engineer", description: "Become a certified Kubernetes administrator", icon: "Cloud", color: "oklch(0.6 0.14 200)", courses: ["tc_c002"], duration: "40 hours", outcome: "CKA-certified DevOps engineer", averageSalary: "₹16-32L", enrolledCount: 2640 },
  { id: "cp_003", name: "ML Engineer", description: "Build & deploy production ML systems", icon: "Brain", color: "oklch(0.6 0.13 300)", courses: ["tc_c004"], duration: "35 hours", outcome: "Production ML engineer", averageSalary: "₹20-40L", enrolledCount: 890 },
  { id: "cp_004", name: "People Manager", description: "Transition from IC to confident leader", icon: "Users", color: "oklch(0.58 0.2 25)", courses: ["tc_c003", "tc_c005", "tc_c007"], duration: "31 hours", outcome: "Certified first-time manager", averageSalary: "₹15-35L", enrolledCount: 3120 },
  { id: "cp_005", name: "Security & Compliance Pro", description: "Master DPDP, ISO 27001, and security awareness", icon: "ShieldCheck", color: "oklch(0.55 0.13 200)", courses: ["tc_c005", "tc_c007"], duration: "11 hours", outcome: "Compliance-certified professional", averageSalary: "₹12-25L", enrolledCount: 5400 },
  { id: "cp_006", name: "B2B Sales Leader", description: "Master consultative B2B sales", icon: "TrendingUp", color: "oklch(0.6 0.16 70)", courses: ["tc_c006"], duration: "15 hours", outcome: "Certified B2B sales professional", averageSalary: "₹10-30L", enrolledCount: 1680 },
];

// Wishlist (saved courses by learners)
export interface WishlistItem {
  id: string;
  learnerId: string;
  courseId: string;
  courseName: string;
  addedDate: string;
}

export const wishlistItems: WishlistItem[] = [
  { id: "wl_001", learnerId: "il_001", courseId: "tc_c004", courseName: "Production Machine Learning with MLOps", addedDate: daysAgo(5) },
  { id: "wl_002", learnerId: "il_001", courseId: "tc_c003", courseName: "First-Time Manager Bootcamp", addedDate: daysAgo(8) },
  { id: "wl_003", learnerId: "il_005", courseId: "tc_c002", courseName: "Kubernetes for Developers (CKA Bootcamp)", addedDate: daysAgo(3) },
  { id: "wl_004", learnerId: "il_009", courseId: "tc_c001", courseName: "Advanced React 19 & Next.js", addedDate: daysAgo(2) },
];

// Community discussion threads
export interface CommunityThread {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  category: string;
  replies: number;
  views: number;
  lastReply: string;
  lastReplyBy: string;
  pinned: boolean;
  tags: string[];
}

export const communityThreads: CommunityThread[] = [
  { id: "ct_001", title: "Best resources for React 19 concurrent features?", author: "Aditya Rao", authorInitials: "AR", authorColor: "oklch(0.55 0.13 165)", category: "React", replies: 24, views: 412, lastReply: "2 hours ago", lastReplyBy: "Meera Iyer", pinned: true, tags: ["react19", "concurrent"] },
  { id: "ct_002", title: "CKA exam tips — passed with 86%!", author: "Pooja Bhat", authorInitials: "PB", authorColor: "oklch(0.6 0.13 300)", category: "Kubernetes", replies: 56, views: 1240, lastReply: "5 hours ago", lastReplyBy: "Rahul Gupta", pinned: true, tags: ["cka", "exam", "tips"] },
  { id: "ct_003", title: "How to transition from data analyst to ML engineer?", author: "Fatima Sheikh", authorInitials: "FS", authorColor: "oklch(0.58 0.2 25)", category: "Career", replies: 18, views: 320, lastReply: "1 day ago", lastReplyBy: "Karthik Menon", pinned: false, tags: ["career", "ml"] },
  { id: "ct_004", title: "DPDP Act implementation checklist for startups", author: "Sanjay Pillai", authorInitials: "SP", authorColor: "oklch(0.6 0.14 200)", category: "Compliance", replies: 32, views: 680, lastReply: "1 day ago", lastReplyBy: "Ananya Das", pinned: false, tags: ["dpdp", "compliance"] },
  { id: "ct_005", title: "First-time manager struggles — share your stories", author: "Divya Sharma", authorInitials: "DS", authorColor: "oklch(0.55 0.13 200)", category: "Leadership", replies: 41, views: 540, lastReply: "2 days ago", lastReplyBy: "Shreya Nair", pinned: false, tags: ["management", "leadership"] },
  { id: "ct_006", title: "Study group for MLOps capstone project?", author: "Karthik Menon", authorInitials: "KM", authorColor: "oklch(0.6 0.16 70)", category: "ML", replies: 12, views: 180, lastReply: "3 days ago", lastReplyBy: "Fatima Sheikh", pinned: false, tags: ["mlops", "study-group"] },
];
