import { shiftDate, todayKey } from './streak';

const DAY_MS = 86400000;

/**
 * Days elapsed since the last completed check-in (Infinity if never completed).
 */
export function daysSinceLastCheckin(dates: string[], ref = todayKey()): number {
  if (!dates || dates.length === 0) return Infinity;
  const last = Math.max(...dates.map((d) => Date.parse(`${d}T00:00:00Z`)));
  return Math.round((Date.parse(`${ref}T00:00:00Z`) - last) / DAY_MS);
}

/**
 * "Never miss twice" (James Clear): the first miss is an accident, the second
 * is the start of a new habit. A habit is at risk when it was completed at
 * least once, was NOT completed yesterday, and is not completed today.
 */
export function isNeverMissTwiceAtRisk(dates: string[], ref = todayKey()): boolean {
  if (!dates || dates.length === 0) return false;
  return !dates.includes(ref) && !dates.includes(shiftDate(ref, -1));
}

/**
 * Consistency = unique check-ins / days elapsed since the first check-in.
 * Mirrors the "1% better" concept: repetition over time beats intensity.
 */
export function habitConsistency(dates: string[], ref = todayKey()): number {
  const unique = Array.from(new Set(dates || []));
  if (unique.length === 0) return 0;
  const firstMs = Math.min(...unique.map((d) => Date.parse(`${d}T00:00:00Z`)));
  const refMs = Date.parse(`${ref}T00:00:00Z`);
  const daysElapsed = Math.max(1, Math.round((refMs - firstMs) / DAY_MS) + 1);
  return Math.min(100, Math.round((unique.length / daysElapsed) * 100));
}
