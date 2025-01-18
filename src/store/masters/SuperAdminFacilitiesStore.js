import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useAdminFacilityStore = create((set) => ({
  
  AdminFacilityDetails: [],
  isSaveAdminFacilityDetailsLoading: false,
  isFetchAllAdminFacilitiesLoading: false,
  fetchAdminFacilitiesDetailsError: null,
  error: null,
  success: null,
  adminFacilityCreateResponse: {},
    AdminFacilityEditDetails: {},

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch All Admin Facilities details
  fetchAllAdminFacilitiesDetails: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {},
    
  ) => {
   
    set({ isFetchAllAdminFacilitiesLoading: true });
    try {
      const filterString = useAdminFacilityStore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.FACILITY.ADMIN_GET_FACILITIES}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );

      set({
        AdminFacilitiesDetails: response.data,
        isFetchAllAdminFacilitiesLoading: false,
        success: "Admin Facilities details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchAdminFacilitiesDetailsError: error.message,
        isFetchAllAdminFacilitiesLoading: false,
      });
    }
  },
  setCurrentAdminFacilityEditDetails: (AdminFacilityEditDetails) => {
    console.log("FacilityEditDetails",AdminFacilityEditDetails)
    set({
        AdminFacilityEditDetails,
    });
  },

  // Save Facility details
  saveAdminFacilityDetails: async (FacilityData, isUpdate = false) => {
    set({ isSaveFacilityDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.FACILITY.ADMIN_UPDATE_FACILITIES
        : API_ENDPOINTS.MASTERS.FACILITY.ADMIN_ADD_FACILITIES;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, FacilityData);
      // console.log("response istunnava :", response)
      set({
        adminFacilityCreateResponse: { response },
        // AdminFacilitiesDetails: response.data,
        isSaveAdminFacilityDetailsLoading: false,
        success: "Facility saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveAdminFacilityDetailsLoading: false });
      throw error;
    }
  },
}));
