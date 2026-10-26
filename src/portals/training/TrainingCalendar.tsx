"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { liveSessions, cohorts, trainers } from "@/lib/lms-data";
import type { LiveSession } from "@/lib/types";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";
import { TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Video, MapPin, Plus } from "lucide-react";

const TRAINER_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

export function TrainingCalendar() {
  const { navigate } = useNav();
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [detail, setDetail] = React.useState<LiveSession | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + weekOffset * 7); // Sunday

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const HOURS = Array.from({ length: 12 }).map((_, i) => i + 8); // 8 AM to 7 PM

  function getSessionsForDay(day: Date): LiveSession[] {
    return liveSessions.filter((s) => {
      const sd = new Date(s.date);
      return sd.toDateString() === day.toDateString();
    });
  }

  function getSessionHour(s: LiveSession): number {
    const h = parseInt(s.startTime.split(":")[0], 10);
    return h;
  }

  function trainerColor(name: string): string {
    const idx = trainers.findIndex((t) => t.name === name);
    return TRAINER_COLORS[(idx >= 0 ? idx : 0) % TRAINER_COLORS.length];
  }

  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training Calendar"
        description="Week view of live sessions and cohort schedules."
        icon={<Icon name="Calendar" className="h-6 w-6" />}
        actions={[
          { label: "Schedule session", icon: "Plus", onClick: () => navigate("training", "live-training") },
        ]}
      />
      <TenantDisclaimer />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Today</Button>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <h3 className="text-sm font-medium">
          {formatDate(weekDays[0].toISOString(), { day: "numeric", month: "short" })} — {formatDate(weekDays[6].toISOString(), { day: "numeric", month: "short", year: "numeric" })}
        </h3>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-xs font-medium text-muted-foreground border-r">Time</div>
          {weekDays.map((d) => (
            <div key={d.toISOString()} className={`p-2 text-center border-r last:border-r-0 ${isToday(d) ? "bg-brand/10" : ""}`}>
              <p className="text-xs font-medium uppercase text-muted-foreground">{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
              <p className={`text-sm font-bold ${isToday(d) ? "text-brand" : ""}`}>{d.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="max-h-[600px] overflow-y-auto scroll-thin">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[60px]">
              <div className="p-2 text-xs text-muted-foreground border-r">{hour}:00</div>
              {weekDays.map((d) => {
                const sessions = getSessionsForDay(d).filter((s) => getSessionHour(s) === hour);
                return (
                  <div key={`${d.toISOString()}-${hour}`} className="border-r last:border-r-0 p-1 space-y-1">
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setDetail(s)}
                        className="w-full text-left rounded-md p-1.5 text-xs hover:shadow-md transition-shadow"
                        style={{ background: `${trainerColor(s.trainerName)}20`, borderLeft: `3px solid ${trainerColor(s.trainerName)}` }}
                      >
                        <p className="font-medium truncate">{s.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{s.startTime} · {s.trainerName}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground">Trainers:</span>
        {trainers.slice(0, 5).map((t, i) => (
          <span key={t.id} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: TRAINER_COLORS[i] }} />
            {t.name}
          </span>
        ))}
      </div>

      {/* Today's sessions */}
      <SectionCard title="Today's Sessions" description={`${getSessionsForDay(today).length} sessions`}>
        {getSessionsForDay(today).length === 0 ? (
          <EmptyState icon={<Video className="h-5 w-5" />} title="No sessions today" description="Enjoy the breathing room." />
        ) : (
          <ul className="space-y-2">
            {getSessionsForDay(today).map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="h-10 w-1 rounded-full" style={{ background: trainerColor(s.trainerName) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.startTime} · {durationLabel(s.durationMinutes)} · {s.trainerName}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>{detail?.trainerName}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(detail.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">{detail.startTime} ({durationLabel(detail.durationMinutes)})</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="font-medium capitalize">{detail.platform}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">{detail.registered}/{detail.capacity}</p>
                </div>
              </div>
              {detail.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{detail.location}</span>
                </div>
              )}
              <div className="flex gap-2">
                {detail.meetingLink && <Button className="flex-1" onClick={() => toast.info(`Joining: ${detail.title}`)}>Join meeting</Button>}
                <Button variant="outline" className="flex-1" onClick={() => { setDetail(null); navigate("training", "live-training"); }}>Go to live sessions</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
