import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createUser, findUserByEmail } from '@/lib/db/repos';
import { signToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${frontendUrl}/?error=google_auth_failed&details=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${frontendUrl}/?error=no_code`);
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

    console.log('Exchanging code for tokens...');

    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const { access_token } = tokenResponse.data;
    console.log('Got access token');

    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture } = userInfoResponse.data;
    console.log('Got user info:', email);

    let user = await findUserByEmail(email);

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-16);
      user = await createUser({
        username: name || email.split('@')[0],
        email,
        password: randomPassword,
        avatar: picture,
        isGoogleAuth: true
      });
    }

    const token = signToken(user);
    return NextResponse.redirect(`${frontendUrl}/?google_token=${token}&username=${encodeURIComponent(user.username)}`);
  } catch (error) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Google OAuth error:', err.response?.data || err.message);
    return NextResponse.redirect(`${frontendUrl}/?error=google_auth_failed`);
  }
}
