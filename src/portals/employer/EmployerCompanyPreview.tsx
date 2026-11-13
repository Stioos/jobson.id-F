"use client";

import * as React from "react";
import { employers, jobs } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Building2, MapPin, Globe, Users, Calendar, Briefcase, Star, Quote,
  Play, CheckCircle2, Lightbulb, Eye, ShieldCheck, Heart, Sparkles, Video,
} from "lucide-react";

const employer = employers[0];

const TIPS = [
  { id: "t1", title: "Add a culture video", detail: "Careers pages with a culture video see 2.4× more saves from candidates.", priority: "High" },
  { id: "t2", title: "Show office photos", detail: "Profiles with 4+ office photos receive 31% more applications.", priority: "Medium" },
  { id: "t3", title: "Refresh testimonials quarterly", detail: "Recent testimonials (last 90 days) build more trust than older ones.", priority: "Medium" },
  { id: "t4", title: "List salary ranges on jobs", detail: "Jobs with salary ranges get 48% more qualified applications.", priority: "High" },
  { id: "t5", title: "Respond within 48 hours", detail: "First-response time under 48h increases offer acceptance by 22%.", priority: "High" },
];

const TESTIMONIALS = [
  { name: "Anika Verma", role: "Engineering Manager · 4y", quote: "The engineering culture here is unmatched — I've grown more in 4 years than I thought possible.", rating: 5 },
  { name: "Rahul Deshpande", role: "Senior Designer · 2y", quote: "Design decisions are respected at the leadership level. Truly a craft-first team.", rating: 5 },
  { name: "Meera Krishnan", role: "PM · 3y", quote: "Cross-functional collaboration is real, not a slogan. We ship things that customers love.", rating: 4 },
];

