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

  // Get Payment Transaction Pie Chart Data
  PaymentTransactionPieChartData: null,
  isPaymentTransactionPieChartLoading: false,

  // Get SuccessButNotConfirmedPieChart
  SuccessButNotConfirmedPieChartData: null,
  isSuccessButNotConfirmedPieChartLoading: false,

  // Get Payment Transaction Summary Pie Chart Data
  PaymentTransactionSummaryPieChartData: null,
  isPaymentTransactionSummaryPieChartLoading: false,

  // Get Payment Failed Transaction Summary Pie Chart Data
  PaymentFailedTransactionSummaryPieChartData: null,
  isPaymentFailedTransactionSummaryPieChartLoading: false,

  // Get Ticket Not Generated Transaction Summary Pie Chart Data
  TicketNotGeneratedTransactionSummaryPieChartData: null,
  isTicketNotGeneratedTransactionSummaryPieChartLoading: false,

  totalTransactionSearchParams: {},
  
  setTotalTransactionSearchParams: (params) => set({ totalTransactionSearchParams: params }),
  clearTotalTransactionSearchParams: () => set({ totalTransactionSearchParams: {} }),

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason

  fetchFailedTransactionByReason: async (payload) => {
    set({ isFailedTransactionByReasonLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
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
    set({ isFailedTransactionByLocationLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
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
    set({ isFailedTransactionByLocationCategoryLoading: true });
   const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
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
    set({ isFailedTransactionByReasonLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
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
    set({ isFailedTransactionByGraphLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
   
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

  //Get Payment Transaction PieChart Data
  fetchPaymentTransactionPieChartData: async (payload) => {
    set({ isPaymentTransactionPieChartLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_ALL_PAYMENT_TRANSACTION_PIE_CHART}${param}`
      );

      set({
        PaymentTransactionPieChartData: response.data,
        isPaymentTransactionPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isPaymentTransactionPieChartLoading: false });
    }
  },

  //GetSuccessButNotConfirmedPieChart
  fetchSuccessButNotConfirmedPieChartData: async (payload) => {
    set({ isSuccessButNotConfirmedPieChartLoading: true });
    const param = `?fromDate=${payload.fromDate}&toDate=${payload.toDate}&locationId=${payload.locationId}&categoryId=${payload.categoryId}&departmentId=${payload.departmentId}&phoneNumber=${payload.phoneNumber}`;
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_SUCCESS_BUT_NOT_CONFIRMED_PIE_CHART}${param}`
      );

      set({
        SuccessButNotConfirmedPieChartData: response.data,
        isSuccessButNotConfirmedPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isSuccessButNotConfirmedPieChartLoading: false });
    }
  },

  //GetPaymentTransactionSummaryPieChart
  fetchPaymentTransactionSummaryPieChartData: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isPaymentTransactionSummaryPieChartLoading: true });
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_PAYMENT_TRANSACTION_SUMMARY_PIE_CHART}?${queryString}`
      );

      set({
        PaymentTransactionSummaryPieChartData: response.data,
        isPaymentTransactionSummaryPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isPaymentTransactionSummaryPieChartLoading: false });
    }
  },

  fetchPaymentFailedTransactionSummaryPieChartData: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isPaymentFailedTransactionSummaryPieChartLoading: true });
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_PAYMENT_FAILED_TRANSACTION_SUMMARY_PIE_CHART}?${queryString}`
      );

      set({
        PaymentFailedTransactionSummaryPieChartData: response.data,
        isPaymentFailedTransactionSummaryPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isPaymentFailedTransactionSummaryPieChartLoading: false });
    }
  },

  fetchTicketNotGeneratedTransactionSummaryPieChartData: async (queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    set({ isTicketNotGeneratedTransactionSummaryPieChartLoading: true });
   
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_TICKET_NOT_GENERATED_TRANSACTION_SUMMARY_PIE_CHART}?${queryString}`
      );

      set({
        TicketNotGeneratedTransactionSummaryPieChartData: response.data,
        isTicketNotGeneratedTransactionSummaryPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isTicketNotGeneratedTransactionSummaryPieChartLoading: false });
    }
  },
}));
