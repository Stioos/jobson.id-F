# Super Admin Portal — Comprehensive Gap Analysis

**Task ID:** SUPERADMIN-GAP-ANALYSIS
**Agent:** Explore (research-only)
**Source:** `src/components/layout/portal-config.ts` (956 lines) + `src/portals/admin/index.tsx` (62 confirmed `sa-*` routes)
**Date:** Current session

---

## Context

The Super Admin portal currently has **13 sidebar groups / 62 leaf routes** (lines 663–802 of `portal-config.ts`). It was built in `SUPERADMIN-FOUNDATION` to provide platform-wide governance. The other 5 active portals — **candidate** (10 groups), **employer** (10 groups), **recruiter** (13 groups), **training** (12 groups), **partner** (11 groups) — collectively expose hundreds of operational features. This report cross-references every user-portal feature against the Super Admin config to identify oversight/control **gaps**.

### Existing Super Admin Coverage (for reference)

| Group | Routes |
|---|---|
| Governance | sa-overview, sa-tenants, sa-portal-settings, sa-feature-flags, sa-maintenance, sa-health |
| Users & Orgs | sa-users-all, sa-users-candidates, sa-users-employers, sa-users-recruiters, sa-users-training, sa-users-partners, sa-roles-hierarchy, sa-impersonation |
| Analytics | sa-analytics, sa-growth, sa-funnels, sa-revenue-analytics, sa-cohorts |
| Finance | sa-txn-all, sa-revenue, sa-invoices, sa-payouts, sa-refunds, sa-tax, sa-plans-pricing |
| Content | sa-job-taxonomy, sa-skill-taxonomy, sa-courses, sa-cms, sa-templates, sa-job-moderation |
| Security | sa-audit, sa-access-control, sa-privacy, sa-security-alerts, sa-api-keys, sa-sessions |
| Partners | sa-partner-applications, sa-partner-directory, sa-partner-performance, sa-revenue-splits, sa-mou |
| Comms | sa-announcements, sa-email-campaigns, sa-push, sa-sms, sa-whatsapp |
| Ops | sa-tickets, sa-sla, sa-incidents, sa-kb, sa-status-page |
| System | sa-integrations, sa-api, sa-webhooks, sa-ai-config, sa-backups, sa-system-config |
| Settings | sa-settings-hub, sa-security-center, sa-notification-preferences |

---

## 1. HIRING & JOBS OVERSIGHT

### User-portal features in scope
- **Candidate:** find-jobs, recommended, saved-jobs, applications, application-pipeline, interviews, interview-reschedule, video-call, offers, offer-negotiation, onboarding-checklist, compare-jobs, compare-offers, company-research
- **Employer:** jobs, create-job, requisitions, applicants, pipeline, interviews, interview-kits, debriefs, hiring-manager-portal, offers, hires, background-verification, onboarding, probation, performance-review, leave-management, exit-management, referral-program, campaigns
- **Recruiter:** job-orders, openings, pipeline, submissions, submission-tracker, interview-pipeline, scheduling, offers, offer-esign, assessments, feedback, placements, placement-verification, guarantees, onboarding, candidate-compliance

### Current SA coverage
- `sa-job-moderation` (Content) — moderation queue only
- `sa-job-taxonomy` (Content) — taxonomy editor only

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 1.1 | Cross-employer Job Directory | employer (jobs), recruiter (job-orders) | Single registry of all jobs posted across platform — status, employer, recruiter, flags, take-down. Today SA only sees flagged jobs. | `sa-jobs-all` | Hiring Oversight (NEW) | **HIGH** |
| 1.2 | Aggregate Hiring Pipeline | employer (pipeline), recruiter (pipeline, interview-pipeline), candidate (application-pipeline) | Platform-wide funnel (applications → screening → interview → offer → hire) with per-org drill-down. | `sa-hiring-pipeline` | Hiring Oversight | **HIGH** |
| 1.3 | Interview Oversight | candidate (interviews, interview-reschedule, video-call), employer (interviews, interview-kits, debriefs), recruiter (interview-pipeline, scheduling) | All scheduled interviews, video-call recording access, reschedule dispute resolution, kit template library, bias detection in debriefs. | `sa-interviews-oversight` | Hiring Oversight | **HIGH** |
| 1.4 | Offers Registry & E-Sign | candidate (offers, offer-negotiation), employer (offers), recruiter (offers, offer-esign) | All offers made platform-wide, e-signed doc vault, negotiation dispute resolution, offer-letter template governance. | `sa-offers-registry` | Hiring Oversight | **HIGH** |
| 1.5 | Placements Registry | recruiter (placements, placement-verification, guarantees), partner (placements) | Single source of truth for every placement (revenue recognition event), guarantee period tracking, replacement trigger. | `sa-placements-registry` | Hiring Oversight | **HIGH** |
| 1.6 | Background Verification Oversight | employer (background-verification), recruiter (candidate-compliance) | BGV vendor management, verification status dashboard, fraud alerts, SLA monitoring per vendor. | `sa-bgv-oversight` | Hiring Oversight | **HIGH** |
| 1.7 | Requisition Oversight | employer (requisitions), recruiter (requisitions) | Cross-org requisition approval workflow, budget checks, requisition fraud (duplicate/fake reqs). | `sa-requisitions-oversight` | Hiring Oversight | MEDIUM |
| 1.8 | Onboarding Tracker Oversight | candidate (onboarding-checklist), employer (onboarding), recruiter (onboarding) | Platform onboarding success metrics, checklist template library, drop-off analytics. | `sa-onboarding-oversight` | Hiring Oversight | MEDIUM |
| 1.9 | Referral Fraud Detection | employer (referral-program), recruiter (referrals), candidate (referrals) | Cross-portal referral graph, duplicate/fraud detection, payout hold queue. | `sa-referral-fraud` | Hiring Oversight | MEDIUM |
| 1.10 | Submission Tracker | recruiter (submissions, submission-tracker) | Aggregate submission metrics, recruiter productivity benchmarking. | `sa-submissions-oversight` | Hiring Oversight | LOW |
| 1.11 | Hiring Manager Portal Oversight | employer (hiring-manager-portal) | HM access/permission audit, activity log. | `sa-hiring-managers` | Hiring Oversight | LOW |
| 1.12 | Interview Kit Template Library | employer (interview-kits) | Platform-standard kit templates, bias-reviewed question bank per role. | `sa-interview-kits-library` | Content | LOW |
| 1.13 | Employee Lifecycle Oversight | employer (probation, performance-review, leave-management, exit-management) | Post-hire lifecycle metrics (probation conversion, exit reasons, leave abuse). | `sa-employee-lifecycle` | Hiring Oversight | LOW |

