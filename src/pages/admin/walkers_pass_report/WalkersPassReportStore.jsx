import { create } from "zustand";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
export const useWalkersPassReportStore = create((set) => ({
  //  -----------------API CALLS-----------------------

  // Walkers Pass Report
  WalkersPassReportData: [],
  isFetchWalkersPassReportData: false,
  fetchWalkersPassReportData: async (payload) => {
    set({ isFetchWalkersPassReportData: true });
    try {
      const params = `fromDate=${payload.fromDate}&toDate=${payload.toDate}&passTypeId=${payload.passTypeId}&subFacilityId=${payload.subFacilityId}&pageNumber=${payload.pageNumber}&pageSize=${payload.PageSize}`;
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.WALKERS_PASS_REPORT.GET_WALKERS_PASS_REPORT}?${params}`
      );
      set({
        WalkersPassReportData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        WalkersPassReportData: [],
      });
    } finally {
      set({
        isFetchWalkersPassReportData: false,
      });
    }
  },
}));
