import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { handleApiError } from "../../../../../utils/apiErrorHandler";
export const useAmrabadBookingStore = create((set) => ({
  allAmrabadBookings: [],
  isFetchAllAmrabadBookingsLoading: false,
  fetchAllAmrabadBookings: async (filters) => {
    set({ isFetchAllAmrabadBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.REPORTS.AMRABAD_BOOKINGS}?fromDate=${filters.startDate}&toDate=${filters.endDate}&bookingSource=${filters.bookingSource || ''}&mobileNumber=${filters.mobileNumber || ''}&PaymentMode=${filters.PaymentMode || ''}&package=${filters.package || ''}&houses=${filters.houses || ''}&orderId=${filters.orderId || ''}&paymentStatus=${filters.paymentStatus || ''}&modeOfBooking=${filters.modeOfBooking || ''}`
      );
      set({
        allAmrabadBookings: response.data.records,
        isFetchAllAmrabadBookingsLoading: false,
      });
    } catch (error) {
      console.error("Error fetching Amrabad bookings:", error);
      handleApiError(error);
      set({ isFetchAllAmrabadBookingsLoading: false });
    }
  },
}));
