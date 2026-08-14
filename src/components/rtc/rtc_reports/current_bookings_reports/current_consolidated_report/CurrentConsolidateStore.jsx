import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useCurrentConsolidateStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Current ticket view
  CurrentConsolidateData: [],
  isFetchCurrentConsolidateData: false,
  fetchCurrentConsolidateData: async (payload) => {
    set({ isFetchCurrentConsolidateData: true });
    try {
      const params = `purchaseOrBooking=${payload.purchaseOrBooking}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&typeOfBus=${encodeURIComponent(payload.typeOfBus)}&paymentMode=${payload.paymentMode}&transactionId=${payload.transactionId}&PNRNumber=${payload.PNRNumber}&orderId=${payload.orderId}&departureLocation=${payload.departureLocation?payload.departureLocation:""}&arrivalLocation=${payload.arrivalLocation?payload.arrivalLocation:""}&pageNumber=${payload.pageNumber}&pageSize=${payload.PageSize}`;
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_CONSOLIDATED_REPORT}?${params}`
      );
      set({
        CurrentConsolidateData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CurrentConsolidateData: [],
      });
    } finally {
      set({
        isFetchCurrentConsolidateData: false,
      });
    }
  },
}));
