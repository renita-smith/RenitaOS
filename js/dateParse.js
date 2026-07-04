// Local date-phrase parsing for Task Due Date — no AI, no network calls.
// Only confident matches resolve to a date; anything ambiguous returns null
// and Due Date is left blank, per the backend notes.

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d, n) {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() + n);
  return copy;
}

function nextWeekday(referenceDate, targetDow, skipAWeek) {
  const todayDow = referenceDate.getDay();
  let daysAhead = (targetDow - todayDow + 7) % 7;
  if (daysAhead === 0) daysAhead = 7;
  if (skipAWeek) daysAhead += 7;
  return addDays(referenceDate, daysAhead);
}

function resolveYear(month, day, referenceDate, explicitYear) {
  if (explicitYear != null) {
    const year = explicitYear < 100 ? 2000 + explicitYear : explicitYear;
    return new Date(year, month, day);
  }
  const thisYear = referenceDate.getFullYear();
  let candidate = new Date(thisYear, month, day);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  if (candidate < today) candidate = new Date(thisYear + 1, month, day);
  return candidate;
}

export function todayISO(referenceDate = new Date()) {
  return toISODate(referenceDate);
}

// Returns an ISO 'YYYY-MM-DD' string for the first confident date phrase
// found in `text`, or null if nothing confidently matches.
export function parseLocalDate(text, referenceDate = new Date()) {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  if (/\b(today|tonight)\b/i.test(text)) return toISODate(today);
  if (/\btomorrow\b/i.test(text)) return toISODate(addDays(today, 1));

  let m = text.match(/\bin\s+(\d+)\s+day(?:s)?\b/i);
  if (m) return toISODate(addDays(today, parseInt(m[1], 10)));

  m = text.match(/\bin\s+(\d+)\s+week(?:s)?\b/i);
  if (m) return toISODate(addDays(today, parseInt(m[1], 10) * 7));

  m = text.match(/\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
  if (m) return toISODate(nextWeekday(today, WEEKDAYS.indexOf(m[1].toLowerCase()), true));

  m = text.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
  if (m) return toISODate(nextWeekday(today, WEEKDAYS.indexOf(m[1].toLowerCase()), false));

  m = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) {
    const d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    if (!isNaN(d)) return toISODate(d);
  }

  m = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (m) {
    const month = parseInt(m[1], 10) - 1;
    const day = parseInt(m[2], 10);
    const year = m[3] ? parseInt(m[3], 10) : null;
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return toISODate(resolveYear(month, day, today, year));
    }
  }

  m = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/i);
  if (m) {
    const month = MONTHS.indexOf(m[1].toLowerCase());
    const day = parseInt(m[2], 10);
    if (day >= 1 && day <= 31) return toISODate(resolveYear(month, day, today, null));
  }

  return null;
}
