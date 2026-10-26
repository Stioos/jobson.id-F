"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { initials } from "@/lib/format";

interface Member { id: string; name: string; }
interface Message {
  id: string; senderId: string; senderName: string; text: string; at: string;
}
interface Group {
  id: string; name: string; topic: string; members: Member[];
  unread: number; lastMessage: string; lastAt: string;
  messages: Message[];
}

const ALL_PEOPLE: Member[] = [
  { id: "u1", name: "Aarav Sharma" },
  { id: "u2", name: "Diya Patel" },
  { id: "u3", name: "Kabir Mehta" },
  { id: "u4", name: "Ananya Reddy" },
  { id: "u5", name: "Rohan Gupta" },
  { id: "u6", name: "Ishaan Verma" },
];

const SEED_GROUPS: Group[] = [
  {
    id: "g1", name: "Frontend Job Hunt 2025", topic: "React • TypeScript • Remote",
    members: [ALL_PEOPLE[0], ALL_PEOPLE[1], ALL_PEOPLE[2], ALL_PEOPLE[3]],
    unread: 3, lastMessage: "Did anyone hear back from Razorpay?", lastAt: "10:42",
    messages: [
      { id: "m1", senderId: "u2", senderName: "Diya Patel", text: "Found 3 new React roles this morning — posting in channel", at: "10:30" },
      { id: "m2", senderId: "u3", senderName: "Kabir Mehta", text: "Thanks! Got my resume reviewed yesterday — felt good", at: "10:35" },
      { id: "m3", senderId: "u4", senderName: "Ananya Reddy", text: "Did anyone hear back from Razorpay?", at: "10:42" },
    ],
  },
  {
    id: "g2", name: "Bangalore Tech Network", topic: "Local meetups & referrals",
    members: [ALL_PEOPLE[0], ALL_PEOPLE[4], ALL_PEOPLE[5]],
    unread: 0, lastMessage: "JSConf tickets go on sale Friday", lastAt: "Yesterday",
    messages: [
      { id: "m4", senderId: "u5", senderName: "Rohan Gupta", text: "JSConf tickets go on sale Friday", at: "Yesterday 16:20" },
      { id: "m5", senderId: "u1", senderName: "Aarav Sharma", text: "Booking 3 — anyone want to split bulk?", at: "Yesterday 17:05" },
    ],
  },
  {
    id: "g3", name: "System Design Study Circle", topic: "Weekly mock interviews",
    members: [ALL_PEOPLE[0], ALL_PEOPLE[1], ALL_PEOPLE[5]],
    unread: 1, lastMessage: "Mock session Sat 4pm — prep scaling topics", lastAt: "Mon",
    messages: [
      { id: "m6", senderId: "u6", senderName: "Ishaan Verma", text: "Mock session Sat 4pm — prep scaling topics", at: "Mon 12:00" },
    ],
  },
  {
    id: "g4", name: "Resume Review Buddies", topic: "Peer reviews • ATS tips",
    members: [ALL_PEOPLE[0], ALL_PEOPLE[2], ALL_PEOPLE[3], ALL_PEOPLE[4]],
    unread: 0, lastMessage: "Latest template uploaded — looks clean", lastAt: "2d ago",
    messages: [
      { id: "m7", senderId: "u3", senderName: "Kabir Mehta", text: "Latest template uploaded — looks clean", at: "2d ago" },
    ],
  },
];

