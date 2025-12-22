import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useOfflineRefundStore = create((set) => ({
  // Save Banner details
  OfflineRefundDetails: [],
  isOfflineRefundDetailsLoading: false,
  saveOfflineRefundDetails: async (OfflineRefundData) => {
    set({ isOfflineRefundDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.OFFLINE_REFUND.ADD_NEW_OFFLINE_REFUND;
      // Prepare form data

      response = await apiService.uploadFile(url, OfflineRefundData.file, OfflineRefundData);
      set({
        OfflineRefundDetails: response.data,
        isOfflineRefundDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({ isOfflineRefundDetailsLoading: false });
      throw error;
    }
  },
}));
