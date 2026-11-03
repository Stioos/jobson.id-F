"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNav } from "@/lib/store";

// ----- Mock profile data (employer-facing subset) -----
interface SkillBadge {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  verified: boolean;
  endorsements: number;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
  highlights: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  score: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

const SKILLS: SkillBadge[] = [
  { name: "React", level: "Expert", verified: true, endorsements: 42 },
  { name: "TypeScript", level: "Expert", verified: true, endorsements: 38 },
  { name: "Next.js", level: "Advanced", verified: true, endorsements: 27 },
  { name: "GraphQL", level: "Advanced", verified: true, endorsements: 19 },
  { name: "Node.js", level: "Advanced", verified: false, endorsements: 15 },
  { name: "AWS", level: "Intermediate", verified: false, endorsements: 9 },
  { name: "Tailwind CSS", level: "Expert", verified: false, endorsements: 22 },
  { name: "Accessibility (WCAG)", level: "Advanced", verified: true, endorsements: 11 },
];

const EXPERIENCE: ExperienceItem[] = [
  {
    id: "e1",
    role: "Senior Frontend Engineer",
    company: "TechCorp India",
    duration: "2021 — Present",
    location: "Bengaluru, IN",
    description:
      "Lead frontend for a fintech platform serving 1M+ monthly users. Built the company design system used by 8 product teams.",
    highlights: [
      "Reduced bundle size by 38% via code-splitting & tree-shaking",
      "Improved Lighthouse performance score from 62 to 95",
      "Mentored 4 engineers and ran weekly architecture reviews",
    ],
  },
  {
    id: "e2",
    role: "Frontend Engineer",
    company: "FinEdge",
    duration: "2018 — 2021",
    location: "Pune, IN",
    description:
      "Shipped customer-facing dashboards and owned accessibility compliance (WCAG AA).",
    highlights: [
      "Built reusable charting library adopted by 5 teams",
      "Cut first contentful paint by 1.4s across product",
    ],
  },
];

const EDUCATION: EducationItem[] = [
  { id: "ed1", degree: "B.Tech, Computer Science", school: "BITS Pilani", year: "2017", score: "8.9 CGPA" },
];

const CERTIFICATIONS: CertificationItem[] = [
  { id: "c1", name: "AWS Certified Developer — Associate", issuer: "Amazon Web Services", year: "2023", verified: true },
  { id: "c2", name: "Professional Scrum Master I", issuer: "Scrum.org", year: "2022", verified: true },
  { id: "c3", name: "Accessibility Specialist", issuer: "IAAP", year: "2021", verified: false },
];

const MATCH_SCORE = 87;
const COMPLETENESS = 78;

const VISIBILITY_TIPS: { id: string; title: string; desc: string; impact: "high" | "medium" | "low" }[] = [
  {
    id: "t1",
    title: "Add 3 more verified skills",
    desc: "Verified skills rank higher in employer searches. Take quick assessments to verify Node.js, AWS, and Tailwind CSS.",
    impact: "high",
  },
  {
    id: "t2",
    title: "Upload a professional headshot",
    desc: "Profiles with photos receive 2.3x more recruiter views. Use a clean, well-lit head-and-shoulders shot.",
    impact: "medium",
  },
  {
    id: "t3",
    title: "Quantify 2 more achievements",
    desc: "Numbers catch the eye. Add metrics like 'reduced X by Y%' to your experience bullets.",
    impact: "medium",
  },
  {
    id: "t4",
    title: "Set an active 'Open to work' status",
    desc: "Recruiters prioritize candidates who signal availability. You're 4x more likely to be contacted.",
    impact: "high",
  },
];

export function CandidateProfilePreview() {
  const { navigate } = useNav();
  const [view, setView] = React.useState<"employer" | "mine">("employer");

  function disabledAction(label: string) {
    toast.info("Preview mode", {
      description: `This is how employers see your profile. The "${label}" button would be available to recruiters.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Preview"
        description="See exactly how recruiters view your profile. Toggle between your editable view and the anonymized employer view."
        icon={<Icon name="Eye" className="h-6 w-6" />}
        actions={[
          {
            label: "Edit Profile",
            variant: "outline",
            onClick: () => navigate("candidate", "profile"),
          },
        ]}
      />

      {/* Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "employer" | "mine")}>
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="employer" className="gap-1">
            <Icon name="Eye" className="h-4 w-4" /> Employer View
          </TabsTrigger>
          <TabsTrigger value="mine" className="gap-1">
            <Icon name="User" className="h-4 w-4" /> My View
          </TabsTrigger>
        </TabsList>

        {/* EMPLOYER VIEW */}
        <TabsContent value="employer" className="space-y-4">
          {/* Header card with anonymized identity */}
          <Card className="overflow-hidden border border-border/80 shadow-xs">
            <CardContent className="p-6 sm:p-6 sm:pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <AvatarLogo text="Priya Nair" size="xl" />
                <div className="min-w-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Priya Nair</h2>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px] gap-1 px-2.5 py-0.5">
                      <Icon name="BadgeCheck" className="h-3.5 w-3.5" /> Verified Profile
                    </Badge>
                    <Badge className="bg-brand/10 text-brand border border-brand/20 font-medium text-[11px] gap-1 px-2.5 py-0.5">
                      <Icon name="Sparkles" className="h-3.5 w-3.5" /> {MATCH_SCORE}% Match
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Senior Frontend Engineer · 7+ yrs</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="MapPin" className="h-3.5 w-3.5 text-muted-foreground/80" /> Bengaluru, IN
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="Briefcase" className="h-3.5 w-3.5 text-muted-foreground/80" /> Currently at TechCorp India
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="Mail" className="h-3.5 w-3.5 text-muted-foreground/80" /> Contact hidden
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="PhoneCall" className="h-3.5 w-3.5 text-muted-foreground/80" /> Contact hidden
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" disabled onClick={() => disabledAction("Download Resume")}>
                      <Icon name="Download" className="mr-1 h-3.5 w-3.5" /> Resume
                    </Button>
                    <Button size="sm" variant="outline" disabled onClick={() => disabledAction("Shortlist")}>
                      <Icon name="Bookmark" className="mr-1 h-3.5 w-3.5" /> Shortlist
                    </Button>
                    <Button size="sm" disabled onClick={() => disabledAction("Contact")}>
                      <Icon name="MailOpen" className="mr-1 h-3.5 w-3.5" /> Contact
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Preview — actions disabled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <StatCard
              label="Profile Completeness"
              value={`${COMPLETENESS}%`}
              tone="brand"
              icon={<Icon name="Gauge" className="h-5 w-5" />}
              hint="Above 70% recommended"
            />
            <StatCard
              label="Verified Skills"
              value={`${SKILLS.filter((s) => s.verified).length}/${SKILLS.length}`}
              tone="success"
              icon={<Icon name="BadgeCheck" className="h-5 w-5" />}
              hint="Endorsed by community"
            />
            <StatCard
              label="Profile Views (30d)"
              value="142"
              tone="default"
              icon={<Icon name="Eye" className="h-5 w-5" />}
              hint="↑ 18% vs last month"
            />
          </div>

          {/* Skills with verified badges */}
          <SectionCard
            title="Skills"
            description="Verified skills rank higher in employer searches."
          >
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <div
                  key={s.name}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">· {s.level}</span>
                  {s.verified ? (
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      <Icon name="BadgeCheck" className="h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Experience timeline */}
          <SectionCard
            title="Experience"
            description="A timeline of professional roles as employers see them."
          >
            <ol className="relative space-y-5 border-l border-border pl-6">
              {EXPERIENCE.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand/15 ring-4 ring-background">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold">{e.role}</h4>
                    <span className="text-xs text-muted-foreground">{e.duration}</span>
                  </div>
                  <p className="text-xs font-medium text-brand">
                    {e.company} · {e.location}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                  <ul className="mt-2 space-y-1">
                    {e.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs">
                        <Icon name="CheckCircle2" className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </SectionCard>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Education */}
            <SectionCard title="Education">
              <div className="space-y-3">
                {EDUCATION.map((ed) => (
                  <div key={ed.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name="GraduationCap" className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{ed.degree}</p>
                      <p className="text-xs text-muted-foreground">{ed.school} · {ed.year}</p>
                      <p className="text-xs text-brand">{ed.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Certifications */}
            <SectionCard title="Certifications">
              <div className="space-y-3">
                {CERTIFICATIONS.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name="Award" className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.issuer} · {c.year}</p>
                    </div>
                    {c.verified ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Icon name="BadgeCheck" className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Tips to improve visibility */}
          <SectionCard
            title="Tips to improve visibility"
            description="Higher completeness → more recruiter views and contact requests."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {VISIBILITY_TIPS.map((t) => (
                <div key={t.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{t.title}</h4>
                    <Badge
                      className={
                        t.impact === "high"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : t.impact === "medium"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {t.impact} impact
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* MY VIEW */}
        <TabsContent value="mine" className="space-y-4">
          <Card className="overflow-hidden border border-border/80 shadow-xs">
            <CardContent className="p-6 sm:p-6 sm:pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground/90">Profile Completeness</span>
                  <span className="text-sm font-semibold text-brand">{COMPLETENESS}%</span>
                </div>
                <Progress value={COMPLETENESS} className="h-2.5" />
                <p className="text-xs text-muted-foreground">
                  Add 3 more skills, a professional headshot, and quantified achievements to reach 90%+.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => navigate("candidate", "profile-optimizer")}>
                    <Icon name="Sparkles" className="mr-1 h-3.5 w-3.5" /> Open Optimizer
                  </Button>
                  <Button size="sm" onClick={() => navigate("candidate", "profile")}>
                    <Icon name="Pencil" className="mr-1 h-3.5 w-3.5" /> Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <EmptyState
            icon={<Icon name="Eye" className="h-6 w-6" />}
            title="Switch to Employer View"
            description="The Employer View shows your anonymized, recruiter-facing profile with match score, verified skills, and disabled action buttons."
            action={
              <Button size="sm" onClick={() => setView("employer")}>
                <Icon name="Eye" className="mr-1 h-3.5 w-3.5" /> Show Employer View
              </Button>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
