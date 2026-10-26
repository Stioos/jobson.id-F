"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import {
  PageHeader, StatCard, SectionCard, EmptyState,
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import {
  Building2, MapPin, Mail, Phone, Users, Award, Gauge,
  CheckCircle2, Lightbulb, ShieldCheck, GraduationCap,
  Wrench, Star, TrendingUp, Server, Wifi,
} from "lucide-react";

type PartnerType = "Recruitment" | "Physical Centre" | "University" | "Training";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface Accreditation {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  status: "active" | "expiring" | "expired";
}

interface PerformanceMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "default" | "brand" | "success" | "warning";
  delta?: { value: string; positive: boolean };
}

const PARTNER_TYPE: PartnerType = "Physical Centre";

const BUSINESS_OVERVIEW =
  "Chennai Tech Academy is a premier technology training franchise operating across Tamil Nadu since 2018. We deliver immersive, industry-aligned programs in Full-Stack Engineering, Data Science, Cloud & DevOps, and Cybersecurity, combining NSDC-approved curriculum with hands-on labs, soft-skills coaching, and dedicated placement support. Our 12,000 sq.ft. flagship centre in Chennai East hosts 6 smart classrooms, a 40-seat lab, and a placement cell.";

const SERVICES_OFFERED = [
  "Full-Stack Engineering",
  "Data Science & Analytics",
  "Cloud & DevOps",
  "Cybersecurity Essentials",
  "UI/UX Design",
  "Digital Marketing",
  "Soft Skills & Interview Prep",
  "Placement Drives",
];

const GEO_COVERAGE = {
  cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  states: ["Tamil Nadu", "Puducherry (UT)"],
};

const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm_1", name: "Rajesh Kumar", role: "Centre Director", email: "rajesh@chennaittechacademy.in", phone: "+91 98400 12345" },
  { id: "tm_2", name: "Priya Venkatesan", role: "Head of Academics", email: "priya@chennaittechacademy.in", phone: "+91 98400 22345" },
  { id: "tm_3", name: "Senthil Kumar", role: "Placement Lead", email: "senthil@chennaittechacademy.in", phone: "+91 98400 32345" },
  { id: "tm_4", name: "Lakshmi Subramanian", role: "Admissions Counsellor", email: "lakshmi.s@chennaittechacademy.in", phone: "+91 98400 42345" },
];

const INFRASTRUCTURE = [
  { label: "Total Capacity", value: "240 students / batch" },
  { label: "Smart Classrooms", value: "6 (35-seater each)" },
  { label: "Computer Lab", value: "40 workstations · 1 Gbps LAN" },
  { label: "Library & Resource Centre", value: "1,200+ titles · digital access" },
  { label: "Placement Cell", value: "Dedicated interview rooms (3)" },
  { label: "Co-working & Project Zone", value: "1 open zone · 30 seats" },
  { label: "Cafeteria & Common Area", value: "60-seater cafeteria" },
  { label: "Power Backup", value: "100% UPS · 62.5 kVA generator" },
];

const FACILITY_TAGS = ["CCTV Surveillance", "AC Classrooms", "Wi-Fi 6", "Biometric Attendance", "Accessibility Ramp", "Fire Safety"];

const ACCREDITATIONS: Accreditation[] = [
  { id: "acc_1", name: "NSDC Approved Training Partner", issuer: "National Skill Development Corporation", validUntil: "2026-08-14", status: "active" },
  { id: "acc_2", name: "ISO 29993:2017 Learning Services", issuer: "Bureau Veritas Certification", validUntil: "2025-11-30", status: "expiring" },
  { id: "acc_3", name: "AICTE Approved Institution", issuer: "All India Council for Technical Education", validUntil: "2027-03-21", status: "active" },
  { id: "acc_4", name: "AWS Academy Member", issuer: "Amazon Web Services", validUntil: "2026-02-18", status: "active" },
  { id: "acc_5", name: "Google for Education Partner", issuer: "Google LLC", validUntil: "2024-09-30", status: "expired" },
];

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  { label: "Students Enrolled (YTD)", value: "1,240", icon: <Users className="h-5 w-5" />, tone: "brand", delta: { value: "12% YoY", positive: true } },
  { label: "Students Placed", value: "968", icon: <GraduationCap className="h-5 w-5" />, tone: "success", delta: { value: "8% YoY", positive: true } },
  { label: "Revenue Generated (YTD)", value: formatCurrency(3840000), icon: <TrendingUp className="h-5 w-5" />, tone: "brand", delta: { value: "18% YoY", positive: true } },
  { label: "Student Satisfaction", value: "4.7 / 5.0", icon: <Star className="h-5 w-5" />, tone: "warning", delta: { value: "0.2 pts", positive: true } },
];

