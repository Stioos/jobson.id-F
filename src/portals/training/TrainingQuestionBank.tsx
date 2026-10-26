"use client";

import * as React from "react";
import {
  HelpCircle, Plus, Upload, Search, Eye, Trash2, BarChart3, Tag, Clock, CheckCircle2, X,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type QType = "MCQ" | "True-False" | "Short Answer" | "Code";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  text: string;
  type: QType;
  difficulty: Difficulty;
  course: string;
  marks: number;
  tags: string[];
  lastUsed: string | null;
  usageCount: number;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  usedIn: string[];
}

const COURSES = ["Full-Stack Web Dev", "Data Science with Python", "DevOps Bootcamp", "Cloud Fundamentals"];

const QUESTIONS: Question[] = [
  { id: "q1", text: "Which hook lets you persist state across renders without causing re-renders when set?", type: "MCQ", difficulty: "Medium", course: "Full-Stack Web Dev", marks: 2, tags: ["React", "Hooks"], lastUsed: "2024-10-22", usageCount: 18, options: ["useState", "useRef", "useMemo", "useEffect"], correctAnswer: "useRef", explanation: "useRef holds a mutable value that doesn't trigger re-renders when updated.", usedIn: ["React Mid-Term", "Frontend Screening"] },
  { id: "q2", text: "True or False: A JWT token is encrypted by default.", type: "True-False", difficulty: "Easy", course: "Full-Stack Web Dev", marks: 1, tags: ["Security", "JWT"], lastUsed: "2024-10-15", usageCount: 24, correctAnswer: "False", explanation: "JWT is encoded (base64) and signed, not encrypted.", usedIn: ["Auth Quiz"] },
  { id: "q3", text: "Write a Python function to reverse a string without using slicing ([::-1]).", type: "Code", difficulty: "Medium", course: "Data Science with Python", marks: 5, tags: ["Python", "Strings"], lastUsed: "2024-09-30", usageCount: 12, correctAnswer: "def reverse(s): return ''.join(reversed(s))", explanation: "Use the join() method with reversed().", usedIn: ["Python Lab 1", "DS Screening"] },
  { id: "q4", text: "Which Kubernetes object manages a set of replicated Pods?", type: "MCQ", difficulty: "Medium", course: "DevOps Bootcamp", marks: 2, tags: ["Kubernetes", "Pods"], lastUsed: "2024-10-18", usageCount: 15, options: ["ConfigMap", "Deployment", "Service", "Ingress"], correctAnswer: "Deployment", explanation: "A Deployment manages replica sets of Pods and supports rolling updates.", usedIn: ["K8s Quiz", "DevOps Final"] },
  { id: "q5", text: "What does ACID stand for in database transactions?", type: "Short Answer", difficulty: "Easy", course: "Full-Stack Web Dev", marks: 2, tags: ["Databases", "Transactions"], lastUsed: "2024-10-10", usageCount: 30, correctAnswer: "Atomicity, Consistency, Isolation, Durability", usedIn: ["DB Quiz"] },
  { id: "q6", text: "Which AWS service is a managed NoSQL database?", type: "MCQ", difficulty: "Easy", course: "Cloud Fundamentals", marks: 1, tags: ["AWS", "Databases"], lastUsed: "2024-10-20", usageCount: 22, options: ["RDS", "DynamoDB", "Redshift", "S3"], correctAnswer: "DynamoDB", explanation: "DynamoDB is AWS's managed NoSQL key-value/store.", usedIn: ["AWS Quiz", "Cloud Mid-Term"] },
  { id: "q7", text: "Implement a function in Python to compute the nth Fibonacci number using memoization.", type: "Code", difficulty: "Hard", course: "Data Science with Python", marks: 8, tags: ["Python", "Algorithms", "DP"], lastUsed: "2024-09-12", usageCount: 8, correctAnswer: "def fib(n, memo={}): ...", explanation: "Use a dict to cache results of subproblems.", usedIn: ["Algorithms Final"] },
  { id: "q8", text: "True or False: Docker containers share the host OS kernel.", type: "True-False", difficulty: "Easy", course: "DevOps Bootcamp", marks: 1, tags: ["Docker", "Containers"], lastUsed: "2024-10-05", usageCount: 28, correctAnswer: "True", explanation: "Containers virtualize at the app layer and share the host kernel.", usedIn: ["Docker Quiz"] },
  { id: "q9", text: "What is the time complexity of binary search on a sorted array?", type: "Short Answer", difficulty: "Medium", course: "Data Science with Python", marks: 2, tags: ["Algorithms", "Big-O"], lastUsed: "2024-09-25", usageCount: 19, correctAnswer: "O(log n)", usedIn: ["DS Final", "DSA Screening"] },
  { id: "q10", text: "Which HTTP status code indicates 'Created'?", type: "MCQ", difficulty: "Easy", course: "Full-Stack Web Dev", marks: 1, tags: ["HTTP", "REST"], lastUsed: "2024-10-12", usageCount: 26, options: ["200", "201", "204", "301"], correctAnswer: "201", explanation: "201 Created is returned when a resource is successfully created.", usedIn: ["REST Quiz"] },
  { id: "q11", text: "Write SQL to find the second-highest salary from an 'employees' table.", type: "Code", difficulty: "Hard", course: "Full-Stack Web Dev", marks: 6, tags: ["SQL", "Queries"], lastUsed: "2024-08-30", usageCount: 10, correctAnswer: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);", explanation: "Subquery to get the max salary below the overall max.", usedIn: ["DB Final"] },
  { id: "q12", text: "Which Git command creates a new branch and switches to it?", type: "MCQ", difficulty: "Easy", course: "DevOps Bootcamp", marks: 1, tags: ["Git", "VCS"], lastUsed: "2024-10-08", usageCount: 32, options: ["git branch new", "git checkout -b new", "git switch new", "git create new"], correctAnswer: "git checkout -b new", explanation: "git checkout -b creates and switches in one step.", usedIn: ["Git Quiz"] },
  { id: "q13", text: "True or False: In React, props are mutable from inside the child component.", type: "True-False", difficulty: "Easy", course: "Full-Stack Web Dev", marks: 1, tags: ["React", "Props"], lastUsed: "2024-10-19", usageCount: 21, correctAnswer: "False", explanation: "Props are read-only inside the receiving component.", usedIn: ["React Quiz"] },
  { id: "q14", text: "Explain the difference between supervised and unsupervised learning with one example each.", type: "Short Answer", difficulty: "Medium", course: "Data Science with Python", marks: 4, tags: ["ML", "Theory"], lastUsed: "2024-09-18", usageCount: 14, correctAnswer: "Supervised uses labeled data (e.g. spam classification); unsupervised finds patterns in unlabeled data (e.g. k-means clustering).", usedIn: ["ML Quiz"] },
  { id: "q15", text: "Write a Terraform block to create an S3 bucket named 'my-app-logs' in ap-south-1.", type: "Code", difficulty: "Medium", course: "Cloud Fundamentals", marks: 4, tags: ["Terraform", "IaC", "AWS"], lastUsed: "2024-09-22", usageCount: 7, correctAnswer: "resource \"aws_s3_bucket\" \"logs\" { bucket = \"my-app-logs\" region = \"ap-south-1\" }", explanation: "Use the aws_s3_bucket resource with bucket and region attributes.", usedIn: ["IaC Lab"] },
];

