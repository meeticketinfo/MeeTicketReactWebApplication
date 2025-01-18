import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useParkAdminStore = create((set) => ({
  allParkAdmins: [],
  isSaveParkAdminDetailsLoading: false,
  isFetchAllParkAdminsLoading: false,
  allScannedParkAdmins: [],
  isFetchAllScannedParkAdminsLoading: false,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  fetchAllParkAdmins: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllParkAdminsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.PARK_ADMIN.GET_PARK_ADMINS}`
      );
      set({
        allParkAdmins: response.data,
        isFetchAllParkAdminsLoading: false,
      });
    } catch (error) {
      set({ isFetchAllParkAdminsLoading: false });
    }
  },
}));
