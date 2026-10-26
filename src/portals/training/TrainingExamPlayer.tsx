"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingAssessments, questionBank } from "@/lib/lms-data";
import type { Question } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Award, RotateCcw, Save, AlertTriangle, BookOpen,
} from "lucide-react";

interface GradedAnswer {
  questionId: string;
  selected: string | string[];
  flagged: boolean;
  correct: boolean;
}

function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function isCorrect(question: Question, answer: string | string[]): boolean {
  if (question.type === "msq") {
    const correct = (Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]) as string[];
    const selected = Array.isArray(answer) ? answer : [answer];
    if (selected.length !== correct.length) return false;
    return selected.every((s) => correct.includes(s));
  }
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(String(answer));
  }
  // For short/long — case-insensitive partial match for demo
  if (question.type === "short" || question.type === "long") {
    const expected = String(question.correctAnswer).toLowerCase();
    const given = String(answer).toLowerCase().trim();
    if (!given) return false;
    return expected.includes(given) || given.includes(expected.split(",")[0]);
  }
  return String(question.correctAnswer) === String(answer);
}

export function TrainingExamPlayer({ assessmentId }: { assessmentId: string }) {
  const { navigate } = useNav();
  const assessment = React.useMemo(
    () => trainingAssessments.find((a) => a.id === assessmentId),
    [assessmentId],
  );
  // Take first 6 questions from bank for the demo exam
  const questions = React.useMemo<Question[]>(() => questionBank.slice(0, 6), []);

  const totalSeconds = (assessment?.timeLimitMinutes ?? 30) * 60;
  const [secondsLeft, setSecondsLeft] = React.useState(totalSeconds);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = React.useState<Set<string>>(new Set());
  const [phase, setPhase] = React.useState<"taking" | "submitting" | "results">("taking");
  const [graded, setGraded] = React.useState<GradedAnswer[]>([]);
  const [startTime] = React.useState(() => Date.now());
  const [timeTakenSec, setTimeTakenSec] = React.useState(0);
  const [confirmSubmit, setConfirmSubmit] = React.useState(false);
  const [confirmExit, setConfirmExit] = React.useState(false);

  function setAnswer(qId: string, val: string | string[]) {
    setAnswers((a) => ({ ...a, [qId]: val }));
  }

  function toggleFlag(qId: string) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }

  function handleSubmit(auto = false) {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    setTimeTakenSec(elapsedSec);
    const g: GradedAnswer[] = questions.map((q) => {
      const ans = answers[q.id] ?? (q.type === "msq" ? [] : "");
      return {
        questionId: q.id,
        selected: ans,
        flagged: flagged.has(q.id),
        correct: isCorrect(q, ans),
      };
    });
    setGraded(g);
    setPhase("results");
    setConfirmSubmit(false);
    if (auto) toast.info("Time up — assessment auto-submitted");
    else toast.success("Assessment submitted");
  }

  // Countdown timer — re-checks phase & secondsLeft each second.
  React.useEffect(() => {
    if (phase !== "taking") return;
    if (secondsLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, secondsLeft]);

  if (!assessment || questions.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("training", "assessments")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to assessments
        </Button>
        <EmptyState
          icon={<AlertTriangle className="h-6 w-6" />}
          title="Assessment not available"
          description="This assessment does not exist or has no questions loaded."
          action={<Button onClick={() => navigate("training", "assessments")}>Browse assessments</Button>}
        />
      </div>
    );
  }

  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).filter((k) => {
    const v = answers[k];
    return Array.isArray(v) ? v.length > 0 : v && v.length > 0;
  }).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const isLowTime = secondsLeft < 300;

  function handleSaveExit() {
    setConfirmExit(false);
    toast.success("Progress saved. You can resume later.");
    navigate("training", "assessments");
  }

  function retake() {
    setAnswers({});
    setFlagged(new Set());
    setCurrentIdx(0);
    setSecondsLeft(totalSeconds);
    setGraded([]);
    setPhase("taking");
    toast.info("Assessment restarted");
  }

  // ============ RESULTS SCREEN ============
  if (phase === "results") {
    const correctCount = graded.filter((g) => g.correct).length;
    const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
    const earnedMarks = questions.reduce((s, q, i) => s + (graded[i]?.correct ? q.marks : 0), 0);
    const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const passed = percentage >= assessment.passingScore;
    const mins = Math.floor(timeTakenSec / 60);
    const secs = timeTakenSec % 60;

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("training", "assessments")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to assessments
        </Button>

        <Card className="overflow-hidden">
          <div
            className="p-6 text-center text-white"
            style={{
              background: passed
                ? "linear-gradient(135deg, oklch(0.55 0.13 165), oklch(0.5 0.11 162))"
                : "linear-gradient(135deg, oklch(0.6 0.18 25), oklch(0.55 0.13 25))",
            }}
          >
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              {passed ? <Award className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
            </div>
            <h1 className="text-2xl font-bold">{passed ? "Congratulations!" : "Not quite there"}</h1>
            <p className="mt-1 text-sm text-white/90">{assessment.title}</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div>
                <p className="text-3xl font-bold">{percentage}%</p>
                <p className="text-xs text-white/80">Score</p>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div>
                <p className="text-3xl font-bold">{earnedMarks}/{totalMarks}</p>
                <p className="text-xs text-white/80">Marks</p>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div>
                <p className="text-3xl font-bold">{correctCount}/{questions.length}</p>
                <p className="text-xs text-white/80">Correct</p>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
              {passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {passed ? "PASSED" : "FAILED"} · Pass mark {assessment.passingScore}%
            </div>
          </div>

          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3 text-center">
                <Clock className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-sm font-semibold">{mins}m {secs}s</p>
                <p className="text-xs text-muted-foreground">Time taken</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Flag className="mx-auto h-5 w-5 text-amber-500" />
                <p className="mt-1 text-sm font-semibold">{graded.filter((g) => g.flagged).length}</p>
                <p className="text-xs text-muted-foreground">Flagged</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                <p className="mt-1 text-sm font-semibold">{correctCount}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => navigate("training", "assessments")}>
                Back to assessments
              </Button>
              <Button onClick={retake}>
                <RotateCcw className="mr-2 h-4 w-4" /> Retake assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question review</CardTitle>
            <CardDescription>Review each question with the correct answer and explanation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map((q, i) => {
              const g = graded[i];
              const isRight = g?.correct;
              return (
                <div key={q.id} className={"rounded-lg border p-4 " + (isRight ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5")}>
                  <div className="flex items-start gap-2">
                    {isRight ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">Q{i + 1}</Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">{q.type}</Badge>
                        <Badge variant="outline" className="text-[10px]">{q.marks} marks</Badge>
                        {g?.flagged && (
                          <Badge variant="outline" className="text-[10px] text-amber-600">
                            <Flag className="mr-1 h-2.5 w-2.5" /> Flagged
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">{q.question}</p>

                      {/* Options for objective types */}
                      {q.options && q.options.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {q.options.map((opt) => {
                            const isCorrectOpt =
                              (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt);
                            const isUserOpt =
                              Array.isArray(g?.selected)
                                ? g?.selected.includes(opt)
                                : g?.selected === opt;
                            return (
                              <li
                                key={opt}
                                className={
                                  "flex items-center gap-2 rounded-md px-2 py-1 text-xs " +
                                  (isCorrectOpt
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : isUserOpt
                                      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                      : "text-muted-foreground")
                                }
                              >
                                {isCorrectOpt ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                ) : isUserOpt ? (
                                  <XCircle className="h-3 w-3 text-rose-500" />
                                ) : (
                                  <span className="h-3 w-3" />
                                )}
                                <span>{opt}</span>
                                {isUserOpt && !isCorrectOpt && <span className="text-[10px]">(your answer)</span>}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {/* Free-text answer display */}
                      {(q.type === "short" || q.type === "long") && (
                        <div className="mt-2 space-y-1 text-xs">
                          <p className="text-muted-foreground">
                            Your answer: <span className="italic">{String(g?.selected) || "—"}</span>
                          </p>
                        </div>
                      )}

                      <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs">
                        <p className="font-medium text-emerald-700 dark:text-emerald-300">
                          Correct answer: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : q.correctAnswer}
                        </p>
                        {q.explanation && (
                          <p className="mt-1 text-muted-foreground">
                            <span className="font-medium">Explanation:</span> {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============ TAKING SCREEN ============
  return (
    <div className="space-y-3">
      {/* Top bar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setConfirmExit(true)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Exit
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{assessment.title}</p>
              <p className="text-xs text-muted-foreground">
                {questions.length} questions · {assessment.totalMarks} marks · Pass {assessment.passingScore}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold " +
                (isLowTime
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "border-border bg-muted/40")
              }
            >
              <Clock className={"h-4 w-4 " + (isLowTime ? "animate-pulse" : "")} />
              {formatTimer(secondsLeft)}
            </div>
            <Button variant="outline" size="sm" onClick={() => setConfirmExit(true)}>
              <Save className="mr-1 h-3.5 w-3.5" /> Save & exit
            </Button>
            <Button size="sm" onClick={() => setConfirmSubmit(true)}>
              Submit
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={progressPct} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground">{answeredCount}/{questions.length} answered</span>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        {/* Main question card */}
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 border-b">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{current.type}</Badge>
                <Badge variant="secondary" className="text-[10px]">{current.marks} marks</Badge>
                <Badge variant="outline" className="text-[10px] capitalize">{current.difficulty}</Badge>
              </div>
              <CardTitle className="mt-2 text-base leading-snug">{current.question}</CardTitle>
            </div>
            <Button
              variant={flagged.has(current.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFlag(current.id)}
            >
              <Flag className={"mr-1 h-3.5 w-3.5 " + (flagged.has(current.id) ? "fill-current" : "")} />
              {flagged.has(current.id) ? "Flagged" : "Flag"}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <QuestionInput
              question={current}
              value={answers[current.id]}
              onChange={(v) => setAnswer(current.id, v)}
            />

            <div className="flex items-center justify-between border-t pt-3">
              <Button
                variant="ghost" size="sm"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              <span className="text-xs text-muted-foreground">{currentIdx + 1} / {questions.length}</span>
              <Button
                size="sm"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIdx === questions.length - 1}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question navigator */}
        <Card className="h-fit">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-sm">Question navigator</CardTitle>
            <CardDescription className="text-xs">
              {answeredCount} answered · {flagged.size} flagged
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {questions.map((q, i) => {
                const isAnswered =
                  answers[q.id] !== undefined &&
                  (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : (answers[q.id] as string).length > 0);
                const isFlagged = flagged.has(q.id);
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={
                      "relative flex h-9 items-center justify-center rounded-md border text-xs font-medium transition " +
                      (isCurrent
                        ? "border-brand bg-brand text-white"
                        : isAnswered
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-border hover:bg-muted")
                    }
                    aria-label={`Question ${i + 1}`}
                  >
                    {i + 1}
                    {isFlagged && (
                      <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-amber-500 text-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-brand bg-brand" /> Current</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-emerald-500/40 bg-emerald-500/10" /> Answered</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-border" /> Unanswered</div>
              <div className="flex items-center gap-2"><Flag className="h-3 w-3 fill-amber-500 text-amber-500" /> Flagged</div>
            </div>
            <Button
              className="mt-4 w-full" size="sm"
              onClick={() => setConfirmSubmit(true)}
            >
              Submit assessment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Submit confirm */}
      <AlertDialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {questions.length} questions.
              {answeredCount < questions.length && " Unanswered questions will be marked incorrect."}
              {" "}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep working</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(false)}>
              Submit now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save & exit confirm */}
      <AlertDialog open={confirmExit} onOpenChange={setConfirmExit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save & exit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress ({answeredCount} of {questions.length} answered) will be saved and you can resume this attempt later.
              The timer will be paused.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveExit}>Save & exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function QuestionInput({
  question, value, onChange,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  if (question.type === "mcq" || question.type === "truefalse") {
    const v = (value as string) ?? "";
    return (
      <RadioGroup value={v} onValueChange={(val) => onChange(val)} className="space-y-2">
        {(question.options ?? []).map((opt) => (
          <label
            key={opt}
            className={
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition hover:bg-muted/50 " +
              (v === opt ? "border-brand bg-brand/5" : "")
            }
          >
            <RadioGroupItem value={opt} className="mt-0.5" />
            <span>{opt}</span>
          </label>
        ))}
      </RadioGroup>
    );
  }

  if (question.type === "msq") {
    const selected = (Array.isArray(value) ? value : []) as string[];
    function toggle(opt: string) {
      if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
      else onChange([...selected, opt]);
    }
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Select all that apply.</p>
        {(question.options ?? []).map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label
              key={opt}
              className={
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition hover:bg-muted/50 " +
                (checked ? "border-brand bg-brand/5" : "")
              }
            >
              <Checkbox checked={checked} onCheckedChange={() => toggle(opt)} className="mt-0.5" />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (question.type === "short") {
    return (
      <Textarea
        placeholder="Type your answer…"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px]"
      />
    );
  }

  if (question.type === "long") {
    return (
      <Textarea
        placeholder="Write your detailed answer…"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[160px]"
      />
    );
  }

  if (question.type === "matching") {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Matching question — drag the pairs to match.</p>
        <div className="rounded-lg border bg-muted/30 p-4 text-xs">
          (Demo) Pairs UI placeholder. Mark for review and continue.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
      <BookOpen className="mb-2 h-5 w-5" />
      This question type ({question.type}) is not interactive in the demo.
    </div>
  );
}
