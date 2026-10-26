"use client";

import * as React from "react";
import {
  individualLearners,
  learnerCertificates,
  learnerCourseEnrollments,
  sourcingRequests,
  trainingCourses,
} from "@/lib/lms-data";
import type { IndividualLearner } from "@/lib/lms-data";
import { useNav } from "@/lib/store";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, MatchScore, EmptyState,
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";
import { TenantDisclaimer, SimulatedAiBadge } from "./_shared";
import { toast } from "sonner";
import {
  Search, Sparkles, MapPin, Briefcase, Award, Plus, Send, Star, Clock,
  Github, Linkedin, Globe, Brain, ShieldCheck, Crown, TrendingUp, Filter,
} from "lucide-react";

// ---------- helpers ----------

const SKILL_OPTIONS = Array.from(
  new Set(individualLearners.flatMap((l) => l.skills.map((s) => s.name))),
).sort();

const CERT_OPTIONS = Array.from(
  new Set(learnerCertificates.map((c) => c.courseName)),
).sort();

const LOCATIONS = Array.from(new Set(individualLearners.map((l) => l.location.split(",")[0]))).sort();

// Simulated match score — deterministic per (learner, request) pair
function computeMatchScore(learner: IndividualLearner, skills: string[], certs: string[], expMin: number): number {
  let score = 50;
  const learnerSkillNames = learner.skills.map((s) => s.name);
  const skillHits = skills.filter((s) => learnerSkillNames.includes(s)).length;
  if (skills.length > 0) score += (skillHits / skills.length) * 30;
  const learnerCerts = learnerCertificates
    .filter((c) => c.learnerId === learner.id)
    .map((c) => c.courseName);
  const certHits = certs.filter((c) => learnerCerts.some((lc) => lc.startsWith(c.slice(0, 12)))).length;
  if (certs.length > 0) score += (certHits / certs.length) * 15;
  if (learner.experience >= expMin) score += 5;
  if (learner.openToWork) score += 5;
  // small deterministic jitter from id hash
  const hash = learner.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  score += (hash % 5);
  return Math.max(35, Math.min(99, Math.round(score)));
}

interface ParsedQuery {
  skills: string[];
  location?: string;
  openToWorkOnly: boolean;
  explanation: string;
}

// Simulated NL parser — recognises skill keywords, location keywords, "open to work" phrases
function parseNaturalQuery(q: string): ParsedQuery {
  const lower = q.toLowerCase();
  const foundSkills: string[] = [];
  for (const s of SKILL_OPTIONS) {
    if (lower.includes(s.toLowerCase())) foundSkills.push(s);
  }
  // common aliases
  if (lower.includes("frontend") || lower.includes("react dev")) {
    if (!foundSkills.includes("React")) foundSkills.push("React");
  }
  if (lower.includes("devops") || lower.includes("cka")) {
    ["Kubernetes", "AWS", "Terraform"].forEach((s) => { if (!foundSkills.includes(s)) foundSkills.push(s); });
  }
  if (lower.includes("ml engineer") || lower.includes("machine learning")) {
    ["Python", "Machine Learning", "MLOps"].forEach((s) => { if (!foundSkills.includes(s)) foundSkills.push(s); });
  }
  if (lower.includes("security") || lower.includes("compliance")) {
    ["Information Security", "DPDP Act", "ISO 27001"].forEach((s) => { if (!foundSkills.includes(s)) foundSkills.push(s); });
  }
  let location: string | undefined;
  for (const l of LOCATIONS) {
    if (lower.includes(l.toLowerCase())) { location = l; break; }
  }
  // city aliases
  if (lower.includes("bangalore") || lower.includes("bengaluru")) location = "Bengaluru";
  if (lower.includes("bombay") || lower.includes("mumbai")) location = "Mumbai";
  if (lower.includes("madras") || lower.includes("chennai")) location = "Chennai";
  if (lower.includes("delhi") || lower.includes("ncr")) location = "Delhi NCR";
  if (lower.includes("hyd")) location = "Hyderabad";

  const openToWorkOnly = lower.includes("open to work") || lower.includes("open-to-work") || lower.includes("looking for") || lower.includes("actively seeking");

  const parts: string[] = [];
  if (foundSkills.length) parts.push(`skills: ${foundSkills.join(", ")}`);
  if (location) parts.push(`location: ${location}`);
  if (openToWorkOnly) parts.push("open-to-work only");

  return {
    skills: foundSkills,
    location,
    openToWorkOnly,
    explanation: parts.length ? `Parsed → ${parts.join("; ")}` : "No structured filters extracted — showing all certified learners.",
  };
}

