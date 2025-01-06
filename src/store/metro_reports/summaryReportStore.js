import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useSummaryReportStore = create((set) => ({
  allMetroSummaryReports: [],
  isFetchAllMetroSummaryReportsLoading: false,
  MetroBookingsDetails: {},

  isFetchCurrentMetroBookingsDetailsLoading: false,

  // Fetch all Metro Bookings
  fetchAllMetroSummaryReport: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllMetroSummaryReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_Reports.GET_METRO_SUMMARY}`
      );
      set({
        allMetroSummaryReports: response.data,
        isFetchAllMetroSummaryReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllMetroSummaryReportsLoading: false });
    }
  },
}));
