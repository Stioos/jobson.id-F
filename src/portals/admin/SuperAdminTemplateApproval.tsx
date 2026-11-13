"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Template {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  category: string;
  submittedBy: string;
  submittedAt: string;
  content: string;
  variables: string[];
  compliance: "passed" | "warning" | "failed";
  status: "pending" | "approved" | "rejected";
  version: number;
}

const QUEUE: Template[] = [
  { id: "tpl_921", name: "Diwali Promo 20%", channel: "email", category: "Marketing", submittedBy: "growth@jobson.id", submittedAt: "2024-09-21T08:00:00Z", content: "Hi {{first_name}}, celebrate Diwali with 20% off all premium plans. Use code DIWALI20. Valid till 5 Nov.", variables: ["first_name"], compliance: "passed", status: "pending", version: 1 },
  { id: "tpl_922", name: "Diwali SMS Promo", channel: "sms", category: "Marketing", submittedBy: "growth@jobson.id", submittedAt: "2024-09-21T07:30:00Z", content: "DIWALI20: 20% off all plans! Shop now at jobson.id. Reply STOP to opt-out.", variables: [], compliance: "warning", status: "pending", version: 2 },
  { id: "tpl_923", name: "Course Completion WA", channel: "whatsapp", category: "Marketing", submittedBy: "ops-training@jobson.id", submittedAt: "2024-09-20T16:00:00Z", content: "Hi {{name}}, congratulations on completing {{course_name}}! Your certificate is ready.", variables: ["name", "course_name"], compliance: "failed", status: "pending", version: 1 },
  { id: "tpl_924", name: "MoU Renewal Reminder", channel: "email", category: "Transactional", submittedBy: "legal@jobson.id", submittedAt: "2024-09-20T11:00:00Z", content: "Dear {{partner_name}}, your MoU expires on {{expiry_date}}. Reply to initiate renewal.", variables: ["partner_name", "expiry_date"], compliance: "passed", status: "pending", version: 3 },
  { id: "tpl_925", name: "Salary Disclosure Alert", channel: "sms", category: "Transactional", submittedBy: "ops-recruiter@jobson.id", submittedAt: "2024-09-20T09:00:00Z", content: "Sharing candidate CTC of ₹{{ctc}} LPA with {{client_name}}.", variables: ["ctc", "client_name"], compliance: "failed", status: "pending", version: 1 },
];

const APPROVED = [
  { id: "tpl_001", name: "OTP Verification", channel: "email", version: 4, uses: 184_200, approvedAt: "2024-08-12T10:00:00Z" },
  { id: "tpl_002", name: "Interview Reminder", channel: "sms", version: 2, uses: 8_400, approvedAt: "2024-07-04T11:00:00Z" },
  { id: "tpl_003", name: "Welcome Message", channel: "whatsapp", version: 1, uses: 18_400, approvedAt: "2024-06-22T09:00:00Z" },
  { id: "tpl_004", name: "Offer Letter Sent", channel: "email", version: 3, uses: 1_240, approvedAt: "2024-08-30T14:00:00Z" },
];

