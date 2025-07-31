import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useAmrabadConsolidatedStore = create((set) => ({
  allAmrabadConsolidatedReports: [],
  isAmrabadConsolidatedReportsLoading: false,

  isAmrabadIndividualReportsLoading: false,
  allAmrabadIndividualReports: [],

  allAmrabadTransactionPaymentReports: [],
  isAmrabadCompleteBookings: false,
  
  isFetchAmrabadDashboardLoading: false,
  isAmrabadTransactionPaymentReportsLoading: false,

  isFetchCurrentBookingDetailsLoading: false,

  setisAmrabadCompleteBookings: (isAmrabadCompleteBookings) => {
    set({ isAmrabadCompleteBookings });
  },
  fetchAmrabadConsolidatedReports: async (payload) => {
    console.log("payload", payload);
    set({ isAmrabadConsolidatedReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_CONSOLIDATED_BOOKING_REPORT}?fromDate=${payload.startDate}&toDate=${payload.endDate}&bookingType=${payload.bookingSource}&mobileNumber=${payload.mobileNumber}&paymentMode=${payload.PaymentMode}&pageNumber=${payload.PageIndex}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allAmrabadConsolidatedReports: response.data,
        isAmrabadConsolidatedReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isAmrabadConsolidatedReportsLoading: false,
      });
    }
  },
  fetchAmrabadIndividualReports: async (payload) => {
    set({ isAmrabadIndividualReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_INDIVIDUAL_BOOKING_REPORT}?fromDate=${payload.startDate}&toDate=${payload.endDate}&pageNumber=${payload.PageIndex}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allAmrabadIndividualReports: response.data,
        isAmrabadIndividualReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isAmrabadIndividualReportsLoading: false,
      });
    }
  },
  fetchAmrabadPaymentTransactions: async (payload) => {
    console.log("payload", payload);
    set({ isAmrabadTransactionPaymentReportsLoading: true });
    try {
      const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_PAYMENT_TRANSACTION_REPORT}?fromDate=${payload.startDate}&toDate=${payload.endDate}&paymentStatus=${payload.paymentStatus}&paymentMode=${payload.paymentMode}&mobileNumber=${payload.phoneNumber}&pageNumber=${payload.PageIndex}&pageSize=${payload.pageSize}`;
      const method = "get";
      const response = await apiService[method](url);
      set({
        allAmrabadTransactionPaymentReports: response.data,
        isAmrabadTransactionPaymentReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isAmrabadConsolidatedReportsLoading: false,
      });
    }
  },
  fetchAmrabadCurrentBookingDetailsByBookingId: async (bookingId) => {
    set({ isFetchAmrabadCurrentBookingDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.REPORTS.GET_QR_BOOKING_DETAILS}/${bookingId}`
      );
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchAmrabadCurrentBookingDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isFetchAmrabadCurrentBookingDetailsLoading: false });
      return { success: false };
    }
  },
  fetchAmrabadDashboard: async () => {
    set({ isFetchAmrabadDashboardLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.DASHBOARD.GET_AMRABAD_DASHBOARD}`
      );
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchAmrabadDashboardLoading: false,
      });
    } catch (error) {
      set({ isFetchAmrabadDashboardLoading: false });
      return { success: false };
    }
  },
}));
