"use client";

import * as React from "react";
import Image from "next/image";
import { useNav } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
  TrendingUp, ArrowRight, Sparkles, Search, ChevronRight, ChevronLeft,
  CheckCircle2, Clock, Star, Users, Briefcase, Zap, ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  serviceCategories, searchAllServices, type ServiceCategory,
} from "@/data/servicesData";

// ============================================================
// Local icon map: maps data-file `icon` string → lucide component
// ============================================================
const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass, TrendingUp,
};

// ============================================================
// ENRICHED CARD METADATA — two-line attractive titles, durations,
// ratings, project types, and tag pills per category.
// (Card-grid is one card per CATEGORY, matching the marketplace
// reference — visitors see all 9 categories at a glance.)
// ============================================================
interface CategoryMeta {
  /** Two-line attractive title (uses \n to mark the line break) */
  attractiveTitle: string;
  /** Short 1-2 line description shown under the title */
  shortDesc: string;
  /** Project-type label, e.g. "Engagement", "Retainer", "Project" */
  projectType: string;
  /** Typical engagement duration */
  duration: string;
  /** Rating out of 5 + review count */
  rating: number;
  reviews: number;
  /** 2-3 short tag pills */
  tags: string[];
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "ai-powered-business-solutions": {
    attractiveTitle: "Transform Your Business with\nAI-Powered Automation & Intelligence",
    shortDesc:
      "Deploy production-ready AI that automates workflows, delights customers, and turns scattered data into decisions — shipped in weeks, not quarters.",
    projectType: "Engagement",
    duration: "8-12 weeks",
    rating: 4.9,
    reviews: 175,
    tags: ["AI Agents", "Process Automation", "Enterprise AI"],
  },
  "digital-sales-ai-marketing": {
    attractiveTitle: "Fill Your Pipeline with\nAI-Driven Marketing & Sales Engines",
    shortDesc:
      "From SEO to outbound to ABM — turn attention into revenue with AI funnels, lead intelligence, and automation that books meetings on autopilot.",
    projectType: "Retainer",
    duration: "Ongoing",
    rating: 4.8,
    reviews: 142,
    tags: ["SEO & GEO", "Outbound AI", "Revenue Ops"],
  },
  "ai-agentic-automation": {
    attractiveTitle: "Let Autonomous AI Agents\nRun Your Operations End-to-End",
    shortDesc:
      "Custom-built AI agents and multi-agent swarms that handle complex tasks, orchestrate your tools, and execute work without human babysitting.",
    projectType: "Project",
    duration: "6-10 weeks",
    rating: 4.9,
    reviews: 98,
    tags: ["Custom Agents", "Multi-Agent", "Workflow AI"],
  },
  "open-source-deployment": {
    attractiveTitle: "Deploy Self-Hosted AI Platforms\nWithout Lock-In or Surprise Bills",
    shortDesc:
      "Self-hosted AI platforms, private clouds, and DevOps stacks — engineered for sovereignty, security, and zero vendor lock-in.",
    projectType: "Project",
    duration: "4-8 weeks",
    rating: 4.7,
    reviews: 86,
    tags: ["Self-Hosted", "Private Cloud", "DevOps"],
  },
  "custom-software-development": {
    attractiveTitle: "Ship Custom Software &\nSaaS Products Built to Scale",
    shortDesc:
      "Enterprise web apps, mobile apps, SaaS platforms, and APIs — engineered by senior architects who have shipped at production scale.",
    projectType: "Project",
    duration: "10-16 weeks",
    rating: 4.9,
    reviews: 211,
    tags: ["Web Apps", "SaaS", "Mobile"],
  },
  "data-engineering-analytics": {
    attractiveTitle: "Turn Raw Data into a\nSingle Source of Truth & Insights",
    shortDesc:
      "Data warehouses, ETL/ELT pipelines, BI dashboards, and predictive analytics — built so every team can trust their numbers.",
    projectType: "Project",
    duration: "8-14 weeks",
    rating: 4.8,
    reviews: 124,
    tags: ["Warehousing", "BI Dashboards", "Predictive AI"],
  },
  "cloud-infrastructure-devops": {
    attractiveTitle: "Scale Your Cloud & DevOps\nWithout Downtime or Burnout",
    shortDesc:
      "Cloud migration, Kubernetes, CI/CD, IaC, and managed DevOps — infrastructure that scales itself and never sleeps.",
    projectType: "Engagement",
    duration: "6-12 weeks",
    rating: 4.9,
    reviews: 167,
    tags: ["Kubernetes", "CI/CD", "IaC"],
  },
  "ai-ml-model-development": {
    attractiveTitle: "Build Custom ML, LLM & Vision\nModels Tuned to Your Domain",
    shortDesc:
      "From machine learning to LLMs, computer vision, and NLP — fine-tuned models that ship to production with MLOps baked in.",
    projectType: "Project",
    duration: "8-14 weeks",
    rating: 4.9,
    reviews: 134,
    tags: ["LLMs", "Computer Vision", "MLOps"],
  },
  "digital-transformation-consulting": {
    attractiveTitle: "Re-Architect Your Business\nfor the AI Era — End to End",
    shortDesc:
      "AI strategy, digital transformation, process reengineering, and IT modernization — a roadmap that future-proofs every department.",
    projectType: "Retainer",
    duration: "12-24 weeks",
    rating: 4.8,
    reviews: 92,
    tags: ["AI Strategy", "Transformation", "Governance"],
  },
};

