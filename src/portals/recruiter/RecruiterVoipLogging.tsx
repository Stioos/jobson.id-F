"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateTime, timeAgo } from "@/lib/format";

type Direction = "Outbound" | "Inbound";
type CallStatus = "Connected" | "No Answer" | "Voicemail" | "Busy";

interface CallLog {
  id: string; candidate: string; phone: string; direction: Direction;
  durationSec: number; date: string; status: CallStatus;
  recordingUrl?: string; notes?: string;
}

const SEED_CALLS: CallLog[] = [
  { id: "c1", candidate: "Aarav Sharma", phone: "+91 98•••• 4291", direction: "Outbound", durationSec: 730, date: "2025-01-17T11:00:00", status: "Connected", recordingUrl: "call-c1.mp3", notes: "Discussed Razorpay interview prep — candidate feels ready." },
  { id: "c2", candidate: "Diya Patel", phone: "+91 90•••• 1188", direction: "Outbound", durationSec: 0, date: "2025-01-17T10:15:00", status: "No Answer", notes: "Will retry tomorrow morning." },
  { id: "c3", candidate: "Kabir Mehta", phone: "+91 99•••• 7364", direction: "Inbound", durationSec: 425, date: "2025-01-16T16:30:00", status: "Connected", recordingUrl: "call-c3.mp3", notes: "Wants to reschedule interview to next week." },
  { id: "c4", candidate: "Ananya Reddy", phone: "+91 88•••• 2010", direction: "Outbound", durationSec: 95, date: "2025-01-16T14:00:00", status: "Voicemail", recordingUrl: "voicemail-c4.mp3", notes: "Left message about offer details." },
  { id: "c5", candidate: "Rohan Gupta", phone: "+91 96•••• 5521", direction: "Outbound", durationSec: 0, date: "2025-01-16T11:00:00", status: "Busy", notes: "" },
  { id: "c6", candidate: "Ishaan Verma", phone: "+91 91•••• 3342", direction: "Outbound", durationSec: 612, date: "2025-01-15T17:00:00", status: "Connected", recordingUrl: "call-c6.mp3", notes: "Document verification done." },
  { id: "c7", candidate: "Meera Krishnan", phone: "+91 99•••• 8801", direction: "Inbound", durationSec: 245, date: "2025-01-15T15:00:00", status: "Connected", recordingUrl: "call-c7.mp3", notes: "Asked about salary range." },
  { id: "c8", candidate: "Arjun Bose", phone: "+91 90•••• 6723", direction: "Outbound", durationSec: 0, date: "2025-01-15T12:30:00", status: "No Answer", notes: "" },
  { id: "c9", candidate: "Tanvi Shah", phone: "+91 88•••• 4498", direction: "Outbound", durationSec: 880, date: "2025-01-14T18:00:00", status: "Connected", recordingUrl: "call-c9.mp3", notes: "Confirmed interview slot." },
  { id: "c10", candidate: "Vivaan Kapoor", phone: "+91 96•••• 9920", direction: "Outbound", durationSec: 60, date: "2025-01-14T14:30:00", status: "Voicemail", notes: "Asked candidate to call back." },
];

const CANDIDATES = SEED_CALLS.map((c) => c.candidate);

