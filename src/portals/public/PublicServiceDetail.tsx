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

// ============================================================
// CATEGORY-LEVEL META — shared with the marketplace page so the
// service-detail hero can show project type / duration / rating.
// ============================================================
const CATEGORY_HERO_META: Record<string, {
  projectType: string;
  duration: string;
  rating: number;
  reviews: number;
  tags: string[];
}> = {
  "ai-powered-business-solutions": { projectType: "Engagement", duration: "8-12 weeks", rating: 4.9, reviews: 175, tags: ["AI Agents", "Process Automation", "Enterprise AI"] },
  "digital-sales-ai-marketing": { projectType: "Retainer", duration: "Ongoing", rating: 4.8, reviews: 142, tags: ["SEO & GEO", "Outbound AI", "Revenue Ops"] },
  "ai-agentic-automation": { projectType: "Project", duration: "6-10 weeks", rating: 4.9, reviews: 98, tags: ["Custom Agents", "Multi-Agent", "Workflow AI"] },
  "open-source-deployment": { projectType: "Project", duration: "4-8 weeks", rating: 4.7, reviews: 86, tags: ["Self-Hosted", "Private Cloud", "DevOps"] },
  "custom-software-development": { projectType: "Project", duration: "8-12 weeks", rating: 4.9, reviews: 211, tags: ["Web Apps", "SaaS", "Mobile"] },
  "data-engineering-analytics": { projectType: "Project", duration: "8-14 weeks", rating: 4.8, reviews: 124, tags: ["Warehousing", "BI Dashboards", "Predictive AI"] },
  "cloud-infrastructure-devops": { projectType: "Engagement", duration: "6-12 weeks", rating: 4.9, reviews: 167, tags: ["Kubernetes", "CI/CD", "IaC"] },
  "ai-ml-model-development": { projectType: "Project", duration: "8-14 weeks", rating: 4.9, reviews: 134, tags: ["LLMs", "Computer Vision", "MLOps"] },
  "digital-transformation-consulting": { projectType: "Retainer", duration: "12-24 weeks", rating: 4.8, reviews: 92, tags: ["AI Strategy", "Transformation", "Governance"] },
};

