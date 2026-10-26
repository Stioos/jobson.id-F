"use client";

import * as React from "react";
import { trainingReports, type TrainingReport } from "@/lib/lms-data";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { TenantDisclaimer } from "./_shared";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus, Download, Play, FileText, FileSpreadsheet, FileBarChart,
  Clock, Calendar, Filter, CheckCircle2,
} from "lucide-react";

interface SavedReport {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  filters: string;
  format: TrainingReport["format"];
}

const SAVED_REPORTS: SavedReport[] = [
  { id: "sr_1", name: "TechCorp — Q3 Compliance Snapshot", category: "Client", createdAt: "2024-09-15T10:00:00Z", filters: "client=cc_001, period=Q3", format: "PDF" },
  { id: "sr_2", name: "High-risk compliance tracks", category: "Compliance", createdAt: "2024-09-10T14:30:00Z", filters: "status=at_risk,overdue", format: "Excel" },
  { id: "sr_3", name: "React Bootcamp completion cohort", category: "Course", createdAt: "2024-09-01T09:00:00Z", filters: "course=tc_c001", format: "CSV" },
];

function FormatIcon({ format }: { format: TrainingReport["format"] }) {
  if (format === "PDF") return <FileText className="h-4 w-4 text-rose-500" />;
  if (format === "Excel") return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
  return <FileBarChart className="h-4 w-4 text-amber-500" />;
}

export function TrainingReportsCenter() {
  const [tab, setTab] = React.useState("library");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [savedReports, setSavedReports] = React.useState<SavedReport[]>(SAVED_REPORTS);

  const categories = Array.from(new Set(trainingReports.map((r) => r.category)));
  const filteredLibrary = trainingReports.filter((r) => categoryFilter === "all" || r.category === categoryFilter);

  const scheduledCount = trainingReports.filter((r) => r.schedule && r.status !== "generating").length;
  const readyCount = trainingReports.filter((r) => r.status === "ready").length;

  function runNow(r: TrainingReport) {
    toast.success(`Running report: ${r.name}`);
  }
  function download(r: TrainingReport | SavedReport) {
    toast.success(`Downloading ${r.name}.${r.format.toLowerCase()}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports center"
        description="Run, schedule, and download training reports across clients, compliance, finance, and more."
        actions={[{ label: "Create custom report", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reports available" value={trainingReports.length} icon={<FileBarChart className="h-5 w-5" />} tone="brand" />
        <StatCard label="Scheduled" value={scheduledCount} icon={<Calendar className="h-5 w-5" />} />
        <StatCard label="Ready to download" value={readyCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Saved custom" value={savedReports.length} icon={<FileText className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {[
          { key: "library", label: "Report library" },
          { key: "scheduled", label: "Scheduled" },
          { key: "saved", label: "Saved" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition " +
              (tab === t.key ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* LIBRARY */}
      {tab === "library" && (
        <div className="space-y-4">
          <Card className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">{filteredLibrary.length} reports</span>
            </div>
          </Card>

          {filteredLibrary.length === 0 ? (
            <EmptyState icon={<FileBarChart className="h-6 w-6" />} title="No reports in this category" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredLibrary.map((r) => (
                <Card key={r.id} className="flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <FormatIcon format={r.format} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.category}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{r.description}</p>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Last run</span><span>{timeAgo(r.lastRun)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Schedule</span><span>{r.schedule ?? "On-demand"}</span></div>
                    {r.recipients && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Recipients</span><span className="truncate">{r.recipients}</span></div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 border-t pt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => runNow(r)}>
                      <Play className="mr-1 h-3 w-3" /> Run now
                    </Button>
                    <Button
                      size="sm" className="flex-1"
                      disabled={r.status === "generating"}
                      onClick={() => download(r)}
                    >
                      <Download className="mr-1 h-3 w-3" /> {r.format}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULED */}
      {tab === "scheduled" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheduled reports</CardTitle>
            <CardDescription>Reports configured to run automatically on a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Last run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingReports.filter((r) => r.schedule).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-sm">{r.category}</TableCell>
                    <TableCell className="text-sm">{r.schedule}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.format}</Badge></TableCell>
                    <TableCell className="text-sm">{r.recipients ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(r.lastRun)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Schedule paused")}>Pause</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* SAVED */}
      {tab === "saved" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved custom reports</CardTitle>
            <CardDescription>Reports you've created with custom filters.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Filters</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No saved reports. Create one with the button above.
                    </TableCell>
                  </TableRow>
                ) : (
                  savedReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-sm">{r.category}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{r.filters}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{r.format}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => download(r)}><Download className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => { setSavedReports((p) => p.filter((s) => s.id !== r.id)); toast.success("Saved report deleted"); }}>
                            <Clock className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create custom report */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create custom report</DialogTitle>
            <DialogDescription>Build a custom report by selecting metrics, filters, and output format.</DialogDescription>
          </DialogHeader>
          <CreateReportForm
            onCancel={() => setCreateOpen(false)}
            onSubmit={(vals) => {
              const newSaved: SavedReport = {
                id: `sr_new_${Date.now()}`,
                name: vals.name,
                category: vals.category,
                createdAt: new Date().toISOString(),
                filters: `metrics=${vals.metrics.join(",")}, range=${vals.dateRange}`,
                format: vals.format,
              };
              setSavedReports((p) => [newSaved, ...p]);
              setCreateOpen(false);
              toast.success(`Report created — ${vals.name}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const METRICS = ["Enrollments", "Completion rate", "Attendance", "Revenue", "Compliance status", "Trainer performance", "Course ratings", "Skill gaps"];

function CreateReportForm({ onCancel, onSubmit }: {
  onCancel: () => void;
  onSubmit: (vals: {
    name: string;
    category: string;
    metrics: string[];
    dateRange: string;
    format: TrainingReport["format"];
  }) => void;
}) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Client");
  const [metrics, setMetrics] = React.useState<string[]>(["Enrollments"]);
  const [dateRange, setDateRange] = React.useState("last_30_days");
  const [format, setFormat] = React.useState<TrainingReport["format"]>("PDF");

  function toggleMetric(m: string) {
    setMetrics((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  }

  function submit() {
    if (!name.trim()) { toast.error("Report name required"); return; }
    if (metrics.length === 0) { toast.error("Select at least one metric"); return; }
    onSubmit({ name: name.trim(), category, metrics, dateRange, format });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="rn">Report name</Label>
        <Input id="rn" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. TechCorp Q3 Compliance" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Client", "Compliance", "Finance", "Trainer", "Analytics", "Skills", "Delivery", "Course", "Certification"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Date range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="this_quarter">This quarter</SelectItem>
              <SelectItem value="this_year">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Metrics</Label>
        <div className="grid grid-cols-2 gap-2 rounded-md border p-2">
          {METRICS.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm">
              <Checkbox checked={metrics.includes(m)} onCheckedChange={() => toggleMetric(m)} />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Format</Label>
        <Select value={format} onValueChange={(v) => setFormat(v as TrainingReport["format"])}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="Excel">Excel</SelectItem>
            <SelectItem value="CSV">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}><Plus className="mr-2 h-4 w-4" /> Create report</Button>
      </DialogFooter>
    </div>
  );
}
