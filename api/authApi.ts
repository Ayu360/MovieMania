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
  const res = await fetch(`${BACKEND_URL}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Backend rejected sign-in (${res.status}): ${message}`);
  }
  return (await res.json()) as PostFirebaseTokenResponse;
}

export async function fetchMe(appToken: string): Promise<BackendUser & { appUid: string }> {
  if (!BACKEND_URL) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL is not set');
  }
  const res = await fetch(`${BACKEND_URL}/me`, {
    headers: { Authorization: `Bearer ${appToken}` },
  });
  if (!res.ok) {
    throw new Error(`GET /me failed: ${res.status}`);
  }
  return (await res.json()) as BackendUser & { appUid: string };
}
