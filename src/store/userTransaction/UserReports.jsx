import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const userReports = create((set) => ({
  TransactionTrackingStatusByOrderIdData: [],
  isFetchTransactionTrackingStatusByOrderId: false,

  userReport: [],
  isFetchUserReport: false,

  userDetailedReport: [],
  isFetchUserDetailedReport: false,

  refundTransactions: [],
  isFetchRefundTransactions: false,

  refundTransactionsReport: [],
  isFetchRefundTransactionsReport: false,

  isInitiateRefund: false,

  fetchUserReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchUserReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_USER_REPORT}?${queryString}`
      );
      set({
        userReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchUserReport: false,
      });
    }
  },

  fetchUserDetailedReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchUserDetailedReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_USER_DETAILED_REPORT}?${queryString}`
      );
      set({
        userDetailedReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchUserDetailedReport: false,
      });
    }
  },

  fetchTransactionTrackingStatusByOrderId: async (orderID) => {
    set({ isFetchTransactionTrackingStatusByOrderId: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_TRANSACTION_TRACKING_STATUS}?orderId=${orderID}`
      );
      set({
        TransactionTrackingStatusByOrderIdData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchTransactionTrackingStatusByOrderId: false,
      });
    }
  },
  fetFilters: (filters) => {
    set({ filters: filters });
  },
  fetchRefundTransactions: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchRefundTransactions: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS. METRO_TRANSACTIONS_REPORT.GET_REFUND_TRANSACTIONS}?${queryString}`
      );
      set({
        refundTransactions: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchRefundTransactions: false,
      });
    }
  },
  fetchRefundTransactionsReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchRefundTransactionsReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_REFUND_TRANSACTIONS_REPORT}?${queryString}`
      );
      set({
        refundTransactionsReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchRefundTransactionsReport: false,
      });
    }
  },

  // initiate Refund
  fetchInitiateRefundOrderId: async (orderID) => {
    set({ isInitiateRefund: true });
    try {
      const url =  `${API_ENDPOINTS.FAILED_TRANSACTIONS.INITIATE_REFUND}`;
          const method = "post";
          const response = await apiService[method](url, {orderId:orderID});

     
      set({
        InitiateRefundByOrderIdData: response.data,
      });
      return { response: response };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isInitiateRefund: false,
      });
    }
  },
}));
