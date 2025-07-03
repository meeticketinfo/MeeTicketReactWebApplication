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
      resetOuterFilters: () =>
        set({
          outerFilters: {
            fromDate: "",
            toDate: "",
            mobileNumber: "",
            status: "",
          },
        }),

      setInnerFilters: (newFilters) =>
        set((state) => ({
          innerFilters: {
            ...state.innerFilters,
            ...newFilters,
          },
        })),
      resetInnerFilters: () =>
        set({
          innerFilters: {
            fromDate: "",
            toDate: "",
            mobileNumber: "",
            status: "",
            subCategory: "",
          },
        }),

      setDeepInnerFilters: (newFilters) =>
        set((state) => ({
          deepInnerFilters: {
            ...state.deepInnerFilters,
            ...newFilters,
          },
        })),
      resetDeepInnerFilters: () =>
        set({
          deepInnerFilters: {
            startDate: "",
            endDate: "",
            mobileNumber: "",
            status: "",
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
