import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useHolidayStore = create((set, get) => ({
  allHolidays: [],
  HolidayDetails: [],
  isSaveHolidayDetailsLoading: false,
  isSaveRecurringHolidayDetailsLoading: false,
  isFetchHolidayDetailsLoading: false,
  isFetchAllHolidaysLoading: false,
  fetchHolidayDetailsError: null,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  fetchAllHolidays: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllHolidaysLoading: true });
    try {
      const filterString = get().serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.HOLIDAY.GET_HOLIDAYS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );
      set({
        allHolidays: response.data,
        isFetchAllHolidaysLoading: false,
      });
      console.log(allHolidays,'holidays') 
    } catch (error) { 
      set({ error: error.message, isFetchAllHolidaysLoading: false });
    }
  },


// Save  recurring holiday details (add or update)
saveRecurringHolidayDetails: async (HolidayData) => {
  set({ isSaveRecurringHolidayDetailsLoading: true });
  try {
    const url = API_ENDPOINTS.MASTERS.HOLIDAY.ADD_NEW_RECURRING_HOLIDAY 

    const response = await apiService.post(url, HolidayData);
    set({
      HolidayDetails: response.data,
      isSaveRecurringHolidayDetailsLoading: false,
      success: "Holiday saved successfully.",
    });
    return { success: true, data: response };
  } catch (error) {
    set({ error: error.message, isSaveRecurringHolidayDetailsLoading: false });
    throw error;
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
