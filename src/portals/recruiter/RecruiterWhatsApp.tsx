"use client";

import * as React from "react";
import {
  MessageCircle, Send, Search, Megaphone, CheckCircle2, Clock, FileText, Phone, Video, Paperclip, ChevronRight,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: "approved" | "pending" | "opted_out";
  messages: Message[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  body: string;
  status: "approved" | "pending" | "rejected";
  language: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c1", name: "Arjun Iyer", role: "Senior Frontend Engineer", lastMessage: "Sounds good, let's talk tomorrow at 4 PM.", lastTime: "2m ago", unread: 2, status: "approved", messages: [
    { id: "m1", from: "me", text: "Hi Arjun, I have an exciting React role at TechCorp. Are you open to a chat?", time: "10:30 AM" },
    { id: "m2", from: "them", text: "Hi Riya, thanks for reaching out. What's the budget?", time: "10:42 AM" },
    { id: "m3", from: "me", text: "Range is ₹25–32 LPA + ESOPs. Hybrid in Bengaluru.", time: "10:43 AM" },
    { id: "m4", from: "them", text: "Sounds good, let's talk tomorrow at 4 PM.", time: "10:45 AM" },
  ] },
  { id: "c2", name: "Kavya Reddy", role: "Full Stack Developer", lastMessage: "I'll share my updated CV by EOD.", lastTime: "1h ago", unread: 0, status: "approved", messages: [
    { id: "m1", from: "me", text: "Hi Kavya, found your profile interesting for a Full Stack role at DataMinds AI.", time: "9:15 AM" },
    { id: "m2", from: "them", text: "I'll share my updated CV by EOD.", time: "9:20 AM" },
  ] },
  { id: "c3", name: "Rohan Mehta", role: "DevOps Engineer", lastMessage: "Can we move the call to Friday?", lastTime: "3h ago", unread: 1, status: "approved", messages: [
    { id: "m1", from: "me", text: "Hi Rohan, DevOps role at FinEdge — interested?", time: "Yesterday" },
    { id: "m2", from: "them", text: "Can we move the call to Friday?", time: "8:00 AM" },
  ] },
  { id: "c4", name: "Sneha Kapoor", role: "Backend Engineer", lastMessage: "Thanks, will revert soon.", lastTime: "1d ago", unread: 0, status: "pending", messages: [
    { id: "m1", from: "me", text: "Hi Sneha, Backend Engineer at StartupX — fully remote. Open?", time: "Yesterday" },
    { id: "m2", from: "them", text: "Thanks, will revert soon.", time: "Yesterday" },
  ] },
  { id: "c5", name: "Vikram Nair", role: "ML Engineer", lastMessage: "Not looking right now, thanks.", lastTime: "2d ago", unread: 0, status: "approved", messages: [
    { id: "m1", from: "me", text: "Hi Vikram, ML Engineer role at DataMinds AI?", time: "2 days ago" },
    { id: "m2", from: "them", text: "Not looking right now, thanks.", time: "2 days ago" },
  ] },
  { id: "c6", name: "Priya Nair", role: "Frontend Engineer", lastMessage: "Yes, please share the JD.", lastTime: "3d ago", unread: 0, status: "approved", messages: [
    { id: "m1", from: "me", text: "Hi Priya, Frontend role at TechCorp India — Bengaluru hybrid.", time: "3 days ago" },
    { id: "m2", from: "them", text: "Yes, please share the JD.", time: "3 days ago" },
  ] },
];

const MOCK_TEMPLATES: Template[] = [
  { id: "t1", name: "Initial outreach", category: "Sourcing", body: "Hi {{name}}, I'm {{recruiter}} from jobson.id. I came across your profile and have a {{role}} opportunity at {{client}} that fits your background. Are you open to a quick chat this week?", status: "approved", language: "English" },
  { id: "t2", name: "Interview invite", category: "Interview", body: "Hi {{name}}, great news! {{client}} would like to interview you for the {{role}} position. Please share 2–3 time slots that work for you this week.", status: "approved", language: "English" },
  { id: "t3", name: "Offer follow-up", category: "Offer", body: "Hi {{name}}, just checking in — did you get a chance to review the offer from {{client}}? Happy to walk you through any questions.", status: "approved", language: "English" },
  { id: "t4", name: "Day-1 check-in", category: "Onboarding", body: "Hi {{name}}, wishing you a great first day at {{client}}! Let me know how it goes. I'm here if anything needs escalation.", status: "pending", language: "English" },
];

