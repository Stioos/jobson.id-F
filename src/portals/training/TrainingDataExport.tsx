"use client";

import * as React from "react";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { TenantDisclaimer } from "./_shared";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import {
  Download, Database, FileText, FileSpreadsheet, FileJson, Clock,
  Calendar, Repeat, Layers, CheckCircle2,
} from "lucide-react";

interface Dataset {
  id: string;
  name: string;
  description: string;
  fields: number;
  records: number;
  lastExport: string;
  formats: ("CSV" | "Excel" | "JSON")[];
  icon: string;
}

const DATASETS: Dataset[] = [
  { id: "ds_enrollments", name: "Enrollments", description: "All learner enrollments across courses, clients, and cohorts.", fields: 14, records: 12480, lastExport: "2 hours ago", formats: ["CSV", "Excel", "JSON"], icon: "Users2" },
  { id: "ds_certificates", name: "Certificates", description: "Issued certificates with verify URLs and expiry.", fields: 10, records: 8420, lastExport: "1 day ago", formats: ["CSV", "Excel", "JSON"], icon: "Award" },
  { id: "ds_compliance", name: "Compliance", description: "Compliance tracks, completion status, overdue/at-risk.", fields: 12, records: 4820, lastExport: "3 hours ago", formats: ["CSV", "Excel"], icon: "ShieldCheck" },
  { id: "ds_revenue", name: "Revenue", description: "Invoices, payments, GST, budget utilization by client.", fields: 16, records: 1240, lastExport: "6 hours ago", formats: ["CSV", "Excel"], icon: "Banknote" },
  { id: "ds_learners", name: "Learners", description: "Learner profiles, skill levels, activity history.", fields: 18, records: 48200, lastExport: "1 day ago", formats: ["CSV", "Excel", "JSON"], icon: "GraduationCap" },
  { id: "ds_courses", name: "Courses", description: "Course catalog, modules, lessons, materials.", fields: 20, records: 186, lastExport: "2 days ago", formats: ["CSV", "Excel", "JSON"], icon: "BookOpen" },
  { id: "ds_trainers", name: "Trainers", description: "Trainer profiles, ratings, sessions conducted.", fields: 11, records: 64, lastExport: "1 day ago", formats: ["CSV", "Excel"], icon: "Users2" },
  { id: "ds_audit_logs", name: "Audit Logs", description: "All audit events across the training portal.", fields: 9, records: 38420, lastExport: "1 hour ago", formats: ["CSV", "JSON"], icon: "ScrollText" },
];

interface ExportHistoryRow {
  id: string;
  dataset: string;
  format: "CSV" | "Excel" | "JSON";
  size: string;
  exportedAt: string;
  requestedBy: string;
}

const HISTORY: ExportHistoryRow[] = [
  { id: "ex_1", dataset: "Enrollments", format: "CSV", size: "1.8 MB", exportedAt: new Date(Date.now() - 2 * 3600000).toISOString(), requestedBy: "Divya Sharma" },
  { id: "ex_2", dataset: "Compliance", format: "Excel", size: "640 KB", exportedAt: new Date(Date.now() - 3 * 3600000).toISOString(), requestedBy: "Sushma Reddy" },
  { id: "ex_3", dataset: "Audit Logs", format: "JSON", size: "4.2 MB", exportedAt: new Date(Date.now() - 5 * 3600000).toISOString(), requestedBy: "System (scheduled)" },
  { id: "ex_4", dataset: "Revenue", format: "Excel", size: "220 KB", exportedAt: new Date(Date.now() - 26 * 3600000).toISOString(), requestedBy: "Karthik Nair" },
  { id: "ex_5", dataset: "Certificates", format: "CSV", size: "980 KB", exportedAt: new Date(Date.now() - 30 * 3600000).toISOString(), requestedBy: "Divya Sharma" },
  { id: "ex_6", dataset: "Learners", format: "CSV", size: "8.4 MB", exportedAt: new Date(Date.now() - 48 * 3600000).toISOString(), requestedBy: "Rohan Mehta" },
];

function FormatIcon({ format }: { format: "CSV" | "Excel" | "JSON" }) {
  if (format === "CSV") return <FileText className="h-3.5 w-3.5 text-amber-500" />;
  if (format === "Excel") return <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />;
  return <FileJson className="h-3.5 w-3.5 text-violet-500" />;
}

function DatasetIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
      <Database className="h-5 w-5" />
    </div>
  );
}

