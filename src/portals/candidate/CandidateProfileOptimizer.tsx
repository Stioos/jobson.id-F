"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNav } from "@/lib/store";

// ----- Types & mock data -----
type SectionStatus = "complete" | "needs" | "missing";

interface SectionItem {
  id: string;
  name: string;
  score: number;
  status: SectionStatus;
  tips: string[];
  route?: string;
  icon: string;
}

interface AiRecommendation {
  id: string;
  text: string;
  impact: string;
  effort: "low" | "medium" | "high";
}

interface ActionItem {
  id: string;
  title: string;
  detail: string;
  priority: "P0" | "P1" | "P2";
  eta: string;
  route?: string;
}

const SECTIONS: SectionItem[] = [
  {
    id: "personal",
    name: "Personal Info",
    score: 100,
    status: "complete",
    tips: ["Your name, contact, and location are complete."],
    route: "profile",
    icon: "User",
  },
  {
    id: "summary",
    name: "Summary",
    score: 80,
    status: "needs",
    tips: [
      "Add 1–2 quantified achievements to your summary.",
      "Mention your top 3 skills explicitly.",
    ],
    route: "profile",
    icon: "AlignLeft",
  },
  {
    id: "experience",
    name: "Experience",
    score: 60,
    status: "needs",
    tips: [
      "Quantify at least 2 more bullet points (e.g., 'reduced X by Y%').",
      "Add a brief project scope for each role.",
      "Update your current role's most recent impact.",
    ],
    route: "profile",
    icon: "Briefcase",
  },
  {
    id: "education",
    name: "Education",
    score: 100,
    status: "complete",
    tips: ["Degree, school, and year are filled in."],
    route: "profile",
    icon: "GraduationCap",
  },
  {
    id: "skills",
    name: "Skills",
    score: 40,
    status: "needs",
    tips: [
      "Add 3 more skills to reach the recommended minimum of 10.",
      "Verify at least 2 skills via quick assessments.",
      "Add skill levels to help recruiters gauge expertise.",
    ],
    route: "skills",
    icon: "Brain",
  },
  {
    id: "certifications",
    name: "Certifications",
    score: 0,
    status: "missing",
    tips: [
      "Add at least 1 recent certification.",
      "Link to verification URL if available.",
    ],
    route: "certificates",
    icon: "Award",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    score: 20,
    status: "needs",
    tips: [
      "Add 2 more projects with descriptions.",
      "Include live demo links or GitHub repos.",
      "Add a thumbnail image for each project.",
    ],
    route: "portfolio",
    icon: "FolderGit2",
  },
  {
    id: "resume",
    name: "Resume",
    score: 100,
    status: "complete",
    tips: ["Resume uploaded and parsed successfully."],
    route: "resume",
    icon: "FileText",
  },
];

const AI_RECS: AiRecommendation[] = [
  { id: "r1", text: "Add 3 more skills to reach 80% profile strength.", impact: "+8% completeness", effort: "low" },
  { id: "r2", text: "Upload a professional headshot to increase recruiter views by 2.3x.", impact: "+5% completeness", effort: "low" },
  { id: "r3", text: "Write a summary highlighting your top 3 achievements with metrics.", impact: "+6% completeness", effort: "medium" },
  { id: "r4", text: "Request verification for React, TypeScript, and Next.js skills.", impact: "Higher search rank", effort: "medium" },
  { id: "r5", text: "Add at least 1 certification issued in the last 12 months.", impact: "+4% completeness", effort: "high" },
  { id: "r6", text: "Enable 'Open to work' to surface in active-candidate searches.", impact: "4x more contacts", effort: "low" },
];

const ACTIONS: ActionItem[] = [
  { id: "a1", title: "Add certifications", detail: "0 of 3 recommended. Add AWS, Scrum, or accessibility certs.", priority: "P0", eta: "~10 min", route: "certificates" },
  { id: "a2", title: "Verify 3 skills", detail: "React, TypeScript, Next.js are unverified.", priority: "P0", eta: "~15 min", route: "skills" },
  { id: "a3", title: "Expand portfolio", detail: "Add 2 more projects with demos.", priority: "P1", eta: "~30 min", route: "portfolio" },
  { id: "a4", title: "Quantify experience bullets", detail: "Add metrics to 2 experience highlights.", priority: "P1", eta: "~20 min", route: "profile" },
  { id: "a5", title: "Polish summary", detail: "Add 2 quantified achievements.", priority: "P2", eta: "~10 min", route: "profile" },
];

