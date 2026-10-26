"use client";

import * as React from "react";
import {
  SearchCode, Plus, Trash2, Play, Save, Copy, CheckCircle2, MapPin, Building2, GraduationCap, Clock, Cpu,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type CriterionType = "skill" | "location" | "company" | "experience" | "education";
type Operator = "AND" | "OR" | "NOT";

interface Criterion {
  id: string;
  type: CriterionType;
  value: string;
  operator: Operator; // operator that joins this block to the previous one
}

interface SearchResult {
  id: string;
  name: string;
  title: string;
  skills: string[];
  location: string;
  experience: number;
  match: number;
}

const TYPE_META: Record<CriterionType, { label: string; icon: React.ReactNode; placeholder: string }> = {
  skill: { label: "Skill", icon: <Cpu className="h-3.5 w-3.5" />, placeholder: "e.g. React, Python, Kubernetes" },
  location: { label: "Location", icon: <MapPin className="h-3.5 w-3.5" />, placeholder: "e.g. Bengaluru, Remote" },
  company: { label: "Company", icon: <Building2 className="h-3.5 w-3.5" />, placeholder: "e.g. Google, TCS" },
  experience: { label: "Years of Exp", icon: <Clock className="h-3.5 w-3.5" />, placeholder: "e.g. 5+, 3-7" },
  education: { label: "Education", icon: <GraduationCap className="h-3.5 w-3.5" />, placeholder: "e.g. B.Tech, MBA" },
};

const MOCK_RESULTS: SearchResult[] = [
  { id: "r1", name: "Arjun Iyer", title: "Senior Frontend Engineer", skills: ["React", "TypeScript", "GraphQL"], location: "Bengaluru", experience: 6, match: 94 },
  { id: "r2", name: "Kavya Reddy", title: "Full Stack Developer", skills: ["React", "Node.js", "AWS"], location: "Hyderabad", experience: 5, match: 89 },
  { id: "r3", name: "Rohan Mehta", title: "DevOps Engineer", skills: ["Kubernetes", "Terraform", "AWS"], location: "Pune", experience: 7, match: 86 },
  { id: "r4", name: "Sneha Kapoor", title: "Backend Engineer", skills: ["Python", "Django", "PostgreSQL"], location: "Remote", experience: 4, match: 81 },
  { id: "r5", name: "Vikram Nair", title: "ML Engineer", skills: ["Python", "TensorFlow", "ML"], location: "Bengaluru", experience: 8, match: 78 },
  { id: "r6", name: "Priya Nair", title: "Frontend Engineer", skills: ["React", "Vue", "Tailwind"], location: "Kochi", experience: 3, match: 74 },
  { id: "r7", name: "Aditya Sharma", title: "Cloud Architect", skills: ["AWS", "Kubernetes", "GCP"], location: "Mumbai", experience: 10, match: 71 },
  { id: "r8", name: "Neha Patel", title: "Data Engineer", skills: ["Python", "Spark", "Airflow"], location: "Ahmedabad", experience: 5, match: 68 },
];

const SAVED_QUERIES = [
  { id: "q1", name: "Senior React devs in Bengaluru", query: '(React OR TypeScript) AND Bengaluru AND (5+ years)' },
  { id: "q2", name: "DevOps with Kubernetes", query: 'Kubernetes AND (AWS OR GCP) AND NOT ("junior" OR "intern")' },
  { id: "q3", name: "ML Engineers — Python shops", query: '(Python AND TensorFlow) AND (Bangalore OR Remote)' },
];

export function RecruiterBooleanSearch() {
  const [criteria, setCriteria] = React.useState<Criterion[]>([
    { id: "c1", type: "skill", value: "React", operator: "AND" },
    { id: "c2", type: "location", value: "Bengaluru", operator: "AND" },
  ]);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [ran, setRan] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [queryName, setQueryName] = React.useState("");
  const [saved, setSaved] = React.useState(SAVED_QUERIES);

  const generatedQuery = React.useMemo(() => buildQuery(criteria), [criteria]);

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      { id: `c${Date.now()}`, type: "skill", value: "", operator: prev.length === 0 ? "AND" : "AND" },
    ]);
  }

  function updateCriterion(id: string, patch: Partial<Criterion>) {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCriterion(id: string) {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }

  function runSearch() {
    if (criteria.length === 0 || criteria.every((c) => !c.value.trim())) {
      toast.error("Add at least one criterion with a value");
      return;
    }
    setRan(true);
    // Simulate matching — show all 8 mock results sorted by match
    const sorted = [...MOCK_RESULTS].sort((a, b) => b.match - a.match);
    setResults(sorted);
    toast.success("Search complete", { description: `${sorted.length} candidates matched your boolean query` });
  }

  function saveQuery() {
    if (!queryName.trim()) {
      toast.error("Enter a name for the query");
      return;
    }
    setSaved((prev) => [{ id: `q${Date.now()}`, name: queryName, query: generatedQuery }, ...prev]);
    setQueryName("");
    setSaveOpen(false);
    toast.success("Query saved", { description: `"${queryName}" added to your library` });
  }

  function copyQuery() {
    void navigator.clipboard?.writeText(generatedQuery);
    toast.success("Query copied", { description: "Boolean string is on your clipboard" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Boolean Search Builder"
        description="Visually compose complex boolean queries across skills, location, company, experience and education. Preview the generated string and run against your talent pool."
        icon={<SearchCode className="h-6 w-6" />}
        actions={[
          { label: "Run search", onClick: runSearch, variant: "default" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Builder */}
        <SectionCard
          title="Query builder"
          description="Stack criteria blocks. Operators apply between the current block and the one above."
          className="lg:col-span-3"
          action={
            <Button size="sm" variant="outline" onClick={addCriterion}>
              <Plus className="h-4 w-4 mr-1.5" />Add criterion
            </Button>
          }
        >
          <div className="space-y-3">
            {criteria.length === 0 && (
              <EmptyState
                icon={<SearchCode className="h-5 w-5" />}
                title="No criteria yet"
                description="Add a block to start building your boolean query."
                action={<Button size="sm" onClick={addCriterion}><Plus className="h-4 w-4 mr-1.5" />Add criterion</Button>}
              />
            )}
            {criteria.map((c, idx) => {
              const meta = TYPE_META[c.type];
              return (
                <div key={c.id} className="rounded-lg border bg-card p-3">
                  {idx > 0 && (
                    <div className="mb-2 flex items-center gap-2">
                      <Select value={c.operator} onValueChange={(v) => updateCriterion(c.id, { operator: v as Operator })}>
                        <SelectTrigger className="h-7 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                          <SelectItem value="NOT">NOT</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="grid gap-1.5 min-w-[140px]">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">{meta.icon}{meta.label}</Label>
                      <Select value={c.type} onValueChange={(v) => updateCriterion(c.id, { type: v as CriterionType })}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(TYPE_META).map(([k, m]) => (
                            <SelectItem key={k} value={k}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5 flex-1 min-w-[180px]">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <Input
                        placeholder={meta.placeholder}
                        value={c.value}
                        onChange={(e) => updateCriterion(c.id, { value: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeCriterion(c.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Preview + saved */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Generated query"
            description="Live boolean string preview"
            action={
              <Button size="sm" variant="ghost" onClick={copyQuery}>
                <Copy className="h-4 w-4 mr-1.5" />Copy
              </Button>
            }
          >
            <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-xs font-mono text-foreground">
              {generatedQuery || "// add criteria to build your query"}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={runSearch}>
                <Play className="h-4 w-4 mr-1.5" />Run search
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSaveOpen((v) => !v)}>
                <Save className="h-4 w-4 mr-1.5" />Save query
              </Button>
            </div>
            {saveOpen && (
              <div className="mt-3 rounded-lg border bg-card p-3 space-y-2">
                <Label className="text-xs">Query name</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Senior React devs in BLR"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    className="h-8"
                  />
                  <Button size="sm" onClick={saveQuery}>Save</Button>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Saved queries" description="Re-run or load previous queries.">
            <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {saved.map((q) => (
                <li key={q.id} className="rounded-lg border bg-card p-3 hover:border-brand/40 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{q.name}</p>
                      <p className="mt-0.5 text-[11px] font-mono text-muted-foreground truncate">{q.query}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success("Query loaded", { description: q.name })}
                    >
                      Load
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      {/* Results */}
      <SectionCard
        title="Search results"
        description={ran ? `${results.length} candidates matched` : "Run a search to see matching candidates."}
      >
        {ran && results.length > 0 ? (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Skills</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Exp</TableHead>
                  <TableHead className="text-right">Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="sm" />
                        <p className="text-sm font-medium">{r.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{r.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {r.skills.slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{r.location}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center text-xs">{r.experience}y</TableCell>
                    <TableCell className="text-right">
                      <Badge className={
                        r.match >= 85 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : r.match >= 70 ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      } variant="outline">{r.match}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            icon={<SearchCode className="h-5 w-5" />}
            title="No results yet"
            description="Build a query above and click Run search."
            action={<Button size="sm" onClick={runSearch}><Play className="h-4 w-4 mr-1.5" />Run search</Button>}
          />
        )}
      </SectionCard>

      {ran && results.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <StatCard label="Matches" value={results.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="brand" />
          <StatCard label="High match (85%+)" value={results.filter((r) => r.match >= 85).length} tone="success" icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard label="Avg match" value={`${Math.round(results.reduce((a, r) => a + r.match, 0) / results.length)}%`} tone="default" />
          <StatCard label="Criteria blocks" value={criteria.length} tone="warning" hint="In current query" />
        </div>
      )}
    </div>
  );
}

function buildQuery(criteria: Criterion[]): string {
  if (criteria.length === 0) return "";
  const parts: string[] = [];
  criteria.forEach((c, i) => {
    if (!c.value.trim()) return;
    const piece = `(${c.value.trim()})`;
    if (i === 0) {
      parts.push(piece);
    } else {
      parts.push(`${c.operator} ${piece}`);
    }
  });
  return parts.join(" ");
}