// ============================================================
// TWO-LINE ATTRACTIVE TITLES per service slug.
// First line = the punchy outcome; second line = the "how/what".
// Falls back to the service name if no entry.
// ============================================================
const ATTRACTIVE_TITLES: Record<string, [string, string]> = {
  // ---- AI-Powered Business Solutions (6) ----
  "ai-business-process-automation": ["Automate Your Business Processes", "with AI That Works 24/7"],
  "ai-customer-support-solutions": ["Delight Every Customer with", "AI Support That Never Sleeps"],
  "ai-document-intelligence": ["Turn Documents into Data", "with AI That Reads & Extracts"],
  "ai-knowledge-management": ["Build a Brain for Your Company", "with AI Knowledge Management"],
  "ai-voice-chat-assistants": ["Deploy AI Voice & Chat Assistants", "That Feel Human to Every Caller"],
  "enterprise-ai-integration": ["Integrate AI into Your Enterprise", "Stack End-to-End, Production-Ready"],
  // ---- Digital Sales & AI Marketing (12) ----
  "ai-digital-marketing": ["Scale Your Marketing with AI", "That Learns, Optimizes & Converts"],
  "seo-geo-ai-content-marketing": ["Rank Higher with AI-Powered SEO", "& Content Search Engines Love"],
  "search-engine-social-media-marketing": ["Be Everywhere Your Customers Are", "with AI-Driven Search & Social"],
  "ai-social-media-automation": ["Grow Your Social Presence", "on Autopilot with AI Engagement"],
  "ai-sales-funnel-automation": ["Build Funnels That Convert Themselves", "with AI-Powered Sales Automation"],
  "crm-lead-automation": ["Never Let a Lead Go Cold Again", "with AI-Powered CRM & Lead Automation"],
  "ai-market-research-customer-intelligence": ["Know Your Market Before You Enter", "with AI-Powered Research & Intel"],
  "ai-lead-generation-prospecting": ["Find Buyers Before They Find You", "with AI-Powered Lead Generation"],
  "ai-outbound-sales-outreach": ["Book More Meetings with AI Outbound", "That Books While You Sleep"],
  "ai-account-based-marketing": ["Win the Accounts That Matter", "with AI-Powered ABM Strategies"],
  "ai-paid-advertising-campaign-strategy": ["Make Every Ad Dollar Count", "with AI-Powered Advertising Strategy"],
  "ai-sales-enablement-revenue-intelligence": ["Equip Your Team to Close More", "with AI Sales Enablement"],
  // ---- AI Agentic & Automation (6) ----
  "custom-ai-agents": ["Build Autonomous AI Agents", "That Get Things Done Without You"],
  "multi-agent-systems": ["Deploy Multi-Agent AI Swarms", "That Solve Complex Tasks Together"],
  "ai-workflow-automation": ["Connect Your Tools & Automate", "the Busywork with AI Workflows"],
  "ai-manufacturing-process-automation": ["Automate Your Factory Floor", "with AI That Optimizes in Real-Time"],
  "ai-recruitment-automation": ["Automate Your Hiring Pipeline", "with AI That Screens & Shortlists"],
  "ai-operations-automation": ["Run Your Operations on Autopilot", "with AI That Monitors 24/7"],
  // ---- Open Source Deployment (6) ----
  "self-hosted-ai-platform-deployment": ["Deploy Your Own AI Platform", "with Zero Vendor Lock-In"],
  "erp-portal-deployment": ["Deploy ERPs & Portals That", "Your Team Actually Wants to Use"],
  "custom-apps-platforms-deployment": ["Ship Custom Apps & Platforms", "Deployed by Senior Architects"],
  "devops-platform-deployment": ["Deploy a Complete DevOps Platform", "Stack in Under a Week"],
  "monitoring-observability": ["See Everything, Miss Nothing", "with AI-Powered Monitoring"],
  "private-cloud-deployment": ["Deploy Your Own Private Cloud", "with Security & Control"],
  // ---- Custom Software Development (6) ----
  "enterprise-web-applications": ["Build Enterprise Web Apps", "That Scale to Millions of Users"],
  "saas-development": ["Launch Your SaaS Product with", "Multi-Tenant Architecture Built to Scale"],
  "mobile-apps": ["Ship Mobile Apps for iOS & Android", "from One Codebase, Built to Scale"],
  "erp-crm-development": ["Build Custom ERPs & CRMs", "That Fit Your Business Perfectly"],
  "api-development-integration": ["Connect Everything with APIs", "That Are Fast, Reliable & Secure"],
  "legacy-modernization": ["Modernize Your Legacy Systems", "Without Downtime or Data Loss"],
  // ---- Data Engineering & Analytics (6) ----
  "data-warehousing": ["Build a Single Source of Truth", "with Modern Data Warehousing"],
  "etl-elt": ["Move & Transform Data at Scale", "with Production-Grade ETL/ELT Pipelines"],
  "bi-dashboards": ["See Your Business in Real-Time", "with BI Dashboards That Actually Work"],
  "real-time-analytics": ["Make Decisions Powered by Live Data", "with Real-Time Analytics"],
  "data-lakes": ["Build Data Lakes That Store", "Everything, Query Anything"],
  "predictive-analytics": ["See What's Coming Before It Arrives", "with AI-Powered Predictive Analytics"],
  // ---- Cloud Infrastructure & DevOps (6) ----
  "cloud-migration": ["Move to the Cloud with", "Zero Downtime & Full Data Integrity"],
  "kubernetes": ["Orchestrate Containers at Scale", "with Kubernetes Done Right"],
  "ci-cd-automation": ["Ship Code with Confidence", "with CI/CD Pipelines That Just Work"],
  "infrastructure-as-code": ["Provision Infrastructure in Minutes", "with Terraform & IaC"],
  "cloud-security": ["Lock Down Your Cloud End-to-End", "with Enterprise-Grade Security"],
  "managed-devops": ["We Run Your DevOps, You Ship", "with Managed DevOps 24/7"],
  // ---- AI / ML Model Development (6) ----
  "machine-learning": ["Deploy ML Models That Predict,", "Recommend & Drive Decisions"],
  "llm-development": ["Build Custom Large Language Models", "Tuned to Your Domain & Data"],
  "computer-vision": ["See, Detect & Classify from Images", "with Production-Grade Vision AI"],
  "nlp-solutions": ["Understand & Generate Human Language", "with AI-Powered NLP"],
  "mlops": ["Deploy, Monitor & Scale ML Models", "with MLOps Built for Production"],
  "model-fine-tuning": ["Fine-Tune Foundation Models", "for Your Specific Domain & Use Case"],
  // ---- Digital Transformation Consulting (6) ----
  "ai-strategy": ["Get a Roadmap for AI", "Not Guesswork, a Real Strategy"],
  "digital-transformation": ["Re-Architect Your Business", "for the AI Era — End to End"],
  "process-reengineering": ["Redesign Your Workflows for the AI Era", "with Proven Methodology"],
  "technology-architecture": ["Build a Technology Foundation", "That Lasts for the Next Decade"],
  "it-modernization": ["Bring Your Tech Stack into Today", "with IT Modernization"],
  "ai-governance": ["Deploy AI That's Safe, Compliant", "& Trusted with Proper Governance"],
};

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
            <Button onClick={() => navigate("public", "tech-ai-services")} className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
              <ArrowRight className="h-4 w-4" /> Back to services
            </Button>
          }
        />
      </div>
    );
  }

  const SvcIcon = (ICON_MAP[service.icon] ?? Sparkles);
  const accent = category.color;

  // Hero meta for this category (project type, duration, rating, tags)
  const heroMeta = CATEGORY_HERO_META[category.slug] ?? {
    projectType: "Project", duration: "8-12 weeks", rating: 4.9, reviews: 120, tags: ["Enterprise", "Senior Team"],
  };

  // Two-line attractive title (falls back to service name on line 1)
  const titleParts = ATTRACTIVE_TITLES[service.slug] ?? [service.name, ""];

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
  void startingPrice;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===================== HERO — two-column (left: content, right: preview card) ===================== */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand/5 via-background to-background">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-10 right-1/4 h-64 w-64 rounded-full blur-3xl" style={{ background: `${accent}10` }} />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            {/* ---------------- LEFT: main content ---------------- */}
            <div className="flex flex-col">
              {/* Breadcrumbs + top tags */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <button
                    onClick={() => navigate("public", "tech-ai-services")}
                    className="transition-colors hover:text-brand"
                  >
                    Pro Services
                  </button>
                  <ChevronRight className="h-3 w-3 text-border" />
                  <button
                    onClick={() => navigate("public", `services/${category.slug}`)}
                    className="transition-colors hover:text-brand"
                  >
                    {category.name}
                  </button>
                  <ChevronRight className="h-3 w-3 text-border" />
                  <span className="text-foreground">{service.slug}</span>
                </nav>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                    Professional Service
                  </span>
                  <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </div>

              {/* Icon tile + headline */}
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, color: "#fff" }}
                >
                  <SvcIcon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.1rem] lg:leading-[1.15]">
                    <span className="block">{titleParts[0]}</span>
                    {titleParts[1] && (
                      <span className="block text-brand">{titleParts[1]}</span>
                    )}
                  </h1>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {service.shortDesc}
              </p>

              {/* Metadata row: project type · duration · rating */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" style={{ color: accent }} />
                  <span className="font-medium text-foreground">{heroMeta.projectType}</span>
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" style={{ color: accent }} />
                  <span className="font-medium text-foreground">{heroMeta.duration}</span>
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-brand text-brand" />
                  <span className="font-semibold text-brand">{heroMeta.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({heroMeta.reviews} reviews)</span>
                </span>
              </div>

              {/* Category tag pills */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {heroMeta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  Fixed Scope
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  Senior Team
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() =>
                    toast.success("Quote requested", {
                      description: "A senior architect will reach out within 24 hours.",
                    })
                  }
                  className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Sparkles className="h-4 w-4" /> Get a Quote <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("public", "contact")}
                  className="gap-1.5 border-border bg-card text-foreground hover:bg-accent hover:text-foreground"
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>

            {/* ---------------- RIGHT: preview card ---------------- */}
            <div className="lg:pl-2">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {/* Card header strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, ${accent}66)` }}
                />
                <div className="p-6">
                  {/* Icon + badge */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, color: "#fff" }}
                    >
                      <SvcIcon className="h-6 w-6" />
                    </div>
                    <Badge className="border border-brand/30 bg-brand/10 text-[10px] font-semibold uppercase tracking-wide text-brand hover:bg-brand/15">
                      <ShieldCheck className="mr-1 h-3 w-3" /> JOBSONN Enterprise Service
                    </Badge>
                  </div>

                  {/* Truncated headline */}
                  <h2 className="text-base font-bold leading-snug text-foreground line-clamp-3">
                    {titleParts[0]}{titleParts[1] ? ` ${titleParts[1]}` : ""}
                  </h2>

                  {/* Truncated description */}
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {service.shortDesc}
                  </p>

                  {/* Mini meta */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-center">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</div>
                      <div className="mt-0.5 text-xs font-bold text-foreground">{heroMeta.projectType}</div>
                    </div>
                    <div className="border-x border-border">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Timeline</div>
                      <div className="mt-0.5 text-xs font-bold text-foreground">{heroMeta.duration}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Rating</div>
                      <div className="mt-0.5 text-xs font-bold text-brand">{heroMeta.rating.toFixed(1)}★</div>
                    </div>
                  </div>

                  {/* Trust signals */}
                  <ul className="mt-4 space-y-1.5">
                    {[
                      "Senior architects, not juniors",
                      "Milestone-based billing",
                      "NDA-ready in 24 hours",
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" /> {b}
                      </li>
                    ))}
                  </ul>

                  {/* Big CTA */}
                  <Button
                    onClick={() =>
                      toast.success("Specialist request received", {
                        description: "We'll match you with a senior specialist within 1 business day.",
                      })
                    }
                    className="mt-5 w-full gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <Zap className="h-4 w-4" /> Hire a Specialist
                  </Button>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    Free 45-min consultation · No commitment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== OVERVIEW ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Overview</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {service.shortDesc}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">At a glance</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium text-foreground">{category.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Industries served</dt>
                <dd className="font-medium text-foreground">{category.industries.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Tech in stack</dt>
                <dd className="font-medium text-foreground">{category.techStack.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Delivery steps</dt>
                <dd className="font-medium text-foreground">{category.processSteps.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES GRID ===================== */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">What you get</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Key capabilities and outcomes included with {service.name}.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {derivedFeatures.map((f, i) => {
              const FIcon = (ICON_MAP[f.icon] ?? Sparkles);
              return (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <FIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== TECHNOLOGIES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Technologies</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tech we&apos;d typically deploy for this engagement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* ===================== INDUSTRIES SERVED ===================== */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Industries we serve</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve delivered {service.name.toLowerCase()} across these verticals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {category.industries.map((ind, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Factory className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{ind}</span>
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
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Related services</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Other {category.name.toLowerCase()} services you may want to explore.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("public", `services/${category.slug}`)}
              className="gap-1.5 border-border bg-card text-foreground hover:bg-accent hover:text-foreground"
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
                  className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                  onClick={() => navigate("public", `services/${category.slug}/${s.slug}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      <RIcon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-tight text-foreground">{s.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{s.shortDesc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===================== FAQ ===================== */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">FAQ</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Common questions about this service.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-2">
            <Accordion type="single" collapsible className="w-full">
              {category.faqs.slice(0, 4).map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-4">
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">What clients say</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real outcomes from teams who engaged {category.name}.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.testimonials.slice(0, 2).map((t, i) => (
            <div key={i} className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
              <Quote className="h-6 w-6" style={{ color: accent }} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">
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
          className="overflow-hidden rounded-2xl border p-8 sm:p-12"
          style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}10, transparent)` }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Engage us for {service.name}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us your goals, current stack, and timeline. We&apos;ll come back with a fixed-scope
                proposal or a flexible retainer plan within one business day.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {["Free 45-min consultation", "Senior-led team", "NDA-ready in 24 hours", "Milestone-based billing"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-foreground">
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
                className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <Sparkles className="h-4 w-4" /> Get Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5 border-border bg-card text-foreground hover:bg-accent hover:text-foreground"
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
