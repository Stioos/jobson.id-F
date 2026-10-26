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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, formatDateTime } from "@/lib/format";

interface VideoCall {
  id: string; company: string; role: string; interviewer: string;
  at: string; durationMins: number; status: "upcoming" | "completed" | "missed";
  recordingUrl?: string; participants: string[];
}

const SEED_CALLS: VideoCall[] = [
  { id: "v1", company: "Razorpay", role: "Senior Frontend Engineer", interviewer: "Priya Nair (Eng Manager)", at: "2025-01-18T10:30:00", durationMins: 60, status: "upcoming", participants: ["Aarav S.", "Priya N.", "Karan M."] },
  { id: "v2", company: "Zomato", role: "Full Stack Engineer", interviewer: "Vikram Singh", at: "2025-01-20T14:00:00", durationMins: 45, status: "upcoming", participants: ["Aarav S.", "Vikram S."] },
  { id: "v3", company: "PhonePe", role: "UI Engineer II", interviewer: "Sneha Rao", at: "2025-01-22T16:30:00", durationMins: 90, status: "upcoming", participants: ["Aarav S.", "Sneha R.", "Panel of 3"] },
  { id: "v4", company: "Swiggy", role: "Frontend Engineer", interviewer: "Aditya Khanna", at: "2024-12-28T11:00:00", durationMins: 50, status: "completed", recordingUrl: "swiggy-frontend-rec.mp4", participants: ["Aarav S.", "Aditya K."] },
  { id: "v5", company: "Flipkart", role: "SDE-II Frontend", interviewer: "Megha Joshi", at: "2024-12-15T15:00:00", durationMins: 60, status: "missed", participants: ["Aarav S.", "Megha J."] },
];

const TIPS = [
  "Use a wired headset to avoid audio drops",
  "Test your camera & mic 10 minutes before",
  "Keep a quiet, well-lit background",
  "Have your resume and JD open on a second screen",
  "Prepare 2-3 questions for the interviewer",
];

export function CandidateVideoCall() {
  const [calls, setCalls] = React.useState<VideoCall[]>(SEED_CALLS);
  const [schedOpen, setSchedOpen] = React.useState(false);
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>({
    camera: false, mic: false, background: false, notes: false,
  });
  const [form, setForm] = React.useState({ company: "", role: "", interviewer: "", date: "", duration: "60" });

  const upcoming = calls.filter((c) => c.status === "upcoming");
  const past = calls.filter((c) => c.status !== "upcoming");

  const join = (c: VideoCall) => {
    toast.success(`Joining call with ${c.company}…`);
    setCalls((cs) => cs.map((x) => x.id === c.id ? { ...x, status: "completed", recordingUrl: `${c.company.toLowerCase()}-rec.mp4` } : x));
  };
  const watch = (c: VideoCall) => toast.info(`Loading recording: ${c.recordingUrl}`);
  const toggleCheck = (k: string) => {
    setChecklist((s) => ({ ...s, [k]: !s[k] }));
    toast.success("Pre-call checklist updated");
  };
  const schedule = () => {
    if (!form.company || !form.role || !form.date) { toast.error("Fill all fields"); return; }
    const nc: VideoCall = {
      id: `v${Date.now()}`, company: form.company, role: form.role, interviewer: form.interviewer || "TBD",
      at: new Date(form.date).toISOString(), durationMins: parseInt(form.duration), status: "upcoming",
      participants: ["Aarav S.", form.interviewer || "TBD"],
    };
    setCalls((cs) => [nc, ...cs]);
    setSchedOpen(false); setForm({ company: "", role: "", interviewer: "", date: "", duration: "60" });
    toast.success("Call scheduled");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Calls"
        description="Manage your upcoming interviews, view past recordings, and run pre-call checks."
        icon={<Icon name="Video" className="h-6 w-6" />}
        actions={[{ label: "Schedule Call", icon: "Plus", onClick: () => setSchedOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming Calls" value={upcoming.length} icon={<Icon name="Calendar" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed" value={calls.filter((c) => c.status === "completed").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Missed" value={calls.filter((c) => c.status === "missed").length} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Upcoming Calls" description={`${upcoming.length} scheduled in the next 7 days`}>
        {upcoming.length === 0 ? (
          <EmptyState icon={<Icon name="Video" className="h-5 w-5" />} title="No upcoming calls" description="Schedule a call or check back later." />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scroll-thin">
            {upcoming.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{c.company}</p>
                    <Badge className="bg-brand/10 text-brand border-brand/20">{c.role}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <Icon name="User" className="mr-1 inline h-3 w-3" />
                    {c.interviewer} · {c.participants.length} participants
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <Icon name="Calendar" className="mr-1 inline h-3 w-3" />
                    {formatDateTime(c.at)} · {c.durationMins} mins
                  </p>
                </div>
                <Button onClick={() => join(c)} className="bg-brand text-white hover:bg-brand/90">
                  <Icon name="Video" className="mr-2 h-4 w-4" /> Join Call
                </Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Pre-call Checklist">
          <div className="space-y-2">
            {[
              { k: "camera", label: "Camera working & framed properly", icon: "Video" },
              { k: "mic", label: "Microphone tested, no echo", icon: "Mic" },
              { k: "background", label: "Background quiet & professional", icon: "Monitor" },
              { k: "notes", label: "Resume, JD & notes ready", icon: "FileText" },
            ].map((item) => (
              <label key={item.k} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-brand/5">
                <Checkbox checked={checklist[item.k]} onCheckedChange={() => toggleCheck(item.k)} />
                <Icon name={item.icon} className="h-4 w-4 text-brand" />
                <span className="text-sm">{item.label}</span>
                {checklist[item.k] && <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Ready</Badge>}
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Interview Tips" description="Quick reminders for a great first impression">
          <ul className="space-y-2">
            {TIPS.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Past Calls" description="Recordings & history">
        {past.length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No past calls" />
        ) : (
          <div className="space-y-3">
            {past.map((c) => (
              <div key={c.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{c.company}</p>
                    <Badge variant="outline">{c.role}</Badge>
                    <Badge className={c.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(c.at, { day: "numeric", month: "short", year: "numeric" })} · {c.durationMins} mins · {c.participants.join(", ")}
                  </p>
                </div>
                {c.recordingUrl ? (
                  <Button variant="outline" size="sm" onClick={() => watch(c)}>
                    <Icon name="Video" className="mr-2 h-4 w-4" /> Recording
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">No recording</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog open={schedOpen} onOpenChange={setSchedOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule a Video Call</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" /></div>
            <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Job title" /></div>
            <div><Label>Interviewer</Label><Input value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} placeholder="Name" /></div>
            <div><Label>Date & Time</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div>
              <Label>Duration</Label>
              <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchedOpen(false)}>Cancel</Button>
            <Button onClick={schedule} className="bg-brand text-white hover:bg-brand/90">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
