// The capture grammar: splits a braindump into per-thought entries and parses
// each entry independently into a structured "thought" descriptor. Pure
// functions — no Notion calls here (see cache.js / notion.js / app.js).
import { TYPE_SET, DOMAIN_CODES, DAY_MERGE_TYPE, TYPE_PREFIXES } from './config.js';
import { findNearMatch } from './similarity.js';
import { parseLocalDate, todayISO } from './dateParse.js';

// Finds the next occurrence of any of `symbolChars` at a word boundary,
// starting the search at or after `from`. Returns {symbol, symbolIndex} or
// null. The value that follows is resolved separately (see resolveToken)
// since it may span multiple words ("Becky Fuller", "Prophetic Word").
function nextSymbol(raw, from, symbolChars) {
  const re = new RegExp(`(^|\\s)([${symbolChars}])`, 'g');
  re.lastIndex = from;
  const m = re.exec(raw);
  if (!m) return null;
  return { symbol: m[2], symbolIndex: m.index + m[1].length };
}

const WORD_RE = /^[A-Za-z0-9][A-Za-z0-9'-]*/;

// Whitespace and common sentence punctuation both end a token — "@Becky."
// must resolve to "Becky" with the period left in the body, not rejected as
// unbounded.
function isBoundaryChar(ch) {
  return ch === undefined || /[\s.,;:!?]/.test(ch);
}

// Longest exact (case-insensitive) match of a known candidate starting at
// `pos`, that ends at a word boundary — so "Becky Fuller" matches as one
// value instead of just "Becky".
function matchKnownExact(text, pos, candidates) {
  const remainder = text.slice(pos);
  const sorted = candidates.slice().sort((a, b) => b.length - a.length);
  for (const cand of sorted) {
    if (remainder.length < cand.length) continue;
    if (remainder.slice(0, cand.length).toLowerCase() !== cand.toLowerCase()) continue;
    if (isBoundaryChar(remainder[cand.length])) return { value: cand, end: pos + cand.length };
  }
  return null;
}

// Resolves the value following a symbol at `pos`: an exact known-candidate
// match (possibly multi-word) wins. Otherwise, if everything from `pos` to
// the end of the entry is itself a case-insensitive prefix of some known
// candidate, the whole typed-so-far run (including internal spaces) is kept
// as the pending value — so "Becky Fu|" still ghosts as one token instead of
// truncating to just "Becky". Trailing prose that ISN'T part of a known name
// breaks the prefix test naturally, so this never swallows a whole sentence.
// Failing both, fall back to a bare single word.
function resolveToken(raw, pos, candidates, wordRe) {
  const exact = matchKnownExact(raw, pos, candidates);
  if (exact) return exact;
  const remainder = raw.slice(pos);
  if (remainder && candidates.some((c) => c.toLowerCase().startsWith(remainder.toLowerCase()))) {
    return { value: remainder, end: raw.length };
  }
  const m = remainder.match(wordRe);
  const word = m ? m[0] : '';
  return { value: word, end: pos + word.length };
}

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

// Title cascade (Edit Slice Build Brief §9, revised):
// Task -> own text (handled by the caller, before this is ever consulted).
// Dream -> "DRM | MMDDYY" always (never a typed [title]) — see
// dreamTitle() below. [title] -> verbatim, no prefix. Otherwise, a typed
// Type with a known prefix -> "{PREFIX} | {snippet}"; untyped -> a plain
// snippet, no prefix. Empty body/no snippet -> "Untitled".
const SNIPPET_WORD_COUNT = 5;

function deriveTitle(body) {
  const words = body.split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const slice = words.slice(0, SNIPPET_WORD_COUNT).join(' ');
  return words.length > SNIPPET_WORD_COUNT ? `${slice}…` : slice;
}

// MMDDYY from the note's own Date field — Capture always sets Date to
// today (§10; there's no pre-save date adjustment in Capture itself), so
// "today" is that field's value at the point a title is generated here.
function dreamTitle() {
  const [y, m, d] = todayISO().split('-');
  return `DRM | ${m}${d}${y.slice(-2)}`;
}

// Parses ONE entry's raw text. `caches` is a LookupCache; `confirmedNew` is a
// Set of "symbol:lowercasevalue" keys the user has already tapped to approve
// creating (see app.js chip handlers). `offset` is this entry's start index
// within the full textarea value, used to give each chip an absolute span so
// a "did you mean?" tap can splice the exact occurrence in the source text.
export function parseEntry(raw, caches, confirmedNew, offset = 0) {
  if (!raw.trim()) return null;

  const isTask = /^\s*\+/.test(raw);

  // Only a FULL match against the known Type set counts (incl. two-word
  // values like "Prophetic Word") — a non-matching /word is left as plain text.
  let typeName = null;
  let typeSpan = null;
  const slashStart = nextSymbol(raw, 0, '/');
  if (slashStart) {
    const exact = matchKnownExact(raw, slashStart.symbolIndex + 1, TYPE_SET);
    if (exact) {
      typeName = exact.value;
      typeSpan = { start: slashStart.symbolIndex, end: exact.end };
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
  let searchPos = 0;
  while (searchPos <= raw.length) {
    const found = nextSymbol(raw, searchPos, '#@!%');
    if (!found) break;
    const { symbol, symbolIndex } = found;
    const valueStart = symbolIndex + 1;
    if (!WORD_RE.test(raw.slice(valueStart))) { searchPos = valueStart; continue; }

    const candidateList = symbol === '#' ? caches.names(caches.tags)
      : symbol === '@' ? caches.names(caches.people)
      : symbol === '!' ? caches.names(caches.projects)
      : DOMAIN_CODES;
    const { value: rawValue, end } = resolveToken(raw, valueStart, candidateList, WORD_RE);
    const isPending = end === raw.length;
    searchPos = end;

    if (symbol === '@') {
      // Only the '@' character is recognized syntax — the name stays in the prose.
      removeSpans.push({ start: symbolIndex, end: symbolIndex + 1 });
      const chip = classify('@', rawValue, isPending, caches.names(caches.people), confirmedNew, offset + symbolIndex, offset + end);
      chip.initial = rawValue[0] ? rawValue[0].toUpperCase() : '?';
      people.push(chip);
      continue;
    }

    removeSpans.push({ start: symbolIndex, end });

    if (symbol === '#') {
      tags.push(classify('#', rawValue, isPending, caches.names(caches.tags), confirmedNew, offset + symbolIndex, offset + end));
    } else if (symbol === '!') {
      projects.push(classify('!', rawValue, isPending, caches.names(caches.projects), confirmedNew, offset + symbolIndex, offset + end));
    } else if (symbol === '%' && !domain) {
      domain = classifyDomain(rawValue, isPending, offset + symbolIndex, offset + end);
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
  body = body.replace(/^\s*\+/, '').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();

  const dueDateISO = isTask ? parseLocalDate(body) : null;
  // §9 — the prefix decorates only the auto-generated snippet default,
  // never an explicit/typed title (checked first, below) and never Dream
  // (already its own fixed format). No prefix at all for an untyped note.
  const snippet = deriveTitle(body);
  const prefix = typeName && TYPE_PREFIXES[typeName];
  const prefixedSnippet = prefix && snippet ? `${prefix} | ${snippet}` : snippet;
  const title = isTask
    ? body
    : typeName === DAY_MERGE_TYPE
      ? dreamTitle()
      : (explicitTitle || prefixedSnippet || 'Untitled');

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
