import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";



export const usePackagesStore = create((set) => ({
  PackagesWithRooms: [],
  isPackagesWithRoomsLoading: false,

  // Save Facility details
  fetchPackagesWithRooms: async () => {
    set({ isPackagesWithRoomsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.MASTERS.GET_PACKAGES_WITH_ROOMS}`
      );

      set({
        PackagesWithRooms: response.data,
        isPackagesWithRoomsLoading: false,
      });
    } catch (error) {
      set({
        isPackagesWithRoomsLoading: false,
      });
    }
  },
}));
