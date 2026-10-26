"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { referrals as seedReferrals } from "@/lib/mock-data";
import type { Referral } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

const REFERRAL_CODE = "PRIYA-JOBSONN-5000";
const REWARD_AMOUNT = 5000;

export function CandidateReferrals() {
  const [referrals, setReferrals] = React.useState<Referral[]>(
    seedReferrals.filter((r) => r.referrerName === "Priya Nair")
  );
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Add a couple of demo referrals for Priya if empty
  React.useEffect(() => {
    if (referrals.length === 0) {
      setReferrals([
        {
          id: "rf_p1",
          referrerName: "Priya Nair",
          referrerEmail: "priya.nair@gmail.com",
          refereeName: "Meera Krishnan",
          refereeEmail: "meera.k@gmail.com",
          status: "converted",
          reward: 5000,
          currency: "INR",
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
        {
          id: "rf_p2",
          referrerName: "Priya Nair",
          referrerEmail: "priya.nair@gmail.com",
          refereeName: "Karthik Menon",
          refereeEmail: "karthik.m@gmail.com",
          status: "signed_up",
          reward: 0,
          currency: "INR",
          createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
          id: "rf_p3",
          referrerName: "Priya Nair",
          referrerEmail: "priya.nair@gmail.com",
          refereeName: "Aditya Rao",
          refereeEmail: "aditya.rao@gmail.com",
          status: "pending",
          reward: 0,
          currency: "INR",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ]);
    }
  }, []);

  function copyCode() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(REFERRAL_CODE)
        .then(() => {
          setCopied(true);
          toast.success("Referral code copied");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => toast.error("Could not copy"));
    } else {
      setCopied(true);
      toast.success("Referral code copied");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function inviteFriends(emails: string) {
    const list = emails
      .split(/[,\s]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast.error("Enter at least one email");
      return;
    }
    const newRefs: Referral[] = list.map((email) => ({
      id: `rf_${Date.now()}_${email}`,
      referrerName: "Priya Nair",
      referrerEmail: "priya.nair@gmail.com",
      refereeName: email.split("@")[0],
      refereeEmail: email,
      status: "pending",
      reward: 0,
      currency: "INR",
      createdAt: new Date().toISOString(),
    }));
    setReferrals((prev) => [...newRefs, ...prev]);
    setInviteOpen(false);
    toast.success(`Invitations sent to ${list.length} friend${list.length === 1 ? "" : "s"}`, {
      description: `You'll earn ₹${REWARD_AMOUNT} when each signs up and gets hired.`,
    });
  }

  const stats = {
    invited: referrals.length,
    signedUp: referrals.filter((r) =>
      ["signed_up", "converted", "rewarded"].includes(r.status)
    ).length,
    converted: referrals.filter((r) => ["converted", "rewarded"].includes(r.status))
      .length,
    rewards: referrals.reduce((s, r) => s + r.reward, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Invite friends to JOBSONN and earn rewards when they get hired."
        actions={[
          { label: "Invite friends", variant: "default", onClick: () => setInviteOpen(true) },
        ]}
      />

      {/* Referral code banner */}
      <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                Your referral code
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold">{REFERRAL_CODE}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Friends get ₹500 off any premium plan. You earn ₹{REWARD_AMOUNT} when they get hired.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={copyCode}>
                <Icon name="Repeat" className="h-4 w-4" />
                {copied ? "Copied!" : "Copy code"}
              </Button>
              <Button variant="outline" onClick={() => setInviteOpen(true)}>
                <Icon name="Send" className="h-4 w-4" /> Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Invited" value={stats.invited} icon={<Icon name="Send" className="h-5 w-5" />} />
        <StatCard label="Signed up" value={stats.signedUp} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Converted" value={stats.converted} icon={<Icon name="Handshake" className="h-5 w-5" />} tone="success" />
        <StatCard
          label="Rewards earned"
          value={formatCurrency(stats.rewards, "INR")}
          icon={<Icon name="Coins" className="h-5 w-5" />}
          tone="warning"
        />
      </div>

      {/* Referral history */}
      <SectionCard title="Referral history" description="Track invitations and rewards.">
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Icon name="Repeat" className="h-5 w-5" />}
            title="No referrals yet"
            description="Invite friends to start earning rewards."
            action={<Button onClick={() => setInviteOpen(true)}>Invite friends</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Friend</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.refereeName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.refereeEmail}
                    </TableCell>
                    <TableCell>{formatDate(r.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {r.reward > 0 ? formatCurrency(r.reward, r.currency) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* How it works */}
      <SectionCard title="How it works" description="Three simple steps.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "Send",
              title: "1. Invite",
              body: "Share your referral code with friends looking for jobs or hiring.",
            },
            {
              icon: "Users",
              title: "2. They sign up",
              body: "Your friend joins JOBSONN with your code and starts using the platform.",
            },
            {
              icon: "Coins",
              title: "3. You earn",
              body: "When they get hired, you earn ₹5,000. No cap on rewards.",
            },
          ].map((s) => (
            <Card key={s.title}>
              <CardContent className="p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <p className="mt-2 font-medium">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={inviteFriends} />
    </div>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (emails: string) => void;
}) {
  const [emails, setEmails] = React.useState("");
  React.useEffect(() => {
    if (open) setEmails("");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite friends</DialogTitle>
          <DialogDescription>
            Enter email addresses separated by commas. We&apos;ll send them an invite
            with your referral code.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="emails">Email addresses</Label>
          <Input
            id="emails"
            placeholder="friend1@email.com, friend2@email.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onInvite(emails)}>
            <Icon name="Send" className="h-4 w-4" /> Send invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
