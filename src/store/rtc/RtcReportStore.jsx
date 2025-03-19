import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useRtcReportStore = create((set) => ({
  // DAY PASS
  allDayPassReports: [],
  isFetchAllallDayPassReportsLoading: false,

  // ordinary PASS
  allOrdinaryPassReports: [],
  isFetchAllallOrdinaryPassReportsLoading: false,

  // MTS PASS
  allMtsPassReports: [],
  isFetchAllallMtsPassReportsLoading: false,

  // EXPRESS PASS
  allExpressPassReports: [],
  isFetchAllallExpressPassReportsLoading: false,

  // STUDENT PASS
  allStudentPassReports: [],
  isFetchAllallStudentPassReportsLoading: false,

  // pending Student Passes
  allPendingPassReports: [],
  isFetchAllallPendingPassReportsLoading: false,

  //   status
  isStatusLoading: false,
  StatusDetails: null,

  //  -----------------API CALLS------------------------------------------------------
  // Fetch all daypass
  fetchAllDayPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallDayPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_DAY_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        allDayPassReports: response.data,
        isFetchAllallDayPassReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllallDayPassReportsLoading: false });
    }
  },
  // Fetch all Ordinary pass
  fetchAllOrdinaryPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallOrdinaryPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_ORDINARY_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );

      set({
        allOrdinaryPassReports: response.data,
        isFetchAllallOrdinaryPassReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllallOrdinaryPassReportsLoading: false,
      });
    }
  },
  // MTS
  fetchAllMtsPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallMtsPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_MTS_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        allMtsPassReports: response.data,
        isFetchAllallMtsPassReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllallMtsPassReportsLoading: false });
    }
  },

  // EXPRESS PASS
  fetchAllExpressPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallExpressPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_EXPRESS_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        allExpressPassReports: response.data,
        isFetchAllallExpressPassReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllallExpressPassReportsLoading: false,
      });
    }
  },

  // STUDENT PASS
  fetchAllStudentPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallStudentPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_STUDENT_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );

      set({
        allStudentPassReports: response.data,
        isFetchAllallStudentPassReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllallStudentPassReportsLoading: false,
      });
    }
  },

  // pending passes
  fetchAllPendingPassReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllallPendingPassReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.GET_PENDING_PASS}?startDate=${fromDate}&endDate=${toDate}`
      );

      set({
        allPendingPassReports: response.data,
        isFetchAllallPendingPassReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllallPendingPassReportsLoading: false,
      });
    }
  },

  UpdateStatus: async (payload, isUpdate = true) => {
    set({ isStatusLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.RTC_REPORTS.UPDATE_PASS_STATUS;

      const response = await apiService.uploadFileWithPut(
        url,
        payload.file,
        payload
      );

      set({
        StatusDetails: response.data,
        isStatusLoading: false,
        success: "comment saved successfully.",
      });

      return { success: true, data: response };
    } catch (error) {
      set({ isStatusLoading: false });
      throw error;
    }
  },
}));
