"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Portal = "Candidate" | "Employer" | "Recruiter" | "Partner" | "Training";
type EType = "Interview" | "Live Training" | "Event" | "Drive" | "Webinar" | "Meeting" | "Deadline";
type EStatus = "Scheduled" | "Completed" | "Cancelled";

interface Ev {
  id: string;
  title: string;
  type: EType;
  portal: Portal;
  crossPortal: boolean;
  participants: number;
  day: number; // day of month
  time: string;
  status: EStatus;
  isToday?: boolean;
  isDeadline?: boolean;
}

const EVENTS: Ev[] = [
  { id: "E-01", title: "Frontend Dev — Technical Interview", type: "Interview", portal: "Employer", crossPortal: true, participants: 3, day: 14, time: "10:00 AM", status: "Scheduled" },
  { id: "E-02", title: "React Bootcamp — Live Session 4", type: "Live Training", portal: "Training", crossPortal: true, participants: 24, day: 14, time: "11:30 AM", status: "Scheduled", isToday: true },
  { id: "E-03", title: "Campus Drive — VIT Chennai", type: "Drive", portal: "Partner", crossPortal: true, participants: 480, day: 14, time: "09:00 AM", status: "Scheduled", isToday: true },
  { id: "E-04", title: "Recruiter sync — Q1 plan", type: "Meeting", portal: "Recruiter", crossPortal: true, participants: 6, day: 14, time: "04:00 PM", status: "Scheduled", isToday: true },
  { id: "E-05", title: "Webinar: AI in Hiring 2025", type: "Webinar", portal: "Training", crossPortal: true, participants: 1200, day: 15, time: "06:00 PM", status: "Scheduled" },
  { id: "E-06", title: "Offer Acceptance Deadline — Rahul", type: "Deadline", portal: "Employer", crossPortal: true, participants: 1, day: 15, time: "11:59 PM", status: "Scheduled", isDeadline: true },
  { id: "E-07", title: "Java Backend Walk-in — Bangalore", type: "Drive", portal: "Employer", crossPortal: false, participants: 60, day: 16, time: "10:00 AM", status: "Scheduled" },
  { id: "E-08", title: "TCS BGV Completion Deadline", type: "Deadline", portal: "Employer", crossPortal: true, participants: 12, day: 17, time: "06:00 PM", status: "Scheduled", isDeadline: true },
  { id: "E-09", title: "Mock Interview — Karthik", type: "Interview", portal: "Recruiter", crossPortal: true, participants: 2, day: 18, time: "03:00 PM", status: "Scheduled" },
  { id: "E-10", title: "Partner Onboarding Call — BITS", type: "Meeting", portal: "Partner", crossPortal: true, participants: 4, day: 19, time: "11:00 AM", status: "Scheduled" },
  { id: "E-11", title: "Spring Boot Batch — Day 1", type: "Live Training", portal: "Training", crossPortal: true, participants: 25, day: 20, time: "09:30 AM", status: "Scheduled" },
  { id: "E-12", title: "Hackathon — InnovateX 2025", type: "Event", portal: "Partner", crossPortal: true, participants: 320, day: 21, time: "08:00 AM", status: "Scheduled" },
  { id: "E-13", title: "Candidate Assessment Window closes", type: "Deadline", portal: "Candidate", crossPortal: false, participants: 80, day: 13, time: "11:59 PM", status: "Completed", isDeadline: true },
  { id: "E-14", title: "Webinar: Resume Building 101", type: "Webinar", portal: "Training", crossPortal: false, participants: 540, day: 12, time: "05:00 PM", status: "Completed" },
  { id: "E-15", title: "Onsite Interview — Swiggy intern", type: "Interview", portal: "Employer", crossPortal: true, participants: 2, day: 11, time: "02:00 PM", status: "Cancelled" },
];

const TYPE_TONE: Record<EType, string> = {
  Interview: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Live Training": "bg-violet-500/10 text-violet-700 border-violet-500/30",
  Event: "bg-teal-500/10 text-teal-700 border-teal-500/30",
  Drive: "bg-rose-500/10 text-rose-700 border-rose-500/30",
  Webinar: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
  Meeting: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Deadline: "bg-orange-500/10 text-orange-700 border-orange-500/30",
};

const PORTAL_DOT: Record<Portal, string> = {
  Candidate: "bg-emerald-500",
  Employer: "bg-teal-500",
  Recruiter: "bg-amber-500",
  Partner: "bg-rose-500",
  Training: "bg-violet-500",
};

const STATUS_TONE: Record<EStatus, string> = {
  Scheduled: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Completed: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  Cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/30",
};

