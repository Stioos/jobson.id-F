"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { jobs, employers } from "@/lib/mock-data";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Search, MapPin, Briefcase, Building2, Users, TrendingUp,
  ArrowRight, Sparkles, ShieldCheck, BarChart3, Target,
  Code2, PenTool, LineChart, HeartPulse, Wallet, Layers,
  CheckCircle2, Star, Clock, ChevronRight,
  Home, Factory, Rocket, Landmark, Cpu, BarChart2,
  UserCircle, Megaphone, GraduationCap, Repeat,
} from "lucide-react";

const categories = [
  { name: "Engineering", icon: Code2, count: 1240 },
  { name: "Product", icon: Target, count: 412 },
  { name: "Data & Analytics", icon: BarChart3, count: 386 },
  { name: "Design", icon: PenTool, count: 218 },
  { name: "Sales", icon: TrendingUp, count: 540 },
  { name: "Healthcare", icon: HeartPulse, count: 312 },
  { name: "Finance", icon: Wallet, count: 264 },
  { name: "Operations", icon: Layers, count: 198 },
];

// Quick-access category cards (image-1 style: pastel icon + label + chevron)
const quickCategories = [
  { name: "Remote", icon: Home, color: "bg-sky-500/10 text-sky-600", query: "Remote" },
  { name: "MNC", icon: Building2, color: "bg-violet-500/10 text-violet-600", query: "MNC" },
  { name: "Analytics", icon: BarChart2, color: "bg-amber-500/10 text-amber-600", query: "Analytics" },
  { name: "Startup", icon: Rocket, color: "bg-rose-500/10 text-rose-600", query: "Startup" },
  { name: "Banking & Finance", icon: Landmark, color: "bg-emerald-500/10 text-emerald-600", query: "Finance" },
  { name: "Engineering", icon: Cpu, color: "bg-blue-500/10 text-blue-600", query: "Engineering" },
  { name: "Sales", icon: Briefcase, color: "bg-teal-500/10 text-teal-600", query: "Sales" },
  { name: "Data Science", icon: BarChart3, color: "bg-indigo-500/10 text-indigo-600", query: "Data Science" },
  { name: "HR", icon: UserCircle, color: "bg-pink-500/10 text-pink-600", query: "HR" },
  { name: "Marketing", icon: Megaphone, color: "bg-orange-500/10 text-orange-600", query: "Marketing" },
  { name: "Internship", icon: GraduationCap, color: "bg-cyan-500/10 text-cyan-600", query: "Internship" },
  { name: "Manufacturing", icon: Factory, color: "bg-lime-500/10 text-lime-600", query: "Manufacturing" },
];

const experienceOptions = [
  { value: "0", label: "Fresher (0 yrs)" },
  { value: "1", label: "1+ years" },
  { value: "2", label: "2+ years" },
  { value: "3", label: "3+ years" },
  { value: "5", label: "5+ years" },
  { value: "7", label: "7+ years" },
  { value: "10", label: "10+ years" },
];

const steps = [
  {
    icon: Users,
    title: "For Candidates",
    color: "text-brand bg-brand/10",
    points: [
      "Build an AI-enhanced profile that surfaces you to right employers",
      "Get matched to roles with transparent fit scoring",
      "Track every application stage in real-time",
    ],
  },
  {
    icon: Building2,
    title: "For Employers",
    color: "text-amber-600 bg-amber-500/10",
    points: [
      "Post jobs with smart bias-check and JD generation",
      "Manage pipeline stages with collaborative scorecards",
      "Hire faster with structured screening & assessments",
    ],
  },
  {
    icon: ShieldCheck,
    title: "For Agencies",
    color: "text-violet-600 bg-violet-500/10",
    points: [
      "Manage multiple clients & requisitions in one workspace",
      "Split placements with transparent commission tracking",
      "Access curated talent pools with consent-first indexing",
    ],
  },
];

