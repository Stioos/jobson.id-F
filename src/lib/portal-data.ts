// ============================================================
// Portal-specific mock data (Recruiter / Agency / Enterprise)
// Extends the base mock-data.ts with portal-only concepts:
//   - recruiterRecords, agencyRecruiters
//   - requisitions, submissions, placements, commission records
//   - agencyInvoices / receivables
//   - enterpriseEntities, enterpriseTeams, headcount, budgets
//   - approval workflows, enterprise roles, sso keys, webhooks
// All data is illustrative & simulated.
// ============================================================

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString();

// ---------- Recruiter & Agency Team ----------
export interface RecruiterRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Senior Recruiter" | "Recruiter" | "Lead Recruiter" | "Sourcing Specialist";
  agencyId: string;
  agencyName: string;
  activeReqs: number;
  submissions: number;
  placements: number;
  revenue: number;
  status: "active" | "on_leave" | "inactive";
  joinedAt: string;
  lastActive: string;
  specialties: string[];
}

export const recruiterRecords: RecruiterRecord[] = [
  {
    id: "r_001",
    name: "Sneha Reddy",
    email: "sneha@talentbridge.in",
    avatar: "SR",
    role: "Senior Recruiter",
    agencyId: "ag_001",
    agencyName: "TalentBridge Consulting",
    activeReqs: 8,
    submissions: 42,
    placements: 6,
    revenue: 1450000,
    status: "active",
    joinedAt: daysAgo(540),
    lastActive: daysAgo(0),
    specialties: ["Engineering", "Product"],
  },
  {
    id: "r_002",
    name: "Karthik Menon",
    email: "karthik@talentbridge.in",
    avatar: "KM",
    role: "Lead Recruiter",
    agencyId: "ag_001",
    agencyName: "TalentBridge Consulting",
    activeReqs: 12,
    submissions: 68,
    placements: 9,
    revenue: 2180000,
    status: "active",
    joinedAt: daysAgo(720),
    lastActive: daysAgo(0),
    specialties: ["Engineering", "DevOps"],
  },
  {
    id: "r_003",
    name: "Ananya Das",
    email: "ananya@talentbridge.in",
    avatar: "AD",
    role: "Recruiter",
    agencyId: "ag_001",
    agencyName: "TalentBridge Consulting",
    activeReqs: 6,
    submissions: 31,
    placements: 3,
    revenue: 720000,
    status: "active",
    joinedAt: daysAgo(290),
    lastActive: daysAgo(1),
    specialties: ["Product", "Design"],
  },
  {
    id: "r_004",
    name: "Sanjay Pillai",
    email: "sanjay@talentbridge.in",
    avatar: "SP",
    role: "Sourcing Specialist",
    agencyId: "ag_001",
    agencyName: "TalentBridge Consulting",
    activeReqs: 4,
    submissions: 55,
    placements: 2,
    revenue: 480000,
    status: "on_leave",
    joinedAt: daysAgo(190),
    lastActive: daysAgo(5),
    specialties: ["Data", "Cloud"],
  },
  {
    id: "r_005",
    name: "Ritu Agarwal",
    email: "ritu@talentbridge.in",
    avatar: "RA",
    role: "Recruiter",
    agencyId: "ag_001",
    agencyName: "TalentBridge Consulting",
    activeReqs: 5,
    submissions: 27,
    placements: 4,
    revenue: 960000,
    status: "active",
    joinedAt: daysAgo(120),
    lastActive: daysAgo(0),
    specialties: ["Sales", "Marketing"],
  },
];

// ---------- Client Agreements ----------
export interface ClientAgreement {
  employerId: string;
  employerName: string;
  logo: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  status: "active" | "paused" | "inactive";
  commissionRate: number; // %
  paymentTerms: "net_15" | "net_30" | "net_45" | "net_60";
  guaranteePeriodDays: number;
  startDate: string;
  endDate?: string;
  openRequisitions: number;
  placementsYTD: number;
  totalRevenue: number;
  verificationStatus: "verified" | "pending" | "unverified";
  sla: "standard" | "priority" | "enterprise";
}

export const clientAgreements: ClientAgreement[] = [
  {
    employerId: "e_001",
    employerName: "TechCorp India",
    logo: "TC",
    industry: "Information Technology",
    contactName: "Rohan Mehta",
    contactEmail: "rohan.mehta@techcorp.com",
    status: "active",
    commissionRate: 8.33,
    paymentTerms: "net_30",
    guaranteePeriodDays: 90,
    startDate: "2023-01-15T09:00:00Z",
    openRequisitions: 5,
    placementsYTD: 8,
    totalRevenue: 2840000,
    verificationStatus: "verified",
    sla: "enterprise",
  },
  {
    employerId: "e_002",
    employerName: "FinEdge Solutions",
    logo: "FE",
    industry: "Fintech",
    contactName: "Vikram Joshi",
    contactEmail: "vikram@finedge.io",
    status: "active",
    commissionRate: 10,
    paymentTerms: "net_45",
    guaranteePeriodDays: 60,
    startDate: "2023-03-20T09:00:00Z",
    openRequisitions: 3,
    placementsYTD: 4,
    totalRevenue: 1620000,
    verificationStatus: "verified",
    sla: "priority",
  },
  {
    employerId: "e_003",
    employerName: "MediCore Health",
    logo: "MC",
    industry: "Healthcare",
    contactName: "Dr. Lakshmi Iyer",
    contactEmail: "lakshmi@medicore.health",
    status: "active",
    commissionRate: 9,
    paymentTerms: "net_30",
    guaranteePeriodDays: 60,
    startDate: "2023-08-01T09:00:00Z",
    openRequisitions: 2,
    placementsYTD: 3,
    totalRevenue: 540000,
    verificationStatus: "verified",
    sla: "standard",
  },
  {
    employerId: "e_005",
    employerName: "EduVerse Learning",
    logo: "EV",
    industry: "EdTech",
    contactName: "Neha Kapoor",
    contactEmail: "neha@eduverse.in",
    status: "active",
    commissionRate: 8.33,
    paymentTerms: "net_15",
    guaranteePeriodDays: 45,
    startDate: "2023-05-10T09:00:00Z",
    openRequisitions: 1,
    placementsYTD: 2,
    totalRevenue: 320000,
    verificationStatus: "verified",
    sla: "standard",
  },
  {
    employerId: "e_004",
    employerName: "GreenLeaf Energy",
    logo: "GL",
    industry: "Renewable Energy",
    contactName: "Arjun Patel",
    contactEmail: "arjun@greenleaf.energy",
    status: "paused",
    commissionRate: 7.5,
    paymentTerms: "net_45",
    guaranteePeriodDays: 45,
    startDate: "2023-09-15T09:00:00Z",
    endDate: daysAgo(30),
    openRequisitions: 0,
    placementsYTD: 1,
    totalRevenue: 180000,
    verificationStatus: "pending",
    sla: "standard",
  },
  {
    employerId: "e_006",
    employerName: "LogiMove Logistics",
    logo: "LM",
    industry: "Logistics",
    contactName: "Suresh Kumar",
    contactEmail: "suresh@logimove.in",
    status: "inactive",
    commissionRate: 8.33,
    paymentTerms: "net_60",
    guaranteePeriodDays: 30,
    startDate: "2023-06-10T09:00:00Z",
    endDate: daysAgo(90),
    openRequisitions: 0,
    placementsYTD: 0,
    totalRevenue: 0,
    verificationStatus: "unverified",
    sla: "standard",
  },
];

