import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const GriveanceReportStore = create((set) => ({
  // OVER ALL REPORT
  OverAllReports: [],
  isFetchOverAllReportsLoading: false,

  //   send comment
  CommentDetails: null,
  isSaveCommentLoading: false,
  //   status
  isStatusLoading: false,
  StatusDetails: null,

  //   consolidate
  ConsolidateReports: [],
  isFetchOverConsolidateLoading: false,

  // Indivudual

  IndividualReports: [],
  isFetchOverIndividualLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Fetch all OverAll
  fetchOverAllReports: async ({ fromDate, toDate }) => {
    set({ isFetchOverAllReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.GRIVEANCE_REPORTS.GET_OVERALL_REPORT}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        OverAllReports: response.data,
        isFetchOverAllReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchOverAllReportsLoading: false });
    }
  },

  // Fetch all
  fetchIndividualReports: async ({ fromDate, toDate }) => {
    set({ isFetchOverIndividualLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.GRIVEANCE_REPORTS.GET_INDIVIDUAL_REPORT}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        IndividualReports: response.data.data,
        isFetchOverIndividualLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchOverIndividualLoading: false });
    }
  },

  //   Consolidate

  fetchConsolidateReports: async ({ fromDate, toDate }) => {
    set({ isFetchOverConsolidateLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.GRIVEANCE_REPORTS.GET_CONSOLIDATE_REPORT}?startDate=${fromDate}&endDate=${toDate}`
      );
      set({
        ConsolidateReports: response.data,
        isFetchOverConsolidateLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchOverConsolidateLoading: false });
    }
  },

  // saveCommentDetails
  saveCommentDetails: async (payload, isUpdate = false) => {
    set({ isSaveCommentLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.GRIVEANCE_REPORTS.POST_COMMENT;

      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, payload);

      set({
        CommentDetails: response.data,
        isSaveCommentLoading: false,
        success: "comment saved successfully.",
      });

      return { success: true, data: response };
    } catch (error) {
      set({ isSaveCommentLoading: false });
      throw error;
    }
  },

  UpdateStatus: async (payload, isUpdate = true) => {
    set({ isStatusLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.GRIVEANCE_REPORTS.UpdateStatus;

      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, payload);

      set({
        StatusDetails: response.data,
        isStatusLoading: false,
        success: "comment saved successfully.",
      });

      return { success: true, data: response.data };
    } catch (error) {
      set({ isStatusLoading: false });
      throw error;
    }
  },
}));
