import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMetroBookingsStore = create((set) => ({
  allMetroBookings: [],
  isFetchAllMetroBookingsLoading: false,
  MetroBookingsDetails: {},
  MetroBookingsEditDetails: {},
  isFetchCurrentMetroBookingsDetailsLoading: false,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

    setMetroBookingsDetails: (newMetroBookingsDetails) => {
    set({ MetroBookingsDetails: newMetroBookingsDetails });
  },

  setRTCBookingsEditDetails: (MetroBookingsEditDetails) => {
    set({ MetroBookingsEditDetails });
  },

  // Fetch all Metro Bookings
  fetchAllMetroBookings: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllMetroBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_BOOKINGS.GET_METRO_BOOKINGS}`
      );
      set({
        allMetroBookings: response.data,
        isFetchAllMetroBookingsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllMetroBookingsLoading: false });
    }
  },

  
}));
