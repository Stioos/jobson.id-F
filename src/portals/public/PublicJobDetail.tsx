"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNav } from "@/lib/store";
import { jobs, employers } from "@/lib/mock-data";
import type { Job, ScreeningQuestion } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber, timeAgo } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin, Briefcase, Clock, Users, Eye, Share2, Flag, Building2,
  CheckCircle2, AlertCircle, Sparkles, Star, ArrowRight, ArrowLeft,
  Wallet, Calendar, ShieldCheck, Copy, BookmarkPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export function PublicJobDetail({ id }: { id: string }) {
  const { navigate } = useNav();
  const job = React.useMemo(() => jobs.find((j) => j.id === id || j.slug === id) ?? null, [id]);
  const [applyOpen, setApplyOpen] = React.useState(false);

  // Salary distribution mini-chart (simulated around this job's band)
  // NOTE: must run before any early return to satisfy rules-of-hooks.
  const salaryData = React.useMemo(() => {
    if (!job) return [];
    const base = job.salaryMin;
    const cap = job.salaryMax;
    const span = cap - base;
    return [
      { label: "P25", value: Math.round(base + span * 0.15) },
      { label: "Median", value: Math.round(base + span * 0.5) },
      { label: "P75", value: Math.round(base + span * 0.75) },
      { label: "This job", value: Math.round((base + cap) / 2) },
    ];
  }, [job]);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title="Job not found"
          description="This job may have been removed or the link is incorrect."
          action={<Button onClick={() => navigate("public", "jobs")}><ArrowLeft className="mr-1 h-4 w-4" /> Back to jobs</Button>}
        />
      </div>
    );
  }

  const employer = employers.find((e) => e.id === job.employerId);
  const similarJobs = jobs
    .filter((j) => j.id !== job.id && j.category === job.category && j.status === "published")
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("public", "jobs")}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </button>

      {/* HEADER CARD */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <AvatarLogo text={job.employerName} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {job.featured && <Badge className="bg-brand/10 text-brand">Featured</Badge>}
                {job.urgent && <Badge variant="destructive" className="bg-rose-500/10 text-rose-600">Urgent hiring</Badge>}
                {job.sponsored && <Badge variant="secondary">Sponsored</Badge>}
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>
              <button
                onClick={() => employer && navigate("public", `companies/${employer.slug}`)}
                className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand hover:underline"
              >
                <Building2 className="h-4 w-4" />
                {job.employerName}
                {employer?.verified && <ShieldCheck className="h-3.5 w-3.5 text-brand" />}
              </button>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
                <InfoChip icon={MapPin} label="Location" value={job.location} />
                <InfoChip icon={Briefcase} label="Work mode" value={<span className="capitalize">{job.workArrangement}</span>} />
                <InfoChip icon={Calendar} label="Employment" value={<span className="capitalize">{job.employmentType.replace("-", " ")}</span>} />
                <InfoChip icon={Star} label="Experience" value={`${job.experienceMin}-${job.experienceMax} yrs`} />
                <InfoChip
                  icon={Wallet}
                  label="Salary"
                  value={job.showSalary ? `${formatCurrency(job.salaryMin, job.currency)} – ${formatCurrency(job.salaryMax, job.currency)}` : "Not disclosed"}
                />
                <InfoChip icon={Clock} label="Posted" value={timeAgo(job.postedAt)} />
                <InfoChip icon={Eye} label="Views" value={formatNumber(job.viewCount)} />
                <InfoChip icon={Users} label="Applicants" value={formatNumber(job.applicationCount)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* MAIN COLUMN */}
        <div className="space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What you&apos;ll do</CardTitle>
                  <CardDescription>Key responsibilities for this role</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What we&apos;re looking for</CardTitle>
                  <CardDescription>Required qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  {job.niceToHave.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Nice to have</h4>
                        <ul className="space-y-2">
                          {job.niceToHave.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills &amp; benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-brand/10 text-brand">{s}</Badge>
                    ))}
                  </div>
                  {job.benefits.length > 0 && (
                    <>
                      <Separator />
                      <div className="grid gap-2 sm:grid-cols-2">
                        {job.benefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screening" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Screening questions</CardTitle>
                  <CardDescription>You&apos;ll be asked these when you apply. Knockout questions must pass for your application to proceed.</CardDescription>
                </CardHeader>
                <CardContent>
                  {job.screeningQuestions.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      title="No screening questions"
                      description="This employer hasn't added screening questions — apply with your profile directly."
                    />
                  ) : (
                    <ul className="space-y-3">
                      {job.screeningQuestions.map((q, i) => (
                        <li key={q.id} className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{i + 1}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{q.question}</div>
                            <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                              <Badge variant="outline" className="capitalize">{q.type}</Badge>
                              {q.required && <Badge variant="outline" className="text-amber-600">Required</Badge>}
                              {q.knockout && <Badge variant="outline" className="text-rose-600">Knockout</Badge>}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-4">
              {employer ? (
                <Card>
                  <CardHeader>
                    <CardTitle>About {employer.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <AvatarLogo text={employer.name} size="xl" />
                      <div className="flex-1">
                        <button
                          onClick={() => navigate("public", `companies/${employer.slug}`)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                        >
                          View company profile <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                          <InfoChip icon={Building2} label="Industry" value={employer.industry} />
                          <InfoChip icon={Users} label="Size" value={employer.size} />
                          <InfoChip icon={Calendar} label="Founded" value={String(employer.founded)} />
                          <InfoChip icon={MapPin} label="HQ" value={employer.headquarters} />
                          <InfoChip icon={Star} label="Rating" value={`${employer.rating} (${formatNumber(employer.reviewCount)})`} />
                          <InfoChip icon={Users} label="Followers" value={formatNumber(employer.followerCount)} />
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{employer.about}</p>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState title="Company info unavailable" />
              )}
            </TabsContent>

            <TabsContent value="insights" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Salary insights</CardTitle>
                  <CardDescription>Simulated distribution around this role&apos;s compensation band</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salaryData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis
                          tickFormatter={(v) => formatCurrency(Number(v), job.currency)}
                          tick={{ fontSize: 11 }}
                          width={80}
                          className="text-muted-foreground"
                        />
                        <Tooltip
                          formatter={(v) => [formatCurrency(Number(v), job.currency), "Salary"]}
                          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} className="fill-brand" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Illustrative only. Band derived from this posting; not based on real reported salaries.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI fit indicator</CardTitle>
                  <CardDescription>Simulated — based on the role&apos;s required skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div className="text-sm">
                      <div className="font-medium">Strong skill match expected</div>
                      <p className="mt-1 text-muted-foreground">
                        Candidates with verified {job.skills.slice(0, 3).join(", ")} experience typically see a 75+ match score.
                        Build a complete profile to get your personal match.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate("candidate", "overview")}>
                        Get my match score
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* SIMILAR JOBS */}
          {similarJobs.length > 0 && (
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>Similar jobs in {job.category}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("public", "jobs")}>View all</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {similarJobs.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate("public", `jobs/${s.id}`)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:border-brand hover:bg-muted/30"
                  >
                    <AvatarLogo text={s.employerName} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.employerName} · {s.location}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-brand">
                        {s.showSalary ? formatCurrency(s.salaryMin, s.currency) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">{timeAgo(s.postedAt)}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Apply for this job</CardTitle>
              <CardDescription>
                {job.applicationCount} applicants so far · Posted {timeAgo(job.postedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Application deadline</span>
                  <span className="font-medium text-foreground">
                    {job.expiresAt ? formatDate(job.expiresAt) : "Open until filled"}
                  </span>
                </div>
                {job.targetHireDate && (
                  <div className="mt-1 flex items-center justify-between">
                    <span>Target hire date</span>
                    <span className="font-medium text-foreground">{formatDate(job.targetHireDate)}</span>
                  </div>
                )}
              </div>
              <ApplyDialog job={job} open={applyOpen} onOpenChange={setApplyOpen} />
              <Button
                variant="outline"
                className="w-full gap-1.5"
                onClick={() => {
                  navigator.clipboard?.writeText(typeof window !== "undefined" ? window.location.href : "");
                  toast.success("Job link copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" /> Copy link
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => toast.success("Saved to your saved jobs")}
                >
                  <BookmarkPlus className="h-4 w-4" /> Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => toast("Share dialog opened", { description: "Sharing is simulated in this demo." })}
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <Separator />
              <button
                onClick={() => toast("Report submitted", { description: "Our trust & safety team will review (simulated)." })}
                className="flex w-full items-center gap-2 text-xs text-muted-foreground hover:text-rose-600"
              >
                <Flag className="h-3.5 w-3.5" /> Report this job
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <FactRow label="Requisition ID" value={job.requisitionId ?? "—"} />
              <FactRow label="Department" value={job.department} />
              <FactRow label="Industry" value={job.industry} />
              {job.hiringManager && <FactRow label="Hiring manager" value={job.hiringManager} />}
              {job.recruiter && <FactRow label="Recruiter" value={job.recruiter} />}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

// ============================================================
// APPLY DIALOG with react-hook-form + zod
// ============================================================
function ApplyDialog({ job, open, onOpenChange }: { job: Job; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { navigate } = useNav();
  const [submitted, setSubmitted] = React.useState(false);

  // Build dynamic zod schema from screening questions
  const schema = React.useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const q of job.screeningQuestions) {
      let field: z.ZodTypeAny;
      if (q.type === "number") {
        field = z.coerce.number({ invalid_type_error: "Enter a number" });
      } else {
        field = z.string();
      }
      if (q.required) {
        field = field.refine(
          (v) => v !== "" && v !== undefined && v !== null && !(typeof v === "number" && Number.isNaN(v)),
          "This field is required"
        ) as z.ZodTypeAny;
      }
      shape[q.id] = field;
    }
    return z.object(shape);
  }, [job]);

  type FormValues = Record<string, string | number>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: job.screeningQuestions.reduce((acc, q) => {
      acc[q.id] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = (values: FormValues) => {
    // Simulate apply
    const answers = job.screeningQuestions.map((q) => ({
      question: q.question,
      answer: String(values[q.id] ?? ""),
    }));
    toast.success("Application submitted!", {
      description: `${job.employerName} will be in touch. Track your status in the candidate dashboard.`,
    });
    setSubmitted(true);
    setTimeout(() => {
      onOpenChange(false);
      setSubmitted(false);
      form.reset();
      // Stash the application intent for candidate dashboard
      try {
        sessionStorage.setItem("jobson_id_last_application", JSON.stringify({ jobId: job.id, answers, at: new Date().toISOString() }));
      } catch { /* ignore */ }
      navigate("candidate", "applications");
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setSubmitted(false); form.reset(); } }}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <Sparkles className="h-4 w-4" /> Apply now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            at {job.employerName} · Answer the screening questions below. Your profile data will be attached.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Application submitted!</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Redirecting to your applications dashboard…</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Priya Nair" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="priya.nair@gmail.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+91 99887 76655" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resume">Resume (LinkedIn or URL)</Label>
                <Input id="resume" placeholder="linkedin.com/in/priyanair" />
              </div>
            </div>

            {job.screeningQuestions.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold">Screening questions</h4>
                  <p className="text-xs text-muted-foreground">Required fields must be answered for your application to be considered.</p>
                </div>
                {job.screeningQuestions.map((q) => (
                  <ScreeningField key={q.id} q={q} form={form} />
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="cover">Cover note (optional)</Label>
              <Textarea id="cover" placeholder="Why are you a great fit for this role?" rows={3} />
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              By submitting, you consent to sharing your profile data with {job.employerName} for this application.
              You can withdraw anytime.
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="gap-1.5">
                Submit application <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScreeningField({ q, form }: { q: ScreeningQuestion; form: ReturnType<typeof useForm<Record<string, string | number>>> }) {
  const error = form.formState.errors[q.id]?.message as string | undefined;
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium">
        {q.question}
        {q.required && <span className="text-rose-500">*</span>}
        {q.knockout && <Badge variant="outline" className="text-[10px] text-rose-600">Knockout</Badge>}
      </Label>
      {q.type === "boolean" ? (
        <RadioGroup
          onValueChange={(v) => form.setValue(q.id, v, { shouldValidate: true })}
          className="flex gap-4"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="Yes" id={`${q.id}-yes`} /> Yes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="No" id={`${q.id}-no`} /> No
          </label>
        </RadioGroup>
      ) : q.type === "choice" && q.options ? (
        <ShadcnSelect
          onValueChange={(v) => form.setValue(q.id, v, { shouldValidate: true })}
        >
          <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
          <SelectContent>
            {q.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </ShadcnSelect>
      ) : (
        <Input
          type={q.type === "number" ? "number" : "text"}
          {...form.register(q.id)}
          placeholder={q.type === "number" ? "Enter a number" : "Your answer"}
        />
      )}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
