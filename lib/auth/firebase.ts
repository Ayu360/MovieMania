import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

import { postFirebaseToken } from '@/api/authApi';
import useAuthStore, { type User } from '@/store/authStore';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(): Promise<void> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const googleResponse = await GoogleSignin.signIn();
  if (!isSuccessResponse(googleResponse)) {
    throw new Error('Google sign-in was cancelled');
  }

  const googleIdToken = googleResponse.data.idToken;
  if (!googleIdToken) {
    throw new Error('Google did not return an idToken');
  }

  const credential = GoogleAuthProvider.credential(googleIdToken);
  const userCredential = await signInWithCredential(getAuth(), credential);
  const firebaseIdToken = await userCredential.user.getIdToken();

  const backend = await postFirebaseToken(firebaseIdToken);

  const user: User = {
    appUid: backend.appUid,
    email: backend.user.email,
    name: backend.user.name,
    photoURL: backend.user.photoURL,
    provider: backend.user.provider,
  };

  useAuthStore.getState().signIn({ user, appToken: backend.appToken });
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore — user may not be signed in with Google
  }
  await firebaseSignOut(getAuth());
  useAuthStore.getState().logout();
}
