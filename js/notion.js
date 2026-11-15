// All Notion access goes through the Cloudflare Worker proxy — the app never
// calls api.notion.com directly and never sees the integration token.
import { WORKER_URL, NOTION_VERSION } from './config.js';

// Nov 2026 — Notion rate limits (per connection: 180 req/min on non-Business
// plans, 60s fixed window; plus a shared per-workspace limit). A 429 means
// Notion did NOT process the request, so retrying is safe for reads and
// writes alike. Wait what Notion asks — `additional_data.retry_after` in the
// body or the Retry-After header (if the Worker exposes it) — else back off
// 1s/2s/4s; a little jitter keeps parallel loads from retrying in lockstep.
// Up to 3 retries, then the original error surfaces as before.
const NOTION_MAX_RETRIES = 3;
async function notionRetryDelayMs(res, attempt) {
  let seconds = null;
  try {
    const data = await res.clone().json();
    if (data && data.additional_data && Number.isFinite(Number(data.additional_data.retry_after))) seconds = Number(data.additional_data.retry_after);
  } catch (err) { /* non-JSON body — fall through */ }
  if (seconds == null) {
    const header = Number(res.headers.get('Retry-After'));
    if (Number.isFinite(header) && header > 0) seconds = header;
  }
  if (seconds == null) seconds = 2 ** attempt; // 1s, 2s, 4s
  return Math.min(seconds, 60) * 1000 + Math.floor(Math.random() * 400);
}
async function request(path, { method = 'GET', body } = {}) {
  let res;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(`${WORKER_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status !== 429 || attempt >= NOTION_MAX_RETRIES) break;
    // eslint-disable-next-line no-await-in-loop
    const delayMs = await notionRetryDelayMs(res, attempt);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Notion request failed (${res.status}): ${detail || res.statusText}`);
  }
  return res.json();
}

// Pages through every result in a database (or a filtered query), used to
// build the in-memory title caches for Tags/People/Projects/Domains.
export async function queryAllPages(databaseId, filter) {
  const results = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (filter) body.filter = filter;
    if (cursor) body.start_cursor = cursor;
    const page = await request(`/v1/databases/${databaseId}/query`, { method: 'POST', body });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

export function getDatabase(databaseId) {
  return request(`/v1/databases/${databaseId}`);
}

export function createPage(databaseId, properties, children) {
  const body = { parent: { database_id: databaseId }, properties };
  if (children && children.length) body.children = children;
  return request('/v1/pages', { method: 'POST', body });
}

export function updatePageProperties(pageId, properties) {
  return request(`/v1/pages/${pageId}`, { method: 'PATCH', body: { properties } });
}

export function appendBlockChildren(pageId, children) {
  return request(`/v1/blocks/${pageId}/children`, { method: 'PATCH', body: { children } });
}

export function paragraphBlocks(text) {
  return text.split('\n').map((line) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: line ? [{ type: 'text', text: { content: line } }] : [] },
  }));
}

// B4 (Cycle 3) — a native Notion divider block, used to separate same-day
// dream entries (Backend §12) instead of a bare line break.
export function dividerBlock() {
  return { object: 'block', type: 'divider', divider: {} };
}
