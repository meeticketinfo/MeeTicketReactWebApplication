import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useparksBankPaymentStore = create((set) => ({
  isSaveInitiatAmountLoading: false,
  isFetchCurrentMetroBookingsDetailsLoading: false,
  isSavePaymentSettlementLoading: false,
  isSaveVerifySettlementAmountLoading: false,
  isSaveRefreshButtonLoading: false,

  //   verify amount
  VerifySettlementAmount: async (VerifySettlement) => {
    set({ isSaveVerifySettlementAmountLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.PARK_BANK_PAYMENT.PAYMENT_VERIFY;

      let response = await apiService["post"](url, VerifySettlement);

      set({
        isSaveVerifySettlementAmountLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({
        isSaveVerifySettlementAmountLoading: false,
      });
      throw error;
    }
  },
  // INITIAT AMOUNT FOR PAYNOW
  saveInitiateSettelementDetails: async (initiatAmount) => {
    set({ isSaveInitiatAmountLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.PARK_BANK_PAYMENT.PAYMENT_INITIAT;

      let response = await apiService["post"](url, initiatAmount);

      set({
        isSaveInitiatAmountLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({
        isSaveInitiatAmountLoading: false,
      });
      throw error;
    }
  },

  // SAVE DATA

  savePaymentSettlement: async (SettlementAmount) => {
    set({ isSavePaymentSettlementLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.METRO_Reports.UPDATE_PAYMENT_SETTLEMENT;

      let response = await apiService["put"](url, SettlementAmount);

      set({
        isSavePaymentSettlementLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({
        isSavePaymentSettlementLoading: false,
      });
      throw error;
    }
  },

  RefreshButton: async (payload) => {
    set({ isSaveRefreshButtonLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.PARK_BANK_PAYMENT.PAYMENT_REFRESH;

      let response = await apiService["post"](url, payload);

      set({
        isSaveRefreshButtonLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({
        isSaveRefreshButtonLoading: false,
      });
      throw error;
    }
  },
}));
