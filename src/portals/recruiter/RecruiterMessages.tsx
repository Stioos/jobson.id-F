"use client";

import * as React from "react";
import { Send, Inbox, Star, Reply, Mail, FileText, Sparkles, PenSquare } from "lucide-react";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { timeAgo, formatDateTime } from "@/lib/format";
import { messages as allMessages } from "@/lib/mock-data";
import { messageTemplates } from "@/lib/portal-data";
import type { Message } from "@/lib/types";

type Folder = "inbox" | "sent" | "draft" | "starred";

export function RecruiterMessages() {
  const [folder, setFolder] = React.useState<Folder>("inbox");
  const [selected, setSelected] = React.useState<Message | null>(null);
  const [reply, setReply] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(allMessages);

  const folderMessages = React.useMemo(() => {
    if (folder === "starred") return messages.filter((m) => m.starred);
    return messages.filter((m) => m.folder === folder);
  }, [folder, messages]);

  const filtered = folderMessages.filter((m) =>
    !search || m.subject.toLowerCase().includes(search.toLowerCase()) || m.senderName.toLowerCase().includes(search.toLowerCase()) || m.recipientName.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    setSelected(null);
  }, [folder]);

  const send = () => {
    if (!reply.trim() || !selected) return;
    toast.success("Reply sent", { description: `To ${selected.senderName}` });
    setReply("");
  };

  const onCompose = (recipient: string, subject: string, body: string) => {
    const newMsg: Message = {
      id: `m_new_${Date.now()}`,
      threadId: `thd_new_${Date.now()}`,
      senderId: "u_004",
      senderName: "Sneha Reddy",
      recipientName: recipient,
      subject,
      preview: body.slice(0, 120),
      body,
      read: true,
      starred: false,
      folder: "sent",
      attachments: [],
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    setComposeOpen(false);
    toast.success("Message sent", { description: `To ${recipient}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Conversations with clients and candidates. Use templates for faster outreach."
        actions={[
          { label: "Compose", onClick: () => setComposeOpen(true) },
        ]}
      />

      <SectionCard>
        <Tabs value={folder} onValueChange={(v) => setFolder(v as Folder)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="inbox"><Inbox className="mr-1.5 h-3.5 w-3.5" /> Inbox</TabsTrigger>
              <TabsTrigger value="sent"><Send className="mr-1.5 h-3.5 w-3.5" /> Sent</TabsTrigger>
              <TabsTrigger value="starred"><Star className="mr-1.5 h-3.5 w-3.5" /> Starred</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <Input
              placeholder="Search messages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full sm:w-72"
            />
          </div>

          <TabsContent value={folder} className="mt-3">
            {filtered.length === 0 ? (
              <EmptyState icon={<Mail className="h-5 w-5" />} title="No messages" description="Compose a new message to start a conversation." action={<Button size="sm" onClick={() => setComposeOpen(true)}><PenSquare className="mr-1 h-4 w-4" /> Compose</Button>} />
            ) : (
              <div className="grid gap-3 md:grid-cols-[320px_1fr]">
                <div className="max-h-[600px] overflow-y-auto scroll-thin rounded-lg border">
                  <ul className="divide-y">
                    {filtered.map((m) => (
                      <li key={m.id}>
                        <button
                          onClick={() => setSelected(m)}
                          className={`flex w-full items-start gap-3 p-3 text-left transition hover:bg-muted/50 ${selected?.id === m.id ? "bg-brand/5" : ""}`}
                        >
                          <AvatarLogo text={m.senderName} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-medium">{m.senderName}</p>
                              <span className="text-[10px] text-muted-foreground">{timeAgo(m.timestamp)}</span>
                            </div>
                            <p className="truncate text-xs font-medium">{m.subject}</p>
                            <p className="truncate text-xs text-muted-foreground">{m.preview}</p>
                          </div>
                          {m.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                          {!m.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border">
                  {selected ? (
                    <div className="flex h-full flex-col">
                      <div className="border-b p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <AvatarLogo text={selected.senderName} size="md" />
                            <div>
                              <p className="text-sm font-semibold">{selected.subject}</p>
                              <p className="text-xs text-muted-foreground">From {selected.senderName} → {selected.recipientName}</p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(selected.timestamp)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => toast.success("Starred")}><Star className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => toast.success("Archived")}><Inbox className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 text-sm">
                        <p className="whitespace-pre-line text-sm">{selected.body}</p>
                        {selected.attachments.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-muted-foreground">Attachments</p>
                            <ul className="mt-1 space-y-1">
                              {selected.attachments.map((a) => (
                                <li key={a.name} className="flex items-center gap-2 rounded border bg-muted/30 p-2 text-xs">
                                  <FileText className="h-3.5 w-3.5" />
                                  <span className="font-medium">{a.name}</span>
                                  <span className="ml-auto text-muted-foreground">{a.size}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="border-t p-3">
                        <Label htmlFor="reply" className="sr-only">Reply</Label>
                        <Textarea
                          id="reply"
                          placeholder="Type your reply…"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={3}
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Sparkles className="mr-1 h-3.5 w-3.5" /> Template
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {messageTemplates.map((t) => (
                                <DropdownMenuItem
                                  key={t.id}
                                  onClick={() => {
                                    setReply(t.body);
                                    toast.success(`Template loaded: ${t.name}`);
                                  }}
                                >
                                  {t.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="sm" disabled={!reply.trim()} onClick={send}>
                            <Reply className="mr-1 h-3.5 w-3.5" /> Send reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Mail className="h-5 w-5" />}
                      title="Select a message"
                      description="Pick a conversation from the list to read and reply."
                    />
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SectionCard>

      <SectionCard title="Message templates" description="Reusable outreach templates. Tap to insert into your reply.">
        <div className="grid gap-3 sm:grid-cols-2">
          {messageTemplates.map((t) => (
            <div key={t.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{t.name}</p>
                <Badge variant="outline" className="text-[10px]">{t.id}</Badge>
              </div>
              <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{t.body}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 h-7 px-2 text-xs"
                onClick={() => { setReply(t.body); toast.success(`Loaded template: ${t.name}`); }}
              >
                Use template
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} onSend={onCompose} />
    </div>
  );
}

function ComposeDialog({
  open, onOpenChange, onSend,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSend: (recipient: string, subject: string, body: string) => void;
}) {
  const [recipient, setRecipient] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const reset = () => { setRecipient(""); setSubject(""); setBody(""); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose message</DialogTitle>
          <DialogDescription>Send a message to a client or candidate.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="m-to">Recipient</Label>
            <Input id="m-to" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Name or email" />
          </div>
          <div>
            <Label htmlFor="m-subject">Subject</Label>
            <Input id="m-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject" />
          </div>
          <div>
            <Label htmlFor="m-body">Message</Label>
            <Textarea id="m-body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Type your message…" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Insert template
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {messageTemplates.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => { setBody(t.body); toast.success(`Loaded template: ${t.name}`); }}
                >
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!recipient.trim() || !subject.trim() || !body.trim()}
            onClick={() => onSend(recipient, subject, body)}
          >
            <Send className="mr-1 h-4 w-4" /> Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
