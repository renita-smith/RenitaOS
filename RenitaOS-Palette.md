# RenitaOS — Palette (canonical)

*Single source of truth for color across every RenitaOS screen. Any screen — Capture, Triage, Home, Weekly Review — draws from this doc. When a screen's mock or code disagrees with this doc, this doc wins. Update colors here first, then propagate.*

---

## Base tokens

- **Text (olive):** `#2A3408`
- **Sage fill:** `#E7ECD6`
- **Deeper sage (open/active/hover state):** `#DBE2C1`
- **Monochrome olive icon:** `#3A4410`
- **Canvas / page background:** reuse Capture's existing background — do not invent a new one.
- **Radius:** `12px` cards, `4px` small controls.
- **Shape:** borderless soft rectangles.

---

## Domain colors

The six Domain colors are the **only full-saturation color in the app.** They are the app's one wayfinding color system — used as full-tile fills (e.g. tasks-by-domain bins) and anywhere a Domain needs to be identified at a glance. All six share the same dusty, muted, warm-leaning register so they cohere with the sage base; hues stay spread so the six remain distinguishable.

Text on a colored tile uses its **paired dark hex**, never black or gray.

| Domain | Identity | Fill | Text |
|--------|----------|--------|--------|
| RCBS  | green      | `#D6DDBE` | `#46552A` |
| RWS   | wheat      | `#EBDFC0` | `#6C5316` |
| SM    | terracotta | `#E8CDBE` | `#7C4A2E` |
| MTS   | pink       | `#EDD0D4` | `#7E4351` |
| EPLC  | slate      | `#D3D9D8` | `#465657` |
| PEEPS | mauve      | `#E0D7D3` | `#665049` |
| No domain | neutral | `#EEEEE7` | `#6A6A61` |

Notes on assignment: SM and EPLC both carry a "red and blue" identity; the pair was split — SM took the red (terracotta), EPLC the blue (slate) — so they stay distinguishable. EPLC's slate is warmed toward blue-grey to sit in the family; if strict blue identity ever matters more than cohesion, that is the one tile to revisit.

---

## Type colors

Type color is **ambient, not wayfinding** — it identifies far less than the Domain system does, because Types are already named and iconed. Rules:

- Type color appears **only** as the thin **left-edge stripe** on note cards (the restrained Capture treatment). Never a dot, never a filled chip.
- Type edges are drawn from the **same earth-tone family** as the Domain palette — muted, dusty, warm-leaning.
- **Do not** create a loud, maximally-distinct color for all ~13 Types. The name + icon identify the Type; the edge is a whisper. Related Types may share close tones.
- Every Type edge stays **quieter and more desaturated than the Domain tiles.** A Type edge must never compete with a Domain color or with the sage.
- Retire any bright/jewel-tone Type colors (e.g. an indigo Reflection edge) — re-tint into this family.

---

## Usage rules (system-wide)

- Color encodes **Domain**, first and loudest. Everything else is olive text on sage fills.
- Note-Type bins are uniform sage with a monochrome olive icon — **no colored dots.**
- On cards, only the Domain chip carries color; Type, People, and Tag chips stay olive-on-sage.
- The Domain tiles are the single most-saturated element on any screen. If something else is competing with them for attention, it's wrong.

---

## Adoption status (per screen)

- **Triage** — built to this palette from the start.
- **Capture** — ⚠️ **pending a color pass.** Capture predates this palette and currently uses off-family Type-edge colors (e.g. an indigo Reflection edge) and possibly older Domain tints. It needs to be re-tinted to match this doc. Because Capture is **live and accumulating real data daily**, treat this as a careful, non-urgent pass — bundle it with the other pending Capture polish (the dream-divider fix), and verify the live page after, don't destabilize it. Colors only; no behavior change.
- **Home** — inherits this palette when built.
- **Weekly Review** — was an earlier standalone build with its own colors; re-skin to this palette if/when it's folded into the shell. Not urgent.
