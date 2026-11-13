"use client";

import * as React from "react";
import {
  Search, Sparkles, MapPin, Briefcase, Award, Send, X, Crown,
  CheckCircle2, Star,
} from "lucide-react";
import { PageHeader, SectionCard, EmptyState, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { candidateProfiles } from "@/lib/mock-data";
import { openings } from "@/lib/partner-data";
import type { CandidateProfile } from "@/lib/types";

interface SearchResult {
  candidate: CandidateProfile;
  match: number;
  reasons: string[];
  premium: boolean;
}

const ALL_SKILLS = Array.from(new Set(candidateProfiles.flatMap((c) => c.skills.map((s) => s.skill)))).sort();
const ALL_LOCATIONS = Array.from(new Set(candidateProfiles.map((c) => c.location.split(",")[0]))).sort();
const ALL_CERTS = Array.from(new Set(candidateProfiles.flatMap((c) => c.certifications))).sort();

// Simulated AI parser — converts natural language to filters
function parseNLQuery(query: string): { skills: string[]; location?: string; minExp?: number; explanation: string } {
  const q = query.toLowerCase();
  const skills = ALL_SKILLS.filter((s) => q.includes(s.toLowerCase()));
  const location = ALL_LOCATIONS.find((l) => q.includes(l.toLowerCase()));
  const expMatch = q.match(/(\d+)\+?\s*(?:years?|yrs?)/);
  const minExp = expMatch ? parseInt(expMatch[1]) : undefined;

  const parts: string[] = [];
  if (skills.length > 0) parts.push(`Skills: ${skills.join(", ")}`);
  if (location) parts.push(`Location: ${location}`);
  if (minExp) parts.push(`Min experience: ${minExp} years`);
  if (parts.length === 0) parts.push("No structured filters extracted — falling back to keyword match across headline, summary, and skills.");

  return { skills, location, minExp, explanation: parts.join(" • ") };
}

export function RecruiterNetworkSourcing() {
  const [nlQuery, setNlQuery] = React.useState("");
  const [parsedExplanation, setParsedExplanation] = React.useState<string | null>(null);
  const [skillFilter, setSkillFilter] = React.useState<string[]>([]);
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [certFilter, setCertFilter] = React.useState("all");
  const [expRange, setExpRange] = React.useState<[number, number]>([0, 15]);
  const [openToWorkOnly, setOpenToWorkOnly] = React.useState(false);
  const [premiumOnly, setPremiumOnly] = React.useState(false);
  const [submitTarget, setSubmitTarget] = React.useState<{ candidate: CandidateProfile; match: number } | null>(null);

  const runAISearch = () => {
    if (!nlQuery.trim()) {
      toast.error("Enter a natural language query first");
      return;
    }
    const parsed = parseNLQuery(nlQuery);
    setParsedExplanation(parsed.explanation);
    if (parsed.skills.length > 0) setSkillFilter(parsed.skills);
    if (parsed.location) setLocationFilter(parsed.location);
    if (parsed.minExp) setExpRange([parsed.minExp, 15]);
    toast.success("Simulated AI parsed your query", {
      description: parsed.explanation,
    });
  };

  const results: SearchResult[] = React.useMemo(() => {
    return candidateProfiles
      .map((c) => {
        // Filter
        if (skillFilter.length > 0) {
          const hasAll = skillFilter.every((s) => c.skills.some((cs) => cs.skill === s));
          if (!hasAll) return null;
        }
        if (locationFilter !== "all" && !c.location.includes(locationFilter)) return null;
        if (certFilter !== "all" && !c.certifications.includes(certFilter)) return null;
        if (c.experienceYears < expRange[0] || c.experienceYears > expRange[1]) return null;
        if (openToWorkOnly && !c.openToWork) return null;
        // Match score (simulated)
        const skillMatch = skillFilter.length > 0
          ? (skillFilter.filter((s) => c.skills.some((cs) => cs.skill === s)).length / skillFilter.length) * 60
          : 40;
        const expMatch = expRange[1] > 0 && c.experienceYears >= expRange[0] ? 20 : 10;
        const locMatch = locationFilter !== "all" ? 15 : 5;
        const certMatch = certFilter !== "all" && c.certifications.includes(certFilter) ? 10 : 5;
        const noise = (c.id.charCodeAt(2) % 10); // deterministic noise
        const match = Math.min(99, Math.round(skillMatch + expMatch + locMatch + certMatch + noise));
        const reasons: string[] = [];
        if (skillFilter.length > 0) reasons.push(`Matches ${skillFilter.filter((s) => c.skills.some((cs) => cs.skill === s)).length}/${skillFilter.length} required skills`);
        if (c.openToWork) reasons.push("Open to work");
        if (c.certifications.length > 0) reasons.push(`${c.certifications.length} certification(s)`);
        reasons.push(`${c.experienceYears} yrs experience`);
        if (c.noticePeriodDays) reasons.push(`${c.noticePeriodDays}d notice`);
        const premium = match >= 80 && c.profileCompleteness >= 80;
        return { candidate: c, match, reasons, premium };
      })
      .filter((r): r is SearchResult => r !== null)
      .sort((a, b) => b.match - a.match);
  }, [skillFilter, locationFilter, certFilter, expRange, openToWorkOnly]);

  const premiumCount = results.filter((r) => r.premium).length;

  const toggleSkill = (s: string) => {
    setSkillFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const clearFilters = () => {
    setSkillFilter([]); setLocationFilter("all"); setCertFilter("all");
    setExpRange([0, 15]); setOpenToWorkOnly(false); setPremiumOnly(false);
    setParsedExplanation(null); setNlQuery("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network sourcing"
        description="AI-powered candidate search across the jobson.id network. Submit matched candidates to any active mandate."
        actions={[]}
      />

      {/* AI search */}
      <SectionCard
        title="AI natural language search"
        description="Describe your ideal candidate in plain English. The system parses your query into structured filters."
        action={
          <Badge variant="outline" className="text-[10px] border-brand/40 text-brand"><Sparkles className="h-3 w-3" /> Simulated AI</Badge>
        }
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand" />
            <Input
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAISearch()}
              placeholder="e.g. Senior React engineers in Bengaluru with 5+ years and AWS certification"
              className="pl-9"
            />
          </div>
          <Button onClick={runAISearch}><Sparkles className="h-4 w-4" /> Run AI search</Button>
        </div>
        {parsedExplanation && (
          <div className="mt-3 rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs">
            <p className="font-medium text-brand flex items-center gap-1"><Sparkles className="h-3 w-3" /> Parsed query:</p>
            <p className="text-muted-foreground mt-1">{parsedExplanation}</p>
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Filters sidebar */}
        <SectionCard title="Filters" action={
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
            <X className="h-3 w-3" /> Clear
          </Button>
        }>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Skills</Label>
              <div className="mt-2 flex flex-wrap gap-1 max-h-32 overflow-y-auto scroll-thin">
                {ALL_SKILLS.slice(0, 20).map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={`text-[10px] rounded-full border px-2 py-0.5 transition-colors ${skillFilter.includes(s) ? "bg-brand text-white border-brand" : "border-border text-muted-foreground hover:border-brand"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="mt-1 h-8"><SelectValue placeholder="All locations" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {ALL_LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Certifications</Label>
              <Select value={certFilter} onValueChange={setCertFilter}>
                <SelectTrigger className="mt-1 h-8"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any certification</SelectItem>
                  {ALL_CERTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs flex items-center justify-between">
                Experience <span className="text-muted-foreground">{expRange[0]}–{expRange[1]} yrs</span>
              </Label>
              <Slider
                value={expRange}
                min={0}
                max={15}
                step={1}
                onValueChange={(v) => setExpRange([v[0], v[1]] as [number, number])}
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2.5">
              <div>
                <Label className="text-xs cursor-pointer">Open to work only</Label>
                <p className="text-[10px] text-muted-foreground">Actively looking</p>
              </div>
              <Switch checked={openToWorkOnly} onCheckedChange={setOpenToWorkOnly} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2.5">
              <div>
                <Label className="text-xs cursor-pointer flex items-center gap-1"><Crown className="h-3 w-3 text-amber-500" /> Premium only</Label>
                <p className="text-[10px] text-muted-foreground">Top 20% matches</p>
              </div>
              <Switch checked={premiumOnly} onCheckedChange={setPremiumOnly} />
            </div>
          </div>
        </SectionCard>

        {/* Results */}
        <SectionCard
          title={`${results.length} candidates found`}
          description={skillFilter.length > 0 || locationFilter !== "all" ? `Filters active: ${[...skillFilter, locationFilter !== "all" ? locationFilter : ""].filter(Boolean).join(", ")}` : "Showing all candidates in the jobson.id network."}
          action={
            premiumCount > 0 ? <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400"><Crown className="h-3 w-3" /> {premiumCount} premium</Badge> : undefined
          }
        >
          {results.length === 0 ? (
            <EmptyState icon={<Search className="h-5 w-5" />} title="No matches" description="Try widening your filters or rephrasing your AI query." />
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto scroll-thin pr-1">
              {results.filter((r) => !premiumOnly || r.premium).map((r) => (
                <CandidateResultCard
                  key={r.candidate.id}
                  result={r}
                  onSubmit={() => setSubmitTarget({ candidate: r.candidate, match: r.match })}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SubmitToMandateDialog
        target={submitTarget}
        onOpenChange={(v) => !v && setSubmitTarget(null)}
        onSubmit={(jobId) => {
          if (submitTarget) {
            const job = openings.find((o) => o.id === jobId);
            toast.success(`${submitTarget.candidate.name} submitted to ${job?.title ?? "mandate"}`, {
              description: `Match score: ${submitTarget.match}%`,
            });
          }
          setSubmitTarget(null);
        }}
      />
    </div>
  );
}

function CandidateResultCard({
  result, onSubmit,
}: {
  result: SearchResult;
  onSubmit: () => void;
}) {
  const { candidate: c, match, reasons, premium } = result;
  return (
    <div className={`rounded-lg border p-4 hover:shadow-md transition-all ${premium ? "border-amber-500/40 bg-amber-500/5" : "bg-card"}`}>
      <div className="flex items-start gap-3">
        <AvatarLogo text={c.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">{c.name}</p>
                {premium && <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400"><Crown className="h-3 w-3" /> Premium</Badge>}
                {c.openToWork && <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Open to work</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{c.headline}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" /> {c.location}</span>
                <span className="flex items-center gap-0.5"><Briefcase className="h-2.5 w-2.5" /> {c.experienceYears} yrs</span>
                {c.currentCompany && <span>• {c.currentCompany}</span>}
              </p>
            </div>
            <MatchScore score={match} />
          </div>
          {/* Skills */}
          <div className="mt-2 flex flex-wrap gap-1">
            {c.skills.slice(0, 6).map((s) => (
              <Badge key={s.skill} variant="outline" className="text-[10px] h-5 px-1.5">
                {s.skill}
                {s.verified && <CheckCircle2 className="h-2.5 w-2.5 ml-0.5 text-emerald-500" />}
              </Badge>
            ))}
          </div>
          {/* Certifications */}
          {c.certifications.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {c.certifications.slice(0, 3).map((cert) => (
                <Badge key={cert} variant="outline" className="text-[9px] h-4 px-1 border-violet-500/30 text-violet-600 dark:text-violet-400">
                  <Award className="h-2.5 w-2.5" /> {cert}
                </Badge>
              ))}
            </div>
          )}
          {/* Match reasons */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
            {reasons.map((r, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 text-brand" /> {r}
              </span>
            ))}
          </div>
          {/* Salary expectation */}
          {c.expectedSalary && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Expected: <span className="font-medium text-foreground">{formatCurrency(c.expectedSalary, c.expectedCurrency as Currency)}</span>
              {c.noticePeriodDays && <> • Notice: {c.noticePeriodDays}d</>}
            </p>
          )}
          {/* Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onSubmit}><Send className="h-3.5 w-3.5" /> Submit to mandate</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success(`Saved ${c.name} to hotlist`)}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => toast.success("Profile opened")}>View profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitToMandateDialog({
  target, onOpenChange, onSubmit,
}: {
  target: { candidate: CandidateProfile; match: number } | null;
  onOpenChange: (v: boolean) => void;
  onSubmit: (jobId: string) => void;
}) {
  const [jobId, setJobId] = React.useState("");
  const [note, setNote] = React.useState("");
  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit to mandate</DialogTitle>
          <DialogDescription>
            {target && <>Submit <strong>{target.candidate.name}</strong> ({target.match}% match) to an active opening.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Select opening</Label>
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger><SelectValue placeholder="Choose an opening" /></SelectTrigger>
              <SelectContent>
                {openings.filter((o) => o.status === "open").map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.title} — {o.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Submission note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why this candidate is a great fit…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => jobId && onSubmit(jobId)} disabled={!jobId}>
            <Send className="h-4 w-4 mr-1" /> Submit candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
