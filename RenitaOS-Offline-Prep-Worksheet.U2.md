# RenitaOS — Offline Prep Worksheet (Library & Execution phase)

*Work to do by hand during the limit-reset downtime. None of this needs Claude/Code budget — it's decisions, inventory, and sketches.*

**Deferred this phase (decided):**
- **Goals DB** — not yet in process; `🎯 Goal` relations on Projects/Domains are out of scope for now.
- **Sessions screen** — the logging Shortcut isn't built yet, so build Sessions *views* later. Session stats inside Domain profile wait on this too.

---

## Priority order (highest leverage first)

1. **Property map per database** — the #1 task. Kills the emoji-mismatch bug class before it starts.
2. **Per-screen field contracts** — which fields show, in what role, with what labels.
3. **Query rules per screen** — sort/filter/grouping.
4. **Drill-down map** — which screen links into which.
5. **Layout sketches** — rough mobile + desktop per screen.
6. **Data seeding** — use Capture/Triage daily so later screens have real content.

---

## 1. Property map (per database)

### NOTES DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Title | Title | — | Title |
| No ID | ID | - | No. ID |
| Status | Status | Inbox, Active, Closed | Status |
| Date | Date | - | Date |
| Type | Multi-select | Thought 💭, Reminder 🔔, Idea 💡, Convo 👥, Podcast 🎙, Dream 💤, Sermon 🗣, Prophetic Word 📣, Virtual 🤳🏽, Teaching 📝, One on One 👥, Prayer 🙏🏽, Quote 🔏, Study 📚, Reflection 🤔, Download 📥 | Type |
| 👥 People | Relation | → 👥 People DB | People |
| 🏷️ Tags | Relation | → 🏷️ Global Tags DB | Tags |
| Last Edited Time | Automated | - | - |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collection |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| 🏛️ Domain | Relation | → 🏛️ Domains DB | Domain |
| 🚧 Projects | Relation | → 🚧 Projects DB | Project |
| Created Time | Automated | - | - |

> ⚠️ **Type is multi-select** — a note can carry several types. Triage was built treating Type as single-select (pick one, overwrite). That editing behavior needs to allow multiple. (Flagged for the Triage fix list.)

### GLOBAL TAGS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Tag | Title | — | Title |
| Total Notes | Rollup | → 📝 Notes DB (count) | Total Notes |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| 👥 People | Relation | → 👥 People DB | People |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collection |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |
| Last Edited Time | Automated | - | - |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |

> ⚠️ **Confirm the exact Projects relation property name/emoji** on both this DB and the Projects DB — added from your note that tags connect to Projects, but it wasn't in the original capture.

### PEOPLE DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Person | Title | — | Person |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| 🏷️ Tags | Relation | → 🏷️ Tags DB | Tags |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |
| Last Edited Time | Automated | - | - |
| ✅ Tasks | Relation | → ✅ Tasks DB | Tasks |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |

### TASKS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Task | Title | — | Task |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |
| Due Date | Date | - | Due Date |
| Do Date | Date | - | Do Date |
| Time Slot | Multi-select | Early Morning, Early Evening, Late Evening | Time Slot |
| Priority | Select | High, Medium, Low | Priority |
| Status | Status | Inbox, Not Started, In Progress, Paused, Done | Status |
| Created Time | Automated | - | - |
| Last Edited Time | Automated | - | - |
| 🏛 Domain | Relation | → 🏛 Domain DB | Domain |
| Completed | Date | - | Date Completed |
| 👥 People | Relation | → 👥 People DB | People |

> Removed: `Category` (select), the nameless Done checkbox, and the Done automated button. Completion = write `Status = Done` **and** `Completed = today` from the app. **Tasks are not tagged** (no Tags relation — correct).

### PROJECTS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Project | Title | — | Project |
| 🏛 Domain | Relation | → 🏛 Domain DB | Domain |
| Status | Status | Not Started, In Progress, Paused, Done | Status |
| Archived | Checkbox | - | Archived |
| 🏷️ Tags | Relation | → 🏷️ Global Tags DB | Tags |
| Target Deadline | Date | - | Target Deadline |
| Progress | Rollup | → ✅ Tasks DB | Progress |
| Priority | Select | High, Medium, Low | Priority |
| Date Completed | Date | - | Date Completed |
| Last Edited Time | Automated | - | - |
| Created Time | Automated | - | - |
| ✅ Tasks | Relation | → ✅ Tasks DB | Tasks |
| No of Tasks | Rollup | → ✅ Tasks DB (count) | No of Tasks |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| Start Date | Date | - | Start Date |
| Priority? | Checkbox | - | Priority |
| 👥 People | Relation | → 👥 People DB | People |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |

