"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import {
  PageHeader, StatCard, SectionCard, EmptyState,
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  Trophy, TrendingUp, TrendingDown, Users, GraduationCap,
  Banknote, CalendarCheck2, ShieldCheck, Star, Award, Lightbulb,
  ArrowUpRight, ArrowDownRight, Target, Sparkles,
} from "lucide-react";

type Trend = "up" | "down" | "flat";

interface CategoryScore {
  key: string;
  label: string;
  score: number; // 0-100
  benchmark: number; // peer benchmark
  trend: Trend;
  trendValue: string; // e.g. "+5%"
  weight: number; // % weight in overall score
  icon: React.ReactNode;
}

const CATEGORIES: CategoryScore[] = [
  { key: "enrollment", label: "Student Enrollment", score: 85, benchmark: 75, trend: "up", trendValue: "+5%", weight: 20, icon: <Users className="h-4 w-4" /> },
  { key: "placement", label: "Placement Rate", score: 72, benchmark: 70, trend: "up", trendValue: "+3%", weight: 20, icon: <GraduationCap className="h-4 w-4" /> },
  { key: "revenue", label: "Revenue Contribution", score: 90, benchmark: 78, trend: "up", trendValue: "+12%", weight: 20, icon: <Banknote className="h-4 w-4" /> },
  { key: "compliance", label: "Compliance", score: 95, benchmark: 85, trend: "up", trendValue: "+2%", weight: 15, icon: <ShieldCheck className="h-4 w-4" /> },
  { key: "satisfaction", label: "Student Satisfaction", score: 80, benchmark: 78, trend: "down", trendValue: "-1%", weight: 15, icon: <Star className="h-4 w-4" /> },
  { key: "brand", label: "Brand Adherence", score: 88, benchmark: 82, trend: "up", trendValue: "+4%", weight: 10, icon: <Award className="h-4 w-4" /> },
];

const MONTHLY_TREND = [
  { month: "Apr", score: 78 },
  { month: "May", score: 80 },
  { month: "Jun", score: 79 },
  { month: "Jul", score: 82 },
  { month: "Aug", score: 84 },
  { month: "Sep", score: 83 },
  { month: "Oct", score: 86 },
];

interface PeerPartner {
  id: string;
  name: string;
  overallScore: number;
  revenue: number;
  students: number;
  placementRate: number;
}

const PEERS: PeerPartner[] = [
  { id: "ptn_001", name: "Chennai Tech Academy", overallScore: 86, revenue: 3840000, students: 1240, placementRate: 78 },
  { id: "ptn_002", name: "Bengaluru Skills Centre", overallScore: 74, revenue: 2100000, students: 680, placementRate: 65 },
  { id: "ptn_003", name: "Kanchana Institute", overallScore: 81, revenue: 1680000, students: 840, placementRate: 72 },
  { id: "ptn_004", name: "Meridian IT Services", overallScore: 79, revenue: 5200000, students: 0, placementRate: 0 },
];

interface Recommendation {
  id: string;
  category: string;
  title: string;
  impact: "high" | "medium" | "low";
  description: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  { id: "r1", category: "Placement", title: "Boost placement rate via industry partnerships", impact: "high", description: "Your placement rate (72%) trails the 80% target. Onboard 3–4 tier-1 IT hiring partners and run a 4-week placement sprint for the next graduating cohort." },
  { id: "r2", category: "Satisfaction", title: "Act on recent dip in student feedback", impact: "medium", description: "Satisfaction dropped 1% this quarter. Common themes: trainer quality in Cloud cohort and slower grievance response. Address trainer retraining + SLA <24h." },
  { id: "r3", category: "Compliance", title: "Renew ISO 29993 certification", impact: "high", description: "ISO 29993 expires in <60 days. Initiate renewal audit before Nov 30 to retain premium-tier benefits and avoid compliance score drop." },
  { id: "r4", category: "Enrollment", title: "Open Madurai micro-centre", impact: "medium", description: "Enrollment growth is strong (85% vs 75% benchmark). Demand signals from Madurai justify a 30-seat satellite centre to capture next-quarter upside." },
];

function overallScore(): number {
  return Math.round(
    CATEGORIES.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0),
  );
}

function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function scoreRingClass(score: number): string {
  if (score >= 85) return "stroke-emerald-500";
  if (score >= 70) return "stroke-amber-500";
  return "stroke-rose-500";
}

function impactTone(impact: Recommendation["impact"]): string {
  if (impact === "high") return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
  if (impact === "medium") return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
}

function TrendArrow({ trend }: { trend: Trend }) {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />;
  return <span className="text-xs text-muted-foreground">—</span>;
}

