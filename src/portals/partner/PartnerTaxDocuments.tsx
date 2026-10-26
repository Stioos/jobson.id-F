"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { ReceiptText, Download, IndianRupee, Landmark, AlertTriangle, Clock, CalendarClock, FileText } from "lucide-react";

type DocType = "gst" | "tds" | "form16" | "26as";
type DocStatus = "filed" | "pending" | "overdue";

interface TaxDoc {
  id: string;
  name: string;
  period: string;
  amount: number;
  type: DocType;
  status: DocStatus;
  filingDate?: string;
  dueDate?: string;
  format: "PDF" | "XLSX" | "ZIP";
}

const TAX_DOCS: TaxDoc[] = [
  // GST Returns
  { id: "g_001", name: "GSTR-1 — September 2024", period: "Sep 2024", amount: 184500, type: "gst", status: "filed", filingDate: "2024-10-08", dueDate: "2024-10-11", format: "PDF" },
  { id: "g_002", name: "GSTR-3B — September 2024", period: "Sep 2024", amount: 184500, type: "gst", status: "filed", filingDate: "2024-10-18", dueDate: "2024-10-20", format: "PDF" },
  { id: "g_003", name: "GSTR-1 — October 2024", period: "Oct 2024", amount: 212000, type: "gst", status: "pending", dueDate: "2024-11-11", format: "PDF" },
  // TDS Certificates (Form 16A)
  { id: "t_001", name: "Form 16A — Q1 FY25 (TDS on Commission)", period: "Q1 FY25", amount: 28800, type: "tds", status: "filed", filingDate: "2024-08-15", format: "PDF" },
  { id: "t_002", name: "Form 16A — Q2 FY25 (TDS on Commission)", period: "Q2 FY25", amount: 32400, type: "tds", status: "pending", dueDate: "2024-10-30", format: "PDF" },
  // Form 16
  { id: "f_001", name: "Form 16 — FY 2023-24", period: "FY 2023-24", amount: 0, type: "form16", status: "filed", filingDate: "2024-06-12", format: "PDF" },
  // 26AS
  { id: "a_001", name: "Form 26AS — FY 2023-24", period: "FY 2023-24", amount: 124000, type: "26as", status: "filed", filingDate: "2024-07-20", format: "PDF" },
  { id: "a_002", name: "Form 26AS — FY 2024-25 (Partial)", period: "FY 2024-25", amount: 96000, type: "26as", status: "pending", dueDate: "2025-07-31", format: "PDF" },
];

const TABS: { key: DocType; label: string; icon: string }[] = [
  { key: "gst", label: "GST Returns", icon: "ReceiptText" },
  { key: "tds", label: "TDS (Form 16A)", icon: "FileText" },
  { key: "form16", label: "Form 16", icon: "FileText" },
  { key: "26as", label: "26AS", icon: "Landmark" },
];

interface FilingReminder {
  id: string;
  label: string;
  dueDate: string;
  form: string;
  status: DocStatus;
}

const REMINDERS: FilingReminder[] = [
  { id: "fr_001", label: "GSTR-1 October 2024", dueDate: "2024-11-11", form: "GSTR-1", status: "pending" },
  { id: "fr_002", label: "GSTR-3B October 2024", dueDate: "2024-11-20", form: "GSTR-3B", status: "pending" },
  { id: "fr_003", label: "TDS Deposit — October", dueDate: "2024-11-07", form: "Challan ITNS-281", status: "pending" },
  { id: "fr_004", label: "Form 16A Issuance — Q2", dueDate: "2024-10-30", form: "Form 16A", status: "pending" },
];

