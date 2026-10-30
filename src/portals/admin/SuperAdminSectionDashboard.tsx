"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { portalConfigs } from "@/components/layout/portal-config";
import type { NavItem } from "@/lib/types";

interface SectionMeta {
  title: string;
  desc: string;
  icon: string;
  kpis: Array<{
    label: string;
    value: string;
    icon: string;
    tone?: "brand" | "success" | "warning" | "danger" | "default";
  }>;
  childDescriptions?: Record<string, { desc: string; badge: string; stat: string }>;
  telemetry?: Array<{ name: string; status: string; info: string }>;
  auditTrail?: Array<{ action: string; user: string; time: string }>;
}

const SECTION_METADATA: Record<string, SectionMeta> = {
  "sa-users-grp": {
    title: "Users & Organizations Oversight",
    desc: "Centralized identity governance, candidate & employer directories, recruiter agencies, and role hierarchy management.",
    icon: "Users",
    kpis: [
      { label: "Total Users", value: "48,290", icon: "Users", tone: "brand" },
      { label: "Candidates Active", value: "32,450", icon: "User", tone: "success" },
      { label: "Enterprise Employers", value: "1,240", icon: "Building2", tone: "default" },
      { label: "Active Partners", value: "480", icon: "Handshake", tone: "success" },
    ],
    childDescriptions: {
      "sa-users-all": { desc: "Master directory of all registered users across all platform portals", badge: "Master Directory", stat: "48.2k records" },
      "sa-users-candidates": { desc: "Candidate profiles, KYC verifications, resume uploads, and jobseeker statuses", badge: "Talent", stat: "32.4k active" },
      "sa-users-employers": { desc: "Corporate employer accounts, hiring teams, company KYC, and credit balances", badge: "Enterprise", stat: "1.2k orgs" },
      "sa-users-recruiters": { desc: "Recruiter and agency accounts, performance benchmarks, and active job mandates", badge: "Agencies", stat: "640 agents" },
      "sa-users-training": { desc: "Accredited training centers, educator certifications, and course providers", badge: "Academia", stat: "210 centers" },
      "sa-users-partners": { desc: "Channel partners, academic liaisons, campus coordinators, and affiliates", badge: "Network", stat: "480 partners" },
      "sa-roles-hierarchy": { desc: "Multi-tenant role inheritance, reporting lines, and departmental delegation trees", badge: "Governance", stat: "14 tiers" },
      "sa-impersonation": { desc: "Secure audit-logged session assumption for user support and issue diagnosis", badge: "Admin Tool", stat: "MFA required" },
    },
    telemetry: [
      { name: "Auth0 / Firebase Sync", status: "Operational", info: "99.98% uptime" },
      { name: "Candidate Profile Index", status: "Operational", info: "Updated 4m ago" },
      { name: "Enterprise SSO Directory", status: "Operational", info: "84 IDPs linked" },
      { name: "Role Matrix Validator", status: "Operational", info: "Enforced" },
    ],
    auditTrail: [
      { action: "Admin impersonated candidate user #cand_992 for billing ticket", user: "Super Admin", time: "18m ago" },
      { action: "Enterprise account 'TCS Digital' team member added", user: "HR Ops", time: "1h ago" },
      { action: "Recruiter agency license renewed for 'Kelly Staffing'", user: "Compliance", time: "3h ago" },
      { action: "Role 'Senior Placement Officer' updated with batch export rights", user: "Security", time: "1d ago" },
    ],
  },

  "sa-usermgmt-grp": {
    title: "User Management & Access Control",
    desc: "Granular RBAC permission matrices, sub-admin delegation, user invitation queues, departments, and audit logs.",
    icon: "UserCog",
    kpis: [
      { label: "System Roles", value: "14 Roles", icon: "Shield", tone: "brand" },
      { label: "Active Sub-Admins", value: "28 Admins", icon: "UserCheck", tone: "default" },
      { label: "Pending Invites", value: "42 Pending", icon: "Mail", tone: "warning" },
      { label: "Access Matrix", value: "100% Enforced", icon: "Grid3x3", tone: "success" },
    ],
    childDescriptions: {
      "sa-roles": { desc: "Configure platform roles, define access scopes, and manage role assignments", badge: "RBAC", stat: "14 active roles" },
      "sa-groups": { desc: "Functional user groups, department teams, and bulk policy groupings", badge: "Teams", stat: "32 groups" },
      "sa-permissions": { desc: "Granular capability flags, API route authorization, and write grants", badge: "Security", stat: "128 rules" },
      "sa-access-control-matrix": { desc: "Interactive cross-functional grid mapping permissions to role hierarchies", badge: "Matrix", stat: "Full audit" },
      "sa-admin-accounts": { desc: "Privileged super-admin credentials, hardware key MFA, and root access controls", badge: "Privileged", stat: "6 accounts" },
      "sa-sub-admins": { desc: "Regional and departmental sub-administrators with delegated operational scopes", badge: "Delegation", stat: "28 active" },
      "sa-business-users": { desc: "Enterprise account executives, billing leads, and internal business staff", badge: "Business", stat: "94 users" },
      "sa-user-invitations": { desc: "Manage outbound invitation tokens, pending sign-up links, and auto-expiry", badge: "Invites", stat: "42 pending" },
      "sa-user-onboarding": { desc: "Track multi-step onboarding progression, missing documents, and profile KYC", badge: "Lifecycle", stat: "86% complete" },
      "sa-departments": { desc: "Organizational business units, cost centers, and departmental leads", badge: "Structure", stat: "12 depts" },
      "sa-reporting-hierarchy": { desc: "Direct reporting lines, escalation managers, and supervisory chains", badge: "Org Chart", stat: "Configured" },
      "sa-user-activity-log": { desc: "Real-time chronological stream of user logins, role modifications, and admin actions", badge: "Audit Trail", stat: "Live stream" },
    },
    telemetry: [
      { name: "RBAC Engine", status: "Operational", info: "0 policy violations" },
      { name: "MFA Enforcement", status: "Operational", info: "100% privileged coverage" },
      { name: "Session Token Service", status: "Operational", info: "1.2ms latency" },
    ],
    auditTrail: [
      { action: "Sub-admin 'Priya S.' assigned to South Zone Training oversight", user: "Super Admin", time: "25m ago" },
      { action: "Invitation token re-sent to candidate batch #2026-B", user: "Onboarding Bot", time: "2h ago" },
      { action: "Admin account MFA re-verified via YubiKey", user: "SecOps", time: "4h ago" },
    ],
  },

  "sa-analytics-grp": {
    title: "Platform Analytics & Business Intelligence",
    desc: "Cross-platform telemetry, user acquisition funnels, cohort retention, and platform revenue metrics.",
    icon: "BarChart3",
    kpis: [
      { label: "Monthly Actives", value: "28.4k", icon: "TrendingUp", tone: "brand" },
      { label: "Platform Retention", value: "89.2%", icon: "Users2", tone: "success" },
      { label: "Hiring Funnel Conv.", value: "18.4%", icon: "Filter", tone: "default" },
      { label: "Monthly Growth", value: "+24% MoM", icon: "BarChart3", tone: "success" },
    ],
    childDescriptions: {
      "sa-analytics": { desc: "Global telemetry overview, page visits, peak traffic, and engagement heatmaps", badge: "Overview", stat: "28.4k MAU" },
      "sa-growth": { desc: "Sign-up acceleration, regional user distribution, and acquisition channel breakdowns", badge: "Growth", stat: "+24% MoM" },
      "sa-funnels": { desc: "Candidate progression from application to interview, offer, and placement", badge: "Conversion", stat: "18.4% conv." },
      "sa-revenue-analytics": { desc: "Gross platform volume, subscription ARR/MRR, placement fees, and net yield", badge: "Revenue", stat: "₹92.4L ARR" },
      "sa-cohorts": { desc: "Retention curves, monthly user cohort stickiness, and lifetime engagement value", badge: "Cohorts", stat: "89.2% retained" },
    },
    telemetry: [
      { name: "Clickstream Ingestion (Kafka)", status: "Operational", info: "4,200 events/sec" },
      { name: "Telemetry OLAP Database (ClickHouse)", status: "Operational", info: "6ms query time" },
      { name: "Metrics Aggregation Pipeline", status: "Operational", info: "Real-time" },
    ],
    auditTrail: [
      { action: "Q3 Funnel Conversion report generated and exported to PDF", user: "Growth Team", time: "45m ago" },
      { action: "Cohort retention threshold alert configured at 85%", user: "Product Lead", time: "3h ago" },
    ],
  },

  "sa-finance-grp": {
    title: "Finance, Billing & Treasury Oversight",
    desc: "Master unified transaction ledgers, payouts, GST tax compliance, refund disputes, and revenue share engine.",
    icon: "Wallet",
    kpis: [
      { label: "Platform GMV", value: "₹4.82 Cr", icon: "DollarSign", tone: "brand" },
      { label: "Net Revenue", value: "₹92.4 L", icon: "Receipt", tone: "success" },
      { label: "Pending Settlements", value: "14 Batches", icon: "Coins", tone: "warning" },
      { label: "Gateway Status", value: "100% Operational", icon: "CreditCard", tone: "success" },
    ],
    childDescriptions: {
      "sa-txn-all": { desc: "Unified master transaction register of all credits, debits, payments, and fees", badge: "Ledger", stat: "142k transactions" },
      "sa-revenue": { desc: "Platform net revenue recognition, commission yields, and fee deductions", badge: "P&L", stat: "₹92.4L net" },
      "sa-invoices": { desc: "B2B and B2C GST-compliant tax invoices, credit notes, and downloadable receipts", badge: "Invoicing", stat: "18.4k invoices" },
      "sa-payouts": { desc: "Disbursements to recruiters, partner centers, and trainers via NEFT/IMPS", badge: "Settlements", stat: "14 queued" },
      "sa-refunds": { desc: "Refund dispute requests, customer chargebacks, and administrative reversals", badge: "Disputes", stat: "3 active" },
      "sa-tax": { desc: "GST calculations, TDS deductions, HSN/SAC code tracking, and tax filing reports", badge: "Compliance", stat: "Quarterly filed" },
      "sa-plans-pricing": { desc: "Manage employer subscriptions, candidate credit packages, and enterprise tiers", badge: "Pricing", stat: "6 active plans" },
      "sa-fraud-detection": { desc: "Algorithmic anomaly detection for chargebacks, fake transactions, and velocity spikes", badge: "Risk Engine", stat: "0 high risk" },
      "sa-wallet-freeze": { desc: "Emergency account balance holds, legal dispute freezes, and compliance locks", badge: "Security", stat: "2 held" },
      "sa-txn-reversal": { desc: "Administrative transaction reversal tool with dual-approval workflow", badge: "Audit", stat: "Dual key" },
      "sa-reconciliation": { desc: "Bank statement vs payment gateway vs ledger 3-way automated matching", badge: "Automation", stat: "99.99% matched" },
      "sa-commission-disputes": { desc: "Dispute resolution for recruiter placement fees and partner referral payouts", badge: "Arbitration", stat: "1 open" },
      "sa-gst-compliance": { desc: "State-wise GST filings, e-invoice generation, and reconciliation certificates", badge: "GST India", stat: "GSTR-1 synced" },
      "sa-multi-currency-oversight": { desc: "Multi-currency wallet balances, live forex rates, and overseas client invoicing", badge: "Forex", stat: "INR / USD / EUR" },
      "sa-payment-gateway-health": { desc: "Razorpay, Cashfree, and Stripe gateway latency, success rates, and webhooks", badge: "Gateways", stat: "99.98% success" },
      "sa-wallet-ledger": { desc: "Individual virtual wallet ledger entries, balance statements, and ledger adjustments", badge: "Wallets", stat: "All synced" },
      "sa-financial-audit": { desc: "Immutable fiscal audit log ready for statutory auditor inspection", badge: "Audit Ready", stat: "Exportable" },
      "sa-cross-portal-placements": { desc: "Financial settlements triggered across interconnected partner and recruiter portals", badge: "Multi-Portal", stat: "84 settled" },
      "sa-unified-ledger": { desc: "Double-entry accounting journal consolidating all portal billing activities", badge: "Core Ledger", stat: "Balanced" },
      "sa-commission-tracker": { desc: "Milestone-based commission calculator with automatic bonus tiers", badge: "Commissions", stat: "Auto-computed" },
      "sa-settlement-hub": { desc: "Central treasury hub for batch clearing and vendor bank disbursements", badge: "Treasury", stat: "Automated" },
      "sa-revenue-share-engine": { desc: "Contractual percentage splits between platform, partners, and trainers", badge: "Smart Rules", stat: "12 rules live" },
    },
    telemetry: [
      { name: "Payment Gateway Primary (Razorpay)", status: "Operational", info: "99.98% success rate" },
      { name: "Bank Payouts API (IMPS/NEFT)", status: "Operational", info: "14 batches cleared" },
      { name: "GST E-Invoice System", status: "Operational", info: "NIC portal connected" },
    ],
    auditTrail: [
      { action: "Batch settlement #202610-B approved for 18 partners (₹14.2 L)", user: "Finance Lead", time: "1h ago" },
      { action: "Refund #RF-4412 approved after candidate withdrawal within warranty", user: "Finance Ops", time: "3h ago" },
    ],
  },

  "sa-content-grp": {
    title: "Content & Taxonomy Management",
    desc: "Global job classification, standardized skills taxonomy, master course catalog, and job moderation.",
    icon: "BookOpen",
    kpis: [
      { label: "Job Taxonomies", value: "420 Titles", icon: "Briefcase", tone: "brand" },
      { label: "Skill Categories", value: "1,850 Skills", icon: "Brain", tone: "default" },
      { label: "Catalog Courses", value: "340 Courses", icon: "GraduationCap", tone: "success" },
      { label: "Pending Moderation", value: "8 Jobs", icon: "ShieldCheck", tone: "warning" },
    ],
    childDescriptions: {
      "sa-job-taxonomy": { desc: "Standardized industry job families, seniority levels, and standardized job titles", badge: "Taxonomy", stat: "420 titles" },
      "sa-skill-taxonomy": { desc: "Verified skill ontology, proficiency assessment mappings, and technical tags", badge: "Ontology", stat: "1.8k skills" },
      "sa-courses": { desc: "Master curriculum directory of certified courses, learning paths, and syllabus units", badge: "LMS Catalog", stat: "340 courses" },
      "sa-cms": { desc: "Platform public pages, terms of service, legal disclaimers, and marketing copy", badge: "CMS", stat: "28 pages" },
      "sa-templates": { desc: "Standardized email templates, offer letters, NDA agreements, and candidate forms", badge: "Templates", stat: "48 templates" },
      "sa-job-moderation": { desc: "Review queue for submitted job posts to detect spam, duplicates, and policy breaches", badge: "Moderation", stat: "8 in queue" },
    },
    telemetry: [
      { name: "Skills Ontology Embeddings", status: "Operational", info: "Semantic graph v3.2" },
      { name: "Job Spam Filter (AI Engine)", status: "Operational", info: "99.6% precision" },
    ],
  },

  "sa-hiring-grp": {
    title: "Hiring Oversight & Operations",
    desc: "Global interview scheduling, job offers registry, placement verification, background checks, and guarantee tracking.",
    icon: "Briefcase",
    kpis: [
      { label: "Active Jobs", value: "1,842 Live", icon: "Briefcase", tone: "brand" },
      { label: "Interviews This Week", value: "318 Sessions", icon: "Video", tone: "default" },
      { label: "Offers Extended", value: "84 Offers", icon: "Gift", tone: "success" },
      { label: "Guarantees Active", value: "126 Hires", icon: "ShieldCheck", tone: "default" },
    ],
    childDescriptions: {
      "sa-jobs-all": { desc: "Omni-portal searchable job listings with live candidate counts and employer tags", badge: "Jobs Directory", stat: "1.8k active" },
      "sa-hiring-pipeline": { desc: "Enterprise Kanban pipeline monitoring applicant progression across all clients", badge: "Pipeline", stat: "4.2k active app" },
      "sa-interviews-oversight": { desc: "Live interview sessions, Google Meet / Zoom links, and interview attendance logs", badge: "Scheduling", stat: "318 this week" },
      "sa-offers-registry": { desc: "Extended compensation packages, offer letters, acceptance ratios, and CTC details", badge: "Offers", stat: "84 extended" },
      "sa-placements-registry": { desc: "Verified employee placements, joining dates, employer confirmation, and billing", badge: "Placements", stat: "612 YTD" },
      "sa-bgv-oversight": { desc: "Background verification tracking with third-party verification partner SLAs", badge: "Verification", stat: "42 in progress" },
      "sa-reference-checks": { desc: "Automated candidate professional referee surveys and verified verification scores", badge: "References", stat: "98% returned" },
      "sa-offer-esign-oversight": { desc: "Aadhaar / DocuSign digital signature completion for employment contracts", badge: "E-Sign", stat: "92% signed" },
      "sa-reschedule-disputes": { desc: "Resolution center for repeated interview cancellations and schedule conflicts", badge: "Disputes", stat: "2 open" },
      "sa-offer-negotiation-oversight": { desc: "Monitored salary counter-offers, CTC adjustments, and employer concession logs", badge: "Negotiations", stat: "14 ongoing" },
      "sa-guarantee-tracking": { desc: "90-day replacement warranty timers and recruiter guarantee adherence tracking", badge: "Guarantees", stat: "126 covered" },
      "sa-rejection-audit": { desc: "Diversity compliance review of candidate stage rejections and fairness audits", badge: "Compliance", stat: "Audit clean" },
      "sa-hiring-funnel": { desc: "Hiring velocity benchmarks, drop-off analytics, and time-to-hire statistics", badge: "Metrics", stat: "22 days avg" },
      "sa-skill-credential-sync": { desc: "Verified course badges and assessment scores linked to active job applications", badge: "Sync", stat: "Automated" },
    },
    telemetry: [
      { name: "Interview Video Bridge", status: "Operational", info: "0 active drops" },
      { name: "BGV Partner API Gateway", status: "Operational", info: "SLA: 48h avg" },
    ],
  },

  "sa-talent-grp": {
    title: "Talent Pool & Sourcing Oversight",
    desc: "Cross-portal talent directory, deduplication engine, AI match auditing, and boolean search query logs.",
    icon: "Users",
    kpis: [
      { label: "Candidate Profiles", value: "38.5k Profiles", icon: "Users", tone: "brand" },
      { label: "Cross-Portal Dedup", value: "99.4% Match", icon: "Copy", tone: "success" },
      { label: "AI Match Precision", value: "94.2%", icon: "Sparkles", tone: "success" },
      { label: "Active Hotlists", value: "18 Benches", icon: "Flame", tone: "default" },
    ],
    childDescriptions: {
      "sa-talent-directory": { desc: "Master candidate database with verified work experience, skills, and status", badge: "Talent Bank", stat: "38.5k profiles" },
      "sa-talent-dedup": { desc: "Identify duplicate candidate records across agencies, phone numbers, and emails", badge: "Dedup Engine", stat: "99.4% accuracy" },
      "sa-ai-match-audit": { desc: "Inspect algorithm scoring weights, relevance rankings, and match explanations", badge: "AI Auditor", stat: "94.2% precision" },
      "sa-resume-parser-oversight": { desc: "Monitor parsing error rates, OCR fidelity on PDF resumes, and field extractions", badge: "Parser", stat: "98.8% success" },
      "sa-search-audit": { desc: "Audit search keywords used by recruiters, zero-result terms, and query latency", badge: "Search Telemetry", stat: "12ms avg" },
      "sa-boolean-search-oversight": { desc: "Monitor complex boolean search queries and candidate index performance", badge: "Boolean", stat: "Indexed" },
      "sa-talent-pool-oversight": { desc: "Segmented talent benches, pre-vetted domain specialists, and alumni pools", badge: "Pools", stat: "24 pools" },
      "sa-sourcing-campaigns": { desc: "Targeted outbound recruiter reach-outs, email engagement, and response rates", badge: "Campaigns", stat: "18 live" },
      "sa-hotlists-oversight": { desc: "Immediate joiners, bench resources, and high-priority candidate showcases", badge: "Hotlists", stat: "140 candidates" },
      "sa-candidate-lifecycle": { desc: "Comprehensive candidate timeline from signup to interview, training, and promotion", badge: "Lifecycle", stat: "Tracked" },
      "sa-talent-analytics": { desc: "Talent supply vs employer demand heatmaps, salary expectation distributions", badge: "Analytics", stat: "Updated daily" },
    },
    telemetry: [
      { name: "Vector Search Index (Pinecone)", status: "Operational", info: "38.5k vectors" },
      { name: "Resume OCR Extraction Worker", status: "Operational", info: "Idle (queue: 0)" },
    ],
  },

  "sa-learning-grp": {
    title: "Learning & Academic Governance",
    desc: "Course accreditation, blockchain credential verification, cohort tracking, and trainer performance audits.",
    icon: "GraduationCap",
    kpis: [
      { label: "Certified Learners", value: "8,920", icon: "Award", tone: "brand" },
      { label: "Active Cohorts", value: "42 Batches", icon: "Users2", tone: "default" },
      { label: "Verified Trainers", value: "115 Faculty", icon: "GraduationCap", tone: "success" },
      { label: "Avg Assessment Score", value: "84.6%", icon: "ClipboardCheck", tone: "success" },
    ],
    childDescriptions: {
      "sa-certifications-registry": { desc: "Master credential ledger of all accredited digital certificates and micro-degrees", badge: "Certificates", stat: "8.9k issued" },
      "sa-credentials-verification": { desc: "Public verification endpoint and cryptographic authenticity checks", badge: "Verification", stat: "Verifiable" },
      "sa-curriculum-oversight": { desc: "Review and approve partner course syllabi, module breakdowns, and learning objectives", badge: "Curriculum", stat: "340 approved" },
      "sa-cohorts-directory": { desc: "Schedule of current live training cohorts, student enrollments, and batch status", badge: "Cohorts", stat: "42 live" },
      "sa-trainers-directory": { desc: "Faculty roster, instructor ratings, subject matter expertise, and allocations", badge: "Trainers", stat: "115 faculty" },
      "sa-assessments-oversight": { desc: "Quiz questions, proctored coding tests, assessment cheating detection logs", badge: "Testing", stat: "Anti-cheat on" },
      "sa-gradebook-audit": { desc: "Cross-cohort grade distributions, passing grade thresholds, and score moderation", badge: "Gradebook", stat: "Moderated" },
      "sa-attendance-oversight": { desc: "Student attendance records, session drop-outs, and minimum attendance alerts", badge: "Attendance", stat: "92% average" },
      "sa-learning-analytics": { desc: "Course completion rates, dropout forecasting, and job placement correlation", badge: "Outcomes", stat: "78% hired" },
    },
    telemetry: [
      { name: "LMS Video Streaming CDN", status: "Operational", info: "4K low-latency" },
      { name: "Proctoring Integrity Engine", status: "Operational", info: "0 active alerts" },
    ],
  },

  "sa-process-grp": {
    title: "Process Automation & Compliance Oversight",
    desc: "Cross-portal pipeline coordination, approval engines, probation milestones, and placement handoffs.",
    icon: "Workflow",
    kpis: [
      { label: "Approval Workflows", value: "16 Active", icon: "CheckCircle2", tone: "brand" },
      { label: "Cross-Portal Handoffs", value: "240 Placements", icon: "ArrowRightLeft", tone: "success" },
      { label: "Probation Checkpoints", value: "54 Employees", icon: "Clock", tone: "default" },
      { label: "Pending Approvals", value: "7 Requests", icon: "FileSignature", tone: "warning" },
    ],
    childDescriptions: {
      "sa-approval-engine": { desc: "Multi-tier approval workflows for contracts, discounts, exceptions, and hires", badge: "Workflows", stat: "16 active rules" },
      "sa-esign-oversight": { desc: "Manage digital signature vendor connectors, signature quotas, and error audits", badge: "E-Sign", stat: "DocuSign / Aadhaar" },
      "sa-probation-oversight": { desc: "Track 30/60/90-day post-hire employee probation reviews and confirmation", badge: "Probation", stat: "54 tracked" },
      "sa-exit-oversight": { desc: "Employee separation workflows, asset clearance, and exit interview responses", badge: "Offboarding", stat: "12 completed" },
      "sa-performance-oversight": { desc: "Annual and quarterly performance review completion rates and rating curves", badge: "Appraisals", stat: "Q3 active" },
      "sa-leave-oversight": { desc: "Employee holiday calendars, statutory leave compliance, and attendance sync", badge: "Leaves", stat: "Compliant" },
      "sa-onboarding-oversight": { desc: "New hire provisioning checklist, IT setup status, and orientation tracking", badge: "Onboarding", stat: "98% on-time" },
      "sa-enrollment-oversight": { desc: "Student enrollment approvals into sponsor-funded training programs", badge: "Enrollments", stat: "140 approved" },
      "sa-trainer-allocation-oversight": { desc: "Instructor scheduling conflicts, double-booking alerts, and time logs", badge: "Scheduling", stat: "0 conflicts" },
      "sa-unified-applications": { desc: "Single intake stream aggregating job applications from all connected sources", badge: "Intake", stat: "All portals" },
      "sa-cross-portal-pipeline": { desc: "Cross-portal applicant tracking between partner, recruiter, and employer teams", badge: "Shared Kanban", stat: "240 items" },
      "sa-cross-portal-approvals": { desc: "Inter-entity authorization requests requiring multi-stakeholder sign-off", badge: "Dual Sign", stat: "7 pending" },
      "sa-sourcing-bridge": { desc: "Direct candidate profile bridge between academic partners and recruiters", badge: "Bridge", stat: "Automated" },
      "sa-placement-handoff": { desc: "Seamless candidate handoff from training graduation to recruiter placement", badge: "Handoff", stat: "82 this month" },
      "sa-offer-handshake": { desc: "Digital tripartite handshakes securing employer, partner, and candidate terms", badge: "Handshake", stat: "Enforced" },
      "sa-interview-sync": { desc: "Multi-calendar bidirectional sync for interview sessions across portals", badge: "Calendar", stat: "Google / Outlook" },
      "sa-guarantee-claims": { desc: "Employer replacement claims filed under candidate placement guarantees", badge: "Claims", stat: "1 pending" },
      "sa-t2h-pipeline-visibility": { desc: "Train-to-Hire student progression tracker mapped against corporate mandates", badge: "T2H Engine", stat: "3 mandates" },
    },
    telemetry: [
      { name: "Workflow Execution Engine (Temporal)", status: "Operational", info: "0 failed tasks" },
      { name: "Cross-Portal Event Bus (Kafka)", status: "Operational", info: "0 lag" },
    ],
  },

  "sa-security-grp": {
    title: "Security, Privacy & Compliance",
    desc: "SIEM audit trails, access controls, DPDP/GDPR privacy compliance, DSAR queues, and vulnerability scanning.",
    icon: "Lock",
    kpis: [
      { label: "Audit Events", value: "142k / Day", icon: "ScrollText", tone: "brand" },
      { label: "Data Residency", value: "India Central", icon: "Globe", tone: "success" },
      { label: "DSAR Compliance", value: "100% Met", icon: "FileSearch", tone: "success" },
      { label: "Vulnerability Score", value: "0 Critical", icon: "ShieldCheck", tone: "success" },
    ],
    childDescriptions: {
      "sa-audit": { desc: "Immutable audit log of all system requests, API calls, and privileged operations", badge: "SIEM", stat: "142k / day" },
      "sa-access-control": { desc: "CIDR IP allowlists, geofencing, and network perimeter security policies", badge: "Perimeter", stat: "Enforced" },
      "sa-privacy": { desc: "Data protection rules complying with India DPDP Act 2023 and GDPR guidelines", badge: "DPDP 2023", stat: "Compliant" },
      "sa-security-alerts": { desc: "Automated threat intelligence alerts, suspicious logins, and brute-force defenses", badge: "Threats", stat: "0 active" },
      "sa-api-keys": { desc: "Developer API keys, access secrets, rate limit tiers, and webhook signatures", badge: "Credentials", stat: "38 keys" },
      "sa-sessions": { desc: "Active browser sessions across all portals with remote termination capabilities", badge: "Sessions", stat: "1.4k active" },
      "sa-consent-management": { desc: "User consent recordkeeping, terms acceptance logs, and privacy preferences", badge: "Consent", stat: "48k recorded" },
      "sa-dsar": { desc: "Data Subject Access Request pipeline with automated SLA countdown timers", badge: "DSAR", stat: "0 overdue" },
      "sa-rtbf": { desc: "Right to be Forgotten automated data erasure workflows and shredding verification", badge: "Erasure", stat: "Cert verified" },
      "sa-data-residency": { desc: "Data localization policies ensuring candidate PII remains in India Cloud", badge: "Residency", stat: "India Central" },
      "sa-kms-vault": { desc: "Cloud KMS key management, AES-256 database column encryption, and key rotation", badge: "KMS", stat: "Rotated" },
      "sa-vulnerability-scanner": { desc: "Automated dependency CVE scanning, container image vulnerabilities, and SAST", badge: "DevSecOps", stat: "0 critical" },
      "sa-penetration-test": { desc: "Annual third-party CERT-In accredited security penetration test audit reports", badge: "PenTest", stat: "Q2 Certified" },
      "sa-cookie-compliance": { desc: "Cookie consent categorization, cookie banner preferences, and opt-out tracking", badge: "Cookies", stat: "Configured" },
      "sa-data-export-audit": { desc: "Audit trail of all CSV/Excel candidate export operations to prevent data leaks", badge: "DLP", stat: "All logged" },
      "sa-incident-response": { desc: "Cybersecurity incident response playbooks, automated escalation, and forensics", badge: "Playbook", stat: "Standby" },
      "sa-consent-management-portal": { desc: "Cross-portal consent synchronization to ensure unified candidate privacy state", badge: "Sync", stat: "Synced" },
      "sa-unified-audit-trail": { desc: "Enterprise SIEM centralized export stream for external compliance monitoring", badge: "Export", stat: "Live stream" },
    },
    telemetry: [
      { name: "WAF & DDoS Shield (Cloudflare)", status: "Operational", info: "0 active attacks" },
      { name: "KMS Envelope Encryption", status: "Operational", info: "AES-GCM-256" },
      { name: "SIEM Audit Ingestion", status: "Operational", info: "Zero latency" },
    ],
  },

  "sa-partners-grp": {
    title: "Partner Ecosystem & Operations",
    desc: "Franchise partner onboarding, university college directories, revenue split agreements, and compliance audits.",
    icon: "Handshake",
    kpis: [
      { label: "Active Partners", value: "312 Partners", icon: "Handshake", tone: "brand" },
      { label: "Partner Colleges", value: "84 Colleges", icon: "Building2", tone: "default" },
      { label: "Registered Students", value: "12.8k Enrolled", icon: "Users", tone: "success" },
      { label: "MoUs in Effect", value: "98 Signed", icon: "FileSignature", tone: "success" },
    ],
    childDescriptions: {
      "sa-partner-applications": { desc: "Review and approve new training center, franchisee, and campus partner applications", badge: "Onboarding", stat: "14 pending" },
      "sa-partner-directory": { desc: "Verified registry of all operational channel partners, territories, and tier levels", badge: "Directory", stat: "312 active" },
      "sa-partner-performance": { desc: "Lead generation volumes, student placement rates, and revenue target milestones", badge: "Scorecard", stat: "Top tier: 42" },
      "sa-revenue-splits": { desc: "Configured commission rates, franchisee share tiers, and monthly payout rules", badge: "Rev Share", stat: "Configured" },
      "sa-mou": { desc: "Digital Memorandum of Understanding contracts, expiration notices, and renewals", badge: "Contracts", stat: "98 active" },
      "sa-college-directory": { desc: "Accredited colleges and university placement cell coordinators linked to platform", badge: "Colleges", stat: "84 linked" },
      "sa-student-registry": { desc: "Student cohorts originating from campus recruitment drives and partner centers", badge: "Campus", stat: "12.8k students" },
      "sa-partner-compliance": { desc: "Brand guideline adherence, fee transparency audits, and faculty quality checks", badge: "Audit", stat: "100% compliant" },
      "sa-renewal-forecast-platform": { desc: "Machine learning forecasting of upcoming partner contract renewal probabilities", badge: "AI Forecast", stat: "94% renewal" },
    },
    telemetry: [
      { name: "Partner API Gateway", status: "Operational", info: "312 endpoints linked" },
      { name: "Student Bulk Ingest Engine", status: "Operational", info: "Processed 1.4k today" },
    ],
  },

  "sa-comms-grp": {
    title: "Unified Communications Hub",
    desc: "Omnichannel notification dispatcher, SMS DLT compliance, WhatsApp oversight, and email deliverability.",
    icon: "Megaphone",
    kpis: [
      { label: "Messages Delivered", value: "1.2M / mo", icon: "Mail", tone: "brand" },
      { label: "Email Deliverability", value: "99.8%", icon: "MailCheck", tone: "success" },
      { label: "SMS DLT Headers", value: "100% Verified", icon: "Smartphone", tone: "success" },
      { label: "WhatsApp Gateway", value: "Tier 1 Active", icon: "MessageCircle", tone: "default" },
    ],
    childDescriptions: {
      "sa-announcements": { desc: "Broadcast banners, critical alerts, and scheduled maintenance notices across portals", badge: "Broadcasts", stat: "2 live" },
      "sa-email-campaigns": { desc: "Automated candidate outreach, newsletter mailers, and trigger-based drip campaigns", badge: "Email", stat: "1.2M / month" },
      "sa-push": { desc: "Web and mobile push notification delivery queues, delivery rates, and click metrics", badge: "Push", stat: "94% delivered" },
      "sa-sms": { desc: "Transactional OTP messages, interview reminders, and SMS gateway credit balances", badge: "SMS", stat: "48k credits" },
      "sa-whatsapp": { desc: "Meta WhatsApp Business Cloud API messages, candidate confirmations, and status bot", badge: "WhatsApp", stat: "Tier 1 Verified" },
      "sa-message-audit": { desc: "Audit candidate-to-recruiter messaging logs to enforce anti-harassment policies", badge: "Policy", stat: "Clean" },
      "sa-email-deliverability": { desc: "SPF, DKIM, DMARC records, domain reputation scores, and bounce monitoring", badge: "Deliverability", stat: "99.8% inbox" },
      "sa-sms-dlt-compliance": { desc: "Telecom Regulatory Authority of India (TRAI) DLT header and template approvals", badge: "DLT India", stat: "18 templates" },
      "sa-whatsapp-oversight": { desc: "WhatsApp business quota, response time monitoring, and phone number quality", badge: "Quality", stat: "High quality" },
      "sa-comms-analytics": { desc: "Cross-channel engagement rates, open rates, delivery speed, and click analytics", badge: "BI", stat: "Real-time" },
      "sa-template-approval": { desc: "Review and approve transactional message templates before production dispatch", badge: "Templates", stat: "64 approved" },
      "sa-unified-inbox": { desc: "Consolidated multi-channel conversation stream for unified administrative support", badge: "Inbox", stat: "All channels" },
      "sa-cross-portal-threads": { desc: "Collaborative messaging threads linking candidates, employers, and partners", badge: "Threads", stat: "812 active" },
      "sa-shared-notifications": { desc: "Notification dispatch rules fanning out across multiple interconnected portals", badge: "Notifications", stat: "Configured" },
      "sa-unified-calendar": { desc: "Central calendar aggregating interviews, classes, webinars, and meetings", badge: "Calendar", stat: "Synced" },
      "sa-comms-health": { desc: "Real-time health of SendGrid, Twilio, Gupshup, and Firebase cloud messaging", badge: "Health", stat: "All green" },
      "sa-cross-portal-tasks": { desc: "Operational action items assigned between administrative and portal users", badge: "Tasks", stat: "Synced" },
    },
    telemetry: [
      { name: "SendGrid Email SMTP Relay", status: "Operational", info: "Deliverability 99.8%" },
      { name: "Twilio / Gupshup SMS Gateway", status: "Operational", info: "DLT Scrubbing Active" },
      { name: "Meta WhatsApp Cloud API", status: "Operational", info: "Latency 180ms" },
    ],
  },

  "sa-ops-grp": {
    title: "Operations & Support Center",
    desc: "Platform helpdesk ticketing, SLA response monitors, incident post-mortems, and public status pages.",
    icon: "LifeBuoy",
    kpis: [
      { label: "Open Tickets", value: "14 Tickets", icon: "Ticket", tone: "brand" },
      { label: "SLA Adherence", value: "98.6%", icon: "Clock", tone: "success" },
      { label: "Active Incidents", value: "0 Outages", icon: "AlertCircle", tone: "success" },
      { label: "Knowledge Base", value: "148 Articles", icon: "BookOpen", tone: "default" },
    ],
    childDescriptions: {
      "sa-tickets": { desc: "Consolidated support ticket queue with priority routing and agent assignments", badge: "Helpdesk", stat: "14 open" },
      "sa-sla": { desc: "SLA response timers, first-contact resolution metrics, and escalation triggers", badge: "SLA", stat: "98.6% met" },
      "sa-incidents": { desc: "Major outage post-mortems, root cause analysis (RCA), and incident playbooks", badge: "Incidents", stat: "0 active" },
      "sa-kb": { desc: "Manage self-service knowledge base articles, video tutorials, and user FAQs", badge: "Knowledge", stat: "148 articles" },
      "sa-status-page": { desc: "Public uptime status dashboard communicating maintenance and service health", badge: "Status", stat: "All green" },
    },
    telemetry: [
      { name: "Helpdesk Ticket Dispatcher", status: "Operational", info: "Avg response: 18m" },
      { name: "Incident Webhook Broadcaster", status: "Operational", info: "Standby" },
    ],
  },

  "sa-system-grp": {
    title: "System Infrastructure & DevOps",
    desc: "Integration endpoints, API rate limits, BullMQ cron schedules, Redis queues, and database administration.",
    icon: "Cog",
    kpis: [
      { label: "Active Integrations", value: "24 Connectors", icon: "Plug", tone: "brand" },
      { label: "API Requests", value: "4.8M / Day", icon: "Code", tone: "default" },
      { label: "Queue Latency", value: "3.2ms", icon: "ListOrdered", tone: "success" },
      { label: "Database Health", value: "Healthy (Pool: 18%)", icon: "Database", tone: "success" },
    ],
    childDescriptions: {
      "sa-integrations": { desc: "Third-party HRIS connectors, Workday, BambooHR, and external webhooks", badge: "Ecosystem", stat: "24 connectors" },
      "sa-api": { desc: "Platform REST and GraphQL API management, rate limiting, and developer sandbox", badge: "API Gateway", stat: "4.8M req/day" },
      "sa-webhooks": { desc: "Outbound event webhooks, retry policies, payload inspection, and signing keys", badge: "Webhooks", stat: "99.9% sent" },
      "sa-ai-config": { desc: "LLM model hyperparameter settings, prompt templates, and AI cost rate caps", badge: "AI Engine", stat: "Gemini 2.0" },
      "sa-backups": { desc: "Automated snapshot schedules, cross-region replication, and disaster recovery", badge: "Backups", stat: "Daily verified" },
      "sa-system-config": { desc: "Global environment variables, locale settings, currency defaults, and constants", badge: "Config", stat: "Production" },
      "sa-cron-monitor": { desc: "Scheduled cron jobs, batch settlements, nightly report generators, and execution", badge: "Cron", stat: "18 active jobs" },
      "sa-queue-monitor": { desc: "BullMQ / Redis background job queues, active workers, failure queues, and retries", badge: "Queues", stat: "3.2ms latency" },
      "sa-log-aggregation": { desc: "Centralized logging pipeline, error tracking, and stack trace investigations", badge: "Logs", stat: "Elasticsearch" },
      "sa-dns-management": { desc: "Custom tenant vanity domains, DNS records, CNAME validation, and SSL certs", badge: "DNS", stat: "42 domains" },
      "sa-ssl-certificates": { desc: "Automated Let's Encrypt TLS certificate renewals and expiration warnings", badge: "TLS / SSL", stat: "All valid" },
      "sa-cache-management": { desc: "Redis cache memory usage, key eviction policies, and cache invalidation tools", badge: "Cache", stat: "Hit rate: 94%" },
      "sa-cdn-config": { desc: "Cloudflare edge caching rules, static asset compression, and DDoS thresholds", badge: "CDN Edge", stat: "Global" },
      "sa-database-admin": { desc: "PostgreSQL connection poolers, slow query analyzer, vacuum schedules, and indexes", badge: "Postgres", stat: "Pool: 18%" },
    },
    telemetry: [
      { name: "Primary PostgreSQL Database", status: "Operational", info: "Uptime: 99.99%" },
      { name: "Redis Cluster (Queues & Cache)", status: "Operational", info: "3.2ms latency" },
      { name: "BullMQ Job Workers", status: "Operational", info: "12 workers active" },
    ],
  },

  "sa-settings-grp": {
    title: "Platform Settings & Preferences",
    desc: "Global system configuration, security policies, multi-portal defaults, and dispatch rules.",
    icon: "Settings",
    kpis: [
      { label: "Portals Configured", value: "6 Live Portals", icon: "Settings", tone: "brand" },
      { label: "2FA Enforcement", value: "Enforced", icon: "ShieldCheck", tone: "success" },
      { label: "Default Currency", value: "INR (₹)", icon: "CreditCard", tone: "default" },
      { label: "Dispatch Policies", value: "Active", icon: "Bell", tone: "success" },
    ],
    childDescriptions: {
      "sa-settings-hub": { desc: "Master settings center for platform branding, global defaults, and localized parameters", badge: "Settings", stat: "Core" },
      "sa-security-center": { desc: "System-wide 2FA requirements, password strength policies, and session lockouts", badge: "Security", stat: "Enforced" },
      "sa-notification-preferences": { desc: "Default notification channels, email dispatch schedules, and quiet hours", badge: "Notifications", stat: "Configured" },
    },
    telemetry: [
      { name: "Global Settings Store", status: "Operational", info: "Synced" },
      { name: "Security Policy Validator", status: "Operational", info: "Enforced" },
    ],
  },
};

