import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useRTCBookingsStore = create((set) => ({
  allRTCBookings: [],
  isFetchAllRTCBookingsLoading: false,
  RTCBookingsDetails: {},
  RTCBookingsEditDetails: {},
  isFetchCurrentRTCBookingsDetailsLoading: false,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

    setRTCBookingsDetails: (newDepartmentTypeDetails) => {
    set({ RTCBookingsDetails: newDepartmentTypeDetails });
  },

  setRTCBookingsEditDetails: (RTCBookingsEditDetails) => {
    set({ RTCBookingsEditDetails });
  },

  // Fetch all RTC Bookings
  fetchAllRTCBookings: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllRTCBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_BOOKINGS.GET_RTC_BOOKINGS}`
      );
      set({
        allRTCBookings: response.data,
        isFetchAllRTCBookingsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllRTCBookingsLoading: false });
    }
  },

  
}));
