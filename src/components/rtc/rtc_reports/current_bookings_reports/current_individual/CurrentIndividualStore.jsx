import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useCurrentIndividualStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Current ticket view
  CurrentIndividualData: [],
  isFetchCurrentIndividualData: false,
  fetchCurrentIndividualData: async (payload) => {
    set({ isFetchCurrentIndividualData: true });
    try {
      const params = `?fromDate=${payload.fromDate}&toDate=${
        payload.toDate
      }&phoneNumber=${payload.mobileNumber}&busType=${
        encodeURIComponent(payload.busType)
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
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_INDIVIDUAL_REPORT}${params}`
      );
      set({
        CurrentIndividualData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CurrentIndividualData: [],
      });
    } finally {
      set({
        isFetchCurrentIndividualData: false,
      });
    }
  },
}));
