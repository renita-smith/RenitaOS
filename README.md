# Handoff: RenitaOS Capture & Home

## Overview
A capture-first personal OS: a persistent "Capture" composer (full-screen, bottom sheet, or desktop modal) that live-parses free text into structured records (Type, Domain, Tags, People, Task/due), plus a "Home" calm-feed screen surfacing pulse cards. Three presentation contexts share the same parsing/state logic: full-screen mobile, mobile bottom sheet, and desktop modal — plus a Home feed (mobile + desktop sidebar shell).

## About the Design Files
The file in this bundle (`renitaos-capture-home.dc.html`) is a **design reference built in HTML** — a working prototype showing intended look, copy, and interaction, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React Native, SwiftUI, Android/Compose, web React, etc.) using its established component/state patterns — or, if no environment exists yet, choose the most appropriate framework and implement there. Wire the parsing logic (below) to a real data layer (Notion-style Projects/Tasks/Notes/Domains/Tags/People database, or your own schema) instead of the in-memory mock state used here.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, and copy are final/intentional. Recreate pixel-for-pixel using the codebase's existing UI library where possible, substituting the token values below.

## Screens / Views

### 1. Capture — Full screen
- 402×874 mobile frame, off-white background (`--surface`), fully functional.
- Header: close (✕) circle button, "CAPTURE" label, spacer.
- Type/Note pill (top-left of body) reflecting the current entry's Task/Note state.
- Hint row: `#tag · @person · !project · %domain · /type · +task`.
- Large serif textarea (`Newsreader`, 26px) — "What's on your mind?" placeholder. This is the single source of truth; nothing else is directly editable.
- Inline autocomplete dropdown appears below the caret's token while typing `#`, `@`, `!`, `%`, or `/`.
- Voice/Photo mode panels (mic icon / OCR icon) when Voice/Photo mode selected, each with a "Mark as Task" toggle chip.
- Type/Voice/Photo segmented toggle (small pill-track, IBM Plex Sans 13px).
- **Recognized** section: one card per parsed "thought" (see Parsing Logic), stacked vertically.
- Borderless "Save to Inbox" button (soft sage fill, olive text at rest; deepens to olive fill + cream text on press).
- "Just captured" recent-entries list (after saving).
- Toast confirmation ("Saved to Inbox").

### 2. Capture — Sheet (static illustration)
Same composer content presented as a bottom sheet sliding up over a dimmed Home screen. Static mockup for reference only (not wired to live state in this prototype, aside from shared textarea state).

### 3. Home — Calm Feed (mobile)
- 402×874 frame, scrollable.
- Inline collapsible "Capture a thought…" row (sage pill, dark-circle "+" icon) that expands to the same composer inline.
- Two "bridge chips": Inbox count tile, Today (due/events) tile — link out to other screens.
- Pulse cards: Personal pulse (prayer tag), Operational pulse (dWell/domain badge + overdue checkbox), Drift alert (PEEPS domain badge + "Mark paused"), "On this day" memory card.
- "Simulate a calm week" toggle in the header hides all pulse cards to show an empty/quiet state.

### 4. Desktop — Sidebar shell
- 1280×800 frame: left sidebar (RenitaOS wordmark, green "Capture" button with `C` keyboard-shortcut badge, Home/Inbox/Today/Insights nav), centered content column mirroring the Home feed content, Capture opens as a centered modal overlay instead of inline/full-screen.

## Parsing Logic (the core interactive feature)

**Inline symbols** (typed anywhere in the textarea):
- `#word` → Tag
- `@word` → Person (⚠ only the `@` is stripped from displayed body text — the name itself stays in the prose)
- `!word` → Project (recognized + stripped from body, but NOT displayed as its own card element)
- `%word` → Domain (only shown as a badge if actually typed — no default domain)
- `/word` → Type, but **only** if `word` case-insensitively matches the known Type set: `Dream, Thought, Sermon, Reflection, Note, Reminder, Idea, Study`. Non-matching `/word` is left as plain text.
- Leading `+` → marks the whole entry as a Task (default Type label becomes "Task" if no explicit `/type` given).

**Multi-entry splitting**: a textarea can contain a braindump of several thoughts. A new entry starts at any line beginning with `/type` or a leading `+`, or after a blank line. Continuation lines with no marker stay attached to the entry above. Each entry is parsed **independently** — a later entry's markers must never leak into an earlier card's body.

