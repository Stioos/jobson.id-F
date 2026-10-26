"use client";

import * as React from "react";
import {
  FileSearch, UploadCloud, FileText, Mail, Cpu, GraduationCap, Clock, Building2, CheckCircle2, AlertCircle, Loader2, Trash2,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";

type ParseStatus = "parsed" | "processing" | "failed" | "review";

interface ParsedResume {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  education: string;
  currentCompany: string;
  currentRole: string;
  location: string;
  sourceFile: string;
  parsedAt: string;
  status: ParseStatus;
  confidence: number;
}

const MOCK_RESUMES: ParsedResume[] = [
  { id: "pr1", name: "Arjun Iyer", email: "arjun.iyer@gmail.com", phone: "+91 98765 43210", skills: ["React", "TypeScript", "GraphQL", "Node.js"], experience: 6, education: "B.Tech, IIT Madras", currentCompany: "TechCorp India", currentRole: "Senior Frontend Engineer", location: "Bengaluru", sourceFile: "Arjun_Iyer_SDE_2024.pdf", parsedAt: "2024-10-28T11:24:00Z", status: "parsed", confidence: 96 },
  { id: "pr2", name: "Kavya Reddy", email: "kavya.reddy@outlook.com", phone: "+91 99876 11223", skills: ["React", "Node.js", "AWS", "MongoDB"], experience: 5, education: "B.E., BITS Pilani", currentCompany: "DataMinds AI", currentRole: "Full Stack Developer", location: "Hyderabad", sourceFile: "Kavya_Reddy_FSE.docx", parsedAt: "2024-10-28T11:22:00Z", status: "parsed", confidence: 92 },
  { id: "pr3", name: "Rohan Mehta", email: "rohan.mehta@gmail.com", phone: "+91 90909 88123", skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"], experience: 7, education: "M.Tech, IIT Bombay", currentCompany: "FinEdge Solutions", currentRole: "DevOps Engineer", location: "Pune", sourceFile: "Rohan_Mehta_DevOps.pdf", parsedAt: "2024-10-28T11:18:00Z", status: "parsed", confidence: 88 },
  { id: "pr4", name: "Sneha Kapoor", email: "sneha.kapoor@yahoo.com", phone: "+91 98112 33445", skills: ["Python", "Django", "PostgreSQL"], experience: 4, education: "B.Tech, DTU", currentCompany: "StartupX", currentRole: "Backend Engineer", location: "Remote", sourceFile: "Sneha_Kapoor_BE.pdf", parsedAt: "2024-10-28T11:10:00Z", status: "review", confidence: 71 },
  { id: "pr5", name: "Vikram Nair", email: "vikram.nair@gmail.com", phone: "+91 90090 12345", skills: ["Python", "TensorFlow", "ML", "PyTorch"], experience: 8, education: "PhD, IISc Bangalore", currentCompany: "DataMinds AI", currentRole: "ML Engineer", location: "Bengaluru", sourceFile: "Vikram_Nair_ML.pdf", parsedAt: "2024-10-28T11:02:00Z", status: "processing", confidence: 0 },
  { id: "pr6", name: "Priya Nair", email: "priya.nair@gmail.com", phone: "+91 97411 22334", skills: [], experience: 0, education: "Unknown", currentCompany: "Unknown", currentRole: "Frontend Engineer", location: "Kochi", sourceFile: "Priya_Nair_FE.txt", parsedAt: "2024-10-28T10:55:00Z", status: "failed", confidence: 0 },
];

export function RecruiterResumeParser() {
  const [resumes, setResumes] = React.useState<ParsedResume[]>(MOCK_RESUMES);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [detail, setDetail] = React.useState<ParsedResume | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filtered = resumes.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q)) ||
        r.currentCompany.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function simulateUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newOnes: ParsedResume[] = Array.from(files).slice(0, 3).map((f, i) => ({
      id: `pr_new_${Date.now()}_${i}`,
      name: f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "New Candidate",
      email: "parsing…",
      phone: "—",
      skills: [],
      experience: 0,
      education: "Parsing",
      currentCompany: "—",
      currentRole: "—",
      location: "—",
      sourceFile: f.name,
      parsedAt: new Date().toISOString(),
      status: "processing" as ParseStatus,
      confidence: 0,
    }));
    setResumes((prev) => [...newOnes, ...prev]);
    toast.success(`Uploading ${newOnes.length} file${newOnes.length > 1 ? "s" : ""}`, { description: "Resumes queued for parsing" });
  }

  const parsed = resumes.filter((r) => r.status === "parsed").length;
  const processing = resumes.filter((r) => r.status === "processing").length;
  const needsReview = resumes.filter((r) => r.status === "review" || r.status === "failed").length;
  const avgConfidence = Math.round(
    resumes.filter((r) => r.confidence > 0).reduce((a, r) => a + r.confidence, 0) /
      Math.max(1, resumes.filter((r) => r.confidence > 0).length)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Parser / Bulk Upload"
        description="Drag-drop resumes (PDF/DOCX/TXT). Our parser extracts skills, experience, education and contact details automatically — ready for your talent pool."
        icon={<FileSearch className="h-6 w-6" />}
        actions={[
          { label: "Browse files", variant: "outline", onClick: () => fileInputRef.current?.click() },
        ]}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.rtf"
        className="hidden"
        onChange={(e) => simulateUpload(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          simulateUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition ${
          dragOver ? "border-brand bg-brand/5" : "border-border hover:border-brand/40 hover:bg-muted/30"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="mt-3 text-base font-semibold">Drop resumes here or click to browse</h3>
        <p className="mt-1 text-sm text-muted-foreground">Supports PDF, DOCX, TXT up to 10 MB each · Bulk upload up to 25 files</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["PDF", "DOCX", "TXT", "RTF"].map((f) => (
            <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Parsed" value={parsed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Processing" value={processing} icon={<Loader2 className="h-5 w-5" />} tone="warning" />
        <StatCard label="Needs review" value={needsReview} icon={<AlertCircle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg confidence" value={`${avgConfidence}%`} tone="brand" />
      </div>

      {/* Table */}
      <SectionCard
        title="Parsed resumes"
        description="Click a row to review extracted fields."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search name, email, skill…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 sm:w-60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            >
              <option value="all">All status</option>
              <option value="parsed">Parsed</option>
              <option value="processing">Processing</option>
              <option value="review">Needs review</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<FileSearch className="h-5 w-5" />} title="No resumes match" description="Upload resumes or adjust filters." />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Exp</TableHead>
                  <TableHead className="hidden lg:table-cell">Education</TableHead>
                  <TableHead className="hidden md:table-cell">Source file</TableHead>
                  <TableHead className="hidden sm:table-cell">Parsed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setDetail(r)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{r.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.currentRole}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground truncate max-w-[160px]">{r.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {r.skills.slice(0, 2).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                        {r.skills.length > 2 && <Badge variant="outline" className="text-[10px]">+{r.skills.length - 2}</Badge>}
                        {r.skills.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center text-xs">{r.experience ? `${r.experience}y` : "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground truncate max-w-[140px]">{r.education}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[140px]">
                        <FileText className="h-3.5 w-3.5 shrink-0" />{r.sourceFile}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{formatDateTime(r.parsedAt)}</TableCell>
                    <TableCell><ParseStatusBadge status={r.status} confidence={r.confidence} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && <ResumeDetail r={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ParseStatusBadge({ status, confidence }: { status: ParseStatus; confidence: number }) {
  const map: Record<ParseStatus, { cls: string; label: string; icon: React.ReactNode }> = {
    parsed: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: `Parsed · ${confidence}%`, icon: <CheckCircle2 className="h-3 w-3" /> },
    processing: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Processing", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    review: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Needs review", icon: <AlertCircle className="h-3 w-3" /> },
    failed: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: "Failed", icon: <AlertCircle className="h-3 w-3" /> },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}

function ResumeDetail({ r }: { r: ParsedResume }) {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <AvatarLogo text={r.name} size="md" />
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.currentRole}</div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Parsed resume detail</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <ParseStatusBadge status={r.status} confidence={r.confidence} />
          <Badge variant="outline" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />{r.sourceFile}
          </Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Extracted fields</h4>
          <dl className="mt-3 grid grid-cols-1 gap-y-3 text-xs">
            <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={r.email} />
            <Field icon={<Mail className="h-3.5 w-3.5" />} label="Phone" value={r.phone} />
            <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Current company" value={r.currentCompany} />
            <Field icon={<Clock className="h-3.5 w-3.5" />} label="Experience" value={r.experience ? `${r.experience} years` : "—"} />
            <Field icon={<GraduationCap className="h-3.5 w-3.5" />} label="Education" value={r.education} />
            <Field icon={<Mail className="h-3.5 w-3.5" />} label="Location" value={r.location} />
          </dl>
        </div>

        <div>
          <h4 className="text-sm font-semibold flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" />Extracted skills</h4>
          {r.skills.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">No skills extracted yet.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("Added to talent pool", { description: r.name })}>
            Add to talent pool
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Sent for review", { description: r.name })}>
            Send for review
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast.error("Resume removed", { description: r.sourceFile })}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        <span className="text-brand">{icon}</span>{label}
      </dt>
      <dd className="text-right font-medium text-foreground break-all">{value}</dd>
    </div>
  );
}
