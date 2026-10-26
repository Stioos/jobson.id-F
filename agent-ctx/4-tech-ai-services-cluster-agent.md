# Task ID: 4 — Tech & AI Services Cluster Subagent

## Files Created (5):
1. `src/portals/public/PublicTechAIServices.tsx` (~390 lines) — Tech & AI Services landing (route: `tech-ai-services`). Hero + 4 stats + live search (with dropdown of matching services → `services/{catSlug}/{svcSlug}`) + category Select filter + 9-category grid (per-card accent color, top-border, icon tile, service-count chip, "Explore" button) + deduped tech-stack chips strip + CTA.
2. `src/portals/public/PublicServiceCategory.tsx` (~461 lines) — Category detail (route: `services/{catSlug}`). EmptyState fallback. Hero (icon tile + name + description + 3 CTAs + at-a-glance side card) + key benefits grid (6 cards) + 4-step process timeline + tech stack chips + services list grid + stats row + testimonials (3 cards) + FAQ accordion + related categories (3 cards) + CTA.
3. `src/portals/public/PublicServiceDetail.tsx` (~471 lines) — Service detail (route: `services/{catSlug}/{svcSlug}`). EmptyState fallback. Breadcrumb (Home / Services / Category / Service) + hero (category badge + service name + 2 CTAs + pricing side card with `formatINR`) + overview + features grid (6 derived cards from category.keyBenefits) + tech stack chips + industries served grid + related services (3 cards) + FAQ accordion (first 4) + testimonials (first 2) + CTA.
4. `src/portals/public/PublicProfessionalServices.tsx` (~402 lines) — Professional Services landing (route: `professional-services`). Hero + 4 stats + why-choose-us (6 cards, emerald) + 8 service highlight blocks (each: number badge, icon tile, name, subtitle, description, 4 features, industry chips, "Learn More" → `professional-services/{slug}`) + 4-step process timeline + testimonials (3 cards) + FAQ accordion (5 Q&As) + CTA.
5. `src/portals/public/PublicProfessionalServiceDetail.tsx` (~571 lines) — Professional service detail (route: `professional-services/{slug}`). EmptyState fallback. Hero (num badge + name + subtitle + description + 2 CTAs + at-a-glance stats side card) + overview (with before/after card) + features grid + how-it-works (5 steps) + benefits (6 cards) + deliverables (cards) + who-is-it-for (4 cards with bullet lists) + process (4 phases with scrollable topic lists) + tech tools chips + success metrics (4 stat cards) + industries grid + testimonials (3 cards) + related services (resolved via `relatedServices` slugs) + CTA.

## Files Modified (1):
- `src/portals/public/index.tsx` — Added 5 dynamic() lazy imports + 3 new route cases:
  - `tech-ai-services` → PublicTechAIServices
  - `services` (with sub-route parsing: `services/{catSlug}` → category detail, `services/{catSlug}/{svcSlug}` → service detail, `services` alone → landing fallback)
  - `professional-services` (with sub-route parsing: `professional-services` → landing, `professional-services/{slug}` → detail)

## Lint Status:
- `bun run lint` → **0 errors, 6 warnings** — all 6 warnings are pre-existing in OTHER agents' files (TanStack Table + React Hook Form `watch()` in PublicPartnerApply, TrainingPartnerClients, TrainingPlacements, TrainingSourcingRequests, LearnerProfile, EmployerApplicants). NONE from Tech & AI cluster files.
- `bunx eslint` on all 5 Tech & AI cluster files + index.tsx → clean (no errors, no warnings).
- `bunx tsc --noEmit` → 0 errors from Tech & AI cluster files (pre-existing errors in training portal Currency type only).

## Key Decisions:
- **Local ICON_MAP per file**: Each of the 5 files imports ~60 lucide icons and builds a module-scope `ICON_MAP: Record<string, LucideIcon>` to map the data-file `icon` string → component. Inline lookups `ICON_MAP[name] ?? Sparkles` (NOT a `lookupIcon()` function call) are used so the `react-hooks/static-components` lint rule is satisfied (matches the pattern already used in `PublicNavbar.tsx`). A first-pass attempt used a `lookupIcon(name)` helper function, which the rule rejected as "creating components during render" — refactored to inline map indexing.
- **Per-category / per-service accent colors used as SECONDARY accents only**: icon tiles (background `${color}1A`, color `${color}`), top-border (`borderTopColor: color, borderTopWidth: 4`), badges, CTA card border + gradient. Primary CTAs always use the emerald `bg-brand` / `text-brand`. Per-category colors from `serviceCategories[].color` (#0099FF / #D4A017 / #10B981 / etc.); per-service colors from `professionalServices[].color`.
- **Illustrative pricing**: `ILLUSTRATIVE_PRICE` map in `PublicServiceDetail.tsx` keys starting price by category slug (₹1.5L–₹6L), formatted with a local `formatINR()` helper (`₹X.XX L` / `₹X.XX Cr`). UI clearly labels it as "Illustrative pricing — Final cost depends on scope, timeline, and team size."
- **Service-detail features grid**: Derived from `category.keyBenefits.slice(0, 6)` per the task spec (since `ServiceItem` doesn't have its own `features` array).
- **Related services on professional service detail**: Resolves `svc.relatedServices` (array of slugs) via `getProfessionalService(s)` and type-guards with `.filter((s): s is ProfessionalService => Boolean(s))`.
- **Live search dropdown**: Uses `searchAllServices(query)` from servicesData (returns `{ service, category }[]`). Results are sliced to 8 and rendered as a clickable dropdown list. Outside-click handler closes the dropdown. Clicking a result navigates to `services/{catSlug}/{svcSlug}`.
- **Category filter Select**: Filters the 9-category grid. "Clear filter" button appears when an active filter is set. EmptyState shown if no categories match.
- **Long list handling**: `process` topic lists in `PublicProfessionalServiceDetail` use `max-h-44 overflow-y-auto` per the spec.

## Routes Wired Up:
- `tech-ai-services` → PublicTechAIServices
- `services` → PublicTechAIServices (fallback, since landing already exists at tech-ai-services)
- `services/{catSlug}` → PublicServiceCategory catSlug
- `services/{catSlug}/{svcSlug}` → PublicServiceDetail catSlug, svcSlug
- `professional-services` → PublicProfessionalServices
- `professional-services/{slug}` → PublicProfessionalServiceDetail slug

All 9 category routes, 54+ service detail routes, and 8 professional service detail routes are reachable from the rebuilt PublicNavbar (which already had these route strings configured in HEADER-REBUILD: `go("tech-ai-services")`, `go(\`services/${cat.slug}\`)`, `go(\`services/${cat.slug}/${svc.slug}\`)`, `go("professional-services")`, plus `go(\`professional-services/${slug}\`)` from the landing page's "Learn More" buttons).

## Total: ~2,295 lines of new code across 5 page files + 1 router update.