export function RecruiterVoipLogging() {
  const [calls, setCalls] = React.useState<CallLog[]>(SEED_CALLS);
  const [pick, setPick] = React.useState<string>(CANDIDATES[0]);
  const [dialOpen, setDialOpen] = React.useState(false);
  const [activeCall, setActiveCall] = React.useState<string | null>(null);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [noteFor, setNoteFor] = React.useState<string | null>(null);

  const dial = () => {
    const target = calls.find((c) => c.candidate === pick);
    if (!target) return;
    setActiveCall(pick);
    setDialOpen(true);
  };
  const endCall = (status: CallStatus) => {
    const duration = status === "Connected" ? Math.floor(Math.random() * 600 + 60) : 0;
    const nc: CallLog = {
      id: `c${Date.now()}`, candidate: pick, phone: calls.find((c) => c.candidate === pick)?.phone || "",
      direction: "Outbound", durationSec: duration, date: new Date().toISOString(), status,
      recordingUrl: status === "Connected" ? `call-${Date.now()}.mp3` : undefined,
    };
    setCalls((cs) => [nc, ...cs]);
    setDialOpen(false); setActiveCall(null);
    toast.success(`Call ended: ${status}`);
  };
  const saveNote = () => {
    setCalls((cs) => cs.map((c) => c.id === noteFor ? { ...c, notes: noteDraft.trim() } : c));
    setNoteFor(null); setNoteDraft("");
    toast.success("Note saved");
  };

  const total = calls.length;
  const connected = calls.filter((c) => c.status === "Connected").length;
  const connRate = total ? Math.round((connected / total) * 100) : 0;
  const avgDur = Math.round(calls.reduce((s, c) => s + c.durationSec, 0) / Math.max(total, 1) / 60);

  const fmtDur = (s: number) => s === 0 ? "—" : `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="VoIP Call Logs"
        description="Click-to-call candidates, log outcomes, and review call analytics."
        icon={<Icon name="PhoneCall" className="h-6 w-6" />}
        actions={[{ label: "Click to Call", icon: "PhoneCall", onClick: () => setDialOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calls" value={total} icon={<Icon name="PhoneCall" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Duration" value={`${avgDur}m`} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Connection Rate" value={`${connRate}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Calls / Day" value={(total / 7).toFixed(1)} icon={<Icon name="Calendar" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Click-to-Call" description="Dial a candidate directly from the candidate pool">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label>Select Candidate</Label>
            <Select value={pick} onValueChange={setPick}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CANDIDATES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={dial} className="bg-brand text-white hover:bg-brand/90">
            <Icon name="PhoneCall" className="mr-2 h-4 w-4" /> Dial Now
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Call History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="p-2">Candidate</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Direction</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Recording</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((c) => (
                <tr key={c.id} className="border-b hover:bg-brand/5">
                  <td className="p-2 font-medium">{c.candidate}</td>
                  <td className="p-2 text-xs">{c.phone}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={c.direction === "Outbound" ? "text-brand text-[10px]" : "text-amber-600 text-[10px]"}>
                      {c.direction}
                    </Badge>
                  </td>
                  <td className="p-2 text-xs">{fmtDur(c.durationSec)}</td>
                  <td className="p-2 text-xs text-muted-foreground">{timeAgo(c.date)}</td>
                  <td className="p-2">
                    <Badge className={c.status === "Connected" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                      : c.status === "No Answer" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                      : c.status === "Voicemail" ? "bg-violet-500/10 text-violet-600 border-violet-500/20 text-[10px]"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {c.recordingUrl ? (
                      <Button variant="ghost" size="sm" onClick={() => toast.info(`Playing ${c.recordingUrl}`)}>
                        <Icon name="PhoneCall" className="h-3 w-3" />
                      </Button>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="p-2">
                    {c.notes ? (
                      <Button variant="ghost" size="sm" onClick={() => { setNoteFor(c.id); setNoteDraft(c.notes); }}>
                        View
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => { setNoteFor(c.id); setNoteDraft(""); }}>
                        Add
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {dialOpen && (
        <SectionCard title="Active Call" action={<Button variant="ghost" size="sm" onClick={() => setDialOpen(false)}>Close</Button>}>
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand animate-pulse">
              <Icon name="PhoneCall" className="h-7 w-7" />
            </div>
            <p className="font-semibold">{activeCall}</p>
            <p className="text-xs text-muted-foreground">Calling…</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => endCall("Connected")} className="text-emerald-600">Connected</Button>
              <Button variant="outline" onClick={() => endCall("No Answer")}>No Answer</Button>
              <Button variant="outline" onClick={() => endCall("Voicemail")}>Voicemail</Button>
              <Button variant="outline" onClick={() => endCall("Busy")}>Busy</Button>
            </div>
          </div>
        </SectionCard>
      )}

      {noteFor && (
        <SectionCard title="Call Notes" action={<Button variant="ghost" size="sm" onClick={() => setNoteFor(null)}>Close</Button>}>
          <Textarea rows={4} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add call notes…" />
          <div className="mt-2 flex justify-end">
            <Button onClick={saveNote} className="bg-brand text-white hover:bg-brand/90">Save Note</Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
