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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateTime, timeAgo } from "@/lib/format";

interface Calendar {
  id: string; name: string; email: string; connected: boolean;
  lastSync?: string; eventsSynced?: number;
}

interface SyncedEvent {
  id: string; title: string; type: "interview" | "meeting" | "block"; time: string;
  participants: string; conflicts: boolean;
}

interface SyncLogEntry { id: string; at: string; status: "success" | "failed"; detail: string; }

const SEED_CALENDARS: Calendar[] = [
  { id: "c1", name: "Google Calendar", email: "karan.m@jobsonn.com", connected: true, lastSync: "2025-01-17T09:30:00", eventsSynced: 42 },
  { id: "c2", name: "Outlook Calendar", email: "", connected: false },
  { id: "c3", name: "Apple Calendar", email: "", connected: false },
];

const SEED_EVENTS: SyncedEvent[] = [
  { id: "s1", title: "Interview: Aarav S. (Backend)", type: "interview", time: "2025-01-18T10:30:00", participants: "3 attendees", conflicts: false },
  { id: "s2", title: "Sprint Planning", type: "meeting", time: "2025-01-18T15:00:00", participants: "Team", conflicts: false },
  { id: "s3", title: "Interview: Diya P. (Design)", type: "interview", time: "2025-01-19T11:00:00", participants: "4 attendees", conflicts: true },
  { id: "s4", title: "Focus Block — Resume Reviews", type: "block", time: "2025-01-19T14:00:00", participants: "Just you", conflicts: false },
];

const SEED_LOG: SyncLogEntry[] = [
  { id: "l1", at: "2025-01-17T09:30:00", status: "success", detail: "Synced 42 events from Google Calendar" },
  { id: "l2", at: "2025-01-17T08:00:00", status: "success", detail: "Auto-blocked 3 interview slots" },
  { id: "l3", at: "2025-01-16T17:45:00", status: "failed", detail: "Outlook auth expired — re-login required" },
  { id: "l4", at: "2025-01-16T09:30:00", status: "success", detail: "Synced 38 events from Google Calendar" },
];

export function EmployerCalendarSync() {
  const [calendars, setCalendars] = React.useState<Calendar[]>(SEED_CALENDARS);
  const [events] = React.useState<SyncedEvent[]>(SEED_EVENTS);
  const [log] = React.useState<SyncLogEntry[]>(SEED_LOG);
  const [twoWay, setTwoWay] = React.useState(true);
  const [autoBlock, setAutoBlock] = React.useState(true);
  const [buffer, setBuffer] = React.useState("15");

  const connect = (id: string) => {
    setCalendars((cs) => cs.map((c) => c.id === id ? { ...c, connected: true, lastSync: new Date().toISOString(), eventsSynced: 0 } : c));
    toast.success("Calendar connected — syncing now…");
  };
  const disconnect = (id: string) => {
    setCalendars((cs) => cs.map((c) => c.id === id ? { ...c, connected: false, lastSync: undefined, eventsSynced: undefined } : c));
    toast.success("Calendar disconnected");
  };
  const syncNow = (id: string) => {
    const c = calendars.find((x) => x.id === id);
    setCalendars((cs) => cs.map((x) => x.id === id ? { ...x, lastSync: new Date().toISOString(), eventsSynced: (x.eventsSynced ?? 0) + Math.floor(Math.random() * 8 + 2) } : x));
    toast.success(`Synced ${c?.name}`);
  };
  const saveSettings = () => toast.success("Sync settings saved");

  const connected = calendars.filter((c) => c.connected).length;
  const conflicts = events.filter((e) => e.conflicts).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar Sync"
        description="Connect external calendars to keep interviews and meetings in sync."
        icon={<Icon name="CalendarCheck" className="h-6 w-6" />}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Connected Calendars" value={`${connected}/${calendars.length}`} icon={<Icon name="CalendarCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Synced Events" value={events.length} icon={<Icon name="Calendar" className="h-5 w-5" />} />
        <StatCard label="Conflicts Detected" value={conflicts} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Connected Calendars">
        <div className="space-y-3">
          {calendars.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name="Calendar" className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{c.name}</p>
                      <Badge className={c.connected ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground"}>
                        {c.connected ? "Connected" : "Not connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.email || "No account linked"}
                      {c.lastSync && ` · Last synced ${timeAgo(c.lastSync)}`}
                      {c.eventsSynced !== undefined && ` · ${c.eventsSynced} events synced`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {c.connected ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => syncNow(c.id)}>
                        <Icon name="RefreshCw" className="mr-2 h-4 w-4" /> Sync Now
                      </Button>
                      <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => disconnect(c.id)}>Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" className="bg-brand text-white hover:bg-brand/90" onClick={() => connect(c.id)}>
                      <Icon name="Link" className="mr-2 h-4 w-4" /> Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Sync Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Two-way Sync</p>
                <p className="text-xs text-muted-foreground">Push JOBSONN interviews to your calendar and vice-versa</p>
              </div>
              <Switch checked={twoWay} onCheckedChange={setTwoWay} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Auto-block interview slots</p>
                <p className="text-xs text-muted-foreground">Mark interview times as busy automatically</p>
              </div>
              <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Buffer time</p>
                <p className="text-xs text-muted-foreground">Minutes before/after interviews</p>
              </div>
              <Select value={buffer} onValueChange={setBuffer}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveSettings} className="bg-brand text-white hover:bg-brand/90">Save Settings</Button>
          </div>
        </SectionCard>

        <SectionCard title="Synced Events" description="Pulled from connected calendars">
          <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {events.map((e) => (
              <div key={e.id} className="flex items-start justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(e.time)} · {e.participants}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={e.type === "interview" ? "text-brand" : e.type === "meeting" ? "text-amber-600" : "text-muted-foreground"}>
                    {e.type}
                  </Badge>
                  {e.conflicts && <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">Conflict</Badge>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Sync History" description="Recent sync activity">
        <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
          {log.map((l) => (
            <div key={l.id} className="flex items-start gap-2 rounded-lg border p-2 text-sm">
              <Icon name={l.status === "success" ? "CheckCircle2" : "CircleAlert"} className={`mt-0.5 h-4 w-4 ${l.status === "success" ? "text-emerald-500" : "text-rose-500"}`} />
              <div className="min-w-0 flex-1">
                <p>{l.detail}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(l.at)}</p>
              </div>
              <Badge variant="outline" className={l.status === "success" ? "text-emerald-600" : "text-rose-600"}>
                {l.status}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
