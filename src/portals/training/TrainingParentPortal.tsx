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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";

interface Parent {
  id: string; name: string; relationship: string; phone: string; email: string;
  preference: "Email" | "SMS" | "WhatsApp" | "Phone";
}
interface Student {
  id: string; name: string; batch: string;
  parent: Parent;
  attendance: number; avgGrade: string; feeStatus: "Paid" | "Pending" | "Overdue";
  upcomingAssessments: { title: string; date: string }[];
  consentForms: { title: string; signed: boolean }[];
  feeReminderEnabled: boolean;
}

interface CommsEntry { id: string; type: "Email" | "SMS" | "Meeting"; at: string; subject: string; }

const SEED_STUDENTS: Student[] = [
  {
    id: "s1", name: "Aarav Sharma", batch: "B-Tech CSE 2026",
    parent: { id: "p1", name: "Rajesh Sharma", relationship: "Father", phone: "+91 98•••• 4291", email: "rajesh.s@example.com", preference: "WhatsApp" },
    attendance: 88, avgGrade: "A", feeStatus: "Paid",
    upcomingAssessments: [{ title: "DBMS Mid-term", date: "2025-01-25" }, { title: "DSA Quiz", date: "2025-01-28" }],
    consentForms: [{ title: "Field Trip — Bangalore", signed: true }, { title: "Internship Authorization", signed: false }],
    feeReminderEnabled: true,
  },
  {
    id: "s2", name: "Diya Patel", batch: "B-Tech CSE 2026",
    parent: { id: "p2", name: "Sunita Patel", relationship: "Mother", phone: "+91 90•••• 1188", email: "sunita.p@example.com", preference: "Email" },
    attendance: 74, avgGrade: "B+", feeStatus: "Pending",
    upcomingAssessments: [{ title: "DBMS Mid-term", date: "2025-01-25" }],
    consentForms: [{ title: "Field Trip — Bangalore", signed: true }],
    feeReminderEnabled: true,
  },
  {
    id: "s3", name: "Kabir Mehta", batch: "B-Tech ECE 2026",
    parent: { id: "p3", name: "Anil Mehta", relationship: "Father", phone: "+91 99•••• 7364", email: "anil.m@example.com", preference: "Phone" },
    attendance: 92, avgGrade: "A+", feeStatus: "Paid",
    upcomingAssessments: [{ title: "Signals Quiz", date: "2025-01-30" }],
    consentForms: [{ title: "Lab Safety Acknowledgment", signed: true }],
    feeReminderEnabled: false,
  },
  {
    id: "s4", name: "Ananya Reddy", batch: "B-Tech CSE 2025",
    parent: { id: "p4", name: "Lakshmi Reddy", relationship: "Mother", phone: "+91 88•••• 2010", email: "lakshmi.r@example.com", preference: "SMS" },
    attendance: 65, avgGrade: "C+", feeStatus: "Overdue",
    upcomingAssessments: [{ title: "Final Project Review", date: "2025-02-05" }, { title: "Viva", date: "2025-02-10" }],
    consentForms: [{ title: "Project Authorization", signed: false }],
    feeReminderEnabled: true,
  },
  {
    id: "s5", name: "Rohan Gupta", batch: "B-Tech ME 2026",
    parent: { id: "p5", name: "Deepak Gupta", relationship: "Father", phone: "+91 96•••• 5521", email: "deepak.g@example.com", preference: "Email" },
    attendance: 81, avgGrade: "B", feeStatus: "Paid",
    upcomingAssessments: [{ title: "Thermodynamics Test", date: "2025-01-27" }],
    consentForms: [{ title: "Workshop Consent", signed: true }],
    feeReminderEnabled: true,
  },
];

const SEED_COMMS: CommsEntry[] = [
  { id: "co1", type: "Email", at: "2025-01-15T10:00:00", subject: "Weekly digest — Aarav Sharma" },
  { id: "co2", type: "WhatsApp", at: "2025-01-12T15:30:00", subject: "Fee reminder — Ananya Reddy" },
  { id: "co3", type: "Meeting", at: "2025-01-10T16:00:00", subject: "PTM — Diya Patel (attendance concern)" },
  { id: "co4", type: "Email", at: "2025-01-08T09:00:00", subject: "Consent form — Field Trip" },
];