// ---------- Requisitions (agency-side view of client jobs) ----------
export interface Requisition {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  title: string;
  department: string;
  location: string;
  workArrangement: "remote" | "hybrid" | "onsite";
  status: "open" | "filled" | "closed" | "on_hold";
  priority: "low" | "medium" | "high" | "urgent";
  openings: number;
  salaryMin: number;
  salaryMax: number;
  feeBasis: "percentage" | "fixed";
  feeValue: number;
  recruiterId: string;
  recruiterName: string;
  submittedCount: number;
  interviewCount: number;
  placementCount: number;
  postedAt: string;
  targetHireDate: string;
}

export const requisitions: Requisition[] = [
  {
    id: "req_001", jobId: "j_001", clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    title: "Senior Frontend Engineer (React/Next.js)", department: "Engineering", location: "Bengaluru",
    workArrangement: "hybrid", status: "open", priority: "high", openings: 2, salaryMin: 1800000, salaryMax: 2800000,
    feeBasis: "percentage", feeValue: 8.33, recruiterId: "r_001", recruiterName: "Sneha Reddy",
    submittedCount: 14, interviewCount: 5, placementCount: 0, postedAt: daysAgo(7), targetHireDate: daysAhead(38),
  },
  {
    id: "req_002", jobId: "j_002", clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    title: "Backend Engineer — Distributed Systems (Go)", department: "Platform Engineering", location: "Bengaluru",
    workArrangement: "hybrid", status: "open", priority: "urgent", openings: 3, salaryMin: 2000000, salaryMax: 3200000,
    feeBasis: "percentage", feeValue: 8.33, recruiterId: "r_002", recruiterName: "Karthik Menon",
    submittedCount: 9, interviewCount: 3, placementCount: 0, postedAt: daysAgo(10), targetHireDate: daysAhead(50),
  },
  {
    id: "req_003", jobId: "j_003", clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    title: "Senior Product Manager — Payments", department: "Product", location: "Mumbai",
    workArrangement: "remote", status: "filled", priority: "high", openings: 1, salaryMin: 2500000, salaryMax: 3800000,
    feeBasis: "percentage", feeValue: 10, recruiterId: "r_003", recruiterName: "Ananya Das",
    submittedCount: 11, interviewCount: 6, placementCount: 1, postedAt: daysAgo(45), targetHireDate: daysAgo(10),
  },
  {
    id: "req_004", jobId: "j_007", clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    title: "DevOps Engineer (SRE)", department: "Infrastructure", location: "Remote",
    workArrangement: "remote", status: "open", priority: "medium", openings: 2, salaryMin: 1600000, salaryMax: 2600000,
    feeBasis: "percentage", feeValue: 10, recruiterId: "r_004", recruiterName: "Sanjay Pillai",
    submittedCount: 6, interviewCount: 2, placementCount: 0, postedAt: daysAgo(6), targetHireDate: daysAhead(48),
  },
  {
    id: "req_005", jobId: "j_004", clientId: "e_003", clientName: "MediCore Health", clientLogo: "MC",
    title: "Clinical Data Scientist", department: "Analytics & Research", location: "Chennai",
    workArrangement: "onsite", status: "open", priority: "medium", openings: 1, salaryMin: 1500000, salaryMax: 2400000,
    feeBasis: "percentage", feeValue: 9, recruiterId: "r_003", recruiterName: "Ananya Das",
    submittedCount: 4, interviewCount: 1, placementCount: 0, postedAt: daysAgo(12), targetHireDate: daysAhead(58),
  },
  {
    id: "req_006", jobId: "j_006", clientId: "e_005", clientName: "EduVerse Learning", clientLogo: "EV",
    title: "Full-Stack Engineer (MERN)", department: "Engineering", location: "Gurugram",
    workArrangement: "remote", status: "open", priority: "low", openings: 3, salaryMin: 1200000, salaryMax: 2200000,
    feeBasis: "percentage", feeValue: 8.33, recruiterId: "r_001", recruiterName: "Sneha Reddy",
    submittedCount: 18, interviewCount: 4, placementCount: 0, postedAt: daysAgo(8), targetHireDate: daysAhead(28),
  },
  {
    id: "req_007", jobId: "j_005", clientId: "e_004", clientName: "GreenLeaf Energy", clientLogo: "GL",
    title: "Solar Project Manager", department: "Projects", location: "Pune",
    workArrangement: "onsite", status: "closed", priority: "high", openings: 1, salaryMin: 1200000, salaryMax: 2000000,
    feeBasis: "fixed", feeValue: 180000, recruiterId: "r_002", recruiterName: "Karthik Menon",
    submittedCount: 7, interviewCount: 3, placementCount: 1, postedAt: daysAgo(60), targetHireDate: daysAgo(20),
  },
  {
    id: "req_008", jobId: "j_008", clientId: "e_006", clientName: "LogiMove Logistics", clientLogo: "LM",
    title: "Operations Manager — Hub", department: "Operations", location: "Nagpur",
    workArrangement: "onsite", status: "closed", priority: "medium", openings: 1, salaryMin: 900000, salaryMax: 1500000,
    feeBasis: "percentage", feeValue: 8.33, recruiterId: "r_005", recruiterName: "Ritu Agarwal",
    submittedCount: 5, interviewCount: 2, placementCount: 0, postedAt: daysAgo(75), targetHireDate: daysAgo(40),
  },
];

// ---------- Submissions ----------
export type SubmissionStatus =
  | "submitted" | "viewed" | "shortlisted" | "interviewed" | "rejected" | "placed";

export interface Submission {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateHeadline: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  requisitionId: string;
  jobTitle: string;
  recruiterId: string;
  recruiterName: string;
  submittedAt: string;
  status: SubmissionStatus;
  matchScore: number;
  clientFeedback?: string;
  clientRating?: number;
  consentGranted: boolean;
  duplicateFlag?: boolean;
  timeline: { status: SubmissionStatus; timestamp: string; actor: string; note?: string }[];
}

