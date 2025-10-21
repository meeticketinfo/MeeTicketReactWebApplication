import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

export const useBuspassDashboardStore = create((set) => ({
  buspassDashboard: [],
  isFetchBuspassDashboardLoading: false,
  error: null,

  // Fetch buspass dashboard
  fetchBuspassDashboard: async ({fromDate, toDate}) => {
    set({ isFetchBuspassDashboardLoading: true });
    try {
    const response = await apiService.get(`${API_ENDPOINTS.RTC_DASHBOARD.GET_BUSPASS_DASHBOARD}?fromDate=${fromDate}&toDate=${toDate}`);
    set({ buspassDashboard: response.data });
    set({ isFetchBuspassDashboardLoading: false });
  } catch (error) {
    set({ error: error.message, isFetchBuspassDashboardLoading: false });
  }
  },
}));    
