import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { persist } from "zustand/middleware";
import { handleApiError } from "../../../../../utils/apiErrorHandler";

export const useAmrabadHouseWiseReportStore = create(
  persist((set) => ({
    allAmrabadHouseWiseReports: [],
    isFetchAllAmrabadHouseWiseReportsLoading: false,
    totalCount: 0,
    fetchAllAmrabadHouseWiseReports: async (filters) => {
      set({ isFetchAllAmrabadHouseWiseReportsLoading: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.AMRABAD.REPORTS.AMRABAD_HOUSE_WISE_REPORT}?fromDate=${filters.startDate}&toDate=${filters.endDate}&purchaseOrBooking=${filters.bookingSource || ""}&mobileNumber=${filters.mobileNumber || ""}&packageId=${filters.package || ""}&roomId=${filters.houses || ""}&id=${filters.orderId || ""}&modeOfBooking=${filters.modeOfBooking || ""}&pageNumber=${filters.PageIndex || 1}&pageSize=${filters.pageSize || 20}`
        );
        set({ 
          allAmrabadHouseWiseReports: response.data.records,
          totalCount: response.data.totalCount,
          isFetchAllAmrabadHouseWiseReportsLoading: false 
        });
      } catch (error) {
        console.error("Error fetching Amrabad house wise reports:", error);
        handleApiError(error);
        set({ isFetchAllAmrabadHouseWiseReportsLoading: false });
      }
    },
  }))
);
