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
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { initials, timeAgo } from "@/lib/format";

interface Thread {
  id: string; title: string; course: string; author: string;
  replies: number; views: number; lastActivity: string;
  pinned: boolean; answered: boolean; locked: boolean;
  posts: { id: string; author: string; content: string; upvotes: number; at: string; }[];
}

const SEED_THREADS: Thread[] = [
  {
    id: "t1", title: "Best practices for async/await in Node.js", course: "Backend Engineering 101",
    author: "Aarav Sharma", replies: 12, views: 248, lastActivity: "2025-01-17T10:30:00",
    pinned: true, answered: true, locked: false,
    posts: [
      { id: "p1", author: "Aarav Sharma", content: "What are the gotchas to watch out for when using async/await in production Node services? Specifically around error handling and Promise.all.", upvotes: 8, at: "2025-01-15T10:00:00" },
      { id: "p2", author: "Diya Patel", content: "Always wrap await calls in try/catch, or use a wrapper helper. Also never ignore Promise.allSettled over Promise.all when partial failures are OK.", upvotes: 5, at: "2025-01-15T11:30:00" },
    ],
  },
  {
    id: "t2", title: "How to structure Redux store for large apps?", course: "Frontend Mastery",
    author: "Kabir Mehta", replies: 8, views: 162, lastActivity: "2025-01-16T15:00:00",
    pinned: false, answered: false, locked: false,
    posts: [
      { id: "p3", author: "Kabir Mehta", content: "Our Redux store is getting unwieldy — any patterns for slicing state?", upvotes: 4, at: "2025-01-14T15:00:00" },
    ],
  },
  {
    id: "t3", title: "System design: how does Uber handle real-time location?", course: "System Design Bootcamp",
    author: "Ananya Reddy", replies: 24, views: 524, lastActivity: "2025-01-17T09:00:00",
    pinned: true, answered: true, locked: false,
    posts: [
      { id: "p4", author: "Ananya Reddy", content: "Curious about the architecture behind real-time driver tracking at scale.", upvotes: 18, at: "2025-01-12T09:00:00" },
    ],
  },
  {
    id: "t4", title: "Mock interview this Saturday — anyone interested?", course: "Interview Prep",
    author: "Rohan Gupta", replies: 5, views: 88, lastActivity: "2025-01-15T18:00:00",
    pinned: false, answered: false, locked: false,
    posts: [
      { id: "p5", author: "Rohan Gupta", content: "Looking for 2-3 partners for a Saturday mock interview session.", upvotes: 2, at: "2025-01-13T18:00:00" },
    ],
  },
  {
    id: "t5", title: "Assignment 3 deadline extension?", course: "DSA in Java",
    author: "Ishaan Verma", replies: 3, views: 76, lastActivity: "2025-01-14T20:00:00",
    pinned: false, answered: true, locked: true,
    posts: [
      { id: "p6", author: "Ishaan Verma", content: "Anyone else finding Assignment 3 tough? Asking for a 2-day extension.", upvotes: 6, at: "2025-01-12T20:00:00" },
    ],
  },
  {
    id: "t6", title: "Career switch from QA to Dev — tips?", course: "Career Transitions",
    author: "Meera Krishnan", replies: 14, views: 312, lastActivity: "2025-01-17T08:00:00",
    pinned: false, answered: false, locked: false,
    posts: [
      { id: "p7", author: "Meera Krishnan", content: "I have 4 years in QA. Want to move to dev — what skills should I prioritize?", upvotes: 9, at: "2025-01-11T08:00:00" },
    ],
  },
];

const COURSES = ["All Courses", "Backend Engineering 101", "Frontend Mastery", "System Design Bootcamp", "Interview Prep", "DSA in Java", "Career Transitions"];

const LEADERBOARD = [
  { name: "Aarav Sharma", posts: 42, upvotes: 218, badge: "Gold" },
  { name: "Ananya Reddy", posts: 38, upvotes: 196, badge: "Gold" },
  { name: "Diya Patel", posts: 29, upvotes: 142, badge: "Silver" },
  { name: "Kabir Mehta", posts: 24, upvotes: 96, badge: "Silver" },
  { name: "Rohan Gupta", posts: 18, upvotes: 64, badge: "Bronze" },
];

