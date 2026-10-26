"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { aiService } from "@/lib/mock-api";
import { PageHeader, SectionCard, Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, X, Sparkles, ShieldCheck, Save, Send, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import type { ScreeningQuestion, WorkArrangement, EmploymentType, Currency } from "@/lib/types";

const CATEGORIES = ["Engineering", "Product", "Design", "Data", "Sales", "Marketing", "Operations", "HR", "Finance"];
const INDUSTRIES = ["Information Technology", "Financial Services", "Healthcare", "Renewable Energy", "EdTech", "Logistics"];
const EMPLOYMENT_TYPES: EmploymentType[] = ["full-time", "part-time", "contract", "internship", "temporary", "freelance"];
const CURRENCIES: Currency[] = ["INR", "USD", "EUR", "GBP"];

interface BiasResult {
  biasTerms: string[];
  inclusivityScore: number;
  suggestions: string[];
}

export function EmployerCreateJob() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState<"edit" | "preview">("edit");

  // Basic
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState("Engineering");
  const [category, setCategory] = React.useState("Engineering");
  const [industry, setIndustry] = React.useState("Information Technology");
  const [requisitionId, setRequisitionId] = React.useState(`REQ-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  const [hiringManager, setHiringManager] = React.useState("Rohan Mehta");
  const [recruiter, setRecruiter] = React.useState("Sneha Reddy");
  const [budget, setBudget] = React.useState("");
  const [targetHireDate, setTargetHireDate] = React.useState("");

  // Location & work
  const [location, setLocation] = React.useState("Bengaluru, India");
  const [workArrangement, setWorkArrangement] = React.useState<WorkArrangement>("hybrid");
  const [employmentType, setEmploymentType] = React.useState<EmploymentType>("full-time");

  // Compensation
  const [salaryMin, setSalaryMin] = React.useState("");
  const [salaryMax, setSalaryMax] = React.useState("");
  const [currency, setCurrency] = React.useState<Currency>("INR");
  const [showSalary, setShowSalary] = React.useState(true);

  // Requirements
  const [experienceMin, setExperienceMin] = React.useState("");
  const [experienceMax, setExperienceMax] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [newSkill, setNewSkill] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState<string[]>([]);
  const [newResp, setNewResp] = React.useState("");
  const [requirements, setRequirements] = React.useState<string[]>([]);
  const [newReq, setNewReq] = React.useState("");
  const [niceToHave, setNiceToHave] = React.useState<string[]>([]);
  const [newNice, setNewNice] = React.useState("");
  const [benefits, setBenefits] = React.useState<string[]>(["Health insurance", "Stock options", "Hybrid work", "Learning budget"]);
  const [newBenefit, setNewBenefit] = React.useState("");

  // Screening questions
  const [questions, setQuestions] = React.useState<ScreeningQuestion[]>([]);

  const [aiLoading, setAiLoading] = React.useState(false);
  const [biasLoading, setBiasLoading] = React.useState(false);
  const [bias, setBias] = React.useState<BiasResult | null>(null);
  const [aiBadge, setAiBadge] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const addSkill = () => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(""); } };
  const addQuestion = () => setQuestions([...questions, { id: `q_${Date.now()}`, question: "", type: "text", required: false, knockout: false }]);
  const updateQuestion = (id: string, patch: Partial<ScreeningQuestion>) => setQuestions(questions.map((q) => q.id === id ? { ...q, ...patch } : q));

  const generateAI = async () => {
    if (!title || !department) { toast.error("Add a title and department first"); return; }
    setAiLoading(true);
    try {
      const res = await aiService.generateJobDescription(title, department);
      setDescription(res.description);
      setResponsibilities(res.responsibilities);
      setRequirements(res.requirements);
      setAiBadge(true);
      toast.success("AI generated description, responsibilities, and requirements", { description: "Simulated AI — review and edit before publishing." });
    } finally {
      setAiLoading(false);
    }
  };

  const checkBias = async () => {
    if (!description) { toast.error("Add a description first"); return; }
    setBiasLoading(true);
    try {
      const res = await aiService.checkBias(description);
      setBias({ biasTerms: res.biasTerms, inclusivityScore: res.inclusivityScore, suggestions: res.suggestions });
      toast.success(`Inclusivity score: ${res.inclusivityScore}/100`, { description: "Simulated AI bias check." });
    } finally {
      setBiasLoading(false);
    }
  };

  const completeness = React.useMemo(() => {
    let n = 0;
    const total = 10;
    if (title) n++;
    if (department) n++;
    if (location) n++;
    if (salaryMin && salaryMax) n++;
    if (description.length > 50) n++;
    if (responsibilities.length >= 3) n++;
    if (requirements.length >= 3) n++;
    if (skills.length >= 3) n++;
    if (questions.length >= 1) n++;
    if (benefits.length >= 1) n++;
    return Math.round((n / total) * 100);
  }, [title, department, location, salaryMin, salaryMax, description, responsibilities.length, requirements.length, skills.length, questions.length, benefits.length]);

  const save = (publish: boolean) => {
    if (!title) { toast.error("Job title is required"); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(publish ? "Job published" : "Saved as draft", { description: publish ? "Your job is now live." : "You can publish later from Jobs." });
      navigate("employer", "jobs");
    }, 600);
  };

  const inputCls = "w-full";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create a job"
        description="Build a compelling, inclusive job posting. Use AI to draft faster."
        actions={[
          { label: "Save draft", icon: "Save", variant: "outline", onClick: () => save(false) },
          { label: "Publish", icon: "Send", onClick: () => save(true) },
        ]}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "edit" | "preview")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="edit">Editor</TabsTrigger>
            <TabsTrigger value="preview"><Eye className="mr-1 h-3 w-3" /> Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Completeness</span>
            <Progress value={completeness} className="w-24 h-2" />
            <span className="font-medium">{completeness}%</span>
          </div>
        </div>

        <TabsContent value="edit" className="mt-4 space-y-6">
          {/* Basic */}
          <SectionCard title="Basic information" description="Core details about this role">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Job title *</Label>
                <Input placeholder="e.g. Senior Frontend Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Requisition ID</Label>
                <Input value={requisitionId} onChange={(e) => setRequisitionId(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Hiring manager</Label>
                <Input value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Recruiter</Label>
                <Input value={recruiter} onChange={(e) => setRecruiter(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Budget (annual)</Label>
                <Input type="number" placeholder="e.g. 2800000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Target hire date</Label>
                <Input type="date" value={targetHireDate} onChange={(e) => setTargetHireDate(e.target.value)} />
              </div>
            </div>
          </SectionCard>

          {/* Location & work */}
          <SectionCard title="Location & work arrangement">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Employment type</Label>
                <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as EmploymentType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EMPLOYMENT_TYPES.map((e) => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Work arrangement</Label>
                <RadioGroup value={workArrangement} onValueChange={(v) => setWorkArrangement(v as WorkArrangement)} className="flex gap-4">
                  {(["remote", "hybrid", "onsite"] as WorkArrangement[]).map((w) => (
                    <Label key={w} htmlFor={`wa-${w}`} className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 has-[:checked]:border-brand has-[:checked]:bg-brand/5 capitalize text-sm">
                      <RadioGroupItem id={`wa-${w}`} value={w} /> {w}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </SectionCard>

          {/* Compensation */}
          <SectionCard title="Compensation">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Salary min</Label>
                <Input type="number" placeholder="1800000" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Salary max</Label>
                <Input type="number" placeholder="2800000" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={showSalary} onCheckedChange={setShowSalary} /> Show salary to candidates
                </Label>
              </div>
            </div>
          </SectionCard>

          {/* Requirements + Description + AI */}
          <SectionCard
            title="Description, responsibilities & requirements"
            description="Tell candidates what the role involves"
            action={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={checkBias} disabled={biasLoading}>
                  <ShieldCheck className="mr-2 h-3 w-3" /> {biasLoading ? "Checking…" : "Check bias"}
                </Button>
                <Button size="sm" onClick={generateAI} disabled={aiLoading}>
                  <Sparkles className="mr-2 h-3 w-3" /> {aiLoading ? "Generating…" : "AI Generate"}
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              {aiBadge && (
                <div className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/5 p-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  <span className="font-medium">Simulated AI</span>
                  <span className="text-muted-foreground">— content drafted by AI. Review and edit before publishing.</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea rows={5} placeholder="Describe the role, team, and impact…" value={description} onChange={(e) => { setDescription(e.target.value); setAiBadge(false); }} />
              </div>

              {bias && (
                <Card className={bias.inclusivityScore >= 90 ? "border-emerald-500/40" : "border-amber-500/40"}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      {bias.inclusivityScore >= 90 ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                      <span className="text-sm font-medium">Inclusivity score: {bias.inclusivityScore}/100</span>
                      <Badge variant="outline" className="ml-auto">Simulated AI</Badge>
                    </div>
                    {bias.suggestions.length > 0 ? (
                      <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
                        {bias.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">No biased language detected. Great job!</p>
                    )}
                  </CardContent>
                </Card>
              )}

              <ListEditor label="Responsibilities" items={responsibilities} setItems={setResponsibilities} newValue={newResp} setNewValue={setNewResp} placeholder="Add a responsibility…" />
              <ListEditor label="Requirements" items={requirements} setItems={setRequirements} newValue={newReq} setNewValue={setNewReq} placeholder="Add a requirement…" />
              <ListEditor label="Nice to have" items={niceToHave} setItems={setNiceToHave} newValue={newNice} setNewValue={setNewNice} placeholder="Add a nice-to-have…" />
              <ListEditor label="Benefits" items={benefits} setItems={setBenefits} newValue={newBenefit} setNewValue={setNewBenefit} placeholder="Add a benefit…" />

              <div className="space-y-1.5">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {s}
                      <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add a skill…" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                  <Button size="icon" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Min experience (years)</Label>
                  <Input type="number" value={experienceMin} onChange={(e) => setExperienceMin(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Max experience (years)</Label>
                  <Input type="number" value={experienceMax} onChange={(e) => setExperienceMax(e.target.value)} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Screening questions */}
          <SectionCard
            title="Screening questions"
            description="Filter applicants early. Knockout questions auto-reject non-qualifying answers."
            action={<Button size="sm" variant="outline" onClick={addQuestion}><Plus className="mr-2 h-3 w-3" /> Add question</Button>}
          >
            {questions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No questions yet. Add screening or knockout questions to filter candidates.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <Card key={q.id}>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground mt-2">{i + 1}.</span>
                        <Input placeholder="Question text…" value={q.question} onChange={(e) => updateQuestion(q.id, { question: e.target.value })} className={inputCls} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => setQuestions(questions.filter((x) => x.id !== q.id))}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pl-5">
                        <Select value={q.type} onValueChange={(v) => updateQuestion(q.id, { type: v as ScreeningQuestion["type"] })}>
                          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="choice">Choice</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <Switch checked={q.required} onCheckedChange={(c) => updateQuestion(q.id, { required: c })} /> Required
                        </Label>
                        <Label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <Switch checked={!!q.knockout} onCheckedChange={(c) => updateQuestion(q.id, { knockout: c })} /> Knockout
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate("employer", "jobs")}>Cancel</Button>
            <Button variant="outline" onClick={() => save(false)} disabled={saving}><Save className="mr-2 h-4 w-4" /> Save draft</Button>
            <Button onClick={() => save(true)} disabled={saving}><Send className="mr-2 h-4 w-4" /> Publish</Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{title || "Untitled role"}</h2>
                <p className="text-sm text-muted-foreground">{department} · {location} · {workArrangement} · {employmentType}</p>
              </div>
              <Separator />
              {description && <p className="text-sm">{description}</p>}
              {responsibilities.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Responsibilities</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    {responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {requirements.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    {requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {skills.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
                  </div>
                </div>
              )}
              {showSalary && salaryMin && salaryMax && (
                <p className="text-sm font-medium">Salary: {currency} {Number(salaryMin).toLocaleString("en-IN")} – {Number(salaryMax).toLocaleString("en-IN")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListEditor({ label, items, setItems, newValue, setNewValue, placeholder }: { label: string; items: string[]; setItems: (v: string[]) => void; newValue: string; setNewValue: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-sm">
            <span className="flex-1">{it}</span>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input placeholder={placeholder} value={newValue} onChange={(e) => setNewValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newValue.trim()) { setItems([...items, newValue.trim()]); setNewValue(""); } }} />
          <Button size="icon" onClick={() => { if (newValue.trim()) { setItems([...items, newValue.trim()]); setNewValue(""); } }}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
