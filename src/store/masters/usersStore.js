import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useUsersStore = create((set) => ({
  allUsers: [],
  isFetchAllUsersLoading: false,
  allScannedUsers: [],
  isFetchAllScannedUsersLoading: false,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Bookings
  fetchAllUsers: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllUsersLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.USER.GET_USERS}`
      );
      console.log(response);

      set({
        allUsers: response.data,
        isFetchAllUsersLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllUsersLoading: false });
    }
  },
  // Fetch all Bookings
  fetchAllScannedUsers: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllScannedUsersLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.SCANNED_USER.GET_SCANNED_USERS}`
      );
      console.log(response);

      set({
        allScannedUsers: response.data,
        isFetchAllScannedUsersLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllScannedUsersLoading: false });
    }
  },
}));