---

## 2. TALENT & SOURCING OVERSIGHT

### User-portal features in scope
- **Employer:** talent-search, talent-pool, shortlists, compare-candidates
- **Recruiter:** candidates, ai-match-scoring, talent-pool, hotlists, dedup-center, boolean-search, resume-parser, network-sourcing, referrals, sourcing-campaigns, partner-candidates, partner-network, talent-forecast

### Current SA coverage
- `sa-skill-taxonomy` (Content) — skill graph only

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 2.1 | Platform Talent Directory | employer (talent-pool), recruiter (candidates, talent-pool), partner (students) | Single registry of every candidate profile on the platform — the platform's biggest data asset. Search, ownership graph, PII controls. | `sa-talent-directory` | Talent Oversight (NEW) | **HIGH** |
| 2.2 | Platform Dedup Center | recruiter (dedup-center) | Cross-recruiter/employer dedup policy. Same candidate exists in many pools — merge authority, conflict resolution. | `sa-talent-dedup` | Talent Oversight | **HIGH** |
| 2.3 | AI Match Scoring Audit | recruiter (ai-match-scoring, network-sourcing) | Fairness/bias audit, scoring explainability log, model drift detection. Distinct from generic `sa-ai-config`. | `sa-ai-match-audit` | Talent Oversight | **HIGH** |
| 2.4 | Resume Parser Oversight | recruiter (resume-parser) | Parser accuracy metrics, PII extraction policy, vendor SLA, parser error queue. | `sa-resume-parser-oversight` | Talent Oversight | MEDIUM |
| 2.5 | Boolean Search Audit | recruiter (boolean-search) | Audit of search queries (PII exposure, discriminatory filters like age/gender/caste). | `sa-search-audit` | Talent Oversight | MEDIUM |
| 2.6 | Talent Forecast (Platform) | recruiter (talent-forecast) | Platform-wide supply/demand forecasting by skill/geo/role. | `sa-talent-forecast-platform` | Analytics | MEDIUM |
| 2.7 | Network Sourcing Oversight | recruiter (network-sourcing, partner-network) | Audit of external network API calls (LinkedIn etc.), rate limits, PII handling. | `sa-network-sourcing-oversight` | Talent Oversight | LOW |
| 2.8 | Sourcing Campaigns Oversight | recruiter (sourcing-campaigns), employer (campaigns) | Aggregate campaign performance, ROI benchmark, fraud detection. | `sa-sourcing-campaigns-oversight` | Talent Oversight | LOW |
| 2.9 | Hotlists & Shortlists Oversight | recruiter (hotlists), employer (shortlists) | Aggregate view, retention policy, PII access audit. | `sa-hotlists-oversight` | Talent Oversight | LOW |
| 2.10 | Candidate Compare Audit | employer (compare-candidates), candidate (compare-jobs, compare-offers) | Bias detection in comparison logic. | `sa-compare-audit` | Talent Oversight | LOW |
| 2.11 | Profile Quality Benchmark | candidate (profile-optimizer, profile-analytics) | Aggregate profile completeness, optimizer adoption metrics. | `sa-profile-quality` | Analytics | LOW |

---

## 3. LEARNING & TRAINING OVERSIGHT

### User-portal features in scope
- **Candidate:** catalog, my-learning, certificates, career-paths, achievements, partner-courses, events-calendar, interview-prep, career-explorer, salary-calculator
- **Employer:** ld-dashboard, assign-learning, employee-learning, compliance-training, skill-gaps, training-roi
- **Training:** courses, curriculum-designer, cohorts, live-training, trainers, trainer-allocation, completion-tracker, assessments, question-bank, certifications, attendance, gradebook, enrollments, enrollment-approval, verify-credentials, verify-cert, scholarships, skills, skill-gaps, compliance, providers

