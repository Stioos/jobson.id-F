"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";

// ----- Mock config -----
const JOBS = [
  "Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Data Scientist",
  "DevOps Engineer", "Product Manager", "UX Designer", "Engineering Manager",
  "QA Engineer", "Mobile Engineer",
];
const LOCATIONS = ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Remote"];
const SKILLS = ["React", "TypeScript", "Node.js", "Python", "AWS", "GraphQL", "Kubernetes", "Next.js", "Go", "PostgreSQL"];
const EDUCATION = ["Diploma", "Bachelor's", "Master's", "PhD"];
const COMPANY_TYPES = ["Startup (<50)", "Mid-size (50–500)", "Enterprise (500+)", "MNC", "Product Company"];

const CITY_ADJ: Record<string, number> = {
  Bengaluru: 1.0, Mumbai: 1.08, "Delhi NCR": 1.02, Pune: 0.92,
  Hyderabad: 0.95, Chennai: 0.88, Remote: 0.98,
};
const COMPANY_ADJ: Record<string, number> = {
  "Startup (<50)": 0.85, "Mid-size (50–500)": 0.95, "Enterprise (500+)": 1.1,
  "MNC": 1.18, "Product Company": 1.25,
};
const EDU_ADJ: Record<string, number> = { Diploma: 0.88, "Bachelor's": 1.0, "Master's": 1.08, "PhD": 1.15 };

const NEG_TIPS = [
  "Always quote a range (₹28–34L), not a single number — anchoring high gives you room.",
  "Get competing offers in writing; they are your strongest leverage.",
  "Negotiate base salary first; variable pay and bonus are easier to bump later.",
  "Ask about ESOP refresh grants and vesting cliffs — they compound over time.",
  "Discuss joining bonus to offset any unvested stock you're leaving behind.",
  "Time the conversation post-final round, not at the first call with HR.",
  "Quantify your impact with metrics (e.g., 'shipped X saving ₹Y/year').",
  "Be ready to walk away — recruiters can sense desperation.",
];

interface Peer {
  name: string; role: string; company: string; years: number; salary: number;
}
const PEERS: Peer[] = [
  { name: "Arjun M.", role: "Frontend Engineer", company: "Product Co", years: 5, salary: 2800000 },
  { name: "Sara K.", role: "Frontend Engineer", company: "MNC", years: 6, salary: 3200000 },
  { name: "Rohit P.", role: "Frontend Engineer", company: "Startup", years: 4, salary: 2200000 },
  { name: "Meera D.", role: "Frontend Engineer", company: "Mid-size", years: 6, salary: 3000000 },
];

interface CalcResult {
  min: number; avg: number; max: number;
  base: number; bonus: number; esop: number;
  trend: "up" | "down" | "stable";
  trendNote: string;
  cities: { city: string; avg: number; }[];
  companies: { type: string; avg: number; }[];
}

function calculate(input: {
  job: string; years: number; location: string; skills: string[]; education: string; company: string;
}): CalcResult {
  // Base salary table per role × years
  const baseByRole: Record<string, number> = {
    "Frontend Engineer": 1800000, "Backend Engineer": 2000000, "Full Stack Engineer": 2200000,
    "Data Scientist": 2400000, "DevOps Engineer": 2100000, "Product Manager": 2800000,
    "UX Designer": 1600000, "Engineering Manager": 4000000, "QA Engineer": 1400000, "Mobile Engineer": 2000000,
  };
  const base = baseByRole[input.job] ?? 2000000;
  const yearMult = 1 + Math.min(input.years, 12) * 0.08;
  const skillBonus = 1 + input.skills.length * 0.02;
  const locAdj = CITY_ADJ[input.location] ?? 1;
  const compAdj = COMPANY_ADJ[input.company] ?? 1;
  const eduAdj = EDU_ADJ[input.education] ?? 1;
  const avg = Math.round((base * yearMult * skillBonus * locAdj * compAdj * eduAdj) / 10000) * 10000;
  const min = Math.round((avg * 0.85) / 10000) * 10000;
  const max = Math.round((avg * 1.18) / 10000) * 10000;
  const baseSal = Math.round(avg * 0.78);
  const bonus = Math.round(avg * 0.12);
  const esop = Math.round(avg * 0.1);

  const cities = Object.keys(CITY_ADJ).slice(0, 4).map((c) => ({
    city: c,
    avg: Math.round((base * yearMult * skillBonus * CITY_ADJ[c] * compAdj * eduAdj) / 10000) * 10000,
  }));
  const companies = Object.entries(COMPANY_ADJ).map(([type, adj]) => ({
    type,
    avg: Math.round((base * yearMult * skillBonus * locAdj * adj * eduAdj) / 10000) * 10000,
  }));

  return {
    min, avg, max, base: baseSal, bonus, esop,
    trend: "up",
    trendNote: `Demand for ${input.job}s rose 12% YoY. Hiring remains active across ${input.location}.`,
    cities, companies,
  };
}

