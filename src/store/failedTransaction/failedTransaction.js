import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const userFailureTransaction = create((set) => ({
  failureUserTransactionReport: [],
  isFetchFailureUserTransactionReport: false,
  filters: {},
  
  fetchFailureUserTransactionReport: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isFetchFailureUserTransactionReport: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.FAILED_TRANSACTIONS.GET_FAILURE_INNER_REPORTS}?${queryString}`
      );
      set({
        failureUserTransactionReport: response.data,
      });
      return {response: response.data}
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({
        isFetchFailureUserTransactionReport: false,
      })
    }
  },
  fetFilters: (filters) => {
    set({filters: filters})
  }
}))