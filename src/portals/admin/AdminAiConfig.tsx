"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { aiService } from "@/lib/mock-api";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries, SimulatedBadge } from "./_shared";

const PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], connected: true },
  { id: "anthropic", name: "Anthropic", models: ["claude-3.5-sonnet", "claude-3-opus", "claude-3-haiku"], connected: false },
  { id: "local", name: "Local (Ollama)", models: ["llama3.1:70b", "mistral:7b", "qwen2.5:14b"], connected: true },
];

const TEMPLATES = [
  { id: "jd_gen", name: "Job Description Generation", feature: "JD generation", updated: "2024-10-12" },
  { id: "resume_parse", name: "Resume Parsing", feature: "Resume parse", updated: "2024-09-30" },
  { id: "match", name: "Candidate Match Scoring", feature: "Match", updated: "2024-10-08" },
  { id: "iv_qs", name: "Interview Question Generation", feature: "Interview Qs", updated: "2024-10-15" },
  { id: "bias", name: "Bias Check", feature: "Bias check", updated: "2024-10-18" },
  { id: "comm_draft", name: "Communication Drafting", feature: "Communication draft", updated: "2024-10-05" },
];

const VERSIONS = [
  { id: "v4", version: "v4", author: "Aarav Sharma", at: "2024-10-18T10:00:00Z", note: "Tightened bias-check instructions" },
  { id: "v3", version: "v3", author: "Sneha Reddy", at: "2024-10-08T10:00:00Z", note: "Added inclusive-language examples" },
  { id: "v2", version: "v2", author: "Aarav Sharma", at: "2024-09-30T10:00:00Z", note: "Initial production prompt" },
];

const EVAL_CASES = [
  { id: "ec1", name: "Senior Frontend JD", input: "React, 6y, Bangalore", expected: "Includes responsibilities, requirements, inclusive language", status: "pass" },
  { id: "ec2", name: "Resume parse — senior PM", input: "resume_pm_v3.pdf", expected: "Name, headline, 5 skills, education", status: "pass" },
  { id: "ec3", name: "Bias check — aggressive lang", input: "We need a rockstar ninja...", expected: "Flags 'rockstar', 'ninja'", status: "pass" },
  { id: "ec4", name: "Interview Qs — technical", input: "Backend engineer, technical", expected: "4 questions, system-design focus", status: "fail" },
];

