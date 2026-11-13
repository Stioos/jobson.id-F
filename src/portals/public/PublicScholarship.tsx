"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Award, ArrowRight, Sparkles, Wallet, Shield,
  HeartHandshake, Medal, Rocket, Clock, Users, Quote, PhoneCall,
  CheckCircle2, FileText, TrendingUp, GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Scholarship types — 4 cards
// ============================================================
const SCHOLARSHIP_TYPES = [
  {
    id: "merit",
    title: "Merit Scholarship",
    icon: Medal,
    accent: "#F59E0B",
    amount: "Up to ₹1,00,000",
    coverage: "25% – 50% of program fee",
    desc: "Awarded to applicants with exceptional academic or professional achievements. Top 1% of admission diagnostic scorers are automatically considered.",
    eligibility: [
      "Top 1% score on the admissions diagnostic",
      "Strong academic record (CGPA 8.5+ or equivalent)",
      "Demonstrated excellence in coding, hackathons, or research",
    ],
  },
  {
    id: "need",
    title: "Need-Based Scholarship",
    icon: HeartHandshake,
    accent: "#10B981",
    amount: "Up to ₹2,00,000",
    coverage: "50% – 100% of program fee",
    desc: "For learners from economically weaker sections (EWS). Covers partial to full program fee based on family income and financial need.",
    eligibility: [
      "Family annual income below ₹6,00,000",
      "Valid EWS / OBC-NCL / SC / ST certificate",
      "Submission of income proof and bank statements",
    ],
  },
  {
    id: "women-in-tech",
    title: "Women in Tech Scholarship",
    icon: Shield,
    accent: "#8B5CF6",
    amount: "Up to ₹1,50,000",
    coverage: "30% – 60% of program fee",
    desc: "Dedicated to closing the gender gap in tech. Awarded to women and non-binary candidates who demonstrate passion for engineering, sales, or AI.",
    eligibility: [
      "Women and non-binary candidates only",
      "Submission of a 500-word 'why I want to work in tech' essay",
      "Priority to candidates from Tier-2/3 cities and non-CS backgrounds",
    ],
  },
  {
    id: "defense",
    title: "Defense & Armed Forces Scholarship",
    icon: Award,
    accent: "#EF4444",
    amount: "Up to ₹2,50,000",
    coverage: "60% – 100% of program fee",
    desc: "For serving personnel transitioning to civilian careers, veterans, and dependents of fallen soldiers. Includes priority placement support.",
    eligibility: [
      "Active service personnel within 12 months of discharge",
      "Veterans with honorable discharge",
      "Dependents of fallen or disabled soldiers",
      "Valid service / discharge / dependent certificate",
    ],
  },
];

// ============================================================
// Deadlines
// ============================================================
const DEADLINES = [
  { cohort: "Spring 2025", scholarship: "Merit + Need-based", openDate: "Jan 5, 2025", closeDate: "Feb 15, 2025", status: "Open" },
  { cohort: "Summer 2025", scholarship: "Women in Tech + Defense", openDate: "Mar 1, 2025", closeDate: "Apr 15, 2025", status: "Open" },
  { cohort: "Fall 2025", scholarship: "All scholarships", openDate: "Jun 1, 2025", closeDate: "Jul 30, 2025", status: "Upcoming" },
  { cohort: "Winter 2025", scholarship: "Merit + Need-based", openDate: "Sep 1, 2025", closeDate: "Oct 30, 2025", status: "Upcoming" },
];

