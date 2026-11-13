"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { employers, jobs } from "@/lib/mock-data";
import type { EmployerOrganization } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, MapPin, Star, Users, Building2, ShieldCheck, ArrowRight, Briefcase, Crown,
} from "lucide-react";

const industries = Array.from(new Set(employers.map((e) => e.industry))).sort();

export function PublicCompanies() {
  const { navigate } = useNav();
  const [keyword, setKeyword] = React.useState("");
  const [industry, setIndustry] = React.useState("any");
  const [sort, setSort] = React.useState<"followers" | "rating" | "name">("followers");

  const filtered = React.useMemo(() => {
    let result = [...employers];
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.industry.toLowerCase().includes(q) || e.about.toLowerCase().includes(q)
      );
    }
    if (industry !== "any") {
      result = result.filter((e) => e.industry === industry);
    }
    if (sort === "followers") result.sort((a, b) => b.followerCount - a.followerCount);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [keyword, industry, sort]);

  const featuredCount = filtered.filter((e) => e.featured).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Companies hiring on jobson.id</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover {employers.length} verified employers across India&apos;s fastest-growing sectors.
        </p>
      </div>

      {/* Search + filter bar */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by name, industry, or keyword"
              className="pl-9"
            />
          </div>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger><SelectValue placeholder="All industries" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All industries</SelectItem>
              {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Most followed</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="name">A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="No companies match your search"
          description="Try a different keyword or industry filter."
          action={<Button variant="outline" size="sm" onClick={() => { setKeyword(""); setIndustry("any"); }}>Reset</Button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> companies
            {featuredCount > 0 && <> · <span className="inline-flex items-center gap-1 text-brand"><Crown className="h-3.5 w-3.5" /> {featuredCount} featured</span></>}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <CompanyCard key={e.id} employer={e} onOpen={() => navigate("public", `companies/${e.slug}`)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CompanyCard({ employer, onOpen }: { employer: EmployerOrganization; onOpen: () => void }) {
  const companyJobs = jobs.filter((j) => j.employerId === employer.id && j.status === "published");
  return (
    <Card className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
      <div className="flex items-start gap-3">
        <AvatarLogo text={employer.name} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold">{employer.name}</h3>
            {employer.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-brand" aria-label="Verified" />}
            {employer.featured && <Badge className="bg-brand/10 text-brand"><Crown className="mr-1 h-3 w-3" />Featured</Badge>}
          </div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{employer.industry}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{employer.size}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{employer.headquarters}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{employer.about}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1 font-medium">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {employer.rating}
          <span className="text-muted-foreground">({formatNumber(employer.reviewCount)} reviews)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />{formatNumber(employer.followerCount)} followers
        </span>
        {companyJobs.length > 0 && (
          <span className="inline-flex items-center gap-1 text-brand">
            <Briefcase className="h-3.5 w-3.5" />{companyJobs.length} open jobs
          </span>
        )}
      </div>

      <div className="mt-auto pt-4">
        <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={onOpen}>
          View profile <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
