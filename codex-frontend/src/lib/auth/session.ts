import 'server-only';
import {SignJWT, jwtVerify} from 'jose';
import { cookies } from 'next/headers';
import type { LoginResponseDto } from '@/types/api/auth';
import type { SessionPayload } from '@/types/session';

const secretKey = process.env.AUTH_SECRET;
if (!secretKey) {
  throw new Error('AUTH_SECRET is not defined in the environment variables');
}

const key = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = 'codex_session';

async function encrypt(payload: Omit<SessionPayload, 'expiresAt'> & { expiresAt: Date }): Promise<string> {
  const payloadWithStringDate = {
    ...payload,
    expiresAt: payload.expiresAt.toISOString(),
  };

  return new SignJWT(payloadWithStringDate) 
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') 
    .sign(key);
}

async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error('Falha ao verificar a sessão:', error);
    return null;
  }
}

export async function createSession(data: LoginResponseDto): Promise<void> {
  const expires = new Date(data.expiration);
  const sessionExpiresDate = new Date(Math.min(
    expires.getTime(),
    Date.now() + 30 * 24 * 60 * 60 * 1000 
  ));

  const sessionPayload = {
    user: data.user,
    accessToken: data.accessToken,
    expiresAt: sessionExpiresDate,
  };

  const session = await encrypt(sessionPayload);

  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: sessionExpiresDate,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(cookie);

  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
}

export async function deleteSession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE_NAME, '', {
    expires: new Date(0),
    path: '/',
  });
}