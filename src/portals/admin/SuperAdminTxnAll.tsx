"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface Txn {
  id: string; date: string; portal: string; type: string; amount: number; status: string; method: string;
}

const TXNS: Txn[] = [
  { id: "TXN-9921", date: "2024-09-21T09:32:00Z", portal: "employer", type: "subscription", amount: 49_999, status: "success", method: "Card" },
  { id: "TXN-9920", date: "2024-09-21T08:48:00Z", portal: "recruiter", type: "wallet_topup", amount: 25_000, status: "success", method: "UPI" },
  { id: "TXN-9919", date: "2024-09-21T07:15:00Z", portal: "training", type: "course_purchase", amount: 12_400, status: "success", method: "NetBanking" },
  { id: "TXN-9918", date: "2024-09-20T18:42:00Z", portal: "partner", type: "settlement", amount: 1_84_000, status: "pending", method: "Payout" },
  { id: "TXN-9917", date: "2024-09-20T16:20:00Z", portal: "candidate", type: "credit_purchase", amount: 499, status: "success", method: "UPI" },
  { id: "TXN-9916", date: "2024-09-20T14:08:00Z", portal: "employer", type: "refund", amount: -8_400, status: "pending", method: "Original" },
  { id: "TXN-9915", date: "2024-09-20T11:55:00Z", portal: "recruiter", type: "commission", amount: 18_500, status: "success", method: "Payout" },
  { id: "TXN-9914", date: "2024-09-20T09:30:00Z", portal: "training", type: "certification", amount: 2_400, status: "failed", method: "Card" },
  { id: "TXN-9913", date: "2024-09-19T22:18:00Z", portal: "employer", type: "subscription", amount: 19_999, status: "success", method: "NetBanking" },
  { id: "TXN-9912", date: "2024-09-19T19:04:00Z", portal: "partner", type: "franchise_fee", amount: 50_000, status: "success", method: "UPI" },
];

export function SuperAdminTxnAll() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const filtered = TXNS.filter(t => {
    const s = search.toLowerCase();
    const m1 = !s || t.id.toLowerCase().includes(s);
    const m2 = portal === "all" || t.portal === portal;
    const m3 = type === "all" || t.type === type;
    const m4 = status === "all" || t.status === status;
    return m1 && m2 && m3 && m4;
  });

  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const statusBadge = (s: string) => {
    const cls = s === "success" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Transactions"
        description="Every transaction across all portals — filter by portal, type, status, or method."
        icon={<Icon name="Receipt" className="h-6 w-6" />}
        actions={[{ label: "Export Ledger", variant: "outline", onClick: () => toast.success("Ledger export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total (filtered)" value={formatCurrency(total)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success" value={TXNS.filter(t => t.status === "success").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending" value={TXNS.filter(t => t.status === "pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={TXNS.filter(t => t.status === "failed").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Transaction Ledger" description={`${filtered.length} of ${TXNS.length} transactions`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search TXN ID…" className="h-9 max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Portal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Portals</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="wallet_topup">Wallet Top-up</SelectItem>
                <SelectItem value="course_purchase">Course</SelectItem>
                <SelectItem value="settlement">Settlement</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="text-xs">{formatDateTime(t.date)}</TableCell>
                  <TableCell><Badge variant="outline">{t.portal}</Badge></TableCell>
                  <TableCell className="text-xs">{t.type.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-xs">{t.method}</TableCell>
                  <TableCell className={`font-medium ${t.amount < 0 ? "text-rose-600" : ""}`}>{formatCurrency(Math.abs(t.amount))}{t.amount < 0 ? " (cr)" : ""}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
