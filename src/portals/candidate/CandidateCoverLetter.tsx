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

// ----- Types & mock data -----
type TemplateId = "professional" | "modern" | "creative";

interface CoverLetterForm {
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  keySkills: string;
  whyThisCompany: string;
  salaryExpectation: string;
}

interface SavedLetter {
  id: string;
  title: string;
  company: string;
  template: TemplateId;
  updatedAt: string;
}

const TEMPLATES: { id: TemplateId; label: string; description: string; accent: string }[] = [
  { id: "professional", label: "Professional", description: "Classic, ATS-friendly. Best for finance & enterprise roles.", accent: "bg-brand" },
  { id: "modern", label: "Modern", description: "Clean sections with subtle emphasis. Great for SaaS & product roles.", accent: "bg-emerald-500" },
  { id: "creative", label: "Creative", description: "Expressive header and tone. Ideal for design & startup roles.", accent: "bg-amber-500" },
];

const AI_TIPS: { id: string; tip: string; severity: "high" | "medium" | "low" }[] = [
  { id: "a1", tip: "Add specific achievements with metrics (e.g., 'reduced load time by 40%').", severity: "high" },
  { id: "a2", tip: "Mention the company's recent product or value to show genuine research.", severity: "high" },
  { id: "a3", tip: "Keep paragraphs under 3 sentences for recruiter scannability.", severity: "medium" },
  { id: "a4", tip: "Address the hiring manager by name if known; otherwise use 'Dear Hiring Team'.", severity: "medium" },
  { id: "a5", tip: "Mirror keywords from the job description to pass ATS filters.", severity: "high" },
  { id: "a6", tip: "Close with a clear call-to-action (e.g., 'I'd welcome a chance to discuss').", severity: "low" },
];

const SAVED_LETTERS: SavedLetter[] = [
  { id: "s1", title: "Senior Frontend — Razorpay", company: "Razorpay", template: "professional", updatedAt: "2024-09-20" },
  { id: "s2", title: "Staff Engineer — Swiggy", company: "Swiggy", template: "modern", updatedAt: "2024-09-15" },
  { id: "s3", title: "Frontend Lead — Zomato", company: "Zomato", template: "creative", updatedAt: "2024-09-08" },
];

const INITIAL_FORM: CoverLetterForm = {
  jobTitle: "Senior Frontend Engineer",
  companyName: "TechCorp India",
  hiringManager: "Ananya Sharma",
  keySkills: "React, TypeScript, Next.js, design systems, accessibility",
  whyThisCompany:
    "I've admired TechCorp's commitment to building inclusive fintech tools, especially your recent accessibility-first redesign that I read about on your engineering blog.",
  salaryExpectation: "₹28–32 LPA",
};

