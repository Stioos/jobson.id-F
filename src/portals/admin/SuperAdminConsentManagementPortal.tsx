"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

type ConsentType = "Marketing" | "Recruiter Outreach" | "Data Sharing" | "Third-party" | "Analytics";
type ConsentStatus = "Granted" | "Withdrawn" | "Pending";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Training" | "Partner" | "Admin";

interface ConsentFlow {
  portal: Portal;
  effect: string;
  status: "Active" | "Disabled" | "Pending";
}

interface ConsentRecord {
  id: string;
  user: string;
  portal: Portal;
  type: ConsentType;
  status: ConsentStatus;
  grantedAt: string;
  expiryAt?: string;
  withdrawnAt?: string;
  purpose: string;
  flow: ConsentFlow[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Admin: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

const TYPE_TONES: Record<ConsentType, string> = {
  Marketing: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  "Recruiter Outreach": "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "Data Sharing": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Third-party": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Analytics: "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const STATUS_TONES: Record<ConsentStatus, string> = {
  Granted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Withdrawn: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

const CONSENTS: ConsentRecord[] = [
  { id: "CN-8001", user: "Aarav Sharma", portal: "Candidate", type: "Marketing", status: "Granted", grantedAt: "2024-08-10T10:00:00Z", expiryAt: "2025-08-10T10:00:00Z", purpose: "Receive product updates and newsletters", flow: [
    { portal: "Candidate", effect: "User sees marketing comms preferences", status: "Active" },
    { portal: "Admin", effect: "Campaigns include this user", status: "Active" },
    { portal: "Employer", effect: "Not affected", status: "Disabled" },
  ]},
  { id: "CN-8002", user: "Diya Patel", portal: "Candidate", type: "Recruiter Outreach", status: "Withdrawn", grantedAt: "2024-07-15T10:00:00Z", withdrawnAt: "2024-09-12T15:00:00Z", purpose: "Allow recruiters to contact for relevant opportunities", flow: [
    { portal: "Candidate", effect: "Profile hidden from recruiter search", status: "Active" },
    { portal: "Recruiter", effect: "Profile no longer indexed in Resdex", status: "Active" },
    { portal: "Recruiter", effect: "Active outreach to this candidate disabled", status: "Active" },
  ]},
  { id: "CN-8003", user: "TechCorp India", portal: "Employer", type: "Data Sharing", status: "Granted", grantedAt: "2024-06-01T10:00:00Z", expiryAt: "2025-06-01T10:00:00Z", purpose: "Share candidate assessment data with partner training providers", flow: [
    { portal: "Employer", effect: "Can request training provider assessment", status: "Active" },
    { portal: "Training", effect: "Receives candidate assessment context", status: "Active" },
    { portal: "Candidate", effect: "Notified of data sharing", status: "Active" },
  ]},
  { id: "CN-8004", user: "Rohan Mehta", portal: "Candidate", type: "Third-party", status: "Granted", grantedAt: "2024-09-01T10:00:00Z", expiryAt: "2025-09-01T10:00:00Z", purpose: "Background verification with third-party BGV vendor", flow: [
    { portal: "Candidate", effect: "BGV consent captured", status: "Active" },
    { portal: "Admin", effect: "BGV vendor receives data package", status: "Active" },
    { portal: "Employer", effect: "Receives BGV report", status: "Active" },
  ]},
  { id: "CN-8005", user: "TalentBridge RPO", portal: "Recruiter", type: "Analytics", status: "Granted", grantedAt: "2024-05-10T10:00:00Z", purpose: "Aggregate performance analytics for sourcing activities", flow: [
    { portal: "Recruiter", effect: "Performance dashboards enabled", status: "Active" },
    { portal: "Admin", effect: "Aggregated metrics available", status: "Active" },
  ]},
  { id: "CN-8006", user: "Ananya Iyer", portal: "Candidate", type: "Recruiter Outreach", status: "Pending", grantedAt: "2024-09-19T10:00:00Z", purpose: "Recruiter outreach for new role opportunities", flow: [
    { portal: "Candidate", effect: "Awaiting explicit opt-in", status: "Pending" },
    { portal: "Recruiter", effect: "Profile not yet searchable", status: "Pending" },
  ]},
  { id: "CN-8007", user: "BrightApps Tech", portal: "Employer", type: "Marketing", status: "Granted", grantedAt: "2024-04-15T10:00:00Z", expiryAt: "2025-04-15T10:00:00Z", purpose: "Receive employer product updates", flow: [
    { portal: "Employer", effect: "Marketing comms enabled", status: "Active" },
    { portal: "Admin", effect: "Included in B2B campaigns", status: "Active" },
  ]},
  { id: "CN-8008", user: "Karthik Rao", portal: "Candidate", type: "Data Sharing", status: "Withdrawn", grantedAt: "2024-06-15T10:00:00Z", withdrawnAt: "2024-09-18T11:00:00Z", purpose: "Share profile data with employer partners", flow: [
    { portal: "Candidate", effect: "Profile no longer shared with partners", status: "Active" },
    { portal: "Partner", effect: "Profile removed from partner directory", status: "Active" },
    { portal: "Admin", effect: "Data sharing disabled", status: "Active" },
  ]},
  { id: "CN-8009", user: "CodeCraft Bootcamp", portal: "Training", type: "Analytics", status: "Granted", grantedAt: "2024-07-01T10:00:00Z", purpose: "Training outcomes analytics", flow: [
    { portal: "Training", effect: "Outcomes dashboard enabled", status: "Active" },
    { portal: "Admin", effect: "Aggregated analytics available", status: "Active" },
  ]},
  { id: "CN-8010", user: "Sneha Reddy", portal: "Candidate", type: "Third-party", status: "Granted", grantedAt: "2024-08-20T10:00:00Z", expiryAt: "2025-08-20T10:00:00Z", purpose: "Reference check verification with third-party vendor", flow: [
    { portal: "Candidate", effect: "Reference check consent captured", status: "Active" },
    { portal: "Admin", effect: "Reference vendor engaged", status: "Active" },
    { portal: "Employer", effect: "Receives reference check report", status: "Active" },
  ]},
  { id: "CN-8011", user: "Vivek Nair", portal: "Candidate", type: "Marketing", status: "Withdrawn", grantedAt: "2024-05-10T10:00:00Z", withdrawnAt: "2024-09-05T08:00:00Z", purpose: "Marketing communications", flow: [
    { portal: "Candidate", effect: "Marketing comms stopped", status: "Active" },
    { portal: "Admin", effect: "Removed from campaign lists", status: "Active" },
  ]},
  { id: "CN-8012", user: "Nimbus Labs", portal: "Employer", type: "Data Sharing", status: "Pending", grantedAt: "2024-09-20T10:00:00Z", purpose: "Share hiring analytics with industry benchmarks", flow: [
    { portal: "Employer", effect: "Awaiting admin approval", status: "Pending" },
    { portal: "Admin", effect: "Review pending", status: "Pending" },
  ]},
  { id: "CN-8013", user: "Priya Menon", portal: "Candidate", type: "Recruiter Outreach", status: "Granted", grantedAt: "2024-07-22T10:00:00Z", expiryAt: "2025-07-22T10:00:00Z", purpose: "Allow recruiters to reach out for opportunities", flow: [
    { portal: "Candidate", effect: "Profile searchable", status: "Active" },
    { portal: "Recruiter", effect: "Profile indexed in Resdex", status: "Active" },
  ]},
  { id: "CN-8014", user: "Apex Staffing", portal: "Recruiter", type: "Marketing", status: "Granted", grantedAt: "2024-03-10T10:00:00Z", expiryAt: "2025-03-10T10:00:00Z", purpose: "Recruiter product updates", flow: [
    { portal: "Recruiter", effect: "Marketing comms enabled", status: "Active" },
    { portal: "Admin", effect: "B2B campaigns active", status: "Active" },
  ]},
  { id: "CN-8015", user: "Arjun Singh", portal: "Candidate", type: "Analytics", status: "Granted", grantedAt: "2024-08-05T10:00:00Z", purpose: "Aggregate analytics for profile views and search appearances", flow: [
    { portal: "Candidate", effect: "Profile analytics dashboard", status: "Active" },
    { portal: "Admin", effect: "Aggregated metrics", status: "Active" },
  ]},
];

export function SuperAdminConsentManagementPortal() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = CONSENTS.filter(c => {
    const q = search.toLowerCase();
    const m = !q || c.id.toLowerCase().includes(q) || c.user.toLowerCase().includes(q);
    const t = type === "all" || c.type === type;
    const s = status === "all" || c.status === status;
    return m && t && s;
  });

  const granted = CONSENTS.filter(c => c.status === "Granted").length;
  const withdrawn = CONSENTS.filter(c => c.status === "Withdrawn").length;
  const pending = CONSENTS.filter(c => c.status === "Pending").length;
  const expired = CONSENTS.filter(c => c.expiryAt && new Date(c.expiryAt).getTime() < Date.now()).length;
  const byType = (Object.keys(TYPE_TONES) as ConsentType[]).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Consent"
        description="Cross-portal consent management — track grant/withdrawal of Marketing, Recruiter Outreach, Data Sharing, Third-party, and Analytics consents across all portals with DPDP Act 2023 compliance checks."
        icon={<Icon name="HeartHandshake" className="h-6 w-6" />}
        actions={[
          { label: "DPDP Audit", variant: "outline", onClick: () => toast.success("Running DPDP Act 2023 compliance audit…") },
          { label: "Export", variant: "default", onClick: () => toast.success("Exporting consent registry…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <StatCard label="Total Consents" value={CONSENTS.length} icon={<Icon name="HeartHandshake" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Granted" value={granted} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Withdrawn" value={withdrawn} icon={<Icon name="X" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Pending" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="By Type" value={byType} icon={<Icon name="Layers" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Consent Registry" description={`${filtered.length} of ${CONSENTS.length} consent records across portals`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search consent ID, user…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(TYPE_TONES) as ConsentType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Granted">Granted</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="HeartHandshake" className="h-6 w-6" />} title="No consent records match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Consent ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Granted / Expiry</TableHead>
                  <TableHead>Withdrawn</TableHead>
                  <TableHead>Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <React.Fragment key={c.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === c.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="text-xs font-medium">{c.user}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.portal]}`}>{c.portal}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONES[c.type]}`}>{c.type}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONES[c.status]}`}>{c.status}</Badge></TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">
                        <div>granted {timeAgo(c.grantedAt)}</div>
                        {c.expiryAt && <div>exp {new Date(c.expiryAt).toLocaleDateString()}</div>}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{c.withdrawnAt ? timeAgo(c.withdrawnAt) : "—"}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground max-w-[14rem] truncate">{c.purpose}</TableCell>
                    </TableRow>
                    {expanded === c.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={9} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Cross-Portal Consent Flow · {c.id}</p>
                              </div>
                              {c.status !== "Withdrawn" && (
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`${c.id} withdrawal propagated across all portals`)}>
                                  <Icon name="X" className="mr-1 h-3 w-3" /> Withdraw
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground"><Icon name="HeartHandshake" className="mr-1 inline h-3 w-3" />Purpose: {c.purpose}</p>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {c.flow.map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${f.status === "Active" ? "border-emerald-500/30 bg-emerald-500/5" : f.status === "Pending" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={f.status === "Active" ? "CheckCircle2" : f.status === "Pending" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${f.status === "Active" ? "text-emerald-600" : f.status === "Pending" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[f.portal]}`}>{f.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{f.effect}</p>
                                  </div>
                                  {i < c.flow.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="DPDP Act 2023 Compliance" description="Compliance checks across consent registry">
          <div className="space-y-2">
            {[
              { check: "All consents have explicit purpose", status: "passed", count: `${CONSENTS.length}/${CONSENTS.length}` },
              { check: "Withdrawal propagation completed", status: "passed", count: `${withdrawn}/${withdrawn}` },
              { check: "Consent expiry tracking active", status: "passed", count: `${CONSENTS.filter(c => c.expiryAt).length}/${CONSENTS.length}` },
              { check: "Pending consents within 7-day SLA", status: "warning", count: `${pending}/3` },
              { check: "Expired consents auto-withdrawn", status: expired > 0 ? "failed" : "passed", count: `${expired} expired` },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <Icon name={c.status === "passed" ? "CheckCircle2" : c.status === "warning" ? "AlertCircle" : "ShieldAlert"} className={`h-4 w-4 ${c.status === "passed" ? "text-emerald-600" : c.status === "warning" ? "text-amber-600" : "text-rose-600"}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium">{c.check}</p>
                  <p className="text-[10px] text-muted-foreground">{c.count}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${c.status === "passed" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : c.status === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-700" : "border-rose-500/30 bg-rose-500/10 text-rose-700"}`}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Withdrawal Cascade — Recruiter Outreach" description="Example: candidate withdraws recruiter outreach consent">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">When a candidate withdraws "Recruiter Outreach" consent, these portals are notified:</p>
            {[
              { portal: "Candidate", effect: "Profile hidden from recruiter search", delay: "Immediate" },
              { portal: "Recruiter", effect: "Profile removed from Resdex index", delay: "< 1 min" },
              { portal: "Recruiter", effect: "Active outreach disabled", delay: "< 1 min" },
              { portal: "Admin", effect: "Compliance log entry created", delay: "< 5 min" },
              { portal: "Employer", effect: "Saved searches de-index this profile", delay: "< 1 hour" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">{i + 1}</span>
                <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[s.portal as Portal]}`}>{s.portal}</Badge>
                <span className="flex-1 text-xs">{s.effect}</span>
                <span className="text-[10px] text-muted-foreground">{s.delay}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
