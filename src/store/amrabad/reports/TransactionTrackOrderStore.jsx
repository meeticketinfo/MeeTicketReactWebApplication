import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useAmrabadTrackOrderStore = create((set) => ({
    AmrabadTransactionTrackingStatusByOrderIdData: [],
    isFetchAmrabadTransactionTrackingStatusByOrderId: false,

    fetchAmrabadTransactionTrackingStatusByOrderId: async (orderID) => {
        set({ isFetchAmrabadTransactionTrackingStatusByOrderId: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.AMRABAD.REPORTS.GET_TRANSACTION_TRACK_ORDER}?orderId=${orderID}`
            );
            set({
                AmrabadTransactionTrackingStatusByOrderIdData: response.data,
            });
            return { response: response.data }
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchAmrabadTransactionTrackingStatusByOrderId: false,
            })
        }
    },
}));
