"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateTime, formatDate } from "@/lib/format";

type EventType = "Webinar" | "Career Fair" | "Workshop" | "AMA";
interface EventItem {
  id: string; title: string; type: EventType; date: string; time: string;
  host: string; registered: number; capacity: number;
  status: "upcoming" | "past"; registered_by_me?: boolean;
  recordingUrl?: string; attended?: boolean;
}

const SEED_EVENTS: EventItem[] = [
  { id: "e1", title: "Cracking FAANG Frontend Interviews", type: "Webinar", date: "2025-01-25", time: "18:00", host: "Kunal Kushwaha", registered: 482, capacity: 500, status: "upcoming", registered_by_me: true },
  { id: "e2", title: "Bangalore Tech Hiring Fair 2025", type: "Career Fair", date: "2025-02-08", time: "10:00", host: "JOBSONN Events", registered: 1240, capacity: 2000, status: "upcoming", registered_by_me: false },
  { id: "e3", title: "System Design Bootcamp (Hands-On)", type: "Workshop", date: "2025-01-30", time: "16:00", host: "Alex Xu", registered: 318, capacity: 350, status: "upcoming", registered_by_me: true },
  { id: "e4", title: "Ask Me Anything: Engineering at Razorpay", type: "AMA", date: "2025-02-12", time: "17:30", host: "VP Engineering, Razorpay", registered: 256, capacity: 400, status: "upcoming", registered_by_me: false },
  { id: "e5", title: "Resume Makeover Live", type: "Workshop", date: "2024-12-15", time: "15:00", host: "Gayle McDowell", registered: 612, capacity: 700, status: "past", recordingUrl: "resume-makeover.mp4", attended: true },
  { id: "e6", title: "DevOps Career Pathways", type: "Webinar", date: "2024-11-28", time: "18:00", host: "Tech With Nikhil", registered: 845, capacity: 1000, status: "past", recordingUrl: "devops-careers.mp4", attended: false },
  { id: "e7", title: "Mumbai Startup Hiring Drive", type: "Career Fair", date: "2024-11-10", time: "11:00", host: "JOBSONN Events", registered: 980, capacity: 1500, status: "past", attended: true },
  { id: "e8", title: "Behavioral Interviews AMA", type: "AMA", date: "2024-10-22", time: "17:00", host: " Recruiter Panel", registered: 432, capacity: 500, status: "past", recordingUrl: "behavioral-ama.mp4", attended: true },
];

const TYPE_TONE: Record<EventType, string> = {
  Webinar: "bg-brand/10 text-brand border-brand/20",
  "Career Fair": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Workshop: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  AMA: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

export function CandidateEventsCalendar() {
  const [events, setEvents] = React.useState<EventItem[]>(SEED_EVENTS);
  const [filter, setFilter] = React.useState<string>("all");
  const [view, setView] = React.useState<"list" | "calendar">("list");

  const upcoming = events.filter((e) => e.status === "upcoming" && (filter === "all" || e.type === filter));
  const past = events.filter((e) => e.status === "past");
  const myRegs = events.filter((e) => e.registered_by_me);

  const register = (id: string) => {
    setEvents((es) => es.map((e) => e.id === id ? { ...e, registered_by_me: true, registered: e.registered + 1 } : e));
    toast.success("Registered! We'll send you a reminder.");
  };
  const watchRecording = (e: EventItem) => toast.info(`Loading recording: ${e.recordingUrl}`);

  // Simple calendar: January 2025 mock grid
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const eventsByDay: Record<number, EventItem[]> = {};
  upcoming.forEach((e) => {
    const day = new Date(e.date).getDate();
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(e);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events & Webinars"
        description="Discover career events, register, and access past recordings."
        icon={<Icon name="CalendarDays" className="h-6 w-6" />}
        actions={[
          { label: view === "list" ? "Calendar View" : "List View", variant: "outline", onClick: () => setView(view === "list" ? "calendar" : "list") },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming Events" value={upcoming.length} icon={<Icon name="CalendarDays" className="h-5 w-5" />} tone="brand" />
        <StatCard label="My Registrations" value={myRegs.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Past Events Attended" value={past.filter((e) => e.attended).length} icon={<Icon name="History" className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Webinar">Webinars</SelectItem>
            <SelectItem value="Career Fair">Career Fairs</SelectItem>
            <SelectItem value="Workshop">Workshops</SelectItem>
            <SelectItem value="AMA">AMAs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === "calendar" ? (
        <SectionCard title="January 2025" description="Click a day to see events">
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center font-medium text-muted-foreground p-1">{d}</div>
            ))}
            {monthDays.map((d) => (
              <div key={d} className="min-h-16 rounded border p-1 text-left">
                <span className="text-[10px] text-muted-foreground">{d}</span>
                {(eventsByDay[d] || []).map((e) => (
                  <div key={e.id} className={`mt-1 truncate rounded px-1 py-0.5 text-[9px] ${TYPE_TONE[e.type]}`}>
                    {e.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <>
          <SectionCard title="Upcoming Events" description={`${upcoming.length} events match your filter`}>
            {upcoming.length === 0 ? (
              <EmptyState icon={<Icon name="CalendarDays" className="h-5 w-5" />} title="No events found" description="Try a different filter." />
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto scroll-thin">
                {upcoming.map((e) => (
                  <div key={e.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{e.title}</p>
                        <Badge className={TYPE_TONE[e.type]}>{e.type}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <Icon name="Calendar" className="mr-1 inline h-3 w-3" />
                        {formatDate(e.date)} at {e.time} · Hosted by {e.host}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {e.registered} / {e.capacity} registered
                      </p>
                      <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${(e.registered / e.capacity) * 100}%` }} />
                      </div>
                    </div>
                    {e.registered_by_me ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Registered</Badge>
                    ) : (
                      <Button onClick={() => register(e.id)} size="sm" className="bg-brand text-white hover:bg-brand/90">Register</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="My Registrations">
              {myRegs.length === 0 ? (
                <EmptyState icon={<Icon name="CalendarCheck" className="h-5 w-5" />} title="No registrations" />
              ) : (
                <div className="space-y-2">
                  {myRegs.map((e) => (
                    <div key={e.id} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(e.date)} at {e.time} · {e.host}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Past Events" description="Watch recordings">
              {past.length === 0 ? (
                <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No past events" />
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
                  {past.map((e) => (
                    <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(e.date)} · {e.attended ? "Attended" : "Did not attend"}</p>
                      </div>
                      {e.recordingUrl ? (
                        <Button variant="outline" size="sm" onClick={() => watchRecording(e)}>
                          <Icon name="Video" className="mr-1 h-3 w-3" /> Watch
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px]">No recording</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
