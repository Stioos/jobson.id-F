"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import {
  PageHeader, StatCard, SectionCard, StatusBadge, EmptyState,
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import {
  GraduationCap, MapPin, Globe, Mail, Phone, Users, Building2,
  Award, FileSignature, Calendar, TrendingUp, Briefcase, Search,
  CheckCircle2, Star, ArrowRight,
} from "lucide-react";

type CollegeType = "Engineering" | "Management" | "Arts";
type MouStatus = "signed" | "draft" | "renewed" | "expired";

interface Department {
  id: string;
  name: string;
  hod: string;
  students: number;
}

interface PlacementYear {
  year: string;
  enrolled: number;
  placed: number;
  avgPackage: number;
}

interface Collaboration {
  id: string;
  activity: string;
  status: "ongoing" | "completed" | "planned";
}

interface ScorecardItem {
  label: string;
  value: number; // 0-100
}

interface College {
  id: string;
  name: string;
  code: string;
  type: CollegeType;
  city: string;
  state: string;
  address: string;
  website: string;
  principal: string;
  contact: string;
  phone: string;
  email: string;
  mouStatus: MouStatus;
  mouSignedDate: string;
  mouValidUntil: string;
  revenueSharePct: number; // partner share
  totalStudents: number;
  studentsEnrolled: number;
  departments: Department[];
  courses: string[];
  placementHistory: PlacementYear[];
  collaborations: Collaboration[];
  scorecard: ScorecardItem[];
}