export const submissions: Submission[] = [
  {
    id: "sub_001", candidateId: "c_001", candidateName: "Priya Nair", candidateAvatar: "PN",
    candidateHeadline: "Senior Frontend Engineer (6y React)",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_001", jobTitle: "Senior Frontend Engineer (React/Next.js)",
    recruiterId: "r_001", recruiterName: "Sneha Reddy",
    submittedAt: daysAgo(5), status: "interviewed", matchScore: 88,
    clientFeedback: "Strong React profile — moving to technical interview.",
    clientRating: 5, consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(5), actor: "Sneha Reddy" },
      { status: "viewed", timestamp: daysAgo(4), actor: "Rohan Mehta" },
      { status: "shortlisted", timestamp: daysAgo(3), actor: "Rohan Mehta" },
      { status: "interviewed", timestamp: daysAgo(1), actor: "System" },
    ],
  },
  {
    id: "sub_002", candidateId: "c_002", candidateName: "Arjun Iyer", candidateAvatar: "AI",
    candidateHeadline: "Backend Engineer (5y Go)",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_002", jobTitle: "Backend Engineer — Distributed Systems (Go)",
    recruiterId: "r_002", recruiterName: "Karthik Menon",
    submittedAt: daysAgo(4), status: "interviewed", matchScore: 91,
    clientFeedback: "Excellent — systems design interview scheduled.",
    clientRating: 5, consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(4), actor: "Karthik Menon" },
      { status: "viewed", timestamp: daysAgo(3), actor: "Anika Verma" },
      { status: "shortlisted", timestamp: daysAgo(3), actor: "Anika Verma" },
      { status: "interviewed", timestamp: daysAgo(1), actor: "System" },
    ],
  },
  {
    id: "sub_003", candidateId: "c_003", candidateName: "Kavya Reddy", candidateAvatar: "KR",
    candidateHeadline: "Lead PM — Fintech / Payments (7y)",
    clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    requisitionId: "req_003", jobTitle: "Senior Product Manager — Payments",
    recruiterId: "r_003", recruiterName: "Ananya Das",
    submittedAt: daysAgo(20), status: "placed", matchScore: 94,
    clientFeedback: "Outstanding — offer sent & accepted. Joining in 30 days.",
    clientRating: 5, consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(20), actor: "Ananya Das" },
      { status: "viewed", timestamp: daysAgo(19), actor: "Vikram Joshi" },
      { status: "shortlisted", timestamp: daysAgo(18), actor: "Vikram Joshi" },
      { status: "interviewed", timestamp: daysAgo(10), actor: "Vikram Joshi" },
      { status: "placed", timestamp: daysAgo(8), actor: "Vikram Joshi", note: "Offer accepted ₹34L" },
    ],
  },
  {
    id: "sub_004", candidateId: "c_004", candidateName: "Vikram Singh", candidateAvatar: "VS",
    candidateHeadline: "DevOps / SRE (4y AWS)",
    clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    requisitionId: "req_004", jobTitle: "DevOps Engineer (SRE)",
    recruiterId: "r_004", recruiterName: "Sanjay Pillai",
    submittedAt: daysAgo(3), status: "shortlisted", matchScore: 79,
    clientFeedback: "Good profile, scheduling technical screen.",
    clientRating: 4, consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(3), actor: "Sanjay Pillai" },
      { status: "viewed", timestamp: daysAgo(2), actor: "Vikram Joshi" },
      { status: "shortlisted", timestamp: daysAgo(1), actor: "Vikram Joshi" },
    ],
  },
  {
    id: "sub_005", candidateId: "c_002", candidateName: "Arjun Iyer", candidateAvatar: "AI",
    candidateHeadline: "Backend Engineer (5y Go)",
    clientId: "e_005", clientName: "EduVerse Learning", clientLogo: "EV",
    requisitionId: "req_006", jobTitle: "Full-Stack Engineer (MERN)",
    recruiterId: "r_001", recruiterName: "Sneha Reddy",
    submittedAt: daysAgo(2), status: "viewed", matchScore: 64,
    consentGranted: true, duplicateFlag: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(2), actor: "Sneha Reddy" },
      { status: "viewed", timestamp: daysAgo(1), actor: "Neha Kapoor" },
    ],
  },
  {
    id: "sub_006", candidateId: "c_001", candidateName: "Priya Nair", candidateAvatar: "PN",
    candidateHeadline: "Senior Frontend Engineer (6y React)",
    clientId: "e_005", clientName: "EduVerse Learning", clientLogo: "EV",
    requisitionId: "req_006", jobTitle: "Full-Stack Engineer (MERN)",
    recruiterId: "r_001", recruiterName: "Sneha Reddy",
    submittedAt: daysAgo(6), status: "rejected", matchScore: 58,
    clientFeedback: "Strong frontend, but they need full-stack depth (Node/Mongo).",
    clientRating: 3, consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(6), actor: "Sneha Reddy" },
      { status: "viewed", timestamp: daysAgo(5), actor: "Neha Kapoor" },
      { status: "rejected", timestamp: daysAgo(2), actor: "Neha Kapoor" },
    ],
  },
  {
    id: "sub_007", candidateId: "c_003", candidateName: "Kavya Reddy", candidateAvatar: "KR",
    candidateHeadline: "Lead PM — Fintech / Payments (7y)",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_001", jobTitle: "Senior Frontend Engineer (React/Next.js)",
    recruiterId: "r_003", recruiterName: "Ananya Das",
    submittedAt: daysAgo(9), status: "rejected", matchScore: 41,
    clientFeedback: "Misalignment — candidate is PM, not frontend.",
    clientRating: 2, consentGranted: true, duplicateFlag: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(9), actor: "Ananya Das" },
      { status: "rejected", timestamp: daysAgo(8), actor: "Rohan Mehta" },
    ],
  },
  {
    id: "sub_008", candidateId: "c_004", candidateName: "Vikram Singh", candidateAvatar: "VS",
    candidateHeadline: "DevOps / SRE (4y AWS)",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_002", jobTitle: "Backend Engineer — Distributed Systems (Go)",
    recruiterId: "r_004", recruiterName: "Sanjay Pillai",
    submittedAt: daysAgo(7), status: "submitted", matchScore: 56,
    consentGranted: true,
    timeline: [
      { status: "submitted", timestamp: daysAgo(7), actor: "Sanjay Pillai" },
    ],
  },
];

// ---------- Placements ----------
export type PlacementStatus = "joined" | "notice" | "failed" | "left_within_guarantee";

export interface Placement {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  requisitionId: string;
  jobTitle: string;
  recruiterId: string;
  recruiterName: string;
  placedAt: string;
  joiningDate: string;
  salary: number;
  commissionRate: number;
  commissionAmount: number;
  baseFee: number;
  status: PlacementStatus;
  invoiceStatus: "earned" | "invoiced" | "paid" | "disputed";
  guaranteeEndsAt: string;
  commissionSplit?: { recruiterId: string; recruiterName: string; share: number; amount: number }[];
}

