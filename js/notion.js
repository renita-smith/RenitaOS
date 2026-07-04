// All Notion access goes through the Cloudflare Worker proxy — the app never
// calls api.notion.com directly and never sees the integration token.
import { WORKER_URL, NOTION_VERSION } from './config.js';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${WORKER_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
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
