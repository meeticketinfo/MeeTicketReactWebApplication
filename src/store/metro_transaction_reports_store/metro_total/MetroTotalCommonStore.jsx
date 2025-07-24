import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMetroTotalCommonStore = create(
  persist(
    (set, get) => ({
      outerFilters: {
        fromDate: "",
        toDate: "",
        mobileNumber: "",
        status: "",
      },
      innerFilters: {
        fromDate: "",
        toDate: "",
        mobileNumber: "",
        status: "",
        subCategory: "",
      },
      deepInnerFilters: {
        startDate: "",
        endDate: "",
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
            mobileNumber: "",
            status: "",
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
            mobileNumber: "",
            status: "",
            subCategory: "",
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
            mobileNumber: "",
            status: "",
            ...newFilters,
          },
        }),
    }),
    {
      name: "metro-total-transaction-filters",
      getStorage: () => localStorage,
    }
  )
);

export default useMetroTotalCommonStore;
