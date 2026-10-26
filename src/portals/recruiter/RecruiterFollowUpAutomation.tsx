"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { initials, timeAgo } from "@/lib/format";

type Action = "Create call task" | "Send email" | "Send WhatsApp";
type Repeat = "once" | "daily" | "weekly";

interface Rule {
  id: string; name: string; condition: string; action: Action;
  delayDays: number; repeat: Repeat; maxRepeats: number; active: boolean; triggered: number;
}

interface Automation {
  id: string; candidate: string; rule: string; nextAt: string; attempts: number; status: "running" | "completed" | "opted_out";
}

interface LogEntry { id: string; rule: string; candidate: string; at: string; result: string; }

const SEED_RULES: Rule[] = [
  { id: "r1", name: "Re-engage silent applicants", condition: "No response in 5 days", action: "Send email", delayDays: 5, repeat: "once", maxRepeats: 1, active: true, triggered: 142 },
  { id: "r2", name: "Post-submission check-in", condition: "Status = Submitted", action: "Send WhatsApp", delayDays: 2, repeat: "once", maxRepeats: 1, active: true, triggered: 318 },
  { id: "r3", name: "Interview follow-up call", condition: "Interview completed", action: "Create call task", delayDays: 1, repeat: "once", maxRepeats: 1, active: true, triggered: 86 },
  { id: "r4", name: "Weekly nurture for top talent", condition: "Status = Talent Pool", action: "Send email", delayDays: 7, repeat: "weekly", maxRepeats: 8, active: true, triggered: 224 },
  { id: "r5", name: "Stalled-offer re-confirmation", condition: "Offer sent, no response 3 days", action: "Send WhatsApp", delayDays: 3, repeat: "daily", maxRepeats: 3, active: false, triggered: 12 },
];

const SEED_AUTOMATIONS: Automation[] = [
  { id: "a1", candidate: "Aarav Sharma", rule: "Re-engage silent applicants", nextAt: "2025-01-19T10:00:00", attempts: 0, status: "running" },
  { id: "a2", candidate: "Diya Patel", rule: "Post-submission check-in", nextAt: "2025-01-18T14:00:00", attempts: 1, status: "running" },
  { id: "a3", candidate: "Kabir Mehta", rule: "Interview follow-up call", nextAt: "2025-01-18T09:00:00", attempts: 0, status: "running" },
  { id: "a4", candidate: "Ananya Reddy", rule: "Weekly nurture for top talent", nextAt: "2025-01-24T10:00:00", attempts: 3, status: "running" },
  { id: "a5", candidate: "Rohan Gupta", rule: "Re-engage silent applicants", nextAt: "—", attempts: 1, status: "completed" },
  { id: "a6", candidate: "Ishaan Verma", rule: "Stalled-offer re-confirmation", nextAt: "—", attempts: 0, status: "opted_out" },
];

const SEED_LOG: LogEntry[] = [
  { id: "l1", rule: "Post-submission check-in", candidate: "Diya Patel", at: "2025-01-16T14:00:00", result: "WhatsApp sent" },
  { id: "l2", rule: "Interview follow-up call", candidate: "Kabir Mehta", at: "2025-01-15T09:00:00", result: "Call task created" },
  { id: "l3", rule: "Weekly nurture for top talent", candidate: "Ananya Reddy", at: "2025-01-10T10:00:00", result: "Email sent (attempt 3/8)" },
  { id: "l4", rule: "Re-engage silent applicants", candidate: "Rohan Gupta", at: "2025-01-08T10:00:00", result: "Email sent — candidate responded" },
];

