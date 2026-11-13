"use client";

import { useState } from "react";
import { Bell, MessageSquare, ShieldCheck, Sparkles, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "inquiry" | "security" | "system" | "taxonomy";
  read: boolean;
}

export function NotificationsScreen() {
  const [filter, setFilter] = useState<"all" | "inquiry" | "security" | "system">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "New RFQ Inquiry from Precision Aerospace Ltd",
      desc: "Buyer requested a custom quote for CNC Turning & AI Integration services (500 units).",
      time: "10 mins ago",
      type: "inquiry",
      read: false,
    },
    {
      id: "notif-2",
      title: "GSTN Registration Verification Confirmed",
      desc: "Your company GSTIN 29ABCDE1234F1Z5 was successfully validated with the national portal.",
      time: "2 hours ago",
      type: "security",
      read: false,
    },
    {
      id: "notif-3",
      title: "New Login from Windows PC",
      desc: "Authorized session established from IP 103.21.244.12 in Bengaluru.",
      time: "Today, 01:15 PM",
      type: "security",
      read: true,
    },
    {
      id: "notif-4",
      title: "Taxonomy Update: Technology & AI Sector",
      desc: "3 new subcategories added to Enterprise Software. Your catalog was auto-indexed.",
      time: "Yesterday",
      type: "taxonomy",
      read: true,
    },
    {
      id: "notif-5",
      title: "Weekly Directory Impression Report",
      desc: "Your business profile was displayed in 1,248 buyer search queries this week (+24%).",
      time: "2 days ago",
      type: "system",
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info("Notification center cleared.");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header — screen title & description now render in the dashboard header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <CheckCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> Mark All Read
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-4 dark:border-white/10">
        {[
          { id: "all", label: "All Alerts" },
          { id: "inquiry", label: "Buyer RFQs & Leads" },
          { id: "security", label: "Security & Login" },
          { id: "system", label: "System Reports" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id as any)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === t.id
                ? "bg-emerald-500 text-slate-950 font-bold shadow-soft"
                : "border border-border bg-background/80 text-muted-foreground hover:border-border/80 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/60 p-12 text-center dark:border-white/10 dark:bg-slate-900/40">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground dark:text-slate-600" />
            <p className="mt-3 text-sm font-bold text-foreground dark:text-white">No notifications in this category</p>
            <p className="text-xs text-muted-foreground dark:text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                  !item.read
                    ? "border-emerald-500/40 bg-emerald-500/[0.06] shadow-soft"
                    : "border-border/80 bg-card/80 shadow-soft dark:border-white/5 dark:bg-slate-900/60 dark:shadow-none"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    item.type === "inquiry"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : item.type === "security"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.type === "inquiry" ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : item.type === "security" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${!item.read ? "text-foreground dark:text-white" : "text-muted-foreground dark:text-slate-300"}`}>
                      {item.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground shrink-0 dark:text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>

                {!item.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 mt-2" title="Unread" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