export function TrainingDiscussionForums() {
  const [threads, setThreads] = React.useState<Thread[]>(SEED_THREADS);
  const [courseFilter, setCourseFilter] = React.useState("All Courses");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [reply, setReply] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", course: "Backend Engineering 101", content: "" });

  const active = threads.find((t) => t.id === activeId);
  const visible = threads.filter((t) => courseFilter === "All Courses" || t.course === courseFilter);

  const upvote = (threadId: string, postId: string) => {
    setThreads((ts) => ts.map((t) => t.id === threadId ? { ...t, posts: t.posts.map((p) => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p) } : t));
    toast.success("Upvoted");
  };
  const submitReply = () => {
    if (!reply.trim() || !active) return;
    setThreads((ts) => ts.map((t) => t.id === active.id ? { ...t, posts: [...t.posts, { id: `p${Date.now()}`, author: "You", content: reply.trim(), upvotes: 0, at: new Date().toISOString() }], replies: t.replies + 1, lastActivity: new Date().toISOString() } : t));
    setReply("");
    toast.success("Reply posted");
  };
  const createThread = () => {
    if (!form.title.trim() || !form.content.trim()) { toast.error("Title and content required"); return; }
    const t: Thread = {
      id: `t${Date.now()}`, title: form.title.trim(), course: form.course, author: "You",
      replies: 0, views: 1, lastActivity: new Date().toISOString(),
      pinned: false, answered: false, locked: false,
      posts: [{ id: `p${Date.now()}`, author: "You", content: form.content.trim(), upvotes: 0, at: new Date().toISOString() }],
    };
    setThreads((ts) => [t, ...ts]);
    setCreateOpen(false); setForm({ title: "", course: "Backend Engineering 101", content: "" });
    toast.success("Thread created");
  };
  const pin = (id: string) => { setThreads((ts) => ts.map((t) => t.id === id ? { ...t, pinned: !t.pinned } : t)); toast.success("Thread updated"); };
  const lock = (id: string) => { setThreads((ts) => ts.map((t) => t.id === id ? { ...t, locked: !t.locked } : t)); toast.success("Thread updated"); };
  const del = (id: string) => { setThreads((ts) => ts.filter((t) => t.id !== id)); setActiveId(null); toast.success("Thread deleted"); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discussion Forums"
        description="Course-threaded discussions for peer learning and Q&A."
        icon={<Icon name="MessageSquare" className="h-6 w-6" />}
        actions={[{ label: "New Thread", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Threads" value={threads.length} icon={<Icon name="MessageSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Replies" value={threads.reduce((s, t) => s + t.replies, 0)} icon={<Icon name="MessagesSquare" className="h-5 w-5" />} />
        <StatCard label="Unanswered" value={threads.filter((t) => !t.answered).length} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="warning" />
      </div>

      {!active ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Course:</span>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <SectionCard title="Threads" description={`${visible.length} threads`}>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scroll-thin">
              {visible.map((t) => (
                <button key={t.id} onClick={() => setActiveId(t.id)}
                  className="w-full rounded-lg border p-3 text-left transition hover:bg-brand/5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {t.pinned && <Icon name="Pin" className="h-3 w-3 text-amber-500" />}
                        <p className="font-medium">{t.title}</p>
                        {t.answered && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Answered</Badge>}
                        {t.locked && <Badge variant="outline" className="text-[10px]">Locked</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{t.course} · by {t.author}</p>
                    </div>
                    <div className="flex shrink-0 gap-3 text-xs text-muted-foreground">
                      <span><Icon name="MessageSquare" className="mr-1 inline h-3 w-3" />{t.replies}</span>
                      <span><Icon name="Eye" className="mr-1 inline h-3 w-3" />{t.views}</span>
                      <span>{timeAgo(t.lastActivity)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
        </>
      ) : (
        <SectionCard
          title={active.title}
          description={`${active.course} · by ${active.author}`}
          action={<Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>← Back</Button>}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => pin(active.id)}><Icon name="Pin" className="mr-1 h-3 w-3" />{active.pinned ? "Unpin" : "Pin"}</Button>
            <Button variant="outline" size="sm" onClick={() => lock(active.id)}>{active.locked ? "Unlock" : "Lock"}</Button>
            <Button variant="outline" size="sm" onClick={() => del(active.id)} className="text-rose-600"><Icon name="Trash2" className="mr-1 h-3 w-3" />Delete</Button>
          </div>
          <div className="space-y-3">
            {active.posts.map((p) => (
              <Card key={p.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                    {initials(p.author)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{p.author}</p>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(p.at)}</span>
                    </div>
                    <p className="mt-1 text-sm">{p.content}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => upvote(active.id, p.id)}>
                        <Icon name="ArrowUpRight" className="mr-1 h-3 w-3" /> {p.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm"><Icon name="MessageSquare" className="mr-1 h-3 w-3" /> Reply</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {!active.locked && (
            <div className="mt-4 space-y-2">
              <Textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" />
              <Button onClick={submitReply} className="bg-brand text-white hover:bg-brand/90">Post Reply</Button>
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="Top Contributors" description="This month's leaderboard">
        <div className="space-y-2">
          {LEADERBOARD.map((u, i) => (
            <div key={u.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.posts} posts · {u.upvotes} upvotes</p>
                </div>
              </div>
              <Badge className={u.badge === "Gold" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : u.badge === "Silver" ? "bg-slate-400/10 text-slate-600 border-slate-400/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}>
                {u.badge}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Thread</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div>
              <Label>Course</Label>
              <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COURSES.filter((c) => c !== "All Courses").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Content</Label><Textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createThread} className="bg-brand text-white hover:bg-brand/90">Create Thread</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
