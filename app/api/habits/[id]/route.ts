import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteHabit, updateHabit } from '@/lib/db/repos';
import { validateHabitBody } from '@/lib/middleware/validation';
import type { HabitPatch } from '@/lib/db/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const validationError = validateHabitBody(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const patch: HabitPatch = {};
    if (body.name !== undefined) patch.name = body.name.trim();
    if (body.month !== undefined) patch.month = body.month;
    if (body.reminderTime !== undefined) patch.reminder_time = body.reminderTime || null;
    if (body.targetDays !== undefined) patch.target_days = Number(body.targetDays);
    if (body.cueTime !== undefined) patch.cue_time = body.cueTime || null;
    if (body.cueLocation !== undefined) patch.cue_location = body.cueLocation || null;
    if (body.stackAfter !== undefined) patch.stack_after = body.stackAfter || null;
    if (body.twoMinute !== undefined) patch.two_minute = body.twoMinute || null;
    if (body.reward !== undefined) patch.reward = body.reward || null;
    if (body.identity !== undefined) patch.identity = body.identity || null;

    const habit = await updateHabit(id, user.id, patch);
    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(habit);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await deleteHabit(id, user.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
