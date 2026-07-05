// Resolves each database's title property by its actual type ('title'),
// never by a hardcoded name — a rename in Notion should never silently
// break a save. Results are memoized per database for the life of the page.
import { getDatabase } from './notion.js';

const titlePropCache = new Map();

export async function titlePropertyName(databaseId) {
  if (titlePropCache.has(databaseId)) return titlePropCache.get(databaseId);
  const db = await getDatabase(databaseId);
  const [name] = Object.entries(db.properties).find(([, prop]) => prop.type === 'title');
  titlePropCache.set(databaseId, name);
  return name;
}
