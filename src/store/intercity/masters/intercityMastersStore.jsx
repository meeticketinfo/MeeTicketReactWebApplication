import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";


export const useIntercityMastersStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // GET RTC TRACK ORDER
  CitiesData: [],
  isCities: false,
  fetchCitiesData: async (p = "") => {
    set({ isCities: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.INTERCITY.MASTERS.GET_DESTINATION_CITIES}?pageNumber=1&pageSize=100&search=${p}`
      );
      set({
        CitiesData: response.data.result,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        isCities: response.data,
        CitiesData:[]
      });
    } finally {
      set({
        isCities: false,
      });
    }
  },
    // Intercity bus types
    IntercityBusTypesData: [],
    isFetchIntercityBusTypesData: false,
    fetchIntercityBusTypesData: async (payload) => {
      set({ isFetchIntercityBusTypesData: true });
      try {
        const method = "get";
        const response = await apiService[method](
          `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_BUS_TYPES}`
        );
        set({
          IntercityBusTypesData: response.data,
        });
        return { response: response.data };
      } catch (error) {
        toast.error(error.message);
        set({
          error: error.message,
          IntercityBusTypesData: [],
        });
      } finally {
        set({
          isFetchIntercityBusTypesData: false,
        });
      }
    },
    // Intercity Layout
    IntercitySeatLayoutsData: [],
    isFetchIntercitySeatLayoutsData: false,
    fetchIntercitySeatLayoutsData: async (payload) => {
      set({ isFetchIntercitySeatLayoutsData: true });
      try {
        const method = "get";
        const response = await apiService[method](
          `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_SEAT_LAYOUTS}`
        );
        set({
          IntercitySeatLayoutsData: response.data,
        });
        return { response: response.data };
      } catch (error) {
        toast.error(error.message);
        set({
          error: error.message,
          IntercitySeatLayoutsData: [],
        });
      } finally {
        set({
          isFetchIntercitySeatLayoutsData: false,
        });
      }
    },
}));
