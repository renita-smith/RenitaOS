# RenitaOS — Build Handoff & Library/Execution Roadmap

*Where the build stands, and the sequenced plan for the next phase. Resume in a fresh chat from here. Colors always defer to `RenitaOS-Palette.md`; behavior specs defer to the relevant screen spec; schema defers to `RenitaOS-Backend-Notes-Template.md`.*

---

## Where the build stands

- **Capture** — done and live. Now served at `capture.html` (moved off root during the shell promotion).
- **Shell** — done and **live-verified**. Now the root `index.html`. Hash router (`#/home`, `#/capture`, `#/triage`), persistent nav in the canonical tokens, and the live inbox pill (the Capture→Triage connector) all confirmed against real Notion data.
- **Triage** — in progress. Design finished and exported; Code is wiring the **read/display slice** (populate bins + cards, compute processed, read-only). Remaining Triage slices after reads verify: inline chip editing (writes) → Refresh + status writes + undo → Select mode + bulk actions. See `RenitaOS-Triage-Build-Spec.md`.

**Promotion housekeeping — done:** shell is root `index.html`; Capture is `capture.html`. Still pending later: folding Capture from a standalone page into a shell *view* (a route like Triage), so every screen lives in one frame. Not urgent.

---

## Remaining arc (high level)

1. Finish Triage (the write slices) → capture loop complete; Capture + Triage run daily.
2. **Shell responsive pass** — make the shell frame responsive *before* the screen builds below, so they're built into a responsive container instead of retrofitted. See Responsive layout policy.
3. **Library & Execution screens** ← the detailed plan below.
4. Weekly Review — port the old standalone dashboard into the shell as a route + reskin to the palette (mostly done already).
5. Home — last; the "surface by exception" dashboard, needs a populated system.
6. Fold Capture into the shell as a view; add the additive **Compose** and **Search** screens whenever wanted (non-blocking).

---

## Library & Execution phase — sequenced build order

The phase splits along doing vs. thinking: **Execution** works the work spine (Domains → Projects → Tasks); **Library** works the knowledge web (Notes, Collections, Tags, Resources). Within each, entity views **nest** (leaf → rollup → hub), so build the leaf first — its drill-down destinations must exist before the screens that link into them.

Build the execution block first (finish the work spine), then the library block. Each screen is **reads-only against real Notion, verified live before moving on** — the sandbox can't reach the Worker, so you confirm each one, same pattern as the shell and Triage reads.

### Execution block (the doing side)

**1. Task view (entity)** — *Light.*
The full record behind a task; the "open full record" destination and the universal drill-down target for the screens below. All fields, Project + Domain relations, linked notes, status. Reuses card vocabulary from Triage. Build first because it's small and everything downstream links to it.

**2. Today** — *Medium.*
The daily driver: tasks due today + overdue, grouped for legibility. Reuses Triage's task cards; new work is local date filtering + overdue logic. Drills into Task view (now built). This is where you start *using* the system daily and generating real execution data — build it early for the dogfooding.

**3. Week** — *Light–Medium.*
Today on a wider window, viewable by day or Domain. Near-clone of Today plus a layout choice; borrows week-navigation logic from the old Weekly Review. Cheap follow-on while Today's patterns are fresh.

**4. Project view (entity)** — *Medium–Heavy.*
A project with its full task list, status, Domain, related notes/resources. **First real relational rollup** (all tasks whose Project relation points here) and first meaningful drill-down (into Task view). One of the three genuinely new pieces of the phase.

**5. Domain view (entity)** — *Heavy.*
A Domain's command center: its projects, open tasks, recent notes, and deep-work session stats. The richest execution screen and a hub you navigate *out* from — most relations converge here. Capstone of the execution block. (Sessions stats live here; see adjacents.)

*Optional, deferrable:* an **All-Tasks / backlog** list (filterable across statuses). Today + Project view may cover it; add later if needed.

### Library block (the thinking side)

**6. Note view (entity)** — *Medium–Heavy.*
The full note record; the "open full record" destination for notes and the reader for everything Capture and Compose produce. **The one genuinely new rendering challenge:** displaying rich Notion block content (headings, bullets, bold) as readable long-form, not flat fields. Build first in this block — the rest of the library drills into it.