> Removed: `Type` (select). Added: `🏷️ Tags` relation (confirm exact name). `🎯 Goal` relation omitted — Goals deferred this phase. The old `Priority?` checkbox is renamed **`Focus`** — it flags projects chosen as next-week focus in the Weekly Review Dashboard. `Priority` (select) is the real priority field.

### DOMAINS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Domain | Title | — | Domain |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| ⏰ Sessions | Relation | → ⏰ Sessions DB | Sessions |
| 🔃 Routines | Relation | → 🔃 Routines DB | Routines |

> `🎯 Goal` relation omitted — Goals deferred this phase.

### RESOURCES DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Title | Title | — | Title |
| Date Added | Date | - | Date Added |
| Last Edited Time | Automated | - | - |
| Type | Select | YouTube Video, Article, Post | Type |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| Status | Status | Not Started, In Progress, Done | Status |
| 🏛 Domain | Relation | → 🏛 Domain DB | Domains |
| File Link | URL | - | File Link |
| 🏷️ Tags | Relation | → 🏷️ Tags DB | Tags |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |

### COLLECTIONS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Collection | Title | — | Collection |
| Type | Select | Event, Service, Organization, Book, Research | Type |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| 👥 People | Relation | → 👥 People DB | People |
| 🏷️ Tags | Relation | → 🏷️ Tags DB | Tags |
| Last Edited Time | Automated | - | - |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |

### SESSIONS DATABASE  *(views deferred — Shortcut not built yet)*
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Title | Title | — | Title |
| Date | Date | - | Date |
| Session | Select | Early Morning, Early Evening, Late Evening | Session |
| ✅ Tasks | Relation | → ✅ Tasks DB | Tasks |
| 🏛 Domains | Relation | → 🏛 Domain DB | Domains |
| Outcome | Select | Ran Long, Interrupted, Didn't Start, Completed | Outcome |
| Session Done? | Checkbox | - | Session Done? |
| Tasks Done? | Checkbox | - | Tasks Done? |

> Removed: `Time Slot` (select).

### WEEKLY REVIEWS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Week | Title | — | Week |
| Week Ending | Date | - | Week Ending |
| Reflection: What moved needle? | Text | - | Reflection: What moved needle? |
| Reflection: What didn't work? | Text | - | Reflection: What didn't work? |
| Reflection: What are you carrying into next week? | Text | - | Reflection: What are you carrying into next week? |
| Reflection: How do you feel about this week? | Text | - | Reflection: How do you feel about this week? |
| 1% Goal: RCBS | Text | - | 1% Goal: RCBS |
| 1% Goal: RWS | Text | - | 1% Goal: RWS |
| 1% Goal: SM | Text | - | 1% Goal: SM |
| 1% Goal: EPLC | Text | - | 1% Goal: EPLC |
| 1% Goal: MTS | Text | - | 1% Goal: MTS |
| 1% Goal: PEEPS | Text | - | 1% Goal: PEEPS |
| Two Week Outlook Intention | Text | - | Two Week Outlook Intention |
| Completions | Number | - | Completions |
| Notes Captured | Number | - | Notes Captured |
| Sessions Count | Number | - | Sessions Count |
| Overdue % | Number | - | Overdue % |
| Session Success % | Number | - | Session Success % |
| Top Tags | Text | - | Top Tags |
| Top Types | Text | - | Top Types |

### ROUTINES DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Routine | Title | — | Routine |
| Cadence | Select | Monthly, Weekdays, Weekly, Daily | Cadence |
| 🏛 Domains | Relation | → 🏛 Domain DB | Domains |
| Active | Checkbox | - | Active |
| 📋 Routine Log | Relation | → 📋 Routine Log DB | Routine Log |

