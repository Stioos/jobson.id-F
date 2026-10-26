"use client";

import * as React from "react";
import {
  FileBarChart, FileText, FileSpreadsheet, Download, Clock,
  Plus, CheckCircle2, RotateCw, Eye, Pencil, Trash2,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const METRICS = [
  { id: "submissions", label: "Submissions" },
  { id: "interviews", label: "Interviews" },
  { id: "offers", label: "Offers" },
  { id: "placements", label: "Placements" },
  { id: "revenue", label: "Revenue" },
  { id: "time_to_fill", label: "Time-to-fill" },
  { id: "conversion_rates", label: "Conversion rates" },
];

const DIMENSIONS = [
  { id: "by_client", label: "By client" },
  { id: "by_recruiter", label: "By recruiter" },
  { id: "by_job", label: "By job" },
  { id: "by_month", label: "By month" },
  { id: "by_source", label: "By source" },
];

const FORMATS = [
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "excel", label: "Excel", icon: FileSpreadsheet },
  { id: "csv", label: "CSV", icon: FileBarChart },
];

const SCHEDULES = [
  { id: "one_time", label: "One-time" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
];

interface SavedReport {
  id: string;
  name: string;
  metrics: string[];
  dimensions: string[];
  format: string;
  schedule: string;
  lastRun: string;
  status: "ready" | "running" | "scheduled" | "failed";
  owner: string;
  nextRun?: string;
}

const SAVED_REPORTS: SavedReport[] = [
  { id: "rep_001", name: "Q4 Placement Performance", metrics: ["placements", "revenue", "time_to_fill"], dimensions: ["by_client", "by_recruiter"], format: "pdf", schedule: "monthly", lastRun: "2024-10-31T10:00:00Z", status: "ready", owner: "Karthik Subramanian", nextRun: "2024-11-30T10:00:00Z" },
  { id: "rep_002", name: "DevOps Sourcing Funnel — FinEdge", metrics: ["submissions", "interviews", "conversion_rates"], dimensions: ["by_job", "by_source"], format: "excel", schedule: "weekly", lastRun: "2024-11-04T08:00:00Z", status: "ready", owner: "Karthik Subramanian", nextRun: "2024-11-11T08:00:00Z" },
  { id: "rep_003", name: "Monthly Revenue Settlement", metrics: ["revenue", "placements"], dimensions: ["by_month", "by_client"], format: "pdf", schedule: "monthly", lastRun: "2024-11-01T09:00:00Z", status: "ready", owner: "Karthik Subramanian", nextRun: "2024-12-01T09:00:00Z" },
  { id: "rep_004", name: "Recruiter Leaderboard — Oct", metrics: ["submissions", "placements", "revenue"], dimensions: ["by_recruiter"], format: "excel", schedule: "monthly", lastRun: "2024-11-01T17:00:00Z", status: "ready", owner: "Karthik Subramanian" },
  { id: "rep_005", name: "TechCorp QBR Pack", metrics: ["submissions", "interviews", "offers", "placements"], dimensions: ["by_job", "by_month"], format: "pdf", schedule: "quarterly", lastRun: "2024-10-15T14:00:00Z", status: "ready", owner: "Karthik Subramanian", nextRun: "2025-01-15T14:00:00Z" },
];

const PREVIEW_DATA = [
  { client: "TechCorp", submissions: 38, interviews: 22, offers: 6, placements: 4 },
  { client: "FinEdge", submissions: 24, interviews: 14, offers: 3, placements: 2 },
  { client: "DataMinds", submissions: 31, interviews: 18, offers: 5, placements: 3 },
  { client: "SecureBank", submissions: 12, interviews: 6, offers: 1, placements: 0 },
  { client: "StartupX", submissions: 8, interviews: 4, offers: 0, placements: 0 },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right truncate">{value}</span>
    </div>
  );
}

