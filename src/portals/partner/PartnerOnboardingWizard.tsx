"use client";

import * as React from "react";
import {
  Rocket, CheckCircle2, Circle, Clock, Upload, FileText, MapPin,
  Users, Briefcase, Globe, ShieldCheck, ChevronRight, ChevronLeft,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type StepStatus = "Complete" | "In Progress" | "Not Started";

interface ChecklistItem { label: string; done: boolean }
interface WizardStep {
  id: number;
  key: string;
  label: string;
  icon: React.ReactNode;
  status: StepStatus;
  description: string;
  checklist: ChecklistItem[];
  fields: { label: string; value: string; placeholder?: string }[];
  documents: { name: string; uploaded: boolean }[];
}

const INITIAL: WizardStep[] = [
  {
    id: 1, key: "application", label: "Application", icon: <FileText className="h-4 w-4" />, status: "Complete",
    description: "Partner application submitted and accepted.",
    checklist: [{ label: "Partner type selected", done: true }, { label: "Primary contact details", done: true }, { label: "Business profile completed", done: true }],
    fields: [{ label: "Legal entity name", value: "Meridian Skills Pvt. Ltd." }, { label: "GSTIN", value: "29ABCDE1234F1Z5" }, { label: "Primary contact", value: "Rahul Verma" }],
    documents: [{ name: "Incorporation certificate.pdf", uploaded: true }, { name: "PAN card.pdf", uploaded: true }],
  },
  {
    id: 2, key: "kyc", label: "KYC", icon: <ShieldCheck className="h-4 w-4" />, status: "Complete",
    description: "KYC documents verified by compliance team.",
    checklist: [{ label: "Director KYC collected", done: true }, { label: "Address proof verified", done: true }, { label: "Bank account validated", done: true }],
    fields: [{ label: "Bank account number", value: "••••••4321" }, { label: "IFSC", value: "HDFC0001234" }],
    documents: [{ name: "Director_ID_Proof.pdf", uploaded: true }, { name: "Address_Proof.pdf", uploaded: true }],
  },
  {
    id: 3, key: "agreement", label: "Agreement", icon: <FileText className="h-4 w-4" />, status: "Complete",
    description: "MoU signed by both parties.",
    checklist: [{ label: "MoU terms reviewed", done: true }, { label: "Revenue split agreed", done: true }, { label: "Signatures captured", done: true }],
    fields: [{ label: "MoU ID", value: "MOU-2024-0142" }, { label: "Valid till", value: "2027-04-15" }],
    documents: [{ name: "Signed_MoU.pdf", uploaded: true }],
  },
  {
    id: 4, key: "centre", label: "Centre Setup", icon: <MapPin className="h-4 w-4" />, status: "In Progress",
    description: "Training centre registered and inspected.",
    checklist: [{ label: "Centre address verified", done: true }, { label: "Capacity audit complete", done: true }, { label: "Equipment checklist signed off", done: false }, { label: "Photographs uploaded", done: false }],
    fields: [{ label: "Centre name", value: "Meridian Bengaluru Centre" }, { label: "Address", value: "MG Road, Bengaluru" }, { label: "Seating capacity", value: "60" }],
    documents: [{ name: "Centre_Photos.zip", uploaded: true }, { name: "Equipment_Audit.pdf", uploaded: false }],
  },
  {
    id: 5, key: "batch", label: "First Batch", icon: <Users className="h-4 w-4" />, status: "Not Started",
    description: "Schedule the first training batch.",
    checklist: [{ label: "Course selected", done: false }, { label: "Cohort dates defined", done: false }, { label: "Trainer allocated", done: false }],
    fields: [{ label: "Course", value: "", placeholder: "Full Stack Web Development" }, { label: "Start date", value: "", placeholder: "YYYY-MM-DD" }],
    documents: [],
  },
  {
    id: 6, key: "placement", label: "First Placement", icon: <Briefcase className="h-4 w-4" />, status: "Not Started",
    description: "First learner placed with employer partner.",
    checklist: [{ label: "Employer tie-up confirmed", done: false }, { label: "First placement recorded", done: false }],
    fields: [{ label: "Employer name", value: "", placeholder: "TechCorp India" }],
    documents: [],
  },
  {
    id: 7, key: "golive", label: "Go-Live", icon: <Globe className="h-4 w-4" />, status: "Not Started",
    description: "Centre goes live on the platform.",
    checklist: [{ label: "Branding kit applied", done: false }, { label: "Operations manual signed", done: false }, { label: "Support contacts configured", done: false }],
    fields: [{ label: "Go-live date", value: "", placeholder: "YYYY-MM-DD" }],
    documents: [],
  },
  {
    id: 8, key: "review", label: "Review", icon: <FileText className="h-4 w-4" />, status: "Not Started",
    description: "Comprehensive review by partnership team.",
    checklist: [{ label: "All prior steps complete", done: false }, { label: "Final review call scheduled", done: false }],
    fields: [],
    documents: [],
  },
  {
    id: 9, key: "complete", label: "Complete", icon: <Rocket className="h-4 w-4" />, status: "Not Started",
    description: "Onboarding complete — partner is fully active.",
    checklist: [{ label: "Welcome email sent", done: false }, { label: "Account marked active", done: false }],
    fields: [],
    documents: [],
  },
];

const STATUS_TONE: Record<StepStatus, string> = {
  "Complete": "text-emerald-600 border-emerald-500/30 bg-emerald-500/10",
  "In Progress": "text-amber-600 border-amber-500/30 bg-amber-500/10",
  "Not Started": "text-slate-500 border-slate-500/30 bg-slate-500/10",
};

export function PartnerOnboardingWizard() {
  const [steps, setSteps] = React.useState<WizardStep[]>(INITIAL);
  const [activeStepId, setActiveStepId] = React.useState(4); // step 4 in progress

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];
  const completed = steps.filter((s) => s.status === "Complete").length;
  const progressPct = Math.round((completed / steps.length) * 100);

  function setStatus(stepId: number, status: StepStatus) {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, status } : s));
  }

  function completeStep() {
    setStatus(activeStepId, "Complete");
    toast.success(`Step ${activeStepId} complete`, { description: activeStep.label });
    if (activeStepId < steps.length) setActiveStepId(activeStepId + 1);
  }
  function skipStep() {
    setStatus(activeStepId, "Not Started");
    toast.info(`Step ${activeStepId} skipped`, { description: "You can return later." });
    if (activeStepId < steps.length) setActiveStepId(activeStepId + 1);
  }
  function toggleChecklist(stepId: number, idx: number) {
    setSteps((prev) => prev.map((s) => s.id === stepId ? {
      ...s,
      checklist: s.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c),
    } : s));
  }
  function uploadDoc(name: string) {
    toast.success("Document uploaded", { description: name });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Onboarding Wizard"
        description="9-step journey from application to go-live. Complete each step, upload documents, and track progress to activation."
        icon={<Rocket className="h-6 w-6" />}
        actions={[
          { label: "View summary", variant: "outline", onClick: () => toast.info("Onboarding summary is below") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Steps complete" value={`${completed} / ${steps.length}`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="In progress" value={steps.filter((s) => s.status === "In Progress").length} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Not started" value={steps.filter((s) => s.status === "Not Started").length} icon={<Circle className="h-5 w-5" />} tone="default" />
        <StatCard label="Overall progress" value={`${progressPct}%`} icon={<Rocket className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Onboarding progress" description={`${progressPct}% complete — ${completed} of ${steps.length} steps done.`}>
        <Progress value={progressPct} className="h-2" />
        <div className="mt-4 flex flex-wrap items-center gap-1 overflow-x-auto">
          {steps.map((s, i) => {
            const isActive = s.id === activeStepId;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setActiveStepId(s.id)}
                  className={`flex min-w-[110px] flex-1 flex-col items-center rounded-lg border p-2.5 text-center transition-all ${isActive ? "border-brand bg-brand/5 shadow-sm" : "bg-card hover:border-brand/40"}`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    s.status === "Complete" ? "bg-emerald-500/10 text-emerald-600" :
                    s.status === "In Progress" ? "bg-amber-500/10 text-amber-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {s.status === "Complete" ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <p className="mt-1 text-[11px] font-medium leading-tight">{s.label}</p>
                  <p className="text-[9px] text-muted-foreground">{s.status}</p>
                </button>
                {i < steps.length - 1 && <ChevronRight className="hidden sm:block h-3 w-3 shrink-0 text-muted-foreground" />}
              </React.Fragment>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title={`Step ${activeStep.id}: ${activeStep.label}`}
          description={activeStep.description}
          className="lg:col-span-2"
          action={<Badge variant="outline" className={STATUS_TONE[activeStep.status]}>{activeStep.status}</Badge>}
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Checklist</p>
              <ul className="space-y-1.5">
                {activeStep.checklist.length === 0 && <li className="text-xs text-muted-foreground">No checklist items for this step.</li>}
                {activeStep.checklist.map((c, i) => (
                  <li key={i}>
                    <button onClick={() => toggleChecklist(activeStep.id, i)} className="flex w-full items-center gap-2 rounded-lg border bg-card p-2 text-left text-sm hover:bg-muted/40">
                      {c.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {activeStep.fields.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Form fields</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeStep.fields.map((f) => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-xs">{f.label}</Label>
                      <Input defaultValue={f.value} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep.documents.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Documents</p>
                <ul className="space-y-1.5">
                  {activeStep.documents.map((d) => (
                    <li key={d.name} className="flex items-center justify-between rounded-lg border bg-card p-2.5 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-brand shrink-0" />
                        <span className="truncate">{d.name}</span>
                      </div>
                      {d.uploaded ? (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Uploaded</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => uploadDoc(d.name)}><Upload className="h-3 w-3 mr-1" />Upload</Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
              <Button variant="ghost" size="sm" disabled={activeStepId <= 1} onClick={() => setActiveStepId(activeStepId - 1)}>
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={skipStep}>Skip</Button>
                {activeStep.status !== "Complete" && (
                  <Button size="sm" onClick={completeStep}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Complete step
                  </Button>
                )}
                <Button size="sm" variant="ghost" disabled={activeStepId >= steps.length} onClick={() => setActiveStepId(activeStepId + 1)}>
                  Next<ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Onboarding summary" description="All steps at a glance.">
          <ul className="space-y-2">
            {steps.map((s) => (
              <li key={s.id} className="flex items-start gap-2 rounded-lg border bg-card p-2.5 text-xs">
                <div className="mt-0.5 shrink-0">{s.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{s.id}. {s.label}</p>
                    <Badge variant="outline" className={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{s.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
