import { NextRequest, NextResponse } from 'next/server';
import { findUserByResetToken, updateUserById } from '@/lib/db/repos';
import { validatePassword } from '@/lib/middleware/validation';
import { enforceRateLimit } from '@/lib/middleware/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, { windowMs: 15 * 60 * 1000, max: 10 });
  if (limited) return limited;

  try {
    const { token, password } = await request.json();
    if (!token || !password) return NextResponse.json({ error: 'Token e nuova password sono obbligatori' }, { status: 400 });

    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

    const user = await findUserByResetToken(token);
    if (!user) return NextResponse.json({ error: 'Token non valido o scaduto' }, { status: 400 });

    await updateUserById(user.id, {
      password,
      reset_token: null,
      reset_token_expiry: null
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Errore nel reimpostare la password' }, { status: 400 });
  }
}
