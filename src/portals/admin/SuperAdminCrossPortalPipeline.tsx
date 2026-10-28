"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Stage = "Sourced" | "Submitted" | "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
type Portal = "Candidate" | "Recruiter" | "Training" | "Partner" | "Employer";

interface Candidate {
  id: string;
  name: string;
  role: string;
  sourcePortal: Portal;
  stage: Stage;
  portals: { portal: Portal; stage: Stage; next: string };
}

const STAGES: Stage[] = ["Sourced", "Submitted", "Applied", "Screening", "Interview", "Offer", "Hired"];

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const STAGE_TONES: Record<Stage, string> = {
  Sourced: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Submitted: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Applied: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Screening: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Interview: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Offer: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Hired: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const FUNNEL = [
  { stage: "Sourced", count: 20, conv: 100, avgHrs: 0, by: { Candidate: 0, Recruiter: 8, Training: 6, Partner: 6, Employer: 0 } },
  { stage: "Submitted", count: 16, conv: 80, avgHrs: 18, by: { Candidate: 0, Recruiter: 8, Training: 4, Partner: 4, Employer: 0 } },
  { stage: "Applied", count: 12, conv: 75, avgHrs: 36, by: { Candidate: 6, Recruiter: 3, Training: 2, Partner: 1, Employer: 0 } },
  { stage: "Screening", count: 9, conv: 75, avgHrs: 24, by: { Candidate: 0, Recruiter: 0, Training: 0, Partner: 0, Employer: 9 } },
  { stage: "Interview", count: 6, conv: 67, avgHrs: 72, by: { Candidate: 0, Recruiter: 0, Training: 0, Partner: 0, Employer: 6 } },
  { stage: "Offer", count: 4, conv: 67, avgHrs: 96, by: { Candidate: 0, Recruiter: 0, Training: 0, Partner: 0, Employer: 4 } },
  { stage: "Hired", count: 3, conv: 75, avgHrs: 120, by: { Candidate: 0, Recruiter: 0, Training: 0, Partner: 0, Employer: 3 } },
];

const CANDIDATES: Candidate[] = [
  { id: "C-01", name: "Aarav Sharma", role: "Frontend Engineer", sourcePortal: "Candidate", stage: "Sourced", portals: { portal: "Candidate", stage: "Sourced", next: "Submit to employer" } },
  { id: "C-02", name: "Diya Patel", role: "Product Designer", sourcePortal: "Recruiter", stage: "Sourced", portals: { portal: "Recruiter", stage: "Sourced", next: "Send to employer" } },
  { id: "C-03", name: "Rohan Mehta", role: "DevOps Engineer", sourcePortal: "Partner", stage: "Submitted", portals: { portal: "Partner", stage: "Submitted", next: "Awaiting employer ack" } },
  { id: "C-04", name: "Ananya Iyer", role: "Full Stack Dev", sourcePortal: "Training", stage: "Submitted", portals: { portal: "Training", stage: "Submitted", next: "Drive scheduled" } },
  { id: "C-05", name: "Karan Verma", role: "Backend Engineer", sourcePortal: "Candidate", stage: "Applied", portals: { portal: "Candidate", stage: "Applied", next: "Screening" } },
  { id: "C-06", name: "Sneha Reddy", role: "QA Lead", sourcePortal: "Recruiter", stage: "Applied", portals: { portal: "Recruiter", stage: "Submitted", next: "Screening at employer" } },
  { id: "C-07", name: "Vikram Singh", role: "Data Analyst", sourcePortal: "Partner", stage: "Applied", portals: { portal: "Partner", stage: "Submitted", next: "Screening" } },
  { id: "C-08", name: "Priya Nair", role: "UI Engineer", sourcePortal: "Training", stage: "Screening", portals: { portal: "Employer", stage: "Screening", next: "Interview" } },
  { id: "C-09", name: "Arjun Nair", role: "SRE", sourcePortal: "Recruiter", stage: "Screening", portals: { portal: "Employer", stage: "Screening", next: "Schedule interview" } },
  { id: "C-10", name: "Meera Joshi", role: "PMO Lead", sourcePortal: "Candidate", stage: "Screening", portals: { portal: "Employer", stage: "Screening", next: "Interview" } },
  { id: "C-11", name: "Sahil Khan", role: "Mobile Engineer", sourcePortal: "Partner", stage: "Interview", portals: { portal: "Employer", stage: "Interview", next: "Final round" } },
  { id: "C-12", name: "Ishita Bose", role: "ML Engineer", sourcePortal: "Training", stage: "Interview", portals: { portal: "Employer", stage: "Interview", next: "Offer decision" } },
  { id: "C-13", name: "Rajat Gupta", role: "Solution Architect", sourcePortal: "Recruiter", stage: "Interview", portals: { portal: "Employer", stage: "Interview", next: "Offer" } },
  { id: "C-14", name: "Tanvi Rao", role: "HRBP", sourcePortal: "Candidate", stage: "Offer", portals: { portal: "Employer", stage: "Offer", next: "Await acceptance" } },
  { id: "C-15", name: "Nikhil Joshi", role: "Security Analyst", sourcePortal: "Partner", stage: "Offer", portals: { portal: "Employer", stage: "Offer", next: "Acceptance pending" } },
  { id: "C-16", name: "Pooja Desai", role: "DevOps Lead", sourcePortal: "Recruiter", stage: "Offer", portals: { portal: "Employer", stage: "Offer", next: "Await docs" } },
  { id: "C-17", name: "Kabir Malhotra", role: "Backend Engineer", sourcePortal: "Training", stage: "Hired", portals: { portal: "Employer", stage: "Hired", next: "Onboarding" } },
  { id: "C-18", name: "Lavanya Pillai", role: "Frontend Engineer", sourcePortal: "Recruiter", stage: "Hired", portals: { portal: "Employer", stage: "Hired", next: "Onboarding" } },
  { id: "C-19", name: "Manish Agarwal", role: "QA Engineer", sourcePortal: "Candidate", stage: "Sourced", portals: { portal: "Candidate", stage: "Sourced", next: "Apply to role" } },
  { id: "C-20", name: "Nisha Kulkarni", role: "Data Scientist", sourcePortal: "Partner", stage: "Submitted", portals: { portal: "Partner", stage: "Submitted", next: "Submit to employer" } },
];

const BOTTLENECK = FUNNEL.reduce((min, f) => f.conv < min.conv ? f : min, FUNNEL[0]);

export function SuperAdminCrossPortalPipeline() {
  const [selected, setSelected] = React.useState<Candidate | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Pipeline"
        description="Unified hiring pipeline tracking candidates flowing across candidate, recruiter, training, partner and employer portals — funnel conversion, bottleneck detection and per-candidate stage trace."
        icon={<Icon name="KanbanSquare" className="h-6 w-6" />}
        actions={[
          { label: "Export Funnel", variant: "outline", onClick: () => toast.success("Exporting funnel report…") },
          { label: "Recompute", variant: "default", onClick: () => toast.success("Recomputing funnel…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Sourced" value={FUNNEL[0].count} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Pipeline" value={CANDIDATES.filter(c => c.stage !== "Hired").length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Hired" value={FUNNEL[6].count} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Bottleneck" value={`${BOTTLENECK.stage} (${BOTTLENECK.conv}%)`} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Pipeline Funnel" description="Stage-wise conversion, average time and source-portal breakdown">
        <div className="space-y-3">
          {FUNNEL.map((f, i) => {
            const prev = i === 0 ? f.count : FUNNEL[i - 1].count;
            const width = Math.round((f.count / FUNNEL[0].count) * 100);
            const isBottleneck = f.stage === BOTTLENECK.stage;
            return (
              <div key={f.stage} className={`rounded-lg border p-3 ${isBottleneck ? "border-rose-500/30 bg-rose-500/5" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${STAGE_TONES[f.stage]}`}>{f.stage}</Badge>
                    {isBottleneck && <Badge variant="outline" className="text-xs border-rose-500/30 bg-rose-500/15 text-rose-700">Bottleneck</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span><strong className="text-foreground">{f.count}</strong> candidates</span>
                    <span><strong className="text-foreground">{f.conv}%</strong> conv</span>
                    <span><strong className="text-foreground">{f.avgHrs}h</strong> avg</span>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-2 rounded-full ${isBottleneck ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${width}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(["Candidate", "Recruiter", "Training", "Partner", "Employer"] as Portal[]).map(p => (
                    f.by[p] > 0 && (
                      <Badge key={p} variant="outline" className={`text-[10px] ${PORTAL_TONES[p]}`}>{p}: {f.by[p]}</Badge>
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Pipeline Board" description="Kanban view — click a card for detail">
        {CANDIDATES.length === 0 ? (
          <EmptyState icon={<Icon name="KanbanSquare" className="h-6 w-6" />} title="No candidates in pipeline" />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STAGES.map(stage => {
              const items = CANDIDATES.filter(c => c.stage === stage);
              return (
                <div key={stage} className="w-60 shrink-0">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className={`text-xs ${STAGE_TONES[stage]}`}>{stage}</Badge>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
                    {items.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelected(c); toast.success(`Opening ${c.name}`); }}
                        className="w-full rounded-lg border bg-card p-3 text-left transition hover:border-brand/50 hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">{c.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">{c.role}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.sourcePortal]}`}>Source: {c.sourcePortal}</Badge>
                        </div>
                      </button>
                    ))}
                    {items.length === 0 && <p className="text-[10px] text-muted-foreground">—</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Candidate Detail</CardTitle></CardHeader>
          <CardContent>
            {!selected ? (
              <EmptyState icon={<Icon name="User" className="h-6 w-6" />} title="Select a candidate" description="Click any card in the pipeline board to see cross-portal stage detail." />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{selected.name} <span className="ml-1 font-mono text-[10px] text-muted-foreground">{selected.id}</span></p>
                    <p className="text-xs text-muted-foreground">{selected.role}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${PORTAL_TONES[selected.sourcePortal]}`}>Source: {selected.sourcePortal}</Badge>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Stage</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${STAGE_TONES[selected.stage]}`}>{selected.stage}</Badge>
                    <span className="text-xs text-muted-foreground">→ Next: {selected.portals.next}</span>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stage per Portal</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(["Candidate", "Recruiter", "Training", "Partner", "Employer"] as Portal[]).map((p, i) => {
                      const isActive = selected.sourcePortal === p || p === "Employer";
                      return (
                        <React.Fragment key={p}>
                          <div className={`rounded-md border p-2 ${isActive ? "border-brand/30 bg-brand/5" : "border-muted"}`}>
                            <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[p]}`}>{p}</Badge>
                            <p className="mt-1 text-[10px]">{isActive ? selected.stage : "—"}</p>
                          </div>
                          {i < 4 && <Icon name="ArrowRight" className="h-3 w-3 text-muted-foreground" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Advancing ${selected.name}`)}>Advance Stage</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Opening full profile for ${selected.name}`)}>View Profile</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Bottleneck Detection</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500" />
                <p className="text-xs font-semibold">{BOTTLENECK.stage}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Lowest conversion at {BOTTLENECK.conv}% — {BOTTLENECK.count} candidates</p>
              <p className="mt-1 text-xs text-muted-foreground">Avg time in stage: {BOTTLENECK.avgHrs}h</p>
            </div>
            <p className="pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Recommendations</p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-2"><Icon name="CheckCircle2" className="mt-0.5 h-3 w-3 text-emerald-500" /> Add interviewer capacity at employer stage</li>
              <li className="flex items-start gap-2"><Icon name="CheckCircle2" className="mt-0.5 h-3 w-3 text-emerald-500" /> Auto-advance screened candidates from recruiter</li>
              <li className="flex items-start gap-2"><Icon name="CheckCircle2" className="mt-0.5 h-3 w-3 text-emerald-500" /> SLA reminder when stage &gt; 72h</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
