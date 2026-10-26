"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { timeAgo } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  MessageSquare, Send, Megaphone, CheckCheck, Check, Search,
} from "lucide-react";

interface Message {
  id: string;
  from: "trainer" | "student";
  text: string;
  time: string; // ISO
  read: boolean;
}

interface Conversation {
  id: string;
  student: string;
  cohort: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  online: boolean;
  messages: Message[];
}

const SEED: Conversation[] = [
  {
    id: "c1", student: "Aarav Sharma", cohort: "Full-Stack Dev — Batch A", unread: 2, lastMessage: "Thanks! Will check the recording.", lastTime: "2024-08-13T09:42:00Z", online: true,
    messages: [
      { id: "m1", from: "student", text: "Hi, I missed yesterday's session. Can I get the recording?", time: "2024-08-13T09:30:00Z", read: true },
      { id: "m2", from: "trainer", text: "Sure! Sharing the link now. Also review the slides for the React hooks topic.", time: "2024-08-13T09:35:00Z", read: true },
      { id: "m3", from: "student", text: "Got it, thanks!", time: "2024-08-13T09:40:00Z", read: true },
      { id: "m4", from: "trainer", text: "Recording: drive.link/react-hooks-session-12", time: "2024-08-13T09:41:00Z", read: true },
      { id: "m5", from: "student", text: "Thanks! Will check the recording.", time: "2024-08-13T09:42:00Z", read: false },
      { id: "m6", from: "student", text: "Also, when is the assignment due?", time: "2024-08-13T09:42:30Z", read: false },
    ],
  },
  {
    id: "c2", student: "Diya Patel", cohort: "Data Science — Batch B", unread: 0, lastMessage: "Submitted the project.", lastTime: "2024-08-13T08:15:00Z", online: false,
    messages: [
      { id: "m1", from: "student", text: "Hi, I have a question on the pandas assignment.", time: "2024-08-13T08:00:00Z", read: true },
      { id: "m2", from: "trainer", text: "Sure, what's the question?", time: "2024-08-13T08:05:00Z", read: true },
      { id: "m3", from: "student", text: "How do I handle missing values?", time: "2024-08-13T08:10:00Z", read: true },
      { id: "m4", from: "trainer", text: "Use fillna() or dropna(). Check the docs I shared.", time: "2024-08-13T08:12:00Z", read: true },
      { id: "m5", from: "student", text: "Submitted the project.", time: "2024-08-13T08:15:00Z", read: true },
    ],
  },
  {
    id: "c3", student: "Vivaan Reddy", cohort: "Cloud Engineering — Batch C", unread: 1, lastMessage: "Can we schedule a 1-on-1?", lastTime: "2024-08-12T17:20:00Z", online: false,
    messages: [
      { id: "m1", from: "student", text: "I'm struggling with the AWS IAM module.", time: "2024-08-12T17:00:00Z", read: true },
      { id: "m2", from: "trainer", text: "No worries. Let's review the key concepts.", time: "2024-08-12T17:10:00Z", read: true },
      { id: "m3", from: "student", text: "Can we schedule a 1-on-1?", time: "2024-08-12T17:20:00Z", read: false },
    ],
  },
  {
    id: "c4", student: "Ananya Iyer", cohort: "UI/UX Design", unread: 0, lastMessage: "Loved today's critique session!", lastTime: "2024-08-12T12:30:00Z", online: true,
    messages: [
      { id: "m1", from: "student", text: "Loved today's critique session!", time: "2024-08-12T12:30:00Z", read: true },
    ],
  },
  {
    id: "c5", student: "Reyansh Gupta", cohort: "DevOps Specialist", unread: 0, lastMessage: "Will resubmit by Friday.", lastTime: "2024-08-11T15:45:00Z", online: false,
    messages: [
      { id: "m1", from: "trainer", text: "Your Docker lab needs a fix in the Dockerfile.", time: "2024-08-11T15:30:00Z", read: true },
      { id: "m2", from: "student", text: "Will resubmit by Friday.", time: "2024-08-11T15:45:00Z", read: true },
    ],
  },
  {
    id: "c6", student: "Saanvi Nair", cohort: "Full-Stack Dev — Batch A", unread: 3, lastMessage: "Are mock interviews this week?", lastTime: "2024-08-13T11:00:00Z", online: true,
    messages: [
      { id: "m1", from: "student", text: "Hi!", time: "2024-08-13T10:55:00Z", read: false },
      { id: "m2", from: "student", text: "I had a question about the capstone.", time: "2024-08-13T10:58:00Z", read: false },
      { id: "m3", from: "student", text: "Are mock interviews this week?", time: "2024-08-13T11:00:00Z", read: false },
    ],
  },
];