export function RecruiterWhatsApp() {
  const [conversations, setConversations] = React.useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = React.useState<string>(MOCK_CONVERSATIONS[0].id);
  const [draft, setDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [broadcastOpen, setBroadcastOpen] = React.useState(false);
  const [broadcastMsg, setBroadcastMsg] = React.useState("");
  const [broadcastCount, setBroadcastCount] = React.useState(0);

  const active = conversations.find((c) => c.id === activeId)!;
  const filtered = conversations.filter((c) =>
    !search ? true : c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const optedIn = conversations.filter((c) => c.status === "approved").length;
  const pending = conversations.filter((c) => c.status === "pending").length;

  function send() {
    if (!draft.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { id: `m${Date.now()}`, from: "me", text: draft, time: "now" }], lastMessage: draft, lastTime: "now", unread: 0 }
          : c
      )
    );
    setDraft("");
    toast.success("Message sent");
  }

  function openConversation(c: Conversation) {
    setActiveId(c.id);
    setConversations((prev) => prev.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
  }

  function applyTemplate(t: Template) {
    setDraft(t.body.replace(/\{\{name\}\}/g, active.name.split(" ")[0]).replace(/\{\{recruiter\}\}/g, "Riya").replace(/\{\{role\}\}/g, active.role).replace(/\{\{client\}\}/g, "TechCorp India"));
    toast.success("Template inserted", { description: t.name });
  }

  function sendBroadcast() {
    if (!broadcastMsg.trim()) { toast.error("Enter a broadcast message"); return; }
    toast.success("Broadcast sent", { description: `${broadcastCount || optedIn} recipients · ${broadcastMsg.slice(0, 40)}…` });
    setBroadcastOpen(false);
    setBroadcastMsg("");
    setBroadcastCount(0);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Business"
        description="Outreach to candidates using approved WhatsApp templates. Manage one-on-one conversations and broadcast campaigns to opted-in contacts."
        icon={<MessageCircle className="h-6 w-6" />}
        actions={[
          { label: "New broadcast", onClick: () => setBroadcastOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Conversations" value={conversations.length} icon={<MessageCircle className="h-5 w-5" />} tone="brand" />
        <StatCard label="Unread" value={totalUnread} icon={<MessageCircle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Opted-in" value={optedIn} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending opt-in" value={pending} icon={<Clock className="h-5 w-5" />} tone="default" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Conversation list */}
        <SectionCard
          title="Conversations"
          className="lg:col-span-1"
          contentClassName="p-0"
          action={
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-36 pl-7 sm:w-44" />
            </div>
          }
        >
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            {filtered.length === 0 ? (
              <EmptyState icon={<MessageCircle className="h-5 w-5" />} title="No conversations" />
            ) : (
              <ul className="divide-y">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => openConversation(c)}
                      className={`flex w-full items-start gap-3 p-3 text-left transition hover:bg-muted/30 ${activeId === c.id ? "bg-brand/5" : ""}`}
                    >
                      <AvatarLogo text={c.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{c.name}</p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{c.lastTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                      </div>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>

        {/* Chat view */}
        <SectionCard className="lg:col-span-2" contentClassName="p-0">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <AvatarLogo text={active.name} size="sm" />
              <div>
                <p className="text-sm font-semibold">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={
                active.status === "approved" ? "text-[10px] text-emerald-600 border-emerald-500/30"
                : active.status === "pending" ? "text-[10px] text-amber-600 border-amber-500/30"
                : "text-[10px] text-rose-600 border-rose-500/30"
              }>
                {active.status === "approved" ? "Opted-in" : active.status === "pending" ? "Pending opt-in" : "Opted-out"}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => toast.info("Calling…")}><Phone className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => toast.info("Starting video call…")}><Video className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex h-[20rem] flex-col gap-2 overflow-y-auto scroll-thin bg-muted/20 p-4">
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === "me"
                    ? "bg-brand text-primary-foreground rounded-br-sm"
                    : "bg-card border rounded-bl-sm"
                }`}>
                  <p>{m.text}</p>
                  <p className={`mt-0.5 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {MOCK_TEMPLATES.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-[11px] hover:border-brand hover:bg-muted/30 transition"
                >
                  <FileText className="h-3 w-3" />{t.name}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => toast.info("Attach file")} aria-label="Attach">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                className="min-h-[40px] resize-none"
              />
              <Button size="icon" onClick={send} disabled={!draft.trim()} aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Template library */}
      <SectionCard title="Approved template library" description="WhatsApp requires pre-approved templates for outbound business messaging.">
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_TEMPLATES.map((t) => (
            <div key={t.id} className="rounded-lg border bg-card p-4 hover:border-brand/40 transition">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    <span>{t.language}</span>
                  </p>
                </div>
                <Badge variant="outline" className={
                  t.status === "approved" ? "text-[10px] text-emerald-600 border-emerald-500/30"
                  : t.status === "pending" ? "text-[10px] text-amber-600 border-amber-500/30"
                  : "text-[10px] text-rose-600 border-rose-500/30"
                }>{t.status}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{t.body}</p>
              <div className="mt-3 flex items-center justify-end">
                <Button size="sm" variant="outline" onClick={() => applyTemplate(t)}>
                  Use template <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Broadcast dialog */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New broadcast campaign</DialogTitle>
            <DialogDescription>Send the same message to multiple opted-in contacts. Recipients cannot see each other.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="rounded-lg border bg-muted/30 p-3 text-xs">
              <p className="flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5 text-brand" />Recipients will be opted-in contacts only ({optedIn})</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bc-count">Limit recipients (optional)</Label>
              <Input
                id="bc-count"
                type="number"
                min={0}
                value={broadcastCount || ""}
                onChange={(e) => setBroadcastCount(Number(e.target.value))}
                placeholder={`Default: all ${optedIn}`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bc-msg">Message</Label>
              <Textarea
                id="bc-msg"
                rows={4}
                placeholder="Type your broadcast message…"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">{broadcastMsg.length}/1024 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBroadcastOpen(false)}>Cancel</Button>
            <Button onClick={sendBroadcast}><Send className="h-4 w-4 mr-1.5" />Send broadcast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
