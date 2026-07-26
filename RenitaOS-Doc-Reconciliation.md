# RenitaOS — Doc Reconciliation 2 (post writable-app arc)

*Surgical edits to bring the two original planning docs in line with what shipped in the edit slice + Step E/F + Capture v2. Apply to your canonical copies. Same pattern as the first reconciliation: location + drop-in text. The Roadmap and Build Brief are already current. The Offline Prep Worksheet is now largely historical (its questions are answered by what's built) — the only correction it needs is the titling one below, which points at Backend §11.*

---

## 1. RenitaOS-Backend-Notes-Template.md

### 1a. §11 Note titling — REVERSE the prefix retirement (prefixes are back)

§11 currently says the type-prefix format was **retired**. That decision was **reversed** during the build — prefixes are restored on the auto-title default. Replace the cascade and the "Retired" note with:

> **On save, set each Note's title by this cascade — stop at the first match:**
> 1. **Task** → the task's own text (no prefix). *(A task is not a note; listed for contrast.)*
> 2. **First Type = Dream** → `DRM | MMDDYY` (MMDDYY from the **Date field**). Dreams **never** take a typed title — the title names the day the record merges into. Regenerates on **Date change** only.
> 3. **Explicit title present** (Capture title field, or a `[bracket]` in the body, or an inline profile edit) → used **verbatim, no prefix**. Persists forever.
> 4. **First Type has a prefix** → `{PREFIX} | {body snippet}` (first ~5 words). **No date.**
> 5. **Untyped, body present** → plain body snippet, no prefix.
> 6. **Empty body** → `Untitled`.
>
> **Type prefix map:** Dream `DRM` · Thought `THT` · Idea `IDA` · Convo `CNV` · Sermon `SRM` · Prophetic Word `PRW` · Virtual `VRT` · Teaching `TCH` · Prayer `PRY` · Quote `QOT` · Study `STD` · Reflection `RFL` · Download `DWL` · Reminder `RMD` · One on One `ONO` · Podcast `POD`.
>
> - **Multi-type** → the **first** Type's prefix (no `MLT`).
> - **Untyped** → no prefix (no `NTE`).
> - Titles auto-fill **at creation only** and never regenerate — sole exception, a Dream on Date change. This is what makes a hand-edited title safe with **no ownership flag** (nothing overwrites it), and it settles the Type→Dream edge (Dream titling is creation-only, so switching a titled note to Dream doesn't stomp its title).
> - The **authored/ambient split is advisory only** — it drives an "add a title" nudge on Sermon/Teaching/Study/Prophetic Word/Podcast/Quote, and stays quiet on the rest. It does **not** change titling behavior.

Delete the old "**Retired:** the old `[TYPE PREFIX][MMDDYY] — [snippet]` format … are retired" paragraph — it no longer applies. (Note the new format is `{PREFIX} | {snippet}` with a `|` separator and **no date**, distinct from the old `—`/date format.)

### 1b. §12 Dream day-merge — divider is a real block

The merged-dreams divider is no longer a bare line break. Update the "Found → append beneath a subtle divider" line to:

> **Found** → append the new dream to that record's body beneath a **native Notion `divider` block** (`{ "type": "divider", "divider": {} }`), inserted via the block-append path. (Not a text line, not the literal string "(divider)".)

---

## 2. RenitaOS-Conventions.md — add an "Edit-slice interaction conventions" addendum

The Conventions doc predates any writes. Add this block (as a new addendum, alongside Addendum 2):

> ### Edit-slice interaction conventions *(finalized in the writable-app arc)*
>
> **Shared write layer — all writes route through it.** Every option-string write goes through `resolveOptionValue` (returns the exact stored option, emoji + whitespace/case-normalized; aborts with a toast on a true miss — never sends a literal). Relations and multi-selects are **whole-array replacements** → paginated read-modify-write (the inline array truncates at 25). A relation property is resolved on the **host record's own DB**, never the target DB (the target DB is only queried to find records to link). Dates are local `YYYY-MM-DD`. Delete = archive everywhere (records and body blocks). Writes are optimistic with rollback + a subtle error toast; bulk writes are throttled-sequential.
>
> **Pickers.** Relation pill caret and ghost-`+` open the same relation picker (search the target DB by title). Create-new (Tags/People/Projects only; never Domains) shows the **near-match suggestion and the "Create [typed]" action together** — the suggestion is a nudge, not a gate. Value pills (Status/Priority/Type) open a picker of the property's schema options. The **Domain picker is a tap-list of the fixed six**. Popovers clamp/flip to stay in the viewport.
>
> **Cards.** Task cards carry inline-editable **Status + Priority** pills and a **Due-Date pill** (Do Date never shows on cards). The completion checkbox is excluded from the card's navigation tap-target. **Mass-select** (Project + Domain profiles) marks a selected card with a **border/ring + shadow** — the selected-Type-chip treatment — **not a second checkbox**; in select mode the completion checkbox dims and the whole card is the select target.
>
> **Completion invariant.** Completed date present ⇔ Status Done, both directions: checking sets `Done` + `Completed = today`; unchecking, or **clearing the Completed date**, reverts to `Not Started`.
>
> **Contextual DATES row** re-picks one status date on every render by precedence: **Archived → Date Completed → Date Paused → none** (active projects show only Start / Target Deadline). Stored dates persist as history regardless.
>
> **Body editing.** `contentEditable` with a five-annotation toolbar — bold / italic / strikethrough / inline code / link — **plus color/highlight** (renders, applies via a swatch grid incl. a **default swatch = olive body color**, round-trips on edit). Notion has no black; "default" is the olive body color. Block *types* (headings, lists, quotes, callouts) can be edited but not created/converted in-app — that's Compose. Body colors render at Notion's **actual** saturation (the "domain color is the only full-saturation color" rule governs chrome, not user-authored content).
>
> **Create-in-context.** Container profiles offer a "new child" action pre-linking the container: "+ New Project" on a Domain (Domain pre-linked), "+ New Task" on a Project / Domain. New records default Status = Inbox. New Domain records are never created (the six are fixed). A Project created without a Domain **resurfaces in the Inbox** ("Projects needing a domain") until one is assigned.
>
> **Page icons on create.** New Project / Task / Person / Tag pages get a Notion page icon = the app's type glyph (all create paths route through one shared create helper). Notes get no icon.
>
> **Capture.** No left nav rail (it's a persistent affordance, not a destination) — content column matches the other screens' width with the rail area blank; textarea fills the available height. Optional title field shows **only for a single-note capture** and hides for task/project/multi-entry captures. A lone relation token (`!Project`, `#tag`, `%domain`) creates just that entity, no stray note.
