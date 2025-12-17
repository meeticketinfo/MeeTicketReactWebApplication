import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const useWalkerpassStore = create((set) => ({
  walkerPassDashboard: [],
  isFetchWalkerpassDashboardLoading: false,
  error: null,

  // Fetch buspass dashboard
  fetchWalkerpassDashboard: async ({fromDate, toDate}) => {
    set({ isFetchWalkerpassDashboardLoading: true });
    try {
    const response = await apiService.get(`${API_ENDPOINTS.DASHBOARD.GET_WALKER_PASS_DASHBOARD}?fromDate=${fromDate}&toDate=${toDate}`);
    set({ walkerPassDashboard: response.data });
    set({ isFetchWalkerpassDashboardLoading: false });
  } catch (error) {
    set({ error: error.message, isFetchWalkerpassDashboardLoading: false });
  }
  },
}));    