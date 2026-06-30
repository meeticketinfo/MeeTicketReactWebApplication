import { create } from "zustand";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useWalkersPassReportStore = create((set) => ({
  WalkersPassReportData: [],
  totalCount: 0,
  walkersPassReportFilters: null,
  isFetchWalkersPassReportData: false,
  isViewPassBulkLoading: false,

  fetchWalkersPassReportData: async (payload) => {
    console.log("Request Payload:", payload);
    set({
      isFetchWalkersPassReportData: true,
    });

    try {
      const requestPayload = {
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        passTypeId: payload.passTypeId || null,
        subFacilityId: payload.subFacilityId || null,
        status: payload.status || null,
        pageNumber: payload.pageNumber || 1,
        pageSize: payload.PageSize || payload.pageSize || 50000,
      };

      console.log("Final Payload:", requestPayload);
      set({ walkersPassReportFilters: requestPayload });

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.WALKERS_PASS_REPORT.GET_WALKERS_PASS_REPORT,
        requestPayload
      );

      console.log(
        "Returned Records:",
        response.data.data.map(item => ({
          UserName: item.UserName,
          BookingDate: item.BookingDate,
          ValidityStartDate: item.ValidityStartDate
        }))
      );

      set({
        WalkersPassReportData: Array.isArray(response.data?.data)
          ? response.data.data
          : [],
        totalCount: response.data?.count || 0,
      });

      return response.data;
    } catch (error) {
      toast.error(error.message);

      set({
        WalkersPassReportData: [],
        totalCount: 0,
      });
    } finally {
      set({
        isFetchWalkersPassReportData: false,
      });
    }
  },

  viewPassBulk: async (passUserDetailsIds) => {
    set({
      isViewPassBulkLoading: true,
    });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.WALKERS_PASS_BOOKING.VIEW_PASS_BULK,
        { passUserDetailsIds }
      );

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      throw error;
    } finally {
      set({
        isViewPassBulkLoading: false,
      });
    }
  },
}));