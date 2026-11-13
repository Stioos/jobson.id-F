"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck, Layers,
  Globe, Users, TrendingUp, Sparkles, Target, FileText, Clock,
  BarChart3, Calendar, BookOpen, Wallet, Briefcase, ShieldCheck,
  ChevronRight, ArrowRight, ArrowLeft, CheckCircle2, Zap, Brain,
  Cpu, Database, Cloud, Code2, Network, Headphones, RefreshCw,
  Rocket, HeartHandshake, Gauge, Factory, Stethoscope, Banknote,
  ShoppingBag, Home, Cpu as CpuIcon, Truck, Building2, LineChart,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  TALENT_SOLUTIONS_CONFIG, getTalentSolution, getTalentSubPage,
} from "@/data/talentSolutionsConfig";

const ICON_MAP: Record<string, LucideIcon> = {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe,
  Users, TrendingUp, Sparkles, Target, FileText, Clock, BarChart3, Calendar,
  BookOpen, Wallet, Briefcase, ShieldCheck, Zap, Brain, Cpu, Database, Cloud,
  Code2, Network, Headphones, RefreshCw, Rocket, HeartHandshake, Gauge,
  Factory, Stethoscope, Banknote, ShoppingBag, Home, Truck, Building2, LineChart,
};

export function PublicTalentSolutionSubPage({
  solutionKey,
  subPageKey,
}: {
  solutionKey: string;
  subPageKey: string;
}) {
  const { navigate } = useNav();
  const solution = getTalentSolution(solutionKey);
  const subPage = getTalentSubPage(solutionKey, subPageKey);

  if (!solution || !subPage) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Page not found"
          description={`We couldn't find this page.`}
          action={<Button onClick={() => navigate("public", "talent-solutions")} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to Hire Talent</Button>}
        />
      </div>
    );
  }

  const SolutionIcon = ICON_MAP[solution.icon] || Target;
  const SubIcon = ICON_MAP[subPage.icon] || Target;
  const color = solution.color;
  const route = `talent/${solutionKey}`;

  // Generate content for 16 sections based on solution + subPage metadata
  const features = generateFeatures(solution, subPage);
  const steps = generateSteps(solution, subPage);
  const benefits = generateBenefits(solution, subPage);
  const useCases = generateUseCases(solution, subPage);
  const techStack = generateTechStack(solution, subPage);
  const integrations = generateIntegrations(solution, subPage);
  const metrics = generateMetrics(solution, subPage);
  const caseStudies = generateCaseStudies(solution, subPage);
  const testimonials = generateTestimonials(solution, subPage);
  const pricingTiers = generatePricing(solution, subPage);
  const faqs = generateFAQs(solution, subPage);
  const relatedSolutions = solution.subPages.filter(sp => sp.subPageKey !== subPageKey).slice(0, 4);

  return (
    <div className="bg-background">
      {/* ===================== 1. HERO — light split-screen design (emerald theme) ===================== */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="absolute -top-20 right-1/4 h-64 w-96 rounded-full bg-brand/5 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            {/* LEFT: headline + CTAs */}
            <div>
              {/* Navigation pills */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                  <GraduationCap className="h-3 w-3" /> {solution.label}
                </span>
                <button onClick={() => navigate("public", route)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-brand hover:text-brand">
                  <ArrowLeft className="h-3 w-3" /> Back to {solution.label}
                </button>
              </div>
              {/* Headline block */}
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                  <SubIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{subPage.label}</h1>
                  <p className="mt-1 text-sm font-semibold text-brand">{solution.label} — trained on your exact stack</p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{subPage.desc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Request received", { description: "Our team will reach out within 24 hours." })} className="gap-1.5">
                  Talk to a talent expert <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", route)} className="gap-1.5">
                  Back to {solution.label}
                </Button>
              </div>
            </div>

            {/* RIGHT: "Why this program wins" panel */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Why this program wins</span>
              <div className="space-y-5">
                {benefits.slice(0, 3).map(b => {
                  const BIcon = ICON_MAP[b.icon] || Zap;
                  return (
                    <div key={b.title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <BIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <span>Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.</span>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS BAR */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6">
            {[
              { value: "8–12 wks", label: "READY-TO-JOIN" },
              { value: "96%", label: "RETENTION @ 12 MO" },
              { value: "2M+", label: "CANDIDATE POOL" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-brand sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 2. OVERVIEW ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-bold">What is {subPage.label}?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {subPage.desc} This capability is part of our {solution.label} offering, designed to help you
              build, scale, and optimize your workforce with confidence. With {solution.label}, you get
              a dedicated team, proven processes, and transparent metrics — all backed by our 90-day
              replacement guarantee and pay-after-results pricing model.
            </p>
          </div>
          <Card className="p-5" style={{ borderColor: `${color}30` }}>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Why it matters</span>
            <ul className="mt-3 space-y-2">
              {benefits.slice(0, 3).map(b => (
                <li key={b.title} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color }} />
                  <span className="text-muted-foreground"><strong className="text-foreground">{b.title}</strong> — {b.desc}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ===================== 3. KEY FEATURES ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Key features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => {
              const FIcon = ICON_MAP[f.icon] || Zap;
              return (
                <Card key={f.title} className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${color}15`, color }}>
                    <FIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 4. HOW IT WORKS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white" style={{ background: color }}>
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-bold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && <ChevronRight className="absolute -right-3 top-3 hidden h-5 w-5 text-muted-foreground lg:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 5. BENEFITS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Benefits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(b => {
              const BIcon = ICON_MAP[b.icon] || Zap;
              return (
                <div key={b.title} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${color}15`, color }}>
                    <BIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{b.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 6. USE CASES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Use cases</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map(uc => (
            <Card key={uc.title} className="p-5">
              <h3 className="text-sm font-bold">{uc.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{uc.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {uc.tags.map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== 7. COMPARISON ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">jobson.id vs Traditional</h2>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold">Feature</th>
                  <th className="p-3 text-center font-semibold" style={{ color }}>jobson.id</th>
                  <th className="p-3 text-center font-semibold text-muted-foreground">Traditional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Time to deploy", a: "2-4 weeks", b: "8-12 weeks" },
                  { f: "AI-powered matching", a: "Yes", b: "No" },
                  { f: "Replacement guarantee", a: "90 days", b: "30 days" },
                  { f: "Pricing model", a: "Pay after results", b: "Upfront payment" },
                  { f: "Dedicated account manager", a: "Yes", b: "Shared" },
                  { f: "Real-time analytics", a: "Yes", b: "Monthly reports" },
                ].map(r => (
                  <tr key={r.f} className="border-t">
                    <td className="p-3 font-medium">{r.f}</td>
                    <td className="p-3 text-center"><CheckCircle2 className="mx-auto h-4 w-4" style={{ color }} /></td>
                    <td className="p-3 text-center text-muted-foreground">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================== 8. TECH STACK ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Technology & tools</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {techStack.map(t => (
            <span key={t} className="rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ===================== 9. INTEGRATIONS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Integrations</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map(int => (
              <Card key={int.name} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}15`, color }}>
                  <Network className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{int.name}</h3>
                  <p className="text-xs text-muted-foreground">{int.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 10. METRICS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Metrics that matter</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map(m => (
            <StatCard key={m.label} label={m.label} value={m.value} hint={m.hint} tone="brand" icon={<BarChart3 className="h-5 w-5" />} />
          ))}
        </div>
      </section>

      {/* ===================== 11. CASE STUDIES ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Case studies</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {caseStudies.map(cs => (
              <Card key={cs.name} className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">{cs.name}</h3>
                  <Badge variant="outline" className="text-[9px]">{cs.industry}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{cs.challenge}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3">
                  {cs.metrics.map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-sm font-bold" style={{ color }}>{m.value}</div>
                      <div className="text-[9px] text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 12. TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">What clients say</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map(t => (
            <Card key={t.name} className="p-5">
              <p className="text-xs italic text-muted-foreground">"{t.quote}"</p>
              <div className="mt-3 flex items-center gap-2 border-t pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.role}, {t.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== 13. PRICING ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold">Pricing</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <Card key={tier.name} className={`relative p-6 ${i === 1 ? "border-2" : ""}`} style={i === 1 ? { borderColor: color } : {}}>
                {i === 1 && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2" style={{ background: color }}>Most Popular</Badge>}
                <h3 className="text-sm font-bold">{tier.name}</h3>
                <div className="mt-2 text-2xl font-bold">{tier.price}</div>
                <p className="mt-1 text-xs text-muted-foreground">{tier.desc}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" variant={i === 1 ? "default" : "outline"} style={i === 1 ? { background: color } : {}} onClick={() => toast.success("Plan selected", { description: `${tier.name} plan request received.` })}>
                  Get started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 14. FAQ ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Frequently asked questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ===================== 15. CTA ===================== */}
      <section className="border-y" style={{ background: `linear-gradient(to right, ${color}10, transparent)` }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold">Ready to get started with {subPage.label}?</h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Talk to our team today. We'll scope your needs and deliver a tailored proposal within 24 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => toast.success("Request received", { description: "We'll reach out within 24 hours." })} className="gap-1.5" style={{ background: color }}>
                Request a consultation <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", route)}>
                View all {solution.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 16. RELATED SOLUTIONS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold">Related sub-pages</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedSolutions.map(rs => {
            const RIcon = ICON_MAP[rs.icon] || Target;
            return (
              <Card
                key={rs.subPageKey}
                role="button"
                tabIndex={0}
                onClick={() => navigate("public", `talent/${solutionKey}/${rs.subPageKey}`)}
                onKeyDown={e => e.key === "Enter" && navigate("public", `talent/${solutionKey}/${rs.subPageKey}`)}
                className="group cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}15`, color }}>
                  <RIcon className="h-4 w-4" />
                </div>
                <h3 className="mt-2 text-xs font-bold">{rs.label}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{rs.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// CONTENT GENERATORS — generate 16 sections of content from compact config
// ============================================================

function generateFeatures(sol: any, sp: any) {
  return [
    { icon: "Sparkles", title: "AI-Powered Intelligence", desc: `Smart automation and AI-driven insights power every aspect of ${sp.label.toLowerCase()}.` },
    { icon: "ShieldCheck", title: "Enterprise-Grade Security", desc: "SOC 2 compliant, GDPR/DPDP ready, with end-to-end encryption and audit trails." },
    { icon: "Gauge", title: "Real-Time Performance", desc: "Live dashboards and analytics give you full visibility into progress and results." },
    { icon: "RefreshCw", title: "Continuous Optimization", desc: "Our engine learns from every engagement to improve outcomes over time." },
    { icon: "Users", title: "Dedicated Team", desc: `A dedicated account manager and ${sol.label.toLowerCase()} specialist for your account.` },
    { icon: "Zap", title: "Fast Deployment", desc: "From kickoff to first results in 2-4 weeks, not months." },
  ];
}

function generateSteps(sol: any, sp: any) {
  return [
    { title: "Discovery & Scoping", desc: "We understand your needs, goals, and constraints in a free consultation." },
    { title: "Strategy & Planning", desc: `A tailored ${sp.label.toLowerCase()} plan aligned with your business objectives.` },
    { title: "Execution & Delivery", desc: "Our team executes the plan with weekly checkpoints and transparent reporting." },
    { title: "Optimization & Scaling", desc: "We continuously optimize based on data and scale what works." },
    { title: "Review & Report", desc: "Comprehensive reporting with metrics, insights, and recommendations." },
  ];
}

function generateBenefits(sol: any, sp: any) {
  return [
    { icon: "Zap", title: "Faster Results", desc: "Reduce time-to-value by up to 60% with our proven processes." },
    { icon: "Wallet", title: "Lower Cost", desc: "Save up to 40% compared to traditional approaches with pay-after-results pricing." },
    { icon: "ShieldCheck", title: "Reduced Risk", desc: "90-day replacement guarantee and written SLAs protect your investment." },
    { icon: "BarChart3", title: "Better Quality", desc: "AI-powered matching and multi-stage screening ensure top-tier results." },
    { icon: "TrendingUp", title: "Scalable", desc: "From 1 to 1000+ — our infrastructure scales with your needs." },
    { icon: "Headphones", title: "Full Support", desc: "Dedicated account manager and 24/7 support channel." },
  ];
}

function generateUseCases(sol: any, sp: any) {
  return [
    { title: "Startups", desc: "Scale your team fast without compromising on quality.", tags: ["10-50 hires", "Fast growth"] },
    { title: "Enterprises", desc: "Volume hiring with compliance and governance built-in.", tags: ["500+ hires", "Multi-location"] },
    { title: "SMBs", desc: "Cost-effective talent solutions for growing teams.", tags: ["5-20 hires", "Budget-conscious"] },
    { title: "Project Teams", desc: "Specialized talent for time-bound projects and initiatives.", tags: ["Contract", "Project-based"] },
  ];
}

function generateTechStack(sol: any, sp: any) {
  return ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL", "AWS", "Kubernetes", "Docker", "Redis", "Kafka", "GraphQL", "Terraform", "Prometheus", "Grafana", "dbt", "Snowflake"];
}

function generateIntegrations(sol: any, sp: any) {
  return [
    { name: "ATS Integration", desc: "Greenhouse, Lever, Workday, and 20+ ATS platforms." },
    { name: "HRIS Sync", desc: "BambooHR, SAP SuccessFactors, Oracle HCM." },
    { name: "Slack & Teams", desc: "Real-time notifications and approvals in your chat tool." },
    { name: "Email & Calendar", desc: "Gmail, Outlook, Calendly for seamless scheduling." },
    { name: "Video Interviewing", desc: "Zoom, Google Meet, Microsoft Teams integration." },
    { name: "Background Checks", desc: "Integrated with leading verification providers." },
  ];
}

function generateMetrics(sol: any, sp: any) {
  return [
    { label: "Time to deploy", value: "2-4 wks", hint: "From kickoff to first results" },
    { label: "Success rate", value: "96%", hint: "Engagement success metric" },
    { label: "Cost savings", value: "40%", hint: "Vs. traditional approaches" },
    { label: "Retention", value: "94%", hint: "1-year retention rate" },
  ];
}

function generateCaseStudies(sol: any, sp: any) {
  return [
    { name: "FinEdge", industry: "Fintech", challenge: `Needed ${sol.label.toLowerCase()} for a rapid product launch.`, metrics: [{ label: "Time", value: "−58%" }, { label: "Quality", value: "96%" }, { label: "ROI", value: "3.2x" }] },
    { name: "MediCare", industry: "Healthcare", challenge: `Scaling operations across 14 new locations.`, metrics: [{ label: "Roles", value: "320+" }, { label: "Cost", value: "−42%" }, { label: "Time", value: "−35%" }] },
    { name: "RetailMax", industry: "Retail", challenge: `Seasonal demand spike requiring rapid scaling.`, metrics: [{ label: "Deploy", value: "7 days" }, { label: "Scale", value: "200x" }, { label: "Attrition", value: "−28%" }] },
  ];
}

function generateTestimonials(sol: any, sp: any) {
  return [
    { name: "Rajesh Kumar", role: "VP Engineering", company: "FinEdge", initials: "RK", quote: `${sol.label} delivered exactly what we needed. The ${sp.label.toLowerCase()} capability was a game-changer for our team.` },
    { name: "Priya Nair", role: "Head of Talent", company: "MediCare", initials: "PN", quote: `The AI-powered approach saved us 12+ hours per role. ${sp.label} is now core to our hiring strategy.` },
    { name: "Amitabh Sengupta", role: "CHRO", company: "RetailMax", initials: "AS", quote: `We scaled from 200 to 1,700 in 7 days. ${sol.label} is a genuine operating partner, not just a vendor.` },
  ];
}

function generatePricing(sol: any, sp: any) {
  return [
    { name: "Starter", price: "Custom", desc: "For small teams getting started.", features: ["Up to 10 roles", "Email support", "Basic analytics", "30-day guarantee"] },
    { name: "Professional", price: "Custom", desc: "For growing teams that need more.", features: ["Up to 50 roles", "Dedicated manager", "Advanced analytics", "60-day guarantee", "API access"] },
    { name: "Enterprise", price: "Custom", desc: "For large-scale operations.", features: ["Unlimited roles", "24/7 support", "Custom integrations", "90-day guarantee", "SLA + reporting"] },
  ];
}

function generateFAQs(sol: any, sp: any) {
  return [
    { q: `How quickly can we get started with ${sp.label}?`, a: `Most engagements begin within 5-7 business days of contract signing. For ${sol.label}, the first deliverable is typically ready in 2-4 weeks depending on scope.` },
    { q: `What does ${sol.label} cost?`, a: `Pricing depends on volume, complexity, and engagement model. We offer Starter, Professional, and Enterprise plans with transparent per-role or per-project pricing. Contact us for a custom quote.` },
    { q: `Do you offer a replacement guarantee?`, a: `Yes. Every engagement includes a 90-day replacement guarantee. If a placement doesn't work out, we'll find a replacement at no additional cost.` },
    { q: `Can ${sp.label} be customized for our specific needs?`, a: `Absolutely. Every engagement is tailored to your tech stack, domain, processes, and goals. Our discovery call will scope your exact requirements.` },
    { q: `What makes jobson.id different from other providers?`, a: `Three things: (1) AI-powered matching that's transparent and explainable, (2) pay-after-results pricing that aligns our incentives with yours, and (3) a dedicated team that acts as an extension of your workforce.` },
    { q: `How do we get started?`, a: `Book a free consultation. We'll scope your needs, propose a tailored plan, and deliver a proposal within 24 hours. No obligation, no pressure.` },
  ];
}
