import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const usePaymentStore = create((set) => ({
  allPayments: [],
  PaymentDetails: [],
  isSavePaymentDetailsLoading: false,
  isFetchPaymentDetailsLoading: false,
  isFetchAllPaymentLoading: false,
  fetchPaymentDetailsError: null,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Payments
  fetchAllPayments: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllPaymentLoading: true });
    try {
      //   const filterString = useFacilitiestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Facility.GET_Facilities}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.PAYMENTS.GET_PAYMENTS}`
      );
      console.log(response);

      set({
        allPayments: response.data,
        isFetchAllPaymentLoading: false,
      });
    } catch (error) {
      set({ isFetchAllPaymentLoading: false });
    }
  },

  // Fetch Facility details
  fetchFacilityDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchPaymentDetailsLoading: true });
    try {
      const filterString = usePaymentStore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.Facility.GET_Facility_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );

      set({
        PaymentDetails: response.data,
        isFetchPaymentDetailsLoading: false,
        success: "Facility details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchPaymentDetailsError: error.message,
        isFetchPaymentDetailsLoading: false,
      });
    }
  },

  // Save Facility details
  saveFacilityDetails: async (FacilityData, isUpdate = false) => {
    set({ isSavePaymentDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.Facility.UPDATE_Facility_DETAILS
        : API_ENDPOINTS.MASTERS.FACILITY.ADD_NEW_FACILITY;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, FacilityData);

      set({
        PaymentDetails: response.data,
        isSavePaymentDetailsLoading: false,
        success: "Facility saved successfully.",
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isSavePaymentDetailsLoading: false });
      throw error;
    }
  },
}));
