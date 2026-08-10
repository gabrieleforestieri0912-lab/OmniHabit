import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { IUser } from './models/User';
import { findUserById } from './db/repos';
import { isDbConfigured } from './db/client';

export function signToken(user: Pick<IUser, 'id'>): string {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function userPayload(user: IUser) {
  return {
    id: user.id,
    username: user.username,
    level: user.level,
    exp: user.exp,
    totalScore: user.totalScore,
    avatar: user.avatar,
    isPremium: user.isPremium,
    isGoogleAuth: user.isGoogleAuth,
    subscriptionStatus: user.subscriptionStatus,
    aiPlanUsageCount: user.aiPlanUsageCount,
    aiPlanUsageLimit: user.aiPlanUsageLimit
  };
}

export async function getAuthedUser(request: NextRequest): Promise<IUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    return await findUserById(decoded.id);
  } catch {
    return null;
  }
}

export type AuthResult = { user: IUser; response: null } | { user: null; response: NextResponse };

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  if (!isDbConfigured()) {
    return { user: null, response: NextResponse.json({ error: 'Database not connected. Please try again later.' }, { status: 503 }) };
  }
  const user = await getAuthedUser(request);
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'Please authenticate.' }, { status: 401 }) };
  }
  return { user, response: null };
}
