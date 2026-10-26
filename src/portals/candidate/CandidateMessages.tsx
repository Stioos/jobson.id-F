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
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { messages as seedMessages } from "@/lib/mock-data";
import type { Message } from "@/lib/types";
import { timeAgo, formatDateTime } from "@/lib/format";

const CANDIDATE_NAME = "Priya Nair";

type Folder = "inbox" | "sent" | "starred";

export function CandidateMessages() {
  const [folder, setFolder] = React.useState<Folder>("inbox");
  const [messages, setMessages] = React.useState<Message[]>(seedMessages);
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [composeOpen, setComposeOpen] = React.useState(false);

  const visible = React.useMemo(() => {
    let list = messages;
    if (folder === "starred") {
      list = list.filter((m) => m.starred);
    } else {
      list = list.filter((m) => m.folder === folder);
    }
    // Priya sees inbox messages addressed to her, and sent messages she authored
    list = list.filter(
      (m) =>
        folder === "starred" ||
        (folder === "inbox" && m.recipientName === CANDIDATE_NAME) ||
        (folder === "sent" && m.senderName === CANDIDATE_NAME)
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.senderName.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q)
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [messages, folder, search]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  React.useEffect(() => {
    if (selected && !selected.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === selected.id ? { ...m, read: true } : m))
      );
    }
  }, [selected]);

  function toggleStar(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  }

  function send(values: { recipient: string; subject: string; body: string }) {
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      threadId: `th_${Date.now()}`,
      senderId: "u_002",
      senderName: CANDIDATE_NAME,
      recipientName: values.recipient,
      subject: values.subject,
      preview: values.body.slice(0, 80),
      body: values.body,
      read: true,
      starred: false,
      folder: "sent",
      attachments: [],
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    setComposeOpen(false);
    toast.success("Message sent", { description: `To: ${values.recipient}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Communicate with recruiters and employers securely."
        actions={[
          { label: "Compose", variant: "default", onClick: () => setComposeOpen(true) },
        ]}
      />

      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Folders + search */}
        <div className="space-y-3 lg:w-64 lg:shrink-0">
          <Tabs value={folder} onValueChange={(v) => setFolder(v as Folder)}>
            <TabsList className="flex w-full flex-col h-auto">
              <TabsTrigger value="inbox" className="w-full justify-start gap-2">
                <Icon name="Inbox" className="h-4 w-4" /> Inbox
              </TabsTrigger>
              <TabsTrigger value="sent" className="w-full justify-start gap-2">
                <Icon name="Send" className="h-4 w-4" /> Sent
              </TabsTrigger>
              <TabsTrigger value="starred" className="w-full justify-start gap-2">
                <Icon name="Star" className="h-4 w-4" /> Starred
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List + thread */}
        <div className="grid min-h-[60vh] flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
          {/* List */}
          <div className="space-y-2 overflow-y-auto scroll-thin">
            {visible.length === 0 ? (
              <EmptyState
                icon={<Icon name="Mail" className="h-5 w-5" />}
                title="No messages"
                description="This folder is empty."
              />
            ) : (
              visible.map((m) => (
                <div
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(m.id);
                    }
                  }}
                  className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    selectedId === m.id ? "border-brand bg-brand/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AvatarLogo text={m.senderName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`truncate text-sm ${!m.read ? "font-semibold" : ""}`}>
                          {m.senderName}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {timeAgo(m.timestamp)}
                        </span>
                      </div>
                      <p className={`truncate text-xs ${!m.read ? "font-medium" : "text-muted-foreground"}`}>
                        {m.subject}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{m.preview}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {!m.read && <span className="h-2 w-2 rounded-full bg-brand" />}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(m.id);
                        }}
                        aria-label={m.starred ? "Unstar message" : "Star message"}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon
                          name="Star"
                          className={`h-3.5 w-3.5 ${
                            m.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Thread */}
          <div className="lg:border-l lg:pl-3">
            {!selected ? (
              <EmptyState
                icon={<Icon name="Mail" className="h-5 w-5" />}
                title="Select a message"
                description="Pick a message from the list to read it here."
                className="h-full"
              />
            ) : (
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex items-start gap-3 border-b pb-3">
                    <AvatarLogo text={selected.senderName} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{selected.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        From <span className="font-medium">{selected.senderName}</span> ·{" "}
                        {formatDateTime(selected.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleStar(selected.id)}
                    >
                      <Icon
                        name="Star"
                        className={`h-4 w-4 ${
                          selected.starred ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto py-3 text-sm whitespace-pre-wrap">
                    {selected.body}
                  </div>
                  {selected.attachments.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Attachments
                      </p>
                      <div className="mt-2 space-y-1">
                        {selected.attachments.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg border p-2 text-xs"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name="FileStack" className="h-3.5 w-3.5 text-brand" />
                              {a.name}
                            </span>
                            <span className="text-muted-foreground">{a.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        toast.success("Reply window", { description: "Demo only." });
                      }}
                    >
                      <Icon name="MessagesSquare" className="h-4 w-4" /> Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleStar(selected.id)}>
                      <Icon name="Star" className="h-4 w-4" /> {selected.starred ? "Unstar" : "Star"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} onSend={send} />
    </div>
  );
}

function ComposeDialog({
  open,
  onOpenChange,
  onSend,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSend: (v: { recipient: string; subject: string; body: string }) => void;
}) {
  const [recipient, setRecipient] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setRecipient("");
      setSubject("");
      setBody("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose message</DialogTitle>
          <DialogDescription>Send a secure message to a recruiter or contact.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              placeholder="Recruiter name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subj">Subject</Label>
            <Input
              id="subj"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bod">Message</Label>
            <Textarea
              id="bod"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!recipient.trim() || !subject.trim() || !body.trim()) {
                toast.error("All fields are required");
                return;
              }
              onSend({ recipient, subject, body });
            }}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
