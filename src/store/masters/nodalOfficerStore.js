import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useNodalOfficerStore = create((set) => ({
  allNodalOfficers: [],
  NodalOfficerDetails: [],
  isSaveNodalOfficersDetailsLoading: false,
  isFetchNodalOfficerDetailsLoading: false,
  isFetchAllNodalOfficersLoading: false,
  fetchNodalOfficersDetailsError: null,
  error: null,
  success: null,
  NodalOfficersEditDetails: {},
  allNodalOfficerParks: [],
  isFetchAllNodalOfficerParksLoading: false,
  isFetchAllNodalOfficerLocaionAdminsLoading: false,
  allNodalOfficerLocaionAdmins: [],

  setCurrentNodalOfficerEditDetails: (NodalOfficersEditDetails) => {
    console.log("nodalOfficersEditDetails", NodalOfficersEditDetails);
    set({
      NodalOfficersEditDetails,
    });
  },

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Nodal Officers
  fetchAllNodalOfficers: async (filters = {}) => {
    set({ isFetchAllNodalOfficersLoading: true });
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.fromDate) {
        queryParams.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        queryParams.append('toDate', filters.toDate);
      }
      if (filters.mobileNumber) {
        queryParams.append('mobileNumber', filters.mobileNumber);
      }
      
      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_NODAL_OFFICERS}?${queryString}`
        : API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_NODAL_OFFICERS;
        
      const response = await apiService.get(url);
      console.log(response);

      set({
        allNodalOfficers: response.data,
        isFetchAllNodalOfficersLoading: false,
      });
    } catch (error) {
      set({ isFetchAllNodalOfficersLoading: false });
    }
  },
  // Fetch all Nodal Officers
  fetchAllNodalOfficerParks: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {},
    userId
  ) => {
    set({ isFetchAllNodalOfficerParksLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_ENTITIES}?userId=${userId}`
      );

      set({
        allNodalOfficerParks: response.data,
        isFetchAllNodalOfficerParksLoading: false,
      });
    } catch (error) {
      set({ isFetchAllNodalOfficerParksLoading: false });
    }
  },
  fetchAllNodalOfficerLocationAdmins: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllNodalOfficerLocaionAdminsLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_LOCATION_ADMINS}`
      );

      set({
        allNodalOfficerLocaionAdmins: response.data,
        isFetchAllNodalOfficerLocaionAdminsLoading: false,
      });
    } catch (error) {
      set({
        
        isFetchAllNodalOfficerLocaionAdminsLoading: false,
      });
    }
  },

  // Save Nodal Officers details
  saveNodalOfficerDetails: async (values, isUpdate = false) => {
    set({ isSaveNodalOfficersDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.NODAL_OFFICERS.UPDATE_NODAL_OFFICERS_DETAILS
        : API_ENDPOINTS.MASTERS.NODAL_OFFICERS.ADD_NEW_NODAL_OFFICERS;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, values);

      set({
        ServiceDetails: response.data,
        isSaveNodalOfficersDetailsLoading: false,
        success: "Nodal Officer saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveNodalOfficersDetailsLoading: false });
      throw error;
    }
  },
}));
