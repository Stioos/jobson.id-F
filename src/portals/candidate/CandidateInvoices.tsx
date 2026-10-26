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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";

// ----- Mock invoices -----
type InvoiceStatus = "paid" | "due" | "overdue";

interface Invoice {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  currency: "INR";
  pdfUrl: string;
}

const SEED_INVOICES: Invoice[] = [
  { id: "inv_1", number: "INV-2024-1012", date: "2024-10-25T10:00:00Z", description: "Premium Plan — Monthly subscription", amount: 299, status: "paid", currency: "INR", pdfUrl: "#" },
  { id: "inv_2", number: "INV-2024-1008", date: "2024-10-12T11:30:00Z", description: "Resume Boost — 30 day promotion", amount: 499, status: "paid", currency: "INR", pdfUrl: "#" },
  { id: "inv_3", number: "INV-2024-1005", date: "2024-10-05T09:00:00Z", description: "Featured Profile — 14 day boost", amount: 999, status: "paid", currency: "INR", pdfUrl: "#" },
  { id: "inv_4", number: "INV-2024-1002", date: "2024-09-28T14:00:00Z", description: "Priority Applications — 5 jobs pack", amount: 1499, status: "paid", currency: "INR", pdfUrl: "#" },
  { id: "inv_5", number: "INV-2024-1015", date: "2024-10-22T15:00:00Z", description: "Talent Solutions — Career Coaching (1 session)", amount: 1999, status: "due", currency: "INR", pdfUrl: "#" },
  { id: "inv_6", number: "INV-2024-1014", date: "2024-10-20T16:00:00Z", description: "Mock Interview Pack — 3 sessions", amount: 1299, status: "due", currency: "INR", pdfUrl: "#" },
  { id: "inv_7", number: "INV-2024-0988", date: "2024-09-15T08:30:00Z", description: "Premium Plan — Monthly subscription", amount: 299, status: "overdue", currency: "INR", pdfUrl: "#" },
  { id: "inv_8", number: "INV-2024-0975", date: "2024-09-05T12:00:00Z", description: "Resume Writing Service", amount: 799, status: "paid", currency: "INR", pdfUrl: "#" },
];

const STATUS_TONES: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  due: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  overdue: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function CandidateInvoices() {
  const [statusFilter, setStatusFilter] = React.useState<"all" | InvoiceStatus>("all");
  const [query, setQuery] = React.useState("");

  const filtered = SEED_INVOICES.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!inv.number.toLowerCase().includes(q) && !inv.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalPaid = SEED_INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalDue = SEED_INVOICES.filter((i) => i.status === "due").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = SEED_INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  function download(invoice: Invoice) {
    toast.success("Invoice downloaded", {
      description: `${invoice.number}.pdf (${formatCurrency(invoice.amount, invoice.currency)})`,
    });
  }

  function view(invoice: Invoice) {
    toast.info("Opening invoice preview", { description: invoice.number });
  }

  function payNow(invoice: Invoice) {
    toast.success("Payment initiated", {
      description: `Paying ${formatCurrency(invoice.amount, invoice.currency)} for ${invoice.number}.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View, download, and pay invoices for premium services, subscriptions, and one-time purchases."
        icon={<Icon name="FileText" className="h-6 w-6" />}
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={formatCurrency(totalPaid, "INR")}
          hint={`${SEED_INVOICES.filter((i) => i.status === "paid").length} invoices settled`}
          icon={<Icon name="BadgeCheck" className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Total Due"
          value={formatCurrency(totalDue, "INR")}
          hint={`${SEED_INVOICES.filter((i) => i.status === "due").length} invoices awaiting payment`}
          icon={<Icon name="Clock" className="h-5 w-5" />}
          tone="warning"
        />
        <StatCard
          label="Total Overdue"
          value={formatCurrency(totalOverdue, "INR")}
          hint={`${SEED_INVOICES.filter((i) => i.status === "overdue").length} invoices past due`}
          icon={<Icon name="AlertTriangle" className="h-5 w-5" />}
          tone="danger"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by invoice # or description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="due">Due</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon name="FileText" className="h-5 w-5" />}
          title="No invoices found"
          description="Try adjusting your search or filter to find the invoice you're looking for."
        />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.number}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(inv.date)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm" title={inv.description}>{inv.description}</p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-semibold">
                        {formatCurrency(inv.amount, inv.currency)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_TONES[inv.status]}`}
                        >
                          {inv.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {inv.status !== "paid" && (
                            <Button
                              size="sm"
                              onClick={() => payNow(inv)}
                            >
                              Pay now
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => view(inv)}
                          >
                            <Icon name="Eye" className="mr-1 h-3.5 w-3.5" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => download(inv)}
                            className="h-8 w-8 p-0"
                            aria-label="Download PDF"
                          >
                            <Icon name="Download" className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer note */}
      <SectionCard title="Need help with an invoice?" description="Reach out to our billing team for any invoice-related questions.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            All invoices include GST where applicable. You can download PDF copies for your records.
          </p>
          <Button variant="outline" onClick={() => toast.info("Opening billing support")}>
            <Icon name="LifeBuoy" className="mr-2 h-4 w-4" /> Contact billing
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
