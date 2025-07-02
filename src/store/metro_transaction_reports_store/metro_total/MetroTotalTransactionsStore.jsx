import { create } from "zustand";

import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useMetroTotalTransactionsStore = create((set) => ({
  // by Reason
  MetroTransactionByReasonData: [],
  isMetroTransactionByReasonLoading: false,

  // metro total transactions
  MetroTotalTransactionsData: [],
  isMetroTotalTransactionsLoading: false,
  // other reasons pie chart

  OtherReasonsPieChartData: [],
  isOtherReasonsPieChartLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason

  fetchMetroTransactionByReason: async (payload) => {
    set({ isMetroTransactionByReasonLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.GET_METRO_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        MetroTransactionByReasonData: response.data,
        isMetroTransactionByReasonLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isMetroTransactionByReasonLoading: false });
    }
  },

  //   TOTAL TRANSACTIONS

  fetchMetroTotalTransactions: async (payload) => {
    set({ isMetroTotalTransactionsLoading: true });
    const param = `?startDate=${payload.startDate}&endDate=${payload.endDate}&phoneNumber=${payload.phoneNumber}&status=${payload.status}&paymentMode=${payload.PaymentMode}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.GET_METRO_TOTAL_TRANSACTIONS}${param}`
      );

      set({
        MetroTotalTransactionsData: response.data,
        isMetroTotalTransactionsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isMetroTotalTransactionsLoading: false });
    }
  },

  // GET OTHER REASONS PIE CHART

  fetchOtherReasonsPieChart: async (payload) => {
    set({ isOtherReasonsPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.GET_OTHER_REASON_PIE_CHART}${param}`
      );

      set({
        OtherReasonsPieChartData: response.data,
        isOtherReasonsPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isOtherReasonsPieChartLoading: false });
    }
  },
}));