// ============================================================
// Success stories
// ============================================================
const SUCCESS_STORIES = [
  {
    name: "Anjali Kumari", scholarship: "Need-Based (100%)", program: "FDE",
    role: "Software Engineer @ PhonePe", initials: "AK", ctc: "₹13 LPA",
    quote: "I come from a village in Bihar where girls rarely study past 10th grade. The Need-Based scholarship paid 100% of my fee. Today I send money home and inspire my cousins to dream bigger.",
  },
  {
    name: "Lt. Rohan Verma (Retd.)", scholarship: "Defense (80%)", program: "FDE-FWD",
    role: "Platform Engineer @ Zerodha", initials: "RV", ctc: "₹17 LPA",
    quote: "After 14 years in the Army, I needed a structured path back to civilian tech. The Defense scholarship made it affordable. jobson.id's discipline matched what I knew — and the placement was incredible.",
  },
  {
    name: "Sana Khan", scholarship: "Women in Tech (50%)", program: "DSAI",
    role: "AI Marketing Engineer @ Zoho", initials: "SK", ctc: "₹11 LPA",
    quote: "I was the only woman in my engineering college. The Women in Tech scholarship wasn't just money — it was a community. I now mentor 3 incoming scholars every cohort.",
  },
  {
    name: "Vikram Patel", scholarship: "Merit (40%)", program: "FDE-FWD",
    role: "AI Engineer @ Postman", initials: "VP", ctc: "₹18 LPA",
    quote: "I scored in the top 0.5% on the diagnostic and won the Merit scholarship. It covered 40% of my fee. I'm now building LLM features used by millions of developers.",
  },
];

// ============================================================
// Eligibility FAQ
// ============================================================
const ELIGIBILITY_FAQS = [
  {
    q: "Can I apply for multiple scholarships?",
    a: "Yes — you can apply for up to 2 scholarships simultaneously. However, you can only receive one. The scholarship committee will award you the higher-value one if you qualify for both. Merit + Need-Based is a common combination.",
  },
  {
    q: "When do I apply for a scholarship — before or after admission?",
    a: "You apply for admission first. Once you clear the admissions diagnostic, you'll receive a scholarship application link. Submit your scholarship application within 7 days of admission to be considered for the upcoming cohort.",
  },
  {
    q: "What documents do I need to submit?",
    a: "It varies by scholarship. Merit: academic transcripts, hackathon/research certificates. Need-Based: income certificate (EWS/OBC-NCL/SC/ST), bank statements, ITR. Women in Tech: 500-word essay. Defense: service/discharge/dependent certificate. All documents are verified by our team and a third-party agency.",
  },
  {
    q: "Does the scholarship cover Pay After Placement fees too?",
    a: "Yes. Scholarships are applied to the total program fee, whether you choose the upfront or PAP track. A 50% scholarship on a ₹2L program means you pay ₹1L — either upfront or as a reduced PAP obligation.",
  },
  {
    q: "What if my financial situation changes during the program?",
    a: "If your family income drops by more than 25% during the program (job loss, medical emergency, etc.), you can apply for a mid-program scholarship review. We've granted emergency top-ups in 8% of cases historically.",
  },
  {
    q: "Are scholarships available for international applicants?",
    a: "Currently, scholarships are available only for Indian residents. We're piloting a South Asia scholarship for SAARC applicants in 2025 — reach out if you'd like to be notified when it launches.",
  },
];

const STATS = [
  { label: "Scholarships awarded", value: "₹4.2 Cr+", hint: "Cumulative since 2023", icon: Wallet, tone: "brand" as const },
  { label: "Scholars enrolled", value: "480+", hint: "Across 3 cohorts", icon: Users, tone: "success" as const },
  { label: "Avg. scholarship value", value: "₹87,500", hint: "Per scholar", icon: TrendingUp, tone: "brand" as const },
  { label: "Scholar placement rate", value: "96%", hint: "Within 6 months", icon: GraduationCap, tone: "brand" as const },
];

