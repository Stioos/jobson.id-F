"use client";

import * as React from "react";
import {
  Palette, Upload, Plus, X, Pencil, Check, Image as ImageIcon, Building2,
  Star, TrendingUp, Award, ShieldCheck, Sparkles, Trash2,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, EmptyState, Card, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ---------- Mock data ----------

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  result: string;
  thumbnail: string;
}

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

const AGENCY = {
  name: "TalentForge Staffing",
  tagline: "Engineering talent, forged for scale.",
  description:
    "TalentForge is a retained search firm specialising in senior engineering and product hires for high-growth SaaS, fintech and AI companies. Since 2016 we've placed 1,200+ candidates across 40+ venture-backed startups in India, Singapore and the UAE.",
  logo: "TF",
  colors: {
    primary: "#10b981", // emerald-500
    secondary: "#059669", // emerald-600
    accent: "#f59e0b", // amber-500
  },
  specialties: [
    "Engineering Leadership", "Senior IC Engineering", "Product Management",
    "AI / ML Talent", "DevOps & SRE", "Sales Engineering", "Diversity Hiring",
  ],
  team: [
    { id: "tm1", name: "Ananya Krishnan", role: "Founder & Principal Recruiter", photo: "AK", linkedin: "linkedin.com/in/ananya-krishnan" },
    { id: "tm2", name: "Rahul Sharma", role: "Director, Engineering Search", photo: "RS" },
    { id: "tm3", name: "Priya Nair", role: "Senior Recruiter — Product", photo: "PN" },
    { id: "tm4", name: "Vikram Iyer", role: "Recruiter — DevOps & SRE", photo: "VI" },
    { id: "tm5", name: "Sneha Reddy", role: "Head of Client Success", photo: "SR" },
  ] as TeamMember[],
  clientLogos: ["DataMinds AI", "FinEdge", "StartupX", "TechCorp India", "SecureBank", "Zoho", "Freshworks", "Razorpay"],
  caseStudies: [
    { id: "cs1", title: "VP Engineering hire in 5 weeks", client: "DataMinds AI", result: "Closed a 90-day-old critical VP Eng role in 35 days. Candidate onboarded and 6-month retention confirmed.", thumbnail: "DM" },
    { id: "cs2", title: "Built 12-person ML team in 4 months", client: "FinEdge Solutions", result: "Scaled an ML team from 0 to 12 across 3 seniority bands. Time-to-productivity cut by 40%.", thumbnail: "FE" },
    { id: "cs3", title: "Diversity-first engineering cohort", client: "StartupX", result: "61% women candidates shortlisted for senior eng roles. 4 hires made, 100% retention at 12 months.", thumbnail: "SX" },
  ] as CaseStudy[],
};

// Brand score checklist (8 items × 12.5 = 100)
const SCORE_ITEMS: { key: string; label: string; done: boolean }[] = [
  { key: "logo", label: "Logo uploaded", done: true },
  { key: "colors", label: "Brand colors set", done: true },
  { key: "description", label: "Agency description", done: true },
  { key: "specialties", label: "Specialties tagged", done: true },
  { key: "team", label: "Team showcase (3+ members)", done: true },
  { key: "logos", label: "Client logos (5+)", done: true },
  { key: "caseStudies", label: "Case studies (3+)", done: true },
  { key: "tagline", label: "Tagline set", done: true },
];

