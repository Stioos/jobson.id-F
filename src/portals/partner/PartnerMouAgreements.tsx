"use client";

import * as React from "react";
import { colleges, collegePartnershipModels } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { FileText, Plus, Send, Eye, RotateCcw, FileSignature } from "lucide-react";

interface MoU {
  id: string;
  collegeName: string;
  collegeCode: string;
  status: "draft" | "sent" | "signed" | "expired" | "renewed";
  signedDate?: string;
  expiryDate?: string;
  partnershipModel: string;
  programsMapped: number;
  studentsEnrolled: number;
  value: number;
}

const MOUS: MoU[] = [
  { id: "mou_001", collegeName: "Kanchana Institute of Technology", collegeCode: "KNC-001", status: "signed", signedDate: new Date(Date.now() - 180 * 86400000).toISOString(), expiryDate: new Date(Date.now() + 550 * 86400000).toISOString(), partnershipModel: "B", programsMapped: 6, studentsEnrolled: 840, value: 1680000 },
  { id: "mou_002", collegeName: "Bharath Engineering College", collegeCode: "BEC-002", status: "sent", signedDate: undefined, expiryDate: undefined, partnershipModel: "A", programsMapped: 4, studentsEnrolled: 0, value: 800000 },
  { id: "mou_003", collegeName: "Veltech University", collegeCode: "VTU-003", status: "signed", signedDate: new Date(Date.now() - 90 * 86400000).toISOString(), expiryDate: new Date(Date.now() + 640 * 86400000).toISOString(), partnershipModel: "D", programsMapped: 8, studentsEnrolled: 1200, value: 4500000 },
  { id: "mou_004", collegeName: "PSG College of Technology", collegeCode: "PSG-004", status: "draft", partnershipModel: "E", programsMapped: 0, studentsEnrolled: 0, value: 0 },
  { id: "mou_005", collegeName: "Anna University CEG", collegeCode: "CEG-005", status: "expired", signedDate: new Date(Date.now() - 400 * 86400000).toISOString(), expiryDate: new Date(Date.now() - 35 * 86400000).toISOString(), partnershipModel: "C", programsMapped: 5, studentsEnrolled: 600, value: 1200000 },
];

