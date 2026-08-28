import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  signIn: (payload: { user: User; appToken: string }) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      appToken: null,
      isLoggedIn: false,
      signIn: ({ user, appToken }) => set({ user, appToken, isLoggedIn: true }),
      logout: () => set({ user: null, appToken: null, isLoggedIn: false }),
    }),
    {
      name: 'moviemania.auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        appToken: state.appToken,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);

export default useAuthStore;
