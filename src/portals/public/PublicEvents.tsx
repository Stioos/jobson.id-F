"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, MapPin, Video, Mic, Users, Code2, GraduationCap,
  Sparkles, Handshake, Megaphone, Trophy, Headset,
  Building2, Globe,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

type EventCategory =
  | "Webinar" | "Workshop" | "Career Fair" | "Bootcamp"
  | "Meetup" | "Conference" | "Hackathon";

type EventMode = "Online" | "In-person" | "Hybrid";

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  time: string;
  category: EventCategory;
  mode: EventMode;
  location: string;
  status: "upcoming" | "past";
  registrationUrl?: string;
  recordingUrl?: string;
  attendees?: number;
  duration: string;
}

const DEFAULT_EVENTS: PublicEvent[] = [
  {
    id: "evt-001",
    title: "Cracking FAANG Interviews: Live Mock with Google Engineers",
    description: "Watch real candidates solve system design and behavioral rounds with current Google engineers. Live Q&A on what FAANG interviewers actually look for.",
    date: "2025-03-15",
    time: "7:00 PM IST",
    category: "Webinar",
    mode: "Online",
    location: "YouTube Live + Zoom",
    status: "upcoming",
    duration: "90 min",
    attendees: 1240,
  },
  {
    id: "evt-002",
    title: "Full-Stack Bootcamp: Build & Deploy a SaaS in 3 Days",
    description: "Hands-on weekend bootcamp. Build a complete SaaS app with Next.js, Prisma, and Stripe. Deploy to Vercel. Bring your laptop and ship.",
    date: "2025-03-22",
    time: "10:00 AM IST",
    category: "Bootcamp",
    mode: "Hybrid",
    location: "Bengaluru Indiranagar + Online",
    status: "upcoming",
    duration: "3 days",
    attendees: 84,
  },
  {
    id: "evt-003",
    title: "jobson.id Career Fair 2025 — Bengaluru Edition",
    description: "Meet recruiters from 40+ top employers including Google, Amazon, Swiggy, Flipkart, Zerodha, and Razorpay. On-the-spot interviews for shortlisted candidates.",
    date: "2025-04-05",
    time: "9:00 AM IST",
    category: "Career Fair",
    mode: "In-person",
    location: "Bengaluru Palace Grounds",
    status: "upcoming",
    duration: "Full day",
    attendees: 3200,
  },
  {
    id: "evt-004",
    title: "AI/ML Meetup: Generative AI in Production",
    description: "Monthly meetup for ML engineers. Talks by practitioners from Sarvam AI, Krutrim, and Flipkart on deploying GenAI at scale. Networking after.",
    date: "2025-02-08",
    time: "6:30 PM IST",
    category: "Meetup",
    mode: "In-person",
    location: "Bengaluru Indiranagar Co-working",
    status: "past",
    duration: "2 hrs",
    attendees: 156,
  },
  {
    id: "evt-005",
    title: "jobson.id Hackathon 2024 — Build for Bharat",
    description: "48-hour hackathon. 200+ teams built solutions for healthcare, agriculture, and education. Winning teams received ₹5L prize and jobson.id partnership offers.",
    date: "2024-11-22",
    time: "6:00 PM IST",
    category: "Hackathon",
    mode: "Hybrid",
    location: "Bengaluru + Online",
    status: "past",
    duration: "48 hrs",
    attendees: 580,
  },
  {
    id: "evt-006",
    title: "Workshop: Resume Makeover for Mid-Career Engineers",
    description: "Senior recruiters review your resume line-by-line. Live rewrites of weak bullets, quantification techniques, and ATS optimization. Limited to 50 seats.",
    date: "2025-03-29",
    time: "11:00 AM IST",
    category: "Workshop",
    mode: "Online",
    location: "Zoom",
    status: "upcoming",
    duration: "2 hrs",
    attendees: 47,
  },
  {
    id: "evt-007",
    title: "jobson.id Annual Tech Conference 2024 — Future of Work",
    description: "1-day conference on AI, hiring, and the future of work. 20+ speakers from Google, Microsoft, Zoho, Zerodha. Tracks for engineers, recruiters, and founders.",
    date: "2024-09-14",
    time: "9:00 AM IST",
    category: "Conference",
    mode: "In-person",
    location: "Bengaluru Conrad",
    status: "past",
    duration: "Full day",
    attendees: 850,
  },
];

const CATEGORY_META: Record<EventCategory, { color: string; icon: LucideIcon }> = {
  Webinar: { color: "#0EA5E9", icon: Video },
  Workshop: { color: "#F97316", icon: GraduationCap },
  "Career Fair": { color: "#10B981", icon: Building2 },
  Bootcamp: { color: "#8B5CF6", icon: Code2 },
  Meetup: { color: "#EF4444", icon: Users },
  Conference: { color: "#D4A017", icon: Megaphone },
  Hackathon: { color: "#06B6D4", icon: Trophy },
};

