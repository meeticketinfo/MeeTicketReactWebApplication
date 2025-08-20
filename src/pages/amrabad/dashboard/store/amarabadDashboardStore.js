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
    
    // Fetch dashboard data API
    fetchAmrabadDashboardData: async (filters) => {
      set({ isFetchAmrabadDashboardDataLoading: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.AMRABAD.DASHBOARD.GET_AMRABAD_DASHBOARD_count}?fromDate=${filters.fromDate}&toDate=${filters.toDate}`
        );
        set({ amrabadDashboardData: response.data, isFetchAmrabadDashboardDataLoading: false });
      } catch (error) {
        handleApiError(error);
        set({ isFetchAmrabadDashboardDataLoading: false });
      }
    },
    
    // Fetch bookings summary data API
    fetchAmrabadDashboardBookingsSummaryData: async (filters) => {
      set({ isFetchAmrabadDashboardBookingsSummaryDataLoading: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.AMRABAD.DASHBOARD.GET_AMRABAD_DASHBOARD_BOOKINGS_SUMMARY}?fromDate=${filters.fromDate}&toDate=${filters.toDate}`
        );
        set({ amrabadDashboardBookingsSummaryData: response.data, isFetchAmrabadDashboardBookingsSummaryDataLoading: false });
      } catch (error) {
        handleApiError(error);
        set({ isFetchAmrabadDashboardBookingsSummaryDataLoading: false });
      }     
    },
 
    // Fetch packages data by id API
    fetchPackagesDataById: async (id) => {
      set({ isFetchPackagesDataByIdLoading: true });
      try {
        const response = await apiService.get(`${API_ENDPOINTS.AMRABAD.DASHBOARD.GET_AMRABAD_DASHBOARD_PACKAGES_BY_ID}/${id}`);
        set({ packagesDataById: response.data, isFetchPackagesDataByIdLoading: false });
      } catch (error) { 
        handleApiError(error);
        set({ isFetchPackagesDataByIdLoading: false });
      }
    }
  }))
);          