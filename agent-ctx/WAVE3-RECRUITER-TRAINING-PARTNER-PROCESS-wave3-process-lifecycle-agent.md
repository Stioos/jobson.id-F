# Task WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS — Work Record

**Agent**: Subagent (Wave 3 Process & Lifecycle)
**Task**: Build 9 process & lifecycle features across RECRUITER (4), TRAINING (3), and PARTNER (2) portals — each with page component, route case, and sidebar item.

## Context reviewed
- `/home/z/my-project/worklog.md` tail — confirmed Next.js 16 + TS + Tailwind 4 + shadcn/ui stack, emerald brand palette, `useNav` from `@/lib/store`, dynamic-import routers, switch-case routing.
- `/agent-ctx/WAVE2-RECRUITER-TRAINING-SOURCING-wave2-recruiter-training-sourcing-agent.md` — used as the canonical pattern reference (dynamic-import placement + switch-case placement + sidebar placement).
- `src/portals/recruiter/index.tsx` (200 lines) — recruiter dynamic-import + switch-case router pattern.
- `src/portals/training/index.tsx` (313 lines) — training router pattern with root segment switching.
- `src/portals/partner/index.tsx` (170 lines) — partner router pattern.
- `src/components/layout/portal-config.ts` — recruiter sidebar groups: `jobs-grp` (Jobs & Pipeline), `hiring-grp` (Hiring & Ops), `finance-grp` (Finance), `comms-grp` (Comms & Support). Training groups: `training-ops` (Training), `talent` (Talent & Skills). Partner groups: `partnership-grp` (Partnership).
- `src/components/common/Icon.tsx` — confirmed `CalendarClock` already present, added missing `FileSignature`, `Milestone`, `MailX`, `UserCog` (4 icons).
- `src/components/common/index.tsx` — confirmed `PageHeader, Card, CardContent, CardHeader, CardTitle, CardDescription, SectionCard, StatCard, EmptyState, StatusBadge, MatchScore` signatures.
- `src/portals/recruiter/RecruiterGuarantees.tsx` — emerald/amber/rose tone reference, sonner toast pattern, Table layout.
- `src/lib/format.ts` — `formatCurrency, formatDate, formatDateTime, daysUntil, timeAgo, initials, formatNumber`.

## Files created (9)

### Recruiter Portal (4)
1. `src/portals/recruiter/RecruiterSubmissionTracker.tsx` (~265 lines)
   - Route: `submission-tracker`
   - 10 mock submissions with full timeline per row.
   - Conversion funnel: Sent → Viewed → Shortlisted → Interviewed → Offered → Placed (with % from prev stage).
   - Color-coded days-in-stage: green <3, amber 3-7, red >7 (stage-resolved text colors).
   - Filters: client, stage, date range (7d/30d/all).
   - Expandable row → full timeline with stage chips, dates, and notes.
   - Advance action promotes a submission to its next stage with toast.
   - 4 StatCards: active submissions, placed, stuck >7d, overall placement rate.

2. `src/portals/recruiter/RecruiterOfferEsign.tsx` (~315 lines)
   - Route: `offer-esign`
   - 6 mock offers across Sent/Viewed/Signed/Declined/Expired statuses.
   - Pending & sent offers table with status chips.
   - Offer letter preview dialog (mock document with header, compensation, signatures placeholder, viewed/signed IP audit footer).
   - Send-for-signature dialog (candidate select, role, expiry 7/14/21/30 days, reminders toggle, default template upload UI).
   - Signed documents list with per-doc PDF download button.
   - Audit trail section + per-offer audit dialog (events list with actor, timestamp, IP).
   - 4 StatCards: awaiting signature, signed this month, declined/expired, avg time to sign.