### Current SA coverage
- `sa-courses` (Content) — catalog manager
- `sa-skill-taxonomy` (Content)

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 3.1 | Certification Registry | training (certifications), candidate (certificates), training (verify-cert) | Cross-provider certificate registry, public verification portal, revocation authority. | `sa-certifications-registry` | Learning Oversight (NEW) | **HIGH** |
| 3.2 | Credential Verification Central | training (verify-credentials, verify-cert) | Single verification portal for employers/3rd-parties to validate any cert/credential. | `sa-credentials-verification` | Learning Oversight | **HIGH** |
| 3.3 | Curriculum Oversight | training (curriculum-designer) | Curriculum approval workflow, standardization, version control, content review. | `sa-curriculum-oversight` | Learning Oversight | MEDIUM |
| 3.4 | Cohort Directory | training (cohorts), partner (batches) | Cross-provider cohort registry, capacity utilization, geo map. | `sa-cohorts-directory` | Learning Oversight | MEDIUM |
| 3.5 | Live Training Oversight | training (live-training) | Live session recording policy, retention, attendance fraud detection. | `sa-live-training-oversight` | Learning Oversight | MEDIUM |
| 3.6 | Trainer Registry | training (trainers, trainer-allocation) | Platform trainer certification, allocation conflict detection, performance benchmarking. | `sa-trainer-registry` | Learning Oversight | MEDIUM |
| 3.7 | Question Bank Oversight | training (question-bank) | Question quality scoring, leak prevention, rotation policy. | `sa-question-bank-oversight` | Learning Oversight | MEDIUM |
| 3.8 | Gradebook Audit | training (attendance, gradebook) | Proxy attendance fraud, grade tampering detection, audit trail. | `sa-gradebook-audit` | Learning Oversight | MEDIUM |
| 3.9 | Completion Verification | training (completion-tracker) | Platform completion verification, anti-fraud (fake completions), revenue tie-in. | `sa-completion-oversight` | Learning Oversight | MEDIUM |
| 3.10 | L&D Analytics Platform | employer (ld-dashboard, training-roi, skill-gaps) | Cross-employer L&D ROI benchmarking, skill gap aggregation. | `sa-ld-analytics` | Analytics | MEDIUM |
| 3.11 | Compliance Training Mandate | employer (compliance-training), training (compliance) | Platform compliance training mandates (e.g. POSH, InfoSec), enforcement, audit. | `sa-compliance-training-oversight` | Learning Oversight | MEDIUM |
| 3.12 | Partner Courses Oversight | candidate (partner-courses), training (providers) | Partner course quality control, content review, takedown. | `sa-partner-courses-oversight` | Learning Oversight | MEDIUM |
| 3.13 | Enrollment Oversight | training (enrollments, enrollment-approval) | Enrollment policy, dispute resolution, refund trigger. | `sa-enrollment-oversight` | Learning Oversight | LOW |
| 3.14 | Scholarship Oversight | training (scholarships) | Scholarship fund management, eligibility audit, disbursement log. | `sa-scholarships-oversight` | Finance | LOW |
| 3.15 | Career Path Standardization | candidate (career-paths, career-explorer) | Platform career path templates, role taxonomy alignment. | `sa-career-paths-oversight` | Content | LOW |
| 3.16 | Events & Webinars Oversight | candidate (events-calendar), partner (events-drives) | Platform event calendar, capacity, recording retention. | `sa-events-oversight` | Comms | LOW |
| 3.17 | Gamification Config | candidate (achievements) | Badge/achievement config, fraud prevention. | `sa-gamification-config` | Content | LOW |

---

## 4. FINANCE & BILLING OVERSIGHT

### User-portal features in scope
- **Candidate:** my-wallet, withdraw, my-transactions, invoices, my-subscription, payments, payment-methods, promo-codes, transaction-disputes
- **Employer:** emp-wallet, emp-transactions, emp-settlements, invoices, tax-documents, purchase-orders, cost-per-hire, credits, subscription, ent-budgets, ent-approvals, ent-audit
- **Recruiter:** wallet, multi-currency-wallet, payouts, settlements, commissions, invoices, gst-invoice-generator, billing-milestones, earnings-forecast, client-payment-aging, timesheets, candidate-compliance, ag-commissions
- **Training:** transaction-hub, transactions, billing-center, payment-gateway, settlement-engine, fee-collection, invoice-rules, refunds, transaction-comms, adm-platform-revenue, adm-partner-payouts, budgets, invoices
- **Partner:** wallet, settlements, split-simulator, settlement-disputes, transactions, accounts, tax-rates, commissions, tax-documents, fees, revenue-splits

### Current SA coverage
- `sa-txn-all`, `sa-revenue`, `sa-invoices`, `sa-payouts`, `sa-refunds`, `sa-tax`, `sa-plans-pricing`, `sa-revenue-analytics`

### Gaps (largest category — finance is high-risk surface)

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 4.1 | Fraud Detection Center | all wallets/transactions | Velocity rules, duplicate detection, AI anomaly scoring, manual review queue, holds. | `sa-fraud-detection` | Finance | **HIGH** |
| 4.2 | Wallet Freeze/Unfreeze | candidate, employer, recruiter, partner, training wallets | Freeze/unfreeze ANY user wallet, holds, release — critical for fraud response. | `sa-wallet-freeze` | Finance | **HIGH** |
| 4.3 | Transaction Reversal | none (missing everywhere) | Manual reversal workflow with double-entry audit, approver chain, reason codes. | `sa-transaction-reversal` | Finance | **HIGH** |
| 4.4 | Reconciliation Center | recruiter (client-payment-aging), partner (settlement-disputes) | Bank statement match, payment-gateway settlement match, exception queue. | `sa-reconciliation` | Finance | **HIGH** |
| 4.5 | Financial Audit Trail | employer (ent-audit), training (adm-audit-logs) | Immutable ledger, SOX-style controls, segregation-of-duties enforcement. | `sa-financial-audit` | Security | **HIGH** |
| 4.6 | Commission Oversight | recruiter (commissions, ag-commissions), partner (commissions, revenue-splits, split-simulator) | All commission rules in one registry, dispute queue, recalculation workflow. | `sa-commission-oversight` | Finance | **HIGH** |
| 4.7 | Settlement Dispute Resolution | partner (settlement-disputes), employer (emp-settlements), recruiter (settlements) | Centralized dispute queue across all portals, adjudication workflow, SLA. | `sa-settlement-disputes` | Finance | **HIGH** |
| 4.8 | GST/Tax Compliance Engine | recruiter (gst-invoice-generator), partner (tax-rates, tax-documents), training (fee-collection) | GST filing prep, e-invoice, e-way bill, TDS deduction, GSTN sync. Distinct from generic `sa-tax`. | `sa-gst-compliance` | Finance | **HIGH** |
| 4.9 | Multi-Currency Oversight | recruiter (multi-currency-wallet) | FX rate config, currency exposure dashboard, hedge tracking. | `sa-multi-currency` | Finance | MEDIUM |
| 4.10 | Billing Milestone Approvals | recruiter (billing-milestones) | Milestone approval queue, override authority, revenue recognition tie-in. | `sa-billing-milestones` | Finance | MEDIUM |
| 4.11 | Cost-per-Hire Benchmark | employer (cost-per-hire) | Platform-wide CPH benchmarking by role/geo/industry. | `sa-cost-per-hire-platform` | Analytics | MEDIUM |
| 4.12 | Credits & Tokens Economy | employer (credits), recruiter (tokens implied) | Credit/token minting authority, exchange rate, abuse detection. | `sa-credits-tokens` | Finance | MEDIUM |
| 4.13 | Subscription Dunning | candidate (my-subscription), employer (subscription) | Failed-payment retry rules, dunning sequence, churn-prevention analytics. | `sa-dunning` | Finance | MEDIUM |
| 4.14 | Promo Code Oversight | candidate (promo-codes) | Promo code management, abuse detection, budget cap. | `sa-promo-codes` | Finance | MEDIUM |
| 4.15 | Payment Gateway Routing | training (payment-gateway) | Multi-gateway routing config, failover, cost optimization. | `sa-payment-gateway-routing` | System | MEDIUM |
| 4.16 | Refund Policy Engine | training (refunds), candidate (transaction-disputes) | Auto-approve rules, hold rules, policy versioning (extends `sa-refunds`). | `sa-refund-policy` | Finance | MEDIUM |
| 4.17 | Revenue Forecast Platform | recruiter (earnings-forecast) | Platform revenue forecast (extends `sa-revenue-analytics`). | `sa-revenue-forecast` | Analytics | MEDIUM |
| 4.18 | Purchase Order Oversight | employer (purchase-orders) | PO approval workflow oversight, vendor master. | `sa-purchase-orders` | Finance | LOW |
| 4.19 | Timesheet Oversight | recruiter (timesheets) | Timesheet approval/fraud oversight, billing tie-in. | `sa-timesheets` | Finance | LOW |
| 4.20 | Invoice Rules Oversight | training (invoice-rules) | Template/rule audit, version control. | `sa-invoice-rules` | Finance | LOW |
| 4.21 | Split Config Audit | partner (split-simulator, revenue-splits) | Audit log of all split-config changes (extends `sa-revenue-splits`). | `sa-split-config-audit` | Finance | LOW |

