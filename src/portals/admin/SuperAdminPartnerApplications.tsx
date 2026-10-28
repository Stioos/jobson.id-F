"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface App {
  id: string; applicant: string; type: string; region: string; email: string; docs: string[]; submittedAt: string; status: "pending" | "approved" | "rejected";
}

const APPS: App[] = [
  { id: "app_8821", applicant: "TalentBridge Consulting", type: "Franchise", region: "South", email: "apply@talentbridge.in", docs: ["MoU Draft", "GST Cert", "PAN", "Bank Statement"], submittedAt: "2024-09-21T08:42:00Z", status: "pending" },
  { id: "app_8820", applicant: "Apex Skill Academy", type: "MOU Partner", region: "West", email: "info@apexskills.in", docs: ["MOU Draft", "ISO Cert", "PAN"], submittedAt: "2024-09-20T15:30:00Z", status: "pending" },
  { id: "app_8819", applicant: "NorthStar Affiliates", type: "Affiliate", region: "North", email: "join@northstar.in", docs: ["Website URL", "PAN"], submittedAt: "2024-09-19T11:20:00Z", status: "pending" },
  { id: "app_8818", applicant: "EastBridge MOU", type: "MOU Partner", region: "East", email: "mou@eastbridge.in", docs: ["MOU Draft", "GST Cert", "PAN", "Audited Financials"], submittedAt: "2024-09-18T09:00:00Z", status: "pending" },
  { id: "app_8817", applicant: "BangaloreLaunchpad", type: "Affiliate", region: "South", email: "hello@blrlaunchpad.in", docs: ["Website", "PAN"], submittedAt: "2024-09-17T14:00:00Z", status: "approved" },
  { id: "app_8816", applicant: "MumbaiSkills Hub", type: "Franchise", region: "West", email: "apply@mumbaiskills.in", docs: ["MoU Draft", "GST Cert", "PAN", "Bank Statement"], submittedAt: "2024-09-15T10:30:00Z", status: "approved" },
];

export function SuperAdminPartnerApplications() {
  const [apps, setApps] = React.useState(APPS);
  const [active, setActive] = React.useState<App | null>(APPS.find(a => a.status === "pending") ?? null);
  const [reason, setReason] = React.useState("");

  const decide = (decision: "approve" | "reject") => {
    if (!active) return;
    if (decision === "reject" && !reason) { toast.error("Rejection reason required"); return; }
    setApps(apps.map(a => a.id === active.id ? { ...a, status: decision === "approve" ? "approved" : "rejected" } : a));
    toast.success(`${active.applicant} ${decision}d`);
    setActive(apps.find(a => a.id !== active.id && a.status === "pending") ?? null);
    setReason("");
  };

  const statusBadge = (s: string) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const pending = apps.filter(a => a.status === "pending");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Applications"
        description="Review and approve partnership applications — franchise, MOU, affiliate, college."
        icon={<Icon name="FileText" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending Review" value={pending.length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved (30d)" value={apps.filter(a => a.status === "approved").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Franchise Apps" value={apps.filter(a => a.type === "Franchise").length} icon={<Icon name="Building2" className="h-5 w-5" />} />
        <StatCard label="MOU Apps" value={apps.filter(a => a.type === "MOU Partner").length} icon={<Icon name="FileSignature" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Pending Queue" description={`${pending.length} applications`} className="lg:col-span-1">
          <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {pending.map(a => (
              <button
                key={a.id}
                onClick={() => setActive(a)}
                className={`w-full rounded-lg border p-3 text-left transition ${active?.id === a.id ? "border-brand bg-brand/5" : "bg-card hover:bg-muted/30"}`}
              >
                <div className="text-sm font-medium">{a.applicant}</div>
                <div className="text-xs text-muted-foreground">{a.type} • {a.region}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">{timeAgo(a.submittedAt)}</div>
              </button>
            ))}
            {pending.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No pending applications</div>}
          </div>
        </SectionCard>

        <SectionCard title={active ? `Reviewing: ${active.applicant}` : "Select an application"} description="Application details" className="lg:col-span-2">
          {active ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Applicant</p><p className="font-medium">{active.applicant}</p></div>
                <div><p className="text-xs text-muted-foreground">Type</p><p className="font-medium">{active.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Region</p><p className="font-medium">{active.region}</p></div>
                <div><p className="text-xs text-muted-foreground">Contact</p><p className="font-medium text-xs">{active.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium text-xs">{formatDate(active.submittedAt)}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p>{statusBadge(active.status)}</div>
              </div>
              <div>
                <Label className="text-xs">Submitted Documents</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {active.docs.map(d => (
                    <button key={d} onClick={() => toast.success(`Downloading ${d}.pdf`)} className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs hover:bg-brand/10 hover:text-brand">
                      <Icon name="FileText" className="h-3 w-3" /> {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs">Decision reason (required for reject)</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="e.g. Missing audited financials" className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => decide("approve")}>
                  <Icon name="Check" className="mr-1 h-4 w-4" /> Approve
                </Button>
                <Button variant="destructive" onClick={() => decide("reject")}>
                  <Icon name="X" className="mr-1 h-4 w-4" /> Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No application selected</div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