export function CandidateSalaryCalculator() {
  const [form, setForm] = React.useState({
    job: "Frontend Engineer", years: "5", location: "Bengaluru",
    skills: ["React", "TypeScript"], education: "Bachelor's", company: "Product Company",
  });
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>(["React", "TypeScript"]);
  const [result, setResult] = React.useState<CalcResult | null>(null);

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const runCalc = () => {
    const years = Number(form.years) || 0;
    if (years < 0 || years > 40) { toast.error("Enter valid years of experience (0–40)."); return; }
    const r = calculate({ ...form, years, skills: selectedSkills });
    setResult(r);
    toast.success("Salary estimated", { description: `Range: ${formatCurrency(r.min)} – ${formatCurrency(r.max)}` });
  };

  const trendMeta = result ? {
    up: { icon: "TrendingUp", cls: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", label: "Trending Up" },
    down: { icon: "TrendingDown", cls: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", label: "Trending Down" },
    stable: { icon: "Gauge", cls: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", label: "Stable" },
  }[result.trend] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Calculator"
        description="Estimate your market salary based on role, experience, location, skills and company type. Powered by anonymized offer data."
        icon={<Icon name="Calculator" className="h-6 w-6" />}
        actions={[{ label: "Reset", variant: "outline", onClick: () => { setResult(null); setSelectedSkills(["React", "TypeScript"]); } }]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Form */}
        <SectionCard title="Your profile" description="Tell us about you" className="lg:col-span-1">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Select value={form.job} onValueChange={(v) => setForm({ ...form, job: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{JOBS.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Years of Experience</Label>
              <Input type="number" min={0} max={40} value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LOCATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Education</Label>
              <Select value={form.education} onValueChange={(v) => setForm({ ...form, education: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EDUCATION.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Company Type</Label>
              <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{COMPANY_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Top Skills ({selectedSkills.length} selected)</Label>
              <div className="flex flex-wrap gap-1.5 rounded-lg border p-2 max-h-32 overflow-y-auto scroll-thin">
                {SKILLS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium border transition-colors ${
                      selectedSkills.includes(s)
                        ? "bg-brand text-white border-brand"
                        : "bg-background text-muted-foreground border-border hover:border-brand/40"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={runCalc}>
              <Icon name="Calculator" className="mr-2 h-4 w-4" /> Calculate Salary
            </Button>
          </div>
        </SectionCard>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon name="Calculator" className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">Fill the form and click Calculate</h3>
                <p className="max-w-sm text-sm text-muted-foreground">We&apos;ll estimate your salary range, breakdown, location comparison and negotiation tips.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Salary range hero */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated annual salary</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-brand">{formatCurrency(result.avg)}</span>
                        <span className="text-sm text-muted-foreground">/ year</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Range: {formatCurrency(result.min)} – {formatCurrency(result.max)}
                      </p>
                    </div>
                    {trendMeta && (
                      <div className={`flex flex-col items-center gap-1 rounded-xl ${trendMeta.bg} px-4 py-3`}>
                        <Icon name={trendMeta.icon} className={`h-5 w-5 ${trendMeta.cls}`} />
                        <span className={`text-xs font-semibold ${trendMeta.cls}`}>{trendMeta.label}</span>
                      </div>
                    )}
                  </div>
                  {trendMeta && <p className="mt-3 text-xs text-muted-foreground">{result.trendNote}</p>}
                </CardContent>
              </Card>

              {/* Breakdown + comparison */}
              <div className="grid gap-4 sm:grid-cols-2">
                <SectionCard title="Compensation breakdown">
                  <div className="space-y-3">
                    {[
                      { label: "Base Salary", value: result.base, pct: 78, icon: "Banknote" },
                      { label: "Performance Bonus", value: result.bonus, pct: 12, icon: "TrendingUp" },
                      { label: "ESOPs / Stock", value: result.esop, pct: 10, icon: "Coins" },
                    ].map((c) => (
                      <div key={c.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2"><Icon name={c.icon} className="h-3.5 w-3.5 text-brand" />{c.label}</span>
                          <span className="font-semibold">{formatCurrency(c.value)}</span>
                        </div>
                        <Progress value={c.pct} className="mt-1 h-1.5" />
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Comparison by location">
                  <div className="space-y-2">
                    {result.cities.map((c) => {
                      const max = Math.max(...result.cities.map((x) => x.avg));
                      const w = (c.avg / max) * 100;
                      return (
                        <div key={c.city}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1"><Icon name="MapPin" className="h-3 w-3 text-muted-foreground" />{c.city}</span>
                            <span className="font-semibold">{formatCurrency(c.avg)}</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-muted">
                            <div className={`h-2 rounded-full ${c.city === form.location ? "bg-brand" : "bg-brand/40"}`} style={{ width: `${w}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Comparison by company type" description="Same role & experience, different company tiers">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground border-b">
                        <th className="py-2">Company Type</th>
                        <th className="py-2 text-right">Avg Salary</th>
                        <th className="py-2 text-right">vs Your Pick</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.companies.map((c) => {
                        const diff = Math.round(((c.avg - result.avg) / result.avg) * 100);
                        return (
                          <tr key={c.type} className="border-b last:border-0">
                            <td className="py-2">
                              <span className={`font-medium ${c.type === form.company ? "text-brand" : ""}`}>{c.type}</span>
                            </td>
                            <td className="py-2 text-right font-medium">{formatCurrency(c.avg)}</td>
                            <td className={`py-2 text-right text-xs ${diff > 0 ? "text-emerald-600 dark:text-emerald-400" : diff < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                              {diff > 0 ? "+" : ""}{diff}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Peer comparison */}
          <SectionCard title="Peer comparison" description="Similar profiles in your market">
            <div className="space-y-2">
              {PEERS.map((p) => {
                const diff = Math.round(((result.avg - p.salary) / p.salary) * 100);
                return (
                  <div key={p.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.role} · {p.company} · {p.years}y exp</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(p.salary)}</p>
                      <Badge variant="outline" className={diff >= 0 ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "text-rose-600 dark:text-rose-400 border-rose-500/20"}>
                        {diff >= 0 ? "+" : ""}{diff}% vs you
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Negotiation tips */}
          <SectionCard title="Negotiation tips" description="Battle-tested advice from recruiters">
            <ul className="space-y-2">
              {NEG_TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</div>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.success("Tips exported", { description: "Negotiation cheat-sheet downloaded." })}>
              <Icon name="Download" className="mr-2 h-3.5 w-3.5" /> Download cheat-sheet
            </Button>
          </SectionCard>
        </div>
      )}

      {!result && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Roles tracked" value="120+" hint="Across 8 functions" icon={<Icon name="Briefcase" className="h-4 w-4" />} tone="brand" />
          <StatCard label="Cities covered" value="7" hint="Top Indian metros + Remote" icon={<Icon name="MapPin" className="h-4 w-4" />} tone="brand" />
          <StatCard label="Data points" value="48K+" hint="Anonymized offers" icon={<Icon name="Database" className="h-4 w-4" />} tone="brand" />
        </div>
      )}
    </div>
  );
}
