// ============================================================
// jobson.id Franchise / Partner Model Domain Types
// 6 partner models: Centre, College, Service, Technology, AI, Recruitment
// ============================================================

export type PartnerModel = "CENTRE" | "COLLEGE" | "SERVICE" | "TECHNOLOGY" | "AI" | "RECRUITMENT";

export type PartnerStatus = "prospect" | "applied" | "under_review" | "approved" | "active" | "suspended" | "terminated" | "expired";

export type PartnerTier = "starter" | "standard" | "premium" | "enterprise";

export type CapabilityState = "ENABLED" | "DISABLED" | "CONFIGURABLE";

export interface PartnerCapabilities {
  centreManagement: CapabilityState;
  centreInspection: CapabilityState;
  infrastructure: CapabilityState;
  physicalTraining: CapabilityState;
  localDelivery: CapabilityState;
  serviceDelivery: CapabilityState;
  leadGeneration: CapabilityState;
  counselling: CapabilityState;
  admissions: CapabilityState;
  referrals: CapabilityState;
  marketing: CapabilityState;
  wallet: CapabilityState;
  settlements: CapabilityState;
  lmsAccess: CapabilityState;
  certificationAccess: CapabilityState;
}

export interface Partner {
  id: string;
  name: string;
  legalName: string;
  model: PartnerModel;
  tier: PartnerTier;
  status: PartnerStatus;
  logo: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  territory?: string;
  establishedYear: number;
  joinedAt: string;
  agreementStart: string;
  agreementEnd: string;
  studentsEnrolled: number;
  studentsGraduated: number;
  revenueYTD: number;
  settlementsYTD: number;
  walletBalance: number;
  pendingSettlement: number;
  rating: number;
  capabilities: PartnerCapabilities;
  accreditation?: string[];
  specialities?: string[];
}

export interface PartnerApplication {
  id: string;
  applicationCode: string;
  model: PartnerModel;
  applicantName: string;
  organizationName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "withdrawn";
  submittedAt?: string;
  reviewedAt?: string;
  currentStep: number;
  totalSteps: number;
  assignedTo?: string;
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
}

export interface Lead {
  id: string;
  partnerId?: string;
  partnerName?: string;
  leadSource: "PARTNER_GENERATED" | "JOBSON_ID_GENERATED" | "JOBSON_ID_DELIVERY" | "DIGITAL_REFERRAL" | "WALK_IN" | "WEBSITE";
  name: string;
  email: string;
  phone: string;
  programInterest: string;
  city: string;
  status: "new" | "contacted" | "qualified" | "enrolled" | "lost" | "nurture";
  estimatedValue: number;
  createdAt: string;
  assignedTo?: string;
  notes?: string;
}

export interface RevenueShareRule {
  id: string;
  leadSource: string;
  partnerModel: PartnerModel;
  partnerPct: number;
  jobsonIdPct: number;
  priority: number;
  active: boolean;
  ruleName: string;
}

export interface RevenueSplit {
  id: string;
  partnerId: string;
  partnerName: string;
  programId: string;
  programName: string;
  leadSource: string;
  grossRevenue: number;
  discount: number;
  netCollected: number;
  gatewayFee: number;
  tax: number;
  netAfterFees: number;
  partnerPct: number;
  jobsonIdPct: number;
  partnerShare: number;
  jobsonIdShare: number;
  ruleApplied: string;
  status: "pending" | "processed" | "settled" | "disputed";
  settledAt?: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  settlementNumber: string;
  partnerId: string;
  partnerName: string;
  partnerModel: PartnerModel;
  period: string;
  grossAmount: number;
  partnerShare: number;
  jobsonIdShare: number;
  deductions: number;
  netPayable: number;
  status: "draft" | "approved" | "paid" | "disputed";
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  lineItems: { description: string; amount: number; partnerShare: number }[];
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  partnerId: string;
  type: "credit" | "debit" | "settlement" | "fee" | "refund" | "bonus";
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  timestamp: string;
}

