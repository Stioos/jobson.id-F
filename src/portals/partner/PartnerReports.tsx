"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { BarChart3, Download, FileText, CalendarClock, Wand2, RefreshCw, Mail, Clock, FileBarChart } from "lucide-react";

type ReportCategory = "financial" | "academic" | "placement" | "compliance";
type ReportFormat = "PDF" | "XLSX" | "CSV" | "JSON";

interface Report {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  format: ReportFormat;
  category: ReportCategory;
  size: string;
}

const REPORTS: Report[] = [
  // Financial
  { id: "r_001", name: "Partner Revenue Statement", period: "Q2 FY25", generatedAt: "2024-10-05", format: "PDF", category: "financial", size: "248 KB" },
  { id: "r_002", name: "Settlement Reconciliation Report", period: "Sep 2024", generatedAt: "2024-10-03", format: "XLSX", category: "financial", size: "412 KB" },
  { id: "r_003", name: "GST Collected Summary", period: "Q2 FY25", generatedAt: "2024-10-01", format: "PDF", category: "financial", size: "186 KB" },
  // Academic
  { id: "r_004", name: "Batch Performance Report", period: "Sep 2024", generatedAt: "2024-10-04", format: "XLSX", category: "academic", size: "1.2 MB" },
  { id: "r_005", name: "Faculty Productivity Analysis", period: "Q2 FY25", generatedAt: "2024-10-02", format: "PDF", category: "academic", size: "324 KB" },
  { id: "r_006", name: "Student Attendance & Assessment", period: "Sep 2024", generatedAt: "2024-09-30", format: "CSV", category: "academic", size: "98 KB" },
  // Placement
  { id: "r_007", name: "Placement Cycle Summary", period: "2024 Cycle", generatedAt: "2024-10-06", format: "PDF", category: "placement", size: "298 KB" },
  { id: "r_008", name: "Company-wise Hiring Matrix", period: "Q2 FY25", generatedAt: "2024-10-04", format: "XLSX", category: "placement", size: "542 KB" },
  { id: "r_009", name: "Salary Distribution Analytics", period: "2024 Cycle", generatedAt: "2024-10-03", format: "PDF", category: "placement", size: "212 KB" },
  // Compliance
  { id: "r_010", name: "NSDC Quarterly Compliance Report", period: "Q2 FY25", generatedAt: "2024-10-05", format: "PDF", category: "compliance", size: "364 KB" },
  { id: "r_011", name: "Centre Infrastructure Audit", period: "Sep 2024", generatedAt: "2024-09-28", format: "PDF", category: "compliance", size: "1.8 MB" },
  { id: "r_012", name: "DPDP Act Compliance Checklist", period: "Q2 FY25", generatedAt: "2024-10-01", format: "XLSX", category: "compliance", size: "168 KB" },
];

interface Subscription {
  id: string;
  reportName: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  recipients: string;
  nextRun: string;
  format: ReportFormat;
}

const SUBSCRIPTIONS: Subscription[] = [
  { id: "s_001", reportName: "Daily Wallet Snapshot", frequency: "Daily", recipients: "ops@partner.in", nextRun: "2024-10-08T09:00:00", format: "PDF" },
  { id: "s_002", reportName: "Weekly Placements Digest", frequency: "Weekly", recipients: "placement@partner.in", nextRun: "2024-10-14T10:00:00", format: "PDF" },
  { id: "s_003", reportName: "Monthly Revenue Statement", frequency: "Monthly", recipients: "accounts@partner.in", nextRun: "2024-11-01T08:00:00", format: "XLSX" },
  { id: "s_004", reportName: "Quarterly Compliance Pack", frequency: "Quarterly", recipients: "compliance@partner.in", nextRun: "2025-01-05T08:00:00", format: "PDF" },
];

const TABS: { key: ReportCategory; label: string; icon: string }[] = [
  { key: "financial", label: "Financial", icon: "Wallet" },
  { key: "academic", label: "Academic", icon: "GraduationCap" },
  { key: "placement", label: "Placement", icon: "BadgeCheck" },
  { key: "compliance", label: "Compliance", icon: "ShieldCheck" },
];

function formatTone(format: ReportFormat): string {
  switch (format) {
    case "PDF": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    case "XLSX": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "CSV": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "JSON": return "bg-teal-500/10 text-teal-600 border-teal-500/20";
  }
}

