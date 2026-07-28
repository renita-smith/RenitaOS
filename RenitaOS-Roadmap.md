# RenitaOS — Roadmap & Backlog

*Continuous record of what's built, what's next, and what's parked. Updated after the **Today / This Week / This Month dashboard, the multi-account Google Calendar integration, and the app-wide standardization passes all shipped** (July 27 2026). Pairs with `RenitaOS-Conventions.md` (rules — see **Addendum 3** for the dashboard as-built), `RenitaOS-Backend-Notes-Template.md` (schema), `RenitaOS-Infrastructure-and-Deployment.md` (runtime / plumbing / auth / deploy), and `RenitaOS-Edit-Slice-Build-Brief.md` (the edit-slice implementation contract + Appendix A/B fix log).*

*Legend: **Done** · **Next** (critical path) · **Deferred** (decided, unbuilt) · **Idea** (raised, not specced) · **Open** (needs a decision/check).*

---

## Where the build is (Done)

- **Today / This Week / This Month dashboard — SHIPPED** (as-built in Conventions Addendum 3). Hybrid single screen: four horizons (Today, **Tomorrow**, This Week, This Month); Today+Tomorrow carry a **time-slot board** (Bank + Early Morning / Early Evening / Late Evening) with **drag (desktop) / picker (mobile)** slotting that writes the `Time Slot` multi-select; overdue strip with editable date pills; This Week ordered-by-day; **week-to-date** comparison against the same point last week (fixed Sun–Sat window); **domain filter** (via project rollup); right-rail glance column = **calendar agenda + this-week events + domain load (Week/Month toggle)**. Bucketing/date math run off one Sunday-anchored module. *(Replaced the earlier 3-tab / additive-tap design.)*
- **Google Calendar — SHIPPED (read-only, multi-account).** The `notion-proxy` Worker gained a `/calendar/events` endpoint; one OAuth client (personal Gmail, External + In production) with a **refresh token per account** (MTS + personal live; SM addable). The Notion token was **rotated and moved out of the Worker code into a secret** in the same pass. Full detail in `RenitaOS-Infrastructure-and-Deployment.md`.
- **App-wide standardization — SHIPPED.** Shared app **chrome** (nav rail + RenitaOS wordmark + Capture affordance) extracted into **one component** used by dashboards and `.shell` screens alike (ended the rail/Capture drift); Capture nav = same rail with a reduced item set; framed panel now **grows to fit content** on every screen; typography convention (prose serif / data sans) enforced app-wide; Inbox open-bin view got a **sticky bin header**, Select beside the bin name, top-anchored bulk actions, and the redundant "N to Sort" removed.

