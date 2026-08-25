import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";


export const useIntercityMastersStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // GET RTC TRACK ORDER
  CitiesData: [],
  loadingCities: false,
  isCities: false,
  fetchCitiesData: async (p = "") => {
    set({ isCities: true });
    set({ loadingCities: true });
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
        CitiesData: []
      });
    } finally {
      set({
        isCities: false,
        loadingCities: false,
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
        IntercityBusTypesData: response.data.result,
      });
      return { response: response.data.result };
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
        IntercitySeatLayoutsData: response.data.result,
      });
      return { response: response.data.result };
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
  // Mavenconnect Routes
  departureStages: [],
  arrivalStages: [],
  intercityStageNames: [],
  isFetchRoutes: false,
  fetchMavenRoutes: async () => {
    set({ isFetchRoutes: true });
    try {
      const response = await apiService.get(
        API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_ROUTES,
        {},
        { token: "AmxsG7zkJB" }
      );

      let routesList = [];
      if (response?.data?.Data) {
        const parsed =
          typeof response.data.Data === "string"
            ? JSON.parse(response.data.Data)
            : response.data.Data;
        routesList = Array.isArray(parsed)
          ? parsed
          : parsed?.Table || parsed?.table || [];
      } else if (Array.isArray(response?.data)) {
        routesList = response.data;
      } else if (Array.isArray(response?.data?.result)) {
        routesList = response.data.result;
      }

      const departureStagesMap = new Map();
      const arrivalStagesMap = new Map();
      const stageNames = new Set();

      routesList.forEach((item) => {
        if (item.FromStageName) {
          stageNames.add(item.FromStageName);
        }
        if (item.ToStageName) {
          stageNames.add(item.ToStageName);
        }
        if (item.FromStageID && !departureStagesMap.has(item.FromStageID)) {
          departureStagesMap.set(item.FromStageID, {
            FromStageID: item.FromStageID,
            FromStageName: item.FromStageName,
          });
        }
        if (item.ToStageID && !arrivalStagesMap.has(item.ToStageID)) {
          arrivalStagesMap.set(item.ToStageID, {
            ToStageID: item.ToStageID,
            ToStageName: item.ToStageName,
          });
        }
      });

      const departureStages = Array.from(departureStagesMap.values());
      const arrivalStages = Array.from(arrivalStagesMap.values());
      const intercityStageNames = Array.from(stageNames).sort((a, b) =>
        a.localeCompare(b)
      );

      set({
        departureStages,
        arrivalStages,
        intercityStageNames,
      });

      return { departureStages, arrivalStages, intercityStageNames };
    } catch (error) {
      console.error("Error fetching routes:", error);
      set({
        departureStages: [],
        arrivalStages: [],
        intercityStageNames: [],
      });
    } finally {
      set({ isFetchRoutes: false });
    }
  },
}));