**Per-entry card output** ("Recognized" section, one card per entry):
- Colored left border + uppercase Type label (color driven by Type palette).
- Domain badge (only if `%` was typed for that entry).
- Body = the entry's text with all recognized syntax stripped (tags/domain/project tokens fully removed; `@` removed but names kept; leading `+` and `/type` token removed), whitespace collapsed.
- People chips (avatar-initial circle + name).
- Tag chips (`#label`).
- "+ Due date" chip on the right if the entry is a task.

**Three visual states per token/chip** (Confirmed / Will-create / Pending):
- Confirmed (matches an existing record): solid tinted fill, solid border, full opacity.
- Will-create (new value not in the existing dataset): white/light fill, dashed border in the palette color, trailing "+" marker.
- Pending (a token still being typed, i.e. it ends exactly at the current cursor/text end): muted/ghosted fill, dashed muted border, ~55% opacity, label suffixed with "…".

This resolving-card feedback is **read-only** — it never blocks or gates the Save action, and there's no way to edit a card directly; all edits happen by changing the source text.

## State Management
- `text` (string) — the textarea's full raw content; single source of truth.
- `mode` — `'type' | 'voice' | 'photo'`.
- `taskManual` (bool) — manual Task toggle for Voice/Photo modes (since there's no leading `+` to type).
- `autocomplete` — `{ trigger, list }` or null; recalculated on every keystroke from cursor position.
- `recent` — last 3 saved entries (for "Just captured").
- `toast` — transient save-confirmation message (auto-clears after ~2.2s).
- `calmWeek` (bool) — demo toggle that hides all Home pulse cards.
- `overdueDone`, `driftDismissed` — per-card dismissal state for Home pulse cards.
- `inboxCount` — increments on save.
- `captureOpen` / `desktopCaptureOpen` — expand/collapse state for the inline and modal composers.

`computeThoughts()` re-derives the full "Recognized" card list from `text` on every render — nothing about parsing is cached/stateful beyond the raw text itself.

## Design Tokens
All values are defined once in a `:root` block and referenced everywhere (see `<style>` in the file's `<helmet>`).

**Radius** (two-tier system — never fully rounded/pill-shaped):
- `--radius-sm: 4px` — badges, tags, domain/person/tag/due-date chips, the Type/Voice/Photo toggle (track + thumb), the calm-week toggle, bridge chips (Inbox/Today tiles), checkboxes, sidebar nav rows, small pulse-card badges (prayer/dWell/PEEPS).
- `--radius-lg: 12px` — cards, sheets, modals, buttons, autocomplete dropdowns, mini-panels (voice/photo).
- Circular elements (avatars, dots, close buttons) use `border-radius:50%` and are exempt. Device chrome (phone bezel 44px corner, sheet slide-up 28px edge) is exempt.

**Color:**
- `--text: #2A3408` (deep olive) — default text and Type color.
- `--surface: oklch(0.975 0.006 75)` — base off-white background.
- `--surface-soft: #E7ECD6` (soft sage) — gray-fill replacement; borderless Save button fill on Capture screens.
- `--cream: #F5F2E8` — light fill / text-on-dark.
- `--button-home: #6B7A45` (muted mid-olive) — borderless Save button on Home's inline composer, with `--cream` text.
- `--button-pressed: #2A3408` — brief deepen-on-tap fill for both Save button variants (text becomes `--cream` on press).

**Domain palette** (base hue only; tints/borders are derived via CSS `color-mix()`, never hand-authored per shade):
- `--domain-rcbs`, `--domain-rws`, `--domain-sm`, `--domain-mts`, `--domain-eplc`, `--domain-peeps` — each `oklch(...)`.

**Type palette** (one hue per Type, drives each resolving card's left border + label):
- `--type-dream`, `--type-thought`, `--type-sermon`, `--type-reflection`, `--type-note` (= `--text`), `--type-task`, `--type-reminder`, `--type-idea`, `--type-study`.

**Typography:** `Newsreader` (serif, italic available) for entry body/textarea copy; `IBM Plex Sans` for UI chrome/labels. Both loaded from Google Fonts.

## Assets
No external images — all iconography is emoji/text glyphs (✕, ⌄, ●) or CSS shapes (striped placeholder gradient for the photo-attachment icon). No brand assets used.

## Files
- `renitaos-capture-home.dc.html` — the complete design reference (all 4 screen contexts + shared parsing/state logic in one file).