export function SuperAdminTemplateApproval() {
  const [selected, setSelected] = React.useState<Template | null>(QUEUE[0]);
  const [feedback, setFeedback] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const filtered = QUEUE.filter(q => filter === "all" || q.channel === filter);

  const approve = () => {
    if (!selected) return;
    toast.success(`Template approved: ${selected.name}`, { description: `v${selected.version} → published` });
  };
  const reject = () => {
    if (!selected) { toast.error("Select a template first"); return; }
    if (!feedback) { toast.error("Feedback required for rejection"); return; }
    toast.success(`Template rejected: ${selected.name}`, { description: `Feedback sent to ${selected.submittedBy}` });
    setFeedback("");
  };

  const complianceBadge = (c: Template["compliance"]) => {
    const cls = c === "passed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : c === "warning" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{c}</Badge>;
  };

  const channelIcon = (c: Template["channel"]) => c === "email" ? "Mail" : c === "sms" ? "Smartphone" : "MessageCircle";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Approval"
        description="Centralized approval queue for all email, SMS, and WhatsApp templates — content review, variable validation, compliance check, approve/reject with feedback, and approved template library."
        icon={<Icon name="CheckSquare" className="h-6 w-6" />}
        actions={[{ label: "Compliance Rules", variant: "outline", onClick: () => toast.info("Opening compliance rules editor") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Review" value={QUEUE.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Compliance Failed" value={QUEUE.filter(q => q.compliance === "failed").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Approved Library" value={APPROVED.length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Review Time" value="2h 18m" icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Approval Queue" description={`${filtered.length} pending templates`} className="lg:col-span-1" contentClassName="p-0">
          <div className="border-b p-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="Queue empty" />
            ) : (
              filtered.map(t => (
                <button key={t.id} onClick={() => setSelected(t)} className={`flex w-full flex-col items-start gap-1 border-b p-3 text-left transition-colors hover:bg-accent ${selected?.id === t.id ? "bg-accent" : ""}`}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name={channelIcon(t.channel)} className="h-4 w-4 text-brand" />
                      <span className="text-sm font-medium">{t.name}</span>
                    </div>
                    {complianceBadge(t.compliance)}
                  </div>
                  <span className="text-xs text-muted-foreground">v{t.version} • by {t.submittedBy} • {timeAgo(t.submittedAt)}</span>
                </button>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Template Review" description={selected ? `${selected.name} • v${selected.version}` : "Select a template"} className="lg:col-span-2">
          {!selected ? (
            <EmptyState icon={<Icon name="CheckSquare" className="h-5 w-5" />} title="No template selected" description="Pick a template from the queue." />
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Channel</Label>
                  <div className="mt-1 flex items-center gap-2 text-sm"><Icon name={channelIcon(selected.channel)} className="h-4 w-4 text-brand" /> <span className="capitalize">{selected.channel}</span></div>
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <p className="mt-1 text-sm">{selected.category}</p>
                </div>
                <div>
                  <Label className="text-xs">Submitted by</Label>
                  <p className="mt-1 text-sm">{selected.submittedBy}</p>
                </div>
                <div>
                  <Label className="text-xs">Submitted</Label>
                  <p className="mt-1 text-sm">{timeAgo(selected.submittedAt)}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs">Variables</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.variables.length === 0 ? <span className="text-xs text-muted-foreground">None</span> : selected.variables.map(v => <Badge key={v} variant="outline" className="bg-brand/10 text-brand border-brand/30 text-[10px] font-mono">{`{{${v}}}`}</Badge>)}
                </div>
              </div>
              <div>
                <Label className="text-xs">Content Preview</Label>
                <div className="mt-1 rounded-md border bg-muted/40 p-3 text-sm">{selected.content}</div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <Icon name={selected.compliance === "passed" ? "CheckCircle2" : selected.compliance === "warning" ? "AlertCircle" : "AlertTriangle"} className={`h-4 w-4 ${selected.compliance === "passed" ? "text-emerald-500" : selected.compliance === "warning" ? "text-amber-500" : "text-rose-500"}`} />
                  <span className="text-xs">Compliance check: <span className="font-medium capitalize">{selected.compliance}</span></span>
                </div>
                {complianceBadge(selected.compliance)}
              </div>
              <div>
                <Label className="text-xs">Rejection feedback (required if rejecting)</Label>
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} placeholder="e.g. Salary disclosure prohibited in templates per clause 4.2..." className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={approve}><Icon name="Check" className="mr-1 h-4 w-4" /> Approve</Button>
                <Button variant="outline" className="flex-1 text-rose-600" onClick={reject}><Icon name="X" className="mr-1 h-4 w-4" /> Reject</Button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Approved Template Library" description="Recently approved templates" contentClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs">
              <tr>
                <th className="p-3 font-medium">Template</th>
                <th className="p-3 font-medium">Channel</th>
                <th className="p-3 font-medium">Version</th>
                <th className="p-3 font-medium">Uses</th>
                <th className="p-3 font-medium">Approved</th>
              </tr>
            </thead>
            <tbody>
              {APPROVED.map(a => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px] capitalize">{a.channel}</Badge></td>
                  <td className="p-3 text-xs">v{a.version}</td>
                  <td className="p-3 text-xs">{a.uses.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-xs text-muted-foreground">{timeAgo(a.approvedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
