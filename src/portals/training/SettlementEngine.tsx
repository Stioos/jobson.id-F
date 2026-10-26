"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Coins, Clock, CheckCircle2, Zap, Download, Play, RefreshCcw, Calendar, Settings, TrendingUp,
} from "lucide-react";
import {
  talentTransactions, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "@/lib/format";

interface Settlement {
  id: string;
  partner: string;
  programId: string;
  programName: string;
  solutionType: keyof typeof SOLUTION_TYPE_CONFIG;
  amount: number;
  partnerShare: number;
  platformFee: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "upi" | "wallet";
  scheduledDate: string;
  txnId: string;
}

const PENDING_SETTLEMENTS: Settlement[] = [
  { id: "stl_001", partner: "Chennai Tech Academy", programId: "tsp_001", programName: "TechCorp — Full-Stack T2H Batch 3", solutionType: "TRAIN_TO_HIRE", amount: 600000, partnerShare: 420000, platformFee: 60000, status: "pending", method: "bank_transfer", scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString(), txnId: "ttx_001" },
  { id: "stl_002", partner: "Chennai Tech Academy", programId: "tsp_003", programName: "DataMinds — ML Engineer T2H", solutionType: "TRAIN_TO_HIRE", amount: 800000, partnerShare: 576000, platformFee: 80000, status: "pending", method: "bank_transfer", scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString(), txnId: "ttx_003" },
  { id: "stl_003", partner: "Chennai Tech Academy", programId: "tsp_005", programName: "TechCorp — Backend Go Upskilling", solutionType: "HIRE_TO_TRAIN", amount: 320000, partnerShare: 230400, platformFee: 32000, status: "pending", method: "bank_transfer", scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString(), txnId: "ttx_004" },
  { id: "stl_004", partner: "Chennai Tech Academy", programId: "tsp_009", programName: "FinEdge — DPDP Compliance Training", solutionType: "CORPORATE_TRAINING", amount: 480000, partnerShare: 345600, platformFee: 48000, status: "pending", method: "upi", scheduledDate: new Date(Date.now() + 7 * 86400000).toISOString(), txnId: "ttx_008" },
];

const SETTLEMENT_HISTORY: Settlement[] = [
  { id: "stl_h001", partner: "Chennai Tech Academy", programId: "tsp_001", programName: "TechCorp — Full-Stack T2H Batch 3", solutionType: "TRAIN_TO_HIRE", amount: 600000, partnerShare: 420000, platformFee: 60000, status: "completed", method: "bank_transfer", scheduledDate: new Date(Date.now() - 10 * 86400000).toISOString(), txnId: "ttx_009" },
  { id: "stl_h002", partner: "VIT Chennai", programId: "tsp_008", programName: "TechCorp — Leadership Development", solutionType: "CORPORATE_TRAINING", amount: 625000, partnerShare: 450000, platformFee: 62500, status: "completed", method: "bank_transfer", scheduledDate: new Date(Date.now() - 15 * 86400000).toISOString(), txnId: "ttx_006" },
  { id: "stl_h003", partner: "Chennai Tech Academy", programId: "tsp_008", programName: "TechCorp — Leadership Development", solutionType: "CORPORATE_TRAINING", amount: 625000, partnerShare: 450000, platformFee: 62500, status: "failed", method: "bank_transfer", scheduledDate: new Date(Date.now() - 20 * 86400000).toISOString(), txnId: "ttx_006" },
  { id: "stl_h004", partner: "BITS Pilani", programId: "tsp_010", programName: "MediCore — Healthcare Data Analytics", solutionType: "CORPORATE_TRAINING", amount: 580000, partnerShare: 417600, platformFee: 58000, status: "completed", method: "upi", scheduledDate: new Date(Date.now() - 30 * 86400000).toISOString(), txnId: "ttx_007" },
];

const SCHEDULE = [
  { date: "Today", count: 0, amount: 0 },
  { date: "Tomorrow", count: 0, amount: 0 },
  { date: "In 2 days", count: 1, amount: 420000 },
  { date: "In 3 days", count: 1, amount: 576000 },
  { date: "In 5 days", count: 1, amount: 230400 },
  { date: "In 7 days", count: 1, amount: 345600 },
];

export function SettlementEngine() {
  const { navigate } = useNav();
  const [selected, setSelected] = React.useState<Settlement[]>([]);
  const [bulkOpen, setBulkOpen] = React.useState(false);

  const pending = PENDING_SETTLEMENTS.filter((s) => s.status === "pending");
  const processing = PENDING_SETTLEMENTS.filter((s) => s.status === "processing");
  const completed = SETTLEMENT_HISTORY.filter((s) => s.status === "completed");

  const totalPending = pending.reduce((s, x) => s + x.partnerShare, 0);
  const totalCompleted = completed.reduce((s, x) => s + x.partnerShare, 0);
  const partners = new Set([...PENDING_SETTLEMENTS, ...SETTLEMENT_HISTORY].map((s) => s.partner));

  const toggleSelect = (id: string) => {
    setSelected((s) => s.some((x) => x.id === id) ? s.filter((x) => x.id !== id) : [...s, PENDING_SETTLEMENTS.find((x) => x.id === id)!]);
  };

  const handleProcess = (s: Settlement) => {
    toast.success("Settlement processed", { description: `${formatCurrency(s.partnerShare)} paid to ${s.partner} via ${s.method.replace(/_/g, " ")}.` });
  };

  const handleBulk = () => {
    toast.success("Bulk settlement processed", { description: `${selected.length} settlements totaling ${formatCurrency(selected.reduce((s, x) => s + x.partnerShare, 0))} processed.` });
    setSelected([]);
    setBulkOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement Engine"
        description="Process partner payouts, configure auto-settlement rules, and track settlement history."
        icon={<Coins className="h-6 w-6" />}
        breadcrumbs={[{ label: "Transactions" }, { label: "Settlements" }]}
        actions={[
          { label: "View Transactions", variant: "outline", onClick: () => navigate("training", "transactions") },
          { label: "Bulk Process", variant: "default", onClick: () => selected.length > 0 ? setBulkOpen(true) : toast.error("Select settlements first", { description: "Tick the checkboxes in the pending table to bulk process." }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Settlements" value={pending.length} hint={`${processing.length} processing`} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pending Value" value={formatCurrency(totalPending)} icon={<Coins className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed (30d)" value={completed.length} hint={formatCurrency(totalCompleted)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Active Partners" value={partners.size} icon={<TrendingUp className="h-5 w-5" />} tone="default" />
      </section>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending"><Clock className="mr-1 h-4 w-4" /> Pending</TabsTrigger>
          <TabsTrigger value="rules"><Settings className="mr-1 h-4 w-4" /> Auto-Settlement Rules</TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="mr-1 h-4 w-4" /> Schedule</TabsTrigger>
          <TabsTrigger value="history"><CheckCircle2 className="mr-1 h-4 w-4" /> History</TabsTrigger>
        </TabsList>

        {/* Pending settlements */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              {selected.length > 0 && (
                <div className="flex items-center justify-between border-b bg-brand/5 p-3">
                  <p className="text-sm">{selected.length} settlement(s) selected — Total: <strong>{formatCurrency(selected.reduce((s, x) => s + x.partnerShare, 0))}</strong></p>
                  <Button size="sm" onClick={() => setBulkOpen(true)}><Play className="mr-1 h-3 w-3" /> Process Selected</Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Solution</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Platform Fee</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PENDING_SETTLEMENTS.length === 0 && (
                    <TableRow><TableCell colSpan={11} className="py-10"><EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No pending settlements" /></TableCell></TableRow>
                  )}
                  {PENDING_SETTLEMENTS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.some((x) => x.id === s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="h-4 w-4 rounded border-border accent-brand"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={s.partner} size="xs" />
                          <span className="text-sm font-medium">{s.partner}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs max-w-[180px] truncate">{s.programName}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{SOLUTION_TYPE_CONFIG[s.solutionType].shortLabel}</Badge></TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(s.amount)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(s.platformFee)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold text-brand">{formatCurrency(s.partnerShare)}</TableCell>
                      <TableCell className="text-xs capitalize">{s.method.replace(/_/g, " ")}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(s.scheduledDate)}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-7" onClick={() => handleProcess(s)}>
                          <Zap className="mr-1 h-3 w-3" /> Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Settlement Rules */}
        <TabsContent value="rules">
          <SectionCard title="Auto-Settlement Rules" description="Configure automatic partner payouts">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Enable Auto-Settlement</p>
                  <p className="text-xs text-muted-foreground">Automatically process eligible settlements on schedule</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Threshold (₹)">
                  <Input type="number" defaultValue="100000" />
                </Field>
                <Field label="Frequency">
                  <Select defaultValue="weekly">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly (Mondays)</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly (1st)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Default Method">
                  <Select defaultValue="bank_transfer">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer (NEFT)</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Require Approval Above</p>
                  <p className="text-xs text-muted-foreground">Settlements above this amount require manual approval</p>
                </div>
                <Input type="number" defaultValue="500000" className="w-40" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Auto-retry Failed Settlements</p>
                  <p className="text-xs text-muted-foreground">Retry up to 3 times with 24h interval</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success("Auto-settlement rules saved", { description: "Rules will take effect from the next cycle." })}>
                  <Settings className="mr-1 h-4 w-4" /> Save Rules
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="schedule">
          <SectionCard title="Settlement Schedule" description="Upcoming settlement runs">
            <div className="space-y-2">
              {SCHEDULE.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.count > 0 ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.date}</p>
                      <p className="text-xs text-muted-foreground">{s.count} settlement(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{s.count > 0 ? formatCurrency(s.amount) : "—"}</p>
                    {s.count > 0 && <Button size="sm" variant="ghost" className="h-6" onClick={() => toast.info(`Preview ${s.date} settlements`)}>Preview</Button>}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b p-4">
                <p className="text-sm font-medium">Settlement History (Last 30 days)</p>
                <Button variant="outline" size="sm" onClick={() => toast.success("History exported", { description: "Settlement history saved as CSV." })}>
                  <Download className="mr-1 h-4 w-4" /> Export
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Settlement ID</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SETTLEMENT_HISTORY.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate("training", `transactions/${s.txnId}`)}>
                      <TableCell><code className="text-xs">{s.id}</code></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={s.partner} size="xs" />
                          <span className="text-sm">{s.partner}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs max-w-[180px] truncate">{s.programName}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(s.partnerShare)}</TableCell>
                      <TableCell className="text-xs capitalize">{s.method.replace(/_/g, " ")}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(s.scheduledDate)}</TableCell>
                      <TableCell>
                        {s.status === "completed" ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>
                        ) : s.status === "failed" ? (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]"><RefreshCcw className="mr-1 h-3 w-3" /> Failed</Badge>
                        ) : (
                          <StatusBadge status={s.status} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process {selected.length} settlements?</AlertDialogTitle>
            <AlertDialogDescription>
              This will process {selected.length} settlement(s) totaling {formatCurrency(selected.reduce((s, x) => s + x.partnerShare, 0))} to {new Set(selected.map((s) => s.partner)).size} partner(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulk}>Process Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
