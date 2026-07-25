import {
  DB, NOTES_PROP, TASKS_PROP, NOTE_STATUS_INBOX, TASK_STATUS_INBOX,
  TYPE_SET, DOMAIN_CODES, DOMAINS, DAY_MERGE_TYPE, TYPE_EDGE, TYPE_EDGE_DEFAULT,
} from './config.js';
import { queryAllPages, createPage, updatePageProperties, appendBlockChildren, paragraphBlocks, dividerBlock } from './notion.js';
import { todayISO } from './dateParse.js';
import { titlePropertyName, relationPropertyName, resolveMultiSelectOption } from './schema.js';
import { LookupCache } from './cache.js';
import { computeThoughts } from './parse.js';

const TRIGGER_SOURCE = {
  '#': (caches) => caches.names(caches.tags),
  '@': (caches) => caches.names(caches.people),
  '!': (caches) => caches.names(caches.projects),
  '%': () => DOMAIN_CODES,
  '/': () => TYPE_SET,
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleProperty(value) {
  return { title: [{ text: { content: value } }] };
}

function unionIds(a, b) {
  return Array.from(new Set([...a, ...b]));
}

// Display only — Notion still gets the full ISO date (see saveThought).
function formatDueDisplay(iso) {
  const [, month, day] = iso.split('-');
  return `${month}-${day}`;
}

const state = {
  text: '',
  titleText: '',
  mode: 'type',
  taskManual: false,
  confirmedNew: new Set(),
  autocomplete: null,
  recent: [],
  toast: '',
  toastAction: null,
  saving: false,
};

const caches = new LookupCache();

const el = {
  titleInput: document.getElementById('titleInput'),
  textarea: document.getElementById('captureText'),
  autocomplete: document.getElementById('autocomplete'),
  taskPill: document.getElementById('taskPill'),
  voicePanel: document.getElementById('voicePanel'),
  photoPanel: document.getElementById('photoPanel'),
  manualTaskToggles: Array.from(document.querySelectorAll('.manual-task-toggle')),
  modeBtns: Array.from(document.querySelectorAll('.mode-btn')),
  recognizedSection: document.getElementById('recognizedSection'),
  thoughtsList: document.getElementById('thoughtsList'),
  saveBtn: document.getElementById('saveBtn'),
  recentSection: document.getElementById('recentSection'),
  recentList: document.getElementById('recentList'),
  toast: document.getElementById('toast'),
  closeBtn: document.getElementById('closeBtn'),
};

let toastTimer = null;

function computeIsTask() {
  if (state.mode === 'type') return /^\s*\+/.test(state.text);
  return state.taskManual;
}

function chipClasses(chip) {
  const base = {
    confirmed: 'chip chip--confirmed',
    nearMatch: 'chip chip--near',
    willCreate: 'chip chip--create',
    pending: 'chip chip--pending',
    invalid: 'chip chip--invalid',
  }[chip.state];
  return chip.state === 'willCreate' && chip.confirmed ? `${base} chip--confirmed-new` : base;
}

function chipAttrs(chip) {
  return `data-symbol="${chip.symbol}" data-key="${escapeHtml(chip.key || '')}" data-start="${chip.absStart}" data-end="${chip.absEnd}" data-suggestion="${escapeHtml(chip.suggestion || '')}"`;
}

function chipAction(chip) {
  if (chip.state === 'nearMatch') return 'accept-suggestion';
  if (chip.state === 'willCreate') return 'toggle-create';
  return '';
}

function chipExtra(chip, symbolPrefix) {
  if (chip.state === 'nearMatch') {
    return `<span class="chip-hint">did you mean ${symbolPrefix}${escapeHtml(chip.suggestion)}? <button class="chip-force-new" ${chipAttrs(chip)} data-action="force-new">new instead</button></span>`;
  }
  if (chip.state === 'willCreate') {
    return chip.confirmed
      ? `<span class="chip-confirm chip-confirm--yes">✓ Will create</span>`
      : `<span class="chip-confirm chip-confirm--no">Create?</span>`;
  }
  return '';
}

function renderPersonChip(chip) {
  const label = chip.state === 'pending' ? `${chip.value}…` : chip.value;
  const action = chipAction(chip);
  return `<div class="${chipClasses(chip)}" ${action ? `data-action="${action}" ${chipAttrs(chip)}` : ''}>
    <span class="chip-avatar">${escapeHtml(chip.initial)}</span>
    <span class="chip-label">${escapeHtml(label)}</span>
    ${chipExtra(chip, '')}
  </div>`;
}

function renderTagChip(chip) {
  const label = chip.state === 'pending' ? `${chip.value}…` : chip.value;
  const action = chipAction(chip);
  return `<div class="${chipClasses(chip)}" ${action ? `data-action="${action}" ${chipAttrs(chip)}` : ''}>
    <span class="chip-label">#${escapeHtml(label)}</span>
    ${chipExtra(chip, '#')}
  </div>`;
}

// Projects are intentionally not surfaced as their own chip when confirmed
// (design brief: "recognized + stripped from body, but NOT displayed as its
// own card element") — only shown when it needs your attention to confirm.
function renderProjectChip(chip) {
  if (chip.state === 'confirmed' || chip.state === 'pending') return '';
  return `<div class="${chipClasses(chip)} chip--project" data-action="${chipAction(chip)}" ${chipAttrs(chip)}>
    <span class="chip-label">!${escapeHtml(chip.value)}</span>
    ${chipExtra(chip, '!')}
  </div>`;
}

function renderDomainBadge(domain) {
  if (!domain) return '';
  if (domain.state === 'confirmed') {
    const cfg = DOMAINS[domain.canonical];
    return `<span class="domain-badge" style="--domain-color:var(${cfg.cssVar})">${escapeHtml(domain.canonical)}</span>`;
  }
  if (domain.state === 'pending') return `<span class="domain-badge domain-badge--pending">${escapeHtml(domain.value)}…</span>`;
  return `<span class="domain-badge domain-badge--invalid" title="Domains can't be created — must match RCBS/RWS/SM/MTS/EPLC/PEEPS">${escapeHtml(domain.value)}?</span>`;
}

function renderThoughtCard(thought) {
  const chips = [
    ...thought.people.map(renderPersonChip),
    ...thought.tags.map(renderTagChip),
    ...thought.projects.map(renderProjectChip),
  ].filter(Boolean).join('');
  // B5 (Cycle 3) — retint the card's left border/dot/label to the app's
  // one canonical Type palette (index.html's Triage TYPE_EDGE) instead of
  // Capture's pre-palette flat olive for every type.
  const edgeColor = TYPE_EDGE[thought.typeLabel] || TYPE_EDGE_DEFAULT;

  return `<div class="thought-card" data-type="${escapeHtml(thought.typeLabel)}" style="--type-color:${edgeColor}">
    <div class="thought-head">
      <span class="thought-dot"></span>
      <span class="thought-type">${escapeHtml(thought.typeLabel)}</span>
      ${renderDomainBadge(thought.domain)}
      <div class="spacer"></div>
      ${thought.isTask ? `<span class="due-chip">${thought.dueDateISO ? `Due ${escapeHtml(formatDueDisplay(thought.dueDateISO))}` : '+ Due date'}</span>` : ''}
    </div>
    ${thought.body ? `<div class="thought-body">${escapeHtml(thought.body)}</div>` : ''}
    ${chips ? `<div class="chip-row">${chips}</div>` : ''}
  </div>`;
}

// Fix 24 (Cycle 4) — the title field only ever applies to a capture that
// resolves to exactly one plain Note: a Task titles from its own text, a
// bare !project names from its token, a Dream's title names the day it
// merges into (§9), and a multi-entry braindump has no single target for
// one title. Parsed once with no override to check eligibility by SHAPE
// (title text never affects segmentation/isTask/isBareRelation/noteType),
// then — only if eligible — re-parsed with the override applied. This
// keeps the field not just hidden but functionally inert the moment the
// capture stops qualifying, instead of a stale typed title silently
// reattaching itself if the shape flickers back and forth while typing.
function computeVisibleThoughts() {
  const bare = computeThoughts(state.text, caches, state.confirmedNew, '');
  const eligible = bare.length === 1 && !bare[0].isTask && !bare[0].isBareRelation && bare[0].noteType !== DAY_MERGE_TYPE;
  const thoughts = eligible && state.titleText
    ? computeThoughts(state.text, caches, state.confirmedNew, state.titleText)
    : bare;
  return { thoughts, eligible };
}

function render() {
  // Programmatic edits (autocomplete pick, accept-suggestion, clear, save)
  // mutate state.text directly — sync it back to the DOM here. Typing itself
  // already keeps el.textarea.value === state.text, so this is a no-op then.
  if (el.textarea.value !== state.text) el.textarea.value = state.text;
  if (el.titleInput.value !== state.titleText) el.titleInput.value = state.titleText;

  const isTask = computeIsTask();
  el.taskPill.textContent = isTask ? 'Task' : 'Note';
  el.taskPill.classList.toggle('task-pill--task', isTask);

  el.modeBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === state.mode));
  el.voicePanel.classList.toggle('hidden', state.mode !== 'voice');
  el.photoPanel.classList.toggle('hidden', state.mode !== 'photo');
  el.manualTaskToggles.forEach((btn) => { btn.textContent = state.taskManual ? '✓ Task' : 'Mark as Task'; });

  el.saveBtn.disabled = state.saving || state.mode !== 'type';
  el.saveBtn.textContent = state.saving ? 'Saving…' : 'Save to Inbox';

  const { thoughts, eligible } = computeVisibleThoughts();
  el.recognizedSection.classList.toggle('hidden', thoughts.length === 0);
  el.thoughtsList.innerHTML = thoughts.map(renderThoughtCard).join('');

  el.titleInput.classList.toggle('hidden', !eligible);

  if (state.autocomplete) {
    const names = TRIGGER_SOURCE[state.autocomplete.trigger](caches);
    const matches = names.filter((n) => n.toLowerCase().startsWith(state.autocomplete.query.toLowerCase())).slice(0, 6);
    if (matches.length) {
      el.autocomplete.classList.remove('hidden');
      el.autocomplete.innerHTML = matches.map((name, i) => `<div class="ac-item" data-index="${i}">
        <span class="ac-trigger">${escapeHtml(state.autocomplete.trigger)}</span>${escapeHtml(name)}
      </div>`).join('');
      state.autocomplete.list = matches;
    } else {
      el.autocomplete.classList.add('hidden');
      el.autocomplete.innerHTML = '';
    }
  } else {
    el.autocomplete.classList.add('hidden');
    el.autocomplete.innerHTML = '';
  }

  el.recentSection.classList.toggle('hidden', state.recent.length === 0);
  el.recentList.innerHTML = state.recent.map((r) => `<div class="recent-row">
    <span class="recent-dot" style="background:${r.isTask ? 'oklch(0.6 0.11 275)' : 'oklch(0.8 0.01 75)'}"></span>
    <span class="recent-text">${escapeHtml(r.text)}</span>
    <span class="recent-when">${escapeHtml(r.when)}</span>
  </div>`).join('');

  el.toast.classList.toggle('hidden', !state.toast);
  el.toast.classList.toggle('toast--link', !!state.toastAction);
  el.toast.textContent = state.toast;
}