export function PartnerMouAgreements() {
  const partner = CURRENT_PARTNER;
  const [mous] = React.useState<MoU[]>(MOUS);
  const [draftOpen, setDraftOpen] = React.useState(false);
  const [previewMou, setPreviewMou] = React.useState<MoU | null>(null);

  const signedCount = mous.filter((m) => m.status === "signed").length;
  const sentCount = mous.filter((m) => m.status === "sent").length;
  const draftCount = mous.filter((m) => m.status === "draft").length;
  const expiredCount = mous.filter((m) => m.status === "expired").length;

  function sendForSignature(m: MoU) {
    toast.success("MoU sent for signature", { description: `${m.collegeName} will receive the agreement via DocuSign.` });
  }
  function renew(m: MoU) {
    toast.success("Renewal initiated", { description: `${m.collegeName} MoU renewal process started.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="MoU & Agreements"
        description={`${partner.name} — draft, send, sign, and renew MoUs with your partner colleges.`}
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Draft MoU", icon: "Plus", onClick: () => setDraftOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total MoUs" value={mous.length} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Signed" value={signedCount} icon={<FileSignature className="h-5 w-5" />} tone="success" />
        <StatCard label="Sent for Signature" value={sentCount} icon={<Send className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expired" value={expiredCount} icon={<RotateCcw className="h-5 w-5" />} tone="danger" />
      </div>

      <Card className="p-4">
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Programs</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mous.map((m) => {
                const expiringSoon = m.expiryDate && daysUntil(m.expiryDate) < 60 && daysUntil(m.expiryDate) > 0;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={m.collegeName} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{m.collegeName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{m.collegeCode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-mono">Model {m.partnershipModel}</Badge></TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell className="text-xs">{m.signedDate ? formatDate(m.signedDate) : "—"}</TableCell>
                    <TableCell className="text-xs">
                      {m.expiryDate ? (
                        <span className={expiringSoon ? "text-amber-600 font-medium" : ""}>{formatDate(m.expiryDate)}{expiringSoon && " ⚠️"}</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-sm">{m.programsMapped}</TableCell>
                    <TableCell className="text-sm">{m.studentsEnrolled}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-brand">{m.value > 0 ? formatCurrencyLite(m.value) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setPreviewMou(m)}><Eye className="h-3.5 w-3.5" /></Button>
                        {m.status === "draft" && <Button size="sm" variant="ghost" onClick={() => sendForSignature(m)} title="Send for signature"><Send className="h-3.5 w-3.5" /></Button>}
                        {(m.status === "expired" || (m.expiryDate && daysUntil(m.expiryDate) < 90)) && <Button size="sm" variant="ghost" onClick={() => renew(m)} title="Renew"><RotateCcw className="h-3.5 w-3.5" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Draft MoU Dialog */}
      <DraftMoUDialog open={draftOpen} onOpenChange={setDraftOpen} colleges={colleges} models={collegePartnershipModels} />

      {/* Preview Dialog */}
      <Dialog open={!!previewMou} onOpenChange={(o) => !o && setPreviewMou(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand" /> MoU Preview</DialogTitle>
            <DialogDescription>{previewMou?.collegeName} — Model {previewMou?.partnershipModel}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto scroll-thin rounded-lg border bg-muted/30 p-6 text-sm leading-relaxed">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-base">MEMORANDUM OF UNDERSTANDING</h3>
              <p className="text-xs text-muted-foreground">Between JOBSONN and {previewMou?.collegeName}</p>
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p>This Memorandum of Understanding ("MoU") is made on this day between <span className="font-medium text-foreground">JOBSONN Education Pvt. Ltd.</span> ("JOBSONN") and <span className="font-medium text-foreground">{previewMou?.collegeName}</span> ("the Institution").</p>
              <p><span className="font-semibold text-foreground">1. Objectives:</span> To establish a strategic partnership for delivering industry-aligned training, certification, and placement services to students of the Institution under Model {previewMou?.partnershipModel}.</p>
              <p><span className="font-semibold text-foreground">2. Scope:</span> JOBSONN shall provide curriculum, faculty training, LMS access, certification, and placement drives. The Institution shall provide infrastructure, student enrollment, and administrative support.</p>
              <p><span className="font-semibold text-foreground">3. Revenue Model:</span> Revenue share as per Model {previewMou?.partnershipModel} agreement — {collegePartnershipModels.find((x) => x.id === previewMou?.partnershipModel)?.revenueModel ?? "as agreed"}.</p>
              <p><span className="font-semibold text-foreground">4. Term:</span> This MoU shall be valid for a period of 3 years from the date of signing, renewable upon mutual consent.</p>
              <p><span className="font-semibold text-foreground">5. Termination:</span> Either party may terminate this MoU with 90 days written notice.</p>
              <p className="text-center mt-6 italic">[Document continues — full MoU available on download]</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => toast.success("MoU downloading", { description: "PDF will be ready shortly." })}>Download PDF</Button>
            <Button onClick={() => { if (previewMou) sendForSignature(previewMou); setPreviewMou(null); }}><Send className="mr-1.5 h-3.5 w-3.5" /> Send for Signature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatCurrencyLite(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

function DraftMoUDialog({ open, onOpenChange, colleges, models }: { open: boolean; onOpenChange: (o: boolean) => void; colleges: typeof import("@/lib/partner-data").colleges; models: typeof import("@/lib/partner-data").collegePartnershipModels }) {
  const [form, setForm] = React.useState({ collegeId: "", modelId: "", terms: "", duration: "3 years", revenueShare: "" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.collegeId || !form.modelId) { toast.error("Please select college and model"); return; }
    toast.success("MoU drafted", { description: "Saved as draft. Review and send for signature." });
    setForm({ collegeId: "", modelId: "", terms: "", duration: "3 years", revenueShare: "" });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Draft New MoU</DialogTitle>
          <DialogDescription>Create a new MoU draft for a partner college.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>College *</Label>
            <Select value={form.collegeId} onValueChange={(v) => setForm({ ...form, collegeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
              <SelectContent>
                {colleges.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                <SelectItem value="new">+ Add new college</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Partnership Model *</Label>
              <Select value={form.modelId} onValueChange={(v) => setForm({ ...form, modelId: v })}>
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  {models.map((m) => <SelectItem key={m.id} value={m.id}>Model {m.id} — {m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="2 years">2 years</SelectItem>
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Revenue Share</Label>
            <Input value={form.revenueShare} onChange={(e) => setForm({ ...form, revenueShare: e.target.value })} placeholder="e.g. 65% partner / 35% JOBSONN" />
          </div>
          <div className="space-y-1.5">
            <Label>Special Terms</Label>
            <Textarea rows={3} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="Any custom terms, conditions, or scope items..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Draft MoU</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
