import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useFacilityStore = create((set) => ({
  allFacilities: [],
  FacilityDetails: [],
  isSaveFacilityDetailsLoading: false,
  isFetchFacilityDetailsLoading: false,
  isFetchAllFacilitiesLoading: false,
  fetchFacilityDetailsError: null,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Facilities
  fetchAllFacilities: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllFacilitiesLoading: true });
    try {
      //   const filterString = useFacilitiestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Facility.GET_Facilities}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.FACILITY.GET_FACILITIES}`
      );
      console.log(response);

      set({
        allFacilities: response.data,
        isFetchAllFacilitiesLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllFacilitiesLoading: false });
    }
  },

  // Fetch Facility details
  fetchFacilityDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchFacilityDetailsLoading: true });
    try {
      const filterString = useFacilitiestore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.Facility.GET_Facility_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );

      set({
        FacilityDetails: response.data,
        isFetchFacilityDetailsLoading: false,
        success: "Facility details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchFacilityDetailsError: error.message,
        isFetchFacilityDetailsLoading: false,
      });
    }
  },

  // Save Facility details
  saveFacilityDetails: async (FacilityData, isUpdate = false) => {
    set({ isSaveFacilityDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.Facility.UPDATE_Facility_DETAILS
        : API_ENDPOINTS.MASTERS.Facility.ADD_NEW_Facility;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, FacilityData);

      set({
        FacilityDetails: response.data,
        isSaveFacilityDetailsLoading: false,
        success: "Facility saved successfully.",
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.message, isSaveFacilityDetailsLoading: false });
      throw error;
    }
  },
}));
