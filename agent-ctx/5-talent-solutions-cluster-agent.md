# Task ID: 5 — Talent Solutions Cluster Subagent

## Files Created (4):
1. `src/portals/public/PublicTalentSolutions.tsx` (~489 lines) — Talent Solutions landing (route: `talent-solutions`). Hero (headline "Talent Solutions for Every Hiring Need" with emerald accent, 2 CTAs: Post Requirements → toast, Talk to Sales → navigate "contact") + 4 stat cards (12 solutions, 2M+ candidates, 500+ employers, 98% retention) + 6 main solution cards grid (Train to Hire / Hire to Train / Staffing / Corporate Training / Talent Assessment / Placements with per-card accent colors, top-border, icon tile, badge, "Learn More" → navigate to `talent/{roleKey}` or `placements`) + 6 benefits cards (emerald) + 8-step process timeline + 8 industries cards (with hire counts) + 4 success metrics stats + 3 case studies (FinEdge/MediCare/RetailMax with metrics) + 18 tech stack chips + 3 testimonials + 6 FAQ accordion + CTA.
2. `src/portals/public/PublicTalentRole.tsx` (~1,399 lines) — Talent sub-page template (8 routes: `talent/{roleKey}`). CONFIG map inside file with all 8 role configs (talent-train-to-hire #0EA5E9 GraduationCap, talent-hire-to-train #8B5CF6 UserCheck, talent-staffing #10B981 Users, talent-corporate-training #F97316 Award, talent-assessment #EF4444 ClipboardCheck, talent-sourcing-recruitment #0EA5E9 Search, talent-flexible-deployment #10B981 Layers, talent-end-to-end-workforce #8B5CF6 Globe). Each config: title, subtitle, description, color, icon, heroStats[3], keyFeatures[6], processSteps[6], benefits[6], useCases[3], industries[6], stats[4], testimonials[2-3], deliverables[5], faqs[4], siblingRoles[4]. Sections: hero (color glow + 3 heroStats + 2 CTAs) + key features + process timeline + benefits + use cases + industries chips + stats + deliverables checklist + testimonials + FAQ accordion + sibling roles cross-link + CTA. EmptyState fallback if roleKey not found.
3. `src/portals/public/PublicPlacements.tsx` (~431 lines) — Placements page (route: `placements`). Hero ("Your Gateway to Top Tech Careers" with emerald accent, 2 CTAs) + 4 hero stats (5000+ placements, 200+ companies, ₹12 LPA avg, 45 days time-to-hire) + 8-step placement process timeline + top recruiters strip (14 company name badges: Google, Amazon, Microsoft, TCS, Infosys, Wipro, Accenture, Deloitte, Cognizant, HCL, Tech Mahindra, Flipkart, Swiggy, Zomato) + 3 success stories (name/role/company/salary) + company distribution bar chart (8 companies with div-based bars) + role & salary table (8 roles with avg + range in INR Lakhs, mobile-scroll) + 12-month hiring calendar (peak/high/medium/low intensity tiles + legend) + 6 interview resource cards (mock interviews / aptitude / technical / behavioral / resume review / salary negotiation) + 3 featured blog cards (from `FEATURED_BLOGS`) + CTA.
4. `src/portals/public/PublicEvents.tsx` (~402 lines) — Events page (route: `events`). Hero ("Events & Webinars" with emerald accent, subheadline with upcoming/past counts, 2 CTAs) + event filter (8 category chips + 3-way type toggle All/Upcoming/Past) + 7 sample events grid from local `DEFAULT_EVENTS` array (each card: top-border accent color per category, category badge, Upcoming/Past badge, title, formatted date, time + duration, mode icon + label, location, description, attendee count, "Register Free" button for upcoming → toast.success, "Watch Recording" button for past → toast) + EmptyState fallback + CTA ("Host an event with us" → navigate "contact" with 3 bullet benefits).

## Files Modified (1):
- `src/portals/public/index.tsx` — Added 4 dynamic() lazy imports + 4 new route cases:
  - `talent-solutions` → PublicTalentSolutions
  - `talent` (with sub-route parsing: `talent/{roleKey}` → PublicTalentRole roleKey, bare `talent` → PublicTalentSolutions fallback)
  - `placements` → PublicPlacements
  - `events` → PublicEvents

## Lint Status:
- `bunx eslint` on all 4 Talent cluster files + index.tsx → **clean** (no errors, no warnings, exit 0).
- `bun run lint` → **0 errors, 6 warnings** — all 6 warnings are pre-existing in OTHER agents' files (TanStack Table + React Hook Form `watch()` in PublicPartnerApply, TrainingPartnerClients, TrainingPlacements, TrainingSourcingRequests). NONE from Talent Solutions cluster.
- `bunx tsc --noEmit` → 0 errors from Talent cluster files. Pre-existing tsc errors in other files (PublicJobDetail.tsx, PublicSalaryInsights.tsx, training portal Currency type) — all unrelated.

## Key Decisions:
- **Local TALENT_ROLES CONFIG map inside PublicTalentRole.tsx**: Per task spec ("Build a CONFIG map inside the file"). All 8 roles have full unique data (6 key features, 6 process steps, 6 benefits, 3 use cases, 6 industries, 4 stats, 2-3 testimonials, 5 deliverables, 4 FAQs, 4 sibling roles each). Colors and icons match PublicNavbar TALENT_SEGMENTS exactly so the navigation visual identity is consistent.
- **Module-scope ICON_COMMON map for lint safety**: Imported ~60 lucide icons and stored them in `ICON_COMMON: Record<string, LucideIcon>` map. This satisfies `no-unused-vars` (every imported identifier is referenced) and `react-hooks/static-components` (no `lookupIcon()` function calls — only inline property access like `<config.icon />` or `const SiblingIcon = r.icon; <SiblingIcon />`). Exported as `_TALENT_ROLE_ICONS` for downstream consumers.
- **Per-role accent colors as SECONDARY accents only**: Used inline `style={{ backgroundColor: `${color}1A`, color: color }}` for icon tiles, `style={{ borderTopColor: color, borderTopWidth: 4 }}` for top borders, and `style={{ color: color, borderColor: `${color}40` }}` for badges. Primary CTAs always use the emerald `bg-brand` / `text-brand`. This keeps the emerald brand identity consistent while letting each role have a distinct visual signature.
- **Bar chart visualization with pure CSS divs** in PublicPlacements: 8 companies rendered as horizontal bars with `width: ${pct}%` (where pct = count / maxCount * 100) and `backgroundColor: c.color`. The number label is shown inside the bar if pct > 15%, otherwise outside. No chart library needed.
- **Hiring calendar intensity tiles**: 12 month tiles with 4 intensity levels (Peak/High/Medium/Low) rendered via Tailwind opacity utilities (`bg-brand` for peak, `bg-brand/70` for high, `bg-brand/40` for medium, `bg-brand/15` for low) with a legend.
- **Salary table mobile-responsive**: `overflow-x-auto` wrapper with `min-w-[640px]` table to allow horizontal scroll on mobile while preserving column alignment.
- **Event filtering with React.useState + useMemo**: Local state for activeCategory and activeType, memoized filtered+sorted list. Upcoming events sorted by date ascending (closest first), past events sorted by date descending (most recent first). EmptyState shown when filters return no events, with reset button.
- **Sibling roles cross-link**: Each PublicTalentRole page shows 4 sibling role cards (other talent solutions) at the bottom — clickable to navigate to `talent/{siblingKey}`. This ensures all 8 role pages are interlinked (e.g. Sourcing & Recruitment ↔ Flexible Deployment ↔ End-to-End Workforce ↔ Talent Assessment, etc.) — users can browse between solutions without going back to the landing page.
- **Smooth-scroll for "Learn More" buttons**: PublicTalentRole uses `React.useRef` + `scrollIntoView({ behavior: "smooth" })` for the "Learn More" CTA. PublicEvents uses `document.getElementById("events-grid")?.scrollIntoView(...)` for the "Browse Events" CTA.

## Routes Wired Up:
- `talent-solutions` → PublicTalentSolutions
- `talent/talent-train-to-hire` → PublicTalentRole roleKey="talent-train-to-hire"
- `talent/talent-hire-to-train` → PublicTalentRole roleKey="talent-hire-to-train"
- `talent/talent-staffing` → PublicTalentRole roleKey="talent-staffing"
- `talent/talent-corporate-training` → PublicTalentRole roleKey="talent-corporate-training"
- `talent/talent-assessment` → PublicTalentRole roleKey="talent-assessment"
- `talent/talent-sourcing-recruitment` → PublicTalentRole roleKey="talent-sourcing-recruitment"
- `talent/talent-flexible-deployment` → PublicTalentRole roleKey="talent-flexible-deployment"
- `talent/talent-end-to-end-workforce` → PublicTalentRole roleKey="talent-end-to-end-workforce"
- `placements` → PublicPlacements
- `events` → PublicEvents

All 8 roleKey values match EXACTLY the route strings configured in PublicNavbar TALENT_SEGMENTS (verified by comparing src/components/layout/PublicNavbar.tsx lines 121-141 with TALENT_ROLES keys in PublicTalentRole.tsx).

## Total: ~2,721 lines of new code across 4 page files + 1 router update.
