import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (userDetails) =>
    set(() => ({
      user: userDetails,
    })),
}));

export default useAuthStore;
