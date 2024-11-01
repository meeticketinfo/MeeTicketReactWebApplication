import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useBookingsStore = create((set) => ({
  allBookings: [],
  isFetchAllBookingsLoading: false,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Bookings
  fetchAllBookings: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllBookingsLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.BOOKING.GET_BOOKINGS}`
      );
      console.log(response);

      set({
        allBookings: response.data,
        isFetchAllBookingsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllBookingsLoading: false });
    }
  },
}));
