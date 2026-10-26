import type {
  Partner, PartnerApplication, Lead, RevenueShareRule, RevenueSplit,
  Settlement, WalletTransaction, TrainingCentre, Batch, College,
  CollegePartnershipModel, ServiceCatalogItem, Engagement, JobOrder,
  Onboarding, Timesheet, Hotlist, EmailTemplate, Program, PartnerModel,
} from "./partner-types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(now + d * 86400000).toISOString();

// ============================================================
// PROGRAMS
// ============================================================
export const programs: Program[] = [
  { id: "prog_001", code: "JN-FE-301", name: "Full-Stack Engineering Program", category: "Technology", description: "12-week immersive full-stack program covering React, Node.js, databases, and deployment.", durationWeeks: 12, defaultPrice: 45000, currency: "INR", jobsonnPct: 40, partnerPct: 60, deliveryModes: ["online", "offline", "hybrid"], certifications: ["JOBSONN Full-Stack Certificate"], targetRoles: ["Full-Stack Developer", "Frontend Developer", "Backend Developer"], active: true },
  { id: "prog_002", code: "JN-DS-201", name: "Data Science & Analytics", category: "Data & AI", description: "10-week data science program with Python, ML, and visualization.", durationWeeks: 10, defaultPrice: 38000, currency: "INR", jobsonnPct: 40, partnerPct: 60, deliveryModes: ["online", "offline"], certifications: ["JOBSONN Data Science Certificate"], targetRoles: ["Data Analyst", "Data Scientist", "ML Engineer"], active: true },
  { id: "prog_003", code: "JN-DM-101", name: "Digital Marketing Mastery", category: "Marketing", description: "8-week digital marketing program covering SEO, SEM, social, and analytics.", durationWeeks: 8, defaultPrice: 25000, currency: "INR", jobsonnPct: 45, partnerPct: 55, deliveryModes: ["online", "offline", "hybrid"], certifications: ["JOBSONN Digital Marketing Certificate"], targetRoles: ["Digital Marketing Specialist", "SEO Specialist", "Social Media Manager"], active: true },
  { id: "prog_004", code: "JN-CS-201", name: "Cybersecurity Essentials", category: "Security", description: "10-week cybersecurity program with hands-on labs.", durationWeeks: 10, defaultPrice: 42000, currency: "INR", jobsonnPct: 40, partnerPct: 60, deliveryModes: ["offline", "hybrid"], certifications: ["JOBSONN Security Certificate"], targetRoles: ["Security Analyst", "SOC Analyst", "Penetration Tester"], active: true },
  { id: "prog_005", code: "JN-Cloud-301", name: "Cloud & DevOps Engineering", category: "Cloud", description: "12-week cloud + DevOps program (AWS, K8s, CI/CD).", durationWeeks: 12, defaultPrice: 48000, currency: "INR", jobsonnPct: 40, partnerPct: 60, deliveryModes: ["online", "hybrid"], certifications: ["JOBSONN Cloud DevOps Certificate"], targetRoles: ["DevOps Engineer", "Cloud Engineer", "SRE"], active: true },
  { id: "prog_006", code: "JN-UX-201", name: "UI/UX Design Program", category: "Design", description: "8-week design program covering Figma, research, and prototyping.", durationWeeks: 8, defaultPrice: 32000, currency: "INR", jobsonnPct: 45, partnerPct: 55, deliveryModes: ["online", "offline"], certifications: ["JOBSONN UX Design Certificate"], targetRoles: ["UX Designer", "UI Designer", "Product Designer"], active: true },
];

// ============================================================
// REVENUE SHARE RULES
// ============================================================
export const revenueShareRules: RevenueShareRule[] = [
  { id: "rsr_001", leadSource: "PARTNER_GENERATED", partnerModel: "CENTRE", partnerPct: 70, jobsonnPct: 30, priority: 100, active: true, ruleName: "Centre — partner-generated lead" },
  { id: "rsr_002", leadSource: "JOBSONN_GENERATED", partnerModel: "CENTRE", partnerPct: 60, jobsonnPct: 40, priority: 90, active: true, ruleName: "Centre — JOBSONN-generated lead" },
  { id: "rsr_003", leadSource: "JOBSONN_DELIVERY", partnerModel: "CENTRE", partnerPct: 50, jobsonnPct: 50, priority: 95, active: true, ruleName: "Centre — JOBSONN lead + delivery" },
  { id: "rsr_004", leadSource: "WALK_IN", partnerModel: "CENTRE", partnerPct: 70, jobsonnPct: 30, priority: 80, active: true, ruleName: "Centre — walk-in" },
  { id: "rsr_005", leadSource: "WEBSITE", partnerModel: "CENTRE", partnerPct: 60, jobsonnPct: 40, priority: 70, active: true, ruleName: "Centre — website enquiry" },
  { id: "rsr_006", leadSource: "PARTNER_GENERATED", partnerModel: "COLLEGE", partnerPct: 65, jobsonnPct: 35, priority: 100, active: true, ruleName: "College — partner-generated" },
  { id: "rsr_007", leadSource: "JOBSONN_GENERATED", partnerModel: "COLLEGE", partnerPct: 55, jobsonnPct: 45, priority: 90, active: true, ruleName: "College — JOBSONN-generated" },
  { id: "rsr_008", leadSource: "PARTNER_GENERATED", partnerModel: "SERVICE", partnerPct: 75, jobsonnPct: 25, priority: 100, active: true, ruleName: "Service — partner-generated" },
  { id: "rsr_009", leadSource: "JOBSONN_GENERATED", partnerModel: "SERVICE", partnerPct: 60, jobsonnPct: 40, priority: 90, active: true, ruleName: "Service — JOBSONN-generated" },
  { id: "rsr_010", leadSource: "PARTNER_GENERATED", partnerModel: "TECHNOLOGY", partnerPct: 72, jobsonnPct: 28, priority: 100, active: true, ruleName: "Technology — partner-generated" },
  { id: "rsr_011", leadSource: "PARTNER_GENERATED", partnerModel: "AI", partnerPct: 70, jobsonnPct: 30, priority: 100, active: true, ruleName: "AI — partner-generated" },
  { id: "rsr_012", leadSource: "PARTNER_GENERATED", partnerModel: "RECRUITMENT", partnerPct: 68, jobsonnPct: 32, priority: 100, active: true, ruleName: "Recruitment — partner-generated" },
  { id: "rsr_013", leadSource: "DIGITAL_REFERRAL", partnerModel: "RECRUITMENT", partnerPct: 40, jobsonnPct: 60, priority: 70, active: true, ruleName: "Recruitment — digital referral" },
];

