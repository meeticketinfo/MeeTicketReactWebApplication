import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const userDashboardStore = create((set) => ({
  UserDashboardTransactionData: [],
  isUserDashboardTransactionLoading: false,
  UserDetailedTransactionReportData: [],
  isUserDetailedTransactionReportLoading: false,
  filters: {},
  isUserViewTransactions: false,
  setisUserViewTransactions: (isUserViewTransactions) => {
    set({ isUserViewTransactions });
  },
  fetchUserDashboardTransactionData: async (payload) => {
    set({ isUserDashboardTransactionLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_TRANSATION_REPORTS.GET_USER_TRANSACTIONS_REPORTS}${param}`
      );
      set({
        UserDashboardTransactionData: response.data,
        isUserDashboardTransactionLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isUserDashboardTransactionLoading: false });
    }
  },
   fetchUserDetailedTransactionReport: async (payload) => {
    set({ isUserDetailedTransactionReportLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&parkId=${payload.parkId}&departmentId=${payload.departmentId}&entityTypeId=${payload.entityTypeId}&mobileNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.USER_TRANSATION_REPORTS.GET_USER_DETAILED_TRANSACTIONS_REPORTS}${param}`
      );
      console.log("response",response.data)
      set({
        UserDetailedTransactionReportData: response.data,
        isUserDetailedTransactionReportLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isUserDetailedTransactionReportLoading: false });
    }
  },

  fetFilters: (filters) => {
    set({ filters: filters });
  },
}));
