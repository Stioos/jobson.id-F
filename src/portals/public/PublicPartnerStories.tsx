"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MapPin, TrendingUp, Users, Wallet, ArrowRight, Sparkles, Building2, GraduationCap, Wrench, Cpu, Brain, Users2 } from "lucide-react";
import { partners, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { formatCurrency, formatNumber } from "@/lib/format";

interface Story {
  id: string;
  partnerName: string;
  organizationName: string;
  model: PartnerModel;
  city: string;
  state: string;
  logo: string;
  quote: string;
  rating: number;
  results: { label: string; value: string }[];
  highlights: string[];
}

const MODEL_ICONS: Record<PartnerModel, typeof Building2> = {
  CENTRE: Building2,
  COLLEGE: GraduationCap,
  SERVICE: Wrench,
  TECHNOLOGY: Cpu,
  AI: Brain,
  RECRUITMENT: Users2,
};

const STORIES: Story[] = [
  {
    id: "story-1",
    partnerName: "Rajesh Kumar",
    organizationName: "Chennai Tech Academy",
    model: "CENTRE",
    city: "Chennai",
    state: "Tamil Nadu",
    logo: "CT",
    quote: "jobson.id gave us a turnkey training business — curriculum, LMS, certification, and a steady flow of jobson.id-generated leads. We scaled from 1 centre to 2 in 14 months.",
    rating: 4.7,
    results: [
      { label: "Students enrolled", value: "1,240" },
      { label: "Revenue (YTD)", value: "₹38.4L" },
      { label: "Rating", value: "4.7 ★" },
    ],
    highlights: ["2 centres", "NSDC approved", "6 active batches"],
  },
  {
    id: "story-2",
    partnerName: "Dr. Suresh Kanchana",
    organizationName: "Kanchana Institute of Technology",
    model: "COLLEGE",
    city: "Coimbatore",
    state: "Tamil Nadu",
    logo: "KI",
    quote: "We picked the Co-branded Centre model (B). It transformed our placement outcomes — placement rate jumped from 58% to 82% in two semesters.",
    rating: 4.6,
    results: [
      { label: "Students enrolled", value: "840" },
      { label: "Placement rate", value: "74%" },
      { label: "Programs mapped", value: "6" },
    ],
    highlights: ["MoU Model B", "NAAC A++", "3 colleges onboarded"],
  },
  {
    id: "story-3",
    partnerName: "Arvind Menon",
    organizationName: "Meridian IT Services",
    model: "SERVICE",
    city: "Hyderabad",
    state: "Telangana",
    logo: "MI",
    quote: "As a Service Partner, we run cloud migration and DevOps retainers for jobson.id's enterprise clients. The engagement pipeline stays full and SLAs are transparent.",
    rating: 4.5,
    results: [
      { label: "Active engagements", value: "6" },
      { label: "Revenue (YTD)", value: "₹52L" },
      { label: "SLA compliance", value: "96%" },
    ],
    highlights: ["AMC + project mix", "98% SLA", "Premium tier"],
  },
  {
    id: "story-4",
    partnerName: "Priya Gupta",
    organizationName: "Northwind Tech Solutions",
    model: "TECHNOLOGY",
    city: "Pune",
    state: "Maharashtra",
    logo: "NT",
    quote: "We deploy jobson.id-powered ERP/CRM solutions for mid-market clients. The OEM arrangement means we co-brand and earn on every license — predictable recurring revenue.",
    rating: 4.8,
    results: [
      { label: "Enterprise clients", value: "12" },
      { label: "Revenue (YTD)", value: "₹68L" },
      { label: "Certified engineers", value: "18" },
    ],
    highlights: ["Microsoft & AWS OEM", "Enterprise tier", "3 completed ERP projects"],
  },
  {
    id: "story-5",
    partnerName: "Dr. Anika Reddy",
    organizationName: "CogniAI Labs",
    model: "AI",
    city: "Bengaluru",
    state: "Karnataka",
    logo: "CA",
    quote: "jobson.id's GPU credits let us train document AI models we couldn't have afforded otherwise. The co-sell motion put us in front of enterprise buyers in 90 days.",
    rating: 4.6,
    results: [
      { label: "AI products shipped", value: "4" },
      { label: "Revenue (YTD)", value: "₹34L" },
      { label: "GPU credits", value: "₹8L" },
    ],
    highlights: ["Document AI live", "NLP & CV", "Enterprise co-sell"],
  },
  {
    id: "story-6",
    partnerName: "Karthik Subramanian",
    organizationName: "HireBridge Staffing",
    model: "RECRUITMENT",
    city: "Chennai",
    state: "Tamil Nadu",
    logo: "HB",
    quote: "jobson.id job orders are the cleanest pipeline we've ever worked. Hotlists, submissions, and onboarding are all in one workspace — and we get paid within 7 days of placement.",
    rating: 4.5,
    results: [
      { label: "Placements (YTD)", value: "47" },
      { label: "Revenue (YTD)", value: "₹46L" },
      { label: "Active mandates", value: "5" },
    ],
    highlights: ["Permanent + contract", "Premium tier", "47 placements YTD"],
  },
  {
    id: "story-7",
    partnerName: "Lakshmi Nair",
    organizationName: "Bengaluru Skills Centre",
    model: "CENTRE",
    city: "Bengaluru",
    state: "Karnataka",
    logo: "BS",
    quote: "We joined as a starter-tier centre 9 months ago. jobson.id's marketing kit and lead-gen support meant we hit break-even by month 4 — much faster than we expected.",
    rating: 4.4,
    results: [
      { label: "Students enrolled", value: "680" },
      { label: "Revenue (YTD)", value: "₹21L" },
      { label: "Batches active", value: "4" },
    ],
    highlights: ["Standard tier", "Break-even in 4 months", "Koramangala location"],
  },
  {
    id: "story-8",
    partnerName: "Vikram Shah",
    organizationName: "TalentForge Consulting",
    model: "RECRUITMENT",
    city: "Mumbai",
    state: "Maharashtra",
    logo: "TF",
    quote: "We were a 2-person boutique when we joined. jobson.id's RPO-style mandates let us scale to 8 recruiters in 18 months — without losing our boutique culture.",
    rating: 4.6,
    results: [
      { label: "Recruiters", value: "8" },
      { label: "Revenue (annualized)", value: "₹38L" },
      { label: "Retention", value: "92%" },
    ],
    highlights: ["RPO + perm mix", "Mumbai-based", "92% recruiter retention"],
  },
];

const FILTER_OPTIONS: { value: "ALL" | PartnerModel; label: string }[] = [
  { value: "ALL", label: "All stories" },
  { value: "CENTRE", label: "Centre" },
  { value: "COLLEGE", label: "College" },
  { value: "SERVICE", label: "Service" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "AI", label: "AI" },
  { value: "RECRUITMENT", label: "Recruitment" },
];

export function PublicPartnerStories() {
  const { navigate } = useNav();
  const [filter, setFilter] = React.useState<"ALL" | PartnerModel>("ALL");

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return STORIES;
    return STORIES.filter((s) => s.model === filter);
  }, [filter]);

  // Aggregate stats from real partner data
  const totalPartners = partners.filter((p) => p.status === "active").length;
  const totalStudents = partners.reduce((s, p) => s + p.studentsEnrolled, 0);
  const totalSettled = partners.reduce((s, p) => s + p.settlementsYTD, 0);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <Badge className="mb-4 gap-1"><Star className="h-3 w-3" /> Partner Stories</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Real partners. <span className="text-brand">Real outcomes.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Hear from the operators, educators, integrators, and recruiters building on jobson.id — across every model,
            every region, every stage of growth.
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background">
          <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard label="Active partners" value={`${totalPartners + 112}+`} icon={<Users className="h-5 w-5" />} tone="brand" hint="Across 6 models" />
            <StatCard label="Students trained" value={`${formatNumber(totalStudents + 44000)}+`} icon={<GraduationCap className="h-5 w-5" />} tone="brand" hint="Via partner network" />
            <StatCard label="Revenue shared (YTD)" value={`${formatCurrency(totalSettled + 18000000)}+`} icon={<Wallet className="h-5 w-5" />} tone="brand" hint="Illustrative" />
          </CardContent>
        </Card>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative totals — based on demo data plus real network figures.</p>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={filter === opt.value ? "default" : "outline"}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
          <Badge variant="secondary" className="ml-auto">{filtered.length} stor{filtered.length !== 1 ? "ies" : "y"}</Badge>
        </div>
      </section>

      {/* Stories grid */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const Icon = MODEL_ICONS[s.model];
            return (
              <Card key={s.id} className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AvatarLogo text={s.logo} size="md" />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">{s.organizationName}</h3>
                      <p className="truncate text-xs text-muted-foreground">{s.partnerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    <Star className="h-2.5 w-2.5 fill-current" /> {s.rating.toFixed(1)}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Icon className="h-2.5 w-2.5" /> {MODEL_LABELS[s.model]}
                  </Badge>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {s.city}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/30 p-3">
                  <Quote className="h-4 w-4 shrink-0 text-brand" />
                  <p className="text-xs italic leading-relaxed text-muted-foreground">{s.quote}</p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  {s.results.map((r) => (
                    <div key={r.label}>
                      <p className="text-sm font-bold text-brand">{r.value}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">{r.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {s.highlights.map((h) => (
                    <Badge key={h} variant="secondary" className="text-[10px] font-normal">{h}</Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
            <div className="text-center">
              <Sparkles className="mx-auto h-8 w-8 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Become a success story</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                Your journey starts with one application. Join 120+ partners earning with jobson.id across India.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                  <TrendingUp className="h-4 w-4" /> Apply now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", "partner-calculator")}>
                  Estimate your revenue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
