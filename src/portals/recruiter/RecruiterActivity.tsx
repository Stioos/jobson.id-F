"use client";

import * as React from "react";
import {
  Plus, Phone, Mail, Calendar, Send, FileText, Trophy, StickyNote,
  ListChecks, Download, Search, User, Building2, Filter,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";
import { activityLogs } from "@/lib/partner-data";
import type { ActivityLog } from "@/lib/partner-data";

const TYPE_META: Record<ActivityLog["type"], { icon: React.ReactNode; tone: string; label: string }> = {
  call: { icon: <Phone className="h-4 w-4" />, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-300", label: "Call" },
  email: { icon: <Mail className="h-4 w-4" />, tone: "bg-teal-500/10 text-teal-600 dark:text-teal-300", label: "Email" },
  meeting: { icon: <Calendar className="h-4 w-4" />, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-300", label: "Meeting" },
  submission: { icon: <Send className="h-4 w-4" />, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", label: "Submission" },
  interview: { icon: <FileText className="h-4 w-4" />, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-300", label: "Interview" },
  offer: { icon: <FileText className="h-4 w-4" />, tone: "bg-teal-500/10 text-teal-600 dark:text-teal-300", label: "Offer" },
  placement: { icon: <Trophy className="h-4 w-4" />, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", label: "Placement" },
  note: { icon: <StickyNote className="h-4 w-4" />, tone: "bg-slate-500/10 text-slate-600 dark:text-slate-300", label: "Note" },
  task: { icon: <ListChecks className="h-4 w-4" />, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-300", label: "Task" },
};

export function RecruiterActivity() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [rangeFilter, setRangeFilter] = React.useState("7d");
  const [logOpen, setLogOpen] = React.useState(false);
  const [items, setItems] = React.useState<ActivityLog[]>(activityLogs);

  const [form, setForm] = React.useState({
    type: "call" as ActivityLog["type"],
    description: "",
    candidateName: "",
    clientName: "",
    outcome: "",
  });

  const filtered = items.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.description.toLowerCase().includes(q) && !(a.candidateName || "").toLowerCase().includes(q) && !(a.clientName || "").toLowerCase().includes(q) && !a.performedBy.toLowerCase().includes(q)) return false;
    }
    if (rangeFilter !== "all") {
      const days = rangeFilter === "24h" ? 1 : rangeFilter === "7d" ? 7 : 30;
      const cutoff = Date.now() - days * 86400000;
      if (new Date(a.timestamp).getTime() < cutoff) return false;
    }
    return true;
  });

  // Stats
  const now = Date.now();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const callsToday = items.filter((a) => a.type === "call" && new Date(a.timestamp).getTime() >= todayStart.getTime()).length;
  const emailsToday = items.filter((a) => a.type === "email" && new Date(a.timestamp).getTime() >= todayStart.getTime()).length;
  const meetingsWeek = items.filter((a) => a.type === "meeting" && new Date(a.timestamp).getTime() >= weekStart.getTime()).length;
  const placementsWeek = items.filter((a) => a.type === "placement" && new Date(a.timestamp).getTime() >= weekStart.getTime()).length;

  // Group by day
  const grouped = React.useMemo(() => {
    const groups: Record<string, ActivityLog[]> = {};
    filtered.forEach((a) => {
      const d = new Date(a.timestamp);
      const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filtered]);

  function handleLogActivity() {
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      type: form.type,
      description: form.description,
      candidateName: form.candidateName || undefined,
      clientName: form.clientName || undefined,
      performedBy: "Karthik Subramanian",
      timestamp: new Date().toISOString(),
      outcome: form.outcome || undefined,
    };
    setItems([newLog, ...items]);
    toast.success("Activity logged", { description: `${TYPE_META[form.type].label}: ${form.description.slice(0, 60)}` });
    setLogOpen(false);
    setForm({ type: "call", description: "", candidateName: "", clientName: "", outcome: "" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity & communications"
        description="Every call, email, meeting, submission and milestone — in one chronological feed."
        actions={[
          { label: "Log activity", onClick: () => setLogOpen(true) },
          { label: "Export", variant: "outline", onClick: () => toast.success("Activity log exported", { description: `${filtered.length} entries • CSV` }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Calls today" value={callsToday} icon={<Phone className="h-5 w-5" />} tone="brand" />
        <StatCard label="Emails today" value={emailsToday} icon={<Mail className="h-5 w-5" />} tone="success" />
        <StatCard label="Meetings this week" value={meetingsWeek} icon={<Calendar className="h-5 w-5" />} tone="warning" />
        <StatCard label="Placements this week" value={placementsWeek} icon={<Trophy className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard
        title="Activity timeline"
        description="Filter, search and review every interaction. All entries are immutable audit records."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-44 pl-8 sm:w-56"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="email">Emails</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="submission">Submissions</SelectItem>
                <SelectItem value="interview">Interviews</SelectItem>
                <SelectItem value="offer">Offers</SelectItem>
                <SelectItem value="placement">Placements</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Filter className="h-5 w-5" />}
            title="No activity matches"
            description="Adjust filters or log a new activity."
            action={<Button size="sm" onClick={() => setLogOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Log activity</Button>}
          />
        ) : (
          <div className="max-h-[40rem] overflow-y-auto scroll-thin space-y-5">
            {grouped.map(([day, entries]) => (
              <div key={day}>
                <div className="sticky top-0 bg-background/95 backdrop-blur py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide z-10">
                  {day} • {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </div>
                <div className="space-y-2 mt-2">
                  {entries.map((a) => {
                    const meta = TYPE_META[a.type];
                    return (
                      <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>{meta.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{meta.label}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{timeAgo(a.timestamp)}</span>
                            {a.outcome && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <Badge variant="outline" className="text-xs">{a.outcome}</Badge>
                              </>
                            )}
                          </div>
                          <div className="text-sm font-medium mt-1">{a.description}</div>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            {a.candidateName && (
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3 w-3" />{a.candidateName}
                              </span>
                            )}
                            {a.clientName && (
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-3 w-3" />{a.clientName}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <AvatarLogo text={a.performedBy} size="xs" />{a.performedBy}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                          {formatDateTime(a.timestamp)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Log activity dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log activity</DialogTitle>
            <DialogDescription>Record a call, email, meeting or note. Logged entries are immutable.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ac-type">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ActivityLog["type"] })}>
                  <SelectTrigger id="ac-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_META).map(([k, m]) => (
                      <SelectItem key={k} value={k}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ac-outcome">Outcome</Label>
                <Input id="ac-outcome" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} placeholder="e.g. Confirmed / Pending" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ac-desc">Description *</Label>
              <Textarea id="ac-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What happened?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ac-cand">Candidate (optional)</Label>
                <Input id="ac-cand" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} placeholder="e.g. Priya Nair" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ac-client">Client (optional)</Label>
                <Input id="ac-client" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. TechCorp India" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button onClick={handleLogActivity}>Log activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