### ROUTINES LOG DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Log | Title | — | Log |
| Date | Date | - | Date |
| 🔃 Routines | Relation | → 🔃 Routines DB | Routines |
| Done | Checkbox | - | Done |

---

## 2. Per-screen field contract

Roles: *primary* (hero), *body* (rich-text block content), *meta* (small chip), *relation* (single link), *relation-list* (list of links), *timestamp* (system date, read-only).

### TASK PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| *(completion)* | Hero checkbox | — | Left of title. Writes `Status = Done` + `Completed = today`. Same field as the Status pill. |
| Task | Primary | Task | - |
| 🚧 Projects | Relation | Project | Drills to Project profile |
| Due Date | Meta | Due Date | - |
| Do Date | Meta | Do Date | - |
| Priority | Meta | Priority | Visual display like stars |
| Status | Meta | Status | Editable value pill; synced with hero checkbox |
| Created Time | Timestamp | Created | Date only; read-only |
| Last Edited Time | Timestamp | Last Edited | Date + time |
| 🏛 Domain | Relation | Domain | Drills to Domain profile |
| Completed | Meta (editable date) | Completed | App sets = today when Status → Done; **user-editable** for catch-up days. Pill briefly highlights on completion. Not a timestamp. |
| 👥 People | Relation List | People | Each drills to People profile |
| Body | Body | Details | - |

> Removed the Done checkbox and Done button rows (see §1).

### PROJECT PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Project | Primary | Project | - |
| 🏛 Domain | Relation | Domain | Drills to Domain profile |
| Status | Meta | Status | - |
| Archived | Meta (checkbox) | Archived | - |
| 🏷️ Tags | Relation List | Tags | Each drills to Tag profile |
| Target Deadline | Meta | Target Deadline | - |
| Progress | Meta | Progress | Rollup (read-only, from Tasks) |
| Priority | Meta | Priority | - |
| Date Completed | Meta | Date Completed | - |
| Last Edited Time | Timestamp | Last Edited | Date + time |
| Created Time | Timestamp | Created | Date only |
| ✅ Tasks | Relation List | Tasks | Each drills to Task profile |
| No of Tasks | Meta | No of Tasks | Rollup (read-only, from Tasks) |
| 📝 Notes | Relation List | Notes | Each drills to Note profile |
| Start Date | Meta | Start Date | - |
| Focus | Meta (checkbox) | Focus | Weekly Review: flags next-week focus projects |
| 👥 People | Relation List | People | Each drills to People profile |
| 🗃 Collections | Relation | Collections | Drills to Collection profile |

### NOTE PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Title | Primary | Title | - |
| No ID | Metadata | ID | Read-only |
| Status | Meta | Status | - |
| Date | Meta | Date | - |
| Type | Meta | Type | Multi-select — may show several |
| 👥 People | Relation List | People | Each drills to People profile |
| 🏷️ Tags | Relation List | Tags | Each drills to Tag profile |
| Last Edited Time | Timestamp | Last Edited | - |
| 🗃 Collections | Relation | Collections | Drills to Collection profile |
| ℹ️ Resources | Relation | Resources | Drills to Resource profile |
| 🏛 Domain | Relation | Domain | Drills to Domain profile |
| 🚧 Projects | Relation | Project | Drills to Project profile |
| Created Time | Timestamp | Created | Date only |
| Body | Body | Details | Notion block rendering |

### DOMAIN PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Domain | Primary | Domain | - |
| 🚧 Projects | Relation List | Projects | Each drills to Project profile |
| 📝 Notes | Relation List | Notes | Each drills to Note profile |
| ℹ️ Resources | Relation | Resources | Drills to Resource profile |
| ⏰ Sessions | Relation List | Sessions | Deferred (Sessions later) |
| 🔃 Routines | Relation List | Routines | - |
| 🚧 Projects (as cards) | Relation List | Projects | Grouped by Status; each card shows a task summary; tap → Project profile |
| ✅ Direct Tasks | Relation List | Direct Tasks | Tasks where Domain = this AND Projects is EMPTY (orphan tasks); tap → Task profile |

