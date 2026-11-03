"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
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
  icon: LucideIcon; color: string; tagline: string;
  steps: RegStep[];
}

// ============================================================
// REGISTRATION CONFIGS
// ============================================================

const REG_CONFIGS: Record<string, RoleRegConfig> = {
  candidate: {
    roleKey: "candidate", portal: "candidate", role: "candidate",
    label: "Candidate", icon: Users, color: "#0EA5E9",
    tagline: "Find jobs, learn & grow your career",
    steps: [
      {
        title: "Personal Information", subtitle: "Step 1 of 4 — Let's start with the basics",
        fields: [
          { name: "firstName", label: "First Name", type: "text", placeholder: "Priya", required: true, half: true, icon: Users },
          { name: "lastName", label: "Last Name", type: "text", placeholder: "Nair", required: true, half: true, icon: Users },
          { name: "email", label: "Email Address", type: "email", placeholder: "priya@gmail.com", required: true, icon: Mail },
          { name: "phone", label: "Mobile Number", type: "tel", placeholder: "+91 98765 43210", required: true, icon: Phone },
          { name: "dob", label: "Date of Birth", type: "date", half: true, icon: Calendar },
          { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Non-binary", "Prefer not to say"], half: true },
          { name: "country", label: "Country", type: "select", options: ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Singapore", "UAE", "Saudi Arabia", "Qatar", "Other"], required: true, icon: Globe },
          { name: "city", label: "City", type: "text", placeholder: "Bengaluru", required: true, half: true, icon: MapPin },
          { name: "timezone", label: "Timezone", type: "select", options: ["Asia/Kolkata (IST)", "America/New_York (EST)", "America/Los_Angeles (PST)", "Europe/London (GMT)", "Asia/Dubai (GST)", "Asia/Singapore (SGT)", "Other"], half: true, icon: Globe },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock, hint: "Use 8+ characters with letters, numbers & symbols" },
        ],
      },
      {
        title: "Professional Profile", subtitle: "Step 2 of 4 — Tell us about your experience",
        fields: [
          { name: "experience", label: "Years of Experience", type: "select", options: ["Fresher (0 years)", "1-2 years", "3-5 years", "6-10 years", "10+ years"], required: true, half: true, icon: Briefcase },
          { name: "currentRole", label: "Current / Last Job Title", type: "text", placeholder: "Software Engineer", half: true, icon: Briefcase },
          { name: "currentCompany", label: "Current / Last Company", type: "text", placeholder: "TechCorp India", half: true, icon: Building2 },
          { name: "industry", label: "Industry", type: "select", options: ["IT/SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Consulting", "Other"], half: true },
          { name: "skills", label: "Top Skills", type: "text", placeholder: "React, Node.js, Python, AWS...", required: true, icon: Zap, hint: "Comma-separated. Add at least 3 skills for better matching." },
          { name: "education", label: "Highest Qualification", type: "select", options: ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"], required: true, half: true },
          { name: "college", label: "College / University", type: "text", placeholder: "IIT Bombay", half: true },
          { name: "resume", label: "Upload Resume (PDF/DOC)", type: "file", placeholder: "Click to upload resume", icon: Upload, hint: "PDF, DOC, DOCX — max 5MB" },
        ],
      },
      {
        title: "Job Preferences", subtitle: "Step 3 of 4 — What are you looking for?",
        fields: [
          { name: "preferredRole", label: "Preferred Job Title", type: "text", placeholder: "Senior Frontend Engineer", required: true, half: true, icon: Briefcase },
          { name: "preferredLocation", label: "Preferred Work Location", type: "text", placeholder: "Bengaluru, Remote, USA...", required: true, half: true, icon: MapPin },
          { name: "workType", label: "Work Arrangement", type: "select", options: ["Remote only", "Hybrid", "On-site", "Open to all"], required: true, half: true },
          { name: "employmentType", label: "Employment Type", type: "select", options: ["Full-time", "Part-time", "Contract", "Internship", "Any"], required: true, half: true },
          { name: "expectedSalary", label: "Expected Salary (LPA)", type: "select", options: ["3-5 LPA", "5-8 LPA", "8-12 LPA", "12-18 LPA", "18-25 LPA", "25+ LPA", "Open"], half: true },
          { name: "noticePeriod", label: "Notice Period", type: "select", options: ["Immediate", "15 days", "30 days", "60 days", "90 days", "Currently serving"], half: true },
          { name: "relocate", label: "Willing to Relocate?", type: "select", options: ["Yes", "No", "Depends on offer"], half: true },
          { name: "jobAlerts", label: "Job Alert Frequency", type: "select", options: ["Daily", "Weekly", "Monthly", "No alerts"], half: true },
        ],
      },
      {
        title: "Review & Confirm", subtitle: "Step 4 of 4 — Almost done!",
        fields: [
          { name: "linkedin", label: "LinkedIn Profile (optional)", type: "text", placeholder: "https://linkedin.com/in/priyanair", half: true, icon: Globe },
          { name: "portfolio", label: "Portfolio Website (optional)", type: "text", placeholder: "https://priya.dev", half: true, icon: Globe },
          { name: "source", label: "How did you hear about us?", type: "select", options: ["Google Search", "LinkedIn", "Friend/Referral", "Social Media", "Event/Webinar", "Blog Article", "Other"], half: true },
          { name: "referralCode", label: "Referral Code (optional)", type: "text", placeholder: "JOBSONN-REF", half: true },
        ],
      },
    ],
  },
  employer: {
    roleKey: "employer", portal: "employer", role: "employer",
    label: "Employer", icon: Building2, color: "#8B5CF6",
    tagline: "Hire talent, manage L&D, enterprise",
    steps: [
      {
        title: "Company Information", subtitle: "Step 1 of 4 — Tell us about your organization",
        fields: [
          { name: "companyName", label: "Company Name", type: "text", placeholder: "TechCorp India Pvt Ltd", required: true, icon: Building2 },
          { name: "website", label: "Company Website", type: "text", placeholder: "https://techcorp.com", required: true, half: true, icon: Globe },
          { name: "industry", label: "Industry", type: "select", options: ["IT/SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Consulting", "Real Estate", "Logistics", "Other"], required: true, half: true },
          { name: "companySize", label: "Company Size", type: "select", options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"], required: true, half: true },
          { name: "founded", label: "Year Founded", type: "text", placeholder: "2018", half: true },
          { name: "fundingStage", label: "Funding Stage", type: "select", options: ["Bootstrapped", "Seed", "Series A", "Series B", "Series C+", "Public", "Not applicable"], half: true },
          { name: "country", label: "Country", type: "select", options: ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Singapore", "UAE", "Other"], required: true, icon: Globe },
          { name: "hqLocation", label: "HQ City", type: "text", placeholder: "Bengaluru", required: true, half: true, icon: MapPin },
          { name: "companyDescription", label: "Company Description (optional)", type: "textarea", placeholder: "Brief description of your company, culture & mission..." },
        ],
      },
      {
        title: "Account Administrator", subtitle: "Step 2 of 4 — Who will manage this account?",
        fields: [
          { name: "firstName", label: "Your Full Name", type: "text", placeholder: "Rohan Mehta", required: true, half: true, icon: Users },
          { name: "jobTitle", label: "Your Job Title", type: "text", placeholder: "Head of Talent Acquisition", required: true, half: true, icon: Briefcase },
          { name: "email", label: "Work Email", type: "email", placeholder: "rohan@techcorp.com", required: true, icon: Mail },
          { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true, icon: Phone },
          { name: "department", label: "Department", type: "select", options: ["HR / Talent Acquisition", "Engineering", "Operations", "Finance", "Leadership / C-Suite", "People & Culture", "Other"], required: true, half: true },
          { name: "decisionMaker", label: "Are you the hiring decision maker?", type: "select", options: ["Yes, I make hiring decisions", "No, I manage the process", "I influence decisions"], half: true },
          { name: "password", label: "Create Password", type: "password", placeholder: "Min 8 characters", required: true, icon: Lock },
        ],
      },
      {
        title: "Hiring Requirements", subtitle: "Step 3 of 4 — What roles are you hiring for?",
        fields: [
          { name: "monthlyHires", label: "Expected Monthly Hires", type: "select", options: ["1-5 hires/month", "6-10 hires/month", "11-25 hires/month", "26-50 hires/month", "50+ hires/month"], required: true, half: true, icon: Users },
          { name: "hiringUrgency", label: "Hiring Urgency", type: "select", options: ["Immediate (this month)", "Within 1-2 months", "Within 3-6 months", "Exploratory"], required: true, half: true },
          { name: "primaryRoles", label: "Primary Roles You're Hiring", type: "text", placeholder: "Software Engineer, Product Manager...", required: true, icon: Briefcase },
          { name: "salaryRange", label: "Typical Salary Range (LPA)", type: "select", options: ["3-6 LPA", "6-10 LPA", "10-15 LPA", "15-25 LPA", "25-40 LPA", "40+ LPA", "Varies by role"], half: true },
          { name: "annualBudget", label: "Annual Hiring Budget", type: "select", options: ["Under ₹5L", "₹5-10L", "₹10-25L", "₹25-50L", "₹50L+", "Not sure yet"], half: true },
          { name: "workArrangement", label: "Work Arrangement Offered", type: "select", options: ["Remote", "Hybrid", "On-site", "Mixed (varies by role)"], half: true },
          { name: "hiringChallenges", label: "Biggest Hiring Challenge", type: "select", options: ["Finding quality candidates", "Slow time-to-hire", "High offer drop-off", "Budget constraints", "Niche skill shortage", "Volume hiring"], half: true },
        ],
      },
      {
        title: "Review & Confirm", subtitle: "Step 4 of 4 — Final step!",
        fields: [
          { name: "gstNumber", label: "GST Number (for invoicing)", type: "text", placeholder: "29ABCDE1234F1Z5", half: true, icon: FileText },
          { name: "source", label: "How did you hear about us?", type: "select", options: ["Google Search", "LinkedIn", "Referral", "Event", "Sales Outreach", "Other"], half: true },
        ],
      },
    ],
  },
  recruiter: {
    roleKey: "recruiter", portal: "recruiter", role: "recruiter",
    label: "Recruiter / Agency", icon: Briefcase, color: "#F59E0B",
    tagline: "Source, submit & place talent",
    steps: [
      {
        title: "Agency Information", subtitle: "Step 1 of 3 — Tell us about your agency",
        fields: [
          { name: "agencyName", label: "Agency / Company Name", type: "text", placeholder: "TalentBridge Consulting", required: true, icon: Building2 },
          { name: "website", label: "Website", type: "text", placeholder: "https://talentbridge.in", half: true, icon: Globe },
          { name: "agencyType", label: "Agency Type", type: "select", options: ["Independent Recruiter", "Staffing Agency", "RPO Provider", "Executive Search Firm", "Freelance Recruiter", "Campus Recruiter"], required: true, half: true },
          { name: "specialization", label: "Primary Specialization", type: "select", options: ["IT / Software", "Finance & Banking", "Healthcare", "Manufacturing", "Sales & Marketing", "Generalist (all verticals)", "Other"], required: true, half: true },
          { name: "teamSize", label: "Recruitment Team Size", type: "select", options: ["Solo (just me)", "2-5 recruiters", "6-10 recruiters", "11-25 recruiters", "25+ recruiters"], required: true, half: true },
          { name: "yearsActive", label: "Years in Operation", type: "select", options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"], half: true },
          { name: "country", label: "Country", type: "select", options: ["India", "United States", "United Kingdom", "UAE", "Singapore", "Other"], required: true, icon: Globe },
          { name: "location", label: "Office City", type: "text", placeholder: "Hyderabad", required: true, half: true, icon: MapPin },
          { name: "gstNumber", label: "GST Number", type: "text", placeholder: "29ABCDE1234F1Z5", required: true, icon: FileText },
        ],
      },
      {
        title: "Primary Contact", subtitle: "Step 2 of 3 — Who is the main point of contact?",
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
        title: "Capabilities & Terms", subtitle: "Step 3 of 3 — What can your agency deliver?",
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
  training: {
    roleKey: "training", portal: "training", role: "platform_admin",
    label: "Training Organization", icon: GraduationCap, color: "#EF4444",
    tagline: "Deliver JOBSONN-certified training programs",
    steps: [
      {
        title: "Organization Information", subtitle: "Step 1 of 2 — Tell us about your organization",
        fields: [
          { name: "orgName", label: "Organization Name", type: "text", placeholder: "SkillForge Academy", required: true, icon: Building2 },
          { name: "website", label: "Website", type: "text", placeholder: "https://skillforge.academy", half: true, icon: Globe },
          { name: "orgType", label: "Organization Type", type: "select", options: ["Training Academy", "Corporate L&D Department", "University / College", "EdTech Company", "Independent Trainer", "NGO / Non-profit"], required: true, half: true },
          { name: "programs", label: "Programs Currently Offered", type: "text", placeholder: "Fullstack, Data Science, Cloud, AI/ML...", required: true, icon: GraduationCap },
          { name: "country", label: "Country", type: "select", options: ["India", "United States", "United Kingdom", "Other"], required: true, half: true, icon: Globe },
          { name: "location", label: "City", type: "text", placeholder: "Pune", required: true, half: true, icon: MapPin },
          { name: "studentsPerYear", label: "Students Trained Per Year", type: "select", options: ["1-50", "51-200", "201-500", "501-1000", "1000+"], required: true, half: true },
          { name: "infrastructure", label: "Infrastructure Available", type: "select", options: ["Classrooms only", "Classrooms + Computer Lab", "Online only", "Hybrid (Online + Physical)"], half: true },
        ],
      },
      {
        title: "Account Setup", subtitle: "Step 2 of 2 — Create your admin account",
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
  partner: {
    roleKey: "partner", portal: "partner", role: "employer",
    label: "Franchise Partner", icon: Handshake, color: "#10B981",
    tagline: "Build your business with JOBSONN",
    steps: [
      {
        title: "Partner Information", subtitle: "Step 1 of 2 — Tell us about your partnership interest",
        fields: [
          { name: "partnerName", label: "Partner / Organization Name", type: "text", placeholder: "Chennai Tech Academy", required: true, icon: Building2 },
          { name: "partnerType", label: "Partner Type", type: "select", options: ["Recruitment Partner", "Physical Centre Partner", "University Partner", "Training Partner"], required: true, icon: Handshake },
          { name: "country", label: "Country", type: "select", options: ["India", "United States", "UAE", "Saudi Arabia", "Singapore", "Other"], required: true, half: true, icon: Globe },
          { name: "location", label: "City", type: "text", placeholder: "Chennai", required: true, half: true, icon: MapPin },
          { name: "investmentCapacity", label: "Investment Capacity", type: "select", options: ["₹1-3 Lakhs", "₹3-5 Lakhs", "₹5-10 Lakhs", "₹10-15 Lakhs", "₹15 Lakhs+"], required: true, half: true },
          { name: "timeline", label: "Expected Start Timeline", type: "select", options: ["Within 30 days", "1-2 months", "3-6 months", "Exploring options"], half: true },
          { name: "existingBusiness", label: "Existing Business?", type: "select", options: ["Yes, running a training centre", "Yes, in different business", "No, starting fresh"], half: true },
          { name: "website", label: "Website (if any)", type: "text", placeholder: "https://youracademy.in", half: true, icon: Globe },
        ],
      },
      {
        title: "Contact Details", subtitle: "Step 2 of 2 — How can we reach you?",
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
  admin: {
    roleKey: "admin", portal: "admin", role: "platform_admin",
    label: "Platform Admin", icon: Crown, color: "#D4A017",
    tagline: "Platform administration & super admin",
    steps: [
      {
        title: "Admin Account Setup", subtitle: "Step 1 of 1 — Internal use only — requires authorization",
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
// REGISTRATION PAGE COMPONENT — Dark theme, centered card, reference design
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
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl">
          <p className="text-sm text-muted-foreground">Registration type not found.</p>
          <Button className="mt-4" onClick={() => navigate("public", "auth")}>Back to Sign In</Button>
        </div>
      </div>
    );
  }

  const currentStep = config.steps[step];
  const progress = ((step + 1) / config.steps.length) * 100;
  const RoleIcon = config.icon;
  const isLastStep = step === config.steps.length - 1;

  const setField = (name: string, value: string) => setData(prev => ({ ...prev, [name]: value }));

  const handleNext = () => {
    const missing = currentStep.fields.filter(f => f.required && !data[f.name]?.trim());
    if (missing.length > 0) {
      toast.error("Please fill all required fields", {
        description: `${missing.length} field(s) need attention: ${missing.map(f => f.label).join(", ")}`,
      });
      return;
    }
    if (step < config.steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (!agreed) {
        toast.error("Please accept the Terms to continue");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const userName = data.firstName
          ? `${data.firstName} ${data.lastName || ""}`.trim()
          : data.partnerName || data.companyName || config.label;
        const email = data.email || `${userName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@gmail.com`;
        const initials = userName.slice(0, 2).toUpperCase();

        login(config.role);
        useAuth.setState({
          user: {
            id: `u_${Date.now()}`,
            name: userName,
            email: email,
            role: config.role,
            avatar: initials,
          },
          isAuthenticated: true,
        });

        toast.success("Account created successfully!", {
          description: `Welcome to JOBSONN, ${userName}!`,
        });
        navigate("public", "home");
        setLoading(false);
      }, 1000);
    }
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="relative min-h-screen bg-grid flex flex-col justify-between overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] w-[800px] rounded-full bg-brand/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[350px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center" aria-label="JOBSONN home">
            <Image src="/jobsonn-logo.png" alt="JOBSONN" width={120} height={32} className="h-7 w-auto object-contain sm:h-8" priority />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">Already have an account?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("public", "auth")}
              className="h-8 gap-1.5 rounded-full border-border/80 px-3.5 text-xs font-semibold hover:border-brand/40 hover:bg-brand/5 hover:text-brand transition-all"
            >
              Sign in
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl transition-all">
          {/* Card Header */}
          <div className="border-b border-border/60 bg-muted/30 p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner ring-1 ring-white/10"
                  style={{ background: `${config.color}20`, color: config.color }}
                >
                  <RoleIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      Create {config.label} Account
                    </h1>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{currentStep.subtitle}</p>
                </div>
              </div>

              {/* Step indicator pill */}
              <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-background border border-border/70 px-3 py-1 shadow-xs">
                <span className="text-[11px] font-medium text-muted-foreground">Step</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: config.color }}>
                  {step + 1}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">of {config.steps.length}</span>
              </div>
            </div>

            {/* Step progress bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                <span className="text-foreground">{currentStep.title}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-400 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${config.color}, #10B981)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="p-6 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              {currentStep.fields.map((field) => {
                const isFullWidth = !field.half || field.type === "textarea";
                return (
                  <div
                    key={field.name}
                    className={cn(
                      isFullWidth ? "col-span-1 sm:col-span-2" : "col-span-1",
                      "space-y-1.5"
                    )}
                  >
                    <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      {field.icon && <field.icon className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span>{field.label}</span>
                      {field.required && <span className="text-rose-500 font-bold">*</span>}
                    </Label>

                    {field.type === "select" ? (
                      <Select value={data[field.name] || ""} onValueChange={(v) => setField(field.name, v)}>
                        <SelectTrigger className="h-10 w-full rounded-lg border-border/80 bg-background/80 text-sm hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all">
                          <SelectValue placeholder={field.placeholder || "Select an option..."} />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-popover text-popover-foreground">
                          {field.options?.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-xs hover:bg-muted cursor-pointer">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={data[field.name] || ""}
                        onChange={(e) => setField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={3}
                        className="w-full rounded-lg border border-border/80 bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                      />
                    ) : field.type === "file" ? (
                      <label className="flex items-center gap-2.5 rounded-lg border border-dashed border-border/90 bg-muted/20 px-3.5 py-2.5 text-xs text-muted-foreground cursor-pointer hover:border-brand/60 hover:bg-brand/5 transition-all group">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1 truncate font-medium text-foreground">
                          {data[field.name] || field.placeholder || "Click to upload file"}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-medium">Browse</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setField(field.name, e.target.files?.[0]?.name || "")}
                        />
                      </label>
                    ) : field.type === "password" ? (
                      <div className="relative">
                        <Input
                          type={showPwd ? "text" : "password"}
                          value={data[field.name] || ""}
                          onChange={(e) => setField(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="h-10 rounded-lg border-border/80 bg-background/80 pr-10 text-sm hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                          aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                          {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        value={data[field.name] || ""}
                        onChange={(e) => setField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="h-10 rounded-lg border-border/80 bg-background/80 text-sm hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    )}
                    {field.hint && <p className="text-[10px] text-muted-foreground">{field.hint}</p>}
                  </div>
                );
              })}
            </div>

            {/* Terms Checkbox on Last Step */}
            {isLastStep && (
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none">
                  I agree to the{" "}
                  <button type="button" onClick={() => navigate("public", "terms")} className="font-semibold text-brand hover:underline">
                    Terms of Service
                  </button>
                  ,{" "}
                  <button type="button" onClick={() => navigate("public", "privacy")} className="font-semibold text-brand hover:underline">
                    Privacy Policy
                  </button>{" "}
                  and consent to data processing under the DPDP Act 2023. I confirm all provided information is accurate.
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-5 rounded-lg border-border font-medium text-xs sm:text-sm gap-1.5 hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 h-11 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                disabled={loading || (isLastStep && !agreed)}
                style={{
                  background: `linear-gradient(135deg, ${config.color}, #059669)`,
                }}
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
          </div>
        </div>

        {/* Cross-Role Navigation */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">Looking to register as someone else?</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {Object.values(REG_CONFIGS).map((r) => {
              const isCurrent = r.roleKey === roleKey;
              return (
                <button
                  key={r.roleKey}
                  onClick={() => navigate("public", `register/${r.roleKey}`)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                    isCurrent
                      ? "border-brand bg-brand/10 text-brand font-semibold shadow-xs"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-brand/40 hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <r.icon className="h-3 w-3" style={{ color: r.color }} />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <footer className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-muted-foreground pb-4">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> DPDP Act 2023 Compliant</span>
          <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-blue-500" /> 256-bit SSL Encrypted</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Free to Register</span>
        </footer>
      </main>
    </div>
  );
}