// Profile completeness rubric — each item contributes equally
const COMPLETENESS_CHECKLIST = [
  { key: "basics", label: "Basic information", done: true },
  { key: "type", label: "Partner type specified", done: true },
  { key: "overview", label: "Business overview written", done: true },
  { key: "services", label: "Services offered listed", done: true },
  { key: "geo", label: "Geographic coverage mapped", done: true },
  { key: "team", label: "Team members added", done: true },
  { key: "infra", label: "Infrastructure details captured", done: true },
  { key: "accred", label: "Accreditations & certifications", done: true },
  { key: "metrics", label: "Performance metrics published", done: true },
  { key: "media", label: "Photos & marketing media", done: false },
  { key: "social", label: "Social & web links", done: false },
  { key: "bank", label: "Bank & GST details verified", done: true },
];

function completenessPct(): number {
  const done = COMPLETENESS_CHECKLIST.filter((c) => c.done).length;
  return Math.round((done / COMPLETENESS_CHECKLIST.length) * 100);
}

function completenessTips(): string[] {
  return COMPLETENESS_CHECKLIST.filter((c) => !c.done).map((c) => c.label);
}

function accStatusLabel(status: Accreditation["status"]): string {
  if (status === "active") return "Active";
  if (status === "expiring") return "Expiring Soon";
  return "Expired";
}

function accBadgeClass(status: Accreditation["status"]): string {
  if (status === "active") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  if (status === "expiring") return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
}

