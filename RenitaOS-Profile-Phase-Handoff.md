# RenitaOS — Profile-Phase Handoff

*Supersedes `RenitaOS-Post-Triage-Handoff.md`. Start a fresh chat from this — it's a self-contained pointer to current state and the next step. Rules live in `RenitaOS-Conventions.md` (now including the Profile-Phase addendum); the full forward plan lives in `RenitaOS-Roadmap.md`; schema in `RenitaOS-Backend-Notes-Template.md` (⚠️ its §11–12 titling section is stale — see below).*

---

## State

- **Capture** — live, **sealed**. Never touch `capture.html` except as a deliberate, isolated, throwaway-tested slice.
- **Inbox** (formerly Triage) — complete: sort loop, bulk actions, delete/undo, desktop chip-row layout, the rename, and the lightened rail.
- **Shell** — desktop left-rail (lightened, on-canvas), responsive to the mobile bar.
- **Profiles — READ + NAVIGATE only, no writes yet:** Note, Task, and the tabbed trio Tag / Collection / People. All shipped with ID handles, the ghost-field frame, and hybrid-load tabs, per the Conventions addendum.
- **Unique IDs** live on all 8 databases (NOTE, TASK, PROJ, DMN, RESC, COL, TAG, PSN).

---

## The rules that govern everything (carry over)

- **Resolve Notion properties by TYPE / target-database** via `Object.keys()` keyword matching — never by hardcoded emoji-prefixed names.
- **Match option values by the EXACT string including emoji.** This is the single most repeated failure mode (the Type-write regression, the old Status bugs). It will bite again in the edit slice.
- **Unique ID:** read from the `unique_id` property, format `{prefix}-{number}`, **plain ASCII hyphen, verbatim** — no en-dash, no hardcoded prefix.
- **Delete = archive** (never hard-delete). Bulk writes throttled sequential. Cloudflare Worker passthrough unchanged.
- **Land-then-verify:** the sandbox can't reach the Worker, so verify live in the browser before proceeding — especially writes. Test destructive/write changes on throwaway records first.
- **Everything is read-only until the edit slice.**

---

## Immediate next steps (critical path)

1. **Project profile** (read + nav) — status-collapse for its tasks.
2. **Domain profile** (read + nav) — the composite; reuses the tabbed component + status-collapse. **Loose tasks = the domain's catch-all `Inbox/Admin` project contents** (NOT the void "Direct Tasks" filter — see the Conventions correction).
3. **Edit slice** — the first writes across every profile (pickers, ghost-adds, completion checkbox, editable dates). Biggest deferred chunk.
4. **Today dashboard** — last, heaviest.

Full forward plan and parked work: `RenitaOS-Roadmap.md`.

---

## Open items gating the next builds

- *(Resolved this phase: a Task's domain is a rollup through its project only — that settled Task + Domain domain handling.)*
- **Tags↔Projects relation** — verify the exact property name/emoji in Notion before wiring anything that traverses it.
- **Week-start = Sunday** as a shared constant — settle before any "this week" screen.

---

## Source-of-truth docs

- **`RenitaOS-Conventions.md`** — canonical color + interaction rules, **plus the Profile-Phase addendum** capturing this phase's decisions (ID handles, breadcrumb/ID line, ghost frame, dates-in-meta-grid, read-only Task domain pill, tabbed hybrid-load, by-type ordering, loose-tasks correction, desktop Inbox, rail treatment, revised titling). Outranks all other files. Superseded rules in the body carry inline ⚠️ flags pointing to the addendum.
- **`RenitaOS-Roadmap.md`** — state + backlog + phases, including the defined **Explore** phase (indexes → signal).
- **`RenitaOS-Backend-Notes-Template.md`** — Notion schema (DB IDs, fields, options, catch-all project IDs). ⚠️ **§11–12 (note titling / dream merge) is stale** vs the revised cascade in the Conventions addendum — reconcile.
- **`RenitaOS-Post-Triage-Handoff.md`** — **superseded by this document.**