---

## 5. PARTNERSHIP & ECOSYSTEM OVERSIGHT

### User-portal features in scope (partner portal is the richest — 60+ items)
- **Partner:** deals, leads, my-clients, students, marketing, applications, profile, college-profiles, college-applications, colleges, college-workspace, models, mou-agreements, partner-onboarding, renewals, renewal-forecast, programs, centres, batches, faculty, training-delivery, events-drives, internships, projects, job-orders, placements, compliance, certificates, wallet, settlements, split-simulator, settlement-disputes, transactions, accounts, tax-rates, commissions, tax-documents, fees, online-tools, forms-assistance, guidelines, service-catalog, engagements, marketing-materials, client-messaging

### Current SA coverage
- `sa-partner-applications`, `sa-partner-directory`, `sa-partner-performance`, `sa-revenue-splits`, `sa-mou`

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 5.1 | College Directory | partner (colleges, college-profiles, college-applications, college-workspace) | Master college directory, accreditation verification, MoU status, geo map. | `sa-colleges-directory` | Partners | **HIGH** |
| 5.2 | Student Registry | partner (students), training (enrollments) | Platform student directory, PII controls, cross-partner tracking. | `sa-students-directory` | Partners | **HIGH** |
| 5.3 | Partner Compliance Scorecard | partner (compliance), training (compliance) | Composite compliance score per partner, audit findings, action plan tracking. | `sa-partner-compliance` | Partners | **HIGH** |
| 5.4 | Renewal Forecast Platform | partner (renewals, renewal-forecast) | All partner renewals, churn risk scoring, auto-renewal rules. | `sa-renewal-forecast` | Partners | **HIGH** |
| 5.5 | Partnership Models Catalog | partner (models) | Standardized partnership model catalog, revenue-share templates. | `sa-partnership-models` | Partners | MEDIUM |
| 5.6 | Training Centres Oversight | partner (centres) | Centre verification, capacity planning, geo coverage, infra audit. | `sa-training-centres` | Partners | MEDIUM |
| 5.7 | Batches Registry | partner (batches), training (cohorts) | Cross-partner batch registry, capacity, completion rate. | `sa-batches-registry` | Partners | MEDIUM |
| 5.8 | Faculty Registry | partner (faculty) | Faculty registry, certification, cross-partner assignment conflict. | `sa-faculty-registry` | Partners | MEDIUM |
| 5.9 | Internships Oversight | partner (internships) | Internship registry, legal compliance (stipend, duration, PF), dispute resolution. | `sa-internships-oversight` | Partners | MEDIUM |
| 5.10 | Leads & Deals Oversight | partner (deals, leads, my-clients) | Cross-partner lead dedup, dispute resolution, attribution rules. | `sa-leads-oversight` | Partners | MEDIUM |
| 5.11 | Marketing Material Approval | partner (marketing-materials), employer (campaigns) | Brand compliance review queue, takedown authority. | `sa-marketing-approval` | Comms | MEDIUM |
| 5.12 | Partner Messaging Audit | partner (client-messaging) | Message audit for partners, template compliance. | `sa-partner-messaging-audit` | Comms | MEDIUM |
| 5.13 | Partner Onboarding SLA | partner (partner-onboarding) | Onboarding progress oversight, SLA monitoring, bottleneck detection. | `sa-partner-onboarding-sla` | Partners | MEDIUM |
| 5.14 | Partner Scorecard Platform | partner (partner-scorecard) | Unified partner scorecard (extends `sa-partner-performance`). | `sa-partner-scorecard-platform` | Partners | MEDIUM |
| 5.15 | Projects Oversight | partner (projects) | Project quality oversight, IP protection. | `sa-projects-oversight` | Partners | LOW |
| 5.16 | Events & Drives Oversight | partner (events-drives) | Event/drive calendar oversight, capacity, safety compliance. | `sa-events-drives-oversight` | Partners | LOW |
| 5.17 | Service Catalog Standardization | partner (service-catalog) | Platform service catalog standardization, pricing templates. | `sa-service-catalog` | Partners | LOW |
| 5.18 | Engagements Oversight | partner (engagements) | Engagement lifecycle oversight, renewal tie-in. | `sa-engagements-oversight` | Partners | LOW |
| 5.19 | Partner Tax Vault | partner (tax-documents, accounts) | Consolidated tax document vault, audit-ready. | `sa-partner-tax-vault` | Finance | LOW |
| 5.20 | Split Simulator Audit | partner (split-simulator) | Audit log of split simulations (extends `sa-revenue-splits`). | `sa-split-simulator-audit` | Finance | LOW |

---

