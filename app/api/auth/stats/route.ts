import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateUserById } from '@/lib/db/repos';
import type { UserPatch } from '@/lib/db/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  try {
    const { level, exp, totalScore } = await request.json();
    const patch: UserPatch = {};
    if (level !== undefined) patch.level = level;
    if (exp !== undefined) patch.exp = exp;
    if (totalScore !== undefined) patch.total_score = totalScore;

    const updated = await updateUserById(user.id, patch);
    if (!updated) return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    return NextResponse.json({ level: updated.level, exp: updated.exp, totalScore: updated.totalScore });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
