import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById } from '@/lib/db/repos';
import { aiChat, AIMessage } from '@/lib/services/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let userContext = '';
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const user = await findUserById(decoded.id);
        if (user) {
          userContext = `The user's name is ${user.username}. They have a current streak of ${user.totalScore || 0} days.`;
        }
      } catch (e) {
        const err = e as Error;
        console.log('Token verify failed:', err.message);
      }
    }

    const systemPrompt = userContext
      ? `You are an AI assistant integrated into OmniHabit, a habit tracking and personal development platform. ${userContext} Provide motivational, concise responses about habits, productivity, neuroscience, and personal growth. Keep responses brief and actionable. Respond in Italian when the user writes in Italian.`
      : 'You are an AI assistant integrated into OmniHabit, a habit tracking and personal development platform. Provide motivational, concise responses about habits, productivity, neuroscience, and personal growth. Keep responses brief and actionable. Respond in Italian when the user writes in Italian.';

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const content = await aiChat(messages);
    return NextResponse.json({ response: content, role: 'assistant' });
  } catch (error) {
    const err = error as Error;
    console.error('Chat error:', error);
    return NextResponse.json({ error: err.message || 'Chat error' }, { status: 500 });
  }
}