export const placements: Placement[] = [
  {
    id: "pl_001", candidateId: "c_003", candidateName: "Kavya Reddy", candidateAvatar: "KR",
    clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    requisitionId: "req_003", jobTitle: "Senior Product Manager — Payments",
    recruiterId: "r_003", recruiterName: "Ananya Das",
    placedAt: daysAgo(8), joiningDate: daysAhead(22), salary: 3400000,
    commissionRate: 10, baseFee: 3400000, commissionAmount: 340000,
    status: "notice", invoiceStatus: "invoiced", guaranteeEndsAt: daysAhead(82),
  },
  {
    id: "pl_002", candidateId: "c_002", candidateName: "Arjun Iyer", candidateAvatar: "AI",
    clientId: "e_004", clientName: "GreenLeaf Energy", clientLogo: "GL",
    requisitionId: "req_007", jobTitle: "Solar Project Manager",
    recruiterId: "r_002", recruiterName: "Karthik Menon",
    placedAt: daysAgo(35), joiningDate: daysAgo(5), salary: 1800000,
    commissionRate: 10, baseFee: 180000, commissionAmount: 180000,
    status: "joined", invoiceStatus: "paid", guaranteeEndsAt: daysAhead(40),
    commissionSplit: [
      { recruiterId: "r_002", recruiterName: "Karthik Menon", share: 70, amount: 126000 },
      { recruiterId: "r_001", recruiterName: "Sneha Reddy (assist)", share: 30, amount: 54000 },
    ],
  },
  {
    id: "pl_003", candidateId: "c_001", candidateName: "Priya Nair", candidateAvatar: "PN",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_x", jobTitle: "Senior Frontend Engineer (previous cycle)",
    recruiterId: "r_001", recruiterName: "Sneha Reddy",
    placedAt: daysAgo(85), joiningDate: daysAgo(55), salary: 2400000,
    commissionRate: 8.33, baseFee: 2400000, commissionAmount: 199920,
    status: "joined", invoiceStatus: "paid", guaranteeEndsAt: daysAhead(35),
  },
  {
    id: "pl_004", candidateId: "c_004", candidateName: "Vikram Singh", candidateAvatar: "VS",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_y", jobTitle: "Backend Engineer (previous cycle)",
    recruiterId: "r_005", recruiterName: "Ritu Agarwal",
    placedAt: daysAgo(120), joiningDate: daysAgo(95), salary: 2200000,
    commissionRate: 8.33, baseFee: 2200000, commissionAmount: 183260,
    status: "failed", invoiceStatus: "disputed", guaranteeEndsAt: daysAgo(5),
  },
  {
    id: "pl_005", candidateId: "c_003", candidateName: "Kavya Reddy", candidateAvatar: "KR",
    clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    requisitionId: "req_z", jobTitle: "Senior PM (previous cycle)",
    recruiterId: "r_003", recruiterName: "Ananya Das",
    placedAt: daysAgo(180), joiningDate: daysAgo(150), salary: 3000000,
    commissionRate: 8.33, baseFee: 3000000, commissionAmount: 249900,
    status: "joined", invoiceStatus: "paid", guaranteeEndsAt: daysAgo(60),
  },
];

// ---------- Commission records (reconciliation) ----------
export type CommissionStatus = "earned" | "invoiced" | "paid" | "disputed";

export interface CommissionRecord {
  id: string;
  placementId: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  recruiterName: string;
  baseFee: number;
  commissionRate: number;
  amount: number;
  status: CommissionStatus;
  date: string;
  invoiceNumber?: string;
  disputeReason?: string;
}

export const commissionRecords: CommissionRecord[] = placements.map((p, i) => ({
  id: `cm_${String(i + 1).padStart(3, "0")}`,
  placementId: p.id,
  candidateName: p.candidateName,
  clientName: p.clientName,
  jobTitle: p.jobTitle,
  recruiterName: p.recruiterName,
  baseFee: p.baseFee,
  commissionRate: p.commissionRate,
  amount: p.commissionAmount,
  status: p.invoiceStatus,
  date: p.placedAt,
  invoiceNumber: p.invoiceStatus === "invoiced" || p.invoiceStatus === "paid" ? `INV-AG-${1000 + i}` : undefined,
  disputeReason: p.invoiceStatus === "disputed" ? "Candidate left within 90-day guarantee period — refund requested by client." : undefined,
}));

// ---------- Agency invoices / receivables ----------
export interface AgencyInvoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "draft" | "disputed";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  placements: string[];
  gstin?: string;
}

export const agencyInvoices: AgencyInvoice[] = [
  {
    id: "aginv_001", number: "INV-AG-1001", clientId: "e_002", clientName: "FinEdge Solutions", clientLogo: "FE",
    amount: 340000, tax: 61200, total: 401200, status: "pending",
    issueDate: daysAgo(8), dueDate: daysAhead(37), placements: ["pl_001"], gstin: "27FGHIJ5678K1Z2",
  },
  {
    id: "aginv_002", number: "INV-AG-1000", clientId: "e_004", clientName: "GreenLeaf Energy", clientLogo: "GL",
    amount: 180000, tax: 32400, total: 212400, status: "paid",
    issueDate: daysAgo(30), dueDate: daysAgo(0), paidDate: daysAgo(2), placements: ["pl_002"], gstin: "27GREEN0001Z5",
  },
  {
    id: "aginv_003", number: "INV-AG-0998", clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    amount: 199920, tax: 35986, total: 235906, status: "paid",
    issueDate: daysAgo(50), dueDate: daysAgo(20), paidDate: daysAgo(18), placements: ["pl_003"], gstin: "29ABCDE1234F1Z5",
  },
  {
    id: "aginv_004", number: "INV-AG-0995", clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    amount: 183260, tax: 32986, total: 216246, status: "disputed",
    issueDate: daysAgo(60), dueDate: daysAgo(30), placements: ["pl_004"], gstin: "29ABCDE1234F1Z5",
  },
  {
    id: "aginv_005", number: "INV-AG-0990", clientId: "e_001", clientName: "TechCorp India", clientLogo: "TC",
    amount: 249900, tax: 44982, total: 294882, status: "paid",
    issueDate: daysAgo(150), dueDate: daysAgo(120), paidDate: daysAgo(115), placements: ["pl_005"], gstin: "29ABCDE1234F1Z5",
  },
];

// ---------- Submissions / placements monthly series ----------
export const submissionsTrend = [
  { month: "Jan", submissions: 18, interviews: 6, placements: 1 },
  { month: "Feb", submissions: 24, interviews: 8, placements: 2 },
  { month: "Mar", submissions: 30, interviews: 10, placements: 3 },
  { month: "Apr", submissions: 22, interviews: 7, placements: 1 },
  { month: "May", submissions: 28, interviews: 12, placements: 4 },
  { month: "Jun", submissions: 35, interviews: 14, placements: 3 },
  { month: "Jul", submissions: 42, interviews: 18, placements: 5 },
  { month: "Aug", submissions: 38, interviews: 16, placements: 4 },
  { month: "Sep", submissions: 45, interviews: 21, placements: 6 },
  { month: "Oct", submissions: 31, interviews: 13, placements: 3 },
];

