function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Threshold scales with word length so short tags/names don't over-suggest
// (e.g. "sm" would otherwise near-match half the alphabet).
function thresholdFor(len) {
  if (len <= 3) return 0;
  if (len <= 6) return 1;
  return 2;
}

// Finds the closest candidate to `value` that is NOT an exact (case-insensitive)
// match, using an edit-distance threshold scaled to word length. Returns the
// canonical candidate string, or null if nothing is close enough.
export function findNearMatch(value, candidates) {
  const query = value.toLowerCase();
  let best = null;
  let bestDist = Infinity;
  for (const candidate of candidates) {
    const c = candidate.toLowerCase();
    if (c === query) continue;
    const threshold = thresholdFor(Math.max(query.length, c.length));
    if (threshold === 0) continue;
    if (Math.abs(c.length - query.length) > threshold) continue;
    const dist = levenshtein(query, c);
    if (dist <= threshold && dist < bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best;
}