export function SuperAdminSectionDashboard({ sectionKey }: { sectionKey: string }) {
  const { navigate } = useNav();

  // Find the section in admin portal config
  const adminConfig = portalConfigs.admin;
  const allItems = adminConfig.sections.flatMap((s) => s.items);
  const currentItem = allItems.find((item) => item.key === sectionKey);

  const meta = SECTION_METADATA[sectionKey] || {
    title: currentItem?.label || "Section Dashboard",
    desc: "Overview and quick access to all modules and configurations in this domain.",
    icon: currentItem?.icon || "LayoutDashboard",
    kpis: [
      { label: "Total Modules", value: `${currentItem?.children?.length || 0} Modules`, icon: "Grid3x3", tone: "brand" },
      { label: "Operational Status", value: "Operational", icon: "CheckCircle2", tone: "success" },
      { label: "Platform Coverage", value: "100%", icon: "Activity", tone: "default" },
      { label: "System Health", value: "99.98%", icon: "ShieldCheck", tone: "success" },
    ],
  };

  const children: NavItem[] = currentItem?.children || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.title}
        description={meta.desc}
        icon={<Icon name={meta.icon} className="h-6 w-6 text-brand" />}
        actions={[
          {
            label: "Refresh Dashboard",
            variant: "outline",
            onClick: () => window.location.reload(),
          },
        ]}
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        {meta.kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            label={kpi.label}
            value={kpi.value}
            icon={<Icon name={kpi.icon} className="h-5 w-5" />}
            tone={kpi.tone || "default"}
          />
        ))}
      </div>

      {/* Grid of All Available Modules (from sub-sidebar) */}
      <SectionCard
        title="Available Modules & Controls"
        description="Select any capability below or from the sidebar sub-menu to configure"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => {
            const childMeta = meta.childDescriptions?.[child.key];
            const desc = childMeta?.desc || `Manage and oversee ${child.label} within the platform.`;
            const badge = childMeta?.badge || "Module";
            const stat = childMeta?.stat || "Operational";

            return (
              <button
                key={child.key}
                onClick={() => navigate("admin", child.key)}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 text-left transition-all hover:border-brand/40 hover:bg-brand/5 hover:shadow-xs cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                      <Icon name={child.icon} className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {badge}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors flex items-center justify-between">
                    <span>{child.label}</span>
                    <Icon
                      name="ArrowRight"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand"
                    />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                    {stat}
                  </span>
                  <span className="text-muted-foreground">Click to open &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Overview Telemetry & Activity Snapshot */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Domain Telemetry Snapshot" description="Real-time subsystem health & synchronization">
          <div className="space-y-3">
            {(meta.telemetry || [
              { name: "Service Ingestion Gateway", status: "Operational", info: "99.98% uptime" },
              { name: "Database Replication Stream", status: "Operational", info: "In sync" },
              { name: "Realtime Event Dispatcher", status: "Operational", info: "0 queue backlog" },
            ]).map((srv) => (
              <div key={srv.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${srv.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-medium text-foreground">{srv.name}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="font-semibold text-foreground">{srv.info}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity & Audit Trail" description="Recent administrative events in this domain">
          <div className="space-y-3">
            {(meta.auditTrail || [
              { action: `${meta.title} health audit completed`, user: "Automated System", time: "15m ago" },
              { action: "Operational parameters verified and synced", user: "Super Admin", time: "2h ago" },
              { action: "Weekly security baseline checks passed", user: "SecOps", time: "1d ago" },
            ]).map((audit, i) => (
              <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <div>
                  <p className="font-medium text-foreground">{audit.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">By {audit.user}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{audit.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

