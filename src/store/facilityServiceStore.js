// src/store/facilityServiceStore.js
import create from "zustand";

export const useFacilityServiceStore = create((set) => ({
  allFacilities: [],
  allServices: [],
  allServiceVariants: [],
  quantities: {},
  setFacilities: (facilities) => set({ allFacilities: facilities }),
  setServices: (services) => set({ allServices: services }),
  setServiceVariants: (serviceVariants) =>
    set({ allServiceVariants: serviceVariants }),

  // Handle quantity changes
  updateQuantity: (variantId, amount) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [variantId]: Math.max(0, (state.quantities[variantId] || 0) + amount),
      },
    })),

  // Get selected items with quantities > 0
  getSelectedVariants: () => {
    const { quantities, allServiceVariants } = get();
    return allServiceVariants.filter((variant) => quantities[variant.id] > 0);
  },
}));
