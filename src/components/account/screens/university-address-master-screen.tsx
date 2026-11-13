"use client";

import { useState } from "react";
import {
  MapPin, Building2, Plus, Edit3, Trash2, Check, ExternalLink,
  Navigation, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityAddressMasterScreenProps {
  onNavigate?: (sectionId: string) => void;
}

interface CampusAddress {
  id: string;
  name: string;
  type: "MAIN_CAMPUS" | "EXTENSION_CAMPUS" | "LAB_COMPLEX" | "ADMIN_OFFICE";
  address: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string;
  geoCoords: string;
  facilities: string[];
  isPrimary: boolean;
}

const INITIAL_CAMPUSES: CampusAddress[] = [
  {
    id: "camp_1",
    name: "Main Deccan Campus (Engineering & Technology)",
    type: "MAIN_CAMPUS",
    address: "Survey 42, Hitech City Main Road, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500081",
    landmark: "Near Durgam Cheruvu Metro Station & Mindspace SEZ",
    geoCoords: "17.4385° N, 78.3840° E",
    facilities: ["Central Library", "6 Computer Labs", "Auditorium (1200 seats)", "Placement Desk", "LMS Server Hub"],
    isPrimary: true,
  },
  {
    id: "camp_2",
    name: "Deccan Innovation & Research Park (PG & Incubation)",
    type: "EXTENSION_CAMPUS",
    address: "Plot 18, Financial District, Nanakramguda, Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500032",
    landmark: "Adjacent to WaveRock & US Consulate Road",
    geoCoords: "17.4162° N, 78.3489° E",
    facilities: ["AI & Cloud CoE", "Hardware IoT Labs", "Startup Incubator", "Executive Seminar Rooms"],
    isPrimary: false,
  },
  {
    id: "camp_3",
    name: "Central Administrative & Sponsoring Trust Office",
    type: "ADMIN_OFFICE",
    address: "Deccan Towers, 5th Floor, Road No 10, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500034",
    landmark: "Opposite Taj Deccan",
    geoCoords: "17.4156° N, 78.4482° E",
    facilities: ["Governing Body Chamber", "Registrar Office", "Finance & Disbursement Desk"],
    isPrimary: false,
  },
];

export function UniversityAddressMasterScreen({ onNavigate }: UniversityAddressMasterScreenProps) {
  const [campuses, setCampuses] = useState<CampusAddress[]>(INITIAL_CAMPUSES);

  const handleMakePrimary = (id: string) => {
    setCampuses(campuses.map((c) => ({ ...c, isPrimary: c.id === id })));
    toast.success("Primary Campus Updated", {
      description: "Default campus set for official correspondence and drive notifications.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Campus Address & Infrastructure Master
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {campuses.length} VERIFIED LOCATIONS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Official university premises registered for on-campus training, exams, and placement drives.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Add Campus Location", { description: "Open campus verification request." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Campus
          </button>
        </div>
      </section>

      {/* ─── Campus Cards ─── */}
      <div className="space-y-4">
        {campuses.map((campus) => (
          <div
            key={campus.id}
            className={cn(
              "rounded-3xl border p-6 shadow-soft backdrop-blur-sm transition",
              campus.isPrimary
                ? "border-emerald-500/40 bg-card/90 ring-1 ring-emerald-500/20 dark:border-emerald-500/30 dark:bg-slate-900/70"
                : "border-border bg-card/70 dark:border-white/10 dark:bg-slate-900/50"
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {campus.name}
                  </h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground dark:bg-white/10">
                    {campus.type.replace("_", " ")}
                  </span>
                  {campus.isPrimary && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> PRIMARY CAMPUS
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-foreground dark:text-slate-200">
                  {campus.address}, {campus.city}, {campus.state} — <span className="font-mono font-medium">{campus.pinCode}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  <strong>Landmark:</strong> {campus.landmark}
                </p>
                <p className="mt-0.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <Navigation className="inline h-3 w-3 mr-1" />
                  {campus.geoCoords}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!campus.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleMakePrimary(campus.id)}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 cursor-pointer"
                  >
                    Set as Primary
                  </button>
                )}
              </div>
            </div>

            {/* Facilities Tags */}
            <div className="mt-4 border-t border-border pt-3 dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Verified Facilities on Site:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {campus.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-300"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("legal-tax")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Legal & Tax Info
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("industry")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Academic Hierarchy →
        </button>
      </div>
    </div>
  );
}
