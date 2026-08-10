import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, userPayload } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;
  return NextResponse.json({ user: userPayload(user) });
}
