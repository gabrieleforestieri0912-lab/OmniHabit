import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { findHabit, updateHabit } from '@/lib/db/repos';
import { calcStreak, isDoneToday, todayKey } from '@/lib/utils/streak';
import type { IHabit } from '@/lib/models/Habit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function syncHabitComputed(habit: IHabit, ref: string): void {
  habit.streak = calcStreak(habit.completedDates, ref);
  habit.completed = isDoneToday(habit.completedDates, ref);
}

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { id } = await params;
    const habit = await findHabit(id, user.id);
    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const ref = typeof body?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : todayKey();

    const idx = habit.completedDates.indexOf(ref);
    if (idx >= 0) {
      habit.completedDates.splice(idx, 1);
    } else {
      habit.completedDates.push(ref);
    }

    syncHabitComputed(habit, ref);
    await updateHabit(habit.id, user.id, {
      completed_dates: habit.completedDates,
      streak: habit.streak,
      completed: habit.completed
    });
    return NextResponse.json(habit);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
