"use client";

import * as React from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Building2, GraduationCap, Wrench, Cpu, Brain, Users2,
  ArrowRight, ArrowLeft, CheckCircle2, FileText, Sparkles,
  Save, Send, User, Wallet, MapPin, Briefcase, FileCheck,
  AlertCircle, Info,
} from "lucide-react";
import { MODEL_LABELS, LEAD_SOURCES, programs } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Schema (whole form) — each step validates its own subset
// ─────────────────────────────────────────────────────────────
const schema = z.object({
  // Step 1: Model
  model: z.enum(["CENTRE", "COLLEGE", "SERVICE", "TECHNOLOGY", "AI", "RECRUITMENT"]),

  // Step 2: Basic info
  applicantName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  designation: z.string().min(2, "Enter your designation"),

  // Step 3: Organization
  organizationName: z.string().min(2, "Enter organization name"),
  legalName: z.string().min(2, "Enter legal name"),
  organizationType: z.string().min(2, "Select an organization type"),
  registrationNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  website: z.string().optional(),
  establishedYear: z.coerce.number().min(1950, "Enter a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  headquarterCity: z.string().min(2, "Enter HQ city"),
  headquarterState: z.string().min(2, "Enter HQ state"),

  // Step 4: Financial
  annualRevenue: z.coerce.number().min(0, "Enter a valid amount"),
  fundingSource: z.string().min(2, "Select a funding source"),
  bankAccountName: z.string().min(2, "Enter bank account name"),
  bankAccountNumber: z.string().min(8, "Enter a valid account number"),
  bankIfsc: z.string().min(6, "Enter a valid IFSC code"),
  panNumber: z.string().min(6, "Enter a valid PAN"),

  // Step 5: Territory
  territoryType: z.enum(["exclusive", "non-exclusive"]),
  primaryCity: z.string().min(2, "Enter primary city"),
  primaryState: z.string().min(2, "Enter primary state"),
  additionalCities: z.string().optional(),
  centreAddress: z.string().optional(),

  // Step 6: Experience
  yearsInBusiness: z.coerce.number().min(0, "Enter years in business"),
  teamSize: z.coerce.number().min(1, "Enter team size"),
  priorTrainingExperience: z.string().min(10, "Tell us about your prior experience"),
  relevantClients: z.string().optional(),
  references: z.string().optional(),

  // Step 7: Model-specific
  preferredPrograms: z.array(z.string()).min(1, "Select at least one program"),
  expectedMonthlyEnrollments: z.coerce.number().min(0).optional(),
  preferredLeadSources: z.array(z.string()).min(1, "Select at least one lead source"),
  modelSpecificNotes: z.string().optional(),

  // Step 8: Documents & Declarations
  hasGstCertificate: z.boolean(),
  hasBusinessRegistration: z.boolean(),
  hasInsurance: z.boolean(),
  agreesToBackgroundCheck: z.boolean().refine((v) => v === true, "You must agree to background verification"),
  agreesToTerms: z.boolean().refine((v) => v === true, "You must accept the terms"),
  acknowledgesAccuracy: z.boolean().refine((v) => v === true, "You must acknowledge the accuracy of information"),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { n: 1, label: "Model", icon: Building2, fields: ["model"] as (keyof FormValues)[] },
  { n: 2, label: "Basic info", icon: User, fields: ["applicantName", "email", "phone", "designation"] as (keyof FormValues)[] },
  { n: 3, label: "Organization", icon: Briefcase, fields: ["organizationName", "legalName", "organizationType", "registrationNumber", "gstNumber", "website", "establishedYear", "headquarterCity", "headquarterState"] as (keyof FormValues)[] },
  { n: 4, label: "Financial", icon: Wallet, fields: ["annualRevenue", "fundingSource", "bankAccountName", "bankAccountNumber", "bankIfsc", "panNumber"] as (keyof FormValues)[] },
  { n: 5, label: "Territory", icon: MapPin, fields: ["territoryType", "primaryCity", "primaryState", "additionalCities", "centreAddress"] as (keyof FormValues)[] },
  { n: 6, label: "Experience", icon: FileText, fields: ["yearsInBusiness", "teamSize", "priorTrainingExperience", "relevantClients", "references"] as (keyof FormValues)[] },
  { n: 7, label: "Model-specific", icon: Sparkles, fields: ["preferredPrograms", "expectedMonthlyEnrollments", "preferredLeadSources", "modelSpecificNotes"] as (keyof FormValues)[] },
  { n: 8, label: "Declarations", icon: FileCheck, fields: ["hasGstCertificate", "hasBusinessRegistration", "hasInsurance", "agreesToBackgroundCheck", "agreesToTerms", "acknowledgesAccuracy", "additionalNotes"] as (keyof FormValues)[] },
  { n: 9, label: "Review", icon: Send, fields: [] as (keyof FormValues)[] },
];

const MODEL_CARDS: { key: PartnerModel; icon: typeof Building2; tagline: string }[] = [
  { key: "CENTRE", icon: Building2, tagline: "Run a training centre" },
  { key: "COLLEGE", icon: GraduationCap, tagline: "Campus partnership (MoU A–E)" },
  { key: "SERVICE", icon: Wrench, tagline: "Deliver IT services" },
  { key: "TECHNOLOGY", icon: Cpu, tagline: "OEM & enterprise tech" },
  { key: "AI", icon: Brain, tagline: "Build AI products" },
  { key: "RECRUITMENT", icon: Users2, tagline: "Place candidates" },
];

const ORG_TYPES = ["Private Limited", "LLP", "Partnership", "Proprietorship", "Trust", "Society", "Section 8 Company", "Government Body", "Educational Institution"];
const FUNDING_SOURCES = ["Bootstrapped", "Angel / Seed funded", "VC backed", "Bank loan", "Personal investment", "Other"];
const INDIAN_STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"];

const STORAGE_KEY = "jobson_id_partner_application_draft";
const MODEL_STORAGE_KEY = "jobson_id_partner_apply_model";
const PROGRAM_STORAGE_KEY = "jobson_id_partner_apply_program";

const DEFAULT_VALUES: FormValues = {
  model: "CENTRE",
  applicantName: "",
  email: "",
  phone: "",
  designation: "",
  organizationName: "",
  legalName: "",
  organizationType: "",
  registrationNumber: "",
  gstNumber: "",
  website: "",
  establishedYear: new Date().getFullYear() - 1,
  headquarterCity: "",
  headquarterState: "",
  annualRevenue: 0,
  fundingSource: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankIfsc: "",
  panNumber: "",
  territoryType: "exclusive",
  primaryCity: "",
  primaryState: "",
  additionalCities: "",
  centreAddress: "",
  yearsInBusiness: 0,
  teamSize: 1,
  priorTrainingExperience: "",
  relevantClients: "",
  references: "",
  preferredPrograms: [],
  expectedMonthlyEnrollments: 0,
  preferredLeadSources: [],
  modelSpecificNotes: "",
  hasGstCertificate: false,
  hasBusinessRegistration: false,
  hasInsurance: false,
  agreesToBackgroundCheck: false,
  agreesToTerms: false,
  acknowledgesAccuracy: false,
  additionalNotes: "",
};

export function PublicPartnerApply() {
  const { navigate } = useNav();
  const [step, setStep] = React.useState(1);
  const [submitted, setSubmitted] = React.useState(false);

  // Hydrate from localStorage or session hints
  const initialValues = React.useMemo<FormValues>(() => {
    let base: FormValues = { ...DEFAULT_VALUES };
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        base = { ...base, ...parsed };
      }
      if (typeof window !== "undefined") {
        const modelHint = sessionStorage.getItem(MODEL_STORAGE_KEY);
        if (modelHint) {
          base.model = modelHint as PartnerModel;
          sessionStorage.removeItem(MODEL_STORAGE_KEY);
        }
        const progHint = sessionStorage.getItem(PROGRAM_STORAGE_KEY);
        if (progHint && !base.preferredPrograms.includes(progHint)) {
          base.preferredPrograms = [...base.preferredPrograms, progHint];
          sessionStorage.removeItem(PROGRAM_STORAGE_KEY);
        }
      }
    } catch {
      // ignore parse errors
    }
    return base;
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Autosave on every change
  React.useEffect(() => {
    const sub = form.watch((values) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, _savedAt: new Date().toISOString() }));
        }
      } catch {
        // ignore quota errors
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const currentStep = STEPS[step - 1];
  const progress = (step / STEPS.length) * 100;

  const validateStep = async (stepNum: number): Promise<boolean> => {
    const stepDef = STEPS[stepNum - 1];
    if (stepDef.fields.length === 0) return true; // review step
    const valid = await form.trigger(stepDef.fields as (keyof FormValues)[]);
    return valid;
  };

  const goNext = async () => {
    const ok = await validateStep(step);
    if (!ok) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goTo = async (target: number) => {
    if (target <= step) {
      setStep(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // validate all intermediate steps
    for (let i = step; i < target; i++) {
      const ok = await validateStep(i);
      if (!ok) {
        toast.error(`Please complete step ${i} first`);
        return;
      }
    }
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (values: FormValues) => {
    // Final validation — re-trigger all required fields
    const allFields = STEPS.flatMap((s) => s.fields);
    const ok = await form.trigger(allFields as (keyof FormValues)[]);
    if (!ok) {
      toast.error("Some fields need your attention");
      return;
    }
    setSubmitted(true);
    toast.success("Application submitted!", {
      description: `Your ${MODEL_LABELS[values.model]} application has been received. We'll respond within 5–10 business days.`,
    });
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    setTimeout(() => {
      navigate("partner", "overview");
    }, 2500);
  };

  const saveDraft = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form.getValues(), _savedAt: new Date().toISOString() }));
      }
    } catch {
      // ignore
    }
    toast.success("Draft saved", { description: "You can resume your application anytime from this device." });
  };

  const values = form.watch();

  if (submitted) {
    return (
      <div className="bg-background">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Application submitted!</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Thank you for applying to become a jobson.id partner. Your application for the{" "}
            <strong className="text-foreground">{MODEL_LABELS[values.model]}</strong> model has been received.
            We&apos;ll review and respond within 5–10 business days.
          </p>
          <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-left text-xs">
            <p className="font-medium">What happens next?</p>
            <ol className="mt-2 space-y-1.5 text-muted-foreground">
              <li>1. Our partnership team reviews your application</li>
              <li>2. We conduct background verification (1–3 days)</li>
              <li>3. For Centre/College: infrastructure inspection is scheduled</li>
              <li>4. A dedicated partnership manager reaches out with the agreement</li>
            </ol>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Redirecting you to your partner portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Top bar */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Partner Application</h1>
              <p className="text-xs text-muted-foreground">Step {step} of {STEPS.length} · {currentStep.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={saveDraft} className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save draft
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-1.5" />
        </div>
      </div>

      {/* Stepper */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Application steps" className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const isActive = s.n === step;
            const isDone = s.n < step;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.n}>
                <button
                  type="button"
                  onClick={() => goTo(s.n)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                    isActive ? "bg-brand text-white" :
                    isDone ? "bg-brand/10 text-brand hover:bg-brand/20" :
                    "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive ? "bg-white/20" :
                    isDone ? "bg-brand/20" :
                    "bg-background text-muted-foreground"
                  )}>
                    {isDone ? <CheckCircle2 className="h-3 w-3" /> : s.n}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-px w-4 shrink-0 sm:w-6", isDone ? "bg-brand/40" : "bg-border")} />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Model */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose your partnership model</CardTitle>
                <CardDescription>Pick the model that fits your organization. You can change this later if needed.</CardDescription>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {MODEL_CARDS.map((m) => {
                        const Icon = m.icon;
                        const selected = field.value === m.key;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => field.onChange(m.key)}
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                              selected ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-border hover:border-brand/40 hover:bg-muted/40"
                            )}
                          >
                            <div className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg",
                              selected ? "bg-brand text-white" : "bg-brand/10 text-brand"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-semibold">{MODEL_LABELS[m.key]}</div>
                            <p className="text-[10px] text-muted-foreground">{m.tagline}</p>
                            {selected && (
                              <Badge className="mt-1 gap-1 text-[10px]"><CheckCircle2 className="h-2.5 w-2.5" /> Selected</Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {form.formState.errors.model && (
                  <p className="mt-2 text-xs text-rose-500">{form.formState.errors.model.message as string}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic info */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic information</CardTitle>
                <CardDescription>Tell us who you are. We&apos;ll use this to set up your partner account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Full name" required error={form.formState.errors.applicantName?.message as string}>
                  <Input {...form.register("applicantName")} placeholder="e.g. Rajesh Kumar" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" required error={form.formState.errors.email?.message as string}>
                    <Input type="email" {...form.register("email")} placeholder="you@organization.com" />
                  </Field>
                  <Field label="Phone" required error={form.formState.errors.phone?.message as string}>
                    <Input {...form.register("phone")} placeholder="+91 98XXX XXXXX" />
                  </Field>
                </div>
                <Field label="Designation" required error={form.formState.errors.designation?.message as string}>
                  <Input {...form.register("designation")} placeholder="e.g. Director, Operations Head" />
                </Field>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Organization */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Organization / Profile</CardTitle>
                <CardDescription>Your organization&apos;s legal and operational details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Organization name" required error={form.formState.errors.organizationName?.message as string}>
                    <Input {...form.register("organizationName")} placeholder="e.g. Chennai Tech Academy" />
                  </Field>
                  <Field label="Legal name" required error={form.formState.errors.legalName?.message as string}>
                    <Input {...form.register("legalName")} placeholder="As per registration certificate" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Organization type" required error={form.formState.errors.organizationType?.message as string}>
                    <Controller
                      control={form.control}
                      name="organizationType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            {ORG_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Registration number" error={form.formState.errors.registrationNumber?.message as string}>
                    <Input {...form.register("registrationNumber")} placeholder="CIN / Trust Reg / Society No." />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="GST number" error={form.formState.errors.gstNumber?.message as string}>
                    <Input {...form.register("gstNumber")} placeholder="22AAAAA0000A1Z5" />
                  </Field>
                  <Field label="Website" error={form.formState.errors.website?.message as string}>
                    <Input {...form.register("website")} placeholder="https://…" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Established year" required error={form.formState.errors.establishedYear?.message as string}>
                    <Input type="number" {...form.register("establishedYear", { valueAsNumber: true })} placeholder="2018" />
                  </Field>
                  <Field label="HQ city" required error={form.formState.errors.headquarterCity?.message as string}>
                    <Input {...form.register("headquarterCity")} placeholder="e.g. Chennai" />
                  </Field>
                  <Field label="HQ state" required error={form.formState.errors.headquarterState?.message as string}>
                    <Controller
                      control={form.control}
                      name="headquarterState"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Financial */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Financial information</CardTitle>
                <CardDescription>Bank & financial details for settlements and compliance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Annual revenue (INR)" required error={form.formState.errors.annualRevenue?.message as string}>
                    <Input type="number" {...form.register("annualRevenue", { valueAsNumber: true })} placeholder="e.g. 5000000" />
                  </Field>
                  <Field label="Funding source" required error={form.formState.errors.fundingSource?.message as string}>
                    <Controller
                      control={form.control}
                      name="fundingSource"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                          <SelectContent>
                            {FUNDING_SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Bank account name" required error={form.formState.errors.bankAccountName?.message as string}>
                    <Input {...form.register("bankAccountName")} placeholder="As per bank records" />
                  </Field>
                  <Field label="Bank account number" required error={form.formState.errors.bankAccountNumber?.message as string}>
                    <Input {...form.register("bankAccountNumber")} placeholder="Account number" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="IFSC code" required error={form.formState.errors.bankIfsc?.message as string}>
                    <Input {...form.register("bankIfsc")} placeholder="e.g. HDFC0001234" />
                  </Field>
                  <Field label="PAN number" required error={form.formState.errors.panNumber?.message as string}>
                    <Input {...form.register("panNumber")} placeholder="AAAAA0000A" />
                  </Field>
                </div>
                <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Your bank details are encrypted at rest and used only for settlements. We never store card data.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Territory */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Territory & location</CardTitle>
                <CardDescription>Where do you plan to operate? Centre & College partners get exclusivity by city/pin-code.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Territory type" required error={form.formState.errors.territoryType?.message as string}>
                  <Controller
                    control={form.control}
                    name="territoryType"
                    render={({ field }) => (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => field.onChange("exclusive")}
                          className={cn(
                            "rounded-lg border p-3 text-left transition-all",
                            field.value === "exclusive" ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-border hover:border-brand/40"
                          )}
                        >
                          <p className="text-sm font-medium">Exclusive territory</p>
                          <p className="text-[10px] text-muted-foreground">No other jobson.id partner in your city/pin-code</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("non-exclusive")}
                          className={cn(
                            "rounded-lg border p-3 text-left transition-all",
                            field.value === "non-exclusive" ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-border hover:border-brand/40"
                          )}
                        >
                          <p className="text-sm font-medium">Non-exclusive</p>
                          <p className="text-[10px] text-muted-foreground">Multiple partners can coexist (Service / Tech / AI / Recruitment)</p>
                        </button>
                      </div>
                    )}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primary city" required error={form.formState.errors.primaryCity?.message as string}>
                    <Input {...form.register("primaryCity")} placeholder="e.g. Chennai" />
                  </Field>
                  <Field label="Primary state" required error={form.formState.errors.primaryState?.message as string}>
                    <Controller
                      control={form.control}
                      name="primaryState"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
                <Field label="Additional cities / territories" error={form.formState.errors.additionalCities?.message as string}>
                  <Textarea {...form.register("additionalCities")} rows={2} placeholder="List any additional cities you plan to operate in (comma-separated)" />
                </Field>
                {(values.model === "CENTRE" || values.model === "COLLEGE") && (
                  <Field label="Centre / campus address" error={form.formState.errors.centreAddress?.message as string}>
                    <Textarea {...form.register("centreAddress")} rows={3} placeholder="Full address of the proposed training centre or campus" />
                  </Field>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 6: Experience */}
          {step === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Experience & team</CardTitle>
                <CardDescription>Tell us about your team and prior experience in this space.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Years in business" required error={form.formState.errors.yearsInBusiness?.message as string}>
                    <Input type="number" {...form.register("yearsInBusiness", { valueAsNumber: true })} placeholder="e.g. 5" />
                  </Field>
                  <Field label="Team size" required error={form.formState.errors.teamSize?.message as string}>
                    <Input type="number" {...form.register("teamSize", { valueAsNumber: true })} placeholder="e.g. 12" />
                  </Field>
                </div>
                <Field label="Prior training / delivery experience" required error={form.formState.errors.priorTrainingExperience?.message as string}>
                  <Textarea {...form.register("priorTrainingExperience")} rows={4} placeholder="Describe your team's prior experience in training, services delivery, or recruitment — including programs delivered, clients served, and outcomes achieved." />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Relevant clients (optional)" error={form.formState.errors.relevantClients?.message as string}>
                    <Textarea {...form.register("relevantClients")} rows={2} placeholder="Notable past clients or engagements" />
                  </Field>
                  <Field label="References (optional)" error={form.formState.errors.references?.message as string}>
                    <Textarea {...form.register("references")} rows={2} placeholder="Name + contact of 1–2 professional references" />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Model-specific */}
          {step === 7 && (
            <Card>
              <CardHeader>
                <CardTitle>Model-specific preferences</CardTitle>
                <CardDescription>For <strong className="text-brand">{MODEL_LABELS[values.model]}</strong> — choose your programs and lead sources.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Preferred programs" required error={form.formState.errors.preferredPrograms?.message as string}>
                  <Controller
                    control={form.control}
                    name="preferredPrograms"
                    render={({ field }) => (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {programs.map((p) => {
                          const checked = field.value?.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={cn(
                                "flex items-start gap-2 rounded-lg border p-3 cursor-pointer transition-all",
                                checked ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(c) => {
                                  if (c) field.onChange([...(field.value ?? []), p.id]);
                                  else field.onChange((field.value ?? []).filter((id: string) => id !== p.id));
                                }}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium leading-tight">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground">{p.code} · {p.durationWeeks}w · ₹{p.defaultPrice.toLocaleString("en-IN")}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Expected monthly enrollments / engagements" error={form.formState.errors.expectedMonthlyEnrollments?.message as string}>
                    <Input type="number" {...form.register("expectedMonthlyEnrollments", { valueAsNumber: true })} placeholder="e.g. 20" />
                  </Field>
                </div>

                <Field label="Preferred lead sources" required error={form.formState.errors.preferredLeadSources?.message as string}>
                  <Controller
                    control={form.control}
                    name="preferredLeadSources"
                    render={({ field }) => (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {LEAD_SOURCES.map((s) => {
                          const checked = field.value?.includes(s.value);
                          return (
                            <label
                              key={s.value}
                              className={cn(
                                "flex items-start gap-2 rounded-lg border p-3 cursor-pointer transition-all",
                                checked ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(c) => {
                                  if (c) field.onChange([...(field.value ?? []), s.value]);
                                  else field.onChange((field.value ?? []).filter((v: string) => v !== s.value));
                                }}
                              />
                              <div>
                                <p className="text-xs font-medium">{s.label}</p>
                                <p className="text-[10px] text-muted-foreground">Default partner share: {s.defaultPartnerPct}%</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                </Field>

                <Field label="Additional notes (optional)" error={form.formState.errors.modelSpecificNotes?.message as string}>
                  <Textarea {...form.register("modelSpecificNotes")} rows={3} placeholder="Anything else we should know? Specializations, existing client pipeline, infrastructure specifics, etc." />
                </Field>
              </CardContent>
            </Card>
          )}

          {/* Step 8: Documents & Declarations */}
          {step === 8 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents &amp; declarations</CardTitle>
                <CardDescription>Confirm the documents you can provide and accept the declarations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documents you can provide</p>
                  <Controller
                    control={form.control}
                    name="hasGstCertificate"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm">GST certificate</span>
                      </label>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="hasBusinessRegistration"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm">Business registration certificate (CIN / Trust / Society)</span>
                      </label>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="hasInsurance"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/40">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm">Public liability / professional indemnity insurance (Centre partners)</span>
                      </label>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Declarations</p>
                  <Controller
                    control={form.control}
                    name="agreesToBackgroundCheck"
                    render={({ field }) => (
                      <label className={cn("flex items-start gap-2 rounded-lg border p-3 cursor-pointer", form.formState.errors.agreesToBackgroundCheck ? "border-rose-400" : "hover:bg-muted/40")}>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                        <span className="text-sm">I consent to background verification of my organization, directors, and key personnel. *</span>
                      </label>
                    )}
                  />
                  {form.formState.errors.agreesToBackgroundCheck && (
                    <p className="text-xs text-rose-500">{form.formState.errors.agreesToBackgroundCheck.message as string}</p>
                  )}
                  <Controller
                    control={form.control}
                    name="agreesToTerms"
                    render={({ field }) => (
                      <label className={cn("flex items-start gap-2 rounded-lg border p-3 cursor-pointer", form.formState.errors.agreesToTerms ? "border-rose-400" : "hover:bg-muted/40")}>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                        <span className="text-sm">I have read and accept the jobson.id Partner Program <button type="button" onClick={() => toast.info("Terms document opens in a new tab (simulated)")} className="text-brand underline">terms &amp; conditions</button>. *</span>
                      </label>
                    )}
                  />
                  {form.formState.errors.agreesToTerms && (
                    <p className="text-xs text-rose-500">{form.formState.errors.agreesToTerms.message as string}</p>
                  )}
                  <Controller
                    control={form.control}
                    name="acknowledgesAccuracy"
                    render={({ field }) => (
                      <label className={cn("flex items-start gap-2 rounded-lg border p-3 cursor-pointer", form.formState.errors.acknowledgesAccuracy ? "border-rose-400" : "hover:bg-muted/40")}>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                        <span className="text-sm">I confirm that all information provided in this application is accurate and complete to the best of my knowledge. *</span>
                      </label>
                    )}
                  />
                  {form.formState.errors.acknowledgesAccuracy && (
                    <p className="text-xs text-rose-500">{form.formState.errors.acknowledgesAccuracy.message as string}</p>
                  )}
                </div>

                <Field label="Additional notes (optional)" error={form.formState.errors.additionalNotes?.message as string}>
                  <Textarea {...form.register("additionalNotes")} rows={3} placeholder="Anything else you'd like the review team to know?" />
                </Field>
              </CardContent>
            </Card>
          )}

          {/* Step 9: Review */}
          {step === 9 && (
            <Card>
              <CardHeader>
                <CardTitle>Review &amp; submit</CardTitle>
                <CardDescription>Double-check your application before submitting. You can edit any section by clicking its step above.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ReviewSection title="Model" onEdit={() => setStep(1)}>
                  <p className="text-sm">{MODEL_LABELS[values.model]}</p>
                </ReviewSection>
                <ReviewSection title="Basic info" onEdit={() => setStep(2)}>
                  <p className="text-sm">{values.applicantName} · {values.email} · {values.phone}</p>
                  <p className="text-xs text-muted-foreground">{values.designation}</p>
                </ReviewSection>
                <ReviewSection title="Organization" onEdit={() => setStep(3)}>
                  <p className="text-sm">{values.organizationName} ({values.legalName})</p>
                  <p className="text-xs text-muted-foreground">{values.organizationType} · Est. {values.establishedYear} · {values.headquarterCity}, {values.headquarterState}</p>
                </ReviewSection>
                <ReviewSection title="Financial" onEdit={() => setStep(4)}>
                  <p className="text-sm">Annual revenue: ₹{values.annualRevenue.toLocaleString("en-IN")} · {values.fundingSource}</p>
                  <p className="text-xs text-muted-foreground">Bank: {values.bankAccountName} · IFSC: {values.bankIfsc} · PAN: {values.panNumber}</p>
                </ReviewSection>
                <ReviewSection title="Territory" onEdit={() => setStep(5)}>
                  <p className="text-sm">{values.territoryType === "exclusive" ? "Exclusive" : "Non-exclusive"} · {values.primaryCity}, {values.primaryState}</p>
                  {values.additionalCities && <p className="text-xs text-muted-foreground">Additional: {values.additionalCities}</p>}
                </ReviewSection>
                <ReviewSection title="Experience" onEdit={() => setStep(6)}>
                  <p className="text-sm">{values.yearsInBusiness} years · {values.teamSize} team members</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{values.priorTrainingExperience}</p>
                </ReviewSection>
                <ReviewSection title="Model-specific" onEdit={() => setStep(7)}>
                  <p className="text-sm">{values.preferredPrograms.length} program(s) selected</p>
                  <p className="text-xs text-muted-foreground">{values.preferredLeadSources.length} lead source(s) preferred</p>
                </ReviewSection>
                <ReviewSection title="Declarations" onEdit={() => setStep(8)}>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {values.hasGstCertificate && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> GST</Badge>}
                    {values.hasBusinessRegistration && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Reg</Badge>}
                    {values.hasInsurance && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Insurance</Badge>}
                    {values.agreesToBackgroundCheck && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> BG check</Badge>}
                    {values.agreesToTerms && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Terms</Badge>}
                    {values.acknowledgesAccuracy && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Accuracy</Badge>}
                  </div>
                </ReviewSection>

                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-muted-foreground">
                    Submitting this application does not constitute a binding agreement. jobson.id will review and respond
                    within 5–10 business days. Final terms are governed by the signed partner agreement.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              {step < STEPS.length ? (
                <Button type="button" onClick={goNext} className="gap-1.5">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="gap-1.5">
                  <Send className="h-4 w-4" /> Submit application
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <div className="mt-1">{children}</div>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="h-7 text-xs">
          Edit
        </Button>
      </div>
    </div>
  );
}
