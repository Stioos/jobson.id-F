"use client";

import * as React from "react";
import {
  Building2, MapPin, Globe, Mail, Phone, Star, Quote, Award,
  GraduationCap, ShieldCheck, Pencil, Check, X, Image as ImageIcon,
  Clock, Briefcase, BadgeCheck, Sparkles, Handshake,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, Card, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// ---------- Mock data ----------

interface Trainer {
  id: string;
  name: string;
  expertise: string;
  experience: number; // years
  photo: string;
}

interface CoursePreview {
  id: string;
  title: string;
  duration: string;
  rating: number;
  enrolled: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
}

interface Testimonial {
  id: string;
  student: string;
  course: string;
  rating: number;
  quote: string;
  placedAt?: string;
}

interface Accreditation {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  verified: boolean;
}

const PROVIDER = {
  name: "SkillBridge Academy",
  logo: "SB",
  tagline: "Industry-ready skills, taught by practitioners.",
  about:
    "SkillBridge Academy is a NSDC-approved corporate training provider specialising in upskilling engineers, graduates and lateral hires for high-growth technology roles. Since 2018 we have trained 14,000+ students across Full Stack, Data Engineering, AI/ML, Cloud and DevOps tracks, with a 92% placement rate for our flagship career programs. We work with 60+ enterprise clients including Infosys, TCS, Wipro, Zoho and Razorpay to deliver cohort-based, project-driven learning.",
  location: "Bengaluru, India",
  email: "admissions@skillbridge.io",
  phone: "+91 80 4567 8901",
  website: "skillbridge.io",
  accreditations: [
    { id: "a1", name: "NSDC Approved Training Partner", issuer: "National Skill Development Corp", validUntil: "2026-08-31", verified: true },
    { id: "a2", name: "ISO 9001:2015 Certified", issuer: "Bureau Veritas", validUntil: "2025-12-31", verified: true },
    { id: "a3", name: "AWS Authorized Training Partner", issuer: "Amazon Web Services", validUntil: "2026-03-31", verified: true },
    { id: "a4", name: "Google Cloud Education Partner", issuer: "Google Cloud", validUntil: "2025-09-30", verified: true },
    { id: "a5", name: "AICTE Approved Internship Provider", issuer: "AICTE", validUntil: "2027-04-30", verified: false },
  ] as Accreditation[],
  trainers: [
    { id: "t1", name: "Rajesh Kumar", expertise: "Full Stack & React, MERN", experience: 12, photo: "RK" },
    { id: "t2", name: "Divya Menon", expertise: "AI / ML, Python, TensorFlow", experience: 9, photo: "DM" },
    { id: "t3", name: "Arvind Subramanian", expertise: "Cloud, AWS, Kubernetes, DevOps", experience: 14, photo: "AS" },
  ] as Trainer[],
  courses: [
    { id: "c1", title: "Full Stack Developer Bootcamp", duration: "16 weeks", rating: 4.8, enrolled: 1240, level: "Intermediate", price: "₹85,000" },
    { id: "c2", title: "AI/ML Engineer Career Track", duration: "20 weeks", rating: 4.9, enrolled: 820, level: "Advanced", price: "₹1,20,000" },
    { id: "c3", title: "AWS Cloud Architect", duration: "10 weeks", rating: 4.7, enrolled: 610, level: "Advanced", price: "₹65,000" },
    { id: "c4", title: "DevOps & SRE Specialization", duration: "12 weeks", rating: 4.6, enrolled: 480, level: "Intermediate", price: "₹75,000" },
    { id: "c5", title: "Data Engineering with Python", duration: "14 weeks", rating: 4.7, enrolled: 390, level: "Intermediate", price: "₹80,000" },
  ] as CoursePreview[],
  testimonials: [
    {
      id: "ts1",
      student: "Suresh Patel",
      course: "Full Stack Developer Bootcamp",
      rating: 5,
      quote: "From zero coding to a 18 LPA SDE role at Razorpay in 5 months. The project portfolio and mock interviews were the game-changer.",
      placedAt: "Razorpay · SDE-I",
    },
    {
      id: "ts2",
      student: "Lakshmi Iyer",
      course: "AI/ML Engineer Career Track",
      rating: 5,
      quote: "Rajesh and Divya are world-class trainers. The capstone project on real-world MLOps got me my job at DataMinds AI.",
      placedAt: "DataMinds AI · ML Engineer",
    },
    {
      id: "ts3",
      student: "Karthik Reddy",
      course: "AWS Cloud Architect",
      rating: 4,
      quote: "Cleared the AWS Solutions Architect Pro exam on the first attempt. Course is dense but worth it.",
    },
  ] as Testimonial[],
  facilities: [
    { id: "f1", label: "Bengaluru Campus — 4 classrooms, 120 seats", icon: "Building2" },
    { id: "f2", label: "Dev labs with GPU workstations for ML", icon: "GraduationCap" },
    { id: "f3", label: "Online LMS with recorded sessions + live cohorts", icon: "Globe" },
    { id: "f4", label: "Placement cell with 60+ hiring partners", icon: "Briefcase" },
  ],
  stats: {
    studentsTrained: 14200,
    placementRate: 92, // %
    avgRating: 4.7,
    hiringPartners: 60,
  },
};

const COMPLETENESS = [
  { key: "name", label: "Provider name & logo", done: true },
  { key: "about", label: "About / description", done: true },
  { key: "accreditations", label: "Accreditations", done: true },
  { key: "trainers", label: "Trainer bios", done: true },
  { key: "courses", label: "Course catalog", done: true },
  { key: "testimonials", label: "Student testimonials", done: true },
  { key: "facilities", label: "Infrastructure", done: true },
  { key: "contact", label: "Contact info", done: true },
];

export function TrainingProviderProfile() {
  const [about, setAbout] = React.useState(PROVIDER.about);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draftAbout, setDraftAbout] = React.useState(PROVIDER.about);

  const completeness = Math.round(
    (COMPLETENESS.filter((c) => c.done).length / COMPLETENESS.length) * 100
  );

  function saveAbout() {
    setAbout(draftAbout);
    setEditing(null);
    toast.success("About section updated");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Provider Profile"
        description="This is how students and corporate clients see your training provider profile. Edit any section inline."
        icon={<Building2 className="h-6 w-6" />}
        actions={[
          { label: "Share Profile", variant: "outline", onClick: () => toast.success("Share link copied", { description: "https://jobson.id/t/skillbridge-academy" }) },
        ]}
      />

      {/* Completeness meter + preview banner */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Profile completeness</p>
            <p className="text-xs text-muted-foreground">
              {completeness}% complete — {completeness === 100 ? "publication-ready!" : "add the missing items"}
            </p>
          </div>
          <span className="text-2xl font-bold text-brand">{completeness}%</span>
        </div>
        <Progress value={completeness} className="mt-3 h-2" />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COMPLETENESS.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5 text-xs">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Success stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Students trained" value={PROVIDER.stats.studentsTrained.toLocaleString("en-IN")} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placement rate" value={`${PROVIDER.stats.placementRate}%`} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg rating" value={`${PROVIDER.stats.avgRating}/5`} icon={<Star className="h-5 w-5" />} tone="warning" />
        <StatCard label="Hiring partners" value={PROVIDER.stats.hiringPartners} icon={<Handshake className="h-5 w-5" />} tone="default" />
      </div>

      {/* Provider header */}
      <SectionCard
        title="Provider Identity"
        description="Name, logo and contact details shown publicly."
        action={
          editing !== "identity" ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing("identity")}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : null
        }
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand border border-brand/30 text-2xl font-bold">
            {PROVIDER.logo}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-xl font-semibold">{PROVIDER.name}</h2>
              <p className="text-sm italic text-brand">{PROVIDER.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {PROVIDER.location}</span>
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {PROVIDER.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {PROVIDER.phone}</span>
              <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {PROVIDER.website}</span>
            </div>
            {editing === "identity" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => { setEditing(null); toast.success("Identity saved"); }}>
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            )}
          </div>
          <Button size="sm" onClick={() => toast.success("Enquiry sent", { description: "Admissions will reach out within 24 hours" })}>
            <Mail className="h-4 w-4 mr-1" /> Enquire
          </Button>
        </div>
      </SectionCard>

      {/* About */}
      <SectionCard
        title="About"
        description="Public-facing summary of your academy."
        action={
          editing !== "about" ? (
            <Button variant="ghost" size="sm" onClick={() => { setDraftAbout(about); setEditing("about"); }}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={saveAbout}><Check className="h-4 w-4 mr-1" /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          )
        }
      >
        {editing === "about" ? (
          <Textarea rows={6} value={draftAbout} onChange={(e) => setDraftAbout(e.target.value)} />
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">{about}</p>
        )}
      </SectionCard>

      {/* Accreditations */}
      <SectionCard
        title="Accreditations & Affiliations"
        description="Industry and government accreditations your provider holds."
        action={<Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{PROVIDER.accreditations.filter(a => a.verified).length} verified</Badge>}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {PROVIDER.accreditations.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-brand" />
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.issuer} · valid until {a.validUntil}</p>
                </div>
              </div>
              {a.verified ? (
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

      {/* Trainer bios */}
      <SectionCard
        title="Trainer Bios"
        description="Your expert instructors and their domains."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {PROVIDER.trainers.map((t) => (
            <Card key={t.id} className="p-4 text-center">
              <AvatarLogo text={t.photo} size="xl" className="mx-auto" />
              <p className="mt-3 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-brand">{t.expertise}</p>
              <p className="mt-1 text-xs text-muted-foreground inline-flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" /> {t.experience} years experience
              </p>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Course catalog preview */}
      <SectionCard
        title="Course Catalog Preview"
        description="Top 5 flagship courses shown on your public profile."
        action={<Button size="sm" variant="outline" onClick={() => toast.success("Course catalog opened", { description: "Manage all 24 courses" })}>View All Courses</Button>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Course</th>
                <th className="py-2 pr-4 font-medium">Level</th>
                <th className="py-2 pr-4 font-medium">Duration</th>
                <th className="py-2 pr-4 font-medium">Rating</th>
                <th className="py-2 pr-4 font-medium">Enrolled</th>
                <th className="py-2 pr-4 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {PROVIDER.courses.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{c.title}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className="border-brand/20 text-brand">{c.level}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.duration}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {c.rating}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.enrolled.toLocaleString("en-IN")}</td>
                  <td className="py-3 pr-4 text-right font-semibold">{c.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Student testimonials */}
      <SectionCard
        title="Student Testimonials"
        description="Verified reviews from students you've trained."
        action={<Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">{PROVIDER.testimonials.length} verified</Badge>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PROVIDER.testimonials.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={t.student} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">{t.student}</p>
                    <p className="text-xs text-muted-foreground">{t.course}</p>
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
              {t.placedAt && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                  <BadgeCheck className="h-3 w-3" /> Placed at {t.placedAt}
                </div>
              )}
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Infrastructure / facilities */}
      <SectionCard
        title="Infrastructure & Facilities"
        description="Physical and digital infrastructure available to students."
        action={<Button size="sm" variant="outline" onClick={() => toast.success("Upload dialog opened", { description: "Add facility photos" })}><ImageIcon className="h-4 w-4 mr-1" /> Add Photos</Button>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {PROVIDER.facilities.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-sm">{f.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">Photo placeholders · upload real facility images to enhance your profile</p>
      </SectionCard>

      {/* CTA footer */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-brand" />
            <div>
              <p className="text-sm font-semibold">Ready to upskill?</p>
              <p className="text-xs text-muted-foreground">Talk to our admissions team — next cohort starts in 3 weeks.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast.success("Application started", { description: "Redirecting to enrolment form" })}>
              Enroll Now
            </Button>
            <Button variant="outline" onClick={() => toast.success("Brochure downloaded", { description: "skillbridge-brochure.pdf" })}>
              Download Brochure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
