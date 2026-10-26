"use client";

import * as React from "react";
import { lmsAiService } from "@/lib/mock-api";
import { trainingCourses } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TenantDisclaimer, SimulatedAiBadge } from "./_shared";
import { toast } from "sonner";
import { Sparkles, Send, BookOpen, GitBranch, Brain, Lightbulb, Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  action?: string;
}

const QUICK_ACTIONS = [
  { label: "Generate course outline", icon: BookOpen, prompt: "Generate a course outline for 'Advanced TypeScript Patterns'", action: "outline" as const },
  { label: "Recommend courses for learner", icon: Lightbulb, prompt: "Recommend courses for learner e_001", action: "recommend" as const },
  { label: "Analyze skill gaps", icon: GitBranch, prompt: "Analyze skill gaps for TechCorp India", action: "skills" as const },
  { label: "Generate quiz questions", icon: Brain, prompt: "Generate 5 quiz questions on Kubernetes networking", action: "quiz" as const },
];

export function TrainingAiAssistant() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: (
        <div>
          <p>Hi! I'm your AI Learning Assistant. I can help with:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Generating course outlines and curricula</li>
            <li>• Recommending courses for specific learners</li>
            <li>• Analyzing skill gaps across client teams</li>
            <li>• Drafting quiz questions and assessment items</li>
          </ul>
          <p className="mt-2 text-xs">Try a quick action below, or type your own request.</p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleAction(action: "outline" | "recommend" | "skills" | "quiz", prompt: string) {
    setInput("");
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: "user", content: prompt, action };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      let responseNode: React.ReactNode;
      if (action === "outline") {
        const result = await lmsAiService.generateCourseOutline("Advanced TypeScript Patterns", "Technology");
        responseNode = (
          <div>
            <p className="mb-2 font-medium">Here's a suggested outline:</p>
            <ol className="space-y-2">
              {result.modules.map((m, i) => (
                <li key={i} className="rounded-lg border p-2">
                  <p className="text-sm font-medium">{i + 1}. {m.title}</p>
                  <ul className="mt-1 ml-4 space-y-0.5">
                    {m.lessons.map((l, j) => <li key={j} className="text-xs text-muted-foreground">• {l}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">Objectives: {result.objectives.join(" · ")}</p>
          </div>
        );
      } else if (action === "recommend") {
        const result = await lmsAiService.recommendCourses("e_001");
        responseNode = (
          <div>
            <p className="mb-2 font-medium">Based on the learner's profile ({result.completedCount} completed, {result.inProgressCount} in progress), I recommend:</p>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.course.name}</p>
                    <Badge variant="outline" className="text-xs">{r.matchScore}% match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      } else if (action === "skills") {
        const result = await lmsAiService.skillGapAnalysis("cc_001");
        responseNode = (
          <div>
            <p className="mb-2 font-medium">For TechCorp India, I detected {result.gaps.length} skill gaps:</p>
            <ul className="space-y-1.5">
              {result.gaps.map((g) => (
                <li key={g.skillId} className="rounded-lg border p-2 text-sm">
                  <span className="font-medium">{g.skillName}</span> — gap of {g.gap} level(s), {g.employeesAffected} employees affected
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">Priority skills: {result.prioritySkills.join(", ")}</p>
          </div>
        );
      } else {
        // quiz generation — simulated inline
        await new Promise((r) => setTimeout(r, 800));
        responseNode = (
          <div>
            <p className="mb-2 font-medium">Here are 5 generated quiz questions on Kubernetes networking:</p>
            <ol className="space-y-2">
              {[
                "What is the default network plugin in Kubernetes? (a) Flannel (b) Calico (c) Both A and B (d) None",
                "What does a Kubernetes Service of type ClusterIP do? (a) Exposes externally (b) Internal cluster IP (c) Load balances (d) Routes DNS",
                "Which resource controls traffic between pods? (a) Deployment (b) NetworkPolicy (c) Ingress (d) Service",
                "What is the purpose of kube-proxy? (a) DNS resolution (b) Service VIP implementation (c) Container runtime (d) API server proxy",
                "Which port does the Kubernetes API server listen on by default? (a) 6443 (b) 8080 (c) 443 (d) 8443",
              ].map((q, i) => (
                <li key={i} className="rounded-lg border p-2 text-sm">{q}</li>
              ))}
            </ol>
          </div>
        );
      }
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: responseNode,
        action,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      toast.error("AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function send() {
    if (!input.trim()) return;
    // Route based on keywords; default to outline
    const lower = input.toLowerCase();
    if (lower.includes("outline") || lower.includes("course")) {
      handleAction("outline", input);
    } else if (lower.includes("recommend")) {
      handleAction("recommend", input);
    } else if (lower.includes("skill") || lower.includes("gap")) {
      handleAction("skills", input);
    } else if (lower.includes("quiz") || lower.includes("question")) {
      handleAction("quiz", input);
    } else {
      // echo as a simulated answer
      setMessages((m) => [...m, { id: `u_${Date.now()}`, role: "user", content: input }]);
      setLoading(true);
      setTimeout(() => {
        setMessages((m) => [...m, {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: <p>I can help with course outlines, course recommendations, skill gap analysis, or quiz generation. Try one of the quick actions below, or rephrase your request.</p>,
        }]);
        setLoading(false);
      }, 700);
    }
  }

  function clear() {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: <p>Conversation cleared. How can I help?</p>,
    }]);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Learning Assistant"
        description="Simulated AI assistant for course design, recommendations, and analysis."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[{ label: "Clear", icon: "Trash2", variant: "outline", onClick: clear }]}
      />
      <TenantDisclaimer />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          <SimulatedAiBadge className="mr-1.5" />
          This assistant is simulated for demonstration. Responses are generated from mock data. In production, this would call a real LLM with access to your training data.
        </p>
      </div>

      {/* Chat */}
      <SectionCard>
        <div ref={scrollRef} className="max-h-[500px] min-h-[400px] overflow-y-auto scroll-thin space-y-4 pr-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-brand text-white" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                {m.role === "user" ? <AvatarLogo text="You" size="xs" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === "user" ? "bg-brand/10 text-foreground" : "border bg-card"}`}>
                {m.role === "assistant" && m.action && <SimulatedAiBadge className="mb-2" />}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground">
                Analyzing<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
          {QUICK_ACTIONS.map((qa) => (
            <Button key={qa.action} variant="outline" size="sm" onClick={() => handleAction(qa.action, qa.prompt)} disabled={loading}>
              <qa.icon className="mr-1 h-3 w-3" />
              {qa.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2 border-t pt-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about course design, recommendations, or analysis..."
            disabled={loading}
          />
          <Button onClick={send} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SectionCard>

      {/* Hint cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Try: Generate outline", hint: '"Generate a course outline for Production Go Microservices"', icon: BookOpen },
          { label: "Try: Skill gaps", hint: '"Analyze skill gaps for FinEdge Solutions"', icon: GitBranch },
          { label: "Try: Recommendations", hint: '"Recommend courses for learner e_002"', icon: Lightbulb },
          { label: "Try: Quiz generation", hint: '"Generate 5 questions on React 19 features"', icon: Brain },
        ].map((h) => (
          <div key={h.label} className="rounded-lg border p-3">
            <h.icon className="h-4 w-4 text-brand mb-1.5" />
            <p className="text-xs font-medium">{h.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{h.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
