import { log } from '@/lib/logger';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export type BackendUser = {
  email: string;
  name: string | null;
  photoURL: string | null;
  provider: 'google';
};

export type PostFirebaseTokenResponse = {
  appUid: string;
  appToken: string;
  user: BackendUser;
};

export async function postFirebaseToken(
  idToken: string,
): Promise<PostFirebaseTokenResponse> {
  if (!BACKEND_URL) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL is not set');
  }
  log.info('API', 'POST /auth/firebase start');
  const res = await fetch(`${BACKEND_URL}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const message = await res.text();
    log.error('API', 'POST /auth/firebase failed', { status: res.status, message });
    throw new Error(`Backend rejected sign-in (${res.status}): ${message}`);
  }
  const json = (await res.json()) as PostFirebaseTokenResponse;
  log.info('API', 'POST /auth/firebase ok', {
    status: res.status,
    appUid: json.appUid,
  });
  return json;
}

export async function fetchMe(appToken: string): Promise<BackendUser & { appUid: string }> {
  if (!BACKEND_URL) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL is not set');
  }
  log.info('API', 'GET /me start');
  const res = await fetch(`${BACKEND_URL}/me`, {
    headers: { Authorization: `Bearer ${appToken}` },
  });
  if (!res.ok) {
    log.error('API', 'GET /me failed', { status: res.status });
    throw new Error(`GET /me failed: ${res.status}`);
  }
  const json = (await res.json()) as BackendUser & { appUid: string };
  log.info('API', 'GET /me ok', { status: res.status, appUid: json.appUid });
  return json;
}

export async function deleteMe(appToken: string): Promise<void> {
  if (!BACKEND_URL) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL is not set');
  }
  log.info('API', 'DELETE /me start');
  const res = await fetch(`${BACKEND_URL}/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${appToken}` },
  });
  if (!res.ok) {
    const message = await res.text();
    log.error('API', 'DELETE /me failed', { status: res.status, message });
    throw new Error(`DELETE /me failed (${res.status}): ${message}`);
  }
  log.info('API', 'DELETE /me ok', { status: res.status });
}
