import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useDepartmentTypesStore = create((set) => ({
  allDepartmentTypes: [],
  isFetchAllDepartmentTypesLoading: false,
  allFacilityServices: {},
  isSaveDepartmentTypeDetailsLoading: false,
  saveDepartmentTypeDetailsError: null,
  DepartmentTypeDetails: {},
  departmentTypeEditDetails: {},
  isFetchCurrentDepartmentTypeDetailsLoading: false,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  setDepartmentTypeDetails: (newDepartmentTypeDetails) => {
    set({ DepartmentTypeDetails: newDepartmentTypeDetails });
  },

  setDepartmentTypeEditDetails: (departmentTypeEditDetails) => {
    set({ departmentTypeEditDetails });
  },

  // Fetch all DepartmentTypes
  fetchAllDepartmentTypes: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllDepartmentTypesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.GET_DEPARTMENT_TYPES}`
      );
      set({
        allDepartmentTypes: response.data,
        isFetchAllDepartmentTypesLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllDepartmentTypesLoading: false });
    }
  },

  fetchCurrentDepartmentTypeDetailsByDepartmentTypeId: async (
    DepartmentTypeId
  ) => {
    set({ isFetchCurrentDepartmentTypeDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.DepartmentType.GET_DepartmentTypeS_DepartmentType_ID}/${DepartmentTypeId}`
      );
      // Ensure correct setting of the DepartmentTypeDetails state
      set({
        isFetchCurrentDepartmentTypeDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({
        error: error.message,
        isFetchCurrentDepartmentTypeDetailsLoading: false,
      });
      return { success: false };
    }
  },

  // Save Facility details
  saveDepartmentTypeDetails: async (
    DepartmentTypeDetailsPayload,
    isUpdate = false
  ) => {
    set({ isSaveDepartmentTypeDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.UPDATE_DEPARTMENT_TYPE
        : API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.ADD_DEPARTMENT_TYPE;
      const method = isUpdate ? "put" : "post";
      let response;
      if (isUpdate) {
        response = await apiService[method](url, DepartmentTypeDetailsPayload);
      } else {
        response = await apiService[method](url, DepartmentTypeDetailsPayload);
      }

      set({
        // departmentCreateResponse: { response },
        // departmentDetails: response.data,
        isSaveDepartmentTypeDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({
        saveDepartmentTypeDetailsError: error.message,
        isSaveDepartmentTypeDetailsLoading: false,
      });
      throw error;
    }
  },
}));
