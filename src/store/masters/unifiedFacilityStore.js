import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useUnifiedFacilityStore = create((set) => ({
  allUnifiedFacilities: [],
  isSaveUnifiedFacilityDetailsLoading: false,
  isFetchUnifiedFacilityDetailsLoading: false,
  isFetchAllUnifiedFacilitiesLoading: false,
  isCreateServiceEnabled: false,
  isCreateServiceVariantEnabled: false,
  fetchFacilityDetailsError: null,
  fetchAllUnifiedFacilitiesError: null,
  saveUnifiedFacilityDetailsError: null,
  unifiedFacilityCreateResponse: {},
  unifiedFacilityEditDetails: {},

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Facilities
  fetchAllUnifiedFacilities: async (role) => {
    const LocationId = localStorage.getItem("locationid");
    set({ isFetchAllUnifiedFacilitiesLoading: true });
    try {
      console.log(API_ENDPOINTS.MASTERS);

      const url =
        role === "ROLE_NODALOFFICER"
          ? `${API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.GET_ALL_BY_ID}?parkId=${LocationId}`
          : `${API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.GET_ALL}`;
      const response = await apiService.get(url);
      console.log(response);
      set({
        allUnifiedFacilities: response.data,
        isFetchAllUnifiedFacilitiesLoading: false,
      });
    } catch (error) {
      set({
        fetchAllUnifiedFacilitiesError: error.message,
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
  saveunifiedFacilityDetails: async (FacilityData, role) => {
    set({ isSaveUnifiedFacilityDetailsLoading: true });

    try {
      // const url = API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.CREATE;
      const url =
        role === "ROLE_NODALOFFICER"
          ? API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.CREATE_BY_ID
          : API_ENDPOINTS.MASTERS.UNIFIED_FACILITY.CREATE;
      const method = "post";
      
      const response = await apiService[method](url, FacilityData);

      set({
        facilityCreateResponse: { response },
        isSaveUnifiedFacilityDetailsLoading: false,
        success: "Facility Details saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        saveUnifiedFacilityDetailsError: error.message,
        isSaveUnifiedFacilityDetailsLoading: false,
      });
      throw error;
    }
  },
  setIsCreateServiceEnabled: (isCreateServiceEnabled) => {
    set({
      isCreateServiceEnabled,
    });
  },
  setIsCreateServiceVariantEnabled: (isCreateServiceVariantEnabled) => {
    set({
      isCreateServiceVariantEnabled,
    });
  },
}));
