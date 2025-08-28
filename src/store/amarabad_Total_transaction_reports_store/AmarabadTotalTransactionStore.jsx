import { create } from "zustand";

import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useAmarabadTotalTransactionStore = create((set) => ({
  // by Reason
  AmarabadTransactionByReasonData: [],
  isAmarabadTransactionByReasonLoading: false,

  //metro total transactions
  AmrabadTotalTransactionsData: [],
  isAmrabadTotalTransactionsLoading: false,

  PaymentGatewayPieChartData: [],
  isPaymentGatewayPieChartLoading: false,

  TicketNotGeneratedPieChartData: [],
  isTicketNotGeneratedPieChartLoading: false,

  AmrabadTotalTransactionsData: [],
  isAmrabadTotalTransactionsLoading: false,



  // track order

  //   isFetchMetroTransactionTrackingStatusByOrderId: false,
  //   MetroTransactionTrackingStatusByOrderIdData: [],

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason

  fetchAmarabadTransactionByReason: async (payload) => {
    set({ isAmarabadTransactionByReasonLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&packageId=${payload.package}&roomId=${payload.house}&phoneNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD_TRANSACTIONS_REPORT.GET_AMRABAD_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        AmarabadTransactionByReasonData: response.data,
        isAmarabadTransactionByReasonLoading: false,
      });
    } catch (error) {
      console.log("error", error);
      set({
        error: error.message,
        AmarabadTransactionByReasonData: [],
        isAmarabadTransactionByReasonLoading: false,
      });
      toast.error(error.message);
    }
  },
  //TOTAL TRANSACTIONS
  fetchAmrabadTotalTransactions: async (payload) => {
    set({ isAmrabadTotalTransactionsLoading: true });
    const param = `?startDate=${payload.startDate}&endDate=${payload.endDate}&phoneNumber=${payload.phoneNumber}&status=${payload.status}&paymentMode=${payload.PaymentMode}&subCategory=${payload.subCategory}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD_TRANSACTIONS_REPORT.GET_AMRABAD_TOTAL_TRANSACTION_STATUS}${param}`
      );

      set({
        AmrabadTotalTransactionsData: response.data,
        isAmrabadTotalTransactionsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, AmrabadTotalTransactionsData: [], isAmrabadTotalTransactionsLoading: false });
      toast.error(error.message)
    }
  },

  // GET gate way PIE CHART

  fetchGateWayPieChart: async (payload) => {
    set({ isPaymentGatewayPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&packageId=${payload.package}&roomId=${payload.house}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD_TRANSACTIONS_REPORT.GET_AMRABAD_GATEWAY_PIE_CHART}${param}`
      );

      set({
        PaymentGatewayPieChartData: response.data,
        isPaymentGatewayPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message,PaymentGatewayPieChartData:[], isPaymentGatewayPieChartLoading: false });
    }
  },

// GET Ticket not generated PIE CHART

  fetchTicketNotGeneratedPieChart: async (payload) => {
    set({ isTicketNotGeneratedPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD_TRANSACTIONS_REPORT.GET_AMRABAD_TICKET_NOT_GENERATED_PIE_CHART}${param}`
      );

      set({
        TicketNotGeneratedPieChartData: response.data,
        isTicketNotGeneratedPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message,TicketNotGeneratedPieChartData:[], isTicketNotGeneratedPieChartLoading: false });
    }
  },


   // GET OTHER REASONS PIE CHART

  fetchOtherReasonsPieChart: async (payload) => {
    set({ isOtherReasonsPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD_TRANSACTIONS_REPORT.GET_AMRABAD_OTHER_REASON_PIE_CHART}${param}`
      );

      set({
        OtherReasonsPieChartData: response.data,
        isOtherReasonsPieChartLoading: false,
      });
    } catch (error) {
      set({ error: error.message,OtherReasonsPieChartData: [], isOtherReasonsPieChartLoading: false });
    }
  },

  // track order
  //   fetchMetroTransactionTrackingStatusByOrderId: async (orderID="") => {
  //     set({ isFetchMetroTransactionTrackingStatusByOrderId: true });
  //     try {
  //       const response = await apiService.get(
  //         `${API_ENDPOINTS.METRO_TRANSACTIONS_REPORT.METRO_USER_TRANSACTIONS_REPORT.GET_METRO_TRANSACTION_TRACKING_STATUS}?orderId=${orderID}`
  //       );
  //       set({
  //         MetroTransactionTrackingStatusByOrderIdData: response.data,
  //       });
  //       return { response: response.data };
  //     } catch (error) {
  //       set({
  //         error: error.message,MetroTransactionTrackingStatusByOrderIdData: response.data,
  //       });
  //     } finally {
  //       set({
  //         isFetchMetroTransactionTrackingStatusByOrderId: false,
  //       });
  //     }
  //   },
}));
