"use client";

import * as React from "react";
import {
  FileSignature, Send, Eye, CheckCircle2, XCircle, Clock, Download, Upload,
  ShieldCheck, FileText,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/format";

type EsignStatus = "Sent" | "Viewed" | "Signed" | "Declined" | "Expired";

interface Offer {
  id: string;
  candidate: string;
  client: string;
  role: string;
  salary: number;
  sentDate: string;
  expiryDate: string;
  status: EsignStatus;
  viewedAt?: string;
  signedAt?: string;
  ip?: string;
  declinedReason?: string;
}

interface AuditEntry { id: string; offerId: string; event: string; actor: string; timestamp: string; ip: string }

const MOCK_OFFERS: Offer[] = [
  { id: "o1", candidate: "Arjun Iyer", client: "TechCorp India", role: "Senior Frontend Engineer", salary: 2400000, sentDate: "2024-10-08", expiryDate: "2024-10-22", status: "Signed", viewedAt: "2024-10-09", signedAt: "2024-10-11", ip: "203.0.113.42" },
  { id: "o2", candidate: "Kavya Reddy", client: "DataMinds AI", role: "Full Stack Developer", salary: 1800000, sentDate: "2024-10-12", expiryDate: "2024-10-26", status: "Viewed", viewedAt: "2024-10-13", ip: "198.51.100.7" },
  { id: "o3", candidate: "Rohan Mehta", client: "FinEdge Solutions", role: "DevOps Engineer", salary: 2100000, sentDate: "2024-10-10", expiryDate: "2024-10-24", status: "Sent" },
  { id: "o4", candidate: "Sneha Kapoor", client: "StartupX", role: "Backend Engineer", salary: 1600000, sentDate: "2024-09-25", expiryDate: "2024-10-09", status: "Expired" },
  { id: "o5", candidate: "Vikram Nair", client: "DataMinds AI", role: "ML Engineer", salary: 2800000, sentDate: "2024-10-05", expiryDate: "2024-10-19", status: "Declined", viewedAt: "2024-10-06", declinedReason: "Accepted competing offer" },
  { id: "o6", candidate: "Priya Nair", client: "TechCorp India", role: "Frontend Engineer", salary: 1400000, sentDate: "2024-10-14", expiryDate: "2024-10-28", status: "Viewed", viewedAt: "2024-10-15", ip: "203.0.113.91" },
];

const AUDIT: AuditEntry[] = [
  { id: "a1", offerId: "o1", event: "Offer sent for signature", actor: "recruiter@jobson.id", timestamp: "2024-10-08T10:00:00Z", ip: "10.0.0.4" },
  { id: "a2", offerId: "o1", event: "Email opened by candidate", actor: "Arjun Iyer", timestamp: "2024-10-09T08:23:00Z", ip: "203.0.113.42" },
  { id: "a3", offerId: "o1", event: "Document viewed", actor: "Arjun Iyer", timestamp: "2024-10-09T08:24:00Z", ip: "203.0.113.42" },
  { id: "a4", offerId: "o1", event: "Offer signed", actor: "Arjun Iyer", timestamp: "2024-10-11T14:10:00Z", ip: "203.0.113.42" },
  { id: "a5", offerId: "o2", event: "Offer sent for signature", actor: "recruiter@jobson.id", timestamp: "2024-10-12T11:30:00Z", ip: "10.0.0.4" },
  { id: "a6", offerId: "o2", event: "Document viewed", actor: "Kavya Reddy", timestamp: "2024-10-13T09:05:00Z", ip: "198.51.100.7" },
  { id: "a7", offerId: "o5", event: "Offer declined", actor: "Vikram Nair", timestamp: "2024-10-06T17:42:00Z", ip: "192.0.2.55" },
];

const STATUS_TONE: Record<EsignStatus, string> = {
  Sent: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Viewed: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
  Signed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Declined: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
  Expired: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
};

export function RecruiterOfferEsign() {
  const [offers, setOffers] = React.useState<Offer[]>(MOCK_OFFERS);
  const [preview, setPreview] = React.useState<Offer | null>(null);
  const [auditFor, setAuditFor] = React.useState<Offer | null>(null);
  const [sendOpen, setSendOpen] = React.useState(false);
  const [candidate, setCandidate] = React.useState("");
  const [role, setRole] = React.useState("");
  const [expiryDays, setExpiryDays] = React.useState("14");

  function submitForSignature() {
    if (!candidate || !role) {
      toast.error("Select a candidate and role");
      return;
    }
    const today = new Date();
    const expiry = new Date(today.getTime() + Number(expiryDays) * 86400000);
    const newOffer: Offer = {
      id: `o${offers.length + 1}`,
      candidate, client: "TechCorp India", role, salary: 1800000,
      sentDate: today.toISOString().slice(0, 10),
      expiryDate: expiry.toISOString().slice(0, 10),
      status: "Sent",
    };
    setOffers((prev) => [newOffer, ...prev]);
    toast.success("Offer sent for e-signature", { description: `${candidate} → ${role}` });
    setSendOpen(false);
    setCandidate(""); setRole("");
  }

  const signed = offers.filter((o) => o.status === "Signed");
  const pending = offers.filter((o) => o.status === "Sent" || o.status === "Viewed");
  const expired = offers.filter((o) => o.status === "Expired" || o.status === "Declined");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer E-Signature"
        description="Send offer letters for legally-binding e-signature. Track views, signatures, IP audit trail and store signed documents."
        icon={<FileSignature className="h-6 w-6" />}
        actions={[
          { label: "Send for signature", onClick: () => setSendOpen(true) },
          { label: "Audit log", variant: "outline", onClick: () => toast.info("Audit log available below") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Awaiting signature" value={pending.length} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Signed this month" value={signed.length} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Declined / Expired" value={expired.length} icon={<XCircle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg time to sign" value="2.4d" icon={<Send className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard
        title="Pending & sent offers"
        description="Track every offer through Sent → Viewed → Signed / Declined / Expired."
      >
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Client / role</TableHead>
                <TableHead className="hidden md:table-cell">Sent</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={o.candidate} size="sm" />
                      <p className="text-sm font-medium">{o.candidate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{o.client}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{o.role}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(o.sentDate)}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(o.expiryDate)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[o.status]}`}>{o.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setPreview(o)}>Preview</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAuditFor(o)}>Audit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Signed documents" description="Download executed PDFs with tamper-evident audit trail.">
          {signed.length === 0 ? (
            <EmptyState icon={<FileText className="h-5 w-5" />} title="No signed documents yet" />
          ) : (
            <ul className="space-y-2">
              {signed.map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <FileSignature className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{o.candidate} — {o.role}</p>
                      <p className="text-[11px] text-muted-foreground">Signed {o.signedAt ? formatDate(o.signedAt) : "—"} · IP {o.ip}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Download started", { description: `${o.candidate}_offer.pdf` })}>
                    <Download className="h-3.5 w-3.5 mr-1" />PDF
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent audit trail" description="Tamper-evident event log for every offer action.">
          <ul className="max-h-72 space-y-2 overflow-y-auto scroll-thin">
            {AUDIT.slice().reverse().map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-lg border bg-card p-2.5 text-xs">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{a.event}</p>
                  <p className="text-muted-foreground">{a.actor} · {new Date(a.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · IP {a.ip}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Offer preview */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand" /> Offer letter preview</DialogTitle>
            <DialogDescription>Mock document — illustrative only.</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-semibold">{preview.client}</p>
                    <p className="text-xs text-muted-foreground">Offer of Employment</p>
                  </div>
                  <Badge variant="outline" className={STATUS_TONE[preview.status]}>{preview.status}</Badge>
                </div>
                <div className="space-y-2 pt-3 text-sm">
                  <p>Date: {formatDate(preview.sentDate)}</p>
                  <p>To: <span className="font-medium">{preview.candidate}</span></p>
                  <p>Role: <span className="font-medium">{preview.role}</span></p>
                  <p>Annual compensation: <span className="font-semibold">{formatCurrency(preview.salary)}</span></p>
                  <p>Start date: As mutually agreed, within 30 days of acceptance.</p>
                  <p className="text-muted-foreground italic">This offer is valid until {formatDate(preview.expiryDate)}. Your signature below constitutes acceptance of the terms outlined in the full agreement attached.</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Candidate signature</p>
                    <div className="mt-2 h-8 rounded border border-dashed flex items-center justify-center text-muted-foreground">
                      {preview.signedAt ? <span className="text-brand italic">/{preview.candidate}/</span> : "—"}
                    </div>
                    <p className="mt-1">{preview.signedAt ? `Signed ${formatDate(preview.signedAt)}` : "Awaiting signature"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employer signature</p>
                    <div className="mt-2 h-8 rounded border border-dashed flex items-center justify-center text-muted-foreground">
                      <span className="text-brand italic">/HR Director/</span>
                    </div>
                    <p className="mt-1">Pre-signed</p>
                  </div>
                </div>
              </div>
              {preview.viewedAt && (
                <div className="flex flex-wrap gap-3 rounded-lg border bg-card p-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-cyan-600"><Eye className="h-3 w-3" /> Viewed {formatDate(preview.viewedAt)} · IP {preview.ip}</span>
                  {preview.signedAt && <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Signed {formatDate(preview.signedAt)} · IP {preview.ip}</span>}
                  {preview.declinedReason && <span className="inline-flex items-center gap-1 text-rose-600"><XCircle className="h-3 w-3" /> Declined: {preview.declinedReason}</span>}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            <Button onClick={() => toast.success("Resent offer", { description: preview?.candidate })}><Send className="h-3.5 w-3.5 mr-1" />Resend</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit dialog */}
      <Dialog open={!!auditFor} onOpenChange={(o) => !o && setAuditFor(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit trail — {auditFor?.candidate}</DialogTitle>
            <DialogDescription>Every event for this offer, IP-stamped.</DialogDescription>
          </DialogHeader>
          <ul className="max-h-72 space-y-2 overflow-y-auto scroll-thin">
            {AUDIT.filter((a) => a.offerId === auditFor?.id).map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-lg border bg-card p-2.5 text-xs">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" />
                <div>
                  <p className="font-medium">{a.event}</p>
                  <p className="text-muted-foreground">{a.actor} · {new Date(a.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  <p className="text-muted-foreground">IP {a.ip}</p>
                </div>
              </li>
            ))}
            {AUDIT.filter((a) => a.offerId === auditFor?.id).length === 0 && (
              <li className="text-xs text-muted-foreground">No audit events recorded yet.</li>
            )}
          </ul>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send for signature */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send offer for e-signature</DialogTitle>
            <DialogDescription>The candidate will receive a secure link to review and sign.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Candidate</Label>
              <Select value={candidate} onValueChange={setCandidate}>
                <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {["Aditya Sharma", "Neha Patel", "Karthik Subramanian", "Ananya Bose"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label>Offer template</Label>
              <div className="flex items-center justify-between rounded-lg border border-dashed p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-brand" />
                  <span>Standard offer template.pdf</span>
                </div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">Default</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Expiry (days)</Label>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Send reminders</Label>
                <Select defaultValue="yes">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, every 3 days</SelectItem>
                    <SelectItem value="no">No reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={submitForSignature}><Send className="h-3.5 w-3.5 mr-1" />Send for signature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
