import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useCounterWiseBookingStore = create((set) => ({
  allCounterWiseBookingsReports: [],
  isCounterWiseBookingsReportsLoading: false,
  isCounterWiseBooking: false,
  error: null,

  setisCounterWiseBooking: (isCounterWiseBooking) => {
    set({ isCounterWiseBooking });
  },

  fetchCounterWiseBookingsReport: async (payload) => {
    const Payload1 = {
      startDate: payload.startDate,
      endDate: payload.endDate,
      bookingDateFrom: payload.bookingDateFrom,
      bookingDateTo: payload.bookingDateTo,
      departmentId: payload.departmentId,
      entityTypeId: payload.entityTypeId,
      mobileNumber: payload.mobileNumber,
      parkId: payload.parkId,
    };
    const finalPyload = payload.bookingSource == "" ? Payload1 : payload;
    set({ isCounterWiseBookingsReportsLoading: true });
    try {
      const url = API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_COMPLETE_BOOKINGS;
      const method = "post";
      const response = await apiService[method](url, finalPyload);
      set({
        allCounterWiseBookingsReports: response.data,
        isCounterWiseBookingsReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isCounterWiseBookingsReportsLoading: false,
      });
    }
  },
}));