export function PartnerProfileEnhanced() {
  const partner = CURRENT_PARTNER;
  const completeness = completenessPct();
  const tips = completenessTips();

  function handleSave() {
    toast.success("Profile updated", { description: "Your enhanced partner profile changes have been saved." });
  }
  function handleShare() {
    toast.info("Public profile link copied", { description: `jobsonn.com/partners/${partner.id}` });
  }
  function handleAddTeam() {
    toast.info("Add team member", { description: "Opening form to invite a new team member." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Profile (Enhanced)"
        description={`${partner.name} — comprehensive partnership profile, capabilities, infrastructure, and performance.`}
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[
          { label: "Share Profile", icon: "ExternalLink", variant: "outline", onClick: handleShare },
          { label: "Save Changes", icon: "Check", onClick: handleSave },
        ]}
      />

      <PartnerDisclaimer />

      {/* Summary stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Partner Type" value={PARTNER_TYPE} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Tier" value={<span className="capitalize">{partner.tier}</span>} icon={<Award className="h-5 w-5" />} tone="warning" />
        <StatCard label="Established" value={partner.establishedYear} icon={<GraduationCap className="h-5 w-5" />} hint={`Partner since ${new Date(partner.joinedAt).getFullYear()}`} />
        <StatCard label="Overall Rating" value={`${partner.rating.toFixed(1)} ★`} icon={<Star className="h-5 w-5" />} tone="success" hint="Based on 124 reviews" />
      </div>

      {/* Profile completeness meter */}
      <Card className="border-brand/30">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand" />
              Profile Completeness
            </CardTitle>
            <CardDescription className="mt-1">Complete profiles get 3× more visibility in partner search.</CardDescription>
          </div>
          <span className="text-2xl font-semibold text-brand">{completeness}%</span>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completeness} className="h-2.5" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLETENESS_CHECKLIST.map((c) => (
              <div key={c.key} className="flex items-center gap-2 text-sm">
                {c.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-muted-foreground/40" />
                )}
                <span className={c.done ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </div>
          {tips.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" /> Tips to reach 100%
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {tips.map((t) => (
                  <li key={t}>• Complete: <span className="font-medium text-foreground">{t}</span></li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner type + Business overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Partner Type</CardTitle>
            <CardDescription>Your primary partnership model.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(["Recruitment", "Physical Centre", "University", "Training"] as PartnerType[]).map((t) => {
                const selected = t === PARTNER_TYPE;
                return (
                  <div
                    key={t}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      selected ? "border-brand bg-brand/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className={`h-4 w-4 ${selected ? "text-brand" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{t}</span>
                    </div>
                    {selected ? (
                      <Badge className="bg-brand text-brand-foreground">Current</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Business Overview</CardTitle>
            <CardDescription>Elevator pitch shown to prospects and partners.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">{BUSINESS_OVERVIEW}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {partner.city}, {partner.state}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {partner.contactEmail}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {partner.contactPhone}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services offered + Geographic coverage */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Services Offered" description="Programs and services delivered to students.">
          <div className="flex flex-wrap gap-2">
            {SERVICES_OFFERED.map((s) => (
              <span key={s} className="inline-flex items-center rounded-md border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                {s}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("Manage services", { description: "Opening service catalog editor." })}>
            Manage Services
          </Button>
        </SectionCard>

        <SectionCard title="Geographic Coverage" description="Cities and states where you actively operate.">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cities ({GEO_COVERAGE.cities.length})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {GEO_COVERAGE.cities.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <MapPin className="h-3 w-3" /> {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">States / UTs ({GEO_COVERAGE.states.length})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {GEO_COVERAGE.states.map((s) => (
                  <span key={s} className="inline-flex items-center rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Team members */}
      <SectionCard
        title="Team Members"
        description="Key contacts for academics, admissions, and placements."
        action={<Button size="sm" variant="outline" onClick={handleAddTeam}>Add Member</Button>}
      >
        {TEAM_MEMBERS.length === 0 ? (
          <EmptyState icon={<Users className="h-5 w-5" />} title="No team members" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM_MEMBERS.map((m) => (
              <div key={m.id} className="flex items-start gap-3 rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
                <AvatarLogo text={m.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-brand">{m.role}</p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {m.email}</p>
                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {m.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Infrastructure + Facility tags */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Infrastructure Details" description="Capacity and facilities at your physical centre." className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {INFRASTRUCTURE.map((i) => (
              <div key={i.label} className="rounded-lg border p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Wrench className="h-3 w-3" /> {i.label}
                </p>
                <p className="mt-1 text-sm font-medium">{i.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Facility Tags" description="Quick amenity highlights.">
          <div className="flex flex-wrap gap-2">
            {FACILITY_TAGS.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> {f}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> 1 Gbps leased line · 99.9% uptime</p>
            <p className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" /> Wi-Fi 6 across campus · 480 devices max</p>
          </div>
        </SectionCard>
      </div>

      {/* Accreditations */}
      <SectionCard
        title="Accreditations & Certifications"
        description="External validations and partner program memberships."
        action={<Button size="sm" variant="outline" onClick={() => toast.info("Add accreditation", { description: "Upload certificate to add a new accreditation." })}>Add</Button>}
      >
        {ACCREDITATIONS.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No accreditations" />
        ) : (
          <ul className="space-y-2">
            {ACCREDITATIONS.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.issuer} · Valid until {a.validUntil}</p>
                  </div>
                </div>
                <Badge className={accBadgeClass(a.status)}>
                  {accStatusLabel(a.status)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Performance metrics */}
      <SectionCard title="Performance Metrics" description="Year-to-date outcomes powered by your partnership.">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {PERFORMANCE_METRICS.map((m) => (
            <StatCard
              key={m.label}
              label={m.label}
              value={m.value}
              icon={m.icon}
              tone={m.tone}
              delta={m.delta}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Metrics refreshed daily from your wallet, settlement, and placement records. For dispute resolution, contact <span className="font-medium text-brand">partnerships@jobsonn.com</span>.
        </p>
      </SectionCard>
    </div>
  );
}