export function PartnerReports() {
  const partner = CURRENT_PARTNER;
  const [tab, setTab] = React.useState<ReportCategory>("financial");
  const [period, setPeriod] = React.useState("q2-fy25");

  const tabReports = REPORTS.filter((r) => r.category === tab);

  const totalReports = REPORTS.length;
  const thisMonth = REPORTS.filter((r) => new Date(r.generatedAt).getMonth() === 9).length;
  const activeSubs = SUBSCRIPTIONS.length;

  function handleDownload(name: string, format: ReportFormat) {
    toast.success("Download started", { description: `${name}.${format.toLowerCase()} is being downloaded.` });
  }

  function handleCustomBuilder() {
    toast.info("Custom Report Builder", { description: "Opening builder — drag fields, pick period and format, then generate." });
  }

  function toggleSubscription(id: string) {
    toast.success("Subscription updated", { description: `Schedule for ${SUBSCRIPTIONS.find((s) => s.id === id)?.reportName} updated.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports Library"
        description={`${partner.name} — download generated reports across financial, academic, placement and compliance domains, or build a custom one.`}
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[
          { label: "Custom Report Builder", icon: "Wand2", variant: "outline", onClick: handleCustomBuilder },
        ]}
      />
      <PartnerDisclaimer />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports" value={totalReports} icon={<FileText className="h-5 w-5" />} tone="brand" hint="Across all categories" />
        <StatCard label="Generated This Month" value={thisMonth} icon={<RefreshCw className="h-5 w-5" />} tone="success" hint="October 2024" />
        <StatCard label="Active Subscriptions" value={activeSubs} icon={<CalendarClock className="h-5 w-5" />} tone="warning" hint="Scheduled recurring reports" />
        <StatCard label="Formats Supported" value={4} icon={<FileBarChart className="h-5 w-5" />} hint="PDF, XLSX, CSV, JSON" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as ReportCategory)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="text-xs">
                <Icon name={t.icon} className="mr-1.5 h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sep-2024">September 2024</SelectItem>
              <SelectItem value="q2-fy25">Q2 FY25</SelectItem>
              <SelectItem value="2024-cycle">2024 Placement Cycle</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.label} Reports</CardTitle>
                <CardDescription>{tabReports.length} reports available for download</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated Date</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REPORTS.filter((r) => r.category === t.key).length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No reports in this category.</TableCell></TableRow>
                    ) : REPORTS.filter((r) => r.category === t.key).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand" />
                            {r.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{r.period}</TableCell>
                        <TableCell className="text-xs">{formatDate(r.generatedAt)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${formatTone(r.format)}`}>
                            {r.format}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.size}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleDownload(r.name, r.format)}>
                            <Download className="mr-1 h-3.5 w-3.5" />Download
                          </Button>
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

      {/* Scheduled subscriptions */}
      <SectionCard
        title="Scheduled Report Subscriptions"
        description="Recurring reports delivered automatically to your inbox"
        action={<Button size="sm" variant="outline" onClick={() => toast.info("New subscription", { description: "Choose a report, schedule and recipients to set up recurring delivery." })}><CalendarClock className="mr-1.5 h-3.5 w-3.5" />New Subscription</Button>}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SUBSCRIPTIONS.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.reportName}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{s.frequency}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground"><Mail className="mr-1 inline h-3 w-3" />{s.recipients}</TableCell>
                <TableCell><span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${formatTone(s.format)}`}>{s.format}</span></TableCell>
                <TableCell className="text-xs"><Clock className="mr-1 inline h-3 w-3 text-muted-foreground" />{formatDate(s.nextRun)}</TableCell>
                <TableCell><StatusBadge status="active" /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => toggleSubscription(s.id)}>Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Export center */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle className="text-sm">Export Center</CardTitle>
          <CardDescription className="mt-1 text-xs">Bulk export all reports for a period</CardDescription>
          <div className="mt-3 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.success("Export queued", { description: "All Q2 FY25 reports will be zipped and emailed." })}>
              <Download className="mr-2 h-4 w-4" />Export All (Q2 FY25)
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.success("Export queued", { description: "All 2024 placement reports will be zipped and emailed." })}>
              <Download className="mr-2 h-4 w-4" />Export Placement Pack 2024
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.success("Export queued", { description: "All compliance reports will be zipped and emailed." })}>
              <Download className="mr-2 h-4 w-4" />Export Compliance Bundle
            </Button>
          </div>
        </Card>
        <Card className="p-5">
          <CardTitle className="text-sm">Custom Builder</CardTitle>
          <CardDescription className="mt-1 text-xs">Compose a report with your own fields</CardDescription>
          <p className="mt-3 text-xs text-muted-foreground">
            Pick data sources (deals, placements, settlements), apply filters, choose grouping and output format, then generate one-time or schedule recurring.
          </p>
          <Button className="mt-3 w-full" size="sm" onClick={handleCustomBuilder}>
            <Wand2 className="mr-2 h-4 w-4" />Open Builder
          </Button>
        </Card>
        <Card className="p-5">
          <CardTitle className="text-sm">Quick Templates</CardTitle>
          <CardDescription className="mt-1 text-xs">Pre-built templates for common needs</CardDescription>
          <div className="mt-3 space-y-2">
            {["Revenue & Settlement Summary", "Top Performers Snapshot", "Compliance Health Card"].map((t) => (
              <Button key={t} variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.success("Template applied", { description: `${t} generated and ready to download.` })}>
                <FileText className="mr-2 h-4 w-4" />{t}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
