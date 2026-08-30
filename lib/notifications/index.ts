import { AppState, Linking, type NativeEventSubscription } from 'react-native';

import { log } from '@/lib/logger';
import useAuthStore from '@/store/authStore';

import { registerRuntimeHandlers } from './handlers';
import {
  getPermissionStatus,
  requestPermissionOnce,
  type PermissionState,
} from './permission';
import {
  registerCurrentDevice,
  unregisterCurrentDevice,
} from './token';

export { getPermissionStatus } from './permission';
export type { PermissionState } from './permission';
export { unregisterCurrentDevice } from './token';

let started = false;
let unsubscribeHandlers: (() => void) | null = null;
let appStateSub: NativeEventSubscription | null = null;

export function bootstrapNotifications(): void {
  if (started) return;
  started = true;
  log.info('NOTIF', 'bootstrap');

  unsubscribeHandlers = registerRuntimeHandlers();

  appStateSub = AppState.addEventListener('change', async (state) => {
    if (state !== 'active') return;
    const status = await getPermissionStatus();
    if (status.granted) {
      await registerCurrentDevice();
    }
  });

  void (async () => {
    const status = await getPermissionStatus();
    if (status.granted) {
      await registerCurrentDevice();
    }
  })();
}

export async function requestPermissionFirstTime(): Promise<PermissionState> {
  const status = await requestPermissionOnce();
  useAuthStore.getState().markNotificationPermissionAsked();
  if (status.granted) {
    await registerCurrentDevice();
  }
  return status;
}

export function openSettingsForNotifications(): Promise<void> {
  return Linking.openSettings();
}