## 6. COMMUNICATION OVERSIGHT

### User-portal features in scope
- **Candidate:** messages, group-chat, video-call, recruiter-reviews
- **Employer:** messages, whatsapp-sms, campaigns
- **Recruiter:** inbox, whatsapp, sequences, email-templates, rejection-automation, sms-inbox, auto-reminders, follow-up-automation, voip-logging, messages
- **Training:** announcements, student-messaging, discussion-forums, parent-portal, transaction-comms
- **Partner:** client-messaging, announcements, marketing

### Current SA coverage
- `sa-announcements`, `sa-email-campaigns`, `sa-push`, `sa-sms`, `sa-whatsapp`

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 6.1 | Cross-Platform Message Audit | all portals (messages) | Search ALL messages across portals, retention policy, legal hold, abuse detection. Critical for legal/DEI. | `sa-message-audit` | Comms | **HIGH** |
| 6.2 | Email Deliverability Center | employer (campaigns), recruiter (sequences, email-templates) | SPF/DKIM/DMARC config, bounce/spam monitoring, sender reputation, IP warmup. Distinct from `sa-email-campaigns`. | `sa-email-deliverability` | Comms | **HIGH** |
| 6.3 | SMS / DLT Compliance | recruiter (sms-inbox, auto-reminders), employer (whatsapp-sms), training (transaction-comms) | India DLT registration, TRAI compliance, template approval, opt-out registry, scrub list. Extends `sa-sms`. | `sa-sms-compliance` | Comms | **HIGH** |
| 6.4 | Sequence / Drip Campaign Registry | recruiter (sequences, follow-up-automation) | Cross-portal sequence registry, abuse detection (spam), opt-out enforcement. | `sa-sequence-oversight` | Comms | MEDIUM |
| 6.5 | WhatsApp Template Approval | recruiter (whatsapp), employer (whatsapp-sms) | WhatsApp template approval flow, Meta compliance, opt-in registry. | `sa-whatsapp-templates` | Comms | MEDIUM |
| 6.6 | VoIP Call Logging Oversight | recruiter (voip-logging), candidate (video-call) | VoIP vendor management, call recording retention, consent management. | `sa-voip-oversight` | Comms | MEDIUM |
| 6.7 | Rejection Automation Audit | recruiter (rejection-automation) | Audit of automated rejections — DEI/legal risk, bias detection. | `sa-rejection-audit` | Comms | MEDIUM |
| 6.8 | Video Call Oversight | candidate (video-call), employer (interviews) | Recording policy, retention, consent, access audit. | `sa-video-call-oversight` | Comms | MEDIUM |
| 6.9 | Review Moderation | candidate (recruiter-reviews) | Review moderation, dispute resolution, fake review detection. | `sa-review-moderation` | Comms | MEDIUM |
| 6.10 | Brand Compliance Review | partner (marketing-materials), employer (campaigns, marketing) | Brand compliance review queue, takedown authority (dup of 5.11 — pick one home). | `sa-brand-compliance` | Comms | MEDIUM |
| 6.11 | Comms Blacklist/Whitelist | none | Block spammy numbers/emails, abuse throttling. | `sa-comms-blacklist` | Comms | MEDIUM |
| 6.12 | Automation Template Approval | recruiter (auto-reminders, follow-up-automation, email-templates) | Template approval workflow, variable policy. | `sa-automation-templates` | Comms | LOW |
| 6.13 | Group Chat Moderation | candidate (group-chat) | Group chat moderation, abuse detection. | `sa-group-chat-moderation` | Comms | LOW |
| 6.14 | Forum Moderation | training (discussion-forums) | Forum moderation, abuse, spam. | `sa-forum-moderation` | Comms | LOW |
| 6.15 | Parent Portal Oversight | training (parent-portal) | Parent access oversight, consent. | `sa-parent-portal-oversight` | Comms | LOW |

---

## 7. PROCESS & LIFECYCLE OVERSIGHT

### User-portal features in scope
- **Candidate:** interview-reschedule, offer-negotiation, onboarding-checklist, reference-requests, transaction-disputes
- **Employer:** onboarding, probation, exit-management, performance-review, leave-management, ent-approvals, ent-audit
- **Recruiter:** submission-tracker, offer-esign, billing-milestones, rejection-automation, placement-verification, guarantees, candidate-compliance
- **Training:** enrollment-approval, trainer-allocation
- **Partner:** partner-onboarding, renewal-forecast, settlement-disputes, applications

### Current SA coverage
- `sa-impersonation`, `sa-tickets`, `sa-incidents` (operational, not lifecycle)

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 7.1 | Offer E-Sign Oversight | recruiter (offer-esign) | E-sign vendor management, audit trail, tamper detection, legal validity. | `sa-esign-oversight` | Process Oversight (NEW) | **HIGH** |
| 7.2 | Approval Workflow Engine | employer (ent-approvals), training (approvals, enrollment-approval) | Platform-wide approval workflow builder, delegation, escalation, audit. | `sa-approval-engine` | Process Oversight | MEDIUM |
| 7.3 | Reschedule Dispute Resolution | candidate (interview-reschedule) | Dispute queue, SLA, escalations. | `sa-reschedule-disputes` | Process Oversight | MEDIUM |
| 7.4 | Offer Negotiation Audit | candidate (offer-negotiation) | Negotiation audit — collusion detection, fairness analytics. | `sa-offer-negotiation-audit` | Process Oversight | MEDIUM |
| 7.5 | Onboarding Template Library | candidate (onboarding-checklist), employer (onboarding), recruiter (onboarding) | Platform onboarding checklist templates, success metrics. | `sa-onboarding-templates` | Process Oversight | MEDIUM |
| 7.6 | Reference Oversight | candidate (reference-requests) | Reference fraud detection, fake reference registry. | `sa-reference-oversight` | Process Oversight | MEDIUM |
| 7.7 | Guarantee Period Tracking | recruiter (guarantees) | Platform guarantee policy, refund/replacement trigger, expiry alerts. | `sa-guarantee-tracking` | Process Oversight | MEDIUM |
| 7.8 | Billing Milestone Approvals | recruiter (billing-milestones) | (dup of 4.10) Milestone approval queue. | `sa-billing-milestone-approvals` | Process Oversight | MEDIUM |
| 7.9 | Partner Onboarding SLA | partner (partner-onboarding) | (dup of 5.13) Onboarding SLA monitoring. | `sa-partner-onboarding-sla` | Process Oversight | MEDIUM |
| 7.10 | Renewal Forecast Platform | partner (renewal-forecast) | (dup of 5.4) Platform renewal churn prediction. | `sa-renewal-forecast-platform` | Process Oversight | MEDIUM |
| 7.11 | Enrollment Approval Oversight | training (enrollment-approval) | Enrollment policy oversight, dispute resolution. | `sa-enrollment-approvals` | Process Oversight | LOW |
| 7.12 | Trainer Allocation Oversight | training (trainer-allocation) | Allocation conflict detection, fairness. | `sa-trainer-allocation-oversight` | Process Oversight | LOW |
| 7.13 | Probation Oversight | employer (probation) | Probation policy oversight, conversion analytics. | `sa-probation-oversight` | Process Oversight | LOW |
| 7.14 | Exit Oversight | employer (exit-management) | Exit interview analytics, attrition patterns. | `sa-exit-oversight` | Process Oversight | LOW |
| 7.15 | Performance Review Oversight | employer (performance-review) | Review cycle oversight, calibration analytics. | `sa-performance-review-oversight` | Process Oversight | LOW |
| 7.16 | Leave Oversight | employer (leave-management) | Leave policy compliance, abuse detection. | `sa-leave-oversight` | Process Oversight | LOW |