const CATEGORIES: (EventCategory | "All")[] = [
  "All", "Webinar", "Workshop", "Career Fair", "Bootcamp", "Meetup", "Conference", "Hackathon",
];

const TYPE_FILTERS = ["All", "Upcoming", "Past"] as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function PublicEvents() {
  const { navigate } = useNav();
  const [activeCategory, setActiveCategory] = React.useState<EventCategory | "All">("All");
  const [activeType, setActiveType] = React.useState<(typeof TYPE_FILTERS)[number]>("All");

  const filteredEvents = React.useMemo(() => {
    return DEFAULT_EVENTS.filter((e) => {
      if (activeCategory !== "All" && e.category !== activeCategory) return false;
      if (activeType === "Upcoming" && e.status !== "upcoming") return false;
      if (activeType === "Past" && e.status !== "past") return false;
      return true;
    }).sort((a, b) => {
      // upcoming first (closest first), then past (most recent first)
      if (a.status !== b.status) return a.status === "upcoming" ? -1 : 1;
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return a.status === "upcoming" ? aTime - bTime : bTime - aTime;
    });
  }, [activeCategory, activeType]);

  const handleRegister = (event: PublicEvent) => {
    toast.success("Registered", {
      description: `You're registered for "${event.title}". Calendar invite will arrive shortly.`,
    });
  };

  const handleWatchRecording = (event: PublicEvent) => {
    toast(`Opening recording: ${event.title}`, {
      description: "Recording link has been copied to your clipboard (simulated).",
    });
  };

  const upcomingCount = DEFAULT_EVENTS.filter((e) => e.status === "upcoming").length;
  const pastCount = DEFAULT_EVENTS.filter((e) => e.status === "past").length;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" /> Events
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Events &amp; <span className="text-brand">Webinars</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Free webinars, bootcamps, career fairs, and meetups — meet hiring managers,
            learn from senior engineers, and accelerate your career. {upcomingCount} upcoming, {pastCount} on-demand.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => {
              const el = document.getElementById("events-grid");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }} className="gap-1.5">
              <Calendar className="h-4 w-4" /> Browse Events
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
              <Handshake className="h-4 w-4" /> Host an Event
            </Button>
          </div>
        </div>
      </section>

      {/* Filters + Events grid */}
      <section id="events-grid" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category chips */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Category:</span>
          {CATEGORIES.map((c) => {
            const isActive = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-brand hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Type toggle */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Show:</span>
          <div className="inline-flex rounded-lg border bg-card p-0.5">
            {TYPE_FILTERS.map((t) => {
              const isActive = activeType === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-brand text-brand-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="No events match your filters"
            description="Try selecting a different category or time filter."
            action={
              <Button variant="outline" size="sm" onClick={() => { setActiveCategory("All"); setActiveType("All"); }}>
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                onWatchRecording={handleWatchRecording}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Host an event with us</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Reach 50,000+ candidates and 200+ employers. jobson.id hosts webinars, career fairs,
                and hackathons for partners — fully managed, end-to-end.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Headset className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Dedicated event manager + marketing support</li>
                <li className="flex items-start gap-2"><Globe className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Hybrid format — online + in-person options</li>
                <li className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Reach 50,000+ candidates in our network</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
                <Handshake className="h-4 w-4" /> Host an Event
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function EventCard({
  event,
  onRegister,
  onWatchRecording,
}: {
  event: PublicEvent;
  onRegister: (e: PublicEvent) => void;
  onWatchRecording: (e: PublicEvent) => void;
}) {
  const meta = CATEGORY_META[event.category];
  const CatIcon = meta.icon;
  const upcoming = event.status === "upcoming";

  return (
    <Card
      className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant="outline"
          className="gap-1"
          style={{ color: meta.color, borderColor: `${meta.color}40` }}
        >
          <CatIcon className="h-3 w-3" /> {event.category}
        </Badge>
        <Badge
          variant={upcoming ? "default" : "secondary"}
          className={upcoming ? "bg-brand text-brand-foreground" : ""}
        >
          {upcoming ? "Upcoming" : "Past"}
        </Badge>
      </div>

      <h3 className="mt-3 font-semibold leading-tight group-hover:text-brand">{event.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(event.date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {event.time} · {event.duration}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {event.mode === "Online" ? (
            <Video className="h-3.5 w-3.5" />
          ) : event.mode === "In-person" ? (
            <MapPin className="h-3.5 w-3.5" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          {event.mode}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {event.location}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm text-muted-foreground">{event.description}</p>

      {event.attendees && (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{event.attendees.toLocaleString("en-IN")}</span> {upcoming ? "registered" : "attended"}
        </div>
      )}

      <div className="mt-4 pt-3">
        {upcoming ? (
          <Button size="sm" className="w-full gap-1.5" onClick={() => onRegister(event)}>
            <Mic className="h-3.5 w-3.5" /> Register Free
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => onWatchRecording(event)}>
            <Video className="h-3.5 w-3.5" /> Watch Recording
          </Button>
        )}
      </div>
    </Card>
  );
}
