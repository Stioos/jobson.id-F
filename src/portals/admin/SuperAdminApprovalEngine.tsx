"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Approval {
  id: string; type: "job_post" | "offer" | "refund" | "payout" | "course_publish"; requester: string; portal: string; submittedAt: string; slaHours: number; status: "pending" | "approved" | "rejected" | "breached"; currentStep: number; totalSteps: number;
}

const APPROVALS: Approval[] = [
  { id: "AP-2024-5001", type: "job_post", requester: "TechCorp India", portal: "employer", submittedAt: "2024-09-21T09:42:00Z", slaHours: 4, status: "pending", currentStep: 2, totalSteps: 3 },
  { id: "AP-2024-5002", type: "offer", requester: "TalentBridge RPO", portal: "recruiter", submittedAt: "2024-09-21T08:30:00Z", slaHours: 8, status: "pending", currentStep: 1, totalSteps: 4 },
  { id: "AP-2024-5003", type: "refund", requester: "Vikram Singh", portal: "employer", submittedAt: "2024-09-20T17:15:00Z", slaHours: 24, status: "breached", currentStep: 2, totalSteps: 3 },
  { id: "AP-2024-5004", type: "payout", requester: "Sneha Reddy", portal: "recruiter", submittedAt: "2024-09-21T07:08:00Z", slaHours: 12, status: "approved", currentStep: 4, totalSteps: 4 },
  { id: "AP-2024-5005", type: "course_publish", requester: "CodeCraft Bootcamp", portal: "training", submittedAt: "2024-09-21T06:42:00Z", slaHours: 6, status: "pending", currentStep: 1, totalSteps: 2 },
  { id: "AP-2024-5006", type: "job_post", requester: "NaukriX Pvt Ltd", portal: "employer", submittedAt: "2024-09-20T22:18:00Z", slaHours: 4, status: "breached", currentStep: 1, totalSteps: 3 },
  { id: "AP-2024-5007", type: "offer", requester: "Apex Staffing", portal: "recruiter", submittedAt: "2024-09-21T05:30:00Z", slaHours: 8, status: "pending", currentStep: 3, totalSteps: 4 },
  { id: "AP-2024-5008", type: "refund", requester: "Meera Joshi", portal: "candidate", submittedAt: "2024-09-19T11:22:00Z", slaHours: 24, status: "rejected", currentStep: 2, totalSteps: 3 },
];

const RULES = [
  { id: "rule_job", label: "Job post approval (employer)", enabled: true, slaHours: 4, steps: "Moderation → Manager → Auto-publish" },
  { id: "rule_offer", label: "Offer letter approval (recruiter)", enabled: true, slaHours: 8, steps: "Recruiter → Manager → Finance → Send" },
  { id: "rule_refund", label: "Refund approval (billing)", enabled: true, slaHours: 24, steps: "Request → Manager → Finance → Process" },
  { id: "rule_payout", label: "Payout approval (recruiter)", enabled: true, slaHours: 12, steps: "Recruiter → Finance → Approve → Settle" },
  { id: "rule_course", label: "Course publish (training)", enabled: false, slaHours: 6, steps: "Provider → Auto-publish" },
];

const BOTTLENECKS = [
  { step: "Manager approval (job_post)", avgHours: 6.4, sla: 4, severity: "high" },
  { step: "Finance review (refund)", avgHours: 18.2, sla: 24, severity: "medium" },
  { step: "Finance review (offer)", avgHours: 3.8, sla: 8, severity: "low" },
];

export function SuperAdminApprovalEngine() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [rules, setRules] = React.useState(RULES);

  const filtered = APPROVALS.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.id.toLowerCase().includes(q) || a.requester.toLowerCase().includes(q);
    const matchType = type === "all" || a.type === type;
    return matchSearch && matchType;
  });

  const pending = APPROVALS.filter(a => a.status === "pending").length;
  const breached = APPROVALS.filter(a => a.status === "breached").length;
  const approved = APPROVALS.filter(a => a.status === "approved").length;

  const statusBadge = (s: Approval["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "breached" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const toggleRule = (id: string) => {
    setRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast.success("Approval rule updated");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Engine"
        description="Central workflow engine governing job posts, offers, refunds, payouts, and course-publish approvals across every portal — SLA tracking, rule config, and bottleneck detection."
        icon={<Icon name="CheckCircle2" className="h-6 w-6" />}
        actions={[{ label: "New Rule", variant: "default", onClick: () => toast.success("Opening rule builder…") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Approvals" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="SLA Breached" value={breached} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Approved (24h)" value={approved} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Active Rules" value={rules.filter(r => r.enabled).length} icon={<Icon name="Workflow" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Pending Approvals Queue" description={`${filtered.length} of ${APPROVALS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID or requester…" className="h-9 max-w-sm" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="job_post">Job Post</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
              <SelectItem value="course_publish">Course Publish</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className={a.status === "breached" ? "bg-rose-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{a.type.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="text-xs">{a.requester}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{a.portal}</Badge></TableCell>
                  <TableCell className="text-xs">{timeAgo(a.submittedAt)}</TableCell>
                  <TableCell className="text-xs">{a.slaHours}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={(a.currentStep / a.totalSteps) * 100} />
                      <span className="text-xs">{a.currentStep}/{a.totalSteps}</span>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell>
                    {a.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${a.id} approved`)}>Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`${a.id} rejected`)}>Reject</Button>
                      </div>
                    ) : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Viewing ${a.id}`)}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Approval Rules" description="Configure workflow rules and SLAs">
          <div className="space-y-2">
            {rules.map(r => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Switch checked={r.enabled} onCheckedChange={() => toggleRule(r.id)} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.steps} · SLA {r.slaHours}h</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Editing ${r.id}…`)}>Edit</Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Bottleneck Detection" description="Slowest approval steps vs SLA">
          {BOTTLENECKS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No bottlenecks detected" />
          ) : (
            <div className="space-y-2">
              {BOTTLENECKS.map(b => (
                <div key={b.step} className={`flex items-center gap-3 rounded-lg border p-3 ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/5" : b.severity === "medium" ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
                  <Icon name={b.severity === "high" ? "AlertTriangle" : b.severity === "medium" ? "AlertCircle" : "Activity"} className={`h-5 w-5 ${b.severity === "high" ? "text-rose-500" : b.severity === "medium" ? "text-amber-500" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.step}</p>
                    <p className="text-xs text-muted-foreground">avg {b.avgHours}h vs SLA {b.sla}h</p>
                  </div>
                  <Badge variant="outline" className={`text-xs capitalize ${b.severity === "high" ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : b.severity === "medium" ? "border-amber-500/30 bg-amber-500/15 text-amber-700" : ""}`}>{b.severity}</Badge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