export function RecruiterReportBuilder() {
  const [name, setName] = React.useState("");
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>(["placements", "revenue"]);
  const [selectedDimensions, setSelectedDimensions] = React.useState<string[]>(["by_client"]);
  const [format, setFormat] = React.useState("pdf");
  const [schedule, setSchedule] = React.useState("one_time");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function toggleMetric(id: string) {
    setSelectedMetrics((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  }
  function toggleDimension(id: string) {
    setSelectedDimensions((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  }

  function handleGenerate() {
    if (!name.trim()) {
      toast.error("Report name is required");
      return;
    }
    if (selectedMetrics.length === 0) {
      toast.error("Select at least one metric");
      return;
    }
    if (selectedDimensions.length === 0) {
      toast.error("Select at least one dimension");
      return;
    }
    const fmtLabel = FORMATS.find((f) => f.id === format)?.label || format;
    const schLabel = SCHEDULES.find((s) => s.id === schedule)?.label || schedule;
    toast.success("Report generated", {
      description: `"${name}" • ${fmtLabel} • ${schLabel} • ${selectedMetrics.length} metrics × ${selectedDimensions.length} dimensions`,
    });
    setName("");
    setNotes("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report builder"
        description="Configure flexible analytics reports by metric, dimension, date range, format and schedule. Generate one-time or recurring."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Saved reports" value={SAVED_REPORTS.length} icon={<FileBarChart className="h-5 w-5" />} tone="brand" />
        <StatCard label="Scheduled" value={SAVED_REPORTS.filter((r) => r.schedule !== "one_time").length} icon={<RotateCw className="h-5 w-5" />} tone="success" hint="Recurring cadence" />
        <StatCard label="Ready to download" value={SAVED_REPORTS.filter((r) => r.status === "ready").length} icon={<CheckCircle2 className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg time-to-generate" value="3.2s" icon={<Clock className="h-5 w-5" />} tone="default" />
      </div>

      <Tabs defaultValue="builder">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-9">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved reports</TabsTrigger>
        </TabsList>

        {/* BUILDER */}
        <TabsContent value="builder" className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Report configuration" description="Define what to measure, how to slice it, and when to deliver.">
              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="rp-name">Report name *</Label>
                  <Input id="rp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Placement Performance" />
                </div>

                <div className="grid gap-2">
                  <Label>Metrics</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {METRICS.map((m) => (
                      <label key={m.id} className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${selectedMetrics.includes(m.id) ? "border-brand bg-brand/5" : "hover:bg-muted/30"}`}>
                        <Checkbox
                          checked={selectedMetrics.includes(m.id)}
                          onCheckedChange={() => toggleMetric(m.id)}
                        />
                        <span className="text-sm">{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Dimensions (slice by)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DIMENSIONS.map((d) => (
                      <label key={d.id} className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${selectedDimensions.includes(d.id) ? "border-brand bg-brand/5" : "hover:bg-muted/30"}`}>
                        <Checkbox
                          checked={selectedDimensions.includes(d.id)}
                          onCheckedChange={() => toggleDimension(d.id)}
                        />
                        <span className="text-sm">{d.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="rp-from">Date from</Label>
                    <Input id="rp-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rp-to">Date to</Label>
                    <Input id="rp-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Format</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {FORMATS.map((f) => {
                        const Icon = f.icon;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFormat(f.id)}
                            className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition ${format === f.id ? "border-brand bg-brand/5 text-brand" : "hover:bg-muted/30"}`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{f.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Schedule</Label>
                    <Select value={schedule} onValueChange={setSchedule}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SCHEDULES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rp-notes">Notes (optional)</Label>
                  <Textarea id="rp-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What should this report highlight?" />
                </div>
              </div>
            </SectionCard>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGenerate}>
                <Plus className="h-4 w-4 mr-1.5" />Generate report
              </Button>
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                <Eye className="h-4 w-4 mr-1.5" />Preview
              </Button>
              <Button variant="outline" onClick={() => toast.success("Report template saved", { description: "Reusable for future runs" })}>
                Save as template
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <SectionCard title="Summary">
              <div className="space-y-2 text-sm">
                <Row label="Name" value={name || "—"} />
                <Row label="Metrics" value={`${selectedMetrics.length} selected`} />
                <Row label="Dimensions" value={`${selectedDimensions.length} selected`} />
                <Row label="Format" value={FORMATS.find((f) => f.id === format)?.label || "—"} />
                <Row label="Schedule" value={SCHEDULES.find((s) => s.id === schedule)?.label || "—"} />
                <Row label="Range" value={dateFrom && dateTo ? `${formatDate(dateFrom)} → ${formatDate(dateTo)}` : "—"} />
              </div>
              {selectedMetrics.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Selected metrics</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedMetrics.map((m) => (
                      <Badge key={m} variant="outline" className="text-xs capitalize">{METRICS.find((x) => x.id === m)?.label || m}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Note</div>
              Reports are generated from your recruitment data. Scheduled reports are emailed to your registered address.
            </div>
          </div>
        </TabsContent>

        {/* SAVED REPORTS */}
        <TabsContent value="saved" className="mt-4 space-y-4">
          <SectionCard title="Saved reports" description="Re-run, edit, download or delete your saved reports.">
            {SAVED_REPORTS.length === 0 ? (
              <EmptyState icon={<FileBarChart className="h-5 w-5" />} title="No saved reports" description="Generate and save your first report from the Builder tab." />
            ) : (
              <div className="max-h-[36rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/30 sticky top-0">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Report</th>
                      <th className="px-3 py-2 font-medium hidden md:table-cell">Format</th>
                      <th className="px-3 py-2 font-medium hidden sm:table-cell">Schedule</th>
                      <th className="px-3 py-2 font-medium">Last run</th>
                      <th className="px-3 py-2 font-medium hidden lg:table-cell">Next run</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAVED_REPORTS.map((r) => {
                      const Icon = FORMATS.find((f) => f.id === r.format)?.icon || FileBarChart;
                      return (
                        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand"><Icon className="h-4 w-4" /></div>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{r.name}</div>
                                <div className="text-xs text-muted-foreground">{r.metrics.length} metrics × {r.dimensions.length} dims</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell"><Badge variant="outline" className="text-xs uppercase">{r.format}</Badge></td>
                          <td className="px-3 py-3 hidden sm:table-cell capitalize text-muted-foreground">{r.schedule.replace("_", "-")}</td>
                          <td className="px-3 py-3 text-muted-foreground">{formatDate(r.lastRun)}</td>
                          <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">
                            {r.nextRun ? formatDate(r.nextRun) : "—"}
                          </td>
                          <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="ghost" onClick={() => toast.success("Report downloaded", { description: r.name })}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => toast.success("Report re-run started", { description: r.name })}>
                                <RotateCw className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => toast.info("Edit not available in demo", { description: r.name })}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)}>
                                <Trash2 className="h-4 w-4 text-rose-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report preview</DialogTitle>
            <DialogDescription>
              {name || "Untitled report"} • {selectedMetrics.length} metrics × {selectedDimensions.length} dims
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-semibold mb-2">Pipeline by client (sample)</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={PREVIEW_DATA} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                  <XAxis dataKey="client" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="submissions" fill="oklch(0.65 0.13 250)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="interviews" fill="oklch(0.7 0.18 70)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="offers" fill="oklch(0.6 0.13 200)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="placements" fill="oklch(0.65 0.18 162)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-semibold mb-2">Tabular preview</div>
              <div className="overflow-x-auto scroll-thin">
                <table className="w-full text-xs">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="text-left p-2 font-medium">Client</th>
                      <th className="text-right p-2 font-medium">Submissions</th>
                      <th className="text-right p-2 font-medium">Interviews</th>
                      <th className="text-right p-2 font-medium">Offers</th>
                      <th className="text-right p-2 font-medium">Placements</th>
                      <th className="text-right p-2 font-medium">Conv. rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_DATA.map((r) => {
                      const conv = r.submissions > 0 ? Math.round((r.placements / r.submissions) * 100) : 0;
                      return (
                        <tr key={r.client} className="border-b last:border-0">
                          <td className="p-2 font-medium">{r.client}</td>
                          <td className="p-2 text-right">{r.submissions}</td>
                          <td className="p-2 text-right">{r.interviews}</td>
                          <td className="p-2 text-right">{r.offers}</td>
                          <td className="p-2 text-right">{r.placements}</td>
                          <td className="p-2 text-right font-semibold">{conv}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            <Button onClick={() => { setPreviewOpen(false); handleGenerate(); }}>
              <Download className="h-4 w-4 mr-1.5" />Generate now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the saved report and any scheduled runs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { toast.success("Report deleted"); setDeleteId(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
