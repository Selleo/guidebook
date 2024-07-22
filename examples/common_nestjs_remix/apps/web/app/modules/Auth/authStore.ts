import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UpdateUserResponse } from "~/api/generated-api";

type AuthStore = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  currentUser: UpdateUserResponse["data"] | null;
  setCurrentUser: (user: UpdateUserResponse["data"]) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (value) => set({ isLoggedIn: value }),
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
