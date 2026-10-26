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
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

type LeaveType = "Casual" | "Sick" | "Annual" | "Maternity" | "Paternity";
type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: string;
  employee: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
}

interface LeaveBalance {
  employee: string;
  casual: { allocated: number; used: number };
  sick: { allocated: number; used: number };
  annual: { allocated: number; used: number };
}

const DAY = 86400000;
const now = Date.now();

const REQUESTS: LeaveRequest[] = [
  { id: "lr1", employee: "Priya Nair", type: "Casual", startDate: new Date(now + 2 * DAY).toISOString(), endDate: new Date(now + 3 * DAY).toISOString(), days: 2, reason: "Personal work", status: "Pending" },
  { id: "lr2", employee: "Arjun Mehta", type: "Sick", startDate: new Date(now - 1 * DAY).toISOString(), endDate: new Date(now - 1 * DAY).toISOString(), days: 1, reason: "Fever", status: "Pending" },
  { id: "lr3", employee: "Sneha Reddy", type: "Annual", startDate: new Date(now + 10 * DAY).toISOString(), endDate: new Date(now + 17 * DAY).toISOString(), days: 6, reason: "Family vacation — Goa", status: "Pending" },
  { id: "lr4", employee: "Karthik Rao", type: "Casual", startDate: new Date(now + 5 * DAY).toISOString(), endDate: new Date(now + 5 * DAY).toISOString(), days: 1, reason: "Religious festival", status: "Approved" },
  { id: "lr5", employee: "Rohit Sharma", type: "Sick", startDate: new Date(now - 5 * DAY).toISOString(), endDate: new Date(now - 3 * DAY).toISOString(), days: 3, reason: "Flu recovery", status: "Approved" },
  { id: "lr6", employee: "Anjali Gupta", type: "Paternity", startDate: new Date(now + 14 * DAY).toISOString(), endDate: new Date(now + 28 * DAY).toISOString(), days: 15, reason: "Paternity leave", status: "Pending" },
  { id: "lr7", employee: "Meera Krishnan", type: "Annual", startDate: new Date(now + 30 * DAY).toISOString(), endDate: new Date(now + 33 * DAY).toISOString(), days: 4, reason: "Long weekend trip", status: "Rejected" },
  { id: "lr8", employee: "Vikram Singh", type: "Casual", startDate: new Date(now + 7 * DAY).toISOString(), endDate: new Date(now + 8 * DAY).toISOString(), days: 2, reason: "Bank work", status: "Pending" },
];

const BALANCES: LeaveBalance[] = [
  { employee: "Priya Nair", casual: { allocated: 12, used: 4 }, sick: { allocated: 12, used: 2 }, annual: { allocated: 15, used: 6 } },
  { employee: "Arjun Mehta", casual: { allocated: 12, used: 7 }, sick: { allocated: 12, used: 5 }, annual: { allocated: 15, used: 3 } },
  { employee: "Sneha Reddy", casual: { allocated: 12, used: 3 }, sick: { allocated: 12, used: 1 }, annual: { allocated: 15, used: 8 } },
  { employee: "Karthik Rao", casual: { allocated: 12, used: 6 }, sick: { allocated: 12, used: 4 }, annual: { allocated: 15, used: 10 } },
  { employee: "Rohit Sharma", casual: { allocated: 12, used: 5 }, sick: { allocated: 12, used: 8 }, annual: { allocated: 15, used: 2 } },
];

const POLICIES = [
  { type: "Casual Leave", allocated: 12, carryForward: 6, encashable: false, notice: "1 day" },
  { type: "Sick Leave", allocated: 12, carryForward: 12, encashable: false, notice: "Same day" },
  { type: "Annual Leave", allocated: 15, carryForward: 30, encashable: true, notice: "5 days" },
  { type: "Maternity Leave", allocated: 84, carryForward: 0, encashable: false, notice: "30 days" },
  { type: "Paternity Leave", allocated: 15, carryForward: 0, encashable: false, notice: "15 days" },
];

