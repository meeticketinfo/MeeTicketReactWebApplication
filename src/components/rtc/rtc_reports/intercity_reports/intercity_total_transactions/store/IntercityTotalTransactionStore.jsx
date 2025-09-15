import { create } from "zustand";
import { toast } from "react-toastify";
import apiService from "../../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../../constants/apiEndpoints";



export const useIntercityTotalTransactionStore = create((set) => ({
  intercityTotalTransactions: [],
  isIntercityTotalTransactionsLoading: false,

    
  paymentsuccessButTicketNotGenerated: [],
  isPaymentsuccessButTicketNotGeneratedLoading: false,


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
  }



}));




