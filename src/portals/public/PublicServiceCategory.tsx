"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState, StatCard } from "@/components/common";
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
  UserCheck, Users, Quote, PhoneCall, Mail, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCategoryBySlug, getRelatedCategories, type ServiceCategory, type ServiceItem,
} from "@/data/servicesData";

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


export function PublicServiceCategory({ catSlug }: { catSlug: string }) {
  const { navigate } = useNav();
  const category = getCategoryBySlug(catSlug);

  if (!category) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20">
        <EmptyState
          icon={<Box className="h-6 w-6" />}
          title="Category not found"
          description={`We couldn't find a service category matching "${catSlug}".`}
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
  const related = getRelatedCategories(category.slug, 3);

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("public", "tech-ai-services")}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" /> All services
          </button>
          <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 border text-xs font-semibold"
                style={{ color: category.color, borderColor: `${category.color}40`, backgroundColor: `${category.color}12` }}
              >
                Service category
              </Badge>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                >
                  <CatIcon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    toast.success("Enquiry received", {
                      description: `Our ${category.name} team will be in touch shortly.`,
                    })
                  }
                  className="gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Get Enquiry
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Free consultation booked", {
                      description: "A 45-min slot will be confirmed via email.",
                    })
                  }
                  className="gap-1.5"
                >
                  <PhoneCall className="h-4 w-4" /> Free Consultation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("public", "contact")}
                  className="gap-1.5"
                >
                  <Mail className="h-4 w-4" /> Contact Us
                </Button>
              </div>
            </div>

            {/* Side card */}
            <Card className="p-5" style={{ borderTopColor: category.color, borderTopWidth: 4 }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                At a glance
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Services</dt>
                  <dd className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                    {category.services.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Industries</dt>
                  <dd className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                    {category.industries.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Process steps</dt>
                  <dd className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                    {category.processSteps.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tech stack</dt>
                  <dd className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                    {category.techStack.length}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== KEY BENEFITS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Key benefits</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            What you can expect when you engage our {category.name.toLowerCase()} team.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.keyBenefits.map((b, i) => {
            const BenefitIcon = (ICON_MAP[b.icon] ?? Sparkles);
            return (
              <Card key={i} className="p-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                >
                  <BenefitIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===================== PROCESS STEPS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our delivery process</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A proven, phased approach that de-risks delivery and keeps you informed at every step.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {category.processSteps.map((step, i) => (
              <Card key={i} className="relative h-full p-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                >
                  {step.step}
                </div>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
                {i < category.processSteps.length - 1 && (
                  <ArrowRight
                    className="absolute -right-3 top-9 hidden h-5 w-5 text-muted-foreground lg:block"
                    style={{ color: `${category.color}55` }}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TECH STACK ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Technologies we use</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The frameworks, platforms, and standards our delivery teams rely on.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border bg-background px-3 py-1.5 text-sm"
              style={{ borderColor: `${category.color}30`, color: category.color }}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* ===================== SERVICES LIST ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Services in this category
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.services.length} specialized services under {category.name}.
              </p>
            </div>
            <Badge variant="secondary">{category.services.length} services</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((svc) => (
              <ServiceCard
                key={svc.id}
                svc={svc}
                color={category.color}
                onClick={() => navigate("public", `services/${category.slug}/${svc.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {category.stats.map((s, i) => (
            <StatCard
              key={i}
              label={s.label}
              value={s.value}
              tone="brand"
              icon={<BarChart3 className="h-5 w-5" />}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Illustrative figures — demo data is simulated.
        </p>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real outcomes from teams who engaged our {category.name.toLowerCase()} services.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {category.testimonials.map((t, i) => (
              <Card key={i} className="flex h-full flex-col p-6">
                <Quote className="h-6 w-6" style={{ color: category.color }} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Common questions about {category.name.toLowerCase()}.
          </p>
        </div>
        <Card className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {category.faqs.map((f, i) => (
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
      </section>

      {/* ===================== RELATED CATEGORIES ===================== */}
      {related.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Related categories</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Often combined with {category.name}.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((rc) => {
                const RIcon = (ICON_MAP[rc.icon] ?? Sparkles);
                return (
                  <Card
                    key={rc.slug}
                    className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => navigate("public", `services/${rc.slug}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${rc.color}1A`, color: rc.color }}
                      >
                        <RIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">{rc.name}</h3>
                        <p className="text-xs text-muted-foreground">{rc.services.length} services</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden p-8 sm:p-12" style={{ borderColor: `${category.color}40`, background: `linear-gradient(135deg, ${category.color}10, transparent)` }}>
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to engage our {category.name} team?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us your goals and timeline. We&apos;ll come back with a fixed-scope proposal
                or a flexible retainer plan within one business day.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {["Free 45-min consultation", "Fixed-scope or retainer models", "Senior architects, not juniors", "NDA-ready in 24 hours"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" style={{ color: category.color }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                size="lg"
                onClick={() =>
                  toast.success("Consultation requested", {
                    description: "We'll reach out within one business day.",
                  })
                }
                className="gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Get Started
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
        </Card>
      </section>
    </div>
  );
}

function ServiceCard({
  svc, color, onClick,
}: { svc: ServiceItem; color: string; onClick: () => void }) {
  const Icon = (ICON_MAP[svc.icon] ?? Sparkles);
  return (
    <Card
      className="group flex h-full cursor-pointer flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <h3 className="mt-3 text-base font-semibold leading-tight">{svc.name}</h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {svc.shortDesc}
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
        View service details <ArrowRight className="h-3 w-3" />
      </div>
    </Card>
  );
}
