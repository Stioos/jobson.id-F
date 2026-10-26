# Task SETTINGS-SUPPORT — Settings & Support hubs across all 5 portals

## Scope
Built comprehensive Settings + Support hubs for all 5 portals (candidate, employer, recruiter, training, partner). 4 new pages per portal × 5 portals = **20 new pages**, plus nav config updates and lazy-load router wiring.

## Approach
To keep bundle size bounded (sandbox memory limit) and avoid copy-paste drift, created a single shared module `src/portals/_settings-support-shared/index.tsx` with all reusable building blocks. Each portal's 4 pages is then a thin, portal-specific shell that wires shared blocks to portal data (FAQs, integrations, plan info, default user details, etc.).

## Shared module: `src/portals/_settings-support-shared/index.tsx`
Exports:
- **ToggleRow**, **ChannelMatrix** — generic toggle and category×channel matrix.
- **AccountSection**, **AppearanceSection**, **PrivacySection**, **BillingSection**, **IntegrationsSection**, **ApiSection**, **DangerZoneSection**, **QuickLinkCard** — Settings Hub building blocks.
- **PasswordSection**, **MfaSection** (with QR placeholder + recovery codes), **SessionsSection** (with AlertDialog revoke), **LoginHistorySection**, **SecurityAlertsSection**, **IpAllowlistSection**, **SecurityScoreSection** — Security Center building blocks.
- **NotificationGroupCard**, **ScheduleSection** (quiet hours + day picker) — Notification Preferences building blocks.
- **FaqSection** (searchable accordion), **ContactOptionsSection**, **KnowledgeBaseSection**, **VideoTutorialsSection**, **SystemStatusSection**, **FeedbackSection** (rating + category + message), **CommunityForumSection**, **TicketsSection** (table + dialog form) — Support Hub building blocks.

## 20 new pages
- candidate: `CandidateSettingsHub.tsx`, `CandidateSecurityCenter.tsx`, `CandidateNotificationPrefs.tsx`, `CandidateSupportHub.tsx`
- employer: `EmployerSettingsHub.tsx`, `EmployerSecurityCenter.tsx`, `EmployerNotificationPrefs.tsx`, `EmployerSupportHub.tsx`
- recruiter: `RecruiterSettingsHub.tsx`, `RecruiterSecurityCenter.tsx`, `RecruiterNotificationPrefs.tsx`, `RecruiterSupportHub.tsx`
- training: `TrainingSettingsHub.tsx`, `TrainingSecurityCenter.tsx`, `TrainingNotificationPrefs.tsx`, `TrainingSupportHub.tsx`
- partner: `PartnerSettingsHub.tsx`, `PartnerSecurityCenter.tsx`, `PartnerNotificationPrefs.tsx`, `PartnerSupportHub.tsx`

Each page is `"use client"`, uses `useNav()` for navigation, `useAuth()` for user defaults, the shared blocks, and portal-specific config (FAQs, integrations like LinkedIn/GitHub for candidate, Greenhouse/Workday for employer, Naukri/Bullhorn for recruiter, Moodle/Zoom for training, GST/ICICI/Razorpay for partner).

## Routers updated
Each portal's `index.tsx` got 4 new `dynamic()` imports + 4 new `case` entries (`settings-hub`, `security-center`, `notification-preferences`, `support-hub`). Existing `settings` and `support` routes preserved as legacy entries.

## Nav config (`src/components/layout/portal-config.ts`)
Each portal got two new main items:
- `settings-grp` (Settings) — children: Settings Center, Security Center, Notifications, plus portal-specific extras (Team for employer, Recruiter Team for recruiter, Integrations for training, Configure/Calculator for partner, Legacy Settings everywhere).
- `support-grp` (Support) — children: Help Center, plus portal-specific extras (Messages for employer, Candidate Inbox for recruiter, Audit Logs for training, Revenue Splits/Invoices for partner, Legacy Support everywhere).

