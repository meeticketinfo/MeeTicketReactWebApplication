import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const GET_LOCATION_DETAILS = "/Master/GetLocationById/";
export const useFacilityStore = create((set) => ({
  allFacilities: [],
  adminFacilities: [],
  FacilityDetails: [],
  isSaveFacilityDetailsLoading: false,
  isFetchFacilityDetailsLoading: false,
  isFetchAllFacilitiesLoading: false,
  isFetchAllAdminFacilitiesLoading: false,
  fetchFacilityDetailsError: null,
  error: null,
  success: null,
  facilityCreateResponse: {},
  FacilityEditDetails: {},
  LocationDetails: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Facilities
  fetchAllFacilities: async (
    // pageIndex = 1,
    //  pageSize = 10,
    //   filters = {}
    role
  ) => {
    const LocationId = localStorage.getItem("locationid");
    set({ isFetchAllFacilitiesLoading: true });
    try {
      //   const filterString = useFacilitiestore.getState().serializeFilters(filters);
      const url =
        role === "ROLE_NODALOFFICER"
          ? `${API_ENDPOINTS.MASTERS.FACILITY.GET_FACILITIES_NODAL_OFFICER}${LocationId}`
          : `${API_ENDPOINTS.MASTERS.FACILITY.GET_FACILITIES}`;
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Facility.GET_Facilities}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        url
      );
     

      set({
        allFacilities: response.data,
        isFetchAllFacilitiesLoading: false,
      });
    } catch (error) {
      set({ isFetchAllFacilitiesLoading: false });
    }
  },

  fetchAllDropdownFacilities: async (
    // pageIndex = 1,
    // pageSize = 10,
    // filters = {},
    role
  ) => {
    const LocationId = localStorage.getItem("locationid");
    set({ isFetchAllAdminFacilitiesLoading: true });
    try {
      //   const filterString = useFacilitiestore.getState().serializeFilters(filters);
      const url =
        role === "ROLE_NODALOFFICER"
          ? `${API_ENDPOINTS.MASTERS.FACILITY.FACILITIES_DROPDOWN_BY_ID}${LocationId}`
          : `${API_ENDPOINTS.MASTERS.FACILITY.FACILITIES_DROPDOWN}`;

      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Facility.GET_Facilities}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        url
      );
    

      set({
        adminFacilities: response.data,
        isFetchAllAdminFacilitiesLoading: false,
      });
    } catch (error) {
      set({ isFetchAllAdminFacilitiesLoading: false });
    }
  },

  FetchLocationDetails: async (LocationId) => {
    try {
      const response = await apiService.get(
        `${GET_LOCATION_DETAILS}${LocationId}`
      );
     

      set({
        LocationDetails: response.data,
      });
    } catch (error) {}
  },

  // Fetch Facility details
  fetchFacilityDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchFacilityDetailsLoading: true });
    try {
      const filterString = useFacilitiestore
        .getState()
        .serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.FACILITY.GET_Facility_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
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

  setCurrentFacilityEditDetails: (FacilityEditDetails) => {
   
    set({
      FacilityEditDetails,
    });
  },

  // Save Facility details
  saveFacilityDetails: async (FacilityData, isUpdate = false, role) => {
    set({ isSaveFacilityDetailsLoading: true });
    try {
      const url = isUpdate
        ? role === "ROLE_NODALOFFICER"
          ? API_ENDPOINTS.MASTERS.FACILITY.UPDATE_FACILITY_DETAILS_NODAL_OFFICER
          : API_ENDPOINTS.MASTERS.FACILITY.UPDATE_FACILITY_DETAILS
        : API_ENDPOINTS.MASTERS.FACILITY.ADD_NEW_FACILITY;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, FacilityData);
     
      set({
        facilityCreateResponse: { response },
        FacilityDetails: response.data,
        isSaveFacilityDetailsLoading: false,
        success: "Facility saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveFacilityDetailsLoading: false });
      throw error;
    }
  },
}));
