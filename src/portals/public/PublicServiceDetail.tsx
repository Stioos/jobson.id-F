"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
  TrendingUp, ArrowRight, Sparkles, ChevronRight, CheckCircle2,
  Layers, ShieldCheck, Zap, Server, FileCode, Settings, Workflow,
  Network, Headphones, Mic, FileSearch, BookOpen, Plug, Monitor,
  Smartphone, GitBranch, Container, HardDrive, Rocket, Send, Filter,
  Activity, AppWindow, ArrowRightLeft, ArrowUpRight, Award, BarChart3,
  Briefcase, Clock, DollarSign, Eye, Factory, FileText, FolderOpen,
  Globe, GraduationCap, Handshake, Layout, LayoutDashboard, Lightbulb,
  Lock, MessageSquare, RefreshCw, Share2, Shield, Sliders, Star, Target,
  UserCheck, Users, Quote, Wallet, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getCategoryBySlug } from "@/data/servicesData";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass, TrendingUp,
  Layers, ShieldCheck, Zap, Server, FileCode, Settings, Workflow, Network,
  Headphones, Mic, FileSearch, BookOpen, Plug, Monitor, Smartphone, GitBranch,
  Container, HardDrive, Rocket, Send, Filter, Activity, AppWindow, ArrowRightLeft,
  ArrowUpRight, Award, BarChart3, Briefcase, Clock, DollarSign, Eye, Factory,
  FileText, FolderOpen, Globe, GraduationCap, Handshake, Layout, LayoutDashboard,
  Lightbulb, Lock, MessageSquare, RefreshCw, Share2, Shield, Sliders, Star,
  Target, UserCheck, Users,
};


// Illustrative starting price (₹) by category slug. Used for the pricing card.
const ILLUSTRATIVE_PRICE: Record<string, number> = {
  "ai-powered-business-solutions": 250000,
  "digital-sales-ai-marketing": 150000,
  "ai-agentic-automation": 300000,
  "open-source-deployment": 200000,
  "custom-software-development": 500000,
  "data-engineering-analytics": 350000,
  "cloud-infrastructure-devops": 280000,
  "ai-ml-model-development": 400000,
  "digital-transformation-consulting": 600000,
};

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function PublicServiceDetail({
  catSlug, svcSlug,
}: { catSlug: string; svcSlug: string }) {
  const { navigate } = useNav();
  const category = getCategoryBySlug(catSlug);
  const service = category?.services.find((s) => s.slug === svcSlug);

  if (!category || !service) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20">
        <EmptyState
          icon={<Box className="h-6 w-6" />}
          title="Service not found"
          description={`We couldn't find a service matching "${svcSlug}" under "${catSlug}".`}
          action={
            <Button onClick={() => navigate("public", "tech-ai-services")} className="gap-1.5">
              <ArrowRight className="h-4 w-4" /> Back to services
            </Button>
          }
        />
      </div>
    );
  }

  const CatIcon = (ICON_MAP[category.icon] ?? Sparkles);
  const SvcIcon = (ICON_MAP[service.icon] ?? Sparkles);
  const accent = category.color;

  // Derive 6 feature cards from service name + category keyBenefits
  const derivedFeatures = category.keyBenefits.slice(0, 6).map((b, i) => ({
    icon: b.icon,
    title: b.title,
    desc: b.desc,
  }));

  // Related services = other services in same category, top 3
  const related = category.services.filter((s) => s.slug !== service.slug).slice(0, 3);

  // Pricing
  const startingPrice = ILLUSTRATIVE_PRICE[category.slug] ?? 200000;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ===================== HERO — dark, clean, single column (no breadcrumb, no split) ===================== */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: `${accent}15` }} />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Badge className="mb-4 border text-xs font-semibold" style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}>
            <CatIcon className="mr-1 h-3 w-3" /> {category.name}
          </Badge>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}1A`, color: accent }}>
              <SvcIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {service.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                {service.shortDesc}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Quote requested", { description: "A senior architect will reach out within 24 hours." })} className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600">
              <Sparkles className="h-4 w-4" /> Get Quote
            </Button>
            <Button variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5 border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white">
              Talk to an expert <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== OVERVIEW ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Overview</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              {service.shortDesc}
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              {category.description}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-white">At a glance</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Category</dt>
                <dd className="font-medium text-white">{category.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Industries served</dt>
                <dd className="font-medium">{category.industries.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Tech in stack</dt>
                <dd className="font-medium">{category.techStack.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Delivery steps</dt>
                <dd className="font-medium">{category.processSteps.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES GRID ===================== */}
      <section className="border-y bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you get</h2>
            <p className="mt-2 text-sm text-slate-400">
              Key capabilities and outcomes included with {service.name}.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {derivedFeatures.map((f, i) => {
              const FIcon = (ICON_MAP[f.icon] ?? Sparkles);
              return (
                <div key={i} className="p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <FIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== TECHNOLOGIES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Technologies</h2>
          <p className="mt-2 text-sm text-slate-400">
            Tech we&apos;d typically deploy for this engagement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border bg-background px-3 py-1.5 text-sm"
              style={{ borderColor: `${accent}30`, color: accent }}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* ===================== INDUSTRIES SERVED ===================== */}
      <section className="border-t bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Industries we serve</h2>
            <p className="mt-2 text-sm text-slate-400">
              We&apos;ve delivered {service.name.toLowerCase()} across these verticals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {category.industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Factory className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RELATED SERVICES ===================== */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Related services</h2>
              <p className="mt-2 text-sm text-slate-400">
                Other {category.name.toLowerCase()} services you may want to explore.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("public", `services/${category.slug}`)}
              className="gap-1.5"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s) => {
              const RIcon = (ICON_MAP[s.icon] ?? Sparkles);
              return (
                <div
                  key={s.id}
                  className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => navigate("public", `services/${category.slug}/${s.slug}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      <RIcon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-tight">{s.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">{s.shortDesc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===================== FAQ ===================== */}
      <section className="border-t bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">FAQ</h2>
            <p className="mt-2 text-sm text-slate-400">
              Common questions about this service.
            </p>
          </div>
          <div className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {category.faqs.slice(0, 4).map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-4">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-400">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
          <p className="mt-2 text-sm text-slate-400">
            Real outcomes from teams who engaged {category.name}.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.testimonials.slice(0, 2).map((t, i) => (
            <div key={i} className="flex h-full flex-col p-6">
              <Quote className="h-6 w-6" style={{ color: accent }} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-slate-400">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden p-8 sm:p-12"
          style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}10, transparent)` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Engage us for {service.name}
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Tell us your goals, current stack, and timeline. We&apos;ll come back with a fixed-scope
                proposal or a flexible retainer plan within one business day.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {["Free 45-min consultation", "Senior-led team", "NDA-ready in 24 hours", "Milestone-based billing"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="h-4 w-4" style={{ color: accent }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                size="lg"
                onClick={() =>
                  toast.success("Quote requested", {
                    description: "A senior architect will reach out within 24 hours.",
                  })
                }
                className="gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Get Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5"
              >
                Contact Sales <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
