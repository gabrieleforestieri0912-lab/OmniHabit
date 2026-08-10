import { NextResponse } from 'next/server';
import { checkDatabase, isDbConfigured } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const dbConnected = await checkDatabase();
  return NextResponse.json({
    status: dbConnected ? 'online' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    configured: isDbConfigured()
  });
}
