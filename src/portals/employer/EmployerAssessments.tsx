"use client";

import * as React from "react";
import { assessments, assessmentResults, jobs, employerJobsExtra } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";
import { Plus, ClipboardCheck, Send, Clock } from "lucide-react";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");
const EMPLOYER_RESULTS = assessmentResults.filter((r) => EMPLOYER_JOBS.some((j) => j.id === r.jobId));

export function EmployerAssessments() {
  const [tab, setTab] = React.useState<"library" | "assigned">("library");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [sendTarget, setSendTarget] = React.useState<string | null>(null);
  const [sendCandidate, setSendCandidate] = React.useState("");
  const [newAssessment, setNewAssessment] = React.useState({ name: "", type: "technical", duration: "60", description: "" });

  const sendAssessment = () => {
    if (!sendCandidate.trim()) { toast.error("Candidate name required"); return; }
    toast.success("Assessment sent", { description: `${sendCandidate} has 3 days to complete.` });
    setSendTarget(null);
    setSendCandidate("");
  };

  const createAssessment = () => {
    if (!newAssessment.name.trim()) { toast.error("Assessment name required"); return; }
    toast.success(`Assessment "${newAssessment.name}" created`);
    setNewAssessment({ name: "", type: "technical", duration: "60", description: "" });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Test candidate skills with structured assessments"
        actions={[{ label: "Create assessment", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "library" | "assigned")}>
        <TabsList>
          <TabsTrigger value="library"><ClipboardCheck className="mr-1 h-3 w-3" /> Library</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({EMPLOYER_RESULTS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assessments.map((a) => (
              <Card key={a.id} className="flex flex-col">
                <CardContent className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="capitalize">{a.difficulty}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{a.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.skillsAssessed.map((s) => <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.durationMinutes} min</span>
                    <span>{a.questionsCount} questions</span>
                  </div>
                  <Button size="sm" className="mt-auto" onClick={() => setSendTarget(a.id)}>
                    <Send className="mr-2 h-3 w-3" /> Assign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assigned" className="mt-4">
          <SectionCard>
            {EMPLOYER_RESULTS.length === 0 ? (
              <EmptyState icon={<ClipboardCheck className="h-5 w-5" />} title="No assessments assigned" description="Assign an assessment from the library." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EMPLOYER_RESULTS.map((r) => {
                      const job = EMPLOYER_JOBS.find((j) => j.id === r.jobId);
                      const pct = Math.round((r.score / r.maxScore) * 100);
                      const days = daysUntil(r.deadline);
                      return (
                        <TableRow key={r.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <AvatarLogo text={r.candidateName} size="xs" />
                              <span className="text-sm font-medium">{r.candidateName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{r.assessmentName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{job?.title ?? "—"}</TableCell>
                          <TableCell>
                            {r.status === "completed" ? (
                              <span className={`font-medium ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-rose-600"}`}>{r.score}/{r.maxScore} ({pct}%)</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(r.deadline)} <span className={days < 0 ? "text-rose-600" : days <= 1 ? "text-amber-600" : ""}>({days < 0 ? "expired" : `${days}d`})</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create assessment</DialogTitle>
            <DialogDescription>Build a custom assessment for your roles.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input placeholder="e.g. Senior Frontend Code Review" value={newAssessment.name} onChange={(e) => setNewAssessment({ ...newAssessment, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={newAssessment.type} onValueChange={(v) => setNewAssessment({ ...newAssessment, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="aptitude">Aptitude</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="role_specific">Role-specific</SelectItem>
                    <SelectItem value="psychometric">Psychometric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input type="number" value={newAssessment.duration} onChange={(e) => setNewAssessment({ ...newAssessment, duration: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={newAssessment.description} onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createAssessment}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send dialog */}
      <Dialog open={!!sendTarget} onOpenChange={(o) => !o && setSendTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send assessment</DialogTitle>
            <DialogDescription>Assign this assessment to a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Candidate</Label>
              <Input placeholder="Search candidate…" value={sendCandidate} onChange={(e) => setSendCandidate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Select defaultValue="3">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendTarget(null)}>Cancel</Button>
            <Button onClick={sendAssessment}><Send className="mr-2 h-4 w-4" /> Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