export function AdminAiConfig() {
  const [activeTemplate, setActiveTemplate] = React.useState(TEMPLATES[0]);
  const [promptText, setPromptText] = React.useState(DEFAULT_PROMPT);
  const [testRunning, setTestRunning] = React.useState(false);
  const [testResults, setTestResults] = React.useState<Record<string, "pass" | "fail" | undefined>>({});
  const [features, setFeatures] = React.useState<Record<string, boolean>>({
    jd_gen: true, resume_parse: true, match: true, iv_qs: true, bias: true, comm_draft: false,
  });

  const runTest = async (id: string) => {
    setTestRunning(true);
    setTestResults((p) => ({ ...p, [id]: undefined }));
    await new Promise((r) => setTimeout(r, 900));
    setTestResults((p) => ({ ...p, [id]: Math.random() > 0.25 ? "pass" : "fail" }));
    setTestRunning(false);
    toast.success("Evaluation complete (simulated)", { description: `Case ${id} executed.` });
  };

  const usageByFeature = [
    { name: "JD Gen", tokens: 42000, requests: 240, cost: 12.4 },
    { name: "Resume", tokens: 86000, requests: 540, cost: 28.1 },
    { name: "Match", tokens: 120000, requests: 1840, cost: 38.2 },
    { name: "Interview", tokens: 18000, requests: 120, cost: 5.8 },
    { name: "Bias", tokens: 9000, requests: 320, cost: 2.1 },
  ];
  const tokenTrend = makeSeries("tokens", 14, 28000, 8000).map((p) => ({ ...p, value: p.value }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Configuration"
        description="Configure AI providers, prompt templates, evaluations, and monitor usage."
        icon={<Icon name="Cpu" className="h-6 w-6" />}
        actions={[{ label: "Save all", onClick: () => toast.success("All AI config saved") }]}
      />

      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm">
        <SimulatedBadge />
        <span className="text-muted-foreground">All AI features in this prototype are simulated. No real model calls are made.</span>
      </div>

      <Tabs defaultValue="providers">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="templates">Prompt Templates</TabsTrigger>
          <TabsTrigger value="evals">Evaluation Cases</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="usage">Usage Monitoring</TabsTrigger>
          <TabsTrigger value="toggles">Feature Toggles</TabsTrigger>
        </TabsList>

        {/* PROVIDERS */}
        <TabsContent value="providers" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {PROVIDERS.map((p) => (
              <SectionCard key={p.id} title={p.name} description={p.connected ? "Connected" : "Not connected"}>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">API key</Label>
                    <Input type="password" defaultValue="sk-xxxxxxxxxxxxxxxxxxxx" className="mt-1 font-mono text-xs" />
                  </div>
                  <div>
                    <Label className="text-xs">Default model</Label>
                    <Select defaultValue={p.models[0]}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {p.models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={p.connected ? "default" : "outline"} className={p.connected ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>
                      {p.connected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Test connection to ${p.name} (simulated)`, { description: "Latency: 142ms · OK" })}>Test connection</Button>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Keys are stored encrypted at rest and never logged. Rotation recommended every 90 days.</p>
        </TabsContent>

        {/* TEMPLATES */}
        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Templates" description="Select a template to edit.">
              <ul className="space-y-1">
                {TEMPLATES.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => { setActiveTemplate(t); setPromptText(DEFAULT_PROMPT); }}
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${activeTemplate.id === t.id ? "border-brand bg-brand/5" : "hover:bg-muted/50"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{t.name}</span>
                        <span className="text-xs text-muted-foreground">{t.feature}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{t.updated}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard className="lg:col-span-2" title={`Editor — ${activeTemplate.name}`}
              description={`Feature: ${activeTemplate.feature}`}
              action={<div className="flex items-center gap-2"><SimulatedBadge /><Button size="sm" onClick={() => toast.success("Template saved", { description: `New version created for ${activeTemplate.name}.` })}>Save</Button></div>}>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tpl-prompt">Prompt (system + instructions)</Label>
                  <Textarea id="tpl-prompt" value={promptText} onChange={(e) => setPromptText(e.target.value)} rows={10} className="mt-1 font-mono text-xs" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={async () => {
                    toast.info("Running prompt (simulated)...");
                    await aiService.generateJobDescription("Engineer", "Engineering");
                    toast.success("Output preview ready (simulated)");
                  }}>Run preview</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Restored to previous version")}>Restore previous</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.info("Diff view opened")}>View diff</Button>
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* EVALS */}
        <TabsContent value="evals" className="space-y-4 mt-4">
          <SectionCard title="Evaluation cases" description="Test prompt templates against expected outputs." action={<Button size="sm" variant="outline" onClick={() => toast.info("New case form (demo)")}>Add case</Button>}>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Expected output</TableHead>
                    <TableHead>Last result</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EVAL_CASES.map((c) => {
                    const result = testResults[c.id] ?? c.status;
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="text-sm font-medium">{c.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.input}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[18rem]">{c.expected}</TableCell>
                        <TableCell>
                          {result === "pass" ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Pass</Badge> :
                           result === "fail" ? <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Fail</Badge> :
                           <Badge variant="outline">Pending</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled={testRunning} onClick={() => runTest(c.id)}>
                            {testRunning ? "Running…" : "Run"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* VERSIONS */}
        <TabsContent value="versions" className="space-y-4 mt-4">
          <SectionCard title="Version history" description="Audit trail of prompt changes.">
            <ul className="space-y-2">
              {VERSIONS.map((v, i) => (
                <li key={v.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={i === 0 ? "default" : "outline"}>{v.version}</Badge>
                      <span className="text-sm font-medium">{v.author}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(v.at)}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Diff ${v.version} ↔ current`)}>Diff</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Restored to ${v.version}`)}>Restore</Button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{v.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        {/* USAGE */}
        <TabsContent value="usage" className="space-y-4 mt-4">
          <div className="flex items-center gap-2"><SimulatedBadge /><span className="text-xs text-muted-foreground">Usage data is simulated for this prototype.</span></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatBox label="Tokens (30d)" value="275K" delta="+12%" />
            <StatBox label="Requests (30d)" value="3,060" delta="+8%" />
            <StatBox label="Cost (30d)" value="₹8,640" delta="+5%" />
            <StatBox label="Avg. latency" value="1.4s" delta="-0.1s" deltaPositive />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Tokens (14d)" description="Daily token usage">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenTrend} margin={{ left: -16, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="gTok" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS[4]} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS[4]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="value" name="Tokens" stroke={CHART_COLORS[4]} strokeWidth={2} fill="url(#gTok)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="By feature (30d)" description="Requests per feature">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageByFeature} margin={{ left: -16, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="requests" name="Requests" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* FEATURE TOGGLES */}
        <TabsContent value="toggles" className="space-y-4 mt-4">
          <SectionCard title="Feature toggles" description="Enable or disable AI features platform-wide.">
            <ul className="space-y-2">
              {TEMPLATES.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-md border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.feature}</p>
                  </div>
                  <Switch checked={features[t.id]} onCheckedChange={(v) => { setFeatures((p) => ({ ...p, [t.id]: v })); toast.success(`${t.name} ${v ? "enabled" : "disabled"}`); }} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const DEFAULT_PROMPT = `You are an expert recruiter assistant. Generate structured, inclusive content.

Rules:
- Use neutral, bias-free language
- Be specific and concise
- Output valid JSON when schema is provided
- Cite candidate profile data when matching
- Never invent facts; if uncertain, say so

Variables: {{job_title}}, {{department}}, {{candidate_skills}}`;

function StatBox({ label, value, delta, deltaPositive = true }: { label: string; value: string; delta?: string; deltaPositive?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {delta && <p className={`mt-1 text-xs font-medium ${deltaPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{deltaPositive ? "▲" : "▼"} {delta}</p>}
    </div>
  );
}
