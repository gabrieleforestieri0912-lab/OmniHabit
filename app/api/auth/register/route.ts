import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/db/repos';
import { validateEmail, validatePassword } from '@/lib/middleware/validation';
import { enforceRateLimit } from '@/lib/middleware/rateLimit';
import { signToken, userPayload } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, { windowMs: 15 * 60 * 1000, max: 20 });
  if (limited) return limited;

  try {
    const { username, email, password } = await request.json();
    console.log('REGISTRATION ATTEMPT:', { username, email, password: '***' });

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Tutti i campi (username, email, password) sono obbligatori.' }, { status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });
    if (username.length < 3) return NextResponse.json({ error: 'Username troppo breve (min 3 car.)' }, { status: 400 });

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) return NextResponse.json({ error: 'Questa email è già registrata.' }, { status: 400 });

    const existingUser = await findUserByUsername(username);
    if (existingUser) return NextResponse.json({ error: 'Questo username è già in uso.' }, { status: 400 });

    const user = await createUser({ username, email, password });

    console.log('User created:', user.id);

    const token = signToken(user);
    return NextResponse.json({ user: userPayload(user), token }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    console.error('Registration error detail:', error);
    return NextResponse.json({ error: err.message || 'Errore durante la registrazione' }, { status: 400 });
  }
}
