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

Every **profile screen** carries a breadcrumb.

- **The breadcrumb shows hierarchy**, not history — *where am I in the structure* (e.g. `Domains › MTS › dWell Encounter`). It always renders, survives refresh, and never surprises on a deep link.
- **The browser back button handles history** — "the way back." Hash routing gives this for free, and it correctly handles deep links, refreshes, and loops (Domain → Project → Task → tap Domain pill → back).
- The two together cover both questions. Do **not** build a history-trail breadcrumb: an in-memory trail is wiped by refresh, has no answer for deep links, and renders loops as trails rather than paths.

## Tabbed relation-lists (profiles with many lists)

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
