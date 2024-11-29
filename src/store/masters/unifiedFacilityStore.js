import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useUnifiedFacilityStore = create((set) => ({
  allUnifiedFacilities: [],
  isSaveUnifiedFacilityDetailsLoading: false,
  isFetchUnifiedFacilityDetailsLoading: false,
  isFetchAllUnifiedFacilitiesLoading: false,
  fetchFacilityDetailsError: null,
  ifetchAllUnifiedFacilitiesError: null,
  unifiedFacilityCreateResponse: {},
  unifiedFacilityEditDetails: {},

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Facilities
  fetchAllUnifiedFacilities: async () => {
    set({ isFetchAllUnifiedFacilitiesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.GET_ALL}`
      );

      set({
        allUnifiedFacilities: response.data,
        isFetchAllUnifiedFacilitiesLoading: false,
      });
    } catch (error) {
      set({
        ifetchAllUnifiedFacilitiesError: error.message,
        isFetchAllUnifiedFacilitiesLoading: false,
      });
    }
  },

  setCurrentFacilityEditDetails: (FacilityEditDetails) => {
    // console.log("FacilityEditDetails",FacilityEditDetails)
    set({
      FacilityEditDetails,
    });
  },

  // Save Facility details
  saveunifiedFacilityDetails: async (FacilityData) => {
    set({ isSaveFacilityDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.CREATE;
      const method = "post";

      const response = await apiService[method](url, FacilityData);

      set({
        facilityCreateResponse: { response },
        FacilityDetails: response.data,
        isSaveFacilityDetailsLoading: false,
        success: "Facility saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isSaveFacilityDetailsLoading: false });
      throw error;
    }
  },
}));
