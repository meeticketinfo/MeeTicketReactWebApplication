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
  fetchRtcTransactionTrackingStatusByOrderId: async (orderID = "") => {
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
        error: error.message,
        RtcTransactionTrackingStatusByOrderIdData: response.data,
      });
    } finally {
      set({
        isFetchRtcTransactionTrackingStatusByOrderId: false,
      });
    }
  },

  // booking records

  RtcBusPassBookingRecordsData: [],
  isFetchRtcBusPassBookingData: false,
  fetchRtcBusPassBookingData: async (payload = {}) => {
    set({ isFetchRtcBusPassBookingData: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_BOOKING_RECORDS}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&busPassTypeId=${payload.BusPassType}&typeOfPayment=${payload.typeOfPayment}&query=${payload.transactionId}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`
      );
      set({
        RtcBusPassBookingRecordsData: response.data,
        isFetchRtcBusPassBookingData: false,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusPassBookingRecordsData: [],
      });
      toast.error(error.message);
    } finally {
      set({
        isFetchRtcBusPassBookingData: false,
      });
    }
  },

  // Bus pass verify status
  RtcBusPassVerifyStatusData: [],
  isFetchRtcBusPassVerifyStatusData: false,
  fetchRtcBusPassVerifyStatusData: async (orderId) => {
    set({ isFetchRtcBusPassVerifyStatusData: true });
    try {
      const method = "post";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_VERIFY_STATUS}/${orderId}`
      );
      set({
        RtcBusPassVerifyStatusData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusPassVerifyStatusData: [],
      });
    } finally {
      set({
        isFetchRtcBusPassVerifyStatusData: false,
      });
    }
  },

  // bus pass generate pass
  RtcGeneratePassData: [],
  isFetchRtcGeneratePassData: false,
  fetchRtcGeneratePassData: async (payloadString = "{}") => {
    const endpoint = true
      ? API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
          .GET_BUS_PASS_GENERATE_TICKET_NEW_PASS
      : API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
          .GET_BUS_PASS_GENERATE_TICKET_RENEWAL;

    set({ isFetchRtcGeneratePassData: true });

    try {
      // Step 1: Parse JSON string → object
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(payloadString);
      } catch (err) {
        console.error("Invalid JSON string:", payloadString);
      }
      // Step 2: Prepare data for uploadFile
      let fileToUpload = null;
      const additionalData = {};
      Object.entries(parsedPayload).forEach(([key, value]) => {
        if (key === "profileImgUrl") {
          console.log("profileImgUrl value:", value, "type:", typeof value);

          // Skip if it's an empty object or null/undefined
          if (
            !value ||
            (typeof value === "object" && Object.keys(value).length === 0)
          ) {
            console.log("Skipping empty profileImgUrl");
            return; // Skip this field
          }

          // Only process if it's a string
          if (typeof value === "string" && value.trim() !== "") {
            // Convert base64 to binary Blob
            try {
              let base64Data = value;

              // Check if it's a data URL format (data:image/...;base64,)
              if (value.startsWith("data:")) {
                base64Data = value.split(",")[1]; // Remove data:image/...;base64, prefix
              }
              // If it's just raw base64 string, use it directly

              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: "image/jpeg" }); // Adjust type as needed
              fileToUpload = blob; // Set as the file to upload
              console.log(
                "Successfully converted profileImgUrl to binary blob"
              );
            } catch (base64Error) {
              console.error("Error converting base64 to binary:", base64Error);
              // If conversion fails, add as regular data
              additionalData[key] = value;
            }
          } else {
            console.log("profileImgUrl is not a valid string, skipping");
          }
        } else {
          additionalData[key] = value == null ? "" : value;
        }
      });

      // Step 3: Send using uploadFile (multipart/form-data)
      const response = await apiService.uploadFile(
        endpoint,
        fileToUpload,
        additionalData
      );

      set({
        RtcGeneratePassData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcGeneratePassData: [],
      });
    } finally {
      set({ isFetchRtcGeneratePassData: false });
    }
  },

  // bus pass initiate refund
  RtcBusInitiateData: [],
  isFetchRtcBusPassInitiateData: false,
  fetchRtcBusPassInitiateData: async (orderId) => {
    set({ isFetchRtcBusPassInitiateData: true });
    try {
      const method = "post";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_INITIATE_REFUND}/${orderId}`
      );
      set({
        RtcBusInitiateData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusInitiateData: [],
      });
      throw error;
    } finally {
      set({
        isFetchRtcBusPassInitiateData: false,
      });
    }
  },

  // view bus pass
  RtcViewBusPassData: [],
  isFetchRtcViewBusPassData: false,
  fetchRtcRtcViewBusPassData: async (payload) => {
    console.log("payload", payload);
    set({ isFetchRtcViewBusPassData: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_VIEW_BUS_PASS}?passId=${payload.passId}`
      );
      set({
        RtcViewBusPassData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcViewBusPassData: [],
      });
    } finally {
      set({
        isFetchRtcViewBusPassData: false,
      });
    }
  },
}));
