import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const useTransactionsStore = create((set) => ({
  // overall PASS
  FailedTransactionByReasonData: null,
  isFailedTransactionByReasonLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason

  fetchFailedTransactionByReason: async () => {
    console.log("test")
    set({ isFailedTransactionByReasonLoading: true });
   const param = `?durationType=${"today"}`
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.FAILED_TRANSACTIONS.GET_FAILED_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        FailedTransactionByReasonData: response.data,
        isFailedTransactionByReasonLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFailedTransactionByReasonLoading: false });
    }
  },
 

//   fetchallDashboardReportData: async ({ fromDate, toDate,passTypeId, active }) => {
//     console.log("passTypeId", passTypeId);
//     const date = active
//       ? `?startDate=${fromDate}&endDate=${toDate}&passTypeId=${passTypeId}`
//       : `?startDate=${fromDate}&endDate=${toDate}`;
//     set({ isFetchDashboardReportDataLoading: true });
//     try {
//       const response = await apiService.get(
//         `${API_ENDPOINTS.RTC_DASHBOARD.GET_ALL_DASHBOARD_REPORT}${date}`
//       );

//       set({
//         allDashboardReportData: response.data,
//         isFetchDashboardReportDataLoading: false,
//       });
//     } catch (error) {
//       set({ error: error.message, isFetchDashboardReportDataLoading: false });
//     }
//   },

//   fetchallbuspasses: async () => {
//     set({ isFetchbuspassDataLoading: true });
//     try {
//       const response = await apiService.get(
//         `${API_ENDPOINTS.RTC_DASHBOARD.GET_ALL_BUSPASSES}`
//       );

//       set({
//         allbuspassData: response.data,
//         isFetchbuspassDataLoading: false,
//       });
//     } catch (error) {
//       set({ error: error.message, isFetchbuspassDataLoading: false });
//     }
//   },
}));