const STATUS_META: Record<SectionStatus, { label: string; cls: string; ring: string }> = {
  complete: { label: "Complete", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", ring: "stroke-emerald-500" },
  needs: { label: "Needs Attention", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", ring: "stroke-amber-500" },
  missing: { label: "Missing", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", ring: "stroke-rose-500" },
};

const PRIORITY_CLS: Record<ActionItem["priority"], string> = {
  P0: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  P1: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  P2: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
};

export function CandidateProfileOptimizer() {
  const { navigate } = useNav();
  const overall = Math.round(SECTIONS.reduce((a, s) => a + s.score, 0) / SECTIONS.length);

  function fixNow(section: SectionItem) {
    if (section.route) {
      navigate("candidate", section.route);
      toast.info("Opening section", { description: `Taking you to ${section.name}.` });
    } else {
      toast.info("Fix in place", { description: `Tip: ${section.tips[0]}` });
    }
  }

  // Circular progress for overall score
  const r = 56;
  const circ = 2 * Math.PI * r;
  const ringColor = overall >= 80 ? "stroke-emerald-500" : overall >= 60 ? "stroke-amber-500" : "stroke-rose-500";
  const scoreColor = overall >= 80 ? "text-emerald-600 dark:text-emerald-400" : overall >= 60 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Completeness Optimizer"
        description="Improve your profile strength to rank higher in recruiter searches and increase interview callbacks."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[
          {
            label: "Run AI scan",
            variant: "outline",
            onClick: () => toast.success("Scan complete", { description: `Current strength: ${overall}%. ${ACTIONS.length} actions identified.` }),
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Overall score — circular */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg className="h-44 w-44 -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={r} fill="none" className="stroke-muted" strokeWidth="10" />
                <circle
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  className={ringColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ - (circ * overall) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{overall}</span>
                <span className="text-xs font-medium text-muted-foreground">out of 100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">
                {overall >= 80 ? "Excellent profile" : overall >= 60 ? "Good — keep going" : "Needs work"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {overall >= 80
                  ? "You're in the top 15% of candidate profiles."
                  : overall >= 60
                  ? "Reach 80% to appear in top recruiter searches."
                  : "Add the missing sections to unlock more visibility."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section breakdown */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="Gauge" className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold">Section breakdown</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SECTIONS.map((s) => {
                const meta = STATUS_META[s.status];
                return (
                  <div key={s.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                          <Icon name={s.icon} className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{s.score}%</span>
                    </div>
                    <Progress value={s.score} className="mt-2 h-1.5" />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.cls}`}>
                        {meta.label}
                      </span>
                      {s.status !== "complete" && (
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => fixNow(s)}>
                          Fix Now <Icon name="ArrowRight" className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* AI recommendations */}
        <SectionCard
          title="AI recommendations"
          description="Prioritized improvements based on recruiter search patterns."
          action={<Badge className="bg-brand/10 text-brand">AI</Badge>}
        >
          <ul className="space-y-3">
            {AI_RECS.map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon name="Wand2" className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{r.text}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400">{r.impact}</Badge>
                    <span className="text-muted-foreground">
                      Effort: {r.effort === "low" ? "Low (~5 min)" : r.effort === "medium" ? "Medium (~15 min)" : "High (~30+ min)"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Priority-ranked action items */}
        <SectionCard
          title="Priority action items"
          description="Tackle these in order for the fastest profile strength gain."
        >
          <div className="space-y-2">
            {ACTIONS.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                <span className={`inline-flex h-6 shrink-0 items-center rounded-md border px-1.5 text-[10px] font-bold ${PRIORITY_CLS[a.priority]}`}>
                  {a.priority}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Estimated: {a.eta}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    if (a.route) {
                      navigate("candidate", a.route);
                      toast.info("Opening", { description: a.title });
                    }
                  }}
                >
                  Start
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