export const commissionTrend = [
  { month: "Apr", amount: 180000 },
  { month: "May", amount: 199920 },
  { month: "Jun", amount: 249900 },
  { month: "Jul", amount: 340000 },
  { month: "Aug", amount: 0 },
  { month: "Sep", amount: 183260 },
  { month: "Oct", amount: 449820 },
];

export const commissionByClient = [
  { client: "TechCorp India", amount: 633080 },
  { client: "FinEdge Solutions", amount: 340000 },
  { client: "GreenLeaf Energy", amount: 180000 },
  { client: "EduVerse Learning", amount: 0 },
  { client: "MediCore Health", amount: 0 },
];

export const placementFunnel = [
  { stage: "Sourced", value: 320 },
  { stage: "Submitted", value: 145 },
  { stage: "Shortlisted", value: 68 },
  { stage: "Interviewed", value: 34 },
  { stage: "Offered", value: 12 },
  { stage: "Placed", value: 8 },
];

export const topClients = [
  { client: "TechCorp India", placements: 8, revenue: 633080 },
  { client: "FinEdge Solutions", placements: 4, revenue: 340000 },
  { client: "GreenLeaf Energy", placements: 1, revenue: 180000 },
  { client: "MediCore Health", placements: 3, revenue: 540000 },
  { client: "EduVerse Learning", placements: 2, revenue: 320000 },
];

export const recruiterLeaderboard = [
  { name: "Karthik Menon", placements: 9, revenue: 2180000, submissions: 68, conversion: 13.2 },
  { name: "Sneha Reddy", placements: 6, revenue: 1450000, submissions: 42, conversion: 14.3 },
  { name: "Ritu Agarwal", placements: 4, revenue: 960000, submissions: 27, conversion: 14.8 },
  { name: "Ananya Das", placements: 3, revenue: 720000, submissions: 31, conversion: 9.7 },
  { name: "Sanjay Pillai", placements: 2, revenue: 480000, submissions: 55, conversion: 3.6 },
];

// ---------- Enterprise entities & teams ----------
export interface EnterpriseEntity {
  id: string;
  name: string;
  type: "parent" | "subsidiary" | "acquired" | "brand";
  parentId?: string;
  country: string;
  hq: string;
  headcount: number;
  openReqs: number;
  admin: string;
  budget: number;
  budgetUsed: number;
  industry: string;
  createdAt: string;
}

export const enterpriseEntities: EnterpriseEntity[] = [
  {
    id: "ent_001", name: "TechCorp India", type: "parent", country: "India", hq: "Bengaluru",
    headcount: 3240, openReqs: 14, admin: "Rohan Mehta", budget: 45000000, budgetUsed: 32400000,
    industry: "Information Technology", createdAt: "2022-11-10T09:00:00Z",
  },
  {
    id: "ent_002", name: "TechCorp APAC", type: "subsidiary", parentId: "ent_001", country: "Singapore", hq: "Singapore",
    headcount: 820, openReqs: 6, admin: "Lin Wei", budget: 18000000, budgetUsed: 9200000,
    industry: "Information Technology", createdAt: "2023-02-01T09:00:00Z",
  },
  {
    id: "ent_003", name: "TechCorp EU", type: "subsidiary", parentId: "ent_001", country: "Germany", hq: "Berlin",
    headcount: 410, openReqs: 4, admin: "Hans Mueller", budget: 14000000, budgetUsed: 6100000,
    industry: "Information Technology", createdAt: "2023-05-15T09:00:00Z",
  },
  {
    id: "ent_004", name: "GreenLeaf Energy", type: "subsidiary", parentId: "ent_001", country: "India", hq: "Pune",
    headcount: 320, openReqs: 2, admin: "Arjun Patel", budget: 6000000, budgetUsed: 2400000,
    industry: "Renewable Energy", createdAt: "2023-07-12T09:00:00Z",
  },
  {
    id: "ent_005", name: "EduVerse Learning", type: "acquired", parentId: "ent_001", country: "India", hq: "Gurugram",
    headcount: 280, openReqs: 3, admin: "Neha Kapoor", budget: 5500000, budgetUsed: 3300000,
    industry: "EdTech", createdAt: "2023-02-18T09:00:00Z",
  },
];

export interface EnterpriseTeam {
  id: string;
  entityId: string;
  entityName: string;
  department: string;
  teamName: string;
  parentTeamId?: string;
  headcount: number;
  hiringManager: string;
  openReqs: number;
  performance: "exceeds" | "on_track" | "below";
}

export const enterpriseTeams: EnterpriseTeam[] = [
  { id: "t_001", entityId: "ent_001", entityName: "TechCorp India", department: "Engineering", teamName: "Platform Engineering", headcount: 84, hiringManager: "Anika Verma", openReqs: 4, performance: "exceeds" },
  { id: "t_002", entityId: "ent_001", entityName: "TechCorp India", department: "Engineering", teamName: "Frontend", parentTeamId: "t_001", headcount: 32, hiringManager: "Rohan Mehta", openReqs: 2, performance: "on_track" },
  { id: "t_003", entityId: "ent_001", entityName: "TechCorp India", department: "Product", teamName: "Core Product", headcount: 28, hiringManager: "Sara Khan", openReqs: 1, performance: "on_track" },
  { id: "t_004", entityId: "ent_001", entityName: "TechCorp India", department: "Sales", teamName: "Enterprise Sales", headcount: 45, hiringManager: "Deepak Rao", openReqs: 3, performance: "exceeds" },
  { id: "t_005", entityId: "ent_002", entityName: "TechCorp APAC", department: "Engineering", teamName: "APAC Platform", headcount: 38, hiringManager: "Lin Wei", openReqs: 2, performance: "on_track" },
  { id: "t_006", entityId: "ent_002", entityName: "TechCorp APAC", department: "Sales", teamName: "APAC Sales", headcount: 22, hiringManager: "Yuki Tanaka", openReqs: 2, performance: "below" },
  { id: "t_007", entityId: "ent_003", entityName: "TechCorp EU", department: "Engineering", teamName: "EU Engineering", headcount: 18, hiringManager: "Hans Mueller", openReqs: 2, performance: "on_track" },
  { id: "t_008", entityId: "ent_004", entityName: "GreenLeaf Energy", department: "Projects", teamName: "Solar EPC", headcount: 64, hiringManager: "Arjun Patel", openReqs: 2, performance: "exceeds" },
  { id: "t_009", entityId: "ent_005", entityName: "EduVerse Learning", department: "Engineering", teamName: "Learner Experience", headcount: 28, hiringManager: "Neha Kapoor", openReqs: 3, performance: "on_track" },
  { id: "t_010", entityId: "ent_005", entityName: "EduVerse Learning", department: "Education", teamName: "Educator Success", headcount: 42, hiringManager: "Pooja Bhat", openReqs: 0, performance: "on_track" },
];

// ---------- Headcount planning ----------
export interface HeadcountPlan {
  id: string;
  entityId: string;
  entityName: string;
  department: string;
  current: number;
  planned: number;
  approved: number;
  inPipeline: number;
  gap: number;
  forecast90d: number;
}