export function CandidateGroupChat() {
  const [groups, setGroups] = React.useState<Group[]>(SEED_GROUPS);
  const [activeId, setActiveId] = React.useState<string>(SEED_GROUPS[0].id);
  const [draft, setDraft] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");
  const [picked, setPicked] = React.useState<string[]>(["u1"]);

  const active = groups.find((g) => g.id === activeId)!;

  const send = () => {
    if (!draft.trim()) return;
    setGroups((gs) => gs.map((g) => g.id === activeId
      ? { ...g, messages: [...g.messages, { id: `m${Date.now()}`, senderId: "u1", senderName: "Aarav Sharma", text: draft.trim(), at: "now" }], lastMessage: draft.trim(), lastAt: "now", unread: 0 }
      : g));
    setDraft("");
  };

  const markRead = (id: string) => {
    setActiveId(id);
    setGroups((gs) => gs.map((g) => g.id === id ? { ...g, unread: 0 } : g));
  };

  const leave = () => {
    toast.success(`Left group "${active.name}"`);
    setGroups((gs) => gs.filter((g) => g.id !== activeId));
    if (groups.length > 1) setActiveId(groups.find((g) => g.id !== activeId)!.id);
  };

  const createGroup = () => {
    if (!newName.trim()) { toast.error("Group name is required"); return; }
    if (picked.length < 2) { toast.error("Select at least 2 members"); return; }
    const g: Group = {
      id: `g${Date.now()}`, name: newName.trim(), topic: newTopic.trim() || "General",
      members: ALL_PEOPLE.filter((p) => picked.includes(p.id)),
      unread: 0, lastMessage: "Group created", lastAt: "now",
      messages: [{ id: `m${Date.now()}`, senderId: "u1", senderName: "Aarav Sharma", text: `Welcome to ${newName.trim()}!`, at: "now" }],
    };
    setGroups((gs) => [g, ...gs]);
    setActiveId(g.id);
    setCreateOpen(false); setNewName(""); setNewTopic(""); setPicked(["u1"]);
    toast.success(`Group "${g.name}" created`);
  };

  const togglePick = (id: string) =>
    setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Group Chat"
        description="Connect with peers in shared job-hunt, study, and networking groups."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Create Group", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr_240px]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b p-3">
            <p className="text-sm font-semibold">Your Groups</p>
            <p className="text-xs text-muted-foreground">{groups.length} active</p>
          </div>
          <div className="max-h-[560px] overflow-y-auto scroll-thin">
            {groups.map((g) => (
              <button key={g.id} onClick={() => markRead(g.id)}
                className={`w-full border-b px-3 py-3 text-left transition hover:bg-brand/5 ${g.id === activeId ? "bg-brand/10" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{g.name}</p>
                  {g.unread > 0 && <Badge className="bg-brand text-white">{g.unread}</Badge>}
                </div>
                <p className="truncate text-xs text-muted-foreground">{g.lastMessage}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{g.members.length} members</span>
                  <span className="text-[10px] text-muted-foreground">{g.lastAt}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.topic} · {active.members.length} members</p>
              </div>
              <Badge className="bg-brand/10 text-brand border-brand/20">Active</Badge>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto scroll-thin p-4" style={{ maxHeight: "440px" }}>
            {active.messages.map((m) => {
              const mine = m.senderId === "u1";
              return (
                <div key={m.id} className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${mine ? "bg-brand text-white" : "bg-brand/10 text-brand"}`}>
                    {initials(m.senderName)}
                  </div>
                  <div className={`max-w-[75%] ${mine ? "text-right" : ""}`}>
                    <div className="mb-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      {!mine && <span className="font-medium text-foreground">{m.senderName}</span>}
                      <span>{m.at}</span>
                    </div>
                    <div className={`inline-block rounded-2xl px-3 py-2 text-sm ${mine ? "bg-brand text-white" : "bg-muted text-foreground"}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message…" />
              <Button onClick={send} className="bg-brand text-white hover:bg-brand/90">
                <Icon name="Send" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Members</p>
            <Button variant="ghost" size="sm" onClick={leave} className="text-rose-600 hover:text-rose-700">
              Leave
            </Button>
          </div>
          <div className="space-y-2 max-h-[440px] overflow-y-auto scroll-thin">
            {active.members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-lg border p-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                  {initials(m.name)}
                </div>
                <span className="text-sm">{m.name}</span>
                {m.id === "u1" && <Badge variant="outline" className="ml-auto text-[10px]">You</Badge>}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-brand/5 p-3 text-xs text-muted-foreground">
            <Icon name="Bell" className="mr-1 inline h-3 w-3" />
            Notifications: All messages
          </div>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild><span /></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="gn">Group name</Label>
              <Input id="gn" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Backend Job Hunt" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gt">Topic</Label>
              <Input id="gt" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g. Java • Spring • Referrals" />
            </div>
            <div className="space-y-2">
              <Label>Select members</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scroll-thin rounded-lg border p-2">
                {ALL_PEOPLE.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={picked.includes(p.id)} onCheckedChange={() => togglePick(p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createGroup} className="bg-brand text-white hover:bg-brand/90">Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