**7. Collection view (entity)** — *Medium.*
A curated Collection as its set of notes/resources (a teaching series, a study). A rollup like Project view, but over the knowledge web. Drills into Note view.

**8. Tag view (entity)** — *Light–Medium.*
Everything under a Tag, cutting across Domains ("show me everything tagged #rest, wherever it lives"). A filtered list; drills into Note view. Close cousin of what the future Search screen generalizes.

**9. Resource view / list** — *Light.*
The Resources database surfaced — books, links, references — on their own and from the Domain/Collection they belong to. Straightforward list-and-detail.

---

## Where the new work actually concentrates

Most of this phase is **assembly over proven patterns** (the shell holds it; the Worker read pattern, property-resolution-by-type, and the card/chip vocabulary are all shipped). The genuinely new work is only three things — treat these as the spine of the phase:

1. **Relational rollups** — first in Project view, peaking in Domain view (many relations converging).
2. **Drill-down navigation** — the nested entity chain (Task ← Project ← Domain; Note ← Collection/Tag).
3. **Rich note-block rendering** — Note view (Notion blocks → readable long-form).

Everything else (Task view, Today, Week, Tag view, Resource list) largely reassembles what already works.

---

## Adjacent pieces — place, don't build fresh

- **Sessions** — the deep-work log already *writes* via the iOS Shortcut. Here it's just a stats *view*, most naturally inside **Domain view** (and/or Weekly Review). Not a standalone screen.
- **Routines** — surface in **Today** rather than as a standalone screen.

## Boundary note

*Viewing* a specific entity you navigate to is this phase. *Searching across* the whole corpus ("what have I studied most") is the deferred **Search** screen (Library/Workshop toggle) — not this phase. Tag view here is a filtered list for one tag, not global search. Building the entity views first teaches what Search needs.

---

## Responsive layout (system-wide policy)

The screens are mobile-first and currently render as a fixed centered column that stays narrow on desktop. Responsive desktop layout is built deliberately, at two levels — it does not arrive on its own.

**Shell frame — one pass, soon (before the screens below).** Make the shell responsive: on desktop, widen the content area and turn the top nav into a persistent **left sidebar** (a rail carrying the inbox pill); collapse back to a top/bottom bar on mobile. Doing this before the remaining screen builds means each one is built into an already-responsive frame instead of retrofitted.

**Each screen — mobile + desktop together, at build time.** Every remaining screen is specced and built with *both* layouts from the start (ask Design for both; have Code implement both). Adding the desktop layout at build time is marginal; retrofitting later reopens every screen. Do not build the phase mobile-only and defer one giant responsive pass to the end.

**Responsive ≠ everything stretches.** Use the width where structure benefits — Domain view's converging relations, Today/Week as columns, the Triage bin overview beside the open bin on wide screens. Keep reading-heavy screens (Note view, Capture, Compose) to a **bounded, comfortable column** — long line-lengths hurt readability. Each screen's desktop layout is an intentional call: some go multi-column, some just get a roomier column.

*Triage note:* Triage is being built mobile-first; its desktop layout comes as a follow-up slice after the mobile version's data is verified (layout sits on top of the same wiring).

---

## Working pattern (all screens)

- Reads first, then stop and verify live against real Notion before wiring any writes.
- Resolve Notion properties by type / target-database, not by hardcoded name (emoji-prefixed).
- Status is a Notion Status-type property. Keep parsing and dates local.
- Reuse the Worker request pattern exactly as Capture/shell use it. Never touch `capture.html`.
- Update the nav inbox pill whenever a screen changes what's in the Inbox.

## Source-of-truth docs & precedence

- `RenitaOS-Palette.md` — canonical color; **outranks all other files on color.**
- `RenitaOS-Triage-Build-Spec.md` — Triage behavior.
- `RenitaOS-Backend-Notes-Template.md` — Notion schema.
- This doc — status + roadmap.

## Capture polish list (careful batch, non-urgent)

Do when you're next touching Capture, verify the live page after — don't destabilize it:
- Insert a **divider** block between appended dreams (currently only a line break).
- **Palette color pass** — retint Capture's off-family Type-edge colors (e.g. indigo Reflection) to the canonical earth-tone family per the palette doc.
