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
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, ShieldCheck, Users, Building2,
  GraduationCap, Briefcase, Handshake, CheckCircle2,
  Lock, Crown, type LucideIcon,
} from "lucide-react";
import type { Portal, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RegField {
  name: string; label: string; type: "text" | "email" | "password" | "tel" | "select" | "date";
  placeholder?: string; required?: boolean; options?: string[]; half?: boolean;
}
interface RegStep { title: string; fields: RegField[]; }
interface RoleRegConfig {
  roleKey: string; portal: Portal; role: UserRole; label: string;
  icon: LucideIcon; color: string; tagline: string; steps: RegStep[];
}

const REG_CONFIGS: Record<string, RoleRegConfig> = {
  candidate: {
    roleKey: "candidate", portal: "candidate", role: "candidate", label: "Candidate", icon: Users, color: "#0EA5E9",
    tagline: "Find jobs, learn & grow your career",
    steps: [
      { title: "Personal Information", fields: [
        { name: "firstName", label: "First Name", type: "text", placeholder: "Priya", required: true, half: true },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "Nair", required: true, half: true },
        { name: "email", label: "Email Address", type: "email", placeholder: "priya@gmail.com", required: true },
        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "dob", label: "Date of Birth", type: "date", half: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters", required: true },
      ]},
      { title: "Professional Details", fields: [
        { name: "experience", label: "Years of Experience", type: "select", options: ["Fresher (0 years)", "1-3 years", "3-5 years", "5-10 years", "10+ years"], required: true, half: true },
        { name: "currentRole", label: "Current Job Title", type: "text", placeholder: "Software Engineer", half: true },
        { name: "skills", label: "Top Skills (comma-separated)", type: "text", placeholder: "React, Node.js, Python" },
        { name: "preferredLocation", label: "Preferred Work Location", type: "text", placeholder: "Bengaluru, Remote", half: true },
        { name: "expectedSalary", label: "Expected Salary (LPA)", type: "select", options: ["3-5 LPA", "5-8 LPA", "8-12 LPA", "12-18 LPA", "18-25 LPA", "25+ LPA"], half: true },
        { name: "education", label: "Highest Qualification", type: "select", options: ["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"] },
      ]},
      { title: "Preferences & Consent", fields: [
        { name: "jobAlerts", label: "Job Alert Preferences", type: "select", options: ["Daily", "Weekly", "Monthly", "No alerts"] },
        { name: "source", label: "How did you hear about us?", type: "select", options: ["Google", "LinkedIn", "Friend/Referral", "Social Media", "Event", "Other"] },
      ]},
    ],
  },
  employer: {
    roleKey: "employer", portal: "employer", role: "employer", label: "Employer", icon: Building2, color: "#8B5CF6",
    tagline: "Hire talent, manage L&D, enterprise",
    steps: [
      { title: "Company Information", fields: [
        { name: "companyName", label: "Company Name", type: "text", placeholder: "TechCorp India Pvt Ltd", required: true },
        { name: "website", label: "Company Website", type: "text", placeholder: "https://techcorp.com", half: true },
        { name: "industry", label: "Industry", type: "select", options: ["IT/SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Education", "Other"], required: true, half: true },
        { name: "companySize", label: "Company Size", type: "select", options: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"], required: true, half: true },
        { name: "founded", label: "Year Founded", type: "text", placeholder: "2018", half: true },
        { name: "hqLocation", label: "HQ Location", type: "text", placeholder: "Bengaluru, India", required: true },
      ]},
      { title: "Account Administrator", fields: [
        { name: "firstName", label: "Your Name", type: "text", placeholder: "Rohan Mehta", required: true, half: true },
        { name: "jobTitle", label: "Your Job Title", type: "text", placeholder: "Head of Talent Acquisition", required: true, half: true },
        { name: "email", label: "Work Email", type: "email", placeholder: "rohan@techcorp.com", required: true },
        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "department", label: "Department", type: "select", options: ["HR/Talent", "Engineering", "Operations", "Finance", "Leadership", "Other"], half: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters", required: true },
      ]},
      { title: "Hiring Needs", fields: [
        { name: "monthlyHires", label: "Expected Monthly Hires", type: "select", options: ["1-5", "6-10", "11-25", "26-50", "50+"], required: true, half: true },
        { name: "roles", label: "Primary Roles You Hire For", type: "text", placeholder: "Software Engineer, Product Manager" },
        { name: "budget", label: "Annual Hiring Budget", type: "select", options: ["Under ₹5L", "₹5-10L", "₹10-25L", "₹25-50L", "₹50L+"], half: true },
      ]},
    ],
  },
  recruiter: {
    roleKey: "recruiter", portal: "recruiter", role: "recruiter", label: "Recruiter / Agency", icon: Briefcase, color: "#F59E0B",
    tagline: "Source, submit & place talent",
    steps: [
      { title: "Agency Information", fields: [
        { name: "agencyName", label: "Agency Name", type: "text", placeholder: "TalentBridge Consulting", required: true },
        { name: "website", label: "Website", type: "text", placeholder: "https://talentbridge.in", half: true },
        { name: "agencyType", label: "Agency Type", type: "select", options: ["Independent Recruiter", "Staffing Agency", "RPO Provider", "Executive Search", "Freelance"], required: true, half: true },
        { name: "specialization", label: "Specialization", type: "select", options: ["IT/Software", "Finance", "Healthcare", "Manufacturing", "Generalist", "Other"], required: true, half: true },
        { name: "teamSize", label: "Team Size", type: "select", options: ["Solo", "2-5", "6-10", "11-25", "25+"], half: true },
        { name: "location", label: "Office Location", type: "text", placeholder: "Hyderabad, India", required: true },
      ]},
      { title: "Primary Contact", fields: [
        { name: "firstName", label: "Your Name", type: "text", placeholder: "Sneha Reddy", required: true, half: true },
        { name: "designation", label: "Your Designation", type: "text", placeholder: "Senior Recruiter", required: true, half: true },
        { name: "email", label: "Work Email", type: "email", placeholder: "sneha@talentbridge.in", required: true },
        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "gstNumber", label: "GST Number", type: "text", placeholder: "29ABCDE1234F1Z5", half: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters", required: true },
      ]},
      { title: "Capabilities", fields: [
        { name: "monthlySubmissions", label: "Monthly Candidate Submissions", type: "select", options: ["1-10", "11-25", "26-50", "51-100", "100+"], required: true, half: true },
        { name: "verticals", label: "Verticals You Serve", type: "text", placeholder: "IT, Finance, Healthcare" },
        { name: "commissionModel", label: "Preferred Commission Model", type: "select", options: ["8.33% CTC", "10% CTC", "15% CTC", "Fixed per hire", "Retained + Success"], half: true },
      ]},
    ],
  },
  training: {
    roleKey: "training", portal: "training", role: "platform_admin", label: "Training & Admin", icon: GraduationCap, color: "#EF4444",
    tagline: "Corporate training + platform admin",
    steps: [
      { title: "Training Organization", fields: [
        { name: "orgName", label: "Organization Name", type: "text", placeholder: "SkillForge Academy", required: true },
        { name: "website", label: "Website", type: "text", placeholder: "https://skillforge.academy", half: true },
        { name: "orgType", label: "Organization Type", type: "select", options: ["Training Academy", "Corporate L&D", "University", "EdTech Company", "Independent Trainer"], required: true, half: true },
        { name: "programs", label: "Programs Offered", type: "text", placeholder: "Fullstack, Data Science, Cloud, AI/ML" },
        { name: "location", label: "Location", type: "text", placeholder: "Pune, India", required: true, half: true },
        { name: "studentsPerYear", label: "Students Per Year", type: "select", options: ["1-50", "51-200", "201-500", "501-1000", "1000+"], half: true },
      ]},
      { title: "Account Setup", fields: [
        { name: "firstName", label: "Your Name", type: "text", placeholder: "Divya Sharma", required: true, half: true },
        { name: "role", label: "Your Role", type: "text", placeholder: "Director of Training", required: true, half: true },
        { name: "email", label: "Work Email", type: "email", placeholder: "divya@skillforge.academy", required: true },
        { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters", required: true },
      ]},
    ],
  },
  partner: {
    roleKey: "partner", portal: "partner", role: "employer", label: "Franchise Partner", icon: Handshake, color: "#10B981",
    tagline: "Run a centre, college, service, tech, AI or recruitment franchise",
    steps: [
      { title: "Partner Information", fields: [
        { name: "partnerName", label: "Partner/Organization Name", type: "text", placeholder: "Chennai Tech Academy", required: true },
        { name: "partnerType", label: "Partner Type", type: "select", options: ["Recruitment Partner", "Physical Centre Partner", "University Partner", "Training Partner"], required: true },
        { name: "location", label: "City/Location", type: "text", placeholder: "Chennai, India", required: true, half: true },
        { name: "investmentCapacity", label: "Investment Capacity", type: "select", options: ["₹1-3L", "₹3-5L", "₹5-10L", "₹10-15L", "₹15L+"], half: true },
        { name: "website", label: "Website (if any)", type: "text", placeholder: "https://youracademy.in" },
      ]},
      { title: "Contact Details", fields: [
        { name: "firstName", label: "Your Name", type: "text", placeholder: "Rajesh Kumar", required: true, half: true },
        { name: "designation", label: "Your Designation", type: "text", placeholder: "Director", required: true, half: true },
        { name: "email", label: "Email", type: "email", placeholder: "rajesh@youracademy.in", required: true },
        { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "gstNumber", label: "GST Number", type: "text", placeholder: "33ABCDE1234F1Z5", half: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters", required: true },
      ]},
    ],
  },
  admin: {
    roleKey: "admin", portal: "admin", role: "platform_admin", label: "Platform Admin", icon: Crown, color: "#D4A017",
    tagline: "Platform administration & super admin",
    steps: [
      { title: "Admin Account", fields: [
        { name: "firstName", label: "Full Name", type: "text", placeholder: "Admin User", required: true, half: true },
        { name: "employeeId", label: "Employee ID", type: "text", placeholder: "JOBSONN-001", required: true, half: true },
        { name: "email", label: "Official Email", type: "email", placeholder: "admin@jobsonn.com", required: true },
        { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210", required: true, half: true },
        { name: "department", label: "Department", type: "select", options: ["Operations", "Engineering", "Sales", "Support", "Finance", "Leadership"], required: true, half: true },
        { name: "accessLevel", label: "Access Level", type: "select", options: ["Super Admin", "Operations Admin", "Support Admin", "Finance Admin"], required: true },
        { name: "password", label: "Password", type: "password", placeholder: "Min 12 characters", required: true },
      ]},
    ],
  },
};

export function PublicRegister({ roleKey }: { roleKey: string }) {
  const { navigate } = useNav();
  const { login } = useAuth();
  const config = REG_CONFIGS[roleKey];
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

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
    if (missing.length > 0) { toast.error("Please fill all required fields", { description: `${missing.length} field(s) need attention` }); return; }
    if (step < config.steps.length - 1) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else {
      setLoading(true);
      setTimeout(() => {
        login(config.role);
        toast.success("Account created!", { description: `Welcome to JOBSONN, ${data.firstName || "there"}!` });
        navigate(config.portal, "overview");
        setLoading(false);
      }, 1000);
    }
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button onClick={() => navigate("public", "home")} className="flex items-center" aria-label="JOBSONN home">
            <Image src="/jobsonn-logo.png" alt="JOBSONN" width={120} height={32} className="h-7 w-auto object-contain sm:h-8" priority />
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("public", "partner-login")}>Sign In</Button>
        </header>

        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-2 lg:gap-12">
          {/* Left: brand */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${config.color}40`, background: `${config.color}10`, color: config.color }}>
              <RoleIcon className="h-3.5 w-3.5" /> {config.label} Registration
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight lg:text-5xl">
              Create your <span style={{ color: config.color }}>{config.label}</span> account
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">{config.tagline}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "DPDP-compliant & secure" },
                { icon: CheckCircle2, label: "Free to register" },
                { icon: Lock, label: "256-bit SSL encrypted" },
                { icon: Briefcase, label: "Enterprise-grade platform" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-lg border bg-card/60 p-3">
                  <f.icon className="h-4 w-4 shrink-0 text-brand" />
                  <span className="text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: registration form */}
          <div className="mx-auto w-full max-w-md">
            <Card className="border-border/60 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${config.color}18`, color: config.color }}>
                    <RoleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{config.label} Registration</h2>
                    <p className="text-[10px] text-muted-foreground">{config.tagline}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between text-[10px]">
                    <span className="font-bold">Step {step + 1} of {config.steps.length}: {currentStep.title}</span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  {currentStep.fields.map((field) => (
                    <div key={field.name} className={cn(field.half && "grid grid-cols-2 gap-2")}>
                      {field.half && <div />}
                      <div className={cn("space-y-1", field.half && "col-span-1")}>
                        <Label className="text-[11px]">
                          {field.label}{field.required && <span className="ml-0.5 text-rose-500">*</span>}
                        </Label>
                        {field.type === "select" ? (
                          <Select value={data[field.name] || ""} onValueChange={(v) => setField(field.name, v)}>
                            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={field.placeholder || "Select..."} /></SelectTrigger>
                            <SelectContent>
                              {field.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input type={field.type} value={data[field.name] || ""} onChange={(e) => setField(field.name, e.target.value)} placeholder={field.placeholder} required={field.required} className="h-9 text-sm" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terms checkbox on last step */}
                {step === config.steps.length - 1 && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border bg-muted/30 p-2.5">
                    <input type="checkbox" id="terms" className="mt-0.5 h-3.5 w-3.5 rounded border-border" defaultChecked />
                    <label htmlFor="terms" className="text-[10px] leading-relaxed text-muted-foreground">
                      I agree to the <button type="button" onClick={() => navigate("public", "terms")} className="text-brand hover:underline">Terms of Service</button>, <button type="button" onClick={() => navigate("public", "privacy")} className="text-brand hover:underline">Privacy Policy</button> and consent to data processing under DPDP Act 2023.
                    </label>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-4 flex gap-2">
                  {step > 0 && (
                    <Button type="button" variant="outline" onClick={handleBack} className="gap-1.5 h-9 text-sm">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                  )}
                  <Button type="button" onClick={handleNext} className="flex-1 gap-1.5 h-9 text-sm" disabled={loading}>
                    {loading ? "Creating account…" : (
                      step < config.steps.length - 1 ? <>Continue <ArrowRight className="h-4 w-4" /></> : <>Create {config.label} Account <CheckCircle2 className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>

                <div className="border-t pt-3 text-center text-[11px] text-muted-foreground">
                  Already have an account? <button onClick={() => navigate("public", "partner-login")} className="font-medium text-brand hover:underline">Sign in</button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
