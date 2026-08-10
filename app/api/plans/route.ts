import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createPlan, listPlans } from '@/lib/db/repos';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const plans = await listPlans(user.id);
    return NextResponse.json(plans);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { title, description, planData } = await request.json();

    if (!planData || !planData.plan) {
      return NextResponse.json({ error: 'Plan data is required' }, { status: 400 });
    }

    const plan = await createPlan({
      userId: user.id,
      title: title || 'Nuovo Piano',
      description: description || planData.summary || '',
      planData
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
