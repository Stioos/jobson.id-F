"use client";

import * as React from "react";
import { PageHeader, SectionCard, Card, CardContent, StatCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";
import {
  TrendingUp, CheckCircle2, AlertCircle, XCircle, Lightbulb, ArrowRight,
  Trophy, Sparkles, Target,
} from "lucide-react";

interface Category {
  key: string;
  label: string;
  score: number;
  tip: string;
  improve: string;
}

const CATEGORIES: Category[] = [
  { key: "desc", label: "Company Description", score: 100, tip: "Your about section is detailed and clear.", improve: "Add a founder quote for personal touch." },
  { key: "logo", label: "Logo & Cover", score: 100, tip: "Logo and cover image look great.", improve: "Refresh cover seasonally for relevance." },
  { key: "video", label: "Culture Video", score: 0, tip: "No video embedded yet.", improve: "Upload a 60-90s culture video to boost engagement by 2.4×." },
  { key: "benefits", label: "Benefits Listed", score: 60, tip: "6 of 10 recommended benefits listed.", improve: "Add: wellness stipend, device allowance, sabbatical policy." },
  { key: "photos", label: "Office Photos", score: 40, tip: "Only 2 office photos uploaded.", improve: "Add 4+ photos showing workspace, events, and team areas." },
  { key: "testi", label: "Employee Testimonials", score: 20, tip: "1 testimonial, last updated 8 months ago.", improve: "Collect 3 fresh testimonials in the next 30 days." },
  { key: "social", label: "Social Links", score: 100, tip: "LinkedIn, Twitter and Glassdoor connected.", improve: "Add Instagram or YouTube for richer storytelling." },
  { key: "awards", label: "Awards & Certifications", score: 0, tip: "No awards or certifications listed.", improve: "Add Great Place to Work, industry awards, ISO certifications." },
];

const COMPETITORS = [
  { name: "TechCorp India (You)", score: 78, isYou: true },
  { name: "FinEdge Solutions", score: 84, isYou: false },
  { name: "Nimbus Labs", score: 71, isYou: false },
  { name: "Quantum Systems", score: 65, isYou: false },
];

const TREND = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 65 },
  { month: "Mar", score: 64 },
  { month: "Apr", score: 68 },
  { month: "May", score: 71 },
  { month: "Jun", score: 74 },
  { month: "Jul", score: 78 },
];

const ACTION_PLAN = [
  { id: "a1", title: "Upload culture video", impact: "+8 points", done: false },
  { id: "a2", title: "Add 4 office photos", impact: "+5 points", done: false },
  { id: "a3", title: "Collect 3 fresh testimonials", impact: "+6 points", done: false },
  { id: "a4", title: "List 4 more benefits", impact: "+4 points", done: true },
  { id: "a5", title: "Add 2 awards / certifications", impact: "+5 points", done: false },
  { id: "a6", title: "Connect Instagram profile", impact: "+2 points", done: true },
];

function CircularScore({ score, size = 168 }: { score: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const tone = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs work";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          className={tone.replace("text-", "stroke-")}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold">{score}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">/ 100</span>
        <Badge variant="secondary" className={`mt-1 ${tone.replace("text-", "bg-")}/10 ${tone} border-transparent`}>{label}</Badge>
      </div>
    </div>
  );
}