export const headcountPlans: HeadcountPlan[] = [
  { id: "hc_001", entityId: "ent_001", entityName: "TechCorp India", department: "Engineering", current: 220, planned: 18, approved: 12, inPipeline: 6, gap: 0, forecast90d: 232 },
  { id: "hc_002", entityId: "ent_001", entityName: "TechCorp India", department: "Product", current: 28, planned: 6, approved: 3, inPipeline: 2, gap: 1, forecast90d: 31 },
  { id: "hc_003", entityId: "ent_001", entityName: "TechCorp India", department: "Sales", current: 45, planned: 12, approved: 9, inPipeline: 4, gap: -1, forecast90d: 53 },
  { id: "hc_004", entityId: "ent_001", entityName: "TechCorp India", department: "Marketing", current: 18, planned: 4, approved: 2, inPipeline: 1, gap: 1, forecast90d: 21 },
  { id: "hc_005", entityId: "ent_002", entityName: "TechCorp APAC", department: "Engineering", current: 38, planned: 8, approved: 4, inPipeline: 2, gap: 2, forecast90d: 44 },
  { id: "hc_006", entityId: "ent_002", entityName: "TechCorp APAC", department: "Sales", current: 22, planned: 6, approved: 4, inPipeline: 1, gap: 1, forecast90d: 27 },
  { id: "hc_007", entityId: "ent_003", entityName: "TechCorp EU", department: "Engineering", current: 18, planned: 6, approved: 2, inPipeline: 1, gap: 3, forecast90d: 21 },
  { id: "hc_008", entityId: "ent_004", entityName: "GreenLeaf Energy", department: "Projects", current: 64, planned: 4, approved: 2, inPipeline: 1, gap: 1, forecast90d: 66 },
  { id: "hc_009", entityId: "ent_005", entityName: "EduVerse Learning", department: "Engineering", current: 28, planned: 6, approved: 3, inPipeline: 1, gap: 2, forecast90d: 31 },
];

// ---------- Recruitment budgets ----------
export interface BudgetRow {
  id: string;
  entityId: string;
  entityName: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
}

export const budgetRows: BudgetRow[] = [
  { id: "bg_001", entityId: "ent_001", entityName: "TechCorp India", department: "Engineering", allocated: 18000000, spent: 13200000, remaining: 4800000, utilization: 73.3 },
  { id: "bg_002", entityId: "ent_001", entityName: "TechCorp India", department: "Product", allocated: 6000000, spent: 4800000, remaining: 1200000, utilization: 80 },
  { id: "bg_003", entityId: "ent_001", entityName: "TechCorp India", department: "Sales", allocated: 12000000, spent: 11400000, remaining: 600000, utilization: 95 },
  { id: "bg_004", entityId: "ent_001", entityName: "TechCorp India", department: "Marketing", allocated: 4000000, spent: 2400000, remaining: 1600000, utilization: 60 },
  { id: "bg_005", entityId: "ent_002", entityName: "TechCorp APAC", department: "All", allocated: 18000000, spent: 9200000, remaining: 8800000, utilization: 51.1 },
  { id: "bg_006", entityId: "ent_003", entityName: "TechCorp EU", department: "All", allocated: 14000000, spent: 6100000, remaining: 7900000, utilization: 43.6 },
  { id: "bg_007", entityId: "ent_004", entityName: "GreenLeaf Energy", department: "All", allocated: 6000000, spent: 2400000, remaining: 3600000, utilization: 40 },
  { id: "bg_008", entityId: "ent_005", entityName: "EduVerse Learning", department: "All", allocated: 5500000, spent: 3300000, remaining: 2200000, utilization: 60 },
];

export const budgetByCategory = [
  { category: "Job Posts & Branding", value: 8400000 },
  { category: "Agency Fees", value: 12300000 },
  { category: "Referral Bonuses", value: 3200000 },
  { category: "Assessment Tools", value: 1800000 },
  { category: "Background Checks", value: 900000 },
  { category: "Events & Sourcing", value: 1500000 },
];

export const budgetUtilizationTrend = [
  { month: "Apr", TechCorp: 8.4, APAC: 4.2, EU: 2.1 },
  { month: "May", TechCorp: 11.2, APAC: 5.8, EU: 3.4 },
  { month: "Jun", TechCorp: 15.0, APAC: 6.6, EU: 4.0 },
  { month: "Jul", TechCorp: 19.8, APAC: 7.4, EU: 4.8 },
  { month: "Aug", TechCorp: 24.6, APAC: 8.2, EU: 5.6 },
  { month: "Sep", TechCorp: 28.4, APAC: 9.0, EU: 6.1 },
  { month: "Oct", TechCorp: 32.4, APAC: 9.2, EU: 6.1 },
];

// ---------- Approvals ----------
export interface ApprovalRequest {
  id: string;
  type: "requisition" | "budget" | "offer" | "headcount";
  title: string;
  requester: string;
  entity: string;
  department: string;
  amount?: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  chain: { role: string; name: string; status: "pending" | "approved" | "rejected" | "skipped"; comment?: string; timestamp?: string }[];
}

export const approvalRequests: ApprovalRequest[] = [
  {
    id: "apr_001", type: "requisition", title: "Engineering Manager — Platform (REQ-2024-0150)",
    requester: "Anika Verma", entity: "TechCorp India", department: "Platform Engineering",
    amount: 5200000, status: "pending", submittedAt: daysAgo(1),
    chain: [
      { role: "Hiring Manager", name: "Anika Verma", status: "approved", comment: "Critical role for K8s migration.", timestamp: daysAgo(1) },
      { role: "Department Head", name: "Sara Khan", status: "approved", comment: "Endorsed.", timestamp: daysAgo(1) },
      { role: "Finance", name: "Anil Gupta", status: "pending" },
      { role: "Entity Admin", name: "Rohan Mehta", status: "pending" },
    ],
  },
  {
    id: "apr_002", type: "budget", title: "Q4 Marketing hiring budget (+₹12L)",
    requester: "Deepak Rao", entity: "TechCorp India", department: "Marketing",
    amount: 1200000, status: "pending", submittedAt: daysAgo(2),
    chain: [
      { role: "Department Head", name: "Deepak Rao", status: "approved", timestamp: daysAgo(2) },
      { role: "Finance", name: "Anil Gupta", status: "pending" },
      { role: "Entity Admin", name: "Rohan Mehta", status: "pending" },
    ],
  },
  {
    id: "apr_003", type: "offer", title: "Offer: Kavya Reddy — Senior PM (₹34L)",
    requester: "Vikram Joshi", entity: "FinEdge Solutions", department: "Product",
    amount: 3400000, status: "pending", submittedAt: daysAgo(3),
    chain: [
      { role: "Hiring Manager", name: "Vikram Joshi", status: "approved", timestamp: daysAgo(3) },
      { role: "HRBP", name: "Meera Krishnan", status: "approved", timestamp: daysAgo(2) },
      { role: "Finance", name: "Anil Gupta", status: "pending" },
    ],
  },
  {
    id: "apr_004", type: "headcount", title: "+3 headcount — APAC Sales",
    requester: "Yuki Tanaka", entity: "TechCorp APAC", department: "Sales",
    status: "pending", submittedAt: daysAgo(4),
    chain: [
      { role: "Department Head", name: "Yuki Tanaka", status: "approved", timestamp: daysAgo(4) },
      { role: "Entity Admin", name: "Lin Wei", status: "pending" },
      { role: "Group HR", name: "Rohan Mehta", status: "pending" },
    ],
  },
  {
    id: "apr_005", type: "requisition", title: "Junior QA Engineer (REQ-2024-0151)",
    requester: "Rohan Mehta", entity: "TechCorp India", department: "Quality",
    amount: 1000000, status: "approved", submittedAt: daysAgo(7),
    chain: [
      { role: "Hiring Manager", name: "Rohan Mehta", status: "approved", timestamp: daysAgo(7) },
      { role: "Department Head", name: "Sara Khan", status: "approved", timestamp: daysAgo(6) },
      { role: "Finance", name: "Anil Gupta", status: "approved", comment: "Within Q4 budget.", timestamp: daysAgo(5) },
      { role: "Entity Admin", name: "Rohan Mehta", status: "approved", timestamp: daysAgo(4) },
    ],
  },
];

