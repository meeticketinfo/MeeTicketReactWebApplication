import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useIntercityTicketViewStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Intercity ticket view
  IntercityTicketViewData: [],
  isFetchIntercityTicketViewData: false,
  fetchIntercityTicketViewData: async (paymentTransactionId="") => {
    set({ isFetchIntercityTicketViewData: true });
    try {
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_TICKET_VIEW}/${paymentTransactionId}`
      );
      set({
        IntercityTicketViewData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        IntercityTicketViewData: [],
      });
    } finally {
      set({
        isFetchIntercityTicketViewData: false,
      });
    }
  },
}));