export function PublicHome() {
  const { navigate } = useNav();
  const [keyword, setKeyword] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [experience, setExperience] = React.useState("");

  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 6);
  const recentJobs = jobs.slice(0, 6);
  const featuredEmployers = [...employers.filter((e) => e.featured), ...employers.filter((e) => !e.featured)].slice(0, 6);

  const handleSearch = () => {
    sessionStorage.setItem(
      "jobsonn_job_search",
      JSON.stringify({
        keyword,
        location,
        experienceMin: experience ? parseInt(experience, 10) : 0,
      })
    );
    navigate("public", "jobs");
  };

  const handleQuickCategory = (query: string) => {
    sessionStorage.setItem(
      "jobsonn_job_search",
      JSON.stringify({ keyword: query, location: "", experienceMin: 0 })
    );
    navigate("public", "jobs");
  };

  return (
    <div className="bg-background">
      {/* HERO — two-line headline + pill search bar, fits in one viewport */}
      <section className="relative overflow-hidden border-b">
        {/* Subtle emerald gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 via-background to-background" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" aria-hidden />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>The Future of Careers is Automate Everything.</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight whitespace-nowrap sm:text-4xl lg:text-5xl">
              <span className="block text-muted-foreground">Explore Global Opportunities.</span>
              <span className="block bg-gradient-to-r from-brand to-teal-500 bg-clip-text text-transparent">
                Build Limitless Careers.
              </span>
            </h1>
          </div>

          {/* PILL-SHAPED SEARCH BAR — 3 segments + nested Search button (75% of screen) */}
          <div className="mx-auto mt-6 w-[92%] sm:w-[85%] lg:w-[75vw] lg:max-w-[1300px]">
            <div className="flex items-center gap-1 rounded-full border bg-card p-1.5 shadow-xl sm:gap-2 sm:p-2">
              {/* Segment 1: Skills / Company / Job Title (with search icon) */}
              <div className="relative flex h-12 flex-1 items-center sm:h-14">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by Skills, Company or Job Title"
                  className="h-full border-0 bg-transparent pl-9 pr-2 text-sm shadow-none focus-visible:ring-0 sm:pl-12 sm:text-base"
                  aria-label="Keyword search"
                />
              </div>

              {/* Divider 1 */}
              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* Segment 2: Location (with map-pin icon) */}
              <div className="relative flex h-12 w-[35%] items-center sm:h-14 sm:w-auto sm:min-w-[160px]">
                <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Location"
                  className="h-full border-0 bg-transparent pl-9 pr-2 text-sm shadow-none focus-visible:ring-0 sm:pl-12 sm:text-base"
                  aria-label="Location"
                />
              </div>

              {/* Divider 2 */}
              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* Segment 3: Experience (with briefcase icon + chevron) */}
              <div className="flex h-12 w-[40%] items-center sm:h-14 sm:w-auto sm:min-w-[160px]">
                <Briefcase className="pointer-events-none ml-3 h-4 w-4 text-muted-foreground sm:ml-4 sm:h-5 sm:w-5" />
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="h-full border-0 bg-transparent px-2 text-sm shadow-none focus:ring-0 sm:text-base">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nested Search button (pill-within-pill, emerald brand) */}
              <Button
                size="lg"
                className="h-12 shrink-0 gap-2 rounded-full px-6 text-sm font-semibold sm:h-12 sm:px-8"
                onClick={handleSearch}
              >
                <span>Search</span>
              </Button>
            </div>

            {/* Trending pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Trending:</span>
              {["React", "Product Manager", "Remote", "Go", "Fintech", "Data Science"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setKeyword(t);
                    sessionStorage.setItem(
                      "jobsonn_job_search",
                      JSON.stringify({ keyword: t, location: "", experienceMin: 0 })
                    );
                    navigate("public", "jobs");
                  }}
                  className="rounded-full border bg-background/60 px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY CARDS — image-1 style: pastel icon + label + chevron */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore job opportunities</h2>
        </div>

        {/* CATEGORY LABELS — 3 audience segments with colored icons (below section header) */}
        <div className="mb-8 flex items-center justify-center gap-6 sm:gap-10 lg:gap-16">
          <button
            onClick={() => navigate("candidate", "overview")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 sm:h-10 sm:w-10">
              <UserCircle className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-blue-600 sm:text-sm">
              For Job Seekers
            </span>
          </button>
          <div className="h-8 w-px bg-border" />
          <button
            onClick={() => navigate("public", "jobs")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 sm:h-10 sm:w-10">
              <Repeat className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-amber-600 sm:text-sm">
              For Job Switchers
            </span>
          </button>
          <div className="h-8 w-px bg-border" />
          <button
            onClick={() => navigate("candidate", "overview")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 sm:h-10 sm:w-10">
              <Rocket className="h-4 w-4 text-violet-600 sm:h-5 sm:w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-violet-600 sm:text-sm">
              For Your Next
            </span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickCategories.map((c) => (
            <button
              key={c.name}
              onClick={() => handleQuickCategory(c.query)}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <span className="flex-1 truncate text-sm font-semibold">{c.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
            </button>
          ))}
        </div>
      </section>

      {/* POPULAR CATEGORIES — by function with role counts */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore by category</h2>
          <p className="mt-2 text-sm text-muted-foreground">Find roles across the functions shaping India&apos;s economy.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                sessionStorage.setItem(
                  "jobsonn_job_search",
                  JSON.stringify({ keyword: "", location: "", category: c.name })
                );
                navigate("public", "jobs");
              }}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{formatNumber(c.count)} open roles</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED EMPLOYERS */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured employers</h2>
              <p className="mt-2 text-sm text-muted-foreground">Trusted organizations actively hiring on JOBSONN.</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("public", "companies")}>
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEmployers.map((e) => (
              <button
                key={e.id}
                onClick={() => navigate("public", `companies/${e.slug}`)}
                className="group text-left"
              >
                <Card className="h-full p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md sm:p-5">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={e.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-semibold">{e.name}</h3>
                        {e.verified && (
                          <ShieldCheck className="h-4 w-4 shrink-0 text-brand" aria-label="Verified" />
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">{e.industry}</div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {e.rating} ({formatNumber(e.reviewCount)})
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {formatNumber(e.followerCount)} followers
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured jobs</h2>
            <p className="mt-2 text-sm text-muted-foreground">Hand-picked opportunities from hiring teams.</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("public", "jobs")}>
            Browse all jobs <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentJobs.map((job) => (
            <FeaturedJobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">One platform, three audiences</h2>
            <p className="mt-2 text-sm text-muted-foreground">Whether you&apos;re hiring, looking, or staffing — JOBSONN works for you.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="relative h-full p-6">
                <div className="absolute right-5 top-5 text-5xl font-bold text-muted/40">0{i + 1}</div>
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <ul className="mt-3 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge className="mb-3" variant="secondary">Get started in minutes</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to find your next role — or your next great hire?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Create a free profile, get matched to opportunities, and apply with structured,
                transparent applications. No spam, no resume black holes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("candidate", "overview")} className="gap-2">
                  <Users className="h-4 w-4" /> Join as candidate
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("employer", "overview")} className="gap-2">
                  <Building2 className="h-4 w-4" /> Hire talent
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "AI match scoring", value: "Transparent", icon: Sparkles },
                { label: "Application tracking", value: "Real-time", icon: TrendingUp },
                { label: "Screening", value: "Structured", icon: ShieldCheck },
                { label: "Compliance", value: "DPDP-ready", icon: Lock },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border bg-card p-4">
                  <s.icon className="mb-2 h-5 w-5 text-brand" />
                  <div className="text-sm font-semibold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function FeaturedJobCard({ job }: { job: (typeof jobs)[number] }) {
  const { navigate } = useNav();
  const employer = employers.find((e) => e.id === job.employerId);
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => navigate("public", `jobs/${job.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate("public", `jobs/${job.id}`)}
      className="group flex h-full cursor-pointer flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md sm:p-5"
    >
      <div className="flex items-start gap-3">
        <AvatarLogo text={job.employerName} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold leading-tight group-hover:text-brand">{job.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (employer) navigate("public", `companies/${employer.slug}`);
            }}
            className="text-xs text-muted-foreground hover:text-brand hover:underline"
          >
            {job.employerName}
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="capitalize">{job.workArrangement}</Badge>
        <Badge variant="outline" className="capitalize">{job.employmentType}</Badge>
        {job.featured && <Badge className="bg-brand/10 text-brand">Featured</Badge>}
        {job.urgent && <Badge variant="destructive" className="bg-rose-500/10 text-rose-600">Urgent</Badge>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
        <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experienceMin}-{job.experienceMax} yrs</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.postedAt)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-semibold text-brand">
          {job.showSalary ? `${formatCurrency(job.salaryMin, job.currency)} – ${formatCurrency(job.salaryMax, job.currency)}` : "Competitive"}
        </span>
        <span className="text-xs text-muted-foreground">{formatNumber(job.applicationCount)} applied</span>
      </div>
    </Card>
  );
}

// Lock icon for the CTA grid
function Lock({ className }: { className?: string }) {
  return <ShieldCheck className={className} />;
}
