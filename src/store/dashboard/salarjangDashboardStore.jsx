import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const UseSalarjangDashboardStore = create((set) => ({
  // Packages Data
  SalarjungMuseumDashBoardCountData: [],
  isSalarjungMuseumDashBoardCountLoading: false,

  //  -----------------API CALLS------------------------------------------------------

  // Fetch all packages report data
  fetchSalarjungMuseumDashBoardCount: async ({ fromDate, toDate }) => {
    const params = `?FromDate=${fromDate}&ToDate=${toDate}`;
    set({ isSalarjungMuseumDashBoardCountLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.DASHBOARD.GET_SALARJUNG_MUSEUM_DASHBOARD_COUNTS}${params}`
      );

      set({
        SalarjungMuseumDashBoardCountData: response.data.data,
        isSalarjungMuseumDashBoardCountLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isSalarjungMuseumDashBoardCountLoading: false,
      });
    }
  },
}));
