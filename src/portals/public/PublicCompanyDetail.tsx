"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { employers, jobs } from "@/lib/mock-data";
import type { Job } from "@/lib/types";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building2, MapPin, Star, Users, Globe, Calendar, ShieldCheck, ArrowRight,
  ArrowLeft, Briefcase, CheckCircle2, Heart, Quote,
} from "lucide-react";
import { toast } from "sonner";

export function PublicCompanyDetail({ slug }: { slug: string }) {
  const { navigate } = useNav();
  const employer = React.useMemo(() => employers.find((e) => e.slug === slug || e.id === slug) ?? null, [slug]);
  const [following, setFollowing] = React.useState(false);

  if (!employer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Company not found"
          description="The company you're looking for may have been removed."
          action={<Button onClick={() => navigate("public", "companies")}><ArrowLeft className="mr-1 h-4 w-4" /> Back to companies</Button>}
        />
      </div>
    );
  }

  const companyJobs = jobs.filter((j) => j.employerId === employer.id && j.status === "published");

  const handleFollow = () => {
    setFollowing((f) => !f);
    if (!following) toast.success(`Following ${employer.name}`, { description: "You'll get updates on new jobs and news." });
    else toast("Unfollowed", { description: `You'll no longer get updates from ${employer.name}.` });
  };

  // Sample reviews (simulated)
  const reviews = [
    { author: "Senior Engineer", rating: 5, title: "Great engineering culture", text: "Engineer-driven decisions, strong mentorship, and real ownership. Hackathons every quarter keep things fresh.", date: "2 weeks ago", pros: "Autonomy, learning budget, smart peers", cons: "Fast pace can be intense" },
    { author: "Product Manager", rating: 4, title: "Fast-paced but rewarding", text: "High ownership from day one. You'll wear many hats. Cross-functional collaboration is strong but you must drive it.", date: "1 month ago", pros: "Impact, ESOPs, growth", cons: "Work-life balance varies by team" },
    { author: "Designer", rating: 4, title: "Design is respected here", text: "Designers are embedded in product teams and have real seat at the table. Design system maturity could be better.", date: "2 months ago", pros: "Design voice matters, mentorship", cons: "Process still maturing" },
    { author: "Backend Engineer", rating: 5, title: "Best team I've worked with", text: "Distributed systems work at scale, blameless postmortems, and an on-call rotation that actually respects your time.", date: "3 months ago", pros: "Tech stack, SRE culture, comp", cons: "On-call rotations" },
  ];

  return (
    <div className="bg-background">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-brand/20 via-brand/5 to-background sm:h-56">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate("public", "companies")}
          className="mb-4 -mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> All companies
        </button>

        {/* Header card */}
        <Card className="-mt-20 mb-6 overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-12 rounded-xl bg-background p-1 shadow-sm sm:-mt-16">
                <AvatarLogo text={employer.name} size="xl" className="h-20 w-20 text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{employer.name}</h1>
                  {employer.verified && (
                    <Badge className="gap-1 bg-brand/10 text-brand"><ShieldCheck className="h-3 w-3" /> Verified</Badge>
                  )}
                  {employer.featured && <Badge variant="secondary">Featured employer</Badge>}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" />{employer.industry}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{employer.size} employees</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{employer.headquarters}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />Founded {employer.founded}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(employer.website, "_blank")}>
                  <Globe className="h-4 w-4" /> Website
                </Button>
                <Button
                  size="sm"
                  variant={following ? "secondary" : "default"}
                  className="gap-1.5"
                  onClick={handleFollow}
                >
                  {following ? <CheckCircle2 className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
              <Stat label="Rating" value={
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {employer.rating}
                </span>
              } />
              <Stat label="Reviews" value={formatNumber(employer.reviewCount)} />
              <Stat label="Followers" value={formatNumber(employer.followerCount)} />
              <Stat label="Open jobs" value={String(companyJobs.length)} />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({companyJobs.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {employer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{employer.about}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base italic leading-relaxed text-foreground">&ldquo;{employer.mission}&rdquo;</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits &amp; perks</CardTitle>
                  <CardDescription>What employees say they love</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {employer.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Company facts</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <FactRow label="Industry" value={employer.industry} />
                  <FactRow label="Size" value={employer.size} />
                  <FactRow label="Founded" value={String(employer.founded)} />
                  <FactRow label="HQ" value={employer.headquarters} />
                  <FactRow label="Website" value={employer.website.replace(/^https?:\/\//, "")} />
                  <Separator />
                  <FactRow label="Locations" value={employer.locations.join(", ")} />
                  <FactRow label="Plan tier" value={<Badge variant="secondary" className="capitalize">{employer.plan}</Badge>} />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-brand/10 to-background">
                <CardContent className="p-5">
                  <h3 className="font-semibold">Want to work here?</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{companyJobs.length} open role{companyJobs.length !== 1 ? "s" : ""} at {employer.name}.</p>
                  <Button className="mt-3 w-full gap-1.5" size="sm" onClick={() => {
                    const el = document.querySelector('[data-value="jobs"]') as HTMLButtonElement | null;
                    el?.click();
                  }}>
                    <Briefcase className="h-4 w-4" /> View open jobs
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </TabsContent>

          {/* JOBS */}
          <TabsContent value="jobs" className="mt-4">
            {companyJobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-6 w-6" />}
                title="No open roles right now"
                description={`${employer.name} has no active openings at the moment. Follow them to be notified.`}
                action={<Button size="sm" variant="outline" onClick={handleFollow}>Follow company</Button>}
              />
            ) : (
              <div className="space-y-3">
                {companyJobs.map((job) => <CompanyJobRow key={job.id} job={job} />)}
              </div>
            )}
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{employer.rating}</div>
                    <div className="mt-1 flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(employer.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{formatNumber(employer.reviewCount)} reviews</div>
                  </div>
                  <Separator orientation="vertical" className="hidden h-20 sm:block" />
                  <div className="flex-1 space-y-1.5">
                    {[
                      { star: 5, pct: 68 },
                      { star: 4, pct: 20 },
                      { star: 3, pct: 8 },
                      { star: 2, pct: 3 },
                      { star: 1, pct: 1 },
                    ].map((r) => (
                      <div key={r.star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-muted-foreground">{r.star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-amber-400" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {reviews.map((r, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={r.author} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{r.author}</span>
                        <span className="text-xs text-muted-foreground">· {r.date}</span>
                      </div>
                      <div className="mt-0.5 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                        ))}
                      </div>
                      <h4 className="mt-2 font-medium">{r.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg border bg-emerald-500/5 p-2.5">
                          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Pros</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{r.pros}</div>
                        </div>
                        <div className="rounded-lg border bg-rose-500/5 p-2.5">
                          <div className="text-xs font-medium text-rose-700 dark:text-rose-400">Cons</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{r.cons}</div>
                        </div>
                      </div>
                    </div>
                    <Quote className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <p className="text-center text-xs text-muted-foreground">Reviews are illustrative for this demo.</p>
          </TabsContent>

          {/* CULTURE */}
          <TabsContent value="culture" className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Our culture</CardTitle>
                <CardDescription>Principles that shape how we work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {employer.culture.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{c}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Office locations</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {employer.locations.map((l, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {l}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hiring pace</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <FactRow label="Active openings" value={String(companyJobs.length)} />
                <FactRow label="Total applicants" value={formatNumber(companyJobs.reduce((s, j) => s + j.applicationCount, 0))} />
                <FactRow label="Plan" value={<Badge variant="secondary" className="capitalize">{employer.plan}</Badge>} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

function CompanyJobRow({ job }: { job: Job }) {
  const { navigate } = useNav();
  return (
    <Card className="group p-4 transition-all hover:border-brand hover:shadow-md">
      <button onClick={() => navigate("public", `jobs/${job.id}`)} className="flex w-full items-start gap-3 text-left">
        <Briefcase className="mt-1 h-5 w-5 shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold group-hover:text-brand">{job.title}</h3>
            {job.featured && <Badge className="bg-brand/10 text-brand">Featured</Badge>}
            {job.urgent && <Badge variant="destructive" className="bg-rose-500/10 text-rose-600">Urgent</Badge>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
            <span className="inline-flex items-center gap-1 capitalize"><Briefcase className="h-3 w-3" />{job.workArrangement}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{timeAgo(job.postedAt)}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(job.applicationCount)} applied</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-brand">
            {job.showSalary ? `${formatCurrency(job.salaryMin, job.currency)} – ${formatCurrency(job.salaryMax, job.currency)}` : "Competitive"}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-brand">
            View <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </button>
    </Card>
  );
}
