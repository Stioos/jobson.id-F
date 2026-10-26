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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ----- Mock data -----
type Difficulty = "Easy" | "Medium" | "Hard";

interface Q {
  id: string;
  q: string;
  difficulty: Difficulty;
  tags: string[];
  answer: string;
  tips: string;
}

const CATS = ["Behavioral", "Technical", "Case Study", "System Design", "HR Rounds"] as const;
type Cat = (typeof CATS)[number];

const QUESTIONS: Record<Cat, Q[]> = {
  Behavioral: [
    { id: "b1", q: "Tell me about a time you led a project under tight deadlines.", difficulty: "Medium", tags: ["Leadership", "Ownership"], answer: "Use STAR: Situation (Q4 launch with 3-week delay), Task (own delivery), Action (re-scoped MVP, daily stand-ups, blocked risks), Result (shipped on time, +18% adoption).", tips: "Quantify the result. Avoid blaming others." },
    { id: "b2", q: "Describe a conflict with a teammate and how you resolved it.", difficulty: "Easy", tags: ["Collaboration"], answer: "Pick a real disagreement, focus on interests not positions, end with what you learned about communication.", tips: "Never say 'I never have conflicts.'" },
    { id: "b3", q: "Tell me about a failure. What did you learn?", difficulty: "Medium", tags: ["Self-awareness"], answer: "Own it. Share the lesson + how you applied it later.", tips: "Don't pick a humble-brag failure." },
    { id: "b4", q: "Give an example of when you took initiative beyond your role.", difficulty: "Easy", tags: ["Ownership"], answer: "Show proactive problem-solving with measurable impact.", tips: "Pick something recent (within 18 months)." },
    { id: "b5", q: "Tell me about a time you mentored someone.", difficulty: "Easy", tags: ["Mentorship"], answer: "Mention the person's growth + how you adapted your style.", tips: "Show you listened first." },
    { id: "b6", q: "Describe a time you had to persuade stakeholders.", difficulty: "Hard", tags: ["Influence"], answer: "Show data + empathy + iterative buy-in.", tips: "Use a story where you almost lost them." },
  ],
  Technical: [
    { id: "t1", q: "Explain the React render lifecycle and when to use useMemo vs useCallback.", difficulty: "Medium", tags: ["React"], answer: "Render → reconcile → commit. useMemo caches a value, useCallback caches a function reference — use when dependencies are stable and consumers are memoized.", tips: "Mention the React Compiler and avoid premature optimization." },
    { id: "t2", q: "What happens when you type a URL in the browser? Walk me through.", difficulty: "Hard", tags: ["Networking", "Browser"], answer: "DNS lookup → TCP handshake → TLS → HTTP request → server response → HTML parse → CSSOM + DOM → render tree → layout → paint → JS hydration.", tips: "Hit the key checkpoints; don't go too deep on any one." },
    { id: "t3", q: "Reverse a linked list. Code it.", difficulty: "Easy", tags: ["DSA"], answer: "Iterative: prev=null, cur=head; while cur: next=cur.next, cur.next=prev, prev=cur, cur=next; return prev.", tips: "Walk through an example with 3 nodes." },
    { id: "t4", q: "Explain CAP theorem with an example.", difficulty: "Medium", tags: ["Databases"], answer: "Consistency, Availability, Partition tolerance — pick 2 of 3 during network partitions. CP (HBase), AP (Cassandra), CA (single-node Postgres).", tips: "Mention that P is non-negotiable in distributed systems." },
    { id: "t5", q: "Design a rate limiter. Which algorithm and why?", difficulty: "Hard", tags: ["System Design"], answer: "Token bucket for bursty traffic, leaky bucket for smoothing, sliding window for accuracy. Redis + Lua for atomic ops.", tips: "Discuss trade-offs (memory vs accuracy)." },
    { id: "t6", q: "What's the difference between SQL and NoSQL? When would you pick which?", difficulty: "Easy", tags: ["Databases"], answer: "SQL: ACID, schema, joins. NoSQL: flexible schema, horizontal scale, eventual consistency. Pick SQL for transactions, NoSQL for scale/flexibility.", tips: "Mention NewSQL (CockroachDB, Spanner)." },
  ],
  "Case Study": [
    { id: "c1", q: "A coffee chain's revenue dropped 15% in Q2. Diagnose.", difficulty: "Medium", tags: ["Diagnosis"], answer: "Break into: external (market, weather, competition) vs internal (price, supply, ops). Use MECE. Quantify each. Hypothesis-test-prioritize.", tips: "Always clarify the metric definition first." },
    { id: "c2", q: "Estimate the number of iPhones sold in India each year.", difficulty: "Hard", tags: ["Estimation"], answer: "Population × segment × penetration × replacement cycle. 1.4B × 30% adult × 8% iPhone share × 1/3 replacement = ~11M units.", tips: "Round numbers; sanity-check against known data." },
    { id: "c3", q: "Should our startup enter Tier-2 cities? Build a framework.", difficulty: "Hard", tags: ["Strategy"], answer: "Market size × competition × unit economics × operational readiness. Score each. Run a 6-month pilot in 2 cities.", tips: "End with a clear recommendation, not 'it depends'." },
    { id: "c4", q: "How would you price a new B2B SaaS product?", difficulty: "Medium", tags: ["Pricing"], answer: "Cost-plus, value-based, competitor-based. For SaaS, value-based wins — price as % of customer's ROI.", tips: "Mention tiered pricing + free tier for land-and-expand." },
    { id: "c5", q: "A grocery app's churn is 25%/month. Suggest 3 fixes.", difficulty: "Medium", tags: ["Retention"], answer: "Onboarding (first-week aha), habit loops (push + reminders), loyalty (cashback, subscription). Measure cohort retention weekly.", tips: "Tie each fix to a metric you'd track." },
  ],
  "System Design": [
    { id: "s1", q: "Design a URL shortener like bit.ly.", difficulty: "Medium", tags: ["Scalability"], answer: "API: POST /shorten, GET /:code. ID gen (base62 of counter or nanoid). DB: URLs table (code, long_url, created_at). Cache hot URLs in Redis. CDN for redirects. Analytics async.", tips: "Discuss trade-offs of counter vs random IDs." },
    { id: "s2", q: "Design Twitter's home timeline.", difficulty: "Hard", tags: ["Scalability"], answer: "Fan-out on write for normal users, fan-out on read for celebrities (hybrid). Timeline service caches pre-computed feeds. Push-based + pull-based.", tips: "Mention the celebrity problem explicitly." },
    { id: "s3", q: "Design a distributed rate limiter.", difficulty: "Hard", tags: ["Distributed"], answer: "Token bucket in Redis with Lua atomicity. Sliding window log for accuracy. Sticky sessions for local caching.", tips: "Discuss clock skew across nodes." },
    { id: "s4", q: "Design a chat application like WhatsApp.", difficulty: "Hard", tags: ["Realtime"], answer: "WebSocket for delivery, XMPP/MQTT for presence, end-to-end encryption (Signal protocol), media stored in object storage, messages in sharded DB.", tips: "Discuss offline message sync." },
    { id: "s5", q: "Design an autocomplete/suggestion system.", difficulty: "Medium", tags: ["Search"], answer: "Trie or FST in memory, weighted by frequency/recency. Top-K per prefix. Update weights async from click logs.", tips: "Mention sharding by first letter." },
  ],
  "HR Rounds": [
    { id: "h1", q: "Why are you leaving your current role?", difficulty: "Easy", tags: ["Motivation"], answer: "Frame positively — seeking growth, new challenges, larger scope. Never badmouth current employer.", tips: "Keep it to 30 seconds." },
    { id: "h2", q: "Why do you want to join us specifically?", difficulty: "Easy", tags: ["Fit"], answer: "Reference their product, recent news, values. Connect to your skills and what you'd add.", tips: "Show you researched — name a recent launch." },
    { id: "h3", q: "Where do you see yourself in 5 years?", difficulty: "Medium", tags: ["Career"], answer: "Show direction (IC track vs management), connect to the role, stay flexible.", tips: "Don't say 'in your seat'." },
    { id: "h4", q: "What are your salary expectations?", difficulty: "Hard", tags: ["Negotiation"], answer: "Give a range based on research, anchor high, mention total comp. Defer specifics until final round if possible.", tips: "Never give a single number." },
    { id: "h5", q: "Do you have any questions for us?", difficulty: "Easy", tags: ["Curiosity"], answer: "Ask about team culture, success metrics, growth path, recent challenges. Avoid asking about salary/perks in early rounds.", tips: "Prepare 3-4 thoughtful questions." },
  ],
};