3. `src/portals/recruiter/RecruiterBillingMilestones.tsx` (~280 lines)
   - Route: `billing-milestones`
   - 8 mock placements (4 permanent one-time, 4 contract monthly) with milestone tables.
   - For contract placements: month-by-month milestone table (timesheet status, invoice status, payment status, amount, due date, mark-paid action).
   - For permanent placements: one-time invoice card with status (Pending/Generated/Sent/Paid/Overdue), invoice date, due date, aging, generate-invoice + mark-paid actions.
   - 6-month revenue forecast bar chart (from active contract monthly fees).
   - Payment aging buckets (Current / 1-30d / 31-60d / 60+d overdue).
   - Detail dialog with full milestone breakdown or one-time invoice card.
   - 4 StatCards: collected YTD, outstanding, overdue, active engagements.

4. `src/portals/recruiter/RecruiterRejectionAutomation.tsx` (~310 lines)
   - Route: `rejection-automation`
   - 5 mock rules + 8 mock sent records.
   - 3-tab layout: Rules / Templates / Sent history.
   - Rules table: name, trigger (Screen Fail / Interview Fail / Offer Declined / Position Filled), delay (Immediate/1 day/3 days), sent count, open rate, Active/Paused status, per-row actions (Edit, Pause/Play, Delete).
   - Template editor with merge-field insertion buttons ({{candidate_name}}, {{role}}, {{company}}, {{recruiter_name}}, {{interview_date}}), live preview pane.
   - Sent history table with candidate, role, rule triggered, sent date, opened/responded icons.
   - Create-rule dialog with name, trigger select, delay select, template select.
   - 4 StatCards: active rules, total sent (30d), open rate, response rate.

### Training Portal (3)
5. `src/portals/training/TrainingEnrollmentApproval.tsx` (~270 lines)
   - Route: `enrollment-approval`
   - 8 mock enrollment requests + 6 cohorts with seat counts.
   - Pending + History tabs.
   - Approval pipeline visualization: Student → Counsellor → Academic Head → Finance (4 steps with pending counts).
   - Auto-approval rule banner: if fee paid + eligibility met → auto-approve at Counsellor step.
   - Seat availability tracker per cohort (with capacity bar, full/at-risk/healthy color coding).
   - Pending approvals table with batch-approve checkbox selection.
   - Approve/Reject dialog with comments field; advances step or marks final Approved/Rejected status.
   - 4 StatCards: pending, approved, rejected, auto-approved.

6. `src/portals/training/TrainingTrainerAllocation.tsx` (~245 lines)
   - Route: `trainer-allocation`
   - 6 mock batches + 5 mock trainers with 8-week utilization heatmap data.
   - Two-pane workbench: unassigned batches (selectable, with skills chips) | available trainers (match score, utilization %, skills with match-highlighted chips).
   - Match score = (% of batch skills present in trainer skills) with color tone (>=80 emerald, >=50 amber, else rose).
   - Allocate/Unassign buttons; over-utilized trainers (>=100%) are disabled.
   - Current allocations table with conflict detection (same trainer + overlapping windows → conflict badge).
   - Utilization heatmap (trainers × 8 weeks: free/partial/booked color squares with legend).
   - 4 StatCards: unassigned, allocated, active trainers, conflicts detected.

7. `src/portals/training/TrainingCompletionTracker.tsx` (~290 lines)
   - Route: `completion-tracker`
   - 4 mock cohorts with full funnel + at-risk students + trend data.
   - Cohort selector dropdown.
   - 6-stage completion funnel: Enrolled → Attended >50% → Submitted Assessments → Passed → Certified → Placed. Each stage card: count, conversion % from previous, dropoff count + reasons list.
   - At-risk students table (attendance <75% OR assessment score <40%) with color-coded metrics and intervention actions (Counselling / Extra session / Mentor).
   - Completion rate trend (week-by-week bar chart) with declining-rate warning banner.
   - Drop-off reasons summary grid aggregated across all funnel stages.
   - 4 StatCards: enrolled, placed, placement rate, at-risk count.

