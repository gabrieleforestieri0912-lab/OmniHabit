import { useEffect, useMemo, useState } from 'react';
import { months } from './constants';
import type { Habit, HabitsMap } from '../types';

export interface ExpStats {
  level: number;
  totalStreak: number;
  progress: number;
  expInLevel: number;
}

export interface GlobalStats {
  totalHabits: number;
  completedToday: number;
  totalStreak: number;
  maxStreak: number;
  completionRate: number;
}

const DAY_MS = 86400000;

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dayKey(new Date());
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

export function isHabitDoneOn(habit: Habit, key: string): boolean {
  return (habit.completedDates || []).includes(key);
}

export function isHabitDoneToday(habit: Habit, ref = todayKey()): boolean {
  return (habit.completedDates || []).includes(ref);
}

export function countCheckinsOn(dates: string[], key: string): number {
  return (dates || []).filter((d) => d === key).length;
}

export function countCheckinsInMonth(dates: string[], monthIndex: number): number {
  return (dates || []).filter((d) => {
    const [, m] = d.split('-');
    return parseInt(m, 10) === monthIndex + 1;
  }).length;
}

export function getExpStats(monthHabits: Habit[]): ExpStats {
  const totalStreak = monthHabits.reduce((acc, h) => acc + calcStreak(h.completedDates || []), 0);
  const level = Math.min(10, Math.floor(totalStreak / 10) + 1);
  const expInLevel = totalStreak % 10;
  const progress = (expInLevel / 10) * 100;
  return { level, totalStreak, progress, expInLevel };
}

export const getPieData = (monthHabits: Habit[]) => {
  const ref = todayKey();
  const completed = monthHabits.filter((h) => isHabitDoneToday(h, ref)).length;
  const remaining = monthHabits.length - completed;
  return [
    { name: 'Completati oggi', value: completed },
    { name: 'Da completare', value: remaining }
  ];
};

export const getGlobalStats = (habits: HabitsMap): GlobalStats => {
  const allHabits = Object.values(habits).flat();
  const ref = todayKey();
  const totalHabits = allHabits.length;
  const completedToday = allHabits.filter((h) => isHabitDoneToday(h, ref)).length;
  const totalStreak = allHabits.reduce((acc, h) => acc + calcStreak(h.completedDates || []), 0);
  const maxStreak = allHabits.reduce((acc, h) => Math.max(acc, calcStreak(h.completedDates || [])), 0);
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  return { totalHabits, completedToday, totalStreak, maxStreak, completionRate };
};

export const getWeeklyProgress = (habits: HabitsMap) => {
  const ref = todayKey();
  const allHabits = Object.values(habits).flat();
  const last7Days: { day: string; date: string; completions: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const key = shiftDate(ref, -i);
    const completions = allHabits.reduce(
      (acc, h) => acc + countCheckinsOn(h.completedDates || [], key),
      0
    );
    last7Days.push({
      day: new Date(Date.parse(`${key}T00:00:00Z`)).toLocaleDateString('it-IT', { weekday: 'short', timeZone: 'UTC' }),
      date: key,
      completions
    });
  }
  const max = Math.max(...last7Days.map((d) => d.completions), 1);
  return last7Days.map((d) => ({ ...d, max }));
};

export const getMonthlyTrend = (habits: HabitsMap) => {
  return months.slice(0, 6).map((month, i) => {
    const monthHabits = habits[month] || [];
    const checkins = monthHabits.reduce(
      (acc, h) => acc + countCheckinsInMonth(h.completedDates || [], i),
      0
    );
    const maxCheckins = monthHabits.length * daysInMonth(i);
    const rate = maxCheckins > 0 ? Math.round((checkins / maxCheckins) * 100) : 0;
    return { month: month.slice(0, 3), rate: Math.min(rate, 100) };
  });
};

function daysInMonth(monthIndex: number): number {
  return new Date(new Date().getFullYear(), monthIndex + 1, 0).getDate();
}

export const getLevelFromStreak = (totalStreak: number): number => {
  return Math.min(10, Math.floor(totalStreak / 10) + 1);
};

export const getUserLevel = (habits: HabitsMap): number => {
  const stats = getGlobalStats(habits);
  return getLevelFromStreak(stats.totalStreak);
};

/**
 * Mesi ordinati a partire dal mese corrente, con il nome del mese attuale.
 * Il mese viene calcolato SOLO lato client (dopo il mount) per evitare
 * hydration mismatch tra server (UTC) e browser (fusi diversi sul cambio mese).
 */
export function useOrderedMonths() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number | null>(null);

  useEffect(() => {
    setCurrentMonthIndex(new Date().getMonth());
  }, []);

  const currentMonthName = currentMonthIndex != null ? months[currentMonthIndex] : null;

  const orderedMonths = useMemo(() => {
    if (currentMonthIndex == null) return months;
    return [...months.slice(currentMonthIndex), ...months.slice(0, currentMonthIndex)];
  }, [currentMonthIndex]);

  return { orderedMonths, currentMonthName };
}

// Atomic Habits (James Clear) logic — single source of truth in lib/utils/atomic.ts
export { daysSinceLastCheckin, isNeverMissTwiceAtRisk, habitConsistency } from '../../lib/utils/atomic';