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
| Title | Title | — | Title |
| No ID | ID | - | No. ID |
| Status | Status | Inbox, Active, Closed | Status |
| Date | Date | - | Date |
| Type | Multi-select |Thought 💭,Reminder 🔔, Idea 💡, Convo 👥, Podcast 🎙, Dream 💤, Sermon 🗣, Prophetic Word 📣, Virtual 🤳🏽, Teaching 📝, One on One 👥, Prayer 🙏🏽, Quote 🔏, Study 📚, Reflection 🤔, Download 📥 | Type |
| 👥 People |Relation | → 👥 People DB | People |
| 🏷 Tags | Relation | → 🏷 Global Tags DB | Tags |
| Last Edited Time | Automated | - | - |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collection |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| 🏛️ Domain | Relation | → 🏛️ Domains DB | Domain |
| 🚧 Projects | Relation | → 🚧 Projects DB | Project |
| Created Time | Automated | - | - |
| … | … | … | … |

### GLOBAL TAGS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Tag | Title | — | Title |
| Total Notes | Rollup | → 📝 Notes DB | Total Notes |
| 📝 Notes | Relation |  → 📝 Notes DB | Notes |
| 👥 People | Relation | → 👥 People DB | People |
| 🗃 Collections |Relation |→ 🗃 Collections DB | Collection |
| Last Edited Time |Automated | - | - |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| … | … | … | … |

### PEOPLE DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Person | Title | — | Person |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| 🏷️ Tags | Relation |  → 🏷️ Tags DB | Tags |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |
| Last Edited Time | Automated | - | - |
| ✅ Tasks | Relation | → ✅ Tasks | Tasks |
| 🚧 Projects | Relation | → 🚧 Projects DB | Projects |
| … | … | … | … |

### TASKS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Task | Title | — | Task |
| - | Checkbox | - | Done |
| 🚧 Projects | Relation |  → 🚧 Projects DB | Projects |
| Due Date | Date | - | Due Date |
| Do  Date | Date | - | Do Date |
| Time Slot | Multi-select | Early Morning, Early Evening, Late Evening | Time Slot |
| Priority | Select | High, Medium, Low | Priority |
| Status | Status | Inbox, Not Started, In Progress, Paused, Done | Status |
| Created Time | Automated | - | - |
| Last Edited Time | Automated | - | - |
| Category | Select | - | Category |
| 🏛 Domain | Relation | → 🏛 Domain DB | Domain |
| Completed | Date | - | Date Completed |
| Done | Automated Button | - | - |
| 👥 People | Relation | → 👥 People DB | People |
| … | … | … | … |

### PROJECTS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Project | Title | — | Project |
| 🏛 Domain | Relation | → 🏛 Domain DB | Domain |
| Status | Status |  Not Started, In Progress, Paused, Done | Status |
| Archived | Checkbox | - | Archived |
| 🎯 Goal | Relation | → 🎯 Goal | Goal |
| Target Deadline | Date | - | Target Deadline |
| Progress | Rollup | → ✅ Tasks DB | Progress |
| Priority | Select | High, Medium, Low | Priority |
| Date Completed | Date | - | Date Completed |
| Last Edited Time | Automated | - | - |
| Created Time | Automated | - | - |
| ✅ Tasks | Relation | → ✅ Tasks DB | Tasks |
| No of Tasks | Rollup | → ✅ Tasks DB | No of Tasks |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| Start Date | Date | - | Start Date |
| Priority? | Checkbox | - | Priority |
| 👥 People | Relation | → 👥 People DB | People |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |
| Type | Select | - | Type |
| … | … | … | … |

### DOMAINS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Domain | Title | — | Domain |
| 🚧 Projects | Relation |  → 🚧 Projects DB | Projects |
| 🎯 Goal | Relation | → 🎯 Goal | Goal |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| ⏰ Sessions | Relation | → ⏰ Sessions DB | Sessions |
| 🔃 Routines | Relation | → 🔃 Routines DB | Routines |
| … | … | … | … |

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
| 🏷️ Tags | Relation |  → 🏷️ Tags DB | Tags |
| 🗃 Collections | Relation | → 🗃 Collections DB | Collections |
| … | … | … | … |

### COLLECTIONS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Collection | Title | — | Collection |
| Type | Select | - | Type |
| 📝 Notes | Relation | → 📝 Notes DB | Notes |
| 👥 People | Relation | → 👥 People DB | People |
| 🏷️ Tags | Relation |  → 🏷️ Tags DB | Tags |
| Last Edited Time | Automated | - | - |
| 🚧 Projects | Relation |  → 🚧 Projects DB | Projects |
| ℹ️ Resources | Relation | → ℹ️ Resources DB | Resources |
| … | … | … | … |

