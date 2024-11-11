import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useDashboardStore = create((set) => ({
  allBookings: [],
  isFetchAllBookingsLoading: false,
  error: null,
  success: null,
  allFacilityServices: {},
  isSaveBookingDetailsLoading: false,
  saveBookingDetailsError: null,
  bookingDetails: {},
  isFetchCurrentBookingDetailsLoading: false,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  setBookingDetails: (newBookingDetails) => {
    set({ bookingDetails: newBookingDetails });
  },

  // Fetch all Bookings
  fetchAllBookings: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllBookingsLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.BOOKING.GET_BOOKINGS}`
      );
      set({
        allBookings: response.data,
        isFetchAllBookingsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllBookingsLoading: false });
    }
  },

  fetchCurrentBookingDetailsByBookingId: async (bookingId) => {
    set({ isFetchCurrentBookingDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.BOOKING.GET_BOOKINGS_BOOKING_ID}/${bookingId}`
      );
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchCurrentBookingDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isFetchCurrentBookingDetailsLoading: false });
      return { success: false };
    }
  },

  // Save Facility details
  saveBookingDetails: async (bookingDetailsPayload) => {
    set({ isSaveBookingDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.BOOKING.ADD_BOOKINGS;
      const method = "post";

      const response = await apiService[method](url, bookingDetailsPayload);

      set({
        facilityCreateResponse: { response },
        FacilityDetails: response.data,
        isSaveBookingDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        saveBookingDetailsError: error.message,
        isSaveBookingDetailsLoading: false,
      });
      throw error;
    }
  },
}));
