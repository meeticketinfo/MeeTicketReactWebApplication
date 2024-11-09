import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useMyProfileStore = create((set) => ({
  isFetchMyProfileDetailsLoading: false,
  ProfileDetails: [],
  fetchProfileDetailsError: null,
  error: null,
  success: null,

  // Fetch My Profile Details
  fetchMyProfileDetails: async (id) => {
    set({ isFetchMyProfileDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.MY_PROFILE.GET_PROFILES}/${id}`
      );
      set({
        ProfileDetails: response.data,
        isFetchMyProfileDetailsLoading: false,
      });
      console.log(response.data, 'details from profile');
    } catch (error) {
      set({
        fetchProfileDetailsError: error.message,
        isFetchMyProfileDetailsLoading: false,
      });
    }
  },
}));
