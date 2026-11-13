"use client";

import * as React from "react";
import {
  Send, Sparkles, Brain, Mail, FileQuestion, Target, Search,
  Lightbulb, Bot, User as UserIcon, AlertCircle, History,
} from "lucide-react";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { openings } from "@/lib/partner-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  preview: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  {
    icon: Search,
    label: "Find candidates for {job}",
    prompt: "Find candidates for the Senior Full-Stack Engineer role at TechCorp India.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  },
  {
    icon: Mail,
    label: "Draft candidate email",
    prompt: "Draft a personalized outreach email to a DevOps Engineer candidate for FinEdge Solutions.",
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-300",
  },
  {
    icon: FileQuestion,
    label: "Generate interview questions",
    prompt: "Generate 8 interview questions for the ML Engineer role at DataMinds AI, covering system design and MLOps.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    icon: Target,
    label: "Summarize candidate fit",
    prompt: "Summarize the fit of Priya Nair for the Senior Full-Stack Engineer role at TechCorp India based on her assessment and interview feedback.",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    icon: Lightbulb,
    label: "Suggest sourcing strategy",
    prompt: "Suggest a sourcing strategy for the Security Analyst role at SecureBank.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
];

// Simulated AI responses keyed by quick-action label keyword
function simulateResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("find candidates")) {
    return [
      "Here are 5 strong matches for the Senior Full-Stack Engineer role at TechCorp India (simulated AI):",
      "",
      "1. **Priya Nair** — 8 yrs exp. React/Node/TypeScript. Match score 92. Last updated profile 2d ago.",
      "2. **Rohit Sharma** — 7 yrs exp. React + GraphQL + AWS. Match score 88. Recently open to new roles.",
      "3. **Meera Krishnan** — 6 yrs exp. Full-stack + system design. Match score 85.",
      "4. **Aditya Verma** — 9 yrs exp. React/Vue + scaling. Match score 83. Located in Bengaluru.",
      "5. **Sneha Patel** — 6 yrs exp. Next.js + Edge. Match score 81.",
      "",
      "**Suggested next step**: Send personalized outreach to top 3 via LinkedIn InMail (template \"Senior Eng Outreach v3\" has 38% reply rate).",
    ].join("\n");
  }
  if (p.includes("draft") && p.includes("email")) {
    return [
      "Here's a personalized outreach draft (simulated AI):",
      "",
      "> **Subject**: FinEdge is hiring DevOps Engineers — would this be a fit?",
      ">",
      "> Hi [First name],",
      ">",
      "> I came across your profile and was impressed by your Kubernetes + Terraform experience — particularly the multi-region migration you led at [previous company]. FinEdge Solutions is hiring 2 DevOps Engineers in Mumbai (remote-friendly) for a high-impact platform team. The role offers ₹16–24 LPA + ESOPs + joining bonus.",
      ">",
      "> Would you be open to a 20-minute chat this week to learn more?",
      ">",
      "> Best regards,",
      "> Karthik Subramanian • HireBridge",
      "",
      "**Tip**: Personalize the [bracketed] fields before sending. A/B test 2 subject lines.",
    ].join("\n");
  }
  if (p.includes("interview questions")) {
    return [
      "Here are 8 interview questions for the ML Engineer role at DataMinds AI (simulated AI):",
      "",
      "**System design**",
      "1. Design a real-time feature store for serving ML features at <50ms p99 latency. How would you handle backfill?",
      "2. Walk me through how you'd build a model monitoring pipeline that detects concept drift.",
      "",
      "**MLOps**",
      "3. Compare MLflow vs SageMaker Pipelines vs Kubeflow for a team of 8 ML engineers.",
      "4. How would you version datasets and ensure reproducibility across experiments?",
      "",
      "**ML depth**",
      "5. When does gradient boosting outperform neural networks? Give a concrete example.",
      "6. Explain the bias-variance tradeoff in the context of regularization for transformer models.",
      "7. How would you handle imbalanced classes (1:100) in a fraud detection model?",
      "",
      "**Behavioral**",
      "8. Tell me about a time you had to push back on a non-technical stakeholder's ML request. What did you do?",
    ].join("\n");
  }
  if (p.includes("summarize") && p.includes("fit")) {
    return [
      "Candidate fit summary — Priya Nair for Senior Full-Stack Engineer @ TechCorp India (simulated AI):",
      "",
      "**Overall fit: Strong hire (92/100)**",
      "",
      "**Strengths**",
      "- Deep React 19 + TypeScript expertise (assessment: 88/100)",
      "- Excellent system design thinking (interviewer rated 5/5)",
      "- Strong communication, leadership qualities",
      "- 8 yrs experience — exceeds minimum (5 yrs)",
      "",
      "**Gaps**",
      "- Limited GraphQL experience (mentioned by Rohan Mehta)",
      "- Salary expectation (₹24L) is at upper end of band (₹18–28L)",
      "",
      "**Risk flags**: None.",
      "",
      "**Recommendation**: Proceed to offer at ₹24L + ₹2L joining bonus. Strong cultural fit with TechCorp's product-led engineering team.",
    ].join("\n");
  }
  if (p.includes("sourcing strategy")) {
    return [
      "Sourcing strategy — Security Analyst @ SecureBank (simulated AI):",
      "",
      "**Target profile**: 3–7 yrs infosec, SIEM/SOC experience, CISSP/CEH preferred.",
      "",
      "**Channel mix (priority order)**",
      "1. **LinkedIn Recruiter (50%)** — Search: \"SIEM\" + \"Splunk\" + \"incident response\" + location Chennai/Bengaluru. Estimated 320 candidates.",
      "2. **Referral network (25%)** — Activate referral bonus (₹10K) for placed candidates. Target: 8 referrals.",
      "3. **Niche communities (15%)** — Post on Null Community, Indian InfoSec Discord, Bug Bounty forums.",
      "4. **Job boards (10%)** — Naukri + Indeed. Lower priority; expect higher noise.",
      "",
      "**Suggested cadence**: 2-week sprint → 50 sourced → 15 qualified → 5 submitted → 1 placed.",
      "",
      "**Tip**: Highlight SecureBank's budget for cert reimbursement — strong differentiator for infosec candidates.",
    ].join("\n");
  }
  // Generic fallback
  return [
    "Here's a simulated AI response to your query:",
    "",
    `> ${prompt}`,
    "",
    "I've analyzed the relevant data in your recruitment workspace. Based on current openings, candidate pipeline, and historical placements, here are 3 suggested actions:",
    "",
    "1. Review active job orders — " + openings.filter((o) => o.status === "open").length + " open mandates need attention.",
    "2. Re-engage 12 warm candidates in your talent pool from the last 30 days.",
    "3. Send a status update to your top 3 clients with weekly pipeline snapshots.",
    "",
    "**Note**: This is a simulated response for demo purposes. In production, this would call the jobson.id Recruiting AI service with full RAG over your data.",
  ].join("\n");
}

