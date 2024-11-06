import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useHolidayStore = create((set, get) => ({
  allHolidays: [],
  HolidayDetails: [],
  isSaveHolidayDetailsLoading: false,
  isFetchHolidayDetailsLoading: false,
  isFetchAllHolidaysLoading: false,
  fetchHolidayDetailsError: null,
  error: null,
  success: null,

  // Helper to convert filters object to query string
  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all holidays with optional pagination and filters
  fetchAllHolidays: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllHolidaysLoading: true });
    try {
      const filterString = get().serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.Holiday.GET_HOLIDAYS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );
      set({
        allHolidays: response.data,
        isFetchAllHolidaysLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllHolidaysLoading: false });
    }
  },

  // Fetch specific holiday details with pagination and filters
  fetchHolidayDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchHolidayDetailsLoading: true });
    try {
      const filterString = get().serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.Holiday.GET_HOLIDAY_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );
      set({
        HolidayDetails: response.data,
        isFetchHolidayDetailsLoading: false,
        success: "Holiday details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchHolidayDetailsError: error.message,
        isFetchHolidayDetailsLoading: false,
      });
    }
  },

  // Save holiday details (add or update)
  saveHolidayDetails: async (HolidayData, isUpdate = false) => {
    set({ isSaveHolidayDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.HOLIDAY.UPDATE_HOLIDAY_DETAILS
        : API_ENDPOINTS.MASTERS.HOLIDAY.ADD_NEW_HOLIDAY;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, HolidayData);
      set({
        HolidayDetails: response.data,
        isSaveHolidayDetailsLoading: false,
        success: "Holiday saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isSaveHolidayDetailsLoading: false });
      throw error;
    }
  },
}));
