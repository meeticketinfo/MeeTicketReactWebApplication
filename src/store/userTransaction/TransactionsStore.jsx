import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const useTransactionsStore = create((set) => ({
  // Failed Reason
  FailedTransactionByReasonData: null,
  isFailedTransactionByReasonLoading: false,

  // Failed by Location
  FailedTransactionByLocationData: null,
  isFailedTransactionByLocationLoading: false,

  // Failed by Location Category
  FailedTransactionByLocationCategoryData: null,
  isFailedTransactionByLocationCategoryLoading: false,

  // Failed by Department
  FailedTransactionByDepartmentData: null,
  isFailedTransactionByDepartmentLoading: false,

  // Failed by Graph
  FailedTransactionByGraphData: null,
  isFailedTransactionByGraphLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason

  fetchFailedTransactionByReason: async (payload) => {
    console.log("test");
    set({ isFailedTransactionByReasonLoading: true });
    const param = `?durationType=${payload.durationType}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        FailedTransactionByReasonData: response.data,
        isFailedTransactionByReasonLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFailedTransactionByReasonLoading: false });
    }
  },
  //
  fetchFailedTransactionByLocation: async (payload) => {
    console.log("test");
    set({ isFailedTransactionByLocationLoading: true });
    const param = `?durationType=${payload.durationType}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_BY_LOCATION}${param}`
      );

      set({
        FailedTransactionByLocationData: response.data,
        isFailedTransactionByLocationLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFailedTransactionByLocationLoading: false,
      });
    }
  },
  //
  fetchFailedTransactionByLocationCategory: async (payload) => {
    console.log("test");
    set({ isFailedTransactionByLocationCategoryLoading: true });
   const param = `?durationType=${payload.durationType}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_BY_LOCATION_CATEGORY}${param}`
      );

      set({
        FailedTransactionByLocationCategoryData: response.data,
        isFailedTransactionByLocationCategoryLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFailedTransactionByLocationCategoryLoading: false,
      });
    }
  },
  //
  fetchFailedTransactionBydepartment: async (payload) => {
    console.log("test");
    set({ isFailedTransactionByReasonLoading: true });
    const param = `?durationType=${payload.durationType}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_BY_DEPARTMENT}${param}`
      );

      set({
        FailedTransactionByDepartmentData: response.data,
        isFailedTransactionByDepartmentLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFailedTransactionByReasonLoading: false });
    }
  },
  //
  fetchFailedTransactionTrendGraph: async (payload) => {
    console.log("test");
    set({ isFailedTransactionByGraphLoading: true });
    const param = `?durationType=${payload.durationType}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}`;
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_TREND_GRAPH}${param}`
      );

      set({
        FailedTransactionByGraphData: response.data,
        isFailedTransactionByGraphLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFailedTransactionByGraphLoading: false });
    }
  },
}));
