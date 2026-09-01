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

import { deleteMe, postFirebaseToken } from '@/api/authApi';
import { log } from '@/lib/logger';
import { unregisterCurrentDevice } from '@/lib/notifications';
import useAuthStore, { type User } from '@/store/authStore';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(): Promise<void> {
  log.info('AUTH', 'signInWithGoogle start');
  try {
    log.debug('AUTH', 'play services check');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    log.debug('AUTH', 'google sign-in prompt');
    const googleResponse = await GoogleSignin.signIn();
    if (!isSuccessResponse(googleResponse)) {
      log.warn('AUTH', 'google sign-in cancelled');
      throw new Error('Google sign-in was cancelled');
    }
    log.info('AUTH', 'google sign-in ok', {
      email: googleResponse.data.user.email,
    });

    const googleIdToken = googleResponse.data.idToken;
    if (!googleIdToken) {
      log.error('AUTH', 'google returned no idToken');
      throw new Error('Google did not return an idToken');
    }

    log.debug('AUTH', 'building firebase credential');
    const credential = GoogleAuthProvider.credential(googleIdToken);
    const userCredential = await signInWithCredential(getAuth(), credential);
    log.debug('AUTH', 'firebase credential exchanged', {
      firebaseUid: userCredential.user.uid,
    });

    const firebaseIdToken = await userCredential.user.getIdToken();
    log.debug('AUTH', 'firebase idToken fetched');

    const backend = await postFirebaseToken(firebaseIdToken);

    const user: User = {
      appUid: backend.appUid,
      email: backend.user.email,
      name: backend.user.name,
      photoURL: backend.user.photoURL,
      provider: backend.user.provider,
    };

    useAuthStore.getState().signIn({ user, appToken: backend.appToken });
    log.info('AUTH', 'signInWithGoogle done', { appUid: user.appUid });
  } catch (err) {
    log.error('AUTH', 'signInWithGoogle failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

export async function signOut(): Promise<void> {
  log.info('AUTH', 'signOut start');
  try {
    await unregisterCurrentDevice();
  } catch (err) {
    log.warn('AUTH', 'notification unregister failed on signOut', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
  try {
    await GoogleSignin.signOut();
    log.debug('AUTH', 'google signOut ok');
  } catch {
    log.debug('AUTH', 'google signOut skipped (not signed in with google)');
  }
  try {
    await firebaseSignOut(getAuth());
    log.debug('AUTH', 'firebase signOut ok');
  } catch (err) {
    log.error('AUTH', 'firebase signOut failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
  useAuthStore.getState().logout();
  log.info('AUTH', 'signOut done');
}

export async function deleteAccount(): Promise<void> {
  log.info('DELETE_ACCOUNT', 'start');
  const appToken = useAuthStore.getState().appToken;
  if (!appToken) {
    log.error('DELETE_ACCOUNT', 'no appToken in store');
    throw new Error('Not signed in');
  }

  try {
    await unregisterCurrentDevice();
  } catch (err) {
    log.warn('DELETE_ACCOUNT', 'notification unregister failed', {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Backend deletes both the Mongo record and the Firebase user.
  await deleteMe(appToken);
  log.debug('DELETE_ACCOUNT', 'backend DELETE /me ok');

  // The Firebase account is already gone server-side — just clear the
  // local session so the client SDK doesn't hold a stale token.
  try {
    await firebaseSignOut(getAuth());
    log.debug('DELETE_ACCOUNT', 'firebase signOut ok');
  } catch {
    log.debug('DELETE_ACCOUNT', 'firebase signOut skipped');
  }

  try {
    await GoogleSignin.revokeAccess();
    log.debug('DELETE_ACCOUNT', 'google revokeAccess ok');
  } catch {
    log.debug('DELETE_ACCOUNT', 'google revokeAccess skipped');
  }

  useAuthStore.getState().logout();
  log.info('DELETE_ACCOUNT', 'done');
}
