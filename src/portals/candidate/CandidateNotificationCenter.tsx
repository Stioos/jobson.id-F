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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timeAgo, formatDateTime } from "@/lib/format";

// ----- Notification types -----
type NotifType = "job" | "application" | "message" | "system";

interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: string;
  actionLabel?: string;
  actionHref?: string;
}

const SEED_NOTIFS: AppNotification[] = [
  { id: "n_1", type: "job", title: "12 new jobs match your search", description: "Senior Frontend Engineer roles in Bengaluru matching your skills.", timestamp: "2024-10-26T08:30:00Z", read: false, icon: "Briefcase", actionLabel: "View jobs", actionHref: "find-jobs" },
  { id: "n_2", type: "application", title: "TechCorp India viewed your application", description: "Your application for Senior Frontend Engineer was viewed.", timestamp: "2024-10-26T07:15:00Z", read: false, icon: "Eye" },
  { id: "n_3", type: "application", title: "Interview scheduled with FinEdge", description: "Round 2 — System Design on Oct 30, 2:00 PM IST.", timestamp: "2024-10-25T16:00:00Z", read: false, icon: "Calendar" },
  { id: "n_4", type: "message", title: "New message from Rohan Mehta", description: "“Hi Priya, can we move the call to 4 PM tomorrow?”", timestamp: "2024-10-25T11:42:00Z", read: true, icon: "Mail" },
  { id: "n_5", type: "application", title: "Offer extended by FinEdge", description: "Staff Software Engineer — ₹33L base + ESOPs. Expires in 6 days.", timestamp: "2024-10-24T18:00:00Z", read: false, icon: "Gift", actionLabel: "View offer", actionHref: "offers" },
  { id: "n_6", type: "job", title: "Recommended: Frontend Architect at CloudKart", description: "94% match based on your skills and recent applications.", timestamp: "2024-10-24T09:00:00Z", read: true, icon: "Sparkles" },
  { id: "n_7", type: "system", title: "Profile completeness: 85%", description: "Add a portfolio link and 2 more skills to reach 100%.", timestamp: "2024-10-23T20:30:00Z", read: false, icon: "User" },
  { id: "n_8", type: "system", title: "Resume Boost activated", description: "Your resume is featured for the next 30 days.", timestamp: "2024-10-23T12:00:00Z", read: true, icon: "TrendingUp" },
  { id: "n_9", type: "application", title: "Brightwave Labs shortlisted you", description: "Lead UI Engineer — moving to Screening stage.", timestamp: "2024-10-22T15:20:00Z", read: true, icon: "BadgeCheck" },
  { id: "n_10", type: "message", title: "New message from Brightwave HR", description: "“Welcome to the screening stage! Please share your availability.”", timestamp: "2024-10-22T10:00:00Z", read: true, icon: "Mail" },
  { id: "n_11", type: "system", title: "Security alert: New device login", description: "Login from Chrome on Windows · Bengaluru, IN.", timestamp: "2024-10-21T19:00:00Z", read: true, icon: "ShieldCheck" },
  { id: "n_12", type: "job", title: "Saved job closing soon", description: "Senior Product Engineer at Nimbus Health — last day to apply.", timestamp: "2024-10-21T08:00:00Z", read: true, icon: "Clock" },
];

const FILTERS: { key: "all" | "unread" | NotifType; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "Inbox" },
  { key: "unread", label: "Unread", icon: "Bell" },
  { key: "job", label: "Job Updates", icon: "Briefcase" },
  { key: "application", label: "Application Updates", icon: "Eye" },
  { key: "message", label: "Messages", icon: "Mail" },
  { key: "system", label: "System", icon: "Settings" },
];

const TYPE_TONES: Record<NotifType, string> = {
  job: "bg-brand/10 text-brand",
  application: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  message: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  system: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export function CandidateNotificationCenter() {
  const [notifs, setNotifs] = React.useState<AppNotification[]>(SEED_NOTIFS);
  const [filter, setFilter] = React.useState<"all" | "unread" | NotifType>("all");

  const filtered = notifs.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function toggleRead(id: string) {
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  function markAllRead() {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  function dismiss(id: string) {
    setNotifs((p) => p.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="All your job, application, message, and system notifications in one place."
        icon={<Icon name="BellRing" className="h-6 w-6" />}
        actions={[
          {
            label: "Mark all as read",
            icon: "BadgeCheck",
            variant: "outline",
            onClick: markAllRead,
          },
        ]}
      />

      {/* Filter tabs */}
      <Card>
        <CardContent className="p-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-transparent p-0">
              {FILTERS.map((f) => {
                const count =
                  f.key === "all"
                    ? notifs.length
                    : f.key === "unread"
                    ? unreadCount
                    : notifs.filter((n) => n.type === f.key).length;
                return (
                  <TabsTrigger
                    key={f.key}
                    value={f.key}
                    className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                  >
                    <Icon name={f.icon} className="mr-1.5 h-3.5 w-3.5" />
                    {f.label}
                    <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon name="BellRing" className="h-5 w-5" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`${!n.read ? "border-brand/30 bg-brand/5" : "bg-card"}`}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                {/* Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TYPE_TONES[n.type]}`}>
                  <Icon name={n.icon} className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-brand" aria-label="Unread" />
                    )}
                    <Badge
                      variant="secondary"
                      className={`capitalize ${TYPE_TONES[n.type]}`}
                    >
                      {n.type}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground" title={formatDateTime(n.timestamp)}>
                    {timeAgo(n.timestamp)} · {formatDateTime(n.timestamp)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  {n.actionLabel && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info(`Opening: ${n.actionLabel}`)}
                    >
                      {n.actionLabel}
                    </Button>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRead(n.id)}
                      className="h-8"
                    >
                      <Icon name={n.read ? "CircleDot" : "BadgeCheck"} className="mr-1 h-3.5 w-3.5" />
                      {n.read ? "Unread" : "Read"}
                    </Button>
                    {!n.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markRead(n.id)}
                        className="h-8"
                      >
                        Mark read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismiss(n.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      aria-label="Dismiss"
                    >
                      <Icon name="X" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <SectionCard title="Stay on top of your notifications" description="Manage how and when you receive alerts.">
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {[
            "Unread notifications are highlighted with the emerald brand color.",
            "Use the filter tabs to focus on one category at a time.",
            "Mark all as read in one click from the header button.",
            "Configure email and push preferences in Settings → Notifications.",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon name="Lightbulb" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {t}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
