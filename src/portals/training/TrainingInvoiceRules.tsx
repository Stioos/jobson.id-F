"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard, EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime } from "@/lib/format";

type TriggerEvent = "Registration" | "Batch Start" | "Certification" | "Milestone";

interface Rule {
  id: string;
  name: string;
  trigger: TriggerEvent;
  template: string;
  taxConfig: string;
  autoSend: boolean;
  status: "Active" | "Paused";
  recipient: "Student" | "Sponsor" | "Corporate Client";
}

const SEED_RULES: Rule[] = [
  { id: "r1", name: "Auto-invoice on student registration", trigger: "Registration", template: "GST Student Invoice v2", taxConfig: "CGST+SGST @18%", autoSend: true, status: "Active", recipient: "Student" },
  { id: "r2", name: "Sponsor invoice on batch kickoff", trigger: "Batch Start", template: "Sponsor Bulk Invoice", taxConfig: "IGST @18%", autoSend: true, status: "Active", recipient: "Sponsor" },
  { id: "r3", name: "Certification completion invoice", trigger: "Certification", template: "Cert Fee Invoice", taxConfig: "CGST+SGST @18%", autoSend: false, status: "Active", recipient: "Student" },
  { id: "r4", name: "Milestone invoice for corporate programs", trigger: "Milestone", template: "Corporate Milestone Invoice", taxConfig: "IGST @18%", autoSend: true, status: "Active", recipient: "Corporate Client" },
  { id: "r5", name: "Quarterly retainer invoice", trigger: "Milestone", template: "Retainer Invoice", taxConfig: "CGST+SGST @18%", autoSend: false, status: "Paused", recipient: "Corporate Client" },
];

interface ExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  triggeredAt: string;
  invoice: string;
  amount: number;
  status: "Generated" | "Failed";
  reason?: string;
}

const LOGS: ExecutionLog[] = [
  { id: "l1", ruleId: "r1", ruleName: "Auto-invoice on student registration", triggeredAt: "2024-11-01T10:25:00Z", invoice: "GST-INV-2024-2112", amount: 18000, status: "Generated" },
  { id: "l2", ruleId: "r2", ruleName: "Sponsor invoice on batch kickoff", triggeredAt: "2024-10-28T09:00:00Z", invoice: "GST-INV-2024-2105", amount: 450000, status: "Generated" },
  { id: "l3", ruleId: "r1", ruleName: "Auto-invoice on student registration", triggeredAt: "2024-10-26T14:10:00Z", invoice: "GST-INV-2024-2098", amount: 18000, status: "Generated" },
  { id: "l4", ruleId: "r3", ruleName: "Certification completion invoice", triggeredAt: "2024-10-22T16:45:00Z", invoice: "GST-INV-2024-2088", amount: 3500, status: "Failed", reason: "GSTIN missing for student" },
  { id: "l5", ruleId: "r4", ruleName: "Milestone invoice for corporate programs", triggeredAt: "2024-10-18T11:00:00Z", invoice: "GST-INV-2024-2076", amount: 220000, status: "Generated" },
  { id: "l6", ruleId: "r1", ruleName: "Auto-invoice on student registration", triggeredAt: "2024-10-15T10:00:00Z", invoice: "GST-INV-2024-2062", amount: 18000, status: "Generated" },
];

const TEMPLATES = ["GST Student Invoice v2", "Sponsor Bulk Invoice", "Cert Fee Invoice", "Corporate Milestone Invoice", "Retainer Invoice"];
const TAX_CONFIGS = ["CGST+SGST @18%", "CGST+SGST @5%", "IGST @18%", "IGST @5%", "Exempt"];

