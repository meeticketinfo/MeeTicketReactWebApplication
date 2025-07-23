import { create } from "zustand";

export const usePackagesCommonStore = create((set) => ({
  currentTab: 0,
  isHouseEditVisible: false,
  selectedSubRowData:{},
  setSelectedSubRow: (selectedSubRowData) => {
    set({ selectedSubRowData });
  },
  setCurrentTab: (currentTab) => set({ currentTab: currentTab }),

  setIsHouseEditVisible: (isHouseEditVisible) => {
    set({ isHouseEditVisible });
  },
}));
