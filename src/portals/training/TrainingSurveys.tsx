"use client";

import * as React from "react";
import { surveys } from "@/lib/lms-data";
import type { Survey } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatNumber, formatDate } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip, CHART_COLORS as COLORS } from "./_shared";
import { toast } from "sonner";
import { Plus, MessageSquare, X, Star } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  course_feedback: "Course Feedback", trainer_feedback: "Trainer Feedback",
  nps: "NPS", training_needs: "Training Needs", satisfaction: "Satisfaction",
};

export function TrainingSurveys() {
  const [rows, setRows] = React.useState<Survey[]>(surveys);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Survey | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  // form
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<Survey["type"]>("course_feedback");
  const [questions, setQuestions] = React.useState<string[]>([""]);

  const filtered = rows.filter((s) => {
    const matchType = typeFilter === "all" || s.type === typeFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchType && matchStatus;
  });

  const totalResponses = rows.reduce((s, x) => s + x.responses, 0);
  const activeCount = rows.filter((s) => s.status === "active").length;
  const avgResponseRate = rows.length > 0 ? Math.round(rows.reduce((s, x) => s + x.responseRate, 0) / rows.length) : 0;

  function create() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (questions.filter((q) => q.trim()).length === 0) { toast.error("Add at least one question"); return; }
    const newSurvey: Survey = {
      id: `sv_new_${Date.now()}`,
      title, description, type,
      questions: questions.filter((q) => q.trim()).length,
      responses: 0, responseRate: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setRows((r) => [newSurvey, ...r]);
    setAddOpen(false);
    setTitle(""); setDescription(""); setQuestions([""]);
    toast.success(`Survey created — ${title}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Surveys & Feedback"
        description="Collect course, trainer, and program feedback from learners."
        icon={<Icon name="MessageSquare" className="h-6 w-6" />}
        actions={[{ label: "Create survey", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Surveys" value={rows.length} icon={<MessageSquare className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<MessageSquare className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Responses" value={formatNumber(totalResponses)} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard label="Avg Response Rate" value={`${avgResponseRate}%`} icon={<MessageSquare className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No surveys found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                  <TableHead className="text-right">Responses</TableHead>
                  <TableHead className="min-w-[120px]">Response Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(s)}>
                    <TableCell>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{TYPE_LABELS[s.type]}</Badge></TableCell>
                    <TableCell className="text-right text-sm">{s.questions}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatNumber(s.responses)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={s.responseRate} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{s.responseRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail with analytics */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <SurveyAnalytics survey={detail} />}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Survey</DialogTitle>
            <DialogDescription>Design a new feedback survey.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sv-title">Title *</Label>
              <Input id="sv-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="sv-desc">Description</Label>
              <Textarea id="sv-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[60px]" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Survey["type"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Questions</Label>
              <div className="mt-2 space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{i + 1}.</span>
                    <Input value={q} onChange={(e) => setQuestions((arr) => arr.map((x, j) => j === i ? e.target.value : x))} placeholder={`Question ${i + 1}`} />
                    {questions.length > 1 && <Button variant="ghost" size="sm" onClick={() => setQuestions((arr) => arr.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setQuestions((arr) => [...arr, ""])}><Plus className="mr-1 h-3 w-3" />Add question</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create survey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SurveyAnalytics({ survey }: { survey: Survey }) {
  // synthetic rating distribution
  const ratings = [
    { rating: "5 ★", count: Math.round(survey.responses * 0.52) },
    { rating: "4 ★", count: Math.round(survey.responses * 0.28) },
    { rating: "3 ★", count: Math.round(survey.responses * 0.12) },
    { rating: "2 ★", count: Math.round(survey.responses * 0.05) },
    { rating: "1 ★", count: Math.round(survey.responses * 0.03) },
  ];

  // For NPS, show passives/promoters/detractors
  const nps = survey.type === "nps" ? [
    { name: "Promoters", value: 62 },
    { name: "Passives", value: 26 },
    { name: "Detractors", value: 12 },
  ] : [];

  const npsScore = 62 - 12; // promoters - detractors

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-lg">{survey.title}</SheetTitle>
        <SheetDescription>{TYPE_LABELS[survey.type]} · {formatNumber(survey.responses)} responses</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <p className="text-sm text-muted-foreground">{survey.description}</p>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Responses</p>
            <p className="text-lg font-semibold">{formatNumber(survey.responses)}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Response Rate</p>
            <p className="text-lg font-semibold">{survey.responseRate}%</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold">{survey.questions}</p>
          </div>
        </div>

        {survey.type === "nps" ? (
          <SectionCard title="NPS Breakdown">
            <div className="flex items-center justify-center my-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase">NPS Score</p>
                <p className={`text-5xl font-bold ${npsScore >= 50 ? "text-emerald-600 dark:text-emerald-400" : npsScore >= 20 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{npsScore}</p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nps} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {nps.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Rating Distribution">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratings}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="rating" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="count" name="Responses" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{(5 * 0.52 + 4 * 0.28 + 3 * 0.12 + 2 * 0.05 + 1 * 0.03).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">avg rating</span>
            </div>
          </SectionCard>
        )}

        <Button className="w-full" onClick={() => toast.info(`Exporting responses: ${survey.title}`)}>Export responses</Button>
      </div>
    </>
  );
}