// `action`, when given, makes the toast clickable (Fix 23) — e.g. the
// post-save confirmation links to the Inbox. Guardrail: if the user starts
// a new capture before the toast clears on its own, the textarea's input
// handler below dismisses it early, so a stray tap can't yank them away
// from a draft they've already started typing.
function showToast(message, ms = 2200, action = null) {
  clearTimeout(toastTimer);
  state.toast = message;
  state.toastAction = action;
  render();
  toastTimer = setTimeout(() => { state.toast = ''; state.toastAction = null; render(); }, ms);
}

el.toast.addEventListener('click', () => {
  if (state.toastAction) state.toastAction();
});

function updateAutocomplete() {
  const pos = el.textarea.selectionStart;
  const before = state.text.slice(0, pos);
  const m = before.match(/(^|\s)([#@!%/])([a-zA-Z0-9]*)$/);
  if (m) {
    state.autocomplete = { trigger: m[2], query: m[3], tokenStart: pos - m[3].length - 1, tokenEnd: pos };
  } else {
    state.autocomplete = null;
  }
}

function pickAutocomplete(name) {
  const { trigger, tokenStart, tokenEnd } = state.autocomplete;
  state.text = state.text.slice(0, tokenStart) + trigger + name + ' ' + state.text.slice(tokenEnd);
  state.autocomplete = null;
  render();
  el.textarea.focus();
  const caret = tokenStart + trigger.length + name.length + 1;
  el.textarea.setSelectionRange(caret, caret);
}

el.textarea.addEventListener('input', () => {
  state.text = el.textarea.value;
  // Fix 23 guardrail — a fresh keystroke means a new capture is under way;
  // drop any still-showing "Saved to Inbox" link early so it can't be
  // mistapped mid-typing and yank the user away from this draft.
  if (state.toastAction) { clearTimeout(toastTimer); state.toast = ''; state.toastAction = null; }
  updateAutocomplete();
  render();
});
el.textarea.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
    updateAutocomplete();
    render();
  }
});
el.textarea.addEventListener('click', () => { updateAutocomplete(); render(); });

