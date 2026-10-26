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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// ----- Types & mock data -----
interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}
interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

const INITIAL_DATA: ResumeData = {
  fullName: "Priya Nair",
  title: "Senior Frontend Engineer",
  email: "priya.nair@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, IN",
  linkedin: "linkedin.com/in/priyanair",
  summary:
    "Senior Frontend Engineer with 7+ years building accessible, performant web apps in React and TypeScript. Led UI architecture for fintech and SaaS products serving 1M+ users. Passionate about design systems, mentoring, and shipping quality at scale.",
  experience: [
    {
      id: "e_1",
      role: "Senior Frontend Engineer",
      company: "TechCorp India",
      duration: "2021 – Present",
      description:
        "Led migration of legacy monolith to Next.js App Router. Built design system adopted by 8 product teams. Mentored 4 engineers and reduced bundle size by 38%.",
    },
    {
      id: "e_2",
      role: "Frontend Engineer",
      company: "FinEdge",
      duration: "2018 – 2021",
      description:
        "Shipped customer-facing dashboards in React and Redux. Improved Lighthouse score from 62 to 95. Owned accessibility compliance (WCAG AA).",
    },
  ],
  education: [
    {
      id: "ed_1",
      degree: "B.Tech, Computer Science",
      school: "BITS Pilani",
      year: "2017",
    },
  ],
  skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind", "Node.js", "AWS", "Accessibility", "Design Systems"],
};

// ----- ATS scoring logic -----
function scoreKeywords(data: ResumeData): number {
  // Heuristic: known high-impact keywords presence (max 40)
  const keywords = ["react", "typescript", "next.js", "graphql", "lead", "architect", "built", "shipped", "mentored", "migration", "performance", "accessible", "design system"];
  const text = (data.summary + " " + data.experience.map((e) => e.description).join(" ")).toLowerCase();
  const hits = keywords.filter((k) => text.includes(k));
  return Math.min(40, Math.round((hits.length / keywords.length) * 40));
}
function scoreFormat(data: ResumeData): number {
  let s = 0;
  if (data.experience.length >= 2) s += 10;
  if (data.education.length >= 1) s += 5;
  if (data.skills.length >= 5) s += 5;
  return Math.min(20, s);
}
function scoreLength(data: ResumeData): number {
  const text = data.summary + data.experience.map((e) => e.description).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 100) return 5;
  if (words < 200) return 10;
  if (words <= 600) return 15;
  return 12; // too long penalized slightly
}
function scoreContact(data: ResumeData): number {
  let s = 0;
  if (data.email && data.email.includes("@")) s += 5;
  if (data.phone && data.phone.length >= 8) s += 4;
  if (data.location) s += 3;
  if (data.linkedin) s += 3;
  return Math.min(15, s);
}
function scoreActionVerbs(data: ResumeData): number {
  const verbs = ["led", "built", "shipped", "mentored", "improved", "owned", "launched", "scaled", "designed", "drove"];
  const text = data.experience.map((e) => e.description).join(" ").toLowerCase();
  const hits = verbs.filter((v) => text.includes(v));
  return Math.min(10, Math.round((hits.length / verbs.length) * 10));
}

function computeScore(data: ResumeData) {
  const keywords = scoreKeywords(data);
  const format = scoreFormat(data);
  const length = scoreLength(data);
  const contact = scoreContact(data);
  const verbs = scoreActionVerbs(data);
  const total = keywords + format + length + contact + verbs;
  return { keywords, format, length, contact, verbs, total };
}

