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
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
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

interface Step {
  role: string;
  years: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  companies: string[];
}

interface CareerPath {
  id: string;
  title: string;
  steps: Step[];
  targetSkills: string[];
  stories: { name: string; from: string; to: string; years: number; story: string; }[];
  altPaths: string[];
}

const PATHS: CareerPath[] = [
  {
    id: "p1",
    title: "Frontend Engineer → Staff Engineer",
    targetSkills: ["System Design", "Tech Leadership", "Mentorship", "Architecture", "Cross-team Collaboration"],
    steps: [
      { role: "Junior Frontend Engineer", years: "0–2 yrs", salaryMin: 800000, salaryMax: 1400000, skills: ["HTML/CSS", "JavaScript", "React basics"], companies: ["Startups", "Service companies"] },
      { role: "Frontend Engineer", years: "2–4 yrs", salaryMin: 1400000, salaryMax: 2400000, skills: ["React", "TypeScript", "State management"], companies: ["Product startups", "Mid-size"] },
      { role: "Senior Frontend Engineer", years: "4–7 yrs", salaryMin: 2400000, salaryMax: 4000000, skills: ["Architecture", "Performance", "Mentoring"], companies: ["Product companies", "MNCs"] },
      { role: "Staff Engineer", years: "7–12 yrs", salaryMin: 4000000, salaryMax: 8000000, skills: ["Multi-team impact", "Tech strategy", "Hiring bar"], companies: ["Top product cos", "Late-stage startups"] },
    ],
    stories: [
      { name: "Arjun S.", from: "Frontend Engineer", to: "Staff Engineer", years: 6, story: "Specialized in performance optimization. Led a company-wide migration to React 18. Spent 1 year on architecture council before promotion." },
      { name: "Meera D.", from: "Senior Frontend Engineer", to: "Staff Engineer", years: 3, story: "Built design system adopted across 4 products. Mentored 8 engineers. Spoke at ReactConf India — visibility helped." },
    ],
    altPaths: ["Frontend → Engineering Manager", "Frontend → Product Engineer (full-stack)", "Frontend → DevRel"],
  },
  {
    id: "p2",
    title: "Backend Engineer → Engineering Manager",
    targetSkills: ["People Management", "Hiring", "Project Planning", "Stakeholder Mgmt", "Performance Reviews"],
    steps: [
      { role: "Backend Engineer", years: "0–3 yrs", salaryMin: 1000000, salaryMax: 2200000, skills: ["Java/Go/Python", "Databases", "APIs"], companies: ["Startups", "Service cos"] },
      { role: "Senior Backend Engineer", years: "3–6 yrs", salaryMin: 2200000, salaryMax: 3800000, skills: ["Distributed systems", "Caching", "Mentoring"], companies: ["Product cos", "MNCs"] },
      { role: "Tech Lead", years: "6–9 yrs", salaryMin: 3800000, salaryMax: 5500000, skills: ["Team leadership", "Architecture", "Roadmaps"], companies: ["Product cos", "Late-stage startups"] },
      { role: "Engineering Manager", years: "9–14 yrs", salaryMin: 5500000, salaryMax: 9000000, skills: ["People mgmt", "Hiring", "Budget"], companies: ["Top product cos", "MNCs"] },
    ],
    stories: [
      { name: "Rahul K.", from: "Senior Backend Engineer", to: "Engineering Manager", years: 4, story: "Started mentoring interns, then ran a 6-person pod informally. Took a people-mgmt course. Promoted after 2 cycles." },
      { name: "Priya N.", from: "Tech Lead", to: "Engineering Manager", years: 2, story: "Led a critical migration project. Made it visible to leadership. Asked for EM role explicitly — got it within 6 months." },
    ],
    altPaths: ["Backend → Staff Engineer (IC track)", "Backend → SRE/Platform", "Backend → Product Manager"],
  },
  {
    id: "p3",
    title: "Data Analyst → Data Scientist",
    targetSkills: ["Python", "ML Fundamentals", "Statistics", "SQL", "Productionization"],
    steps: [
      { role: "Data Analyst", years: "0–2 yrs", salaryMin: 600000, salaryMax: 1200000, skills: ["SQL", "Excel", "Tableau/PowerBI"], companies: ["Consulting", "E-commerce"] },
      { role: "Senior Analyst", years: "2–4 yrs", salaryMin: 1200000, salaryMax: 2000000, skills: ["Python", "Statistics", "A/B testing"], companies: ["Product cos", "Fintech"] },
      { role: "Data Scientist", years: "4–7 yrs", salaryMin: 2000000, salaryMax: 4000000, skills: ["ML modeling", "Feature engineering", "MLOps basics"], companies: ["Product cos", "AI startups"] },
      { role: "Senior Data Scientist", years: "7–10 yrs", salaryMin: 4000000, salaryMax: 7000000, skills: ["ML systems design", "Mentoring", "Research"], companies: ["Top product cos", "AI labs"] },
    ],
    stories: [
      { name: "Sneha R.", from: "Senior Analyst", to: "Data Scientist", years: 3, story: "Took Andrew Ng's ML course on the side. Built 3 side projects on Kaggle. Got internal transfer after 18 months." },
      { name: "Karthik V.", from: "Data Analyst", to: "Data Scientist", years: 4, story: "Switched companies to make the jump. New role paid 60% more. Side projects on GitHub were the differentiator." },
    ],
    altPaths: ["Analyst → Analytics Engineer", "Analyst → Product Analyst", "Analyst → BI Manager"],
  },
  {
    id: "p4",
    title: "QA Engineer → SDET",
    targetSkills: ["Automation", "Programming", "CI/CD", "Test Architecture", "Performance Testing"],
    steps: [
      { role: "Manual QA", years: "0–2 yrs", salaryMin: 500000, salaryMax: 900000, skills: ["Test cases", "Bug reporting", "Agile"], companies: ["Service cos", "Startups"] },
      { role: "QA Engineer", years: "2–4 yrs", salaryMin: 900000, salaryMax: 1600000, skills: ["Selenium", "API testing", "Test planning"], companies: ["Product cos", "Mid-size"] },
      { role: "Automation Engineer", years: "4–7 yrs", salaryMin: 1600000, salaryMax: 2800000, skills: ["Cypress/Playwright", "CI/CD", "Frameworks"], companies: ["Product cos", "Late-stage startups"] },
      { role: "SDET", years: "7–12 yrs", salaryMin: 2800000, salaryMax: 5000000, skills: ["Test architecture", "Performance", "Mentoring"], companies: ["Top product cos", "MNCs"] },
    ],
    stories: [
      { name: "Anu M.", from: "QA Engineer", to: "SDET", years: 5, story: "Built a Cypress framework from scratch. Open-sourced a library. Got promoted to SDET after the framework saved 200 eng-hours/month." },
      { name: "Vikram T.", from: "Automation Engineer", to: "SDET", years: 3, story: "Specialized in performance testing. Got JMeter + k6 certified. Led load testing for a major launch — got promoted within a year." },
    ],
    altPaths: ["QA → DevOps", "QA → Software Engineer", "QA → Quality Manager"],
  },
  {
    id: "p5",
    title: "Software Engineer → Product Manager",
    targetSkills: ["User Research", "Roadmapping", "Stakeholder Mgmt", "Metrics", "Communication"],
    steps: [
      { role: "Software Engineer", years: "0–3 yrs", salaryMin: 1000000, salaryMax: 2000000, skills: ["Coding", "Debugging", "Team collaboration"], companies: ["Startups", "Product cos"] },
      { role: "Senior Engineer", years: "3–5 yrs", salaryMin: 2000000, salaryMax: 3500000, skills: ["Architecture", "Cross-team work", "Mentoring"], companies: ["Product cos", "MNCs"] },
      { role: "Tech PM / Lead Engineer", years: "5–7 yrs", salaryMin: 3000000, salaryMax: 5000000, skills: ["Specs", "Roadmaps", "User interviews"], companies: ["Product cos", "Late-stage startups"] },
      { role: "Product Manager", years: "7–12 yrs", salaryMin: 4000000, salaryMax: 8000000, skills: ["Discovery", "Metrics", "Stakeholders"], companies: ["Top product cos", "Late-stage startups"] },
    ],
    stories: [
      { name: "Deepak S.", from: "Senior Engineer", to: "Product Manager", years: 3, story: "Started writing specs informally. Did an executive PM course. Switched companies for the title — pay was 40% higher." },
      { name: "Ritu J.", from: "Tech PM", to: "Product Manager", years: 2, story: "Owned a small product area as engineer. Lobbied for PM title after a launch. Got internal promotion after 6 months." },
    ],
    altPaths: ["Engineer → Engineering Manager", "Engineer → Solutions Architect", "Engineer → DevRel"],
  },
];