// ---------- main page ----------

export function TrainingTalentSearch() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState("all");
  const [expRange, setExpRange] = React.useState<number[]>([0, 15]);
  const [openToWorkOnly, setOpenToWorkOnly] = React.useState(false);
  const [minMatch, setMinMatch] = React.useState(0);
  const [aiQuery, setAiQuery] = React.useState("");
  const [aiParsed, setAiParsed] = React.useState<ParsedQuery | null>(null);
  const [aiThinking, setAiThinking] = React.useState(false);
  const [detail, setDetail] = React.useState<IndividualLearner | null>(null);
  const [submitTarget, setSubmitTarget] = React.useState<IndividualLearner | null>(null);
  const [submitRequest, setSubmitRequest] = React.useState<string>("");

  function toggleSkill(s: string) {
    setSelectedSkills((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  }
  function toggleCert(c: string) {
    setSelectedCerts((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  }

  function runAiSearch() {
    if (!aiQuery.trim()) {
      toast.error("Enter a search query first");
      return;
    }
    setAiThinking(true);
    setAiParsed(null);
    setTimeout(() => {
      const parsed = parseNaturalQuery(aiQuery);
      setAiParsed(parsed);
      if (parsed.skills.length) setSelectedSkills(parsed.skills);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.openToWorkOnly) setOpenToWorkOnly(true);
      setAiThinking(false);
      toast.success("AI query parsed", { description: parsed.explanation });
    }, 700);
  }

  // For match score: we use first open sourcing request skills/certs as a
  // "default profile" if no filters chosen — gives meaningful scores.
  const defaultRequest = sourcingRequests[0];
  const matchSkills = selectedSkills.length ? selectedSkills : defaultRequest.skillsRequired;
  const matchCerts = selectedCerts.length ? selectedCerts : defaultRequest.certificationsRequired;
  const matchExpMin = expRange[0];

  const filtered = individualLearners.filter((l) => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.headline.toLowerCase().includes(search.toLowerCase()) ||
      l.jobTitle.toLowerCase().includes(search.toLowerCase());
    const hasAllSkills = selectedSkills.length === 0 || selectedSkills.every((s) => l.skills.some((ls) => ls.name === s));
    const hasAllCerts = selectedCerts.length === 0 || selectedCerts.every((c) => {
      const learnerCerts = learnerCertificates.filter((lc) => lc.learnerId === l.id).map((lc) => lc.courseName);
      return learnerCerts.some((lc) => lc.startsWith(c.slice(0, 12)));
    });
    const matchLocation = location === "all" || l.location.startsWith(location);
    const matchExp = l.experience >= expRange[0] && l.experience <= expRange[1];
    const matchOpen = !openToWorkOnly || l.openToWork;
    return matchSearch && hasAllSkills && hasAllCerts && matchLocation && matchExp && matchOpen;
  }).map((l) => ({
    learner: l,
    score: computeMatchScore(l, matchSkills, matchCerts, matchExpMin),
  })).filter((x) => x.score >= minMatch).sort((a, b) => b.score - a.score);

  const openToWorkCount = individualLearners.filter((l) => l.openToWork).length;
  const certifiedCount = individualLearners.filter((l) => l.certificatesEarned > 0).length;
  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s, x) => s + x.score, 0) / filtered.length) : 0;

  function addToPool(l: IndividualLearner) {
    toast.success(`${l.name} added to talent pool`, {
      description: "Open Talent Pools to manage curated shortlists.",
    });
    setDetail(null);
    setTimeout(() => navigate("training", "talent-pools"), 600);
  }

  function submitToRequest(l: IndividualLearner, requestId: string) {
    const req = sourcingRequests.find((r) => r.id === requestId);
    if (!req) {
      toast.error("Select a sourcing request first");
      return;
    }
    toast.success(`${l.name} submitted to ${req.employerName}`, {
      description: `Role: ${req.role} · commission ${req.commissionPerPlacement ? `₹${req.commissionPerPlacement.toLocaleString("en-IN")}` : "—"}`,
    });
    setSubmitTarget(null);
    setSubmitRequest("");
    setDetail(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Talent Search"
        description="Search SkillForge's certified learner pool and match candidates to open employer requests. Recruiter & placement team view."
        icon={<Search className="h-6 w-6" />}
        actions={[{ label: "Talent pools", icon: "Database", variant: "outline", onClick: () => navigate("training", "talent-pools") }]}
      />
      <TenantDisclaimer />

      {/* KPI row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Certified learners" value={certifiedCount} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" hint={`of ${individualLearners.length} in pool`} />
        <StatCard label="Open to work" value={openToWorkCount} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Matching results" value={filtered.length} icon={<Search className="h-5 w-5" />} hint="after filters" />
        <StatCard label="Avg match score" value={avgScore || "—"} icon={<TrendingUp className="h-5 w-5" />} tone={avgScore >= 75 ? "success" : "warning"} />
      </div>

      {/* AI natural-language search */}
      <SectionCard
        title="AI natural-language search"
        description="Describe the candidate you need in plain English — we'll extract skills, location, and intent. Premium feature."
        action={<SimulatedAiBadge />}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="ai-q">Query</Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand" />
              <Input
                id="ai-q"
                placeholder='e.g. "React developers in Bangalore open to work"'
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => { if (e.key === "Enter") runAiSearch(); }}
              />
            </div>
          </div>
          <Button onClick={runAiSearch} disabled={aiThinking} className="shrink-0">
            <Brain className="mr-2 h-4 w-4" />
            {aiThinking ? "Parsing…" : "Run AI search"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Try: <code className="rounded bg-muted px-1">DevOps engineer with CKA in Hyderabad</code> · <code className="rounded bg-muted px-1">ML engineer open to work</code> · <code className="rounded bg-muted px-1">security analyst DPDP</code>
        </p>
        {aiParsed && (
          <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
            <p className="font-medium text-amber-700 dark:text-amber-400">{aiParsed.explanation}</p>
          </div>
        )}
      </SectionCard>

      {/* Filters */}
      <SectionCard title="Filters" description="Refine the certified learner pool" action={<Filter className="h-4 w-4 text-muted-foreground" />}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 max-w-md">
              <Label htmlFor="search">Keyword search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Name, headline, role…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="mt-1 w-[180px]"><SelectValue placeholder="Any location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch checked={openToWorkOnly} onCheckedChange={setOpenToWorkOnly} id="otw" />
              <Label htmlFor="otw" className="cursor-pointer">Open to work only</Label>
            </div>
          </div>

          {/* Skills chips */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Skills (must have all)</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SKILL_OPTIONS.map((s) => {
                const active = selectedSkills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-card hover:border-brand/40 hover:bg-brand/5"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certifications chips */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Certifications (must have all)</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CERT_OPTIONS.map((c) => {
                const active = selectedCerts.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCert(c)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-card hover:border-brand/40 hover:bg-brand/5"
                    }`}
                  >
                    <Award className="mr-1 inline h-3 w-3" />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <Label>Experience range</Label>
                <span className="text-xs text-muted-foreground">{expRange[0]}–{expRange[1]} yrs</span>
              </div>
              <Slider
                value={expRange}
                min={0}
                max={15}
                step={1}
                onValueChange={setExpRange}
                className="mt-3"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Min match score</Label>
                <span className="text-xs text-muted-foreground">≥ {minMatch}</span>
              </div>
              <Slider
                value={[minMatch]}
                min={0}
                max={95}
                step={5}
                onValueChange={(v) => setMinMatch(v[0])}
                className="mt-3"
              />
            </div>
          </div>

          {(selectedSkills.length > 0 || selectedCerts.length > 0 || location !== "all" || openToWorkOnly || search || minMatch > 0 || expRange[0] > 0 || expRange[1] < 15) && (
            <Button variant="ghost" size="sm" onClick={() => {
              setSearch(""); setSelectedSkills([]); setSelectedCerts([]); setLocation("all");
              setExpRange([0, 15]); setOpenToWorkOnly(false); setMinMatch(0); setAiParsed(null); setAiQuery("");
            }}>
              Clear all filters
            </Button>
          )}
        </div>
      </SectionCard>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="No candidates match"
          description="Try widening filters — fewer required skills, broader location, or lower the min match score."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ learner, score }) => (
            <CandidateCard
              key={learner.id}
              learner={learner}
              score={score}
              onOpen={() => setDetail(learner)}
              onAddToPool={() => addToPool(learner)}
              onSubmit={() => { setSubmitTarget(learner); setSubmitRequest(sourcingRequests.find((r) => r.status === "open" || r.status === "in_progress")?.id ?? ""); }}
            />
          ))}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <CandidateDetail learner={detail} score={computeMatchScore(detail, matchSkills, matchCerts, matchExpMin)} onAddToPool={() => addToPool(detail)} onSubmit={() => { setSubmitTarget(detail); setSubmitRequest(sourcingRequests.find((r) => r.status === "open" || r.status === "in_progress")?.id ?? ""); }} />}
        </SheetContent>
      </Sheet>

      {/* Submit to request dialog (using Sheet as lightweight modal) */}
      <Sheet open={!!submitTarget} onOpenChange={(o) => !o && setSubmitTarget(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Submit candidate to request</SheetTitle>
            <SheetDescription>
              {submitTarget && `Submit ${submitTarget.name} to an open sourcing request. The partner client will review.`}
            </SheetDescription>
          </SheetHeader>
          {submitTarget && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                <AvatarLogo text={submitTarget.name} size="md" />
                <div>
                  <p className="text-sm font-medium">{submitTarget.name}</p>
                  <p className="text-xs text-muted-foreground">{submitTarget.headline}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="req-pick">Sourcing request</Label>
                <Select value={submitRequest} onValueChange={setSubmitRequest}>
                  <SelectTrigger id="req-pick"><SelectValue placeholder="Select a request" /></SelectTrigger>
                  <SelectContent>
                    {sourcingRequests.filter((r) => r.status === "open" || r.status === "in_progress").map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title} — {r.employerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {submitRequest && (() => {
                const r = sourcingRequests.find((x) => x.id === submitRequest);
                if (!r) return null;
                const score = computeMatchScore(submitTarget, r.skillsRequired, r.certificationsRequired, r.experienceMin);
                return (
                  <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Match score for this request</span>
                      <span className={`font-bold ${score >= 80 ? "text-emerald-600" : score >= 65 ? "text-amber-600" : "text-rose-600"}`}>{score}/100</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">Commission on placement: {r.commissionPerPlacement ? `₹${r.commissionPerPlacement.toLocaleString("en-IN")}` : "—"}</p>
                  </div>
                );
              })()}
            </div>
          )}
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setSubmitTarget(null)}>Cancel</Button>
            <Button
              disabled={!submitRequest}
              onClick={() => submitTarget && submitToRequest(submitTarget, submitRequest)}
            >
              <Send className="mr-2 h-4 w-4" /> Submit candidate
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- subcomponents ----------

function CandidateCard({
  learner, score, onOpen, onAddToPool, onSubmit,
}: {
  learner: IndividualLearner;
  score: number;
  onOpen: () => void;
  onAddToPool: () => void;
  onSubmit: () => void;
}) {
  return (
    <Card className="flex flex-col p-4 transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <AvatarLogo text={learner.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button onClick={onOpen} className="truncate font-semibold hover:text-brand hover:underline">
              {learner.name}
            </button>
            {learner.plan === "premium" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
          </div>
          <p className="truncate text-xs text-muted-foreground">{learner.headline}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{learner.location}</span>
            <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{learner.experience}y exp</span>
          </div>
        </div>
        <MatchScore score={score} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {learner.skills.slice(0, 4).map((s) => (
          <Badge key={s.name} variant="outline" className="text-[10px]">
            {s.name}
            {s.verified && <ShieldCheck className="ml-1 h-2.5 w-2.5 text-emerald-500" />}
          </Badge>
        ))}
        {learner.skills.length > 4 && <Badge variant="outline" className="text-[10px]">+{learner.skills.length - 4}</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" />{learner.certificatesEarned} certs</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{learner.learningHours}h</span>
        <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />Lvl {learner.level}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {learner.openToWork ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Open to work
          </span>
        ) : <span className="text-[10px] text-muted-foreground">Not seeking</span>}
        <div className="flex gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={onAddToPool} className="h-7 w-7 p-0">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to talent pool</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button size="sm" variant="default" onClick={onSubmit} className="h-7 px-2.5 text-xs">
            <Send className="mr-1 h-3 w-3" /> Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CandidateDetail({
  learner, score, onAddToPool, onSubmit,
}: {
  learner: IndividualLearner;
  score: number;
  onAddToPool: () => void;
  onSubmit: () => void;
}) {
  const certs = learnerCertificates.filter((c) => c.learnerId === learner.id);
  const enrollments = learnerCourseEnrollments.filter((e) => e.learnerId === learner.id);
  const completedCourses = enrollments.filter((e) => e.status === "completed");

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={learner.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg">{learner.name}</SheetTitle>
              {learner.plan === "premium" && <Crown className="h-4 w-4 text-amber-500" />}
              {learner.openToWork && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Open to work
                </span>
              )}
            </div>
            <SheetDescription>{learner.headline}</SheetDescription>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{learner.location}</span>
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{learner.jobTitle} · {learner.experience}y exp</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{learner.points} pts · Lvl {learner.level}</span>
            </div>
          </div>
          <MatchScore score={score} className="h-12 w-12" />
        </div>
      </SheetHeader>

      <div className="mt-5 space-y-5">
        <p className="text-sm">{learner.bio}</p>

        {/* Skills with levels */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</h4>
          <div className="space-y-2">
            {learner.skills.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-32 shrink-0 truncate text-sm font-medium">{s.name}</div>
                <div className="flex-1">
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="bg-brand" style={{ width: `${(s.level / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="w-28 text-right text-xs text-muted-foreground">
                  Lvl {s.level}/5 {s.verified && <ShieldCheck className="ml-1 inline h-3 w-3 text-emerald-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certificates ({certs.length})</h4>
          {certs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No certificates earned yet.</p>
          ) : (
            <div className="space-y-2">
              {certs.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.courseName}</p>
                    <p className="text-xs text-muted-foreground">
                      Issued {new Date(c.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · Score {c.score}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed courses */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Courses completed ({completedCourses.length})</h4>
          {completedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed courses yet.</p>
          ) : (
            <div className="space-y-1.5">
              {completedCourses.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
                  <span className="truncate">{c.courseName}</span>
                  <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                    {c.score ? `${c.score}% · ` : ""}{Math.round(c.timeSpentMinutes / 60)}h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xl font-semibold">{learner.learningHours}</p>
            <p className="text-xs text-muted-foreground">learning hours</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-semibold">{learner.certificatesEarned}</p>
            <p className="text-xs text-muted-foreground">certificates</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-semibold">{learner.streak}</p>
            <p className="text-xs text-muted-foreground">day streak</p>
          </Card>
        </div>

        {/* Links */}
        {learner.links && (learner.links.github || learner.links.linkedin || learner.links.portfolio) && (
          <div className="flex flex-wrap gap-2">
            {learner.links.github && <Button size="sm" variant="outline" onClick={() => toast.info(`Opening ${learner.links!.github}`)}><Github className="mr-1 h-3.5 w-3.5" /> GitHub</Button>}
            {learner.links.linkedin && <Button size="sm" variant="outline" onClick={() => toast.info(`Opening ${learner.links!.linkedin}`)}><Linkedin className="mr-1 h-3.5 w-3.5" /> LinkedIn</Button>}
            {learner.links.portfolio && <Button size="sm" variant="outline" onClick={() => toast.info(`Opening ${learner.links!.portfolio}`)}><Globe className="mr-1 h-3.5 w-3.5" /> Portfolio</Button>}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button onClick={onAddToPool}><Plus className="mr-2 h-4 w-4" /> Add to talent pool</Button>
          <Button variant="default" onClick={onSubmit}><Send className="mr-2 h-4 w-4" /> Submit to request</Button>
        </div>
      </div>
    </>
  );
}
