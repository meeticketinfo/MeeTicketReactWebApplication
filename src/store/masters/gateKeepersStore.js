import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const gateKeepersStore = create((set) => ({
  allGateKeepers: [],
  isSaveGateKeeperDetailsLoading: false,
  isFetchAllGateKeepersLoading: false,
  allScannedGateKeepers: [],
  isFetchAllScannedGateKeepersLoading: false,
  error: null,
  success: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all Bookings
  fetchAllGateKeepers: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllGateKeepersLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.GateKeeper.GET_GateKeeperS}`
      );
      console.log(response);

      set({
        allGateKeepers: response.data,
        isFetchAllGateKeepersLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllGateKeepersLoading: false });
    }
  },
  // Fetch all Bookings
  fetchAllScannedGateKeepers: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {}
  ) => {
    set({ isFetchAllScannedGateKeepersLoading: true });
    try {
      //   const filterString = useBookingstore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_Bookings}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.SCANNED_GateKeeper.GET_SCANNED_GateKeeperS}`
      );
      console.log(response);

      set({
        allScannedGateKeepers: response.data,
        isFetchAllScannedGateKeepersLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllScannedGateKeepersLoading: false });
    }
  },

  saveGateKeeperDetails: async (GateKeeperData, isUpdate = false) => {
    set({ isSaveGateKeeperDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.PARK.UPDATE_PARK_DETAILS
        : API_ENDPOINTS.MASTERS.GATE_KEEPER.ADD_NEW_GATE_KEEPER;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, GateKeeperData);

      set({
        GateKeeperDetails: response.data,
        isSaveGateKeeperDetailsLoading: false,
        success: "GateKeeper saved successfully.",
      });

      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isSaveGateKeeperDetailsLoading: false });
      throw error;
    }
  },
}));
