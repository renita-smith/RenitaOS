// In-memory title -> id caches for the lookup databases (Tags/People/Projects),
// so token classification while typing is instant. Refreshed after any create.
// Domains are the fixed §4 set (resolved straight from config.js), not queried.
import { DB, TITLE_PROP } from './config.js';
import { queryAllPages } from './notion.js';

function titleOf(page, propName) {
  const prop = page.properties[propName];
  const arr = prop && prop.title;
  if (!arr || !arr.length) return '';
  return arr.map((t) => t.plain_text).join('');
}

async function loadEntries(databaseId, titleProp) {
  const pages = await queryAllPages(databaseId);
  return pages.map((page) => ({ id: page.id, name: titleOf(page, titleProp) })).filter((e) => e.name);
}

export class LookupCache {
  constructor() {
    this.tags = [];
    this.people = [];
    this.projects = [];
  }

  async load() {
    const [tags, people, projects] = await Promise.all([
      loadEntries(DB.TAGS, TITLE_PROP.TAGS),
      loadEntries(DB.PEOPLE, TITLE_PROP.PEOPLE),
      loadEntries(DB.PROJECTS, TITLE_PROP.PROJECTS),
    ]);
    this.tags = tags;
    this.people = people;
    this.projects = projects;
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