export function PublicScholarship() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1 border border-brand/30 bg-brand/10 text-brand">
            <Award className="h-3 w-3" /> Scholarships
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Talent has no postcode. <span className="text-brand">Funding shouldn&apos;t either.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Four scholarship programs. ₹4.2 Cr+ awarded across 480+ scholars. If you have the
            aptitude and the drive, we&apos;ll find a way to fund your education.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => toast.success("Scholarship application started!", {
              description: "First, complete your program application. The scholarship form will be unlocked after you clear the diagnostic.",
            })} className="gap-1.5">
              <Rocket className="h-4 w-4" /> Apply for Scholarship
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast("A counselor will reach out within 24 hours.", {
              description: "Mon–Sat, 9 AM – 8 PM IST. You can also call +91-80-4567-8900.",
            })} className="gap-1.5">
              <PhoneCall className="h-4 w-4" /> Talk to a Counselor
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              hint={s.hint}
              tone={s.tone}
              icon={<s.icon className="h-5 w-5" />}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Cumulative figures since 2023. Illustrative — actual scholarship awards are need and merit based.
        </p>
      </section>

      {/* ===================== SCHOLARSHIP TYPES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">4 scholarship programs</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose the one that fits your story. You can apply for up to 2 simultaneously.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {SCHOLARSHIP_TYPES.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.id}
                className="flex h-full flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderTopColor: s.accent, borderTopWidth: 4 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${s.accent}1A`, color: s.accent }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="border text-xs font-semibold"
                    style={{ color: s.accent, borderColor: s.accent, backgroundColor: `${s.accent}14` }}>
                    {s.amount}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>

                <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Coverage</p>
                  <p className="text-sm font-semibold text-brand">{s.coverage}</p>
                </div>

                <div className="mt-4 flex-1">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Eligibility
                  </p>
                  <ul className="space-y-1.5">
                    {s.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: s.accent }} />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Started ${s.title} application`, {
                      description: "Complete your program application first, then the scholarship form will unlock.",
                    })}
                    className="w-full gap-1.5"
                  >
                    <FileText className="h-4 w-4" /> Apply for {s.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===================== DEADLINES ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Cohort deadlines</h2>
            <p className="mt-2 text-sm text-muted-foreground">Scholarship applications close 2 weeks before each cohort starts.</p>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-3">Cohort</th>
                    <th className="p-3">Scholarships open</th>
                    <th className="p-3">Opens</th>
                    <th className="p-3">Closes</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DEADLINES.map((d) => (
                    <tr key={d.cohort} className="hover:bg-muted/50">
                      <td className="p-3 font-medium">{d.cohort}</td>
                      <td className="p-3 text-muted-foreground">{d.scholarship}</td>
                      <td className="p-3 text-muted-foreground">{d.openDate}</td>
                      <td className="p-3 text-muted-foreground">{d.closeDate}</td>
                      <td className="p-3">
                        <Badge variant={d.status === "Open" ? "default" : "secondary"}
                          className={d.status === "Open" ? "bg-brand text-primary-foreground" : ""}>
                          {d.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* ===================== SUCCESS STORIES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Scholar success stories</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real scholars. Real outcomes. Real impact.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {SUCCESS_STORIES.map((s) => (
            <Card key={s.name} className="flex h-full flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="border border-brand/40 text-brand">{s.scholarship}</Badge>
                <Badge variant="outline" className="text-xs">{s.program}</Badge>
              </div>
              <Quote className="h-6 w-6 text-brand/40" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <AvatarLogo text={s.initials} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.role}</p>
                </div>
                <Badge variant="secondary" className="ml-auto border border-brand/40 text-brand">{s.ctc}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== ELIGIBILITY FAQ ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Eligibility &amp; process</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need to know about applying for and receiving a scholarship.</p>
          </div>
          <Card className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {ELIGIBILITY_FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-4">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1 border border-brand/40 text-brand">
                <Sparkles className="h-3 w-3" /> Apply today
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Don&apos;t let finances stop your career</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Apply to a program, take the diagnostic, then submit your scholarship application.
                Decisions are made within 7 days of submission.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Next scholarship deadline: <span className="font-medium text-foreground">Feb 15, 2025</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Explore Programs
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "pay-after-placement")} className="gap-1.5">
                <Wallet className="h-4 w-4" /> Pay After Placement
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
