# RenitaOS — Compose Build Brief

*The executable contract for building **Compose**, the long-form authoring surface (sermons, studies, teachings). Compose is the next core screen after Home. Unlike Home and Find, Compose **writes** — it is the app's authoring home for long-form Notes, and it absorbs the body-editing scope deferred past the edit slice (block-type creation/conversion, slash-commands, markdown shortcuts, reorder, mid-document insertion). Pairs with `RenitaOS-Conventions.md` (behavior/look), `RenitaOS-Edit-Slice-Build-Brief.md` (the shared write layer + Step F block ops Compose extends), `RenitaOS-Backend-Notes-Template.md` (schema/IDs/titling), and `RenitaOS-Infrastructure-and-Deployment.md` (Worker/deploy).*

*Legend: **fixed** = decided, build to it · **default** = chosen value, override-able by feel · **open** = needs a call.*

---

## 0. Orientation

Compose is where long-form gets **authored**. The Note profile *displays* a body and does light block ops (edit text, append a line, toggle a to-do, delete a block — all shipped in Step F). Compose *authors* one — it adds the structural editing Step F deliberately left out.

**The core inversion (from Capture):** in Capture, a blank line **delimits separate notes**; in Compose, a blank line is a **paragraph break within one Note.** Compose always writes **exactly one Note** with real Notion blocks — never a split.

**Reuses, doesn't rebuild:**
- **Inline rich text** — bold, italic, strikethrough, inline code, links, **and color/highlight** — is already shipped (Step F) and round-trips. Compose reuses that serializer verbatim. Compose adds **block-level** structure on top of it, not new inline formatting.
- **The shared write layer** — `resolveOptionValue`, relation/multi-select paginated read-modify-write, local `YYYY-MM-DD` dates, delete = archive, block endpoints (`PATCH /v1/blocks/{id}`, `PATCH archived:true`, block-append). Compose is a new *surface* over the existing write plumbing.

**Compose is not a profile and not read-only.** It shares the app chrome but is its own writing body, and it writes to Notion.

---

## 1. Where Compose sits — chrome, layout, route, entry

- **Shared chrome, not `.shell`.** Compose renders the one shared chrome component (nav rail + wordmark/version + Capture affordance) and is **exempt from the profile `.shell` three-zone grid** — like the dashboards. No rail item is active while composing (same as a profile).
- **Writing-first body.** A single generous **centered writing column** (measure ~560–640px, tune by eye): a big serif title, a compact collapsible **Details** strip beneath it, then the block canvas. Classification lives in the Details strip, **not** a full properties rail — you classify without leaving the writing. This is the Craft-like "effortless composition" north star.
- **Route (hash, per app convention):** `#/compose` (new blank note) and `#/compose/{noteId}` (open an existing Note to keep authoring). A refresh on `#/compose/{noteId}` reloads that note.
- **Entry points (v1):**
  - **"Open in Compose"** on any Note profile — the durable path (Monday's sermon is Thursday's continuation).
  - **A "New" long-form action** surfaced where work starts (Find and/or Home). Creates a blank Note and routes to `#/compose`.
  - **Deferred:** the Capture → Compose escalation ("expand to Compose") is a **separate later slice** — Capture is sealed (touched only as a deliberate isolated slice), so it is not bundled here.
- **Typography:** title, headings, body, and quote render in the **serif voice**; Details chips, slash-menu labels, save state, and all UI data are **sans**. Sentence case throughout.

---

## 2. The core inversion + paragraph / keyboard semantics