Candidate: removed the `settings` leaf from the existing `account` main; employer: added both mains fresh; recruiter: added both mains fresh (existing `support` leaf in `comms-grp` kept); training: removed `settings`/`support` leaves from `tools-grp` (renamed to "Tools") and added both mains; partner: refactored existing `settings-grp` to lead with new sub-items, removed `support` leaf from `tools-grp`, added new `support-grp` main.

## Icon registry
Extended `src/components/common/Icon.tsx` with: `Phone`, `Smartphone`, `Monitor`, `Fingerprint`, `RefreshCw`, `Download`, `Upload`, `Link` (aliased), `Sun`, `Moon`, `Check`, `X`, `Plus`, `Trash2`, `Pencil`, `Copy`. Previously `Phone` was used in candidate support but silently rendered as `Circle` (empty span); now it renders correctly.

## Quality bar
- All pages `"use client"`, emerald brand throughout, responsive (sm/md/lg/xl breakpoints).
- Cards `p-4`/`p-6`, long lists `max-h-96 overflow-y-auto scroll-thin`.
- AlertDialog for destructive actions (delete account, revoke session).
- Every button does something (toast / navigate / state mutation). No dead buttons.
- Granular per-category toggles (email/SMS/in-app/push) + channel matrix.
- MFA section with QR placeholder + 8 recovery codes (hide/show).
- 8-10 mock login-history rows, 3-4 security alerts, 4 active sessions per portal.
- 8 FAQs per support hub, 6 knowledge-base articles, 6 video tutorials, 4 community threads, 2-3 mock tickets.
- Toasts via `sonner`. Selects via `@/components/ui/select`. Switches via `@/components/ui/switch`.

## Lint status
- `bun run lint` → **0 errors, 6 warnings** (all pre-existing TanStack Table / RHF watch warnings in other agents' files; none from SETTINGS-SUPPORT files).
- `bunx tsc --noEmit` for SETTINGS-SUPPORT files → clean (one AvatarLogo prop typo `name` → `text` was caught and fixed).

## Files created
- `src/portals/_settings-support-shared/index.tsx` (shared module)
- 20 page files (4 per portal × 5 portals), listed above.

## Files modified
- `src/portals/candidate/index.tsx` (router)
- `src/portals/employer/index.tsx` (router)
- `src/portals/recruiter/index.tsx` (router)
- `src/portals/training/index.tsx` (router)
- `src/portals/partner/index.tsx` (router)
- `src/components/layout/portal-config.ts` (nav config for all 5 portals)
- `src/components/common/Icon.tsx` (extended icon registry)

## Issues / notes for orchestrator
- Existing `settings` and `support` routes kept as "Legacy" nav items for backward compatibility. Old pages (e.g. `CandidateSettings.tsx`) still work; new hubs are at `settings-hub` / `support-hub`.
- `useAuth` provides `{ user }` with `name`, `email`, `role`, `avatar`, `orgName`, `orgLogo`. Each Settings Hub's `AccountSection` falls back to portal-appropriate defaults (Priya Nair / Rohan Mehta / Sneha Reddy / Divya Sharma / Rajesh Kumar) when `user` is null.
- The `AccountSection` uses `AvatarLogo` with the user's name as `text` (the registry takes `text`, not `name` — verified).
- Mobile: all hubs render single-column on mobile and grid up at `sm`/`lg` breakpoints.
- Channel matrix uses `Switch` per cell — works on touch (44px target).
- Recovery codes in MFA section are static demo values (do not persist).
- IP allowlist, API keys, webhooks are stored in local component state only (no backend) — refresh resets to seed values. Acceptable for demo.

Stage Summary:
- Settings + Support hubs COMPLETE for all 5 portals. 20 new pages + 1 shared module + 5 router updates + 1 nav-config update + 1 icon-registry extension. Lint clean for SETTINGS-SUPPORT files.
