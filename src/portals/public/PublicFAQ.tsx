"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle, Search, ArrowRight, MessageSquare, Mail, Phone,
  GraduationCap, Briefcase, Wallet, Award, Trophy, Sparkles,
} from "lucide-react";

interface FAQ {
  id: string;
  category: string;
  q: string;
  a: string;
}

const CATEGORIES = ["All", "Programs", "Admissions", "Payments", "Scholarships", "Placements", "General"] as const;

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "faq-1",
    category: "Programs",
    q: "What programs does jobson.id Academy offer?",
    a: "We offer six tracks: Forward Deployment Engineer (FDE), Data Science & AI Engineer (DSAI), Forward Deployed Data Engineer (FDE-FWD), Corporate Leadership Track, Corporate Upskilling Bootcamp, and Engineering Foundations. Each is mentor-led with a Pay-After-Placement option.",
  },
  {
    id: "faq-2",
    category: "Programs",
    q: "How long are the programs?",
    a: "Program durations range from 6 weeks (Corporate Upskilling) to 20 weeks (DSAI). Most full programs run 14–16 weeks. See the Academy & Training page for per-program durations, mode, and level.",
  },
  {
    id: "faq-3",
    category: "Admissions",
    q: "What are the eligibility criteria for admission?",
    a: "Most programs require a bachelor's degree (any discipline) and basic programming familiarity. Foundations and FDE accept early-career applicants; DSAI and FDE-FWD prefer intermediate Python/SQL. The Corporate Leadership Track requires 5+ years of experience.",
  },
  {
    id: "faq-4",
    category: "Admissions",
    q: "How do I apply and what's the timeline?",
    a: "Submit an online application (15 minutes), complete a 60-minute aptitude + coding assessment, and attend a 30-minute fit interview. Decisions are sent within 5 business days. Cohorts start monthly — see the schedule on the Academy page.",
  },
  {
    id: "faq-5",
    category: "Admissions",
    q: "Can I switch programs after starting?",
    a: "Yes, within the first 2 weeks (Foundations phase). After week 2, switching programs requires restarting from Foundations in the new track — your prior work transfers as portfolio credit.",
  },
  {
    id: "faq-6",
    category: "Payments",
    q: "How does Pay-After-Placement (PAP) work?",
    a: "Under PAP, you pay no upfront tuition. After you accept an offer above the agreed threshold (typically ₹6 LPA), you pay a percentage of your CTC (capped) over 12–24 months. Full terms are on the PAP page.",
  },
  {
    id: "faq-7",
    category: "Payments",
    q: "Can I pay upfront instead of PAP?",
    a: "Yes. Upfront tuition is available at a discount relative to PAP's total cost. You can also choose a hybrid: partial upfront + reduced PAP obligation. Talk to our admissions team for current pricing.",
  },
  {
    id: "faq-8",
    category: "Payments",
    q: "What payment methods do you accept?",
    a: "We accept UPI, net banking, credit/debit cards, and EMI through partner banks. For PAP, payments are auto-debited monthly once you start your placed job. GST invoices are provided for all payments.",
  },
  {
    id: "faq-9",
    category: "Scholarships",
    q: "What scholarships are available?",
    a: "We offer four scholarship categories: Merit (₹1L), Need-Based (₹2L), Women in Tech (₹1.5L), and Defense (₹2.5L). Scholarships can cover part or all of upfront tuition, and reduce PAP obligations proportionally.",
  },
  {
    id: "faq-10",
    category: "Scholarships",
    q: "Can I apply for multiple scholarships?",
    a: "Yes. You may apply for any scholarship you're eligible for, and awards can stack up to 100% of tuition. For example, a woman from a low-income background can apply for both Women in Tech and Need-Based.",
  },
  {
    id: "faq-11",
    category: "Placements",
    q: "What's your placement rate and average CTC?",
    a: "Our 2024 placement rate was 94% within 6 months of cohort end. Average CTC across programs was ₹12 LPA, with the top quartile landing ₹18–32 LPA. See the Placements page for per-role breakdowns.",
  },
  {
    id: "faq-12",
    category: "Placements",
    q: "What happens if I don't get placed?",
    a: "Under PAP, you pay nothing. We continue career support — mock interviews, partner intros, resume reviews — for up to 12 months after cohort end. If you still don't land a role, your PAP obligation is waived.",
  },
  {
    id: "faq-13",
    category: "General",
    q: "Are the programs online or in-person?",
    a: "Most programs are online with optional in-person bootcamps in Bengaluru. The Corporate Leadership Track and Corporate Upskilling Bootcamp can be delivered on-site at your office. Cohort mode is listed on each program page.",
  },
  {
    id: "faq-14",
    category: "General",
    q: "Do you provide a certificate on completion?",
    a: "Yes. Every learner who completes a program receives a verifiable jobson.id Academy certificate with a unique ID. We also help you build a portfolio of 3–5 production-grade projects to showcase to employers.",
  },
];

export function PublicFAQ() {
  const { navigate } = useNav();
  const [query, setQuery] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEFAULT_FAQS.filter((f) => {
      const matchesCat = category === "All" || f.category === category;
      if (!matchesCat) return false;
      if (!q) return true;
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    });
  }, [category, query]);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <HelpCircle className="h-7 w-7" />
          </div>
          <Badge className="mb-4 gap-1">Frequently asked questions</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Everything you need to know about <span className="text-brand">jobson.id</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Browse common questions across programs, admissions, payments, scholarships, placements,
            and general queries. Can&apos;t find your answer? Our team is a message away.
          </p>
        </div>
      </section>

      {/* Search + categories */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="pl-9"
              aria-label="Search FAQs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">No matching questions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or category, or reach out to our team directly.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </Button>
          </Card>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Showing {filtered.length} of {DEFAULT_FAQS.length} questions
            </p>
            <Accordion type="single" collapsible className="space-y-3">
              {filtered.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex flex-1 items-start gap-3 pr-2">
                      <Badge variant="secondary" className="shrink-0 font-normal">{f.category}</Badge>
                      <span className="text-sm font-medium">{f.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </section>

      {/* Category quick links */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
            <p className="mt-2 text-sm text-muted-foreground">Jump to the topic you need help with.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { cat: "Programs", icon: GraduationCap, desc: "Tracks, durations, specializations, mentors." },
              { cat: "Admissions", icon: Briefcase, desc: "Eligibility, application process, timelines." },
              { cat: "Payments", icon: Wallet, desc: "PAP, upfront, EMIs, invoices, GST." },
              { cat: "Scholarships", icon: Award, desc: "Merit, need-based, women in tech, defense." },
              { cat: "Placements", icon: Trophy, desc: "Placement rate, CTC, hiring partners, support." },
              { cat: "General", icon: Sparkles, desc: "Mode, certificates, portfolio, career support." },
            ].map((c) => (
              <Card
                key={c.cat}
                className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
                onClick={() => {
                  setCategory(c.cat);
                  setQuery("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.cat}</h3>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-brand transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <MessageSquare className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Still have questions?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Our team responds within one business day. Reach us via chat, email, or phone —
                whichever works best for you.
              </p>
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-brand" /> support@jobson.id
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-brand" /> +91 80 4567 8901
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Contact us <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "programs")} className="gap-1.5">
                Explore programs
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
