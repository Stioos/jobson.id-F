"use client";

import * as React from "react";
import { formTemplates } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Award, Search, Download, Plus, ShieldCheck, Eye, Ban, FileCheck } from "lucide-react";

interface IssuedCertificate {
  id: string;
  student: string;
  course: string;
  issueDate: string;
  certificateId: string;
  verifyUrl: string;
  status: "active" | "revoked" | "expired";
}

const ISSUED: IssuedCertificate[] = [
  { id: "cert_001", student: "Aarav Sharma", course: "Full-Stack Engineering Program", issueDate: new Date(Date.now() - 30 * 86400000).toISOString(), certificateId: "JN-FE-2024-001", verifyUrl: "https://verify.jobson.id/c/JN-FE-2024-001", status: "active" },
  { id: "cert_002", student: "Divya Lakshmi", course: "Data Science & Analytics", issueDate: new Date(Date.now() - 25 * 86400000).toISOString(), certificateId: "JN-DS-2024-002", verifyUrl: "https://verify.jobson.id/c/JN-DS-2024-002", status: "active" },
  { id: "cert_003", student: "Karthik Reddy", course: "Cloud & DevOps Engineering", issueDate: new Date(Date.now() - 60 * 86400000).toISOString(), certificateId: "JN-CD-2024-003", verifyUrl: "https://verify.jobson.id/c/JN-CD-2024-003", status: "active" },
  { id: "cert_004", student: "Meera Iyer", course: "UI/UX Design Program", issueDate: new Date(Date.now() - 45 * 86400000).toISOString(), certificateId: "JN-UX-2024-004", verifyUrl: "https://verify.jobson.id/c/JN-UX-2024-004", status: "revoked" },
  { id: "cert_005", student: "Sanjay Gupta", course: "Cybersecurity Essentials", issueDate: new Date(Date.now() - 90 * 86400000).toISOString(), certificateId: "JN-CS-2024-005", verifyUrl: "https://verify.jobson.id/c/JN-CS-2024-005", status: "active" },
  { id: "cert_006", student: "Priya Menon", course: "Digital Marketing Mastery", issueDate: new Date(Date.now() - 15 * 86400000).toISOString(), certificateId: "JN-DM-2024-006", verifyUrl: "https://verify.jobson.id/c/JN-DM-2024-006", status: "active" },
  { id: "cert_007", student: "Rohit Nair", course: "Full-Stack Engineering Program", issueDate: new Date(Date.now() - 120 * 86400000).toISOString(), certificateId: "JN-FE-2024-007", verifyUrl: "https://verify.jobson.id/c/JN-FE-2024-007", status: "expired" },
  { id: "cert_008", student: "Anika Reddy", course: "Data Science & Analytics", issueDate: new Date(Date.now() - 10 * 86400000).toISOString(), certificateId: "JN-DS-2024-008", verifyUrl: "https://verify.jobson.id/c/JN-DS-2024-008", status: "active" },
];