// ============================================================
// MAIN PAGE
// ============================================================
export function PublicTechAIServices() {
  const { navigate } = useNav();
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [showResults, setShowResults] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchAllServices(query).slice(0, 8);
  }, [query]);

  const visibleCategories = React.useMemo(() => {
    if (activeCategory === "all") return serviceCategories;
    return serviceCategories.filter((c) => c.slug === activeCategory);
  }, [activeCategory]);

  // Close search dropdown on outside click
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const totalServices = serviceCategories.reduce((n, c) => n + c.services.length, 0);

  const activeCatName =
    activeCategory === "all"
      ? "All Categories"
      : serviceCategories.find((c) => c.slug === activeCategory)?.name ?? "All Categories";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ============================================================
          HERO — dark navy with value prop
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs text-slate-400"
          >
            <button
              onClick={() => navigate("public", "home")}
              className="transition-colors hover:text-white"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <button
              onClick={() => navigate("public", "tech-ai-services")}
              className="transition-colors hover:text-white"
            >
              Pro Services
            </button>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-white">{activeCatName}</span>
          </nav>

          {/* Headline */}
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="gap-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15">
                <Sparkles className="h-3 w-3" /> Pro Services Marketplace
              </Badge>
              <Badge
                variant="outline"
                className="gap-1 border-slate-700 bg-slate-900/60 text-slate-300"
              >
                <Briefcase className="h-3 w-3" /> {totalServices} Services
              </Badge>
              <Badge
                variant="outline"
                className="gap-1 border-slate-700 bg-slate-900/60 text-slate-300"
              >
                <ShieldCheck className="h-3 w-3" /> Pay After Delivery
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Don&apos;t build a team —{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                deploy one in 14 days
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Nine specialized categories. {totalServices} production-ready services.
              Senior architects who ship in weeks — with milestone pricing and pay-after-delivery terms.
            </p>

            {/* Hero CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() =>
                  toast.success("Free consultation requested", {
                    description: "Our solutions team will reach out within 24 hours.",
                  })
                }
                className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
              >
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5 border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 hover:text-white"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Bottom stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
            <HeroStat value={`${totalServices}+`} label="Specialized services" />
            <HeroStat value="14 days" label="To first deployment" />
            <HeroStat value="25+" label="Countries served" />
            <HeroStat value="4.9★" label="Avg. client rating" />
          </div>
        </div>
      </section>

      {/* ============================================================
          SEARCH + CATEGORY FILTER BAR
          ============================================================ */}
      <section className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {/* Live search */}
            <div className="relative w-full lg:max-w-md" ref={searchRef}>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder={`Search all ${totalServices} services — try 'AI agents', 'React', 'data engineering'…`}
                className="border-slate-700 bg-slate-900 pl-9 text-white placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
              {showResults && query.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-slate-400">
                      No services match &ldquo;{query}&rdquo;.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-800">
                      {searchResults.map(({ service, category }) => {
                        const SvcIcon = ICON_MAP[service.icon] ?? Sparkles;
                        return (
                          <li key={service.id}>
                            <button
                              onClick={() => {
                                navigate("public", `services/${category.slug}/${service.slug}`);
                                setQuery("");
                                setShowResults(false);
                              }}
                              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-800/60"
                            >
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: `${category.color}1A`,
                                  color: category.color,
                                }}
                              >
                                <SvcIcon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">
                                  {service.name}
                                </p>
                                <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                                  {service.shortDesc}
                                </p>
                                <p
                                  className="mt-1 text-[10px] font-medium"
                                  style={{ color: category.color }}
                                >
                                  {category.name}
                                </p>
                              </div>
                              <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-500" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-x-auto">
              <CategoryPill
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                label="All"
                count={serviceCategories.length}
              />
              {serviceCategories.map((c) => (
                <CategoryPill
                  key={c.slug}
                  active={activeCategory === c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  label={c.name}
                  count={c.services.length}
                  accent={c.color}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9-CATEGORY MARKETPLACE GRID
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {activeCategory === "all"
                ? "Explore our 9 service categories"
                : activeCatName}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Each category contains specialized services, real tech stacks, and proven delivery processes.
            </p>
          </div>
          {activeCategory !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCategory("all")}
              className="gap-1.5 border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" /> All categories
            </Button>
          )}
        </div>

        {visibleCategories.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <p className="text-sm text-slate-400">No categories match.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveCategory("all")}
              className="mt-3 border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
            >
              Reset filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                cat={cat}
                meta={CATEGORY_META[cat.slug]}
                onExplore={() => navigate("public", `services/${cat.slug}`)}
                onQuote={() =>
                  toast.success("Quote request received", {
                    description: `Our ${cat.name} team will reach out within 24 hours.`,
                  })
                }
                onConsult={() =>
                  toast.success("Consultation scheduled", {
                    description: "Check your inbox for a calendar invite within 1 business day.",
                  })
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          TECH STACK STRIP
          ============================================================ */}
      <TechStackStrip />

      {/* ============================================================
          BOTTOM CTA BANNER
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
          />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Need something bespoke? Our architects scope custom solutions within 24 hours.
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Tell us your goals, current stack, and timeline. We&apos;ll recommend the right
                combination of services — and a delivery plan that fits your budget.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  "Free 45-min consultation",
                  "Fixed-scope or retainer models",
                  "Senior architects, not juniors",
                  "NDA-ready in 24 hours",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-amber-500" /> {b}
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
                className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
              >
                <Sparkles className="h-4 w-4" /> Request a Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5 border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 hover:text-white"
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

// ============================================================
// HERO STAT
// ============================================================
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-3xl font-bold text-amber-400 sm:text-4xl">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

// ============================================================
// CATEGORY PILL — filter chips
// ============================================================
function CategoryPill({
  active,
  onClick,
  label,
  count,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? "border-amber-500 bg-amber-500 text-white"
          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white",
      ].join(" ")}
      style={active && accent ? { backgroundColor: accent, borderColor: accent } : undefined}
    >
      <span>{label}</span>
      <span
        className={[
          "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
          active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// ============================================================
// CATEGORY CARD — marketplace-style card with image, two-line title,
// metadata, tag pills, and amber CTA + outline CTA
// ============================================================
function CategoryCard({
  cat,
  meta,
  onExplore,
  onQuote,
  onConsult,
}: {
  cat: ServiceCategory;
  meta: CategoryMeta;
  onExplore: () => void;
  onQuote: () => void;
  onConsult: () => void;
}) {
  if (!meta) return null;
  const titleLines = meta.attractiveTitle.split("\n");

  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40">
      {/* Top row: image + count badge */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <button
          onClick={onExplore}
          aria-label={`Explore ${cat.name}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-700 transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${cat.color}22` }}
        >
          <Image
            src={`/services/${cat.slug}.png`}
            alt={`${cat.name} service illustration`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </button>
        <Badge
          variant="outline"
          className="border-slate-700 bg-slate-800/60 text-xs font-semibold text-slate-300"
        >
          {cat.services.length} services
        </Badge>
      </div>

      {/* Two-line attractive title */}
      <button
        onClick={onExplore}
        className="text-left text-lg font-bold leading-tight text-white transition-colors group-hover:text-amber-400"
      >
        {titleLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </button>

      {/* Short description */}
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
        {meta.shortDesc}
      </p>

      {/* Metadata row: project type · duration · rating */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-slate-500" />
          {meta.projectType}
        </span>
        <span className="text-slate-600">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          {meta.duration}
        </span>
        <span className="text-slate-600">·</span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-amber-400">{meta.rating.toFixed(1)}</span>
          <span className="text-slate-500">({meta.reviews} reviews)</span>
        </span>
      </div>

      {/* Tag pills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        <Button
          onClick={onQuote}
          size="sm"
          className="flex-1 gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
        >
          Get a Quote <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={onConsult}
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
        >
          <Clock className="h-3.5 w-3.5" /> Consultation
        </Button>
      </div>
    </article>
  );
}

// ============================================================
// TECH STACK STRIP
// ============================================================
function TechStackStrip() {
  const ALL_TECH_STACK = React.useMemo(
    () =>
      Array.from(new Set(serviceCategories.flatMap((c) => c.techStack))).slice(0, 24),
    []
  );
  return (
    <section className="border-y border-slate-800 bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Tech stacks we work with
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            A snapshot of the frameworks, platforms, and tools our delivery teams use every day.
          </p>
        </div>
        <div className="flex max-h-32 flex-wrap justify-center gap-2 overflow-y-auto">
          {ALL_TECH_STACK.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          + many more across {serviceCategories.length} categories
        </p>
      </div>
    </section>
  );
}

// ============================================================
// LINT-SAFETY: keep imported icons referenced
// ============================================================
const _LINT_SAFETY: LucideIcon[] = [
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
  TrendingUp, Users, Zap, ShieldCheck,
];
void _LINT_SAFETY;
