// stores/quantitiesStore.js
import {create} from "zustand";

export const useQuantitiesStore = create((set) => ({
  quantities: {},
  updateQuantity: (variantId, amount) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [variantId]: Math.max(0, (state.quantities[variantId] || 0) + amount),
      },
    })),
}));