export function TrainingParentPortal() {
  const [students, setStudents] = React.useState<Student[]>(SEED_STUDENTS);
  const [activeId, setActiveId] = React.useState<string>(SEED_STUDENTS[0].id);
  const [meetingOpen, setMeetingOpen] = React.useState(false);
  const [meeting, setMeeting] = React.useState({ date: "", topic: "" });

  const active = students.find((s) => s.id === activeId)!;

  const toggleFee = (id: string) => {
    setStudents((ss) => ss.map((s) => s.id === id ? { ...s, feeReminderEnabled: !s.feeReminderEnabled } : s));
    toast.success("Fee reminder preference updated");
  };
  const sendDigest = () => toast.success(`Weekly digest sent to ${active.parent.name}`);
  const signConsent = (title: string) => {
    setStudents((ss) => ss.map((s) => s.id === activeId ? { ...s, consentForms: s.consentForms.map((c) => c.title === title ? { ...c, signed: true } : c) } : s));
    toast.success(`Consent form signed: ${title}`);
  };
  const scheduleMeeting = () => {
    if (!meeting.date || !meeting.topic) { toast.error("Fill all fields"); return; }
    toast.success(`PTM scheduled with ${active.parent.name} on ${formatDate(meeting.date)}`);
    setMeetingOpen(false); setMeeting({ date: "", topic: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Portal"
        description="Communication hub connecting trainers with parents and guardians."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Schedule PTM", icon: "Calendar", onClick: () => setMeetingOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students Tracked" value={students.length} icon={<Icon name="GraduationCap" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Consents" value={students.reduce((s, x) => s + x.consentForms.filter((c) => !c.signed).length, 0)} icon={<Icon name="FileText" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Fee Pending" value={students.filter((s) => s.feeStatus !== "Paid").length} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Comms Sent (30d)" value={SEED_COMMS.length + 18} icon={<Icon name="Mail" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b p-3"><p className="text-sm font-semibold">Students</p></div>
          <div className="max-h-[480px] overflow-y-auto scroll-thin">
            {students.map((s) => (
              <button key={s.id} onClick={() => setActiveId(s.id)}
                className={`w-full border-b px-3 py-3 text-left transition hover:bg-brand/5 ${s.id === activeId ? "bg-brand/10" : ""}`}>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.batch}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Badge variant="outline" className="text-[9px]">{s.parent.relationship}</Badge>
                  {s.feeStatus === "Overdue" && <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[9px]">Fee Overdue</Badge>}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <SectionCard title="Parent / Guardian" description={`For ${active.name}`}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{active.parent.name}</p>
                <p className="text-xs text-muted-foreground">{active.parent.relationship}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Preferred Contact</p>
                <Badge className="bg-brand/10 text-brand border-brand/20 mt-1">{active.parent.preference}</Badge>
                <p className="mt-1 text-xs">{active.parent.phone}</p>
                <p className="text-xs">{active.parent.email}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Weekly Digest Preview">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className={`text-lg font-semibold ${active.attendance >= 75 ? "text-emerald-600" : "text-rose-600"}`}>{active.attendance}%</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Avg Grade</p>
                <p className="text-lg font-semibold">{active.avgGrade}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Upcoming Tests</p>
                <p className="text-lg font-semibold">{active.upcomingAssessments.length}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Fee Status</p>
                <Badge className={active.feeStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : active.feeStatus === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>
                  {active.feeStatus}
                </Badge>
              </div>
            </div>
            <Button onClick={sendDigest} className="mt-3 bg-brand text-white hover:bg-brand/90">
              <Icon name="Send" className="mr-2 h-4 w-4" /> Send Weekly Digest
            </Button>
          </SectionCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Consent Forms">
              <div className="space-y-2">
                {active.consentForms.map((c) => (
                  <div key={c.title} className="flex items-center justify-between rounded-lg border p-2">
                    <p className="text-sm">{c.title}</p>
                    {c.signed ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Signed</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => signConsent(c.title)}>Request</Button>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Fee Reminder to Parent">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Auto fee reminders</p>
                  <p className="text-xs text-muted-foreground">Send weekly reminders until fees are cleared</p>
                </div>
                <Switch checked={active.feeReminderEnabled} onCheckedChange={() => toggleFee(active.id)} />
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Communication History">
            <div className="space-y-2 max-h-64 overflow-y-auto scroll-thin">
              {SEED_COMMS.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm">{c.subject}</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(c.at)}</p>
                  </div>
                  <Badge variant="outline" className={c.type === "Email" ? "text-brand" : c.type === "SMS" ? "text-amber-600" : "text-violet-600"}>
                    {c.type}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <Dialog open={meetingOpen} onOpenChange={setMeetingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Parent-Teacher Meeting</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Parent</Label><Input value={`${active.parent.name} (${active.parent.relationship})`} disabled /></div>
            <div><Label>Date & Time</Label><Input type="datetime-local" value={meeting.date} onChange={(e) => setMeeting({ ...meeting, date: e.target.value })} /></div>
            <div>
              <Label>Topic</Label>
              <Select value={meeting.topic} onValueChange={(v) => setMeeting({ ...meeting, topic: v })}>
                <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Attendance concern">Attendance concern</SelectItem>
                  <SelectItem value="Academic performance">Academic performance</SelectItem>
                  <SelectItem value="Behavioral discussion">Behavioral discussion</SelectItem>
                  <SelectItem value="Career guidance">Career guidance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingOpen(false)}>Cancel</Button>
            <Button onClick={scheduleMeeting} className="bg-brand text-white hover:bg-brand/90">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
