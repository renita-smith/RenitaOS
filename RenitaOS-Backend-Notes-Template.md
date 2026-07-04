# RenitaOS — Backend Notes (for Claude Code)

*The data map Claude Code needs to wire Capture (and later Home) to real Notion. Pairs with the Design brief: the brief is the source of truth for **behavior/look**, this is the source of truth for **data**.*

> ⚠️ **Do not paste your actual Notion integration token (or any secret key) into this document.** Only note *where* each secret lives. See §8.

Legend: `[fill]` = you add it · `[confirm]` = verify the exact spelling in Notion · pre-filled values are my best guess from what we designed — correct anything that's off.

---

## 1. Databases & IDs

The database ID is the 32-character string in each database's URL.

| Database | Database ID | Role in Capture |
|---|---|---|
| Notes | `[fill]` | Written to on a plain capture |
| Tasks | `[fill]` | Written to when the capture leads with `+` |
| People | `[fill]` | Looked up to resolve `@` |
| Projects | `[fill]` | Looked up to resolve `!`; holds the Inbox projects |
| Domains | `[fill]` | Looked up to resolve `%` |
| Tags | `[fill]` | Looked up to resolve `#` |
| Collections | `[fill]` | (later) |
| Resources | `[fill]` | (later) |
| Sessions | `[fill]` | (later) |
| Weekly Reviews | `[fill]` | (later) |
| Routines | `[fill]` | (later) |
| Routine Log | `[fill]` | (later) |

---

## 2. Capture write targets — field map

### Notes (created on a plain capture)

| Property (exact name) | Type | Set on capture? |
|---|---|---|
| Name / Title | Title | Yes — `[decide: full text, or first line as title + rest in body?]` |
| (page body) | Page content | Yes — the thought text |
| Type | Multi-select | From `/value` |
| Date | Date | Auto: **today** (adjustable) |
| Status | Select (Inbox / Active / Closed) | Set to **Inbox** |
| Domains | Relation → Domains | From `%value` |
| Projects | Relation → Projects | From `!value` |
| People | Relation → People | From `@value` (keep name in body) |
| Tags | Relation → Tags | From `#value` |
| Collections | Relation → Collections | No (triage) |
| Resources | Relation → Resources | No |

### Tasks (created when the capture leads with `+`)

| Property (exact name) | Type | Set on capture? |
|---|---|---|
| Task | Title | Yes — full text (keep any date phrase in the title) |
| Projects | Relation → Projects | From `!value`; else the `%`domain's Inbox project |
| Due Date | Date | From local date parse — confident match only |
| Do Date | Date | **No — leave empty** |
| Status | Select | Initial value `[confirm options + which is the default]` |
| Processed | Checkbox | Set to **off** (unprocessed) |
| People ("For") | Relation → People | From `@value` |
| Priority / Time Slot | Select | No (triage) |
| Pillar / Domain | Rollup (via Projects) | Auto — inherited, nothing to set |

---

## 3. Lookup databases (resolved by matching a name)

Capture matches the typed value against an existing record's title. Note the exact title-property name for each.

| Database | ID | Match on (title property) | Notes |
|---|---|---|---|
| Tags | `[fill]` | `[confirm: "Name"?]` | new value → **confirm before create** |
| People | `[fill]` | `[confirm]` | never auto-create a person `[confirm]` |
| Projects | `[fill]` | `[confirm]` | new value → confirm before create |
| Domains | `[fill]` | `[confirm]` | fixed set of 6 — never create new |

---

## 4. Domains → Inbox projects

Each Domain has one catch-all "Inbox/Admin" project. A `%`-tagged capture (with no `!project`) routes here.

| Domain | Domain page ID | Inbox/Admin project name | Inbox project page ID |
|---|---|---|---|
| RCBS | `[fill]` | `[fill]` | `[fill]` |
| RWS | `[fill]` | `[fill]` | `[fill]` |
| SM | `[fill]` | `[fill]` | `[fill]` |
| MTS | `[fill]` | `[fill]` | `[fill]` |
| EPLC | `[fill]` | `[fill]` | `[fill]` |
| PEEPS | `[fill]` | `[fill]` | `[fill]` |

---

## 5. Controlled values

| Set | Values |
|---|---|
| **Type set** (for `/`) | `[fill: e.g. Dream, Thought, Sermon, Reflection, Note, Reminder, Idea, Study…]` |
| Note Status | Inbox / Active / Closed `[confirm]` |
| Task Status | `[fill]` |
| Project type flag | Standard / Inbox-Admin `[confirm]` |

Only treat `/word` as a Type when `word` matches the Type set above; otherwise it's plain text.

---

## 6. Symbol → field mapping (what the parser does)

| In the capture text | Sets |
|---|---|
| `/type` | Note Type (must match the Type set) |
| `#tag` | Tags relation (new value → confirm) |
| `@person` | People relation — **keep the name in the body** |
| `!project` | Projects relation (new value → confirm) |
| `%domain` | Domain relation **+ route to that Domain's Inbox project** |
| leading `+` | Create a **Task** instead of a Note |
| date phrase (Tasks only) | Due Date, via **local** parse |
| everything else | Note body / Task title |

---

## 7. The Cloudflare Worker (proxy)

| Item | Value |
|---|---|
| Worker URL | `[fill]` |
| What it does | `[fill — e.g. forwards to api.notion.com, prepends the base path, attaches the Notion-Version header]` |
| Request pattern Code should use | `[fill — the URL shape + method Code calls]` |
| Notion API version header | `[fill — e.g. 2022-06-28]` |

---

## 8. Auth & secrets  ⚠️ (locations only — no actual keys here)

| Secret | Where it lives (not the value) |
|---|---|
| Notion integration token | `[fill — e.g. Worker secret named NOTION_TOKEN]` |
| Habitify API key (later) | `[fill]` |
| Anything else | `[fill]` |

---

## 9. Hosting

| Item | Value |
|---|---|
| Repo (GitHub) | `[fill]` |
| Deploy target | GitHub Pages `[confirm]` |
| App URL | `[fill]` |

---

## 10. Capture write rules (quick reference — full behavior in the Design brief)

- Note `Date` = today, adjustable; do **not** parse dates from note prose.
- Tasks: parse dates **locally** (e.g. chrono) — no AI, no external calls. Confident match → `Due Date`; leave `Do Date` empty; blank if ambiguous.
- New Note → `Status` = Inbox. New Task → `Processed` = off.
- `%`domain with no `!`project → route the item to that Domain's Inbox project.
- Creating a brand-new Tag or Project is allowed but **confirmed** first (no silent duplicates).
- Keep `@person` names in the body; keep the full text (incl. any date phrase) in a Task's title.
