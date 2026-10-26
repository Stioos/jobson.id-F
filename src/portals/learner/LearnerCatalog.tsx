"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  trainingCourses, learnerCourseEnrollments, wishlistItems, trainers,
} from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  LearnerDisclaimer, ThumbnailIcon, DifficultyBadge, StarRating,
  durationLabel, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  Search, Star, Clock, Users, Award, Heart, ShoppingCart, BookOpen,
  Sparkles, SlidersHorizontal, ChevronRight,
} from "lucide-react";

type SortKey = "popular" | "rating" | "price_low" | "price_high" | "newest";

const CATEGORIES = ["Technology", "Leadership", "Compliance", "Sales"] as const;

export function LearnerCatalog() {
  const { navigate } = useNav();
  const myEnrollments = learnerCourseEnrollments.filter((e) => e.learnerId === LEARNER_ID);
  const myWishlist = wishlistItems.filter((w) => w.learnerId === LEARNER_ID);

  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const [category, setCategory] = React.useState<string[]>([]);
  const [difficulty, setDifficulty] = React.useState<string[]>([]);
  const [hasCert, setHasCert] = React.useState(false);
  const [maxPrice, setMaxPrice] = React.useState<number>(100000);
  const [maxDuration, setMaxDuration] = React.useState<number>(3000);
  const [sort, setSort] = React.useState<SortKey>("popular");
  const [showFilters, setShowFilters] = React.useState(false);

  const allCourses = trainingCourses.filter((c) => c.status === "published");

  const filtered = React.useMemo(() => {
    let list = allCourses;
    if (tab !== "all") list = list.filter((c) => c.category === tab);
    if (category.length > 0) list = list.filter((c) => category.includes(c.category));
    if (difficulty.length > 0) list = list.filter((c) => difficulty.includes(c.difficulty));
    if (hasCert) list = list.filter((c) => c.hasCertificate);
    list = list.filter((c) => c.price <= maxPrice && c.durationMinutes <= maxDuration);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.instructorName.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "popular":
      default:
        list = [...list].sort((a, b) => b.enrollments - a.enrollments);
        break;
    }
    return list;
  }, [allCourses, tab, category, difficulty, hasCert, maxPrice, maxDuration, query, sort]);

  const featured = React.useMemo(
    () => allCourses.filter((c) => c.rating >= 4.7).slice(0, 3),
    [allCourses],
  );

  function toggleArray(arr: string[], v: string): string[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function isEnrolled(courseId: string): boolean {
    return myEnrollments.some((e) => e.courseId === courseId);
  }
  function isWishlisted(courseId: string): boolean {
    return myWishlist.some((w) => w.courseId === courseId);
  }

  function enroll(c: TrainingCourse) {
    if (isEnrolled(c.id)) {
      navigate("candidate", `my-learning/${c.id}`);
      return;
    }
    toast.success(`Enrolled in "${c.name}"`, {
      description: `Added to My Learning · ${formatCurrency(c.price, c.currency)}`,
    });
    setTimeout(() => navigate("candidate", `my-learning/${c.id}`), 700);
  }

  function toggleWishlist(c: TrainingCourse) {
    if (isWishlisted(c.id)) {
      toast.info(`Removed "${c.name}" from wishlist`);
    } else {
      toast.success(`Saved "${c.name}" to wishlist`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Courses"
        description="Discover courses from SkillForge Academy — learn, get certified, and grow your career."
        icon={<BookOpen className="h-5 w-5" />}
      />

      <LearnerDisclaimer />

      {/* Featured strip */}
      <SectionCard
        title="Featured this month"
        description="Top-rated courses hand-picked for you"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {featured.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate("candidate", `catalog/${c.id}`)}
              className="group flex flex-col gap-2 rounded-lg border p-3 text-left transition hover:border-brand/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <ThumbnailIcon color={c.thumbnailColor} icon={c.thumbnailIcon} size="md" />
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.code}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <StarRating value={c.rating} count={c.ratingCount} />
                <span className="font-semibold text-brand">{formatCurrency(c.price, c.currency)}</span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, skill, or instructor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest first</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className="sm:w-auto"
        >
          <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="Technology">Technology</TabsTrigger>
          <TabsTrigger value="Leadership">Leadership</TabsTrigger>
          <TabsTrigger value="Compliance">Compliance</TabsTrigger>
          <TabsTrigger value="Sales">Sales</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <SectionCard title="Filters" description={`${filtered.length} courses match`}>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </p>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={category.includes(cat)}
                          onCheckedChange={() => setCategory((a) => toggleArray(a, cat))}
                        />
                        <Label htmlFor={`cat-${cat}`} className="text-sm">
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Difficulty
                  </p>
                  <div className="space-y-2">
                    {["beginner", "intermediate", "advanced", "expert"].map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <Checkbox
                          id={`diff-${d}`}
                          checked={difficulty.includes(d)}
                          onCheckedChange={() => setDifficulty((a) => toggleArray(a, d))}
                        />
                        <Label htmlFor={`diff-${d}`} className="text-sm capitalize">
                          {d}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Max price
                    </p>
                    <span className="text-xs font-medium">{formatCurrency(maxPrice)}</span>
                  </div>
                  <Slider
                    value={[maxPrice]}
                    onValueChange={(v) => setMaxPrice(v[0])}
                    min={1000}
                    max={100000}
                    step={1000}
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Max duration
                    </p>
                    <span className="text-xs font-medium">{durationLabel(maxDuration)}</span>
                  </div>
                  <Slider
                    value={[maxDuration]}
                    onValueChange={(v) => setMaxDuration(v[0])}
                    min={60}
                    max={3000}
                    step={60}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cert-only"
                    checked={hasCert}
                    onCheckedChange={(v) => setHasCert(v === true)}
                  />
                  <Label htmlFor="cert-only" className="text-sm">
                    Has certificate
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setCategory([]);
                    setDifficulty([]);
                    setHasCert(false);
                    setMaxPrice(100000);
                    setMaxDuration(3000);
                    setQuery("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Course grid */}
        <div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="No courses match your filters"
              description="Try adjusting filters or search terms."
              action={<Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>Edit filters</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => {
                const trainer = trainers.find((t) => t.id === c.instructorId);
                const enrolled = isEnrolled(c.id);
                const wishlisted = isWishlisted(c.id);
                return (
                  <div
                    key={c.id}
                    className="flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
                  >
                    {/* Thumbnail */}
                    <button
                      onClick={() => navigate("candidate", `catalog/${c.id}`)}
                      className="relative flex h-24 items-center justify-center text-left"
                      style={{ background: c.thumbnailColor }}
                    >
                      <span className="text-3xl font-bold text-white opacity-90">
                        {c.code}
                      </span>
                      {c.hasCertificate && (
                        <Badge className="absolute right-2 top-2 bg-white/90 text-emerald-700 hover:bg-white/90">
                          <Award className="mr-1 h-3 w-3" /> Cert
                        </Badge>
                      )}
                    </button>
                    {/* Body */}
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
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <AvatarLogo text={c.instructorName} size="xs" className="mr-1" />
                        {c.instructorName}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {c.rating.toFixed(1)} ({c.ratingCount})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {durationLabel(c.durationMinutes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {formatNumber(c.enrollments)}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div>
                          <p className="text-sm font-bold text-brand">
                            {formatCurrency(c.price, c.currency)}
                          </p>
                          {trainer && (
                            <p className="text-[10px] text-muted-foreground">
                              by {trainer.name.split(" ").slice(-1)} · {trainer.sessionsConducted}+ sessions
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleWishlist(c)}
                            aria-label="Toggle wishlist"
                          >
                            <Heart
                              className={`h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                            />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8"
                            onClick={() => enroll(c)}
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