### SESSIONS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Title | Title | — | Title |
| Date | Date | - | Date |
| Session | Select | - | Session |
| ✅ Tasks | Relation | → ✅ Tasks DB | Tasks |
| 🏛 Domains | Relation | → 🏛 Domain DB | Domains |
| Outcome | Select | - | Outcome |
| Time Slot | Select | Early Evening, Late Evening | Time Slot |
| Session Done? | Checkbox |  - | Session Done? |
| Tasks Done? | Checkbox |  - | Tasks Done? |
| … | … | … | … |

### WEEKLY REVIEWS DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Week | Title | — | Week |
| Week Ending | Date | - | Week Ending |
| Reflection: What moved needle? | Text | - | Reflection: What moved needle? |
| Reflection: What didn't work? | Text | - | Reflection: What didn't work? |
| Reflection: What are you carrying into next week? | Text | - | Reflection: What are you carrying into next week? |
| Reflection: How do feel about this week? | Text | - | Reflection: How do feel about this week? |
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
| … | … | … | … |

### ROUTINES DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Routine | Title | — | Routine |
| Cadence | Select | Monthly, Weekdays, Weekly, Daily | Cadence |
| 🏛 Domains | Relation | → 🏛 Domain DB | Domains |
| Active| Checkbox | - | Active |
| 📋 Routine Log | Relation | → 📋 Routine Log DB | Routine Log |
| … | … | … | … |

### ROUTINES LOG DATABASE
| Exact property name (w/ emoji) | Notion type | Options / target DB | UI display label |
|---|---|---|---|
| Log | Title | — | Log |
| Date | Date | - | Date |
| 🔃 Routines | Relation | → 🔃 Routines DB | Routines |
| Done | Checkbox | - | Done |
| … | … | … | … |

> Fill the real title/status/date property names — leaving them blank is what causes the bugs. Note exact Status/Select option strings **including any emoji.**  

---

## 2. Per-screen field contract

For each screen, decide **which fields appear**, their **role**, and their **label**. Role guides layout: *primary* = the hero content, *meta* = small supporting chips, *relation* = a link you can drill into.

Repeat for each screen. Stub:

### TASK PROFILE

| Field | Role | Label | Notes |
|---|---|---|---|
| Task | Primary | Task | - |
| Done | Checkbox | Done | Done |
| 🚧 Projects | Relation |  Project | Drills to Corresponding Project Profile |
| Due Date | Meta | Due Date | - |
| Do  Date | Meta | Do Date | - |
| Priority | Meta | Priority | Use visual display like stars |
| Status | Meta | Status | - |
| Created Time | Timestamp | Created | Show date only |
| Last Edited Time | Timestamp | Last Edited | Show date and time |
| Category | Meta | Category | - |
| 🏛 Domain | Relation | Domain | Drills to Corresponding Project Profile |
| Completed | Timestamp | Completed | Show Date only |
| Done | Automated Button | - | Not sure if this is needed |
| 👥 People | Relation List | People | Each selection drills down to corresponding people profile |
| … | … | … | … |
| Body | Body | Details | … |

### PROJECT PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Project | Primary | Project | - |
| 🏛 Domain | Relation | Domain | Drills to Corresponding Domain Profile |
| Status | Meta | Status | - |
| Archived | Checkbox | Archived | - |
| Target Deadline | Meta | Target Deadline | - |
| Progress | Meta | Progress | Rollup from ✅ Tasks DB |
| Priority | Meta | Priority | - |
| Date Completed | Meta | Date Completed | - |
| Last Edited Time | Timestamp | Last Edited | Show date and time |
| Created Time | Timestamp | Created | Show date only |
| ✅ Tasks | Relation List | Tasks |  |
| No of Tasks | Meta | No of Tasks | Rollup from ✅ Tasks DB  |
| Notes | Relation List | Notes | Selection should open corresponding Note Profile from 📝 Notes DB |
| Start Date | Meta | tart Date | S- |
| Priority? | Checkbox | Priority | - |
| 👥 People | Relation List | People | Selection Drills to Corresponding Project Profile |
| 🗃 Collections | Relation | Collections | Selection Drills to Corresponding Collection Profile |
| Type | Meta | Type | - |
| … | … | … | … |

