import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useBookingsStore = create((set) => ({
  allBookings: [],
  isFetchAllBookingsLoading: false,
  error: null,
  success: null,
  allFacilityServices: {},
  isSaveBookingDetailsLoading: false,
  saveBookingDetailsError: null,
  bookingDetails: {},
  isFetchCurrentBookingDetailsLoading: false,

  //
  bookings: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  //

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  setBookingDetails: (newBookingDetails) => {
    set({ bookingDetails: newBookingDetails });
  },

  // Set the current page
  setCurrentPage: (page) => set({ currentPage: page }),

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
        allBookings: response.data.data.data,
        isFetchAllBookingsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllBookingsLoading: false });
    }
  },

  // Fetch bookings with optional filtering
  fetchAllEntityBookingsByFilters: async (filters = {}) => {
    set({ isLoading: true, error: null });
    const { currentPage, pageSize } = useBookingsStore.getState();
    const serializedFilters = Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    try {
      const response = await apiService.get(
        `Transaction/GetAllEntityBookingByFilters?PageIndex=${currentPage}&PageSize=${pageSize}&${serializedFilters}`
      );

      if (response.status === 200) {
        // const { data, totalCount } = response.data.data;
        set({
          bookings: response.data.data.data,
          totalCount: response.data.totalCount,
          isLoading: false,
        });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
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
