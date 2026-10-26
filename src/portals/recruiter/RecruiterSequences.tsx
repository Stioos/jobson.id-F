"use client";

import * as React from "react";
import {
  Workflow, Mail, MessageCircle, Phone, Plus, Play, Pause, Clock, CheckCircle2, TrendingUp, Users, Target, ChevronRight, Pencil, Copy,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type StepType = "email" | "whatsapp" | "call" | "task";

interface Step {
  id: string;
  day: number;
  type: StepType;
  title: string;
  body: string;
  sent: number;
  opened: number;
  replied: number;
}

interface Sequence {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  enrolled: number;
  active: number;
  completed: number;
  converted: number;
  steps: Step[];
}

const MOCK_SEQUENCES: Sequence[] = [
  { id: "s1", name: "Senior React Devs — Q4 outreach", description: "5-step drip for senior frontend engineers in Bengaluru.", status: "active", enrolled: 124, active: 38, completed: 86, converted: 14, steps: [
    { id: "st1", day: 0, type: "email", title: "Initial outreach", body: "Hi {{name}}, found your React work impressive…", sent: 124, opened: 98, replied: 32 },
    { id: "st2", day: 2, type: "whatsapp", title: "WhatsApp follow-up", body: "Hi {{name}}, did you see my email about TechCorp?", sent: 92, opened: 88, replied: 22 },
    { id: "st3", day: 5, type: "call", title: "Discovery call task", body: "30-min call to walk through role & compensation.", sent: 70, opened: 70, replied: 28 },
    { id: "st4", day: 7, type: "email", title: "Follow-up with JD", body: "Sharing the detailed JD and compensation breakdown…", sent: 42, opened: 38, replied: 14 },
  ] },
  { id: "s2", name: "DevOps passive talent", description: "Nurture passive DevOps candidates over 14 days.", status: "active", enrolled: 86, active: 22, completed: 64, converted: 8, steps: [
    { id: "st1", day: 0, type: "email", title: "Intro & value prop", body: "Hi {{name}}, your K8s experience is rare…", sent: 86, opened: 64, replied: 18 },
    { id: "st2", day: 3, type: "whatsapp", title: "Casual WhatsApp nudge", body: "Hey {{name}}, quick follow-up…", sent: 68, opened: 64, replied: 12 },
    { id: "st3", day: 7, type: "task", title: "LinkedIn engage", body: "Engage with last 3 LinkedIn posts.", sent: 50, opened: 50, replied: 8 },
    { id: "st4", day: 14, type: "email", title: "Final follow-up", body: "Last attempt — closing the loop.", sent: 32, opened: 28, replied: 4 },
  ] },
  { id: "s3", name: "ML Engineers — AI startups", description: "Cold outreach to ML engineers at AI-first startups.", status: "paused", enrolled: 64, active: 0, completed: 64, converted: 6, steps: [
    { id: "st1", day: 0, type: "email", title: "Initial outreach", body: "Hi {{name}}, AI startup opportunity…", sent: 64, opened: 48, replied: 14 },
    { id: "st2", day: 4, type: "call", title: "Quick intro call", body: "15-min intro to align on role.", sent: 30, opened: 30, replied: 10 },
    { id: "st3", day: 8, type: "whatsapp", title: "WhatsApp reminder", body: "Hi {{name}}, just checking in…", sent: 20, opened: 18, replied: 4 },
  ] },
  { id: "s4", name: "Backend — FinEdge mandate", description: "Targeted for FinEdge Solutions backend mandate.", status: "active", enrolled: 42, active: 18, completed: 24, converted: 5, steps: [
    { id: "st1", day: 0, type: "email", title: "Role intro", body: "Backend role at FinEdge — pure-play fintech…", sent: 42, opened: 34, replied: 10 },
    { id: "st2", day: 3, type: "call", title: "Tech screen call", body: "30-min tech screen with hiring manager.", sent: 18, opened: 18, replied: 6 },
  ] },
  { id: "s5", name: "Cloud Architects — SecureBank", description: "Senior cloud architects for SecureBank migration.", status: "draft", enrolled: 0, active: 0, completed: 0, converted: 0, steps: [
    { id: "st1", day: 0, type: "email", title: "Initial outreach", body: "Hi {{name}}, SecureBank cloud migration lead role…", sent: 0, opened: 0, replied: 0 },
    { id: "st2", day: 2, type: "whatsapp", title: "WhatsApp follow-up", body: "Hi {{name}}, did you see my email?", sent: 0, opened: 0, replied: 0 },
    { id: "st3", day: 5, type: "call", title: "Discovery call", body: "45-min discovery & culture fit call.", sent: 0, opened: 0, replied: 0 },
  ] },
];

export function RecruiterSequences() {
  const [sequences, setSequences] = React.useState<Sequence[]>(MOCK_SEQUENCES);
  const [activeId, setActiveId] = React.useState<string>(MOCK_SEQUENCES[0].id);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newStepType, setNewStepType] = React.useState<StepType>("email");
  const [newStepDay, setNewStepDay] = React.useState(0);
  const [newStepTitle, setNewStepTitle] = React.useState("");
  const [newStepBody, setNewStepBody] = React.useState("");

  const active = sequences.find((s) => s.id === activeId)!;

  function toggleStatus(id: string) {
    setSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s))
    );
    const s = sequences.find((x) => x.id === id);
    if (s) toast.success(s.status === "active" ? "Sequence paused" : "Sequence activated", { description: s.name });
  }

  function duplicate(id: string) {
    const s = sequences.find((x) => x.id === id);
    if (!s) return;
    const copy: Sequence = { ...s, id: `s${Date.now()}`, name: `${s.name} (copy)`, status: "draft", enrolled: 0, active: 0, completed: 0, converted: 0, steps: s.steps.map((st) => ({ ...st, id: `st${Date.now()}_${st.id}`, sent: 0, opened: 0, replied: 0 })) };
    setSequences((prev) => [copy, ...prev]);
    toast.success("Sequence duplicated", { description: s.name });
  }

  function createSequence() {
    if (!newName.trim()) { toast.error("Enter a sequence name"); return; }
    const newSeq: Sequence = {
      id: `s${Date.now()}`,
      name: newName,
      description: newDesc || "Newly created sequence.",
      status: "draft",
      enrolled: 0,
      active: 0,
      completed: 0,
      converted: 0,
      steps: newStepTitle.trim()
        ? [{ id: `st${Date.now()}`, day: newStepDay, type: newStepType, title: newStepTitle, body: newStepBody, sent: 0, opened: 0, replied: 0 }]
        : [],
    };
    setSequences((prev) => [newSeq, ...prev]);
    setActiveId(newSeq.id);
    setCreateOpen(false);
    setNewName(""); setNewDesc(""); setNewStepTitle(""); setNewStepBody(""); setNewStepDay(0); setNewStepType("email");
    toast.success("Sequence created", { description: newName });
  }

  const totalEnrolled = sequences.reduce((a, s) => a + s.enrolled, 0);
  const totalActive = sequences.reduce((a, s) => a + s.active, 0);
  const totalConverted = sequences.reduce((a, s) => a + s.converted, 0);
  const avgConversion = totalEnrolled > 0 ? Math.round((totalConverted / totalEnrolled) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drip / Sequence Campaigns"
        description="Automated multi-step outreach sequences across email, WhatsApp and call tasks. Track enrolment, completion and conversion in one place."
        icon={<Workflow className="h-6 w-6" />}
        actions={[
          { label: "New sequence", onClick: () => setCreateOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Sequences" value={sequences.length} icon={<Workflow className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total enrolled" value={totalEnrolled} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Active in-flight" value={totalActive} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg conversion" value={`${avgConversion}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint={`${totalConverted} converted`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Sequence list */}
        <SectionCard
          title="Sequences"
          className="lg:col-span-2"
          action={<Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /></Button>}
        >
          <ul className="space-y-2 max-h-[30rem] overflow-y-auto scroll-thin">
            {sequences.map((s) => {
              const conv = s.enrolled > 0 ? Math.round((s.converted / s.enrolled) * 100) : 0;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveId(s.id)}
                    className={`w-full rounded-lg border p-3 text-left transition hover:border-brand/40 ${activeId === s.id ? "border-brand bg-brand/5" : "bg-card"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{s.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                      </div>
                      <SeqStatusBadge status={s.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
                      <div><p className="font-semibold">{s.enrolled}</p><p className="text-[10px] text-muted-foreground">Enr</p></div>
                      <div><p className="font-semibold">{s.active}</p><p className="text-[10px] text-muted-foreground">Act</p></div>
                      <div><p className="font-semibold">{s.completed}</p><p className="text-[10px] text-muted-foreground">Done</p></div>
                      <div><p className="font-semibold text-emerald-600">{conv}%</p><p className="text-[10px] text-muted-foreground">Conv</p></div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        {/* Sequence detail */}
        <SectionCard
          title={active.name}
          description={active.description}
          className="lg:col-span-3"
          action={
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={() => duplicate(active.id)}><Copy className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Edit sequence")}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={active.status === "active" ? "outline" : "default"} onClick={() => toggleStatus(active.id)}>
                {active.status === "active" ? <><Pause className="h-3.5 w-3.5 mr-1" />Pause</> : <><Play className="h-3.5 w-3.5 mr-1" />Activate</>}
              </Button>
            </div>
          }
        >
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Enrolled" value={active.enrolled} icon={<Users className="h-3.5 w-3.5" />} />
            <MiniStat label="Active" value={active.active} icon={<Clock className="h-3.5 w-3.5" />} />
            <MiniStat label="Completed" value={active.completed} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
            <MiniStat label="Converted" value={active.converted} icon={<Target className="h-3.5 w-3.5" />} tone="text-emerald-600" />
          </div>

          {active.steps.length === 0 ? (
            <EmptyState
              icon={<Workflow className="h-5 w-5" />}
              title="No steps yet"
              description="Add steps to build your drip campaign."
              action={<Button size="sm" onClick={() => toast.info("Add step dialog")}><Plus className="h-4 w-4 mr-1" />Add step</Button>}
            />
          ) : (
            <ol className="relative space-y-3 border-l-2 border-dashed border-border pl-4">
              {active.steps.map((st, idx) => (
                <li key={st.id} className="relative">
                  <span className="absolute -left-[1.4rem] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-primary-foreground">
                    <StepIcon type={st.type} className="h-3 w-3" />
                  </span>
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] capitalize">{st.type}</Badge>
                          <span className="text-[11px] text-muted-foreground">Day {st.day}</span>
                          <span className="text-[11px] text-muted-foreground">·</span>
                          <span className="text-[11px] text-muted-foreground">Step {idx + 1}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold">{st.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{st.body}</p>
                      </div>
                    </div>
                    {active.enrolled > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded border bg-muted/30 py-1"><p className="text-sm font-semibold">{st.sent}</p><p className="text-[10px] text-muted-foreground">Sent</p></div>
                        <div className="rounded border bg-muted/30 py-1"><p className="text-sm font-semibold">{st.opened}</p><p className="text-[10px] text-muted-foreground">Opened</p></div>
                        <div className="rounded border bg-muted/30 py-1"><p className="text-sm font-semibold text-emerald-600">{st.replied}</p><p className="text-[10px] text-muted-foreground">Replied</p></div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              <li className="relative">
                <span className="absolute -left-[1.4rem] flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 bg-background text-muted-foreground">
                  <Plus className="h-3 w-3" />
                </span>
                <button
                  onClick={() => toast.info("Add step dialog")}
                  className="w-full rounded-lg border border-dashed p-3 text-left text-xs text-muted-foreground hover:bg-muted/30 transition"
                >
                  Add next step
                </button>
              </li>
            </ol>
          )}
        </SectionCard>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create new sequence</DialogTitle>
            <DialogDescription>Set up a sequence and add the first step. You can add more steps after creation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="seq-name">Sequence name</Label>
              <Input id="seq-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Senior React Devs — Q4 outreach" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="seq-desc">Description</Label>
              <Textarea id="seq-desc" rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description of the target audience and goal" />
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold">First step</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="grid gap-1 col-span-1">
                  <Label className="text-xs">Day</Label>
                  <Input type="number" min={0} value={newStepDay} onChange={(e) => setNewStepDay(Number(e.target.value))} />
                </div>
                <div className="grid gap-1 col-span-2">
                  <Label className="text-xs">Type</Label>
                  <Select value={newStepType} onValueChange={(v) => setNewStepType(v as StepType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Call task</SelectItem>
                      <SelectItem value="task">Generic task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2 grid gap-1">
                <Label className="text-xs">Step title</Label>
                <Input value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder="e.g. Initial outreach" />
              </div>
              <div className="mt-2 grid gap-1">
                <Label className="text-xs">Step body</Label>
                <Textarea rows={2} value={newStepBody} onChange={(e) => setNewStepBody(e.target.value)} placeholder="Message body… use {{name}} for personalisation" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createSequence}><Plus className="h-4 w-4 mr-1.5" />Create sequence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SeqStatusBadge({ status }: { status: Sequence["status"] }) {
  const map = {
    active: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Active" },
    paused: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Paused" },
    draft: { cls: "bg-slate-500/10 text-slate-500 border-slate-500/20", label: "Draft" },
  };
  const m = map[status];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>{m.label}</span>;
}

function StepIcon({ type, className }: { type: StepType; className?: string }) {
  if (type === "email") return <Mail className={className} />;
  if (type === "whatsapp") return <MessageCircle className={className} />;
  if (type === "call") return <Phone className={className} />;
  return <CheckCircle2 className={className} />;
}

function MiniStat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-lg border bg-card p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={tone ?? "text-brand"}>{icon}</span>
      </div>
      <p className={`mt-1 text-lg font-bold ${tone ?? ""}`}>{value}</p>
    </div>
  );
}
