"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sparkles, ArrowRight, ArrowLeft, Clock, Calendar, Tag, Mail,
  Twitter, Linkedin, Link2, BookOpen, CheckCircle2, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getBlogBySlug, getRelatedBlogs, getBlogImage,
} from "@/lib/blogs";

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
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PublicBlogDetail({ slug }: { slug: string }) {
  const { navigate } = useNav();
  const post = getBlogBySlug(slug);
  const [email, setEmail] = React.useState<string>("");

  if (!post) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20">
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="Article not found"
          description="The article you're looking for may have been removed or never existed."
          action={
            <Button onClick={() => navigate("public", "blogs")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Button>
          }
        />
      </div>
    );
  }

  const coverImage = getBlogImage(post.slug);
  const related = getRelatedBlogs(post.slug, 3);

  const onCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).then(
        () => toast.success("Article link copied to clipboard"),
        () => toast.error("Couldn't copy link — please copy manually")
      );
    }
  };

  const onShareTwitter = () => {
    const text = encodeURIComponent(post.title);
    const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const onShareLinkedIn = () => {
    const url = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

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
      {/* Breadcrumb */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("public", "home")} className="cursor-pointer">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("public", "blogs")} className="cursor-pointer">
                  Blogs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="line-clamp-1 max-w-[260px] text-muted-foreground">{post.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`border ${CATEGORY_TONES[post.category] ?? ""}`}>{post.category}</Badge>
            <span className="text-xs text-muted-foreground">Featured article</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6">
            <div className="flex items-center gap-3">
              <AvatarLogo text={post.author} size="md" />
              <div>
                <p className="text-sm font-semibold">{post.author}</p>
                <p className="text-xs text-muted-foreground">jobson.id Editorial</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        {coverImage ? (
          <div className="overflow-hidden rounded-2xl border">
            <img src={coverImage} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : (
          <div
            className={`flex aspect-[16/9] w-full items-center justify-center rounded-2xl border bg-gradient-to-br ${CATEGORY_GRADIENTS[post.category] ?? "from-brand/20 via-brand/5 to-transparent"}`}
          >
            <BookOpen className="h-12 w-12 text-brand/60" />
          </div>
        )}
      </section>

      {/* Body */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
          {/* Article */}
          <article className="min-w-0">
            <div className="blog-prose max-w-none text-[15px] leading-relaxed text-foreground/90 sm:text-base">
              <ReactMarkdown
                components={{
                  h1: ({ node: _n, ...props }) => <h2 className="mt-8 mb-3 text-2xl font-bold tracking-tight" {...props} />,
                  h2: ({ node: _n, ...props }) => <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight sm:text-2xl" {...props} />,
                  h3: ({ node: _n, ...props }) => <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight" {...props} />,
                  p: ({ node: _n, ...props }) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
                  ul: ({ node: _n, ...props }) => <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground" {...props} />,
                  ol: ({ node: _n, ...props }) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-muted-foreground" {...props} />,
                  li: ({ node: _n, ...props }) => <li className="leading-relaxed" {...props} />,
                  a: ({ node: _n, ...props }) => (
                    <a className="font-medium text-brand underline underline-offset-4 hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  strong: ({ node: _n, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                  blockquote: ({ node: _n, ...props }) => (
                    <blockquote className="my-5 border-l-4 border-brand bg-brand/5 px-4 py-2 italic text-foreground" {...props} />
                  ),
                  code: ({ node: _n, ...props }) => (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
              <p className="text-sm font-medium">Share this article</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={onShareTwitter} className="gap-1.5">
                  <Twitter className="h-4 w-4" /> Twitter
                </Button>
                <Button size="sm" variant="outline" onClick={onShareLinkedIn} className="gap-1.5">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Button>
                <Button size="sm" variant="outline" onClick={onCopyLink} className="gap-1.5">
                  <Link2 className="h-4 w-4" /> Copy link
                </Button>
              </div>
            </div>

            {/* Author bio */}
            <Card className="mt-8 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <AvatarLogo text={post.author} size="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{post.author}</h3>
                    <Badge variant="secondary" className="font-normal">Author</Badge>
                  </div>
                  <p className="mt-1 text-xs text-brand">jobson.id Editorial Team</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {post.author} writes about technology, careers, and the future of work in India.
                    As part of jobson.id&apos;s editorial team, they break down complex industry trends into
                    practical, actionable insights for working professionals and aspiring technologists.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> Verified contributor
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> {ALL_POSTS_COUNT_BY_AUTHOR_LABEL}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Table of contents
                </h4>
                <div className="mt-3 space-y-2">
                  {extractHeadings(post.content).slice(0, 6).map((h, i) => (
                    <a
                      key={i}
                      href={`#${slugifyHeading(h)}`}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground transition-colors hover:text-brand"
                    >
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                      <span className="line-clamp-2">{h}</span>
                    </a>
                  ))}
                </div>
              </Card>
              <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-5">
                <Mail className="h-5 w-5 text-brand" />
                <h4 className="mt-2 text-sm font-semibold">Enjoyed this article?</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Subscribe to our weekly digest — articles, deep-dives, and career playbooks.
                </p>
                <form onSubmit={onSubscribe} className="mt-3 space-y-2">
                  <Label htmlFor="detail-newsletter" className="sr-only">Email</Label>
                  <Input
                    id="detail-newsletter"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="h-9 text-sm"
                  />
                  <Button type="submit" size="sm" className="w-full gap-1.5">
                    Subscribe <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </Card>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Related articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">More from jobson.id&apos;s blog.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("public", "blogs")} className="gap-1.5">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => {
              const img = getBlogImage(r.slug);
              return (
                <Card
                  key={r.slug}
                  className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
                  onClick={() => navigate("public", `blogs/${r.slug}`)}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {img ? (
                      <img src={img} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${CATEGORY_GRADIENTS[r.category] ?? "from-brand/20 via-brand/5 to-transparent"}`}>
                        <BookOpen className="h-8 w-8 text-brand/60" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <Badge className={`border ${CATEGORY_TONES[r.category] ?? ""}`}>{r.category}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight group-hover:text-brand">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{r.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(r.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {r.readTime}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Sparkles className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Explore more articles
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Browse our full library of insights, guides, and industry perspectives from the
                jobson.id team.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "blogs")} className="gap-1.5">
                All articles <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "programs")} className="gap-1.5">
                Explore programs
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

const ALL_POSTS_COUNT_BY_AUTHOR_LABEL = "20+ articles published";

function extractHeadings(markdown: string): string[] {
  const lines = markdown.split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const m = line.match(/^#{2,3}\s+(.+?)\s*$/);
    if (m) out.push(m[1]);
  }
  return out;
}

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}
