"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { ReceiptText, Plus, AlertTriangle, Banknote, CheckCircle2, Clock } from "lucide-react";

interface FeeRecord {
  id: string;
  student: string;
  program: string;
  totalFee: number;
  paid: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
}

const STUDENT_NAMES = ["Aarav Sharma", "Divya Lakshmi", "Karthik Reddy", "Priya Menon", "Rahul Nair", "Meera Iyer", "Sanjay Gupta", "Anjali Krishnan", "Vikram Singh", "Lakshmi Priya", "Arjun Iyer", "Kavya Reddy"];
const PROGRAMS = ["Full-Stack Engineering Program", "Data Science & Analytics", "Cloud & DevOps Engineering", "Digital Marketing Mastery", "Cybersecurity Essentials"];

function buildFees(): FeeRecord[] {
  return STUDENT_NAMES.map((name, i) => {
    const total = 25000 + (i % 5) * 8000;
    const paidRatios = [1, 0.5, 0.75, 0, 0.3];
    const paid = Math.round((total * paidRatios[i % paidRatios.length]) / 100) * 100;
    const dueOffset = -10 + i * 5; // some overdue, some upcoming
    const due = new Date(Date.now() + dueOffset * 86400000).toISOString();
    let status: FeeRecord["status"] = "pending";
    if (paid >= total) status = "paid";
    else if (paid > 0) status = daysUntil(due) < 0 ? "overdue" : "partial";
    else status = daysUntil(due) < 0 ? "overdue" : "pending";
    return {
      id: `fee_${String(i + 1).padStart(3, "0")}`,
      student: name,
      program: PROGRAMS[i % PROGRAMS.length],
      totalFee: total,
      paid,
      dueDate: due,
      status,
    };
  });
}

export function PartnerFees() {
  const partner = CURRENT_PARTNER;
  const [fees, setFees] = React.useState<FeeRecord[]>(buildFees());
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [collectOpen, setCollectOpen] = React.useState(false);
  const [selectedFee, setSelectedFee] = React.useState<FeeRecord | null>(null);

  const filtered = fees.filter((f) => statusFilter === "all" || f.status === statusFilter);

  const totalFees = fees.reduce((s, f) => s + f.totalFee, 0);
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0);
  const totalPending = totalFees - totalCollected;
  const overdueCount = fees.filter((f) => f.status === "overdue").length;

  const trend = [
    { month: "May", collected: 320000 },
    { month: "Jun", collected: 380000 },
    { month: "Jul", collected: 410000 },
    { month: "Aug", collected: 480000 },
    { month: "Sep", collected: 520000 },
    { month: "Oct", collected: 580000 },
  ];

  function openCollect(f: FeeRecord) {
    setSelectedFee(f);
    setCollectOpen(true);
  }

  function handleCollect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    if (!selectedFee) return;
    setFees((prev) => prev.map((f) => {
      if (f.id !== selectedFee.id) return f;
      const newPaid = Math.min(f.paid + amount, f.totalFee);
      const status: FeeRecord["status"] = newPaid >= f.totalFee ? "paid" : newPaid > 0 ? "partial" : "pending";
      return { ...f, paid: newPaid, status };
    }));
    setCollectOpen(false);
    toast.success("Fee collected", { description: `${formatCurrency(amount)} from ${selectedFee.student}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees & Collections"
        description={`${partner.name} — student fee management (CENTRE model).`}
        icon={<Icon name="ReceiptText" className="h-6 w-6" />}
        actions={[
          { label: "Collect Fee", icon: "Plus", onClick: () => { setSelectedFee(null); setCollectOpen(true); } },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Fees" value={formatCurrency(totalFees)} icon={<ReceiptText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Collected" value={formatCurrency(totalCollected)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending" value={formatCurrency(totalPending)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={overdueCount} icon={<AlertTriangle className="h-5 w-5" />} tone={overdueCount > 0 ? "danger" : "default"} />
      </div>

      {overdueCount > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{overdueCount} fee(s) overdue</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fees.filter((f) => f.status === "overdue").map((f) => f.student).join(", ")}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent to all overdue students")}>Send Reminders</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ChartCard title="Fee Collection Trend" description="Monthly collected fees (6 months)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(Number(v))} width={70} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2} fill="url(#feeGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead className="text-right">Total Fee</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No fee records.</TableCell></TableRow>
                ) : filtered.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={f.student} size="sm" />
                        <p className="font-medium">{f.student}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{f.program}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.totalFee)}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(f.paid)}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-amber-600 dark:text-amber-400">{formatCurrency(f.totalFee - f.paid)}</TableCell>
                    <TableCell className="text-sm">
                      <span className={f.status === "overdue" ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>{formatDate(f.dueDate)}</span>
                    </TableCell>
                    <TableCell><StatusBadge status={f.status} /></TableCell>
                    <TableCell>
                      {f.status !== "paid" && (
                        <Button size="sm" variant="outline" onClick={() => openCollect(f)}>
                          <Banknote className="h-3.5 w-3.5 mr-1.5" /> Collect
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={collectOpen} onOpenChange={setCollectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Fee</DialogTitle>
            <DialogDescription>{selectedFee ? `From ${selectedFee.student} · ${selectedFee.program}` : "Record a fee payment from a student."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCollect} className="space-y-3">
            {!selectedFee && (
              <div className="space-y-1.5">
                <Label htmlFor="student">Student</Label>
                <Select name="student" defaultValue={fees[0]?.id}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fees.filter((f) => f.status !== "paid").map((f) => <SelectItem key={f.id} value={f.id}>{f.student}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" name="amount" type="number" min={1} required defaultValue={selectedFee ? selectedFee.totalFee - selectedFee.paid : 0} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="method">Payment Method</Label>
              <Select name="method" defaultValue="upi">
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCollectOpen(false)}>Cancel</Button>
              <Button type="submit">Collect</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
