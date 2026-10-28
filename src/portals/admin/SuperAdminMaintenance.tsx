"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";

interface Window {
  id: string; portal: string; start: string; end: string; banner: string; active: boolean;
}

const WINDOWS: Window[] = [
  { id: "m_001", portal: "recruiter", start: "2024-09-25T02:00:00Z", end: "2024-09-25T04:00:00Z", banner: "Scheduled maintenance — payouts paused", active: false },
  { id: "m_002", portal: "all", start: "2024-10-01T18:00:00Z", end: "2024-10-01T20:00:00Z", banner: "Quarterly DB vacuum — read-only mode", active: false },
];

const HISTORY = [
  { id: "h_001", portal: "training", date: "2024-09-12", duration: "1h 45m", outcome: "success" },
  { id: "h_002", portal: "candidate", date: "2024-08-30", duration: "32m", outcome: "success" },
  { id: "h_003", portal: "employer", date: "2024-08-15", duration: "1h 12m", outcome: "delayed" },
  { id: "h_004", portal: "partner", date: "2024-07-22", duration: "2h 04m", outcome: "incident" },
];

export function SuperAdminMaintenance() {
  const [portal, setPortal] = React.useState("all");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [banner, setBanner] = React.useState("");
  const [enabled, setEnabled] = React.useState(false);
  const [windows, setWindows] = React.useState(WINDOWS);

  const schedule = () => {
    if (!start || !end || !banner) { toast.error("All fields required"); return; }
    setWindows([{ id: `m_${Date.now()}`, portal, start, end, banner, active: false }, ...windows]);
    setStart(""); setEnd(""); setBanner("");
    toast.success("Maintenance window scheduled");
  };

  const activateNow = () => {
    setEnabled(true);
    toast.warning("Maintenance mode ACTIVATED platform-wide");
  };

  const outcomeBadge = (o: string) => {
    const cls = o === "success" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : o === "delayed" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{o}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Mode"
        description="Schedule maintenance windows, activate platform-wide banner, track history."
        icon={<Icon name="Wrench" className="h-6 w-6" />}
        actions={[{ label: "Activate Now", variant: "destructive", onClick: activateNow }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Scheduled" value={windows.length} icon={<Icon name="Calendar" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Now" value={enabled ? 1 : 0} icon={<Icon name="Activity" className="h-5 w-5" />} tone={enabled ? "danger" : "default"} />
        <StatCard label="Past 30d" value={HISTORY.length} icon={<Icon name="History" className="h-5 w-5" />} />
        <StatCard label="Avg Duration" value="1h 23m" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Schedule Window" description="Plan a future maintenance" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <UILabel className="text-xs">Portal</UILabel>
              <Select value={portal} onValueChange={setPortal}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Portals</SelectItem>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <UILabel className="text-xs">Start (UTC)</UILabel>
              <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
            </div>
            <div>
              <UILabel className="text-xs">End (UTC)</UILabel>
              <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
            </div>
            <div>
              <UILabel className="text-xs">Banner message</UILabel>
              <Textarea value={banner} onChange={(e) => setBanner(e.target.value)} rows={2} className="mt-1" placeholder="We'll be back shortly…" />
            </div>
            <Button className="w-full" onClick={schedule}><Icon name="Calendar" className="mr-1 h-4 w-4" /> Schedule</Button>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Windows" description="Scheduled maintenance" className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portal</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {windows.map((w) => (
                <TableRow key={w.id}>
                  <TableCell><Badge variant="outline">{w.portal}</Badge></TableCell>
                  <TableCell className="text-xs">{formatDateTime(w.start)}</TableCell>
                  <TableCell className="text-xs">{formatDateTime(w.end)}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">{w.banner}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-cyan-500/15 text-cyan-700 border-cyan-500/30">scheduled</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Maintenance History" description="Last 90 days" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORY.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="text-xs">{h.date}</TableCell>
                <TableCell><Badge variant="outline">{h.portal}</Badge></TableCell>
                <TableCell className="text-xs">{h.duration}</TableCell>
                <TableCell>{outcomeBadge(h.outcome)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
