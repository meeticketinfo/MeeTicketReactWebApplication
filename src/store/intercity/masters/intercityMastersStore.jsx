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
}));