const COLLEGES: College[] = [
  {
    id: "col_1", name: "Kanchana Institute of Technology", code: "KIT-CBE", type: "Engineering",
    city: "Coimbatore", state: "Tamil Nadu", address: "Avanashi Road, Coimbatore 641014",
    website: "kanchana.edu.in", principal: "Dr. Suresh Kanchana", contact: "Dr. Lalitha R",
    phone: "+91 422 555 0142", email: "placements@kanchana.edu.in",
    mouStatus: "signed", mouSignedDate: "2024-03-15", mouValidUntil: "2027-03-14", revenueSharePct: 65,
    totalStudents: 2400, studentsEnrolled: 540,
    departments: [
      { id: "d1", name: "Computer Science & Engg", hod: "Dr. Anitha Krishnan", students: 720 },
      { id: "d2", name: "Electronics & Comm", hod: "Dr. Ravi Subramanian", students: 600 },
      { id: "d3", name: "Mechanical Engg", hod: "Dr. Mohan Das", students: 480 },
      { id: "d4", name: "Information Technology", hod: "Dr. Kavitha Rao", students: 360 },
      { id: "d5", name: "Electrical & Electronics", hod: "Dr. Senthil Vel", students: 240 },
    ],
    courses: ["B.E. CSE", "B.E. ECE", "B.E. Mech", "B.Tech IT", "B.E. EEE", "M.E. CSE", "MBA"],
    placementHistory: [
      { year: "2022", enrolled: 120, placed: 96, avgPackage: 540000 },
      { year: "2023", enrolled: 140, placed: 119, avgPackage: 620000 },
      { year: "2024", enrolled: 160, placed: 142, avgPackage: 680000 },
    ],
    collaborations: [
      { id: "c1", activity: "Full-Stack Bootcamp (12 weeks)", status: "completed" },
      { id: "c2", activity: "AWS Academy Integration", status: "ongoing" },
      { id: "c3", activity: "Placement Drive — TCS Campus", status: "completed" },
      { id: "c4", activity: "Cybersecurity Workshop Series", status: "planned" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 88 },
      { label: "Placement Rate", value: 89 },
      { label: "Student Satisfaction", value: 92 },
      { label: "MoU Compliance", value: 95 },
    ],
  },
  {
    id: "col_2", name: "Meridian Business School", code: "MBS-MAA", type: "Management",
    city: "Chennai", state: "Tamil Nadu", address: "Anna Salai, Chennai 600002",
    website: "meridianbs.ac.in", principal: "Dr. Geetha Iyer", contact: "Prof. Karthik Venkat",
    phone: "+91 44 555 7788", email: "admissions@meridianbs.ac.in",
    mouStatus: "renewed", mouSignedDate: "2024-09-01", mouValidUntil: "2026-08-31", revenueSharePct: 60,
    totalStudents: 1200, studentsEnrolled: 320,
    departments: [
      { id: "d1", name: "Marketing", hod: "Dr. Priya Menon", students: 320 },
      { id: "d2", name: "Finance", hod: "Dr. Arvind Nair", students: 280 },
      { id: "d3", name: "Human Resources", hod: "Dr. Saranya Devi", students: 200 },
      { id: "d4", name: "Operations", hod: "Dr. Vikram Rao", students: 220 },
      { id: "d5", name: "Business Analytics", hod: "Dr. Meera Joshi", students: 180 },
    ],
    courses: ["MBA (Full-Time)", "Executive MBA", "BBA", "PGDM", "PhD (Management)"],
    placementHistory: [
      { year: "2022", enrolled: 80, placed: 64, avgPackage: 720000 },
      { year: "2023", enrolled: 95, placed: 81, avgPackage: 820000 },
      { year: "2024", enrolled: 110, placed: 99, avgPackage: 940000 },
    ],
    collaborations: [
      { id: "c1", activity: "Digital Marketing Workshop", status: "completed" },
      { id: "c2", activity: "Industry Mentorship Program", status: "ongoing" },
      { id: "c3", activity: "Capstone Project Expo", status: "planned" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 82 },
      { label: "Placement Rate", value: 90 },
      { label: "Student Satisfaction", value: 88 },
      { label: "MoU Compliance", value: 92 },
    ],
  },
  {
    id: "col_3", name: "SRM Arts & Science College", code: "SRM-ASC", type: "Arts",
    city: "Madurai", state: "Tamil Nadu", address: "Kamarajar Salai, Madurai 625002",
    website: "srmasc.ac.in", principal: "Dr. Banumathi K", contact: "Dr. Rajesh Kumar",
    phone: "+91 452 555 3322", email: "principal@srmasc.ac.in",
    mouStatus: "draft", mouSignedDate: "", mouValidUntil: "", revenueSharePct: 55,
    totalStudents: 1800, studentsEnrolled: 140,
    departments: [
      { id: "d1", name: "Computer Applications", hod: "Dr. Siva Kumar", students: 480 },
      { id: "d2", name: "Commerce", hod: "Dr. Uma Maheswari", students: 540 },
      { id: "d3", name: "English Literature", hod: "Dr. Ramesh Babu", students: 240 },
      { id: "d4", name: "Visual Communication", hod: "Dr. Jaya Priya", students: 180 },
      { id: "d5", name: "Mathematics", hod: "Dr. Gopal Krishnan", students: 360 },
    ],
    courses: ["B.Com", "BCA", "B.A. English", "B.Sc. VisCom", "B.Sc. Maths", "M.Com", "MCA"],
    placementHistory: [
      { year: "2022", enrolled: 60, placed: 42, avgPackage: 360000 },
      { year: "2023", enrolled: 75, placed: 58, avgPackage: 420000 },
      { year: "2024", enrolled: 90, placed: 72, avgPackage: 480000 },
    ],
    collaborations: [
      { id: "c1", activity: "Soft Skills Bootcamp", status: "completed" },
      { id: "c2", activity: "Placement Readiness Program", status: "ongoing" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 70 },
      { label: "Placement Rate", value: 80 },
      { label: "Student Satisfaction", value: 84 },
      { label: "MoU Compliance", value: 60 },
    ],
  },
  {
    id: "col_4", name: "Vellore Engineering College", code: "VEC-VEL", type: "Engineering",
    city: "Vellore", state: "Tamil Nadu", address: "Katpadi Road, Vellore 632014",
    website: "vec.ac.in", principal: "Dr. Naveen Thomas", contact: "Dr. Preethi Jacob",
    phone: "+91 416 555 2210", email: "training@vec.ac.in",
    mouStatus: "signed", mouSignedDate: "2024-01-20", mouValidUntil: "2026-01-19", revenueSharePct: 62,
    totalStudents: 2100, studentsEnrolled: 410,
    departments: [
      { id: "d1", name: "Computer Science & Engg", hod: "Dr. Reena Mathew", students: 660 },
      { id: "d2", name: "Electronics & Comm", hod: "Dr. Yusuf Khan", students: 540 },
      { id: "d3", name: "Civil Engg", hod: "Dr. Lakshmi Narayanan", students: 360 },
      { id: "d4", name: "Mechanical Engg", hod: "Dr. Imran Khan", students: 320 },
      { id: "d5", name: "AI & Data Science", hod: "Dr. Anju Verma", students: 220 },
    ],
    courses: ["B.E. CSE", "B.E. ECE", "B.E. Civil", "B.E. Mech", "B.Tech AI&DS", "M.E. CSE"],
    placementHistory: [
      { year: "2022", enrolled: 110, placed: 88, avgPackage: 580000 },
      { year: "2023", enrolled: 130, placed: 108, avgPackage: 640000 },
      { year: "2024", enrolled: 145, placed: 124, avgPackage: 720000 },
    ],
    collaborations: [
      { id: "c1", activity: "Cloud Engineering Bootcamp", status: "completed" },
      { id: "c2", activity: "Hackathon 2024 — Vellore Edition", status: "completed" },
      { id: "c3", activity: "Industry-Academia Panel", status: "planned" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 86 },
      { label: "Placement Rate", value: 85 },
      { label: "Student Satisfaction", value: 87 },
      { label: "MoU Compliance", value: 93 },
    ],
  },
  {
    id: "col_5", name: "Coimbatore Management Institute", code: "CMI-CBE", type: "Management",
    city: "Coimbatore", state: "Tamil Nadu", address: "Race Course Road, Coimbatore 641018",
    website: "cmi.ac.in", principal: "Dr. Anand Subramaniam", contact: "Prof. Deepa Raghavan",
    phone: "+91 422 555 9988", email: "dean@cmi.ac.in",
    mouStatus: "expired", mouSignedDate: "2021-06-01", mouValidUntil: "2024-05-31", revenueSharePct: 58,
    totalStudents: 900, studentsEnrolled: 0,
    departments: [
      { id: "d1", name: "Marketing", hod: "Dr. Hari Krishnan", students: 240 },
      { id: "d2", name: "Finance", hod: "Dr. Lakshmi Venkat", students: 220 },
      { id: "d3", name: "Operations", hod: "Dr. Manoj Pillai", students: 180 },
      { id: "d4", name: "International Business", hod: "Dr. Sandhya Rani", students: 140 },
      { id: "d5", name: "Entrepreneurship", hod: "Dr. Gautham Menon", students: 120 },
    ],
    courses: ["MBA", "PGDM-IB", "Executive MBA", "PhD"],
    placementHistory: [
      { year: "2022", enrolled: 70, placed: 58, avgPackage: 660000 },
      { year: "2023", enrolled: 85, placed: 72, avgPackage: 740000 },
      { year: "2024", enrolled: 90, placed: 70, avgPackage: 780000 },
    ],
    collaborations: [
      { id: "c1", activity: "Entrepreneurship Cell Setup", status: "completed" },
      { id: "c2", activity: "MoU Renewal Discussions", status: "planned" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 0 },
      { label: "Placement Rate", value: 78 },
      { label: "Student Satisfaction", value: 80 },
      { label: "MoU Compliance", value: 40 },
    ],
  },
  {
    id: "col_6", name: "Trichy Arts & Humanities College", code: "TAH-TRI", type: "Arts",
    city: "Tiruchirappalli", state: "Tamil Nadu", address: "Bharathidasan Salai, Trichy 620020",
    website: "tahc.ac.in", principal: "Dr. Sundaram Iyer", contact: "Dr. Padma Krishnan",
    phone: "+91 431 555 4141", email: "info@tahc.ac.in",
    mouStatus: "signed", mouSignedDate: "2024-06-12", mouValidUntil: "2025-06-11", revenueSharePct: 50,
    totalStudents: 1500, studentsEnrolled: 220,
    departments: [
      { id: "d1", name: "Computer Science", hod: "Dr. Vasanthi Ravi", students: 420 },
      { id: "d2", name: "Commerce", hod: "Dr. Bala Murugan", students: 380 },
      { id: "d3", name: "Tamil Literature", hod: "Dr. Meena Kumari", students: 240 },
      { id: "d4", name: "History", hod: "Dr. Palaniappan", students: 220 },
      { id: "d5", name: "Psychology", hod: "Dr. Revathi S", students: 240 },
    ],
    courses: ["B.Com", "B.Sc. CS", "B.A. Tamil", "B.A. History", "B.Sc. Psychology", "M.Com"],
    placementHistory: [
      { year: "2022", enrolled: 50, placed: 32, avgPackage: 320000 },
      { year: "2023", enrolled: 70, placed: 51, avgPackage: 380000 },
      { year: "2024", enrolled: 85, placed: 65, avgPackage: 440000 },
    ],
    collaborations: [
      { id: "c1", activity: "Career Counselling Drive", status: "ongoing" },
      { id: "c2", activity: "Soft Skills Workshop", status: "completed" },
      { id: "c3", activity: "Faculty Development Program", status: "planned" },
    ],
    scorecard: [
      { label: "Enrollment Target", value: 76 },
      { label: "Placement Rate", value: 76 },
      { label: "Student Satisfaction", value: 82 },
      { label: "MoU Compliance", value: 88 },
    ],
  },
];

