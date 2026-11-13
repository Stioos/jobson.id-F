"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, Building2, HeartPulse, Landmark, ShoppingBag,
  Factory, GraduationCap, Home, Cpu, Truck, CheckCircle2, Target,
  TrendingUp, Briefcase, Quote, Code2, Database, Cloud, Brain,
  Layers, Server, Shield, Boxes,
} from "lucide-react";

const INDUSTRIES = [
  { id: "healthcare", name: "Healthcare", icon: HeartPulse, color: "#EF4444", desc: "EMR systems, telemedicine, AI diagnostics, and healthcare analytics.", projects: "42", roles: "180+ placed" },
  { id: "finance", name: "Finance & FinTech", icon: Landmark, color: "#0EA5E9", desc: "Core banking, payments, lending platforms, and fraud detection.", projects: "58", roles: "260+ placed" },
  { id: "retail", name: "Retail & E-commerce", icon: ShoppingBag, color: "#F97316", desc: "E-commerce platforms, inventory systems, recommendation engines.", projects: "47", roles: "210+ placed" },
  { id: "manufacturing", name: "Manufacturing", icon: Factory, color: "#8B5CF6", desc: "Industry 4.0, IoT, predictive maintenance, supply chain visibility.", projects: "35", roles: "150+ placed" },
  { id: "edtech", name: "EdTech", icon: GraduationCap, color: "#10B981", desc: "Learning platforms, adaptive learning, content management, LMS.", projects: "29", roles: "130+ placed" },
  { id: "realestate", name: "Real Estate", icon: Home, color: "#F59E0B", desc: "PropTech, listing platforms, virtual tours, CRM automation.", projects: "22", roles: "85+ placed" },
  { id: "it", name: "IT & SaaS", icon: Cpu, color: "#06B6D4", desc: "B2B SaaS, developer tools, platform engineering, observability.", projects: "67", roles: "320+ placed" },
  { id: "logistics", name: "Logistics", icon: Truck, color: "#D4A017", desc: "Route optimization, fleet management, warehouse automation, tracking.", projects: "31", roles: "120+ placed" },
];

const DEEP_DIVES = [
  {
    id: "finance-deep",
    name: "Finance & FinTech",
    color: "#0EA5E9",
    services: ["Core banking modernization", "Payments & UPI integration", "Lending platform engineering", "Fraud detection ML systems", "Regulatory reporting automation", "Wealth management dashboards"],
    caseStudy: {
      client: "FinEdge (Series B FinTech)",
      challenge: "Manual loan underwriting took 7 days; legacy core banking couldn't scale beyond 50K users.",
      solution: "Rebuilt underwriting on an event-driven ML pipeline; migrated to a microservices core on Kubernetes.",
      metrics: [
        { label: "Underwriting time", value: "7 days → 4 hours" },
        { label: "Throughput", value: "50K → 2M users" },
        { label: "Fraud losses", value: "Down 42%" },
      ],
    },
  },
  {
    id: "healthcare-deep",
    name: "Healthcare",
    color: "#EF4444",
    services: ["EMR & EHR systems", "Telemedicine platforms", "AI diagnostics & medical imaging", "Patient engagement apps", "Healthcare analytics & BI", "HIPAA/DPDP compliance engineering"],
    caseStudy: {
      client: "MediCare Chain (12 hospitals)",
      challenge: "Fragmented EMRs across 12 hospitals; no unified patient view; specialists over-booked.",
      solution: "Built a unified FHIR-based EMR with AI triage and appointment optimization across the network.",
      metrics: [
        { label: "Specialist utilization", value: "Up 38%" },
        { label: "Patient wait time", value: "Down 54%" },
        { label: "Diagnostic accuracy", value: "Up 22%" },
      ],
    },
  },
  {
    id: "retail-deep",
    name: "Retail & E-commerce",
    color: "#F97316",
    services: ["E-commerce platform engineering", "Inventory & order management", "Recommendation engines", "Pricing & promotion engines", "Last-mile delivery systems", "Customer 360 platforms"],
    caseStudy: {
      client: "RetailMax (omnichannel retail)",
      challenge: "Online + offline inventory drift; 18% stockouts during peak season; pricing not synced across channels.",
      solution: "Built a real-time inventory sync engine + dynamic pricing model integrated with their ERP and e-com stack.",
      metrics: [
        { label: "Stockouts", value: "18% → 4%" },
        { label: "GMV uplift", value: "+23% peak season" },
        { label: "Order accuracy", value: "99.4%" },
      ],
    },
  },
  {
    id: "it-deep",
    name: "IT & SaaS",
    color: "#06B6D4",
    services: ["SaaS platform engineering", "Developer tooling & APIs", "Multi-tenant architecture", "Platform engineering & DevOps", "Observability & SRE", "Security & compliance engineering"],
    caseStudy: {
      client: "ScaleKit (B2B SaaS, Series A)",
      challenge: "Multi-tenant scaling issues; 4 nines uptime SLAs; on-call burnout at 6 engineers.",
      solution: "Re-platformed on a cell-based multi-tenant architecture with full observability stack and SRE practices.",
      metrics: [
        { label: "Uptime", value: "99.5% → 99.97%" },
        { label: "On-call incidents", value: "Down 71%" },
        { label: "Tenant onboarding", value: "2 weeks → 2 days" },
      ],
    },
  },
];

