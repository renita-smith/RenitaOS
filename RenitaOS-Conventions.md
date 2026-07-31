# RenitaOS — Palette & Interaction Conventions (canonical)

*Single source of truth for **color** and **system-wide interaction conventions** across every RenitaOS screen. Any screen — Capture, Triage, profiles, Home, Weekly Review — draws from this doc. When a screen's mock or code disagrees with this doc, this doc wins. Update here first, then propagate.*

---

## Base tokens

- **Text (olive):** `#2A3408`
- **Sage fill:** `#E7ECD6`
- **Deeper sage (open/active/hover state):** `#DBE2C1`
- **Monochrome olive icon:** `#3A4410`
- **Canvas / page background:** reuse Capture's existing background — do not invent a new one.
- **Radius:** `12px` cards, `4px` small controls.
- **Shape:** borderless soft rectangles.

---

## Domain colors

The six Domain colors are the **only full-saturation color in the app.** They are the app's one wayfinding color system — used as full-tile fills (e.g. tasks-by-domain bins) and anywhere a Domain needs to be identified at a glance. All six share the same dusty, muted, warm-leaning register so they cohere with the sage base; hues stay spread so the six remain distinguishable.

Text on a colored tile uses its **paired dark hex**, never black or gray.

| Domain | Identity | Fill | Text |
|--------|----------|--------|--------|
| RCBS  | green      | `#D6DDBE` | `#46552A` |
| RWS   | wheat      | `#EBDFC0` | `#6C5316` |
| SM    | terracotta | `#E8CDBE` | `#7C4A2E` |
| MTS   | pink       | `#EDD0D4` | `#7E4351` |
| EPLC  | slate      | `#D3D9D8` | `#465657` |
| PEEPS | mauve      | `#E0D7D3` | `#665049` |
| No domain | neutral | `#EEEEE7` | `#6A6A61` |

Notes on assignment: SM and EPLC both carry a "red and blue" identity; the pair was split — SM took the red (terracotta), EPLC the blue (slate) — so they stay distinguishable. EPLC's slate is warmed toward blue-grey to sit in the family; if strict blue identity ever matters more than cohesion, that is the one tile to revisit.

---

## Type colors

Type color is **ambient, not wayfinding** — it identifies far less than the Domain system does, because Types are already named and iconed. Rules:

- Type color appears **only** as the thin **left-edge stripe** on note cards (the restrained Capture treatment). Never a dot, never a filled chip.
- Type edges are drawn from the **same earth-tone family** as the Domain palette — muted, dusty, warm-leaning.
- **Do not** create a loud, maximally-distinct color for all ~13 Types. The name + icon identify the Type; the edge is a whisper. Related Types may share close tones.
- Every Type edge stays **quieter and more desaturated than the Domain tiles.** A Type edge must never compete with a Domain color or with the sage.
- Retire any bright/jewel-tone Type colors (e.g. an indigo Reflection edge) — re-tint into this family.

---

## Usage rules (system-wide)

- Color encodes **Domain**, first and loudest. Everything else is olive text on sage fills.
- Note-Type bins are uniform sage with a monochrome olive icon — **no colored dots.**
- On cards, only the Domain chip carries color; Type, People, and Tag chips stay olive-on-sage.
- The Domain tiles are the single most-saturated element on any screen. If something else is competing with them for attention, it's wrong.

---

## Typography & casing conventions

House style is **sentence case** everywhere by default (headings, labels, buttons,
messages) — e.g. "One bin at a time."

Intentional exceptions — do NOT "correct" these on consistency passes:
- **Dashboard-level screen titles are ALL-CAPS serif** — the `<h1>` naming the screen itself (TODAY, WEEKLY REVIEW, and INBOX before it) is a standard, not a one-off: it's how a *dashboard* (a screen that queries/derives a view, not a single record) reads as a place rather than a sentence. **Record profile titles stay natural case** — a Note/Task/Project/etc.'s title mirrors the record's own text and must never be forced to caps.
- The **"No Type"** bin label uses Title Case — it's a proper bin name, not a typo.
- The **"Sort"** pill (top-right, Triage) uses Title Case intentionally.

Serif vs. sans split:
- **Serif** is the app's "voice" — reflective/human messaging (subtitles, inbox-zero and
  bin-clear messages).
- **Sans-serif** is for UI data you scan rather than read — ALL numeric counts (per-bin
  counts, total counts, the nav inbox pill number, the "· N" beside an open bin header).
- Rule of thumb: prose is serif, data is sans.

---

## Adoption status (per screen)

- **Triage** — built to this palette from the start.
- **Capture** — ⚠️ **pending a color pass.** Capture predates this palette and currently uses off-family Type-edge colors (e.g. an indigo Reflection edge) and possibly older Domain tints. It needs to be re-tinted to match this doc. Because Capture is **live and accumulating real data daily**, treat this as a careful, non-urgent pass — bundle it with the other pending Capture polish (the dream-divider fix), and verify the live page after, don't destabilize it. Colors only; no behavior change.
- **Home** — inherits this palette when built.
- **Weekly Review** — ✅ **shipped to this palette** (Addendum 4). The standalone's `#f5f4f0`/Montserrat/purple-bar/act-tint/jewel-tone palette is fully retired; the screen is olive-on-cream with Domain tiles as the only saturated color, same as every other screen.

---

# Interaction conventions (system-wide)

These govern **every screen**, especially the entity profiles. They are not per-screen decisions.

## Cards everywhere

Tasks, Projects, Notes, and every other record render as **cards** — the same card vocabulary established on Capture and Triage. Not table rows, not bare list items.

## Pills — two types, one rule

> ⚠️ **Refined by the Profile-Phase addendum:** dates are **no longer value pills** — they live in the meta grid; value pills are Type / Status / Priority only. And on the **Task** profile the Domain pill is **navigate-only** (its domain is a read-only rollup through the project).

> ⚠️ **Further refined by Addendum 2 (Framed Layout):** on profiles, relation + value pills are presented in the **rail's Properties section** as a vertical list, not a header pill row. Pill *behavior* is unchanged; only placement moves.

Every pill is tappable. What a tap does depends on which of exactly two types it is.