export function EmployerBrandingScore() {
  const overall = 78;
  const [actions, setActions] = React.useState(ACTION_PLAN);

  const toggleAction = (id: string) =>
    setActions((a) => a.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const completedActions = actions.filter((a) => a.done).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employer Branding Score"
        description="Measure and improve how candidates perceive your company"
        icon={<TrendingUp className="h-6 w-6" />}
        actions={[
          { label: "Export report", variant: "outline", onClick: () => toast.success("Branding score report exported as PDF") },
          { label: "Re-run audit", onClick: () => toast.success("Auditing your employer profile…") },
        ]}
      />

      {/* Top: overall score + KPIs */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-brand/20">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CircularScore score={overall} />
            <p className="mt-3 text-sm text-muted-foreground">Overall branding score</p>
            <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +7 points vs last month
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
          <StatCard label="Industry rank" value="#4 of 87" hint="Top 5% in IT services" tone="brand" icon={<Trophy className="h-5 w-5" />} />
          <StatCard label="Completed actions" value={`${completedActions}/${actions.length}`} hint="Action plan progress" tone="success" icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard label="Candidate saves (30d)" value="1,284" delta={{ value: "+24%", positive: true }} icon={<Sparkles className="h-5 w-5" />} />
        </div>
      </div>

      {/* Category breakdown */}
      <SectionCard title="Category breakdown" description="8 categories contribute to your overall score">
        <div className="grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((c) => {
            const status = c.score >= 80 ? "complete" : c.score >= 40 ? "partial" : "missing";
            const IconCmp = status === "complete" ? CheckCircle2 : status === "partial" ? AlertCircle : XCircle;
            const tone = status === "complete" ? "text-emerald-600" : status === "partial" ? "text-amber-600" : "text-rose-600";
            return (
              <Card key={c.key}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconCmp className={`h-4 w-4 ${tone}`} />
                      <div>
                        <p className="text-sm font-medium">{c.label}</p>
                        <p className="text-xs text-muted-foreground">{c.tip}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tone}`}>{c.score}%</span>
                  </div>
                  <Progress value={c.score} className="h-1.5" />
                  <div className="flex items-center gap-2 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                    <Lightbulb className="h-3.5 w-3.5 text-brand shrink-0" />
                    <span>{c.improve}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => toast.info(`Opening editor for: ${c.label}`)}>
                    Improve <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Competitor comparison */}
        <SectionCard title="Competitor comparison" description="How you stack up against similar employers">
          <div className="space-y-3">
            {COMPETITORS.map((c) => {
              const tone = c.score >= 80 ? "bg-emerald-500" : c.score >= 60 ? "bg-amber-500" : "bg-rose-500";
              return (
                <div key={c.name} className={`rounded-md border p-3 ${c.isYou ? "border-brand/40 bg-brand/5" : ""}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${c.isYou ? "text-brand" : ""}`}>
                      {c.isYou && <Target className="inline h-3.5 w-3.5 mr-1" />}
                      {c.name}
                    </span>
                    <span className="font-semibold">{c.score}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${tone} rounded-full`} style={{ width: `${c.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
            You're <strong className="text-brand">6 points</strong> behind the leader. Closing the culture video and awards gaps would put you in the #1 spot.
          </div>
        </SectionCard>

        {/* Monthly trend */}
        <SectionCard title="Monthly score trend" description="Last 7 months">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TREND} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                  formatter={(v: number) => [`${v}/100`, "Score"]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {TREND.map((d, i) => (
                    <Cell key={i} className={d.score >= 80 ? "fill-emerald-500" : d.score >= 60 ? "fill-amber-500" : "fill-rose-500"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Action plan */}
      <SectionCard
        title="Action plan"
        description="Complete these actions to boost your score"
        action={<Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">{completedActions} of {actions.length} done</Badge>}
      >
        <div className="space-y-2">
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={toggleAction}
              className="flex w-full items-center gap-3 rounded-md border p-3 text-left hover:border-brand/40 hover:bg-brand/5 transition-colors"
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded border ${a.done ? "bg-brand border-brand" : "border-muted-foreground/40"}`}>
                {a.done && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <span className={`flex-1 text-sm ${a.done ? "line-through text-muted-foreground" : ""}`}>{a.title}</span>
              <Badge variant="outline" className="border-brand/20 text-brand">{a.impact}</Badge>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Completing all actions is estimated to raise your score to <strong className="text-brand">98/100</strong>.
        </p>
      </SectionCard>
    </div>
  );
}