### COLLECTION PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Collection | Primary | Collection | - |
| Type | Meta | Type | - |
| 📝 Notes | Relation List | Notes | Each drills to Note profile |
| 👥 People | Relation List | People | Each drills to People profile |
| 🏷️ Tags | Relation List | Tags | Each drills to Tag profile |
| Last Edited Time | Timestamp | Last Edited | - |
| 🚧 Projects | Relation List | Projects | Each drills to Project profile |
| ℹ️ Resources | Relation | Resources | Drills to Resource profile |

### TAG PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Tag | Primary | Tag | - |
| Total Notes | Meta | Total Notes | Rollup (read-only) |
| 📝 Notes | Relation List | Notes | Each drills to Note profile |
| 🚧 Projects | Relation List | Projects | Each drills to Project profile |
| 👥 People | Relation List | People | Each drills to People profile |
| 🗃 Collections | Relation List | Collections | Each drills to Collection profile |
| ℹ️ Resources | Relation List | Resources | Each drills to Resource profile |
| Last Edited Time | Timestamp | Last Edited | - |

> Tags relate to Notes, Projects, People, Collections, Resources — **not Tasks.**

### RESOURCE PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Title | Primary | Title | - |
| Date Added | Meta | Date Added | - |
| Last Edited Time | Timestamp | Last Edited | - |
| Type | Meta | Type | - |
| Status | Meta | Status | - |
| File Link | URL | File Link | - |
| 📝 Notes | Relation List | Notes | Each drills to Note profile |
| 🏛 Domain | Relation | Domain | Drills to Domain profile |
| 🏷️ Tags | Relation List | Tags | Each drills to Tag profile |
| 🗃 Collections | Relation | Collections | Drills to Collection profile |

### TODAY / THIS WEEK / THIS MONTH (dashboard)
| Field | Role | Label | Notes |
|---|---|---|---|
| Calendar | Calendar | Calendar | Filtered by time period |
| Plan of Action | Tasks by Time Slot | Plan of Action | Today view only |
| Upcoming Tasks | Task list | Upcoming Tasks | Filtered by time period |
| Active Projects | Project list | Active Projects | Filtered by time period |
| Notes | Note list | Notes | Filtered by time period |
| Tags | Tag list | Tags | Filtered by time period |
| People | People list | People | Filtered by time period |
| Tasks Completed | Task list | Tasks Completed | Completed in time period |

---

## 3. Query rules per screen

> Entity **profiles** don't query — they load one record + its relation-lists. Query rules apply to **dashboard/list screens** and to **how relation-lists inside a profile are sorted.**

### Global display rule (applies everywhere)
**Tasks, Projects, Notes, and all other records render as cards** — the same card vocabulary already used on the Capture and Triage screens. Not table rows, not bare list items. Cards everywhere.

### Global sort defaults
- **Relation-lists inside profiles:** newest-first, unless a screen overrides.
- **Resource list screen:** sort by `Date Added`, descending.

