"use client";

import { useState } from "react";
import { Clock, ShieldCheck, UserCheck, FileText, Download, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface LogEvent {
  id: string;
  action: string;
  category: "Security" | "Profile" | "Compliance" | "Team" | "Export";
  actor: string;
  ip: string;
  timestamp: string;
}

export function ActivityLogsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const logs: LogEvent[] = [
    {
      id: "log-1",
      action: "GSTN Registration Automated Verification Check Passed",
      category: "Compliance",
      actor: "System / API",
      ip: "103.21.244.12",
      timestamp: "Today, 01:20 PM",
    },
    {
      id: "log-2",
      action: "New Session Authenticated from Chrome 134 on Windows 11",
      category: "Security",
      actor: "Saiga",
      ip: "103.21.244.12",
      timestamp: "Today, 01:15 PM",
    },
    {
      id: "log-3",
      action: "Updated Company Brand Tagline & Service Areas",
      category: "Profile",
      actor: "Saiga",
      ip: "103.21.244.12",
      timestamp: "Yesterday, 04:30 PM",
    },
    {
      id: "log-4",
      action: "Uploaded ISO 9001:2015 Quality Compliance Certificate",
      category: "Compliance",
      actor: "Saiga",
      ip: "103.21.244.12",
      timestamp: "Yesterday, 11:15 AM",
    },
    {
      id: "log-5",
      action: "Invited new team member: Priya Sharma (Admin Role)",
      category: "Team",
      actor: "Harshadeep Reddy",
      ip: "103.21.244.12",
      timestamp: "2 days ago, 03:45 PM",
    },
    {
      id: "log-6",
      action: "Exported Full Account Catalog Archive (JSON / CSV)",
      category: "Export",
      actor: "Harshadeep Reddy",
      ip: "49.207.210.55",
      timestamp: "3 days ago, 06:10 PM",
    },
    {
      id: "log-7",
      action: "Completed Email & Phone OTP Authentication",
      category: "Security",
      actor: "Harshadeep Reddy",
      ip: "103.21.244.12",
      timestamp: "5 days ago, 10:00 AM",
    },
  ];

  const filtered = logs.filter((l) => {
    const matchesCat = selectedCat === "All" || l.category === selectedCat;
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ip.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header — screen title & description now render in the dashboard header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => toast.success("Exporting audit log CSV...")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted dark:border-transparent dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          <Download className="h-4 w-4 text-cyan-500 dark:text-cyan-400" /> Export Audit Trail
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail..."
            className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["All", "Security", "Profile", "Compliance", "Team", "Export"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${selectedCat === cat
                ? "bg-cyan-500 text-slate-950 font-bold shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground dark:text-slate-300">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase text-muted-foreground dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Event Description</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Initiated By</th>
                <th className="px-4 py-3.5">IP Address</th>
                <th className="px-6 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80 dark:divide-white/5">
              {filtered.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-muted/40 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-semibold text-foreground dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-white/5 dark:text-cyan-400">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <span>{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${log.category === "Security"
                        ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : log.category === "Compliance"
                          ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : log.category === "Team"
                            ? "bg-purple-500/15 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                            : "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
                        }`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-foreground/80 dark:text-slate-300">{log.actor}</td>
                  <td className="px-4 py-4 font-mono text-[11px] text-muted-foreground dark:text-slate-400">{log.ip}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground dark:text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