const TECH_STACK = [
  { name: "Python", icon: Code2 },
  { name: "TypeScript", icon: Code2 },
  { name: "Java", icon: Code2 },
  { name: "Go", icon: Code2 },
  { name: "React", icon: Layers },
  { name: "Node.js", icon: Server },
  { name: "PostgreSQL", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "Redis", icon: Database },
  { name: "Kafka", icon: Layers },
  { name: "AWS", icon: Cloud },
  { name: "Azure", icon: Cloud },
  { name: "GCP", icon: Cloud },
  { name: "Kubernetes", icon: Boxes },
  { name: "Terraform", icon: Server },
  { name: "PyTorch", icon: Brain },
  { name: "TensorFlow", icon: Brain },
  { name: "LangChain", icon: Brain },
  { name: "Snowflake", icon: Database },
  { name: "Salesforce", icon: Briefcase },
  { name: "SAP", icon: Briefcase },
  { name: "Power Platform", icon: Layers },
];

export function PublicIndustriesExperience() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Building2 className="h-3 w-3" /> Industry expertise</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Deep expertise across <span className="text-brand">8 industries</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From FinTech to healthcare to manufacturing — we&apos;ve shipped production systems
            across India&apos;s most demanding industries. Our consultants and engineers come from
            the industries they serve.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "tech-ai-services")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Explore services
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
              Talk to a specialist
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Industries served" value="8" icon={<Building2 className="h-5 w-5" />} tone="brand" />
          <StatCard label="Projects delivered" value="330+" icon={<Briefcase className="h-5 w-5" />} tone="brand" />
          <StatCard label="Specialists placed" value="1,400+" icon={<Code2 className="h-5 w-5" />} tone="brand" />
          <StatCard label="Avg project NPS" value="72" icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
        </div>
      </section>

      {/* Industry grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Industries we serve</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Eight verticals, hundreds of shipped projects, and a deep bench of industry-specific consultants.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => (
            <Card
              key={ind.id}
              className="group flex h-full cursor-pointer flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
              onClick={() => navigate("public", "tech-ai-services")}
              style={{ borderTopColor: ind.color, borderTopWidth: 4 }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ind.color}1A`, color: ind.color }}
                >
                  <ind.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-normal">{ind.projects} projects</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{ind.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{ind.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-muted-foreground">{ind.roles}</span>
                <span className="flex items-center gap-1 text-brand">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Per-industry deep dives */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Target className="h-3 w-3" /> Spotlight industries</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">A closer look at four key verticals</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Services, case studies, and outcome metrics from our flagship industry practices.
            </p>
          </div>
          <div className="space-y-8">
            {DEEP_DIVES.map((d) => (
              <Card key={d.id} className="overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: d.color }}
                />
                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr]">
                  {/* Services */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${d.color}1A`, color: d.color }}
                      >
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <h3 className="text-xl font-bold tracking-tight" style={{ color: d.color }}>
                        {d.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Services offered:</p>
                    <ul className="mt-2 space-y-1.5">
                      {d.services.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: d.color }} />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Case study */}
                  <div className="rounded-xl border bg-background p-5">
                    <Badge variant="secondary" className="mb-3 font-normal">Case study</Badge>
                    <h4 className="font-semibold">{d.caseStudy.client}</h4>
                    <div className="mt-3 space-y-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Challenge</p>
                        <p className="mt-1 text-muted-foreground">{d.caseStudy.challenge}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Solution</p>
                        <p className="mt-1 text-muted-foreground">{d.caseStudy.solution}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
                      {d.caseStudy.metrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <p className="text-[11px] text-muted-foreground">{m.label}</p>
                          <p className="mt-1 text-sm font-bold text-brand">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3 gap-1"><Layers className="h-3 w-3" /> Tech stack</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tools we build with</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A modern, opinionated stack — proven across hundreds of production deployments.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((t) => (
            <div
              key={t.name}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Quote className="mx-auto h-8 w-8 text-brand" />
            <p className="mt-4 text-lg italic leading-relaxed sm:text-xl">
              &ldquo;We don&apos;t hire generalists to fake industry expertise. Every consultant in
              our FinTech practice came from a bank. Every healthcare engineer has shipped an EMR. That
              depth is non-negotiable.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold">Vikram Joshi</p>
            <p className="text-xs text-muted-foreground">VP, Product — jobson.id</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Shield className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Looking for industry-specific expertise?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us about your industry, your stack, and the outcome you&apos;re chasing. We&apos;ll
                match you with consultants who&apos;ve shipped in your space.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Talk to a specialist <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "tech-ai-services")} className="gap-1.5">
                Explore services
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
