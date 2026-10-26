"use client";

import * as React from "react";
import {
  UserCircle, MapPin, Mail, Phone, Linkedin, Sparkles, Pencil, Check, X,
  Star, Quote, Award, Briefcase, Clock, TrendingUp, Eye, ShieldCheck, Globe,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, EmptyState, Card,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// ---------- Mock data ----------

interface Testimonial {
  id: string;
  client: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
  date: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

const RECRUITER = {
  name: "Ananya Krishnan",
  title: "Senior Talent Acquisition Specialist",
  agency: "TalentForge Staffing",
  location: "Bengaluru, India",
  email: "ananya.k@talentforge.io",
  phone: "+91 98765 43210",
  linkedin: "linkedin.com/in/ananya-krishnan",
  website: "talentforge.io/ananya",
  photo: "AK",
  bio:
    "Senior technical recruiter with 9+ years of experience sourcing and placing high-impact engineering talent across SaaS, fintech, and AI startups. Specialised in retained search for senior IC and leadership roles. Trusted partner to 40+ venture-backed companies.",
  specializations: ["Engineering Leadership", "Frontend & Full Stack", "AI / ML", "DevOps & SRE", "Product Management"],
  industries: ["SaaS", "Fintech", "AI / ML", "Healthcare Tech", "Climate Tech"],
  languages: ["English", "Hindi", "Tamil", "Kannada"],
  stats: {
    placements: 312,
    candidatesPlaced: 287,
    avgTimeToHire: 21, // days
    satisfactionScore: 4.8,
  },
  testimonials: [
    {
      id: "t1",
      client: "Rahul Verma",
      role: "VP Engineering",
      company: "DataMinds AI",
      rating: 5,
      quote:
        "Ananya filled three senior ML engineering roles in under six weeks. Quality of candidates was exceptional — every single one was a strong hire.",
      date: "2024-09-12",
    },
    {
      id: "t2",
      client: "Meera Joshi",
      role: "CTO",
      company: "FinEdge Solutions",
      rating: 5,
      quote:
        "By far the most responsive recruiter we've worked with. Understands technical requirements deeply and never wastes our time with poor fits.",
      date: "2024-08-03",
    },
    {
      id: "t3",
      client: "Sundar Iyer",
      role: "Head of People",
      company: "StartupX",
      rating: 4,
      quote:
        "Great partner for senior engineering hires. Helped us close a critical VP role that had been open for months.",
      date: "2024-06-18",
    },
  ] as Testimonial[],
  certifications: [
    { id: "c1", name: "Certified Staffing Professional (CSP)", issuer: "ASA, USA", year: "2022", verified: true },
    { id: "c2", name: "LinkedIn Recruiter Certified", issuer: "LinkedIn", year: "2023", verified: true },
    { id: "c3", name: "SHRM-SCP", issuer: "SHRM", year: "2021", verified: true },
    { id: "c4", name: "AIRS Certified Diversity Recruiter", issuer: "ADP", year: "2023", verified: false },
  ] as Certification[],
};

// Profile completeness checklist (each item worth 12.5% => 100%)
const CHECKLIST: { key: string; label: string }[] = [
  { key: "photo", label: "Profile photo" },
  { key: "bio", label: "Bio & summary" },
  { key: "specializations", label: "Specializations" },
  { key: "industries", label: "Industries" },
  { key: "testimonials", label: "Client testimonials" },
  { key: "certifications", label: "Certifications" },
  { key: "languages", label: "Languages" },
  { key: "contact", label: "Contact details" },
];

export function RecruiterPublicProfile() {
  const [previewMode, setPreviewMode] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState({
    bio: RECRUITER.bio,
    title: RECRUITER.title,
    location: RECRUITER.location,
    email: RECRUITER.email,
    phone: RECRUITER.phone,
    linkedin: RECRUITER.linkedin,
  });
  const [tags, setTags] = React.useState({
    specializations: RECRUITER.specializations,
    industries: RECRUITER.industries,
  });
  const [newSpec, setNewSpec] = React.useState("");
  const [newInd, setNewInd] = React.useState("");

  // Profile completeness — all items present in mock data, so 100%
  const completeness = Math.min(
    100,
    Math.round(
      ((RECRUITER.bio ? 1 : 0) +
        (RECRUITER.specializations.length ? 1 : 0) +
        (RECRUITER.industries.length ? 1 : 0) +
        (RECRUITER.testimonials.length ? 1 : 0) +
        (RECRUITER.certifications.length ? 1 : 0) +
        (RECRUITER.languages.length ? 1 : 0) +
        (RECRUITER.email && RECRUITER.phone ? 1 : 0) +
        1) *
        12.5
    )
  );

  function save(field: string) {
    setEditing(null);
    toast.success("Section updated", { description: `${field} saved to your public profile` });
  }

  function addTag(kind: "specializations" | "industries", value: string) {
    if (!value.trim()) return;
    setTags((p) => ({ ...p, [kind]: [...p[kind], value.trim()] }));
    setNewSpec("");
    setNewInd("");
    toast.success(`Added to ${kind}`, { description: value });
  }

  function removeTag(kind: "specializations" | "industries", idx: number) {
    setTags((p) => ({ ...p, [kind]: p[kind].filter((_, i) => i !== idx) }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Recruiter Profile"
        description="This is how candidates and clients see your recruiter profile. Toggle preview mode to see the candidate view, and edit any section inline."
        icon={<UserCircle className="h-6 w-6" />}
        actions={[
          {
            label: "Share Profile",
            variant: "outline",
            onClick: () => toast.success("Share link copied", { description: "https://jobsonn.io/r/ananya-krishnan" }),
          },
        ]}
      />

      {/* Preview toggle + completeness meter */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Profile completeness</p>
              <p className="text-xs text-muted-foreground">
                {completeness}% complete — {completeness === 100 ? "all set!" : "add missing items to rank higher"}
              </p>
            </div>
            <span className="text-2xl font-bold text-brand">{completeness}%</span>
          </div>
          <Progress value={completeness} className="mt-3 h-2" />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CHECKLIST.map((c) => (
              <div key={c.key} className="flex items-center gap-1.5 text-xs">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold">Preview as Candidate</p>
            <p className="text-xs text-muted-foreground mt-1">
              See how your profile appears to candidates browsing recruiters on Jobsonn.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border bg-brand/5 p-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium">{previewMode ? "Candidate view" : "Owner view"}</span>
            </div>
            <Switch checked={previewMode} onCheckedChange={setPreviewMode} />
          </div>
        </Card>
      </div>

      {/* Success stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Placements made" value={RECRUITER.stats.placements} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates placed" value={RECRUITER.stats.candidatesPlaced} icon={<UserCircle className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg time-to-hire" value={`${RECRUITER.stats.avgTimeToHire}d`} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Client satisfaction" value={`${RECRUITER.stats.satisfactionScore}/5`} icon={<Star className="h-5 w-5" />} tone="success" />
      </div>

      {/* Profile header card */}
      <SectionCard
        title="Profile Header"
        description="Your name, photo, title and contact information as seen publicly."
        action={
          !previewMode && editing !== "header" ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing("header")}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : null
        }
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <AvatarLogo text={RECRUITER.photo} size="xl" className="text-xl" />
          <div className="flex-1 space-y-3">
            {editing === "header" && !previewMode ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Location</Label>
                    <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">LinkedIn</Label>
                    <Input value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save("Profile header")}><Check className="h-4 w-4 mr-1" /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold">{RECRUITER.name}</h2>
                  <p className="text-sm text-brand font-medium">{draft.title}</p>
                  <p className="text-xs text-muted-foreground">{RECRUITER.agency}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {draft.location}</span>
                  <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {draft.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {draft.phone}</span>
                  <span className="inline-flex items-center gap-1"><Linkedin className="h-3.5 w-3.5" /> {draft.linkedin}</span>
                  <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {RECRUITER.website}</span>
                </div>
              </>
            )}
          </div>
          {previewMode && (
            <Button size="sm" onClick={() => toast.success("Contact request sent", { description: "Ananya will respond within 24 hours" })}>
              <Mail className="h-4 w-4 mr-1" /> Contact
            </Button>
          )}
        </div>
      </SectionCard>

      {/* Bio */}
      <SectionCard
        title="About"
        description="Brief summary of your experience and recruiting focus."
        action={
          !previewMode && editing !== "bio" ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing("bio")}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : null
        }
      >
        {editing === "bio" && !previewMode ? (
          <div className="space-y-3">
            <Textarea rows={5} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save("Bio")}><Check className="h-4 w-4 mr-1" /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">{draft.bio}</p>
        )}
      </SectionCard>

      {/* Specializations + Industries */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Specializations"
          description="Roles you recruit for."
          action={
            !previewMode && editing !== "specializations" ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing("specializations")}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            ) : null
          }
        >
          {editing === "specializations" && !previewMode ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.specializations.map((t, i) => (
                  <Badge key={i} variant="secondary" className="bg-brand/10 text-brand border-brand/20">
                    {t}
                    <button onClick={() => removeTag("specializations", i)} className="ml-1 hover:text-rose-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add specialization…" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} />
                <Button size="sm" variant="outline" onClick={() => addTag("specializations", newSpec)}>Add</Button>
              </div>
              <Button size="sm" onClick={() => save("Specializations")}>Done</Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.specializations.map((t, i) => (
                <Badge key={i} variant="secondary" className="bg-brand/10 text-brand border-brand/20">{t}</Badge>
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard
          title="Industries"
          description="Sectors you serve."
          action={
            !previewMode && editing !== "industries" ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing("industries")}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            ) : null
          }
        >
          {editing === "industries" && !previewMode ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.industries.map((t, i) => (
                  <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {t}
                    <button onClick={() => removeTag("industries", i)} className="ml-1 hover:text-rose-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add industry…" value={newInd} onChange={(e) => setNewInd(e.target.value)} />
                <Button size="sm" variant="outline" onClick={() => addTag("industries", newInd)}>Add</Button>
              </div>
              <Button size="sm" onClick={() => save("Industries")}>Done</Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.industries.map((t, i) => (
                <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{t}</Badge>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Testimonials */}
      <SectionCard
        title="Client Testimonials"
        description="Verified reviews from clients you've worked with."
        action={<Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">{RECRUITER.testimonials.length} verified</Badge>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {RECRUITER.testimonials.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={t.client} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">{t.client}</p>
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
                <Quote className="h-4 w-4 text-brand/60" />
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < t.rating ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-muted-foreground/30"} />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">"{t.quote}"</p>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Certifications */}
      <SectionCard
        title="Certifications"
        description="Professional certifications and badges you hold."
        action={<Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{RECRUITER.certifications.filter(c => c.verified).length} verified</Badge>}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {RECRUITER.certifications.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer} · {c.year}</p>
                </div>
              </div>
              {c.verified ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Contact CTA */}
      {!previewMode ? (
        <SectionCard
          title="Contact CTA"
          description="Public contact card shown to candidates and clients."
        >
          <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20">
                <Sparkles className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="font-semibold">Looking to hire top engineering talent?</p>
                <p className="text-sm text-muted-foreground">Avg response time: under 4 hours · 312 placements closed</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => toast.success("Email drafted", { description: "Opened in your mail client" })}>
                <Mail className="h-4 w-4 mr-1" /> Email Ananya
              </Button>
              <Button variant="outline" onClick={() => toast.success("Schedule request sent", { description: "Calendar invite on the way" })}>
                Book a call
              </Button>
            </div>
          </div>
        </SectionCard>
      ) : (
        <SectionCard
          title="Get in touch"
          description="Reach out to discuss your hiring needs."
        >
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title="Interested in working with Ananya?"
            description="Send a contact request to start a conversation about your hiring needs."
            action={
              <Button onClick={() => toast.success("Contact request sent", { description: "Ananya will respond within 24 hours" })}>
                <Mail className="h-4 w-4 mr-1" /> Send Contact Request
              </Button>
            }
          />
        </SectionCard>
      )}

      {/* Languages strip */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Languages
          </span>
          {RECRUITER.languages.map((l) => (
            <Badge key={l} variant="outline" className="border-brand/20 text-brand">{l}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
