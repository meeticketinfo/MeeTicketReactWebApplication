import { create } from "zustand";

import { toast } from "react-toastify";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const useBusPassTotalTransactionStore = create((set) => ({
  

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason
  RtcTransactionByReasonData: [],
  isRtcTransactionByReasonLoading: false,
  fetchRtcTransactionByReason: async (payload) => {
    set({ isRtcTransactionByReasonLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        RtcTransactionByReasonData: response.data,
        isRtcTransactionByReasonLoading: false,
      });
    } catch (error) {
      console.log("error", error);
      set({
        error: error.message,
        RtcTransactionByReasonData: [],
        isRtcTransactionByReasonLoading: false,
      });
      toast.error(error.message);
    }
  },

  //TOTAL TRANSACTIONS
  RtcTotalTransactionsData: [],
  isRtcTotalTransactionsLoading: false,
  fetchRtcTotalTransactions: async (payload) => {
    console.log("payload", payload);
    set({ isRtcTotalTransactionsLoading: true });
    const param = `?startDate=${payload.startDate}&endDate=${payload.endDate}&phoneNumber=${payload.phoneNumber}&status=${payload.status}&passTypeId=${payload.BusPassType}&subCategory=${payload.subCategory}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TOTAL_TRANSACTIONS}${param}`
      );

      set({
        RtcTotalTransactionsData: response.data,
        isRtcTotalTransactionsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcTotalTransactionsData: [],
        isRtcTotalTransactionsLoading: false,
      });
      toast.error(error.message);
    }
  },

  // GET gate way PIE CHART
  RtcGateWayPieChartData: [],
  RtcisGateWayPieChartLoading: false,

  fetchRtcGateWayPieChart: async (payload) => {
    set({ RtcisGateWayPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_GATEWAY_PIE_CHART}${param}`
      );

      set({
        RtcGateWayPieChartData: response.data,
        RtcisGateWayPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcGateWayPieChartData: [],
        RtcisGateWayPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },


  // GET Ticket not generated PIE CHART
  RtcTicketNotGeneratedPieChartData: [],
  RtcisTicketNotGeneratedPieChartLoading: false,

  fetchRtcTicketNotGeneratedPieChart: async (payload) => {
    set({ RtcisTicketNotGeneratedPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TICKET_NOT_GENERATED_PIE_CHART}${param}`
      );

      set({
        RtcTicketNotGeneratedPieChartData: response.data,
        RtcisTicketNotGeneratedPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcTicketNotGeneratedPieChartData: [],
        RtcisTicketNotGeneratedPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },

  // GET OTHER REASONS PIE CHART
  RtcOtherReasonsPieChartData: [],
  RtcisOtherReasonsPieChartLoading: false,

  fetchRtcOtherReasonsPieChart: async (payload) => {
    set({ RtcisOtherReasonsPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}&endDate=${payload.toDate}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_OTHER_REASON_PIE_CHART}${param}`
      );

      set({
        RtcOtherReasonsPieChartData: response.data,
        RtcisOtherReasonsPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcOtherReasonsPieChartData: [],
        RtcisOtherReasonsPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },
// GET ALL BUS PASSES
  AllBusPassesData: [],
  AllBusPassesLoading: false,
  fetchAllBusPasses: async (payload) => {
    set({ AllBusPassesLoading: true });
    
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.BUS_PASS.GET_ALL_BUS_PASSES}`
      );

      set({
        AllBusPassesData: response.data,
        AllBusPassesLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        AllBusPassesData: [],
        AllBusPassesLoading: false,
      });
      toast.error(error.message);
    }
  },
// GET RTC TRACK ORDER
RtcTransactionTrackingStatusByOrderIdData: [],
isFetchRtcTransactionTrackingStatusByOrderId: false,
fetchRtcTransactionTrackingStatusByOrderId: async (orderID="") => {
  set({ isFetchRtcTransactionTrackingStatusByOrderId: true });
  try {
    const response = await apiService.get(
      `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TRACK_ORDER}?orderId=${orderID}`
    );
    set({
      RtcTransactionTrackingStatusByOrderIdData: response.data,
    });
    return { response: response.data };
  } catch (error) {
    set({
      error: error.message,RtcTransactionTrackingStatusByOrderIdData: response.data,
    });
  } finally {
    set({
      isFetchRtcTransactionTrackingStatusByOrderId: false,
    });
  }
},
  
}));
