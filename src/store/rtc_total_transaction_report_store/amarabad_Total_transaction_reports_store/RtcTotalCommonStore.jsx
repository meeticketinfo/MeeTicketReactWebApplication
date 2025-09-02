import { create } from "zustand";
import { persist } from "zustand/middleware";

const RtcTotalCommonStore = create(
  persist(
    (set, get) => ({
      outerFilters: {
        fromDate: "",
        toDate: "",
        status: "",
        package: "",
        house: "",
        mobileNumber: "",
      },
      innerFilters: {
        fromDate: "",
        toDate: "",
        package: "",
        house: "",
        mobileNumber: "",
        status: "",
        subCategory: "",
      },
      deepInnerFilters: {
        startDate: "",
        endDate: "",
        package: "",
        house: "",
        mobileNumber: "",
        bookingSource: "",
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
            package: "",
            house: "",
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
            package: "",
            house: "",
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
            package: "",
            house: "",
            mobileNumber: "",
            bookingSource: "",
            status: "",
            ...newFilters,
          },
        }),
    }),
    {
      name: "amrabad-total-transaction-filters",
      getStorage: () => localStorage,
    }
  )
);

export default RtcTotalCommonStore;
