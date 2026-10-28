"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Provider {
  id: string; name: string; model: string; cost1K: number; latencyMs: number; status: "active" | "standby"; health: number;
}

const PROVIDERS: Provider[] = [
  { id: "pr_001", name: "OpenAI", model: "gpt-4o", cost1K: 5, latencyMs: 1840, status: "active", health: 41 },
  { id: "pr_002", name: "Anthropic", model: "claude-3-5-sonnet", cost1K: 3, latencyMs: 920, status: "standby", health: 99 },
  { id: "pr_003", name: "OpenAI", model: "gpt-4o-mini", cost1K: 0.15, latencyMs: 420, status: "active", health: 99 },
  { id: "pr_004", name: "Mistral", model: "mistral-large", cost1K: 2, latencyMs: 680, status: "standby", health: 98 },
];

const TEMPLATES = [
  { id: "apt_001", name: "Job Description Generator", tokens: 1240, uses: 4_820 },
  { id: "apt_002", name: "Resume Optimizer", tokens: 2180, uses: 18_400 },
  { id: "apt_003", name: "Candidate Match Explainer", tokens: 940, uses: 12_180 },
  { id: "apt_004", name: "Interview Question Bank", tokens: 820, uses: 6_400 },
  { id: "apt_005", name: "Offer Letter Drafter", tokens: 1480, uses: 1_240 },
];

export function SuperAdminAiConfig() {
  const [provider, setProvider] = React.useState("OpenAI GPT-4o");
  const [model, setModel] = React.useState("gpt-4o");
  const [costCap, setCostCap] = React.useState("5000");
  const [fallback, setFallback] = React.useState(true);
  const [promptBody, setPromptBody] = React.useState(`You are an expert technical recruiter.

Given a job description and a candidate profile, return:
1. Match score (0-100)
2. Top 3 strengths
3. Top 3 gaps
4. Recommended interview questions

Output as JSON.`);

  const save = () => toast.success("AI configuration saved");

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Configuration"
        description="LLM provider, model selection, prompt templates, cost caps, and failover policies."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[{ label: "Test Inference", variant: "outline", onClick: () => toast.success("Test inference request sent") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Provider" value="OpenAI" icon={<Icon name="Sparkles" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Tokens (30d)" value="48.2M" icon={<Icon name="Activity" className="h-5 w-5" />} />
        <StatCard label="Cost (30d)" value={formatCurrency(2_18_400)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Latency" value="1.4s" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Provider & Model" description="Primary inference configuration" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Primary provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI GPT-4o">OpenAI GPT-4o</SelectItem>
                  <SelectItem value="OpenAI GPT-4o-mini">OpenAI GPT-4o-mini</SelectItem>
                  <SelectItem value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="Mistral Large">Mistral Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Model ID</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Monthly cost cap (₹)</Label>
              <Input type="number" value={costCap} onChange={(e) => setCostCap(e.target.value)} className="mt-1" />
              <p className="mt-0.5 text-[10px] text-muted-foreground">Hard cap — inference stops above this</p>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Auto-failover</p>
                <p className="text-xs text-muted-foreground">Switch to standby on errors</p>
              </div>
              <Switch checked={fallback} onCheckedChange={setFallback} />
            </div>
            <Button className="w-full" onClick={save}>Save Configuration</Button>
          </div>
        </SectionCard>

        <SectionCard title="Provider Health" description="Real-time LLM provider status" className="lg:col-span-2">
          <div className="space-y-2">
            {PROVIDERS.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-md border bg-card p-3">
                <div className="flex items-center gap-3">
                  <Icon name="Sparkles" className="h-4 w-4 text-brand" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant="outline" className="text-[10px]">{p.model}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">${p.cost1K.toFixed(2)}/1K tokens • {p.latencyMs}ms latency</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Health</div>
                    <div className={`font-medium ${p.health >= 95 ? "text-emerald-600 dark:text-emerald-400" : p.health >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{p.health}%</div>
                  </div>
                  <Badge variant="outline" className={p.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground"}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Prompt Templates" description="System prompts used across features">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => toast.info(`Loaded ${t.name}`)} className="w-full rounded-md border bg-card p-3 text-left hover:bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.name}</span>
                  <Badge variant="outline" className="text-[10px]">{t.uses.toLocaleString("en-IN")} uses</Badge>
                </div>
                <div className="text-xs text-muted-foreground">~{t.tokens} tokens avg</div>
              </button>
            ))}
          </div>
          <div className="rounded-md border bg-card p-3">
            <Label className="text-xs">Prompt body</Label>
            <Textarea value={promptBody} onChange={(e) => setPromptBody(e.target.value)} rows={10} className="mt-1 font-mono text-xs" />
            <Button size="sm" className="mt-2" onClick={() => toast.success("Prompt saved")}>Save Prompt</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