export interface TrainingCentre {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  classrooms: number;
  labs: number;
  facultyCount: number;
  studentsEnrolled: number;
  batchesActive: number;
  rating: number;
  status: "active" | "setup" | "suspended" | "inspected";
  lastInspection?: string;
  complianceScore: number;
}

export interface Batch {
  id: string;
  centreId: string;
  centreName: string;
  programName: string;
  code: string;
  trainer: string;
  startDate: string;
  endDate: string;
  schedule: string;
  enrolled: number;
  capacity: number;
  attendanceRate: number;
  progress: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  modality: "online" | "offline" | "hybrid";
}

export interface College {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  code: string;
  institutionType: "COLLEGE" | "UNIVERSITY" | "INSTITUTE" | "POLYTECHNIC";
  affiliation: "AFFILIATED" | "AUTONOMOUS" | "DEEMED" | "STATE_PRIVATE";
  fundingType: "GOVERNMENT" | "PRIVATE" | "SEMI_GOVERNMENT";
  establishedYear: number;
  city: string;
  state: string;
  totalStudents: number;
  totalFaculty: number;
  hasPlacementCell: boolean;
  hasTrainingCell: boolean;
  accreditation: string;
  partnershipModel: "A" | "B" | "C" | "D" | "E";
  mouStatus: "draft" | "sent" | "signed" | "expired" | "renewed";
  mouSignedAt?: string;
  mouExpiresAt?: string;
  programsMapped: number;
  studentsEnrolled: number;
  placements: number;
  placementRate: number;
  status: "onboarding" | "active" | "suspended" | "terminated";
}

export interface CollegePartnershipModel {
  id: "A" | "B" | "C" | "D" | "E";
  name: string;
  description: string;
  jobsonIdScope: string[];
  collegeScope: string[];
  revenueModel: string;
  idealFor: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  deliveryModel: "project" | "retainer" | "amc" | "milestone";
  standardPrice: number;
  slaLevel: "basic" | "standard" | "premium";
  duration: string;
  active: boolean;
}

export interface Engagement {
  id: string;
  partnerId: string;
  partnerName: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  type: "project" | "retainer" | "amc" | "milestone";
  value: number;
  startDate: string;
  endDate?: string;
  status: "lead" | "proposal" | "negotiation" | "active" | "completed" | "paused" | "cancelled";
  slaCompliance: number;
  progress: number;
  deliveryLead: string;
}

export interface JobOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  title: string;
  role: string;
  positions: number;
  filled: number;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  location: string;
  remote: boolean;
  skillsRequired: string[];
  certificationsRequired: string[];
  type: "permanent" | "contract" | "contract-to-hire" | "rpo";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "on_hold" | "fulfilled" | "cancelled" | "partial";
  feeType: "percentage" | "fixed" | "retainer";
  feeValue: number;
  createdAt: string;
  deadline: string;
  assignedRecruiter: string;
  submissions: number;
  interviews: number;
  offers: number;
  placements: number;
}

export interface Onboarding {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  startDate: string;
  status: "pending" | "documents" | "background_check" | "orientation" | "completed" | "failed";
  documentsTotal: number;
  documentsUploaded: number;
  backgroundCheckStatus: "pending" | "in_progress" | "cleared" | "flagged";
  orientationDate?: string;
  hrContact: string;
}

export interface Timesheet {
  id: string;
  candidateName: string;
  clientName: string;
  weekStart: string;
  weekEnd: string;
  hours: number;
  billableHours: number;
  status: "draft" | "submitted" | "approved" | "rejected" | "invoiced";
  approvedBy?: string;
  amount: number;
}

export interface Hotlist {
  id: string;
  name: string;
  description: string;
  candidateCount: number;
  createdBy: string;
  createdAt: string;
  tags: string[];
  shared: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "candidate" | "client" | "internal" | "offer" | "rejection" | "interview";
  subject: string;
  body: string;
  variables: string[];
  lastUsed?: string;
  usageCount: number;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  durationWeeks: number;
  defaultPrice: number;
  currency: string;
  jobsonIdPct: number;
  partnerPct: number;
  deliveryModes: string[];
  certifications: string[];
  targetRoles: string[];
  active: boolean;
}
