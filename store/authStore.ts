import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { log } from '@/lib/logger';

export type User = {
  appUid: string;
  email: string;
  name: string | null;
  photoURL: string | null;
  provider: 'google';
};

type AuthState = {
  user: User | null;
  appToken: string | null;
  isLoggedIn: boolean;
  hasAskedForNotifications: boolean;
  signIn: (payload: { user: User; appToken: string }) => void;
  logout: () => void;
  markNotificationPermissionAsked: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      appToken: null,
      isLoggedIn: false,
      hasAskedForNotifications: false,
      signIn: ({ user, appToken }) => {
        log.info('STORE', 'auth signIn', { appUid: user.appUid });
        set({ user, appToken, isLoggedIn: true });
      },
      logout: () => {
        log.info('STORE', 'auth logout');
        set({ user: null, appToken: null, isLoggedIn: false });
      },
      markNotificationPermissionAsked: () => {
        log.debug('STORE', 'markNotificationPermissionAsked');
        set({ hasAskedForNotifications: true });
      },
    }),
    {
      name: 'moviemania.auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        appToken: state.appToken,
        isLoggedIn: state.isLoggedIn,
        hasAskedForNotifications: state.hasAskedForNotifications,
      }),
    },
  ),
);

export default useAuthStore;
