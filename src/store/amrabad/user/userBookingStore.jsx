import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useUserBookingStore = create((set) => ({
  GetUserPackages: [],
  isUserPackagesLoading: false,

  fetchUserPackages: async () => {
    set({ isUserPackagesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_USER_PACKAGES}`
      );

      set({
        GetUserPackages: response.data,
        isUserPackagesLoading: false,
      });
    } catch (error) {
      set({
        isUserPackagesLoading: false,
      });
      toast(error.message||"Some thing went wrong")
    }
  },
}));
