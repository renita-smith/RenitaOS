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

> Removed: `Type` (select). Added: `🏷️ Tags` relation (confirm exact name). `🎯 Goal` relation omitted — Goals deferred this phase. Note the duplicate priority fields (`Priority` select + `Priority?` checkbox) — decide which the app uses.

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
| Task | Primary | Task | - |
| 🚧 Projects | Relation | Project | Drills to Project profile |
| Due Date | Meta | Due Date | - |
| Do Date | Meta | Do Date | - |
| Priority | Meta | Priority | Visual display like stars |
| Status | Meta | Status | Editable (single-select) |
| Created Time | Timestamp | Created | Date only |
| Last Edited Time | Timestamp | Last Edited | Date + time |
| 🏛 Domain | Relation | Domain | Drills to Domain profile |
| Completed | Timestamp | Completed | Date only; app sets when Status → Done |
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
| Priority? | Meta (checkbox) | Priority | Reconcile with Priority select |
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
| *(open tasks)* | Relation List | Open Tasks | From Tasks where Domain = this — **OPEN Q9: include?** |

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

- **Today:** tasks where **[Due Date or Do Date? — OPEN Q1]** = today, plus overdue (Status ≠ Done). Sort by **[Time Slot / Priority / due time? — OPEN Q1]**.
- **This Week:** tasks with Due within the displayed week. Group by **[day or Domain? — OPEN Q2]**.
- **This Month:** tasks with Due within the displayed month. Group by **[day / week / Domain? — OPEN Q2]**.
- **Project profile → task list:** tasks where Project = this. **[Group by Status? Hide/collapse Done? — OPEN Q3]**.
- **Domain profile:** projects + notes + (open tasks?) where Domain = this. **[Open tasks only or all? Ordering? — OPEN Q4/Q9]**.
- **Tag profile:** notes + projects + people + collections + resources related to this tag (NOT tasks).
- **Collection profile:** notes/resources/projects/people where Collection = this.
- **Resource list screen:** all resources; default sort **[newest by Date Added? — OPEN Q5]**.
- **General relation-list sort:** default **[newest-first? — OPEN Q5]** unless a screen says otherwise.

---

## 4. Drill-down map

- Today / Week / Month card → Task profile
- Project profile → Task profile, Note profile, Tag profile
- Domain profile → Project profile, Note profile, (Task profile if open-tasks included)
- Collection profile / Tag profile → Note profile (+ their other relation-lists)
- Note profile → People / Tag / Collection / Resource / Domain / Project profiles
- Everything's "open full record" → its entity profile

**Open decisions (Q6–Q9):**
- **Q6 — People:** add a People profile screen (many fields drill to it), or make people display-only chips?
- **Q7 — Sessions & Routines:** drillable to their own profiles, or display-only stats in Domain profile? (Sessions deferred regardless.)
- **Q8 — Goals:** deferred this phase (decided).
- **Q9 — Domain → open tasks:** include a tappable open-tasks list on Domain profile?

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
