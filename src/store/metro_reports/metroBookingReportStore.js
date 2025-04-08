import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMetroBookingStore = create((set) => ({
  allMetroBookingDetailsReports: [],
  isFetchAllMetroBookingDetailsReportsLoading: false,
  allMetroCumulativeBookingDetailsReports: [],
  isFetchAllMetroCumulativeBookingDetailsReportsLoading: false,
  MetroBookingsDetails: {},
  isSaveInitiatAmountLoading: false,
  isFetchCurrentMetroBookingsDetailsLoading: false,
  isSavePaymentSettlementLoading: false,
  isSaveVerifySettlementAmountLoading:false,
  isSaveRefreshButtonLoading:false,

  // Fetch all Metro Bookings
  fetchAllMetroBookingDetailsReport: async (
    // pageIndex = 1, pageSize = 10, filters = {},
    { fromDate, toDate, mobileNumber }
  ) => {
    set({ isFetchAllMetroBookingDetailsReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_Reports.GET_METRO_BOOKING_DETAILS}?StartDate=${fromDate}&EndDate=${toDate}&MobileNumber=${mobileNumber}`
      );
      set({
        allMetroBookingDetailsReports: response.data,
        isFetchAllMetroBookingDetailsReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllMetroBookingDetailsReportsLoading: false,
      });
    }
  },

  fetchAllMetroCumulativeBookingDetailsReport: async ({ fromDate, toDate }) => {
    set({ isFetchAllMetroCumulativeBookingDetailsReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_Reports.GET_CUMULATIVE_METRO_BOOKINGS}?StartDate=${fromDate}&EndDate=${toDate}`
      );
      set({
        allMetroCumulativeBookingDetailsReports: response.data,
        isFetchAllMetroCumulativeBookingDetailsReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllMetroCumulativeBookingDetailsReportsLoading: false,
      });
    }
  },

  // INITIAT AMOUNT FOR PAYNOW
  saveInitiateSettelementDetails: async (initiatAmount) => {
    set({ isSaveInitiatAmountLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.METRO_Reports.ADD_INITIAT_PAYMENT;

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

  VerifySettlementAmount: async (VerifySettlement) => {
    set({ isSaveVerifySettlementAmountLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.METRO_Reports.ADD_PAYMENT_SETTLEMENT;

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

  RefreshButton: async (payload) => {
    set({ isSaveRefreshButtonLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.METRO_Reports.REFRESH_BUTTON;

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
