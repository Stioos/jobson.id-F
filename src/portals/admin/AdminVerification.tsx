"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

type QueueItem = {
  id: string;
  name: string;
  type: "employer" | "agency" | "candidate";
  submittedAt: string;
  documents: string[];
  status: "pending" | "more_info" | "approved" | "rejected";
  industry?: string;
};

const INITIAL_QUEUE: QueueItem[] = [
  { id: "q_1", name: "GreenLeaf Energy", type: "employer", submittedAt: "2024-10-15T09:00:00Z", documents: ["GST Certificate", "PAN", "Address proof", "Bank statement"], status: "pending", industry: "Renewable Energy" },
  { id: "q_2", name: "StartupX", type: "employer", submittedAt: "2024-10-14T09:00:00Z", documents: ["CIN", "PAN"], status: "pending", industry: "Information Technology" },
  { id: "q_3", name: "Vikram Singh", type: "candidate", submittedAt: "2024-10-13T09:00:00Z", documents: ["PAN", "Aadhaar", "Degree certificate"], status: "more_info" },
  { id: "q_4", name: "DataPro Services", type: "employer", submittedAt: "2024-10-12T09:00:00Z", documents: ["GST Certificate"], status: "pending", industry: "BPO" },
  { id: "q_5", name: "Karthik Menon", type: "candidate", submittedAt: "2024-10-11T09:00:00Z", documents: ["PAN", "Aadhaar"], status: "pending" },
];

const KYC_CHECKLIST = [
  { key: "identity", label: "Identity proof (PAN/Aadhaar)" },
  { key: "address", label: "Address proof" },
  { key: "business", label: "Business registration (GST/CIN)" },
  { key: "bank", label: "Bank account verification" },
  { key: "domain", label: "Email domain matches website" },
  { key: "website", label: "Active website presence" },
];

