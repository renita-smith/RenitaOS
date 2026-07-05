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
