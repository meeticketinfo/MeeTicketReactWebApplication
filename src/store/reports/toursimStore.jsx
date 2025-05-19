import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const ToursimReportStore = create((set) => ({
  // OVER ALL REPORT
  ConsolidateReports: [],
  isFetchConsolidateReportsLoading: false,

  // individual
  IndividualReports: [],
  isFetchIndividualReportsLoading: false,

  // Payment transaction
  PaymentTransactionReports: [],
  isFetchPaymentTransactionReportsLoading: false,

  // Payment transaction
  BankPaymentReports: [],
  isFetchBankPaymentReportsLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Fetch all consoliodate
  fetchConsolidateReports: async ({ fromDate, toDate }) => {
    set({ isFetchConsolidateReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.TOURISM_REPORTS.GET_TOURISM_CONSOLIDATE_REPORT}?FromDate=${fromDate}&ToDate=${toDate}`
      );
      set({
        ConsolidateReports: response.data,
        isFetchConsolidateReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchConsolidateReportsLoading: false });
    }
  },

  // all individual

  fetchIndividualReports: async ({ fromDate, toDate }) => {
    set({ isFetchIndividualReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.TOURISM_REPORTS.GET_TOURISM_INDIVIDUAL_REPORT}?FromDate=${fromDate}&ToDate=${toDate}`
      );
      set({
        IndividualReports: response.data,
        isFetchIndividualReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchIndividualReportsLoading: false });
    }
  },

  // payment transaction
  fetchPaymentTransactionReports: async ({ fromDate, toDate }) => {
    set({ isFetchPaymentTransactionReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.TOURISM_REPORTS.GET_TOURISM_PAYMENT_TRANSACTION_REPORT}?StartDate=${fromDate}&EndDate=${toDate}`
      );
      set({
        PaymentTransactionReports: response.data,
        isFetchPaymentTransactionReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchPaymentTransactionReportsLoading: false,
      });
    }
  },

  // bank Payment
  fetchBankPaymentReports: async ({ fromDate, toDate }) => {
    set({ isFetchBankPaymentReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.TOURISM_REPORTS.GET_TOURISM_BANK_PAYMENT_REPORT}?FromDate=${fromDate}&ToDate=${toDate}`
      );
      set({
        BankPaymentReports: response.data,
        isFetchBankPaymentReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchBankPaymentReportsLoading: false });
    }
  },
}));
