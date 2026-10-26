"use client";

import * as React from "react";
import { eventDrives as seedEvents } from "@/lib/partner-data";
import type { EventDrive } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Calendar, Plus, MapPin, Users, Building2, Video, PlusCircle } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  placement_drive: "Placement Drive", workshop: "Workshop", hackathon: "Hackathon", seminar: "Seminar", career_fair: "Career Fair", tech_talk: "Tech Talk",
};

export function PartnerEvents() {
  const partner = CURRENT_PARTNER;
  const [events] = React.useState<EventDrive[]>(seedEvents);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<EventDrive | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = events.filter((e) => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const active = events.filter((e) => e.status === "active").length;
  const completed = events.filter((e) => e.status === "completed").length;
  const totalRegistered = events.reduce((s, e) => s + e.registered, 0);

  function openEvent(e: EventDrive) { setSelected(e); setSheetOpen(true); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events & Drives"
        description={`${partner.name} — placement drives, workshops, hackathons, seminars, career fairs, and tech talks.`}
        icon={<Icon name="Calendar" className="h-6 w-6" />}
        actions={[{ label: "Create Event", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={events.length} icon={<Calendar className="h-5 w-5" />} tone="brand" />
        <StatCard label="Upcoming" value={upcoming} icon={<Calendar className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<Calendar className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Registered" value={totalRegistered} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-10 text-sm text-muted-foreground">No events match your filters.</div>
        ) : filtered.map((e) => {
          const fillRate = e.expectedAttendees > 0 ? Math.round((e.registered / e.expectedAttendees) * 100) : 0;
          return (
            <Card key={e.id} className="p-4 hover:border-brand hover:shadow-md transition cursor-pointer flex flex-col" onClick={() => openEvent(e)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name="Calendar" className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[e.type]}</Badge>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-tight">{e.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{e.description}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(e.date)}{e.endDate && ` — ${formatDate(e.endDate)}`}</div>
                <div className="flex items-center gap-1.5">
                  {e.modality === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {e.location}
                </div>
                <div className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {e.registered} / {e.expectedAttendees} registered</div>
              </div>
              <div className="mt-2 space-y-1">
                <Progress value={fillRate} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground">{fillRate}% filled</p>
              </div>
              {e.companies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {e.companies.slice(0, 3).map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                  {e.companies.length > 3 && <span className="text-[10px] text-muted-foreground">+{e.companies.length - 3}</span>}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand" /> {selected.name}
                </SheetTitle>
                <SheetDescription>{TYPE_LABEL[selected.type]} · {formatDate(selected.date)}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Registered</p>
                    <p className="mt-1 text-lg font-semibold">{selected.registered} / {selected.expectedAttendees}</p>
                    <Progress value={Math.round((selected.registered / selected.expectedAttendees) * 100)} className="mt-1 h-1" />
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Modality</p>
                    <p className="mt-1 text-sm font-semibold capitalize">{selected.modality}</p>
                    <p className="text-[10px] text-muted-foreground">{selected.status}</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">About</p>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Details</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{formatDate(selected.date)}</span></div>
                    {selected.endDate && <div className="flex justify-between"><span className="text-muted-foreground">End:</span><span className="font-medium">{formatDate(selected.endDate)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Location:</span><span className="font-medium">{selected.location}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Modality:</span><span className="font-medium capitalize">{selected.modality}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Partner:</span><span className="font-medium">{selected.partnerName}</span></div>
                  </div>
                </div>
                {selected.companies.length > 0 && (
                  <div className="space-y-2 rounded-lg border p-3">
                    <p className="text-xs font-semibold flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Participating Companies ({selected.companies.length})</p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto scroll-thin">
                      {selected.companies.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <AvatarLogo text={c} size="xs" /> <span className="text-xs">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.success("Schedule viewed", { description: "Opening detailed event schedule." })}>View Schedule</Button>
                <Button size="sm" onClick={() => toast.success("Registration opened", { description: "Student registration form opened." })}><PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Register Students</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Create a new event or drive.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Event created", { description: "Event added to calendar." }); setCreateOpen(false); }} className="space-y-3">
            <div className="space-y-1.5"><Label>Event Name *</Label><Input required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select defaultValue="workshop">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Modality</Label>
                <Select defaultValue="offline">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>Expected Attendees</Label><Input type="number" /></div>
            </div>
            <div className="space-y-1.5"><Label>Location</Label><Input placeholder="Venue or Online" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
