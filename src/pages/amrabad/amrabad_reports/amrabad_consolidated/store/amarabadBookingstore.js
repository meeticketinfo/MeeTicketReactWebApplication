import { create } from "zustand";
import apiService from "../../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import { handleApiError } from "../../../../../utils/apiErrorHandler";
export const useAmrabadBookingStore = create((set) => ({
  allAmrabadBookings: [],
  isFetchAllAmrabadBookingsLoading: false,
  totalCount: 0,
  fetchAllAmrabadBookings: async (filters) => {
    set({ isFetchAllAmrabadBookingsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.REPORTS.AMRABAD_BOOKINGS}?fromDate=${filters.startDate}&toDate=${filters.endDate}&purchaseOrBooking=${filters.bookingSource || ''}&mobileNumber=${filters.mobileNumber || ''}&packageId=${filters.package || ''}&roomId=${filters.houses || ''}&id=${filters.orderId || ''}&paymentStatus=${filters.paymentStatus || ''}&modeOfBooking=${filters.modeOfBooking || ''}&pageNumber=${filters.PageIndex || 1}&pageSize=${filters.pageSize || 20}`
      );
      set({
        allAmrabadBookings: response.data.records,
        totalCount: response.data.totalCount,
        isFetchAllAmrabadBookingsLoading: false,
      });
    } catch (error) {
      console.error("Error fetching Amrabad bookings:", error);
      handleApiError(error);
      set({ isFetchAllAmrabadBookingsLoading: false });
    }
  },
}));
