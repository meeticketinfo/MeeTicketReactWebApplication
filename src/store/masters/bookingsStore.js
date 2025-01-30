import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { persist } from "zustand/middleware";
import { handleApiError } from "../../utils/apiErrorHandler";

export const useBookingsStore = create(
  persist(
    (set) => ({
      allBookings: [],
      isFetchAllBookingsLoading: false,
      error: null,
      success: null,
      allFacilityServices: {},
      isSaveBookingDetailsLoading: false,

      saveBookingDetailsError: null,
      bookingDetails: {},
      isFetchCurrentBookingDetailsLoading: false,
      FirstStepTransactionResponse: {},
      IsFirstStepTransaction: false,
      IsTransactionFailed: false,
      selectedBookingsList: {},
      PaymentStatus: {},
      isBookingFormVisible: false,
      isUpi: false,
      isCash: false,
      //
      bookings: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      isLoading: false,
      allCompleteBookingsReports: [],
      allTransactionPaymentReports: [],
      isCompleteBookingsReportsLoading: false,
      isTransactionPaymentReportsLoading: false,
      isCompleteBookings: false,
      bookingMessage: "",
      //

      serializeFilters: (filters) =>
        Object.entries(filters)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&"),

      setBookingDetails: (newBookingDetails) => {
        set({ bookingDetails: newBookingDetails });
      },

      setIsBookingFormVisible: (isBookingFormVisible) => {
        set({ isBookingFormVisible });
      },
      setisUpi: (isUpi) => {
        set({ isUpi });
      },
      setisCash: (isCash) => {
        set({ isCash });
      },
      setisCompleteBookings: (isCompleteBookings) => {
        set({ isCompleteBookings });
      },

      setSelectedBookingsList: (selectedBookingsList) => {
        set({ selectedBookingsList });
      },
      setPaymentStatus: (PaymentStatus) => {
        set({ PaymentStatus });
      },
      //  --------

      // setPaymentStatus: (status) =>
      //   set({
      //     PaymentStatus: {
      //       ...status,
      //     },
      //   }),

      setIsFirstStepTransaction: (IsFirstStepTransaction) => {
        set({ IsFirstStepTransaction });
      },
      setIsTransactionFailed: (IsTransactionFailed) => {
        set({ IsTransactionFailed });
      },

      // Set the current page
      setCurrentPage: (page) => set({ currentPage: page }),

      // Fetch all Bookings
      fetchAllBookings: async (pageIndex = 1, pageSize = 10, filters = {}) => {
        set({ isFetchAllBookingsLoading: true });
        try {
          //   const filterString = useBookingstore.getState().serializeFilters(filters);
          const response = await apiService.get(
            // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
            `${API_ENDPOINTS.MASTERS.BOOKING.GET_BOOKINGS}`
          );
          set({
            allBookings: response.data.data.data,
            isFetchAllBookingsLoading: false,
          });
        } catch (error) {
          set({ isFetchAllBookingsLoading: false });
        }
      },

      // Fetch bookings with optional filtering
      fetchAllEntityBookingsByFilters: async (filters = {}) => {
        set({ isLoading: true, error: null });
        const { currentPage, pageSize } = useBookingsStore.getState();
        const serializedFilters = Object.entries(filters)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        try {
          const response = await apiService.get(
            `Transaction/GetAllEntityBookingByFilters?PageIndex=${currentPage}&PageSize=${pageSize}&${serializedFilters}`
          );

          if (response.status === 200) {
            // const { data, totalCount } = response.data.data;
            set({
              bookings: response.data.data.data,
              totalCount: response.data.totalCount,
              isLoading: false,
            });
          } else {
            set({ error: response.message, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
        }
      },

      fetchCurrentBookingDetailsByBookingId: async (bookingId) => {
        set({ isFetchCurrentBookingDetailsLoading: true });
        try {
          const response = await apiService.get(
            `${API_ENDPOINTS.MASTERS.BOOKING.GET_BOOKINGS_BOOKING_ID}/${bookingId}`
          );
          // Ensure correct setting of the bookingDetails state
          set({
            isFetchCurrentBookingDetailsLoading: false,
          });
          return { success: true, data: response };
        } catch (error) {
          set({ isFetchCurrentBookingDetailsLoading: false });
          return { success: false };
        }
      },

      // Save Facility details
      saveBookingDetails: async (bookingDetailsPayload) => {
        set({ isSaveBookingDetailsLoading: true });
        try {
          const url = API_ENDPOINTS.MASTERS.BOOKING.ADD_BOOKINGS;
          const method = "post";

          const response = await apiService[method](url, bookingDetailsPayload);

          set({
            facilityCreateResponse: { response },
            FacilityDetails: response.data,
            isSaveBookingDetailsLoading: false,
          });
          return { success: true, data: response };
        } catch ({ error, xhr }) {
          // handleApiError(xhr);

          set({
            saveBookingDetailsError: error.response.data.message,
            isSaveBookingDetailsLoading: false,
          });
          return { error: error.response.data.message };
          throw error;
        }
      },
      // first setp of transction

      saveFirstBookingDetails: async (FirstStepTransactionPayload) => {
        set({ IsFirstStepTransaction: false });
        try {
          const url = API_ENDPOINTS.MASTERS.BOOKING.FIRST_STEP_TRANSACTION;
          const method = "post";

          const response = await apiService[method](
            url,
            FirstStepTransactionPayload
          );

          if (response.status != 205) {
            set({
              FirstStepTransactionResponse: response.data.data,
              IsFirstStepTransaction: true,
            });
          }

          return { success: true, data: response };
        } catch (error) {
          // set({
          //   saveBookingDetailsError: error.message,
          //   isSaveBookingDetailsLoading: false,
          // });
          throw error;
        }
      },

      VerifyPaymentStatus: async (OrderId) => {
        // set({ IsFirstStepTransaction: false });
        try {
          const url = `${API_ENDPOINTS.MASTERS.BOOKING.GET_PAYMENT_STATUS}${OrderId}`;
          const method = "post";

          const response = await apiService[method](url);

          set({
            PaymentStatus: response.data.data,
            // IsFirstStepTransaction:true
          });
          return { success: true, data: response };
        } catch (error) {
          // set({
          //   saveBookingDetailsError: error.message,
          //   isSaveBookingDetailsLoading: false,
          // });
          throw error;
        }
      },

      // Complete bookings
      fetchCompleteBookingsReport: async (
        // pageIndex = 1, pageSize = 10, filters = {},
        payload
      ) => {
        set({ isCompleteBookingsReportsLoading: true });
        try {
          const url =
            API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_COMPLETE_BOOKINGS;
          const method = "post";
          const response = await apiService[method](url, payload);
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

      // Payment transactions
      fetchPaymentTransactions: async (payload) => {
        set({ isTransactionPaymentReportsLoading: true });
        try {
          const url =
            API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_TRANSACTION_PAYMENT;
          const method = "post";
          const response = await apiService[method](url, payload);
          set({
            allTransactionPaymentReports: response.data,
            isTransactionPaymentReportsLoading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            isTransactionPaymentReportsLoading: false,
          });
        }
      },
    }),
    {
      name: "booking-process-store",
      getStorage: () => localStorage,
      partialize: (state) => ({
        selectedBookingsList: state.selectedBookingsList,
      }),
    }
  )
);
