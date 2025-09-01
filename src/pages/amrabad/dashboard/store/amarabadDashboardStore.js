import { create } from "zustand";
import { persist } from "zustand/middleware";
import { handleApiError } from "../../../../utils/apiErrorHandler";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import apiService from "../../../../services/apiService";


export const useAmrabadDashboardStore = create(
  ((set) => ({
    // Dashboard data
    amrabadDashboardData: [],
    isFetchAmrabadDashboardDataLoading: false,

    // Packages data
    packagesData: [],
    isFetchPackagesDataLoading: false,

    // Bookings summary data
    amrabadDashboardBookingsSummaryData: [],
    isFetchAmrabadDashboardBookingsSummaryDataLoading: false,

    // Packages data by id
    packagesDataById: [],
    isFetchPackagesDataByIdLoading: false,


    amrabadDashboardBookingsFullSummaryData: [],
    isFetchAmrabadDashboardBookingsFullSummaryDataLoading: false,


    // Fetch bookings full summary data API
    fetchAmrabadDashboardBookingsFullSummaryData: async (filters) => {
      set({ isFetchAmrabadDashboardBookingsFullSummaryDataLoading: true });
      try {
        const response = await apiService.get(`${API_ENDPOINTS.AMRABAD.DASHBOARD.GET_AMRABAD_DASHBOARD_BOOKINGS_FULL_SUMMARY}?fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
        set({ amrabadDashboardBookingsFullSummaryData: response.data, isFetchAmrabadDashboardBookingsFullSummaryDataLoading: false });
      } catch (error) {
        handleApiError(error);
        set({ isFetchAmrabadDashboardBookingsFullSummaryDataLoading: false });
      }
    },

  }))
);          