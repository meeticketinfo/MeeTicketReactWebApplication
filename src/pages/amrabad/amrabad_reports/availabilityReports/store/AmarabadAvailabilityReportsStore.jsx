import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { handleApiError } from "../../../../../utils/apiErrorHandler";

export const useAmarabadAvailabilityReportsStore = create((set, get) => ({
  amrabadAvailabilityInnerReports: [],
  isFetchAmarabadAvailabilityInnerReportsLoading: false,
  amrabadAvailabilityOuterReports: [],
  isFetchAmarabadAvailabilityOuterReportsLoading: false,
  totalCount: 0,
  outerTotalCount: 0,
  
  // Cache for storing last request parameters and results
  lastOuterRequestParams: null,
  lastOuterRequestResult: null,

  fetchAmarabadAvailabilityOuterReports: async (filters) => {
    
    set({ isFetchAmarabadAvailabilityOuterReportsLoading: true });
    
    try {
      const response = await apiService.get(
        `${
          API_ENDPOINTS.AMRABAD.REPORTS.AMRABAD_AVAILABILITY_OUTER_REPORTS}?fromDate=${filters.startDate || ""}&toDate=${filters.endDate || ""}&month=${filters.month || ""}&year=${filters.year || ""}&pageNumber=${filters.PageIndex || 1}&pageSize=${filters.pageSize || 20}`
      );
      console.log("API Response in store:", response.data);
      
      // Store the request parameters and results for caching
      const result = {
        amrabadAvailabilityOuterReports: response.data || response.data,
        outerTotalCount: response.data.totalCount || 0,
      };
      
      set({
        ...result,
        isFetchAmarabadAvailabilityOuterReportsLoading: false,
        lastOuterRequestResult: result,
      });
    } catch (error) {
      handleApiError(error);
      set({ isFetchAmarabadAvailabilityOuterReportsLoading: false });
    }
  },
  
  fetchAmarabadAvailabilityInnerReports: async (filters) => {
    set({ isFetchAmarabadAvailabilityInnerReportsLoading: true });
    try {
      const response = await apiService.get(
        `${
          API_ENDPOINTS.AMRABAD.REPORTS.AMRABAD_AVAILABILITY_INNER_REPORTS}?fromDate=${filters.startDate}&toDate=${filters.endDate}&purchaseOrBooking=${filters.bookingSource || ""}&mobileNumber=${filters.mobileNumber || ""}&packageId=${filters.package || ""}&roomId=${ filters.houses || ""}&id=${filters.orderId || ""}&paymentStatus=${filters.paymentStatus || ""}&modeOfBooking=${filters.modeOfBooking || ""}&pageNumber=${filters.PageIndex || 1}&pageSize=${filters.pageSize || 20}`
      );
      set({
        amrabadAvailabilityInnerReports: response.data.records,
        totalCount: response.data.totalCount,
        isFetchAmarabadAvailabilityInnerReportsLoading: false,
      });
    } catch (error) {
      handleApiError(error);
      set({ isFetchAmarabadAvailabilityInnerReportsLoading: false });
    }
  },

  // Function to clear cache when needed
  clearOuterReportsCache: () => {
    set({
      lastOuterRequestParams: null,
      lastOuterRequestResult: null,
    });
  },

}));