export function RecruiterFollowUpAutomation() {
  const [rules, setRules] = React.useState<Rule[]>(SEED_RULES);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "", condition: "", action: "Send email" as Action,
    delayDays: 1, repeat: "once" as Repeat, maxRepeats: 1,
  });

  const toggle = (id: string) => {
    setRules((rs) => rs.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    toast.success("Rule updated");
  };
  const create = () => {
    if (!form.name.trim() || !form.condition.trim()) { toast.error("Name and condition required"); return; }
    const r: Rule = { id: `r${Date.now()}`, name: form.name.trim(), condition: form.condition.trim(), action: form.action, delayDays: form.delayDays, repeat: form.repeat, maxRepeats: form.maxRepeats, active: true, triggered: 0 };
    setRules((rs) => [r, ...rs]);
    setCreateOpen(false);
    setForm({ name: "", condition: "", action: "Send email", delayDays: 1, repeat: "once", maxRepeats: 1 });
    toast.success("Rule created");
  };
  const remove = (id: string) => { setRules((rs) => rs.filter((r) => r.id !== id)); toast.success("Rule deleted"); };
  const optOut = (id: string) => { toast.success("Candidate opted out of automation"); };

  const active = rules.filter((r) => r.active).length;
  const running = SEED_AUTOMATIONS.filter((a) => a.status === "running").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-up Automation"
        description="Rule engine that automates candidate follow-ups based on conditions."
        icon={<Icon name="Workflow" className="h-6 w-6" />}
        actions={[{ label: "Create Rule", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Rules" value={active} icon={<Icon name="Workflow" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Running Automations" value={running} icon={<Icon name="RefreshCw" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Triggered" value={rules.reduce((s, r) => s + r.triggered, 0).toLocaleString("en-IN")} icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Opt-outs" value={SEED_AUTOMATIONS.filter((a) => a.status === "opted_out").length} icon={<Icon name="MailX" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Rules">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="p-2">Rule</th>
                <th className="p-2">Condition</th>
                <th className="p-2">Action</th>
                <th className="p-2">Delay</th>
                <th className="p-2">Repeat</th>
                <th className="p-2">Triggered</th>
                <th className="p-2">Status</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b hover:bg-brand/5">
                  <td className="p-2 font-medium">{r.name}</td>
                  <td className="p-2"><Badge variant="outline" className="text-[10px]">{r.condition}</Badge></td>
                  <td className="p-2"><Badge className="bg-brand/10 text-brand border-brand/20 text-[10px]">{r.action}</Badge></td>
                  <td className="p-2 text-xs">{r.delayDays}d</td>
                  <td className="p-2 text-xs capitalize">{r.repeat} (×{r.maxRepeats})</td>
                  <td className="p-2">{r.triggered}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={r.active} onCheckedChange={() => toggle(r.id)} />
                      <span className="text-xs">{r.active ? "Active" : "Paused"}</span>
                    </div>
                  </td>
                  <td className="p-2"><Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-rose-600"><Icon name="Trash2" className="h-3 w-3" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Active Automations per Candidate">
          <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {SEED_AUTOMATIONS.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                    {initials(a.candidate)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.candidate}</p>
                    <p className="text-xs text-muted-foreground">{a.rule}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={a.status === "running" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]" : a.status === "completed" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]" : "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"}>
                    {a.status.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">attempts: {a.attempts}</span>
                  {a.status === "running" && <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-600" onClick={() => optOut(a.id)}>Opt out</Button>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Rule Execution Log">
          <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {SEED_LOG.map((l) => (
              <div key={l.id} className="flex items-start gap-2 rounded-lg border p-2 text-sm">
                <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{l.result}</p>
                  <p className="text-xs text-muted-foreground">{l.candidate} · {l.rule}</p>
                  <p className="text-[10px] text-muted-foreground">{timeAgo(l.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Opt-out Management" description="Candidates who opted out of all automations">
        <div className="space-y-2">
          {SEED_AUTOMATIONS.filter((a) => a.status === "opted_out").map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{a.candidate}</p>
                <p className="text-xs text-muted-foreground">Was in: {a.rule}</p>
              </div>
              <Badge variant="outline" className="text-rose-600">Opted out</Badge>
            </div>
          ))}
          {SEED_AUTOMATIONS.filter((a) => a.status === "opted_out").length === 0 && (
            <EmptyState icon={<Icon name="MailX" className="h-5 w-5" />} title="No opt-outs" />
          )}
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Follow-up Rule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Rule Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Condition</Label><Input value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="e.g. No response in 5 days" /></div>
            <div>
              <Label>Action</Label>
              <Select value={form.action} onValueChange={(v: Action) => setForm({ ...form, action: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Create call task">Create call task</SelectItem>
                  <SelectItem value="Send email">Send email</SelectItem>
                  <SelectItem value="Send WhatsApp">Send WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Delay (days)</Label><Input type="number" value={form.delayDays} onChange={(e) => setForm({ ...form, delayDays: parseInt(e.target.value) || 0 })} /></div>
              <div>
                <Label>Repeat</Label>
                <Select value={form.repeat} onValueChange={(v: Repeat) => setForm({ ...form, repeat: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">once</SelectItem>
                    <SelectItem value="daily">daily</SelectItem>
                    <SelectItem value="weekly">weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Max repeats</Label><Input type="number" value={form.maxRepeats} onChange={(e) => setForm({ ...form, maxRepeats: parseInt(e.target.value) || 1 })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={create} className="bg-brand text-white hover:bg-brand/90">Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
