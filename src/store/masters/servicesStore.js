import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useServiceStore = create((set) => ({
  allServices: [],
  ServiceDetails: [],
  isSaveServiceDetailsLoading: false,
  isFetchServiceDetailsLoading: false,
  isFetchAllServicesLoading: false,
  fetchServiceDetailsError: null,
  error: null,
  success: null,
  ServiceEditDetails: {},

  setCurrentServiceEditDetails: (ServiceEditDetails) => {
    console.log("serviceEditDetails",ServiceEditDetails)
    set({
      ServiceEditDetails,
    });
  },

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Services
  fetchAllServices: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllServicesLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.SERVICE.GET_SERVICES}`
      );
      console.log(response);

      set({
        allServices: response.data,
        isFetchAllServicesLoading: false,
      });
    } catch (error) {
      set({  isFetchAllServicesLoading: false });
    }
  },

  // Fetch Service details
  fetchServiceDetails: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchServiceDetailsLoading: true });
    try {
      const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.SERVICE.GET_Service_DETAILS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
      );

      set({
        ServiceDetails: response.data,
        isFetchServiceDetailsLoading: false,
        success: "Service details fetched successfully.",
      });
    } catch (error) {
      set({
        fetchServiceDetailsError: error.message,
        isFetchServiceDetailsLoading: false,
      });
    }
  },

  // Save Service details
  saveServiceDetails: async (ServiceData, isUpdate = false) => {
    set({ isSaveServiceDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.SERVICE.UPDATE_SERVICE_DETAILS
        : API_ENDPOINTS.MASTERS.SERVICE.ADD_NEW_SERVICE;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, ServiceData);

      set({
        ServiceDetails: response.data,
        isSaveServiceDetailsLoading: false,
        success: "Service saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveServiceDetailsLoading: false });
      throw error;
    }
  },
}));
