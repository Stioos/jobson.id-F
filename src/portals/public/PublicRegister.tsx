"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/common";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, ShieldCheck, Users, Building2,
  GraduationCap, Briefcase, Handshake, CheckCircle2,
  Lock, Crown, Mail, Phone, Globe, MapPin, Calendar,
  FileText, Upload, Eye, EyeOff, Sparkles, TrendingUp,
  Award, Zap, type LucideIcon,
} from "lucide-react";
import type { Portal, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface RegField {
  name: string; label: string; type: "text" | "email" | "password" | "tel" | "select" | "date" | "textarea" | "file";
  placeholder?: string; required?: boolean; options?: string[]; half?: boolean;
  icon?: LucideIcon; hint?: string;
}
interface RegStep { title: string; subtitle: string; fields: RegField[]; }
interface RoleRegConfig {
  roleKey: string; portal: Portal; role: UserRole; label: string;
  icon: LucideIcon; color: string; tagline: string; benefits: { icon: LucideIcon; title: string; desc: string }[];
  steps: RegStep[];
}

// ============================================================
// REGISTRATION CONFIGS — unique, professional, detailed
// ============================================================

const REG_CONFIGS: Record<string, RoleRegConfig> = {
  // ───────────── CANDIDATE ─────────────
  candidate: {
    roleKey: "candidate", portal: "candidate", role: "candidate",
    label: "Candidate", icon: Users, color: "#0EA5E9",
    tagline: "Find jobs, learn & grow your career",
    benefits: [
      { icon: Briefcase, title: "50,000+ Live Jobs", desc: "Access active roles from 12,000+ hiring companies across India." },
      { icon: Sparkles, title: "AI-Powered Matching", desc: "Smart matching surfaces roles where you're a top-fit candidate." },
      { icon: GraduationCap, title: "Free Training & Upskilling", desc: "Access training programs, certifications & career resources." },
      { icon: ShieldCheck, title: "Privacy-First", desc: "DPDP-compliant. Control who sees your profile & contact info." },
    ],
    steps: [
      {
        title: "Personal Information", subtitle: "Let's start with the basics",
        fields: [
          { name: "firstName", label: "First Name", type: "text", placeholder: "Priya", required: true, half: true, icon: Users },
          { name: "lastName", label: "Last Name", type: "text", placeholder: "Nair", required: true, half: true, icon: Users },
          { name: "email", label: "Email Address", type: "email", placeholder: "priya@gmail.com", required: true, icon: Mail, hint: "We'll send job alerts & updates here" },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "dob", label: "Date of Birth", type: "date", half: true, icon: Calendar },
          { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Non-binary", "Prefer not to say"], half: true },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock, hint: "Use 8+ characters with letters, numbers & symbols" },
        ],
      },
      {
        title: "Professional Profile", subtitle: "Tell us about your experience",
        fields: [
          { name: "experience", label: "Years of Experience", type: "select", options: ["Fresher (0 years)", "1-2 years", "3-5 years", "6-10 years", "10+ years"], required: true, half: true, icon: Briefcase },
          { name: "currentRole", label: "Current / Last Job Title", type: "text", placeholder: "Software Engineer", half: true, icon: Briefcase },
          { name: "currentCompany", label: "Current / Last Company", type: "text", placeholder: "TechCorp India", half: true, icon: Building2 },
          { name: "industry", label: "Industry", type: "select", options: ["IT/SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Consulting", "Other"], half: true },
          { name: "skills", label: "Top Skills", type: "text", placeholder: "React, Node.js, Python, AWS...", required: true, icon: Zap, hint: "Comma-separated. Add at least 3 skills for better matching." },
          { name: "education", label: "Highest Qualification", type: "select", options: ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"], required: true, half: true },
          { name: "college", label: "College / University", type: "text", placeholder: "IIT Bombay", half: true },
          { name: "resume", label: "Upload Resume (PDF/DOC)", type: "file", placeholder: "Click to upload", icon: Upload, hint: "PDF, DOC, DOCX — max 5MB" },
        ],
      },
      {
        title: "Job Preferences", subtitle: "What are you looking for?",
        fields: [
          { name: "preferredRole", label: "Preferred Job Title", type: "text", placeholder: "Senior Frontend Engineer", required: true, half: true, icon: Briefcase },
          { name: "preferredLocation", label: "Preferred Work Location", type: "text", placeholder: "Bengaluru, Mumbai, Remote", required: true, half: true, icon: MapPin },
          { name: "workType", label: "Work Arrangement", type: "select", options: ["Remote only", "Hybrid", "On-site", "Open to all"], required: true, half: true },
          { name: "employmentType", label: "Employment Type", type: "select", options: ["Full-time", "Part-time", "Contract", "Internship", "Any"], required: true, half: true },
          { name: "expectedSalary", label: "Expected Salary (LPA)", type: "select", options: ["3-5 LPA", "5-8 LPA", "8-12 LPA", "12-18 LPA", "18-25 LPA", "25+ LPA", "Open"], half: true },
          { name: "noticePeriod", label: "Notice Period", type: "select", options: ["Immediate", "15 days", "30 days", "60 days", "90 days", "Currently serving"], half: true },
          { name: "relocate", label: "Willing to Relocate?", type: "select", options: ["Yes", "No", "Depends on offer"], half: true },
          { name: "jobAlerts", label: "Job Alert Frequency", type: "select", options: ["Daily", "Weekly", "Monthly", "No alerts"], half: true },
        ],
      },
      {
        title: "Review & Confirm", subtitle: "Almost done!",
        fields: [
          { name: "linkedin", label: "LinkedIn Profile (optional)", type: "text", placeholder: "https://linkedin.com/in/priyanair", half: true, icon: Globe },
          { name: "portfolio", label: "Portfolio Website (optional)", type: "text", placeholder: "https://priya.dev", half: true, icon: Globe },
          { name: "source", label: "How did you hear about us?", type: "select", options: ["Google Search", "LinkedIn", "Friend/Referral", "Social Media", "Event/Webinar", "Blog Article", "Other"], half: true },
          { name: "referralCode", label: "Referral Code (optional)", type: "text", placeholder: "JOBSONN-REF", half: true },
        ],
      },
    ],
  },

  // ───────────── EMPLOYER ─────────────
  employer: {
    roleKey: "employer", portal: "employer", role: "employer",
    label: "Employer", icon: Building2, color: "#8B5CF6",
    tagline: "Hire talent, manage L&D, enterprise",
    benefits: [
      { icon: Users, title: "2M+ Verified Candidates", desc: "Access India's largest verified talent pool with AI-powered matching." },
      { icon: Zap, title: "AI-Assisted Hiring", desc: "Smart JD generation, bias-check, pipeline management & structured screening." },
      { icon: ShieldCheck, title: "Enterprise-Grade Security", desc: "DPDP-compliant, SOC 2 ready, role-based access control & audit logs." },
      { icon: TrendingUp, title: "98% Placement Success", desc: "Hire from our trained cohorts or source directly — 96% 1-year retention." },
    ],
    steps: [
      {
        title: "Company Information", subtitle: "Tell us about your organization",
        fields: [
          { name: "companyName", label: "Company Name", type: "text", placeholder: "TechCorp India Pvt Ltd", required: true, icon: Building2 },
          { name: "website", label: "Company Website", type: "text", placeholder: "https://techcorp.com", required: true, half: true, icon: Globe },
          { name: "industry", label: "Industry", type: "select", options: ["IT/SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Consulting", "Real Estate", "Logistics", "Other"], required: true, half: true },
          { name: "companySize", label: "Company Size", type: "select", options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"], required: true, half: true },
          { name: "founded", label: "Year Founded", type: "text", placeholder: "2018", half: true },
          { name: "fundingStage", label: "Funding Stage", type: "select", options: ["Bootstrapped", "Seed", "Series A", "Series B", "Series C+", "Public", "Not applicable"], half: true },
          { name: "hqLocation", label: "HQ Location", type: "text", placeholder: "Bengaluru, Karnataka, India", required: true, icon: MapPin },
          { name: "companyDescription", label: "Company Description (optional)", type: "textarea", placeholder: "Brief description of your company, culture & mission...", hint: "This helps candidates understand your company better" },
        ],
      },
      {
        title: "Account Administrator", subtitle: "Who will manage this account?",
        fields: [
          { name: "firstName", label: "Your Full Name", type: "text", placeholder: "Rohan Mehta", required: true, half: true, icon: Users },
          { name: "jobTitle", label: "Your Job Title", type: "text", placeholder: "Head of Talent Acquisition", required: true, half: true, icon: Briefcase },
          { name: "email", label: "Work Email", type: "email", placeholder: "rohan@techcorp.com", required: true, icon: Mail, hint: "Use your company email for verification" },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "department", label: "Department", type: "select", options: ["HR / Talent Acquisition", "Engineering", "Operations", "Finance", "Leadership / C-Suite", "People & Culture", "Other"], required: true, half: true },
          { name: "decisionMaker", label: "Are you the hiring decision maker?", type: "select", options: ["Yes, I make hiring decisions", "No, I manage the process", "I influence decisions"], half: true },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock },
        ],
      },
      {
        title: "Hiring Requirements", subtitle: "What roles are you hiring for?",
        fields: [
          { name: "monthlyHires", label: "Expected Monthly Hires", type: "select", options: ["1-5 hires/month", "6-10 hires/month", "11-25 hires/month", "26-50 hires/month", "50+ hires/month"], required: true, half: true, icon: Users },
          { name: "hiringUrgency", label: "Hiring Urgency", type: "select", options: ["Immediate (this month)", "Within 1-2 months", "Within 3-6 months", "Exploratory"], required: true, half: true },
          { name: "primaryRoles", label: "Primary Roles You're Hiring", type: "text", placeholder: "Software Engineer, Product Manager, Data Analyst...", required: true, icon: Briefcase, hint: "Comma-separated role titles" },
          { name: "salaryRange", label: "Typical Salary Range (LPA)", type: "select", options: ["3-6 LPA", "6-10 LPA", "10-15 LPA", "15-25 LPA", "25-40 LPA", "40+ LPA", "Varies by role"], half: true },
          { name: "annualBudget", label: "Annual Hiring Budget", type: "select", options: ["Under ₹5L", "₹5-10L", "₹10-25L", "₹25-50L", "₹50L+", "Not sure yet"], half: true },
          { name: "workArrangement", label: "Work Arrangement Offered", type: "select", options: ["Remote", "Hybrid", "On-site", "Mixed (varies by role)"], half: true },
          { name: "hiringChallenges", label: "Biggest Hiring Challenge", type: "select", options: ["Finding quality candidates", "Slow time-to-hire", "High offer drop-off", "Budget constraints", "Niche skill shortage", "Volume hiring"], half: true },
        ],
      },
      {
        title: "Review & Confirm", subtitle: "Final step!",
        fields: [
          { name: "gstNumber", label: "GST Number (for invoicing)", type: "text", placeholder: "29ABCDE1234F1Z5", half: true },
          { name: "source", label: "How did you hear about us?", type: "select", options: ["Google Search", "LinkedIn", "Referral", "Event", "Sales Outreach", "Other"], half: true },
        ],
      },
    ],
  },

  // ───────────── RECRUITER / AGENCY ─────────────
  recruiter: {
    roleKey: "recruiter", portal: "recruiter", role: "recruiter",
    label: "Recruiter / Agency", icon: Briefcase, color: "#F59E0B",
    tagline: "Source, submit & place talent",
    benefits: [
      { icon: Users, title: "Manage Multiple Clients", desc: "Handle requisitions for multiple employers from one dashboard." },
      { icon: TrendingUp, title: "Transparent Commissions", desc: "Track every submission, placement & commission in real-time." },
      { icon: ShieldCheck, title: "Split Placement Support", desc: "Collaborate with other agencies with transparent split tracking." },
      { icon: Zap, title: "AI-Powered Sourcing", desc: "Access our 2M+ candidate pool with AI matching for faster placements." },
    ],
    steps: [
      {
        title: "Agency Information", subtitle: "Tell us about your agency",
        fields: [
          { name: "agencyName", label: "Agency / Company Name", type: "text", placeholder: "TalentBridge Consulting", required: true, icon: Building2 },
          { name: "website", label: "Website", type: "text", placeholder: "https://talentbridge.in", half: true, icon: Globe },
          { name: "agencyType", label: "Agency Type", type: "select", options: ["Independent Recruiter", "Staffing Agency", "RPO Provider", "Executive Search Firm", "Freelance Recruiter", "Campus Recruiter"], required: true, half: true },
          { name: "specialization", label: "Primary Specialization", type: "select", options: ["IT / Software", "Finance & Banking", "Healthcare", "Manufacturing", "Sales & Marketing", "Generalist (all verticals)", "Other"], required: true, half: true },
          { name: "teamSize", label: "Recruitment Team Size", type: "select", options: ["Solo (just me)", "2-5 recruiters", "6-10 recruiters", "11-25 recruiters", "25+ recruiters"], required: true, half: true },
          { name: "yearsActive", label: "Years in Operation", type: "select", options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"], half: true },
          { name: "location", label: "Office Location", type: "text", placeholder: "Hyderabad, Telangana, India", required: true, icon: MapPin },
          { name: "gstNumber", label: "GST Number", type: "text", placeholder: "29ABCDE1234F1Z5", required: true, icon: FileText },
        ],
      },
      {
        title: "Primary Contact", subtitle: "Who is the main point of contact?",
        fields: [
          { name: "firstName", label: "Your Name", type: "text", placeholder: "Sneha Reddy", required: true, half: true, icon: Users },
          { name: "designation", label: "Your Designation", type: "text", placeholder: "Senior Recruiter / Founder", required: true, half: true, icon: Briefcase },
          { name: "email", label: "Work Email", type: "email", placeholder: "sneha@talentbridge.in", required: true, icon: Mail },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "panNumber", label: "PAN Number", type: "text", placeholder: "ABCDE1234F", half: true, icon: FileText },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock },
        ],
      },
      {
        title: "Capabilities & Terms", subtitle: "What can your agency deliver?",
        fields: [
          { name: "monthlySubmissions", label: "Monthly Candidate Submissions", type: "select", options: ["1-10", "11-25", "26-50", "51-100", "100+"], required: true, half: true },
          { name: "monthlyPlacements", label: "Average Monthly Placements", type: "select", options: ["1-3", "4-10", "11-25", "26-50", "50+"], half: true },
          { name: "verticals", label: "Verticals You Serve", type: "text", placeholder: "IT, Finance, Healthcare, Sales...", required: true, icon: Briefcase },
          { name: "commissionModel", label: "Preferred Commission Model", type: "select", options: ["8.33% CTC (1 month)", "10% CTC", "15% CTC", "Fixed per hire", "Retained + Success Fee", "Flexible"], required: true, half: true },
          { name: "replacementPeriod", label: "Replacement Guarantee Period", type: "select", options: ["30 days", "60 days", "90 days", "No replacement guarantee"], half: true },
          { name: "atsUsed", label: "ATS / Tools You Use", type: "text", placeholder: "Naukri, LinkedIn Recruiter, Zoho...", half: true },
        ],
      },
    ],
  },

  // ───────────── TRAINING ─────────────
  training: {
    roleKey: "training", portal: "training", role: "platform_admin",
    label: "Training Organization", icon: GraduationCap, color: "#EF4444",
    tagline: "Deliver JOBSONN-certified training programs",
    benefits: [
      { icon: Award, title: "JOBSONN-Certified Programs", desc: "Deliver our 5 flagship programs — FDE, DSAI, CDM, GAA & more." },
      { icon: Users, title: "Built-in Student Pipeline", desc: "Get students from our enrolment pipeline — no marketing needed." },
      { icon: TrendingUp, title: "Placement Tracking", desc: "Track every student's placement journey with real-time dashboards." },
      { icon: ShieldCheck, title: "Revenue Sharing", desc: "Earn 60-70% of training fees plus placement commission." },
    ],
    steps: [
      {
        title: "Organization Information", subtitle: "Tell us about your training organization",
        fields: [
          { name: "orgName", label: "Organization Name", type: "text", placeholder: "SkillForge Academy", required: true, icon: Building2 },
          { name: "website", label: "Website", type: "text", placeholder: "https://skillforge.academy", half: true, icon: Globe },
          { name: "orgType", label: "Organization Type", type: "select", options: ["Training Academy", "Corporate L&D Department", "University / College", "EdTech Company", "Independent Trainer", "NGO / Non-profit"], required: true, half: true },
          { name: "programs", label: "Programs Currently Offered", type: "text", placeholder: "Fullstack, Data Science, Cloud, AI/ML...", required: true, icon: GraduationCap },
          { name: "location", label: "Primary Location", type: "text", placeholder: "Pune, Maharashtra, India", required: true, half: true, icon: MapPin },
          { name: "studentsPerYear", label: "Students Trained Per Year", type: "select", options: ["1-50", "51-200", "201-500", "501-1000", "1000+"], required: true, half: true },
          { name: "infrastructure", label: "Infrastructure Available", type: "select", options: ["Classrooms only", "Classrooms + Computer Lab", "Online only", "Hybrid (Online + Physical)"], half: true },
          { name: "accreditation", label: "Accreditation / Affiliation", type: "text", placeholder: "NSDC, AICTE, UGC...", half: true },
        ],
      },
      {
        title: "Account Setup", subtitle: "Create your admin account",
        fields: [
          { name: "firstName", label: "Your Name", type: "text", placeholder: "Divya Sharma", required: true, half: true, icon: Users },
          { name: "role", label: "Your Role", type: "text", placeholder: "Director / Head of Training", required: true, half: true, icon: Briefcase },
          { name: "email", label: "Work Email", type: "email", placeholder: "divya@skillforge.academy", required: true, icon: Mail },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "gstNumber", label: "GST Number", type: "text", placeholder: "27ABCDE1234F1Z5", half: true, icon: FileText },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock },
        ],
      },
    ],
  },

  // ───────────── PARTNER ─────────────
  partner: {
    roleKey: "partner", portal: "partner", role: "employer",
    label: "Franchise Partner", icon: Handshake, color: "#10B981",
    tagline: "Build your business with JOBSONN",
    benefits: [
      { icon: Building2, title: "Established Brand", desc: "Leverage the JOBSONN brand, curriculum & placement network." },
      { icon: TrendingUp, title: "Multiple Revenue Streams", desc: "Training fees, assessment fees, placement commission & more." },
      { icon: ShieldCheck, title: "Exclusive Territory", desc: "Get exclusive rights to operate in your city/zone." },
      { icon: Users, title: "Full Support", desc: "Curriculum, trainer training, marketing & operational guidance." },
    ],
    steps: [
      {
        title: "Partner Information", subtitle: "Tell us about your partnership interest",
        fields: [
          { name: "partnerName", label: "Partner / Organization Name", type: "text", placeholder: "Chennai Tech Academy", required: true, icon: Building2 },
          { name: "partnerType", label: "Partner Type", type: "select", options: ["Recruitment Partner", "Physical Centre Partner", "University Partner", "Training Partner"], required: true, icon: Handshake },
          { name: "location", label: "City / Location", type: "text", placeholder: "Chennai, Tamil Nadu, India", required: true, half: true, icon: MapPin },
          { name: "investmentCapacity", label: "Investment Capacity", type: "select", options: ["₹1-3 Lakhs", "₹3-5 Lakhs", "₹5-10 Lakhs", "₹10-15 Lakhs", "₹15 Lakhs+"], required: true, half: true },
          { name: "website", label: "Website (if any)", type: "text", placeholder: "https://youracademy.in", half: true, icon: Globe },
          { name: "existingBusiness", label: "Existing Business?", type: "select", options: ["Yes, running a training centre", "Yes, in different business", "No, starting fresh"], half: true },
          { name: "infrastructure", label: "Infrastructure Available", type: "select", options: ["Own premises (1500+ sq ft)", "Rented premises", "Co-working space", "Need help finding space"], half: true },
          { name: "timeline", label: "Expected Start Timeline", type: "select", options: ["Within 30 days", "1-2 months", "3-6 months", "Exploring options"], half: true },
        ],
      },
      {
        title: "Contact Details", subtitle: "How can we reach you?",
        fields: [
          { name: "firstName", label: "Your Name", type: "text", placeholder: "Rajesh Kumar", required: true, half: true, icon: Users },
          { name: "designation", label: "Your Designation", type: "text", placeholder: "Director / Proprietor", required: true, half: true, icon: Briefcase },
          { name: "email", label: "Email Address", type: "email", placeholder: "rajesh@youracademy.in", required: true, icon: Mail },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "gstNumber", label: "GST Number", type: "text", placeholder: "33ABCDE1234F1Z5", half: true, icon: FileText },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock },
        ],
      },
    ],
  },

  // ───────────── ADMIN ─────────────
  admin: {
    roleKey: "admin", portal: "admin", role: "platform_admin",
    label: "Platform Admin", icon: Crown, color: "#D4A017",
    tagline: "Platform administration & super admin",
    benefits: [
      { icon: ShieldCheck, title: "Full Platform Access", desc: "Manage users, employers, candidates, payments & more." },
      { icon: Lock, title: "Role-Based Access", desc: "Granular permissions — Super Admin, Operations, Support, Finance." },
      { icon: TrendingUp, title: "Real-Time Analytics", desc: "Platform-wide dashboards, revenue tracking & audit logs." },
      { icon: Users, title: "User Management", desc: "Approve, suspend, verify & manage all platform users." },
    ],
    steps: [
      {
        title: "Admin Account Setup", subtitle: "Internal use only — requires authorization",
        fields: [
          { name: "firstName", label: "Full Name", type: "text", placeholder: "Admin User", required: true, half: true, icon: Users },
          { name: "employeeId", label: "Employee ID", type: "text", placeholder: "JOBSONN-001", required: true, half: true, icon: FileText },
          { name: "email", label: "Official Email", type: "email", placeholder: "admin@jobsonn.com", required: true, icon: Mail },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "department", label: "Department", type: "select", options: ["Operations", "Engineering", "Sales", "Support", "Finance", "Leadership", "HR"], required: true, half: true },
          { name: "accessLevel", label: "Access Level Requested", type: "select", options: ["Super Admin", "Operations Admin", "Support Admin", "Finance Admin", "Read-Only Auditor"], required: true, icon: Lock },
          { name: "managerEmail", label: "Reporting Manager's Email", type: "email", placeholder: "manager@jobsonn.com", required: true, half: true, icon: Mail },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 12 characters", required: true, icon: Lock, hint: "Admin passwords must be 12+ characters with special characters" },
        ],
      },
    ],
  },
};