---

## 8. ANALYTICS & REPORTING GAPS

### User-portal features in scope
- **Candidate:** profile-analytics
- **Employer:** analytics, cost-per-hire, branding-score
- **Recruiter:** analytics, activity, report-builder, talent-forecast, recruiting-ai, audit-logs
- **Training:** (analytics implied in transaction-hub), course-performance, trainer-performance, engagement-analytics, dropoff-analytics, reports
- **Partner:** analytics, partner-scorecard, reports, revenue, audit-logs

### Current SA coverage
- `sa-analytics`, `sa-growth`, `sa-funnels`, `sa-revenue-analytics`, `sa-cohorts`

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 8.1 | Report Builder Platform | recruiter (report-builder) | Cross-portal custom report builder, drag-and-drop, scheduled exports, distribution lists. | `sa-report-builder` | Analytics | **HIGH** |
| 8.2 | Scheduled Reports | none | Report scheduling, distribution lists, format (PDF/CSV/API). | `sa-scheduled-reports` | Analytics | **HIGH** |
| 8.3 | Recruiting AI Audit | recruiter (recruiting-ai) | AI fairness/bias audit, model explainability, drift detection. Distinct from generic `sa-ai-config`. | `sa-recruiting-ai-audit` | Analytics | **HIGH** |
| 8.4 | Course Performance Analytics | training (course-performance) | Cross-provider course benchmarking, drop-off, NPS. | `sa-course-performance` | Analytics | MEDIUM |
| 8.5 | Trainer Performance Analytics | training (trainer-performance) | Trainer benchmarking, learner feedback aggregation. | `sa-trainer-performance` | Analytics | MEDIUM |
| 8.6 | Engagement Analytics | training (engagement-analytics) | Platform engagement dashboard (DAU/MAU, session, feature adoption). | `sa-engagement-analytics` | Analytics | MEDIUM |
| 8.7 | Drop-off Analytics | training (dropoff-analytics) | Funnel drop-off analytics across all portals. | `sa-dropoff-analytics` | Analytics | MEDIUM |
| 8.8 | Real-time Dashboards | none | Live KPIs, streaming metrics, alerting. | `sa-realtime-dashboards` | Analytics | MEDIUM |
| 8.9 | Data Warehouse / BI Export | training (data-export) | Data warehouse export, BI tool connectors (Looker/Tableau/PowerBI). | `sa-data-warehouse` | System | MEDIUM |
| 8.10 | Activity Feed Platform | recruiter (activity) | Platform-wide activity feed, audit-ready. | `sa-activity-feed` | Analytics | MEDIUM |
| 8.11 | Cost-per-Hire Benchmark | employer (cost-per-hire) | (dup of 4.11) Platform CPH benchmark. | `sa-cph-benchmark` | Analytics | MEDIUM |
| 8.12 | Partner Scorecard Platform | partner (partner-scorecard) | (dup of 5.14) Unified scorecard. | `sa-scorecard-platform` | Analytics | MEDIUM |
| 8.13 | Revenue Forecast Platform | recruiter (earnings-forecast) | (dup of 4.17) Platform revenue forecast. | `sa-revenue-forecast-platform` | Analytics | MEDIUM |
| 8.14 | Branding Benchmark | employer (branding-score) | Employer brand benchmarking, market comparison. | `sa-branding-benchmark` | Analytics | LOW |
| 8.15 | Talent Forecast Platform | recruiter (talent-forecast) | (dup of 2.6) Platform supply/demand forecast. | `sa-talent-forecast-platform` | Analytics | MEDIUM |

---

## 9. SECURITY & COMPLIANCE GAPS

### User-portal features in scope
- **Candidate:** security-center, transaction-disputes
- **Employer:** security-center, ent-audit, background-verification
- **Recruiter:** audit-logs, candidate-compliance, security-center
- **Training:** security-center, compliance, verify-credentials, verify-cert, audit-logs, adm-audit-logs
- **Partner:** security-center, compliance, audit-logs

