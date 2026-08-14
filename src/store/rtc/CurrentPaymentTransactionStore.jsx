import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

export const useCurrentPaymentTransactionStore = create((set) => ({
  isFetchCurrentPaymentTransactionsLoading: false,
  currentPaymentTransactions: [],
  isFetchCurrentVerifyStatusLoading: false,
  isFetchCurrentRegenerateTicketLoading: false,
  isFetchCurrentPaymentTransactionRefundLoading: false,

  fetchCurrentPaymentTransactions: async (payload = {}) => {
    set({ isFetchCurrentPaymentTransactionsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_PAYMENT_TRANSACTION_REPORT}?fromDate=${payload.startDate}&toDate=${payload.endDate}&paymentStatusId=${payload.paymentStatus}&MobileNumber=${payload.phoneNumber}&arrivalLocation=${payload.arrivalLocation}&departureLocation=${payload.destinationLocation}&pageNumber=${payload.PageIndex}&pageSize=${payload.pageSize}`
      );
      set({
        currentPaymentTransactions: response.data,
        isFetchCurrentPaymentTransactionsLoading: false,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        currentPaymentTransactions: [],
      });
      console.error('API Error:', error);
    } finally {
      set({
        isFetchCurrentPaymentTransactionsLoading: false,
      });
    }
  },

  // Current Verify Status
  fetchCurrentVerifyStatus: async (orderId) => {
    set({ isFetchCurrentVerifyStatusLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_VERIFY_STATUS}/${orderId}`;
      const method = "post";
      const response = await apiService[method](url);
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchCurrentVerifyStatusLoading: false,
      });
      return { response: response };
    } catch (error) {
      toast.error(error.message);
      set({ isFetchCurrentVerifyStatusLoading: false });
      return error;
    }
  },

  // Current Regenerate Ticket
  fetchCurrentRegenerateTicket: async (data) => {
    set({ isFetchCurrentRegenerateTicketLoading: true });
    try {
      const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_REGENERATE_TICKET}`;
      const method = "post";
      const response = await apiService[method](url, data);
      set({
        isFetchCurrentRegenerateTicketLoading: false,
      });
      set({ isFetchCurrentRegenerateTicketLoading: false });
      return { response: response };
    } catch (error) {
      // toast.error(error.response.data.result.message);
      set({ isFetchCurrentRegenerateTicketLoading: false });
     throw error;
    } finally {
      set({ isFetchCurrentRegenerateTicketLoading: false });
    }
  },

  // Current Payment Transaction Refund
  fetchCurrentPaymentTransactionRefund: async (orderId) => {
    set({ isFetchCurrentPaymentTransactionRefundLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_PAYMENT_TRANSACTION_REFUND}?orderId=${orderId}`
      );
      set({
        isFetchCurrentPaymentTransactionRefundLoading: false,
      });
      return { response: response };
    } catch (error) {   
      toast.error(error.message);
      set({ isFetchCurrentPaymentTransactionRefundLoading: false });
      return { success: false };
    } finally {
      set({ isFetchCurrentPaymentTransactionRefundLoading: false });
    }
  },
  
}));
