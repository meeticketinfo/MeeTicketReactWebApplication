import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSidebarStore = create(
  persist(
    (set) => ({
      sidebarOpen: false,
      sidebarExpanded: false,

      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      setSidebarExpanded: (isExpanded) => set({ sidebarExpanded: isExpanded }),
    }),
    {
      name: "sidebar-storage", // name of the localStorage key
    }
  )
);

export default useSidebarStore;
