const DAY_MS = 86400000;

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toDayKey(new Date());
}

export function shiftDate(key: string, days: number): string {
  const ms = Date.parse(`${key}T00:00:00Z`) + days * DAY_MS;
  return new Date(ms).toISOString().slice(0, 10);
}

export function calcStreak(dates: string[], ref = todayKey()): number {
  const set = new Set(dates);
  if (!set.has(ref) && !set.has(shiftDate(ref, -1))) return 0;
  const start = set.has(ref) ? ref : shiftDate(ref, -1);
  let streak = 0;
  let cursor = start;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function isDoneOn(dates: string[], key: string): boolean {
  return dates.includes(key);
}

export function isDoneToday(dates: string[], ref = todayKey()): boolean {
  return dates.includes(ref);
}

export function uniqueDays(dates: string[]): string[] {
  return Array.from(new Set(dates));
}

export function countInMonth(dates: string[], monthIndex: number): number {
  return dates.filter((d) => {
    const [y, m] = d.split('-');
    return parseInt(y, 10) > 0 && parseInt(m, 10) === monthIndex + 1;
  }).length;
}

export function daysInMonth(monthIndex: number, year = new Date().getFullYear()): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function legacySeed(completed: boolean, streak: number, ref = todayKey()): string[] {
  if (streak <= 0) return [];
  const endOffset = completed ? 0 : 1;
  const out: string[] = [];
  for (let i = 0; i < streak; i += 1) {
    out.push(shiftDate(ref, -(i + endOffset)));
  }
  return out;
}