const TYPE_TONES: Record<QType, string> = {
  MCQ: "bg-brand/10 text-brand border-brand/20",
  "True-False": "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  "Short Answer": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  Code: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
};
const DIFF_TONES: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
};

export function TrainingQuestionBank() {
  const [questions, setQuestions] = React.useState<Question[]>(QUESTIONS);
  const [search, setSearch] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [diffFilter, setDiffFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [tagFilter, setTagFilter] = React.useState("all");
  const [preview, setPreview] = React.useState<Question | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [analyticsFor, setAnalyticsFor] = React.useState<Question | null>(null);

  const [form, setForm] = React.useState({
    type: "MCQ" as QType, text: "", difficulty: "Medium" as Difficulty,
    course: COURSES[0], marks: 2, tags: "", correctAnswer: "", explanation: "",
    options: ["", "", "", ""] as string[],
  });

  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).sort();

  const filtered = React.useMemo(() => {
    return questions.filter((q) => {
      if (courseFilter !== "all" && q.course !== courseFilter) return false;
      if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
      if (typeFilter !== "all" && q.type !== typeFilter) return false;
      if (tagFilter !== "all" && !q.tags.includes(tagFilter)) return false;
      if (search) {
        const s = search.toLowerCase();
        return q.text.toLowerCase().includes(s) || q.tags.some((t) => t.toLowerCase().includes(s));
      }
      return true;
    });
  }, [questions, courseFilter, diffFilter, typeFilter, tagFilter, search]);

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
  const totalUsage = questions.reduce((s, q) => s + q.usageCount, 0);

  function saveQuestion() {
    if (!form.text.trim()) { toast.error("Question text is required"); return; }
    if (!form.correctAnswer.trim()) { toast.error("Correct answer is required"); return; }
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: form.text,
      type: form.type,
      difficulty: form.difficulty,
      course: form.course,
      marks: form.marks,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      lastUsed: null,
      usageCount: 0,
      options: form.type === "MCQ" ? form.options.filter((o) => o.trim()) : undefined,
      correctAnswer: form.correctAnswer,
      explanation: form.explanation || undefined,
      usedIn: [],
    };
    setQuestions((q) => [newQ, ...q]);
    setCreateOpen(false);
    setForm({ type: "MCQ", text: "", difficulty: "Medium", course: COURSES[0], marks: 2, tags: "", correctAnswer: "", explanation: "", options: ["", "", "", ""] });
    toast.success("Question created", { description: `${newQ.type} · ${newQ.difficulty} · ${newQ.marks} marks` });
  }

  function removeQuestion(id: string) {
    setQuestions((q) => q.filter((x) => x.id !== id));
    toast.info("Question deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Reusable question pool for assessments and quizzes. Filter by course, difficulty, type, and tags. Create questions with explanations and track usage across assessments."
        icon={<Icon name="HelpCircle" className="h-6 w-6" />}
        actions={[
          { label: "Bulk import", icon: "Upload", variant: "outline", onClick: () => toast.info("Bulk import", { description: "CSV template downloaded — fill and re-upload" }) },
          { label: "New question", icon: "Plus", onClick: () => setCreateOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total questions" value={questions.length} icon={<HelpCircle className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total marks" value={totalMarks} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Total usage" value={totalUsage} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Unique tags" value={allTags.length} icon={<Tag className="h-5 w-5" />} />
      </div>

      <SectionCard title="Filters" description="Narrow down by course, type, difficulty, tag, or full-text search">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search questions…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Course" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All courses</SelectItem>{COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="MCQ">MCQ</SelectItem><SelectItem value="True-False">True/False</SelectItem><SelectItem value="Short Answer">Short Answer</SelectItem><SelectItem value="Code">Code</SelectItem></SelectContent>
          </Select>
          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All levels</SelectItem><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Tag" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All tags</SelectItem>{allTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title={`Questions (${filtered.length})`} description="Click a row to preview; analytics shows which assessments use each question">
        {filtered.length === 0 ? (
          <EmptyState icon={<HelpCircle className="h-5 w-5" />} title="No questions match your filters" />
        ) : (
          <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q.id} className="cursor-pointer" onClick={() => setPreview(q)}>
                    <TableCell className="text-sm max-w-[340px]">
                      <p className="truncate">{q.text}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {q.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-[10px] h-4"><Tag className="h-2.5 w-2.5 mr-0.5" />{t}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${TYPE_TONES[q.type]}`}>{q.type}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${DIFF_TONES[q.difficulty]}`}>{q.difficulty}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{q.course}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{q.marks}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{q.lastUsed ? formatDate(q.lastUsed) : "—"}</TableCell>
                    <TableCell className="text-right text-sm">{q.usageCount}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => setAnalyticsFor(q)} title="Usage analytics"><BarChart3 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} title="Delete"><Trash2 className="h-3.5 w-3.5 text-rose-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Question preview</DialogTitle><DialogDescription>How this question appears to learners</DialogDescription></DialogHeader>
          {preview && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={TYPE_TONES[preview.type]}>{preview.type}</Badge>
                <Badge variant="outline" className={DIFF_TONES[preview.difficulty]}>{preview.difficulty}</Badge>
                <Badge variant="outline">{preview.course}</Badge>
                <Badge variant="outline">{preview.marks} marks</Badge>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{preview.text}</p>
              </div>
              {preview.options && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Options</p>
                  {preview.options.map((o, i) => (
                    <div key={i} className={`flex items-center gap-2 rounded-md border p-2 text-sm ${o === preview.correctAnswer ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}>
                      {o === preview.correctAnswer ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="ml-4 h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                      {o}
                    </div>
                  ))}
                </div>
              )}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Correct answer</p>
                <p className="text-sm font-medium">{preview.correctAnswer}</p>
              </div>
              {preview.explanation && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Explanation</p>
                  <p className="text-sm text-muted-foreground">{preview.explanation}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {preview.tags.map((t) => <Badge key={t} variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-0.5" />{t}</Badge>)}
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={!!analyticsFor} onOpenChange={(o) => !o && setAnalyticsFor(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Usage analytics</DialogTitle><DialogDescription>Which assessments use this question</DialogDescription></DialogHeader>
          {analyticsFor && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center"><p className="text-xl font-bold text-brand">{analyticsFor.usageCount}</p><p className="text-xs text-muted-foreground">Total uses</p></div>
                <div className="rounded-lg border p-3 text-center"><p className="text-xl font-bold text-brand">{analyticsFor.usedIn.length}</p><p className="text-xs text-muted-foreground">Assessments</p></div>
                <div className="rounded-lg border p-3 text-center"><p className="text-xl font-bold text-brand">{analyticsFor.marks}</p><p className="text-xs text-muted-foreground">Marks</p></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Used in assessments</p>
                {analyticsFor.usedIn.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Not used in any assessment yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {analyticsFor.usedIn.map((a) => (
                      <div key={a} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand" />{a}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {analyticsFor.lastUsed && (
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Last used: {formatDate(analyticsFor.lastUsed)}</p>
              )}
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Question Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create new question</DialogTitle><DialogDescription>Add a question to the reusable pool</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as QType }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="MCQ">MCQ</SelectItem><SelectItem value="True-False">True/False</SelectItem><SelectItem value="Short Answer">Short Answer</SelectItem><SelectItem value="Code">Code</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm((p) => ({ ...p, difficulty: v as Difficulty }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="q-text">Question text *</Label>
              <Textarea id="q-text" value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} className="mt-1 min-h-[80px]" placeholder="Enter the question…" />
            </div>
            {form.type === "MCQ" && (
              <div>
                <Label>Options (mark correct in answer field below)</Label>
                <div className="mt-1 space-y-2">
                  {form.options.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={o} onChange={(e) => setForm((p) => ({ ...p, options: p.options.map((x, j) => j === i ? e.target.value : x) }))} placeholder={`Option ${i + 1}`} />
                      {form.options.length > 2 && <Button variant="ghost" size="sm" onClick={() => setForm((p) => ({ ...p, options: p.options.filter((_, j) => j !== i) }))}><X className="h-3 w-3" /></Button>}
                    </div>
                  ))}
                  {form.options.length < 6 && <Button variant="outline" size="sm" onClick={() => setForm((p) => ({ ...p, options: [...p.options, ""] }))}><Plus className="mr-1 h-3 w-3" />Add option</Button>}
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="q-ans">Correct answer *</Label>
              <Input id="q-ans" value={form.correctAnswer} onChange={(e) => setForm((p) => ({ ...p, correctAnswer: e.target.value }))} className="mt-1" placeholder={form.type === "MCQ" ? "Type the correct option text exactly" : form.type === "True-False" ? "True or False" : "Expected answer"} />
            </div>
            <div>
              <Label htmlFor="q-exp">Explanation (optional)</Label>
              <Textarea id="q-exp" value={form.explanation} onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))} className="mt-1 min-h-[60px]" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label htmlFor="q-marks">Marks</Label><Input id="q-marks" type="number" value={form.marks} onChange={(e) => setForm((p) => ({ ...p, marks: Number(e.target.value) }))} className="mt-1" /></div>
              <div className="col-span-2"><Label>Course</Label>
                <Select value={form.course} onValueChange={(v) => setForm((p) => ({ ...p, course: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="q-tags">Tags (comma-separated)</Label>
              <Input id="q-tags" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className="mt-1" placeholder="e.g. React, Hooks, State" />
            </div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={saveQuestion}>Create question</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