export function EmployerCompanyPreview() {
  const [view, setView] = React.useState<"candidate" | "admin">("candidate");
  const brandingScore = 78;
  const openJobs = React.useMemo(() => jobs.filter((j) => j.employerId === employer.id && j.status === "published"), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Preview"
        description="See exactly how candidates view your company profile on jobson.id"
        icon={<Eye className="h-6 w-6" />}
        actions={[
          { label: "Edit profile", variant: "outline", onClick: () => toast.info("Open Company Profile editor") },
          { label: "Share preview", onClick: () => toast.success("Preview link copied to clipboard") },
        ]}
      />

      <Tabs value={view} onValueChange={(v) => setView(v as "candidate" | "admin")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="candidate" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Candidate View</TabsTrigger>
            <TabsTrigger value="admin" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Admin View</TabsTrigger>
          </TabsList>
          <p className="text-xs text-muted-foreground">
            {view === "candidate" ? "Showing public-facing profile · Buttons disabled for preview" : "Internal view with metrics & gaps"}
          </p>
        </div>

        <TabsContent value="candidate" className="mt-6 space-y-6">
          {/* Candidate-facing hero */}
          <Card className="overflow-hidden border-brand/20">
            <div className="h-32 bg-gradient-to-br from-brand/30 via-brand/10 to-transparent" />
            <CardContent className="-mt-12 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <div className="rounded-2xl border-4 border-background bg-card p-2 shadow-sm">
                    <AvatarLogo text={employer.logo} size="xl" />
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{employer.name}</h2>
                      {employer.verified && <ShieldCheck className="h-4 w-4 text-brand" />}
                      {employer.featured && <Badge className="bg-brand/10 text-brand border-brand/20"><Sparkles className="mr-1 h-3 w-3" /> Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{employer.industry} · {employer.size} employees</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="gap-1.5"><Heart className="h-4 w-4" /> Follow</Button>
                  <Button disabled className="gap-1.5"><Briefcase className="h-4 w-4" /> View Jobs</Button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2 rounded-md border p-2.5 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  <div><p className="font-medium">HQ</p><p className="text-muted-foreground truncate">{employer.headquarters}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-brand" />
                  <div><p className="font-medium">Founded</p><p className="text-muted-foreground">{employer.founded}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5 text-xs">
                  <Users className="h-3.5 w-3.5 text-brand" />
                  <div><p className="font-medium">Followers</p><p className="text-muted-foreground">{employer.followerCount.toLocaleString()}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5 text-xs">
                  <Briefcase className="h-3.5 w-3.5 text-brand" />
                  <div><p className="font-medium">Open jobs</p><p className="text-muted-foreground">{openJobs.length}</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* About + Locations + Video */}
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="About" description="Who we are">
                <p className="text-sm leading-relaxed text-muted-foreground">{employer.about}</p>
                <div className="mt-4 rounded-md bg-brand/5 p-3 text-sm">
                  <p className="font-medium text-brand">Our mission</p>
                  <p className="mt-1 text-muted-foreground">{employer.mission}</p>
                </div>
              </SectionCard>

              <SectionCard title="Office locations" description="Where we work">
                <div className="flex flex-wrap gap-2">
                  {employer.locations.map((l) => (
                    <Badge key={l} variant="secondary" className="gap-1 py-1 pl-2 pr-3"><MapPin className="h-3 w-3 text-brand" /> {l}</Badge>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Life at TechCorp" description="A glimpse of our culture">
                <div className="aspect-video rounded-md border bg-muted/40 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-brand/10 p-3"><Play className="h-6 w-6 text-brand" /></div>
                  <p className="mt-3 text-sm font-medium">Culture video — Coming soon</p>
                  <p className="mt-1 text-xs text-muted-foreground">A 90-second video will appear here once uploaded.</p>
                </div>
              </SectionCard>

              <SectionCard title="Why work with us" description="What employees love">
                <div className="grid gap-3 sm:grid-cols-2">
                  {employer.benefits.slice(0, 6).map((b, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border p-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Sidebar: rating, testimonials, jobs preview */}
            <div className="space-y-6">
              <SectionCard title="Rating & reviews">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-semibold">{employer.rating}</div>
                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(employer.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Based on {employer.reviewCount.toLocaleString()} reviews</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Employee testimonials">
                <div className="space-y-3 max-h-72 overflow-y-auto scroll-thin pr-1">
                  {TESTIMONIALS.map((t, i) => (
                    <Card key={i}>
                      <CardContent className="p-3">
                        <Quote className="h-4 w-4 text-brand" />
                        <p className="mt-1.5 text-sm text-muted-foreground">{t.quote}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.role}</p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Open positions" description={`${openJobs.length} roles hiring now`}>
                <div className="space-y-2">
                  {openJobs.slice(0, 3).map((j) => (
                    <div key={j.id} className="rounded-md border p-2.5 text-sm">
                      <p className="font-medium">{j.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location} · {j.workArrangement}</p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" disabled>View all {openJobs.length} jobs</Button>
                </div>
              </SectionCard>

              <Card className="border-brand/20 bg-brand/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <Globe className="h-5 w-5 text-brand" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Visit website</p>
                    <p className="text-xs text-muted-foreground truncate">{employer.website}</p>
                  </div>
                  <Button size="sm" variant="outline" disabled>Visit</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Admin view */}
        <TabsContent value="admin" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Branding score" value={`${brandingScore}/100`} hint="Above industry avg (71)" tone="brand" icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
            <StatCard label="Profile views (30d)" value="4,128" delta={{ value: "+18%", positive: true }} icon={<Eye className="h-5 w-5" />} />
            <StatCard label="Followers" value={employer.followerCount.toLocaleString()} delta={{ value: "+312", positive: true }} icon={<Heart className="h-5 w-5" />} />
          </div>

          <SectionCard title="Branding score meter" description="How complete and compelling your profile is to candidates">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">Overall score</span>
                  <span className="text-2xl font-semibold text-brand">{brandingScore}/100</span>
                </div>
                <Progress value={brandingScore} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Needs work</span><span>Good</span><span>Excellent</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Profiles above 80 typically receive 3× more applicant saves. You're close — focus on the tips below.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { l: "Company description", v: 100 },
                  { l: "Logo & cover", v: 100 },
                  { l: "Culture video", v: 0 },
                  { l: "Benefits listed", v: 60 },
                  { l: "Office photos", v: 40 },
                  { l: "Testimonials", v: 20 },
                ].map((m) => (
                  <div key={m.l} className="rounded-md border p-2">
                    <p className="truncate text-muted-foreground">{m.l}</p>
                    <p className={`text-sm font-semibold ${m.v >= 80 ? "text-emerald-600" : m.v >= 40 ? "text-amber-600" : "text-rose-600"}`}>{m.v}%</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Tips to improve your employer brand" description="High-impact actions ranked by priority">
            <div className="space-y-2">
              {TIPS.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-md border p-3">
                  <div className="mt-0.5 rounded-full bg-brand/10 p-1.5"><Lightbulb className="h-3.5 w-3.5 text-brand" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{t.title}</p>
                      <Badge variant={t.priority === "High" ? "default" : "secondary"} className={t.priority === "High" ? "bg-brand/10 text-brand border-brand/20" : ""}>{t.priority} priority</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Opening editor for: ${t.title}`)}>Improve</Button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Preview notes" description="What's hidden from candidates">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-brand" /> Internal metrics (views, conversion, source breakdown) are hidden from candidates.</li>
              <li className="flex items-center gap-2"><Video className="h-4 w-4 text-brand" /> Drafted but unpublished jobs are not visible publicly.</li>
              <li className="flex items-center gap-2"><Users className="h-4 w-4 text-brand" /> Team member rosters and roles are private to your organization.</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" /> Verification badges only appear after jobson.id confirms legal entity.</li>
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