export function PartnerCertificates() {
  const partner = CURRENT_PARTNER;
  const [issued, setIssued] = React.useState<IssuedCertificate[]>(ISSUED);
  const [search, setSearch] = React.useState("");
  const [issueOpen, setIssueOpen] = React.useState(false);
  const [revokeTarget, setRevokeTarget] = React.useState<IssuedCertificate | null>(null);
  const [verifyInput, setVerifyInput] = React.useState("");
  const [verifyResult, setVerifyResult] = React.useState<"valid" | "invalid" | null>(null);

  const certificateTemplates = formTemplates.filter((f) => f.type === "certificate");
  const filteredIssued = issued.filter((c) => !search || `${c.student} ${c.course} ${c.certificateId}`.toLowerCase().includes(search.toLowerCase()));
  const activeCount = issued.filter((c) => c.status === "active").length;
  const revokedCount = issued.filter((c) => c.status === "revoked").length;
  const expiredCount = issued.filter((c) => c.status === "expired").length;

  function revoke() {
    if (!revokeTarget) return;
    setIssued((prev) => prev.map((c) => (c.id === revokeTarget.id ? { ...c, status: "revoked" } : c)));
    toast.success("Certificate revoked", { description: `${revokeTarget.certificateId} has been revoked.` });
    setRevokeTarget(null);
  }

  function verify() {
    if (!verifyInput.trim()) { toast.error("Enter a certificate ID"); return; }
    const found = issued.find((c) => c.certificateId.toLowerCase() === verifyInput.trim().toLowerCase());
    setVerifyResult(found && found.status === "active" ? "valid" : "invalid");
    if (found && found.status === "active") toast.success("Certificate verified", { description: `${found.student} — ${found.course}` });
    else toast.error("Certificate invalid", { description: "Not found, revoked, or expired." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description={`${partner.name} — issue, track, verify, and manage student certificates.`}
        icon={<Icon name="Award" className="h-6 w-6" />}
        actions={[{ label: "Issue Certificate", icon: "Plus", onClick: () => setIssueOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Issued" value={issued.length} icon={<Award className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Revoked" value={revokedCount} icon={<Ban className="h-5 w-5" />} tone="danger" />
        <StatCard label="Expired" value={expiredCount} icon={<FileCheck className="h-5 w-5" />} tone="warning" />
      </div>

      <Tabs defaultValue="issued">
        <TabsList>
          <TabsTrigger value="issued">Issued ({issued.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({certificateTemplates.length})</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>

        <TabsContent value="issued" className="space-y-3">
          <Card className="p-4">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student, course, or certificate ID..." className="h-9 w-full pl-8 sm:w-80" />
            </div>
            <div className="max-h-[480px] overflow-y-auto scroll-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssued.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No certificates found.</TableCell></TableRow>
                  ) : filteredIssued.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={c.student} size="sm" />
                          <span className="font-medium">{c.student}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.course}</TableCell>
                      <TableCell><span className="font-mono text-xs">{c.certificateId}</span></TableCell>
                      <TableCell className="text-xs">{formatDate(c.issueDate)}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toast.success("Download started", { description: `${c.certificateId}.pdf downloading.` })}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(c.verifyUrl); toast.success("Verify URL copied"); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {c.status === "active" && (
                            <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setRevokeTarget(c)}>
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {certificateTemplates.map((t) => (
              <Card key={t.id} className="p-4 hover:border-brand hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Award className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{t.category}</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{t.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">Updated {formatDate(t.lastUpdated)}</p>
                <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => toast.success("Template downloaded", { description: `${t.name}.pdf downloading.` })}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verify" className="space-y-3">
          <Card className="p-6 max-w-xl">
            <div className="text-center mb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="mt-3 font-semibold">Verify a Certificate</h3>
              <p className="mt-1 text-xs text-muted-foreground">Enter the certificate ID to verify its authenticity.</p>
            </div>
            <div className="flex gap-2">
              <Input value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} placeholder="e.g. JN-FE-2024-001" />
              <Button onClick={verify}>Verify</Button>
            </div>
            {verifyResult === "valid" && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
                <p className="font-semibold text-emerald-700">✓ Valid Certificate</p>
                <p className="mt-1 text-emerald-700/80">This certificate is active and verified.</p>
              </div>
            )}
            {verifyResult === "invalid" && (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
                <p className="font-semibold text-rose-700">✗ Invalid Certificate</p>
                <p className="mt-1 text-rose-700/80">This certificate ID was not found, has been revoked, or has expired.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Issue certificate dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue New Certificate</DialogTitle>
            <DialogDescription>Issue a certificate to a student for a completed program.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Certificate issued", { description: "Certificate ID generated and emailed to student." }); setIssueOpen(false); }} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Student Name *</Label>
              <Input required placeholder="e.g. Aarav Sharma" />
            </div>
            <div className="space-y-1.5">
              <Label>Course / Program *</Label>
              <Input required placeholder="e.g. Full-Stack Engineering Program" />
            </div>
            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select defaultValue={certificateTemplates[0]?.id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {certificateTemplates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIssueOpen(false)}>Cancel</Button>
              <Button type="submit">Issue Certificate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Revoke confirm */}
      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke certificate <span className="font-mono">{revokeTarget?.certificateId}</span> issued to {revokeTarget?.student}. The certificate will be marked as invalid for verification purposes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={revoke} className="bg-rose-600 hover:bg-rose-700">Revoke Certificate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
