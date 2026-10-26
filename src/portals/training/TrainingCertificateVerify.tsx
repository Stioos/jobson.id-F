"use client";

import * as React from "react";
import { certificates, trainingCompany, certificateTemplates } from "@/lib/lms-data";
import type { Certificate } from "@/lib/types";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TenantDisclaimer } from "./_shared";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  ShieldCheck, Search, Download, Share2, Award, CheckCircle2, XCircle,
  Clock, Building2, Calendar, Link as LinkIcon, BadgeCheck,
} from "lucide-react";

export function TrainingCertificateVerify() {
  const [certId, setCertId] = React.useState(certificates[0]?.certificateId ?? "");
  const [result, setResult] = React.useState<Certificate | null | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  // Auto-verify on mount with first cert ID
  React.useEffect(() => {
    if (certificates[0]) {
      setLoading(true);
      const t = setTimeout(() => {
        setResult(certificates[0]);
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
      const found = certificates.find(
        (c) => c.certificateId.toLowerCase() === target.toLowerCase(),
      );
      setResult(found ?? null);
      setLoading(false);
      if (found) toast.success("Certificate verified");
      else toast.error("Certificate not found");
    }, 500);
  }

  const template = result
    ? certificateTemplates.find((t) => t.name === result.template)
    : undefined;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certificate verification"
        description="Verify the authenticity of a SkillForge Academy certificate. Enter the certificate ID below."
        icon={<ShieldCheck className="h-6 w-6" />}
      />
      <TenantDisclaimer />

      <div className="mx-auto max-w-2xl space-y-5">
        <Card className="p-5">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              verify();
            }}
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="cert-id">Certificate ID</Label>
              <Input
                id="cert-id"
                placeholder="e.g. SF-CERT-2024-10001"
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
            Try: <code className="rounded bg-muted px-1">SF-CERT-2024-10001</code>, <code className="rounded bg-muted px-1">SF-CERT-2024-10002</code>, or <code className="rounded bg-muted px-1">INVALID-123</code> to see the not-found state.
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
            action={<Button variant="outline" onClick={() => verify(certificates[0]?.certificateId ?? "")}>Try a sample</Button>}
          />
        )}

        {!loading && result && (
          <>
            <Card className="overflow-hidden">
              <div className="border-b bg-brand/5 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-brand">
                  <CheckCircle2 className="h-4 w-4" />
                  Certificate verified
                </div>
              </div>

              {/* Certificate visual mockup */}
              <div className="relative p-8">
                <div
                  className="absolute inset-2 rounded-lg border-4"
                  style={{ borderColor: "oklch(0.55 0.13 165)" }}
                />
                <div className="relative text-center">
                  <div className="mb-2 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <Award className="h-4 w-4 text-brand" />
                    {trainingCompany.name}
                  </div>
                  <h1 className="text-2xl font-serif font-bold">Certificate of Completion</h1>
                  <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">This is to certify that</p>
                  <p className="mt-1 text-xl font-semibold">{result.learnerName}</p>
                  <p className="mt-2 text-xs text-muted-foreground">has successfully completed</p>
                  <p className="mt-1 text-base font-medium">{result.courseName}</p>

                  <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-4 text-left text-xs">
                    <div>
                      <p className="text-muted-foreground">Issued</p>
                      <p className="font-medium">{formatDate(result.issueDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">
                        {result.expiryDate ? formatDate(result.expiryDate) : "No expiry"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Template</p>
                      <p className="font-medium">{result.template}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs">
                    <div className="text-left">
                      <p className="font-serif italic">{result.issuer}</p>
                      <div className="mt-1 h-px w-32 bg-muted" />
                      <p className="mt-1 text-muted-foreground">Issuing Authority</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <BadgeCheck className="h-10 w-10 text-brand" />
                      <span className="mt-1 font-mono text-[10px]">{result.certificateId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-3 border-t p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailRow icon={<Award className="h-4 w-4" />} label="Course" value={result.courseName} />
                  <DetailRow icon={<Building2 className="h-4 w-4" />} label="Issuer" value={result.issuer} />
                  <DetailRow icon={<Calendar className="h-4 w-4" />} label="Issue date" value={formatDate(result.issueDate)} />
                  <DetailRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Expiry date"
                    value={result.expiryDate ? `${formatDate(result.expiryDate)} (${daysUntil(result.expiryDate)}d)` : "Lifetime"}
                  />
                  <DetailRow icon={<LinkIcon className="h-4 w-4" />} label="Verify URL" value={result.verifyUrl} mono />
                  <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" /> Status
                    </span>
                    <StatusBadge status={result.status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" onClick={() => toast.success("Generating PDF download…")}>
                    <Download className="mr-2 h-3.5 w-3.5" /> Download PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Share link copied to clipboard")}>
                    <Share2 className="mr-2 h-3.5 w-3.5" /> Share
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(result.verifyUrl).catch(() => {});
                      toast.success("Verification link copied");
                    }}
                  >
                    <LinkIcon className="mr-2 h-3.5 w-3.5" /> Copy verify link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust & accreditation */}
            <Card className="p-4">
              <CardTitle className="mb-2 text-sm">Issuer accreditation & trust</CardTitle>
              <div className="flex flex-wrap gap-2">
                {trainingCompany.accreditation.map((a) => (
                  <Badge key={a} variant="secondary" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {a}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {trainingCompany.name} is verified by national and international bodies. This certificate
                is cryptographically signed and verifiable via the public verify URL above.
              </p>
            </Card>

            {template && (
              <Card className="p-4">
                <CardTitle className="mb-1 text-sm">Template: {template.name}</CardTitle>
                <CardDescription>{template.design}</CardDescription>
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.fields.map((f) => (
                    <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                  ))}
                </div>
              </Card>
            )}

            <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center text-xs text-muted-foreground">
              This is a simulated verification for demo purposes. The certificate data above is illustrative and not legally binding.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  icon, label, value, mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon} {label}
      </span>
      <span className={"text-right text-xs font-medium " + (mono ? "font-mono" : "")}>{value}</span>
    </div>
  );
}
