"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  HelpCircle, Search, MessageSquare, Mail, ArrowRight,
  Building2, GraduationCap, Wrench, Cpu, Brain, Users2,
  Handshake, Wallet, LifeBuoy, Cog, Sparkles,
} from "lucide-react";

interface Faq {
  q: string;
  a: string;
  category: string;
}

const FAQS: Faq[] = [
  // General
  { category: "General", q: "What is the JOBSONN Franchise / Partner Program?", a: "JOBSONN's Partner Program lets independent operators co-build a talent business on our platform. We offer 6 models — Centre, College, Service, Technology, AI, and Recruitment — each with its own scope, capabilities, and revenue share rules. You bring local expertise and delivery; we bring curriculum, technology, certification, leads, and settlements." },
  { category: "General", q: "Who can apply to become a partner?", a: "Any registered business or institution meeting the model-specific requirements can apply. We welcome training companies, colleges, IT services firms, system integrators, AI startups, and staffing agencies. Individuals cannot apply directly — you need a registered entity (Pvt Ltd / LLP / Trust / Society)." },
  { category: "General", q: "How is JOBSONN different from other franchise programs?", a: "Three things: (1) Transparent revenue share rules you can audit in your dashboard, (2) full LMS + CRM + certification + wallet stack included (not bolted-on), and (3) settlement cycles that match your business rhythm — monthly for training models, per-placement for recruitment." },
  { category: "General", q: "What does it cost to apply?", a: "Applying is free. Most models have no upfront franchise fee — instead, revenue is shared per the matched rule. Centre partners may need a refundable security deposit + infrastructure investment; College partners sign an MoU. Detailed commercials are shared during the agreement stage." },
  { category: "General", q: "Can I partner in more than one model?", a: "Yes, after your first model is active for 6+ months with good standing. Many partners start with Centre and add Recruitment later (placement drives), or start with Service and add Technology (OEM licensing)." },

  // Centre
  { category: "Centre", q: "What infrastructure is required for a Centre partner?", a: "Minimum 1,200 sq ft of leased/owned space, at least 2 classrooms + 1 lab, faculty with relevant certifications, and local business registration (GST). Detailed specs are shared after pre-approval. We inspect before signing the agreement." },
  { category: "Centre", q: "Can I run multiple centres under one agreement?", a: "Yes — the master agreement covers all your centres. Each new centre needs to pass inspection and be registered in your partner dashboard before activation. Volume discounts on settlements apply at 3+ centres." },
  { category: "Centre", q: "What programs can I deliver as a Centre partner?", a: "All programs in the JOBSONN catalog (currently 6 active programs across Technology, Data & AI, Marketing, Security, Cloud, and Design). You can also propose custom programs — our curriculum team reviews and (if approved) co-brands them." },

  // College
  { category: "College", q: "What are the college partnership models A–E?", a: "Five flexible MoU structures: (A) Curriculum Integration, (B) Co-branded Centre, (C) Faculty Development, (D) Placement Partnership, (E) Full Campus MoU. Each has different scopes for JOBSONN vs the college and different revenue models. See the College Partner page for details." },
  { category: "College", q: "Can autonomous and affiliated colleges both apply?", a: "Yes. We work with autonomous, affiliated, deemed, and state-private institutions. Autonomous colleges typically pick Model A or B for flexibility; affiliated colleges often pick Model D (placement) or A (curriculum integration as electives)." },
  { category: "College", q: "What is the typical MoU term for a college partnership?", a: "1–5 years, renewable. Model A and D are typically 1–2 years; Model B and E are 3–5 years due to infrastructure investment. Renewal is automatic with mutual consent and performance review." },

  // Service
  { category: "Service", q: "What services can I deliver as a Service partner?", a: "Anything in the JOBSONN service catalog: cloud migration, DevOps pipelines, application maintenance (AMC), data engineering retainers, UI/UX sprints, and security audits. Custom services can be proposed and approved by our delivery team." },
  { category: "Service", q: "How are Service partner engagements sourced?", a: "Mixed: JOBSONN brings enterprise clients via our sales team, and you can bring your own clients into the JOBSONN stack. Lead source determines revenue share — JOBSONN-generated leads share 60/40, partner-generated leads share 75/25 (in your favour)." },
  { category: "Service", q: "What SLA levels are required?", a: "Premium SLAs (24x7 P1 < 1hr) for AMC engagements, Standard SLAs (business hours P1 < 4hr) for project work. Your partner dashboard tracks SLA compliance live; sustained SLA misses trigger a remediation plan." },

  // Technology
  { category: "Technology", q: "What does OEM licensing mean for a Technology partner?", a: "You can co-brand and resell JOBSONN-powered ERP/CRM solutions under your own brand, with JOBSONN as the underlying technology. You earn a margin on every license + a revenue share on implementation services. OEM agreements are typically 3 years." },
  { category: "Technology", q: "What technical certifications are required for my team?", a: "Minimum 5 certified engineers on the JOBSONN platform (certification included in onboarding). For OEM partners, at least 2 Solution Architects. We also encourage (but don't require) AWS / Azure / GCP certifications." },
  { category: "Technology", q: "Can I white-label JOBSONN entirely?", a: "White-labeling is available for Enterprise-tier Technology partners only, and requires a separate white-label addendum. Standard Technology partners co-brand (JOBSONN + partner brand) by default." },

  // AI
  { category: "AI", q: "What GPU credits are provided to AI partners?", a: "Premium-tier AI partners get up to ₹8L of GPU compute credits annually (on AWS / GCP / Azure, redeemable via the partner dashboard). Credits refresh every anniversary. Unused credits expire at the end of the cycle." },
  { category: "AI", q: "What AI products have JOBSONN AI partners shipped?", a: "Document AI (OCR + extraction), NLP chatbots, computer vision QA, and ML platform tooling. The co-sell motion puts your product in front of JOBSONN's enterprise clients — you keep IP ownership and earn on every deployment." },
  { category: "AI", q: "Do I need to use JOBSONN's ML stack?", a: "No — you can use any stack (PyTorch, TensorFlow, JAX, etc.). JOBSONN provides compute credits and co-sell distribution, not a forced ML framework. We do require model cards and bias audits for any AI deployed to enterprise clients." },

  // Recruitment
  { category: "Recruitment", q: "How do I get job orders as a Recruitment partner?", a: "JOBSONN job orders appear in your recruiter dashboard automatically, filtered by your industry specialization. You can also bring your own client mandates into the JOBSONN system — those are 'partner-generated' and earn a higher share (68% vs 40%)." },
  { category: "Recruitment", q: "What is the typical placement fee structure?", a: "Most mandates are 8.33% of annual CTC (permanent), 10% for contract roles, or a fixed fee (₹50K–₹1L) for niche roles. RPO engagements are negotiated separately. The fee is split per the matched revenue share rule." },
  { category: "Recruitment", q: "How soon after placement do I get paid?", a: "Within 7 business days of candidate joining + 15-day lock-in (candidate must not leave). For contract roles, settlements happen monthly based on timesheets. All payments hit your partner wallet; you can withdraw via NEFT/RTGS." },

  // Commercial
  { category: "Commercial", q: "How is revenue share calculated?", a: "We match your partner model + lead source to the highest-priority active revenue share rule, calculate net collected (gross - discount), deduct gateway fee + tax, then apply the partner% / JOBSONN% from the matched rule to the net distributable. Use the revenue calculator to see exactly how it works." },
  { category: "Commercial", q: "When are settlements processed?", a: "Monthly settlement run on the 7th of every month for recurring models (Centre, College, Service, Technology, AI). Per-placement settlements within 7 business days of placement for Recruitment partners. Settlements hit your partner wallet; NEFT/RTGS withdrawals process in 1–2 business days." },
  { category: "Commercial", q: "Are GST and gateway fees deducted before or after the split?", a: "Before. The split applies to the 'net distributable' = gross - discount - gateway fee - tax. This keeps the math transparent and avoids disputes. The matched rule's percentages are applied to this net amount." },
  { category: "Commercial", q: "Can I negotiate different revenue share percentages?", a: "Standard rules apply by default. Enterprise-tier partners with consistent volume can negotiate custom rules in their agreement addendum. Custom rules are visible only to your account; standard rules are public in the partner dashboard." },
  { category: "Commercial", q: "What taxes am I responsible for?", a: "You're responsible for GST on your share of revenue (as a service provider to your students/clients). JOBSONN deducts GST on the gross transaction and pays it; you invoice JOBSONN for your share (post-tax) and handle your own GST filing." },

  // Operations
  { category: "Operations", q: "What tools does JOBSONN provide for operations?", a: "Partner dashboard (CRM + LMS + wallet + settlements), centre/batch management (for Centre/College), engagement tracking (for Service/Tech/AI), job order + ATS tooling (for Recruitment), email templates, and a co-branded marketing kit." },
  { category: "Operations", q: "How do I issue certificates to my students?", a: "From your partner dashboard: navigate to the batch → students → 'Issue certificate' (only after they pass the assessment). Certificates are verifiable on the public JOBSONN certificate verification page. Misuse triggers compliance review." },
  { category: "Operations", q: "Can I bring my own CRM / LMS?", a: "We strongly recommend using the JOBSONN stack (it's how settlements and certifications are tracked). However, integrations are available for popular CRMs (HubSpot, Zoho) and LMSs (Moodle, Canvas) if you need to sync. Custom integrations need approval." },

  // Support
  { category: "Support", q: "What support does JOBSONN provide to partners?", a: "A named partnership manager (1 per partner), partner-only Slack workspace, 24x5 support for critical issues, weekly office hours with the product team, and a partner success playbook. Premium and Enterprise tiers get priority SLAs." },
  { category: "Support", q: "How do I raise a support ticket?", a: "From your partner dashboard → Support → 'Raise ticket'. Tickets are triaged within 4 business hours (Standard) or 1 hour (Premium). For settlement disputes, use the 'Dispute settlement' action — it pauses the settlement until resolution." },
  { category: "Support", q: "Is there a partner community?", a: "Yes — a private Slack workspace with 120+ partners, monthly virtual meetups, and an annual partner summit (Bengaluru, August). The community is your fastest channel for peer advice on operations, hiring, and growth." },
];

