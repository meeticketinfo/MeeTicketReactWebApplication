import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

export const useIntercityPaymentTransactionStore = create((set) => ({
  isFetchIntercityPaymentTransactionsLoading: false,
  intercityPaymentTransactions: [],
  isFetchIntercityVerifyStatusLoading: false,
  isFetchIntercityRegenerateTicketLoading: false,
  isFetchIntercityPaymentTransactionRefundLoading: false,

  fetchIntercityPaymentTransactions: async (payload = {}) => {
    set({ isFetchIntercityPaymentTransactionsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.INTERCITY.REPORTS.GET_PAYMENT_TRANSACTION_REPORT}?fromDate=${payload.startDate}&toDate=${payload.endDate}&paymentStatusId=${payload.paymentStatus}&MobileNumber=${payload.phoneNumber}&arrivalLocation=${payload.arrivalLocation}&departureLocation=${payload.destinationLocation}&pageNumber=${payload.PageIndex}&pageSize=${payload.pageSize}`
      );
      set({
        intercityPaymentTransactions: response.data,
        isFetchIntercityPaymentTransactionsLoading: false,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        intercityPaymentTransactions: [],
      });
      console.error('API Error:', error);
    } finally {
      set({
        isFetchIntercityPaymentTransactionsLoading: false,
      });
    }
  },

  // Intercity Verify Status
  fetchIntercityVerifyStatus: async (orderId) => {
    set({ isFetchIntercityVerifyStatusLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_VERIFY_STATUS}/${orderId}`;
      const method = "post";
      const response = await apiService[method](url);
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchIntercityVerifyStatusLoading: false,
      });
      return { response: response };
    } catch (error) {
      toast.error(error.message);
      set({ isFetchIntercityVerifyStatusLoading: false });
      return error;
    }
  },

  // Intercity Regenerate Ticket
  fetchIntercityRegenerateTicket: async (data) => {
    set({ isFetchIntercityRegenerateTicketLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_REGENERATE_TICKET}`;
      const method = "post";
      const response = await apiService[method](url, data);
      set({
        isFetchIntercityRegenerateTicketLoading: false,
      });
      set({ isFetchIntercityRegenerateTicketLoading: false });
      return { response: response };
    } catch (error) {
      // toast.error(error.response.data.result.message);
      set({ isFetchIntercityRegenerateTicketLoading: false });
     throw error;
    } finally {
      set({ isFetchIntercityRegenerateTicketLoading: false });
    }
  },

  // Intercity Payment Transaction Refund
  fetchIntercityPaymentTransactionRefund: async (orderId) => {
    set({ isFetchIntercityPaymentTransactionRefundLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_PAYMENT_TRANSACTION_REFUND}?orderId=${orderId}`
      );
      set({
        isFetchIntercityPaymentTransactionRefundLoading: false,
      });
      return { response: response };
    } catch (error) {   
      toast.error(error.message);
      set({ isFetchIntercityPaymentTransactionRefundLoading: false });
      return { success: false };
    } finally {
      set({ isFetchIntercityPaymentTransactionRefundLoading: false });
    }
  },
  
}));
