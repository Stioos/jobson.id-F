"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { Search, Download, FileText, Wallet, AlertTriangle, Clock } from "lucide-react";

type InvoiceStatus = "Paid" | "Due" | "Overdue";

interface Invoice {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
}

const DAY = 86400000;
const now = Date.now();

const INVOICES: Invoice[] = [
  { id: "1", number: "INV-2024-001", date: new Date(now - 5 * DAY).toISOString(), description: "Talent Search Credits — 500 profiles", amount: 50000, status: "Paid" },
  { id: "2", number: "INV-2024-002", date: new Date(now - 25 * DAY).toISOString(), description: "Annual Subscription — Business Plan", amount: 240000, status: "Paid" },
  { id: "3", number: "INV-2024-003", date: new Date(now - 10 * DAY).toISOString(), description: "Featured Job Posting — 3 jobs", amount: 15000, status: "Due" },
  { id: "4", number: "INV-2024-004", date: new Date(now - 75 * DAY).toISOString(), description: "Background Verification Package", amount: 18000, status: "Overdue" },
  { id: "5", number: "INV-2024-005", date: new Date(now - 15 * DAY).toISOString(), description: "Assessment Credits — 200 attempts", amount: 12000, status: "Paid" },
  { id: "6", number: "INV-2024-006", date: new Date(now - 3 * DAY).toISOString(), description: "Talent Solutions — 1 hire", amount: 150000, status: "Due" },
  { id: "7", number: "INV-2024-007", date: new Date(now - 45 * DAY).toISOString(), description: "Training Seat Subscriptions × 25", amount: 62000, status: "Paid" },
  { id: "8", number: "INV-2024-008", date: new Date(now - 70 * DAY).toISOString(), description: "Enterprise Add-on — SSO", amount: 36000, status: "Overdue" },
  { id: "9", number: "INV-2024-009", date: new Date(now - 8 * DAY).toISOString(), description: "Branding Kit — Career Page", amount: 9500, status: "Due" },
  { id: "10", number: "INV-2024-010", date: new Date(now - 35 * DAY).toISOString(), description: "Premium Support Plan — Annual", amount: 84000, status: "Paid" },
];

const STATUS_CLS: Record<InvoiceStatus, string> = {
  "Paid": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Due": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Overdue": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

function ageDays(dateStr: string): number {
  return Math.floor((now - new Date(dateStr).getTime()) / DAY);
}

export function EmployerInvoices() {
  const [tab, setTab] = React.useState<"all" | InvoiceStatus>("all");
  const [q, setQ] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "amount">("date");

  const filtered = INVOICES
    .filter((i) => tab === "all" || i.status === tab)
    .filter((i) => q.trim() === "" || i.number.toLowerCase().includes(q.toLowerCase()) || i.description.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sortBy === "date" ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.amount - a.amount);

  const totalPaid = INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalDue = INVOICES.filter((i) => i.status === "Due").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = INVOICES.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  const aging = {
    bucket1: INVOICES.filter((i) => i.status !== "Paid" && ageDays(i.date) <= 30),
    bucket2: INVOICES.filter((i) => i.status !== "Paid" && ageDays(i.date) > 30 && ageDays(i.date) <= 60),
    bucket3: INVOICES.filter((i) => i.status !== "Paid" && ageDays(i.date) > 60),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View and download all billing invoices. Track paid, due and overdue balances with aging analysis."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={<Wallet className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Due" value={formatCurrency(totalDue)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(totalOverdue)} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Aging analysis" description="Outstanding amounts bucketed by age">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-medium uppercase text-muted-foreground">0–30 days</div>
            <div className="mt-1 text-xl font-semibold text-emerald-600">{formatCurrency(aging.bucket1.reduce((s, i) => s + i.amount, 0))}</div>
            <div className="mt-1 text-xs text-muted-foreground">{aging.bucket1.length} invoice{aging.bucket1.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-medium uppercase text-muted-foreground">31–60 days</div>
            <div className="mt-1 text-xl font-semibold text-amber-600">{formatCurrency(aging.bucket2.reduce((s, i) => s + i.amount, 0))}</div>
            <div className="mt-1 text-xs text-muted-foreground">{aging.bucket2.length} invoice{aging.bucket2.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="text-xs font-medium uppercase text-muted-foreground">60+ days</div>
            <div className="mt-1 text-xl font-semibold text-rose-600">{formatCurrency(aging.bucket3.reduce((s, i) => s + i.amount, 0))}</div>
            <div className="mt-1 text-xs text-muted-foreground">{aging.bucket3.length} invoice{aging.bucket3.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="All invoices" description={`${filtered.length} of ${INVOICES.length} invoices`}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Paid">Paid</TabsTrigger>
              <TabsTrigger value="Due">Due</TabsTrigger>
              <TabsTrigger value="Overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search invoice # or description" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest first</SelectItem>
              <SelectItem value="amount">Highest amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No invoices" description="Try adjusting filters or search." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium text-sm">{i.number}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(i.date)}</TableCell>
                    <TableCell className="text-sm">{i.description}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(i.amount)}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[i.status]}`}>{i.status}</span></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${i.number}`)}>
                        <Download className="mr-1 h-3 w-3" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
