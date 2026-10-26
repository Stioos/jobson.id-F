"use client";

import * as React from "react";
import {
  MailX, Plus, MailOpen, Mail, Pause, Play, Trash2, Send, MessageCircle,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type Trigger = "Screen Fail" | "Interview Fail" | "Offer Declined" | "Position Filled";
type Delay = "Immediate" | "1 day" | "3 days";

interface Rule {
  id: string;
  name: string;
  trigger: Trigger;
  template: string;
  delay: Delay;
  active: boolean;
  sentCount: number;
  openRate: number;
}

interface SentRecord {
  id: string;
  candidate: string;
  role: string;
  rule: string;
  sentDate: string;
  opened: boolean;
  responded: boolean;
}

const MERGE_FIELDS = ["{{candidate_name}}", "{{role}}", "{{company}}", "{{recruiter_name}}", "{{interview_date}}"];

const MOCK_RULES: Rule[] = [
  { id: "r1", name: "Screen fail — polite closure", trigger: "Screen Fail", template: "Standard rejection — screening", delay: "Immediate", active: true, sentCount: 14, openRate: 78 },
  { id: "r2", name: "Interview fail — feedback included", trigger: "Interview Fail", template: "Interview feedback closure", delay: "1 day", active: true, sentCount: 9, openRate: 64 },
  { id: "r3", name: "Offer declined — keep warm", trigger: "Offer Declined", template: "Stay in touch", delay: "3 days", active: true, sentCount: 4, openRate: 100 },
  { id: "r4", name: "Position filled — talent pool invite", trigger: "Position Filled", template: "Talent pool invite", delay: "1 day", active: false, sentCount: 6, openRate: 50 },
  { id: "r5", name: "Interview fail — quick close", trigger: "Interview Fail", template: "Quick rejection", delay: "Immediate", active: true, sentCount: 11, openRate: 71 },
];

const MOCK_SENT: SentRecord[] = [
  { id: "h1", candidate: "Ravi Kumar", role: "Backend Engineer", rule: "Screen fail — polite closure", sentDate: "2024-10-14", opened: true, responded: false },
  { id: "h2", candidate: "Meena Iyer", role: "Frontend Engineer", rule: "Interview fail — feedback included", sentDate: "2024-10-13", opened: true, responded: true },
  { id: "h3", candidate: "Sanjay Gupta", role: "Data Analyst", rule: "Position filled — talent pool invite", sentDate: "2024-10-12", opened: false, responded: false },
  { id: "h4", candidate: "Divya Rao", role: "ML Engineer", rule: "Offer declined — keep warm", sentDate: "2024-10-11", opened: true, responded: true },
  { id: "h5", candidate: "Akash Verma", role: "DevOps Engineer", rule: "Screen fail — polite closure", sentDate: "2024-10-10", opened: true, responded: false },
  { id: "h6", candidate: "Pooja Nair", role: "QA Lead", rule: "Interview fail — quick close", sentDate: "2024-10-09", opened: false, responded: false },
  { id: "h7", candidate: "Imran Khan", role: "Cloud Architect", rule: "Offer declined — keep warm", sentDate: "2024-10-08", opened: true, responded: false },
  { id: "h8", candidate: "Sneha Menon", role: "Product Designer", rule: "Screen fail — polite closure", sentDate: "2024-10-07", opened: true, responded: false },
];

const TRIGGER_TONE: Record<Trigger, string> = {
  "Screen Fail": "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  "Interview Fail": "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  "Offer Declined": "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
  "Position Filled": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
};

export function RecruiterRejectionAutomation() {
  const [rules, setRules] = React.useState<Rule[]>(MOCK_RULES);
  const [sent] = React.useState<SentRecord[]>(MOCK_SENT);
  const [editorRule, setEditorRule] = React.useState<Rule | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const totalSent = sent.length;
  const openRate = Math.round((sent.filter((s) => s.opened).length / totalSent) * 100);
  const responseRate = Math.round((sent.filter((s) => s.responded).length / totalSent) * 100);
  const activeRules = rules.filter((r) => r.active).length;

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    const r = rules.find((x) => x.id === id);
    toast.success(r?.active ? "Rule paused" : "Rule activated", { description: r?.name });
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Rule deleted");
  }

  function insertField(field: string) {
    setBody((b) => `${b}${field}`);
  }

  function saveTemplate() {
    if (!subject || !body) { toast.error("Subject and body required"); return; }
    toast.success("Template saved", { description: subject });
    setEditorRule(null); setSubject(""); setBody("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rejection Automation"
        description="Send dignified, on-brand rejection communications automatically based on stage outcomes. Trigger-based, time-delayed, with open/response analytics."
        icon={<MailX className="h-6 w-6" />}
        actions={[
          { label: "New rule", onClick: () => setCreateOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active rules" value={activeRules} icon={<MailX className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total sent (30d)" value={totalSent} icon={<Send className="h-5 w-5" />} tone="default" />
        <StatCard label="Open rate" value={`${openRate}%`} icon={<MailOpen className="h-5 w-5" />} tone="success" />
        <StatCard label="Response rate" value={`${responseRate}%`} icon={<MessageCircle className="h-5 w-5" />} tone="warning" />
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Sent history</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <SectionCard title="Automation rules" description="Each rule fires when a candidate moves to the configured outcome stage.">
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Rule name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead className="hidden md:table-cell">Delay</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Sent</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Open rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-[11px] text-muted-foreground">{r.template}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${TRIGGER_TONE[r.trigger]}`}>{r.trigger}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{r.delay}</TableCell>
                      <TableCell className="hidden md:table-cell text-center text-sm">{r.sentCount}</TableCell>
                      <TableCell className="hidden lg:table-cell text-center text-sm">{r.openRate}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={r.active ? "text-emerald-600 border-emerald-500/30" : "text-slate-500 border-slate-500/30"}>
                          {r.active ? "Active" : "Paused"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditorRule(r); setSubject(`Update on your application — {{role}}`); setBody(`Hi {{candidate_name}},\n\nThank you for taking the time to apply for {{role}} at {{company}}. After careful consideration...`); }}>
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggle(r.id)}>
                            {r.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteRule(r.id)}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="templates">
          <SectionCard title="Template editor" description="Use merge fields to personalize. Subject + body required.">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Subject line</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Update on your application — {{role}}" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Body</Label>
                  <div className="flex flex-wrap gap-1">
                    {MERGE_FIELDS.map((f) => (
                      <button key={f} onClick={() => insertField(f)} className="rounded border border-brand/30 bg-brand/5 px-1.5 py-0.5 text-[10px] text-brand hover:bg-brand/10">{f}</button>
                    ))}
                  </div>
                </div>
                <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Hi {{candidate_name}}, thank you for…" />
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Preview</p>
                <p className="text-sm font-medium">{subject.replace("{{role}}", "Senior Engineer") || "—"}</p>
                <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">{body.replace(/{{candidate_name}}/g, "Priya").replace(/{{role}}/g, "Senior Engineer").replace(/{{company}}/g, "TechCorp India").replace(/{{recruiter_name}}/g, "Ankit") || "—"}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setSubject(""); setBody(""); }}>Clear</Button>
                <Button onClick={saveTemplate}><Mail className="h-3.5 w-3.5 mr-1" />Save template</Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="history">
          <SectionCard title="Sent history" description="Every automated rejection email, with open and response tracking.">
            <div className="max-h-96 overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Rule triggered</TableHead>
                    <TableHead className="hidden md:table-cell">Sent</TableHead>
                    <TableHead className="text-center">Opened</TableHead>
                    <TableHead className="text-center">Responded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sent.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={s.candidate} size="sm" />
                          <p className="text-sm font-medium">{s.candidate}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.role}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground truncate max-w-[200px]">{s.rule}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(s.sentDate)}</TableCell>
                      <TableCell className="text-center">{s.opened ? <MailOpen className="mx-auto h-4 w-4 text-emerald-500" /> : <Mail className="mx-auto h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell className="text-center">{s.responded ? <MessageCircle className="mx-auto h-4 w-4 text-brand" /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Create rule dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create automation rule</DialogTitle>
            <DialogDescription>Configure when and how rejection emails are sent.</DialogDescription>
          </DialogHeader>
          <CreateRuleForm onCancel={() => setCreateOpen(false)} onCreate={(rule) => {
            setRules((prev) => [{ ...rule, id: `r${rules.length + 1}`, sentCount: 0, openRate: 0 }, ...prev]);
            toast.success("Rule created", { description: rule.name });
            setCreateOpen(false);
          }} />
        </DialogContent>
      </Dialog>

      {/* Editor dialog */}
      <Dialog open={!!editorRule} onOpenChange={(o) => !o && setEditorRule(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit template — {editorRule?.name}</DialogTitle>
            <DialogDescription>Subject and body are saved to this rule.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Body</Label>
              <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={saveTemplate}>Save template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateRuleForm({ onCreate, onCancel }: { onCreate: (r: Omit<Rule, "id" | "sentCount" | "openRate">) => void; onCancel: () => void }) {
  const [name, setName] = React.useState("");
  const [trigger, setTrigger] = React.useState<Trigger>("Screen Fail");
  const [template, setTemplate] = React.useState("Standard rejection");
  const [delay, setDelay] = React.useState<Delay>("Immediate");

  return (
    <>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Rule name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Screen fail — polite closure" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Trigger stage</Label>
            <Select value={trigger} onValueChange={(v) => setTrigger(v as Trigger)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Screen Fail", "Interview Fail", "Offer Declined", "Position Filled"] as Trigger[]).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Delay</Label>
            <Select value={delay} onValueChange={(v) => setDelay(v as Delay)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Immediate", "1 day", "3 days"] as Delay[]).map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Template</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard rejection">Standard rejection</SelectItem>
              <SelectItem value="Interview feedback closure">Interview feedback closure</SelectItem>
              <SelectItem value="Stay in touch">Stay in touch</SelectItem>
              <SelectItem value="Talent pool invite">Talent pool invite</SelectItem>
              <SelectItem value="Quick rejection">Quick rejection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => name && onCreate({ name, trigger, template, delay, active: true })} disabled={!name}>
          <Plus className="h-3.5 w-3.5 mr-1" />Create rule
        </Button>
      </DialogFooter>
    </>
  );
}
