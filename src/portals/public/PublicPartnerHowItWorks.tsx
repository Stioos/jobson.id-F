"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText, ClipboardCheck, FileSignature, GraduationCap,
  Rocket, TrendingUp, BookOpen, Wallet, Award, Megaphone,
  LifeBuoy, ArrowRight, Sparkles, CheckCircle2, Building2,
  GraduationCap as GradIcon, Wrench, Cpu, Brain, Users2,
} from "lucide-react";
import { MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";

const STEPS = [
  {
    n: 1,
    title: "Apply",
    icon: FileText,
    description: "Submit an application via the 8-step wizard. Choose your model, share your organization details, and outline your territory & experience.",
    duration: "~30 minutes",
    color: "bg-brand/10 text-brand",
  },
  {
    n: 2,
    title: "Review & approval",
    icon: ClipboardCheck,
    description: "Our partnership team reviews your application, conducts background verification, and (for centre/college) schedules an infrastructure inspection.",
    duration: "5–10 business days",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    n: 3,
    title: "Agreement & onboarding",
    icon: FileSignature,
    description: "Sign the partner agreement, set up your wallet, choose your programs, and complete your partner profile. You get a dedicated partnership manager.",
    duration: "3–5 business days",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    n: 4,
    title: "Training & certification",
    icon: GraduationCap,
    description: "Your team is trained on the LMS, CRM, delivery standards, and assessment tooling. Faculty/recruiters get certified to deliver JOBSONN programs.",
    duration: "1–3 weeks",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    n: 5,
    title: "Launch & deliver",
    icon: Rocket,
    description: "Go live with your first batch / engagement / job order. Start generating leads, enrolling students, or delivering services — all tracked in your dashboard.",
    duration: "Day 1 of operations",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    n: 6,
    title: "Settle & grow",
    icon: TrendingUp,
    description: "Receive monthly settlements into your wallet. Track performance, unlock tier upgrades, and scale to additional programs or territories.",
    duration: "Ongoing",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
];

const WHAT_YOU_GET = [
  { icon: BookOpen, title: "JOBSONN LMS", desc: "Full LMS with course content, assignments, assessments, and learner analytics." },
  { icon: LifeBuoy, title: "Partner CRM", desc: "Manage leads, counsellors, batches, and admissions — all in one workspace." },
  { icon: Award, title: "Certification rights", desc: "Issue JOBSONN-branded certificates to graduates who pass assessments." },
  { icon: Megaphone, title: "Marketing kit", desc: "Co-branded templates, social assets, landing pages, and lead-magnet copy." },
  { icon: Wallet, title: "Wallet & settlements", desc: "Real-time wallet, automated monthly settlements, and downloadable invoices." },
  { icon: Sparkles, title: "Dedicated support", desc: "A named partnership manager + access to a partner-only Slack / support channel." },
];

const REQUIREMENTS: { model: PartnerModel; icon: typeof Building2; requirements: string[] }[] = [
  {
    model: "CENTRE", icon: Building2,
    requirements: ["Leased/owned training facility (min 1,200 sq ft)", "Min 2 classrooms + 1 lab", "Faculty with relevant certifications", "Local business registration (GST)", "Initial infrastructure investment"],
  },
  {
    model: "COLLEGE", icon: GradIcon,
    requirements: ["NAAC / NBA accreditation (preferred)", "Active placement cell", "Dedicated lab/classroom space", "Approval from head of institution", "MoU signing authority"],
  },
  {
    model: "SERVICE", icon: Wrench,
    requirements: ["Registered IT services company", "Min 10-member delivery team", "Cloud platform expertise (AWS/Azure/GCP)", "Client portfolio (preferred)", "GST registration"],
  },
  {
    model: "TECHNOLOGY", icon: Cpu,
    requirements: ["System integrator / consultancy profile", "ERP/CRM implementation experience", "OEM partnerships (preferred)", "Min 5 certified engineers", "Enterprise sales capability"],
  },
  {
    model: "AI", icon: Brain,
    requirements: ["AI/ML product or research team", "Published work or live AI products", "Cloud ML platform experience", "Min 3 ML engineers", "Ability to consume GPU credits"],
  },
  {
    model: "RECRUITMENT", icon: Users2,
    requirements: ["Registered staffing/recruitment firm", "Min 3 recruiters", "ATS / CRM experience", "Industry specialization (IT preferred)", "Compliance with labour laws"],
  },
];

const FAQ = [
  { q: "How long does the entire onboarding take?", a: "From application submission to your first batch / engagement, the typical timeline is 3–6 weeks. Centre & College partners take slightly longer due to infrastructure inspection and MoU signing." },
  { q: "Is there an upfront fee to become a partner?", a: "Most models have no upfront franchise fee — instead, revenue is shared as per the matched rule. Centre partners may need to invest in infrastructure and a refundable security deposit; College partners sign a MoU. Detailed commercial terms are shared during the agreement stage." },
  { q: "What training does JOBSONN provide?", a: "All partners receive LMS, CRM, certification, and assessment training. Centre & College partners get faculty-trainer programs; Service & Technology partners get solution-specific onboarding; Recruitment partners get ATS + sourcing tooling training." },
  { q: "Can I deliver programs not in the JOBSONN catalog?", a: "Yes, with approval. Partners can propose custom programs; our curriculum team reviews and (if approved) co-brands them. Revenue share for custom programs is defined in your agreement." },
  { q: "How quickly are settlements processed?", a: "Monthly settlement cycles for recurring models (Centre, College, Service, Technology, AI) — settlement run hits your wallet by the 7th of every month. Recruitment partners get per-placement settlements within 7 business days of candidate joining." },
  { q: "What if my territory overlaps with another partner?", a: "We grant exclusive territories for Centre & College partners based on pin-code or city. For Service, Technology, AI, and Recruitment, exclusivity is by client/account — multiple partners can coexist." },
];

export function PublicPartnerHowItWorks() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <Badge className="mb-4 gap-1"><Rocket className="h-3 w-3" /> How it works</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            From application to <span className="text-brand">first settlement</span> — in 6 clear steps
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A transparent, predictable journey. You always know what happens next, who&apos;s responsible, and how
            long each stage takes.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" aria-hidden />
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isRight = i % 2 === 1;
              return (
                <div key={step.n} className={`relative flex sm:items-center ${isRight ? "sm:flex-row-reverse" : ""}`}>
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${isRight ? "sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
                    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div className={`flex items-center gap-3 ${isRight ? "" : "sm:flex-row-reverse"}`}>
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className={isRight ? "" : "sm:text-right"}>
                          <div className="flex items-center gap-2 sm:justify-end">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Step {step.n}</span>
                            <Badge variant="secondary" className="text-[10px]">{step.duration}</Badge>
                          </div>
                          <h3 className="text-base font-bold">{step.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
                    </Card>
                  </div>
                  <div className="absolute left-4 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-brand bg-background sm:left-1/2 sm:top-1/2 sm:-translate-y-1/2">
                    <span className="text-xs font-bold text-brand">{step.n}</span>
                  </div>
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you get</h2>
            <p className="mt-2 text-sm text-muted-foreground">Every partner gets the full JOBSONN stack — included.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map((w) => (
              <Card key={w.title} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <w.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{w.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements per model */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Requirements by model</h2>
          <p className="mt-2 text-sm text-muted-foreground">Each model has different prerequisites — pick yours to see what&apos;s needed.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIREMENTS.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.model} className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold">{MODEL_LABELS[r.model]}</h3>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {r.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Process FAQs</h2>
            <p className="mt-2 text-sm text-muted-foreground">Common questions about the onboarding journey.</p>
          </div>
          <Card className="p-2 sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="px-3 text-left text-sm font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="px-3 text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate("public", "partner-faqs")} className="gap-1.5">
              See all FAQs <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to start your journey?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Apply today — most applications are reviewed within a week. Your dedicated partnership manager will
                walk you through agreement, onboarding, and launch.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                <FileText className="h-4 w-4" /> Apply now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "partner-models")}>
                Explore models
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
