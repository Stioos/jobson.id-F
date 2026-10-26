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
  EmptyState,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type RescheduleStatus = "Pending" | "Accepted" | "Rejected";
type RescheduleReason = "Personal Emergency" | "Schedule Conflict" | "Illness" | "Other";

interface RescheduleRequest {
  id: string;
  company: string;
  role: string;
  originalDate: string;
  requestedDate: string;
  reason: RescheduleReason;
  status: RescheduleStatus;
  notes?: string;
  proposedDates?: string[];
}

const DAY = 86400000;
const now = Date.now();

const INTERVIEWS = [
  { id: "iv1", label: "TechCorp India — Senior Frontend Engineer (Round 2 — System Design)" },
  { id: "iv2", label: "FinEdge — Product Engineer (Round 3 — Bar Raiser)" },
  { id: "iv3", label: "Brightwave Labs — Frontend Engineer (Round 1 — Technical Screen)" },
];

const REQUESTS: RescheduleRequest[] = [
  { id: "rr1", company: "TechCorp India", role: "Senior Frontend Engineer", originalDate: new Date(now + 3 * DAY).toISOString(), requestedDate: new Date(now + 5 * DAY).toISOString(), reason: "Schedule Conflict", status: "Pending", notes: "Have a client demo at the originally scheduled time.", proposedDates: [new Date(now + 5 * DAY).toISOString(), new Date(now + 6 * DAY).toISOString(), new Date(now + 8 * DAY).toISOString()] },
  { id: "rr2", company: "FinEdge", role: "Product Engineer", originalDate: new Date(now - 2 * DAY).toISOString(), requestedDate: new Date(now + 1 * DAY).toISOString(), reason: "Illness", status: "Accepted", notes: "Recovering from flu; requested a 3-day buffer." },
  { id: "rr3", company: "Brightwave Labs", role: "Frontend Engineer", originalDate: new Date(now - 8 * DAY).toISOString(), requestedDate: new Date(now - 5 * DAY).toISOString(), reason: "Personal Emergency", status: "Rejected", notes: "Family medical emergency." },
  { id: "rr4", company: "Dataflow Systems", role: "Full Stack Developer", originalDate: new Date(now + 10 * DAY).toISOString(), requestedDate: new Date(now + 12 * DAY).toISOString(), reason: "Other", status: "Pending", notes: "Awaiting joining date confirmation from current employer." },
  { id: "rr5", company: "Nimbus Cloud", role: "UI Engineer", originalDate: new Date(now - 15 * DAY).toISOString(), requestedDate: new Date(now - 12 * DAY).toISOString(), reason: "Schedule Conflict", status: "Accepted", notes: "Travel conflict." },
];

const STATUS_CLS: Record<RescheduleStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

const REASONS: RescheduleReason[] = ["Personal Emergency", "Schedule Conflict", "Illness", "Other"];

function fmt(d: string) {
  return new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function CandidateInterviewReschedule() {
  const [requests, setRequests] = React.useState<RescheduleRequest[]>(REQUESTS);
  const [open, setOpen] = React.useState(false);
  const [interviewId, setInterviewId] = React.useState<string>("");
  const [reason, setReason] = React.useState<RescheduleReason>("Schedule Conflict");
  const [notes, setNotes] = React.useState("");
  const [p1, setP1] = React.useState("");
  const [p2, setP2] = React.useState("");
  const [p3, setP3] = React.useState("");

  const pending = requests.filter((r) => r.status === "Pending").length;
  const accepted = requests.filter((r) => r.status === "Accepted").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;

  const pendingList = requests.filter((r) => r.status === "Pending");
  const history = requests.filter((r) => r.status !== "Pending");

  const submit = () => {
    if (!interviewId) { toast.error("Please select an interview"); return; }
    if (!p1 || !p2 || !p3) { toast.error("Please propose 3 new date options"); return; }
    const iv = INTERVIEWS.find((i) => i.id === interviewId)!;
    const newReq: RescheduleRequest = {
      id: `rr${requests.length + 1}`,
      company: iv.label.split("—")[0].trim(),
      role: iv.label.split("—")[1].trim(),
      originalDate: new Date(now + 4 * DAY).toISOString(),
      requestedDate: p1,
      reason,
      status: "Pending",
      notes,
      proposedDates: [p1, p2, p3],
    };
    setRequests([newReq, ...requests]);
    toast.success("Reschedule request sent", { description: `${iv.label} — awaiting employer response.` });
    setOpen(false);
    setInterviewId(""); setReason("Schedule Conflict"); setNotes(""); setP1(""); setP2(""); setP3("");
  };

  const withdraw = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Request withdrawn");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Reschedule Requests"
        description="Request, track and manage interview reschedules across all active interview loops. Stay transparent with hiring teams."
        icon={<Icon name="CalendarClock" className="h-6 w-6" />}
        actions={[
          {
            label: "New reschedule request",
            variant: "default",
            onClick: () => setOpen(true),
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total requests" value={requests.length} icon={<Icon name="CalendarClock" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Pending" value={pending} icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Accepted" value={accepted} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<Icon name="X" className="h-4 w-4" />} tone="danger" />
      </div>

      <SectionCard
        title="Pending requests"
        description="Reschedule requests awaiting employer action"
        action={<Badge className="bg-brand/10 text-brand">{pendingList.length} pending</Badge>}
      >
        {pendingList.length === 0 ? (
          <EmptyState icon={<Icon name="CalendarCheck2" className="h-5 w-5" />} title="No pending requests" description="All your reschedule requests have been resolved." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Original</th>
                  <th className="px-3 py-2 font-medium">Requested</th>
                  <th className="px-3 py-2 font-medium">Reason</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-2 font-medium">{r.company}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.role}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{fmt(r.originalDate)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{fmt(r.requestedDate)}</td>
                    <td className="px-3 py-2"><Badge variant="outline">{r.reason}</Badge></td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span></td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => withdraw(r.id)}>Withdraw</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="History"
        description="Past reschedule requests and their outcomes"
        action={<Badge variant="outline">{history.length} resolved</Badge>}
      >
        {history.length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No history yet" description="Resolved reschedule requests will appear here." />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scroll-thin pr-1">
            {history.map((r) => (
              <Card key={r.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0 p-4">
                  <div>
                    <CardTitle className="text-sm">{r.company} — <span className="text-muted-foreground font-normal">{r.role}</span></CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fmt(r.originalDate)} → {fmt(r.requestedDate)} · {r.reason}
                    </p>
                    {r.notes && <p className="mt-1 text-xs italic text-muted-foreground">“{r.notes}”</p>}
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New reschedule request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Select interview</Label>
              <Select value={interviewId} onValueChange={setInterviewId}>
                <SelectTrigger><SelectValue placeholder="Choose an upcoming interview" /></SelectTrigger>
                <SelectContent>
                  {INTERVIEWS.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as RescheduleReason)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Proposed new dates (3 options)</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input type="datetime-local" value={p1} onChange={(e) => setP1(e.target.value)} />
                <Input type="datetime-local" value={p2} onChange={(e) => setP2(e.target.value)} />
                <Input type="datetime-local" value={p3} onChange={(e) => setP3(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Offering multiple options improves the chance of a quick confirmation.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Brief context for the employer" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Send request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
