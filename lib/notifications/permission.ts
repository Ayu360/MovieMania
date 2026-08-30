import * as Notifications from 'expo-notifications';

import { log } from '@/lib/logger';

export type PermissionState = {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
};

const shape = (
  res: Notifications.NotificationPermissionsStatus,
): PermissionState => ({
  granted: res.granted,
  canAskAgain: res.canAskAgain,
  status: res.status,
});

export async function getPermissionStatus(): Promise<PermissionState> {
  const res = await Notifications.getPermissionsAsync();
  return shape(res);
}

export async function requestPermissionOnce(): Promise<PermissionState> {
  log.info('NOTIF', 'requesting notification permission');
  const res = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowBadge: true,
    },
  });
  log.info('NOTIF', 'permission response', {
    granted: res.granted,
    status: res.status,
    canAskAgain: res.canAskAgain,
  });
  return shape(res);
}
