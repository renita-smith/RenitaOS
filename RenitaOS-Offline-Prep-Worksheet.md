# RenitaOS — Offline Prep Worksheet (Library & Execution phase)

*Work to do by hand during the limit-reset downtime. None of this needs Claude/Code budget — it's decisions, inventory, and sketches. Doing it now means each screen's build prompt is nearly write-itself when the budget's back. Fill the blanks from Notion and from `RenitaOS-Backend-Notes-Template.md`.*

---

## Priority order (highest leverage first)

1. **Property map per database** — the #1 task. Kills the emoji-mismatch bug class before it starts.
2. **Per-screen field contracts** — which fields show, in what role, with what labels.
3. **Query rules per screen** — sort/filter/grouping.
4. **Drill-down map** — which screen links into which.
5. **Layout sketches** — rough mobile + desktop per screen.
6. **Data seeding** — use Capture/Triage daily so later screens have real content.

---

## 1. Property map (per database) — THE important one

For every database, list each property's **exact Notion name (including emoji), its Notion type, and its options/target**. This is the definitive reference Code needs so it matches properties by type/exact-value instead of guessing — the thing that caused the Type-emoji and Status write bugs. Pull these straight from Notion (open the DB → click each property).

Repeat this table for each: **Tasks, Projects, Domains, Notes, Tags, Collections, Resources, Sessions, Routines.**

### NOTES DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Title | title | — | Title |
| No ID | ID | - | No. ID |
| Status | Status | Inbox, Active, Closed | Status |
| Date | Date | - | Date |
| Type | Multi-select |Thought 💭,Reminder 🔔, Idea 💡, Convo 👥, Podcast 🎙, Dream 💤, Sermon 🗣, Prophetic Word 📣, Virtual 🤳🏽, Teaching 📝, One on One 👥, Prayer 🙏🏽, Quote 🔏, Study 📚, Reflection 🤔, Download 📥 | Type |
| 👥 People |Relation | → People DB | People |
| 🏷 Tags | Relation | → Global Tags DB | Tags |
| Last Edited Time | Automated | - | - |
| 🗃 Collections | Relation | → Collections DB | Collection |
| ℹ️ Resources | Relation | → Resources DB | Resources |
| 🏛️ Domain | Relation | → Domains DB | Domain |
| 🚧 Projects | Relation | → Projects DB | Project |
| Created Time | Automated | - | - |
| … | … | … | … |

> Fill the real title/status/date property names — leaving them blank is what causes the bugs. Note exact Status/Select option strings **including any emoji.**  

---

## 2. Per-screen field contract

For each screen, decide **which fields appear**, their **role**, and their **label**. Role guides layout: *primary* = the hero content, *meta* = small supporting chips, *relation* = a link you can drill into.

Repeat for each screen. Stub:

### Task view (entity)
| Field | Role | Label | Notes |
|---|---|---|---|
| title | primary | Task | |
| status | meta | Status | |
| due | meta | Due | |
| project | relation | Project | drills to Project view |
| domain | meta/relation | Domain | domain color |
| linked notes | relation-list | Notes | |
| description/body | primary | — | |

### Screens still to fill
- **Today** — task title, due, project, domain color, status. (Overdue + due-today only.)
- **Week** — same fields, wider date window; by day or by domain.
- **Project view** — project title, status, domain, its task list, related notes/resources.
- **Domain view** — domain name, its projects, open tasks, recent notes, session stats.
- **Note view** — title, type, tags, people, date, domain, collection, **body (Notion blocks)**.
- **Collection view** — collection title, its notes/resources.
- **Tag view** — tag name, everything tagged (notes + tasks) across domains.
- **Resource list** — resource title, type/link, domain/collection it belongs to.

---

## 3. Query rules per screen

Decide the read logic (offline decision, no code):
- **Today:** tasks where Due ≤ today AND status ≠ Done. Sort by ? (due time / domain / status).
- **Week:** tasks where Due within the displayed week. Group by day or domain?
- **Project view:** tasks where Project relation = this project. Group by status? Show Done?
- **Domain view:** projects + tasks + notes where Domain = this. What's the ordering?
- **Tag view:** notes + tasks where Tags contains this tag.
- **Collection view:** notes/resources where Collection = this.

---

## 4. Drill-down map

Sketch the navigation graph — which tap goes where:
- Today / Week card → Task view
- Project view → Task view (tap a task)
- Domain view → Project view, Note view
- Collection view / Tag view → Note view
- Everything's "open full record" → its entity view

This tells Code what must be linkable, and confirms build order (leaf destinations before the screens that link to them: Task view before Project view before Domain view; Note view before Collection/Tag).

---

## 5. Layout sketches (mobile + desktop, per screen)

Rough wireframes — boxes and labels, not polish. Per the responsive policy, do **both** widths now:
- Reading-heavy screens (Note view) → bounded column, don't stretch.
- Structural screens (Domain view, Today/Week, Project view) → where do columns go on desktop?
- Mark the domain-color spots (which elements carry the Domain tile color).

---

## 6. Data seeding (the "testing" days double as this)

Use Capture and Triage daily. Real notes, tasks, projects, domains accumulating = the later screens (especially **Home**, and the rollups in Project/Domain view) have genuine content to render and test against. Empty databases make those screens impossible to evaluate. So daily use *is* prep.

---

## What NOT to do offline
- Don't write code — that's Code's job; you're producing the spec it builds from.
- Don't restyle — the palette is locked in `RenitaOS-Palette.md`.
- Don't over-detail — decisions, inventory, and rough sketches are enough; Code fills the rest.
