import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const metroUserReports = create((set) => ({
  MetroTransactionTrackingStatusByOrderIdData: [],
  isFetchMetroTransactionTrackingStatusByOrderId: false,

  metroUserReport: [],
  isfetchMetroUserReport: false,

  metroUserDetailedReport: [],
  isFetchMetroUserDetailedReport: false,

  isInitiateRefund: false,

  fetchMetroUserReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isfetchMetroUserReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_METRO_USER_REPORT}?${queryString}`
      );
      set({
        metroUserReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isfetchMetroUserReport: false,
      });
    }
  },

  fetchMetroUserDetailedReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchMetroUserDetailedReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_USER_TRANSACTION_DETAILS}?${queryString}`
      );
      set({ 
        metroUserDetailedReport: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchMetroUserDetailedReport: false,
      });
    }
  },

  fetchMetroTransactionTrackingStatusByOrderId: async (orderID) => {
    set({ isFetchMetroTransactionTrackingStatusByOrderId: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_METRO_TRANSACTION_TRACKING_STATUS}?orderId=${orderID}`
      );
      set({
        MetroTransactionTrackingStatusByOrderIdData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchMetroTransactionTrackingStatusByOrderId: false,
      });
    }
  },
  fetFilters: (filters) => {
    set({ filters: filters });
  },

}));
