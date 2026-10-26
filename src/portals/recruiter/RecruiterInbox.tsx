"use client";

import * as React from "react";
import {
  Plus, Search, Star, Trash2, Archive, Send, Paperclip, Mail,
  Inbox as InboxIcon, FileText, Tag, ArrowLeft, ChevronRight,
} from "lucide-react";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";
import { inboxThreads } from "@/lib/partner-data";
import type { InboxThread } from "@/lib/partner-data";

const FOLDERS = [
  { key: "inbox", label: "Inbox", icon: InboxIcon },
  { key: "sent", label: "Sent", icon: Send },
  { key: "drafts", label: "Drafts", icon: FileText },
  { key: "archived", label: "Archived", icon: Archive },
] as const;

type Folder = typeof FOLDERS[number]["key"];

export function RecruiterInbox() {
  const [threads, setThreads] = React.useState<InboxThread[]>(inboxThreads);
  const [folder, setFolder] = React.useState<Folder>("inbox");
  const [selectedId, setSelectedId] = React.useState<string | null>(inboxThreads[0]?.id ?? null);
  const [search, setSearch] = React.useState("");
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<InboxThread | null>(null);
  const [reply, setReply] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const folderThreads = threads
    .filter((t) => t.folder === folder)
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.candidateName.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  const unreadByFolder = (f: Folder) => threads.filter((t) => t.folder === f && t.unread).length;

  const openThread = (t: InboxThread) => {
    setSelectedId(t.id);
    setMobileOpen(true);
    if (t.unread) {
      setThreads((prev) => prev.map((x) => x.id === t.id ? { ...x, unread: false } : x));
    }
  };

  const toggleStar = (id: string) => {
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const archive = (id: string) => {
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, folder: "archived" } : t));
    toast.success("Thread archived");
    if (selectedId === id) setSelectedId(null);
    setMobileOpen(false);
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    setThreads((prev) => prev.map((t) => t.id === selected.id ? {
      ...t,
      replies: t.replies + 1,
      lastReplyAt: new Date().toISOString(),
      preview: reply.slice(0, 80),
    } : t));
    toast.success(`Reply sent to ${selected.candidateName}`);
    setReply("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate inbox"
        description="Two-pane inbox for every candidate conversation. Compose, reply, star, and archive."
        actions={[{ label: "Compose", onClick: () => setComposeOpen(true) }]}
      />

      <SectionCard contentClassName="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[220px_320px_1fr] min-h-[600px]">
          {/* Folders sidebar */}
          <aside className="border-r bg-muted/30 p-3">
            <nav className="space-y-1">
              {FOLDERS.map((f) => {
                const count = f.key === "inbox" ? unreadByFolder("inbox") : threads.filter((t) => t.folder === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => { setFolder(f.key); setSelectedId(null); setMobileOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${folder === f.key ? "bg-brand text-white" : "hover:bg-muted"}`}
                  >
                    <span className="flex items-center gap-2">
                      <f.icon className="h-4 w-4" />
                      {f.label}
                    </span>
                    {count > 0 && (
                      <Badge variant={folder === f.key ? "secondary" : "outline"} className="text-[10px] h-5 px-1.5">
                        {count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(threads.flatMap((t) => t.tags))).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5 gap-1">
                    <Tag className="h-2.5 w-2.5" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          {/* Thread list */}
          <div className={`border-r ${mobileOpen ? "hidden md:block" : "block"}`}>
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search threads…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="h-[560px]">
              <div className="divide-y">
                {folderThreads.length === 0 ? (
                  <div className="p-8 text-center">
                    <EmptyState icon={<InboxIcon className="h-5 w-5" />} title="No threads" description={`Nothing in ${folder}.`} />
                  </div>
                ) : folderThreads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openThread(t)}
                    className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedId === t.id ? "bg-brand/5 border-l-2 border-brand" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <AvatarLogo text={t.candidateName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm truncate ${t.unread ? "font-semibold" : "font-medium"}`}>{t.candidateName}</p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(t.receivedAt)}</span>
                        </div>
                        <p className={`text-xs truncate ${t.unread ? "font-medium" : "text-muted-foreground"}`}>{t.subject}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{t.preview}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {t.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                          {t.attachments && t.attachments.length > 0 && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                          {t.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1">{tag}</Badge>
                          ))}
                          {t.replies > 0 && <span className="text-[9px] text-muted-foreground ml-auto">{t.replies} replies</span>}
                        </div>
                      </div>
                      {t.unread && <span className="h-2 w-2 rounded-full bg-brand shrink-0 mt-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Thread detail */}
          <div className={`${mobileOpen ? "block" : "hidden md:block"}`}>
            {!selected ? (
              <div className="h-full flex items-center justify-center p-8">
                <EmptyState icon={<Mail className="h-5 w-5" />} title="Select a thread" description="Pick a conversation from the list to read it here." />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0" onClick={() => setMobileOpen(false)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <AvatarLogo text={selected.candidateName} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold truncate">{selected.subject}</h3>
                      <p className="text-xs text-muted-foreground">
                        From <span className="font-medium text-foreground">{selected.candidateName}</span> &lt;{selected.candidateEmail}&gt;
                      </p>
                      <p className="text-[10px] text-muted-foreground">{formatDateTime(selected.receivedAt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleStar(selected.id)}>
                        <Star className={`h-4 w-4 ${selected.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => archive(selected.id)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700" onClick={() => setDeleteTarget(selected)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5 gap-1">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <ScrollArea className="flex-1 max-h-[400px]">
                  <div className="p-4 text-sm whitespace-pre-line">{selected.body}</div>
                  {selected.attachments && selected.attachments.length > 0 && (
                    <div className="px-4 pb-4">
                      <p className="text-xs font-medium mb-2 flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attachments</p>
                      <div className="space-y-1.5">
                        {selected.attachments.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => toast.success(`Downloading ${a.name}`)}
                            className="flex items-center gap-2 w-full text-left rounded-md border p-2 hover:bg-muted/50 transition-colors"
                          >
                            <div className="rounded bg-muted p-1.5">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate">{a.name}</p>
                              <p className="text-[10px] text-muted-foreground">{a.size}</p>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Reply */}
                <div className="border-t p-3 bg-muted/30">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={`Reply to ${selected.candidateName}…`}
                    rows={3}
                    className="bg-card text-sm"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toast.success("Attachment picker opened")}>
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setReply("")}>Clear</Button>
                      <Button size="sm" onClick={sendReply} disabled={!reply.trim()}>
                        <Send className="h-3.5 w-3.5" /> Send reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onSend={(rec) => {
          setThreads((prev) => [rec, ...prev]);
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this thread?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && <>The conversation with <strong>{deleteTarget.candidateName}</strong> about "{deleteTarget.subject}" will be permanently removed from your inbox.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                if (deleteTarget) {
                  setThreads((prev) => prev.filter((t) => t.id !== deleteTarget.id));
                  if (selectedId === deleteTarget.id) setSelectedId(null);
                  toast.success("Thread deleted");
                }
                setDeleteTarget(null);
                setMobileOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ComposeDialog({
  open, onOpenChange, onSend,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSend: (rec: InboxThread) => void;
}) {
  const [candidate, setCandidate] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const submit = () => {
    if (!candidate || !subject || !body) {
      toast.error("Candidate, subject, and body are required");
      return;
    }
    const rec: InboxThread = {
      id: "inx_" + Date.now(),
      candidateName: candidate,
      candidateEmail: email || "unknown@example.com",
      subject,
      preview: body.slice(0, 80),
      body,
      unread: false,
      starred: false,
      folder: "sent",
      tags: [],
      receivedAt: new Date().toISOString(),
      lastReplyAt: new Date().toISOString(),
      replies: 0,
    };
    onSend(rec);
    toast.success(`Email sent to ${candidate}`);
    onOpenChange(false);
    setCandidate(""); setEmail(""); setSubject(""); setBody("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose email</DialogTitle>
          <DialogDescription>Send a new email to a candidate.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>To (candidate)</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Priya Nair" />
          </div>
          <div className="space-y-2">
            <Label>Candidate email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya.nair@gmail.com" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Interview scheduled — Senior Full-Stack Engineer" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Body</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Hi …" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Attachment picker opened")}>
              <Paperclip className="h-3.5 w-3.5" /> Attach
            </Button>
            <Select defaultValue="none">
              <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No template</SelectItem>
                <SelectItem value="interview">Interview confirmation</SelectItem>
                <SelectItem value="offer">Offer details</SelectItem>
                <SelectItem value="regret">Regret email</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Send className="h-4 w-4 mr-1" /> Send email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
