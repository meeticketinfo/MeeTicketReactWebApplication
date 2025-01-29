import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMetroPendingTransactionStore = create((set) => ({
  allMetroPendingTransactionDetailsReports: [],
  isFetchAllMetroPaymentTransactionDetailsReportsLoading: false,
  MetroPendingTransactionDetails: {},

  isFetchCurrentMetroPaymentTransactionDetailsLoading: false,

  // Fetch all Metro Bookings
  fetchAllMetroPaymentTransactionDetailsReport: async (
    // pageIndex = 1, pageSize = 10, filters = {},
    { fromDate, toDate }
  ) => {
    set({ isFetchAllMetroPaymentTransactionDetailsReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_Reports.GET_METRO_PENDING_TRANSACTION_DETAILS}?StartDate=${fromDate}&EndDate=${toDate}`
      );
      set({
        allMetroPendingTransactionDetailsReports: response.data,
        isFetchAllMetroPaymentTransactionDetailsReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllMetroPaymentTransactionDetailsReportsLoading: false });
    }
  },
}));