el.titleInput.addEventListener('input', () => {
  state.titleText = el.titleInput.value;
  render();
});

el.autocomplete.addEventListener('click', (e) => {
  const item = e.target.closest('.ac-item');
  if (!item) return;
  pickAutocomplete(state.autocomplete.list[Number(item.dataset.index)]);
});

el.modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    state.mode = btn.dataset.mode;
    state.autocomplete = null;
    render();
  });
});

el.manualTaskToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    state.taskManual = !state.taskManual;
    render();
  });
});

el.thoughtsList.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'toggle-create') {
    const key = target.dataset.key;
    if (state.confirmedNew.has(key)) state.confirmedNew.delete(key);
    else state.confirmedNew.add(key);
    render();
  } else if (action === 'accept-suggestion') {
    const start = Number(target.dataset.start);
    const end = Number(target.dataset.end);
    const symbol = target.dataset.symbol;
    const suggestion = target.dataset.suggestion;
    state.text = state.text.slice(0, start) + symbol + suggestion + state.text.slice(end);
    render();
    el.textarea.focus();
    const caret = start + symbol.length + suggestion.length;
    el.textarea.setSelectionRange(caret, caret);
  } else if (action === 'force-new') {
    e.stopPropagation();
    const key = target.dataset.key;
    state.confirmedNew.add(key);
    render();
  }
});

