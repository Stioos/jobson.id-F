"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Wallet, TrendingUp, AlertTriangle, CalendarClock, CreditCard, Plus, Download,
} from "lucide-react";

interface FeeRecord {
  id: string;
  student: string;
  course: string;
  totalFee: number;
  paid: number;
  dueDate: string;
  installments: { id: string; label: string; amount: number; dueDate: string; status: "paid" | "pending" | "overdue" }[];
}

const SEED: FeeRecord[] = [
  {
    id: "f1", student: "Aarav Sharma", course: "Full-Stack Developer Bootcamp", totalFee: 85000, paid: 85000, dueDate: "2024-08-15",
    installments: [
      { id: "i1", label: "Installment 1", amount: 30000, dueDate: "2024-06-15", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 30000, dueDate: "2024-07-15", status: "paid" },
      { id: "i3", label: "Installment 3", amount: 25000, dueDate: "2024-08-15", status: "paid" },
    ],
  },
  {
    id: "f2", student: "Diya Patel", course: "Data Science Pro", totalFee: 95000, paid: 50000, dueDate: "2024-08-20",
    installments: [
      { id: "i1", label: "Installment 1", amount: 30000, dueDate: "2024-06-20", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 20000, dueDate: "2024-07-20", status: "paid" },
      { id: "i3", label: "Installment 3", amount: 25000, dueDate: "2024-08-20", status: "pending" },
      { id: "i4", label: "Installment 4", amount: 20000, dueDate: "2024-09-20", status: "pending" },
    ],
  },
  {
    id: "f3", student: "Vivaan Reddy", course: "Cloud Engineering", totalFee: 75000, paid: 25000, dueDate: "2024-07-30",
    installments: [
      { id: "i1", label: "Installment 1", amount: 25000, dueDate: "2024-06-30", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 25000, dueDate: "2024-07-30", status: "overdue" },
      { id: "i3", label: "Installment 3", amount: 25000, dueDate: "2024-08-30", status: "pending" },
    ],
  },
  {
    id: "f4", student: "Ananya Iyer", course: "UI/UX Design", totalFee: 65000, paid: 0, dueDate: "2024-08-25",
    installments: [
      { id: "i1", label: "Full Payment", amount: 65000, dueDate: "2024-08-25", status: "pending" },
    ],
  },
  {
    id: "f5", student: "Reyansh Gupta", course: "Full-Stack Developer Bootcamp", totalFee: 85000, paid: 60000, dueDate: "2024-09-05",
    installments: [
      { id: "i1", label: "Installment 1", amount: 30000, dueDate: "2024-06-05", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 30000, dueDate: "2024-07-05", status: "paid" },
      { id: "i3", label: "Installment 3", amount: 25000, dueDate: "2024-09-05", status: "pending" },
    ],
  },
  {
    id: "f6", student: "Ishaan Mehta", course: "Data Science Pro", totalFee: 95000, paid: 95000, dueDate: "2024-08-10",
    installments: [
      { id: "i1", label: "Full Payment", amount: 95000, dueDate: "2024-08-10", status: "paid" },
    ],
  },
  {
    id: "f7", student: "Saanvi Nair", course: "Cloud Engineering", totalFee: 75000, paid: 40000, dueDate: "2024-08-12",
    installments: [
      { id: "i1", label: "Installment 1", amount: 25000, dueDate: "2024-06-12", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 15000, dueDate: "2024-07-12", status: "paid" },
      { id: "i3", label: "Installment 3", amount: 20000, dueDate: "2024-08-12", status: "pending" },
      { id: "i4", label: "Installment 4", amount: 15000, dueDate: "2024-09-12", status: "pending" },
    ],
  },
  {
    id: "f8", student: "Arjun Kumar", course: "DevOps Specialist", totalFee: 80000, paid: 20000, dueDate: "2024-07-25",
    installments: [
      { id: "i1", label: "Installment 1", amount: 20000, dueDate: "2024-06-25", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 30000, dueDate: "2024-07-25", status: "overdue" },
      { id: "i3", label: "Installment 3", amount: 30000, dueDate: "2024-08-25", status: "pending" },
    ],
  },
  {
    id: "f9", student: "Myra Singh", course: "UI/UX Design", totalFee: 65000, paid: 65000, dueDate: "2024-08-08",
    installments: [{ id: "i1", label: "Full Payment", amount: 65000, dueDate: "2024-08-08", status: "paid" }],
  },
  {
    id: "f10", student: "Kabir Joshi", course: "DevOps Specialist", totalFee: 80000, paid: 45000, dueDate: "2024-09-10",
    installments: [
      { id: "i1", label: "Installment 1", amount: 25000, dueDate: "2024-06-10", status: "paid" },
      { id: "i2", label: "Installment 2", amount: 20000, dueDate: "2024-07-10", status: "paid" },
      { id: "i3", label: "Installment 3", amount: 35000, dueDate: "2024-09-10", status: "pending" },
    ],
  },
];

function feeStatus(rec: FeeRecord): "paid" | "partial" | "overdue" | "pending" {
  if (rec.paid >= rec.totalFee) return "paid";
  const hasOverdue = rec.installments.some((i) => i.status === "overdue");
  if (hasOverdue) return "overdue";
  if (rec.paid > 0) return "partial";
  return "pending";
}

