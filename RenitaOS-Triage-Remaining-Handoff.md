# RenitaOS — Triage Handoff (finish the remaining work)

*Start a fresh chat from this. It's self-contained: everything needed to complete the Triage screen without re-deriving prior decisions. Hand the prompts to Claude Code on the web. Colors and interaction conventions defer to `RenitaOS-Conventions.md`; schema to `RenitaOS-Backend-Notes-Template.md`; Triage behavior to `RenitaOS-Triage-Build-Spec.md`.*

---

## Project state (context)

- **Capture** — live, served at `capture.html`.
- **Shell** — live and verified at root `index.html`. Hash router (`#/home`, `#/capture`, `#/triage`), persistent nav, and the live inbox pill all working against real Notion data.
- **Triage** — core loop **works**: reads, inline editing, and Refresh + status writes are all built and verified. What remains is bug fixes, one capability (delete), one mode (Select/bulk), a data cleanup, and desktop layout.
- Everything downstream of Triage (profile screens, Today dashboard) is fully specced in `RenitaOS-Conventions.md` but **not the subject of this handoff** — finish Triage first.

## Triage — what's already done (verify still working)

Reads/bins; inline chip editing incl. editing already-filled fields; create-project removed (assign existing only); Status pills editable; Date pill on note cards; **Refresh + status writes** (Notes qualified & not Active → `Closed`; Tasks qualified → `Not Started`) with undo — **confirmed working.**

---

## Remaining work (in recommended order)

### 1. Bug fixes — do first (they touch live data)

**a. Type is multi-select; Triage treats it as single-select.**
The Notes `Type` property is a Notion **multi-select** — a note can carry several types. Triage was built single-select ("pick one, overwrite"). Fix:
- Type picker **adds/removes multiple** types rather than overwriting.
- Note cards render **several Type chips** when present.
- Write the full multi-select array, matching each option's **exact string including emoji**.
- The "processed" test is unchanged: ≥1 Type + ≥1 Tag.
- Full Type option list (exact, with emoji): Thought 💭, Reminder 🔔, Idea 💡, Convo 👥, Podcast 🎙, Dream 💤, Sermon 🗣, Prophetic Word 📣, Virtual 🤳🏽, Teaching 📝, One on One 👥, Prayer 🙏🏽, Quote 🔏, Study 📚, Reflection 🤔, Download 📥.

**b. Pill-tap scroll jump.** Tapping any pill scrolls the page to the top; the picker opens fine but scroll position is lost. Preserve scroll position when a picker opens.

**c. Verify earlier fixes landed** (may already be done): create-project removed, Status pills editable, Date pill on note cards.

### 2. Data cleanup — one-time

Check the **Notes database for duplicate Types** created before the emoji-match fix (notes triaged while Triage was writing plain names may have spawned duplicate type options). Merge duplicates back into the canonical emoji'd types.

### 3. Delete — new capability

Both paths, each with an **undo snackbar** (destructive write):
- **Swipe-to-reveal trash** on a single card (the common case — one stray capture).
- **Bulk delete** as a Select-mode action.

### 4. Select mode + bulk actions — new mode

- **Select** toggle in each bin header reveals checkboxes + a bottom bulk-action bar; exiting returns to the calm sort.
- Bulk actions — **Notes: Tag, Status. Tasks: Status, Project** (NOT Tag — tasks have no Tags relation; the original spec's "bulk Tag for tasks" was invalid).

### 5. Desktop layout — last (layout only)

Triage was built mobile-first. Add a desktop layout: bin overview **beside** the open bin on wide screens; collapse to current mobile behavior on narrow. Prompt below.

---

## Wiring rules (carry over — apply to every fix)

- **Resolve Notion properties by type / target-database, not by hardcoded name** — names are emoji-prefixed.
- **Match option values by exact string including emoji** (this is the root cause of the Type bug and the earlier Status bug). Never write a bare guessed name.
- **Status is a Notion Status-type property** — write as `{"status":{"name":"..."}}`.
- Parsing/dates run **locally, no AI**.
- **Cloudflare Worker passthrough** unchanged: front-end sends method + JSON body only; Worker strips `/v1`, prepends `https://api.notion.com/v1`, attaches token/headers.
- **Never touch `capture.html`** — it's the live Capture screen.
- **Update the nav inbox pill** whenever Triage changes what's in the Inbox.
- **Reads-first, verify live:** the sandbox can't reach the Worker, so Code can't verify against real data — the user does, in the browser. Land a change, then stop and let the user confirm before proceeding, especially for writes. Test destructive/write changes on a throwaway "test" capture first.

## Source-of-truth docs (in the repo)

- `RenitaOS-Conventions.md` — canonical **color + interaction conventions**; outranks other files on both.
- `RenitaOS-Triage-Build-Spec.md` — Triage behavior/spec.
- `RenitaOS-Backend-Notes-Template.md` — Notion schema (DB IDs, fields, Status options).
- This handoff — Triage remaining work.

## After Triage (not this session)

Shell responsive/left-rail pass → entity profiles → Today dashboard. All specced in `RenitaOS-Conventions.md`.

---

## Ready-to-paste prompts for Claude Code

### Prompt A — bug fixes + cleanup (send first)

```
Several Triage fixes. Read RenitaOS-Conventions.md, RenitaOS-Triage-Build-Spec.md, and
RenitaOS-Backend-Notes-Template.md from the repo first. Do NOT touch capture.html.

1. URGENT — Note Type is a MULTI-SELECT but Triage treats it as single-select. Fix the
   picker to add/remove multiple types (not overwrite); render several Type chips on cards;
   write the full array, matching each option's exact string INCLUDING emoji. Full list:
   Thought 💭, Reminder 🔔, Idea 💡, Convo 👥, Podcast 🎙, Dream 💤, Sermon 🗣,
   Prophetic Word 📣, Virtual 🤳🏽, Teaching 📝, One on One 👥, Prayer 🙏🏽, Quote 🔏,
   Study 📚, Reflection 🤔, Download 📥. Resolve properties/options by type + exact value,
   never by a hardcoded/bare name.

2. BUG — tapping any pill scrolls the page to the top. Preserve scroll position when a
   picker opens.

3. Verify these earlier fixes are present: create-project removed (assign existing project
   only), Status pills editable, Date pill on note cards.

Then stop — I'll verify against real Notion data before the next slice.
```

### Prompt B — delete + select mode (after A verifies)

```
Two Triage additions. Follow RenitaOS-Triage-Build-Spec.md and RenitaOS-Conventions.md.

1. Delete — both paths, each with an undo snackbar (destructive):
   - swipe-to-reveal trash on a single card
   - bulk delete inside Select mode

2. Select mode — a "Select" toggle in each bin header reveals checkboxes + a bottom
   bulk-action bar; exiting returns to the calm sort. Bulk actions:
   - Notes: Tag, Status
   - Tasks: Status, Project  (NO Tag — tasks have no Tags relation)

Then stop for me to verify.
```

### Prompt C — desktop layout (last, layout only)

```
Add a desktop layout to Triage. LAYOUT ONLY — no palette/component restyle, no data
changes. Breakpoint ~768px; below it keep current mobile behavior exactly. On desktop:
bin overview as a left column with the opened bin's card stack in a wider column beside
it (opening a bin fills the right column instead of replacing the overview). Keep cards
to a comfortable bounded width. Refresh bar, bulk-action bar, popovers, undo snackbar,
and inbox-zero state adapt cleanly and stay correctly positioned. Confirm mobile didn't
regress.
```