const CATEGORIES = ["All", "General", "Centre", "College", "Service", "Technology", "AI", "Recruitment", "Commercial", "Operations", "Support"];

const CATEGORY_ICONS: Record<string, typeof Handshake> = {
  General: Handshake,
  Centre: Building2,
  College: GraduationCap,
  Service: Wrench,
  Technology: Cpu,
  AI: Brain,
  Recruitment: Users2,
  Commercial: Wallet,
  Operations: Cog,
  Support: LifeBuoy,
};

export function PublicPartnerFaqs() {
  const { navigate } = useNav();
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filtered = React.useMemo(() => {
    return FAQS.filter((f) => {
      if (activeCategory !== "All" && f.category !== activeCategory) return false;
      if (query) {
        const q = query.toLowerCase();
        return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, activeCategory]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, Faq[]>();
    for (const f of filtered) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <Badge className="mb-4 gap-1"><HelpCircle className="h-3 w-3" /> Partner FAQs</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Everything you want to know about <span className="text-brand">partnering with JOBSONN</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            30+ answers across 10 categories — General, model-specific, commercial, operations, and support.
            Still have questions? We&apos;re a message away.
          </p>
        </div>
      </section>

      {/* Search + categories */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FAQs — e.g. revenue share, GST, GPU credits…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-9"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} Q&amp;A{filtered.length !== 1 ? "s" : ""}{activeCategory !== "All" && ` in ${activeCategory}`}</span>
          {query && (
            <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setActiveCategory("All"); }} className="h-7 text-xs">
              Clear
            </Button>
          )}
        </div>
      </section>

      {/* FAQ accordion grouped */}
      <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
        {grouped.length === 0 ? (
          <Card className="p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No FAQs match your search</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different keyword or clear the filter.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped.map(([cat, items]) => {
              const Icon = CATEGORY_ICONS[cat] ?? HelpCircle;
              return (
                <div key={cat}>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-wide">{cat}</h2>
                    <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <Card className="p-2 sm:p-3">
                    <Accordion type="single" collapsible className="w-full">
                      {items.map((f, i) => (
                        <AccordionItem key={`${cat}-${i}`} value={`${cat}-${i}`}>
                          <AccordionTrigger className="px-3 text-left text-sm font-medium hover:no-underline">
                            {f.q}
                          </AccordionTrigger>
                          <AccordionContent className="px-3 text-sm leading-relaxed text-muted-foreground">
                            {f.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-10">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <Sparkles className="h-6 w-6 text-brand" />
                <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Still have questions?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our partnership team is one message away. Reach out for a 1:1 walkthrough, model-specific guidance,
                  or commercial clarification.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:w-auto">
                <Button onClick={() => navigate("public", "contact")} className="gap-1.5">
                  <Mail className="h-4 w-4" /> Contact us <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                  <MessageSquare className="h-4 w-4" /> Apply now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
