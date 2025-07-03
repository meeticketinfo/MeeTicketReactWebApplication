import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const metroRefundReports = create((set) => ({
  
  metroRefundTransactionsReport: [],
  isFetchRefundTransactionsReport: false,

  fetchMetroRefundTransactionsReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchMetroRefundTransactionsReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_REFUND_TRANSACTIONS_REPORT}?${queryString}`
      );
      set({
        metroRefundTransactionsReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchMetroRefundTransactionsReport: false,
      });
    }
  },
}));
