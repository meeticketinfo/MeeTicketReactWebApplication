import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { handleApiError } from "../../../../../utils/apiErrorHandler";

export const useAmarabadAvailabilityReportsStore = create((set) => ({
  amrabadAvailabilityInnerReports: [],
  isFetchAmarabadAvailabilityInnerReportsLoading: false,
  totalCount: 0,
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
}));