const CURRENT_SKILLS = ["React", "TypeScript", "JavaScript", "HTML/CSS", "Git", "REST APIs"];

export function CandidateCareerExplorer() {
  const [pathId, setPathId] = React.useState(PATHS[0].id);
  const [currentRole, setCurrentRole] = React.useState(PATHS[0].steps[0].role);
  const [targetRole, setTargetRole] = React.useState(PATHS[0].steps[PATHS[0].steps.length - 1].role);

  const path = PATHS.find((p) => p.id === pathId)!;
  const startIdx = Math.max(0, path.steps.findIndex((s) => s.role === currentRole));
  const endIdx = Math.max(startIdx + 1, path.steps.findIndex((s) => s.role === targetRole));
  const visibleSteps = path.steps.slice(startIdx, endIdx + 1);

  // Skill gap analysis: skills required at target that user doesn't have
  const targetStep = path.steps[endIdx];
  const gap = targetStep.skills.filter((s) => !CURRENT_SKILLS.includes(s));
  const have = targetStep.skills.filter((s) => CURRENT_SKILLS.includes(s));
  const gapPct = Math.round((have.length / targetStep.skills.length) * 100);

  const onSelectPath = (id: string) => {
    const p = PATHS.find((x) => x.id === id)!;
    setPathId(id);
    setCurrentRole(p.steps[0].role);
    setTargetRole(p.steps[p.steps.length - 1].role);
    toast.info("Path loaded", { description: p.title });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Path Explorer"
        description="Visualize the route from where you are to where you want to be — required skills, salary ranges, transition companies and real success stories."
        icon={<Icon name="Route" className="h-6 w-6" />}
      />

      {/* Path selector + role pickers */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Career path</label>
            <Select value={pathId} onValueChange={onSelectPath}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PATHS.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Current role</label>
              <Select value={currentRole} onValueChange={setCurrentRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{path.steps.map((s) => <SelectItem key={s.role} value={s.role}>{s.role}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Target role</label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{path.steps.map((s) => <SelectItem key={s.role} value={s.role}>{s.role}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Path visualization */}
      <SectionCard title="Your path" description={`${visibleSteps.length} steps from ${currentRole} to ${targetRole}`}>
        <div className="space-y-3">
          {visibleSteps.map((s, i) => (
            <div key={s.role} className="relative pl-8">
              {i < visibleSteps.length - 1 && (
                <div className="absolute left-3 top-7 bottom-0 w-px bg-border" />
              )}
              <div className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? "bg-brand text-white" : i === visibleSteps.length - 1 ? "bg-emerald-500 text-white" : "bg-brand/15 text-brand border border-brand/30"}`}>
                {i === 0 ? <Icon name="User" className="h-3 w-3" /> : i === visibleSteps.length - 1 ? <Icon name="Trophy" className="h-3 w-3" /> : i}
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{s.role}</p>
                    <p className="text-xs text-muted-foreground">{s.years}</p>
                  </div>
                  <Badge variant="outline" className="text-brand border-brand/30">{formatCurrency(s.salaryMin)} – {formatCurrency(s.salaryMax)}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.skills.map((sk) => (
                    <span key={sk} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${CURRENT_SKILLS.includes(sk) ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {sk}{CURRENT_SKILLS.includes(sk) && " ✓"}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  <Icon name="Building2" className="inline h-3 w-3 mr-1" />
                  Common transitions: {s.companies.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Skill gap analysis */}
        <SectionCard title="Skill gap analysis" description={`From ${currentRole} → ${targetRole}`}>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Readiness for target role</span>
                <span className="font-semibold text-brand">{gapPct}%</span>
              </div>
              <Progress value={gapPct} className="mt-1 h-2" />
            </div>
            {have.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Skills you already have</p>
                <div className="flex flex-wrap gap-1">
                  {have.map((s) => <Badge key={s} variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">{s}</Badge>)}
                </div>
              </div>
            )}
            {gap.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Skills to develop</p>
                <div className="space-y-2">
                  {gap.map((s) => (
                    <div key={s} className="flex items-center justify-between rounded-lg border p-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Brain" className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">{s}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toast.info("Learning resources", { description: `Showing courses for ${s}.` })}>
                        <Icon name="GraduationCap" className="mr-1 h-3 w-3" /> Learn
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Recommended learning resources */}
        <SectionCard title="Recommended resources" description="Curated courses & books to close the gap">
          <ul className="space-y-2">
            {gap.slice(0, 5).map((s) => (
              <li key={s} className="flex items-start gap-2 rounded-lg border p-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name="BookOpen" className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Mastering {s}</p>
                  <p className="text-xs text-muted-foreground">Online course · 12 hours · Beginner-friendly</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 h-7 px-2 text-xs" onClick={() => toast.success("Added to learning plan")}>Add</Button>
              </li>
            ))}
            {gap.length === 0 && (
              <li className="rounded-lg border border-dashed p-4 text-center">
                <Icon name="CircleCheck" className="mx-auto h-6 w-6 text-emerald-500" />
                <p className="mt-2 text-sm font-medium">No skill gaps!</p>
                <p className="text-xs text-muted-foreground">You're ready to make the move.</p>
              </li>
            )}
          </ul>
        </SectionCard>
      </div>

      {/* Success stories */}
      <SectionCard title="Success stories" description="Real people who made this transition">
        <div className="grid gap-3 sm:grid-cols-2">
          {path.stories.map((s) => (
            <div key={s.name} className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <AvatarLogo text={s.name} size="md" />
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.from} → {s.to}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.story}</p>
              <p className="mt-2 text-[11px] text-brand">⏱ Took {s.years} years</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Alternative paths */}
      <SectionCard title="Alternative paths" description="Other transitions from your current role">
        <div className="flex flex-wrap gap-2">
          {path.altPaths.map((a) => (
            <button key={a} onClick={() => toast.info("Explore alternative", { description: a })}
              className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 transition-colors">
              {a}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
