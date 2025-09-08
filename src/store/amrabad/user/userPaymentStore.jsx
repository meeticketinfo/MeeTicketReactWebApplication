import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const usePaymentStore = create((set) => ({
  loadingInitiateTransaction: false,
  loadingAddNewBookingDetails: false,
  loadingSaveCardPaymentTransactions: false,
  loadingCancelTicket: false,
  initiateTransaction: async (data) => {
    set({ loadingInitiateTransaction: true });
    try {
      const response = await apiService.post(API_ENDPOINTS.AMRABAD.USER.INITIATE_TRANSACTION, data);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Some thing went wrong");
      return error;
    } finally {
      set({ loadingInitiateTransaction: false });
    }
  },
  addNewBookingDetails: async (data) => {
    set({ loadingAddNewBookingDetails: true });
    try {
      const response = await apiService.post(API_ENDPOINTS.AMRABAD.USER.ADD_NEW_BOOKING_DETAILS, data);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Some thing went wrong");
      return error;
    } finally {
      set({ loadingAddNewBookingDetails: false });
    }
  },
  orderStatusCall: async  (orderId) => {
    set({ loadingOrderStatusCall: true });
    try {
      const response = await apiService.post(API_ENDPOINTS.AMRABAD.USER.ORDER_STATUS_CALL + "/" + orderId);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Some thing went wrong");
      return error;
    } finally {
      set({ loadingOrderStatusCall: false });
    }
  },
  saveCardPaymentTransactions: async (data) => {
    set({ loadingSaveCardPaymentTransactions: true });
    try {
      const response = await apiService.post(API_ENDPOINTS.AMRABAD.USER.SAVE_CARD_PAYMENT_TRANSACTIONS, data);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Some thing went wrong");
      return error;
    }
    finally {
      set({ loadingSaveCardPaymentTransactions: false });
    }
  },
  cancelTicket: async (data) => {
    set({ loadingCancelTicket: true });
    try {
      const param = `?bookingId=${data.bookingId}&reason=${data.reason}&IsCancelled=${true}`;
      const response = await apiService.put(`${API_ENDPOINTS.AMRABAD.USER.CANCEL_TICKET_WEB}${param}`);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Some thing went wrong");
      return error;
    } finally {
      set({ loadingCancelTicket: false });
    }
  }
}));