export function TrainingDataExport() {
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [bulkFormat, setBulkFormat] = React.useState<"CSV" | "Excel" | "JSON">("CSV");
  const [history, setHistory] = React.useState<ExportHistoryRow[]>(HISTORY);

  function exportOne(ds: Dataset, format: "CSV" | "Excel" | "JSON") {
    const size = (ds.records * 0.2 / 1000).toFixed(1);
    const newRow: ExportHistoryRow = {
      id: `ex_new_${Date.now()}`,
      dataset: ds.name,
      format,
      size: `${size} MB`,
      exportedAt: new Date().toISOString(),
      requestedBy: "You",
    };
    setHistory((h) => [newRow, ...h]);
    toast.success(`Exporting ${ds.name} as ${format}…`);
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runBulk() {
    if (selected.size === 0) {
      toast.error("Select at least one dataset");
      return;
    }
    const newRows: ExportHistoryRow[] = Array.from(selected).map((id) => {
      const ds = DATASETS.find((d) => d.id === id);
      return {
        id: `ex_bulk_${id}_${Date.now()}`,
        dataset: ds?.name ?? id,
        format: bulkFormat,
        size: `${((ds?.records ?? 0) * 0.2 / 1000).toFixed(1)} MB`,
        exportedAt: new Date().toISOString(),
        requestedBy: "You",
      };
    });
    setHistory((h) => [...newRows, ...h]);
    setBulkOpen(false);
    setSelected(new Set());
    toast.success(`Bulk export started — ${newRows.length} datasets as ${bulkFormat}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data export"
        description="Export training data — enrollments, certificates, compliance, revenue, and more — for analytics, backup, or compliance."
        actions={[
          { label: "Bulk export", icon: "Layers", variant: "outline", onClick: () => setBulkOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Datasets" value={DATASETS.length} icon={<Database className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total records" value="76K+" icon={<Layers className="h-5 w-5" />} />
        <StatCard label="Exports today" value={history.filter((h) => new Date(h.exportedAt).toDateString() === new Date().toDateString()).length} icon={<Download className="h-5 w-5" />} />
        <StatCard label="Scheduled" value={2} icon={<Repeat className="h-5 w-5" />} tone="success" />
      </div>

      {/* Dataset list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exportable datasets</CardTitle>
          <CardDescription>Choose a dataset and format, then click Export.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {DATASETS.map((ds) => (
            <div key={ds.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <Checkbox
                checked={selected.has(ds.id)}
                onCheckedChange={() => toggleSelected(ds.id)}
              />
              <DatasetIcon />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{ds.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{ds.description}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{ds.fields} fields</span>
                <span>·</span>
                <span>{ds.records.toLocaleString("en-IN")} records</span>
                <span>·</span>
                <span>Last: {ds.lastExport}</span>
              </div>
              <div className="flex gap-1">
                {ds.formats.map((f) => (
                  <Button
                    key={f} size="sm" variant="outline"
                    onClick={() => exportOne(ds, f)}
                    className="gap-1"
                  >
                    <FormatIcon format={f} /> {f}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recurring schedule section */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Repeat className="h-4 w-4 text-brand" /> Scheduled recurring exports
            </CardTitle>
            <CardDescription className="mt-1">Automate exports to email, SFTP, or cloud storage.</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success("Schedule dialog opened")}>
            <Calendar className="mr-1 h-3.5 w-3.5" /> New schedule
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">Daily Compliance Export</p>
                <p className="text-xs text-muted-foreground">Compliance dataset · CSV · email to compliance@skillforge.academy</p>
              </div>
              <StatusBadge status="active" />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Daily at 06:00 IST · Next run tomorrow
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Audit Log Archive</p>
                <p className="text-xs text-muted-foreground">Audit Logs · JSON · SFTP to archive.skillforge.academy</p>
              </div>
              <StatusBadge status="active" />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Weekly (Mon) at 02:00 IST · Next run Monday
            </div>
          </div>
        </div>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export history</CardTitle>
          <CardDescription>Recent exports with download links.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Exported at</TableHead>
                  <TableHead>Requested by</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No exports yet.</TableCell>
                  </TableRow>
                ) : (
                  history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">{h.dataset}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-xs">
                          <FormatIcon format={h.format} /> {h.format}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{h.size}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(h.exportedAt)}</TableCell>
                      <TableCell className="text-sm">{h.requestedBy}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${h.dataset}.${h.format.toLowerCase()}`)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk export dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk export</DialogTitle>
            <DialogDescription>Select multiple datasets and a single format for a combined export.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2 rounded-md border p-3 max-h-60 overflow-y-auto scroll-thin">
              {DATASETS.map((ds) => (
                <label key={ds.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.has(ds.id)}
                    onCheckedChange={() => toggleSelected(ds.id)}
                  />
                  <span className="flex-1">{ds.name}</span>
                  <Badge variant="outline" className="text-[10px]">{ds.fields} fields</Badge>
                </label>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>Format for all selected</Label>
              <Select value={bulkFormat} onValueChange={(v) => setBulkFormat(v as "CSV" | "Excel" | "JSON")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-500" />
              {selected.size} dataset(s) selected. Each will be exported as a separate file in a zip archive.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={runBulk} disabled={selected.size === 0}>
              <Download className="mr-2 h-4 w-4" /> Export {selected.size} dataset(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
