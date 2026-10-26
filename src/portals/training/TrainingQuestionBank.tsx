"use client";

import * as React from "react";
import { questionBank } from "@/lib/lms-data";
import type { Question } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Library, X, Upload, Pencil } from "lucide-react";

const TYPES = ["mcq", "msq", "truefalse", "short", "long", "matching", "ordering", "scenario", "coding", "case"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"];

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice", msq: "Multi-Select", truefalse: "True/False",
  short: "Short Answer", long: "Long Answer", matching: "Matching",
  ordering: "Ordering", scenario: "Scenario", coding: "Coding", case: "Case Study",
};

export function TrainingQuestionBank() {
  const [rows, setRows] = React.useState<Question[]>(questionBank);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [diffFilter, setDiffFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editQ, setEditQ] = React.useState<Question | null>(null);

  // form state
  const [qType, setQType] = React.useState<Question["type"]>("mcq");
  const [qText, setQText] = React.useState("");
  const [qOptions, setQOptions] = React.useState<string[]>(["", ""]);
  const [qAnswer, setQAnswer] = React.useState("");
  const [qMarks, setQMarks] = React.useState(2);
  const [qCategory, setQCategory] = React.useState("General");
  const [qDifficulty, setQDifficulty] = React.useState<Question["difficulty"]>("intermediate");
  const [qExplanation, setQExplanation] = React.useState("");

  const categories = Array.from(new Set(rows.map((r) => r.category)));

  const filtered = rows.filter((q) => {
    const matchType = typeFilter === "all" || q.type === typeFilter;
    const matchCat = categoryFilter === "all" || q.category === categoryFilter;
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter;
    return matchType && matchCat && matchDiff;
  });

  const totalMarks = rows.reduce((s, q) => s + q.marks, 0);

  function resetForm() {
    setQType("mcq"); setQText(""); setQOptions(["", ""]); setQAnswer("");
    setQMarks(2); setQCategory("General"); setQDifficulty("intermediate"); setQExplanation("");
  }

  function openAdd() {
    resetForm();
    setAddOpen(true);
  }

  function openEdit(q: Question) {
    setEditQ(q);
    setQType(q.type); setQText(q.question);
    setQOptions(q.options ?? ["", ""]); setQAnswer(Array.isArray(q.correctAnswer) ? q.correctAnswer.join(",") : q.correctAnswer);
    setQMarks(q.marks); setQCategory(q.category); setQDifficulty(q.difficulty);
    setQExplanation(q.explanation ?? "");
    setAddOpen(true);
  }

  function save() {
    if (!qText.trim()) { toast.error("Question text is required"); return; }
    const newQ: Question = {
      id: editQ?.id ?? `q_new_${Date.now()}`,
      type: qType,
      question: qText,
      options: qType === "mcq" || qType === "msq" || qType === "truefalse" || qType === "matching" ? qOptions.filter((o) => o.trim()) : undefined,
      correctAnswer: qAnswer,
      marks: qMarks,
      category: qCategory,
      difficulty: qDifficulty,
      explanation: qExplanation || undefined,
    };
    if (editQ) {
      setRows((r) => r.map((x) => x.id === editQ.id ? newQ : x));
      toast.success("Question updated");
    } else {
      setRows((r) => [newQ, ...r]);
      toast.success("Question added");
    }
    setEditQ(null);
    setAddOpen(false);
    resetForm();
  }

  function updateOption(idx: number, value: string) {
    setQOptions((opts) => opts.map((o, i) => i === idx ? value : o));
  }

  const needsOptions = qType === "mcq" || qType === "msq" || qType === "truefalse" || qType === "matching";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Question Bank"
        description="Reusable question pool for assessments and quizzes."
        icon={<Icon name="Library" className="h-6 w-6" />}
        actions={[
          { label: "Bulk Import", icon: "Upload", variant: "outline", onClick: () => toast.info("Bulk import dialog (CSV template)") },
          { label: "Add Question", icon: "Plus", onClick: openAdd },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Questions" value={rows.length} icon={<Library className="h-5 w-5" />} tone="brand" />
        <StatCard label="Categories" value={categories.length} icon={<Library className="h-5 w-5" />} />
        <StatCard label="Total Marks" value={totalMarks} icon={<Library className="h-5 w-5" />} />
        <StatCard label="Avg Marks/Q" value={rows.length > 0 ? (totalMarks / rows.length).toFixed(1) : "0"} icon={<Library className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={diffFilter} onValueChange={setDiffFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Library className="h-5 w-5" />} title="No questions found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[280px]">Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="text-sm">{q.question}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{TYPE_LABELS[q.type] ?? q.type}</Badge></TableCell>
                    <TableCell className="text-sm">{q.category}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-xs">{q.difficulty}</Badge></TableCell>
                    <TableCell className="text-right text-sm font-medium">{q.marks}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setEditQ(null); resetForm(); } setAddOpen(o); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editQ ? "Edit Question" : "Add Question"}</DialogTitle>
            <DialogDescription>{editQ ? "Update question details" : "Create a new reusable question"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question type</Label>
              <Select value={qType} onValueChange={(v) => { setQType(v as Question["type"]); if (v === "truefalse") setQOptions(["True", "False"]); }}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="q-text">Question text *</Label>
              <Textarea id="q-text" value={qText} onChange={(e) => setQText(e.target.value)} className="mt-1 min-h-[80px]" />
            </div>
            {needsOptions && (
              <div>
                <Label>Options</Label>
                <div className="mt-1 space-y-2">
                  {qOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                      {qOptions.length > 2 && <Button variant="ghost" size="sm" onClick={() => setQOptions((o) => o.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>}
                    </div>
                  ))}
                  {qType !== "truefalse" && <Button variant="outline" size="sm" onClick={() => setQOptions((o) => [...o, ""])}><Plus className="mr-1 h-3 w-3" />Add option</Button>}
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="q-answer">Correct answer {qType === "mcq" ? "(option text)" : qType === "truefalse" ? "(True/False)" : ""} *</Label>
              <Input id="q-answer" value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="q-marks">Marks</Label>
                <Input id="q-marks" type="number" value={qMarks} onChange={(e) => setQMarks(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={qCategory} onChange={(e) => setQCategory(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={qDifficulty} onValueChange={(v) => setQDifficulty(v as Question["difficulty"])}>
                  <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="q-exp">Explanation (optional)</Label>
              <Textarea id="q-exp" value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} className="mt-1 min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={save}>{editQ ? "Update" : "Add"} question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
