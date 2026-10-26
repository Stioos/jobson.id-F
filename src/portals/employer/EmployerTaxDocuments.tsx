"use client";

import * as React from "react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { Download, FileText, ReceiptText, Receipt, Landmark } from "lucide-react";

type DocKind = "gst" | "tds" | "form16" | "26as";

interface TaxDoc {
  id: string;
  kind: DocKind;
  name: string;
  period: string; // FY label
  date: string;
  amount: number;
  vendor?: string;
}

const FYS = ["FY 2024-25", "FY 2023-24", "FY 2022-23"];

const DOCS: TaxDoc[] = [
  { id: "d1", kind: "gst", name: "GST Invoice — Subscription", period: "FY 2024-25", date: "2024-04-12", amount: 20000, vendor: "Jobsonn Technologies" },
  { id: "d2", kind: "gst", name: "GST Invoice — Credits", period: "FY 2024-25", date: "2024-06-03", amount: 50000, vendor: "Jobsonn Technologies" },
  { id: "d3", kind: "gst", name: "GST Invoice — Talent Solutions", period: "FY 2024-25", date: "2024-08-21", amount: 150000, vendor: "Jobsonn Technologies" },
  { id: "d4", kind: "tds", name: "Form 16A — Q1 FY24-25", period: "FY 2024-25", date: "2024-07-15", amount: 2000, vendor: "Jobsonn Technologies" },
  { id: "d5", kind: "tds", name: "Form 16A — Q2 FY24-25", period: "FY 2024-25", date: "2024-10-20", amount: 2200, vendor: "Jobsonn Technologies" },
  { id: "d6", kind: "form16", name: "Form 16 — Salary FY24-25", period: "FY 2024-25", date: "2024-06-15", amount: 0, vendor: "TechCorp India" },
  { id: "d7", kind: "form16", name: "Form 16 — Salary FY23-24", period: "FY 2023-24", date: "2023-06-12", amount: 0, vendor: "TechCorp India" },
  { id: "d8", kind: "26as", name: "Form 26AS — FY24-25", period: "FY 2024-25", date: "2024-07-30", amount: 18500, vendor: "TRACES" },
];

const KIND_META: Record<DocKind, { label: string; icon: React.ReactNode }> = {
  gst: { label: "GST Invoices", icon: <ReceiptText className="h-4 w-4" /> },
  tds: { label: "TDS Certificates (Form 16A)", icon: <FileText className="h-4 w-4" /> },
  form16: { label: "Form 16", icon: <FileText className="h-4 w-4" /> },
  "26as": { label: "Form 26AS", icon: <Landmark className="h-4 w-4" /> },
};

export function EmployerTaxDocuments() {
  const [fy, setFy] = React.useState("FY 2024-25");
  const [tab, setTab] = React.useState<DocKind>("gst");

  const docsForTab = DOCS.filter((d) => d.kind === tab && d.period === fy);

  const totalGst = DOCS.filter((d) => d.kind === "gst" && d.period === fy).reduce((s, d) => s + d.amount, 0);
  const totalTds = DOCS.filter((d) => d.kind === "tds" && d.period === fy).reduce((s, d) => s + d.amount, 0)
    + DOCS.filter((d) => d.kind === "26as" && d.period === fy).reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Documents"
        description="Download GST invoices, TDS certificates (Form 16A), Form 16 and Form 26AS for any financial year."
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase text-muted-foreground">Financial Year</label>
          <Select value={fy} onValueChange={setFy}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FYS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label={`Total GST paid · ${fy}`} value={formatCurrency(totalGst)} icon={<Receipt className="h-5 w-5" />} tone="brand" />
        <StatCard label={`Total TDS deducted · ${fy}`} value={formatCurrency(totalTds)} icon={<ReceiptText className="h-5 w-5" />} tone="success" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as DocKind)}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="gst" className="gap-1.5"><ReceiptText className="h-3.5 w-3.5" /> GST Invoices</TabsTrigger>
          <TabsTrigger value="tds" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> TDS (Form 16A)</TabsTrigger>
          <TabsTrigger value="form16" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Form 16</TabsTrigger>
          <TabsTrigger value="26as" className="gap-1.5"><Landmark className="h-3.5 w-3.5" /> Form 26AS</TabsTrigger>
        </TabsList>

        {(["gst", "tds", "form16", "26as"] as DocKind[]).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <SectionCard title={KIND_META[k].label} description={`Documents for ${fy}`}>
              {docsForTab.length === 0 ? (
                <EmptyState icon={KIND_META[k].icon} title="No documents" description={`No ${KIND_META[k].label} available for ${fy}.`} />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor / Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {docsForTab.map((d) => (
                        <TableRow key={d.id} className="hover:bg-muted/40">
                          <TableCell className="text-sm font-medium">{d.name}</TableCell>
                          <TableCell className="text-sm"><Badge variant="outline" className="text-xs">{d.period}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(d.date)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{d.vendor ?? "—"}</TableCell>
                          <TableCell className="text-right text-sm font-medium">{d.amount > 0 ? formatCurrency(d.amount) : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${d.name}`)}>
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
