"use client";

import * as React from "react";
import { certificates, certificateTemplates, trainingCourses, learnerEnrollments } from "@/lib/lms-data";
import type { Certificate } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, daysUntil } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Award, Search, CheckCircle2, AlertTriangle, ExternalLink, Ban, Download } from "lucide-react";

export function TrainingCertifications() {
  const [rows, setRows] = React.useState<Certificate[]>(certificates);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [issueOpen, setIssueOpen] = React.useState(false);
  const [revoke, setRevoke] = React.useState<Certificate | null>(null);

  // issue form state
  const [learnerName, setLearnerName] = React.useState("");
  const [courseId, setCourseId] = React.useState(trainingCourses[0]?.id ?? "");
  const [template, setTemplate] = React.useState(certificateTemplates[0]?.name ?? "Standard");

  const filtered = rows.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch = c.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      c.learnerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const activeCount = rows.filter((c) => c.status === "active").length;
  const expiringCount = rows.filter((c) => c.status === "expiring").length;
  const expiringSoon = rows.filter((c) => c.expiryDate && daysUntil(c.expiryDate) <= 60 && c.status !== "expired").length;

  function issue() {
    if (!learnerName.trim()) { toast.error("Learner name required"); return; }
    const course = trainingCourses.find((c) => c.id === courseId);
    const newCert: Certificate = {
      id: `cert_new_${Date.now()}`,
      certificateId: `SF-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
      learnerId: `e_new_${Date.now()}`,
      learnerName,
      courseId,
      courseName: course?.name ?? "",
      issuer: "SkillForge Academy",
      issueDate: new Date().toISOString(),
      status: "active",
      template,
      verifyUrl: `https://verify.skillforge.academy/${Date.now()}`,
    };
    setRows((r) => [newCert, ...r]);
    setIssueOpen(false);
    setLearnerName("");
    toast.success(`Certificate issued — ${newCert.certificateId}`, { description: `Awarded to ${learnerName}` });
  }

  function confirmRevoke() {
    if (!revoke) return;
    setRows((r) => r.map((x) => x.id === revoke.id ? { ...x, status: "revoked" } : x));
    toast.success(`Certificate revoked — ${revoke.certificateId}`);
    setRevoke(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certifications"
        description="Issue, verify, and manage learner certificates."
        icon={<Icon name="Award" className="h-6 w-6" />}
        actions={[{ label: "Issue certificate", icon: "Plus", onClick: () => setIssueOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Issued" value={rows.length} icon={<Award className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring Soon" value={expiringSoon} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expiring" value={expiringCount} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by cert ID or learner..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Award className="h-5 w-5" />} title="No certificates found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cert ID</TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.certificateId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={c.learnerName} size="xs" />
                        <span className="text-sm font-medium">{c.learnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{c.courseName}</TableCell>
                    <TableCell className="text-sm">{c.template}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.issueDate)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.expiryDate ? formatDate(c.expiryDate) : "—"}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Verifying: ${c.certificateId}`)} title="Verify"><ExternalLink className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading: ${c.certificateId}`)} title="Download"><Download className="h-4 w-4" /></Button>
                        {c.status !== "revoked" && (
                          <Button variant="ghost" size="sm" onClick={() => setRevoke(c)} title="Revoke"><Ban className="h-4 w-4 text-rose-500" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {expiringSoon > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-700 dark:text-amber-400">{expiringSoon} certificate(s) expiring within 60 days</p>
            <p className="text-muted-foreground">Notify learners and plan recertification.</p>
          </div>
        </div>
      )}

      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>Award a certificate to a learner.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-learner">Learner name *</Label>
              <Input id="cert-learner" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} className="mt-1" list="learners-list" />
              <datalist id="learners-list">
                {Array.from(new Set(learnerEnrollments.map((e) => e.learnerName))).map((n) => <option key={n} value={n} />)}
              </datalist>
            </div>
            <div>
              <Label>Course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{certificateTemplates.filter((t) => t.status === "active").map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={issue}>Issue certificate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!revoke} onOpenChange={(o) => !o && setRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke <span className="font-medium">{revoke?.certificateId}</span> issued to {revoke?.learnerName}. The verification URL will return "revoked" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevoke} className="bg-rose-600 hover:bg-rose-700">Revoke</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
