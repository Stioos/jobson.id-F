"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
  TrendingUp, ArrowRight, Sparkles, Search, ChevronRight, CheckCircle2,
  Layers, ShieldCheck, Zap, Server, FileCode, Settings, Workflow,
  Network, Headphones, Mic, FileSearch, BookOpen, Plug, Monitor,
  Smartphone, GitBranch, Container, HardDrive, Rocket, Send, Filter,
  Activity, AppWindow, ArrowRightLeft, ArrowUpRight, Award, BarChart3,
  Briefcase, Clock, DollarSign, Eye, Factory, FileText, FolderOpen,
  Globe, GraduationCap, Handshake, Layout, LayoutDashboard, Lightbulb,
  Lock, MessageSquare, RefreshCw, Share2, Shield, Sliders, Star, Target,
  UserCheck, Users, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  serviceCategories, searchAllServices, type ServiceCategory,
} from "@/data/servicesData";

// Local icon map: maps data-file `icon` string → lucide component
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


// Flat list of all tech stacks across categories (deduped) for the chips strip
const ALL_TECH_STACK = Array.from(
  new Set(serviceCategories.flatMap((c) => c.techStack))
).slice(0, 24);

export function PublicTechAIServices() {
  const { navigate } = useNav();
  const [query, setQuery] = React.useState("");
  const [categorySlug, setCategorySlug] = React.useState("any");
  const [showResults, setShowResults] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchAllServices(query).slice(0, 8);
  }, [query]);

  const visibleCategories = React.useMemo(() => {
    if (categorySlug === "any") return serviceCategories;
    return serviceCategories.filter((c) => c.slug === categorySlug);
  }, [categorySlug]);

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

  return (
    <div className="bg-background">
      {/* ===================== HERO — split-screen with value-prop panel ===================== */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            {/* LEFT: headline + CTAs */}
            <div>
              {/* Badge pills */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge className="gap-1 bg-brand/10 text-brand hover:bg-brand/15">
                  <Sparkles className="h-3 w-3" /> Pro Services
                </Badge>
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <Cpu className="h-3 w-3" /> 68 Services
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Don&apos;t build a team —{" "}
                <span className="text-brand">deploy one in 14 days</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Six categories. {totalServices} specialized services. From AI-powered business
                automation to cloud-native engineering — senior engineers who ship in weeks,
                not quarters. Pay after delivery.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() =>
                    toast.success("Free consultation request received", {
                      description: "Our solutions team will reach out within 24 hours.",
                    })
                  }
                  className="gap-1.5"
                >
                  Get free consultation <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    toast.success("Requirements submitted", {
                      description: "You can also email requirements@jobsonn.com for a faster turnaround.",
                    })
                  }
                  className="gap-1.5"
                >
                  Post requirements
                </Button>
              </div>
            </div>

            {/* RIGHT: "Why this wins" value-prop panel */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Why this wins
              </span>
              <div className="space-y-5">
                {/* Value prop 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Senior engineers, not juniors</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Every engagement is staffed by engineers with 5+ years of production
                      experience. No training wheels, no hand-holding.
                    </p>
                  </div>
                </div>
                {/* Value prop 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Ship in weeks, not quarters</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      First deployment in 14 days. Production-ready in 6 weeks. We measure
                      success by what ships, not by hours billed.
                    </p>
                  </div>
                </div>
                {/* Value prop 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Pay after delivery</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Milestone-based pricing with pay-after-delivery terms. If we don&apos;t ship,
                      you don&apos;t pay. Skin in the game, every engagement.
                    </p>
                  </div>
                </div>
              </div>
              {/* Trust line */}
              <div className="mt-5 flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <span>
                  Backed by written SLAs, code-ownership guarantees and weekly demo cycles —
                  scoped to your roadmap on a free discovery call.
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS BAR */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">{totalServices}+</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                Specialized services
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">14 days</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                To first deployment
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">25+</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                Countries served
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SEARCH + CATEGORY FILTER ===================== */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <Card className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
            {/* Live search */}
            <div className="relative" ref={searchRef}>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search all 54+ services — try 'AI agents', 'React', 'data engineering'…"
                className="pl-9"
              />
              {showResults && query.trim() && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-xl border bg-popover shadow-lg">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No services match &ldquo;{query}&rdquo;.
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {searchResults.map(({ service, category }) => {
                        const SvcIcon = (ICON_MAP[service.icon] ?? Sparkles);
                        return (
                          <li key={service.id}>
                            <button
                              onClick={() => {
                                navigate("public", `services/${category.slug}/${service.slug}`);
                                setQuery("");
                                setShowResults(false);
                              }}
                              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                            >
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                              >
                                <SvcIcon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{service.name}</p>
                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                  {service.shortDesc}
                                </p>
                                <p className="mt-1 text-[10px] font-medium" style={{ color: category.color }}>
                                  {category.name}
                                </p>
                              </div>
                              <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {/* Category filter */}
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All categories</SelectItem>
                {serviceCategories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      </section>

      {/* ===================== 9-CATEGORY GRID ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore our 9 service categories</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each category contains specialized services, real tech stacks, and proven delivery processes.
            </p>
          </div>
          {categorySlug !== "any" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategorySlug("any")}
              className="gap-1.5"
            >
              Clear filter
            </Button>
          )}
        </div>

        {visibleCategories.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-6 w-6" />}
            title="No categories match"
            description="Reset your filter to see all 9 service categories."
            action={
              <Button size="sm" variant="outline" onClick={() => setCategorySlug("any")}>
                Reset filter
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} onExplore={() => navigate("public", `services/${cat.slug}`)} />
            ))}
          </div>
        )}
      </section>

      {/* ===================== TECH STACK CHIPS STRIP ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Tech stacks we work with</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A snapshot of the frameworks, platforms, and tools our delivery teams use every day.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {ALL_TECH_STACK.map((tech) => (
              <Badge key={tech} variant="outline" className="border-brand/30 bg-background px-3 py-1 text-xs font-medium">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            + many more across {serviceCategories.length} categories
          </p>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Not sure where to start? Let&apos;s scope it together.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
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
                  <li key={b} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-brand" /> {b}
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
                <Sparkles className="h-4 w-4" /> Get Free Consultation
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

function CategoryCard({ cat, onExplore }: { cat: ServiceCategory; onExplore: () => void }) {
  const Icon = (ICON_MAP[cat.icon] ?? Sparkles);
  return (
    <Card
      className="group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTopColor: cat.color, borderTopWidth: 4 }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <Badge
            variant="secondary"
            className="border text-xs font-semibold"
            style={{ color: cat.color, borderColor: `${cat.color}40`, backgroundColor: `${cat.color}12` }}
          >
            {cat.services.length} services
          </Badge>
        </div>
        <CardTitle className="mt-3 text-lg leading-tight">{cat.name}</CardTitle>
        <CardDescription className="mt-1.5 line-clamp-3 text-sm">
          {cat.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mt-auto flex flex-wrap gap-1.5">
          {cat.services.slice(0, 3).map((s) => (
            <span
              key={s.slug}
              className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {s.name.length > 28 ? s.name.slice(0, 26) + "…" : s.name}
            </span>
          ))}
          {cat.services.length > 3 && (
            <span className="rounded-full border border-dashed px-2.5 py-0.5 text-[11px] text-muted-foreground">
              +{cat.services.length - 3} more
            </span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {cat.industries.length} industries
          </span>
          <Button
            size="sm"
            onClick={onExplore}
            className="gap-1.5"
            style={undefined}
          >
            Explore <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