### Partner Portal (2)
8. `src/portals/partner/PartnerOnboardingWizard.tsx` (~290 lines)
   - Route: `partner-onboarding`
   - 9-step wizard: Application → KYC → Agreement → Centre Setup → First Batch → First Placement → Go-Live → Review → Complete.
   - Mock data: steps 1-3 complete, step 4 in progress, steps 5-9 not started.
   - Top: progress bar + 4 StatCards (steps complete, in progress, not started, overall %).
   - Step indicator row: clickable buttons with step number / checkmark icon, label, status.
   - Active step detail: checklist items (toggle done/not-done), form fields, document upload list, Skip/Complete/Previous/Next buttons.
   - Right: onboarding summary list of all 9 steps with status badges.
   - Toast feedback on Complete step / Skip / upload document.

9. `src/portals/partner/PartnerRenewalForecast.tsx` (~310 lines)
   - Route: `renewal-forecast`
   - 10 mock agreements across Low/Medium/High risk and Auto/Manual/Not Renewing statuses.
   - 4 StatCards: upcoming (90d) count + value, at-risk (30d) count + value, expired count + value, total active value.
   - 6-month renewals forecast bar chart (count + annual revenue at stake per month).
   - Agreements table: partner/college, type, end date, days left (color-coded by bucket: expired/at-risk/upcoming/future), annual revenue, risk level, renewal status, review action.
   - Risk-level filter (all/Low/Medium/High).
   - At-risk agreements card: high-risk renewals with risk factor bullet lists.
   - Renewal recommendations card: top 6 agreements with Lightbulb icon + recommendation text.
   - Renewal detail dialog: metrics grid (days left, annual revenue, risk), risk factors list, brand-bordered recommendation box, Renew-now button (extends end date by 1 year).

## Files modified (4)

### `src/components/common/Icon.tsx`
- Added 4 lucide icons to import list: `FileSignature, Milestone, MailX, UserCog` (CalendarClock was already present).
- Added same 4 icons to the `map` object so `<Icon name="..." />` resolves correctly.

### `src/portals/recruiter/index.tsx`
- Added 4 dynamic imports under `// Process & lifecycle pages (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)` comment.
- Added 4 route cases after the WAVE2 cases: `submission-tracker`, `offer-esign`, `billing-milestones`, `rejection-automation`.

### `src/portals/training/index.tsx`
- Added 3 dynamic imports under `// Process & lifecycle pages (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)` comment.
- Added 3 route cases after `case "surveys"`: `enrollment-approval`, `trainer-allocation`, `completion-tracker`.
- Re-verified that the existing `case "certifications"` route case (accidentally removed during edit) was restored.

### `src/portals/partner/index.tsx`
- Added 2 dynamic imports under `// Process & lifecycle pages (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)` comment.
- Added 2 route cases after `case "renewals"`: `partner-onboarding`, `renewal-forecast`.

### `src/components/layout/portal-config.ts`
- Recruiter sidebar:
  - `jobs-grp` (Jobs & Pipeline): added `submission-tracker` (Send icon) between `submissions` and `interview-pipeline`.
  - `hiring-grp` (Hiring & Ops): added `offer-esign` (FileSignature icon) after `offers`.
  - `finance-grp` (Finance): added `billing-milestones` (Milestone icon) after `invoices`.
  - `comms-grp` (Comms & Support): added `rejection-automation` (MailX icon) between `email-templates` and `messages`.
- Training sidebar:
  - `training-ops` (Training): added `trainer-allocation` (UserCog icon) after `trainers`, and `completion-tracker` (Flag icon) after `trainer-allocation`.
  - `talent` (Talent & Skills): added `enrollment-approval` (ClipboardCheck icon) after `enrollments`.
- Partner sidebar:
  - `partnership-grp` (Partnership): added `partner-onboarding` (Rocket icon) after `mou-agreements`, and `renewal-forecast` (CalendarClock icon) after `renewals`.

## Routes added (9)
- `submission-tracker` (recruiter)
- `offer-esign` (recruiter)
- `billing-milestones` (recruiter)
- `rejection-automation` (recruiter)
- `enrollment-approval` (training)
- `trainer-allocation` (training)
- `completion-tracker` (training)
- `partner-onboarding` (partner)
- `renewal-forecast` (partner)

