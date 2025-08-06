import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const UsemonthlyReportsStore = create((set) => ({
  // OVER ALL REPORT
  DepartmentAbstractReport: [],
  isFetchDepartmentAbstractReportLoading: false,
  //  Location Category Abstract Report
  LocationCategoryAbstractReport: [],
  isFetchLocationCategoryAbstractReportLoading: false,
  //  Department Wise Report
  DepartmentWiseReport: [],
  isFetchDepartmentWiseReportLoading: false,
  //  Location Category Wise Report
  LocationCategoryWiseReport: [],
  isFetchLocationCategoryWiseReportLoading: false,
  //  Location Wise Report
  LocationWiseReport: [],
  isFetchLocationWiseReportLoading: false,
  //  -----------------API CALLS------------------------------------------------------
  // Fetch all consoliodate
  fetchDepartmentAbstractReport: async (Payload) => {
    set({ isFetchDepartmentAbstractReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_DEPARTMENT_ABSTRACT_REPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
      set({
        DepartmentAbstractReport: response.data.data,
        isFetchDepartmentAbstractReportLoading: false,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      set({
        error: error.message,
        isFetchDepartmentAbstractReportLoading: false,
      });
    }
  },
  //  Location Category Abstract Report
  fetchLocationCategoryAbstractReport: async (Payload) => {
    set({ isFetchLocationCategoryAbstractReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_LOCATION_CATEGORY_ABSTRACTREPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
      set({
        LocationCategoryAbstractReport: response.data.data,
        isFetchLocationCategoryAbstractReportLoading: false,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({
        error: error.message,
        isFetchLocationCategoryAbstractReportLoading: false,
      });
    }
  },
  //  Department Wise Report
  fetchDepartmentWiseReport: async (Payload) => {
    set({ isFetchDepartmentWiseReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_DEPARTMENT_WISE_REPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
      set({
        DepartmentWiseReport: response.data.data,
        isFetchDepartmentWiseReportLoading: false,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ error: error.message, isFetchDepartmentWiseReportLoading: false });
    }
  },
  //  Location Category Wise Report
  fetchLocationCategoryWiseReport: async (Payload) => {
    set({ isFetchLocationCategoryWiseReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_LOCATION_CATEGORY_WISE_REPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
      set({
        LocationCategoryWiseReport: response.data.data,
        isFetchLocationCategoryWiseReportLoading: false,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({
        error: error.message,
        isFetchLocationCategoryWiseReportLoading: false,
      });
    }
  },
  //  Location Wise Report
  fetchLocationWiseReport: async (Payload) => {
    set({ isFetchLocationWiseReportLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.MONTHLY_REPORTS.GET_LOCATION_WISE_REPORT}?fromDate=${Payload.fromDate}&toDate=${Payload.toDate}`
      );
    set({
      LocationWiseReport: response.data.data,
      isFetchLocationWiseReportLoading: false,
    });
  } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    set({ error: error.message, isFetchLocationWiseReportLoading: false });
  }
  },
}));
