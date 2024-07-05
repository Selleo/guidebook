import { create } from "zustand";

type AuthStore = {
  isLoggedIn: boolean;
  setAuthState: (isLoggedIn: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  setAuthState: (isLoggedIn) => set({ isLoggedIn }),
}));
