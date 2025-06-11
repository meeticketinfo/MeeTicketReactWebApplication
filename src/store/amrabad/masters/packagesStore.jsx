import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const usePackagesStore = create((set) => ({
  PackagesWithRooms: [],
  GetAllPackages:[],
  isPackagesWithRoomsLoading: false,
  isSaveBookingDetailsLoading: false,
  isGetAllPackagesLoading:false,
  saveHouseDetailsError: null,
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
  saveHouseDetails: async (houseDetailsPayload) => {
    set({ isSaveHouseDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.AMRABAD.MASTERS.ADD_HOUSE;
      const method = "post";
      const response = await apiService[method](url, houseDetailsPayload);
      return { success: true, data: response };
    } catch ({ error, xhr }) {
      set({
        saveHouseDetailsError: error.response.data.message,
        isSaveHouseDetailsLoading: false,
      });
      return { error: error.response.data.message };
      throw error;
    }
  },
  fetchGetAllPackages: async () => {
    set({ isGetAllPackagesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.MASTERS.GET_ALL_PACKAGES}`
      );

      set({
        GetAllPackages: response.data,
        isGetAllPackagesLoading: false,
      });
    } catch (error) {
      set({
        isPackagesWithRoomsLoading: false,
      });
    }
  },
}));
