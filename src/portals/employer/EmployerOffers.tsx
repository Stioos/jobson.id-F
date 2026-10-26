"use client";

import * as React from "react";
import { offers, jobs, employerJobsExtra, allApplications } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { Plus, Send, Eye, FileText, ArrowRight } from "lucide-react";
import type { JobOffer } from "@/lib/types";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");
const EMPLOYER_APPS = allApplications.filter((a) => EMPLOYER_JOBS.some((j) => j.id === a.jobId));

// Seed with FinEdge offer (Kavya) but treat as TechCorp's for demo richness + add a TechCorp draft
const INITIAL_OFFERS: JobOffer[] = [
  ...offers,
  {
    id: `of_${Date.now()}`,
    applicationId: "a_001",
    jobId: "j_001",
    jobTitle: "Senior Frontend Engineer (React/Next.js)",
    candidateName: "Priya Nair",
    employerName: "TechCorp India",
    salary: 2600000,
    currency: "INR",
    joiningBonus: 200000,
    stockOptions: "ESOPs worth ₹12L vesting over 4 years",
    benefits: ["Health insurance", "Hybrid work", "Learning budget", "Parental leave"],
    startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "draft",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
];

const WORKFLOW = ["draft", "pending_approval", "sent", "accepted"];

export function EmployerOffers() {
  const [list, setList] = React.useState<JobOffer[]>(INITIAL_OFFERS);
  const [tab, setTab] = React.useState<"all" | "draft" | "pending_approval" | "sent" | "accepted">("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [previewTarget, setPreviewTarget] = React.useState<JobOffer | null>(null);
  const [withdrawTarget, setWithdrawTarget] = React.useState<JobOffer | null>(null);
  const [form, setForm] = React.useState({
    applicationId: "",
    salary: "",
    joiningBonus: "",
    stockOptions: "",
    benefits: "",
    startDate: "",
    expiry: "14",
  });

  const filtered = tab === "all" ? list : list.filter((o) => o.status === tab);

  const create = () => {
    if (!form.applicationId || !form.salary) { toast.error("Application and salary are required"); return; }
    const app = EMPLOYER_APPS.find((a) => a.id === form.applicationId);
    if (!app) return;
    const job = EMPLOYER_JOBS.find((j) => j.id === app.jobId);
    const offer: JobOffer = {
      id: `of_${Date.now()}`,
      applicationId: app.id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      candidateName: app.candidateName,
      employerName: "TechCorp India",
      salary: Number(form.salary),
      currency: "INR",
      joiningBonus: form.joiningBonus ? Number(form.joiningBonus) : undefined,
      stockOptions: form.stockOptions || undefined,
      benefits: form.benefits.split(",").map((b) => b.trim()).filter(Boolean),
      startDate: form.startDate ? new Date(form.startDate).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "draft",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + Number(form.expiry) * 86400000).toISOString(),
    };
    setList([offer, ...list]);
    setCreateOpen(false);
    setForm({ applicationId: "", salary: "", joiningBonus: "", stockOptions: "", benefits: "", startDate: "", expiry: "14" });
    toast.success("Offer draft created", { description: `${offer.candidateName} — ${formatCurrency(offer.salary, offer.currency)}` });
  };

  const advance = (id: string, status: JobOffer["status"]) => {
    setList((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast.success(`Offer moved to ${status.replace("_", " ")}`);
  };

  const withdraw = () => {
    if (!withdrawTarget) return;
    setList((prev) => prev.map((o) => o.id === withdrawTarget.id ? { ...o, status: "withdrawn" } : o));
    setWithdrawTarget(null);
    toast.warning("Offer withdrawn");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers"
        description="Manage job offers, approvals, and acceptance"
        actions={[{ label: "Create offer", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All ({list.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({list.filter((o) => o.status === "draft").length})</TabsTrigger>
          <TabsTrigger value="pending_approval">Pending ({list.filter((o) => o.status === "pending_approval").length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({list.filter((o) => o.status === "sent").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({list.filter((o) => o.status === "accepted").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <SectionCard>
            {filtered.length === 0 ? (
              <EmptyState icon={<FileText className="h-5 w-5" />} title="No offers" description="Create an offer to get started." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((o) => {
                      const days = daysUntil(o.expiresAt);
                      const stepIdx = WORKFLOW.indexOf(o.status);
                      return (
                        <TableRow key={o.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <AvatarLogo text={o.candidateName} size="xs" />
                              <span className="text-sm font-medium">{o.candidateName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{o.jobTitle}</TableCell>
                          <TableCell className="text-right text-sm font-medium">{formatCurrency(o.salary, o.currency)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={o.status} />
                              {stepIdx >= 0 && (
                                <div className="hidden md:flex items-center gap-0.5">
                                  {WORKFLOW.map((s, i) => (
                                    <span key={s} className={`h-1 w-6 rounded-full ${i <= stepIdx ? "bg-brand" : "bg-muted"}`} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                          <TableCell className="text-xs">
                            <span className={days < 0 ? "text-rose-600" : days <= 2 ? "text-amber-600" : "text-muted-foreground"}>
                              {formatDate(o.expiresAt)} ({days < 0 ? "expired" : `${days}d`})
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setPreviewTarget(o)}><Eye className="h-3 w-3" /></Button>
                              {o.status === "draft" && <Button size="sm" variant="outline" onClick={() => advance(o.id, "pending_approval")}>Submit</Button>}
                              {o.status === "pending_approval" && <Button size="sm" onClick={() => advance(o.id, "sent")}><Send className="mr-1 h-3 w-3" /> Send</Button>}
                              {o.status === "sent" && <Button size="sm" variant="outline" onClick={() => advance(o.id, "accepted")}>Mark accepted</Button>}
                              {(o.status === "draft" || o.status === "pending_approval" || o.status === "sent") && (
                                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setWithdrawTarget(o)}>Withdraw</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create offer</DialogTitle>
            <DialogDescription>Draft an offer for a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
            <div className="space-y-1.5">
              <Label>Application *</Label>
              <Select value={form.applicationId} onValueChange={(v) => setForm({ ...form, applicationId: v })}>
                <SelectTrigger><SelectValue placeholder="Select candidate application" /></SelectTrigger>
                <SelectContent>
                  {EMPLOYER_APPS.map((a) => <SelectItem key={a.id} value={a.id}>{a.candidateName} — {a.jobTitle}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Annual salary (INR) *</Label>
                <Input type="number" placeholder="2600000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Joining bonus</Label>
                <Input type="number" placeholder="200000" value={form.joiningBonus} onChange={(e) => setForm({ ...form, joiningBonus: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Stock options</Label>
                <Input placeholder="ESOPs worth ₹12L vesting over 4 years" value={form.stockOptions} onChange={(e) => setForm({ ...form, stockOptions: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Benefits (comma-separated)</Label>
                <Input placeholder="Health insurance, Hybrid work" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Expires in (days)</Label>
                <Input type="number" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={create}>Create draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!previewTarget} onOpenChange={(o) => !o && setPreviewTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Offer letter preview</DialogTitle>
            <DialogDescription>{previewTarget?.candidateName} · {previewTarget?.jobTitle}</DialogDescription>
          </DialogHeader>
          {previewTarget && (
            <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto scroll-thin pr-1">
              <div className="rounded-lg border p-4 space-y-2">
                <p>Dear {previewTarget.candidateName},</p>
                <p>We are delighted to extend an offer for the position of <strong>{previewTarget.jobTitle}</strong> at {previewTarget.employerName}.</p>
                <div className="rounded-md bg-muted/50 p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Annual salary</span><span className="font-medium">{formatCurrency(previewTarget.salary, previewTarget.currency)}</span></div>
                  {previewTarget.joiningBonus && <div className="flex justify-between"><span className="text-muted-foreground">Joining bonus</span><span className="font-medium">{formatCurrency(previewTarget.joiningBonus, previewTarget.currency)}</span></div>}
                  {previewTarget.stockOptions && <div className="flex justify-between"><span className="text-muted-foreground">Stock</span><span className="font-medium text-right">{previewTarget.stockOptions}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Start date</span><span className="font-medium">{formatDate(previewTarget.startDate)}</span></div>
                </div>
                {previewTarget.benefits.length > 0 && (
                  <div>
                    <p className="font-medium mt-2">Benefits include:</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {previewTarget.benefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2">This offer expires on {formatDate(previewTarget.expiresAt)}.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Workflow:</span>
                {WORKFLOW.map((s, i) => {
                  const idx = WORKFLOW.indexOf(previewTarget.status);
                  return (
                    <React.Fragment key={s}>
                      <Badge variant={i <= idx ? "default" : "outline"} className="text-xs capitalize">{s.replace("_", " ")}</Badge>
                      {i < WORKFLOW.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTarget(null)}>Close</Button>
            <Button onClick={() => { toast.success("Offer letter downloaded"); }}><FileText className="mr-2 h-4 w-4" /> Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw confirm */}
      <AlertDialog open={!!withdrawTarget} onOpenChange={(o) => !o && setWithdrawTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this offer?</AlertDialogTitle>
            <AlertDialogDescription>This will mark the offer to {withdrawTarget?.candidateName} as withdrawn. The candidate will be notified.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={withdraw} className="bg-rose-600 hover:bg-rose-700">Withdraw offer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