export function CandidateCoverLetter() {
  const [form, setForm] = React.useState<CoverLetterForm>(INITIAL_FORM);
  const [template, setTemplate] = React.useState<TemplateId>("professional");
  const [saved, setSaved] = React.useState<SavedLetter[]>(SAVED_LETTERS);

  function update<K extends keyof CoverLetterForm>(key: K, value: CoverLetterForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function save() {
    const newLetter: SavedLetter = {
      id: `s_${Date.now()}`,
      title: `${form.jobTitle} — ${form.companyName}`,
      company: form.companyName,
      template,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setSaved((p) => [newLetter, ...p]);
    toast.success("Cover letter saved", { description: newLetter.title });
  }

  function download() {
    toast.success("Downloading cover letter", {
      description: `${form.jobTitle}-${form.companyName}.pdf · ${template} template`,
    });
  }

  function useSuggestion() {
    toast.info("AI suggestion applied", {
      description: "We've highlighted an opportunity in your preview. Refine the wording to make it yours.",
    });
  }

  // Live preview body
  const greeting = form.hiringManager.trim() ? `Dear ${form.hiringManager},` : "Dear Hiring Team,";
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cover Letter Builder"
        description="Craft a tailored cover letter for each application with live preview, templates, and AI tips."
        icon={<Icon name="FilePen" className="h-6 w-6" />}
        actions={[
          { label: "Save", icon: "BadgeCheck", variant: "outline", onClick: save },
          { label: "Download PDF", icon: "Download", onClick: download },
        ]}
      />

      {/* Template selector */}
      <SectionCard
        title="Choose a template"
        description="Each template is ATS-readable. The tone and emphasis shift per style."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-lg border p-3 text-left transition-all hover:border-brand/50 ${
                template === t.id ? "border-brand ring-2 ring-brand/20" : "border-border"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`h-2 w-12 rounded-full ${t.accent}`} />
                {template === t.id && (
                  <Icon name="CheckCircle2" className="h-4 w-4 text-brand" />
                )}
              </div>
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* LEFT — form */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Icon name="Briefcase" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Job details</h3>
              </div>
              <Field label="Job title">
                <Input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
              </Field>
              <Field label="Company name">
                <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </Field>
              <Field label="Hiring manager name (optional)">
                <Input
                  value={form.hiringManager}
                  onChange={(e) => update("hiringManager", e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Icon name="Brain" className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold">Highlights</h3>
              </div>
              <Field label="Key skills to highlight">
                <Textarea
                  rows={2}
                  value={form.keySkills}
                  onChange={(e) => update("keySkills", e.target.value)}
                  placeholder="Comma-separated skills relevant to the role."
                />
              </Field>
              <Field label="Why this company?">
                <Textarea
                  rows={4}
                  value={form.whyThisCompany}
                  onChange={(e) => update("whyThisCompany", e.target.value)}
                  placeholder="Show genuine research — mention a product, value, or recent news."
                />
              </Field>
              <Field label="Salary expectation">
                <Input
                  value={form.salaryExpectation}
                  onChange={(e) => update("salaryExpectation", e.target.value)}
                  placeholder="e.g., ₹28–32 LPA"
                />
              </Field>
            </CardContent>
          </Card>

          {/* AI suggestions */}
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Wand2" className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-semibold">AI suggestions</h3>
                </div>
                <Badge className="bg-brand/10 text-brand">Mock</Badge>
              </div>
              <ul className="space-y-2">
                {AI_TIPS.map((t) => (
                  <li key={t.id} className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        t.severity === "high" ? "bg-rose-500" : t.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">{t.tip}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="outline" className="w-full" onClick={useSuggestion}>
                <Icon name="Sparkles" className="mr-1 h-3.5 w-3.5" /> Apply suggestion
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — live preview */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Icon name="Eye" className="h-4 w-4 text-brand" />
                  <span className="text-sm font-semibold">Live preview</span>
                </div>
                <Badge variant="outline" className="capitalize">{template}</Badge>
              </div>
              <div className="bg-muted/30 p-5 sm:p-6">
                <div
                  className={`mx-auto max-h-[600px] overflow-y-auto rounded-lg bg-card p-6 shadow-sm sm:p-8 ${
                    template === "creative" ? "border-t-4 border-amber-500" : template === "modern" ? "border-l-4 border-emerald-500" : "border-l-4 border-brand"
                  }`}
                >
                  <div className="space-y-4 text-sm leading-relaxed text-foreground">
                    <div className="space-y-0.5">
                      <p className="font-semibold">{form.jobTitle || "Job title"}</p>
                      <p className="text-xs text-muted-foreground">{today}</p>
                    </div>
                    <p>{greeting}</p>
                    <p>
                      I am writing to express my strong interest in the{" "}
                      <span className="font-medium">{form.jobTitle || "Senior Frontend Engineer"}</span> position at{" "}
                      <span className="font-medium">{form.companyName || "your company"}</span>. With 7+ years of experience
                      building accessible, performant web applications, I am confident I can contribute meaningfully to your
                      engineering team.
                    </p>
                    <p>
                      My expertise in{" "}
                      <span className="font-medium text-brand">{form.keySkills || "React, TypeScript, and Next.js"}</span> has
                      enabled me to ship products used by over a million users monthly. In my current role, I led the
                      migration of a legacy monolith to Next.js App Router, reducing bundle size by 38% and improving
                      Lighthouse scores from 62 to 95.
                    </p>
                    <p>{form.whyThisCompany || "I am excited by the work your team is doing and would love to contribute."}</p>
                    <p>
                      Regarding compensation, my expectation is{" "}
                      <span className="font-medium">{form.salaryExpectation || "competitive and negotiable"}</span>, and I am
                      open to discussing the full package including equity and benefits.
                    </p>
                    <p>
                      I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your
                      time and consideration.
                    </p>
                    <p className="pt-2">
                      Sincerely,
                      <br />
                      <span className="font-medium">Priya Nair</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved cover letters */}
          <SectionCard
            title="Saved cover letters"
            description="Reuse and adapt previous letters for new applications"
          >
            <div className="space-y-2">
              {saved.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">No saved letters yet.</p>
              ) : (
                saved.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name="FileText" className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.company} · {s.template} · updated {s.updatedAt}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.info("Loaded", { description: s.title })}
                    >
                      <Icon name="Pencil" className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
