# RenitaOS · Triage — Build Spec

Reference implementation: `triage-view.html` (self-contained, inline CSS + vanilla JS, placeholder content only).
This spec is the contract for wiring the Triage **view** into the RenitaOS app. The view ships as screen content only — the host `shell.html` provides top-level nav.

---

## 1. Scope

Triage is a mail-sorting session: bins on the wall, one bin at a time. Two tracks:

- **Notes · by type** — bins grouped by note Type (Dreams, Sermons, Reflections, …).
- **Tasks · by domain** — tiles grouped by RenitaOS Domain (RCBS, RWS, SM, MTS, EPLC, PEEPS) + a "No domain" catch-all.

The user opens one bin, qualifies its cards (fills what's missing), and **Refresh** clears everything that qualifies — leaving the bin lighter, eventually empty (inbox-zero).

---

## 2. Palette (final)

The governing rule: **Domain is the only full-saturation color in the app.** Everything else is olive ink on sage.

### Base
| Token | Value | Use |
|---|---|---|
| Text (olive ink) | `#2A3408` | all text |
| Monochrome icon | `#3A4410` | olive line icons |
| Canvas / background | `oklch(0.975 0.006 75)` | reuse Capture's canvas — do not invent a new one |
| Sage fill | `#E7ECD6` | bins, chips, panels |
| Deep sage | `#DBE2C1` | open/active bin fill |
| Cream | `#F5F2E8` | text on dark buttons |
| Radius | `12px` cards/panels/buttons · `4px` badges/chips/small controls | borderless soft rectangles |

### Domain colors — fill / paired dark text
Text on each tile uses its paired dark hex, **never black**.

| Domain | Fill | Text |
|---|---|---|
| RCBS | `#D6DDBE` | `#46552A` |
| RWS | `#EBDFC0` | `#6C5316` |
| SM | `#E8CDBE` | `#7C4A2E` |
| MTS | `#EDD0D4` | `#7E4351` |
| EPLC | `#D3D9D8` | `#465657` |
| PEEPS | `#E0D7D3` | `#665049` |
| No domain | `#EEEEE7` | `#6A6A61` |

### Type edges — ambient identity only
Type appears **only** as the thin left-edge stripe on note cards — never a dot, never a filled chip. Muted, dusty, warm-leaning, and quieter/more desaturated than the Domain tiles. Related types may share close tones (types are identified by name + icon; the edge is ambient, not wayfinding).

| Type | Edge |
|---|---|
| Reflection | `oklch(0.56 0.03 70)` |
| Dream | `oklch(0.56 0.045 25)` |
| Sermon | `oklch(0.55 0.05 45)` |
| Thought | `oklch(0.55 0.035 110)` |
| Study | `oklch(0.55 0.03 135)` |
| Note | `#2A3408` (olive) |

Task cards use the **Domain** dark hex as their left-edge stripe (e.g. MTS → `#7E4351`).

---

## 3. Screens & states

### Bin overview (the survey)
- Header: title + "N waiting · take one bin at a time."
- Segmented control **Notes / Tasks** switches the visible track.
- **Notes bins**: uniform sage fill, olive text, one monochrome olive line icon per type — Dreams = moon, Sermons = book, Reflections = ripple. No colored dots. The open/active bin = deep sage `#DBE2C1` + 1px olive `#2A3408` border.
- **Tasks tiles**: 2-col grid of Domain tiles (fill/text per table) + full-width "No domain".
- Tapping any bin/tile opens it.

### Opened bin
- Header: `‹ Bins` back, bin title + count, **Select** toggle.
- **Refresh bar**: shown when ≥1 card qualifies — "N ready to clear" + Refresh button.
- Card stack.
- **Card states**:
  - *Not-yet-qualified*: a dashed **ghost chip** names exactly what's blocking (`+ Tag` for notes, `Set Due` for tasks).
  - *Qualified*: chips filled + a **quiet check** (top-right). The card does **not** vanish — it stays until Refresh.
- **Popovers** (open under the tapped chip, dismissed by a full-card backdrop):
  - `+ Tag` → filter-as-you-type tag list + "Create …".
  - Type chip → Type strip (current type marked).
  - `Set Due` (tasks) → date options (Today, Tomorrow, This weekend, Next week, Pick a date…).
- **Select mode**: checkboxes on each card + bottom bulk-action bar (Tag / Status / Project).
- **Refresh** removes all qualifying cards at once → **undo snackbar** ("N cleared · inbox lighter", single undo).
- **Inbox-zero**: when the bin empties, a soft-sage panel with the date + one gentle stat. No confetti.

---

## 4. Chip rules (cards)

- Type / People / Tag chips stay **olive-on-sage** (`#E7ECD6` fill, `#2A3408` text).
- **Only the Domain chip gets color** (Domain fill + paired dark text).
- Ghost chips: dashed, warm terracotta accent (`#A85C36`) — reserved for the single missing requirement.

---

## 5. Qualification logic (placeholder rule — confirm against real model)

```
notes:  qualified = hasType && tags.length > 0
tasks:  qualified = hasDueDate
```

Refresh clears every card where `qualified === true`; the rest stay. Undo restores the last cleared batch.

---

## 6. Wiring notes for the app build

- The reference uses in-memory placeholder arrays (`BINS`) and re-renders the whole stack on each mutation. Replace with the real store; keep the same card shape: `{ id, type, tags[], people[{name,initial}], due, domain, body }`.
- No network, no Notion, no Worker calls in the reference — all sorting is local UI. Bind Refresh / tag / type / due / select actions to the real backend.
- Remove the `.view { max-width: 440px }` constraint when embedding — the view is a single flex column meant to fill the host content area.
- Icons are inline SVG line icons (moon / book / ripple) in the `ICONS` map — swap for the app's icon set if one exists.
- Fonts: Newsreader (serif, for card bodies + titles) + IBM Plex Sans (UI). Loaded via Google Fonts `<link>`.
