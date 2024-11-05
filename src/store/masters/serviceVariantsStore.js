import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useServiceVariantStore = create((set) => ({
  allServiceVariants: [],
  ServiceDetails: [],
  isSaveServiceDetailsLoading: false,
  isFetchServiceDetailsLoading: false,
  isFetchAllServiceVariantsLoading: false,
  fetchServiceDetailsError: null,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Services
  fetchAllServiceVariants: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllServiceVariantsLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.SERVICE_VARIANT.GET_SERVICE_VARIANTS}`
      );
      console.log(response);

      set({
        allServiceVariants: response.data,
        isFetchAllServiceVariantsLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllServiceVariantsLoading: false });
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
  saveServiceVarientDetails: async (ServiceData, isUpdate = false) => {
    set({ isSaveServiceDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.Service.UPDATE_Service_DETAILS
        : API_ENDPOINTS.MASTERS.SERVICE_VARIANT.ADD_NEW_SERVICE_VARIENT;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, ServiceData);

      set({
        ServiceDetails: response.data,
        isSaveServiceDetailsLoading: false,
        success: "Service Varient saved successfully.",
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.message, isSaveServiceDetailsLoading: false });
      throw error;
    }
  },
}));