export function PartnerTaxDocuments() {
  const partner = CURRENT_PARTNER;
  const [tab, setTab] = React.useState<DocType>("gst");
  const [fy, setFy] = React.useState("fy25");

  const tabDocs = TAX_DOCS.filter((d) => d.type === tab);

  const totalGstCollected = TAX_DOCS.filter((d) => d.type === "gst").reduce((s, d) => s + d.amount, 0);
  const totalTdsDeducted = TAX_DOCS.filter((d) => d.type === "tds" || d.type === "26as").reduce((s, d) => s + d.amount, 0);
  const pendingFilings = TAX_DOCS.filter((d) => d.status === "pending").length + REMINDERS.filter((r) => r.status === "pending").length;
  const filedCount = TAX_DOCS.filter((d) => d.status === "filed").length;

  function handleDownload(name: string) {
    toast.success("Download started", { description: `${name}.pdf is being downloaded.` });
  }

  function fileReturn(doc: TaxDoc) {
    toast.success("Return filed", { description: `${doc.name} successfully filed.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Documents Center"
        description={`${partner.name} — GST returns, TDS certificates (Form 16A), Form 16 and 26AS statements, all in one place with quarterly filing reminders.`}
        icon={<Icon name="ReceiptText" className="h-6 w-6" />}
        actions={[
          { label: "Download All (FY25)", icon: "Download", variant: "outline", onClick: () => toast.success("Archive queued", { description: "All FY25 tax documents will be zipped and emailed." }) },
        ]}
      />
      <PartnerDisclaimer />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total GST Collected" value={formatCurrency(totalGstCollected)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" hint="FY25 (till date)" />
        <StatCard label="Total TDS Deducted" value={formatCurrency(totalTdsDeducted)} icon={<Landmark className="h-5 w-5" />} tone="warning" hint="Across Form 16A & 26AS" />
        <StatCard label="Documents Filed" value={filedCount} icon={<FileText className="h-5 w-5" />} tone="success" hint={`${TAX_DOCS.length} total`} />
        <StatCard label="Pending Filings" value={pendingFilings} icon={<Clock className="h-5 w-5" />} tone="danger" hint="Action required" />
      </div>

      {/* Filing reminders */}
      <SectionCard
        title="Quarterly Filing Reminders"
        description="Upcoming statutory due dates — file before penalty applies"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REMINDERS.map((r) => {
            const days = daysUntil(r.dueDate);
            const urgent = days <= 7;
            return (
              <div key={r.id} className={`rounded-lg border p-3 ${urgent ? "border-rose-500/40 bg-rose-500/5" : "border-border bg-muted/30"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight">{r.label}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{r.form}</p>
                  </div>
                  {urgent ? <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" /> : <CalendarClock className="h-4 w-4 text-amber-500 shrink-0" />}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Due {formatDate(r.dueDate)}</span>
                  <span className={`text-[11px] font-semibold ${urgent ? "text-rose-600" : "text-amber-600"}`}>{days > 0 ? `${days}d left` : "overdue"}</span>
                </div>
                <Button size="sm" variant={urgent ? "default" : "outline"} className="mt-2 w-full h-7 text-xs" onClick={() => toast.success("Filing initiated", { description: `Opening ${r.form} filing workflow.` })}>
                  File Now
                </Button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as DocType)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="text-xs">
                <Icon name={t.icon} className="mr-1.5 h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Select value={fy} onValueChange={setFy}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Financial Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fy24">FY 2023-24</SelectItem>
              <SelectItem value="fy25">FY 2024-25</SelectItem>
              <SelectItem value="fy23">FY 2022-23</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.label} — {fy.toUpperCase()}</CardTitle>
                <CardDescription>{tabDocs.length} documents available</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TAX_DOCS.filter((d) => d.type === t.key).length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No documents in this category.</TableCell></TableRow>
                    ) : TAX_DOCS.filter((d) => d.type === t.key).map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand" />
                            {d.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{d.period}</TableCell>
                        <TableCell className="font-semibold">{d.amount > 0 ? formatCurrency(d.amount) : <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell className="text-xs">{d.filingDate ? formatDate(d.filingDate) : <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell><StatusBadge status={d.status} /></TableCell>
                        <TableCell className="text-right">
                          {d.status === "filed" ? (
                            <Button variant="outline" size="sm" onClick={() => handleDownload(d.name)}>
                              <Download className="mr-1 h-3.5 w-3.5" />Download
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => fileReturn(d)}>File Now</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick stats footer */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardTitle className="text-sm flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-brand" /> GST Summary (FY25)
          </CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Output GST (Sales)</span><span className="font-semibold">{formatCurrency(totalGstCollected)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Input Tax Credit</span><span className="font-semibold">{formatCurrency(84200)}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-medium">Net GST Payable</span><span className="font-bold text-brand">{formatCurrency(totalGstCollected - 84200)}</span></div>
          </div>
        </Card>
        <Card className="p-5">
          <CardTitle className="text-sm flex items-center gap-2">
            <Landmark className="h-4 w-4 text-brand" /> TDS Summary (FY25)
          </CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">TDS on Commission (10%)</span><span className="font-semibold">{formatCurrency(61200)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">TDS on Rent</span><span className="font-semibold">{formatCurrency(36000)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">TDS on Professional Fees</span><span className="font-semibold">{formatCurrency(26800)}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-medium">Total TDS Deducted</span><span className="font-bold text-brand">{formatCurrency(124000)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
