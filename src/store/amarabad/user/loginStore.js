import { create } from "zustand";

export const loginStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));