- **Capture** — live. **Capture v2 shipped:** framed body + earth-tone palette, optional title field (hidden for task/project/multi-entry captures), bare-token capture (a lone `!Project` creates just the project, no stray note), multi-word symbol values, real Notion `divider` block between merged dreams, close (`×`) working, clickable "added to Inbox" toast, content-column width matched + full-height textarea. Bottom bar relabeled Triage → Inbox.
- **Inbox** (formerly Triage) — complete: full sort loop, bulk actions, delete/undo, chip-row layout, "Projects needing a domain" section (domainless-project safety net), and the page-scroll fix.
- **Framed three-zone shell — live app-wide** (Conventions Addendum 2): cream panel `#F6F2E9` on deeper page `#E7E0D0`, nav rail · main column · properties rail, capped at one shared `--max-width` (settled by eye in the retrofit). Global nav rail migrated to **Home · Today · Inbox (N) · Explore · Search** — Domains dropped; **Capture is a persistent affordance**, not a tab. On mobile the nav is a **bottom tab bar**.
- **Domain profile** — shipped (read + navigate), the first screen built to the frame and the composite: work spine (projects grouped by Status) + **INBOX/ADMIN** (the catch-all Inbox/Admin project's loose tasks) + tabbed reference shelf (Notes / Resources / Routines live; Sessions stubbed) + right rail (Capture → Progress → **Activity** → Log). Activity = pulse · 5-week completions spark (delegated hover) · Done · 30D · Overdue Tasks · Stalled projects (In Progress projects with zero completions in 14 days).
- **Framed-layout retrofit** — complete: **Project, Note, Task, and the Tag / Collection / Person trio** all reframed into the shared shell; caret standardized; two-column task-card grid; global rail migrated; two-shell state ended (Inbox/Capture bodies not yet panel-wrapped — deferred).
- **Right-rail three-tier hierarchy** (all profiles) — classification selects (Type / Status / Priority) render as **pills below the title**; rail = **Progress → Dates → Properties (relations only) → Log** (Created / Last edited). Task's People relation relabeled **"People"** (was "For").
- **Mobile layout** — bottom tab-bar nav; each profile leads with the record (header + pills + body/tabs), then Dates → Properties → Log below; Domain keeps Progress/Activity above the work spine.
- **Profiles — now EDITABLE (edit slice + Step E/F shipped):** Note, Task, Tag / Collection / Person, Project, Domain — all framed, all ID-handled, all writable.
- **Edit slice — shipped & tested.** The shared write layer: `resolveOptionValue` (exact stored option strings incl. emoji; whitespace/case-normalized), relation + multi-select as paginated read-modify-write, local-`YYYY-MM-DD` dates. Value-pill edits (Status/Priority/Type), relation pickers + ghost-`+` adds, create-new relation targets (Tags/People/Projects, search→near-match→confirm→create shown together), create-in-context (Project from a Domain, Task from a Project), completion checkbox (`Done`+`Completed`, clearing Completed un-completes), editable dates, in-app archive, status-transition dates (`Done→Date Completed`, `Paused→Date Paused` + Pause Details, `Archived→Date Archived`) with a **DATES row that re-picks by precedence**, domainless-project safety net.
- **Step E — shipped:** inline title editing; type-prefix auto-titler (`{PREFIX} | snippet`, no date; Dream `DRM | MMDDYY`; typed titles verbatim, no prefix; creation-only, never regenerates except Dream-on-date-change); inline Status+Priority pills + Due-Date pill on task cards; checkbox excluded from card navigation; **mass-select in Project + Domain profiles** shown as a card border/ring (not a second checkbox); page icons on create (Project/Task/Person/Tag).
- **Step F — shipped:** in-app body block editing via `contentEditable` — edit a text block, append a line, toggle a to-do, delete a block (archive via `PATCH archived:true`); rich text for bold / italic / strikethrough / inline code / links, **plus color/highlight** (renders, applies via a toolbar swatch incl. a default/olive swatch, and round-trips on edit). Block-type creation/conversion (headings, lists, quotes) stays deferred to Compose.
- **Unique ID system** — live on all 8 databases (NOTE, TASK, PROJ, DMN, RESC, COL, TAG, PSN).
- **Schema — completed-count rollup added to Projects DB** (count of tasks with a `Completed` date); powers per-project "N of M done" and the domain-level task-weighted Progress aggregate. Projects DB also has `Date Archived`, `Date Paused`, `Pause Details` (Text).

---

## Critical path (Next)

*The writable-app arc **and** the Today dashboard (+ calendar) are **done**. Focus is now the remaining screens; Weekly Review is next.*

1. **Weekly Review** — port the existing standalone dashboard into the framed shell + reskin to the palette. Banked: the WREF reflection note, the 1% goal. Open: comparative-by-domain baseline, metric definitions, mid-week/pre-freeze behavior, past-week navigation. **Now unblocked on calendar:** the Worker-held refresh-token auth built for Today means the Weekly Review port can read Google Calendar **silently** (no per-session sign-in) — reuse `/calendar/events`; drop the old interactive Google sign-in.
2. **Compose / Home / Explore / Search** — see "Remaining core screens" below; sequence unchanged (watch whether daily long-form use pulls Compose earlier).

*(The Today dashboard, formerly item 1 here, is shipped — see "Where the build is.")*

---

## Remaining core screens (Deferred)

- **Compose** — long-form authoring surface. In Capture a blank line delimits separate notes; in long-form it must mean a paragraph break. Compose inverts that and writes a single note with real rich text. Distinct from the Note profile, which *displays* a body — Compose *authors* it. **Absorbs the deferred body-editing scope beyond the edit slice's block ops** (block-type creation/conversion — headings, lists, quotes, callouts — reordering, slash-commands, mid-document insertion). **Watch this one:** Nita does long-form in-app; if it becomes daily, Compose has a case to jump ahead of Home/Explore/Search (and possibly closer to Today).
- **Home** — built last; needs a populated system. The "noticing / surface-by-exception" dashboard (drift alerts, on-this-day, pulses), distinct from Today (seeking). Open: comparison baseline + metric definitions.
- **Explore** — the serendipity/browse surface. Two layers: (a) indexes — thumb-through lists of each entity type, reusing the tabbed dense-row list; (b) signal — surfaced insights. Build indexes first. Absorbs the old "Insights" ambition; the Domain profile already covers part of the browse-by-area need, so revisit Explore's scope after using it.
- **Search** — retrieval (you know what you want). The old Library / Workshop split. Distinct from Explore: pull vs push.

---

## Deferred subsystems (blocked or out-of-process)

- **Capture as a bottom-sheet modal** *(specced, low-risk, ride-later — the original vision).* Present Capture as a sheet that **slides up from the bottom over a dimmed backdrop**, rather than a full screen swap. The model already fits (Capture is a persistent affordance invoked from anywhere and dismissed back), so this makes presentation match model. Build: fixed-position overlay + semi-transparent **scrim** over the current page (not hard black) + short slide-up ease on open; **tap-scrim and `Escape` both dismiss** (map to the existing `×`/close action); **lock scroll on the page behind** so only the sheet scrolls. Two decisions to make when picked up: (a) whether the Home/Capture/Inbox **bottom bar stays inside the sheet** or the sheet simply closes back to the prior screen (leaning: close back); (b) **responsive form** — near-full-height sheet on phone, centered/bottom panel with scrim on desktop. Touches only how Capture mounts + one transition; does **not** touch capture logic, parsing, or writes. Est. ~an afternoon. Good low-risk warm-up before Today, or leave until the core screens are in.

- *(Capture v2 pass and Inbox / Capture panel-wrap **moved up** to Critical path → Next item 2.)*
- **Sessions views** — blocked on the logging iOS Shortcut (no session data flowing). Domain-profile session stats wait on it.
- **Goals DB integration** — out of scope for now.
- **Voice & Photo capture** — toggle exists; buttons are stubs; needs a transcription/OCR backend.
- **iOS Share-Sheet / Lock-Screen capture entry points** — the "out-and-about doors."

---

## Known issues / tech debt

- **Capture screen carets — VOID.** Verified with Code: Capture has no relation-pill picker, so there is no caret/chevron to restandardize (the only caret is `.pf-pill-caret` on profile relation pills). The old "pre-framed caret" note was a stale assumption. Palette retint is the real Capture-v2 cosmetic item.
- **Resolved this arc (edit slice + Capture v2):** read-only checkbox tap (excluded from card nav), dream divider (real Notion block), Capture palette retint, Inbox scroll, Do-Date whitespace 400, relation-property resolution, picker viewport overflow, DATES precedence render, task page icons — all shipped. See the Build Brief Appendix A/B for the full fix log.
- **Rich-text serializer — color now supported.** Earlier caveat (color dropped on edit) is resolved: color/highlight renders, applies via a toolbar swatch, and round-trips on edit. The remaining un-round-tripped items are block *types* (headings/lists/quotes/callouts), which the editor can edit but not create/convert — deferred to Compose by design.
- **Near-match threshold tuning** — Levenshtein ≤2 may over-suggest on very short tags; scale to word length.
- **Icon backfill migration (one-time) — DROPPED** (Nita's call; cosmetic only). Would set Notion page icons on *existing* Project / Task / Person / Tag pages lacking one. Revivable later.
- **Bookmarks / home-screen icon / iOS capture Shortcut** — repoint to the live app entry points.
- **Bookmarks / home-screen icon / iOS capture Shortcut** — repoint to the live app entry points.

---

## Open questions / schema checks

- **Loose tasks — RESOLVED:** a domain's loose tasks = its catch-all Inbox/Admin project contents (Backend §4); the "Direct Tasks (Domain = this AND Projects empty)" filter is **void**. (Worksheet §3 / Q9 corrected in the reconciliation.)
- **Task domain — CONFIRMED:** rollup through project; never filter tasks by a task-level domain field.
- **Schema — DONE for the edit slice** — Projects DB `Date Archived` (Date), `Date Paused` (Date), and `Pause Details` (Text — renamed from Pause Log; a hand-edited carry-forward note, not append-only) all exist. ✅ Completed-count rollup — DONE. ✅ **Notes user-title protection — RESOLVED** by optional-title / creation-only titling (no checkbox, no flag).
- **Framed shell max-width** — settled to one shared value in the retrofit; revisit only by feel.
- **Phantom Tags↔Projects — RESOLVED (no relation).** Worksheet "verify" flags reconciled out.
- **Titling for Note types — RESOLVED.** An optional title is used verbatim; when empty the auto-titler fills at creation only and never regenerates (sole exception: a Dream on Date change), which also settles the Type→Dream protection edge with no flag. The authored/ambient split is **advisory only** — an "add a title" nudge on **Sermon, Teaching, Study, Prophetic Word, Podcast, Quote** vs quiet on **Dream, Convo, Thought, Idea, Reflection, Reminder, Prayer, One on One, Download, Virtual**.
- **Pause Log mechanism — RESOLVED.** Renamed **Pause Details** (Text): a hand-edited carry-forward note of unresolved items / what to address to unblock — not an append-log, not a Status-Log DB.
- **Week-start = Sunday** — shared constant; apply to every "this week" computation so week math can't drift per screen.
- **Home comparison baseline + metric definitions** — needed before Home.

---

## Someday / latent

- **Per-tag visual distinction** — per-record Notion page icons; only if the uniform DB icon proves insufficient.
- **Notion integration rename to "RenitaOS"** — token still named "Weekly Review"; cosmetic.
- **All-Tasks / backlog list** — may fold into Explore indexes.
- **Note↔Task conversion in Inbox** — revisit only if common.
- **Paused projects expand-by-default** — currently collapsed like Done; revisit per usage.
- **Routines drillable to their own profile** — currently display-only in the Domain profile.
- **Demo instance (for a walkthrough video)** — a second dataset with the real structure but fictional data, so demos never expose real content. Approach: put all eight DBs under **one parent page** and duplicate **that page** (duplicating DBs individually breaks relations — a page-level duplicate remaps them within the copied set); share the copy with the existing integration; populate mock records. Code side: **centralize every Notion ID into one config object** and select it by URL (`?demo=1`) — one file, two datasets, never a forked copy of the HTML. **Gotcha:** IDs aren't only databases — Backend §4 hardcodes six **catch-all Inbox/Admin project page IDs** and six **domain page IDs**; grep for any 32-char hex not already in the config. Add a **visible demo banner** and have the version stamp report the active dataset. Bonus: doubles as a safe sandbox for destructive testing, retiring the throwaway-records-in-real-domains workaround. *(Alternative considered: intercept fetch and serve in-memory fixtures — fully deterministic and zero risk, but hours of authoring verbose Notion-shaped JSON across eight related DBs. Not recommended unless determinism matters more than setup time.)* Est. 1–2 hrs Notion setup + a contained config refactor. Spec it properly when picked up.
- **Bible Verses database** — a verses DB that teachings/sermons/studies relate to, with reverse lookup. Many-to-many + the existing relation-list read pattern. Key decisions when picked up: on-demand verse creation, granularity (single verse vs passage range), reference parsing. Large; not scoped.
