# Task ID: FDE-RESEARCH-UPDATE — FDE Specialization Roles Modernization

## Mission
Update the 6 Forward Deployed Engineer (FDE-FWD) specialization roles to match globally trending FDE roles for 2024-2025.

## Role Mapping (Old → New)
| # | Old Role | New Role | roleView | trackKey | Badge |
|---|----------|----------|----------|----------|-------|
| 1 | Software Engineer | **Full-Stack Engineer** | `fde-software-engineer` → `fde-fullstack-engineer` | `fde-fwd-software-engineer` → `fde-fwd-fullstack-engineer` | "Fullstack + Deploy" → "Full-Stack + Deploy" |
| 2 | AI Engineer | **AI Engineer** (kept) | `fde-ai-engineer` | `fde-fwd-ai-engineer` | "AI + MLOps" |
| 3 | Data Engineer | **Data Engineer** (kept) | `fde-data-engineer` | `fde-fwd-data-engineer` | "Data + Analytics" |
| 4 | Platform Engineer | **Cloud Engineer** | `fde-platform-engineer` → `fde-cloud-engineer` | `fde-fwd-platform-engineer` → `fde-fwd-cloud-engineer` | "Infra + Cloud" → "Cloud + Infra" |
| 5 | Solutions Engineer | **ML Engineer** | `fde-solutions-engineer` → `fde-ml-engineer` | `fde-fwd-solutions-engineer` → `fde-fwd-ml-engineer` | "Architecture + Design" → "ML + Ops" |
| 6 | Security Engineer | **Security Engineer** (kept) | `fde-security-engineer` | `fde-fwd-security-engineer` | "Security + DevSecOps" |

## Files Modified (5)

### 1. `src/components/layout/PublicNavbar.tsx`
- Updated the FDE-FWD program's `roles[]` array (first PROGRAM_GROUPS entry)
- Renamed 3 roles + replaced Solutions → ML Engineer
- Updated labels, view URLs, badges, and motive strings to reflect modern tech stacks (React/Node/GraphQL, AWS/GCP/Azure/Terraform, model deployment/MLOps)

### 2. `src/portals/public/_programData.tsx`
- Updated 3 entries in `ROLE_ROUTES` array (FDE-FWD section)
- Each entry's `roleView`, `trackKey`, `label`, `badge`, and `motive` updated
- trackKey values now exactly match PROGRAM_TRACKS keys (e.g. `fde-fwd-fullstack-engineer` ↔ `'fde-fwd:fullstack engineer'`)
- AI/Data/Security engineer entries kept as-is (only their `motive` was already aligned)

### 3. `src/data/programTracksData.ts` — biggest change
Updated all 6 FDE-FWD tracks in `PROGRAM_TRACKS`. For each track, updated:
- Object key (e.g. `'fde-fwd:software engineer'` → `'fde-fwd:fullstack engineer'`)
- `trackKey`, `badge`, `title`, `subtitle`, `description`, `specialization`
- `techStack` array — modern trending skills
- `highlights` array — exactly 4 items each
- `curriculum` array — 4 phases with 5-6 topics each, modern topics

**Badges assigned**: FDE-FSE (Full-Stack), FDE-AIE (AI, kept), FDE-DE (Data, kept), FDE-CE (Cloud), FDE-ML (ML), FDE-SEC (Security, kept)

### 4. `src/portals/public/PublicProgramRole.tsx`
Renamed keys in 3 lookup maps and updated content:
- **SALARY_BANDS**: 
  - `fde-software-engineer` → `fde-fullstack-engineer` (React/Node/GraphQL roles)
  - `fde-platform-engineer` → `fde-cloud-engineer` (Cloud Engineer / Cloud Architect / Cloud-Native / Infrastructure)
  - `fde-solutions-engineer` → `fde-ml-engineer` (ML Engineer 12-24, ML Platform Engineer 13-25, Model Deployment Engineer 11-22, MLOps Engineer 12-23 per spec)
- **WHO_SHOULD_JOIN**: same 3 key renames; content updated for Full-Stack (React/Node/GraphQL), Cloud (AWS/GCP/Azure/Terraform/K8s), ML (model deployment/MLOps/A/B testing)
- **TESTIMONIALS**: renamed `fde-software-engineer` → `fde-fullstack-engineer` (the only FDE-FWD entry; updated role names and quotes to mention React/Node/GraphQL)

### 5. `src/portals/public/PublicProgramDetail.tsx`
- Updated `CAREER_OUTCOMES["fde-forward-deployment"]` array:
  - "Forward Deployed Software Engineer" → "Forward Deployed Full-Stack Engineer"
  - "AI/ML Engineer" — kept
  - "Data Engineer" — kept
  - "Platform / DevOps Engineer" → "Cloud Engineer"
  - "Solutions Engineer" → "ML Engineer" (12-24 LPA — matches new ML salary band)
  - "Security Engineer" — kept

## Key Decisions
- **No router changes**: confirmed `src/portals/public/index.tsx` handles `programs/{roleView}` generically via `getProgramTrackByRoleView` — no hardcoded roleView references. Task rule #2 honored.
- **trackKey ↔ key consistency**: kept the existing convention where the object key uses `'fde-fwd:{specialization name}'` (e.g. `'fde-fwd:fullstack engineer'`) and `trackKey` uses `'fde-fwd-{kebab-case}'` (e.g. `'fde-fwd-fullstack-engineer'`). Both sides updated in lockstep.
- **ML salary bands** follow the spec exactly: ML Engineer 12-24, ML Platform Engineer 13-25, Model Deployment Engineer 11-22, MLOps Engineer 12-23.
- **Curriculum phases**: every phase has exactly 5 or 6 topics per spec rule #4.
- **Highlights**: exactly 4 items per track per spec rule #5.
- **FDE/FSE/DSAI/CDM programs untouched** per spec rule #1.

## Lint & Type Check
- `bunx eslint` on all 5 modified files → **0 errors, 0 warnings**
- `bunx tsc --noEmit` → **0 errors from any of the 5 modified files** (pre-existing errors in unrelated files: lms-data.ts, mock-data.ts, partner-data.ts, talent-solutions-data.ts, AdminTraining.tsx, CandidateProfile.tsx, LearnerProfile.tsx, websocket examples — none touched by this task)
- Dev server (`bun run dev`) — compiles cleanly, GET / 200

## Verification
- `grep` for old names (`fde-software-engineer`, `fde-platform-engineer`, `fde-solutions-engineer`, `fde-fwd-software-engineer`, `fde-fwd-platform-engineer`, `fde-fwd-solutions-engineer`) → **0 matches** anywhere in `src/`
- `grep` for old labels ("Forward Deployed Software Engineer", "Forward Deployed Platform Engineer", "Forward Deployed Solutions Engineer") → **0 matches** in `src/`
- `grep` for new names confirms presence in all 4 expected files (PublicNavbar, _programData, PublicProgramRole, programTracksData) with consistent roleView↔trackKey mapping.

## Issues Encountered
None. All edits applied cleanly via Edit/MultiEdit tools.
