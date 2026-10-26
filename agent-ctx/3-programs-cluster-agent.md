# Task ID: 3 — Programs Cluster Subagent

## Files Created (6):
1. `src/portals/public/_programData.tsx` (~210 lines) — Shared data module: PUBLIC_PROGRAMS (3 program defs), ROLE_ROUTES (18 role routes with roleView↔trackKey mapping), helper functions (getPublicProgram, getRoleRoute, getProgramTrackByRoleView, getRolesForProgram, roleRouteKey).
2. `src/portals/public/PublicPrograms.tsx` (~345 lines) — Programs landing page (route: `programs`). Hero + 3 stats + 3 program comparison cards + 18 role grid (grouped by program) + PAP highlight strip + FAQ accordion + CTA.
3. `src/portals/public/PublicProgramDetail.tsx` (~560 lines) — Program detail page (routes: `programs/fde-forward-deployment`, `programs/fde-program`, `programs/dsai-program`). Receives `programId` prop. Hero + highlights + curriculum phases (from first role track) + 6 specialization cards + tech stack chips + career outcomes + comparison table + testimonials + FAQ + CTA.
4. `src/portals/public/PublicProgramRole.tsx` (~615 lines) — Specialization role page (18 routes like `programs/fde-software-engineer`). Receives `roleView` prop. Looks up track via getProgramTrackByRoleView. Hero + highlights + curriculum + tech stack + career outcomes + who should join + sibling roles cross-link + testimonials + CTA.
5. `src/portals/public/PublicPayAfterPlacement.tsx` (~315 lines) — PAP page (route: `pay-after-placement`). Hero + 3-step "how it works" + 6 benefit cards + fee comparison table + 4 metrics + testimonials + FAQ (native details/summary) + CTA.
6. `src/portals/public/PublicScholarship.tsx` (~400 lines) — Scholarship page (route: `scholarship`). Hero + 4 stats + 4 scholarship type cards (Merit/Need/Women in Tech/Defense) + deadlines table + 4 success stories + eligibility FAQ accordion + CTA.

## Files Modified (1):
- `src/portals/public/index.tsx` — Added 5 dynamic() lazy imports + 3 new route cases ("programs" with sub-route parsing for 3 program ids vs 18 role views, "pay-after-placement", "scholarship").

## Lint Status:
- `bun run lint` → 0 errors, 6 warnings (all pre-existing in other agents' files — TanStack Table + React Hook Form `watch()`).
- `bunx eslint` on all 6 Programs cluster files → clean.
- `bunx tsc --noEmit` → 0 errors from Programs cluster files (pre-existing errors in other files only).

## Key Decisions:
- Used a shared `_programData.tsx` module instead of inlining the 3 program defs in each file — single source of truth, avoids drift, cleaner. Module name starts with `_` to signal it's not a page (no Public prefix).
- The 6 FDE-FWD role URLs use "fde-" prefix (matching PublicNavbar PROGRAM_GROUPS config) but map to "fde-fwd-*" trackKeys in PROGRAM_TRACKS — explicit mapping in ROLE_ROUTES handles this. The 12 FSE/DSAI roles have roleView === trackKey directly.
- PublicProgramDetail uses the FIRST role track's curriculum (e.g. FDE-FWD uses Data Engineer track's 4 phases) as the "shared curriculum" with a UI note explaining this. Each PublicProgramRole page shows that specific role's exact curriculum from programTracksData.
- Career outcomes salary bands are illustrative Indian market data — defined per roleView in SALARY_BANDS map (PublicProgramRole) and per programId in CAREER_OUTCOMES map (PublicProgramDetail).
- PAP FAQ uses native `<details>`/`<summary>` for variety; Scholarship eligibility FAQ uses shadcn Accordion for consistency with Programs/ProgramDetail.

## Routes Wired Up:
- `programs` → PublicPrograms
- `programs/{fde-forward-deployment|fde-program|dsai-program}` → PublicProgramDetail programId
- `programs/{anyOtherString}` → PublicProgramRole roleView (18 role views)
- `pay-after-placement` → PublicPayAfterPlacement
- `scholarship` → PublicScholarship

All 22 new routes are reachable from the rebuilt PublicNavbar (which already had these route strings configured in HEADER-REBUILD).
