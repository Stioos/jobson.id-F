"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { aiService } from "@/lib/mock-api";
import { candidateProfiles } from "@/lib/mock-data";
import type { CandidateProfile } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface ResumeVersion {
  id: string;
  name: string;
  lastUpdated: string;
  sizeKb: number;
  isDefault: boolean;
  source: "upload" | "generated";
}

interface ParsedResume {
  name: string;
  headline: string;
  skills: string[];
  experienceYears: number;
  education: string;
  confidence: number;
  simulated: boolean;
}

const SEED_RESUMES: ResumeVersion[] = [
  {
    id: "r_001",
    name: "Default Resume",
    lastUpdated: "2024-10-15T10:00:00Z",
    sizeKb: 184,
    isDefault: true,
    source: "generated",
  },
  {
    id: "r_002",
    name: "TechCorp Tailored",
    lastUpdated: "2024-10-12T08:30:00Z",
    sizeKb: 212,
    isDefault: false,
    source: "upload",
  },
  {
    id: "r_003",
    name: "FinEdge PM (Draft)",
    lastUpdated: "2024-10-08T15:45:00Z",
    sizeKb: 156,
    isDefault: false,
    source: "upload",
  },
];

export function CandidateResume() {
  const profile: CandidateProfile = candidateProfiles[0];
  const [resumes, setResumes] = React.useState<ResumeVersion[]>(SEED_RESUMES);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [previewResume, setPreviewResume] = React.useState<ResumeVersion | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function setDefault(id: string) {
    setResumes((rs) => rs.map((r) => ({ ...r, isDefault: r.id === id })));
    toast.success("Default resume updated");
  }

  function confirmDelete() {
    if (!deleteId) return;
    setResumes((rs) => rs.filter((r) => r.id !== deleteId));
    toast.success("Resume deleted");
    setDeleteId(null);
  }

  function createFromProfile() {
    const id = `r_${Date.now()}`;
    setResumes((rs) => [
      ...rs,
      {
        id,
        name: `${profile.name} — Profile Snapshot`,
        lastUpdated: new Date().toISOString(),
        sizeKb: 142,
        isDefault: false,
        source: "generated",
      },
    ]);
    toast.success("Resume created from profile", {
      description: "You can edit and tailor it before sending.",
    });
  }

  function download(r: ResumeVersion) {
    toast.success(`Downloading ${r.name}.pdf`, {
      description: `${r.sizeKb} KB · generated on ${formatDate(r.lastUpdated)}`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume & CV"
        description="Upload, parse, and manage multiple resume versions tailored for different roles."
        actions={[
          {
            label: "Upload resume",
            variant: "default",
            onClick: () => setUploadOpen(true),
          },
          {
            label: "Create from profile",
            variant: "outline",
            onClick: createFromProfile,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Resume list */}
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="My resumes" description="Pick a default resume used for one-click applications.">
            <div className="space-y-3">
              {resumes.length === 0 ? (
                <EmptyState
                  icon={<Icon name="FileText" className="h-5 w-5" />}
                  title="No resumes yet"
                  description="Upload an existing resume or generate one from your profile."
                  action={
                    <Button onClick={() => setUploadOpen(true)}>Upload resume</Button>
                  }
                />
              ) : (
                resumes.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon name="FileText" className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{r.name}</p>
                          {r.isDefault && (
                            <Badge className="bg-brand/10 text-brand">
                              <Icon name="BadgeCheck" className="h-3 w-3" /> Default
                            </Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {r.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Updated {formatDate(r.lastUpdated)} · {r.sizeKb} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewResume(r)}
                      >
                        <Icon name="Eye" className="h-4 w-4" /> Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => download(r)}
                      >
                        <Icon name="FileStack" className="h-4 w-4" /> Download
                      </Button>
                      {!r.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefault(r.id)}
                        >
                          Set default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Icon name="AlertTriangle" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right: resume tips + completeness */}
        <div className="space-y-4">
          <SectionCard title="Resume tips" description="Maximize recruiter attention.">
            <ul className="space-y-2 text-sm">
              {[
                "Tailor each resume to the job description.",
                "Lead with measurable impact (e.g. 'Improved LCP by 45%').",
                "Keep it to 1–2 pages max for 6+ years experience.",
                "Use AI parse to verify skills are detected.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon name="BadgeCheck" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {tip}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Profile completeness">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{profile.profileCompleteness}% complete</span>
                <span className="text-muted-foreground">
                  {profile.profileCompleteness >= 90 ? "Excellent" : "Needs work"}
                </span>
              </div>
              <Progress value={profile.profileCompleteness} className="h-2" />
              <p className="text-xs text-muted-foreground">
                A complete profile is used as the source for resume generation.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={(name) => {
          const id = `r_${Date.now()}`;
          setResumes((rs) => [
            ...rs,
            {
              id,
              name,
              lastUpdated: new Date().toISOString(),
              sizeKb: 180 + Math.floor(Math.random() * 80),
              isDefault: false,
              source: "upload",
            },
          ]);
        }}
      />

      <PreviewDialog
        resume={previewResume}
        profile={profile}
        onClose={() => setPreviewResume(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The resume file will be permanently
              removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUploaded: (name: string) => void;
}) {
  const [fileName, setFileName] = React.useState("");
  const [stage, setStage] = React.useState<"idle" | "parsing" | "done">("idle");
  const [parsed, setParsed] = React.useState<ParsedResume | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setFileName("");
      setStage("idle");
      setParsed(null);
      setDragOver(false);
    }
  }, [open]);

  function handleFile(file: File) {
    setFileName(file.name);
    setStage("parsing");
    setParsed(null);
    aiService
      .parseResume(file.name)
      .then((res) => {
        setParsed(res as ParsedResume);
        setStage("done");
      })
      .catch(() => {
        toast.error("Parse failed", { description: "Try again or upload manually." });
        setStage("idle");
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload resume</DialogTitle>
          <DialogDescription>
            PDF, DOC, or DOCX up to 5MB. We&apos;ll parse fields automatically.
          </DialogDescription>
        </DialogHeader>

        {stage === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragOver ? "border-brand bg-brand/5" : "border-border"
            }`}
          >
            <Icon name="FileStack" className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Drag & drop your resume</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}

        {stage === "parsing" && (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="text-sm font-medium">Parsing {fileName}…</p>
            <p className="text-xs text-muted-foreground">
              Extracting skills, experience, and education.
            </p>
          </div>
        )}

        {stage === "done" && parsed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="h-5 w-5 text-brand" />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <Badge className="gap-1 bg-brand/10 text-brand">
                <Icon name="Sparkles" className="h-3 w-3" /> Simulated AI
              </Badge>
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Extraction confidence</span>
                <span className="font-medium text-brand">
                  {Math.round(parsed.confidence * 100)}%
                </span>
              </div>
              <Progress value={parsed.confidence * 100} className="h-1.5" />
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <Field label="Name" value={parsed.name} />
              <Field label="Headline" value={parsed.headline} />
              <Field label="Experience" value={`${parsed.experienceYears} years`} />
              <Field label="Education" value={parsed.education} />
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Skills</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {parsed.skills.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <DialogFooter>
          {stage === "done" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Discard
              </Button>
              <Button
                onClick={() => {
                  onUploaded(fileName || "Untitled resume");
                  toast.success("Resume uploaded", {
                    description: "Parsed fields are saved to your profile draft.",
                  });
                  onOpenChange(false);
                }}
              >
                Save resume
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function PreviewDialog({
  resume,
  profile,
  onClose,
}: {
  resume: ResumeVersion | null;
  profile: CandidateProfile;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!resume} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resume?.name ?? "Resume"}</DialogTitle>
          <DialogDescription>
            Rendered preview from your profile data.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-white p-6 text-black dark:bg-white">
          <div className="flex items-start justify-between border-b pb-3">
            <div>
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.headline}</p>
              <p className="text-xs text-gray-500">
                {profile.location} · {profile.email}
                {profile.phone ? ` · ${profile.phone}` : ""}
              </p>
            </div>
            <AvatarLogo text={profile.name} size="lg" />
          </div>
          <section className="mt-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Summary
            </h4>
            <p className="mt-1 text-sm">{profile.summary}</p>
          </section>
          <section className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Experience
            </h4>
            <div className="mt-1 space-y-3">
              {profile.experience.map((e) => (
                <div key={e.id}>
                  <p className="text-sm font-medium">
                    {e.title} · <span className="text-gray-700">{e.company}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {e.startDate} — {e.current ? "Present" : e.endDate}
                  </p>
                  <p className="mt-1 text-sm">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Skills
            </h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {profile.skills.map((s) => (
                <span
                  key={s.skill}
                  className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-xs"
                >
                  {s.skill}
                </span>
              ))}
            </div>
          </section>
          <section className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Education
            </h4>
            <div className="mt-1 space-y-2">
              {profile.education.map((e) => (
                <div key={e.id}>
                  <p className="text-sm font-medium">
                    {e.degree} · {e.field}
                  </p>
                  <p className="text-xs text-gray-500">{e.institution}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              if (resume) {
                toast.success(`Downloading ${resume.name}.pdf`, {
                  description: `${resume.sizeKb} KB`,
                });
              }
            }}
          >
            <Icon name="FileStack" className="h-4 w-4" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
