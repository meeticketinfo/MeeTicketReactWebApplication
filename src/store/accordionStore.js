import { create } from "zustand";

export const useAccordionStore = create((set) => ({
  expandedItems: [],
  toggleItem: (id) =>
    set((state) => {
      const isExpanded = state.expandedItems.includes(id);
      return {
        expandedItems: isExpanded
          ? state.expandedItems.filter((item) => item !== id)
          : [...state.expandedItems, id],
      };
    }),
}));
