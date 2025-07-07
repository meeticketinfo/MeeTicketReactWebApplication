import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const metroRefundReports = create((set) => ({
  
  metroRefundTransactionsReport: [],
  isFetchMetroRefundTransactionsReport: false,
  
  fetchMetroRefundTransactionsReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchMetroRefundTransactionsReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_METRO_REFUND_TRANSACTIONS_REPORT}?${queryString}`
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
