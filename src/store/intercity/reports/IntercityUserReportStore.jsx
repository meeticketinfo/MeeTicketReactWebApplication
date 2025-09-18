import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useIntercityUserStore = create((set) => ({
  allIntercityUserReports: [],
  isIntercityUserReportsLoading: false,

  isIntercityUserDetailedReportsLoading:false,
  allIntercityUserDetailedReports:[],
  
  IntercityTransactionTrackingStatusByOrderIdData: [],
  isFetchIntercityTransactionTrackingStatusByOrderId: false,

  fetchIntercityUserReports: async (payload) => {
    set({ isIntercityUserReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.INTERCITY.REPORTS.GET_USER_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&MobileNumber=${payload.MobileNumber}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allIntercityUserReports: response.data,
        isIntercityUserReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isIntercityUserReportsLoading: false,
      });
    }
  },
  fetchIntercityUserDetailedReports: async (payload) => {
    set({ isIntercityUserDetailedReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.INTERCITY.REPORTS.GET_USER_DETAILED_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&MobileNumber=${payload.MobileNumber}&paymentMode=${payload.paymentMode}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allIntercityUserDetailedReports: response.data,
        isIntercityUserDetailedReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isIntercityUserDetailedReportsLoading: false,
      });
    }
  },

  fetchIntercityTransactionTrackingStatusByOrderId: async (orderID = "") => {
    set({ isFetchIntercityTransactionTrackingStatusByOrderId: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.INTERCITY.REPORTS.GET_USER_REPORT_TRACK_ORDER}?orderId=RTCIntercity_ODR_20250913181756956JzlAvLw6`
      );
      set({
        IntercityTransactionTrackingStatusByOrderIdData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        IntercityTransactionTrackingStatusByOrderIdData: response.data,
      });
    } finally {
      set({
        isFetchIntercityTransactionTrackingStatusByOrderId: false,
      });
    }
  },
}));
