import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useIntercityConsolidateStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Intercity ticket view
  IntercityConsolidateData: [],
  isFetchIntercityConsolidateData: false,
  fetchIntercityConsolidateData: async (payload) => {
    set({ isFetchIntercityConsolidateData: true });
    try {
      const params = `purchaseOrBooking=${payload.purchaseOrBooking}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&typeOfBus=${encodeURIComponent(payload.typeOfBus)}&paymentMode=${payload.paymentMode}&transactionId=${payload.transactionId}&PNRNumber=${payload.PNRNumber}&departureLocation=${payload.departureLocation?payload.departureLocation:""}&arrivalLocation=${payload.arrivalLocation?payload.arrivalLocation:""}&pageNumber=${payload.pageNumber}&pageSize=${payload.PageSize}`;
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_CONSOLIDATED_REPORT}?${params}`
      );
      set({
        IntercityConsolidateData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        IntercityConsolidateData: [],
      });
    } finally {
      set({
        isFetchIntercityConsolidateData: false,
      });
    }
  },
}));
