"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { timeAgo, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import {
  MessageSquare, Search, Send, Paperclip, Clock, CheckCheck, Check, Users, User, Bell, FileText, Smile,
} from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  sender: "me" | "them";
  text: string;
  sentAt: string;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  type: "client" | "college" | "group";
  avatarColor: string;
  initials: string;
  lastMessage: string;
  lastActivity: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c_001", name: "Acme Industries HR", type: "client", avatarColor: "bg-emerald-500", initials: "AI",
    lastMessage: "Sure, we'll share the offer letters by Friday.",
    lastActivity: new Date(Date.now() - 12 * 60000).toISOString(), unread: 2, online: true,
    messages: [
      { id: "m1", conversationId: "c_001", sender: "them", text: "Hi, wanted to check on the shortlist for Cloud Engineer role.", sentAt: new Date(Date.now() - 90 * 60000).toISOString(), status: "read" },
      { id: "m2", conversationId: "c_001", sender: "me", text: "Hi! We have 8 candidates shortlisted. Will share profiles today.", sentAt: new Date(Date.now() - 60 * 60000).toISOString(), status: "read" },
      { id: "m3", conversationId: "c_001", sender: "them", text: "Great, also need their availability for interview next week.", sentAt: new Date(Date.now() - 30 * 60000).toISOString(), status: "read" },
      { id: "m4", conversationId: "c_001", sender: "me", text: "Noted. Will include availability matrix in the share.", sentAt: new Date(Date.now() - 25 * 60000).toISOString(), status: "read" },
      { id: "m5", conversationId: "c_001", sender: "them", text: "Sure, we'll share the offer letters by Friday.", sentAt: new Date(Date.now() - 12 * 60000).toISOString(), status: "delivered" },
    ],
  },
  {
    id: "c_002", name: "BIT Mesra — Training Cell", type: "college", avatarColor: "bg-teal-500", initials: "BM",
    lastMessage: "Thanks for the placement report, looks great!",
    lastActivity: new Date(Date.now() - 3 * 3600000).toISOString(), unread: 0, online: false,
    messages: [
      { id: "m1", conversationId: "c_002", sender: "me", text: "Sharing the placement report for batch 2024.", sentAt: new Date(Date.now() - 5 * 3600000).toISOString(), status: "read" },
      { id: "m2", conversationId: "c_002", sender: "them", text: "Thanks for the placement report, looks great!", sentAt: new Date(Date.now() - 3 * 3600000).toISOString(), status: "read" },
    ],
  },
  {
    id: "c_003", name: "Zoho Campus Team", type: "client", avatarColor: "bg-amber-500", initials: "ZC",
    lastMessage: "Can we schedule a drive for 2nd November?",
    lastActivity: new Date(Date.now() - 5 * 3600000).toISOString(), unread: 3, online: true,
    messages: [
      { id: "m1", conversationId: "c_003", sender: "them", text: "Can we schedule a drive for 2nd November?", sentAt: new Date(Date.now() - 5 * 3600000).toISOString(), status: "delivered" },
    ],
  },
  {
    id: "c_004", name: "NSDC Chapter Coordinators", type: "group", avatarColor: "bg-rose-500", initials: "NC",
    lastMessage: "Mark, Tushar: please confirm centre inspection slot.",
    lastActivity: new Date(Date.now() - 26 * 3600000).toISOString(), unread: 0, online: false,
    messages: [
      { id: "m1", conversationId: "c_004", sender: "them", text: "Mark, Tushar: please confirm centre inspection slot.", sentAt: new Date(Date.now() - 26 * 3600000).toISOString(), status: "read" },
    ],
  },
  {
    id: "c_005", name: "VIT Vellore — Placement Office", type: "college", avatarColor: "bg-violet-500", initials: "VV",
    lastMessage: "Batch enrollment list attached for verification.",
    lastActivity: new Date(Date.now() - 48 * 3600000).toISOString(), unread: 0, online: false,
    messages: [
      { id: "m1", conversationId: "c_005", sender: "them", text: "Batch enrollment list attached for verification.", sentAt: new Date(Date.now() - 48 * 3600000).toISOString(), status: "read" },
    ],
  },
  {
    id: "c_006", name: "HCL Talent Acquisition", type: "client", avatarColor: "bg-cyan-500", initials: "HT",
    lastMessage: "Offer acceptance confirmed for 3 candidates.",
    lastActivity: new Date(Date.now() - 72 * 3600000).toISOString(), unread: 0, online: false,
    messages: [
      { id: "m1", conversationId: "c_006", sender: "them", text: "Offer acceptance confirmed for 3 candidates.", sentAt: new Date(Date.now() - 72 * 3600000).toISOString(), status: "read" },
    ],
  },
];