### Current SA coverage
- `sa-audit`, `sa-access-control`, `sa-privacy`, `sa-security-alerts`, `sa-api-keys`, `sa-sessions`, `sa-security-center`

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 9.1 | Consent Management | none | GDPR/DPDP consent registry, withdrawal workflow, evidence vault, consent versioning. | `sa-consent-management` | Security | **HIGH** |
| 9.2 | Data Subject Request (DSAR) Workflow | none | DSAR intake, response SLA, evidence, audit. | `sa-dsar` | Security | **HIGH** |
| 9.3 | Right to be Forgotten | none | Account deletion workflow, data purge, evidence, verification. | `sa-rtbf` | Security | **HIGH** |
| 9.4 | DPDP / GDPR Compliance | none | India DPDP Act 2023 compliance, cross-border data transfer rules, breach notification. | `sa-dpdp-compliance` | Security | **HIGH** |
| 9.5 | Data Residency | none | Data location config, region pinning, cross-border transfer controls. | `sa-data-residency` | Security | **HIGH** |
| 9.6 | Encryption / KMS | none | KMS, key rotation, encryption-at-rest/transit audit, cert inventory. | `sa-encryption` | Security | **HIGH** |
| 9.7 | Secrets Management | none | Vault, secret rotation, access audit, leak detection. | `sa-secrets` | Security | **HIGH** |
| 9.8 | Data Export Audit | training (data-export) | Audit of who exported what, size limits, DLP, watermarking. | `sa-export-audit` | Security | **HIGH** |
| 9.9 | Credential Verification Central | training (verify-credentials, verify-cert) | (dup of 3.2) Centralized credential verification portal. | `sa-credential-verification` | Security | **HIGH** |
| 9.10 | BGV Vendor Oversight | employer (background-verification), recruiter (candidate-compliance) | (dup of 1.6) BGV vendor management, SLA, fraud alerts. | `sa-bgv-vendors` | Security | MEDIUM |
| 9.11 | Vulnerability Scanner | none | CVE monitoring, dependency scan, SCA, SAST/DAST results. | `sa-vulnerability-scanner` | Security | **HIGH** |
| 9.12 | Penetration Test Reports | none | Pentest history, vulnerability tracking, remediation. | `sa-pentest-reports` | Security | MEDIUM |
| 9.13 | SIEM Integration | none | Log shipping to SIEM (Splunk/ELK/Datadog), correlation rules. | `sa-siem` | Security | MEDIUM |
| 9.14 | UEBA (User Behavior Analytics) | none (sa-security-alerts is rule-based) | ML-based anomaly detection on user behavior. | `sa-ueba` | Security | MEDIUM |
| 9.15 | Threat Intelligence | none | Threat feed ingestion, IOC blocking, feed management. | `sa-threat-intel` | Security | MEDIUM |
| 9.16 | WAF & DDoS Protection | none | WAF rules, DDoS monitoring, mitigation. | `sa-waf-ddos` | Security | MEDIUM |
| 9.17 | Cookie Compliance | none | Cookie banner config, consent log, scanner. | `sa-cookie-compliance` | Security | MEDIUM |
| 9.18 | Compliance Reporting | training (compliance), partner (compliance) | SOC 2 / ISO 27001 / ISO 27701 cert tracker, evidence vault. | `sa-compliance-reporting` | Security | MEDIUM |
| 9.19 | Audit Log Retention Policy | training (audit-logs, adm-audit-logs), recruiter (audit-logs) | (extends `sa-audit`) Retention config, immutability, legal hold. | `sa-audit-retention` | Security | MEDIUM |
| 9.20 | SSO / OAuth Provider Config | none | SAML/OIDC IdP management, IdP federation, SCIM. | `sa-sso-config` | System | **HIGH** |
| 9.21 | IP Allowlist | none | Admin IP restriction, geo-fencing. | `sa-ip-allowlist` | Security | MEDIUM |
| 9.22 | Rate Limiting Policy | none | API rate-limit config, abuse throttling, per-tenant limits. | `sa-rate-limiting` | System | **HIGH** |

---

## 10. SYSTEM & INTEGRATION GAPS

### User-portal features in scope
- **Employer:** integrations, calendar-sync
- **Training:** integrations, payment-gateway, settlement-engine

### Current SA coverage
- `sa-integrations`, `sa-api`, `sa-webhooks`, `sa-ai-config`, `sa-backups`, `sa-system-config`

### Gaps

| # | Feature | Portal(s) | What SA version should do | Suggested route key | Suggested group | Priority |
|---|---|---|---|---|---|---|
| 10.1 | Cron Job Monitor | none | Cron status, failure alerts, history, retry, DLQ. | `sa-cron-monitor` | System | **HIGH** |
| 10.2 | Queue Monitor | none | Queue depth, DLQ, retry, consumer lag, backpressure. | `sa-queue-monitor` | System | **HIGH** |
| 10.3 | Log Aggregation | none | Centralized logs, search, retention, structured logging. | `sa-log-aggregation` | System | **HIGH** |
| 10.4 | Database Admin | none | Slow query log, index advisor, migration status, table sizes. | `sa-database-admin` | System | MEDIUM |
| 10.5 | Database Migrations | none | Migration status, rollback, version pinning, canary. | `sa-migrations` | System | MEDIUM |
| 10.6 | CDN Configuration | none | CDN config, cache purge, edge functions, hit rate. | `sa-cdn` | System | MEDIUM |
| 10.7 | Cache Management | none | Redis inspect, flush, hit rate, eviction policy. | `sa-cache` | System | MEDIUM |
| 10.8 | SSL Certificates | none | Cert expiry, ACME renewal, SAN management. | `sa-ssl` | System | MEDIUM |
| 10.9 | DNS Management | none | DNS records, propagation check, failover. | `sa-dns` | System | LOW |
| 10.10 | Microservices Catalog | none | Service registry, dependency graph, health, version. | `sa-services` | System | MEDIUM |
| 10.11 | Container / K8s Admin | none | Pod status, scaling, deploy, rollback. | `sa-k8s` | System | MEDIUM |
| 10.12 | APM / Metrics | none (sa-health is high-level) | Latency, error rate, traces, spans, SLO. | `sa-apm` | System | MEDIUM |
| 10.13 | Cloud Cost Monitoring | none | AWS/GCP cost monitoring, budget alerts, savings plan. | `sa-cloud-cost` | System | MEDIUM |
| 10.14 | Webhook DLQ & Retry | none (extends sa-webhooks) | DLQ inspection, replay, signature verification. | `sa-webhook-dlq` | System | MEDIUM |
| 10.15 | Comms Vendor Routing | none | Email/SMS/WhatsApp vendor failover config, cost routing. | `sa-comms-routing` | System | MEDIUM |
| 10.16 | Feature Flag Audit | none (extends sa-feature-flags) | Audit log of flag changes, rollout history, kill-switch. | `sa-feature-flag-audit` | System | LOW |
| 10.17 | Maintenance Window Scheduler | none (extends sa-maintenance) | Impact preview, dependency check, rollback plan. | `sa-maintenance-scheduler` | System | LOW |
| 10.18 | Image / Asset Management | none | CDN assets, image optimization, versioning. | `sa-assets` | System | LOW |