// Fix 20 (Cycle 4) — Capture is a persistent affordance invoked from
// anywhere (the topbar "+"), not a nav destination, so "close" means
// dismiss back to wherever it was opened from — history.back() — not a
// fixed destination. Falls back to Home only when there's nothing to go
// back to (e.g. capture.html opened directly/deep-linked).
function dismissCapture() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = './index.html#/home';
}

if (el.closeBtn) {
  el.closeBtn.addEventListener('click', () => {
    state.text = '';
    state.titleText = '';
    state.confirmedNew.clear();
    state.autocomplete = null;
    dismissCapture();
  });
}

async function resolveRelation(chip, list, dbId) {
  if (chip.state === 'confirmed') {
    const entry = caches.findExact(list, chip.canonical);
    return entry ? entry.id : null;
  }
  if (chip.state === 'willCreate' && chip.confirmed) {
    const titleProp = await titlePropertyName(dbId);
    const page = await createPage(dbId, { [titleProp]: titleProperty(chip.value) });
    const entry = { id: page.id, name: chip.value };
    caches.addEntry(list, entry);
    state.confirmedNew.delete(chip.key);
    return page.id;
  }
  return null;
}

async function resolveAll(chips, list, dbId) {
  const ids = [];
  for (const chip of chips) {
    const id = await resolveRelation(chip, list, dbId);
    if (id) ids.push(id);
  }
  return ids;
}

