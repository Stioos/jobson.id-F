// ============================================================
// jobson.id — Core Domain Types
// Centralized typed interfaces for the entire platform.
// These mirror future backend entities (Django/FastAPI/REST).
// ============================================================

export type ID = string;

export type Portal =
  | "public"
  | "candidate"
  | "employer"
  | "recruiter"
  | "agency"
  | "enterprise"
  | "admin"
  | "training"
  | "learner"
  | "partner";

export type UserRole =
  | "candidate"
  | "employer"
  | "recruiter"
  | "agency"
  | "enterprise_admin"
  | "hiring_manager"
  | "interviewer"
  | "billing_manager"
  | "org_admin"
  | "platform_admin"
  | "support";

export type WorkArrangement = "remote" | "hybrid" | "onsite";
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "temporary"
  | "freelance";

export type JobStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "paused"
  | "closed"
  | "archived";

export type Currency = "INR" | "USD" | "EUR" | "GBP";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  verified: boolean;
  mfaEnabled: boolean;
}

export interface Skill {
  id: ID;
  name: string;
  category: string;
}

export interface CandidateSkill {
  skill: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
  verified: boolean;
}

export interface WorkExperience {
  id: ID;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  description: string;
}

export interface Education {
  id: ID;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
}

export interface CandidateProfile {
  id: ID;
  userId: ID;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  headline: string;
  summary: string;
  location: string;
  experienceYears: number;
  currentJobTitle: string;
  currentCompany?: string;
  expectedSalary?: number;
  expectedCurrency: Currency;
  noticePeriodDays?: number;
  workArrangementPreference: WorkArrangement[];
  skills: CandidateSkill[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  languages: { language: string; proficiency: string }[];
  achievements: string[];
  projects: { title: string; description: string; link?: string }[];
  links: { github?: string; linkedin?: string; portfolio?: string; website?: string };
  profileCompleteness: number;
  visibility: "public" | "employers_only" | "private";
  openToWork: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerOrganization {
  id: ID;
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  about: string;
  mission: string;
  benefits: string[];
  culture: string[];
  rating: number;
  reviewCount: number;
  followerCount: number;
  verified: boolean;
  featured: boolean;
  plan: PlanTier;
  locations: string[];
  socialLinks?: { linkedin?: string; twitter?: string };
  createdAt: string;
}

export interface Agency {
  id: ID;
  name: string;
  slug: string;
  logo: string;
  description: string;
  specialties: string[];
  verified: boolean;
  rating: number;
  recruiterCount: number;
  clientCount: number;
  placementCount: number;
  commissionRateDefault: number;
  createdAt: string;
}

export interface ScreeningQuestion {
  id: ID;
  question: string;
  type: "boolean" | "text" | "number" | "choice";
  required: boolean;
  knockout?: boolean;
  options?: string[];
}

export interface Job {
  id: ID;
  employerId: ID;
  employerName: string;
  employerLogo: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workArrangement: WorkArrangement;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  showSalary: boolean;
  experienceMin: number;
  experienceMax: number;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  screeningQuestions: ScreeningQuestion[];
  status: JobStatus;
  featured: boolean;
  urgent: boolean;
  sponsored: boolean;
  postedAt: string;
  expiresAt?: string;
  applicationCount: number;
  viewCount: number;
  requisitionId?: string;
  hiringManager?: string;
  recruiter?: string;
  budget?: number;
  targetHireDate?: string;
  category: string;
  industry: string;
}

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "assessment"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export interface ApplicationTimelineEvent {
  id: ID;
  status: ApplicationStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface JobApplication {
  id: ID;
  jobId: ID;
  jobTitle: string;
  employerName: string;
  employerLogo: string;
  candidateId: ID;
  candidateName: string;
  candidateAvatar?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  answers: { question: string; answer: string }[];
  resumeId?: ID;
  stage: number;
  timeline: ApplicationTimelineEvent[];
  rating?: number;
  tags: string[];
  notes: { author: string; text: string; timestamp: string }[];
}

export interface RecruitmentStage {
  id: ID;
  name: string;
  order: number;
  type: "default" | "screening" | "assessment" | "interview" | "offer" | "hire" | "reject";
}

export interface Interview {
  id: ID;
  applicationId: ID;
  jobId: ID;
  jobTitle: string;
  candidateName: string;
  employerName: string;
  round: string;
  type: "phone" | "video" | "onsite" | "technical" | "hr" | "panel";
  scheduledAt: string;
  durationMinutes: number;
  timezone: string;
  interviewerIds: string[];
  interviewers: string[];
  meetingLink?: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "no_show";
  feedbackSubmitted: boolean;
  scorecard?: {
    criteria: { name: string; rating: number; note: string }[];
    overallRating: number;
    recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
    summary: string;
  };
}

export interface Assessment {
  id: ID;
  name: string;
  type: "technical" | "aptitude" | "communication" | "role_specific" | "psychometric";
  durationMinutes: number;
  questionsCount: number;
  description: string;
  skillsAssessed: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface AssessmentResult {
  id: ID;
  assessmentId: ID;
  assessmentName: string;
  candidateId: ID;
  candidateName: string;
  jobId?: ID;
  score: number;
  maxScore: number;
  status: "pending" | "in_progress" | "completed" | "expired";
  startedAt?: string;
  completedAt?: string;
  deadline: string;
}

export interface JobOffer {
  id: ID;
  applicationId: ID;
  jobId: ID;
  jobTitle: string;
  candidateName: string;
  employerName: string;
  salary: number;
  currency: Currency;
  joiningBonus?: number;
  stockOptions?: string;
  benefits: string[];
  startDate: string;
  status: "draft" | "pending_approval" | "sent" | "accepted" | "declined" | "expired" | "withdrawn";
  createdAt: string;
  expiresAt: string;
  approvedBy?: string;
}

export interface TalentPool {
  id: ID;
  name: string;
  description: string;
  candidateCount: number;
  owner: string;
  tags: string[];
  createdAt: string;
}

export interface Message {
  id: ID;
  threadId: ID;
  senderId: ID;
  senderName: string;
  senderAvatar?: string;
  recipientName: string;
  subject: string;
  preview: string;
  body: string;
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "archived" | "draft";
  attachments: { name: string; size: string }[];
  timestamp: string;
}

export interface Notification {
  id: ID;
  type: "application" | "interview" | "message" | "offer" | "system" | "billing" | "job_alert";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export type PlanTier = "free" | "starter" | "professional" | "business" | "enterprise";

export interface Plan {
  id: ID;
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: Currency;
  description: string;
  features: string[];
  limits: {
    jobPosts: number;
    resumeViews: number;
    teamMembers: number;
  };
  popular: boolean;
  target: "employer" | "agency" | "candidate" | "enterprise";
}

export interface Subscription {
  id: ID;
  organizationId: ID;
  organizationName: string;
  planId: ID;
  planName: string;
  tier: PlanTier;
  status: "active" | "trialing" | "past_due" | "cancelled" | "expired";
  billingCycle: "monthly" | "annual";
  startDate: string;
  renewalDate: string;
  amount: number;
  currency: Currency;
  seats: number;
}

export interface Invoice {
  id: ID;
  number: string;
  organizationId: ID;
  organizationName: string;
  amount: number;
  currency: Currency;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "draft" | "refunded";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  gstin?: string;
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  invoiceNumber: string;
  organizationName: string;
  amount: number;
  currency: Currency;
  method: "card" | "upi" | "bank_transfer" | "wallet" | "netbanking";
  status: "success" | "pending" | "failed" | "refunded";
  transactionId: string;
  timestamp: string;
}

export interface Promotion {
  id: ID;
  name: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "scheduled" | "expired" | "disabled";
}

export interface Referral {
  id: ID;
  referrerName: string;
  referrerEmail: string;
  refereeName: string;
  refereeEmail: string;
  status: "pending" | "signed_up" | "converted" | "rewarded" | "expired";
  reward: number;
  currency: Currency;
  createdAt: string;
}

export interface TrainingCourse {
  id: ID;
  title: string;
  provider: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  durationHours: number;
  rating: number;
  enrolledCount: number;
  price: number;
  currency: Currency;
  skills: string[];
  description: string;
  certified: boolean;
}

export interface Certification {
  id: ID;
  name: string;
  issuer: string;
  category: string;
  validityMonths?: number;
  skillLevel: "associate" | "professional" | "expert";
}

export interface ProjectOpportunity {
  id: ID;
  title: string;
  client: string;
  budget: number;
  currency: Currency;
  duration: string;
  type: "freelance" | "contract" | "consultancy" | "commission";
  skills: string[];
  description: string;
  postedAt: string;
  proposalsCount: number;
  remote: boolean;
}

export interface SupportTicket {
  id: ID;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  requesterName: string;
  requesterEmail: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface AuditLog {
  id: ID;
  actor: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ip: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

export interface ConsentRecord {
  id: ID;
  userId: ID;
  type: "marketing" | "data_sharing" | "analytics" | "profile_indexing" | "communications";
  granted: boolean;
  timestamp: string;
  policy: string;
}

export interface IntegrationConfig {
  id: ID;
  name: string;
  category: "ats" | "hris" | "calendar" | "video" | "background_check" | "payroll" | "sso" | "communication";
  status: "connected" | "available" | "coming_soon";
  description: string;
  logo?: string;
  lastSync?: string;
}

export interface AuditFlaggedJob {
  jobId: ID;
  jobTitle: string;
  employerName: string;
  reason: string;
  flaggedAt: string;
  severity: "low" | "medium" | "high";
}

export interface KPIDefinition {
  key: string;
  label: string;
  formula: string;
  description: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  value2?: number;
}

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  badge?: string | number;
  /** Optional sub-items. When present, this item acts as a main category
   *  that expands/collapses to reveal children. Max 6 children per item. */
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataResponse<T> {
  data: T;
  message?: string;
}

// ============================================================
// CORPORATE TRAINING / LMS DOMAIN TYPES
// The training company serves corporates with courses, live training,
// certifications, skill development, and compliance programs.
// ============================================================

export type CourseStatus = "draft" | "in_review" | "approved" | "published" | "archived";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type LearnerProgressStatus = "not_started" | "in_progress" | "completed" | "overdue" | "certified";
export type LessonType = "video" | "reading" | "quiz" | "assignment" | "live" | "survey" | "project" | "scorm";

export interface TrainingCompany {
  id: ID;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  about: string;
  specialties: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  corporateClients: number;
  learnersTrained: number;
  coursesCount: number;
  trainersCount: number;
  founded: number;
  headquarters: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  gstin?: string;
  accreditation: string[];
}

export interface CorporateClient {
  id: ID;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contractStart: string;
  contractEnd: string;
  contractValue: number;
  currency: Currency;
  employeesEnrolled: number;
  coursesAssigned: number;
  status: "active" | "trial" | "pending" | "expired" | "churned";
  healthScore: number;
  renewalDate: string;
  assignedAccountManager: string;
}

export interface CourseModule {
  id: ID;
  title: string;
  lessons: CourseLesson[];
  order: number;
}

export interface CourseLesson {
  id: ID;
  title: string;
  type: LessonType;
  durationMinutes: number;
  completed?: boolean;
  description?: string;
}

export interface CourseMaterial {
  id: ID;
  type: "video" | "pdf" | "document" | "presentation" | "audio" | "scorm" | "link";
  title: string;
  durationMinutes?: number;
  url?: string;
}

export interface TrainingCourse {
  id: ID;
  code: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: Difficulty;
  durationMinutes: number;
  language: string;
  instructorId: ID;
  instructorName: string;
  skills: string[];
  objectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
  materials: CourseMaterial[];
  visibility: "public" | "private" | "restricted";
  status: CourseStatus;
  tags: string[];
  version: string;
  enrollments: number;
  completionRate: number;
  avgScore: number;
  rating: number;
  ratingCount: number;
  hasCertificate: boolean;
  price: number;
  currency: Currency;
  isMandatory?: boolean;
  isCompliance?: boolean;
  thumbnailColor: string;
  thumbnailIcon: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPath {
  id: ID;
  name: string;
  description: string;
  category: string;
  courses: { courseId: ID; courseName: string; isMandatory: boolean; order: number }[];
  totalDurationMinutes: number;
  enrolledCount: number;
  completionRate: number;
  isMandatory: boolean;
  skills: string[];
  certificateId?: ID;
  deadline?: string;
  type: "onboarding" | "compliance" | "career" | "skill" | "certification" | "program";
  thumbnailColor: string;
  thumbnailIcon: string;
}

export interface Cohort {
  id: ID;
  name: string;
  courseId?: ID;
  courseName?: string;
  trainerId: ID;
  trainerName: string;
  clientId?: ID;
  clientName?: string;
  learnerCount: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  attendanceRate: number;
  schedule: string;
  modality: "online" | "offline" | "hybrid";
  location?: string;
}

export interface LiveSession {
  id: ID;
  title: string;
  courseId?: ID;
  cohortId?: ID;
  trainerId: ID;
  trainerName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  platform: "zoom" | "teams" | "meet" | "webex" | "offline";
  meetingLink?: string;
  capacity: number;
  registered: number;
  attended?: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  recordingUrl?: string;
  modality: "online" | "offline" | "hybrid";
  location?: string;
}

export interface Trainer {
  id: ID;
  name: string;
  email: string;
  avatarColor: string;
  expertise: string[];
  rating: number;
  sessionsConducted: number;
  learnersTrained: number;
  type: "internal" | "external";
  clientId?: ID;
  status: "active" | "on_leave" | "inactive";
  bio: string;
  certifications: string[];
  hourlyRate?: number;
  currency?: Currency;
}

export interface TrainingAssessment {
  id: ID;
  title: string;
  courseId?: ID;
  category: string;
  questionCount: number;
  totalMarks: number;
  passingScore: number;
  timeLimitMinutes: number;
  difficulty: Difficulty;
  attempts: number;
  avgScore: number;
  status: "draft" | "published";
  randomize: boolean;
}

export interface Question {
  id: ID;
  type: "mcq" | "msq" | "truefalse" | "short" | "long" | "matching" | "ordering" | "scenario" | "coding" | "case";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  category: string;
  difficulty: Difficulty;
  explanation?: string;
}

export interface AssessmentAttempt {
  id: ID;
  learnerId: ID;
  learnerName: string;
  assessmentId: ID;
  assessmentTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeTakenMinutes: number;
}

export interface Certificate {
  id: ID;
  certificateId: string;
  learnerId: ID;
  learnerName: string;
  courseId?: ID;
  courseName: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: "active" | "expiring" | "expired" | "revoked";
  template: string;
  verifyUrl: string;
}

export interface CertificateTemplate {
  id: ID;
  name: string;
  design: string;
  fields: string[];
  status: "active" | "draft";
}

export interface SkillFramework {
  id: ID;
  name: string;
  category: string;
  description: string;
  levels: { level: number; label: string; description: string }[];
  employeesWithSkill: number;
  demand: "low" | "medium" | "high" | "critical";
  trend: number;
}

export interface SkillGap {
  skillId: ID;
  skillName: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  employeesAffected: number;
  recommendedCourses: string[];
}

export interface LearnerEnrollment {
  id: ID;
  learnerId: ID;
  learnerName: string;
  courseId: ID;
  courseName: string;
  progress: number;
  status: LearnerProgressStatus;
  enrolledDate: string;
  dueDate?: string;
  completedDate?: string;
  timeSpentMinutes: number;
  score?: number;
  assignedBy?: string;
  clientId?: ID;
  clientName?: string;
}

export interface TrainingProgram {
  id: ID;
  name: string;
  description: string;
  clientId?: ID;
  clientName?: string;
  type: "onboarding" | "compliance" | "upskilling" | "leadership" | "certification";
  targetLearners: number;
  enrolled: number;
  completed: number;
  startDate: string;
  endDate: string;
  status: "draft" | "scheduled" | "active" | "completed" | "paused";
  budget?: number;
  currency?: Currency;
}

export interface ComplianceTrack {
  id: ID;
  name: string;
  regulation: string;
  clientId?: ID;
  clientName?: string;
  mandatoryCourseId: ID;
  mandatoryCourseName: string;
  totalEmployees: number;
  compliant: number;
  atRisk: number;
  overdue: number;
  dueDate: string;
  status: "on_track" | "at_risk" | "overdue" | "completed";
}

export interface Survey {
  id: ID;
  title: string;
  description: string;
  type: "course_feedback" | "trainer_feedback" | "nps" | "training_needs" | "satisfaction";
  questions: number;
  responses: number;
  responseRate: number;
  status: "draft" | "active" | "closed";
  createdAt: string;
}

export interface GamificationConfig {
  pointsPerCourse: number;
  pointsPerAssessment: number;
  pointsPerLiveSession: number;
  badgeThresholds: { name: string; points: number; icon: string }[];
  leaderboardEnabled: boolean;
}

export interface LearnerAchievement {
  id: ID;
  learnerId: ID;
  learnerName: string;
  type: "badge" | "certificate" | "milestone" | "streak";
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

export interface TrainingBudget {
  id: ID;
  clientId?: ID;
  clientName: string;
  department?: string;
  allocated: number;
  used: number;
  remaining: number;
  utilization: number;
  costPerLearner: number;
  fy: string;
  currency: Currency;
}

export interface TrainingInvoice {
  id: ID;
  number: string;
  clientId: ID;
  clientName: string;
  amount: number;
  tax: number;
  total: number;
  currency: Currency;
  status: "paid" | "pending" | "overdue" | "draft" | "refunded";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  gstin?: string;
}

export interface ContentLibraryItem {
  id: ID;
  title: string;
  type: "video" | "pdf" | "document" | "presentation" | "audio" | "scorm" | "image" | "template";
  category: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  usageCount: number;
}

export interface WorkflowAutomation {
  id: ID;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: "active" | "paused" | "draft";
  runs: number;
  lastRun?: string;
}

export interface TrainingAnalytics {
  coursePerformance: { courseName: string; enrollment: number; completion: number; avgScore: number; rating: number }[];
  trainerPerformance: { trainerName: string; sessions: number; learners: number; rating: number; avgScore: number }[];
  engagementTrend: { label: string; activeLearners: number; hoursLearned: number }[];
  dropoffPoints: { stage: string; learners: number; dropoffRate: number }[];
}
