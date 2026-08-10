import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, updateUserById } from '@/lib/db/repos';
import { enforceRateLimit } from '@/lib/middleware/rateLimit';
import { sendPasswordResetEmail } from '@/lib/services/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, { windowMs: 15 * 60 * 1000, max: 10 });
  if (limited) return limited;

  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email obbligatoria' }, { status: 400 });

    const user = await findUserByEmail(email);
    // Non svelare se l'email esiste o no
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      await updateUserById(user.id, {
        reset_token: token,
        reset_token_expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 ora
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;
      await sendPasswordResetEmail({ email, resetLink, token });
    }
    return NextResponse.json({ message: 'Se l\'email esiste, riceverai un link per reimpostare la password.' });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Errore nel recupero password' }, { status: 400 });
  }
}
