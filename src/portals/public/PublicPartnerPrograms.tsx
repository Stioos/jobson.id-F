"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen, Award, Clock, Briefcase, Search, Filter, ArrowRight,
  GraduationCap, Code2, BarChart3, ShieldCheck, Cloud, Palette,
  CheckCircle2, Wallet, TrendingUp, Users,
} from "lucide-react";
import { programs } from "@/lib/partner-data";
import type { Program } from "@/lib/partner-types";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  Technology: Code2,
  "Data & AI": BarChart3,
  Marketing: TrendingUp,
  Security: ShieldCheck,
  Cloud: Cloud,
  Design: Palette,
};

const CATEGORIES = ["All", ...Array.from(new Set(programs.map((p) => p.category)))];

// Mock stats — derived but presented as illustrative
const TOTAL_STUDENTS_TRAINED = 48230;
const AVG_PLACEMENT_RATE = 78;

export function PublicPartnerPrograms() {
  const { navigate } = useNav();
  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const [selectedProgram, setSelectedProgram] = React.useState<Program | null>(null);

  const filtered = React.useMemo(() => {
    return programs.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.targetRoles.some((r) => r.toLowerCase().includes(q)) ||
          p.certifications.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [category, query]);

  const handleApply = (program: Program) => {
    toast.success(`Starting application to deliver ${program.name}`, {
      description: "Program will be pre-selected in the wizard.",
    });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jobsonn_partner_apply_program", program.id);
    }
    setSelectedProgram(null);
    navigate("public", "partner-apply");
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <Badge className="mb-4 gap-1"><BookOpen className="h-3 w-3" /> Partner Program Catalog</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Programs <span className="text-brand">your partners</span> can deliver
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            JOBSONN&apos;s certified program catalog — full-stack, data, cloud, security, design and more.
            Pick a program, apply to deliver it, and start earning.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active programs" value={programs.length} icon={<BookOpen className="h-5 w-5" />} tone="brand" hint="Across 6 categories" />
          <StatCard label="Students trained" value={`${(TOTAL_STUDENTS_TRAINED / 1000).toFixed(1)}K+`} icon={<Users className="h-5 w-5" />} tone="brand" hint="Via partner network" />
          <StatCard label="Avg. placement rate" value={`${AVG_PLACEMENT_RATE}%`} icon={<TrendingUp className="h-5 w-5" />} tone="brand" hint="Across certified graduates" />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative figures based on demo data.</p>
      </section>

      {/* Filters + grid */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search programs, codes, roles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Badge variant="secondary">{filtered.length} program{filtered.length !== 1 ? "s" : ""}</Badge>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No programs match your search. Try clearing the filter.</p>
            <Button variant="outline" className="mt-3" onClick={() => { setCategory("All"); setQuery(""); }}>
              Reset filters
            </Button>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const Icon = CATEGORY_ICONS[p.category] ?? BookOpen;
              return (
                <Card key={p.id} className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">{p.code}</Badge>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-tight">{p.name}</h3>
                  <Badge variant="secondary" className="mt-1 w-fit text-[10px]">{p.category}</Badge>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {p.durationWeeks} weeks
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="h-3.5 w-3.5" /> {formatCurrency(p.defaultPrice)}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Certifications</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.certifications.map((c) => (
                        <Badge key={c} variant="outline" className="gap-1 text-[10px] font-normal">
                          <Award className="h-2.5 w-2.5" /> {c}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Target roles</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.targetRoles.slice(0, 3).map((r) => (
                        <Badge key={r} variant="secondary" className="text-[10px] font-normal">{r}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t pt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedProgram(p)}>
                      View details
                    </Button>
                    <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleApply(p)}>
                      Apply to deliver <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Revenue split preview CTA */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Want to see your share per enrollment?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the revenue calculator to plug in any program, lead source and discount — and see exactly how
                  the split flows between you and JOBSONN.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button onClick={() => navigate("public", "partner-calculator")} className="gap-1.5">
                  <Wallet className="h-4 w-4" /> Open calculator
                </Button>
                <Button variant="outline" onClick={() => navigate("public", "partner-models")}>See all partner models</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Program details dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={(o) => !o && setSelectedProgram(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProgram && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{selectedProgram.code}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{selectedProgram.category}</Badge>
                </div>
                <DialogTitle className="text-xl">{selectedProgram.name}</DialogTitle>
                <DialogDescription>{selectedProgram.description}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Duration</p>
                  <p className="mt-1 text-sm font-semibold">{selectedProgram.durationWeeks} weeks</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Default price</p>
                  <p className="mt-1 text-sm font-semibold">{formatCurrency(selectedProgram.defaultPrice)}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">Partner share</p>
                  <p className="mt-1 text-sm font-semibold text-brand">{selectedProgram.partnerPct}%</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">JOBSONN share</p>
                  <p className="mt-1 text-sm font-semibold">{selectedProgram.jobsonnPct}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Delivery modes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedProgram.deliveryModes.map((d) => (
                    <Badge key={d} variant="outline" className="capitalize text-[10px]">{d}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certifications</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedProgram.certifications.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1 text-[10px]">
                      <Award className="h-2.5 w-2.5" /> {c}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target roles</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedProgram.targetRoles.map((r) => (
                    <Badge key={r} variant="outline" className="gap-1 text-[10px]">
                      <Briefcase className="h-2.5 w-2.5" /> {r}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Revenue split preview */}
              <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
                <p className="text-xs font-semibold text-brand">Revenue split preview (per enrollment)</p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Gross</p>
                    <p className="text-sm font-bold">{formatCurrency(selectedProgram.defaultPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Partner ({selectedProgram.partnerPct}%)</p>
                    <p className="text-sm font-bold text-brand">{formatCurrency(selectedProgram.defaultPrice * selectedProgram.partnerPct / 100)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">JOBSONN ({selectedProgram.jobsonnPct}%)</p>
                    <p className="text-sm font-bold">{formatCurrency(selectedProgram.defaultPrice * selectedProgram.jobsonnPct / 100)}</p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Illustrative — actual share depends on lead source & signed agreement. Use the calculator for full breakdown.
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedProgram(null)}>Close</Button>
                <Button className="gap-1.5" onClick={() => handleApply(selectedProgram)}>
                  Apply to deliver this program <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
