"use client";

import * as React from "react";
import { Card } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight, type LucideIcon } from "lucide-react";
import { useNav } from "@/lib/store";

export interface LegalSection {
  id: string;
  icon: LucideIcon;
  title: string;
  paragraphs: string[];
}

export interface PublicLegalPageProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  intro: string;
  lastUpdated?: string;
  sections: LegalSection[];
}

export function PublicLegalPage({
  title,
  icon: TitleIcon,
  badge,
  intro,
  lastUpdated,
  sections,
}: PublicLegalPageProps) {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <TitleIcon className="h-7 w-7" />
          </div>
          {badge && (
            <Badge className="mb-4 gap-1">{badge}</Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {intro}
          </p>
          {lastUpdated && (
            <p className="mt-4 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
          )}
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            On this page
          </p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <ChevronRight className="h-3 w-3" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sections.map((s, i) => {
            const SectionIcon = s.icon;
            return (
              <Card key={s.id} id={s.id} className="scroll-mt-24 p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <SectionIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                        {s.title}
                      </h2>
                    </div>
                    <div className="mt-3 space-y-3">
                      {s.paragraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Questions about this policy?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Our team is happy to clarify anything in this document. Reach out and we&apos;ll
                respond within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Contact us <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "faq")} className="gap-1.5">
                View FAQ
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
