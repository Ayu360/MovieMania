import { useEffect } from 'react';

import {
  bootstrapNotifications,
  requestPermissionFirstTime,
} from '@/lib/notifications';
import useAuthStore from '@/store/authStore';

export function useNotificationBootstrap() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasAskedForNotifications = useAuthStore(
    (s) => s.hasAskedForNotifications,
  );

  useEffect(() => {
    bootstrapNotifications();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || hasAskedForNotifications) return;
    void requestPermissionFirstTime();
  }, [isLoggedIn, hasAskedForNotifications]);
}
