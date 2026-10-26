"use client";

import * as React from "react";
import { Handshake, AlertTriangle, Calendar, IndianRupee, Filter } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { placements, type Placement } from "@/lib/portal-data";

export function AgencyPlacements() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tab, setTab] = React.useState("all");

  const filtered = placements.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (tab === "failed" && p.status !== "failed") return false;
    if (tab === "active" && (p.status === "failed")) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.candidateName.toLowerCase().includes(q) && !p.clientName.toLowerCase().includes(q) && !p.recruiterName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const joined = placements.filter((p) => p.status === "joined").length;
  const notice = placements.filter((p) => p.status === "notice").length;
  const failed = placements.filter((p) => p.status === "failed").length;
  const totalCommission = placements.reduce((a, p) => a + p.commissionAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placements"
        description="All placements across the agency. Track commission splits, joining status, and failed placements within guarantee."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total placements" value={placements.length} icon={<Handshake className="h-5 w-5" />} tone="brand" />
        <StatCard label="Joined" value={joined} icon={<Handshake className="h-5 w-5" />} tone="success" />
        <StatCard label="In notice" value={notice} icon={<Calendar className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={failed} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Within guarantee" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All placements</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="failed">Failed log</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <SectionCard
            title={tab === "failed" ? "Failed placements" : "Placement log"}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-40 sm:w-56" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="joined">Joined</SelectItem>
                    <SelectItem value="notice">In notice</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {filtered.length === 0 ? (
              <EmptyState icon={<Filter className="h-5 w-5" />} title="No placements match" description="Adjust filters to see placements." />
            ) : (
              <div className="max-h-[600px] overflow-y-auto scroll-thin">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Client / role</TableHead>
                      <TableHead className="hidden md:table-cell">Recruiter</TableHead>
                      <TableHead className="hidden lg:table-cell">Placed</TableHead>
                      <TableHead className="hidden lg:table-cell">Joining</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead className="text-center">Rate</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer" onClick={() => toast.success("Placement opened", { description: `${p.candidateName} → ${p.clientName}` })}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={p.candidateName} size="sm" />
                            <p className="text-sm font-medium">{p.candidateName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{p.clientName}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.jobTitle}</p>
                          <p className="truncate text-[10px] text-muted-foreground/70 font-mono">{p.requisitionId}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs">
                          {p.recruiterName}
                          {p.commissionSplit && p.commissionSplit.length > 1 && (
                            <Badge variant="outline" className="ml-1 text-[10px] bg-violet-500/10 text-violet-600 border-violet-500/20">Split</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(p.placedAt)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {formatDate(p.joiningDate)}
                          {p.status === "notice" && <Badge variant="outline" className="ml-1 text-[10px]">{daysUntil(p.joiningDate)}d</Badge>}
                        </TableCell>
                        <TableCell className="text-right text-sm">{formatCurrency(p.salary)}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="font-semibold">{p.commissionRate}%</Badge></TableCell>
                        <TableCell className="text-right text-sm font-semibold">{formatCurrency(p.commissionAmount)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StatusBadge status={p.status} />
                            <Badge variant="outline" className={
                              p.invoiceStatus === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : p.invoiceStatus === "disputed" ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                              : p.invoiceStatus === "invoiced" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                              : "text-[10px]"
                            }>{p.invoiceStatus}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={7} className="font-semibold">Total commission ({filtered.length})</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(filtered.reduce((a, p) => a + p.commissionAmount, 0))}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      <SectionCard title="Commission splits" description="Where multiple recruiters collaborated on a placement.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placement</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead className="text-center">Share</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.filter((p) => p.commissionSplit).flatMap((p) => p.commissionSplit!.map((s, i) => (
                <TableRow key={`${p.id}-${i}`}>
                  <TableCell className="text-xs">
                    <p className="font-medium text-sm">{p.candidateName}</p>
                    <p className="text-xs text-muted-foreground">{p.clientName}</p>
                  </TableCell>
                  <TableCell className="text-sm">{s.recruiterName}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline">{s.share}%</Badge></TableCell>
                  <TableCell className="text-right text-sm font-semibold">{formatCurrency(s.amount)}</TableCell>
                </TableRow>
              )))}
              {placements.filter((p) => p.commissionSplit).length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-4">No split placements yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Failed placements log" description="Candidates who left within the guarantee period — credit notes or replacements owed.">
        <ul className="space-y-2">
          {placements.filter((p) => p.status === "failed").map((p) => (
            <li key={p.id} className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{p.candidateName} → {p.clientName}</p>
                <p className="text-xs text-muted-foreground">{p.jobTitle} · Recruiter: {p.recruiterName}</p>
                <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
                  Left within {p.guaranteeEndsAt ? "90-day" : "60-day"} guarantee. Commission ({formatCurrency(p.commissionAmount)}) disputed. Replacement or credit note required.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" onClick={() => toast.success("Replacement sourcing started", { description: p.clientName })}>Source replacement</Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => toast.success("Credit note issued", { description: p.candidateName })}>Issue credit note</Button>
              </div>
            </li>
          ))}
          {placements.filter((p) => p.status === "failed").length === 0 && (
            <li className="rounded-lg border p-4 text-center text-sm text-muted-foreground">No failed placements. 🎉</li>
          )}
        </ul>
      </SectionCard>
    </div>
  );
}