// ----- Component -----
export function CandidateResumeBuilder() {
  const [data, setData] = React.useState<ResumeData>(INITIAL_DATA);
  const [skillInput, setSkillInput] = React.useState("");
  const score = computeScore(data);

  function update<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }

  function addSkill() {
    const s = skillInput.trim();
    if (!s) return;
    if (data.skills.includes(s)) {
      toast.info("Skill already added");
      return;
    }
    update("skills", [...data.skills, s]);
    setSkillInput("");
  }

  function removeSkill(s: string) {
    update("skills", data.skills.filter((x) => x !== s));
  }

  function addExperience() {
    update("experience", [
      ...data.experience,
      { id: `e_${Date.now()}`, role: "New Role", company: "Company", duration: "Year – Year", description: "Describe your impact and achievements." },
    ]);
  }
  function updateExperience(id: string, patch: Partial<ExperienceItem>) {
    update("experience", data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function removeExperience(id: string) {
    update("experience", data.experience.filter((e) => e.id !== id));
  }

  function addEducation() {
    update("education", [
      ...data.education,
      { id: `ed_${Date.now()}`, degree: "Degree", school: "School", year: "Year" },
    ]);
  }
  function updateEducation(id: string, patch: Partial<EducationItem>) {
    update("education", data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function removeEducation(id: string) {
    update("education", data.education.filter((e) => e.id !== id));
  }

  function save() {
    toast.success("Resume saved", { description: `ATS score: ${score.total}/100` });
  }
  function download() {
    toast.success("Resume exported", { description: "resume-priya-nair.pdf" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Builder"
        description="Craft a recruiter-ready resume with live ATS scoring. Aim for 80+ to maximize interview callbacks."
        icon={<Icon name="FilePlus2" className="h-6 w-6" />}
        actions={[
          { label: "Save draft", icon: "BadgeCheck", variant: "outline", onClick: save },
          { label: "Download PDF", icon: "Download", onClick: download },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* LEFT — form */}
        <div className="space-y-4">
          {/* Personal info */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Icon name="User" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Personal Information</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name">
                  <Input value={data.fullName} onChange={(e) => update("fullName", e.target.value)} />
                </Field>
                <Field label="Professional title">
                  <Input value={data.title} onChange={(e) => update("title", e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
                </Field>
                <Field label="Location">
                  <Input value={data.location} onChange={(e) => update("location", e.target.value)} />
                </Field>
                <Field label="LinkedIn">
                  <Input value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Professional Summary</h3>
              </div>
              <Textarea
                rows={4}
                value={data.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="2–4 sentences highlighting your experience, impact, and strengths."
              />
              <p className="text-xs text-muted-foreground">{data.summary.split(/\s+/).filter(Boolean).length} words</p>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Briefcase" className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-semibold">Experience</h3>
                </div>
                <Button size="sm" variant="outline" onClick={addExperience}>
                  <Icon name="Plus" className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {data.experience.map((e) => (
                  <div key={e.id} className="rounded-lg border p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input value={e.role} onChange={(ev) => updateExperience(e.id, { role: ev.target.value })} placeholder="Role" />
                      <Input value={e.company} onChange={(ev) => updateExperience(e.id, { company: ev.target.value })} placeholder="Company" />
                    </div>
                    <Input
                      className="mt-2"
                      value={e.duration}
                      onChange={(ev) => updateExperience(e.id, { duration: ev.target.value })}
                      placeholder="Duration"
                    />
                    <Textarea
                      className="mt-2"
                      rows={3}
                      value={e.description}
                      onChange={(ev) => updateExperience(e.id, { description: ev.target.value })}
                      placeholder="Quantify your impact with metrics."
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => removeExperience(e.id)}>
                        <Icon name="Trash2" className="mr-1 h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="GraduationCap" className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-semibold">Education</h3>
                </div>
                <Button size="sm" variant="outline" onClick={addEducation}>
                  <Icon name="Plus" className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {data.education.map((e) => (
                  <div key={e.id} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                    <Input value={e.degree} onChange={(ev) => updateEducation(e.id, { degree: ev.target.value })} placeholder="Degree" />
                    <Input value={e.school} onChange={(ev) => updateEducation(e.id, { school: ev.target.value })} placeholder="School" />
                    <Input value={e.year} onChange={(ev) => updateEducation(e.id, { year: ev.target.value })} placeholder="Year" />
                    <div className="flex items-end justify-end">
                      <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => removeEducation(e.id)}>
                        <Icon name="Trash2" className="mr-1 h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Icon name="Brain" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Skills</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-brand/10 text-brand border-brand/20">
                    {s}
                    <button
                      onClick={() => removeSkill(s)}
                      className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-brand/20"
                      aria-label={`Remove ${s}`}
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — ATS + preview */}
        <div className="space-y-4">
          {/* ATS score */}
          <Card className="border-brand/30">
            <CardContent className="bg-gradient-to-br from-brand/10 to-transparent p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ATS Resume Score</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-brand">{score.total}<span className="text-lg text-muted-foreground">/100</span></p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Icon name="Sparkles" className="h-6 w-6" />
                </div>
              </div>
              <Progress value={score.total} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                {score.total >= 80 ? "Excellent — high interview callback likelihood." : score.total >= 60 ? "Good — a few tweaks will boost callbacks." : "Needs work — see breakdown below."}
              </p>

              {/* Breakdown */}
              <div className="mt-4 space-y-2">
                <ScoreRow label="Keywords" icon="Search" score={score.keywords} max={40} />
                <ScoreRow label="Format" icon="LayoutTemplate" score={score.format} max={20} />
                <ScoreRow label="Length" icon="AlignLeft" score={score.length} max={15} />
                <ScoreRow label="Contact Info" icon="Phone" score={score.contact} max={15} />
                <ScoreRow label="Action Verbs" icon="Zap" score={score.verbs} max={10} />
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <SectionCard title="ATS tips" description="Improve your score with these quick wins.">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Use keywords from the job description verbatim.</li>
              <li className="flex items-start gap-2"><Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Start bullets with action verbs (Led, Built, Shipped).</li>
              <li className="flex items-start gap-2"><Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Quantify impact: "Reduced bundle size by 38%".</li>
              <li className="flex items-start gap-2"><Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Keep summary to 2–4 sentences (150–250 words total).</li>
              <li className="flex items-start gap-2"><Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />List at least 8–10 relevant skills.</li>
            </ul>
          </SectionCard>

          {/* Live preview */}
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Eye" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Live Preview</h3>
              </div>
              <div className="rounded-lg border bg-white p-5 text-sm">
                <div className="border-b pb-3">
                  <p className="text-lg font-bold text-foreground">{data.fullName || "Your Name"}</p>
                  <p className="text-brand">{data.title || "Professional Title"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</p>
                  <p className="mt-1 text-sm text-foreground">{data.summary || "—"}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Experience</p>
                  <div className="mt-1 space-y-2">
                    {data.experience.map((e) => (
                      <div key={e.id}>
                        <p className="text-sm font-medium text-foreground">{e.role} · <span className="text-muted-foreground">{e.company}</span></p>
                        <p className="text-xs text-muted-foreground">{e.duration}</p>
                        <p className="mt-0.5 text-sm text-foreground">{e.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Education</p>
                  <div className="mt-1 space-y-1">
                    {data.education.map((e) => (
                      <p key={e.id} className="text-sm text-foreground">{e.degree} · <span className="text-muted-foreground">{e.school}, {e.year}</span></p>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {data.skills.map((s) => (
                      <span key={s} className="rounded bg-brand/10 px-1.5 py-0.5 text-xs text-brand">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ----- Sub-components -----
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ScoreRow({ label, icon, score, max }: { label: string; icon: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-medium">
          {score}/{max}
        </span>
      </div>
      <Progress value={pct} className="mt-1 h-1.5" />
    </div>
  );
}
