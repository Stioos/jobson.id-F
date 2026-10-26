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
import { formatDate, timeAgo } from "@/lib/format";

type Channel = "Email" | "SMS" | "WhatsApp";
type Trigger = "Interview Tomorrow" | "Interview in 1hr" | "Offer Expiring" | "No Response 3 days";

interface Rule {
  id: string; name: string; trigger: Trigger; channel: Channel; template: string;
  recipients: number; active: boolean; sent: number; opened: number;
}

interface HistoryEntry {
  id: string; rule: string; candidate: string; channel: Channel; sentAt: string; opened: boolean; actionTaken: string;
}

const SEED_RULES: Rule[] = [
  { id: "r1", name: "Day-Before Interview Reminder", trigger: "Interview Tomorrow", channel: "Email", template: "Interview Reminder — Tomorrow", recipients: 38, active: true, sent: 318, opened: 296 },
  { id: "r2", name: "1-Hour Interview Alert", trigger: "Interview in 1hr", channel: "SMS", template: "Join Your Interview in 1hr", recipients: 38, active: true, sent: 256, opened: 252 },
  { id: "r3", name: "Offer Expiry Notice", trigger: "Offer Expiring", channel: "WhatsApp", template: "Your Offer Expires Tomorrow", recipients: 6, active: true, sent: 18, opened: 18 },
  { id: "r4", name: "Silent Candidate Re-Engage", trigger: "No Response 3 days", channel: "Email", template: "Following Up — Are You Still Interested?", recipients: 24, active: true, sent: 142, opened: 89 },
  { id: "r5", name: "Offer Expiry Final Notice", trigger: "Offer Expiring", channel: "Email", template: "Final Reminder: Offer Expires Today", recipients: 6, active: false, sent: 12, opened: 11 },
];

const SEED_HISTORY: HistoryEntry[] = [
  { id: "h1", rule: "Day-Before Interview Reminder", candidate: "Aarav Sharma", channel: "Email", sentAt: "2025-01-17T09:00:00", opened: true, actionTaken: "Confirmed attendance" },
  { id: "h2", rule: "1-Hour Interview Alert", candidate: "Aarav Sharma", channel: "SMS", sentAt: "2025-01-18T09:00:00", opened: true, actionTaken: "Joined call" },
  { id: "h3", rule: "Offer Expiry Notice", candidate: "Diya Patel", channel: "WhatsApp", sentAt: "2025-01-16T10:00:00", opened: true, actionTaken: "Accepted offer" },
  { id: "h4", rule: "Silent Candidate Re-Engage", candidate: "Kabir Mehta", channel: "Email", sentAt: "2025-01-15T14:00:00", opened: false, actionTaken: "—" },
  { id: "h5", rule: "Day-Before Interview Reminder", candidate: "Ananya Reddy", channel: "Email", sentAt: "2025-01-14T09:00:00", opened: true, actionTaken: "Confirmed attendance" },
  { id: "h6", rule: "1-Hour Interview Alert", candidate: "Ananya Reddy", channel: "SMS", sentAt: "2025-01-14T15:00:00", opened: true, actionTaken: "Joined call" },
];

export function RecruiterAutoReminders() {
  const [rules, setRules] = React.useState<Rule[]>(SEED_RULES);
  const [history] = React.useState<HistoryEntry[]>(SEED_HISTORY);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", trigger: "Interview Tomorrow" as Trigger, channel: "Email" as Channel, template: "" });

  const toggle = (id: string) => {
    setRules((rs) => rs.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    toast.success("Rule updated");
  };
  const create = () => {
    if (!form.name.trim()) { toast.error("Rule name required"); return; }
    const r: Rule = {
      id: `r${Date.now()}`, name: form.name.trim(), trigger: form.trigger, channel: form.channel,
      template: form.template || `${form.trigger} — default template`, recipients: 0, active: true, sent: 0, opened: 0,
    };
    setRules((rs) => [r, ...rs]);
    setCreateOpen(false); setForm({ name: "", trigger: "Interview Tomorrow", channel: "Email", template: "" });
    toast.success("Reminder rule created");
  };
  const remove = (id: string) => {
    setRules((rs) => rs.filter((r) => r.id !== id));
    toast.success("Rule deleted");
  };

  const active = rules.filter((r) => r.active).length;
  const totalSent = rules.reduce((s, r) => s + r.sent, 0);
  const showUp = Math.round((history.filter((h) => h.actionTaken.includes("Joined") || h.actionTaken.includes("Confirmed")).length / history.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auto Reminders"
        description="Schedule automated reminders to keep candidates engaged and showing up."
        icon={<Icon name="AlarmClock" className="h-6 w-6" />}
        actions={[{ label: "Create Rule", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Rules" value={active} icon={<Icon name="AlarmClock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Reminders Sent" value={totalSent.toLocaleString("en-IN")} icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Open Rate" value="92%" icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="success" />
        <StatCard label="Show-up Rate" value={`${showUp}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Reminder Rules">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="p-2">Rule</th>
                <th className="p-2">Trigger</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Recipients</th>
                <th className="p-2">Sent</th>
                <th className="p-2">Status</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b hover:bg-brand/5">
                  <td className="p-2">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.template}</p>
                  </td>
                  <td className="p-2"><Badge variant="outline">{r.trigger}</Badge></td>
                  <td className="p-2"><Badge className="bg-brand/10 text-brand border-brand/20">{r.channel}</Badge></td>
                  <td className="p-2">{r.recipients}</td>
                  <td className="p-2">{r.sent}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={r.active} onCheckedChange={() => toggle(r.id)} />
                      <span className="text-xs">{r.active ? "Active" : "Paused"}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-rose-600">
                      <Icon name="Trash2" className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Reminder History" description="Sent, opened, and actions taken">
        <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>
                <p className="font-medium">{h.candidate}</p>
                <p className="text-xs text-muted-foreground">{h.rule} · {h.channel}</p>
                <p className="text-[10px] text-muted-foreground">Sent {timeAgo(h.sentAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {h.opened ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Opened</Badge> : <Badge variant="outline" className="text-[10px]">Unopened</Badge>}
                <span className="text-xs text-muted-foreground">{h.actionTaken}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Effectiveness" description="Show-up rate after reminder">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Show-up rate (post-reminder)</span><span className="font-semibold text-emerald-600">{showUp}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${showUp}%` }} /></div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded border p-2"><p className="text-muted-foreground">Confirmed</p><p className="text-lg font-semibold">{history.filter((h) => h.actionTaken.includes("Confirmed")).length}</p></div>
            <div className="rounded border p-2"><p className="text-muted-foreground">Joined</p><p className="text-lg font-semibold">{history.filter((h) => h.actionTaken.includes("Joined")).length}</p></div>
            <div className="rounded border p-2"><p className="text-muted-foreground">No Action</p><p className="text-lg font-semibold">{history.filter((h) => h.actionTaken === "—").length}</p></div>
          </div>
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Reminder Rule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Rule Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Interview Day-Of Reminder" /></div>
            <div>
              <Label>Trigger</Label>
              <Select value={form.trigger} onValueChange={(v: Trigger) => setForm({ ...form, trigger: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interview Tomorrow">Interview Tomorrow</SelectItem>
                  <SelectItem value="Interview in 1hr">Interview in 1hr</SelectItem>
                  <SelectItem value="Offer Expiring">Offer Expiring</SelectItem>
                  <SelectItem value="No Response 3 days">No Response 3 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Channel</Label>
              <Select value={form.channel} onValueChange={(v: Channel) => setForm({ ...form, channel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Template (optional)</Label><Input value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} placeholder="Custom template name" /></div>
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
