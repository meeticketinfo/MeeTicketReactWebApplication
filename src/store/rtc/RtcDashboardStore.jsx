import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const useRtcDashboardStore = create((set) => ({
  // overall PASS
  allPassData: null,
  isFetchAllPassDataLoading: false,

  // All pass types
  allPassTypeData: null,
  isFetchAllPassTypeDataLoading: false,

  // dashboard report
  allDashboardReportData: null,
  isFetchDashboardReportDataLoading: false,
  // busses passes
  allbuspassData: null,
  isFetchbuspassDataLoading: false,
  //  -----------------API CALLS------------------------------------------------------
  // Fetch all pass data
  fetchallPassData: async ({ fromDate, toDate, active }) => {
    const date = active ? `?startDate=${fromDate}&endDate=${toDate}` : "";
    set({ isFetchAllPassDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.RTC_DASHBOARD.GET_OVER_ALL}${date}`
      );

      set({
        allPassData: response.data[0],
        isFetchAllPassDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllPassDataLoading: false });
    }
  },

  // Fetch all pass type data
  fetchallPassTypeData: async ({ fromDate, toDate,  active }) => {
    const date = active ? `?startDate=${fromDate}&endDate=${toDate}` : "";
    set({ isFetchAllPassTypeDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.RTC_DASHBOARD.GET_ALL_PASS_TYPE}${date}`
      );

      set({
        allPassTypeData: response.data,
        isFetchAllPassTypeDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllPassTypeDataLoading: false });
    }
  },

  fetchallDashboardReportData: async ({ fromDate, toDate,passTypeId, active }) => {
    console.log("passTypeId", passTypeId);
    const date = active
      ? `?startDate=${fromDate}&endDate=${toDate}&passTypeId=${passTypeId}`
      : `?startDate=${fromDate}&endDate=${toDate}`;
    set({ isFetchDashboardReportDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.RTC_DASHBOARD.GET_ALL_DASHBOARD_REPORT}${date}`
      );

      set({
        allDashboardReportData: response.data,
        isFetchDashboardReportDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchDashboardReportDataLoading: false });
    }
  },

  fetchallbuspasses: async () => {
    set({ isFetchbuspassDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.RTC_DASHBOARD.GET_ALL_BUSPASSES}`
      );

      set({
        allbuspassData: response.data,
        isFetchbuspassDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchbuspassDataLoading: false });
    }
  },
}));
