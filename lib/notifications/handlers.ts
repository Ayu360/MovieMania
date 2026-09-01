import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { getApp } from '@react-native-firebase/app';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import { log } from '@/lib/logger';

import { resolveRoute, type ResolvedRoute } from './deepLink';

type RemoteMessage = {
  messageId?: string;
  notification?: { title?: string; body?: string };
  data?: Record<string, string | object>;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Must be registered at module load — Android headless JS picks it up on
// cold-start when a data-only message arrives while the app is killed.
setBackgroundMessageHandler(
  getMessaging(getApp()),
  async (remoteMessage) => {
    log.info('NOTIF', 'background message received', {
      messageId: remoteMessage.messageId,
    });
  },
);

async function presentForegroundLocal(remoteMessage: RemoteMessage) {
  const title = remoteMessage.notification?.title ?? '';
  const body = remoteMessage.notification?.body ?? '';
  if (!title && !body) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: (remoteMessage.data ?? {}) as Record<string, string>,
    },
    trigger: null,
  });
}

function navigate(route: ResolvedRoute) {
  if (typeof route === 'string') {
    router.push(route as never);
  } else {
    router.push({
      pathname: route.pathname as never,
      params: route.params,
    } as never);
  }
}

let onMessageUnsubscribe: (() => void) | null = null;
let onOpenUnsubscribe: (() => void) | null = null;
let coldStartHandled = false;

export function registerRuntimeHandlers(): () => void {
  const m = getMessaging(getApp());

  onMessageUnsubscribe?.();
  onMessageUnsubscribe = onMessage(m, async (remoteMessage) => {
    log.info('NOTIF', 'foreground message received', {
      messageId: remoteMessage.messageId,
    });
    await presentForegroundLocal(remoteMessage);
  });

  onOpenUnsubscribe?.();
  onOpenUnsubscribe = onNotificationOpenedApp(m, (remoteMessage) => {
    log.info('NOTIF', 'notification opened from background', {
      messageId: remoteMessage?.messageId,
    });
    navigate(resolveRoute(remoteMessage?.data));
  });

  if (!coldStartHandled) {
    coldStartHandled = true;
    void getInitialNotification(m).then((remoteMessage) => {
      if (!remoteMessage) return;
      log.info('NOTIF', 'notification cold-start', {
        messageId: remoteMessage.messageId,
      });
      navigate(resolveRoute(remoteMessage.data));
    });
  }

  return () => {
    onMessageUnsubscribe?.();
    onOpenUnsubscribe?.();
    onMessageUnsubscribe = null;
    onOpenUnsubscribe = null;
  };
}
