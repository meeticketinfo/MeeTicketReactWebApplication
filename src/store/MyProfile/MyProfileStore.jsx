import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMyProfileStore = create((set) => ({
  isFetchMyProfileDetailsLoading: false,
  ProfileDetails: [],
  PaymentDetails: [],

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch My Profile Details
  fetchMyProfileDetails: async () => {
    set({ isFetchMyProfileDetailsLoading: true });
    try {
      const filterString = useMyProfileStore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.GET_PROFILES}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );
      set({
        ProfileDetails: response.data,
        isFetchMyProfileDetailsLoading: false,
      });
    } catch (error) {
      set({
        fetchPaymentDetailsError: error.message,
        isFetchMyProfileDetailsLoading: false,
      });
    }
  },

}));
