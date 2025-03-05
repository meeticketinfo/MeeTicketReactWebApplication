import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useServiceVariantStore = create((set) => ({
  allServiceVariants: [],
  ServiceDetails: [],
  isSaveServiceVarientDetailsLoading: false,
  isFetchServiceDetailsLoading: false,
  isFetchAllServiceVariantsLoading: false,
  fetchServiceDetailsError: null,
  error: null,
  success: null,
  ServiceVariantEditDetails: {},

  setCurrentServiceVariantEditDetails: (ServiceVariantEditDetails) => {
    set({
      ServiceVariantEditDetails,
    });
  },

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Services
  fetchAllServiceVariants: async () => {
    set({ isFetchAllServiceVariantsLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.SERVICE_VARIANT.GET_SERVICE_VARIANTS}`
      );

      set({
        allServiceVariants: response.data,
        isFetchAllServiceVariantsLoading: false,
      });
    } catch (error) {
      set({ isFetchAllServiceVariantsLoading: false });
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
  saveServiceVarientDetails: async (ServiceData, role, isUpdate = false) => {
    set({ isSaveServiceVarientDetailsLoading: true });
    try {
      const url = isUpdate
        ? role === "ROLE_NODALOFFICER"
          ? API_ENDPOINTS.MASTERS.SERVICE_VARIANT
              .UPDATE_SERVICE_VARIENT_DETAILS_NODAL_OFFICER
          : API_ENDPOINTS.MASTERS.SERVICE_VARIANT.UPDATE_SERVICE_VARIENT_DETAILS
        : role === "ROLE_NODALOFFICER"
        ? API_ENDPOINTS.MASTERS.SERVICE_VARIANT
            .ADD_NEW_SERVICE_VARIENT_NODAL_OFFICER
        : API_ENDPOINTS.MASTERS.SERVICE_VARIANT.ADD_NEW_SERVICE_VARIENT;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, ServiceData);

      set({
        ServiceDetails: response.data,
        isSaveServiceVarientDetailsLoading: false,
        success: "Service Varient saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveServiceVarientDetailsLoading: false });
      throw error;
    }
  },
}));
