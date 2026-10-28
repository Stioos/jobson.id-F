"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface AuditMsg {
  id: string;
  portal: "candidate" | "employer" | "recruiter" | "training" | "partner";
  channel: "email" | "sms" | "whatsapp" | "in-app" | "push";
  sender: string;
  recipient: string;
  preview: string;
  flagged: string | null;
  status: "clean" | "flagged" | "blocked";
  at: string;
}

const MESSAGES: AuditMsg[] = [
  { id: "msg_8821", portal: "employer", channel: "email", sender: "hr@acme.io", recipient: "cand_412@x.com", preview: "Hello, we'd like to invite you to interview for the Senior Engineer role at Acme. Please confirm availability...", flagged: null, status: "clean", at: "2024-09-21T10:32:00Z" },
  { id: "msg_8822", portal: "recruiter", channel: "sms", sender: "+91 98XXX XX221", recipient: "+91 99XXX XX110", preview: "Hi, sharing candidate resume and current CTC details (₹18 LPA). Please review and confirm next steps.", flagged: "PII / Salary Disclosure", status: "flagged", at: "2024-09-21T09:48:00Z" },
  { id: "msg_8823", portal: "employer", channel: "whatsapp", sender: "TechCorp WABA", recipient: "+91 90XXX XX442", preview: "We are an equal-opportunity employer seeking only male candidates under 30 for night shift.", flagged: "DEI Violation", status: "blocked", at: "2024-09-21T09:12:00Z" },
  { id: "msg_8824", portal: "candidate", channel: "in-app", sender: "candidate_5821", recipient: "recruiter_22", preview: "Thanks for the offer! I'd like to negotiate the joining bonus and relocation package.", flagged: null, status: "clean", at: "2024-09-21T08:30:00Z" },
  { id: "msg_8825", portal: "partner", channel: "email", sender: "director@college.edu", recipient: "ops@jobsonn.com", preview: "Sharing student Aadhaar numbers (PDF attached) for the 2024 batch placement verification.", flagged: "Data Leakage (Aadhaar)", status: "flagged", at: "2024-09-21T07:55:00Z" },
  { id: "msg_8826", portal: "recruiter", channel: "sms", sender: "+91 98XXX XX992", recipient: "+91 90XXX XX003", preview: "Stop calling me at 11pm! This is harassment. I will report to authorities.", flagged: "Harassment Report", status: "flagged", at: "2024-09-20T23:14:00Z" },
  { id: "msg_8827", portal: "training", channel: "push", sender: "system", recipient: "learner_4412", preview: "Your Python Basics certificate is ready to download. Tap to view.", flagged: null, status: "clean", at: "2024-09-20T18:02:00Z" },
  { id: "msg_8828", portal: "employer", channel: "email", sender: "ceo@startup.io", recipient: "founder@vc.com", preview: "Sharing the full candidate pipeline (120 resumes) outside the platform for direct outreach.", flagged: "Data Leakage", status: "blocked", at: "2024-09-20T16:21:00Z" },
];

const PORTALS = ["all", "candidate", "employer", "recruiter", "training", "partner"] as const;
const CHANNELS = ["all", "email", "sms", "whatsapp", "in-app", "push"] as const;

export function SuperAdminMessageAudit() {
  const [portal, setPortal] = React.useState<string>("all");
  const [channel, setChannel] = React.useState<string>("all");
  const [q, setQ] = React.useState("");

  const filtered = MESSAGES.filter(m =>
    (portal === "all" || m.portal === portal) &&
    (channel === "all" || m.channel === channel) &&
    (q === "" || (m.preview + m.sender + m.recipient).toLowerCase().includes(q.toLowerCase()))
  );

  const flaggedCount = MESSAGES.filter(m => m.status !== "clean").length;
  const blockedCount = MESSAGES.filter(m => m.status === "blocked").length;

  const takeAction = (m: AuditMsg, action: "warn" | "block" | "dismiss") => {
    const labels = { warn: "Warning issued", block: "Sender blocked", dismiss: "Flag dismissed" };
    toast.success(`${labels[action]} for ${m.sender}`, { description: `Message ${m.id}` });
  };

  const statusBadge = (s: AuditMsg["status"]) => {
    const cls = s === "clean" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "flagged" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Message Audit"
        description="Cross-platform message audit. Scan all candidate, employer, recruiter, and partner communications for prohibited content, DEI violations, harassment, and data leakage."
        icon={<Icon name="Search" className="h-6 w-6" />}
        actions={[{ label: "Export Audit", variant: "outline", onClick: () => toast.success("Audit trail exported (CSV)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Messages (24h)" value="42,184" icon={<Icon name="MessagesSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Flagged" value={flaggedCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Blocked" value={blockedCount} icon={<Icon name="Shield" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Clean Rate" value="99.4%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Filters" description="Filter audit trail by portal, channel, sender/recipient, or content keyword.">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Portal</label>
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PORTALS.map(p => <SelectItem key={p} value={p}>{p === "all" ? "All Portals" : p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Channel</label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANNELS.map(c => <SelectItem key={c} value={c}>{c === "all" ? "All Channels" : c.toUpperCase()}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Search (sender/recipient/content)</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="keyword, email, phone..." className="mt-1" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Audit Trail" description={`${filtered.length} messages`} contentClassName="p-0">
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Search" className="h-5 w-5" />} title="No messages match filters" description="Adjust filters to see more results." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="max-w-xs">
                    <div className="text-xs font-medium text-foreground">{m.sender} → {m.recipient}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{m.preview}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] capitalize">{m.portal}</Badge></TableCell>
                  <TableCell className="text-xs uppercase">{m.channel}</TableCell>
                  <TableCell>
                    {m.flagged ? <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/30 text-[10px]">{m.flagged}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>{statusBadge(m.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(m.at)}</TableCell>
                  <TableCell>
                    {m.status !== "clean" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => takeAction(m, "warn")}>Warn</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600" onClick={() => takeAction(m, "block")}>Block</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => takeAction(m, "dismiss")}>Dismiss</Button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