// ---------- Enterprise roles & access matrix ----------
export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isCustom: boolean;
  system: boolean;
}

export const enterpriseRoles: EnterpriseRole[] = [
  { id: "er_001", name: "Enterprise Admin", description: "Full access across all entities.", memberCount: 4, isCustom: false, system: true },
  { id: "er_002", name: "Entity Admin", description: "Manage a single entity's hiring.", memberCount: 6, isCustom: false, system: true },
  { id: "er_003", name: "Hiring Manager", description: "Create/own reqs and approve offers.", memberCount: 28, isCustom: false, system: true },
  { id: "er_004", name: "Recruiter (in-house)", description: "Source & submit candidates.", memberCount: 12, isCustom: false, system: true },
  { id: "er_005", name: "Interviewer", description: "Submit interview feedback only.", memberCount: 64, isCustom: false, system: true },
  { id: "er_006", name: "Billing Manager", description: "View invoices & approve budgets.", memberCount: 3, isCustom: false, system: true },
  { id: "er_007", name: "Auditor (read-only)", description: "Read-only access to audit logs.", memberCount: 2, isCustom: true, system: false },
];

export const accessMatrix: { permission: string; roles: Record<string, boolean> }[] = [
  { permission: "View dashboard", roles: { er_001: true, er_002: true, er_003: true, er_004: true, er_005: true, er_006: true, er_007: true } },
  { permission: "Create requisition", roles: { er_001: true, er_002: true, er_003: true, er_004: false, er_005: false, er_006: false, er_007: false } },
  { permission: "Approve requisition", roles: { er_001: true, er_002: true, er_003: false, er_004: false, er_005: false, er_006: false, er_007: false } },
  { permission: "View applicants", roles: { er_001: true, er_002: true, er_003: true, er_004: true, er_005: false, er_006: false, er_007: true } },
  { permission: "Submit feedback", roles: { er_001: true, er_002: true, er_003: true, er_004: false, er_005: true, er_006: false, er_007: false } },
  { permission: "Make offer", roles: { er_001: true, er_002: true, er_003: true, er_004: false, er_005: false, er_006: false, er_007: false } },
  { permission: "Manage budget", roles: { er_001: true, er_002: true, er_003: false, er_004: false, er_005: false, er_006: true, er_007: false } },
  { permission: "View invoices", roles: { er_001: true, er_002: false, er_003: false, er_004: false, er_005: false, er_006: true, er_007: true } },
  { permission: "View audit logs", roles: { er_001: true, er_002: false, er_003: false, er_004: false, er_005: false, er_006: false, er_007: true } },
  { permission: "Manage SSO/keys", roles: { er_001: true, er_002: false, er_003: false, er_004: false, er_005: false, er_006: false, er_007: false } },
  { permission: "Cross-entity visibility", roles: { er_001: true, er_002: false, er_003: false, er_004: false, er_005: false, er_006: false, er_007: true } },
];

// ---------- SSO / API keys / webhooks ----------
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed?: string;
  status: "active" | "revoked";
  createdBy: string;
}

export const apiKeys: ApiKey[] = [
  { id: "k_001", name: "ATS Sync (Greenhouse)", prefix: "jb_live_8f2a", scopes: ["jobs:read", "jobs:write", "applications:read"], createdAt: daysAgo(60), lastUsed: daysAgo(0), status: "active", createdBy: "Rohan Mehta" },
  { id: "k_002", name: "HRIS Push (Workday)", prefix: "jb_live_4c91", scopes: ["hires:write", "candidates:read"], createdAt: daysAgo(120), lastUsed: daysAgo(1), status: "active", createdBy: "Anil Gupta" },
  { id: "k_003", name: "Slack Notifications", prefix: "jb_live_2b7e", scopes: ["events:read"], createdAt: daysAgo(45), lastUsed: daysAgo(0), status: "active", createdBy: "Anika Verma" },
  { id: "k_004", name: "Legacy webhook (revoked)", prefix: "jb_live_x9d3", scopes: ["applications:read"], createdAt: daysAgo(280), status: "revoked", createdBy: "Rohan Mehta" },
];

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: "active" | "paused";
  lastDelivery: string;
  successRate: number;
}

export const webhookConfigs: WebhookConfig[] = [
  { id: "wh_001", url: "https://api.techcorp.com/hooks/jobs", events: ["job.published", "job.closed", "application.submitted"], status: "active", lastDelivery: daysAgo(0), successRate: 99.6 },
  { id: "wh_002", url: "https://hooks.slack.com/services/T0001/B0001/XXXX", events: ["offer.sent", "candidate.hired"], status: "active", lastDelivery: daysAgo(0), successRate: 100 },
  { id: "wh_003", url: "https://api.workday.com/ingest/jobs", events: ["candidate.hired"], status: "paused", lastDelivery: daysAgo(10), successRate: 88.4 },
];

export const ipAllowlist = [
  { ip: "203.0.113.0/24", label: "TechCorp HQ (Bengaluru)", addedAt: daysAgo(180), addedBy: "Rohan Mehta" },
  { ip: "198.51.100.42", label: "Anil Gupta (Finance)", addedAt: daysAgo(120), addedBy: "Rohan Mehta" },
  { ip: "203.0.113.88", label: "Vikram Joshi (FinEdge)", addedAt: daysAgo(60), addedBy: "Rohan Mehta" },
];

// ---------- Enterprise billing & contracts ----------
export interface EnterpriseContract {
  id: string;
  name: string;
  entity: string;
  tier: "enterprise" | "business";
  status: "active" | "pending_renewal" | "expired";
  startDate: string;
  endDate: string;
  annualValue: number;
  seats: number;
  sla: string;
  autoRenew: boolean;
}