---

## Summary Statistics

| Category | Gaps Identified | HIGH priority | MEDIUM | LOW |
|---|---:|---:|---:|---:|
| 1. Hiring & Jobs Oversight | 13 | 6 | 3 | 4 |
| 2. Talent & Sourcing Oversight | 11 | 3 | 3 | 5 |
| 3. Learning & Training Oversight | 17 | 2 | 9 | 6 |
| 4. Finance & Billing Oversight | 21 | 8 | 9 | 4 |
| 5. Partnership & Ecosystem Oversight | 20 | 4 | 9 | 7 |
| 6. Communication Oversight | 15 | 3 | 7 | 5 |
| 7. Process & Lifecycle Oversight | 16 | 1 | 8 | 7 |
| 8. Analytics & Reporting Gaps | 15 | 3 | 10 | 2 |
| 9. Security & Compliance Gaps | 22 | 10 | 10 | 2 |
| 10. System & Integration Gaps | 18 | 3 | 11 | 4 |
| **TOTAL** | **168** | **43** | **79** | **46** |

After de-duplication (several gaps appear in 2 categories — e.g. `sa-renewal-forecast`, `sa-cost-per-hire-platform`, `sa-credential-verification`, `sa-bgv-*`): **~150 unique new routes** recommended.

## Recommended New Sidebar Groups

The existing 13 SA groups should be extended with **3 NEW groups** to house the bulk of these gaps cleanly:

1. **Hiring Oversight** (`sa-hiring-grp`) — houses 1.1–1.13 (jobs-all, hiring-pipeline, interviews-oversight, offers-registry, placements-registry, bgv-oversight, requisitions-oversight, onboarding-oversight, referral-fraud, submissions-oversight, hiring-managers, employee-lifecycle)
2. **Talent Oversight** (`sa-talent-grp`) — houses 2.1–2.11 (talent-directory, talent-dedup, ai-match-audit, resume-parser-oversight, search-audit, network-sourcing-oversight, sourcing-campaigns-oversight, hotlists-oversight, compare-audit, profile-quality)
3. **Learning Oversight** (`sa-learning-grp`) — houses 3.1–3.17 (certifications-registry, credentials-verification, curriculum-oversight, cohorts-directory, live-training-oversight, trainer-registry, question-bank-oversight, gradebook-audit, completion-oversight, ld-analytics, compliance-training-oversight, partner-courses-oversight, enrollment-oversight, gamification-config)
4. **Process Oversight** (`sa-process-grp`) — houses 7.1–7.16 (esign-oversight, approval-engine, reschedule-disputes, offer-negotiation-audit, onboarding-templates, reference-oversight, guarantee-tracking, etc.)

Finance, Partners, Comms, Analytics, Security, System groups can absorb their respective gaps without new top-level groups.

## Top 10 Critical Gaps (Highest Impact)

1. **`sa-fraud-detection`** — no platform fraud detection today (finance)
2. **`sa-wallet-freeze`** — cannot halt fraudulent activity (finance)
3. **`sa-message-audit`** — no cross-platform comms audit (legal/DEI risk)
4. **`sa-talent-directory`** — platform's biggest asset ungoverned (talent)
5. **`sa-consent-management`** + **`sa-dsar`** + **`sa-rtbf`** — DPDP Act 2023 non-compliant (security)
6. **`sa-placements-registry`** — revenue recognition events ungoverned (hiring)
7. **`sa-bgv-oversight`** — BGV vendors ungoverned (security/hiring)
8. **`sa-credentials-verification`** — fake cert risk (learning/security)
9. **`sa-reconciliation`** — no bank/gateway reconciliation (finance)
10. **`sa-cron-monitor`** + **`sa-queue-monitor`** + **`sa-log-aggregation`** — ops blind spots (system)

## Next Actions (for build agents)

1. **Phase 1 — Critical Risk Gaps (43 HIGH-priority routes):** Build the 43 HIGH-priority pages first. These cover fraud, privacy/DPDP, revenue recognition, BGV, credentials, message audit, talent directory.
2. **Phase 2 — Operational Oversight (79 MEDIUM routes):** Build the 79 MEDIUM-priority pages. These fill out process oversight, analytics, partner ecosystem, and system monitoring.
3. **Phase 3 — Polish (46 LOW routes):** Build the 46 LOW-priority pages. These are nice-to-have benchmarking/audit pages.
4. **Sidebar restructure:** Add 4 new top-level groups (Hiring Oversight, Talent Oversight, Learning Oversight, Process Oversight). This will push SA from 13→17 groups and ~62→~212 leaf routes — well beyond the "max 4 mains × 6 subs = 24 routes" design rule in the file header, but justified by SA's scope.
5. **Each new route** should follow the existing pattern: `sa-*` key, `SuperAdmin*.tsx` page in `src/portals/admin/`, dynamic import + switch case in `src/portals/admin/index.tsx`, emerald brand, mock data, sonner toast.

## Files Referenced (no code changes made — research only)

- `/home/z/my-project/src/components/layout/portal-config.ts` (956 lines) — all 5 user portals + admin config extracted
- `/home/z/my-project/src/portals/admin/index.tsx` — confirmed 62 existing `sa-*` routes
- `/home/z/my-project/src/portals/admin/` — 87 SuperAdmin*.tsx + legacy Admin*.tsx files inventoried
- `/home/z/my-project/worklog.md` — SUPERADMIN-FOUNDATION (line 4698) and SUPERADMIN-PORTAL-FINAL-SUMMARY (line 4739) reviewed for context
