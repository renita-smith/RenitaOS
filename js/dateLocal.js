// Shared date module for every "this week / this month" computation across
// RenitaOS (Today dashboard, and any future screen). Pure, local, Sunday-
// anchored. Never toISOString (it shifts by timezone) — always build dates
// from local Y/M/D components, per RenitaOS-Conventions.md.
//
// Dates are 'YYYY-MM-DD' strings throughout. Because ISO date strings sort
// lexicographically, range comparisons elsewhere in the app can stay plain
// string compares against these outputs.

function toLocalDateObj(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayLocal() {
  return toDateStr(new Date());
}

export function addDays(dateStr, n) {
  const d = toLocalDateObj(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

// Sunday of dateStr's week.
export function startOfWeek(dateStr = todayLocal()) {
  const d = toLocalDateObj(dateStr);
  return addDays(dateStr, -d.getDay());
}

// Saturday of dateStr's week.
export function endOfWeek(dateStr = todayLocal()) {
  const d = toLocalDateObj(dateStr);
  return addDays(dateStr, 6 - d.getDay());
}

export function startOfMonth(dateStr = todayLocal()) {
  const [y, m] = dateStr.split('-');
  return `${y}-${m}-01`;
}

export function endOfMonth(dateStr = todayLocal()) {
  const [y, m] = dateStr.split('-').map(Number);
  // Day 0 of next month = last day of this month.
  const last = new Date(y, m, 0);
  return toDateStr(last);
}

export function isBetween(dateStr, start, end) {
  return dateStr >= start && dateStr <= end;
}

export function sameWeekdayLastWeek(dateStr) {
  return addDays(dateStr, -7);
}

// Same day-of-month one month back, clamped to that month's last day
// (e.g. Mar 31 -> Feb 28/29).
export function sameDayLastMonth(dateStr) {
  const [y, m, day] = dateStr.split('-').map(Number);
  const prevMonthLastDay = new Date(y, m - 1, 0).getDate();
  const clampedDay = Math.min(day, prevMonthLastDay);
  const d = new Date(y, m - 2, clampedDay);
  return toDateStr(d);
}
