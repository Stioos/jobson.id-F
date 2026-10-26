"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { learnerCertificates, trainingCourses } from "@/lib/lms-data";
import type { LearnerCertificate } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LearnerDisclaimer, LEARNER_ID,
} from "./_shared";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  Award, Download, Share2, ExternalLink, ShieldCheck, AlertTriangle,
  Calendar as CalendarIcon, Clock, Trophy,
} from "lucide-react";

export function LearnerCertificates() {
  const { navigate } = useNav();
  const myCerts = learnerCertificates.filter((c) => c.learnerId === LEARNER_ID);

  const active = myCerts.filter((c) => c.status === "active");
  const expiring = myCerts.filter((c) => c.status === "expiring");
  const expired = myCerts.filter((c) => c.status === "expired");

  const expiringSoon = myCerts.filter((c) => {
    if (!c.expiryDate) return false;
    const d = daysUntil(c.expiryDate);
    return d >= 0 && d <= 90;
  });

  function courseFor(cert: LearnerCertificate) {
    return trainingCourses.find((c) => c.id === cert.courseId);
  }

  function download(cert: LearnerCertificate) {
    toast.success(`Downloading "${cert.courseName}" certificate`, {
      description: `Certificate ID: ${cert.certificateId}`,
    });
  }
  function shareLinkedIn(cert: LearnerCertificate) {
    toast.success("Opening LinkedIn share dialog", {
      description: `Add "${cert.courseName}" to your LinkedIn profile`,
    });
  }
  function verify(cert: LearnerCertificate) {
    toast.success("Opening verification page", {
      description: cert.verifyUrl,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Certificates"
        description="Your verifiable credentials — share them with recruiters and on LinkedIn."
        icon={<Award className="h-5 w-5" />}
      />

      <LearnerDisclaimer />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SectionCard title="Total certs" className="p-4">
          <p className="text-2xl font-bold">{myCerts.length}</p>
        </SectionCard>
        <SectionCard title="Active" className="p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{active.length}</p>
        </SectionCard>
        <SectionCard title="Expiring soon" className="p-4">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{expiring.length + expiringSoon.length}</p>
        </SectionCard>
        <SectionCard title="Avg score" className="p-4">
          <p className="text-2xl font-bold text-brand">
            {myCerts.length > 0
              ? Math.round(myCerts.reduce((s, c) => s + c.score, 0) / myCerts.length)
              : 0}%
          </p>
        </SectionCard>
      </div>

      {/* Expiring soon alert */}
      {expiringSoon.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {expiringSoon.length} certificate{expiringSoon.length > 1 ? "s" : ""} expiring within 90 days
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {expiringSoon.map((c) => c.courseName).join(", ")} — retake the assessment to renew.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("candidate", "catalog")}>
            Renew
          </Button>
        </div>
      )}

      {myCerts.length === 0 ? (
        <EmptyState
          icon={<Award className="h-5 w-5" />}
          title="No certificates yet"
          description="Complete a course to earn your first SkillForge certificate."
          action={<Button onClick={() => navigate("candidate", "catalog")}>Browse courses</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myCerts.map((cert) => {
            const course = courseFor(cert);
            return (
              <div
                key={cert.id}
                className="overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
              >
                {/* Certificate "paper" */}
                <div className="relative bg-gradient-to-br from-brand/5 via-card to-brand/5 p-5">
                  <div className="absolute right-3 top-3">
                    <StatusBadge status={cert.status} />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand/30 bg-brand/10">
                      <Award className="h-6 w-6 text-brand" />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Certificate of Completion
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Awarded to</p>
                    <p className="text-base font-bold">{cert.learnerName}</p>
                    <div className="my-2 h-px w-12 bg-brand/40" />
                    <p className="text-[10px] text-muted-foreground">for successfully completing</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold">{cert.courseName}</p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {formatDate(cert.issueDate)}
                      </span>
                      {cert.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> exp {formatDate(cert.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-[10px]">
                    <span className="text-muted-foreground">ID: {cert.certificateId}</span>
                    <span className="flex items-center gap-1 text-brand">
                      <ShieldCheck className="h-3 w-3" /> SkillForge Academy
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-3 p-4">
                  {/* Score */}
                  <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Trophy className="h-3.5 w-3.5" /> Final score
                    </span>
                    <span className="text-sm font-bold text-brand">{cert.score}%</span>
                  </div>

                  {course && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AvatarLogo text={course.instructorName} size="xs" />
                      <span>Instructor: {course.instructorName}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => download(cert)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> Download PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => shareLinkedIn(cert)}
                    >
                      <Share2 className="mr-1 h-3.5 w-3.5" /> LinkedIn
                    </Button>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="w-full">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" /> Verify online
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Verify certificate</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will open the public verification page for certificate{" "}
                          <span className="font-mono font-medium">{cert.certificateId}</span>.
                          Anyone with this link can verify your credential.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => verify(cert)}>
                          Open verification
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
