// In-memory title -> id caches for the lookup databases (Tags/People/Projects),
// so token classification while typing is instant. Refreshed after any create.
// Domains are the fixed §4 set (resolved straight from config.js), not queried.
import { DB } from './config.js';
import { queryAllPages } from './notion.js';
import { titlePropertyName } from './schema.js';

function titleOf(page, propName) {
  const prop = page.properties[propName];
  const arr = prop && prop.title;
  if (!arr || !arr.length) return '';
  return arr.map((t) => t.plain_text).join('');
}

async function loadEntries(databaseId) {
  const titleProp = await titlePropertyName(databaseId);
  const pages = await queryAllPages(databaseId);
  return { titleProp, entries: pages.map((page) => ({ id: page.id, name: titleOf(page, titleProp) })).filter((e) => e.name) };
}

export class LookupCache {
  constructor() {
    this.tags = [];
    this.people = [];
    this.projects = [];
    this.titleProps = { tags: null, people: null, projects: null };
  }

  async load() {
    const [tags, people, projects] = await Promise.all([
      loadEntries(DB.TAGS),
      loadEntries(DB.PEOPLE),
      loadEntries(DB.PROJECTS),
    ]);
    this.tags = tags.entries;
    this.people = people.entries;
    this.projects = projects.entries;
    this.titleProps = { tags: tags.titleProp, people: people.titleProp, projects: projects.titleProp };
  }

  findExact(list, value) {
    const q = value.toLowerCase();
    return list.find((e) => e.name.toLowerCase() === q) || null;
  }

  names(list) {
    return list.map((e) => e.name);
  }

  addEntry(list, entry) {
    list.push(entry);
  }
}
