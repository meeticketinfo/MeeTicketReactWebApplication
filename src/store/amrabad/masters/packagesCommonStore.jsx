import { create } from "zustand";

export const usePackagesCommonStore = create((set) => ({
    currentTab:0,
    setCurrentTab:(currentTab)=>set({currentTab:currentTab})
 
}));
