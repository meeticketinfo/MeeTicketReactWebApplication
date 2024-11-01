import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useParkStore = create((set) => ({
  allParks: [],
  ParkDetails: [],
  isSaveParkDetailsLoading: false,
  isFetchParkDetailsLoading: false,
  isFetchAllParksLoading: false,
  fetchParkDetailsError: null,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all parks
  fetchAllParks: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllParksLoading: true });
    try {
      //   const filterString = useParkStore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_PARKS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.PARK.GET_PARKS}`
      );
      console.log(response);

      set({
        allParks: response.data,
        isFetchAllParksLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllParksLoading: false });
    }
  },

  // Fetch park details
  fetchParkDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchParkDetailsLoading: true });
    try {
      const filterString = useParkStore.getState().serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.PARK.GET_PARK_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );

      set({
        ParkDetails: response.data,
        isFetchParkDetailsLoading: false,
        success: "Park details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchParkDetailsError: error.message,
        isFetchParkDetailsLoading: false,
      });
    }
  },

  // Save park details
  saveParkDetails: async (ParkData, isUpdate = false) => {
    set({ isSaveParkDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.PARK.UPDATE_PARK_DETAILS
        : API_ENDPOINTS.MASTERS.PARK.ADD_NEW_PARK;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, ParkData);

      set({
        ParkDetails: response.data,
        isSaveParkDetailsLoading: false,
        success: "Park saved successfully.",
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.message, isSaveParkDetailsLoading: false });
      throw error;
    }
  },
}));