export function TrainingFeeCollection() {
  const [rows, setRows] = React.useState<FeeRecord[]>(SEED);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [payOpen, setPayOpen] = React.useState(false);
  const [active, setActive] = React.useState<FeeRecord | null>(null);
  const [payAmount, setPayAmount] = React.useState("");
  const [payMethod, setPayMethod] = React.useState("upi");

  const filtered = rows.filter((r) => {
    const status = feeStatus(r);
    const matchStatus = statusFilter === "all" || status === statusFilter;
    const matchSearch = r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalCollected = rows.reduce((a, r) => a + r.paid, 0);
  const outstanding = rows.reduce((a, r) => a + Math.max(0, r.totalFee - r.paid), 0);
  const overdue = rows
    .filter((r) => feeStatus(r) === "overdue")
    .reduce((a, r) => a + Math.max(0, r.totalFee - r.paid), 0);
  const now = new Date();
  const thisMonth = rows.reduce((a, r) => {
    // Mock: assume last installment paid this month for demo
    const lastPaid = [...r.installments].reverse().find((i) => i.status === "paid");
    if (lastPaid && new Date(lastPaid.dueDate).getMonth() === now.getMonth()) return a + lastPaid.amount;
    return a;
  }, 0);

  function openPay(rec: FeeRecord) {
    setActive(rec);
    const balance = rec.totalFee - rec.paid;
    setPayAmount(String(balance));
    setPayMethod("upi");
    setPayOpen(true);
  }

  function recordPayment() {
    if (!active) return;
    const amt = Number(payAmount) || 0;
    if (amt <= 0) { toast.error("Enter a valid amount"); return; }
    const balance = active.totalFee - active.paid;
    if (amt > balance) { toast.error("Amount exceeds outstanding balance"); return; }
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== active.id) return r;
        const newPaid = r.paid + amt;
        // Apply to first pending/overdue installment
        const installments = r.installments.map((i) => {
          if (amt > 0 && (i.status === "pending" || i.status === "overdue")) {
            return { ...i, status: "paid" as const };
          }
          return i;
        });
        return { ...r, paid: newPaid, installments };
      })
    );
    toast.success("Payment recorded", {
      description: `${formatCurrency(amt)} from ${active.student} via ${payMethod.toUpperCase()}`,
    });
    setPayOpen(false);
    setActive(null);
  }

  function sendReminder(rec: FeeRecord) {
    toast.success("Reminder sent", { description: `Payment reminder sent to ${rec.student}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fee Collection Center"
        description="Track student fee payments, installments, and outstanding balances across cohorts."
        icon={<Icon name="Wallet" className="h-6 w-6" />}
        actions={[
          { label: "Export", icon: "Download", variant: "outline", onClick: () => toast.success("Fee report exported") },
          { label: "New invoice", icon: "Plus", onClick: () => toast.success("Invoice draft created") },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Collected" value={formatCurrency(totalCollected)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(overdue)} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} icon={<CalendarClock className="h-5 w-5" />} tone="success" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-[260px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard title="Student Fees">
        {filtered.length === 0 ? (
          <EmptyState icon={<Wallet className="h-5 w-5" />} title="No fee records found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Total Fee</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const balance = r.totalFee - r.paid;
                  const pct = Math.round((r.paid / r.totalFee) * 100);
                  const status = feeStatus(r);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={r.student} size="xs" />
                          <span className="text-sm font-medium">{r.student}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{r.course}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(r.totalFee)}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-emerald-700">{formatCurrency(r.paid)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{formatCurrency(balance)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(r.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-[100px]">
                          <Progress value={pct} className="h-1.5" />
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {balance > 0 && (
                            <Button size="sm" variant="outline" onClick={() => sendReminder(r)}>Remind</Button>
                          )}
                          <Button size="sm" onClick={() => openPay(r)}>
                            <CreditCard className="h-3.5 w-3.5 mr-1" /> Record
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Installment Plan View" description="Drill into individual payment schedules.">
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.slice(0, 4).map((r) => (
            <div key={r.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={r.student} size="xs" />
                  <span className="text-sm font-medium">{r.student}</span>
                </div>
                <Badge variant="outline">{r.installments.length} installment(s)</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {r.installments.map((i) => (
                  <div key={i.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{i.label}</span>
                    <span className="font-medium">{formatCurrency(i.amount)}</span>
                    <span className="text-muted-foreground">{formatDate(i.dueDate)}</span>
                    <StatusBadge status={i.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {active && `From ${active.student} for ${active.course}`}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border p-2">
                  <p className="text-[10px] text-muted-foreground">Total</p>
                  <p className="text-sm font-semibold">{formatCurrency(active.totalFee)}</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-[10px] text-muted-foreground">Paid</p>
                  <p className="text-sm font-semibold text-emerald-700">{formatCurrency(active.paid)}</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-[10px] text-muted-foreground">Balance</p>
                  <p className="text-sm font-semibold text-amber-700">{formatCurrency(active.totalFee - active.paid)}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="pay-amount">Amount (₹)</Label>
                <Input id="pay-amount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Payment method</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={recordPayment}>Record payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
