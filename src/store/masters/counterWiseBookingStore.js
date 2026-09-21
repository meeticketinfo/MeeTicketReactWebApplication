import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const getCountersList = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  return [];
};

export const useCounterWiseBookingStore = create((set, get) => ({
  allCounterWiseBookingsReports: [],
  isCounterWiseBookingsReportsLoading: false,
  isCounterWiseBooking: false,
  counterUsersList: [],
  allCounterUserIds: "",
  error: null,

  setisCounterWiseBooking: (isCounterWiseBooking) => {
    set({ isCounterWiseBooking });
  },

  fetchCounterUsersList: async () => {
    try {
      const countersResponse = await apiService.get(
        API_ENDPOINTS.REPORTS.COUNTER_WISE_BOOKING_REPORTS.GET_COUNTERS_LIST
      );
      const counterUsersList = getCountersList(countersResponse);
      const allCounterUserIds = counterUsersList.map((item) => item.counterUserId).filter(Boolean).join(",");
      set({counterUsersList,allCounterUserIds});
      return allCounterUserIds;
    } catch (error) {
      set({
        error: error.message,
        counterUsersList: [],
        allCounterUserIds: "",
      });
      return "";
    }
  },

  fetchCounterWiseBookingsReport: async (payload) => {
    set({ isCounterWiseBookingsReportsLoading: true });
    try {
      const reportPayload = {
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        bookingDateFrom: payload.bookingDateFrom ?? null,
        bookingDateTo: payload.bookingDateTo ?? null,
        bookingSource: payload.bookingSource || null,
        mobileNumber: payload.mobileNumber ?? null,
        departmentId: payload.departmentId ?? null,
        entityTypeId: payload.entityTypeId ?? null,
        parkId: payload.parkId ?? null,
        counterUserId: get().allCounterUserIds || "",
      };

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.COUNTER_WISE_BOOKING_REPORTS.GET_COUNTER_BOOKINGS,
        reportPayload
      );
      set({
        allCounterWiseBookingsReports: response.data,
        isCounterWiseBookingsReportsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        allCounterWiseBookingsReports: [],
        isCounterWiseBookingsReportsLoading: false,
      });
    }
  },
}));
