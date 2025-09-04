import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useBookingHistoryStore = create((set) => ({
  // fetch user booking history
  GetUserBookingHistory: [],
  isUserBookingHistoryLoading: false,

  // fetch user booking history
  fetchUserBookingHistory: async () => {
    set({ isUserBookingHistoryLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_USER_BOOKING_HISTORY}`
      );

      set({
        GetUserBookingHistory: response.data,
        isUserBookingHistoryLoading: false,
      });
    } catch (error) {
      set({
        isUserBookingHistoryLoading: false,
      });
      toast(error.response.data.message || "Some thing went wrong");
    }
  },

}));