### Today (interactive dashboard — the richest screen in this phase)
Pulls three sets, then derives two more from them:
- **Tasks** where `Do Date` = today **OR** `Due Date` = today (plus overdue: date < today AND Status ≠ Done).
- **Notes** where `Date` = today.
- **Active Projects** — Status = `In Progress` only (Not Started does **not** count).
- **Tags** — *derived*: the tags on the notes returned above (tasks aren't tagged).
- **People** — *derived*: the people on the notes **and** tasks returned above.
- **Tasks Completed** — tasks with `Completed` = today.

**Plan of Action (three-column interactive section).** Three columns = the three `Time Slot` values (Early Morning, Early Evening, Late Evening). Shows today's tasks in their assigned slot, and lets you **assign/reassign upcoming tasks (due tomorrow) into a slot** — an interactive write, not just a read.

`Time Slot` is a **multi-select and that is intentional** — some tasks need work across more than one slot. The UI must **allow a task to appear in multiple columns**; do not enforce a single slot. Assigning a task to a second slot *adds* to the multi-select rather than replacing it.

### This Week / This Month
- All **tasks** and **notes** falling in the displayed period, shown **together — not grouped by day.** Same derived Tags/People/Active Projects/Completed sections as Today, scoped to the period.
- Week navigation/offset controls (borrow the logic from the old Weekly Review dashboard).

### Project profile → task list
- Tasks where `🚧 Projects` = this project.
- **Group by Status** (Not Started / In Progress / Paused).
- **Done tasks in a collapsed "Done (N)" section** at the bottom.

### Domain profile
- **Projects grouped by Status**, each rendered as a **card with a task summary** (e.g. "4 of 7 done"). Tap a card → Project profile.
- **Direct Tasks section** — tasks where `🏛 Domain` = this **AND `🚧 Projects` is empty.** These are the orphan tasks (domain assigned, no project) that the Domain→Task relation exists to hold. Without this section they'd be invisible everywhere in the app.
  - ⚠️ The empty-project filter is essential: querying *all* of the domain's tasks would duplicate every task already summarized inside the project cards.
  - Same spirit as Triage's "No domain" bin — give the un-parented things a visible home.
- **No flat all-tasks list.** Project cards carry task summaries; direct tasks are the only loose ones. (Resolves Q9.)
- Notes / Resources / Routines: newest-first. (Sessions deferred.)

### Tag profile
Notes + Projects + People + Collections + Resources related to this tag. **Not tasks** (tasks have no Tags relation).

### Collection profile
Notes / Resources / Projects / People where Collection = this.

### Resource list screen
All resources, sorted by `Date Added` descending.

---

## 4. Drill-down map

Every record is a **card**; tapping a card opens its profile.

- **Today / Week / Month** → Task profile, Note profile, Project profile, Tag profile, People profile (each section's cards drill to their own entity)
- **Task profile** → Project profile, Domain profile, People profile
- **Project profile** → Task profile, Note profile, Tag profile, People profile, Collection profile, Domain profile
- **Domain profile** → Project profile (via project cards), **Task profile (via Direct Tasks)**, Note profile, Resource profile, Routines
- **Note profile** → People / Tag / Collection / Resource / Domain / Project profiles
- **Collection profile** → Note, People, Tag, Project, Resource profiles
- **Tag profile** → Note, Project, People, Collection, Resource profiles
- **People profile** → Note, Tag, Collection, Task, Project profiles
- **Resource profile** → Note, Domain, Tag, Collection profiles
- Everything's "open full record" → its entity profile

**Decisions (resolved):**
- **Q6 — People:** ✅ People profile screen added.
- **Q7 — Sessions & Routines:** Routines display-only inside Domain profile for now; Sessions deferred (Shortcut not built).
- **Q8 — Goals:** deferred this phase.
- **Q9 — Domain → tasks:** ✅ Resolved — project cards (grouped by status, with task summaries) **plus** a Direct Tasks section for orphan tasks (domain set, no project). No flat all-tasks list.

---

## Home vs. Today/Week/Month (settled)

From the original design principles: **"Surface by exception (esp. Home): show what deviates, stay quiet otherwise"** and **"Dashboards are for seeking; Home is for noticing."**

- **Home** = *noticing.* Insights, patterns, what deviates. Quiet by default. Built last.
- **Today / This Week / This Month** = *seeking.* An interactive dashboard you actively work in (assign time slots, review the period). Richer, and built in this phase.

Both are justified; they are not duplicates.

---

## Build-order note (revised)

**Today is not a leaf screen.** It queries Tasks + Notes + Projects, *derives* Tags and People from those results, and **writes** Time Slot assignments. That makes it the heaviest screen in this phase — heavier than Domain profile.

Revised order: build the **entity profiles first** (Task → Note → Project → Domain → People → Collection → Tag → Resource), so the card components and drill-down destinations all exist, **then** build Today / Week / Month on top of them. Today composes what the profiles establish.

---

## 5. Layout sketches (mobile + desktop, per screen)

Rough wireframes — boxes and labels. Per the responsive policy, do **both** widths:
- Reading-heavy screens (Note profile) → bounded column, don't stretch.
- Structural screens (Domain profile, Today/Week, Project profile) → where do columns go on desktop?
- Mark the domain-color spots (which elements carry the Domain tile color).

---

## 6. Data seeding (the "testing" days double as this)

Use Capture and Triage daily. Real notes, tasks, projects, domains accumulating = later screens (especially **Home**, and the rollups in Project/Domain profile) have genuine content to render and test against.

---

## What NOT to do offline
- Don't write code — you're producing the spec Code builds from.
- Don't restyle — palette is locked in `RenitaOS-Palette.md`.
- Don't over-detail — decisions, inventory, rough sketches are enough.
