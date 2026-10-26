"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses, wishlistItems, learnerCourseEnrollments } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LearnerDisclaimer, ThumbnailIcon, DifficultyBadge, StarRating,
  durationLabel, LEARNER_ID,
} from "./_shared";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Bookmark, ShoppingCart, Trash2, Heart, ArrowRight, BookOpen, Archive,
} from "lucide-react";

export function LearnerWishlist() {
  const { navigate } = useNav();
  const [items, setItems] = React.useState(
    wishlistItems.filter((w) => w.learnerId === LEARNER_ID),
  );

  const myEnrollmentIds = learnerCourseEnrollments
    .filter((e) => e.learnerId === LEARNER_ID)
    .map((e) => e.courseId);

  function courseById(id: string): TrainingCourse | undefined {
    return trainingCourses.find((c) => c.id === id);
  }

  function remove(id: string, name: string) {
    setItems((arr) => arr.filter((w) => w.id !== id));
    toast.success(`Removed "${name}" from wishlist`);
  }
  function enroll(c: TrainingCourse) {
    toast.success(`Enrolled in "${c.name}"`, {
      description: `Added to My Learning · ${formatCurrency(c.price, c.currency)}`,
    });
    setTimeout(() => navigate("candidate", `my-learning/${c.id}`), 800);
  }
  function enrollAll() {
    if (items.length === 0) return;
    toast.success(`Enrolled in ${items.length} courses`, {
      description: "All wishlist items moved to My Learning",
    });
    setItems([]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Wishlist"
        description={`${items.length} course${items.length === 1 ? "" : "s"} saved for later`}
        icon={<Bookmark className="h-5 w-5" />}
        actions={items.length > 0 ? [
          {
            label: "Enroll in all",
            icon: "Archive",
            variant: "outline",
            onClick: enrollAll,
          },
        ] : []}
      />

      <LearnerDisclaimer />

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-5 w-5" />}
          title="Your wishlist is empty"
          description="Save courses you're interested in to revisit them later."
          action={<Button onClick={() => navigate("candidate", "catalog")}>Browse catalog</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((w) => {
            const c = courseById(w.courseId);
            if (!c) return null;
            const enrolled = myEnrollmentIds.includes(c.id);
            return (
              <div
                key={w.id}
                className="flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
              >
                <button
                  onClick={() => navigate("candidate", `catalog/${c.id}`)}
                  className="relative flex h-24 items-center justify-center text-left"
                  style={{ background: c.thumbnailColor }}
                >
                  <span className="text-3xl font-bold text-white opacity-90">{c.code}</span>
                  <Bookmark className="absolute right-2 top-2 h-4 w-4 fill-white text-white" />
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{c.category}</Badge>
                    <DifficultyBadge level={c.difficulty} />
                  </div>
                  <button
                    onClick={() => navigate("candidate", `catalog/${c.id}`)}
                    className="line-clamp-2 text-left text-sm font-semibold hover:text-brand"
                  >
                    {c.name}
                  </button>
                  <p className="mt-1 text-xs text-muted-foreground">{c.instructorName}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <StarRating value={c.rating} count={c.ratingCount} />
                    <span>Saved {timeAgo(w.addedDate)}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-sm font-bold text-brand">
                      {formatCurrency(c.price, c.currency)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        onClick={() => (enrolled ? navigate("candidate", `my-learning/${c.id}`) : enroll(c))}
                      >
                        {enrolled ? (
                          <>
                            <BookOpen className="mr-1 h-3.5 w-3.5" /> Resume
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Enroll
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Remove">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove &quot;{c.name}&quot; from your wishlist. You can always save it again from the catalog.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remove(w.id, c.name)}
                              className="bg-rose-600 hover:bg-rose-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <SectionCard
          title="Wishlist summary"
          description="Quick math on what you've saved"
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Courses saved</p>
              <p className="mt-1 text-lg font-bold">{items.length}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total value</p>
              <p className="mt-1 text-lg font-bold text-brand">
                {formatCurrency(
                  items.reduce((s, w) => s + (courseById(w.courseId)?.price ?? 0), 0),
                )}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Avg rating</p>
              <p className="mt-1 text-lg font-bold">
                {(
                  items.reduce((s, w) => s + (courseById(w.courseId)?.rating ?? 0), 0) /
                  items.length
                ).toFixed(1)} ★
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
