"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { communityThreads } from "@/lib/lms-data";
import type { CommunityThread } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState, Card, CardContent, CardHeader } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LearnerDisclaimer,
} from "./_shared";
import { toast } from "sonner";
import {
  MessageSquare, Plus, Search, Pin, Eye, Reply, ArrowLeft, Send,
  ThumbsUp,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  initials: string;
  color: string;
  body: string;
  time: string;
  likes: number;
}

const MOCK_POSTS: Record<string, Post[]> = {
  default: [
    {
      id: "p1",
      author: "Meera Iyer",
      initials: "MI",
      color: "oklch(0.55 0.13 200)",
      body: "Great question! React 19's concurrent features are best understood through the useTransition hook. The official docs are solid, but the deep-dive in SkillForge's React course is excellent.",
      time: "5 hours ago",
      likes: 12,
    },
    {
      id: "p2",
      author: "Vikram Singh",
      initials: "VS",
      color: "oklch(0.6 0.16 70)",
      body: "Don't sleep on the React team's RFC discussions — they explain the 'why' behind the API design. Also, the Epic React exercises by Kent C. Dodds pair really well with this course.",
      time: "3 hours ago",
      likes: 8,
    },
    {
      id: "p3",
      author: "Sneha Kapoor",
      initials: "SK",
      color: "oklch(0.6 0.13 300)",
      body: "Sharing my notes from the module — hope this helps! https://notes.skillforge/academy/react19-concurrent",
      time: "1 hour ago",
      likes: 5,
    },
  ],
};

export function LearnerCommunity() {
  const { navigate } = useNav();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [activeThread, setActiveThread] = React.useState<CommunityThread | null>(null);
  const [posts, setPosts] = React.useState<Record<string, Post[]>>({});
  const [newReply, setNewReply] = React.useState("");
  const [newThreadOpen, setNewThreadOpen] = React.useState(false);

  // New thread form
  const [ntTitle, setNtTitle] = React.useState("");
  const [ntCategory, setNtCategory] = React.useState("React");
  const [ntBody, setNtBody] = React.useState("");

  const categories = ["all", ...Array.from(new Set(communityThreads.map((t) => t.category)))];

  const filtered = React.useMemo(() => {
    let list = communityThreads;
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q)),
      );
    }
    // pinned first, then most recent
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
  }, [category, query]);

  function openThread(t: CommunityThread) {
    setActiveThread(t);
    setPosts((p) => ({
      ...p,
      [t.id]: p[t.id] ?? MOCK_POSTS.default.map((post) => ({ ...post, id: `${t.id}_${post.id}` })),
    }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function postReply() {
    if (!activeThread || !newReply.trim()) return;
    setPosts((p) => ({
      ...p,
      [activeThread.id]: [
        ...(p[activeThread.id] ?? []),
        {
          id: `reply_${Date.now()}`,
          author: "Aditya Rao",
          initials: "AR",
          color: "oklch(0.55 0.13 165)",
          body: newReply.trim(),
          time: "just now",
          likes: 0,
        },
      ],
    }));
    setNewReply("");
    toast.success("Reply posted to thread");
  }

  function likePost(threadId: string, postId: string) {
    setPosts((p) => ({
      ...p,
      [threadId]: (p[threadId] ?? []).map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    }));
  }

  function createThread() {
    if (!ntTitle.trim() || !ntBody.trim()) {
      toast.error("Please fill in title and body");
      return;
    }
    toast.success("Thread posted!", {
      description: `"${ntTitle}" is now live in the ${ntCategory} category`,
    });
    setNewThreadOpen(false);
    setNtTitle("");
    setNtBody("");
    setNtCategory("React");
  }

  // Thread detail view
  if (activeThread) {
    const threadPosts = posts[activeThread.id] ?? [];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setActiveThread(null)}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to community
          </Button>
        </div>

        <PageHeader
          title={activeThread.title}
          description={`Started by ${activeThread.author} · ${activeThread.replies} replies · ${activeThread.views} views`}
        />

        {/* Original post */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AvatarLogo text={activeThread.author} size="md" />
              <div>
                <p className="text-sm font-semibold">{activeThread.author}</p>
                <p className="text-xs text-muted-foreground">Started this thread · {activeThread.lastReply}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Hey everyone — I&apos;ve been working through this topic and wanted to start a discussion. Looking for advice, resources, and others&apos; experiences. Please share your thoughts below!
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{activeThread.category}</Badge>
                {activeThread.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                ))}
                {activeThread.pinned && (
                  <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px]">
                    <Pin className="mr-1 h-3 w-3" /> Pinned
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <SectionCard title={`Replies (${threadPosts.length})`}>
          <ul className="space-y-3">
            {threadPosts.map((p) => (
              <li key={p.id} className="rounded-lg border p-3">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                    style={{ background: p.color }}
                  >
                    {p.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{p.author}</span>
                      <span className="text-muted-foreground">{p.time}</span>
                    </div>
                    <p className="mt-1 text-sm">{p.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <button
                        onClick={() => likePost(activeThread.id, p.id)}
                        className="flex items-center gap-1 hover:text-brand"
                      >
                        <ThumbsUp className="h-3 w-3" /> {p.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-brand">
                        <Reply className="h-3 w-3" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Reply input */}
          <div className="mt-4 space-y-2 border-t pt-4">
            <Label htmlFor="reply">Add your reply</Label>
            <Textarea
              id="reply"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={postReply} disabled={!newReply.trim()}>
                <Send className="mr-1 h-3.5 w-3.5" /> Post reply
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Discuss courses, share resources, and learn together."
        icon={<MessageSquare className="h-5 w-5" />}
        actions={[
          { label: "New thread", icon: "Plus", onClick: () => setNewThreadOpen(true) },
        ]}
      />

      <LearnerDisclaimer />

      {/* Search + categories */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search threads and tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition " +
              (category === c
                ? "border-brand bg-brand text-white"
                : "bg-card hover:bg-muted")
            }
          >
            {c === "all" ? "All categories" : c}
          </button>
        ))}
      </div>

      {/* Threads */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="No threads found"
          description="Try a different search or category — or start a new thread."
          action={<Button onClick={() => setNewThreadOpen(true)}><Plus className="mr-1 h-4 w-4" /> New thread</Button>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => openThread(t)}
              className={
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition hover:border-brand/40 hover:shadow-sm " +
                (t.pinned ? "border-amber-500/30 bg-amber-500/5" : "")
              }
            >
              <AvatarLogo text={t.author} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {t.pinned && <Pin className="h-3 w-3 text-amber-500" />}
                      <p className="truncate text-sm font-semibold hover:text-brand">{t.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {t.author} · last reply by {t.lastReplyBy} · {t.lastReply}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
                      {t.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Reply className="h-3 w-3" /> {t.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {t.views}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New thread dialog */}
      <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new thread</DialogTitle>
            <DialogDescription>
              Share a question, resource, or insight with the SkillForge community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="nt-title">Title</Label>
              <Input
                id="nt-title"
                value={ntTitle}
                onChange={(e) => setNtTitle(e.target.value)}
                placeholder="e.g. Best practices for React 19 server components?"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={ntCategory} onValueChange={setNtCategory}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(communityThreads.map((t) => t.category))).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nt-body">Body</Label>
              <Textarea
                id="nt-body"
                value={ntBody}
                onChange={(e) => setNtBody(e.target.value)}
                placeholder="What would you like to discuss?"
                rows={5}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewThreadOpen(false)}>Cancel</Button>
            <Button onClick={createThread}>
              <Plus className="mr-1 h-4 w-4" /> Post thread
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