async function saveThought(thought) {
  // B1 (Cycle 3) — a capture whose entire body is a single relation token
  // (!project / #tag / %domain, nothing else) creates just that entity —
  // resolving/creating it if new — and never a stray Note/Task with an
  // empty body. A bare %domain has nothing to create (Domains are the
  // fixed §3 set); recognizing it is enough to suppress the stray note.
  if (thought.isBareRelation) {
    if (thought.tags.length) await resolveAll(thought.tags, caches.tags, DB.TAGS);
    if (thought.projects.length) await resolveAll(thought.projects, caches.projects, DB.PROJECTS);
    return;
  }
  const tagIds = await resolveAll(thought.tags, caches.tags, DB.TAGS);
  const peopleIds = await resolveAll(thought.people, caches.people, DB.PEOPLE);
  const projectIds = await resolveAll(thought.projects, caches.projects, DB.PROJECTS);
  const domainCfg = thought.domain && thought.domain.state === 'confirmed' ? DOMAINS[thought.domain.canonical] : null;

  if (thought.isTask) {
    const finalProjectIds = projectIds.length ? projectIds : (domainCfg ? [domainCfg.catchAllProjectId] : []);
    const [tasksTitleProp, tasksProjectsProp, tasksPeopleProp] = await Promise.all([
      titlePropertyName(DB.TASKS),
      finalProjectIds.length ? relationPropertyName(DB.TASKS, DB.PROJECTS) : null,
      peopleIds.length ? relationPropertyName(DB.TASKS, DB.PEOPLE) : null,
    ]);
    const properties = {
      [tasksTitleProp]: titleProperty(thought.title),
      [TASKS_PROP.STATUS]: { status: { name: TASK_STATUS_INBOX } },
    };
    if (tasksProjectsProp) properties[tasksProjectsProp] = { relation: finalProjectIds.map((id) => ({ id })) };
    if (thought.dueDateISO) properties[TASKS_PROP.DUE_DATE] = { date: { start: thought.dueDateISO } };
    if (tasksPeopleProp) properties[tasksPeopleProp] = { relation: peopleIds.map((id) => ({ id })) };
    await createPage(DB.TASKS, properties);
    return;
  }

  // Type must be written back as the option's exact, live string (e.g.
  // "💤 Dream" for the matched "Dream" keyword) — never the bare parsed
  // token, or Notion creates a new duplicate option instead of tagging the
  // real one. Resolved once here and reused below for the Dream day-merge
  // lookup, which has to match on that same real string to find it.
  const [notesTitleProp, notesDomainsProp, notesProjectsProp, notesPeopleProp, notesTagsProp, resolvedNoteType] = await Promise.all([
    titlePropertyName(DB.NOTES),
    domainCfg ? relationPropertyName(DB.NOTES, DB.DOMAINS) : null,
    projectIds.length ? relationPropertyName(DB.NOTES, DB.PROJECTS) : null,
    relationPropertyName(DB.NOTES, DB.PEOPLE),
    relationPropertyName(DB.NOTES, DB.TAGS),
    thought.noteType ? resolveMultiSelectOption(DB.NOTES, NOTES_PROP.TYPE, thought.noteType) : null,
  ]);
  const properties = {
    [notesTitleProp]: titleProperty(thought.title),
    [NOTES_PROP.TYPE]: { multi_select: resolvedNoteType ? [{ name: resolvedNoteType }] : [] },
    [NOTES_PROP.DATE]: { date: { start: todayISO() } },
    [NOTES_PROP.STATUS]: { status: { name: NOTE_STATUS_INBOX } },
  };
  if (notesDomainsProp) properties[notesDomainsProp] = { relation: [{ id: domainCfg.pageId }] };
  if (notesProjectsProp) properties[notesProjectsProp] = { relation: projectIds.map((id) => ({ id })) };
  if (peopleIds.length) properties[notesPeopleProp] = { relation: peopleIds.map((id) => ({ id })) };
  if (tagIds.length) properties[notesTagsProp] = { relation: tagIds.map((id) => ({ id })) };

  if (thought.noteType === DAY_MERGE_TYPE) {
    // Match on the resolved real option string, not the bare "Dream"
    // keyword — the property actually stores the emoji-prefixed one, and a
    // bare-string filter would silently never find today's existing record.
    const existing = await queryAllPages(DB.NOTES, {
      and: [
        { property: NOTES_PROP.TYPE, multi_select: { contains: resolvedNoteType } },
        { property: NOTES_PROP.DATE, date: { equals: todayISO() } },
      ],
    });
    if (existing.length) {
      const page = existing[0];
      // B4 (Cycle 3) — a subtle native divider between same-day dream
      // entries (Backend §12), reusing the existing append call rather
      // than a bare line break or a second append path.
      await appendBlockChildren(page.id, [dividerBlock(), ...paragraphBlocks(thought.body)]);
      const existingPeople = (page.properties[notesPeopleProp]?.relation || []).map((r) => r.id);
      const existingTags = (page.properties[notesTagsProp]?.relation || []).map((r) => r.id);
      await updatePageProperties(page.id, {
        [notesPeopleProp]: { relation: unionIds(existingPeople, peopleIds).map((id) => ({ id })) },
        [notesTagsProp]: { relation: unionIds(existingTags, tagIds).map((id) => ({ id })) },
      });
      return;
    }
  }

  await createPage(DB.NOTES, properties, paragraphBlocks(thought.body));
}

