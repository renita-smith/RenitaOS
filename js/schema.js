// Resolves properties by their actual schema (type, and for relations, their
// target database ID) — never by a hardcoded display name. Notion property
// names can contain emoji or be renamed at any time (e.g. the Notes -> Projects
// relation is literally named "🚧 Projects"); resolving structurally makes
// that irrelevant. Each database's full schema is fetched once and memoized.
import { getDatabase } from './notion.js';

const schemaCache = new Map();

function getSchema(databaseId) {
  if (!schemaCache.has(databaseId)) schemaCache.set(databaseId, getDatabase(databaseId));
  return schemaCache.get(databaseId);
}

function normalizeId(id) {
  return (id || '').replace(/-/g, '').toLowerCase();
}

export async function titlePropertyName(databaseId) {
  const db = await getSchema(databaseId);
  const [name] = Object.entries(db.properties).find(([, prop]) => prop.type === 'title');
  return name;
}

// Finds the property on `sourceDatabaseId` whose relation points at
// `targetDatabaseId`, regardless of its display name.
export async function relationPropertyName(sourceDatabaseId, targetDatabaseId) {
  const db = await getSchema(sourceDatabaseId);
  const target = normalizeId(targetDatabaseId);
  const entry = Object.entries(db.properties).find(
    ([, prop]) => prop.type === 'relation' && normalizeId(prop.relation && prop.relation.database_id) === target
  );
  if (!entry) throw new Error(`No relation property on database ${sourceDatabaseId} targets ${targetDatabaseId}`);
  return entry[0];
}

// Strips emoji/symbols (keeping letters, numbers, spaces) and collapses
// whitespace, so a bare Type-set keyword ("Dream") matches a live option's
// real string regardless of which side its emoji sits on ("💤 Dream" or
// "Dream 💤") — never assumed to be a fixed format.
function normalizeOptionKeyword(str) {
  return (str || '').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

// Resolves `keyword` against a multi_select property's real, live options
// and returns the option's EXACT verbatim string (e.g. "💤 Dream" for
// "Dream"). A write must always use this — never a bare/guessed name — or
// Notion silently creates a duplicate option instead of tagging the
// existing one.
export async function resolveMultiSelectOption(databaseId, propertyName, keyword) {
  const db = await getSchema(databaseId);
  const prop = db.properties[propertyName];
  if (!prop || prop.type !== 'multi_select') {
    throw new Error(`"${propertyName}" is not a multi_select property on database ${databaseId}`);
  }
  const options = (prop.multi_select && prop.multi_select.options) || [];
  const target = normalizeOptionKeyword(keyword);
  const match = options.find((o) => normalizeOptionKeyword(o.name) === target);
  if (!match) throw new Error(`No "${keyword}" option found on the ${propertyName} property for database ${databaseId}`);
  return match.name;
}
