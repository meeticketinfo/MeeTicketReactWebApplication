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

  // Save park details
  saveParkDetails: async (ParkData, isUpdate = false) => {
    set({ isSaveParkDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.PARK.UPDATE_PARK_DETAILS
        : API_ENDPOINTS.MASTERS.PARK.ADD_NEW_PARK;

      // Prepare form data
      const formData = {
        Name: ParkData.Name,
        DisplayName: ParkData.DisplayName,
        street1: ParkData.street1,
        street2: ParkData.street2,
        street3: ParkData.street3,
        landmark: ParkData.landmark,
        city: ParkData.city,
        state: ParkData.state,
        country: ParkData.country,
        zipCode: ParkData.zipCode,
        longitude: ParkData.longitude,
        latitude: ParkData.latitude,
        description: ParkData.description,
        parkSize: ParkData.parkSize,
        isActive: ParkData.isActive,
        ImageUrl: ParkData.imageUrl, // Add image URL or any other file here
      };

      // Use uploadFile for multipart/form-data with any additional data
      const response = await apiService.uploadFile(
        url,
        ParkData.file,
        formData
      );

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