// ============================================================
// REGISTRATION PAGE COMPONENT
// ============================================================

export function PublicRegister({ roleKey }: { roleKey: string }) {
  const { navigate } = useNav();
  const { login } = useAuth();
  const config = REG_CONFIGS[roleKey];
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [showPwd, setShowPwd] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);

  if (!config) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Registration type not found.</p>
        <Button className="mt-4" onClick={() => navigate("public", "partner-login")}>Back to Sign In</Button>
      </div>
    );
  }

  const currentStep = config.steps[step];
  const progress = ((step + 1) / config.steps.length) * 100;
  const RoleIcon = config.icon;

  const setField = (name: string, value: string) => setData(prev => ({ ...prev, [name]: value }));

  const handleNext = () => {
    const missing = currentStep.fields.filter(f => f.required && !data[f.name]?.trim());
    if (missing.length > 0) {
      toast.error("Please fill all required fields", { description: `${missing.length} field(s) need attention: ${missing.map(f => f.label).join(", ")}` });
      return;
    }
    if (step < config.steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (!agreed) {
        toast.error("Please accept the Terms of Service to continue");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        login(config.role);
        toast.success("Account created successfully!", {
          description: `Welcome to JOBSONN, ${data.firstName || "there"}! Redirecting to your dashboard...`,
        });
        navigate(config.portal, "overview");
        setLoading(false);
      }, 1200);
    }
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const isLastStep = step === config.steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 via-background to-background">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={() => navigate("public", "home")} className="flex items-center" aria-label="JOBSONN home">
            <Image src="/jobsonn-logo.png" alt="JOBSONN" width={120} height={32} className="h-7 w-auto object-contain sm:h-8" priority />
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("public", "partner-login")}>
            Sign In
          </Button>
        </header>

        {/* Main split layout */}
        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* LEFT: brand + benefits + trust */}
          <div className="hidden flex-col justify-center lg:flex">
            {/* Role badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ borderColor: `${config.color}40`, background: `${config.color}10`, color: config.color }}>
              <RoleIcon className="h-4 w-4" /> {config.label} Registration
            </div>

            {/* Headline */}
            <h1 className="mt-5 text-3xl font-bold tracking-tight lg:text-4xl">
              Create your <span style={{ color: config.color }}>{config.label}</span> account
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground">{config.tagline}</p>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {config.benefits.map((b) => {
                const BIcon = b.icon;
                return (
                  <div key={b.title} className="flex flex-col gap-1.5 rounded-xl border bg-card/60 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${config.color}15`, color: config.color }}>
                      <BIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold">{b.title}</h3>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-brand" /> DPDP Compliant</span>
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-brand" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-brand" /> Free to Register</span>
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-brand" /> SOC 2 Ready</span>
            </div>
          </div>

          {/* RIGHT: registration form card */}
          <div className="mx-auto w-full max-w-lg">
            <Card className="border-border/60 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                {/* Role icon + title */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${config.color}18`, color: config.color }}>
                    <RoleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{config.label} Registration</h2>
                    <p className="text-[11px] text-muted-foreground">{config.tagline}</p>
                  </div>
                </div>

                {/* Progress bar with step indicators */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-foreground">
                      Step {step + 1} of {config.steps.length}
                    </span>
                    <span className="font-medium text-muted-foreground">{Math.round(progress)}% complete</span>
                  </div>
                  {/* Step dots */}
                  <div className="mb-2 flex items-center gap-1.5">
                    {config.steps.map((s, i) => (
                      <React.Fragment key={i}>
                        <div
                          className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all", i < step ? "bg-brand text-brand-foreground" : i === step ? "text-white" : "bg-muted text-muted-foreground")}
                          style={i === step ? { background: config.color } : {}}
                        >
                          {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        {i < config.steps.length - 1 && (
                          <div className={cn("h-0.5 flex-1 rounded-full transition-all", i < step ? "bg-brand" : "bg-muted")} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Step title */}
                  <h3 className="text-sm font-bold">{currentStep.title}</h3>
                  <p className="text-[11px] text-muted-foreground">{currentStep.subtitle}</p>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  {currentStep.fields.map((field) => (
                    <div key={field.name} className={cn(field.half && "grid grid-cols-2 gap-3")}>
                      {field.half && <div />}
                      <div className={cn("space-y-1", field.half && "col-span-1")}>
                        <Label className="flex items-center gap-1 text-[11px] font-medium">
                          {field.icon && <field.icon className="h-3 w-3 text-muted-foreground" />}
                          {field.label}
                          {field.required && <span className="text-rose-500">*</span>}
                        </Label>
                        {field.type === "select" ? (
                          <Select value={data[field.name] || ""} onValueChange={(v) => setField(field.name, v)}>
                            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={field.placeholder || "Select..."} /></SelectTrigger>
                            <SelectContent>
                              {field.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={data[field.name] || ""}
                            onChange={(e) => setField(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={3}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        ) : field.type === "file" ? (
                          <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground cursor-pointer hover:border-brand/50 hover:bg-brand/5 transition-all">
                            <Upload className="h-4 w-4" />
                            <span>{field.placeholder || "Click to upload"}</span>
                            <input type="file" className="hidden" onChange={(e) => setField(field.name, e.target.files?.[0]?.name || "")} />
                          </div>
                        ) : field.type === "password" ? (
                          <div className="relative">
                            <Input
                              type={showPwd ? "text" : "password"}
                              value={data[field.name] || ""}
                              onChange={(e) => setField(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="h-9 pr-8 text-sm"
                            />
                            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <Input
                            type={field.type}
                            value={data[field.name] || ""}
                            onChange={(e) => setField(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="h-9 text-sm"
                          />
                        )}
                        {field.hint && <p className="text-[10px] text-muted-foreground">{field.hint}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terms checkbox on last step */}
                {isLastStep && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
                    <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded border-border" />
                    <label htmlFor="terms" className="text-[10px] leading-relaxed text-muted-foreground">
                      I agree to the <button type="button" onClick={() => navigate("public", "terms")} className="font-medium text-brand hover:underline">Terms of Service</button>, <button type="button" onClick={() => navigate("public", "privacy")} className="font-medium text-brand hover:underline">Privacy Policy</button> and consent to data processing under DPDP Act 2023. I confirm all information provided is accurate.
                    </label>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-5 flex gap-2">
                  {step > 0 && (
                    <Button type="button" variant="outline" onClick={handleBack} className="gap-1.5 h-10 text-sm">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 gap-1.5 h-10 text-sm"
                    disabled={loading || (isLastStep && !agreed)}
                    style={{ background: config.color }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </span>
                    ) : isLastStep ? (
                      <>Create {config.label} Account <CheckCircle2 className="h-4 w-4" /></>
                    ) : (
                      <>Continue <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>

                {/* Sign in link */}
                <div className="mt-4 border-t pt-3 text-center text-[11px] text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => navigate("public", "partner-login")} className="font-medium text-brand hover:underline">
                    Sign in
                  </button>
                </div>

                {/* Other registration links */}
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {Object.values(REG_CONFIGS).filter(r => r.roleKey !== roleKey).map(r => (
                    <button
                      key={r.roleKey}
                      onClick={() => { navigate("public", `register/${r.roleKey}`); }}
                      className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[9px] font-medium text-muted-foreground transition-all hover:border-brand hover:text-brand"
                    >
                      <r.icon className="h-2.5 w-2.5" style={{ color: r.color }} />
                      {r.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
