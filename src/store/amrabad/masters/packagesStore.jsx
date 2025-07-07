import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const usePackagesStore = create((set) => ({
  PackagesWithRooms: [],
  GetAllPackages: [],
  isPackagesWithRoomsLoading: false,
  isSaveBookingDetailsLoading: false,
  isGetAllPackagesLoading: false,
  isSaveHouseDetailsLoading: false,
  HouseDetails: {},
  houseEditDetails: {},
  saveHouseDetailsError: null,
  isSavePackageWithRoomLoading: false,
  isUpdatePackageLoading: false,

  setHouseEditDetails: (houseEditDetails) => {
    set({ houseEditDetails });
  },
  setHouseDetails: (newHouseDetails) => {
    set({ HouseDetails: newHouseDetails });
  },

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
  // Save House
  saveHouseDetails: async (houseDetailsPayload, isUpdate = false) => {
    set({ isSaveHouseDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.AMRABAD.MASTERS.UPDATE_HOUSE
        : API_ENDPOINTS.AMRABAD.MASTERS.ADD_HOUSE;
      const method = isUpdate ? "put" : "post";
      const response = await apiService[method](url, houseDetailsPayload);
      set({
        isSaveHouseDetailsLoading: false,
      });
      set({ houseEditDetails: {} });
      return { success: true, data: response };
    } catch ({ error }) {
      set({
        saveHouseDetailsError: error.message,
        isSaveHouseDetailsLoading: false,
      });
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
        isGetAllPackagesLoading: false,
      });
    }
  },
  // save package with rooms
  savePackageWithRoom: async (PackageWithRoomPayload, isUpdate = false) => {
    set({ isSavePackageWithRoomLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.AMRABAD.MASTERS.UPDATE_PACKAGE
        : API_ENDPOINTS.AMRABAD.MASTERS.ADD_PACKAGE_WITH_ROOM;
      const method = isUpdate ? "put" : "post";
      const response = await apiService[method](url, PackageWithRoomPayload);
      set({
        isSavePackageWithRoomLoading: false,
      });
      return { success: true, data: response };
    } catch ({ error }) {
      set({
        saveHouseDetailsError: error.message,
        isSavePackageWithRoomLoading: false,
      });
      throw error;
    }
  },

  // Update Packages
  UpdatePackage: async (PackagePayload) => {
    set({ isUpdatePackageLoading: true });
    try {
      const url = API_ENDPOINTS.AMRABAD.MASTERS.UPDATE_PACKAGE;
      const method = "put";
      const response = await apiService[method](url, PackagePayload);
      set({
        isUpdatePackageLoading: false,
      });
      return { success: true, data: response.data };
    } catch ({ error }) {
      set({
        saveHouseDetailsError: error.message,
        isUpdatePackageLoading: false,
      });
      throw error;
    }
  },
}));
