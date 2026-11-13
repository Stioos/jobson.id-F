"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Search, ArrowRight, Clock, Calendar, Tag,
  Newspaper, TrendingUp, Mail, BookOpen, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  ALL_BLOG_POSTS, FEATURED_BLOGS, BLOG_CATEGORIES,
  getBlogImage, type BlogPost,
} from "@/lib/blogs";

const PAGE_SIZE = 9;

const CATEGORY_TONES: Record<string, string> = {
  AI: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  Technology: "bg-brand/10 text-brand border-brand/20",
  Career: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Marketing: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  AI: "from-violet-500/20 via-violet-500/5 to-transparent",
  Technology: "from-brand/20 via-brand/5 to-transparent",
  Career: "from-amber-500/20 via-amber-500/5 to-transparent",
  Marketing: "from-rose-500/20 via-rose-500/5 to-transparent",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function BlogImage({ post, className }: { post: BlogPost; className?: string }) {
  const src = getBlogImage(post.slug);
  if (src) {
    return (
      <img
        src={src}
        alt={post.title}
        className={className}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${CATEGORY_GRADIENTS[post.category] ?? "from-brand/20 via-brand/5 to-transparent"} ${className ?? ""}`}
    >
      <BookOpen className="h-10 w-10 text-brand/60" />
    </div>
  );
}

export function PublicBlogs() {
  const { navigate } = useNav();
  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState<string>("");
  const [visibleCount, setVisibleCount] = React.useState<number>(PAGE_SIZE);
  const [email, setEmail] = React.useState<string>("");

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, query]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_BLOG_POSTS.filter((p) => {
      const matchesCat = category === "All" || p.category === category;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const featured = React.useMemo(() => {
    if (FEATURED_BLOGS.length === 0) return [];
    return FEATURED_BLOGS.slice(0, 3);
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! Watch your inbox for our weekly digest.");
    setEmail("");
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Newspaper className="h-3 w-3" /> jobson.id Blog</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Insights, Guides &amp; <span className="text-brand">Industry Perspectives</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Deep dives on AI, technology careers, marketing playbooks, and the future of work in India —
            written by the jobson.id team and industry practitioners.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Explore programs
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Articles published", value: `${ALL_BLOG_POSTS.length}+`, icon: Newspaper },
            { label: "Categories", value: `${BLOG_CATEGORIES.length - 1}`, icon: Tag },
            { label: "Featured stories", value: `${featured.length}`, icon: TrendingUp },
            { label: "Monthly readers", value: "85K+", icon: BookOpen },
          ].map((s) => (
            <Card key={s.label} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Search + filter */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title, excerpt, or tag..."
              className="pl-9"
              aria-label="Search articles"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured spotlight */}
      {category === "All" && !query && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <h2 className="text-2xl font-bold tracking-tight">Featured stories</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {featured.map((post) => (
              <Card
                key={post.slug}
                className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
                onClick={() => navigate("public", `blogs/${post.slug}`)}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <BlogImage
                    post={post}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge className={`border ${CATEGORY_TONES[post.category] ?? ""}`}>{post.category}</Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={post.author} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{post.author}</p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {post.readTime}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All posts grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {category === "All" ? "All articles" : `${category} articles`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {visible.length} of {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {visible.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or category filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post) => (
                <Card
                  key={post.slug}
                  className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
                  onClick={() => navigate("public", `blogs/${post.slug}`)}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <BlogImage
                      post={post}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge className={`border ${CATEGORY_TONES[post.category] ?? ""}`}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight group-hover:text-brand">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={post.author} size="xs" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{post.author}</p>
                          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {post.readTime}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="gap-1.5"
                >
                  Load more articles <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Subscribe to our weekly digest
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Get the best of jobson.id&apos;s insights — articles, industry deep-dives, and career
                playbooks — delivered every Saturday. No spam, unsubscribe anytime.
              </p>
              <form
                onSubmit={onSubscribe}
                className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <div className="flex-1 text-left">
                  <Label htmlFor="newsletter-email" className="sr-only">Email address</Label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="gap-1.5">
                  Subscribe <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Join 12,000+ subscribers across India&apos;s tech ecosystem.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
          <Button variant="ghost" onClick={() => navigate("public", "home")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Ready to take the next step in your career?
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            Browse open roles, explore training programs, or talk to a counselor — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("public", "jobs")} className="gap-1.5">
              Browse jobs <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("public", "programs")} className="gap-1.5">
              Explore programs
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
