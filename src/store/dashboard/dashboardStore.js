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
  totalNehruCounterBookingRecords: 0,
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
  allZooDashboard: [],
  isFetchZooDashboardTicketWiseLoading: false,
  allZooDashboardTicketWise: [],
  AllFacilityBookings: [],
  isFetchFacilityBookingsLoading: false,
  AllDetailedReport:[],
  isFetchDetailedLoading: false,
  // Day Wise Bookings
  AllFacilityDayWiseBookings:  [],
  isFacilityDayWiseBookingsLoading: false,
  // Application Facility Bookings By Booking Source
  AllApplicationFacilityBookings: [],
  isFetchFacilityBookingSourceLoading: false,

  
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

  fetchAllDashboardCounts: async (
    roleDetails,
    { fromDate, toDate, entityId, active }
  ) => {
    const date = active
      ? `?FromDate=${fromDate}&ToDate=${toDate}&LocationCategoryId=${entityId}`
      : "";
    set({ isFetchCountsLoading: true });
    try {
      const role = roleDetails?.name;
      // const endpoint =API_ENDPOINTS.DASHBOARD.GET_BOOKINGS_BY_ROLE
      const endpoint =
        role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN"
          ? `${API_ENDPOINTS.DASHBOARD.GET_BOOKINGS_BY_ROLE}${date}`
          : role === "ROLE_METROADMIN"
          ? `${API_ENDPOINTS.DASHBOARD.GET_METRO_DASHBOARD_COUNT}${date}`
          : `${API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_COUNTS}${date}`;

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

  fetchAllEntityWiseCounts: async ({ fromDate, toDate, entityId, active }) => {
    const date = active
      ? `?FromDate=${fromDate}&ToDate=${toDate}&LocationCategoryId=${entityId}`
      : "";
    set({ isFetchPieChartsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.PIE_CHARTS.GET_ENTITY_WISE_COUNTS}${date}`
      );
      set({
        allPieCharts: response.data,
        isFetchPieChartsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchPieChartsLoading: false });
    }
  },

  fetchAllEntityBookingsByFilters: async (filters = {}) => {
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
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.error.message, isFetchEntityBookingsLoading: true });
    }
  },
  //zoo new individual report
  fetchAllNehruCounterBookingsByFilters: async (filters = {}) => {
    set({ isFetchNehruCounterBookingsLoading: true });
    try {
      const filterString = useDashboardStore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_NEHRU_COUNTER_BOOKINGS}?${filterString}`
      );
      if (response.data.status === 404) {
        set({
          allNehruCounterBookings: [],
          isFetchNehruCounterBookingsLoading: false,
          totalNehruCounterBookingRecords: 0,
        });
      } else {
        set({
          allNehruCounterBookings: response.data.data.data || [],
          isFetchNehruCounterBookingsLoading: false,
          totalNehruCounterBookingRecords: response?.data?.totalCount || 0,
        });
      }
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.error.message, isFetchNehruCounterBookingsLoading: true });
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
  fetchAllZooDashBoardCountsTicketWise: async ({
    fromDate,
    toDate,
    entityId,
    active,
  }) => {
    const date = active
      ? `?FromDate=${fromDate}&ToDate=${toDate}&LocationCategoryId=${entityId}`
      : "";
    set({ isFetchZooDashboardTicketWiseLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ZOO_PARK_DASHBOARD_COUNTS_TICKET_WISE}${date}`
      );
      set({
        allZooDashboardTicketWise: response.data,
        isFetchZooDashboardTicketWiseLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchZooDashboardTicketWiseLoading: false,
      });
    }
  },

  // facility bookings
  fetchAllFacilityBookingsByFilters: async (filters) => {
    set({ isFetchFacilityBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_Facility_BOOKINGS}?startDate=${filters.fromDate}&endDate=${filters.toDate}&bookingSource=${filters.bookingSource}`
      );
      console.log("response", response);
      if (response.status == 200) {
        set({
          AllFacilityBookings: response.data || [],
          isFetchFacilityBookingsLoading: false,
        });
      }
    } catch (error) {
      set({ error: error.error.message, isFetchFacilityBookingsLoading: true });
    }
  },

  //  GET_ALL_DAY_WISE_BOOKINGS
  fetchAllFacilityDayWiseBookings: async (filters) => {
    set({ isFacilityDayWiseBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_DAY_WISE_BOOKINGS}?startDate=${filters.fromDate}&endDate=${filters.toDate}`
      );
      console.log("response", response);
      if (response.status == 200) {
        set({
          AllFacilityDayWiseBookings: response.data || [],
          isFacilityDayWiseBookingsLoading: false,
        });
      }
    } catch (error) {
      set({ error: error.error.message, isFacilityDayWiseBookingsLoading: true });
    }
  },

  // GET_ALL_APPLICATION_WISE_BOOKINGS
  fetchAllFacilityBookingsByBookingSource: async (filters) => {
    set({ isFetchFacilityBookingSourceLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_APPLICATION_WISE_BOOKINGS}?startDate=${filters.fromDate}&endDate=${filters.toDate}&bookingSource=${filters.bookingSource}`
      );
      // console.log("responsenow", response);
      if (response.status == 200) {
        set({
          AllApplicationFacilityBookings: response.data.bookings || [],
          isFetchFacilityBookingSourceLoading: false,
        });
      }
    } catch (error) {
      set({ error: error.error.message, isFetchFacilityBookingSourceLoading: true });
    }
  },

  // detailed Report
  fetchAllDetailedReportFilters: async (filters) => {
    set({ isFetchDetailedLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_ALL_DASHBOARD_DETAILED_REPORT}?ParkId=100&Date=${filters.Date}&ServiceId=${filters.ServiceId}`
      );
      console.log("response", response);
      if (response.status == 200) {
        set({
          AllDetailedReport: response.data || [],
          isFetchDetailedLoading: false,
        });
      }
    } catch (error) {
      set({ error: error.error.message, isFetchDetailedLoading: true });
    }
  },
  

}));