const TEMPLATES = [
  { id: "t1", label: "Assignment reminder", body: "Hi {student}, this is a reminder that your assignment is due tomorrow. Please submit it before 11:59 PM." },
  { id: "t2", label: "Session cancelled", body: "Hi {student}, tomorrow's live session has been cancelled due to a scheduling conflict. We'll reschedule shortly." },
  { id: "t3", label: "Fee reminder", body: "Hi {student}, this is a friendly reminder that your fee installment is due in 3 days. Please complete the payment." },
  { id: "t4", label: "Welcome message", body: "Hi {student}, welcome to the cohort! Looking forward to having you in class. Let me know if you need anything." },
];

const COHORTS = [
  { id: "c1", name: "Full-Stack Dev — Batch A" },
  { id: "c2", name: "Data Science — Batch B" },
  { id: "c3", name: "Cloud Engineering — Batch C" },
  { id: "c4", name: "UI/UX Design" },
  { id: "c5", name: "DevOps Specialist" },
];

function bubbleClass(from: "trainer" | "student") {
  return from === "trainer"
    ? "ml-auto bg-brand text-white rounded-br-sm"
    : "mr-auto bg-muted text-foreground rounded-bl-sm";
}

export function TrainingStudentMessaging() {
  const [conversations, setConversations] = React.useState<Conversation[]>(SEED);
  const [activeId, setActiveId] = React.useState<string>(SEED[0].id);
  const [draft, setDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [broadcastOpen, setBroadcastOpen] = React.useState(false);
  const [broadcast, setBroadcast] = React.useState({ cohort: COHORTS[0].id, subject: "", body: "" });
  const [templateId, setTemplateId] = React.useState("");

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const filtered = conversations.filter((c) =>
    c.student.toLowerCase().includes(search.toLowerCase()) ||
    c.cohort.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const onlineCount = conversations.filter((c) => c.online).length;

  function send() {
    if (!draft.trim() || !active) return;
    const now = new Date().toISOString();
    const msg: Message = { id: `m_${Date.now()}`, from: "trainer", text: draft.trim(), time: now, read: true };
    setConversations((prev) => prev.map((c) =>
      c.id === active.id
        ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastTime: now, unread: 0 }
        : c
    ));
    setDraft("");
    toast.success("Message sent");
  }

  function openConversation(c: Conversation) {
    setActiveId(c.id);
    setConversations((prev) => prev.map((x) => x.id === c.id ? { ...x, unread: 0, messages: x.messages.map((m) => ({ ...m, read: true })) } : x));
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    if (!active) return;
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) setDraft(t.body.replace("{student}", active.student.split(" ")[0]));
  }

  function sendBroadcast() {
    if (!broadcast.subject.trim() || !broadcast.body.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    const cohort = COHORTS.find((c) => c.id === broadcast.cohort);
    toast.success("Broadcast sent", { description: `To ${cohort?.name} cohort` });
    setBroadcastOpen(false);
    setBroadcast({ cohort: COHORTS[0].id, subject: "", body: "" });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Student Messaging Center"
        description="Chat 1-on-1 with learners, broadcast to entire cohorts, and use templates for common updates."
        icon={<Icon name="MessageSquare" className="h-6 w-6" />}
        actions={[
          { label: "Broadcast to cohort", icon: "Megaphone", onClick: () => setBroadcastOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conversations" value={conversations.length} icon={<MessageSquare className="h-5 w-5" />} tone="brand" />
        <StatCard label="Unread Messages" value={totalUnread} icon={<MessageSquare className="h-5 w-5" />} tone="warning" />
        <StatCard label="Online Students" value={onlineCount} icon={<MessageSquare className="h-5 w-5" />} tone="success" />
        <StatCard label="Templates" value={TEMPLATES.length} icon={<MessageSquare className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] h-[600px]">
        {/* Conversation list */}
        <SectionCard title="Conversations" className="flex flex-col overflow-hidden" contentClassName="flex-1 overflow-hidden p-0">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scroll-thin">
            {filtered.length === 0 ? (
              <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No conversations" />
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openConversation(c)}
                  className={`flex w-full items-start gap-3 border-b p-3 text-left transition hover:bg-muted/40 ${c.id === activeId ? "bg-brand/5" : ""}`}
                >
                  <div className="relative">
                    <AvatarLogo text={c.student} size="sm" />
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{c.student}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(c.lastTime)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.cohort}</p>
                  </div>
                  {c.unread > 0 && (
                    <Badge className="bg-brand text-white shrink-0">{c.unread}</Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </SectionCard>

        {/* Chat view */}
        <SectionCard className="flex flex-col overflow-hidden" contentClassName="flex-1 overflow-hidden p-0">
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b p-3">
                <AvatarLogo text={active.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{active.student}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {active.online ? (
                      <><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online</>
                    ) : (
                      <><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Offline</>
                    )}
                    <span>·</span>
                    <span>{active.cohort}</span>
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.info(`Calling ${active.student}...`)}>
                  <Icon name="Phone" className="h-3.5 w-3.5 mr-1" /> Call
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3 bg-muted/20">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex flex-col max-w-[75%] ${m.from === "trainer" ? "items-end ml-auto" : "items-start"}`}>
                    <div className={`rounded-2xl px-3 py-2 text-sm ${bubbleClass(m.from)}`}>
                      {m.text}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{timeAgo(m.time)}</span>
                      {m.from === "trainer" && (
                        m.read ? <CheckCheck className="h-3 w-3 text-brand" /> : <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Select value={templateId} onValueChange={applyTemplate}>
                    <SelectTrigger className="h-8 w-[200px] text-xs"><SelectValue placeholder="Insert template..." /></SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Attachment uploaded (mock)")} className="text-xs">
                    <Icon name="Paperclip" className="h-3.5 w-3.5 mr-1" /> Attach
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                    className="min-h-[44px] max-h-[100px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                  />
                  <Button onClick={send} disabled={!draft.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="Select a conversation" />
          )}
        </SectionCard>
      </div>

      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Broadcast to Cohort</DialogTitle>
            <DialogDescription>Send a message to every student in a cohort. They'll receive it as an individual chat.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Target cohort</Label>
              <Select value={broadcast.cohort} onValueChange={(v) => setBroadcast((b) => ({ ...b, cohort: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COHORTS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bc-subject">Subject</Label>
              <Input id="bc-subject" value={broadcast.subject} onChange={(e) => setBroadcast((b) => ({ ...b, subject: e.target.value }))} className="mt-1" placeholder="e.g. Schedule update for next week" />
            </div>
            <div>
              <Label htmlFor="bc-body">Message</Label>
              <Textarea id="bc-body" value={broadcast.body} onChange={(e) => setBroadcast((b) => ({ ...b, body: e.target.value }))} className="mt-1 min-h-[120px]" placeholder="Type your broadcast message..." />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Quick templates:</span>
              {TEMPLATES.slice(0, 3).map((t) => (
                <Button key={t.id} size="sm" variant="outline" onClick={() => setBroadcast((b) => ({ ...b, subject: t.label, body: t.body }))}>
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={sendBroadcast}><Megaphone className="h-4 w-4 mr-1" /> Send broadcast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