const COMPANIES = [
  { name: "TechCorp India", color: "bg-brand/15 text-brand", sets: 24 },
  { name: "FinEdge", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", sets: 18 },
  { name: "Brightwave Labs", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", sets: 15 },
];

const DIFF_CLS: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function CandidateInterviewPrep() {
  const [cat, setCat] = React.useState<Cat>("Behavioral");
  const [practice, setPractice] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set(["b1", "t1"]));
  const [practiced, setPracticed] = React.useState<Set<string>>(new Set(["b1"]));
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [timer, setTimer] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const markPracticed = (id: string) => {
    setPracticed((prev) => {
      const n = new Set(prev);
      n.add(id);
      return n;
    });
    toast.success("Marked as practiced", { description: `${practiced.size + 1} questions practiced so far` });
  };

  const totalQ = Object.values(QUESTIONS).reduce((a, l) => a + l.length, 0);
  const progress = Math.round((practiced.size / totalQ) * 100);
  const list = QUESTIONS[cat];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Prep Library"
        description="Curated question banks, model answers, mock interview timer and company-specific sets — everything you need to ace your next round."
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[
          { label: running ? "Pause" : "Start timer", variant: running ? "outline" : "default", onClick: () => setRunning(!running) },
          { label: "Reset timer", variant: "outline", onClick: () => { setRunning(false); setTimer(0); } },
        ]}
      />

      {/* Progress + Timer */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Questions practiced" value={`${practiced.size}/${totalQ}`} hint={`${progress}% complete`} icon={<Icon name="ListChecks" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Favorites" value={favorites.size} hint="Starred for later" icon={<Icon name="Star" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Categories" value={CATS.length} hint="Across all rounds" icon={<Icon name="Library" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Mock timer" value={fmtTime(timer)} hint={running ? "Running…" : "Paused"} icon={<Icon name="Clock" className="h-4 w-4" />} tone="brand" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Overall progress</span>
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-xs font-semibold text-brand">{progress}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Company sets */}
      <SectionCard title="Company-specific sets" description="Real questions reported by recent candidates" action={<Badge className="bg-brand/10 text-brand">{COMPANIES.length} companies</Badge>}>
        <div className="grid gap-3 sm:grid-cols-3">
          {COMPANIES.map((c) => (
            <div key={c.name} className="rounded-lg border p-3 hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg font-semibold ${c.color}`}>{c.name[0]}</div>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.sets} questions</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-xs" onClick={() => toast.info("Loading set", { description: `${c.name} question set coming up.` })}>
                View set <Icon name="ArrowRight" className="ml-1 h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Category tabs + practice toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={cat} onValueChange={(v) => setCat(v as Cat)}>
          <TabsList className="flex-wrap">
            {CATS.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">{c} ({QUESTIONS[c].length})</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <Icon name="Eye" className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Practice mode</span>
          <Switch checked={practice} onCheckedChange={setPractice} />
        </div>
      </div>

      {/* Question bank */}
      <SectionCard
        title={`${cat} question bank`}
        description={`${list.length} questions with model answers and tips`}
        action={<Badge variant="outline">{favorites.size} starred</Badge>}
      >
        <div className="space-y-2 max-h-[600px] overflow-y-auto scroll-thin pr-1">
          {list.map((item) => {
            const isFav = favorites.has(item.id);
            const isExp = expanded.has(item.id) || !practice;
            const isDone = practiced.has(item.id);
            return (
              <div key={item.id} className={`rounded-lg border p-3 transition-colors ${isDone ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}>
                <div className="flex items-start gap-2">
                  <button onClick={() => toggleFav(item.id)} className="mt-0.5 shrink-0" aria-label="Favorite">
                    <Icon name="Star" className={`h-4 w-4 ${isFav ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.q}</p>
                      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${DIFF_CLS[item.difficulty]}`}>{item.difficulty}</span>
                      {isDone && <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Practiced</Badge>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">#{t}</span>
                      ))}
                    </div>
                    {(isExp) && (
                      <div className="mt-2 space-y-2 rounded-md bg-muted/40 p-2.5 text-xs">
                        <div>
                          <p className="font-semibold text-brand">Model answer</p>
                          <p className="mt-0.5 text-muted-foreground">{item.answer}</p>
                        </div>
                        <div className="flex items-start gap-1.5 border-t pt-2">
                          <Icon name="Lightbulb" className="h-3 w-3 mt-0.5 text-amber-500" />
                          <p className="text-muted-foreground"><span className="font-semibold">Tip:</span> {item.tips}</p>
                        </div>
                      </div>
                    )}
                    {practice && (
                      <Button size="sm" variant="ghost" className="mt-1.5 h-7 px-2 text-xs" onClick={() => toggleExpanded(item.id)}>
                        <Icon name={isExp ? "Eye" : "Eye"} className="mr-1 h-3 w-3" />
                        {isExp ? "Hide answer" : "Reveal answer"}
                      </Button>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    {!isDone && (
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => markPracticed(item.id)}>
                        <Icon name="CheckCircle" className="mr-1 h-3 w-3" /> Done
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
