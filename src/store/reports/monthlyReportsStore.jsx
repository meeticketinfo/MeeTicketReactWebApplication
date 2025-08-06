import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const UsemonthlyReportsStore = create((set) => ({
  // OVER ALL REPORT
  DepartmentAbstractReport: [],
  isFetchDepartmentAbstractReportLoading: false,


  //  -----------------API CALLS------------------------------------------------------
  // Fetch all consoliodate
  fetchDepartmentAbstractReport: async (Payload) => {
    set({ isFetchDepartmentAbstractReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_DEPARTMENT_ABSTRACT_REPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
      set({
        DepartmentAbstractReport: response.data,
        isFetchDepartmentAbstractReportLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchDepartmentAbstractReportLoading: false });
    }
  },

}));