- **Enter** = commit the current block and start a **new paragraph block** below.
- **Shift+Enter** = a **soft line break** inside the current block (a `\n` in the block's rich text) — no new block.
- A **blank line is a paragraph boundary**, never a note split (the inversion). Compose never delimits notes.
- **Markdown shortcuts at line start** convert the empty/starting block's type as you type:

  | Typed | Becomes |
  |---|---|
  | `# ` / `## ` / `### ` | heading 1 / 2 / 3 |
  | `- ` or `* ` | bulleted list |
  | `1. ` | numbered list |
  | `> ` | quote |
  | `[] ` or `[ ] ` | to-do |
  | `--- ` | divider |

- **Backspace at the start of an empty styled block** reverts it to a paragraph (standard editor behavior), so shortcuts are undo-able without a menu.

---

## 3. Block model

Compose holds an **ordered in-memory array of blocks**; each block is `{ id?, type, richText[], checked? }`. A block created in-session has **no `id`** until its first save (the save assigns it Notion's returned block id). `richText[]` is the Step-F rich-text shape (runs with annotations + links + color). `checked` applies to to-do blocks only.

**Supported block types (v1) → Notion mapping:**

| Compose block | Notion block type | Notes |
|---|---|---|
| Paragraph | `paragraph` | default |
| Heading 1 / 2 / 3 | `heading_1` / `_2` / `_3` | H1 optional in practice — the title is the document's H1 |
| Bulleted list | `bulleted_list_item` | flat (single level) in v1 |
| Numbered list | `numbered_list_item` | flat; Notion renumbers |
| To-do | `to_do` | carries `checked` boolean |
| Quote | `quote` | serif italic, left keyline (scripture) |
| Callout | `callout` | sage fill; default icon |
| Divider | `divider` | reuse the existing divider-append path (same block dreams use) |

**Out of scope for v1:** code blocks, toggles, columns, nested-list depth, embeds, tables, synced blocks. (Revisit after use.)

---

## 4. Making & changing blocks

- **Slash menu.** Typing `/` in an empty block (or at a block start) opens a **block-type picker** popover — Text, Heading, Bulleted list, Numbered list, Quote, Callout, To-do, Divider. Selecting converts the current block (or inserts, if the block already has content). Dismiss on `Escape` or blur. Keyboard-navigable.
- **Markdown shortcuts** — §2, the fast path for people who don't want to reach for the menu.
- **Mid-document insertion** — a `+` affordance in the **left gutter** (visible on block hover/focus) inserts a new paragraph block **after** the current one. Maps to Notion's append-with-`after` (insert at a position, not only at the end).
- **Reorder** — a **drag handle** in the gutter (grip glyph) on desktop; **up/down** controls on mobile (drag is unreliable on touch). **Reorder is the heaviest write** — see §9. It ships in **Phase 2** so the core editor isn't blocked on it.

---

## 5. Details strip (metadata)

A **compact, collapsible** strip under the title — collapsed to a single `Details ▾` line, expanding to the classification fields. It reuses the **edit-slice pickers** already built; nothing new to invent here.

- **Fields:** Type (multi-select value pill), Domain (relation, colored chip), Date (editable date), Tags (relation), People (relation). Same pickers, same write layer as the profiles.
- **Domain note:** Notes carry a real Domains relation (unlike Tasks, whose domain is a rollup) — so the Domain field here **is** directly settable, and its chip carries the domain color. Null domain → no chip.
- The strip is **writing-first**: default collapsed, so the canvas leads. Editing a field writes immediately through the shared layer (relations via paginated read-modify-write; dates local `YYYY-MM-DD`).

---

## 6. Title

- A prominent **serif title field** at the top. What you type is the Note's **explicit title, used verbatim** (the titling cascade's "explicit title" branch — no prefix, persists forever, never auto-regenerated).
- Compose is where the **authored types** (Sermon, Teaching, Study, Prophetic Word, Podcast, Quote) live, so the title field is first-class here — but it is never *required*; an empty title falls back to the auto-titler at creation exactly as elsewhere.

---

## 7. Save model

**Debounced autosave**, so a sermon is never lost, reconciled as a **diff** against the last saved state (never a full-body rewrite).

- **Triggers:** ~1.5s idle after typing stops (tune), **on blur**, and **on route-away**. Title and Details edits save on the same path.
- **Save state indicator** (sans, top of the column): `Saving…` / `Saved` / `Unsaved changes`.
- **Reconciliation** — keep a `lastSaved` snapshot (ordered blocks with ids). On save, compute the minimal ops:
  - **New** block (no id) → **append** (respect position with `after`); store the returned id.
  - **Changed** block (id, content differs) → `PATCH /v1/blocks/{id}`.
  - **Removed** block (in `lastSaved`, gone now) → `PATCH archived:true`.
  - **Moved** block (id present, index changed) → **archive + recreate** at the new position (Phase 2 — see §9).
  - **Title / Details** changes → their own writes via the shared layer.
- **First save of a new note** creates the Note with **Status = Active** (an authored long-form note skips the Inbox triage queue — it isn't an unprocessed capture), title + Details, then appends the blocks.

---

## 8. Loading existing vs. new

- **New (`#/compose`):** empty model — a title field and one empty paragraph block. First save creates the Note.
- **Existing (`#/compose/{noteId}`):** read the Note's properties (title, Type, Domain, Tags, People, Date) into the Details strip, and **paginate the block children to completion** into the block model (map Notion types → Compose types, hydrate rich text via the Step-F deserializer, read `checked` on to-dos). Set `lastSaved` from what was read so the first diff is empty.

---

## 9. Write layer + Notion API specifics

Compose adds **no new write primitives** — it composes the ones the edit slice + Step F already shipped. Carry-over rules (non-negotiable):

- **Block endpoints:** edit = `PATCH /v1/blocks/{id}`; delete = `PATCH /v1/blocks/{id}` with `{ "archived": true }` (DELETE is not permitted through the proxy); create = append children (with `after` for position). Reuse the existing divider-append path for dividers.
- **Reorder has no native Notion op.** To move an existing block you **archive it and recreate it** at the target position (block ids aren't user-facing, so losing them is fine). Batch moves to minimize round-trips. This is the single heaviest write in Compose — isolated to Phase 2.
- **Paginate block children to completion** on load; **paginate** any relation read-modify-write (Details relations) — inline arrays truncate at 25.
- **Local `YYYY-MM-DD`** for the Date field — never `toISOString`.
- **Read the title by `type:'title'`** and the ID prefix from `unique_id` — never hardcode.
- All Notion traffic goes through the **Worker** (frontend sends method + JSON body only; the Worker attaches auth, CORS, and `Notion-Version`).
- **Rich text** round-trips through the existing Step-F serializer/deserializer — do not fork it.

---

## 10. Layout & components

- Reuse the **shared chrome** (rail + wordmark/version + Capture) — never duplicate.
- The writing column sits in the cream panel (`#F6F2E9`) on the deeper page (`#E7E0D0`); the panel **grows to fit content** (a long sermon is a long panel).
- **Palette:** olive text `#2A3408`; sage `#E7ECD6` / deeper sage `#DBE2C1` for chips, slash-menu active row, callout fill; domain chips are the only full-saturation color; quote uses a muted keyline + serif italic. Gutter affordances (`+`, grip) are muted and appear on hover/focus.
- **Slash menu** = a small popover card, sage-highlighted active row, keyboard-navigable.
- **Mobile:** the column runs full width; the Details strip stacks; reorder is up/down (not drag).

---

## 11. Phasing

- **Phase 1 — the editor.** Title + Details strip; all v1 block types (§3) creatable via **slash menu and markdown shortcuts**; Enter / Shift+Enter semantics; inline rich text (reuse); mid-document **insert** (`+` gutter, append-with-`after`); **debounced autosave** with reconciliation for new/changed/removed blocks; **load-existing + new**. This is a fully usable authoring surface — you can write and build up a sermon over days.
- **Phase 2 — reorder + drag UX.** Block reorder (archive+recreate reconciliation), the desktop drag handle, and mobile up/down. Isolated because it's the heaviest write and the fiddliest interaction; Phase 1 stands without it.

Ship Phase 1, verify live, then layer Phase 2 — same staged pattern as Home and Find.

---

## 12. Land-then-verify checklist

Sandbox **cannot** reach the Worker / Notion — **verify live in the browser and in Notion.** Author into a **Sandbox note inside an existing domain, never a test domain.**

1. **New note** — compose a title + a few block types, let autosave fire; confirm in Notion the Note exists with the right title, Type/Domain/Tags/Date, and blocks in order and correct types.
2. **Round-trip** — reopen the same note via `#/compose/{noteId}`; blocks, checkboxes, and inline formatting (bold/italic/color/links) come back identical.
3. **Block types** — each of the eight maps to the right Notion type; markdown shortcuts and the slash menu both produce it.
4. **Paragraph semantics** — Enter makes a new block; Shift+Enter stays in-block; a blank line never splits into a second Note.
5. **Insert** — the `+` gutter inserts at the right position (verify order in Notion).
6. **Removal** — deleting a block archives it (not hard-deleted); it's gone from the note but recoverable.
7. **Reorder (Phase 2)** — a moved block persists in the new order in Notion; no duplicate/orphan blocks left behind.
8. **Autosave** — Saving/Saved state is honest; blur and route-away both save; no lost edits on refresh.
9. **Dates** — the Date field writes the intended local day (no UTC off-by-one).
10. **Deploy discipline** — commits on `main`, green Pages build, **version stamp bumped**.

---

## 13. Doc reconciliation (on landing)

- **Conventions** — add a **Compose addendum**: the authoring surface (writing-first column, Details strip, block set + slash/markdown, the blank-line inversion, autosave), chrome-not-`.shell`, and the Note-profile-vs-Compose division (display+light-edit vs author).
- **Roadmap** — flip **Compose → Done**; note the **Capture → Compose escalation** as a follow-on sealed-Capture slice; note reorder shipped in Phase 2.
- **Backend Notes** — record that Compose-authored notes default to **Status = Active** (they skip the Inbox triage queue), distinct from Capture's Inbox default.

---

## 14. Decisions ledger

| # | Decision | Status | Value / note |
|---|---|---|---|
| 1 | Writes one Note, blank line = paragraph | **fixed** | The core inversion from Capture. Never splits. |
| 2 | Surface | **fixed** | Shared chrome, not `.shell`; writing-first centered column; Details strip for metadata (confirmed against the mock). |
| 3 | Entry points v1 | **default** | "Open in Compose" (Note profile) + a "New" action (Find/Home). Capture→Compose escalation deferred to its own sealed-Capture slice. |
| 4 | Save | **default** | Debounced autosave (~1.5s idle) + save-on-blur + save-on-route-away, diff-reconciled; visible Saved/Saving state. No manual Save button in v1 (add if it feels missing). |
| 5 | Block set v1 | **default** | paragraph, H1–H3, bulleted, numbered, to-do, quote, callout, divider. Code/toggle/columns deferred. |
| 6 | Heading levels | **default** | Offer H1–H3; expect H2/H3 in practice (title is the H1). Trim to H2/H3 if H1 never gets used. |
| 7 | Reorder mechanism | **fixed** | Archive + recreate (no native Notion move); Phase 2; batch to limit writes. |
| 8 | Insert mechanism | **default** | Append-with-`after` via the `+` gutter; Phase 1. |
| 9 | Soft break | **default** | Shift+Enter = `\n` in-block; Enter = new block. |
| 10 | Default Status for an authored Compose note | **fixed** | **Active** — an authored long-form note skips the Inbox triage queue (it isn't an unprocessed capture). Distinct from Capture's Inbox default. |
| 11 | Autosave interval | **default** | ~1.5s idle; tune by feel. |

---

*Build Phase 1 first (the editor), verify live, then Phase 2 (reorder). No open decisions remain — the brief is executable as written.*
