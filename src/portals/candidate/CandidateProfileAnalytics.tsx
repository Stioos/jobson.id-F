"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ----- Mock analytics data -----
interface ViewerRow {
  id: string;
  company: string;
  recruiter: string;
  date: string;
  duration: string;
  action: "Viewed" | "Shortlisted" | "Contacted" | "Downloaded";
}

interface CompanyStat {
  name: string;
  views: number;
  industry: string;
}

interface KeywordStat {
  keyword: string;
  count: number;
  trend: number;
}

const VIEWERS: ViewerRow[] = [
  { id: "v1", company: "TechCorp India", recruiter: "Ananya Sharma", date: "2024-09-22", duration: "3m 12s", action: "Shortlisted" },
  { id: "v2", company: "FinEdge", recruiter: "Rohit Patel", date: "2024-09-20", duration: "1m 48s", action: "Viewed" },
  { id: "v3", company: "CloudScale Labs", recruiter: "Meera Iyer", date: "2024-09-18", duration: "5m 02s", action: "Contacted" },
  { id: "v4", company: "Zomato", recruiter: "Karan Verma", date: "2024-09-17", duration: "2m 22s", action: "Downloaded" },
  { id: "v5", company: "Swiggy", recruiter: "Deepa Menon", date: "2024-09-15", duration: "0m 58s", action: "Viewed" },
  { id: "v6", company: "Razorpay", recruiter: "Arjun Nair", date: "2024-09-12", duration: "4m 11s", action: "Shortlisted" },
  { id: "v7", company: "PhonePe", recruiter: "Sneha Reddy", date: "2024-09-10", duration: "2m 35s", action: "Viewed" },
  { id: "v8", company: "Flipkart", recruiter: "Vikram Singh", date: "2024-09-08", duration: "6m 04s", action: "Contacted" },
];

const TOP_COMPANIES: CompanyStat[] = [
  { name: "TechCorp India", views: 14, industry: "Fintech" },
  { name: "Razorpay", views: 9, industry: "Payments" },
  { name: "Flipkart", views: 7, industry: "E-commerce" },
  { name: "Swiggy", views: 6, industry: "Food-tech" },
  { name: "PhonePe", views: 5, industry: "Payments" },
];

const KEYWORDS: KeywordStat[] = [
  { keyword: "React", count: 48, trend: 12 },
  { keyword: "TypeScript", count: 39, trend: 8 },
  { keyword: "Senior Frontend", count: 27, trend: 5 },
  { keyword: "Next.js", count: 21, trend: -3 },
  { keyword: "GraphQL", count: 14, trend: 4 },
  { keyword: "Accessibility", count: 9, trend: 2 },
];

// 14-day views series (for the bar chart)
const VIEWS_SERIES: { day: string; views: number }[] = [
  { day: "S", views: 4 }, { day: "M", views: 7 }, { day: "T", views: 5 },
  { day: "W", views: 9 }, { day: "T", views: 12 }, { day: "F", views: 14 },
  { day: "S", views: 6 }, { day: "S", views: 8 }, { day: "M", views: 11 },
  { day: "T", views: 9 }, { day: "W", views: 13 }, { day: "T", views: 16 },
  { day: "F", views: 18 }, { day: "S", views: 10 },
];

const ACTION_TONES: Record<ViewerRow["action"], string> = {
  Viewed: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Shortlisted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Contacted: "bg-brand/10 text-brand border-brand/20",
  Downloaded: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function CandidateProfileAnalytics() {
  const [range, setRange] = React.useState<"7d" | "30d" | "all">("30d");

  const totalViews = range === "7d" ? 87 : range === "30d" ? 312 : 1284;
  const searchAppearances = range === "7d" ? 64 : range === "30d" ? 248 : 1240;
  const resumeDownloads = range === "7d" ? 6 : range === "30d" ? 23 : 102;
  const shortlisted = range === "7d" ? 2 : range === "30d" ? 9 : 41;

  const maxViews = Math.max(...VIEWS_SERIES.map((d) => d.views));

  function exportCsv() {
    toast.success("Export started", { description: "Your analytics CSV will be ready in a moment." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Analytics"
        description="Track who's viewing your profile, where you appear in search, and how recruiters engage with you."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[
          { label: "Export CSV", variant: "outline", onClick: exportCsv },
        ]}
      />

      {/* Range selector */}
      <Tabs value={range} onValueChange={(v) => setRange(v as "7d" | "30d" | "all")}>
        <TabsList className="flex h-auto">
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
          <TabsTrigger value="all">All time</TabsTrigger>
        </TabsList>

        <TabsContent value={range} className="space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Views"
              value={totalViews.toLocaleString()}
              tone="brand"
              icon={<Icon name="Eye" className="h-5 w-5" />}
              delta={{ value: "18% vs prev", positive: true }}
            />
            <StatCard
              label="Search Appearances"
              value={searchAppearances.toLocaleString()}
              tone="success"
              icon={<Icon name="Search" className="h-5 w-5" />}
              delta={{ value: "9% vs prev", positive: true }}
            />
            <StatCard
              label="Resume Downloads"
              value={resumeDownloads}
              tone="warning"
              icon={<Icon name="Download" className="h-5 w-5" />}
              delta={{ value: "3% vs prev", positive: false }}
            />
            <StatCard
              label="Shortlisted"
              value={shortlisted}
              tone="default"
              icon={<Icon name="Bookmark" className="h-5 w-5" />}
              delta={{ value: "22% vs prev", positive: true }}
            />
          </div>

          {/* Views over time chart */}
          <SectionCard
            title="Profile views over time"
            description="Daily profile views for the last 14 days"
          >
            <div className="flex h-48 items-end gap-1.5 sm:gap-2">
              {VIEWS_SERIES.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-brand/80 transition-all hover:bg-brand"
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                      title={`${d.views} views`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand" /> Profile views
              </span>
              <span>Avg {Math.round(VIEWS_SERIES.reduce((a, b) => a + b.views, 0) / VIEWS_SERIES.length)}/day</span>
            </div>
          </SectionCard>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Who viewed table */}
            <SectionCard
              title="Who viewed your profile"
              description="Recent recruiter activity"
              className="lg:col-span-2"
              contentClassName="p-0"
            >
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Recruiter</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VIEWERS.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.company}</TableCell>
                        <TableCell className="text-muted-foreground">{v.recruiter}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{v.date}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{v.duration}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ACTION_TONES[v.action]}`}>
                            {v.action}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>

            {/* Top companies */}
            <SectionCard
              title="Top companies viewing"
              description="By view count"
            >
              <div className="space-y-3">
                {TOP_COMPANIES.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.industry}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand">{c.views}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Search appearance breakdown */}
          <SectionCard
            title="Search appearance breakdown"
            description="Keywords recruiters used to find your profile"
          >
            <div className="space-y-3">
              {KEYWORDS.map((k) => {
                const max = Math.max(...KEYWORDS.map((x) => x.count));
                return (
                  <div key={k.keyword} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-sm font-medium">{k.keyword}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(k.count / max) * 100}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-semibold">{k.count}</span>
                    <span className={`w-16 shrink-0 text-right text-xs ${k.trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {k.trend >= 0 ? "▲" : "▼"} {Math.abs(k.trend)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