function mouLabel(s: MouStatus): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function collegeTypeTone(t: CollegeType): string {
  if (t === "Engineering") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  if (t === "Management") return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
}

function collabTone(s: Collaboration["status"]): string {
  if (s === "ongoing") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  if (s === "completed") return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
  return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
}

function collabLabel(s: Collaboration["status"]): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function PartnerCollegeProfiles() {
  const partner = CURRENT_PARTNER;
  const [selectedId, setSelectedId] = React.useState<string>(COLLEGES[0].id);
  const [search, setSearch] = React.useState("");

  const filtered = COLLEGES.filter((c) =>
    `${c.name} ${c.city} ${c.state} ${c.type}`.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = COLLEGES.find((c) => c.id === selectedId) ?? COLLEGES[0];

  const totalStudents = COLLEGES.reduce((s, c) => s + c.totalStudents, 0);
  const totalEnrolled = COLLEGES.reduce((s, c) => s + c.studentsEnrolled, 0);
  const signedCount = COLLEGES.filter((c) => c.mouStatus === "signed" || c.mouStatus === "renewed").length;
  const avgRevenuePct = Math.round(
    COLLEGES.reduce((s, c) => s + c.revenueSharePct, 0) / COLLEGES.length,
  );

  function exportProfile() {
    toast.success("Profile exported", { description: `${selected.name} — college-profile.pdf is being downloaded.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Profiles"
        description={`${partner.name} — manage your college partnership profiles, MoUs, departments, placements, and collaborations.`}
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[
          { label: "Export Profile", icon: "Download", variant: "outline", onClick: exportProfile },
          { label: "Add College", icon: "Plus", onClick: () => toast.info("Add college", { description: "Opening form to onboard a new college partner." }) },
        ]}
      />

      <PartnerDisclaimer />

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Colleges" value={COLLEGES.length} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active MoUs" value={`${signedCount}/${COLLEGES.length}`} icon={<FileSignature className="h-5 w-5" />} tone="success" />
        <StatCard label="Students Enrolled" value={formatNumber(totalEnrolled)} icon={<Users className="h-5 w-5" />} hint={`of ${formatNumber(totalStudents)} on rolls`} />
        <StatCard label="Avg Revenue Share" value={`${avgRevenuePct}%`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Master-detail layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* College list (left) */}
        <SectionCard
          title="College List"
          description={`${filtered.length} of ${COLLEGES.length} colleges`}
          className="lg:col-span-4"
          contentClassName="space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colleges…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={<Search className="h-5 w-5" />} title="No colleges found" />
          ) : (
            <ul className="space-y-2 max-h-[640px] overflow-y-auto scroll-thin">
              {filtered.map((c) => {
                const active = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${
                        active ? "border-brand bg-brand/5" : "border-border hover:border-brand/40 hover:bg-brand/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{c.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {c.city}, {c.state}
                          </p>
                        </div>
                        <Badge className={collegeTypeTone(c.type)}>{c.type}</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{formatNumber(c.studentsEnrolled)} enrolled</span>
                        <StatusBadge status={c.mouStatus} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        {/* Selected college detail (right) */}
        <div className="lg:col-span-8 space-y-4">
          {/* College info */}
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3 min-w-0">
                <AvatarLogo text={selected.name} size="md" />
                <div className="min-w-0">
                  <CardTitle className="text-base">{selected.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="font-mono">{selected.code}</span> · {selected.type} College
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={selected.mouStatus} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <p className="flex items-start gap-2"><Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">Address:</span> {selected.address}</span></p>
                <p className="flex items-start gap-2"><Globe className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">Website:</span> <a className="text-brand hover:underline" href={`https://${selected.website}`} target="_blank" rel="noreferrer">{selected.website}</a></span></p>
                <p className="flex items-start gap-2"><GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">Principal:</span> {selected.principal}</span></p>
                <p className="flex items-start gap-2"><Users className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">SPOC:</span> {selected.contact}</span></p>
                <p className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">Email:</span> {selected.email}</span></p>
                <p className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><span className="text-muted-foreground">Phone:</span> {selected.phone}</span></p>
              </div>
            </CardContent>
          </Card>

          {/* Departments + Courses */}
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Departments" description={`${selected.departments.length} departments`}>
              <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
                {selected.departments.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">HoD: {d.hod}</p>
                    </div>
                    <span className="text-xs font-semibold text-brand">{formatNumber(d.students)}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Student Strength & Courses" description="Roll numbers and academic programs.">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Students</p>
                <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(selected.totalStudents)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatNumber(selected.studentsEnrolled)} enrolled in jobson.id programs</p>
              </div>
              <div className="mt-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Courses Offered ({selected.courses.length})</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.courses.map((c) => (
                    <span key={c} className="inline-flex items-center rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Placement history */}
          <SectionCard title="Placement History" description="Year-wise enrollment, placement, and average CTC.">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Year</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Enrolled</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Placed</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Rate</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selected.placementHistory.map((p) => {
                    const rate = p.enrolled > 0 ? Math.round((p.placed / p.enrolled) * 100) : 0;
                    return (
                      <tr key={p.year} className="hover:bg-muted/30">
                        <td className="px-3 py-2 font-medium">{p.year}</td>
                        <td className="px-3 py-2 text-right">{formatNumber(p.enrolled)}</td>
                        <td className="px-3 py-2 text-right">{formatNumber(p.placed)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-brand">{rate}%</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(p.avgPackage)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* MoU details + Collaborations */}
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="MoU Details" description="Partnership agreement metadata.">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selected.mouStatus} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Signed Date</span>
                  <span className="font-medium">{selected.mouSignedDate || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Valid Until</span>
                  <span className="font-medium">{selected.mouValidUntil || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Award className="h-3.5 w-3.5" /> Revenue Share</span>
                  <span className="font-semibold text-brand">{selected.revenueSharePct}%</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Collaboration Activities" description="Joint programs and events.">
              <ul className="space-y-2 max-h-60 overflow-y-auto scroll-thin">
                {selected.collaborations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-brand" />
                      {c.activity}
                    </span>
                    <Badge className={collabTone(c.status)}>{collabLabel(c.status)}</Badge>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          {/* Performance scorecard */}
          <SectionCard
            title="Performance Scorecard"
            description="Composite metrics across enrollment, placement, satisfaction, and compliance."
            action={<Button size="sm" variant="ghost" onClick={() => toast.info("Scorecard breakdown", { description: "Detailed per-metric methodology and benchmarks." })}>
              Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {selected.scorecard.map((s) => (
                <div key={s.label} className="rounded-lg border p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Star className="h-3 w-3" /> {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-brand">{s.value}%</p>
                  <Progress value={s.value} className="mt-2 h-1.5" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