### NOTE PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Title | Primary | — | Title |
| No ID | Metadata | ID | - |
| Status | Meta | Status | - |
| Date | Meta | Date | - |
| Type | Meta | Type | - |
| 👥 People | Relation List | People | Selection Drills to Corresponding Project Profile |
| 🏷 Tags | Relation List | Tags | Selection Drills to Corresponding Tag Profile |
| Last Edited Time | Timestamp | Last Edited | - |
| 🗃 Collections | Relation | Collections | Selection Drills to Corresponding Collection Profile |
| ℹ️ Resources | Relation | Resources | Selection Drills to Corresponding Resource Profile |
| 🏛 Domain | Relation | Domain | Drills to Corresponding Domain Profile |
| 🚧 Projects | Relation |  Project | Drills to Corresponding Project Profile |
| Created Time | Timestamp | Created | Show date only |
| Body | Body | Details | … |

### DOMAIN PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Domain | Primary | Domain | - |
| 🚧 Projects | Relation |  Project | Drills to Corresponding Project Profile |
| 📝 Notes | Relation List |  Notes | Drills to Corresponding Note Profile |
| ℹ️ Resources | Relation | Resources | Selection Drills to Corresponding Resource Profile |
| ⏰ Sessions | Relation List | Sessions | - |
| 🔃 Routines | Relation List | Routines | - |
| … | … | … | … |

### COLLECTIONS PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Collection | Primary | Collection | Collection |
| Type | Meta | Type | - |
| 📝 Notes | Relation List |  Notes | Drills to Corresponding Note Profile |
| 👥 People | Relation List | People | Selection Drills to Corresponding Project Profile |
| 🏷 Tags | Relation List | Tags | Selection Drills to Corresponding Tag Profile |
| Last Edited Time | Timestamp | Last Edited | - |
| 🚧 Projects | Relation |  Project | Drills to Corresponding Project Profile |
| ℹ️ Resources | Relation | Resources | Selection Drills to Corresponding Resource Profile |
| … | … | … | … |

### GLOBAL TAGS PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Tag | Primary | Tag | - |
| Total Notes | Meta | Total No. of Notes | Rollup from 📝 Notes DB |
| 📝 Notes | Relation List |  Notes | Drills to Corresponding Note Profile |
| 👥 People | Relation List | People | Selection Drills to Corresponding Project Profile |
| 🗃 Collections | Relation | Collections | Selection Drills to Corresponding Collection Profile |
| Last Edited Time | Timestamp | Last Edited | - |
| ℹ️ Resources | Relation | Resources | Selection Drills to Corresponding Resource Profile |
| … | … | … | … |

### RESOURCES PROFILE
| Field | Role | Label | Notes |
|---|---|---|---|
| Title | Primary | Title | - |
| Date Added | Meta | Date Added | - |
| Last Edited Time | Timestamp | Last Edited | - |
| Type | Meta | Type | - |
| 📝 Notes | Relation List |  Notes | Drills to Corresponding Note Profile |
| Status | Meta | Status | - |
| 🏛 Domain | Relation | Domain | Drills to Corresponding Domain Profile |
| File Link | URL | File Link | - |
| 🏷 Tags | Relation List | Tags | Selection Drills to Corresponding Tag Profile |
| 🗃 Collections | Relation | Collections | Selection Drills to Corresponding Collection Profile |
| … | … | … | … |

### TODAY/THIS WEEK/THIS MONTH
| Field | Role | Label | Notes |
|---|---|---|---|
| Calendar | Calendar | Calendar | Filter by Appropriate Time Period |
| Plan of Action| Tasks by Time Slot | Plan of Action | Only on Today View |
| Upcoming Tasks | Tasks filtered by selected time period | Upcoming Tasks | Tasks filtered by selected time period |
| Active Projects | Projects filtered by selected time period | Active Projects | Projects filtered by selected time period |
| Notes | Notes filtered by selected time period | Notes | Notes filtered by selected time period |
| Tags | Tags filtered by selected time period | Tags | Tags filtered by selected time period |
| People | People filtered by selected time period | Peope | People filtered by selected time period |
| Tasks Completed | List of Tasks Completed for selected time period | Tasks Completed | List of Tasks Completed for selected time period |
| … | … | … | … |

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
- **This Week:** tasks where Due within the displayed week. Group by day or domain?
- **This Month:** tasks where Due within the displayed week. Group by day or domain?
- **Task profile:** notes + tasks where Tags contains this tag.
- **Note profile:** notes + tasks where Tags contains this tag.
- **Project profile:** tasks where Project relation = this project. Group by status? Show Done?
- **Domain profile:** projects + tasks + notes where Domain = this. What's the ordering?
- **Tag profile:** notes + tasks where Tags contains this tag.
- **Collection view:** notes/resources where Collection = this.
- **Resource view:** notes/resources where Collection = this.

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
