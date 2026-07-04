// The capture grammar: splits a braindump into per-thought entries and parses
// each entry independently into a structured "thought" descriptor. Pure
// functions — no Notion calls here (see cache.js / notion.js / app.js).
import { TYPE_SET, DOMAIN_CODES } from './config.js';
import { findNearMatch } from './similarity.js';
import { parseLocalDate } from './dateParse.js';

const TOKEN_RE = /(^|\s)([#@!%])([A-Za-z0-9][A-Za-z0-9'-]*)/g;

// A new entry starts at any line beginning with /type or a leading +, or
// after a blank line. Continuation lines with no marker stay attached to the
// entry above. Returns {text, offset} so callers can map a token back to its
// absolute position in the full textarea value.
export function splitEntries(text) {
  const lines = text.split('\n');
  const entries = [];
  let current = [];
  let currentOffset = 0;
  let pos = 0;
  const startsMarker = (line) => /^\s*(\/[A-Za-z]+|\+)/.test(line);
  const flush = () => {
    if (current.length) entries.push({ text: current.join('\n'), offset: currentOffset });
    current = [];
  };
  for (const line of lines) {
    if (line.trim() === '') {
      flush();
    } else if (startsMarker(line) && current.length) {
      flush();
      current = [line];
      currentOffset = pos;
    } else {
      if (!current.length) currentOffset = pos;
      current.push(line);
    }
    pos += line.length + 1; // +1 for the '\n' split away
  }
  flush();
  return entries;
}

function classify(symbol, rawValue, isPending, names, confirmedNew, absStart, absEnd) {
  const key = `${symbol}:${rawValue.toLowerCase()}`;
  const base = { symbol, key, value: rawValue, absStart, absEnd };
  const exact = names.find((n) => n.toLowerCase() === rawValue.toLowerCase());
  if (exact) return { ...base, state: 'confirmed', canonical: exact };
  if (isPending) return { ...base, state: 'pending' };
  if (confirmedNew.has(key)) return { ...base, state: 'willCreate', confirmed: true };
  const suggestion = findNearMatch(rawValue, names);
  if (suggestion) return { ...base, state: 'nearMatch', suggestion };
  return { ...base, state: 'willCreate', confirmed: false };
}

function classifyDomain(rawValue, isPending, absStart, absEnd) {
  const base = { symbol: '%', value: rawValue, absStart, absEnd };
  const canonical = DOMAIN_CODES.find((c) => c.toLowerCase() === rawValue.toLowerCase());
  if (canonical) return { ...base, state: 'confirmed', canonical };
  if (isPending) return { ...base, state: 'pending' };
  return { ...base, state: 'invalid' };
}

function deriveTitle(body) {
  const words = body.split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const slice = words.slice(0, 8).join(' ');
  return words.length > 8 ? `${slice}…` : slice;
}

// Parses ONE entry's raw text. `caches` is a LookupCache; `confirmedNew` is a
// Set of "symbol:lowercasevalue" keys the user has already tapped to approve
// creating (see app.js chip handlers). `offset` is this entry's start index
// within the full textarea value, used to give each chip an absolute span so
// a "did you mean?" tap can splice the exact occurrence in the source text.
export function parseEntry(raw, caches, confirmedNew, offset = 0) {
  if (!raw.trim()) return null;

  const isTask = /^\s*\+/.test(raw);

  let typeName = null;
  const typeMatch = raw.match(/(^|\s)\/([A-Za-z]+)/);
  let typeSpan = null;
  if (typeMatch) {
    const canonical = TYPE_SET.find((t) => t.toLowerCase() === typeMatch[2].toLowerCase());
    if (canonical) {
      typeName = canonical;
      typeSpan = { start: typeMatch.index + typeMatch[1].length, end: typeMatch.index + typeMatch[0].length };
    }
  }

  // Tasks have no Type field (§2) — [title] override is only documented for
  // Notes, so brackets in a Task entry are left as literal text.
  let explicitTitle = null;
  let titleSpan = null;
  if (!isTask) {
    const titleMatch = raw.match(/\[([^\]\n]+)\]/);
    if (titleMatch) {
      explicitTitle = titleMatch[1].trim();
      titleSpan = { start: titleMatch.index, end: titleMatch.index + titleMatch[0].length };
    }
  }

  const removeSpans = [];
  if (typeSpan) removeSpans.push(typeSpan);
  if (titleSpan) removeSpans.push(titleSpan);

  let domain = null;
  const tags = [];
  const people = [];
  const projects = [];
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(raw))) {
    const symbol = m[2];
    const rawValue = m[3];
    const start = m.index + m[1].length;
    const end = m.index + m[0].length;
    const isPending = end === raw.length;

    if (symbol === '@') {
      // Only the '@' character is recognized syntax — the name stays in the prose.
      removeSpans.push({ start, end: start + 1 });
      const chip = classify('@', rawValue, isPending, caches.names(caches.people), confirmedNew, offset + start, offset + end);
      chip.initial = rawValue[0] ? rawValue[0].toUpperCase() : '?';
      people.push(chip);
      continue;
    }

    removeSpans.push({ start, end });

    if (symbol === '#') {
      tags.push(classify('#', rawValue, isPending, caches.names(caches.tags), confirmedNew, offset + start, offset + end));
    } else if (symbol === '!') {
      projects.push(classify('!', rawValue, isPending, caches.names(caches.projects), confirmedNew, offset + start, offset + end));
    } else if (symbol === '%' && !domain) {
      domain = classifyDomain(rawValue, isPending, offset + start, offset + end);
    }
  }

  removeSpans.sort((a, b) => a.start - b.start);
  let body = '';
  let cursor = 0;
  for (const span of removeSpans) {
    if (span.end <= cursor) continue;
    const start = Math.max(span.start, cursor);
    body += raw.slice(cursor, start);
    cursor = span.end;
  }
  body += raw.slice(cursor);
  body = body.replace(/^\s*\+/, '').replace(/\s+/g, ' ').trim();

  const dueDateISO = isTask ? parseLocalDate(body) : null;
  const title = isTask ? body : (explicitTitle || deriveTitle(body));

  return {
    raw,
    isTask,
    typeLabel: typeName || (isTask ? 'Task' : 'Note'),
    noteType: !isTask ? typeName : null,
    domain,
    tags,
    people,
    projects,
    title,
    body,
    dueDateISO,
  };
}

export function computeThoughts(text, caches, confirmedNew) {
  if (!text.trim()) return [];
  return splitEntries(text)
    .map((entry) => parseEntry(entry.text, caches, confirmedNew, entry.offset))
    .filter(Boolean);
}
