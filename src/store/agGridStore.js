import { create } from "zustand";

export const useAggridStore = create((set) => ({
    quickFilterText: "",
    setQuickFilterText:(quickFilterText)=>{
           set({quickFilterText})
  },
 
}));