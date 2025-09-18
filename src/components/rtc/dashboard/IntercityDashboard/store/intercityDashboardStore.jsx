import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { handleApiError } from "../../../../../utils/apiErrorHandler";


export const useIntercityDashboardStore = create((set) => ({
  intercityDashboard: [],
  isFetchIntercityDashboardLoading: false,
  error: null,

  // Fetch buspass dashboard
  fetchIntercityDashboard: async ({fromDate, toDate, typeOfBooking}) => {
    set({ isFetchIntercityDashboardLoading: true });
    try {
    const response = await apiService.get(`${API_ENDPOINTS.RTC_DASHBOARD.GET_INTERCITY_DASHBOARD}?fromDate=${fromDate}&toDate=${toDate}&purchaseOrBooking=${typeOfBooking}`);
    set({ intercityDashboard: response.data });
    set({ isFetchIntercityDashboardLoading: false });
  } catch (error) {
    handleApiError(error);
    set({ error: error.message, isFetchIntercityDashboardLoading: false });
  }
  },
}));    

