import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useIntercityIndividualStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Intercity ticket view
  IntercityIndividualData: [],
  isFetchIntercityIndividualData: false,
  fetchIntercityIndividualData: async (payload) => {
    set({ isFetchIntercityIndividualData: true });
    try {
      const params = `?fromDate=${payload.fromDate}&toDate=${
        payload.fromDate
      }&phoneNumber=${payload.mobileNumber}&busType=${
        payload.busType
      }&seatLayoutType=${payload.seatLayoutType}&paymentMode=${
        payload.paymentMode
      }&transactionId=${payload.transactionId}&orderId=${payload.orderId}&bookingStatus=${
        payload.bookingStatus
      }&pNRNumber=${payload.pnrNumber}&returnPNRNumber=${
        payload.returnPnrNumber
      }&departureLocationName=${payload.departureLocation?payload.departureLocation:""}&arrivalLocationName=${
        payload.arrivalLocation?payload.arrivalLocation:""
      }&ticketId=${payload.ticketId}&returnTicketId=${
        payload.returnTicketId
      }&pageNumber=${payload.pageNumber}&pageSize=${payload.PageSize}`;
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_INDIVIDUAL_REPORT}${params}`
      );
      set({
        IntercityIndividualData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        IntercityIndividualData: [],
      });
    } finally {
      set({
        isFetchIntercityIndividualData: false,
      });
    }
  },

}));
