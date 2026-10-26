"use client";

import * as React from "react";
import { Receipt, Download, Plus, IndianRupee, Send } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { agencyInvoices as initialInvoices, placements, type AgencyInvoice } from "@/lib/portal-data";

export function RecruiterInvoices() {
  const [invoices, setInvoices] = React.useState<AgencyInvoice[]>(initialInvoices);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [genOpen, setGenOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<AgencyInvoice | null>(null);
  const [markPaid, setMarkPaid] = React.useState<AgencyInvoice | null>(null);

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!inv.number.toLowerCase().includes(q) && !inv.clientName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = invoices.reduce((a, i) => a + i.total, 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((a, i) => a + i.total, 0);
  const outstanding = invoices.filter((i) => i.status === "pending" || i.status === "overdue").reduce((a, i) => a + i.total, 0);
  const overdue = invoices.filter((i) => i.status === "overdue" || i.status === "disputed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client invoices"
        description="Agency receivables from clients. Generate invoices for completed placements, track payments, and download PDFs."
        actions={[{ label: "Generate invoice", onClick: () => setGenOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total invoiced" value={formatCurrency(total)} icon={<Receipt className="h-5 w-5" />} tone="brand" />
        <StatCard label="Paid" value={formatCurrency(paid)} icon={<IndianRupee className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={<Receipt className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue / disputed" value={overdue} icon={<Receipt className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard
        title="Invoices"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search number/client…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices match" description="Generate your first invoice for a placement." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell">Issued</TableHead>
                  <TableHead className="hidden md:table-cell">Due</TableHead>
                  <TableHead className="hidden lg:table-cell">Paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id} className="cursor-pointer" onClick={() => setDetail(inv)}>
                    <TableCell className="font-mono text-xs font-medium">{inv.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={inv.clientName} size="xs" />
                        <span className="text-sm">{inv.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(inv.tax)}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(inv.total)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(inv.issueDate)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{inv.paidDate ? formatDate(inv.paidDate) : "—"}</TableCell>
                    <TableCell><StatusBadge status={inv.status === "disputed" ? "overdue" : inv.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="font-semibold">Total ({filtered.length})</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(filtered.reduce((a, i) => a + i.total, 0))}</TableCell>
                  <TableCell colSpan={4} />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <AvatarLogo text={detail.clientName} size="md" />
                  <div>
                    <div className="font-mono text-base font-semibold">{detail.number}</div>
                    <div className="text-xs text-muted-foreground">{detail.clientName}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Invoice details</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={detail.status === "disputed" ? "overdue" : detail.status} />
                  {detail.gstin && <Badge variant="outline">GSTIN: {detail.gstin}</Badge>}
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <dl className="grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Issued</dt>
                    <dd className="text-right">{formatDate(detail.issueDate)}</dd>
                    <dt className="text-muted-foreground">Due</dt>
                    <dd className="text-right">{formatDate(detail.dueDate)}</dd>
                    {detail.paidDate && (
                      <>
                        <dt className="text-muted-foreground">Paid</dt>
                        <dd className="text-right text-emerald-600 font-medium">{formatDate(detail.paidDate)}</dd>
                      </>
                    )}
                  </dl>
                  <dl className="mt-3 border-t pt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="text-right">{formatCurrency(detail.amount)}</dd>
                    <dt className="text-muted-foreground">GST (18%)</dt>
                    <dd className="text-right">{formatCurrency(detail.tax)}</dd>
                    <dt className="font-semibold border-t pt-2">Total</dt>
                    <dd className="text-right font-bold border-t pt-2">{formatCurrency(detail.total)}</dd>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Linked placements</h4>
                  <ul className="mt-2 space-y-2">
                    {detail.placements.map((pid) => {
                      const p = placements.find((x) => x.id === pid);
                      if (!p) return null;
                      return (
                        <li key={pid} className="flex items-center justify-between rounded-lg border p-2 text-xs">
                          <div>
                            <p className="font-medium">{p.candidateName}</p>
                            <p className="text-muted-foreground">{p.jobTitle}</p>
                          </div>
                          <span className="font-semibold">{formatCurrency(p.commissionAmount)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success("PDF downloaded", { description: detail.number })}>
                    <Download className="mr-1 h-3.5 w-3.5" /> Download PDF
                  </Button>
                  {detail.status !== "paid" && (
                    <Button size="sm" onClick={() => setMarkPaid(detail)}>
                      <IndianRupee className="mr-1 h-3.5 w-3.5" /> Mark paid
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Reminder sent", { description: `To ${detail.clientName}` })}>
                    <Send className="mr-1 h-3.5 w-3.5" /> Send reminder
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <GenerateInvoiceDialog
        open={genOpen}
        onOpenChange={setGenOpen}
        onGenerate={(placementId) => {
          const p = placements.find((x) => x.id === placementId);
          if (!p) return;
          const newInv: AgencyInvoice = {
            id: `aginv_new_${Date.now()}`,
            number: `INV-AG-${1002 + invoices.length}`,
            clientId: p.clientId,
            clientName: p.clientName,
            clientLogo: p.clientLogo,
            amount: p.commissionAmount,
            tax: Math.round(p.commissionAmount * 0.18),
            total: Math.round(p.commissionAmount * 1.18),
            status: "pending",
            issueDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
            placements: [p.id],
          };
          setInvoices((prev) => [newInv, ...prev]);
          setGenOpen(false);
          toast.success("Invoice generated", { description: `${newInv.number} → ${p.clientName}` });
        }}
      />

      <AlertDialog open={!!markPaid} onOpenChange={(v) => !v && setMarkPaid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark invoice as paid?</AlertDialogTitle>
            <AlertDialogDescription>
              {markPaid && <>Confirm payment received for <strong>{markPaid.number}</strong> ({formatCurrency(markPaid.total)} from {markPaid.clientName}).</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (markPaid) {
                  setInvoices((prev) => prev.map((i) => i.id === markPaid.id ? { ...i, status: "paid", paidDate: new Date().toISOString() } : i));
                  setDetail(null);
                  toast.success("Invoice marked paid", { description: markPaid.number });
                }
                setMarkPaid(null);
              }}
            >
              Confirm paid
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GenerateInvoiceDialog({
  open, onOpenChange, onGenerate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onGenerate: (placementId: string) => void;
}) {
  const [placementId, setPlacementId] = React.useState("");
  const unpaidPlacements = placements.filter((p) => p.invoiceStatus === "earned" || p.invoiceStatus === "invoiced");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate invoice</DialogTitle>
          <DialogDescription>Select a placement to bill the client. GST (18%) is applied automatically.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Placement</Label>
            <Select value={placementId} onValueChange={setPlacementId}>
              <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
              <SelectContent>
                {unpaidPlacements.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.candidateName} → {p.clientName} ({formatCurrency(p.commissionAmount)})
                  </SelectItem>
                ))}
                {unpaidPlacements.length === 0 && <SelectItem value="_" disabled>No uninvoiced placements</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          {placementId && placementId !== "_" && (() => {
            const p = placements.find((x) => x.id === placementId);
            if (!p) return null;
            const tax = Math.round(p.commissionAmount * 0.18);
            return (
              <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                <dl className="grid grid-cols-2 gap-y-1">
                  <dt className="text-muted-foreground">Commission</dt>
                  <dd className="text-right">{formatCurrency(p.commissionAmount)}</dd>
                  <dt className="text-muted-foreground">GST (18%)</dt>
                  <dd className="text-right">{formatCurrency(tax)}</dd>
                  <dt className="font-semibold border-t pt-1">Total</dt>
                  <dd className="text-right font-bold border-t pt-1">{formatCurrency(p.commissionAmount + tax)}</dd>
                </dl>
              </div>
            );
          })()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!placementId || placementId === "_"} onClick={() => onGenerate(placementId)}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