## Sidebar items added (9)
Same 9 keys as above, distributed across the 7 sidebar groups per spec.

## Lint result
`bun run lint` → **0 errors, 6 warnings**. All 6 warnings are pre-existing `react-hooks/incompatible-library` warnings in unrelated files (LearnerProfile, PublicPartnerApply, TrainingPartnerClients, TrainingPlacements, TrainingSourcingRequests, EmployerApplicants). **0 errors and 0 warnings in any of the 9 new files or modified config files.**

## Dev server verification
Dev server was down at start of testing — restarted with `(setsid bun run dev > dev.log 2>&1 < /dev/null &)`. All 9 new routes verified to return HTTP 200 with successful Turbopack compilation (initial compile 8-30s, subsequent renders <100ms):

- `/?portal=recruiter&route=submission-tracker` → 200 ✓
- `/?portal=recruiter&route=offer-esign` → 200 ✓
- `/?portal=recruiter&route=billing-milestones` → 200 ✓
- `/?portal=recruiter&route=rejection-automation` → 200 ✓
- `/?portal=training&route=enrollment-approval` → 200 ✓
- `/?portal=training&route=trainer-allocation` → 200 ✓
- `/?portal=training&route=completion-tracker` → 200 ✓
- `/?portal=partner&route=partner-onboarding` → 200 ✓
- `/?portal=partner&route=renewal-forecast` → 200 ✓

## Patterns followed
- All pages `"use client"` with mock data inline (no DB or API calls).
- PageHeader with `icon` prop + `actions` array for header buttons.
- StatCard for KPI grids (4-up on sm+).
- SectionCard for grouped content with title/description/action.
- Card/CardContent for layout blocks; EmptyState where applicable.
- AvatarLogo for candidates, partners, students, approvers.
- `Badge` imported from `@/components/ui/badge` (NOT from `@/components/common` — common does not export Badge).
- Emerald brand colors throughout (`bg-brand`, `text-brand`, `border-brand/30`, `bg-brand/5`, `bg-brand/10`) — no indigo or blue.
- Toast feedback via `sonner` for all actions (advance, allocate, approve, reject, complete step, renew, etc.).
- Consistent use of `formatCurrency` / `formatDate` from `@/lib/format`.
- Tables wrapped in `max-h-* overflow-y-auto scroll-thin` for long lists.
- Dialog (DialogHeader/Title/Description/Footer/Close) for create/view forms and detail panels.
- Tabs for multi-view sections (Rules/Templates/History; Pending/History).
- Progress for skill readiness, completion progress, utilization bars.
- Color tones for status: emerald (success/active), amber (warning/in-progress), rose (danger/rejected), slate (default/not-started), cyan (viewed), violet (shortlisted/contract), teal (sent/offer).
- Icons imported directly from `lucide-react` (not the shared Icon map) inside each page for non-sidebar usage to keep imports local and tree-shakeable.

## Issues / notes
- During testing, the dev server crashed several times (EADDRINUSE / process killed) due to concurrent requests from other agents (WAVE3-employer-lifecycle, WAVE3-candidate) running in parallel and the sandbox's 4GB memory ceiling (no swap). Restarted cleanly between tests and verified each route 200 OK sequentially with sleep gaps.
- Page line counts (265 / 315 / 280 / 310 / 270 / 245 / 290 / 290 / 310) — most within or close to the 150-300 line guideline; a few modestly above due to the rich required content (10 mock submissions × full timelines; 8 placements × milestone tables; 9-step wizard × checklist+fields+documents; 10 agreements × risk factors+recommendations). Trimming further would compromise required sections or mock-data realism. Existing partner/training pages in the codebase follow the same density pattern (e.g. `TrainingCourseBuilder.tsx` is 524 lines, `PartnerCollegeProfiles.tsx` is 544 lines).
- No blockers. All 9 pages render successfully via their respective portal routers. User can preview by switching to Recruiter / Training & Admin / Partner portal in the top bar and selecting the new sidebar items.
