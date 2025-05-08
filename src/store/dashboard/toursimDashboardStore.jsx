import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const usetoursimDashboardStore = create((set) => ({
  // Packages Data
  allPackagesData: null,
  isFetchAllPackagesDataLoading: false,

  // All Pie Chart PackagesData
  allPieChartPackagesData: null,
  isFetchAllPieChartPackagesDataLoading: false,

  // Package Categories
  allPackageCategoriesData: null,
  isFetchallPackageCategoriesDataLoading: false,

  //   transaction reports

  allPackageTransactionReportData: null,
  isFetchallPackageTransactionReportDataLoading: false,

  //  -----------------API CALLS------------------------------------------------------
  // Fetch all CATOGRIE WISE TOTAL COUNT
  fetchallPackagesData: async ({
    fromDate,
    toDate,
    TypeId,
    ticketType,
    active,
  }) => {
    const date = active
      ? `?startDate=${fromDate}&endDate=${toDate}&TypeId=${TypeId}&ticketType=${ticketType}`
      : "";
    set({ isFetchAllPackagesDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.TOURSIM_DASHBOARD.GET_CATEGORY_WISE_TOTALCOUNTS}${date}`
      );

      set({
        allPackagesData: response.data,
        isFetchAllPackagesDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllPackagesDataLoading: false });
    }
  },
  // pie chart
  fetchallPieChartPackagesData: async ({
    fromDate,
    toDate,
    TypeId,
    ticketType,
    active,
  }) => {
    const date = active
      ? `?startDate=${fromDate}&endDate=${toDate}&TypeId=${TypeId}&ticketType=${ticketType}`
      : "";
    set({ isFetchAllPassDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.TOURSIM_DASHBOARD.GET_PACKAGE_TYPE_WISE_BOOKINGS}${date}`
      );

      set({
        allPieChartPackagesData: response.data,
        isFetchAllPieChartPackagesDataLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchAllPieChartPackagesDataLoading: false,
      });
    }
  },
  // Fetch all packages report data
  fetchallPackageTransactionReportData: async ({ fromDate, toDate }) => {
    const params =  `?startDate=${fromDate}&endDate=${toDate}`;
    set({ isFetchallPackageTransactionReportDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.TOURSIM_DASHBOARD.GET_TRANSACTIONS_REPORTS}${params}`
      );
     
      set({
        allPackageTransactionReportData: response.data,
        isFetchallPackageTransactionReportDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchallPackageTransactionReportDataLoading: false });
    }
  },

  //   Package Categories dropdown
  fetchallPackageCategoriesData: async () => {
    set({ isFetchAllPassTypeDataLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.TOURSIM_DASHBOARD.GET_PACKAGE_CATEGORY_COUNTS}`
      );

      set({
        allPackageCategoriesData: response.data,
        isFetchallPackageCategoriesDataLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isFetchAllPassTypeDataLoading: false });
    }
  },
}));