export function TrainingInvoiceRules() {
  const [rules, setRules] = React.useState<Rule[]>(SEED_RULES);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", trigger: "" as TriggerEvent | "", template: "", taxConfig: "", recipient: "Student" as Rule["recipient"], autoSend: true });

  const toggle = (id: string, key: "autoSend" | "status") => {
    setRules(rules.map((r) => r.id === id ? { ...r, [key]: !r[key] } : r));
    toast.success("Rule updated");
  };

  const createRule = () => {
    if (!form.name || !form.trigger || !form.template || !form.taxConfig) {
      toast.error("All fields are required");
      return;
    }
    const newRule: Rule = {
      id: `r${Date.now()}`,
      name: form.name,
      trigger: form.trigger as TriggerEvent,
      template: form.template,
      taxConfig: form.taxConfig,
      autoSend: form.autoSend,
      status: "Active",
      recipient: form.recipient,
    };
    setRules([newRule, ...rules]);
    setForm({ name: "", trigger: "", template: "", taxConfig: "", recipient: "Student", autoSend: true });
    setOpen(false);
    toast.success(`Rule "${newRule.name}" created`);
  };

  const generated = LOGS.filter((l) => l.status === "Generated").length;
  const failed = LOGS.filter((l) => l.status === "Failed").length;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Invoice Generation Rules"
        description="Configure automatic invoice generation triggered by student lifecycle events. GST & e-invoice compliant."
        icon={<Icon name="Settings2" className="h-6 w-6" />}
        actions={[{ label: "Create Rule", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Rules" value={rules.filter((r) => r.status === "Active").length} icon={<Icon name="Settings2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Auto-Send Enabled" value={rules.filter((r) => r.autoSend && r.status === "Active").length} icon={<Icon name="Send" className="h-5 w-5" />} tone="success" />
        <StatCard label="Invoices Generated" value={generated} icon={<Icon name="FileText" className="h-5 w-5" />} tone="default" />
        <StatCard label="Failed Triggers" value={failed} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Rules" description="Trigger-based invoice automation rules.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Tax Config</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Auto-Send</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-sm">{r.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-brand/5">{r.trigger}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{r.template}</TableCell>
                  <TableCell className="text-xs">{r.taxConfig}</TableCell>
                  <TableCell className="text-sm">{r.recipient}</TableCell>
                  <TableCell>
                    <Switch checked={r.autoSend} onCheckedChange={() => toggle(r.id, "autoSend")} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={r.status === "Active" ? "default" : "outline"} onClick={() => toggle(r.id, "status")}>
                      {r.status === "Active" ? "Active" : "Paused"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Rule Execution Log" description="When each rule last fired and which invoice was generated.">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Triggered At</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOGS.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs">{formatDateTime(l.triggeredAt)}</TableCell>
                  <TableCell className="text-sm">{l.ruleName}</TableCell>
                  <TableCell className="font-mono text-xs">{l.invoice}</TableCell>
                  <TableCell className="text-right font-medium">₹{l.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge className={l.status === "Generated" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.reason ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Compliance Check" description="GST & e-invoice compliance status.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">GST Compliance</span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>✓ GSTIN configured on all templates</li>
              <li>✓ HSN/SAC codes mapped (998314 / 999293)</li>
              <li>✓ Place of supply auto-detected from student/client</li>
              <li>✓ CGST/SGST/IGST auto-split working</li>
            </ul>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Icon name="FileText" className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">E-Invoice (IRP)</span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>✓ IRN generation enabled for B2B invoices &gt; ₹50,000</li>
              <li>✓ QR code appended on every invoice</li>
              <li>⚠ Pending: NIC sandbox credentials renewal (due 30 Nov)</li>
              <li>✓ Cancel/Amend workflows registered</li>
            </ul>
          </Card>
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Invoice Rule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Rule Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Auto-invoice on registration" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Trigger Event</Label>
                <Select value={form.trigger} onValueChange={(v) => setForm({ ...form, trigger: v as TriggerEvent })}>
                  <SelectTrigger><SelectValue placeholder="Select trigger" /></SelectTrigger>
                  <SelectContent>
                    {(["Registration", "Batch Start", "Certification", "Milestone"] as TriggerEvent[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Recipient</Label>
                <Select value={form.recipient} onValueChange={(v) => setForm({ ...form, recipient: v as Rule["recipient"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Sponsor">Sponsor</SelectItem>
                    <SelectItem value="Corporate Client">Corporate Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Template</Label>
                <Select value={form.template} onValueChange={(v) => setForm({ ...form, template: v })}>
                  <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tax Config</Label>
                <Select value={form.taxConfig} onValueChange={(v) => setForm({ ...form, taxConfig: v })}>
                  <SelectTrigger><SelectValue placeholder="Select tax" /></SelectTrigger>
                  <SelectContent>
                    {TAX_CONFIGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Auto-send to recipient</p>
                <p className="text-xs text-muted-foreground">Email invoice immediately on generation</p>
              </div>
              <Switch checked={form.autoSend} onCheckedChange={(v) => setForm({ ...form, autoSend: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createRule}>Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