// ============================================================
// PARTNERS (the 6 franchise models)
// ============================================================
export const partners: Partner[] = [
  { id: "ptn_001", name: "Chennai Tech Academy", legalName: "Chennai Tech Academy Pvt Ltd", model: "CENTRE", tier: "premium", status: "active", logo: "CT", contactName: "Rajesh Kumar", contactEmail: "rajesh@chennaittechacademy.in", contactPhone: "+91 98400 12345", city: "Chennai", state: "Tamil Nadu", territory: "Chennai East", establishedYear: 2018, joinedAt: daysAgo(420), agreementStart: daysAgo(420), agreementEnd: daysAhead(310), studentsEnrolled: 1240, studentsGraduated: 980, revenueYTD: 3840000, settlementsYTD: 2688000, walletBalance: 184000, pendingSettlement: 320000, rating: 4.7, capabilities: { centreManagement: "ENABLED", centreInspection: "ENABLED", infrastructure: "ENABLED", physicalTraining: "ENABLED", localDelivery: "ENABLED", serviceDelivery: "CONFIGURABLE", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "ENABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "ENABLED", certificationAccess: "ENABLED" }, accreditation: ["NSDC Approved", "ISO 29993"], specialities: ["Technology", "Data & AI", "Cloud"] },
  { id: "ptn_002", name: "Bengaluru Skills Centre", legalName: "Bengaluru Skills Centre LLP", model: "CENTRE", tier: "standard", status: "active", logo: "BS", contactName: "Lakshmi Nair", contactEmail: "lakshmi@bscbengaluru.in", contactPhone: "+91 99000 23456", city: "Bengaluru", state: "Karnataka", territory: "Bengaluru South", establishedYear: 2020, joinedAt: daysAgo(280), agreementStart: daysAgo(280), agreementEnd: daysAhead(85), studentsEnrolled: 680, studentsGraduated: 420, revenueYTD: 2100000, settlementsYTD: 1470000, walletBalance: 92000, pendingSettlement: 180000, rating: 4.4, capabilities: { centreManagement: "ENABLED", centreInspection: "ENABLED", infrastructure: "ENABLED", physicalTraining: "ENABLED", localDelivery: "ENABLED", serviceDelivery: "DISABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "ENABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "ENABLED", certificationAccess: "ENABLED" }, accreditation: ["NSDC Approved"], specialities: ["Technology", "Design"] },
  { id: "ptn_003", name: "Kanchana Institute of Technology", legalName: "Kanchana Institute of Technology", model: "COLLEGE", tier: "premium", status: "active", logo: "KI", contactName: "Dr. Suresh Kanchana", contactEmail: "suresh@kanchana.edu.in", contactPhone: "+91 98400 34567", city: "Coimbatore", state: "Tamil Nadu", establishedYear: 2005, joinedAt: daysAgo(180), agreementStart: daysAgo(180), agreementEnd: daysAhead(550), studentsEnrolled: 840, studentsGraduated: 320, revenueYTD: 1680000, settlementsYTD: 1176000, walletBalance: 124000, pendingSettlement: 210000, rating: 4.6, capabilities: { centreManagement: "DISABLED", centreInspection: "CONFIGURABLE", infrastructure: "ENABLED", physicalTraining: "ENABLED", localDelivery: "ENABLED", serviceDelivery: "DISABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "ENABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "ENABLED", certificationAccess: "ENABLED" }, accreditation: ["NAAC A++", "NBA Accredited", "AICTE Approved"], specialities: ["Engineering", "Technology"] },
  { id: "ptn_004", name: "Meridian IT Services", legalName: "Meridian IT Services Pvt Ltd", model: "SERVICE", tier: "premium", status: "active", logo: "MI", contactName: "Arvind Menon", contactEmail: "arvind@meridianit.in", contactPhone: "+91 99000 45678", city: "Hyderabad", state: "Telangana", establishedYear: 2016, joinedAt: daysAgo(340), agreementStart: daysAgo(340), agreementEnd: daysAhead(25), studentsEnrolled: 0, studentsGraduated: 0, revenueYTD: 5200000, settlementsYTD: 3900000, walletBalance: 340000, pendingSettlement: 480000, rating: 4.5, capabilities: { centreManagement: "DISABLED", centreInspection: "DISABLED", infrastructure: "DISABLED", physicalTraining: "DISABLED", localDelivery: "ENABLED", serviceDelivery: "ENABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "DISABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "DISABLED", certificationAccess: "CONFIGURABLE" }, specialities: ["IT Services", "Cloud Migration", "DevOps"] },
  { id: "ptn_005", name: "Northwind Tech Solutions", legalName: "Northwind Tech Solutions LLP", model: "TECHNOLOGY", tier: "enterprise", status: "active", logo: "NT", contactName: "Priya Gupta", contactEmail: "priya@northwindtech.in", contactPhone: "+91 99000 56789", city: "Pune", state: "Maharashtra", establishedYear: 2014, joinedAt: daysAgo(400), agreementStart: daysAgo(400), agreementEnd: daysAhead(330), studentsEnrolled: 0, studentsGraduated: 0, revenueYTD: 6800000, settlementsYTD: 4896000, walletBalance: 420000, pendingSettlement: 620000, rating: 4.8, capabilities: { centreManagement: "DISABLED", centreInspection: "DISABLED", infrastructure: "DISABLED", physicalTraining: "DISABLED", localDelivery: "ENABLED", serviceDelivery: "ENABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "DISABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "DISABLED", certificationAccess: "ENABLED" }, specialities: ["ERP", "CRM", "Cloud Infrastructure", "OEM Partner: Microsoft, AWS"] },
  { id: "ptn_006", name: "CogniAI Labs", legalName: "CogniAI Labs Pvt Ltd", model: "AI", tier: "premium", status: "active", logo: "CA", contactName: "Dr. Anika Reddy", contactEmail: "anika@cogniailabs.ai", contactPhone: "+91 99000 67890", city: "Bengaluru", state: "Karnataka", establishedYear: 2021, joinedAt: daysAgo(150), agreementStart: daysAgo(150), agreementEnd: daysAhead(580), studentsEnrolled: 0, studentsGraduated: 0, revenueYTD: 3400000, settlementsYTD: 2380000, walletBalance: 180000, pendingSettlement: 290000, rating: 4.6, capabilities: { centreManagement: "DISABLED", centreInspection: "DISABLED", infrastructure: "DISABLED", physicalTraining: "DISABLED", localDelivery: "ENABLED", serviceDelivery: "ENABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "DISABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "DISABLED", certificationAccess: "ENABLED" }, specialities: ["Document AI", "NLP", "Computer Vision", "GPU Credits Granted"] },
  { id: "ptn_007", name: "HireBridge Staffing", legalName: "HireBridge Staffing Solutions Pvt Ltd", model: "RECRUITMENT", tier: "premium", status: "active", logo: "HB", contactName: "Karthik Subramanian", contactEmail: "karthik@hirebridge.in", contactPhone: "+91 99000 78901", city: "Chennai", state: "Tamil Nadu", establishedYear: 2017, joinedAt: daysAgo(310), agreementStart: daysAgo(310), agreementEnd: daysAhead(55), studentsEnrolled: 0, studentsGraduated: 0, revenueYTD: 4600000, settlementsYTD: 3128000, walletBalance: 280000, pendingSettlement: 410000, rating: 4.5, capabilities: { centreManagement: "DISABLED", centreInspection: "DISABLED", infrastructure: "DISABLED", physicalTraining: "DISABLED", localDelivery: "ENABLED", serviceDelivery: "ENABLED", leadGeneration: "ENABLED", counselling: "ENABLED", admissions: "DISABLED", referrals: "ENABLED", marketing: "ENABLED", wallet: "ENABLED", settlements: "ENABLED", lmsAccess: "DISABLED", certificationAccess: "CONFIGURABLE" }, specialities: ["IT Recruitment", "RPO", "Executive Search"] },
  { id: "ptn_008", name: "Pune Digital Academy", legalName: "Pune Digital Academy", model: "CENTRE", tier: "starter", status: "under_review", logo: "PD", contactName: "Sneha Patil", contactEmail: "sneha@punedigitalacademy.in", contactPhone: "+91 99000 89012", city: "Pune", state: "Maharashtra", territory: "Pune Central", establishedYear: 2023, joinedAt: daysAgo(30), agreementStart: daysAhead(20), agreementEnd: daysAhead(385), studentsEnrolled: 0, studentsGraduated: 0, revenueYTD: 0, settlementsYTD: 0, walletBalance: 0, pendingSettlement: 0, rating: 0, capabilities: { centreManagement: "CONFIGURABLE", centreInspection: "CONFIGURABLE", infrastructure: "CONFIGURABLE", physicalTraining: "CONFIGURABLE", localDelivery: "CONFIGURABLE", serviceDelivery: "DISABLED", leadGeneration: "CONFIGURABLE", counselling: "CONFIGURABLE", admissions: "CONFIGURABLE", referrals: "CONFIGURABLE", marketing: "CONFIGURABLE", wallet: "CONFIGURABLE", settlements: "CONFIGURABLE", lmsAccess: "CONFIGURABLE", certificationAccess: "CONFIGURABLE" }, specialities: ["Digital Marketing", "Design"] },
];

// ============================================================
// PARTNER APPLICATIONS
// ============================================================
export const partnerApplications: PartnerApplication[] = [
  { id: "app_001", applicationCode: "APP-2024-0142", model: "CENTRE", applicantName: "Sneha Patil", organizationName: "Pune Digital Academy", email: "sneha@punedigitalacademy.in", phone: "+91 99000 89012", city: "Pune", state: "Maharashtra", status: "under_review", submittedAt: daysAgo(12), currentStep: 7, totalSteps: 9, assignedTo: "Review Team B", priority: "high", notes: "Infrastructure inspection pending" },
  { id: "app_002", applicationCode: "APP-2024-0143", model: "COLLEGE", applicantName: "Dr. Rajeshwari Iyer", organizationName: "Bharath Engineering College", email: "rajeshwari@bharath.edu.in", phone: "+91 98400 90123", city: "Madurai", state: "Tamil Nadu", status: "submitted", submittedAt: daysAgo(5), currentStep: 9, totalSteps: 9, assignedTo: "Partnership Team", priority: "medium", notes: "Awaiting MoU draft" },
  { id: "app_003", applicationCode: "APP-2024-0144", model: "RECRUITMENT", applicantName: "Vikram Shah", organizationName: "TalentForge Consulting", email: "vikram@talentforge.in", phone: "+91 99000 01234", city: "Mumbai", state: "Maharashtra", status: "under_review", submittedAt: daysAgo(8), currentStep: 8, totalSteps: 9, assignedTo: "Review Team A", priority: "urgent", notes: "Background verification in progress" },
  { id: "app_004", applicationCode: "APP-2024-0145", model: "AI", applicantName: "Dr. Meera Krishnan", organizationName: "NeuralWorks AI", email: "meera@neuralworks.ai", phone: "+91 99000 12345", city: "Hyderabad", state: "Telangana", status: "approved", submittedAt: daysAgo(20), reviewedAt: daysAgo(2), currentStep: 9, totalSteps: 9, assignedTo: "Review Team A", priority: "high", notes: "Approved — compute credits granted" },
  { id: "app_005", applicationCode: "APP-2024-0146", model: "SERVICE", applicantName: "Anand Joshi", organizationName: "CloudSync Services", email: "anand@cloudsync.in", phone: "+91 99000 23456", city: "Delhi NCR", state: "Delhi", status: "submitted", submittedAt: daysAgo(3), currentStep: 9, totalSteps: 9, priority: "medium" },
  { id: "app_006", applicationCode: "APP-2024-0147", model: "TECHNOLOGY", applicantName: "Rohit Malhotra", organizationName: "InfraPro Solutions", email: "rohit@infrapro.in", phone: "+91 99000 34567", city: "Gurugram", state: "Haryana", status: "draft", currentStep: 4, totalSteps: 9, priority: "low" },
];

// ============================================================
// LEADS
// ============================================================
export const leads: Lead[] = [
  { id: "lead_001", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", leadSource: "PARTNER_GENERATED", name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98765 11111", programInterest: "Full-Stack Engineering Program", city: "Chennai", status: "qualified", estimatedValue: 45000, createdAt: daysAgo(5), assignedTo: "Counsellor A", notes: "Interested in offline batch" },
  { id: "lead_002", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", leadSource: "WALK_IN", name: "Divya Lakshmi", email: "divya.l@gmail.com", phone: "+91 98765 22222", programInterest: "Data Science & Analytics", city: "Chennai", status: "enrolled", estimatedValue: 38000, createdAt: daysAgo(12), assignedTo: "Counsellor B", notes: "Enrolled in batch B-24-08" },
  { id: "lead_003", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", leadSource: "WEBSITE", name: "Karthik Reddy", email: "karthik.r@gmail.com", phone: "+91 98765 33333", programInterest: "Cloud & DevOps Engineering", city: "Bengaluru", status: "contacted", estimatedValue: 48000, createdAt: daysAgo(3), assignedTo: "Counsellor A" },
  { id: "lead_004", leadSource: "JOBSONN_GENERATED", name: "Priya Menon", email: "priya.m@gmail.com", phone: "+91 98765 44444", programInterest: "UI/UX Design Program", city: "Kochi", status: "new", estimatedValue: 32000, createdAt: daysAgo(1) },
  { id: "lead_005", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", leadSource: "DIGITAL_REFERRAL", name: "Rahul Nair", email: "rahul.n@gmail.com", phone: "+91 98765 55555", programInterest: "Digital Marketing Mastery", city: "Chennai", status: "nurture", estimatedValue: 25000, createdAt: daysAgo(20), assignedTo: "Counsellor C", notes: "Budget constraint — follow up next quarter" },
  { id: "lead_006", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", leadSource: "PARTNER_GENERATED", name: "Meera Iyer", email: "meera.i@gmail.com", phone: "+91 98765 66666", programInterest: "Cybersecurity Essentials", city: "Bengaluru", status: "qualified", estimatedValue: 42000, createdAt: daysAgo(7), assignedTo: "Counsellor B" },
  { id: "lead_007", leadSource: "JOBSONN_DELIVERY", name: "Sanjay Gupta", email: "sanjay.g@gmail.com", phone: "+91 98765 77777", programInterest: "Full-Stack Engineering Program", city: "Hyderabad", status: "enrolled", estimatedValue: 45000, createdAt: daysAgo(15) },
];

// ============================================================
// REVENUE SPLITS
// ============================================================
export const revenueSplits: RevenueSplit[] = [
  { id: "rsv_001", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", programId: "prog_001", programName: "Full-Stack Engineering Program", leadSource: "PARTNER_GENERATED", grossRevenue: 45000, discount: 2000, netCollected: 43000, gatewayFee: 860, tax: 7740, netAfterFees: 34400, partnerPct: 70, jobsonnPct: 30, partnerShare: 24080, jobsonnShare: 10320, ruleApplied: "Centre — partner-generated lead", status: "settled", settledAt: daysAgo(5), createdAt: daysAgo(20) },
  { id: "rsv_002", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", programId: "prog_002", programName: "Data Science & Analytics", leadSource: "WALK_IN", grossRevenue: 38000, discount: 0, netCollected: 38000, gatewayFee: 760, tax: 6840, netAfterFees: 30400, partnerPct: 70, jobsonnPct: 30, partnerShare: 21280, jobsonnShare: 9120, ruleApplied: "Centre — walk-in", status: "processed", createdAt: daysAgo(8) },
  { id: "rsv_003", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", programId: "prog_005", programName: "Cloud & DevOps Engineering", leadSource: "WEBSITE", grossRevenue: 48000, discount: 3000, netCollected: 45000, gatewayFee: 900, tax: 8100, netAfterFees: 36000, partnerPct: 60, jobsonnPct: 40, partnerShare: 21600, jobsonnShare: 14400, ruleApplied: "Centre — website enquiry", status: "pending", createdAt: daysAgo(3) },
  { id: "rsv_004", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", programId: "prog_001", programName: "Full-Stack Engineering Program", leadSource: "PARTNER_GENERATED", grossRevenue: 45000, discount: 5000, netCollected: 40000, gatewayFee: 800, tax: 7200, netAfterFees: 32000, partnerPct: 65, jobsonnPct: 35, partnerShare: 20800, jobsonnShare: 11200, ruleApplied: "College — partner-generated", status: "settled", settledAt: daysAgo(2), createdAt: daysAgo(18) },
  { id: "rsv_005", partnerId: "ptn_004", partnerName: "Meridian IT Services", programId: "prog_005", programName: "Cloud & DevOps Engineering", leadSource: "JOBSONN_GENERATED", grossRevenue: 480000, discount: 0, netCollected: 480000, gatewayFee: 9600, tax: 86400, netAfterFees: 384000, partnerPct: 60, jobsonnPct: 40, partnerShare: 230400, jobsonnShare: 153600, ruleApplied: "Service — JOBSONN-generated", status: "settled", settledAt: daysAgo(1), createdAt: daysAgo(15) },
  { id: "rsv_006", partnerId: "ptn_007", partnerName: "HireBridge Staffing", programId: "prog_001", programName: "Full-Stack Engineering Program", leadSource: "PARTNER_GENERATED", grossRevenue: 180000, discount: 0, netCollected: 180000, gatewayFee: 3600, tax: 32400, netAfterFees: 144000, partnerPct: 68, jobsonnPct: 32, partnerShare: 97920, jobsonnShare: 46080, ruleApplied: "Recruitment — partner-generated", status: "processed", createdAt: daysAgo(6) },
];

// ============================================================
// SETTLEMENTS
// ============================================================
export const settlements: Settlement[] = [
  { id: "stl_001", settlementNumber: "STL-2024-0101", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", period: "Oct 2024", grossAmount: 480000, partnerShare: 336000, jobsonnShare: 144000, deductions: 12000, netPayable: 324000, status: "paid", paymentDate: daysAgo(3), paymentMethod: "NEFT", transactionId: "NEFT241024001", lineItems: [{ description: "Full-Stack Program — 8 enrollments", amount: 360000, partnerShare: 252000 }, { description: "Data Science — 3 enrollments", amount: 114000, partnerShare: 79800 }, { description: "Digital Marketing — 1 enrollment", amount: 25000, partnerShare: 17500 }], createdAt: daysAgo(5) },
  { id: "stl_002", settlementNumber: "STL-2024-0102", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", period: "Oct 2024", grossAmount: 280000, partnerShare: 168000, jobsonnShare: 112000, deductions: 8000, netPayable: 160000, status: "approved", paymentDate: daysAhead(2), lineItems: [{ description: "Cloud DevOps — 4 enrollments", amount: 192000, partnerShare: 115200 }, { description: "UX Design — 2 enrollments", amount: 64000, partnerShare: 38400 }], createdAt: daysAgo(3) },
  { id: "stl_003", settlementNumber: "STL-2024-0103", partnerId: "ptn_004", partnerName: "Meridian IT Services", partnerModel: "SERVICE", period: "Oct 2024", grossAmount: 1200000, partnerShare: 900000, jobsonnShare: 300000, deductions: 18000, netPayable: 882000, status: "paid", paymentDate: daysAgo(1), paymentMethod: "RTGS", transactionId: "RTGS241024002", lineItems: [{ description: "Cloud Migration — Acme Corp", amount: 700000, partnerShare: 525000 }, { description: "DevOps Retainer — Northwind", amount: 500000, partnerShare: 375000 }], createdAt: daysAgo(4) },
  { id: "stl_004", settlementNumber: "STL-2024-0104", partnerId: "ptn_005", partnerName: "Northwind Tech Solutions", partnerModel: "TECHNOLOGY", period: "Oct 2024", grossAmount: 950000, partnerShare: 684000, jobsonnShare: 266000, deductions: 14000, netPayable: 670000, status: "draft", lineItems: [{ description: "ERP Integration — Meridian Logistics", amount: 650000, partnerShare: 468000 }, { description: "CRM Setup — Stellar Retail", amount: 300000, partnerShare: 216000 }], createdAt: daysAgo(1) },
  { id: "stl_005", settlementNumber: "STL-2024-0105", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", partnerModel: "COLLEGE", period: "Oct 2024", grossAmount: 360000, partnerShare: 234000, jobsonnShare: 126000, deductions: 6000, netPayable: 228000, status: "approved", lineItems: [{ description: "Full-Stack Program — Campus batch", amount: 360000, partnerShare: 234000 }], createdAt: daysAgo(2) },
];

// ============================================================
// WALLET TRANSACTIONS
// ============================================================
export const walletTransactions: WalletTransaction[] = [
  { id: "wt_001", partnerId: "ptn_001", type: "credit", amount: 324000, balance: 508000, description: "Settlement STL-2024-0101 received", reference: "STL-2024-0101", timestamp: daysAgo(3) },
  { id: "wt_002", partnerId: "ptn_001", type: "debit", amount: 50000, balance: 458000, description: "Marketing materials — Q4 campaign", timestamp: daysAgo(7) },
  { id: "wt_003", partnerId: "ptn_001", type: "credit", amount: 168000, balance: 508000, description: "Enrollment credit — Full-Stack batch B-24-10", reference: "ENR-2024-0892", timestamp: daysAgo(10) },
  { id: "wt_004", partnerId: "ptn_001", type: "fee", amount: 860, balance: 340000, description: "Payment gateway fee — enrollment", timestamp: daysAgo(10) },
  { id: "wt_005", partnerId: "ptn_001", type: "bonus", amount: 25000, balance: 340860, description: "Q3 performance bonus — top-rated centre", timestamp: daysAgo(15) },
  { id: "wt_006", partnerId: "ptn_004", type: "credit", amount: 882000, balance: 1222000, description: "Settlement STL-2024-0103 received", reference: "STL-2024-0103", timestamp: daysAgo(1) },
  { id: "wt_007", partnerId: "ptn_004", type: "debit", amount: 120000, balance: 340000, description: "Partner advance — cloud infra project", timestamp: daysAgo(12) },
];

// ============================================================
// TRAINING CENTRES
// ============================================================
export const trainingCentres: TrainingCentre[] = [
  { id: "tc_001", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", name: "Chennai East — Main Campus", code: "CTA-MAIN", city: "Chennai", state: "Tamil Nadu", address: "12, OMR Road, Sholinganallur, Chennai", capacity: 200, classrooms: 6, labs: 3, facultyCount: 18, studentsEnrolled: 180, batchesActive: 6, rating: 4.7, status: "active", lastInspection: daysAgo(45), complianceScore: 94 },
  { id: "tc_002", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", name: "Velachery Branch", code: "CTA-VEL", city: "Chennai", state: "Tamil Nadu", address: "45, Velachery Main Road, Chennai", capacity: 80, classrooms: 3, labs: 1, facultyCount: 8, studentsEnrolled: 64, batchesActive: 3, rating: 4.5, status: "active", lastInspection: daysAgo(60), complianceScore: 88 },
  { id: "tc_003", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", name: "BSB Koramangala", code: "BSB-KOR", city: "Bengaluru", state: "Karnataka", address: "78, 80 Feet Road, Koramangala, Bengaluru", capacity: 120, classrooms: 4, labs: 2, facultyCount: 10, studentsEnrolled: 96, batchesActive: 4, rating: 4.4, status: "active", lastInspection: daysAgo(30), complianceScore: 82 },
];

// ============================================================
// BATCHES
// ============================================================
export const batches: Batch[] = [
  { id: "bt_001", centreId: "tc_001", centreName: "CTA Main Campus", programName: "Full-Stack Engineering Program", code: "B-24-10", trainer: "Rajesh Kumar", startDate: daysAgo(14), endDate: daysAhead(70), schedule: "Mon-Fri 9 AM - 1 PM", enrolled: 28, capacity: 30, attendanceRate: 94, progress: 22, status: "active", modality: "offline" },
  { id: "bt_002", centreId: "tc_001", centreName: "CTA Main Campus", programName: "Data Science & Analytics", code: "B-24-11", trainer: "Lakshmi Nair", startDate: daysAgo(7), endDate: daysAhead(63), schedule: "Mon-Wed-Fri 2 PM - 5 PM", enrolled: 22, capacity: 25, attendanceRate: 89, progress: 12, status: "active", modality: "hybrid" },
  { id: "bt_003", centreId: "tc_002", centreName: "CTA Velachery", programName: "Digital Marketing Mastery", code: "B-24-12", trainer: "Priya S", startDate: daysAgo(21), endDate: daysAgo(7), schedule: "Sat-Sun 10 AM - 4 PM", enrolled: 18, capacity: 20, attendanceRate: 92, progress: 100, status: "completed", modality: "offline" },
  { id: "bt_004", centreId: "tc_003", centreName: "BSB Koramangala", programName: "Cloud & DevOps Engineering", code: "B-24-13", trainer: "Anand R", startDate: daysAhead(3), endDate: daysAhead(87), schedule: "Mon-Fri 9 AM - 1 PM", enrolled: 24, capacity: 30, attendanceRate: 0, progress: 0, status: "upcoming", modality: "hybrid" },
];

// ============================================================
// COLLEGES
// ============================================================
export const colleges: College[] = [
  { id: "col_001", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", name: "Kanchana Institute of Technology", code: "KNC-001", institutionType: "INSTITUTE", affiliation: "AUTONOMOUS", fundingType: "PRIVATE", establishedYear: 2005, city: "Coimbatore", state: "Tamil Nadu", totalStudents: 4200, totalFaculty: 240, hasPlacementCell: true, hasTrainingCell: true, accreditation: "NAAC A++", partnershipModel: "B", mouStatus: "signed", mouSignedAt: daysAgo(180), mouExpiresAt: daysAhead(550), programsMapped: 6, studentsEnrolled: 840, placements: 620, placementRate: 74, status: "active" },
  { id: "col_002", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", name: "Bharath Engineering College", code: "BEC-002", institutionType: "COLLEGE", affiliation: "AFFILIATED", fundingType: "PRIVATE", establishedYear: 1998, city: "Madurai", state: "Tamil Nadu", totalStudents: 3600, totalFaculty: 180, hasPlacementCell: true, hasTrainingCell: false, accreditation: "NAAC A", partnershipModel: "A", mouStatus: "sent", programsMapped: 4, studentsEnrolled: 0, placements: 0, placementRate: 0, status: "onboarding" },
  { id: "col_003", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", name: "Veltech University", code: "VTU-003", institutionType: "UNIVERSITY", affiliation: "DEEMED", fundingType: "PRIVATE", establishedYear: 1990, city: "Chennai", state: "Tamil Nadu", totalStudents: 8200, totalFaculty: 420, hasPlacementCell: true, hasTrainingCell: true, accreditation: "NAAC A++", partnershipModel: "D", mouStatus: "signed", mouSignedAt: daysAgo(90), mouExpiresAt: daysAhead(640), programsMapped: 8, studentsEnrolled: 1200, placements: 980, placementRate: 82, status: "active" },
];

// ============================================================
// COLLEGE PARTNERSHIP MODELS (A-E)
// ============================================================
export const collegePartnershipModels: CollegePartnershipModel[] = [
  { id: "A", name: "Curriculum Integration", description: "JOBSONN curriculum embedded into existing college courses as electives or labs.", jobsonnScope: ["Curriculum design", "Faculty training", "LMS access", "Certification"], collegeScope: ["Classroom infrastructure", "Student enrollment", "Scheduling"], revenueModel: "Per-student license fee", idealFor: "Autonomous colleges with strong CS/IT departments" },
  { id: "B", name: "Co-branded Centre", description: "A dedicated JOBSONN training centre within the campus, co-branded.", jobsonnScope: ["Centre setup", "Curriculum", "Trainers", "LMS + CRM", "Certification", "Placement drives"], collegeScope: ["Infrastructure", "Marketing to students", "Administrative support"], revenueModel: "Revenue share on enrollments", idealFor: "Colleges wanting a premium training facility" },
  { id: "C", name: "Faculty Development", description: "Train-the-trainer programs where college faculty deliver JOBSONN curriculum.", jobsonnScope: ["Faculty certification", "Curriculum", "Assessments", "Quality monitoring"], collegeScope: ["Faculty time", "Delivery", "Student enrollment"], revenueModel: "Annual faculty license", idealFor: "Universities with large faculty pools" },
  { id: "D", name: "Placement Partnership", description: "JOBSONN placement drives + pre-placement training for final-year students.", jobsonnScope: ["Pre-placement training", "Placement drives", "Industry connects", "Mock interviews"], collegeScope: ["Student coordination", "Facilities for drives", "Placement cell alignment"], revenueModel: "Per-placement success fee", idealFor: "Colleges focused on placement outcomes" },
  { id: "E", name: "Full Campus MoU", description: "End-to-end partnership: curriculum, centre, faculty, placement, and certification.", jobsonnScope: ["Everything in A-D", "Dedicated account manager", "Co-branded marketing", "Annual tech fest"], collegeScope: ["Strategic alignment", "Infrastructure", "Budget allocation"], revenueModel: "Comprehensive annual agreement", idealFor: "Large universities seeking deep partnership" },
];

// ============================================================
// SERVICE CATALOG
// ============================================================
export const serviceCatalog: ServiceCatalogItem[] = [
  { id: "sc_001", name: "Cloud Migration Assessment", category: "Cloud", description: "Assess on-prem workloads and plan cloud migration strategy.", deliveryModel: "project", standardPrice: 150000, slaLevel: "standard", duration: "4 weeks", active: true },
  { id: "sc_002", name: "DevOps Pipeline Setup", category: "DevOps", description: "Set up CI/CD pipelines, IaC, and monitoring.", deliveryModel: "project", standardPrice: 280000, slaLevel: "premium", duration: "6 weeks", active: true },
  { id: "sc_003", name: "Application Maintenance (AMC)", category: "Maintenance", description: "Annual maintenance contract for business applications.", deliveryModel: "amc", standardPrice: 480000, slaLevel: "premium", duration: "12 months", active: true },
  { id: "sc_004", name: "Data Engineering Retainer", category: "Data", description: "Monthly retainer for data pipeline development and maintenance.", deliveryModel: "retainer", standardPrice: 220000, slaLevel: "standard", duration: "Monthly", active: true },
  { id: "sc_005", name: "UI/UX Design Sprint", category: "Design", description: "5-day design sprint to validate product concepts.", deliveryModel: "milestone", standardPrice: 180000, slaLevel: "standard", duration: "1 week", active: true },
  { id: "sc_006", name: "Cybersecurity Audit", category: "Security", description: "Comprehensive security audit + remediation plan.", deliveryModel: "project", standardPrice: 320000, slaLevel: "premium", duration: "5 weeks", active: true },
];

// ============================================================
// ENGAGEMENTS
// ============================================================
export const engagements: Engagement[] = [
  { id: "eng_001", partnerId: "ptn_004", partnerName: "Meridian IT Services", clientName: "Acme Manufacturing", serviceId: "sc_001", serviceName: "Cloud Migration Assessment", type: "project", value: 150000, startDate: daysAgo(20), endDate: daysAhead(8), status: "active", slaCompliance: 95, progress: 65, deliveryLead: "Arvind Menon" },
  { id: "eng_002", partnerId: "ptn_004", partnerName: "Meridian IT Services", clientName: "Northwind Logistics", serviceId: "sc_003", serviceName: "Application Maintenance (AMC)", type: "amc", value: 480000, startDate: daysAgo(60), endDate: daysAhead(305), status: "active", slaCompliance: 98, progress: 12, deliveryLead: "Arvind Menon" },
  { id: "eng_003", partnerId: "ptn_005", partnerName: "Northwind Tech Solutions", clientName: "Stellar Retail", serviceId: "sc_002", serviceName: "DevOps Pipeline Setup", type: "project", value: 280000, startDate: daysAgo(10), endDate: daysAhead(32), status: "active", slaCompliance: 92, progress: 28, deliveryLead: "Priya Gupta" },
  { id: "eng_004", partnerId: "ptn_005", partnerName: "Northwind Tech Solutions", clientName: "Meridian Logistics", serviceId: "sc_002", serviceName: "DevOps Pipeline Setup", type: "project", value: 320000, startDate: daysAgo(45), endDate: daysAgo(5), status: "completed", slaCompliance: 96, progress: 100, deliveryLead: "Priya Gupta" },
  { id: "eng_005", partnerId: "ptn_006", partnerName: "CogniAI Labs", clientName: "FinServe Group", serviceId: "sc_004", serviceName: "Data Engineering Retainer", type: "retainer", value: 220000, startDate: daysAgo(30), status: "active", slaCompliance: 94, progress: 40, deliveryLead: "Dr. Anika Reddy" },
  { id: "eng_006", partnerId: "ptn_006", partnerName: "CogniAI Labs", clientName: "HealthPlus", serviceId: "sc_006", serviceName: "Cybersecurity Audit", type: "project", value: 320000, startDate: daysAgo(5), endDate: daysAhead(30), status: "active", slaCompliance: 100, progress: 15, deliveryLead: "Dr. Anika Reddy" },
];

// ============================================================
// JOB ORDERS (recruitment mandates)
// ============================================================
export const jobOrders: JobOrder[] = [
  { id: "jo_001", orderNumber: "JO-2024-0501", clientId: "pc_001", clientName: "TechCorp India", title: "Senior Full-Stack Engineer", role: "Full-Stack Developer", positions: 3, filled: 1, experienceMin: 5, experienceMax: 9, salaryMin: 1800000, salaryMax: 2800000, currency: "INR", location: "Bengaluru", remote: false, skillsRequired: ["React", "Node.js", "TypeScript"], certificationsRequired: ["JOBSONN Full-Stack Certificate"], type: "permanent", priority: "high", status: "open", feeType: "percentage", feeValue: 8.33, createdAt: daysAgo(15), deadline: daysAhead(30), assignedRecruiter: "Karthik Subramanian", submissions: 12, interviews: 4, offers: 1, placements: 1 },
  { id: "jo_002", orderNumber: "JO-2024-0502", clientId: "pc_002", clientName: "FinEdge Solutions", title: "DevOps Engineer (Contract)", role: "DevOps Engineer", positions: 2, filled: 0, experienceMin: 4, experienceMax: 8, salaryMin: 1600000, salaryMax: 2400000, currency: "INR", location: "Mumbai", remote: true, skillsRequired: ["Kubernetes", "AWS", "Terraform"], certificationsRequired: ["JOBSONN Cloud DevOps Certificate"], type: "contract", priority: "urgent", status: "open", feeType: "percentage", feeValue: 10, createdAt: daysAgo(8), deadline: daysAhead(22), assignedRecruiter: "Karthik Subramanian", submissions: 8, interviews: 2, offers: 0, placements: 0 },
  { id: "jo_003", orderNumber: "JO-2024-0503", clientId: "pc_003", clientName: "DataMinds AI", title: "ML Engineer", role: "Machine Learning Engineer", positions: 5, filled: 2, experienceMin: 4, experienceMax: 10, salaryMin: 2000000, salaryMax: 3500000, currency: "INR", location: "Bengaluru", remote: true, skillsRequired: ["Python", "Machine Learning", "MLOps"], certificationsRequired: ["JOBSONN Data Science Certificate"], type: "permanent", priority: "high", status: "partial", feeType: "percentage", feeValue: 8.33, createdAt: daysAgo(25), deadline: daysAhead(15), assignedRecruiter: "Karthik Subramanian", submissions: 24, interviews: 8, offers: 3, placements: 2 },
  { id: "jo_004", orderNumber: "JO-2024-0504", clientId: "pc_004", clientName: "SecureBank", title: "Security Analyst", role: "Security Analyst", positions: 2, filled: 0, experienceMin: 3, experienceMax: 7, salaryMin: 1200000, salaryMax: 2000000, currency: "INR", location: "Chennai", remote: false, skillsRequired: ["Information Security", "SIEM"], certificationsRequired: ["JOBSONN Security Certificate"], type: "permanent", priority: "medium", status: "open", feeType: "fixed", feeValue: 75000, createdAt: daysAgo(12), deadline: daysAhead(33), assignedRecruiter: "Karthik Subramanian", submissions: 6, interviews: 1, offers: 0, placements: 0 },
  { id: "jo_005", orderNumber: "JO-2024-0505", clientId: "pc_001", clientName: "TechCorp India", title: "UI/UX Designer", role: "UX Designer", positions: 1, filled: 1, experienceMin: 3, experienceMax: 6, salaryMin: 1000000, salaryMax: 1800000, currency: "INR", location: "Bengaluru", remote: true, skillsRequired: ["Figma", "User Research", "Prototyping"], certificationsRequired: ["JOBSONN UX Design Certificate"], type: "permanent", priority: "medium", status: "fulfilled", feeType: "percentage", feeValue: 8.33, createdAt: daysAgo(40), deadline: daysAgo(5), assignedRecruiter: "Karthik Subramanian", submissions: 10, interviews: 3, offers: 1, placements: 1 },
];

// ============================================================
// ONBOARDING
// ============================================================
export const onboardings: Onboarding[] = [
  { id: "obd_001", candidateName: "Priya Nair", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", startDate: daysAhead(7), status: "documents", documentsTotal: 8, documentsUploaded: 5, backgroundCheckStatus: "in_progress", hrContact: "Meera (HR, TechCorp)" },
  { id: "obd_002", candidateName: "Arjun Iyer", clientName: "DataMinds AI", jobTitle: "ML Engineer", startDate: daysAhead(14), status: "background_check", documentsTotal: 8, documentsUploaded: 8, backgroundCheckStatus: "in_progress", hrContact: "Suresh (HR, DataMinds)" },
  { id: "obd_003", candidateName: "Kavya Reddy", clientName: "DataMinds AI", jobTitle: "ML Engineer", startDate: daysAgo(3), status: "completed", documentsTotal: 8, documentsUploaded: 8, backgroundCheckStatus: "cleared", orientationDate: daysAgo(3), hrContact: "Suresh (HR, DataMinds)" },
  { id: "obd_004", candidateName: "Vikram Singh", clientName: "TechCorp India", jobTitle: "UI/UX Designer", startDate: daysAgo(5), status: "completed", documentsTotal: 8, documentsUploaded: 8, backgroundCheckStatus: "cleared", orientationDate: daysAgo(5), hrContact: "Meera (HR, TechCorp)" },
];

// ============================================================
// TIMESHEETS
// ============================================================
export const timesheets: Timesheet[] = [
  { id: "ts_001", candidateName: "Arjun Iyer", clientName: "DataMinds AI", weekStart: daysAgo(7), weekEnd: daysAgo(1), hours: 40, billableHours: 40, status: "approved", approvedBy: "Suresh (DataMinds)", amount: 60000 },
  { id: "ts_002", candidateName: "Kavya Reddy", clientName: "DataMinds AI", weekStart: daysAgo(7), weekEnd: daysAgo(1), hours: 40, billableHours: 38, status: "invoiced", amount: 57000 },
  { id: "ts_003", candidateName: "Arjun Iyer", clientName: "DataMinds AI", weekStart: daysAgo(14), weekEnd: daysAgo(8), hours: 40, billableHours: 40, status: "invoiced", amount: 60000 },
  { id: "ts_004", candidateName: "Vikram Singh", clientName: "TechCorp India", weekStart: daysAgo(7), weekEnd: daysAgo(1), hours: 40, billableHours: 40, status: "submitted", amount: 45000 },
];

// ============================================================
// HOTLISTS
// ============================================================
export const hotlists: Hotlist[] = [
  { id: "hl_001", name: "Immediate Joiners — React", description: "React developers available immediately", candidateCount: 18, createdBy: "Karthik Subramanian", createdAt: daysAgo(10), tags: ["react", "immediate"], shared: true },
  { id: "hl_002", name: "CKA Certified DevOps", description: "Kubernetes-certified DevOps engineers", candidateCount: 12, createdBy: "Karthik Subramanian", createdAt: daysAgo(20), tags: ["kubernetes", "devops", "certified"], shared: true },
  { id: "hl_003", name: "ML Engineers — Senior", description: "Senior ML engineers with 5+ years", candidateCount: 8, createdBy: "Karthik Subramanian", createdAt: daysAgo(5), tags: ["ml", "senior"], shared: false },
  { id: "hl_004", name: "Notice Period < 30 days", description: "Candidates with short notice periods", candidateCount: 24, createdBy: "Karthik Subramanian", createdAt: daysAgo(15), tags: ["short-notice"], shared: true },
];

// ============================================================
// EMAIL TEMPLATES
// ============================================================
export const emailTemplates: EmailTemplate[] = [
  { id: "et_001", name: "Interview Invitation", category: "interview", subject: "Interview Invitation — {{job_title}} at {{client_name}}", body: "Hi {{candidate_name}},\n\nYou've been shortlisted for {{job_title}} at {{client_name}}.\n\nInterview details:\nDate: {{interview_date}}\nTime: {{interview_time}}\nMode: {{interview_mode}}\n\nPlease confirm your availability.\n\nRegards,\n{{recruiter_name}}", variables: ["candidate_name", "job_title", "client_name", "interview_date", "interview_time", "interview_mode", "recruiter_name"], lastUsed: daysAgo(2), usageCount: 142 },
  { id: "et_002", name: "Offer Letter Release", category: "offer", subject: "Offer Letter — {{job_title}} at {{client_name}}", body: "Hi {{candidate_name}},\n\nCongratulations! We're pleased to release your offer for {{job_title}} at {{client_name}}.\n\nOffer details:\nCTC: {{salary}}\nJoining Date: {{joining_date}}\n\nPlease review the attached offer letter and confirm within 48 hours.\n\nRegards,\n{{recruiter_name}}", variables: ["candidate_name", "job_title", "client_name", "salary", "joining_date", "recruiter_name"], lastUsed: daysAgo(5), usageCount: 38 },
  { id: "et_003", name: "Regret — Not Selected", category: "rejection", subject: "Update on your application — {{job_title}}", body: "Hi {{candidate_name}},\n\nThank you for your interest in {{job_title}} at {{client_name}}.\n\nWhile your profile was impressive, we've decided not to move forward at this time. We'll keep your profile in our database for future opportunities.\n\nRegards,\n{{recruiter_name}}", variables: ["candidate_name", "job_title", "client_name", "recruiter_name"], lastUsed: daysAgo(1), usageCount: 210 },
  { id: "et_004", name: "Onboarding Checklist", category: "candidate", subject: "Onboarding Checklist — {{client_name}}", body: "Hi {{candidate_name}},\n\nWelcome to {{client_name}}! Please complete the following onboarding steps:\n\n1. Upload documents (ID, address proof, education certificates)\n2. Complete background verification form\n3. Sign the employment agreement\n4. Attend orientation on {{orientation_date}}\n\nRegards,\n{{recruiter_name}}", variables: ["candidate_name", "client_name", "orientation_date", "recruiter_name"], lastUsed: daysAgo(3), usageCount: 56 },
  { id: "et_005", name: "Client Status Update", category: "client", subject: "Weekly Update — {{client_name}} Mandates", body: "Hi {{client_contact}},\n\nHere's the weekly update on your open mandates:\n\n{{mandates_summary}}\n\nTotal submissions this week: {{submissions_count}}\nInterviews scheduled: {{interviews_count}}\n\nRegards,\n{{recruiter_name}}", variables: ["client_contact", "client_name", "mandates_summary", "submissions_count", "interviews_count", "recruiter_name"], lastUsed: daysAgo(4), usageCount: 88 },
];

// ============================================================
// REVENUE CALCULATOR PRESETS
// ============================================================
export const LEAD_SOURCES = [
  { value: "PARTNER_GENERATED", label: "Partner-generated lead", defaultPartnerPct: 70 },
  { value: "JOBSONN_GENERATED", label: "JOBSONN-generated lead", defaultPartnerPct: 60 },
  { value: "JOBSONN_DELIVERY", label: "JOBSONN lead + JOBSONN delivery", defaultPartnerPct: 50 },
  { value: "DIGITAL_REFERRAL", label: "Digital-only referral", defaultPartnerPct: 40 },
  { value: "WALK_IN", label: "Centre walk-in", defaultPartnerPct: 70 },
  { value: "WEBSITE", label: "Website enquiry", defaultPartnerPct: 60 },
] as const;

export const MODEL_LABELS: Record<PartnerModel, string> = {
  CENTRE: "Training Centre",
  COLLEGE: "College / University",
  SERVICE: "Service Partner",
  TECHNOLOGY: "Technology Partner",
  AI: "AI Partner",
  RECRUITMENT: "Recruitment Partner",
};

// ============================================================
// RECRUITMENT MODULE DATA (from reference recruitment portal)
// ============================================================

export interface ClientAccount {
  id: string;
  name: string;
  logo: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "prospect" | "inactive" | "churned";
  openMandates: number;
  totalPlacements: number;
  totalRevenue: number;
  outstandingInvoices: number;
  lastActivity: string;
  assignedAccountManager: string;
  healthScore: number;
}

export const clientAccounts: ClientAccount[] = [
  { id: "ca_001", name: "TechCorp India", logo: "TC", industry: "Information Technology", contactName: "Rohan Mehta", contactEmail: "rohan@techcorp.com", contactPhone: "+91 98765 43210", tier: "platinum", status: "active", openMandates: 4, totalPlacements: 18, totalRevenue: 1450000, outstandingInvoices: 120000, lastActivity: daysAgo(1), assignedAccountManager: "Karthik Subramanian", healthScore: 92 },
  { id: "ca_002", name: "FinEdge Solutions", logo: "FE", industry: "Fintech", contactName: "Vikram Joshi", contactEmail: "vikram@finedge.io", contactPhone: "+91 98200 11111", tier: "gold", status: "active", openMandates: 3, totalPlacements: 12, totalRevenue: 980000, outstandingInvoices: 0, lastActivity: daysAgo(2), assignedAccountManager: "Karthik Subramanian", healthScore: 87 },
  { id: "ca_003", name: "DataMinds AI", logo: "DM", industry: "AI/ML", contactName: "Priya Menon", contactEmail: "priya@dataminds.ai", contactPhone: "+91 99300 22222", tier: "gold", status: "active", openMandates: 5, totalPlacements: 9, totalRevenue: 820000, outstandingInvoices: 65000, lastActivity: daysAgo(0), assignedAccountManager: "Karthik Subramanian", healthScore: 84 },
  { id: "ca_004", name: "SecureBank", logo: "SB", industry: "Banking", contactName: "Anil Kumar", contactEmail: "anil@securebank.in", contactPhone: "+91 99400 33333", tier: "silver", status: "active", openMandates: 2, totalPlacements: 5, totalRevenue: 420000, outstandingInvoices: 45000, lastActivity: daysAgo(5), assignedAccountManager: "Karthik Subramanian", healthScore: 71 },
  { id: "ca_005", name: "PayBridge", logo: "PB", industry: "Fintech", contactName: "Neha Shah", contactEmail: "neha@paybridge.in", contactPhone: "+91 99500 44444", tier: "silver", status: "active", openMandates: 1, totalPlacements: 4, totalRevenue: 380000, outstandingInvoices: 0, lastActivity: daysAgo(3), assignedAccountManager: "Karthik Subramanian", healthScore: 78 },
  { id: "ca_006", name: "StartupX", logo: "SX", industry: "Startup", contactName: "Ravi Teja", contactEmail: "ravi@startupx.in", contactPhone: "+91 99600 55555", tier: "bronze", status: "prospect", openMandates: 3, totalPlacements: 0, totalRevenue: 0, outstandingInvoices: 0, lastActivity: daysAgo(7), assignedAccountManager: "Karthik Subramanian", healthScore: 45 },
  { id: "ca_007", name: "GreenLeaf Energy", logo: "GL", industry: "Renewable Energy", contactName: "Arjun Patel", contactEmail: "arjun@greenleaf.energy", contactPhone: "+91 99000 66666", tier: "bronze", status: "inactive", openMandates: 0, totalPlacements: 2, totalRevenue: 180000, outstandingInvoices: 0, lastActivity: daysAgo(45), assignedAccountManager: "Karthik Subramanian", healthScore: 32 },
];

export interface Opening {
  id: string;
  jobOrderId: string;
  clientName: string;
  title: string;
  department: string;
  headcountApproved: number;
  headcountFilled: number;
  headcountPipeline: number;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  location: string;
  remote: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "on_hold" | "fulfilled" | "cancelled";
  targetDate: string;
  hiringManager: string;
  feePerPlacement: number;
}

export const openings: Opening[] = [
  { id: "op_001", jobOrderId: "jo_001", clientName: "TechCorp India", title: "Senior Full-Stack Engineer", department: "Engineering", headcountApproved: 3, headcountFilled: 1, headcountPipeline: 4, experienceMin: 5, experienceMax: 9, salaryMin: 1800000, salaryMax: 2800000, location: "Bengaluru", remote: false, priority: "high", status: "open", targetDate: daysAhead(30), hiringManager: "Rohan Mehta", feePerPlacement: 200000 },
  { id: "op_002", jobOrderId: "jo_002", clientName: "FinEdge Solutions", title: "DevOps Engineer", department: "Infrastructure", headcountApproved: 2, headcountFilled: 0, headcountPipeline: 3, experienceMin: 4, experienceMax: 8, salaryMin: 1600000, salaryMax: 2400000, location: "Mumbai", remote: true, priority: "urgent", status: "open", targetDate: daysAhead(22), hiringManager: "Vikram Joshi", feePerPlacement: 180000 },
  { id: "op_003", jobOrderId: "jo_003", clientName: "DataMinds AI", title: "ML Engineer", department: "Data Science", headcountApproved: 5, headcountFilled: 2, headcountPipeline: 6, experienceMin: 4, experienceMax: 10, salaryMin: 2000000, salaryMax: 3500000, location: "Bengaluru", remote: true, priority: "high", status: "open", targetDate: daysAhead(15), hiringManager: "Priya Menon", feePerPlacement: 250000 },
  { id: "op_004", jobOrderId: "jo_004", clientName: "SecureBank", title: "Security Analyst", department: "InfoSec", headcountApproved: 2, headcountFilled: 0, headcountPipeline: 2, experienceMin: 3, experienceMax: 7, salaryMin: 1200000, salaryMax: 2000000, location: "Chennai", remote: false, priority: "medium", status: "open", targetDate: daysAhead(33), hiringManager: "Anil Kumar", feePerPlacement: 75000 },
  { id: "op_005", jobOrderId: "jo_005", clientName: "TechCorp India", title: "UI/UX Designer", department: "Design", headcountApproved: 1, headcountFilled: 1, headcountPipeline: 0, experienceMin: 3, experienceMax: 6, salaryMin: 1000000, salaryMax: 1800000, location: "Bengaluru", remote: true, priority: "medium", status: "fulfilled", targetDate: daysAgo(5), hiringManager: "Rohan Mehta", feePerPlacement: 90000 },
  { id: "op_006", jobOrderId: "jo_001", clientName: "TechCorp India", title: "Backend Engineer (Go)", department: "Platform", headcountApproved: 2, headcountFilled: 0, headcountPipeline: 3, experienceMin: 4, experienceMax: 8, salaryMin: 1600000, salaryMax: 2600000, location: "Bengaluru", remote: false, priority: "high", status: "open", targetDate: daysAhead(40), hiringManager: "Anika Verma", feePerPlacement: 180000 },
];

export interface InterviewEvent {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  round: string;
  type: "phone" | "video" | "onsite" | "technical" | "hr" | "panel";
  scheduledAt: string;
  durationMinutes: number;
  interviewer: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "no_show";
  feedbackSubmitted: boolean;
  outcome?: "cleared" | "rejected" | "on_hold";
}

export const interviewEvents: InterviewEvent[] = [
  { id: "iv_001", candidateName: "Priya Nair", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", round: "Technical Round 1", type: "video", scheduledAt: daysAhead(1), durationMinutes: 60, interviewer: "Rohan Mehta", status: "scheduled", feedbackSubmitted: false },
  { id: "iv_002", candidateName: "Arjun Iyer", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", round: "Systems Design", type: "video", scheduledAt: daysAhead(2), durationMinutes: 90, interviewer: "Vikram Joshi", status: "scheduled", feedbackSubmitted: false },
  { id: "iv_003", candidateName: "Kavya Reddy", clientName: "DataMinds AI", jobTitle: "ML Engineer", round: "Final — Leadership", type: "video", scheduledAt: daysAgo(3), durationMinutes: 60, interviewer: "Priya Menon", status: "completed", feedbackSubmitted: true, outcome: "cleared" },
  { id: "iv_004", candidateName: "Meera Krishnan", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", round: "HR Screen", type: "phone", scheduledAt: daysAhead(3), durationMinutes: 30, interviewer: "Karthik Subramanian", status: "scheduled", feedbackSubmitted: false },
  { id: "iv_005", candidateName: "Vikram Singh", clientName: "SecureBank", jobTitle: "Security Analyst", round: "Technical", type: "onsite", scheduledAt: daysAgo(5), durationMinutes: 120, interviewer: "Anil Kumar", status: "completed", feedbackSubmitted: true, outcome: "rejected" },
  { id: "iv_006", candidateName: "Sahil Khan", clientName: "DataMinds AI", jobTitle: "ML Engineer", round: "Coding Test", type: "technical", scheduledAt: daysAhead(4), durationMinutes: 90, interviewer: "Dr. Suresh", status: "scheduled", feedbackSubmitted: false },
  { id: "iv_007", candidateName: "Ananya Das", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", round: "HR Round", type: "phone", scheduledAt: daysAgo(1), durationMinutes: 30, interviewer: "Karthik Subramanian", status: "completed", feedbackSubmitted: true, outcome: "cleared" },
];

export interface OfferRecord {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  salary: number;
  currency: string;
  joiningBonus?: number;
  startDate: string;
  status: "draft" | "pending_approval" | "sent" | "accepted" | "declined" | "expired" | "withdrawn";
  createdAt: string;
  expiresAt: string;
  approvedBy?: string;
  feeAmount: number;
  feeType: "percentage" | "fixed";
}

export const offerRecords: OfferRecord[] = [
  { id: "ofr_001", candidateName: "Priya Nair", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", salary: 2400000, currency: "INR", joiningBonus: 200000, startDate: daysAhead(30), status: "sent", createdAt: daysAgo(2), expiresAt: daysAhead(5), approvedBy: "Rohan Mehta", feeAmount: 200000, feeType: "fixed" },
  { id: "ofr_002", candidateName: "Kavya Reddy", clientName: "DataMinds AI", jobTitle: "ML Engineer", salary: 3200000, currency: "INR", joiningBonus: 300000, startDate: daysAhead(14), status: "accepted", createdAt: daysAgo(8), expiresAt: daysAgo(3), approvedBy: "Priya Menon", feeAmount: 250000, feeType: "fixed" },
  { id: "ofr_003", candidateName: "Arjun Iyer", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", salary: 2200000, currency: "INR", startDate: daysAhead(21), status: "pending_approval", createdAt: daysAgo(1), expiresAt: daysAhead(6), feeAmount: 180000, feeType: "fixed" },
  { id: "ofr_004", candidateName: "Vikram Singh", clientName: "SecureBank", jobTitle: "Security Analyst", salary: 1500000, currency: "INR", startDate: daysAhead(25), status: "draft", createdAt: daysAgo(0), expiresAt: daysAhead(7), feeAmount: 75000, feeType: "fixed" },
  { id: "ofr_005", candidateName: "Ananya Das", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", salary: 1800000, currency: "INR", startDate: daysAhead(18), status: "declined", createdAt: daysAgo(15), expiresAt: daysAgo(8), feeAmount: 180000, feeType: "fixed" },
];

export interface AssessmentRecord {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  assessmentName: string;
  type: "technical" | "aptitude" | "communication" | "coding" | "personality";
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  status: "pending" | "in_progress" | "completed" | "expired";
  startedAt?: string;
  completedAt?: string;
  deadline: string;
}

export const assessmentRecords: AssessmentRecord[] = [
  { id: "asm_001", candidateName: "Priya Nair", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", assessmentName: "React & TypeScript Deep Dive", type: "technical", score: 88, maxScore: 100, percentage: 88, passed: true, status: "completed", completedAt: daysAgo(3), deadline: daysAgo(2) },
  { id: "asm_002", candidateName: "Arjun Iyer", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", assessmentName: "Kubernetes & Systems Design", type: "technical", score: 82, maxScore: 100, percentage: 82, passed: true, status: "completed", completedAt: daysAgo(2), deadline: daysAhead(1) },
  { id: "asm_003", candidateName: "Sahil Khan", clientName: "DataMinds AI", jobTitle: "ML Engineer", assessmentName: "ML Fundamentals + Coding", type: "coding", score: 0, maxScore: 100, percentage: 0, passed: false, status: "in_progress", startedAt: daysAgo(1), deadline: daysAhead(2) },
  { id: "asm_004", candidateName: "Meera Krishnan", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", assessmentName: "Aptitude & Logical Reasoning", type: "aptitude", score: 0, maxScore: 100, percentage: 0, passed: false, status: "pending", deadline: daysAhead(5) },
  { id: "asm_005", candidateName: "Vikram Singh", clientName: "SecureBank", jobTitle: "Security Analyst", assessmentName: "Security Fundamentals", type: "technical", score: 72, maxScore: 100, percentage: 72, passed: true, status: "completed", completedAt: daysAgo(7), deadline: daysAgo(5) },
];

export interface FeedbackRecord {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  interviewRound: string;
  interviewer: string;
  rating: number;
  recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
  strengths: string[];
  concerns: string[];
  summary: string;
  submittedAt: string;
}

export const feedbackRecords: FeedbackRecord[] = [
  { id: "fb_001", candidateName: "Priya Nair", clientName: "TechCorp India", jobTitle: "Senior Full-Stack Engineer", interviewRound: "Technical Round 1", interviewer: "Rohan Mehta", rating: 5, recommendation: "strong_hire", strengths: ["Deep React knowledge", "Excellent system design thinking", "Great communication"], concerns: ["Limited GraphQL experience"], summary: "Outstanding candidate. Strong technical depth plus excellent soft skills. Recommend immediate offer.", submittedAt: daysAgo(1) },
  { id: "fb_002", candidateName: "Kavya Reddy", clientName: "DataMinds AI", jobTitle: "ML Engineer", interviewRound: "Final — Leadership", interviewer: "Priya Menon", rating: 5, recommendation: "strong_hire", strengths: ["Exceptional product sense", "Deep ML expertise", "Leadership potential"], concerns: [], summary: "Best candidate this year. Immediate offer recommended.", submittedAt: daysAgo(3) },
  { id: "fb_003", candidateName: "Vikram Singh", clientName: "SecureBank", jobTitle: "Security Analyst", interviewRound: "Technical", interviewer: "Anil Kumar", rating: 2, recommendation: "no_hire", strengths: ["Basic security knowledge"], concerns: ["Lacks hands-on SIEM experience", "Weak on incident response", "Certification gap"], summary: "Does not meet the technical bar for this role. Recommend reject.", submittedAt: daysAgo(5) },
  { id: "fb_004", candidateName: "Ananya Das", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", interviewRound: "HR Round", interviewer: "Karthik Subramanian", rating: 4, recommendation: "hire", strengths: ["Good cultural fit", "Strong communication", "Relevant experience"], concerns: ["Salary expectation at upper range"], summary: "Good candidate, recommend moving to offer.", submittedAt: daysAgo(1) },
];

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  type: "follow_up" | "submit_candidate" | "schedule_interview" | "collect_feedback" | "prepare_offer" | "client_meeting" | "documentation";
  relatedTo: string;
  clientName?: string;
  candidateName?: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedTo: string;
  createdAt: string;
}

export const taskItems: TaskItem[] = [
  { id: "tsk_001", title: "Follow up with TechCorp on Priya Nair offer", description: "Check if they're ready to release the offer letter", type: "follow_up", relatedTo: "ofr_001", clientName: "TechCorp India", candidateName: "Priya Nair", dueDate: daysAhead(1), priority: "high", status: "pending", assignedTo: "Karthik Subramanian", createdAt: daysAgo(2) },
  { id: "tsk_002", title: "Submit 3 more DevOps candidates to FinEdge", description: "Vikram needs 2 more candidates for the DevOps role", type: "submit_candidate", relatedTo: "jo_002", clientName: "FinEdge Solutions", dueDate: daysAhead(2), priority: "urgent", status: "in_progress", assignedTo: "Karthik Subramanian", createdAt: daysAgo(3) },
  { id: "tsk_003", title: "Schedule Sahil Khan's coding test", description: "Send assessment link and schedule by Thursday", type: "schedule_interview", relatedTo: "asm_003", clientName: "DataMinds AI", candidateName: "Sahil Khan", dueDate: daysAhead(1), priority: "high", status: "pending", assignedTo: "Karthik Subramanian", createdAt: daysAgo(1) },
  { id: "tsk_004", title: "Collect feedback from Anil Kumar (SecureBank)", description: "Interview was 5 days ago, feedback not submitted", type: "collect_feedback", relatedTo: "iv_005", clientName: "SecureBank", candidateName: "Vikram Singh", dueDate: daysAgo(2), priority: "medium", status: "overdue", assignedTo: "Karthik Subramanian", createdAt: daysAgo(7) },
  { id: "tsk_005", title: "Prepare offer letter for Arjun Iyer", description: "FinEdge approved — draft offer pending", type: "prepare_offer", relatedTo: "ofr_003", clientName: "FinEdge Solutions", candidateName: "Arjun Iyer", dueDate: daysAhead(1), priority: "urgent", status: "in_progress", assignedTo: "Karthik Subramanian", createdAt: daysAgo(1) },
  { id: "tsk_006", title: "Quarterly business review with TechCorp", description: "Schedule QBR meeting with Rohan to discuss next quarter mandates", type: "client_meeting", relatedTo: "ca_001", clientName: "TechCorp India", dueDate: daysAhead(7), priority: "medium", status: "pending", assignedTo: "Karthik Subramanian", createdAt: daysAgo(5) },
  { id: "tsk_007", title: "Update candidate compliance docs — Kavya Reddy", description: "Background check documents need verification", type: "documentation", relatedTo: "obd_003", clientName: "DataMinds AI", candidateName: "Kavya Reddy", dueDate: daysAgo(1), priority: "high", status: "overdue", assignedTo: "Karthik Subramanian", createdAt: daysAgo(4) },
];

export interface SourcingCampaign {
  id: string;
  name: string;
  description: string;
  type: "social" | "referral" | "job_board" | "linkedin" | "email" | "event";
  targetCandidates: number;
  sourced: number;
  qualified: number;
  submitted: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "completed" | "paused";
  budget: number;
  spent: number;
  channel: string;
  jobOrderId?: string;
}

export const sourcingCampaigns: SourcingCampaign[] = [
  { id: "scm_001", name: "Q4 DevOps Sourcing Sprint", description: "Target DevOps engineers for FinEdge mandate", type: "linkedin", targetCandidates: 50, sourced: 32, qualified: 14, submitted: 8, startDate: daysAgo(10), endDate: daysAhead(20), status: "active", budget: 50000, spent: 28000, channel: "LinkedIn Recruiter", jobOrderId: "jo_002" },
  { id: "scm_002", name: "ML Engineer Referral Drive", description: "Leverage existing placed candidates for referrals", type: "referral", targetCandidates: 20, sourced: 12, qualified: 8, submitted: 5, startDate: daysAgo(15), endDate: daysAhead(15), status: "active", budget: 30000, spent: 12000, channel: "Referral Network", jobOrderId: "jo_003" },
  { id: "scm_003", name: "Naukri Job Board — Full-Stack", description: "Post on Naukri for TechCorp full-stack role", type: "job_board", targetCandidates: 100, sourced: 68, qualified: 22, submitted: 12, startDate: daysAgo(20), endDate: daysAgo(5), status: "completed", budget: 20000, spent: 20000, channel: "Naukri", jobOrderId: "jo_001" },
  { id: "scm_004", name: "Security Analyst Email Campaign", description: "Target security professionals via email", type: "email", targetCandidates: 80, sourced: 18, qualified: 6, submitted: 2, startDate: daysAgo(5), endDate: daysAhead(25), status: "active", budget: 15000, spent: 8000, channel: "Email Outreach", jobOrderId: "jo_004" },
  { id: "scm_005", name: "Campus Drive — Tier-2 Colleges", description: "Entry-level sourcing for StartupX", type: "event", targetCandidates: 200, sourced: 0, qualified: 0, submitted: 0, startDate: daysAhead(10), endDate: daysAhead(40), status: "scheduled", budget: 75000, spent: 0, channel: "Campus Events", jobOrderId: "jo_006" },
];

export interface ReferralRecord {
  id: string;
  referrerName: string;
  referrerEmail: string;
  candidateName: string;
  candidateEmail: string;
  clientName?: string;
  jobTitle?: string;
  status: "submitted" | "contacted" | "interviewed" | "placed" | "rejected" | "expired";
  rewardAmount: number;
  rewardStatus: "pending" | "eligible" | "paid" | "ineligible";
  referredAt: string;
  notes?: string;
}

export const referralRecords: ReferralRecord[] = [
  { id: "ref_001", referrerName: "Kavya Reddy", referrerEmail: "kavya.r@gmail.com", candidateName: "Sneha Patel", candidateEmail: "sneha.p@gmail.com", clientName: "DataMinds AI", jobTitle: "ML Engineer", status: "interviewed", rewardAmount: 10000, rewardStatus: "eligible", referredAt: daysAgo(10), notes: "Strong ML profile, currently in interview loop" },
  { id: "ref_002", referrerName: "Arjun Iyer", referrerEmail: "arjun.i@gmail.com", candidateName: "Rahul Verma", candidateEmail: "rahul.v@gmail.com", clientName: "FinEdge Solutions", jobTitle: "DevOps Engineer", status: "placed", rewardAmount: 15000, rewardStatus: "paid", referredAt: daysAgo(30), notes: "Placed successfully — reward paid" },
  { id: "ref_003", referrerName: "Priya Nair", referrerEmail: "priya.n@gmail.com", candidateName: "Meera Iyer", candidateEmail: "meera.i@gmail.com", status: "submitted", rewardAmount: 5000, rewardStatus: "pending", referredAt: daysAgo(2), notes: "New referral — yet to contact" },
  { id: "ref_004", referrerName: "Vikram Singh", referrerEmail: "vikram.s@gmail.com", candidateName: "Arjun Nair", candidateEmail: "arjun.n@gmail.com", clientName: "TechCorp India", jobTitle: "Backend Engineer", status: "rejected", rewardAmount: 0, rewardStatus: "ineligible", referredAt: daysAgo(15), notes: "Didn't pass technical screen" },
  { id: "ref_005", referrerName: "Karthik Subramanian", referrerEmail: "karthik@hirebridge.in", candidateName: "Divya Menon", candidateEmail: "divya.m@gmail.com", clientName: "SecureBank", jobTitle: "Security Analyst", status: "contacted", rewardAmount: 10000, rewardStatus: "pending", referredAt: daysAgo(5), notes: "Initial screening scheduled" },
];

export interface InboxThread {
  id: string;
  candidateName: string;
  candidateEmail: string;
  subject: string;
  preview: string;
  body: string;
  unread: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "drafts" | "archived";
  tags: string[];
  receivedAt: string;
  lastReplyAt?: string;
  replies: number;
  attachments?: { name: string; size: string }[];
}

export const inboxThreads: InboxThread[] = [
  { id: "inx_001", candidateName: "Priya Nair", candidateEmail: "priya.nair@gmail.com", subject: "Re: Interview scheduled — Senior Full-Stack Engineer", preview: "Hi Karthik, confirmed for Thursday 2 PM. Looking forward to it!", body: "Hi Karthik,\n\nConfirmed for Thursday 2:00 PM IST. Looking forward to the interview!\n\nI've attached my updated portfolio and a recent project case study.\n\nThanks,\nPriya", unread: false, starred: true, folder: "inbox", tags: ["interview", "techcorp"], receivedAt: daysAgo(1), lastReplyAt: daysAgo(1), replies: 3, attachments: [{ name: "Portfolio_2024.pdf", size: "2.4 MB" }] },
  { id: "inx_002", candidateName: "Arjun Iyer", candidateEmail: "arjun.iyer@gmail.com", subject: "Offer details — DevOps Engineer at FinEdge", preview: "Thanks for the offer details. I have a few questions about...", body: "Hi Karthik,\n\nThanks for sharing the offer details. I have a few questions:\n1. Is the joining bonus included in the CTC or separate?\n2. What's the probation period?\n3. Remote work policy post-COVID?\n\nLooking forward to your response.\n\nRegards,\nArjun", unread: true, starred: false, folder: "inbox", tags: ["offer", "finedge"], receivedAt: daysAgo(0), replies: 1 },
  { id: "inx_003", candidateName: "Sahil Khan", candidateEmail: "sahil.khan@gmail.com", subject: "Assessment link not working", preview: "Hi, I tried accessing the ML assessment but the link seems broken...", body: "Hi Karthik,\n\nI tried accessing the ML assessment link but it shows 'Page not found'. Can you please resend?\n\nThanks,\nSahil", unread: true, starred: false, folder: "inbox", tags: ["assessment", "dataminds"], receivedAt: daysAgo(0), replies: 0 },
  { id: "inx_004", candidateName: "Kavya Reddy", candidateEmail: "kavya.reddy@gmail.com", subject: "Thank you — joined DataMinds AI!", preview: "Hi Karthik, just wanted to thank you for the smooth placement...", body: "Hi Karthik,\n\nJust wanted to thank you for the smooth placement process. I joined DataMinds AI yesterday and am really excited about the role!\n\nWill keep in touch.\n\nBest,\nKavya", unread: false, starred: true, folder: "inbox", tags: ["placement", "dataminds"], receivedAt: daysAgo(2), replies: 2 },
  { id: "inx_005", candidateName: "Meera Krishnan", candidateEmail: "meera.k@gmail.com", subject: "Availability for TechCorp interview", preview: "Hi, I'm available Monday-Wednesday next week for the interview...", body: "Hi Karthik,\n\nI'm available Monday-Wednesday next week (any time after 11 AM) for the TechCorp interview. Please let me know what works.\n\nThanks,\nMeera", unread: false, starred: false, folder: "inbox", tags: ["interview", "techcorp"], receivedAt: daysAgo(3), replies: 4 },
]

export interface ActivityLog {
  id: string;
  type: "call" | "email" | "meeting" | "submission" | "interview" | "offer" | "placement" | "note" | "task";
  description: string;
  candidateName?: string;
  clientName?: string;
  performedBy: string;
  timestamp: string;
  outcome?: string;
}

export const activityLogs: ActivityLog[] = [
  { id: "act_001", type: "email", description: "Sent interview confirmation to Priya Nair", candidateName: "Priya Nair", clientName: "TechCorp India", performedBy: "Karthik Subramanian", timestamp: daysAgo(1), outcome: "Confirmed" },
  { id: "act_002", type: "call", description: "Called Vikram Joshi re: DevOps mandate update", clientName: "FinEdge Solutions", performedBy: "Karthik Subramanian", timestamp: daysAgo(1), outcome: "Need 2 more candidates" },
  { id: "act_003", type: "submission", description: "Submitted Arjun Iyer to FinEdge for DevOps role", candidateName: "Arjun Iyer", clientName: "FinEdge Solutions", performedBy: "Karthik Subramanian", timestamp: daysAgo(2), outcome: "Interview scheduled" },
  { id: "act_004", type: "interview", description: "Kavya Reddy — final round with DataMinds AI", candidateName: "Kavya Reddy", clientName: "DataMinds AI", performedBy: "Karthik Subramanian", timestamp: daysAgo(3), outcome: "Cleared — offer approved" },
  { id: "act_005", type: "placement", description: "Kavya Reddy placed at DataMinds AI as ML Engineer", candidateName: "Kavya Reddy", clientName: "DataMinds AI", performedBy: "Karthik Subramanian", timestamp: daysAgo(2), outcome: "Joined" },
  { id: "act_006", type: "offer", description: "Offer sent to Priya Nair — ₹24L + ₹2L joining bonus", candidateName: "Priya Nair", clientName: "TechCorp India", performedBy: "Karthik Subramanian", timestamp: daysAgo(2), outcome: "Awaiting response" },
  { id: "act_007", type: "meeting", description: "QBR with TechCorp — discussed Q1 hiring plan", clientName: "TechCorp India", performedBy: "Karthik Subramanian", timestamp: daysAgo(5), outcome: "4 new mandates expected" },
  { id: "act_008", type: "note", description: "Vikram Singh's security cert expired — needs renewal", candidateName: "Vikram Singh", performedBy: "Karthik Subramanian", timestamp: daysAgo(4) },
  { id: "act_009", type: "task", description: "Created task: Collect feedback from Anil Kumar", clientName: "SecureBank", performedBy: "Karthik Subramanian", timestamp: daysAgo(3), outcome: "Overdue" },
  { id: "act_010", type: "email", description: "Sent regret email to 5 rejected candidates", performedBy: "Karthik Subramanian", timestamp: daysAgo(6), outcome: "Completed" },
];

export interface RecruitmentWallet {
  balance: number;
  currency: string;
  totalEarned: number;
  totalWithdrawn: number;
  pendingPayout: number;
  thisMonthEarned: number;
}

export const recruitmentWallet: RecruitmentWallet = {
  balance: 842000,
  currency: "INR",
  totalEarned: 4600000,
  totalWithdrawn: 3758000,
  pendingPayout: 410000,
  thisMonthEarned: 680000,
};

export interface RecruitmentSettlement {
  id: string;
  settlementNumber: string;
  period: string;
  grossAmount: number;
  partnerShare: number;
  jobsonnShare: number;
  deductions: number;
  netPayable: number;
  status: "draft" | "approved" | "paid" | "disputed";
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  lineItems: { description: string; amount: number }[];
  createdAt: string;
}

export const recruitmentSettlements: RecruitmentSettlement[] = [
  { id: "rstl_001", settlementNumber: "RST-2024-0101", period: "Oct 2024", grossAmount: 680000, partnerShare: 462400, jobsonnShare: 217600, deductions: 8000, netPayable: 454400, status: "paid", paymentDate: daysAgo(3), paymentMethod: "NEFT", transactionId: "NEFT24102401", lineItems: [{ description: "Kavya Reddy placement — DataMinds AI", amount: 250000 }, { description: "UI/UX Designer placement — TechCorp", amount: 90000 }, { description: "2 DevOps contract placements — FinEdge", amount: 340000 }], createdAt: daysAgo(5) },
  { id: "rstl_002", settlementNumber: "RST-2024-0102", period: "Nov 2024 (partial)", grossAmount: 410000, partnerShare: 278800, jobsonnShare: 131200, deductions: 5000, netPayable: 273800, status: "approved", lineItems: [{ description: "Priya Nair placement — TechCorp (pending offer accept)", amount: 200000 }, { description: "Arjun Iyer placement — FinEdge (pending)", amount: 180000 }, { description: "Referral bonuses", amount: 30000 }], createdAt: daysAgo(1) },
];

export interface RecruitmentAuditLog {
  id: string;
  actor: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  status: "success" | "failed" | "warning";
  details: string;
  candidateName?: string;
  clientName?: string;
}

export const recruitmentAuditLogs: RecruitmentAuditLog[] = [
  { id: "raul_001", actor: "Karthik Subramanian", action: "submission.created", module: "Submissions", timestamp: daysAgo(1), ip: "203.0.113.42", status: "success", details: "Submitted Arjun Iyer to FinEdge for DevOps role", candidateName: "Arjun Iyer", clientName: "FinEdge Solutions" },
  { id: "raul_002", actor: "Karthik Subramanian", action: "offer.sent", module: "Offers", timestamp: daysAgo(2), ip: "203.0.113.42", status: "success", details: "Sent offer ₹24L to Priya Nair for TechCorp", candidateName: "Priya Nair", clientName: "TechCorp India" },
  { id: "raul_003", actor: "System", action: "placement.recorded", module: "Placements", timestamp: daysAgo(2), ip: "0.0.0.0", status: "success", details: "Kavya Reddy placed at DataMinds AI — auto-recorded from onboarding completion", candidateName: "Kavya Reddy", clientName: "DataMinds AI" },
  { id: "raul_004", actor: "Karthik Subramanian", action: "invoice.generated", module: "Finance", timestamp: daysAgo(3), ip: "203.0.113.42", status: "success", details: "Generated invoice INV-2024-5001 for TechCorp ₹200K", clientName: "TechCorp India" },
  { id: "raul_005", actor: "Karthik Subramanian", action: "candidate.compliance_updated", module: "Compliance", timestamp: daysAgo(4), ip: "203.0.113.42", status: "warning", details: "Vikram Singh security certification expired", candidateName: "Vikram Singh" },
  { id: "raul_006", actor: "Karthik Subramanian", action: "login", module: "Auth", timestamp: daysAgo(0), ip: "203.0.113.42", status: "success", details: "Successful login from Chrome" },
  { id: "raul_007", actor: "System", action: "settlement.processed", module: "Finance", timestamp: daysAgo(3), ip: "0.0.0.0", status: "success", details: "Settlement RST-2024-0101 paid via NEFT — ₹454,400", },
]

// ============================================================
// ADDITIONAL PARTNER PORTAL DATA (from reference screenshots)
// Generic partner view: Deals, Accounts & Tax, Assistance, Online Software, Communication
// College partner view: Partnership, Academics, Careers & Outcomes
// ============================================================

export interface Deal {
  id: string;
  dealName: string;
  clientName: string;
  partnerId: string;
  partnerName: string;
  model: PartnerModel;
  value: number;
  currency: string;
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  probability: number;
  expectedCloseDate: string;
  contactName: string;
  contactEmail: string;
  description: string;
  createdAt: string;
  assignedTo: string;
}

export const deals: Deal[] = [
  { id: "deal_001", dealName: "Full-Stack Training — 200 students", clientName: "Wipro Technologies", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", model: "CENTRE", value: 9000000, currency: "INR", stage: "negotiation", probability: 70, expectedCloseDate: daysAhead(15), contactName: "Suresh HR", contactEmail: "suresh@wipro.com", description: "Batch training for 200 lateral hires — Full-Stack program", createdAt: daysAgo(20), assignedTo: "Rajesh Kumar" },
  { id: "deal_002", dealName: "Cloud Migration — Acme Corp", clientName: "Acme Manufacturing", partnerId: "ptn_004", partnerName: "Meridian IT Services", model: "SERVICE", value: 1500000, currency: "INR", stage: "proposal", probability: 50, expectedCloseDate: daysAhead(20), contactName: "Anil Sharma", contactEmail: "anil@acme.com", description: "Cloud migration assessment + implementation", createdAt: daysAgo(10), assignedTo: "Arvind Menon" },
  { id: "deal_003", dealName: "ERP Integration — Stellar Retail", clientName: "Stellar Retail", partnerId: "ptn_005", partnerName: "Northwind Tech Solutions", model: "TECHNOLOGY", value: 3200000, currency: "INR", stage: "won", probability: 100, expectedCloseDate: daysAgo(5), contactName: "Priya Shah", contactEmail: "priya@stellarretail.in", description: "ERP integration project — phase 1 complete", createdAt: daysAgo(45), assignedTo: "Priya Gupta" },
  { id: "deal_004", dealName: "Document AI POC — FinServe", clientName: "FinServe Group", partnerId: "ptn_006", partnerName: "CogniAI Labs", model: "AI", value: 800000, currency: "INR", stage: "qualified", probability: 40, expectedCloseDate: daysAhead(30), contactName: "Rahul Mehta", contactEmail: "rahul@finserve.com", description: "Document AI proof of concept for loan processing", createdAt: daysAgo(7), assignedTo: "Dr. Anika Reddy" },
  { id: "deal_005", dealName: "DevOps Retainer — Northwind", clientName: "Northwind Logistics", partnerId: "ptn_004", partnerName: "Meridian IT Services", model: "SERVICE", value: 4800000, currency: "INR", stage: "won", probability: 100, expectedCloseDate: daysAgo(60), contactName: "Vikram Singh", contactEmail: "vikram@northwind.in", description: "Annual DevOps retainer — AMC", createdAt: daysAgo(90), assignedTo: "Arvind Menon" },
  { id: "deal_006", dealName: "Campus Placement Drive — Kanchana", clientName: "Kanchana Institute", partnerId: "ptn_007", partnerName: "HireBridge Staffing", model: "RECRUITMENT", value: 600000, currency: "INR", stage: "proposal", probability: 60, expectedCloseDate: daysAhead(10), contactName: "Dr. Suresh K", contactEmail: "suresh@kanchana.edu.in", description: "Placement drive for 200 final-year students", createdAt: daysAgo(8), assignedTo: "Karthik Subramanian" },
  { id: "deal_007", dealName: "Data Science Program — 120 students", clientName: "Veltech University", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", model: "COLLEGE", value: 4500000, currency: "INR", stage: "negotiation", probability: 75, expectedCloseDate: daysAhead(7), contactName: "Dr. Lakshmi", contactEmail: "lakshmi@veltech.edu", description: "Data Science program for 120 students — Model D", createdAt: daysAgo(15), assignedTo: "Dr. Suresh K" },
  { id: "deal_008", dealName: "Security Audit — HealthPlus", clientName: "HealthPlus", partnerId: "ptn_006", partnerName: "CogniAI Labs", model: "AI", value: 320000, currency: "INR", stage: "lead", probability: 20, expectedCloseDate: daysAhead(45), contactName: "Meera Joshi", contactEmail: "meera@healthplus.in", description: "Cybersecurity audit + AI threat detection", createdAt: daysAgo(3), assignedTo: "Dr. Anika Reddy" },
];

export interface TaxRate {
  id: string;
  name: string;
  type: "GST" | "TDS" | "Service Tax" | "Professional Tax";
  rate: number;
  applicableOn: string;
  status: "active" | "inactive";
  description: string;
}

export const taxRates: TaxRate[] = [
  { id: "txr_001", name: "GST 18%", type: "GST", rate: 18, applicableOn: "Training services", status: "active", description: "Standard GST on training and certification services" },
  { id: "txr_002", name: "GST 12%", type: "GST", rate: 12, applicableOn: "Online courses", status: "active", description: "Reduced GST on digital/online course delivery" },
  { id: "txr_003", name: "TDS 10%", type: "TDS", rate: 10, applicableOn: "Professional services", status: "active", description: "TDS deducted on service payments above ₹30,000" },
  { id: "txr_004", name: "TDS 2%", type: "TDS", rate: 2, applicableOn: "Contractor payments", status: "active", description: "TDS on contractor/subcontractor payments" },
  { id: "txr_005", name: "Professional Tax", type: "Professional Tax", rate: 200, applicableOn: "Per employee/month", status: "active", description: "State professional tax — Tamil Nadu" },
  { id: "txr_006", name: "GST 5%", type: "GST", rate: 5, applicableOn: "Educational materials", status: "active", description: "Reduced GST on printed educational materials" },
];

export interface PartnerTransaction {
  id: string;
  partnerId: string;
  partnerName: string;
  type: "credit" | "debit" | "tax" | "fee" | "refund" | "payout";
  amount: number;
  balance: number;
  description: string;
  reference: string;
  taxRate?: number;
  taxAmount?: number;
  netAmount?: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export const partnerTransactions: PartnerTransaction[] = [
  { id: "ptx_001", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "credit", amount: 43000, balance: 523000, description: "Enrollment — Full-Stack Program (B-24-10)", reference: "ENR-2024-0892", taxRate: 18, taxAmount: 7740, netAmount: 35260, timestamp: daysAgo(10), status: "completed" },
  { id: "ptx_002", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "tax", amount: 7740, balance: 515260, description: "GST 18% — ENR-2024-0892", reference: "GST-2024-0892", timestamp: daysAgo(10), status: "completed" },
  { id: "ptx_003", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "payout", amount: 324000, balance: 191260, description: "Settlement STL-2024-0101 — Oct 2024", reference: "STL-2024-0101", timestamp: daysAgo(3), status: "completed" },
  { id: "ptx_004", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "fee", amount: 860, balance: 190400, description: "Payment gateway fee — ENR-2024-0892", reference: "PGF-2024-0892", timestamp: daysAgo(10), status: "completed" },
  { id: "ptx_005", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "credit", amount: 38000, balance: 228400, description: "Enrollment — Data Science (B-24-11)", reference: "ENR-2024-0893", taxRate: 18, taxAmount: 6840, netAmount: 31160, timestamp: daysAgo(7), status: "completed" },
  { id: "ptx_006", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "debit", amount: 50000, balance: 178400, description: "Marketing materials — Q4 campaign", reference: "MKT-2024-0042", timestamp: daysAgo(7), status: "completed" },
  { id: "ptx_007", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "credit", amount: 25000, balance: 203400, description: "Digital Marketing enrollment (B-24-12)", reference: "ENR-2024-0894", taxRate: 18, taxAmount: 4500, netAmount: 20500, timestamp: daysAgo(5), status: "completed" },
  { id: "ptx_008", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", type: "refund", amount: 25000, balance: 178400, description: "Refund — Student withdrawal (B-24-09)", reference: "REF-2024-0023", timestamp: daysAgo(4), status: "completed" },
];

export interface FormTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  type: "form" | "certificate" | "guideline" | "agreement";
  downloadable: boolean;
  lastUpdated: string;
  mandatory: boolean;
}

export const formTemplates: FormTemplate[] = [
  { id: "ftm_001", name: "Student Enrollment Form", category: "Admissions", description: "Standard student enrollment form for all programs", type: "form", downloadable: true, lastUpdated: daysAgo(30), mandatory: true },
  { id: "ftm_002", name: "Centre Inspection Checklist", category: "Compliance", description: "Self-assessment checklist for centre inspection", type: "form", downloadable: true, lastUpdated: daysAgo(15), mandatory: true },
  { id: "ftm_003", name: "Partner Agreement Template", category: "Legal", description: "Standard partnership agreement template", type: "agreement", downloadable: true, lastUpdated: daysAgo(90), mandatory: true },
  { id: "ftm_004", name: "Course Completion Certificate", category: "Certification", description: "Standard certificate template for course completion", type: "certificate", downloadable: true, lastUpdated: daysAgo(45), mandatory: false },
  { id: "ftm_005", name: "GST Filing Guidelines", category: "Tax", description: "Step-by-step GST filing guide for partners", type: "guideline", downloadable: true, lastUpdated: daysAgo(60), mandatory: false },
  { id: "ftm_006", name: "Faculty Onboarding Form", category: "HR", description: "Faculty registration and onboarding form", type: "form", downloadable: true, lastUpdated: daysAgo(20), mandatory: true },
  { id: "ftm_007", name: "Student KYC Form", category: "Compliance", description: "Student identity verification form", type: "form", downloadable: true, lastUpdated: daysAgo(10), mandatory: true },
  { id: "ftm_008", name: "Placement Report Template", category: "Reporting", description: "Monthly placement report template", type: "form", downloadable: true, lastUpdated: daysAgo(5), mandatory: false },
  { id: "ftm_009", name: "Data Protection Guidelines", category: "Compliance", description: "DPDP Act compliance guidelines for partners", type: "guideline", downloadable: true, lastUpdated: daysAgo(75), mandatory: true },
  { id: "ftm_010", name: "Centre Branding Guidelines", category: "Marketing", description: "Co-branding guidelines for partner centres", type: "guideline", downloadable: true, lastUpdated: daysAgo(120), mandatory: false },
];

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  qualifications: string;
  experience: number;
  certifications: string[];
  coursesAssigned: number;
  studentsTaught: number;
  rating: number;
  status: "active" | "on_leave" | "inactive";
  joinedAt: string;
  partnerId: string;
  partnerName: string;
}

export const faculty: Faculty[] = [
  { id: "fac_001", name: "Dr. Senthil Kumar", email: "senthil@chennaitachacademy.in", phone: "+91 98400 11111", specializations: ["React", "Full-Stack", "System Design"], qualifications: "PhD Computer Science, IIT Madras", experience: 15, certifications: ["AWS Solutions Architect", "Google Cloud Professional"], coursesAssigned: 3, studentsTaught: 420, rating: 4.8, status: "active", joinedAt: daysAgo(400), partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "fac_002", name: "Lakshmi Nair", email: "lakshmi@chennaitachacademy.in", phone: "+91 98400 22222", specializations: ["Data Science", "Python", "ML"], qualifications: "M.Tech AI, BITS Pilani", experience: 8, certifications: ["Google ML Engineer"], coursesAssigned: 2, studentsTaught: 280, rating: 4.6, status: "active", joinedAt: daysAgo(300), partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "fac_003", name: "Rajesh Kumar", email: "rajesh@chennaitachacademy.in", phone: "+91 98400 33333", specializations: ["Cloud", "DevOps", "Kubernetes"], qualifications: "B.Tech, CKA Certified", experience: 12, certifications: ["CKA", "AWS DevOps Pro"], coursesAssigned: 2, studentsTaught: 350, rating: 4.7, status: "active", joinedAt: daysAgo(420), partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "fac_004", name: "Priya S", email: "priya.s@chennaitachacademy.in", phone: "+91 98400 44444", specializations: ["Digital Marketing", "SEO", "Analytics"], qualifications: "MBA Marketing, IIM Bangalore", experience: 10, certifications: ["Google Analytics Certified"], coursesAssigned: 1, studentsTaught: 180, rating: 4.5, status: "on_leave", joinedAt: daysAgo(200), partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "fac_005", name: "Dr. Anand Verma", email: "anand@kanchana.edu.in", phone: "+91 98400 55555", specializations: ["Cybersecurity", "Networking"], qualifications: "PhD Information Security, IISc", experience: 18, certifications: ["CISM", "CISA", "CISSP"], coursesAssigned: 2, studentsTaught: 540, rating: 4.9, status: "active", joinedAt: daysAgo(180), partnerId: "ptn_003", partnerName: "Kanchana Institute" },
  { id: "fac_006", name: "Meera Krishnan", email: "meera@bscbengaluru.in", phone: "+91 99000 66666", specializations: ["UI/UX Design", "Figma", "Research"], qualifications: "M.Des, NID Ahmedabad", experience: 7, certifications: ["Google UX Design"], coursesAssigned: 1, studentsTaught: 120, rating: 4.4, status: "active", joinedAt: daysAgo(150), partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre" },
];

export interface Internship {
  id: string;
  studentName: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate?: string;
  status: "open" | "applied" | "in_progress" | "completed" | "withdrawn";
  stipend: number;
  partnerId: string;
  partnerName: string;
  collegeName?: string;
  mentor?: string;
}

export const internships: Internship[] = [
  { id: "int_001", studentName: "Aarav Sharma", company: "TechCorp India", role: "Full-Stack Intern", duration: "3 months", startDate: daysAgo(30), status: "in_progress", stipend: 25000, partnerId: "ptn_003", partnerName: "Kanchana Institute", collegeName: "Kanchana Institute of Technology", mentor: "Rohan Mehta" },
  { id: "int_002", studentName: "Divya Lakshmi", company: "DataMinds AI", role: "ML Intern", duration: "6 months", startDate: daysAgo(60), status: "in_progress", stipend: 35000, partnerId: "ptn_003", partnerName: "Kanchana Institute", collegeName: "Veltech University", mentor: "Dr. Suresh" },
  { id: "int_003", studentName: "Karthik Reddy", company: "FinEdge Solutions", role: "DevOps Intern", duration: "3 months", startDate: daysAgo(90), endDate: daysAgo(0), status: "completed", stipend: 30000, partnerId: "ptn_003", partnerName: "Kanchana Institute", collegeName: "Kanchana Institute", mentor: "Vikram Joshi" },
  { id: "int_004", studentName: "Meera Iyer", company: "TechCorp India", role: "UI/UX Intern", duration: "2 months", startDate: daysAhead(15), status: "open", stipend: 20000, partnerId: "ptn_003", partnerName: "Kanchana Institute", collegeName: "Veltech University" },
  { id: "int_005", studentName: "Sanjay Gupta", company: "SecureBank", role: "Security Intern", duration: "3 months", startDate: daysAgo(15), status: "applied", stipend: 22000, partnerId: "ptn_003", partnerName: "Kanchana Institute", collegeName: "Kanchana Institute" },
];

export interface StudentProject {
  id: string;
  title: string;
  studentName: string;
  company?: string;
  category: string;
  description: string;
  status: "proposed" | "in_progress" | "submitted" | "completed" | "graded";
  grade?: string;
  startDate: string;
  endDate?: string;
  mentor?: string;
  partnerId: string;
  partnerName: string;
}

export const studentProjects: StudentProject[] = [
  { id: "prj_001", title: "E-commerce Platform with React & Node.js", studentName: "Aarav Sharma", company: "TechCorp India", category: "Full-Stack", description: "Build a full-featured e-commerce platform with cart, payments, and admin dashboard.", status: "completed", grade: "A+", startDate: daysAgo(60), endDate: daysAgo(30), mentor: "Dr. Senthil Kumar", partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "prj_002", title: "ML-based Document Classifier", studentName: "Divya Lakshmi", company: "DataMinds AI", category: "Machine Learning", description: "Train and deploy a document classification model using NLP.", status: "in_progress", startDate: daysAgo(20), mentor: "Lakshmi Nair", partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "prj_003", title: "Kubernetes Multi-Cluster Monitoring", studentName: "Karthik Reddy", company: "FinEdge Solutions", category: "DevOps", description: "Set up monitoring across multiple K8s clusters with Prometheus + Grafana.", status: "submitted", startDate: daysAgo(45), endDate: daysAgo(5), mentor: "Rajesh Kumar", partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "prj_004", title: "Digital Marketing Campaign — D2C Brand", studentName: "Meera Iyer", category: "Marketing", description: "Design and execute a full digital marketing campaign for a D2C brand.", status: "proposed", startDate: daysAhead(10), partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "prj_005", title: "Security Audit Tool", studentName: "Sanjay Gupta", company: "SecureBank", category: "Security", description: "Build an automated security audit tool for web applications.", status: "graded", grade: "A", startDate: daysAgo(90), endDate: daysAgo(60), mentor: "Dr. Anand Verma", partnerId: "ptn_003", partnerName: "Kanchana Institute" },
];

export interface EventDrive {
  id: string;
  name: string;
  type: "placement_drive" | "workshop" | "hackathon" | "seminar" | "career_fair" | "tech_talk";
  description: string;
  date: string;
  endDate?: string;
  location: string;
  modality: "online" | "offline" | "hybrid";
  expectedAttendees: number;
  registered: number;
  companies: string[];
  status: "upcoming" | "active" | "completed" | "cancelled";
  partnerId: string;
  partnerName: string;
}

export const eventDrives: EventDrive[] = [
  { id: "evd_001", name: "Q4 Campus Placement Drive 2024", type: "placement_drive", description: "Placement drive with 12 companies hiring for 200+ positions.", date: daysAhead(7), endDate: daysAhead(8), location: "Kanchana Institute Campus, Coimbatore", modality: "offline", expectedAttendees: 500, registered: 420, companies: ["TechCorp India", "FinEdge Solutions", "DataMinds AI", "SecureBank", "PayBridge"], status: "upcoming", partnerId: "ptn_003", partnerName: "Kanchana Institute" },
  { id: "evd_002", name: "React 19 Hands-on Workshop", type: "workshop", description: "2-day intensive React 19 workshop with hands-on labs.", date: daysAhead(14), location: "Chennai Tech Academy — Main Campus", modality: "hybrid", expectedAttendees: 60, registered: 48, companies: [], status: "upcoming", partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
  { id: "evd_003", name: "AI Hackathon 2024", type: "hackathon", description: "48-hour AI hackathon — build ML solutions for real problems.", date: daysAgo(15), endDate: daysAgo(13), location: "Veltech University, Chennai", modality: "offline", expectedAttendees: 200, registered: 186, companies: ["DataMinds AI", "CogniAI Labs"], status: "completed", partnerId: "ptn_003", partnerName: "Kanchana Institute" },
  { id: "evd_004", name: "Career Fair — Tech & Design", type: "career_fair", description: "Career fair with 20+ companies across technology and design.", date: daysAhead(30), location: "Bengaluru Skills Centre", modality: "offline", expectedAttendees: 300, registered: 0, companies: [], status: "upcoming", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre" },
  { id: "evd_005", name: "Tech Talk: Cloud-Native Architecture", type: "tech_talk", description: "Industry expert talk on cloud-native architecture patterns.", date: daysAhead(5), location: "Online (Zoom)", modality: "online", expectedAttendees: 200, registered: 142, companies: [], status: "upcoming", partnerId: "ptn_001", partnerName: "Chennai Tech Academy" },
];

export interface Renewal {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerModel: PartnerModel;
  agreementType: string;
  currentStartDate: string;
  currentEndDate: string;
  renewalDate: string;
  proposedEndDate: string;
  status: "not_due" | "due_soon" | "in_renewal" | "renewed" | "expired";
  currentTerms: string;
  proposedTerms?: string;
  daysToExpiry: number;
  value: number;
}

export const renewals: Renewal[] = [
  { id: "rnl_001", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", agreementType: "Centre Partnership Agreement", currentStartDate: daysAgo(280), currentEndDate: daysAhead(85), renewalDate: daysAhead(55), proposedEndDate: daysAhead(450), status: "due_soon", currentTerms: "Standard — 60% partner share", proposedTerms: "Premium — 65% partner share + 2 new programs", daysToExpiry: 85, value: 2100000 },
  { id: "rnl_002", partnerId: "ptn_004", partnerName: "Meridian IT Services", partnerModel: "SERVICE", agreementType: "Service Partner Agreement", currentStartDate: daysAgo(340), currentEndDate: daysAhead(25), renewalDate: daysAhead(-5), proposedEndDate: daysAhead(365), status: "in_renewal", currentTerms: "Standard — 75% partner share", proposedTerms: "Same terms + expanded service catalog", daysToExpiry: 25, value: 5200000 },
  { id: "rnl_003", partnerId: "ptn_007", partnerName: "HireBridge Staffing", partnerModel: "RECRUITMENT", agreementType: "Recruitment Partner Agreement", currentStartDate: daysAgo(310), currentEndDate: daysAhead(55), renewalDate: daysAhead(25), proposedEndDate: daysAhead(420), status: "due_soon", currentTerms: "Standard — 68% partner share", proposedTerms: "Premium — 72% partner share + RPO tier", daysToExpiry: 55, value: 4600000 },
  { id: "rnl_004", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", agreementType: "Centre Partnership Agreement", currentStartDate: daysAgo(420), currentEndDate: daysAhead(310), renewalDate: daysAhead(280), status: "not_due", currentTerms: "Premium — 70% partner share", daysToExpiry: 310, value: 3840000 },
  { id: "rnl_005", partnerId: "ptn_005", partnerName: "Northwind Tech Solutions", partnerModel: "TECHNOLOGY", agreementType: "Technology Partner Agreement", currentStartDate: daysAgo(400), currentEndDate: daysAhead(330), renewalDate: daysAhead(300), status: "not_due", currentTerms: "Enterprise — 72% partner share", daysToExpiry: 330, value: 6800000 },
];

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: "system" | "policy" | "program" | "event" | "compliance" | "marketing";
  priority: "info" | "warning" | "critical";
  publishedAt: string;
  expiresAt?: string;
  audience: "all" | "centre" | "college" | "service" | "technology" | "ai" | "recruitment";
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export const announcements: Announcement[] = [
  { id: "ann_001", title: "New GST rate for online courses", message: "Effective Nov 1, 2024, the GST rate for online course delivery has been reduced from 18% to 12%. Please update your fee structures accordingly.", category: "policy", priority: "warning", publishedAt: daysAgo(5), expiresAt: daysAhead(25), audience: "all", read: false, actionLabel: "View guidelines", actionRoute: "forms-assistance" },
  { id: "ann_002", title: "Q4 Placement Drive — Registration Open", message: "The Q4 campus placement drive is now open for registration. 12 companies, 200+ positions. Register your students before Nov 15.", category: "event", priority: "info", publishedAt: daysAgo(3), expiresAt: daysAhead(10), audience: "college", read: false, actionLabel: "Register students", actionRoute: "events-drives" },
  { id: "ann_003", title: "Centre Inspection — Q4 Schedule Released", message: "The Q4 centre inspection schedule has been released. All active centres must complete the self-assessment checklist by Nov 20.", category: "compliance", priority: "critical", publishedAt: daysAgo(7), expiresAt: daysAhead(13), audience: "centre", read: false, actionLabel: "Download checklist", actionRoute: "forms-assistance" },
  { id: "ann_004", title: "New Program Launch: Cloud & DevOps Engineering", message: "A new Cloud & DevOps Engineering program (JN-Cloud-301) is now available for all centre partners. 12-week program, 60% partner share.", category: "program", priority: "info", publishedAt: daysAgo(10), audience: "centre", read: true, actionLabel: "View program", actionRoute: "programs" },
  { id: "ann_005", title: "DPDP Act Compliance — Deadline Extended", message: "The deadline for DPDP Act compliance certification has been extended to Dec 31, 2024. All partners must complete the compliance training.", category: "compliance", priority: "warning", publishedAt: daysAgo(15), expiresAt: daysAhead(45), audience: "all", read: true, actionLabel: "Start training", actionRoute: "compliance" },
  { id: "ann_006", title: "Settlement Cycle Change — Monthly to Bi-weekly", message: "Effective Dec 1, 2024, settlements will be processed bi-weekly instead of monthly. This means faster payouts for all partners.", category: "system", priority: "info", publishedAt: daysAgo(2), audience: "all", read: false },
]