export function AdminVerification() {
  const [items, setItems] = React.useState<QueueItem[]>(INITIAL_QUEUE);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [reviewItem, setReviewItem] = React.useState<QueueItem | null>(null);
  const [rejectTarget, setRejectTarget] = React.useState<QueueItem | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const filtered = items.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && i.type !== typeFilter) return false;
    return true;
  });

  const approve = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "approved" } : i)));
    toast.success("Verification approved", { description: "User notified and badge applied." });
    setReviewItem(null);
  };
  const requestMoreInfo = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "more_info" } : i)));
    toast.info("More information requested", { description: "Email sent with instructions." });
    setReviewItem(null);
  };
  const reject = () => {
    if (!rejectTarget) return;
    setItems((prev) => prev.map((i) => (i.id === rejectTarget.id ? { ...i, status: "rejected" } : i)));
    toast.error("Verification rejected", { description: rejectReason || "Reason recorded." });
    setRejectTarget(null); setRejectReason(""); setReviewItem(null);
  };

  const pending = items.filter((i) => i.status === "pending").length;
  const approvedToday = items.filter((i) => i.status === "approved").length + 3;
  const rejected = items.filter((i) => i.status === "rejected").length + 1;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Verification & KYC"
        description="Review organization and candidate verification submissions."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Pending review" value={pending} tone="warning" icon="Clock" />
        <MiniStat label="Approved today" value={approvedToday} tone="success" icon="BadgeCheck" />
        <MiniStat label="Rejected" value={rejected} tone="danger" icon="XCircle" />
        <MiniStat label="Avg. review time" value="3.2h" tone="default" icon="Gauge" />
      </div>

      <SectionCard title="Verification queue" description="Approve, request more info, or reject submissions.">
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search name..."
          filters={
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={i.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{i.name}</p>
                        {i.industry && <p className="text-xs text-muted-foreground">{i.industry}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{i.type}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(i.submittedAt)}<br /><span className="text-[10px]">{timeAgo(i.submittedAt)}</span></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {i.documents.map((d) => (<Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>))}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={i.status === "more_info" ? "pending" : i.status === "approved" ? "completed" : i.status === "rejected" ? "rejected" : "open"} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setReviewItem(i)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No items in queue.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="KYC checklist" description="Standard verification requirements.">
          <ul className="space-y-2">
            {KYC_CHECKLIST.map((c) => (
              <li key={c.key} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <Checkbox defaultChecked={Math.random() > 0.4} id={`kyc-${c.key}`} />
                <Label htmlFor={`kyc-${c.key}`} className="cursor-pointer text-sm font-normal">{c.label}</Label>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Verification stats (30d)" description="Throughput and outcomes.">
          <div className="space-y-3 text-sm">
            <StatLine label="Total reviewed" value={pending + approvedToday + rejected} />
            <StatLine label="Approved" value={approvedToday} tone="success" />
            <StatLine label="Rejected" value={rejected} tone="danger" />
            <StatLine label="Awaiting info" value={items.filter((i) => i.status === "more_info").length} tone="warning" />
            <StatLine label="Approval rate" value={`${Math.round((approvedToday / (pending + approvedToday + rejected)) * 100)}%`} />
            <StatLine label="Avg. time to review" value="3.2h" />
          </div>
        </SectionCard>
      </div>

      {/* Review dialog */}
      <Dialog open={!!reviewItem} onOpenChange={(o) => !o && setReviewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          {reviewItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AvatarLogo text={reviewItem.name} size="md" />
                  <div>
                    <div>{reviewItem.name}</div>
                    <div className="text-xs font-normal text-muted-foreground capitalize">{reviewItem.type} · {reviewItem.industry ?? "—"}</div>
                  </div>
                </DialogTitle>
                <DialogDescription>Review submitted documents and run the KYC checklist.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-1">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Submitted documents</h4>
                  <ul className="mt-2 space-y-1">
                    {reviewItem.documents.map((d) => (
                      <li key={d} className="flex items-center justify-between rounded-md border px-2.5 py-1.5 text-sm">
                        <span className="flex items-center gap-2"><Icon name="FileText" className="h-4 w-4 text-muted-foreground" />{d}</span>
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening ${d} (demo)`)}>View</Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Checklist</h4>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5">
                    {KYC_CHECKLIST.map((c) => (
                      <li key={c.key} className="flex items-center gap-2 text-sm">
                        <Checkbox id={`rev-${c.key}`} defaultChecked={Math.random() > 0.4} />
                        <Label htmlFor={`rev-${c.key}`} className="cursor-pointer font-normal">{c.label}</Label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => requestMoreInfo(reviewItem.id)} className="sm:mr-auto">Request more info</Button>
                <Button variant="outline" className="text-rose-600" onClick={() => { setRejectTarget(reviewItem); }}>Reject</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approve(reviewItem.id)}>Approve</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject verification for {rejectTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>The submitter will be notified and can re-apply after correcting the issues.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Textarea id="reject-reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. GST certificate is expired. Please upload a current one." className="mt-1.5" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={reject} className="bg-rose-600 hover:bg-rose-700">Reject verification</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MiniStat({ label, value, tone, icon }: { label: string; value: string | number; tone: "warning" | "success" | "danger" | "default"; icon: string }) {
  const tones: Record<string, string> = {
    warning: "text-amber-600 bg-amber-500/10 dark:text-amber-300",
    success: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300",
    danger: "text-rose-600 bg-rose-500/10 dark:text-rose-300",
    default: "text-muted-foreground bg-muted",
  };
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${tones[tone]}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatLine({ label, value, tone }: { label: string; value: string | number; tone?: "success" | "danger" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600 dark:text-emerald-400" : tone === "danger" ? "text-rose-600 dark:text-rose-400" : tone === "warning" ? "text-amber-600 dark:text-amber-400" : "";
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${toneCls}`}>{value}</span>
    </div>
  );
}
