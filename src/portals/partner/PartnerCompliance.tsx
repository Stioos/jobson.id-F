"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  ShieldCheck, AlertTriangle, CalendarCheck2, Upload, CheckCircle2, Clock, XCircle, FileText, Plus,
} from "lucide-react";

interface ComplianceItem {
  id: string;
  name: string;
  category: string;
  status: "compliant" | "due_soon" | "overdue" | "not_started";
  dueDate: string;
  lastCompleted?: string;
  mandatory: boolean;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: "c_001", name: "GST Filing — Oct 2024", category: "Tax", status: "compliant", dueDate: new Date(Date.now() + 20 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 5 * 86400000).toISOString(), mandatory: true },
  { id: "c_002", name: "Centre Inspection — Main Campus", category: "Infrastructure", status: "due_soon", dueDate: new Date(Date.now() + 15 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 75 * 86400000).toISOString(), mandatory: true },
  { id: "c_003", name: "Faculty Certification Renewal", category: "Faculty", status: "overdue", dueDate: new Date(Date.now() - 8 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 368 * 86400000).toISOString(), mandatory: true },
  { id: "c_004", name: "Student KYC Verification", category: "Student", status: "compliant", dueDate: new Date(Date.now() + 60 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 2 * 86400000).toISOString(), mandatory: true },
  { id: "c_005", name: "ISO 29993 Re-certification", category: "Quality", status: "due_soon", dueDate: new Date(Date.now() + 35 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 330 * 86400000).toISOString(), mandatory: true },
  { id: "c_006", name: "Fire Safety Audit", category: "Infrastructure", status: "compliant", dueDate: new Date(Date.now() + 180 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 30 * 86400000).toISOString(), mandatory: true },
  { id: "c_007", name: "Data Protection (DPDP) Compliance", category: "Legal", status: "compliant", dueDate: new Date(Date.now() + 90 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 10 * 86400000).toISOString(), mandatory: true },
  { id: "c_008", name: "NSDC Quarterly Report", category: "Reporting", status: "not_started", dueDate: new Date(Date.now() + 25 * 86400000).toISOString(), mandatory: true },
  { id: "c_009", name: "Anti-Ragging Policy Display", category: "Policy", status: "compliant", dueDate: new Date(Date.now() + 365 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 60 * 86400000).toISOString(), mandatory: false },
  { id: "c_010", name: "Placement Cell Audit", category: "Placement", status: "due_soon", dueDate: new Date(Date.now() + 12 * 86400000).toISOString(), lastCompleted: new Date(Date.now() - 80 * 86400000).toISOString(), mandatory: false },
];

