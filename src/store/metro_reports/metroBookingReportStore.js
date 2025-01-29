import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMetroBookingStore = create((set) => ({
  allMetroBookingDetailsReports: [],
  isFetchAllMetroBookingDetailsReportsLoading: false,
  MetroBookingsDetails: {},

  isFetchCurrentMetroBookingsDetailsLoading: false,

  // Fetch all Metro Bookings
  fetchAllMetroBookingDetailsReport: async (
    // pageIndex = 1, pageSize = 10, filters = {},
    { fromDate, toDate,mobileNumber }
  ) => {
    set({ isFetchAllMetroBookingDetailsReportsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.METRO_Reports.GET_METRO_BOOKING_DETAILS}?StartDate=${fromDate}&EndDate=${toDate}&MobileNumber=${mobileNumber}`
      );
      set({
        allMetroBookingDetailsReports: response.data,
        isFetchAllMetroBookingDetailsReportsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllMetroBookingDetailsReportsLoading: false });
    }
  },
}));
