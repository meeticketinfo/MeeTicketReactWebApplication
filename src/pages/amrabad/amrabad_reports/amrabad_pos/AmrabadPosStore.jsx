import { create } from "zustand";

import { toast } from "react-toastify";
import apiService from "../../../../services/apiService";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useAmrabadPosStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Intercity ticket view
  AmrabadPosReportData: [],
  isFetchAmrabadPosReportData: false,
  fetchAmrabadPosReportData: async (payload) => {
    set({ isFetchAmrabadPosReportData: true });
    try {
      const params = `fromDate=${payload.fromDate}&toDate=${payload.toDate}&adminMobile=${payload.adminMobileNumber}&vehicleTypeId=${payload.ticketType}&paymentType=${payload.paymentMode}&transactionStatus=${payload.transactionStatus}&vehicleNumber=${payload.vehicleNumber}&userMobile=${payload.userMobileNumber}&pageNumber=${payload.pageNumber}&pageSize=${payload.PageSize}`;
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.AMRABAD.REPORTS.GET_POS_REPORT}?${params}`
      );
      set({
        AmrabadPosReportData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        AmrabadPosReportData: [],
      });
    } finally {
      set({
        isFetchAmrabadPosReportData: false,
      });
    }
  },
  //   POS VEHICLE TYPES
  AmrabadPosVehicleTypesData: [],
  isFetchAmrabadPosVehicleTypesData: false,
  fetchAmrabadPosVehicleTypesData: async (payload) => {
    set({ isFetchAmrabadPosVehicleTypesData: true });
    try {
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.AMRABAD.REPORTS.GET_POS_VEHICLE_TYPES}`
      );
      set({
        AmrabadPosVehicleTypesData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        AmrabadPosVehicleTypesData: [],
      });
    } finally {
      set({
        isFetchAmrabadPosVehicleTypesData: false,
      });
    }
  },
}));
