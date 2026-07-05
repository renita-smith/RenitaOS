// Single source of truth for Notion schema data. Values copied verbatim from
// RenitaOS-Backend-Notes-Template.md — edit here (not in code) if a Notion
// property/database ever gets renamed.

export const WORKER_URL = 'https://notion-proxy.renitacbsmith.workers.dev';
export const NOTION_VERSION = '2022-06-28';

export const DB = {
  NOTES: '6340f2b86ac94447a8315f0ba87545e3',
  TASKS: '33110b0375a880c18918ebac71592a35',
  PEOPLE: '8d6efff49ade4c188a03a5203320644d',
  PROJECTS: '33110b0375a88054b94bfda7c3e93ddb',
  DOMAINS: '33110b0375a88024b4f2c8e6beaca80e',
  TAGS: '1a39ff9fd10747ad9d418577707c012f',
};

// Title properties are never hardcoded — schema.js resolves each database's
// title property by its actual type ('title') at runtime, so a rename in
// Notion never silently breaks a save.

// Exact non-title property names on the Notes database (§2).
export const NOTES_PROP = {
  TYPE: 'Type',
  DATE: 'Date',
  STATUS: 'Status',
  DOMAINS: 'Domains',
  PROJECTS: 'Projects',
  PEOPLE: 'People',
  TAGS: 'Tags',
};

// Exact non-title property names on the Tasks database (§2). "People" is
// used for the "For" field — confirm against your actual database if the
// property is literally named "For" instead.
export const TASKS_PROP = {
  PROJECTS: 'Projects',
  DUE_DATE: 'Due Date',
  DO_DATE: 'Do Date',
  STATUS: 'Status',
  PEOPLE: 'People',
};

export const NOTE_STATUS_INBOX = 'Inbox';
export const TASK_STATUS_INBOX = 'Inbox';

// §5 controlled Type set — the only values /word may resolve to.
export const TYPE_SET = [
  'Dream', 'Thought', 'Idea', 'Convo', 'Sermon', 'Prophetic Word',
  'Virtual', 'Teaching', 'Prayer', 'Quote', 'Study', 'Reflection', 'Download',
];

// §12 — a Dream capture merges into the day's existing Dream page instead of
// creating a new one.
export const DAY_MERGE_TYPE = 'Dream';

// §4 — Domain code -> its page id, catch-all project name/id, and CSS var.
export const DOMAINS = {
  RCBS:  { pageId: '33110b0375a8800fa48dcf469ed04677', catchAllProjectId: '39310b0375a880a3bfafe163619679e3', catchAllName: '💚 RCBS - Inbox/Admin', cssVar: '--domain-rcbs' },
  RWS:   { pageId: '33210b0375a880b79f77d0509dae6d65', catchAllProjectId: '39310b0375a880008c2bc21fa471c95b', catchAllName: '💡 RWS - Inbox/Admin',  cssVar: '--domain-rws' },
  SM:    { pageId: '33210b0375a88014ac55d4c88117f218', catchAllProjectId: '39310b0375a880e282dfc70f942b0a67', catchAllName: '💒 SM - Inbox/Admin',   cssVar: '--domain-sm' },
  MTS:   { pageId: '33210b0375a88000b144fc1ce2cd5758', catchAllProjectId: '39310b0375a880d9a10ce4d29c2015be', catchAllName: '👩🏽‍💼 MTS - Inbox/Admin', cssVar: '--domain-mts' },
  EPLC:  { pageId: '33210b0375a88006910bc1c5e4cc7e4f', catchAllProjectId: '39310b0375a880f79aa6c95bbdae6913', catchAllName: '🏫 EPLC - Inbox/Admin', cssVar: '--domain-eplc' },
  PEEPS: { pageId: '38a10b0375a880e38ed6fcbb8a5f2b9b', catchAllProjectId: '39310b0375a8804184cced41ad1395c0', catchAllName: '👥 PEEPS - Inbox/Admin', cssVar: '--domain-peeps' },
};

export const DOMAIN_CODES = Object.keys(DOMAINS);
