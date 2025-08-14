import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useAmrabadUserStore = create((set) => ({
  allAmrabadUserReports: [],
  isAmrabadUserReportsLoading: false,

  isAmrabadUserDetailedReportsLoading:false,
  allAmrabadUserDetailedReports:[],


  fetchAmrabadUserReports: async (payload) => {
    set({ isAmrabadUserReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_USER_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allAmrabadUserReports: response.data,
        isAmrabadUserReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isAmrabadUserReportsLoading: false,
      });
    }
  },
  fetchAmrabadUserDetailedReports: async (payload) => {
    set({ isAmrabadUserDetailedReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_USER_DETAILED_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allAmrabadUserDetailedReports: response.data,
        isAmrabadUserDetailedReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isAmrabadUserDetailedReportsLoading: false,
      });
    }
  },
}));
