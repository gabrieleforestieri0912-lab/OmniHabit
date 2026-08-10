'use client';

import { useEffect } from 'react';
import type { Habit, HabitsMap } from '../types';
import { todayKey } from './utils';

export function useReminders(habits: HabitsMap, user: unknown) {
  useEffect(() => {
    if (!user || typeof Notification === 'undefined') return;
    const ref = todayKey();
    const pending = Object.values(habits)
      .flat()
      .filter((h) => h.reminderTime && !(h.completedDates || []).includes(ref));

    if (pending.length === 0) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') schedule(pending, ref);
      });
      return;
    }
    if (Notification.permission === 'granted') schedule(pending, ref);
  }, [habits, user]);
}

function schedule(pending: Habit[], ref: string) {
  const now = new Date();
  for (const habit of pending) {
    if (!habit.reminderTime) continue;
    const [h, m] = habit.reminderTime.split(':').map(Number);
    const when = new Date();
    when.setHours(h, m, 0, 0);
    if (when.getTime() <= now.getTime()) continue;
    setTimeout(() => {
      if (
        Notification.permission === 'granted' &&
        !(habit.completedDates || []).includes(todayKey())
      ) {
        new Notification('OmniHabit', {
          body: `È il momento di: ${habit.name}`,
          tag: habit._id,
          icon: '/favicon.ico'
        });
      }
    }, when.getTime() - now.getTime());
  }
}
