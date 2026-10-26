"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck, Layers,
  Globe, Users, TrendingUp, Sparkles, Target, FileText, Clock,
  BarChart3, Calendar, BookOpen, Wallet, Briefcase, ShieldCheck,
  ChevronRight, ArrowRight, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  TALENT_SOLUTIONS_CONFIG, ALL_TALENT_SOLUTIONS_SIDEBAR,
  getTalentSolution, type TalentSolutionDef,
} from "@/data/talentSolutionsConfig";

const ICON_MAP: Record<string, LucideIcon> = {
  Search, GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe,
  Users, TrendingUp, Sparkles, Target, FileText, Clock, BarChart3, Calendar,
  BookOpen, Wallet, Briefcase, ShieldCheck,
};

export function PublicTalentSolutionLanding({ solutionKey }: { solutionKey: string }) {
  const { navigate } = useNav();
  const solution = getTalentSolution(solutionKey);

  if (!solution) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Solution not found</h1>
        <Button className="mt-4" onClick={() => navigate("public", "talent-solutions")}>
          Back to Hire Talent
        </Button>
      </div>
    );
  }

  const SolutionIcon = ICON_MAP[solution.icon] || Target;

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-8">
            {/* LEFT: main content */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className="gap-1 bg-brand/10 text-brand hover:bg-brand/15">
                  <SolutionIcon className="h-3 w-3" /> {solution.label}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {solution.badge}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {solution.label}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {solution.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Request received", { description: "Our team will reach out within 24 hours." })} className="gap-1.5">
                  Explore solution <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                  Talk to Sales
                </Button>
              </div>
            </div>
            {/* RIGHT: stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {[
                { label: "Sub-pages", value: "8" },
                { label: "Time to deploy", value: "2-4 wks" },
                { label: "Replacement SLA", value: "90 days" },
                { label: "Retention rate", value: "96%" },
              ].map(s => (
                <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
                  <div className="text-lg font-bold text-brand">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN: feature cards (sidebar removed — now in secondary header dropdown) ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Core capabilities</h2>
          <span className="text-xs text-muted-foreground">8 sub-pages · click to explore</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solution.subPages.map((sp, idx) => {
            const SubIcon = ICON_MAP[sp.icon] || Target;
            return (
              <Card
                key={sp.subPageKey}
                role="button"
                tabIndex={0}
                onClick={() => navigate("public", `talent/${solutionKey}/${sp.subPageKey}`)}
                onKeyDown={e => e.key === "Enter" && navigate("public", `talent/${solutionKey}/${sp.subPageKey}`)}
                className="group cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                style={{ borderTopColor: solution.color, borderTopWidth: 3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${solution.color}18`, color: solution.color }}>
                    <SubIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold">{sp.label}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{sp.desc}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2">
                  <span className="text-[10px] text-muted-foreground">Sub-page {idx + 1} of 8</span>
                  <span className="text-[10px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center justify-between rounded-xl border bg-gradient-to-r from-brand/5 to-background p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Need something bespoke?</p>
              <p className="text-xs text-muted-foreground">Our architects scope custom solutions within 24 hours.</p>
            </div>
          </div>
          <Button onClick={() => toast.success("Consultation requested", { description: "We'll reach out within 24 hours." })}>
            Request a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