export function SuperAdminUnifiedCalendar() {
  const [portalFilter, setPortalFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");

  const filtered = EVENTS.filter(e => {
    if (portalFilter !== "all" && e.portal !== portalFilter) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    return true;
  });

  const today = 14;
  const todays = EVENTS.filter(e => e.day === today && e.status === "Scheduled");
  const weekEvents = EVENTS.filter(e => e.day >= today && e.day <= today + 6);
  const byType = new Set(EVENTS.map(e => e.type)).size;
  const byPortal = new Set(EVENTS.map(e => e.portal)).size;

  // Build month grid (28 days for mock starting Sunday)
  const daysInMonth = 31;
  const startDay = 3; // Wed as start (mock)
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // conflicts: same portal, same day, overlapping-ish (mock — same day, same type)
  const conflicts: { day: number; items: Ev[] }[] = [];
  for (let d = today; d <= today + 6; d++) {
    const items = EVENTS.filter(e => e.day === d && e.status === "Scheduled");
    if (items.length >= 3) conflicts.push({ day: d, items });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Calendar"
        description="A single calendar across all 5 portals — interviews, live trainings, drives, webinars, meetings and deadlines, with cross-portal events highlighted and scheduling conflicts detected."
        icon={<Icon name="Calendar" className="h-6 w-6" />}
        actions={[
          { label: "Today", variant: "outline", onClick: () => toast.info(`Jumping to today (${todays.length} events)`) },
          { label: "Sync all", variant: "default", onClick: () => toast.success("Cross-portal calendars synced") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Today's Events" value={todays.length} icon={<Icon name="CalendarCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="This Week" value={weekEvents.length} icon={<Icon name="CalendarDays" className="h-5 w-5" />} tone="success" />
        <StatCard label="By Type" value={byType} icon={<Icon name="Tags" className="h-5 w-5" />} />
        <StatCard label="By Portal" value={byPortal} icon={<Icon name="Building2" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="January 2025" description="Cross-portal events — dots colored by portal" className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="py-1 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="aspect-square rounded-md bg-muted/30" />;
              const dayEvents = EVENTS.filter(e => e.day === d);
              const isToday = d === today;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md border p-1 text-left ${isToday ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"}`}
                >
                  <div className={`text-[10px] font-medium ${isToday ? "text-emerald-700" : "text-muted-foreground"}`}>{d}</div>
                  <div className="mt-0.5 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 4).map((e, j) => (
                      <span key={j} className={`h-1.5 w-1.5 rounded-full ${PORTAL_DOT[e.portal]}`} title={e.title} />
                    ))}
                    {dayEvents.length > 4 && <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 4}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3 text-[10px]">
            <span className="font-medium text-muted-foreground">Portals:</span>
            {(Object.keys(PORTAL_DOT) as Portal[]).map(p => (
              <span key={p} className="inline-flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${PORTAL_DOT[p]}`} />{p}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Deadlines" description="Critical due dates across portals">
          {EVENTS.filter(e => e.isDeadline && e.status === "Scheduled").length === 0 ? (
            <EmptyState icon={<Icon name="CalendarCheck" className="h-5 w-5" />} title="No deadlines" />
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {EVENTS.filter(e => e.isDeadline && e.status === "Scheduled").map(e => (
                <div key={e.id} className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{e.id}</span>
                    <Badge variant="outline" className={`text-[10px] ${TYPE_TONE[e.type]}`}>{e.type}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-medium">{e.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Jan {e.day} · {e.time} · {e.portal}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="All Events"
        description="Filter by portal or type — cross-portal events are highlighted"
        contentClassName="p-0"
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={portalFilter} onValueChange={setPortalFilter}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Portal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All portals</SelectItem>
                <SelectItem value="Candidate">Candidate</SelectItem>
                <SelectItem value="Employer">Employer</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Array.from(new Set(EVENTS.map(e => e.type))).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Calendar" className="h-5 w-5" />} title="No events match filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id} className={e.crossPortal ? "bg-emerald-500/5" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {e.crossPortal && <Icon name="ArrowRightLeft" className="h-3 w-3 text-emerald-600" />}
                      <div>
                        <p className="text-xs font-medium">{e.title}</p>
                        <span className="font-mono text-[10px] text-muted-foreground">{e.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONE[e.type]}`}>{e.type}</Badge></TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <span className={`h-2 w-2 rounded-full ${PORTAL_DOT[e.portal]}`} />{e.portal}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs">{e.participants.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">Jan {e.day} · {e.time}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONE[e.status]}`}>{e.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Scheduling Conflict Detection" description="Days with 3+ events that may overlap">
        {conflicts.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No conflicts detected" description="No scheduling conflicts in the next 7 days." />
        ) : (
          <div className="space-y-2">
            {conflicts.map(c => (
              <div key={c.day} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-center gap-2">
                  <Icon name="AlertCircle" className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Jan {c.day} — {c.items.length} overlapping events</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.items.map(e => (
                    <span key={e.id} className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-0.5 text-[10px]">
                      <span className={`h-1.5 w-1.5 rounded-full ${PORTAL_DOT[e.portal]}`} />
                      {e.time} · {e.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
