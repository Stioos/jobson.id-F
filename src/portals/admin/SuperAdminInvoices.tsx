"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface Invoice {
  id: string; portal: string; client: string; amount: number; gst: number; status: string; date: string;
}

const INVOICES: Invoice[] = [
  { id: "INV-2024-0912", portal: "employer", client: "TechCorp India", amount: 49_999, gst: 9_000, status: "paid", date: "2024-09-21" },
  { id: "INV-2024-0911", portal: "employer", client: "NaukriX Pvt Ltd", amount: 19_999, gst: 3_600, status: "paid", date: "2024-09-20" },
  { id: "INV-2024-0910", portal: "recruiter", client: "TalentBridge Consulting", amount: 25_000, gst: 4_500, status: "paid", date: "2024-09-19" },
  { id: "INV-2024-0909", portal: "training", client: "Apex Skill Academy", amount: 12_400, gst: 2_232, status: "pending", date: "2024-09-19" },
  { id: "INV-2024-0908", portal: "partner", client: "SouthZone Franchise", amount: 50_000, gst: 9_000, status: "paid", date: "2024-09-18" },
  { id: "INV-2024-0907", portal: "employer", client: "FinEdge Solutions", amount: 19_999, gst: 3_600, status: "overdue", date: "2024-09-10" },
  { id: "INV-2024-0906", portal: "training", client: "EduFirst Institute", amount: 8_400, gst: 1_512, status: "paid", date: "2024-09-15" },
  { id: "INV-2024-0905", portal: "recruiter", client: "HireRight India", amount: 18_000, gst: 3_240, status: "pending", date: "2024-09-14" },
];

export function SuperAdminInvoices() {
  const [search, setSearch] = React.useState("");
  const filtered = INVOICES.filter(i => {
    const s = search.toLowerCase();
    return !s || i.id.toLowerCase().includes(s) || i.client.toLowerCase().includes(s);
  });

  const totalAmount = INVOICES.reduce((s, i) => s + i.amount, 0);
  const totalGst = INVOICES.reduce((s, i) => s + i.gst, 0);

  const statusBadge = (s: string) => {
    const cls = s === "paid" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Invoices"
        description="Every invoice issued across the platform with GST breakdown and downloadable PDFs."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Export GST", variant: "outline", onClick: () => toast.success("GST report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Invoices" value={INVOICES.length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Billed" value={formatCurrency(totalAmount + totalGst)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="success" />
        <StatCard label="GST Collected" value={formatCurrency(totalGst)} icon={<Icon name="ReceiptText" className="h-5 w-5" />} />
        <StatCard label="Overdue" value={INVOICES.filter(i => i.status === "overdue").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Invoice List" description={`${filtered.length} of ${INVOICES.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice # or client…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>GST (18%)</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="font-medium">{i.client}</TableCell>
                  <TableCell><Badge variant="outline">{i.portal}</Badge></TableCell>
                  <TableCell className="text-xs">{formatDate(i.date)}</TableCell>
                  <TableCell>{formatCurrency(i.amount)}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(i.gst)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(i.amount + i.gst)}</TableCell>
                  <TableCell>{statusBadge(i.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${i.id}.pdf`)}>
                      <Icon name="Download" className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