async function handleSave() {
  if (state.mode !== 'type') {
    showToast("Voice/Photo capture isn't wired up yet — switch to Type to save.");
    return;
  }
  const { thoughts } = computeVisibleThoughts();
  if (!thoughts.length) return;

  state.saving = true;
  render();
  try {
    for (const thought of thoughts) {
      // eslint-disable-next-line no-await-in-loop
      await saveThought(thought);
    }
    const newRecent = thoughts.map((t) => ({
      // A bare-relation capture (B1) has no title/body worth showing —
      // "Untitled" would be actively misleading — so name what actually
      // got created/linked instead.
      text: t.isBareRelation
        ? `${t.typeLabel}: ${(t.projects[0] || t.tags[0] || t.domain || {}).value || ''}`
        : (t.title || t.body),
      isTask: t.isTask,
      when: 'Just now',
    }));
    state.recent = [...newRecent, ...state.recent].slice(0, 3);
    state.text = '';
    state.titleText = '';
    state.taskManual = false;
    state.confirmedNew.clear();
    state.autocomplete = null;
    state.saving = false;
    render();
    el.textarea.focus();
    showToast('Saved to Inbox — tap to view', 2200, () => { window.location.href = './index.html#/inbox'; });
  } catch (err) {
    state.saving = false;
    render();
    showToast(err.message || 'Save failed — try again.', 3500);
  }
}

el.saveBtn.addEventListener('click', handleSave);

async function init() {
  render();
  try {
    await caches.load();
  } catch (err) {
    showToast('Could not load Notion data — check the Worker.', 4000);
  }
  render();
}

init();
