import { create } from "zustand";

export const useConsolidatedStore = create((set) => ({

  fetchConsolidatedReport: async (payload) => {
        const Payload1 = {
          fromDate: payload.fromDate,
          toDate: payload.toDate,
          departmentId: payload.departmentId,
          entityTypeId: payload.entityTypeId,
          mobileNumber:payload.mobileNumber
        };
        const finalPyload = payload.bookingSource == "" ? Payload1 : payload;
        set({ isCompleteBookingsReportsLoading: true });
        try {
          const url =
            API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_COMPLETE_BOOKINGS;
          const method = "post";
          const response = await apiService[method](url, finalPyload);
          set({
            allCompleteBookingsReports: response.data,
            isCompleteBookingsReportsLoading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            isCompleteBookingsReportsLoading: false,
          });
        }
      },
}));
