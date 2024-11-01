import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const usePaymentsStore = create((set) => ({
  allPayments: [],
  isFetchAllPaymentsLoading: false,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Payments
  fetchAllPayments: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllPaymentsLoading: true });
    try {
      //   const filterString = usePaymentstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Payments}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.Payment.GET_PAYMENTS}`
      );
      console.log(response);

      set({
        allPayments: response.data,
        isFetchAllPaymentsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllPaymentsLoading: false });
    }
  },
}));
