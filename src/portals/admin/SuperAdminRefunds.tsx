"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface Refund {
  id: string; txn: string; portal: string; customer: string; amount: number; reason: string; status: string; fraudFlag: boolean;
}

const REFUNDS: Refund[] = [
  { id: "RF-2021", txn: "TXN-9916", portal: "employer", customer: "TechCorp India", amount: 8_400, reason: "Duplicate charge", status: "pending", fraudFlag: false },
  { id: "RF-2020", txn: "TXN-9899", portal: "training", customer: "Apex Skill Academy", amount: 12_400, reason: "Course cancelled by provider", status: "pending", fraudFlag: false },
  { id: "RF-2019", txn: "TXN-9894", portal: "candidate", customer: "Rahul Khanna", amount: 499, reason: "Accidental purchase", status: "approved", fraudFlag: false },
  { id: "RF-2018", txn: "TXN-9881", portal: "recruiter", customer: "HireRight India", amount: 18_000, reason: "Service not delivered", status: "pending", fraudFlag: true },
  { id: "RF-2017", txn: "TXN-9876", portal: "partner", customer: "NorthStar Affiliates", amount: 22_400, reason: "Contract termination", status: "pending", fraudFlag: false },
  { id: "RF-2016", txn: "TXN-9869", portal: "employer", customer: "EduSoft India", amount: 4_999, reason: "Downgrade", status: "approved", fraudFlag: false },
  { id: "RF-2015", txn: "TXN-9861", portal: "training", customer: "SoftSkill Studio", amount: 2_400, reason: "Certification not issued", status: "pending", fraudFlag: true },
  { id: "RF-2014", txn: "TXN-9854", portal: "candidate", customer: "Ananya Gupta", amount: 499, reason: "Wrong plan", status: "rejected", fraudFlag: false },
];

export function SuperAdminRefunds() {
  const pending = REFUNDS.filter(r => r.status === "pending");
  const fraud = REFUNDS.filter(r => r.fraudFlag);

  const statusBadge = (s: string) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Center"
        description="Refund approval queue with fraud flags and policy-based workflow."
        icon={<Icon name="RotateCcw" className="h-6 w-6" />}
        actions={[{ label: "Refund Policy", variant: "outline", onClick: () => toast.info("Opening refund policy") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending Total" value={formatCurrency(pending.reduce((s, r) => s + r.amount, 0))} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Fraud Flagged" value={fraud.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Refund Rate" value="2.4%" icon={<Icon name="Percent" className="h-5 w-5" />} />
      </div>

      {fraud.length > 0 && (
        <SectionCard title="Fraud-Flagged Refunds" description="Requires manual review" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraud.map(r => (
                <TableRow key={r.id} className="bg-rose-50/40 dark:bg-rose-900/10">
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {r.customer}
                      <Icon name="AlertTriangle" className="h-3 w-3 text-rose-500" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(r.amount)}</TableCell>
                  <TableCell className="text-xs">{r.reason}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Refund ${r.id} approved (manual review)`)}>Approve</Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.error(`Refund ${r.id} rejected & escalated`)}>Escalate</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      )}

      <SectionCard title="All Refund Requests" description="Full queue with audit trail" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Refund ID</TableHead>
              <TableHead>Original TXN</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REFUNDS.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-mono text-xs">{r.txn}</TableCell>
                <TableCell><Badge variant="outline">{r.portal}</Badge></TableCell>
                <TableCell className="font-medium">{r.customer}</TableCell>
                <TableCell className="font-medium">{formatCurrency(r.amount)}</TableCell>
                <TableCell className="text-xs">{r.reason}</TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  {r.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Refund ${r.id} approved`)}>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.error(`Refund ${r.id} rejected`)}>Reject</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${r.id} audit trail`)}>Trail</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
