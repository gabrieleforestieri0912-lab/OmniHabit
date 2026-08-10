import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createHabit, listHabits } from '@/lib/db/repos';
import { validateHabitBody } from '@/lib/middleware/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const habits = await listHabits(user.id);
    return NextResponse.json(habits);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const body = await request.json();
    const validationError = validateHabitBody(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { name, month, reminderTime, targetDays, cueTime, cueLocation, stackAfter, twoMinute, reward, identity } = body;
    const habit = await createHabit({
      userId: user.id,
      name,
      month,
      reminderTime: reminderTime || null,
      targetDays: targetDays || 1,
      cueTime: cueTime || null,
      cueLocation: cueLocation || null,
      stackAfter: stackAfter || null,
      twoMinute: twoMinute || null,
      reward: reward || null,
      identity: identity || null
    });
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