function CircularScore({ score }: { score: number }) {
  const size = 160;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={scoreRingClass(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${scoreTone(score)}`}>{score}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function PartnerScorecard() {
  const partner = CURRENT_PARTNER;
  const overall = overallScore();
  const you = PEERS[0];
  const peerRank = [...PEERS].sort((a, b) => b.overallScore - a.overallScore).findIndex((p) => p.id === you.id) + 1;

  // KPI summary values
  const totalRevenue = partner.revenueYTD;
  const studentsEnrolled = partner.studentsEnrolled;
  const placementRatePct = CATEGORIES.find((c) => c.key === "placement")?.score ?? 72;
  const activeBatches = 8; // mock

  function handleExport() {
    toast.success("Scorecard exported", { description: "partner-scorecard-Q2.pdf is being downloaded." });
  }
  function handleRecAction(id: string, title: string) {
    toast.info("Recommendation actioned", { description: `${title} — assigned to ops team for follow-up.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Scorecard"
        description={`${partner.name} — weighted performance index across enrollment, placements, revenue, compliance, satisfaction, and brand.`}
        icon={<Icon name="Trophy" className="h-6 w-6" />}
        actions={[
          { label: "Export Scorecard", icon: "Download", variant: "outline", onClick: handleExport },
        ]}
      />

      <PartnerDisclaimer />

      {/* Hero: overall score + KPI summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-brand/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-brand" /> Overall Performance Score
            </CardTitle>
            <CardDescription>Weighted index (last refresh: today, 09:00 IST)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <CircularScore score={overall} />
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                <TrendingUp className="h-3 w-3" /> +3% QoQ
              </Badge>
              <span className="text-muted-foreground">Rank #{peerRank} of {PEERS.length} peers</span>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4 grid-cols-2">
          <StatCard label="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<Banknote className="h-5 w-5" />} tone="brand" delta={{ value: "18% YoY", positive: true }} />
          <StatCard label="Students Enrolled" value={formatNumber(studentsEnrolled)} icon={<Users className="h-5 w-5" />} delta={{ value: "12% YoY", positive: true }} />
          <StatCard label="Placement Rate" value={`${placementRatePct}%`} icon={<GraduationCap className="h-5 w-5" />} tone="success" delta={{ value: "+3% QoQ", positive: true }} />
          <StatCard label="Active Batches" value={activeBatches} icon={<CalendarCheck2 className="h-5 w-5" />} hint="Across 4 centres" />
        </div>
      </div>

      {/* Category breakdown */}
      <SectionCard title="Category Breakdown" description="Weighted score across 6 categories with trend and peer benchmark.">
        {CATEGORIES.length === 0 ? (
          <EmptyState icon={<Target className="h-5 w-5" />} title="No categories" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const aboveBenchmark = c.score >= c.benchmark;
              return (
                <div key={c.key} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        {c.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{c.label}</p>
                        <p className="text-xs text-muted-foreground">Weight {c.weight}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendArrow trend={c.trend} />
                      <span className={c.trend === "down" ? "text-rose-600 dark:text-rose-400" : c.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                        {c.trendValue}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className={`text-2xl font-bold ${scoreTone(c.score)}`}>{c.score}%</span>
                    <span className="text-xs text-muted-foreground">
                      Benchmark: <span className="font-medium text-foreground">{c.benchmark}%</span>
                    </span>
                  </div>
                  <Progress value={c.score} className="mt-2 h-1.5" />
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className={aboveBenchmark ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {aboveBenchmark ? `+${c.score - c.benchmark} vs peer` : `${c.score - c.benchmark} vs peer`}
                    </span>
                    <span className="text-muted-foreground">{aboveBenchmark ? "Above" : "Below"} benchmark</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Monthly trend (bar chart) */}
      <ChartCard title="Monthly Performance Trend" description="Overall score trend over last 7 months">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_TREND}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis domain={[60, 100]} tickLine={false} axisLine={false} className="text-xs" width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
            <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
              {MONTHLY_TREND.map((entry, i) => (
                <Cell key={i} fill={entry.score >= 85 ? "#10b981" : entry.score >= 80 ? "#14b8a6" : "#f59e0b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Peer comparison + Recommendations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Peer Comparison" description="Where you rank among comparable partners.">
          <ul className="space-y-2">
            {[...PEERS].sort((a, b) => b.overallScore - a.overallScore).map((p, i) => {
              const isYou = p.id === you.id;
              return (
                <li key={p.id} className={`flex items-center gap-3 rounded-lg border p-3 ${isYou ? "border-brand bg-brand/5" : ""}`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${i === 0 ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <AvatarLogo text={p.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name} {isYou && <Badge className="ml-1 bg-brand text-brand-foreground">You</Badge>}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(p.revenue)} · {p.students > 0 ? `${formatNumber(p.students)} students` : "Service-only"} · {p.placementRate > 0 ? `${p.placementRate}% placed` : "—"}
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${scoreTone(p.overallScore)}`}>{p.overallScore}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="Action Recommendations"
          description="AI-flagged actions to lift your score next quarter."
          action={<Button size="sm" variant="ghost" onClick={() => toast.info("All recommendations", { description: "Opening full recommendations queue." })}>View all</Button>}
        >
          <ul className="space-y-2 max-h-96 overflow-y-auto scroll-thin">
            {RECOMMENDATIONS.map((r) => (
              <li key={r.id} className="rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                  <Badge className={impactTone(r.impact)}>{r.impact}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Category: <span className="font-medium text-foreground">{r.category}</span></span>
                  <Button size="sm" variant="outline" onClick={() => handleRecAction(r.id, r.title)}>
                    <Sparkles className="mr-1 h-3 w-3" /> Action
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