const TEMPLATES = [
  { id: "t1", name: "Interview Invite", body: "Hi {name}, your interview with {company} for {role} is scheduled on {date} at {time}. Please confirm." },
  { id: "t2", name: "Offer Letter Follow-up", body: "Hi {name}, please acknowledge the offer letter shared by {company} by EOD {date}." },
  { id: "t3", name: "Drive Confirmation", body: "Dear {college}, we confirm the campus drive on {date}. Reporting time {time}. Looking forward." },
  { id: "t4", name: "Document Request", body: "Hi {name}, please share your {doc} at the earliest to proceed with onboarding." },
];

const SCHEDULED = [
  { id: "sc1", to: "BIT Mesra — Training Cell", message: "Reminder: Batch enrollment verification due Friday.", when: new Date(Date.now() + 2 * 3600000).toISOString() },
  { id: "sc2", to: "Acme Industries HR", message: "Sharing shortlist for Cloud Engineer role.", when: new Date(Date.now() + 6 * 3600000).toISOString() },
  { id: "sc3", to: "Zoho Campus Team", message: "Drive confirmation with candidate list.", when: new Date(Date.now() + 24 * 3600000).toISOString() },
];

export function PartnerClientMessaging() {
  const partner = CURRENT_PARTNER;
  const [conversations, setConversations] = React.useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = React.useState<string>(CONVERSATIONS[0].id);
  const [draft, setDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [groupMode, setGroupMode] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;
  const filteredConvos = conversations.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, active.messages.length]);

  function send() {
    if (!draft.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId: activeId,
      sender: "me",
      text: draft.trim(),
      sentAt: new Date().toISOString(),
      status: "sent",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastActivity: newMsg.sentAt, unread: 0 }
          : c
      )
    );
    setDraft("");
    toast.success("Message sent", { description: `Delivered to ${active.name}.` });
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function applyTemplate(body: string) {
    setDraft(body);
    toast.info("Template inserted", { description: "Edit placeholders before sending." });
  }

  function scheduleMessage() {
    if (!draft.trim()) {
      toast.error("Cannot schedule empty message");
      return;
    }
    toast.success("Message scheduled", { description: `Will be sent to ${active.name} tomorrow at 9:00 AM.` });
    setDraft("");
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Messaging Center"
        description={`${partner.name} — chat with clients, colleges and account teams. Templates, scheduled messages, read receipts and group chats.`}
        icon={<Icon name="MessageSquare" className="h-6 w-6" />}
        actions={[
          { label: "New Broadcast", icon: "Megaphone", variant: "outline", onClick: () => toast.info("New broadcast", { description: "Send a message to multiple conversations at once." }) },
        ]}
      />
      <PartnerDisclaimer />

      {/* Stats strip */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><MessageSquare className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Active Conversations</p><p className="text-lg font-semibold">{conversations.length}</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"><Bell className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Unread Messages</p><p className="text-lg font-semibold">{totalUnread}</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><Clock className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Scheduled</p><p className="text-lg font-semibold">{SCHEDULED.length}</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600"><FileText className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Templates</p><p className="text-lg font-semibold">{TEMPLATES.length}</p></div></div></Card>
      </div>

      {/* Messaging UI */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr_280px]">
        {/* Conversation list */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="h-9 pl-8" />
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
              <Label htmlFor="grp" className="text-xs flex items-center gap-1.5 cursor-pointer"><Users className="h-3.5 w-3.5" />Group mode</Label>
              <Switch id="grp" checked={groupMode} onCheckedChange={setGroupMode} />
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto scroll-thin max-h-[520px]">
            {filteredConvos.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b p-3 text-left transition hover:bg-muted/50",
                  activeId === c.id && "bg-brand/5 border-l-2 border-l-brand"
                )}
              >
                <div className="relative shrink-0">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white", c.avatarColor)}>
                    {c.initials}
                  </div>
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(c.lastActivity)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {c.type === "group" ? <Badge variant="outline" className="text-[9px] h-4 px-1.5"><Users className="h-2.5 w-2.5 mr-0.5" />Group</Badge>
                      : c.type === "college" ? <Badge variant="outline" className="text-[9px] h-4 px-1.5">College</Badge>
                      : <Badge variant="outline" className="text-[9px] h-4 px-1.5">Client</Badge>}
                    {c.unread > 0 && <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat view */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="p-3 border-b flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white", active.avatarColor)}>{active.initials}</div>
              <div>
                <CardTitle className="text-sm">{active.name}</CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {active.online ? <span className="text-emerald-600">● Online</span> : `Last seen ${timeAgo(active.lastActivity)}`}
                  {active.type === "group" && " · 5 members"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => toast.info("Call initiated", { description: `Calling ${active.name}...` })}><Icon name="Phone" className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Video call", { description: `Starting video call with ${active.name}.` })}><Icon name="Video" className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3 max-h-[400px] bg-muted/20">
            {active.messages.map((m) => (
              <div key={m.id} className={cn("flex", m.sender === "me" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm", m.sender === "me" ? "bg-brand text-white rounded-br-sm" : "bg-card border rounded-bl-sm")}>
                  <p className="leading-snug">{m.text}</p>
                  <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", m.sender === "me" ? "text-white/70" : "text-muted-foreground")}>
                    {formatDateTime(m.sentAt).split(",")[1]?.trim() || timeAgo(m.sentAt)}
                    {m.sender === "me" && (m.status === "read" ? <CheckCheck className="h-3 w-3" /> : m.status === "delivered" ? <CheckCheck className="h-3 w-3 opacity-50" /> : <Check className="h-3 w-3" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toast.info("Attach file", { description: "Choose a file to attach." })}><Paperclip className="h-4 w-4" /></Button>
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={groupMode ? "Broadcast to selected conversations..." : `Message ${active.name}...`}
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => toast.info("Emoji picker")}><Smile className="h-4 w-4" /></Button>
              <Button size="sm" onClick={send}><Send className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Press Enter to send · Shift+Enter for new line</span>
              <button className="hover:text-brand" onClick={scheduleMessage}>Schedule for later</button>
            </div>
          </div>
        </Card>

        {/* Right sidebar: templates + scheduled */}
        <div className="space-y-4">
          <Card className="p-4">
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-brand" />Template Library</CardTitle>
            <CardDescription className="mt-1 text-xs">Quick-insert canned responses</CardDescription>
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto scroll-thin pr-1">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => applyTemplate(t.body)} className="w-full rounded-lg border p-2 text-left transition hover:border-brand hover:bg-brand/5">
                  <p className="text-xs font-medium">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{t.body}</p>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("New template", { description: "Create a reusable message template." })}>+ New Template</Button>
          </Card>

          <Card className="p-4">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-brand" />Scheduled Messages</CardTitle>
            <CardDescription className="mt-1 text-xs">Auto-send at chosen time</CardDescription>
            <div className="mt-3 space-y-2">
              {SCHEDULED.map((s) => (
                <div key={s.id} className="rounded-lg border p-2">
                  <p className="text-[11px] font-medium text-brand">{formatDateTime(s.when)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">To: {s.to}</p>
                  <p className="mt-0.5 text-xs line-clamp-2">{s.message}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => toast.info("Scheduled queue", { description: "View and manage all scheduled messages." })}>View All Scheduled</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
