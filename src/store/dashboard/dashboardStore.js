import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useDashboardStore = create((set) => ({
  allBookings: [],
  isFetchAllBookingsLoading: false,
  isFetchCountsLoading: false,
  isFetchPieChartsLoading: false,
  isFetchEntityBookingsLoading: false,
  totalEntityBookingRecords: 0,
  allEntityBookings: [],
  allPieCharts: [],
  allCounts: [],
  error: null,
  success: null,
  allFacilityServices: {},
  isSaveBookingDetailsLoading: false,
  saveBookingDetailsError: null,
  bookingDetails: {},
  isFetchCurrentBookingDetailsLoading: false,
  isFetchZooDashboardLoading: false,
  allZooDashboard:[],

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

  fetchAllDashboardCounts: async (roleDetails) => {
    set({ isFetchCountsLoading: true });
    try {
      const role = roleDetails?.name;
      // const endpoint =API_ENDPOINTS.DASHBOARD.GET_BOOKINGS_BY_ROLE
      const endpoint =
        role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN"
          ? API_ENDPOINTS.DASHBOARD.GET_BOOKINGS_BY_ROLE
          : role === "ROLE_METROADMIN"
            ? API_ENDPOINTS.DASHBOARD.GET_METRO_DASHBOARD_COUNT
            : API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_COUNTS;

      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${endpoint}`
      );
      set({
        allCounts: response.data,
        isFetchCountsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchCountsLoading: false });
    }
  },

  fetchAllEntityWiseCounts: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchPieChartsLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.DASHBOARD.PIE_CHARTS.GET_ENTITY_WISE_COUNTS}`
      );
      set({
        allPieCharts: response.data,
        isFetchPieChartsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchPieChartsLoading: false });
    }
  },

  fetchAllEntityBookingsByFilters: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchEntityBookingsLoading: true });
    try {
      const filterString = useDashboardStore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_BOOKINGS}?${filterString}`
      );
      if (response.data.status === 404) {
        set({
          allEntityBookings: [],
          isFetchEntityBookingsLoading: false,
          totalEntityBookingRecords: 0,
        });
      } else {
        set({
          allEntityBookings: response.data.data.data || [],
          isFetchEntityBookingsLoading: false,
          totalEntityBookingRecords: response?.data?.totalCount || 0,
        });
      }
    } catch (error) {
      set({ error: error.error.message, isFetchEntityBookingsLoading: true });
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

  // ZOO DASH BOARD
  fetchAllZooDashBoardCounts: async (date) => {
    set({ isFetchZooDashboardLoading: true });
    try {

      const response = await apiService.get(

        `${API_ENDPOINTS.DASHBOARD.GET_ZOO_PARK_DASHBOARD_COUNTS}?date=${date}`
      );
      set({
        allZooDashboard: response.data,
        isFetchZooDashboardLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchZooDashboardLoading: false });
    }
  },
}));
