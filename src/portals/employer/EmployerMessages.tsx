"use client";

import * as React from "react";
import { allApplications } from "@/lib/mock-data";
import { PageHeader, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { Send, Search, Star, Paperclip, FileText, Reply, Mail, Plus } from "lucide-react";

interface Thread {
  id: string;
  candidateName: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
}

const TEMPLATES = [
  { id: "t1", label: "Interview invitation", body: "Hi {name},\n\nWe'd like to invite you to an interview for {role}. Please share your availability for next week.\n\nBest,\nRohan" },
  { id: "t2", label: "Status update", body: "Hi {name},\n\nThanks for your patience. We're still reviewing applications and will get back to you within 3-5 business days.\n\nRegards,\nTechCorp Recruiting" },
  { id: "t3", label: "Offer follow-up", body: "Hi {name},\n\nJust checking in on the offer we sent. Please let us know if you have any questions or need more time.\n\nBest,\nRohan" },
  { id: "t4", label: "Rejection", body: "Hi {name},\n\nThank you for taking the time to interview with us. Unfortunately, we've decided to move forward with another candidate. We'd love to stay in touch.\n\nRegards,\nTechCorp" },
];

const THREADS: Thread[] = allApplications
  .slice(0, 6)
  .map((a, i) => ({
    id: `th_${a.id}`,
    candidateName: a.candidateName,
    subject: `Re: ${a.jobTitle}`,
    lastMessage: i === 0 ? "Confirmed for Thursday 2:00 PM. Looking forward to it!" : "Thanks for the update. Looking forward to next steps.",
    timestamp: a.updatedAt,
    unread: i % 3 === 0,
    starred: i === 0,
  }));

export function EmployerMessages() {
  const [threads] = React.useState<Thread[]>(THREADS);
  const [activeId, setActiveId] = React.useState<string>(THREADS[0]?.id ?? "");
  const [search, setSearch] = React.useState("");
  const [draft, setDraft] = React.useState("");

  const active = threads.find((t) => t.id === activeId);

  const filtered = threads.filter((t) => t.candidateName.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()));

  const send = () => {
    if (!draft.trim()) return;
    toast.success("Message sent");
    setDraft("");
  };

  const applyTemplate = (body: string) => {
    const filled = body.replace(/{name}/g, active?.candidateName ?? "candidate").replace(/{role}/g, "the role");
    setDraft(filled);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Communicate with candidates directly"
        actions={[{ label: "Compose", icon: "Plus", variant: "outline", onClick: () => toast.info("Compose new message") }]}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] h-[calc(100vh-260px)] min-h-[500px]">
        {/* Thread list */}
        <Card className="flex flex-col">
          <CardContent className="p-3 flex-1 flex flex-col gap-3 min-h-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
            </div>
            <ScrollArea className="flex-1 -mx-1 px-1">
              <div className="space-y-1">
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={`w-full text-left rounded-lg p-2 transition-colors ${activeId === t.id ? "bg-brand/10 border border-brand/30" : "hover:bg-muted/50 border border-transparent"}`}
                  >
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={t.candidateName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium truncate">{t.candidateName}</p>
                          {t.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                          {t.unread && <span className="ml-auto h-2 w-2 rounded-full bg-brand" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{t.lastMessage}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(t.timestamp)}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Thread view */}
        <Card className="flex flex-col">
          {active ? (
            <>
              <CardContent className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={active.candidateName} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{active.candidateName}</p>
                    <p className="text-xs text-muted-foreground">{active.subject}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Star className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Reply className="h-4 w-4" /></Button>
                </div>
              </CardContent>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  <MessageBubble author={active.candidateName} body={active.lastMessage} timestamp={active.timestamp} incoming />
                  <MessageBubble author="You" body="Great — looking forward to it. The meeting link will be shared 15 minutes before." timestamp={active.timestamp} />
                  <MessageBubble author={active.candidateName} body="Perfect, see you then!" timestamp={active.timestamp} incoming />
                </div>
              </ScrollArea>

              <CardContent className="p-3 border-t space-y-2">
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost"><FileText className="mr-1 h-3 w-3" /> Templates</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {TEMPLATES.map((t) => (
                        <DropdownMenuItem key={t.id} onClick={() => applyTemplate(t.body)}>{t.label}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="ghost" onClick={() => toast.info("Attach file")}><Paperclip className="h-3 w-3" /></Button>
                  <Badge variant="outline" className="ml-auto text-xs">{active.candidateName}</Badge>
                </div>
                <div className="flex gap-2">
                  <Textarea rows={2} placeholder="Type a message…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }} />
                  <Button size="icon" onClick={send} className="self-end"><Send className="h-4 w-4" /></Button>
                </div>
                <p className="text-[10px] text-muted-foreground">⌘+Enter to send</p>
              </CardContent>
            </>
          ) : (
            <EmptyState icon={<Mail className="h-5 w-5" />} title="Select a conversation" description="Choose a thread from the left to view messages." />
          )}
        </Card>
      </div>
    </div>
  );
}

function MessageBubble({ author, body, timestamp, incoming }: { author: string; body: string; timestamp: string; incoming?: boolean }) {
  return (
    <div className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[75%] rounded-lg p-2.5 ${incoming ? "bg-muted" : "bg-brand text-primary-foreground"}`}>
        <p className="text-xs font-medium mb-0.5">{author}</p>
        <p className="text-sm">{body}</p>
        <p className={`text-[10px] mt-1 ${incoming ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{timeAgo(timestamp)}</p>
      </div>
    </div>
  );
}
