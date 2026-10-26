"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X, Plus, Check, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface CompareCandidate {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  skills: string[];
  education: string;
  currentCtc: number;
  expectedCtc: number;
  noticePeriodDays: number;
  matchScore: number;
  rating: number; // 1-5
}

const CANDIDATES: CompareCandidate[] = [
  {
    id: "c1", name: "Priya Nair", role: "Senior Frontend Engineer",
    experienceYears: 6.5, skills: ["React", "Next.js", "TypeScript", "GraphQL", "Tailwind"],
    education: "B.Tech, IIT Madras", currentCtc: 2200000, expectedCtc: 2800000,
    noticePeriodDays: 30, matchScore: 92, rating: 5,
  },
  {
    id: "c2", name: "Arjun Mehta", role: "Frontend Engineer",
    experienceYears: 5, skills: ["React", "JavaScript", "CSS", "Redux", "Jest"],
    education: "B.E., BITS Pilani", currentCtc: 1800000, expectedCtc: 2400000,
    noticePeriodDays: 60, matchScore: 84, rating: 4,
  },
  {
    id: "c3", name: "Sneha Reddy", role: "Senior Frontend Engineer",
    experienceYears: 7, skills: ["React", "Next.js", "Node.js", "TypeScript", "AWS"],
    education: "M.Tech, IIIT Hyderabad", currentCtc: 2600000, expectedCtc: 3200000,
    noticePeriodDays: 45, matchScore: 88, rating: 4,
  },
  {
    id: "c4", name: "Rohit Sharma", role: "Frontend Engineer",
    experienceYears: 4, skills: ["Vue", "React", "JavaScript", "SCSS"],
    education: "B.Tech, VIT Vellore", currentCtc: 1500000, expectedCtc: 2000000,
    noticePeriodDays: 15, matchScore: 71, rating: 3,
  },
  {
    id: "c5", name: "Ananya Iyer", role: "Lead Frontend Engineer",
    experienceYears: 9, skills: ["React", "Next.js", "TypeScript", "System Design", "Mentoring"],
    education: "B.Tech, NIT Surathkal", currentCtc: 3200000, expectedCtc: 4000000,
    noticePeriodDays: 60, matchScore: 95, rating: 5,
  },
  {
    id: "c6", name: "Karthik Rao", role: "Frontend Engineer",
    experienceYears: 5.5, skills: ["React", "Next.js", "Tailwind", "Framer Motion"],
    education: "B.E., Anna University", currentCtc: 2000000, expectedCtc: 2500000,
    noticePeriodDays: 30, matchScore: 81, rating: 4,
  },
];

type RowKey = "experienceYears" | "currentCtc" | "expectedCtc" | "noticePeriodDays" | "matchScore" | "rating";

const NUMERIC_ROWS: { key: RowKey; label: string; format: (v: number) => string; higherIsBetter: boolean }[] = [
  { key: "experienceYears", label: "Experience", format: (v) => `${v} yrs`, higherIsBetter: true },
  { key: "currentCtc", label: "Current CTC", format: (v) => formatCurrency(v), higherIsBetter: true },
  { key: "expectedCtc", label: "Expected CTC", format: (v) => formatCurrency(v), higherIsBetter: false },
  { key: "noticePeriodDays", label: "Notice Period", format: (v) => `${v} days`, higherIsBetter: false },
  { key: "matchScore", label: "Match Score", format: (v) => `${v}/100`, higherIsBetter: true },
  { key: "rating", label: "Rating", format: (v) => `${v}/5`, higherIsBetter: true },
];

export function EmployerCandidateCompare() {
  const [selected, setSelected] = React.useState<string[]>(["c1", "c2", "c3"]);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const compared = selected.map((id) => CANDIDATES.find((c) => c.id === id)!).filter(Boolean);

  const bestFor = (key: RowKey, higherIsBetter: boolean): string | null => {
    if (compared.length === 0) return null;
    let best = compared[0];
    for (const c of compared) {
      if (higherIsBetter ? c[key] > best[key] : c[key] < best[key]) best = c;
    }
    return best.id;
  };

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 3) {
        toast.error("Compare up to 3 candidates at a time");
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const clearAll = () => setSelected([]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compare Candidates"
        description="Side-by-side comparison of up to 3 shortlisted candidates. The best value in each row is highlighted."
        actions={[{ label: "Add candidate", icon: "Plus", variant: "outline", onClick: () => setPickerOpen(true) }]}
      />

      {compared.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="No candidates selected"
          description="Pick 2-3 candidates to view a side-by-side comparison."
          action={<Button onClick={() => setPickerOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add candidate</Button>}
        />
      ) : (
        <SectionCard
          title={`Comparing ${compared.length} candidate${compared.length > 1 ? "s" : ""}`}
          description="Best values are highlighted in emerald."
          action={<Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-40 text-left align-bottom p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attribute</th>
                  {compared.map((c) => (
                    <th key={c.id} className="text-left align-bottom p-3 min-w-[220px] border-l border-border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <AvatarLogo text={c.name} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{c.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{c.role}</div>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => toggle(c.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NUMERIC_ROWS.map((row) => {
                  const bestId = bestFor(row.key, row.higherIsBetter);
                  return (
                    <tr key={row.key} className="border-t border-border hover:bg-muted/30">
                      <td className="p-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{row.label}</td>
                      {compared.map((c) => {
                        const isBest = c.id === bestId && compared.length > 1;
                        return (
                          <td key={c.id} className={`p-3 border-l border-border ${isBest ? "bg-brand/10" : ""}`}>
                            <div className="flex items-center gap-2">
                              {row.key === "matchScore" ? (
                                <MatchScore score={c.matchScore} />
                              ) : row.key === "rating" ? (
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`h-3.5 w-3.5 ${s <= c.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                                  ))}
                                </div>
                              ) : null}
                              <span className={`text-sm ${isBest ? "font-semibold text-brand" : ""}`}>{row.format(c[row.key])}</span>
                              {isBest && <Trophy className="h-3.5 w-3.5 text-brand" />}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {/* Skills */}
                <tr className="border-t border-border">
                  <td className="p-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Skills</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 border-l border-border">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Education */}
                <tr className="border-t border-border">
                  <td className="p-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Education</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 border-l border-border text-sm">{c.education}</td>
                  ))}
                </tr>
                {/* Action */}
                <tr className="border-t border-border">
                  <td className="p-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Action</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 border-l border-border">
                      <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success(`Moved ${c.name} to next stage`)}>
                        <Check className="mr-1 h-3 w-3" /> Advance
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Picker */}
      {pickerOpen && (
        <SectionCard title="Candidate picker" description="Select up to 3 candidates to compare.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CANDIDATES.map((c) => {
              const isSelected = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition hover:border-brand/60 hover:bg-muted/30 ${isSelected ? "border-brand bg-brand/5" : "border-border"}`}
                >
                  <AvatarLogo text={c.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.role} · {c.experienceYears} yrs</div>
                  </div>
                  {isSelected ? (
                    <div className="h-5 w-5 rounded-full bg-brand text-white flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-border" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setPickerOpen(false)}>Done ({selected.length}/3)</Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