export const enterpriseContracts: EnterpriseContract[] = [
  { id: "ec_001", name: "TechCorp Group — Master Agreement", entity: "TechCorp India (group-wide)", tier: "enterprise", status: "active", startDate: "2023-01-15T09:00:00Z", endDate: daysAhead(80), annualValue: 4500000, seats: 200, sla: "99.9% uptime · 1h P1 response · dedicated CSM", autoRenew: true },
  { id: "ec_002", name: "TechCorp APAC — Addendum", entity: "TechCorp APAC", tier: "enterprise", status: "active", startDate: "2023-02-01T09:00:00Z", endDate: daysAhead(80), annualValue: 900000, seats: 40, sla: "99.9% uptime · 1h P1 response", autoRenew: true },
  { id: "ec_003", name: "GreenLeaf Energy — Subsidiary", entity: "GreenLeaf Energy", tier: "business", status: "pending_renewal", startDate: "2023-07-12T09:00:00Z", endDate: daysAhead(20), annualValue: 399990, seats: 15, sla: "99.5% uptime · 4h P1 response", autoRenew: false },
  { id: "ec_004", name: "EduVerse Learning — Acquisition", entity: "EduVerse Learning", tier: "business", status: "active", startDate: "2023-02-18T09:00:00Z", endDate: daysAhead(150), annualValue: 399990, seats: 25, sla: "99.5% uptime · 4h P1 response", autoRenew: true },
];

export interface CreditNote {
  id: string;
  number: string;
  clientName: string;
  amount: number;
  reason: string;
  date: string;
}

export const creditNotes: CreditNote[] = [
  { id: "cn_001", number: "CN-2024-014", clientName: "TechCorp India", amount: 183260, reason: "Placement reversal — candidate left within 90-day guarantee.", date: daysAgo(5) },
  { id: "cn_002", number: "CN-2024-009", clientName: "FinEdge Solutions", amount: 28000, reason: "Pro-rated refund — seat reduction from 35 to 30.", date: daysAgo(45) },
];

// ---------- Shared talent pool (enterprise) ----------
export interface SharedTalentPool {
  id: string;
  name: string;
  description: string;
  candidateCount: number;
  owner: string;
  sharedWith: string[]; // entity ids
  sharingPolicy: "private" | "shared_with_entities" | "group_wide";
  createdAt: string;
}

export const sharedTalentPools: SharedTalentPool[] = [
  { id: "stp_001", name: "Senior Engineering Leadership", description: "Pre-vetted Staff+ engineers across the group.", candidateCount: 84, owner: "Rohan Mehta", sharedWith: ["ent_001", "ent_002", "ent_003"], sharingPolicy: "shared_with_entities", createdAt: daysAgo(120) },
  { id: "stp_002", name: "APAC Sales Talent", description: "APAC-focused enterprise sales reps.", candidateCount: 132, owner: "Lin Wei", sharedWith: ["ent_002"], sharingPolicy: "private", createdAt: daysAgo(80) },
  { id: "stp_003", name: "Renewable Energy Engineers", description: "Solar, wind, BESS engineers.", candidateCount: 56, owner: "Arjun Patel", sharedWith: ["ent_004", "ent_001"], sharingPolicy: "shared_with_entities", createdAt: daysAgo(60) },
  { id: "stp_004", name: "EdTech Product & Content", description: "PMs, content strategists for learning.", candidateCount: 38, owner: "Neha Kapoor", sharedWith: ["ent_005"], sharingPolicy: "private", createdAt: daysAgo(45) },
  { id: "stp_005", name: "Group-wide Campus Hires", description: "Top campus talent pool, all entities.", candidateCount: 220, owner: "Group HR", sharedWith: ["ent_001", "ent_002", "ent_003", "ent_004", "ent_005"], sharingPolicy: "group_wide", createdAt: daysAgo(150) },
];

// ---------- Recruiter tasks / quick actions / templates ----------
export const recruiterTasks = [
  { id: "tsk_1", label: "Schedule technical interview — Priya Nair", dueIn: "today", priority: "high", client: "TechCorp India" },
  { id: "tsk_2", label: "Send candidate feedback to Arjun Iyer", dueIn: "today", priority: "medium", client: "TechCorp India" },
  { id: "tsk_3", label: "Follow up — FinEdge offer (Kavya)", dueIn: "tomorrow", priority: "high", client: "FinEdge Solutions" },
  { id: "tsk_4", label: "Source 5 Go engineers for req_002", dueIn: "2 days", priority: "urgent", client: "TechCorp India" },
  { id: "tsk_5", label: "Submit EduVerse full-stack shortlist", dueIn: "3 days", priority: "medium", client: "EduVerse Learning" },
];

export const messageTemplates = [
  { id: "tpl_1", name: "Initial outreach", body: "Hi {{candidateName}}, I'm {{recruiterName}} from TalentBridge. I came across your profile and wanted to discuss a {{jobTitle}} opportunity at {{clientName}}. Are you open to a quick chat this week?" },
  { id: "tpl_2", name: "Interview confirmation", body: "Hi {{candidateName}}, confirming your interview for {{jobTitle}} at {{clientName}} on {{date}}. Details: {{meetingLink}}. Looking forward!" },
  { id: "tpl_3", name: "Offer follow-up", body: "Hi {{candidateName}}, following up on the offer from {{clientName}}. Happy to walk you through any clauses. Deadline: {{deadline}}." },
  { id: "tpl_4", name: "Rejection (gentle)", body: "Hi {{candidateName}}, thanks for your time with {{clientName}}. While your profile was strong, they're moving forward with another candidate. We'll keep you in mind for future roles." },
];

export const recruiterFaqs = [
  { q: "How are commission rates set?", a: "Commission rates are configurable per client agreement. The agency default is 8.33% (1 month gross salary), but specific clients may negotiate higher (e.g., FinEdge = 10%) or fixed-fee engagements (GreenLeaf Solar PM)." },
  { q: "What happens if a candidate leaves within the guarantee period?", a: "Standard guarantee is 60–90 days. If a placed candidate leaves voluntarily or is terminated within this window, the agency issues a credit note or provides a free replacement per the client agreement." },
  { q: "Can the same candidate be submitted to multiple clients?", a: "Yes, but only with explicit candidate consent. Duplicate submissions to the same client for the same role are blocked automatically. Cross-recruiter duplicate submissions trigger a review flag." },
  { q: "How is revenue split when multiple recruiters collaborate?", a: "Splits are configurable per placement. The Lead Recruiter typically receives 70% of the commission; the assisting recruiter receives 30%. All splits are visible in the commission reconciliation view." },
  { q: "What is the standard payment terms cycle?", a: "Payment terms vary by client agreement: Net 15 (EduVerse), Net 30 (TechCorp, MediCore), Net 45 (FinEdge, GreenLeaf), Net 60 (LogiMove). Invoices are auto-generated upon candidate joining." },
];
