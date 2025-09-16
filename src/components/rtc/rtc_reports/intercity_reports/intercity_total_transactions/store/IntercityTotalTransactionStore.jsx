import { create } from "zustand";
import { toast } from "react-toastify";
import apiService from "../../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../../constants/apiEndpoints";

export const useIntercityTotalTransactionStore = create((set) => ({
  intercityTotalTransactions: [],
  isIntercityTotalTransactionsLoading: false,

  paymentsuccessButTicketNotGenerated: [],
  isPaymentsuccessButTicketNotGeneratedLoading: false,

  totalTransactionsReport: [],
  isTotalTransactionsReportLoading: false,

  paymentFailedGateway: [],
  isPaymentFailedGatewayLoading: false,

  paymentFailedOtherReasons: [],
  isPaymentFailedOtherReasonsLoading: false,

  fetchTotalTransactionsReport: async (payload) => {
    set({ isTotalTransactionsReportLoading: true });
    try {
      // Sanitize payload to ensure no undefined values are sent
      const sanitizedPayload = {
        startDate: payload.startDate || "",
        endDate: payload.endDate || "",
        phoneNumber: payload.phoneNumber || "",
        departureLocation: payload.departureLocation || "",
        arrivalLocation: payload.arrivalLocation || "",
        busType: payload.busType || "",
        status: payload.status || "",
        subCategory: payload.subCategory || "",
        pageNumber: payload.pageNumber || 1,
        pageSize: payload.pageSize || 10,
      };

      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_TOTAL_TRANSACTIONS_REPORT}?startDate=${sanitizedPayload.startDate}&endDate=${sanitizedPayload.endDate}&status=${sanitizedPayload.status}&subCategory=${sanitizedPayload.subCategory}&phoneNumber=${sanitizedPayload.phoneNumber}&departureLocation=${sanitizedPayload.departureLocation}&arrivalLocation=${sanitizedPayload.arrivalLocation}&busType=${sanitizedPayload.busType}&pageNumber=${sanitizedPayload.pageNumber}&pageSize=${sanitizedPayload.pageSize}`
      );
      set({
        totalTransactionsReport: response.data,
        isTotalTransactionsReportLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        totalTransactionsReport: [],
        isTotalTransactionsReportLoading: false,
      });
      toast.error(error.message);
    }
  },

  fetchIntercityTotalTransactions: async (payload) => {
    set({ isIntercityTotalTransactionsLoading: true });
    try {
      // Sanitize payload to ensure no undefined values are sent
      const sanitizedPayload = {
        startDate: payload.fromDate || "",
        endDate: payload.toDate || "",
        phoneNumber: payload.mobileNumber || "",
        departureLocation: payload.departureLocation || "",
        arrivalLocation: payload.arrivalLocation || "",
        busType: payload.busType || "",
        pageNumber: payload.pageNumber || 1,
        pageSize: payload.pageSize || 10,
      };

      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_TOTAL_TRANSACTIONS}?startDate=${sanitizedPayload.startDate}&endDate=${sanitizedPayload.endDate}&phoneNumber=${sanitizedPayload.phoneNumber}&departureLocation=${sanitizedPayload.departureLocation}&arrivalLocation=${sanitizedPayload.arrivalLocation}&busType=${sanitizedPayload.busType}&pageNumber=${sanitizedPayload.pageNumber}&pageSize=${sanitizedPayload.pageSize}`
      );
      console.log("response", response);
      set({
        intercityTotalTransactions: response.data,
        isIntercityTotalTransactionsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        intercityTotalTransactions: [],
        isIntercityTotalTransactionsLoading: false,
      });
      toast.error(error.message);
    }
  },

  fetchPaymentsuccessButTicketNotGenerated: async (payload) => {
    set({ isPaymentsuccessButTicketNotGeneratedLoading: true });
    try {
      // Sanitize payload to ensure no undefined values are sent
      const sanitizedPayload = {
        startDate: payload.fromDate || "",
        endDate: payload.toDate || "",
        phoneNumber: payload.mobileNumber || "",
        departureLocation: payload.departureLocation || "",
        arrivalLocation: payload.arrivalLocation || "",
        busType: payload.busType || "",
        pageNumber: payload.pageNumber || 1,
        pageSize: payload.pageSize || 10,
      };

      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_PAYMENTS_SUCCESS_BUT_TICKET_NOT_GENERATED}?startDate=${sanitizedPayload.startDate}&endDate=${sanitizedPayload.endDate}&phoneNumber=${sanitizedPayload.phoneNumber}&departureLocation=${sanitizedPayload.departureLocation}&arrivalLocation=${sanitizedPayload.arrivalLocation}&busType=${sanitizedPayload.busType}&pageNumber=${sanitizedPayload.pageNumber}&pageSize=${sanitizedPayload.pageSize}`
      );
      console.log("response", response);
      set({
        paymentsuccessButTicketNotGenerated: response.data,
        isPaymentsuccessButTicketNotGeneratedLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        paymentsuccessButTicketNotGenerated: [],
        isPaymentsuccessButTicketNotGeneratedLoading: false,
      });
      toast.error(error.message);
    }
  },


 fetchPaymentFailedGateway: async (payload) => {
  set({ isPaymentFailedGatewayLoading: true });
  try {
    const response = await apiService.get(
      `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_PAYMENT_FAILED_GATEWAY}?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&departureLocation=${payload.departureLocation}&arrivalLocation=${payload.arrivalLocation}&busType=${payload.busType}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`
    );
    set({
      paymentFailedGateway: response.data,
      isPaymentFailedGatewayLoading: false,
    });
  }
  catch (error) {
    set({
      error: error.message,
      paymentFailedGateway: [],
      isPaymentFailedGatewayLoading: false,
    });
  }
  finally {
    set({ isPaymentFailedGatewayLoading: false });
  }
 },

 fetchPaymentFailedOtherReasons: async (payload) => {
  set({ isPaymentFailedOtherReasonsLoading: true });
  try {
    const response = await apiService.get(
      `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_PAYMENT_FAILED_OTHER_REASONS}?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&departureLocation=${payload.departureLocation}&arrivalLocation=${payload.arrivalLocation}&busType=${payload.busType}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`
    );
    set({
      paymentFailedOtherReasons: response.data,
      isPaymentFailedOtherReasonsLoading: false,
    });
  }
  catch (error) {
    set({
      error: error.message,
      paymentFailedOtherReasons: [],
      isPaymentFailedOtherReasonsLoading: false,
    });
  }
  finally {
    set({ isPaymentFailedOtherReasonsLoading: false });
  }
 }


}));