**1. Relation pills → navigate + edit.** (Domain, Project, People, Tags, Collections, Resources.)
- The pill splits into two hit areas.
- **Tapping the label navigates** to that record's profile.
- **Tapping the trailing caret/chevron opens the picker** to change, add, or remove the relation.
- Discoverable, identical on desktop and mobile, no hidden gestures. (Long-press was rejected: undiscoverable, and desktop-hostile.)
- Only the **Domain** pill carries color (its domain's earth tone). All other relation pills are olive-on-sage.

**2. Value pills → edit only.** (Status, Priority, Type, dates.)
- No destination exists, so **the whole pill opens its picker.**
- Priority displays as stars rather than a color; color stays reserved for Domain.

There is no third type. Every pill in the app is one of these two.

## Breadcrumb + back

> ⚠️ **Superseded — see "Breadcrumb / ID line" in the Profile-Phase addendum (end of doc).** Profiles now *lead* with the record's Unique ID handle; hierarchical records append the path starting at the domain name (no "Domains" root). Browser-back history behavior below is unchanged.

Every **profile screen** carries a breadcrumb.

- **The breadcrumb shows hierarchy**, not history — *where am I in the structure* (e.g. `Domains › MTS › dWell Encounter`). It always renders, survives refresh, and never surprises on a deep link.
- **The browser back button handles history** — "the way back." Hash routing gives this for free, and it correctly handles deep links, refreshes, and loops (Domain → Project → Task → tap Domain pill → back).
- The two together cover both questions. Do **not** build a history-trail breadcrumb: an in-memory trail is wiped by refresh, has no answer for deep links, and renders loops as trails rather than paths.

## Tabbed relation-lists (profiles with many lists)

> ⚠️ **Refined by the Profile-Phase addendum:** load is **hybrid** (eager per-tab count *queries*, lazy list hydration) — counts do **not** come from rollup lengths; **zero-count tabs are clickable** to an empty state (not disabled); shipped rows are **dense bordered rows**, not full cards; the **Notes tab groups by Type**.

When a profile has **several parallel relation-lists** (Tag, Collection, People profiles), show them as a **segmented tab row**, one list at a time — never five lists stacked into a wall.

- **One tab per relation category**, each showing its **own count** (e.g. `Notes 12 · Projects 3 · People 5`). Counts come from the relation-list lengths (Notes from the `Total Notes` rollup).
- **Active tab** uses the standard active-state: filled deeper sage (`#DBE2C1`) + 1px olive keyline — same as Triage bins and the nav rail.
- **Empty tabs are shown greyed with a `0`**, never hidden. A tab row that changes length per record is disorienting; a stable set reads as structure. Selecting an empty tab shows a quiet empty state.
- **Default tab** = the highest-volume / primary relation (Notes for Tag and Collection profiles).
- **The list below is cards** — full Capture/Triage cards, each carrying its own pills (Type, Domain color, other tags, etc.). Not stripped-down list rows.
- **Mobile:** tabs **wrap** to multiple rows (not horizontal-scroll, which hides options off-screen).

This one component serves **Tag, Collection, and People profiles** — all three are "header + several relation-lists." Tabs per screen:
- Tag → Notes, Projects, People, Collections, Resources
- Collection → Notes, People, Tags, Projects, Resources
- People → Notes, Tasks, Projects, Collections, Tags

## Domain profile — hybrid (work spine + reference shelf)

> ⚠️ **Situated by Addendum 2 (Framed Layout):** this work-spine + reference-shelf body renders inside the **main column** of the framed three-zone shell; it is otherwise unchanged.

Domain profile is **not** pure tabs, because a Domain is a *container with internal hierarchy* (Projects contain Tasks), unlike a Tag (a cross-cutting label over unrelated records). Its structure must stay visible.

**Work spine — always visible in the main body:**
- **Projects grouped by Status**, each a **card summarizing its tasks** (e.g. "5 / 8 done"), tapping through to Project profile.
  - **In Progress** and **Not Started**: expanded, at top (the live work).
  - **Paused** and **Done**: **collapsed by default** as headers with counts (`Paused (2)`, `Done (7)`), expand on tap. Paused above Done (more likely to resume).
- **Direct Tasks** section below the projects — tasks where Domain = this **AND Projects is empty** (orphan tasks). Prevents the double-count (tasks inside projects are already summarized on the project cards).
  - ⚠️ **Corrected by the Profile-Phase addendum:** this filter is **void** — a task's domain is a rollup *through* its project, so a projectless task has no domain rollup and can never match "Domain = this AND Projects empty." **Loose tasks for a domain = the contents of that domain's catch-all `Inbox/Admin` project** (page IDs in Backend §4). Query domain → its projects → their tasks, never a task-level domain-rollup filter.

**Reference shelf — tabbed section below a divider:**
- Notes, Resources, Routines, Sessions — these *are* parallel and unrelated, so the tabbed pattern fits. Default tab = Notes. Sessions greyed/deferred.
- Uses the standard tabbed relation-list component above.

The domain's **color chip** shows beside the title (this is the one screen that *is* a domain).

Mobile: everything stacks in one column — projects, direct tasks, then the tabbed shelf.

## Status-collapse convention (system-wide)

Wherever records are grouped by Status (Domain profile's projects, Project profile's tasks):
- **Active statuses expanded** (In Progress, Not Started).
- **Finished / dormant statuses collapsed by default** with a count header, expanding on tap (Done everywhere; Paused on Domain profile's projects).
- Show the *live* state; keep the finished/parked work one tap away.

## Today / This Week / This Month (dashboard)

> ⚠️ **Superseded by Addendum 3 (Today dashboard as-built, July 27 2026).** The section below is the pre-build design; it shipped differently in several ways — a hybrid single screen (not three tabs), a first-class **Tomorrow** horizon, **drag/picker** slotting that writes a single `Time Slot` value (not additive tap-to-assign), a **Bank** column (not "Unassigned"), a **domain filter**, a **right-rail glance column** (agenda + week events + domain load), and **week-to-date** comparison. See Addendum 3 for what's actually live.

One screen, **three screen-level tabs** (Today / This Week / This Month). This is the *seeking* dashboard (vs. Home, which is *noticing*). Not a profile — it queries several sets and derives others.

**"Today" tab — running order:**
1. **Calendar** — filtered to the period.
2. **Plan of Action board** — the interactive core (below).
3. **Tasks panel** — the single place for all non-board tasks (below).
4. **Projects** — In Progress + Paused expanded (cards, status pill on each); **Completed collapsed** as `Completed (N)`, expanding on tap, **scoped to completed today**. (Status-collapse convention.)
5. **Notes** — notes with Date = today.
6. **Tags** — *derived*: tags on today's notes.
7. **People** — *derived*: people on today's notes/tasks/resources.

**Plan of Action board:**
- **Four columns:** Unassigned · Early Morning · Early Evening · Late Evening.
- Holds tasks where **`Do Date` = today OR `Due Date` = today** (plus overdue). A dated-but-unslotted task lands in **Unassigned** by default so it's always visible to assign.
- **Today / Tomorrow toggle** (top-right): flips the same four-column layout to tomorrow, so planning ahead is identical to planning today.
- **Tap-to-assign** (not drag) — tap a task, pick its slot(s) from a menu. `Time Slot` is multi-select, so a task can sit in **multiple** columns; the tap-menu adds rather than replaces.

**Tasks panel** (renamed from "Upcoming" — consolidated so there's one place to look):
- Sub-tabs: **Tomorrow · This Week · Completed.**
- **Default sub-tab = Tomorrow.**
- **This Week = the calendar week, Sunday through Saturday** (a fixed boundary, not a rolling 7 days — avoids tasks silently changing buckets each day). Week starts **Sunday**, matching the Weekly Review.
- Completed lives here as a sub-tab, not a separate section.

**This Week / This Month tabs — same pattern as Today, one zoom out. No Plan of Action board** (time-slot planning is daily only).

Running order for both: **Calendar → Tasks panel → Projects → Notes → Tags → People**, all scoped to the period, shown **together (not grouped by day)**.

- **This Week** — scope Sun–Sat. Tasks panel sub-tabs: **This Week · Next Week · Completed (This Week)**. Default = This Week. Period-to-period ("week to week") navigation.
- **This Month** — scope calendar month. Tasks panel sub-tabs: **This Month · Next Month · Completed (This Month)**. Default = This Month. Month-to-month navigation.
- Projects: In Progress + Paused expanded, **Completed collapsed** (`Completed (N)`), scoped to the period (completed this week / this month). Cards with status pill. (Status-collapse convention.) Notes/Tags/People derived and scoped to the period.
- Borrow period-navigation logic from the old Weekly Review dashboard.

The three screen-tabs form a consistent ladder — identical running order and card vocabulary; only the scope and the look-ahead sub-tab label change. Only **Today** carries the board.

**Mobile:** the four-column board becomes **stacked sections** (Unassigned, then each slot as a vertical list), tap-to-assign unchanged. All other sections stack in one column.

**Build note:** Today is the **heaviest screen in the phase** (3 queries + 2 derivations + Time Slot writes). Build it **after** the entity profiles, so the cards and drill-downs it composes already exist.

## Desktop navigation

> ⚠️ **Superseded by Addendum 2 (Framed Layout & Rail).** Rail set is now Home · Today · Inbox · Explore · Search (Domains dropped; Capture is a persistent affordance, not a tab), and the rail sits inside the framed cream panel.

On desktop, the shell provides a **persistent left navigation rail** (Home, Capture, Triage with its inbox count, Today, Domains, Search). It collapses to the existing top/bottom bar on mobile. Every screen — profiles included — renders inside this frame.

## Profile layout grammar

> ⚠️ **Superseded by Addendum 2 (Framed Layout).** The stacked hero → pill-row → meta-grid → body layout is replaced by the framed three-zone shell (nav rail · main column · properties rail; right-rail order Progress → Dates → Properties). The completion checkbox and body-content notes below carry over.

- **Title as hero**, in the editorial serif voice. Where a record has a completion action, a **checkbox sits to the left of the title**, aligned to its first line — matching the checkbox position on Triage cards.
- **Pill row** beneath it: relation pills first, then a divider, then value pills.
- **Two-column meta grid**: **editable dates on the left** (Due Date, Do Date, Completed), **read-only system timestamps on the right** (Created, Last Edited — muted, never editable).
- **Body last**, as rich content.
- Mobile: rail → top bar, pills wrap, meta grid → single column. Nothing structural changes.

## Completion (tasks)

There is **no separate Done checkbox field** in Notion. The hero checkbox *is* the Status control.

- **Checking it writes two things silently:** `Status = Done` **and** `Completed = today`. No dialog, no prompt, nothing blocks the tap.
- **Unchecking reverses both:** Status returns to Not Started, `Completed` is cleared.
- The checkbox and the Status value pill are **two views of one field** and must stay in sync — checking the box flips the Status pill to `Done` in place.
- **`Completed` is editable, not a timestamp.** It is user data, unlike `Created` / `Last Edited`. It lives in the meta grid's editable left column with a date picker, so a catch-up day (marking something done that finished days ago) just means tapping the date and correcting it.
- **On completion, the `Completed` pill briefly highlights** — a quiet nudge showing where the date landed, never a prompt. Ignoring it is the normal path.
- Completed state renders quietly: subtle strikethrough or muted title tone. No celebration.

---

# Addendum — Profile Phase conventions (July 2026)

*Added after the entity-profile build (Note, Task, and the tabbed trio Tag / Collection / People). Where this addendum conflicts with a section above, **the addendum wins** — the affected sections carry inline ⚠️ flags. Fold these into the body text on the next full edit.*

## Unique ID handles (reference system)

Every referenceable database carries a Notion **Unique ID** property. The ID is the app's canonical **reference handle** — the thing you jot in a notebook, search, or link to (`notion.so/{PREFIX}-{n}` resolves to the record). It is separate from the display title, which is now free to just be readable.

- Prefixes — one per database, distinct, uppercase: **NOTE, TASK, PROJ, DMN, RESC, COL, TAG, PSN.**
- Read the ID from Notion's `unique_id` property and format `{prefix}-{number}`. **Read the prefix from the property — never hardcode it.**
- **Render verbatim with a plain ASCII hyphen (U+002D)** — never an en/em-dash. The displayed string must be copy-paste identical to Notion's, or the `notion.so/` link and ID search break. Muted monospace.

## Breadcrumb / ID line (supersedes "Breadcrumb + back")

The top-of-profile line **leads with the record's ID handle**, and appends the structural path only where real hierarchy exists:

- **Flat records** (Note, Tag, Collection, Person, Resource, Domain): ID handle only, no path — e.g. `NOTE-247`.
- **Hierarchical records** (Task, Project): ID handle, a `·` separator, then the path **starting at the domain name, not a "Domains" root** — e.g. `TASK-88 · MTS › dWell Encounter`; Project → `PROJ-x · MTS`. Path segments are links; the ID is a label.
  - A Task's domain comes from the **project's Domain rollup**, not a task field. A **projectless task collapses to ID only.**
- Browser back still handles history (unchanged). The path segments are the only navigational links in the line.

## Ghost-field frame (empty relations)

A profile shows its **full field frame** — every relation the record type can carry, whether populated or not.

- Empty relations render as **labeled ghost pills**: dashed border, muted text, leading `+` naming the field (`+ Project`, `+ Person`, `+ Tag`, `+ Collection`, `+ Resource`, `+ For` on tasks).
- Populated relations render as solid pills.
- **Rendering the ghost is read-side; the tap-to-add action is edit-side** (deferred to the edit slice). Until then a ghost is just a visible empty slot.
- Effect: a sparse record reads as "ready to fill," not half-built.

## Dates live in the meta grid, not the pill row (refines "Pills" + "Profile layout grammar")

> ⚠️ **Superseded by Addendum 2 (Framed Layout).** Dates now live in the **rail's DATES section**, not a two-column meta grid. The editable/read-only split and the calendar glyph carry over.

Dates are **not** value pills. The pill row's value pills are the non-date selects only — **Type, Status, Priority.** All dates live in the two-column meta grid:

- **Editable dates** (Date on Note; Due Date, Do Date, Completed on Task) in the left column, each carrying a small **calendar glyph** marking it editable-and-distinct from the read-only timestamps.
- **Read-only timestamps** (Created, Last Edited) in the right column, muted, no glyph.
- A single editable date is **vertically centered** against the read-only stack so it doesn't sit stranded.

## Task Domain pill is read-only (refines "Pills — relation pills")

On the **Task** profile only, the Domain pill **navigates but does not edit** — no caret/picker. A task's domain is a rollup through its project; you change it by changing the project. This is the one relation pill that is navigate-only; every other relation pill keeps navigate+edit.

## Tabbed relation-lists — hybrid load + counts (refines "Tabbed relation-lists")

Notion has no native "what points at me," so back-references are found by querying each referencing database filtered on its relation to this record (`relation contains {this page id}`), **resolving that relation by target-database, never by name.**

- **Load strategy: eager counts, lazy lists.** On open, run a lightweight **count query per tab** and render every tab's count immediately. Hydrate a tab's full record list only when it is opened; cache it. (Replaces "counts come from rollup lengths.")
- **All tabs always shown**, including `0`. **Zero-count tabs stay clickable** and open to a quiet empty state (not disabled) — the count is how you see a tab is empty before clicking.
- Counts are **as of load** (single-user; a refresh re-runs them).
- Rows are **dense bordered rows**: title (serif) + ID handle (muted mono) + a domain chip where the record has a resolvable domain. Whole row navigates. *(This shipped instead of the earlier "list below is cards" intent.)*

## Notes-tab grouping by Type

On the **Notes tab** of any tabbed profile, group rows by Type (reusing the Inbox by-type vocabulary):

- A **multi-Type note appears under each of its Type groups** (intentional double-count — no primary-Type logic).
- Group subheaders show the Type emoji + name + group count.
- The **tab count stays the distinct-note count**; group counts may sum higher. A caption ("N notes · counted under each type") reconciles the mismatch.
- **Notes-tab-only** treatment; other tabs stay flat lists.

## By-type ordering (house rule)

**Everywhere records group by Type** (Inbox bins, the Notes-tab grouping, and any future by-type view): render Type groups in the **Notes database's Type-option schema order, with "No Type" always last.** Not by count, not alphabetical — schema order, so a type always sits in the same place.

## Desktop Inbox (renamed from Triage)

The screen and route formerly "Triage" are now **Inbox** (`#/inbox`; `#/triage` aliases to it). Everywhere this doc says "Triage" as a screen name, read "Inbox." (The `INBOX` all-caps heading and `Sort` pill casing are unchanged.)

- **Rail nav item:** `Inbox (N)` — the count in **parentheses on the rail only**; the screen's "N waiting · One bin at a time." subtitle keeps the count as plain prose.
- **Bins layout is breakpoint-split:** desktop (≥768px) shows bins as a chip row across the top, under the Notes/Tasks toggle, with the selected bin's cards full-width below. Mobile keeps the **vertical stack** (one bin per row). The Notes/Tasks toggle sits **above** the bins (it determines which bins exist).
- **Bins wrap freely (Inbox/Weekly Review Retrofit, July 31 2026)** — on desktop the bin row wraps to **as many rows as needed**, bin open or not; a bin-open state used to collapse it to a single non-wrapping horizontally-scrolling row to leave more room for the opened bin's card list, which hid most bins off-screen (confirmed with the real ~17-Type Notes schema). Retired: **wrap freely, all bins visible beats a hidden few — not a hard two-row cap.**

## Rail treatment (lightened)

> ⚠️ **Refined by Addendum 2 (Framed Layout & Rail).** The rail now sits inside the framed cream panel on the deeper page, and the nav set changed (see Addendum 2). The active-state treatment below is unchanged; the greyed-placeholder list (Today / Domains / Search) is replaced by the new set.

The nav rail sits **on the cream canvas — not a filled sage slab.** Nav items are plain olive text; only the **active** item gets the deeper-sage pill + olive keyline (the standard active state). Greyed placeholders for screens not yet built (Today, Domains, Search). Nav type ~15px, tight vertical rhythm. The bins/cards are the only sage masses; the rail recedes. On a record profile, no rail item is active.

## Titling cascade (revised — Backend §11–12 now stale)

Note auto-titling no longer prefixes type/date codes (the Unique ID now carries reference). Cascade, stop at first match:
1. **Task** → the task's own text.
2. **Dream** → `DRM | MMDDYY` (from the Date field). Day-merge behavior unchanged.
3. **Typed `[title]`** → used verbatim (bracket rule unchanged).
4. **Otherwise** → plain body snippet (first ~5 words). **No type prefix, no date, no `—`.** MLT / NTE fallbacks retired.
5. **Empty** → "Untitled".

Regeneration: non-Dream snippet titles no longer track Type/Date; Dream titles regenerate on Date change; a typed/hand-edited title is never overwritten. **Forward-only** — existing titles untouched. **Backend doc §11–12 still describes the old cascade and should be reconciled.**

---

# Addendum 2 — Framed Layout & Rail (July 19 2026)

*The app-wide profile **shell**. Supersedes "Profile layout grammar", "Desktop navigation", and "Dates live in the meta grid"; refines "Pills" and "Rail treatment". Body grammars (Project Tasks|Notes tabs, Domain work-spine + reference shelf, status-collapse, tabbed relation-lists) are unchanged and render **inside** this shell.*

## Framed page-on-panel (supersedes "Profile layout grammar")

The app renders as a **lighter cream content panel (`#F6F2E9`), lifted with a soft shadow, on a deeper page background (`#E7E0D0`).** The panel is **centered and capped at a max-width** (~1200px starting point, tune by eye) so the deeper page shows as a **side frame** — the margins are the *page* color, which is what makes them read as a frame rather than blank canvas. On wide monitors the margins grow; the content does not sprawl.

This replaces the old stacked "hero title → pill row → two-column meta grid → body" layout.

## Three-zone shell

Left **nav rail (~150px)** · **main work column** (the record's body) · right **properties rail (~230px)**. The rails are fixed-ish widths; the main column takes the space between (task cards are intentionally not too wide).

**Right rail, top to bottom: Progress → Dates → Properties.**
- **PROGRESS** — the rollup bar + `N of M done`, where the record has one.
- **DATES** *(supersedes "Dates live in the meta grid")* — `Start Date`, `Target Deadline`, the **contextual third row** (Archived → `Date Archived`, else Done → `Date Completed`, else Paused → `Date Paused`, else hidden), then `Created` / `Last Edited` (muted). Editable dates keep the calendar glyph.
- **PROPERTIES** *(refines "Pills")* — the relation + value fields as a **vertical labeled list**: Domain (colored), Priority (stars), Status, People, Collections. **Relations live here, not a header pill row.** Pill *behavior* is unchanged — relation pills navigate + edit (label + caret), value pills edit-only — only their placement moves to this rail.

**"Meta grid" anywhere else in this doc now means the rail's DATES section** (e.g. the `Completed` date in "Completion (tasks)").

**Mobile:** the two rails stack — Progress / Dates / Properties move above or below the body — the main column runs full width, and the task grid drops to one column.

## Task-card grid (main column)

A profile's tasks render in the main column as a **two-column grid** on desktop — blockier, near-square cards (checkbox + serif title at top, date pinned at bottom); **single column on mobile.**

## Relation-pill caret (refines "Pills")

The relation-pill caret uses the treatment shipped on the Project profile (preferred over the earlier style) — canonical app-wide; older screens adopt it in the polish pass.

## Nav rail — set + placement (supersedes "Desktop navigation"; refines "Rail treatment")

Rail set: **Home · Today · Inbox (N) · Explore · Search.** **Domains is dropped** — its browse role is absorbed by Explore; Domain *profiles* are still reached via the Domain pill and breadcrumbs. **Capture is not a rail tab** — it is a **persistent capture affordance** (floating button or bar; treatment TBD). The rail sits **inside the framed cream panel**; the active item keeps the deeper-sage pill + olive keyline.

> ⚠️ **Updated by Addendum 4 (Weekly Review, as-built).** The canonical desktop rail set is now **Home · Today · Inbox (N) · Explore · Search · Weekly Review** — Weekly Review appended **last** (an occasional ritual, not daily wayfinding). The **mobile bottom tab bar is unchanged** (still the original five items) — Weekly Review is reached on mobile via a quiet text link in Today's header instead.

## Scope

Applies to **every profile type.** The **Domain profile is built to this shell from the start**; the **already-shipped Project profile is retrofit** to it in a later polish pass (batched with the caret standardization and the card grid). Profile/detail views use this frame; the Home and Today **dashboards** are separate screens and are not bound by it.

---

# Addendum 3 — Today dashboard (as-built) + app-wide standardization (July 27 2026)

## Today dashboard — as-built (supersedes "Today / This Week / This Month" above)

Shipped as a **hybrid single screen**, not three tabs:

- **Four horizons:** Today, **Tomorrow** (first-class, same treatment as Today), This Week, This Month.
- **Today + Tomorrow** = a **time-slot board**: a **Bank** column + three slot columns **Early Morning · Early Evening · Late Evening** (no midday slot — intentional). The board holds tasks whose Do or Due date = that day (**Do-Date precedence** for placement). A **Today/Tomorrow toggle** shows one day's board at a time — this keeps the drag surface stable and avoids two stacked boards.
- **Slotting:** **drag on desktop, picker on mobile.** Dropping a card into a slot column writes the `Time Slot` multi-select to that **single** value (normalized to one); dropping into Bank clears it. *(This replaced the earlier "tap-to-assign, additive, multi-column" design.)*
- **Overdue strip** above the board. Because the section is labeled, rows carry **no per-row "OVERDUE" badge** and **no separate "Reschedule" control** — the **date pill itself is editable** to reschedule.
- **This Week** = tasks **ordered by day** (Sun→Sat), **not** grouped under day headers; a **fixed Sun–Sat window** that rolls only on Sunday.
- **This Month** = project deadlines + tasks later in the month.
- **Header metric line:** `N planned · M done today · K overdue`.
- **Comparison metric:** week-to-date vs **the same point last week** (e.g. Wed compares Sun–Wed this week to Sun–Wed last week). The *displayed* window stays fixed Sun–Sat; only the metric is week-to-date. Month analog: 1st→today vs 1st→same-day-of-month last month.
- **Domain filter** (All + the six domains) filters the whole screen, keyed to the task's **project-rollup** domain — never a task-level field.
- **Right rail (the glance column):** the day's **calendar agenda** (follows the Today/Tomorrow toggle, read-only), **this week's events** (name · date), and **Domain load** with a **Week / Month toggle**. The calendar is read-only and degrades to "Calendar unavailable" if the feed fails — it never blocks the rest of the screen.
- **Pills:** Status/Priority render as **editable-looking pills** (not plain text); board cards are **compact** (name, priority, status, project — no redundant in-card column label, tightened pill spacing).

## Shared app chrome — one implementation, every screen

The **nav rail**, the **RenitaOS wordmark + version stamp**, and the **Capture affordance** are a **single shared component** rendered by both the dashboards and the `.shell` screens — never duplicated per layout. (Duplication caused drift: mismatched rail height, differing Capture buttons.) Capture's simplified nav is the **same rail component fed a reduced item set**. The Capture button is **one treatment app-wide** — the filled dark-olive **"+ Capture"** pill. This shared *chrome* is distinct from the profile `.shell` **grid** that dashboards are exempt from (Addendum 2 Scope): dashboards skip the grid but still use the chrome.

## Framed panel — vertical behavior (new; complements the max-width rule)

The cream panel **grows to fit its content on every screen**: min-height = viewport, then grows with content; the deeper page background sits behind it all the way down; content never spills past where the panel ends. Today is the reference; the `.shell` pages match it.

## Inbox — open-bin view

- The bin header (**name · count · Select**) sits on **one row**; the Select control is beside the bin name.
- That header **+ its divider is a sticky header**: cards scroll **under** the divider while the bin identity and Select stay pinned to the top.
- **Tight gap** between the bin header and the first card.
- **Bulk-select actions** (Tag / Status / Delete) sit **near the Select/Done button at the top**, sized like it but a different color — not in a bottom bar.
- The redundant top-right **"N to Sort" is removed**; the **"N waiting"** subtitle is the single count.
- **Row layout — shipped (Inbox/Weekly Review Retrofit, July 31 2026)**, Addendum 6's **action** row pattern: a fixed-width date-left spine, then the content cluster (title + mono handle inline, a one-line muted/ellipsized body snippet, then pills), then a wider right-aligned status column (Tasks only — Notes have no per-card status control, Refresh is how a note leaves Inbox, so their row's status column stays empty rather than showing a redundant "Inbox" everywhere). See Addendum 6 for the full spec and the per-surface palette split.

## Typography — enforced app-wide

The "Typography & casing conventions" rule (prose = serif, data = sans; sentence case by default, with **dashboard titles / No Type / Sort** as intentional casing exceptions) is now enforced across every screen. Page titles are **serif**; **dashboard titles render ALL-CAPS** ("TODAY", "WEEKLY REVIEW") — **INBOX** is the same pattern, in the serif voice, not sans (see the Typography & casing conventions section above).

## Infrastructure

The runtime plumbing — the `notion-proxy` Cloudflare Worker, its secrets, the multi-account Google Calendar auth, the repos, and the deploy flow — lives in **`RenitaOS-Infrastructure-and-Deployment.md`**. The right-rail calendar agenda reads through that Worker's read-only `/calendar/events` endpoint.

---

# Addendum 4 — Weekly Review (as-built)

*The standalone `WeeklyReview.html` ported into the app per the Weekly Review Build Brief. Where this addendum and the body text above disagree for this one screen, this addendum wins.*

## Layout — single-column ritual

Weekly Review is a **dashboard** — chrome yes (the shared nav rail / wordmark / Capture affordance), the `.shell` three-zone profile grid **no** (Addendum 2 Scope). This screen has no Today-style glance content (no agenda/domain-load column to fill), so the 230px right-rail column is **dropped entirely** for this one route and its width goes to the main content column instead — verified with an isolated layout measurement, not eyeballed: the grid math was already correct in an earlier pass, but reserving a column for Capture alone left it empty dead space below the button, which read as a layout bug even though the divider/content genuinely filled the (narrower) column they had. **Capture renders inline in the header** (top-right, matching where it actually sits on Inbox) but is **pinned to the same 230px width** Today's rail gives it — same button size as Today's, without reserving a column that has nothing else in it (same precedent as `.shell-topbar-actions .dmn-capture`'s own width pin). Everything else — the full three-act sequence (Review → Reflect → Plan), **including** Act 3's two-week calendar and six 1% goal boxes — runs top to bottom in the main column; the standalone's local two-up (calendar beside goals) didn't survive contact with a real two-week calendar grid and was retired in favor of a straight stack.

The title + week-nav + Capture header sticks to the top of the main column on scroll, flush (no offset gap for scrolled content to peek through above it) — same spirit as Inbox's own sticky bin header (Addendum 3).

Act headers are a numbered olive ring (1/2/3) + serif act title + muted serif subtitle over a hairline divider — no colored act bands (the standalone's blue/purple/green act tints are retired).

## Metrics — two tiers

- **Tier 1** (four headline numbers, sans, retrospective): Completed this week · Completion rate · Overdue · Notes to file (the live count of **Inbox-status** notes — Active notes are already-processed and live in the Review panel instead, not counted here).
- **Tier 2** (glance band): condensed one-row-per-In-Progress-project list ("N of M done", derived client-side from already-fetched task data, not a guessed Projects rollup) + six Domain tiles, laid out **two rows of three** (completions this week, a week-over-week ▲/▼ delta, and a quiet "dormant this week" treatment when a domain has zero completions **and** zero notes that week). A task whose project carries no resolvable domain buckets under a **"No domain"** label/tile (never a bare `?`), same as everywhere else in the app.

## Inbox / Review panels (Act 1)

Two panels replace the standalone's separate "Completed/Needing attention" split and Note Station, each with its own **Notes / Tasks toggle**:

- **Inbox panel** — unprocessed items needing a first pass. Notes track = Notes with Status = Inbox (Backend Notes §5's "unprocessed" marker); Tasks track = active tasks overdue or due this week.
- **Review panel** — the retrospective look-back. Notes track = Active-status notes; Tasks track = tasks completed this week.

The Tag Station stays a separate section below both panels, unchanged.

## Freeze-on-save + week-over-week

The metric window for a review week is Sunday 00:00 → **min(now, Saturday 23:59:59)** of that week. On Save, the window's stats are written into the record's frozen columns (`Completions`, `Notes Captured`, `Overdue %`, `Top Tags`, `Top Types`); re-saving refreshes them. **Live vs frozen:** the current in-progress week always renders live "so far" numbers; a past week with a saved record reads its frozen snapshot instead of recomputing. Text (reflection answers, outlook intention, 1% goals) is exempt from the freeze — always editable/savable regardless of the displayed week. Week-over-week top-line totals read **last week's frozen `Completions`** directly (no recompute; no delta shown if last week's record is missing); per-domain deltas recompute both weeks live off task data, since only one aggregate total is frozen.

## Reflection-as-note

On Save, a companion Note is upserted (never duplicated) as the week's complete reflection artifact:

- **Title (verbatim, never regenerated):** `Weekly Review Reflection — week ending {Mon D, YYYY}`.
- **Body:** the four reflection answers, then the Two-Week Outlook intention, then the six 1% goals (domain-labeled) — heading/paragraph block pairs, empty sections skipped.
- **Classification:** Type = Reflection · Domain = RCBS · Collection = Weekly Review · Status = Active.
- **Upsert key:** the Weekly Reviews record's own relation to Notes (a schema addition — see `RenitaOS-Backend-Notes-Template.md`); a null/missing relation falls back to matching Type = Reflection + Date = the week-ending Saturday, and self-heals that legacy note into the relation on save.

## Write-layer conformance

Task completion in-review and project priority both write the **canon** Status/`Completed`-date and Priority fields (real stars) — the standalone's old first-checkbox write is retired. The Inbox/Review panels' status writes use the real `status` property. A single **global domain filter** (Today's idiom) replaces the standalone's separate domain + project filter bars. Dates are local `YYYY-MM-DD`; rich text over Notion's 2000-char cap is chunked on write. Sessions metrics (`Sessions Count`, `Session Success %`) are left unwritten — no session data flows yet.

## Calendar

Silent, read-only, via the same `GET {PROXY}/calendar/events` Today's right rail already calls — no interactive Google auth, no per-session sign-in. Degrades to "Calendar unavailable" without blocking the rest of the screen.

---

# Addendum 5 — Find (as-built)

*Explore (browse) and Search (retrieve) shipped per `RenitaOS-Find-Build-Brief.md` as **one screen, one rail item — "Find"** — over one shared in-memory index. Each of the seven entity tabs is a small dashboard: **Insights** (descriptive — what's in here) over a **Library** (the full list). Where this addendum and the body text above disagree (including Addendum 2/3/4's rail-set mentions), this addendum wins.*

## Rail set — supersedes every earlier list

**Home · Today · Inbox (N) · Find · Weekly Review.** Every earlier "… Explore · Search …" rail set in this document (Addendum 2, Addendum 3, Addendum 4) is superseded — Explore and Search no longer exist as separate rail entries or routes. `#/find` is the route; `#/explore` and `#/search` alias straight through to it (old links, muscle memory). Find carries **no count** (it's not a queue). Mobile bottom bar drops from five items to four (Home · Today · Inbox · Find); Weekly Review stays desktop-rail-only per Addendum 4.

## Layout — single-column, same trade as Weekly Review

Chrome yes, the `.shell` three-zone profile grid no (Addendum 2 scope) — Find has no per-record right rail, so it takes the same single-column trade Weekly Review does (Addendum 4): the 230px column is dropped, and Capture rides inline in the header, pinned to that same width. A single **search bar** and the **global domain filter** sit in that sticky header, screen-level (not per-tab); the seven-tab row lives in the body below it.

## The index — one build, shared by every tab and every Insight

On screen entry, all seven browse databases (Notes, Tasks, Projects, Tags, People, Collections, Resources) plus Domains (resolution-only — id → code/color map, never its own tab) are fetched in parallel, each paginated to completion. The result is cached at module scope for the page session — switching tabs, typing in the search box, toggling the domain filter, and every Insight all read that one in-memory index, never Notion again, until a quiet **Refresh** link re-runs the whole build.

Every cross-reference is resolved **locally**, never a second network round-trip per record:
- **Domain.** Notes/Projects read their own domain field/relation; a **Task's domain is the rollup through its first Project**, looked up in a project-id → domain map built once from the Projects fetch (not the per-task live lookup the Task profile's own resolver uses — that one exists for a single record, not an index of every task). Tags/People/Collections/Resources carry no domain.
- **"N of M done" (Projects).** Reads the completed-count rollup directly when the schema has it (the same rollup property the Project/Domain profiles already resolve for their own cards), falling back to `round(progress × total)` only when that rollup is absent.
- **Member counts (Tags Top-10, Collections Top-3).** Every database that carries its own relation property pointing at Tags/Collections (the same reverse-relation set the Tag/Collection profile's own reference shelf already reads) is tallied once over pages already in memory.
- **Reverse lookups** power the Tags/People pills and People's Recent Activity Insight: which Notes relate to a given Tag or Person, and which Projects relate to a given Person — all built by walking the already-fetched pages once, not queried per row.

## Screen frame — search bar, tab row, the takeover

A single search bar, pinned in the sticky header, ~180ms debounced, reads the cached index only (no network per keystroke). Below it, the seven-tab row. **Empty bar** → the active tab's Insights + Library render in the body. **Non-empty bar** → unified results (grouped by entity type) replace that body, and the *same* tab row becomes **scoping chips**: clicking a tab narrows results to that entity's full ranked list; a "Search everything" chip (shown only once a scope is set) clears back to the unified view. A fresh search always starts unified, regardless of whichever tab was active in browse mode. Clearing the bar restores the tab's Insights+Library.

## The seven tabs — each a Search → Insights → Library dashboard

**Library** (every tab): a flat, dense-bordered row list built on **Addendum 6's rail-less "navigation" row pattern** — a fixed-width **date spine on the left** (`created_time`, compact "Jul 12", year appended only when it isn't the current year), then the content cluster (title + handle, then a pills row carrying the domain chip alongside **entity-specific pills**, olive-on-sage; a Task's Priority renders as the shared `renderPriorityValue` stars, never a colored pill), with the **right side left open** rather than stretched to the panel edge. No body snippet on these rows — Find is navigated by title/handle, not a body preview, and that treatment stays Inbox's own "action" row pattern (Addendum 6, shipped in the Inbox/Weekly Review Retrofit). The domain chip is the only colored element on the row — and resolves to **no chip, never a literal "undefined"**, when a record has none. **Sorted by `created_time`, newest first, on every tab** — this replaced the earlier per-type Notes grouping; the Type breakdown now lives in Notes' own Insight instead. Zero-count tabs stay clickable to a quiet empty state.

**Insights** (per tab): a compact band above the Library, either the **chart primitive** (below) or a plain serif-title/muted-sans-metric list (no pill background) — either way quiet enough that it never outshouts the Library or competes with the domain chips for color. **"Recently Added" was removed from every tab** — redundant once the Library itself is already sorted by date added; the tabs that lost it were refilled with a chart instead. Per tab:

| Tab | Insights | Library pills |
|---|---|---|
| Notes *(default)* | **Notes by Type** (sorted bar chart, two-column, zero-count Types excluded) · Top 5 Tags (list, by Note count) | Type(s) + Tags |
| Tasks | **Tasks by Domain** (sorted bar chart, single column, domain-colored, via project rollup) | Status + Priority (stars) + Project |
| Projects | **Projects by Domain** (sorted bar chart, single column, domain-colored) | Status + "N of M done" |
| Tags | **Top 10 Tags** (sorted bar chart, two-column) · Recent Activity | up to 5 most-recent distinct Note-Types |
| Collections | **Top 5 Collections** (list, by member count) + Recent Activity, side by side in a **two-column panel** — the one tab where both Insights fit comfortably that way | — (base row only) |
| Resources | **Resources by Type** (sorted bar chart, two-column; falls back to Recent Activity only if the Type field can't be resolved) · Recent Activity | — (base row only) |
| People | Recent Activity only | Note-Types + Project |

**Recent Activity** (Tags/Collections/Resources/People — a shared definition, not four separate ones): the records that *carry this entity's relation* (a Tag's related Notes/Projects, a Resource's referencing Notes, a Person's related Notes/Tasks — whichever source databases actually carry that relation), ranked by whichever of `created_time`/`last_edited_time` is more recent, ~5 compact links (title + date, navigates). Always the full **global** set — never domain-filtered, same as every other cross-cutting Insight (§7 below).

### The chart primitive — one sorted bar chart, not two shapes

Every breakdown Insight is **the same primitive**: a sorted horizontal bar chart, one labeled bar per category, length scaled to the largest count, ranked descending, count labeled. *(An earlier draft tried a single-color stacked "load bar" — modeled on Weekly Review's own Domain-load component — for Notes/Tasks/Projects/Resources; it was retired: a single-color stacked bar can't separate its own segments. One labeled row per category fixes that — the label distinguishes categories, the length carries magnitude, no color is needed to tell them apart.)*

- **Sort by count descending** — a deliberate exception to the schema-order house rule, which governs *navigational* groupings (Inbox bins, note-Type groups) for stable placement; a magnitude chart's whole job is rank, so it sorts.
- **Two-column, column-major** for the large sets (Notes by Type ~17, Tags Top-10, Resources by Type): rank reads top-to-bottom down column 1, then top-to-bottom down column 2 — not left-to-right. Bars share one scale across both columns. One column on mobile, same rank order, stacked.
- **Single column** for the short sets (Tasks/Projects by Domain, 6–7 rows).
- **Notes by Type / Resources by Type** exclude zero-count categories. **Tasks/Projects by Domain** show all six domains regardless of count (a stable shape, not a bar that reflows as counts change) plus a **"No domain"** bar when applicable — a resolution miss buckets there, never silently uncounted, never a stray `"undefined"`.
- **Color discipline:** **by-*domain* bars are domain-colored** (Tasks/Projects by Domain — this is wayfinding, the app's one saturated system; the "No domain" bar uses the canonical no-domain hex). **By-*type*/by-*tag* bars (Notes by Type, Resources by Type, Tags Top-10) stay single-color olive-on-sage** — Type and Tag color is ambient, never wayfinding; never rainbow these, since the labeled rows — not color — do the separating.
- Under a single-domain filter, a by-domain bar simply **collapses to that one domain's bar** — no special-casing, since the records feeding it are already domain-filtered before the chart ever sees them.
- **There is no donut phase.** An earlier draft planned SVG donuts as a Phase 1.5; that plan was deleted before any donut code was ever written — every chart on this screen is a bar, full stop.

("Status breakdown" is deliberately omitted from Tasks/Projects Insights — that lives on Today/Domain profiles; repeating it here would blur into evaluative territory, see the Home boundary below.)

## Domain filter

Same **All + the six** control Today/Weekly Review use. On the three domain-bearing tabs (Notes, Tasks, Projects) it scopes **both** the Library and the Insights (e.g. Notes' breakdown and Top-5-Tags recompute within the selected domain). The four cross-cutting tabs (Tags, People, Collections, Resources) have no domain — they keep their full list **and** their (always-global) Insights, with a quiet "not domain-scoped" caption, rather than going empty. In unified search, the same split applies: Notes/Tasks/Projects results are domain-filtered; cross-cutting matches still appear, captioned.

## Search — ranked, over the same index

Ranking within a group: exact title → prefix → title token/substring → fuzzy title (Levenshtein, threshold scaled to query length — the same table `js/similarity.js` uses for Capture's autocomplete, duplicated inline since this file stays a self-contained classic script) → a resolved-relation `metaBlob` match (title/types/status/domain code/relation names/handle) — tiebroken by recency (`created_time`, then `last_edited_time`). Unified results group Notes · Tasks · Projects, then Tags · People · Collections · Resources, capped ~5 per group with a "Show all N" that sets the same scope the tab-row chips do. A query shaped like `PREFIX-123` resolves straight to that record, skipping ranking, matched against handles already in the index (never a hardcoded prefix list). Search state (`q`/`domain`/`tab`) reflects into the hash via `history.replaceState` — never a `location.hash` assignment, which would re-fire the router and rebuild the index on every keystroke — so a search survives refresh and is shareable without any extra network cost.

## The Home boundary — descriptive, not evaluative

Find's Insights answer *what is in here*: composition (breakdown by Type), prominence (Top-N by member count), freshness (Recently Added / Recent Activity). Home's still-deferred layer answers *what needs attention*: drift, dormancy, on-this-day, pulses, comparison-to-baseline. These don't overlap, and shipping Find's Insights does not pull Home's scope forward — an "insight" that starts judging neglect or change-over-time belongs to Home, not here.

## Phase boundary

**Phase 1 (shipped):** Insights as the one sorted bar-chart primitive and lists, per the table above; no body-text search — the index's `body` slot exists on every record but stays empty; matching is title + `metaBlob` only. **No Find row ever shows a body snippet** — a permanent decision, not a Phase-1 gap (that treatment is Inbox's own "action" row pattern, Addendum 6).
**Phase 2 (not built):** body-text search only — Notes first, hydrated on demand or as an idle background build (not eagerly on entry, since no Find row snippet couples hydration to first paint), `last_edited_time`-keyed incremental cache, a results-only match excerpt on a body hit.

*(There is no donut phase — an earlier plan was deleted before any donut code was ever written.)*

---

# Addendum 6 — Rail-less layout (system-wide rule)

*Introduced while building Find, but the rule is not Find-specific — it governs every screen that renders **no right rail** (Find, Inbox, and Weekly Review's mini-inbox now; Home once built — see the Roadmap). Where a screen's own addendum (e.g. Addendum 5) describes a row shape, this addendum is what that row shape is built on.*

## The problem it fixes

On a screen with no right rail, a single content column expands to fill the whole panel, and row metadata (a date, a status) gets pinned to the **panel's own far edge** — splitting each row into a barbell: a left cluster, a dead valley, and a stranded edge cluster. The rail was never what made a screen read as finished; **filled, column-aligned content** was. Content stretched full-bleed reads as unfinished; the same content in aligned columns with a used middle reads as polished. (This is the same root cause behind Weekly Review's sparse lower sections, e.g. its Domain-load bar — see the Roadmap.)

## The rule — a shared content measure, plus a choice of two row shapes

**Content measure + right gutter** (every rail-less screen): the content column takes the full panel width **minus `--railless-gutter`** (a modest reclaim — smaller than Today's ~230px rail, so the width stays *used* rather than handed away as void). Content stays **flush-left**, on the same left edge as Today and the nav rail. The gutter is a right margin on the content column itself, never a centered/narrowed panel — narrowing the panel would shift the left edge and break that alignment. `--railless-gutter`, the derived `--content-measure` (`calc(100% - var(--railless-gutter))`), and `--railless-date-col` (the fixed-width date spine both row patterns below share, sized for the longest date form a row will show) are defined once, in `:root`, alongside the framed panel's own `--dmn-max-width` (Addendum 2/3's max-width rule) — shared tokens, not hand-tuned per screen.

**Two row patterns**, chosen by whether the row has an *action* — both put the date on a fixed-width **left spine** rather than pinned to the panel's far edge, which is what actually fixes the barbell (metadata stranded at the edge, a dead valley in the middle):

- **Navigation rows (Find's Library)** — date spine, then the content cluster (title + handle → a pills row: domain chip + type/status pills). **Right side stays open** — a clean, deliberate margin, capped to a reading measure rather than stretched to the panel edge. **No status control, no body snippet** — the record is reached by title/handle, not triaged from the row, so there's nothing to put on the right and no body preview worth the pull.
- **Action rows (Inbox screen + Weekly Review's mini-inbox — shipped, Inbox/Weekly Review Retrofit, July 31 2026)** — same left date spine + content cluster, but the content cluster adds title + **mono handle** inline, then a **one-line body snippet** (muted sans, ellipsized) beneath it, then pills; the row gains **one right-aligned status column** (`--action-status-col`, 150px) — sized wider than a stray pill so it reads as a deliberate column, caret at its right edge. The snippet/pills fill the middle (recognition/triage context); the status column is where the row's actual action lives. **Notes carry no status column content** — a note's Status is always "Inbox" for the whole row list it appears in on the Inbox screen (Refresh, not a per-card control, is how it leaves), so that column is simply reserved-but-empty there rather than showing a redundant repeated value; Tasks and the Weekly Review mini-inbox's own Status dropdown both populate it for real.

**General principle:** any *sparse* element — a lone bar, a single stat line — column-aligns or sits within the measure, rather than spanning the full panel width. Apply this same read wherever a screen has a thin, mostly-empty full-width row (Weekly Review's Domain-load bar is the next candidate — see the Roadmap).

## Action-row container: sage cards vs. borderless rows (per-surface, deliberate)

The action row's *internal* layout (date spine + content cluster + status column) is identical on both surfaces it ships on — only the **container** differs, by design, per the Inbox/Weekly Review Retrofit brief:

- **Inbox screen** (`#/inbox`, active triage — each item a discrete thing you act on) — the action row renders **inside a filled sage card**: fill `#E7ECD6` (the canonical sage-card fill, matching Weekly Review's tiles — this is what "the bins/cards are the only sage masses" above actually means for this screen; it had drifted to a near-white cream that washed out against the cream panel behind it on desktop, now corrected), dark olive left edge unchanged. Every inner pill/ghost lightens to `#F1F0E4` so it still separates now that the card itself is sage, not cream — sage-on-sage would otherwise vanish. Domain chips are unaffected (already carry their own inline color). The Tasks-only status control gets a lighter fill plus a visible border (`.tg-status-chip`) so it reads as a tappable control, not just another value pill.
- **Weekly Review mini-inbox** (the `INBOX N` / Notes·Tasks note-filing section embedded in the dashboard — a section inside a dashboard, lighter) — the action row renders on **existing borderless rows**: no card fill, no green/olive edge. Un-barbelling here is pure repositioning (date left, status right), not recoloring.
- **Find's Library** — the sibling **navigation** row pattern (no status column, no snippet), also borderless on cream. Never gets the sage-card treatment.

Three inbox-family surfaces, three deliberately different containers — not drift to fix silently. Nita's framing: *Inbox screen = filled sage cards (active triage); WR mini-inbox = borderless rows (a dashboard section); Find = borderless rows on cream (navigation).*

## Adoption status

- **Find** — shipped (Conventions Addendum 5), the **navigation** pattern: date-left spine, content cluster, open right margin, no snippet ever (a permanent decision — see Addendum 5's Phase boundary).
- **Inbox screen + Weekly Review mini-inbox note rows** — shipped (Inbox/Weekly Review Retrofit, July 31 2026), the **action** pattern: date-left spine + title/handle + snippet + a wide right-aligned status column, sage cards on the Inbox screen, borderless on Weekly Review (see the container section above). Weekly Review's mini-inbox snippet required a bounded body fetch (Status=Inbox notes only, same size class as the Inbox screen's own backlog) added alongside this retrofit — Weekly Review previously loaded no note bodies at all.
- **Home** — inherits whichever pattern fits when built; no retrofit needed, just build to it from the start.
- Profile/detail views keep the `.shell` three-zone grid (Addendum 2) and are unaffected — this rule is about rail-less screens only.

## Bug fixed in passing

A record's domain must resolve to **`null`, never the literal string `"undefined"`** — per §1/§7 of the Find brief (task domain via project rollup, else null), a resolution miss renders **no chip**, not a stray "undefined" one. Guarded both where the domain is resolved (coalesce to `null`, not an object with an undefined `.code`) and where the chip renders (check for a real `.code`, not just a truthy object).