export function RecruiterAI() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi Karthik! I'm your Recruiting AI assistant. I can help you find candidates, draft outreach, generate interview questions, summarize candidate fit, or suggest sourcing strategies.\n\nTry one of the quick actions below, or ask me anything.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  function send(promptText: string) {
    const text = promptText.trim();
    if (!text) return;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const response = simulateResponse(text);
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
      setHistory((h) => [
        { id: userMsg.id, prompt: text, preview: response.split("\n").slice(0, 2).join(" "), timestamp: userMsg.timestamp },
        ...h,
      ].slice(0, 10));
      setThinking(false);
    }, 800);
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. How can I help you with recruiting today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.success("Chat cleared");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiting AI"
        description="Your AI assistant for sourcing, outreach, interviews and insights. Powered by simulated intelligence."
        actions={[{ label: "Clear chat", variant: "outline", onClick: clearChat }]}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Main chat */}
        <div className="lg:col-span-3">
          <SectionCard
            title="AI Assistant"
            description="Simulated AI — for demo only"
            contentClassName="p-0"
          >
            <div className="px-4 pt-2 pb-3 flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"><Bot className="h-3 w-3 mr-1" />Simulated AI</Badge>
              <Sparkles className="h-4 w-4 text-brand" />
            </div>
            <div className="flex flex-col h-[34rem]">
              <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-4 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      m.role === "user"
                        ? "bg-brand/10 text-brand"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-300"
                    }`}>
                      {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-xl border p-3 ${
                      m.role === "user"
                        ? "bg-brand/5 border-brand/20"
                        : "bg-muted/30"
                    }`}>
                      {m.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-muted-foreground">
                          <Bot className="h-3 w-3" />
                          <span>Simulated AI</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-pulse" />
                        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="h-2 w-2 rounded-full bg-amber-500/60 animate-pulse" style={{ animationDelay: "0.4s" }} />
                        <span className="text-xs text-muted-foreground ml-1">Simulated AI is thinking…</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="border-t p-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((qa) => {
                    const Icon = qa.icon;
                    return (
                      <button
                        key={qa.label}
                        onClick={() => send(qa.prompt)}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:border-brand hover:bg-muted/30 transition"
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded ${qa.color}`}>
                          <Icon className="h-3 w-3" />
                        </span>
                        {qa.label}
                      </button>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="flex items-end gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the Recruiting AI anything…"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    className="resize-none"
                  />
                  <Button onClick={() => send(input)} disabled={!input.trim() || thinking}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar: history + disclaimer */}
        <div className="space-y-4">
          <SectionCard title="Recent prompts" description="Your last 10 queries.">
            {history.length === 0 ? (
              <EmptyState
                icon={<History className="h-5 w-5" />}
                title="No history yet"
                description="Your prompts will appear here."
                className="py-6"
              />
            ) : (
              <div className="max-h-72 overflow-y-auto scroll-thin space-y-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => send(h.prompt)}
                    className="w-full text-left rounded-lg border p-2.5 hover:border-brand hover:bg-muted/30 transition"
                  >
                    <div className="text-xs font-medium line-clamp-1">{h.prompt}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{h.preview}</div>
                  </button>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground">
                <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Simulated AI disclaimer</div>
                All responses are simulated for demonstration. The production Recruiting AI will use retrieval-augmented generation over your real candidate, client and pipeline data. Always verify AI-suggested candidates and content before acting.
              </div>
            </div>
          </div>

          <SectionCard title="Capabilities">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-brand" />Candidate sourcing
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand" />Outreach drafting
              </div>
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-brand" />Interview prep
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-brand" />Fit summarization
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-brand" />Sourcing strategy
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