interface DocItem {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

const DOCS: DocItem[] = [
  { id: "d_001", name: "GST Certificate 2024-25.pdf", type: "Tax", uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(), size: "1.2 MB" },
  { id: "d_002", name: "NSDC Approval Letter.pdf", type: "Accreditation", uploadedAt: new Date(Date.now() - 60 * 86400000).toISOString(), size: "840 KB" },
  { id: "d_003", name: "ISO 29993 Certificate.pdf", type: "Quality", uploadedAt: new Date(Date.now() - 330 * 86400000).toISOString(), size: "2.1 MB" },
  { id: "d_004", name: "Fire Safety Audit Report.pdf", type: "Infrastructure", uploadedAt: new Date(Date.now() - 30 * 86400000).toISOString(), size: "3.4 MB" },
];

function statusToTone(s: ComplianceItem["status"]) {
  if (s === "compliant") return "success";
  if (s === "due_soon") return "warning";
  if (s === "overdue") return "danger";
  return "default";
}

function statusLabel(s: ComplianceItem["status"]) {
  return s.replace(/_/g, " ");
}

export function PartnerCompliance() {
  const partner = CURRENT_PARTNER;
  const [items, setItems] = React.useState<ComplianceItem[]>(COMPLIANCE_ITEMS);

  const compliantCount = items.filter((i) => i.status === "compliant").length;
  const overdueCount = items.filter((i) => i.status === "overdue").length;
  const dueSoonCount = items.filter((i) => i.status === "due_soon").length;
  const score = Math.round((compliantCount / items.length) * 100);

  const upcomingInspections = items.filter((i) => i.category === "Infrastructure" && (i.status === "due_soon" || i.status === "overdue"));

  function markComplete(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "compliant", lastCompleted: new Date().toISOString() } : i)));
    toast.success("Marked as complete", { description: items.find((i) => i.id === id)?.name });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance"
        description={`${partner.name} — track regulatory, accreditation, and operational compliance.`}
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[
          { label: "Upload Document", icon: "Upload", variant: "outline", onClick: () => toast.success("Document upload opened") },
        ]}
      />

      <PartnerDisclaimer />

      {/* Compliance score hero */}
      <Card className={score >= 85 ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overall Compliance Score</p>
              <p className={`mt-2 text-4xl font-bold ${score >= 85 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{score}%</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {compliantCount} compliant · {dueSoonCount} due soon · {overdueCount} overdue
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => toast.success("Compliance report downloaded")}>
                <FileText className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </div>
          </div>
          <Progress value={score} className="mt-4 h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={items.length} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Compliant" value={compliantCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Due Soon" value={dueSoonCount} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={overdueCount} icon={<AlertTriangle className="h-5 w-5" />} tone={overdueCount > 0 ? "danger" : "default"} />
      </div>

      {/* Overdue alerts */}
      {overdueCount > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{overdueCount} overdue compliance item(s)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {items.filter((i) => i.status === "overdue").map((i) => i.name).join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance checklist */}
      <SectionCard title="Compliance Checklist" description="All regulatory and operational compliance items">
        <ul className="space-y-2 max-h-[480px] overflow-y-auto scroll-thin">
          {items.map((item) => {
            const dleft = daysUntil(item.dueDate);
            const overdue = item.status === "overdue";
            return (
              <li key={item.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {item.status === "compliant" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : overdue ? (
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.category} · {item.mandatory ? "Mandatory" : "Optional"} ·
                        Due: <span className={overdue ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>{formatDate(item.dueDate)}</span>
                        {item.status !== "compliant" && (
                          <span className={overdue ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}> ({dleft < 0 ? `${Math.abs(dleft)}d overdue` : `${dleft}d left`})</span>
                        )}
                      </p>
                      {item.lastCompleted && (
                        <p className="text-xs text-muted-foreground">Last completed: {formatDate(item.lastCompleted)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={statusLabel(item.status)} className={statusToTone(item.status) === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20" : statusToTone(item.status) === "warning" ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20" : statusToTone(item.status) === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20" : ""} />
                    {item.status !== "compliant" && (
                      <Button size="sm" variant="outline" onClick={() => markComplete(item.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Done
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* Upcoming inspections + document vault */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Upcoming Inspections" description="Scheduled compliance audits">
          {upcomingInspections.length === 0 ? (
            <EmptyState icon={<CalendarCheck2 className="h-5 w-5" />} title="No upcoming inspections" />
          ) : (
            <ul className="space-y-2">
              {upcomingInspections.map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Due: {formatDate(i.dueDate)} ({daysUntil(i.dueDate) < 0 ? `${Math.abs(daysUntil(i.dueDate))}d overdue` : `${daysUntil(i.dueDate)}d left`})</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Inspection scheduled", { description: i.name })}>Schedule</Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Document Vault"
          description="Uploaded compliance documents"
          action={<Button size="sm" variant="ghost" onClick={() => toast.success("Upload dialog opened")}><Plus className="h-4 w-4" /></Button>}
        >
          <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {DOCS.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.type} · {d.size} · {formatDate(d.uploadedAt)}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Document downloaded", { description: d.name })}>
                  <Upload className="h-3.5 w-3.5 rotate-180" />
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