const TYPE_CLS: Record<LeaveType, string> = {
  Casual: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  Sick: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  Annual: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Maternity: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  Paternity: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const STATUS_CLS: Record<LeaveStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

const TEAM_LEAVE = REQUESTS.filter((r) => r.status === "Approved" || r.status === "Pending").slice(0, 6);

export function EmployerLeaveManagement() {
  const [requests, setRequests] = React.useState<LeaveRequest[]>(REQUESTS);
  const [applyOpen, setApplyOpen] = React.useState(false);
  const [emp, setEmp] = React.useState("");
  const [type, setType] = React.useState<LeaveType>("Casual");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [reason, setReason] = React.useState("");

  const pending = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;

  const act = (id: string, action: "Approved" | "Rejected") => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
    toast.success(`Leave ${action.toLowerCase()}`, { description: action === "Approved" ? "Employee has been notified." : "Employee has been notified of rejection." });
  };

  const applyLeave = () => {
    if (!emp || !start || !end) { toast.error("Please fill all required fields"); return; }
    const days = Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / DAY) + 1);
    const newReq: LeaveRequest = {
      id: `lr${Date.now()}`, employee: emp, type, startDate: start, endDate: end, days,
      reason: reason || "—", status: "Pending",
    };
    setRequests([newReq, ...requests]);
    toast.success("Leave applied", { description: `${days} day(s) of ${type} leave submitted for approval.` });
    setApplyOpen(false); setEmp(""); setType("Casual"); setStart(""); setEnd(""); setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Approve leave requests, track team leave balances, view team calendars and configure leave policies."
        icon={<Icon name="CalendarOff" className="h-6 w-6" />}
        actions={[
          { label: "Apply leave", variant: "default", onClick: () => setApplyOpen(true) },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approvals" value={pending} icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Approved" value={approved} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<Icon name="X" className="h-4 w-4" />} tone="danger" />
        <StatCard label="Total requests" value={requests.length} icon={<Icon name="CalendarOff" className="h-4 w-4" />} tone="brand" />
      </div>

      <Tabs defaultValue="approvals">
        <TabsList className="flex-wrap">
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="mt-4">
          <SectionCard title="Pending approvals" description="Leave requests awaiting your decision">
            {requests.filter((r) => r.status === "Pending").length === 0 ? (
              <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No pending approvals" description="All leave requests have been processed." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Employee</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Start</th>
                      <th className="px-3 py-2 font-medium">End</th>
                      <th className="px-3 py-2 font-medium">Days</th>
                      <th className="px-3 py-2 font-medium">Reason</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter((r) => r.status === "Pending").map((r) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium">{r.employee}</td>
                        <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_CLS[r.type]}`}>{r.type}</span></td>
                        <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{formatDate(r.startDate)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{formatDate(r.endDate)}</td>
                        <td className="px-3 py-2 font-semibold">{r.days}</td>
                        <td className="px-3 py-2 text-muted-foreground max-w-[200px] truncate">{r.reason}</td>
                        <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span></td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-emerald-600 border-emerald-500/30" onClick={() => act(r.id, "Approved")}>
                              <Icon name="Check" className="mr-1 h-3 w-3" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-rose-600 border-rose-500/30" onClick={() => act(r.id, "Rejected")}>
                              <Icon name="X" className="mr-1 h-3 w-3" /> Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="balances" className="mt-4">
          <SectionCard title="Leave balances" description="Allocated, used and remaining leaves per employee">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Employee</th>
                    <th className="px-3 py-2 font-medium">Casual</th>
                    <th className="px-3 py-2 font-medium">Sick</th>
                    <th className="px-3 py-2 font-medium">Annual</th>
                    <th className="px-3 py-2 font-medium">Total remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {BALANCES.map((b) => {
                    const remC = b.casual.allocated - b.casual.used;
                    const remS = b.sick.allocated - b.sick.used;
                    const remA = b.annual.allocated - b.annual.used;
                    const totalRem = remC + remS + remA;
                    return (
                      <tr key={b.employee} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium">{b.employee}</td>
                        <td className="px-3 py-2 text-muted-foreground">{remC}/{b.casual.allocated}</td>
                        <td className="px-3 py-2 text-muted-foreground">{remS}/{b.sick.allocated}</td>
                        <td className="px-3 py-2 text-muted-foreground">{remA}/{b.annual.allocated}</td>
                        <td className="px-3 py-2"><Badge variant="outline" className={totalRem > 15 ? "border-emerald-500/30 text-emerald-600" : totalRem < 8 ? "border-amber-500/30 text-amber-600" : ""}>{totalRem} days</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <SectionCard title="Team leave calendar" description="Upcoming planned and approved leaves">
            {TEAM_LEAVE.length === 0 ? (
              <EmptyState icon={<Icon name="Calendar" className="h-5 w-5" />} title="No upcoming leaves" description="No team members have planned leaves." />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto scroll-thin pr-1">
                {TEAM_LEAVE.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <AvatarLogo text={r.employee} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.employee}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.startDate)} → {formatDate(r.endDate)} · {r.days} day(s)</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_CLS[r.type]}`}>{r.type}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[r.status]}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <SectionCard title="Leave policy settings" description="Configured leave types and allocation rules">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Allocated/yr</th>
                    <th className="px-3 py-2 font-medium">Carry forward</th>
                    <th className="px-3 py-2 font-medium">Encashable</th>
                    <th className="px-3 py-2 font-medium">Min notice</th>
                  </tr>
                </thead>
                <tbody>
                  {POLICIES.map((p) => (
                    <tr key={p.type} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-3 py-2 font-medium">{p.type}</td>
                      <td className="px-3 py-2">{p.allocated} days</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.carryForward} days</td>
                      <td className="px-3 py-2"><Badge variant={p.encashable ? "default" : "outline"}>{p.encashable ? "Yes" : "No"}</Badge></td>
                      <td className="px-3 py-2 text-muted-foreground">{p.notice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply leave on behalf</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <Select value={emp} onValueChange={setEmp}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {BALANCES.map((b) => (
                    <SelectItem key={b.employee} value={b.employee}>{b.employee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Leave type</Label>
              <Select value={type} onValueChange={(v) => setType(v as LeaveType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Casual", "Sick", "Annual", "Maternity", "Paternity"] as LeaveType[]).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>End date</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason for leave" rows={2} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
              <Button onClick={applyLeave}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
