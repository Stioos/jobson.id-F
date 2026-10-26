"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/format";

type KitType = "Technical" | "Behavioral" | "Cultural" | "Case";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  text: string;
  competency: string;
  difficulty: Difficulty;
  expected: string;
  followUps: string[];
}

interface Kit {
  id: string;
  name: string;
  role: string;
  type: KitType;
  questions: Question[];
  rubric: { competency: string; levels: { score: number; desc: string }[] }[];
  updatedAt: string;
}

const TEMPLATES: { name: string; role: string; type: KitType; questions: number; description: string }[] = [
  { name: "Senior Backend Engineer — Core", role: "Senior Backend Engineer", type: "Technical", questions: 12, description: "System design + DSA + architecture deep-dive. Used by 40+ companies." },
  { name: "Product Manager — Discovery", role: "Product Manager", type: "Case", questions: 8, description: "Customer discovery + prioritization + metrics case studies." },
  { name: "Engineering Manager — People", role: "Engineering Manager", type: "Behavioral", questions: 10, description: "Leadership, conflict resolution, hiring and coaching scenarios." },
];

const INITIAL_KITS: Kit[] = [
  {
    id: "k1", name: "Senior Frontend Engineer", role: "Senior Frontend Engineer", type: "Technical", updatedAt: "2024-10-01T10:00:00Z",
    questions: [
      { id: "q1", text: "Walk me through your approach to optimizing a slow React app.", competency: "Performance", difficulty: "Hard", expected: "Profile with React DevTools + Lighthouse. Identify re-renders, memoize, code-split, lazy load. Measure before/after.", followUps: ["How would you measure long tasks?", "When would you NOT use useMemo?"] },
      { id: "q2", text: "Design a reusable Modal component for a design system.", competency: "Architecture", difficulty: "Medium", expected: "Accessibility (focus trap, ESC, ARIA), portal, controlled/uncontrolled API, composition via slots.", followUps: ["How do you handle nested modals?", "How do you test focus management?"] },
      { id: "q3", text: "Explain event delegation and when to use it.", competency: "DOM Fundamentals", difficulty: "Easy", expected: "Single listener on parent, use target.dataset for action. Useful for dynamic lists.", followUps: [" Downsides?", "How does it interact with Shadow DOM?"] },
      { id: "q4", text: "How would you migrate a CRA app to Next.js?", competency: "Migration", difficulty: "Medium", expected: "Audit routes, replace CRA router with App Router, incrementally adopt RSC, set up data fetching, deploy edge runtime where applicable.", followUps: ["What breaks first?", "How do you handle images?"] },
    ],
    rubric: [
      { competency: "Performance", levels: [{ score: 1, desc: "Cannot identify bottlenecks" }, { score: 3, desc: "Uses common techniques" }, { score: 5, desc: "Measures, profiles, optimizes systematically" }] },
      { competency: "Architecture", levels: [{ score: 1, desc: "Tight coupling" }, { score: 3, desc: "Reasonable composition" }, { score: 5, desc: "Designs extensible APIs" }] },
    ],
  },
  {
    id: "k2", name: "Backend Engineer (Go)", role: "Backend Engineer", type: "Technical", updatedAt: "2024-09-25T14:00:00Z",
    questions: [
      { id: "q1", text: "Design a rate limiter for an API gateway.", competency: "System Design", difficulty: "Hard", expected: "Token bucket + Redis Lua. Per-user, per-IP, per-API. Headers for X-RateLimit. Discuss trade-offs.", followUps: ["Distributed rate limiting?", "How to handle bursts?"] },
      { id: "q2", text: "Explain Go's goroutine scheduling.", competency: "Concurrency", difficulty: "Medium", expected: "GMP model, work-stealing, preemption since 1.14. Context switches cheaper than OS threads.", followUps: ["When to use sync.Pool?", "Race detector?"] },
    ],
    rubric: [{ competency: "System Design", levels: [{ score: 1, desc: "Misses scaling" }, { score: 3, desc: "Solves problem" }, { score: 5, desc: "Considers edge cases" }] }],
  },
  {
    id: "k3", name: "Product Manager — Behavioral", role: "Product Manager", type: "Behavioral", updatedAt: "2024-09-30T11:00:00Z",
    questions: [
      { id: "q1", text: "Tell me about a product decision you got wrong.", competency: "Self-awareness", difficulty: "Medium", expected: "Own it, share the lesson, how you'd avoid it next time.", followUps: ["How did you communicate it to stakeholders?"] },
      { id: "q2", text: "Describe a time you had to say no to a key stakeholder.", competency: "Stakeholder Mgmt", difficulty: "Hard", expected: "Use data + customer voice. Offer alternatives. Maintain relationship.", followUps: ["What if they escalated?"] },
    ],
    rubric: [{ competency: "Stakeholder Mgmt", levels: [{ score: 1, desc: "Avoids conflict" }, { score: 3, desc: "Handles directly" }, { score: 5, desc: "Builds alignment" }] }],
  },
  {
    id: "k4", name: "Cultural Fit — Values", role: "All roles", type: "Cultural", updatedAt: "2024-08-20T09:00:00Z",
    questions: [
      { id: "q1", text: "Describe the kind of team culture where you thrive.", competency: "Culture Fit", difficulty: "Easy", expected: "Honest answer aligned with company values. Look for specificity.", followUps: ["What cultures don't work for you?"] },
      { id: "q2", text: "Tell me about a time you went above and beyond.", competency: "Ownership", difficulty: "Easy", expected: "Concrete example with impact. Look for intrinsic motivation.", followUps: ["What did you learn?"] },
    ],
    rubric: [{ competency: "Culture Fit", levels: [{ score: 1, desc: "Misaligned" }, { score: 3, desc: "Aligned" }, { score: 5, desc: "Embodies values" }] }],
  },
  {
    id: "k5", name: "Case Study — Marketplace", role: "Product Manager", type: "Case", updatedAt: "2024-09-12T16:00:00Z",
    questions: [
      { id: "q1", text: "Our marketplace's GMV grew 30% but take rate dropped 2%. Diagnose.", competency: "Analytical", difficulty: "Hard", expected: "Break into supply/demand mix, category mix, fee changes, promotional GMV. Hypothesis-test.", followUps: ["What data would you pull?"] },
      { id: "q2", text: "Should we launch a subscription tier for buyers?", competency: "Strategy", difficulty: "Medium", expected: "Segment users, calculate LTV uplift vs cannibalization. Pilot for 90 days.", followUps: ["Risks?"] },
    ],
    rubric: [{ competency: "Analytical", levels: [{ score: 1, desc: "Jumps to conclusions" }, { score: 3, desc: "Structured" }, { score: 5, desc: "Rigorous + insightful" }] }],
  },
];

