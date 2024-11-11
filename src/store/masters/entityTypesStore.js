import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useEntityTypesStore = create((set) => ({
  allEntityTypes: [],
  isFetchAllEntityTypesLoading: false,
  allFacilityServices: {},
  isSaveEntityTypeDetailsLoading: false,
  saveEntityTypeDetailsError: null,
  EntityTypeDetails: {},
  isFetchCurrentEntityTypeDetailsLoading: false,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  setEntityTypeDetails: (newEntityTypeDetails) => {
    set({ EntityTypeDetails: newEntityTypeDetails });
  },

  // Fetch all EntityTypes
  fetchAllEntityTypes: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllEntityTypesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.ENTITY_TYPE.GET_ENTITY_TYPES}`
      );
      set({
        allEntityTypes: response.data,
        isFetchAllEntityTypesLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllEntityTypesLoading: false });
    }
  },

  fetchCurrentEntityTypeDetailsByEntityTypeId: async (EntityTypeId) => {
    set({ isFetchCurrentEntityTypeDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.EntityType.GET_EntityTypeS_EntityType_ID}/${EntityTypeId}`
      );
      // Ensure correct setting of the EntityTypeDetails state
      set({
        isFetchCurrentEntityTypeDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        error: error.message,
        isFetchCurrentEntityTypeDetailsLoading: false,
      });
      return { success: false };
    }
  },

  // Save Facility details
  saveEntityTypeDetails: async (EntityTypeDetailsPayload) => {
    set({ isSaveEntityTypeDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.EntityType.ADD_EntityTypeS;
      const method = "post";

      const response = await apiService[method](url, EntityTypeDetailsPayload);

      set({
        facilityCreateResponse: { response },
        FacilityDetails: response.data,
        isSaveEntityTypeDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        saveEntityTypeDetailsError: error.message,
        isSaveEntityTypeDetailsLoading: false,
      });
      throw error;
    }
  },
}));
