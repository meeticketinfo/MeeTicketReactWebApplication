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

  setCurrentNodalOfficerEditDetails: (NodalOfficersEditDetails) => {
    console.log("nodalOfficersEditDetails",NodalOfficersEditDetails)
    set({
        NodalOfficersEditDetails,
    });
  },

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Nodal Officers
  fetchAllNodalOfficers: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllNodalOfficersLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_NODAL_OFFICERS}`
      );
      console.log(response);

      set({
        allNodalOfficers: response.data,
        isFetchAllNodalOfficersLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllNodalOfficersLoading: false });
    }
  },


  // Save Nodal Officers details
  saveNodalOfficerDetails: async (ServiceData, isUpdate = false) => {
    set({ isSaveNodalOfficersDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.NODAL_OFFICERS.UPDATE_NODAL_OFFICERS_DETAILS
        : API_ENDPOINTS.MASTERS.NODAL_OFFICERS.ADD_NEW_NODAL_OFFICERS;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, ServiceData);

      set({
        ServiceDetails: response.data,
        isSaveNodalOfficersDetailsLoading: false,
        success: "Nodal Officer saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isSaveNodalOfficersDetailsLoading: false });
      throw error;
    }
  },
}));
