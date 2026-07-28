# RenitaOS — Infrastructure & Deployment

*The "how it actually runs" doc. None of this existed before, and its absence caused most of the detours in the Today-dashboard build (the Worker being separate, the hardcoded token, the calendar-auth setup were all discovered mid-build). Keep this in the project library so every future chat starts knowing the plumbing.*

---

## Where the code lives

- **Frontend app** — GitHub repo, deployed via **GitHub Pages** at **`https://renita-smith.github.io`** (this exact URL is the Worker's allowed origin). This is where all screens/components live and where Claude Code works.
- **`notion-proxy` Worker** — a **Cloudflare Worker**, URL **`https://notion-proxy.renitacbsmith.workers.dev`**. **Managed in the Cloudflare dashboard editor, NOT a Git repo.** Written in the older "Service Worker" format (`addEventListener('fetch', …)`), which means its secrets are exposed as global variables. **Claude Code cannot reach this from the app repo** — Worker changes are pasted into the dashboard and Saved/Deployed (or the Worker gets connected to a repo first).

The frontend and the Worker are **two separate codebases.** A change that spans both (e.g. a new proxied endpoint) is two edits in two places.

---

## The Worker's job

1. **Notion proxy** — forwards all Notion API calls, adding auth + CORS. The browser never calls Notion directly; it calls the Worker.
2. **Read-only Google Calendar** — `GET /calendar/events?timeMin=…&timeMax=…` returns `{ events: [...], errors: [...] }`, merging events across accounts; partial-failure tolerant.

Origin lock: the Worker rejects any request whose origin isn't `https://renita-smith.github.io` with a **403**. So hitting `/calendar/events` directly in a browser tab returns 403 **by design** — verify calendar from inside the app, not the URL bar.

---

## Secrets (in the Worker — names only, values are write-only)

Cloudflare Worker secrets are **write-only**: once set they can't be read back, only overwritten. The code references them by name; **no secret value is ever in the code or the repo.**

- `NOTION_TOKEN`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GCAL_REFRESH_TOKEN_MTS`, `GCAL_REFRESH_TOKEN_PERSONAL`
- *(later)* `GCAL_REFRESH_TOKEN_SM`

Set them via Cloudflare dashboard → the Worker → Settings → Variables and Secrets → Add (type **Secret**), or `wrangler secret put`.

---

## Notion integration

- Token lives **only** as the `NOTION_TOKEN` secret (rotated 2026-07-27; the old hardcoded literal was removed from the Worker code).
- The Notion integration is still named **"Weekly Review"** (cosmetic; may rename to RenitaOS someday).
- Token format is `ntn_…` — treat it as a password; never commit it.

---

## Google Calendar auth (multi-account, no hub)

- **One OAuth client**, owned by Nita's **personal Gmail**, set to **External + In production** (this is what makes refresh tokens permanent — External + *Testing* expires them after 7 days). Scope: `calendar.readonly` (a "sensitive" scope, so no Google verification is required for personal use — you just click through the "unverified app" screen).
- **No hub / no calendar consolidation.** Each Google account grants the app **independently**, producing **one refresh token per account**, each stored as its own Worker secret. Currently granted: **MTS** and **personal**. **SM** is not yet granted (add anytime).
- The Worker reads each account's `calendarList`, pulls events per calendar with `singleEvents=true`, tags each event with its account, and merges.

**To add an account later (e.g. SM):**
1. OAuth Playground → gear → "Use your own OAuth credentials" (paste the client ID + secret) → Access type Offline, Force consent.
2. Authorize `calendar.readonly` → sign in as that account → exchange for tokens → copy the **refresh token**.
3. Add it as a Worker secret `GCAL_REFRESH_TOKEN_<KEY>`.
4. Add a `{ key, label, refreshSecret }` entry to the `CAL_ACCOUNTS` array in the Worker.

**Constraint learned:** a Google Workspace admin *can* block external sharing/third-party apps. MTS allowed the grant, so no admin ask was needed — but if a future account is on a locked-down Workspace, that's the thing to check.

---

## The fixed six domains

**RCBS · RWS · SM · MTS · EPLC · PEEPS.** Their colors, the six catch-all Inbox/Admin project page IDs, and the six domain page IDs are hardcoded in the app config / Backend Notes §4. **Never create new domains** — the six are fixed and everything is keyed to them.

---

## Deploy discipline (learned the hard way)

- **App:** push to `main` → GitHub Pages builds. **A pushed branch is not a deploy** — confirm the commits are on `main`, the build went green, and the **version stamp** in the corner bumped before assuming code is live.
- **Worker:** dashboard **Save & Deploy** (or `npx wrangler deploy` if it's later connected to a repo).
- The **version stamp** answers "is my code live?" at a glance — check it after every deploy.

---

## Fast health checks

- **Notion working?** The app loads/edits records (a Notion write like completing a task succeeds).
- **Calendar working?** The Today right rail shows events instead of "Calendar unavailable." (Don't test via the raw `/calendar/events` URL — 403 by origin lock.)
