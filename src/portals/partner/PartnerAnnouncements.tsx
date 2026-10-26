"use client";

import * as React from "react";
import { announcements as seedAnnouncements } from "@/lib/partner-data";
import type { Announcement } from "@/lib/partner-data";
import { useNav } from "@/lib/store";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { BellRing, Plus, Search, Pin, CheckCircle2, AlertTriangle, AlertOctagon, Info, ArrowRight } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  system: "System", policy: "Policy", program: "Program", event: "Event", compliance: "Compliance", marketing: "Marketing",
};

const PRIORITY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  info: { label: "Info", icon: <Info className="h-3.5 w-3.5" />, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  warning: { label: "Warning", icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  critical: { label: "Critical", icon: <AlertOctagon className="h-3.5 w-3.5" />, color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
};

const AUDIENCE_LABEL: Record<string, string> = {
  all: "All Partners", centre: "Centre Partners", college: "College Partners", service: "Service Partners", technology: "Technology Partners", ai: "AI Partners", recruitment: "Recruitment Partners",
};

export function PartnerAnnouncements() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [items, setItems] = React.useState<Announcement[]>(seedAnnouncements);
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = items
    .filter((a) => {
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (priorityFilter !== "all" && a.priority !== priorityFilter) return false;
      if (search && !`${a.title} ${a.message}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Critical + warning first, then unread, then by date
      const pri = { critical: 0, warning: 1, info: 2 };
      if (pri[a.priority] !== pri[b.priority]) return pri[a.priority] - pri[b.priority];
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const unreadCount = items.filter((a) => !a.read).length;
  const criticalCount = items.filter((a) => a.priority === "critical").length;
  const warningCount = items.filter((a) => a.priority === "warning").length;

  function markAsRead(id: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    toast.success("Marked as read");
  }
  function markAllRead() {
    setItems((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success("All announcements marked as read");
  }
  function onCreate(form: { title: string; message: string; category: string; priority: string; audience: string }) {
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`, title: form.title, message: form.message, category: form.category as Announcement["category"], priority: form.priority as Announcement["priority"], publishedAt: new Date().toISOString(), audience: form.audience as Announcement["audience"], read: false,
    };
    setItems((prev) => [newAnn, ...prev]);
    toast.success("Announcement published", { description: `Sent to ${AUDIENCE_LABEL[form.audience]}.` });
    setCreateOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description={`${partner.name} — system, policy, program, event, and compliance announcements from JOBSONN.`}
        icon={<Icon name="BellRing" className="h-6 w-6" />}
        actions={[
          { label: "Mark all read", icon: "CheckCircle2", variant: "outline", onClick: markAllRead },
          { label: "Create", icon: "Plus", onClick: () => setCreateOpen(true) },
        ]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Announcements" value={items.length} icon={<BellRing className="h-5 w-5" />} tone="brand" />
        <StatCard label="Unread" value={unreadCount} icon={<Info className="h-5 w-5" />} tone="warning" />
        <StatCard label="Critical" value={criticalCount} icon={<AlertOctagon className="h-5 w-5" />} tone="danger" />
        <StatCard label="Warnings" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 max-h-[640px] overflow-y-auto scroll-thin pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">No announcements match your filters.</div>
          ) : filtered.map((a) => {
            const pri = PRIORITY_CONFIG[a.priority];
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-lg border p-4 transition",
                  !a.read && "border-brand/40 bg-brand/5",
                  a.priority === "critical" && "border-rose-500/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border", pri.color)}>
                    {pri.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {!a.read && <Pin className="h-3.5 w-3.5 text-brand" />}
                      <h3 className="text-sm font-semibold">{a.title}</h3>
                      <StatusBadge status={a.category} />
                      <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", pri.color)}>
                        {pri.icon} {pri.label}
                      </span>
                      {!a.read && <Badge variant="default" className="bg-brand text-white text-[10px]">New</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{a.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                      <span>📅 {formatDateTime(a.publishedAt)}</span>
                      <span>·</span>
                      <span>👥 {AUDIENCE_LABEL[a.audience]}</span>
                      <span>·</span>
                      <span>{timeAgo(a.publishedAt)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {a.actionLabel && a.actionRoute && (
                        <Button size="sm" variant="outline" onClick={() => navigate("partner", a.actionRoute!)}>
                          {a.actionLabel} <ArrowRight className="ml-1.5 h-3 w-3" />
                        </Button>
                      )}
                      {!a.read && (
                        <Button size="sm" variant="ghost" onClick={() => markAsRead(a.id)}>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <CreateAnnouncementDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={onCreate} />
    </div>
  );
}

function CreateAnnouncementDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (form: { title: string; message: string; category: string; priority: string; audience: string }) => void }) {
  const [form, setForm] = React.useState({ title: "", message: "", category: "system", priority: "info", audience: "all" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error("Please fill required fields"); return; }
    onCreate(form);
    setForm({ title: "", message: "", category: "system", priority: "info", audience: "all" });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>Publish a new announcement to selected partner audience.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Message *</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(AUDIENCE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Publish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
