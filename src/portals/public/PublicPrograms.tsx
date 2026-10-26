"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Rocket, ArrowRight, Clock, Wallet,
  Sparkles, CheckCircle2, Layers, Award,
  Building2, PhoneCall, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  PUBLIC_PROGRAMS, getRolesForProgram, getProgramTrackByRoleView,
  roleRouteKey, type PublicProgramDef,
} from "./_programData";

const ROLE_COLOR_BY_PROGRAM: Record<PublicProgramDef["id"], string> = {
  "fde-forward-deployment": "#F59E0B",
  "fde-program": "#0EA5E9",
  "dsai-program": "#8B5CF6",
};

const FAQS = [
  {
    q: "Who are these programs designed for?",
    a: "Career switchers, fresh graduates, and early-career professionals (0–4 years) who want to break into high-growth tech roles. We also accept mid-career professionals looking to upskill into AI, cloud, or fullstack tracks. Our admissions team helps you pick the right program based on your background and goals.",
  },
  {
    q: "How does the admissions process work?",
    a: "Submit an online application → take a short aptitude & coding diagnostic → attend a counseling call → receive an admission decision within 5 business days. Selected candidates can lock their seat with a refundable deposit. Need-based scholarships and EMI options are available.",
  },
  {
    q: "What is Pay After Placement (PAP)?",
    a: "PAP means you pay a small registration fee upfront and the bulk of the program fee only after you secure a job with a CTC above an agreed threshold. If you don't get placed within 6 months of completion, you don't pay the balance. Terms vary by program — see the Pay After Placement page for full details.",
  },
  {
    q: "Do you guarantee placement?",
    a: "We don't guarantee placement, but our placement rate is 90%+ for graduates who complete all milestones. You get 1:1 mentorship, mock interviews, a dedicated placement cell, and access to 200+ hiring partners. The Pay After Placement model also aligns our incentives with your success.",
  },
  {
    q: "Are these programs online or offline?",
    a: "Most programs are hybrid — live online classes with optional in-person studios at our partner learning centres in Bengaluru, Hyderabad, Pune, Chennai, and Delhi-NCR. FDE-FWD has mandatory in-person deployment weeks. All sessions are recorded and available on the LMS.",
  },
];

export function PublicPrograms() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Sparkles className="h-3 w-3" /> Programs</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Industry-Aligned Programs That <span className="text-brand">Get You Hired</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Five flagship programs. Thirty specialization tracks. Built with hiring
            partners so you graduate with the exact skills companies are paying for — and
            pay only after you get placed.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => {
              const el = document.getElementById("programs-compare");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="gap-1.5">
              Explore Programs <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast("A counselor will reach out within 24 hours.", {
              description: "Mon–Sat, 9 AM – 8 PM IST. You can also call +91-80-4567-8900.",
            })} className="gap-1.5">
              <PhoneCall className="h-4 w-4" /> Talk to a Counselor
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== STAT CARDS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Flagship Programs" value="5" hint="FDE-FWD · FDE · DSAI · CDM · GAA" tone="brand"
            icon={<Rocket className="h-5 w-5" />} />
          <StatCard label="Specialization Tracks" value="30" hint="6 per program" tone="brand"
            icon={<Layers className="h-5 w-5" />} />
          <StatCard label="Hiring Partners" value="200+" hint="Indias top tech employers" tone="brand"
            icon={<Building2 className="h-5 w-5" />} />
        </div>
      </section>

      {/* ===================== PROGRAM COMPARISON CARDS ===================== */}
      <section id="programs-compare" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Compare our 5 flagship programs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each program leads to 6 specialization tracks. All include live projects, placement support, and Pay After Placement.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {PUBLIC_PROGRAMS.map((p) => {
            const Icon = p.icon;
            const roles = getRolesForProgram(p.id);
            return (
              <Card
                key={p.id}
                className="flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderTopColor: p.color, borderTopWidth: 4 }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="border text-xs font-semibold"
                      style={{ color: p.color, borderColor: p.color, backgroundColor: `${p.color}14` }}
                    >
                      {p.tag}
                    </Badge>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${p.color}1A`, color: p.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-lg">{p.label}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" /> {p.duration} · {p.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm text-muted-foreground">{p.desc}</p>

                  <div className="mt-3">
                    <Badge variant="outline" className="gap-1 border-brand text-brand">
                      <Wallet className="h-3 w-3" /> Pay After Placement
                    </Badge>
                  </div>

                  {/* Specialization chips */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      6 Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {roles.map((r) => (
                        <button
                          key={r.roleView}
                          onClick={() => navigate("public", roleRouteKey(r.roleView))}
                          className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand"
                          style={{ borderColor: r.color + "55", color: r.color }}
                          title={r.label}
                        >
                          {r.label.replace(/^(Forward Deployed |Full Stack )/, "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Starting salary</p>
                      <p className="text-sm font-semibold">{p.startingSalary}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("public", p.view)}
                      className="gap-1.5"
                    >
                      View Details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===================== 18 SPECIALIZATION ROLES GRID ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">30 specialization roles</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the role you want to land. We&apos;ll show you the exact curriculum, tech stack, and career outcomes.
            </p>
          </div>

          <div className="space-y-10">
            {PUBLIC_PROGRAMS.map((p) => {
              const roles = getRolesForProgram(p.id);
              const Icon = p.icon;
              const accent = ROLE_COLOR_BY_PROGRAM[p.id];
              return (
                <div key={p.id}>
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{p.label}</h3>
                      <p className="text-xs text-muted-foreground">{p.tag} · {p.duration}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">{roles.length} roles</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((r) => {
                      const track = getProgramTrackByRoleView(r.roleView);
                      return (
                        <Card
                          key={r.roleView}
                          className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                          onClick={() => navigate("public", roleRouteKey(r.roleView))}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                              style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                            >
                              <Award className="h-5 w-5" />
                            </div>
                            <Badge
                              variant="outline"
                              className="border text-[10px]"
                              style={{ color: r.color, borderColor: r.color + "66" }}
                            >
                              {r.badge}
                            </Badge>
                          </div>
                          <h4 className="mt-3 text-sm font-semibold leading-tight">{r.label}</h4>
                          <p className="mt-2 text-xs text-muted-foreground">{r.motive}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                            View curriculum <ArrowRight className="h-3 w-3" />
                          </div>
                          {track && (
                            <p className="mt-2 text-[10px] text-muted-foreground">{track.weeks} weeks · {track.mode}</p>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== PAY AFTER PLACEMENT STRIP ===================== */}
      <section className="bg-emerald-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge className="mb-3 border border-emerald-400/40 bg-emerald-500/20 text-emerald-100">
                <Wallet className="mr-1 h-3 w-3" /> Pay After Placement
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Learn now, pay only when you earn.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-emerald-100/90">
                Pay a small registration fee to start. The bulk of your program fee is due only
                after you land a job with a CTC above an agreed threshold. No placement, no payment —
                that&apos;s the deal.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-emerald-100/80">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> ₹0 upfront tuition</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> 6-month placement window</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Income-share & EMI options</span>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("public", "pay-after-placement")}
              className="gap-1.5"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Everything you need to know about programs, admissions, payments, and placements.</p>
        </div>
        <Card className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
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

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to transform your career?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Talk to a counselor, attend a free info session, or start your application today.
                Seats are limited to 30 per cohort.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => toast("Application started!", {
                description: "Redirecting to the application form…",
              })} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Apply Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "scholarship")} className="gap-1.5">
                <Award className="h-4 w-4" /> Scholarships
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "pay-after-placement")} className="gap-1.5">
                <Wallet className="h-4 w-4" /> Pay After Placement
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
