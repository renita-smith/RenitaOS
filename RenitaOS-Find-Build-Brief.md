# RenitaOS — Find (Explore + Search) — Build Brief (as-built)

*The implementation contract for the combined browse/retrieve surface, kept in sync with the shipped screen. Explore (browse/push) and Search (retrieve/pull) ship as **one screen, one rail item — "Find"** — over one shared index. Each of the seven entity tabs is a small **entity-dashboard**: **Search → Insights → Library**. Pairs with `RenitaOS-Conventions.md` (Addendum 5 — as-built behavior/look; Addendum 6 — the rail-less row layout the rows are built on) and `RenitaOS-Backend-Notes-Template.md` (schema/IDs/values). This file is patched in the same pass as any Find revision, so brief and shipped screen never drift.*

*This is a **read-and-navigate** surface — **no writes.** Nothing here can corrupt a record; verification is "does it read, derive, filter, match, and navigate," not "did the write land."*

---

## 0. Goal & shape

The system writes records daily (Capture → Inbox → Today → Weekly Review) but has no way back to a record except remembering which project it hung off. **Find** closes that gap.

One destination, reached from the rail. **A single unified search bar is pinned at the top of the screen** (screen-level, not per-tab). Below it, a **seven-tab row**. Each tab, when search is empty, renders as a mini-dashboard: an **Insights** band (descriptive — what's in here) above a **Library** (the full list, dense rows, sorted by date added). **Typing in the bar takes over the body** with unified results grouped by entity type, and the *same* tab row becomes scoping chips; clearing restores the tab's Insights+Library.

**Search is the shortcut; browse is the thumb-through.** Search reaches information *without* paging through records; the per-tab Insights+Library is for when you *are* thumbing through.

Explore's "signal/insights" layer in the Roadmap sense (drift, dormancy, on-this-day, pulses) is **deferred to Home** — see §6. The Insights here are **descriptive, not evaluative**, and do not un-defer Home.

---

## 1. The index layer

Both faces — and every Insight — read from **one in-memory index**, built on entry, cached at module scope, shared. Never hit Notion per keystroke, per tab-switch, or per Insight; every Insight is a **local derivation** over this index.

**Fetch (parallel, fully paginated)** — all eight databases via `Promise.all`, each paginated to `has_more === false`:

| Purpose | Database | ID |
|---|---|---|
| Browse tab + index | Notes | `6340f2b86ac94447a8315f0ba87545e3` |
| Browse tab + index | Tasks | `33110b0375a880c18918ebac71592a35` |
| Browse tab + index + task-domain resolution | Projects | `33110b0375a88054b94bfda7c3e93ddb` |
| Browse tab + index | Tags | `1a39ff9fd10747ad9d418577707c012f` |
| Browse tab + index | People | `8d6efff49ade4c188a03a5203320644d` |
| Browse tab + index | Collections | `315a07b97c6b461f917f5b01f6730ccc` |
| Browse tab + index | Resources | `1801744784014ecdaf20a384006cd644` |
| Resolution map only (not a browse tab) | Domains | `33110b0375a88024b4f2c8e6beaca80e` |

**Per-record index entry:** `id`, `route`; `handle` (`{PREFIX}-{number}` off the record's `unique_id` property, prefix read live, ASCII hyphen only); `title` (the `type:'title'` property, per DB, never a hardcoded name); `createdTime`/`lastEditedTime` (`created_time`/`last_edited_time` — the Library sort key, the row's date-added, and the search recency tiebreak); `entityType`; `types` (Notes/Resources only); `status`; `priorityName` (Tasks); `doneRollup` (Projects — `{done, total}`); `domain` (resolved code+color, or `null`); relation-name arrays (`tagNames`/`peopleNames`/`collectionNames`/`projectNames`/`resourceNames`, whichever apply to that entity type); `metaBlob`; `body` (empty in Phase 1).

**Resolved locally, no extra queries:**
- **Domain** — Notes: own domain field (relation or select). Projects: own Domain relation. **Tasks: rollup through the first Project**, looked up in a project-id→domain map built once off the Projects fetch — never a task-level field, never a per-task lookup. Tags/People/Collections/Resources: no domain, stays `null`. A resolution miss is coalesced to `null` at the point of resolution (never an object with an `undefined .code`) **and** guarded again at render (`r.domain && r.domain.code`) — a miss renders **no chip**, never the literal string `"undefined"`.
- **Relation names**, via id→title maps built once per target database (Tags/People/Collections/Projects/Resources).
- **Member counts** (Tags/Collections) — every database that carries its own relation property pointing at Tags/Collections (the same reverse-relation set the Tag/Collection profile's own reference shelf reads) is tallied once over already-fetched pages.
- **Resources' Type field** — resolved generically by property `type` (`multi_select` or `select`) + a "type" keyword match (never a hardcoded name); if unresolvable, the Resources tab's by-Type chart is simply omitted (see §3).

**Counts** are `.length` over the index under the active filter — no count queries. **Refresh** is a quiet affordance that rebuilds the whole index (Notion has no cheap change-feed; nothing here fakes live sync).

---

## 2. Screen frame

- **Search bar** — screen-level, pinned in a sticky header, spanning the content column (full content-area width on mobile). Debounced ~150–200ms, reads the in-memory index only.
- **Tab row** — the seven tabs (§3). Active tab = filled deeper sage `#DBE2C1` + 1px olive keyline. Wraps on mobile, never horizontal-scrolls.
- **Empty bar** → the active tab's Insights + Library render.
- **Non-empty bar** → unified results (§4) replace the body; the tab row becomes **scoping chips** — click a tab to narrow to its full ranked list; a **"Search everything"** chip (shown once a scope is set) clears back to unified. A fresh search always starts unified regardless of the prior browse tab.
- Page title serif ("Find"); all counts/numbers sans; sentence case throughout.

---

## 3. The seven tabs

### Canonical Library row (all tabs)

Built on **Conventions Addendum 6's rail-less "navigation" row pattern** — a fixed-width **date spine on the left**, not a right-aligned metadata column:
- **Date spine** (fixed width, `--railless-date-col`, left edge): **date added** (`createdTime`, compact "Jul 12", year appended only when it isn't the current year) — every title starts flush at the same left edge regardless of how long the date renders.
- **Content cluster** (immediately right of the date): title (serif) + handle (muted mono, ASCII hyphen) → a **pills row** carrying the **domain chip** (the only colored element on the row) alongside **entity-specific pills** (olive-on-sage; a Task's Priority renders as the shared star glyph, never a colored pill).
- **Right side stays open** — capped to a comfortable reading measure rather than stretched to the panel edge. **No body snippet, no right-hand status column** — Find is navigated by title/handle, not a body preview, and pulling bodies for every browse row isn't worth it. This is deliberately **not** the same row shape Inbox uses (see Addendum 6's second, "action" row pattern — date-left + a snippet + a wide right-aligned status column, still unbuilt).

**Library sort: `createdTime`, newest first, on every tab** (flat — no more per-Type Notes grouping; that breakdown now lives in Notes' own Insight). Respects the active domain filter on domain-bearing tabs (§7). Zero-count tabs stay clickable to a quiet empty state.

Domain hexes: RCBS `#D6DDBE`/`#46552A` · RWS `#EBDFC0`/`#6C5316` · SM `#E8CDBE`/`#7C4A2E` · MTS `#EDD0D4`/`#7E4351` · EPLC `#D3D9D8`/`#465657` · PEEPS `#E0D7D3`/`#665049` · none `#EEEEE7`/`#6A6A61`.

### Insights (per tab)

A compact band above the Library — a **chart primitive** (below) or a plain list, always quiet enough to never outshout the Library or compete with the domain chips for color.

| Tab | Insights (in order) | Library pills |
|---|---|---|
| **Notes** *(default)* | **Notes by Type** (sorted bar chart, two-column, zero-count Types excluded) · Top 5 Tags (list, by Note count, navigates to the Tag profile) | Type(s) + Tags |
| **Tasks** | **Tasks by Domain** (sorted bar chart, single column, domain-colored, via project rollup) | Status + Priority (stars) + Project |
| **Projects** | **Projects by Domain** (sorted bar chart, single column, domain-colored) | Status + "N of M done" |
| **Tags** | **Top 10 Tags** (sorted bar chart, two-column) · Recent Activity | up to 5 most-recent distinct Note-Types |
| **Collections** | **Top 5 Collections** + Recent Activity, side by side in a **two-column panel** (list, by member count) | — (base row only) |
| **Resources** | **Resources by Type** (sorted bar chart, two-column; if the Type field can't be resolved, this chart is omitted and the tab shows Recent Activity only) · Recent Activity | — (base row only) |
| **People** | Recent Activity only | Note-Types + Project |

**"Recently Added" does not exist anywhere on this screen** — it was removed as redundant once the Library is already date-sorted; the slots it used to fill on Tasks/Projects/Resources were refilled with the charts above, and Notes/People/Tags/Collections were refilled per the table.

**Recent Activity** (Tags, Collections, Resources, People — one shared definition): the records that **carry this entity's relation** — for Tags/Collections, whichever of Notes/Projects actually relate to it; for Resources, Notes that reference it; for People, Notes/Tasks that relate to it — ranked by whichever of `createdTime`/`lastEditedTime` is more recent (recently created *or* updated), ~5 items, rendered as compact links (title + date, navigates). Always the **full global set**, never domain-filtered (§7).

### The chart primitive — one sorted bar chart

**Every breakdown Insight is the same primitive: a sorted horizontal bar chart** — one labeled bar per category, length scaled to the largest count, ranked descending, count labeled. *(An earlier draft tried a single-color stacked "load bar" — retired: a single-color stacked bar can't separate its own segments. One labeled row per category fixes it: the label distinguishes categories, the length carries magnitude, no color needed.)*

- **Sort by count descending** — a deliberate exception to the schema-order house rule, which governs *navigational* groupings (Inbox bins, note-Type groups) for stable placement; a magnitude chart's whole job is rank, so it sorts.
- **Two-column, column-major** for the large sets (Notes by Type ~17, Tags Top-10, Resources by Type): rank reads top-to-bottom down column 1, then top-to-bottom down column 2 — not left-to-right. Bars share one scale across both columns. One column on mobile (same rank order, stacked).
- **Single column** for the short sets (Tasks/Projects by Domain, 6–7 rows including "No domain").
- **Notes by Type / Resources by Type:** exclude zero-count categories.
- **Tasks/Projects by Domain:** one bar per domain (all six shown, zero or not, for a stable shape) plus a **"No domain"** bar when applicable — a resolution miss buckets there, never left uncounted, never a stray `"undefined"`.

**Color discipline:** **by-*domain* bars are domain-colored** (Tasks by Domain, Projects by Domain — wayfinding, the app's one saturated system). **By-*type*/by-*tag* bars (Notes by Type, Resources by Type, Tags Top-10) stay single-color olive-on-sage** — Type/Tag color is ambient, never wayfinding; never rainbow these, since the labeled rows (not color) do the separating.

*(There is no donut phase. An earlier draft of this brief planned SVG donuts as a Phase 1.5; that plan was deleted before any donut code was ever written — every chart on this screen is a bar, full stop.)*

---

## 4. Search — unified retrieve

Non-empty query → unified results grouped by entity type, replacing the Insights+Library body.

**Group order:** Notes · Tasks · Projects, then Tags · People · Collections · Resources. Each group = header (entity name + match count) + a ranked list (cap ~5) + a **"Show all N"** that sets the same scope the tab-row chips do. Empty groups are omitted (unlike browse tabs, which always show).

**Ranking within a group:**
1. Exact title (case-insensitive).
2. Title prefix.
3. Title token/substring.
4. Fuzzy title — Levenshtein, duplicated inline from `js/similarity.js`'s own logic (this file stays a self-contained classic script), threshold **scaled to query length** rather than a flat ≤2 (which over-suggests on short strings).
5. `metaBlob` match (relation names/type/status/handle, not title) — lets "prayer" find a note tagged prayer even when the word isn't in its title, free since relations are already resolved.
6. *(Phase 2)* body match, lowest, carries a snippet.
- **Tiebreak:** recency (`createdTime`, then `lastEditedTime`).

**ID-handle fast path:** a query matching `^[A-Z]{3,4}-\d+$` resolves straight to that record, skipping ranking — matched against handles already in the index, never a hardcoded prefix list.

**Empty result:** quiet "No matches for '{query}'." (serif), not a blank pane.

**URL-reflected state:** `q`/`domain`/`tab` reflect into the hash via `history.replaceState` — never `location.hash=`, which would re-fire the router and rebuild the index on every keystroke. `tab` carries the active browse tab when idle, or the search scope while searching.

---

## 5. Body search — phase boundary

**Phase 1 ships without body text.** The `body` slot exists but is empty; search matches title + `metaBlob` only. This is a complete, shippable screen.

**No Find row ever shows a body snippet** — that's a permanent decision (§3), not a Phase-1 gap: the date-left cluster already un-barbells the row without one, and Find is navigated by title/handle. So Phase 2 is **search-only**, and simpler for it: with nothing in Find's browse view ever reading a body, hydration doesn't need to run eagerly on every screen entry — it can trigger **on demand** (the first time a search actually runs) or as an idle background build, rather than up front.

**Phase 2 adds body-text search** (not yet built):
- Scope Notes bodies first (the corpus with real body content).
- Hydrate **on demand or idle-background** (not eagerly on entry, since there's no row snippet coupling it to first paint).
- Fetch = block children per note (paginated), concatenating `plain_text` across text-bearing blocks, lowercased into `body`.
- Incremental cache keyed on `lastEditedTime` — rebuild re-fetches only notes whose `lastEditedTime` changed.
- Body matches carry a windowed, highlighted **results-only** match excerpt, ranked below title/`metaBlob` — this excerpt lives in the search results list, not in any Library row.

---

## 6. The Home boundary

Find's Insights are **descriptive**: *what is in here* — composition (breakdown by Type/domain), prominence (Top-N by count), freshness (Recent Activity). Home's still-deferred layer is **evaluative**: *what needs attention* — drift, dormancy, on-this-day, pulses, comparison-to-baseline. These don't overlap; shipping Find's Insights does not pull Home's scope forward. An "insight" that starts judging neglect or change-over-time belongs to Home, not here.

---

## 7. Domain filter

Global filter — All + the six — same control/placement as Today/Weekly Review, keyed to the **resolved** domain (Tasks via project rollup, never a task field).

- **Domain-bearing tabs (Notes, Tasks, Projects):** scopes **both** the Library and the Insights — a by-Domain bar chart under a single-domain filter simply **collapses to that one domain's bar**, no special-casing (the records feeding the chart are already filtered before the chart sees them).
- **Cross-cutting tabs (Tags, People, Collections, Resources):** no domain — full list + **global** Insights, with a quiet "not domain-scoped" caption, never empty/hidden. Resources by Type is domain-agnostic regardless (a Type breakdown, unaffected by the filter).
- In unified search: Notes/Tasks/Projects results are domain-filtered; cross-cutting matches still appear, captioned.

---

## 8. Chrome, route, rail

- Shared chrome (nav rail + wordmark/version + Capture affordance) with **one main column**, exempt from the `.shell` three-zone grid, same trade Weekly Review makes. Framed cream panel, grows to fit content, min-height = viewport.
- **Route:** `#/find`; `#/explore` and `#/search` alias through.
- **Rail:** `Home · Today · Inbox (N) · Find · Weekly Review`. Find carries no count.

---

## 9. Rules that carry over (read side)

- Title by `type:'title'` per DB, never hardcoded. Prefix from `unique_id`, never hardcoded; ASCII hyphen on render.
- Task domain = rollup through Project, resolved locally; projectless task = no domain, never `"undefined"`.
- Paginate every DB to completion; parallelize with `Promise.all`. Every Insight is a local derivation — no per-row/per-Insight queries.
- Dates: `createdTime` for sort/date-added; local `YYYY-MM-DD` where a date is displayed elsewhere in the app.
- No writes on this screen.
- Land-then-verify: the sandbox can't reach the Worker/Notion — verify live in the browser.
- Deploy discipline: confirm commits on `main`, a green Pages build, and the version stamp bumped.

---

## 10. Decisions ledger

**Locked (Nita):** one screen + one rail item; unified search; seven tabs, each a Search → Insights → Library dashboard; Library sort = `created_time`; rows show date added; Top-N by member count; Notes breakdown by Type; body search phased (P1 title+meta → P2 body).

**Revision changesets (accumulated):** "Recently Added" removed from every tab (redundant against the date-sorted Library); Tasks/Projects/Resources' emptied Insight slots refilled with charts; the donut phase is deleted — every chart is a bar; Recent Activity generalized into one shared cross-tab definition (Tags/Collections/Resources/People); the "undefined" domain-chip bug fixed at both the resolve and render sites; the stacked single-track "load bar" tried for Notes/Tasks/Projects/Resources was itself retired in favor of one consistent sorted bar-chart primitive (two-column column-major for large sets); Library rows moved the date from a right-aligned column to a **left spine**, and dropped the body-snippet slot entirely (permanent, not deferred) — Find never shows a row snippet.

**My calls (override any):**
- Name = "Find."
- Domain filter scopes Library + Insights on domain-bearing tabs; cross-cutting tabs stay full + captioned.
- `metaBlob` search in Phase 1 (relation-name matches, not just title) — free, relations are already resolved.
- ID-handle fast path and URL-reflected state.
- Home boundary = descriptive vs evaluative.
- One sorted bar-chart primitive for every breakdown Insight — no second "load bar" shape, no color unless it's wayfinding (by-domain).
- Collections stays a two-column Top-5 + Recent Activity panel (an explicit, direct call, not the "Top 3 (list)" a stale draft of this table briefly implied).

---

## 11. Land-then-verify checklist

- [ ] Index builds on entry; every browse DB paginates fully.
- [ ] Rows: correct handle, title, date added; row navigates; back returns to Find.
- [ ] **Library rows: date on the LEFT** (fixed-width spine, `--railless-date-col`, titles start at one edge), content clustered left of an open right margin — no right-hand date column, no snippet.
- [ ] No `"undefined"` chip anywhere — a record with no resolvable domain renders no chip.
- [ ] Seven tabs, correct counts; zero-count tab clickable to a quiet empty state.
- [ ] Library sort = `createdTime` desc on every tab.
- [ ] No "Recently Added" block remains on any tab.
- [ ] Notes by Type / Tags Top-10 / Resources by Type render as a **sorted bar chart, two-column column-major** (rank down column 1, then column 2), single-color olive-on-sage; Resources falls back to Recent Activity only if its Type field is unresolved.
- [ ] Tasks by Domain / Projects by Domain render as a **sorted bar chart, single column**, domain-colored, all six domains shown (zero or not) plus a "No domain" bar when applicable.
- [ ] Bars share one scale within a chart; only by-domain bars are colored — by-type/by-tag bars never are.
- [ ] Recent Activity present on Tags/Collections/Resources/People, ranked by most-recent of created/updated, ~5 compact links.
- [ ] Entity pills correct per tab; pills olive-on-sage; only the domain chip is colored; Priority as stars.
- [ ] Domain filter scopes Library + Insights on Notes/Tasks/Projects (a by-domain bar collapses to one domain's bar under a single-domain filter); cross-cutting tabs show the "not domain-scoped" caption.
- [ ] Search: ranking correct; `NOTE-###` jumps to the record; unified groups + "Show all N" open the right scoped tab; empty query restores Insights+Library; no-match state renders.
- [ ] Mobile: search bar spans full content width; tabs wrap; date spine narrows, content fills the rest; bar charts collapse to one column.
- [ ] Rail shows Find (no count); `#/find`, `#/explore`, `#/search` all resolve.
- [ ] Version stamp bumped on `main`; verified live in the browser.
- [ ] *(Phase 2, later — body search only)* results carry a match excerpt; no Find row ever grows a snippet, by design.

---

## 12. Doc reconciliation

- `RenitaOS-Conventions.md` — Addendum 5 (Find as-built) carries the current Insight table + the one sorted-bar-chart primitive + the descriptive/evaluative Home boundary; Addendum 6 documents the rail-less **navigation** row pattern (date-left, open right, no snippet) alongside the still-unbuilt **action** row pattern (Inbox/Weekly Review — date-left + snippet + a wide right-aligned status column).
- `RenitaOS-Roadmap.md` — Find Phase 1 (including every revision to date) is Done; Phase 2 is body search only, on-demand/idle hydration, no Find snippet; the Inbox/Weekly Review action-row retrofit stays a distinct Roadmap polish item; the donut phase has been removed from the record entirely, not just marked skipped.
- `RenitaOS-Backend-Notes-Template.md` — no schema change; notes that Find reads title/type fields structurally rather than by hardcoded name.
