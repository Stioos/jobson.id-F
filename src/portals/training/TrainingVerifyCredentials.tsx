"use client";

import * as React from "react";
import {
  learnerCertificates,
  individualLearners,
  learnerCourseEnrollments,
  trainingCompany,
} from "@/lib/lms-data";
import type { LearnerCertificate, IndividualLearner } from "@/lib/lms-data";
import {
  PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription,
  SectionCard, StatCard, StatusBadge, EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { formatDate, formatDateTime, timeAgo, daysUntil } from "@/lib/format";
import { TenantDisclaimer, SimulatedAiBadge } from "./_shared";
import { toast } from "sonner";
import {
  ShieldCheck, Search, Download, Award, CheckCircle2, XCircle,
  Clock, Calendar, Link as LinkIcon, BadgeCheck, ListChecks, Sparkles,
  UserCheck, FileText,
} from "lucide-react";

// ---------- types ----------

interface VerificationRecord {
  id: string;
  certificateId: string;
  learnerName: string;
  courseName: string;
  status: "valid" | "not_found";
  verifiedAt: string;
  verifiedBy: string;
}

// mock recent verifications (recruiter-facing)
const RECENT_VERIFICATIONS: VerificationRecord[] = [
  { id: "v_001", certificateId: "SF-LC-2024-30001", learnerName: "Aditya Rao", courseName: "Kubernetes for Developers (CKA Bootcamp)", status: "valid", verifiedAt: new Date(Date.now() - 2 * 3600000).toISOString(), verifiedBy: "Sneha Reddy" },
  { id: "v_002", certificateId: "SF-LC-2024-30006", learnerName: "Sanjay Pillai", courseName: "DPDP Act & Data Privacy Compliance", status: "valid", verifiedAt: new Date(Date.now() - 5 * 3600000).toISOString(), verifiedBy: "Rohan Mehta" },
  { id: "v_003", certificateId: "SF-LC-2024-30009", learnerName: "Shreya Nair", courseName: "Executive Leadership Program", status: "valid", verifiedAt: new Date(Date.now() - 26 * 3600000).toISOString(), verifiedBy: "Anil Kumar" },
  { id: "v_004", certificateId: "INVALID-XYZ-999", learnerName: "—", courseName: "—", status: "not_found", verifiedAt: new Date(Date.now() - 48 * 3600000).toISOString(), verifiedBy: "Anonymous" },
];

// ---------- main page ----------

export function TrainingVerifyCredentials() {
  const [certId, setCertId] = React.useState(learnerCertificates[0]?.certificateId ?? "");
  const [result, setResult] = React.useState<LearnerCertificate | null | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [batchInput, setBatchInput] = React.useState("");
  const [batchResults, setBatchResults] = React.useState<{ id: string; cert: LearnerCertificate | null }[] | null>(null);
  const [batchLoading, setBatchLoading] = React.useState(false);

  // Auto-verify on mount with first cert ID
  React.useEffect(() => {
    if (learnerCertificates[0]) {
      setLoading(true);
      const t = setTimeout(() => {
        setResult(learnerCertificates[0]);
        setLoading(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, []);

  function verify(id?: string) {
    const target = (id ?? certId).trim();
    if (!target) {
      toast.error("Enter a certificate ID to verify");
      return;
    }
    setLoading(true);
    setResult(undefined);
    setTimeout(() => {
      const found = learnerCertificates.find((c) => c.certificateId.toLowerCase() === target.toLowerCase());
      setResult(found ?? null);
      setLoading(false);
      if (found) toast.success("Certificate verified", { description: `${found.learnerName} · ${found.courseName}` });
      else toast.error("Certificate not found", { description: "ID not in registry." });
    }, 500);
  }

  function runBatch() {
    const ids = batchInput.split(/[\s,\n]+/).map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      toast.error("Paste at least one certificate ID");
      return;
    }
    setBatchLoading(true);
    setBatchResults(null);
    setTimeout(() => {
      const results = ids.map((id) => ({
        id,
        cert: learnerCertificates.find((c) => c.certificateId.toLowerCase() === id.toLowerCase()) ?? null,
      }));
      setBatchResults(results);
      setBatchLoading(false);
      const valid = results.filter((r) => r.cert).length;
      toast.success(`Batch verified — ${valid}/${results.length} valid`, { description: `${results.length - valid} not found.` });
    }, 800);
  }

  function downloadReport(cert: LearnerCertificate) {
    toast.success("Verification report queued", {
      description: `PDF report for ${cert.certificateId} will be emailed shortly.`,
    });
  }

  const learner = result ? individualLearners.find((l) => l.id === result.learnerId) : undefined;
  const learnerCerts = learner ? learnerCertificates.filter((c) => c.learnerId === learner.id) : [];
  const verifiedSkills = learner ? learner.skills.filter((s) => s.verified) : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Verify Credentials"
        description="Public-facing certificate verification for recruiters, employers, and partner clients. Confirm a candidate's SkillForge Academy credentials."
        icon={<ShieldCheck className="h-6 w-6" />}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active certificates" value={learnerCertificates.length} icon={<Award className="h-5 w-5" />} tone="brand" />
        <StatCard label="Certified learners" value={new Set(learnerCertificates.map((c) => c.learnerId)).size} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="Verified skills" value={individualLearners.reduce((s, l) => s + l.skills.filter((x) => x.verified).length, 0)} icon={<BadgeCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Recent verifications" value={RECENT_VERIFICATIONS.length} icon={<Search className="h-5 w-5" />} hint="last 48h" />
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
        <div className="flex items-center gap-2">
          <SimulatedAiBadge />
          <span className="text-muted-foreground">Simulated verification — this is a recruiter-friendly demo. In production, verification calls a signed registry API.</span>
        </div>
      </div>

      <Tabs defaultValue="single">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single verify</TabsTrigger>
          <TabsTrigger value="batch">Batch verify</TabsTrigger>
        </TabsList>

        {/* Single verify */}
        <TabsContent value="single" className="mt-4 space-y-5">
          <Card className="p-5">
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(e) => { e.preventDefault(); verify(); }}
            >
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="cert-id">Certificate ID</Label>
                <Input
                  id="cert-id"
                  placeholder="e.g. SF-LC-2024-30001"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Verifying…" : "Verify"}
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Try: <code className="rounded bg-muted px-1">SF-LC-2024-30001</code>, <code className="rounded bg-muted px-1">SF-LC-2024-30006</code>, or <code className="rounded bg-muted px-1">INVALID-123</code> to see the not-found state.
            </p>
          </Card>

          {loading && (
            <Card className="p-10">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <p className="text-sm">Checking certificate registry…</p>
              </div>
            </Card>
          )}

          {!loading && result === null && (
            <EmptyState
              icon={<XCircle className="h-6 w-6" />}
              title="Certificate not found"
              description="The certificate ID you entered does not match any record in our registry. Check the ID and try again."
              action={<Button variant="outline" onClick={() => verify(learnerCertificates[0]?.certificateId ?? "")}>Try a sample</Button>}
            />
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Certificate card */}
              <Card className="overflow-hidden">
                <div className="border-b bg-brand/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-brand">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified certificate
                    </div>
                    <StatusBadge status={result.status === "expiring" ? "warning" : result.status === "expired" ? "expired" : "active"} />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Award className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{trainingCompany.name}</p>
                        <h3 className="text-lg font-semibold">{result.courseName}</h3>
                        <p className="text-sm text-muted-foreground">Awarded to <span className="font-medium text-foreground">{result.learnerName}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Certificate ID</p>
                          <p className="font-mono text-xs font-medium">{result.certificateId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Issued</p>
                          <p className="text-xs font-medium">{formatDate(result.issueDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{result.expiryDate ? "Expires" : "Expiry"}</p>
                          <p className="text-xs font-medium">{result.expiryDate ? formatDate(result.expiryDate) : "No expiry"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-xs font-medium">{result.score}/100</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 border-t pt-3">
                        <Button size="sm" variant="outline" onClick={() => downloadReport(result)}>
                          <Download className="mr-1 h-3.5 w-3.5" /> Verification report
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening ${result.verifyUrl}`)}>
                          <LinkIcon className="mr-1 h-3.5 w-3.5" /> Public URL
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Public skill profile */}
              {learner && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Candidate's public skill profile</CardTitle>
                        <CardDescription className="mt-1">Verified skills and credentials for {learner.name}</CardDescription>
                      </div>
                      <AvatarLogo text={learner.name} size="md" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Headline</p>
                      <p className="text-sm">{learner.headline}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{learner.jobTitle} · {learner.experience} years · {learner.location}</p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verified skills ({verifiedSkills.length})</p>
                      {verifiedSkills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No verified skills yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {verifiedSkills.map((s) => (
                            <Badge key={s.name} variant="outline" className="border-emerald-500/30 bg-emerald-500/5">
                              <BadgeCheck className="mr-1 h-3 w-3 text-emerald-500" /> {s.name} · L{s.level}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">All certifications ({learnerCerts.length})</p>
                      <div className="space-y-1.5">
                        {learnerCerts.map((c) => {
                          const expiry = c.expiryDate ? daysUntil(c.expiryDate) : null;
                          return (
                            <div key={c.id} className="flex items-center gap-3 rounded-md border p-2.5">
                              <Award className="h-4 w-4 text-brand" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{c.courseName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {c.certificateId} · Issued {formatDate(c.issueDate)} · Score {c.score}
                                  {expiry !== null && expiry < 0 && " · Expired"}
                                  {expiry !== null && expiry >= 0 && expiry <= 30 && " · Expiring soon"}
                                </p>
                              </div>
                              <StatusBadge status={c.status === "expiring" ? "warning" : c.status === "expired" ? "expired" : "active"} />
                              <Button size="sm" variant="ghost" onClick={() => { setCertId(c.certificateId); verify(c.certificateId); }}>
                                Verify
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Public learning summary */}
                    <div className="grid grid-cols-3 gap-2 border-t pt-3">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{learner.coursesCompleted}</p>
                        <p className="text-xs text-muted-foreground">courses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{learner.learningHours}h</p>
                        <p className="text-xs text-muted-foreground">learning</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{learner.certificatesEarned}</p>
                        <p className="text-xs text-muted-foreground">certificates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Batch verify */}
        <TabsContent value="batch" className="mt-4 space-y-5">
          <Card className="p-5">
            <Label htmlFor="batch">Paste certificate IDs (one per line, comma, or space)</Label>
            <Textarea
              id="batch"
              placeholder={"SF-LC-2024-30001\nSF-LC-2024-30006\nSF-LC-2024-30009\nINVALID-999"}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              className="mt-2 font-mono text-xs"
              rows={6}
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={runBatch} disabled={batchLoading}>
                <ListChecks className="mr-2 h-4 w-4" />
                {batchLoading ? "Verifying…" : "Verify all"}
              </Button>
              <Button variant="outline" onClick={() => { setBatchInput("SF-LC-2024-30001\nSF-LC-2024-30006\nSF-LC-2024-30009\nINVALID-999"); setBatchResults(null); }}>
                Load sample IDs
              </Button>
              <Button variant="ghost" onClick={() => { setBatchInput(""); setBatchResults(null); }}>Clear</Button>
            </div>
          </Card>

          {batchLoading && (
            <Card className="p-10">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <p className="text-sm">Verifying batch…</p>
              </div>
            </Card>
          )}

          {!batchLoading && batchResults && (
            <SectionCard
              title="Batch results"
              description={`${batchResults.filter((r) => r.cert).length} of ${batchResults.length} valid`}
            >
              <div className="space-y-2">
                {batchResults.map((r) => (
                  <div key={r.id} className={`flex items-center gap-3 rounded-lg border p-3 ${r.cert ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
                    {r.cert ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-medium">{r.id}</p>
                      {r.cert ? (
                        <p className="truncate text-sm">{r.cert.learnerName} · {r.cert.courseName} · Score {r.cert.score}</p>
                      ) : (
                        <p className="text-sm text-rose-600 dark:text-rose-400">Not found in registry</p>
                      )}
                    </div>
                    {r.cert && (
                      <Button size="sm" variant="outline" onClick={() => { setCertId(r.cert!.certificateId); verify(r.cert!.certificateId); }}>
                        Details
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => toast.success("Batch report downloaded", { description: `${batchResults.filter((r) => r.cert).length}/${batchResults.length} valid` })}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Download report
                </Button>
              </div>
            </SectionCard>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent verifications log */}
      <SectionCard title="Recent verifications" description="Last 48 hours of verification activity from recruiters and employers">
        <div className="space-y-2">
          {RECENT_VERIFICATIONS.map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-lg border p-2.5">
              {v.status === "valid" ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs font-medium">{v.certificateId}</p>
                  <StatusBadge status={v.status === "valid" ? "active" : "expired"} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {v.learnerName} · {v.courseName}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">{v.verifiedBy}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(v.verifiedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
