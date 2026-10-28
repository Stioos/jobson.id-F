"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface FieldQuality {
  field: string;
  accuracy: number;
  coverage: number;
}

const FIELD_QUALITY: FieldQuality[] = [
  { field: "Name", accuracy: 99.4, coverage: 100 },
  { field: "Email", accuracy: 98.2, coverage: 96.8 },
  { field: "Phone", accuracy: 95.6, coverage: 88.4 },
  { field: "Skills", accuracy: 88.4, coverage: 92.1 },
  { field: "Experience", accuracy: 84.2, coverage: 89.5 },
  { field: "Education", accuracy: 86.8, coverage: 78.2 },
  { field: "Current Company", accuracy: 82.1, coverage: 72.4 },
  { field: "Location", accuracy: 92.4, coverage: 95.2 },
];

interface FailedParse {
  id: string;
  fileName: string;
  format: string;
  uploadedBy: string;
  uploadedAt: string;
  reason: string;
  status: "Pending" | "Re-queued" | "Discarded";
}

const FAILED: FailedParse[] = [
  { id: "fp_001", fileName: "resume_v3.doc", format: ".doc (legacy)", uploadedBy: "Priya Nair", uploadedAt: "2024-09-21T08:00:00Z", reason: "Unsupported legacy format", status: "Pending" },
  { id: "fp_002", fileName: "cv_scanned.jpg", format: ".jpg (scanned)", uploadedBy: "Arjun Kumar", uploadedAt: "2024-09-20T14:00:00Z", reason: "OCR failed — low resolution", status: "Pending" },
  { id: "fp_003", fileName: "profile.pdf", format: ".pdf (corrupted)", uploadedBy: "Meera Joshi", uploadedAt: "2024-09-19T11:00:00Z", reason: "Corrupted PDF structure", status: "Re-queued" },
  { id: "fp_004", fileName: "resume.zip", format: ".zip", uploadedBy: "Karan Patel", uploadedAt: "2024-09-18T09:00:00Z", reason: "Archive format not supported", status: "Discarded" },
  { id: "fp_005", fileName: "cv_handwritten.pdf", format: ".pdf (handwritten)", uploadedBy: "Anita Singh", uploadedAt: "2024-09-17T16:00:00Z", reason: "Handwritten content not parseable", status: "Pending" },
];

const STATUS_TONE: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Re-queued": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Discarded: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

export function SuperAdminResumeParserOversight() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Parser Oversight"
        description="Resume parser health — success rates, extraction accuracy per field, failed parses queue, and model version tracking."
        icon={<Icon name="FileSearch" className="h-6 w-6" />}
        actions={[{ label: "Re-train Model", variant: "outline", onClick: () => toast.success("Parser re-training job queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Resumes Parsed (30d)" value="42,820" delta={{ value: "+14.2%", positive: true }} icon={<Icon name="FileSearch" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success Rate" value="96.4%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Parse Time" value="2.4s" delta={{ value: "-0.6s", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Failed Parses" value={FAILED.length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Parser Model" description="Currently deployed model version">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Version</p>
            <p className="mt-1 text-lg font-semibold">v3.2.1</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Deployed</p>
            <p className="mt-1 text-lg font-semibold">Sep 12, 2024</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Training Data</p>
            <p className="mt-1 text-lg font-semibold">840K resumes</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Languages</p>
            <p className="mt-1 text-lg font-semibold">12</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Field Extraction Quality" description="Per-field accuracy and coverage metrics">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FIELD_QUALITY.map(f => {
              const health = f.accuracy >= 90 ? "Excellent" : f.accuracy >= 80 ? "Good" : "Needs Work";
              return (
                <TableRow key={f.field}>
                  <TableCell className="font-medium">{f.field}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-24" value={f.accuracy} />
                      <span className={`text-xs font-medium ${f.accuracy >= 90 ? "text-emerald-700" : f.accuracy >= 80 ? "text-amber-700" : "text-rose-700"}`}>{f.accuracy}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-24" value={f.coverage} />
                      <span className="text-xs text-muted-foreground">{f.coverage}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={health === "Excellent" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : health === "Good" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>{health}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Failed Parses Queue" description="Resumes that could not be parsed — pending manual review" contentClassName="p-0">
        {FAILED.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No failed parses" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FAILED.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.fileName}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{f.format}</Badge></TableCell>
                  <TableCell className="text-sm">{f.uploadedBy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(f.uploadedAt)}</TableCell>
                  <TableCell className="text-xs text-rose-700">{f.reason}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[f.status]}`}>{f.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
