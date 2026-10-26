"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  UserCheck, Users, Quote, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  getProfessionalService, type ProfessionalService,
} from "@/data/professionalServicesData";

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


export function PublicProfessionalServiceDetail({ slug }: { slug: string }) {
  const { navigate } = useNav();
  const svc = getProfessionalService(slug);

  if (!svc) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20">
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="Service not found"
          description={`We couldn't find a professional service matching "${slug}".`}
          action={
            <Button onClick={() => navigate("public", "professional-services")} className="gap-1.5">
              <ArrowRight className="h-4 w-4" /> Back to professional services
            </Button>
          }
        />
      </div>
    );
  }

  const SvcIcon = (ICON_MAP[svc.icon] ?? Sparkles);
  const accent = svc.color;

  // Related services (resolve slugs to ProfessionalService objects)
  const related = svc.relatedServices
    .map((s) => getProfessionalService(s))
    .filter((s): s is ProfessionalService => Boolean(s));

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("public", "professional-services")}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" /> All professional services
          </button>
          <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 border text-xs font-semibold"
                style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}12` }}
              >
                Professional service · {svc.num}
              </Badge>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <SvcIcon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    {svc.name}
                  </h1>
                  <p className="mt-1.5 text-sm font-medium" style={{ color: accent }}>
                    {svc.subtitle}
                  </p>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                    {svc.desc}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    toast.success("Discovery call requested", {
                      description: "We'll reach out within 24 hours to schedule.",
                    })
                  }
                  className="gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Book Free Discovery Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("public", "contact")}
                  className="gap-1.5"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Side stats card */}
            <Card className="p-5" style={{ borderTopColor: accent, borderTopWidth: 4 }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                At a glance
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-4">
                {svc.stats.slice(0, 4).map((s, i) => (
                  <div key={i}>
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="mt-1 text-xl font-bold" style={{ color: accent }}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== OVERVIEW ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{svc.overview.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {svc.overview.desc}
            </p>
          </div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Before vs After</h3>
            <ul className="mt-3 space-y-3 text-xs">
              {svc.compareBeforeAfter.slice(0, 4).map((c, i) => (
                <li key={i} className="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground line-clamp-2">
                    {c.before}
                  </span>
                  <ArrowRight className="hidden h-3 w-3 text-brand sm:block" />
                  <span
                    className="rounded-md px-2 py-1 line-clamp-2"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    {c.after}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ===================== FEATURES GRID ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What&apos;s included</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The capabilities and methodologies you get with {svc.subtitle.toLowerCase()}.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {svc.features.map((f, i) => {
              const FIcon = (ICON_MAP[f.icon] ?? Sparkles);
              return (
                <Card key={i} className="p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <FIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A clear, step-by-step process — so you know exactly what to expect.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {svc.howItWorks.map((s, i) => (
            <Card key={i} className="relative h-full p-5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: `${accent}1A`, color: accent }}
              >
                {s.step}
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-tight">{s.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{s.desc}</p>
              {i < svc.howItWorks.length - 1 && (
                <ArrowRight
                  className="absolute -right-3 top-4 hidden h-4 w-4 lg:block"
                  style={{ color: `${accent}55` }}
                />
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== BENEFITS ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Benefits</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              What changes for you after engaging this service.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {svc.benefits.map((b, i) => {
              const BIcon = (ICON_MAP[b.icon] ?? Sparkles);
              return (
                <Card key={i} className="p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <BIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== DELIVERABLES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Deliverables</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Concrete artifacts you&apos;ll receive during and after the engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {svc.deliverables.map((d, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{d.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== WHO IS IT FOR ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who is it for</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If you see yourself in any of these profiles, this service is a strong fit.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {svc.whoIsFor.map((w, i) => (
              <Card key={i} className="p-5">
                <h3 className="text-base font-semibold">{w.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {w.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROCESS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The process</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Phase-by-phase breakdown of how the engagement unfolds.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {svc.process.map((p, i) => (
            <Card key={i} className="p-5">
              <Badge
                variant="outline"
                className="border text-[10px] font-semibold"
                style={{ color: accent, borderColor: `${accent}40` }}
              >
                {p.phase}
              </Badge>
              <h3 className="mt-3 text-sm font-semibold leading-tight">{p.title}</h3>
              <ul className="mt-3 max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {p.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    {it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== TECH TOOLS ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tools &amp; platforms we use</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The technology stack powering this service.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {svc.techTools.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border bg-background px-3 py-1.5 text-sm"
                style={{ borderColor: `${accent}30`, color: accent }}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SUCCESS METRICS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Success metrics</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How we measure success — and the benchmarks we hit.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {svc.successMetrics.map((m, i) => (
            <Card key={i} className="p-5" style={{ borderTopColor: accent, borderTopWidth: 3 }}>
              <p className="text-2xl font-bold" style={{ color: accent }}>
                {m.value}
              </p>
              <h3 className="mt-1 text-sm font-semibold">{m.metric}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{m.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== INDUSTRIES ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Industries covered</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve delivered this service across these verticals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {svc.industries.map((ind, i) => (
              <Card key={i} className="flex items-center gap-3 p-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Factory className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{ind}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      {svc.testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real outcomes from professionals who used this service.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {svc.testimonials.map((t, i) => {
              const initials = t.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");
              return (
                <Card key={i} className="flex h-full flex-col p-6">
                  <Quote className="h-6 w-6" style={{ color: accent }} />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t pt-4">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ===================== RELATED SERVICES ===================== */}
      {related.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Related services</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Often combined with this one for a more complete career strategy.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("public", "professional-services")}
                className="gap-1.5"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const RIcon = (ICON_MAP[r.icon] ?? Sparkles);
                return (
                  <Card
                    key={r.slug}
                    className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => navigate("public", `professional-services/${r.slug}`)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                      >
                        <RIcon className="h-5 w-5" />
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: r.color }}
                      >
                        {r.num}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-tight">{r.name}</h3>
                    <p className="mt-1 text-xs" style={{ color: r.color }}>
                      {r.subtitle}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{r.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card
          className="overflow-hidden p-8 sm:p-12"
          style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}10, transparent)` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {svc.ctaTitle}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">{svc.ctaDesc}</p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {["Free 30-min discovery call", "Senior coach, not a junior", "Personalized action plan", "Pay-after-placement options"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" style={{ color: accent }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                size="lg"
                onClick={() =>
                  toast.success("Discovery call requested", {
                    description: "We'll reach out within 24 hours to schedule.",
                  })
                }
                className="gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Book Free Discovery Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
