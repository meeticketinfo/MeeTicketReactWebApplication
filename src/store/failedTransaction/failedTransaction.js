  import { create } from "zustand";
  import { API_ENDPOINTS } from "../../constants/apiEndpoints";
  import apiService from "../../services/apiService";

  export const userFailureTransaction = create((set) => ({
    failureUserTransactionReport: [],
    isFetchFailureUserTransactionReport: false,
    TransactionTrackingStatusByOrderIdData: [],
    isFetchTransactionTrackingStatusByOrderId: false,
    isTotalTransactionPage: false,
    paymentTransactionDetailsByStatusResult: [],
    isFetchPaymentTransactionDetailsByStatusResult: false,
    resetPayloads: {
      locationId: "",
      status: "",
      departmentId: "",
      categoryId: "",
      resultMsg: "",
      category: "",    
    },
    filters: {},
    
    setIsTotalTransactionPage: (isTotalTransactionPage) => {
      set({isTotalTransactionPage: isTotalTransactionPage})
    },

    fetchFailureUserTransactionReport: async (queryParams) => {
      const queryString = new URLSearchParams(queryParams).toString();
      set({ isFetchFailureUserTransactionReport: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.REPORTS.FAILED_TRANSACTIONS.GET_FAILURE_INNER_REPORTS}?${queryString}`
        );
        set({
          failureUserTransactionReport: response.data,
        });
        return {response: response.data}
      } catch (error) {
        set({
          error: error.message,
        });
      } finally {
        set({
          isFetchFailureUserTransactionReport: false,
        })
      }
    },

    fetchPaymentTransactionDetailsByStatusResult: async (queryParams) => {
      console.log(queryParams);
      const queryString = new URLSearchParams(queryParams).toString();
      set({ isFetchPaymentTransactionDetailsByStatusResult: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.REPORTS.USER_TRANSACTIONS.GET_PAYMENT_TRANSACTION_DETAILS_BY_STATUS_RESULT}?${queryString}`
        );
        set({
          paymentTransactionDetailsByStatusResult: response.data,
        });
        return {response: response.data}
      } catch (error) {
        set({
          error: error.message,
        });
      } finally {
        set({
          isFetchPaymentTransactionDetailsByStatusResult: false,
        })
      }
    },

    fetchTransactionTrackingStatusByOrderId: async (orderID) => {
      set({ isFetchTransactionTrackingStatusByOrderId: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_TRANSACTION_TRACKING_STATUS}?orderId=${orderID}`
        );
        set({
          TransactionTrackingStatusByOrderIdData: response.data,
        });
        return {response: response.data}
      } catch (error) {
        set({
          error: error.message,
        });
      } finally {
        set({
          isFetchTransactionTrackingStatusByOrderId: false,
        })
      }
    },
    fetFilters: (filters) => {
      set({filters: filters})
    }
  }))