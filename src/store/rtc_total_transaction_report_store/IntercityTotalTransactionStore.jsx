import { create } from "zustand";
import { persist } from "zustand/middleware";

const IntercityTotalCommonStore = create(
  persist(
    (set, get) => ({
      outerFilters: {
        fromDate: "",
        toDate: "",
        status: "",
        arrivalLocation: "",
        departureLocation: "",
        busType: "",
        mobileNumber: "",
      },
      innerFilters: {
        fromDate: "",
        toDate: "",
        mobileNumber: "",
        status: "",
        arrivalLocation: "",
        departureLocation: "",
        busType: "",
      },
      deepInnerFilters: {
        startDate: "",
        endDate: "",  
        arrivalLocation: "",
        departureLocation: "",
        busType: "",
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
            arrivalLocation: "",
            departureLocation: "",
            busType: "",
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
            arrivalLocation: "",
            departureLocation: "",
            busType: "",
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
            arrivalLocation: "",
            departureLocation: "",
            busType: "",
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
