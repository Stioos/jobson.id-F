"use client";

import * as React from "react";
import { candidateProfiles } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent, EmptyState, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Search, MapPin, Briefcase, Building2, Crown, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { CandidateProfile } from "@/lib/types";

const SKILL_OPTIONS = ["React", "TypeScript", "Go", "Kubernetes", "AWS", "Python", "Product Strategy", "Figma", "Node.js", "PostgreSQL", "GraphQL"];
const LOCATIONS = ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Delhi NCR", "Chennai", "Remote"];

export function EmployerTalentSearch() {
  const [search, setSearch] = React.useState("");
  const [nlQuery, setNlQuery] = React.useState("");
  const [skillFilter, setSkillFilter] = React.useState<string[]>([]);
  const [locationFilter, setLocationFilter] = React.useState("any");
  const [expFilter, setExpFilter] = React.useState("any");
  const [companyFilter, setCompanyFilter] = React.useState("");
  const [selected, setSelected] = React.useState<CandidateProfile | null>(null);

  const results = React.useMemo(() => {
    let list = [...candidateProfiles];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.headline.toLowerCase().includes(q) || c.skills.some((s) => s.skill.toLowerCase().includes(q)));
    }
    if (skillFilter.length > 0) list = list.filter((c) => skillFilter.every((s) => c.skills.some((cs) => cs.skill === s)));
    if (locationFilter !== "any") list = list.filter((c) => c.location.toLowerCase().includes(locationFilter.toLowerCase()));
    if (expFilter !== "any") {
      const [min, max] = expFilter.split("-").map(Number);
      list = list.filter((c) => c.experienceYears >= min && c.experienceYears <= max);
    }
    if (companyFilter.trim()) {
      const q = companyFilter.toLowerCase();
      list = list.filter((c) => (c.currentCompany ?? "").toLowerCase().includes(q) || c.experience.some((e) => e.company.toLowerCase().includes(q)));
    }
    return list;
  }, [search, skillFilter, locationFilter, expFilter, companyFilter]);

  const toggleSkill = (s: string) => setSkillFilter((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const runNL = () => {
    if (!nlQuery.trim()) return;
    toast.success("Simulated AI search", {
      description: `Parsed: looking for candidates matching "${nlQuery}". Showing best matches.`,
    });
    setSearch(nlQuery);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Search"
        description="Search the JOBSONN resume database for passive candidates"
        actions={[{ label: "Premium", icon: "Crown", variant: "outline", onClick: () => toast.info("Talent Search is a premium feature included in your Enterprise plan.") }]}
      />

      {/* AI search */}
      <SectionCard title="Natural language search" description="Describe your ideal candidate in plain English">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand" />
              <Input placeholder='e.g. "Senior React engineers in Bengaluru with 5+ years experience"' value={nlQuery} onChange={(e) => setNlQuery(e.target.value)} className="pl-8" />
            </div>
            <Button onClick={runNL}><Sparkles className="mr-2 h-4 w-4" /> Search</Button>
          </div>
          <Badge variant="outline" className="text-xs">Simulated AI</Badge>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <SectionCard title="Filters">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Name, title, skill…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-1">
                  {SKILL_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${skillFilter.includes(s) ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any location</SelectItem>
                    {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Experience</Label>
                <Select value={expFilter} onValueChange={setExpFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="0-3">0-3 years</SelectItem>
                    <SelectItem value="3-6">3-6 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10-99">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Current company</Label>
                <Input placeholder="e.g. Google" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => { setSearch(""); setSkillFilter([]); setLocationFilter("any"); setExpFilter("any"); setCompanyFilter(""); }}>
                <X className="mr-2 h-3 w-3" /> Clear filters
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-3">
          <p className="text-sm text-muted-foreground">{results.length} candidates found</p>
          {results.length === 0 ? (
            <EmptyState icon={<Search className="h-5 w-5" />} title="No candidates found" description="Try broadening your search criteria." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((c) => (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AvatarLogo text={c.name} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.headline}</p>
                      </div>
                      <MatchScore score={Math.min(99, 60 + c.skills.length * 4)} />
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</p>
                      <p className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {c.experienceYears}y · {c.currentJobTitle}</p>
                      <p className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.currentCompany ?? "—"}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.skills.slice(0, 4).map((s) => <Badge key={s.skill} variant="secondary" className="text-xs font-normal">{s.skill}</Badge>)}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(c)}>View profile</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Added ${c.name} to talent pool`)}><Plus className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto scroll-thin">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={selected.name} size="lg" />
                  <div>
                    <SheetTitle className="text-left">{selected.name}</SheetTitle>
                    <SheetDescription className="text-left">{selected.headline}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <p className="text-sm">{selected.summary}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selected.location}</p>
                  <p className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {selected.experienceYears}y exp</p>
                  <p className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {selected.currentCompany}</p>
                  <p className="flex items-center gap-1">Notice: {selected.noticePeriodDays}d</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.skills.map((s) => <Badge key={s.skill} variant="secondary" className="text-xs">{s.skill} · {s.level}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Experience</p>
                  <div className="space-y-2">
                    {selected.experience.map((e) => (
                      <div key={e.id} className="rounded-md border p-2 text-sm">
                        <p className="font-medium">{e.title} · {e.company}</p>
                        <p className="text-xs text-muted-foreground">{e.startDate} — {e.current ? "present" : e.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Education</p>
                  {selected.education.map((e) => (
                    <div key={e.id} className="rounded-md border p-2 text-sm">
                      <p className="font-medium">{e.degree} {e.field}</p>
                      <p className="text-xs text-muted-foreground">{e.institution}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => toast.success(`Added ${selected.name} to talent pool`)}>Add to pool</Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success(`Invitation to apply sent to ${selected.name}`)}>Invite to apply</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
