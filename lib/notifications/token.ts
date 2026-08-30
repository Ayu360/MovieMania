import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { getApp } from '@react-native-firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '@react-native-firebase/messaging';

import { registerDeviceToken, unregisterDeviceToken } from '@/api/authApi';
import { log } from '@/lib/logger';
import useAuthStore from '@/store/authStore';

let currentToken: string | null = null;
let unsubscribeRefresh: (() => void) | null = null;

type SupportedPlatform = 'ios' | 'android';

const supportedPlatform = (): SupportedPlatform | null => {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return null;
};

const appVersion = () => Constants.expoConfig?.version ?? '0.0.0';

async function ensureIosRegistered(m: ReturnType<typeof getMessaging>) {
  if (Platform.OS !== 'ios') return;
  if (isDeviceRegisteredForRemoteMessages(m)) return;
  await registerDeviceForRemoteMessages(m);
  log.debug('NOTIF', 'ios registerDeviceForRemoteMessages ok');
}

async function subscribeUserTopics(appUid: string) {
  const m = getMessaging(getApp());
  try {
    await subscribeToTopic(m, 'all-users');
    await subscribeToTopic(m, `user_${appUid}`);
    log.info('NOTIF', 'subscribed to topics', {
      topics: ['all-users', `user_${appUid}`],
    });
  } catch (err) {
    log.warn('NOTIF', 'topic subscribe failed', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

async function unsubscribeUserTopics(appUid: string) {
  const m = getMessaging(getApp());
  try {
    await unsubscribeFromTopic(m, `user_${appUid}`);
    log.debug('NOTIF', 'unsubscribed user topic');
  } catch (err) {
    log.debug('NOTIF', 'topic unsubscribe skipped', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function registerCurrentDevice(): Promise<void> {
  if (!Device.isDevice) {
    log.info('NOTIF', 'skipping device registration on simulator');
    return;
  }
  const platform = supportedPlatform();
  if (!platform) {
    log.debug('NOTIF', 'skipping device registration on unsupported platform');
    return;
  }
  const { appToken, user } = useAuthStore.getState();
  if (!appToken || !user) {
    log.debug('NOTIF', 'no auth, skipping device registration');
    return;
  }

  const m = getMessaging(getApp());
  try {
    await ensureIosRegistered(m);
    const token = await getToken(m);
    currentToken = token;
    log.info('NOTIF', 'fcm token acquired');

    await registerDeviceToken(appToken, {
      token,
      platform,
      appVersion: appVersion(),
    });

    await subscribeUserTopics(user.appUid);

    if (!unsubscribeRefresh) {
      unsubscribeRefresh = onTokenRefresh(m, async (nextToken) => {
        log.info('NOTIF', 'fcm token refreshed');
        currentToken = nextToken;
        const latest = useAuthStore.getState().appToken;
        if (!latest) return;
        try {
          await registerDeviceToken(latest, {
            token: nextToken,
            platform,
            appVersion: appVersion(),
          });
        } catch (err) {
          log.warn('NOTIF', 'refresh backend register failed', {
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });
    }
  } catch (err) {
    log.error('NOTIF', 'registerCurrentDevice failed', {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function unregisterCurrentDevice(): Promise<void> {
  const { appToken, user } = useAuthStore.getState();
  const m = getMessaging(getApp());
  const token = currentToken;

  if (user) {
    await unsubscribeUserTopics(user.appUid);
  }

  if (appToken && token) {
    try {
      await unregisterDeviceToken(appToken, token);
    } catch (err) {
      log.warn('NOTIF', 'backend unregister failed', {
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  try {
    await deleteToken(m);
    log.info('NOTIF', 'fcm token deleted');
  } catch (err) {
    log.warn('NOTIF', 'fcm token delete failed', {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  currentToken = null;
  if (unsubscribeRefresh) {
    unsubscribeRefresh();
    unsubscribeRefresh = null;
  }
}
