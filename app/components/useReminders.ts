'use client';

import { useEffect, useRef } from 'react';
import type { Habit, HabitsMap } from '../types';
import { todayKey } from './utils';

const STORE_KEY = 'omni_pending_reminders';

// Reminder time: prefer the Atomic-Habits cue (when the behavior is planned to happen),
// fall back to the legacy reminder time.
function reminderTimeFor(habit: Habit): string | null {
  return habit.cueTime || habit.reminderTime || null;
}

// Notification body with Atomic-Habits context (cue location, stacking, 2-minute rule).
function bodyFor(habit: Pick<Habit, 'name' | 'cueLocation' | 'stackAfter' | 'twoMinute'>): string {
  const parts = [`È il momento di: ${habit.name}`];
  if (habit.cueLocation) parts.push(`in ${habit.cueLocation}`);
  if (habit.stackAfter) parts.push(`dopo ${habit.stackAfter}`);
  if (habit.twoMinute) parts.push(`Fallo facile: ${habit.twoMinute}`);
  return parts.join(' · ');
}

interface StoredReminder {
  habitId: string;
  name: string;
  cueLocation?: string | null;
  stackAfter?: string | null;
  twoMinute?: string | null;
  at: number;
}

function loadStored(): StoredReminder[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredReminder[]) : [];
  } catch {
    return [];
  }
}

function saveStored(list: StoredReminder[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — reminders still work for the current session */
  }
}

function fire(stored: StoredReminder) {
  if (Notification.permission !== 'granted') return;
  new Notification('OmniHabit', {
    body: bodyFor(stored),
    tag: stored.habitId,
    icon: '/favicon.ico'
  });
}

export function useReminders(habits: HabitsMap, user: unknown) {
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!user || typeof Notification === 'undefined') return;

    const clearTimers = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    const scheduleStored = (list: StoredReminder[]) => {
      const now = Date.now();
      for (const item of list) {
        const delay = item.at - now;
        if (delay <= 0) continue;
        const id = window.setTimeout(() => fire(item), delay);
        timers.current.push(id);
      }
    };

    // 1) Fire persisted reminders that became due while the page was closed/reloaded.
    const stored = loadStored().filter((item) => item.at > Date.now());
    saveStored(stored);
    scheduleStored(stored);

    // 2) (Re)plan today's reminders from the current habits.
    const ref = todayKey();
    const pending = Object.values(habits)
      .flat()
      .filter((h) => reminderTimeFor(h) && !(h.completedDates || []).includes(ref));

    const plan = () => {
      clearTimers();
      const now = new Date();
      const next: StoredReminder[] = [];
      for (const habit of pending) {
        const time = reminderTimeFor(habit);
        if (!time) continue;
        const [h, m] = time.split(':').map(Number);
        const when = new Date();
        when.setHours(h, m, 0, 0);
        if (when.getTime() <= now.getTime()) continue;
        next.push({
          habitId: habit._id,
          name: habit.name,
          cueLocation: habit.cueLocation,
          stackAfter: habit.stackAfter,
          twoMinute: habit.twoMinute,
          at: when.getTime()
        });
      }
      saveStored(next);
      scheduleStored(next);
    };

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') plan();
      });
      return clearTimers;
    }
    if (Notification.permission === 'granted') plan();
    return clearTimers;
  }, [habits, user]);
}
