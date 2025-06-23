import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const RefundReportStore = create((set) => ({
  isRefundsReportLoading: false,
  RefundsReports: [],

  fetchRefundsReport: async (RefundPayload) => {
    set({ isRefundsReportLoading: true });
    const ParamsUrl = `?StartDate=${RefundPayload.fromDate}&EndDate=${RefundPayload.toDate}&MobileNumber=${RefundPayload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.REFUND_REPORTS.GET_REFUND_REPORTS}${ParamsUrl}`
      );
      set({
        RefundsReports: response.data,
        isRefundsReportLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isRefundsReportLoading: false,
      });
    }
  },
}));
