// ============================================================
// TALENT SOLUTIONS DOMAIN TYPES
// Train-to-Hire, Hire-to-Train, Corporate Training + transactions
// ============================================================

export type TalentSolutionType = "TRAIN_TO_HIRE" | "HIRE_TO_TRAIN" | "CORPORATE_TRAINING";

export interface TalentSolutionProgram {
  id: string;
  type: TalentSolutionType;
  name: string;
  clientName: string;
  clientLogo: string;
  status: "draft" | "active" | "in_progress" | "completed" | "on_hold" | "cancelled";
  description: string;
  targetCandidates: number;
  enrolled: number;
  trained: number;
  placed: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  currency: string;
  programCurriculum: string[];
  certifications: string[];
  trainer: string;
  accountManager: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  // Train-to-Hire specific
  hiringRoles?: string[];
  guaranteedPlacements?: number;
  // Hire-to-Train specific
  hiredCandidates?: number;
  trainingDurationWeeks?: number;
  // Corporate Training specific
  departments?: string[];
  employeeCount?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  roleLabel: string;
  avatarColor: string;
  initials: string;
  status: "active" | "suspended" | "invited" | "inactive";
  lastActive: string;
  createdAt: string;
  createdBy: string;
  permissions: string[];
  assignedPortals: string[];
  mfaEnabled: boolean;
  ipRestriction?: string;
  reports: string[]; // user IDs this admin manages
  reportsTo?: string; // user ID this admin reports to
}

export type AdminRole = "super_admin" | "admin" | "manager" | "analyst" | "support" | "billing_admin" | "content_admin" | "partner_admin";

export interface AdminRoleConfig {
  id: AdminRole;
  name: string;
  description: string;
  level: number; // 1 = highest (super_admin), 5 = lowest
  permissions: string[];
  canCreateUsers: boolean;
  canManageRoles: boolean;
  canAccessBilling: boolean;
  canModerateContent: boolean;
  canManagePartners: boolean;
  defaultAssignedPortals: string[];
}

export interface TalentTransaction {
  id: string;
  transactionNumber: string;
  type: "program_payment" | "trainer_fee" | "placement_fee" | "certification_fee" | "refund" | "commission" | "settlement" | "bonus" | "penalty";
  solutionType: TalentSolutionType;
  programId?: string;
  programName?: string;
  payer: string; // client/partner/platform
  payee: string; // trainer/partner/platform/candidate
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded" | "disputed";
  paymentMethod: "bank_transfer" | "upi" | "card" | "wallet" | "cheque";
  gatewayReference?: string;
  invoiceNumber?: string;
  description: string;
  createdAt: string;
  processedAt?: string;
  metadata?: {
    taxAmount?: number;
    platformFee?: number;
    partnerShare?: number;
  };
}

export interface TransactionWorkflow {
  id: string;
  transactionId: string;
  step: number;
  stepName: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  approver?: string;
  approverRole?: string;
  actedAt?: string;
  note?: string;
}

export interface CommunicationLog {
  id: string;
  transactionId?: string;
  programId?: string;
  type: "email" | "sms" | "in_app" | "system" | "notification";
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  subject: string;
  message: string;
  read: boolean;
  timestamp: string;
  attachments?: { name: string; size: string }[];
}
