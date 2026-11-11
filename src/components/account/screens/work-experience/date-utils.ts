// Date & duration utilities for Work Experience calculations.
// Handles non-overlapping total experience, current employment detection,
// overlap detection, and human-readable duration formatting.

export interface DateRange {
  joiningDate: string; // ISO yyyy-mm-dd
  leavingDate: string;  // ISO yyyy-mm-dd (empty if currently working)
  isCurrent: boolean;
  employmentType: string;
}

// Convert "yyyy-mm-dd" to a Date at midnight (local).
function toDate(iso: string): Date | null {
  if (!iso) return null;
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => isNaN(n))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Difference in days between two dates (b - a). Negative if b < a.
function diffDays(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export interface DurationParts {
  years: number;
  months: number;
  totalMonths: number;
}

// Compute duration in years & months between two ISO dates.
// If `isCurrent`, uses today for the end date.
export function computeDuration(range: DateRange): DurationParts | null {
  const start = toDate(range.joiningDate);
  if (!start) return null;
  const end = range.isCurrent ? new Date() : toDate(range.leavingDate);
  if (!end) return null;
  if (end < start) return { years: 0, months: 0, totalMonths: 0 };

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  const totalMonths = years * 12 + months;
  return { years, months, totalMonths };
}

// Format a duration as a human string like "4 yrs 6 mos" or "3 mos".
export function formatDuration(d: DurationParts | null): string {
  if (!d) return "—";
  if (d.totalMonths === 0) return "0 mos";
  const parts: string[] = [];
  if (d.years > 0) parts.push(`${d.years} yr${d.years === 1 ? "" : "s"}`);
  if (d.months > 0) parts.push(`${d.months} mo${d.months === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" ") : "0 mos";
}

// Format a single ISO date as "Mon YYYY" (e.g. "Jan 2021").
export function formatDateShort(iso: string, isCurrent?: boolean): string {
  if (isCurrent) return "Present";
  if (!iso) return "—";
  const d = toDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Total professional experience excluding overlapping periods.
// Algorithm: merge overlapping ranges, sum the unique spans.
export function totalExperience(ranges: DateRange[]): DurationParts {
  const valid = ranges
    .map((r) => {
      const start = toDate(r.joiningDate);
      const end = r.isCurrent ? new Date() : toDate(r.leavingDate);
      return start && end && end >= start ? { start, end } : null;
    })
    .filter((x): x is { start: Date; end: Date } => x !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (valid.length === 0) return { years: 0, months: 0, totalMonths: 0 };

  // Merge overlapping intervals
  const merged: { start: Date; end: Date }[] = [];
  for (const range of valid) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      if (range.end > last.end) last.end = range.end;
    } else {
      merged.push({ start: range.start, end: range.end });
    }
  }

  let totalDays = 0;
  for (const m of merged) totalDays += diffDays(m.start, m.end);

  const totalMonths = Math.floor(totalDays / 30.4375);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months, totalMonths };
}

// Detect if a given range overlaps any other range in the list (excluding itself).
export interface OverlapInfo {
  index: number;
  overlapsWith: number[];
  warning: string | null;
}

export function detectOverlaps(ranges: DateRange[]): OverlapInfo[] {
  return ranges.map((r, i) => {
    const start = toDate(r.joiningDate);
    const end = r.isCurrent ? new Date() : toDate(r.leavingDate);
    if (!start || !end) return { index: i, overlapsWith: [], warning: null };

    const exemptTypes = ["Part-time", "Freelance", "Internship", "Contract", "Temporary", "Apprenticeship"];
    const isExempt = exemptTypes.includes(r.employmentType);

    const overlapsWith: number[] = [];
    ranges.forEach((other, j) => {
      if (i === j) return;
      const oStart = toDate(other.joiningDate);
      const oEnd = other.isCurrent ? new Date() : toDate(other.leavingDate);
      if (!oStart || !oEnd) return;
      if (start < oEnd && oStart < end) {
        overlapsWith.push(j);
      }
    });

    let warning: string | null = null;
    if (overlapsWith.length > 0 && !isExempt) {
      warning = `This employment overlaps with another full-time record. Please verify the dates are correct.`;
    } else if (overlapsWith.length > 0 && isExempt) {
      warning = `Overlaps with another record — allowed for ${r.employmentType.toLowerCase()} employment.`;
    }
    return { index: i, overlapsWith, warning };
  });
}

export function formatSalary(amount: string, currencyCode: string, frequency: string): string {
  if (!amount) return "—";
  const symbol = currencyCode === "INR" ? "₹" : currencyCode === "USD" ? "$" : currencyCode === "EUR" ? "€" : currencyCode === "GBP" ? "£" : currencyCode === "Other" ? "" : `${currencyCode} `;
  const freq = frequency === "Annually" ? "/ annum" : frequency === "Monthly" ? "/ month" : frequency === "Hourly" ? "/ hour" : "";
  return `${symbol}${amount}${freq}`;
}

export function formatINR(num: number): string {
  return num.toLocaleString("en-IN");
}