const TYPE_CLS: Record<KitType, string> = {
  Technical: "bg-brand/10 text-brand border-brand/30",
  Behavioral: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Cultural: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Case: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
};

const DIFF_CLS: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function EmployerInterviewKits() {
  const [kits, setKits] = React.useState<Kit[]>(INITIAL_KITS);
  const [selectedKit, setSelectedKit] = React.useState<Kit | null>(INITIAL_KITS[0]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", role: "", type: "Technical" as KitType });
  const [expandedQs, setExpandedQs] = React.useState<Set<string>>(new Set());

  const totalQuestions = kits.reduce((a, k) => a + k.questions.length, 0);

  const createKit = () => {
    if (!form.name || !form.role) { toast.error("Name and role are required"); return; }
    const newKit: Kit = {
      id: `k${Date.now()}`, name: form.name, role: form.role, type: form.type,
      questions: [], rubric: [], updatedAt: new Date().toISOString(),
    };
    setKits([newKit, ...kits]);
    setSelectedKit(newKit);
    setCreateOpen(false);
    setForm({ name: "", role: "", type: "Technical" });
    toast.success("Kit created", { description: `${form.name} is ready for questions.` });
  };

  const duplicate = (k: Kit) => {
    const copy: Kit = { ...k, id: `k${Date.now()}`, name: `${k.name} (Copy)`, updatedAt: new Date().toISOString() };
    setKits([copy, ...kits]);
    toast.success("Kit duplicated", { description: `${copy.name} added.` });
  };

  const remove = (k: Kit) => {
    setKits(kits.filter((x) => x.id !== k.id));
    if (selectedKit?.id === k.id) setSelectedKit(null);
    toast.warning("Kit deleted", { description: k.name });
  };

  const applyTemplate = (t: typeof TEMPLATES[number]) => {
    const newKit: Kit = {
      id: `k${Date.now()}`, name: t.name, role: t.role, type: t.type,
      questions: [], rubric: [{ competency: "Overall", levels: [{ score: 1, desc: "Below bar" }, { score: 3, desc: "At bar" }, { score: 5, desc: "Above bar" }] }],
      updatedAt: new Date().toISOString(),
    };
    setKits([newKit, ...kits]);
    setSelectedKit(newKit);
    toast.success("Template imported", { description: `${t.name} kit added with ${t.questions} suggested questions.` });
  };

  const toggleQ = (id: string) => {
    setExpandedQs((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Kits"
        description="Standardize interviews with reusable kits — questions, scoring rubrics and templates across technical, behavioral, cultural and case rounds."
        icon={<Icon name="FileBox" className="h-6 w-6" />}
        actions={[{ label: "Create kit", onClick: () => setCreateOpen(true) }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total kits" value={kits.length} hint="Across all roles" icon={<Icon name="FileBox" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Total questions" value={totalQuestions} hint="In active kits" icon={<Icon name="ListChecks" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Templates" value={TEMPLATES.length} hint="Pre-built kits" icon={<Icon name="LayoutTemplate" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Roles covered" value={new Set(kits.map((k) => k.role)).size} hint="Unique positions" icon={<Icon name="Briefcase" className="h-4 w-4" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Kit list */}
        <SectionCard title="Your kits" description={`${kits.length} kits`} className="lg:col-span-1">
          <div className="space-y-2 max-h-[600px] overflow-y-auto scroll-thin pr-1">
            {kits.map((k) => (
              <div key={k.id}
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${selectedKit?.id === k.id ? "border-brand bg-brand/5" : "hover:border-brand/30"}`}
                onClick={() => setSelectedKit(k)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{k.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{k.role}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${TYPE_CLS[k.type]}`}>{k.type}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{k.questions.length} questions</span>
                  <span className="text-muted-foreground">{formatDate(k.updatedAt)}</span>
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); duplicate(k); }}>
                    <Icon name="Copy" className="h-3 w-3" /> Duplicate
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600" onClick={(e) => { e.stopPropagation(); remove(k); }}>
                    <Icon name="Trash2" className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Selected kit detail */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedKit ? (
            <Card><CardContent className="p-12 text-center text-sm text-muted-foreground">Select a kit to view details</CardContent></Card>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold">{selectedKit.name}</h3>
                      <p className="text-xs text-muted-foreground">{selectedKit.role} · Updated {formatDate(selectedKit.updatedAt)}</p>
                    </div>
                    <Badge variant="outline" className={TYPE_CLS[selectedKit.type]}>{selectedKit.type}</Badge>
                  </div>
                </CardContent>
              </Card>

              <SectionCard title="Questions" description={`${selectedKit.questions.length} questions`} action={<Button size="sm" variant="outline" onClick={() => toast.info("Add question", { description: "Question editor coming up." })}><Icon name="Plus" className="mr-1 h-3 w-3" /> Add</Button>}>
                {selectedKit.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No questions yet. Add your first question or use a template.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedKit.questions.map((q, i) => {
                      const exp = expandedQs.has(q.id);
                      return (
                        <div key={q.id} className="rounded-lg border p-3">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium">{q.text}</p>
                                <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${DIFF_CLS[q.difficulty]}`}>{q.difficulty}</span>
                                <Badge variant="outline" className="text-[10px]">{q.competency}</Badge>
                              </div>
                              {exp && (
                                <div className="mt-2 space-y-2 text-xs">
                                  <div className="rounded-md bg-muted/40 p-2">
                                    <p className="font-semibold text-brand">Expected answer</p>
                                    <p className="text-muted-foreground mt-0.5">{q.expected}</p>
                                  </div>
                                  {q.followUps.length > 0 && (
                                    <div className="rounded-md bg-muted/40 p-2">
                                      <p className="font-semibold text-brand">Follow-up questions</p>
                                      <ul className="mt-0.5 space-y-0.5 text-muted-foreground">{q.followUps.map((f, j) => <li key={j}>• {f}</li>)}</ul>
                                    </div>
                                  )}
                                </div>
                              )}
                              <Button size="sm" variant="ghost" className="mt-1 h-6 px-2 text-xs" onClick={() => toggleQ(q.id)}>
                                <Icon name={exp ? "Eye" : "AlignLeft"} className="mr-1 h-3 w-3" />{exp ? "Hide" : "Show"} answer
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Scoring rubric" description="1–5 scale per competency" action={<Button size="sm" variant="outline" onClick={() => toast.info("Edit rubric")}><Icon name="Pencil" className="mr-1 h-3 w-3" /> Edit</Button>}>
                {selectedKit.rubric.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No rubric defined.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedKit.rubric.map((r) => (
                      <div key={r.competency} className="rounded-lg border p-3">
                        <p className="text-sm font-semibold mb-2">{r.competency}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {r.levels.map((l) => (
                            <div key={l.score} className="rounded-md bg-muted/40 p-2 text-center">
                              <p className="text-lg font-bold text-brand">{l.score}</p>
                              <p className="text-[10px] text-muted-foreground">{l.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </>
          )}
        </div>
      </div>

      {/* Template library */}
      <SectionCard title="Template library" description="Start from a pre-built kit">
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="rounded-lg border p-3 hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${TYPE_CLS[t.type]}`}>{t.type}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t.description}</p>
              <Button size="sm" variant="outline" className="mt-2 w-full h-7 text-xs" onClick={() => applyTemplate(t)}>
                <Icon name="Plus" className="mr-1 h-3 w-3" /> Use template ({t.questions} Qs)
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create interview kit</DialogTitle>
            <DialogDescription>Set up a new kit. You can add questions and rubrics next.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Kit name *</Label>
              <Input placeholder="e.g. Senior Frontend Engineer" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Input placeholder="e.g. Senior Frontend Engineer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as KitType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Technical", "Behavioral", "Cultural", "Case"] as KitType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createKit}>Create kit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
