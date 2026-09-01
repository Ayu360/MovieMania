import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getPermissionStatus } from '@/lib/notifications';

const DISMISS_KEY = 'notifPermCardDismissedAt';
const DISMISS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function usePermissionCardVisible() {
  const [visible, setVisible] = useState(false);

  const evaluate = useCallback(async () => {
    const status = await getPermissionStatus();
    if (status.granted || status.canAskAgain) {
      setVisible(false);
      return;
    }
    const raw = await AsyncStorage.getItem(DISMISS_KEY);
    if (raw) {
      const at = Number(raw);
      if (!Number.isNaN(at) && Date.now() - at < DISMISS_WINDOW_MS) {
        setVisible(false);
        return;
      }
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    void evaluate();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void evaluate();
    });
    return () => sub.remove();
  }, [evaluate]);

  const dismiss = useCallback(async () => {
    await AsyncStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }, []);

  return { visible, dismiss, refresh: evaluate };
}
