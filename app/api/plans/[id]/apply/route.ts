import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createHabit, findHabitByMonthName, findPlan, updatePlan } from '@/lib/db/repos';
import type { PlanHabitDraft } from '@/lib/models/Plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { id } = await params;
    const plan = await findPlan(id, user.id);
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    if (!plan.planData || !plan.planData.plan) {
      return NextResponse.json({ error: 'Invalid plan structure' }, { status: 400 });
    }

    // Create habits from the plan. Entries can be plain strings (legacy
    // plans) or Atomic Habits objects (cue, stack, 2-minute, reward).
    const createdHabits = [];
    for (const monthPlan of plan.planData.plan) {
      for (const entry of monthPlan.habits) {
        const habitName = typeof entry === 'string' ? entry : entry.name;
        const atomic: Partial<PlanHabitDraft> = typeof entry === 'string' ? {} : entry;

        // Check if habit already exists for this month
        const existing = await findHabitByMonthName(user.id, monthPlan.month, habitName);

        if (!existing) {
          const habit = await createHabit({
            userId: user.id,
            month: monthPlan.month,
            name: habitName,
            originPlanId: plan.id,
            cueTime: atomic.cueTime ?? null,
            cueLocation: atomic.cueLocation ?? null,
            stackAfter: atomic.stackAfter ?? null,
            twoMinute: atomic.twoMinute ?? null,
            reward: atomic.reward ?? null
          });
          createdHabits.push(habit);
        }
      }
    }

    // Mark plan as applied and active
    const updatedPlan = await updatePlan(plan.id, user.id, {
      habits_applied: true,
      is_active: true
    });

    return NextResponse.json(
      {
        message: 'Plan applied successfully',
        habitsCreated: createdHabits.length,
        plan: updatedPlan || plan
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Apply plan error:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Failed to apply plan' }, { status: 500 });
  }
}
