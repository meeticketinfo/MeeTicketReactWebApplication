import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useBuspassUserStore = create((set) => ({
  allBusPassUserReports: [],
  isBusPassUserReportsLoading: false,

  isBusPassUserDetailedReportsLoading:false,
  allBusPassUserDetailedReports:[],


  fetchBusPassUserReports: async (payload) => {
    set({ isBusPassUserReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.USER_REPORT.GET_BUSSPASS_USER_OUTER_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNo=${payload.mobileNo}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allBusPassUserReports: response.data,
        isBusPassUserReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isBusPassUserReportsLoading: false,
      });
    }
  },
  fetchBusPassUserDetailedReports: async (payload) => {
    set({ isBusPassUserDetailedReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.USER_REPORT.GET_BUSSPASS_USER_INNER_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNo=${payload.mobileNo}&paymentMode=${payload.paymentMode}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allBusPassUserDetailedReports: response.data,
        isBusPassUserDetailedReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isBusPassUserDetailedReportsLoading: false,
      });
    }
  },
}));
