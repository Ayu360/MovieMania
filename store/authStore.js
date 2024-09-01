import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (userDetails) =>
    set(() => ({
      user: userDetails,
    })),
}));

export default useAuthStore;
