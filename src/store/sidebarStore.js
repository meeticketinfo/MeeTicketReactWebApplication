// sidebarStore.js
import { create } from "zustand";

const useSidebarStore = create((set) => ({
  sidebarOpen: false,
  sidebarExpanded: false,
  toggleSidebarOpen: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarExpanded: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
}));

export default useSidebarStore;
