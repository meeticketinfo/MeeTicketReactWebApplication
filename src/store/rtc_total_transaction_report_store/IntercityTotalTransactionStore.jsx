import { create } from "zustand";
import { persist } from "zustand/middleware";

const IntercityTotalCommonStore = create(
  persist(
    (set, get) => ({
      outerFilters: {
        fromDate: "",
        toDate: "",
        status: "",
        mobileNumber: "",
        BusPassType: "",
      },
      innerFilters: {
        fromDate: "",
        toDate: "",
        BusPassType: "",
        mobileNumber: "",
        status: "",
      },
      deepInnerFilters: {
        startDate: "",
        endDate: "",
        BusPassType: "",
        mobileNumber: "",
        status: "",
      },

      setOuterFilters: (newFilters) =>
        set((state) => ({
          outerFilters: {
            ...state.outerFilters,
            ...newFilters,
          },
        })),

      resetOuterFilters: (newFilters = {}) =>
        set({
          outerFilters: {
            fromDate: "",
            toDate: "",
            status: "",
            BusPassType: "",
            mobileNumber: "",
            ...newFilters,
          },
        }),

      setInnerFilters: (newFilters) =>
        set((state) => ({
          innerFilters: {
            ...state.innerFilters,
            ...newFilters,
          },
        })),

      resetInnerFilters: (newFilters = {}) =>
        set({
          innerFilters: { 
            fromDate: "",
            toDate: "",
            BusPassType: "",
            mobileNumber: "",
            status: "",
            ...newFilters,
          },
        }),

      setDeepInnerFilters: (newFilters) =>
        set((state) => ({
          deepInnerFilters: {
            ...state.deepInnerFilters,
            ...newFilters,
          },
        })),

      resetDeepInnerFilters: (newFilters = {}) =>
        set({
          deepInnerFilters: {
            startDate: "",
            endDate: "",
            BusPassType: "",
            mobileNumber: "",
            status: "",
            ...newFilters,
          },
        }),
    }),
    {
      name: "intercity-total-transaction-filters",
      getStorage: () => localStorage,
    }
  )
);

export default IntercityTotalCommonStore;
