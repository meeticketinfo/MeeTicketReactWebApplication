import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const userTransaction = create((set) => ({
  userTransactionReport: [],
  isFetchUserTransactionReport: false,
  userStatusTransactionReport: [],
  isFetchUserStatusTransactionReport: false,
  filters: {},

  fetchUserTransactionReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchUserTransactionReport: true });
    try {
      console.log(queryString, "fetchUserTransactionReport");
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_TRANSACTIONS_REPORTS}?${queryString}`
      );
      console.log(response, "response")
      set({
        userTransactionReport: response.data,
      });
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchUserTransactionReport: false,
      })
    }
  },
  fetchUserStatusTransactionReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchUserStatusTransactionReport: true });
    try {
      console.log(queryString, "fetchUserStatusTransactionReport");
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_REPORTS.GET_STATUS_TRANSACTIONS_REPORTS}?${queryString}`
      );
      console.log(response, "response")
      set({
        userStatusTransactionReport: response.data,
      });
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchUserStatusTransactionReport: false,
      })
    }
  },
  fetFilters: (filters) => {
    set({filters: filters})
  }
}))