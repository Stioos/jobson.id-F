"use client";

import * as React from "react";
import {
  Plus, Gift, Users, CheckCircle2, Coins, Handshake, UserPlus, Mail,
  Star,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { referralRecords, clientAccounts, openings } from "@/lib/partner-data";
import type { ReferralRecord } from "@/lib/partner-data";

export function RecruiterReferrals() {
  const [referrals, setReferrals] = React.useState<ReferralRecord[]>(referralRecords);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<ReferralRecord | null>(null);

  const filtered = referrals.filter((r) => statusFilter === "all" || r.status === statusFilter);

  const total = referrals.length;
  const placed = referrals.filter((r) => r.status === "placed").length;
  const rewardsPaid = referrals.filter((r) => r.rewardStatus === "paid").length;
  const totalRewardValue = referrals.reduce((a, r) => a + r.rewardAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Track candidate referrals from your network. Manage rewards and payouts as referrals progress to placement."
        actions={[{ label: "Create referral", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total referrals" value={total} icon={<UserPlus className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={placed} icon={<Handshake className="h-5 w-5" />} tone="success" hint={`${Math.round((placed / Math.max(total, 1)) * 100)}% placement rate`} />
        <StatCard label="Rewards paid" value={rewardsPaid} icon={<CheckCircle2 className="h-5 w-5" />} tone="default" hint={`of ${referrals.filter((r) => r.rewardStatus === "eligible" || r.rewardStatus === "paid").length} eligible`} />
        <StatCard label="Reward value" value={formatCurrency(totalRewardValue, "INR" as Currency)} icon={<Coins className="h-5 w-5" />} tone="warning" hint="Total committed" />
      </div>

      <SectionCard
        title="Referral log"
        description="Click any referral for full details and reward management."
        action={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<UserPlus className="h-5 w-5" />} title="No referrals match" description="Adjust filters or create a new referral." />
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Client / Role</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                  <TableHead>Reward status</TableHead>
                  <TableHead className="hidden sm:table-cell">Referred</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setDetail(r)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={r.referrerName} size="xs" />
                        <div>
                          <p className="text-sm font-medium">{r.referrerName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{r.referrerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{r.candidateName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{r.candidateEmail}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {r.clientName ? (
                        <>
                          <p className="text-sm">{r.clientName}</p>
                          <p className="text-xs text-muted-foreground">{r.jobTitle}</p>
                        </>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.rewardAmount > 0 ? (
                        <p className="text-sm font-medium">{formatCurrency(r.rewardAmount, "INR" as Currency)}</p>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={r.rewardStatus} /></TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{timeAgo(r.referredAt)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7" onClick={(e) => e.stopPropagation()}>Manage</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuLabel>Reward</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, rewardStatus: "eligible" } : x));
                            toast.success(`${r.candidateName} marked eligible for reward`);
                          }}>Mark eligible</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, rewardStatus: "paid" } : x));
                            toast.success(`Reward paid to ${r.referrerName}`);
                          }}>Mark paid</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, rewardStatus: "ineligible" } : x));
                            toast.success(`Marked ineligible`);
                          }}>Mark ineligible</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Stage</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "contacted" } : x));
                            toast.success(`Marked as contacted`);
                          }}>Mark contacted</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "interviewed" } : x));
                            toast.success(`Marked as interviewed`);
                          }}>Mark interviewed</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setReferrals((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "placed" } : x));
                            toast.success(`🎉 ${r.candidateName} placed!`);
                          }}>Mark placed</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <CreateReferralDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(rec) => {
          setReferrals((prev) => [rec, ...prev]);
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <ReferralDetail
              referral={detail}
              onClose={() => setDetail(null)}
              onUpdateReward={(s) => {
                setReferrals((prev) => prev.map((x) => x.id === detail.id ? { ...x, rewardStatus: s } : x));
                setDetail((d) => d ? { ...d, rewardStatus: s } : null);
                toast.success(`Reward status: ${s}`);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateReferralDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (rec: ReferralRecord) => void;
}) {
  const [referrerName, setReferrerName] = React.useState("");
  const [referrerEmail, setReferrerEmail] = React.useState("");
  const [candidateName, setCandidateName] = React.useState("");
  const [candidateEmail, setCandidateEmail] = React.useState("");
  const [client, setClient] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [reward, setReward] = React.useState("5000");

  const submit = () => {
    if (!referrerName || !candidateName) {
      toast.error("Referrer and candidate names are required");
      return;
    }
    const rec: ReferralRecord = {
      id: "ref_" + Date.now(),
      referrerName, referrerEmail,
      candidateName, candidateEmail,
      clientName: client || undefined,
      jobTitle: jobTitle || undefined,
      status: "submitted",
      rewardAmount: Number(reward),
      rewardStatus: "pending",
      referredAt: new Date().toISOString(),
      notes: notes || undefined,
    };
    onCreate(rec);
    toast.success(`Referral created — ${candidateName}`);
    onOpenChange(false);
    setReferrerName(""); setReferrerEmail(""); setCandidateName(""); setCandidateEmail("");
    setClient(""); setJobTitle(""); setNotes(""); setReward("5000");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create referral</DialogTitle>
          <DialogDescription>Record a candidate referred by someone in your network.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Users className="h-3 w-3" /> Referrer
          </div>
          <div className="space-y-2">
            <Label>Referrer name</Label>
            <Input value={referrerName} onChange={(e) => setReferrerName(e.target.value)} placeholder="e.g. Kavya Reddy" />
          </div>
          <div className="space-y-2">
            <Label>Referrer email</Label>
            <Input type="email" value={referrerEmail} onChange={(e) => setReferrerEmail(e.target.value)} placeholder="kavya.r@gmail.com" />
          </div>
          <div className="sm:col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 pt-2">
            <UserPlus className="h-3 w-3" /> Candidate
          </div>
          <div className="space-y-2">
            <Label>Candidate name</Label>
            <Input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="e.g. Sneha Patel" />
          </div>
          <div className="space-y-2">
            <Label>Candidate email</Label>
            <Input type="email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} placeholder="sneha.p@gmail.com" />
          </div>
          <div className="sm:col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 pt-2">
            <Mail className="h-3 w-3" /> Mapping
          </div>
          <div className="space-y-2">
            <Label>Client (optional)</Label>
            <Select value={client} onValueChange={(v) => { setClient(v); const o = openings.find((x) => x.clientName === v); if (o) setJobTitle(o.title); }}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job title (optional)</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="ML Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Reward amount (₹)</Label>
            <Input type="number" value={reward} onChange={(e) => setReward(e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any context about this referral…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create referral</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReferralDetail({
  referral, onClose, onUpdateReward,
}: {
  referral: ReferralRecord;
  onClose: () => void;
  onUpdateReward: (s: ReferralRecord["rewardStatus"]) => void;
}) {
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={referral.candidateName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{referral.candidateName}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{referral.candidateEmail}</span>
              {referral.clientName && <><span>•</span><span>{referral.clientName}</span></>}
              {referral.jobTitle && <><span>•</span><span>{referral.jobTitle}</span></>}
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={referral.status} />
          <StatusBadge status={referral.rewardStatus} />
        </div>
      </SheetHeader>

      <div className="space-y-4 mt-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Referred by</p>
            <p className="font-medium">{referral.referrerName}</p>
            <p className="text-[10px] text-muted-foreground">{referral.referrerEmail}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Referred on</p>
            <p className="font-medium">{formatDate(referral.referredAt)}</p>
            <p className="text-[10px] text-muted-foreground">{timeAgo(referral.referredAt)}</p>
          </div>
          <div className="rounded-lg border p-3 col-span-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Gift className="h-3 w-3" /> Reward</p>
            <p className="text-xl font-semibold mt-1">{formatCurrency(referral.rewardAmount, "INR" as Currency)}</p>
            <p className="text-[10px] text-muted-foreground">Status: {referral.rewardStatus.replace(/_/g, " ")}</p>
          </div>
        </div>

        {referral.notes && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Notes</h4>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">{referral.notes}</div>
          </div>
        )}

        {/* Reward management */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><Gift className="h-3 w-3" /> Reward management</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={referral.rewardStatus === "eligible" ? "default" : "outline"} onClick={() => onUpdateReward("eligible")}>
              <Star className="h-3.5 w-3.5" /> Mark eligible
            </Button>
            <Button size="sm" variant={referral.rewardStatus === "paid" ? "default" : "outline"} onClick={() => onUpdateReward("paid")}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark paid
            </Button>
            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={() => onUpdateReward("ineligible")}>
              Mark ineligible
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button size="sm" onClick={() => toast.success("Email sent to candidate")}>Email candidate</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Thank-you email sent to referrer")}>Thank referrer</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
