import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db/repos';
import { enforceRateLimit } from '@/lib/middleware/rateLimit';
import { signToken, userPayload } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, { windowMs: 15 * 60 * 1000, max: 20 });
  if (limited) return limited;

  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email e password obbligatorie' }, { status: 400 });

    const user = await findUserByEmail(email);
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }
    const token = signToken(user);
    return NextResponse.json({ user: userPayload(user), token });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Errore durante il login' }, { status: 400 });
  }
}
