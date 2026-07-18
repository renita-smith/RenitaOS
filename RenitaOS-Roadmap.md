# RenitaOS — Roadmap & Backlog

*Continuous record of what's built, what's next, and what's parked. Assembled from the profile-phase sessions plus a backlog sweep of the earlier build chats (Capture, Triage, profile-design). Supersedes scattered chat notes. Pairs with `RenitaOS-Conventions.md` (rules) and `RenitaOS-Backend-Notes-Template.md` (schema).*

*Legend: **Done** · **Next** (critical path) · **Deferred** (decided, unbuilt) · **Idea** (raised, not specced) · **Open** (needs a decision/check).*

---

## Where the build is (Done)

- **Capture** — live, sealed. Titling revised (see below) and the Type-write regression fixed.
- **Inbox** (formerly Triage) — complete: full sort loop, bulk actions, delete/undo, plus the desktop chip-row layout, the Triage→Inbox rename, and the lightened rail.
- **Shell** — desktop left-rail (lightened, on-canvas), responsive to the mobile bar.
- **Profiles — READ + NAVIGATE only (no writes yet):** Note, Task, and the tabbed trio Tag / Collection / People. All ship with ID handles, the ghost-field frame, and hybrid-load tabs per the Conventions addendum.
- **Unique ID system** — live on all 8 databases (NOTE, TASK, PROJ, DMN, RESC, COL, TAG, PSN).
- **Docs** — Conventions addendum written (this handoff).

---

## Critical path — finish the profile phase (Next)

1. **Project profile** (read + nav) — status-collapse for its tasks.
2. **Domain profile** (read + nav) — the composite: work spine (projects-by-status + loose tasks) + tabbed reference shelf. Reuses the tabbed component and status-collapse. **Use the corrected loose-tasks definition** (catch-all `Inbox/Admin` project contents, not the void "Direct Tasks" filter).
3. **Edit slice** — the first writes across *every* profile: relation pickers, ghost-pill add actions, value-pill pickers (Type / Status / Priority), the Task completion checkbox (`Status = Done` + `Completed` write), and editable dates. Everything is read-only until this lands. **This is the single biggest deferred chunk and it gates real profile usefulness.** The exact-option-string rule (match the emoji-prefixed option, never a bare name) will matter again here.
4. **Today / This Week / This Month dashboard** — heaviest screen (3 queries + 2 derivations + Time Slot writes). Build after profiles + edit, so the cards and drill-downs it composes already exist.

---

## Remaining core screens (Deferred)

- **Weekly Review** — port the existing standalone dashboard into the shell + reskin to the palette. Banked: the WREF reflection note, the 1% goal. Open: comparative-by-domain baseline, metric definitions, mid-week/pre-freeze behavior, past-week navigation.
- **Compose** — long-form authoring surface. *Reason it must exist:* in Capture a blank line (double-return) **delimits** separate notes; in long-form it must mean a **paragraph break**. Compose inverts that rule and writes a single note with real rich text (paragraphs first, then headings/bullets/bold, Craft-like). Distinct from the Note profile, which *displays* a body — Compose *authors* it.
- **Home** — built last; needs a populated system. The "noticing / surface-by-exception" dashboard (drift alerts, on-this-day, pulses), distinct from Today (seeking). Open: comparison baseline + metric definitions.
- **Explore** — the serendipity/browse surface (arriving without a target). Two layers: **(a) indexes** — thumb-through lists of each entity type (all notes, all tags, all projects…), reusing the tabbed dense-row list; **(b) signal** — surfaced insights (trending tags, what's active, on-this-day, "what have I studied most"). **Build indexes first, signal second.** Absorbs the old "Insights" ambition.
- **Search** — retrieval (you know what you want and go get it). The old Library / Workshop split (Notes = thinking vs Tasks/Projects = doing). Distinct from Explore: pull vs push.

**Dependency note:** the Domain profile is itself a browse-by-area surface and may absorb part of Explore's need. Revisit Explore's indexes-vs-signal scope *after* Domain lands.

---

## Deferred subsystems (blocked or out-of-process)

- **Sessions views** — blocked on the logging iOS Shortcut (no session data flowing yet). Domain-profile session stats wait on it.
- **Goals DB integration** — goals not yet in the workflow; Goal relations on Projects/Domains out of scope for now.
- **Voice & Photo capture** — the toggle exists but the buttons are stubs; needs a transcription/OCR backend.
- **iOS Share-Sheet / Lock-Screen capture entry points** — the "out-and-about doors" that point at the live App URL.

---

## Known issues / tech debt

- **Capture dream-divider (§12)** — appended dreams are separated by a line break only; want a subtle divider block. Bundle in a careful Capture pass.
- **Capture palette retint** — Capture predates the earth-tone palette; off-family Type-edge colors (e.g. indigo Reflection) need re-tinting. Colors only, verify live. Bundle with the dream-divider.
- **Near-match threshold tuning** — Levenshtein ≤2 may over-suggest on very short tags; scale to word length; watch in use.
- **Backend doc §11–12 (titling)** — now stale vs the revised cascade; reconcile the doc.
- **Doc-reference cleanup** — after the Palette→Conventions rename, any doc referencing "the palette doc" needs the new name.
- **Optional back-catalog retitle** — the ~2 weeks of notes with old `REF071026 —`-style prefixes keep their titles (the fix is forward-only). A one-time bulk retitle (dry-run first) is **optional** — the ID handle makes those notes just as findable, so this is cosmetic only.
- **Bookmarks / home-screen icon / iOS capture Shortcut** — repoint to `capture.html` (root now serves the shell).

---

## Open questions / schema checks

- **Tags↔Projects relation** — verify the exact property name/emoji on both the Global Tags DB and the Projects DB before wiring anything that traverses it.
- **Week-start = Sunday** — define once as a shared constant, apply to every "this week" computation (Tasks panel, Week tab, Weekly Review nav) so week math can't drift per screen.
- **Home comparison baseline + metric definitions** — "this week vs what" (rolling average? last N weeks?) and exact metric defs — needed before Home.

*(Resolved this phase, logged so they aren't reopened: Task domain is a rollup-through-project only — settled Task + Domain domain handling; the route scheme, ID prefixes, ghost frame, dates-in-meta-grid, and tabbed hybrid-load are all decided and in the Conventions addendum.)*

---

## Someday / latent

- **Per-tag visual distinction** — the DB icon marks "this is a tag" uniformly; true per-tag icons would need per-record Notion page icons (+ maybe a DB template). Only if the uniform icon proves insufficient.
- **Notion integration rename to "RenitaOS"** — the token is still named "Weekly Review"; cosmetic.
- **Repo consolidation** — the existing weekly-dashboard app vs the RenitaOS repo; decide one app vs separate.
- **All-Tasks / backlog list** — a filterable view of every task; may be unnecessary if Today + the Project profile cover it. Likely folds into Explore indexes.
- **Note↔Task conversion in Inbox** — a cross-database move; revisit only if it proves common.
- **Paused projects expand-by-default** — currently collapsed like Done; revisit per usage.
- **Routines drillable to their own profile** — currently display-only in the Domain profile.
- **Cloudflare Pages migration (pre-merge previews) / local-serve testing** — deferred; staying on GitHub Pages merge-then-verify. Local-serve would need the Worker's CORS to allow the localhost origin.
