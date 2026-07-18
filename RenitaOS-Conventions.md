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
- The **"INBOX"** screen heading (top-left, Triage) is an intentional all-caps label.
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
- **Weekly Review** — was an earlier standalone build with its own colors; re-skin to this palette if/when it's folded into the shell. Not urgent.

---

# Interaction conventions (system-wide)

These govern **every screen**, especially the entity profiles. They are not per-screen decisions.

## Cards everywhere

Tasks, Projects, Notes, and every other record render as **cards** — the same card vocabulary established on Capture and Triage. Not table rows, not bare list items.

## Pills — two types, one rule

> ⚠️ **Refined by the Profile-Phase addendum:** dates are **no longer value pills** — they live in the meta grid; value pills are Type / Status / Priority only. And on the **Task** profile the Domain pill is **navigate-only** (its domain is a read-only rollup through the project).

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

On desktop, the shell provides a **persistent left navigation rail** (Home, Capture, Triage with its inbox count, Today, Domains, Search). It collapses to the existing top/bottom bar on mobile. Every screen — profiles included — renders inside this frame.

## Profile layout grammar

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
- **Bins layout is breakpoint-split:** desktop (≥768px) shows bins as a **horizontal chip row** across the top, under the Notes/Tasks toggle, with the selected bin's cards full-width below. Mobile keeps the **vertical stack** (one bin per row). The Notes/Tasks toggle sits **above** the bins (it determines which bins exist).

## Rail treatment (lightened)

The nav rail sits **on the cream canvas — not a filled sage slab.** Nav items are plain olive text; only the **active** item gets the deeper-sage pill + olive keyline (the standard active state). Greyed placeholders for screens not yet built (Today, Domains, Search). Nav type ~15px, tight vertical rhythm. The bins/cards are the only sage masses; the rail recedes. On a record profile, no rail item is active.

## Titling cascade (revised — Backend §11–12 now stale)

Note auto-titling no longer prefixes type/date codes (the Unique ID now carries reference). Cascade, stop at first match:
1. **Task** → the task's own text.
2. **Dream** → `DRM | MMDDYY` (from the Date field). Day-merge behavior unchanged.
3. **Typed `[title]`** → used verbatim (bracket rule unchanged).
4. **Otherwise** → plain body snippet (first ~5 words). **No type prefix, no date, no `—`.** MLT / NTE fallbacks retired.
5. **Empty** → "Untitled".

Regeneration: non-Dream snippet titles no longer track Type/Date; Dream titles regenerate on Date change; a typed/hand-edited title is never overwritten. **Forward-only** — existing titles untouched. **Backend doc §11–12 still describes the old cascade and should be reconciled.**