export function RecruiterAgencyBranding() {
  const [colors, setColors] = React.useState<BrandColors>(AGENCY.colors);
  const [description, setDescription] = React.useState(AGENCY.description);
  const [tagline, setTagline] = React.useState(AGENCY.tagline);
  const [specialties, setSpecialties] = React.useState<string[]>(AGENCY.specialties);
  const [newSpec, setNewSpec] = React.useState("");
  const [team, setTeam] = React.useState<TeamMember[]>(AGENCY.team);
  const [caseStudies, setCaseStudies] = React.useState<CaseStudy[]>(AGENCY.caseStudies);
  const [editingDesc, setEditingDesc] = React.useState(false);
  const [editingTagline, setEditingTagline] = React.useState(false);
  const [addTeamOpen, setAddTeamOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState({ name: "", role: "" });
  const [addCaseOpen, setAddCaseOpen] = React.useState(false);
  const [newCase, setNewCase] = React.useState<{ title: string; client: string; result: string }>({ title: "", client: "", result: "" });

  const score = Math.round((SCORE_ITEMS.filter((i) => i.done).length / SCORE_ITEMS.length) * 100);
  const scoreTone = score >= 90 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";

  function addSpecialty() {
    const v = newSpec.trim();
    if (!v) return;
    if (specialties.includes(v)) {
      toast.error("Already added", { description: v });
      return;
    }
    setSpecialties([...specialties, v]);
    setNewSpec("");
    toast.success("Specialty added", { description: v });
  }
  function removeSpecialty(s: string) {
    setSpecialties(specialties.filter((x) => x !== s));
  }

  function addMember() {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      toast.error("Both name and role are required");
      return;
    }
    const initials = newMember.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    const m: TeamMember = { id: `tm${Date.now()}`, name: newMember.name, role: newMember.role, photo: initials };
    setTeam([...team, m]);
    setNewMember({ name: "", role: "" });
    setAddTeamOpen(false);
    toast.success("Team member added", { description: `${m.name} · ${m.role}` });
  }
  function removeMember(id: string) {
    setTeam(team.filter((m) => m.id !== id));
    toast.success("Team member removed");
  }

  function addCase() {
    if (!newCase.title.trim() || !newCase.client.trim() || !newCase.result.trim()) {
      toast.error("All case study fields are required");
      return;
    }
    const thumb = newCase.client.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    const cs: CaseStudy = { id: `cs${Date.now()}`, ...newCase, thumbnail: thumb };
    setCaseStudies([...caseStudies, cs]);
    setNewCase({ title: "", client: "", result: "" });
    setAddCaseOpen(false);
    toast.success("Case study added", { description: cs.title });
  }
  function removeCase(id: string) {
    setCaseStudies(caseStudies.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency Branding Center"
        description="Manage your agency's public brand — logo, colors, descriptions, specialties, team showcase, client logos and case studies."
        icon={<Palette className="h-6 w-6" />}
        actions={[
          { label: "Preview Public Page", variant: "outline", onClick: () => toast.success("Opening preview", { description: "https://jobson.id/agency/talentforge" }) },
          { label: "Publish Changes", onClick: () => toast.success("Brand changes published", { description: "Live on your public agency page" }) },
        ]}
      />

      {/* Stats + brand score */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Team members" value={team.length} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Case studies" value={caseStudies.length} icon={<Star className="h-5 w-5" />} tone="success" />
        <StatCard label="Specialties" value={specialties.length} icon={<Award className="h-5 w-5" />} tone="warning" />
        <StatCard label="Client logos" value={AGENCY.clientLogos.length} icon={<ShieldCheck className="h-5 w-5" />} tone="default" />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Brand score</p>
            <p className="text-xs text-muted-foreground">
              {score >= 90 ? "Excellent — your brand is publication-ready" : score >= 60 ? "Good — add the missing items to publish" : "Needs work — see checklist below"}
            </p>
          </div>
          <span className={`text-2xl font-bold ${scoreTone}`}>{score}%</span>
        </div>
        <Progress value={score} className="mt-3 h-2" />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SCORE_ITEMS.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5 text-xs">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Logo + brand colors */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Logo" description="Upload your agency logo. SVG or PNG, max 2MB.">
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-xl text-2xl font-bold"
              style={{ background: `${colors.primary}20`, color: colors.primary, border: `1px solid ${colors.primary}40` }}
            >
              {AGENCY.logo}
            </div>
            <div>
              <p className="text-sm font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">Recommended 512×512px · PNG/SVG · max 2MB</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Logo upload started", { description: "Processing image…" })}>
              <Upload className="h-4 w-4 mr-1" /> Upload Logo
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Brand Colors" description="Primary, secondary and accent colors for your public pages and email templates.">
          <div className="space-y-3">
            {([
              { key: "primary", label: "Primary" },
              { key: "secondary", label: "Secondary" },
              { key: "accent", label: "Accent" },
            ] as const).map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg border"
                  style={{ background: colors[c.key], borderColor: `${colors[c.key]}40` }}
                />
                <div className="flex-1">
                  <Label className="text-xs">{c.label} color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors[c.key]}
                      onChange={(e) => setColors({ ...colors, [c.key]: e.target.value })}
                      className="h-9 w-14 p-1"
                    />
                    <Input
                      value={colors[c.key]}
                      onChange={(e) => setColors({ ...colors, [c.key]: e.target.value })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Colors auto-apply to your public agency page, job postings and email templates.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Agency description + tagline */}
      <SectionCard
        title="Agency Description"
        description="Public-facing summary of your agency. Markdown supported."
        action={
          !editingDesc ? (
            <Button variant="ghost" size="sm" onClick={() => setEditingDesc(true)}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { setEditingDesc(false); toast.success("Description saved"); }}><Check className="h-4 w-4 mr-1" /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingDesc(false); setDescription(AGENCY.description); }}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          )
        }
      >
        {editingDesc ? (
          <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">{description}</p>
        )}
        <div className="mt-4 pt-4 border-t">
          {editingTagline ? (
            <div className="flex gap-2">
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Agency tagline…" />
              <Button size="sm" onClick={() => { setEditingTagline(false); toast.success("Tagline saved"); }}><Check className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingTagline(false); setTagline(AGENCY.tagline); }}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm italic text-brand">"{tagline}"</p>
              <Button variant="ghost" size="sm" onClick={() => setEditingTagline(true)}><Pencil className="h-4 w-4 mr-1" /> Tagline</Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Specialties */}
      <SectionCard
        title="Specialties"
        description="Tag the recruitment specialties your agency focuses on."
      >
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => (
            <Badge key={s} variant="secondary" className="bg-brand/10 text-brand border-brand/20 pr-1.5">
              {s}
              <button onClick={() => removeSpecialty(s)} className="ml-1 hover:text-rose-500"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input placeholder="Add specialty (e.g. Executive Search)…" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(); } }} />
          <Button size="sm" variant="outline" onClick={addSpecialty}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </SectionCard>

      {/* Team showcase */}
      <SectionCard
        title="Team Showcase"
        description="Highlight your agency's recruiters and leadership."
        action={
          <Button size="sm" variant="outline" onClick={() => setAddTeamOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <Card key={m.id} className="p-4 group relative">
              <button
                onClick={() => removeMember(m.id)}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500"
                aria-label="Remove member"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <AvatarLogo text={m.photo} size="lg" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-brand truncate">{m.role}</p>
                  {m.linkedin && <p className="text-xs text-muted-foreground truncate">{m.linkedin}</p>}
                </div>
              </div>
            </Card>
          ))}
          {team.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon={<Building2 className="h-5 w-5" />} title="No team members yet" description="Add your team to showcase on your public agency page." />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Client logos */}
      <SectionCard
        title="Client Logos Showcase"
        description="Companies your agency has placed candidates at."
        action={
          <Button size="sm" variant="outline" onClick={() => toast.success("Upload dialog opened", { description: "Select logo files to upload" })}>
            <Upload className="h-4 w-4 mr-1" /> Upload Logos
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AGENCY.clientLogos.map((c) => (
            <div key={c} className="flex items-center justify-center rounded-lg border bg-muted/30 p-4 h-20">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <ImageIcon className="h-4 w-4" /> {c}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Case studies */}
      <SectionCard
        title="Case Studies"
        description="Showcase your most impactful placements and search projects."
        action={
          <Button size="sm" variant="outline" onClick={() => setAddCaseOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Case Study
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {caseStudies.map((cs) => (
            <Card key={cs.id} className="overflow-hidden group">
              <div
                className="flex h-24 items-center justify-center text-2xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                {cs.thumbnail}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug">{cs.title}</p>
                    <p className="text-xs text-brand mt-1">{cs.client}</p>
                  </div>
                  <button
                    onClick={() => removeCase(cs.id)}
                    className="shrink-0 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove case study"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cs.result}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> Success story
                </div>
              </CardContent>
            </Card>
          ))}
          {caseStudies.length === 0 && (
            <div className="md:col-span-3">
              <EmptyState icon={<Star className="h-5 w-5" />} title="No case studies yet" description="Document your wins to build credibility." />
            </div>
          )}
        </div>
      </SectionCard>

      {/* CTA footer */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-brand" />
            <div>
              <p className="text-sm font-semibold">Boost your agency brand score</p>
              <p className="text-xs text-muted-foreground">A higher brand score improves your visibility in agency search results.</p>
            </div>
          </div>
          <Button onClick={() => toast.success("Brand checklist opened", { description: "See all 8 brand score items" })}>
            View Brand Checklist
          </Button>
        </div>
      </Card>

      {/* Add team member dialog */}
      <Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
            <DialogDescription>Add a recruiter or leader to your agency's public team showcase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Full name</Label>
              <Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="e.g. Aditya Sharma" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="e.g. Senior Recruiter — Frontend" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={addMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add case study dialog */}
      <Dialog open={addCaseOpen} onOpenChange={setAddCaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add case study</DialogTitle>
            <DialogDescription>Document a successful search or placement win.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Title</Label>
              <Input value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} placeholder="e.g. Built 8-person SRE team in 6 weeks" />
            </div>
            <div>
              <Label>Client</Label>
              <Input value={newCase.client} onChange={(e) => setNewCase({ ...newCase, client: e.target.value })} placeholder="e.g. SecureBank" />
            </div>
            <div>
              <Label>Result</Label>
              <Textarea rows={3} value={newCase.result} onChange={(e) => setNewCase({ ...newCase, result: e.target.value })} placeholder="Describe the outcome, timeline and impact." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={addCase}>Add Case Study</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
