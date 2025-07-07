import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

export const metroRefundReports = create((set) => ({
  
  metroRefundTransactionsReport: [],
  isFetchMetroRefundTransactionsReport: false,
  
  metroRefundTransactionsInnerReport: [],
  isFetchMetroRefundTransactionsInnerReport: false,

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
      toast.error(error.message)
      set({
        error: error.message,metroRefundTransactionsReport: [],
      });
    } finally {
      set({
        isFetchMetroRefundTransactionsReport: false,
      });
    }
  },
  fetchMetroRefundTransactionsInnerReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchMetroRefundTransactionsInnerReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_METRO_REFUND_TRANSACTIONS_INNER_REPORT}?${queryString}`
      );
      set({
        metroRefundTransactionsInnerReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message)
      set({
        error: error.message,metroRefundTransactionsInnerReport: [],
      });
    } finally {
      set({
        isFetchMetroRefundTransactionsInnerReport: false,
      });
    }
  },
}));
